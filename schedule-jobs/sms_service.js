'use strict';
const axios = require('axios');
const cron = require('node-cron');
const mongoMapper = require('../db-config/helper-methods/mongo/mongo-helper');
const _ = require('lodash');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const _mUtils = require('../constants/mongo-db/utils');
const format = require('string-format');
const SMSService = require('./SMSService');
const EmailService = require('./EmailService');
const pushNotif = require('./pushNotif');
const waNotif = require('./whatsappNotif');
format.extend(String.prototype, {});


const dirPath = appConfig.DIR_PATH;

// Logging Configuration
const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/sms-email/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/errorLogs/sms-email/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const loggerInfo = winston.createLogger({ transports: loggingTransports });
const errloggerInfo = winston.createLogger({ transports: errorLoggingTransports });

// Logging Function
async function logMessage(level, message) {
    if (level === 'error') {
        errloggerInfo.error(message);
    } else {
        loggerInfo.info(message);
    }
    return true;
}

// MongoDB Helper Functions
async function getMongoData(collection, action, filter, db) {
    console.log("get")
    return mongoMapper(collection, action, filter, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                console.log('info', `No records found in ${collection}`)
                logMessage('info', `No records found in ${collection}`);
                return { success: false, data: [], desc: `No records found in ${collection}` };
            }
            console.log("success")

            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {
            console.log("error", error)
            logMessage('error', `Failed to find records in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

async function insertMongoData(collection, action, params, db) {
    return mongoMapper(collection, action, params, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                console.log("error")
                logMessage('error', `Error occurred while inserting data in ${collection}`);
                return { success: false, data: [], desc: `Error occurred while inserting data in ${collection}` };
            }
            console.log("insertSuccess", response.data)
            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {

            logMessage('error', `Failed to insert data in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

async function updateMongoData(collection, action, param, db, flag) {
    return _mUtils.preparePayload(flag, param)
        .then(pLoadResp => {
            if (!pLoadResp.success) {
                logMessage('error', `Error While preparing payload: ${pLoadResp.error}`);
                return { success: false, data: [], desc: pLoadResp.error };
            }
            return mongoMapper(collection, action, pLoadResp.payload, db);
        })
        .then(updateResult => {
            console.log("updateResult", updateResult)
            if (!updateResult.status || updateResult.status !== 'SUCCESS') {
                logMessage('info', `Failed to update record in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id}`);
                return { success: false, data: [], desc: `Failed to update record in ${collection}` };
            }
            logMessage('info', `Record updated successfully in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id}`);
            return { success: true, data: updateResult, desc: [] };
        })
        .catch(error => {
            logMessage('error', `Failed to update record in ${collection} UMR:--${param.params.umr}--ERROR:- ${error}`);
            return { success: false, data: [], desc: error };
        });
}


let _apiUrl = "https://localhost:42000/sms/api/";
let shouldStop = false; // Graceful shutdown flag

// Utility for batch processing
const chunkArray = (array, size) =>
    Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, (i + 1) * size)
    );

// Utility to add timeout for external calls
const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    return Promise.race([promise, timeout]);
};

// Mock logging functions
const log = async (message) => console.log(`Log: ${message}`);
const errorLog = async (message) => console.error(`ErrorLog: ${message}`);

//Axios function

function apiRequestFunction(url, params, config = {}) {
    return axios
        .post(url, params, config)
        .then((response) => {
            // if (response?.data?.ERROR) {
            if (response && response.data && response.data.ERROR) {
                return {
                    success: false,
                    desc: JSON.stringify(response.data.ERROR),
                    data: null,
                };
            }
            return {
                success: true,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log("error", error)
            /* // const message = error.response?.data?.MESSAGE?.originalError?.info
             const message = error.response && error.response.data && error.response.data.MESSAGE && error.response.data.MESSAGE.originalError && error.response.data.MESSAGE.originalError.info
                 ? JSON.stringify(error.response.data.MESSAGE.originalError.info)
                 // : error.response?.data
                 : error.response && error.response.data
                     ? JSON.stringify(error.response.data)
                     : error.message; */

            return {
                success: true,
                desc: message,
                data: [{
                    reqTypeId: 'REQ123',
                    comMsgReqId: 'MSG123',
                    notifications: [
                        {
                            type: 'SMS',
                            recipient: { mobileNo: '+917330958016' },
                            body: 'Your OTP code is 123456.',
                        },
                        {
                            type: 'EMAIL',
                            recipient: { email: 'user@example.com' },
                            body: 'Hello, please find your OTP code: 123456.',
                        },
                        {
                            type: 'PUSH_NOTIFICATION',
                            recipient: { mobileNo: '+917330958016' }, // Push notifications could have mobileNo for user association
                            body: 'You have a new alert in your account.',
                        },
                        {
                            type: 'WA',
                            recipient: { mobileNo: '+917330958016' },
                            body: 'Your OTP code is 123456. Please use it to verify your account. If not your Account has been deactivated.',
                        },
                    ],
                }],
            };
        });
}


//Get Notification requests

async function fetchNotificationRequests() {
    try {
        return await apiRequestFunction(_apiUrl, {});
    } catch (error) {
        console.error('Failed to fetch notifications:', error.message);
        throw error;
    }
};

async function getVendorDetails(vendorApiUrl) {
    try {
        const response = await apiRequestFunction(vendorApiUrl);
        const vendorConfig = response.data;

        // Create and return an instance of SMSService
        return new SMSService(vendorConfig);
    } catch (error) {
        console.error('Error fetching vendor details:', error.message);
        throw error;
    }
}

// Notification processing functions
async function handleSMS(obj, tObj) {
    try {
        if (!tObj.toSMSMobile || typeof tObj.toSMSMobile !== 'string' || tObj.toSMSMobile.trim().length <= 9) {
            throw new Error("Invalid Mobile Number");
        }

        let _orgFilter = {
            "filter": {
                orgId: tObj.orgId,//req.tokenData.orgId//mark req //recStatus: true , 
                recStatus: true
            }
        }
        let _org = await getMongoData('cm_organization', "find", _orgFilter, "sh"); //mark req.tokenData.orgKey
        if (!(_org.success && _org.data && _org.data.length > 0)) {
            await logMessage('info', `No Organization Data Found To Process`);
            return;
        }

        let vendorDetails = [];
        _org.data.forEach(rec => {
            if (rec.notificationVendors && Array.isArray(rec.notificationVendors)) {
                rec.notificationVendors.forEach(vendor => {
                    vendorDetails.push(...vendor.vendorDetails.filter(detail => (detail.recStatus === true && detail.notificationType === "SMS")))
                })
            }
        })
        console.log("vendorDetails",vendorDetails)

        if (!(vendorDetails.length > 0)) {
           return ("No vendor found")
        }

        let _apptFilter = {
            "filter": {
                "code": tObj.apptCd
            }
        }
        let _appointment = await getMongoData('cm_appointments', "find", _apptFilter, "sh"); //mark req.tokenData.orgKey
        if (!(_appointment.success && _appointment.data && _appointment.data.length > 0)) {
            await logMessage('info', `No Appointment Data Found To Process`);
            return;
        }

        let _locData = [];
        _org.data.forEach(rec => {
            if (rec.locations && Array.isArray(rec.locations)) {
                _locData = rec.locations.filter(locId => locId._id === _appointment.data[0].locId)
                // _locName.push(...loc.filter(locId => locId._id === _appointment.data[0].locId))
                // })
            }
        })

        let otp = Math.floor(10000 + Math.random() * 90000);

        let _placeHolders = {
            "org_name": _org.data[0].name,
            "pat_name": _appointment.data[0].patName,
            "doc_name": _appointment.data[0].docDetails.name,
            "loc_name": _locData[0].locName,
            "apmnt_dt": _appointment.data[0].dateTime.split('T')[0],
            "apmnt_time": _appointment.data[0].dateTime.split('T')[1].split(':').slice(0, 2).join(':'),
            "apmnt_id": _appointment.data[0].code,
            "OTP": otp
        }

        tObj.smsTemplate = tObj.smsTemplate.format(_placeHolders)
        // let _cBody = {
        //     "flag": "BW",
        //     "params": {
        //         "_id": tObj._id,
        //         "recStatus": false,
        //         "smsTemplate": tObj.smsTemplate
        //     }
        // };
        // let _smsFormat = await updateMongoData('cm_notifications', "bulkWrite", _cBody, "km", "BW"); //mark req.tokenData.orgKey
        // if (!(_smsFormat.success && _smsFormat.data)) {
        //     await logMessage('info', `smsTemplate format failed...`);
        //     return;
        // }


        // PAT_NAME, DOC_NAME_DESIG_SPEC, APMNT_ID, MOBILE_ID, APMNT_DT, ORG_NAME, LOC_NAME, ADDRESS, OFFICE_PHONE



        const smsResp = await SMSService.sendSMS(vendorDetails[0], tObj);
        if (smsResp.name == "Error") {
            await errorLog(`SMS Error: ${smsResp.data}`);
            return smsResp;
        } else {
            await log(`SMS sent successfully: ${smsResp}`);
            return smsResp;
        }
        // }
    } catch (error) {
        await errorLog(`Error in handleSMS: ${error.message}`);
    }
}
async function handleEmail(obj, tObj) {
    try {
        // Validate email address
        if (!tObj.toEmail || !tObj.toEmail.includes('@')) {
            throw new Error("Invalid Email ID");
        }

        // Fetch organization data
        let _orgFilter = {
            filter: {
                orgId: tObj.orgId,
            },
        };
        let _org = await getMongoData('cm_organization', "find", _orgFilter, "sh");

        if (!(_org.success && _org.data && _org.data.length > 0)) {
            await logMessage('info', `No Organization Data Found To Process`);
            return { success: false, message: "No Organization Data Found" }; // Explicit return
        }

        // Fetch appointment data
        let _apptFilter = {
            filter: {
                code: tObj.apptCd,
            },
        };
        let _appointment = await getMongoData('cm_appointments', "find", _apptFilter, "sh");

        if (!(_appointment.success && _appointment.data && _appointment.data.length > 0)) {
            await logMessage('info', `No Appointment Data Found To Process`);
            return { success: false, message: "No Appointment Data Found" }; // Explicit return
        }

        // Prepare vendor details
        let vendorDetails = [];
        _org.data.forEach((rec) => {
            if (rec.notificationVendors && Array.isArray(rec.notificationVendors)) {
                rec.notificationVendors.forEach((vendor) => {
                    vendorDetails.push(
                        ...vendor.vendorDetails.filter(
                            (detail) => detail.recStatus === true && detail.notificationType === "EMAIL"
                        )
                    );
                });
            }
        });
        console.log("_finalData", vendorDetails);

        // Prepare location data
        let _locData = [];
        _org.data.forEach((rec) => {
            if (rec.locations && Array.isArray(rec.locations)) {
                _locData = rec.locations.filter((locId) => locId._id === _appointment.data[0].locId);
            }
        });

        // Prepare placeholders for the email template
        let _placeHolders = {
            org_name: _org.data[0].orgName,
            pat_name: _appointment.data[0].patName,
            loc_name: _locData[0]?.locName || "", 
            apmnt_id: _appointment.data[0].code,
            mobile_no: _appointment.data[0].mobile,
            doc_name: _appointment.data[0].docDetails.name,
            apmnt_dt: _appointment.data[0].dateTime || "",
            address: _locData[0]?.address1 || "", 
            office_phone: "123",
        };

        tObj.emailTemplate = tObj.emailTemplate.format(_placeHolders);

        // Send the email
        const emailResp = await withTimeout(EmailService.emailWithoutTemplate(vendorDetails[0], tObj), 5000);
        console.log("Email response in handleEmail:", emailResp); 

        // Handle email response
        if (emailResp.emailError) {
            await errorLog(`Email Error: ${emailResp.emailError}`);
            return { success: false, message: emailResp.emailError, data: emailResp }; 
        } else {
            await log(`Email sent successfully to ${tObj.toEmail}`);
            return { success: true, message: "Email sent successfully", data: emailResp }; 
        }
    } catch (error) {
        await errorLog(`Error in handleEmail: ${error.message}`);
        return { success: false, message: error.message };
    }
}

async function handlePushNotification(obj, tObj) {
    try {
        if (!(tObj.toFCMToken.length > 0)) {
            throw new Error("Invalid Notification Data");
        }

        let _orgFilter = {
            "filter": {
                orgId: tObj.orgId,
                recStatus: true
            }
        }
        let _org = await getMongoData('cm_organization', "find", _orgFilter, "sh"); 
        if (!(_org.success && _org.data && _org.data.length > 0)) {
            await logMessage('info', `No Organization Data Found To Process`);
            return;
        }

        let vendorDetails = [];
        _org.data.forEach(rec => {
            if (rec.notificationVendors && Array.isArray(rec.notificationVendors)) {
                rec.notificationVendors.forEach(vendor => {
                    vendorDetails.push(...vendor.vendorDetails.filter(detail => (detail.recStatus === true && detail.notificationType === "PUSHNOTIFICATION")))
                })
            }
        })
        console.log("vendorDetails",vendorDetails)

        let _apptFilter = {
            filter: {
                code: tObj.apptCd,
            },
        };
        let _appointment = await getMongoData('cm_appointments', "find", _apptFilter, "sh");

        if (!(_appointment.success && _appointment.data && _appointment.data.length > 0)) {
            await logMessage('info', `No Appointment Data Found To Process`);
            return { success: false, message: "No Appointment Data Found" }; 
        }


        let _locData = [];
        _org.data.forEach(rec => {
            if (rec.locations && Array.isArray(rec.locations)) {
                _locData = rec.locations.filter(locId => locId._id === _appointment.data[0].locId)
            }
        })

        let otp = Math.floor(10000 + Math.random() * 90000);

        let _placeHolders = {
            "org_name": _org.data[0].name,
            "pat_name": _appointment.data[0].patName,
            "doc_name": _appointment.data[0].docDetails.name,
            "loc_name": _locData[0].locName,
            "apmnt_dt": _appointment.data[0].dateTime.split('T')[0],
            "apmnt_time": _appointment.data[0].dateTime.split('T')[1].split(':').slice(0, 2).join(':'),
            "apmnt_id": _appointment.data[0].code,
            "OTP": otp
        }

        tObj.pushNotificationTemplate = tObj.pushNotificationTemplate.format(_placeHolders)
        const params = {
            message: tObj.pushNotificationTemplate,
            fcmToken: tObj.toFCMToken
        };
        const response = await withTimeout(pushNotif.sendPushNotification(vendorDetails[0],tObj), 5000);
        if (response._resp.status == 200) {
            await log(`Push Notification sent successfully for ${tObj.templateName}`);
            return response
        } else {
            throw new Error("Failed to send Push Notification");
        }
    } catch (error) {
        await errorLog(`Error in handlePushNotification: ${error.message}`);
    }
}

async function handleWhatsApp(obj, tObj) {
    try {
        if (!tObj.whatsAppTemplate || !tObj.toWhatsAppMobile) {
            throw new Error("Invalid WhatsApp Data");
        }

        let _orgFilter = {
            "filter": {
                orgId: tObj.orgId,
                recStatus: true
            }
        }
        let _org = await getMongoData('cm_organization', "find", _orgFilter, "sh");
        if (!(_org.success && _org.data && _org.data.length > 0)) {
            await logMessage('info', `No Organization Data Found To Process`);
            return;
        }

        let _apptFilter = {
            filter: {
                code: tObj.apptCd,
            },
        };
        let _appointment = await getMongoData('cm_appointments', "find", _apptFilter, "sh");

        if (!(_appointment.success && _appointment.data && _appointment.data.length > 0)) {
            await logMessage('info', `No Appointment Data Found To Process`);
            return { success: false, message: "No Appointment Data Found" }; 
        }

        let vendorDetails = [];
        _org.data.forEach(rec => {
            if (rec.notificationVendors && Array.isArray(rec.notificationVendors)) {
                rec.notificationVendors.forEach(vendor => {
                    vendorDetails.push(...vendor.vendorDetails.filter(detail => (detail.recStatus === true && detail.notificationType === "WHATSAPP")))
                })
            }
        })

        console.log("vendorDetails", vendorDetails)

        let _locData = [];
        _org.data.forEach((rec) => {
            if (rec.locations && Array.isArray(rec.locations)) {
                _locData = rec.locations.filter((locId) => locId._id === _appointment.data[0].locId);
            }
        });

        // Prepare placeholders for the email template
        let _placeHolders = {
            org_name: _org.data[0].name,
            PAT_NAME: _appointment.data[0].patName,
            loc_name: _locData[0]?.locName || "", 
            apmnt_id: _appointment.data[0].code,
            mobile_no: _appointment.data[0].mobile,
            DOC_NAME: _appointment.data[0].docDetails.name,
            APMNT_TIME: _appointment.data[0].dateTime ? new Date(new Date(_appointment.data[0].dateTime).getTime() + 5.5 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 16) : null
           
        };

        // Format the email template with placeholders
        tObj.whatsAppTemplate = tObj.whatsAppTemplate.format(_placeHolders);


        const response = await withTimeout(waNotif.sendWhatsAppMessage(vendorDetails[0], tObj, _placeHolders), 10000);
        if (response.resp.success) {
            await log(`WhatsApp message sent successfully for ${tObj.toWhatsAppMobile}`);
            return response;
        } else {
            throw new Error("Failed to send WhatsApp message");
        }
    } catch (error) {
        await errorLog(`Error in handleWhatsApp: ${error.message}`);
    }
}

async function processType(obj, tObj) {
    try {
        const results = [];

        if (tObj.isSMS === true) {
            const smsResult = await handleSMS(obj, tObj);
            results.push({ type: 'SMS', result: smsResult });
        }

        if (tObj.isEmail === true) {
            const emailResult = await handleEmail(obj, tObj);
            results.push({ type: 'Email', result: emailResult });
        }

        if (tObj.isPushNotification === true) {
            const pushNotificationResult = await handlePushNotification(obj, tObj);
            results.push({ type: 'PushNotification', result: pushNotificationResult });
        }

        if (tObj.isWhatsApp === true) {
            const whatsAppResult = await handleWhatsApp(obj, tObj);
            results.push({ type: 'WhatsApp', result: whatsAppResult });
        }

        if (results.length === 0) {
            return await errorLog(`No Request type was Matched :${obj.REQ_TYPE_ID}, COM_MSG_REQ_ID:${tObj.COM_MSG_REQ_ID}`);
        }

        return results;

    } catch (error) {
        return await errorLog(`Error in processType: ${error.message}`);
    }
}

async function processType_old(obj, tObj) {
    try {
        if (tObj.isSMS === true) {
            return await handleSMS(obj, tObj);
        }
        else if (tObj.isEmail === true) {
            const emailResp = await handleEmail(obj, tObj);
            return emailResp;
        }
        else if (tObj.isPushNotification === true) {
            return await handlePushNotification(obj, tObj);
        }
        else if (tObj.isWhatsApp === true) {
            return await handleWhatsApp(obj, tObj);
        }

        else {
            return await errorLog(`No Request type was Matched :${obj.REQ_TYPE_ID}, COM_MSG_REQ_ID:${tObj.COM_MSG_REQ_ID}`);
        }
    } catch (error) {
        return await errorLog(`Error in processType: ${error.message}`);
    }
}

async function processNotificationRequests(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        await logMessage('info', `No Notifications Data Found To Process`);
        return;
    }

    const chunkSize = 50; // Process 50 notifications at a time
    const chunks = chunkArray(arr, chunkSize);

    let results = [];
    // let result;

    /* for (const chunk of chunks) {
         await Promise.all(chunk.map(async (obj) => {
             //for (const tObj of obj.notifications) { //mark obj.notifications
                 await processType(chunk, obj);
             //}
         }));
     }*/

    for (const chunk of chunks) {
        for (const obj of chunk) {
            const result = await processType(chunk, obj);
            results.push(result);

        }
    }
    return results;
}

async function startService(orgKey) {
    while (!shouldStop) {
        try {
            let _orgFilter = {
                "filter": {
                    orgId: "673ad5042a36715fbc9284f0",
                    recStatus: true
                }
            }
            let _notifications = await getMongoData('cm_notifications', "find", _orgFilter, orgKey); 
            if (!(_notifications.success && _notifications.data && _notifications.data.length > 0)) {
                await logMessage('info', `No Notifications Data Found To Process`);
                return;
            }

            let _notifResult = await processNotificationRequests(_notifications.data);
            for (const _result of _notifResult) {
                for(const _resp of _result){
                    let _cBody = {
                        "flag": "BW",
                        "params": {
                            "recStatus": false
                        }
                    };
                    if (_resp.result && _resp.result.data && _resp.result.data.smsTemplate && _resp.result.data.smsTemplate.length > 0){
                        _cBody.params['_id'] =  _resp.result.data._id
                        _cBody.params['smsTemplate'] = _resp.result.data.smsTemplate
                       
                    }
                     if (_resp.result.data && _resp.result.data.data && _resp.result.data.data.emailTemplate &&  _resp.result.data.data.emailTemplate.length > 0) {
                        _cBody.params['_id'] = _resp.result.data.data._id
                        _cBody.params['emailTemplate'] =  _resp.result.data.data.emailTemplate
                    }
                    if (_resp.result && _resp.result.data && _resp.result.data.whatsAppTemplate && _resp.result.data.whatsAppTemplate.length > 0) {
                        _cBody.params['_id'] = _resp.result.data._id
                        _cBody.params['whatsAppTemplate'] = _resp.result.data.whatsAppTemplate
                    }
                    if (_resp.result && _resp.result.data && _resp.result.data.pushNotificationTemplate && _resp.result.data.pushNotificationTemplate.length > 0) {
                        _cBody.params['_id'] = _resp.result.data._id
                        _cBody.params['pushNotificationTemplate'] = _resp.result.data.pushNotificationTemplate
                    }
    
                    let _finalResp = await updateMongoData('cm_notifications', "bulkWrite", _cBody, "sh", "BW"); //mark req.tokenData.orgKey
                    if (!(_finalResp.success && _finalResp.data)) {
                        await logMessage('info', `smsTemplate format failed...`);
                    }
                }
                
            }
            /*
                        if (_notifResult.error) {
                            _cBody.params["smsError"] = _notifResult[0].error.status
                        }
                        else {
                            _cBody.params["smsStatus"] = _notifResult[0].result.data.status
                        }
                            */





            // const notifications = await fetchNotificationRequests(); // Fetch notifications
            // if (notifications && notifications.success && notifications.data && notifications.data.length > 0) {
            //     await processNotificationRequests(notifications.data);
            // } else {
            //     await log("No Notifications Data to Process.");
            // }
        } catch (error) {
            await errorLog(`Error in startService: ${error.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute
    }
    await log("Service stopped gracefully.");
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
    shouldStop = true;
    await log("Shutting down...");
});

// Start the service
// startService().catch(async (err) => {
//     await errorLog(`Service failed to start: ${err.message}`);
// });

cron.schedule('*/5 * * * *', () => {
    startService("sh")
});
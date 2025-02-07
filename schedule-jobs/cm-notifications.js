const cron = require('node-cron');
const mongoMapper = require('../db-config/helper-methods/mongo/mongo-helper');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const _mUtils = require('../constants/mongo-db/utils');

const dirPath = appConfig.DIR_PATH;

// Logging Configuration
const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/reports/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/errorLogs/reports/%DATE%.log`,
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

async function updateMongoData(collection, param, db) {
    return _mUtils.preparePayload('U', param)
        .then(pLoadResp => {
            if (!pLoadResp.success) {
                logMessage('error', `Error While preparing payload: ${pLoadResp.error}`);
                return { success: false, data: [], desc: pLoadResp.error };
            }
            return mongoMapper(collection, 'findOneAndUpdate', pLoadResp.payload, db);
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

// let _metaData = {
//     UMR: "MB230500009",
//     patName: "Rama Krishna",
//     patMobile: "7787878787",
//     patEmail: "rk@gmail.com",
//     gender: "male",
//     docId: "644a5156057f5674132bbefe",
//     docMobile: "9838932892",
//     docEmail: "dc@gmail.com"
// }
// let _req = {
//     tokenData: {
//         "orgId": "673313b8199c57efb3cfc105",
//         "locId": "673313b8199c57efb3cfc10e",
//     }
// }
// let _notifCd = "NTFC0021"

async function sendNotifications(_metaData, req, _notifCd) {
try{
    
        let _orgFilter = {
            "filter": { recStatus: { $eq: true }, orgKey: req.tokenData.orgKey },
            "selectors": "notificationTemplate notificationVendors"
        }

        let _orgResult = await getMongoData('cm_organization', "find", _orgFilter, req.tokenData.orgKey);
        if (!(_orgResult.success && _orgResult.data && _orgResult.data.length > 0)) {
            await logMessage('info', `No Organizations Found With OrgKey : km`);
            return;
        }
        if (!(_orgResult.data[0].notificationTemplate && _orgResult.data[0].notificationTemplate.length > 0)) {
            await logMessage('info', `No Templates Found With OrgKey : km`);
            return;
        }
        let _templateData = _.filter(_orgResult.data[0].notificationTemplate, (_temp) => { return _temp.notifCd == _notifCd })
        console.log("_templateData", _templateData)
        let _output = []
        let _receivers = ["patient", "doctor"]
        
        if (_templateData && _templateData.length > 0) {
            for (let _template of _templateData) {
                console.log("_template", _template)
                if (_template.templates && _template.templates.length > 0) {
                    for(let _receiver of _receivers){
                        let _insrtNotifPrms = {
                            isSMS: false,
                            isEmail: false,
                            isWhatsApp: false,
                            isPushNotification: false
                        };
                        let _templates =  _.filter(_template.templates, (_tem) => { return _tem.receivers.toLowerCase().includes(`${_receiver}`) })
                        if(_templates.length > 0){
                            for(let _temp of _templates){
                                
                                _insrtNotifPrms['orgId'] = req.tokenData.orgId;
                                _insrtNotifPrms['locId'] = req.tokenData.locId;
                                _insrtNotifPrms['notifCd'] = _template.notifCd;
                                _insrtNotifPrms['receiver'] = _receiver;
                                _insrtNotifPrms['UMR'] = _metaData.UMR || "";
                                _insrtNotifPrms['docId'] = _metaData.docId;
                                _insrtNotifPrms['audit'] = req.body.params.audit
                                _insrtNotifPrms['apptCd'] = _metaData.apptCd;
                                _insrtNotifPrms['templateName'] = _template.templateName;

                                if(_temp.notificationType == "SMS"){
                                    _insrtNotifPrms['isSMS'] = true ,
                                    _insrtNotifPrms['smsTemplate'] = _receiver.toLowerCase() == "patient" ? _temp.patMessageBody : _receiver.toLowerCase() == "doctor" ? _temp.docMessageBody :  "",
                                    _insrtNotifPrms['toSMSMobile'] = _receiver.toLowerCase() == "patient" ? _metaData.patMobile : _receiver.toLowerCase() == "doctor" ? _metaData.docMobile :  "",
                                    _insrtNotifPrms['smsStatus'] = "",
                                    _insrtNotifPrms['smsError'] = "";
                                }
                                else if(_temp.notificationType == "EMAIL"){
                                    _insrtNotifPrms['isEmail'] = true ,
                                    _insrtNotifPrms['emailTemplate'] = _receiver.toLowerCase() == "patient" ? _temp.patMessageBody : _receiver.toLowerCase() == "doctor" ? _temp.docMessageBody :  "",
                                    _insrtNotifPrms['emailSubject'] = _receiver.toLowerCase() == "patient" ? _temp.subject : _receiver.toLowerCase() == "doctor" ? _temp.subject :  "",
                                    _insrtNotifPrms['toEmail'] = _receiver.toLowerCase() == "patient" ? _metaData.patEmail : _receiver.toLowerCase() == "doctor" ? _metaData.docEmail :  "",
                                    _insrtNotifPrms['emailStatus'] = "",
                                    _insrtNotifPrms['emailError'] = "";
                                }
                                else if(_temp.notificationType == "WHATSAPP"){
                                    _insrtNotifPrms['isWhatsApp'] = true,
                                    _insrtNotifPrms['whatsAppTemplate'] = _receiver.toLowerCase() == "patient" ? _temp.patMessageBody : _receiver.toLowerCase() == "doctor" ? _temp.docMessageBody :  "",
                                    _insrtNotifPrms['toWhatsAppMobile'] = _receiver.toLowerCase() == "patient" ? _metaData.patMobile : _receiver.toLowerCase() == "doctor" ? _metaData.docMobile :  "",
                                    _insrtNotifPrms['waStatus'] = "",
                                    _insrtNotifPrms['waError'] = "";
                                }
                                else if(_temp.notificationType == "PUSHNOTIFICATION"){
                                    _insrtNotifPrms['isPushNotification'] = true
                                    _insrtNotifPrms['pushNotificationTemplate'] = _receiver.toLowerCase() == "patient" ? _temp.patMessageBody : _receiver.toLowerCase() == "doctor" ? _temp.docMessageBody :  "",
                                    _insrtNotifPrms['toFCMToken'] = _receiver.toLowerCase() == "patient" ? _metaData.patFcmToken : _receiver.toLowerCase() == "doctor" ? _metaData.docpatFcmToken :  "",
                                    _insrtNotifPrms['pushNotificationStatus'] = "",
                                    _insrtNotifPrms['pushNotificationError'] = "";
                                }
                                let _insrtResp = await insertMongoData('cm_notifications', 'insertMany',_insrtNotifPrms, req.tokenData.orgKey);
                                if (!_insrtResp.success) {
                                    _output.push({success:false, desc: `Error While inserting Notifications against receiver:${_receiver}, notifCd:${_notifCd}`, data:[]})
                                    console.log(`Error While inserting Notificationsagainst receiver:${_receiver}, notifCd:${_notifCd}`)
                                    await logMessage('error', `Error While inserting Notifications against receiver:${_receiver}, notifCd:${_notifCd}`);
                                }
                                else{
                                    _output.push({success:true, desc: `Notifications inserted successfully against receiver:${_receiver}, notifCd:${_notifCd}`, data:[]})
                                    await logMessage('info', `Notifications inserted successfully against receiver:${_receiver}, notifCd:${_notifCd}`);
                                } 
                            }
                        }
                        
                    }
                    // for (let _temp of _template.templates) {
                    //     console.log("_temp", _temp)
                    //     if (_temp.receivers && _temp.receivers.length > 0) {
                    //         _temp.receivers = _temp.receivers.split(",")
                    //         for (let _receiver of _temp.receivers) {
                    //             let _tempData = _.filter()
                    //             _insrtNotifPrms = {
                    //                 orgId: req.tokenData.orgId,
                    //                 locId: req.tokenData.locId,
                    //                 notifCd: _template.notifCd,
                    //                 receiver: _receiver,
                    //                 UMR: _metaData.UMR || "",
                    //                 docId: _metaData.docId,
                    //                 isSMS: _temp.notificationType == "SMS" ? true : false,
                    //                 isEmail: _temp.notificationType == "EMAIL" ? true : false,
                    //                 isWhatsApp: _temp.notificationType == "WHATSAPP" ? true : false,
                    //                 isPushNotification: _temp.notificationType == "PUSHNOTIFICATION" ? true : false,
                    //                 apptCd: _metaData.apptCd,
                    //                 templateName: _template.templateName,
                    //                 smsTemplate: _receiver.trim() == "Patient" && _temp.notificationType == "SMS" ? _temp.patMessageBody : _receiver.trim() == "Doctor" && _temp.notificationType == "SMS" ? _temp.docMessageBody :  "",
                    //                 toSMSMobile: _receiver.trim() == "Patient" && _temp.notificationType == "SMS" ? _metaData.patMobile : _receiver.trim() == "Doctor" && _temp.notificationType == "SMS" ? _metaData.docMobile :  "",
                    //                 smsStatus: "",
                    //                 smsError: "",
                    //                 emailTemplate: _receiver.trim() == "Patient" && _temp.notificationType == "EMAIL" ? _temp.patMessageBody : _receiver.trim() == "Doctor" && _temp.notificationType == "EMAIL" ? _temp.docMessageBody :  "",
                    //                 emailSubject: _receiver.trim() == "Patient" && _temp.notificationType == "EMAIL" ? _temp.subject : _receiver.trim() == "Doctor" && _temp.notificationType == "EMAIL" ? _temp.subject :  "",
                    //                 toEmail: _receiver.trim() == "Patient" && _temp.notificationType == "EMAIL" ? _metaData.patEmail : _receiver.trim() == "Doctor" && _temp.notificationType == "EMAIL" ? _metaData.docEmail :  "",
                    //                 emailStatus: "",
                    //                 emailError: "",
                    //                 whatsAppTemplate: _receiver.trim() == "Patient" && _temp.notificationType == "WHATSAPP" ? _temp.patMessageBody : _receiver.trim() == "Doctor" && _temp.notificationType == "WHATSAPP" ? _temp.docMessageBody :  "",
                    //                 toWhatsAppMobile: _receiver.trim() == "Patient" && _temp.notificationType == "WHATSAPP" ? _metaData.patMobile : _receiver.trim() == "Doctor" && _temp.notificationType == "WHATSAPP" ? _metaData.docMobile :  "",
                    //                 waStatus: "",
                    //                 waError: "",
                    //                 pushNotificationTemplate: _receiver.trim() == "Patient" && _temp.notificationType == "PUSHNOTIFICATION" ? _temp.patMessageBody : _receiver.trim() == "Doctor" && _temp.notificationType == "PUSHNOTIFICATION" ? _temp.docMessageBody :  "",
                    //                 toFCMToken: _receiver.trim() == "Patient" && _temp.notificationType == "PUSHNOTIFICATION" ? _metaData.patFcmToken : _receiver.trim() == "Doctor" && _temp.notificationType == "PUSHNOTIFICATION" ? _metaData.docpatFcmToken :  "",
                    //                 pushNotificationStatus: "",
                    //                 pushNotificationError: "",
                    //                 audit: req.body.params.audit
                    //             }
                    //             let _insrtResp = await insertMongoData('cm_notifications', 'insertMany',_insrtNotifPrms, req.tokenData.orgKey);
                    //             if (!_insrtResp.success) {
                    //                 _output.push({success:false, desc: `Error While inserting Notifications against receiver:${_receiver}, notifCd:${_notifCd}`, data:[]})
                    //                 console.log(`Error While inserting Notificationsagainst receiver:${_receiver}, notifCd:${_notifCd}`)
                    //                 await logMessage('error', `Error While inserting Notifications against receiver:${_receiver}, notifCd:${_notifCd}`);
                    //             }
                    //             else{
                    //                 _output.push({success:true, desc: `Notifications inserted successfully against receiver:${_receiver}, notifCd:${_notifCd}`, data:[]})
                    //                 await logMessage('info', `Notifications inserted successfully against receiver:${_receiver}, notifCd:${_notifCd}`);
                    //             }
                    //         }
                    //     }
                    //     else{
                    //         _output.push({success:false, desc: `No Receivers found against ${_notifCd} code`, data:[]})
                    //     }
                    // }
                }
                else{
                    _output.push({success:false, desc: `No Templates found against ${_notifCd} code`, data:[]})
                }
            }
        }
        else{
            _output.push({success:false, desc: `No Notifications found against ${_notifCd} code`, data:[]})
        }

        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

// cron.schedule('*/30 * * * * *', () => {
//     sendNotifications(_metaData, _req, _notifCd)
// });
module.exports = {
    sendNotifications
}

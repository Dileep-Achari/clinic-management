const cron = require('node-cron');
const mongoMapper = require('../db-config/helper-methods/mongo/mongo-helper');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const _mUtils = require('../constants/mongo-db/utils');
const format = require('string-format');

//const BSON = require('bson')
const dirPath = appConfig.DIR_PATH;
const _orgDetails = require("../routes/mongo/patientcare/constants/organizations");

const sms = require("../constants/sms-email/common");

const _client = {
    "orgId": 1002,
    "locId": 1047,
    "orgKey": "emr",
}

let _pushNotificationUrl = "https://sfcmapi.doctor9.com/{PROJECT_ID}/notification/generic"
let _whatsAppurl = "http://10.10.42.96:8002/napi/wa/api/waMessage";

// Logging Configuration
const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/dashboard/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/errorLogs/dashboard/%DATE%.log`,
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

async function axiosCalls(_url, _params, config) {
    return new Promise((resolve, reject) => {
        _axios.post(_url, _params, config).then((response) => {
            if (response && response.ERROR) {
                resolve({ "success": false, "desc": JSON.stringify(response.Error), "data": null });
            }
            else {
                resolve({ "success": true, "data": response });
            }
        }).catch((ex) => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "success": false, "desc": message, "data": null });
        })
    });
}

// MongoDB Helper Functions
function getMongoData(collection, action, filter, db) {
    return mongoMapper(collection, action, filter, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                logMessage('info', `No records found in ${collection}`);
                return { success: false, data: [], desc: `No records found in ${collection}` };
            }
            return { success: true, data: response.data, desc: [], generatedAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') };
        })
        .catch(error => {
            logMessage('error', `Failed to find records in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

function insertMongoData(collection, action, params, db) {
    return mongoMapper(collection, action, params, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                console.log("error")

                logMessage('error', `Error occurred while inserting data in ${collection}`);
                return { success: false, data: [], desc: `Error occurred while inserting data in ${collection}` };
            }
            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {
            console.log("error", error)
            logMessage('error', `Failed to insert data in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}


function updateMongoData(collection, param, db) {
    return _mUtils.preparePayload('U', param)
        .then(pLoadResp => {
            if (!pLoadResp.success) {
                logMessage('error', `Error While preparing payload: ${pLoadResp.error}`);
                return { success: false, data: [], desc: pLoadResp.error };
            }
            return mongoMapper(collection, 'findOneAndUpdate', pLoadResp.payload, db);
        })
        .then(updateResult => {
            //console.log("updateResult",updateResult)
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


async function dashBoard() {
    let _date = moment().format('YYYY-MM-DD')

    _filter = {
        "filter": [
            {
                $facet: {
                    NewSurgeries: [
                        {
                            $match: {
                                surgeries: {
                                    $elemMatch: {
                                        surgDtTm: { $regex: `^${_date}` }
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                { $regexMatch: { input: "$$surgery.surgDtTm", regex: `^${_date}` } }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    ClosedSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                { $regexMatch: { input: "$$surgery.surgeryClosedDt", regex: `^${_date}` } },
                                                { $eq: ["$$surgery.surgeryClosed", true] },
                                                //{ $eq: ["$$surgery.systemClosed", false]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    SystemClosedSurgeries: [

                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                { $regexMatch: { input: "$$surgery.surgeryClosedDt", regex: `^${_date}` } },
                                                { $eq: ["$$surgery.surgeryClosed", true] },
                                                { $eq: ["$$surgery.systemClosed", true] }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],
                    OpenSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{$regexMatch: {input: "$$surgery.surgeryClosedDt", regex: "^2024-09"}},
                                                { $eq: ["$$surgery.surgeryClosed", false] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],
                    ReopenSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                { $regexMatch: { input: "$$surgery.reqRaisedDt", regex: `^${_date}` } },
                                                { $eq: ["$$surgery.isRequest", true] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    ReopenSurgeriesApproval: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                { $regexMatch: { input: "$$surgery.reqApprovedDt", regex: `^${_date}` } },
                                                { $eq: ["$$surgery.unlockRequest", true] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],

                }
            }
        ]
    }
    let dashBoardResult = await getMongoData('patient_care_patients', 'aggregation', _filter, 'emr');
    //console.log("dashBoardResult", dashBoardResult)
    if (!dashBoardResult.success) {
        await logMessage('error', `Error while getting dashboard data: ${dashBoardResult.desc}`);
        return;
    }
    //let reportSize = BSON.calculateObjectSize(dashBoardResult.data)/(1024 ** 2)
    let _data = _.filter(_orgDetails, (o) => { return o.orgId === _client.orgId });
    let _finalResp = []
    _.each(dashBoardResult.data[0], (_val, _key) => {
        if (_val.length == 0) {
            _val.push({ 'count': 0 })
        }
        let _cd = _.filter(_data[0].reports, (_c) => { return _c.cd == _key })
        _cd[0]['count'] = _val[0].count
        _finalResp.push(_cd[0])
    })
    let _prms = {
        reportType: "Dash Board",
        timePeriod: {
            startDt: `${_date}T00:00:00.000Z`,
            endDt: `${_date}T23:59:59.999Z`
        },
        generatedData: _finalResp,
        //reportSize: reportSize,
        generatedAt: dashBoardResult.generatedAt,
        recStatus: true
    }
    //console.log("_prms", _prms)
    let insertReport = await insertMongoData('patient_care_reports', 'insertMany',_prms, 'emr');
    if (!insertReport.success) {
        console.log(`Error While inserting dashBoard report: ${insertReport.desc}`)
        await logMessage('error', `Error While inserting dashBoard report: ${insertReport.desc}`);
    }

    let _tempFilter = {
        "filter": {
            recStatus: { $eq: true }
        }
    }

    let templates = await getMongoData('patient_care_templates', 'find', _tempFilter, 'emr');
    let _templates = JSON.parse(JSON.stringify(templates))
    //console.log("_templates",_templates)

    for (let template of _templates.data) {
        if (template.receiversRoles && Array.isArray(template.receiversRoles) && template.receiversRoles.length > 0) {
            for (let receiver of template.receiversRoles) {
                let _userFilter = {
                    "filter": {
                        $and:[
                                {"locations.roleId": receiver.roleId},
                                {"locations.roleName": receiver.roleName},
                                {"locations.recStatus": true}
                            ]
                    }
                }
                let users = await getMongoData('patient_care_users', 'find', _userFilter, 'emr');
                //let _users = JSON.parse(JSON.stringify(users))
                //console.log("_users", _users)
                for (let user of users.data) {
                    //console.log("user", user)
                    //console.log("template", template)
                    let _updtPrms = {
                        orgId: template.orgId,
                        locId: template.locId,
                        reqTypeId: template.reqTypeId,
                        isSms: template.isSms,
                        isEmail: template.isEmail,
                        isWhatsApp: template.isWhatsApp,
                        isPushNotification: template.isPushNotification,
                    } 
                    if (template && template.isSms && template.isSms == true) {
                        if (user && user.mobile && (typeof user.mobile === 'string') && (user.mobile = user.mobile.trim()) && user.mobile.length > 9) {
                            console.log("user", user.mobile)
                            if(template && template.smsTemplate && template.smsTemplateId){
                                let smsResp = await sms.smsHelper(template.orgId, template.locId, user.mobile, template.smsTemplate, "", template.smsTemplateId);
                                if(smsResp && smsResp.smsError){
                                    _updtPrms['toMobile'] = user.mobile,
                                    _updtPrms['smsTemplate'] = template.smsTemplate,
                                    _updtPrms['smsStatus'] = smsResp.smsStatus ? smsResp.smsStatus : "",
                                    _updtPrms['smsError'] = smsResp.smsError ? smsResp.smsError: "",
                                    await logMessage('error', `Error while sending SMS, reqTypeId:${template.reqTypeId}, error:-${smsResp.smsError}, locId:-${template.locId} `);
                                }
                                else{
                                    _updtPrms['toMobile'] = user.mobile,
                                    _updtPrms['smsTemplate'] = template.smsTemplate,
                                    _updtPrms['smsStatus'] = smsResp.smsStatus ? smsResp.smsStatus : "",
                                    _updtPrms['smsError'] = smsResp.smsError ? smsResp.smsError: "",
                                    await logMessage('info', `SMS sent successfully to ${user.mobile}, TEMPLATE:- ${template.smsTemplate}, VENDOR URL:-${smsResp.smsUrl}`);
                                }
                        }
                        else{
                            _updtPrms['smsStatus'] = "",
                            _updtPrms['smsError'] = `SMS Template Not Found;`,
                            await logMessage('error', `SMS Template Not Found;`);
                        }
                        }
                        else{
                            _updtPrms['smsStatus'] = "",
                            _updtPrms['smsError'] = `No Mobile Number or in valid mobile number found against the user; USER:${user.dispName}`,
                            await logMessage('error', `No Mobile Number or in valid mobile number found against the user; USER:${user.dispName}`);
                        }
                    }

                    if (template && template.isEmail && template.isEmail == true) {
                        if (user && user.emailID && (typeof user.emailID === 'string') && (user.emailID = user.emailID.trim())) {
                            if(template && template.emailTemplate){
                                
                                //let _count = _.filter(_prms.generatedData, (_g)=>{return template.reqTypeId == _g.displayOrder})
                                //console.log("_count", _count)
                                //console.log("user", user)
                                //console.log("_prms",_prms.generatedData)
                                
                                let _user = JSON.parse(JSON.stringify(user))
                                //_user['count'] = _count[0].count
                                for(let report of _prms.generatedData){
                                    //console.log("report", report)
                                    _user[`${report.cd}_count`] = report.count
                                    
                                }
                                //console.log("user", _user)
                                _emailTemplate = template.emailTemplate.format(_user)
                                //console.log("_template", _emailTemplate)
                                //console.log("_user", _user)
                                let emailResp = await sms.email(template.orgId, template.locId, _user.emailID, _emailTemplate,template.reqDesc  );
                                if(emailResp && emailResp.emailError){
                                    _updtPrms['toEmail'] = _user.emailID,
                                    _updtPrms['emailTemplate'] = _emailTemplate,
                                    _updtPrms['emailStatus'] = emailResp.emailStatus ? emailResp.emailStatus : "",
                                    _updtPrms['emailError'] = emailResp.emailError ? emailResp.emailError: "",
                                    await logMessage('error', `Error while sending Email, reqTypeId:${template.reqTypeId}, error:-${emailResp.emailError}, locId:-${template.locId} `);
                                }
                                else{
                                    _updtPrms['toEmail'] = _user.emailID,
                                    _updtPrms['emailTemplate'] = _emailTemplate,
                                    _updtPrms['emailStatus'] = emailResp.emailStatus ? emailResp.emailStatus : "",
                                    _updtPrms['emailError'] = emailResp.emailError ? emailResp.emailError: "",
                                    await logMessage('info', `Email sent successfully to ${_user.emailID}, TEMPLATE:- ${_emailTemplate},`);
                                }
                            }
                            else{
                                _updtPrms['emailStatus'] = "",
                                _updtPrms['emailError'] = `Email Template Not Found;`,
                                await logMessage('error', `Email Template Not Found;`);
                            }
                            
                        }
                        else{
                            _updtPrms['emailStatus'] = "",
                            _updtPrms['emailError'] = `No Email or in valid Email found against the user; USER:${user.dispName}`,
                            await logMessage('error', `No Email or in valid Email found against the user; USER:${user.dispName}`);
                        }
                    }
                    
                    if(template && template.isPushNotification && template.isPushNotification == true){
                        if(user && user.fcmToken && user.fcmToken.length > 0){
                            console.log("user", user.fcmToken)
                            if(template && template.pushNotificationTitle && template.pushNotificationTemplate){
                                    let title = template.pushNotificationTitle;
                                    let message = template.pushNotificationTemplate;
                                    let fcmTokens = user.fcmToken;
                                    let params = {
                                        title: title,
                                        message: message,
                                        fcmToken: [fcmTokens],
                                        supportData: JSON.stringify({
                                            click_action: "FLUTTER_NOTIFICATION_CLICK"
                                        })
                                    }
                                    let _resp = await axiosCalls(_pushNotificationUrl, params);
                                    if (_resp.success) {
                                        _updtPrms['pushNotificationStatus'] = "SUCCESS",
                                        _updtPrms['pushNotificationError'] = "",
                                        await logMessage('info', `Push Notification Send Successfully`);
                                    }
                                    else if (_resp.desc) {
                                        _updtPrms['pushNotificationStatus'] = "",
                                        _updtPrms['pushNotificationError'] = `eror while sending notification..${_resp.desc}`,
                                        await logMessage('error', `error while sending notification..${_resp.desc}`);
                                    }
                            }
                            else{
                                _updtPrms['pushNotificationStatus'] = "",
                                _updtPrms['pushNotificationError'] = `Templates not found for Push Notification`,
                                await logMessage('error', `Templates found for Push Notification`);
                            }
                        }
                        else{
                            _updtPrms['pushNotificationStatus'] = "",
                            _updtPrms['pushNotificationError'] = `Fcm Token not found against the user; USER:${user.dispName}`,
                            await logMessage('error', `Fcm Token not found against the user; USER:${user.dispName}`);
                        }
                    }

                    if (template && template.isWhatsApp && template.isWhatsApp == true) {
                        if (user && user.WaAuthToken && user.WaAuthToken.length > 0) {
                            let _params = {
                                "toMobile": template.mobile,
                                "templateId": template.waTemplateId,
                                "tempData": template.WaTemplate
                            };
                            let config = {
                                "headers": {
                                    "authtoken": user.WaAuthToken
                                }
                            }
                            let url = _whatsAppurl
                            let resp = await axiosCalls(url, _params, config)
                            if (resp.success) {
                                _updtPrms['WaStatus'] = "SUCCESS",
                                _updtPrms['WaError'] = "",
                                await logMessage('info', `WhatsApp Msg Send Successfully`);
                            }
                            else {
                                _updtPrms['WaStatus'] = "",
                                _updtPrms['WaError'] = `eror while sending WhatsApp Msg..${_resp.desc}`,
                                await logMessage('error', `error while sending WhatsApp Msg..${_resp.desc}`);
                            }
                        }
                        else{
                            _updtPrms['WaStatus'] = "",
                            _updtPrms['WaError'] = `Whatsapp Auth Token not found against the user; USER:${user.dispName}`,
                            await logMessage('error', `Whatsapp Auth Token not found against the user; USER:${user.dispName}`);
                        }
                    }
                    
                    //console.log("_updtPrms", _updtPrms)
                    let _alerts = await insertMongoData('patient_care_alerts', 'insertMany',_updtPrms, 'emr');
                    if (!_alerts.success) {
                        console.log(`Error While inserting dashBoard report: ${_alerts.desc}`)
                        await logMessage('error', `Error While inserting dashBoard report: ${_alerts.desc}`);
                    }
                    }
                }
            }
            else {
                await logMessage('info', `No Receivers Found in Templates`);
            }
        }
}


cron.schedule('0 18 * * *', () => {
    dashBoard()
});

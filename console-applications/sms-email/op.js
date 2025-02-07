const format = require('string-format');
const axios = require("../../services/axios");
const appConfig = require("../../app-config");
const winston = require("../../services/winston")("smsEmail/op");
const slack = require("../../services/slack");
const smsEmail = require("../../constants/sms-email/common");
const utilsDate = require("../../utilities/dates");

format.extend(String.prototype, {});

const enableConsole = true;
const apiUrl = appConfig.OP_SMS_EMAIL_URL;
const reRunInSec = 1;

let runOnlyOnce = false;
let isCompletedProcess = false;

process
    .once('SIGTERM', exit)
    .once('SIGINT', exit)
    .once('SIGUSR1', exit)
    .once('SIGUSR2', exit)
    .once('SIGHUP', exit);// fire when console window closed

process.on('uncaughtException', async (error) => {
    log("uncaughtException", error.message, null, true);
    process.exit(0);
})

let interval;

function kill() {
    if (isCompletedProcess) {
        if (interval) clearTimeout(interval);
        log("kill:current running process completed");
        process.exit(0);
    }
    interval = setTimeout(() => {
        kill();
    }, 1000);
}

async function exit() {
    runOnlyOnce = true;
    log("                                                                                                   ");
    log("                                                                                                   ");
    log("kill:service stop signal received.....");
    log("kill:wait for current running process complete");
    if (isCompletedProcess) {
        log("kill:current running process completed");
        process.exit(0);
    }
    else {
        kill();
    }
}

async function log(message, error, locId, slackEnable) {
    let obj = {};
    if (message) obj.DATA = (typeof message === 'string' ? message : JSON.stringify(message));
    if (error) obj.ERROR = (typeof error === 'string' ? error : JSON.stringify(error));
    if (locId) obj.LOC_ID = locId;
    if (slackEnable) obj.HOST = "op sms email doc9";
    winston.info({ "date": utilsDate.currentDate(12), "message": obj });
    if (enableConsole) console.log(JSON.stringify(obj));
    if (slackEnable) await slack(JSON.stringify(obj));
    return true;
}

function getAllTypes() {
    return new Promise((resolve, reject) => {
        axios.post(apiUrl + "getAllTypes", {}).then((response) => {
            if (response && response.ERROR) resolve({ "typesArr": null, "typesError": JSON.stringify(response) });
            else resolve({ "typesArr": response, "typesError": null });
        }).catch((ex) => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "typesArr": null, "typesError": message });
        })
    });
}


function getTypeById(reqTypeId, method) {
    return new Promise((resolve, reject) => {
        axios.post(apiUrl + method, { "REQ_TYPE_ID": reqTypeId }).then((response) => {
            if (response && response.ERROR) resolve({ "typeIdArr": null, "typeIdError": JSON.stringify(response) });
            else resolve({ "typeIdArr": response, "typeIdError": null });
        }).catch((ex) => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "typeIdArr": null, "typeIdError": message });
        })
    });
}


function updateStatusUnformatted(comMsgObj, reqTypeId) {
    try {
        let params = {
            "REQ_TYPE_ID": reqTypeId,
            "COM_MSG_REQ_ID": comMsgObj.COM_MSG_REQ_ID,
            "STATUS": comMsgObj.RECORD_STATUS,
            "MOB_MSG_TPL": comMsgObj.MOB_TEMPLATE || null,
            "EMAIL_MSG_TPL": comMsgObj.EMAIL_TEMPLATE || null,
            "IS_MOBILE": comMsgObj.IS_MOBILE || null,
            "IS_EMAIL": comMsgObj.IS_EMAIL || null,
            "TO_MOBILE_NO": comMsgObj.MOBILE_NO || null,
            "TO_EMAIL": comMsgObj.EMAIL_ID || null,
            "ERROR_DESC": comMsgObj.ERROR_DESC ? JSON.stringify(comMsgObj.ERROR_DESC) : null,
            "ERR_MOB_CNT": comMsgObj.ERR_MOB_CNT || null,
            "ERR_EMAIL_CNT": comMsgObj.ERR_EMAIL_CNT || null,
            "SMS_JOB_NO": comMsgObj.SMS_JOB_NO || null
        };

        return new Promise((resolve, reject) => {
            axios.post(apiUrl + "updateUnformattedMesgStatus", params).then((response) => {
                if (response && response.ERROR) resolve({ "updStat": null, "updStatError": JSON.stringify(response) });
                else resolve({ "updStat": response, "updStatError": null });
            }).catch((ex) => {
                let message = "";
                if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
                else if (ex.data && ex.data) message = JSON.stringify(ex.data);
                else message = ex.message;
                resolve({ "updStat": null, "updStatError": message });
            });
        });
    }
    catch (ex) {
        return { "updStat": null, "updStatError": ex.message };
    }
}

function updateStatusFormatted(comMsgObj, reqTypeId) {
    try {
        let params = {
            "REQ_TYPE_ID": reqTypeId,
            "COM_MSG_REQ_ID": comMsgObj.COM_MSG_REQ_ID,
            "RECORD_STATUS": comMsgObj.RECORD_STATUS,
            "IS_MOBILE": comMsgObj.IS_MOBILE || null,
            "IS_EMAIL": comMsgObj.IS_EMAIL || null,
            "ERROR_DESC": comMsgObj.ERROR_DESC ? JSON.stringify(comMsgObj.ERROR_DESC) : null,
            "ERR_MOB_CNT": comMsgObj.ERR_MOB_CNT || null,
            "ERR_EMAIL_CNT": comMsgObj.ERR_EMAIL_CNT || null,
            "SMS_JOB_NO": comMsgObj.SMS_JOB_NO || null
        };

        return new Promise((resolve, reject) => {
            axios.post(apiUrl + "updFrmtMsgStat", params).then((response) => {
                if (response && response.ERROR) resolve({ "updFrmtStat": null, "updFrmtStatError": JSON.stringify(response) });
                else resolve({ "updFrmtStat": response, "updFrmtStatError": null });
            }).catch((ex) => {
                let message = "";
                if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
                else if (ex.data && ex.data) message = JSON.stringify(ex.data);
                else message = ex.message;
                resolve({ "updFrmtStat": null, "updFrmtStatError": message });
            });
        });
    }
    catch (ex) {
        return { "updFrmtStat": null, "updFrmtStatError": ex.message };
    }
}

function error(typ, errMsg, obj) {
    if (typ === "SMS") {
        obj.IS_MOBILE = "R";
        obj.ERR_MOB_CNT = 1
        obj.ERROR_DESC = { "SMS": errMsg };
    }
    else if (typ === "EMAIL") {
        obj.IS_EMAIL = "R";
        obj.ERR_EMAIL_CNT = 1;
        if (obj.ERROR_DESC.SMS) obj.ERROR_DESC.EMAIL = errMsg;
        else obj.ERROR_DESC = { "EMAIL": errMsg };
    }
    return obj;
}


async function unFormatted(arr) {
    for (var obj of arr) {
        const { typeIdArr, typeIdError } = await getTypeById(obj.REQ_TYPE_ID, 'unformattedMesgById');
        if (typeIdError) {
            await log(``, `error:unformatted:getTypeById method goes to REQ_TYPE_ID:${obj.REQ_TYPE_ID}, error:${typeIdError}`, null, true);
        }
        else {
            for (var tObj of typeIdArr) {
                const onlyDate = [2,7, 13, 19, 25, 27, 36, 37, 38, 39, 44, 45, 46, 47, 48,105];
                let dateTime = true;

                if (onlyDate.indexOf(parseInt(obj.REQ_TYPE_ID)) > -1) {
                    dateTime = false;
                }
                if (tObj.APMNT_DT) tObj.APMNT_DT = utilsDate.formattedDate(tObj.APMNT_DT, dateTime);
                if (tObj.FROM_DT) tObj.FROM_DT = utilsDate.formattedDate(tObj.FROM_DT, dateTime);
                if (tObj.TO_DT) tObj.TO_DT = utilsDate.formattedDate(tObj.TO_DT, dateTime);
                if (tObj.LEAVE_FROM_DT) tObj.LEAVE_FROM_DT = utilsDate.formattedDate(tObj.LEAVE_FROM_DT, dateTime);
                if (tObj.LEAVE_TO_DT) tObj.LEAVE_TO_DT = utilsDate.formattedDate(tObj.LEAVE_TO_DT, dateTime);
                if (tObj.PREV_APMNT_DT_TIME) tObj.PREV_APMNT_DT_TIME = utilsDate.formattedDate(tObj.PREV_APMNT_DT_TIME, dateTime);

                tObj.ERROR_DESC = "";

                log(`============ start unFormatted sending sms and email for REQ_TYPE_ID:- ${obj.REQ_TYPE_ID}, COM_MSG_REQ_ID:- ${tObj.COM_MSG_REQ_ID}, ORG_ID:- ${tObj.ORG_ID}, LOC_ID:- ${tObj.LOC_ID} ============`);
//console.log("tObj",tObj)
                // SMS sending logic
                if (tObj && tObj.MOBILE_NO && (typeof tObj.MOBILE_NO === 'string') && (tObj.MOBILE_NO = tObj.MOBILE_NO.trim()) && tObj.MOBILE_NO.length > 9) {
										
                    if (tObj.IS_MOBILE === 'Y') {
						if(tObj.ORG_ID == 1003 && tObj.LOC_ID == 1004 && obj.REQ_TYPE_ID == 106){
							tObj.MOBILE_NO = "9440104415,8639244641,7095208801,9573444541";
						}
						//test mode for covid patient request
						 if(obj.REQ_TYPE_ID == 151|| obj.REQ_TYPE_ID == 152){
							 tObj.MOBILE_NO = "8639244641";
						 }
						 
						 
						
						
                        log(`sms:${tObj.COM_MSG_REQ_ID}:${tObj.MOBILE_NO} had permission to send sms`);
                        const smsResp = await smsEmail.smsWithoutTemplate(tObj.ORG_ID, tObj.LOC_ID, obj.REQ_TYPE_ID, tObj.MOBILE_NO, tObj);
                        if (smsResp.smsWotError) {
                            tObj = error("SMS", smsResp.smsWotError, tObj);
							if(smsResp.smsWotError && (smsResp.smsWotError.indexOf('disabled') > -1)){
								log("error while sending sms", `sms:${tObj.COM_MSG_REQ_ID}:error:${smsResp.smsWotError}`, tObj.LOC_ID, false);
							}							
                            else await log("error while sending sms", `sms:${tObj.COM_MSG_REQ_ID}:error:${smsResp.smsWotError}`, tObj.LOC_ID, true);
							
                            log(`sms:${tObj.COM_MSG_REQ_ID}:error:template:${smsResp.smsWotTemplate}`);
                            log(`sms:${tObj.COM_MSG_REQ_ID}:error:vendor url:${smsResp.smsWotUrl}`);
                        }
                        else {
                            tObj.IS_MOBILE = 'C';
                            tObj.MOB_TEMPLATE = smsResp.smsWotTemplate;
							tObj.SMS_JOB_NO = smsResp.smsWotStatus;
                            log(`sms:${tObj.COM_MSG_REQ_ID}:success:sms job number:${tObj.SMS_JOB_NO}`);
                            log(`sms:${tObj.COM_MSG_REQ_ID}:success:template:${smsResp.smsWotTemplate}`);
                            log(`sms:${tObj.COM_MSG_REQ_ID}:success:vendor url:${smsResp.smsWotUrl}`);
                        }
                    }
                    else if (obj.IS_EMAIL === 'C') {
                        tObj = error("SMS", "sms was already send to this patient", tObj);
                        log(`sms:${tObj.COM_MSG_REQ_ID}:error:sms was already send to this patient`);
                    }
                    else {
                        tObj = error("SMS", "sms disabled for this patient or unknown error", tObj);
                        log(`sms:${tObj.COM_MSG_REQ_ID}:error:sms disabled for this patient or unknown error`);
                    }
                }
                else {
                    tObj = error("SMS", "no mobile number or Invalid or Mobile Number", tObj);
                    log(`sms:${tObj.COM_MSG_REQ_ID}:error:no mobile number or Invalid or Mobile Number`);
                }
                log(`                                                                                                      `);

				// patch for email
				if(tObj.LOC_ID === 1088){
					tObj.IS_EMAIL = 'Y';
					tObj.EMAIL_ID = "suvarnahospitals@gmail.com";
				}
				else if(tObj.LOC_ID === 1020){
					tObj.EMAIL_ID = "suvarnahospitals@gmail.com";
				}				
				else if(tObj.LOC_ID === 1185){
					tObj.EMAIL_ID = "it@kdhospital.co.in";
				}	
				else if(tObj.LOC_ID === 1001){
					tObj.EMAIL_ID = "info@asterprime.com, suvarnahospitals@gmail.com";
				}	
				else if(tObj.LOC_ID === 1004){
				}				
				else tObj.IS_EMAIL = 'N';		
                // Email Sending Logic
                if (tObj && tObj.EMAIL_ID && (typeof tObj.EMAIL_ID === 'string') && (tObj.EMAIL_ID = tObj.EMAIL_ID.trim())) {  
				
                    if (tObj.IS_EMAIL === 'Y' && false) {
                        const emailResp = await smsEmail.emailWithoutTemplate(tObj.ORG_ID, tObj.LOC_ID, obj.REQ_TYPE_ID, tObj.EMAIL_ID, tObj);
                      
                        if (emailResp.emailWotError) {
                            tObj = error("EMAIL", emailResp.emailWotError, tObj);							
							if(emailResp.emailWotError && (emailResp.emailWotError.indexOf('disabled') > -1)){
								log("error while sending email", `email:${tObj.COM_MSG_REQ_ID}:error:${emailResp.emailWotError}`, tObj.LOC_ID, false);
							}							
                            else await log("error while sending email", `email:${tObj.COM_MSG_REQ_ID}:error:${emailResp.emailWotError}`, tObj.LOC_ID, true);
                        }
                        else {
                            tObj.IS_EMAIL = 'C';
                            tObj.EMAIL_TEMPLATE = emailResp.emailWotBody
                            log(`email:${tObj.COM_MSG_REQ_ID}:success:body:${emailResp.emailWotBody}`);
                            log(`email:${tObj.COM_MSG_REQ_ID}:success:subject:${emailResp.emailWotSubject}`);
                            log(`email:${tObj.COM_MSG_REQ_ID}:success:status:${emailResp.emailWotStatus}`);
                        }
                    }
                    else if (tObj.IS_EMAIL === 'C') {
                        tObj = error("EMAIL", "email was already send to this patient", tObj);
                        log(`email:${tObj.COM_MSG_REQ_ID}:error:email was already send to this patient`);
                    }
                    else {
                        tObj = error("EMAIL", "email disabled for this patient or unknown error", tObj);
                        log(`email:${tObj.COM_MSG_REQ_ID}:error:email disabled for this patient or unknown error`);
                    }
                }
                else {
                    tObj = error("EMAIL", "no Email Id or Invalid Email Id", tObj);
                    log(`email:${tObj.COM_MSG_REQ_ID}:error:no Email Id or Invalid Email Id`);
                }

                // update record status in table
                tObj.RECORD_STATUS = "D";
                const { updStat, updStatError } = await updateStatusUnformatted(tObj, obj.REQ_TYPE_ID);
                if (updStatError) {
                    // Handle Error Here
                    await log(`error:unformatted record update`, `${tObj.COM_MSG_REQ_ID}:message:${updStatError}`, tObj.LOC_ID, true);
                }
                else {
                    log(`update:${tObj.COM_MSG_REQ_ID}:success:${updStat || 'true'}`);
                }
                log(`                                                                                                                               `);
            }
        }
    }
}

async function formatted(arr) {
    for (var obj of arr) {
        const { typeIdArr, typeIdError } = await getTypeById(obj.REQ_TYPE_ID, 'getFrmtMsgById');
        if (typeIdError) {
            /** Handle Error Here */
            await log(``, `error:formatted:getTypeById method goes to REQ_TYPE_ID:${obj.REQ_TYPE_ID}, error:${typeIdError}`, null, true);
        }
        else {
            for (var tObj of typeIdArr) {
                tObj.MOBILE_NO = tObj.TO_MOBILE_NO
                tObj.EMAIL_ID = tObj.TO_EMAIL;
                tObj.ERROR_DESC = "";

                log(`============ start formatted sending sms and email for REQ_TYPE_ID:- ${obj.REQ_TYPE_ID}, COM_MSG_REQ_ID:- ${tObj.COM_MSG_REQ_ID}, ORG_ID:- ${tObj.ORG_ID}, LOC_ID:- ${tObj.LOC_ID} ============`);

                // SMS sending logic
                if (tObj && tObj.MOBILE_NO && (typeof tObj.MOBILE_NO === 'string') && (tObj.MOBILE_NO = tObj.MOBILE_NO.trim()) && tObj.MOBILE_NO.length > 9) {
                    if (tObj.IS_MOBILE === 'Y') {	
                        console.log("tObj",tObj)					
                        log(`sms:${tObj.COM_MSG_REQ_ID}:${tObj.MOBILE_NO} had permission to send sms`);
                        const smsResp = await smsEmail.smsWithTemplate(tObj.ORG_ID, tObj.LOC_ID, tObj.MOBILE_NO, tObj.MOB_MSG_TPL,obj.REQ_TYPE_ID,tObj.TEMPLATE_ID );
                        if (smsResp.smsWTerror) {
                            tObj = error("SMS", smsResp.smsWTerror, tObj);
							if(smsResp.smsWTerror && (smsResp.smsWTerror.indexOf('disabled') > -1)){
								log("error while sending sms", `sms:${tObj.COM_MSG_REQ_ID}:error:${smsResp.smsWTerror}`, tObj.LOC_ID, false);
							}							
                            else await log("error while sending sms", `sms:${tObj.COM_MSG_REQ_ID}:error:${smsResp.smsWTerror}`, tObj.LOC_ID, true);
                            log(`sms:${tObj.COM_MSG_REQ_ID}:error:vendor url:${smsResp.smsWTurl}`);
                        }
                        else {
                            tObj.IS_MOBILE = 'C';
							//tObj.SMS_JOB_NO = (smsResp.smsWTvendorType + "_" + smsResp.smsWTstatus);
                            tObj.SMS_JOB_NO = smsResp.smsWTstatus;
                            log(`sms:${tObj.COM_MSG_REQ_ID}:success:sms job number:${tObj.SMS_JOB_NO}`);
                            log(`sms:${tObj.COM_MSG_REQ_ID}:success:vendor url:${smsResp.smsWTurl}`);
                        }
                    }
                    else if (obj.IS_EMAIL === 'C') {
                        tObj = error("SMS", "sms was already send to this patient", tObj);
                        log(`sms:${tObj.COM_MSG_REQ_ID}:error:sms was already send to this patient`);
                    }
                    else {
                        tObj = error("SMS", "sms disabled for this patient or unknown error", tObj);
                        log(`sms:${tObj.COM_MSG_REQ_ID}:error:sms disabled for this patient or unknown error`);
                    }
                }
                else {
                    tObj = error("SMS", "no mobile number or Invalid or Mobile Number", tObj);
                    log(`sms:${tObj.COM_MSG_REQ_ID}:error:no mobile number or Invalid or Mobile Number`);
                }
                log(`                                                                                                      `);

				// patch for email
				if(obj.REQ_TYPE_ID===111&&tObj.LOC_ID === 1088){
					tObj.IS_EMAIL = 'Y';
					//tObj.EMAIL_ID = "suvarnahospitals@gmail.com,suvarna.com@gmail.com,sivak345@gmail.com";
					tObj.EMAIL_ID = tObj.TO_EMAIL;
				}
				else if(tObj.LOC_ID === 1088){
					tObj.IS_EMAIL = 'Y';
					tObj.EMAIL_ID = "suvarnahospitals@gmail.com";
				}
				else if(tObj.LOC_ID === 1020){
					tObj.EMAIL_ID = "suvarnahospitals@gmail.com";
				}				
				else if(tObj.LOC_ID === 1185){
					tObj.EMAIL_ID = "it@kdhospital.co.in";
				}	
				else if(tObj.LOC_ID === 1001){
					tObj.EMAIL_ID = "info@asterprime.com, suvarnahospitals@gmail.com";
				}	
				else if(tObj.LOC_ID === 1004){
				}				
				else tObj.IS_EMAIL = 'N';			
			//	return;
                // Email Sending Logic
                if (false && tObj && tObj.EMAIL_ID && (typeof tObj.EMAIL_ID === 'string') && (tObj.EMAIL_ID = tObj.EMAIL_ID.trim())) {
                    if (tObj.IS_EMAIL === 'Y' && false) {
                        log(`email:${tObj.COM_MSG_REQ_ID}:${tObj.EMAIL_ID} had permission to send email`);
                        const emailResp = await smsEmail.emailWithTemplate(tObj.ORG_ID, tObj.LOC_ID, tObj.EMAIL_ID, tObj.EMAIL_MSG_TPL, tObj.SUBJECT);
                        if (emailResp.emailWTerror) {
                            tObj = error("EMAIL", emailResp.emailWTerror, tObj);
							if(emailResp.emailWTerror && (emailResp.emailWTerror.indexOf('disabled') > -1)){
								log("error while sending email", `email:${tObj.COM_MSG_REQ_ID}:error:${emailResp.emailWTerror}`, tObj.LOC_ID, false);
							}							
                            else await log("error while sending email", `email:${tObj.COM_MSG_REQ_ID}:error:${emailResp.emailWTerror}`, tObj.LOC_ID, true);
                        }
                        else {
                            tObj.IS_EMAIL = 'C';
                            log(`email:${tObj.COM_MSG_REQ_ID}:success:status:${emailResp.emailWTstatus}`);
                        }
                    }
                    else if (tObj.IS_EMAIL === 'C') {
                        tObj = error("EMAIL", "email was already send to this patient", tObj);
                        log(`email:${tObj.COM_MSG_REQ_ID}:error:email was already send to this patient`);
                    }
                    else {
                        tObj = error("EMAIL", "email disabled for this patient or unknown error", tObj);
                        log(`email:${tObj.COM_MSG_REQ_ID}:error:email disabled for this patient or unknown error`);
                    }
                }
                else {
                    tObj = error("EMAIL", "no Email Id or Invalid Email Id", tObj);
                    log(`email:${tObj.COM_MSG_REQ_ID}:error:no Email Id or Invalid Email Id`);
                }

                // update record status in table
                tObj.RECORD_STATUS = "D";
                const { updFrmtStat, updFrmtStatError } = await updateStatusFormatted(tObj, obj.REQ_TYPE_ID);
                if (updFrmtStatError) {
                    // Handle Error Here
                    await log(`error: formatted record update`, `update:${tObj.COM_MSG_REQ_ID}:error:${updFrmtStatError}`);
                }
                else {
                    log(`update:${tObj.COM_MSG_REQ_ID}:success:${updFrmtStat || 'true'}`);
                }
                log(`                                                                                                                               `);
            }
       // }
        }
        
    }
}

async function start() {
    isCompletedProcess = false;
    const { typesArr, typesError } = await getAllTypes();
    if (typesError) {
        /** Error Handle Error */
        await log(null, `error:getAllTypes methods goes to error`, null, true);
    }
    else {
        await unFormatted(typesArr);
        await formatted(typesArr);
    }

    isCompletedProcess = true;
    if (!runOnlyOnce) {
        setTimeout(() => {
            start();
        }, (reRunInSec * 1000))
    }
}

function checks() {
    if (apiUrl) {
        axios.get(apiUrl).then((data) => {
            log(`                                                                                                                               `);
            log(`success:${apiUrl} url working fine`);
            log(`OP sms and email service started..`);
            start();
        }).catch((ex) => {
            log(`error:${apiUrl} url not working:${ex.message}`);
        });
    }
    else {
        log(`error:${apiUrl} url not defined`);
    }
}

checks()
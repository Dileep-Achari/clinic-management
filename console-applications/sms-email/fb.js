const shortid = require('shortid');
const format = require('string-format');
const axios = require("../../services/axios");
const appConfig = require("../../app-config");
const winston = require("../../services/winston")("smsEmail/fb");
const slack = require("../../services/slack");
const smsEmail = require("../../constants/sms-email/common");
const utilsDate = require("../../utilities/dates");

format.extend(String.prototype, {});

const enableConsole = false;
const apiUrl = appConfig.FB_SMS_EMAIL_URL;
const reRunInSec = 300;
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
    if (slackEnable) obj.HOST = "fb sms email doc9";
    winston.info({ "date": utilsDate.currentDate(12), "message": obj });
    if (enableConsole) console.log(JSON.stringify(obj));
    if (slackEnable) await slack(JSON.stringify(obj));
    return true;
}

function getPatients() {
    return new Promise(function (resolve, reject) {
   // console.log("getPatient", apiUrl);
        axios.post(apiUrl + "getPatFbStat", { "URL_SHORTNER": "", "FLAG": 2 }).then(resp => {
            if (resp && resp.ERROR) {
                resolve({ "patients": null, "patError": JSON.stringify(resp) });
            }
            else {
           // console.log("resp", resp)
                resolve({ "patients": resp, "patError": null });
            }
        }).catch(ex => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "patients": null, "patError": message });
        });
    });
}

function createShortUrl() {
    return new Promise(function (resolve, reject) {
        try {
            resolve(shortid.generate());
        }
        catch (ex) {
            resolve("");
        }
    });
}


function updateShortUrl(params) {
    return new Promise(function (resolve, reject) {
        axios.post(apiUrl + "updPatFBdet", params).then(resp => {
            if (resp && resp.ERROR) {
                resolve({ "updSrtUrl": null, "updSrtUrlError": JSON.stringify(resp) });
            }
            else {
                resolve({ "updSrtUrl": resp, "updSrtUrlError": null });
            }
        }).catch(ex => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "updSrtUrl": null, "updSrtUrlError": message });
        });
    });
}

function updateSmsEmail(pfId, flag, template, status, error, shortUrl, smsJobNum = null) {
    return new Promise(function (resolve, reject) {
        let params = { "PF_ID": pfId, "FLAG": flag, "MSG_TEMPL": template, "RECORD_STATUS": status, "URL_SHORTNER": shortUrl, "SMS_JOB_NUMBER": smsJobNum };
        if (flag === 3) params.SMS_ERROR = error;
        if (flag === 4) params.EMAIL_ERROR = error;

        axios.post(apiUrl + "updPatFBdet", params).then(resp => {
            if (resp && resp.ERROR) {
                resolve({ "updStat": null, "updStatError": JSON.stringify(resp) });
            }
            else {
                resolve({ "updStat": resp, "updStatError": null });
            }
        }).catch(ex => {
            let message = "";
            if (ex.data && ex.data.ERROR) message = JSON.stringify(ex.data.MESSAGE.originalError.info);
            else if (ex.data && ex.data) message = JSON.stringify(ex.data);
            else message = ex.message;
            resolve({ "updStat": null, "updStatError": message });
        });
    });
}

async function start() {
    isCompletedProcess = false;
    const { patients, patError } = await getPatients();
    if (patError) {
        await log(`error while get patients`, `getPatients:error:update status:error:${patError}`, null, true);
    }
    else {
		
        for (let pat of patients) {
            log(`================== start send sms email for patient:- ${pat.PATIENT_NAME}, PF_ID:- ${pat.PF_ID} ====================`);
            const shortUrl = await createShortUrl();
            log(`${pat.PF_ID}:shortUrl:${shortUrl ? ("success:" + shortUrl) : 'error:while creating short url'}`);
            if (shortUrl) {
                const { updSrtUrl, updSrtUrlError } = await updateShortUrl({ "URL_SHORTNER": shortUrl, "FLAG": 1, "PF_ID": pat.PF_ID });
                if (updSrtUrlError) {
                    await log("error while upate short url", `${pat.PF_ID}:updateShortUrl:error:${updSrtUrlError}`, pat.LOC_ID, true);
                }
                else {
					console.log("status of shorturl",updSrtUrl)
                    if (updSrtUrl && updSrtUrl[0].RET_STATUS === 1) {
                        log(`${pat.PF_ID}:updateShortUrl:success:${updSrtUrl[0].RET_STATUS}`);
                        pat.URL_SHORTNER = shortUrl;
						 if (pat.IS_SMS == 'Y' && pat.MOBILE_NO && pat.MOBILE_NO.length > 9) {
                            log(`${pat.PF_ID}:sms:${pat.MOBILE_NO} had permission to send sms`);
                            const smsRepObj = {
                                "PAT_NAME": pat.PATIENT_NAME,
                                "ORG_NAME": pat.ORG_NAME,
                                "URL_SHORTNER": shortUrl
                            };
						
                            const smsResp = await smsEmail.smsWithoutTemplate(pat.ORG_ID, pat.LOC_ID, pat.REQ_TYPE_ID, pat.MOBILE_NO, smsRepObj);
						
                            if (smsResp.smsWotStatus) {
                                pat.IS_SMS = 'C';
                                pat.SMS_JOB_NUMBER = (smsResp.smsWotVendorType + "_" + smsResp.smsWotStatus);
                                pat.SMS_TEMPLATE = smsResp.smsWotTemplate;
                                log(`${pat.PF_ID}:sms:success:sms job number:${pat.SMS_JOB_NUMBER}`);
                                log(`${pat.PF_ID}:sms:success:template:${smsResp.smsWotTemplate}`);
                                log(`${pat.PF_ID}:sms:success:vendor url:${smsResp.smsWotUrl}`);
                            }
                            else {
                                /** error handel here */
                                pat.IS_SMS = 'R'
                                pat.SMS_ERROR = smsResp.smsWotError;
                                await log("error while sendig sms", `${pat.PF_ID}:sms:error:${smsResp.smsWotError}`, pat.LOC_ID, true);
                                log(`${pat.PF_ID}:sms:error:template:${smsResp.smsWotTemplate}`);
                                log(`${pat.PF_ID}:sms:error:vendor url:${smsResp.smsWotUrl}`);
                            }
                        }
                        else {
                            pat.IS_SMS = 'R'
                            pat.SMS_ERROR = "sms disabled or invalid mobile number";
                            log(`${pat.PF_ID}:sms:error:sms disabled or invalid mobile number`);
                        }

                        const smsUpdResp = await updateSmsEmail(pat.PF_ID, 3, (pat.SMS_TEMPLATE || ""), pat.IS_SMS, (pat.SMS_ERROR || ""), pat.URL_SHORTNER, (pat.SMS_JOB_NUMBER || null))
						//console.log("smsSatus",smsUpdResp)                      
					  if (smsUpdResp && smsUpdResp.updStat) {
                            log(`${pat.PF_ID}:sms:update status:success:true`);
                        }
                        else {
                            await log(`error while update sms sent status`, `${pat.PF_ID}:sms:update status:error:${smsUpdResp.updStat}`, pat.LOC_ID, true);
                        }

                        log(`                                                                                                                               `);
						
						// Manuvally disable the mail
						pat.IS_EMAIL = 'N';

                        if (pat.IS_EMAIL == 'Y' && pat.EMAIL_ID) {
                            log(`${pat.PF_ID}:email:${pat.EMAIL_ID} had permission to send email`);
                            const emailRepObj = {
                                "PAT_NAME": pat.PATIENT_NAME,
                                "ORG_NAME": pat.ORG_NAME,
                                "URL_SHORTNER": shortUrl
                            };
                            const emailResp = await smsEmail.emailWithoutTemplate(pat.ORG_ID, pat.LOC_ID, pat.REQ_TYPE_ID, pat.EMAIL_ID, emailRepObj);
                            if (emailResp && emailResp.emailWotStatus) {
                                pat.IS_EMAIL = 'C';
                                pat.EMAIL_TEMPLATE = emailResp.emailWotBody;
                                log(`${pat.PF_ID}:email:success:body:${emailResp.emailWotBody}`);
                                log(`${pat.PF_ID}:email:success:subject:${emailResp.emailWotSubject}`);
                                log(`${pat.PF_ID}:email:success:status:${emailResp.emailWotStatus}`);
                            }
                            else {
                                pat.IS_EMAIL = 'R';
                                pat.EMAIL_ERROR = emailResp.emailWotError;
                                await log("error while sendig email", `${pat.PF_ID}:email:error:${emailResp.emailWotError}`, pat.LOC_ID, true);
                                log(`${pat.PF_ID}:email:error:body:${emailResp.emailWotBody}`);
                                log(`${pat.PF_ID}:email:error:subject:${emailResp.emailWotSubject}`);
                            }
                        }
                        else {
                            pat.IS_EMAIL = 'R'
                            pat.EMAIL_ERROR = "email disabled or invalid email id";
                            log(`${pat.PF_ID}:email:error:email disabled or invalid email id`);
                        }

                        const emailUpdResp = await updateSmsEmail(pat.PF_ID, 4, (pat.EMAIL_TEMPLATE || ""), pat.IS_EMAIL, (pat.EMAIL_ERROR || ""), pat.URL_SHORTNER)
                        if (emailUpdResp && emailUpdResp.updStat) {
                            log(`${pat.PF_ID}:email:update status:success:true}`);
                        }
                        else {
                            await log(`error while update email sent status`, `${pat.PF_ID}:email:update status:error:${emailUpdResp.updStat}`, pat.LOC_ID, true);
                        }
                    }
                    else {
                        await log(`error while updateShortUrl`, `${pat.PF_ID}:updateShortUrl:error:${JSON.stringify(updSrtUrl)}`, pat.LOC_ID, true);
                    }
                }
            }
            log(`                                                                                                                               `);
        }
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
            log(`FB sms and email service started..`);
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
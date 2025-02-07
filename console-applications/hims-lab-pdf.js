/**
 * Process works based on cost center
 * but patients get was based on company
 */

const shortid = require('shortid');
const format = require('string-format');
const winston = require("../services/winston")("hims-lab-pdf");
const appConfig = require("../app-config");
const slack = require("../services/slack");
const sms = require("../services/sms");
const utilsDate = require("../utilities/dates");
const locations = require("../constants/hims-lab-pdf/locations");
const common = require("../constants/hims-lab-pdf/common");
const axios = require('../services/axios');
const increKey = appConfig.REDIS_URL + "increKey";

format.extend(String.prototype, {}); // Very Important

const reRunInSec = 10,
    enableConsole = false;

let isCompletedProcess = false,
    count = 0,
    runOnlyOnce = true;

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
    if (locId) obj.COSTCENTERCD = locId;
    if (slackEnable) obj.HOST = "hims lab pdf sms email doc9";
    winston.info({ "date": utilsDate.currentDate(12), "message": obj });
    if (enableConsole) console.log(JSON.stringify(obj));
    if (slackEnable) await slack(JSON.stringify(obj));
    return true;
}

function smsSend(type, url, params) {
    return new Promise((resolve, reject) => {
        sms(type, url, params).then(resp => {
            resolve({ "success": resp, "error": null });
        }).catch(ex => {
            resolve({ "success": null, "error": ex.message });
        });
    });
}

function generateShortUrl() {
    return shortid.generate();
}

function incrkey(key) {
    return new Promise((resolve, reject) => {
        axios.post(increKey, { key: key }).then((response) => {
            resolve({ "redisIncSuccess": response, "redisIncError": null });
        }).catch(ex => {
            resolve({ "redisIncSuccess": null, "redisIncError": ex.message });
        });
    });
}

async function start() {
    isCompletedProcess = false;

    for (let loc of locations) {
        if (loc.ACTIVE === 'Y') {
            const key = `DOC9.HIMS_LAB_PDF.${loc.RPT_ID}.SMS.COUNT`;
            const { template, tempError } = await common.getTemplate(loc.URL, loc.COSTCENTERCD);
            if (tempError) {
                await log(`getTemplate method goes to error`, `error:${tempError}`, loc.COSTCENTERCD, true);
            }
            else {
                const { vendorUrl, vendorError } = await common.getVendorUrl(loc.URL, loc.COSTCENTERCD);
                if (vendorError) {
                    await log(`getVendorUrl method goes to error`, `error:${vendorError}`, loc.COSTCENTERCD, true);
                }
                else {
                    const { patients, patientsError } = await common.getPatients(loc.URL);
                    if (patientsError) {
                        await log(`getPatients method goes to error`, `error:${patientsError}`, loc.COSTCENTERCD, true);
                    }
                    else {
                        for (let patient of patients) {
                            if (loc.TEST_MODE === "Y") {
                                count++;
                                patient.MOBILENO = loc.TEST_MOBILE_NO;
                            }
                            log(`========== start ${patient.BATCH_ID}:${patient.MOBILENO}:${patient.PATIENTNAME} ========== `);
                            if (patient.MOBILENO && patient.PATIENTNAME) {
                                patient.SHORT_URL = generateShortUrl();
                                log(`${patient.BATCH_ID}:shortUrl:${patient.SHORT_URL}`);
                                patient.MSG_TEMPLATE = template + `, ${appConfig.HIMS_PDF_BASE_PATH + loc.RPT_ID}/${patient.SHORT_URL}.pdf`;
                                patient.MSG_TEMPLATE = patient.MSG_TEMPLATE.format({ "PATIENTNAME": patient.PATIENTNAME, "COMPANY_NAME": loc.COMPANYNAME, "SHORT_URL": patient.SHORT_URL });
                                log(`${patient.BATCH_ID}:template:${patient.MSG_TEMPLATE}`);
                                patient.VENDOR_URL = vendorUrl;
                                patient.VENDOR_URL = patient.VENDOR_URL.format({ "MOBILENO": patient.MOBILENO , "MSG_DESC": patient.MSG_TEMPLATE });
                                log(`${patient.BATCH_ID}:vendorUrl:${patient.VENDOR_URL}`);
								let params = {"MOBILE_NO":"", "TEMPLATE":"","PROJECT_ID":"", "AUTH_TOKEN":""};
								params.MOBILE_NO = patient.MOBILENO, params.PROJECT_ID = loc.PROJECT_ID, 
								params.AUTH_TOKEN = loc.AUTH_TOKEN, params.TEMPLATE = patient.MSG_TEMPLATE;
                                const { success, error } = await smsSend("VOX_PASS", loc.VENDOR_URL, params);
                                let updParams = { "Flag": 'S', "Batchid": patient.BATCH_ID, "Shorturl": patient.SHORT_URL }
                                if (error) {
                                    updParams.Msgstatus = 'N';
                                    await log(`error while send smsSend`, `${patient.BATCH_ID}:error:${error}`, loc.COSTCENTERCD, true);
                                }
                                else {
                                    updParams.Msgstatus = 'Y';
                                    updParams.Jobstatus = success;
                                    const { redisIncSuccess, redisIncError } = await incrkey(key);
                                    if (redisIncError) {
                                        await log(`sms count not incremented in redis for BATCH_ID:-  ${patient.BATCH_ID}`);
                                    }
                                    log(`${patient.BATCH_ID}:success:${success}`);
                                }							
								//console.log(common.getNewParams(updParams));
                                const { updStat, updStatError } = await common.updatePatStat(loc.URL, common.getNewParams(updParams));
								
								await log(`update to HIS : ${updStat}`);
								
                                if (updStatError) {
                                    await log(`updatePatStat method goes to error`, `error:updateStat:${updStatError}`, loc.COSTCENTERCD, true);
                                }
                                else {
                                    log(`success:updateStat:${updStat}`);
                                }
                            }
                            else {
                                log(`${patient.BATCH_ID}:error:invalid patient mobile number or patient name`);
                            }
                            log(`                                                                                                       `);
                            log(`                                                                                                       `);
							console.log(count, loc.TEST_SMS_LIMIT);
                            if (loc.TEST_MODE === "Y") {
                                if (count === loc.TEST_SMS_LIMIT) {
                                    count = 0;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    isCompletedProcess = true;

    if (!runOnlyOnce) {
        setTimeout(() => {
            start();
        }, (reRunInSec * 1000))
    }
}

start();
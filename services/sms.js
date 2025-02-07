const axios = require('../services/axios');
const querystring = require('querystring');
//process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

function remainingGet(url) {
let uri=encodeURI(url)
//console.log("url",uri)
    return new Promise((resolve, reject) => {
        axios.get(uri).then(function (result) {
        console.log("url",result)
            resolve(result)
        }).catch(function (error) {
            reject(error);
        });
    });
}

function remainingPost(url, params) {
    return new Promise((resolve, reject) => {
        if (!params) params = {};
        axios.post(url, params).then(function (result) {
            resolve(result)
        }).catch(function (error) {
            reject(error);
        });
    });
}

function voxPass(smsUrl, smsObj) {
    return new Promise((resolve, reject) => {
        let multiMob = false;
        // if (!(smsUrl && smsObj && smsObj.MOBILE_NO && smsObj.TEMPLATE && smsObj.PROJECT_ID && smsObj.AUTH_TOKEN && smsObj.TEMPLATE_ID)) {
        if (!(smsUrl && smsObj && smsObj.MOBILE_NO && smsObj.TEMPLATE && smsObj.PROJECT_ID && smsObj.AUTH_TOKEN && smsObj.TEMPLATE_ID)) {
            let str = "please provide valid details of "
            if (!smsUrl) str += "sms vendor url, ";
            if (!smsObj.MOBILE_NO) str += "mobile no, ";
            if (!smsObj.TEMPLATE) str += "template, ";
            if (!smsObj.PROJECT_ID) str += "project Id, ";
            if (!smsObj.AUTH_TOKEN) str += "auth token, ";
            //if (!smsObj.TEMPLATE_ID) str += "template id, ";
            str = str.substr(0, str.length - 2);

            console.log("smsObj", smsObj)
            reject(new Error(str));
        }
        else {
            if (smsObj.MOBILE_NO && smsObj.MOBILE_NO.indexOf(',') > -1) {
                const mobArr = smsObj.MOBILE_NO.split(',');
                if (mobArr && mobArr.length > 1) {
                    multiMob = true;
                    smsObj.MOBILE_NO = "";
                    for (let mob in mobArr) smsObj.MOBILE_NO += `+91${mobArr[mob]}${mobArr[parseInt(mob) + 1] ? "," : ""}`;
                } else smsObj.MOBILE_NO = `+91${smsObj.MOBILE_NO}`;
            }
            else if (smsObj.MOBILE_NO) {
                smsObj.MOBILE_NO = `+91${smsObj.MOBILE_NO}`;
            }

            config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            axios.post(smsUrl, querystring.stringify({
                projectid: smsObj.PROJECT_ID,
                authtoken: smsObj.AUTH_TOKEN,
                to: smsObj.MOBILE_NO,
                template_id: smsObj.TEMPLATE_ID,
                body: smsObj.TEMPLATE,
                from: smsObj.FROM

                //dlr_url:'http://sms.doctor9.com/smsdlr'
            })).then(function (result) {
                //if (result && result.status === "Success") resolve(JSON.stringify(result));
                //console.log('https://sms.doctor9.com/smsdlr-smsObj.FROM', smsObj.FROM);

                if (result && result.status === "Success")
                    if (multiMob === false) resolve(result.id);
                    else {
                        console.log(result.resp[0].id);
                        resolve(result.resp[0].id);
                    }
                else reject(new Error(JSON.stringify(result)));
            }).catch(function (error) {
                console.log("error", error);
                reject(error);
            });
        }
    });
}

function isResponseValid(type, status) {
    try {
        if (type === "SMS_COUNTRY") {
            if (status && status.toString().toUpperCase().indexOf("OK:") > -1)
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else if (type === "BULK_SMS_GTWAY") {
            if (status && status.status === 'success' && status.response[0] && status.response[0].unique_id)
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else if (type === "ABSOLUTE_SMS") {
            if (status && parseInt(status))
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else if (type === "MOBI_SMART") {
            if (status && status.split('|') && status.split('|').length > 0 && status.split('|')[1] && status.split('|')[1].length > 3)
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else if (type === "MALERT") {
            if (status && (status.indexOf('OK [') > -1) && (status.indexOf(']') > -1))
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else if (type === "SMS9") {
            if (status && status.indexOf("SMS-SHOOT-ID/") > -1)
                return { "success": status.split("/")[1], "error": null };
            else return { "success": null, "error": status };
        }
        else if (type === "ENFFIE") {
            return { "success": null, "error": status };
        }
        else if (type === "ALERTS") {
            if (status && status.status === 'OK')
                return { "success": JSON.stringify(status.data), "error": null };
            else
                return { "success": null, "error": JSON.stringify(status) };
        }
        else if (type === "BULKSMSAPPS") {
            if (status && status.indexOf('MessageId') > -1)
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }

        else if (type === "APICONNECTO") {

            let arr = status.split(",")
            if (status && arr.length > 0 && arr[1].includes("TransId"))
                return { "success": status, "error": null };
            else
                return { "success": null, "error": status };
        }
        else return { "success": status, "error": null };
    }
    catch (ex) {
        return { "success": null, "error": ex };
    }
}


module.exports = function (type, url, params) {
    return new Promise((resolve, reject) => {
        if (type === "VOX_PASS") {
            voxPass(url, params).then(function (result) {
                resolve(result);
            }).catch(function (error) {
                reject(error);
            });
        }
        else {
            // resolve("OK:455454643535"); // dummy
            // reject(new Error("sms error")); // dummy

            remainingGet(url).then(function (result) {
                console.log(result);
                const { success, error } = isResponseValid(type, result);
                //console.log("isResponseValid",type,result);
                //console.log("isResponseValid-1",success,error)
                if (error) reject(error);
                else resolve(success);
            }).catch(function (error) {
                reject(error);
            });
        }
    });
}
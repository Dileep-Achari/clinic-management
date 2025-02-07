const _axios = require('axios');
const querystring = require('querystring');
const nodeMailer = require("nodemailer");
const format = require('string-format');
const emailSrv = require("../services/email");
format.extend(String.prototype, {});

// let _whatsAppurl = "http://10.10.42.96:8002/napi/wa/api/waMessage";
let _whatsAppurl = "https://portal.mrrch.com/napi_uat/wa/api/waMessage";

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

async function sendWhatsAppMessage(vendor, data, placeHolders){
    try{
        let _params = {
            "toMobile": data.toWhatsAppMobile,
            "placeHolders": `${placeHolders.PAT_NAME}^^^${placeHolders.DOC_NAME}^^^${placeHolders.APMNT_TIME}`,
            "templatename":"appointment_reminder",
            "tempData": data.whatsAppTemplate
        };
        let config = {
            "headers": {
                "authtoken": vendor.waToken
            }
        };
        let url = _whatsAppurl
        if (!(vendor.waToken)) {
            console.log("error in waToken is not found")
        }
        else {
            let resp = await axiosCalls(url, _params, config)
            if (resp.success) {
                console.log("resp", resp)
                return {resp, data}
            }
            else {
                console.log("resp", resp)
            }
        }
    }catch(error){
        console.log("error", error)
    }
}

module.exports = { sendWhatsAppMessage }

const axios = require('axios');
const querystring = require('querystring');
const nodeMailer = require("nodemailer");
const format = require('string-format');
const emailSrv = require("../services/email");
format.extend(String.prototype, {});


// function emailWithoutTemplate(orgId, locId, reqTypeId, toEmail, emailReplaceObj) {
    function emailWithoutTemplate(vendor, data) {
    return new Promise(async (resolve, reject) => {
        if (data.orgId && data.locId &&  data.toEmail) {
            // let template = getTemplate("EMAIL", orgId, locId, reqTypeId);
            if (data.emailTemplate && data.emailTemplate.length > 0) {

                let resp = await emailSrv(vendor, data.toEmail, data.emailSubject, data.emailTemplate);
                // const resp = await emailHelper(orgId, locId, toEmail, template.BODY, template.SUBJECT);
                if (resp && resp.length > 0) {
                    // resolve({ "emailWotStatus": resp, "emailWotError": resp.emailError, "emailWotSubject": data.emailSubject, "emailWotBody": data.emailTemplate, data });
                    resolve({ "resp": resp, "data": data });

                }
                else resolve({ "emailWotStatus": null, "emailWotError": (resp.emailError || "error occured while sending email"), "emailWotSubject": template.SUBJECT, "emailWotBody": template.BODY });
            }
            else {
                resolve({ "emailWotStatus": null, "emailWotError": "invalid email template data", "emailWotSubject": null, "emailWotBody": null });
            }
        }
        else {
            resolve({ "emailWotStatus": null, "emailWotError": `all fields are mandatory(orgId:-${data.orgId}, locId:-${data.locId},toEmail:-${data.toEmail}` });
        }
    });
}


module.exports = { emailWithoutTemplate }

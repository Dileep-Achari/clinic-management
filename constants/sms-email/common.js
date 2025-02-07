const format = require('string-format');
const templates = require("./templates");
const smsEmailVendor = require("./sms-email-vendor-details");
const smsSrv = require("../../services/sms");
const emailSrv = require("../../services/email");

format.extend(String.prototype, {});

/*
 *  this was a helper function sending sms
*/
async function smsHelper(orgId, locId, mobileNo, template, req_type_id, template_id) {
	if(orgId=='1175' && req_type_id != 50){
		template=template+'APEX HOSPITALS.';
	}
    let vendor = vendorDetails("SMS", orgId, locId);
    if (vendor) {
        if (vendor.ACTIVE === 'N') {
            return { "smsStatus": null, "smsError": "sms was disabled for this location", "smsUrl": null, "smsVendorType": null }
        }
        else {
            if (vendor.IS_TEST === "Y") {
                mobileNo = vendor.TEST_MOBILE_NUMBER;
            }
            if (req_type_id == 68 && (locId == 1004 || locId == 1088)) {
                template_id = "1507161743286510831";
            }
            if (req_type_id == 69 && (locId == 1004 || locId == 1088)) {
                template_id = "1507161822818204880";
            }
            try {
                if (vendor.VENDOR_TYPE === "VOX_PASS") {
                    if (vendor.AUTH_TOKEN && vendor.VENDOR_URL) {
                        const extraObj = {
                            MOBILE_NO: mobileNo,
                            TEMPLATE: template,
                            PROJECT_ID: vendor.PROJECT_ID,
                            AUTH_TOKEN: vendor.AUTH_TOKEN,
                            TEMPLATE_ID: template_id,
                            FROM: vendor.FROM

                        }
                        const resp = await smsSrv(vendor.VENDOR_TYPE, vendor.VENDOR_URL, extraObj);
                        return { "smsStatus": resp, "smsError": null, "smsUrl": `url:- ${vendor.VENDOR_URL}, params:- ${JSON.stringify(extraObj)}`, "smsVendorType": vendor.VENDOR_TYPE };
                    }
                    else {
                        return { "smsStatus": null, "smsError": "project id and auth token are not defined in config file", "smsUrl": null, "smsVendorType": null };
                    }
                }
                else if(vendor.VENDOR_TYPE === 'BULK_SMS_GTWAY' && (orgId === 1219 || orgId === 1211 || orgId === 1049)){
                    vendor.VENDOR_URL = vendor.VENDOR_URL.format({ "MOB_NUMBER": mobileNo, "MOB_MESSAGE": template , "TEMPLATE_ID":template_id});
                    const resp = await smsSrv(vendor.VENDOR_TYPE, vendor.VENDOR_URL);
                    return { "smsStatus": resp, "smsError": null, "smsUrl": vendor.VENDOR_URL, "smsVendorType": vendor.VENDOR_TYPE };
                }
                else {
                    vendor.VENDOR_URL = vendor.VENDOR_URL.format({ "MOB_NUMBER": mobileNo, "MOB_MESSAGE": template });
                    
                    const resp = await smsSrv(vendor.VENDOR_TYPE, vendor.VENDOR_URL);
                    return { "smsStatus": resp, "smsError": null, "smsUrl": vendor.VENDOR_URL, "smsVendorType": vendor.VENDOR_TYPE };
                }
            }
            catch (ex) {
                return { "smsStatus": null, "smsError": ex.message, "smsUrl": vendor.VENDOR_URL, "smsVendorType": vendor.VENDOR_TYPE };
            }
        }
    }
    else {
        return { "smsStatus": null, "smsError": "no sms vendor url found", "smsUrl": null, "smsVendorType": null };
    }
}

/*
 *  this was a helper function sending email
*/
async function emailHelper(orgId, locId, toEmail, body, subject) {
    //console.log("orgId", body, subject)
    let vendor = vendorDetails("EMAIL", orgId, locId);
    if (vendor) {
        if (vendor.ACTIVE === 'N') {
            return { "smsStatus": null, "smsError": "email was disabled for this location", "smsUrl": null, "smsVendorType": null }
        }
        else {
            if (vendor.IS_TEST === "Y") {
                toEmail = vendor.TEST_EMAIL;
            }

            try {
                if (vendor.SERVER_HOST && vendor.PORT && vendor.HOST_EMAIL && vendor.HOST_EMAIL_PWD) {
                    const hostObj = {
                        "SERVER_HOST": vendor.SERVER_HOST,
                        "PORT": vendor.PORT,
                        "HOST_EMAIL": vendor.HOST_EMAIL,
                        "HOST_EMAIL_PWD": vendor.HOST_EMAIL_PWD
                    };
                    let resp = await emailSrv(hostObj, toEmail, subject, body);
                    return { "emailStatus": resp, "emailError": null };
                }
                else {
                    return { "emailStatus": null, "emailError": "incorrect vendor details" };
                }
            }
            catch (ex) {
                return { "emailStatus": null, "emailError": ex.message };
            }
        }
    }
    else {
        console.log("call 1")
        return { "emailStatus": null, "emailError": "no email vendor url found" };
    }
}


/**
 * this is belongs to get templates for sms or email
 * @param { mandatory: yes, default: SMS/EMAIl, datatype: string } type
 * @param { mandatory: yes, datatype: number } orgId 
 * @param { mandatory: yes, datatype: number } locId 
 * @param { mandatory: yes, datatype: number } reqTypeId
 * @response { object: if data find, null: no data found}
 * @response-object { REQ_TYPE_ID, REQ_DESC, MOB_TEMPLATE, EMAIL_TEMPLATE }
 */
function getTemplate(type, orgId, locId, reqTypeId) {
    if (type && (type === "SMS" || type === "EMAIL") && orgId && locId && reqTypeId) {
        let template = { ...templates(orgId, locId, reqTypeId) };
        if (template) {
            if (type === 'SMS') template = template;
            else if (type === 'EMAIL') template = { "SUBJECT": template.REQ_DESC, "BODY": template.EMAIL_TEMPLATE, "STYLE": template.EMAIL_STYLE || "" };
            else if (type === 'BOTH') template = template;
            return template;
        }
        else return null;
    }
    else return null;
}

/**
 * this is belongs to get vendor details for sms or email
 * @param { mandatory: yes, default: SMS/EMAIl, datatype: string } type 
 * @param { mandatory: yes, datatype: number } orgId 
 * @param { mandatory: yes, datatype: number } locId
 * @response { object: if data find, null: no data found}
 * @response-object-sms { ORG_ID, LOC_ID, VENDOR_TYPE, VENDOR_URL, PROJECT_ID(when vendor type is VOX_PASS), AUTH_TOKEN(when vendor type is VOX_PASS), ADMIN_NO, IS_TEST }
 * @response-object-email { ORG_ID, LOC_ID, SERVER_HOST, PORT, HOST_EMAIL, HOST_EMAIL_PWD }
 */
function vendorDetails(type, orgId, locId) {
    if (type === 'SMS') {
        let vendor = smsEmailVendor.find(s => (s.LOC_ID === locId && s.ORG_ID === orgId));
        if (vendor) {
            return { ...vendor.SMS, "IS_TEST": vendor.IS_TEST, "TEST_MOBILE_NUMBER": vendor.TEST_MOBILE_NUMBER, "TEST_EMAIL": vendor.TEST_EMAIL, "ACTIVE": vendor.ACTIVE };
        }
    }
    else if (type === 'EMAIL') {
        let vendor = smsEmailVendor.find(e => (e.LOC_ID === locId && e.ORG_ID === orgId));
        if (vendor) {
            return { ...vendor.EMAIL, "IS_TEST": vendor.IS_TEST, "TEST_MOBILE_NUMBER": vendor.TEST_MOBILE_NUMBER, "TEST_EMAIL": vendor.TEST_EMAIL, "ACTIVE": vendor.ACTIVE };
        }
    }
    else if (type === 'BOTH') {
        let vendor = smsEmailVendor.find(s => (s.LOC_ID === locId && s.ORG_ID === orgId));
        if (vendor) {
            return vendor;
        }
        else {
            return {
                "SMS": null,
                "EMAIL": null,
                "IS_TEST": null,
                "TEST_MOBILE_NUMBER": null,
                "TEST_EMAIL": null
            }
        }
    }
    return null;
}

function smsWithTemplate(orgId, locId, mobileNo, template, req_type_id, template_id) {
    console.log("template",template)
    return new Promise(async (resolve, reject) => {
        if (orgId && locId && mobileNo && template) {
            const resp = await smsHelper(orgId, locId, mobileNo, template, req_type_id, template_id);
            if (resp && resp.smsStatus) {
                resolve({ "smsWTstatus": resp.smsStatus, "smsWTerror": resp.smsError, "smsWTurl": resp.smsUrl, "smsWTvendorType": resp.smsVendorType });
            }
            else resolve({ "smsWTstatus": null, "smsWTerror": (resp.smsError || "error while sending sms"), "smsWTurl": resp.smsUrl || null, "smsWTvendorType": resp.smsVendorType || null });
        }
        else {
            resolve({ "smsWTstatus": null, "smsWTerror": "all fields are mandatory", "smsWTurl": null, "smsWTvendorType": null });
        }
    });
}

function smsWithoutTemplate(orgId, locId, reqTypeId, mobileNo, smsReplaceObj) {
    return new Promise(async (resolve, reject) => {
        if (orgId && locId && reqTypeId && mobileNo && smsReplaceObj && Object.keys(smsReplaceObj)) {
            let templateObj = getTemplate("SMS", orgId, locId, reqTypeId);
            let template = templateObj.MOB_TEMPLATE;
            let templateId = templateObj.MOB_TEMPLATE_ID || "";
            if (template) {
                template = template.format(smsReplaceObj);
                
                const resp = await smsHelper(orgId, locId, mobileNo, template, "", templateId);
                if (resp && resp.smsStatus) {
                    resolve({ "smsWotStatus": resp.smsStatus, "smsWotError": resp.smsError, "smsWotTemplate": template, "smsWotUrl": resp.smsUrl, "smsWotVendorType": resp.smsVendorType });
                }
                else resolve({ "smsWotStatus": null, "smsWotError": (resp.smsError || "error while sending sms"), "smsWotTemplate": template || null, "smsWotUrl": resp.smsUrl || null, "smsWotVendorType": resp.smsVendorType || null });
            }
            else {
                resolve({ "smsWotStatus": null, "smsWotError": `no template found aganit req ty id ${reqTypeId}`, "smsWotTemplate": null, "smsWotUrl": null, "smsWotVendorType": null });
            }
        }
        else resolve({ "smsWotStatus": null, "smsWotError": "all fields are mandatory", "smsWotTemplate": null, "smsWotUrl": null, "smsWotVendorType": null });
    });
}

function emailWithTemplate(orgId, locId, toEmail, body, subject) {
    return new Promise(async (resolve, reject) => {
        if (orgId && locId && toEmail && body && subject) {
            const resp = await emailHelper(orgId, locId, toEmail, body, subject);
            resolve({ "emailWTstatus": resp.emailStatus, "emailWTerror": resp.emailError });
        }
        else {
            resolve({ "emailWTstatus": null, "emailWTerror": `all fields are mandatory(orgId:-${orgId}, locId:-${locId}, toEmail:-${toEmail}, body:-${body}, subject:-${subject})` })
        }
    });
}

function emailWithoutTemplate(orgId, locId, reqTypeId, toEmail, emailReplaceObj) {
    return new Promise(async (resolve, reject) => {
        if (orgId && locId && reqTypeId && toEmail && emailReplaceObj && Object.keys(emailReplaceObj)) {
            let template = getTemplate("EMAIL", orgId, locId, reqTypeId);
            if (template && template.SUBJECT && template.BODY) {
                template.BODY = template.BODY.format(emailReplaceObj);
                //				template.BODY = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,
                //				initial-scale=1.0"><title>${template.SUBJECT}</title>${template.STYLE || ""}</head><body>${template.BODY || ""}</body></html>`;
                template.BODY = `${template.BODY || ""}`;
                const resp = await emailHelper(orgId, locId, toEmail, template.BODY, template.SUBJECT);
                if (resp && resp.emailStatus) {
                    resolve({ "emailWotStatus": resp.emailStatus, "emailWotError": resp.emailError, "emailWotSubject": template.SUBJECT, "emailWotBody": template.BODY });
                }
                else resolve({ "emailWotStatus": null, "emailWotError": (resp.emailError || "error occured while sending email"), "emailWotSubject": template.SUBJECT, "emailWotBody": template.BODY });
            }
            else {
                resolve({ "emailWotStatus": null, "emailWotError": "invalid email template data", "emailWotSubject": null, "emailWotBody": null });
            }
        }
        else {
            resolve({ "emailWotStatus": null, "emailWotError": `all fields are mandatory(orgId:-${orgId}, locId:-${locId}, reqTypeId:-${reqTypeId}, toEmail:-${toEmail}, emailReplaceObj:-${emailReplaceObj && Object.keys(emailReplaceObj) ? true : false})`, "emailWotSubject": null, "emailWotBody": null });
        }
    });
}

module.exports = {
    sms: smsSrv,
    email: emailHelper,
    templates,
    getTemplate,
    vendorDetails,
    smsWithTemplate,
    smsWithoutTemplate,
    emailWithTemplate,
    emailWithoutTemplate
}
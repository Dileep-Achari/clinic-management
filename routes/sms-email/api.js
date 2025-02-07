'use strict';
const express = require("express");
const router = express.Router();
const sms = require("../../services/sms");
const email = require("../../services/email");
const commonSmsEmail = require("../../constants/sms-email/common");
const shSmsEmailOrgObj = require("./shSmsEmail_Arr");
const winston = require("../../services/winston")("smsEmail/shSmsEmail");
const utilsDate = require("../../utilities/dates");
const format = require('string-format');
format.extend(String.prototype, {});
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

/**
 * SMS_COUNTRY
 * BULK_SMS_GTWAY
 * ABSOLUTE_SMS
 * MOBI_SMART
 * MALERT
 * ENFFIE
 * VOX_PASS
 */
 
 
function getOrgLoc(client) {
    return shSmsEmailOrgObj.find(o => o.CLIENT === client) || null;
}
 
router.post('/sms', (req, res) => {
    const vendors = ["SMS_COUNTRY", "BULK_SMS_GTWAY", "ABSOLUTE_SMS", "MOBI_SMART", "MALERT", "ENFFIE", "VOX_PASS"];
    if ((vendors.indexOf(req.body.TYPE) > -1) && req.body.URL) {
        if (req.body.TYPE === 'VOX_PASS' && !(req.body.PARAMS && req.body.PARAMS.PROJECT_ID && req.body.PARAMS.AUTH_TOKEN && req.body.PARAMS.MOBILE_NO && req.body.PARAMS.TEMPLATE)) {
            return res.status(400).send("vendor VOX_PASS requires PROJECT_ID, AUTH_TOKEN, MOBILE_NO and TEMPLATE in PARAMS object");
        }
        else {
            sms(req.body.TYPE, req.body.URL, req.body.PARAMS).then((data) => {
                return res.json(data);
            }).catch((error) => {
                return res.status(400).send(error.message);
            });
        }
    }
    else {
        return res.status(400).send("invalid vendor(TYPE) or url");
    }
});

router.post('/email', (req, res) => {
    if (req.body.TO_EMAIL && req.body.SUBJECT && req.body.TEMPLATE && req.body.HOST && req.body.HOST.SERVER_HOST && req.body.HOST.PORT && req.body.HOST.HOST_EMAIL && req.body.HOST.HOST_EMAIL_PWD) {
        email(req.body.HOST, req.body.TO_EMAIL, req.body.SUBJECT, req.body.TEMPLATE).then((data) => {
            return res.json(data);
        }).catch((error) => {
            return res.status(400).send(error);
        });
    }
    else {
        return res.status(400).send("provide valid Details");
    }
});

router.post('/vendorDtls', (req, res) => {
    const vendor = commonSmsEmail.vendorDetails(req.body.TYPE, req.body.ORG_ID, req.body.LOC_ID);
    if (vendor) return res.json(vendor);
    else return res.json({});
});

router.post('/getAllTemplate', (req, res) => {
    const templates = commonSmsEmail.templates((req.body.ORG_ID || null), (req.body.LOC_ID || null), null, "ALL");
    if (templates && templates.length > 0) return res.json(templates);
    else return res.json([]);
});

router.post('/getSingleTemplate', (req, res) => {
    if (req.body.TYPE && (type === "SMS" || type === "EMAIL") && req.body.ORG_ID && req.body.LOC_ID && req.body.REQ_TYPE_ID) {
        const template = commonSmsEmail.getTemplate(req.body.TYPE, req.body.ORG_ID, req.body.LOC_ID, req.body.REQ_TYPE_ID);
        if (template) return res.json(template);
        else return res.status(400).send("not matched records found with given request");
    }
    else return res.status(400).send("provide valid paramates");
});

router.post('/smsWithTemplate', (req, res) => {
    if (req.body.ORG_ID && req.body.LOC_ID && req.body.MOBILE_NO && req.body.TEMPLATE) {
        commonSmsEmail.smsWithTemplate(req.body.ORG_ID, req.body.LOC_ID, req.body.MOBILE_NO, req.body.TEMPLATE).then((resp) => {
            return res.json(resp);
        }).catch((error) => {
            return res.status(400).send("Error while sending sms");
        });
    }
    else return res.status(400).send("provide valid paramates");
});

router.post('/smsWithoutTemplate', (req, res) => {
    if (req.body.ORG_ID && req.body.LOC_ID && req.body.REQ_TYPE_ID && req.body.MOBILE_NO && req.body.SMS_REP_OBJ) {
        commonSmsEmail.smsWithoutTemplate(req.body.ORG_ID, req.body.LOC_ID, req.body.REQ_TYPE_ID, req.body.MOBILE_NO, req.body.SMS_REP_OBJ).then((resp) => {
            return res.json(resp);
        }).catch((error) => {
            return res.status(400).send("Error while sending sms");
        });
    }
    else return res.status(400).send("provide valid paramates");
});

router.post('/emailWithTemplate', (req, res) => {
    if (req.body.ORG_ID && req.body.LOC_ID && req.body.TO_EMAIL && req.body.BODY && req.body.SUBJECT) {
        commonSmsEmail.emailWithTemplate(req.body.ORG_ID, req.body.LOC_ID, req.body.TO_EMAIL, req.body.BODY, req.body.SUBJECT).then((resp) => {
            return res.json(resp);
        }).catch((error) => {
            return res.status(400).send("Error while sending sms");
        });
    }
    else return res.status(400).send("provide valid paramates");
});

router.post('/emailWithoutTemplate', (req, res) => {
    if (req.body.ORG_ID && req.body.LOC_ID && req.body.REQ_TYPE_ID && req.body.TO_EMAIL && req.body.EMAIL_REP_OBJ) {
        commonSmsEmail.emailWithoutTemplate(req.body.ORG_ID, req.body.LOC_ID, req.body.REQ_TYPE_ID, req.body.TO_EMAIL, req.body.EMAIL_REP_OBJ).then((resp) => {
            return res.json(resp);
        }).catch((error) => {
            return res.status(400).send("Error while sending sms");
        });
    }
    else return res.status(400).send("provide valid paramates");
});

router.post('/shSms', (req, res) => {
    const clientDet = getOrgLoc(req.body.CLIENT);
    if (clientDet.ORG_ID && clientDet.LOC_ID && req.body.MOBILE_NO && req.body.MESSAGE) {
        commonSmsEmail.smsWithTemplate(clientDet.ORG_ID, clientDet.LOC_ID, req.body.MOBILE_NO, req.body.MESSAGE).then((resp) => {
            //return res.json(resp);
            return res.json({status:200, message:resp.smsWTstatus});
        }).catch((error) => {
            return res.status(400).send("Error while sending sms");
        });
    }
    else return res.status(400).send("provide valid paramates");
});
router.get('/shSms', (req, res) => {
	
	//manually stoped by raja reddy 
	//return res.status(200).json("Call us, To implement this API URL");
	console.log("query",req.query);
	var clientName = req.query.CLIENT.toUpperCase() || req.query.FROM.toUpperCase();
	//manually this service will be stopped by raja reddy
	// if(clientName !="INTALK") clientName=1
	
	if((clientName === 'EMR') || (clientName === 'PSIMS') || (clientName === 'KIMSKON') || (clientName === 'KIMSSEC')|| (clientName === 'KDH')|| (clientName === 'INTALK') )
	{
		const clientDet = getOrgLoc(clientName);
		if (clientDet.ORG_ID && clientDet.LOC_ID && req.query.MOBILE_NO && req.query.MESSAGE) {
			console.log("clientDet",clientDet);
			req.query.TEMPLATEID = "1507161709697145086";
			commonSmsEmail.smsWithTemplate(clientDet.ORG_ID, clientDet.LOC_ID, req.query.MOBILE_NO, req.query.MESSAGE,"",req.query.TEMPLATEID).then((resp) => {
			console.log("resp",resp);
					var emailMESSAGE;
					if (clientDet.TEMPLATE) emailMESSAGE = clientDet.TEMPLATE.format({ "SMS_MSG": req.query.MESSAGE });
					commonSmsEmail.emailWithTemplate(clientDet.ORG_ID, clientDet.LOC_ID, clientDet.EMAIL_ADDR, emailMESSAGE, clientDet.SUBJECT).then((resp) => {
						if (resp && resp.emailWTstatus) {
							let _resp=JSON.parse(resp.emailWTstatus)
							winston.info({ "date": utilsDate.currentDate(12), "response": resp });
						}
						else {
							winston.info({ "date": utilsDate.currentDate(12), "response": resp });
						}
					}).catch((error) => {
						winston.info({ "date": utilsDate.currentDate(12), error:"Error while sending sms"});
					});
				
			
				return res.json({status:200, message:resp.smsWTstatus});
			}).catch((error) => {
				return res.status(400).send({status:400, message:"Error while sending sms"});
			});
		}
		else return res.status(400).send({status:400, message:"provide valid paramates 1"});
	}
	else{
		return res.status(400).send({status:400, message:`provide valid paramates 2 ${clientName}`});
	}
});

router.get('/shEmail/:CLIENT/:EMAIL/:MESSAGE', (req, res) => {
    try {
		winston.info({ "date": utilsDate.currentDate(12), "HEADERS": req.headers });
        const client = req.params.CLIENT;
        const clientDet = getOrgLoc(client.toUpperCase());
        if (clientDet && ( client.toUpperCase(req.params.CLIENT) === "PSIMS") ||
				client.toUpperCase(req.params.CLIENT) === "KIMSKON" || 
				client.toUpperCase(req.params.CLIENT) === "KIMSSEC"
		
		) {
            if (clientDet.ORG_ID && clientDet.LOC_ID && req.params.EMAIL && req.params.MESSAGE && clientDet.SUBJECT) {
                if (clientDet.TEMPLATE) req.params.MESSAGE = clientDet.TEMPLATE.format({ "SMS_MSG": req.params.MESSAGE });
                commonSmsEmail.emailWithTemplate(clientDet.ORG_ID, clientDet.LOC_ID, req.params.EMAIL, req.params.MESSAGE, clientDet.SUBJECT).then((resp) => {
                    if (resp && resp.emailWTstatus) {
						let _resp=JSON.parse(resp.emailWTstatus)
                        winston.info({ "date": utilsDate.currentDate(12), "response": resp });
                        return res.json({ status: 200, message: _resp.response });
                    }
                    else {
                        winston.info({ "date": utilsDate.currentDate(12), "response": resp });
                        return res.json({ status: 500, message: resp.emailWTerror });
                    }
                }).catch((error) => {
                    return res.status(400).send("Error while sending sms");
                });
            }
            else return res.status(400).send("provide valid paramates");
        }
        else return res.status(400).send("provide valid paramates");
    }
    catch (ex) {
        return res.status(500).json(ex.message);
    }
});

router.post('/smsdlr', (req, res) => {
	var payloadData = req.body;
	console.log('****************smsdlr payload********', payloadData);
	res.status(200).send("Test Message");
});

module.exports = router;
'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "PATIENT_PORTAL";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");
const smsEmail = require("../../../constants/sms-email/common");





router.all('/*', (req, res, next) => {

    try {
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": "PATIENT_PORTAL"
        };

        req.body = generateParams(req.body, req.cParams);

        next();
    }
    catch (ex) {
        console.log(ex)
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});

router.post('/getorglogo', (req, res) => {
    mapper(dbSchema.getOrgLogo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkuserlogin', (req, res) => {
    mapper(dbSchema.chkUserLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgKey', (req, res) => {
    mapper(dbSchema.getOrgKey, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insPortalUserSession', (req, res) => {
    mapper(dbSchema.insPortalUserSession, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPortalSession', (req, res) => {
    mapper(dbSchema.getPortalSession, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getPatDoc', (req, res) => {
    mapper(dbSchema.GetPatDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatapmnts', (req, res) => {
    mapper(dbSchema.getPatApmnts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getPatAdtDschrgSum', (req, res) => {
    mapper(dbSchema.getPatAdtDschrgSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOtp', (req, res) => {
    mapper(dbSchema.getOtp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/get7AvlDtsFrOlr', (req, res) => {
    mapper(dbSchema.get7AvlDtsFrOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllDoctors', (req, res) => {
    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getSltsFrOlr', (req, res) => {
    mapper(dbSchema.getSltsFrOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getLoginPatDet', (req, res) => {
    mapper(dbSchema.getLoginPatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdOtp', (req, res) => {
    mapper(dbSchema.insUpdOtp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updOtp', (req, res) => {
    mapper(dbSchema.updOtp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    }); 
});

router.post('/getDoctors', (req, res) => {
    mapper(dbSchema.getDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotsForRsrc', (req, res) => {
    mapper(dbSchema.getSlotsForRsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSltsFrOlr', (req, res) => {
    mapper(dbSchema.getSltsFrOlr, req.body, req.cParams).then((response) => {
        console.log(req.body)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getlocbyorg', (req, res) => {
    mapper(dbSchema.getLocByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getOrganizations', (req, res) => {
    mapper(dbSchema.getOrganizations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocation', (req, res) => {
    mapper(dbSchema.getLocation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocsrchbynamespec', (req, res) => {
    mapper(dbSchema.getDocSrchByName, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getspelzbyrsrc', (req, res) => {
    mapper(dbSchema.getRsRcSpelz, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocqualification', (req, res) => {
    mapper(dbSchema.getDocQualification, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocawards', (req, res) => {
    mapper(dbSchema.getDocAwards, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocmembership', (req, res) => {
    mapper(dbSchema.getDocMemb, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocrestrtion', (req, res) => {
    mapper(dbSchema.getDocReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getslotsbyolr', (req, res) => {
    mapper(dbSchema.getSlotsByOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/droprequest', (req, res) => {
    mapper(dbSchema.insUpdDropReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/holdslot', (req, res) => {
    mapper(dbSchema.holdSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updslot', (req, res) => {
    mapper(dbSchema.updSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getreasforvisit', (req, res) => {
    mapper(dbSchema.getReasForVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatrelmap', (req, res) => {
    mapper(dbSchema.getPatRelMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatient', (req, res) => {
    mapper(dbSchema.getPatient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpincodedet', (req, res) => {
    mapper(dbSchema.getPincdDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updpatinfo', (req, res) => {
    mapper(dbSchema.updPatInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdpatreq', (req, res) => {
    mapper(dbSchema.insUpdPatReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatreq', (req, res) => {
    mapper(dbSchema.getPatReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/changepassword', (req, res) => {
    mapper(dbSchema.changePassword, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updsession', (req, res) => {
    mapper(dbSchema.updSessLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

function getRandom() {
    var rand = Math.floor(1 + Math.random() * 10);
    if (rand == 10) return getRandom();
    else return rand.toString();
}

router.post('/verifyumrsendotp', (req, res) => {
    mapper(dbSchema.varifiUMRNumber, req.body, req.cParams).then(async (response) => {
        if (response && response.length > 0 && response[0].UMR_NO && response[0].MOBILE_NO) {
            const OTP = getRandom() + getRandom() + getRandom() + getRandom(),
                message = "Your confidential login for OTP is " + OTP + ". Do not disclose to any one";

            req.body.FLAG = "O";
            req.body.OTP = OTP;
            req.body.MOBILE_NO = response[0].MOBILE_NO;

            const resp = await smsEmail.smsWithTemplate(req.body.ORG_ID, req.body.LOC_ID, response[0].MOBILE_NO, message);
            if (resp && resp.smsWTerror) {
                req.body.SENT = "Y";
                req.body.SMS_JOBNO = resp.smsStatus;
            }
            else {
                req.body.SENT = "N";
                req.body.SMS_JOBNO = null;
            }

            mapper(dbSchema.varifiUMRNumber, req.body, req.cParams).then((resp) => {
                res.json(responseChange(resp, req.cParams));
            }).catch((error) => {
                res.status(400).send(error);
            });
        }
        else res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/verifyotp', (req, res) => {
    mapper(dbSchema.varifiUMRNumber, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/sendguestuserotp', async (req, res) => {
    if (req.body.MOBILE_NO && req.body.MOBILE_NO.length >= 10) {
        const OTP = getRandom() + getRandom() + getRandom() + getRandom(),
            message = "Your confidential login for OTP is " + OTP + ". Do not disclose to any one";

        const resp = await smsEmail.smsWithTemplate(req.body.ORG_ID, req.body.LOC_ID, req.body.MOBILE_NO, message);
        if (resp && resp.smsWTerror) res.json({ "status": false, "message": "SMS send Failed" });
        else res.json({ "status": true, "message": "SMS send Successfully", "mobileNo": req.body.MOBILE_NO, "OTP": OTP });
    }
    else res.json({ "status": false, "message": "Enter valid Mobile Number" });

});

module.exports = router;
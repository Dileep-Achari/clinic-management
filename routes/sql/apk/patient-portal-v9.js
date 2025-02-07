'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "PATIENT_PORTAL_V9";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");
const smsEmail = require("../../../constants/sms-email/common");

/**
 *getLocation
 *getOrganizations 
 * getSlotsForRsrc
 */

let returnOpt = {
    status: 200,
    data: {},
    statusmessage: 'SUCCESS',
    description: '',
    duration: 0
}
let failReturnOpt = {
    status: 400,
    data: {},
    statusmessage: 'FAIL',
    description: '',
    duration: 0
}


/* Formate Error Status */
function formateErrorMsg(msg, tm) {
    let objReturn = Object.assign({}, failReturnOpt);
    objReturn.description = msg;
    objReturn.duration = Date.now() - tm;
    return objReturn;
}


function _genrateOtp() {
    return Math.floor((999 + Math.random() * 9000));
}


router.all('/*', (req, res, next) => {

    try {
        req.exeStartTime = Date.now();
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": "PATIENT_PORTAL_V9"
        };

        req.body = generateParams(req.body, req.cParams);

        next();
    }
    catch (ex) {
        console.log(ex)
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});


router.post('/getAllDoctorsGeolocV9', (req, res) => {
    mapper(dbSchema.getAllDoctorsGeolocV9, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {

        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getSlotsForRsrc', (req, res) => {
    mapper(dbSchema.getSlotsForRsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});


router.post('/getOrgKey', (req, res) => {
    mapper(dbSchema.getOrgKey, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);

    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/insPortalUserSession', (req, res) => {
    console.log("insPortalUserSession", req.body)
    mapper(dbSchema.insPortalUserSession, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);

    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getPortalSession', (req, res) => {
    mapper(dbSchema.getPortalSession, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);

    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getAllOrganizations', (req, res) => {
    mapper(dbSchema.getAllOrganizations, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);

    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getAllLocations', (req, res) => {
    mapper(dbSchema.getAllLocations, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getSpecialitySpecialization', (req, res) => {
    mapper(dbSchema.getSpecialitySpecialization, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});


router.post('/getAllDoctors', (req, res) => {
    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        returnOpt.duration = Date.now() - req.exeStartTime;
        returnOpt.data = response;
        return res.json(returnOpt);
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});
router.post('/getPatientOtpLogin', (req, res) => {
    if (req.body && req.body.MOBILE_NO && req.body.MOBILE_NO.length > 9) {
        let PAT_OTP = _genrateOtp();
        req.body["PAT_OTP"] = PAT_OTP;
        mapper(dbSchema.getPatientOtpLogin, req.body, req.cParams).then((response) => {
            res.json(responseChange(response, req.cParams));
        }).catch((error) => {
            error = formateErrorMsg(error, req.exeStartTime);
            return res.status(500).json(error);
        });
    }
    else {
        return res.status(400).json(formateErrorMsg("Please povide a valid mobile number", req.exeStartTime));
    }
});

router.post('/verifyPatientOtpLogin', (req, res) => {
    if (req.body && req.body.MOBILE_NO && req.body.MOBILE_NO.length > 9) {
        mapper(dbSchema.getPatientOtpLogin, req.body, req.cParams).then((response) => {
            res.json(responseChange(response, req.cParams));
        }).catch((error) => {
            error = formateErrorMsg(error, req.exeStartTime);
            return res.status(500).json(error);
        });
    }
    else {
        return res.status(400).json(formateErrorMsg("Please povide a valid mobile number", req.exeStartTime));
    }
});



router.post('/getPatientUmrV9', (req, res) => {
    mapper(dbSchema.getPatientUmrV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getPatientV9', (req, res) => {
    mapper(dbSchema.getPatientV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        console.log("error", error)
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/insUpdPatientV9', (req, res) => {
    mapper(dbSchema.insUpdPatientV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getPatientDetByUmrV9', (req, res) => {
    mapper(dbSchema.getPatientDetByUmrV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getPatientOtpLogin', (req, res) => {
    let PAT_OTP = _genrateOtp();
    req.body["PAT_OTP"] = PAT_OTP;
    mapper(dbSchema.getPatientOtpLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/insPatienMapV9', (req, res) => {
    mapper(dbSchema.insPatienMapV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/insUpdPPComMsgReq', (req, res) => {
    mapper(dbSchema.insUpdPPComMsgReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getComMsgReq', (req, res) => {
    mapper(dbSchema.getComMsgReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});


router.post('/getAdmnDetailsV9', (req, res) => {
    mapper(dbSchema.getAdmnDetailsV9, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

router.post('/getCompleteApmnts', (req, res) => {
    mapper(dbSchema.getCompleteApmnts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});


router.post('/GetDoctorsSearchbyName', (req, res) => {
    mapper(dbSchema.uprGetDoctorsSearchbyNameSpclGeoloc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        error = formateErrorMsg(error, req.exeStartTime);
        return res.status(500).json(error);
    });
});

module.exports = router;

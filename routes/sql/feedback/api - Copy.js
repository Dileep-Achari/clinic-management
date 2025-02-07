'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "FEEDBACK";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const mapper = require("../../../db-config/mapper");
const winston = require("../../../services/winston")("hl7");
const { currentDate } = require("../../../utilities/dates");
const _ = require("underscore");
const token = require("../../../services/token");

router.get('/', (req, res) => {
    res.json(200);
});

/** Write token generation method */


/*function verifyToken(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    else {
        if (req.url === "/chkUsrLogin" || req.url === "/InsUsrSession" || req.url === "/getIpUsrValdLogin" ||req.url=== "/postFeedbackInfo") {
            next();
        }
        else {
            if (!req.headers.authtoken) {
                res.status(407).send({
                    status: "INVALID-REQUEST",
                    details: "Request headers does not contain 'authtoken'.",
                });
            }
            else {
                token.verifyToken(req.headers.authtoken).then((data) => {
                    if (!req.body) req.body = {};
                    req.body.IP_SESSION_ID = data.IP_SESSION_ID;
                    next();
                }).catch((error) => {
                    res.status(401).send({
                        status: "FAILED",
                        details: "Authentication failed, invalid token",
                    });
                });
            }
        }
    }
}*/




router.all('/*', (req, res, next) => {
    try {
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": MODULE_NAME
        };
        req.body = generateParams(req.body, req.cParams);
        next();
    }
    catch (ex) {
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});


function log(message, status) {
    if (typeof message !== 'string') message = JSON.stringify(message);
    winston.info({
        date: currentDate(),
        message: `${status}:${message}`
    });
};

router.post('/InsUsrSession', (req, res) => {
    try {
        mapper(dbSchema.InsUsrSession, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/postFeedbackInfo', (req, res) => {
    try {
        log(req.body, "body params");
        mapper(dbSchema.insupdPatientFeedbackInfo, req.body, req.cParams).then((response) => {
            log(response, "success");
            if (response && response.length) {
                response = response[0];
                if (response.ERRORMSG && response.ERRORLINE) {
                    log(response, "error");
                    return res.status(400).send({ STATUS: 400, STATUS_DESC: "FAIL", STATUS_MSG: error });
                }
            }
            return res.status(200).send({ STATUS: 200, STATUS_DESC: "SUCCESS", STATUS_MSG: response });
        }).catch((error) => {
            log(error, "error");
            res.status(400).send({ STATUS: 400, STATUS_DESC: "FAIL", STATUS_MSG: error });
        });
    }
    catch (ex) {
        log(ex, "catch error");
        res.status(400).send({ STATUS: 400, STATUS_DESC: "FAIL", STATUS_MSG: ex });
    }

});

router.post('/getPatientFeedbackInfo', (req, res) => {
    try {
        mapper(dbSchema.getPatientFeedbackInfo, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getCheckPatFbStatus', (req, res) => {
    try {
        mapper(dbSchema.getCheckPatFbStatus, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

/*this is get methods*/
router.post('/getPatientData', (req, res) => {
    try {
        mapper(dbSchema.getPatientData, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});



router.post('/getFbDeptByScr', (req, res) => {
    try {
        mapper(dbSchema.getFbDeptByScr, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getFbPatDpScr', (req, res) => {
    try {
        mapper(dbSchema.getFbPatDpScr, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getFbDepartment', (req, res) => {
    try {
        mapper(dbSchema.getFbDepartment, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getTempDashBord', (req, res) => {
    try {
        mapper(dbSchema.getTempDashBord, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbMastData', (req, res) => {
    try {
		console.log("getFbMastData",req.body)
        req.cParams.IS_MULTI_RESULTSET = "Y"
        mapper(dbSchema.getFbMastData, req.body, req.cParams).then((response) => {
			console.log("getFbMastData---response",response)
            return res.json(response);
        }).catch((error) => {
			console.log("getFbMastData----error",error)
            res.status(400).send(error);
        });
    }
    catch (ex) {
		console.log("getFbMastData----ex",ex)
        res.status(400).send(ex);
    }
});

router.post('/getFbformPatValGrid', (req, res) => {
    try {
        mapper(dbSchema.getFbformPatValGrid, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbTemplte', (req, res) => {
    try {
        mapper(dbSchema.getFbTemplte, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbFrmRpt', (req, res) => {
    try {
        mapper(dbSchema.getFbFrmRpt, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbComMsgReqById', (req, res) => {
    try {
        mapper(dbSchema.getFbComMsgReqById, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/UserGrid', (req, res) => {
    try {
        mapper(dbSchema.UserGrid, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getRoles', (req, res) => {
    try {
        mapper(dbSchema.getRoles, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getQuestionGroup', (req, res) => {
    try {
        mapper(dbSchema.getQuestionGroup, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getDocumentsByRole', (req, res) => {
    try {
        mapper(dbSchema.getDocumentsByRoles, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getRoleDocAccess', (req, res) => {
    try {
        mapper(dbSchema.getRoleDocAccess, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getQsgQsPsScr', (req, res) => {
    try {
        mapper(dbSchema.getQsgQsPsScr, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getFBdataByGrpId', (req, res) => {
    try {
        mapper(dbSchema.getFBdataByGrpId, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getIpUsrValdLogin', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y";
        mapper(dbSchema.getIpUsrValdLogin, req.body, req.cParams).then((response) => {
            return res.status(200).json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/chkUsrLogin', (req, res) => {
    try {
        mapper(dbSchema.getLoginUser, req.body, req.cParams).then((response) => {
           // let resData = token.createToken({ IP_SESSION_ID: req.body.IP_SESSION_ID, ORG_ID: 2 ,LOC_ID:1});
            return res.status(200).json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});
/*this is post method*/
router.post('/InUpchangePsw', (req, res) => {
    try {
        mapper(dbSchema.InUpchangePsw, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});



router.post('/InsUpdusers', (req, res) => {
    try {
        mapper(dbSchema.InsUpdusers, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/UpdResetPwd', (req, res) => {
    try {
        mapper(dbSchema.UpdResetPwd, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/EmployeeDeactive', (req, res) => {
    try {
        mapper(dbSchema.EmployeeDeactive, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/InUpdRoleDocAccess', (req, res) => {
    try {
        mapper(dbSchema.InUpdRoleDocAccess, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/InsupdFbTmplteQGrp', (req, res) => {
    try {
        mapper(dbSchema.InsupdFbTmplteQGrp, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/InsupdFbQuestionScore', (req, res) => {
    try {
        mapper(dbSchema.InsupdFbQuestionScore, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/InsUsrSession', (req, res) => {
    try {
        mapper(dbSchema.uprInsUserSession, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/InsupdFbControlValueSet', (req, res) => {
    try {
        mapper(dbSchema.InsupdFbControlValueSet, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/InsupdQuestionGroup', (req, res) => {
    try {
        mapper(dbSchema.InsupdQuestionGroup, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/DltTmpltQstions', (req, res) => {
    try {
        mapper(dbSchema.DltTmpltQstions, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getEntSingle', (req, res) => {
    try {
        mapper(dbSchema.getEntSingle, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/FbActnData', (req, res) => {
    try {
        mapper(dbSchema.FbActnData, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/uprGetTemplateQsdtls', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y";
        mapper(dbSchema.uprGetTemplateQsdtls, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbFormData', (req, res) => {
    try {
        mapper(dbSchema.getFbFormData, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/InsupdFeedbackFormControl', (req, res) => {
    try {
        mapper(dbSchema.InsupdFeedbackFormControl, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/uprGetFbTemplate', (req, res) => {
    try {
        mapper(dbSchema.uprGetFbTemplate, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/GetFBAnalyticsRpt', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y"
        mapper(dbSchema.GetFBAnalyticsRpt, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getFbMnthTrnds', (req, res) => {
    try {
        mapper(dbSchema.getFbMnthTrnds, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/GetPatFBSmsCountRpt', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y"
        mapper(dbSchema.GetPatFBSmsCountRpt, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/FbGridData', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y"
        mapper(dbSchema.FbGridData, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getTmpQsDtls', (req, res) => {
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y"
        mapper(dbSchema.getTmpQsDtls, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});
router.post('/getChartGrid', (req, res) => {
    try {
        mapper(dbSchema.getChartGrid, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});
router.post('/getFbFrmRptNew', (req, res) => {
    try {
        mapper(dbSchema.getFbFrmRptNew, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/UprUpdfbKapaGroupHead', (req, res) => {
    try {
        mapper(dbSchema.UprUpdfbKapaGroupHead, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/updFbFormPrevAct', (req, res) => {
    try {
        mapper(dbSchema.updFbFormPrevAct, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});


router.post('/getQuesAgstCtrlValSet', (req, res) => {
    try {
        mapper(dbSchema.getQuesAgstCtrlValSet, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});
router.post('/getNpsUsage', (req, res) => {
    try {
        mapper(dbSchema.getNpsUsage, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});
module.exports = router;
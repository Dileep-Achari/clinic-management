'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "QI";
const dbSchema = require("../../../db-config/helper-methods/pg/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/pg/response-change");
const generateParams = require("../../../db-config/helper-methods/pg/generate-paramaters");
const mapper = require("../../../db-config/mapper");
const excel = require('../../../services/excel');
const { verifyToken } = require('../../../services/token');
const  filters = require('./const/filters');

function isValid(req, res, next) {
	
	//console.log("body:",req.body);
    /**
     * In headers must be token, username, date
     */
    if (req.headers["x-force-load"] === "Y") {
        next();
    }
	else if (req.body["x-force-load"] === "Y") {
        next();
    }
    else if (req.headers["x-token"] && req.headers["x-username"] && req.headers["x-date"]) {
        verifyToken(req.headers["x-token"]).then(decode => {
            if (decode && decode.USER_NAME && decode.SESSION_ID && decode.DATE_TIME && (decode.USER_NAME === req.headers["x-username"]) && (decode.DATE_TIME === parseInt(req.headers["x-date"]))) {
                req.body.session_id = decode.SESSION_ID;
                next();
            }
            else {
                res.status(400).send("Invalid Token");
            }
        }).catch(ex => {
            res.status(400).send("Error While Parse Token, " + ex.message);
        });
    }
    else if (req.query && Object.keys(req.query) && Object.keys(req.query).length > 0 && req.query.force === "Y") {
        verifyToken(req.query.token).then(decode => {
            delete req.query.token;
            delete req.query.force;
            if (decode && decode.SESSION_ID) {
                req.query.session_id = decode.SESSION_ID;
                next();
            }
            else {
                res.status(400).send("Invalid Token");
            }
        }).catch(ex => {
            res.status(400).send("Error While Parse Token, " + ex.message);
        });
    }
    else {
        res.status(400).send("Invalid Request");
    }
}

router.all('/*', isValid, (req, res, next) => {
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

router.post('/insUpdOperTheater', (req, res) => {
    mapper(dbSchema.insUpdOperTheater, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOperTheater', (req, res) => {
    mapper(dbSchema.getOperTheater, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdQiBed', (req, res) => {
    mapper(dbSchema.insUpdQiBed, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQiBed', (req, res) => {
    mapper(dbSchema.getQiBed, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEntity', (req, res) => {
    mapper(dbSchema.insUpdEntity, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntity', (req, res) => {
    mapper(dbSchema.getEntity, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMasterData', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** path */
router.get('/getMasterData', (req, res) => {
    req.cParams.URL = "getMasterData";
    mapper(dbSchema.getMasterData, req.query, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOtSurgeryMast', (req, res) => {
    mapper(dbSchema.getOtSurgeryMast, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** Patch */
router.get('/getOtSurgeryMast', (req, res) => {
    mapper(dbSchema.getOtSurgeryMast, req.query, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOtTheaterMast', (req, res) => {
    mapper(dbSchema.getOtTheaterMast, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** Patch */
router.get('/getOtTheaterMast', (req, res) => {
    mapper(dbSchema.getOtTheaterMast, req.query, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSearch', (req, res) => {
    mapper(dbSchema.getPatSearch, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDet', (req, res) => {
    mapper(dbSchema.getPatDet, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDefChkInfo', (req, res) => {
    mapper(dbSchema.getDefChkInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdDefChkInfo', (req, res) => {
    mapper(dbSchema.insUpdDefChkInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uploadImage', (req, res) => {
    req.body.img_binary = req.body.img_binary ? ("\\x" + new Buffer.from((req.body.img_binary.split(';base64,')[1]), 'base64').toString('hex')) : "";
    req.body = generateParams(req.body, req.cParams);
    mapper(dbSchema.insUpdImage, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getImage', (req, res) => {
    mapper(dbSchema.getImage, req.body, req.cParams).then((response) => {
        if (response.RES_OBJ && response.RES_OBJ.length > 0) {
            for (var image of response.RES_OBJ) {
                if (image.img_binary) image.img_binary = `data:${image.mime_type || 'image/jpeg'};base64,` + new Buffer.from(image.img_binary).toString('base64');
            }
            res.json(response);
        }
        else res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIndctrMonDta', (req, res) => {
    mapper(dbSchema.getIndctrMonDta, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIndctrMonDta', (req, res) => {
    mapper(dbSchema.insUpdIndctrMonDta, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIndctTranInfo', (req, res) => {
    mapper(dbSchema.getIndctTranInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIndctTranInfo', (req, res) => {
    mapper(dbSchema.insUpdIndctTranInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatInfo', (req, res) => {
    mapper(dbSchema.getPatInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEleWtrCon', (req, res) => {
    mapper(dbSchema.insUpdEleWtrCon, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEleWtrCon', (req, res) => {
    mapper(dbSchema.getEleWtrCon, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCrtlEquWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdCrtlEquWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCrtlEquWrkpInfo', (req, res) => {
    mapper(dbSchema.getCrtlEquWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEquMas', (req, res) => {
    mapper(dbSchema.insUpdEquMas, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEquMas', (req, res) => {
    mapper(dbSchema.getEquMas, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdAsmntWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdAsmntWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAsmntWrkpInfo', (req, res) => {
    mapper(dbSchema.getAsmntWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprActiveInactive', (req, res) => {
    mapper(dbSchema.uprActiveInactive, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updAppUnapp', (req, res) => {
    mapper(dbSchema.updAppUnapp, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEmpWrkngDignWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdEmpWrkngDignWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEmpWrkngDignWrkpInfo', (req, res) => {
    mapper(dbSchema.getEmpWrkngDignWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBioMedEngSrvWrkpInfo', (req, res) => {
    mapper(dbSchema.getBioMedEngSrvWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdBioMedEngSrvWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdBioMedEngSrvWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIndctTranInfo', (req, res) => {
    mapper(dbSchema.insUpdIndctTranInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdPrcRepCliDiagWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdPrcRepCliDiagWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPrcRepCliDiagWrkpInfo', (req, res) => {
    mapper(dbSchema.getPrcRepCliDiagWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdHandHygenWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdHandHygenWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHandHygenWrkpInfo', (req, res) => {
    mapper(dbSchema.getHandHygenWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIndTran', (req, res) => {
    mapper(dbSchema.insUpdIndTran, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNumRepErs', (req, res) => {
    mapper(dbSchema.getNumRepErs, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdNumRepErs', (req, res) => {
	//for mobile app only use this condition
    if(req.body.flag!='undefined'&&req.body.flag=='mob')   req.body.num_rep_errors=JSON.stringify(req.body.num_rep_errors)
    //console.log("body=====insUpdNumRepErs",req.body)
    mapper(dbSchema.insUpdNumRepErs, req.body, req.cParams).then((response) => {
		//console.log("body=====response",response)
        res.json(response);
    }).catch((error) => {
		//console.log("error-------",error)
        res.status(400).send(error);
    });
});

router.post('/insUpdIncdntRptng', (req, res) => {
    mapper(dbSchema.insUpdIncdntRptng, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIncdntRptng', (req, res) => {
    mapper(dbSchema.getIncdntRptng, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdInfCtrlWrkpInfo', (req, res) => {
    mapper(dbSchema.insUpdInfCtrlWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInfCtrlWrkpInfo', (req, res) => {
    mapper(dbSchema.getInfCtrlWrkpInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdInftnSrvlnc', (req, res) => {
    mapper(dbSchema.insUpdInftnSrvlnc, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInftnSrvlnc', (req, res) => {
    mapper(dbSchema.getInftnSrvlnc, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllMasters', (req, res) => {
    mapper(dbSchema.getFormMaster, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** Patch */
router.get('/getAutoComplete', (req, res) => {
    req.cParams.URL = "getAutoComplete";
    mapper(dbSchema.getAutoComplete, req.query, req.cParams).then((response) => {
        res.json(response.RES_OBJ);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** Patch */
router.get('/excel', (req, res) => {
	//console.log("excel-response",req.query);
    mapper(dbSchema.getExcelData, req.query, req.cParams).then((response) => {
		console.log("excel-response",response);
        excel(response.RES_OBJ, function (wb) {
            wb.write(`${req.query.name || ExcelFile}.xlsx`, res);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEmployee', (req, res) => {
    mapper(dbSchema.insUpdEmployee, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEmployee', (req, res) => {
    mapper(dbSchema.getEmployee, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPermissions', (req, res) => {
    mapper(dbSchema.getPermissions, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdRoleDocAccess', (req, res) => {
    mapper(dbSchema.insUpdRoleDocAccess, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdUserDocAccess', (req, res) => {
    mapper(dbSchema.insUpdUserDocAccess, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdComMsgReq', (req, res) => {
    mapper(dbSchema.insUpdComMsgReq, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComMsgReqType', (req, res) => {
    mapper(dbSchema.getComMsgReqType, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormPrint', (req, res) => {
    mapper(dbSchema.getFormPrint, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdInfctionSurv', (req, res) => {
    mapper(dbSchema.insUpdInfctionSurv, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInfctionSurv', (req, res) => {
    mapper(dbSchema.getInfctionSurv, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getWorkupForm', (req, res) => {
    mapper(dbSchema.getWorkupForm, req.body, req.cParams).then((response) => {
	    //console.log("getWorkupFormDB-----------------",response)
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdMedicErr', (req, res) => {
    mapper(dbSchema.insUpdMedicErr, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocs', (req, res) => {
    mapper(dbSchema.getDocs, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/logout', (req, res) => {
    mapper(dbSchema.logout, req.body, req.cParams).then((response) => {
        if (response.RES_OBJ && response.RES_OBJ[0] && response.RES_OBJ[0].CODE === 1) {
            res.json(response.RES_OBJ[0]);
        }
        else {
            res.status(400).send(response.RES_OBJ);
        }
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updChangePwd', (req, res) => {
    mapper(dbSchema.updChangePwd, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOpClinicalData', (req, res) => {
    mapper(dbSchema.getOpClinicalData, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetQiReports', (req, res) => {
    mapper(dbSchema.uprGetQiReports, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFiltersJson', (req, res) => {
    try {
        let response = filters.filtersFn(req.body.form_type_cd);
        res.json(response);
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/uprInsupdNurseRatio', (req, res) => {
    mapper(dbSchema.uprInsupdNurseRatio, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetIndicatorMonthlydataCnt', (req, res) => {
    mapper(dbSchema.uprGetIndicatorMonthlydataCnt, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdIndicatorMonthlyData', (req, res) => {
    mapper(dbSchema.uprInsupdIndicatorMonthlyData, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprInsupFormMaster', (req, res) => {
    mapper(dbSchema.uprInsupFormMaster, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
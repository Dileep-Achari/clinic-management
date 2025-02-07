'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "COVID_PATIENT";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");

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

router.post('/getIpClinicalData', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
	//console.log("getIpClinicalData:-",req.body);
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
		// console.log(req.body, response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		console.log("getIpClinicalData-error",error);
        res.status(400).send(error);
    });
});


router.post('/updLabelTranInfoMob', (req, res) => {
	//console.log("updLabelTranInfoMob:-",req.body);
    mapper(dbSchema.updLabelTranInfoMob, req.body, req.cParams).then((response) => {
        // console.log(req.body, response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		//console.log("updLabelTranInfoMob-error",error);
        res.status(400).send(error);
    });
});

router.post('/uprGetUmrValidate', (req, res) => {
	//console.log("uprGetUmrValidate",req.body)
    mapper(dbSchema.uprGetUmrValidate, req.body, req.cParams).then((response) => {
         //console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		console.log("uprGetUmrValidate-error",error);
        res.status(400).send(error);
    });
});


router.post('/getVisitsMob', (req, res) => {
    mapper(dbSchema.getVisitsMob, req.body, req.cParams).then((response) => {
        // console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdVitalSignsMob', (req, res) => {
    mapper(dbSchema.insUpdVitalSignsMob, req.body, req.cParams).then((response) => {
        // console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLabelTranInfoMob', (req, res) => {
    mapper(dbSchema.getLabelTranInfoMob, req.body, req.cParams).then((response) => {
        // console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormLableMap', (req, res) => {
    mapper(dbSchema.getFormLableMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUpdVcIpOpDet', (req, res) => {
    mapper(dbSchema.getUpdVcIpOpDet, req.body, req.cParams).then((response) => {
        // console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsUpdTeleIpOp', (req, res) => {
    mapper(dbSchema.uprInsUpdTeleIpOp, req.body, req.cParams).then((response) => {
        // console.log(req.body, response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatEcgData', (req, res) => {
    mapper(dbSchema.uprGetPatEcgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
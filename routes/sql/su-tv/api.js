'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "SU_TV";
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

router.post('/getByGid', (req, res) => {
    mapper(dbSchema.getByGid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTokenData', (req, res) => {
    mapper(dbSchema.getTokenData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorTvDisplay', (req, res) => {
    mapper(dbSchema.getDoctorTvDisplay, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorFmtDet', (req, res) => {
    mapper(dbSchema.getDoctorFmtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprGetMasterDataNst', (req, res) => {
    mapper(dbSchema.uprGetMasterDataNst, req.body, req.cParams).then((response) => {
		//console.log("uprGetMasterDataNst-response",response);
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getGuidDataByPg', (req, res) => {
    mapper(dbSchema.getGuidDataByPg, req.body, req.cParams).then((response) => {
		console.log("getGuidDataByPg-response",response);
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

module.exports = router;
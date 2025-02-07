'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "PDF_APPT";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");

router.get('/', (req, res) => {
    res.json(200);
});

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

router.post('/getPrntInfo', (req, res) => {
    mapper(dbSchema.getPrntInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updPrntInfo', (req, res) => {
    if (req.body && req.body.PRINT_DATA) req.body.PRINT_DATA = new Buffer.from(req.body.PRINT_DATA, "base64");
    if (req.body && req.body.PRINT_DATA_TOTAL) req.body.PRINT_DATA_TOTAL = new Buffer.from(req.body.PRINT_DATA_TOTAL, "base64");
    mapper(dbSchema.updPrntInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPdfBySrtUrl', (req, res) => {
    mapper(dbSchema.getPrtDtaBySrtUrl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
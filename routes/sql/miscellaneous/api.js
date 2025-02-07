'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "MISCELLANEOUS";
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

router.post('/insUpdRameshDemo', (req, res) => {
    mapper(dbSchema.uprinsupdrameshdemo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRameshDemo', (req, res) => {
    mapper(dbSchema.uprgetrameshdemo, req.body, req.cParams).then((response) => {
        if (response && response.length > 0) {
            for (let obj in response) {
                for (let key in response[obj]) {
                    if (!response[obj][key]) response[obj][key] = "";
                }
            }
            res.json(responseChange(response, req.cParams));
        } else res.json([]);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/getRameshDemo', (req, res) => {
    mapper(dbSchema.uprgetrameshdemo, req.query, req.cParams).then((response) => {
        if (response && response.length > 0) {
            for (let obj in response) {
                for (let key in response[obj]) {
                    if (!response[obj][key]) response[obj][key] = '';
                }
            }
            res.json(responseChange(response, req.cParams));
        } else res.json([]);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
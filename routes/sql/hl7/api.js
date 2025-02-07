'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "HL7";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const mapper = require("../../../db-config/mapper");
const winston = require("../../../services/winston")("hl7");
const { currentDate } = require("../../../utilities/dates");
const fs = require("fs");


function log(message, status) {
    if (typeof message !== 'string') message = JSON.stringify(message);
    winston.info({
        date: currentDate(),
        message: `${status}:${message}`
    });
}

router.get('/', (req, res) => {
    res.json(200);
});

router.post('/pHL7Data', (req, res) => {
	//console.log("hl7 data" ,req.headers)
    if (!req.headers.migid) {
        log("migid is required", "error");
        res.status(400).send({ STATUS: 400, STATUS_DESC: "FAIL", STATUS_MSG: "Required MIGID ..." });
    }
    else {
        try {
            //if (req.headers.hl7msg) req.headers.hl7msg = req.headers.hl7msg.substr(2, req.headers.hl7msg.length - 4);
            let iParams = {
                XML: req.headers.hl7msg,
                MIG_ID: req.headers.migid
            };
            log(iParams, "body params");
            mapper(dbSchema.insHL7data, iParams, req.cParams).then((response) => {
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
    }
});

router.get('/gHL7Data', (req, res) => {
    try {
        fs.appendFileSync("E://hl7_log/vitals.txt", JSON.stringify(req.query));
        return res.json({ STATUS: "SUCCESS", STATUS_CODE: 1, MESSAGE: "Inserted successfully.." });
    }
    catch (ex) {
        return res.json({ STATUS: "ERROR", STATUS_CODE: 0, MESSAGE: ex.message });
    }

});


module.exports = router;
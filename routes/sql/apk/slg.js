'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "SLG_OP_API";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");
const token = require("../../../services/token");

router.get('/', (req, res) => {
    res.json(200)
});

function verifyToken(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    else {
        if (req.url === "/genToken") {
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
}

router.all('/*', verifyToken, (req, res, next) => {
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

/** Write token generation method */
router.post('/genToken', (req, res) => {
    if (req.body.IP_SESSION_ID && req.body.ORG_ID && req.body.LOC_ID) {
        res.send(token.createToken({ IP_SESSION_ID: req.body.IP_SESSION_ID, ORG_ID: 2, LOC_ID: 1 }));
    }
    else {
        res.send("acepted paramates are IP_SESSION_ID, ORG_ID, LOC_ID");
    }
});

/* To get All Specialities 
 * params {}
*/
router.post('/getAllSpecialities', (req, res) => {
    mapper(dbSchema.getAllSpecialities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get  Doctors based on Speciality Id
 *  params { "spcltyId" : 4 }
**/
router.post('/getDoctorsBySplciality', (req, res) => {
    mapper(dbSchema.getDoctorsBySplciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/**
 * to get doctor schedule times
 * params    { "olrId": 572,"fromDt": "02/01/2019","toDt": "02/11/2019"}
 */

router.post('/getDocSchTimes', (req, res) => {
    mapper(dbSchema.getDocSchTimes, req.body, req.cParams).then((response) => {
        console.log(req.body, "req.params", req.cParams);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To Book  Appointment as a Guest User you can pass patId=0,   To Book  Appointment as a Register User you can pass patId=Patient Id
 *  params { "id"        : 106669240,
 *           "patName"   : "RAMAKRISHNA REDDY U",
 *           "mobileNo"  : "9866554343",
 *           "emailId"   : "",
 *           "genderCd"  : "M",
 *           "stateName" : "Madya Pradesh",
 *           "cityName"  : "Hyderabad",
 *           "patId"     : 692773
 *         }
**/

router.post('/bookAppointment', (req, res) => {
    mapper(dbSchema.bookAppointment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/** To get Slot Details By OLR_ID
 *  params { "id"      : 7256,
 *           "aptDate" : "7/1/2019"
 *         }
**/
router.post('/getSlots', (req, res) => {
    mapper(dbSchema.getSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
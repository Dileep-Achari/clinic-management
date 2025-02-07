'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "HL7";
//const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
//const responseChange = require("../../../db-config/helper-methods/sql/response-change");
//const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
//const mapper = require("../../../db-config/mapper");
//const token = require("../../../services/token");
const fs = require("fs");
const msgs = require("./common");

router.get('/', (req, res) => {
    res.json(200)
});

// function verifyToken(req, res, next) {
//     if (req.method === 'OPTIONS') {
//         next();
//     }
//     else {
//         if (req.url === "/genToken") {
//             next();
//         }
//         else {
//             if (!req.headers.authtoken) {
//                 res.status(407).send({
//                     status: "INVALID-REQUEST",
//                     details: "Request headers does not contain 'authtoken'.",
//                 });
//             }
//             else {
//                 token.verifyToken(req.headers.authtoken).then((data) => {
//                     if (!req.body) req.body = {};
//                     req.body.IP_SESSION_ID = data.IP_SESSION_ID;
//                     next();
//                 }).catch((error) => {
//                     res.status(401).send({
//                         status: "FAILED",
//                         details: "Authentication failed, invalid token",
//                     });
//                 });
//             }
//         }
//     }
// }

// router.all('/*', verifyToken, (req, res, next) => {
//     try {
//         req.cParams = {
//             "URL": req.url.substr(1, req.url.length),
//             "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
//             "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
//             "MODULE": MODULE_NAME
//         };
//         req.body = generateParams(req.body, req.cParams);
//         next();
//     }
//     catch (ex) {
//         res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
//     }
// });


router.post('/insertHl7Data', (req, res) => {
    if (req.body.migid) {
        if (req.body.msg_type && req.body.msg_type != '') {
            let _valid_events = [];
            for (let i in msgs) {
                if (msgs[i].type === req.body.msg_type) {
                    for (let j in msgs[i].valid_events) {
                        if (req.body.evenet_type === j) {
                            if (req.body.umr_no) {
                                if (req.body.data) {
                                    fs.writeFileSync("d://hl7/vitals.txt", req.body.data)
                                }
                                else {
                                    return res.json({ STATUS: "FAIL", STATUS_CODE: 4, MESSAGE: "Please provide data" })
                                }
                            }
                            else {
                                return res.json({ STATUS: "FAIL", STATUS_CODE: 3, MESSAGE: "Please provide UMR No" })
                            }
                        }
                        else {
                            return res.json({ STATUS: "FAIL", STATUS_CODE: 2, MESSAGE: "Please provide Valid data" })
                        }

                    }
                }
            }

        }
        else {
            return res.json({ STATUS: "FAIL", STATUS_CODE: 1, MESSAGE: "Please provide Message Type" })
        }
    }
    else {
        return res.json({ STATUS: "FAIL", STATUS_CODE: 0, MESSAGE: "Please provide migid" })
    }
});

module.exports = router;
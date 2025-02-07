'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "QI";
const dbSchema = require("../../../db-config/helper-methods/pg/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/pg/response-change");
const generateParams = require("../../../db-config/helper-methods/pg/generate-paramaters");
const mapper = require("../../../db-config/mapper");
const { createToken } = require('../../../services/token');

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


function getDocs(cParams, params) {
    return new Promise((resolve, reject) => {
        mapper(dbSchema.getAccessDocs, params, cParams).then((response) => {
            resolve({ data: response, error: null });
        }).catch((error) => {
            resolve({ data: null, error: error });
        });
    });
}

router.post('/login', (req, res) => {
    if (req.body.USER_NAME && req.body.PASSWORD && req.body.ORG_ID && req.body.LOC_ID && req.body.LOC_KEY) {
        mapper(dbSchema.login, {
            user_name: req.body.USER_NAME,
            password: req.body.PASSWORD,
            loc_key: req.body.LOC_KEY,
            org_id: req.body.ORG_ID,
            loc_id: req.body.LOC_ID
        }, req.cParams).then(async (response) => {
            if (response.RES_OBJ && response.RES_OBJ[0] && !(response.RES_OBJ[0].CODE === 0)) {
                const loginDate = Date.parse(new Date());
                const { data, error } = await getDocs(req.cParams, { role_id: response.RES_OBJ[0].role_id, session_id: response.RES_OBJ[0].session_id });
                const sessionId = response.RES_OBJ[0].session_id;
                delete response.RES_OBJ[0].session_id;
                if (error) {
                    // error handle here
                }
                const returnUser = {
                    ...response.RES_OBJ[0],
                    loginDate: loginDate,
                    token: createToken({ USER_NAME: response.RES_OBJ[0].user_name, SESSION_ID: sessionId, ORG_ID: parseInt(response.RES_OBJ[0].org_id), LOC_ID: parseInt(response.RES_OBJ[0].loc_id), LOC_KEY: req.body.LOC_KEY, DATE_TIME: loginDate }),
                    documents: data && data.RES_OBJ ? data.RES_OBJ : []
                };
                return res.json({ RES_OBJ: [returnUser], DB_EXEC: null });
            }
            else {
                res.status(400).send(response.RES_OBJ[0]);
            }
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    else {
        res.status(400).send("Provide username and password and all the other mandatory details");
    }
    // const users = [
    //     { username: 'kpa1', password: 'password01', location: 'Aayush Hospitals, Vijayawada', orgId: 1003, locId: 1004, sessionId: 11, role: "NURSE" },
    //     { username: 'qi', password: 'password01', location: 'Aayush Hospitals, Vijayawada', orgId: 1003, locId: 1004, sessionId: 11, role: "QUALITY" },
    //     { username: 'prime', password: 'password01', location: 'Ameerpet', orgId: 1001, locId: 1001, sessionId: 14, role: "NURSE" },
    //     { username: 'primeqi', password: 'password01', location: 'Ameerpet', orgId: 1001, locId: 1001, sessionId: 14, role: "QUALITY" }
    // ];

    // if (req.body.USER_NAME && req.body.PASSWORD) {
    //     const user = users.find(function (user) {
    //         return user.username === req.body.USER_NAME && user.password === req.body.PASSWORD && user.orgId === req.body.ORG_ID;
    //     });
    //     if (user) {
    //         const loginDate = Date.parse(new Date());
    //         const { data, error } = await getDocs();
    //         const returnUser = {
    //             username: user.username,
    //             location: user.location,
    //             orgId: user.orgId,
    //             locId: user.locId,
    //             loginDate: loginDate,
    //             role: user.role,
    //             token: createToken({ USER_NAME: user.username, SESSION_ID: user.sessionId, DATE_TIME: loginDate }),
    //             documents: data && data.RES_OBJ ? data.RES_OBJ : []
    //         };
    //         return res.json({ RES_OBJ: [returnUser], DB_EXEC: null });
    //     }
    //     else {
    //         res.status(400).send("Invalid username and password");
    //     }
    // }
    // else {
    //     res.status(400).send("Provide username and password, these are mandatory fields");
    // }
});

router.post('/getOrgLocInfo', (req, res) => {
    mapper(dbSchema.getOrgInfo, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
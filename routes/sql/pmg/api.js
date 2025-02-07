'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "PMG";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");


router.get("/", (req, res) => {
    return res.send("PMG API Working fine..")
})


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

router.post('/uprGetPharmacologyDetails',(req,res)=>{
    mapper(dbSchema.uprGetPharmacologyDetails,req.body,req.cParams).then((response)=>{
        return res.json(response);
    }).catch((error)=>{
return res.status(400).send(error);
    })
})

router.post('/uprInsupdPharmacologyDetails',(req,res)=>{
    mapper(dbSchema.uprInsupdPharmacologyDetails,req.body,req.cParams).then((response)=>{
        return res.json(response);
    }).catch((error)=>{
return res.status(400).send(error);
    })
})

module.exports = router;
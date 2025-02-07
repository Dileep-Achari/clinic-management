'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "PHARMACY";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const mapper = require("../../../db-config/mapper");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
//const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const _ = require("underscore");



router.get("/", (req, res) => {
    return res.send("Working");
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


router.post('/getMasterData',(req,res)=>{
    try {
        if(req.body.TYPE && req.body.FLAG){
            if(req.body.TYPE === "ALL"){
            req.cParams.IS_MULTI_RESULTSET = "Y"
            mapper(dbSchema.getMasterData,req.body,req.cParams).then((response)=>{
                if(response){
                    let _data =[] 
                    _.each(response, function (item, index){
                        _.each(item,function(tobj){
                                _data.push(tobj)
                        })
                    });
                     let _gData = _.groupBy(_data,"TYPE")
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": _gData || [],
                        "description":''
                    })
                }
            });
        }
       else if(req.body.TYPE === "UNII" || req.body.TYPE === "INN" || req.body.TYPE === "SUB" || req.body.TYPE === "BDF" || req.body.TYPE === "RL" || req.body.TYPE === "ROA"  || req.body.TYPE === "DAM" || req.body.TYPE === "IS" || req.body.TYPE === "NUM" || req.body.TYPE === "DS" || req.body.TYPE === "WHO"){
            req.cParams.IS_MULTI_RESULTSET = "Y"
            mapper(dbSchema.getMasterData,req.body,req.cParams).then((response)=>{
                if(response){
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": response || [],
                        "description":''
                    })
                }
            });
        }
        else{
            mapper(dbSchema.getMasterData,req.body,req.cParams).then((response)=>{
                if(response && response.length > 0){
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": response || [],
                        "description":''
                    })
                }
                else{
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": [],
                        "description":'No Data Found'
                    })
                }
            })
        }
    }
        else{
            return res.status(400).json({
                "status":"FAIL",
                "data": [],
                "description":`Please Provide Valid Parameters`
            })
        }
    } catch (error) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(error)}`
        });
    }
})

router.post('/insUpdMasterDt',(req,res)=>{
    try {
        if(req.body.TYPE){
            //var cd=req.body.JSON.CT_CODE;
            req.body.JSON = JSON.stringify(req.body.JSON)
            mapper(dbSchema.insUpdMasterDt,req.body,req.cParams).then((response)=>{
                if(response && response[0] && response[0].ERRORTRACER_ID && response[0].ERRORNUMBER){
                    var cd = response[0].ERRORMSG.split('(');
                    cd = cd[1].slice(0,-2);
                    return res.status(200).json({
                        "status":"FAIL",
                        "data": [],
                        "description":`"${cd}" value is already Existed.`
                    })
                }
                else{
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": response || [],
                        "description":''
                    })
                }
            })
        }
        else{
            return res.status(400).json({
                "status":"FAIL",
                "data": [],
                "description":`Please Provide Valid Parameters`
            })
        }
    } catch (error) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(error)}`
        });
    }
})

router.post('/getMasterData01',(req,res)=>{
    try {
        req.cParams.IS_MULTI_RESULTSET = "Y"
        if(req.body.TYPE ){
            console.log("vikram",req.cParams)
            mapper(dbSchema.getMasterData01,req.body,req.cParams).then((response)=>{
                if(response){
                     let _data =[] 
                     _.each(response, function (item, index){
                         _.each(item,function(tobj){
                                 _data.push(tobj)
                         })
                     });
                    return res.status(200).json({
                        "status":"SUCCESS",
                        "data": _data || [],
                        "description":''
                    })
                }
            });
    }
    else{
        return res.status(400).json({
            "status":"FAIL",
            "data": [],
            "description":`Please Provide Valid Parameters`
        })
    }
} catch (error) {
    console.log("vickyu",error)
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(error)}`
        });
    }
})


module.exports = router;



const express = require("express");
const router = express.Router();
const _ = require('underscore');
const fs = require("fs");

const axios = require('../../services/axios');
const token = require('../../services/token');
const tmplData=require("../../constants/whats-app/templates");
const hostDtls=require("../../constants/whats-app/vendor_details");


const filename="D://hosting/prod/node/apk/public/log/whatsapp/waData.txt"//D://hosting/prod/node/apk/public/log/whatsapp/waData.txt
let returnOpt = {
    status: 200,
    data: [],
    statusmessage: 'SUCCESS',
    description: ''
}
let failReturnOpt = {
    status: 400,
    data: [],
    statusmessage: 'FAIL',
    description: ''
}


function _hostDtls(host) {
    const _locData = hostDtls.find(h => (h.HOST === host));
    return _locData
}
function formateErrorMsg(msg, tm) {
    let objReturn = Object.assign({}, failReturnOpt);
    objReturn.description = msg;
    objReturn.duration = Date.now() - tm;
    return objReturn;
}

function sendMsg(url,params,config) {
    return new Promise((resolve, reject) => {
        try {
            axios.post(url, params,config).then(res => {
                resolve({ gData: res, gError: null });
            }).catch(ex => {
                resolve({ gData: null, gError: ex });
            })
        }
        catch (ex) {
            resolve({ gData: null, gError: ex });
        }
    });
}

/** Write token generation method */
router.post('/genToken', (req, res) => {
    if (req.body.HOST && req.body.ORG_ID && req.body.LOC_ID) {
        data = { "Token": token.createToken({ ORG_ID: req.body.ORG_ID, LOC_ID: req.body.LOC_ID, HOST: req.body.HOST }) },
            res.json({
                ORG_ID:req.body.ORG_ID,
                LOC_ID:req.body.LOC_ID,
                HOST:req.body.HOST,
                TOKEN:data

            });
    }
    else {
        return res.status(400).json({error:"acepted paramates are HOST, ORG_ID, LOC_ID"});
    }
});
/**
 * TOKEN VALIDATION   */
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
                failReturnOpt.status = 401
                return res.status(401).json(formateErrorMsg("Request headers does not contain 'authtoken ", req.exeStartTime));
            }
            else {
				//console.log("toekn", req.headers.authtoken);
                token.verifyToken(req.headers.authtoken).then((data) => {
                    req.tokenData = data;
                  //  console.log("data-osapi", data);
                    req.hostData = _hostDtls(data.HOST);
					//console.log("locdata",req.locData);
                    if (req.hostData)
                        next();
                    else {
                        failReturnOpt.status = 401
                        return res.status(401).json(formateErrorMsg("Authentication failed, invalid token ", req.exeStartTime));
                    }
                }).catch((error) => {
                    failReturnOpt.status = 401
                    return res.status(401).json(formateErrorMsg("Authentication failed, invalid token ", req.exeStartTime));
                });

            }
        }
    }
}

router.all('/*', verifyToken, (req, res, next) => {
    try {
        let date=new Date().toLocaleString()
        fs.appendFileSync(filename,`\n  ------------------------------------------------------`);
        fs.appendFileSync(filename,`\n Insert Data:-${date}`);
        fs.appendFileSync(filename,`\n Request Data:- ${JSON.stringify(req.body)}`);
        req.exeStartTime = Date.now();
        req.cMethod = req.url.substr(1, req.url.length);
         if(req.body.template_name&&req.body.mobile_no&&req.body.placeHolders){
            next()
        }
        else{
            return res.status(400).json({"message":`template_name and/or mobile_no and/or placeHolders are missing`})
        }
    }
    catch (ex) {
        fs.appendFileSync(filename,`\n response Data:- ${formateErrorMsg("ERROR_WHILE_PREPARECPARAMS", req.exeStartTime)}`);
        return res.status(400).json(formateErrorMsg("ERROR_WHILE_PREPARECPARAMS", req.exeStartTime));

    }
});


router.post('/msgWithTemplate',async (req,res)=>{
    try{
    let params={
        "host":req.tokenData.HOST,
        "template_name":req.body.template_name,
        "mobile_no":req.body.mobile_no,
        "placeHolders":req.body.placeHolders
    }
    let msgData=tmplData.getTmpl(params);
    if(msgData.status==1){
        let config={
            headers:{"Authorization":msgData.data.hData.AUTH_TOKEN}
        }
        let _msgParams={

            "messages":[
                {
                    "from":msgData.data.hData.FROM_MOBILE,
                    "to":params.mobile_no,
                    "content":{
                        "templateName":msgData.data.tData.templateName,
                        "templateData":{
                            "body":{
                                "placeholders":params.placeHolders
                            }
                        },
                        "language":msgData.data.hData.language
                    }
                }
            ]
        }

        let {gData,gError}=await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`,_msgParams,config);
        if(gError){
            fs.appendFileSync(filename,`\n response Data:- ${gError}`);
            return res.status(400).json(gError);
        }
        else{
            fs.appendFileSync(filename,`\n response Data:- ${gData}`);
			if(gData&&gData.messages[0].status.groupId==5) {
                return res.status(200).json({"message":gData.messages[0].status.description});
                }
                else{
                return res.status(200).json({"message":"Message sent"});
                }
            //return res.status(200).json(gData);
        }
    }
    else{
        fs.appendFileSync(filename,`\n response Data:- ${msgData}`);
        return res.status(400).json(msgData);
    }
}
catch(ex){
    fs.appendFileSync(filename,`\n response Data:- ${ex}`);
    return res.status(500).json(ex);
}

});




router.post('/msgTemplatePDFURL',async (req,res)=>{
    try{
    let params={
        "host":req.tokenData.HOST,
        "template_name":req.body.template_name,
        "mobile_no":req.body.mobile_no,
        "placeHolders":req.body.placeHolders,
        "type":req.body.type,
        "mediaUrl":req.body.mediaUrl,
        "filename":req.body.filename,
    }
    let msgData=tmplData.getTmpl(params);
    if(msgData.status==1){
        let config={
            headers:{"Authorization":msgData.data.hData.AUTH_TOKEN}
        }
        let _msgParams=
        {
            "messages": [
                {
                    "from": msgData.data.hData.FROM_MOBILE,
                    "to": params.mobile_no,
                    "content": {
                        "templateName": msgData.data.tData.templateName,
                        "templateData": {
                            "body": {
                                "placeholders":params.placeHolders
                            },
                            "header": {
                                "type": params.type,
                                "mediaUrl": params.mediaUrl,
                                "filename":params.filename
                            }
                        },
                        "language": msgData.data.hData.language
                    }
                }
            ]
        }

        let {gData,gError}=await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`,_msgParams,config);
        if(gError){
            fs.appendFileSync(filename,`\n response Data:- ${gError}`);
            return res.status(400).json(gError);
        }
        else{
            fs.appendFileSync(filename,`\n response Data:- ${gData}`);
			if(gData&&gData.messages[0].status.groupId==5) {
                return res.status(200).json({"message":gData.messages[0].status.description});
                }
                else{
                return res.status(200).json({"message":"Message sent"});
                }
           //return res.status(200).json(gData);
        }
    }
    else{
        fs.appendFileSync(filename,`\n response Data:- ${msgData}`);
        return res.status(400).json(msgData);
    }
}
catch(ex){
	console.log("ex",ex);
    fs.appendFileSync(filename,`\n response Data:- ${ex}`);
    return res.status(500).json(ex);
}

});


router.post('/msgTemplateImg',async (req,res)=>{
    try{
    let params={
        "host":req.tokenData.HOST,
        "template_name":req.body.template_name,
        "mobile_no":req.body.mobile_no,
        "placeHolders":req.body.placeHolders,
        "type":req.body.type,
        "mediaUrl":req.body.mediaUrl,
       
    }
    let msgData=tmplData.getTmpl(params);
    if(msgData.status==1){
        let config={
            headers:{"Authorization":msgData.data.hData.AUTH_TOKEN}
        }
        let _msgParams=
        {
            "messages": [
              {
                "from":msgData.data.hData.FROM_MOBILE,
                "to": params.mobile_no,
                "content": {
                  "templateName":msgData.data.tData.templateName,
                  "templateData": {
                    "body": {
                      "placeholders":params.placeHolders
                    },
                    "header": {
                      "type": params.type,
                      "mediaUrl":  params.mediaUrl,
                    }
                  },
                  "language": msgData.data.hData.language
                }
              }
            ]
          }

        let {gData,gError}=await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`,_msgParams,config);
        if(gError){
            fs.appendFileSync(filename,`\n response Data:- ${gError}`);
            return res.status(400).json(gError);
        }
        else{
            fs.appendFileSync(filename,`\n response Data:- ${gData}`);
			if(gData&&gData.messages[0].status.groupId==5) {
                return res.status(200).json({"message":gData.messages[0].status.description});
                }
                else{
                return res.status(200).json({"message":"Message sent"});
                }
           // return res.status(200).json(gData);
        }
    }
    else{
        fs.appendFileSync(filename,`\n response Data:- ${msgData}`);
        return res.status(400).json(msgData);
    }
}
catch(ex){
    fs.appendFileSync(filename,`\n response Data:- ${ex}`);
    return res.status(500).json(ex);
}

});


module.exports = router;


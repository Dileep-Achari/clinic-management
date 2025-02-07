const express = require("express");
const router = express.Router();
const _ = require('underscore');
const fs = require("fs");
const winston = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');


const { appType } = require("./common");
const axios = require('../../services/axios');
const token = require('../../services/token');
const tmplData = require("../../constants/whats-app/templates");
const hostDtls = require("../../constants/whats-app/vendor_details");
const _clients = require("../../constants/whats-app/waclients");



const filename = "/var/www/html/doc9/node/apk/public/log/whatsapp/waData.txt";
const filePath = "/var/www/html/doc9/node/apk/public/log/whatsapp/waData.txt";
let filePathRewrite = "/var/www/html/doc9/node/apk/public/log/whatsapp/";

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


async function log(data, client) {
    let transports = [];
    let waLogPath = "/var/www/html/doc9/node/apk/public/log/whatsapp/";
    transports.push(
        new winston.transports.DailyRotateFile({
            name: 'file',
            datePattern: "YYYY-MMM-DD",
            dirname: `${waLogPath}/shd/`,
            filename: "%DATE%.log",
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '10d'
        })
    );

    var logger = new winston.createLogger({ transports: transports });
    await logger.info(data);

    if (client && client.length > 0) {
        client = client.trim();
        transports = [];
        transports.push(
            new winston.transports.DailyRotateFile({
                name: 'file',
                datePattern: "YYYY-MMM-DD",
                dirname: `${waLogPath}/${client}/`,
                filename: "%DATE%.log",
                zippedArchive: true,
                maxSize: '50m',
                maxFiles: '10d'
            })
        );

        var clientLogger = new winston.createLogger({ transports: transports });
        await clientLogger.info(data);
    }
    return true;
}

//function _hostDtls(host) {
//    const _locData = hostDtls.find(h => (h.HOST === host));
//    return _locData
//}
function formateErrorMsg(msg, tm) {
    let objReturn = Object.assign({}, failReturnOpt);
    objReturn.description = msg;
    objReturn.duration = Date.now() - tm;
    return objReturn;
}

function sendMsg(url, params, config) {
    return new Promise((resolve, reject) => {
        try {
            axios.post(url, params, config).then(res => {
                resolve({ gData: res, gError: null });
            }).catch(ex => {
                resolve({ gData: null, gError: ex });
            })
        }
        catch (ex) {
            resolve({ gData: null, gError: ex });
        }
    });
};



/**get client details */

function _hostDtls(host) {

    const _locData = _clients.find(h => (h.orgKey == host));
    //console.log("_clients", _locData);
    return _locData
}

/**Supported axios function */
function axiosCalls(url, params, config) {
    return new Promise((resolve, reject) => {
        try {
            axios.post(url, params, config).then(res => {
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

/* otp-in function */

async function otpinInitialization(_params, _client) {
    let _url = _client.optInUrl;
    let params = {
        "enterpriseId": _client.enterpriseId,
        "msisdn": _params.toMobile,
        "token": _client.token
    }
    let _otpinResp = await axiosCalls(_url, params);
    return _otpinResp;
};

async function sendWaMsgRequest(_params, _clientEnv) {
    //fs.appendFileSync(filePath, `\n _clientEnv :- ${JSON.stringify(_clientEnv)}`);

    let _placeHoldersBody = [];
    var _waParams = {};
    if (_params.msgType === "TEXT") {
        let _placeHolders = _params.placeHolders.split('^^^');
        _.each(_placeHolders, function (_val) {
            if (_val) {
                let _textObj = {
                    "type": "text",
                    "text": `*${_val.trim()}*`
                }
                _placeHoldersBody.push(_textObj);
            }
        })
        //console.log("placeHolders", _placeHoldersBody);
        _waParams = {
            "messages": [
                {
                    "sender": _clientEnv.sender,
                    "to": _params.toMobile,
                    "channel": "wa",
                    "type": "template",
                    "template": {
                        "body": _placeHoldersBody,
                        "templateId": _params.templateId,
                        "langCode": "en"
                    }
                }
            ],
            "responseType": "json"
        }
    }
    else if (_params.msgType === "MEDIA_PDF") {
        let _placeHolders = _params.placeHolders.split('^^^');
        let _mediaParamsObj = {};
        _.each(_placeHolders, function (_val, _idx) {
            if (_val) {
                _mediaParamsObj[_idx + 1] = `*${_val.trim()}*`
            }
        })
        //console.log("placeHolders", _mediaParamsObj);
        _waParams =
        {
            "messages": [
                {
                    "sender": _clientEnv.sender,
                    "to": _params.toMobile,
                    "messageId": "",
                    "transactionId": "",
                    "channel": "wa",
                    "type": "mediaTemplate",
                    "mediaTemplate": {
                        "mediaUrl": _params.mediaUrl,
                        "filename": _params.filename || "",
                        "contentType": "application/pdf",
                        "langCode": "en",
                        "template": _params.templateId,
                        "parameters": _mediaParamsObj
                    }
                }
            ],
            "responseType": "json"
        }
    }

    var _waUrl = _clientEnv.pushUrl;
    let _config = {
        headers: {
            "user": _clientEnv.user,
            "pass": _clientEnv.pass
        }
    }
    // console.log("header", _config.headers);
    // console.log("_waParams", _waParams);
    //  console.log("_waUrl", _waUrl);
    // fs.appendFileSync(filePath, `\n _waParams :- ${JSON.stringify(_waParams)}`);
    let _waResp = await axiosCalls(_waUrl, _waParams, _config);
    return _waResp;
}






/** Write token generation method */
router.post('/genToken', (req, res) => {
    if (req.body.HOST && req.body.ORG_ID && req.body.LOC_ID) {
        data = { "Token": token.createToken({ ORG_ID: req.body.ORG_ID, LOC_ID: req.body.LOC_ID, HOST: req.body.HOST, ENV: req.body.ENV }) },
            res.json({
                ORG_ID: req.body.ORG_ID,
                LOC_ID: req.body.LOC_ID,
                HOST: req.body.HOST,
                TOKEN: data

            });
    }
    else {
        return res.status(400).json({ error: "acepted paramates are HOST, ORG_ID, LOC_ID" });
    }
});
/**
 * TOKEN VALIDATION   */
 async function verifyToken(req, res, next) {
    let insertTime = new Date().toLocaleString();
    fs.appendFileSync(filePath, `\n-------------------------------------------------------------------------------------------------------`);
    fs.appendFileSync(filePath, `\n Request Time:${insertTime}`);
    fs.appendFileSync(filePath, `\n Headers:-${JSON.stringify(req.headers)}`);
    fs.appendFileSync(filePath, `\n Payload:-${JSON.stringify(req.body)}`);


     await log(`-------------------------------------------------------------------------------------------------------`)
     await log(`Request Time:- ${insertTime}`);
     await log(`Headers:- ${JSON.stringify(req.headers)}`);
     await log(`Payload:- ${JSON.stringify(req.body)}`);


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
                fs.appendFileSync(filePath, `\n Response :- Failed, Request headers does not contain 'authtoken'`);
                return res.status(401).json(formateErrorMsg("Request headers does not contain 'authtoken ", req.exeStartTime));
            }
            else {

                token.verifyToken(req.headers.authtoken).then(async (data) => {

                    req.tokenData = data;
                    req.hostData = _hostDtls(data.HOST);
                    if (req.hostData) {
                        filePathRewrite += `${req.hostData.logFileName}/log.txt`;
                        fs.appendFileSync(filePath, `\n filePathRewrite :- ${filePathRewrite}`);

                        let insertTime = new Date().toLocaleString();
                        await log(`-------------------------------------------------------------------------------------------------------`, req.hostData.logFileName);
                        await log(`Request Time:- ${insertTime}`, req.hostData.logFileName);
                        await log(`Headers:- ${JSON.stringify(req.headers)}`, req.hostData.logFileName);
                        await log(`Payload:- ${JSON.stringify(req.body)}`, req.hostData.logFileName);

                        next();
                    }
                    else {
                        failReturnOpt.status = 401
                        fs.appendFileSync(filePath, `\n Response :- Failed, Authentication failed, invalid token`);
                        return res.status(401).json(formateErrorMsg("Authentication failed, invalid token ", req.exeStartTime));
                    }
                }).catch((error) => {
                    console.log("error...", error)
                    failReturnOpt.status = 401;
                    fs.appendFileSync(filePath, `\n Response :- Failed, Authentication failed, invalid token`);
                    return res.status(401).json(formateErrorMsg("Authentication failed, invalid token ", req.exeStartTime));
                });

            }
        }
    }
}

router.all('/*', verifyToken, (req, res, next) => {
    try {

        req.exeStartTime = Date.now();
        req.cMethod = req.url.substr(1, req.url.length);
        // if(req.body.type&&appType.indexOf(req.body.type)>=0){
        // if(req.body.template_name&&req.body.place_holders&&req.body.to_mobile_no&&req.body.media_url&&req.body.filename){
        //if(req.body.to_mobile_no&&req.body.to_mobile_no.length==12) return res.status(400).json({"message":`please provide valid mobile number`})
        //else next()
        next();
        // }
        //  else{
        //     return res.status(400).json({"message":`template_name and/or mobile_no and/or place_holders and/or media_url and/or filename are missing`})
        // }
        //  }
        // else{
        ///      return res.status(400).json({"message":`please provide valid type-`}) 
        // }
    }

    catch (ex) {
        fs.appendFileSync(filename, `\n response Data:- ${formateErrorMsg("ERROR_WHILE_PREPARECPARAMS", req.exeStartTime)}`);
        return res.status(400).json(formateErrorMsg("ERROR_WHILE_PREPARECPARAMS", req.exeStartTime));

    }
});



router.post('/msgWithTemplate', async (req, res) => {
    try {
        let params = {
            "host": req.tokenData.HOST,
            "template_name": req.body.template_name,
            "mobile_no": req.body.to_mobile_no,
            "placeHolders": req.body.place_holders
        }
        let msgData = tmplData.getTmpl(params);
        if (msgData.status == 1) {
            let config = {
                headers: { "Authorization": msgData.data.hData.AUTH_TOKEN }
            }
            let _msgParams = {

                "messages": [
                    {
                        "from": msgData.data.hData.FROM_MOBILE,
                        "to": params.mobile_no,
                        "content": {
                            "templateName": msgData.data.tData.templateName,
                            "templateData": {
                                "body": {
                                    "placeholders": params.placeHolders
                                }
                            },
                            "language": msgData.data.hData.language
                        }
                    }
                ]
            }

            let { gData, gError } = await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`, _msgParams, config);
            if (gError) {
                fs.appendFileSync(filename, `\n response Data:- ${gError}`);
                return res.status(400).json(gError);
            }
            else {
                fs.appendFileSync(filename, `\n response Data:- ${gData}`);
                if (gData && gData.messages[0].status.groupId == 5) {
                    return res.status(200).json({ "message": gData.messages[0].status.description });
                }
                else {
                    return res.status(200).json({ "message": "Message sent" });
                }
                //return res.status(200).json(gData);
            }
        }
        else {
            fs.appendFileSync(filename, `\n response Data:- ${msgData}`);
            return res.status(400).json(msgData);
        }
    }
    catch (ex) {
        fs.appendFileSync(filename, `\n response Data:- ${ex}`);
        return res.status(500).json(ex);
    }

});




router.post('/msgTemplatePDFURL', async (req, res) => {
    try {
        let params = {
            "host": req.tokenData.HOST,
            "template_name": req.body.template_name,
            "mobile_no": req.body.to_mobile_no,
            "placeHolders": req.body.place_holders,
            "type": req.body.type,
            "mediaUrl": req.body.media_url,
            "filename": req.body.filename,
        }
        let msgData = tmplData.getTmpl(params);
        if (msgData.status == 1) {
            let config = {
                headers: { "Authorization": msgData.data.hData.AUTH_TOKEN }
            }
            let _msgParams =
            {
                "messages": [
                    {
                        "from": msgData.data.hData.FROM_MOBILE,
                        "to": params.mobile_no,
                        "content": {
                            "templateName": msgData.data.tData.templateName,
                            "templateData": {
                                "body": {
                                    "placeholders": params.placeHolders
                                },
                                "header": {
                                    "type": params.type,
                                    "mediaUrl": params.mediaUrl,
                                    "filename": params.filename
                                }
                            },
                            "language": msgData.data.hData.language
                        }
                    }
                ]
            }

            let { gData, gError } = await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`, _msgParams, config);
            if (gError) {
                fs.appendFileSync(filename, `\n response Data:- ${gError}`);
                return res.status(400).json(gError);
            }
            else {
                fs.appendFileSync(filename, `\n response Data:- ${gData}`);
                if (gData && gData.messages[0].status.groupId == 5) {
                    return res.status(200).json({ "message": gData.messages[0].status.description });
                }
                else {
                    return res.status(200).json({ "message": "Message sent" });
                }
                //return res.status(200).json(gData);
            }
        }
        else {
            fs.appendFileSync(filename, `\n response Data:- ${msgData}`);
            return res.status(400).json(msgData);
        }
    }
    catch (ex) {
        console.log("ex", ex);
        fs.appendFileSync(filename, `\n response Data:- ${ex}`);
        return res.status(500).json(ex);
    }

});


router.post('/msgTemplateImg', async (req, res) => {
    try {
        let params = {
            "host": req.tokenData.HOST,
            "template_name": req.body.template_name,
            "mobile_no": req.body.to_mobile_no,
            "placeHolders": req.body.place_holders,
            "type": req.body.type,
            "mediaUrl": req.body.media_url,

        }
        let msgData = tmplData.getTmpl(params);
        if (msgData.status == 1) {
            let config = {
                headers: { "Authorization": msgData.data.hData.AUTH_TOKEN }
            }
            let _msgParams =
            {
                "messages": [
                    {
                        "from": msgData.data.hData.FROM_MOBILE,
                        "to": params.mobile_no,
                        "content": {
                            "templateName": msgData.data.tData.templateName,
                            "templateData": {
                                "body": {
                                    "placeholders": params.placeHolders
                                },
                                "header": {
                                    "type": params.type,
                                    "mediaUrl": params.mediaUrl,
                                }
                            },
                            "language": msgData.data.hData.language
                        }
                    }
                ]
            }

            let { gData, gError } = await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`, _msgParams, config);
            if (gError) {
                fs.appendFileSync(filename, `\n response Data:- ${gError}`);
                return res.status(400).json(gError);
            }
            else {
                fs.appendFileSync(filename, `\n response Data:- ${gData}`);
                if (gData && gData.messages[0].status.groupId == 5) {
                    return res.status(200).json({ "message": gData.messages[0].status.description });
                }
                else {
                    return res.status(200).json({ "message": "Message sent" });
                }
                // return res.status(200).json(gData);
            }
        }
        else {
            fs.appendFileSync(filename, `\n response Data:- ${msgData}`);
            return res.status(400).json(msgData);
        }
    }
    catch (ex) {
        fs.appendFileSync(filename, `\n response Data:- ${ex}`);
        return res.status(500).json(ex);
    }

});


router.post('/waMessage_deprecated', async (req, res) => {
    try {
        let params = {
            "host": req.tokenData.HOST,
            //"template_name":req.body.template_name,
            "mobile_no": req.body.to_mobile_no,
            "placeHolders": req.body.place_holders,
            "type": req.body.type,
            "mediaUrl": req.body.media_url,
            "filename": req.body.filename,
            "msg_send_via": req.body.msg_send_via,
            "to_email": req.body.to_email

        }
        let msgData = tmplData.getTmpl(params);
        if (msgData.status == 1) {
            let config = {
                headers: { "Authorization": msgData.data.hData.AUTH_TOKEN }
            }
            let _msgParams = ""
            if (req.body.type == "IMAGE") {
                _msgParams = {
                    "messages": [
                        {
                            "from": msgData.data.hData.FROM_MOBILE,
                            "to": params.mobile_no,
                            "content": {
                                "templateName": msgData.data.tData.templateName,
                                //"templateName":"patient_lab_reports_with_img",
                                "templateData": {
                                    "body": {
                                        "placeholders": params.placeHolders
                                    },
                                    "header": {
                                        "type": params.type,
                                        "mediaUrl": params.mediaUrl,
                                    }
                                },
                                "language": msgData.data.hData.language
                            }
                        }
                    ]
                }
            }
            else if (req.body.type == "DOCUMENT") {
                _msgParams = {
                    "messages": [
                        {
                            "from": msgData.data.hData.FROM_MOBILE,
                            "to": params.mobile_no,
                            "content": {
                                "templateName": msgData.data.tData.templateName,
                                "templateData": {
                                    "body": {
                                        "placeholders": params.placeHolders
                                    },
                                    "header": {
                                        "type": params.type,
                                        "mediaUrl": params.mediaUrl,
                                        "filename": params.filename
                                    }
                                },
                                "language": msgData.data.hData.language
                            }
                        }
                    ]
                }
            }
            else if (req.body.type == "TEXT") {
                _msgParams = {

                    "messages": [
                        {
                            "from": msgData.data.hData.FROM_MOBILE,
                            "to": params.mobile_no,
                            "content": {
                                "templateName": msgData.data.tData.templateName,
                                "templateData": {
                                    "body": {
                                        "placeholders": params.placeHolders
                                    }
                                },
                                "language": msgData.data.hData.language
                            }
                        }
                    ]
                }
            }
            else {
                return res.status(400).json({ "message": "please provide valid parameters" });
            }
            //console.log("_msgParams",_msgParams);
            let { gData, gError } = await sendMsg(`${msgData.data.hData.BASE_URL}${msgData.data.tData.url}`, _msgParams, config);
            //console.log("gData",gData)
            //console.log("gError",gError)
            if (gError) {
                //console.log("gError",gError.data.requestError.serviceException)
                fs.appendFileSync(filename, `\n response Data:- ${JSON.stringify(gError.data)}`);
                return res.status(400).json(JSON.stringify(gError.data));
            }
            else {
                fs.appendFileSync(filename, `\n response Data:- ${JSON.stringify(gData)}`);
                if (gData && gData.messages[0].status.groupId == 5) {
                    return res.status(200).json({ "message": gData.messages[0].status.description });
                }
                else {
                    return res.status(200).json({ "message": "Message sent" });
                }
                // return res.status(200).json(gData);
            }
        }
        else {
            fs.appendFileSync(filename, `\n response Data:- ${JSON.stringify(msgData)}`);
            return res.status(400).json(JSON.stringify(msgData));
        }
    }
    catch (ex) {
        //console.log(ex)
        fs.appendFileSync(filename, `\n response Data:- ${ex}`);
        return res.status(500).json(ex);
    }

});






router.post('/waMessage', async (req, res) => {
    //  console.log("params", req.body);
    try {
        if (req.body)
            req.body.toMobile = req.body.toMobile.replace(/ /g, "");
        if (req.body && req.body.toMobile && req.body.toMobile.length == 10 && req.body.placeHolders && req.body.placeHolders.length > 0 && req.body.msgType && req.body.msgType.length > 0 && req.body.optin && req.body.optin.length > 0) {
            if (req.body.msgType === "MEDIA_PDF") {
                if (!req.body.mediaUrl || req.body.mediaUrl.length == 0) {
                    return res.status(400).json({
                        "status": 400,
                        "data": [],
                        "description": "Provide valid parameters"
                    });
                }
            }

            let _clientDetails = req.hostData;
            //console.log("_clientDetails", _clientDetails);
            if (_clientDetails && Object.keys(_clientDetails).length > 0) {
                let _credentials = {};
                //fs.appendFileSync( filePath, `\n Token Data :-, ${JSON.stringify(req.tokenData)}`);
                if (req.tokenData.ENV === "P") {
                    _credentials = _clientDetails.prod;
                }
                else _credentials = _clientDetails.uat || {};
                //fs.appendFileSync( filePath, `\n Env :-, ${JSON.stringify(_credentials)}`);
                var _allowOptin = false;
                if (req.body.optin == "Y") {
                    var _resp = await otpinInitialization(req.body, _credentials);
                    //_allowOptin = true;
                }
                else {
                    _allowOptin = true;
                }
                if (_allowOptin || (_resp.gData.success)) {
                    let _msgResp = await sendWaMsgRequest(req.body, _credentials);
                    // console.log(_msgResp);
                    //if (_msgResp.gData.status && _msgResp.gData.success === 200 && _msgResp.gData.data) {
                    if (_msgResp.gData.success != "false") {
                        fs.appendFileSync(filePath, `\n Response :-Success, WhatsApp Notification sent successfully.`);
                        return res.status(200).json({
                            "status": 200,
                            "data": _msgResp.gData,
                            "description": ""
                        });
                        //  }
                        //  else {
                        //      return res.status(400).json({
                        //          "status": 400,
                        //         "data": _msgResp.gData.data.description,
                        //          "description": "opt-in request was not initiated."
                        //       });
                        //  }
                    }
                    else {
                        fs.appendFileSync(filePath, `\n Response :- Failed, WhatsApp Notification failed, ${JSON.stringify(_msgResp.gData)}`);
                        return res.status(400).json({
                            "status": 400,
                            "data": [],
                            "description": "WhatsApp Notification failed"
                        });
                    }
                }
                else {
                    fs.appendFileSync(filePath, `\n Response :- Failed, opt-in request to WhatsApp failed, ${JSON.stringify(_resp.gData)}`);
                    return res.status(400).json({
                        "status": 400,
                        "data": [],
                        "description": "opt-in request to whatsapp failed"
                    });
                }
            }
            else {
                fs.appendFileSync(filePath, `\n Response :- Failed, No client is available for sending WhatsApp Notification.`);
                return res.status(400).json({
                    "status": 400,
                    "data": [],
                    "description": "No client is available for sending WhatsApp Notification"
                });
            }
        }
        else {
            fs.appendFileSync(filePath, `\n Response :- Failed , Provide valid parameters.`);
            return res.status(400).json({
                "status": 400,
                "data": [],
                "description": "Provide valid parameters"
            });
        }
    }
    catch (e) {
        fs.appendFileSync(filePath, `\n Response at Catch :- Failed , ${e}`);
        return res.status(400).json({
            "status": 400,
            "data": [],
            "description": e
        });
    }
});


module.exports = router;


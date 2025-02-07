const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const fs = require('fs');
const paths = require('path');
const axios = require("axios");
const { transform } = require('node-json-transform');
const imageThumbnail = require('image-thumbnail');
const moment = require('moment');
const multer = require('multer');
const Jimp = require("jimp");
const upload = multer();
const _mUtils = require("../../../constants/mongo-db/utils");
const getTemplateData = require("../../../constants/mongo-db/getTemplate.json");
const _transformapi = require('../patientcare/transformation');
const _token = require("../../../services/token");
const _util = require("../../../utilities/is-valid")
const model = require("../../../db-config/helper-methods/mongo/preparePayload");

const _orgDetails = require("../patientcare/constants/organizations");
const path = require("path/posix");
const cpUpload = upload.fields([{ name: "file", maxcount: 10 }])
const _basePath = "/appdata/monography_images/"

let _bwObj = {
    "updateOne": {
        "filter": {},
        "update": {
            "$set": {},
            "$push": {}
        }
    }
};

let _queries = ["find", "findById", "findOne", "insertMany", "updateOne", "bulkWrite"];

let _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';

let _users = [
    {
        "users": [
            { "userId": 1234, "userName": "admin", "pwd": "abc123", "displayName": "EMR Admin" }
        ]
    },
    {
        "users": [
            { "userId": 2345, "userName": "ssadmin", "pwd": "sunshine", "displayName": "Sunshine Admin" }
        ]
    }
];



/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "9000000ms");
};

/* Read Directory */
async function readDirectories(dir) {
    try {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, async (error, fileNames) => {
                if (error) {
                    resolve({
                        success: false,
                        desc: error,
                        data: []
                    })
                }
                else {
                    resolve({
                        success: true,
                        data: fileNames
                    })
                }
            });
        });
    }
    catch (err) {
        return {
            success: false,
            desc: err.message,
            data: []
        }
    }
}

/* Get Client Urls */
async function getClientUrls(_data) {
    let _org = await _.filter(_orgDetails, (o) => { return o.orgId === _data.orgId });
    return _org && _org.length > 0 ? _org[0] : _org;
};

/*Custom Sort By Date */
function custom_sort(a, b) {
    return new Date(a.CREATE_DT).getTime() - new Date(b.CREATE_DT).getTime();
};

async function prepareGetPayload(_payload, _inParams) {
    try {
        _.each(_inParams, (_i, _k) => {
            if (_k != 'audit' && _i) {
                _payload.filter[_k] = _i;
            }
        });
        return { success: true, data: _payload };
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err };
    }
}

router.post('/getGlobalData',(req,res)=>{
    let resp = []
    if(req.body.SEARCH_TYPE){
        fs.readFile(paths.join(__dirname,`/jsons/static.json`), "utf-8", (err, data1) => {
        let finaldata= data1 ? JSON.parse(data1) :[]
        if(finaldata && finaldata.length > 0){  
            _.each(finaldata,function(data){
                if(data.Suv_Substance_Name.includes(req.body.SEARCH_TYPE)){
                resp.push(data)
                }
            })
        res.status(200).json({status:true,statusMessage:"success",data:resp,desc:""})
        }
        else {
            res.status(400).json({status:false,statusMessage:"fail",data:[],desc:"no data found"})
        }       
    })
}
else{
    res.status(400).json({"success": false,"status": 400,"statusMessage": "fail",desc:"please Provide Search Type"})
}
})

/*image upload*/

router.post("/imageUpload", cpUpload, (req, res) => {
    if (req.body.code) {
        if (req.body.flag === "s") {
            let file = req.files.file
            if (file && file.length > 0) {
                _.each(file, function (data1) {
                    let fileName = data1.originalname.split(".")
                    let finalData = Buffer.from(data1.buffer).toString("base64");
                    const data = JSON.stringify(finalData)
                    const buffer = Buffer.from(data, "base64");
                    Jimp.read(buffer, (err, res) => {
                        if (err) throw new Error(err);
                        res.quality(100).write(`${_basePath}${req.body.code}/${fileName[0]}.png`);
                    });
                })
                res.status(200).json({ status: true, statusMessage: "success", data: [], desc: "" })
            }
            else {
                res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "please Provide Valid Data" })
            }
        }
        else {
            if (req.body.filename) {
                let resp = fs.existsSync(`${_basePath}${req.body.code}/${req.body.filename}.png`)
                if (resp) {
                    fs.unlink(`${_basePath}${req.body.code}/` + `${req.body.filename}.png`, (err) => {
                        if (err) {
                            res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: err })
                        }
                    });
                    res.status(200).json({ status: true, statusMessage: "success", data: [], desc: "" })
                }
                else {
                    res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "no file found" })
                }
            }
            else {
                res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "please provide filename" })
            }
        }
    }
    else {
        res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "please provide code" })
    }
});
/* image get*/ 

router.post('/imageGet',async(req,res)=>{
    let dataObj = []
    if(req.body.code){
        let dirName = `${_basePath}${req.body.code}/`
        let _files = await readDirectories(dirName);
        if (!_files.success || _files.data.length == 0) {
            return res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "no Data Found" })
        }
        else{
            _.each(_files.data,async function(filename){
            let params = `${dirName}${filename}`
            dataObj.push({"fileName":params})
            })
            return res.status(200).json({ status: true, statusMessage: "success", data: dataObj, desc: "" })
        }
    }
    else {
        res.status(400).json({ status: false, statusMessage: "fail", data: [], desc: "please provide code" })
    }
})

/* Get Organization Details */
router.get("/get-org-details", async (req, res) => {
    try {
        if (req.headers && req.headers.orgkey) {
            let _orgDtls = _.filter(_orgDetails, (o) => { return o.orgKey == req.headers.orgkey });
            if (!(_orgDtls && _orgDtls.length > 0)) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            }
            let _orgObj = { "orgId": _orgDtls[0].orgId, "createdDt": new Date().toISOString() };

            // let _tkn = await generateToken(_orgObj);
            //  res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true, domain: 'localhost', path: '/' });
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _orgObj });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});


/**Auth User */
router.post("/auth-user-deprecated", async (req, res) => {
    try {
        let finalData;
        if (req.body && req.body.uName && req.body.pwd) {

            // let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
            // if (!(_orgDtls && _orgDtls.length > 0)) {
            //     return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            // }

            let _userDtls = _.filter(_users, (o) => {
                _.filter(o.users, (oData, oIndx) => {
                    if (oData.userName == req.body.uName && oData.pwd == req.body.pwd) {
                        finalData = oData

                    }
                })
            });
            // console.log("finalData",finalData.length)
            if (finalData == undefined || finalData == null) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
            }
            let _user = {
                "createdDt": new Date(), "userId": finalData.userId, "userName": finalData.userName, "permissions": ["1102"],
                "displayName": finalData.displayName
            };
            let _tkn = await generateToken(_user);
            res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
            _user['x-token'] = _tkn;
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _user });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
    // try {
    //     if (req.body && req.body.uName && req.body.pwd) {
    //     //    let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
    //     //     if (!(_orgDtls && _orgDtls.length > 0)) {
    //     //         return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
    //     //     }
    //     let _userDtls = _.filter(_users[0].users, (o) => { return o.userName == req.body.uName && o.pwd == req.body.pwd });
    //         if (!(_userDtls && _userDtls.length > 0)) {
    //             return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
    //         }
    //         let _user = {
    //              "createdDt": new Date(), "userId": _userDtls[0].userId, "userName": _userDtls[0].userName,"permissions": ["1102"],
    //             "displayName": _userDtls[0].displayName
    //         };
    //         let _tkn = await generateToken(_user);
    //         res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
    //         _user['x-token'] = _tkn;
    //         return res.status(200).json({ status: 'SUCCESS', desc: '', data: _user });
    //     }
    //     else {
    //         return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
    //     }
    // } catch (error) {
    //     return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    // }
});

router.post("/auth-user", async (req, res) => {
    try {
        if (req.body && req.body.params.uName && req.body.params.pwd) {
            let _filter = {
                "filter": {
                    "isActive": true,
                    "userName": { $eq: req.body.params.uName },
                    "password": { $eq: req.body.params.pwd }
                },
                "selectors": "-audit -history"
            }
            mongoMapper("monography_users", "find", _filter, "").then(async (result) => {
                if (result.data && result.data.length === 0) {
                    return res.status(400).json({ success: false, status: 400, desc: `Invalid credentials / No user found ..`, data: [] });
                }

                let _user = {
                    "createdDt": new Date(), "userId": result.data[0]._id, "userName": result.data[0].userName, "roleId": result.data[0].roleId,
                    "displayName": result.data[0].displayName
                };
                let _tkn = await generateToken(_user);
                res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
                _user['x-token'] = _tkn;
                return res.status(200).json({ success: true, status: 200, desc: '', data: _user });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Invalid Parameters", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Verify Token Function */
router.use(async function verifyToken(req, res, next) {
    // if (!req.cookies || !req.cookies["x-token"]) {
    //     return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    // }
    if (!req.headers || !req.headers["x-token"]) {
        return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    }
    try {
        // console.log("req.headers-", req.headers["x-token"]);
        _token.verifyToken(req.headers["x-token"]).then(async (data) => {
            // console.log("tkn-", data);
            req.tokenData = data;
            req.clientUrls = await getClientUrls(data);
            next();
        }).catch((error) => {
            //console.log("tkn-err", error);
            if (error.name && error.name == 'TokenExpiredError') {
                return res.status(401).json({
                    "code": 401,
                    "message": "Token was Expired. Please generate new Token..",
                    "timestamp": moment(new Date()).format(_dateTimeFormate),
                    "version": "1.0.0"
                });
            }
            return res.status(401).json({
                "code": 401,
                "message": "Authentication failed, Invalid token .",
                "timestamp": moment(new Date()).format(_dateTimeFormate),
                "version": "1.0.0"
            });
        });
    } catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err.message || err, data: [] });
    }
});

/* Parameter Validation Midleware function */
router.use(function paramValidation(req, res, next) {
    try {
        console.log("valid", req.body);
        // req.tokenData = { "userId": 1234, "userName": "Somesh P" };
        let _query = req.body.query || req.query.query || "";
        if (!_query || _query == "") {
            return res.status(400).json({ status: 'FAIL', desc: `Require Query Paramer..`, data: [] });
        }
        let _index = _.findIndex(_queries, function (o) { return o.trim() == _query.trim(); });
        if (_index == -1) {
            return res.status(400).json({ status: 'FAIL', desc: `Provided ${_query} Query Paramer is not supported..`, data: [] });
        }
        if (_query == 'findById') {
            let _methods = ["body", "query"];
            let _exists = false;
            for (let _idx of _methods) {
                if (req.method == 'POST')
                    _exists = req[_idx].params && req[_idx].params["_id"] != undefined && req[_idx].params["_id"] != '' ? true : false;
                else if (req.method == 'GET')
                    _exists = req[_idx] && req[_idx]["_id"] != undefined && req[_idx]["_id"] != '' ? true : false;
                if (_exists) break;
            }
            if (!_exists) {
                return res.status(400).json({ status: 'FAIL', desc: `Invalid Paramers..`, data: [] });
            }
        }
        else if (_query === 'insertMany') {
            req.body.params["audit"] = {
                documentedBy: req.tokenData.userName,
                documentedById: req.tokenData.userId
            }
        }
        else if (_query === 'updateOne') {
            //if (req.body.flag !== 'BW') {
            req.body.params["audit"] = {
                modifiedById: req.tokenData.userId,
                modifiedByBy: req.tokenData.userName,
                modifiedByDt: new Date().toISOString()
            };
            // req.body.params["audit"] = {
            //     modifiedById: req.tokenData.userId,
            //     modifiedBy: req.tokenData.userName,
            //     modifiedDt: new Date().toISOString()
            // };
            // }
            req["cAudit"] = {
                documentedBy: req.tokenData.userName,
                documentedById: req.tokenData.userId
            }
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err, data: [] });
    }
});

/* Insert Levels Data */
router.post("/insert-level", async (req, res) => {
    try {
        // req.body.params["audit"]={
        //     documentedBy:req.tokenData.userName,
        //     documentedById:req.tokenData.userId
        // }
        mongoMapper('monography_levels', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all levels */
router.post("/get-levels", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_levels", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

router.post("/update-level", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_levels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_levels', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_levels', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*Insert Role Data*/
router.post("/insert-role", async (req, res) => {
    try {
        mongoMapper('monography_roles', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Roles */
router.post("/get-roles", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_roles", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Role */
router.post("/update-roles", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_roles', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_roles', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


/**insert-users Data */
router.post("/insert-users", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('monography_users', req.body.query, req.body.params).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Users */
router.post("/get-users", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_users", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
/**Update Users */
router.post("/update-users", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_users", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_users', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

                //  pLoadResp.payload.query.$push["permissions"]=permsDta
                // = req.body.params.permissions
            }
            mongoMapper('monography_users', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert-drug-creation Data */
router.post("/insert-drug-details", async (req, res) => {
    try {
        _.each(req.body.params, (_p) => {
            _p["audit"] = req.body.params.audit
        });
      //  delete req.body.params.audit;
          req.body.params["template"] = getTemplateData.data
        mongoMapper('monography_drugcreation', "insertMany", req.body.params).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }
            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": "-audit -history"
            }     
            let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
            if (!(_rResp && _rResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            let _assignedTo = [];
            _.each(req.body.params, (_p) => {
                _.each(_p.assignedTo, (_o) => {
                    let _fRole = _.filter(_rResp.data, (_r) => { console.log(_r); return _r._id.toString() == _o.roleId });
                    if (_fRole && _fRole.length > 0) {
                        let _sections = [];
                        _.each(_fRole[0].sections, (_s) => {
                            _sections.push({
                                hcpId: _s.hcpId || null,
                                patientId: _s.patientId || null
                            });
                        });
                        _assignedTo.push({
                            dId: result.data[0]._id,
                            dName: result.data[0].documentTitle,
                            assignedTo: _o,
                            sections: _sections
                        });
                    }
                });
            });
            let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Employee */
router.post("/get-user-drug-details", async (req, res) => {
    try {

        let _filter = {
            "filter": {
                "assignedTo.userId": req.body.params.userId
            },
            "selectors": "-history"
        }

        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_userAssign", "find", _filter, "").then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }
            let _mapData = _.chain(result.data).groupBy('status')
                .map((_d, _k) => {
                    return {
                        "status": _k,
                        "list": _d
                    }
                }).value();
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* get all drugCreation */
router.post("/get-drugData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_drugCreation", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update DrugDetails */
router.post("/update-drug-details", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {

            let dataJson = _cBody.params.template.patient
            let hcpData = _cBody.params.template.hcp;

            let pLoadResp = { payload: {} };

            if(_cBody.params.template['patient']){
                _cBody.params.template['patient']=dataJson 
            }else if(_cBody.params.template['hcp']){
                _cBody.params.template['hcp']=hcpData 
            }
           
            let _mResp = await _mUtils.commonMonogoCall("monography_drugcreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_drugcreation', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_drugcreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});



router.post("/update-drugCreation", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_drugCreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_drugCreation', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_drugCreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert-userAssign Data */
router.post("/insert-userAssign", async (req, res) => {
    try {
        mongoMapper('monography_userAssign', req.body.query, req.body.params).then(async (result) => {
            let _filter = {
                "filter": { "_id": result.data[0].assignedTo[0].roleId },
                "selectors": "-audit -history"
            }

            let _mResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", req.body.params.dbType)
            if (!_mResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc, data: [] });
            } else {

            }
            //  return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all userAssign */
router.post("/get-userAssignData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_userAssign", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


/**
 * inserHistory
 */
router.post("/insert-history", async (req, res) => {
    try {
        // req.body.params["orgId"] = req.tokenData.orgId;
        // req.body.params["locId"] = req.tokenData.locId;
        mongoMapper('insertiHstoryData', req.body.query, req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});


router.post("/insert-coreMasterData", async (req, res) => {
    try {
        mongoMapper('monography_coreMasters', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/get-coreData", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_coreMasters", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


router.post("/insert-history", async (req, res) => {
    try {
        // req.body.params["orgId"] = req.tokenData.orgId;
        req.body.params["locId"] = req.tokenData.locId;
        mongoMapper('insertiHstoryData', req.body.query, req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});


router.post("/get-template", async (req, res) => {
    try {
        return res.status(200).send(getTemplateData);
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});



module.exports = router;
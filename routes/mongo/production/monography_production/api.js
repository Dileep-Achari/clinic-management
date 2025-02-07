const router = require("express").Router();
const mongoMapper = require("../../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const axios = require("axios");
const axios1 = require("../../../../services/axios")
// const { transform } = require('node-json-transform');
// const imageThumbnail = require('image-thumbnail');
const moment = require('moment');
const _mUtils = require("../../../../constants/mongo-db/utils");
// const _transformapi = require('../patientcare/transformation');
const _token = require("../../../../services/token");
// const _util = require("../../../utilities/is-valid")
// const model = require("../../../db-config/helper-methods/mongo/preparePayload");
// const getTemplateData = require("../../../constants/mongo-db/getTemplate.json")
const getTemplateData = require("../../../../constants/mongo-db/getTemplate.json")
const _orgDetails = require("../../patientcare/constants/organizations");
let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData";

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
            let _sessionInsertRes;
            let session_id;
            mongoMapper("monography_production_users", "find", _filter, "").then(async (result) => {
                if (result.data && result.data.length === 0) {
                    return res.status(400).json({ success: false, status: 400, desc: `Invalid credentials / No user found ..`, data: [] });
                }

                if (result.data && result.data.length > 0) {
                    let _filter = {
                        "filter": { recStatus: true },
                        "selectors": "-audit -history"
                    }
                    let _sessionRes = await _mUtils.commonMonogoCall("monography_production_userSession", "find", _filter, "", "", "", "")
                    //   let num = _sessionRes.data[0].session_id
                    let params = {};
                    if (_sessionRes.data.length == 0) {
                        session_id = 1
                    } else {
                        let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
                        let _cal = _descData[0].session_id + 1;
                        session_id = _cal
                    }
                    params = {
                        "userId": result.data[0]._id,
                        "userName": result.data[0].displayName,
                        'orgId': result.data[0].orgId,
                        "roleId": result.data[0].defaultRoleId ? result.data[0].defaultRoleId : "",
                        "roleName": result.data[0].defaultRoleName ? result.data[0].defaultRoleName : "",
                        "user_revNo": result.data[0].revNo,
                        "machine": req.body.params.machine ? req.body.params.machine : "",
                        "version": req.body.params.version ? req.body.params.version : "",
                        "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
                        "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
                        "session_id": session_id,
                        "browser": req.body.params.browser ? req.body.params.browser : "",
                        "audit": {
                            "documentedBy": result.data[0].displayName,
                            "documentedById": result.data[0]._id
                        }
                    }
                    _sessionInsertRes = await _mUtils.commonMonogoCall("monography_production_userSession", "insertMany", params, "", "", "", "")
                    if (!(_sessionInsertRes && _sessionInsertRes.success)) {
                        console.log("Error Occured while updating appointment details to Patient");
                    }

                }

                let _user = {
                    "createdDt": new Date(), "userId": result.data[0]._id, "userName": result.data[0].userName, "roleId": result.data[0].defaultRoleId,
                    "displayName": result.data[0].displayName, "session_id": _sessionInsertRes.data[0].session_id
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
        _token.verifyToken(req.headers["x-token"]).then(async (data) => {
            req.tokenData = data;
            req.clientUrls = await getClientUrls(data);
            next();
        }).catch((error) => {
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
                documentedBy: req.tokenData ? req.tokenData.displayName : "EMR Admin",
                documentedById: req.tokenData ? req.tokenData.userId : null
            }
            req["cAudit"] = {
                documentedById: req.tokenData ? req.tokenData.userId : null,
                documentedBy: req.tokenData ? req.tokenData.displayName : null,
                documentedDt: req.tokenData ? new Date().toISOString() : null
            }
        }
        else if (_query === 'updateOne') {

            //if (req.body.flag !== 'BW') {
            req.body.params["audit"] = {
                modifiedById: req.tokenData.userId,
                modifiedBy: req.tokenData.displayName,
                modifiedDt: new Date().toISOString()
            };

            if (req.body.params.status == "COMPLETED") {
                req.body.params["audit"] = {
                    completedById: req.tokenData.userId,
                    completedBy: req.tokenData.displayName,
                    completedDt: new Date().toISOString(),
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.displayName,
                    modifiedDt: new Date().toISOString()
                }
            } else if (req.body.params.status == "APPROVED") {
                req.body.params["audit"] = {
                    approvedById: req.tokenData.userId,
                    approvedBy: req.tokenData.displayName,
                    approvedDt: new Date().toISOString(),
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.displayName,
                    modifiedDt: new Date().toISOString()
                }
            }

            //   if(req.body.params.checkStatus){
            //   if(req.body.params.checkStatus.status === "checkIn"){
            //     req.body.params["checkStatus"].checkInDt=new Date().toISOString()

            //    }else if(req.body.params.checkStatus.status === "checkOut"){
            //     req.body.params["checkStatus"].checkOutDt=new Date().toISOString()
            //    }
            // }



            // }     
            req["cAudit"] = {
                documentedById: req.tokenData.userId,
                documentedBy: req.tokenData.displayName
            }
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err.message, data: [] });
    }
});

/* Insert Levels Data */
router.post("/insert-level", async (req, res) => {
    try {
        // req.body.params["audit"]={
        //     documentedBy:req.tokenData.userName,
        //     documentedById:req.tokenData.userId
        // }
        mongoMapper('monography_production_levels', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* get all levels */
router.post("/get-levels", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_production_levels", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("monography_production_levels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_production_levels', _mResp.data.params, _cBody.params, req, "monography_production");
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
            mongoMapper('monography_production_levels', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
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
        mongoMapper('monography_production_roles', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Get Doctors */
router.post("/get-roles", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                // "content_type":req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "label": "$label",
                "isActive": "$isActive",
                "revNo": "$revNo",
                "content_type": "$content_type",
                "sequence": "$sequence",
                "actionOfRole": "$actionOfRole",
                "sections": {
                    $filter: {
                        input: "$sections",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "level": "$level",
            }
        }
        // if(req.body.params.content_type){
        //   _filter.filter['content_type'] = req.body.params.content_type
        // }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("monography_production_roles", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("monography_production_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_production_roles', _mResp.data.params, _cBody.params, req, "monography_production");
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
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('monography_production_roles', 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
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

router.post("check-role-with-section", (req, res) => {
    try {
        if (req.body.params.roleId && req.body, params.sectionId) {
            let _filter = {
                "filter": {
                    "role_id": req.body.params.roleId,
                    "drug_section_id": req.body.params.sectionId
                }
            }
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }
    } catch (error) {

    }
})

/**insert-users Data */
router.post("/insert-users", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            //req.body.params.roleId=req.tokenData.roleId
            mongoMapper('monography_production_users', req.body.query, req.body.params).then((result) => {
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
// router.post("/get-users", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": { "_id": req.body.params._id },
//             "selectors": ""
//         }
//         mongoMapper("monography_production_users", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });

router.post("/get-users", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                // content_type:req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "displayName": "$displayName",
                "gender": "$gender",
                "mobile": "$mobile",
                "address": "$address",
                "userName": "$userName",
                "password": "$password",
                "profilePic": "$profilePic",
                "EmpId": "$EmpId",
                "defaultRoleId": "$defaultRoleId",
                "defaultRoleName": "$defaultRoleName",
                "revNo": "$revNo",
                "isActive": "$isActive",
                "assignedRoles": {
                    $filter: {
                        input: "$assignedRoles",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit"
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("monography_production_users", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("monography_production_users", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_production_users', _mResp.data.params, _cBody.params, req, "monography_production");
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
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }

                //  pLoadResp.payload.query.$push["permissions"]=permsDta
                // = req.body.params.permissions
            }
            mongoMapper('monography_production_users', 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
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
// router.post("/insert-drug-details", async (req, res) => {
//     try {
//         _.each(req.body.params, (_p) => {
//             _p["audit"] = req.body.params.audit
//         });
//         //  delete req.body.params.audit;
//         req.body.params["template"] = getTemplateData.data
//         mongoMapper('monography_production_drugcreation', "insertMany", req.body.params).then(async (result) => {
//             if (!(result && result.data && result.data.length > 0)) {
//                 return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
//             }
//             let _filter = {
//                 "filter": {
//                     "recStatus": true
//                 },
//                 "selectors": {
//                     "_id": "$_id",
//                     "label": "$label",
//                     "isActive": "$isActive",
//                     "regNo": "$regNo",
//                     "sections": {
//                         $filter: {
//                             input: "$sections",
//                             cond: {
//                                 $eq: ["$$this.recStatus", true]
//                             }
//                         }
//                     },
//                     "audit": "$audit",
//                     "level": "$level",
//                 }
//             }
//             let _rResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", "")
//             if (!(_rResp && _rResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
//             }

//             let _assignedTo = [];
//             _.each(req.body.params, (_p) => {
//                 _.each(_p.assignedTo, (_o) => {
//                     let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
//                     if (_fRole && _fRole.length > 0) {
//                         let _sections = [];
//                         _.each(_fRole[0].sections, (_s) => {
//                             _sections.push({
//                                 hcpId: _s.hcpId || null,
//                                 patientId: _s.patientId || null
//                             });
//                         });
//                         _assignedTo.push({
//                             dId: result.data[0]._id,
//                             DD_SUBSTANCE_COMB_NAME: result.data[0].DD_SUBSTANCE_COMB_NAME,
//                             DD_DRUG_MASTER_CD: result.data[0].DD_DRUG_MASTER_CD ? result.data[0].DD_DRUG_MASTER_CD : "",
//                             DD_SUBSTANCE_COMB_CD: result.data[0].DD_SUBSTANCE_COMB_CD ? result.data[0].DD_SUBSTANCE_COMB_CD : "",
//                             PARENT_DRUG_CD: result.data[0].PARENT_DRUG_CD ? result.data[0].PARENT_DRUG_CD : "",
//                             assignedTo: _o,
//                             sections: _sections
//                         });
//                     }
//                 });
//             });
//             let _mResp;
//             if (!(result.data[0].PARENT_DRUG_CD === "" || result.data[0].PARENT_DRUG_CD === null)) {
//                 delete _filter.selectors
//                 _filter.filter['DD_DRUG_MASTER_CD'] = result.data[0].PARENT_DRUG_CD
//                 let _mResp1 = await _mUtils.commonMonogoCall("monography_production_userAssign", "find", _filter, "", "", "", "");
//                 if (_mResp1.data.length > 0) {
//                     _mResp  = await _mUtils.commonMonogoCall("monography_production_userAssign", "insertMany", _assignedTo, "", "", "", "")
//                     if (!(_mResp && _mResp.success)) {
//                         return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//                     }
//                    }else {
//                     return res.status(400).json({ success: false, status: 400, desc:`this ${result.data[0].DD_SUBSTANCE_COMB_NAME} of parent drug not assigned to any user`, data:  [] });
//                    }
//             } else {
//                  _mResp = await _mUtils.commonMonogoCall("monography_production_userAssign", "insertMany", _assignedTo, "", "", "", "")
//                 if (!(_mResp && _mResp.success)) {
//                     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//                 }
//             }
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });


async function insertSectionDataAganistContentType(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {

            let _filter = {
                "filter": {
                    "isActive": true,
                    "content_type": _data[_idx].content_type
                },
                "selectors": "-history"
            };
            let resonseData = [];
            let _tResp = await _mUtils.commonMonogoCall("monography_production_templates", "find", _filter, "", "", "", "");
            if (!(_tResp && _tResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            await axios1.post(url, { "TYPE": "DRUG_INTERACTIONS", "FLAG": "A", "ID2": _data[_idx].DD_SUBSTANCE_CD })
                .then((response) => { resonseData = response.data.Table1 })
                .catch((err) => {
                    console.log("err", err)
                })

            let _intIdData = [];
            let _intChildData = []
            let _sectionPushData = [];
            let _insertSection;
            if (resonseData.length > 0) {
                _.each(_tResp.data, (_obj, _indx) => {
                    _intIdData = []
                    let _reduceData = resonseData.filter((_keys, _objects) => {
                        if (_obj.INT_ID == _keys.INT_ID) {
                            _intIdData.push(_keys)
                        }
                    })
                    if (_intIdData.length > 0) {
                        _sectionPushData.push({
                            DD_SUBSTANCE_CD: _intIdData[0].SRC_DRUG_CD,
                            SECTION_NAME: _obj.label,
                            INT_ID: _obj.INT_ID,
                            SECTION_TYPE: "interaction",
                            drug_section_id: _obj._id,
                            drugId: _data[_idx]._id,
                            content_type: _data[_idx].content_type,
                            user_id: _data[_idx].assignedTo[0].userId,
                            role_id: _data[_idx].assignedTo[0].roleId,
                            audit: req.body.params.audit,
                            interacaction_drug_content: _intIdData
                        })
                    }
                })
                _insertSection = await _mUtils.commonMonogoCall("monography_production_sections", "insertMany", _sectionPushData, "", "", "", "");
                if (!(_insertSection && _insertSection.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: "insert section failed", data: [] })
                }
            }

            _sectionPushData = []
            if (resonseData.length > 0) {
                _.each(_tResp.data, (_obj, _indx) => {
                    _intIdData = []
                    let _reduceData = resonseData.filter((_keys, _objects) => {
                        if (_obj.INT_ID == _keys.INT_ID) {
                            _intIdData.push(_keys)
                        }
                    })
                    if (_intIdData.length > 0) {
                        if (_obj.children[0].label == "References") {
                            _intChildData = []
                            _.each(_intIdData, (_intObj, _intIndx) => {
                                _intObj.INTERACTIONS = ""
                                _intObj.REFERENCES = _intObj.REFERENCES
                                _intChildData.push(_intObj)
                            })
                            _sectionPushData.push({
                                DD_SUBSTANCE_CD: _intIdData[0].SRC_DRUG_CD,
                                SECTION_NAME: _obj.children[0].label,
                                SECTION_TYPE: "interaction",
                                INT_ID: _intChildData[0].INT_ID,
                                drug_section_id: _obj.children[0]._id,
                                drugId: _data[_idx]._id,
                                content_type: _data[_idx].content_type,
                                user_id: _data[_idx].assignedTo[0].userId,
                                role_id: _data[_idx].assignedTo[0].roleId,
                                audit: req.body.params.audit,
                                interacaction_drug_content: _intChildData
                            })
                            console.log("_sectionPushData", _sectionPushData)
                        }
                        //    _sectionPushData.push({
                        //        DD_SUBSTANCE_CD:_intIdData[0].SRC_DRUG_CD,
                        //        SECTION_NAME:_obj.label,
                        //        SECTION_TYPE:"interaction",
                        //        drug_section_id:_obj._id,
                        //        drugId:_data[_idx]._id,
                        //        content_type:_data[_idx].content_type,
                        //        user_id:_data[_idx].assignedTo[0].userId,
                        //        role_id:_data[_idx].assignedTo[0].roleId,
                        //        audit:req.body.params.audit,
                        //        interacaction_drug_content:_intIdData
                        //    })
                    }
                })
                _insertSection1 = await _mUtils.commonMonogoCall("monography_production_sections", "insertMany", _sectionPushData, "", "", "", "");
                if (!(_insertSection1 && _insertSection1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: "insert section failed", data: [] })
                }
            }
            _output.push({ success: true, desc: "", data: _insertSection.data || [] });
            _idx = _idx + 1
            await insertSectionDataAganistContentType(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

router.post("/insert-drug-details", async (req, res) => {
    try {
        _.each(req.body.params, (_p) => {
            _p["audit"] = req.body.params.audit
        });
        //  delete req.body.params.audit;
        // req.body.params["template"] = getTemplateData.data

        //      //insert section data aganist content type(interaction) start.
        //      //if(_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223"){
        //         let _insSectionData = await insertSectionDataAganistContentType(req.body.params,0,[],req)
        //    // }

        ////insert section data aganist content type(interaction) end.
        mongoMapper('monography_production_drugcreation', "insertMany", req.body.params).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }

            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": {
                    "_id": "$_id",
                    "label": "$label",
                    "isActive": "$isActive",
                    "content_type": "$content_type",
                    "revNo": "$revNo",
                    "sections": {
                        $filter: {
                            input: "$sections",
                            cond: {
                                $eq: ["$$this.recStatus", true]
                            }
                        }
                    },
                    "audit": "$audit",
                    "level": "$level",
                }
            }


            let _rResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", "")
            if (!(_rResp && _rResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            let statusResp_next_status;
            let _statusResp = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
            _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
            if (_statusResp && _statusResp.success) {
                let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === "NOT ACCEPTED" && objects.roleType === "" })
                statusResp_next_status = findIndx[0].next_status
            }


            let _assignedTo = [];
            let _idx = 0;
            _.each(req.body.params, (_p) => {
                _.each(_p.assignedTo, (_o) => {
                    //  let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    // && _r.content_type === _o.content_type
                    let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    if (_fRole && _fRole.length > 0) {
                        let _sections = [];
                        _.each(_fRole[0].sections, (_s) => {
                            _sections.push({
                                hcpId: _s.hcpId || null,
                                patientId: _s.patientId || null,
                                drugInteractionId: _s.drugInteractionId || null
                            });
                        });

                        _assignedTo.push({
                            dId: result.data[_idx]._id,
                            DD_SUBSTANCE_NAME: result.data[_idx].DD_SUBSTANCE_NAME,
                            DD_SUBSTANCE_CD: result.data[_idx].DD_SUBSTANCE_CD ? result.data[_idx].DD_SUBSTANCE_CD : "",
                            PARENT_DRUG_CD: result.data[_idx].PARENT_DRUG_CD ? result.data[_idx].PARENT_DRUG_CD : "",
                            next_status: statusResp_next_status,
                            assignedTo: _o,
                            content_type: _o.content_type,
                            previousAssigned: _p.previousAssigned,
                            audit: req.body.params.audit ? req.body.params.audit : "",
                            sections: _sections
                        });
                        _idx = _idx + 1
                    }
                });
            });

            let _mResp = await _mUtils.commonMonogoCall("monography_production_userAssign", "insertMany", _assignedTo, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }


            ///drug work flows functionality start          
            let _getContentWriterData = []
            _.each(_mResp.data, (_o, _i) => {
                _.each(_o.assignedTo, (_o1, _i1) => {
                    if (_o1.actionOfRole === "CONTENT WRITER") {
                        _getContentWriterData.push(_o)
                    }
                })
            })
            if (_getContentWriterData.length > 0) {
                let _cResp = await _mUtils.commonMonogoCall("monography_production_drugworkflow", "insertMany", _getContentWriterData, "", "", "", req.tokenData.dbType)
                if (!(_cResp && _cResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _cResp.desc || "", data: _cResp.data || [] });
                }
            }
            ///drug wrok flow functionality end.


            //tracking logic start
            let statusData = []
            _.each(_mResp.data, (obj, indx) => {
                statusData.push({
                    current_status: obj.current_status,
                    next_status: statusResp_next_status,
                    previous_status: obj.previous_status,
                    roleId: obj.assignedTo[0].roleId ? obj.assignedTo[0].roleId : "",
                    roleName: obj.assignedTo[0].roleName ? obj.assignedTo[0].roleName : "",
                    userId: obj.assignedTo[0].userId ? obj.assignedTo[0].userId : "",
                    userName: obj.assignedTo[0].userName ? obj.assignedTo[0].userName : "",
                    previousRoleId: obj.previousAssigned[0].roleId ? obj.previousAssigned[0].roleId : "",
                    previousRoleName: obj.previousAssigned[0].roleName ? obj.previousAssigned[0].roleName : "",
                    previousUserId: obj.previousAssigned[0].userId ? obj.previousAssigned[0].userId : "",
                    previousUserName: obj.previousAssigned[0].userName ? obj.previousAssigned[0].userName : "",
                    drugId: obj.dId,
                    operation_type: obj.operation_type ? obj.operation_type : "",
                    DD_SUBSTANCE_NAME: obj.DD_SUBSTANCE_NAME,
                    DD_SUBSTANCE_CD: obj.DD_SUBSTANCE_CD,
                    content_type: obj.content_type ? obj.content_type : "",
                    audit: req.body.params.audit,
                    user_assigned_table_id: _mResp.data[indx]._id,
                    drug_mono_id: obj._id
                })
            })
            let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", req.tokenData.dbType)
            //tracking logic end

            //insert section data aganist content type(interaction) start.
            if (_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223") {
                let _insSectionData = await insertSectionDataAganistContentType(_getContentWriterData, 0, [], req)
                if (!(_insSectionData && _insSectionData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _insSectionData || "", data: [] });
                }
            }

            ////insert section data aganist content type(interaction) end.
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Insert (or) Update Multiple documents in Nested Array */
async function insertUpdateInMultiData(_data, _idx, _output, req, _dbType, ...cmf) {
    try {
        if (_data.params.length > _idx) {

            if (_data.params[_idx]._id) {

                let _cBody = JSON.parse(JSON.stringify(_data));
                if (_idx !== 0) {
                    delete _cBody.params.history;
                }

                //   let statusData = []
                let statusResp_next_status;
                let _statusResp = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
                _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
                if (_statusResp && _statusResp.success) {
                    let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === _data.params[_idx].current_status && (objects.roleType === "" || objects.roleType === _data.params[_idx].assignedTo[0].actionOfRole) }, 0)
                    statusResp_next_status = findIndx[0].next_status
                }


                _cBody.params = {}
                _data.params[_idx].next_status = statusResp_next_status;
                _data.params[_idx]['audit'] = req.body.params.audit;
                _data.params[_idx]["revNo"] = _data.params[_idx].revNo ? _data.params[_idx].revNo + 1 : ""
                _cBody.params = _data.params[_idx];

                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
                let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, desc: _mResp.desc || "", data: [] });
                }
                else {
                    let updateDrugFlowData = {};
                    _.each(_cBody.params, (v, k) => {
                        if (k === "assignedTo") {
                            _.each(v, (o, i) => {
                                if (o.actionOfRole && o.actionOfRole === "CONTENT WRITER") {
                                    updateDrugFlowData = _cBody.params
                                }
                            })
                        }
                    })

                    if (Object.keys(updateDrugFlowData).length > 0) {
                        pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
                        let _mResp1 = await _mUtils.commonMonogoCall("monography_production_drugworkflow", cmf[1], pLoadResp.payload, "", "", "", _dbType)
                        if (!(_mResp1 && _mResp1.success)) {
                            //  _output.push({ success: false, desc: _mResp.desc || "", data: [] });
                        }
                    }

                    //get updating data with _id
                    let _s = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")

                    statusData.push({
                        current_status: _data.params[_idx].current_status ? _data.params[_idx].current_status : "",
                        next_status: statusResp_next_status ? statusResp_next_status : "",
                        roleId: _data.params[_idx].assignedTo[0].roleId ? _data.params[_idx].assignedTo[0].roleId : "",
                        roleName: _data.params[_idx].assignedTo[0].roleName ? _data.params[_idx].assignedTo[0].roleName : "",
                        userId: _data.params[_idx].assignedTo[0].userId ? _data.params[_idx].assignedTo[0].userId : "",
                        userName: _data.params[_idx].assignedTo[0].userName ? _data.params[_idx].assignedTo[0].userName : "",
                        drugId: _data.params[_idx].dId,
                        DD_SUBSTANCE_NAME: _data.params[_idx].DD_SUBSTANCE_NAME,
                        operation_type: _data.params[_idx].operation_type ? _data.params[_idx].operation_type : "",
                        audit: _data.params[_idx].audit ? _data.params[_idx].audit : "",
                        user_assigned_table_id: _data.params[_idx]._id ? _data.params[_idx]._id : "",
                        drug_mono_id: _data.params[_idx]._id ? _data.params[_idx]._id : ""
                    })
                    let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                    if (!(_statusflowTracking && _statusflowTracking.success)) {
                        _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                    }
                    _output.push({ success: true, desc: "", data: _mResp.data || [] });
                }
            }
            else {
                let insertData = [];
                insertData.push(_data.params[_idx])
                req.body.params = insertData;
                req.body.params[0].audit = req.cAudit;
                let _pResp = await _mUtils.commonMonogoCall("monography_production_drugcreation", "insertMany", req.body.params, "", "", "", "")
                if (!(_pResp && _pResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _pResp.desc || "", data: _pResp.data || [] });
                }

                let _filter = {
                    "filter": {
                        "recStatus": true
                    },
                    "selectors": {
                        "_id": "$_id",
                        "label": "$label",
                        "isActive": "$isActive",
                        "content_type": "$content_type",
                        "revNo": "$revNo",
                        "sections": {
                            $filter: {
                                input: "$sections",
                                cond: {
                                    $eq: ["$$this.recStatus", true]
                                }
                            }
                        },
                        "audit": "$audit",
                        "level": "$level",
                    }
                }

                let _rResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", "")
                if (!(_rResp && _rResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                }


                let statusResp_next_status;
                let _statusResp = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
                _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
                if (_statusResp && _statusResp.success) {
                    let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === "NOT ACCEPTED" && objects.roleType === "" })
                    statusResp_next_status = findIndx[0].next_status
                }


                let _assignedTo = [];
                //      let _idx = 0;
                _.each(req.body.params, (_p) => {
                    _.each(_p.assignedTo, (_o) => {
                        // && _r.content_type === _o.content_type 
                        let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                        if (_fRole && _fRole.length > 0) {
                            let _sections = [];
                            _.each(_fRole[0].sections, (_s) => {
                                _sections.push({
                                    hcpId: _s.hcpId || null,
                                    patientId: _s.patientId || null,
                                    drugInteractionId: _s.drugInteractionId || null
                                });
                            });

                            _assignedTo.push({
                                dId: _pResp.data[0]._id,
                                DD_SUBSTANCE_NAME: _pResp.data[0].DD_SUBSTANCE_NAME,
                                DD_SUBSTANCE_CD: _pResp.data[0].DD_SUBSTANCE_CD ? _pResp.data[0].DD_SUBSTANCE_CD : "",
                                PARENT_DRUG_CD: _pResp.data[0].PARENT_DRUG_CD ? _pResp.data[0].PARENT_DRUG_CD : "",
                                next_status: statusResp_next_status,
                                assignedTo: _o,
                                content_type: _o.content_type,
                                previousAssigned: _p.previousAssigned,
                                audit: req.cAudit ? req.cAudit : "",
                                sections: _sections
                            });
                            //  console.log("_assignedTo", _assignedTo)
                            //  _idx = _idx + 1
                        }
                    });
                });


                let _mResp = await _mUtils.commonMonogoCall("monography_production_userAssign", "insertMany", _assignedTo, "", "", "", "")
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }

                let _getContentWriterData = []
                _.each(_mResp.data, (_o, _i) => {
                    _.each(_o.assignedTo, (_o1, _i1) => {
                        if (_o1.actionOfRole === "CONTENT WRITER") {
                            _getContentWriterData.push(_o)
                        }
                    })
                })

                if (_getContentWriterData.length > 0) {
                    let _cResp = await _mUtils.commonMonogoCall("monography_production_drugworkflow", "insertMany", _getContentWriterData, "", "", "", req.tokenData.dbType)
                    if (!(_cResp && _cResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _cResp.desc || "", data: _cResp.data || [] });
                    }
                }

                ///drug wrok flow functionality end.


                let statusData = []
                _.each(_mResp.data, (obj, indx) => {
                    statusData.push({
                        current_status: obj.current_status,
                        next_status: statusResp_next_status,
                        roleId: obj.assignedTo[0].roleId ? obj.assignedTo[0].roleId : "",
                        roleName: obj.assignedTo[0].roleName ? obj.assignedTo[0].roleName : "",
                        userId: obj.assignedTo[0].userId ? obj.assignedTo[0].userId : "",
                        userName: obj.assignedTo[0].userName ? obj.assignedTo[0].userName : "",
                        previousRoleId: obj.previousAssigned[0].roleId ? obj.previousAssigned[0].roleId : "",
                        previousRoleName: obj.previousAssigned[0].roleName ? obj.previousAssigned[0].roleName : "",
                        previousUserId: obj.previousAssigned[0].userId ? obj.previousAssigned[0].userId : "",
                        previousUserName: obj.previousAssigned[0].userName ? obj.previousAssigned[0].userName : "",
                        operation_type: obj.operation_type ? obj.operation_type : "",
                        content_type: obj.content_type ? obj.content_type : "",
                        drugId: obj.dId,
                        DD_SUBSTANCE_NAME: obj.DD_SUBSTANCE_NAME,
                        DD_SUBSTANCE_CD: obj.DD_SUBSTANCE_CD,
                        audit: req.cAudit,
                        user_assigned_table_id: _mResp.data[indx]._id,
                        drug_mono_id: obj._id
                    })
                })
                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", req.tokenData.dbType);

                //insert section data aganist content type(interaction) start.
                if (_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223") {
                    let _insSectionData = await insertSectionDataAganistContentType(_getContentWriterData, 0, [], req)
                    if (!(_insSectionData && _insSectionData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _insSectionData || "", data: [] });
                    }
                }

                ////insert section data aganist content type(interaction) end.

                //   return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }
            _idx = _idx + 1;
            await insertUpdateInMultiData(_data, _idx, _output, req, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};

/**update userassigning data */
router.post("/update-userAssign-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        //  _cBody = { params:{_cBody}}
        let _updateResp = await insertUpdateInMultiData(_cBody, 0, [], req, "", 'monography_production_userAssign', 'bulkWrite', 'BW')
        return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


//update drugFlow Data functions start
async function InsertCommentdata(_data, _params, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let commentMaindata = []
            commentMaindata.push(_data[_idx])
            let _comments = {
                referenceType: _data[_idx].content_type ? _data[_idx].content_type : "",
                referenceId: _data[_idx].drugId ? _data[_idx].drugId : "",
                userId: _params.assignedTo[0].userId ? _params.assignedTo[0].userId : "",
                roleId: _params.assignedTo[0].roleId ? _params.assignedTo[0].roleId : "",
                roleName: _params.assignedTo[0].roleName ? _params.assignedTo[0].roleName : "",
                drug_section_id: _data[_idx].section_id ? _data[_idx].section_id : "",
                sectionName: _data[_idx].SECTION_NAME ? _data[_idx].SECTION_NAME : "",
                section_comment: commentMaindata.length > 0 ? commentMaindata : [],
                audit: req.cAudit
            }
            let _insertComment = await _mUtils.commonMonogoCall("monography_production_comments", "insertMany", _comments, "", "", "", "")
            if (!(_statusflowTracking && _statusflowTracking.success)) {
                //   _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
            }
            _output.push({ success: true, desc: "", data: _insertComment.data || [] });
            _idx = _idx + 1
            await InsertCommentdata(_data, _params, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function updateSectionData(_data, _idx, _output, req, _asnData, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));
            // if (_idx !== 0) {
            //     delete _cBody.params.history;
            // }

            let patData = {
                params: {
                    _id: _cBody[_idx]._id,
                    user_id: _asnData.assignedTo[0].userId,
                    role_id: _asnData.assignedTo[0].roleId,
                    audit: req.body.params.audit
                }
            };

            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], patData);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                // statusData.push({
                //     current_status: _data.params[_idx].current_status ? _data.params[_idx].current_status : "",
                //     next_status: statusResp_next_status ? statusResp_next_status : "",
                //     roleId: _data.params[_idx].assignedTo[0].roleId ? _data.params[_idx].assignedTo[0].roleId : "",
                //     roleName: _data.params[_idx].assignedTo[0].roleName ? _data.params[_idx].assignedTo[0].roleName : "",
                //     userId: _data.params[_idx].assignedTo[0].userId ? _data.params[_idx].assignedTo[0].userId : "",
                //     userName: _data.params[_idx].assignedTo[0].userName ? _data.params[_idx].assignedTo[0].userName : "",
                //     drugId: _data.params[_idx].dId,
                //     drugName: _data.params[_idx].DD_SUBSTANCE_NAME,
                //     audit: _data.params[_idx].audit ? _data.params[_idx].audit : "",
                //     user_assigned_table_id: _data.params[_idx]._id ? _data.params[_idx]._id : "",
                //     drug_mono_id: _data.params[_idx]._id ? _data.params[_idx]._id : ""
                // })
                // let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                // if (!(_statusflowTracking && _statusflowTracking.success)) {
                //     _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                // }
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await updateSectionData(_data, _idx, _output, req, _asnData, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
        console.log("error", error)
    }
}

async function updateDrugFlowDataWithSections(_data, _idx, _output, req, _dbType, ...cmf) {
    try {
        if (_data.params.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));

            let statusResp_next_status;
            let _statusResp = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
            _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
            if (_statusResp && _statusResp.success) {
                let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === _data.params[_idx].current_status && (objects.roleType === "" || objects.roleType === _data.params[_idx].assignedTo[0].actionOfRole) }, 0)
                statusResp_next_status = findIndx[0].next_status
            }

            _cBody.params = {}
            let statusData = []
            _data.params[_idx].next_status = statusResp_next_status;
            _data.params[_idx]['audit'] = req.body.params.audit;
            _data.params[_idx]["revNo"] = _data.params[_idx].revNo ? _data.params[_idx].revNo + 1 : "";


            _cBody.params = _data.params[_idx];

            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                let _filter = { "filter": { "recStatus": { $eq: true } } }
                let _sResp;
                // if (_cBody.params.previous_status == "SUBMIT FOR REVIEW" || _cBody.params.previous_status == "REVIEW APPROVED" || _cBody.params.previous_status == "APPROVED") {
                //     if (_cBody.params.section_comment.length > 0) {
                //         let _commentData = await InsertCommentdata(_cBody.params.section_comment, _cBody.params, 0, [], req)
                //         if (!(_commentData && _commentData.success)) {
                //             _output.push({ success: false, desc: _commentData.desc || "", data: [] });
                //         }
                //     }

                // }

                if (_cBody.params.assignedTo[0].actionOfRole === "REVIEWER" || _cBody.params.assignedTo[0].actionOfRole === "EXTERNAL REVIEWER" || _cBody.params.assignedTo[0].actionOfRole === "CONTENT WRITER") {

                    _filter.filter['role_id'] = _cBody.params.previousAssigned[0].roleId;
                    _filter.filter['user_id'] = _cBody.params.previousAssigned[0].userId;
                    _filter.filter['DD_SUBSTANCE_CD'] = _cBody.params.DD_SUBSTANCE_CD;
                    _filter.filter['content_type'] = _cBody.params.content_type
                    _sResp = await _mUtils.commonMonogoCall("monography_production_sections", "find", _filter, "", "", "", "")
                    if (!(_sResp && _sResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                    }
                    if ((_cBody.params.previousAssigned[0].actionOfRole === "APPROVER" && _cBody.params.current_status === "REVISION OPENED")) {
                        //  || (_cBody.params.previousAssigned[0].actionOfRole === "REVIEWER" && _cBody.params.current_status === "REVISION OPENED")
                        let _uResp = await _mUtils.commonMonogoCall("monography_production_roles", "findById", _cBody.params.assignedTo[0].roleId, "", "", "", "")
                        let _finalData = []
                        _.each(_uResp.data.sections, (objects, index) => {
                            _.each(_sResp.data, (_secObj, _secIndx) => {
                                if ((objects.hcpId === _secObj.drug_section_id) || (objects.patientId === _secObj.drug_section_id)) {
                                    _finalData.push(_secObj)
                                }
                            })
                            // _finalData= _.find(_sResp.data,(_secObj,_secIndx)=>{return objects.hcpId === _secObj.drug_section_id || objects.patientId === _secObj.drug_section_id });
                            // if(Object.keys(_finalData).length > 0){
                            //    console.log("_finalData",_finalData)
                            // }
                        })

                        _sResp.data = _finalData
                    }

                } else if (_cBody.params.assignedTo[0].actionOfRole === "APPROVER" || _cBody.params.assignedTo[0].actionOfRole === "PUBLISHER") {
                    delete _filter.filter.role_id
                    delete _filter.filter.user_id
                    delete _filter.filter.content_type
                    _filter.filter['DD_SUBSTANCE_CD'] = _cBody.params.DD_SUBSTANCE_CD;
                    _filter.filter['content_type'] = _cBody.params.content_type
                    _sResp = await _mUtils.commonMonogoCall("monography_production_sections", "find", _filter, "", "", "", "")
                    if (!(_sResp && _sResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                    }

                    if (_sResp.data.length > 0 && _cBody.params.content_type == "650a9d0ad9a18e495d89d223" && _cBody.params.assignedTo[0].actionOfRole === "PUBLISHER" && _cBody.params.previousAssigned[0].actionOfRole === "PUBLISHER") {
                        let _finalData = []
                        _.each(_sResp.data, (_obj, _indx) => {
                            if (_obj.interacaction_drug_content.length > 0) {
                                _.each(_obj.interacaction_drug_content, (_interObj, _interIndx) => {
                                    _finalData.push(_interObj)
                                })
                            }

                        })
                        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
                        let params = {
                            "TYPE": "DD_DRUG_MASTER",
                            "FLAG": "published",
                            "VAL1": _cBody.params.DD_SUBSTANCE_CD,
                            "JSON": _finalData
                            // "STATUS": req.body.params.status ? req.body.params.status : "",
                            // "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
                            // "ID": req.body.params.id ? req.body.params.id : ""
                        }
                        let _responseData;
                        let axiosData = await axios1.post(url, params).then((response) => {
                            _responseData = response
                            //  return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
                        }).catch((err) => {
                            console.log("err", err)
                        })

                    }

                }

                let _rParams = _cBody.params
                let _uSections = await updateSectionData(_sResp.data, 0, [], req, _rParams, "", "monography_production_sections", "findOneAndUpdate", "U")
                if (!(_uSections && _uSections.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                }


                //get drugFlow data with _id
                let _getId = _mResp.data._id;
                let _dData = await _mUtils.commonMonogoCall("monography_production_drugworkflow", "findById", _getId, "", "", "", "")
                statusData.push({
                    current_status: _dData.data.current_status ? _dData.data.current_status : "",
                    next_status: _dData.data.next_status ? _dData.data.next_status : "",
                    previous_status: _dData.data.previous_status ? _dData.data.previous_status : "",
                    roleId: _dData.data.assignedTo[0].roleId ? _dData.data.assignedTo[0].roleId : "",
                    roleName: _dData.data.assignedTo[0].roleName ? _dData.data.assignedTo[0].roleName : "",
                    userId: _dData.data.assignedTo[0].userId ? _dData.data.assignedTo[0].userId : "",
                    userName: _dData.data.assignedTo[0].userName ? _dData.data.assignedTo[0].userName : "",
                    previousRoleId: _dData.data.previousAssigned[0].roleId ? _dData.data.previousAssigned[0].roleId : "",
                    previousRoleName: _dData.data.previousAssigned[0].roleName ? _dData.data.previousAssigned[0].roleName : "",
                    previousUserId: _dData.data.previousAssigned[0].userId ? _dData.data.previousAssigned[0].userId : "",
                    previousUserName: _dData.data.previousAssigned[0].userName ? _dData.data.previousAssigned[0].userName : "",
                    operation_type: _dData.data.operation_type ? _dData.data.operation_type : "",
                    drugId: _dData.data.dId,
                    content_type: _dData.data.content_type ? _dData.data.content_type : "",
                    DD_SUBSTANCE_NAME: _dData.data.DD_SUBSTANCE_NAME,
                    DD_SUBSTANCE_CD: _dData.data.DD_SUBSTANCE_CD,
                    audit: req.cAudit,
                    drug_mono_id: _dData.data._id
                })

                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                if (!(_statusflowTracking && _statusflowTracking.success)) {
                    _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                }
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await updateDrugFlowDataWithSections(_data, _idx, _output, req, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
        console.log("error", error)
    }
}

router.post("/update-drugFlow-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _updateResp = await updateDrugFlowDataWithSections(_cBody, 0, [], req, "", 'monography_production_drugworkflow', 'bulkWrite', 'BW');
        return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


/* Common Axios call */
async function commonAxiosCall(type, url, params, config) {
    return new Promise((resolve, reject) => {
        try {
            if (type == "POST") {
                axios.post(url, params).then(function (res) {
                    resolve({ success: true, data: res.data || [] });
                }).catch(function (err) {
                    resolve({ success: false, data: [], desc: err });
                });
            }
            else if (type == "GET") {
                axios.get(url).then(function (res) {
                    resolve({ success: true, data: res.data || [] });
                }).catch(function (err) {
                    resolve({ success: false, data: [], desc: err });
                });
            }
        }
        catch (ex) {
            resolve({ success: false, data: [], desc: ex.message || ex });
        }
    });
};


router.post("/testing", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code
            },
            "selectors": "-history"
        }
        let _statusResp = []
        _statusResp = await _mUtils.commonMonogoCall("monography_production_sections", "find", _filter, "", "", "", "");
        let _finalData = []
        _.each(_statusResp.data, (_obj, _indx) => {
            _.each(_obj.interacaction_drug_content, (_interObj, _interIndx) => {
                _finalData.push(_interObj)
            })
        })
        console.log("_finalData", _finalData)

        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "FLAG": "published",
            "VAL1": req.body.params.dd_substance_code,
            "JSON": _finalData
            // "STATUS": req.body.params.status ? req.body.params.status : "",
            // "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
            // "ID": req.body.params.id ? req.body.params.id : ""
        }
        let arrey1 = []

        let jj = await axios1.post(url, params).then((response) => {
            console.log("response", response)
            //   return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })

        let data = "kiran"
        let data1 = "sdfjhjfbfjhbfjh"
    } catch (error) {

    }
})

router.post("/get-drugFlow-data", async (req, res) => {
    try {

        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "content_type": req.body.params.content_type,
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
            }
        }

        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_production_drugworkflow", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("error", error)
    }
})

router.post("/get-history-drugFlow-data", async (req, res) => {
    try {

        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
                "content_type": req.body.params.content_type
            }
        }

        //    let _pGData = await prepareGetPayload(_filter, req.body.params);
        //    if (!_pGData.success) {
        //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        //    }
        mongoMapper("monography_production_drugmonographyworkflowtracking", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {

    }
})

//update drugFlow Data functions end.

//convert excel to json data
router.post("/convertToExcel", (req, res) => {
    try {

    } catch (error) {

    }
})



/*Buk Insert Entity */
router.post("/bulk-insert-drug-details", async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let resonseData = []
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "FLAG": "DD_DRUG"
        }

        await axios1.post(url, params).then((response) => {
            resonseData = response.data
        }).catch((err) => {
            console.log("err", err)
        })

        let _drugData = []
        _.each(resonseData, (o, i) => {
            _drugData.push({
                "documentTitle": o.DD_SUBSTANCE_NAME,
                "Cd": o.DD_SUBSTANCE_CD,
                "medicinalCode": o.DD_DRUG_MASTER_CD,
                "template": getTemplateData.data,
                "audit": req.body.params.audit,
                "assignedTo": [
                    {
                        "roleId": "642ed10515dc6eeb77d902f2",
                        "levelId": "642eb96f5a774ad6f7d22e6f",
                        "userId": "642fe4f4a8c7d34e77b33c3a"
                    }
                ]

            })
        })


        req.body.params = _drugData
        mongoMapper('monography_production_drugcreation', "insertMany", req.body.params).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }
            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": "-audit -history"
            }
            let _rResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", "")
            if (!(_rResp && _rResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            let _assignedTo = [];
            let _idx = 0
            _.each(req.body.params, (_p, _i) => {
                _.each(_p.assignedTo, (_o) => {
                    let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    if (_fRole && _fRole.length > 0) {
                        let _sections = [];
                        _.each(_fRole[0].sections, (_s) => {
                            _sections.push({
                                hcpId: _s.hcpId || null,
                                patientId: _s.patientId || null
                            });
                        });
                        _assignedTo.push({
                            dId: result.data[_idx]._id,
                            DD_SUBSTANCE_NAME: result.data[_idx].documentTitle,
                            assignedTo: _o,
                            sections: _sections
                        });
                        _idx = _idx + 1
                    }
                });
            });
            let _mResp = await _mUtils.commonMonogoCall("monography_production_userAssign", "insertMany", _assignedTo, "", "", "", "")
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
// router.post("/get-user-drug-details", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": {
//                 "assignedTo.userId": req.body.params.userId
//             },
//             "limit":req.body.params.limit,
//             "selectors": "-history"    
//         }       

//         // let _pGData = await prepareGetPayload(_filter, req.body.params);
//         // if (!_pGData.success) {
//         //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//         // }
//         mongoMapper("monography_production_userAssign", "find", _filter, "").then(async (result) => {
//             if (!(result && result.data && result.data.length > 0)) {
//                 return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
//             }
//             let _mapData = _.chain(result.data).groupBy('status')
//                 .map((_d, _k) => {
//                     return {
//                         "status": _k,
//                         "list": _d
//                     }
//                 }).value();
//             return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });


router.post("/get-user-drug-details", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                recStatus: { $eq: true }
            },
            //"limit": req.body.params.limit,
            "selectors": "-history"
        }
        let _method = "";
        let _drugsList = [];
        if (req.body.params.flag === "cStatus") {
            _filter.filter['assignedTo.userId'] = req.body.params.userId;
            _filter.filter['assignedTo.roleId'] = req.body.params.roleId;
            _filter.filter['current_status'] = req.body.params.current_status;
            _filter.filter['content_type'] = req.body.params.content_type
            _method = "monography_production_drugworkflow"
        } else if (req.body.params.flag === "pStatus") {
            _filter['filter'] = {}
            _filter.filter['previousUserId'] = req.body.params.userId
            _filter.filter['previousRoleId'] = req.body.params.roleId
            _filter.filter['previous_status'] = req.body.params.previous_status;
            _filter.filter['content_type'] = req.body.params.content_type
            _method = "monography_production_drugmonographyworkflowtracking"
        }

        mongoMapper(_method, "find", _filter, "").then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `no data found`, data: [] });
            }
            if (req.body.params.flag === "cStatus") {
                let _sessionInsertRes;
                let session_id;
                if (result.data && result.data.length > 0) {
                    let _filter = {
                        "filter": { recStatus: true },
                        "selectors": "-audit -history"
                    }
                    let _sessionRes = await _mUtils.commonMonogoCall("monography_production_userSession", "find", _filter, "", "", "", "")
                    //   let num = _sessionRes.data[0].session_id
                    let params = {};
                    if (_sessionRes.data.length == 0) {
                        session_id = 1
                    } else {
                        let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
                        let _cal = _descData[0].session_id + 1;
                        session_id = _cal
                    }
                    params = {
                        "userId": req.body.params.userId,
                        "roleId": req.body.params.roleId,
                        "user_revNo": result.data[0].revNo,
                        "machine": req.body.params.machine ? req.body.params.machine : "",
                        "version": req.body.params.version ? req.body.params.version : "",
                        "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
                        "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
                        "session_id": session_id,
                        "browser": req.body.params.browser ? req.body.params.browser : "",
                        "audit": {
                            "documentedBy": result.data[0].displayName,
                            "documentedById": result.data[0]._id
                        }
                    }
                    _sessionInsertRes = await _mUtils.commonMonogoCall("monography_production_userSession", "insertMany", params, "", "", "", "")
                    if (!(_sessionInsertRes && _sessionInsertRes.success)) {
                        console.log("Error Occured while updating appointment details to Patient");
                    }

                }

                let _drugsList = [];
                let _mapData = _.chain(result.data).groupBy('status')
                    .map((_d, _k) => {
                        // console.log("dId", _.chain(_d).groupBy('dId').value());
                        let _drugs = _.groupBy(_d, "dId");
                        _.map(_drugs, (_o, _i) => {
                            if (_o && _o.length > 0) {
                                _drugsList.push(_o[0]);
                            }
                        });
                        return {
                            "status": _k,
                            "session_id": _sessionInsertRes.data[0].session_id,
                            "list": _drugsList
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
            } else if (req.body.params.flag === "pStatus") {
                let _getFinalTrackData = []
                let _mapData1 = _.chain(result.data).groupBy('status')
                    .map((_obj, _ind) => {
                        _.map(_obj, (_o, _i) => {
                            _getFinalTrackData.push({
                                dId: _o._id,
                                DD_SUBSTANCE_CD: _o.DD_SUBSTANCE_CD,
                                DD_SUBSTANCE_NAME: _o.DD_SUBSTANCE_NAME,
                                PARENT_DRUG_CD: _o.PARENT_DRUG_CD ? _o.PARENT_DRUG_CD : "",
                                assignedTo: [
                                    {
                                        roleId: _o.previousRoleId ? _o.previousRoleId : "",
                                        roleName: _o.previousRoleName ? _o.previousRoleName : "",
                                        sequence: _o.sequence ? _o.sequence : "",
                                        actionOfRole: _o.actionOfRole ? _o.actionOfRole : "",
                                        levelId: _o.levelId ? _o.levelId : "",
                                        levelName: _o.levelName ? _o.levelName : "",
                                        userId: _o.previousUserId ? _o.previousUserId : "",
                                        userName: _o.previousUserName ? _o.previousUserName : ""
                                        // roleId: _o.roleId ? _o.roleId  :"",
                                        // roleName:_o.roleName ? _o.roleName  :"",
                                        // sequence:_o.sequence ? _o.sequence  :"",
                                        // actionOfRole:_o.actionOfRole ? _o.actionOfRole  :"",
                                        // levelId:_o.levelId ? _o.levelId  :"" ,
                                        // levelName:_o.levelName ? _o.levelName  :"" ,
                                        // userId: _o.userId ? _o.userId  :"",
                                        // userName: _o.userName ? _o.userName  :""
                                    }
                                ],
                                previousAssigned: [
                                    {
                                        roleId: _o.roleId ? _o.roleId : "",
                                        roleName: _o.roleName ? _o.roleName : "",
                                        sequence: _o.sequence ? _o.sequence : "",
                                        actionOfRole: _o.actionOfRole ? _o.actionOfRole : "",
                                        levelId: _o.levelId ? _o.levelId : "",
                                        levelName: _o.levelName ? _o.levelName : "",
                                        userId: _o.userId ? _o.userId : "",
                                        userName: _o.userName ? _o.userName : ""
                                        // roleId: _o.previousRoleId ? _o.previousRoleId  :"",
                                        // roleName:_o.previousRoleName ? _o.previousRoleName  :"",
                                        // sequence:_o.sequence ? _o.sequence  :"",
                                        // actionOfRole:_o.actionOfRole ? _o.actionOfRole  :"",
                                        // levelId:_o.levelId ? _o.levelId  :"" ,
                                        // levelName:_o.levelName ? _o.levelName  :"" ,
                                        // userId: _o.previousUserId ? _o.previousUserId  :"",
                                        // userName: _o.previousUserName ? _o.previousUserName  :""
                                    }
                                ],
                                assignedDt: new Date().toISOString(),
                                current_status: _o.previous_status,
                                next_status: _o.next_status,
                                audit: _o.audit
                            })
                        })
                        return {
                            "status": _ind,
                            "list": _getFinalTrackData
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData1 || [] });

            }
        })

        // let _filter = {
        //     "filter": {
        //         "assignedTo.userId": req.body.params.userId,
        //         "assignedTo.roleId": req.body.params.roleId,
        //         "current_status": req.body.params.current_status
        //     },
        //     "limit": req.body.params.limit,
        //     "selectors": "-history"
        // }

        // // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // // if (!_pGData.success) {
        // //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // // }

        // let _sessionInsertRes;
        // let session_id;
        // mongoMapper(_method, "find", _filter, "").then(async (result) => {
        //     if (!(result && result.data && result.data.length > 0)) {
        //         return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
        //     }

        //     if (result.data && result.data.length > 0) {
        //         let _filter = {
        //             "filter": { recStatus: true },
        //             "selectors": "-audit -history"
        //         }
        //         let _sessionRes = await _mUtils.commonMonogoCall("monography_production_userSession", "find", _filter, "", "", "", "")
        //         //   let num = _sessionRes.data[0].session_id
        //         let params = {};
        //         if (_sessionRes.data.length == 0) {
        //             session_id = 1
        //         } else {
        //             let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
        //             let _cal = _descData[0].session_id + 1;
        //             session_id = _cal
        //         }
        //         params = {
        //             "userId": req.body.params.userId,
        //             "roleId": req.body.params.roleId,
        //             "user_revNo": result.data[0].revNo,
        //             "machine": req.body.params.machine ? req.body.params.machine : "",
        //             "version": req.body.params.version ? req.body.params.version : "",
        //             "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
        //             "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
        //             "session_id": session_id,
        //             "browser": req.body.params.browser ? req.body.params.browser : "",
        //             "audit": {
        //                 "documentedBy": result.data[0].displayName,
        //                 "documentedById": result.data[0]._id
        //             }
        //         }
        //         _sessionInsertRes = await _mUtils.commonMonogoCall("monography_production_userSession", "insertMany", params, "", "", "", "")
        //         if (!(_sessionInsertRes && _sessionInsertRes.success)) {
        //             console.log("Error Occured while updating appointment details to Patient");
        //         }

        //     }



        //     let _drugsList = [];
        //     let _mapData = _.chain(result.data).groupBy('status')
        //         .map((_d, _k) => {
        //             // console.log("dId", _.chain(_d).groupBy('dId').value());
        //             let _drugs = _.groupBy(_d, "dId");
        //             _.map(_drugs, (_o, _i) => {
        //                 if (_o && _o.length > 0) {
        //                     _drugsList.push(_o[0]);
        //                 }
        //             });
        //             return {
        //                 "status": _k,
        //                 "session_id": _sessionInsertRes.data[0].session_id,
        //                 "list": _drugsList
        //             }
        //         }).value();
        //     return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
        // }).catch((error) => {
        //    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        //  });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/get-search-drug-details", (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let _filter = { "filter": { recStatus: { $eq: true } } };
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
            _filter.filter["DD_SUBSTANCE_NAME"] = nameExp
            mongoMapper("monography_production_userAssign", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });

        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        console.log("error", error)
    }
})


router.post("/get-total-drugData-with-allUsers", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
                "content_type": req.body.params.content_type
            },
            "selectors": "-history"
        }
        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_production_userAssign", "find", _filter, req.tokenData.dbType).then((result) => {
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

            let dataJson = _cBody.params.template.patient;
            let hcpData = _cBody.params.template.hcp
            // [
            //     {
            //       "_id":"642ea9b76b3fd6884b63e335",
            //       "data":  `<p>
            //       <style type="text/css"></style><span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}"><strong>If you want more information about Atorvastatin:&nbsp;</strong></span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Talk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}"><strong>General information about Atorvastatin:&nbsp;</strong></span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Medicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets.&nbsp;</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Do not use Atorvastatin for a condition for which it was not prescribed.&nbsp;</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Do not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.&nbsp;</span></span>
            //       <br>
            //       &nbsp;
            //   </p>`
            //      }
            //     ]

            // let _data = `[
            // 	{
            // 		"_id":"642ea9b76b3fd6884b63e335",
            // 		"data":'<p>\n<style type=\"text/css\">
            // 		</style>
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\">
            // 		<span style=\"font-style:normal;font-weight:normal;\" 
            // 		data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">
            // 		<strong>What is the medication used for?&nbsp;</strong>
            // 		</span></span>\n                        
            // 		<br>\n                       
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\">
            // 		<span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine has been prescribed to you for;&nbsp;
            // 		</span></span>\n       
            // 		<br>\n                       
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">The treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine can be used by itself or with other medicines to treat these conditions.&nbsp;</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\"><strong>What it does?&nbsp;</strong></span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine is a type of medicine known as a calcium channel blocker (CCB).&nbsp;</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">It relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.</span></span>\n                        <br>\n                        &nbsp;\n                    </p>'
            //     }
            // ]
            //     `

            let pLoadResp = { payload: {} };
            if (_cBody.params.template['patient']) {
                _cBody.params.template['patient'] = dataJson
            } else if (_cBody.params.template['hcp']) {
                _cBody.params.template['hcp'] = hcpData
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_production_drugcreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_production_drugcreation', _mResp.data.params, _cBody.params, req, "monography_production");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }

            }
            mongoMapper('monography_production_drugcreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
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


/* get all drugCreation */
router.post("/get-drugData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_production_drugcreation", "find", _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* get all drugCreation */
router.post("/get-drug-list", async (req, res) => {
    try {
        let url = "http://172.30.29.107:9001/pharmacy/api/getMasterData"
        let resonseData = []
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "FLAG": "DD_DRUG"
        }

        await axios1.post(url, params).then((response) => {
            resonseData = response.data
        }).catch((err) => {
            console.log("err", err)
        })
        res.status(200).json({ success: true, status: 200, desc: '', data: resonseData });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/update-drugCreation", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_production_drugCreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_production_drugCreation', _mResp.data.params, _cBody.params, req, "monography_production");
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
            mongoMapper('monography_production_drugCreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
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
        mongoMapper('monography_production_userAssign', req.body.query, req.body.params).then(async (result) => {
            let _filter = {
                "filter": { "_id": result.data[0].assignedTo[0].roleId },
                "selectors": "-audit -history"
            }

            let _mResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", req.body.params.dbType)
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

/*get all userAssign */
router.post("/get-userAssignData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_production_userAssign", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*inserHistory*/
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

/*insert coremasterData */
router.post("/insert-coreMasterData", async (req, res) => {
    try {
        mongoMapper('monography_production_coreMasters', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*get coreMasterData */
router.post("/get-coreData", async (req, res) => {
    try {
        let _filter = {
            "filter": { recStatus: true },
            "selectors": ""
        }
        mongoMapper("monography_production_coreMasters", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert histroryData */
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

async function emptyTempalteData(keys, values) {
    if (keys === "hcp" || keys === "patient") {
        _.each(values, (_obj, _ind) => {
            if (_obj.children.length > 0) {
                _.each(_obj.children, (_cObj, _cInd) => {
                    if (_cObj.children.length > 0) {
                        _.each(_cObj.children, (_c1Obj, _c1Ind) => {
                            _c1Obj.data = ""
                        })
                    }
                    _cObj.data = ""
                })
            }
            _obj.data = ""
        })
    }
}


router.post("/get-template", async (req, res) => {
    try {
        _.each(getTemplateData.data, async (_val, _key) => {
            let templateEmptyData = await emptyTempalteData(_key, _val)
        })
        return res.status(200).send(getTemplateData);
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
})


/**get data from sql server with limit records */
router.post("/get-db-data", async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "STATUS": req.body.params.status ? req.body.params.status : "",
            "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
            "ID": req.body.params.id ? req.body.params.id : ""
        }
        if (req.body.params.flag === "DRUG_INTERACTIONS") {
            params['FLAG'] = req.body.params.flag
        } else if (req.body.params.flag === "DD_DRUG") {
            params['FLAG'] = req.body.params.flag
        }

        let arrey1 = []
        axios1.post(url, params).then((response) => {
            // _.each(response.data,(obj,indx)=>{
            //     let arrey=[]
            //     arrey1=[]
            //     arrey.push(obj)
            //     _.each(response.data,(o,i)=>{
            //          if(o.DD_DRUG_MASTER_CD ===arrey[0].PARENT_DRUG_CD){
            //             arrey1.push(o)
            //          }
            //     })
            //     obj['children']=arrey1
            // })

            //  let parentData = _.filter(response.data,(obj,indx)=>{ return obj.PARENT_DRUG_CD !==null })
            //  console.log("parentData",parentData)
            //  _.each(parentData,(obj,indx)=>{
            //      _.each(response.data,(obj1,indx1)=>{
            //         if(obj1.DD_DRUG_MASTER_CD=== obj.PARENT_DRUG_CD){
            //             arrey.push(obj)
            //             obj1['children']=arrey
            //         }
            //      })
            //  })
            //  console.log("response",response.data)
            // let filterData = response.data.slice(0, 10)
            if (response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
                let filterData = JSON.parse(response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]).slice(0, 10)
                return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
            } else {
                return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
            }

        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});


// router.post("/get-db-data", async (req, res) => {
//     try {
//         let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
//         let params = {
//             "TYPE": "DD_DRUG_MASTER",
//             "FLAG":"DD_DRUG",
//             "STATUS": req.body.params.status ? req.body.params.status : "",
//             "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
//             "ID": req.body.params.id ? req.body.params.id : ""
//         }
//         // if (req.body.params.flag === "DRUG_INTERACTIONS") {
//         //     params['FLAG'] = req.body.params.flag
//         // } else if (req.body.params.flag === "DD_DRUG") {
//         //     params['FLAG'] = req.body.params.flag
//         // }

//         let arrey1 = []
//         axios1.post(url, params).then((response) => {
//             // _.each(response.data,(obj,indx)=>{
//             //     let arrey=[]
//             //     arrey1=[]
//             //     arrey.push(obj)
//             //     _.each(response.data,(o,i)=>{
//             //          if(o.DD_DRUG_MASTER_CD ===arrey[0].PARENT_DRUG_CD){
//             //             arrey1.push(o)
//             //          }
//             //     })
//             //     obj['children']=arrey1
//             // })

//             //  let parentData = _.filter(response.data,(obj,indx)=>{ return obj.PARENT_DRUG_CD !==null })
//             //  console.log("parentData",parentData)
//             //  _.each(parentData,(obj,indx)=>{
//             //      _.each(response.data,(obj1,indx1)=>{
//             //         if(obj1.DD_DRUG_MASTER_CD=== obj.PARENT_DRUG_CD){
//             //             arrey.push(obj)
//             //             obj1['children']=arrey
//             //         }
//             //      })
//             //  })
//             //  console.log("response",response.data)
//             // let filterData = response.data.slice(0, 10)
//             if (response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
//                 let filterData = JSON.parse(response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]).slice(0, 10)
//                 return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
//             }

//         }).catch((err) => {
//             console.log("err", err)
//         })
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });


async function getRoleParticularData(_flag, _params) {
    //  let _resp;
    new Promise(async (resolve, reject) => {
        let _filter = {
            "filter": {
                "recStatus": true
            },
            "selectors": {
                "_id": "$_id",
                "label": "$label",
                "isActive": "$isActive",
                "content_type": "$content_type",
                "revNo": "$revNo",
                "sections": {
                    $filter: {
                        input: "$sections",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "level": "$level",
            }
        }
        if (_flag === 'G') {
            _filter.filter['_id'] = _params.assignedTo[0].roleId;
        }

        mongoMapper("monography_production_roles", "find", _filter, "").then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

        // let _rResp = await _mUtils.commonMonogoCall("monography_production_roles", "find", _filter, "", "", "", "")
        // if (!(_rResp && _rResp.success)) {
        //     resolve({ success: false, data: [], desc: `Error occured While executing proc, Error: - ${_rResp.desc || error} ` })
        //    // return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
        // }
        // resolve({ success: true, data: _rResp.data || [] })
    })
}

async function getAllAssignDrugDetails(_data, _indx, _output, req) {
    try {
        if (_data.length > _indx) {
            let _filter = {
                "filter": {
                    "DD_SUBSTANCE_NAME": _data[_indx].DD_SUBSTANCE_NAME,
                    "content_type": req.body.params.content_type
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_production_userAssign", "find", _filter, "", req.body, "", req.tokenData.dbType);
            if (_mResp.data.length > 0) {

                _.each(_mResp.data, async (obj, indx) => {
                    //  let _getRoleData = await getRoleParticularData("G",obj)
                    //  console.log("_getRoleData",_getRoleData)
                    _output.push(obj)
                })
            }
            _indx = _indx + 1;
            await getAllAssignDrugDetails(_data, _indx, _output, req);
        }
        else {
            return { data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};

/*get assign drus data with all users  */
router.post('/get-assignData-all-users', async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            // "FLAG": "DD_DRUG",
            "STATUS": req.body.params.status ? req.body.params.status : "",
            "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
            "ID": req.body.params.id ? req.body.params.id : ""
        }
        if (req.body.params.flag === "DRUG_INTERACTIONS") {
            params['FLAG'] = req.body.params.flag
        } else if (req.body.params.flag === "DD_DRUG") {
            params['FLAG'] = req.body.params.flag
        }

        axios1.post(url, params).then(async (response) => {
            if (response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
                let filterData = JSON.parse(response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
                let getPatientData = await getAllAssignDrugDetails(filterData, 0, [], req)
                return res.status(200).json({ success: true, status: 200, data: getPatientData.data, desc: "" });
            } else {
                return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
            }

        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {

    }
})


/**get search data fro m sql server */
router.post("/get-search-db-data", async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "STATUS": req.body.params.status ? req.body.params.status : "",
            "SEARCH_COL": req.body.params.searchValue ? req.body.params.searchValue : "",
            "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
            "ID": req.body.params.id ? req.body.params.id : ""
        }
        if (req.body.params.flag === "DRUG_INTERACTIONS") {
            params['FLAG'] = req.body.params.flag
        } else if (req.body.params.flag === "DD_DRUG") {
            params['FLAG'] = req.body.params.flag
        }
        let finalData = []
        axios1.post(url, params).then((response) => {
            if (response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
                let filterData = JSON.parse(response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
                // _.filter(filterData, (_ro, _ri) => {
                //     if (_ro.DD_SUBSTANCE_NAME.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {
                //         finalData.push(_ro)
                //     }
                // })
                return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
            } else {
                return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
            }

        }).catch((err) => {

        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-interactions-from-db", async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
        let params = {
            "TYPE": "DRUG_INTERACTIONS",
            "FLAG": "A",
            "ID2": req.body.params.id2
        }
        let finalData = []
        axios1.post(url, params).then((response) => {
            // if (response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
            //     let filterData = JSON.parse(response.data[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
            //     return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
            // } else {
            //     return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
            // }
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {

        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

/**Insert Counter */
router.post("/insert-counter", async (req, res) => {
    try {
        // req.body.params.locId = req.tokenData.locId;
        //  req.body.params.locName = req.tokenData.locName;
        mongoMapper('monography_production_counters', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert Status */
router.post("/insert-status", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Status' }, "monography_production", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["drug_Mongrophy_Status_Code"] = _seqResp.data;
        mongoMapper('monography_production_drugmonographyworkflowstatuses', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**get status */
router.post("/get-status", async (req, res) => {
    try {
        let _filter = {
            "filter": { recStatus: true },
            "selectors": "-history"
        }
        mongoMapper("monography_production_drugmonographyworkflowstatuses", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


async function insertCommentsData(_method, data, req) {
    return new Promise(async (resolve, rejected) => {
        try {
            let params = {
                referenceType: req.body.params.content_type ? req.body.params.content_type : "",
                referenceId: req.body.params.drugId ? req.body.params.drugId : "",
                userId: req.body.params.user_id ? req.body.params.user_id : "",
                roleId: req.body.params.role_id ? req.body.params.role_id : "",
                roleName: req.body.params.roleName ? req.body.params.roleName : "",
                drug_section_id: req.body.params.drug_section_id ? req.body.params.drug_section_id : "",
                sectionName: req.body.params.SECTION_NAME ? req.body.params.SECTION_NAME : "",
                section_comment: data.section_comment ? data.section_comment : "",
                sections_table_id: data._id ? data._id : "",
                audit: req.body.params.audit
            }
            let _mResp = await _mUtils.commonMonogoCall(_method, "insertMany", params, "", "", "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error: - ${_mResp.desc} ` });
            }
            resolve({ success: true, data: _mResp.data, desc: `` });
        } catch (error) {
            return { success: false, data: [], desc: `Error occured, Error: - ${error} ` }
        }
    })
}

/**insert Status */
router.post("/insert-section-data", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Section' }, "monography_production", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        let _filter = {
            "filter": { session_id: req.body.params.session_id },
            "selectors": "-history"
        };
        let _userAssignResp;
        let _sessionResp = await _mUtils.commonMonogoCall("monography_production_userSession", "find", _filter, "", "", "", req.tokenData.dbType)
        req.body.params['user_id'] = _sessionResp.data[0].userId;
        req.body.params['role_id'] = _sessionResp.data[0].roleId;
        req.body.params["drug_monography_Code"] = _seqResp.data;
        // let _statusResp = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowstatuses", "find", req.body.params.current_status_id, "", "", "", req.tokenData.dbType)
        //    req.body.params['current_status'] = _statusResp.data.Drug_Mon_Status;
        // delete _filter.filter.session_id
        if (req.body.params.user_id && req.body.params.drugId) {
            _filter.filter['dId'] = req.body.params.drugId;
            _filter.filter['assignedTo.userId'] = req.body.params.user_id;
            _filter.filter['assignedTo.roleId'] = req.body.params.role_id
            _userAssignResp = await _mUtils.commonMonogoCall("monography_production_drugworkflow", "find", _filter, "", "", "", req.tokenData.dbType)
        }

        _.each(req.body.params.interacaction_drug_content, (_o) => {
            _o.recStatus = true;
            _o.audit = req.body.params.audit;
        });
        mongoMapper('monography_production_sections', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
            if (result.data.length > 0) {
                let _trackingFlowdata = {
                    current_status: result.data[0].current_status ? result.data[0].current_status : "",
                    userId: result.data[0].userId ? result.data[0].userId : "",
                    roleId: result.data[0].roleId ? result.data[0].roleId : "",
                    drugId: result.data[0].drugId ? result.data[0].drugId : "",
                    content_type: result.data[0].content_type ? result.data[0].content_type : "",
                    DD_SUBSTANCE_NAME: result.data[0].DD_SUBSTANCE_NAME ? result.data[0].DD_SUBSTANCE_NAME : "",
                    done_by: result.data[0].audit.documentedBy,
                    //  user_assigned_table_id: _userAssignResp.data[0]._id ? _userAssignResp.data[0]._id : "",
                    drug_mono_id: result.data[0]._id,
                    audit: req.body.params.audit
                }
                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_production_drugmonographyworkflowtracking", "insertMany", _trackingFlowdata, "", "", "", req.tokenData.dbType);
                if (!(_statusflowTracking && _statusflowTracking.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _statusflowTracking.desc || "", data: _statusflowTracking.data || [] });
                }
            }
            let _cResp = await insertCommentsData("monography_production_comments", result.data[0], req)
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert comment data */
router.post("/insert-comment-data", async (req, res) => {
    try {
        mongoMapper('monography_production_comments', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**get-comment box */
router.post("/get-comments-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                recStatus: { $eq: true },
                "referenceId": req.body.params.drugId,
                "drug_section_id": req.body.params.drug_section_id
            }
        }
        mongoMapper("monography_production_comments", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {

    }
})


// router.post("/insert-section-data", async (req, res) => {
//     try {
//         let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Section' }, "monography_production", req);
//         if (!(_seqResp && _seqResp.success)) {
//             return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
//         }
//         let _filter = {
//             "filter": { session_id:req.body.params.session_id},
//             "selectors": "-history"
//         }
//         let _sessionResp = await _mUtils.commonMonogoCall("monography_userSession", "find",_filter, "","", "", req.tokenData.dbType)
//         console.log("_sessionResp",_sessionResp)
//         req.body.params['user_id']=_sessionResp.data[0].userId;
//         req.body.params['role_id']=_sessionResp.data[0].roleId;
//         // if (!(_mResp && _mResp.success)) {
//         //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//         // }
//         req.body.params["drug_monography_Code"] = _seqResp.data;
//         mongoMapper('monography_sections', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });

/* get section-data */
router.post("/get-section-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "drug_section_id": req.body.params.drug_section_id,
                "DD_SUBSTANCE_CD": req.body.params.drug_substance_code,
                "content_type": req.body.params.content_type,
                "role_id": req.body.params.roleId
            },
            "selectors": "-history"
        }
        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_production_sections", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

//get totalView data  to rxseed 
router.post("/get-totalView-data-to-rxseed", async (req, res) => {
    try {
        if (req.body.params.drug_substance_code) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "content_type": req.body.params.content_type,
                    "DD_SUBSTANCE_CD": req.body.params.drug_substance_code
                },
                "selectors": "-history"
            }

            if (req.body.params.section_type) {
                _filter.filter['SECTION_TYPE'] = req.body.params.section_type
            }

            //    let _pGData = await prepareGetPayload(_filter, req.body.params);
            //    if (!_pGData.success) {
            //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            //    }
            mongoMapper("monography_production_sections", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})



/* get view data(against roleid and userId from Section Table)*/
router.post("/get-view-data", async (req, res) => {
    try {
        if (req.body.params.userId && req.body.params.roleId) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "content_type": req.body.params.content_type,
                    "role_id": req.body.params.roleId,
                    "user_id": req.body.params.userId,
                    "DD_SUBSTANCE_CD": req.body.params.drug_substance_code
                },
                "selectors": "-history"
            }


            if (req.body.params.section_type) {
                _filter.filter['SECTION_TYPE'] = req.body.params.section_type
            }

            //    let _pGData = await prepareGetPayload(_filter, req.body.params);
            //    if (!_pGData.success) {
            //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            //    }
            mongoMapper("monography_production_sections", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})

/**update-section-data*/
router.post("/update-section-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_production_sections", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            // let _cResp = await insertCommentsData("monography_production_comments", _mResp.data.params, req)
            // if (!(_cResp && _cResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc:"comments data not valid", data: [] });
            // }

            let _hResp = await _mUtils.insertHistoryData('monography_production_sections', _mResp.data.params, _cBody.params, req, "cm");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('monography_production_sections', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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



router.post("/insert-session-data", async (req, res) => {
    try {
        mongoMapper('monography_production_userSession', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*insert-contentTypes*/
router.post("/insert-contentType-data", async (req, res) => {
    try {
        mongoMapper('monography_production_contenttypes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
// get-contentTypes/

router.post("/get-contentType-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_production_contenttypes", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert-sectiontype*/
router.post("/insert-sectiontype-data", async (req, res) => {
    try {
        mongoMapper('monography_production_sectiontypes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*  get-sectiontype*/
router.post("/get-sectiontype-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_production_sectiontypes", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert-template*/
router.post("/insert-template-data", async (req, res) => {
    try {
        mongoMapper('monography_production_templates', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**get templates */
router.post("/get-template-data", async (req, res) => {
    try {
        if (req.body.params.content_type) {
            let _filter = {
                "filter": {
                    "content_type": req.body.params.content_type
                },
                "selectors": "-history"
            }

            //    let _pGData = await prepareGetPayload(_filter, req.body.params);
            //    if (!_pGData.success) {
            //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            //    }
            mongoMapper("monography_production_templates", "find", _filter, req.tokenData.dbType).then(async (result) => {

                // if (content_type === "650a9d0ad9a18e495d89d223" && req.body.params.id2) {
                //     let url = "https://emr.doctor9.com/napi_cmn/pharmacy/api/getMasterData"
                //     let resonseData = []
                //     let params = {
                //         "TYPE": "DRUG_INTERACTIONS",
                //         "FLAG": "A",
                //         "ID2": req.body.params.id2
                //     }
                //     await axios1.post(url, params).then((response) => { resonseData = response.data })
                //         .catch((err) => {
                //             console.log("err", err)
                //         })
                //     console.log("resonseData", resonseData)

                // }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})




module.exports = router;
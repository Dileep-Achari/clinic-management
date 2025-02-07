const router = require("express").Router();
const _ = require('lodash');
const moment = require('moment');

const axios1 = require("../../../services/axios")
const axios = require("axios");
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _token = require("../../../services/token");
const _mUtils = require("../../../constants/mongo-db/utils");
const fs = require("fs")
const path = require("path")
const countryDetails = require("./countryDetails.json")




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
        "orgId": 1067, "locId": 1088,
        "users": [
            { "userId": 1234, "userName": "emradmin", "pwd": "softhealth", "displayName": "EMR Admin" }
        ]
    },
    {
        "orgId": 2, "locId": 31,
        "users": [
            { "userId": 2345, "userName": "ssadmin", "pwd": "sunshine", "displayName": "Sunshine Admin" }
        ]
    }
];

/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "9000000ms");
};

/* Common Axios call */
function commonAxiosCall(type, url, params, config) {
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

/*Custom Sort By Date */
function custom_sort(a, b) {
    return new Date(a.CREATE_DT).getTime() - new Date(b.CREATE_DT).getTime();
};

/* Get Client Urls */
async function getClientUrls(_data) {
    let _org = await _.filter(_orgDetails, (o) => { return o.orgId === _data.orgId });
    return _org && _org.length > 0 ? _org[0] : _org;
};

/* Get Organization Details */
router.get("/get-org-details", async (req, res) => {
    try {
        if (req.headers && req.headers.orgkey) {
            let _orgDtls = _.filter(_orgDetails, (o) => { return o.orgKey == req.headers.orgkey });
            if (!(_orgDtls && _orgDtls.length > 0)) {
                return res.status(400).send({ success: false, status: 400, data: [], desc: "No Client found.." });
            }
            let _orgObj = { "orgId": _orgDtls[0].orgId, "createdDt": new Date().toISOString() };

            // let _tkn = await generateToken(_orgObj);
            //  res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true, domain: 'localhost', path: '/' });
            return res.status(200).json({ success: true, status: 200, desc: '', data: _orgObj });
        }
        else {
            return res.status(400).send({ success: false, status: 400, data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 400, desc: error.message || error });
    }
});

/**Auth User */
// router.post("/auth-user", async (req, res) => {
//     try {
//         if (req.body && req.body.params && req.body.params.orgId && req.body.params.uName && req.body.params.pwd) {
//             let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.params.orgId });
//             if (!(_orgDtls && _orgDtls.length > 0)) {
//                 return res.status(400).send({ success: false, status: 400, data: [], desc: "No Client found.." });
//             }
//             let _userDtls = _.filter(_orgDtls[0].users, (o) => { return o.userName == req.body.params.uName && o.pwd == req.body.params.pwd });
//             if (!(_userDtls && _userDtls.length > 0)) {
//                 return res.status(400).send({ success: false, status: 400, data: [], desc: "No User found.." });
//             }
//             let _user = {
//                 "orgId": _orgDtls[0].orgId, "locId": _orgDtls[0].locId, "createdDt": new Date(), "userId": _userDtls[0].userId, "userName": _userDtls[0].userName,
//                 "displayName": _userDtls[0].displayName
//             };
//             let _tkn = await generateToken(_user);
//             res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
//             _user['x-token'] = _tkn;
//             return res.status(200).json({ success: true, status: 200, desc: '', data: _user });
//         }
//         else {
//             return res.status(400).send({ success: false, status: 400, data: [], desc: "Invalid Parameters" });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 400, desc: error.message || error });
//     }
// });

// /* Verify Token Function */
// router.use(async function verifyToken(req, res, next) {
//     // if (!req.cookies || !req.cookies["x-token"]) {
//     //     return res.status(400).send({ status: 400,success:false, data: [], desc: "Missing Token ." });
//     // }
//     if (req.url === '/auth-user') {
//         next();
//     }
//     else {
//         if (!req.headers || !req.headers["x-token"]) {
//             return res.status(400).send({ success: false, status: 400, data: [], desc: "Missing Token.." });
//         }
//         try {
//             _token.verifyToken(req.headers["x-token"]).then(async (data) => {
//                 req.tokenData = data;
//                 req.clientUrls = await getClientUrls(data);
//                 next();
//             }).catch((error) => {
//                 if (error.name && error.name == 'TokenExpiredError') {
//                     return res.status(401).json({
//                         success: false,
//                         status: 401,
//                         data: [],
//                         desc: "Token was Expired. Please generate new Token."
//                     });
//                 }
//                 return res.status(401).json({
//                     success: false,
//                     status: 401,
//                     data: [],
//                     desc: "Authentication failed, Invalid token."
//                 });
//             });
//         } catch (err) {
//             return res.status(500).json({ success: false, status: 400, desc: err.message || err, data: [] });
//         }
//     }
// });

// /* Parameter Validation Midleware function */
// router.use(function paramValidation(req, res, next) {
//     try {
//         let _query = req.body.query || req.query.query || "";
//         if (!_query || _query == "") {
//             return res.status(400).json({ success: false, status: 400, desc: `Missing Required Parameters..`, data: [] });
//         }
//         let _index = _.findIndex(_queries, function (o) { return o.trim() == _query.trim(); });
//         if (_index == -1) {
//             return res.status(400).json({ success: false, status: 400, desc: `Provided '${_query}' Query Paramer is not supported..`, data: [] });
//         }
//         if (_query == 'findById') {
//             let _methods = ["body", "query"];
//             let _exists = false;
//             for (let _idx of _methods) {
//                 if (req.method == 'POST')
//                     _exists = req[_idx].params && req[_idx].params["_id"] != undefined && req[_idx].params["_id"] != '' ? true : false;
//                 else if (req.method == 'GET')
//                     _exists = req[_idx] && req[_idx]["_id"] != undefined && req[_idx]["_id"] != '' ? true : false;
//                 if (_exists) break;
//             }
//             if (!_exists) {
//                 return res.status(400).json({ success: false, status: 400, desc: `Invalid Paramers..`, data: [] });
//             }
//         }
//         else if (_query === 'insertMany') {
//             req.body.params["audit"] = {
//                 documentedBy: req.tokenData.userName,
//                 documentedById: req.tokenData.userId
//             }
//         }
//         else if (_query === 'updateOne') {
//            /* req.body.params["audit"] = {
//                 modifiedById: req.tokenData.userId,
//                 modifiedBy: req.tokenData.userName,
//                 modifiedDt: new Date().toISOString()
//             }
//             */
//         }
//         next();
//     }
//     catch (err) {
//         return res.status(500).json({ success: false, status: 400, desc: err, data: [] });
//     }
// });

/**Insert OrgLoaction */
router.post("/insert-organization", async (req, res) => {
    try {
        mongoMapper('insertOrgLoc', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/** get payload function */
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
};
/**histroy function */
async function insertHistoryData(_method, _mParams, req) {
    return new Promise(async (resolve, reject) => {
        try {
            let _mResp = await _mUtils.commonMonogoCall(`${_method}`, "insertMany", _mParams, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error: - ${_mResp.desc} ` });
            }
            resolve({ success: true, data: _mResp.data, desc: `` });
        }
        catch (err) {
            return { success: false, data: [], desc: `Error occured, Error: - ${err} ` }
        }
    });

};
/**Update OrgLoc */
router.post("/update-organization", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("insertOrgLoc", "findById", req.body.params._id, "REVNO", req.body)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            // _cBody.params.audit["_id"] = _mResp.data.params.audit._id;
            pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _hResp = await _mUtils.insertHistoryData('insertOrgLoc', _mResp.data.params, _cBody.params, req);
            if (!(_hResp && _hResp.success)) {

            }
            else {
                pLoadResp.payload.query.$push = {
                    "history": {
                        "revNo": _hResp.data[0].revNo,
                        "revTranId": _hResp.data[0]._id
                    }
                }
            }
            mongoMapper('insertOrgLoc', 'findOneAndUpdate', pLoadResp.payload).then(async (result) => {
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

//insert documents
// router.post("/insert-document", async (req, res) => {
//     try {
//         let _query = ''
//         let _finalData;
//         if (req.body.params._id) {
//             _query = "bulkWrite"
//             let _cBody = JSON.parse(JSON.stringify((req.body)));
//             let _mResp = await _mUtils.commonMonogoCall("formBuilder_doc_creation", "findById", req.body.params._id, "REVNO", req.body, "", "")
//             if (!(_mResp && _mResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//             }
//             delete _mResp.data.params._id
//             //  let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params, req);
//             let pLoadResp = { payload: {} };
//             // if (!(_hResp && _hResp.success)) {

//             // }
//             // else {
//             _cBody.params.revNo = _mResp.data.params.revNo;
//             pLoadResp = await _mUtils.preparePayload('BW', _cBody);
//             if (!pLoadResp.success) {
//                 return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//             }
//             _finalData = pLoadResp.payload
//             //   }
//             mongoMapper('formBuilder_doc_creation', _query, pLoadResp.payload, "").then(async (result) => {
//                 // if(_query =="insertMany"){
//                 //     let _historyData= await insertHistoryData('formBuilder_document_transaction_history',result.data,req)
//                 // }
//                 if (_cBody.params.isDataBase == true) {
//                     let params = {
//                         "MST_JSON": JSON.parse(JSON.stringify(_cBody.params))
//                     }
//                     let _dataBaseResponse = []
//                     let _sendDataToDB = await axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr", params).then((res, err) => {
//                         _dataBaseResponse = res.data
//                     }).catch((error) => {
//                         return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] });
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//             }).catch((error) => {
//                 return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//             });
//         } else {
//             _query = "insertMany"
//             _.each(req.body.params.data, (_o) => {
//                 _o.recStatus = true
//                 _o.audit = req.body.params.audit;
//             });

//             mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then(async (result) => {
//                 if (result.data.length > 0 && result.data[0].isDataBase == true) {
//                     let params = {
//                         "MST_JSON": JSON.parse(JSON.stringify(result.data[0]))
//                     }
//                     let _dataBaseResponse = []
//                     let _sendDataToDB = await axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr", params).then((res, err) => {
//                         _dataBaseResponse = res.data
//                     }).catch((error) => {
//                         return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] });
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//             }).catch((error) => {
//                 if (error.desc.code == 11000) {
//                     // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
//                     return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
//                 } else {
//                     return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
//                 }

//             });
//         }

//         // mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then((result) => {
//         //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         // }).catch((error) => {
//         //     if (error.desc.code == 11000) {
//         //         // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
//         //         return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
//         //     } else {
//         //         return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
//         //     }

//         // });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });

router.post("/insert-document", async (req, res) => {
    try {
        _.each(req.body.params.data, (_o) => {
            _o.recStatus = true
            _o.audit = req.body.params.audit;
        });
        mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params).then(async (result) => {
            if (result.data.length > 0 && result.data[0].isDataBase == true) {
                let params = {
                    "MST_JSON": JSON.parse(JSON.stringify(result.data[0]))
                }
                let _dataBaseResponse = []
                let _sendDataToDB = await axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr", params).then((res, err) => {
                    _dataBaseResponse = res.data
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] });
                })
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            if (error.desc.code == 11000) {
                return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
/**get-documents */
router.post("/get-documents", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_doc_creation", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
/**update document specific master */
router.post("/update-documents", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_doc_creation", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            _cBody.params.revNo = _mResp.data.params.revNo;
            pLoadResp = await _mUtils.preparePayload("BW", _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            // let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
            // pLoadResp.payload.query.$push = {};
            // _clonePayload.query.$set = {};
            // let _mResp1 = await _mUtils.commonMonogoCall("formBuilder_doc_creation", "findOneAndUpdate", _clonePayload, "", "", "")
            // if (!(_mResp1 && _mResp1.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _mResp1.desc || "", data: _mResp1.data || [] });
            // }
            mongoMapper('formBuilder_doc_creation', 'bulkWrite', pLoadResp.payload, "").then(async (result) => {
                if (_cBody.params.isDataBase == true) {
                    let params = {
                        "MST_JSON": JSON.parse(JSON.stringify(_cBody.params))
                    }
                    let _dataBaseResponse = []
                    let _sendDataToDB = await axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr", params).then((res, err) => {
                        _dataBaseResponse = res.data
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] });
                    })
                }
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



//insert documents specific master
// router.post("/insert-document_transaction-data", async (req, res) => {
//     try {
//         let _query = ''
//         let _finalData;
//         if (req.body.params._id) {
//             _query = "bulkWrite"
//             let _cBody = JSON.parse(JSON.stringify((req.body)));
//             let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
//             if (!(_mResp && _mResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//             }
//             delete _mResp.data.params._id
//             let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params, req);
//             let pLoadResp = { payload: {} };
//             if (!(_hResp && _hResp.success)) {

//             }
//             else {
//                 _cBody.params.revNo = _mResp.data.params.revNo;
//                 pLoadResp = await _mUtils.preparePayload('BW', _cBody);
//                 if (!pLoadResp.success) {
//                     return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//                 }
//                 _finalData = pLoadResp.payload
//             }
//         } else {
//             _query = "insertMany"
//             if (req.body.params.data.length > 0) {
//                 _.each(req.body.params.data, (_o) => {
//                     _o.recStatus = true,
//                         // _o['formCd']=req.body.params.formCd,
//                         // _o['formId']=req.body.params.formId,
//                         // _o['formName']=req.body.params.formName,
//                         _o.audit = req.body.params.audit;
//                 });
//             }

//             _finalData = req.body.params
//         }
//         mongoMapper('formBuilder_document_transaction_data', _query, _finalData, "").then(async (result) => {
//             if (_query == "insertMany") {
//                 let _historyData = await insertHistoryData('formBuilder_document_transaction_history', result.data, req)
//             }
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error })
//     }
// });
router.post("/insert-document_transaction-data", async (req, res) => {
    try {
        _.each(req.body.params.data, (_o) => {
            _o.recStatus = true
            _o.audit = req.body.params.audit;
        });
        mongoMapper('formBuilder_document_transaction_data', req.body.query, req.body.params).then(async (result) => {
            if (result.data.length > 0) {
                let _historyData = await insertHistoryData('formBuilder_document_transaction_history', result.data, req)
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
/**get document transaction data */
router.post("/get-document_transaction-data", async (req, res) => {
    try {
        if (req.body.params.flag == "GET") {
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history "
            }
            delete req.body.params.flag
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("formBuilder_document_transaction_data", req.body.query, _pGData.data, "").then((result) => {
                return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else if (req.body.params.flag == "SPECIFIC_GET") {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "treatmentId": req.body.params.treatmentId
                    // "content_type":req.body.params.content_type
                },
                "selectors": {
                    "_id": "$_id",
                    "formId": "$formId",
                    "orgId": "$orgId",
                    "revNo": "$revNo",
                    "locId": "$locId",
                    "lblId": "$lblId",
                    "formCd": "$formCd",
                    "formName": "$formName",
                    "treatmentId": "$treatmentId",
                    "umrNo": "$umrNo",
                    "treatmentType": "$treatmentType",
                    "visitStatus": "$visitStatus",
                    "data": {
                        $filter: {
                            input: "$data",
                            cond: {
                                $eq: ["$$this.lblId", `${req.body.params.lblId}`]
                            }
                        }
                    },
                    "audit": "$audit"
                }
            }
            mongoMapper("formBuilder_document_transaction_data", "find", _filter, "").then((result) => {
                if(result.data.length >0){
                    let convertdata = JSON.parse(JSON.stringify(result.data))
                    let _indx = 0;
                    let _finalData = []
                    _.each(convertdata,(_ob,_oi)=>{
                        if(_ob.data.length > 0){
                           _.each(_ob.data,(_ob1,_oi1)=>{
                               if(_ob1.value !=""){
                                   _ob1['formCd'] = _ob.formCd
                                   _ob1['formId'] = _ob.formId
                                   _ob1['formName'] = _ob.formName
                                   _finalData.push(_ob1)
                               }
                           })
                        }
                   })
                    // while (convertdata.length > _indx) {
                    //     if (convertdata[_indx].data.length > 0) {
                    //         _.each(convertdata[_indx].data, (_obj, _indx) => {
                    //             if (_obj.value != "") {
                    //                 _obj['formCd'] = convertdata[0].formCd
                    //                 _obj['formId'] = convertdata[0].formId
                    //                 _obj['formName'] = convertdata[0].formName
                    //                 _finalData.push(_obj)
                    //             }
                    //         })
                    //     }
                    //     _indx++;
                    // }
                    convertdata[0].data = _finalData
                    //JSON.parse(JSON.stringify(result.data[0])).data=_finalData
                    return res.status(200).json({ success: true, status: 200, desc: '', data: convertdata[0] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
/**update document specific master */
router.post("/update-document_transaction-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            _cBody.params.revNo = _mResp.data.params.revNo;
            delete _cBody.params.data
            pLoadResp = await _mUtils.preparePayload("U", _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            // delete req.body.params._id
            // let _hResp = await insertHistoryData('formBuilder_document_specific_history', _mResp.data.params, req);
            // if (!(_hResp && _hResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _hResp.desc || "", data: _hResp.data || [] });
            // }
            // let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
            // pLoadResp.payload.query.$push = {};
            // _clonePayload.query.$set = {};
            let _mResp1 = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findOneAndUpdate", pLoadResp.payload, "", "", "")
            if (!(_mResp1 && _mResp1.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp1.desc || "", data: _mResp1.data || [] });
            }

            let index = 0
            let _paramsData = {
                "params": {
                    "_id": _cBody.params._id
                }
            }

            _.each(req.body.params.data,(_obj,_indx)=>{
                _.each(_obj,(_v,_k)=>{
                    if(_v.constructor.name=="Array" && _v.length > 0){
                        _.each(_v,(_vObj,_vIndx)=>{
                            if(_vObj._id){
                              let __id = JSON.parse(JSON.stringify(_vObj._id));
                              delete _vObj._id
                              let keyValues = Object.entries(_vObj);
                              keyValues.splice(0, 0, ["_id", __id]);
                              let newObj = Object.fromEntries(keyValues)
                              console.log("dfudgfh",JSON.parse(JSON.stringify(newObj)))
                              _v[_vIndx]=JSON.parse(JSON.stringify(newObj))
                            }
                        })
                    }
                })
              })

            while (req.body.params.data.length > index) {
                _paramsData.params['data'] = []
                _paramsData.params.data.push(req.body.params.data[index])
                pLoadResp = { payload: {} }
                pLoadResp = await _mUtils.preparePayload("U", _paramsData);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
                pLoadResp.payload.query.$push = {};
                _clonePayload.query.$set = {};
                let _mResp2 = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findOneAndUpdate", _clonePayload, "", "", "")
                if (!(_mResp2 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp2.desc || "", data: _mResp2.data || [] });
                }
                let _mResp3 = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findOneAndUpdate", pLoadResp.payload, "", "", "")
                if (!(_mResp3 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp3.desc || "", data: _mResp3.data || [] });
                }
                // return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp2.data }); 
                index++;
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp1.data });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

// //insert documents specific master
// router.post("/insert-document-specific-master", async (req, res) => {
//     try {
//         let _query = ''
//         let _finalData;
//         let _cBody = JSON.parse(JSON.stringify((req.body)));
//         if (req.body.params._id) {
//             // _query = "bulkWrite"
//             _query = "findOneAndUpdate"
//             let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
//             if (!(_mResp && _mResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//             }
//             delete _mResp.data.params._id
//             //   let _hResp = await insertHistoryData('formBuilder_document_specific_history', _mResp.data.params, req);
//             let pLoadResp = { payload: {} };
//             //  if (!(_hResp && _hResp.success)) {

//             // }
//             // else {
//             _cBody.params.revNo = _mResp.data.params.revNo;
//             pLoadResp = await _mUtils.preparePayload('U', _cBody);
//             if (!pLoadResp.success) {
//                 return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//             }
//             _finalData = pLoadResp.payload
//             //  }
//         } else {
//             _query = "insertMany"
//             _.each(req.body.params.data, (_o) => {
//                 _o.recStatus = true
//                 _o.audit = req.body.params.audit;
//             });
//             // pLoadResp = await _mUtils.preparePayload('BW', _cBody);
//             // if (!pLoadResp.success) {
//             //     return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//             // }
//             _finalData = req.body.params
//         }
//         mongoMapper('formBuilder_document_specific_data', _query, _finalData, "").then(async (result) => {
//             // if (_query == "insertMany") {
//             //     let _historyData = await insertHistoryData('formBuilder_document_specific_history', result.data, req)
//             // }
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error })
//     }
// });

/** insert documents specific master*/
router.post("/insert-document-specific-master", async (req, res) => {
    try {
        _.each(req.body.params.data, (_o) => {
            _o.recStatus = true
            _o.audit = req.body.params.audit;
        });
        mongoMapper('formBuilder_document_specific_data', req.body.query, req.body.params).then(async (result) => {
            if (result.data.length > 0) {
                let _historyData = await insertHistoryData('formBuilder_document_specific_history', result.data, req)
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
/**get-documents documents specific master */
router.post("/get-documents-specific-master", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
                // "content_type":req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "formId": "$formId",
                "data": "$data",
                "formName": "$formName",
                "orgId": "$orgId",
                "locId": "$locId",
                "lblId": "$lblId",
                "formCd": "$formCd",
                "revNo": "$revNo",
                "recStatus": "$recStatus",
                "data": {
                    $filter: {
                        input: "$data",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "masterKeys":"$masterKeys",
                "bindings":"$bindings",
                "formSettings":"$formSettings",
                "audit": "$audit"
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_document_specific_data", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**update document specific master */
router.post("/update-document-specific-master", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            _cBody.params.revNo = _mResp.data.params.revNo;
            delete _cBody.params.data
            pLoadResp = await _mUtils.preparePayload("U", _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
             delete req.body.params._id
            let _hResp = await insertHistoryData('formBuilder_document_specific_history', _mResp.data.params, req);
            if (!(_hResp && _hResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _hResp.desc || "", data: _hResp.data || [] });
            }
            // let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
            // pLoadResp.payload.query.$push = {};
            // _clonePayload.query.$set = {};
            let _mResp1 = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findOneAndUpdate", pLoadResp.payload, "", "", "")
            if (!(_mResp1 && _mResp1.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp1.desc || "", data: _mResp1.data || [] });
            }

            let index = 0
            let _paramsData = {
                "params": {
                    "_id": _cBody.params._id
                }
            }


            _.each(req.body.params.data,(_obj,_indx)=>{
                _.each(_obj,(_v,_k)=>{
                    if(_v.constructor.name=="Array" && _v.length > 0){
                        _.each(_v,(_vObj,_vIndx)=>{
                            if(_vObj._id){
                              let __id = JSON.parse(JSON.stringify(_vObj._id));
                              delete _vObj._id
                              let keyValues = Object.entries(_vObj);
                              keyValues.splice(0, 0, ["_id", __id]);
                              let newObj = Object.fromEntries(keyValues)
                              console.log("dfudgfh",JSON.parse(JSON.stringify(newObj)))
                              _v[_vIndx]=JSON.parse(JSON.stringify(newObj))
                            }
                        })
                    }
                })
              })

            while (req.body.params.data.length > index) {
                _paramsData.params['data'] = []
                _paramsData.params.data.push(req.body.params.data[index])
                pLoadResp = { payload: {} }
                pLoadResp = await _mUtils.preparePayload("U", _paramsData);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
                pLoadResp.payload.query.$push = {};
                _clonePayload.query.$set = {};
                let _mResp2 = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findOneAndUpdate", _clonePayload, "", "", "")
                if (!(_mResp2 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp2.desc || "", data: _mResp2.data || [] });
                }
                let _mResp3 = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findOneAndUpdate", pLoadResp.payload, "", "", "")
                if (!(_mResp3 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp3.desc || "", data: _mResp3.data || [] });
                }
                // return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp2.data }); 
                index++;
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp1.data });
            // mongoMapper('formBuilder_document_specific_data', 'findOneAndUpdate', pLoadResp.payload, "").then(async (result) => {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            // }).catch((error) => {
            //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            // });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/** insert predefined-control-master*/
router.post("/insert-predefined-control-master", async (req, res) => {
    try {
        _.each(req.body.params.data, (_o) => {
            _o.recStatus = true
            _o.audit = req.body.params.audit;
        });
        mongoMapper('formBuilder_predefined_control_master', req.body.query, req.body.params).then(async (result) => {
            // if (result.data.length > 0) {
            //     let _historyData = await insertHistoryData('formBuilder_document_specific_history', result.data, req)
            // }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

// get predefined-control-master
router.post("/get-predefined-control-master", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
                // "content_type":req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "data": "$data",
                "orgId": "$orgId",
                "locId": "$locId",
                "formCd": "$formCd",
                "revNo": "$revNo",
                "recStatus": "$recStatus",
                "data": {
                    $filter: {
                        input: "$data",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "formSettings":"$formSettings",
                "audit": "$audit"
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_predefined_control_master", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

//update predefined-control-master 
router.post("/update-predefined-control-master", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_predefined_control_master", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            _cBody.params.revNo = _mResp.data.params.revNo;
            delete _cBody.params.data
            pLoadResp = await _mUtils.preparePayload("U", _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
           //  delete req.body.params._id
            // let _hResp = await insertHistoryData('formBuilder_predefined_control_master', _mResp.data.params, req);
            // if (!(_hResp && _hResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _hResp.desc || "", data: _hResp.data || [] });
            // }
            // let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
            // pLoadResp.payload.query.$push = {};
            // _clonePayload.query.$set = {};
            let _mResp1 = await _mUtils.commonMonogoCall("formBuilder_predefined_control_master", "findOneAndUpdate", pLoadResp.payload, "", "", "")
            if (!(_mResp1 && _mResp1.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp1.desc || "", data: _mResp1.data || [] });
            }

            let index = 0
            let _paramsData = {
                "params": {
                    "_id": _cBody.params._id
                }
            }


            _.each(req.body.params.data,(_obj,_indx)=>{
                _.each(_obj,(_v,_k)=>{
                    if(_v.constructor.name=="Array" && _v.length > 0){
                        _.each(_v,(_vObj,_vIndx)=>{
                            if(_vObj._id){
                              let __id = JSON.parse(JSON.stringify(_vObj._id));
                              delete _vObj._id
                              let keyValues = Object.entries(_vObj);
                              keyValues.splice(0, 0, ["_id", __id]);
                              let newObj = Object.fromEntries(keyValues)
                              console.log("dfudgfh",JSON.parse(JSON.stringify(newObj)))
                              _v[_vIndx]=JSON.parse(JSON.stringify(newObj))
                            }
                        })
                    }
                })
              })

            while (req.body.params.data.length > index) {
                _paramsData.params['data'] = []
                _paramsData.params.data.push(req.body.params.data[index])
                pLoadResp = { payload: {} }
                pLoadResp = await _mUtils.preparePayload("U", _paramsData);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _clonePayload = JSON.parse(JSON.stringify(pLoadResp.payload));
                pLoadResp.payload.query.$push = {};
                _clonePayload.query.$set = {};
                let _mResp2 = await _mUtils.commonMonogoCall("formBuilder_predefined_control_master", "findOneAndUpdate", _clonePayload, "", "", "")
                if (!(_mResp2 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp2.desc || "", data: _mResp2.data || [] });
                }
                let _mResp3 = await _mUtils.commonMonogoCall("formBuilder_predefined_control_master", "findOneAndUpdate", pLoadResp.payload, "", "", "")
                if (!(_mResp3 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp3.desc || "", data: _mResp3.data || [] });
                }
                // return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp2.data }); 
                index++;
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp1.data });
            // mongoMapper('formBuilder_document_specific_data', 'findOneAndUpdate', pLoadResp.payload, "").then(async (result) => {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            // }).catch((error) => {
            //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            // });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/testing", async (req, res) => {
    try {
        let data = [
            {
                "name": "kiran",
                "age": "20,30,40,40",
                "gender": "male,female",
                "phoneNo": "918898765"
            }
        ];
        let data1 = []
        _.each(data, (_obj, _indx) => {
            _.each(_obj.name.split(','), (_nameObj, _nameIndx) => {
                _.each(_obj.gender.split(","), (_genderObj, _genderIndx) => {
                    _.each(_obj.age.split(','), (_ageObj, _ageIndx) => {
                        data1.push(
                            {
                                name: _nameObj,
                                age: _ageObj,
                                gender: _genderObj,
                                phoneNo: _obj.phoneNo
                            }
                        )
                    })
                })
            })
        })
        return res.status(200).json({ success: false, status: 200, desc: "", data: data1 })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

// router.post("/insert-template", async (req, res) => {
//     try {
//         let _query = ''
//         let _finalData;
//         if (req.body.params._id) {
//             _query = "bulkWrite"
//             let _cBody = JSON.parse(JSON.stringify((req.body)));
//             let _mResp = await _mUtils.commonMonogoCall("formBuilder_template", "findById", req.body.params._id, "REVNO", req.body, "", "")
//             if (!(_mResp && _mResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//             }
//             delete _mResp.data.params._id
//             //  let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params, req);
//             let pLoadResp = { payload: {} };
//             // if (!(_hResp && _hResp.success)) {

//             // }
//             // else {
//             _cBody.params.revNo = _mResp.data.params.revNo;
//             pLoadResp = await _mUtils.preparePayload('BW', _cBody);
//             if (!pLoadResp.success) {
//                 return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//             }
//             _finalData = pLoadResp.payload
//             //   }
//             mongoMapper('formBuilder_template', _query, pLoadResp.payload, "").then(async (result) => {
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//             }).catch((error) => {
//                 return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//             });
//         } else {
//             _query = "insertMany"
//             mongoMapper('formBuilder_template', req.body.query, req.body.params, "").then((result) => {
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//             }).catch((error) => {
//                 return res.status(400).json({ success: false, status: 400, desc: error.desc, data: [] })
//             });
//         }

//         // mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then((result) => {
//         //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         // }).catch((error) => {
//         //     if (error.desc.code == 11000) {
//         //         // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
//         //         return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
//         //     } else {
//         //         return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
//         //     }

//         // });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });

router.post("/insert-template", async (req, res) => {
    try {
        mongoMapper('formBuilder_template', req.body.query, req.body.params).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
/**update document specific master */
router.post("/update-template", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_template", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let pLoadResp = { payload: {} };
            _cBody.params.revNo = _mResp.data.params.revNo;
            pLoadResp = await _mUtils.preparePayload("BW", _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            mongoMapper('formBuilder_template', 'bulkWrite', pLoadResp.payload, "").then(async (result) => {
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

router.post("/get-template", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_template", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/get-transactionData", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "formCd": req.body.params.formCd
                // "content_type":req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "formId": "$formId",
                "orgId": "$orgId",
                "revNo": "$revNo",
                "locId": "$locId",
                "formCd": "$formCd",
                "formName": "$formName",
                "treatmentId": "$treatmentId",
                "umrNo": "$umrNo",
                "treatmentType": "$treatmentType",
                "visitStatus": "$visitStatus",
                "visitId": "$visitId",
                "data": {
                    $filter: {
                        input: "$data",
                        cond: {
                            $eq: ["$$this.lblId", `${req.body.params.lblId}`]
                        }
                    }
                },
                "audit": "$audit"
            }
        }
        mongoMapper("formBuilder_document_transaction_data", "find", _filter, "").then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


module.exports = router;
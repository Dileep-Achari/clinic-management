const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const __ = require('underscore');
const axios = require("axios");
const { transform } = require('node-json-transform');
const imageThumbnail = require('image-thumbnail');
const moment = require('moment');
const CryptoJS = require("crypto-js");
const fse = require('fs-extra');

const _transformapi = require('../patientcare/transformation');
const _token = require("../../../services/token");
const _util = require("../../../utilities/is-valid");
const _mUtils = require("../../../constants/mongo-db/utils");

const _orgDetails = require("../patientcare/constants/organizations");

const _secretKey = 'S0ftHe@lth$123SUv@$n@Tech8%#!(%';

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
            { "userId": 1234, "userName": "emradmin", "pwd": "softhealth", "displayName": "EMR Admin", "roleId": 1, "roleName": "admin" }
        ]
    },
    {
        "orgId": 1002, "locId": 1047,
        "users": [
            { "userId": 1234, "userName": "emradmin", "pwd": "softhealth", "displayName": "EMR Admin", "roleId": 1, "roleName": "admin" },
            { "userId": 1235, "userName": "mobileuser", "pwd": "softhealth", "displayName": "EMR Admin", "roleId": 1, "roleName": "admin" },
            { "userId": 1236, "userName": "emradmin1", "pwd": "softhealth", "displayName": "EMR Admin", "roleId": 1, "roleName": "admin" },
            { "userId": 1237, "userName": "emradmin2", "pwd": "softhealth", "displayName": "EMR Admin", "roleId": 1, "roleName": "admin" }
        ]
    },
    {
        "orgId": 2, "locId": 31,
        "users": [
            { "userId": 2345, "userName": "ssadmin", "pwd": "sunshine", "displayName": "Sunshine Admin", "roleId": 1, "roleName": "admin" }
        ]
    }
];

/* Transformation */
function fetchTransformColumns_deprecated(_methodName) {
    let _transFomnColumnsArr = _transformapi;

    for (var i in _transFomnColumnsArr) {
        if (_transFomnColumnsArr[i].methodName === _methodName) {
            _columnsArr = _transFomnColumnsArr[i].columnData;
        }
    }
    var baseMap = {
        item: _columnsArr[0]
    }
    return baseMap;
};


function fetchTransformColumns(_methodName, _flag) {
    let _transFomnColumnsArr = _transformapi;
    let _columnsArr = [];
    let dateColumsArr = [];
    let _initCapArr = [];
    let _postWebColumns = [];
    let _epochColumns = [];
    let _values = [];
    let _stringFormate = [];
    let _stringnull = [];
    for (var i in _transFomnColumnsArr) {
        if (_transFomnColumnsArr[i].methodName === _methodName) {
            if (_flag && _flag != 'ALL') {
                for (var j in _transFomnColumnsArr[i].columnData) {
                    if (
                        _transFomnColumnsArr[i].columnData[j].flag === _flag) {
                        _columnsArr = _transFomnColumnsArr[i].columnData[j].childColumns;
                        dateColumsArr = _transFomnColumnsArr[i].columnData[j].dateColums;
                        _stringFormate = _transFomnColumnsArr[i].columnData[j].stringArr;
                        _stringnull = _transFomnColumnsArr[i].columnData[j].stringnull;
                        _postWebColumns = _transFomnColumnsArr[i].columnData[j].postColumns;
                        break;
                    }
                }
            }
            else {
                _columnsArr = _transFomnColumnsArr[i].columnData;
            }
        }
    }

    let _dateFormate = 'DD-MMM-YYYY';
    let _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';
    let _operateStringArr = [];
    for (var k in dateColumsArr) {
        _operateStringArr.push({
            run: function (input) {
                if (input) {
                    input = input.toString();
                    if (input.includes('T') && !input.includes('T00:00:00')) {
                        return moment(new Date(input)).format(_dateTimeFormate)
                    }
                    else
                        return moment(new Date(input)).format(_dateFormate)
                }
                else return "";
            },
            on: dateColumsArr[k]
        });
    }
    /*this is used to formate string to int*/

    for (var k in _stringFormate) {
        _operateStringArr.push({
            run: function (input) {
                if (input) {
                    return parseInt(input)
                }
                else return "" || null;
            },
            on: _stringFormate[k]
        });

    }

    //if there is null pass empty
    for (var k in _stringnull) {
        _operateStringArr.push({
            run: function (input) {
                if (input === null) {
                    return "";
                }
                else {
                    return input;
                }
            },
            on: _stringnull[k]
        });
    }
    /*method is used to convert epoc formate to normal dates*/

    for (var k in _postWebColumns) {
        _operateStringArr.push({
            run: function (input) {
                if (input) {
                    if (input.indexOf(')/') > -1) {
                        input = input.substring(input.indexOf(')/'), input.length - 15)
                        return moment(new Date(parseInt(input))).format('DD-MMM-YYYY, HH:mm')
                    }
                }
            },
            on: _postWebColumns[k]
        });
    }
    var baseMap = {
        item: _columnsArr[0],
        operate: _operateStringArr
    }
    return baseMap;
}

/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "900000ms");
};

/* Base64 Compress */
async function compressDocument(_base64, _name) {
    try {
        return new Promise(async (resolve, reject) => {
            let options = { percentage: 25 }
            // console.log("_base64",_base64);
            let _sData = _base64.split(',')[1];
            const thumbnail = await imageThumbnail(_sData, options);
            resolve({ success: true, data: thumbnail, name: _name })
        });
    } catch (err) {
        return { success: false, data: "", name: _name }
    }
};

/* Convert Base64 from buffer */
async function convertBase64ToBuffer(_data) {
    return new Promise((resolve, reject) => {
        try {
            let _docs = [];
            _.each(_data.document, async (_doc) => {
                let _cnvertedBase64 = await _doc.docData.toString("base64");
                let _mimeTypeChkData = _cnvertedBase64.includes('dataapplication/pdfbase64') ? _cnvertedBase64.split('dataapplication/pdfbase64')[1] : _cnvertedBase64;
                let _base64 = `${_doc.docMimeType},${_mimeTypeChkData}`;
                let _resp = {
                    umr: _data.umr,
                    admnNo: _doc.admNo,
                    admnDt: _doc.admnDt,
                    docId: _doc.docId,
                    docName: _doc.docName,
                    docType: _doc.docType,
                    format: _doc.format,
                    remarks: _doc.remarks,
                    documentedBy: _doc.documentedBy,
                    documentedId: _doc.documentedId,
                    documentedDt: _doc.documentedDt,
                    docDataBase64: _base64,
                    isImage: _doc.isImage,
                    path: _doc.path,
                    surgId: _doc.surgId,
                    surgName: _doc.surgName,
                    surgDt: _doc.surgDt,
                    followupId: _doc.followupId || "",
                    followupNo: _doc.followupNo || "",
                    followupOn: _doc.followupOn || "",
                    followupDate: _doc.followupDate || "",
                };
                _docs.push(_resp);
            });
            resolve({ success: true, data: _docs });
        }
        catch (err) {
            resolve({ success: false, data: [] });
        }
    });
};

/*Write File */
async function writeFile(_base64) {
    return new Promise((resolve, reject) => {
        require("fs").writeFile("somesh.jpeg", _base64, 'base64', (err) => {
            if (err) {
                console.log(err);
                reject(err)

            } else {
                resolve(true)
            }

        });
    })
};

/* Get Client Urls */
async function getClientUrls(_data) {
    let _org = await _.filter(_orgDetails, (o) => { return o.orgId === _data.orgId });
    return _org && _org.length > 0 ? _org[0] : _org;
};

// Append audit for childs
function childAuditAppend(_data, _by) {
    _.each(_data[`${_by}`], (_l) => {
        _l.audit = _data.audit;
    });
    return _data;
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

/* Map Discharge summary  */
function generateDischargeSumReport(_data, lblMapArr) {
    try {
        _.map(_data, (_dta) => {
            _dta.REMARKS1 = JSON.parse(JSON.stringify(_dta.REMARKS));
            if (_dta.LABLE_ID != 133) {
                _dta.REMARKS = _dta.REMARKS ? _dta.REMARKS.replace(/<b>/gmi, '') : '';
                _dta.REMARKS = _dta.REMARKS ? _dta.REMARKS.replace(/<\/b>/gmi, '') : '';
            }
        });
        let Gdata = _.groupBy(_data, function (item) { return item.IP_VISIT_ID });
        let source = _.map(Gdata, function (value, key) {
            let _childs = []
            _.each(value, (_val) => {
                let _obj = {};
                _obj["LABLE_ID"] = _val["LABLE_ID"];
                _obj["LABLE_NAME"] = _val["LABLE_NAME"];
                _obj["REMARKS"] = _val["REMARKS"];
                _obj["REMARKS1"] = _val["REMARKS1"];
                _childs.push(_obj);
            })
            return {
                UMR_NO: value[0].UMR_NO, ADMN_NO: value[0].ADMN_NO, ADMN_DT: value[0].ADMN_DT, PRIMARY_DOCTOR: value[0].PRIMARY_DOCTOR, REC_CREATE_BY: value[0].REC_CREATE_BY, DATE_TIME: value[0].CREATE_DT, CREATE_BY: value[0].CREATE_BY, CREATE_DT: value[0].CREATE_DT, APPROVED_BY: value[0].APPROVED_BY,
                APPROVED_DT: value[0].APPROVED_DT, FORM_TYPE_CD: value[0].FORM_TYPE_CD, VISIT_STATUS_CD: value[0].VISIT_STATUS_CD, child: _childs,
                IP_VISIT_ID: value[0].IP_VISIT_ID, DSCHRG_TYPE: value[0].DSCHRG_TYPE, VISIT_COMPLETE: value[0].VISIT_COMPLETE, DEGREES_FMT: value[0].DEGREES_FMT, VISIT_DT: value[0].VISIT_DT,
                DESIGNATION: value[0].DESIGNATION, SPECIALITY_NAME: value[0].SPECIALITY_NAME, DOCREGNO: value[0].DOCREGNO, MODIFY_BY: value[0].MODIFY_BY, MODIFY_DT: value[0].MODIFY_DT, IMGSIGN: value[0].IMGSIGN, PRIMARY_IMGSIGN: value[0].PRIMARY_IMGSIGN,
                PRIMARY_DOC: value[0].PRIMARY_DOC, PRIMARY_DOCREGNO: value[0].PRIMARY_DOCREGNO, PRIMARY_DEG_FRMT: value[0].PRIMARY_DEG_FRMT, PRIMARY_DESIGN: value[0].PRIMARY_DESIGN, PRIMARY_SPECLTY: value[0].PRIMARY_SPECLTY,
                PAT_DSCHRG_DT: value[0].PAT_DSCHRG_DT, DSCHRG_DT: value[0].DSCHRG_DT, REVIEW_DT: value[0].REVIEW_DT, gDate: new Date(value[0].CREATE_DT).setHours(0, 0, 0, 0), doneBy: value[0].CREATE_BY,
                IS_REWORK: value[0].IS_REWORK, REWORK_DT: value[0].REWORK_DT, REWORK_USER: value[0].REWORK_USER

            }
        });
        source.sort(function (a, b) {
            return new Date(b.DATE_TIME) - new Date(a.DATE_TIME);
        });
        return { success: true, data: source };
    }
    catch (err) {
        return { success: true, data: [], desc: err.message || err };
    }
};

/*Custom Sort By Date */
function custom_sort(a, b) {
    return new Date(a.CREATE_DT).getTime() - new Date(b.CREATE_DT).getTime();
};

/**Dignosis transformation */
function columnsTrnsformation(_dataArr, _flag) {
    let resultArr = []; let isExists = false; let _groupArr = [];
    let _data = _dataArr.sort(custom_sort);
    _groupArr = _.groupBy(_data, "CREATE_DT");
    _.each(_groupArr, function (i, j) {
        var obj = {};
        obj['visit'] = i[0]['VISIT_ID'] != '0' ? 'IP' : 'OP' || "";
        obj['admnNo'] = i[0]['ADMN_NO'] || "";
        obj['formatedVisitDateTime'] = i[0]['FORMATED_VISIT_DT'];
        obj['createdBy'] = i[0]['CREATE_BY'];
        obj['createdDate'] = i[0]['CREATE_DT'];
        obj['formatedCreatedDate'] = i[0]['FORMATED_CREATE_DT'];
        obj['documentedBy'] = (i[0]['REC_CREATE_BY'] || i[0]['CREATE_BY']);
        obj['formatedDocumentedDate'] = i[0]['FORMATED_CREATE_DT'];
        obj['data'] = [];
        var _diagnosisType = _.groupBy(i, "DIAGNOSIS_TYPE");
        if (!isExists) {
            M: for (let k in _diagnosisType["P"]) {
                let childObj = {};
                let _frmObj = _diagnosisType["P"][k];
                if (_frmObj['DIAGNOSIS_TYPE'] === "P") {
                    if (_frmObj['DIAGNOSIS'][_frmObj['DIAGNOSIS'].length - 1] === "^") {
                        _frmObj['DIAGNOSIS'] = _frmObj['DIAGNOSIS'].slice(0, -1)
                    }
                    childObj = {
                        "label": "Provisional Diagnosis",
                        "value": (_frmObj['DIAGNOSIS']) ? _frmObj['DIAGNOSIS'].toString() : "",
                        "colWidth": 1
                    }
                    if (_frmObj['DIAGNOSIS'] && _frmObj['DIAGNOSIS'].length > 0)
                        obj['data'].push(childObj);
                    if (obj && obj.data.length > 0) {
                        resultArr.push(obj);
                        isExists = true;
                        break M;
                    }
                }
            }
        }
        if (_diagnosisType["D"]) {
            _.each(i, function (k, l) {
                let childObj = {};
                if (k['DIAGNOSIS_TYPE'] === "D") {
                    if (k['DIAGNOSIS'][k['DIAGNOSIS'].length - 1] === "^") {
                        k['DIAGNOSIS'] = k['DIAGNOSIS'].slice(0, -1)
                    }
                    childObj = {
                        "label": "Diagnosis",
                        "value": (k['DIAGNOSIS']) ? k['DIAGNOSIS'].toString() : "",
                        "colWidth": 1
                    }
                }
                if (k['DIAGNOSIS'] && k['DIAGNOSIS'].length > 0 && Object.keys(childObj).length > 0) {
                    obj['data'].push(childObj);
                }

            });
            if (obj && obj.data.length > 0) {
                resultArr.push(obj);
            }
        }
    });
    return resultArr;
};


/* JSON validation */
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};

/* Prepare Payload for Get calls */
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

/* Get Organization Details */
router.post("/validate-doc-access", async (req, res) => {
    try {
        if (req.body && req.body.params.orgId && req.body.params.userId && req.body.params.routeUrl) {
            let _access = req.tokenData.docAccess.includes(req.body.params.routeUrl)
            if (!_access) {
                return res.status(400).json({ success: false, status: 400, desc: "", data: [{ "access": _access }] });
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: [{ "access": _access }] });
        }
        else {
            return res.status(400).send({ success: false, status: 400, desc: "Required Missing Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});



router.all('/*', (req, res, next) => {
    try {
        if (req.body && req.body.encryptedData) {
            let decrypted = CryptoJS.AES.decrypt(req.body.encryptedData, _secretKey);
            decrypted = decrypted.toString(CryptoJS.enc.Utf8);
            if (decrypted) {
                if (isJSON(decrypted)) {
                    req.body = JSON.parse(decrypted);
                }
                else {
                    req.body = decrypted;
                }
            }
            else {
                return res.status(498).send({ "ERROR": "Invalid key", "MESSAGE": "Invalid Key.." });
                // req.body = req.body.encryptedData;
            }
        }
        next();
    } catch (ex) {
        return res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});
/* Validate Users */
router.post("/validate-user", async (req, res) => {
    try {
        if (req.body.params && req.body.params.userName && req.body.params.userName.length > 0) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "userName": req.body.params.userName.trim()
                },
                "selectors": "-history"
            }
            mongoMapper("patient_care_users", "find", _filter).then((result) => {
                if (result.data.length > 0 && !req.body.params.flag) {
                    return res.status(200).json({ success: false, status: 200, desc: `${req.body.params.userName} user is already exist`, data: [] });
                }
                else if (result.data.length > 0 && req.body.params.flag == 'L') {
                    return res.status(200).json({ success: false, status: 200, desc: ``, data: result.data[0] || {} });
                }
                else {
                    return res.status(200).json({ success: true, status: 200, desc: 'user not exist', data: [] });
                }

            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Missing Required Parameters ..", data: [] });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


/**Auth User */
router.post("/auth-user", async (req, res) => {
    try {
        if (req.body && req.body.orgId && req.body.uName && req.body.pwd) {

            let _uParams = {
                "filter": {
                    'userName': req.body.uName, 'password': req.body.pwd, "orgId": req.body.orgId,
                    "recStatus": { $eq: true }
                },
                "selectors": ""
            }
            let _userData = await commonMonogoCall("patient_care_users", "findOne", _uParams, "", req.body);
            if (!(_userData && _userData.success && _userData.data && Object.keys(_userData.data).length > 0)) {
                return res.status(400).json({ status: 'FAIL', code: 400, desc: "Invalid crendentials / No user found..", data: [] });
            }
            let _clnUser = JSON.parse(JSON.stringify(_userData.data));
            // let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
            // if (!(_orgDtls && _orgDtls.length > 0)) {
            //     return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            // }
            // let _userDtls = _.filter(_orgDtls[0].users, (o) => { return o.userName == req.body.uName && o.pwd == req.body.pwd });
            // if (!(_userDtls && _userDtls.length > 0)) {
            //     return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
            // }
            if (req.body.forceLogout && req.body.sessionId) {
                let _tknObj = {
                    params: {
                        _id: req.body.sessionId,
                        token: "",
                        logOutTime: new Date().toISOString(),
                        recStatus: false
                    }
                }
                _tknObj.params["audit.modifiedBy"] = _clnUser.dispName;
                _tknObj.params["audit.modifiedById"] = _clnUser._id;
                _tknObj.params["audit.modifiedDt"] = new Date().toISOString();
                let pLoadResp = { payload: {} };
                pLoadResp = await preparePayload('U', _tknObj);
                let _sessionUpdate = await commonMonogoCall("patient_care_usersessions", "findOneAndUpdate", pLoadResp.payload, "", "");
                if (!(_sessionUpdate && _sessionUpdate.success && _sessionUpdate.data && Object.keys(_sessionUpdate.data).length > 0)) {
                    return res.status(401).json({ status: 'FAIL', desc: "The user session de-activation is failed..", data: [] });
                }
            }
            //else {
            let _filter = {
                "filter": {
                    'userName': req.body.uName, "orgId": req.body.orgId,
                    "recStatus": { $eq: true }
                },
                "selectors": ""
            }
            let _sessionData = await commonMonogoCall("patient_care_usersessions", "findOne", _filter, "", req.body);
            if ((_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data.token && _sessionData.data.token.length > 0)) {
                return res.status(403).json({ status: 'FAIL', code: 403, desc: "This user is currently logged in on another device..", data: _sessionData.data || [] });
            }
            // }
            let _locDtls = _.filter(_userData.data.locations, (o) => { return o.locId == req.body.locId });
            if (!(_locDtls && _locDtls.length > 0)) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "Provided Location was not mapped.." });
            }
            let _user = {
                "orgId": _clnUser.orgId, "locId": _locDtls[0].locId, "userId": _clnUser._id, "userName": _clnUser.userName,
                "displayName": _clnUser.dispName, "roleId": _locDtls[0].roleId, "roleName": _locDtls[0].roleName
            };
            let _tkn = await generateToken(_user);
            res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
            _user['x-token'] = _tkn;
            let _userAgent = req.headers['user-agent'];
            if (_userAgent.includes('Mobile')) {
                req.isMobile = true;
            } else {
                req.isMobile = false;
            }
            let _sessionParams = {
                orgId: _clnUser.orgId,
                locId: _user.locId,
                userId: _clnUser._id,
                userName: _clnUser.userName,
                displayName: _clnUser.dispName,
                roleId: _user.roleId,
                roleName: _user.roleName,
                browser: _userAgent,
                token: _tkn,
                machine: req.isMobile ? 'Mobile' : 'Web'
            };
            // console.log("_sessionParams", _sessionParams);
            mongoMapper('patient_care_usersessions', 'insertMany', _sessionParams).then(async (result) => {
                // return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
                //console.log("result", result);
                if (!(result.status == 'SUCCESS' && result.data && result.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "Login failed / Failed to generate session", data: [] });
                }
                _user['sessionId'] = result.data[0]._id;
                let _tkn = await generateToken(_user);
                _user['x-token'] = _tkn;
                res.setHeader('sessionId', result.data[0]._id);
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: _user });
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Verify Token Function */
router.use(async function verifyToken(req, res, next) {
    // if (!req.cookies || !req.cookies["x-token"]) {
    //     return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    // }
    // if (!req.headers || !req.headers["x-token"]) {
    //     return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    // }
    try {
        const userAgent = req.headers['user-agent'];
        if (userAgent.includes('Mobile')) {
            req.isMobile = true;
        } else {
            req.isMobile = false;
        }
        // let _filter = {
        //     "filter": {
        //         'userId': req.headers['userid'], "orgId": req.headers['orgid'],
        //         "recStatus": { $eq: true }
        //     },
        //     "selectors": ""
        // }
        let _filter = {
            "filter": {
                '_id': req.headers['sessionid'],
                "recStatus": { $eq: true }
            },
            "selectors": ""
        }

        let _sessionData = await commonMonogoCall("patient_care_usersessions", "findOne", _filter, "", req.body);
        if (!(_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data.token && _sessionData.data.token.length > 0)) {
            return res.status(401).json({ status: 'FAIL', desc: "Missing Token..", data: [] });
        }
        _token.verifyToken(_sessionData.data.token).then(async (data) => {
            req.tokenData = data;
            req.clientUrls = await getClientUrls(data);
            delete data.iat;
            delete data.exp;
            let _tkn = await generateToken(data);
            let _tknObj = {
                params: {
                    _id: _sessionData.data._id,
                    token: _tkn,
                }
            }
            _tknObj.params["audit.modifiedBy"] = req.tokenData.displayName;
            _tknObj.params["audit.modifiedById"] = req.tokenData.userId;
            _tknObj.params["audit.modifiedDt"] = new Date().toISOString();
            let pLoadResp = { payload: {} };
            pLoadResp = await preparePayload('U', _tknObj);
            if (!pLoadResp.success) {
                return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
            }
            let _sessionUpdate = await commonMonogoCall("patient_care_usersessions", "findOneAndUpdate", pLoadResp.payload, "", "")
            if (!(_sessionUpdate && _sessionUpdate.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _sessionUpdate.desc || "Failed to update token", data: [] });
            }
            req.dbName = 'patient_care';
            // res.setHeader('sessionId', result.data[0]._id);
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

/* Prepare Payload function */
function preparePayload(_type, _body) {
    try {
        return new Promise((resolve, reject) => {
            let _params = {};
            let _payload = {
                by: {},
                query: { $set: {}, $push: {} },
                mode: { upsert: true, new: true }
            }
            _payload.by = { "_id": _body.params._id };
            // console.log("_payload.by ", _payload.by)

            if (_type === "U") {
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && !_val._id || _val._id == '') {
                            delete _val._id;
                            _payload.query.$push[`${_key}`] = _val;
                        }
                        else if (_val.constructor.name === 'Array') {
                            //   delete _val1._id;
                            let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                            if (_rest && _rest.length > 0) {
                                _.each(_rest, (item) => { delete item._id })
                                _payload.query.$push[`${_key}`] = _rest;
                            }
                        }


                        _.each(_val, (_val1, _key1) => {
                            /*    if (_val.constructor.name === 'Array' && !_val1._id || _val1._id == '') {
                                    delete _val1._id;
                                    _payload.query.$push[`${_key}`] = _val1;
                                }
                                else {
                                    */
                            if (_val.constructor.name === 'Object') {
                                _params[`${_key}.${_key1}`] = _val1;
                            }
                            else if (_val.constructor.name === 'Array') {
                                _.each(_val1, (_val2, _key2) => {
                                    if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
                                        _.each(_val2, (_val3, _key3) => {
                                            if (_val3.constructor.name === 'Object') {
                                                _.each(_val3, (_val4, _key4) => {
                                                    if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                        _.each(_val4, (_val5, _key5) => {
                                                            if (_val5.constructor.name === 'Object') {
                                                                _.each(_val5, (_val6, _key6) => {
                                                                    if (_key6 == "_id" && _val6 != '') {
                                                                        _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                    }
                                                                    else {
                                                                        _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        if (_key4 == "_id" && _val4 != '') {
                                                            _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                        }
                                                        else {
                                                            _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val4;
                                                        }
                                                    }
                                                })
                                            }
                                            else {
                                                _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
                                            }
                                        })
                                    }
                                    else {
                                        if (_key2 == "_id" && _val2 != '') {
                                            _payload.by[`${_key}._id`] = _val2;
                                        }
                                        else {
                                            _params[`${_key}.$.${_key2}`] = _val2;
                                        }
                                    }
                                });
                            }
                            // }
                        })
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                _payload.query.$set = _params;
            }
            else if (_type === 'IAU') {
                _.each(_body.params, (_value, _keys) => {
                    if (_value.constructor.name === 'Object' || _value.constructor.name === 'Array') {
                        if (_value.constructor.name === 'Array') {
                            _.each(_value, (_value1, _keys1) => {
                                if (_value1.constructor.name === 'Object') {
                                    _.each(_value1, (_value2, _keys2) => {
                                        if (_value2.constructor.name === 'Object' || _value2.constructor.name === 'Array') {
                                            if (_value2.constructor.name === 'Array') {
                                                _.each(_value2, (_value3, _keys3) => {
                                                    if (_value3.constructor.name === 'Object' || _value3.constructor.name === 'Array') {
                                                        //if (_value3.constructor.name === 'Array') {
                                                        _.each(_value3, (_value4, _keys4) => {
                                                            if (_keys4 === '_id') {
                                                                _payload.by[`${_keys}.${_keys2}.${_keys4}`] = _value4;
                                                                delete _keys4;
                                                            }
                                                            else {
                                                                _params[`${_keys}.$.${_keys2}.$[].${_keys4}`] = _value4;
                                                            }
                                                        });
                                                        //  }
                                                        //  else {
                                                        //      _params[`${_keys}.$.${_keys2}.$.${_keys3}`] = _value2;
                                                        //  }
                                                    }
                                                    else {
                                                        if (_keys3 === '_id') {
                                                            _payload.by[`${_keys}.${_keys2}._id`] = _value3;
                                                            delete _keys2;
                                                        }
                                                        //_params[`${_keys}.$.${_keys2}.${_keys3}`] = _value3;
                                                    }
                                                });
                                            }
                                            else {
                                                _params[`${_keys}.$.${_keys2}`] = _value2;
                                            }
                                        }
                                        else {
                                            if (_keys2 === '_id') {
                                                _payload.by[`${_keys}._id`] = _value2;
                                                delete _keys2;
                                            }
                                        }
                                    });
                                }
                                else {

                                }
                            });
                        }
                        else {
                            _params[`${_keys}`] = _value;
                        }
                    }
                });
                _payload.query.$push = _params;
            }
            else if (_type === 'AE') {
                delete _body.params._id;
                _payload.query.$push = _body.params;
            }
            else if (_type === 'BW') {
                let _bwObj = {
                    "updateOne": {
                        "filter": { "_id": _body.params._id },
                        "update": {
                            "$set": {},
                            "$push": {}

                        },
                        upsert: true, new: true
                    }
                };
                let _bwData = [];
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && !_val._id || _val._id == '') {
                            delete _val._id;
                            _payload.query.$push[`${_key}`] = _val;
                        }
                        else if (_val.constructor.name === 'Array') {
                            //   delete _val1._id;
                            let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                            if (_rest && _rest.length > 0) {
                                _.each(_rest, (item) => { delete item._id })
                                _payload.query.$push[`${_key}`] = _rest;
                            }
                            let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            if (_elm && _elm.length > 0) {
                                _.each(_elm, (_ev, _ek) => {
                                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                                    _.each(_ev, (_ev1, _ek1) => {
                                        if (_ek1 === '_id') {
                                            _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
                                        }
                                        else {
                                            if (_ev1.constructor.name === 'Array') {
                                                _.each(_ev1, (_ev2, _ek2) => {
                                                    let _cloneBw1 = JSON.parse(JSON.stringify(_bwObj));
                                                    _.each(_ev2, (_ev3, _ek3) => {
                                                        if (_ek3 === '_id') {
                                                            _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                            _cloneBw1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev3;
                                                        }
                                                        else {
                                                            if (_ev3.constructor.name === 'Object') {
                                                                _.each(_ev3, (_ev4, _ek4) => {
                                                                    _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.${_ek4}`] = _ev4;
                                                                });
                                                            }
                                                            else {
                                                                _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}`] = _ev3;
                                                            }
                                                        }
                                                    });
                                                    if (Object.keys(_cloneBw1.updateOne.update.$set).length > 0) {
                                                        _bwData.push(_cloneBw1);
                                                    }
                                                });

                                            }
                                            else {
                                                _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
                                            }
                                        }
                                    });
                                    if (Object.keys(_cloneBw.updateOne.update.$set).length > 0 || Object.keys(_cloneBw.updateOne.update.$push).length > 0) {
                                        _bwData.push(_cloneBw);
                                    }
                                });
                            }
                        }
                        if (_val.constructor.name !== 'Array') {
                            // let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            // if (_elm && _elm.length > 0) {
                            //     _.each(_elm, (_ev, _ek) => {
                            //         let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                            //         _.each(_ev, (_ev1, _ek1) => {
                            //             if (_ek1 === '_id') {
                            //                 _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
                            //             }
                            //             else {
                            //                 _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
                            //             }
                            //         });
                            //         _bwData.push(_cloneBw);

                            //     });
                            // }
                            // else {
                            _.each(_val, (_val1, _key1) => {
                                if (_val.constructor.name === 'Object') {
                                    _params[`${_key}.${_key1}`] = _val1;
                                }
                                else if (_val.constructor.name === 'Array') {
                                    _.each(_val1, (_val2, _key2) => {
                                        if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
                                            _.each(_val2, (_val3, _key3) => {
                                                if (_val3.constructor.name === 'Object') {
                                                    _.each(_val3, (_val4, _key4) => {
                                                        if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                            _.each(_val4, (_val5, _key5) => {
                                                                if (_val5.constructor.name === 'Object') {
                                                                    _.each(_val5, (_val6, _key6) => {
                                                                        if (_key6 == "_id" && _val6 != '') {
                                                                            _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                        }
                                                                        else {
                                                                            _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            if (_key4 == "_id" && _val4 != '') {
                                                                _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                            }
                                                            else {
                                                                _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val4;
                                                            }
                                                        }
                                                    })
                                                }
                                                else {
                                                    _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
                                                }
                                            })
                                        }
                                        else {
                                            if (_key2 == "_id" && _val2 != '') {
                                                _payload.by[`${_key}._id`] = _val2;
                                            }
                                            else {
                                                _params[`${_key}.$.${_key2}`] = _val2;
                                            }
                                        }
                                    });
                                }
                                // }
                            })
                            // }
                        }
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                if (Object.keys(_params).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$set = _params;
                    _cloneBw.updateOne.filter = _payload.by;
                    _bwData.push(_cloneBw);
                }
                if (Object.keys(_payload.query.$push).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$push = _payload.query.$push;
                    // _cloneBw.updateOne.filter = _payload.by;
                    _cloneBw.updateOne.filter = { "_id": _body.params._id };
                    _bwData.push(_cloneBw);
                }
                _payload = { "_id": _body.params._id, "pData": _bwData };

            }
            resolve({ "success": true, payload: _payload, desc: "" });
        })
    }
    catch (err) {
        return { "success": false, payload: {}, desc: err };
    }
}

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
                documentedBy: req.tokenData ? req.tokenData.displayName : "",
                documentedById: req.tokenData ? req.tokenData.userId : null
            }
        }
        else if (_query === 'updateOne') {
            req.body.params["audit"] = {
                modifiedById: req.tokenData.userId,
                modifiedBy: req.tokenData.displayName,
                modifiedDt: new Date().toISOString()
            };
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err, data: [] });
    }
});


/** Common Mongo Function */
async function commonMonogoCall(_method, _query, _params, _flag, _body, _filter, _tknData) {
    try {
        return new Promise((resolve, reject) => {
            mongoMapper(_method, _query, _params).then((result) => {
                if (_flag == 'REVNO') {
                    if (result && Object.keys(result.data).length > 0) {
                        if (_query === 'findOne' && _filter && result.data[_filter] && result.data[_filter][0]) {
                            result.data = result.data[_filter][0];
                        }
                        if (_body.params.revNo == result.data.revNo) {
                            _body.params.revNo = parseInt(result.data.revNo) + 1;
                            resolve({ success: true, data: _body || [] })
                        }
                        else {
                            let _revHist = result.data.revHist.sort().reverse()[0];
                            resolve({
                                success: false,
                                data: [{
                                    "modifiedBy": _revHist && _revHist.documentedBy ? _revHist.documentedBy : _tknData.displayName,
                                    "modifiedDt": _revHist && _revHist.documentedDt ? _revHist.documentedDt : new Date().toISOString()
                                }],
                                desc: `Provided RevNo not matched, someone updated this record, please reload the page ..`
                            })
                        }
                    }
                    else {
                        resolve({ success: false, data: [], desc: `No data found..` })
                    }
                }
                else {
                    resolve({ success: true, data: result.data || [] })
                }
            }).catch((error) => {
                resolve({ success: false, data: [], desc: `Error occured While executing proc, Error:- ${error.desc || error}` })
            });
        })
    }
    catch (err) {
        return { success: false, data: [], desc: `Error occured, Error:- ${err}` }
    }
};

/* Process LAB Results */
async function getLabResults(_hisSyncUrls, method, params) {
    return new Promise((resolve, reject) => {
        try {
            let _labData = [];
            _.each(_hisSyncUrls, async (_hObj, _idx) => {
                let response = await commonAxiosCall("GET", `${_hObj.hisApiUrl}${method}?${params}`);
                if ((response.success && response.data)) {
                    let data = _util.xml2JSON(response.data, 'string').data;
                    if (data && data != undefined) {
                        _labData = _labData.concat(data);
                    }
                }
                if (_idx == (_hisSyncUrls.length - 1)) {
                    resolve({ "success": true, "data": _labData || [] });
                }
            });

        }
        catch (err) {
            resolve({ "success": false, "data": [] });
        }
    })
}

/* Get All Patient Details */
router.post("/get-all-patient-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
            "selectors": "-document -comorbidities -scores"
        }
        mongoMapper("patient_care_patients", "find", _filter).then((result) => {
            let _filteredPatients = [];
            if (result && result.data) {
                _.each(result.data, (_o) => {
                    if (!req.body.params.isActive) {
                        let _surgeryDta = _.filter(_o.surgeries, (_s) => { return !_s.surgeryClosed });
                        if (!(_surgeryDta && _surgeryDta.length > 0) && _o.surgeries && _o.surgeries.length > 0) {
                            _o["completed"] = true;
                            _filteredPatients.push(_o);
                        }
                    }
                    else {
                        if (_o.surgeries && _o.surgeries.length > 0) {
                            let _surgeryDta = _.filter(_o.surgeries, (_s) => { return !_s.surgeryClosed });
                            if (_surgeryDta && _surgeryDta.length > 0) {
                                _o["completed"] = false;
                                _filteredPatients.push(_o);
                            }
                        }
                        else {
                            _o["completed"] = false;
                            _filteredPatients.push(_o);
                        }
                    }
                });
            }
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _filteredPatients || [] });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

/* Get Patient Details by UMR / Mobile */
router.post('/get-patient-by-umr', async function (req, res) {
    try {
        let _params = {};
        if (req.body && req.body.params && req.body.params.flag && (req.body.params.flag == 'NAME' || req.body.params.flag == 'MOB' || req.body.params.flag == 'ADMN' || req.body.params.flag == 'UMR' || req.body.params.flag == 'DOS') && req.body.params.searchValue && req.body.params.searchValue.length > 0) {
            if (req.body.params.flag == 'UMR') {
                _params = {
                    "orgId": req.tokenData.orgId, "locId": req.tokenData.locId,
                    "umr": new RegExp('.*' + req.body.params.searchValue + '.*')
                }
            }
            else if (req.body.params.flag == 'NAME') {
                _params = {
                    "orgId": req.tokenData.orgId, "locId": req.tokenData.locId,
                    "disName": new RegExp('.*' + req.body.params.searchValue + '.*')
                }
            }
            else if (req.body.params.flag == 'DOS') {
                _params = {
                    "orgId": req.tokenData.orgId, "locId": req.tokenData.locId,
                    "surgeries.$.documentedDt": { $eq: new Date(new Date(req.body.params.searchValue).setUTCHours(0, 0, 0, 0)).toISOString() }
                }
            }
            else {
                _params = {
                    "orgId": req.tokenData.orgId, "locId": req.tokenData.locId,
                    "phone": { $elemMatch: { num: new RegExp('.*' + req.body.params.searchValue + '.*') } }
                }
            }
            let _filter = {
                "filter": _params,
                "selectors": "-document -surgeries -scores"
            }
            mongoMapper("patient_care_patients", "find", _filter).then(async (result) => {
                // if (result && result.data && result.data.length > 0) {
                //     //  let baseMap = fetchTransformColumns("getPatientById");
                //     //    response = transform(response, baseMap);
                //     return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data })
                // }
                // else {
                // let _mResp = [];
                // _.map(result.data, async (_obj) => {
                //     //let _mObj = await _.omit(_obj, ['document']);
                //     let _mObj = {};
                //     _.map(_obj._doc, async (_sVal, _sKey) => {
                //         if (_sKey !== 'document') {
                //             _mObj[_sKey] = _sVal;
                //         }
                //     });
                //     if (Object.keys(_mObj).length > 0) {
                //         _mResp.push(_mObj);
                //     }

                // });
                let _mResp = [];
                if (typeof result.data === 'object' && result.data !== null && !Array.isArray(result.data)) {
                    _mResp.push(result.data);
                }
                else if (Array.isArray(result.data)) {
                    _mResp = result.data;
                }
                //console.log("_mResp", _mResp);
                _params = {
                    FLAG: req.body.params.flag,
                    SRCH_VAL: req.body.params.searchValue,
                    SRCH_VAL1: req.body.params.searchValue1 || "",
                    ORG_ID: 1002 || req.tokenData.orgId || 1067
                }
                axios.post(req.clientUrls.emrApiUrl + '/uprGetPatDetAutoSrch', _params).then((response) => {
                    let _response = response.data;
                    let baseMap = fetchTransformColumns("getPatientById");
                    _response = transform(_response, baseMap);
                    let _finalResp = _mResp.concat(_response)
                    return res.status(200).send({ status: "SUCCESS", desc: '', data: _finalResp.reverse() || [] });
                }).catch((err) => {
                    return res.status(400).send({ status: "FAIL", desc: '', data: err });
                })
                // }
            }).catch((err) => {
                return res.status(400).send({ status: 'FAIL', data: [], desc: err });
            })
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).send({ status: 'FAIL', desc: error, data: [], });
    }

});


/* Get Patient Details By _id */
router.post("/get-patient-by-id", async (req, res) => {
    try {
        let _filter = {
            "filter": req.body.params,
            "selectors": "-document -scores"
        }
        mongoMapper("patient_care_patients", "find", _filter).then((result) => {
            if (result && result.data) {
                for (let _o in result.data) {
                    let _surgeryDta = _.filter(result.data[_o].surgeries, (_s) => { return !_s.surgeryClosed });
                    if (!(_surgeryDta && _surgeryDta.length > 0) && result.data[_o].surgeries && result.data[_o].surgeries.length > 0) {
                        result.data[_o].isCompleted = true;
                    }
                    else {
                        result.data[_o].isCompleted = false;
                    }
                };
            }
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Insert New Patient Data */
router.post("/insert-patient", async (req, res) => {
    try {
        let _filter = {
            "filter": { 'umr': req.body.params.umr, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
            "selectors": "-document -surgeries -scores"
        }
        let _patientData = await commonMonogoCall("patient_care_patients", "findOne", _filter, "", req.body)
        if ((_patientData && _patientData.success && _patientData.data && _patientData.data.umr && _patientData.data.umr.length > 0)) {
            return res.status(400).json({ status: 'FAIL', desc: "Patient already exists..", data: [] });
        }
        req.body.params["orgId"] = req.tokenData.orgId;
        req.body.params["locId"] = req.tokenData.locId;
        mongoMapper('patient_care_patients', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Update Patient Details */
router.post("/update-patient-details", async (req, res) => {
    try {
        let _patient = await commonMonogoCall("patient_care_patients", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData)
        if (!(_patient && _patient.success)) {
            return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
        }

        let pLoadResp = { payload: {} };
        pLoadResp = await preparePayload(req.body.flag, _patient.data);
        if (!pLoadResp.success) {
            return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
        }
        let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
        _cloneBw.updateOne.update.$push = {
            "revHist": {
                "revNo": _patient.data.params.revNo,
                "documentedId": req.tokenData.userId || "",
                "documentedBy": req.tokenData.userName || ""
            }
        };
        _cloneBw.updateOne.update.$set = {
            "audit.modifiedById": req.tokenData.userId,
            "audit.modifiedBy": req.tokenData.displayName,
            "audit.modifiedDt": new Date().toISOString()
        }
        _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
        pLoadResp.payload.pData.push(_cloneBw);
        //console.log("  pLoadResp.payload", pLoadResp.payload);
        mongoMapper('patient_care_patients', 'bulkWrite', pLoadResp.payload).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        // console.log("error", error);
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/*get all patient surgeries*/
router.post("/get-patient-all-surgeries", async (req, res) => {
    try {
        mongoMapper("patient_care_patients", req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data.surgeries });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

/* Insert New Surgery Data  */
router.post("/insert-surgery-data", async (req, res) => {
    try {
        if (req.body.params.patientId && req.body.params.umr) {
            delete req.body.params.revHist;
            let _filter = {
                "filter": { 'umr': req.body.params.umr, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
                "selectors": {}
            }
            let _query = "findOneAndUpdate";
            let _params = {};
            let _surgery = await commonMonogoCall("patient_care_surgeries", "findOne", _filter, "", req.body)
            if (!(_surgery && _surgery.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _surgery.desc || "", data: _surgery.data || [] });
            }
            if (!_surgery.data.umr) {
                // console.log("req.body.params.audit", req.body.params.audit)
                req.sParams = { "admnNo": req.body.params.admns[0].admNo, "admDt": req.body.params.admns[0].admDt };
                req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                req.sParams["patientId"] = req.body.params.patientId;
                _query = "insertMany";
                req.body.params["orgId"] = req.tokenData.orgId;
                req.body.params["locId"] = req.tokenData.locId;
                req.body.params["documentedId"] = req.tokenData.userId || "";
                req.body.params["documentedBy"] = req.tokenData.displayName || "";
                req.body.params.admns[0]["audit"] = req.body.params.audit;
                req.body.params.admns[0].surgDtls["revHist"] = {
                    "revNo": 0,
                    "documentedId": req.tokenData.userId || "",
                    "documentedBy": req.tokenData.displayName || ""
                }
                req.body.params.admns[0].surgDtls["audit"] = req.body.params.audit;
                _params = req.body.params;
            }
            else {
                req.body.params["_id"] = _surgery.data._id;
                let _admn = _.filter(_surgery.data.admns, function (o) { return o.admNo == req.body.params.admns[0].admNo });
                if (_admn.length > 0) {
                    req.body.params["admns"][0]._id = _admn[0]._id;
                    //_surgery.data.admns[0]._id;
                }
                let pLoadResp = { payload: {} };
                if (req.body.params["admns"][0].surgDtls && req.body.params["admns"][0].surgDtls.length > 0 && req.body.params["admns"][0].surgDtls[0]._id) {
                    req.sParams = { "admnNo": req.body.params.admns[0].admNo, "admDt": req.body.params.admns[0].admDt };
                    req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                    req.sParams["patientId"] = req.body.params.patientId;
                    req.body.params.admns[0].audit["modifiedById"] = req.tokenData.userId;
                    req.body.params.admns[0].audit["modifiedBy"] = req.tokenData.displayName;
                    req.body.params.admns[0].audit["modifiedDt"] = new Date().toISOString();
                    pLoadResp = await preparePayload('U', req.body);
                    // pLoadResp.payload.query.$set = {
                    //     "audit.modifiedById": req.tokenData.userId,
                    //     "audit.modifiedBy": req.tokenData.displayName,
                    //     "audit.modifiedDt": new Date().toISOString()
                    // }
                }
                else {
                    req.sParams = { "admnNo": req.body.params.admns[0].admNo, "admDt": req.body.params.admns[0].admDt };
                    req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                    req.sParams["patientId"] = req.body.params.patientId;
                    let _cloneBody = JSON.parse(JSON.stringify(req.body.params)); //clone
                    delete req.body.params.admns[0].surgDtls;
                    if (req.body.params["admns"][0]._id) {
                        pLoadResp = await preparePayload('U', req.body);
                    }
                    else {
                        req.body.params.admns[0]["audit"] = req.body.params.audit;
                        delete req.body.params.documentedBy;
                        delete req.body.params.documentedId;
                        delete req.body.params.patientId;
                        delete req.body.params.umr;
                        delete req.body.params.audit;
                        pLoadResp = await preparePayload('AE', req.body);
                    }

                    _cloneBody.admns[0].surgDtls["revHist"] = {
                        "revNo": 0,
                        "documentedId": req.tokenData.userId || "",
                        "documentedBy": req.tokenData.userName || ""
                    }
                    pLoadResp.payload.query.$set = {
                        "audit.modifiedById": req.tokenData.userId,
                        "audit.modifiedBy": req.tokenData.displayName,
                        "audit.modifiedDt": new Date().toISOString()
                    }
                    _cloneBody.admns[0].surgDtls["audit"] = _cloneBody.audit;
                    if (req.body.params["admns"][0]._id) {
                        pLoadResp.payload.query.$push = {
                            "admns.$.surgDtls": _cloneBody.admns[0].surgDtls
                        }
                    }
                    else {
                        pLoadResp.payload.query.$push["admns"][0]["surgDtls"] = _cloneBody.admns[0].surgDtls
                    }
                }
                _params = pLoadResp.payload;
                _query = "findOneAndUpdate";
            }
            mongoMapper('patient_care_surgeries', _query, _params).then(async (result) => {
                //result.data = typeof result
                let _resp = []; let _surgId = "";
                if (result.data && result.data[0]) {
                    _resp = result.data[0];
                }
                else if (result.data) {
                    _resp = result.data;
                }
                if (_resp && _resp.admns && _resp.admns.length > 0) {
                    let _admns = _.filter(_resp.admns, function (o) { return o.admNo == req.sParams.admnNo });
                    if (_admns && _admns.length > 0) {
                        let _surgData = _.filter(_admns[0].surgDtls, function (o) { return o.audit.documentedById == req.tokenData.userId && o.surgery == req.sParams.surgDtls.surgery && o.type == req.sParams.surgDtls.type && o.ps == req.sParams.surgDtls.ps });
                        if (_surgData && _surgData.length > 0) {
                            let _patObj = {
                                params: {
                                    _id: req.sParams.patientId,
                                    surgeries:
                                    {
                                        admn: req.sParams.admnNo,
                                        admnDt: req.sParams.admDt,
                                        surgId: _surgData[0]._id || "",
                                        surgName: `${_surgData[0].surgery}  ${_surgData[0].type}  ${_surgData[0].ps}`,
                                        surgery: _surgData[0].surgery,
                                        type: _surgData[0].type,
                                        ps: _surgData[0].ps,
                                        route: _surgData[0].route,
                                        surgeryClosed: false,
                                        surgeryClosedId: "",
                                        surgeryClosedBy: "",
                                        surgeryClosedDt: "",
                                        reviewDt: "",
                                        reviewRemarks: "",
                                        preOperative: _surgData[0].mandFilledInPreop,
                                        intraOperative: _surgData[0].mandFilledInIntraop,
                                        prosthesis: _surgData[0].mandFilledInProsthesis,
                                        progressStatus: 'PENDING',
                                        documentedId: req.tokenData.userId || "",
                                        documentedBy: req.tokenData.userName || ""
                                    }
                                }
                            }
                            let pLoadResp = { payload: {} };
                            pLoadResp = await preparePayload('IAU', _patObj);
                            if (!pLoadResp.success) {
                                // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                            }
                            let _surgUpdate = await commonMonogoCall("patient_care_patients", "updateOne", pLoadResp.payload, "", "")
                            if (!(_surgUpdate && _surgUpdate.success)) {
                                // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                            }
                            _surgId = _surgData[0]._id;
                        }
                    }
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: _surgId });
                }
                else {
                    return res.status(400).json({ status: 'FAIL', desc: 'Record Not Saved ..,', data: [] });
                }



            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }

});

/* Get Surgery List Details By UMR */
router.post("/get-surgery-list-by-umr", async (req, res) => {
    try {
        if (req.body.params.umr) {
            req.body.params["orgId"] = req.tokenData.orgId;
            req.body.params["locId"] = req.tokenData.locId;
            let _filter = {
                "filter": req.body.params,
                "selectors": "-document -comorbidities -scores"
            }
            mongoMapper("patient_care_patients", "find", _filter).then((result) => {
                if (!(result.data && result.data[0] && result.data[0]._id && result.data[0].surgeries && result.data[0].surgeries.length > 0)) {
                    return res.status(200).json({ status: 'SUCCESS', desc: "No Records are available.." || error, data: [] });
                }
                let _data = JSON.parse(JSON.stringify(result.data[0].surgeries));
                let _clnFollowupsData = [];
                _.each(_data, (_sObj) => {
                    _sObj["umr"] = result.data.umr;
                    _sObj["fName"] = result.data.fName;
                    _sObj["mName"] = result.data.mName;
                    _sObj["lName"] = result.data.lName;
                    _sObj["gender"] = result.data.gender;
                    _sObj["dob"] = result.data.dob;
                    if (_sObj.followups && _sObj.followups.length > 0) {
                        _clnFollowupsData.push(_sObj);
                    }
                });
                _.each(_clnFollowupsData, (_o) => {
                    _.each(_o.followups, (_f) => {
                        let _flwUpObj = JSON.parse(JSON.stringify(_o));
                        _.each(_f, (_v, _c) => {
                            if (_c == '_id') {
                                _flwUpObj["selPatFollowupId"] = _v;
                            }
                            else {
                                _flwUpObj[_c] = _v;
                            }
                        });
                        delete _flwUpObj.followups;
                        _flwUpObj.type = "FOLLOWUP";
                        if (_flwUpObj.followupNo && _flwUpObj.date) {
                            _flwUpObj.formattedSurgName = `${_flwUpObj.followupNo} on ${moment(_flwUpObj.date).format('dd-MMM-yyyy')}${_flwUpObj.surgName}`;
                        }
                        else {
                            _flwUpObj.formattedSurgName = _flwUpObj.surgName;
                        }
                        _data.push(_flwUpObj);
                    });
                });

                return res.status(200).json({ status: 'SUCCESS', desc: '', data: _data ? _data.reverse() : [] || [] });
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Surgery Data By Id */
router.post("/get-surgery-data-by-id", async (req, res) => {
    try {
        if (req.body.params.admNo && req.body.params.surgId) {
            let _params = {
                "filter": { 'admns.admNo': req.body.params.admNo, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
                "selectors": { 'admns.$': 1 }
            }
            mongoMapper("patient_care_surgeries", "findOne", _params).then((result) => {
                if (!(result.data && result.data._id)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _surgData = _.filter(result.data.admns[0].surgDtls, (o) => { return o._id == req.body.params.surgId })
                if (_surgData && _surgData.length > 0) {
                    let _sData = {
                        "_id": result.data._id,
                        "admns": {
                            "_id": result.data.admns[0]._id,
                            "admNo": result.data.admns[0].admNo,
                            "admDt": result.data.admns[0].admDt,
                            "surgDtls": _surgData
                        }
                    }

                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: _sData || [] });
                }
                else {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Update Surgery Details */
router.post("/update-surgery-data", async (req, res) => {
    try {
        if (req.body.params._id && req.body.params.admns && req.body.params.admns[0] && req.body.params.admns[0]._id && req.body.params.admns[0].surgDtls && req.body.params.admns[0].surgDtls[0] && req.body.params.admns[0].surgDtls[0]._id && (req.body.params.admns[0].surgDtls[0].revNo || req.body.params.admns[0].surgDtls[0].revNo == 0)) {
            let _filter = {
                "filter": { 'admns.surgDtls._id': req.body.params.admns[0].surgDtls[0]._id },
                "selectors": { 'admns.surgDtls.$': 1 }
            }
            let _surgery = await commonMonogoCall("patient_care_surgeries", "findOne", _filter, "", req.body);
            if (!(_surgery && _surgery.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _surgery.desc || "", data: _surgery.data || [] });
            }
            let _sData = _.filter(_surgery.data.admns[0].surgDtls, (o) => { return o._id == req.body.params.admns[0].surgDtls[0]._id });
            if (!(_sData && _sData.length > 0)) {
                return res.status(400).json({ status: 'FAIL', desc: "No Records are available..", data: [] });
            }

            if (req.body.params.admns[0].surgDtls[0].revNo == _sData[0].revNo) {
                req.body.params.admns[0].surgDtls[0].revNo = parseInt(_sData[0].revNo) + 1;
            }
            else {
                let _revHist = _sData[0].revHist.sort().reverse()[0];
                return res.status(400).json({
                    status: 'FAIL',
                    data: [{
                        "modifiedBy": _revHist.documentedBy,
                        "modifiedDt": _revHist.documentedDt
                    }],
                    desc: `Provided RevNo not matched, someone updated this record, please reload the page ..`
                });
            }
            let _cloneBody = JSON.parse(JSON.stringify(req.body.params));
            delete req.body.params.supporttedObj;
            let pLoadResp = { payload: {} };
            if (req.body.params.flag === "REVIEW") {
                req.body.params.admns[0].surgDtls[0].surgeryClosed = true;
                req.body.params.admns[0].surgDtls[0].surgeryClosedId = req.tokenData.userId;
                req.body.params.admns[0].surgDtls[0].surgeryClosedBy = req.tokenData.displayName;
                req.body.params.admns[0].surgDtls[0].surgeryClosedDt = new Date().toISOString();
                delete req.body.params.flag;
            }
            else if (req.body.params.flag === "FOLLOWUP") {
                delete req.body.params.admns[0].surgDtls[0].followups;
                delete req.body.params.flag;
            }
            pLoadResp = await preparePayload(req.body.flag, req.body);
            if (!pLoadResp.success) {
                return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
            }

            if (_cloneBody.flag === "FOLLOWUP") {
                _cloneBody.admns[0].surgDtls[0].followups.audit = {
                    documentedBy: req.tokenData ? req.tokenData.displayName : "",
                    documentedById: req.tokenData ? req.tokenData.userId : null,
                    documentedDt: new Date().toISOString()
                };
                let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                _cloneBw.updateOne.update.$push["admns.$.surgDtls.$[].followups"] = _cloneBody.admns[0].surgDtls[0].followups

                _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id, "admns._id": req.body.params.admns[0]._id, "admns.surgDtls._id": _sData[0]._id };
                pLoadResp.payload.pData.push(_cloneBw);
            }
            //console.log("_surgery.data.admns[0]", _surgery.data.admns[0]);
            /*
            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$push = {
                "admns": {
                    "surgDtls": {
                        "revHist": {
                            "revNo": req.body.params.admns[0].surgDtls[0].revNo,
                            "documentedId": req.tokenData.userId || "",
                            "documentedBy": req.tokenData.userName || ""
                        },
                        // "audit": { 
                        //     "modifiedById": req.tokenData.userId,
                        //     "modifiedBy": req.tokenData.displayName,
                        //     "modifiedDt": new Date().toISOString()
                        // }
                    },

                }
            }
            _cloneBw.updateOne.update.$set = {
                "audit.modifiedById": req.tokenData.userId,
                "audit.modifiedBy": req.tokenData.displayName,
                "audit.modifiedDt": new Date().toISOString(),
                // "admns.audit.modifiedById": req.tokenData.userId,
                // "admns.audit.modifiedBy": req.tokenData.displayName,
                // "admns.audit.modifiedDt": new Date().toISOString()
            }
            console.log("_cloneBw.updateOne.update.$set", _cloneBw.updateOne.update.$push);
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id, "admns._id": _surgery.data.admns[0]._id, "admns.surgDtls._id": _sData[0]._id };
            pLoadResp.payload.pData.push(_cloneBw);
            */
            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$push = {
                // "admns": {
                //     "surgDtls": {
                //         "revHist": {
                //             "revNo": req.body.params.admns[0].surgDtls[0].revNo,
                //             "documentedId": req.tokenData.userId || "",
                //             "documentedBy": req.tokenData.userName || ""
                //         }
                //     }
                // }
            }
            _cloneBw.updateOne.update.$set = {
                "audit.modifiedById": req.tokenData.userId,
                "audit.modifiedBy": req.tokenData.displayName,
                "audit.modifiedDt": new Date().toISOString(),
                "admns.$.audit.modifiedById": req.tokenData.userId,
                "admns.$.audit.modifiedBy": req.tokenData.displayName,
                "admns.$.audit.modifiedDt": new Date().toISOString(),
                "admns.$.surgDtls.$[].audit.modifiedById": req.tokenData.userId,
                "admns.$.surgDtls.$[].audit.modifiedBy": req.tokenData.displayName,
                "admns.$.surgDtls.$[].audit.modifiedDt": new Date().toISOString()
            }
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id, "admns._id": req.body.params.admns[0]._id, "admns.surgDtls._id": _sData[0]._id };
            pLoadResp.payload.pData.push(_cloneBw);
            mongoMapper('patient_care_surgeries', 'bulkWrite', pLoadResp.payload).then(async (result) => {
                let pLoadResp = { payload: {} };
                let _updSurgData = req.body.params.admns[0].surgDtls[0];
                let _patObj = {
                    params: {
                        _id: _cloneBody.supporttedObj.patientRefId
                    }
                }
                if (_cloneBody.flag !== "REVIEW" && _cloneBody.flag !== "FOLLOWUP") {
                    _patObj.params.surgeries =
                        [{
                            _id: _cloneBody.supporttedObj.selPatSurgId,
                            preOperative: _updSurgData.mandFilledInPreop,
                            intraOperative: _updSurgData.mandFilledInIntraop,
                            prosthesis: _updSurgData.mandFilledInProsthesis,
                        }];
                    pLoadResp = await _mUtils.preparePayload('BW', _patObj);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                    }
                    let _patient = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", req.body);
                }
                else if (_cloneBody.flag === "FOLLOWUP") {
                    pLoadResp.payload = { pData: [] };
                    let _filter = {
                        "filter": { 'admns.surgDtls._id': _cloneBody.admns[0].surgDtls[0]._id },
                        "selectors": { 'admns.surgDtls.$': 1 }
                    }
                    let _surgery = await commonMonogoCall("patient_care_surgeries", "findOne", _filter, "", req.body);
                    if (!(_surgery && _surgery.success)) {
                        // return res.status(400).json({ status: 'FAIL', desc: _surgery.desc || "", data: _surgery.data || [] });
                    }
                    let _sData = _.filter(_surgery.data.admns[0].surgDtls, (o) => { return o._id == _cloneBody.admns[0].surgDtls[0]._id });
                    if (!(_sData && _sData.length > 0)) {
                        // return res.status(400).json({ status: 'FAIL', desc: "No Records are available..", data: [] });
                    }
                    let _followData = _.filter(_sData[0].followups, (o) => { return o.audit.documentedById == _cloneBody.admns[0].surgDtls[0].followups.audit.documentedById && o.audit.documentedDt == _cloneBody.admns[0].surgDtls[0].followups.audit.documentedDt });
                    if (_followData && _followData.length > 0) {
                        let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                        _cloneBw.updateOne.update.$push["surgeries.$.followups"] = {
                            surgFollowupId: _followData[0]._id,
                            followupNo: _followData[0].followupNo,
                            followupOn: _followData[0].followupOn,
                            date: _followData[0].date,
                            remarks: _followData[0].remarks,
                            nextFollowupDt: _followData[0].nextFollowupDt,
                            documentedBy: req.tokenData.displayName,
                            documentedId: req.tokenData.userId
                        };
                        _cloneBw.updateOne.filter = { "_id": _cloneBody.supporttedObj.patientRefId, "surgeries._id": _cloneBody.supporttedObj.selPatSurgId };
                        pLoadResp.payload.pData.push(_cloneBw);
                    }
                    let _patient = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", req.body);
                }



                // let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                // _cloneBw.updateOne.update.$push = {
                //     "revHist": {
                //         "revNo": _patient.data.params.revNo,
                //         "documentedId": req.tokenData.userId || "",
                //         "documentedBy": req.tokenData.userName || ""
                //     }
                // };
                // _cloneBw.updateOne.update.$set = {
                //     "audit.modifiedById": req.tokenData.userId,
                //     "audit.modifiedBy": req.tokenData.displayName,
                //     "audit.modifiedDt": new Date().toISOString()
                // }
                // _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
                //  pLoadResp.payload.pData.push(_cloneBw);
                if (_cloneBody.flag === "REVIEW") {
                    let _patObj = {
                        params: {
                            _id: _cloneBody.supporttedObj.patientRefId,
                            surgeries:
                                [{
                                    _id: _cloneBody.supporttedObj.selPatSurgId,
                                    surgeryClosed: true,
                                    surgeryClosedId: req.tokenData.userId,
                                    surgeryClosedBy: req.tokenData.displayName,
                                    surgeryClosedDt: req.body.params.admns[0].surgDtls[0].surgeryClosedDt,
                                    reviewDt: _cloneBody.supporttedObj.reviewDt,
                                    reviewRemarks: _cloneBody.supporttedObj.reviewRemarks
                                }]
                        }
                    }
                    let pLoadResp = { payload: {} };
                    pLoadResp = await preparePayload('BW', _patObj);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                    }
                    // let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    // _cloneBw.updateOne.update.$push = {
                    //     "revHist": {
                    //         "revNo": _patient.data.params.revNo,
                    //         "documentedId": req.tokenData.userId || "",
                    //         "documentedBy": req.tokenData.userName || ""
                    //     }
                    // };
                    // _cloneBw.updateOne.update.$set = {
                    //     "audit.modifiedById": req.tokenData.userId,
                    //     "audit.modifiedBy": req.tokenData.displayName,
                    //     "audit.modifiedDt": new Date().toISOString()
                    // }
                    // _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
                    // pLoadResp.payload.pData.push(_cloneBw);
                    let _patient = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", req.body);
                    let _reviewParams = {
                        orgId: req.tokenData.orgId,
                        locId: req.tokenData.locId,
                        patientRefId: _cloneBody.supporttedObj.patientRefId,
                        umr: _cloneBody.supporttedObj.umr,
                        disName: _cloneBody.supporttedObj.disName,
                        gender: _cloneBody.supporttedObj.gender,
                        dob: _cloneBody.supporttedObj.dob,
                        mobile: _cloneBody.supporttedObj.mobile,
                        reviewDate: _cloneBody.supporttedObj.reviewDt,
                        remarks: _cloneBody.supporttedObj.reviewRemarks,
                        surgeryId: _cloneBody.supporttedObj.surgeryId,
                        surgeryName: _cloneBody.supporttedObj.surgeryName,
                        position: _cloneBody.supporttedObj.position,
                        surgeryDate: _cloneBody.supporttedObj.surgeryDate,
                        audit: {
                            documentedBy: req.tokenData ? req.tokenData.displayName : "",
                            documentedById: req.tokenData ? req.tokenData.userId : null
                        }
                    };
                    let _reviewData = await commonMonogoCall("patient_care_reviews", "insertMany", _reviewParams, "", "")
                    if (!(_reviewData && _reviewData.success)) {
                        // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                    }
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
                }
                else {
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
                }

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Get Surgery Data By Id */
router.post("/print-surgery-data", async (req, res) => {
    try {
        if (!(req.body.params.umr)) {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
        let _params = {
            "filter": { 'umr': req.body.params.umr, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
            "selectors": {}
        };
        if (req.body.params.admnNo) {
            _params.filter["admns.admNo"] = req.body.params.admNo;
        }
        mongoMapper("patient_care_surgeries", "findOne", _params).then(async (result) => {
            if (!(result.data && result.data._id)) {
                return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
            }
            let _patParams = {
                "filter": { 'umr': req.body.params.umr, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
                "selectors": "-healthHist -emrClinicalInfo -labResults -comorbidities -charlsonComorbidityIndex -surgeries -scores -audit -history -revHist"
            }
            let _patientData = await commonMonogoCall("patient_care_patients", "findOne", _patParams, "", req.body)
            if (!(_patientData && _patientData.success && _patientData.data && _patientData.data.umr && _patientData.data.umr.length > 0)) {
                return res.status(400).json({ status: 'FAIL', desc: "No patient was found", data: [] });
            }
            let _scoresParams = {
                "filter": { 'umr': req.body.params.umr, "orgId": req.tokenData.orgId, "locId": req.tokenData.locId },
                "selectors": ""
            };
            if (req.body.params.surgId) {
                _scoresParams.filter["surgId"] = req.body.params.surgId;
            }
            let _scores = await commonMonogoCall("patient_care_scores", "find", _scoresParams, "", req.body, "scores")
            if (!(_scores && _scores.success)) {
                // return res.status(400).json({ status: 'FAIL', desc: _scores.desc || "", data: _scores.data || [] });
            }
            let _surgData = _.filter(result.data.admns[0].surgDtls, (o) => { return o._id == req.body.params.surgId })

            //if (_surgData && _surgData.length > 0) {
            let _sData = {
                "patDetails": _patientData.data,
                "surgeries": []
            };
            let _docData = [];
            let _scoreData = [];
            if (_scores.data && _scores.data.length > 0) {
                _scores.data.forEach(_o => {
                    if (_o.surgId == req.body.params.surgId) {
                        _scoreData.push(_o);
                    }
                });
            }
            if (_patientData.data && _patientData.data.document && _patientData.data.document.length > 0) {
                _patientData.data.document.forEach(_o => {
                    if (_o.surgId == req.body.params.surgId) {
                        _docData.push({
                            "docId": _o.docId,
                            "admNo": _o.admNo,
                            "admnDt": _o.admnDt,
                            "docName": _o.docName,
                            "docType": _o.docType,
                            "format": _o.format,
                            "isImage": _o.isImage,
                            "path": _o.path,
                            "surgId": _o.surgId,
                            "surgName": _o.surgName,
                            "surgDt": _o.surgDt,
                            "documentedId": _o.documentedId,
                            "documentedBy": _o.documentedBy,
                            "documentedDt": _o.documentedDt
                        });
                    }
                });
            }
            let _surDataOnAdmn = {
                "admnNo": result.data.admns[0].admNo,
                "admnDt": result.data.admns[0].admDt,
                "list": _surgData || [],
                "scores": _scoreData || [],
                "documents": _docData || []
            }
            _sData.surgeries.push(_surDataOnAdmn);
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _sData || [] });
            // }
            // else {
            //     return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
            // }
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });


    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});



/* Insert Scores */
router.post("/insert-scores-data-deprecated", async (req, res) => {
    try {
        if (req.body.params.umr) {
            req.sParams = {};
            let _filter = {
                "filter": { 'umr': req.body.params.umr },
                "selectors": {}
            }
            let _patient = await commonMonogoCall("patient_care_patients", "findOne", _filter, "", req.body)
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }
            delete req.body.params.umr;
            req.body.params["_id"] = _patient.data._id;
            pLoadResp = await preparePayload('AE', req.body);
            pLoadResp.payload.query.$push["scores"][0]["revHist"] = {
                "revNo": 0,
                "documentedId": req.tokenData.userId || "",
                "documentedBy": req.tokenData.userName || ""
            };
            pLoadResp.payload.query.$push["scores"][0]["documentedId"] = req.tokenData.userId || "";
            pLoadResp.payload.query.$push["scores"][0]["documentedBy"] = req.tokenData.userName || "";
            req.sParams["scoreCd"] = req.body.params.scores[0].scoreCd;
            mongoMapper('patient_care_patients', "findOneAndUpdate", pLoadResp.payload).then(async (result) => {
                if (result.data && result.data._id && result.data.scores && result.data.scores.length > 0) {
                    let _scoreData = _.filter(result.data.scores, function (o) { return o.documentedId == req.tokenData.userId && o.scoreCd == req.sParams["scoreCd"] });
                    if (_scoreData && _scoreData.length > 0) {
                        let _scoreId = _scoreData.reverse()[0]._id
                        return res.status(200).json({ status: 'SUCCESS', desc: '', data: { "_id": _scoreId } });
                    }
                    else {
                        return res.status(400).json({ status: 'FAIL', desc: 'Record Not Saved ..,', data: [] });
                    }
                }
                else {
                    return res.status(400).json({ status: 'FAIL', desc: 'Record Not Saved ..,', data: [] });
                }
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }

});

/* Update Score Details */
router.post("/update-score-details-deprecated", async (req, res) => {
    try {
        if (req.body.params._id && req.body.params.scores && req.body.params.scores[0] && req.body.params.scores[0]._id) {
            let _params = {
                "filter": { 'scores._id': req.body.params.scores[0]._id },
                "selectors": { 'scores.$': 1 }
            }

            let _patient = await commonMonogoCall("patient_care_patients", "findOne", _params, "REVNO", { params: req.body.params.scores[0] }, "scores")
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }

            let pLoadResp = { payload: {} };
            pLoadResp = await preparePayload(req.body.flag, req.body);
            if (!pLoadResp.success) {
                return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
            }
            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$push = {
                "scores.$.revHist": {
                    "revNo": _patient.data.params.revNo,
                    "documentedId": req.tokenData.userId || "",
                    "documentedBy": req.tokenData.userName || ""
                }
            };
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id, "scores._id": req.body.params.scores[0]._id };
            pLoadResp.payload.pData.push(_cloneBw);
            mongoMapper('patient_care_patients', 'bulkWrite', pLoadResp.payload).then((result) => {
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Insert Scores Data */
router.post("/insert-scores-data", async (req, res) => {
    try {
        if (req.body.params.patientId && req.body.params.umr) {
            let _patient = await commonMonogoCall("patient_care_patients", "findById", req.body.params.patientId, "", req.body)
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }
            req.body.params["orgId"] = req.tokenData.orgId;
            req.body.params["locId"] = req.tokenData.locId;
            req.body.params["documentedId"] = req.tokenData.userId || "";
            req.body.params["documentedBy"] = req.tokenData.userName || "";
            let _cloneBody = JSON.parse(JSON.stringify(req.body.params));
            delete req.body.params.supporttedObj;
            mongoMapper("patient_care_scores", "insertMany", req.body.params).then(async (result) => {
                if (!(result.data && result.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _patObj = {
                    params: {
                        _id: _patient.data._id,
                        scores:
                            [{
                                admn: req.body.params.admn || "",
                                admnDt: req.body.params.admnDt || "",
                                surgId: result.data[0].surgId,
                                surgName: result.data[0].surgName,
                                surgDtTm: result.data[0].surgDtTm,
                                scoreId: result.data[0]._id,
                                scoreCd: result.data[0].scoreCd,
                                scoreName: result.data[0].scoreName,
                                totalScore: result.data[0].totalScore,
                                percentage: result.data[0].percentage,
                                documentedId: req.tokenData.userId || "",
                                documentedBy: req.tokenData.userName || ""
                            }]
                    }
                };
                if (result.data[0].followupId && result.data[0].followupNo) {
                    _patObj.params.scores[0].followupId = result.data[0].followupId || "";
                    _patObj.params.scores[0].followupNo = result.data[0].followupNo || "";
                    _patObj.params.scores[0].followupOn = result.data[0].followupOn || "";
                    _patObj.params.scores[0].followupDate = result.data[0].followupDate || "";
                }
                let _clnSurg = JSON.parse(JSON.stringify(_patient.data.surgeries));
                let _filteredSurgData = _.filter(_clnSurg, (_o) => { return _o._id == _cloneBody.supporttedObj.selPatSurgId });
                if (_filteredSurgData && _filteredSurgData.length > 0) {
                    if (_filteredSurgData[0].progressStatus != 'COMPLETED') {
                        let _mandStatus = _.pick(_filteredSurgData[0], 'documents', 'intraOperative', 'preOperative', 'prosthesis');
                        let _status = _.filter(_mandStatus, (_o) => { return !_o });
                        _patObj.params.surgeries = [{
                            _id: _cloneBody.supporttedObj.selPatSurgId,
                            scores: true,
                            progressStatus: _status.length == 0 ? 'COMPLETED' : 'PENDING'
                        }]
                    }
                }
                let pLoadResp = { payload: {} };
                pLoadResp = await preparePayload('BW', _patObj);
                if (!pLoadResp.success) {
                    // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                }
                let _patUpdate = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", "")
                if (!(_patUpdate && _patUpdate.success)) {
                    // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                }

                return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Scores List By UMR */
router.post("/get-scores-list-by-umr", async (req, res) => {
    try {
        if (req.body.params.umr) {
            req.body.params["orgId"] = req.tokenData.orgId;
            req.body.params["locId"] = req.tokenData.locId;
            let _filter = {
                "filter": req.body.params,
                "selectors": "-document -comorbidities -surgeries"
            }
            mongoMapper("patient_care_patients", "find", _filter).then((result) => {
                if (!(result.data && result.data[0] && result.data[0]._id && result.data[0].scores && result.data[0].scores.length > 0)) {
                    return res.status(200).json({ status: 'SUCCESS', desc: "No Records are available.." || error, data: [] });
                }
                let gData = _.groupBy(result.data[0].scores, 'scoreCd');
                let mData = _.map(gData, (gVal, gKey) => {
                    let _gObj = gVal.reverse();
                    return {
                        "_id": _gObj[0].scoreId,
                        "patLvlScoreId": _gObj[0]._id,
                        "admn": _gObj[0].admn || "",
                        "admnDt": _gObj[0].admnDt || "",
                        "surgId": _gObj[0].surgId || "",
                        "surgName": _gObj[0].surgName || "",
                        "surgDtTm": _gObj[0].surgDtTm || "",
                        "scoreCd": gKey,
                        "scoreName": _gObj[0].scoreName || "",
                        "totalScore": _gObj[0].totalScore || "",
                        "percentage": _gObj[0].percentage || "",
                        "followupId": _gObj[0].followupId || "",
                        "followupNo": _gObj[0].followupNo || "",
                        "followupOn": _gObj[0].followupOn || "",
                        "followupDate": _gObj[0].followupDate || "",
                        "documentedId": _gObj[0].documentedId,
                        "documentedBy": _gObj[0].documentedBy,
                        "documentedDt": _gObj[0].documentedDt
                    }
                });
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: mData || [] });
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Score Data By Id */
router.post("/get-scores-data-by-id", async (req, res) => {
    try {
        if (req.body.params._id) {
            mongoMapper("patient_care_scores", "findById", req.body.params._id).then((result) => {
                if (!(result.data && result.data._id)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Update Scores Details */
router.post("/update-score-details", async (req, res) => {
    try {
        if (req.body.params._id) {
            let _patient = await commonMonogoCall("patient_care_scores", "findById", req.body.params._id, "REVNO", req.body, "scores")
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }

            let pLoadResp = { payload: {} };
            pLoadResp = await preparePayload(req.body.flag, req.body);
            if (!pLoadResp.success) {
                return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
            }
            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$push = {
                "revHist": {
                    "revNo": _patient.data.params.revNo,
                    "documentedId": req.tokenData.userId || "",
                    "documentedBy": req.tokenData.userName || ""
                }
            };
            _cloneBw.updateOne.update.$set = {
                "audit.modifiedById": req.tokenData.userId,
                "audit.modifiedBy": req.tokenData.displayName,
                "audit.modifiedDt": new Date().toISOString()
            }
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
            pLoadResp.payload.pData.push(_cloneBw);
            mongoMapper('patient_care_scores', 'bulkWrite', pLoadResp.payload).then(async (result) => {
                let _patObj = {
                    params: {
                        _id: req.body.params.patientId,
                        scores:
                            [{
                                _id: req.body.params.patLvlScoreId,
                                totalScore: req.body.params.totalScore,
                                percentage: req.body.params.percentage
                            }]
                    }
                }
                let pLoadResp = { payload: {} };
                pLoadResp = await preparePayload('BW', _patObj);
                if (!pLoadResp.success) {
                    return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                }
                // let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                // _cloneBw.updateOne.update.$push = {
                //     "revHist": {
                //         "revNo": _patient.data.params.revNo,
                //         "documentedId": req.tokenData.userId || "",
                //         "documentedBy": req.tokenData.userName || ""
                //     }
                // };
                // _cloneBw.updateOne.update.$set = {
                //     "audit.modifiedById": req.tokenData.userId,
                //     "audit.modifiedBy": req.tokenData.displayName,
                //     "audit.modifiedDt": new Date().toISOString()
                // }
                // _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
                // pLoadResp.payload.pData.push(_cloneBw);
                let _patient = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", req.body)
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: result });
            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Documents Upload */
router.post("/upload-document", async (req, res) => {
    try {
        if (req.body.params.patientId && req.body.params.umr && req.body.params.docs) {
            let _patient = await commonMonogoCall("patient_care_patients", "findById", req.body.params.patientId, "", req.body)
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }
            let _clnDocs = JSON.parse(JSON.stringify(req.body.params));
            delete req.body.params.supporttedObj;
            _.each(req.body.params.docs, (_doc) => {
                let _base64data = _doc.docData.replace(/^data:.*,/, '');

                _doc["umr"] = req.body.params.umr;
                _doc["admnNo"] = req.body.params.admnNo || "";
                _doc["admnDt"] = req.body.params.admnDt || "";
                _doc["docMimeType"] = _doc.docData.split(',')[0];
                _doc["docData"] = "";
                _doc["path"] = "";
                _doc["documentedId"] = req.tokenData.userId || "";
                _doc["documentedBy"] = req.tokenData.userName || "";
                _doc["orgId"] = req.tokenData.orgId;
                _doc["locId"] = req.tokenData.locId;
                _doc["audit"] = req.body.params.audit;
                if (_doc.format == 'png' || _doc.format == 'jpg' || _doc.format == 'jpeg') {
                    _doc["docData"] = new Buffer.from(_base64data, 'base64');
                }
                else {
                    let _binaryData = Buffer.from(_base64data, 'base64');
                    let _filePath = `${req.clientUrls.orgName.replace(/\s/g, '_')}/${req.body.params.umr}`;
                    if (req.body.params.admnNo && req.body.params.admnNo.length > 0) {
                        _filePath += `/${req.body.params.admnNo}`;
                    }
                    if (_doc.surgName && _doc.surgName.length > 0) {
                        _filePath += `/${_doc.surgName.replace(/\s/g, '_')}_${moment(new Date(_doc.surgDt)).format('DD-MMM-YYYY')}`;
                    }
                    _filePath += `/${_doc.docName.replace(/\.[^/.]+$/, "").replace(/\s/g, '_')}_${Date.now()}.${_doc.format}`;
                    let _physicalPath = `${req.clientUrls.documentPhysicalPath}/${_filePath}`;
                    fse.outputFile(_physicalPath, _binaryData, 'binary')
                        .then(() => {
                            console.log('The file has been saved!');
                        })
                        .catch(err => {
                            console.error("error save", err)
                        });
                    _doc["path"] = `${req.clientUrls.documentPathUrl}/${_filePath}`;
                }
            });

            mongoMapper("patient_care_documents", "insertMany", req.body.params.docs).then(async (result) => {
                if (!(result.data && result.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                _.map(result.data, (_rObj) => {
                    _.map(_clnDocs.docs, async (_doc) => {
                        if (_rObj.docName == _doc.docName) {
                            try {
                                let _extension = _doc.docData.split(';')[0].split('/')[1];
                                let _docData = { success: false, data: [] };
                                if (_extension == 'png' || _extension == 'jpg' || _extension == 'jpeg') {
                                    _docData = await compressDocument(_doc.docData, _doc.docName);
                                }
                                else {
                                    _docData.success = true;
                                    _docData.data = "";
                                    _docData.name = _doc.docName;
                                }
                                let _mimeType = await _doc.docData.split(',')[0];
                                if (_docData.success && _doc.docName == _docData.name) {
                                    let _patObj = {
                                        params: {
                                            _id: _clnDocs.patientId,
                                            document:
                                            {
                                                docId: _rObj._id || "",
                                                admNo: req.body.params.admnNo || "",
                                                admnDt: req.body.params.admnDt || "",
                                                docName: _doc.docName,
                                                docType: _doc.docType,
                                                format: _doc.format,
                                                docData: _docData.data,
                                                docMimeType: _mimeType,
                                                remarks: _doc.remarks,
                                                isImage: _doc.isImage,
                                                path: _rObj.path || "",
                                                surgId: _doc.surgId,
                                                surgName: _doc.surgName,
                                                surgDt: _doc.surgDt,
                                                documentedId: req.tokenData.userId || "",
                                                documentedBy: req.tokenData.userName || ""
                                            }
                                        }
                                    }
                                    if (_doc.followupId && _doc.followupNo) {
                                        _patObj.params.document.followupId = _doc.followupId || "";
                                        _patObj.params.document.followupNo = _doc.followupNo || "";
                                        _patObj.params.document.followupOn = _doc.followupOn || "";
                                        _patObj.params.document.followupDate = _doc.followupDate || "";
                                    }
                                    let pLoadResp = { payload: {} };
                                    pLoadResp = await preparePayload('IAU', _patObj);
                                    if (!pLoadResp.success) {
                                        // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                                    }
                                    let _patUpdate = await commonMonogoCall("patient_care_patients", "updateOne", pLoadResp.payload, "", "")
                                    if (!(_patUpdate && _patUpdate.success)) {
                                        // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                                    }
                                }
                            }
                            catch (err) {

                            }
                        }
                    });
                });

                let _clnSurg = JSON.parse(JSON.stringify(_patient.data.surgeries));
                let _filteredSurgData = _.filter(_clnSurg, (_o) => { return _o._id == _clnDocs.supporttedObj.selPatSurgId });
                if (_filteredSurgData && _filteredSurgData.length > 0) {
                    if (_filteredSurgData[0].progressStatus != 'COMPLETED') {
                        let _mandStatus = _.pick(_filteredSurgData[0], 'scores', 'intraOperative', 'preOperative', 'prosthesis');
                        let _status = _.filter(_mandStatus, (_o) => { return !_o });
                        let _patObj = {
                            params: {
                                _id: _clnDocs.patientId,
                                surgeries: [{
                                    _id: _clnDocs.supporttedObj.selPatSurgId,
                                    documents: true,
                                    progressStatus: _status.length == 0 ? 'COMPLETED' : 'PENDING'
                                }]
                            }
                        };
                        let pLoadResp = { payload: {} };
                        pLoadResp = await preparePayload('BW', _patObj);
                        if (!pLoadResp.success) {
                            // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                        }
                        let _patUpdate = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", "")
                        if (!(_patUpdate && _patUpdate.success)) {
                            // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                        }
                    }
                }

                return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Upload Documents By UMR*/
router.post("/get-upload-documents-by-umr", async (req, res) => {
    try {
        if (req.body.params._id) {
            req.body.params["orgId"] = req.tokenData.orgId;
            req.body.params["locId"] = req.tokenData.locId;
            let _params = {
                filter: req.body.params,
                selectors: "document"
            }
            mongoMapper("patient_care_patients", "find", _params).then(async (result) => {
                if (!(result.data && Object.keys(result.data).length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _docs = await convertBase64ToBuffer(result.data[0]);
                if (!_docs.success) {
                    return res.status(400).json({ status: 'FAIL', desc: "Failed to convert base64 from buffer..", data: [] });
                }
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: _docs.data || [] });

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Upload Documents By id*/
router.post("/get-upload-documents-by-id", async (req, res) => {
    try {
        if (req.body.params._id) {
            mongoMapper("patient_care_documents", "findById", req.body.params._id).then(async (result) => {
                if (!(result.data)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _base64 = "";
                if (result.data.docData) {
                    _base64 = `${result.data.docMimeType},${await result.data.docData.toString("base64")}`;
                }
                let _resp = {
                    umr: result.data.umr,
                    admnNo: result.data.admnNo,
                    docName: result.data.docName,
                    docType: result.data.docType,
                    format: result.data.format,
                    remarks: result.data.remarks,
                    isImage: result.data.isImage,
                    path: result.data.path || "",
                    surgName: result.data.surgName,
                    surgDt: result.data.surgDt,
                    followupId: result.data.followupId,
                    followupNo: result.data.followupNo,
                    followupOn: result.data.followupOn,
                    followupDate: result.data.followupDate,
                    documentedBy: result.data.documentedBy,
                    documentedId: result.data.documentedId,
                    documentedDt: result.data.documentedDt,
                    docDataBase64: _base64
                };
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: _resp || [] });

            }).catch((error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Get Clinical Data */
router.post('/get-clinical-data', async (req, res) => {
    try {
        if (req.body.params && req.body.params.patientId && req.body.params.types) {
            if (req.body.params.from === 'S') {
                let _params = {
                    "IP_FLAG": "CLNDET",
                    "PAT_ID": req.body.params.patientId,
                    "IP_TYPE": req.body.params.types,
                    "IP_ORG_ID": req.tokenData.orgId,
                    "IP_LOC_ID": req.tokenData.locId
                };
                axios.post(req.clientUrls.apkApiUrl + "/getIpClinicalData", _params).then(async function (response) {
                    let logObj = {};
                    if (response && response.SQL_ERROR) {
                        return res.status(400).json({ status: 'FAIL', desc: response.SQL_ERROR });
                    }
                    else {
                        //   const onlyLogArr = ['DIAGNOSIS', 'DOCTORHANDOVER', 'INVESTIGATIONS', 'MEDICATIONS', 'DISCHRGSUMNAME', 'DISCHRGSUMMDET', 'PROCEDURERECORD', 'IOCHART', 'ICDCODING', 'VITALS', 'ALLERGIES', 'CHIEFCOMPLAINTS', 'NURSENOTES', 'DOCTORNOTES', 'SURGEONOPNOTES', 'PREOPANSTH', 'IMMPREOP', 'COVIDVIDEO', 'IOCHARTSUM'];
                        const onlyLogArr = ['DIAGNOSIS', 'IPDSCHRGSMED', 'VITALS'];
                        let verArr = {};

                        if (response && Object.keys(response).length > 0) {
                            response = response.data;
                            for (let set in response) {
                                if (response[set] && response[set].length > 0) {
                                    if (onlyLogArr.indexOf(response[set][0].IP_CLINICAL_TYPE) > -1) {
                                        verArr[response[set][0].IP_CLINICAL_TYPE] = response[set];
                                    }
                                    else if (onlyLogArr.indexOf(response[set][0].OP_CLINICAL_TYPE) > -1) {
                                        verArr[response[set][0].OP_CLINICAL_TYPE] = response[set];
                                    }
                                    else if (onlyLogArr.indexOf(response[set][0].IPOP_CLINICAL_TYPE) > -1) {
                                        verArr[response[set][0].IPOP_CLINICAL_TYPE] = response[set];
                                    }

                                }
                            }
                        }
                        _.each(onlyLogArr, async (obj) => {
                            let sourceArr = [];
                            if (verArr[obj]) {
                                try {
                                    let baseMap = fetchTransformColumns("getIpClinicalData", obj);
                                    sourceArr = transform(verArr[obj], baseMap);
                                }
                                catch (err) {
                                    console.log(err)
                                }
                            }
                            if (obj === "IPDSCHRGSMED") {
                                let _lblData = generateDischargeSumReport(sourceArr);
                                if (_lblData.success) {
                                    sourceArr = _lblData.data;
                                }
                            }
                            if (obj === "MEDICATIONS") {
                                logObj[obj] = ((obj === "MEDICATIONS") ? (columnsTrnsformation(sourceArr) || []) : (sourceArr || []));
                                logObj[obj].reverse();
                            }
                            else if (obj === "DIAGNOSIS") logObj[obj] = ((obj === "DIAGNOSIS") ? (columnsTrnsformation(sourceArr) || []) : (sourceArr || []));
                            else logObj[obj] = (sourceArr || []);

                        });
                        verArr = response = null;
                        let _params = {
                            filter: { "_id": req.body.params._id },
                            selectors: "emrClinicalInfo"
                        }
                        let _patient = await commonMonogoCall("patient_care_patients", "find", _params, "", req.body)
                        if (Object.keys(logObj).length > 0 && _patient.success && _patient.data && _patient.data[0] && Object.keys(_patient.data[0]).length > 0) {
                            let _payload = {
                                by: { "_id": req.body.params._id, "emrClinicalInfo._id": _patient.data[0].emrClinicalInfo._id },
                                query: { "emrClinicalInfo.documentedBy": req.tokenData.userName, "emrClinicalInfo.documentedDt": new Date().toISOString(), "emrClinicalInfo.visits": logObj }
                            }
                            let _patUpdate = await commonMonogoCall("patient_care_patients", "findOneAndReplace", _payload, "", "")
                            if (!(_patUpdate && _patUpdate.success)) {
                                // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                            }
                        }
                        logObj["lastUpdatedDt"] = new Date().toISOString();
                        return res.status(200).json({ status: 'SUCCESS', desc: '', data: logObj || [] });
                    }

                }).catch(function (ex) {
                    return res.status(400).json({ status: 'FAIL', desc: ex, data: [] });
                });
            }
            else {
                let _params = {
                    filter: { "_id": req.body.params._id },
                    selectors: "emrClinicalInfo"
                }
                let _clinicalInfo = await commonMonogoCall("patient_care_patients", "find", _params, "", req.body)
                if (!(_clinicalInfo && _clinicalInfo.success && _clinicalInfo.data && _clinicalInfo.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: _clinicalInfo.desc || "", data: _clinicalInfo.data || [] });
                }
                else {
                    let _resp = {};
                    if (_clinicalInfo.data[0].emrClinicalInfo && _clinicalInfo.data[0].emrClinicalInfo.visits) {
                        _resp["lastUpdatedDt"] = _clinicalInfo.data[0].emrClinicalInfo.documentedDt;
                        _.each(_clinicalInfo.data[0].emrClinicalInfo.visits, (_oBj, _oKey) => {
                            _resp[_oKey] = _oBj;
                        });
                    }
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: _resp || {} });
                }
            }
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    }
    catch (ex) {
        return res.status(500).json({ status: 'FAIL', desc: ex });
    }
});

/* Get Lab Results */
router.post('/get-lab-results', async (req, res) => {
    try {
        if (req.body.params && req.body.params._id && req.body.params.umr) {
            if (req.body.params.from === 'S') {
                if (!req.clientUrls.hisSyncUrls && req.clientUrls.hisSyncUrls.length > 0) {
                    return res.status(500).json({ status: 'FAIL', desc: "No API url found to fetch data" });
                }

                let method = "syncApptData";
                let _dateFormate = "DD-MMM-YYYY";
                // if (req.clientUrls.locId === 1088) {
                //     req.body.params.umr = "2018001238"
                // }
                let lkUpPrms = {};
                let params = {};
                if (req.body.params.flag === "ALL") {
                    params = `LkUpName=HIST&LkUpPrms={"EMR":[{"UMR_NO":"${req.body.params.umr}","TEST_ID":"","FROM_DT":"","TO_DT":"","PARAMETER_ID":"","REF_TYPE":"B","ADMN_NO":"","CULTURE_REPORT":"Y"}] }&LkUpPrmsaddl="`
                }
                else if (req.body.FROM_DT && req.body.TO_DT) {
                    params = `LkUpName=HIST&LkUpPrms={"EMR":[{"UMR_NO":${req.body.params.umr},"TEST_ID":"","FROM_DT":${req.body.params.fromDt},"TO_DT":${req.body.params.toDt},"PARAMETER_ID":"","REF_TYPE":"","ADMN_NO":""}] }&LkUpPrmsaddl="`
                }
                else {
                    params = `LkUpName=HIST&LkUpPrms={"EMR":[{"UMR_NO":${req.body.params.umr},"TEST_ID":"","FROM_DT":${moment(new Date(new Date().setFullYear(new Date().getFullYear() - 1))).format(_dateFormate)},"TO_DT":${moment(Date.now()).format(_dateFormate)},"PARAMETER_ID":"","REF_TYPE":"B","ADMN_NO":"","CULTURE_REPORT": "Y"}] }&LkUpPrmsaddl="`
                };
                //console.log("params", req.clientUrls.hisSyncUrls, params)
                let _labData = await getLabResults(req.clientUrls.hisSyncUrls, method, params);
                if (!(_labData.success)) {
                    return res.status(500).json({ status: 'FAIL', desc: "No Data available at HIMS.." });
                }
                // let data = _util.xml2JSON(_labData, 'string').data;
                let _temp = [];
                let _ignoreList = ["ULS", "MRI", "RAD", "CTS", "XRY", "CAR"];
                console.log("_labData.data", _labData.data);
                _labData.data.forEach(function (eitem, index) {
                    if (_ignoreList.indexOf(eitem.SERVICEGROUPCD) > -1) {
                        _temp.push(eitem);
                    }
                    else {
                        if (eitem.ISVERIFIED.toUpperCase() == 'Y') {
                            _temp.push(eitem);
                        }
                    }
                });
                let data = JSON.parse(JSON.stringify(_temp));
                let _clnData = JSON.parse(JSON.stringify(_temp));
                let results = {
                    gridView: [],
                    trendView: []
                };
                // if (req.body.params.view && req.body.params.view === 'T') {
                let _ = __;
                let _scrollColumn = [];
                let _maxDays = 3;
                let _checkIndex = 0;
                let _parentCindex = 0;
                let _prepareHeaderRows = [];
                let _availDays = [];
                let _prepareDefaultRows = [];
                let _colors = ["#eec8ff", "#00ff00", "#ffff00", "#ff00ff", "#f7f7f7", "#0000ff"];
                let _finalData = [];
                let result = [];
                // console.log("req.clientUrls", req.clientUrls.labParams, data);
                // for (let i in req.clientUrls.labParams) {
                //     console.log("req.clientUrls.labParams[i].PARAMETERCD", req.clientUrls.labParams[i].PARAMETERCD, e.PARAMETERCD)
                //     result = data.filter(e => e.PARAMETERCD == req.clientUrls.labParams[i].PARAMETERCD);
                //     _finalData = _finalData.concat(result);
                // }
                //  console.log("req.clientUrls", _finalData);
                //data = _finalData;
                for (let dta in data) {
                    data[dta].epochDate = moment(moment(parseInt(data[dta].REPORTDT.split('(')[1].split(')')[0])).format(), 'YYYY-MM-DD').valueOf();
                }
                data = _.sortBy(data, 'epochDate')
                data = data.reverse()

                //create EPOCH date to "CHART_DATE  
                _.each(data, function (item, index) {
                    item.__CHART_DATE_EPOCH = moment(moment(parseInt(data[index].REPORTDT.split('(')[1].split(')')[0])).format(), 'YYYY-MM-DD').valueOf();
                });
                var inc = 0;
                _.each(_.groupBy(data, "__CHART_DATE_EPOCH"), function (item, index) {
                    _.chain(_.sortBy((_.chain(item).map(function (eitem) {
                        //console.log("x---------------------", x);
                        return eitem.__CHART_DATE_EPOCH;
                    }).uniq().value()))).each(function (eItem, myindex) {
                        _prepareDefaultRows.push(
                            {
                                dateTime: item[0].__CHART_DATE_EPOCH,
                                value: "",
                                color: "",//_colors[inc]
                            }
                        );
                    });
                    _availDays.push(index);
                    inc++;
                });
                data = _.groupBy(data, function (item) {
                    return item.PARAMETERDESC;
                });
                _.each(data, function (value, key) {
                    data[key] = _.groupBy(value, function (item) {
                        return item.PARAMETERDESC;
                    });
                });

                _.each(data, function (value, index) {
                    _parentCindex = _scrollColumn.length - 1;
                    _.each(value, function (hederValue, headerIndex) {
                        _scrollColumn.push({
                            columnType: "data",
                            label: index,
                            value: JSON.parse(JSON.stringify(_prepareDefaultRows))
                        });
                        _checkIndex = 0;

                        _.each(hederValue, function (eDate, eIndex) {
                            _.where(_scrollColumn[_scrollColumn.length - 1].value,
                                { dateTime: eDate.__CHART_DATE_EPOCH })[0].value = _.clone(eDate.RESULTS) || _.clone(eDate.RESULTVALUES);
                            _.where(_scrollColumn[_scrollColumn.length - 1].value,
                                { dateTime: eDate.__CHART_DATE_EPOCH })[0].color = (eDate.DEVIATETYPE == "UPPER ABNORMAL") ? "#f44336" : (eDate.DEVIATETYPE == "LOWER ABNORMAL") ? "#2196f3" : (eDate.DEVIATETYPE == "NORMAL") ? "#4caf50" : "";
                            let mesurements = eDate.RESULTUOM ? ` (${eDate.RESULTUOM})` : "";
                            _scrollColumn[_scrollColumn.length - 1].label = `${eDate.PARAMETERDESC}${mesurements}`;
                        });
                        _checkIndex++;
                    });
                });
                results.trendView = _scrollColumn;
                //}
                //else {
                let __orderData = _.sortBy(_clnData, function (eachRecord) {
                    return -eachRecord["REPORTDT"];
                });
                let orderData = [];

                _.each(__orderData, function (item, index) {
                    orderData.push({
                        PARAMETERDESC: item.PARAMETERDESC,
                        RESULTVALUESB: item.RESULTVALUESB,
                        RESULTVALUES: item.RESULTVALUES,
                        NORMALVALUES: item.NORMALVALUES,
                        PARAMORDER: item.PARAMORDER,
                        SUBTITLEORDER: item.SUBTITLEORDER,
                        DEVIATETYPE: item.DEVIATETYPE,
                        SERVICE_CODE: item.SERVICE_CODE,
                        REPORTDT: item.REPORTDT,
                        SERVICENAME: item.SERVICENAME,
                        ACCESSIONNO: item.ACCESSIONNO || "",
                        TESTSTATUS: item.TESTSTATUS || "",
                        _date_: item.REPORTDT ? parseInt((item.REPORTDT.replace('/Date(', '')).replace(')/', '')) : ""
                    });
                });

                let _gData = _.groupBy(orderData, '_date_');
                _.each(_gData, function (a) {
                    results.gridView.push({
                        'REPORT_GENERATED_DATE': moment(a[0]['_date_']).format(_dateTimeFormate),
                        'SERVICES': _.chain(Object.values(_.groupBy(a, 'SERVICE_CODE'))).map(function (e) {
                            return {
                                'PARAMS': e,
                                'ACCESSIONNO': e[0]['ACCESSIONNO'] || "",
                                'SERVICENAME': e[0]['SERVICENAME'],
                                'TESTSTATUS': e[0]['TESTSTATUS'] || "",
                            }
                        }).value()
                    });
                });
                //console.log("result", results); 
                // }
                if (Object.keys(results.gridView).length > 0 || Object.keys(results.trendView).length > 0) {
                    let _params = {
                        filter: { "_id": req.body.params._id },
                        selectors: ""
                    }
                    let _patient = await commonMonogoCall("patient_care_patients", "find", _params, "", req.body)
                    if (_patient.success && _patient.data && _patient.data[0] && Object.keys(_patient.data[0]).length > 0) {
                        let _payload = {
                            by: { "_id": req.body.params._id, "labResults._id": _patient.data[0].labResults._id },
                            query: {
                                "labResults.documentedBy": req.tokenData.userName, "labResults.documentedDt": new Date().toISOString(), "labResults.data": results
                            }
                        }
                        let _patUpdate = await commonMonogoCall("patient_care_patients", "findOneAndReplace", _payload, "", "")
                        if (!(_patUpdate && _patUpdate.success)) {
                            // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                        }
                    }
                    let _finalResp = [{
                        "lastUpdatedDt": new Date().toISOString(),
                        "data": results
                    }];
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: _finalResp || [] });

                } else {
                    return res.status(200).json({ status: 'SUCCESS', desc: "No data available..", data: [] });
                }
            }
            else {
                let _params = {
                    filter: { "_id": req.body.params._id, "view": (req.body.params.view || "") },
                    selectors: "labResults"
                }
                let _clinicalInfo = await commonMonogoCall("patient_care_patients", "find", _params, "", req.body)
                if (!(_clinicalInfo && _clinicalInfo.success && _clinicalInfo.data && _clinicalInfo.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: _clinicalInfo.desc || "", data: _clinicalInfo.data || [] });
                }
                let _finalResp = [{
                    "lastUpdatedDt": _clinicalInfo.data[0].labResults.documentedDt,
                    "data": _clinicalInfo.data[0].labResults.data
                }]
                return res.status(200).json({ status: 'SUCCESS', desc: '', data: _finalResp || [] });
            }
        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
        }
    }
    catch (err) {
        console.log("err", err);
        return res.status(500).json({ status: 'FAIL', desc: err });
    }
});


/**Insert Role */
router.post("/insert-role", async (req, res) => {
    try {
        _.each(req.body.params, (_o, _k) => {
            _o.orgId = req.tokenData.orgId;
            _o.audit = req.body.params.audit;
        });
        delete req.body.params.audit;
        mongoMapper('patient_care_roles', req.body.query, req.body.params).then((result) => {
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
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("patient_care_roles", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Role */
router.post("/update-role", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("patient_care_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('patient_care_roles', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                delete _cBody.params.audit;
                pLoadResp = await preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }

            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$set = {
                "audit.modifiedById": req.tokenData.userId,
                "audit.modifiedBy": req.tokenData.displayName,
                "audit.modifiedDt": new Date().toISOString()
            }
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
            pLoadResp.payload.pData.push(_cloneBw);
            mongoMapper('patient_care_roles', 'bulkWrite', pLoadResp.payload).then(async (result) => {
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


/**Insert Employee */
router.post("/insert-user", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "locations");
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Users' }, "patient_care", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["cd"] = _seqResp.data;
            mongoMapper('patient_care_users', "insertMany", req.body.params).then(async (result) => {
                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert User`, data: [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Missing Required Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


/* get all Employee */
router.post("/get-user", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": true
            },
            "selectors": {
                "orgId": "$orgId",
                "cd": "$cd",
                "recStatus": "$recStatus",
                "empTypeId": "$empTypeId",
                "empTypeName": "$empTypeName",
                "titleCd": "$titleCd",
                "titleName": "$titleName",
                "fName": "$fName",
                "mName": "$mName",
                "lName": "$lName",
                "dispName": "$dispName",
                "gender": "$gender",
                "genderCd": "$genderCd",
                "dob": "$dob",
                "emailID": "$emailID",
                "photo": "$photo",
                "joinDt": "$joinDt",
                "adharNo": "$adharNo",
                "passport": "$passport",
                "userName": "$userName",
                "userCd": "$userCd",
                "password": "$password",
                "phone": "$phone",
                "mobile": "$mobile",
                "address1": "$address1",
                "address2": "$address2",
                "areaCd": "$areaCd",
                "area": "$area",
                "cityCd": "$cityCd",
                "city": "$city",
                "stateCd": "$stateCd",
                "state": "$state",
                "countryCd": "$countryCd",
                "country": "$country",
                "zipCd": "$zipCd",
                "locations": {
                    $filter: {
                        input: "$locations",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "revNo": "$revNo"
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("patient_care_users", "find", _pGData.data).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});



/**Update Employee */
router.post("/update-user", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("patient_care_users", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('patient_care_users', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.locations) {
                    _.each(_cBody.params.locations, (_l) => {
                        if (_l._id) {
                            _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                            _l["history"] = {
                                "revNo": _hResp.data[0].revNo,
                                "revTranId": _hResp.data[0]._id
                            }
                        }
                        else {
                            _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                        }
                    });
                }
                // _cBody.params["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('patient_care_users', 'bulkWrite', pLoadResp.payload).then(async (result) => {
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


/** Insert Document */
router.post("/insert-form", async (req, res) => {
    try {
        req.body.params.orgId = req.tokenData.orgId;
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Forms' }, "patient_care", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["cd"] = _seqResp.data;
        mongoMapper('patient_care_forms', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get Documents */
router.post("/get-forms", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("patient_care_forms", "find", _pGData.data).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Documents */
router.post("/update-form", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("patient_care_forms", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('patient_care_forms', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
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
            mongoMapper('patient_care_forms', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Insert Counter */
router.post("/insert-counter", async (req, res) => {
    try {
        req.body.params.locId = req.tokenData.locId;
        req.body.params.locName = req.tokenData.locName;
        mongoMapper('patient_care_counters', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/** Insert fileds */
router.post("/insert-field-management", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            _.each(req.body.params, (_obj) => {
                _obj['audit'] = req.body.params.audit;
                _obj['orgId'] = req.tokenData.orgId
                _obj['locId'] = req.tokenData.locId
            });
            mongoMapper('patient_care_fieldsmanagement', req.body.query, req.body.params).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get fields */
router.post("/get-field-management", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history"
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("patient_care_fieldsmanagement", "find", _pGData.data).then((result) => {
                _.each(result.data, (obj, ind) => {
                    obj.fields = _.sortBy(obj.fields, function (o) { return o.orderNo })
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update fields */
router.post("/update-field-management", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("patient_care_fieldsmanagement", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('patient_care_fieldsmanagement', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }
            }
            mongoMapper('cm_fieldsmanagement', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


/* get all Entity */
router.post("/get-entity", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history -child.audit -child.history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("patient_care_entity", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Logout */
router.post("/logout", async (req, res) => {
    try {
        if (!(req.headers['sessionid'])) {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
        // let _filter = {
        //     "filter": {
        //         '_id': req.headers['sessionid'],
        //         "recStatus": { $eq: true }
        //     },
        //     "selectors": ""
        // }
        // let _sessionData = await commonMonogoCall("patient_care_usersessions", "findOne", _filter, "", req.body);
        // if (!(_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data._id)) {
        //     return res.status(401).json({ status: 'FAIL', desc: "No user data was found..", data: [] });
        // }
        let _tknObj = {
            params: {
                _id: req.headers['sessionid'],
                token: "",
                logOutTime: new Date().toISOString(),
                recStatus: false
            }
        }
        _tknObj.params["audit.modifiedBy"] = req.tokenData.displayName;
        _tknObj.params["audit.modifiedById"] = req.tokenData.userId;
        _tknObj.params["audit.modifiedDt"] = new Date().toISOString();
        let pLoadResp = { payload: {} };
        pLoadResp = await preparePayload('U', _tknObj);
        if (!pLoadResp.success) {
            return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
        }
        mongoMapper("patient_care_usersessions", "findOneAndUpdate", pLoadResp.payload).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', code: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', code: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', code: 500, desc: error });
    }
});


/* get Users */
router.post("/get-all-surgeries-list", async (req, res) => {
    try {
        if (!(req.body.params && req.body.params.fromDt && req.body.params.endDt)) {
            return res.status(400).json({ success: false, status: 400, desc: "Missing Required Parameters ..", data: [] });
        }
        let _filter = {
            "filter": [
                { $unwind: "$admns" },
                { $unwind: "$admns.surgDtls" },
                {
                    $match: {
                        "admns.surgDtls.audit.documentedDt": {
                            $gte: new Date(new Date(req.body.params.fromDt).setUTCHours(0, 0, 0, 0)).toISOString(),
                            $lt: new Date(new Date(req.body.params.endDt).setUTCHours(23, 59, 59, 999)).toISOString()
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        umr: { "$first": "$umr" },
                        dg: { $first: "$dg" },
                        admnNo: { $first: "$admns.admNo" },
                        admnDt: { $first: "$admns.admDt" },
                        surgDtls: { $push: "$admns.surgDtls" }
                    }
                }
            ]
        }
        mongoMapper("patient_care_surgeries", "aggregation", _filter).then((result) => {
            if (result.data.length > 0) {

                let _surgeryData = [];
                _.each(result.data, (_o) => {
                    let _surgObj = {
                        umr: _o.umr,
                        admnNo: _o.admnNo,
                        admnDt: _o.admnDt,
                        patName: _o.dg.dispName ? _o.dg.dispName : "",
                        gender: _o.dg.gen ? _o.dg.gen : "",
                        dob: _o.dg.dob ? _o.dg.dob : "",
                        addr: _o.dg.addr ? _o.dg.addr : "",
                        mob: _o.dg.mob ? _o.dg.mob : "",
                        city: _o.dg.city ? _o.dg.city : "",
                        isNri: _o.dg.isNri ? _o.dg.isNri : "",
                        state: _o.dg.state ? _o.dg.state : "",
                        zipcode: _o.dg.zipcode ? _o.dg.zipcode : "",
                    };

                    _.each(_o.surgDtls, (_s) => {
                        let _clnSurgObj = JSON.parse(JSON.stringify(_surgObj));
                        _.each(_s, (_v, _k) => {
                            if (_v.constructor.name === 'Object') {
                                _.each(_v, (_cv, _ck) => {
                                    _clnSurgObj[`${_k}.${_ck}`] = _cv;
                                });
                            }
                            else {
                                _clnSurgObj[_k] = _v;
                            }
                        });
                        _surgeryData.push(_.merge(_clnSurgObj, _s));
                    })
                });
                return res.status(200).json({ success: false, status: 200, desc: ``, data: _surgeryData || [] });
            }
            else {
                return res.status(200).json({ success: true, status: 200, desc: 'user not exist', data: [] });
            }

        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


module.exports = router;
const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const axios = require("axios");
const _mUtils = require("../../../constants/mongo-db/utils");
const { transform } = require('node-json-transform');
const imageThumbnail = require('image-thumbnail');
const moment = require('moment');

const _transformapi = require('../patientcare/transformation');
const _token = require("../../../services/token");
const _util = require("../../../utilities/is-valid")
const model = require("../../../db-config/helper-methods/mongo/preparePayload");

const _orgDetails = require("../patientcare/constants/organizations");

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
    return await _token.createTokenWithExpire(_data, "9000000ms");
};

/* Base64 Compress */
async function compressDocument(_base64, _name) {
    try {
        return new Promise(async (resolve, reject) => {
            let options = { percentage: 25 }
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
                let _base64 = `${_doc.docMimeType},${await _doc.docData.toString("base64")}`;
                let _resp = {
                    umr: _data.umr,
                    admNo: _doc.admNo,
                    docId: _doc.docId,
                    docName: _doc.docName,
                    docType: _doc.docType,
                    format: _doc.format,
                    remarks: _doc.remarks,
                    documentedBy: _doc.documentedBy,
                    documentedId: _doc.documentedId,
                    documentedDt: _doc.documentedDt,
                    docDataBase64: _base64
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
router.post("/auth-user", async (req, res) => {
    try {
        let finalData;
        if (req.body && req.body.uName && req.body.pwd) {
          
           // let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
            // if (!(_orgDtls && _orgDtls.length > 0)) {
            //     return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            // }
          
            let _userDtls = _.filter(_users, (o) => {
                    _.filter(o.users,(oData,oIndx)=>{
                        if( oData.userName == req.body.uName && oData.pwd == req.body.pwd ){
                            finalData=oData
                           
                        }
                    })
            });
           // console.log("finalData",finalData.length)
            if ( finalData ==undefined || finalData ==null ) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
            }
            let _user = {
                 "createdDt": new Date(), "userId": finalData.userId, "userName": finalData.userName,"permissions": ["1102"],
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
            console.log("_payload.by ", _payload.by)

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
            //     modifiedByBy: req.tokenData.userName,
            //     modifiedByDt: new Date().toISOString()
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

/** Common Mongo Function */
async function commonMonogoCall(_method, _query, _params, _flag, _body, _filter) {
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
                            _body.params.audit = result.data.audit;
                            resolve({ success: true, data: _body || [] })
                        }
                        else {
                            let _revHist = (result.data && result.data.revHist) ? result.data.revHist.sort().reverse()[0] : "";
                            resolve({
                                success: false,
                                data: [{
                                    "modifiedBy": _revHist.documentedBy || "",
                                    "modifiedDt": _revHist.documentedDt || ""
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
                console.log("error", error)
                resolve({ success: false, data: [], desc: `Error occured While executing proc, Error:- ${error}` })
            });
        })
    }
    catch (err) {
        return { success: false, data: [], desc: `Error occured, Error:- ${err}` }
    }
};

/*Insert History Data */
async function insertHistoryData(_method, _mParams, _body, req) {
    try {
        return new Promise(async (resolve, reject) => {
            let _payload = await model.prepare(_method);
            if (!(_payload && _payload.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error:- ${_payload.desc}` });
            }
            let _hParams = {
                tranId: _mParams._id,
                method: _method,
               // collectionName: _payload.data.coll,
                audit: {
                    documentedById: req.tokenData.userId,
                    documentedBy: req.tokenData.userName,
                    documentedDt: _mParams.audit.documentedDt,
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.userName
                },
                revNo: _body.revNo,
                history: _body
            }
            console.log("_hParams", _hParams)
            let _mResp = await commonMonogoCall("monography_histories", "insertMany", _hParams)
            if (!(_mResp && _mResp.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error:- ${_mResp.desc}` });
            }
            resolve({ success: true, data: _mResp.data, desc: `` });
        });
    }
    catch (err) {
        return { success: false, data: [], desc: `Error occured, Error:- ${err}` }
    }
}

/* Insert Levels Data */
router.post("/insert-level", async (req, res) => {
    try {  
        mongoMapper('monography_levels', req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
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
        mongoMapper("monography_levels", req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
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
                if (_cBody.params.locations) {
                    _.each(_cBody.params.locations, (_l) => {
                        if (_l._id) {
                            _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                        }
                        else {
                            _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                        }
                    });
                }
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
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_roles", req.body.query, req.body.params,req.tokenData.orgKey).then((result) => {
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
            let _mResp =    await _mUtils.commonMonogoCall("monography_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
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
        mongoMapper('monography_users', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400,desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Users */
router.post("/get-users", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id":req.body.params._id },
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
            let _mResp =    await _mUtils.commonMonogoCall("monography_users", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
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
router.post("/insert-drugCreation", async (req, res) => {
    try {
        mongoMapper('monography_drugCreation', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all drugCreation */
router.post("/get-drugData", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_drugCreation", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/update-drugCreation", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp =    await _mUtils.commonMonogoCall("monography_drugCreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
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
          mongoMapper('monography_userAssign', req.body.query, req.body.params).then((result) => {
               
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
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
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
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


/**insert Templates */
router.post("/insert-template", async (req, res) => {
    try { 
        mongoMapper('monography_templates', req.body.query, req.body.params).then((result) => {
            
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/get-template", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        let _id="642ea9b76b3fd6884b63e301"
        mongoMapper("monography_templates", "findById", _id, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});











/* Update Patient Details */
router.post("/updateLevelDetails", async (req, res) => {
    try {
        let _patient = await commonMonogoCall("insertLevelData", "findById", req.body.params._id, "REVNO", req.body)
        console.log("_patient", _patient)
        if (!(_patient && _patient.success)) {
            return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
        }

        let pLoadResp = { payload: {} };
        pLoadResp = await preparePayload(req.body.flag, _patient.data);
        console.log("pLoadResp", pLoadResp)
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
        _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id };
        pLoadResp.payload.pData.push(_cloneBw);
        mongoMapper('insertPatientData', 'bulkWrite', pLoadResp.payload).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/*get all patient surgeries*/
router.post("/get-patient-all-surgeries", async (req, res) => {
    try {
        mongoMapper("getPatientById", req.body.query, req.body.params).then((result) => {
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
            let _surgery = await commonMonogoCall("insertSurgeryData", "findOne", _filter, "", req.body)
            if (!(_surgery && _surgery.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _surgery.desc || "", data: _surgery.data || [] });
            }
            if (!_surgery.data.umr) {
                req.sParams = { "admnNo": req.body.params.admns[0].admNo };
                req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                req.sParams["patientId"] = req.body.params.patientId;
                _query = "insertMany";
                req.body.params["orgId"] = req.tokenData.orgId;
                req.body.params["locId"] = req.tokenData.locId;
                req.body.params["documentedId"] = req.tokenData.userId || "";
                req.body.params["documentedBy"] = req.tokenData.userName || "";
                req.body.params.admns[0]["documentedId"] = req.tokenData.userId || "";
                req.body.params.admns[0]["documentedBy"] = req.tokenData.userName || "";
                req.body.params.admns[0].surgDtls["revHist"] = {
                    "revNo": 0,
                    "documentedId": req.tokenData.userId || "",
                    "documentedBy": req.tokenData.userName || ""
                }
                req.body.params.admns[0].surgDtls["documentedId"] = req.tokenData.userId || "";
                req.body.params.admns[0].surgDtls["documentedBy"] = req.tokenData.userName || "";
                _params = req.body.params;
            }
            else {
                req.body.params["_id"] = _surgery.data._id;
                let _admn = _.filter(_surgery.data.admns, function (o) { return o.admNo == req.body.params.admns[0].admNo });
                if (_admn.length > 0) {
                    req.body.params["admns"][0]._id = _surgery.data.admns[0]._id;
                }
                let pLoadResp = { payload: {} };
                if (req.body.params["admns"][0].surgDtls && req.body.params["admns"][0].surgDtls.length > 0 && req.body.params["admns"][0].surgDtls[0]._id) {
                    req.sParams = { "admnNo": req.body.params.admns[0].admNo };
                    req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                    req.sParams["patientId"] = req.body.params.patientId;
                    pLoadResp = await preparePayload('U', req.body);
                }
                else {
                    req.sParams = { "admnNo": req.body.params.admns[0].admNo };
                    req.sParams["surgDtls"] = req.body.params.admns[0].surgDtls;
                    req.sParams["patientId"] = req.body.params.patientId;
                    let _cloneBody = JSON.parse(JSON.stringify(req.body.params)); //clone

                    delete req.body.params.admns[0].surgDtls;
                    if (req.body.params["admns"][0]._id) {
                        pLoadResp = await preparePayload('U', req.body);
                    }
                    else {

                        delete req.body.params.documentedBy;
                        delete req.body.params.documentedId;
                        delete req.body.params.patientId;
                        delete req.body.params.umr;

                        pLoadResp = await preparePayload('AE', req.body);
                    }

                    _cloneBody.admns[0].surgDtls["revHist"] = {

                        "revNo": 0,
                        "documentedId": req.tokenData.userId || "",
                        "documentedBy": req.tokenData.userName || ""
                    }
                    _cloneBody.admns[0].surgDtls["documentedId"] = req.tokenData.userId || "";
                    _cloneBody.admns[0].surgDtls["documentedBy"] = req.tokenData.userName || "";
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
            mongoMapper('insertSurgeryData', _query, _params).then(async (result) => {
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
                        let _surgData = _.filter(_admns[0].surgDtls, function (o) { return o.documentedId == req.tokenData.userId && o.surgery == req.sParams.surgDtls.surgery && o.type == req.sParams.surgDtls.type && o.ps == req.sParams.surgDtls.ps });
                        if (_surgData && _surgData.length > 0) {
                            let _patObj = {
                                params: {
                                    _id: req.sParams.patientId,
                                    surgeries:
                                    {
                                        admn: req.sParams.admnNo,
                                        surgId: _surgData[0]._id || "",
                                        surgName: `${_surgData[0].surgery}  ${_surgData[0].type}  ${_surgData[0].ps}`,
                                        surgery: _surgData[0].surgery,
                                        type: _surgData[0].type,
                                        ps: _surgData[0].ps,
                                        route: _surgData[0].route,
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
                            let _surgUpdate = await commonMonogoCall("insertPatientData", "updateOne", pLoadResp.payload, "", "")
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
            mongoMapper("insertPatientData", "find", _filter).then((result) => {
                if (!(result.data && result.data[0] && result.data[0]._id && result.data[0].surgeries && result.data[0].surgeries.length > 0)) {
                    return res.status(200).json({ status: 'SUCCESS', desc: "No Records are available.." || error, data: [] });
                }
                let _data = JSON.parse(JSON.stringify(result.data[0].surgeries));
                _.each(_data, (_sObj) => {
                    _sObj["umr"] = result.data.umr;
                    _sObj["fName"] = result.data.fName;
                    _sObj["mName"] = result.data.mName;
                    _sObj["lName"] = result.data.lName;
                    _sObj["gender"] = result.data.gender;
                    _sObj["dob"] = result.data.dob;
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
            mongoMapper("insertSurgeryData", "findOne", _params).then((result) => {
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
            let _surgery = await commonMonogoCall("insertSurgeryData", "findOne", _filter, "", req.body);
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

            let pLoadResp = { payload: {} };
            pLoadResp = await preparePayload(req.body.flag, req.body);
            if (!pLoadResp.success) {
                return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
            }
            let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
            _cloneBw.updateOne.update.$push = {
                "admns": {
                    "surgDtls": {
                        "revHist": {
                            "revNo": req.body.params.admns[0].surgDtls[0].revNo,
                            "documentedId": req.tokenData.userId || "",
                            "documentedBy": req.tokenData.userName || ""
                        }
                    }
                }
            }
            _cloneBw.updateOne.filter = { "_id": pLoadResp.payload._id, "admns._id": _surgery.data.admns[0]._id, "admns.surgDtls._id": _sData[0]._id };
            pLoadResp.payload.pData.push(_cloneBw);
            mongoMapper('insertSurgeryData', 'bulkWrite', pLoadResp.payload).then((result) => {
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





module.exports = router;
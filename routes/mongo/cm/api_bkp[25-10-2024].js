const router = require("express").Router();
const _ = require('lodash');
const moment = require('moment');
const fs = require("fs")
const fse = require('fs-extra');
const imageThumbnail = require('image-thumbnail');
const CryptoJS = require("crypto-js");
const mongoose = require('mongoose');
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _token = require("../../../services/token");
const _mUtils = require("../../../constants/mongo-db/utils");
const _orgDetails = require("./const/organizations");
const _defaults = require("./const/defaults");

const _json_data = require("./const/diabetic-master.json")

let _queries = ["find", "findById", "findOne", "insertMany", "updateOne", "bulkWrite"];
let _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';

const _secretKey = 'S0ftHe@lth$123SUv@$n@Tech8%#!(%';

/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "1200000ms");
};

/**Default Documents insert */
async function insertDefaultData(_data, _idx, _output, _dbType, _orgData, _sessionId) {
    try {
        if (_data.length > _idx) {
            _.each(_data[_idx].data, (_o) => {
                _o.orgId = _orgData._id;
            });
            if (_data[_idx].depColl && _data[_idx].depColl.length == 0) {
                let _mResp = await _mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", _data[_idx].data, "", "", "", _dbType);
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, type: _data[_idx].type, desc: _mResp.desc || "", data: [] });
                }
                else {
                    _output.push({ success: true, type: _data[_idx].type, desc: "", data: _mResp.data || [] })
                }
            }
            else {
                if (_data[_idx].type === "ROLES") {
                    let _filter = {
                        "filter": { "orgId": _orgData._id },
                        "selectors": "-audit -history"
                    }
                    let _mResp = await _mUtils.commonMonogoCall("cm_documents", "find", _filter, "", "", "", _dbType)
                    if (!(_mResp && _mResp.success)) {
                        _output.push({ success: false, type: _data[_idx].type, desc: _mResp.desc || "", data: [] });
                    }
                    else {
                        let _docs = [];
                        _.each(_mResp.data, (_d) => {
                            _docs.push({
                                documentId: _d._id,
                                documentCd: _d.cd,
                                groupCd: _d.groupCd,
                                groupName: _d.groupName,
                                iconClass: _d.iconClass,
                                documentName: _d.docmntName,
                                docmntUrl: _d.docmntUrl,
                                isMulti: _d.isMulti,
                                reportUrl: _d.reportUrl,
                                access: {
                                    read: true,
                                    write: true,
                                    delete: true,
                                    print: true,
                                    adendum: true,
                                    signOff: true,
                                    rework: false,
                                    fileUpload: true
                                }
                            });
                        });
                        let _params = {
                            orgId: _orgData._id,
                            cd: "PRACTICE_ADMIN",
                            label: "Practice Admin",
                            docmntMap: _docs,
                            sessionId: _sessionId
                        }
                        let _mResp1 = await _mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", _params, "", "", "", _dbType)
                        if (!(_mResp1 && _mResp1.success)) {
                            _output.push({ success: false, type: _data[_idx].type, desc: _mResp1.desc || "", data: [] });
                        }
                        else {
                            _output.push({ success: true, type: _data[_idx].type, desc: "", data: _mResp1.data || [] })
                        }
                    }
                }
            }
            _idx = _idx + 1;
            await insertDefaultData(_data, _idx, _output, _dbType, _orgData, _sessionId);
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

/*User Insert */
async function insertAndUpdateUser(type, req, empData) {
    return new Promise(async (resolve, reject) => {
        try {
            if (type === "I") {
                let userData = {
                    orgId: req.tokenData.orgId,
                    empId: empData._id,
                    userName: req.body.params.userName,
                    password: req.body.params.password,
                    displayName: req.body.params.dispName,
                    sessionId: req.body.params.sessionId,
                    locations: [],
                    audit: req.cAudit
                };
                _.each(empData.loc, (_lo, _li) => {
                    let _userDataFromEmp = {
                        locId: _lo.locId,
                        locName: _lo.locName,
                        roleId: _lo.roleId,
                        role: _lo.roleName,
                        audit: req.cAudit
                    }
                    userData.locations.push(_userDataFromEmp)
                })
                if (empData.loc.defLoc) {
                    userData["defaultLocId"] = empData.loc.locId;
                }
                let _mResp = await _mUtils.commonMonogoCall("cm_users", "insertMany", userData, "", "", "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    resolve({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
                }
                else {
                    resolve({ success: true, status: 200, desc: "", data: _mResp.data || [] });
                }
            }
            else if (type === "U") {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "empId": empData._id
                    },
                    "selectors": "-history"
                }
                let _mResp = await _mUtils.commonMonogoCall("cm_users", "find", _filter, "", "", "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    let _resp = await insertAndUpdateUser("I", req, empData);
                    if (!(_resp && _resp.success)) {
                        resolve({ success: false, status: 400, desc: _resp.desc || "", data: [] });
                    }
                    else {
                        resolve({ success: true, status: 200, desc: "", data: _resp.data || [] });
                    }
                }
                if (empData.flag == 'D') {
                    let _uParams = {
                        params: {
                            "_id": _mResp.data[0]._id,
                            "recStatus": false
                        }
                    };
                    let pLoadResp = { payload: {} };
                    pLoadResp = await _mUtils.preparePayload('BW', _uParams);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
                    }
                    let userDeactivate = await _mUtils.commonMonogoCall("cm_users", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                    if (!(userDeactivate && userDeactivate.success && userDeactivate.data)) {
                        resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: userDeactivate.data || [] });
                    } else {
                        resolve({ success: true, status: 200, desc: "User deactivated successfully", data: userDeactivate.data || [] });
                    }
                }
                else {
                    let _locations = [];
                    let _locObj = {};
                    _.each(empData.loc, (_lv, _lk) => {
                        if (_lv && _lk !== 'recStatus') {
                            if (_lk === 'roleName') {
                                _locObj['role'] = _lv || "";
                            }
                            else {
                                _locObj[_lk] = _lv;
                            }
                        }
                    });
                    if (Object.keys(_locObj).length > 0) {
                        _locations.push(_locObj);
                    }
                    if (empData.loc._id && empData.loc.roleId) {
                        let _fLocData = _.filter(_mResp.data[0].locations, (_lo) => { return _lo.locId.toString() == empData.loc.locId });
                        if (!(_fLocData && _fLocData.length > 0)) {
                            resolve({ success: false, status: 400, desc: `Error occurred while deactivate user..`, data: [] });
                        }
                        _locations[0]._id = _fLocData[0]._id;
                        _locations[0].recStatus = empData.loc.recStatus == false ? false : true;
                        _locations[0].audit = {};
                        _locations[0].audit["modifiedById"] = req.tokenData.userId;
                        _locations[0].audit["modifiedByBy"] = req.tokenData.displayName;
                        _locations[0].audit["modifiedByDt"] = new Date().toISOString();
                    }
                    else {
                        _locations[0].audit = req.cAudit;
                    }
                    let userData = {
                        params: {
                            _id: _mResp.data[0]._id,
                            locations: _locations,
                            revNo: _mResp.data[0].revNo,
                            audit: {
                                documentedById: _mResp.data[0].audit.documentedById,
                                documentedBy: _mResp.data[0].audit.documentedBy,
                                documentedDt: _mResp.data[0].audit.documentedDt
                            }
                        }
                    };
                    let pLoadResp = { payload: {} };
                    let _hResp = await _mUtils.insertHistoryData('cm_users', userData.params, userData.params, req, "cm");
                    userData.params.audit = {};
                    userData.params.audit["modifiedById"] = req.tokenData.userId;
                    userData.params.audit["modifiedByBy"] = req.tokenData.displayName;
                    userData.params.audit["modifiedByDt"] = new Date().toISOString();
                    userData.params.revNo = userData.params.revNo + 1;
                    userData.params["history"] = {
                        "revNo": _hResp.data[0].revNo,
                        "revTranId": _hResp.data[0]._id
                    }
                    pLoadResp = await _mUtils.preparePayload(req.body.flag, userData);
                    if (!pLoadResp.success) {
                        resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    let _uResp = await _mUtils.commonMonogoCall("cm_users", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                    if (!(_uResp && _uResp.success && _uResp.data)) {
                        resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                    }
                    else {
                        resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
                    }
                }
            }
        }
        catch (err) {
            resolve({ success: false, status: 400, desc: err.message || err, data: [] });
        }
    });
};

/*check Slots already booked or not */
async function checkIfSlotBooked(locId, docId, _apmntTime, req) {
    let _cParams = {
        "filter": {
            "docDetails.docId": docId,
            "locId": locId,
            "dateTime": _apmntTime
        },
        "selectors": "-audit -history"
    };
    let _mResp = await _mUtils.commonMonogoCall("cm_appointments", 'findOne', _cParams, "", "", "", req.tokenData.orgKey.toLowerCase());
    if (_mResp && _mResp.success == true && _mResp.data.dateTime == _apmntTime) {
        return true;//slot is already booked
    }
    else {
        return false;// slot is not booked, allowing for booking
    }

}

/*Generate Payload for Slots */
async function generateSlotsPayload(_data, _time, _duration, _cnt, _idx, _output, _coll, _method, req) {
    try {
        if (_idx < _cnt) {
            //let _apmntTime = moment(_time).add(_duration, 'm').toISOString();
            let _apmntTime = _idx === 0 ? moment(_time).toISOString() : moment(_time).add(_duration, 'm').toISOString();
            let isSlotBooked = await checkIfSlotBooked(req.tokenData.locId, _data.docDetails.docId, _apmntTime, req)
            if (isSlotBooked) {
                return { success: false, desc: "This slot is already booked. please choose another time slot.", data: [] };

            } else {
                let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Consultation' }, "cm", req);
                if (!(_seqResp && _seqResp.success)) {
                    _output.push({ success: false, type: _data[_idx].type, desc: _seqResp.desc || "", data: [] });
                }
                else {
                    let _cloneData = JSON.parse(JSON.stringify(_data));
                    _cloneData["code"] = _seqResp.data;
                    _cloneData["dateTime"] = _apmntTime;
                    _output.push({ success: true, desc: "", data: _cloneData || [] });
                }
                _idx = _idx + 1;
                await generateSlotsPayload(_data, _apmntTime, _duration, _cnt, _idx, _output, _coll, _method, req);
            }
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output || []
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

/* Insert (or) Update Multiple documents in Nested Array */
async function insertUpdateInMultiData(_data, _idx, _output, _dbType, ...cmf) {
    try {
        if (_data.params.data.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));
            if (_idx !== 0) {
                delete _cBody.params.history;
            }
            delete _cBody.params.data;
            _cBody.params.data = [];
            _cBody.params.data.push(_data.params.data[_idx]);
            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await insertUpdateInMultiData(_data, _idx, _output, _dbType, ...cmf);
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

/* Insert (or) Update Multiple documents in Nested Array */
async function insertUpdateInMultiData1(_data, _idx, _output, _dbType, ...cmf) {
    try {
        if (_data.params.lst.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));
            // if (_idx !== 0) {
            //     delete _cBody.params.history;
            // }
            // delete _cBody.params.data;
            _cBody.params.lst = [];
            _cBody.params = _data.params.lst[_idx];
            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await insertUpdateInMultiData1(_data, _idx, _output, _dbType, ...cmf);
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

/* Update Visits (or) Bills data to The Patient level */
async function updateVisitsOrBillData(_umrNo, _type, _data, req, _result) {
    try {
        return new Promise(async (resolve, reject) => {
            let _filter = {
                "filter": {
                    "recStatus": true,
                    "UMR": _umrNo
                },
                "selectors": "-history"
            }
            let _mPatResp = await _mUtils.commonMonogoCall("cm_patients", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                resolve({ success: false, data: [], desc: "Error, No patient data found.." });
            }
            let patData = {
                params: {
                    _id: _mPatResp.data[0]._id,
                    revNo: _mPatResp.data[0].revNo,
                    audit: {
                        documentedById: _mPatResp.data[0].audit.documentedById,
                        documentedBy: _mPatResp.data[0].audit.documentedBy,
                        documentedDt: _mPatResp.data[0].audit.documentedDt
                    }
                }
            };
            let pLoadResp = { payload: {} };

            let _hResp = await _mUtils.insertHistoryData('cm_patients', patData.params, patData.params, req, "cm");
            if (_type && _type === "BILLS") {

                if (Object.keys(_data).length > 0 || _data !== "") {
                    patData.params.bills = _data;
                }

                _filter.filter['outStandingDue'] = { $gt: 0 }
                let totalData = []
                let getBillsAgnstUmr = await _mUtils.commonMonogoCall("cm_bills", "find", _filter, "", "", "", req.tokenData.dbType)
                getBillsAgnstUmr.data.forEach((objects, indx) => {
                    let data = Math.abs(objects.outStandingDue) + 0;
                    totalData.push(data)
                })
                if (totalData.length > 0) {
                    patData.params.outStandingDue = _.sum(totalData)
                } else {
                    patData.params.outStandingDue = 0
                }
            }
            else if (_type && _type === "VISITS") {
                patData.params.visits = _data;
            }
            else if (_type && _type === "VISIT_TRAN") {
                patData.params.visitTrans = _data;
            }
            else if (_type && _type === "VISIT_UPD") {
                let data;
                _.each(_mPatResp.data[0].visits, (objects, index) => {
                    if (objects.visitNo === req.body.params.visitNo) {
                        data = objects
                    }
                })
                let visits = [
                    {
                        _id: data._id,
                        tranId: _data.tranId,
                        documentId: _data.documentId
                    }
                ]
                patData.params.visits = visits;
            }
            else if (_type && _type === "AAPT_UPDT") {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "code": req.body.params.visitNo
                    },
                    "selectors": "-history"
                }
                let getApmtAgstCode = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                patData = {
                    params: {
                        _id: getApmtAgstCode.data[0]._id,
                        revNo: getApmtAgstCode.data[0].revNo,
                        documentId: _data.documentId ? _data.documentId : "",
                        tranId: _data.tranId ? _data.tranId : "",
                        audit: {
                            documentedById: _mPatResp.data[0].audit.documentedById,
                            documentedBy: _mPatResp.data[0].audit.documentedBy,
                            documentedDt: _mPatResp.data[0].audit.documentedDt
                        }
                    }
                };
            }
            else if (_type && _type === "UPDATE_APPOINTMENT") {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "_id": req.body.params.visitId
                    },
                    "selectors": "-history"
                }
                let getApmtAgstId = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                patData = {
                    params: {
                        _id: getApmtAgstId.data[0]._id,
                        revNo: getApmtAgstId.data[0].revNo,
                        UMR: _result[0].UMR,
                        age: _result[0].age,
                        gender: _result[0].gender,
                        patId: _result[0]._id,
                        audit: {
                            documentedById: _mPatResp.data[0].audit.documentedById,
                            documentedBy: _mPatResp.data[0].audit.documentedBy,
                            documentedDt: _mPatResp.data[0].audit.documentedDt
                        }
                    }
                };
            }
            else if (_type && _type === "UPDATE_APPOINTMENT_WITH_BILL") {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "UMR": req.body.params.UMR,
                        "code": req.body.params.visitNo,
                    },
                    "selectors": "-history"
                }
                //  console.log("_filter", _filter);
                let getApmtAgstId = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType);
                // console.log("getApmtAgstId", getApmtAgstId);
                patData = {
                    params: {
                        _id: getApmtAgstId.data[0]._id,
                        revNo: getApmtAgstId.data[0].revNo,
                        status: req.body.params.status
                    }
                };
            }
            patData.params.audit = {};
            patData.params.audit["modifiedById"] = req.tokenData.userId;
            patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
            patData.params.audit["modifiedByDt"] = new Date().toISOString();
            patData.params.revNo = patData.params.revNo + 1;
            patData.params["history"] = {
                "revNo": _hResp.data[0].revNo,
                "revTranId": _hResp.data[0]._id
            }
            pLoadResp = await _mUtils.preparePayload("U", patData);
            if (!pLoadResp.success) {
                resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _uResp;
            if (_type === "AAPT_UPDT" || _type === "UPDATE_APPOINTMENT" || _type === "UPDATE_APPOINTMENT_WITH_BILL") {
                _uResp = await _mUtils.commonMonogoCall("cm_appointments", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            } else {
                _uResp = await _mUtils.commonMonogoCall("cm_patients", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            }

            if (!(_uResp && _uResp.success && _uResp.data)) {
                resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
            }
            else {
                resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
            }
        });
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

/* Insert Individual Collections to Vitals, Investigations and Medication */
async function insertIndividualColl(_type, _data, _idx, _output, req, _params) {
    try {
        if (_data.length > _idx && _data[_idx].child && _data[_idx].child.length > 0) {
            let _coll = "";
            if (_data[_idx].type === 'VITALS') {
                _coll = "cm_vitals_tran";
            }
            else if (_data[_idx].type === 'INVESTIGATION') {
                _coll = "cm_investigation_tran";
            }
            else if (_data[_idx].type === 'MEDICATION') {
                _coll = "cm_medications_tran";
            }
            if (_type === "I") {
                _.each(_data[_idx].child, (_l) => {
                    _l.audit = req.cAudit;
                    _l.locId = _params.locId;
                    _l.UMR = _params.UMR;
                    _l.visit = _params.visit || "";
                    _l.visitNo = _params.visitNo || "";
                    _l.patDet = _params.patDet;
                    _l.docDetails = _params.docDetails;
                    _l.isBilled = false;
                });

                let _mResp = await _mUtils.commonMonogoCall(_coll, "insertMany", _data[_idx].child, "", "", "", req.tokenData.dbType);
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, type: _data[_idx].type, desc: _mResp.desc || "", data: [] });
                }
                else {
                    _output.push({ success: true, type: _data[_idx].type, desc: "", data: _mResp.data || [] })
                }
                _idx = _idx + 1;
                await insertIndividualColl(_type, _data, _idx, _output, req, _params);
            }
            else if (_type === "U") {
                let _updChildResp = await updateChildIndividualColl(_data[_idx].type, _data[_idx].child, 0, [], req, _coll, _params);
                _.each(_updChildResp.data, (_uc) => {
                    _output.push(_uc);
                });
                console.log("output", _output);
                _idx = _idx + 1;
                await insertIndividualColl(_type, _data, _idx, _output, req, _params);
            }
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

async function updateChildIndividualColl(_type, _data, _idx, _output, req, _coll, _params) {
    try {
        if (_data.length > _idx) {
            if (!_data[_idx]._id) {
                _data[_idx].audit = req.cAudit;
                _data[_idx].locId = _params.locId;
                _data[_idx].UMR = _params.UMR;
                _data[_idx].visit = _params.visit || "";
                _data[_idx].visitNo = _params.visitNo || "";
                _data[_idx].patDet = _params.patDet;
                _data[_idx].docDetails = _params.docDetails;
                let _mResp = await _mUtils.commonMonogoCall(_coll, "insertMany", _data[_idx], "", "", "", req.tokenData.dbType);
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, type: _type, isNew: true, desc: _mResp.desc || "", data: [] });
                }
                else {
                    _output.push({ success: true, type: _type, isNew: true, desc: "", data: _mResp.data || [] })
                }
            }
            else {
                let pLoadResp = { payload: {} };
                let _mResp = await _mUtils.commonMonogoCall(_coll, "findById", _data[_idx].tranId, "", req.body, "", req.tokenData.dbType);
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, type: _type, isNew: false, desc: _mResp.desc || "", data: [] });
                }
                else {
                    let _hResp = await _mUtils.insertHistoryData(_coll, _mResp.data, _data[_idx], req);
                    if (!(_hResp && _hResp.success)) {
                    }
                    else {
                        _data[_idx].revNo = _mResp.data.revNo;
                    }
                    _data[_idx]._id = _data[_idx].tranId;
                    _data[_idx].audit = {};
                    _data[_idx].audit["modifiedById"] = req.tokenData.userId;
                    _data[_idx].audit["modifiedByBy"] = req.tokenData.displayName;
                    _data[_idx].audit["modifiedByDt"] = new Date().toISOString();
                    // _data[_idx].revNo = _data[_idx].revNo + 1;
                    // _data[_idx]["history"] = {
                    //     "revNo": _hResp.data[0].revNo,
                    //     "revTranId": _hResp.data[0]._id
                    // }
                    delete _data[_idx].tranId;
                    let _pData = {}
                    if (req.body.params.recStatus === false) {
                        let recObject = {
                            _id: _data[_idx]._id,
                            recStatus: false
                        }
                        _pData['params'] = recObject
                    } else {
                        _pData['params'] = _data[_idx]
                    }

                    pLoadResp = await _mUtils.preparePayload("U", _pData);
                    if (!pLoadResp.success) {
                        resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }

                    let _mResp1 = await _mUtils.commonMonogoCall(_coll, "findOneAndUpdate", pLoadResp.payload, "", "", "", req.tokenData.dbType);
                    if (!(_mResp1 && _mResp1.success)) {
                        _output.push({ success: false, type: _type, isNew: false, desc: _mResp.desc || "", data: [] });
                    }
                    else {
                        _output.push({ success: true, type: _type, isNew: false, desc: "", data: _mResp.data || [] })
                    }
                }
            }
            _idx = _idx + 1;
            await updateChildIndividualColl(_type, _data, _idx, _output, req, _coll, _params);
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

async function trascationUpdateIsBill(_data, _idx, _output, req, ...cmf) {
    try {
        let arreyData = [];
        let arreyData2 = [];
        let object = {};
        if (_data.length > _idx) {

            if (_data[_idx].type === "INVESTIGATION") {
                _.each(req.body.params.services, (obj, indx) => {
                    if (obj.serviceType === "" || obj.serviceType === "Investigations" || obj.serviceType === "Services" || obj.serviceType === "Procedures" || obj.serviceType === "Miscellaneous") {
                        _.each(_data[_idx].child, (oc, oi) => {
                            if (oc.serviceTypeCd.includes(obj.serviceCd)) {
                                oc["isBilled"] = true;
                                arreyData.push(oc)
                                object = {
                                    _id: _data[_idx]._id,
                                    child: arreyData
                                }
                                arreyData2.push(object)
                            }
                        })
                    }
                })
            }
            if (_data[_idx].type === "MEDICATION") {
                _.each(req.body.params.services, (obj, indx) => {
                    if (obj.serviceType === "" || obj.serviceType === "Medication") {
                        _.each(_data[_idx].child, (oc, oi) => {
                            if (oc.medFormTypeCd.includes(obj.serviceCd)) {
                                oc["isBilled"] = true;
                                arreyData.push(oc)
                                object = {
                                    _id: _data[_idx]._id,
                                    child: arreyData
                                }
                                arreyData2.push(object)
                            }
                        })
                    }
                })
            }

            _output.push({ data: arreyData2 });
            _idx = _idx + 1;
            await trascationUpdateIsBill(_data, _idx, _output, req, ...cmf);
        }
        else {
            let out = []
            _.each(_output, (_ob) => {
                out.push(obj.data)
            })
            return { success: true, data: out }
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


async function completeTransactionBill(_umrNo, req, res) {
    try {
        return new Promise(async (resolve, reject) => {
            let _filter = {
                "filter": {
                    "recStatus": true,
                    "UMR": _umrNo
                },
                "selectors": "-history"
            }
            let object = {}
            let childArrey = [];
            let totalDataArrey = [];
            let childObject = {};
            let substractAmount;
            let updateAppointmentAmount = {};

            let consultServiceData = _.filter(req.body.params.services, (o, i) => { return o.type === "CONS" })
            if (consultServiceData.length > 0) {
                delete _filter.filter.UMR
                let consultAmt = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                _.each(consultAmt.data, async (co, ci) => {
                    if (co.code === consultServiceData[0].visitNo) {
                        substractAmount = co.amount - consultServiceData[0].amount
                        updateAppointmentAmount = {
                            params: {
                                _id: co._id,
                                amount: substractAmount >= 0 ? substractAmount : 0,
                                isPayment: substractAmount <= 0 ? true : false
                            }
                        }
                    }
                })
                pLoadResp = await _mUtils.preparePayload("U", updateAppointmentAmount);
                if (!pLoadResp.success) {
                    // resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _uResp = await _mUtils.commonMonogoCall("cm_appointments", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);

                if (!(_uResp && _uResp.success && _uResp.data)) {
                    //  resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                }

                if (_uResp.data.isPayment === true) {
                    let getQueData = await updateQueNoData(req, res, _uResp.data._id)
                    if (!(getQueData && getQueData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: _mResp.data || [] });
                    }
                }


            }




            let _mPatResp = await _mUtils.commonMonogoCall("cm_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                resolve({ success: false, data: [], desc: "Error, No patient data found.." });
            }

            let finalArrey = []
            _.each(_mPatResp.data[0].data, async (o, i) => {
                if (o.type === "INVESTIGATION" || o.type === "MEDICATION") {
                    finalArrey.push(o)
                }
            })


            _.each(req.body.params.services, (ro, ri) => {
                _.each(finalArrey, (fo, fi) => {
                    if (fo.type === "INVESTIGATION") {
                        _.filter(fo.child, (co, ci) => {
                            if (co.cd === ro.serviceCd) {
                                childObject = {
                                    _id: co._id,
                                    isBilled: true
                                }
                                childArrey.push(childObject)
                                object._id = fo._id
                                object.child = childArrey
                                totalDataArrey.push(object)
                                object = {}
                                childArrey = []
                            }
                        })
                    } else if (fo.type === "MEDICATION") {
                        _.filter(fo.child, (co, ci) => {
                            if (co.cd === ro.serviceCd) {
                                childObject = {
                                    _id: co._id,
                                    isBilled: true
                                }
                                childArrey.push(childObject)
                                object._id = fo._id
                                object.child = childArrey
                                totalDataArrey.push(object)
                            }
                        })

                    }
                })
            })

            let patData = {
                params: {
                    _id: _mPatResp.data[0]._id,
                    revNo: _mPatResp.data[0].revNo,
                    data: totalDataArrey,
                    audit: {
                        documentedById: _mPatResp.data[0].audit.documentedById,
                        documentedBy: _mPatResp.data[0].audit.documentedBy,
                        documentedDt: _mPatResp.data[0].audit.documentedDt
                    }
                }
            };

            let _updateResp = await insertUpdateInMultiData(patData, 0, [], req.tokenData.dbType, 'cm_transactions', 'findOneAndUpdate', 'U')
            if (!(_updateResp && _updateResp.success && _updateResp.data)) {
                resolve({ success: false, status: 400, desc: _updateResp.desc || 'Error occurred while insert User ..', data: [] });
            }
            else {
                resolve({ success: true, status: 200, desc: "", data: _updateResp.data || [] });
            }
        });
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};

async function updateVisitsAgnstPatent(_umr, req, result) {
    try {
        return new Promise(async (resolve, reject) => {
            if (req.body.params.UMR && req.body.params.visitNo) {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "UMR": req.body.params.UMR,
                        "visits": { $elemMatch: { visitNo: req.body.params.visitNo } }
                    }
                }
                let data;
                let _mPatResp = await _mUtils.commonMonogoCall("cm_patients", "find", _filter, "", "", "", req.tokenData.dbType);
                if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                    resolve({ success: false, data: [], desc: "Error, No patient data found.." });
                }
                _.each(_mPatResp.data[0].visits, (objects, index) => {
                    if (objects.visitNo === req.body.params.visitNo) {
                        data = objects
                    }
                })
                let patData = {
                    params: {
                        _id: _mPatResp.data[0]._id,
                        visits: [
                            {
                                _id: data._id,
                                tranId: result.data[0]._id,
                                documentId: result.data[0].documentId
                            }
                        ]
                    }
                };
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", patData);
                if (!pLoadResp.success) {
                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _uResp = await _mUtils.commonMonogoCall("cm_patients", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                if (!(_uResp && _uResp.success && _uResp.data)) {
                    resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                }
                else {
                    resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
                }


            }
        });
    } catch (error) {

    }

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


async function findDocAganistLocation(_data, _idx, _output, req, _key) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": [
                    { $unwind: "$locations" },
                    {
                        $match: {
                            //"recStatus": { $eq: true },
                            "locations.locId": _data[_idx]._id
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            docCd: { "$first": "$docCd" },
                            docTypeCd: { "$first": "$docTypeCd" },
                            docTypeName: { "$first": "$docTypeName" },
                            titleCd: { $first: "$titleCd" },
                            titleName: { $first: "$titleName" },
                            fName: { $first: "$fName" },
                            mName: { $first: "$mName" },
                            lName: { $first: "$lName" },
                            dispName: { $first: "$dispName" },
                            genderCd: { $first: "$genderCd" },
                            gender: { $first: "$gender" },
                            dob: { $first: "$dob" },
                            emailID: { $first: "$emailID" },
                            userName: { $first: "$userName" },
                            password: { $first: "$password" },
                            phone: { $first: "$phone" },
                            mobile: { $first: "$mobile" },
                            photo: { $first: "$photo" },
                            signature: { $first: "$signature" },
                            apmntReq: { $first: "$apmntReq" },
                            speclityCd: { $first: "$speclityCd" },
                            speclityName: { $first: "$speclityName" },
                            qualfCd: { $first: "$qualfCd" },
                            qualf: { $first: "$qualf" },
                            designationCd: { $first: "$designationCd" },
                            designation: { $first: "$designation" },
                            regNo: { $first: "$regNo" },
                            revNo: { $first: "$revNo" },
                            specializations: { $first: "$specializations" },
                            locations: { $push: "$locations" }
                        }
                    }
                ]
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "aggregation", _filter, "", req.body, "", _key)
            // if(_mResp.data.length > 0){
            _data[_idx]["docData"] = JSON.parse(JSON.stringify(_mResp.data)) && JSON.parse(JSON.stringify(_mResp.data)).length > 0 ? JSON.parse(JSON.stringify(_mResp.data)) : []
            _output.push(_data[_idx])
            //}
            _idx = _idx + 1;
            await findDocAganistLocation(_data, _idx, _output, req, _key);
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

function mergingData_deprecated(data, _resp) {
    const dataMap = _.keyBy(data, 'mainhdcd');
    _.each(_resp, (respObj) => {
        const dataObj = dataMap[respObj.mainhdcd];
        if (dataObj) {
            mergeNonArrayKeys(dataObj, respObj);
            if (respObj.mainChild && Array.isArray(respObj.mainChild) && respObj.mainChild.length > 0) {
                _.each(respObj.mainChild, (respMainChild) => {
                    //const dataMainChild = dataObj.mainChild.find(mc => mc.hc == respMainChild.hc);
                    let dataMainChild;
                    if (respMainChild.hc) {
                        dataMainChild = dataObj.mainChild.find(mc => mc.hc == respMainChild.hc);
                    }
                    else if (respMainChild.lblCd) {
                        dataMainChild = dataObj.mainChild.find(mc => mc.lblCd == respMainChild.lblCd);
                    }
                    if (dataMainChild) {
                        mergeNonArrayKeys(dataMainChild, respMainChild);
                        if (respMainChild.child && Array.isArray(respMainChild.child) && respMainChild.child.length > 0) {
                            _.each(respMainChild.child, (respChild) => {
                                const dataChild = dataMainChild.child.find(c => (c.lblCd == respChild.lblCd))

                                if (dataChild) {
                                    mergeNonArrayKeys(dataChild, respChild)
                                    _.each(respChild, (respSubChild, key) => {
                                        if (Array.isArray(respSubChild) && respSubChild.length > 0) {
                                            _.each(respSubChild, (respSubKey) => {
                                                if (dataChild[key]) {
                                                    let dataSubChild = dataChild[key].find(c => (c.lblCd == respSubKey.lblCd))
                                                    if (dataSubChild) {
                                                        _.merge(dataSubChild, respSubKey)
                                                    }
                                                    else {
                                                        dataChild[key].push(respSubKey)
                                                    }
                                                }
                                            })
                                        }

                                        if (_.isObject(dataChild[key]) && (_.isObject(respChild[key]) && _.keys(respChild[key].length > 0))) {
                                            if (respChild[key].lkApiName && dataChild[key].lkApiName) {
                                                if (dataChild[key].lkApiName == respChild[key].lkApiName) {
                                                    dataChild[key] = _.merge({}, dataChild[key], respChild[key])
                                                }
                                            }
                                        }
                                    })
                                }
                                else {
                                    dataMainChild.child.push(respChild)
                                }
                            })
                        }
                    }
                    else {
                        dataObj.mainChild.push(respMainChild)
                    }
                })
            }
        }
        else {
            dataMap[respObj.mainhdcd] = respObj;
        }
    });

    return _.values(dataMap)
}

function mergingData(data, _resp) {

    dataMap = _.keyBy(data, 'mainhdcd');
    _.each(_resp, (respObj) => {
        const dataObj = dataMap[respObj.mainhdcd];
        if (dataObj) {
            mergeNonArrayKeys(dataObj, respObj);
            if (respObj.mainChild && Array.isArray(respObj.mainChild) && respObj.mainChild.length > 0) {
                _.each(respObj.mainChild, (respMainChild) => {
                    if (respMainChild.hc !== undefined) {
                        const dataMainChild = dataObj.mainChild.find(mc => mc.hc == respMainChild.hc);
                        if (dataMainChild) {
                            mergeNonArrayKeys(dataMainChild, respMainChild);
                            if (respMainChild.child && Array.isArray(respMainChild.child) && respMainChild.child.length > 0) {
                                _.each(respMainChild.child, (respChild) => {
                                    const dataChild = dataMainChild.child.find(c => (c.lblCd == respChild.lblCd))

                                    if (dataChild) {
                                        mergeNonArrayKeys(dataChild, respChild)
                                        _.each(respChild, (respSubChild, key) => {
                                            if (Array.isArray(respSubChild) && respSubChild.length > 0) {
                                                _.each(respSubChild, (respSubKey) => {
                                                    if (dataChild[key]) {
                                                        let dataSubChild = dataChild[key].find(c => (c.lblCd == respSubKey.lblCd))
                                                        // new added loop
                                                        if (dataSubChild) {
                                                            mergeNonArrayKeys(dataSubChild, respSubKey)
                                                            _.each(respSubKey, (respSubKeyChild, _key) => {
                                                                if (Array.isArray(respSubKeyChild) && respSubKeyChild.length > 0) {
                                                                    _.each(respSubKeyChild, (respInnerKey) => {
                                                                        if (dataSubChild[_key]) {
                                                                            let dataInnerChild = dataSubChild[_key].find(c => (c.lblCd == respInnerKey.lblCd))
                                                                            if (dataInnerChild) {
                                                                                _.merge(dataInnerChild, respInnerKey)
                                                                            }
                                                                            else {
                                                                                dataInnerChild[_key].push(respInnerKey)
                                                                            }
                                                                        }
                                                                    })
                                                                }

                                                                if (_.isObject(dataSubChild[_key]) && (_.isObject(respChild[_key]) && _.keys(respSubKey[_key].length > 0))) {
                                                                    if (respSubKey[_key].lkApiName && dataSubChild[_key].lkApiName) {
                                                                        if (dataSubChild[_key].lkApiName == respSubKey[_key].lkApiName) {
                                                                            dataSubChild[_key] = _.merge({}, dataSubChild[_key], respSubKey[_key])
                                                                        }
                                                                    }
                                                                }
                                                            })

                                                            //_.merge(dataSubChild, respSubKey)
                                                        }
                                                        else {
                                                            dataChild[key].push(respSubKey)
                                                        }
                                                    }
                                                })
                                            }

                                            if (_.isObject(dataChild[key]) && (_.isObject(respChild[key]) && _.keys(respChild[key].length > 0))) {
                                                if (respChild[key].lkApiName && dataChild[key].lkApiName) {
                                                    if (dataChild[key].lkApiName == respChild[key].lkApiName) {
                                                        dataChild[key] = _.merge({}, dataChild[key], respChild[key])
                                                    }
                                                }
                                            }
                                        })
                                    }
                                    else {
                                        dataMainChild.child.push(respChild)
                                    }
                                })
                            }
                        }
                    }
                    else {
                        const dataChild = dataObj.mainChild.find(mc => mc.lblCd == respMainChild.lblCd);
                        let respChild = respMainChild
                        if (dataChild) {
                            mergeNonArrayKeys(dataChild, respChild)
                            _.each(respChild, (respSubChild, key) => {
                                if (Array.isArray(respSubChild) && respSubChild.length > 0) {
                                    _.each(respSubChild, (respSubKey) => {
                                        if (dataChild[key]) {
                                            let dataSubChild = dataChild[key].find(c => (c.lblCd == respSubKey.lblCd))
                                            // new added loop
                                            if (dataSubChild) {
                                                mergeNonArrayKeys(dataSubChild, respSubKey)
                                                _.each(respSubKey, (respSubKeyChild, _key) => {
                                                    if (Array.isArray(respSubKeyChild) && respSubKeyChild.length > 0) {
                                                        _.each(respSubKeyChild, (respInnerKey) => {
                                                            if (dataSubChild[_key]) {
                                                                let dataInnerChild = dataSubChild[_key].find(c => (c.lblCd == respInnerKey.lblCd))
                                                                if (dataInnerChild) {
                                                                    _.merge(dataInnerChild, respInnerKey)
                                                                }
                                                                else {
                                                                    dataInnerChild[_key].push(respInnerKey)
                                                                }
                                                            }
                                                        })
                                                    }

                                                    if (_.isObject(dataSubChild[_key]) && (_.isObject(respChild[_key]) && _.keys(respSubKey[_key].length > 0))) {
                                                        if (respSubKey[_key].lkApiName && dataSubChild[_key].lkApiName) {
                                                            if (dataSubChild[_key].lkApiName == respSubKey[_key].lkApiName) {
                                                                dataSubChild[_key] = _.merge({}, dataSubChild[_key], respSubKey[_key])
                                                            }
                                                        }
                                                    }
                                                })

                                                //_.merge(dataSubChild, respSubKey)
                                            }
                                            else {
                                                dataChild[key].push(respSubKey)
                                            }
                                        }
                                    })
                                }

                                if (_.isObject(dataChild[key]) && (_.isObject(respChild[key]) && _.keys(respChild[key].length > 0))) {
                                    if (respChild[key].lkApiName && dataChild[key].lkApiName) {
                                        if (dataChild[key].lkApiName == respChild[key].lkApiName) {
                                            dataChild[key] = _.merge({}, dataChild[key], respChild[key])
                                        }
                                    }
                                }
                            })
                        }
                        else {
                            dataObj.mainChild.push(respMainChild)
                        }
                        dataObj.mainChild.push(respMainChild)
                    }
                })
            }
        }
        else {
            dataMap[respObj.mainhdcd] = respObj;
        }
    });

    return _.values(dataMap)
}

function mergeNonArrayKeys(data, _resp) {
    _.each(_resp, (value, key) => {
        if (key == "val") {
            data[key] = value
        }
        else if ((!_.isArray(value) && !_.isObject(value)) || (_.isArray(data[key]) && data[key].length == 0)) {
            data[key] = value
        }

    })
}

/* Get Organization Details */
router.get("/get-org-details", async (req, res) => {
    try {
        if (req.query && req.query.orgKey) {
            let _filter = {
                "filter": { "orgKey": req.query.orgKey, "recStatus": true },
                "selectors": "-history"
            }
            mongoMapper("cm_organization", "find", _filter, req.query.orgKey.toLowerCase()).then(async (result) => {
                let _parseData = JSON.parse(JSON.stringify(result.data))
                let _findDocAganistLocation = await findDocAganistLocation(_parseData[0].locations, 0, [], req, req.query.orgKey.toLowerCase())
                _parseData[0].locations = _findDocAganistLocation.data
                return res.status(200).json({ success: true, status: 200, desc: '', data: _parseData });
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

/**Logout */
router.post("/logout", async (req, res) => {
    try {
        if (!(req.headers['sessionid'])) {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
        let _filter = {
            "filter": {
                '_id': req.headers['sessionid']
            },
            "selectors": ""
        }
        let _sessionData = await _mUtils.commonMonogoCall("cm_usersessions", "findOne", _filter, "", "", "", req.headers.orgkey.toLowerCase());
        if (!(_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data.token && _sessionData.data.token.length > 0)) {
            _sessionData.data.token = "";
            return res.status(403).json({ success: false, status: 403, desc: `This user is currently logged in on another device..`, data: _sessionData.data || [] });
        }
        let _tknObj = {
            params: {
                _id: req.headers['sessionid'],
                token: "",
                logOutTime: new Date().toISOString(),
                recStatus: false
            }
        }
        _tknObj.params["audit.modifiedBy"] = _sessionData.data.displayName;
        _tknObj.params["audit.modifiedById"] = _sessionData.data.userId;
        _tknObj.params["audit.modifiedDt"] = new Date().toISOString();
        let pLoadResp = { payload: {} };
        pLoadResp = await _mUtils.preparePayload('U', _tknObj);
        if (!pLoadResp.success) {
            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
        }
        mongoMapper('cm_usersessions', 'findOneAndUpdate', pLoadResp.payload, req.headers.orgkey.toLowerCase()).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("error-logout", error);
        return res.status(500).json({ success: false, status: 500, desc: error });
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

async function _findDocAganistLocationWithAppointment(_data, _idx, _output, req, _key) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": [
                    // { $unwind: "$locations" },
                    {
                        $match: {
                            "recStatus": { $eq: true },
                            "docCd": _data[_idx].docCd
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            docCd: { "$first": "$docCd" },
                            docTypeCd: { "$first": "$docTypeCd" },
                            docTypeName: { "$first": "$docTypeName" },
                            titleCd: { $first: "$titleCd" },
                            titleName: { $first: "$titleName" },
                            fName: { $first: "$fName" },
                            mName: { $first: "$mName" },
                            lName: { $first: "$lName" },
                            dispName: { $first: "$dispName" },
                            genderCd: { $first: "$genderCd" },
                            gender: { $first: "$gender" },
                            dob: { $first: "$dob" },
                            emailID: { $first: "$emailID" },
                            userName: { $first: "$userName" },
                            password: { $first: "$password" },
                            phone: { $first: "$phone" },
                            mobile: { $first: "$mobile" },
                            photo: { $first: "$photo" },
                            signature: { $first: "$signature" },
                            apmntReq: { $first: "$apmntReq" },
                            speclityCd: { $first: "$speclityCd" },
                            speclityName: { $first: "$speclityName" },
                            qualfCd: { $first: "$qualfCd" },
                            qualf: { $first: "$qualf" },
                            designationCd: { $first: "$designationCd" },
                            designation: { $first: "$designation" },
                            regNo: { $first: "$regNo" },
                            revNo: { $first: "$revNo" },
                            specializations: { $first: "$specializations" },
                            locations: { $push: "$locations" }
                        }
                    }
                ]
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "aggregation", _filter, "", req.body, "", _key)
            if (_mResp.data.length > 0) {
                _filter.filter = []
                _filter.filter = [
                    {
                        $match: {
                            "docDetails.cd": _mResp.data[0].docCd,
                            "audit.documentedDt": {
                                $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
                                $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()
                            }
                        }
                    }
                ]
            }
            let _mResp1 = await _mUtils.commonMonogoCall("cm_appointments", "aggregation", _filter, "", req.body, "", _key)

            _mResp.data[0]['appointments'] = _mResp1.data && _mResp1.data.length > 0 ? _mResp1.data : []

            _output.push(_mResp.data[0])
            _idx = _idx + 1;
            await _findDocAganistLocationWithAppointment(_data, _idx, _output, req, _key);
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



/**Auth User */
router.post("/auth-user", async (req, res) => {
    try {
        if (!(req.body && req.body.params.orgId && req.body.params.orgKey && req.body.params.locId && req.body.params.uName && req.body.params.pwd)) {
            return res.status(400).send({ success: false, status: 400, desc: "Required Missing Parameters ..", data: [] });
        }
        let _uParams = {
            "filter": {
                "recStatus": true,
                "orgId": req.body.params.orgId,
                "userName": { $eq: req.body.params.uName },
                "password": { $eq: req.body.params.pwd },
                "locations.locId": req.body.params.locId,
            },
            "selectors": {
                "orgId": "$orgId",
                "_id": "$_id",
                "recStatus": "$recStatus",
                "empId": "$empId",
                "userName": "$userName",
                "password": "$password",
                "displayName": "$displayName",
                "defaultLocId": "$defaultLocId",
                "loginStatus": "$loginStatus",
                "logHistory": "$logHistory",
                "locations": {
                    $filter: {
                        input: "$locations",
                        cond: {
                            $eq: ["$$this.locId", mongoose.Types.ObjectId(`${req.body.params.locId}`)]
                        }
                    }
                },
                "audit": "$audit",
                "revNo": "$revNo"
            }
        }
        let _userData = await _mUtils.commonMonogoCall("cm_users", "find", _uParams, "", "", "", req.body.params.orgKey.toLowerCase());
        if (!(_userData && _userData.success && _userData.data && Object.keys(_userData.data).length > 0)) {
            return res.status(400).json({ success: false, status: 400, desc: `Invalid crendentials / No user found..`, data: [] });
        }
        let _clnUser = JSON.parse(JSON.stringify(_userData.data));
        if (req.body.params.forceLogout && req.body.params.sessionId) {
            let _tknObj = {
                params: {
                    _id: req.body.params.sessionId,
                    token: "",
                    logOutTime: new Date().toISOString(),
                    recStatus: false
                }
            }
            _tknObj.params["audit.modifiedBy"] = _clnUser[0].displayName;
            _tknObj.params["audit.modifiedById"] = _clnUser[0]._id;
            _tknObj.params["audit.modifiedDt"] = new Date().toISOString();
            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload('U', _tknObj);
            let _sessionUpdate = await _mUtils.commonMonogoCall("cm_usersessions", "findOneAndUpdate", pLoadResp.payload, "", "", "", req.body.params.orgKey.toLowerCase());
            if (!(_sessionUpdate && _sessionUpdate.success && _sessionUpdate.data && Object.keys(_sessionUpdate.data).length > 0)) {
                return res.status(401).json({ success: false, status: 400, desc: `The user session de-activation is failed..`, data: [] });
            }
        }
        let _filter = {
            "filter": {
                'userName': req.body.params.uName, "orgId": req.body.params.orgId, "locId": req.body.params.locId,
                "recStatus": { $eq: true }
            },
            "selectors": ""
        }
        let _sessionData = await _mUtils.commonMonogoCall("cm_usersessions", "findOne", _filter, "", "", "", req.body.params.orgKey.toLowerCase());
        if ((_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data.token && _sessionData.data.token.length > 0)) {
            _sessionData.data.token = "";
            return res.status(403).json({ success: false, status: 403, desc: `This user is currently logged in on another device..`, data: _sessionData.data || [] });
        }
        let _rParams = {
            "filter": { "orgId": req.body.params.orgId },
            "selectors": "-audit -history"
        }
        let _mResp = await _mUtils.commonMonogoCall("cm_roles", "find", _rParams, "", "", "", req.body.params.orgKey.toLowerCase());
        if (!(_mResp && _mResp.success && _mResp.data)) {
            return res.status(400).json({ success: false, status: 400, desc: `User Role does not match with Role mastes..`, data: [] });
        }
        let _roleDocs = _.filter(_mResp.data, (_d) => { return _d._id.toString() == _clnUser[0].locations[0].roleId.toString() });
        if (!(_roleDocs && _roleDocs.length > 0 && _roleDocs[0].docmntMap)) {
            return res.status(400).json({ success: false, status: 400, desc: `No Documents found..`, data: [] });
        }

        let findDocAganistLocationWithAppointment = {}
        if (JSON.parse(JSON.stringify(_roleDocs)).length > 0 && JSON.parse(JSON.stringify(_roleDocs))[0].label == "Secretary") {
            let _eEesp = await _mUtils.commonMonogoCall("cm_employee", "findById", JSON.parse(JSON.stringify(_userData.data))[0].empId, "", "", "", req.body.params.orgKey.toLowerCase());
            if (_eEesp.data.length > 0) {
                let _empLocFilterData = _.filter(JSON.parse(JSON.stringify(_eEesp.data)).locations, (_lo, _li) => { return _lo.locId == mongoose.Types.ObjectId(`${req.body.params.locId}`) })
                findDocAganistLocationWithAppointment = await _findDocAganistLocationWithAppointment(_empLocFilterData[0].resourceMap, 0, [], req, req.body.params.orgKey.toLowerCase())
            }
        }

        let _docAccess = _.filter(_roleDocs[0].docmntMap, function (o) { return o.access.view || o.access.edit || o.access.print || o.access.read; });
        let _docString = [];
        _.each(_docAccess, (_i) => {
            _docString.push(_i.docmntUrl);
        });
        let _mOrgResp = await _mUtils.commonMonogoCall("cm_organization", "findById", req.body.params.orgId, "", "", "", req.body.params.orgKey.toLowerCase());
        if (!(_mOrgResp && _mOrgResp.success && _mOrgResp.data)) {
            return res.status(400).json({ success: false, status: 400, desc: `No Organization data found ..`, data: [] });
        }
        let _user = {
            "orgKey": req.body.params.orgKey, "orgId": req.body.params.orgId, "locId": req.body.params.locId, "locName": _clnUser[0].locations[0].locName, "dbType": _mOrgResp.data.dbType, "createdDt": new Date(), "userId": _clnUser[0]._id, "userName": _clnUser[0].userName,
            "displayName": _clnUser[0].displayName, "roleId": _clnUser[0].locations[0].roleId, "roleName": _clnUser[0].locations[0].role, docAccess: _docString
        };
        let _tkn = await generateToken(_user);
        _user["documents"] = _docAccess;
        res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
        _user['empId'] = _clnUser[0].empId || "";
        let _userAgent = req.headers['user-agent'];
        if (_userAgent.includes('Mobile')) {
            req.isMobile = true;
        } else {
            req.isMobile = false;
        }
        let _sessionParams = {
            orgId: _user.orgId,
            locId: _user.locId,
            userId: _user.userId,
            userName: _user.userName,
            displayName: _user.displayName,
            roleId: _user.roleId,
            roleName: _user.roleName,
            browser: _userAgent,
            token: _tkn,
            machine: req.isMobile ? 'Mobile' : 'Web'
        };
        mongoMapper("cm_usersessions", "insertMany", _sessionParams, req.body.params.orgKey.toLowerCase()).then(async (result) => {
            if (!(result.status == 'SUCCESS' && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Login failed / Failed to generate session`, data: [] });
            }
            _user['sessionId'] = result.data[0]._id;
            _user['locDocData'] = findDocAganistLocationWithAppointment.data && findDocAganistLocationWithAppointment.data.length > 0 ? findDocAganistLocationWithAppointment.data : []
            return res.status(200).json({ success: true, status: 200, desc: "", data: _user || [] });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});




/* Validate Users */
router.post("/validate-user", async (req, res) => {
    try {
        if (req.body.params && req.body.params.userName && req.body.params.userName.length > 0 && req.headers.orgkey.length > 0) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "userName": req.body.params.userName
                },
                "selectors": "-history"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            mongoMapper("cm_users", "find", _filter, _dbType).then((result) => {
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


/* Verify Token Function */
// router.use(async function verifyToken(req, res, next) {
//     // if (!req.cookies || !req.cookies["x-token"]) {
//     //     return res.status(400).send({ status: 400,success:false, data: [], desc: "Missing Token ." });
//     // }
//     if (req.url === '/auth-user' || req.url === '/validate-user' || req.headers.exclude) {
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

router.use(async function verifyToken(req, res, next) {
    if (req.url === '/auth-user' || req.url === '/validate-user' || req.url === '/logout' || req.headers.exclude) {
        next();
    }
    else {
        try {
            if (!(req.headers && req.headers.orgkey && req.headers.orgkey.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missed..", data: [] });
            }
            const userAgent = req.headers['user-agent'];
            if (userAgent.includes('Mobile')) {
                req.isMobile = true;
            } else {
                req.isMobile = false;
            }
            let _filter = {
                "filter": {
                    '_id': req.headers['sessionid'],
                    "recStatus": { $eq: true }
                },
                "selectors": ""
            }
            let _sessionData = await _mUtils.commonMonogoCall("cm_usersessions", 'findOne', _filter, "", "", "", req.headers.orgkey.toLowerCase());
            if (!(_sessionData && _sessionData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _sessionData.desc || 'Missing Token..', data: [] });
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
                pLoadResp = await _mUtils.preparePayload('U', _tknObj);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
                }
                let _sessionUpdate = await _mUtils.commonMonogoCall("cm_usersessions", "findOneAndUpdate", pLoadResp.payload, "", "", "", req.headers.orgkey.toLowerCase());
                if (!(_sessionUpdate && _sessionUpdate.success && _sessionUpdate.data && Object.keys(_sessionUpdate.data).length > 0)) {
                    return res.status(401).json({ success: false, status: 400, desc: _sessionUpdate.desc || "Failed to update token", data: [] });
                }
                next();
            }).catch((error) => {
                if (error.name && error.name == 'TokenExpiredError') {
                    return res.status(401).json({ success: false, status: 401, desc: "Token was Expired. Please generate new Token..", data: [] });
                }
                return res.status(401).json({ success: false, status: 401, desc: "Authentication failed, Invalid token..", data: [] });
            });
        } catch (err) {
            return res.status(500).json({ success: false, status: 500, desc: err.message || err, data: [] });
        }
    }
});

/* Get Organization Details */
router.post("/errors-logging", async (req, res) => {
    try {
        if (req.body) {
            req.body.user = {
                "orgId": req.tokenData.orgId,
                "locId": req.tokenData.locId,
                "userId": req.tokenData.userId,
                "userName": req.tokenData.displayName,
                "dtTime": new Date().toISOString()
            };

            let _params = {
                "method": req.body.method,
                payload: req.body.payload,
                error: req.body.error ? req.body.error : "",
                audit: {
                    documentedBy: req.tokenData ? req.tokenData.displayName : "EMR Admin",
                    documentedById: req.tokenData ? req.tokenData.userId : null
                }
            }

            let _mResp = await _mUtils.commonMonogoCall("cm_errorLogging", "insertMany", _params, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            // let filePath = __dirname + "/error-log.txt"
            // let insertTime = new Date().toLocaleString();
            // fs.appendFileSync(filePath, `\n-------------------------------------------------------------------------------------------------------`);
            // fs.appendFileSync(filePath, `\n Insert Time:${insertTime}`);
            // fs.appendFileSync(filePath, `\n Method :${req.body.method}`);
            // fs.appendFileSync(filePath, `\n Payload :${JSON.stringify(req.body.payload)}`);
            // fs.appendFileSync(filePath, `\n Error :${JSON.stringify(req.body.desc)}`);
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _mResp.data });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});
/* Parameter Validation Midleware function */
router.use(function paramValidation(req, res, next) {
    try {
        // req.tokenData = { "userId": 1234, "userName": "Somesh P" };
        //console.log("req.tokenData", req.tokenData)
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
            if (req.body.params && req.body.params.constructor.name == 'Object') {
                req.body.params['sessionId'] = req.headers['sessionid']
            } else if (req.body.params && req.body.params.constructor.name == 'Array') {
                _.each(req.body.params, (_po, _pi) => {
                    _po['sessionId'] = req.headers['sessionid']
                })
            }
        }
        else if (_query === 'updateOne') {

            //if (req.body.flag !== 'BW') {
            req.body.params["audit"] = {
                modifiedById: req.tokenData.userId,
                modifiedBy: req.tokenData.displayName,
                modifiedDt: new Date().toISOString()
            };

            if (req.body.params && req.body.params.constructor.name == 'Object') {
                req.body.params['sessionId'] = req.headers['sessionid']
            } else if (req.body.params && req.body.params.constructor.name == 'Array') {
                _.each(req.body.params, (_po, _pi) => {
                    _po['sessionId'] = req.headers['sessionid']
                })
            }
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

router.post('/get-loc-against-doc-data', async (req, res) => {
    try {
        if (req.body.params.roleName.length > 0 && req.body.params.roleName == "Secretary") {
            let _eEesp = await _mUtils.commonMonogoCall("cm_employee", "findById", req.body.params.empId, "", "", "", req.tokenData.dbType);
            let _empLocFilterData = _.filter(JSON.parse(JSON.stringify(_eEesp.data)).locations, (_lo, _li) => { return _lo.locId == mongoose.Types.ObjectId(`${req.body.params.locId}`) })
            findDocAganistLocationWithAppointment = await _findDocAganistLocationWithAppointment(_empLocFilterData[0].resourceMap, 0, [], req, req.tokenData.dbType);
            return res.status(200).json({ success: true, status: 200, desc: '', data: findDocAganistLocationWithAppointment.data });

        }
    } catch (error) {
        console.log("fgdfjgh", error)
    }
})

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
                            resolve({ success: true, data: _body || [] })
                        }
                        else {
                            // let _revHist = result.data.revHist.sort().reverse()[0];
                            resolve({
                                success: false,
                                data: [{
                                    "modifiedBy": "somesh" || _revHist.documentedBy,
                                    "modifiedDt": "" || _revHist.documentedDt
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
                resolve({ success: false, data: [], desc: `Error occured While executing proc, Error:- ${error}` })
            });
        })
    }
    catch (err) {
        return { success: false, data: [], desc: `Error occured, Error:- ${err}` }
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
/* Prepare Payload for Get calls when using aggreegations*/

async function prepareGetPayloadAggregation(_payload, _inParams) {
    try {
        _.each(_inParams, (_i, _k) => {
            if (_k != 'audit' && _i) {
                if (_k === '_id') {
                    _payload[_k] = ObjectId(_i);
                } else {
                    _payload[_k] = _i;
                }
            }
        });
        return { success: true, data: _payload };
    } catch (err) {
        return { success: false, data: [], desc: err.message || err };
    }
}
// Append audit for childs
function childAuditAppend(_data, _by) {
    _.each(_data[`${_by}`], (_l) => {
        _l.audit = _data.audit;
    });
    return _data;
};

/*Code Generate function */

async function generateSeqCode(_data, _idx, _output, _filter, req) {
    try {
        if (_data.length > _idx) {
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: _filter }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                _output.push({ success: false, desc: _seqResp.desc || "", data: [] });
            }
            else {
                _data[_idx].cd = _seqResp.data;
                _output.push({ success: true, desc: "", data: _data || [] })
            }
            _idx = _idx + 1;
            await generateSeqCode(_data, _idx, _output, _filter, req);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _data
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};


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



/**Insert OrgLoaction */
router.post("/insert-organization", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.dbType && req.body.params.dbType.length > 0) {
            req.body.params.locations[0]["audit"] = req.body.params.audit;
            mongoMapper(`cm_organization`, req.body.query, req.body.params, req.body.params.dbType).then(async (result) => {
                let defaultsResp = await insertDefaultData(_defaults, 0, [], req.body.params.dbType, result.data[0], req.headers['sessionid'])
                if (!defaultsResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert default documents`, data: defaultsResp.data });
                }
                let _roles = _.filter(defaultsResp.data, (_o) => { return _o.type == 'ROLES' });
                let _fRole = _.filter(_roles[0].data, (_o) => { return _o.label == 'Practice Admin' });
                let userData = {
                    orgId: result.data[0]._id,
                    userName: result.data[0].locations[0].emailID,
                    password: `${result.data[0].orgKey.toLowerCase()}123`,
                    displayName: `${result.data[0].orgKey} Admin`,
                    locations: [{
                        locId: result.data[0].locations[0]._id,
                        locName: result.data[0].locations[0].locName,
                        roleId: _fRole[0]._id,
                        role: _fRole[0].label
                    }]
                };
                if (result.data[0].locations[0].defLoc) {
                    userData["defaultLocId"] = result.data[0].locations[0]._id;
                }
                let _mResp = await _mUtils.commonMonogoCall("cm_users", "insertMany", userData, "", "", "", req.body.params.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                result.data[0]["userName"] = _mResp.data[0].userName;
                result.data[0]["password"] = _mResp.data[0].password;
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

/**Update OrgLoc */
router.post("/update-organization", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("cm_organization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_organization', _mResp.data.params, _cBody.params, req, "cm");
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
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('cm_organization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Role */
router.post("/insert-role", async (req, res) => {
    try {
        _.each(req.body.params, (_o, _k) => {
            _o.orgId = req.tokenData.orgId;
            _o.audit = req.body.params.audit;
        });
        delete req.body.params.audit;
        mongoMapper('cm_roles', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("cm_roles", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("cm_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_roles', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
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
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('cm_roles', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
router.post("/insert-employee", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locations && req.body.params.locations.length > 0 && !req.body.params.locations[0]._id) {
            req.body.params.orgId = req.tokenData.orgId;
            //  req.body.params.locations[0]["audit"] = req.body.params.audit;
            req.body.params = await childAuditAppend(req.body.params, "locations");
            _.each(req.body.params.locations, (_lo, _li) => {
                if (_lo.resourceMap.length > 0) {
                    _.each(_lo.resourceMap, (_lorO, _lori) => {
                        _lorO['audit'] = req.body.params.audit
                    })
                }
            })
            //console.log("req.tokenData", req.tokenData)
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Employee' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["cd"] = _seqResp.data;
            mongoMapper('cm_employee', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
                }
                let _fLoc = _.filter(req.body.params.locations, (_l) => { return !_l._id });
                let empData = {
                    _id: result.data[0]._id,
                    loc: _fLoc
                }
                let _userRep = await insertAndUpdateUser("I", req, empData)
                if (!(_userRep && _userRep.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
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
// router.post("/get-employee", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": {
//                 "recStatus": true
//             },
//             "selectors": {
//                 "orgId": "$orgId",
//                 "cd": "$cd",
//                 "recStatus": "$recStatus",
//                 "empTypeId": "$empTypeId",
//                 "empTypeName": "$empTypeName",
//                 "titleCd": "$titleCd",
//                 "titleName": "$titleName",
//                 "fName": "$fName",
//                 "mName": "$mName",
//                 "lName": "$lName",
//                 "dispName": "$dispName",
//                 "gender": "$gender",
//                 "genderCd": "$genderCd",
//                 "dob": "$dob",
//                 "emailID": "$emailID",
//                 "photo": "$photo",
//                 "joinDt": "$joinDt",
//                 "adharNo": "$adharNo",
//                 "passport": "$passport",
//                 "userName": "$userName",
//                 "userCd": "$userCd",
//                 "password": "$password",
//                 "phone": "$phone",
//                 "mobile": "$mobile",
//                 "address1": "$address1",
//                 "address2": "$address2",
//                 "areaCd": "$areaCd",
//                 "area": "$area",
//                 "cityCd": "$cityCd",
//                 "city": "$city",
//                 "stateCd": "$stateCd",
//                 "state": "$state",
//                 "countryCd": "$countryCd",
//                 "country": "$country",
//                 "zipCd": "$zipCd",
//                 // "locations": {
//                 //     $filter: {
//                 //         input: "$locations",
//                 //         as:"n",
//                 //         cond: {
//                 //             $eq: ["$$n.recStatus", true]
//                 //         }
//                 //     }
//                 // },
//                 locations: {
//                     $map: {
//                         input: "$locations",
//                         as: "n",
//                         in: {
//                             recStatus: "$$n.recStatus",
//                             resourceMap: {
//                                 $filter: {
//                                     input: "$$n.resourceMap",
//                                     as: "r",
//                                     cond: {
//                                         $eq: ["$$r.recStatus", true]
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 },
//                 "audit": "$audit",
//                 "revNo": "$revNo"
//             }
//         }
//         let _pGData = await prepareGetPayload(_filter, req.body.params);
//         if (!_pGData.success) {
//             return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//         }
//         mongoMapper("cm_employee", "find", _pGData.data, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });



// router.post("/get-employee", async (req, res) => {
//     try {
//         let _filterObj = {
//             "filter": {
//                 "recStatus": true
//             }
//         }
//         let _pGData = await prepareGetPayload(_filterObj, req.body.params);
//         if (!_pGData.success) {
//             return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//         }

//         let _filter = {
//             filter: [
//                 {
//                     $match: { recStatus: true }
//                 },
//                 {
//                     $project: {
//                         "orgId": 1,
//                         "cd": 1,
//                         "recStatus": "$recStatus",
//                         "empTypeId": "$empTypeId",
//                         "empTypeName": "$empTypeName",
//                         "titleCd": "$titleCd",
//                         "titleName": "$titleName",
//                         "fName": "$fName",
//                         "mName": "$mName",
//                         "lName": "$lName",
//                         "dispName": "$dispName",
//                         "gender": "$gender",
//                         "genderCd": "$genderCd",
//                         "dob": "$dob",
//                         "emailID": "$emailID",
//                         "photo": "$photo",
//                         "joinDt": "$joinDt",
//                         "adharNo": "$adharNo",
//                         "passport": "$passport",
//                         "userName": "$userName",
//                         "userCd": "$userCd",
//                         "password": "$password",
//                         "phone": "$phone",
//                         "mobile": "$mobile",
//                         "address1": "$address1",
//                         "address2": "$address2",
//                         "areaCd": "$areaCd",
//                         "area": "$area",
//                         "cityCd": "$cityCd",
//                         "city": "$city",
//                         "stateCd": "$stateCd",
//                         "state": "$state",
//                         "countryCd": "$countryCd",
//                         "country": "$country",
//                         "zipCd": "$zipCd",
//                         locations: {
//                             $filter: {
//                                 input: "$locations",
//                                 as: "n",
//                                 cond: {
//                                     $and: [
//                                         {
//                                             $eq: ["$$n.recStatus", true]
//                                         },
//                                         {
//                                             $gt: [
//                                                 {
//                                                     $size: {
//                                                         $filter: {
//                                                             input: "$$n.resourceMap",
//                                                             as: "r",
//                                                             cond: {
//                                                                 $eq: ["$$r.recStatus", true]
//                                                             },
//                                                         }
//                                                     }
//                                                 }, 0
//                                             ]
//                                         }
//                                     ]
//                                 },
//                             }
//                         }
//                     }
//                 },
//                 {
//                     $project: {
//                         "orgId": 1,
//                         "cd": 1,
//                         "recStatus": "$recStatus",
//                         "empTypeId": "$empTypeId",
//                         "empTypeName": "$empTypeName",
//                         "titleCd": "$titleCd",
//                         "titleName": "$titleName",
//                         "fName": "$fName",
//                         "mName": "$mName",
//                         "lName": "$lName",
//                         "dispName": "$dispName",
//                         "gender": "$gender",
//                         "genderCd": "$genderCd",
//                         "dob": "$dob",
//                         "emailID": "$emailID",
//                         "photo": "$photo",
//                         "joinDt": "$joinDt",
//                         "adharNo": "$adharNo",
//                         "passport": "$passport",
//                         "userName": "$userName",
//                         "userCd": "$userCd",
//                         "password": "$password",
//                         "phone": "$phone",
//                         "mobile": "$mobile",
//                         "address1": "$address1",
//                         "address2": "$address2",
//                         "areaCd": "$areaCd",
//                         "area": "$area",
//                         "cityCd": "$cityCd",
//                         "city": "$city",
//                         "stateCd": "$stateCd",
//                         "state": "$state",
//                         "countryCd": "$countryCd",
//                         "country": "$country",
//                         "zipCd": "$zipCd",
//                         locations: {
//                             $map: {
//                                 input: "$locations",
//                                 as: "n",
//                                 in: {
//                                     "recStatus": "$$n.recStatus",
//                                     "locId": "$$n.locId",
//                                     "locName": "$$n.locName",
//                                     "defLoc": "$$n.defLoc",
//                                     "roleId": "$$n.roleId",
//                                     "roleName": "$$n.roleName",
//                                     "audit": "$$n.audit",
//                                     "history": "$$n.history",
//                                     resourceMap: {
//                                         $filter: {
//                                             input: "$$n.resourceMap",
//                                             as: "r",
//                                             cond: {
//                                                 $eq: ["$$r.recStatus", true]
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             ]
//         }


//         // locations: {
//         //     $map: {
//         //         input: "$locations",
//         //         as: "n",
//         //         cond: {
//         //             $eq: ["$$n.recStatus", true]
//         //         },
//         //         in: {
//         //             resourceMap: {
//         //                 $filter: {
//         //                     input: "$$n.resourceMap",
//         //                     as: "r",
//         //                     cond: {
//         //                         $eq: ["$$r.recStatus", true]
//         //                     }
//         //                 }
//         //             }
//         //         }
//         //     }
//         // }


//         mongoMapper("cm_employee", "aggregation", _filter, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });


router.post("/get-employee", async (req, res) => {
    try {
        let _filterObj = {
            "filter": {
                "recStatus": true
            }
        }
        let _pGData = await prepareGetPayload(_filterObj, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }

        let _filter = {
            filter: [
                {
                    $unwind: {
                        path: "$locations",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        "locations.resourceMap": {
                            $filter: {
                                input: "$locations.resourceMap",
                                as: "resource",
                                cond: { $eq: ["$$resource.recStatus", true] }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        empTypeId: { $first: "$empTypeId" },
                        empTypeName: { $first: "$empTypeName" },
                        "orgId": { $first: "$orgId" },
                        "cd": { $first: "$cd" },
                        "recStatus": { $first: "$recStatus" },
                        "titleCd": { $first: "$titleCd" },
                        "titleName": { $first: "$titleName" },
                        "fName": { $first: "$fName" },
                        "mName": { $first: "$mName" },
                        "lName": { $first: "$lName" },
                        "dispName": { $first: "$dispName" },
                        "gender": { $first: "$gender" },
                        "genderCd": { $first: "$genderCd" },
                        "dob": { $first: "$dob" },
                        "emailID": { $first: "$emailID" },
                        "photo": { $first: "$photo" },
                        "joinDt": { $first: "$joinDt" },
                        "adharNo": { $first: "$adharNo" },
                        "passport": { $first: "$passport" },
                        "userName": { $first: "$userName" },
                        "userCd": { $first: "$userCd" },
                        "password": { $first: "$password" },
                        "phone": { $first: "$phone" },
                        "mobile": { $first: "$mobile" },
                        "address1": { $first: "$address1" },
                        "address2": { $first: "$address2" },
                        "areaCd": { $first: "$areaCd" },
                        "area": { $first: "$area" },
                        "cityCd": { $first: "$cityCd" },
                        "city": { $first: "$city" },
                        "stateCd": { $first: "$stateCd" },
                        "state": { $first: "$state" },
                        "countryCd": { $first: "$countryCd" },
                        "country": { $first: "$country" },
                        "zipCd": { $first: "$zipCd" },
                        "revNo": { $first: "$revNo" },
                        "audit": { $first: "$audit" },

                        locations: {
                            $push: {
                                $cond: [
                                    { $eq: ["$locations.recStatus", true] },
                                    "$locations",
                                    "$$REMOVE"
                                ]
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        locations: {
                            $filter: {
                                input: "$locations",
                                as: "location",
                                cond: { $ne: ["$$location", null] }
                            }
                        }
                    }
                }
            ]
        }

        if(req.body.params._id && req.body.params._id.length > 0){
            _filter.filter.push({
                $match: { _id: { $eq: mongoose.Types.ObjectId(req.body.params._id) } }
            })
        }

        mongoMapper("cm_employee", "aggregation", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Employee */
router.post("/update-employee", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_employee", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_employee', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.locations) {
                    let _indx = 0;
                    while (_cBody.params.locations.length > _indx) {
                        if (_cBody.params.locations[_indx]._id) {
                            let __id = JSON.parse(JSON.stringify(_cBody.params.locations[_indx]._id));
                            delete _cBody.params.locations[_indx]._id
                            let keyValues = Object.entries(_cBody.params.locations[_indx]);
                            keyValues.splice(0, 0, ["_id", __id]);
                            let newObj = Object.fromEntries(keyValues)
                            _cBody.params.locations[_indx] = JSON.parse(JSON.stringify(newObj))

                            _cBody.params.locations[_indx].audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                            _cBody.params.locations[_indx]["history"] = {
                                "revNo": _hResp.data[0].revNo,
                                "revTranId": _hResp.data[0]._id
                            }
                            if (_cBody.params.locations[_indx].resourceMap && _cBody.params.locations[_indx].resourceMap.length > 0) {
                                _.each(_cBody.params.locations[_indx].resourceMap, (_lrO, _lri) => {
                                    if (_lrO._id) {
                                        _lrO.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                                    } else {
                                        _lrO.audit = JSON.parse(JSON.stringify((req.cAudit)));
                                    }
                                })
                            }
                        } else {
                            _cBody.params.locations[_indx].audit = JSON.parse(JSON.stringify((req.cAudit)));
                            if (_cBody.params.locations[_indx].resourceMap && _cBody.params.locations[_indx].resourceMap.length > 0) {
                                _.each(_cBody.params.locations[_indx].resourceMap, (_lrO, _lri) => {
                                    if (_lrO._id) {
                                        _lrO.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                                    } else {
                                        _lrO.audit = JSON.parse(JSON.stringify((req.cAudit)));
                                    }
                                })
                            }
                        }
                        _indx++;
                    }
                    // _.each(_cBody.params.locations, (_l) => {
                    //     if (_l._id) {
                    //         // let __id = JSON.parse(JSON.stringify(_l._id));
                    //         // delete _l._id
                    //         // let keyValues = Object.entries(_l);
                    //         // keyValues.splice(0, 0, ["_id", __id]);
                    //         // let newObj = Object.fromEntries(keyValues)
                    //         // _l = JSON.parse(JSON.stringify(newObj))


                    //         _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                    //         _l["history"] = {
                    //             "revNo": _hResp.data[0].revNo,
                    //             "revTranId": _hResp.data[0]._id
                    //         }



                    //         if (_l.resourceMap.length > 0) {
                    //             _.each(_l.resourceMap, (_lrO, _lri) => {
                    //                 if (_lrO._id) {
                    //                     _lrO.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                    //                 } else {
                    //                     _lrO.audit = JSON.parse(JSON.stringify((req.cAudit)));
                    //                 }
                    //             })
                    //         }
                    //         // _l.resourceMap.length > 0 ? _.each(_l.resourceMap,(_lrO,_lri)=>{_lrO.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));}):[]  
                    //     }
                    //     else {
                    //         _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                    //         if (_l.resourceMap.length > 0) {
                    //             _.each(_l.resourceMap, (_lrO, _lri) => {
                    //                 if (_lrO._id) {
                    //                     _lrO.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                    //                 } else {
                    //                     _lrO.audit = JSON.parse(JSON.stringify((req.cAudit)));
                    //                 }
                    //             })
                    //         }
                    //     }
                    // });
                }
                // _cBody.params["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            let empData;
            let shouldCallInsertUpdateUser = false;
            mongoMapper('cm_employee', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                // let _fLoc = _.filter(req.body.params.locations, (_l) => { return !_l._id });
                //if (_fLoc && _fLoc.length > 0) {
                // sujana
                // if (req.body.params.locations && req.body.params.locations[0] && (req.body.params.locations[0].recStatus === true || req.body.params.locations[0].recStatus === false || (req.body.params.locations[0].roleId && req.body.params.locations[0].roleId.length > 15 && req.body.params.locations[0].roleName && req.body.params.locations[0].roleName.length > 0))) {
                //     let empData = {
                //         _id: req.body.params._id,
                //         loc: req.body.params.locations[0]
                //     }
                //     let _userRep = await insertAndUpdateUser("U", req, empData);
                //     if (!(_userRep && _userRep.success)) {
                //         return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                //     }
                // }
                //sujana
                if (req.body.params.locations && req.body.params.locations[0] && (!req.body.params.locations[0]._id || (req.body.params.locations[0]._id && req.body.params.locations[0].recStatus === true || req.body.params.locations[0].recStatus === false))) {
                    let _lData = _.pick(req.body.params.locations[0], '_id', 'locId', 'locName', 'roleId', 'roleName', 'recStatus');
                    empData = {
                        _id: req.body.params._id,
                        loc: _lData,
                    };
                    shouldCallInsertUpdateUser = true;
                } else if (req.body.params.flag == 'D') {
                    empData = {
                        _id: req.body.params._id,
                        flag: req.body.params.flag
                    };
                    shouldCallInsertUpdateUser = true;
                }
                if (shouldCallInsertUpdateUser) {
                    _userRep = await insertAndUpdateUser("U", req, empData);
                    if (!(_userRep && _userRep.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                    }
                }
                //}
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

/**Insert Doctors */
router.post("/insert-doctor", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locations && req.body.params.locations.length > 0 && !req.body.params.locations[0]._id) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "locations");
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Doctor' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["docCd"] = _seqResp.data;
            let _cUserName = {
                "filter": { "userName": req.body.params.userName },
                "selectors": "-audit -history"
            }
            let _mCheckResp = await _mUtils.commonMonogoCall("cm_doctors", "find", _cUserName, "", "", "", req.tokenData.dbType);
            if (_mCheckResp && _mCheckResp.success && _mCheckResp.data && _mCheckResp.data.length > 0) {
                return res.status(400).json({ success: false, status: 400, desc: `Username already exists`, data: [] });
            }
            let _cParams = {
                "filter": { "mobile": req.body.params.mobile },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "find", _cParams, "", "", "", req.tokenData.dbType);
            if (_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0) {
                for (let doctor of _mResp.data) {
                    if (doctor.dob === req.body.params.dob && doctor.gender === req.body.params.gender) {
                        return res.status(400).json({ success: false, status: 400, desc: `MobileNo with same DOB and gender already exists`, data: [] });
                    }
                }
            }
            mongoMapper('cm_doctors', "insertMany", req.body.params, req.tokenData.dbType).then(async (result) => {
                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Doctor ..`, data: [] });
                }
                let _fLoc = _.filter(req.body.params.locations, (_l) => { return !_l._id });
                let _lData = []
                _lData.push(_.pick(_fLoc[0], 'locId', 'locName', 'roleId', 'roleName'))
                let empData = {
                    _id: result.data[0]._id,
                    loc: _lData
                }
                let _userRep = await insertAndUpdateUser("I", req, empData);
                if (!(_userRep && _userRep.success)) {
                    let _fParams = {
                        params: {
                            userInsertion: false,
                            _id: result.data[0]._id
                        }
                    }
                    let pLoadResp = { payload: {} };
                    pLoadResp = await _mUtils.preparePayload('U', _fParams);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
                    }
                    await mongoMapper('cm_doctors', "findOneAndUpdate", pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                        return res.status(200).json({ success: true, status: 200, desc: 'Doctor Inserted, but failed to insert in users.', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                    return;
                    //return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
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

/* insert user when user not inserted while insterting doctors /insert-doctor */
router.post("/insert-user", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params._id) {
            let _filter = {
                "filter": {
                    //"recStatus": { $eq: true },
                    "_id": req.body.params._id
                },
                "selectors": "-history"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            await mongoMapper("cm_doctors", "find", _filter, _dbType).then(async (result) => {
                let _fLoc = _.filter(result.data[0].locations, (_l) => { return _l._id });
                let _lData = []
                _lData.push(_.pick(_fLoc[0], 'locId', 'locName', 'roleId', 'roleName'))
                let empData = {
                    _id: result.data[0]._id,
                    loc: _lData
                }
                let _userRep = await insertAndUpdateUser("I", req, empData);
                if (!(_userRep && _userRep.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                } else if (_userRep && _userRep.success) {
                    let _fParams = {
                        params: {
                            userInsertion: true,
                            _id: result.data[0]._id
                        }
                    }
                    let pLoadResp = { payload: {} };
                    pLoadResp = await _mUtils.preparePayload('U', _fParams);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
                    }
                    await mongoMapper('cm_doctors', "findOneAndUpdate", pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: _userRep.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
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

/* Get Doctors */
router.post("/get-doctor", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": {
                "_id": "$_id",
                "revNo": "$revNo",
                "recStatus": "$recStatus",
                "docCd": "$docCd",
                "docTypeCd": "$docTypeCd",
                "docTypeName": "$docTypeName",
                "titleCd": "$titleCd",
                "titleName": "$titleName",
                "fName": "$fName",
                "mName": "$mName",
                "lName": "$lName",
                "dispName": "$dispName",
                "genderCd": "$genderCd",
                "gender": "$gender",
                "dob": "$dob",
                "emailID": "$emailID",
                "userName": "$userName",
                "password": "$password",
                "phone": "$phone",
                "mobile": "$mobile",
                "photo": "$photo",
                "signature": "$signature",
                "apmntReq": "$apmntReq",
                "speclityCd": "$speclityCd",
                "speclityId": "$speclityId",
                "speclityName": "$speclityName",
                "specializations": {
                    $filter: {
                        input: "$specializations",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "qualfCd": "$qualfCd",
                "qualf": "$qualf",
                "designationCd": "$designationCd",
                "designation": "$designation",
                "regNo": "$regNo",
                "locations": {
                    $filter: {
                        input: "$locations",
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
        mongoMapper("cm_doctors", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            if (result.data && result.data.length > 0) {
                let _resp = JSON.parse(JSON.stringify(result.data));
                let _finalResp = _.map(_resp, (doc) => {
                    if (doc.locations && doc.locations.length > 0) {
                        doc.locations = _.map(doc.locations, (loc) => {
                            if (loc.shifts && loc.shifts.length > 0) {
                                loc.shifts = _.filter(loc.shifts, (shift) => shift.recStatus !== false);
                            }
                            return loc;
                        });
                    }
                    return doc;
                });
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp });
            } else {
                return res.status(200).json({ success: true, status: 200, desc: 'No data found', data: [] });
            }
            //return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
/* Get Doctors new api using agreegations */
router.post("/get-doctor/new", async (req, res) => {
    try {
        let _filter = {
            filter: [
                {
                    $match: {
                        recStatus: { $eq: true }
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "recStatus": 1,
                        "docCd": 1,
                        "docTypeCd": 1,
                        "docTypeName": 1,
                        "titleCd": 1,
                        "titleName": 1,
                        "fName": 1,
                        "mName": 1,
                        "lName": 1,
                        "dispName": 1,
                        "genderCd": 1,
                        "gender": 1,
                        "dob": 1,
                        "emailID": 1,
                        "userName": 1,
                        "password": 1,
                        "phone": 1,
                        "mobile": 1,
                        "photo": 1,
                        "signature": 1,
                        "apmntReq": 1,
                        "speclityCd": 1,
                        "speclityId": 1,
                        "speclityName": 1,
                        "specializations": 1,
                        "qualfCd": 1,
                        "qualf": 1,
                        "designationCd": 1,
                        "designation": 1,
                        "regNo": 1,
                        "audit": 1,
                        "locations": {
                            $filter: {
                                input: "$locations",
                                cond: {
                                    $eq: ["$$this.recStatus", true]
                                }
                            },
                        }
                    }
                },
                {
                    $project: {
                        "recStatus": 1,
                        "docCd": 1,
                        "docTypeCd": 1,
                        "docTypeName": 1,
                        "titleCd": 1,
                        "titleName": 1,
                        "fName": 1,
                        "mName": 1,
                        "lName": 1,
                        "dispName": 1,
                        "genderCd": 1,
                        "gender": 1,
                        "dob": 1,
                        "emailID": 1,
                        "userName": 1,
                        "password": 1,
                        "phone": 1,
                        "mobile": 1,
                        "photo": 1,
                        "signature": 1,
                        "apmntReq": 1,
                        "speclityCd": 1,
                        "speclityId": 1,
                        "speclityName": 1,
                        "specializations": 1,
                        "qualfCd": 1,
                        "qualf": 1,
                        "designationCd": 1,
                        "designation": 1,
                        "regNo": 1,
                        "audit": 1,
                        "locations": {
                            $map: {
                                input: "$locations",
                                as: "location",
                                in: {
                                    "settings": "$$location.settings",
                                    "fees": "$$location.fees",
                                    "audit": "$$location.audit",
                                    "_id": "$$location._id",
                                    "locId": "$$location.locId",
                                    "locName": "$$location.locName",
                                    "defLoc": "$$location.defLoc",
                                    "recStatus": "$$location.recStatus",
                                    "roleId": "$$location.roleId",
                                    "roleName": "$$location.roleName",
                                    "isActive": "$$location.isActive",
                                    "documentSettings": "$$location.documentSettings",
                                    "printSettings": "$$location.printSettings",
                                    "medsFavs": "$$location.medsFavs",
                                    "testsFavs": "$$location.testsFavs",
                                    "medsOrderSets": "$$location.medsOrderSets",
                                    "testsOrderSets": "$$location.testsOrderSets",
                                    "holiDays": "$$location.holiDays",
                                    "unitMap": "$$location.unitMap",
                                    "history": "$$location.history",
                                    shifts: {
                                        $filter: {
                                            input: "$$location.shifts",
                                            as: "shift",
                                            cond: {
                                                $eq: ["$$shift.recStatus", true]
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
        let _pGData = await prepareGetPayloadAggregation(_filter.filter[0].$match, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_doctors", "aggregation", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post('/get-doctor-against-loc', async (req, res) => {
    try {
        let _filter = {
            filter: [
                {
                    $project: { _id: 1, docCd: 1, docTypeCd: 1, revNo: 1, docTypeName: 1, titleCd: 1, titleName: 1, fName: 1, mName: 1, lName: 1, dispName: 1, genderCd: 1, gender: 1, dob: 1, emailID: 1, userName: 1, password: 1, phone: 1, mobile: 1, photo: 1, signature: 1, apmntReq: 1, speclityCd: 1, speclityName: 1, specializations: 1, qualfCd: 1, qualf: 1, designationCd: 1, designation: 1, regNo: 1, locations: { $filter: { input: "$locations", cond: { $eq: ["$$this.locId", req.body.params.locId] } } } }
                }
            ]
        }
        let _dResp = await _mUtils.commonMonogoCall("cm_doctors", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
        let _finaldata = _.filter(_dResp.data, (_do, _di) => { return _do.locations.length > 0 })
        return res.status(200).json({ success: true, status: 200, desc: '', data: _finaldata });
    } catch (error) {

    }
})

/**Update Docter */
router.post("/update-doctor", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_doctors', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            // if (_cBody.flag === "D") {
            //     let _uParams = {
            //         params: req.body.params
            //     };
            //     pLoadResp = await _mUtils.preparePayload('BW', _uParams);
            //     if (!pLoadResp.success) {
            //         return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
            //     }
            // }
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
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            let empData;
            let shouldCallInsertUpdateUser = false;
            mongoMapper('cm_doctors', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                // if (req.body.params.locations && req.body.params.locations[0] && (!req.body.params.locations[0]._id || (req.body.params.locations[0]._id && req.body.params.locations[0].recStatus === true || req.body.params.locations[0].recStatus === false))) {
                //     let _lData = _.pick(req.body.params.locations[0], '_id', 'locId', 'locName', 'roleId', 'roleName', 'recStatus');
                //     let empData = {
                //         _id: req.body.params._id,
                //         loc: _lData
                //     }
                //     let _userRep = await insertAndUpdateUser("U", req, empData);
                //     if (!(_userRep && _userRep.success)) {
                //         return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                //     }
                // }
                if (req.body.params.locations && req.body.params.locations[0] && (!req.body.params.locations[0]._id || (req.body.params.locations[0]._id && req.body.params.locations[0].recStatus === true || req.body.params.locations[0].recStatus === false))) {
                    let _lData = _.pick(req.body.params.locations[0], '_id', 'locId', 'locName', 'roleId', 'roleName', 'recStatus');
                    empData = {
                        _id: req.body.params._id,
                        loc: _lData
                    };
                    shouldCallInsertUpdateUser = true;
                } else if (req.body.params.flag == 'D') {
                    empData = {
                        _id: req.body.params._id,
                        flag: req.body.params.flag
                    };
                    shouldCallInsertUpdateUser = true;
                }
                if (shouldCallInsertUpdateUser) {
                    _userRep = await insertAndUpdateUser("U", req, empData);
                    if (!(_userRep && _userRep.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                    }
                }
                //}
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
router.post("/insert-document", async (req, res) => {
    try {
        req.body.params.orgId = req.tokenData.orgId;
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Document' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["cd"] = _seqResp.data;
        mongoMapper('cm_documents', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get Documents */
router.post("/get-document", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_documents", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Documents */
router.post("/update-document", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _filter = { "filter": [] }
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_documents", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_documents', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('cm_documents', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                if (Object.keys(JSON.parse(JSON.stringify(result.data))).length > 0) {
                    _filter.filter = [
                        {
                            $project: { _id: 1, orgId: 1, label: 1, revNo: 1, docmntMap: { $filter: { input: "$docmntMap", cond: { $eq: ["$$this.documentId", JSON.parse(JSON.stringify(result.data))._id] } } } }
                        }
                    ]
                    let _rResp = await _mUtils.commonMonogoCall("cm_roles", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
                    let _finalData = _.filter(_rResp.data, (_o, _i) => { return _o.docmntMap.length > 0 })
                    let _indx = 0;
                    while (_indx < _finalData.length) {
                        let _docParams = {
                            "params": {
                                "_id": _finalData[_indx]._id,
                                "revNo": _finalData[_indx].revNo + 1,
                                "docmntMap": [],
                                "audit": {
                                    modifiedById: req.tokenData.userId,
                                    modifiedBy: req.tokenData.displayName,
                                    modifiedDt: new Date().toISOString()
                                }
                            }
                        }
                        let _obj = {}
                        _.each(_finalData[_indx].docmntMap, (_o, _i) => {
                            _.each(_o, (_v, _k) => {
                                _.each(req.body.params, (_v1, _k1) => {
                                    if (_k == "_id") {
                                        _obj[_k] = _v
                                    } else {
                                        if (_k1 != "_id" && _k1 != "revNo" && (_k == _k1)) {
                                            _obj[_k1] = _v1
                                        }
                                    }
                                })
                            })
                            _docParams.params.docmntMap.push(_obj)
                        })
                        pLoadResp = { payload: {} };
                        pLoadResp = await _mUtils.preparePayload("BW", _docParams);
                        if (!pLoadResp.success) {
                            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                        }
                        let _uResp = await _mUtils.commonMonogoCall("cm_roles", "bulkWrite", pLoadResp.payload, "", req.body, "", req.tokenData.dbType)
                        _indx++;
                    }

                }
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

/**Insert Speciality */
router.post("/insert-speciality", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Speciality", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_speciality", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_speciality', _query, _params, req.tokenData.dbType).then((result) => {
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

/**upload document */
// router.post("/upload-document", async (req, res) => {
//     try {
//         if (req.body.params._id && req.body.params.UMR && req.body.params.docs) {
//             let _patient = await _mUtils.commonMonogoCall("cm_patients", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
//             if (!(_patient && _patient.success)) {
//                 return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
//             }
//             let _clnDocs = JSON.parse(JSON.stringify(req.body.params));
//             delete req.body.params.supporttedObj;
//             _.each(req.body.params.docs, (_doc) => {
//                 let _base64data = _doc.docData.replace(/^data:.*,/, '');

//                 _doc["UMR"] = req.body.params.UMR;
//                 _doc["admnNo"] = req.body.params.admnNo || "";
//                 _doc["admnDt"] = req.body.params.admnDt || "";
//                 _doc["docMimeType"] = _doc.docData.split(',')[0];
//                 _doc["docData"] = "";
//                 _doc["path"] = "";
//                 _doc["documentedId"] = req.tokenData.userId || "";
//                 _doc["documentedBy"] = req.tokenData.userName || "";
//                 _doc["orgId"] = req.tokenData.orgId;
//                 _doc["locId"] = req.tokenData.locId;
//                 _doc["audit"] = req.body.params.audit;   
//                 if (_doc.format == 'png' || _doc.format == 'jpg' || _doc.format == 'jpeg') {
//                     _doc["docData"] = new Buffer.from(_base64data, 'base64');
//                 }
//                 else {
//                     let _binaryData = Buffer.from(_base64data, 'base64');
//                     let _filePath = `${req.clientUrls.orgName.replace(/\s/g, '_')}/${req.body.params.UMR}`;
//                     if (req.body.params.admnNo && req.body.params.admnNo.length > 0) {
//                         _filePath += `/${req.body.params.admnNo}`;
//                     }
//                     if (_doc.surgName && _doc.surgName.length > 0) {
//                         _filePath += `/${_doc.surgName.replace(/\s/g, '_')}_${moment(new Date(_doc.surgDt)).format('DD-MMM-YYYY')}`;
//                     }
//                     _filePath += `/${_doc.docName.replace(/\.[^/.]+$/, "").replace(/\s/g, '_')}_${Date.now()}.${_doc.format}`;
//                     let _physicalPath = `${req.clientUrls.documentPhysicalPath}/${_filePath}`;
//                     fse.outputFile(_physicalPath, _binaryData, 'binary')
//                         .then(() => {
//                             console.log('The file has been saved!');
//                         }) 
//                         .catch(err => {
//                             console.error("error save", err)
//                         });
//                     _doc["path"] = `${req.clientUrls.documentPathUrl}/${_filePath}`;
//                 }
//             });

//             mongoMapper("cm_uploadDocuments", "insertMany", req.body.params.docs,req.tokenData.dbType).then(async (result) => {
//                 if (!(result.data && result.data.length > 0)) {
//                     return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
//                 }
//                 _.map(result.data, (_rObj) => {
//                     _.map(_clnDocs.docs, async (_doc) => {
//                         if (_rObj.docName == _doc.docName) {
//                             try {
//                                 let _extension = _doc.docData.split(';')[0].split('/')[1];
//                                 let _docData = { success: false, data: [] };
//                                 if (_extension == 'png' || _extension == 'jpg' || _extension == 'jpeg') {
//                                     _docData = await compressDocument(_doc.docData, _doc.docName);
//                                 }
//                                 else {
//                                     _docData.success = true;
//                                     _docData.data = "";
//                                     _docData.name = _doc.docName;
//                                 }
//                                 let _mimeType = await _doc.docData.split(',')[0];
//                                 if (_docData.success && _doc.docName == _docData.name) {
//                                     let _patObj = {
//                                         params: {
//                                             _id: _clnDocs._id,
//                                             document:
//                                             {
//                                                 docId: _rObj._id || "",
//                                                 admNo: req.body.params.admnNo || "",
//                                                 admnDt: req.body.params.admnDt || "",
//                                                 docName: _doc.docName,
//                                                 docType: _doc.docType,
//                                                 format: _doc.format,
//                                                 docData: _docData.data,
//                                                 docMimeType: _mimeType,
//                                                 remarks: _doc.remarks,
//                                                 size:_doc.size,
//                                                 isImage: _doc.isImage,
//                                                 path: _rObj.path || "",
//                                                 surgId: _doc.surgId,
//                                                 surgName: _doc.surgName,
//                                                 surgDt: _doc.surgDt,
//                                                 documentedId: req.tokenData.userId || "",
//                                                 documentedBy: req.tokenData.userName || ""
//                                             }
//                                         }
//                                     }
//                                     if (_doc.followupId && _doc.followupNo) {
//                                         _patObj.params.document.followupId = _doc.followupId || "";
//                                         _patObj.params.document.followupNo = _doc.followupNo || "";
//                                         _patObj.params.document.followupOn = _doc.followupOn || "";
//                                         _patObj.params.document.followupDate = _doc.followupDate || "";
//                                     }
//                                     let pLoadResp = { payload: {} };
//                                     pLoadResp = await _mUtils.preparePayload('IAU', _patObj);
//                                     if (!pLoadResp.success) {
//                                         // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
//                                     }

//                                     let _patUpdate = await _mUtils.commonMonogoCall("cm_patients", "updateOne", pLoadResp.payload, "", "","",req.tokenData.dbType)
//                                     if (!(_patUpdate && _patUpdate.success)) {
//                                         // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
//                                     }
//                                 }
//                             }
//                             catch (err) {

//                             }
//                         }
//                     });
//                 });

//                 // let _clnSurg = JSON.parse(JSON.stringify(_patient.data.surgeries));
//                 // let _filteredSurgData = _.filter(_clnSurg, (_o) => { return _o._id == _clnDocs.supporttedObj.selPatSurgId });
//                 // if (_filteredSurgData && _filteredSurgData.length > 0) {
//                 //     if (_filteredSurgData[0].progressStatus != 'COMPLETED') {
//                 //         let _mandStatus = _.pick(_filteredSurgData[0], 'scores', 'intraOperative', 'preOperative', 'prosthesis');
//                 //         let _status = _.filter(_mandStatus, (_o) => { return !_o });
//                 //         let _patObj = {
//                 //             params: {
//                 //                 _id: _clnDocs.patientId,
//                 //                 surgeries: [{
//                 //                     _id: _clnDocs.supporttedObj.selPatSurgId,
//                 //                     documents: true,
//                 //                     progressStatus: _status.length == 0 ? 'COMPLETED' : 'PENDING'
//                 //                 }]
//                 //             }
//                 //         };
//                 //         let pLoadResp = { payload: {} };
//                 //         pLoadResp = await preparePayload('BW', _patObj);
//                 //         if (!pLoadResp.success) {
//                 //             // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
//                 //         }
//                 //         let _patUpdate = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", "")
//                 //         if (!(_patUpdate && _patUpdate.success)) {
//                 //             // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
//                 //         }
//                 //     }
//                 // }

//                 return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });

//             }).catch((error) => {
//                 return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
//             });
//         }
//         else {
//             return res.status(400).json({ status: 'FAIL', desc: "Require Parameters ..", data: [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ status: 'FAIL', desc: error });
//     }
// });

router.post("/upload-document", async (req, res) => {
    try {
        if (req.body.params._id && req.body.params.UMR && req.body.params.docs) {
            let _patient = await _mUtils.commonMonogoCall("cm_patients", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }
            let _clnDocs = JSON.parse(JSON.stringify(req.body.params));
            delete req.body.params.supporttedObj;
            _.each(req.body.params.docs, (_doc) => {
                _.each(_doc.docData, (_docDocObj, _docDocIndx) => {
                    let _base64data = _docDocObj.docInfo.replace(/^data:.*,/, '');
                    _docDocObj["docMimeType"] = _docDocObj.docInfo.split(',')[0];
                    _docDocObj["docData"] = "";
                    _docDocObj["path"] = "";
                    _docDocObj["documentedId"] = req.tokenData.userId || "";
                    _docDocObj["documentedBy"] = req.tokenData.userName || "";

                    if (_docDocObj.format == 'png' || _docDocObj.format == 'jpg' || _docDocObj.format == 'jpeg') {
                        _docDocObj["docInfo"] = new Buffer.from(_base64data, 'base64');
                    }
                    else {
                        let _binaryData = Buffer.from(_base64data, 'base64');
                        let _filePath = `${req.clientUrls.orgName.replace(/\s/g, '_')}/${req.body.params.UMR}`;
                        if (req.body.params.admnNo && req.body.params.admnNo.length > 0) {
                            _filePath += `/${req.body.params.admnNo}`;
                        }
                        if (_docDocObj.surgName && _docDocObj.surgName.length > 0) {
                            _filePath += `/${_docDocObj.surgName.replace(/\s/g, '_')}_${moment(new Date(_docDocObj.surgDt)).format('DD-MMM-YYYY')}`;
                        }
                        _filePath += `/${_docDocObj.docName.replace(/\.[^/.]+$/, "").replace(/\s/g, '_')}_${Date.now()}.${_docDocObj.format}`;
                        let _physicalPath = `${req.clientUrls.documentPhysicalPath}/${_filePath}`;
                        fse.outputFile(_physicalPath, _binaryData, 'binary')
                            .then(() => {
                                console.log('The file has been saved!');
                            })
                            .catch(err => {
                                console.error("error save", err)
                            });
                        _docDocObj["path"] = `${req.clientUrls.documentPathUrl}/${_filePath}`;
                    }

                })
                _doc["UMR"] = req.body.params.UMR;
                _doc["admnNo"] = req.body.params.admnNo || "";
                _doc["admnDt"] = req.body.params.admnDt || "";
                _doc["audit"] = req.body.params.audit;
                _doc["orgId"] = req.tokenData.orgId;
                _doc["locId"] = req.tokenData.locId;

            });

            mongoMapper("cm_uploadDocuments", "insertMany", req.body.params.docs, req.tokenData.dbType).then(async (result) => {
                if (!(result.data && result.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }

                let _documentsData = []
                let _resultdocEqualData;
                let _indx = 0
                let _indx1 = 0
                while (_clnDocs.docs.length > _indx) {
                    while (_clnDocs.docs[_indx].docData.length > _indx1) {
                        let _extension = _clnDocs.docs[_indx].docData[_indx1].docInfo.split(';')[0].split('/')[1];
                        let _docData = { success: false, data: [] };
                        if (_extension == 'png' || _extension == 'jpg' || _extension == 'jpeg') {
                            _docData = await compressDocument(_clnDocs.docs[_indx].docData[_indx1].docInfo, _clnDocs.docs[_indx].docData[_indx1].docName);
                        } else {
                            _docData.success = true;
                            _docData.data = "";
                            _docData.name = _docObj.docName;
                        }
                        let _mimeType = await _clnDocs.docs[_indx].docData[_indx1].docInfo.split(',')[0];

                        let _resultInfo = _.filter(JSON.parse(JSON.stringify(result.data)), (_rObj) => {
                            _.filter(_rObj.docData, (_rObjDocO) => {
                                if (_clnDocs.docs[_indx].docData[_indx1].docName == _rObjDocO.docName) {
                                    _resultdocEqualData = _rObjDocO
                                }
                            })
                        })
                        _documentsData.push({
                            docId: _resultdocEqualData._id || "",
                            admNo: req.body.params.admnNo || "",
                            admnDt: req.body.params.admnDt || "",
                            docName: _clnDocs.docs[_indx].docData[_indx1].docName,
                            docType: _clnDocs.docs[_indx].docData[_indx1].docType,
                            format: _clnDocs.docs[_indx].docData[_indx1].format,
                            docInfo: _docData.data,
                            docMimeType: _mimeType,
                            remarks: _clnDocs.docs[_indx].docData[_indx1].remarks,
                            size: _clnDocs.docs[_indx].docData[_indx1].size,
                            isImage: _clnDocs.docs[_indx].docData[_indx1].isImage,
                            path: _resultdocEqualData.path || "",
                            surgId: _clnDocs.docs[_indx].docData[_indx1].surgId,
                            surgName: _clnDocs.docs[_indx].docData[_indx1].surgName,
                            surgDt: _clnDocs.docs[_indx].docData[_indx1].surgDt,
                            documentedId: req.tokenData.userId || "",
                            documentedBy: req.tokenData.userName || ""
                        })
                        _indx1++;
                    }
                    let _patObj = {
                        params: {
                            _id: _clnDocs._id,
                            document: [{
                                "UMR": _clnDocs.UMR,
                                "orgId": req.tokenData.orgId,
                                "locId": req.tokenData.locId,
                                docData: _documentsData
                            }]
                        }
                    }
                    let pLoadResp = { payload: {} };
                    pLoadResp = await _mUtils.preparePayload('IAU', _patObj);
                    if (!pLoadResp.success) {
                        // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                    }
                    let _patUpdate = await _mUtils.commonMonogoCall("cm_patients", "updateOne", pLoadResp.payload, "", "", "", req.tokenData.dbType)
                    if (!(_patUpdate && _patUpdate.success)) {
                        // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                    }
                    _indx++;
                }

                // _.map(result.data, async (_rObj) => {
                //     _.map(JSON.parse(JSON.stringify(_rObj.docData)), async (_rObjDocO) => {
                //         _.map(_clnDocs.docs, async (_doc) => {
                //             _.map(_doc.docData, async (_docObj) => {
                //                 if (_rObjDocO.docName == _docObj.docName) {
                //                     try {
                //                         let _extension = _docObj.docInfo.split(';')[0].split('/')[1];
                //                         let _docData = { success: false, data: [] };
                //                         if (_extension == 'png' || _extension == 'jpg' || _extension == 'jpeg') {
                //                             _docData = await compressDocument(_docObj.docInfo, _docObj.docName);
                //                         }
                //                         else {
                //                             _docData.success = true;
                //                             _docData.data = "";
                //                             _docData.name = _docObj.docName;
                //                         }
                //                         let _mimeType = await _docObj.docInfo.split(',')[0];
                //                         if (_docData.success && _docObj.docName == _docData.name) {
                //                             _documentsData.push({
                //                                 docId: _rObjDocO._id || "",
                //                                 admNo: req.body.params.admnNo || "",
                //                                 admnDt: req.body.params.admnDt || "",
                //                                 docName: _docObj.docName,
                //                                 docType: _docObj.docType,
                //                                 format: _docObj.format,
                //                                 docData: _docObj.docInfo,
                //                                 docMimeType: _mimeType,
                //                                 remarks: _docObj.remarks,
                //                                 size: _docObj.size,
                //                                 isImage: _docObj.isImage,
                //                                 path: _rObjDocO.path || "",
                //                                 surgId: _docObj.surgId,
                //                                 surgName: _docObj.surgName,
                //                                 surgDt: _docObj.surgDt,
                //                                 documentedId: req.tokenData.userId || "",
                //                                 documentedBy: req.tokenData.userName || ""
                //                             })
                //                             console.log("shjd",_documentsData)



                //                             // let _patObj = {
                //                             //     params: {
                //                             //         _id: _clnDocs._id,
                //                             //         document:
                //                             //         {
                //                             //             docId: _rObj._id || "",
                //                             //             admNo: req.body.params.admnNo || "",
                //                             //             admnDt: req.body.params.admnDt || "",
                //                             //             docName: _doc.docName,
                //                             //             docType: _doc.docType,
                //                             //             format: _doc.format,
                //                             //             docData: _docData.data,
                //                             //             docMimeType: _mimeType,
                //                             //             remarks: _doc.remarks,
                //                             //             size:_doc.size,
                //                             //             isImage: _doc.isImage,
                //                             //             path: _rObj.path || "",
                //                             //             surgId: _doc.surgId,
                //                             //             surgName: _doc.surgName,
                //                             //             surgDt: _doc.surgDt,
                //                             //             documentedId: req.tokenData.userId || "",
                //                             //             documentedBy: req.tokenData.userName || ""
                //                             //         }
                //                             //     }
                //                             // }
                //                             // if (_doc.followupId && _doc.followupNo) {
                //                             //     _patObj.params.document.followupId = _doc.followupId || "";
                //                             //     _patObj.params.document.followupNo = _doc.followupNo || "";
                //                             //     _patObj.params.document.followupOn = _doc.followupOn || "";
                //                             //     _patObj.params.document.followupDate = _doc.followupDate || "";
                //                             // }
                //                             // let pLoadResp = { payload: {} };
                //                             // pLoadResp = await _mUtils.preparePayload('IAU', _patObj);
                //                             // if (!pLoadResp.success) {
                //                             //     // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                //                             // }

                //                             // let _patUpdate = await _mUtils.commonMonogoCall("cm_patients", "updateOne", pLoadResp.payload, "", "","",req.tokenData.dbType)
                //                             // if (!(_patUpdate && _patUpdate.success)) {
                //                             //     // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                //                             // }
                //                         }
                //                     }
                //                     catch (err) {
                //                       console.log(err)
                //                     }
                //                 }
                //             })

                //         });
                //     })
                // });


                // let _clnSurg = JSON.parse(JSON.stringify(_patient.data.surgeries));
                // let _filteredSurgData = _.filter(_clnSurg, (_o) => { return _o._id == _clnDocs.supporttedObj.selPatSurgId });
                // if (_filteredSurgData && _filteredSurgData.length > 0) {
                //     if (_filteredSurgData[0].progressStatus != 'COMPLETED') {
                //         let _mandStatus = _.pick(_filteredSurgData[0], 'scores', 'intraOperative', 'preOperative', 'prosthesis');
                //         let _status = _.filter(_mandStatus, (_o) => { return !_o });
                //         let _patObj = {
                //             params: {
                //                 _id: _clnDocs.patientId,
                //                 surgeries: [{
                //                     _id: _clnDocs.supporttedObj.selPatSurgId,
                //                     documents: true,
                //                     progressStatus: _status.length == 0 ? 'COMPLETED' : 'PENDING'
                //                 }]
                //             }
                //         };
                //         let pLoadResp = { payload: {} };
                //         pLoadResp = await preparePayload('BW', _patObj);
                //         if (!pLoadResp.success) {
                //             // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                //         }
                //         let _patUpdate = await commonMonogoCall("patient_care_patients", "bulkWrite", pLoadResp.payload, "", "")
                //         if (!(_patUpdate && _patUpdate.success)) {
                //             // return res.status(400).json({ status: 'FAIL', desc: _surgUpdate.desc || "", data: _surgUpdate.data || [] });
                //         }
                //     }
                // }

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
            mongoMapper("cm_patients", "find", _params, req.tokenData.dbType).then(async (result) => {
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
            mongoMapper("cm_uploadDocuments", "findById", req.body.params._id, req.tokenData.dbType).then(async (result) => {
                if (!(result.data)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _base64 = "";
                if (result.data.docData) {
                    _base64 = `${result.data.docMimeType},${await result.data.docData.toString("base64")}`;
                }
                let _resp = {
                    UMR: result.data.UMR,
                    admnNo: result.data.admnNo,
                    docName: result.data.docName,
                    docType: result.data.docType,
                    format: result.data.format,
                    remarks: result.data.remarks,
                    isImage: result.data.isImage,
                    path: result.data.path || "",
                    // surgName: result.data.surgName,
                    // surgDt: result.data.surgDt,
                    // followupId: result.data.followupId,
                    // followupNo: result.data.followupNo,
                    // followupOn: result.data.followupOn,
                    // followupDate: result.data.followupDate,
                    documentedBy: result.data.audit.documentedBy,
                    documentedId: result.data.audit.documentedId,
                    documentedDt: result.data.audit.documentedDt,
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
/* get all Medication */
router.post("/get-speciality", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history -labels.audit -labels.history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_speciality", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Speciality */
router.post("/update-speciality", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_speciality", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_speciality', _mResp.data.params, _cBody.params, req, "cm");
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_speciality', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Medication */
router.post("/insert-medication", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Medication' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["cd"] = _seqResp.data;
        mongoMapper('cm_medications', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Medication */
router.post("/get-medication", async (req, res) => {
    try {
        if (req.body && req.body.flag && !(req.body.flag == "")) {
            let _filter = { "filter": {} };
            if (req.body.flag === "G" || req.body.flag === "M") {
                if (req.body.flag === "G") {
                    let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                    _filter.filter["genericName"] = nameExp
                    mongoMapper("cm_medications", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
                if (req.body.flag === "M") {
                    let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                    _filter.filter["medName"] = nameExp
                    _filter.filter['recStatus'] = { $eq: true }
                    mongoMapper("cm_medications", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
            }
        } else {
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history"
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("cm_medications", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Medication */
router.post("/update-medication", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_medications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_medications', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('cm_medications', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Investigation */
router.post("/insert-investigation", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Investigation' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["cd"] = _seqResp.data;
        mongoMapper('cm_investigations', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Investigations */
router.post("/get-investigation", async (req, res) => {
    try {
        let selector = {
            "unitName": "$unitName",
            "unitCd": "$unitCd",
            "isApplicableFor": "$isApplicableFor",
            "isApplicableForCd": "$isApplicableForCd",
            "image": "$image",
            "isSampleNeeded": "$isSampleNeeded",
            "isAppointment": "$isAppointment",
            "isQtyEdit": "$isQtyEdit",
            "isDiet": "$isDiet",
            "isConsentForm": "$isConsentForm",
            "mandInstruct": "$mandInstruct",
            "instruction": "$instruction",
            "childAvailable": "$childAvailable",
            "containerCd": "$containerCd",
            "container": "$container",
            "specimenCd": "$specimenCd",
            "specimen": "$specimen",
            "isOutside": "$isOutside",
            "serviceGroupName": "$serviceGroupName",
            "serviceGroupCd": "$serviceGroupCd",
            "serviceTypeCd": "$serviceTypeCd",
            "serviceTypeName": "$serviceTypeName",
            "name": "$name",
            "cd": "$cd",
            "locId": "$locId",
            "parameters": {
                $filter: {
                    input: "$parameters",
                    cond: {
                        $eq: ["$$this.recStatus", true]
                    }
                }
            },
            "ageGenderRanges": "$ageGenderRanges",
            "audit": "$audit",
            "tarrif": "$tarrif",
            "revNo": "$revNo"
        }
        if (req.body && req.body.flag && req.body.flag === "search") {
            if (req.body && req.body.params && req.body.params.name && req.body.params.name.length > 2) {
                let searchData = { $regex: req.body.params.name, $options: 'i' }
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "name": searchData
                    },
                    "selectors": selector
                }
                mongoMapper("cm_investigations", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
            }
        } else {
            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": selector
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("cm_investigations", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Investigations */
router.post("/update-investigation", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_investigations", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_investigations', _mResp.data.params, _cBody.params, req);

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
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('cm_investigations', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Specialization */
router.post("/insert-specialization", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Specialization", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_specialization", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_specialization', _query, _params, req.tokenData.dbType).then((result) => {
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

/* get all Specialization */
router.post("/get-specialization", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history -labels.audit -labels.history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_specialization", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update specialization */
router.post("/update-specialization", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_specialization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_specialization', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_specialization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Complaint */
router.post("/insert-complaint", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Complaint", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_complaints", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_complaints', _query, _params, req.tokenData.dbType).then((result) => {
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

/* get all Complaint */
router.post("/get-complaint", async (req, res) => {
    try {
        let data1 = []
        let selector = {
            "orgId": "$orgId",
            "locId": "$locId",
            "labels": {
                $filter: {
                    input: "$labels",
                    cond: {
                        $eq: ["$$this.recStatus", true]
                    }
                }
            },
            "audit": "$audit",
            "revNo": "$revNo"
        }
        if (req.body && req.body.flag && req.body.flag === "search") {
            if (req.body && req.body.params) {
                let searchData = { $regex: req.body.params.searchValue, $options: 'i' }
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "labels": { $elemMatch: { label: searchData } }
                        // "$$label": searchData
                    },
                    "selectors": selector
                }
                mongoMapper("cm_complaints", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                    result['data'].filter((obj, ind) => {
                        let query = req.body.params.searchValue.toLowerCase()
                        obj['labels'].filter((obj1, ind1) => {
                            if (obj1.label.toLowerCase().includes(query)) {
                                data1.push(obj1)
                            }
                        })
                        obj.labels = []
                        obj.labels = data1
                    })
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
            }
        } else {
            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": selector
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("cm_complaints", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


/**Update Complaint */
router.post("/update-complaint", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_complaints", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_complaints', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_complaints', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Notification */
router.post("/insert-notification", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Notification", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_notifications", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_notifications', _query, _params, req.tokenData.dbType).then((result) => {
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

/* get all Notification */
router.post("/get-notification", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history -labels.audit -labels.history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_notifications", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Notification */
router.post("/update-notification", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_notifications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_notifications', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_notifications', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Allergy */
router.post("/insert-allergy", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Allergy", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_allergies", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_allergies', _query, _params, req.tokenData.dbType).then((result) => {
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

/* get all Allergy */
router.post("/get-allergy", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history -labels.audit -labels.history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_allergies", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Allergy */
router.post("/update-allergy", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_allergies", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_allergies', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_allergies', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert labels */
router.post("/insert-label", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.locId && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            let _gcResp = await generateSeqCode(req.body.params.labels, 0, [], "Labels", req);
            if (_gcResp && !_gcResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            }
            req.body.params.labels = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "orgId": req.body.params.orgId, "locId": req.body.params.locId, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_labels", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_labels', _query, _params, req.tokenData.dbType).then((result) => {
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

/* get all labels */
router.post("/get-label", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": true },
            //  "selectors": "-history -labels.audit -labels.history"
            "selectors": {
                "orgId": "$orgId",
                "locId": "$locId",
                "userId": "$userId",
                "labels": {
                    $filter: {
                        input: "$labels",
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
        mongoMapper("cm_labels", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update labels */
router.post("/update-label", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_labels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_labels', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, (_l) => {
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_labels', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Entity */
router.post("/insert-entity", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.child && req.body.params.child.length > 0) {
            // req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "child");
            // let _gcResp = await generateSeqCode(req.body.params.child, 0, [], "Entity", req);
            // if (_gcResp && !_gcResp.success) {
            //     return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
            // }
            // req.body.params.child = _gcResp.data;
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "cd": req.body.params.cd, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_entity", "find", _filter, "", "", "", req.tokenData.dbType);
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('cm_entity', _query, _params, req.tokenData.dbType).then((result) => {
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

/*Buk Insert Entity */
router.post("/bulk-insert-entity", async (req, res) => {
    try {
        let _query = "insertMany";
        mongoMapper('cm_entity', _query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
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
        mongoMapper("cm_entity", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            if (result.data.length > 0) {
                let _resultData = JSON.parse(JSON.stringify(result.data))
                let _filterData = _.filter(_resultData, (_obj, _indx) => { return _obj.cd === "FREQUENCY" || _obj.cd === "DURATION" || _obj.cd === "INSTRUCTIONS" })
                if (_filterData.length > 0) {
                    _.each(_filterData, (_fo, _fi) => {
                        if (_fo.child.length > 0) {
                            _.each(_fo.child, (_foc, _foi) => {
                                if (_foc.lang.length > 0) {
                                    _.each(_foc.lang, (_focl, _focli) => {
                                        _foc[_focl.label] = _focl.value && _focl.value.length > 0 ? _focl.value : "";
                                    })
                                }
                                delete _foc.lang
                                // console.log("_foc", _foc)
                            })
                        }
                        let _indxNum = _.findIndex(_resultData, (_oi) => { return _oi.cd === _fo.cd })
                        _resultData[_indxNum] = _filterData[_fi];
                    })

                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _resultData })
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Entity */
router.post("/update-entity", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_entity", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_entity', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.child) {
                    _.each(_cBody.params.child, (_l, _i) => {
                        if (_l._id) {
                            _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                            _l["history"] = {
                                "revNo": _hResp.data[0].revNo,
                                "revTranId": _hResp.data[0]._id
                            }

                            let __id = JSON.parse(JSON.stringify(_l._id));
                            delete _l._id
                            let keyValues = Object.entries(_l);
                            keyValues.splice(0, 0, ["_id", __id]);
                            let newObj = Object.fromEntries(keyValues)
                            _cBody.params.child[_i] = JSON.parse(JSON.stringify(newObj))


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
                // pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('cm_entity', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Counter */
router.post("/insert-counter", async (req, res) => {
    try {
        req.body.params.locId = req.tokenData.locId;
        req.body.params.locName = req.tokenData.locName;
        mongoMapper('cm_counters', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


/**Insert Patient */
router.post("/insert-patient", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'UMR' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["UMR"] = _seqResp.data;
        mongoMapper('cm_patients', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
            if (req.body.params.visitId) {
                let patientUpdateappointment = await updateVisitsOrBillData(result.data[0].UMR, "UPDATE_APPOINTMENT", "", req, result.data);
                if (!(patientUpdateappointment && patientUpdateappointment.success)) {
                    console.log("Error Occured while updating appointments details to Patient");
                }
                let _obj = {
                    "visitId": patientUpdateappointment.data._id,
                    "dateTime": req.body.params.visitId ? patientUpdateappointment.data.audit.documentedDt : patientUpdateappointment.data.audit.documentedDt,
                    "docName": req.body.params.visitId ? `${patientUpdateappointment.data.docDetails.name} ${patientUpdateappointment.data.docDetails.name}` : `${patientUpdateappointment.data.docDetails.name} ${patientUpdateappointment.data.docDetails.name}`,
                    "docId": req.body.params.visitId ? patientUpdateappointment.data.docDetails.docId : patientUpdateappointment.data.docDetails.docId,
                    "locId": req.body.params.visitId ? patientUpdateappointment.data.locId : patientUpdateappointment.data.locId,
                    "visit": "OP",
                    "visitNo": req.body.params.visitId ? patientUpdateappointment.data.code : patientUpdateappointment.data.cod || "",
                    "status": req.body.params.visitId ? patientUpdateappointment.data.status : patientUpdateappointment.data.status,

                };
                let _patResp = await updateVisitsOrBillData(result.data[0].UMR, "VISITS", _obj, req);
                if (!(_patResp && _patResp.success)) {
                    console.log("Error Occured while updating Visits details to Patient");
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _patResp.data });
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Entity */
router.post("/get-patient-search", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.flag && (req.body.params.flag === 'NAME' || req.body.params.flag == 'MOB' || req.body.params.flag == 'UMR' || req.body.params.flag == 'VSTID' || req.body.params.flag === 'VSTNO') && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "isExpired": false
                },
                "selectors": "-history"
            };
            if (req.body.params.flag == 'UMR') {
                _filter.filter["UMR"] = new RegExp('.*' + req.body.params.searchValue.toUpperCase() + '.*');

            } else if (req.body.params.flag == 'NAME') {
                _filter.filter["dispName"] = { $regex: new RegExp(req.body.params.searchValue, "i") };
            } else if (req.body.params.flag == 'VSTID') {
                _filter.filter["visits"] = { $elemMatch: { visitId: { $regex: req.body.params.searchValue, $options: 'i' } } }
            } else if (req.body.params.flag == 'VSTNO') {
                _filter.filter["visits"] = { $elemMatch: { visitNo: { $regex: req.body.params.searchValue, $options: 'i' } } }
            } else if (req.body.params.flag == 'MOB') {
                _filter.filter["mobile"] = { $regex: new RegExp(req.body.params.searchValue, "i") };
            }
            mongoMapper("cm_patients", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                if (req.body.params.flag == 'VSTID' || req.body.params.flag == 'VSTNO') {
                    let dta = []
                    _.filter(result.data, (obj, ind) => {
                        _.filter(obj.visits, (obj1) => {
                            if (req.body.params.flag == 'VSTID' && obj1.visitId.includes(req.body.params.searchValue)) {
                                dta.push(obj1)
                                obj.visits = dta
                            } else if (req.body.params.flag == 'VSTNO' && obj1.visitNo.includes(req.body.params.searchValue)) {
                                dta.push(obj1)
                                obj.visits = dta

                            }
                        })
                        obj.visits = _.sortBy(obj.visits, function (o) { return o.dateTime }).reverse()
                    })
                } else {
                    _.each(result.data, (obj, ind) => {
                        obj.visits = _.sortBy(obj.visits, function (o) { return o.dateTime }).reverse()
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/get-patients", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            limit: 500,
            "selectors": {
                "_id": "$_id",
                "revNo": "$revNo",
                "recStatus": "$recStatus",
                "outStandingDue": "$outStandingDue",
                "tokenNumber": "$tokenNumber",
                "registDt": "$registDt",
                "registExpireDt": "$registExpireDt",
                "titleCd": "$titleCd",
                "titleName": "$titleName",
                "payerTypeCd": "$payerTypeCd",
                "payerTypeName": "$payerTypeName",
                "crpType": "$crpType",
                "crpName": "$crpName",
                "UMR": "$UMR",
                "fName": "$fName",
                "mName": "$mName",
                "lName": "$lName",
                "dispName": "$dispName",
                "genderCd": "$genderCd",
                "gender": "$gender",
                "dob": "$dob",
                "age": "$age",
                "ageVal": "$ageVal",
                "ageEntry": "$ageEntry",
                "bloodGroupCd": "$bloodGroupCd",
                "bloodGroupName": "$bloodGroupName",
                "emailID": "$emailID",
                "userName": "$userName",
                "maritalStatusCd": "$maritalStatusCd",
                "maritalStatus": "$maritalStatus",
                "prefferedLanquage": "$prefferedLanquage",
                // "religion": "$religion",
                "religionCd": "$religionCd",
                "religionName": "$religionName",
                "respPersonType": "$respPersonType",
                "respPersonName": "$respPersonName",
                "respPersonCd": "$respPersonCd",
                "nationalityName": "$nationalityName",
                "nationalityCd": "$nationalityCd",
                "motherMaidenName": "$motherMaidenName",
                "isVIP": "$isVIP",
                "isExpired": "$isExpired",
                "expiredDt": "$expiredDt",
                "adharNo": "$adharNo",
                "passport": "$passport",
                "fromArea": "$fromArea",
                "photo": "$photo",
                "signature": "$signature",
                "proofUpload": "$proofUpload",
                "phone": "$phone",
                "mobile": "$mobile",
                "languages": {
                    $filter: {
                        input: "$languages",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "identifications": "$identifications",
                "homeAddress": "$homeAddress",
                "patProof": "$patProof",
                "commuAddress": "$commuAddress",
                "policy": "$policy",
                "visits": "$visits",
                "visitTrans": "$visitTrans",
                "bills": "$bills",
                "loggedInDetls": "$loggedInDetls",
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_patients", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            _.each(result.data, (obj, ind) => {
                obj.visits = _.sortBy(obj.visits, function (o) { return o.dateTime }).reverse()
            })
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

async function patientDashBoardGetData(_data, _indx, _output, req, _filter, _filterData) {
    try {
        if (_data.length > _indx) {
            let _indx1 = 0
            while (_filterData.length > _indx1) {
                _filter = {
                    filter: [
                        {
                            $match: { recStatus: { $eq: true }, UMR: req.body.params.UMR }
                        }
                    ]
                }
                if (_filterData[_indx1]._collName == "appointments") {
                    _filter.filter[0].$match["audit.documentedDt"] = {
                        $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
                        $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()
                    }
                } else if (_filterData[_indx1]._collName == "investigation_tran" || _filterData[_indx1]._collName == "medications_tran") {
                    let _imIndx = 0
                    let _getReverseData = _data[0].visits.reverse()
                    while (_getReverseData.length > _imIndx) {
                        _filter.filter[0].$match['visitNo'] = _getReverseData[_imIndx].visitNo
                        let _imResp = await _mUtils.commonMonogoCall(`cm_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
                        if (_imResp && _imResp.data.length > 0) {
                            _data[_indx][`${_filterData[_indx1]._collName}`] = _imResp.data
                            break;
                        }
                        _imIndx++
                    }
                } else if (_filterData[_indx1]._collName == "transactions") {
                    let _tranResp = await _mUtils.commonMonogoCall(`cm_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
                    if (!(_tranResp && _tranResp.success)) {
                        // return res.status(400).json({ success: false, status: 400, desc: _mRespDataProduct.desc || "", data: _mRespDataProduct.data || [] });
                    } else {
                        _data[_indx][`${_filterData[_indx1]._collName}`] = _tranResp.data
                        _data[_indx]['ICD'] = []
                        _data[_indx]['Diagnosis'] = []
                        if (_tranResp.data.length > 0) {
                            _.each(_tranResp.data, (_o, _i) => {
                                _.each(_o.data, (_o1, _i1) => {
                                    if (_o1.type == "ICD" && _o1.child.length > 0) {
                                        _.each(_o1.child, (_oc, _oci) => {
                                            _data[_indx]['ICD'].push(_oc)
                                        })
                                    } else if (_o1.type == "LABELS" && _o1.child.length > 0) {
                                        // let _diagonasisdata = _.filter(_o1.child,(_dio,_dioi)=>{return _dio.name=="Diagnosis"})
                                        _.each(_o1.child, (_dio, _dioi) => {
                                            if (_dio.name == "Diagnosis") {
                                                _data[_indx]['Diagnosis'].push(_dio)
                                            }
                                        })

                                    }
                                })
                            })
                        }
                    }
                }

                if (_filterData[_indx1]._collName != "transactions" && _filterData[_indx1]._collName != "investigation_tran" && _filterData[_indx1]._collName != "medications_tran") {
                    let _eResp = await _mUtils.commonMonogoCall(`cm_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
                    if (!(_eResp && _eResp.success)) {
                        // return res.status(400).json({ success: false, status: 400, desc: _mRespDataProduct.desc || "", data: _mRespDataProduct.data || [] });
                    } else {
                        if (_eResp.data.length > 0) {
                            _data[_indx][`${_filterData[_indx1]._collName}`] = _eResp.data
                        }
                    }
                }

                _indx1++;
            }
            _output.push(_data[_indx])
            _indx = _indx + 1;
            await patientDashBoardGetData(_data, _indx, _output, req, _filter, _filterData);
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

router.post('/get-patient-dashboard', async (req, res) => {
    try {
        let _filter = {
            filter: [
                {
                    $match: { recStatus: { $eq: true }, UMR: req.body.params.UMR }
                }
            ]
        }
        let _patientDashBoardGetData = []
        let _eResp = await _mUtils.commonMonogoCall("cm_patients", "aggregation", _filter, "", "", "", req.tokenData.dbType);
        if (!(_eResp && _eResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _eResp.desc || "", data: _eResp.data || [] });
        }
        else {
            let _reqArrey = [
                {
                    _collName: "investigation_tran"

                },
                {
                    _collName: "medications_tran"
                },
                {
                    _collName: "labresults"
                },
                {
                    _collName: "transactions"
                },
                {
                    _collName: "appointments"
                },
                {
                    _collName: "vitals_tran"
                }
            ]
            _patientDashBoardGetData = await patientDashBoardGetData(_eResp.data, 0, [], req, _filter, _reqArrey)
        }
        return res.status(200).json({ success: true, status: 200, desc: '', data: _patientDashBoardGetData.data });
    } catch (error) {

    }
})

/**Update Patient */
router.post("/update-patient", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_patients", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_patients', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('cm_patients', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

//**Insert LabelMap  */
router.post("/insert-label-map", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.labels && req.body.params.labels.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            mongoMapper('cm_labelsmaps', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

/**Get LabelMap */
router.post("/get-label-map", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": true
            },
            "selectors": {
                "documentId": "$documentId",
                "documentName": "$documentName",
                "settings": "$settings",
                "labels": {
                    $filter: {
                        input: "$labels",
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
        mongoMapper("cm_labelsmaps", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            if (!(result && result.data)) {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            }
            let _resp = JSON.parse(JSON.stringify(result))
            const matchedOrg = _orgDetails.find(org => org.orgKey === req.tokenData.dbType);
            if (matchedOrg) {
                // console.log("_resp.data[0].labels", _resp.data[0].labels)
                const labelsArray = _resp.data[0].labels;
                const displayOrderMap = {
                    "Vitals": 1,
                    "Investigations": 2,
                    "Medications": 3,
                    "Diagnosis": 4,
                    "Complaints": 5,
                    "ICD": 6,
                    "Notes": 7,
                    "Lab Results": 8,
                }
                labelsArray.forEach(label => {
                    const matchedLabel = matchedOrg.fieldsSettings.find(orgLabel =>
                        orgLabel.labelName.toLowerCase() === label.lblName.toLowerCase()
                    );
                    if (matchedLabel) {
                        const hasTrueField = Object.values(matchedLabel.fields).some(value => value === true);
                        if (hasTrueField) {
                            label['fieldsSettings'] = matchedLabel.fields;
                        }
                    }
                    if (displayOrderMap[label.lblName]) {
                        label['displayOrder'] = displayOrderMap[label.lblName];
                    } else {
                        label['displayOrder'] = 0;
                    }
                });
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _resp.data });
        }).catch((error) => {
            //console.log("error", error)
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update LabelMap */
router.post("/update-label-map", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_labelsmaps", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_labelsmaps', _mResp.data.params, _cBody.params, req, "cm");
            let pLoadResp = { payload: {} };

            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.labels) {
                    _.each(_cBody.params.labels, async (_l) => {
                        if (_l._id) {
                            _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                            _l["history"] = {
                                "revNo": _hResp.data[0].revNo,
                                "revTranId": _hResp.data[0]._id
                            }
                        }
                        else {
                            let data = [];
                            _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                            data.push(_l)
                            let _gcResp = await generateSeqCode(data, 0, [], "Labelmap", req);
                            if (_gcResp && !_gcResp.success) {
                                return res.status(400).json({ success: false, status: 400, desc: "Error occured while generating Sequence Codes..", data: [] });
                            }
                            _cBody.params.labels = _gcResp.data;
                        }
                    });
                }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('cm_labelsmaps', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Bill */
router.post("/insert-bill", async (req, res) => {
    try {
        let _filter = { filter: [] }
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Bills' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        let invoiceNum = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Invoice' }, "cm", req);
        req.body.params["invoiceNo"] = invoiceNum.data;
        req.body.params['visit'] = "OP"
        req.body.params["billNo"] = _seqResp.data;
        req.body.params.paymentDone = req.body.params.outStandingDue === 0 ? true : false;
        if (req.body.params.outStandingDue === 0) {
            _filter.filter = [
                {
                    $match: { UMR: req.body.params.UMR }
                },
                {
                    $project: { _id: 1, orgId: 1, label: 1, revNo: 1, visits: { $filter: { input: "$visits", cond: { $eq: ["$$this.visitNo", req.body.params.visitNo] } } } }
                }
            ]
            let _rResp = await _mUtils.commonMonogoCall("cm_patients", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
            req.body.params['status'] = "PAID"
            let _updatePatVisitDetails = await updatePatVisitDetails(_rResp.data, 0, [], req, "VISITS")
            if (!(_updatePatVisitDetails && _updatePatVisitDetails.success)) {
                return res.status(400).json({ success: false, status: 400, desc: "", data: _updatePatVisitDetails.data || [] });
            }
            let _aResp = await updateVisitsOrBillData(req.body.params.UMR, "UPDATE_APPOINTMENT_WITH_BILL", "", req);
            if (!(_aResp && _aResp.success)) {
                console.log("Error Occured while updating Bills details to Appointment");
            }
        }
        _.each(req.body.params.transactions, objects => {
            objects['audit'] = req.body.params.audit
            objects.refNumber = _seqResp.data
        })
        mongoMapper('cm_bills', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Insert Bill ..`, data: [] });
            }
            let _obj = {
                "billId": result.data[0]._id,
                "billNo": result.data[0].billNo,
                "dateTime": result.data[0].billDate,
                "visit": req.body.params.visit || "OP",
                "visitNo": req.body.params.visitNo || ""
            };
            let _tResp = await completeTransactionBill(req.body.params.UMR, req, res)
            if (!(_tResp && _tResp.success)) {
                console.log("Error Occured while updating Bills details to Patient");
            }

            let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "BILLS", _obj, req);
            if (!(_patResp && _patResp.success)) {
                console.log("Error Occured while updating Bills details to Patient");
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get Bill */
router.post("/get-bill", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = { data: [] };
        if (req.body.params && req.body.params.fromDt && req.body.params.fromDt.length > 0 && req.body.params.toDt && req.body.params.toDt.length > 0) {
            _filter.filter["audit.documentedDt"] = { $gte: new Date(new Date(req.body.params.fromDt).setUTCHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.toDt).setUTCHours(23, 59, 59, 999)).toISOString() };
            _pGData.data = _filter;
        }
        else {
            _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
        }

        mongoMapper("cm_bills", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Get Due Bill */
router.post("/get-due-bill", async (req, res) => {
    try {
        let TotalData = []
        let _filter = {
            "filter": { "recStatus": { $eq: true }, "outStandingDue": { $gt: 0 } },
            "selectors": "-history  -services"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_bills", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Bill */
router.post("/update-bill", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_bills", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_bills', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                if (_cBody.params.transactions) {
                    _.each(_cBody.params.transactions, (_l) => {
                        if (_l._id) {
                            // _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
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
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //                         "revNo": _hResp.data[0].revNo,
                //                         "revTranId": _hResp.data[0]._id
                //                     }
                pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }
            }
            mongoMapper('cm_bills', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                if (_cBody.params.outStandingDue) {
                    let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "BILLS", "", req);
                    if (!(_patResp && _patResp.success)) {
                        console.log("Error Occured while updating Bills details to Patient");
                    }
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

/* get all ICD */
router.post("/get-icd-codes-masters", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_icd_masters", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* get all Entity */
router.post("/get-icd-codes-search", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.type && (req.body.params.type === 'ICD10' || req.body.params.type === 'ICD11') && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
            let _filter = {
                "filter": {
                    $or: [
                        { "code": nameExp },
                        { "name": nameExp }
                    ],
                    "type": req.body.params.type
                },
                "selectors": ""
            };
            mongoMapper("cm_icd_masters", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Appointment Booking */
router.post("/book-appointment", async (req, res) => {
    try {
        if (req.body.params && (req.body.params.apmntId || (req.body.params.locId && req.body.params.docId && req.body.params.shiftId)) && req.body.params.patName && req.body.params.apmntType) {
            let _finalResp = [];
            let _query = "insertMany";
            if (!req.body.params.apmntId) {
                let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.body.params.locId });
                if (!(_docLoc || _docLoc.length === 0 || _docLoc[0].shifts || _docLoc[0].shifts.length === 0 || _docLoc[0].fees || _docLoc[0].fees.reg)) {
                    return res.status(400).json({ success: false, status: 400, desc: "Error while Booking Appointment, Doctor Fee details are missing.", data: [] });
                }
                let _docShift = _.filter(_docLoc[0].shifts, (_o) => { return _o._id.toString() == req.body.params.shiftId });
                if ((_docShift.length === 0 || !_docShift[0].duration)) {
                    return res.status(400).json({ success: false, status: 400, desc: "Error while Booking Appointment, Doctor Shifts are missing.", data: [] });
                }
                let _filter = {
                    "filter": {
                        "recStatus": { $eq: true },
                        "docDetails.docId": req.body.params.docId,
                        "dateTime": { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString() }
                    },
                    "selectors": "-audit -history",
                    "limit": 1
                }
                let _lstApmntDt = "";
                if (!req.body.params.apmntDtTime) {
                    let _mApmntResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
                    if (!(_mApmntResp && _mApmntResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _mApmntResp.desc || "", data: _mApmntResp.data || [] });
                    }
                    let _spltSlot = _docShift[0].from.split(":");
                    _lstApmntDt = (_mApmntResp.data.length > 0 && _mApmntResp.data[0].dateTime) ? _mApmntResp.data[0].dateTime : moment(new Date()).set({ "hour": _spltSlot[0], "minute": _spltSlot[1] }).toISOString();
                }
                else {
                    _lstApmntDt = moment(req.body.params.apmntDtTime).toISOString();
                }
                let _amount = 0.00;
                if (req.body.params.apmntType === "NORMAL") {
                    _amount = parseFloat(_docLoc[0].fees.normal);
                }
                else if (req.body.params.apmntType === "ONLINE") {
                    _amount = parseFloat(_docLoc[0].fees.online);
                }
                else if (req.body.params.apmntType === "REVISIT") {
                    _amount = parseFloat(_docLoc[0].fees.reVisit);
                }
                else if (req.body.params.apmntType === "EMERGENCY") {
                    _amount = parseFloat(_docLoc[0].fees.emergency);
                }
                let _params = {
                    "docDetails": {
                        "docId": req.body.params.docId,
                        "cd": _mResp.data.docCd || "",
                        "name": _mResp.data.dispName,
                        "regNo": _mResp.data.regNo || "",
                        "degree": _mResp.data.degree || "",
                        "designation": _mResp.data.designation || "",
                        "specName": _mResp.data.specName || "",
                        "imgSign": _mResp.data.imgSign || "",
                        "titleName": _mResp.data.titleName
                    },
                    "locId": req.body.params.locId,
                    "UMR": req.body.params.UMR || "",
                    "titleCd": req.body.params.titleCd || "",
                    "titleName": req.body.params.titleName || "",
                    "patName": req.body.params.patName || "",
                    "age": req.body.params.age || "",
                    "admnNo": req.body.params.admnNo || "",
                    "admnDt": req.body.params.admnDt || "",
                    "gender": req.body.params.gender || "",
                    "email": req.body.params.email || "",
                    "isVIP": req.body.params.isVIP || false,
                    "mobile": req.body.params.mobile || "",
                    "address": req.body.params.address || "",
                    "reasonForVisit": req.body.params.reasonForVisit || "",
                    "remarks": req.body.params.remarks || "",
                    "source": req.body.params.source || "",
                    "apmntType": req.body.params.apmntType || "",
                    "amount": _amount || 0.00,
                    "isPayment": req.body.params.isPayment || false,
                    "paymentMode": req.body.params.paymentMode || "",
                    "audit": req.body.params.audit,
                    "refBy": req.body.params.refBy,
                    "queueNo": "",
                    "visit": req.body.params.visit,
                    "status": "BOOKED"
                }
                _params['isPayment'] = _amount === 0 ? true : false;
                if (req.body.params.patId && req.body.params.patId.length > 0) {
                    _params["patId"] = req.body.params.patId;
                }
                let _gPayload = await generateSlotsPayload(_params, _lstApmntDt, _docShift[0].duration, 1, 0, [], "", "", req);
                if (!(_gPayload && _gPayload.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _gPayload.desc || "Error occurred while Generating Slots Payload", data: [] });
                }
                _.each(_gPayload.data, (_o) => {
                    _finalResp.push(_o.data);
                });
            }
            else {
                _query = "findOneAndUpdate";
                let _cBody = JSON.parse(JSON.stringify((req.body)));
                let _mResp = await _mUtils.commonMonogoCall("cm_appointments", "findById", req.body.params.apmntId, "REVNO", req.body, "", req.tokenData.dbType);
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _hResp = await _mUtils.insertHistoryData('cm_appointments', _mResp.data.params, _cBody.params, req);
                let pLoadResp = { payload: {} };
                if (!(_hResp && _hResp.success)) {
                }
                else {
                    _cBody.params.revNo = _mResp.data.params.revNo;
                    _cBody.params._id = _cBody.params.apmntId;
                    _cBody.params.status = "BOOKED";
                    delete _cBody.params.apmntId;
                    pLoadResp = await _mUtils.preparePayload("U", _cBody);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    pLoadResp.payload.query.$push["history"] = {
                        "revNo": _hResp.data[0].revNo,
                        "revTranId": _hResp.data[0]._id
                    }
                }
                _finalResp = pLoadResp.payload;
            }
            mongoMapper('cm_appointments', _query, _finalResp, req.tokenData.dbType).then(async (result) => {
                if (result.data[0].amount == 0.00) {
                    let getQueData = await updateQueNoData(req, res, result.data[0]._id)
                    if (!(getQueData && getQueData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: _mResp.data || [] });
                    }
                } else {
                    console.log(result.data[0].amount)
                }
                if (req.body.params.UMR) {
                    let _obj = {
                        "visitId": req.body.params.apmntId ? result.data._id : result.data[0]._id,
                        "dateTime": req.body.params.apmntId ? result.data.audit.documentedDt : result.data[0].audit.documentedDt,
                        "docName": req.body.params.apmntId ? `${result.data.docDetails.name} ${result.data.docDetails.degree}` : `${_finalResp[0].docDetails.name} ${_finalResp[0].docDetails.degree}`,
                        "docId": req.body.params.apmntId ? result.data.docDetails.docId : result.data[0].docDetails.docId,
                        "locId": req.body.params.apmntId ? result.data.locId : result.data[0].locId,
                        "visit": "OP",
                        "visitNo": req.body.params.apmntId ? result.data.code : result.data[0].code || "",
                        "status": req.body.params.apmntId ? result.data.status : _finalResp[0].status,

                    };
                    let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISITS", _obj, req);
                    if (!(_patResp && _patResp.success)) {
                        console.log("Error Occured while updating Visits details to Patient");
                    }
                }
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

/**Get Appointment */
router.post("/get-appointment", async (req, res) => {
    try {
        if (req.body.params && req.body.params.docId && req.body.params.locId) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "locId": req.body.params.locId
                },
                "selectors": "-history"
            }
            let _finalDataResp = []
            if (req.body.params.docId) {
                _filter.filter["docDetails.docId"] = req.body.params.docId;
            }
            if (req.body.params.fromDt) {
                if (req.body.params.toDt) {
                    _filter.filter["dateTime"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.toDt).setHours(23, 59, 59, 999)).toISOString() }
                } else {
                    _filter.filter["dateTime"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.fromDt).setHours(23, 59, 59, 999)).toISOString() }
                }
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper("cm_appointments", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                let checkStatusData = _.orderBy(_.filter(result.data, (co, ci) => { return co.checkStatus['checkInDt'] }), ['checkStatus.checkInDt'], ['desc'])
                if (checkStatusData.length > 0) {
                    _finalDataResp = checkStatusData
                }
                let queueNoData = _.orderBy(_.filter(result.data, (co, ci) => { return !co.checkStatus['checkInDt'] && co.queueNo !== "" }), ['queueNo'], ['asc'])
                if (queueNoData.length > 0) { _.each(queueNoData, (qo, qi) => { _finalDataResp.push(qo) }) }
                let empltyqueueNoData = _.orderBy(_.filter(result.data, (co, ci) => { return !co.checkStatus['checkInDt'] && co.queueNo === "" }), ['queueNo'], ['asc'])
                if (empltyqueueNoData.length > 0) { _.each(empltyqueueNoData, (eo, ei) => { _finalDataResp.push(eo) }) }
                return res.status(200).send({ success: true, status: 200, desc: '', data: _finalDataResp });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

async function getOldPatientDetails(_data, _indx, _output, req, _coll, _params) {
    try {
        if (_data.length > _indx) {
            let _filter = {
                "filter": {
                    "_id": _data[_indx].patId
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_patients", "find", _filter, "", req.body, "", req.tokenData.dbType);
            _output.push(_mResp)
            _indx = _indx + 1;
            await getOldPatientDetails(_data, _indx, _output, req, _coll, _params);
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

/**Get Appointment */
router.post("/get-dashboard", async (req, res) => {
    try {
        if (req.body.params.flag == "DOCTOR" && req.body.params && req.body.params.docId && req.body.params.locId) {
            let data = [];
            let dat = [];
            let oldpat = [];
            let newPat = [];
            let dateTime = [];
            let oldPatSum;
            let newPatSum;
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "locId": req.body.params.locId
                },
                "selectors": "-history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.body.params.locId });
            if (!(_docLoc || _docLoc.length === 0 || _docLoc[0].shifts || _docLoc[0].shifts.length === 0 || _docLoc[0].fees || _docLoc[0].fees.reg)) {
                return res.status(400).json({ success: false, status: 400, desc: "Error while Booking Appointment, Doctor Fee details are missing.", data: [] });
            }
            if (req.body.params.docId) {
                _filter.filter["docDetails.docId"] = req.body.params.docId;
            }
            if (req.body.params.fromDt) {
                if (req.body.params.toDt) {
                    _filter.filter["dateTime"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.toDt).setHours(23, 59, 59, 999)).toISOString() }
                } else {
                    _filter.filter["dateTime"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.fromDt).setHours(23, 59, 59, 999)).toISOString() }
                }
            }
            let _mResp1 = await _mUtils.commonMonogoCall("cm_appointments", req.body.query, _filter, "", req.body, "", req.tokenData.dbType);
            _filter.filter = {}
            _filter.filter["docDetails.docId"] = req.body.params.docId;
            let docAgnstApp = await _mUtils.commonMonogoCall("cm_appointments", req.body.query, _filter, "", req.body, "", req.tokenData.dbType);
            let splitObj = {}
            _.each(docAgnstApp.data, (docObj, docindx) => {
                if (docObj.dateTime !== null) {
                    let split = docObj['dateTime'].split("T")
                    // splitObj={
                    //     date:split[0],
                    //     time:split[1]
                    // }
                    dateTime.push(split[0])
                }
            })
            let dateCount = []
            let count = {}
            _.each(dateTime, (dateObj, dateIndx) => {
                //  count[dateObj.time]=(count[dateObj.time]||0)
                count[dateObj] = (count[dateObj] || 0) + 1
            })
            //  return res.status(200).send({ success: true, status: 200, desc: '', data: count });
            let sorting = _.chain(count).map((value, key) => {
                return {
                    date: key,
                    day: parseInt(key.split("-")[2]),
                    month: parseInt(key.split("-")[1]),
                    year: parseInt(key.split("-")[0]),
                    count: value
                }
            })

            let patIdData = _.filter(_mResp1.data, (obj) => { return obj.patId });
            let nptId = _mResp1.data.length - patIdData.length;

            let getPatientData = await getOldPatientDetails(patIdData, 0, [], req, _filter)
            if (getPatientData.data.length > 0) {
                _.each(getPatientData.data, (gObj, gIndx) => {
                    _.each(gObj.data, (gObj1) => {
                        if (Array.isArray(gObj1.visits)) {
                            _.each(gObj1.visits, (gObjVst) => {
                                if (gObjVst.dateTime && (gObjVst.dateTime > new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString()) && (gObjVst.dateTime < new Date(new Date(req.body.params.fromDt).setHours(23, 59, 59, 999)).toISOString())) {
                                    dat.push(gObjVst)
                                    gObj1.visits = dat
                                }
                            })
                        }
                        if (gObj1.visits.length > 1) {
                            oldpat.push(gObj.data.length)
                        } else {
                            newPat.push((gObj.data.length + nptId))
                        }
                    })
                })
                oldPatSum = _.sum(oldpat)
                newPatSum = _.sum(newPat)
            } else {
                oldPatSum = 0;
                newPatSum = nptId
            }
            let _doctorApmts = {
                docId: _mResp.data._id,
                docCd: _mResp.data.docCd,
                docName: `${_mResp.data.titleName}${_mResp.data.fName}`,
                locId: _docLoc[0]._id,
                locName: _docLoc[0].locName,
                totalVisits: _mResp1.data.length,
                newPat: newPatSum,
                oldPat: oldPatSum,
                apmntDates: sorting ? sorting : [],
                admnList: [
                    {
                        "admnNo": "",
                        "admnDt": "",
                        "UMR": "79458fsdsdfdsf85454",
                        "patId": "79458fsdsdfdsf85454",
                        "patName": "Satish L",
                        "dateTime": "2023-06-23T06:25:28.510Z"
                    }
                ]
            }
            data.push(_doctorApmts)
            return res.status(200).send({ success: true, status: 200, desc: '', data: data });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});



async function updateQueNoData(req, res, _mongoId, _mResp1) {
    try {
        return new Promise(async (resolve, reject) => {
            let _cBody = {}
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                // return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.body.params.locId });
            if (!(_docLoc || _docLoc.length === 0 || _docLoc[0].shifts || _docLoc[0].shifts.length === 0 || _docLoc[0].fees || _docLoc[0].fees.reg)) {
                //  return res.status(400).json({ success: false, status: 400, desc: "Error while creating slots, Doctor Fee details are missing.", data: [] });
            }

            let _filter = {
                "filter": {
                    "recStatus": { $eq: true }
                },
                "selectors": "-history"
            }

            if (req.body.params.docId) {
                _filter.filter["docDetails.docId"] = req.body.params.docId;
            }
            if (req.body.params.locId) {
                _filter.filter["locId"] = req.body.params.locId;
            }

            _filter.filter["dateTime"] = { $gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString() }
            let _mRespOfAppt = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", req.body, "", req.tokenData.dbType)
            _mRespOfAppt["data"] = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['asc'])
            _filter.filter["_id"] = _mongoId;
            let _reResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", req.body, "", req.tokenData.dbType)
            let _queNoResp = _.filter(_mRespOfAppt.data, (_o, _i) => { return _o.queueNo !== "" })

            if (req.body.params.flag === "QNO") {
                if (_mRespOfAppt.data.length > 0) {
                    if (_reResp.data.length > 0 && _reResp.data[0].queueNo === "") {
                        if (_queNoResp.length === 0) {
                            _cBody = {
                                params: {
                                    _id: _mongoId,
                                    queueNo: "1",
                                    status: "1" || `${_cal}`
                                }
                            }
                        } else {
                            let _descData = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['desc'])
                            let _cal = parseInt(_descData[0].queueNo) + 1;
                            _cBody = {
                                params: {
                                    _id: _mongoId,
                                    queueNo: `${_cal}`,
                                    status: `${_cal}`
                                }
                            }
                        }
                        let _filterObj = {
                            filter: [
                                {
                                    $match: { _id: _mResp1.patId }
                                },
                                {
                                    $project: { _id: 1, orgId: 1, label: 1, revNo: 1, visits: { $filter: { input: "$visits", cond: { $eq: ["$$this.visitNo", _mResp1.code] } } } }
                                }
                            ]
                        }
                        let _rResp = await _mUtils.commonMonogoCall("cm_patients", "aggregation", _filterObj, "", req.body, "", req.tokenData.dbType)
                        req.body.params['status'] = _cBody.params.queueNo
                        let _updatePatVisitDetails = await updatePatVisitDetails(_rResp.data, 0, [], req, "VISITS")
                        if (!(_updatePatVisitDetails && _updatePatVisitDetails.success)) {
                            return res.status(400).json({ success: false, status: 400, desc: "", data: _updatePatVisitDetails.data || [] });
                        }
                    } else {
                        return res.status(400).json({ success: false, status: 400, desc: "QueueNo already exist (or) no appointment availble For this doctor", data: [] });
                        // resolve({ success: false, status: 400, desc:'QueueNo already exist', data: [] });
                    }
                } else {
                    return res.status(400).json({ success: false, status: 400, desc: "today no matching appointments available for this doctor", data: [] });
                }
            }
            else if (req.body.params.flag === "DQ") {
                if (_reResp.data.length > 0 && _reResp.data[0].queueNo) {
                    let prepareObj = {}
                    let lst = [], isBool = false;
                    for (let itm of _mRespOfAppt.data) {
                        if (isBool && itm.queueNo !== "") {
                            itm.queueNo = itm.queueNo - 1;
                            prepareObj = {
                                _id: itm._id,
                                queueNo: itm.queueNo
                            }
                        }
                        else if (itm.code === _reResp.data[0].code) {
                            isBool = true;
                            prepareObj = {
                                _id: itm._id,
                                queueNo: ""
                            }
                            // itm.queueNo = "";
                        }
                        if (isBool && Object.keys(prepareObj).length > 0) {
                            lst.push(prepareObj);
                            prepareObj = {}
                        }
                    }

                    _cBody = { params: { lst } }
                    let _updateResp = await insertUpdateInMultiData1(_cBody, 0, [], req.tokenData.dbType, 'cm_appointments', 'findOneAndUpdate', 'U');
                    if (!_updateResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Updating Transaction data, Err:-${_updateResp.desc}`, data: [] });
                    }
                    else {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
                    }
                    // _cBody = {
                    //     params: {
                    //         _id: _mongoId,
                    //         queueNo: ""
                    //     }
                    // }
                }
            }
            else {
                if (_docLoc[0].settings.autoQno === true) {
                    if (_queNoResp.length === 0) {
                        _cBody = {
                            params: {
                                _id: _mongoId,
                                queueNo: "1"
                            }
                        }
                    } else {
                        let _descData = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['desc'])
                        let _cal = parseInt(_descData[0].queueNo) + 1;
                        _cBody = {
                            params: {
                                _id: _mongoId,
                                queueNo: `${_cal}`
                            }
                        }
                    }
                } else {
                    _cBody = {
                        params: {
                            _id: _mongoId,
                            queueNo: ""
                        }
                    }
                }
            }
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                // return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _uResp = await _mUtils.commonMonogoCall("cm_appointments", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            if (!(_uResp && _uResp.success && _uResp.data)) {
                resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
            } else {
                resolve({ success: true, status: 200, desc: '', data: _uResp.data });
            }
        })
    } catch (error) {

    }
}


// async function updateQueNoData(req, res,_mongoId) {
//     try {
//         return new Promise(async (resolve, reject) => {
//             let _cBody = {}
//             let pLoadResp = { payload: {} };
//             let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
//             if (!(_mResp && _mResp.success)) {
//                 // return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//             }
//             let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.body.params.locId });
//             if (!(_docLoc || _docLoc.length === 0 || _docLoc[0].shifts || _docLoc[0].shifts.length === 0 || _docLoc[0].fees || _docLoc[0].fees.reg)) {
//                 //  return res.status(400).json({ success: false, status: 400, desc: "Error while creating slots, Doctor Fee details are missing.", data: [] });
//             }

//             let _filter = {
//                 "filter": {
//                     "recStatus": { $eq: true }
//                 },
//                 "selectors": "-history"
//             }

//             if (req.body.params.docId) {
//                 _filter.filter["docDetails.docId"] = req.body.params.docId;
//             }
//             if (req.body.params.locId) {
//                 _filter.filter["locId"] = req.body.params.locId;
//             }

//             _filter.filter["dateTime"] = { $gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString() }
//             let _mRespOfAppt = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", req.body, "", req.tokenData.dbType)
//             let _queNoResp = _.filter(_mRespOfAppt.data, (_o, _i) => { return _o.queueNo !== "" })

//             if (req.body.params.flag === "QNO") {
//                 if (_queNoResp.length === 0) {
//                     _cBody = {
//                         params: {
//                             _id: _mongoId,
//                             queueNo: "1"
//                         }
//                     }
//                 } else {
//                     let _descData = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['desc'])
//                     let _cal = parseInt(_descData[0].queueNo) + 1;
//                     _cBody = {
//                         params: {
//                             _id: _mongoId,
//                             queueNo: `${_cal}`
//                         }
//                     }
//                 }
//             } else {
//                 if (_docLoc[0].settings.autoQno === true) {
//                     if (_queNoResp.length === 0) {
//                         _cBody = {
//                             params: {
//                                 _id: _mongoId,
//                                 queueNo: "1"
//                             }
//                         }
//                     } else {
//                         let _descData = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['desc'])
//                         let _cal = parseInt(_descData[0].queueNo) + 1;
//                         _cBody = {
//                             params: {
//                                 _id: _mongoId,
//                                 queueNo: `${_cal}`
//                             }
//                         }
//                     }
//                 } else {
//                     _cBody = {
//                         params: {
//                             _id: _mongoId,
//                             queueNo: ""
//                         }
//                     }

//                 }
//             }


//             pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);

//             if (!pLoadResp.success) {
//                 // return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
//             }
//             let _uResp = await _mUtils.commonMonogoCall("cm_appointments", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
//             if (!(_uResp && _uResp.success && _uResp.data)) {
//                 resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
//             } else {
//                 resolve({ success: true, status: 200, desc: '', data: _uResp.data });
//             }


//         })
//         // let _filter = {
//         //     "filter": {
//         //         "recStatus": { $eq: true },
//         //         "": req.body.params.locId
//         //     },
//         //     "selectors": "-history"
//         // }

//     } catch (error) {

//     }
// }

async function updatePatVisitDetails(_data, _indx, _output, req, _type) {
    try {
        if (_data.length > _indx) {
            let _patdata = {
                "params": {
                    "_id": _data[_indx]._id
                }
            }
            if (_type === "VISITS") {
                let _obj = {}
                _patdata.params['visits'] = []
                _.each(_data[_indx].visits, (_o, _i) => {
                    _.each(_o, (_v, _k) => {
                        _.each(req.body.params, (_v1, _k1) => {
                            if (_k == "_id") {
                                _obj[_k] = _v
                            } else {
                                if (_k1 != "_id" && _k1 != "revNo" && (_k == _k1)) {
                                    _obj[_k1] = _v1
                                }
                            }
                        })
                    })
                    _patdata.params["visits"].push(_obj)
                })
            }
            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload('BW', _patdata);

            if (!pLoadResp.success) {
                // return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _uResp = await _mUtils.commonMonogoCall("cm_patients", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            if (!(_uResp && _uResp.success && _uResp.data)) {
                resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
            } else {
                _output.push(_uResp)
            }
            _indx = _indx + 1;
            await updatePatVisitDetails(_data, _indx, _output, req, _type);
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

/**Update Appointment */
router.post("/update-appointment", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _filter = {
            "filter": []
        }
        if (req.body.params._id) {
            if (_cBody.params.checkStatus) {
                if (_cBody.params.checkStatus.status === "checkIn") {
                    _cBody.params["checkStatus"].checkInDt = new Date().toISOString()

                } else if (_cBody.params.checkStatus.status === "checkOut") {
                    _cBody.params["checkStatus"].checkOutDt = new Date().toISOString()
                } else if (_cBody.params.checkStatus.status === "skipped") {
                    _cBody.params["checkStatus"].status = ""
                    _cBody.params["checkStatus"].checkInDt = ""
                }
            }

            let _mResp = await _mUtils.commonMonogoCall("cm_appointments", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_appointments', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {
            }
            else {
                let _mResp1 = await _mUtils.commonMonogoCall("cm_appointments", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp1 && _mResp1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }

                if (_mResp1.data.isPayment === true && (req.body.params.flag === "QNO" || req.body.params.flag === "DQ")) {
                    let getQueData = await updateQueNoData(req, res, req.body.params._id, _mResp1.data)
                    if (!(getQueData && getQueData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: _mResp.data || [] });
                    }
                } else if (req.body.params.flag === "ISCHECK" && req.body.params.status) {
                    _filter.filter = [
                        {
                            $match: { _id: _mResp1.data.patId }
                        },
                        {
                            $project: { _id: 1, orgId: 1, label: 1, revNo: 1, visits: { $filter: { input: "$visits", cond: { $eq: ["$$this.visitNo", _mResp1.data.code] } } } }
                        }
                    ]
                    let _rResp = await _mUtils.commonMonogoCall("cm_patients", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
                    let _updatePatVisitDetails = await updatePatVisitDetails(_rResp.data, 0, [], req, "VISITS")
                    if (!(_updatePatVisitDetails && _updatePatVisitDetails.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: _updatePatVisitDetails.data || [] });
                    }
                }

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
            mongoMapper('cm_appointments', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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


/**Appointment Booking */
router.post("/create-slots", async (req, res) => {
    try {
        if (req.body.params && req.body.params.locId && req.body.params.docId && req.body.params.noOfSlots) {
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.body.params.locId });
            if (!(_docLoc || _docLoc.length === 0 || _docLoc[0].shifts || _docLoc[0].shifts.length === 0 || _docLoc[0].fees || _docLoc[0].fees.reg)) {
                return res.status(400).json({ success: false, status: 400, desc: "Error while creating slots, Doctor Fee details are missing.", data: [] });
            }
            let _docShift = _.filter(_docLoc[0].shifts, (_o) => { return _o._id.toString() == req.body.params.shiftId });
            if (!(_docShift || _docShift.length === 0 || _docShift[0].duration)) {
                return res.status(400).json({ success: false, status: 400, desc: "Error while creating slots, Doctor Shifts are missing.", data: [] });
            }
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "docDetails.docId": req.body.params.docId,
                    "dateTime": { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString() }
                },
                "selectors": "-audit -history",
                "limit": 1
            }
            let _mApmntResp = await _mUtils.commonMonogoCall("cm_appointments", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mApmntResp && _mApmntResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mApmntResp.desc || "", data: _mApmntResp.data || [] });
            }
            let _spltSlot = _docShift[0].from.split(":");
            let _lstApmntDt = (_mApmntResp.data.length > 0 && _mApmntResp.data[0].dateTime) ? _mApmntResp.data[0].dateTime : moment(new Date()).set({ "hour": _spltSlot[0], "minute": _spltSlot[1] }).toISOString();
            let _params = {
                "docDetails": {
                    "docId": req.body.params.docId,
                    "cd": _mResp.data.docCd || "",
                    "name": _mResp.data.dispName,
                    "regNo": _mResp.data.regNo || "",
                    "degree": _mResp.data.degree || "",
                    "designation": _mResp.data.designation || "",
                    "specName": _mResp.data.specName || "",
                    "imgSign": _mResp.data.imgSign || ""
                },
                "audit": req.body.params.audit,
                "locId": req.body.params.locId
            }
            let _gPayload = await generateSlotsPayload(_params, _lstApmntDt, _docShift[0].duration, req.body.params.noOfSlots, 0, [], "", "", req)
            if (!(_gPayload && _gPayload.success)) {
                return res.status(400).json({ success: false, status: 400, desc: "Error occurred while Generating Slots Payload", data: [] });
            }
            let _finalResp = [];
            _.each(_gPayload.data, (_o) => {
                _finalResp.push(_o.data);
            });
            mongoMapper('cm_appointments', "insertMany", _finalResp, req.tokenData.dbType).then((result) => {
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

//Insert-Transaction
router.post("/insert-transaction", async (req, res) => {
    try {
        if (req.body.params && req.body.params.locId && req.body.params.UMR && req.body.params.visit && req.body.params.data && req.body.params.docId && req.body.params.data.length > 0) {
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            req.body.params["docDetails"] = {
                "docId": _mResp.data._id,
                "cd": _mResp.data.docCd || "",
                "name": _mResp.data.dispName,
                "regNo": _mResp.data.regNo || "",
                "degree": _mResp.data.degree || "",
                "designation": _mResp.data.designation || "",
                "specName": _mResp.data.specName || "",
                "imgSign": _mResp.data.imgSign || ""
            };
            delete req.body.params.docId;
            let _finalPayload = [];
            _.map(req.body.params.data, (_od) => {
                if (_od.type === 'VITALS' || _od.type === 'INVESTIGATION' || _od.type === 'MEDICATION') {
                    _finalPayload.push(_od);
                }
            });
            let _updateResp = await insertIndividualColl("I", _finalPayload, 0, [], req, req.body.params);
            if (!_updateResp.success) {
                console.log("Error Occured while Insert data to Individual collection");
                // return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert default documents`, data: [] });
            }
            let _audit = JSON.parse(JSON.stringify(req.body.params.audit));
            _audit["documentedDt"] = new Date().toISOString();
            _audit["modifiedBy"] = "";
            _audit["modifiedById"] = "";
            _audit["modifiedDt"] = "";
            _.each(req.body.params.data, (_o) => {
                _o.audit = _audit;
                _.each(_updateResp.data, (_tO) => {
                    if (_tO.type === _o.type) {
                        _.each(_o.child, (_c, _cI) => {
                            _.each(_tO.data, (_tC, _tI) => {
                                if (_cI === _tI) {
                                    _c.tranId = _tC._id;
                                }
                            });
                        });
                    }
                });
            });

            _.each(req.body.params.data, (_o) => {
                _.each(_o.child, (_c, _cI) => {
                    _c.audit = _audit;
                });
            });

            mongoMapper('cm_transactions', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Insert Transaction ..`, data: [] });
                }

                let _obj = {
                    "tranId": result.data[0]._id,
                    "dateTime": result.data[0].audit.documentedDt,
                    "docName": req.body.params.docDetails.name,
                    "visit": req.body.params.visit || "OP",
                    "visitNo": req.body.params.visitNo || ""
                };

                let visitObj = {
                    "tranId": result.data[0]._id,
                    "documentId": result.data[0].documentId
                }

                let updateAppointmentDoc = await updateVisitsOrBillData(req.body.params.UMR, "AAPT_UPDT", visitObj, req)
                if (!(updateAppointmentDoc && updateAppointmentDoc.success)) {
                    console.log("Error Occured while updating appointment details to Patient");
                }

                let updateVist = await updateVisitsOrBillData(req.body.params.UMR, "VISIT_UPD", visitObj, req)
                if (!(updateVist && updateVist.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error Occured while updating visits details to Patient ..`, data: [] });
                }

                let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISIT_TRAN", _obj, req);
                if (!(_patResp && _patResp.success)) {
                    console.log("Error Occured while updating Bills details to Patient");
                }
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

async function addFreqEntityLangDataInMedi(_data, _indx, _output, req) {
    try {
        if (_data.length > _indx) {

            let entityCds = [
                {
                    cd: "FREQUENCY",
                    matchKey: "freqDesc",
                    anotherMatchKey: "",
                    objKey: "freqLang",
                    childMtchKey: "child.label"
                },
                {
                    cd: "DURATION",
                    matchKey: "duration",
                    anotherMatchKey: "label",
                    childMtchKey: "child.label",
                    objKey: "dutnLang"
                },
                {
                    cd: "INSTRUCTIONS",
                    matchKey: "instructionCd",
                    anotherMatchKey: "",
                    childMtchKey: "child.cd",
                    objKey: "instrLang"
                }
            ];
            let _indx1 = 0
            while (entityCds.length > _indx1) {
                let _matchk = `${entityCds[_indx1].childMtchKey}`
                let _filter = {
                    filter: [
                        {
                            $unwind: "$child"
                        },
                        {
                            $match: { recStatus: { $eq: true }, cd: entityCds[_indx1].cd }
                        }
                    ]
                };
                _filter.filter[1].$match[`${entityCds[_indx1].childMtchKey}`] = entityCds[_indx1].anotherMatchKey == "" ? _data[_indx][`${entityCds[_indx1].matchKey}`] : _data[_indx][`${entityCds[_indx1].matchKey}`][`${entityCds[_indx1].anotherMatchKey}`]

                let _eResp = await _mUtils.commonMonogoCall("cm_entity", "aggregation", _filter, "", "", "", req.tokenData.dbType);
                if (!(_eResp && _eResp.success)) {
                    // return res.status(400).json({ success: false, status: 400, desc: _mRespDataProduct.desc || "", data: _mRespDataProduct.data || [] });
                } else {
                    if (_eResp.data.length > 0) {
                        _data[_indx][`${entityCds[_indx1].objKey}`] = {}
                        if (_eResp.data[0].child.hasOwnProperty('lang') && _eResp.data[0].child.lang.length > 0) {
                            _.each(_eResp.data[0].child.lang, (_focl, _focli) => {
                                _data[_indx][`${entityCds[_indx1].objKey}`][_focl.label] = _focl.value && _focl.value.length > 0 ? _focl.value : "";
                            })
                        }
                    }
                }
                _indx1++;
            }
            _output.push(_data[_indx])
            _indx = _indx + 1;
            await addFreqEntityLangDataInMedi(_data, _indx, _output, req);
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


// async function addFreqEntityLangDataInMedi(_data, _indx, _output, req) {
//     try {
//         if (_data.length > _indx) {
//           let _filter={
//               filter:[
//                   {
//                       $unwind:"$child"
//                   },
//                   {
//                       $match:{recStatus:{$eq:true},cd:"FREQUENCY","child.label":_data[_indx].freqDesc}
//                   }
//               ]
//             }
//             let _eResp = await _mUtils.commonMonogoCall("cm_entity", "aggregation", _filter, "", "", "", req.tokenData.dbType);
//             if (!(_eResp && _eResp.success)) {
//                 // return res.status(400).json({ success: false, status: 400, desc: _mRespDataProduct.desc || "", data: _mRespDataProduct.data || [] });
//             }else{
//             if(_eResp.data.length >0){
//                 _data[_indx]['freqLang']={}
//                 if(_eResp.data[0].child.lang.length > 0){
//                     _.each(_eResp.data[0].child.lang,(_focl,_focli)=>{
//                         _data[_indx].freqLang[_focl.label]=_focl.value && _focl.value.length > 0 ? _focl.value :"";
//                     })
//                 }
//             }
//             _output.push(_data[_indx])
//             }

//             _indx = _indx + 1;
//             await addFreqEntityLangDataInMedi(_data, _indx, _output, req);
//         }
//         else {
//             return { success: true, data: _output }
//         }
//         let _final = _.filter(_output, (_r) => { return !_r.success });
//         return {
//             "success": _final.length > 0 ? false : true,
//             "data": _output
//         }
//     }
//     catch (err) {
//         return { success: false, data: [], desc: err.message || err }
//     }
// };

//Get-Transaction
router.post("/get-transaction", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_transactions", req.body.query, _pGData.data, req.tokenData.dbType).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(200).json({ success: true, status: 200, desc: ``, data: [] });
            }
            let _parseResultData = JSON.parse(JSON.stringify(result.data))
            let _indx = 0
            while (_parseResultData.length > _indx) {
                let _labels = _.filter(_parseResultData[_indx].data, (_fO) => { return _fO.type === 'LABELS' });
                if (_labels.length > 0) {
                    let _lblIdx = _.findIndex(_parseResultData[_indx].data, (_fO) => { return _fO.type === 'LABELS' });
                    //_parseResultData[_indx].splice(_lblIdx, 1);
                    _.each(_labels[0].child, (_lO, _lK) => {
                        let _lblObj = {
                            "_id": _labels[0]._id,
                            "type": _labels[0].type,
                            "sequenceNo": "",
                            "cd": "",
                            "name": "",
                            "child": []
                        }
                        _lblObj.sequenceNo = _lO.sequenceNo;
                        _lblObj.cd = _lO.cd;
                        _lblObj.name = _lO.name;

                        _lblObj.child.push({
                            "_id": _lO._id,
                            "lblId": _lO.lblId,
                            "value": _lO.value || ""
                        });
                        _parseResultData[_indx].data.push(_lblObj);
                    });
                }

                //add frequency entity lang data in medication type

                let _getMediactionDta = _.filter(_parseResultData[_indx].data, (_mo) => { return _mo.type == "MEDICATION" })
                if (_getMediactionDta.length > 0) {
                    let _addFreqEntityLangDataInMedi = await addFreqEntityLangDataInMedi(_getMediactionDta[0].child, 0, [], req);

                    _.each(_parseResultData[_indx].data, (_po, _pi) => {
                        if (_po.type == "MEDICATION") {
                            _po.child = _addFreqEntityLangDataInMedi.data
                        }
                    })
                }




                _indx++;
            }
            // _.each(_parseResultData, (_o, _k) => {
            //     let _labels = _.filter(_o.data, (_fO) => { return _fO.type === 'LABELS' });
            //     if (_labels.length > 0) {
            //         let _lblIdx = _.findIndex(_o.data, (_fO) => { return _fO.type === 'LABELS' });
            //         _o.data.splice(_lblIdx, 1);
            //         // _.each(_labels[0].child, (_lO, _lK) => {
            //         //     let _lblObj = {
            //         //         "_id": _labels[0]._id,
            //         //         "type": _labels[0].type,
            //         //         "sequenceNo": "",
            //         //         "cd": "",
            //         //         "name": "",
            //         //         "child": []
            //         //     }
            //         //     _lblObj.sequenceNo = _lO.sequenceNo;
            //         //     _lblObj.cd = _lO.cd;
            //         //     _lblObj.name = _lO.name;
            //         //     console.log(_k, _lK, _lblObj);
            //         //     _lblObj.child.push({
            //         //         "_id": _lO._id,
            //         //         "lblId": _lO.lblId,
            //         //         "value": _lO.value || ""
            //         //     });
            //         //     _o.data.push(_lblObj);
            //         // });
            //     }

            // });
            return res.status(200).send({ success: true, status: 200, desc: '', data: _parseResultData });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* update-transaction*/
router.post("/update-transaction", async (req, res) => {
    try {
        if (req.body.params._id) {
            for (let i in req.body.params.data) {
                for (let j in req.body.params.data[i].child) {
                    if (req.body.params.data[i].child[j]._id) {
                        let __id = JSON.parse(JSON.stringify(req.body.params.data[i].child[j]._id));
                        delete req.body.params.data[i].child[j]._id;
                        let keyValues = Object.entries(req.body.params.data[i].child[j]);
                        keyValues.splice(0, 0, ["_id", __id]);
                        let newObj = Object.fromEntries(keyValues)
                        req.body.params.data[i].child[j] = JSON.parse(JSON.stringify(newObj));
                    }
                }
            }
            let _cBody = JSON.parse(JSON.stringify((req.body)));
            if (_cBody.params.recStatus === false) {
                let _mResp = await _mUtils.commonMonogoCall("cm_transactions", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _finalPayload = [];
                _.map(_mResp.data.data, (_od) => {
                    if (_od.type === 'VITALS' || _od.type === 'INVESTIGATION' || _od.type === 'MEDICATION') {
                        _finalPayload.push(_od);
                    }
                });
                let _mIndvResp = await insertIndividualColl("U", _finalPayload, 0, [], req, _mResp.data);
                if (!_mIndvResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert default documents`, data: [] });
                }

                let _mResp1 = await _mUtils.commonMonogoCall("cm_transactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
                _cBody.params.revNo = _mResp1.data.params.revNo
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                mongoMapper('cm_transactions', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });

            } else {
                let _mResp = await _mUtils.commonMonogoCall("cm_transactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _hResp = await _mUtils.insertHistoryData('cm_transactions', _mResp.data.params, _cBody.params, req);
                let _finalPayloadObj = {};
                if (!(_hResp && _hResp.success)) {
                }
                else {
                    _cBody.params.revNo = _mResp.data.params.revNo;
                    let _cParamsObj = {};
                    _.each(_cBody.params, (_l, _k) => {
                        if (_k != 'data') {
                            _cParamsObj[_k] = _l;
                        }
                    });
                    if (!(_cBody.params.data)) {
                        if (_cBody.params.status === "REWORK") {
                            let locSetting = [{ reworkLimit: 24 }]
                            let dateDifference = moment(new Date()).diff(moment(_mResp.data.params.audit.documentedDt).toISOString(), 'hours')
                            if (dateDifference > locSetting[0].reworkLimit) {
                                return res.status(400).json({ success: false, status: 400, desc: `time exceeded`, data: [] });
                            } else {
                                _cBody.params.status = "REQUESTED"
                                _cBody.params["audit"] = {
                                    completedById: "",
                                    completedBy: "",
                                    completedDt: "",
                                    approvedById: "",
                                    approvedBy: "",
                                    approvedDt: "",
                                    reworkById: req.tokenData.userId,
                                    reworkBy: req.tokenData.displayName,
                                    reworkDt: new Date().toISOString(),
                                    modifiedById: req.tokenData.userId,
                                    modifiedBy: req.tokenData.displayName,
                                    modifiedDt: new Date().toISOString()
                                }
                            }

                        }
                        pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                        if (!pLoadResp.success) {
                            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                        }
                        mongoMapper('cm_transactions', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                        }).catch((error) => {
                            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                        });

                    } else {
                        _cParamsObj.data = [];
                        _.each(_cBody.params.data, (_o) => {
                            let _dObj = {};
                            _.each(_o, (_l, _k) => {
                                if (_k != 'child') {
                                    _dObj[_k] = _l;
                                }
                            });
                            if (_o.child.length === 0) {
                                _dObj["child"] = _o.child
                                _cParamsObj.data = JSON.parse(JSON.stringify(_cParamsObj.data.concat(_dObj)));
                            } else {
                                let _rest = _.groupBy(_o.child || _o.child.length == 0, '_id');
                                for (let i in _rest) {
                                    _dObj["child"] = JSON.parse(JSON.stringify(_rest[i]));
                                    _cParamsObj.data = JSON.parse(JSON.stringify(_cParamsObj.data.concat(_dObj)));
                                }
                            }

                        });
                        // _cParamsObj["history"] = {
                        //     "revNo": _hResp.data[0].revNo,
                        //     "revTranId": _hResp.data[0]._id
                        // }
                        _finalPayloadObj = {
                            "flag": _cBody.flag,
                            "query": 'updateOne',
                            "params": _cParamsObj
                        };
                        // pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                        //     "revNo": _hResp.data[0].revNo,
                        //     "revTranId": _hResp.data[0]._id
                        // }

                        let _finalPayload = [];
                        _.map(req.body.params.data, (_od) => {
                            if (_od.type === 'VITALS' || _od.type === 'INVESTIGATION' || _od.type === 'MEDICATION') {
                                _finalPayload.push(_od);
                            }
                        });
                        let _mResp1 = await _mUtils.commonMonogoCall("cm_transactions", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
                        let _mIndvResp = await insertIndividualColl("U", _finalPayload, 0, [], req, _mResp1.data);
                        if (!_mIndvResp.success) {
                            console.log("Error Occured while Update data to Individual collection");
                            // return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert default documents`, data: [] });
                        }
                        let _newObjData = _.filter(_mIndvResp.data, (_o) => { return _o.isNew });
                        // let _fBody = [];
                        // _.each(_finalPayloadObj.params.data, (_fo) => {
                        //     let _fObjData = _.filter(_fo.child, (_o) => { return !_o.tranId });
                        //     if (_fObjData.length > 0) {
                        //         _fBody.push({
                        //             type: _fo.type,
                        //             child: _fObjData
                        //         });
                        //     }
                        // });
                        _.each(_finalPayloadObj.params.data, (_o) => {
                            _.each(_newObjData, (_tO) => {
                                if (_tO.type === _o.type) {
                                    _.each(_o.child, (_c, _cI) => {
                                        _.each(_tO.data, (_tC, _tI) => {
                                            if (!_c.tranId) {
                                                if (_tO.type === "INVESTIGATION" && _c.serviceCd === _tC.serviceCd) {
                                                    _c.tranId = _tC._id;
                                                }
                                                else if (_tO.type === "MEDICATION" && _c.medCd === _tC.medCd) {
                                                    _c.tranId = _tC._id;
                                                }
                                                else if (_tO.type === "VITALS") {
                                                    _c.tranId = _tC._id;
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        let _updateResp = await insertUpdateInMultiData(_finalPayloadObj, 0, [], req.tokenData.dbType, 'cm_transactions', 'findOneAndUpdate', 'U')
                        if (!_updateResp.success) {
                            return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Updating Transaction data, Err:-${_updateResp.desc}`, data: [] });
                        }
                        else {
                            return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
                        }
                    }
                }
            }



        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Insert Admission */
router.post("/insert-admission", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Admission' }, "cm", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["admnNo"] = _seqResp.data;
        mongoMapper('cm_admissions', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get Admission */
router.post("/get-admission", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_admissions", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Admission */
router.post("/update-admission", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_admissions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_admissions', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //                         "revNo": _hResp.data[0].revNo,
                //                         "revTranId": _hResp.data[0]._id
                //                     }
                pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }
            }
            mongoMapper('cm_admissions', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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


async function getBillingData(_data, _idx, _output, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            if (_data[_idx].isBilled === false && (_data[_idx].audit.documentedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString() && _data[_idx].audit.documentedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()) ||
                (_data[_idx].audit.modifiedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString() && _data[_idx].audit.modifiedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString())) {
                _output.push(_data[_idx])
            }
            _idx = _idx + 1;
            await getBillingData(_data, _idx, _output, _dbType, ...cmf);
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
}

async function getBillingDataSearch(_data, _idx, _output, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            let _filter = { "filter": { recStatus: { $eq: true } } };
            let _mResp = await _mUtils.commonMonogoCall(_data[_idx], "find", _filter, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await getBillingDataSearch(_data, _idx, _output, _dbType, ...cmf);
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
}


/* billing serach */
router.post("/billing-search", async (req, res) => {
    try {
        if (req.body && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let _filter = { "filter": { recStatus: { $eq: true } } };
            let _collection = "";
            let staticArrey = ["cm_investigations", "cm_medications"]
            if (req.body.flag === "") {
                let hh = await getBillingDataSearch(staticArrey, 0, [], req.tokenData.dbType)
                let finalArrey = []
                let objectAssign = {
                    serviceName: "",
                    type: "",
                    serviceCd: "",
                    serviceId: ""
                }
                _.filter(hh.data, (obj, indx) => {
                    _.filter(obj.data, (obj1) => {
                        if (obj1.serviceTypeName) {
                            if (obj1.serviceTypeName === "Investigations" || obj1.serviceTypeName === "Services" || obj1.serviceTypeName === "Procedures" || obj1.serviceTypeName === "Miscellaneous") {
                                if (obj1.name.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {
                                    objectAssign = {
                                        serviceName: obj1.name,
                                        type: "INV",
                                        serviceCd: obj1.cd,
                                        serviceId: obj1._id,
                                        serviceType: obj1.serviceTypeName,
                                        tarrif: obj1.tarrif ? obj1.tarrif : []
                                    }
                                    finalArrey.push(objectAssign)
                                }
                            }
                        }
                        else {
                            if (obj1.medName.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {
                                objectAssign = {
                                    serviceName: obj1.medName,
                                    type: "MED",
                                    serviceType: obj1.medFormTypeName,
                                    serviceCd: obj1.cd,
                                    serviceId: obj1._id,
                                    tarrif: obj1.tarrif ? obj1.tarrif : []
                                }
                                finalArrey.push(objectAssign)
                            }
                        }
                    })
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: finalArrey });
            } else {
                if (req.body.flag === "INV" || req.body.flag === "MED") {
                    if (req.body.flag === "INV") {
                        let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                        _filter.filter["name"] = nameExp;
                        _collection = "cm_investigations"
                    }
                    if (req.body.flag === "MED") {
                        let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                        _filter.filter["medName"] = nameExp;
                        _collection = "cm_medications"
                    }
                    mongoMapper(_collection, req.body.query, _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                } else {
                    return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
                }
            }



        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*get only investigation from trasaction agnst visitNo */
router.post("/get-inv-transaction", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = { "filter": { recStatus: { $eq: true }, "_id": req.body.params._id } };
            let _mPatResp = await _mUtils.commonMonogoCall("cm_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: [] });
            }
            let finalArrey = []
            _.each(_mPatResp.data, (obj, indx) => {
                _.each(obj.data, (obj1, indx1) => {
                    if (obj1.type === "INVESTIGATION") {
                        _.each(obj1.child, (oc, oi) => {
                            if (oc.visitNo == req.body.params.visitNo) {
                                finalArrey.push(oc)
                            }
                        })
                    }
                })
            })
            return res.status(200).json({ success: true, status: 200, desc: '', data: finalArrey });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*get Investigation and medication from indenes */
router.post("/get-indents", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = { "filter": { recStatus: { $eq: true }, "UMR": req.body.params.UMR } };
            let _mPatResp = await _mUtils.commonMonogoCall("cm_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: [] });
            }
            let finalArrey = []
            _.each(JSON.parse(JSON.stringify(_mPatResp.data[0].data)), async (o, i) => {
                if (o.type === "INVESTIGATION" || o.type === "MEDICATION") {
                    _.each(o.child, (oc, oi) => {
                        finalArrey.push(oc)
                    })
                }
            })
            let objectAssign = {
                serviceName: "",
                type: "",
                serviceCd: "",
                serviceId: ""
            }
            let finalCreateObject = [];
            let getTableData = await getBillingData(finalArrey, 0, [], req.tokenData.dbType)
            _.filter(getTableData.data, (obj, indx) => {
                if (obj.serviceTypeName || obj.serviceTypeCd) {
                    objectAssign = {
                        serviceName: obj.name,
                        type: "INV",
                        serviceCd: obj.cd,
                        serviceId: obj._id,
                        serviceType: obj.serviceTypeName,
                        tarrif: obj.tarrif ? obj.tarrif : [],
                        visit: obj.visit,
                        visitNo: obj.visitNo,
                        tarrif: obj.tarrif ? obj.tarrif : []
                    }
                    finalCreateObject.push(objectAssign)
                } else {
                    objectAssign = {
                        serviceName: obj.medName,
                        type: "MED",
                        serviceType: obj.medFormTypeName,
                        serviceCd: obj.cd,
                        serviceId: obj._id,
                        visit: obj.visit,
                        visitNo: obj.visitNo,
                        tarrif: obj.tarrif ? obj.tarrif : []
                    }
                    finalCreateObject.push(objectAssign)
                }
            })
            return res.status(200).json({ success: true, status: 200, desc: '', data: finalCreateObject });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/** Insert lab-result */
router.post("/insert-lab-result", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.docId) {
            let _mResp = await _mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            req.body.params["docDetails"] = {
                "docId": _mResp.data._id,
                "cd": _mResp.data.docCd || "",
                "name": _mResp.data.dispName,
                "regNo": _mResp.data.regNo || "",
                "degree": _mResp.data.degree || "",
                "designation": _mResp.data.designation || "",
                "specName": _mResp.data.speclityName || "",
                "imgSign": _mResp.data.signature || ""
            };
            delete req.body.params.docId;

            mongoMapper('cm_labresults', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

/* get  lab-result*/
router.post("/get-lab-result", async (req, res) => {
    try {

        if (req.body.params.flag == "PID") {
            let _filter = {
                "filter": {
                    "recStatus": true,
                    "patDet.patId": req.body.params.patId
                },
                "selectors": "-history"
            }
            mongoMapper("cm_labresults", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history"
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper("cm_labresults", "find", _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update LabelMap */
router.post("/update-lab-result", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_labresults", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_labresults', _mResp.data.params, _cBody.params, req, "cm");
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
            mongoMapper('cm_labresults', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Order sets */
router.post("/insert-order-set", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.userId && req.body.params.context && req.body.params.name && req.body.params.child && req.body.params.child.length > 0) {
            req.body.params["locId"] = req.tokenData.locId;
            _.each(req.body.params.child, (_o) => {
                _o.recStatus = true;
                _o.audit = req.body.params.audit;
                _o.audit["documentedDt"] = new Date().toISOString();
            });
            mongoMapper('cm_ordersets', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

/* Get OrderSets*/
router.post("/get-order-set", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": true
            },
            "selectors": {
                "recStatus": "$recStatus",
                "revNo": "$revNo",
                "locId": "$locId",
                "userId": "$userId",
                "specId": "$specId",
                "specName": "$specName",
                "context": "$context",
                "code": "$code",
                "name": "$name",
                "child": {
                    $filter: {
                        input: "$child",
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
        mongoMapper("cm_ordersets", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update OrderSets */
router.post("/update-order-set", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_ordersets", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_ordersets', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('cm_ordersets', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Order sets */
router.post("/insert-label-template", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.userId && req.body.params.labelId && req.body.params.labelCd && req.body.params.labelName && req.body.params.data) {
            req.body.params["locId"] = req.tokenData.locId;
            mongoMapper('cm_labels_templates', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

/* Get OrderSets*/
router.post("/get-label-template", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_labels_templates", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update OrderSets */
router.post("/update-label-template", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_labels_templates", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_labels_templates', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('cm_labels_templates', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/* get specific_tran*/
router.post("/get-specific-tran", async (req, res) => {
    try {
        if (req.body && req.body.params.flag && (req.body.params.flag === "INV" || req.body.params.flag === "MED" || req.body.params.flag === "VIT")) {
            let _coll = "";
            if (req.body.params.flag === "VIT") {
                _coll = "cm_vitals_tran"
            } else if (req.body.params.flag === "INV") {
                _coll = "cm_investigation_tran"
            } else if (req.body.params.flag === "MED") {
                _coll = "cm_medications_tran"
            }
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history"
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper(_coll, "find", _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* get specific_tran*/
router.post("/get-label-history-deprecated", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.UMR && req.body.params.labelId) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "UMR": req.body.params.UMR
                },
                "selectors": "-history"
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_transactions", "find", _filter, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _lblHst = [];
            _.each(_mResp.data, (_o) => {
                let _fLblData = _.filter(_o.data, (_ld) => { return _ld.type === "LABELS" });
                if (_fLblData && _fLblData.length > 0) {
                    let _fLblHst = _.filter(_fLblData[0].child, (_lh) => { return _lh.lblId == req.body.params.labelId });
                    if (_fLblHst && _fLblHst.length > 0) {
                        let _cLblData = JSON.parse(JSON.stringify(_fLblHst));
                        for (let _fl in _cLblData) {
                            // _cLblData[_fl]["audit"] = {};
                            _cLblData[_fl]["audit"] = JSON.parse(JSON.stringify(_o.audit));
                        };
                        _lblHst = _lblHst.concat(_cLblData);
                    }
                }
            });
            let _fResp = _.chain(_lblHst).groupBy('lblId')
                .map((value, key) => ({
                    lblId: key,
                    lblName: value[0].name,
                    child: _.map(value, (_cO) => {
                        return {
                            value: _cO.value,
                            audit: _cO.audit
                        }
                    })
                }))
                .value();

            return res.status(200).json({ success: true, status: 200, desc: '', data: _fResp || [] });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
router.post("/get-label-history", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.UMR && req.body.params.labelId) {
            let _filter = {
                "filter": [
                    { $unwind: "$data" },
                    {
                        $sort: { "audit.documentedDt": -1 }
                    },
                    {
                        $match: {
                            "recStatus": { $eq: true },
                            "UMR": req.body.params.UMR,
                            "data.lblId": req.body.params.labelId
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            UMR: { "$first": "$UMR" },
                            visitNo: { "$first": "$visitNo" },
                            visit: { "$first": "$visit" },
                            patDet: { $first: "$patDet" },
                            docDetails: { $first: "$docDetails" },
                            data: { $push: "$data" }
                        }
                    }
                ]
            }
            let _mResp = await _mUtils.commonMonogoCall("cm_transactions", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success && _mResp.data.length > 0)) {
                _filter = {
                    "filter": [
                        { $unwind: "$data" },
                        { $unwind: "$data.child" },
                        {
                            $match: {
                                "recStatus": { $eq: true },
                                "UMR": req.body.params.UMR,
                                "data.child.lblId": req.body.params.labelId
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                UMR: { "$first": "$UMR" },
                                visitNo: { "$first": "$visitNo" },
                                visit: { "$first": "$visit" },
                                patDet: { $first: "$patDet" },
                                docDetails: { $first: "$docDetails" },
                                data: { $push: "$data.child" }
                            }
                        }
                    ]
                }

                _mResp = await _mUtils.commonMonogoCall("cm_transactions", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp.data || [] });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* Insert investingation fav */
router.post("/insert-inv-fav", async (req, res) => {
    try {
        _.each(req.body.params, (_obj) => {
            _obj['audit'] = req.body.params.audit;
        });
        mongoMapper('cm_inv_fav', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get investingation fav */
router.post("/get-inv-fav", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_inv_fav", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update investingation fav */
router.post("/update-inv-fav", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_inv_fav", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_inv_fav', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('cm_inv_fav', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/* Insert medication fav */
router.post("/insert-med-fav", async (req, res) => {
    try {
        _.each(req.body.params, (_obj) => {
            _obj['audit'] = req.body.params.audit;
        });
        mongoMapper('cm_med_fav', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Get medication-fav */
router.post("/get-med-fav", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_med_fav", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update medication-fav */
router.post("/update-med-fav", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("cm_med_fav", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_med_fav', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('cm_med_fav', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/** Insert fileds */
router.post("/insert-field-management", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            _.each(req.body.params, (_obj) => {
                _obj['audit'] = req.body.params.audit;
                _obj['orgId'] = req.tokenData.orgId
            });
            //  req.body.params.orgId = req.tokenData.orgId;
            mongoMapper('cm_fieldsmanagement', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
            mongoMapper("cm_fieldsmanagement", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("cm_fieldsmanagement", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_fieldsmanagement', _mResp.data.params, _cBody.params, req);
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

router.post("/insert-diabetic-transaction", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.UMR && req.body.params.visit && req.body.params.visitNo) {

            mongoMapper('cm_diabetics_tran', req.body.query, req.body.params, req.tokenData.dbType).then(async result => {

                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Insert Diabetic Transaction ..`, data: [] });
                }

                let _obj = {
                    "tranId": result.data[0]._id,
                    "dateTime": result.data[0].audit.documentedDt,
                    "docName": req.body.params.docDetails.name,
                    "visit": req.body.params.visit || "OP",
                    "visitNo": req.body.params.visitNo || ""
                };

                let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISIT_TRAN", _obj, req);
                if (!(_patResp && _patResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error Occured while updating visits transactions to Patient ..`, data: [] });
                }
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

router.post("/get-diabetic-transaction", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify(req.body.params))
        _cBody = _.pickBy(_cBody, (c => (c && c.length > 0)))

        let _data = JSON.parse(JSON.stringify(_json_data))
        _cBody['recStatus'] = true
        let _filter = {
            "filter": _cBody,
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, _cBody);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("cm_diabetics_tran", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            let _resp;
            let _finalResp = JSON.parse(JSON.stringify(result));
            let _data;
            _.each(_finalResp.data, (_dt) => {
                if (_dt && _dt.data) {
                    _data = JSON.parse(JSON.stringify(_json_data))
                    _resp = mergingData(_data, _dt.data)
                    _dt.data = _resp
                }
            })
            // let _finalResp = mergingData(_data, result.data[0].data)
            // let _resp = JSON.parse(JSON.stringify(result))
            // _resp.data[0].data = _finalResp
            return res.status(200).send({ success: true, status: 200, desc: '', data: _finalResp });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
})

router.post("/update-diabetic-transaction", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (_cBody.params.data) {
            delete _cBody.params.data
        }
        if (_cBody.params._id && _cBody.params.UMR && _cBody.params.visit && _cBody.params.visitNo) {
            let _mResp = await _mUtils.commonMonogoCall("cm_diabetics_tran", "findById", _cBody.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('cm_diabetics_tran', _mResp.data.params, _cBody.params, req, "cm");
            let pLoadResp = { payload: {} };

            if (!(_hResp && _hResp.success)) {
                console.log("Error while inserting History")
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
            pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
            //let _finalResp = mergingData(_data, req.body.params.data)
            if (req.body.params.data) {
                pLoadResp.payload.pData[0].updateOne.update.$set["data"] = req.body.params.data;
            }
            mongoMapper('cm_diabetics_tran', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {

                if (!(result && result.data && result.status == "SUCCESS")) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Updating Diabetic Transaction ..`, data: [] });
                }

                let _obj = {
                    "tranId": result.data._id,
                    "dateTime": result.data && result.data.audit && result.data.audit.documentedDt ? result.data.audit.documentedDt : "",
                    "docName": req.body.params.docDetails && req.body.params.docDetails.name ? req.body.params.docDetails.name : "",
                    "visit": req.body.params.visit || "OP",
                    "visitNo": req.body.params.visitNo || ""
                };

                let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISIT_TRAN", _obj, req);
                if (!(_patResp && _patResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error Occured while updating visits transactions to Patient ..`, data: [] });
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

router.post("/insert-pincodes", async (req, res) => {
    try {

        mongoMapper('cm_pincodes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


router.post("/get-pincodes", async (req, res) => {
    try {
        let cBody = JSON.parse(JSON.stringify(req.body.params))
        let _filter = {
            filter: {}
        }
        // _.each(cBody,(_v,_k)=>{
        //     _filter.filter[`${_k}`] = {$regex:_v,$options:"i"}
        // })
        let _pGData = await prepareGetPayload(_filter, cBody);

        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        _.each(_pGData.data.filter, (_v, _k) => {
            if (typeof _v !== "number") {
                _pGData.data.filter[`${_k}`] = { $regex: _v, $options: "i" }
            }
            else {
                let _digits = _v.toString().length;
                let min = _v * Math.pow(10, 6 - _digits) 
                let max = (_v + 1) * Math.pow(10, 6 - _digits) - 1
                _pGData.data.filter[`${_k}`] = { $gte: min, $lte: max }
            }
        })
        mongoMapper('cm_pincodes', req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            if(result.data && result.data.length == 0){
                return res.status(400).json({ success: false, status: 400, desc: "No data found", data: [] });
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


module.exports = router;
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
//const _emrToHis = require("./const/emrToHis");
const axios = require("axios");
const stringSimilarity = require("string-similarity");


//const _json_data = require("./const/diabetic-master.json")

let _queries = ["find", "findById", "findOne", "insertMany", "updateOne", "bulkWrite", "updateMany"];
let _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';

const _masters = [
    { "coll": 'BloodGroup', "key": 'bloodGroups' },
    { "coll": 'Gender', "key": 'genders' },
    { "coll": 'Relationship', "key": 'relationships' },
    { "coll": 'ChiefComplaint', "key": 'chiefComplaints' },
    { "coll": 'Title', "key": 'titles' },
    { "coll": 'Religion', "key": 'religions' },
    { "coll": 'PreferLanguage', "key": 'preferLanguages' },
    { "coll": 'Nationality', "key": 'nationalities' },
    { "coll": 'Departments', "key": 'departments' },
    { "coll": 'MaritalStatus', "key": 'maritalStatus' },
    { "coll": 'Speciality', "key": 'speciality' },
    { "coll": 'Specializations', "key": 'specializations' },

]



let _approvalStatus = [
    { flag: 'CHC_PENDING', status: 'Pending for CHC Approval' },
    { flag: 'CHC_APPROVED', status: 'Pending for State Approval' },
    { flag: 'CHC_REJECTED', status: 'Reject at CHC Level' },
    { flag: 'CHC_ALL', status: ['Pending for CHC Approval', 'Pending for State Approval', 'Reject at CHC Level'] },
    { flag: 'STATE_PENDING', status: 'Pending for State Approval' },
    { flag: 'STATE_APPROVED', status: 'Approved' },
    { flag: 'STATE_REJECTED', status: 'Reject at State Level' },

    { flag: 'SENT_TO_MANUFACTURER', status: 'Sent to Manufacturer' },
    { flag: 'RECEIVED_FROM_MANUFACTURER', status: 'Received from Manufacturer' },
    { flag: 'REJECTED_FROM_MANUFACTURER', status: 'Reject at Manufacturer' },
    { flag: 'DISPATCHED_TO_PATIENT', status: 'Dispached to Patient' },
]

const _secretKey = 'S0ftHe@lth$123SUv@$n@Tech8%#!(%';

/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "1200000ms");
};

async function findDuplicatesAndCombinedData(_data, _key1) {
    try {
        let uniqueEntries = [];
        let setCombinationData = new Set();
        _data.forEach((item) => {
            let combination = `${item[_key1]}`;
            if (!setCombinationData.has(combination)) {
                setCombinationData.add(combination);
                uniqueEntries.push(item)
            }
        })
        return uniqueEntries;
    } catch (error) {
        console.log("error", error)
    }
}


async function insertDefaultData(_data, _idx, _output, _dbType, _orgData, _sessionId) {
    try {
        if (_data.length > _idx) {
            // _.each(_data[_idx].data, (_o) => {
            //     _o.orgId = _orgData._id;
            // });
            let orgData = JSON.parse(JSON.stringify(_orgData))
            let formattedObj = {
                orgId: orgData._id,
                locId: orgData.locations[0],
                locName: orgData.locations[0].locName,
                userId: orgData.audit.documentedById,
                sessionId: orgData.sessionId,
                audit: orgData.audit
            }
            if (_data[_idx].depColl && _data[_idx].depColl.length == 0) {
                if (_data[_idx].payLoad && Object.keys(_data[_idx].payLoad).length > 0) {
                    _.each(_data[_idx].payLoad, (_val, _key) => {
                        _.each(_data[_idx].data, (data) => {
                            data[`${_key}`] = formattedObj[`${_key}`]
                        })
                    })
                }

                if ((_data[_idx].seqName && _data[_idx].seqName.length > 0) && (_data[_idx].type == "LABELS" || _data[_idx].type == "COMPLAINTS")) {
                    req = {
                        tokenData: {
                            locId: formattedObj.locId,
                            dbType: _dbType
                        }
                    }
                    let _gcResp = await generateSeqCode(_data[_idx].data[0].labels, 0, [], _data[_idx].seqName, req);
                    if (_gcResp && !_gcResp.success) {
                        _output.push({ success: false, type: _data[_idx].type, desc: "Error occured while generating Sequence Codes For Labels..", data: [] });
                    }
                    else {
                        _data[_idx].data[0]['lables'] = _gcResp.data
                    }
                }
                // console.log("_data[_idx].data", _data[_idx].data)
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
                    let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Documents", "find", _filter, "", "", "", _dbType)
                    if (!(_mResp && _mResp.success)) {
                        _output.push({ success: false, type: _data[_idx].type, desc: _mResp.desc || "", data: [] });
                    }
                    else {
                        let _params = [];
                        _.each(_data[_idx].data, (_role) => {
                            let _docs = [];
                            if (Array.isArray(_role.docmntMap) && _role.docmntMap.length > 0) {
                                _.each(_role.docmntMap, (_doc) => {
                                    let document = _.find(_mResp.data, (_d) => { return _d.documentName == _doc })
                                    _docs.push({
                                        documentId: document._id,
                                        documentCode: document.documentCode || "",
                                        groupCode: document.groupCode,
                                        groupName: document.groupName,
                                        iconClass: document.iconClass || "",
                                        documentName: document.documentName,
                                        documentUrl: document.documentUrl,
                                        isMulti: document.isMulti,
                                        reportUrl: document.reportUrl,
                                        access: _role.access
                                    })
                                })
                            }

                            let _data = {
                                orgId: _orgData._id,
                                code: _role.code,
                                name: _role.name,
                                docmntMap: _docs,
                                tabsMap: _role.tabsMap,
                                sessionId: _sessionId,
                                audit: _orgData.audit
                            }
                            _params.push(_data)
                        })
                        let _mResp1 = await _mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", _params, "", "", "", _dbType)
                        if (!(_mResp1 && _mResp1.success)) {
                            _output.push({ success: false, type: _data[_idx].type, desc: _mResp1.desc || "", data: [] });
                        }
                        else {
                            _output.push({ success: true, type: _data[_idx].type, desc: "", data: _mResp1.data || [] })
                        }
                    }
                }
                if (_data[_idx].type === "LABELSMAPS") {
                    let labelmaps = []
                    let _filter = {
                        "filter": { "orgId": _orgData._id },
                        "selectors": "-audit -history"
                    }
                    let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Documents", "find", _filter, "", "", "", _dbType)
                    if (!(_mResp && _mResp.success)) {
                        _output.push({ success: false, type: _data[_idx].type, desc: _mResp.desc || "", data: [] });
                    }

                    let _labelFilter = {
                        "filter": { "recStatus": true },
                        "selectors": "-audit -history"
                    }
                    let _labels = await _mUtils.commonMonogoCall("ophthamology_ecg_labels", "find", _labelFilter, "", "", "", _dbType)
                    _.each(_data[_idx].data, (labelmap) => {
                        labelmap['orgId'] = formattedObj.orgId
                        labelmap['locId'] = formattedObj.locId
                        labelmap['audit'] = formattedObj.audit
                        //labelmap['userId'] = formattedObj.userId

                        let document = _.find(_mResp.data, (_d) => { return _d.docmntName.toLowerCase() == labelmap.documentName.toLowerCase() })
                        if (document && document._id) {
                            labelmap['documentId'] = JSON.parse(JSON.stringify(document._id))
                        }
                        else {
                            _output.push({ success: false, type: _data[_idx].type, desc: "Document Not Found", data: [] });
                        }
                        _.each(labelmap.labels, (label) => {
                            label['audit'] = formattedObj.audit
                            let lbl = _.find(_labels.data[0].labels, (_l) => { return _l.lblName.toLowerCase() == label.lblName.toLowerCase() })
                            if (lbl && lbl._id && lbl._id && lbl.cd && lbl.cd) {
                                label['lblId'] = JSON.parse(JSON.stringify(lbl._id))
                                label['lblCd'] = JSON.parse(JSON.stringify(lbl.cd))
                            }
                            else {
                                _output.push({ success: false, type: _data[_idx].type, desc: "Label Not Found", data: [] });
                            }
                        })
                        labelmaps.push(labelmap)
                    })
                    let _lResp1 = await _mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", labelmaps, "", "", "", _dbType)
                    if (!(_lResp1 && _lResp1.success)) {
                        _output.push({ success: false, type: _data[_idx].type, desc: _lResp1.desc || "", data: [] });
                    }
                    else {
                        _output.push({ success: true, type: _data[_idx].type, desc: "", data: _lResp1.data || [] })
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

function convertToPascalCase(name) {
    //_name = name.toLowerCase()
    //return _name.split(' ').reduce((s,c)=> (s.charAt(0).toUpperCase()+s.slice(1)) + " " + ((c.charAt(0).toUpperCase() + c.slice(1))))
    return name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}


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
                    contact: req.body.params.contact,
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
                    userData["defaultLocId"] = empData.loc[0].locId;
                }

                const _lfFilter = {
                    "filter": { "_id": mongoose.Types.ObjectId(empData.loc[0].locId), "recStatus": true },
                    "selectors": "-history"
                };

                let lfResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _lfFilter, "", "", "", req.tokenData.dbType);
                if (!(lfResp && lfResp.success)) {
                    resolve({ success: false, status: 400, desc: lfResp.desc || "", data: [] });
                }
                lfResp = JSON.parse(JSON.stringify(lfResp));


                const _roleFilter = {
                    "filter": { "_id": mongoose.Types.ObjectId(empData.loc[0].roleId), "recStatus": true },
                    "selectors": "-history"
                };

                let _roleResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Roles", "find", _roleFilter, "", "", "", req.tokenData.dbType);
                _roleResp = JSON.parse(JSON.stringify(_roleResp));
                if (!(_roleResp && _roleResp.success)) {
                    resolve({ success: false, status: 400, desc: _roleResp.desc || "", data: [] });
                }

                if (_roleResp.data[0].isLinkedFacility == true) {
                    userData["linkedFacilities"] = lfResp.data[0].linkedFacilities;
                }




                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "insertMany", userData, "", "", "", req.tokenData.dbType)
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
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "find", _filter, "", "", "", req.tokenData.dbType)
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
                    let userDeactivate = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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
                    let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Users', userData.params, userData.params, req, "ophthamology_ecg");
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
                    let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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

async function insertMedia(_type, coll, media, req, _data) {
    try {
        let _output = []
        if (typeof media == "object" && Object.keys(media).length > 0) {

            for (let _med in media) {
                let _resp = await insertBase64Data(media[_med])
                if (_resp.success !== true) {
                    _output.push({ success: false, status: 400, desc: _resp.desc, data: [] });
                }
                else {

                    if (_type == "I") {
                        let _insrtMediaPrms = {
                            referenceId: _data._id,
                            [`${_med}`]: _resp._bufferData,
                            [`${_med}MimeType`]: _resp._mimeType,
                            referenceType: `${coll.split("_")[2]}_${_med}`
                        }
                        if (_med == "orglogo" || _med == "favIcon") {
                            _insrtMediaPrms['referenceType'] = req.tokenData.dbType
                        }
                        let _mediaResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Media", "insertMany", _insrtMediaPrms, "", "", "", req.tokenData.dbType);
                        if (!(_mediaResp && _mediaResp.success)) {
                            _output.push({ success: false, status: 400, desc: _mediaResp.desc || "", data: [] });
                        }
                        else {
                            let _updtPrms = {
                                "params":{
                                    _id: _data[0]._id,
                                    [`${_med}`]: _mediaResp.data[0]._id
                                }
                            }
                            let _collpLoadResp = await _mUtils.preparePayload("U", _updtPrms);
                            if (!_collpLoadResp.success) {
                                _output.push({ success: false, status: 400, desc: _collpLoadResp.desc || "", data: [] });
                            }
                            let _orResp = await _mUtils.commonMonogoCall(coll, "findOneAndUpdate", _collpLoadResp.payload, "", "", "", req.tokenData.dbType)
                            if (!(_orResp && _orResp.success)) {
                                _output.push({ success: false, status: 400, desc: _orResp.desc || "", data: _orResp.data || [] });
                            }

                        }
                    }

                    else if (_type == "U") {
                        if(req.body && req.body.params && !req.body.params.mediaId){
                            let _insrtMediaPrms = {
                                referenceId: _data.params._id,
                                [`${_med}`]: _resp._bufferData,
                                [`${_med}MimeType`]: _resp._mimeType,
                                referenceType: `${coll.split("_")[2]}_${_med}`
                            }
                            if (_med == "orglogo" || _med == "favIcon") {
                                _insrtMediaPrms['referenceType'] = req.tokenData.dbType
                            }
                            let _mediaResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Media", "insertMany", _insrtMediaPrms, "", "", "", req.tokenData.dbType);
                            if (!(_mediaResp && _mediaResp.success)) {
                                _output.push({ success: false, status: 400, desc: _mediaResp.desc || "", data: [] });
                            }
                                let _updtPrms = {
                                    "params":{
                                        _id:  _data.params._id,
                                        [`${_med}`]: _mediaResp.data[0]._id
                                    }
                                }
                                let _collpLoadResp = await _mUtils.preparePayload("U", _updtPrms);
                                if (!_collpLoadResp.success) {
                                    _output.push({ success: false, status: 400, desc: _collpLoadResp.desc || "", data: [] });
                                }
                                let _orResp = await _mUtils.commonMonogoCall(coll, "findOneAndUpdate", _collpLoadResp.payload, "", "", "", req.tokenData.dbType)
                                if (!(_orResp && _orResp.success)) {
                                    _output.push({ success: false, status: 400, desc: _orResp.desc || "", data: _orResp.data || [] });
                                }
    
                        }
                        else{
                            let _collFilter = {
                                "filter": {
                                    _id: mongoose.Types.ObjectId(req.body.params._id)
                                },
                                "populate": [
                                    { 'path': `${media[_med]}`, 'select': '' }
                                ]
                            }
    
                            let _collResp = await _mUtils.commonMonogoCall(coll, "find", _collFilter, "", "", "", req.tokenData.dbType)
                            if (!(_collResp && _collResp.success)) {
                                return res.status(400).json({ success: false, status: 400, desc: _collResp.desc || "", data: _collResp.data || [] });
                            }
                            let _updtMediaPrms = {
                                "params": {
                                    _id: _collResp.data[0].orglogo._id,
                                    orglogo: _resp._bufferData,
                                    orglogoMimeType: _resp._mimeType,
                                }
                            }
                            let _updtMediapLoadResp = await _mUtils.preparePayload("U", _updtMediaPrms);
                            if (!_updtMediapLoadResp.success) {
                                _output.push({ success: false, status: 400, desc: _updtMediapLoadResp.desc || "", data: [] });
                            }
                            let _olResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Media", "findOneAndUpdate", _updtMediapLoadResp.payload, "", "", "", req.tokenData.dbType)
                            if (!(_olResp && _olResp.success)) {
                                _output.push({ success: false, status: 400, desc: _olResp.desc || "", data: _olResp.data || [] });
                            }
                        }
                       
                    }

                }
            }

            let _final = _.filter(_output, (_resp)=>{ !_resp.success })
            return {
                "success": _final.length > 0 ? false : true,
                "data": _output
            }

        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

async function bookAppointment(_type, req, _flag) {
    try {
        let _output = [];
        let _doctorId;
        let duration;
        let _docLoc

        if (req.body && req.body.params && req.body.params.doctor) {
            _doctorId = req.body.params.doctor
        }
        else {
            let _locId = req.body.params.locId && req.body.params.locId.length > 0 ? req.body.params.locId : req.tokenData.locId
            let _filter = {
                "filter": { "locations.locId": { $eq: _locId } },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "find", _filter, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            if (_mResp && _mResp.data && _mResp.data.length > 0) {
                _doctorId = _mResp.data[0]._id;
            }
            else if (_mResp && _mResp.data && _mResp.data.length == 0) {
                let _filter = {
                    "filter": { "isDefDoc": { $eq: true } },
                    "selectors": "-audit -history"
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "find", _filter, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                _doctorId = _mResp.data[0]._id
            }
            else {
                return res.status(400).json({ success: false, status: 400, desc: `no doctor found`, data: _mResp.data || [] });
            }
            _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.tokenData.locId });
            duration = _mResp.data[0].duration || 10;
        }





        // check holidays
        // if (_docShift.length == 0 || !_docShift[0].duration) {
        //     _output.push({ success: false, desc: "Error while Booking Appointment, Doctor Shifts are missing.", data: [] });
        // }


        let _docFilter = {
            "filter": {
                "recStatus": { $eq: true },
                "doctor": _doctorId,
                "dateTime": { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString() }
            },
            "selectors": "-audit -history",
            "limit": 1,
            "sort": { _id: -1 }
        }

        let _mApmntResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _docFilter, "", "", "", req.tokenData.dbType)
        if (!(_mApmntResp && _mApmntResp.success)) {
            _output.push({ success: false, desc: _gPayload.desc || "Error occurred while Fetching Consutations records", data: [] });
        }

        let _lstApmntDtTime = _mApmntResp.data && _mApmntResp.data.length > 0 ? moment(_mApmntResp.data[0].dateTime) : moment();
        let _nextAppointmentTime = _lstApmntDtTime.add((duration || 10), "minutes");
        let _currentDateTime = moment();
        if (_nextAppointmentTime.isBefore(_currentDateTime)) {
            _nextAppointmentTime = _currentDateTime.add(10, "minutes");
        }

        let _params = {
            locId: req.tokenData.locId,
            code: "",
            visitType: _flag,
            // documentId: _nextAppointmentTime.toISOString(),
            doctor: _doctorId,
            UMR: req.body.params.UMR,
            patient: req.body.params.patId,
            reasonForVisit: req.body.params.reasonForVisit || "",
            remarks: req.body.params.remarks || "",
            source: req.body.params.source || "",
            amount: req.body.params.queueNo || 0,
            queueNo: req.body.params.queueNo || "",
            queueDt: req.body.params.queueDt || "",
            tokenNo: req.body.params.tokenNo || "",
            status: req.body.params.status || "BOOKED",
            isPayment: req.body.params.isPayment,
            paymentMode: req.body.params.paymentMode,
            paymentRefId: req.body.params.paymentRefId,
            checkStatus: req.body.params.checkStatus,
            refBy: req.body.params.refBy || "",
            reasonForSlotCancelCode: req.body.params.reasonForSlotCancelCode || "",
            reasonForSlotCancelName: req.body.params.reasonForSlotCancelName || ""
        }
        let _gPayload = await generateSlotsPayload(_params, _nextAppointmentTime, duration, 1, 0, [], "", "", req);
        if (!(_gPayload && _gPayload.success)) {
            _output.push({ success: false, desc: _gPayload.desc || "Error occurred while Generating Slots Payload", data: [] });
        }
        let _finalResp = []
        _.each(_gPayload.data, (_o) => {
            _finalResp.push(_o.data);
        });
        let _appointment = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "insertMany", _finalResp, "", req.body, "", req.tokenData.dbType)

        if (!(_appointment && _appointment.success)) {
            _output.push({ success: false, desc: _appointment.desc || "Error while Consultation is booked.", data: _appointment.data || [] });
        }
        else {
            let _obj = {
                "visits": _appointment.data[0]._id
            };
            let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISITS", _obj, req);
            if (!(_patResp && _patResp.success)) {
                _output.push({ success: false, desc: "Error Occured while updating Visits details to Patient", data: [] });
            }

            _output.push({ success: true, desc: "", data: _appointment.data || [] });
        }

        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output || []
        }

    }
    catch (error) {
        console.log("error", error)
        return { success: false, desc: "Failed To Book Appointment" }
    }
}

async function bookAppointment_old(_type, req, _flag) {
    try {
        let _output = [];
        let _doctorId;

        let _filter = {
            "filter": { "isDefaultDoctor": { $eq: true } },
            "selectors": "-audit -history"
        }
        let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "find", _filter, "", req.body, "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
        }
        if (req.body && req.body.params && !req.body.params.doctor) {
            if (_mResp && _mResp.data && _mResp.data.length > 0) {
                _doctorId = _mResp.data[0]._id;
            }
            else {
                return res.status(400).json({ success: false, status: 400, desc: `no doctor found`, data: _mResp.data || [] });
            }
        }
        else {
            _doctorId = req.body.params.doctor
        }

        let _docLoc = _.filter(_mResp.data.locations, (_o) => { return _o.locId === req.tokenData.locId });

        // check holidays
        // if (_docShift.length == 0 || !_docShift[0].duration) {
        //     _output.push({ success: false, desc: "Error while Booking Appointment, Doctor Shifts are missing.", data: [] });
        // }

        let duration = _mResp.data[0].duration || 10;
        let _docFilter = {
            "filter": {
                "recStatus": { $eq: true },
                "doctor": _doctorId,
                "dateTime": { $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString() }
            },
            "selectors": "-audit -history",
            "limit": 1,
            "sort": { _id: -1 }
        }

        let _mApmntResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _docFilter, "", "", "", req.tokenData.dbType)
        if (!(_mApmntResp && _mApmntResp.success)) {
            _output.push({ success: false, desc: _gPayload.desc || "Error occurred while Fetching Consutations records", data: [] });
        }

        let _lstApmntDtTime = _mApmntResp.data && _mApmntResp.data.length > 0 ? moment(_mApmntResp.data[0].dateTime) : moment();
        let _nextAppointmentTime = _lstApmntDtTime.add((duration || 10), "minutes");
        let _currentDateTime = moment();
        if (_nextAppointmentTime.isBefore(_currentDateTime)) {
            _nextAppointmentTime = _currentDateTime.add(10, "minutes");
        }

        let _params = {
            locId: req.tokenData.locId,
            code: "",
            visitType: _flag,
            //documentId: _nextAppointmentTime.toISOString(),
            doctor: _doctorId,
            UMR: req.body.params.UMR,
            patient: req.body.params.patId,
            reasonForVisit: req.body.params.reasonForVisit || "",
            remarks: req.body.params.remarks || "",
            source: req.body.params.source || "",
            amount: req.body.params.queueNo || 0,
            queueNo: req.body.params.queueNo || "",
            queueDt: req.body.params.queueDt || "",
            tokenNo: req.body.params.tokenNo || "",
            status: req.body.params.status || "BOOKED",
            isPayment: req.body.params.isPayment,
            paymentMode: req.body.params.paymentMode,
            paymentRefId: req.body.params.paymentRefId,
            checkStatus: req.body.params.checkStatus,
            refBy: req.body.params.refBy || "",
            reasonForSlotCancelCode: req.body.params.reasonForSlotCancelCode || "",
            reasonForSlotCancelName: req.body.params.reasonForSlotCancelName || ""
        }
        let _gPayload = await generateSlotsPayload(_params, _nextAppointmentTime, duration, 1, 0, [], "", "", req);
        if (!(_gPayload && _gPayload.success)) {
            _output.push({ success: false, desc: _gPayload.desc || "Error occurred while Generating Slots Payload", data: [] });
        }
        let _finalResp = []
        _.each(_gPayload.data, (_o) => {
            _finalResp.push(_o.data);
        });
        let _appointment = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "insertMany", _finalResp, "", req.body, "", req.tokenData.dbType)

        if (!(_appointment && _appointment.success)) {
            _output.push({ success: false, desc: _appointment.desc || "Error while Consultation is booked.", data: _appointment.data || [] });
        }
        else {
            let _obj = {
                "visits": _appointment.data[0]._id
            };
            let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISITS", _obj, req);
            if (!(_patResp && _patResp.success)) {
                _output.push({ success: false, desc: "Error Occured while updating Visits details to Patient", data: [] });
            }

            _output.push({ success: true, desc: "", data: _appointment.data || [] });
        }

        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output || []
        }

    }
    catch (error) {
        return { success: false, desc: "Failed To Book Appointment" }
    }
}

/*check Slots already booked or not */
async function checkIfSlotBooked(locId, docId, _apmntTime, req) {
    let _cParams = {
        "filter": {
            "locId": locId,
            "docDetails.docId": mongoose.Types.ObjectId(docId),
            "dateTime": _apmntTime
        },
        "selectors": "-audit -history"
    };
    let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", 'findOne', _cParams, "", "", "", req.tokenData.orgKey.toLowerCase());
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
            let _apmntTime = _idx === 0 ? moment(_time).toISOString() : moment(_time).add(_duration, 'm').toISOString();
            let isSlotBooked = await checkIfSlotBooked(req.tokenData.locId, _data.doctor, _apmntTime, req)
            if (isSlotBooked) {
                if (_data.apmntType == "REVIEW") {
                    _apmntTime = moment(_time).add(_duration, 'm').toISOString();
                    await generateSlotsPayload(_data, _apmntTime, _duration, _cnt, _idx, _output, _coll, _method, req);
                }
                else {
                    return { success: false, desc: "This slot is already booked. please choose another time slot.", data: [] };
                }
            } else {
                let _seqResp = await _mUtils.getSequenceNextValue({ orgId: req.tokenData.orgId, seqName: 'Consultation' }, "ophthamology_ecg", req);
                if (!(_seqResp && _seqResp.success)) {
                    _output.push({ success: false, type: (_data[_idx] ? _data[_idx].type : ""), desc: _seqResp.desc || "", data: [] });
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
            let _mPatResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Patients", "find", _filter, "", "", "", req.tokenData.dbType)
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
            req.dbName = `${req.tokenData.dbType}_ophthamology_ecg`;
            // let _hResp = await _mUtils.insertHistoryData(`ophthamology_ecg_Patients`, patData.params, patData.params, req, "cm");
            if (_type && _type === "BILLS") {

                if (Object.keys(_data).length > 0 || _data !== "") {
                    patData.params.bills = _data;
                }

                _filter.filter['outStandingDue'] = { $gt: 0 }
                let totalData = []
                let getBillsAgnstUmr = await _mUtils.commonMonogoCall("ophthamology_ecg_bills", "find", _filter, "", "", "", req.tokenData.dbType)
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
                patData.params.visits = _data.visits;
            }
            else if (_type && _type === "VISIT_TRAN") {
                patData.params.visitTransactions = _data.visitTransactions;
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
                        tranId: _data.tranId || data.tranId || "",
                        diabTranId: _data.diabTranId || data.diabTranId || "",
                        documentId: _data.documentId,
                        diabStatus: _data.diabStatus == false ? false : true
                    }
                ]
                patData.params.visits = visits;
            }
            else if (_type && _type === "VISIT_TRAN_UPD") {
                let data;
                _.each(_mPatResp.data[0].visitTrans, (objects, index) => {
                    if (objects.visitNo === req.body.params.visitNo && objects.diabTranId == req.body.params._id) {
                        data = objects
                    }
                })
                let visitTransUpd = [
                    {
                        _id: data._id,
                        diabStatus: _data.diabStatus == false ? false : true
                    }
                ]
                patData.params.visitTransactions = visitTransUpd;
            }
            else if (_type && _type === "AAPT_UPDT") {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "code": req.body.params.visitNo
                    },
                    "selectors": "-history"
                }
                let getApmtAgstCode = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", "", "", req.tokenData.dbType)
                patData = {
                    params: {
                        _id: getApmtAgstCode.data[0]._id,
                        revNo: getApmtAgstCode.data[0].revNo,
                        documentId: _data.documentId ? _data.documentId : "",
                        visitTransaction: _data.visitTransaction ? _data.visitTransaction : "",
                        audit: {
                            documentedById: _mPatResp.data[0].audit.documentedById,
                            documentedBy: _mPatResp.data[0].audit.documentedBy,
                            documentedDt: _mPatResp.data[0].audit.documentedDt
                        }
                    }
                };
            }
            patData.params.audit = {};
            patData.params.audit["modifiedById"] = req.tokenData.userId;
            patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
            patData.params.audit["modifiedByDt"] = new Date().toISOString();
            patData.params.revNo = patData.params.revNo + 1;
            // patData.params["history"] = {
            //     "revNo": _hResp.data[0].revNo,
            //     "revTranId": _hResp.data[0]._id
            // }
            pLoadResp = await _mUtils.preparePayload("U", patData);
            if (!pLoadResp.success) {
                resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _uResp;
            if (_type === "AAPT_UPDT" || _type === "UPDATE_APPOINTMENT" || _type === "UPDATE_APPOINTMENT_WITH_BILL") {
                _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            } else {
                if (_type == "VISITS_TRAN") {
                    pLoadResp.payload.query.$push['visitTransactions'] = _data.visitTransactions
                }
                if (_type == "VISITS") {
                    if (pLoadResp.payload.query.$set.visits) {
                        delete pLoadResp.payload.query.$set['visits']
                    }
                    pLoadResp.payload.query.$push['visits'] = _data.visits

                }
                _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Patients", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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
            // if (_data[_idx].type === 'VITALS') {
            //     _coll = "ophthamology_ecg_vitals_tran";
            // }
            if (_data[_idx].type === 'INVESTIGATION') {
                _coll = "ophthamology_ecg_investigation_tran";
            }
            else if (_data[_idx].type === 'MEDICATION') {
                _coll = "ophthamology_ecg_medications_tran";
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
                let consultAmt = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", "", "", req.tokenData.dbType)
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
                let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);

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




            let _mPatResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
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

            //let _updateResp = await insertUpdateInMultiData(patData, 0, [], req.tokenData.dbType, 'ophthamology_ecg_transactions', 'findOneAndUpdate', 'U')
            let _updateResp = await insertUpdateInMultiData(patData, 0, [], req.tokenData.dbType, 'ophthamology_ecg_transactions', 'bulkWrite', 'BW')
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
                let _mPatResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "find", _filter, "", "", "", req.tokenData.dbType);
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
                let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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
            _.each(_data, async (_doc) => {
                if (_doc.docData && _doc.docData.length > 0) {
                    if (_doc.docData[0].docInfo && _doc.docData[0].docMimeType && _doc.docData[0].docMimeType.length > 0) {
                        let _cnvertedBase64 = await _doc.docData[0].docInfo.toString("base64");
                        let _mimeTypeChkData = _cnvertedBase64.includes('dataapplication/pdfbase64') ? _cnvertedBase64.split('dataapplication/pdfbase64')[1] : _cnvertedBase64;
                        let _base64 = `${_doc.docData[0].docMimeType},${_mimeTypeChkData}`;
                        let _resp = {
                            umr: _doc.UMR,
                            admnNo: _doc.docData[0].admNo || "",
                            admnDt: _doc.docData[0].admnDt || "",
                            docId: _doc._id,
                            docName: _doc.docData[0].docName,
                            docType: _doc.docData[0].docType,
                            format: _doc.docData[0].format,
                            remarks: _doc.remarks,
                            documentedBy: _doc.audit.documentedBy,
                            documentedId: _doc.audit.documentedId,
                            documentedDt: _doc.audit.documentedDt,
                            docDataBase64: _base64,
                            isImage: _doc.docData[0].isImage,
                            path: _doc.docData[0].path
                        };
                        _docs.push(_resp);
                    }
                }
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "aggregation", _filter, "", req.body, "", _key)
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


async function insertBase64Data(_base64String) {
    let matches = _base64String.match(/^data:(.*);base64,(.*)$/);
    if (!matches) {
        return { success: false, desc: "Invalid Base64 Data", data: [] }
    }
    let _mimeType = matches[1]
    let _base64Data = matches[2]

    let _bufferData = Buffer.from(_base64Data, 'base64')

    return { success: true, _mimeType: `data:${_mimeType};base64`, _bufferData: _bufferData }
}

async function getBase64Data(_mimeType, _bufferData) {
    let _data = Buffer.from(_bufferData)
    let _base64Data = await _data.toString('base64')
    let _finalData = `${_mimeType},${_base64Data}`

    //return `data:${_mimeType};base64,${_base64Data}`
    return _finalData
}

router.get('/server-datetime', (req, res) => {
    const now = new Date();
    res.json({
        serverTime: now.toISOString(), // Returns ISO 8601 format
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
});


/* Get Organization Details */
router.get("/get-org-details--old", async (req, res) => {
    try {
        if (req.query && req.query.orgKey) {
            let _filter = {
                "filter": { "orgKey": req.query.orgKey, "recStatus": true },
                "selectors": "-history",
                "populate": [
                    { 'path': 'locations', 'select': '' }
                ]
            }
            mongoMapper("ophthamology_ecg_Organization", "find", _filter, req.query.orgKey.toLowerCase()).then(async (result) => {
                let _parseData = JSON.parse(JSON.stringify(result.data))
                if (_parseData[0].locations && _parseData[0].locations.length > 0) {
                    _parseData[0].locations = _.filter(_parseData[0].locations, (_loc) => { return _loc.recStatus == true })
                }
                if (_parseData[0].notificationTemplate && _parseData[0].notificationTemplate.length > 0) {
                    _parseData[0].notificationTemplate = _.filter(_parseData[0].notificationTemplate, (_notif) => { return _notif.recStatus == true })
                    _.each(_parseData[0].notificationTemplate, (notifTemplate) => {
                        notifTemplate.templates = _.filter(notifTemplate.templates, (_temp) => { return _temp.recStatus == true })
                    })
                }
                if (_parseData[0].notificationVendors && _parseData[0].notificationVendors.length > 0) {
                    _parseData[0].notificationVendors = _.filter(_parseData[0].notificationVendors, (_notif) => { return _notif.recStatus == true })
                    _.each(_parseData[0].notificationVendors, (notifVendor) => {
                        notifVendor.vendorDetails = _.filter(notifVendor.vendorDetails, (_temp) => { return _temp.recStatus == true })
                    })
                }
                let _base64org;
                let _base64favIcon;
                let _base64nabh;
                if (_parseData[0].orglogo && _parseData[0].orglogo != "" && _parseData[0].orglogoMimeType && _parseData[0].orglogoMimeType.length > 0) {
                    var orgbufferData = Buffer.from(_parseData[0].orglogo)
                    _base64org = await orgbufferData.toString('base64');
                    _parseData[0]['orglogo'] = `${_parseData[0].orglogoMimeType},${_base64org}`
                }
                else {
                    _parseData[0]['orglogo'] = ""
                }
                if (_parseData[0].favIcon && _parseData[0].favIcon !== "" && _parseData[0].favIconMimeType && _parseData[0].favIconMimeType.length > 0) {
                    var favIconbufferData = Buffer.from(_parseData[0].favIcon)
                    _base64favIcon = await favIconbufferData.toString('base64');
                    _parseData[0]['favIcon'] = `${_parseData[0].favIconMimeType},${_base64favIcon}`
                }
                else {
                    _parseData[0]['favIcon'] = ""
                }
                if (_parseData[0].locations && _parseData[0].locations.length > 0) {
                    for (let location of _parseData[0].locations) {
                        if (location.nabhLogo && location.nabhLogo !== "" && location.nabhMimeType && location.nabhMimeType.length > 0) {
                            var nabhbufferData = Buffer.from(location.nabhLogo)
                            _base64nabh = await nabhbufferData.toString('base64');
                            location['nabhLogo'] = `${location.nabhMimeType},${_base64nabh}`
                        }
                        else {
                            location['nabhLogo'] = ""
                        }
                        if (location.linkedFacilities && Array.isArray(location.linkedFacilities)) {
                            location.linkedFacilities = location.linkedFacilities.filter(facility => facility.recStatus !== false)
                        }
                    }
                }
                // if (_parseData[0].locations[0].nabhLogo && _parseData[0].locations[0].nabhMimeType) {
                //     var nabhbufferData = Buffer.from(_parseData[0].locations[0].nabhLogo)
                //     _base64nabh = await nabhbufferData.toString('base64');
                //     _parseData[0].locations[0]['nabhLogo'] = `${_parseData[0].locations[0].nabhMimeType},${_base64nabh}`
                // }
                // else {
                //     _parseData[0].locations[0]['nabhLogo'] = ""
                // }
                // let _findDocAganistLocation = await findDocAganistLocation(_parseData[0].locations, 0, [], req, req.query.orgKey.toLowerCase())
                // _parseData[0].locations = _findDocAganistLocation.data
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
router.get("/get-org-details", async (req, res) => {
    try {
        if (req.query && req.query.orgKey) {
            let _filter = {
                "filter": { "orgKey": req.query.orgKey, "recStatus": true },
                "selectors": "-history",
                "populate": [
                    { 'path': 'locations', 'match': { recStatus: true }, 'select': '' },
                    { 'path': 'orglogo', 'match': { referenceType: req.query.orgKey }, 'select': '' }
                ]
            }
            mongoMapper("ophthamology_ecg_Organization", "find", _filter, req.query.orgKey.toLowerCase()).then(async (result) => {
                let _parseData = JSON.parse(JSON.stringify(result.data))
                if (_parseData[0].locations && _parseData[0].locations.length > 0) {
                    _parseData[0].locations = _.filter(_parseData[0].locations, (_loc) => { return _loc.recStatus == true })
                }
                if (_parseData[0].notificationTemplate && _parseData[0].notificationTemplate.length > 0) {
                    _parseData[0].notificationTemplate = _.filter(_parseData[0].notificationTemplate, (_notif) => { return _notif.recStatus == true })
                    _.each(_parseData[0].notificationTemplate, (notifTemplate) => {
                        notifTemplate.templates = _.filter(notifTemplate.templates, (_temp) => { return _temp.recStatus == true })
                    })
                }
                if (_parseData[0].notificationVendors && _parseData[0].notificationVendors.length > 0) {
                    _parseData[0].notificationVendors = _.filter(_parseData[0].notificationVendors, (_notif) => { return _notif.recStatus == true })
                    _.each(_parseData[0].notificationVendors, (notifVendor) => {
                        notifVendor.vendorDetails = _.filter(notifVendor.vendorDetails, (_temp) => { return _temp.recStatus == true })
                    })
                }
                let _base64org;
                let _base64favIcon;
                let _base64nabh;
                if (_parseData[0].orglogo && typeof _parseData[0].orglogo == "object" && Object.keys(_parseData[0].orglogo).length > 0 && _parseData[0].orglogo.orglogo != "" && _parseData[0].orglogo.orglogoMimeType && _parseData[0].orglogo.orglogoMimeType.length > 0) {
                    var orgbufferData = Buffer.from(_parseData[0].orglogo.orglogo)
                    _base64org = await orgbufferData.toString('base64');
                    _parseData[0]['mediaId'] = result.data[0].orglogo._id
                    _parseData[0]['orglogo'] = `${_parseData[0].orglogo.orglogoMimeType},${_base64org}`
                }
                else {
                    _parseData[0]['orglogo'] = ""
                }
                if (_parseData[0].favIcon && _parseData[0].favIcon !== "" && _parseData[0].favIconMimeType && _parseData[0].favIconMimeType.length > 0) {
                    var favIconbufferData = Buffer.from(_parseData[0].favIcon)
                    _base64favIcon = await favIconbufferData.toString('base64');
                    _parseData[0]['favIcon'] = `${_parseData[0].favIconMimeType},${_base64favIcon}`
                }
                else {
                    _parseData[0]['favIcon'] = ""
                }
                if (_parseData[0].locations && _parseData[0].locations.length > 0) {
                    for (let location of _parseData[0].locations) {
                        if (location.nabhLogo && location.nabhLogo !== "" && location.nabhMimeType && location.nabhMimeType.length > 0) {
                            var nabhbufferData = Buffer.from(location.nabhLogo)
                            _base64nabh = await nabhbufferData.toString('base64');
                            location['nabhLogo'] = `${location.nabhMimeType},${_base64nabh}`
                        }
                        else {
                            location['nabhLogo'] = ""
                        }
                        if (location.linkedFacilities && Array.isArray(location.linkedFacilities)) {
                            location.linkedFacilities = location.linkedFacilities.filter(facility => facility.recStatus !== false)
                        }
                    }
                }
                // if (_parseData[0].locations[0].nabhLogo && _parseData[0].locations[0].nabhMimeType) {
                //     var nabhbufferData = Buffer.from(_parseData[0].locations[0].nabhLogo)
                //     _base64nabh = await nabhbufferData.toString('base64');
                //     _parseData[0].locations[0]['nabhLogo'] = `${_parseData[0].locations[0].nabhMimeType},${_base64nabh}`
                // }
                // else {
                //     _parseData[0].locations[0]['nabhLogo'] = ""
                // }
                // let _findDocAganistLocation = await findDocAganistLocation(_parseData[0].locations, 0, [], req, req.query.orgKey.toLowerCase())
                // _parseData[0].locations = _findDocAganistLocation.data
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
        let _sessionData = await _mUtils.commonMonogoCall("ophthamology_ecg_UserSessions", "findOne", _filter, "", "", "", req.headers.orgkey.toLowerCase());
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
        mongoMapper('ophthamology_ecg_UserSessions', 'findOneAndUpdate', pLoadResp.payload, req.headers.orgkey.toLowerCase()).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
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
                            photoMimeType: { $first: "$photoMimeType" },
                            signatureMimeType: { $first: "$signatureMimeType" },
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "aggregation", _filter, "", req.body, "", _key)
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
            let _mResp1 = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "aggregation", _filter, "", req.body, "", _key)

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
        if (!(req.body && req.body.params.orgId && req.body.params.orgKey && req.body.params.locId && req.body.params.uName && (req.body.params.otp || req.body.params.pwd))) {
            return res.status(400).send({ success: false, status: 400, desc: "Required Missing Parameters ..", data: [] });
        }
        let _userFilter = {
            "recStatus": true,
            "userName": { $eq: req.body.params.uName },
            "locations.locId": req.body.params.locId,
        };

        let _selectors = {
            "orgId": "$orgId",
            "_id": "$_id",
            "recStatus": "$recStatus",
            "empId": "$empId",
            "userName": "$userName",
            "displayName": "$displayName",
            "defaultLocId": "$defaultLocId",
            "loginStatus": "$loginStatus",
            "logHistory": "$logHistory",
            "locations": {
                $filter: {
                    input: "$locations",
                    cond: {
                        $eq: ["$$this.locId", req.body.params.locId]
                    }
                }
            },
            "audit": "$audit",
            "revNo": "$revNo"
        }

        if (req.body && req.body.params && req.body.params.otp && req.body.params.otp.length > 0) {
            _userFilter.otp = { $eq: req.body.params.otp }
            _userFilter.orgId = mongoose.Types.ObjectId(req.body.params.orgId)
            _selectors.otp = "$otp"
        }

        if (req.body && req.body.params && req.body.params.pwd && req.body.params.pwd.length > 0) {
            _userFilter.password = { $eq: req.body.params.pwd }
            _userFilter.orgId = req.body.params.orgId
            _selectors.password = "$password"
        }

        let _uParams = {
            "filter": _userFilter,
            "selectors": _selectors
        }
        let _userData = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "find", _uParams, "", "", "", req.body.params.orgKey.toLowerCase());
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
            let _sessionUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_UserSessions", "findOneAndUpdate", pLoadResp.payload, "", "", "", req.body.params.orgKey.toLowerCase());
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
        let _sessionData = await _mUtils.commonMonogoCall("ophthamology_ecg_UserSessions", "findOne", _filter, "", "", "", req.body.params.orgKey.toLowerCase());
        if ((_sessionData && _sessionData.success && _sessionData.data && Object.keys(_sessionData.data).length > 0 && _sessionData.data.token && _sessionData.data.token.length > 0)) {
            _sessionData.data.token = "";
            return res.status(403).json({ success: false, status: 403, desc: `This user is currently logged in on another device..`, data: _sessionData.data || [] });
        }
        let _rParams = {
            "filter": { "orgId": req.body.params.orgId },
            "selectors": "-audit -history"
        }
        let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Roles", "find", _rParams, "", "", "", req.body.params.orgKey.toLowerCase());
        if (!(_mResp && _mResp.success && _mResp.data)) {
            return res.status(400).json({ success: false, status: 400, desc: `User Role does not match with Role mastes..`, data: [] });
        }
        let _roleDocs = _.filter(_mResp.data, (_d) => { return _d._id.toString() == _clnUser[0].locations[0].roleId.toString() });
        if (!(_roleDocs && _roleDocs.length > 0 && _roleDocs[0].docmntMap)) {
            return res.status(400).json({ success: false, status: 400, desc: `No Documents found..`, data: [] });
        }

        let findDocAganistLocationWithAppointment = {}
        if (JSON.parse(JSON.stringify(_roleDocs)).length > 0 && JSON.parse(JSON.stringify(_roleDocs))[0].label == "Secretary") {
            let _eEesp = await _mUtils.commonMonogoCall("ophthamology_ecg_Employee", "findById", JSON.parse(JSON.stringify(_userData.data))[0].empId, "", "", "", req.body.params.orgKey.toLowerCase());
            if (_eEesp.data.length > 0) {
                let _empLocFilterData = _.filter(JSON.parse(JSON.stringify(_eEesp.data)).locations, (_lo, _li) => { return _lo.locId == mongoose.Types.ObjectId(`${req.body.params.locId}`) })
                findDocAganistLocationWithAppointment = await _findDocAganistLocationWithAppointment(_empLocFilterData[0].resourceMap, 0, [], req, req.body.params.orgKey.toLowerCase())
            }
        }

        let _docAccess = _.filter(_roleDocs[0].docmntMap, function (o) { return o.access.view || o.access.edit || o.access.print || o.access.read; });
        let _docString = [];
        _.each(_docAccess, (_i) => {
            _docString.push(_i.documentUrl);
        });

        let _orgFilter = {
            "filter": { "orgId": req.body.params.orgId },
            "selectors": "-audit -history",
            "populate": [
                { 'path': 'locations', 'select': '' }
            ]
        }

        let _mOrgResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Organization", "find", _orgFilter, "", "", "", req.body.params.orgKey.toLowerCase());
        if (!(_mOrgResp && _mOrgResp.success && _mOrgResp.data)) {
            return res.status(400).json({ success: false, status: 400, desc: `No Organization data found ..`, data: [] });
        }
        //syncchnages
        let locationDetails = (_mOrgResp.data[0].locations).find(loc => loc._id == (req.body.params.locId));
        if (!locationDetails) {
            return res.status(400).json({ success: false, status: 400, desc: `No location data found against to organization ..`, data: [] });
        }
        //mongoose.Types.ObjectId(`${req.body.params.locId}`)
        let _user = {
            "orgKey": req.body.params.orgKey, "orgId": req.body.params.orgId, "locId": req.body.params.locId, "locName": locationDetails.locName, "locType": locationDetails.locType, "dbType": _mOrgResp.data[0].dbType, "createdDt": new Date(), "userId": _clnUser[0]._id, "userName": _clnUser[0].userName,
            "displayName": _clnUser[0].displayName, "roleId": _clnUser[0].locations[0].roleId, "roleName": _clnUser[0].locations[0].role, docAccess: _docString
        };
        //syncchanges
        // let _user = {
        //     "orgKey": req.body.params.orgKey, "orgId": req.body.params.orgId, "locId": req.body.params.locId, "locName": _clnUser[0].locations[0].locName, "dbType": _mOrgResp.data.dbType, "createdDt": new Date(), "userId": _clnUser[0]._id, "userName": _clnUser[0].userName,
        //     "displayName": _clnUser[0].displayName, "roleId": _clnUser[0].locations[0].roleId, "roleName": _clnUser[0].locations[0].role, docAccess: _docString
        // };

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
        mongoMapper("ophthamology_ecg_UserSessions", "insertMany", _sessionParams, req.body.params.orgKey.toLowerCase()).then(async (result) => {
            if (!(result.status == 'SUCCESS' && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Login failed / Failed to generate session`, data: [] });
            }
            _user['sessionId'] = result.data[0]._id;
            _user['locDocData'] = findDocAganistLocationWithAppointment.data && findDocAganistLocationWithAppointment.data.length > 0 ? findDocAganistLocationWithAppointment.data : []
            _user['tabsMap'] = _roleDocs[0].tabsMap ? _roleDocs[0].tabsMap : [];
            return res.status(200).json({ success: true, status: 200, desc: "", data: _user || [] });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        console.log("error",error);
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.use(function encryptData(req, res, next) {

    const excludeRoutes = [];

    if (excludeRoutes.includes(req.path)) {
        return next();
    }
    const originalJson = res.json;

    res.json = function (data) {
        try {
            const _encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), _secretKey).toString();
            originalJson.call(this, { _encryptedData });
        } catch (err) {
            originalJson.call(this, { status: 'FAIL', desc: `Encryption failed`, error: err })
        }
    };
    next();
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
                "selectors": "-history -password -mobile -email -otp"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            mongoMapper("ophthamology_ecg_Users", "find", _filter, _dbType).then((result) => {
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
    if (req.url === '/auth-user' || req.url === '/validate-user' || req.url === '/forgot-password' || req.url === '/update-password' || req.url === '/logout' || req.headers.exclude) {
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
            let _sessionData = await _mUtils.commonMonogoCall("ophthamology_ecg_UserSessions", 'findOne', _filter, "", "", "", req.headers.orgkey.toLowerCase());
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
                let _sessionUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_UserSessions", "findOneAndUpdate", pLoadResp.payload, "", "", "", req.headers.orgkey.toLowerCase());
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

            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_errorLogging", "insertMany", _params, "", req.body, "", req.tokenData.dbType)
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
        //req.tokenData = { "userId": 1234, "displayName": "Guna", "dbType":"emr" };
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
        if (req.body.params.roleName.length > 0 && req.body.params.roleName == "Secretary" || req.body.params.roleName == "Nurse") {
            let _eEesp = await _mUtils.commonMonogoCall("ophthamology_ecg_employee", "findById", req.body.params.empId, "", "", "", req.tokenData.dbType);
            let _empLocFilterData = _.filter(JSON.parse(JSON.stringify(_eEesp.data)).locations, (_lo, _li) => { return _lo.locId == mongoose.Types.ObjectId(`${req.body.params.locId}`) })
            let findDocAganistLocationWithAppointment = await _findDocAganistLocationWithAppointment(_empLocFilterData[0].resourceMap, 0, [], req, req.tokenData.dbType);
            findDocAganistLocationWithAppointment = JSON.parse(JSON.stringify(findDocAganistLocationWithAppointment))
            for (let _doc of findDocAganistLocationWithAppointment.data) {
                if (_doc.photo && _doc.photo !== "" && _doc.photoMimeType && _doc.photoMimeType.length > 0) {
                    if (typeof _doc.photo == "string") {
                        _doc['photo'] = `${_doc.photoMimeType},${_doc.photo}`
                    }
                    else {
                        let data = await getBase64Data(_doc.photoMimeType, _doc.photo)
                        _doc['photo'] = data
                    }
                }
                else {
                    _doc['photo'] = ""
                }
                _doc['signature'] = ""
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: findDocAganistLocationWithAppointment.data });

        }
        else {
            return res.status(400).json({ status: 'FAIL', desc: "Provided Role Is Not Accept", data: [] });
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
                if (_k === 'id') {
                    _payload[_k] = mongoose.Types.ObjectId(_i);
                } else {
                    _payload[_k] = _i;
                }
            }
        });
        return { success: true, data: _payload };
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err };
    }
};
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
        if (req.body && req.body.params && req.body.params.orgKey && req.body.params.orgKey.length > 0) {
            req.body.params.locations[0]["audit"] = req.body.params.audit;
            let _orgbase64data;
            let _favbase64data;
            let _nabhbase64data;
            if (req.body.params.orglogo && req.body.params.orglogo.length > 0) {
                req.body.params["orglogoMimeType"] = req.body.params.orglogo.split(',')[0];
                _orgbase64data = req.body.params.orglogo.replace(/^data:.*,/, '');
                req.body.params["orglogo"] = new Buffer.from(_orgbase64data, 'base64');
            }
            if (req.body.params.favIcon && req.body.params.favIcon.length > 0) {
                req.body.params["favIconMimeType"] = req.body.params.favIcon.split(',')[0];
                _favbase64data = req.body.params.favIcon.replace(/^data:.*,/, '');
                req.body.params["favIcon"] = new Buffer.from(_favbase64data, 'base64');
            }
            if (req.body.params.locations && req.body.params.locations.length > 0) {
                for (let location of req.body.params.locations) {
                    if (location && location.nabhLogo && location.nabhLogo.length > 0) {
                        location["nabhMimeType"] = location.nabhLogo.split(',')[0];
                        _nabhbase64data = location.nabhLogo.replace(/^data:.*,/, '');
                        location["nabhLogo"] = new Buffer.from(_nabhbase64data, 'base64');
                    }
                }
            }
            if (req.body.params.notificationTemplate && req.body.params.notificationTemplate.length > 0) {
                let _gcResp = await generateSeqCode(req.body.params.notificationTemplate, 0, [], "Notification", req);
                if (_gcResp && _gcResp.success) {
                    req.body.params.notificationTemplate = _gcResp.data
                }
            }
            if (req.body.params.locations && req.body.params.locations.length > 0) {
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "insertMany", req.body.params.locations[0], "", "", "", req.body.params.orgKey)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                else {
                    req.body.params.locations = []
                    // req.body.params.locations[0]['location'] =  _mResp.data[0]._id
                    req.body.params.locations.push(_mResp.data[0]._id)
                }
            }

            mongoMapper(`ophthamology_ecg_Organization`, req.body.query, req.body.params, req.body.params.orgKey).then(async (result) => {
                let defaultsResp = await insertDefaultData(_defaults, 0, [], req.body.params.orgKey, result.data[0], req.headers['sessionid'])
                if (!defaultsResp.success) {
                    //return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert default documents`, data: defaultsResp.data });
                }
                let _roles = _.filter(defaultsResp.data, (_o) => { return _o.type == 'ROLES' });
                let _fRole = _.filter(_roles[0].data, (_o) => { return _o.label == 'Practice Admin' });
                let userData = []
                if (_roles[0].success && _roles[0].data.length > 0) {
                    _.each(_roles[0].data, (role) => {
                        let _user = {
                            orgId: result.data[0]._id,
                            userName: role.code == "SUPER_ADMIN" ? "superadmin" : `${result.data[0].dbType.toLowerCase()}_${role.name.toLowerCase().replace(/\s+/g, "")}`,
                            password: role.code == "SUPER_ADMIN" ? "softhealth" : `${result.data[0].dbType.toLowerCase()}123`,
                            email: `${result.data[0].dbType.toLowerCase()}@gmail.com`,
                            mobile: "98374867579",
                            displayName: role.name,
                            locations: [],
                            audit: result.data[0].audit
                        };
                        for (let location of result.data[0].locations) {
                            let _loc = {
                                locId: location._id,
                                locName: location.locName,
                                roleId: role._id,
                                role: role.name
                            }
                            if (location.defLoc) {
                                _user['defaultLocId'] = _loc._id
                            }
                            _user.locations.push(_loc)
                        }

                        userData.push(_user)
                    })
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "insertMany", userData, "", "", "", req.body.params.orgKey)
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
router.post("/update-organization--old", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _output = []
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            // let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Organization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            // if (!(_mResp && _mResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            // }
            //let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Organization', _mResp.data.params, _cBody.params, req, "cm");
            if (false) {

            }
            else {
                //_cBody.params.revNo = _mResp.data.params.revNo;
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
                let _orgbase64data;
                let _favbase64data;
                let _nabhbase64data;
                if (_cBody.params.orglogo && _cBody.params.orglogo.length > 0) {
                    _cBody.params["orglogoMimeType"] = _cBody.params.orglogo.split(',')[0];
                    _orgbase64data = _cBody.params.orglogo.replace(/^data:.*,/, '');
                    _cBody.params["orglogo"] = new Buffer.from(_orgbase64data, 'base64');
                }
                if (_cBody.params.favIcon && _cBody.params.favIcon.length > 0) {
                    _cBody.params["favIconMimeType"] = _cBody.params.favIcon.split(',')[0];
                    _favbase64data = _cBody.params.favIcon.replace(/^data:.*,/, '');
                    _cBody.params["favIcon"] = new Buffer.from(_favbase64data, 'base64');
                }
                let _body = JSON.parse(JSON.stringify(req.body))
                if (_body.params.locations) {
                    delete _body.params.locations
                }
                pLoadResp = await _mUtils.preparePayload("BW", _body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }

                if (_cBody.params.locations && _cBody.params.locations.length > 0) {
                    for (let _location of _cBody.params.locations) {
                        if (!_location._id) {
                            let _lResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "insertMany", _location, "", "", "", req.tokenData.dbType)
                            if (!(_lResp && _lResp.success)) {
                                _output.push({ success: false, status: 400, desc: _oResp.desc || "", data: _oResp.data || [] });
                            }
                            else {
                                pLoadResp.payload.pData[0].updateOne.update.$push["locations"] = _lResp.data[0]._id
                                // _cBody.params.locations = []
                                // _cBody.params.locations.push(_lResp.data._id)
                            }
                        }
                        else {
                            let _lParams = {
                                params: _location
                            }
                            let _pLoadResp = await _mUtils.preparePayload("U", _lParams);
                            if (!_pLoadResp.success) {
                                _output.push({ success: false, status: 400, desc: _pLoadResp.desc || "", data: [] });
                            }
                            let _oResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "findOneAndUpdate", _pLoadResp.payload, "", _lParams, "", req.tokenData.dbType)
                            if (!(_oResp && _oResp.success)) {
                                _output.push({ success: false, status: 400, desc: _oResp.desc || "", data: _oResp.data || [] });
                            }
                        }
                    }
                }

            }
            let _final = _.filter(_output, (resp) => { return !resp.success })
            if (_final.length > 0) {
                return res.status(400).json({ success: false, status: 400, desc: 'Error While inserting/updating Location', data: [] });
            }
            mongoMapper('ophthamology_ecg_Organization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

router.post("/update-organization", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _output = []
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Organization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

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
            let _body = JSON.parse(JSON.stringify(req.body))
            if (_body.params.locations) {
                delete _body.params.locations
            }
            if ((req.body.params.orglogo && req.body.params.orglogo.length > 0) || (req.body.params.favIcon && req.body.params.favIcon.length > 0)) {

                let _media = {}
                if(req.body.params.orglogo){
                    _media['orglogo'] = req.body.params.orglogo
                }
                if(req.body.params.orglogo){
                    _media['favIcon'] = req.body.params.favIcon
                }

                let _mediaResp = await insertMedia("U","ophthamology_ecg_Organization", _media, req, _mResp.data)

                if(!_mediaResp.success){
                    return res.status(400).json({ success: false, status: 400, desc: _mediaResp.desc, data: _mediaResp.data || [] });
                }
                delete _body.params['orglogo'];
                delete _body.params['favIcon']
            }

           
            pLoadResp = await _mUtils.preparePayload("BW", _body);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            if (_cBody.params.locations && _cBody.params.locations.length > 0) {
                for (let _location of _cBody.params.locations) {
                    if (!_location._id) {
                        let _lResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "insertMany", _location, "", "", "", req.tokenData.dbType)
                        if (!(_lResp && _lResp.success)) {
                            _output.push({ success: false, status: 400, desc: _oResp.desc || "", data: _oResp.data || [] });
                        }
                        else {
                            pLoadResp.payload.pData[0].updateOne.update.$push["locations"] = _lResp.data[0]._id
                            // _cBody.params.locations = []
                            // _cBody.params.locations.push(_lResp.data._id)
                        }
                    }
                    else {
                        let _lParams = {
                            params: _location
                        }
                        let _pLoadResp = await _mUtils.preparePayload("U", _lParams);
                        if (!_pLoadResp.success) {
                            _output.push({ success: false, status: 400, desc: _pLoadResp.desc || "", data: [] });
                        }
                        let _oResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "findOneAndUpdate", _pLoadResp.payload, "", _lParams, "", req.tokenData.dbType)
                        if (!(_oResp && _oResp.success)) {
                            _output.push({ success: false, status: 400, desc: _oResp.desc || "", data: _oResp.data || [] });
                        }
                    }
                }
            }


            let _final = _.filter(_output, (resp) => { return !resp.success })
            if (_final.length > 0) {
                return res.status(400).json({ success: false, status: 400, desc: 'Error While inserting/updating Location', data: [] });
            }
            mongoMapper('ophthamology_ecg_Organization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

/**Insert Role */
router.post("/insert-role", async (req, res) => {
    try {
        // _.each(req.body.params, (_o, _k) => {
        //     _o.orgId = req.tokenData.orgId;
        //     _o.audit = req.body.params.audit;
        // });
        // delete req.body.params.audit;
        let _tabs = ["patientslist", "dashboard", "signoff"]
        if (req.body.params.defaultTabName && req.body.params.defaultTabName.length > 0 && !_tabs.includes(req.body.params.defaultTabName.toLowerCase().split(" ").join(""))) {
            _tabs.push(req.body.params.defaultTabName.toLowerCase().split(" ").join(""))
        }
        let _mappingTabs = []
        req.body.params['tabsMap'] = []
        req.body.params['orgId'] = req.tokenData.orgId;
        if (_defaults && _defaults.length > 0) {
            _.each(_defaults, (_data) => {
                if (_data.type == "ROLES" && _data.tabsMap && _data.tabsMap.length > 0) {
                    _.each(_tabs, (_defTab) => {
                        let _tab = _.filter(_data.tabsMap, (_t) => { return _t.label.toLowerCase().split(" ").join("") == _defTab })
                        req.body.params.tabsMap.push(_tab[0])
                    })

                }
            })
        }
        mongoMapper('ophthamology_ecg_Roles', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_Roles", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            // let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Roles', _mResp.data.params, _cBody.params, req);
            // let pLoadResp = { payload: {} };
            // if (!(_hResp && _hResp.success)) {

            // }
            // else {
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
            // }
            mongoMapper('ophthamology_ecg_Roles', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        if (req.body && req.body.params && req.body.params.locations && req.body.params.locations.length > 0 && !req.body.params.locations[0]._id && req.body.params.contact && req.body.params.contact.mobile && req.body.params.contact.mobile.length > 0 && req.body.params.contact.email && req.body.params.contact.email.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            //  req.body.params.locations[0]["audit"] = req.body.params.audit;
            req.body.params = await childAuditAppend(req.body.params, "locations");

            let _seqResp = await _mUtils.getSequenceNextValue({ seqName: 'Employee', orgId: req.tokenData.orgId }, "ophthamology_ecg", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["code"] = _seqResp.data;
            mongoMapper('ophthamology_ecg_Employees', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
                if (!(result && result.data && result.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
                }
                let _fLoc = _.filter(req.body.params.locations, (_l) => { return !_l._id });
                let empData = {
                    _id: result.data[0]._id,
                    loc: _fLoc
                }
                let _userRep = await insertAndUpdateUser("I", req, empData)
                let _eParams = {
                    params: {
                        "_id": result.data[0]._id,
                    }
                }
                let _finalData = JSON.parse(JSON.stringify(result.data))

                if (!(_userRep && _userRep.success)) {
                    // return res.status(400).json({ success: false, status: 400, desc: _userRep.desc || "", data: _userRep.data || [] });
                    _finalData[0]['userCreation'] = false
                    _eParams.params['userCreation'] = false
                }
                else {
                    _finalData['userCreation'] = true
                    _eParams.params['userCreation'] = true,
                        _eParams.params['userId'] = _userRep.data[0]._id
                }
                let _pLoadResp = await _mUtils.preparePayload("U", _eParams);
                if (!_pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: _pLoadResp.desc || "", data: [] });
                }
                let _oResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Employees", "findOneAndUpdate", _pLoadResp.payload, "", "", "", req.tokenData.dbType)
                if (!(_oResp && _oResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _oResp.desc || "", data: _oResp.data || [] });
                }

                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
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
//         mongoMapper("ophthamology_ecg_employee", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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


//         mongoMapper("ophthamology_ecg_employee", "aggregation", _filter, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });


router.post("/get-employee-old", async (req, res) => {
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
                    $match: {
                        recStatus: { $eq: true }
                    }
                },
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
                        empTypeCd: { $first: "$empTypeCd" },
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
        if (req.body.params._id && req.body.params._id.length > 0) {
            _filter.filter.push({
                $match: { _id: { $eq: mongoose.Types.ObjectId(req.body.params._id) } }
            })
        }

        mongoMapper("ophthamology_ecg_employee", "aggregation", _filter, req.tokenData.dbType).then((result) => {
            if (result.data && result.data.length > 0) {
                _.each(result.data, (_data) => {
                    if (_data.dispName && _data.dispName.length > 0) {
                        _data['dispName'] = convertToPascalCase(_data.dispName)
                        //console.log("_data.dispName", _data.dispName)
                    }
                })
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


router.post("/get-employee", async (req, res) => {
    try {
        let _filterObj = {
            "filter": {
                "recStatus": true
            },
            "populate": [
                { 'path': 'title', 'select': '' },
                { 'path': 'gender', 'select': '' },
                //{ 'path': 'locations.department', 'select': ''  }
            ]
        }
        let _pGData = await prepareGetPayload(_filterObj, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }

        let _filter = {
            filter: [
                {
                    $match: {
                        recStatus: { $eq: true }
                    }
                },
                {
                    $lookup: {
                        from: 'Gender',
                        localField: 'gender',
                        foreignField: 'name',
                        as: 'name'
                    }
                },
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
                    $lookup: {
                        from: 'Gender',
                        localField: 'gender',
                        foreignField: 'name',
                        as: 'name'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        empTypeCode: { $first: "$empTypeCode" },
                        empTypeName: { $first: "$empTypeName" },
                        "orgId": { $first: "$orgId" },
                        // "code": { $first: "$code" },
                        "recStatus": { $first: "$recStatus" },
                        // "titleCd": { $first: "$titleCd" },
                        // "titleName": { $first: "$titleName" },
                        "title": { $first: "$title" },
                        "firstName": { $first: "$firstName" },
                        "middleName": { $first: "$middleName" },
                        "lastName": { $first: "$lastName" },
                        "dispName": { $first: "$dispName" },
                        "gender": { $first: "$gender" },
                        // "genderCd": { $first: "$genderCd" },
                        "dateOfBirth": { $first: "$dateOfBirth" },
                        // "emailID": { $first: "$contact.email" },
                        "photo": { $first: "$photo" },
                        "joiningDate": { $first: "$joiningDate" },
                        // "adharNo": { $first: "$adharNo" },
                        // "passport": { $first: "$passport" },
                        "userName": { $first: "$userName" },
                        // "userCd": { $first: "$userCd" },
                        // "password": { $first: "$password" },
                        // "phone":  { $first: "$phone" },
                        // "mobile":  { $first: "$mobile" },
                        // "address1": { $first: "$address.address1" },
                        // "address2": { $first: "$address.address2" },
                        // "areaCd": { $first: "$address.areaCode" },
                        // "area": { $first: "$address.areaName" },
                        // "cityCd": { $first: "$address.cityCode" },
                        // "city": { $first: "$address.cityName" },
                        // "stateCd": { $first: "$address.stateCode" },
                        // "state": { $first: "$address.stateName" },
                        // "countryCd": { $first: "$address.countryCode" },
                        // "country": { $first: "$address.countryName" },
                        // "zipCd": { $first: "$address.zipCd" },
                        "contact": { $first: "$contact" },
                        "address": { $first: "$address" },
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
        if (req.body.params._id && req.body.params._id.length > 0) {
            _filter.filter.push({
                $match: { _id: { $eq: mongoose.Types.ObjectId(req.body.params._id) } }
            })
        }

        mongoMapper("ophthamology_ecg_Employees", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            if (result.data && result.data.length > 0) {
                _.each(result.data, (_data) => {
                    if (_data.dispName && _data.dispName.length > 0) {
                        _data['dispName'] = convertToPascalCase(_data.dispName)
                        //console.log("_data.dispName", _data.dispName)
                    }
                })
            }
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Employees", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Employees', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('ophthamology_ecg_Employees', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        if (req.body && req.body.params && req.body.params.locations && req.body.params.locations.length > 0 && !req.body.params.locations[0]._id && req.body.params.contact && req.body.params.contact.mobile && req.body.params.contact.mobile.length > 0 && req.body.params.contact.email && req.body.params.contact.email.length > 0) {
            req.body.params.orgId = req.tokenData.orgId;
            req.body.params = await childAuditAppend(req.body.params, "locations");
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Doctor' }, "ophthamology_ecg", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["docCode"] = _seqResp.data;
            let _cBody = JSON.parse(JSON.stringify(req.body.params))
            if (req.body.params.photo && req.body.params.photo.length > 0) {
                let _resp = await insertBase64Data(req.body.params.photo)
                if (_resp.success !== true) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc, data: [] });
                }
                else {
                    req.body.params["photoMimeType"] = _resp._mimeType
                    req.body.params["photo"] = _resp._bufferData
                }
            }

            if (req.body.params.signature && req.body.params.signature.length > 0) {
                let _resp = await insertBase64Data(req.body.params.signature)
                if (_resp.success !== true) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc, data: [] });
                }
                else {
                    req.body.params["signatureMimeType"] = _resp._mimeType
                    req.body.params["signature"] = _resp._bufferData
                }
            }
            let _cUserName = {
                "filter": { "userName": req.body.params.userName },
                "selectors": "-audit -history"
            }
            let _mCheckResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "find", _cUserName, "", "", "", req.tokenData.dbType);
            if (_mCheckResp && _mCheckResp.success && _mCheckResp.data && _mCheckResp.data.length > 0) {
                return res.status(400).json({ success: false, status: 400, desc: `Username already exists`, data: [] });
            }
            let _cParams = {
                "filter": { "mobile": req.body.params.mobile },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "find", _cParams, "", "", "", req.tokenData.dbType);
            if (_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0) {
                for (let doctor of _mResp.data) {
                    if (doctor.dob === req.body.params.dob && doctor.gender === req.body.params.gender) {
                        return res.status(400).json({ success: false, status: 400, desc: `MobileNo with same DOB and gender already exists`, data: [] });
                    }
                }
            }
            mongoMapper('ophthamology_ecg_Doctors', "insertMany", req.body.params, req.tokenData.dbType).then(async (result) => {
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
                    await mongoMapper('ophthamology_ecg_Doctors', "findOneAndUpdate", pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            await mongoMapper("ophthamology_ecg_Doctors", "find", _filter, _dbType).then(async (result) => {
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
                    await mongoMapper('ophthamology_ecg_Doctors', "findOneAndUpdate", pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
                "docCode": "$docCode",
                "i_docCd": "$i_docCd",
                "docTypeCode": "$docTypeCode",
                "docTypeName": "$docTypeName",
                "title": "$title",
                "firstName": "$firstName",
                "middleName": "$middleName",
                "lastName": "$lastName",
                "dispName": "$dispName",
                "gender": "$gender",
                "dob": "$dob",
                "contact": "$contact",
                "userName": "$userName",
                "password": "$password",
                "bloodGroup": "$bloodGroup",
                // "signature": "$signature",
                // "photoMimeType": "$photoMimeType",
                // "signatureMimeType": "$signatureMimeType",
                "apmntReq": "$apmntReq",
                "speciality": "$speciality",
                "specializations": "$specializations",
                "qualification": "$qualification",
                "experienceYears": "$experienceYears",
                "designation": "$designation",
                "registrationNo": "$registrationNo",
                "locations": {
                    $filter: {
                        input: "$locations",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit"
            },
            "populate": [
                { 'path': 'gender', 'select': '_id code name' },
                { 'path': 'title', 'select': '_id code name' },
                { 'path': 'bloodGroup', 'select': '_id code name' },
                { 'path': 'speciality', 'select': '_id code name' },
                { 'path': 'specializations', 'select': '' },
            ]
        }
        if(req.body.params.locId && req.body.params.locId.length > 0){
            _filter.filter['locations.locId'] = req.body.params.locId
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("ophthamology_ecg_Doctors", "find", _pGData.data, req.tokenData.dbType).then(async (result) => {
            if (result.data && result.data.length > 0) {
                let _resp = JSON.parse(JSON.stringify(result.data))
                let _finalResp = _.each(_resp, (doc) => {
                    if (doc.locations && doc.locations.length > 0) {
                        doc.locations = _.map(doc.locations, (loc) => {
                            if (loc.shifts && loc.shifts.length > 0) {
                                loc.shifts = _.filter(loc.shifts, (shift) => shift.recStatus !== false);
                            }
                            return loc;
                        })
                    }
                    return doc;
                })
                let _base64Photo;
                let _base64Signature;
                for (let resp of _finalResp) {
                    if (resp.dispName && resp.dispName.length > 0) {
                        resp['dispName'] = convertToPascalCase(resp.dispName)
                        resp['formatName'] = resp.dispName && resp.titleName && resp.titleName.length > 0 ? `${resp.titleName} ${resp.dispName}` : ""
                    }
                    if (resp.photo && resp.photo !== "" && resp.photoMimeType && resp.photoMimeType.length > 0) {
                        // var photobufferData = Buffer.from(resp.photo.data)
                        // _base64Photo = await photobufferData.toString('base64');
                        // resp['photo'] = `${resp.photoMimeType},${_base64Photo}`
                        let data = await getBase64Data(resp.photoMimeType, resp.photo)
                        resp['photo'] = data
                    }
                    else {
                        resp['photo'] = ""
                    }
                    if (resp.signature && resp.signature !== "" && resp.signatureMimeType && resp.signatureMimeType.length > 0) {
                        // var signaturebufferData = Buffer.from(resp.signature.data)
                        // _base64Signature = await signaturebufferData.toString('base64');
                        // resp['signature'] = `${resp.signatureMimeType},${_base64Signature}`
                        let data = await getBase64Data(resp.signatureMimeType, resp.signature)
                        resp['signature'] = data
                    }
                    else {
                        resp['signature'] = ""
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp });
            } else {
                return res.status(200).json({ success: true, status: 200, desc: 'No data found', data: [] });
            }
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
        mongoMapper("ophthamology_ecg_doctors", "aggregation", _filter, req.tokenData.dbType).then((result) => {
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
                    $project: { _id: 1, docCd: 1, docTypeCd: 1, revNo: 1, docTypeName: 1, titleCd: 1, titleName: 1, fName: 1, mName: 1, lName: 1, dispName: 1, genderCd: 1, gender: 1, dob: 1, emailID: 1, userName: 1, password: 1, phone: 1, mobile: 1, apmntReq: 1, speclityCd: 1, speclityName: 1, specializations: 1, qualfCd: 1, qualf: 1, designationCd: 1, designation: 1, regNo: 1, locations: { $filter: { input: "$locations", cond: { $eq: ["$$this.locId", req.body.params.locId] } } } } //photo: 1, signature: 1,
                }
            ]
        }
        let _dResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
        let _finaldata = _.filter(_dResp.data, (_do, _di) => { return _do.locations.length > 0 })
        _.each(_finaldata, (_doc) => {
            if (_doc.dispName && _doc.dispName.length > 0) {
                _doc['dispName'] = convertToPascalCase(_doc.dispName)
                //console.log("_doc.dispName", _doc.dispName)
            }
        })
        return res.status(200).json({ success: true, status: 200, desc: '', data: _finaldata });
    } catch (error) {

    }
})

router.post("/get-doctor-by-id", async (req, res) => {
    try {
        if (req.body.params && req.body.params._id && req.body.params._id.length > 0) {
            let _filter = {
                "filter": { "recStatus": { $eq: true }, "_id": req.body.params._id },
                "selectors": {
                    "_id": "$_id",
                    "revNo": "$revNo",
                    "recStatus": "$recStatus",
                    "docCode": "$docCode",
                    "i_docCd": "$i_docCd",
                    "docTypeCode": "$docTypeCode",
                    "docTypeName": "$docTypeName",
                    "title": "$title",
                    "firstName": "$firstName",
                    "middleName": "$middleName",
                    "lastName": "$lastName",
                    "dispName": "$dispName",
                    "gender": "$gender",
                    "dob": "$dob",
                    "contact": "$contact",
                    "userName": "$userName",
                    "password": "$password",
                    "bloodGroup": "$bloodGroup",
                    // "signature": "$signature",
                    // "photoMimeType": "$photoMimeType",
                    // "signatureMimeType": "$signatureMimeType",
                    "apmntReq": "$apmntReq",
                    "speciality": "$speciality",
                    "specializations": "$specializations",
                    "qualification": "$qualification",
                    "experienceYears": "$experienceYears",
                    "designation": "$designation",
                    "registrationNo": "$registrationNo",
                    "locations": {
                        $filter: {
                            input: "$locations",
                            cond: {
                                $eq: ["$$this.recStatus", true]
                            }
                        }
                    },
                    "audit": "$audit"
                },
                "populate": [
                    { 'path': 'gender', 'select': '_id code name' },
                    { 'path': 'title', 'select': '_id code name' },
                    { 'path': 'bloodGroup', 'select': '_id code name' },
                    { 'path': 'speciality', 'select': '_id code name' },
                    { 'path': 'specializations', 'select': '' },
                ]
            }
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("ophthamology_ecg_doctors", "find", _pGData.data, req.tokenData.dbType).then(async (result) => {
                if (result.data && result.data.length > 0) {
                    let _resp = JSON.parse(JSON.stringify(result.data))

                    let _finalResp = _.each(_resp, async (doc) => {
                        if (doc.locations && doc.locations.length > 0) {
                            doc.locations = _.map(doc.locations, (loc) => {
                                if (loc.shifts && loc.shifts.length > 0) {
                                    loc.shifts = _.filter(loc.shifts, (shift) => shift.recStatus !== false);
                                }
                                return loc;
                            })
                        }
                        return doc;
                    })
                    let _base64Photo;
                    let _base64Signature;
                    for (let resp of _finalResp) {
                        if (resp.dispName && resp.dispName.length > 0) {
                            resp['dispName'] = convertToPascalCase(resp.dispName)
                        }
                        if (resp.photo && resp.photo !== "" && resp.photoMimeType && resp.photoMimeType.length > 0) {
                            // var photobufferData = Buffer.from(resp.photo.data)
                            // _base64Photo = await photobufferData.toString('base64');
                            // resp['photo'] = `${resp.photoMimeType},${_base64Photo}`
                            let data = await getBase64Data(resp.photoMimeType, resp.photo)
                            resp['photo'] = data
                        }
                        else {
                            resp['photo'] = ""
                        }
                        if (resp.signature && resp.signature !== "" && resp.signatureMimeType && resp.signatureMimeType.length > 0) {
                            // var signaturebufferData = Buffer.from(resp.signature.data)
                            // _base64Signature = await signaturebufferData.toString('base64');
                            // resp['signature'] = `${resp.signatureMimeType},${_base64Signature}`
                            let data = await getBase64Data(resp.signatureMimeType, resp.signature)
                            resp['signature'] = data
                        }
                        else {
                            resp['signature'] = ""
                        }
                    }

                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp });
                } else {
                    return res.status(200).json({ success: true, status: 200, desc: 'No data found', data: [] });
                }
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Missing Required Parameters", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Docter */
router.post("/update-doctor", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Doctors", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Doctors', _mResp.data.params, _cBody.params, req);
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
            //else {
            _cBody.params.revNo = _mResp.data.params.revNo;
            if (_cBody.params.locations) {
                _.each(_cBody.params.locations, (_l, _i) => {
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
                        _cBody.params.locations[_i] = JSON.parse(JSON.stringify(newObj))
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
            let _photobase64data;
            let _signaturebase64data;
            if (_cBody.params.photo && _cBody.params.photo.length > 0) {
                // _cBody.params["photoMimeType"] = _cBody.params.photo.split(',')[0];
                // _photobase64data = _cBody.params.photo.replace(/^data:.*,/, '');
                // _cBody.params["photo"] = new Buffer.from(_photobase64data, 'base64');
                let _resp = await insertBase64Data(_cBody.params.photo)
                if (_resp.success !== true) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc, data: [] });
                }
                else {
                    _cBody.params["photoMimeType"] = _resp._mimeType
                    _cBody.params["photo"] = _resp._bufferData
                }
            }

            if (_cBody.params.signature && _cBody.params.signature.length > 0) {
                // _cBody.params["signatureMimeType"] = _cBody.params.signature.split(',')[0];
                // _signaturebase64data = _cBody.params.signature.replace(/^data:.*,/, '');
                // _cBody.params["signature"] = new Buffer.from(_signaturebase64data, 'base64');
                let _resp = await insertBase64Data(_cBody.params.signature)
                if (_resp.success !== true) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc, data: [] });
                }
                else {
                    _cBody.params["signatureMimeType"] = _resp._mimeType
                    _cBody.params["signature"] = _resp._bufferData
                }
            }

            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            //}
            let empData;
            let shouldCallInsertUpdateUser = false;
            mongoMapper('ophthamology_ecg_Doctors', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Document' }, "ophthamology_ecg", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["cd"] = _seqResp.data;
        mongoMapper('ophthamology_ecg_Documents', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            console.log("insert", error)
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
        mongoMapper("ophthamology_ecg_Documents", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Documents", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Documents', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('ophthamology_ecg_Documents', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                if (Object.keys(JSON.parse(JSON.stringify(result.data))).length > 0) {
                    _filter.filter = [
                        {
                            $project: { _id: 1, orgId: 1, label: 1, revNo: 1, docmntMap: { $filter: { input: "$docmntMap", cond: { $eq: ["$$this.documentId", JSON.parse(JSON.stringify(result.data))._id] } } } }
                        }
                    ]
                    let _rResp = await _mUtils.commonMonogoCall("ophthamology_ecg_roles", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
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
                        let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_roles", "bulkWrite", pLoadResp.payload, "", req.body, "", req.tokenData.dbType)
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_speciality", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_speciality', _query, _params, req.tokenData.dbType).then((result) => {
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
//             let _patient = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
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

//             mongoMapper("ophthamology_ecg_uploadDocuments", "insertMany", req.body.params.docs,req.tokenData.dbType).then(async (result) => {
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

//                                     let _patUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "updateOne", pLoadResp.payload, "", "","",req.tokenData.dbType)
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

router.post("/upload-document-old", async (req, res) => {
    try {
        if (req.body.params._id && req.body.params.UMR && req.body.params.docs) {
            let _patient = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
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

            mongoMapper("ophthamology_ecg_uploadDocuments", "insertMany", req.body.params.docs, req.tokenData.dbType).then(async (result) => {
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
                    let _patUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "updateOne", pLoadResp.payload, "", "", "", req.tokenData.dbType)
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

                //                             // let _patUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "updateOne", pLoadResp.payload, "", "","",req.tokenData.dbType)
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


router.post("/upload-document", async (req, res) => {
    try {
        if (req.body.params._id && req.body.params.UMR && req.body.params.docs) {
            let _patient = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
            if (!(_patient && _patient.success)) {
                return res.status(400).json({ status: 'FAIL', desc: _patient.desc || "", data: _patient.data || [] });
            }
            if (_patient.success && _patient.data && _patient.data.length == 0) {
                return res.status(400).json({ status: 'FAIL', desc: "No Patient Found", data: [] });
            }
            let _clnDocs = JSON.parse(JSON.stringify(req.body.params));
            //console.log("_clnDocs", _clnDocs)
            delete req.body.params.supporttedObj;
            let _prms = []
            _.each(req.body.params.docs, (_doc) => {
                let _base64data = _doc.docData.replace(/^data:.*,/, '');
                _doc["orgId"] = req.tokenData.orgId;
                _doc["locId"] = req.tokenData.locId;
                _doc["remarks"] = _doc.remarks;
                _doc["type"] = req.body.params.type || "";
                _doc["UMR"] = req.body.params.UMR;
                _doc["docData"] = [
                    {
                        admnNo: req.body.params.admnNo || "",
                        admnDt: req.body.params.admnDt || "",
                        docName: _doc.docName || "",
                        docType: _doc.docType || "",
                        format: _doc.format,
                        docInfo: "",
                        isImage: _doc.isImage,
                        size: _doc.docSize,
                        path: "",
                        docMimeType: _doc.docData.split(',')[0]
                    }
                ];
                _doc['audit'] = req.body.params.audit
                if (_doc.format == 'png' || _doc.format == 'jpg' || _doc.format == 'jpeg') {
                    _doc["docData"][0]["docInfo"] = new Buffer.from(_base64data, 'base64');
                }
                else {
                    let _binaryData = Buffer.from(_base64data, 'base64');
                    let _filePath = `${req.clientUrls.orgName.replace(/\s/g, '_')}/${req.body.params.UMR}`;
                    if (req.body.params.admnNo && req.body.params.admnNo.length > 0) {
                        _filePath += `/${req.body.params.admnNo}`;
                    }
                    if (_doc.surgName && _doc.surgName.length > 0) {
                        _filePath += `/${_doc.surgName.replace(/\s/g, '_')}_${moment(new Date(_doc.surgDt)).format('DD-MMM-YYYY')}`;
                    }
                    _filePath += `/${_doc.docName.replace(/\.[^/.]+$/, "").replace(/\s/g, '_')}_${Date.now()}.${_doc.format}`;
                    let _physicalPath = `${req.clientUrls.documentPhysicalPath}/${_filePath}`;
                    console.log("_physicalPath", _physicalPath);
                    fse.outputFile(_physicalPath, _binaryData, 'binary')
                        .then(() => {
                            console.log('The file has been saved!');
                        })
                        .catch(err => {
                            console.error("error save", err)
                        });
                    _doc["docData"][0]["path"] = `${req.clientUrls.documentPathUrl}/${_filePath}`;
                }
                _prms.push(_doc)
            });
            mongoMapper("ophthamology_ecg_uploadDocuments", "insertMany", _prms, req.tokenData.dbType).then(async (result) => {
                if (!(result.data && result.data.length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }

                let _documentsData = []
                let _resultdocEqualData;
                let _patOutput = []

                if (_clnDocs.docs.length > 0) {
                    for (let _doc of req.body.params.docs) {
                        let _resultInfo = _.filter(result.data, (_rObj) => {
                            _.filter(_rObj.docData, (_rObjDocO) => {
                                if (_doc.docName == _rObjDocO.docName) {
                                    _resultdocEqualData = _rObj
                                }
                            })
                        })
                        let _patObj = {
                            params: {
                                _id: _clnDocs._id,
                                document: [
                                    {
                                        docId: _resultdocEqualData._id || "",
                                        admNo: req.body.params.admnNo || "",
                                        admnDt: req.body.params.admnDt || "",
                                        docName: _doc.docName,
                                        docType: _doc.docType,
                                        format: _doc.format,
                                        remarks: _doc.remarks,
                                        size: _doc.docSize,
                                        isImage: _doc.isImage,
                                        path: _resultdocEqualData.docData[0].path || ""
                                    }
                                ]
                            }
                        }
                        let pLoadResp = { payload: {} };
                        pLoadResp = await _mUtils.preparePayload('U', _patObj);
                        if (!pLoadResp.success) {
                            // return res.status(400).json({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                            _patOutput.push({ status: 'FAIL', desc: pLoadResp.desc || "", data: [] });
                        }
                        let _patUpdate = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "findOneAndUpdate", pLoadResp.payload, "", "", "", req.tokenData.dbType)
                        if (!(_patUpdate && _patUpdate.success)) {
                            _patOutput.push({ status: 'FAIL', desc: _patUpdate.desc || "", data: _patUpdate.data || [] });
                        }
                    }
                }
                if (_patOutput.length > 0) {
                    return res.status(400).json({ status: 'FAIL', desc: _patOutput || "", data: [] });
                }
                else {
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data || [] });
                }
            }).catch((error) => {
                console.log("error", error)
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
        if (req.body.params.UMR) {
            req.body.params["orgId"] = req.tokenData.orgId;
            req.body.params["locId"] = req.tokenData.locId;
            let _params = {
                filter: req.body.params,
                selectors: ""
            }
            mongoMapper("ophthamology_ecg_uploadDocuments", "find", _params, req.tokenData.dbType).then(async (result) => {
                if (!(result.data && Object.keys(result.data).length > 0)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _docs = await convertBase64ToBuffer(result.data);
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
            mongoMapper("ophthamology_ecg_uploadDocuments", "findById", req.body.params._id, req.tokenData.dbType).then(async (result) => {
                if (!(result.data)) {
                    return res.status(400).json({ status: 'FAIL', desc: "No Records are available.." || error, data: [] });
                }
                let _base64 = "";
                if (result.data.docData && result.data.docData.length > 0) {
                    if (result.data.docData[0].docInfo && result.data.docData[0].docMimeType && result.data.docData[0].docMimeType.length > 0) {
                        _base64 = `${result.data.docData[0].docMimeType},${await result.data.docData[0].docInfo.toString("base64")}`;
                    }
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
        mongoMapper("ophthamology_ecg_speciality", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_speciality", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_speciality', _mResp.data.params, _cBody.params, req, "cm");
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
            mongoMapper('ophthamology_ecg_speciality', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        mongoMapper('ophthamology_ecg_medications', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Medication */
router.post("/get-medication-old", async (req, res) => {
    try {
        if (req.body && req.body.flag && !(req.body.flag == "")) {
            let _filter = { "filter": {} };
            if (req.body.flag === "G" || req.body.flag === "M") {
                if (req.body.flag === "G") {
                    let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                    _filter.filter["genericName"] = nameExp
                    mongoMapper("ophthamology_ecg_medications", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
                if (req.body.flag === "M") {
                    let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                    _filter.filter["medName"] = nameExp
                    _filter.filter['recStatus'] = { $eq: true }
                    mongoMapper("ophthamology_ecg_medications", req.body.query, _filter, req.tokenData.dbType).then((result) => {
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
            mongoMapper("ophthamology_ecg_medications", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/get-medication", async (req, res) => {
    try {
        let _filter = { "filter": [] };
        if (req.body && req.body.flag && !(req.body.flag == "")) {
            if ((!req.body.params.source || req.body.params.source == "") && (req.body.flag === "G" || req.body.flag === "M")) {
                if (req.body.flag === "G") {
                    _filter.filter.push(
                        {
                            $match: { genericName: { $regex: req.body.params.searchValue, $options: 'i' } }
                        }
                    )
                    mongoMapper("ophthamology_ecg_medications", "aggregation", _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
                if (req.body.flag === "M") {
                    _filter.filter.push(
                        {
                            $match: { medName: { $regex: req.body.params.searchValue, $options: 'i' }, recStatus: { $eq: true } }
                        }
                    )
                    mongoMapper("ophthamology_ecg_medications", "aggregation", _filter, req.tokenData.dbType).then((result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
            }
            else {
                return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
            }
        } else {
            _filter.filter.push(
                {
                    $match: { recStatus: { $eq: true } }
                }
            )
            mongoMapper("ophthamology_ecg_medications", "aggregation", _filter, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_medications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_medications', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('ophthamology_ecg_medications', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        mongoMapper('ophthamology_ecg_investigations', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Investigations */
router.post("/get-investigation/old", async (req, res) => {
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
            "i_groupcd": "$i_groupcd",
            "serviceTypeCd": "$serviceTypeCd",
            "serviceTypeName": "$serviceTypeName",
            "i_typecd": "$i_typecd",
            "name": "$name",
            "i_cd": "$i_cd",
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
                mongoMapper("ophthamology_ecg_investigations", req.body.query, _filter, req.tokenData.dbType).then((result) => {
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
            mongoMapper("ophthamology_ecg_investigations", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

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
            "i_groupcd": "$i_groupcd",
            "serviceTypeCd": "$serviceTypeCd",
            "serviceTypeName": "$serviceTypeName",
            "i_typecd": "$i_typecd",
            "name": "$name",
            "i_cd": "$i_cd",
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
                        //"childAvailable": true,
                        "name": searchData
                    },
                    "selectors": selector
                }
                mongoMapper("ophthamology_ecg_investigations", req.body.query, _filter, req.tokenData.dbType).then(async (result) => {
                    let uniqueData = await findDuplicatesAndCombinedData(result.data, 'i_cd');
                    return res.status(200).json({ success: true, status: 200, desc: '', data: uniqueData });
                    // return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
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
            mongoMapper("ophthamology_ecg_investigations", req.body.query, _pGData.data, req.tokenData.dbType).then(async (result) => {
                let uniqueData = await findDuplicatesAndCombinedData(result.data, 'i_cd');
                return res.status(200).json({ success: true, status: 200, desc: '', data: uniqueData });
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_investigations", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_investigations', _mResp.data.params, _cBody.params, req);

            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
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
            mongoMapper('ophthamology_ecg_investigations', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_specialization", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_specialization', _query, _params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_specialization", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_specialization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_specialization', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_specialization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_complaints", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_complaints', _query, _params, req.tokenData.dbType).then((result) => {
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
                mongoMapper("ophthamology_ecg_complaints", req.body.query, _filter, req.tokenData.dbType).then((result) => {
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
            mongoMapper("ophthamology_ecg_complaints", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_complaints", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_complaints', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_complaints', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_notifications", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_notifications', _query, _params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_notifications", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_notifications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_notifications', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_notifications', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labels", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_labels', _query, _params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_labels", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_labels', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_labels', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Entities", "find", _filter, "", "", "", req.tokenData.dbType);
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
            mongoMapper('ophthamology_ecg_Entities', _query, _params, req.tokenData.dbType).then((result) => {
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
        mongoMapper('ophthamology_ecg_Entities', _query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_Entities", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Entities", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

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
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            // pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
            //     "revNo": _hResp.data[0].revNo,
            //     "revTranId": _hResp.data[0]._id
            // }

            mongoMapper('ophthamology_ecg_Entities', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        mongoMapper('ophthamology_ecg_Counters', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        req.body.params['registeredLocId'] = req.tokenData.locId
        let _filter = {
            "filter": {
                "abhaNo": req.body.params.abhaNo
            }
        }
        let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Patients", "find", _filter, "", req.body, "", req.tokenData.dbType);
        if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
            return res.status(400).json({ success: false, status: 400, desc: "This Patient already exists.", data: _mResp.data || [] });
        }
        let _seqResp = await _mUtils.getSequenceNextValue({ orgId: req.tokenData.orgId, seqName: 'UMR' }, "ophthamology_ecg", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["UMR"] = _seqResp.data;
        mongoMapper('ophthamology_ecg_Patients', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
            req.body.params["patId"] = result.data[0]._id;
            let _bookingResp = await bookAppointment("I", req, "NORMAL");
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });

        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    }
    catch (error) {
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
            mongoMapper("ophthamology_ecg_patients", req.body.query, _filter, req.tokenData.dbType).then(async (result) => {
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
                let _finalResp = JSON.parse(JSON.stringify(result.data))
                _.each(_finalResp, (_resp) => {
                    if (_resp.dispName && _resp.dispName.length > 0) {
                        _resp['dispName'] = convertToPascalCase(_resp.dispName)
                    }
                })
                _finalResp = await findDuplicatesAndCombinedData(_finalResp, 'UMR');
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp });
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
        if (req.body.params.locId) {
            req.body.params['registeredLocId'] = req.body.params.locId
        }
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            limit: 500,
            "selectors": "-history",
            "populate": [
                { 'path': 'gender', 'select': '_id code name' },
                { 'path': 'title', 'select': '_id code name' },
                { 'path': 'bloodGroup', 'select': '_id code name' },
                { 'path': 'abhaCard', 'select': '' },
                { 'path': 'emergencyContact.relationship', 'select': '_id code name' },
                { 'path': 'chiefComplaint', 'select': '_id code name' },
                { 'path': 'languages', 'select': '_id code name' },
                { 'path': 'prefferedLanquage', 'select': '_id code name' },
                { 'path': 'nationality', 'select': '_id code name' },
                { 'path': 'religion', 'select': '_id code name' },
                { 'path': 'photo', 'select': '' },
                { 'path': 'signature', 'select': '' },
                { 'path': 'visits', 'select': '' },
                { 'path': 'registeredLocId', 'select': '_id locName' },
            ]
        }
        if (req.body.params.dispName) {
            req.body.params.dispName = { $regex: new RegExp(req.body.params.dispName, "i") };
        }
        if (req.body.params.mobile) {
            req.body.params["contact.mobile"] = { $regex: new RegExp(req.body.params.mobile, "i") };
            delete req.body.params.mobile;
        }
        if (req.body.params.UMR) {
            req.body.params.UMR = new RegExp('.*' + req.body.params.UMR.toUpperCase() + '.*');
        }
        if (req.body.params.abhaNo) {
            req.body.params.abhaNo = { $regex: new RegExp(req.body.params.abhaNo, "i") };
        }
        if (req.body.params.abhaAddress) {
            req.body.params.abhaAddress = { $regex: new RegExp(req.body.params.abhaAddress, "i") };
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("ophthamology_ecg_Patients", req.body.query, _pGData.data, req.tokenData.dbType).then(async (result) => {
            _.each(result.data, (obj, ind) => {
                if (obj.dispName && obj.dispName.length > 0) {
                    obj['dispName'] = convertToPascalCase(obj.dispName)
                }
                obj.visits = _.sortBy(obj.visits, function (o) { return o.dateTime }).reverse()
            })
            result.data = await findDuplicatesAndCombinedData(result.data, 'UMR');
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
                        let _imResp = await _mUtils.commonMonogoCall(`ophthamology_ecg_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
                        if (_imResp && _imResp.data.length > 0) {
                            _data[_indx][`${_filterData[_indx1]._collName}`] = _imResp.data
                            break;
                        }
                        _imIndx++
                    }
                } else if (_filterData[_indx1]._collName == "transactions") {
                    let _tranResp = await _mUtils.commonMonogoCall(`ophthamology_ecg_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
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
                    let _eResp = await _mUtils.commonMonogoCall(`ophthamology_ecg_${_filterData[_indx1]._collName}`, "aggregation", _filter, "", "", "", req.tokenData.dbType);
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
        let _eResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "aggregation", _filter, "", "", "", req.tokenData.dbType);
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
        if (_patientDashBoardGetData.data && _patientDashBoardGetData.data.length > 0) {
            _.each(_patientDashBoardGetData.data, (_data) => {
                if (_data.dispName && _data.dispName.length > 0) {
                    _data['dispName'] = convertToPascalCase(_data.dispName)
                }
            })
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Patients", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Patients', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('ophthamology_ecg_Patients', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            req.body.params.locId = req.tokenData.locId;
            req.body.params = await childAuditAppend(req.body.params, "labels");
            mongoMapper('ophthamology_ecg_labelsmaps', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
                "roleId": "$roleId",
                "empId": "$empId",
                "userId": "$userId",
                "settingType": "$settingType",
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
        let _pGetData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGetData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGetData.desc, data: [] });
        }
        delete req.body.params.userId
        let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labelsmaps", "find", _pGetData.data, "", "", "", req.tokenData.dbType)
        if (_mResp && _mResp.success && _mResp.data.length > 0) {
            return res.status(200).json({ success: true, status: 200, desc: "", data: _mResp.data || [] });
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        if (_pGData.data.filter.userId && _pGData.data.filter.userId.length > 0) {
            delete _pGData.data.filter['userId']
        }
        if (_pGData.data.filter.settingType && _pGData.data.filter.settingType.length > 0) {
            delete _pGData.data.filter['settingType']
        }
        mongoMapper("ophthamology_ecg_labelsmaps", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            if (!(result && result.data)) {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            }
            let _resp = JSON.parse(JSON.stringify(result))
            _resp.data = _.filter(_resp.data, (_data) => { return !_data.userId })
            const matchedOrg = _orgDetails.find(org => org.orgKey === req.tokenData.dbType);
            if (matchedOrg && matchedOrg.fieldsSettings) {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labelsmaps", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_labelsmaps', _mResp.data.params, _cBody.params, req, "cm");
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
                pLoadResp = await _mUtils.preparePayload("BW", _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
            }
            mongoMapper('ophthamology_ecg_labelsmaps', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            let _rResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
            req.body.params['status'] = "PAID"
            let _updatePatVisitDetails = await updatePatVisitDetails(_rResp.data, 0, [], req, "VISITS")
            if (!(_updatePatVisitDetails && _updatePatVisitDetails.success)) {
                return res.status(400).json({ success: false, status: 400, desc: "", data: _updatePatVisitDetails.data || [] });
            }
            if (req.body.params.visitId && req.body.params.visitId.length > 0) {
                let _aResp = await updateVisitsOrBillData(req.body.params.UMR, "UPDATE_APPOINTMENT_WITH_BILL", "", req);
                if (!(_aResp && _aResp.success)) {
                    console.log("Error Occured while updating Bills details to Appointment");
                }
            }
            // let _aResp = await updateVisitsOrBillData(req.body.params.UMR, "UPDATE_APPOINTMENT_WITH_BILL", "", req);
            // if (!(_aResp && _aResp.success)) {
            //     console.log("Error Occured while updating Bills details to Appointment");
            // }
        }
        _.each(req.body.params.transactions, objects => {
            objects['audit'] = req.body.params.audit
            objects.refNumber = _seqResp.data
        })
        mongoMapper('ophthamology_ecg_bills', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
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

        mongoMapper("ophthamology_ecg_bills", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_bills", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_bills", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_bills', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_bills', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                if (_cBody.params.outStandingDue >= 0) {
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

/**Appointment Booking */
router.post("/book-appointment-old", async (req, res) => {
    try {
        if (req.body.params && (req.body.params.apmntId || (req.body.params.locId && req.body.params.docId && req.body.params.shiftId)) && req.body.params.patName && req.body.params.apmntType) {
            let _finalResp = [];
            let scheduleTime = {};
            let duration;
            let _query = "insertMany";
            if (!req.body.params.apmntId) {
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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
                duration = _docShift[0].duration
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
                    let _mApmntResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", "", "", req.tokenData.dbType)
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
                        //syncChanges
                        "i_docCd": _mResp.data.i_docCd || "",
                        //syncChanges
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
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "findById", req.body.params.apmntId, "REVNO", req.body, "", req.tokenData.dbType);
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Consultations', _mResp.data.params, _cBody.params, req);
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
            let _visitNoSeqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'AppointmentId' }, "cm", req);
            if (!(_visitNoSeqResp && _visitNoSeqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            _finalResp[0]["appointmentId"] = _visitNoSeqResp.data
            mongoMapper('ophthamology_ecg_Consultations', _query, _finalResp, req.tokenData.dbType).then(async (result) => {
                if (result.data[0].amount == 0.00) {
                    let getQueData = await updateQueNoData(req, res, result.data[0]._id)
                    if (!(getQueData && getQueData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: getQueData.data || [] });
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
                //syncChanges
                // let _tranformedData = await _emrToHis.emr2HisEvent111Trnsfrm(result.data, req, duration, scheduleTime);
                // if (!(_tranformedData && _tranformedData.success)) {
                //     console.log("Error Occured while inserting appointment booked data in emr2his syncing");
                // }
                //return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                //syncChanges
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


router.post("/book-appointment", async (req, res) => {
    try {
        if (req.body.params && req.body.params.UMR && req.body.params.locId && req.body.params.patId) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "patient": { $eq: req.body.params.patId },
                    "dateTime": { $regex: `${new Date().toISOString().split("T")[0]}` }
                },
                "selectors": "-history"
            }
            let resp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", "", "", req.tokenData.dbType)
            if (resp.data && resp.data.length > 0 && !req.body.params.isForceBook) {
                resp.data = JSON.parse(JSON.stringify(resp.data))
                resp.data[0]["isBooked"] = true;
                let _filter = {
                    "filter": {
                        "_id": (resp.data[0].locId)
                    }
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _filter, "", "", "", req.tokenData.dbType)
                return res.status(200).json({ success: false, status: 200, desc: `Appointment already exists for today  at ${_mResp.data[0].locName}`, data: resp.data[0] });
            }

            const result = await bookAppointment("", req, "BOOK");
            if (!result.success) {
                return res.status(400).json({ success: false, status: 400, desc: result.desc, data: [] });
            }
            let finalResp = JSON.parse(JSON.stringify(result.data[0].data))
            finalResp[0]["isBooked"] = false;
            return res.status(200).json({ success: true, status: 200, desc: "", data: finalResp })

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
                "selectors": "-history",
                "populate": [
                    { 'path': 'patient', 'select': '_id dispName', 'populate':[ { 'path': 'title', 'select': ''}] },
                    { 'path': 'doctor', 'select': '_id dispName' },
                    { 'path': 'visitTransaction', 'select': '' },
                    { 'path': 'documentId', 'select': '' }]
            }
            let _finalDataResp = []
            if (req.body.params.docId) {
                _filter.filter["doctor"] = req.body.params.docId;
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

            mongoMapper("ophthamology_ecg_Consultations", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
                let checkStatusData = _.orderBy(_.filter(result.data, (co, ci) => { return co.checkStatus['checkInDt'] }), ['checkStatus.checkInDt'], ['desc'])
                if (checkStatusData.length > 0) {
                    _finalDataResp = checkStatusData
                }
                let queueNoData = _.orderBy(_.filter(result.data, (co, ci) => { return !co.checkStatus['checkInDt'] && co.queueNo !== "" }), ['queueNo'], ['asc'])
                if (queueNoData.length > 0) { _.each(queueNoData, (qo, qi) => { _finalDataResp.push(qo) }) }
                let empltyqueueNoData = _.orderBy(_.filter(result.data, (co, ci) => { return !co.checkStatus['checkInDt'] && co.queueNo === "" }), ['queueNo'], ['asc'])
                if (empltyqueueNoData.length > 0) { _.each(empltyqueueNoData, (eo, ei) => { _finalDataResp.push(eo) }) }
                if (_finalDataResp && _finalDataResp.length > 0) {
                    _.each(_finalDataResp, (_resp) => {
                        if (_resp.patName && _resp.patName.length > 0) {
                            _resp['patName'] = convertToPascalCase(_resp.patName)
                        }
                    })
                }
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "find", _filter, "", req.body, "", req.tokenData.dbType);
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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
            let _mResp1 = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", req.body.query, _filter, "", req.body, "", req.tokenData.dbType);
            _filter.filter = {}
            _filter.filter["docDetails.docId"] = req.body.params.docId;
            let docAgnstApp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", req.body.query, _filter, "", req.body, "", req.tokenData.dbType);
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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
            let _mRespOfAppt = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", req.body, "", req.tokenData.dbType)
            _mRespOfAppt["data"] = _.orderBy(_mRespOfAppt.data, ['queueNo'], ['asc'])
            _filter.filter["_id"] = _mongoId;
            let _reResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", req.body, "", req.tokenData.dbType)
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
                        let _rResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "aggregation", _filterObj, "", req.body, "", req.tokenData.dbType)
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
                    let _updateResp = await insertUpdateInMultiData1(_cBody, 0, [], req.tokenData.dbType, 'ophthamology_ecg_Consultations', 'findOneAndUpdate', 'U');
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
            let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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
//             let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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
//             let _mRespOfAppt = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", req.body, "", req.tokenData.dbType)
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
//             let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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
            let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
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

            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Consultations', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {
            }
            else {
                let _mResp1 = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
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
                    let _rResp = await _mUtils.commonMonogoCall("ophthamology_ecg_patients", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
                    let _updatePatVisitDetails = await updatePatVisitDetails(_rResp.data, 0, [], req, "VISITS")
                    if (!(_updatePatVisitDetails && _updatePatVisitDetails.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: "", data: _updatePatVisitDetails.data || [] });
                    }
                }
                if (req.body.params.apmntDtTime) {
                    let _lstApmntDt = moment(req.body.params.apmntDtTime).toISOString();
                    let isSlotBooked = await checkIfSlotBooked(req.tokenData.locId, _mResp1.data.docDetails.docId, _lstApmntDt, req)
                    if (isSlotBooked) {
                        return res.status(400).json({ success: false, desc: "This slot is already booked. please choose another time slot.", data: [] });
                    }
                    // else {
                    //     _cBody.params.apmntDtTime = _lstApmntDt;
                    // }
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
            mongoMapper('ophthamology_ecg_Consultations', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                if (result.data.status === 'CANCELLED') {
                    let _filter = {
                        "filter": { 'visits.visitId': result.data._id.toString() },
                        "selectors": {}
                    }
                    let visitPatRec = await mongoMapper('ophthamology_ecg_patients', 'find', _filter, req.tokenData.dbType);
                    if (visitPatRec.status !== "SUCCESS") {
                        return res.status(400).json({ success: false, status: 400, desc: visitPatRec.desc || "", data: [] });
                    }
                    let matchedVisit = visitPatRec.data[0].visits.find(visit => visit.visitId == result.data._id)
                    if (!matchedVisit) {
                        return res.status(400).json({ success: false, status: 400, desc: "No Visit Found For Cancel Appointment", data: [] });
                    }
                    let _fParams = {
                        params: {
                            _id: visitPatRec.data[0]._id,
                            visits: [
                                {
                                    _id: matchedVisit._id,
                                    status: 'CANCELLED'
                                }
                            ]
                        }
                    }
                    let pLoadResp = { payload: {} };
                    pLoadResp = await _mUtils.preparePayload('U', _fParams);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
                    }
                    mongoMapper('ophthamology_ecg_patients', "findOneAndUpdate", pLoadResp.payload, req.tokenData.dbType).then(async (_resp) => {
                        if (!(_resp && _resp.data)) {
                            return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Updating visit Cancelation in Patient ..`, data: [] });
                        }
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                }
                else {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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
            let _mApmntResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "find", _filter, "", "", "", req.tokenData.dbType)
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
            mongoMapper('ophthamology_ecg_Consultations', "insertMany", _finalResp, req.tokenData.dbType).then((result) => {
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
            if (req.body.params.documentId && req.body.params.documentId.length > 0) {
                let _draftFilter = {
                    "filter": {
                        "recStatus": { $eq: true },
                        "userId": req.tokenData.userId,
                        "formId": req.body.params.documentId,
                        "locId": req.tokenData.locId,
                        "visitNo": req.body.params.visitNo,
                        "UMR": req.body.params.UMR,
                        "status": "REQUESTED"
                    }
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", 'find', _draftFilter, "", "", "", req.tokenData.orgKey.toLowerCase());
                if (_mResp.success == true && _mResp.data.length > 0) {
                    let _data = JSON.parse(JSON.stringify(_mResp.data))
                    let _prms = {
                        "params": {
                            "_id": _data[0]._id,
                            "recStatus": false
                        }
                    }
                    pLoadResp = await _mUtils.preparePayload('U', _prms);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    let _dResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", "findOneAndUpdate", pLoadResp.payload, "", req.body, "", req.tokenData.dbType)
                    if (!(_dResp && _dResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _dResp.desc || "", data: _dResp.data || [] });
                    }
                }
            }
            if (req.body.params.data && Array.isArray(req.body.params.data) && req.body.params.data.length > 0) {
                _.each(req.body.params.data, (_data) => {
                    if (_data.child && Array.isArray(_data.child) && _data.child.length > 0) {
                        _.each(_data.child, (_child) => {
                            _child['audit'] = req.body.params.audit
                        })
                    }
                })
            }

            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            req.body.params["docDetails"] = {
                "docId": _mResp.data._id,
                "cd": _mResp.data.docCd || "",
                //syncChanges
                "i_docCd": _mResp.data.i_docCd || "",
                //syncChanges
                "name": _mResp.data.dispName,
                "regNo": _mResp.data.regNo || "",
                "degree": _mResp.data.degree || _mResp.data.qualf || "",
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

            mongoMapper('ophthamology_ecg_transactions', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
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
                let _final = [{ Review: false }];
                let _finalData = JSON.parse(JSON.stringify(result.data))
                for (let _tran of req.body.params.data) {
                    if (_tran.type == "REVIEW") {
                        if (_tran.child && _tran.child.length > 0) {
                            for (let _child of _tran.child) {
                                let appointment = await bookAppointment("I", _child, req, req.body.params.docDetails.docId, "REVIEW")
                                if (appointment.success) {
                                    _finalData[0]['apmntDtTm'] = appointment.data[0].data[0].dateTime
                                    let _filterData = _.filter(_finalData[0].data, (_dt) => { return _dt.type == "REVIEW" })
                                    let _prms = {
                                        params: {
                                            "_id": _finalData[0]._id,
                                            "data": [
                                                {
                                                    "_id": _filterData[0]._id,
                                                    child: [
                                                        {
                                                            _id: _filterData[0].child[0]._id,
                                                            apmntId: appointment.data[0].data[0]._id,
                                                            apmntDtTm: appointment.data[0].data[0].dateTime
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                    let pLoadResp = await _mUtils.preparePayload('U', _prms);
                                    if (!pLoadResp.success) {
                                        _final[0]['Review'] = true
                                        _final.push({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                                    }
                                    let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                                    if (!(_uResp && _uResp.success)) {
                                        _final[0]['Review'] = true
                                        _final.push({ success: false, status: 400, desc: _uResp.desc || "", data: _uResp.data || [] });
                                    }
                                }
                                else {
                                    _final.push({ success: false, data: appointment.data })
                                }
                            }
                        }
                    }
                }
                if (_final.length > 0 && _final[0].Review) {
                    if (_final.length > 0 && _final[0].success) {
                        //syncChanges
                        // let investigationData = _.filter(_finalData[0].data, (_dt) => _dt.type === "INVESTIGATION");
                        // if (investigationData.length > 0) {
                        //     let investigationPayload = JSON.parse(JSON.stringify(_finalData));
                        //     investigationPayload[0].data = investigationData;
                        //     let _tranformedData = await _emrToHis.emr2HisEvent93Trnsfrm(investigationPayload, req);
                        //     if (!(_tranformedData && _tranformedData.success)) {
                        //         console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedData.desc);
                        //     }
                        // }
                        // let medicationData = _.filter(_finalData[0].data, (_dt) => _dt.type === "MEDICATION");
                        // if (medicationData.length > 0) {
                        //     let medicationPayload = JSON.parse(JSON.stringify(_finalData));
                        //     medicationPayload[0].data = medicationData;
                        //     let _tranformedData = await _emrToHis.emr2HisEvent94Trnsfrm(medicationPayload, req);
                        //     if (!(_tranformedData && _tranformedData.success)) {
                        //         console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedData.desc);
                        //     }
                        // }
                        //syncChanges
                        return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                    }
                    else {
                        return res.status(400).json({ success: false, status: 400, desc: "Error While Booking Appointment", data: [] });
                    }
                }
                else {
                    //syncChanges
                    // let investigationData = _.filter(_finalData[0].data, (_dt) => _dt.type === "INVESTIGATION");
                    // if (investigationData.length > 0) {
                    //     let investigationPayload = JSON.parse(JSON.stringify(_finalData));
                    //     investigationPayload[0].data = investigationData;
                    //     let _tranformedData = await _emrToHis.emr2HisEvent93Trnsfrm(investigationPayload, req);
                    //     if (!(_tranformedData && _tranformedData.success)) {
                    //         console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedData.desc);
                    //     }
                    // }
                    // let medicationData = _.filter(_finalData[0].data, (_dt) => _dt.type === "MEDICATION");
                    // if (medicationData.length > 0) {
                    //     let medicationPayload = JSON.parse(JSON.stringify(_finalData));
                    //     medicationPayload[0].data = medicationData;
                    //     let _tranformedData = await _emrToHis.emr2HisEvent94Trnsfrm(medicationPayload, req);
                    //     if (!(_tranformedData && _tranformedData.success)) {
                    //         console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedData.desc);
                    //     }
                    // }
                    //syncChanges
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                }
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

                let _eResp = await _mUtils.commonMonogoCall("ophthamology_ecg_entity", "aggregation", _filter, "", "", "", req.tokenData.dbType);
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
//             let _eResp = await _mUtils.commonMonogoCall("ophthamology_ecg_entity", "aggregation", _filter, "", "", "", req.tokenData.dbType);
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
        mongoMapper("ophthamology_ecg_transactions", req.body.query, _pGData.data, req.tokenData.dbType).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(200).json({ success: true, status: 200, desc: ``, data: [] });
            }
            let _parseResultData = JSON.parse(JSON.stringify(result.data))
            let _indx = 0
            while (_parseResultData.length > _indx) {
                let _labels = _.filter(_parseResultData[_indx].data, (_fO) => { return _fO.type === 'LABELS' });
                if (_labels.length > 0) {
                    let _lblIdx = _.findIndex(_parseResultData[_indx].data, (_fO) => { return _fO.type === 'LABELS' });
                    _parseResultData[_indx].data.splice(_lblIdx, 1);
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
            //         _.each(_labels[0].child, (_lO, _lK) => {
            //             let _lblObj = {
            //                 "_id": _labels[0]._id,
            //                 "type": _labels[0].type,
            //                 "sequenceNo": "",
            //                 "cd": "",
            //                 "name": "",
            //                 "child": []
            //             }
            //             _lblObj.sequenceNo = _lO.sequenceNo;
            //             _lblObj.cd = _lO.cd;
            //             _lblObj.name = _lO.name;
            //             //console.log(_k, _lK, _lblObj);
            //             _lblObj.child.push({
            //                 "_id": _lO._id,
            //                 "lblId": _lO.lblId,
            //                 "value": _lO.value || ""
            //             });
            //             _o.data.push(_lblObj);
            //         });
            //     }

            // });
            if (Array.isArray(_parseResultData) && _parseResultData.length > 0) {
                for (let data of _parseResultData) {
                    if (data.docDetails.docId && data.docDetails.docId.length > 0) {
                        let _filter = {
                            "filter": {

                                "_id": data.docDetails.docId
                            },
                            "selectors": "-history"
                        }
                        let resp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "find", _filter, "", "", "", req.tokenData.dbType)
                        if (resp.data && resp.data.length > 0) {
                            data.docDetails['designation'] = resp.data[0].designation ? resp.data[0].designation : ""
                            data.docDetails['degree'] = resp.data[0].qualf ? resp.data[0].qualf : ""
                            data.docDetails['regNo'] = resp.data[0].regNo ? resp.data[0].regNo : ""
                            if (resp.data[0].signature && resp.data[0].signature !== "" && resp.data[0].signatureMimeType && resp.data[0].signatureMimeType.length > 0) {
                                let _imgdata = await getBase64Data(resp.data[0].signatureMimeType, resp.data[0].signature)
                                data.docDetails['imgSign'] = _imgdata
                            }
                            else {
                                data.docDetails['imgSign'] = ""
                            }
                        }
                    }
                    if (data.visitNo && data.visitNo.length > 0) {
                        let _aptfilter = {
                            filter: [
                                {
                                    $match: {
                                        "code": data.visitNo
                                    }
                                },
                                {
                                    $project: {
                                        dateTime: 1
                                    }
                                }
                            ]
                        }
                        let _resp = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "aggregation", _aptfilter, "", "", "", req.tokenData.dbType)
                        if (_resp.data && _resp.data.length > 0 && _resp.data[0].dateTime) {
                            data['visitDt'] = _resp.data[0].dateTime
                        }
                    }
                }
            }
            if (_parseResultData && _parseResultData.length > 0) {
                _.each(_parseResultData, (_data) => {
                    if (_data.data && _data.data.length > 0) {
                        _.each(_data.data, (_dt) => {
                            if (_dt.child && _dt.child.length > 0) {
                                _dt.child = _.filter(_dt.child, (_obj, _indx) => { return !_obj.hasOwnProperty("recStatus") || _obj.recStatus })
                            }
                            if (_dt.child.length > 0) {
                                _dt['childAvailable'] = true
                            }
                            else {
                                _dt['childAvailable'] = false
                            }
                        })
                        let _final = _.filter(_data.data, (_obj) => { return _obj.childAvailable })
                        if (_final.length > 0) {
                            _data['dataAvailable'] = true
                        }
                        else {
                            _data['dataAvailable'] = false
                        }
                    }
                })
            }

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
            if (req.body.params.data && Array.isArray(req.body.params.data) && req.body.params.data.length > 0) {
                _.each(req.body.params.data, (_data) => {
                    if (_data.child && Array.isArray(_data.child) && _data.child.length > 0) {
                        _.each(_data.child, (_child) => {
                            _child['audit'] = req.body.params.audit
                        })
                    }
                })
            }
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _tResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
            if (!(_tResp && _tResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _tResp.desc || "", data: _tResp.data || [] });
            }
            let _draftFilter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "userId": req.tokenData.userId,
                    "formId": _tResp.data.documentId,
                    "locId": req.tokenData.locId,
                    "visitNo": _tResp.data.visitNo,
                    "UMR": _tResp.data.UMR,
                    "status": "REQUESTED"
                }
            }
            let _dResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", 'find', _draftFilter, "", "", "", req.tokenData.orgKey.toLowerCase());
            if (_dResp.success == true && _dResp.data.length > 0) {
                let _data = JSON.parse(JSON.stringify(_dResp.data))
                let _prms = {
                    "params": {
                        "_id": _data[0]._id,
                        "recStatus": false
                    }
                }
                pLoadResp = await _mUtils.preparePayload('U', _prms);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                let _drResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", "findOneAndUpdate", pLoadResp.payload, "", req.body, "", req.tokenData.dbType)
                if (!(_drResp && _drResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _drResp.desc || "", data: _drResp.data || [] });
                }
            }
            let _cBody = JSON.parse(JSON.stringify((req.body)));
            let _prms = { "filter": {}, "selectors": "-history" }
            let _output = [{ Review: true }]
            if (_cBody.params.data && Array.isArray(_cBody.params.data) && _cBody.params.data.length > 0) {
                for (let _data of _cBody.params.data) {
                    if (_data.type && _data.type == "REVIEW") {
                        if (_data.child && _data.child.length > 0) {
                            for (let _child of _data.child) {
                                if (_child.reviewDt) {
                                    let _type = _child._id && _child._id.length > 0 ? "U" : "I"
                                    let appointment = await bookAppointment(_type, _child, req, _cBody.params.docId, "REVIEW")
                                    if (!appointment.success) {
                                        _output[0]['Review'] = false
                                        _output.push({ success: false, status: 400, desc: "Error While Booking Appointment", data: appointment.data || [] })
                                    }
                                    else {
                                        _child['apmntId'] = appointment.data[0].data[0]._id,
                                            _child['apmntDtTm'] = appointment.data[0].data[0].dateTime
                                        _output.push({ success: true, status: 200, desc: '', data: appointment.data })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!(_output[0].Review)) {
                return res.status(400).json({ success: false, status: 400, desc: "Error While Booking Appointment", data: [] });
            }
            if (_cBody.params.recStatus === false) {
                // let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
                // if (!(_mResp && _mResp.success)) {
                //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                // }
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

                let _mResp1 = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
                _cBody.params.revNo = _mResp1.data.params.revNo
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                mongoMapper('ophthamology_ecg_transactions', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });

            } else {
                // let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
                // if (!(_mResp && _mResp.success)) {
                //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                // }
                let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_transactions', _mResp.data.params, _cBody.params, req);
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
                        mongoMapper('ophthamology_ecg_transactions', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
                        let _mResp1 = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "findById", req.body.params._id, "", req.body, "", req.tokenData.dbType)
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
                        let _updateResp = await insertUpdateInMultiData(_finalPayloadObj, 0, [], req.tokenData.dbType, 'ophthamology_ecg_transactions', 'bulkWrite', 'BW')
                        if (!_updateResp.success) {
                            return res.status(400).json({ success: false, status: 400, desc: `Error occurred while Updating Transaction data, Err:-${_updateResp.desc}`, data: [] });
                        }
                        else {
                            //syncChanges
                            // let _filter = {
                            //     "filter": {
                            //         "recStatus": true,
                            //         "_id": _updateResp.data[0].data._id
                            //     },
                            //     "selectors": "-history"
                            // }
                            // let _mTransResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
                            // if (!(_mTransResp && _mTransResp.success)) {
                            //     return res.status(400).json({ success: false, status: 400, desc: _mTransResp.desc || "", data: _mTransResp.data || [] });
                            // }
                            // let investigationData = _.filter(_mTransResp.data[0].data, (_dt) => _dt.type === "INVESTIGATION");
                            // let medicationData = _.filter(_mTransResp.data[0].data, (_dt) => _dt.type === "MEDICATION");
                            // if (investigationData.length > 0 || medicationData.length > 0) {
                            //     let investigationPayload = JSON.parse(JSON.stringify(_mTransResp.data));
                            //     investigationPayload[0].data = investigationData;

                            //     let medicationPayload = JSON.parse(JSON.stringify(_mTransResp.data));
                            //     medicationPayload[0].data = medicationData;

                            //     const updateChild = (payloadData, type) => {
                            //         if (payloadData[0].data[0] && payloadData[0].data[0].child) {
                            //             payloadData[0].data[0].child = [];
                            //             const updateChild = _.filter(req.body.params.data, (_dt) => _dt.type === type);
                            //             if (updateChild.length > 0) {
                            //                 let newChild = [];
                            //                 updateChild.forEach((_obj) => {
                            //                     if (_obj.child && Array.isArray(_obj.child)) {
                            //                         let filteredChild = _.filter(_obj.child, (child) => !child._id);
                            //                         newChild.push(...filteredChild);
                            //                     }
                            //                 });
                            //                 payloadData[0].data[0].child.push(...newChild);
                            //             }
                            //         }
                            //     };
                            //     if (investigationData.length > 0) {
                            //         updateChild(investigationPayload, "INVESTIGATION");
                            //         let _tranformedInvData = await _emrToHis.emr2HisEvent93Trnsfrm(investigationPayload, req);
                            //         if (!(_tranformedInvData && _tranformedInvData.success)) {
                            //             console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedInvData.desc);
                            //         }
                            //     }
                            //     if (medicationData.length > 0) {
                            //         updateChild(medicationPayload, "MEDICATION");
                            //         let _tranformedMedData = await _emrToHis.emr2HisEvent94Trnsfrm(medicationPayload, req);
                            //         if (!(_tranformedMedData && _tranformedMedData.success)) {
                            //             console.log("Error Occured while inserting appointment booked data in emr2his syncing", _tranformedMedData.desc);
                            //         }
                            //     }

                            // }
                            //syncChamges
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
        mongoMapper('ophthamology_ecg_admissions', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_admissions", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_admissions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_admissions', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_admissions', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        let _date = moment().format('YYYY-MM-DD')
        if (_data.length > _idx) {
            // if (_data[_idx].isBilled === false && (_data[_idx].audit.documentedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString() && _data[_idx].audit.documentedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()) ||
            //     (_data[_idx].audit.modifiedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString() && _data[_idx].audit.modifiedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString())) {
            //     _output.push(_data[_idx])
            // }
            if (_data[_idx].isBilled != true &&
                (((_data[_idx].audit.documentedDt !== undefined) && (_data[_idx].audit.documentedDt.split('T')[0] == _date)) ||
                    ((_data[_idx].audit.modifiedDt !== undefined) && (_data[_idx].audit.modifiedDt.split('T')[0] == _date)))) {
                _output.push(_data[_idx])
            }
            // if (_data[_idx].isBilled === false && ((_data[_idx].audit.documentedDt && (_data[_idx].audit.documentedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString())) && (_data[_idx].audit.documentedDt && (_data[_idx].audit.documentedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()))) ||
            //     ((_data[_idx].audit.modifiedDt && (_data[_idx].audit.modifiedDt > new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString())) && (_data[_idx].audit.modifiedDt && (_data[_idx].audit.modifiedDt < new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString())))) {
            //     _output.push(_data[_idx])
            // }
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
            //let _filter = { "filter": { recStatus: { $eq: true } } };
            let _filter = {
                filter: [
                    { $match: { recStatus: { $eq: true } } },
                    //{ $project: { _id: 0 } },
                    //{$limit: 50}
                ]
            };
            let _mResp = await _mUtils.commonMonogoCall(_data[_idx], "aggregation", _filter, "", "", "", _dbType)
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
// router.post("/billing-search", async (req, res) => {
//     try {
//         if (req.body && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
//             let _filter = {
//                 "filter": { recStatus: { $eq: true } },
//                 "limit": 50
//             };
//             let _collection = "";
//             let staticArrey = ["ophthamology_ecg_investigations", "ophthamology_ecg_medications"]//ophthamology_ecg_pharmacy_med_masters
//             if (req.body.flag === "") {
//                 let hh = await getBillingDataSearch(staticArrey, 0, [], req.tokenData.dbType)
//                 let finalArrey = []
//                 let objectAssign = {
//                     serviceName: "",
//                     type: "",
//                     serviceCd: "",
//                     serviceId: ""
//                 }
//                 _.filter(hh.data, async(obj, indx) => {
//                     _.filter(obj.data,async (obj1) => {
//                         if (obj1.serviceTypeName) {
//                             if (obj1.serviceTypeName === "Investigations" || obj1.serviceTypeName === "Services" || obj1.serviceTypeName === "Procedures" || obj1.serviceTypeName === "Miscellaneous") {
//                                 if (obj1.name.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {
//                                     objectAssign = {
//                                         serviceName: obj1.name,
//                                         type: "INV",
//                                         serviceCd: obj1.cd,
//                                         serviceId: obj1._id,
//                                         serviceType: obj1.serviceTypeName,
//                                         tarrif: obj1.tarrif ? obj1.tarrif : []
//                                     }
//                                     finalArrey.push(objectAssign)
//                                 }
//                             }
//                         }
//                         else {
//                             if (obj1.medName.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {//BRAND_STRING2
//                                 objectAssign = {
//                                     serviceName: obj1.medName,
//                                     type: "MED",
//                                     serviceType: obj1.medFormTypeName,
//                                     serviceCd: obj1.cd,
//                                     serviceId: obj1._id,
//                                     tarrif: obj1.tarrif ? obj1.tarrif : []
//                                 }
//                                 finalArrey.push(objectAssign)
//                             }
//                         }
//                     })
//                 })
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: finalArrey });
//             } else {
//                 if (req.body.flag === "INV" || req.body.flag === "MED") {
//                     if (req.body.flag === "INV") {
//                         let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
//                         _filter.filter["name"] = nameExp;
//                         _collection = "ophthamology_ecg_investigations"
//                     }
//                     if (req.body.flag === "MED") {
//                         let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
//                         _filter.filter["medName"] = nameExp;
//                         _collection = "ophthamology_ecg_medications"
//                     }
//                     // mongoMapper(_collection, req.body.query, _filter, req.tokenData.dbType).then((result) => {
//                     //     let filteredResult = result.data.map(obj => ({
//                     //         serviceName: req.body.flag === "INV" ? obj.name : obj.medName,
//                     //         type: req.body.flag,
//                     //         serviceType: req.body.flag === "INV" ? obj.name : obj.medFormTypeName,
//                     //         serviceCd: obj.cd,
//                     //         serviceId: obj._id,
//                     //         tarrif: obj.tarrif ? obj.tarrif : []
//                     //     }));
//                     //     return res.status(200).json({ success: true, status: 200, desc: '', data: filteredResult });
//                     // }).catch((error) => {
//                     //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//                     // });
//                     mongoMapper(_collection, req.body.query, _filter, req.tokenData.dbType).then(async (result) => {
//                         let uniqueData;
//                         if(req.body.flag === 'INV'){
//                             uniqueData = await findDuplicatesAndCombinedData(result.data, 'name');
//                         } else if (req.body.flag === 'MED') {
//                             uniqueData = await findDuplicatesAndCombinedData(result.data, 'medName');
//                         }
//                         let filteredResult = await Promise.all(uniqueData.map(async obj => {
//                             let item = {
//                                 serviceName: req.body.flag === "INV" ? obj.name : obj.medName,
//                                 type: req.body.flag,
//                                 serviceType: req.body.flag === "INV" ? obj.name : obj.medFormTypeName,
//                                 serviceCd: obj.cd,
//                                 serviceId: obj._id,
//                                 grnData: [],
//                                 tarrif: obj.tarrif ? obj.tarrif : []
//                             };
//                             let _filter = { filter: { productId: obj._id } };
//                             let grnResult = await mongoMapper("ophthamology_ecg_grn_entries", req.body.query, _filter, req.tokenData.dbType)
//                             item.grnData = grnResult.data.map(obj => ({
//                                 _id: obj._id,
//                                 expirationDate: obj.expirationDate,
//                                 batchNumber: obj.batchNumber,
//                                 quantity: obj.quantityPerBatch,
//                                 manufactureDate: obj.manufactureDate
//                             }));
//                             return item;
//                         }));
//                         return res.status(200).json({ success: true, status: 200, desc: '', data: filteredResult });
//                     }).catch((error) => {
//                         return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//                     })
//                 } else {
//                     return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
//                 }
//             }
//         }
//         else {
//             return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });

router.post("/billing-search", async (req, res) => {
    try {
        if (req.body && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let _filter = {
                "filter": { recStatus: { $eq: true } },
                "limit": 50
            };
            let _collection = "";
            let staticArrey = ["ophthamology_ecg_investigations", "ophthamology_ecg_medications"]//ophthamology_ecg_pharmacy_med_masters
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
                                    serviceType: obj1.DOSE_FORM_NAME,  //medFormTypeName,
                                    serviceCd: obj1.BRAND_PRODUCT_MAP_CD,   //cd,
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
                        _filter.filter["childAvailable"] = true;
                        _collection = "ophthamology_ecg_investigations"
                    }
                    if (req.body.flag === "MED") {
                        let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                        _filter.filter["medName"] = nameExp;//BRAND_STRING2
                        _collection = "ophthamology_ecg_medications"
                    }
                    mongoMapper(_collection, req.body.query, _filter, req.tokenData.dbType).then((result) => {
                        let filteredResult = result.data.map(obj => ({
                            serviceName: req.body.flag === "INV" ? obj.name : obj.medName,
                            type: req.body.flag,
                            serviceType: req.body.flag === "INV" ? obj.name : obj.medFormTypeName,//DOSE_FORM_NAME,
                            serviceCd: req.body.flag === "INV" ? obj.cd : obj.cd, //obj.BRAND_PRODUCT_MAP_CD,
                            serviceId: obj._id,
                            tarrif: obj.tarrif ? obj.tarrif : []
                        }));
                        return res.status(200).json({ success: true, status: 200, desc: '', data: filteredResult });
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
            let _mPatResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
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
            let _mPatResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "find", _filter, "", "", "", req.tokenData.dbType)
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
                serviceId: "",
                grnData: []
            }
            let finalCreateObject = [];
            let getTableData = await getBillingData(finalArrey, 0, [], req.tokenData.dbType)
            // _.filter(getTableData.data, (obj, indx) => {
            for (const obj of getTableData.data) {
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
            }
            //)
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_doctors", "findById", req.body.params.docId, "", req.body, "", req.tokenData.dbType)
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

            mongoMapper('ophthamology_ecg_labresults', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

function transformLabResults(_data) {

    if (_data.length > 0) {
        let _output = []
        for (let _obj of _data) {
            _output.push({

                invsId: "",
                invsCd: _obj.SERVICE_CODE,
                invsName: _obj.SERVICE_NAME,
                ageRange: "",
                status: _obj.DEVIATETYPE,
                statusCd: "",
                class: `lab_${_obj.DEVIATETYPE}`,
                lowVal: "",
                highVal: "",
                value: _obj.RESULTVALUES,
                unit: _obj.RESULTUOM,
                billNo: _obj.BILLNO,
                billedDate: _obj.BILLED_DT,
                docCd: _obj.DOCTORCD,
                source: "his",
                isChildAvailable: true,
                parameters: [
                    {
                        paramId: "",
                        paramCd: _obj.PARAMETERCD,
                        paramName: _obj.PARAMETERDESC,
                        ageRange: "",
                        status: "",
                        statusCd: "",
                        class: "",
                        lowVal: "",
                        highVal: "",
                        value: "",
                        unit: "",
                    }
                ]

            })
        }
        return _output;
    }

}

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
            mongoMapper("ophthamology_ecg_labresults", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {

            let { fromDt, toDt, ..._params } = req.body.params;
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history"
            }

            if (!toDt) {
                toDt = new Date().toISOString();
            }
            if (!fromDt) {
                fromDt = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();
            }

            _filter.filter.dateTime = {
                $gte: fromDt.split('T')[0],
                $lte: toDt.split('T')[0]
            }

            let _pGData = await prepareGetPayload(_filter, _params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper("ophthamology_ecg_labresults", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labresults", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_labresults', _mResp.data.params, _cBody.params, req, "cm");
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
            mongoMapper('ophthamology_ecg_labresults', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            mongoMapper('ophthamology_ecg_ordersets', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_ordersets", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_ordersets", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_ordersets', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_ordersets', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            mongoMapper('ophthamology_ecg_labels_templates', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_labels_templates", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_labels_templates", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_labels_templates', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('ophthamology_ecg_labels_templates', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
            // if (req.body.params.flag === "VIT") {
            //     _coll = "ophthamology_ecg_vitals_tran"
            // } 
            if (req.body.params.flag === "INV") {
                _coll = "ophthamology_ecg_investigation_tran"
            }
            else if (req.body.params.flag === "MED") {
                _coll = "ophthamology_ecg_medications_tran"
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "find", _filter, "", req.body, "", req.tokenData.dbType)
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
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

                _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_transactions", "aggregation", _filter, "", req.body, "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
            }
            let _parseResultData = JSON.parse(JSON.stringify(_mResp.data))
            if (_parseResultData && _parseResultData.length > 0) {
                _.each(_parseResultData, (_data) => {
                    if (_data.data && _data.data.length > 0) {
                        _.each(_data.data, (_dt) => {
                            if (_dt.child) {
                                if (_dt.child.length > 0) {
                                    _dt.child = _.filter(_dt.child, (_obj, _indx) => { return !_obj.hasOwnProperty("recStatus") || _obj.recStatus })
                                }
                                if (_dt.child.length > 0) {
                                    _dt['childAvailable'] = true
                                }
                                else {
                                    _dt['childAvailable'] = false
                                }
                            }
                        })
                        let _final = _.filter(_data.data, (_obj) => { return _obj.childAvailable })
                        if (_final.length > 0) {
                            _data['dataAvailable'] = true
                        }
                        else {
                            _data['dataAvailable'] = false
                        }
                    }
                })
            }

            return res.status(200).json({ success: true, status: 200, desc: '', data: _parseResultData || [] });
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
        // _.each(req.body.params, (_obj) => {
        //     _obj['audit'] = req.body.params.audit;
        // });
        mongoMapper('ophthamology_ecg_inv_fav', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_inv_fav", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_inv_fav", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_inv_fav', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_inv_fav', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
        mongoMapper('ophthamology_ecg_med_fav', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper("ophthamology_ecg_med_fav", req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_med_fav", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_med_fav', _mResp.data.params, _cBody.params, req);

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
            mongoMapper('ophthamology_ecg_med_fav', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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
                _obj['orgId'] = req.tokenData.orgId;
                _obj['locId'] = req.tokenData.locId;
                _obj['userId'] = req.tokenData.userId;
            });
            //  req.body.params.orgId = req.tokenData.orgId;
            mongoMapper('ophthamology_ecg_Fieldsmanagement', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
            mongoMapper("ophthamology_ecg_Fieldsmanagement", "find", _pGData.data, req.tokenData.dbType).then((result) => {
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
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Fieldsmanagement", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_Fieldsmanagement', _mResp.data.params, _cBody.params, req);
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
            mongoMapper('ophthamology_ecg_Fieldsmanagement', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

async function individualCollPayload(_type, _params, _idx, _output = [], req) {
    try {

        if (_params.length > _idx) {
            if (_params[_idx].mainhdcd == "MEDICATIONS") {
                if (_params[_idx].mainChild && _params[_idx].mainChild.length > 0) {
                    _.each(_params[_idx].mainChild, (_mainChild) => {
                        if (_mainChild.hc && _mainChild.hc == "MEDICATION") {
                            if (_mainChild.data && _mainChild.data.length > 0) {
                                _.each(_mainChild.data, (_med) => {
                                    _output.push(
                                        {
                                            type: "MEDICATION",
                                            genericName: _med.MEDICATIONNAME.val.genericName || "",
                                            genericCd: _med.MEDICATIONNAME.val.genericCd || "",
                                            medCd: _med.MEDICATIONNAME.val.medCd ? _med.MEDICATIONNAME.val.medCd : "",
                                            medName: _med.MEDICATIONNAME.val.medName || "",
                                            medFormTypeCd: _med.MEDICATIONNAME.val.medFormTypeCd || "",
                                            medFormTypeName: _med.MEDICATIONNAME.val.medFormTypeName || "",
                                            manufacture: _med.MEDICATIONNAME.val.manufacture ? _med.MEDICATIONNAME.val.manufacture : "",
                                            isOutside: _med.MEDICATIONNAME.val.isOutside ? _med.MEDICATIONNAME.val.isOutside : true,
                                            insideItem: _med.MEDICATIONNAME.val.insideItem ? _med.MEDICATIONNAME.val.insideItem : true,
                                            isfavoritAdd: _med.MEDICATIONNAME.val.isfavoritAdd ? _med.MEDICATIONNAME.val.isfavoritAdd : false,
                                            drugDose: _med.MEDICATIONNAME.val.drugDose ? _med.MEDICATIONNAME.val.drugDose : "",
                                            dosageCd: _med.MEDICATIONNAME.val.doseVolumeUnitCd ? _med.MEDICATIONNAME.val.doseVolumeUnitCd : "",
                                            dosageUnit: _med.MEDICATIONNAME.val.doseVolumeUnitName ? _med.MEDICATIONNAME.val.doseVolumeUnitName : "",
                                            drugSchedule: _med.MEDICATIONNAME.val.drugSchedule ? _med.MEDICATIONNAME.val.drugSchedule : "",
                                            admnstrTyp: _med.MEDICATIONNAME.val.admnstrTyp ? _med.MEDICATIONNAME.val.admnstrTyp : "",
                                            admnstrCd: _med.MEDICATIONNAME.val.admnstrCd ? _med.MEDICATIONNAME.val.admnstrCd : "",
                                            freqCd: _med.MEDICATIONNAME.val.defFreqCd ? _med.MEDICATIONNAME.val.defFreqCd : "",
                                            freqDesc: _med.MEDICATIONNAME.val.defFreqName ? _med.MEDICATIONNAME.val.defFreqName : "",
                                            freqQty: _med.MEDICATIONNAME.val.defFreqQty ? _med.MEDICATIONNAME.val.defFreqQty : "",
                                            cd: _med.MEDICATIONNAME.val.cd ? _med.MEDICATIONNAME.val.cd : "",
                                            duration: {
                                                cd: _med.DURATION.remarks ? _med.DURATION.remarks : "",
                                                label: _med.DURATION.searchName ? _med.DURATION.searchName : ""
                                            },
                                            timings: _med.MEDICATIONNAME.val.timings ? _med.MEDICATIONNAME.val.timings : "",
                                            days: _med.DURATION.val ? _med.DURATION.val : "",
                                            //qty: {
                                            //     type: Number
                                            // },
                                            indication: _med.INSTRUCTIONSTEXT.val || "",
                                            instruction: _med.INSTRUCTIONS.searchName || "",
                                            // prescDocCd: "",
                                            // prescDocName: "",
                                            // isDschrgMed: "",
                                            // lastOrderDt: "",
                                            // nebulization: ,
                                            // stockPointCd: "", //   -grn-entries -stock point
                                            routeCd: _med.ROUTE.val || "",
                                            routeName: _med.ROUTE.searchName || "",
                                            // parentMedCd: "",
                                            // childParentMedCd: "",
                                            startDt: _med.STARTDT.val,
                                            endDt: _med.STOPDT.val,
                                            // indentRequired: true,
                                            // antibioticCd: 1,
                                            // isConsumable: true -med_master
                                            // billNo: "",-order bill
                                            // isBilled: true/false
                                            // billDt:"",
                                            authAudit: [
                                                {
                                                    documentedId: req.body.params.audit.documentedById || "",
                                                    documentedDt: req.body.params.audit.documentedDt || "",
                                                    documentedBy: req.body.params.audit.documentedBy || "",
                                                }
                                            ],
                                            // categoryCd: 1 // -master
                                            translateLanguage: {
                                                freqDesc: _med.MEDICATIONNAME.val.defFreqName ? _med.MEDICATIONNAME.val.defFreqName : "",
                                                indication: _med.INSTRUCTIONSTEXT.val || "",
                                                instructions: _med.INSTRUCTIONS.searchName || "",
                                            }
                                        })
                                })
                            }
                        }
                    })
                }
            }

            if (_params[_idx].mainhdcd == "INVESTIGATION") {
                if (_params[_idx].mainChild && _params[_idx].mainChild.length > 0) {
                    _.each(_params[_idx].mainChild, (_mainChild) => {
                        if (_mainChild.hc && _mainChild.hc == "INVESTIGATION") {
                            if (_mainChild.data && _mainChild.data.length > 0) {
                                _.each(_mainChild.data, (_inv) => {
                                    _output.push(
                                        {
                                            type: "INVESTIGATION",
                                            tarrif: _inv.INVESTIGATIONNAME.val.tarrif || [],
                                            dtTime: _inv.DATE.val || "",
                                            serviceCd: _inv.INVESTIGATIONNAME.val.cd || "",
                                            serviceName: _inv.INVESTIGATIONNAME.val.name || "",
                                            serviceTypeName: _inv.INVESTIGATIONNAME.val.serviceTypeName || "",
                                            serviceTypeCd: _inv.INVESTIGATIONNAME.val.serviceTypeCd || "",
                                            serviceGroupCd: _inv.INVESTIGATIONNAME.val.serviceGroupCd || "",
                                            serviceType: _inv.INVESTIGATIONNAME.val.serviceType || "",
                                            isOutside: _inv.INVESTIGATIONNAME.val.isOutside || true,
                                            insideItem: _inv.INVESTIGATIONNAME.val.insideItem || true,
                                            qty: 1,
                                            isfavoritAdd: true,
                                            serviceDt: _inv.DATE.val || "",
                                            instruction: _inv.INSTRUCTIONS.val || "",
                                            stat: _inv.STAT.val[0].st ? true : false,
                                            //nextOrdDt: "",
                                            //lastOrderDt: "",
                                            orderType: _inv.INVESTIGATIONNAME.type || "",
                                            //status: "",
                                            parentServiceCd: "", //-inv-masters
                                            isPackageType: "", //-inv-mastes
                                            // cancelFrom: "",
                                            // billNo: "",
                                            // isBilled: { type: Boolean, default: true },
                                            // billDt: "",
                                            statusAudit: [
                                                {
                                                    // status: "",
                                                    // remarks: "",
                                                    documentedId: req.body.params.audit.documentedById || "",
                                                    documentedDt: req.body.params.audit.documentedDt || "",
                                                    documentedBy: req.body.params.audit.documentedBy || "",
                                                }
                                            ],
                                            translateLanguage: {
                                                instruction: _inv.INSTRUCTIONS.val || ""
                                            }
                                        })
                                })
                            }
                        }
                    })
                }
            }

            _idx = _idx + 1;
            await individualCollPayload(_type, _params, _idx, _output, req);
        }
        else {
            return { success: true, data: _output }
        }
        //let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}


router.post("/insert-pincodes", async (req, res) => {
    try {

        mongoMapper('ophthamology_ecg_Pincodes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
        mongoMapper('ophthamology_ecg_Pincodes', req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            if (result.data && result.data.length == 0) {
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

router.post("/get-all-locations", async (req, res) => {
    try {
        let cBody = JSON.parse(JSON.stringify(req.body))
        let _filter = {
            "filter": {
                orgKey: cBody.params.orgKey
            },
            "selectors": "-audit -history -photo -favIcon"

        }
        // _.each(cBody,(_v,_k)=>{
        //     _filter.filter[`${_k}`] = {$regex:_v,$options:"i"}
        // })
        let _pGData = await prepareGetPayload(_filter, cBody);

        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }

        mongoMapper('ophthamology_ecg_organization', req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            let _finalResp = JSON.parse(JSON.stringify(result.data))
            if (_finalResp[0].locations && _finalResp[0].locations.length > 0) {
                _.each(_finalResp[0].locations, (location) => {
                    if (location.nabhLogo) {
                        delete location.nabhLogo
                    }
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp[0].locations });
            }
            else {
                return res.status(400).json({ success: false, status: 400, desc: "No Locations Found", data: [] });
            }

        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/insert-grnEntryData", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.manufactureDate && req.body.params.quantityPerBatch && req.body.params.productName && req.body.params.batchNumber && req.body.params.expirationDate) {
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'grnEntry' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
            req.body.params["grnNumber"] = _seqResp.data;
            mongoMapper('ophthamology_ecg_grn_entries', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

router.post("/get-grnEntryData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("ophthamology_ecg_grn_entries", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/update-grnEntryData", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_grn_entries", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_grn_entries', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {
                return
            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                console.log("pLoadResp", pLoadResp.payload)
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.pData[0].updateOne.update.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }
            }
            mongoMapper('ophthamology_ecg_grn_entries', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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


router.post("/insert-specialities", async (req, res) => {
    try {
        req.body.params['orgId'] = req.tokenData.orgId
        mongoMapper('ophthamology_ecg_specialities', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/get-specialities", async (req, res) => {
    try {
        let cBody = JSON.parse(JSON.stringify(req.body))
        let _filter = {
            "filter": {

            },
            "selectors": ""

        }
        // _.each(cBody,(_v,_k)=>{
        //     _filter.filter[`${_k}`] = {$regex:_v,$options:"i"}
        // })
        let _pGData = await prepareGetPayload(_filter, cBody.params);

        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }

        mongoMapper('ophthamology_ecg_specialities', req.body.query, _pGData.data, req.tokenData.dbType).then((result) => {
            let _finalResp = JSON.parse(JSON.stringify(result.data))
            if (_finalResp && _finalResp.length > 0) {

                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalResp });
            }
            else {
                return res.status(400).json({ success: false, status: 400, desc: "No Speciality Found", data: [] });
            }

        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/update-specialities", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_specialities", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('ophthamology_ecg_specialities', _mResp.data.params, _cBody.params, req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }

            _cBody.params.revNo = _mResp.data.params.revNo;
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            mongoMapper('ophthamology_ecg_specialities', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

router.post("/get-doc-dashboard-data/old", async (req, res) => {
    try {
        if (req.body.params && req.body.params.docId && req.body.params.fromDt) {
            let fromDt = req.body.params.fromDt.split('T')[0]
            let toDt = req.body.params.toDt ? req.body.params.toDt.split("T")[0] : fromDt

            let _docFilter = {
                "filter": [
                    {
                        $match: {
                            "_id": mongoose.Types.ObjectId(`${req.body.params.docId}`)
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            locData: {
                                $filter: {
                                    input: "$locations",
                                    as: "location",
                                    cond: { $eq: ["$$location.locId", req.tokenData.locId] }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            Schedules: {
                                $arrayElemAt: ["$locData.shifts", 0]
                            },
                            Settings: [
                                {
                                    DocumentSettings: {
                                        $arrayElemAt: ["$locData.documentSettings", 0]
                                    },
                                    PrintSettings: {
                                        $arrayElemAt: ["$locData.printSettings", 0]
                                    }

                                }
                            ]
                        }
                    }
                ]
            }
            let _aptFilter = {
                "filter": [
                    {
                        $match: {
                            "docDetails.docId": mongoose.Types.ObjectId(`${req.body.params.docId}`),
                            dateTime: {
                                $gte: `${fromDt}T00:00:00.000Z`,
                                $lte: `${toDt}T23:59:59:999Z`
                            }
                        }
                    },
                    {
                        $facet: {
                            Appointments: [
                                {
                                    $group: {
                                        _id: null,
                                        Booked: { $sum: 1 },
                                        Paid: {
                                            $sum: { $cond: [{ $eq: ["$isPayment", true] }, 1, 0] }
                                        },
                                        QueueGenerated: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and: [{ $ne: [{ $type: "$queueNo" }, "missing"] },
                                                        { $ne: ["$queueNo", ""] }]
                                                    }, 1, 0
                                                ]
                                            }
                                        },

                                        Completed: {
                                            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                                        }

                                    }

                                }

                            ],
                            PatientOverView: [
                                {
                                    $group: {
                                        _id: null,
                                        NewPatients: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "NORMAL"] }, 1, 0] }
                                        },
                                        ReviewPatients: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "REVIEW"] }, 1, 0] }
                                        },
                                        FollowUpPatinets: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "FOLLOWUP"] }, 1, 0] }
                                        }
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $project: {
                            Appointments: {
                                Booked: { $arrayElemAt: ["$Appointments.Booked", 0] },
                                Paid: { $arrayElemAt: ["$Appointments.Paid", 0] },
                                QueueGenerated: { $arrayElemAt: ["$Appointments.QueueGenerated", 0] },
                                Completed: { $arrayElemAt: ["$Appointments.Completed", 0] },
                            },
                            PatientOverView: {
                                NewPatients: { $arrayElemAt: ["$PatientOverView.NewPatients", 0] },
                                ReviewPatients: { $arrayElemAt: ["$PatientOverView.ReviewPatients", 0] },
                                FollowUpPatients: { $arrayElemAt: ["$PatientOverView.FollowUpPatinets", 0] }
                            }
                        }
                    }
                ]
            }

            mongoMapper("ophthamology_ecg_doctors", "aggregation", _docFilter, req.tokenData.dbType).then(async (result) => {
                if (!result.data || result.data.length == 0) {
                    return res.status(400).json({ status: 'FAIL', desc: 'No Doctor Found', data: [] });
                }
                else {
                    let _dashBoardData = [{}]
                    if (result.data[0].Schedules) {
                        _dashBoardData[0]['Schedules'] = result.data[0].Schedules
                    }
                    if (result.data[0].Settings) {
                        _dashBoardData[0]['Settings'] = result.data[0].Settings[0]
                    }
                    mongoMapper("ophthamology_ecg_Consultations", "aggregation", _aptFilter, req.tokenData.dbType).then(async (_resp) => {
                        if (!_resp.data || _resp.data.length == 0) {
                            return res.status(400).json({ status: 'FAIL', desc: 'Error While Getting Appointments', data: [] });
                        }
                        else {
                            if (_resp.data[0].Appointments && _resp.data[0].Appointments.length > 0) {
                                _dashBoardData[0]['Appointments'] = _resp.data[0].Appointments[0]
                            }
                            else {
                                _dashBoardData[0]['Appointments'] = {
                                    Booked: 0,
                                    Paid: 0,
                                    QueueGenerated: 0,
                                    Completed: 0,
                                }
                            }
                            if (_resp.data[0].PatientOverView && _resp.data[0].PatientOverView.length > 0) {
                                _dashBoardData[0]['PatientOverView'] = _resp.data[0].PatientOverView[0]
                                _dashBoardData[0]['PatientOverView']['TotalPatients'] = _resp.data[0].PatientOverView[0].NewPatients + _resp.data[0].PatientOverView[0].FollowUpPatients + _resp.data[0].PatientOverView[0].FollowUpPatients
                            }
                            else {
                                _dashBoardData[0]['PatientOverView'] = {
                                    TotalPatients: 0,
                                    NewPatients: 0,
                                    ReviewPatients: 0,
                                    FollowUpPatients: 0
                                }
                            }
                            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _dashBoardData })
                        }

                    }).catch(async (error) => {
                        return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
                    });
                }
            }).catch(async (error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required Parameters Are Missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

router.post("/get-doc-dashboard-data", async (req, res) => {
    try {
        if (req.body.params && req.body.params.docId && req.body.params.locId && req.body.params.fromDt) {

            let fromDt = req.body.params.fromDt.split('T')[0]
            let toDt = req.body.params.toDt ? req.body.params.toDt.split("T")[0] : fromDt

            let _docFilter = {
                "filter": [
                    {
                        $match: {
                            "_id": mongoose.Types.ObjectId(`${req.body.params.docId}`)
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            locData: {
                                $filter: {
                                    input: "$locations",
                                    as: "location",
                                    cond: { $eq: ["$$location.locId", req.tokenData.locId] }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            schedules: {
                                $arrayElemAt: ["$locData.shifts", 0]
                            },
                            settings: [
                                {
                                    documentSettings: {
                                        $arrayElemAt: ["$locData.documentSettings", 0]
                                    },
                                    printSettings: {
                                        $arrayElemAt: ["$locData.printSettings", 0]
                                    }

                                }
                            ]
                        }
                    }
                ]
            }
            let _aptFilter = {
                "filter": [
                    {
                        $match: {
                            "docDetails.docId": mongoose.Types.ObjectId(`${req.body.params.docId}`),
                            dateTime: {
                                $gte: `${fromDt}T00:00:00.000Z`,
                                $lte: `${toDt}T23:59:59:999Z`
                            }
                        }
                    },
                    {
                        $facet: {
                            appointments: [
                                {
                                    $group: {
                                        _id: null,
                                        booked: { $sum: 1 },
                                        paid: {
                                            $sum: { $cond: [{ $eq: ["$isPayment", true] }, 1, 0] }
                                        },
                                        queueGenerated: {
                                            $sum: {
                                                $cond: [
                                                    {
                                                        $and: [{ $ne: [{ $type: "$queueNo" }, "missing"] }, { $ne: ["$queueNo", ""] }]
                                                    }, 1, 0
                                                ]
                                            }
                                        },

                                        completed: {
                                            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
                                        }

                                    }

                                }

                            ],
                            patientOverView: [
                                {
                                    $group: {
                                        _id: null,
                                        newPatients: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "NORMAL"] }, 1, 0] }
                                        },
                                        reviewPatients: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "REVIEW"] }, 1, 0] }
                                        },
                                        followUpPatinets: {
                                            $sum: { $cond: [{ $eq: ["$apmntType", "FOLLOWUP"] }, 1, 0] }
                                        }
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $project: {
                            appointments: {
                                booked: { $arrayElemAt: ["$appointments.booked", 0] },
                                paid: { $arrayElemAt: ["$appointments.paid", 0] },
                                queueGenerated: { $arrayElemAt: ["$appointments.queueGenerated", 0] },
                                completed: { $arrayElemAt: ["$appointments.completed", 0] },
                            },
                            patientOverView: {
                                newPatients: { $arrayElemAt: ["$patientOverView.newPatients", 0] },
                                reviewPatients: { $arrayElemAt: ["$patientOverView.reviewPatients", 0] },
                                followUpPatients: { $arrayElemAt: ["$patientOverView.followUpPatinets", 0] }
                            }
                        }
                    }
                ]
            }

            let _dashBoardData = [{}]
            await mongoMapper("ophthamology_ecg_doctors", "aggregation", _docFilter, req.tokenData.dbType).then(async (result) => {
                if (!result.data || result.data.length == 0) {
                    return res.status(400).json({ status: 'FAIL', desc: 'No Doctor Found', data: [] });
                }
                else {

                    if (result.data[0].schedules) {
                        _dashBoardData[0]['schedules'] = result.data[0].schedules
                    }
                    if (result.data[0].settings) {
                        _dashBoardData[0]['settings'] = result.data[0].settings[0]
                    }
                    await mongoMapper("ophthamology_ecg_Consultations", "aggregation", _aptFilter, req.tokenData.dbType).then(async (_resp) => {
                        if (!_resp.data || _resp.data.length == 0) {
                            return res.status(400).json({ status: 'FAIL', desc: 'Error While Getting Appointments', data: [] });
                        }
                        else {
                            if (_resp.data[0].appointments && _resp.data[0].appointments.length > 0) {
                                _dashBoardData[0]['appointments'] = _resp.data[0].appointments[0]
                            }
                            else {
                                _dashBoardData[0]['appointments'] = {
                                    booked: 0,
                                    paid: 0,
                                    queueGenerated: 0,
                                    completed: 0,
                                }
                            }
                            if (_resp.data[0].patientOverView && _resp.data[0].patientOverView.length > 0) {
                                _dashBoardData[0]['patientOverView'] = _resp.data[0].patientOverView[0]
                                _dashBoardData[0]['patientOverView']['totalPatients'] = _resp.data[0].patientOverView[0].newPatients + _resp.data[0].patientOverView[0].followUpPatients + _resp.data[0].patientOverView[0].followUpPatients
                            }
                            else {
                                _dashBoardData[0]['patientOverView'] = {
                                    totalPatients: 0,
                                    newPatients: 0,
                                    reviewPatients: 0,
                                    followUpPatients: 0
                                }
                            }
                        }

                    }).catch(async (error) => {
                        return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
                    });
                }
            }).catch(async (error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });

            if (req.body.params.flag) {
                const today = moment();
                let fromDt, toDt;
                if (req.body.params.flag === "MONTH") {
                    fromDt = today.clone().startOf("month").format("YYYY-MM-DD");
                    toDt = today.clone().endOf("month").format("YYYY-MM-DD");
                }
                else if (req.body.params.flag === "WEEK") {
                    fromDt = today.clone().startOf("isoWeek").format("YYYY-MM-DD");
                    toDt = today.clone().endOf("isoWeek").format("YYYY-MM-DD");
                }
                else if (req.body.params.flag === "DAY") {
                    fromDt = today.format("YYYY-MM-DD")
                    toDt = today.format("YYYY-MM-DD")
                }
                else {
                    return res.status(400).json({ success: false, desc: "Invalid flag value" });
                }

                let _dayWiseFilter = {
                    "filter": [
                        {
                            $match: {
                                "docDetails.docId": mongoose.Types.ObjectId(`${req.body.params.docId}`),
                                dateTime: { $gte: `${fromDt}T00:00:00.000Z`, $lte: `${toDt}T23:59:59:999Z` }
                            }
                        },
                        {
                            $project: {
                                date: { $substr: ["$dateTime", 0, 10] },
                                apmntType: 1,
                                status: 1,
                                dateTime: 1,
                                isPayment: 1,
                            }
                        },
                        {
                            $group: {
                                _id: "$date",
                                appointments: { $push: "$$ROOT" },
                                queueGenerated: {
                                    $sum: {
                                        $cond: [{
                                            $and: [{ $eq: [{ $type: "$status" }, "string"] },
                                            { $regexMatch: { input: "$status", regex: /^[0-9]+$/ } },
                                            { $ne: ["$status", null] }, { $ne: ["$status", ""] }]
                                        }, 1, 0]
                                    }
                                },
                                newPatients: { $sum: { $cond: [{ $eq: ["$apmntType", "NORMAL"] }, 1, 0] } },
                                reviewPatients: { $sum: { $cond: [{ $eq: ["$apmntType", "REVIEW"] }, 1, 0] } },
                                followUpPatients: { $sum: { $cond: [{ $eq: ["$apmntType", "FOLLOWUP"] }, 1, 0] } },
                                booked: { $sum: 1 },
                                paid: { $sum: { $cond: [{ $eq: ["$isPayment", true] }, 1, 0] } },
                                completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
                                cancelled: { $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] } },
                                skipped: { $sum: { $cond: [{ $eq: ["$status", ""] }, 1, 0] } }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }

                const appointmentData = await _mUtils.commonMonogoCall("ophthamology_ecg_Consultations", "aggregation", _dayWiseFilter, "", "", "", req.tokenData.dbType)
                if (!(appointmentData && appointmentData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: "Error fetching appointments" });
                }
                const appointmentMap = _.keyBy(appointmentData.data, "_id");

                const docCalanderResult = [];
                const allDates = [];

                let currentDate = moment(fromDt);
                while (currentDate.isSameOrBefore(toDt)) {
                    allDates.push(currentDate.format("YYYY-MM-DD"));
                    currentDate.add(1, "day");
                }

                allDates.forEach((date) => {
                    const appointment = appointmentMap[date] || {
                        _id: date,
                        appointments: [],
                        booked: 0,
                        paid: 0,
                        queueGenerated: 0,
                        completed: 0,
                        cancelled: 0,
                        skipped: 0,
                        newPatients: 0,
                        reviewPatients: 0,
                        followUpPatients: 0
                    };

                    docCalanderResult.push(
                        { displayOrder: 1, title: `Booked: ${appointment.booked}`, start: date, classNames: ["booked-event"] },
                        { displayOrder: 2, title: `Paid: ${appointment.paid}`, start: date, classNames: ["paid-event"] },
                        { displayOrder: 3, title: `Completed: ${appointment.completed}`, start: date, classNames: ["completed-event"] },
                        { displayOrder: 4, title: `Queued: ${appointment.queueGenerated}`, start: date, classNames: ["queued-event"] },
                        { displayOrder: 5, title: `Cancelled: ${appointment.cancelled}`, start: date, classNames: ["cancelled-event"] },
                        { displayOrder: 6, title: `Skipped: ${appointment.skipped}`, start: date, classNames: ["skipped-event"] },
                        { displayOrder: 7, title: `New Patients: ${appointment.newPatients}`, start: date, classNames: ["newPatients-event"] },
                        { displayOrder: 8, title: `Review Patients: ${appointment.reviewPatients}`, start: date, classNames: ["reviewPatients-event"] },
                        { displayOrder: 9, title: `FollowUp Patients: ${appointment.followUpPatients}`, start: date, classNames: ["followUpPatients-event"] },
                    );
                });

                _dashBoardData[0]["dateWiseDocCalander"] = docCalanderResult;

                return res.status(200).json({ success: true, status: 200, desc: '', data: _dashBoardData });
            }
            else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: _dashBoardData });
            }
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required Parameters Are Missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/forgot-password', async (req, res) => {
    try {
        if (req.body.flag == "LOGIN") {
            if (!req.body.params || !req.body.params.userName || !req.body.flag) {
                return res.status(400).json({ status: 'FAIL', desc: 'please provide valid paramters', data: " " })
            }
            // const searchValue = req.body.params.searchValue.trim();
            // let searchField;

            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    // [searchField]: req.body.params.searchValue,
                    "userName": req.body.params.userName
                },
                "selectors": "-history"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            mongoMapper("ophthamology_ecg_Users", "find", _filter, _dbType).then(async (result) => {
                if (result.data.length == 0) {
                    return res.status(404).json({ status: 'FAIL', desc: `user not found`, data: "" });
                }
                else {
                    const user = result.data[0];

                    if (!user.contact.mobile || user.contact.mobile.trim().length === 0) {
                        return res.status(400).json({ status: 'FAIL', desc: `user doesn't have mobile number`, data: "" });
                    }

                    const OTP = generateOTP();

                    let _prms = {
                        params: {
                            "_id": result.data[0]._id,
                            "otp": OTP,
                            "audit.modifiedDt": new Date().toISOString()
                        }
                    }
                    let pLoadResp = await _mUtils.preparePayload('U', _prms);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.headers.orgkey.toLowerCase());
                    if (!(_uResp && _uResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _uResp.desc || "", data: _uResp.data || [] });
                    }
                    return res.status(200).json({ status: 'SUCCESS', desc: `OTP generated successfully`, data: OTP });
                }
            }).catch(async (error) => {
                console.log("error", error)
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: "" });
            });
        }
        else if (req.body.flag == "REQ_OTP") {
            if (!req.body.params || !req.body.params.searchValue || !req.body.params.userName || !req.body.flag || req.body.params.searchValue.trim().length === 0) {
                return res.status(400).json({ status: 'FAIL', desc: 'please provide valid paramters', data: " " })
            }
            const searchValue = req.body.params.searchValue.trim();
            let searchField;
            if (searchValue.includes("@")) {
                searchField = "contact.email";
            }
            else if (/^\d+$/.test(searchValue)) {
                searchField = "contact.mobile"
            }
            else {
                return res.status(400).json({ status: "FAIL", desc: 'please provide email or mobile', data: "" })
            }
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    [searchField]: req.body.params.searchValue,
                    "userName": req.body.params.userName
                },
                "selectors": "-history"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            mongoMapper("ophthamology_ecg_Users", "find", _filter, _dbType).then(async (result) => {
                if (result.data.length == 0) {
                    return res.status(404).json({ status: 'FAIL', desc: `Incorrect mobile number or email`, data: "" });
                }
                else {
                    const OTP = generateOTP();

                    let _prms = {
                        params: {
                            "_id": result.data[0]._id,
                            "otp": OTP,
                            "audit.modifiedDt": new Date().toISOString()
                        }
                    }
                    let pLoadResp = await _mUtils.preparePayload('U', _prms);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.headers.orgkey.toLowerCase());
                    if (!(_uResp && _uResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _uResp.desc || "", data: _uResp.data || [] });
                    }
                    return res.status(200).json({ status: 'SUCCESS', desc: `OTP generated successfully for ${req.body.params.searchValue}`, data: OTP });
                }
            }).catch(async (error) => {
                console.log("error", error)
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: "" });
            });
        }
        else if (req.body.flag == "VALID_OTP") {
            if (!(req.body.params || req.body.params.otp || req.body.flag || req.headers.orgKey || req.body.params.userName)) {
                return res.status(400).json({ status: 'FAIL', desc: 'please provide valid paramters', data: [] })
            }
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "userName": req.body.params.userName,
                    "otp": req.body.params.otp
                },
                "selectors": "-history"
            }
            let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
            mongoMapper("ophthamology_ecg_Users", "find", _filter, _dbType).then(async (result) => {
                if (result.data.length == 0) {
                    return res.status(400).json({ status: 'FAIL', desc: `Invalid OTP`, data: [] });
                }

                let dateDifference = moment(new Date()).diff(moment(result.data[0].audit.modifiedDt).toISOString(), 'minutes')

                if (dateDifference > 2) {
                    return res.status(400).json({ status: 'FAIL', desc: 'OTP has expired', data: [] })
                }

                return res.status(200).json({ status: 'SUCCESS', desc: `otp validated successfully for ${result.data[0].userName}`, data: `${result.data[0].userName}` });
            }).catch(async (error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});



router.post('/update-password', async (req, res) => {
    if (!(req.body.params || req.body.params._id || req.body.params.userName || req.headers.orgkey || req.body.params.newPassword)) {
        return res.status(400).json({ status: 'FAIL', desc: 'please provide valid paramters', data: [] })
    }
    let _filter = {
        "filter": {
            "recStatus": { $eq: true },
            "_id": req.body.params._id,
            "userName": req.body.params.userName
        },
        "selectors": "-history"
    }
    let _dbType = req.headers.orgkey.toLowerCase() || req.tokenData.dbType;
    mongoMapper("ophthamology_ecg_Users", "find", _filter, _dbType).then(async (result) => {
        if (result.data.length == 0) {
            return res.status(404).json({ status: 'FAIL', desc: `user not found`, data: [] });
        }
        else if (result.data[0].password == req.body.params.newPassword) {
            return res.status(400).json({ status: "FAIL", desc: `Choose a password different from current password`, data: [] })
        }

        let _prms = {
            params: {
                "_id": result.data[0]._id,
                "password": req.body.params.newPassword
            }
        }
        let pLoadResp = await _mUtils.preparePayload('U', _prms);
        if (!pLoadResp.success) {
            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
        }
        let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.headers.orgkey.toLowerCase());
        if (!(_uResp && _uResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _uResp.desc || "", data: _uResp.data || [] });
        }

        return res.status(200).json({ status: 'SUCCESS', desc: 'password updated successfully', data: [] })


    }).catch(async (error) => {
        return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
    });;

});


router.post("/insert-draft", async (req, res) => {
    try {
        if (req.body.params.userId && req.body.params.userId.length > 0 && req.body.params.formId && req.body.params.formId.length > 0) {

            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "userId": req.body.params.userId,
                    "formId": req.body.params.formId,
                    "locId": req.tokenData.locId,
                    "UMR": req.body.params.UMR,
                    "visitNo": req.body.params.visitNo,
                    "status": "REQUESTED"
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", 'find', _filter, "", "", "", req.tokenData.orgKey.toLowerCase());
            if (_mResp.success == true && _mResp.data.length > 0) {
                let _data = JSON.parse(JSON.stringify(_mResp.data))
                let _prms = {
                    "params": {
                        "_id": _data[0]._id,
                        "lastSavedAt": new Date().toISOString()
                    }
                }
                pLoadResp = await _mUtils.preparePayload('BW', _prms);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                if (req.body.params.formData) {
                    pLoadResp.payload.pData[0].updateOne.update.$set["formData"] = req.body.params.formData;
                }
                mongoMapper('ophthamology_ecg_drafts', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });
            }
            else {
                req.body.params['orgId'] = req.tokenData.orgId
                req.body.params['locId'] = req.tokenData.locId
                mongoMapper('ophthamology_ecg_drafts', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });
            }

        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Missing Required Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/get-draft", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true }, "status": "REQUESTED" },
            "selectors": "-history"
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("ophthamology_ecg_drafts", "find", _pGData.data, req.tokenData.dbType).then((result) => {

            let _parseResultData = JSON.parse(JSON.stringify(result.data))
            let _indx = 0
            while (_parseResultData.length > _indx) {
                if (_parseResultData[_indx].formData && _parseResultData[_indx].formData.length > 0) {
                    let _labels = _.filter(_parseResultData[_indx].formData, (_fO) => { return _fO.type === 'LABELS' });
                    if (_labels.length > 0) {
                        let _lblIdx = _.findIndex(_parseResultData[_indx].formData, (_fO) => { return _fO.type === 'LABELS' });
                        _parseResultData[_indx].formData.splice(_lblIdx, 1);
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
                            _parseResultData[_indx].formData.push(_lblObj);
                        });
                    }
                }
                else {
                    _parseResultData = []
                }
                _indx++;
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _parseResultData });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/update-draft", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (_cBody.params.formData) {
            delete _cBody.params.formData
        }
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_drafts", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            _cBody.params.revNo = _mResp.data.params.revNo;
            if (req.body.params.status == "SUBMITTED" || req.body.params.status == "REJECTED") {
                _cBody.params['recStatus'] = false
            }
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            if (req.body.params.formData) {
                pLoadResp.payload.pData[0].updateOne.update.$set["formData"] = req.body.params.formData;
            }

            mongoMapper('ophthamology_ecg_drafts', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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

router.post("/generate-report", async (req, res) => {
    try {
        if (req.body.params && req.body.params.toDt && req.body.params.type && req.body.params.fromDt) {
            let fromDt = req.body.params.fromDt.split('T')[0]
            let toDt = req.body.params.toDt ? req.body.params.toDt.split("T")[0] : fromDt
            let _patRegReport;
            if (req.body.params.type === "PatReport") {
                _patRegReport = {
                    "filter": [
                        {
                            $match: {
                                registDt: {
                                    //   $gte: "2024-12-01T00:00:00.000Z",
                                    //   $lte: "2024-12-10T23:59:59.999Z",
                                    $gte: `${fromDt}T00:00:00.000Z`,
                                    $lte: `${toDt}T23:59:59:999Z`,
                                },
                            },
                        },
                        {
                            $facet: {
                                newPatients: [
                                    {
                                        $match: {
                                            registDt: {
                                                // $gte: "2024-12-01T00:00:00.000Z",
                                                // $lte: "2024-12-10T23:59:59.999Z",
                                                $gte: `${fromDt}T00:00:00.000Z`,
                                                $lte: `${toDt}T23:59:59:999Z`,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                overalDetails: {
                                    $concatArrays: [
                                        {
                                            $ifNull: ["$newPatients", []],
                                        },
                                    ],
                                },
                                consolidateData: {
                                    totalPatients: {
                                        $sum: [
                                            {
                                                $size: {
                                                    $ifNull: ["$newPatients", []],
                                                },
                                            },
                                        ],
                                    },
                                    newPatientsCount: {
                                        $size: {
                                            $ifNull: ["$newPatients", []],
                                        },
                                    },
                                },
                                // newPatientsArray: {
                                //   $ifNull: ["$newPatients", []],
                                // },
                            },
                        },
                        {
                            $unwind: "$overalDetails",
                        },
                        {
                            $project: {
                                registDt: "$overalDetails.registDt",
                                umr: "$overalDetails.UMR",
                                titleName: "$overalDetails.titleName",
                                dispName: {
                                    $concat: [
                                        {
                                            $ifNull: [
                                                "$overalDetails.titleName",
                                                "",
                                            ],
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$overalDetails.dispName",
                                                "",
                                            ],
                                        },
                                    ],
                                },
                                dob: "$overalDetails.dob",
                                age: "$overalDetails.age",
                                gender: "$overalDetails.gender",
                                mobile: "$overalDetails.mobile",
                                patProof: "$overalDetails.patProof",
                                patProofTypeName: {
                                    $ifNull: [
                                        "$overalDetails.patProof.typeName",
                                        "",
                                    ],
                                },
                                patProofTypeCd: {
                                    $ifNull: [
                                        "$overalDetails.patProof.typeCd",
                                        "",
                                    ],
                                },
                                patProofId: {
                                    $ifNull: [
                                        "$overalDetails.patProof.patIdVal",
                                        "",
                                    ],
                                },
                                address: {
                                    $concat: [
                                        {
                                            $ifNull: [
                                                "$overalDetails.homeAddress.address1",
                                                "",
                                            ],
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$overalDetails.homeAddress.areaName",
                                                "",
                                            ],
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$overalDetails.homeAddress.cityName",
                                                "",
                                            ],
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$overalDetails.homeAddress.stateName",
                                                "",
                                            ],
                                        },
                                        " ",
                                    ],
                                },
                                addressZipCode: {
                                    $ifNull: [
                                        "$overalDetails.homeAddress.zipCd",
                                        "",
                                    ],
                                },
                                audit: "$overalDetails.audit",
                                consolidateData: 1,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                overalData: {
                                    $push: {
                                        registDt: "$registDt",
                                        umr: "$UMR",
                                        titleName: "$titleName",
                                        dispName: "$dispName",
                                        dob: "$dob",
                                        age: "$age",
                                        gender: "$gender",
                                        mobile: "$mobile",
                                        address: "$address",
                                        addressZipCode: "$addressZipCode",
                                        patProofId: "$patProofId",
                                        patProofTypeName: "$patProofTypeName",
                                        patProofTypeCd: "$patProofTypeCd",
                                        patProof: "$patProof",
                                        audit: "$audit",
                                    },
                                },
                                consolidateData: {
                                    $first: "$consolidateData",
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                reportType: {
                                    $literal: "Patient Registration Report",
                                },
                                overalData: "$overalData",
                                consolidateData: "$consolidateData",
                                // labelNames: {
                                //     registDt: "Registration Date",
                                //     titleName: "Title",
                                //     dispName: "Patient Name",
                                //     dob: "Date Of Birth",
                                //     age: "Age",
                                //     gender: "Gender",
                                //     mobile: "Mobile",
                                //     address: "Address",
                                //     addressZipCode: "Zip Code",
                                //     patProofId: "Patient Proof Id",
                                //     patProofTypeName: "Patient Proof Type",
                                //     patProof: "Patient Proof",
                                //     auditDocumentBy: "Created By",
                                //     auditDocumentDt: "Created Date",
                                //     totalPatients:"Total Patients",
                                //     newPatientsCount:"New Patients Count"
                                // },
                                labelNames: [
                                    {
                                        header: "Registration Date",
                                        order: 1,
                                        visible: true,
                                        key: "registDt"
                                    },
                                    {
                                        header: "Title",
                                        order: 2,
                                        visible: true,
                                        key: "titleName"
                                    },
                                    {
                                        header: "Patient Name",
                                        order: 3,
                                        visible: true,
                                        key: "dispName"
                                    },
                                    {
                                        header: "Date Of Birth",
                                        order: 4,
                                        visible: true,
                                        key: "dob"
                                    },
                                    {
                                        header: "Age",
                                        order: 5,
                                        visible: true,
                                        key: "age"
                                    },
                                    {
                                        header: "Gender",
                                        order: 6,
                                        visible: true,
                                        key: "gender"
                                    },
                                    {
                                        header: "Mobile",
                                        order: 7,
                                        visible: true,
                                        key: "mobile"
                                    },
                                    {
                                        header: "Address",
                                        order: 8,
                                        visible: true,
                                        key: "address"
                                    },
                                    {
                                        header: "Zip Code",
                                        order: 9,
                                        visible: true,
                                        key: "addressZipCode"
                                    },
                                    {
                                        header: "Patient Proof Id",
                                        order: 10,
                                        visible: true,
                                        key: "patProofId"
                                    },
                                    {
                                        header: "Patient Proof Type",
                                        order: 11,
                                        visible: true,
                                        key: "patProofTypeName"
                                    },
                                    // {
                                    //     header:"Patient Proof",
                                    //     order:12,
                                    //     visible:true,
                                    //     key:"patProof"
                                    // },
                                    {
                                        header: "Created By",
                                        order: 13,
                                        visible: true,
                                        key: "audit.DocumentBy"
                                    },
                                    {
                                        header: "Created Date",
                                        order: 14,
                                        visible: true,
                                        key: "audit.DocumentDt"
                                    },
                                    {
                                        header: "Total Patients",
                                        order: 15,
                                        visible: true,
                                        key: "consolidateData.totalPatients"
                                    },
                                    {
                                        header: "New Patients Count",
                                        order: 16,
                                        visible: true,
                                        key: "consolidateData.newPatientsCount"
                                    },
                                ],
                            },
                        },
                    ]
                }
            }

            await mongoMapper("ophthamology_ecg_patients", "aggregation", _patRegReport, req.tokenData.dbType).then(async (_resp) => {
                if (!_resp.data || _resp.data.length == 0) {
                    return res.status(400).json({ status: 'FAIL', desc: 'Error While Getting Patients', data: [] });
                }
                else {
                    return res.status(200).json({ status: 'SUCCESS', desc: '', data: _resp.data })
                }
            }).catch(async (error) => {
                return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required Parameters Are Missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});


router.post("/insert-speciality", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_Speciality', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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
})

router.post("/insert-specializations", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_Specializations', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

router.post("/insert-address", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_Address', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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


router.post("/insert-users", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_Users', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

router.post('/get-all-masters', async (req, res) => {
    try {
        let _filter = {
            "filter": {
            },
            "selectors": "-history -audit"
        };
        let _masterData = {};
        for (let _mO of _masters) {
            _masterData[_mO.key] = [];
            let _mResp = await _mUtils.commonMonogoCall(`ophthamology_ecg_${_mO.coll}`, "find", _filter, "", "", "", req.tokenData.dbType)
            if ((_mResp && _mResp.success)) {
                _masterData[_mO.key] = _mResp.data || [];
                if (_mO.key == "genders") {
                    Object.keys(_masterData).forEach((key) => {
                        _masterData[key] = _masterData[key].sort((a, b) => a.displayOrder - b.displayOrder)
                    })
                }
                else {
                    _masterData[_mO.key] = _mResp.data || [];
                }

            }
        }
        return res.status(200).json({ success: true, status: 200, desc: '', data: _masterData });

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }


});

router.post("/get-potential-matches", async (req, res) => {
    try {
        const { dispName, gender, dateOfBirth, mobile } = req.body.params;
        let _filter = {
            "filter": { "contact.mobile": mobile },
            "selectors": "-history",
            "populate": [
                { 'path': 'gender', 'select': '_id code name' },
                { 'path': 'title', 'select': '_id code name' },
                { 'path': 'bloodGroup', 'select': '_id code name' },
                { 'path': 'abhaCard', 'select': '' },
                { 'path': 'emergencyContact.relationship', 'select': '_id code name' },
                { 'path': 'chiefComplaint', 'select': '_id code name' },
                { 'path': 'languages', 'select': '_id code name' },
                { 'path': 'prefferedLanquage', 'select': '_id code name' },
                { 'path': 'nationality', 'select': '_id code name' },
                { 'path': 'religion', 'select': '_id code name' },
                { 'path': 'photo', 'select': '' },
                { 'path': 'signature', 'select': '' },
                { 'path': 'visits', 'select': '' }
            ]
        }
        let potentialMatches = await _mUtils.commonMonogoCall("ophthamology_ecg_Patients", 'find', _filter, "", "", "", req.tokenData.dbType);
        if (!(potentialMatches && potentialMatches.success)) {
            return res.status(400).json({ success: false, status: 400, desc: potentialMatches.desc || "", data: potentialMatches.data || [] });
        }
        else if (potentialMatches.data.length === 0) {
            return res.status(200).json({ success: true, status: 200, desc: "no matched records with same mobile number", data: [] });
        }

        const genderMatchedRecors = potentialMatches.data.filter(record => record.gender.code === gender);
        if (genderMatchedRecors.length === 0) {
            return res.status(200).json({ success: true, status: 200, desc: "no gender match.", data: [] });
        }

        const dobYear = new Date(dateOfBirth).getFullYear();
        const dobMatchedRecords = genderMatchedRecors.filter(record => {
            const recordDobYear = new Date(record.dateOfBirth).getFullYear();
            return Math.abs(recordDobYear - dobYear) <= 2;
        });

        if (dobMatchedRecords.length === 0) {
            return res.status(200).json({ success: true, status: 200, desc: "no DOB match.", data: [] });
        }

        const namesArray = dobMatchedRecords.map(record => record.dispName);
        const similarityResults = stringSimilarity.findBestMatch(dispName, namesArray)
        const threshold = 0.6
        const bestMatch = similarityResults.bestMatch;
        if (bestMatch.rating >= threshold) {
            const finalMatch = dobMatchedRecords.find(record => record.dispName === bestMatch.target);
            if (finalMatch) {
                return res.status(200).json({ success: true, status: 200, desc: "", data: [finalMatch] });
            } else {
                return res.status(200).json({ success: true, status: 200, desc: "no existing record", data: [] });
            }
        }
        else {
            return res.status(200).json({ success: true, status: 200, desc: "no existing record", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});



router.post("/insert-glass-prescriptions", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_GlassPrescriptions', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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

router.post("/get-glass-prescriptions", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.flag) {

            let _userFilter = {
                "filter": {
                    "recStatus": true,
                    "_id": req.tokenData.userId
                },
                "selectors": "locations linkedFacilities"
            }
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "find", _userFilter, "", "", "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "User does not exist", data: [] });
            }
            let _userLocData = _mResp.data[0].locations.filter(_f => _f.locId === req.tokenData.locId);
            if (!(_userLocData && _userLocData.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: "User/Location miss matched", data: [] });
            }

            let _status = _approvalStatus.filter(_o => _o.flag === req.body.params.flag);
            if (!(_status && _status.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: "Provided Flag is not matched..", data: [] });
            }
            let _params = {};
            if (_userLocData && _userLocData[0] && (_userLocData[0].role === "PHC User" || _userLocData[0].role === "CHC User")) {
                _params["prescribedLocation"] = req.tokenData.locId;

            }
            else if (_userLocData && _userLocData[0] && (_userLocData[0].role === "CHC Nodal Officer")) {
                let _locFilter = {
                    "filter": {
                        "recStatus": true,
                        "_id": req.tokenData.locId
                    },
                    "selectors": "linkedFacilities"
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _locFilter, "", "", "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "User/Location miss matched", data: [] });
                }
                let _locations = JSON.parse(JSON.stringify(_mResp.data[0].linkedFacilities));
                let _mappedLoc = _locations.map(_l => _l.locId);
                _mappedLoc.push(req.tokenData.locId);
                _params["prescribedLocation"] = { $in: _mappedLoc };


            }

            _params['status'] = _status[0].status;
            if (req.body.params.flag === 'CHC_ALL') {
                _params['status'] = { $in: _status[0].status };
            }
            let _filter = {
                "filter": _params,
                "selectors": '-manufacturerActions',
                "populate": [
                    { 'path': 'patient', 'select': '_id UMR dispName dateOfBirth contact.mobile homeAddress', 'populate':[ {'path': 'gender', 'select':''}, {'path': 'title', 'select':''}  ] },
                    {
                        'path': 'consultation', 'select': '_id locId visitType dateTime',
                        "populate": {
                            'path': "doctor",
                            'select': 'docCode docTypeName dispName'
                        }
                    },
                    { 'path': 'prescribedLocation', 'select': '_id locName locType' }
                ]
            }

            let _pGData = await prepareGetPayload(_filter);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper('ophthamology_ecg_GlassPrescriptions', "find", _pGData.data, req.tokenData.dbType).then((result) => {
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

router.post("/update-glass-prescriptions-old", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            // let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            // if (!(_mResp && _mResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            // }
            let _output = [];
            if (req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") {
                // _cBody.params.revNo = _mResp.data.params.revNo;
                let _locFilter = {
                    "filter": {
                        "recStatus": true,
                        "_id": req.tokenData.locId
                    },
                    "selectors": "linkedFacilities"
                }
                // let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Users", "find", _userFilter, "", "", "", req.tokenData.dbType)
                // if (!(_uResp && _uResp.success && _uResp.data && _uResp.data.length > 0)) {
                //     return res.status(400).json({ success: false, status: 400, desc: _uResp.desc || "User does not exist", data: [] });
                // }
                let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _locFilter, "", "", "", req.tokenData.dbType)
                if (!(_uResp && _uResp.success && _uResp.data && _uResp.data.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: _uResp.desc || "User/Location miss matched", data: [] });
                }
                let _userLocData = JSON.parse(JSON.stringify(_uResp.data[0].linkedFacilities)).filter(_f => _f.locId === req.body.params.prescribedLocation);
                if (!(_userLocData && _userLocData.length > 0)) {
                    return res.status(400).json({ success: false, status: 400, desc: "User/Location miss matched", data: [] });
                }
            }
            let _status;
            if (_cBody.params.approvals && typeof _cBody.params.approvals == "object" && Object.keys(_cBody.params.approvals).length > 0) {
                _.each(_cBody.params.approvals, (_aVal, _aKey) => {
                    if (_aKey !== "_id") {
                        if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") || (_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                            if (_aKey != "_id" && typeof _aVal == "object") {
                                _aVal['location'] = req.tokenData.locId;
                                _aVal['requestReceivedDateTime'] = new Date().toISOString();
                                if (_aVal.approved) {
                                    if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                        _status = "Pending for State Approval";
                                    }
                                    else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                        _status = "Approved";
                                    }
                                    // _status = req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" && _aKey == "state" ? "Approved" : req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" ? "Pending for State Approval" : "Pending for CHC Approval"
                                    _aVal['approvedDateTime'] = new Date().toISOString();
                                    _aVal['approvedBy'] = req.tokenData.userId;
                                }
                                else if (_aVal.rejected) {
                                    if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                        _status = "Reject at CHC Level";
                                    }
                                    else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                        _status = "Reject at State Level";
                                    }

                                    _aVal['rejectedDateTime'] = new Date().toISOString();
                                    _aVal['rejectedBy'] = req.tokenData.userId;
                                }
                            }
                        }
                        else {
                            _output.push({ success: false, desc: "Role Name is Mismatched for Approval/Reject", data: [] })
                        }
                    }

                })

            }
            let _final = _.filter(_output, (_resp) => { return !_resp.success })
            if (_final && _final.length > 0) {
                return res.status(400).json({ success: false, status: 400, desc: _final[0].desc, data: [] });
            }
            _cBody.params['status'] = _status;
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            mongoMapper('ophthamology_ecg_GlassPrescriptions', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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


async function updateGlassPrescriptions_bkp(_flag, _data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            if(_flag == "PRCPTN_APPR_REJ"){
            if (_data[_idx]._id) {
                let _userResp = true;
                let _userLocDataResp = true;
                if (req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") {
                let _locFilter = {
                    "filter": {
                        "recStatus": true,
                        "_id": req.tokenData.locId
                    },
                    "selectors": "linkedFacilities"
                }
                let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _locFilter, "", "", "", req.tokenData.dbType)
                if (!(_uResp && _uResp.success && _uResp.data && _uResp.data.length > 0)) {
                    _userResp = false
                }
                let _userLocData = JSON.parse(JSON.stringify(_uResp.data[0].linkedFacilities)).filter(_f => _f.locId === _data[_idx].prescribedLocation);
                if (!(_userLocData && _userLocData.length > 0)) {
                    _userLocDataResp = false;
                }
                }
                if (_userResp && _userLocDataResp) {
                    let _status;
                    let _batchNo = "";
                    if (_data[_idx].approvals && typeof _data[_idx].approvals == "object" && Object.keys(_data[_idx].approvals).length > 0) {
                        _.each(_data[_idx].approvals, (_aVal, _aKey) => {
                            if (_aKey !== "_id") {
                                if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") || (_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer") || (_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureradmin")) {
                                    if (_aKey != "_id" && typeof _aVal == "object") {
                                        _aVal['location'] = req.tokenData.locId;
                                        _aVal['requestReceivedDateTime'] = new Date().toISOString();
                                        if (_aVal.approved) {
                                            if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                                _status = "Pending for State Approval";
                                            }
                                            else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                                _status = "Approved";
                                                _batchNo = `${req.tokenData.orgKey.toUpperCase()}${new Date().toISOString().split("T")[0].split("-").join("")}`
                                            }
                                            else if ((_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureruser")) {
                                                _status = "Sent to Manufacturer";
                                            }
                                            // _status = req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" && _aKey == "state" ? "Approved" : req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" ? "Pending for State Approval" : "Pending for CHC Approval"
                                            _aVal['approvedDateTime'] = new Date().toISOString();
                                            _aVal['approvedBy'] = req.tokenData.userId;
                                        }
                                        else if (_aVal.rejected) {
                                            if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                                _status = "Reject at CHC Level";
                                            }
                                            else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                                _status = "Reject at State Level";
                                            }
                                            else if ((_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureruser")) {
                                                _status = "Reject at Manufacturer";
                                            }
                                            _aVal['rejectedDateTime'] = new Date().toISOString();
                                            _aVal['rejectedBy'] = req.tokenData.userId;
                                        }
                                    }
                                }
                                else {
                                    _output.push({ success: false, _id: _data[_idx]._id, desc: "Role Name is Mismatched for Approval/Reject", data: [] })
                                }
                            }
                        })
                    }
                    _data[_idx]['status'] = _status;
                    _data[_idx]['batchNo'] = _batchNo;
                    let _updtprms = {
                        "params": _data[_idx]
                    }
                    let _gpLoadResp = await _mUtils.preparePayload('BW', _updtprms);
                    if (!_gpLoadResp.success) {
                        _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gpLoadResp.desc || "", data: [] });
                    }

                    let _gResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "bulkWrite", _gpLoadResp.payload, "", "", "", req.tokenData.dbType)
                    if (!_gResp || !_gResp.success) {
                        _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gResp.desc || "", data: [] });
                    }
                    else {
                        _output.push({ success: true, _id: _data[_idx]._id, status: 200, desc: "Updated Successfully", data: _gResp.data });
                    }
                }
                else {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "User/Location miss matched", data: [] })
                }
                }
                else {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "Require Parameters ..", data: [] });
                }
            }
            else if(_flag == "MANFCT_RECV"){
                if(_data[_idx].glassPrescriptionId && _data[_idx].glassPrescriptionId.length > 0){
                    
                // let _batchNumber = `${new Date().toISOString().split("T")[0].split("-").join("")}`
                // _data[_idx]['status'] =  "Sent to Manufacturer"
                let _manfctUpdtprms = {
                    "params": {
                        "_id": _data[_idx].glassPrescriptionId,
                        "status": "Sent to Manufacturer"
                    }
                }
                _mpLoadResp = await _mUtils.preparePayload('BW', _manfctUpdtprms);
                if (!_mpLoadResp.success) {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _mpLoadResp.desc || "", data: [] });
                }

                let _gResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "bulkWrite", _mpLoadResp.payload, "", "", "", req.tokenData.dbType)
                if (!_gResp || !_gResp.success) {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gResp.desc || "", data: [] });
                }
                else {
                    _output.push({ success: true, _id: _data[_idx]._id, status: 200, desc: "Updated Successfully", data: _gResp.data });
                }
            }
            else {
                _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "Require Parameters ..", data: [] });
            }
            }
            
            _idx = _idx + 1;
            await updateGlassPrescriptions(_flag, _data, _idx, _output, req);
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

async function updateGlassPrescriptions(_flag, _data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            if (_flag == "PRCPTN_APPR_REJ") {
                if (_data[_idx]._id) {
                    let _userResp = true;
                    let _userLocDataResp = true;
                    let _role = true;
                    if (req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") {
                        let _locFilter = {
                            "filter": {
                                "recStatus": true,
                                "_id": req.tokenData.locId
                            },
                            "selectors": "linkedFacilities"
                        }
                        let _uResp = await _mUtils.commonMonogoCall("ophthamology_ecg_Locations", "find", _locFilter, "", "", "", req.tokenData.dbType)
                        if (!(_uResp && _uResp.success && _uResp.data && _uResp.data.length > 0)) {
                            _userResp = false
                        }
                        else{
                            let _userLocData = JSON.parse(JSON.stringify(_uResp.data[0].linkedFacilities)).filter(_f => _f.locId === _data[_idx].prescribedLocation);
                            let _mappedLoc = _userLocData.map(_l => _l.locId);
                            _mappedLoc.push(req.tokenData.locId);
                            if (!(_userLocData && _mappedLoc.length > 0)) {
                                _userLocDataResp = false;
                            }
                        }
                        
                    }
                    if (_userResp && _userLocDataResp) {
                        let _status;
                        let _batchNo = "";
                        if (_data[_idx].approvals && typeof _data[_idx].approvals == "object" && Object.keys(_data[_idx].approvals).length > 0) {
                            _.each(_data[_idx].approvals, (_aVal, _aKey) => {
                                if (_aKey !== "_id") {
                                    if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer") || (_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer") || (_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureradmin")) {
                                        if (_aKey != "_id" && typeof _aVal == "object") {
                                            _aVal['location'] = req.tokenData.locId;
                                            _aVal['requestReceivedDateTime'] = new Date().toISOString();
                                            if (_aVal.approved) {
                                                if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                                    _status = "Pending for State Approval";
                                                }
                                                else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                                    _status = "Approved";
                                                    _batchNo = `${req.tokenData.orgKey.toUpperCase()}${new Date().toISOString().split("T")[0].split("-").join("")}`
                                                }
                                                else if ((_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureruser")) {
                                                    _status = "Sent to Manufacturer";
                                                }
                                                // _status = req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" && _aKey == "state" ? "Approved" : req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer" ? "Pending for State Approval" : "Pending for CHC Approval"
                                                _aVal['approvedDateTime'] = new Date().toISOString();
                                                _aVal['approvedBy'] = req.tokenData.userId;
                                            }
                                            else if (_aVal.rejected) {
                                                if ((_aKey == "chc" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "chcnodalofficer")) {
                                                    _status = "Reject at CHC Level";
                                                }
                                                else if ((_aKey == "state" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "statenodalofficer")) {
                                                    _status = "Reject at State Level";
                                                }
                                                else if ((_aKey == "manufacturer" && req.tokenData.roleName.toLowerCase().split(" ").join("") == "manufactureruser")) {
                                                    _status = "Reject at Manufacturer";
                                                }
                                                _aVal['rejectedDateTime'] = new Date().toISOString();
                                                _aVal['rejectedBy'] = req.tokenData.userId;
                                            }
                                        }
                                    }
                                    else {
                                        _role = false
                                        _output.push({ success: false, _id: _data[_idx]._id, desc: "Role Name is Mismatched for Approval/Reject", data: [] })
                                    }
                                }
                            })
                        }
                        if(_role == true){
                            _data[_idx]['status'] = _status;
                            _data[_idx]['batchNumber'] = _batchNo;
                            let _updtprms = {
                                "params": _data[_idx]
                            }
                            let _gpLoadResp = await _mUtils.preparePayload('BW', _updtprms);
                            if (!_gpLoadResp.success) {
                                _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gpLoadResp.desc || "", data: [] });
                            }
    
                            let _gResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "bulkWrite", _gpLoadResp.payload, "", "", "", req.tokenData.dbType)
                            if (!_gResp || !_gResp.success) {
                                _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gResp.desc || "", data: [] });
                            }
                            else {
                                _output.push({ success: true, _id: _data[_idx]._id, status: 200, desc: "Updated Successfully", data: _gResp.data });
                            }
                        }
                        
                    }
                    else {
                        _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "User/Location miss matched", data: [] })
                    }
                }
                else {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "Require Parameters ..", data: [] });
                }
            }
            else if (_flag == "MANFCT_RECV") {
                if (_data[_idx].glassPrescriptionId && _data[_idx].glassPrescriptionId.length > 0) {

                    // let _batchNumber = `${new Date().toISOString().split("T")[0].split("-").join("")}`
                    // _data[_idx]['status'] =  "Sent to Manufacturer"
                    let _manfctUpdtprms = {
                        "params": {
                            "_id": _data[_idx].glassPrescriptionId,
                            "status": "Sent to Manufacturer"
                        }
                    }
                    _mpLoadResp = await _mUtils.preparePayload('BW', _manfctUpdtprms);
                    if (!_mpLoadResp.success) {
                        _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _mpLoadResp.desc || "", data: [] });
                    }

                    let _gResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "bulkWrite", _mpLoadResp.payload, "", "", "", req.tokenData.dbType)
                    if (!_gResp || !_gResp.success) {
                        _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: _gResp.desc || "", data: [] });
                    }
                    else {
                        _output.push({ success: true, _id: _data[_idx]._id, status: 200, desc: "Updated Successfully", data: _gResp.data });
                    }
                }
                else {
                    _output.push({ success: false, _id: _data[_idx]._id, status: 400, desc: "Require Parameters ..", data: [] });
                }
            }

            _idx = _idx + 1;
            await updateGlassPrescriptions(_flag, _data, _idx, _output, req);
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


router.post("/update-glass-prescriptions", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _output = [];
        if (_cBody.params && !Array.isArray(_cBody.params)) {
            return res.status(400).json({ success: false, status: 400, desc: "Required Parameters are Missing" });
        }
        let _updtResp = await updateGlassPrescriptions("PRCPTN_APPR_REJ",_cBody.params, 0, _output, req)

        return res.status(200).json({ success: true, status: 200, desc: "updated Successfully", data: _updtResp.data });


    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});


router.post("/insert-manufacturers", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            mongoMapper('ophthamology_ecg_Manufacturers', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
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


router.post("/get-manufacturers", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = {
                "filter": {
                    recStatus: { $eq: true }
                }
            }

            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper('ophthamology_ecg_Manufacturers', "find", _pGData.data, req.tokenData.dbType).then((result) => {
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


router.post("/insert-visit-transactions", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.patient) {
            if (req.body.params.prescription && typeof req.body.params.prescription == "object" && Object.keys(req.body.params.prescription > 0)) {
                if (req.body.params.prescription.consultation && req.body.params.prescription.consultation.length > 0 && req.body.params.prescription.prescribedLocation && req.body.params.prescription.prescribedLocation.length > 0) {
                    req.body.params.prescription['approvals'] = {}
                    req.body.params.prescription['approvals']['approved'] = true
                    req.body.params.prescription['approvals']['location'] = req.body.params.prescription.prescribedLocation
                    req.body.params.prescription['approvals']['approvedDateTime'] = new Date().toISOString()
                    req.body.params.prescription['approvals']['approvedBy'] = req.tokenData.userId;
                    req.body.params.prescription['approvals']['requestReceivedDateTime'] = new Date().toISOString();
                    req.body.params.prescription['patient'] = req.body.params.patient
                    req.body.params.prescription['audit'] = req.body.params.audit
                    let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "insertMany", req.body.params.prescription, "", "", "", req.tokenData.dbType)
                    if (!(_mResp && _mResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                    }
                    else {
                        req.body.params.prescription = _mResp.data[0]._id
                    }
                }
                else {
                    return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
                }
            }
            mongoMapper('ophthamology_ecg_VisitTransactions', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
                if (result.status != "SUCCESS") {
                    return res.status(400).json({ success: false, status: 400, desc: "Error While Inserting Transaction", data: [] });
                }
                let _obj = {
                    "visitTransactions": result.data[0]._id
                };
                let _patResp = await updateVisitsOrBillData(req.body.params.UMR, "VISITS_TRAN", _obj, req);
                if (!(_patResp && _patResp.success)) {
                    return res.status(400).json({ success: false, desc: "Error Occured while updating Visits details to Patient", data: [] });
                }
                let visitObj = {
                    "visitTransaction": result.data[0]._id,
                    "documentId": result.data[0].documentId
                }

                let updateAppointmentDoc = await updateVisitsOrBillData(req.body.params.UMR, "AAPT_UPDT", visitObj, req)
                if (!(updateAppointmentDoc && updateAppointmentDoc.success)) {
                    return res.status(400).json({ success: false, desc: "Error Occured while updating appointment details to Patient", data: [] });
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



router.post("/get-visit-transactions", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = {
                "filter": {
                    recStatus: { $eq: true }
                },
                "populate": [
                    { 'path': 'patient', 'select': '-abhaJson' },
                    { 'path': 'doctor', 'select': '_id dispName qualification designation registrationNo signature', 'populate': [{ 'path': 'speciality', 'select': 'name' }, { 'path': 'specializations', 'select': 'name' }] },
                    { 'path': 'prescription', 'select': '-approvals -patient', 'populate': [{ 'path': 'consultation', 'select': '' }] },
                ]
            }

            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper('ophthamology_ecg_VisitTransactions', "find", _pGData.data, req.tokenData.dbType).then((result) => {
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

router.post("/get-visit-transactions-by-umr", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = {
                "filter": {
                    recStatus: { $eq: true }
                },
                "selectors": "visitTransactions UMR",
                "populate": [
                    {
                        'path': 'visitTransactions', 'select': '',
                        'populate': [
                            { 'path': 'prescription', 'select': '-approvals -patient', 'populate': [{ 'path': 'consultation', 'select': '' }] },
                            {
                                'path': 'doctor', 'select': '_id dispName qualification designation registrationNo signature',
                                'populate': [{ 'path': 'speciality', 'select': 'name' }, { 'path': 'specializations', 'select': 'name' }]
                            }
                        ]
                    },
                ]
            }

            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper('ophthamology_ecg_Patients', "find", _pGData.data, req.tokenData.dbType).then((result) => {
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

router.post("/update-visit-transaction", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_VisitTransactions", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            _cBody.params.revNo = _mResp.data.params.revNo;

            if (req.body.params.prescription && typeof req.body.params.prescription == "object" && Object.keys(req.body.params.prescription > 0)) {
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "findById", req.body.params.prescription._id, "", "", "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
                let _glsParams = {
                    "params": {}
                }
                _glsParams['params'] = req.body.params.prescription
                let _ploadresp = await _mUtils.preparePayload('BW', _glsParams);
                if (!_ploadresp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: _ploadresp.desc || "", data: [] });
                }
                let _gResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "bulkWrite", _ploadresp.payload, "", "", "", req.tokenData.dbType)
                if (!(_gResp && _gResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _gResp.desc || "", data: _gResp.data || [] });
                }
                delete _cBody.params['prescription']
            }
            pLoadResp = await _mUtils.preparePayload('BW', _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            mongoMapper('ophthamology_ecg_VisitTransactions', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
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


router.post("/insert-glass-prescription-receival", async (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.length > 0) {
            let _output = []
            // for(let _data of req.body.params){
            //     _data['batchNo'] = `${req.tokenData.orgKey.toUpperCase()}${new Date().toISOString().split("T")[0].split("-").join("")}`
            //     _data['receivedDateTime'] = new Date().toISOString()
            // }
            
            mongoMapper('ophthamology_ecg_GlassOrdersReceivals', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
                let _updtResp = await updateGlassPrescriptions("MANFCT_RECV",req.body.params, 0, _output, req)
                if(!_updtResp.success){
                    return res.status(400).json({ success: false, status: 400, desc: _updtResp, data: _updtResp.data });
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

router.post("/get-glass-prescription-receival", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            let _filter = {
                "filter": {
                    recStatus: { $eq: true }
                },
                "populate":[
                    { 'path':"glassPrescriptionId", 'select':"" },
                    { 'path':"manufacturerId", 'select':"" },
                    // { 'path':"patient", 'select':"" },
                    // { 'path':"consultation", 'select':"" },
                    { 'path':"prescribedLocation", 'select':"" },
                    { 'path':"receivedBy", 'select':"" },
                ]
            }

            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }

            mongoMapper('ophthamology_ecg_GlassOrdersReceivals', "find", _pGData.data, req.tokenData.dbType).then((result) => {
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



module.exports = router;
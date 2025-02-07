const express = require("express");
const router = express.Router();
const _ = require("underscore");
const axios = require("axios");
const schedule = require("node-schedule");

const appConfig = require("../../app-config");
const mongoDbUrl = "http://10.15.79.47:10006/tokenManagement/api/insert-token";

let _count = 0;
let _recCount = 0;
let rearrageAt = 3;


/*
const job = schedule.scheduleJob("* * * * *", async function () {
     //will run every minute
   console.log("running a task every minute");
   await readAndDelTokensData();
   console.log("running a task every minute after");
 });

*/

//will run every day at 12:00 AM
const job1 = schedule.scheduleJob("0 0 0 * * *", async function () {
    await readAndDelTokensData();
});

/*
const job = schedule.scheduleJob("* 5 17 * * *", async() => {
    console.log(new Date().toLocaleString());
    await readAndDelTokensData();
  });
  */
function insertRecordsRedis(key, data) {
    return new Promise((resolve, reject) => {
        if (appConfig.HOST) {
            // key = 'TOKENS';
            axios.post(appConfig.REDIS_URL + "putkey", { "key": key, "data": JSON.stringify(data) }).then((resp) => {
                // console.log(resp);
                resolve({ "success": true, "data": resp.data });
            }).catch((error) => {
                resolve({ "success": false, "data": [], "desc": JSON.stringify(error) });
            });
        }
        else reject(new Error("Host and eventId not found"));
    });
};


function getRecords(key) {
    return new Promise((resolve, reject) => {
        //   key = 'TOKENS';
        axios.post(appConfig.REDIS_URL + "getKey", { key: key }).then((resp) => {
            if (resp && resp.status == 200 && resp.data)
                resolve({ "success": true, "data": resp.data || [] });
            else resolve({ "success": true, "data": [] });
        }).catch((err) => {
            resolve({ "success": false, "data": [], "desc": JSON.stringify(err) });
        });
    });
};


async function readAndDelTokensData() {

    let _resp = await insertIntoMongoDb();
    //console.log("mongo-status", _resp);
    if (_resp && _resp.status && _resp.status === 'SUCCESS') {
        // let _records = await redisApiCall('TOKENS', 'resetKey');
        let _tokenArr = [];
        let _records = await insertRecordsRedis('TOKENS', _tokenArr);
        //  console.log("redisinsert", _records)
        if (!_records.success) {
            return {
                "status": "FAIL",
                "data": [],
                "description": `Error occured to Delete tokens from Redis., Error:- ${_records.desc}`
            }
        }
        return {
            "status": "SUCCESS",
            "data": [],
            "description": "Deleted Successfully.,"
        }
    }
}

async function insertIntoMongoDb() {
    try {
        return new Promise(async (resolve, reject) => {
            let _records = await getRecords('TOKENS');
            if (!_records.success) {
                resolve({
                    "status": "FAIL",
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _tokenData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            // console.log("tokens", _tokenData)
            if (_tokenData && _tokenData.length > 0) {
                let _axiosResp = await axiosFun(mongoDbUrl, _tokenData);
                //console.log("_axiosResp",_axiosResp);
                resolve({
                    "status": "SUCCESS"
                });
            }
            else {
                resolve({
                    "status": "SUCCESS"
                });
            }
        })
    }
    catch (err) {
        return {
            status: 'FAIL'
        }
    }

}

function redisApiCall(key, method) {
    return new Promise((resolve, reject) => {
        //   key = 'TOKENS';
        //console.log("appConfig.REDIS_URL + method",appConfig.REDIS_URL_IP + method)
        axios.post(appConfig.REDIS_URL_IP + method, { key: key }).then((resp) => {
            //console.log("redis-stat", resp.data);
            if (resp && resp.status == 200 && resp.data)
                resolve({ "success": true, "data": resp.data || [] });
            else resolve({ "success": true, "data": [] });
        }).catch((err) => {
            resolve({ "success": false, "data": [], "desc": JSON.stringify(err) });
        });
    });
}


function axiosFun(_url, _params) {
    return new Promise((resolve, reject) => {
        axios.post(_url, _params).then((resp) => {
            if (resp && resp.status == 200 && resp.data)
                resolve({ "success": true, "data": resp.data || [] });
            else resolve({ "success": true, "data": [] });
        }).catch((err) => {
            resolve({ "success": false, "data": [], "desc": JSON.stringify(err) });
        });
    });
}



router.get('/', (req, res) => {
    return res.send("Working");
});

//Create New Client
router.post('/insert-client', async (req, res) => {
    try {
        if (req.body.orgKey && req.body.orgName && req.body.locName) {
            let _records = await getRecords('CLIENTS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _clientsData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];

            if (req.body.transType && req.body.transType === 'U' && req.body.orgId) {
                let _filtData = _.filter(_clientsData, (clnt) => { return clnt.orgId == req.body.orgId });
                if (_filtData.length == 0) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `No Client is available for this ${req.body.orgId} key..`
                    });
                };
                let _clientObj = _filtData[0];
                _.each(_clientObj, (obj) => {
                    if (obj && obj == 'locations') {
                        _.each(obj['locations'], (loc) => {
                            obj['locations'][loc] = req.body[loc] ? req.body[loc] : obj['locations'][loc];
                        });
                        _clientObj[obj] = req.body[obj];
                    }
                    else {
                        _clientObj[obj] = req.body[obj] ? req.body[obj] : _clientObj[obj];
                    }
                })
                let _resp = await insertRecordsRedis('CLIENTS', _clientsData);
                if (!_resp.success) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Error occured while insert user to Redis., Error:- ${_resp.desc}`
                    });
                }
                return res.status(200).send({
                    "status": "SUCCESS",
                    "data": _filtData || {}
                });
            }
            let _count = _clientsData.length + 1;
            let _clientObj = {
                "orgId": _count,
                "orgName": req.body.orgName || "",
                "address": req.body.address || "",
                "orgKey": req.body.orgKey || "",
                "orgLogo": req.body.orgLogo || "",
                "locations": [{
                    "locId": 1,
                    "locName": req.body.locName || "",
                    "address": req.body.locAddr || ""

                }]
            };
            _clientsData.push(_clientObj);
            let _redisResp = await insertRecordsRedis('CLIENTS', _clientsData);
            if (!_redisResp.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured while insert user to Redis., Error:- ${_redisResp.desc}`
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": [],
                "description": ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

// Get Client Data
router.post('/get-client-data', async (req, res) => {
    try {
        let _records = await getRecords('CLIENTS');
        if (!_records.success) {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
            });
        }
        let _clientsData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
        if (req.body.orgKey) {
            let _filtData = _.filter(_clientsData, (clnt) => { return clnt.orgKey == req.body.orgKey });
            if (_filtData.length == 0) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `No Client is available for this ${req.body.orgKey} key..`
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": _filtData || {}
            });
        }
        return res.status(200).send({
            "status": "SUCCESS",
            "data": _clientsData || []
        });

    } catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }

});

// Generate new Token
router.post('/generate-token', async (req, res) => {
    try {
        if (req.body.orgId && req.body.locId && req.body.tokenType) {
            let _tokens = [];
            let _records = await getRecords('TOKENS');

            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            else {
                let _tokenArr = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
                let _orgLocToknData = _.filter(_tokenArr, (item) => { return item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) });
                let _filtrData = _.filter(_orgLocToknData, (item) => { return item.recType == req.body.tokenType });
                let _count = _filtrData.length + 1;
                let _newToken = {
                    "orgId": req.body.orgId,
                    "locId": req.body.locId,
                    "recId": (_orgLocToknData.length + 1),
                    "recType": req.body.tokenType,
                    "tokenNo": _count > 9 ? `0${_count}` : `00${_count}`,
                    "recBy": 'KIOSK',
                    "recDt": new Date(),
                    "status": "IN-PROGRESS",
                    "actionBy": "",
                    "actionDt": "",
                    "assignedTo": "",
                    "assignedOperId": "",
                    "assignedDt": "",
                    "counter": "",
                    "patientInfo": {
                        "mobile": req.body.mobile,
                        "name": req.body.patientName || "",
                        "age": req.body.age || "",
                        "gender": req.body.gender || ""
                    },
                    "skippedCount": 0,
                    "skippedDetails": []
                }
                _tokenArr.push(_newToken);
                let _redisResp = await insertRecordsRedis('TOKENS', _tokenArr);
                //console.log("_redisResp", _redisResp);
                if (!_redisResp.success) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Error occured while insert records to Redis., Error:- ${_redisResp.desc}`
                    });
                }
                return res.status(200).send({
                    "status": "SUCCESS",
                    "data": _newToken || {}
                });
            }
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

//Operator sign-in
router.post('/sign-in', async (req, res) => {
    try {
        if (req.body.userName && req.body.password && (req.body.counter || req.body.counter == 0)) {
            let _records = await getRecords('USERS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _usersArr = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            let _userCounterValidatin = _.filter(_usersArr, (item) => { return (item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) && item.counter == req.body.counter && item.status !== "") });
            if (_userCounterValidatin.length > 0) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `This Counter was already logined with ${_userCounterValidatin[0].userName}`
                });
            }
            let _userFiltered = _.filter(_usersArr, (item) => { return (item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) && item.userName == req.body.userName.trim() && item.password == req.body.password.trim()) });
            if (!(Object.keys(_userFiltered) && Object.keys(_userFiltered).length > 0)) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Invalid credentials.,`
                });
            }
            let _userIndex = _.findLastIndex(_usersArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), userId: parseInt(_userFiltered[0].userId) });
            _usersArr[_userIndex]["loggedInTime"] = new Date();
            _usersArr[_userIndex]["status"] = 'IDLE';
            _usersArr[_userIndex]["counter"] = req.body.counter;
            if (req.body.default) {
                _usersArr[_userIndex]["defIncludes"] = [];
                _usersArr[_userIndex]["defIncludes"] = req.body.includes || [];
            }
            _usersArr[_userIndex]["includes"] = req.body.includes || [];
            let _redisResp = await insertRecordsRedis('USERS', _usersArr);
            if (!_redisResp.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured while insert records to Redis., Error:- ${_redisResp.desc}`
                });
            }

            let _user = _usersArr[_userIndex];
            return res.status(200).send({
                "status": "SUCCESS",
                "data": _user || {}
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

// Get Tokens Data
router.post('/get-tokens-data', async (req, res) => {
    try {
        if (req.body.orgId && req.body.locId && req.body.tokenType) {
            let _records = await getRecords('TOKENS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _resp = {
                "tokensData": [],
                "userData": []
            }
            //console.log("toks",_records)
            let _tokenData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            // console.log("toks",_tokenData)
            let _tokenArr = _.filter(_tokenData, (clnt) => { return clnt.orgId == parseInt(req.body.orgId) && clnt.locId == parseInt(req.body.locId) });
            let _users = await getRecords('USERS');
            if (!_users.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _usersArr = (_users.data && _users.data.data) ? JSON.parse(_users.data.data) : [];
            if (_tokenArr && _tokenArr.length > 0) {
                if (req.body.tokenType === 'ALL') {
                    _resp.tokensData = _tokenArr;
                    return res.status(200).send({
                        "status": "SUCCESS",
                        "data": _resp || [],
                        "description": !(_tokenArr && _tokenArr.length > 0) ? `No Tokens are available` : ''
                    });
                }
                else {
                    if (!req.body.operatorId) {
                        return res.status(400).send({
                            "status": "FAIL",
                            "data": [],
                            "description": `Invalid Inputs..`
                        });
                    }

                    let _userFiltered = _.filter(_usersArr, (item) => { return item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) && item.userId == parseInt(req.body.operatorId) });
                    if (!_userFiltered) {
                        return res.status(400).send({
                            "status": "FAIL",
                            "data": _resp || [],
                            "description": `No User exists in Redis againest this:- ${req.body.operatorId}`
                        });
                    }

                    // let _filteredData = _.filter(_tokenArr, (item) => { return item.recType === req.body.tokenType });
                    let _filteredData = [];
                    _.each(_tokenArr, (item) => {
                        _.each(_userFiltered[0].includes, (inc) => {
                            if (inc === item.recType) {
                                // console.log("typee", inc, item.recType,item);
                                _filteredData.push(item);
                            }
                        });
                    });
                    _resp["tokensData"] = _filteredData || [];
                    _resp["userData"] = (_userFiltered[0].status != '' ? _userFiltered : []) || [];
                    return res.status(200).send({
                        "status": "SUCCESS",
                        "data": _resp || [],
                        "description": !(_filteredData && _filteredData.length > 0) ? `No Tokens are available` : ''
                    });
                }
            }
            else {
                let _userFiltered = [];
                if (req.body.operatorId) {
                    _userFiltered = _.filter(_usersArr, (item) => { return item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) && item.userId == parseInt(req.body.operatorId) });
                    _resp["userData"] = _userFiltered || []
                }
                return res.status(200).send({
                    "status": "SUCCESS",
                    "data": _resp || [],
                    "description": `No tokens are availble.`
                });
            }
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

router.post('/update-token', async (req, res) => {
    try {
        let _nextTokenData = {};
        if (req.body.orgId && req.body.locId && (req.body.operatorId && req.body.status && (req.body.status === 'PAUSED' || req.body.status === 'RESUME')) || (req.body.tokenType && req.body.recId && req.body.status && req.body.status.length > 0 && req.body.operatorId)) {
            if (req.body.status === 'REQUEUE') {
                if (!(req.body.reQuePosition)) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Invalid Inputs..`
                    });
                }
            }
            else if (req.body.status === 'ASSIGNED') {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Not allowed to Process this "ASSIGNED" Request`
                });
            }

            let _usersArr = await getRecords('USERS');
            if (!_usersArr.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get Users from Redis., Error:- ${_usersArr.desc}`
                });
            }
            let _users = (_usersArr.data && _usersArr.data.data) ? JSON.parse(_usersArr.data.data) : [];
            let _idelUsers = _.filter(_users, (usr) => { return usr.orgId == parseInt(req.body.orgId) && usr.locId == parseInt(req.body.locId) && usr.userId == parseInt(req.body.operatorId) });
            if (_idelUsers.length == 0) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `No Users are in IDLE state`
                });
            }
            if (!_idelUsers[0].includes) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `This User No Permissions`
                });
            }
            let description = "";
            if (req.body.status === 'PAUSED') {
                let _usrIndex = _.findLastIndex(_users, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), userId: parseInt(_idelUsers[0].userId) });
                _users[_usrIndex].status = 'PAUSED';
                _users[_usrIndex].pausedDt = new Date();
                let _redisUserResp = await insertRecordsRedis('USERS', _users);
                if (!_redisUserResp.success) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Error occured while insert records to Redis., Error:- ${_redisResp.desc}`
                    });
                }
                description = `Puased Successfully`;
            }
            else if (req.body.status === 'RESUME') {
                let _usrIndex = _.findLastIndex(_users, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), userId: parseInt(_idelUsers[0].userId) });
                _users[_usrIndex].status = 'IDLE';
                _users[_usrIndex].pausedDt = "";
                let _redisUserResp = await insertRecordsRedis('USERS', _users);
                if (!_redisUserResp.success) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Error occured while insert records to Redis., Error:- ${_redisResp.desc}`
                    });
                }
                description = `Resumed Successfully`;
            }
            //else if (req.body.recId && (req.body.status === 'COMPLETED' || req.body.status === 'SKIPPED')) {
            else {
                if (req.body.status !== 'SKIPPED' && _idelUsers[0].status === 'PAUSED') {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `You are Paused the Que., Please Resume it.`
                    });
                }
                let _records = await getRecords('TOKENS');
                if (!_records.success) {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                    });
                }
                let _tokenArr = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
                // console.log("_tokenArr",_tokenArr);
                let _itemIndex = _.findLastIndex(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(req.body.recId) });
                //let _itemIndex = _.findIndex(_tokenArr, function(_tokn) { return _tokn.orgId === parseInt(req.body.orgId) && _tokn.locId === parseInt(req.body.locId) && _tokn.recId === parseInt(req.body.recId) })
                // console.log("_index", _itemIndex);
                // console.log("_tokenArr[_itemIndex]", _tokenArr[_itemIndex]);
                if (req.body.status === 'IDLE' || (_tokenArr[_itemIndex] && _tokenArr[_itemIndex].recType === req.body.tokenType)) {
                    let _activeRecords = {};
                    if (req.body.status !== 'IDLE' && req.body.status !== 'ASSIGNED') {
                        _tokenArr[_itemIndex].status = req.body.status;
                        _tokenArr[_itemIndex].actionBy = _idelUsers[0].userName || req.body.operatorId;
                        _tokenArr[_itemIndex].actionDt = new Date();
                    }
                    if (req.body.status === 'SKIPPED') {
                        let currentTokenData = _tokenArr[_itemIndex] || {};
                        _tokenArr = _.without(_tokenArr, _.findWhere(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(req.body.recId) }));
                        // let _filtData = _.filter(_tokenArr, (item) => { return item.recType === req.body.tokenType && item.status != 'COMPLETED' && item.status != 'ASSIGNED' });
                        // console.log("_tokenArr", _tokenArr)
                        //console.log("user", _idelUsers[0]);
                        let _filtData = [];
                        _.each(_tokenArr, (item) => {
                            if (_idelUsers[0].orgId == parseInt(item.orgId) && _idelUsers[0].locId == parseInt(item.locId)) {
                                _.each(_idelUsers[0].includes, (inc) => {
                                    if (item.status != 'COMPLETED' && item.status != 'ASSIGNED' && item.status != 'CANCELED' && inc == item.recType) {
                                        _filtData.push(item);
                                    }
                                });
                            }
                        });

                        let _filteredObj = {};
                        if (_filtData[rearrageAt]) {
                            _filteredObj = _filtData[rearrageAt];
                        }
                        else {
                            _filteredObj = _filtData.length > 0 ? _filtData[_filtData.length - 1] : {};
                        }
                        _activeRecords = _filteredObj;
                        let _reIndex = 0;
                        if (Object.keys(_filteredObj).length === 0) {
                            _reIndex = _tokenArr.length;
                        }
                        else {
                            _reIndex = _.findLastIndex(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(_filteredObj.recId) });
                            // _reIndex = _.findLastIndex(_tokenArr, { recId: parseInt(_filteredObj.recId) });
                            _reIndex = (_reIndex + 1);
                        }
                        currentTokenData.skippedCount = (currentTokenData.skippedCount + 1);
                        let _skippedObj = { "skippedBy": (_idelUsers[0].userId || req.body.operatorId), "displayName": (_idelUsers[0].displayName), skippedDt: new Date() };
                        currentTokenData.skippedDetails.push(_skippedObj);
                        _tokenArr.splice(_reIndex, 0, currentTokenData);
                    }
                    else if (req.body.status === 'CANCEL') {
                        _tokenArr[_itemIndex].status = 'CANCELED';
                        _tokenArr[_itemIndex].canceledBy = req.body.operatorId;
                        _tokenArr[_itemIndex].canceledDt = new Date();
                    }
                    else if (req.body.status === 'REQUEUE') {
                        let _currentTokenData = _tokenArr[_itemIndex] || {};
                        _tokenArr = _.without(_tokenArr, _.findWhere(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(req.body.recId) }));



                        let _filtData = [];
                        _.each(_tokenArr, (item) => {
                            _.each(_idelUsers[0].includes, (inc) => {
                                if (item.status != 'COMPLETED' && item.status != 'ASSIGNED' && item.status != 'CANCELED' && inc == item.recType) {
                                    _filtData.push(item);
                                }
                            });
                        });
                        let _filteredObj = {};
                        if (_filtData[parseInt(req.body.reQuePosition) - 1]) {
                            _filteredObj = _filtData[parseInt(req.body.reQuePosition) - 1];
                        }
                        else {
                            _filteredObj = _filtData.length > 0 ? _filtData[_filtData.length - 1] : {};
                        }
                        _activeRecords = _filteredObj;

                        let _reIndex = 0;
                        if (Object.keys(_filteredObj).length === 0) {
                            _reIndex = _tokenArr.length;
                        }
                        else {
                            _reIndex = _.findLastIndex(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(_filteredObj.recId) });
                        }

                        _currentTokenData.requeuedBy = req.body.operatorId;
                        _currentTokenData.requeuedDt = new Date();
                        _currentTokenData.status = 'IN-PROGRESS';
                        _tokenArr.splice(parseInt(_reIndex), 0, _currentTokenData);
                    }

                    if (req.body.status !== 'REQUEUE' && _idelUsers[0].status !== 'PAUSED') {
                        let _filteredData = [];
                        // console.log("_tokenArr[_itemIndex]",_tokenArr)
                        _.each(_tokenArr, (item) => {
                            _.each(_idelUsers[0].includes, (inc) => {
                                if (item.status != 'COMPLETED' && item.status != 'ASSIGNED' && item.status != 'CANCELED' && inc == item.recType) {
                                    _filteredData.push(item);
                                }
                            });
                        });

                        //       _filteredData = _.filter(_tokenArr, (item) => { return item.recType === req.body.tokenType && item.status != 'COMPLETED' && item.status != 'ASSIGNED' });
                        // _nextTokenDataFilterd = _filteredData[0] ? _filteredData[0] : {};
                        if (Object.keys(_filteredData).length > 0) {
                            if ((req.body.status === 'SKIPPED' && Object.keys(_activeRecords).length === 0)) {
                                description = `No tokens are available for this Token Type : ${req.body.tokenType}`;
                            }
                            else {
                                //let _nxtTokns = _.filter(_filteredData, (item) => { return item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) && item.recId != parseInt(req.body.recId) });
                                let _nxtTokns = _.filter(_filteredData, (item) => { return item.orgId == parseInt(req.body.orgId) && item.locId == parseInt(req.body.locId) });
                                // let _sortByTokns = _.sortBy(_nxtTokns, function (item) {
                                //     return item.recId;
                                // });
                             //   console.log("_nxtTokns", _nxtTokns);
                                _nextTokenData = _nxtTokns[0] || {};
                                // if (req.body.status != 'SKIPPED') {
                                let _nxtIndex = _.findLastIndex(_tokenArr, { orgId: parseInt(req.body.orgId), locId: parseInt(req.body.locId), recId: parseInt(_nextTokenData.recId) });

                                if (_nxtIndex >= 0) {
                                    _tokenArr[_nxtIndex].status = 'ASSIGNED';
                                    _tokenArr[_nxtIndex].assignedTo = _idelUsers[0].displayName;
                                    _tokenArr[_nxtIndex].assignedOperId = _idelUsers[0].userId;
                                    _tokenArr[_nxtIndex].assignedDt = new Date();
                                    _tokenArr[_nxtIndex].counter = _idelUsers[0].counter || 1;
                                }
                                // }
                            }
                        }
                        else {
                            description = `No tokens are available for this Token Type : ${req.body.tokenType}`;
                        }
                    }
                    let _redisResp = await insertRecordsRedis('TOKENS', _tokenArr);
                    if (!_redisResp.success) {
                        return res.status(400).send({
                            "status": "FAIL",
                            "data": [],
                            "description": `Error occured while insert records to Redis., Error:- ${_redisResp.desc}`
                        });
                    }

                }
                else {
                    return res.status(400).send({
                        "status": "FAIL",
                        "data": [],
                        "description": `No token is available for this id : ${req.body.recId} and Token Type : ${req.body.tokenType}`
                    });
                }
            }
            //console.log("_nextTokenData", _nextTokenData)
            return res.status(200).send({
                "status": "SUCCESS",
                "data": _nextTokenData || {},
                "description": description || ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        console.log("err", err)
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${err}`
        });
    }
});

//Insert users
router.post('/insert-user', async (req, res) => {
    try {
        if (req.body.orgId && req.body.locId && req.body.userName && req.body.displayName && req.body.roleType && req.body.password) {
            let _records = await getRecords('USERS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _usersData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            let _filtData = _.filter(_usersData, (clnt) => { return clnt.orgId == req.body.orgId && clnt.locId == req.body.locId });

            let _count = _filtData.length + 1;
            let _userObj = {
                "orgId": req.body.orgId,
                "locId": req.body.locId,
                "userId": _count,
                "userName": req.body.userName,
                "displayName": req.body.displayName,
                "roleType": req.body.roleType,
                "includes": [],
                "defIncludes": [],
                "status": "",
                "password": req.body.password,
                "counter": ""
            };
            _usersData.push(_userObj);
            let _redisResp = await insertRecordsRedis('USERS', _usersData);
            if (!_redisResp.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured while insert user to Redis., Error:- ${_redisResp.desc}`
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": [],
                "description": ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

//Update User
router.post('/update-user', async (req, res) => {
    try {
        if (req.body && req.body.orgId && req.body.locId && req.body.operatorId && req.body.status == '') {
            let _records = await getRecords('USERS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _usersData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];

            let _itemIndex = _.findLastIndex(_usersData, { orgId: req.body.orgId, locId: req.body.locId, userId: parseInt(req.body.operatorId) });
            _usersData[_itemIndex].status = "";
            _usersData[_itemIndex].includes = [];

            let _redisResp = await insertRecordsRedis('USERS', _usersData);
            if (!_redisResp.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured while insert user to Redis., Error:- ${_redisResp.desc}`
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": [],
                "description": ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": "Invalid Input Parameters.,"
            });
        }
    }

    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

//Get User
router.post('/get-user', async (req, res) => {
    try {
        if (req.body.orgId && req.body.locId) {
            let _records = await getRecords('USERS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            }
            let _usersData = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            let _filtData = {};
            if (req.body.userId) {
                _filtData = _.filter(_usersData, (clnt) => { return clnt.orgId == parseInt(req.body.orgId) && clnt.locId == parseInt(req.body.locId) && clnt.userId == parseInt(req.body.userId) });
            }
            else {
                _filtData = _.filter(_usersData, (clnt) => { return clnt.orgId == parseInt(req.body.orgId) && clnt.locId == parseInt(req.body.locId) });
            }

            if (_filtData.length == 0) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `No Users are available for this orgId :- ${req.body.orgId} locId :- ${req.body.locId} ..`
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": _filtData || [],
                "description": ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

//Assigned Tokens
router.post('/assigned-token', async (req, res) => {
    try {
        if (req.body.orgId && req.body.locId && req.body.tokenType) {
            let _users = await getRecords('USERS');
            if (!_users.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get Users from Redis., Error:- ${_users.desc}`
                });
            }
            let _records = await getRecords('TOKENS');
            if (!_records.success) {
                return res.status(400).send({
                    "status": "FAIL",
                    "data": [],
                    "description": `Error occured to get records from Redis., Error:- ${_records.desc}`
                });
            };
            let _usersData = (_users.data && _users.data.data) ? JSON.parse(_users.data.data) : [];
            let _activeUsers = _.filter(_usersData, (_user) => { return _user.orgId == req.body.orgId && _user.locId == req.body.locId && _user.status === 'IDLE' });
            let _data = { assignedTokens: [], nextTokens: [], activeUsers: (_activeUsers || []) };
            let _tokensDataArr = (_records.data && _records.data.data) ? JSON.parse(_records.data.data) : [];
            let _tokenDataArr = _.filter(_tokensDataArr, (tkn) => { return tkn.orgId == req.body.orgId && tkn.locId == req.body.locId });
            let _activeIncludes = [];
            _.each(_activeUsers, (item) => {
                _.each(item.includes, (incl) => {
                    if (!_activeIncludes.includes(incl)) {
                        _activeIncludes.push(incl);
                    }
                });
            });
            let _tokenArr = [];
            _.each(_activeIncludes, (_act) => {
                _.each(_tokenDataArr, (_tok) => {
                    if (_act == _tok.recType) {
                        _tokenArr.push(_tok);
                    }
                });
            });
            let _assingedData = [];
            let _idleTokens = [];
            if (req.body.tokenType === 'ALL') {
                _assingedData = _.filter(_tokenArr, (item) => { return item.status === 'ASSIGNED' });
                _idleTokens = _.filter(_tokenArr, (item) => { return item.status != 'COMPLETED' && item.status != 'ASSIGNED' && item.status != 'CANCELED' });
            }
            else {
                _assingedData = _.filter(_tokenArr, (item) => { return item.recType === req.body.tokenType && item.status === 'ASSIGNED' });
                _idleTokens = _.filter(_tokenArr, (item) => { return item.recType === req.body.tokenType && item.status != 'COMPLETED' && item.status != 'ASSIGNED' && item.status != 'CANCELED' });
            }
            _data.assignedTokens = _assingedData || [];
            let _grpByIdleToken = _.groupBy(_idleTokens, 'recType');
            if (Object.keys(_grpByIdleToken).length > 1) {
                _.each(_grpByIdleToken, (_tkn) => {
                    data = _.sortBy(_tkn, function (item) {
                        return item.recId;
                    });
                    if (_data.nextTokens.length < 2) {
                        _data.nextTokens.push(data[0]);
                    }
                    else {
                        return true;
                    }
                });
            }
            else {
                _.each(_idleTokens, (_tkn) => {
                    if (_data.nextTokens.length < 2) {
                        _data.nextTokens.push(_tkn);
                    }
                    else {
                        return true;
                    }
                });
            }
            return res.status(200).send({
                "status": "SUCCESS",
                "data": _data || [],
                "description": ""
            });
        }
        else {
            return res.status(400).send({
                "status": "FAIL",
                "data": [],
                "description": `Invalid Inputs..`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occuurred ${JSON.stringify(err)}`
        });
    }
});

// Delete Tokens
router.get('/delete-tokens', async (req, res) => {
    let _records = await redisApiCall('TOKENS', 'resetKey');
    if (!_records.success) {
        return res.status(400).send({
            "status": "FAIL",
            "data": [],
            "description": `Error occured to Delete tokens from Redis., Error:- ${_records.desc}`
        });
    }

    return res.status(200).send({
        "status": "SUCCESS",
        "data": [],
        "description": "Deleted Successfully.,"
    });
});

module.exports = router;
const appCongig = require('../../app-config');
const dbCall = require('../common/axios');
const dbSchema = require('../../db-config/schema-doc');
const dbCallDoc = require('../../db-config/db-pg-doc');
const winston = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');
const templates = require("./const/templates");
const _ = require('underscore');
const format = require('string-format');
const moment = require('moment');

const dirPath = appCongig.DIR_PAHT;
const runAt = 5, runOnlyOnce = false;

format.extend(String.prototype, {});
let allHosts = [];

var transportInfo1 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/everyDay/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});

var transportInfo2 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/every10min/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});

var transportInfo3 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/every30min/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});
var transportInfo4 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/onceAdayMedsInvs/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});

var transportInfo5 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/MedsInvsOrders/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});

var transportInfo6 = new (winston.transports.DailyRotateFile)({
    level: "info",
    filename: (dirPath + "public/log/doctor/service/every4Hours/%DATE%.log"),
    datePattern: 'DD-MMM-YYYY',
    maxFiles: '1d',
    zippedArchive: true
});

const loggerDaily = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo1]
});

const loggerEvery = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo2]
});

const loggerEvery30 = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo3]
});

const _loggerMedsInvs = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo4]
});
const _loggerMedsInvsOrders = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo5]
});
const loggerEvery4Hours = winston.createLogger({
    format: winston.format.json(),
    transports: [transportInfo6]
});


function getDate() {
    return new Date().toLocaleString();
}

function logDaily(message) {
    loggerDaily.info(`date:- ${getDate()}, message: ${message}`);
}

function logEvery(message) {
    loggerEvery.info(`date:- ${getDate()}, message: ${message}`);
}

function loggerMedsInvs(message) {
    _loggerMedsInvs.info(`date:- ${getDate()}, message: ${message}`);
}
function loggerMedsInvsOrders(message) {
    _loggerMedsInvsOrders.info(`date:- ${getDate()}, message: ${message}`);
}
function logger4Hours(message) {
    loggerEvery4Hours.info(`date:- ${getDate()}, message: ${message}`);
}

function getMediInvsOrdersDet(_url, _params) {
    return new Promise(function (resolve, reject) {
        dbCall.post(_url, _params).then((data) => {
            if (data && data.SQL_ERROR) {
                resolve({ gData: null, gErr: data });
            }
            else {
                resolve({ gData: data, gErr: null });
            }
        }).catch((err) => {
            //console.log(err.ERROR)
            resolve({ gData: null, gErr: err });
        });
    });
}
function insertMediInvsOrdersDet(params) {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.uprInsupdMediInvstOrdersDataInfo, params).then((response) => {
            resolve({ insOrders: true, ordersError: null });
        }).catch((error) => {
            if (error.ERROR) resolve({ insOrders: null, ordersError: error.ERROR });
            else resolve({ insOrders: null, ordersError: error.message });
        });
    });
}
function getAllHosts() {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.getAllHosts, {}).then((response) => {
            if (response && response.RES_OBJ && response.RES_OBJ.length > 0) resolve({ hosts: response.RES_OBJ, error: null });
            else resolve({ hosts: [], error: null });
        }).catch((error) => {
            if (error.ERROR) resolve({ orgLoc: null, error: error.ERROR });
            else resolve({ orgLoc: null, error: error.message });
        });
    });
}

function insUpdMasterData(params) {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.insUpdMasterData, params).then((response) => {
			//console.log("response-----------insUpdMasterData",response);
            resolve({ insUpd: true, error: null });
        }).catch((error) => {
            if (error.ERROR) resolve({ insUpd: null, error: error.ERROR });
            else resolve({ insUpd: null, error: error.message });
        });
    });
}

function insUpdTransactionDataInfo(params) {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.insUpdTransactionDataInfo, params).then((response) => {
            //console.log("insUpdTransactionDataInfo--response", response)
            resolve({ insUpd: true, error: null });
        }).catch((error) => {
            //console.log("insUpdTransactionDataInfo--error", error)
            if (error.ERROR) resolve({ insUpd: null, error: error.ERROR });
            else resolve({ insUpd: null, error: error.message });
        });
    });
}


function insupdStatRep(params) {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.insupdStatRep, params).then((response) => {
            //console.log("insupdStatRep",response)
            resolve({ insUpd: true, error: null });
        }).catch((error) => {
            //console.log("insupdStatRep error",error)
            if (error.ERROR) resolve({ insUpd: null, error: error.ERROR });
            else resolve({ insUpd: null, error: error.message });
        });
    });
}

function getApiData(_url, _params) {
    return new Promise(function (resolve, reject) {
        dbCall.post(_url, _params).then((data) => {
           // console.log("_url",_url, _params,data)
            if (data && data.SQL_ERROR) {
                resolve({ gData: null, gErr: data });
            }
            else {
				//console.log("_url",data)
                resolve({ gData: data, gErr: null });
            }
        }).catch((err) => {
            //console.log(err.ERROR)
            resolve({ gData: null, gErr: err });
        });
    });
}

function getMasterData(_url, _params) {
    return new Promise(function (resolve, reject) {
		//console.log("data",_url,_params)
        dbCall.post(_url, _params).then((data) => {
			//console.log("doctor_url",_url)
            if (data && data.SQL_ERROR) {
                resolve({ gData: null, gErr: data });
            }
            else {
                resolve({ gData: data, gErr: null });
            }
        }).catch((err) => {
			//console.log(err)
            resolve({ gData: null, gErr: err });
        });
    });
}

function convertKeysToLower(arr) {
    let newArr = [], key, n, keys = "";
    for (let i in arr) {
        keys = Object.keys(arr[i]);
        n = keys.length;
        var newobj = {}, j = 0;
        while (j < n) {
            key = keys[j];
            j++;
            newobj[key.toLowerCase()] = arr[i][key]
        }
        newArr.push(newobj)
    }
    return newArr
};

function insertPatNotifEventsIntoPG(params) {
    return new Promise(function (resolve, reject) {
        dbCallDoc(dbSchema.insUpdPatMsgNotification, params).then((response) => {
            resolve({ insUpd: true, error: null });
        }).catch((error) => {
            //console.log("error", error)
            if (error.ERROR) resolve({ insUpd: null, error: error.ERROR });
            else resolve({ insUpd: null, error: error.message });
        });
    });
};

/* -------------  Get Message ---------------*/

function getMsgTemplate(_obj, _flag) {
    // let _msgTemplate = "";
    const template = templates.find((temp) => {
        return (temp.MIG_ID === parseInt(_obj.MIG_ID) && temp.EVENT_ID === parseInt(_obj.EVENT_ID));

    });

    if (template) {
        return { ...template };
    }
    else {
        return null;
    }
};



function getMessage(_eventObj, _flag) {
	 return new Promise(function (resolve, reject) {
		//console.log("message-1", _eventObj);
		let formatedMsg ="";
			try{
				let msgObj = getMsgTemplate(_eventObj, _flag);
				msgObj = msgObj ? msgObj : "";
				formatedMsg = msgObj.MSG_TEMPLATE ?  msgObj.MSG_TEMPLATE.format(_eventObj) : "";
				//console.log("message-2", formatedMsg);
			}
			catch(e){
				 console.log("message-2", e);
			}
			resolve(formatedMsg)
	 });
};

const onceAday = {
    array: [
        {
            "NAME": "NST",
            "CD": "NST",
            "ACTIVE": "N",
            "METHOD": "getMasterData",
            "PARAMS": {
                "IP_FLAG": "NST",
                "IS_PRIMARY": ""
            }
        },
        {
            "NAME": "USER",
            "CD": "USER",
            "ACTIVE": "Y",
            "METHOD": "getMasterData",
            "PARAMS": {
                "IP_FLAG": "USER",
                "IS_PRIMARY": ""
            },
        },
        {
            "NAME": "DOCT",
            "CD": "DOCT",
            "ACTIVE": "Y",
            "METHOD": "getMasterData",
            "PARAMS": {
                "IP_FLAG": "DOCT",
                "IS_PRIMARY": ""
            }
        },
		{
            "NAME": "DOCTOR",
            "CD": "DOCTOR",
            "ACTIVE": "Y",
            "METHOD": "getMasterData",
            "PARAMS": {
                "IP_FLAG": "DOCTOR",
                "IS_PRIMARY": ""
            }
        }
    ],
    start: async function () {
        try {
            if (allHosts && allHosts.length > 0) {
                logDaily(`                                                 `);
                logDaily(`                                                 `);
                for (let host of allHosts) {
					
                    logDaily(`daily:${host.host_name}:${host.host_api_url}`);
                    for (let obj of this.array) {
                        logDaily(`daily:${host.host_name}:${obj.NAME}:${obj.ACTIVE}`);
                        if (obj.ACTIVE === 'Y'&&host.host_name!="MCH") {
                           const { gData, gErr } = await getMasterData(host.host_api_url + obj.METHOD, obj.PARAMS);
						//const { gData, gErr } = await getMasterData("https://kingston.doctor9.com/napi_kingston/apk/doctor" + obj.METHOD, obj.PARAMS);
                            if (gData) {
                            console.log("gData",gData)
                                logDaily(`daily:${host.host_name}:${obj.NAME}:getMasterData:success:${gData.length}`);
                                if (gData.length > 0) {
                                    const split = {};
                                    for (let val of gData) {
                                        const key = `${val.ORG_ID}_${val.LOC_ID}`;
                                        if (!split[key]) {
                                            split[key] = {
                                                data: [val],
                                                orgId: val.ORG_ID,
                                                locId: val.LOC_ID
                                            };
                                        }
                                        else {
                                            split[key].data.push(val);
                                        };
                                    }

                                    for (let sObj in split) {
										
										
                                        const { insUpd, error } = await insUpdMasterData({
                                            host_name: host.host_name,
                                            document_cd: obj.CD,
                                            org_id: split[sObj].orgId,
                                            loc_id: split[sObj].locId,
                                            json_data: JSON.stringify(convertKeysToLower(split[sObj].data))
                                        });
                                        if (error) {
                                            logDaily(`daily:${host.host_name}:${obj.NAME}:InsertMasterData:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(error)}`);
                                        }
                                        else {
                                            logDaily(`daily:${host.host_name}:${obj.NAME}:InsertMasterData:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                        }
                                    }
                                }
                            }
                            else {
                                logDaily(`daily:${host.host_name}:${obj.NAME}:getMasterData:error:${JSON.stringify(gErr)}`);
                            }
                        }
                    }
                }
            }
            if (!runOnlyOnce) runInterval();
        }
        catch (ex) {
            logDaily(`daily:host:error:${ex.message}`);
            if (!runOnlyOnce) runInterval();
        }
    }
};


const every10Min = {
    array: [
				{
					"NAME": "CONSULT",
					"CD": "CONSULTS",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "CONSULT",
						"IS_PRIMARY": "Y"
					}
				},
				{
            "NAME": "DIET",
            "CD": "DIET",
            "ACTIVE": "Y",
            "METHOD": "getMasterData",
            "PARAMS": {
                "IP_FLAG": "DIET",
                "IS_PRIMARY": "Y"
            }
        },
				{
					"NAME": "DSCHRG",
					"CD": "DSCHRG",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "DSCHRG",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "CRITI",
					"CD": "CRITICALALERTS",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "CRITI",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "CROSS",
					"CD": "XCONSULTS",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "CROSS",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "APROV",
					"CD": "FORAPPROVAL",
					"ACTIVE": "N",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "APROV",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "ADMN",
					"CD": "ONBED",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "ADMN",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "ICDCODE",
					"CD": "ICDCODE",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "ICDCODE",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "BEDLIST",
					"CD": "BEDLIST",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "BEDLIST",
						"IS_PRIMARY": "Y"
					}
				},
				{
					"NAME": "CRITINFOCD",
					"CD": "CRITINFOCD",
					"ACTIVE": "Y",
					"METHOD": "getMasterData",
					"PARAMS": {
						"IP_FLAG": "CRITINFOCD",
						"IS_PRIMARY": "Y"
					}
				},
		{
            "NAME": "PROCDSRV",
            "CD": "PROCDSRV",
            "ACTIVE": "Y",
            "METHOD": "uprGetProcedureServiceDet",
            "PARAMS": {
                "FLAG": "PROCDSRV",
                "IS_PRIMARY": ""
            }
        },
		
		],
    start: async function () {
		//console.log("starting................",allHosts);
        try {
            if (allHosts && allHosts.length > 0) {
                logEvery(`                                              `);
                logEvery(`                                              `);
                for (let host of allHosts) {
                    logEvery(`every:${host.host_name}:${host.host_api_url}`);
                    for (let obj of this.array) {
						//console.log("getmasterdata",host.host_api_url , obj.METHOD, obj.PARAMS);
						//if(host.host_name=="MCH" && obj.CD=="ICDCODE") obj.ACTIVE = 'N'
							
                        if (obj.ACTIVE === 'Y'&&host.host_name!="MCH") {
                            const { gData, gErr } = await getMasterData(host.host_api_url + obj.METHOD, obj.PARAMS);
							
							//console.log("getmasterdata",host.host_api_url , obj.METHOD, obj.PARAMS, gData);
                            if (gData) {
                                logEvery(`every:${host.host_name}:${obj.NAME}:getMasterData:success:${gData.length}`);
                                if (gData.length > 0) {
                                    const split = {};
                                    for (let val of gData) {
                                        const key = `${val.ORG_ID}_${val.LOC_ID}`;
                                        if (!split[key]) {
                                            split[key] = {
                                                data: [val],
                                                orgId: val.ORG_ID,
                                                locId: val.LOC_ID
                                            };
                                        }
                                        else {
                                            split[key].data.push(val);
                                        };
                                    }

                                    for (let sObj in split) {
										
                                        const { insUpd, error } = await insUpdMasterData({
                                            host_name: host.host_name,
                                            document_cd: obj.CD,
                                            org_id: split[sObj].orgId,
                                            loc_id: split[sObj].locId,
                                            json_data: JSON.stringify(convertKeysToLower(split[sObj].data)) || []
                                        });
										//console.log("insUpd",insUpd,error);
                                        if (error) {
                                            logEvery(`every:${host.host_name}:${obj.NAME}:InsertMasterData:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(error)}`);
                                        }
                                        else {
                                            logEvery(`every:${host.host_name}:${obj.NAME}:InsertMasterData:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                        }
                                    }
                                }
                            }
                            else {
                                logEvery(`every:${host.host_name}:${obj.NAME}:getMasterData:error:${JSON.stringify(gErr)}`);
                            }
                        }
                    }
                }
            }
            if (!runOnlyOnce) runEvery10Min();
        }
        catch (ex) {
            logEvery(`every:host:error:${ex.message}`);
            if (!runOnlyOnce) runEvery10Min();
        }
    }
}



// This is used for  patient counts like ip,op..............
const every30Min = {
    array: [
        //Here Method is used for what is the method we are called in sql server
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "getMobCountsMob",
            "PARAMS": {
                "FLAG": "IP"
                
            }
        },
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "getMobCountsMob",
            "PARAMS": {
                "FLAG": "OP"
               
            }
        },
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "N",
            "METHOD": "getMobCountsMob",
            "PARAMS": {
                "FLAG": "UT"
               
            }
        },
        ],
    start: async function () {
        try {
            if (allHosts && allHosts.length > 0) {
                //console.log("allHosts", allHosts)
                logEvery(`                                              `);
                logEvery(`                                              `);
                for (let host of allHosts) {
                    logEvery(`every:${host.host_name}:${host.host_api_url}`);
					//console.log("mobcounts",host.host_api_url)
					//console.log("mobcounts",host.host_api_url)
                    for (let obj of this.array) {
                        if (obj.ACTIVE === 'Y'&&host.host_name!="MCH") {
                            const { gData, gErr } = await getMasterData(host.host_api_url + obj.METHOD, obj.PARAMS);
                            //console.log("key",gData,gErr)
                            if (gData) {
                            
                                logEvery(`every:${host.host_name}:${obj.NAME}:patientCountData:success:${gData.length}`);
                                if (gData.length > 0) {
                                    const split = {};
                                    for (let val of gData) {
                                        const key = `${val.ORG_ID}_${val.LOC_ID}`;
                                            
                                        if (!split[key]) {
                                            split[key] = {
                                                data: [val],
                                                orgId: val.ORG_ID,
                                                locId: val.LOC_ID
                                            };
											
                                        }
                                        else {
                                            split[key].data.push(val);
                                        };
                                    }
                                    for (let sObj in split) {
                                      
                                        const { insUpd, error } = await insupdStatRep({
                                            host_name: host.host_name,
                                            flag:obj.PARAMS.FLAG,
                                            org_id: split[sObj].orgId,
                                            loc_id: split[sObj].locId,
                                            stat_rep_json: JSON.stringify(convertKeysToLower(split[sObj].data)) || []
                                        });
                                       //console.log("insert response",insUpd)
									   //console.log("insert error",error)
                                        if (error) {
                                            logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(error)}`);
                                        }
                                        else {
											
											logEvery(`every::${obj.NAME}:InsertStatRep:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                            logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                            
                                        }
                                        //break;
                                    }
                                }
                            }
                            else {
                                logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:error:${JSON.stringify(gErr)}`);
                            }
                        }
                    }
                }
            }
            if (!runOnlyOnce) runEvery30Min();
        }
        catch (ex) {
			//console.log("ex",ex);
            logEvery(`every:host:error:${ex.message}`);
            if (!runOnlyOnce) runEvery30Min();
        }
    }
}

const onceAdayMedsInvs = {
    array: [
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "mediFav",
            "PARAMS": {
                "IP_FLAG": "MEDSFAV",
                "IS_PRIMARY": ""
            }
        },
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "invsFav",
            "PARAMS": {
                "IP_FLAG": "INVSFAV",
                "IS_PRIMARY": ""
            }
        },
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "mediOrderSet",
            "PARAMS": {
                "IP_FLAG": "MEDSORDER",
                "IS_PRIMARY": ""
            }
        },
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "invsOrderSet",
            "PARAMS": {
                "IP_FLAG": "INVSORDER",
                "IS_PRIMARY": ""
            },
        },


    ],
    start: async function () {
        try {
            if (allHosts && allHosts.length > 0) {
                logDaily(`                                                 `);
                logDaily(`                                                 `);
                for (let host of allHosts) {
                    //console.log("allHosts", allHosts)
                    loggerMedsInvs(`daily:${host.host_name}:${host.host_api_url}`);
                    for (let obj of this.array) {
                        loggerMedsInvs(`daily:${host.host_name}:${obj.NAME}:${obj.ACTIVE}`);
                        if (obj.ACTIVE === 'Y'&&host.host_name!="MCH") {
                            //console.log("url", host.host_api_url, obj.METHOD, obj.PARAMS)
                            const { gData, gErr } = await getMasterData(host.host_api_url + obj.METHOD, obj.PARAMS);
                            //console.log("gData", gData)
                            if (gData) {
                                loggerMedsInvs(`daily:${host.host_name}:${obj.NAME}:getMasterData:success:${gData.length}`);
                                if (gData.length > 0) {
                                    const split = {};
                                    for (let val of gData) {
                                        const key = `${val.ORG_ID}_${val.LOC_ID}`;
                                        if (!split[key]) {
                                            split[key] = {
                                                data: [val],
                                                orgId: val.ORG_ID,
                                                locId: val.LOC_ID
                                            };
                                        }
                                        else {
                                            split[key].data.push(val);
                                        };
                                    }

                                    for (let sObj in split) {
                                        
                                        const { insUpd, error } = await insUpdTransactionDataInfo({
                                            host_api: host.host_name,
                                            document_cd: obj.CD,
                                            org_id: split[sObj].orgId,
                                            loc_id: split[sObj].locId,
                                            master_type: obj.METHOD,
                                            json_data: JSON.stringify(split[sObj].data)
                                        });
                                        if (error) {
                                            loggerMedsInvs(`daily:${host.host_name}:${obj.NAME}:insUpdTransactionDataInfo:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(error)}`);
                                        }
                                        else {
                                            loggerMedsInvs(`daily:${host.host_name}:${obj.NAME}:insUpdTransactionDataInfo:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                        }
                                    }
                                }
                            }
                            else {
                                loggerMedsInvs(`daily:${host.host_name}:${obj.NAME}:getMasterData:error:${JSON.stringify(gErr)}`);
                            }

                        }
                        
                    }
                }
            }
            if (!runOnlyOnce) runInterval();
        }
        catch (ex) {
            loggerMedsInvs(`daily:host:error:${ex.message}`);
            if (!runOnlyOnce) runInterval();
        }
    }
};



// This is used for  insert patient medication notification ..............
const medi_notify = {
    array: [
        //Here Method is used for what is the method we are called in sql server
        {
            "NAME": "",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "uprGetPatMediNotifications",
            "PARAMS": {

            }
        }

    ],
    start: async function () {
        try {
            if (allHosts && allHosts.length > 0) {
                
                logEvery(`                                              `);
                logEvery(`                                              `);
                for (let host of allHosts) {
                    logEvery(`every:${host.host_name}:${host.host_api_url}`);
                    for (let obj of this.array) {
						//console.log("PAT_MED_host", host);
                        if (obj.ACTIVE === 'Y' && host.host_name === "DOC9") {
							//console.log("PAT_MED", host);
                            const { gData, gErr } = await getMasterData(host.host_api_url + obj.METHOD, obj.PARAMS);
                            
                            if (gData) {
							//	console.log("pat_MEDI_NOTIF", gData)
                                logEvery(`every:${host.host_name}:${obj.NAME}:patient medication notification data:success:${gData.length}`);
                                if (gData.length > 0) {
                                    const split = {};
                                    // _.each(gData, function (item, index) {
										// console.log("item-length-start", gData.length);
                                        // item.message = getMessage(item);
										// console.log("item-length-end", gData.length);
                                    // });
									
									for(let item of gData){
										 //console.log("item-length-start", gData.length);
										 try{
											item.msg = await getMessage(item);
											let _event_data=[];
											_event_data.push(item);
											item.event_data = JSON.stringify(convertKeysToLower(_event_data)) || []
										 }
										 catch(e){
											 item.msg ="";
											 item.event_data =[];
											//console.log("item-length-end", gData.length);
										 }
										
									}
									//console.log("pat_MEDI_NOTIF_data", gData)
                                    const { insUpd, error } = await insertPatNotifEventsIntoPG({
                                        notif_det_json: JSON.stringify(convertKeysToLower(gData)) || []
                                    });

                                    if (error) {
                                        logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(error)}`);
                                    }
                                    else {
                                        logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);

                                    }

                                }
                            }
                            else {
                                logEvery(`every:${host.host_name}:${obj.NAME}:InsertStatRep:error:${JSON.stringify(gErr)}`);
                            }
                        }
                    }
                   // break;
                }
            }
            if (!runOnlyOnce) runEvery5Min();
        }
        catch (ex) {
            logEvery(`every:host:error:${ex.message}`);
            if (!runOnlyOnce) runEvery5Min();
        }
    }
};

const medsInvsOrders = {
    array: [
        {
            "NAME": "medsInvsOrder",
            "CD": "",
            "ACTIVE": "Y",
            "METHOD": "uprGetMediInvsOrdersDet",
            "PARAMS": {
                "IP_FLAG": "A"
          
            }
        },
       

    ],
    start: async function () {
        try {
			//console.log("started..................................");
            if (allHosts && allHosts.length > 0) {
                loggerMedsInvsOrders(`                                                 `);
                loggerMedsInvsOrders(`                                                 `);
                for (let host of allHosts) {
                  //  console.log("allHosts", host)
                    loggerMedsInvsOrders(`daily:${host.host_name}:${host.host_api_url}`);
                    for (let obj of this.array) {
                        loggerMedsInvsOrders(`daily:${host.host_name}:${obj.NAME}:${obj.ACTIVE}`);
                        if (obj.ACTIVE === 'Y') {
                            const { gData, gErr } = await getMediInvsOrdersDet(host.host_api_url + obj.METHOD, obj.PARAMS);
                            if (gData && Object.keys(gData).length>0) {
                                for(let tableData in gData ){
                                    const split = {};
                                    for (let val of gData[tableData]) {
                                        const key = `${val.ORG_ID}_${val.LOC_ID}`;
                                        if (!split[key]) {
                                            split[key] = {
                                                data: [val],
                                                orgId: val.ORG_ID,
                                                locId: val.LOC_ID,
                                                visit_dt:moment(val.VISIT_DT).format('YYYY-MM-DD'),
                                                order_type:val.ORD_TYPE
                                            };
                                        }
                                        else {
                                            split[key].data.push(val);
                                        };
                                    }

                                    for (let sObj in split) {
                                      //  console.log(split[sObj].visit_dt)
                                        const { insOrders, ordersError } = await insertMediInvsOrdersDet({
                                            host_name: host.host_name,
                                            org_id: split[sObj].orgId,
                                            loc_id: split[sObj].locId,
                                            json_data: JSON.stringify(split[sObj].data),
                                            visit_dt:split[sObj].visit_dt,
                                            order_type:split[sObj].order_type

                                        });
                                        if (ordersError) {
                                            loggerMedsInvsOrders(`daily:${host.host_name}:${obj.NAME}:insertMediInvsOrdersDet:error:${split[sObj].orgId}:${split[sObj].locId}:${JSON.stringify(ordersError)}`);
                                        }
                                        else {
                                            loggerMedsInvsOrders(`daily:${host.host_name}:${obj.NAME}:insertMediInvsOrdersDet:success:${split[sObj].orgId}:${split[sObj].locId}:${split[sObj].data.length}`);
                                        }
                                    }
                                   
                                }
                            }
                            else {
                                loggerMedsInvsOrders(`daily:${host.host_name}:${obj.NAME}:getMediInvsOrdersDet:error:${JSON.stringify(gErr)}`);
                            }
                            
                        }
                        
                        
                    }
                }
            }
            if (!runOnlyOnce) medsInvsOrders10Min();
        }
        catch (ex) {
            loggerMedsInvsOrders(`daily:host:error:${ex.message}`);
            if (!runOnlyOnce) medsInvsOrders10Min();
        }
    }
};


const every4Hours = {
    array: [
        {
            "NAME": "getSumShortUrlapi",
            "CD": "SUMMARYSHORTURL",
            "host_api_url":"https://api.kimshospitals.com/api/apt/",
            "ACTIVE": "Y",
            "METHOD": "getApiData",
            "PARAMS": {
                "lkApiName":"getSumShortUrlapi",
                "apiQry":""
          
            }
        },
    ],
    start: async function () {
        try {
			console.log("started..................................")
        
                    for (let obj of this.array) {
                        if (obj.ACTIVE === 'Y') {
                           console.log(obj.host_api_url )
                            let { gData, gErr } = await getApiData(obj.host_api_url + obj.METHOD, obj.PARAMS);
							//console.log("obj.METHOD",obj.host_api_url + obj.METHOD, obj.PARAMS)
							//console.log("gData",typeof(gData))
                                     gData=JSON.parse(gData)
									 //console.log("gData",typeof(gData))
                                    if (gData && gData.length>0) { 
									//console.log("obj.METHOD",gData)
                                        const { insUpd, error } = await insUpdMasterData({
                                            host_name: "KIMS",
                                            document_cd: obj.CD,
                                            org_id: 2,
                                            loc_id:null,
                                            json_data:JSON.stringify(convertKeysToLower(gData)) || []
                                        });
                                        if (error) {
                                           // console.log("error",error)
                                            logger4Hours(`daily:${obj.host_name}:${obj.NAME}:InsertMasterData:error:${obj.ORG_ID}:${obj.LOC_ID}:${JSON.stringify(error)}`);
                                        }
                                        else {
                                            //console.log("insUpd",insUpd)
                                            logger4Hours(`daily:${obj.host_name}:${obj.NAME}:InsertMasterData:success:${obj.ORG_ID}:${obj.LOC_ID}:${obj.length}`);
                                        }
                        }
                            else {
                                logger4Hours(`daily:${obj.host_name}:${obj.NAME}:getMasterData:error:${JSON.stringify(gErr)}`);
                            }

                        }   
            }
            if (!runOnlyOnce) runEvery4Hours();
        }
        catch (ex) {
			//console.log("ex",ex)
            logger4Hours(`daily:host:error:${ex.message}`);
            if (!runOnlyOnce) runEvery4Hours();
        }
    }
};


function medsInvsOrders10Min() {
    setTimeout(function () {
        medsInvsOrders.start();
    }, 600000);// 600000 -- 10 minutes
}
function runEvery10Min() {
    setTimeout(function () {
        every10Min.start();
    }, 300000);// 300000 -- 5 minutes
}
function runEvery5Min() {
    setTimeout(function () {
        medi_notify.start();
    }, 300000);//every 5 min   300000
}
function runEvery4Hours() {
    setTimeout(function () {
        every4Hours.start();
    }, 300000);//every 4 hours 
}
function dateDiff(tDt, fDt) {
    var dt1 = fDt ? new Date(fDt) : new Date();
    var dt2 = new Date(tDt);
    return (dt1 - dt2);
}

function runInterval(interval) {
    if (!interval) {
        const date = new Date();
        let sDt = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
        sDt = new Date(new Date(new Date(sDt).setHours(runAt)).setMinutes(0));
        interval = dateDiff(date, sDt);
    }
    setTimeout(function () {
        onceAday.start();
    }, interval);
}


function runEvery30Min() {
    setTimeout(function () {
        every30Min.start();
    }, 1800000);//every 30 min   1800000
}

(async () => {
    logDaily(`                                                      `);
    logDaily(`******************************************************`);
    logDaily(`              Start Doctor Service                    `);
    let { hosts, error } = await getAllHosts();
	console.log("hosts",hosts);
    if (error) {
        logDaily(`getAllHosts:error:${JSON.stringify(error)}`);
    }
    else {
        allHosts = hosts || [];
        logDaily(`getAllHosts:success:${allHosts.length}`);		
    }

	onceAday.start();
	//every10Min.start();
	//every30Min.start();
	//onceAdayMedsInvs.start();
	//medsInvsOrders.start();
	 //every4Hours.start();
	//medi_notify.start();----
})();

// 86400000 Delay For day Interval
// 600000    Delay For 10 Min
// 1800000	Delay For 30 Min
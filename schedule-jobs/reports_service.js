const cron = require('node-cron');
const mongoMapper = require('../db-config/helper-methods/mongo/mongo-helper');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const _mUtils = require('../constants/mongo-db/utils');
//const BSON = require('bson')
const _orgDetails = require("../routes/mongo/patientcare/constants/organizations");

const _client = {
    "orgId": 1002,
    "locId": 1047,
    "orgKey": "emr",
}

const dirPath = appConfig.DIR_PATH;


// Logging Configuration
const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/reports/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/errorLogs/reports/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const loggerInfo = winston.createLogger({ transports: loggingTransports });
const errloggerInfo = winston.createLogger({ transports: errorLoggingTransports });

// Logging Function
async function logMessage(level, message) {
    if (level === 'error') {
        errloggerInfo.error(message);
    } else {
        loggerInfo.info(message);
    }
    return true;
}

// MongoDB Helper Functions
function getMongoData(collection, action ,filter, db) {
    console.log("get")
    return mongoMapper(collection, action, filter, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                console.log('info', `No records found in ${collection}`)
                logMessage('info', `No records found in ${collection}`);
                return { success: false, data: [], desc: `No records found in ${collection}` };
            }
            console.log("success")

            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {
            logMessage('error', `Failed to find records in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

function insertMongoData(collection, action,params, db) {
    return mongoMapper(collection, action, params, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                console.log("error")
                logMessage('error', `Error occurred while inserting data in ${collection}`);
                return { success: false, data: [], desc: `Error occurred while inserting data in ${collection}` };
            }
            //console.log("insertSuccess", response.data)
            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {
           
            logMessage('error', `Failed to insert data in ${collection} -- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

function updateMongoData(collection, param, db) {
    return _mUtils.preparePayload('U', param)
        .then(pLoadResp => {
            if (!pLoadResp.success) {
                logMessage('error', `Error While preparing payload: ${pLoadResp.error}`);
                return { success: false, data: [], desc: pLoadResp.error };
            }
            return mongoMapper(collection, 'findOneAndUpdate', pLoadResp.payload, db);
        })
        .then(updateResult => {
		console.log("updateResult",updateResult)
            if (!updateResult.status || updateResult.status !== 'SUCCESS') {
                logMessage('info', `Failed to update record in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id}`);
                return { success: false, data: [], desc: `Failed to update record in ${collection}` };
            }
            logMessage('info', `Record updated successfully in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id}`);
            return { success: true, data: updateResult, desc: [] };
        })
        .catch(error => {
            logMessage('error', `Failed to update record in ${collection} UMR:--${param.params.umr}--ERROR:- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

async function generateReports() {
    console.log("generateReports")
    let _filter = {
        "filter": {
            "recStatus": { $eq: true },
        }
    }

    let requestResult = await getMongoData('patient_care_reportrequests', "find",_filter, 'emr');
    if (!requestResult.success) {
        await logMessage('info', `No Requests found `);
        return;
    }
    
    for(let request of requestResult.data){
        let _fromDt = request.timePeriod.startDt
        let _toDt = request.timePeriod.endDt
        let _reportData;
        if(request.reportType == 'Dash board'){
            _reportData =  await getDashBoardReport(_fromDt, _toDt)
          //console.log("_reportData", _reportData)
        }
        //let reportSize = BSON.calculateObjectSize(_reportData.data)/(1024 ** 2)
        let _updateParams = {
            params: {
                _id: request._id,
                recStatus: false,
                staus: "COMPLETED"
            }
        };

        let requestUpdateResult = await updateMongoData('patient_care_reportrequests', _updateParams, 'emr');
        if (!requestUpdateResult.success) {
            console.log(`Error While updating request: ${requestUpdateResult.desc}`)
            await logMessage('error', `Error While updating request: ${requestUpdateResult.desc}`);
        }
        let _data = _.filter(_orgDetails, (o) => { return o.orgId === _client.orgId });
        //console.log("_data", _data)
        let _finalResp = []
        _.each(_reportData.data[0], (_val, _key) => {
            if (_val.length == 0) {
                _val.push({ 'count': 0 })
            }
            let _cd = _.filter(_data[0].reports, (_c) => { return _c.cd == _key })
            _cd[0]['count'] = _val[0].count
            _finalResp.push(_cd[0])
        })
        //console.log("_finalResp", _finalResp)
        let _prms = {
            requestId: request._id,
            requestDt: request.requestDt,
            reportType: request.reportType,
            timePeriod: {
                startDt: request.timePeriod.startDt,
                endDt: request.timePeriod.endDt
            },
            generatedData:_finalResp,
            //reportSize: reportSize,
            generatedAt: _reportData.generatedAt,
            recStatus: true
        }

        let insertReport = await insertMongoData('patient_care_reports', 'insertMany',_prms, 'emr');
        if (!insertReport.success) {
            console.log(`Error While inserting report: ${insertReport.desc}`)
            await logMessage('error', `Error While inserting report: ${insertReport.desc}`);
        }
         
    }

};

async function getDashBoardReport(_fromDt, _toDt){
    //let _date = moment().format('YYYY-MM-DD')
    _fromDt = _fromDt.split('T')[0]
    _toDt = _toDt.split('T')[0]
    _filter = {
        "filter": [
            {
                $facet: {
                    NewSurgeries: [
                        {
                            $match: {
                                surgeries: {
                                    $elemMatch: {
                                        surgDtTm: { $gte: `${_fromDt}`,$lte: `${_toDt}T23:59:59.999Z`  }
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                {$gte: ["$$surgery.surgDtTm", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.surgDtTm", `${_toDt}T23:59:59.999Z`]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    ClosedSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{ $regexMatch: { input: "$$surgery.surgeryClosedDt", regex: `^${_date}` } },
                                                {$gte: ["$$surgery.surgeryClosedDt", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.surgeryClosedDt", `${_toDt}T23:59:59.999Z`]},
                                                { $eq: ["$$surgery.surgeryClosed", true] },
                                                //{ $eq: ["$$surgery.systemClosed", false]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    SystemClosedSurgeries: [

                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{ $regexMatch: { input: "$$surgery.surgeryClosedDt", regex: `^${_date}` } },
                                                {$gte: ["$$surgery.surgeryClosedDt", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.surgeryClosedDt", `${_toDt}T23:59:59.999Z`]},
                                                { $eq: ["$$surgery.surgeryClosed", true] },
                                                { $eq: ["$$surgery.systemClosed", true] }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],
                    OpenSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{$regexMatch: {input: "$$surgery.surgeryClosedDt", regex: "^2024-09"}},
                                                {$gte: ["$$surgery.surgeryClosedDt", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.surgeryClosedDt", `${_toDt}T23:59:59.999Z`]},
                                                { $eq: ["$$surgery.surgeryClosed", false] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],
                    ReopenSurgeries: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{ $regexMatch: { input: "$$surgery.reqRaisedDt", regex: `^${_date}` } },
                                                {$gte: ["$$surgery.reqRaisedDt", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.reqRaisedDt", `${_toDt}T23:59:59.999Z`]},
                                                { $eq: ["$$surgery.isRequest", true] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }

                    ],
                    ReopenSurgeriesApproval: [
                        {
                            $project: {
                                _id: 1,
                                surgeries: {
                                    $filter: {
                                        input: "$surgeries",
                                        as: "surgery",
                                        cond: {
                                            $and: [
                                                //{ $regexMatch: { input: "$$surgery.reqApprovedDt", regex: `^${_date}` } },
                                                {$gte: ["$$surgery.reqApprovedDt", `${_fromDt}` ]},
                                                {$lte: ["$$surgery.reqApprovedDt", `${_toDt}T23:59:59.999Z`]},
                                                { $eq: ["$$surgery.unlockRequest", true] },
                                                //{ $eq: ["$$surgery.systemClosed", true]}
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                matchedCount: { $size: "$surgeries" }
                            }
                        },
                        {
                            $match: { matchedCount: { $gt: 0 } }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: "$matchedCount" }
                            }
                        }
                    ],

                }
            }
        ]
    }
    let dashBoardResult = await getMongoData('patient_care_patients', 'aggregation' ,_filter, 'emr');
    if(!dashBoardResult.success){
        await logMessage('error', `Error while getting dashboard data: ${dashBoardResult.desc}`);
        return;
    }
    return { success: true, data: dashBoardResult.data, desc: [], generatedAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') };
}

// cron.schedule('*/1 * * * *', () => {
//     generateReports()
// });


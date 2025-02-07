const cron = require('node-cron');
const mongoMapper = require('../db-config/helper-methods/mongo/mongo-helper');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const _mUtils = require('../constants/mongo-db/utils');

const dirPath = appConfig.DIR_PATH;

// Logging Configuration
const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/patient_care_surgeries/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/errorLogs/patient_care_surgeries/%DATE%.log`,
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
function getMongoData(collection, filter, db) {
    return mongoMapper(collection, 'find', filter, db)
        .then(result => {
            let response = JSON.parse(JSON.stringify(result));
            if (!response.data || response.data.length === 0) {
                logMessage('info', `No records found in ${collection}`);
                return { success: false, data: [], desc: `No records found in ${collection}` };
            }
            return { success: true, data: response.data, desc: [] };
        })
        .catch(error => {
            logMessage('error', `Failed to find records in ${collection} -- ${error}`);
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
            if (!updateResult.status || updateResult.status !== 'SUCCESS') {
                logMessage('info', `Failed to update record in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id}`);
                return { success: false, data: [], desc: `Failed to update record in ${collection}` };
            }
            logMessage('info', `Record updated successfully in ${collection}, UMR:--${param.params.umr}, _id:--${param.params._id} on ${new Date().toLocaleString()}`);
            return { success: true, data: updateResult, desc: [] };
        })
        .catch(error => {
            logMessage('error', `Failed to update record in ${collection} UMR:--${param.params.umr}--ERROR:- ${error}`);
            return { success: false, data: [], desc: error };
        });
}

// Main Function to Close Surgeries
async function closeSurgery() {
    let formattedDate = moment().subtract(14, 'days').format('YYYY-MM-DD');
    await logMessage('info', `----- Service Started for Closing of Surgeries done on ${formattedDate}, By System on ${new Date().toLocaleString()}-----`);
    let surgeryFilter = {
        filter: {
            'admns.surgDtls.patInfo.surgDtTm': { $regex: `^${formattedDate}` },
            'admns.surgDtls.surgeryClosed': false
        }
    };

    let surgeryResult = await getMongoData('patient_care_surgeries', surgeryFilter, 'emr');
    if (!surgeryResult.success) {
        await logMessage('info', `No Surgeries found on ${formattedDate} in Surgery Level`);
        return;
    }

    let surgeries = surgeryResult.data;
    for (let surgery of surgeries) {
        if (surgery.admns) {
            for (let _admn of surgery.admns) {
                if (_admn.surgDtls) {
                    let _surgeries = _.filter(_admn.surgDtls, _surg => {
                        let _surgDt = _surg.patInfo.surgDtTm.split('T')[0];
                        return _surgDt === formattedDate && !_surg.surgeryClosed;
                    });

                    for (let _surg of _surgeries) {
                        let _prms = {
                            params: {
                                _id: surgery._id,
                                umr: surgery.umr,
                                admns: [
                                    {
                                        _id: _admn._id,
                                        surgDtls: [
                                            {
                                                _id: _surg._id,
                                                surgeryClosed: true,
                                                systemClosed: true,
                                                surgeryClosedId: '',
                                                surgeryClosedBy: 'system',
                                                surgeryClosedDt: new Date().toISOString(),
                                                reviewDt: '',
                                                reviewRemarks: ''
                                            }
                                        ]
                                    }
                                ]
                            }
                        };

                        let updateResult = await updateMongoData('patient_care_surgeries', _prms, 'emr');
                        if (!updateResult.success) {
                            await logMessage('error', `Error updating surgery: ${updateResult.desc}`);
                            continue;
                        }

                        // Update Patient Record
                        await updatePatientRecord(_prms, formattedDate);
                    }
                }
            }
        }
    }
    await logMessage('info', `------ Service End for Closing of Surgeries done on ${formattedDate}, By System on  ${new Date().toLocaleString()}-------`);
}

// Update Patient Record Function
async function updatePatientRecord(surgeryParams, formattedDate) {
    let patientFilter = {
        filter: {
            umr: surgeryParams.params.umr,
            'surgeries.surgId': surgeryParams.params.admns[0].surgDtls[0]._id
        }
    };

    let patientResult = await getMongoData('patient_care_patients', patientFilter, 'emr');
    if (!patientResult.success) {
        await logMessage('info', `No Surgeries found on ${formattedDate} in Patient Level`);
        return;
    }

    let patient = patientResult.data[0];
    for (let surg of patient.surgeries) {
        let surgDt = surg.surgDtTm.split('T')[0];
        if (surg && surgDt === formattedDate && !surg.surgeryClosed) {
            let _params = {
                params: {
                    _id: patient._id,
                    umr: patient.umr,
                    surgeries: [
                        {
                            _id: surg._id,
                            surgeryClosed: true,
                            systemClosed: true,
                            surgeryClosedId: '',
                            surgeryClosedBy: 'system',
                            surgeryClosedDt: new Date().toISOString(),
                            reviewDt: '',
                            reviewRemarks: ''
                        }
                    ]
                }
            };
            let patientUpdateResult = await updateMongoData('patient_care_patients', _params, 'emr');
            if (!patientUpdateResult.success) {
                await logMessage('error', `Error While updating patient: ${patientUpdateResult.desc}`);
            }
        }
    }
}

// Schedule the Cron Job
cron.schedule('0 23 * * *', () => {
    closeSurgery();
});

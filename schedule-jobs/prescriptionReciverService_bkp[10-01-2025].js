
const _ = require('lodash');
const mongoose = require('mongoose');
//const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _mUtils = require("../constants/mongo-db/utils");

//const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const dirPath = appConfig.DIR_PATH;


const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/prescriptionReciverService_log/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/prescriptionReciverService_log/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const loggerInfo = winston.createLogger({ transports: loggingTransports });
const errloggerInfo = winston.createLogger({ transports: errorLoggingTransports });

// Logging Function
async function logMessage(level, message) {
    try {
        if (level === 'error') {
            errloggerInfo.error(message);
        } else {
            loggerInfo.info(message);
        }
        return true;
    } catch (error) {
        console.error(`Failed to log message: ${logError.message}`)
    }
}

async function updatePrescriptionStatus(dbName, prescriptionId) {
    let _filter = {
        filter: { recStatus: { $eq: true }, _id: mongoose.Types.ObjectId(prescriptionId), status: "Sent to Manufacturer" },
        selectors: "-history -audit",
    };
    let glassPrescriptions = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "find", _filter, "", "", "", dbName)
    if (!(glassPrescriptions && glassPrescriptions.success && glassPrescriptions.data && glassPrescriptions.data.length > 0)) {
        let errorMsg = `No glassPrescriptions records found with given Filter : _id:ObjectId(${prescriptionId}), status: "Sent to Manufacturer"}`;
        await logMessage('Error', errorMsg);
        //console.log(`${"no glassPrescriptions records found with recStaus true for processing"}`);
        return false;
    }

    let _updtPrms = {
        "params": {
            _id: glassPrescriptions.data[0]._id,
            status: "Received from Manufacturer"
        }
    }
    let _pLoadResp = await _mUtils.preparePayload("U", _updtPrms);
    if (!_pLoadResp.success) {
        let errorMsg = `Failed to update glassPrescriptions status for _id ${glassPrescriptions.data[0]._id} : ${pLoadResp.desc}`;
        await logMessage('error', errorMsg);
        return false
    }
    let _orResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassPrescriptions", "findOneAndUpdate", _pLoadResp.payload, "", "", "", dbName)
    if (!(_orResp && _orResp.success)) {
        let errorMsg = `Error updating glassPrescriptions status for _id ${glassPrescriptions.data[0]._id} : ${error}`;
        await logMessage('error', errorMsg);
        //console.log(`${"update status in mongo error"}`);
        return false;
    }
    return true;
}

async function updateOrderRecStatus(dbName, orderId, prescriptionId) {
    let _updtStsPrms = {
        "params": {
            _id:  mongoose.Types.ObjectId(orderId),
            recStatus: false
        }
    }
    try {
        let pLoadResp = await _mUtils.preparePayload("BW", _updtStsPrms);
        if (!pLoadResp.success) {
            let errorMsg = `Failed to update recStatus for _id ${orderId} : ${pLoadResp.desc}`;
            await logMessage('error', errorMsg);
            return false
        }
        let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassOrdersReceivals", "bulkWrite", pLoadResp.payload, "", "", "", dbName)
        if (!(_mResp && _mResp.success)) {
            let errorMsg = `Error updating recStatus in mongo for _id ${orderId} : ${error}`;
            await logMessage('error', errorMsg);
            return false;
        }
        return true;
    } catch (error) {
        let errorMsg = `Error at updateOrderRecStatus while updating recStatus for _id ${record._id} : ${error}`;
        await logMessage('error', errorMsg);
        return false;
    }
}

async function getdata(dbName) {
    //console.log("inside getdata");
    let _filter = {
         filter: { recStatus: { $eq: true } },
        "limit": 500,
        selectors: "-history -audit",
    };
    try {
        let glassordersreceivals = await _mUtils.commonMonogoCall("ophthamology_ecg_GlassOrdersReceivals", "find", _filter, "", "", "", dbName)
        if (!(glassordersreceivals && glassordersreceivals.success && glassordersreceivals.data && glassordersreceivals.data.length > 0)) {
            await logMessage('info', `No records found with recStaus true for processing, ${glassordersreceivals.desc}.`);
            return;
        }
        for (const record of glassordersreceivals.data) {
            const prescriptionId = record.glassPrescriptionId
            const orderId = record._id;

            if (!prescriptionId || !orderId) {
                await logMessage('Error', `missing required fields in record like glassPrescriptionId and _id`);
                //console.log("missing required fields in record")
            }

            const prescriptionUpdate = await updatePrescriptionStatus(dbName, prescriptionId);
            if (prescriptionUpdate) {
                const orderUpdate = await updateOrderRecStatus(dbName, orderId, prescriptionId);
                if (orderUpdate) {
                    await logMessage('info', `Successfully updated recStatus for record: ${orderId} and updated presecription: ${prescriptionId}.`);
                } else {
                    await logMessage('Error', `Failed to update recstatus for ${orderId}`);
                }
            } else {
                await logMessage('info', `Failed to update glassprescriptions status for ${prescriptionId}.`);
            }
        }
    } catch (error) {
        await logMessage('Error', `Error fetching data from mongoDB: ${error.message}`)
    }

}


setInterval(() => {
    getdata("shoptha");
}, 300000);//600000-10min 300000-5min
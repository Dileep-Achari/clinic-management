
const _ = require('lodash');
const mongoose = require('mongoose');
const cron = require('node-cron');
const _mUtils = require("../constants/mongo-db/utils");

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../app-config');
const dirPath = appConfig.DIR_PATH;


const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/orderIdCounter_log/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/orderIdCounter_log/%DATE%.log`,
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

async function resetCounter(dbName) {
    const todayDate = new Date().toISOString().slice(0, 10);
    try {
        let _filter = {
            filter: { seqName: "OrderId" },
            selectors: "",
        };
        let getCounterData = await _mUtils.commonMonogoCall("ophthamology_ecg_counters", "find", _filter, "", "", "", dbName)
        if (!(getCounterData && getCounterData.success && getCounterData.data && getCounterData.data.length > 0)) {
            await logMessage('info', `No matching counters found for reset, ${getCounterData.desc}.`);
            return;
        }
        for (const record of getCounterData.data) {

            const lastResetDate = record.lastResetDate ? record.lastResetDate.slice(0, 10) : null;

            if (lastResetDate === todayDate) {
                await logMessage('Info', `Counter already reset for todayDate: ${record.lastResetDate}, _id:${record._id}`);
                return;
            }
            else {
                let _updtCounterPrms = {
                    "params": {
                        _id: mongoose.Types.ObjectId(record._id),
                        seqValue: 0,
                        lastResetDate: new Date().toISOString()
                    }
                }
                let pLoadResp = await _mUtils.preparePayload("BW", _updtCounterPrms);
                if (!pLoadResp.success) {
                    let errorMsg = `Failed to update seqValue for _id ${record._id} : ${pLoadResp.desc}`;
                    await logMessage('error', errorMsg);
                    //continue;
                }
                let _mResp = await _mUtils.commonMonogoCall("ophthamology_ecg_counters", "bulkWrite", pLoadResp.payload, "", "", "", dbName)
                if (!(_mResp && _mResp.success)) {
                    let errorMsg = `Error updating seqValue in mongo for _id ${record._id} : ${error}`;
                    await logMessage('error', errorMsg);
                } else {
                    await logMessage("info", `Successfully reset seqValue for counter ${record._id} with seqName ${record.seqName}`)
                    return;
                }
            }

        }
    } catch (error) {
        await logMessage('Error', `Error fetching data from mongoDB: ${error.message}`)
    }

}


cron.schedule('0 0 * * *', async () => {//0 0 * * * every day
    const startTime = new Date().toISOString();
    await logMessage("info", `Daily reset job started at: ${startTime}`);
    resetCounter("suv").then(async () => {
        await logMessage("info", `Reset job completed successfully at: ${new Date().toISOString()}`);
    }).catch(async (error) => {
        await logMessage("info", `Reset job failed at: ${new Date().toISOString()}, error: ${error}`);
    })
});
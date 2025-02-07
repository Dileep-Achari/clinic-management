const fs = require("./fs");
const appConfig = require("../app-config");
const winston = require('winston');
require('winston-daily-rotate-file');

//let basePath = appConfig.DIR_PATH + 'public/logs/winston/';

let basePath = '/appdata/logs/sms/';

function createTransport(path) {
    return new (winston.transports.DailyRotateFile)({
        level: "info",
        filename: (path + '/%DATE%.log'),
        datePattern: 'MMM-DD-YYYY',
        maxSize: '10m',
        maxFiles: '3d',
        zippedArchive: true
    });
}

function createLogger(winPath) {
    const newPath = basePath + winPath + "/";
    const created = fs.creteDirIfNotExist(newPath);
    if (!created) console.log("error:invalid path:" + newPath + ":while creating directory in services/winston.js file")
    return winston.createLogger({
        format: winston.format.json(),
        transports: [createTransport(newPath)]
    });
}

module.exports = (winstonPath) => {
    return createLogger(winstonPath);
}

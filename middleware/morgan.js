const appConfig = require("../app-config");
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require("../services/fs");
let sufxPath = `public/logs/morgan/`;

module.exports = (app, _module, isLog) => {
    if (isLog) {
        sufxPath = `${sufxPath}${_module}`;
        const _newDirPath = appConfig.DIR_PATH + sufxPath;
        const created = fs.creteDirIfNotExist(_newDirPath);
        if (!created) console.log("error:invalid path:" + _newDirPath + ":while creating directory in middileware/morgan.js file")
        const logDirectory = path.join(appConfig.DIR_PATH, sufxPath);
        var accessLogStream = rfs('access.txt',
            {
                path: logDirectory,
                interval: '1d',//s, m, h, d
                size: '10M',//B, K, M, G
                maxFiles: 30,
                compress: 'gzip'
            },
            {
                flags: 'a'
            }
        );
        morgan.token('payload', function (req, res) { return JSON.stringify(req.body || req.params || req.query) });
        app.use(morgan('{ "REMOTE_ADDRESS":\':remote-addr\', "REMOTE_USER":\':remote-user\', "DATE":\':date[web]\', "METHOD":\':method\', "URL":\':url\', "HTTP":\':http-version\', "STATUS":\':status\', "LENGTH":\':res[content-length]\', "REFERRER":\':referrer\', "USER_AGENT":\':user-agent\', "RESPONSE_TYPE":\':response-time ms\', "PAYLOAD":\':payload\' },',
            { stream: accessLogStream })
        );
    }
};
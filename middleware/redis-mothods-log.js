const config = require('../app-config');
const axios = require('../services/axios');
const env = process.env.CUSTOM_NODE_ENV || config.NODE_ENV;


function redisMethodsLog(req, res, next) {
    if (config.LOG_METHOD_COUNT === 'Y') {
        let apkurl = req.url;
        if (apkurl.indexOf("?") > -1) {
            apkurl = apkurl.substring(0, apkurl.indexOf("?"));
        }
        let sparams = {
            "key": config.HOST + '.count.' + env.toUpperCase() + apkurl.replace(/\//g, '.'),
            "data": 0,
            "expire": true,
            "tte": 259200
        };
        axios.post(config.REDIS_URL + 'increKey', { "key": sparams.key }).then((result) => {
            if (result && result.error) {
                console.log(`Error While Update count message:- ${ex.message}`);
            }
            next();
        }).catch(ex => {
            console.log(`Error While Update count message:- ${ex.message}`);
            next();
        });
    }
    else {
        next();
    }
}

module.exports = (app) => {
    app.use(redisMethodsLog);
}
const axios = require('axios');
const https = require('https');
const constTimeout = 60000;

axios.defaults.timeout = constTimeout;

/*
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
*/

module.exports = {
    post: function (url, params, config) {
        return new Promise((resolve, reject) => {
            try {
                if (!params) params = {};
                axios.post(url, params, (config || null), { timeout: constTimeout }).then(function (res) {
                    resolve(res.data || []);
                }).catch(function (err) {
                    reject(err.response ? err.response : err);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    get: function (url, params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params) params = {};
                // To disable SSL Certificae Warnings at request level
                params.httpsAgent = new https.Agent({ rejectUnauthorized: false });
                axios.get(url, params, { timeout: constTimeout }).then(function (res) {
                    resolve(res.data || []);
                }).catch(function (err) {
                    reject(err.response ? err.response : err);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    get_v1: function (url, params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params) params = {};
                // To disable SSL Certificae Warnings at request level
                params.httpsAgent = new https.Agent({ rejectUnauthorized: false });

                axios.get(url, params, { timeout: constTimeout }).then(function (res) {
                    resolve({ status: res.status, desc: res.statusText, data: (res || []) });
                }).catch(function (err) {
                    reject({ status: 500, desc: err.response ? err.response : err, data: [] });
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
}
const axios = require('./axios');
const appCinfig = require('../app-config');

function getDate() {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let dt = new Date();
    dt = new Date(new Date(dt).setMinutes(new Date(dt).getMinutes() - (appCinfig.TIMEZONE_OFFSET)));
    return `${dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()} ${month[dt.getMonth()]} ${dt.getFullYear()} ${(dt.getHours() > 9 ? dt.getHours() : "0" + dt.getHours())}:${(dt.getMinutes() > 9 ? dt.getMinutes() : "0" + dt.getMinutes())}`
}

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        if (appCinfig.SLACK_ENABLE) {

            if (typeof message !== 'string') {
                message = JSON.stringify(message);
            }

            const params = {
                "text": `${message}, ${getDate()}`
            };

            axios.post(appCinfig.SALCK_URL, params).then((res) => {
                resolve(true);
            }).catch((err) => {
                console.log(`SLACK message sending error, message:- ${message}, Error:- ${err.message}\n`);
                resolve(true);
            });
        }
        else {
            resolve(true);
        }
    });
}
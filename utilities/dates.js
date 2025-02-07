const appConfig = require("../app-config");
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function currentDate(type) {
    if (!type) type = 24
    let dt = new Date();
    dt = new Date(new Date(dt).setMinutes(new Date(dt).getMinutes() - (appConfig.TIMEZONE_OFFSET)));
    if (type === 24) {
        return `${dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()} ${month[dt.getMonth()]} ${dt.getFullYear()} ${(dt.getHours() > 9 ? dt.getHours() : "0" + dt.getHours())}:${(dt.getMinutes() > 9 ? dt.getMinutes() : "0" + dt.getMinutes())}`
    }
    else {
        return `${dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()} ${month[dt.getMonth()]} ${dt.getFullYear()} ${formatAMPM(dt)}`
    }

}

function formattedDate(dt, time) {
    // date, time, dateTime, dateTime12, time12
    dt = new Date(dt);
    dt = new Date(new Date(dt).setMinutes(new Date(dt).getMinutes() - (appConfig.TIMEZONE_OFFSET)));
    if (time) {
        return `${dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()} ${month[dt.getMonth()]} ${dt.getFullYear()} ${formatAMPM(dt)}`;
    }
    return `${dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate()} ${month[dt.getMonth()]} ${dt.getFullYear()}`
}

module.exports = {
    currentDate,
    formattedDate
}
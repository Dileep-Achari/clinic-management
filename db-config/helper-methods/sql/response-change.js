'use strict';
const appointments = require("../../models/sql/appointments/response-change");
const fbSmsEmail = require("../../models/sql/console-application/fb-sms-email/response-change");

module.exports = (data, params) => {
    if (params.MODULE === 'APPOINTMENTS') {
        if (params.IS_MULTI_RESULTSET === 'Y')
            return data;
        else if (appointments && appointments[params.URL])
            return appointments[params.URL](data, params.IS_LOAD_AJAX);
        else return data;
    }
    else if (params.MODULE === 'FB_SMS_EMAIL') {
        if (fbSmsEmail && fbSmsEmail[params.URL])
            return fbSmsEmail[params.URL](data, params.IS_LOAD_AJAX, params.IS_MULTI_RESULTSET);
        else return data;
    }
    else {
        return data;
    }
}
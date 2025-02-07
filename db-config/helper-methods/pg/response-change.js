'use strict';
const qi = require("../../models/pg/qi/response-change");
const apkMIS = require("../../models/pg/apk-mis/response-change");
const apkDoctor = require("../../models/pg/apk-doctor/response-change");

module.exports = (data, params) => {
    if (params.MODULE === 'QI') {
        if (qi && qi[params.URL]) {
            data.RES_OBJ = qi[params.URL](data.RES_OBJ, params)
            return data;
        }
        else return data;
    }
    else if (params.MODULE === 'APK_MIS') {
        // if (data.RES_OBJ) data = data.RES_OBJ;
        data = data.RES_OBJ;
        if (apkMIS && apkMIS[params.URL]) {
            data = apkMIS[params.URL](data, params);
            return data;
        }
        else return data;
    }
    else if (params.MODULE === 'APK_DOCTOR') {
        // if (data.RES_OBJ) data = data.RES_OBJ;
        data = data.RES_OBJ;
        if (apkDoctor && apkDoctor[params.URL]) {
            data = apkDoctor[params.URL](data, params);
            return data;
        }
        else return data;
    }
    else {
        return data;
    }
}
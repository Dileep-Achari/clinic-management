'use strict';
const qi = require("../../models/pg/qi/generate-paramaters");
const apkMIS = require("../../models/pg/apk-mis/generate-paramaters");
const apkDoctor = require("../../models/pg/apk-doctor/generate-paramaters");

module.exports = (params, cParams) => {
    if (cParams.MODULE === "QI") {
        if (qi && qi[cParams.URL])
            return qi[cParams.URL](params, cParams);
        else return params;
    }
    else if (cParams.MODULE === "APK_MIS") {
        if (apkMIS && apkMIS[cParams.URL])
            return apkMIS[cParams.URL](params, cParams);
        else return params;
    }
    else if (cParams.MODULE === "APK_DOCTOR") {
        if (apkDoctor && apkDoctor[cParams.URL])
            return apkDoctor[cParams.URL](params, cParams);
        else return params;
    }
    else {
        return params;
    }
}
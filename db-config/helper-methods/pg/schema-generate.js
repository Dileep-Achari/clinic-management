'use strict';
const qi = require("../../models/pg/qi/schema");
const apkMIS = require("../../models/pg/apk-mis/schema");
const apkDoctor = require("../../models/pg/apk-doctor/schema");

module.exports = (__module) => {
    if (__module === "QI") return qi;
    else if (__module === "APK_MIS") return apkMIS;
    else if (__module === "APK_DOCTOR") return apkDoctor;
    else return {};
}
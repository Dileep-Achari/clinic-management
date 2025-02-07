'use strict';
module.exports = {
    insUpdMobileVcLogin: {
        SpName: "UPR_INSUPD_MOBILE_VC_LOGIN",
        Schema: [{ type: "VARCHAR", column: "MOBILE_NUMBER", direction: "IN", alias: "MOBILE_NUMBER" },
        { type: "VARCHAR", column: "DEVICEID", direction: "IN", alias: "DEVICEID" },
        { type: "VARCHAR", column: "FCMID", direction: "IN", alias: "FCMID" },
        { type: "VARCHAR", column: "IMEI", direction: "IN", alias: "IMEI" },
        { type: "VARCHAR", column: "otp", direction: "IN", alias: "otp" },
        { type: "CHAR", column: "flag", direction: "IN", alias: "flag" }],
        Server: "SQL", Database: "APPT"
    },
    uprGetSlotApmntMob: {
        SpName: "UPR_GET_SLOT_APMNT_MOB",
        Schema: [{ type: "VARCHAR", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "MOBILE_NO", direction: "IN", alias: "MOBILE_NO" }],
        Server: "SQL", Database: "APPT"
    },

}
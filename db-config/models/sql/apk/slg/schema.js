'use strict';
module.exports = {
    getAllSpecialities: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDocSchTimes: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "olrId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "fromDt", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "toDt", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDoctorsBySplciality: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "spcltyId", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getSlots: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "docId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "aptDate", direction: "IN", alias: "IP_PARAM4" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    bookAppointment: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "slotId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "patName", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "mobileNo", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "emailId", direction: "IN", alias: "IP_PARAM5" },
        { type: "VARCHAR", column: "genderCd", direction: "IN", alias: "IP_PARAM6" },
        { type: "VARCHAR", column: "stateName", direction: "IN", alias: "IP_PARAM7" },
        { type: "VARCHAR", column: "cityName", direction: "IN", alias: "IP_PARAM8" },
        { type: "VARCHAR", column: "patId", direction: "IN", alias: "IP_PARAM9" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    }
};
'use strict';
module.exports = {
    getAllSpecialities: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getAllSpecialization: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getAllDoctors: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getSpecilizationBySpeciality: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "spcltyId", direction: "IN", alias: "IP_PARAM1" },
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
    getDoctorsBySplcialization: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "spclzId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDoctorById: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "docId", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPatientByUniqueId: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "uniqueId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPatientByMobile: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "mobileNo", direction: "IN", alias: "IP_PARAM2" },
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
    },
    getSlotInfo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "slotId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getSpecialityById: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "spcltyId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getSpecilizationById: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "splczId", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "IP_PARAM13", direction: "IN", alias: "IP_PARAM13" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getSpecialityBySpeclzId: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "spclzId", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "IP_PARAM13", direction: "IN", alias: "IP_PARAM13" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPatientByUniqueIdMobileNo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "uniqueId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "mobileNo", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "flag", direction: "IN", alias: "IP_PARAM13" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDocDetByConsultNo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "consultNo", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDocDetByPatIpNo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "patIpNo", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPatientByUniqueId: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "uniqueId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getConsltDtlsByUniqueId: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "uniqueId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getUmrDtlsFrmMobNo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "mobileNo", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getOpOrIpDtlsByUniqueIdMobileNo: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "uniqueId", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "mobileNo", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "patType", direction: "IN", alias: "IP_PARAM13" },
        { type: "VARCHAR", column: "reqType", direction: "IN", alias: "IP_PARAM12" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    }
};
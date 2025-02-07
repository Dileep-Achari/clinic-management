'use strict';
module.exports = {
    getAllLocations: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getAllSpecialities: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
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
        Schema: [{ type: "VARCHAR", column: "SPECIALITY_ID", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
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
        Schema: [{ type: "VARCHAR", column: "DOC_ID", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "FROM_DATE", direction: "IN", alias: "IP_PARAM4" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
		{ type: "VARCHAR", column: "TO_DATE", direction: "IN", alias: "IP_PARAM5" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    bookAppointment: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "SLOT_ID", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "PATIENT_NAME", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "MOBILE_NO", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "EMAIL_ID", direction: "IN", alias: "IP_PARAM5" },
        { type: "VARCHAR", column: "GENDER_CD", direction: "IN", alias: "IP_PARAM6" },
        { type: "VARCHAR", column: "stateName", direction: "IN", alias: "IP_PARAM7" },
        { type: "VARCHAR", column: "cityName", direction: "IN", alias: "IP_PARAM8" },
        { type: "VARCHAR", column: "PATIENT_ID", direction: "IN", alias: "IP_PARAM9" },
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
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getConsltDtlsByUniqueId: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "IP_PARAM1" },
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
    },
    rescheduleAppointment: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "OLD_SLOT_ID", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "NEW_SLOT_ID", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "REMARKS", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    cancelAppointment: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "SLOT_ID", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "REMARKS", direction: "IN", alias: "IP_PARAM3" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getReportAsBase64: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "SLOT_ID", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	getDoctorHolidays: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "OLR_ID", direction: "IN", alias: "IP_PARAM1" },
        { type: "VARCHAR", column: "HOLIDAY_TYPE", direction: "IN", alias: "IP_PARAM2" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDissumReportAsBase64: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "IP_PARAM1" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getAdmissionByUMR: {
        SpName: "UPR_GET_MOBILE_API_DATA",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "IP_PARAM1" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "VARCHAR", column: "LOOKUP_NAME", direction: "IN", alias: "LOOKUP_NAME" },
        { type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" }],
        Server: "SQL", Database: "APPT"
    },
	getAllDoctor: {
        SpName: "UPR_GETALL_DOCTOR",
        Schema: [{ type: "VARCHAR", column: "IP_RSRC_ID", direction: "IN", alias: "IP_RSRC_ID" },
        { type: "VARCHAR", column: "IP_OLR_ID", direction: "IN", alias: "IP_OLR_ID" },
        { type: "VARCHAR", column: "IP_DOC_NAME", direction: "IN", alias: "IP_DOC_NAME" },
        { type: "VARCHAR", column: "IP_SPECIALITY_ID", direction: "IN", alias: "IP_SPECIALITY_ID" },
        { type: "VARCHAR", column: "IP_TYPE", direction: "IN", alias: "IP_TYPE" },
        { type: "VARCHAR", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "VARCHAR", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "VARCHAR", column: "IP_GENDER_CD", direction: "IN", alias: "IP_GENDER_CD" },
        { type: "INT", column: "PAGENUM", direction: "IN", alias: "PAGENUM" },
        { type: "INT", column: "PAGE_SIZE", direction: "IN", alias: "PAGE_SIZE" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
     uprInsupdHisLog: {
        SpName: "UPR_INSUPD_HIS_MSG_LOG",
        Schema: [{ type: "VARCHAR", column: "orgId", direction: "IN", alias: "ORG_ID" },
        { type: "VARCHAR", column: "locId", direction: "IN", alias: "LOC_ID" },
        { type: "VARCHAR", column: "orgName", direction: "IN", alias: "ORG_NAME" },
        { type: "VARCHAR", column: "locName", direction: "IN", alias: "LOC_NAME" },
        { type: "VARCHAR", column: "type", direction: "IN", alias: "MSG_TYPE" },
		    { type: "VARCHAR", column: "context", direction: "IN", alias: "CONTEXT" },
        { type: "BIGINT", column: "count", direction: "IN", alias: "MSG_CNT" },
        { type: "DATE", column: "date", direction: "IN", alias: "MSG_DT" }],
        Server: "SQL", Database: "APPT"
    },
    uprGetHisLog: {
        SpName: "UPR_GET_HIS_MSG_LOG",
        Schema: [{ type: "VARCHAR", column: "orgName", direction: "IN", alias: "ORG_NAME" },
        { type: "VARCHAR", column: "msgType", direction: "IN", alias: "MSG_TYPE" },
		    { type: "DATE", column: "fromDate", direction: "IN", alias: "FROM_DT" },
        { type: "DATE", column: "toDate", direction: "IN", alias: "TO_DT" }],
        Server: "SQL", Database: "APPT"
    },
      getMedicationsBySlotId: {
        SpName: "UPR_GET_MEDICATION_BY_UMR",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" },
        { type: "BIGINT", column: "SLOT_ID", direction: "IN", alias: "SLOT_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPaDocLocSlotDet: {
        SpName: "UPR_GET_SLOTS_BY_OLR",
        Schema: [{ type: "BIGINT", column: "OLR_ID", direction: "IN", alias: "OLR_ID" },
        { type: "DATE_TIME_2", column: "IP_APMNT_DT", direction: "IN", alias: "IP_APMNT_DT" },
        { type: "CHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "CHAR", column: "SPEC_UNIT", direction: "IN", alias: "SPEC_UNIT" }],
        Server: "SQL", Database: "APPT"
    },
      getPatientDataCems: {
        SpName: "UPR_GET_PATIENT_DETAILS",
        Schema: [{ type: "BIGINT", column: "PAT_DET_ID", direction: "IN", alias: "PAT_DET_ID" }],
        Server: "SQL", Database: "CEMS"
    },
    uprInsupdCemsSmsLog: {
        SpName: "UPR_INSUPD_CEMS_SMS_LOG",
        Schema: [{ type: "N_VARCHAR", column: "JSON", direction: "IN", alias: "JSON" }],
        Server: "SQL", Database: "CEMS"
    },
	  uprGetCemsSmsLog: {
        SpName: "UPR_GET_CEMS_SMS_LOG",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" }],
        Server: "SQL", Database: "CEMS"
    },
};
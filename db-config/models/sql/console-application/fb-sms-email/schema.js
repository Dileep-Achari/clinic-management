'use strict';
module.exports = {
    getTmpQsDtlsMbl: {
        SpName: "UPR_GET_TEMPLATE_QSDTLS_MBL",
        Schema: [{ type: "BIGINT", column: "TEMPLATE_ID", direction: "IN", alias: "TEMPLATE_ID" },
        { type: "VARCHAR", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
		{ type: "CHAR", column: "LANG_FLAG", direction: "IN", alias: "LANG_FLAG" }],
        Server: "SQL", Database: "FB"
    },
    insUpdFormData: {
        SpName: "UPR_INSUPD_FEEDBACK_FORM_MOBILE",
        Schema: [{ type: "BIGINT", column: "FEEDBACK_ID", direction: "IN", alias: "FEEDBACK_ID" },
        { type: "BIGINT", column: "PATIENT_ID", direction: "IN", alias: "PATIENT_ID" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "ADMIN_NO", direction: "IN", alias: "ADMIN_NO" },
        { type: "BIGINT", column: "TEMPLATE_ID", direction: "IN", alias: "TEMPLATE_ID" },
        { type: "VARCHAR", column: "QUESTION_ID", direction: "IN", alias: "QUESTION_ID" },
        { type: "VARCHAR", column: "QUESTION_GROUP_ID", direction: "IN", alias: "QUESTION_GROUP_ID" },
        { type: "VARCHAR", column: "CV_SCORE", direction: "IN", alias: "CV_SCORE" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "VARCHAR", column: "REMARKS", direction: "IN", alias: "REMARKS" },
        { type: "CHAR", column: "SOURCE_FROM", direction: "IN", alias: "SOURCE_FROM" },
        { type: "VARCHAR", column: "CONTROL_VAL_ID", direction: "IN", alias: "CONTROL_VAL_ID" },
        { type: "VARCHAR", column: "SLOT_ID", direction: "IN", alias: "SLOT_ID" }],
        Server: "SQL", Database: "FB"
    },
    updPatFBdet: {
        SpName: "UPR_UPD_PATIENT_FB_DET",
        Schema: [{ type: "BIGINT", column: "PF_ID", direction: "IN", alias: "PF_ID" },
        { type: "VARCHAR", column: "URL_SHORTNER", direction: "IN", alias: "URL_SHORTNER" },
        { type: "VARCHAR", column: "FB_STATUS", direction: "IN", alias: "FB_STATUS" },
        { type: "VARCHAR", column: "MSG_TEMPL", direction: "IN", alias: "MSG_TEMPL" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "VARCHAR", column: "DEVICE", direction: "IN", alias: "DEVICE" },
        { type: "VARCHAR", column: "OS", direction: "IN", alias: "OS" },
        { type: "VARCHAR", column: "SMS_JOB_NUMBER", direction: "IN", alias: "SMS_JOB_NUMBER" },
        { type: "VARCHAR", column: "SMS_ERROR", direction: "IN", alias: "SMS_ERROR" },
        { type: "VARCHAR", column: "EMAIL_ERROR", direction: "IN", alias: "EMAIL_ERROR" },
        { type: "BIGINT", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL", Database: "FB"
    },
    getPatFbStat: {
        SpName: "UPR_GET_PATIENT_FB_STATUS",
        Schema: [{ type: "VARCHAR", column: "URL_SHORTNER", direction: "IN", alias: "URL_SHORTNER" },
        { type: "BIGINT", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL", Database: "FB"
    },
    getPatFBdet: {
        SpName: "UPR_GET_PATIENT_FB_DET",
        Schema: [{ type: "VARCHAR", column: "FB_STATUS", direction: "IN", alias: "FB_STATUS" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "FB"
    },
    getPatdetQR: {
        SpName: "UPR_GET_PATIENT_QR_DTLS",
        Schema: [{ type: "BIGINT", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getPatDtlsMobUmrNo: {
            SpName: "UPR_GET_MOB_UMRNO",
            Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
            { type: "VARCHAR", column: "MOB_NO", direction: "IN", alias: "MOB_NO" },
            { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
            { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "ORG_ID" },
            { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" },
            { type: "DATE_TIME_2", column: "APMNT_DT", direction: "IN", alias: "APMNT_DT" },
            { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
            Server: "SQL", Database: "APPT"
    },
}
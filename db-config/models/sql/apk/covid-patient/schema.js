'use strict';
module.exports = {

    uprGetUmrValidate: {
        SpName: "UPR_GET_UMR_VALIDATE",
        Schema: [{ type: "VARCHAR", column: "CP_UMR_NO", direction: "IN", alias: "CP_UMR_NO" },
        { type: "VARCHAR", column: "MOBILE_NO", direction: "IN", alias: "MOBILE_NO" },
        { type: "VARCHAR", column: "IMEI_NO1", direction: "IN", alias: "IMEI_NO1" },
        { type: "VARCHAR", column: "IMEI_NO2", direction: "IN", alias: "IMEI_NO2" },
        { type: "VARCHAR", column: "OTP", direction: "IN", alias: "OTP" },
        { type: "VARCHAR", column: "APP_TOKEN", direction: "IN", alias: "APP_TOKEN" },
        { type: "VARCHAR", column: "PASSWORD", direction: "IN", alias: "PASSWORD" },
        { type: "VARCHAR", column: "NEW_PASSWORD", direction: "IN", alias: "NEW_PASSWORD" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "STATUS", direction: "IN", alias: "STATUS" },
        { type: "VARCHAR", column: "RES_OTP", direction: "IN", alias: "RES_OTP" },
        { type: "VARCHAR", column: "DEVICE_ID", direction: "IN", alias: "DEVICE_ID" },
        { type: "VARCHAR", column: "FCM_ID", direction: "IN", alias: "FCM_ID" }],
        Server: "SQL", Database: "APPT"
    },
	
    updLabelTranInfoMob: {
        SpName: "UPR_INSUPD_LABEL_TRAN_INFO_MOB",
        Schema: [{ type: "VARCHAR", column: "LABEL_TRAN_ID", direction: "IN", alias: "LABEL_TRAN_ID" },
        { type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "BIGINT", column: "IP_VISIT_ID", direction: "IN", alias: "IP_VISIT_ID" },
        { type: "VARCHAR", column: "FORM_TYPE_CD", direction: "IN", alias: "FORM_TYPE_CD" },
        { type: "BIGINT", column: "PATIENT_ID", direction: "IN", alias: "PATIENT_ID" },
        { type: "VARCHAR", column: "CONSULTATION_NO", direction: "IN", alias: "CONSULTATION_NO" },
        { type: "BIGINT", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "BIGINT", column: "FORM_ID", direction: "IN", alias: "FORM_ID" },
        { type: "VARCHAR", column: "LABLE_ID", direction: "IN", alias: "LABLE_ID" },
        { type: "VARCHAR", column: "REMARKS", direction: "IN", alias: "REMARKS" },
        { type: "VARCHAR", column: "VAL1", direction: "IN", alias: "VAL1" },
        { type: "VARCHAR", column: "VAL2", direction: "IN", alias: "VAL2" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "BIGINT", column: "VISIT_ID", direction: "IN", alias: "VISIT_ID" },
        { type: "DATE_TIME_2", column: "VISIT_DT", direction: "IN", alias: "VISIT_DT" },
        { type: "VARCHAR", column: "VISIT_STATUS_CD", direction: "IN", alias: "VISIT_STATUS_CD" },
        { type: "VARCHAR", column: "ID_REMARKS", direction: "IN", alias: "ID_REMARKS" },
        { type: "BIGINT", column: "OLR_ID", direction: "IN", alias: "OLR_ID" },
        { type: "VARCHAR", column: "ADDED_BY", direction: "IN", alias: "ADDED_BY" },
        { type: "VARCHAR", column: "COL1", direction: "IN", alias: "COL1" },
        { type: "VARCHAR", column: "COL2", direction: "IN", alias: "COL2" },
        { type: "VARCHAR", column: "REC_CREATE_BY", direction: "IN", alias: "REC_CREATE_BY" },
        { type: "VARCHAR", column: "SHIFT_TYPE", direction: "IN", alias: "SHIFT_TYPE" },
        { type: "DATE_TIME_2", column: "SHIFT_FROM_TIME", direction: "IN", alias: "SHIFT_FROM_TIME" },
        { type: "DATE_TIME_2", column: "SHIFT_TO_TIME", direction: "IN", alias: "SHIFT_TO_TIME" },
        { type: "BIGINT", column: "PARENT_VISIT_ID", direction: "IN", alias: "PARENT_VISIT_ID" },
        { type: "BIGINT", column: "REFERENCE_ID", direction: "IN", alias: "REFERENCE_ID" },
        { type: "BIGINT", column: "REFERENCE_TYPE_ID", direction: "IN", alias: "REFERENCE_TYPE_ID" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "HANDOVR_BY", direction: "IN", alias: "HANDOVR_BY" },
        { type: "VARCHAR", column: "TAKENOVR_BY", direction: "IN", alias: "TAKENOVR_BY" },
        { type: "VARCHAR", column: "APPROVED_BY", direction: "IN", alias: "APPROVED_BY" },
        { type: "DATE_TIME_2", column: "APPROVED_DT", direction: "IN", alias: "APPROVED_DT" },
        { type: "BIGINT", column: "HANDOVR_BYID", direction: "IN", alias: "HANDOVR_BYID" },
        { type: "BIGINT", column: "TAKENOVR_BYID", direction: "IN", alias: "TAKENOVR_BYID" },
        { type: "BIGINT", column: "APPROVED_BYID", direction: "IN", alias: "APPROVED_BYID" },
        { type: "CHAR", column: "DATA_SRC_FROM", direction: "IN", alias: "DATA_SRC_FROM" },
        { type: "BIGINT", column: "AUTO_DRAFT_ID", direction: "IN", alias: "AUTO_DRAFT_ID" },
        { type: "CHAR", column: "FROM_IP_OP", direction: "IN", alias: "FROM_IP_OP" },
        { type: "DATE_TIME_2", column: "ASSMNT_DT_TIME", direction: "IN", alias: "ASSMNT_DT_TIME" }],
       // { type: "CHAR", column: "TYPE", direction: "IN", alias: "TYPE" }],
        Server: "SQL", Database: "APPT"
    },
    insUpdVitalSignsMob: {
        SpName: "UPR_INSUPD_VITAL_SIGNS_MOB",
        Schema: [{ type: "VARCHAR", column: "IP_MRN_NO", direction: "IN", alias: "IP_MRN_NO" },
        { type: "DATE_TIME_2", column: "IP_VISIT_DT", direction: "IN", alias: "IP_VISIT_DT" },
        { type: "INT", column: "IP_SNO", direction: "IN", alias: "IP_SNO" },
        { type: "BIGINT", column: "IP_REFERENCE_ID", direction: "IN", alias: "IP_REFERENCE_ID" },
        { type: "BIGINT", column: "IP_REFERENCE_TYPE_ID", direction: "IN", alias: "IP_REFERENCE_TYPE_ID" },
        { type: "INT", column: "IP_RECORD_TYPE_ID", direction: "IN", alias: "IP_RECORD_TYPE_ID" },
        { type: "INT", column: "IP_SYSTOLIC", direction: "IN", alias: "IP_SYSTOLIC" },
        { type: "INT", column: "IP_SYSTOLIC_SITTING", direction: "IN", alias: "IP_SYSTOLIC_SITTING" },
        { type: "INT", column: "IP_SYSTOLIC_STANDING", direction: "IN", alias: "IP_SYSTOLIC_STANDING" },
        { type: "INT", column: "IP_SYSTOLIC_UNIT_ID", direction: "IN", alias: "IP_SYSTOLIC_UNIT_ID" },
        { type: "INT", column: "IP_DIASTOLIC", direction: "IN", alias: "IP_DIASTOLIC" },
        { type: "INT", column: "IP_DIASTOLIC_SITTING", direction: "IN", alias: "IP_DIASTOLIC_SITTING" },
        { type: "INT", column: "IP_DIASTOLIC_STANDING", direction: "IN", alias: "IP_DIASTOLIC_STANDING" },
        { type: "INT", column: "IP_PULSE", direction: "IN", alias: "IP_PULSE" },
        { type: "INT", column: "IP_PULSE_UNIT_ID", direction: "IN", alias: "IP_PULSE_UNIT_ID" },
        { type: "VARCHAR", column: "IP_HEART_RATE", direction: "IN", alias: "IP_HEART_RATE" },
        { type: "VARCHAR", column: "IP_RESPORATORY_RATE", direction: "IN", alias: "IP_RESPORATORY_RATE" },
        { type: "VARCHAR", column: "IP_TEMPRATURE", direction: "IN", alias: "IP_TEMPRATURE" },
        { type: "VARCHAR", column: "IP_SPO2", direction: "IN", alias: "IP_SPO2" },
        { type: "VARCHAR", column: "IP_WEIGHTS", direction: "IN", alias: "IP_WEIGHTS" },
        { type: "VARCHAR", column: "IP_BMI", direction: "IN", alias: "IP_BMI" },
        { type: "VARCHAR", column: "IP_HEIGHT", direction: "IN", alias: "IP_HEIGHT" },
        { type: "VARCHAR", column: "IP_BSA", direction: "IN", alias: "IP_BSA" },
        { type: "BIGINT", column: "IP_PROVIDER_CONTACT_ID", direction: "IN", alias: "IP_PROVIDER_CONTACT_ID" },
        { type: "VARCHAR", column: "IP_ADMN_NO", direction: "IN", alias: "IP_ADMN_NO" },
        { type: "VARCHAR", column: "IP_CAPILARY_BLD_GLU", direction: "IN", alias: "IP_CAPILARY_BLD_GLU" },
        { type: "VARCHAR", column: "IP_HEAD_CIRC", direction: "IN", alias: "IP_HEAD_CIRC" },
        { type: "VARCHAR", column: "IP_TEMP_SITE", direction: "IN", alias: "IP_TEMP_SITE" },
        { type: "VARCHAR", column: "IP_MACHINE", direction: "IN", alias: "IP_MACHINE" },
        { type: "VARCHAR", column: "IP_TERMINAL", direction: "IN", alias: "IP_TERMINAL" },
        { type: "BIGINT", column: "IP_BP_SITTING_UNIT_ID", direction: "IN", alias: "IP_BP_SITTING_UNIT_ID" },
        { type: "BIGINT", column: "IP_BP_STANDING_UNIT_ID", direction: "IN", alias: "IP_BP_STANDING_UNIT_ID" },
        { type: "BIGINT", column: "IP_BP_SUPINE", direction: "IN", alias: "IP_BP_SUPINE" },
        { type: "BIGINT", column: "IP_TEMP_UNIT_ID", direction: "IN", alias: "IP_TEMP_UNIT_ID" },
        { type: "BIGINT", column: "IP_SPO2_UNIT_ID", direction: "IN", alias: "IP_SPO2_UNIT_ID" },
        { type: "VARCHAR", column: "IP_O2", direction: "IN", alias: "IP_O2" },
        { type: "BIGINT", column: "IP_O2_UNIT_ID", direction: "IN", alias: "IP_O2_UNIT_ID" },
        { type: "VARCHAR", column: "HEART_TYPE", direction: "IN", alias: "HEART_TYPE" },
        { type: "VARCHAR", column: "PULSE_TYPE", direction: "IN", alias: "PULSE_TYPE" },
        { type: "VARCHAR", column: "BP_SIT_MAP", direction: "IN", alias: "BP_SIT_MAP" },
        { type: "VARCHAR", column: "BP_STND_MAP", direction: "IN", alias: "BP_STND_MAP" },
        { type: "VARCHAR", column: "BP_SUP_MAP", direction: "IN", alias: "BP_SUP_MAP" },
        { type: "VARCHAR", column: "WEIGHT_UNIT_ID", direction: "IN", alias: "WEIGHT_UNIT_ID" },
        { type: "VARCHAR", column: "HEIGHT_UNIT_ID", direction: "IN", alias: "HEIGHT_UNIT_ID" },
        { type: "VARCHAR", column: "FORM_TYPE_CD", direction: "IN", alias: "FORM_TYPE_CD" },
        { type: "VARCHAR", column: "GCS", direction: "IN", alias: "GCS" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "BIGINT", column: "VISIT_ID", direction: "IN", alias: "VISIT_ID" },
        { type: "VARCHAR", column: "VISIT_REMARKS", direction: "IN", alias: "VISIT_REMARKS" },
        { type: "VARCHAR", column: "REC_CREATE_BY", direction: "IN", alias: "REC_CREATE_BY" },
        { type: "VARCHAR", column: "SHIFT_TYPE", direction: "IN", alias: "SHIFT_TYPE" },
        { type: "DATE_TIME_2", column: "SHIFT_FROM_TIME", direction: "IN", alias: "SHIFT_FROM_TIME" },
        { type: "DATE_TIME_2", column: "SHIFT_TO_TIME", direction: "IN", alias: "SHIFT_TO_TIME" },
        { type: "BIGINT", column: "IP_PATIENT_ID", direction: "IN", alias: "IP_PATIENT_ID" },
        { type: "VARCHAR", column: "ADMT_WEIGHT", direction: "IN", alias: "ADMT_WEIGHT" },
        { type: "VARCHAR", column: "ADDED_BY", direction: "IN", alias: "ADDED_BY" },
        { type: "VARCHAR", column: "URINE_ANALYSIS", direction: "IN", alias: "URINE_ANALYSIS" },
        { type: "CHAR", column: "PAIN_SCORE", direction: "IN", alias: "PAIN_SCORE" },
        { type: "BIGINT", column: "FALL_RISK", direction: "IN", alias: "FALL_RISK" },
        { type: "VARCHAR", column: "MID_UPPER_ARM", direction: "IN", alias: "MID_UPPER_ARM" },
        { type: "DATE_TIME_2", column: "CAPTURE_DT_TIME", direction: "IN", alias: "CAPTURE_DT_TIME" },
        { type: "VARCHAR", column: "FORELIMB_BP", direction: "IN", alias: "FORELIMB_BP" },
        { type: "VARCHAR", column: "WAIST_CIRCUMFERENCE", direction: "IN", alias: "WAIST_CIRCUMFERENCE" },
        { type: "VARCHAR", column: "HEAD_LENGTH", direction: "IN", alias: "HEAD_LENGTH" },
        { type: "VARCHAR", column: "ADMN_HEIGHT", direction: "IN", alias: "ADMN_HEIGHT" },
        { type: "DATE_TIME_2", column: "ABSERVING_DT_TM", direction: "IN", alias: "ABSERVING_DT_TM" },
        { type: "VARCHAR", column: "PULSE_STANDING", direction: "IN", alias: "PULSE_STANDING" },
        { type: "VARCHAR", column: "PULSE_STANDING_TYPE", direction: "IN", alias: "PULSE_STANDING_TYPE" },
        { type: "VARCHAR", column: "PULSE_SITTING", direction: "IN", alias: "PULSE_SITTING" },
        { type: "VARCHAR", column: "PULSE_SITTING_TYPE", direction: "IN", alias: "PULSE_SITTING_TYPE" },
        { type: "VARCHAR", column: "GRBS", direction: "IN", alias: "GRBS" },
        { type: "VARCHAR", column: "VISIT_STATUS_CD", direction: "IN", alias: "VISIT_STATUS_CD" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "CONSULTATION_NO", direction: "IN", alias: "CONSULTATION_NO" },
        { type: "VARCHAR", column: "REMARKS", direction: "IN", alias: "REMARKS" },
        { type: "BIGINT", column: "OLR_ID", direction: "IN", alias: "OLR_ID" },
        { type: "VARCHAR", column: "COL1", direction: "IN", alias: "COL1" },
        { type: "VARCHAR", column: "COL2", direction: "IN", alias: "COL2" },
        { type: "BIGINT", column: "PARENT_VISIT_ID", direction: "IN", alias: "PARENT_VISIT_ID" },
        { type: "BIGINT", column: "REFERENCE_ID", direction: "IN", alias: "REFERENCE_ID" },
        { type: "BIGINT", column: "REFERENCE_TYPE_ID", direction: "IN", alias: "REFERENCE_TYPE_ID" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "HANDOVR_BY", direction: "IN", alias: "HANDOVR_BY" },
        { type: "VARCHAR", column: "TAKENOVR_BY", direction: "IN", alias: "TAKENOVR_BY" },
        { type: "DATE_TIME_2", column: "APPROVED_DT", direction: "IN", alias: "APPROVED_DT" },
        { type: "VARCHAR", column: "APPROVED_BY", direction: "IN", alias: "APPROVED_BY" },
        { type: "BIGINT", column: "APPROVED_BYID", direction: "IN", alias: "APPROVED_BYID" },
        { type: "BIGINT", column: "HANDOVR_BYID", direction: "IN", alias: "HANDOVR_BYID" },
        { type: "BIGINT", column: "TAKENOVR_BYID", direction: "IN", alias: "TAKENOVR_BYID" },
        { type: "CHAR", column: "DATA_SRC_FROM", direction: "IN", alias: "DATA_SRC_FROM" },
        { type: "BIGINT", column: "AUTO_DRAFT_ID", direction: "IN", alias: "AUTO_DRAFT_ID" },
        { type: "CHAR", column: "FROM_IP_OP", direction: "IN", alias: "FROM_IP_OP" },
        { type: "DATE_TIME_2", column: "ASSMNT_DT_TIME", direction: "IN", alias: "ASSMNT_DT_TIME" }],
        Server: "SQL", Database: "APPT"
    },
    getVisitsMob: {
        SpName: "UPR_GET_VISITS_MOB",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "BIGINT", column: "SESSION_ID", direction: "IN", alias: "SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getLabelTranInfoMob: {
        SpName: "UPR_GET_LABEL_TRAN_INFO_MOB",
        Schema: [{ type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "FORM_TYPE_CD", direction: "IN", alias: "FORM_TYPE_CD" },
        { type: "VARCHAR", column: "PATIENT_ID", direction: "IN", alias: "PATIENT_ID" },
        { type: "VARCHAR", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "BIGINT", column: "LABLE_ID", direction: "IN", alias: "LABLE_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	getFormLableMap: {
        SpName: "UPR_GET_FORM_LABLE_MAP",
        Schema: [{ type: "BIGINT", column: "LABLE_ID", direction: "IN", alias: "LABLE_ID" },
        { type: "BIGINT", column: "FORM_ID", direction: "IN", alias: "FORM_ID" },
        { type: "VARCHAR", column: "FORM_TYPE_CD", direction: "IN", alias: "FORM_TYPE_CD" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	getMasterData: {
        SpName: "UPR_GET_MASTER_DATA_MOB",
        Schema: [{ type: "CHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "DATE_TIME_2", column: "IP_DT", direction: "IN", alias: "IP_DT" },
        { type: "CHAR", column: "IS_PRIMARY", direction: "IN", alias: "IS_PRIMARY" },
        { type: "BIGINT", column: "PAT_ID", direction: "IN", alias: "PAT_ID" },
        { type: "VARCHAR", column: "VISIT_ID", direction: "IN", alias: "VISIT_ID" },
        { type: "BIGINT", column: "IP_DOC_ID", direction: "IN", alias: "IP_DOC_ID" }],
        Server: "SQL", Database: "APPT"
    },
	getUpdVcIpOpDet: {
        SpName: "UPR_GET_UPD_VC_IP_OP_DET",
        Schema: [{ type: "BIGINT", column: "TM_IP_OP_ID", direction: "IN", alias: "TM_IP_OP_ID" },
        { type: "BIGINT", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "VARCHAR", column: "VC_SESSIONID", direction: "IN", alias: "VC_SESSIONID" },
        { type: "VARCHAR", column: "VC_TOKEN", direction: "IN", alias: "VC_TOKEN" },
        { type: "VARCHAR", column: "VC_VIDEOURL", direction: "IN", alias: "VC_VIDEOURL" },
        { type: "VARCHAR", column: "VC_JWT", direction: "IN", alias: "VC_JWT" },
        { type: "VARCHAR", column: "PATIENT_NAME", direction: "IN", alias: "PATIENT_NAME" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "TYPE", direction: "IN", alias: "TYPE" },
        { type: "DATE_TIME_2", column: "VC_DATE", direction: "IN", alias: "VC_DATE" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "API_KEY", direction: "IN", alias: "API_KEY" },
        { type: "BIGINT", column: "TM_DET_ID", direction: "IN", alias: "TM_DET_ID" },
        { type: "VARCHAR", column: "JOIN_BY", direction: "IN", alias: "JOIN_BY" },
        { type: "DATE_TIME_2", column: "START_DTTIME", direction: "IN", alias: "START_DTTIME" },
        { type: "DATE_TIME_2", column: "END_DTTIME", direction: "IN", alias: "END_DTTIME" },
        { type: "VARCHAR", column: "VC_REQUEST_BY", direction: "IN", alias: "VC_REQUEST_BY" },
        { type: "VARCHAR", column: "VC_GUID", direction: "IN", alias: "VC_GUID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    uprInsUpdTeleIpOp: {
        SpName: "UPR_INSUPD_TELE_IP_OP",
        Schema: [{ type: "BIGINT", column: "TM_IP_OP_ID", direction: "IN", alias: "TM_IP_OP_ID" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "BIGINT", column: "SLOTS_ID", direction: "IN", alias: "SLOTS_ID" },
        { type: "VARCHAR", column: "CONSUTATION_NO", direction: "IN", alias: "CONSUTATION_NO" },
        { type: "VARCHAR", column: "ADMN_NO", direction: "IN", alias: "ADMN_NO" },
        { type: "BIGINT", column: "PATIENT_ID", direction: "IN", alias: "PATIENT_ID" },
        { type: "VARCHAR", column: "UHR_NO", direction: "IN", alias: "UHR_NO" },
        { type: "VARCHAR", column: "GENDER", direction: "IN", alias: "GENDER" },
        { type: "VARCHAR", column: "AGE", direction: "IN", alias: "AGE" },
        { type: "VARCHAR", column: "PATIENT_NAME", direction: "IN", alias: "PATIENT_NAME" },
        { type: "VARCHAR", column: "PAT_MOB", direction: "IN", alias: "PAT_MOB" },
        { type: "VARCHAR", column: "PAT_EMAIL", direction: "IN", alias: "PAT_EMAIL" },
        { type: "VARCHAR", column: "PATIENT_DETAILS", direction: "IN", alias: "PATIENT_DETAILS" },
        { type: "VARCHAR", column: "PRIMARY_DOC", direction: "IN", alias: "PRIMARY_DOC" },
        { type: "BIGINT", column: "PRIMARY_DOC_ID", direction: "IN", alias: "PRIMARY_DOC_ID" },
        { type: "VARCHAR", column: "PRIMARY_DOC_CD", direction: "IN", alias: "PRIMARY_DOC_CD" },
        { type: "VARCHAR", column: "PRIMARY_MOB_NO", direction: "IN", alias: "PRIMARY_MOB_NO" },
        { type: "VARCHAR", column: "PRIMARY_MAIL_ID", direction: "IN", alias: "PRIMARY_MAIL_ID" },
        { type: "VARCHAR", column: "VC_DOC", direction: "IN", alias: "VC_DOC" },
        { type: "BIGINT", column: "VC_DOC_ID", direction: "IN", alias: "VC_DOC_ID" },
        { type: "VARCHAR", column: "VC_DOC_CD", direction: "IN", alias: "VC_DOC_CD" },
        { type: "VARCHAR", column: "VC_DOC_MOB_NO", direction: "IN", alias: "VC_DOC_MOB_NO" },
        { type: "VARCHAR", column: "VC_DOC_MAIL_ID", direction: "IN", alias: "VC_DOC_MAIL_ID" },
        { type: "VARCHAR", column: "VC_STATUS", direction: "IN", alias: "VC_STATUS" },
        { type: "DATE_TIME_2", column: "VC_DATE", direction: "IN", alias: "VC_DATE" },
        { type: "VARCHAR", column: "VC_SESSIONID", direction: "IN", alias: "VC_SESSIONID" },
        { type: "VARCHAR", column: "VC_TOKEN", direction: "IN", alias: "VC_TOKEN" },
        { type: "DATE_TIME_2", column: "SESSION_STRTIME", direction: "IN", alias: "SESSION_STRTIME" },
        { type: "DATE_TIME_2", column: "START_DTTIME", direction: "IN", alias: "START_DTTIME" },
        { type: "DATE_TIME_2", column: "END_DTTIME", direction: "IN", alias: "END_DTTIME" },
        { type: "INT", column: "CNT_OF_PARTICIPANTS", direction: "IN", alias: "CNT_OF_PARTICIPANTS" },
        { type: "BIGINT", column: "VC_MINUTES", direction: "IN", alias: "VC_MINUTES" },
        { type: "VARCHAR", column: "VC_TYPE", direction: "IN", alias: "VC_TYPE" },
        { type: "CHAR", column: "VIDEO_CONSENT", direction: "IN", alias: "VIDEO_CONSENT" },
        { type: "VARCHAR", column: "PAT_ARRIVED", direction: "IN", alias: "PAT_ARRIVED" },
        { type: "VARCHAR", column: "APT_KEY", direction: "IN", alias: "APT_KEY" },
        { type: "VARCHAR", column: "VISIT_REMARKS", direction: "IN", alias: "VISIT_REMARKS" },
        { type: "VARCHAR", column: "VC_GUID", direction: "IN", alias: "VC_GUID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	uprGetPatEcgData: {
        SpName: "UPR_GET_PAT_ECG_DATA",
        Schema: [{ type: "VARCHAR", column: "SRCH_VALUE", direction: "IN", alias: "SRCH_VALUE" },
        { type: "VARCHAR", column: "SRCH_TYPE", direction: "IN", alias: "SRCH_TYPE" },
        { type: "VARCHAR", column: "SRCH_VALUE_1", direction: "IN", alias: "SRCH_VALUE_1" },
        { type: "VARCHAR", column: "SRCH_VALUE_2", direction: "IN", alias: "SRCH_VALUE_2" },
        { type: "VARCHAR", column: "FORMATE_FILE", direction: "IN", alias: "FORMATE_FILE" },
        { type: "CHAR", column: "SRCH_FLAG", direction: "IN", alias: "SRCH_FLAG" },
        { type: "VARCHAR", column: "IP_FORM_TYPE_CD", direction: "IN", alias: "IP_FORM_TYPE_CD" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	
}
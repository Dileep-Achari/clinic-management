module.exports = {
    InsUpdcorpPatientReg: {
        SpName: "UPR_INS_CORP_PATIENT_REG",
        Schema: [{ type: "VARCHAR", column: "PATIENT_NAME", direction: "IN", alias: "PATIENT_NAME" },
        { type: "CHAR", column: "GENDER_CD", direction: "IN", alias: "GENDER_CD" },
        { type: "DATE_TIME_2", column: "DOB", direction: "IN", alias: "DOB" },
        { type: "VARCHAR", column: "MOBILE_NO", direction: "IN", alias: "MOBILE_NO" },
        { type: "VARCHAR", column: "EMAIL_ID", direction: "IN", alias: "EMAIL_ID" },
        { type: "BIGINT", column: "AREA_ID", direction: "IN", alias: "AREA_ID" },
        { type: "VARCHAR", column: "AREA_NAME", direction: "IN", alias: "AREA_NAME" },
        { type: "VARCHAR", column: "AFFILIATE_ID", direction: "IN", alias: "AFFILIATE_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "BIGINT", column: "OP_COUNT", direction: "OUT", alias: "OP_COUNT" }],
        Server: "SQL", Database: "APPT"
    },
    InsupdFbControl: {
        SpName: "UPR_INSUPD_FB_CONTROL",
        Schema: [{ type: "BIGINT", column: "IP_CONTROL_ID", direction: "IN", alias: "IP_CONTROL_ID" },
        { type: "VARCHAR", column: "IP_CONTROL_NAME", direction: "IN", alias: "IP_CONTROL_NAME" },
        { type: "VARCHAR", column: "IP_CONTROL_DESC", direction: "IN", alias: "IP_CONTROL_DESC" },
        { type: "INT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    UPR_INS_COM_MSG_REQ: {
        SpName: "UPR_INS_COM_MSG_REQ",
        Schema: [{ type: "INT", column: "REQ_TYPE_ID", direction: "IN", alias: "REQ_TYPE_ID" },
        { type: "BIGINT", column: "REFERENCE_ID", direction: "IN", alias: "REFERENCE_ID" },
        { type: "BIGINT", column: "REFERENCE_TYPE_ID", direction: "IN", alias: "REFERENCE_TYPE_ID" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" },
        { type: "VARCHAR", column: "NOTES", direction: "IN", alias: "NOTES" },
        { type: "VARCHAR", column: "CC_EMAIL", direction: "IN", alias: "CC_EMAIL" },
        { type: "BIGINT", column: "REQ_ID", direction: "IN", alias: "REQ_ID" },
        { type: "BIGINT", column: "MODIFY_BY", direction: "IN", alias: "MODIFY_BY" },
        { type: "VARCHAR", column: "MOBILE", direction: "IN", alias: "MOBILE" },
        { type: "VARCHAR", column: "EMAIL", direction: "IN", alias: "EMAIL" },
        { type: "VARCHAR", column: "MOBILE_MSG", direction: "IN", alias: "MOBILE_MSG" },
        { type: "VARCHAR", column: "EMAIL_MSG", direction: "IN", alias: "EMAIL_MSG" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "CHAR", column: "TYPE", direction: "IN", alias: "TYPE" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    UPR_INSUPD_ORG_SRVC: {
        SpName: "UPR_INSUPD_ORG_SRVC",
        Schema: [{ type: "BIGINT", column: "RSRC_ID", direction: "IN", alias: "RSRC_ID" },
        { type: "VARCHAR", column: "SERVICE_ID", direction: "IN", alias: "SERVICE_ID" },
        { type: "VARCHAR", column: "PRICE", direction: "IN", alias: "PRICE" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    GetOlrPatSrch: {
        SpName: "UPR_GET_OLR_PAT",
        Schema: [{ type: "BIGINT", column: "IP_OLR_ID", direction: "IN", alias: "IP_OLR_ID" },
        { type: "VARCHAR", column: "IP_COLUMN_NAME", direction: "IN", alias: "IP_COLUMN_NAME" },
        { type: "VARCHAR", column: "IP_PREFIXTEXT", direction: "IN", alias: "IP_PREFIXTEXT" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    GetDocOlrSlotByDt: {
        SpName: "UPR_GET_OLR_SLOTS_BYDT",
        Schema: [{ type: "BIGINT", column: "IP_OLR_ID", direction: "IN", alias: "IP_OLR_ID" },
        { type: "DATE_TIME_2", column: "IP_APMNT_DT", direction: "IN", alias: "IP_APMNT_DT" },
        { type: "BIGINT", column: "IP_RSRC_SCH_TIME_ID", direction: "IN", alias: "IP_RSRC_SCH_TIME_ID" },
        { type: "BIGINT", column: "IP_STATUS_ID", direction: "IN", alias: "IP_STATUS_ID" },
        { type: "INT", column: "IP_ACCESS_TYPE", direction: "IN", alias: "IP_ACCESS_TYPE" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    packageSer: {
        SpName: "UPR_GET_SERVICE_DET",
        Schema: [{ type: "BIGINT", column: "IP_SERVICE_ID", direction: "IN", alias: "IP_SERVICE_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getAllergy: {
        SpName: "UPR_PHR_GET_ALLERGY",
        Schema: [{ type: "VARCHAR", column: "IP_MRN_NO", direction: "IN", alias: "IP_MRN_NO" },
        { type: "DATE_TIME_2", column: "IP_VISIT_DT", direction: "IN", alias: "IP_VISIT_DT" },
        { type: "INT", column: "IP_RECORD_TYPE_ID", direction: "IN", alias: "IP_RECORD_TYPE_ID" },
        { type: "BIGINT", column: "IP_SLOT_ID", direction: "IN", alias: "IP_SLOT_ID" },
        { type: "INT", column: "IP_COUNT", direction: "IN", alias: "IP_COUNT" },
        { type: "CHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "VARCHAR", column: "IP_ADMN_NO", direction: "IN", alias: "IP_ADMN_NO" },
        { type: "INT", column: "IP_REFERENCE_TYPE_ID", direction: "IN", alias: "IP_REFERENCE_TYPE_ID" },
        { type: "VARCHAR", column: "FOMR_TYPE_CD", direction: "IN", alias: "FOMR_TYPE_CD" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getRecom: {
        SpName: "UPR_GET_RECOMM_FOLLOW_UP_ADVISE",
        Schema: [{ type: "VARCHAR", column: "IP_MRN_NO", direction: "IN", alias: "IP_MRN_NO" },
        { type: "DATE_TIME_2", column: "IP_VISIT_DT", direction: "IN", alias: "IP_VISIT_DT" },
        { type: "INT", column: "IP_RECORD_TYPE_ID", direction: "IN", alias: "IP_RECORD_TYPE_ID" },
        { type: "BIGINT", column: "IP_SLOT_ID", direction: "IN", alias: "IP_SLOT_ID" },
        { type: "CHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "INT", column: "IP_COUNT", direction: "IN", alias: "IP_COUNT" },
        { type: "INT", column: "IP_REFERENCE_TYPE_ID", direction: "IN", alias: "IP_REFERENCE_TYPE_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "VARCHAR", column: "IP_ADMN_NO", direction: "IN", alias: "IP_ADMN_NO" }],
        Server: "SQL", Database: "APPT"
    },
    GetOrgLocIPDet: {
        SpName: "UPR_GET_ORG_LOC_IP_DET",
        Schema: [{ type: "BIGINT", column: "IP_DET_ID", direction: "IN", alias: "IP_DET_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getOrgDet: {
        SpName: "UPR_GET_ORG_DET",
        Schema: [{ type: "BIGINT", column: "IP_ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "IP_LOC_ID", direction: "IN", alias: "IP_LOC_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    InsDocOpRefferals: {
        SpName: "UPR_INS_DOCTOR_OP_REFERRALS",
        Schema: [{ type: "BIGINT", column: "DOC_OP_REF_ID", direction: "IN", alias: "DOC_OP_REF_ID" },
        { type: "BIGINT", column: "SLOT_ID", direction: "IN", alias: "SLOT_ID" },
        { type: "BIGINT", column: "OLR_ID", direction: "IN", alias: "OLR_ID" },
        { type: "DATE_TIME_2", column: "DOA", direction: "IN", alias: "DOA" },
        { type: "VARCHAR", column: "PRO_DIAG", direction: "IN", alias: "PRO_DIAGNOSIS" },
        { type: "N_VARCHAR", column: "TREAT_PLAN", direction: "IN", alias: "TREATMENT_PLAN" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "BIGINT", column: "RSRC_ID", direction: "IN", alias: "RSRC_ID" },
        { type: "BIGINT", column: "F_SLOTS_ID", direction: "IN", alias: "F_SLOTS_ID" },
        { type: "BIGINT", column: "TO_SPEC_ID", direction: "IN", alias: "TO_SPEC_ID" }],
        Server: "SQL", Database: "APPT"
    },
}
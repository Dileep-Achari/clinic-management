'use strict';
module.exports = {
    getByGid: {
        SpName: "UPR_GET_QMS_TV_HTML",
        Schema: [{ type: "VARCHAR", column: "TV_GUID", direction: "IN", alias: "TV_GUID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getTokenData: {
        SpName: "UPR_GET_TOKEN_STAT_BYIP",
        Schema: [{ type: "VARCHAR", column: "TV_GUID", direction: "IN", alias: "TV_GUID" },
        { type: "VARCHAR", column: "IP_IP_ADDR", direction: "IN", alias: "IP_IP_ADDR" },
        { type: "VARCHAR", column: "IP_MIG_ID", direction: "IN", alias: "IP_MIG_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDoctorTvDisplay: {
        SpName: "UPR_GET_DOCTOR_TV_DISPLAY",
        Schema: [{ type: "VARCHAR", column: "TV_GUID", direction: "IN", alias: "TV_GUID" },
        { type: "VARCHAR", column: "IP_IP_ADDR", direction: "IN", alias: "IP_IP_ADDR" },
        { type: "BIGINT", column: "IP_MIG_ID", direction: "IN", alias: "IP_MIG_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDoctorFmtDet: {
        SpName: "UPR_GET_DOCTOR_FMT_DETAILS_TV",
        Schema: [{ type: "VARCHAR", column: "TV_GUID", direction: "IN", alias: "TV_GUID" },
        { type: "BIGINT", column: "MIG_ID", direction: "IN", alias: "MIG_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "CHAR", column: "TYPE", direction: "IN", alias: "TYPE" }],
        Server: "SQL", Database: "APPT"
    },
	uprGetMasterDataNst: {
        SpName: "upr_get_master_data_nst",
        Schema: [{ type: "uuid", column: "qms_uid", direction: "IN", alias: "par_qms_uid" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	getGuidDataByPg: {
        SpName: "upr_get_qms_master_data",
        Schema: [{ type: "uuid", column: "tv_guid", direction: "IN", alias: "par_tv_guid" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
}
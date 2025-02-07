'use strict';
module.exports = {
    getAllAssmntAudit: {
        SpName: "UPR_GET_ALL_ASSMNT_AUDIT",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getErDashboard: {
        SpName: "UPR_GET_IP_ER_DASHBOARD",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "DATE_TIME_2", column: "FROM_DT", direction: "IN", alias: "FROM_DT" },
        { type: "DATE_TIME_2", column: "TO_DT", direction: "IN", alias: "TO_DT" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "IP_LOC_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getIpDashboard: {
        SpName: "UPR_GET_IP_DASHBOARD",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "DATE_TIME_2", column: "FROM_DT", direction: "IN", alias: "FROM_DT" },
        { type: "DATE_TIME_2", column: "TO_DT", direction: "IN", alias: "TO_DT" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "IP_LOC_ID" }],
        Server: "SQL", Database: "APPT"
    },
    getDschrgDashboard: {
        SpName: "UPR_GET_IP_DISCHARGE_DASHBOARD",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "DATE_TIME_2", column: "FROM_DT", direction: "IN", alias: "FROM_DT" },
        { type: "DATE_TIME_2", column: "TO_DT", direction: "IN", alias: "TO_DT" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "IP_ORG_ID" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "IP_LOC_ID" }],
        Server: "SQL", Database: "APPT"
    }
}

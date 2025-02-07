module.exports = {
    getSlotsKioski: {
        SpName: "UPR_GET_SLOTS_KIOSKI",
        Schema: [{ type: "VARCHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "BIGINT", column: "MIG_ID", direction: "IN", alias: "MIG_ID" },
        { type: "DATE_TIME_2", column: "IP_APMNT_DT", direction: "IN", alias: "IP_APMNT_DT" },
        { type: "CHAR", column: "APT_DAY", direction: "IN", alias: "APT_DAY" },
        { type: "VARCHAR", column: "IP_DOC_CD", direction: "IN", alias: "IP_DOC_CD" }],
        Server: "SQL", Database: "APPT"
    }
}
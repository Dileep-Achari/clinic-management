module.exports = {
    uprGetPharmacologyDetails: {
        SpName: "UPR_GET_PHARMACOLOGY_DETAILS",
        Schema: [{ type: "VARCHAR", column: "PHARM_GUID", direction: "IN", alias: "PHARM_GUID" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "PMG"
    },
    uprInsupdPharmacologyDetails: {
        SpName: "UPR_INSUPD_PHARMACOLOGY_DETAILS",
        Schema: [{ type: "BIGINT", column: "PHARM_ID", direction: "IN", alias: "PHARM_ID" },
        { type: "VARCHAR ", column: "PHARM_GUID", direction: "IN", alias: "PHARM_GUID" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "VARCHAR", column: "PHARM_NAME", direction: "IN", alias: "PHARM_NAME" },
         { type: "VARCHAR", column: "BRAND_NAME", direction: "IN", alias: "BRAND_NAME" },
        { type: "VARCHAR", column: "PHARM_JSON", direction: "IN", alias: "PHARM_JSON" },
        { type: "CHAR", column: "APPROVED_STATUS", direction: "IN", alias: "APPROVED_STATUS" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "PMG"
    }
}
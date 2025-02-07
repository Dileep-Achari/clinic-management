'use strict';
module.exports = {
    getPrntInfo: {
        SpName: "UPR_GET_IP_FORM_TYPE_PRINT_INFO",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "BIGINT", column: "LOC_ID", direction: "IN", alias: "LOC_ID" },
        { type: "BIGINT", column: "ORG_ID", direction: "IN", alias: "ORG_ID" },
        { type: "INT", column: "INSTANCE", direction: "IN", alias: "INSTANCE" }],
        Server: "SQL", Database: "APPT"
    },
    updPrntInfo: {
        SpName: "UPR_UPD_IP_FORM_TYPE_PRINT_INFO",
        Schema: [{ type: "BIGINT", column: "FP_ID", direction: "IN", alias: "FP_ID" },
        { type: "CHAR", column: "PRINT_DONE", direction: "IN", alias: "PRINT_DONE" },
        { type: "VARBINARY", column: "PRINT_DATA", direction: "IN", alias: "PRINT_DATA" },
        { type: "VARCHAR", column: "SHORT_URL", direction: "IN", alias: "SHORT_URL" },
        { type: "VARBINARY", column: "PRINT_DATA_TOTAL", direction: "IN", alias: "PRINT_DATA_TOTAL" },],
        Server: "SQL", Database: "APPT"
    },
    getPrtDtaBySrtUrl: {
        SpName: "UPR_GET_FORM_TYPE_PRINT_DATA",
        Schema: [{ type: "VARCHAR", column: "SHORT_URL", direction: "IN", alias: "SHORT_URL" },
				 { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL", Database: "APPT"
    }
}
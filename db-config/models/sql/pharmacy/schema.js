'use strict';
module.exports = {
   getMasterData: {
        SpName: "UPR_GET_MASTER_DATA",
        Schema: [{ type: "VARCHAR", column: "ID", direction: "IN", alias: "ID" },
        { type: "VARCHAR", column: "ID1", direction: "IN", alias: "ID1" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "SEARCH_COL", direction: "IN", alias: "SEARCH_COL" },
        { type: "VARCHAR", column: "SEARCH_TYPE", direction: "IN", alias: "SEARCH_TYPE" },
        { type: "INT", column: "PAGENUM", direction: "IN", alias: "PAGENUM" },
        { type: "INT", column: "PAGE_SIZE", direction: "IN", alias: "PAGE_SIZE" },
        { type: "VARCHAR", column: "TYPE", direction: "IN", alias: "TYPE" }],
        Server: "SQL", Database: "PHARMACY"
    },
    insUpdMasterDt: {
        SpName: "UPD_INSUPD_MASTER_DATA",
        Schema: [{ type: "VARCHAR", column: "TYPE", direction: "IN", alias: "TYPE" },
        { type: "VARCHAR", column: "JSON", direction: "IN", alias: "JSON" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL", Database: "PHARMACY"
    },
    getMasterData01: {
        SpName: "UPR_GET_MASTER_DATA01",
        Schema: [{ type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "TYPE", direction: "IN", alias: "TYPE" },
        { type: "VARCHAR", column: "ID", direction: "IN", alias: "ID" },
        { type: "VARCHAR", column: "MASTER_NAME", direction: "IN", alias: "MASTER_NAME"},
        { type: "VARCHAR", column: "CODE", direction: "IN", alias: "CODE" },
        { type: "VARCHAR", column: "NAME", direction: "IN", alias: "NAME" }],
        Server: "SQL", Database: "PHARMACY"
    }
}
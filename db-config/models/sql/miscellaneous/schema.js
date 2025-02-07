'use strict';
module.exports = {
    uprinsupdrameshdemo: {
        SpName: "UPR_INSUPD_RAMESH_DEMO",
        Schema: [{ type: "BIGINT", column: "SNO", direction: "IN", alias: "SNO" },
        { type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "PAT_NAME", direction: "IN", alias: "PAT_NAME" },
        { type: "VARCHAR", column: "SURGERY", direction: "IN", alias: "SURGERY" },
        { type: "VARCHAR", column: "CITY", direction: "IN", alias: "CITY" },
        { type: "VARCHAR", column: "PAT_ADDR", direction: "IN", alias: "PAT_ADDR" },
        { type: "DATE_TIME_2", column: "DOS", direction: "IN", alias: "DOS" },
        { type: "VARCHAR", column: "CNTR", direction: "IN", alias: "CNTR" },
        { type: "DATE_TIME_2", column: "TIME1", direction: "IN", alias: "TIME1" },
        { type: "DATE_TIME_2", column: "TIME2", direction: "IN", alias: "TIME2" },
        { type: "DATE_TIME_2", column: "TIME3", direction: "IN", alias: "TIME3" },
        { type: "DATE_TIME_2", column: "TIME4", direction: "IN", alias: "TIME4" },
        { type: "DATE_TIME_2", column: "TIME5", direction: "IN", alias: "TIME5" },
        { type: "DATE_TIME_2", column: "MOD_DATE", direction: "IN", alias: "MOD_DATE" },
        { type: "DATE_TIME_2", column: "ADD_ATE", direction: "IN", alias: "ADD_ATE" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL_SERVER", Database: "PROD"
    },
    uprgetrameshdemo: {
        SpName: "UPR_GET_RAMESH_DEMO",
        Schema: [{ type: "VARCHAR", column: "UMR_NO", direction: "IN", alias: "UMR_NO" },
        { type: "VARCHAR", column: "PAT_NAME", direction: "IN", alias: "PAT_NAME" },
        { type: "VARCHAR", column: "CNTR", direction: "IN", alias: "CNTR" },
        { type: "VARCHAR", column: "MOBNO", direction: "IN", alias: "MOBNO" },
        { type: "VARCHAR", column: "FLAG", direction: "IN", alias: "FLAG" }],
        Server: "SQL_SERVER", Database: "PROD"
    }
}
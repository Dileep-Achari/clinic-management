'use strict';
module.exports = {
    /** Version 1 */
    getAllReqType: {
        SpName: "UPR_GET_COM_MSG_REQ_TYPE",
        Schema: [{ type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
	/* Version 1 for formatted messeges data*/
    getAllFrmtMsgByReqId: {
        SpName: "UPR_GET_COM_MSG_REQ_VER1",
        Schema: [{ type: "BIGINT", column: "REQ_TYPE_ID", direction: "IN", alias: "REQ_TYPE_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    updMsgStatById: {
        SpName: "UPR_UPD_COM_MSG_REQ_VER1",
        Schema: [{ type: "BIGINT", column: "COM_MSG_REQ_ID", direction: "IN", alias: "COM_MSG_REQ_ID" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "CHAR", column: "FLAG", direction: "IN", alias: "FLAG" },
        { type: "VARCHAR", column: "SMS_JOB_NO", direction: "IN", alias: "SMS_JOB_NO" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    updFrmtMsgStat: {
        SpName: "UPR_UPD_COM_MSG_REQ_VER2",
        Schema: [{ type: "BIGINT", column: "REQ_TYPE_ID", direction: "IN", alias: "REQ_TYPE_ID" },
        { type: "BIGINT", column: "COM_MSG_REQ_ID", direction: "IN", alias: "COM_MSG_REQ_ID" },
        { type: "CHAR", column: "RECORD_STATUS", direction: "IN", alias: "RECORD_STATUS" },
        { type: "VARCHAR", column: "SMS_JOB_NO", direction: "IN", alias: "SMS_JOB_NO" },
        { type: "CHAR", column: "IS_MOBILE", direction: "IN", alias: "IS_MOBILE" },
        { type: "CHAR", column: "IS_EMAIL", direction: "IN", alias: "IS_EMAIL" },
        { type: "BIGINT", column: "ERR_MOB_CNT", direction: "IN", alias: "ERR_MOB_CNT" },
        { type: "BIGINT", column: "ERR_EMAIL_CNT", direction: "IN", alias: "ERR_EMAIL_CNT" },
        { type: "VARCHAR", column: "ERROR_DESC", direction: "IN", alias: "ERROR_DESC" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    /** Version 2  for unformatted messeges data*/
    getAllUnFrmtMsgByReqId: {
        SpName: "UPR_GET_COM_MSG_REQ_ALL_VER2",
        Schema: [{ type: "BIGINT", column: "REQ_TYPE_ID", direction: "IN", alias: "IP_REQ_TYPE_ID" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" }],
        Server: "SQL", Database: "APPT"
    },
    updComMsgReqTemStatus: {
        SpName: "UPR_UPD_COM_MSG_REQ_TEMPLATE_STATUS",
        Schema: [{ type: "BIGINT", column: "REQ_TYPE_ID", direction: "IN", alias: "REQ_TYPE_ID" },
        { type: "BIGINT", column: "COM_MSG_REQ_ID", direction: "IN", alias: "COM_MSG_REQ_ID" },
        { type: "CHAR", column: "STATUS", direction: "IN", alias: "STATUS" },
        { type: "N_VARCHAR", column: "MOB_MSG_TPL", direction: "IN", alias: "MOB_MSG_TPL" },
        { type: "N_VARCHAR", column: "EMAIL_MSG_TPL", direction: "IN", alias: "EMAIL_MSG_TPL" },
        { type: "CHAR", column: "IS_MOBILE", direction: "IN", alias: "IS_MOBILE" },
        { type: "CHAR", column: "IS_EMAIL", direction: "IN", alias: "IS_EMAIL" },
        { type: "VARCHAR", column: "TO_MOBILE_NO", direction: "IN", alias: "TO_MOBILE_NO" },
        { type: "VARCHAR", column: "TO_EMAIL", direction: "IN", alias: "TO_EMAIL" },
        { type: "VARCHAR", column: "ERROR_DESC", direction: "IN", alias: "ERROR_DESC" },
        { type: "INT", column: "ERR_MOB_CNT", direction: "IN", alias: "ERR_MOB_CNT" },
        { type: "INT", column: "ERR_EMAIL_CNT", direction: "IN", alias: "ERR_EMAIL_CNT" },
        { type: "VARCHAR", column: "SMS_JOB_NO", direction: "IN", alias: "SMS_JOB_NO" }],
        Server: "SQL", Database: "APPT"
    }

}
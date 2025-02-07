'use strict';
module.exports = {
    insHL7data: {
        SpName: "UPR_INSUPD_SYSTEM_VITALS_XML",
        Schema: [{ type: "N_VARCHAR", column: "XML", direction: "IN", alias: "XML" },
        { type: "BIGINT", column: "MIG_ID", direction: "IN", alias: "MIG_ID" }],
        Server: "SQL", Database: "APPT"
    },
	
}

'use strict';
const sqlDBAppt = require("../db-config/connections/sql-db-appt");
const sqlDBApptV9 = require("../db-config/connections/sql-db-appt-v9");
const sqlDBFb = require("../db-config/connections/sql-db-fb");
const sqlDBCems = require("../db-config/connections/sql-db-cems");
const pgDbQi = require("../db-config/connections/pg-db-qi");
const pgDbMIS = require("../db-config/connections/pg-db-mis");
const pgDbDOC = require("../db-config/connections/pg-db-doc");
const sqlDBpmg = require("../db-config/connections/sql-db-pmg");
const sqlDBpharmacy = require("../db-config/connections/sql-db-pharmacy");
// const oracleDb = require("../db-config/connections/oracle-db");
// let pgDbEmis = require("../db-config/connections/pg-db-emis");

module.exports = (currentObj, payload, cParams) => {
    return new Promise((resolve, reject) => {
        if ((currentObj.Server == "SQL") && currentObj.Database == "APPT") {
            sqlDBAppt(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
        else if ((currentObj.Server == "SQL") && currentObj.Database == "APPTV9") {
            sqlDBApptV9(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                console.log(error)
                reject(error);
            });
        }
        else if ((currentObj.Server == "SQL") && currentObj.Database == "FB") {
            sqlDBFb(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
       else if ((currentObj.Server == "SQL") && currentObj.Database == "CEMS") {
        console.log("cems", currentObj);
            sqlDBCems(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
         else if ((currentObj.Server == "SQL") && currentObj.Database == "PMG") {
            sqlDBpmg(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                console.log(error)
                reject(error);
            });
        }
        else if ((currentObj.Server == "PG") && currentObj.Database == "QI") {
            pgDbQi(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
        else if ((currentObj.Server == "PG") && currentObj.Database == "APK_MIS") {
            pgDbMIS(currentObj, payload, cParams).then((result) => {
				//console.log("APK_MIS",result);
                resolve(result);
            }).catch((error) => {
				//console.log("APK_MIS-error",error);
                reject(error);
            });
        }
        else if ((currentObj.Server == "PG") && currentObj.Database == "APK_DOCTOR") {
            pgDbDOC(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
        else if ((currentObj.Server == "SQL") && currentObj.Database == "PHARMACY") {
            sqlDBpharmacy(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
		/*		
        else if (currentObj.Server == "ORACLE") {
            oracleDb(currentObj, payload, cParams).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }
        */
        else {
            reject({ "ERROR": "ERROR_IN_MAPPING", "MESSAGE": `No Server Found to connect With given server name:- ${currentObj.Server}` });
        }
    });

}
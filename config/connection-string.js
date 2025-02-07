const config = require("../app-config");
if (!config.NODE_ENV) config.NODE_ENV = "development";

const connectionObj = {
    "development": {
        "ports": {
            "app": 13000,
            "appt": 13001,
            "qi": 13002,
            "redis": 13003,
            "lab": 13004
        },
        "sqlDbAppt": {
            "user": "sa",
            "password": "emr$123",
            "server": "SHIP-DB01\\SHIP2012",
            "database": "SUV_D_EMR_M",
            "connectionTimeout": 30000,
            "requestTimeout": 30000,
            "options": {
                "appName": 'EMRNode'
            }
        },
        "sqlDbFb": {
            "user": "sa",
            "password": "emr$123",
            "server": "SHIP-DB02\\SHIP2016",
            "database": "DOC9_PROD_FB",
            "connectionTimeout": 30000,
            "requestTimeout": 30000,
            "options": {
                "appName": 'FbNode'
            }
        },
        "oracleDb": {
            "user": "system",
            "password": "managers",
            "connectString": "HIMS"
        },
        "pgDbQi": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'SH_D_EMR_QI',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbMIS": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'SH_D_EMR_MIS',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbDOC": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'EMR_DOCTOR_APP',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "redis": {
            "host": "172.31.31.110"
        }
    },
    "testing": {
        "ports": {
            "app": 11000,
            "appt": 11001,
            "qi": 11002,
            "redis": 11003,
            "lab": 11004
        },
        "sqlDbAppt": {
            "user": "sa",
            "password": "emr$123",
            "server": "SHIP-DB01\\SHIP2012",
            "database": "SUV_D_EMR_M",
            "connectionTimeout": 30000,
            "requestTimeout": 30000,
            "options": {
                "appName": 'EMRNode'
            }
        },
        "sqlDbFb": {
            "user": "sa",
            "password": "emr$123",
            "server": "SHIP-DB02\\SHIP2016",
            "database": "DOC9_PROD_FB",
            "connectionTimeout": 30000,
            "requestTimeout": 30000,
            "options": {
                "appName": 'FbNode'
            }
        },
        "oracleDb": {
            "user": "system",
            "password": "managers",
            "connectString": "HIMS"
        },
        "pgDbQi": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'SH_D_EMR_QI',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbMIS": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'SH_D_EMR_MIS',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbDOC": {
            "host": '172.31.31.52',
            "port": 5432,
            "database": 'EMR_DOCTOR_APP',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "redis": {
            "host": "172.31.31.110"
        }
    },
    "doc9_uat": {
        "ports": {
            "appt": 13001,
            "qi": 13002,
            "redis": 13003,
            "lab": 13004
        },
        "sqlDbAppt": {
            user: "Syadminuser",
            password: "emr$123",
            server: "10.15.79.30",//10.15.79.30
            port: 16777,
            database: "EMR_UAT",
            connectionTimeout: 60000,
            requestTimeout: 60000,
            options: {
                appName: 'nodeApptUat'
            }
        },
        "sqlDbApptV9": {
            user: "Syadminuser",
            password: "emr$123",
            server: "10.15.79.30",//10.15.79.30
            port: 16777,
            database: "EMR_PP_UAT",
            "connectionTimeout": 30000,
            "requestTimeout": 30000,
            "options": {
                "appName": 'EMRV9Node'
            }
        },
        "sqlDbFb": {
            user: "Syadminuser",
            password: "emr$123",
            server: "10.15.79.30",//10.15.79.30
            port: 16777,
            database: "FB",
            connectionTimeout: 60000,
            requestTimeout: 60000,
            options: {
                appName: 'nodeFbUat'
            }
        },
        "oracleDb": {
            "user": "system",
            "password": "managers",
            "connectString": "HIMS"
        },
        "pgDbQi": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_UAT_QI',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbMIS": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_MIS',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbDOC": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_DOC_APP',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "redis": {
            "host": "127.0.0.1"
        }
    },
    "production": {
        "ports": {
            "appt": 20001,
            "qi": 10002,
           // "qi": 465,
            "redis": 10003,
            "lab": 10004
        },
        "sqlDbAppt": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30", // 10.15.79.30
            "database": "APPT_LIVE",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            "options": {
                "appName": 'nodeApptProd',
                "encrypt": false
            }
        },
        "sqlDbCems": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30", // 10.15.79.30
            "database": "P_CEMS_PAT_REP",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            "options": {
                "appName": 'nodeApptProd',
                "encrypt": false
            }
        },
        "sqlDBpmg": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30", // 10.15.79.30
            "database": "SUV_D_EMR_PMG",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            "options": {
                "appName": 'nodeApptProd',
                "encrypt": false
            }
        },
        "sqlDbPharmacy": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30",   
            "database": "EMR_PHARMACY",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            "options": {
                "appName": 'nodeApptPharmacy',
                "encrypt": false
            }
        },
        "sqlDbApptV9": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30",
            "database": "APPT_LIVE",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            "options": {
                "appName": 'EMRV9Node',
                "encrypt": false
            }
        },
        "sqlDbFb": {
            "user": "sa",
            "password": "emr$123",
            "server": "10.15.79.30", //SHEP1DB
            "database": "FB",
            "port": 1433,
            "connectionTimeout": 60000,
            "requestTimeout": 60000,
            options: {
                appName: 'nodeFbProd',
                "encrypt": false
            }
        },
        "oracleDb": {
            "user": "system",
            "password": "managers",
            "connectString": "HIMS"
        },
        "pgDbQi": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_UAT_QI',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbMIS": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_MIS',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "pgDbDOC": {
            "host": '10.15.79.30',
            "port": 16666,
            "database": 'EMR_DOC_APP',
            "user": 'postgres',
            "password": 'emr$123'
        },
        "redis": {
            "host": "127.0.0.1"
        }
    }
};

module.exports = (name) => {
    let env = config.NODE_ENV;
    /** This Is Just Maniplation of environment variable 
     *  You can set this variable at application start page
    */
    if (process.env.CUSTOM_NODE_ENV) env = process.env.CUSTOM_NODE_ENV;

    if (connectionObj && connectionObj[env]) return connectionObj[env][name];
    else {
        console.log(`No connection string(${name}) found with node environment of ${env}`);
        process.exit(1);
    }
}
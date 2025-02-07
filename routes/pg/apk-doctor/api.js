'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "APK_DOCTOR";
const dbSchema = require("../../../db-config/helper-methods/pg/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/pg/response-change");
const generateParams = require("../../../db-config/helper-methods/pg/generate-paramaters");
const mapper = require("../../../db-config/mapper");
const dbcall = require('../../../db-config/models/sql/appointments/schema');
const axios = require('../../../services/axios');
const circular = require('json-stringify-safe');




function getAllHosts() {
    return new Promise(async function (resolve, reject) {
        await mapper(dbSchema.getAllHosts).then((resp) => {
            resolve({ hostData: resp.RES_OBJ, err: null });
        }).catch((error) => {
            resolve({ hostData: null, err: error });
        });
    });
}

function httpreq(_type, _url, _params) {
    return new Promise(async function (resolve, reject) {
        if (_type === 'GET') {
            axios.get(_url,_params).then((response) => {
                if (response) {
                    resolve({ success: true, desc: "", data: response})
                }
                else {
                    resolve({ success: false, desc: (response.desc || "No Records found"), data: [] })
                }
            }).catch(err => {
                resolve({ success: false, desc: err, data: [] })
            });
        }
        else if (_type === 'POST') {
            axios.post(_url, _params).then((response) => {
                if (response) {
                    resolve({ success: true, desc: "", data: response })
                }
                else {
                    resolve({ success: false, desc: "No Records found", data: [] })
                }
            }).catch((error) => {
                resolve({ success: false, desc: error, data: [] })
            });
        }
    });
}

function executeHttpRequest(_type, _url, _params) {
    return new Promise(async function (resolve, reject) {
        if (_type === 'GET') {
            axios.get_v1(`${_url}`, _params).then((response) => {
                if (response && response.status == 200) {
                    resolve({ success: true, desc: "", data: (response.data || "") })
                }
                else {
                    resolve({ success: false, desc: (response.desc || "No Records found"), data: [] })
                }
            }).catch(err => {
                resolve({ success: false, desc: err, data: [] })
            });
        }
        else if (_type === 'POST') {
            axios.post(_url, _params).then((response) => {
                if (response && response.Status === null) {
                    resolve({ success: true, desc: "", data: response })
                }
                else {
                    resolve({ success: false, desc: "No Records found", data: [] })
                }
            }).catch((error) => {
                resolve({ success: false, desc: (JSON.stringify(error) || error), data: [] })
            });
        }
    });
}

router.all('/*', (req, res, next) => {
    try {
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": MODULE_NAME
        };
        req.body = generateParams(req.body, req.cParams);
        next();
    }
    catch (ex) {
        return res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARE_CPARAMS", "MESSAGE": ex.message });
    }
});

router.post('/auth', (req, res) => {
    mapper(dbSchema.getUserValiditate, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        response = responseChange(response, req.cParams);
        if (response && response[0] && response[0].STATUS === 0) {
            return res.status(400).send(response[0]);
        }
        else return res.json(response);
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getHosts', (req, res) => {
    mapper(dbSchema.getAllHosts, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getInsUpdUser', (req, res) => {
    mapper(dbSchema.InsUpdUser, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/putMaster', (req, res) => {
    mapper(dbSchema.insUpdMasterData, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getMaster', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getOrgLocDataByLocId', (req, res) => {
    mapper(dbSchema.uprGetOrgLoc, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/putMastTran', (req, res) => {
    mapper(dbSchema.insUpdTransactionDataInfo, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getMastTran', (req, res) => {
    mapper(dbSchema.getTransactionDataInfo, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getUserInfo', (req, res) => {
    mapper(dbSchema.uprGetUserDet, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/loginUsersGrid', (req, res) => {
    mapper(dbSchema.uprGetUserLogInfoDoc, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getLocation', (req, res) => {
    mapper(dbSchema.getLocation, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getOrganization', (req, res) => {
    mapper(dbSchema.getOrganization, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getInsUsers', (req, res) => {
    try {
        req.body.par_loc_json = JSON.stringify(req.body.par_loc_json)
        //console.log("req.body",req.body)
        mapper(dbSchema.getInsUsers, req.body, req.cParams).then((response) => {
            //console.log("getInsUsers-response",response)
            let _output = responseChange(response, req.cParams);
           //console.log("_output",_output);
            return res.json(_output);
        }).catch((error) => {
            //console.log("error",error)
            return res.status(400).send(error);
        });
    } catch (err) {
        //console.log("err",err)
        return res.status(400).send(err);
    
    }
});

router.post('/insUpdComMsgReq', (req, res) => {
    mapper(dbSchema.insUpdComMsgReq, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getMasterDataNew', (req, res) => {
    mapper(dbSchema.getMasterDataNew, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/insUpdRazerPayCust', (req, res) => {
    mapper(dbSchema.insUpdRazerPayCust, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/insUpdVendorDetails', (req, res) => {
    mapper(dbSchema.insUpdVendorDetails, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/insUpdOrganization', (req, res) => {
    mapper(dbSchema.insUpdOrganization, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/insUpdLocation', (req, res) => {
    mapper(dbSchema.insUpdLocation, req.body, req.cParams).then((response) => {
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/insUpdUserRoleDocAccess', (req, res) => {
    mapper(dbSchema.insUpdUserRoleDocAccess, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});
router.post('/uprGetFeedBackRequest', (req, res) => {
    mapper(dbSchema.uprGetFeedBackRequest, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});
router.post('/uprInsupdFeedBackRequest', (req, res) => {
    mapper(dbSchema.uprInsupdFeedBackRequest, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/uprGetUserAuditInfo', (req, res) => {
    mapper(dbSchema.uprGetUserAuditInfo, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});
/*
router.post('/getPackageMasterMobi', (req, res) => {
    mapper(dbcall.getPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/insupdPackageMasterMobi', (req, res) => {
    req.body.ALL_PACKAGES_JSON=JSON.stringify(req.body.ALL_PACKAGES_JSON)
    mapper(dbcall.uprInsupdPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
*/
router.post('/uprGetPackageMasterMobi', async (req, res) => {
    if (req.body.host_name === "DOC9") {
        mapper(dbcall.getPackageMasterMobi, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            return res.status(400).send(error);
        });
    }
    else {
        let { hostData, err } = await getAllHosts();
        if (err) {
            return res.status(400).send(err);
        }

        let orgObj = hostData.find(o => (o.host_name === req.body.host_name));
        if (orgObj) {
            axios.post(orgObj.host_api_url + "getPackageMasterMobi", req.body).then((response) => {
                return res.json(response);
            }).catch((error) => {
                return res.status(400).send(error);
            });
        }
        else {
            return res.status(400).send({ "message": "No host found" });
        }
    }
});



router.post('/uprInsupdPackageMasterMobi', async (req, res) => {
    if (req.body.host_name === "DOC9") {
        mapper(dbcall.uprInsupdPackageMasterMobi, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            return res.status(400).send(error);
        });
    }
    else {
        let { hostData, err } = await getAllHosts();
        if (err) {
            return res.status(400).send(err);
        }
        let orgObj = hostData.find(o => (o.host_name === req.body.host_name));
        if (orgObj) {
            axios.post(orgObj.host_api_url + "uprInsupdPackageMasterMobi", req.body).then((response) => {
                return res.json(response);
            }).catch((error) => {
                return res.status(400).send(error);
            });
        }
        else {
            return res.status(400).send({ "message": "No host found" });
        }
    }

});


router.post('/uprGetPackageMasterMobi', (req, res) => {
    mapper(dbSchema.uprGetPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetAppUsageRep', (req, res) => {
    mapper(dbSchema.uprGetAppUsageRep, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetWhatsappLog', (req, res) => {
    mapper(dbSchema.uprGetWhatsappLog, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/insertLog', (req, res) => {
    req.body.whatsapp_log = JSON.stringify(req.body)
    mapper(dbSchema.uprInsWhatsappLog, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsLabReportsLog', (req, res) => {
    req.body.lab_reports_log = JSON.stringify(req.body.lab_reports_log)
    mapper(dbSchema.uprInsLabReportsLog, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprInsupdBillSmsLink', async (req, res) => {
    mapper(dbSchema.uprInsupdBillSmsLink, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/uprGetBillSmsLink', async (req, res) => {
    mapper(dbSchema.uprGetBillSmsLink, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/getInsupdOrgLocMaster', async (req, res) => {
    req.body.master_json = JSON.stringify(req.body.master_json)
    mapper(dbSchema.getInsupdOrgLocMaster, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/insertMedMasterData', async (req, res) => {
    mapper(dbSchema.uprInsupdMedDataXml, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/getInsupdBillsSmsPdf', async (req, res) => {
    mapper(dbSchema.getInsupdBillsSmsPdf, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/insertSmartRptBase64Data', async (req, res) => {
    mapper(dbSchema.insertSmartRptBase64Data, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});
router.post('/getSmartRptBase64Data', async (req, res) => {
    mapper(dbSchema.insertSmartRptBase64Data, req.body).then(async function (response) {
        return res.json(response.RES_OBJ)
    }).catch(function (ex) {
        return ex;
    });
});

router.post('/gethisLabReports', async (req, res) => {
    try {
            if (req.body && req.body.url && req.body.url.length > 0 && req.body.type && req.body.type.length > 0 && (req.body.type === "GET" || req.body.type === "POST")) {
                req.body.url = req.body.method ? (req.body.url + req.body.method) : req.body.url;
                let _resp = await httpreq(req.body.type, req.body.url, req.body.params);
                if(req.body.type === "GET" && _resp && _resp.data && _resp.data.Status && _resp.data.Status.code && _resp.data.Status.code === 500){
                    return res.status(400).send({ status: "FAIL", desc: "please provide input parameters", data: []});
                }
                else if (_resp) {
                    return res.status(200).json({ status: "SUCCESS", desc: "", data: _resp.data });
                }
                else {
                    return res.status(400).send({ status: "FAIL", desc: "", data: []});
                }
            }
            else {
                return res.status(400).send({ status: "FAIL", desc: "please provide valid parameters", data: [] });
            }
        } catch (error) {
            return res.json({ status: "FAIL", desc: error, data: [] });
        }
    });

router.post('/httpRequests', async (req, res) => {
    try {
        if (req.body && req.body.url && req.body.url.length > 0 && req.body.type && req.body.type.length > 0 && (req.body.type === "GET" || req.body.type === "POST")) {
            req.body.url = req.body.method ? (req.body.url + req.body.method) : req.body.url;
            let _resp = await executeHttpRequest(req.body.type, req.body.url, req.body.params);

            if (_resp && _resp.success) {
                return res.status(200).json({ status: "SUCCESS", desc: (_resp.desc || ""), data: (_resp.data.data || "") });
            }
            else {
                return res.status(400).send({ status: "FAIL", desc: (_resp.desc || ""), data: _resp.data });
            }
        }
        else {
            return res.status(400).send({ status: "FAIL", desc: "please provide valid parameters", data: [] });
        }
    } catch (error) {
        return res.json({ status: "FAIL", desc: error, data: [] });
    }
});

module.exports = router;
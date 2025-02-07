'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "APK_DOCTOR";
const dbSchema = require("../../../db-config/helper-methods/pg/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/pg/response-change");
const generateParams = require("../../../db-config/helper-methods/pg/generate-paramaters");
const mapper = require("../../../db-config/mapper");

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
    mapper(dbSchema.getInsUsers, req.body, req.cParams).then((response) => {
		//console.log("response",response);
        if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
	   
        return res.json(responseChange(response, req.cParams));
		
    }).catch((error) => {
		//console.log("response",error);
        //if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
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
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        //if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});
router.post('/uprGetFeedBackRequest', (req, res) => {
    mapper(dbSchema.uprGetFeedBackRequest, req.body, req.cParams).then((response) => {
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        //console.log("uprGetFeedBackRequest", response)
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        
        //if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});
router.post('/uprInsupdFeedBackRequest', (req, res) => {
    mapper(dbSchema.uprInsupdFeedBackRequest, req.body, req.cParams).then((response) => {
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        //console.log("uprInsupdFeedBackRequest", response)
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        
        //if (error.DB_EXEC) res.set('x-exec', JSON.stringify(error.DB_EXEC));
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/uprGetUserAuditInfo',(req,res)=>{
    mapper(dbSchema.uprGetUserAuditInfo,req.body,req.cParams).then((response)=>{
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});




module.exports = router;
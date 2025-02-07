'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "APK_MIS";
const dbSchema = require("../../../db-config/helper-methods/pg/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/pg/response-change");
const generateParams = require("../../../db-config/helper-methods/pg/generate-paramaters");
const mapper = require("../../../db-config/mapper");
const winston = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require("fs");
const appConfig = require("../../../app-config");
const daysInterval=7;//emis hisData insertion imto pg with time interval.

let transports=[];

transports.push(
    new winston.transports.DailyRotateFile({
        name:'file',
        datePattern:"YYYY-MMM-DDTHH",
        filename:appConfig.APK_LOG_PATH + "public/log/emis/%DATE%.log",
        maxFiles:'30d'
    }) 
);

var logger=new winston.createLogger({transports:transports});
//logger.info('log Information')

function getDate() {
    return new Date().toLocaleString();
}

async function log(data, error) {
    logger.info({"date":getDate(),"message": data}); 
    return true;
}

function  convertDate(dateString){
    let month=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
    let cMonth=""
    let seperate = dateString.split("-");
    let indexMonth=month.indexOf(convertKeys(seperate[1]))+1;
    if(indexMonth!=0){
    if (indexMonth<10){
        cMonth="0"+indexMonth
    }
    else{
        cMonth=indexMonth;
    }
    return [seperate[2],cMonth,seperate[0]].join("-")
}
    return [seperate[2],seperate[1],seperate[0]].join("-")
}
function convertKeys(arr) {
    let keys="";
    keys = arr.toUpperCase()
    return keys
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

router.post('/getDocuments', (req, res) => {
    mapper(dbSchema.getAllDocuments, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getOrgLocCos', (req, res) => {
    mapper(dbSchema.getOrgLocCos, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/auth', (req, res) => {
    mapper(dbSchema.getVerifyUser, req.body, req.cParams).then((response) => {
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

router.post('/getOrgLocCosById', (req, res) => {
    mapper(dbSchema.getFindOrgLocCosById, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

/**
 * this is used to insert data.
 * Our finance service insert from this
 */
router.post('/putMasterData', (req, res) => {
    mapper(dbSchema.insFinanceData, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getMasterData', (req, res) => {
    mapper(dbSchema.getFinanceData, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

/**
 * this method is used to insert data
 * but this is called by HIS service
 */
router.post('/insUpdMasterData', async (req, res) => {
    try {
		//console.log("insUpdMasterData---req.body",req.body)
		
		
        const path = appConfig.DIR_PATH + "public/static/finance/insUpdMasterData/" + Date.parse(new Date()) + ".json";
		console.log("emis-insUpdMasterData-1:--org_id:-",req.body.ORG_CD,"date:",new Date().toLocaleString());
        //fs.writeFileSync(path, JSON.stringify(req.body));
		await log(req.body)
    }
    catch (ex) { }
	
    try {
		let cDate=new Date().toISOString().slice(0,10)
        let iDate=req.body.DATE_VALUE;
        let fDate=convertDate(iDate)
        let diffInMs = new Date(cDate)-new Date(fDate)
        let diffInDays=diffInMs/(1000*60*60*24);
        // if (diffInDays>daysInterval){
            // return res.status(200).json([{ STATUS_ID:0,MSG:`Data not allowed morethan ${daysInterval} days` }]);
        // }
		
		/*if(req.body.COST_CENTER_CD=="MCIN"){
			return res.status(400).send("please provide valid costcenter data");
		}*/
		
		
        req.body.DATA = JSON.stringify(req.body.DATA || []);
        mapper(dbSchema.insUpdMasterData, req.body, req.cParams).then((response) => {
			
			//console.log("insUpdMasterData-1",req.body,response);
			response = responseChange(response, req.cParams);
			if(response && response.length > 0 && response[0].STATUS_ID === 1){
				//console.log("insUpdMasterData after STATUS_ID===1 ",response);
				return res.json(response);
			}
			else {
				console.log("emis-insUpdMasterData-1-error",response,req.body);
				res.status(400).send(response[0]);
			}
        }).catch((error) => {
            if (error.ERROR) error = error.ERROR;
			console.log("emis-insUpdMasterData-error",error,req.body);
            return res.status(400).send(error);
        });
    }
    catch (ex) { 
	console.log("emis-insUpdMasterData-error-catch",error,req.body);
		res.status(400).send(ex);
	}
	

	// if(!((req.body.ORG_CD === "MCHM") || (req.body.ORG_CD === "DYPH"  && req.body.LOC_CD === "CHRT" && req.body.COST_CENTER_CD === "CHRT") || (req.body.ORG_CD === "DYPH"  && req.body.LOC_CD === "HLTC" && req.body.COST_CENTER_CD === "HLTC"))){
		// return res.status(400).send("Provided ORG, LOC, COS values are not matched or not exist in you database Master values");
	// }

    // if (req.body && req.body.ORG_CD && req.body.LOC_CD && req.body.COST_CENTER_CD && req.body.DATE_VALUE && req.body.DATA && Array.isArray(req.body.DATA)) {
        // req.body.DATA = JSON.stringify(req.body.DATA || []);
        // mapper(dbSchema.insUpdMasterData, req.body, req.cParams).then((response) => {
			// response = responseChange(response, req.cParams);
			// if(response && response.length > 0 && response[0].STATUS_ID === 1)
				// return res.json(response);
			// else {
				// res.status(400).send(response[0]);
			// }
        // }).catch((error) => {
            // if (error.ERROR) error = error.ERROR;
            // return res.status(400).send(error);
        // });
    // }
    // else {
        // return res.status(400).send('insufficient or incorrect paramaters');
    // }
});

router.post('/getInsUpdOrgLocCos', (req, res) => {
    mapper(dbSchema.getInsUpdOrgLocCos, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/getInsUpdUser', (req, res) => {
    mapper(dbSchema.getInsUpdUser, req.body, req.cParams).then((response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/uprGetMisDataChk', (req, res) => {
    mapper(dbSchema.uprGetMisDataChk, req.body, req.cParams).then((response) => {
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdOrganization', (req, res) => {
    mapper(dbSchema.uprInsupdOrganization, req.body, req.cParams).then((response) => {
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

router.post('/uprGetFinanceDet', (req, res) => {
    mapper(dbSchema.uprGetFinanceDet, req.body, req.cParams).then((response) => {
		//console.log("response",response);
        //if (response.DB_EXEC) res.set('x-exec', JSON.stringify(response.DB_EXEC));
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        if (error.ERROR) error = error.ERROR;
        return res.status(400).send(error);
    });
});

module.exports = router;
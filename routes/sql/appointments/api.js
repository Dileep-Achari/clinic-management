'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "APPOINTMENTS";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");
const config = require("../../../app-config");
const date = require("../../../utilities/dates");
const slack = require("../../../services/slack");
const axios = require('../../../services/axios');
const fsc = require('../../../services/fs');
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const CreatePdf = require("pdf-creator-node");
const upload = multer();
const { cv19VaccineReqQuetions, vaccineNames, orgParams } = require("../../../constants/covidRegQuetions");
const util = require("../../../utilities/is-valid");
const appConfig = require("../../../app-config");
const moment = require('moment');
const _ = require('underscore');
const puppeteer = require('puppeteer');
const format = require('string-format');
const CryptoJS = require("crypto-js");
const { url, uri } = require('./const/commonurl')
const smartReportGenerator = require("../../../constants/smart-report-generation/smart-report-pdf-generation-api");

const { viatlsTabFmt } = require("../../../utilities/dataConvertion");

// const pdfConst = require('../../../../pdf/modules/consoleApp/const');
const { Console } = require("console");
format.extend(String.prototype, {});
const _secretKey = 'S0ftHe@lth$123SUv@$n@Tech8%#!(%';

// this is for multer reference
const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }]);

/*
    method data set into redis for this methods
    1. orgLogo
    2. getQuotations
*/

/*Generate-pdf*/

const header = {
    height: "100mm",
    contents: fs.readFileSync(appConfig.DIR_PATH + "constants/generate-pdf/header.html", 'utf8')
};

const footer = {
    height: "50mm",
    contents: {
        default: fs.readFileSync(appConfig.DIR_PATH + "constants/generate-pdf/footer.html", 'utf8')
    }
};
const html = fs.readFileSync(appConfig.DIR_PATH + "constants/generate-pdf/body.html", 'utf8');


//function pdf generation
async function createRpt(dtaObj, apiUrl, isDmsUpload, locObj) {
    try {
        let _pdfUrl = "", _pdfPath = "", spBuf, lpBuf, shortUrl;
        // console.log(`pdf`, dtaObj);
        _pdfUrl = dtaObj.PDF_URL.format(dtaObj);
        //  console.log(`url`, _pdfUrl);
        // spBuf = await genPdf(_pdfUrl, _pdfPath, "S");

        _pdfPath += dtaObj.UMR_NO + "_" + (dtaObj.CONSULTATION_NO || dtaObj.RPT_FILE_DOC_NAME) + "_OP" + '.pdf';
        _pdfUrl += "&getall=A";

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true,
            timeout: 0
        });

        const page = await browser.newPage();
        // console.log("page",page)
        process.setMaxListeners(Infinity);
        await page.goto(_pdfUrl, { waitUntil: 'networkidle2', timeout: 0 });
        await page.goto(_pdfUrl, { waitUntil: 'networkidle2', timeout: 100000 });
        await page.waitFor(5000);
        let _bufValue = "";
        //console.log("dtaObj.PDF_URL",_pdfUrl)
        _bufValue = await page.pdf({ path: _pdfPath, format: 'A4' });
        //console.log("_bufValue",_bufValue)
        await browser.close();

        // lpBuf = await genPdf(_pdfUrl, _pdfPath, "L");
        // spBuf = spBuf.toString("base64");
        lpBuf = _bufValue.toString("base64");

        return lpBuf;
    }
    catch (ex) {
        console.log(ex.message);
        return ex

    }
}

function getDataByAdmno(arr, data) {
    const dataObj = arr.find(u => (u.ADMISSIONNO === data));
    return dataObj
}


//get dashboard doctor data 
function DashBoardDoctorData(data) {
    let finalData = [];
    if (data) {
        for (let doct in data) {
            finalData.push({
                "label": data[doct].rsrc_name,
                "value": data[doct].paid_patient || data[doct].total_admission,
                "icon": ""
            });
        }
    }
    else {
        finalData = [];
    }
    return finalData
}

// get dashboard speciality data
function DashBoardSpecialityData(data) {
    let finalData = [];
    if (data) {
        for (let doct in data) {
            finalData.push({
                "label": data[doct].speciality_name,
                "value": data[doct].count || 0,
                "icon": ""
            });

        }
    }
    else {
        finalData = [];
    }
    return finalData
}


function dataTrackLog(data, params) {
    mapper(dbSchema.insUserAppTrackActionDataJson, data, params).then((response) => {
        //console.log("dataTrackLog-sucess");
        return response
    }).catch((error) => {
        //console.log("dataTrackLog-fail");
        return error
    });
}
function prepareDbExec(schema, _payload) {
    var payloadString = "";
    let _schema = schema ? schema[0] : [];
    if (_schema && Array.isArray(_schema.Schema)) {
        payloadString += `exec ${_schema.SpName} `;
        _schema.Schema.forEach(obj => {
            obj.alias = obj.alias ? obj.alias.trim() : "";
            obj.column = obj.column ? obj.column.trim() : "";
            if (_payload[obj.column] && typeof _payload[obj.column] === 'string') {
                let __value = _payload[obj.column] ? _payload[obj.column].trim() : null;
                if (__value != null)
                    payloadString += `@${obj.column}='${__value}',`;
                else
                    payloadString += `@${obj.column}=${__value},`;
            }
            else payloadString += `@${obj.column}=${_payload[obj.column] ? _payload[obj.column] : null},`;
        });
    }
    if (payloadString.length > 0) {
        payloadString = payloadString.substring(0, payloadString.lastIndexOf(',')) + " go";
    }
    //console.log("string", payloadString);
    return payloadString;
}

/* JSON validation */
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};

router.all('/*', (req, res, next) => {
    try {
        if (req.body && req.body.encryptedData) {
            let decrypted = CryptoJS.AES.decrypt(req.body.encryptedData, _secretKey);
            decrypted = decrypted.toString(CryptoJS.enc.Utf8);
            if (decrypted) {
                if (isJSON(decrypted)) {
                    req.body = JSON.parse(decrypted);
                }
                else {
                    req.body = decrypted;
                }
            }
            else {
                return res.status(498).send({ "ERROR": "Invalid key", "MESSAGE": "Invalid Key.." });
                // req.body = req.body.encryptedData;
            }
        }
        req.cParams = {
            "URL": req.url.substr(1, req.url.length),
            "IS_MULTI_RESULTSET": req.headers["x-multi-resultset"] || "N",
            "IS_LOAD_AJAX": req.headers["x-load-ajax"] || "N",
            "MODULE": MODULE_NAME
        };
        req.body = generateParams(req.body, req.cParams);
        if (req.headers["is-data-logging"] === "Y" && req.cParams.URL != "InsupdLvlHistDataInfo" && req.cParams.URL != "InsupdAutoCapturingDataInfo" && req.cParams.URL != "UpdPagelvlHistoryData" && req.cParams.URL != "InsupdUserAppTrackActions") {
            // var filteredSchema = dbSchema.find((schema) => {
            //     return (schema.EVENT_ID === req.cParams["URL"]);
            // });

            let _sch = _.filter(dbSchema, function (__schema, __idx) {
                if (__idx === req.cParams.URL) return __schema;
            })
            let jsonData = {
                SESSION_ID: req.body.IP_SESSION_ID || req.body.SESSION_ID,
                LOOKUP_NAME: req.cParams.URL,
                LOOKUP_QRY: prepareDbExec(_sch, req.body)
            }
            let resp = dataTrackLog({ JSON: JSON.stringify(jsonData) }, req.cParams)
        }

        next();
    }
    catch (ex) {
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});

/**
 * read redis data aganist a key
 * @param {string} key 
 */
async function getdata(key) {
    return new Promise((resolve, reject) => {
        try {
            axios.post(config.REDIS_URL + "getKey", { key }).then(res => {
                if (res.error) resolve({ gData: null, gError: res.error });
                else if (res.data) resolve({ gData: res.data, gError: null });
                else resolve({ gData: null, gError: null });
            }).catch(ex => {
                resolve({ gData: null, gError: ex });
            })
        }
        catch (ex) {
            resolve({ gData: null, gError: ex });
        }
    });
}

/**
 * insert data into redis aganist key
 * @param {string: key is a unique id} key
 * @param {string: value you want to set data} data 
 */
async function insdata(key, value, tte) {
    return new Promise((resolve, reject) => {
        try {
            axios.post(config.REDIS_URL + "putKey", { key, data: JSON.stringify(value), expire: true, tte: tte || 86400 }).then(res => {
                resolve({ iData: res, iError: null });
            }).catch(ex => {
                resolve({ iData: null, iError: ex });
            })
        }
        catch (ex) {
            resolve({ iData: null, iError: ex });
        }
    });
}

/** 
 * if data in redis fetch from redis
 * no data in redis set data into redis 
 */
router.post('/orgLogo', async (req, res) => {
    /*
    // node cache block
    const key = `${config.HOST}.INS.${config.NODE_ENV.toUpperCase()}.APT.API.${req.cParams.URL.toUpperCase()}.${req.body.ORG_ID}`;
    let isValid = false;
    if (req.body.ORG_ID) isValid = true;
    const { gData, gError } = isValid ? await getdata(key) : { gData: null, gError: null };
    if (gData) {
        return res.json(JSON.parse(gData));
    }

    mapper(dbSchema.orgLogo, req.body, req.cParams).then(async (response) => {
        response = responseChange(response, req.cParams);
        let { iData, iError } = isValid ? await insdata(key, response, 20) : { iData: null, iError: null };
        if (iError) {
            // log error here
        }
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
    */

    mapper(dbSchema.orgLogo, req.body, req.cParams).then(async (response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/**
 * if data in redis fetch from redis
 *  no data in redis set data into redis 
 */
router.post('/getQuotations', async (req, res) => {
    /*
    // node cache block
    const key = `${config.HOST}.INS.${config.NODE_ENV.toUpperCase()}.APT.API.${req.cParams.URL.toUpperCase()}.${req.body.DT}`;
    const { gData, gError } = await getdata(key);
    if (gData) {
        return res.json(JSON.parse(gData));
    }

    mapper(dbSchema.getQuotations, req.body, req.cParams).then(async (response) => {
        response = responseChange(response, req.cParams);
        let { iData, iError } = await insdata(key, response);
        if (iError) {
            // log error here
        }
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
    */

    mapper(dbSchema.getQuotations, req.body, req.cParams).then(async (response) => {
        return res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/181', (req, res) => {
    mapper(dbSchema['181'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/184', (req, res) => {
    mapper(dbSchema['184'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/700', (req, res) => {
    mapper(dbSchema['700'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/701', (req, res) => {
    mapper(dbSchema['701'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/801', (req, res) => {
    mapper(dbSchema['801'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/900', (req, res) => {
    mapper(dbSchema['900'], req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpConsPatDetNew', (req, res) => {
    mapper(dbSchema.getIpConsPatDetNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHicBiomedicalWate', (req, res) => {
    mapper(dbSchema.getHicBiomedicalWate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdAldScoSys', (req, res) => {
    mapper(dbSchema.getdAldScoSys, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCathProcedure', (req, res) => {
    mapper(dbSchema.getIpCathProcedure, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpOpAnesthesia', (req, res) => {
    mapper(dbSchema.getIpOpAnesthesia, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpBloodRequest', (req, res) => {
    mapper(dbSchema.getIpBloodRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCathDetLis', (req, res) => {
    mapper(dbSchema.getIpCathDetLis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRecommHandoverNew', (req, res) => {
    mapper(dbSchema.getRecommHandoverNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPpreCath', (req, res) => {
    mapper(dbSchema.getIPpreCath, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSiteVerfyTimeoutDoc', (req, res) => {
    mapper(dbSchema.getSiteVerfyTimeoutDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQualityIndicator', (req, res) => {
    mapper(dbSchema.getQualityIndicator, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCriticalCarchrtDet', (req, res) => {
    mapper(dbSchema.getCriticalCarchrtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCathLabCheckList', (req, res) => {
    mapper(dbSchema.getIpCathLabCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCathProcRecord', (req, res) => {
    mapper(dbSchema.getIpCathProcRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRestraintOrderNew', (req, res) => {
    mapper(dbSchema.getRestraintOrderNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpAnesthesiaInvs', (req, res) => {
    mapper(dbSchema.getIpAnesthesiaInvs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpPreOpSurgeryAssmnt', (req, res) => {
    mapper(dbSchema.getIpPreOpSurgeryAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCheckList', (req, res) => {
    mapper(dbSchema.getIpCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpPreOpNurCheckList', (req, res) => {
    mapper(dbSchema.getIpPreOpNurCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpClinicalPathwayInfo', (req, res) => {
    mapper(dbSchema.getIpClinicalPathwayInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSurgeonAssessment', (req, res) => {
    mapper(dbSchema.getIpSurgeonAssessment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpDvtProphylaxisOrder', (req, res) => {
    mapper(dbSchema.getIpDvtProphylaxisOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpDvtSurgicalPatients', (req, res) => {
    mapper(dbSchema.getIpDvtSurgicalPatients, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdtDschrgCaseAbstract', (req, res) => {
    mapper(dbSchema.getAdtDschrgCaseAbstract, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIncidentTypeMaster', (req, res) => {
    mapper(dbSchema.getIncidentTypeMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpIncidentReporting', (req, res) => {
    mapper(dbSchema.getIpIncidentReporting, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDschrgICDDiagnosis', (req, res) => {
    mapper(dbSchema.getDschrgICDDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSrgnOprtnNotes', (req, res) => {
    mapper(dbSchema.getIpSrgnOprtnNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpAdendum', (req, res) => {
    mapper(dbSchema.getIpAdendum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPClnclExmntn', (req, res) => {
    mapper(dbSchema.getIPClnclExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPdutyDocNurde', (req, res) => {
    mapper(dbSchema.getIPdutyDocNurde, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDialysisUnit', (req, res) => {
    mapper(dbSchema.getDialysisUnit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpTurningChart', (req, res) => {
    mapper(dbSchema.getIpTurningChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSeizureChart', (req, res) => {
    mapper(dbSchema.getIpSeizureChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLoginIP', (req, res) => {
    mapper(dbSchema.getLoginIP, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpUsrValdLogin', (req, res) => {
    mapper(dbSchema.getIpUsrValdLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/sessionLoc', (req, res) => {
    mapper(dbSchema.sessionLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSearchRes', (req, res) => {
    mapper(dbSchema.getPatSearchRes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpAdmissions', (req, res) => {
    mapper(dbSchema.getIpAdmissions, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntMulty', (req, res) => {
    mapper(dbSchema.getEntMulty, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOpClinicalData', (req, res) => {
    mapper(dbSchema.getOpClinicalData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpFraPsNcp', (req, res) => {
    mapper(dbSchema.getIpFraPsNcp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPhyReAssesDtls', (req, res) => {
    mapper(dbSchema.getPhyReAssesDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpPatDet', (req, res) => {
    mapper(dbSchema.getIpPatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpAlrtDet', (req, res) => {
    mapper(dbSchema.getIpAlrtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpIntakeOutputChrt', (req, res) => {
    mapper(dbSchema.GetIpIntakeOutputChrt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpTransferDetails', (req, res) => {
    mapper(dbSchema.GetIpTransferDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocProsNot', (req, res) => {
    mapper(dbSchema.getDocProsNot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcNots1', (req, res) => {
    mapper(dbSchema.getRsrcNots1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMastrData', (req, res) => {
    mapper(dbSchema.getMastrData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpFraPsNcp1', (req, res) => {
    mapper(dbSchema.getIpFraPsNcp1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAssPhysiotherpy', (req, res) => {
    mapper(dbSchema.getAssPhysiotherpy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmnTriageLvl', (req, res) => {
    mapper(dbSchema.getAdmnTriageLvl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpErAssmnt', (req, res) => {
    mapper(dbSchema.getIpErAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Resperson', (req, res) => {
    mapper(dbSchema.Resperson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursInitAssmntDet', (req, res) => {
    mapper(dbSchema.getNursInitAssmntDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNurCPDet', (req, res) => {
    mapper(dbSchema.GetNurCPDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpeciality', (req, res) => {
    mapper(dbSchema.GetSpeciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConsVisit', (req, res) => {
    mapper(dbSchema.getConsVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatMov', (req, res) => {
    mapper(dbSchema.getPatMov, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetWards', (req, res) => {
    mapper(dbSchema.GetWards, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocationPoint', (req, res) => {
    mapper(dbSchema.getLocationPoint, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCCareChrtMast', (req, res) => {
    mapper(dbSchema.GetCCareChrtMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursHandDocmntValue', (req, res) => {
    mapper(dbSchema.getNursHandDocmntValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntValue', (req, res) => {
    mapper(dbSchema.getEntValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSubInsulinChart', (req, res) => {
    mapper(dbSchema.getIpSubInsulinChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpVerblDoc', (req, res) => {
    mapper(dbSchema.getIpVerblDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpRportComDoc', (req, res) => {
    mapper(dbSchema.getIpRportComDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBloodCompRecrd', (req, res) => {
    mapper(dbSchema.getBloodCompRecrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVitalSigns', (req, res) => {
    mapper(dbSchema.getVitalSigns, req.body, req.cParams).then((response) => {
        if (req.body.FLAG == "T") {
            let resp = viatlsTabFmt(response)
            return res.json(resp)
        }
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpPatMar', (req, res) => {
    mapper(dbSchema.getIpPatMar, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOTSurgclSrvcs', (req, res) => {
    //console.log("req.body----getOTSurgclSrvcs",req.body)
    mapper(dbSchema.getOTSurgclSrvcs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHandofComnRadgy', (req, res) => {
    mapper(dbSchema.getHandofComnRadgy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMortality', (req, res) => {
    mapper(dbSchema.getMortality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmissionDetails', (req, res) => {
    mapper(dbSchema.getAdmissionDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRosVal', (req, res) => {
    mapper(dbSchema.getRosVal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClinicalPathwayMaster', (req, res) => {
    mapper(dbSchema.getClinicalPathwayMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAssmColMstr', (req, res) => {
    mapper(dbSchema.getAssmColMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAssmDet', (req, res) => {
    mapper(dbSchema.getAssmDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVdDocrelByScreen', (req, res) => {
    mapper(dbSchema.getVdDocrelByScreen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetClinicalPathwayEntInfo', (req, res) => {
    mapper(dbSchema.GetClinicalPathwayEntInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIPpatHistory', (req, res) => {
    mapper(dbSchema.GetIPpatHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatMenstrlHis', (req, res) => {
    mapper(dbSchema.GetPatMenstrlHis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatGynObsHis', (req, res) => {
    mapper(dbSchema.GetPatGynObsHis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatPrevHist', (req, res) => {
    mapper(dbSchema.getPatPrevHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFreqMst', (req, res) => {
    mapper(dbSchema.getFreqMst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntSingle', (req, res) => {
    mapper(dbSchema.getEntSingle, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDurations', (req, res) => {
    mapper(dbSchema.GetDurations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRrtEvtRecord', (req, res) => {
    mapper(dbSchema.getRrtEvtRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInitAsmntNut', (req, res) => {
    mapper(dbSchema.getInitAsmntNut, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNutriReAsmnt', (req, res) => {
    mapper(dbSchema.getNutriReAsmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNutriAsmntPedi16', (req, res) => {
    mapper(dbSchema.getNutriAsmntPedi16, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRstrntOrder', (req, res) => {
    mapper(dbSchema.getRstrntOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPheriRecrdNew', (req, res) => {
    mapper(dbSchema.getPheriRecrdNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotifiableDisMaster', (req, res) => {
    mapper(dbSchema.GetNotifiableDisMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotifiableDiseasesDet', (req, res) => {
    mapper(dbSchema.GetNotifiableDiseasesDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotifableDisDetTran', (req, res) => {
    mapper(dbSchema.GetNotifableDisDetTran, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComplAuto', (req, res) => {
    mapper(dbSchema.getComplAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkOutItem', (req, res) => {
    mapper(dbSchema.chkOutItem, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetClinicalPathwayParam', (req, res) => {
    mapper(dbSchema.GetClinicalPathwayParam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getprofileType', (req, res) => {
    mapper(dbSchema.getprofileType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCpTranInfo', (req, res) => {
    mapper(dbSchema.getCpTranInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocFavorites', (req, res) => {
    mapper(dbSchema.getDocFavorites, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updSupQry', (req, res) => {
    mapper(dbSchema.updSupQry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpConsPatDet', (req, res) => {
    mapper(dbSchema.getIpConsPatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUsrUsbiltyRpt', (req, res) => {
    mapper(dbSchema.getUsrUsbiltyRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllDocFavorites', (req, res) => {
    mapper(dbSchema.getAllDocFavorites, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDashboardFormcd', (req, res) => {
    mapper(dbSchema.getDashboardFormcd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdtDschrgSumDet', (req, res) => {
    //console.log("InsUpdAdtDschrgSumDet1",req.body)
    mapper(dbSchema.InsUpdAdtDschrgSumDet, req.body, req.cParams).then((response) => {
        //console.log("InsUpdAdtDschrgSumDet2",response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTransferSummary', (req, res) => {
    mapper(dbSchema.getTransferSummary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormTypeM', (req, res) => {
    mapper(dbSchema.getFormTypeM, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotDet', (req, res) => {
    mapper(dbSchema.getSlotDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAuditInfo', (req, res) => {
    mapper(dbSchema.getAuditInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFileShareInfo', (req, res) => {
    mapper(dbSchema.getFileShareInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFileShareFav', (req, res) => {
    mapper(dbSchema.getFileShareFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBedVacancy', (req, res) => {
    mapper(dbSchema.getBedVacancy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getERAdmnDtls', (req, res) => {
    mapper(dbSchema.getERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAssaySpecColSrv', (req, res) => {
    mapper(dbSchema.getAssaySpecColSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInvsBillDet', (req, res) => {
    mapper(dbSchema.getInvsBillDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSurgChkList', (req, res) => {
    mapper(dbSchema.getSurgChkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPPeriOP1', (req, res) => {
    mapper(dbSchema.getIPPeriOP1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPPeriOP2', (req, res) => {
    mapper(dbSchema.getIPPeriOP2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBilledServices', (req, res) => {
    mapper(dbSchema.getBilledServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSrvcInvs', (req, res) => {
    mapper(dbSchema.getSrvcInvs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIndentMedications', (req, res) => {
    mapper(dbSchema.getIndentMedications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPBloodRequestDetails', (req, res) => {
    mapper(dbSchema.getIPBloodRequestDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPAntibiotic', (req, res) => {
    mapper(dbSchema.getIPAntibiotic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPHRDiagnosisDtls', (req, res) => {
    mapper(dbSchema.getPHRDiagnosisDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCareContiRep', (req, res) => {
    mapper(dbSchema.getCareContiRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCareContinnum', (req, res) => {
    mapper(dbSchema.getIpCareContinnum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDschrgsumRpt', (req, res) => {
    mapper(dbSchema.getDschrgsumRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDailyCollecRep', (req, res) => {
    mapper(dbSchema.getDailyCollecRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDschrgCaseSheetDet', (req, res) => {
    mapper(dbSchema.getDschrgCaseSheetDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBillServicesRep', (req, res) => {
    mapper(dbSchema.getBillServicesRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVWPatReGRepDet', (req, res) => {
    mapper(dbSchema.getVWPatReGRepDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTriageLevel', (req, res) => {
    mapper(dbSchema.getTriageLevel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAuditLogInfo', (req, res) => {
    mapper(dbSchema.getAuditLogInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetVisitDetcal', (req, res) => {
    mapper(dbSchema.GetVisitDetcal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ApptCntByType', (req, res) => {
    mapper(dbSchema.ApptCntByType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetVisitDet', (req, res) => {
    mapper(dbSchema.GetVisitDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDiscSum', (req, res) => {
    mapper(dbSchema.getPatDiscSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDiscSumDet', (req, res) => {
    mapper(dbSchema.getPatDiscSumDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInsurance', (req, res) => {
    mapper(dbSchema.InsUpdInsurance, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/pasInbound', (req, res) => {
    mapper(dbSchema.pasInbound, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsertDocSlots', (req, res) => {
    mapper(dbSchema.InsertDocSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/forgotPwd', (req, res) => {
    mapper(dbSchema.forgotPwd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdpatEnquary', (req, res) => {
    mapper(dbSchema.InsUpdpatEnquary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMulPkgBook', (req, res) => {
    mapper(dbSchema.InsUpdMulPkgBook, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpdspecSlotsByTime', (req, res) => {
    mapper(dbSchema.InUpdspecSlotsByTime, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/EmpPhoneExt', (req, res) => {
    mapper(dbSchema.EmpPhoneExt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdcorpPatientReg', (req, res) => {
    mapper(dbSchema.InsUpdcorpPatientReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCorpPatMap', (req, res) => {
    mapper(dbSchema.InsUpdCorpPatMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdintPatSrvcBook', (req, res) => {
    mapper(dbSchema.UpdintPatSrvcBook, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updSltCons', (req, res) => {
    mapper(dbSchema.updSltCons, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/SrvcExtn', (req, res) => {
    mapper(dbSchema.SrvcExtn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/aftConsDet', (req, res) => {
    mapper(dbSchema.aftConsDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PasBilling', (req, res) => {
    mapper(dbSchema.PasBilling, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PcPatientReg', (req, res) => {
    mapper(dbSchema.PcPatientReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PcPatientRel', (req, res) => {
    mapper(dbSchema.PcPatientRel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdForgetPwdPc', (req, res) => {
    mapper(dbSchema.UpdForgetPwdPc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdChangePwdPc', (req, res) => {
    mapper(dbSchema.UpdChangePwdPc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdImgages', (req, res) => {
    mapper(dbSchema.InsUpdImgages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chgSlotDoctor', (req, res) => {
    mapper(dbSchema.chgSlotDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PasServicePriceUpd', (req, res) => {
    mapper(dbSchema.PasServicePriceUpd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insErrorLog', (req, res) => {
    mapper(dbSchema.insErrorLog, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/delPcRel', (req, res) => {
    mapper(dbSchema.delPcRel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PasInBoundRvrsl', (req, res) => {
    mapper(dbSchema.PasInBoundRvrsl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PasTransRvrsl', (req, res) => {
    mapper(dbSchema.PasTransRvrsl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdpatEnquary', (req, res) => {
    mapper(dbSchema.UpdpatEnquary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdCampMstr', (req, res) => {
    mapper(dbSchema.InsupdCampMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdCampPat', (req, res) => {
    mapper(dbSchema.InsupdCampPat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdCampVtls', (req, res) => {
    mapper(dbSchema.InsupdCampVtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PasConfigSet', (req, res) => {
    mapper(dbSchema.PasConfigSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdConfigm', (req, res) => {
    mapper(dbSchema.UpdConfigm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/fbComplType', (req, res) => {
    mapper(dbSchema.fbComplType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdSltCncl', (req, res) => {
    mapper(dbSchema.UpdSltCncl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrgJson', (req, res) => {
    mapper(dbSchema.InsUpdOrgJson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatSickLeave', (req, res) => {
    mapper(dbSchema.InsUpdPatSickLeave, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdVisitPatPastHistory', (req, res) => {
    mapper(dbSchema.InsupdVisitPatPastHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCrtItems', (req, res) => {
    mapper(dbSchema.insUpdCrtItems, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdEntityMaster', (req, res) => {
    mapper(dbSchema.insUpdEntityMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updFbFormPrevAct', (req, res) => {
    mapper(dbSchema.updFbFormPrevAct, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsFbDocHelp', (req, res) => {
    mapper(dbSchema.InsFbDocHelp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelFbTemplate', (req, res) => {
    mapper(dbSchema.DelFbTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdGenExmntn', (req, res) => {
    mapper(dbSchema.InsUpdGenExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatFeeding', (req, res) => {
    mapper(dbSchema.InsUpdPatFeeding, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDoctorHolidays', (req, res) => {
    mapper(dbSchema.InsUpdDoctorHolidays, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupParmtrValue', (req, res) => {
    mapper(dbSchema.InsupParmtrValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdXrefTabByKey', (req, res) => {
    mapper(dbSchema.UpdXrefTabByKey, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdXrefOrgLoc', (req, res) => {
    mapper(dbSchema.insUpdXrefOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdResetPwd', (req, res) => {
    mapper(dbSchema.UpdResetPwd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdXrefOrgLoc', (req, res) => {
    mapper(dbSchema.UpdXrefOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdUserEmpDoc', (req, res) => {
    mapper(dbSchema.UpdUserEmpDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPageDetails', (req, res) => {
    mapper(dbSchema.InsUpdPageDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPrintClickFormHtml', (req, res) => {
    mapper(dbSchema.InsUpdPrintClickFormHtml, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdLockStatus', (req, res) => {
    mapper(dbSchema.UpdLockStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdQouteOfDay', (req, res) => {
    mapper(dbSchema.UpdQouteOfDay, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdreqOrgLocMap', (req, res) => {
    mapper(dbSchema.InsUpdreqOrgLocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRepo', (req, res) => {
    mapper(dbSchema.InsUpdRepo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdtDschrgFrmt', (req, res) => {
    mapper(dbSchema.InsUpdAdtDschrgFrmt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdtDschrgFrmtDet', (req, res) => {
    mapper(dbSchema.InsUpdAdtDschrgFrmtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdtDschrgSum', (req, res) => {
    mapper(dbSchema.InsUpdAdtDschrgSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEventMap', (req, res) => {
    mapper(dbSchema.InsUpdEventMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEvent', (req, res) => {
    mapper(dbSchema.InsUpdEvent, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdReportDef', (req, res) => {
    mapper(dbSchema.InsUpdReportDef, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdProfileSetup', (req, res) => {
    mapper(dbSchema.InsUpdProfileSetup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPhrDental', (req, res) => {
    mapper(dbSchema.InsUpdPhrDental, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatDocAccess', (req, res) => {
    mapper(dbSchema.InsUpdPatDocAccess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDocFavInvesti', (req, res) => {
    mapper(dbSchema.InsDocFavInvesti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDocMeidicatin', (req, res) => {
    mapper(dbSchema.InsDocMeidicatin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDocFavAllergy', (req, res) => {
    mapper(dbSchema.InsDocFavAllergy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupDocFavHealthCon', (req, res) => {
    mapper(dbSchema.InsupDocFavHealthCon, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InupDocFavComplants', (req, res) => {
    mapper(dbSchema.InupDocFavComplants, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDrugMaster', (req, res) => {
    mapper(dbSchema.InsUpdDrugMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupFrequencyMaster', (req, res) => {
    mapper(dbSchema.InsupFrequencyMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdServiceMaster', (req, res) => {
    mapper(dbSchema.InsupdServiceMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupUprSpecialInstruction', (req, res) => {
    //console.log("req.body",req.body);
    mapper(dbSchema.InsupUprSpecialInstruction, req.body, req.cParams).then((response) => {
        //console.log("InsupUprSpecialInstruction response",response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelDrugSrvMastr', (req, res) => {
    mapper(dbSchema.DelDrugSrvMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updxrefParentMig', (req, res) => {
    mapper(dbSchema.updxrefParentMig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdNtfctn', (req, res) => {
    mapper(dbSchema.InsupdNtfctn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIPaddr', (req, res) => {
    mapper(dbSchema.insUpdIPaddr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIPuserAdmn', (req, res) => {
    mapper(dbSchema.insUpdIPuserAdmn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Insupdcasesheetdet', (req, res) => {
    mapper(dbSchema.Insupdcasesheetdet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdPatientFeedback', (req, res) => {
    mapper(dbSchema.UpdPatientFeedback, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdPatientFeedbackTicket', (req, res) => {
    mapper(dbSchema.UpdPatientFeedbackTicket, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupDocFavCptPcsIcd', (req, res) => {
    mapper(dbSchema.InsupDocFavCptPcsIcd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSubInsulinChart', (req, res) => {
    mapper(dbSchema.InsUpdSubInsulinChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCriticalRprtDoc', (req, res) => {
    mapper(dbSchema.InsUpdCriticalRprtDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsOptholmologySurgery', (req, res) => {
    mapper(dbSchema.UprInsOptholmologySurgery, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdConsVisit', (req, res) => {
    mapper(dbSchema.InsUpdConsVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAssmntValue', (req, res) => {
    mapper(dbSchema.InsUpdAssmntValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdBloodCompTrans', (req, res) => {
    mapper(dbSchema.InsUpdBloodCompTrans, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNutriReAssesment', (req, res) => {
    mapper(dbSchema.InsUpdNutriReAssesment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCVSDocDet', (req, res) => {
    mapper(dbSchema.InsUpdCVSDocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdOTSugclSrvc', (req, res) => {
    mapper(dbSchema.insUpdOTSugclSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocProgNotes', (req, res) => {
    mapper(dbSchema.InsUpdDocProgNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIpErAsmnt', (req, res) => {
    mapper(dbSchema.InsUpdIpErAsmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpCathDetList', (req, res) => {
    mapper(dbSchema.getIpCathDetList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getStitemsStockInfo', (req, res) => {
    mapper(dbSchema.getStitemsStockInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAnalytics', (req, res) => {
    mapper(dbSchema.getAnalytics, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEmrUsgConslt', (req, res) => {
    mapper(dbSchema.getEmrUsgConslt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAnalyticsNew', (req, res) => {
    mapper(dbSchema.getAnalyticsNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClinicWrklod', (req, res) => {
    mapper(dbSchema.getClinicWrklod, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVcSlotDet', (req, res) => {
    mapper(dbSchema.getVcSlotDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTeleMedicn', (req, res) => {
    mapper(dbSchema.getTeleMedicn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotTranDet', (req, res) => {
    mapper(dbSchema.getSlotTranDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVendorDet', (req, res) => {
    mapper(dbSchema.getVendorDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIntgDetailsEmrPat', (req, res) => {
    mapper(dbSchema.getIntgDetailsEmrPat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocOlrSlotByDt', (req, res) => {
    mapper(dbSchema.GetDocOlrSlotByDt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInsUpdTmfsCb', (req, res) => {
    mapper(dbSchema.getInsUpdTmfsCb, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNrsInst', (req, res) => {
    mapper(dbSchema.getNrsInst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updateDiscSumRework', (req, res) => {
    mapper(dbSchema.updateDiscSumRework, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDiscSumVersion', (req, res) => {
    mapper(dbSchema.getDiscSumVersion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_User_Doc_Access_New', (req, res) => {
    mapper(dbSchema.Get_User_Doc_Access_New, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetVitalSignsNew', (req, res) => {
    mapper(dbSchema.GetVitalSignsNew, req.body, req.cParams).then((response) => {
        if (req.body.FLAG == "T") {
            let resp = viatlsTabFmt(response, "GetVitalSignsNew")
            return res.json(resp)
        }
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        //console.log("error", error)
        res.status(400).send(error);
    });
});

router.post('/GetCcWorkListPP', (req, res) => {
    mapper(dbSchema.GetCcWorkListPP, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMedicationNew', (req, res) => {
    mapper(dbSchema.GetMedicationNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatientECG', (req, res) => {
    mapper(dbSchema.GetPatientECG, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/GetEcgDataDetMob', (req, res) => {
    mapper(dbSchema.GetEcgDataDetMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatientEcgData', (req, res) => {
    //console.log("GetPatientEcgData----",req.body)
    mapper(dbSchema.GetPatientEcgData, req.body, req.cParams).then((response) => {
        //console.log("GetPatientEcgData----",response)
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEmrTeleMedicinUsage', (req, res) => {
    mapper(dbSchema.GetEmrTeleMedicinUsage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetTeleMedicineSearch', (req, res) => {
    mapper(dbSchema.GetTeleMedicineSearch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDschrgDetails', (req, res) => {
    mapper(dbSchema.GetDschrgDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInvsOrderNew', (req, res) => {
    mapper(dbSchema.GetInvsOrderNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatDiagnosisNew', (req, res) => {
    mapper(dbSchema.GetPatDiagnosisNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInvMedAll', (req, res) => {
    mapper(dbSchema.GetInvMedAll, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEvetsCriValu', (req, res) => {
    mapper(dbSchema.GetEvetsCriValu, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAdmnVisitFormDtls', (req, res) => {
    mapper(dbSchema.GetAdmnVisitFormDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEventStatus', (req, res) => {
    mapper(dbSchema.GetEventStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInsPatEcgData', (req, res) => {
    mapper(dbSchema.GetInsPatEcgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpDisposition', (req, res) => {
    mapper(dbSchema.GetIpDisposition, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLabparam', (req, res) => {
    mapper(dbSchema.GetLabparam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetProfileSetup', (req, res) => {
    mapper(dbSchema.GetProfileSetup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLabresultEntry', (req, res) => {
    mapper(dbSchema.GetLabresultEntry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBabyGenExamination', (req, res) => {
    mapper(dbSchema.GetBabyGenExamination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/clinicWiseApptDtls', (req, res) => {
    mapper(dbSchema.clinicWiseApptDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/icdDiagnosisDtls', (req, res) => {
    mapper(dbSchema.icdDiagnosisDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInsUpdSurSrvc', (req, res) => {
    mapper(dbSchema.GetInsUpdSurSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCsFormats', (req, res) => {
    mapper(dbSchema.GetCsFormats, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDeficiencyChecklist', (req, res) => {
    mapper(dbSchema.GetDeficiencyChecklist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDisSumReport', (req, res) => {
    mapper(dbSchema.GetDisSumReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocumentChkList', (req, res) => {
    mapper(dbSchema.GetDocumentChkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatAuto', (req, res) => {
    mapper(dbSchema.GetPatAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocByAdmnNo', (req, res) => {
    mapper(dbSchema.GetDocByAdmnNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAdminReqGrid', (req, res) => {
    mapper(dbSchema.GetAdminReqGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOPPatDet', (req, res) => {
    mapper(dbSchema.GetOPPatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/saveConsentForm', (req, res) => {
    mapper(dbSchema.saveConsentForm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetComMsgReqbyId', (req, res) => {
    mapper(dbSchema.GetComMsgReqbyId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/pasBillGrid', (req, res) => {
    mapper(dbSchema.pasBillGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/pasTranGrid', (req, res) => {
    mapper(dbSchema.pasTranGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSyncStatus', (req, res) => {
    mapper(dbSchema.GetSyncStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Getdocuserwise', (req, res) => {
    mapper(dbSchema.Getdocuserwise, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFrequency', (req, res) => {
    mapper(dbSchema.GetDocFrequency, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLoginDetGrid', (req, res) => {
    mapper(dbSchema.GetLoginDetGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllUserNames', (req, res) => {
    mapper(dbSchema.GetAllUserNames, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetConsultData', (req, res) => {
    mapper(dbSchema.GetConsultData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUserDocAccess', (req, res) => {
    mapper(dbSchema.getUserDocAccess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuppQury', (req, res) => {
    mapper(dbSchema.getSuppQury, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMostUsedDocfav', (req, res) => {
    mapper(dbSchema.getMostUsedDocfav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSMDepartment', (req, res) => {
    mapper(dbSchema.getSMDepartment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSMClientMstr', (req, res) => {
    mapper(dbSchema.getSMClientMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSMVisitReq', (req, res) => {
    mapper(dbSchema.getSMVisitReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCompanyMembers', (req, res) => {
    mapper(dbSchema.getCompanyMembers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClientMembers', (req, res) => {
    mapper(dbSchema.getClientMembers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVisitRequestLogin', (req, res) => {
    mapper(dbSchema.getVisitRequestLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSrvcDet', (req, res) => {
    mapper(dbSchema.getIpSrvcDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecommHandover', (req, res) => {
    mapper(dbSchema.GetRecommHandover, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCntValBsdonQst', (req, res) => {
    mapper(dbSchema.getCntValBsdonQst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQuesAgstCtrlValSet', (req, res) => {
    mapper(dbSchema.getQuesAgstCtrlValSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/FbGridData', (req, res) => {
    mapper(dbSchema.FbGridData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/FbActnData', (req, res) => {
    mapper(dbSchema.FbActnData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQsgQsPsScr', (req, res) => {
    mapper(dbSchema.getQsgQsPsScr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbDocHelp', (req, res) => {
    mapper(dbSchema.getFbDocHelp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getServiceClass', (req, res) => {
    mapper(dbSchema.getServiceClass, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getServiceGroup', (req, res) => {
    mapper(dbSchema.getServiceGroup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorNew', (req, res) => {
    mapper(dbSchema.getDoctorNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEvents', (req, res) => {
    mapper(dbSchema.getEvents, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChkEvntDetails', (req, res) => {
    mapper(dbSchema.getChkEvntDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConsAdvRep', (req, res) => {
    mapper(dbSchema.getConsAdvRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntityMast', (req, res) => {
    mapper(dbSchema.getEntityMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntityTypeMast', (req, res) => {
    mapper(dbSchema.getEntityTypeMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DocHol', (req, res) => {
    mapper(dbSchema.DocHol, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCmpnyPlcies', (req, res) => {
    mapper(dbSchema.GetCmpnyPlcies, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatDoc', (req, res) => {
    mapper(dbSchema.GetPatDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPhrDiagnosis', (req, res) => {
    mapper(dbSchema.GetPhrDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPhrInvsOrdPkg', (req, res) => {
    mapper(dbSchema.GetPhrInvsOrdPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetVitalSignsPkg', (req, res) => {
    mapper(dbSchema.GetVitalSignsPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPrintClkFrmHtml', (req, res) => {
    mapper(dbSchema.GetPrintClkFrmHtml, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUpdResetPwd', (req, res) => {
    mapper(dbSchema.GetUpdResetPwd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSlotsById', (req, res) => {
    mapper(dbSchema.GetPatSlotsById, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPageDetails', (req, res) => {
    mapper(dbSchema.GetPageDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUserSession', (req, res) => {
    mapper(dbSchema.InsUserSession, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsByScreen', (req, res) => {
    mapper(dbSchema.getRsByScreen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMaByScreen', (req, res) => {
    mapper(dbSchema.getMaByScreen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVdByScreen', (req, res) => {

    mapper(dbSchema.getVdByScreen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getReports', (req, res) => {
    mapper(dbSchema.getReports, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDisFrmt', (req, res) => {
    mapper(dbSchema.getDisFrmt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDisFrmtDet', (req, res) => {
    mapper(dbSchema.getDisFrmtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDisSum', (req, res) => {
    mapper(dbSchema.getDisSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDisSumDet', (req, res) => {
    mapper(dbSchema.getDisSumDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetReportDefination', (req, res) => {
    mapper(dbSchema.GetReportDefination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/SaveReportDefination', (req, res) => {
    mapper(dbSchema.SaveReportDefination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDental', (req, res) => {
    mapper(dbSchema.GetDental, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpMultiAttnds', (req, res) => {
    mapper(dbSchema.GetIpMultiAttnds, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpProfileSetDet', (req, res) => {
    mapper(dbSchema.GetIpProfileSetDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpProfileset', (req, res) => {
    mapper(dbSchema.GetIpProfileset, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQmsRep', (req, res) => {
    mapper(dbSchema.getQmsRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/patientTAT', (req, res) => {
    mapper(dbSchema.patientTAT, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/MonCntSample', (req, res) => {
    mapper(dbSchema.MonCntSample, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/callDumpRep', (req, res) => {
    mapper(dbSchema.callDumpRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/referalReport', (req, res) => {
    mapper(dbSchema.referalReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/docAdviceRep', (req, res) => {
    mapper(dbSchema.docAdviceRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/actOverallRpt', (req, res) => {
    mapper(dbSchema.actOverallRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/apptStatRepNew', (req, res) => {
    mapper(dbSchema.apptStatRepNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/OPDWaitRpt', (req, res) => {
    mapper(dbSchema.OPDWaitRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPaDocLocSlotDetnew1', (req, res) => {
    mapper(dbSchema.getPaDocLocSlotDetnew1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getParentMigration', (req, res) => {
    mapper(dbSchema.getParentMigration, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocMig', (req, res) => {
    mapper(dbSchema.getLocMig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCaseShetDet', (req, res) => {
    mapper(dbSchema.GetCaseShetDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQueryBuilder', (req, res) => {
    mapper(dbSchema.getQueryBuilder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbFormMast', (req, res) => {
    mapper(dbSchema.getFbFormMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbDeptMast', (req, res) => {
    mapper(dbSchema.getFbDeptMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFeedbakTkt', (req, res) => {
    mapper(dbSchema.getPatFeedbakTkt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFeedbak', (req, res) => {
    mapper(dbSchema.getPatFeedbak, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFeedbakDtls', (req, res) => {
    mapper(dbSchema.getPatFeedbakDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpAddr', (req, res) => {
    mapper(dbSchema.GetIpAddr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocAdendum', (req, res) => {
    mapper(dbSchema.GetDocAdendum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCCareChrtDet', (req, res) => {
    mapper(dbSchema.GetCCareChrtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetHrsMastr', (req, res) => {
    mapper(dbSchema.GetHrsMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAutoComplete', (req, res) => {
    mapper(dbSchema.GetAutoComplete, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInvest', (req, res) => {
    mapper(dbSchema.getInvest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMedication', (req, res) => {
    mapper(dbSchema.getMedication, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRecom', (req, res) => {
    mapper(dbSchema.getRecom, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllergy', (req, res) => {
    mapper(dbSchema.getAllergy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClinical', (req, res) => {
    mapper(dbSchema.getClinical, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConditions', (req, res) => {
    mapper(dbSchema.getConditions, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDiagnosis', (req, res) => {
    mapper(dbSchema.getDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComplaints', (req, res) => {
    if (!("getComplaints" === req.cParams.URL)) {
        req.cParams.URL = "getComplaints";
        req.body = generateParams(req.body, req.cParams);
    }
    mapper(dbSchema.getComplaints, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotfications', (req, res) => {
    mapper(dbSchema.GetNotfications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotficationCount', (req, res) => {
    mapper(dbSchema.GetNotficationCount, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEvntsByLocOrg', (req, res) => {
    mapper(dbSchema.GetEvntsByLocOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllSlotType', (req, res) => {
    mapper(dbSchema.GetAllSlotType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QuestionTpl', (req, res) => {
    mapper(dbSchema.QuestionTpl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetGroups', (req, res) => {
    mapper(dbSchema.GetGroups, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Question', (req, res) => {
    mapper(dbSchema.Question, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QuestionTemplate', (req, res) => {
    mapper(dbSchema.QuestionTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QuestionTemplateGrid', (req, res) => {
    mapper(dbSchema.QuestionTemplateGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatQnsTplMap', (req, res) => {
    mapper(dbSchema.PatQnsTplMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QnsTplMap', (req, res) => {
    mapper(dbSchema.QnsTplMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QuestionControls', (req, res) => {
    mapper(dbSchema.QuestionControls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/TempFormat', (req, res) => {
    mapper(dbSchema.TempFormat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/TempFormatDet', (req, res) => {
    mapper(dbSchema.TempFormatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Indentservices', (req, res) => {
    mapper(dbSchema.Indentservices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DocOpReferrals', (req, res) => {
    mapper(dbSchema.DocOpReferrals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDoctorOPReferals', (req, res) => {
    mapper(dbSchema.InsDoctorOPReferals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/patFmtSmry', (req, res) => {
    mapper(dbSchema.patFmtSmry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GridConfig', (req, res) => {
    mapper(dbSchema.GridConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/LkUpConfig', (req, res) => {
    mapper(dbSchema.LkUpConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatDoc', (req, res) => {
    mapper(dbSchema.PatDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/patMrnRepDet', (req, res) => {
    mapper(dbSchema.patMrnRepDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/packageSer', (req, res) => {
    mapper(dbSchema.packageSer, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/internalData', (req, res) => {
    mapper(dbSchema.internalData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/countries', (req, res) => {
    mapper(dbSchema.countries, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AllSpecializations', (req, res) => {
    mapper(dbSchema.AllSpecializations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/RsrcAvailabilty', (req, res) => {
    mapper(dbSchema.RsrcAvailabilty, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPrvsVisits', (req, res) => {
    mapper(dbSchema.getPrvsVisits, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocLocSchStat', (req, res) => {
    mapper(dbSchema.getDocLocSchStat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/dayWiseCount', (req, res) => {
    mapper(dbSchema.dayWiseCount, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/prmByScrn', (req, res) => {
    mapper(dbSchema.prmByScrn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/admnReqCheck', (req, res) => {
    mapper(dbSchema.admnReqCheck, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkValidations', (req, res) => {
    mapper(dbSchema.chkValidations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/orgGridAD', (req, res) => {
    mapper(dbSchema.orgGridAD, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/locGridAD', (req, res) => {
    mapper(dbSchema.locGridAD, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/docGridAD', (req, res) => {
    mapper(dbSchema.docGridAD, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/empGridAD', (req, res) => {
    mapper(dbSchema.empGridAD, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/referelsCount', (req, res) => {
    mapper(dbSchema.referelsCount, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTitle', (req, res) => {
    mapper(dbSchema.getTitle, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllSpeciality', (req, res) => {
    mapper(dbSchema.getAllSpeciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecSpecia', (req, res) => {
    mapper(dbSchema.getSpecSpecia, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcAvlblTyp', (req, res) => {
    mapper(dbSchema.getRsrcAvlblTyp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmissionsGrid', (req, res) => {
    mapper(dbSchema.getAdmissionsGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChkOlrApmnt', (req, res) => {
    mapper(dbSchema.getChkOlrApmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChkOlrNxtSch', (req, res) => {
    mapper(dbSchema.getChkOlrNxtSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComMsgOrgLocType', (req, res) => {
    mapper(dbSchema.getComMsgOrgLocType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpeOrgLoc', (req, res) => {
    mapper(dbSchema.GetSpeOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComMsgTypeTpl', (req, res) => {
    mapper(dbSchema.getComMsgTypeTpl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getShowAsses', (req, res) => {
    mapper(dbSchema.getShowAsses, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDetSlot', (req, res) => {
    mapper(dbSchema.getPatDetSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getImages', (req, res) => {
    mapper(dbSchema.getImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTokenData', (req, res) => {
    mapper(dbSchema.getTokenData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTokenData_New', (req, res) => {
    mapper(dbSchema.getTokenData_New, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocSetting', (req, res) => {
    mapper(dbSchema.getDocSetting, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocSpecialities', (req, res) => {
    mapper(dbSchema.getDocSpecialities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQmsTv', (req, res) => {
    mapper(dbSchema.getQmsTv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocLocWlLmt', (req, res) => {
    mapper(dbSchema.getDocLocWlLmt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdAdmnDrschReqAprove', (req, res) => {
    mapper(dbSchema.UprUpdAdmnDrschReqAprove, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdMewsScore', (req, res) => {
    mapper(dbSchema.UprUpdMewsScore, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdDocDet', (req, res) => {
    mapper(dbSchema.UprUpdDocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIpDispositin', (req, res) => {
    mapper(dbSchema.InsUpdIpDispositin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdLabparam', (req, res) => {
    mapper(dbSchema.UprInsupdLabparam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdBabyGenExamination', (req, res) => {
    mapper(dbSchema.UprInsupdBabyGenExamination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdProfilesetup', (req, res) => {
    mapper(dbSchema.UprInsupdProfilesetup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdLabparam', (req, res) => {
    mapper(dbSchema.UprUpdLabparam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdLabresultentryXML', (req, res) => {
    mapper(dbSchema.InsUpdLabresultentryXML, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatBirthHistory', (req, res) => {
    mapper(dbSchema.InsUpdPatBirthHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdCsFormats', (req, res) => {
    mapper(dbSchema.UprInsupdCsFormats, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdCsDeficiencyChecklist', (req, res) => {
    mapper(dbSchema.UprInsupdCsDeficiencyChecklist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdRecommHandover', (req, res) => {
    mapper(dbSchema.InsupdRecommHandover, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUserDocMap', (req, res) => {
    mapper(dbSchema.insUserDocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSMClientMstr', (req, res) => {
    mapper(dbSchema.InsUpdSMClientMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSMDeprmnt', (req, res) => {
    mapper(dbSchema.InsUpdSMDeprmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSMVisitReq', (req, res) => {
    mapper(dbSchema.InsUpdSMVisitReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdCompanyMembers', (req, res) => {
    mapper(dbSchema.UprInsupdCompanyMembers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdClientMembers', (req, res) => {
    mapper(dbSchema.UprInsupdClientMembers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdNutriAsmntPedi16', (req, res) => {
    mapper(dbSchema.UprInsupdNutriAsmntPedi16, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdLocationPoint', (req, res) => {
    mapper(dbSchema.uprInsupdLocationPoint, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdClinicalPathwayParameters', (req, res) => {
    mapper(dbSchema.UprInsupdClinicalPathwayParameters, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdCpTranInfo', (req, res) => {
    mapper(dbSchema.uprInsupdCpTranInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdProfileType', (req, res) => {
    mapper(dbSchema.UprInsupdProfileType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdDocFavorites', (req, res) => {
    mapper(dbSchema.UprInsupdDocFavorites, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdTransferSummary', (req, res) => {
    mapper(dbSchema.UprInsupdTransferSummary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdRrtEvtRecord', (req, res) => {
    mapper(dbSchema.UprInsupdRrtEvtRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprDelReferenceTypeRecordNew', (req, res) => {
    mapper(dbSchema.UprDelReferenceTypeRecordNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdHicBiomedicalWateMang', (req, res) => {
    mapper(dbSchema.UprInsupdHicBiomedicalWateMang, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdAldScoSys', (req, res) => {
    mapper(dbSchema.UprInsupdAldScoSys, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpCathProcedure', (req, res) => {
    mapper(dbSchema.UprInsupdIpCathProcedure, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpPreOpAnesthesia', (req, res) => {
    mapper(dbSchema.UprInsupdIpPreOpAnesthesia, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpBloodRequest', (req, res) => {
    mapper(dbSchema.UprInsupdIpBloodRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpCathDetList', (req, res) => {
    mapper(dbSchema.UprInsupdIpCathDetList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpPreCath', (req, res) => {
    mapper(dbSchema.UprInsupdIpPreCath, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdSiteVerifyTimeoutDoc', (req, res) => {
    mapper(dbSchema.UprInsupdSiteVerifyTimeoutDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpPreOpNurCheckList', (req, res) => {
    mapper(dbSchema.UprInsupdIpPreOpNurCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdStopMedication', (req, res) => {
    mapper(dbSchema.UpdStopMedication, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpCathLabCheckList', (req, res) => {
    mapper(dbSchema.UprInsupdIpCathLabCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatAntnalExmntn', (req, res) => {
    mapper(dbSchema.InsUpdPatAntnalExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatsemenHistory', (req, res) => {
    mapper(dbSchema.InsupdPatsemenHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatEggRetrieval', (req, res) => {
    mapper(dbSchema.InsupdPatEggRetrieval, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdpatFertilization', (req, res) => {
    mapper(dbSchema.InsupdpatFertilization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdpatInsemination', (req, res) => {
    mapper(dbSchema.InsupdpatInsemination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Insupdpaticsi', (req, res) => {
    mapper(dbSchema.Insupdpaticsi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdpatOverianStimulation', (req, res) => {
    mapper(dbSchema.InsupdpatOverianStimulation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdpatEmbryologyTransfer', (req, res) => {
    mapper(dbSchema.InsupdpatEmbryologyTransfer, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/UpdDocUnits', (req, res) => {
    mapper(dbSchema.UpdDocUnits, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsFrmDocUnitToToDocunit', (req, res) => {
    mapper(dbSchema.InsFrmDocUnitToToDocunit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InscusFeedBack', (req, res) => {
    mapper(dbSchema.InscusFeedBack, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsFrmRsrcToToRsrs', (req, res) => {
    mapper(dbSchema.InsFrmRsrcToToRsrs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatSysExe', (req, res) => {
    mapper(dbSchema.InsUpdPatSysExe, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDoctorNew', (req, res) => {
    mapper(dbSchema.InsUpdDoctorNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIpProcRecrd', (req, res) => {
    mapper(dbSchema.InsUpdIpProcRecrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdmsnRecrd', (req, res) => {
    mapper(dbSchema.InsUpdAdmsnRecrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInvsOrdr', (req, res) => {
    mapper(dbSchema.InsUpdInvsOrdr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdsrvc', (req, res) => {
    mapper(dbSchema.InsUpdsrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/fbCntrlVal', (req, res) => {
    mapper(dbSchema.fbCntrlVal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatGroupFormRslts', (req, res) => {
    mapper(dbSchema.InsupdPatGroupFormRslts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFeedbackFormControl', (req, res) => {
    mapper(dbSchema.InsupdFeedbackFormControl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFbControl', (req, res) => {
    mapper(dbSchema.InsupdFbControl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFbControlValueSet', (req, res) => {
    mapper(dbSchema.InsupdFbControlValueSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFbTmplteQGrp', (req, res) => {
    mapper(dbSchema.InsupdFbTmplteQGrp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFbQuestionScore', (req, res) => {
    mapper(dbSchema.InsupdFbQuestionScore, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDelFbCtrlValSet', (req, res) => {
    mapper(dbSchema.InsupdDelFbCtrlValSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDelFbQuestion', (req, res) => {
    mapper(dbSchema.InsupdDelFbQuestion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdQuestionGroup', (req, res) => {
    mapper(dbSchema.InsupdQuestionGroup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAdendum', (req, res) => {
    mapper(dbSchema.InsupdAdendum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdTeleMedicine', (req, res) => {
    mapper(dbSchema.InsupdTeleMedicine, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCriticlCareChrtDet', (req, res) => {
    mapper(dbSchema.InsUpdCriticlCareChrtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPhysioReAssmntDet', (req, res) => {
    mapper(dbSchema.InsUpdPhysioReAssmntDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdVisitNotes', (req, res) => {
    mapper(dbSchema.InsUpdVisitNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFRAPSNCP', (req, res) => {
    mapper(dbSchema.InsUpdFRAPSNCP, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdVerbalOrdDoc', (req, res) => {
    mapper(dbSchema.InsUpdVerbalOrdDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPhysioReAssmnt', (req, res) => {
    mapper(dbSchema.InsUpdPhysioReAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRestraintOrder', (req, res) => {
    mapper(dbSchema.InsUpdRestraintOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCVSDocument', (req, res) => {
    mapper(dbSchema.InsUpdCVSDocument, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPhysio', (req, res) => {
    mapper(dbSchema.InsUpdPhysio, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/cmpCnsldRep', (req, res) => {
    mapper(dbSchema.cmpCnsldRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCheckApmntDet', (req, res) => {
    mapper(dbSchema.getCheckApmntDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAppRelease', (req, res) => {
    mapper(dbSchema.getAppRelease, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgLocArea', (req, res) => {
    mapper(dbSchema.getOrgLocArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPackageFamily', (req, res) => {
    mapper(dbSchema.getPackageFamily, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorFmtDet', (req, res) => {
    mapper(dbSchema.getDoctorFmtDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPrintForms', (req, res) => {
    mapper(dbSchema.getPrintForms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorTvDisplay', (req, res) => {
    mapper(dbSchema.getDoctorTvDisplay, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AuthUser', (req, res) => {
    mapper(dbSchema.AuthUser, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/emrUsgData', (req, res) => {
    mapper(dbSchema.emrUsgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getManTurnupSlts', (req, res) => {
    mapper(dbSchema.getManTurnupSlts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTmplForm', (req, res) => {
    mapper(dbSchema.getTmplForm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcDoc', (req, res) => {
    mapper(dbSchema.getCcDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPog', (req, res) => {
    mapper(dbSchema.getPog, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFamCond', (req, res) => {
    mapper(dbSchema.getFamCond, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEmrUsgCons', (req, res) => {
    mapper(dbSchema.getEmrUsgCons, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAmbulance', (req, res) => {
    mapper(dbSchema.getAmbulance, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatApmntStatByRef', (req, res) => {
    mapper(dbSchema.getPatApmntStatByRef, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTmplFormFldValUsr', (req, res) => {
    mapper(dbSchema.getTmplFormFldValUsr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntity', (req, res) => {
    mapper(dbSchema.getEntity, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFedOrQuery', (req, res) => {
    mapper(dbSchema.getFedOrQuery, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/usersearch', (req, res) => {
    mapper(dbSchema.usersearch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTmpFrmGrid', (req, res) => {
    mapper(dbSchema.getTmpFrmGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOTP', (req, res) => {
    mapper(dbSchema.getOTP, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPrntFrmUsrData', (req, res) => {
    mapper(dbSchema.getPrntFrmUsrData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCheckApmntHltChk', (req, res) => {
    mapper(dbSchema.getCheckApmntHltChk, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCnsntPatDet', (req, res) => {
    mapper(dbSchema.getCnsntPatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuvEmployee', (req, res) => {
    mapper(dbSchema.getSuvEmployee, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuvClient', (req, res) => {
    mapper(dbSchema.getSuvClient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuvClientSubject', (req, res) => {
    mapper(dbSchema.getSuvClientSubject, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuvClientVisit', (req, res) => {
    mapper(dbSchema.getSuvClientVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuvReportingLevel', (req, res) => {
    mapper(dbSchema.getSuvReportingLevel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcWrkList', (req, res) => {
    mapper(dbSchema.getCcWrkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcWrkListData', (req, res) => {
    mapper(dbSchema.getCcWrkListData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFedback', (req, res) => {
    mapper(dbSchema.getFedback, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcFeedbackById', (req, res) => {
    mapper(dbSchema.getCcFeedbackById, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcFeedbackByPatEnqId', (req, res) => {
    mapper(dbSchema.getCcFeedbackByPatEnqId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMsgNotcation', (req, res) => {
    mapper(dbSchema.getMsgNotcation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgSrvcs', (req, res) => {
    mapper(dbSchema.getOrgSrvcs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmission', (req, res) => {
    mapper(dbSchema.getAdmission, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVdmaster', (req, res) => {
    mapper(dbSchema.getVdmaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVdmstrOrgLoc', (req, res) => {
    mapper(dbSchema.getVdmstrOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSrvcSyn', (req, res) => {
    mapper(dbSchema.getSrvcSyn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNewItemReq', (req, res) => {
    mapper(dbSchema.getNewItemReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRos', (req, res) => {
    mapper(dbSchema.getRos, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocation', (req, res) => {
    mapper(dbSchema.getLocation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAddress', (req, res) => {
    mapper(dbSchema.getAddress, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAutocompelte', (req, res) => {
    mapper(dbSchema.getAutocompelte, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcAvl', (req, res) => {
    mapper(dbSchema.getRsrcAvl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMedicationsMasterAuto', (req, res) => {
    mapper(dbSchema.getMedicationsMasterAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDropDownData', (req, res) => {
    mapper(dbSchema.getDropDownData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAlerAuto', (req, res) => {
    mapper(dbSchema.getAlerAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAccreditation', (req, res) => {
    mapper(dbSchema.getAccreditation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrganizations', (req, res) => {
    mapper(dbSchema.getOrganizations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgAbt', (req, res) => {
    mapper(dbSchema.getOrgAbt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAwards', (req, res) => {
    mapper(dbSchema.getAwards, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQualifications', (req, res) => {
    mapper(dbSchema.getQualifications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorContent', (req, res) => {
    mapper(dbSchema.getDoctorContent, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecRsrcSrvMap', (req, res) => {
    mapper(dbSchema.getSpecRsrcSrvMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getWorkExperience', (req, res) => {
    mapper(dbSchema.getWorkExperience, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorsByOrg', (req, res) => {
    mapper(dbSchema.getDoctorsByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctor', (req, res) => {
    mapper(dbSchema.getDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInsRsrcReg', (req, res) => {
    mapper(dbSchema.getInsRsrcReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecializations', (req, res) => {
    mapper(dbSchema.getSpecializations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcLanguages', (req, res) => {
    mapper(dbSchema.getRsrcLanguages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getServGroups', (req, res) => {
    mapper(dbSchema.getServGroups, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getGroupServices', (req, res) => {
    mapper(dbSchema.getGroupServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/EmpGrid', (req, res) => {
    mapper(dbSchema.EmpGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDesignation', (req, res) => {
    mapper(dbSchema.getDesignation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UserGrid', (req, res) => {
    mapper(dbSchema.UserGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DocGrid', (req, res) => {
    mapper(dbSchema.DocGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcNots', (req, res) => {
    mapper(dbSchema.getRsrcNots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormType', (req, res) => {
    mapper(dbSchema.getFormType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInOutChart', (req, res) => {
    mapper(dbSchema.getInOutChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursInitAssmnt', (req, res) => {
    mapper(dbSchema.getNursInitAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCaseSheet', (req, res) => {
    mapper(dbSchema.getCaseSheet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursCarPln', (req, res) => {
    mapper(dbSchema.getNursCarPln, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursCarPlnDet', (req, res) => {
    mapper(dbSchema.getNursCarPlnDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpItemMstr', (req, res) => {
    mapper(dbSchema.getIpItemMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpDocInitAssess', (req, res) => {
    mapper(dbSchema.getIpDocInitAssess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMultiVdTextData', (req, res) => {
    mapper(dbSchema.getMultiVdTextData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMultiVdLoopData', (req, res) => {
    mapper(dbSchema.getMultiVdLoopData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpProcedureRecord', (req, res) => {
    mapper(dbSchema.getIpProcedureRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNursHandDocmnt', (req, res) => {
    mapper(dbSchema.getNursHandDocmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllWards', (req, res) => {
    mapper(dbSchema.getAllWards, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpSrchProc', (req, res) => {
    mapper(dbSchema.getIpSrchProc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpEmployee', (req, res) => {
    mapper(dbSchema.getIpEmployee, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVisitFormsDtls', (req, res) => {
    mapper(dbSchema.getVisitFormsDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUsrOrgLoc', (req, res) => {
    mapper(dbSchema.getUsrOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUsrOrgLocNew', (req, res) => {
    mapper(dbSchema.getUsrOrgLocNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDocAccess', (req, res) => {
    mapper(dbSchema.getPatDocAccess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPlanOfCare', (req, res) => {
    mapper(dbSchema.getPlanOfCare, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAnastheTechniq', (req, res) => {
    mapper(dbSchema.getAnastheTechniq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPostAnasthaCreRecrd', (req, res) => {
    mapper(dbSchema.getPostAnasthaCreRecrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatBirthHis', (req, res) => {
    mapper(dbSchema.GetPatBirthHis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatAntenatalExmntn', (req, res) => {
    mapper(dbSchema.GetPatAntenatalExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatsemenHistory', (req, res) => {
    mapper(dbSchema.getPatsemenHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatEggRetrieval', (req, res) => {
    mapper(dbSchema.getPatEggRetrieval, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFertilization', (req, res) => {
    mapper(dbSchema.getPatFertilization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatInsemination', (req, res) => {
    mapper(dbSchema.getPatInsemination, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatOverianStimulation', (req, res) => {
    mapper(dbSchema.getpatOverianStimulation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatEmbryologyTransfer', (req, res) => {
    mapper(dbSchema.getpatEmbryologyTransfer, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVitalsValid', (req, res) => {
    mapper(dbSchema.getVitalsValid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSysExam', (req, res) => {
    mapper(dbSchema.getPatSysExam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRestraintOrder', (req, res) => {
    mapper(dbSchema.getRestraintOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPheriAccess', (req, res) => {
    mapper(dbSchema.getPheriAccess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPheriAccDocDet', (req, res) => {
    mapper(dbSchema.getPheriAccDocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPhyReAssesment', (req, res) => {
    mapper(dbSchema.getPhyReAssesment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCVADoc', (req, res) => {
    mapper(dbSchema.getCVADoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCVADocDet', (req, res) => {
    mapper(dbSchema.getCVADocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFlag', (req, res) => {
    mapper(dbSchema.getPatFlag, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getGenrlExmntn', (req, res) => {
    mapper(dbSchema.getGenrlExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFeeding', (req, res) => {
    mapper(dbSchema.getPatFeeding, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOptMologySurg', (req, res) => {
    mapper(dbSchema.GetOptMologySurg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIPcaseSheet', (req, res) => {
    mapper(dbSchema.GetIPcaseSheet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAdmnConsults', (req, res) => {
    mapper(dbSchema.GetAdmnConsults, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpDocHndOvr', (req, res) => {
    mapper(dbSchema.getIpDocHndOvr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatFamilyEducation', (req, res) => {
    mapper(dbSchema.GetPatFamilyEducation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgLocRsrcMap', (req, res) => {
    mapper(dbSchema.getOrgLocRsrcMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLanguage', (req, res) => {
    mapper(dbSchema.getLanguage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAsistant', (req, res) => {
    mapper(dbSchema.getAsistant, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLoc_ByOrg', (req, res) => {
    mapper(dbSchema.getLoc_ByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getScrollData', (req, res) => {
    mapper(dbSchema.getScrollData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Getroles', (req, res) => {
    mapper(dbSchema.Getroles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRefType', (req, res) => {
    mapper(dbSchema.GetRefType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetModules', (req, res) => {
    mapper(dbSchema.GetModules, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocType', (req, res) => {
    mapper(dbSchema.GetDocType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetWkOrgSpclDocSlots', (req, res) => {
    mapper(dbSchema.GetWkOrgSpclDocSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DocumentGrid', (req, res) => {
    mapper(dbSchema.DocumentGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/RoleGrid', (req, res) => {
    mapper(dbSchema.RoleGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMappedDocs', (req, res) => {
    mapper(dbSchema.GetMappedDocs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_Role_Doc_Access', (req, res) => {
    mapper(dbSchema.Get_Role_Doc_Access, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocument', (req, res) => {
    mapper(dbSchema.GetDocument, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUserdtls', (req, res) => {
    mapper(dbSchema.GetUserdtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAsstNew', (req, res) => {
    mapper(dbSchema.GetAsstNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAssistantDoctorMap', (req, res) => {
    mapper(dbSchema.getAssistantDoctorMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgLocRsrc', (req, res) => {
    mapper(dbSchema.getOrgLocRsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAstMultiLoc', (req, res) => {
    mapper(dbSchema.getAstMultiLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMembership', (req, res) => {
    mapper(dbSchema.getMembership, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocGrid', (req, res) => {
    mapper(dbSchema.getLocGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgGrid', (req, res) => {
    mapper(dbSchema.getOrgGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllSpecialization', (req, res) => {
    mapper(dbSchema.getAllSpecialization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllQualification', (req, res) => {
    //console.log("vikram-1",req.body)
    mapper(dbSchema.getAllQualification, req.body, req.cParams).then((response) => {
        //console.log("vikram-2",response)
        res.json(response);
    }).catch((error) => {
        // console.log("error",error)
        res.status(400).send(error);
    });
});

router.post('/getRegistration', (req, res) => {
    mapper(dbSchema.getRegistration, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getServiceSpec', (req, res) => {
    mapper(dbSchema.getServiceSpec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllSlots', (req, res) => {
    mapper(dbSchema.getAllSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcImages', (req, res) => {
    mapper(dbSchema.getRsrcImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllDoctors', (req, res) => {
    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocFmtDetails', (req, res) => {
    mapper(dbSchema.getDocFmtDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecialMapData', (req, res) => {
    mapper(dbSchema.getSpecialMapData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPeriodMapData', (req, res) => {
    mapper(dbSchema.getPeriodMapData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPeriodMaster', (req, res) => {
    mapper(dbSchema.getPeriodMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInstGdlsData', (req, res) => {
    mapper(dbSchema.getInstGdlsData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAppTrackData', (req, res) => {
    mapper(dbSchema.getAppTrackData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAppTrackDataAction', (req, res) => {
    mapper(dbSchema.getAppTrackDataAction, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatPeriod', (req, res) => {
    mapper(dbSchema.getPatPeriod, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocUnits', (req, res) => {
    mapper(dbSchema.getDocUnits, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocUnitsMap', (req, res) => {
    mapper(dbSchema.getDocUnitsMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPaOrg', (req, res) => {
    mapper(dbSchema.GetPaOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpaticsi', (req, res) => {
    mapper(dbSchema.getpaticsi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updPasTranStat', (req, res) => {
    mapper(dbSchema.updPasTranStat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getWkOrgSpclDoc', (req, res) => {
    mapper(dbSchema.getWkOrgSpclDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmRecord', (req, res) => {
    mapper(dbSchema.getAdmRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMediMastrGrd', (req, res) => {
    mapper(dbSchema.getMediMastrGrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSrvcGrid', (req, res) => {
    mapper(dbSchema.getSrvcGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getProfiles', (req, res) => {
    mapper(dbSchema.getProfiles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getProfComp', (req, res) => {
    mapper(dbSchema.getProfComp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTmpQsDtls', (req, res) => {
    mapper(dbSchema.getTmpQsDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbMastData', (req, res) => {
    mapper(dbSchema.getFbMastData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatientData', (req, res) => {
    mapper(dbSchema.getPatientData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbFormData', (req, res) => {
    mapper(dbSchema.getFbFormData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbControl', (req, res) => {
    mapper(dbSchema.getFbControl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbCntrlVal', (req, res) => {
    mapper(dbSchema.getFbCntrlVal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbCntrlValSet', (req, res) => {
    mapper(dbSchema.getFbCntrlValSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbTemplte', (req, res) => {
    mapper(dbSchema.getFbTemplte, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbTmpltQues', (req, res) => {
    mapper(dbSchema.getFbTmpltQues, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbTmpltQuesGrp', (req, res) => {
    mapper(dbSchema.getFbTmpltQuesGrp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbQuestion', (req, res) => {
    mapper(dbSchema.getFbQuestion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbQuestionScore', (req, res) => {
    mapper(dbSchema.getFbQuestionScore, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTempDashBord', (req, res) => {
    mapper(dbSchema.getTempDashBord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMedicBilldInfo', (req, res) => {
    mapper(dbSchema.GetMedicBilldInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocStatusByOlr', (req, res) => {
    mapper(dbSchema.getDocStatusByOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocStatusMul', (req, res) => {
    mapper(dbSchema.getDocStatusMul, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/patSmsEmail', (req, res) => {
    mapper(dbSchema.patSmsEmail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdChgSchTime', (req, res) => {
    mapper(dbSchema.UpdChgSchTime, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocEMFav', (req, res) => {
    mapper(dbSchema.InsUpdDocEMFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEntJson', (req, res) => {
    mapper(dbSchema.InsUpdEntJson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdChgJsonPwd', (req, res) => {
    mapper(dbSchema.InsUpdChgJsonPwd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCorpBillGen', (req, res) => {
    mapper(dbSchema.InsUpdCorpBillGen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/SlotsAdd', (req, res) => {
    mapper(dbSchema.SlotsAdd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdGusetUsr', (req, res) => {
    mapper(dbSchema.insUpdGusetUsr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/cbPatEnq', (req, res) => {
    mapper(dbSchema.cbPatEnq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/srvcAddInfo', (req, res) => {
    mapper(dbSchema.srvcAddInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatSms', (req, res) => {
    mapper(dbSchema.InsUpdPatSms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPc', (req, res) => {
    mapper(dbSchema.InsUpdPc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMstr', (req, res) => {
    mapper(dbSchema.InsUpdMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatDocDet', (req, res) => {
    mapper(dbSchema.InsupdPatDocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAppRelease', (req, res) => {
    mapper(dbSchema.InsupdAppRelease, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsOrgLocArea', (req, res) => {
    mapper(dbSchema.InsOrgLocArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdSlotPatDtls', (req, res) => {
    mapper(dbSchema.UpdSlotPatDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsResendSmsEmail', (req, res) => {
    mapper(dbSchema.InsResendSmsEmail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatHealtCheck', (req, res) => {
    mapper(dbSchema.InsupdPatHealtCheck, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insServCnt', (req, res) => {
    mapper(dbSchema.insServCnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdDoctorFmtTv', (req, res) => {
    mapper(dbSchema.UpdDoctorFmtTv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DdfmtConstop', (req, res) => {
    mapper(dbSchema.DdfmtConstop, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/sendMsgManually', (req, res) => {
    mapper(dbSchema.sendMsgManually, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdSlotPriTyp', (req, res) => {
    mapper(dbSchema.insUpdSlotPriTyp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/delImage', (req, res) => {
    mapper(dbSchema.delImage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InProfileSetupDet', (req, res) => {
    mapper(dbSchema.InProfileSetupDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFamConHist', (req, res) => {
    mapper(dbSchema.InsUpdFamConHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPog', (req, res) => {
    mapper(dbSchema.InsUpdPog, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdSrvcSyn', (req, res) => {
    mapper(dbSchema.insUpdSrvcSyn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdTmplFormDet', (req, res) => {
    mapper(dbSchema.UpdTmplFormDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdChgMulSlotTime', (req, res) => {
    mapper(dbSchema.UpdChgMulSlotTime, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsOutputChart', (req, res) => {
    mapper(dbSchema.InsOutputChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvEmployee', (req, res) => {
    mapper(dbSchema.InsUpdSuvEmployee, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvClientVisitAttendes', (req, res) => {
    mapper(dbSchema.InsUpdSuvClientVisitAttendes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvClientVisit', (req, res) => {
    mapper(dbSchema.InsUpdSuvClientVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvClient', (req, res) => {
    mapper(dbSchema.InsUpdSuvClient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvClientSubject', (req, res) => {
    mapper(dbSchema.InsUpdSuvClientSubject, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSuvReportingLevel', (req, res) => {
    mapper(dbSchema.InsUpdSuvReportingLevel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updCcWrkListData', (req, res) => {
    mapper(dbSchema.updCcWrkListData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdActInact', (req, res) => {
    mapper(dbSchema.UpdActInact, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAssmntCol', (req, res) => {
    mapper(dbSchema.InsupdAssmntCol, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupSpecRscSrMap', (req, res) => {
    mapper(dbSchema.InsupSpecRscSrMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insDocTrigger', (req, res) => {
    mapper(dbSchema.insDocTrigger, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdRsrcSch', (req, res) => {
    mapper(dbSchema.InsupdRsrcSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insVisitDetTmp', (req, res) => {
    mapper(dbSchema.insVisitDetTmp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsAnasthTechque', (req, res) => {
    mapper(dbSchema.InsAnasthTechque, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsPreOpReEval', (req, res) => {
    mapper(dbSchema.InsPreOpReEval, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatFlag', (req, res) => {
    mapper(dbSchema.InsupdPatFlag, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdPostOpAnaCreRcrd', (req, res) => {
    mapper(dbSchema.insupdPostOpAnaCreRcrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DeleteRefRec', (req, res) => {
    mapper(dbSchema.DeleteRefRec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdIntraOpMntring', (req, res) => {
    mapper(dbSchema.insupdIntraOpMntring, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdPatPeriod', (req, res) => {
    mapper(dbSchema.insupdPatPeriod, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPrvsHsptlzn', (req, res) => {
    mapper(dbSchema.InsupdPrvsHsptlzn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdUserAppTrackActions', (req, res) => {
    mapper(dbSchema.InsupdUserAppTrackActions, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdUserAppTrack', (req, res) => {
    mapper(dbSchema.InsupdUserAppTrack, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocUnitMap', (req, res) => {
    mapper(dbSchema.InsUpdDocUnitMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatPrevHist', (req, res) => {
    mapper(dbSchema.InsupdPatPrevHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdQmsTv', (req, res) => {
    mapper(dbSchema.InsUpdQmsTv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatMstralHis', (req, res) => {
    mapper(dbSchema.InsUpdPatMstralHis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatGynObsHis', (req, res) => {
    mapper(dbSchema.InsUpdPatGynObsHis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatBirthHistory', (req, res) => {
    mapper(dbSchema.InsUpdPatBirthHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAppear', (req, res) => {
    mapper(dbSchema.getAppear, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEnlarge', (req, res) => {
    mapper(dbSchema.getEnlarge, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSysExam', (req, res) => {
    mapper(dbSchema.getSysExam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSysExamDet', (req, res) => {
    mapper(dbSchema.getSysExamDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getProfSetupDet', (req, res) => {
    mapper(dbSchema.getProfSetupDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBodyImages', (req, res) => {
    mapper(dbSchema.getBodyImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmissions', (req, res) => {
    mapper(dbSchema.getAdmissions, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatBodyImages', (req, res) => {
    mapper(dbSchema.getPatBodyImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMaster', (req, res) => {
    mapper(dbSchema.getMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDocuments', (req, res) => {
    mapper(dbSchema.getPatDocuments, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVitalsEntry', (req, res) => {
    mapper(dbSchema.getVitalsEntry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctors', (req, res) => {
    mapper(dbSchema.getDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/missingWl', (req, res) => {
    mapper(dbSchema.missingWl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/qNoRegen', (req, res) => {
    mapper(dbSchema.qNoRegen, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/docCntStat', (req, res) => {
    mapper(dbSchema.docCntStat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Qmaster', (req, res) => {
    mapper(dbSchema.Qmaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkUsrLogin', (req, res) => {
    mapper(dbSchema.chkUsrLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllOrgs', (req, res) => {
    mapper(dbSchema.getAllOrgs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/get7AvlDtsFrOlr', (req, res) => {
    mapper(dbSchema.get7AvlDtsFrOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSltsFrOlr', (req, res) => {
    mapper(dbSchema.getSltsFrOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPaDocLocDet', (req, res) => {
    mapper(dbSchema.getPaDocLocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPaDocLocSlotDetNew', (req, res) => {
    mapper(dbSchema.getPaDocLocSlotDetNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPaDocLocSlotDet', (req, res) => {
    mapper(dbSchema.getPaDocLocSlotDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllSpec', (req, res) => {
    mapper(dbSchema.getAllSpec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkMedication', (req, res) => {
    mapper(dbSchema.chkMedication, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllSrvs', (req, res) => {
    mapper(dbSchema.getAllSrvs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPkgInfo', (req, res) => {
    mapper(dbSchema.getPkgInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcPkg', (req, res) => {
    mapper(dbSchema.getRsrcPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSltMerge', (req, res) => {
    mapper(dbSchema.getSltMerge, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllCntry', (req, res) => {
    mapper(dbSchema.getAllCntry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllStat', (req, res) => {
    mapper(dbSchema.getAllStat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllCity', (req, res) => {
    mapper(dbSchema.getAllCity, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllArea', (req, res) => {
    mapper(dbSchema.getAllArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSlotDtls', (req, res) => {
    mapper(dbSchema.getPatSlotDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocWithSpcl', (req, res) => {
    mapper(dbSchema.getDocWithSpcl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocByOrg', (req, res) => {
    mapper(dbSchema.getLocByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgs', (req, res) => {
    mapper(dbSchema.getOrgs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocStatus', (req, res) => {
    mapper(dbSchema.getDocStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpkgTrms', (req, res) => {
    mapper(dbSchema.getpkgTrms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMigKeys', (req, res) => {
    mapper(dbSchema.getMigKeys, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCityOrg', (req, res) => {
    mapper(dbSchema.getCityOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAffiliate', (req, res) => {
    mapper(dbSchema.getAffiliate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAffiliatePkg', (req, res) => {
    mapper(dbSchema.getAffiliatePkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcImgMap', (req, res) => {
    mapper(dbSchema.getRsrcImgMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/avgWaitDura', (req, res) => {
    mapper(dbSchema.avgWaitDura, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkLeave', (req, res) => {
    mapper(dbSchema.chkLeave, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DocHoliday', (req, res) => {
    mapper(dbSchema.DocHoliday, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPkgImg', (req, res) => {
    mapper(dbSchema.getPkgImg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkPkgAffCrd', (req, res) => {
    mapper(dbSchema.chkPkgAffCrd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPkgImgInfo', (req, res) => {
    mapper(dbSchema.getPkgImgInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChkUmr', (req, res) => {
    mapper(dbSchema.getChkUmr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Patrelmap', (req, res) => {
    mapper(dbSchema.Patrelmap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatPref', (req, res) => {
    mapper(dbSchema.getPatPref, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/patrsrcFav', (req, res) => {
    mapper(dbSchema.patrsrcFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatUmrMap', (req, res) => {
    mapper(dbSchema.getPatUmrMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatUmrLocOrg', (req, res) => {
    mapper(dbSchema.getPatUmrLocOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCurrency', (req, res) => {
    mapper(dbSchema.getCurrency, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getReportSettings', (req, res) => {
    mapper(dbSchema.getReportSettings, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMobiOlr', (req, res) => {
    mapper(dbSchema.getMobiOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDoctorOrg', (req, res) => {
    mapper(dbSchema.getDoctorOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVacMst', (req, res) => {
    mapper(dbSchema.getVacMst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVacSch', (req, res) => {
    mapper(dbSchema.getVacSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatUmrVitals', (req, res) => {
    mapper(dbSchema.getPatUmrVitals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprFaq', (req, res) => {
    mapper(dbSchema.uprFaq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/refGroupsFaq', (req, res) => {
    mapper(dbSchema.refGroupsFaq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVitals', (req, res) => {
    mapper(dbSchema.getVitals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHolydayList', (req, res) => {
    mapper(dbSchema.getHolydayList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/patQueTemp', (req, res) => {
    mapper(dbSchema.patQueTemp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/QTempStatus', (req, res) => {
    mapper(dbSchema.QTempStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAffClinic', (req, res) => {
    mapper(dbSchema.getAffClinic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecSlots', (req, res) => {
    mapper(dbSchema.getSpecSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecDates', (req, res) => {
    mapper(dbSchema.getSpecDates, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecOlrMap', (req, res) => {
    mapper(dbSchema.getSpecOlrMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcUsrMobNo', (req, res) => {
    mapper(dbSchema.getCcUsrMobNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chngSltType', (req, res) => {
    mapper(dbSchema.chngSltType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getmobiloc', (req, res) => {
    mapper(dbSchema.getmobiloc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClinicHead', (req, res) => {
    mapper(dbSchema.getClinicHead, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocs', (req, res) => {
    mapper(dbSchema.getLocs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecDocSlots', (req, res) => {
    mapper(dbSchema.getSpecDocSlots, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatEnquiry', (req, res) => {
    mapper(dbSchema.getPatEnquiry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVaccine', (req, res) => {
    mapper(dbSchema.getVaccine, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCorpArea', (req, res) => {
    mapper(dbSchema.getCorpArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getpatDep', (req, res) => {
    mapper(dbSchema.getpatDep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCorpSpec', (req, res) => {
    mapper(dbSchema.getCorpSpec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ccDocEnqiry', (req, res) => {
    mapper(dbSchema.ccDocEnqiry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocEnqTyp', (req, res) => {
    mapper(dbSchema.getDocEnqTyp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSrvcAutoGrid', (req, res) => {
    mapper(dbSchema.getSrvcAutoGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInsProv', (req, res) => {
    mapper(dbSchema.getInsProv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIntgSpecSlot', (req, res) => {
    mapper(dbSchema.getIntgSpecSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getExchangeRate', (req, res) => {
    mapper(dbSchema.getExchangeRate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCliSpeDocMap', (req, res) => {
    mapper(dbSchema.getCliSpeDocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgDetails', (req, res) => {
    mapper(dbSchema.getOrgDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConsPrese', (req, res) => {
    mapper(dbSchema.getConsPrese, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecSltsCnt', (req, res) => {
    mapper(dbSchema.getSpecSltsCnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLocCorpSpeciality', (req, res) => {
    mapper(dbSchema.getLocCorpSpeciality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getBankInfo', (req, res) => {
    mapper(dbSchema.getBankInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCardType', (req, res) => {
    mapper(dbSchema.getCardType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInboundPasString', (req, res) => {
    mapper(dbSchema.getInboundPasString, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOutboundPasString', (req, res) => {
    mapper(dbSchema.getOutboundPasString, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInsurance', (req, res) => {
    mapper(dbSchema.getInsurance, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConfigm', (req, res) => {
    mapper(dbSchema.getConfigm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatBookPkg', (req, res) => {
    mapper(dbSchema.getPatBookPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatBookPkgRpt', (req, res) => {
    mapper(dbSchema.getPatBookPkgRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatBookPkgRpt1', (req, res) => {
    mapper(dbSchema.getPatBookPkgRpt1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getClinicRep', (req, res) => {
    mapper(dbSchema.getClinicRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRegstncRep', (req, res) => {
    mapper(dbSchema.getRegstncRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdminDocLocDet', (req, res) => {
    mapper(dbSchema.getAdminDocLocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getcorpCntSts', (req, res) => {
    mapper(dbSchema.getcorpCntSts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIntgPkgBookSrvc', (req, res) => {
    mapper(dbSchema.getIntgPkgBookSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotHistory', (req, res) => {
    mapper(dbSchema.getSlotHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasClaimResArr', (req, res) => {
    mapper(dbSchema.getPasClaimResArr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocSlotTims', (req, res) => {
    mapper(dbSchema.getDocSlotTims, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllLoc', (req, res) => {
    mapper(dbSchema.GetAllLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/EventDetails', (req, res) => {
    mapper(dbSchema.EventDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCcSubTyp', (req, res) => {
    mapper(dbSchema.getCcSubTyp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSysExamRep', (req, res) => {
    mapper(dbSchema.getSysExamRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getcorpPatBookings', (req, res) => {
    mapper(dbSchema.getcorpPatBookings, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatUmrs', (req, res) => {
    mapper(dbSchema.getPatUmrs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPromotion', (req, res) => {
    mapper(dbSchema.getPromotion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCorpPkgRep', (req, res) => {
    mapper(dbSchema.getCorpPkgRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSch', (req, res) => {
    mapper(dbSchema.getPatSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEmpPhone', (req, res) => {
    mapper(dbSchema.getEmpPhone, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAutoAddress', (req, res) => {
    mapper(dbSchema.GetAutoAddress, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvcExt', (req, res) => {
    mapper(dbSchema.GetSrvcExt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUmrCons', (req, res) => {
    mapper(dbSchema.getUmrCons, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAppSet', (req, res) => {
    mapper(dbSchema.getAppSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkPatByEmail', (req, res) => {
    mapper(dbSchema.chkPatByEmail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatMadiRep', (req, res) => {
    mapper(dbSchema.GetPatMadiRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatInvOrderRep', (req, res) => {
    mapper(dbSchema.GetPatInvOrderRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRevGrid', (req, res) => {
    mapper(dbSchema.getRevGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPcRel', (req, res) => {
    mapper(dbSchema.getPcRel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCorpBillNos', (req, res) => {
    mapper(dbSchema.getCorpBillNos, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPcPatImg', (req, res) => {
    mapper(dbSchema.getPcPatImg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AgentHistory', (req, res) => {
    mapper(dbSchema.AgentHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/CorpPatReg', (req, res) => {
    mapper(dbSchema.CorpPatReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/CorpBookPkgDtls', (req, res) => {
    mapper(dbSchema.CorpBookPkgDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasReciept', (req, res) => {
    mapper(dbSchema.getPasReciept, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUmrNoStat', (req, res) => {
    mapper(dbSchema.getUmrNoStat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgLocServ', (req, res) => {
    mapper(dbSchema.getOrgLocServ, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetShftDtls', (req, res) => {
    mapper(dbSchema.GetShftDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ccSrvcGrid', (req, res) => {
    mapper(dbSchema.ccSrvcGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/chkUmrMobNo', (req, res) => {
    mapper(dbSchema.chkUmrMobNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/corpStsCnt', (req, res) => {
    mapper(dbSchema.corpStsCnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/cmpPatGrid', (req, res) => {
    mapper(dbSchema.cmpPatGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/cmpDefData', (req, res) => {
    mapper(dbSchema.cmpDefData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/cmpMastr', (req, res) => {
    mapper(dbSchema.cmpMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasPatCard', (req, res) => {
    mapper(dbSchema.getPasPatCard, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCmpVitals', (req, res) => {
    mapper(dbSchema.getCmpVitals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDefMultiDocs', (req, res) => {
    mapper(dbSchema.getDefMultiDocs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDefSinDoctor', (req, res) => {
    mapper(dbSchema.getDefSinDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasTransHist', (req, res) => {
    mapper(dbSchema.getPasTransHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasTransServ', (req, res) => {
    mapper(dbSchema.getPasTransServ, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasRecpayDet', (req, res) => {
    mapper(dbSchema.getPasRecpayDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDueBills', (req, res) => {
    mapper(dbSchema.getDueBills, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasPatTranHist', (req, res) => {
    mapper(dbSchema.getPasPatTranHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFbMstrData', (req, res) => {
    mapper(dbSchema.getFbMstrData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getInvMedData', (req, res) => {
    mapper(dbSchema.getInvMedData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVisitPatPastHist', (req, res) => {
    mapper(dbSchema.getVisitPatPastHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOgrKeyJson', (req, res) => {
    mapper(dbSchema.getOgrKeyJson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSickLeave', (req, res) => {
    mapper(dbSchema.getPatSickLeave, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntTypeMast', (req, res) => {
    mapper(dbSchema.getEntTypeMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntData', (req, res) => {
    mapper(dbSchema.getEntData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAutoFavInvst', (req, res) => {
    mapper(dbSchema.getAutoFavInvst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDocEntyFav', (req, res) => {
    mapper(dbSchema.getDocEntyFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntityJson', (req, res) => {
    mapper(dbSchema.getEntityJson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgkeys', (req, res) => {
    mapper(dbSchema.getOrgkeys, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFADCuddles', (req, res) => {
    mapper(dbSchema.getFADCuddles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSLTCuddles', (req, res) => {
    mapper(dbSchema.getSLTCuddles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatient', (req, res) => {
    mapper(dbSchema.getPatient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOnlineRsrcData', (req, res) => {
    mapper(dbSchema.getOnlineRsrcData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntFilterData', (req, res) => {
    mapper(dbSchema.getEntFilterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecServices', (req, res) => {
    mapper(dbSchema.getSpecServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMstOrgLoc', (req, res) => {
    mapper(dbSchema.getMstOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getdocimagesDtls', (req, res) => {
    mapper(dbSchema.getdocimagesDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOpthamology', (req, res) => {
    mapper(dbSchema.getPatOpthamology, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOpthamology1', (req, res) => {
    mapper(dbSchema.getPatOpthamology1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOpthamology2', (req, res) => {
    mapper(dbSchema.getPatOpthamology2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOpthamology3', (req, res) => {
    mapper(dbSchema.getPatOpthamology3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOpthamology4', (req, res) => {
    mapper(dbSchema.getPatOpthamology4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatCompMast', (req, res) => {
    mapper(dbSchema.getPatCompMast, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOptLens', (req, res) => {
    mapper(dbSchema.getPatOptLens, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOptLensInst', (req, res) => {
    mapper(dbSchema.getPatOptLensInst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatDiagnosism', (req, res) => {
    mapper(dbSchema.getPatDiagnosism, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUsersByRoles', (req, res) => {
    mapper(dbSchema.GetUsersByRoles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatComplaints', (req, res) => {
    mapper(dbSchema.getPatComplaints, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTokenDataPat', (req, res) => {
    mapper(dbSchema.getTokenDataPat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntlAsmntNutr', (req, res) => {
    mapper(dbSchema.InsUpdIntlAsmntNutr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntakeOutput', (req, res) => {
    mapper(dbSchema.InsUpdIntakeOutput, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNursHanOvrDoc', (req, res) => {
    mapper(dbSchema.InsUpdNursHanOvrDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNursingCareValue', (req, res) => {
    mapper(dbSchema.InsUpdNursingCareValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdIpMedicationDet', (req, res) => {
    mapper(dbSchema.UpdIpMedicationDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPeripheral', (req, res) => {
    mapper(dbSchema.InsUpdPeripheral, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPeripheralDocDet', (req, res) => {
    mapper(dbSchema.InsUpdPeripheralDocDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInitDocAsses', (req, res) => {
    mapper(dbSchema.InsUpdInitDocAsses, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatMov', (req, res) => {
    mapper(dbSchema.InsUpdPatMov, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatHistory', (req, res) => {
    mapper(dbSchema.InsUpdPatHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIpIntkeOuptChrt', (req, res) => {
    mapper(dbSchema.InsUpdIpIntkeOuptChrt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatFamilyEdu', (req, res) => {
    mapper(dbSchema.InsUpdPatFamilyEdu, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCCareChrtDetXML', (req, res) => {
    mapper(dbSchema.InsUpdCCareChrtDetXML, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsSyncPatients', (req, res) => {
    mapper(dbSchema.UprInsSyncPatients, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInSyncConsDet', (req, res) => {
    mapper(dbSchema.UprInSyncConsDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdSlotGustUser', (req, res) => {
    mapper(dbSchema.UprInsUpdSlotGustUser, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprPhrInsVdDocDefClinicalDet', (req, res) => {
    mapper(dbSchema.UprPhrInsVdDocDefClinicalDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsSrvcBill', (req, res) => {
    mapper(dbSchema.UprInsSrvcBill, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdDental', (req, res) => {
    mapper(dbSchema.UpdDental, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdNrsInst', (req, res) => {
    mapper(dbSchema.UprInsUpdNrsInst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdIPVisit', (req, res) => {
    mapper(dbSchema.UprInsUpdIPVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdPatVaccine', (req, res) => {
    mapper(dbSchema.UprInsUpdPatVaccine, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdTMDet', (req, res) => {
    mapper(dbSchema.InsUpdTMDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCCWorklistData', (req, res) => {
    mapper(dbSchema.InsUpdCCWorklistData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdPatEcg', (req, res) => {
    mapper(dbSchema.UprInsUpdPatEcg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsPatientEcgData', (req, res) => {
    mapper(dbSchema.UprInsPatientEcgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdPatEcgData', (req, res) => {
    mapper(dbSchema.UprUpdPatEcgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsMsgVideoCons', (req, res) => {
    mapper(dbSchema.InsMsgVideoCons, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdAdmnDrschReq', (req, res) => {
    mapper(dbSchema.UprUpdAdmnDrschReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsCcFeedbackFormQuesRating', (req, res) => {
    mapper(dbSchema.InsCcFeedbackFormQuesRating, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrgSrv', (req, res) => {
    mapper(dbSchema.InsUpdOrgSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrgMedi', (req, res) => {
    mapper(dbSchema.InsUpdOrgMedi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsVDMasterOrgLocMap', (req, res) => {
    mapper(dbSchema.InsVDMasterOrgLocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdNurseRequests', (req, res) => {
    mapper(dbSchema.UpdNurseRequests, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSrvcSynMul', (req, res) => {
    mapper(dbSchema.InsUpdSrvcSynMul, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNewItemReq', (req, res) => {
    mapper(dbSchema.InsUpdNewItemReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRos', (req, res) => {
    mapper(dbSchema.InsRos, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdLocation', (req, res) => {
    mapper(dbSchema.insUpdLocation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCheifComplaints', (req, res) => {
    mapper(dbSchema.InsUpdCheifComplaints, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdConditions', (req, res) => {
    mapper(dbSchema.InsUpdConditions, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAllergy', (req, res) => {
    mapper(dbSchema.InsUpdAllergy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// router.post('/InsUpdMedications', (req, res) => {
// mapper(dbSchema.InsUpdMedications, req.body, req.cParams).then((response) => {
// res.json(responseChange(response, req.cParams));
// }).catch((error) => {
// res.status(400).send(error);
// });
// });

router.post('/InsUpdMedications', (req, res) => {
    mapper(dbSchema.InsUpdMedications, req.body, req.cParams).then((response) => {
        if (req.body.ORG_ID == 1003) {

            const path = appConfig.DIR_PATH + "public/static/ip_op/InsUpdMedications/" + "meication" + ".json";
            //console.log("path", path,req.body)
            fs.appendFileSync(path, JSON.stringify(req.body));
        }
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/InsUpdVitalSigns', (req, res) => {
    mapper(dbSchema.InsUpdVitalSigns, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInvsOrder', (req, res) => {

    mapper(dbSchema.InsUpdInvsOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });

});

router.post('/InsUpdDiagnosis', (req, res) => {
    mapper(dbSchema.InsUpdDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdMedicMaster', (req, res) => {
    mapper(dbSchema.UpdMedicMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAddress', (req, res) => {
    mapper(dbSchema.InsUpdAddress, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAccreditation', (req, res) => {
    mapper(dbSchema.InsUpdAccreditation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdSkipQno', (req, res) => {
    mapper(dbSchema.UpdSkipQno, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRsrcLang', (req, res) => {
    mapper(dbSchema.InsUpdRsrcLang, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDoctor', (req, res) => {
    mapper(dbSchema.InsUpdDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdQualification', (req, res) => {
    mapper(dbSchema.InsUpdQualification, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdWorkExp', (req, res) => {
    mapper(dbSchema.InsUpdWorkExp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAwards', (req, res) => {
    mapper(dbSchema.InsUpdAwards, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMemberShip', (req, res) => {
    mapper(dbSchema.InsUpdMemberShip, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRsrcReg', (req, res) => {
    mapper(dbSchema.InsRsrcReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSpecialization', (req, res) => {
    mapper(dbSchema.InsUpdSpecialization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDoctorNotes', (req, res) => {
    mapper(dbSchema.InsupdDoctorNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMultiLocMap', (req, res) => {
    mapper(dbSchema.InsUpdMultiLocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAssistant', (req, res) => {
    mapper(dbSchema.InsUpdAssistant, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrganization', (req, res) => {
    mapper(dbSchema.InsUpdOrganization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdScrollData', (req, res) => {
    mapper(dbSchema.InsUpdScrollData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatDiagnosis', (req, res) => {
    mapper(dbSchema.InsUpdPatDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdReocmFolwAdvise', (req, res) => {
    mapper(dbSchema.InsUpdReocmFolwAdvise, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdVdClinicalDet', (req, res) => {
    mapper(dbSchema.InsUpdVdClinicalDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatSysExam', (req, res) => {
    mapper(dbSchema.InsUpdPatSysExam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAssNew', (req, res) => {
    mapper(dbSchema.InsUpdAssNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRsrcMultiMap', (req, res) => {
    mapper(dbSchema.InsUpdRsrcMultiMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelPaLoc', (req, res) => {
    mapper(dbSchema.DelPaLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpchangePsw', (req, res) => {
    mapper(dbSchema.InUpchangePsw, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelAstMappedLocs', (req, res) => {
    mapper(dbSchema.DelAstMappedLocs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDocHolyday', (req, res) => {
    mapper(dbSchema.InsDocHolyday, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsOrgLocRsrMap', (req, res) => {
    mapper(dbSchema.InsOrgLocRsrMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdlocSrvMap', (req, res) => {
    mapper(dbSchema.InsUpdlocSrvMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocument', (req, res) => {
    mapper(dbSchema.InsUpdDocument, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdroles', (req, res) => {
    mapper(dbSchema.InsUpdroles, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdusers', (req, res) => {
    mapper(dbSchema.InsUpdusers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSpecOrgLoc', (req, res) => {
    mapper(dbSchema.InsUpdSpecOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpCathProcRecord', (req, res) => {
    mapper(dbSchema.UprInsupdIpCathProcRecord, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpAnesthesiaInvs', (req, res) => {
    mapper(dbSchema.UprInsupdIpAnesthesiaInvs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpPreOpSurgeryAssmnt', (req, res) => {
    mapper(dbSchema.UprInsupdIpPreOpSurgeryAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpCheckList', (req, res) => {
    mapper(dbSchema.UprInsupdIpCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpClinicalPathwayInfo', (req, res) => {
    mapper(dbSchema.UprInsupdIpClinicalPathwayInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpSurgeonAssessment', (req, res) => {
    mapper(dbSchema.UprInsupdIpSurgeonAssessment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpDvtProphylaxisOrder', (req, res) => {
    mapper(dbSchema.UprInsupdIpDvtProphylaxisOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdAdtDschrgCaseAbstract', (req, res) => {
    mapper(dbSchema.UprInsupdAdtDschrgCaseAbstract, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpIncidentReporting', (req, res) => {
    mapper(dbSchema.UprInsupdIpIncidentReporting, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpIncidentAnesthesia', (req, res) => {
    mapper(dbSchema.UprInsupdIpIncidentAnesthesia, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInsdntSrgyRscdle', (req, res) => {
    mapper(dbSchema.InsUpdInsdntSrgyRscdle, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpIncidentReIntubation', (req, res) => {
    mapper(dbSchema.UprInsupdIpIncidentReIntubation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpIncidentReturnIcu', (req, res) => {
    mapper(dbSchema.UprInsupdIpIncidentReturnIcu, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpRetrnOpertnThetr', (req, res) => {
    mapper(dbSchema.UprInsupdIpRetrnOpertnThetr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpSrgnOprtnNotes', (req, res) => {
    mapper(dbSchema.UprInsupdIpSrgnOprtnNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpAdendum', (req, res) => {
    mapper(dbSchema.UprInsupdIpAdendum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpHandoffComRad', (req, res) => {
    mapper(dbSchema.InsupdIpHandoffComRad, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdRstrntOrder', (req, res) => {
    mapper(dbSchema.InsupdRstrntOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdClnclExmntn', (req, res) => {
    mapper(dbSchema.InsupdClnclExmntn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDocNurChkList', (req, res) => {
    mapper(dbSchema.InsupdDocNurChkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDialysisUnit', (req, res) => {
    mapper(dbSchema.InsupdDialysisUnit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpTurningChart', (req, res) => {
    mapper(dbSchema.InsupdIpTurningChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpSeizureChart', (req, res) => {
    mapper(dbSchema.InsupdIpSeizureChart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdMortality', (req, res) => {
    mapper(dbSchema.UprInsupdMortality, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdDocOrderSet', (req, res) => {
    mapper(dbSchema.UprInsupdDocOrderSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFileShareInfo', (req, res) => {
    mapper(dbSchema.InsupdFileShareInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFileShareFav', (req, res) => {
    mapper(dbSchema.InsupdFileShareFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdERAdmnDtls', (req, res) => {
    mapper(dbSchema.InsupdERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updERAdmnDtls', (req, res) => {
    mapper(dbSchema.updERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAssaySpecColSrv', (req, res) => {
    mapper(dbSchema.InsupdAssaySpecColSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdSurgicalChkList', (req, res) => {
    mapper(dbSchema.InsupdSurgicalChkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIPPeriOP1', (req, res) => {
    mapper(dbSchema.InsupdIPPeriOP1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIPPeriOP2', (req, res) => {
    mapper(dbSchema.InsupdIPPeriOP2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCareContinnumOrtho', (req, res) => {
    mapper(dbSchema.InsUpdCareContinnumOrtho, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdedicationSchDet', (req, res) => {
    mapper(dbSchema.InsupdedicationSchDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdIpBloodRequestDetails', (req, res) => {
    mapper(dbSchema.UpdIpBloodRequestDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdLabresultentry', (req, res) => {
    mapper(dbSchema.UprUpdLabresultentry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// need to changes
router.post('/postPasClaim', (req, res) => {
    mapper(dbSchema.postPasClaim, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsAdmnRqstn', (req, res) => {
    mapper(dbSchema.UprInsAdmnRqstn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsUpdAntibiotic', (req, res) => {
    mapper(dbSchema.UprInsUpdAntibiotic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAuditLogInfo', (req, res) => {
    mapper(dbSchema.InsupdAuditLogInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprUpdSlot', (req, res) => {
    mapper(dbSchema.UprUpdSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdStitemsStockInfo', (req, res) => {
    mapper(dbSchema.InsupdStitemsStockInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatient', (req, res) => {
    mapper(dbSchema.InsUpdPatient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsReviewDate', (req, res) => {
    mapper(dbSchema.InsReviewDate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetReviewDate', (req, res) => {
    mapper(dbSchema.GetReviewDate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/CaptureUserInfo', (req, res) => {
    mapper(dbSchema.CaptureUserInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrgDetails', (req, res) => {
    mapper(dbSchema.InsUpdOrgDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCities', (req, res) => {
    mapper(dbSchema.GetCities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdvrtseImg', (req, res) => {
    mapper(dbSchema.getAdvrtseImg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insAdvrtseImg', (req, res) => {
    mapper(dbSchema.insAdvrtseImg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updAdvImgClkCnt', (req, res) => {
    mapper(dbSchema.updAdvImgClkCnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatTestmnls', (req, res) => {
    mapper(dbSchema.getPatTestmnls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdPatTestmnls', (req, res) => {
    mapper(dbSchema.insUpdPatTestmnls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdOrgAbt', (req, res) => {
    mapper(dbSchema.insUpdOrgAbt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsAddArea', (req, res) => {
    mapper(dbSchema.InsAddArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsorgTerms', (req, res) => {
    mapper(dbSchema.InsorgTerms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsCountry', (req, res) => {
    mapper(dbSchema.InsCountry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsCitySelect', (req, res) => {
    mapper(dbSchema.InsCitySelect, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdArea', (req, res) => {
    mapper(dbSchema.InsUpdArea, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLoc_By_RSRC', (req, res) => {
    mapper(dbSchema.GetLoc_By_RSRC, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgCity', (req, res) => {
    mapper(dbSchema.getOrgCity, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdLocAddrImage', (req, res) => {
    mapper(dbSchema.InsUpdLocAddrImage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DeleteLocation', (req, res) => {
    mapper(dbSchema.DeleteLocation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetlocByPA', (req, res) => {
    mapper(dbSchema.GetlocByPA, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDoctorsByLoc', (req, res) => {
    mapper(dbSchema.GetDoctorsByLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRsrcQualMap', (req, res) => {
    mapper(dbSchema.InsUpdRsrcQualMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdDocStatus', (req, res) => {
    mapper(dbSchema.UpdDocStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDocOpRefferals', (req, res) => {
    mapper(dbSchema.InsDocOpRefferals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocDelaySms', (req, res) => {
    mapper(dbSchema.InsUpdDocDelaySms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDoctorDtls', (req, res) => {
    mapper(dbSchema.GetDoctorDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSlotsByDoctor_Id', (req, res) => {
    mapper(dbSchema.GetSlotsByDoctor_Id, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecialIntrest', (req, res) => {
    mapper(dbSchema.GetSpecialIntrest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSpecialInterest', (req, res) => {
    mapper(dbSchema.InsUpdSpecialInterest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Diabetic2', (req, res) => {
    mapper(dbSchema.Diabetic2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DiabeticChild', (req, res) => {
    mapper(dbSchema.DiabeticChild, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpDDCrdIoPrcdur', (req, res) => {
    mapper(dbSchema.InUpDDCrdIoPrcdur, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiDiabetic', (req, res) => {
    mapper(dbSchema.getApiDiabetic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPostOper1', (req, res) => {
    mapper(dbSchema.InsUpdPostOper1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPostOper3', (req, res) => {
    mapper(dbSchema.InsUpdPostOper3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPostOper2', (req, res) => {
    mapper(dbSchema.InsUpdPostOper2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPostOper4', (req, res) => {
    mapper(dbSchema.InsUpdPostOper4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPreCarInt1', (req, res) => {
    mapper(dbSchema.InsUpdPreCarInt1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPreCarInt2', (req, res) => {
    mapper(dbSchema.InsUpdPreCarInt2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPreCarInt3', (req, res) => {
    mapper(dbSchema.InsUpdPreCarInt3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPreCarInt4', (req, res) => {
    mapper(dbSchema.InsUpdPreCarInt4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ValvePro1', (req, res) => {
    mapper(dbSchema.ValvePro1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ValvePro2', (req, res) => {
    mapper(dbSchema.ValvePro2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ValvePro3', (req, res) => {
    mapper(dbSchema.ValvePro3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntOper', (req, res) => {
    mapper(dbSchema.InsUpdIntOper, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntOper2', (req, res) => {
    mapper(dbSchema.InsUpdIntOper2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntOper3', (req, res) => {
    mapper(dbSchema.InsUpdIntOper3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIntOper4', (req, res) => {
    mapper(dbSchema.InsUpdIntOper4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHemoDyn1', (req, res) => {
    mapper(dbSchema.InsUpdHemoDyn1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHemoDyn2', (req, res) => {
    mapper(dbSchema.InsUpdHemoDyn2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHemoDyn3', (req, res) => {
    mapper(dbSchema.InsUpdHemoDyn3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHemoDyn4', (req, res) => {
    mapper(dbSchema.InsUpdHemoDyn4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDiscsumSts1', (req, res) => {
    mapper(dbSchema.InsUpdDiscsumSts1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDiscsumSts2', (req, res) => {
    mapper(dbSchema.InsUpdDiscsumSts2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDiscsumSts3', (req, res) => {
    mapper(dbSchema.InsUpdDiscsumSts3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCardiacsur1', (req, res) => {
    mapper(dbSchema.InsUpdCardiacsur1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCardiacsur2', (req, res) => {
    mapper(dbSchema.InsUpdCardiacsur2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCardiacsur3', (req, res) => {
    mapper(dbSchema.InsUpdCardiacsur3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdcardioProc', (req, res) => {
    mapper(dbSchema.InsUpdcardioProc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdInvestInstruct', (req, res) => {
    mapper(dbSchema.InsUpdInvestInstruct, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsInvestProfileDiet', (req, res) => {
    mapper(dbSchema.InsInvestProfileDiet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFavMedic', (req, res) => {
    mapper(dbSchema.GetDocFavMedic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDosages', (req, res) => {
    mapper(dbSchema.GetDosages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFavAllergy', (req, res) => {
    mapper(dbSchema.GetDocFavAllergy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFavComplaints', (req, res) => {
    mapper(dbSchema.GetDocFavComplaints, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsMediProfileDet', (req, res) => {
    mapper(dbSchema.InsMediProfileDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInvsProfilDet', (req, res) => {
    mapper(dbSchema.GetInvsProfilDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPhrMediProfileDet', (req, res) => {
    mapper(dbSchema.GetPhrMediProfileDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupDosageMaster', (req, res) => {
    mapper(dbSchema.InsupDosageMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDiagnonsTemplate', (req, res) => {
    mapper(dbSchema.GetDiagnonsTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupDiaggnostsTemplate', (req, res) => {
    mapper(dbSchema.InsupDiaggnostsTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ApptCntByVisitType', (req, res) => {
    mapper(dbSchema.ApptCntByVisitType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPrevReport', (req, res) => {
    mapper(dbSchema.GetPrevReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupVisitDetSet', (req, res) => {
    mapper(dbSchema.InsupVisitDetSet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelFavourites', (req, res) => {
    mapper(dbSchema.DelFavourites, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDelFavHealthCond', (req, res) => {
    mapper(dbSchema.InsDelFavHealthCond, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetTariffByOrg', (req, res) => {
    mapper(dbSchema.GetTariffByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvInstruct', (req, res) => {
    mapper(dbSchema.GetSrvInstruct, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPkgAdlInfo', (req, res) => {
    mapper(dbSchema.InsUpdPkgAdlInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRsrcPkg', (req, res) => {
    mapper(dbSchema.InsUpdRsrcPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsPkgAddTerms', (req, res) => {
    mapper(dbSchema.InsPkgAddTerms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsAffillact', (req, res) => {
    mapper(dbSchema.InsAffillact, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsAffillactPkg', (req, res) => {
    mapper(dbSchema.InsAffillactPkg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdReport', (req, res) => {
    mapper(dbSchema.InsUpdReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPkgImgInfo', (req, res) => {
    mapper(dbSchema.InsUpdPkgImgInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMediSpanDrug', (req, res) => {
    mapper(dbSchema.InsUpdMediSpanDrug, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdaffClinic', (req, res) => {
    mapper(dbSchema.InsUpdaffClinic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdspelOlrMap', (req, res) => {
    mapper(dbSchema.InsUpdspelOlrMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdspecilatySlot', (req, res) => {
    mapper(dbSchema.InsUpdspecilatySlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insServiceCnt', (req, res) => {
    mapper(dbSchema.insServiceCnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdloginNameMap', (req, res) => {
    mapper(dbSchema.UpdloginNameMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvLookUp', (req, res) => {
    mapper(dbSchema.GetSrvLookUp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFormLocMap', (req, res) => {
    mapper(dbSchema.InsUpdFormLocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCampPatient', (req, res) => {
    mapper(dbSchema.InsUpdCampPatient, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdReferalDoc', (req, res) => {
    mapper(dbSchema.InsUpdReferalDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCampMedi', (req, res) => {
    mapper(dbSchema.InsUpdCampMedi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCampAttendess', (req, res) => {
    mapper(dbSchema.InsUpdCampAttendess, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCamp', (req, res) => {
    mapper(dbSchema.InsUpdCamp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdVaccineSch', (req, res) => {
    mapper(dbSchema.InsUpdVaccineSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdVaccineMaster', (req, res) => {
    mapper(dbSchema.InsUpdVaccineMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdExchangeRate', (req, res) => {
    mapper(dbSchema.InsUpdExchangeRate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdcurrencyType', (req, res) => {
    mapper(dbSchema.InsUpdcurrencyType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSmsOtp', (req, res) => {
    mapper(dbSchema.InsUpdSmsOtp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRecPayment', (req, res) => {
    mapper(dbSchema.InsUpdRecPayment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRecPayment1', (req, res) => {
    mapper(dbSchema.InsUpdRecPayment1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdScheduleTemplate', (req, res) => {
    mapper(dbSchema.InsUpdScheduleTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdScheduleTemplateTran', (req, res) => {
    mapper(dbSchema.InsUpdScheduleTemplateTran, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSchTemplateByRsrc', (req, res) => {
    mapper(dbSchema.GetSchTemplateByRsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetTemplateShifts', (req, res) => {
    mapper(dbSchema.GetTemplateShifts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSlotType', (req, res) => {
    mapper(dbSchema.GetSlotType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetShiftsTime', (req, res) => {
    mapper(dbSchema.GetShiftsTime, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcSch', (req, res) => {
    mapper(dbSchema.GetRsrcSch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcSchTimeValidatin', (req, res) => {
    mapper(dbSchema.GetRsrcSchTimeValidatin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/EditRsrcSchTime', (req, res) => {
    mapper(dbSchema.EditRsrcSchTime, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelSchTemplate', (req, res) => {
    mapper(dbSchema.DelSchTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAsistantsByOrgLoc', (req, res) => {
    mapper(dbSchema.GetAsistantsByOrgLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAsistantsByLoc', (req, res) => {
    mapper(dbSchema.GetAsistantsByLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAsistantsByDoc', (req, res) => {
    mapper(dbSchema.GetAsistantsByDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Delete', (req, res) => {
    mapper(dbSchema.Delete, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPADocLocDetails', (req, res) => {
    mapper(dbSchema.GetPADocLocDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEmpType', (req, res) => {
    mapper(dbSchema.GetEmpType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEquipmentDet', (req, res) => {
    mapper(dbSchema.GetEquipmentDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDefEquipmentDet', (req, res) => {
    mapper(dbSchema.GetDefEquipmentDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVisitDashBoardDayWise', (req, res) => {
    mapper(dbSchema.getVisitDashBoardDayWise, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdImage', (req, res) => {
    mapper(dbSchema.InsUpdImage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/CheckCredentials', (req, res) => {
    mapper(dbSchema.CheckCredentials, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GETUserinfo', (req, res) => {
    mapper(dbSchema.GETUserinfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdUserLogin', (req, res) => {
    mapper(dbSchema.InsUpdUserLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChkUserLogin', (req, res) => {
    mapper(dbSchema.GetChkUserLogin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChkUmrNo', (req, res) => {
    mapper(dbSchema.GetChkUmrNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLogEmail', (req, res) => {
    mapper(dbSchema.GetLogEmail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdpatRsrcFav', (req, res) => {
    mapper(dbSchema.InsUpdpatRsrcFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSrchUHR', (req, res) => {
    mapper(dbSchema.GetPatSrchUHR, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSrchUMR', (req, res) => {
    mapper(dbSchema.GetPatSrchUMR, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetQuickAptSlotDetails', (req, res) => {
    mapper(dbSchema.GetQuickAptSlotDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatDetails', (req, res) => {
    mapper(dbSchema.GetPatDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatientMap', (req, res) => {
    mapper(dbSchema.InsupdPatientMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatientMap', (req, res) => {
    mapper(dbSchema.GetPatientMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelPatientMap', (req, res) => {
    mapper(dbSchema.DelPatientMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatSrchDtls', (req, res) => {
    mapper(dbSchema.getPatSrchDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUNOType', (req, res) => {
    mapper(dbSchema.getUNOType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdBallPlasty', (req, res) => {
    mapper(dbSchema.InsUpdBallPlasty, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCoGiography', (req, res) => {
    mapper(dbSchema.InsUpdCoGiography, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCabgCardioa', (req, res) => {
    mapper(dbSchema.InsUpdCabgCardioa, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCabgCardioa1', (req, res) => {
    mapper(dbSchema.InsUpdCabgCardioa1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPackageInftoin', (req, res) => {
    mapper(dbSchema.InsUpdPackageInftoin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNonCard', (req, res) => {
    mapper(dbSchema.InsUpdNonCard, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNonCard2', (req, res) => {
    mapper(dbSchema.InsUpdNonCard2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdNonCard3', (req, res) => {
    mapper(dbSchema.InsUpdNonCard3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOperNote1', (req, res) => {
    mapper(dbSchema.InsUpdOperNote1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOperNote2', (req, res) => {
    mapper(dbSchema.InsUpdOperNote2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOperAppr1', (req, res) => {
    mapper(dbSchema.InsUpdOperAppr1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOperAppr2', (req, res) => {
    mapper(dbSchema.InsUpdOperAppr2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRiskFact1', (req, res) => {
    mapper(dbSchema.InsUpdRiskFact1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRiskFact2', (req, res) => {
    mapper(dbSchema.InsUpdRiskFact2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRiskFact3', (req, res) => {
    mapper(dbSchema.InsUpdRiskFact3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiCardiac', (req, res) => {
    mapper(dbSchema.getApiCardiac, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updPatHealthCheckup', (req, res) => {
    mapper(dbSchema.updPatHealthCheckup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHealthTips', (req, res) => {
    mapper(dbSchema.getHealthTips, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiDataAsJson', (req, res) => {
    mapper(dbSchema.getApiDataAsJson, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiDataCamp', (req, res) => {
    mapper(dbSchema.getApiDataCamp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiEnt', (req, res) => {
    mapper(dbSchema.getApiEnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/postApiData', (req, res) => {
    mapper(dbSchema.postApiData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/postApiArrData', (req, res) => {
    mapper(dbSchema.postApiArrData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/postApiDataOpt', (req, res) => {
    mapper(dbSchema.postApiDataOpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiDataSrvc', (req, res) => {
    mapper(dbSchema.getApiDataSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsExlIntgrtion', (req, res) => {
    mapper(dbSchema.InsExlIntgrtion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdorpPediatric1', (req, res) => {
    mapper(dbSchema.InsUpdorpPediatric1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdorpPediatric2', (req, res) => {
    mapper(dbSchema.InsUpdorpPediatric2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdorpPediatric3', (req, res) => {
    mapper(dbSchema.InsUpdorpPediatric3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdorpPediatric4', (req, res) => {
    mapper(dbSchema.InsUpdorpPediatric4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrpbackpain', (req, res) => {
    mapper(dbSchema.InsUpdOrpbackpain, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrpbackpain2', (req, res) => {
    mapper(dbSchema.InsUpdOrpbackpain2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO1', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO1SUB1', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO1SUB1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO2', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO2SUB1', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO2SUB1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO3', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO3SUB1', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO3SUB1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrpgenorto4', (req, res) => {
    mapper(dbSchema.InsUpdOrpgenorto4, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdORPGENORTHO4SUB1', (req, res) => {
    mapper(dbSchema.InsUpdORPGENORTHO4SUB1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrpHeadache1', (req, res) => {
    mapper(dbSchema.InsUpdOrpHeadache1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrpHeadache2', (req, res) => {
    mapper(dbSchema.InsUpdOrpHeadache2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdneckPain1', (req, res) => {
    mapper(dbSchema.InsUpdneckPain1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdneckPain2', (req, res) => {
    mapper(dbSchema.InsUpdneckPain2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiOrtho', (req, res) => {
    mapper(dbSchema.getApiOrtho, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/**
 * This is very special method
 */
router.post('/postWebMethods', async (req, res) => {
    try {
        let params = req.body;

        const methodType = params && params.methodType ? params.methodType : 'GET'

        if (!(params.postUri && (params.postUri.charAt(params.postUri.length - 1) === '/'))) {
            params.postUri = params.postUri + "/";
        }
        req.reqTime = Date.now();
        // console.log("params", params)
        if (!((methodType === "POST" || methodType === "GET") && params.postUri))
            return res.status(400).send("Invalid Request Type or Invalid post url");

        let data;
        //  console.log("method", methodType)
        if (methodType === "POST") {
            data = await axios.post(`${params.postUri}${params.method}`, params.inpParams);
        }
        else if (methodType === "GET") {
            data = await axios.get(`${params.postUri}${params.method}?${params.inpParams}`);
        }
        req.respTime = Date.now();
        // console.log("postWebDiff", (req.respTime - req.reqTime));
        if (params.type && params.type == "SR") {
            let _hisData = [];
            try {
                _hisData = util.xml2JSON(data, 'string').data;
            }
            catch (e) {
                console.log("hisDataError", e)
            }

            var output = "";
            var _billNo = params.billNo;
            var _preparedData = await smartReportGenerator.prepareJson(_hisData, {}, _billNo);
            if (_preparedData && _preparedData.length > 0) {
                try {
                    output = await smartReportGenerator.generatePagePdf(_hisData, _preparedData);
                    return res.status(200).json({ messege: "SUCCESS", path: output, description: "" });
                }
                catch (e) {
                    return res.status(400).json({ messege: "FAIL", error: e, description: "" });
                }
            }
            else {
                return res.status(200).json({ messege: "SUCCESS", path: "", description: "No Permission to view this Test.." });
            }
            //return res.status(200).json({ messege: "SUCCESS", path: _hisData });
        }
        else {
            if (params.method === "getManualSyncData") {
                if (data.indexOf('>[') > -1) {
                    //console.log("data----getManualSyncData",data);
                    data = data.substring((data.indexOf('>[') + 1), data.length - 9);
                    if (data && data.length > 0) {
                        data = JSON.parse(data);
                        //console.log("parse----getManualSyncData",data);
                        const _params = data && data[0] ? data[0] : {};
                        const _method = data[0].EVENT_ID || null;
                        const cParams = { ...req.cParams, URL: "getManualSyncData" };
                        if (_method && data) {
                            mapper(dbSchema[_method], generateParams(_params, cParams), req.cParams).then((response) => {
                                //console.log("response----getManualSyncData",response);
                                return res.json(responseChange(response, req.cParams));
                            }).catch((error) => {
                                return res.status(400).send(error);
                            });
                        } else return res.json(data);
                    } else return res.json(data);
                } else return res.json(data);
            }
            else return res.json(data);
        }
    }
    catch (ex) {
        // return res.status(400).send(JSON.stringify(ex));
        return res.status(400).send(ex);
    }
});
router.post('/postWebMethods_t1', async (req, res) => {
    try {

        let params = req.body;

        const methodType = params && params.methodType ? params.methodType : 'GET'
        //console.log("params",params);
        if (!(params.postUri && (params.postUri.charAt(params.postUri.length - 1) === '/'))) {
            params.postUri = params.postUri + "/";
        }

        if (!((methodType === "POST" || methodType === "GET") && params.postUri))
            return res.status(400).send("Invalid Request Type or Invalid post url");

        let response = ""
        if (methodType === "POST") {

            response = await axios.post(`${params.postUri}${params.method}`, params.inpParams);
        }
        else if (methodType === "GET") {

            //console.log(params.postUri,params.method,params.inpParams);
            response = await axios.get(`${params.postUri}${params.method}?${params.inpParams}`);
            //console.log("response",response);
        }
        //console.log("response-postWebMethods_t1",response);
        let data = util.xml2JSON(response, 'string').data;



        let _temp = [];
        let _ignoreList = ["ULS", "MRI", "RAD", "CTS", "XRY", "CAR"];

        _.each(data, function (eitem, index) {
            // if(eitem.PARAMETERCD == 'LPR1486')
            if (_ignoreList.indexOf(eitem.SERVICEGROUPCD) > -1) {
                _temp.push(eitem);
            }
            else {
                if (eitem.ISVERIFIED.toUpperCase() == 'Y' || req.body.LOC_ID == 1246) {
                    _temp.push(eitem);
                }
            }
        });

        data = _temp;

        let orglevelParams = orgParams(req.body.LOC_ID);

        let _scrollColumn = [];
        let _maxDays = 3;
        let _checkIndex = 0;
        let _parentCindex = 0;
        let _prepareHeaderRows = [];
        let _availDays = [];
        let _prepareDefaultRows = [];
        let _colors = ["#eec8ff", "#00ff00", "#ffff00", "#ff00ff", "#f7f7f7", "#0000ff"];

        let _finalData = [];
        let result = "";

        for (let i in orglevelParams) {
            result = data.filter(e => e.PARAMETERCD == orglevelParams[i].PARAMETERCD);
            _finalData = _finalData.concat(result);

        }
        data = _finalData;
        for (let dta in data) {
            data[dta].epochDate = moment(moment(parseInt(data[dta].REPORTDT.split('(')[1].split(')')[0])).format(), 'YYYY-MM-DD').valueOf();
        }
        data = _.sortBy(data, 'epochDate')
        data = data.reverse()

        //create EPOCH date to "CHART_DATE  
        _.each(data, function (item, index) {
            item.__CHART_DATE_EPOCH = moment(moment(parseInt(data[index].REPORTDT.split('(')[1].split(')')[0])).format(), 'YYYY-MM-DD').valueOf();
        });
        // data=_sortBy(data,function(item){
        // return item.__CHART_DATE_EPOCH
        // });

        // data=_.sortBy(data,function(item){
        // return -item.__CHART_DATE_EPOCH
        // })
        var inc = 0;
        var x = _.groupBy(data, "__CHART_DATE_EPOCH");

        _.each(_.groupBy(data, "__CHART_DATE_EPOCH"), function (item, index) {
            _.chain(_.sortBy((_.chain(item).map(function (eitem) {
                //console.log("x---------------------", x);
                return eitem.__CHART_DATE_EPOCH;
            }).uniq().value()))).each(function (eItem, myindex) {
                _prepareDefaultRows.push(
                    {
                        dateTime: item[0].__CHART_DATE_EPOCH,
                        value: "",
                        color: "",//_colors[inc]
                    }
                );
            });
            _availDays.push(index);
            inc++;
        });
        data = _.groupBy(data, function (item) {
            return item.PARAMETERDESC;
        });
        _.each(data, function (value, key) {
            data[key] = _.groupBy(value, function (item) {
                return item.PARAMETERDESC;
            });
        });

        _.each(data, function (value, index) {
            // _scrollColumn.push({
            //     columnType: "header",
            //     label: index,
            //     value: ""
            // });
            _parentCindex = _scrollColumn.length - 1;
            _.each(value, function (hederValue, headerIndex) {
                _scrollColumn.push({
                    columnType: "data",
                    label: index,
                    value: JSON.parse(JSON.stringify(_prepareDefaultRows))
                });
                _checkIndex = 0;

                _.each(hederValue, function (eDate, eIndex) {
                    _.where(_scrollColumn[_scrollColumn.length - 1].value,
                        { dateTime: eDate.__CHART_DATE_EPOCH })[0].value = _.clone(eDate.RESULTS) || _.clone(eDate.RESULTVALUES);
                    _.where(_scrollColumn[_scrollColumn.length - 1].value,
                        { dateTime: eDate.__CHART_DATE_EPOCH })[0].color = (eDate.DEVIATETYPE == "UPPER ABNORMAL") ? "#f44336" : (eDate.DEVIATETYPE == "LOWER ABNORMAL") ? "#2196f3" : (eDate.DEVIATETYPE == "NORMAL") ? "#4caf50" : "";
                    let mesurements = eDate.RESULTUOM ? ` (${eDate.RESULTUOM})` : "";
                    _scrollColumn[_scrollColumn.length - 1].label = `${eDate.PARAMETERDESC}${mesurements}`;
                });
                _checkIndex++;
            });
        });

        return res.json(_scrollColumn);

    }
    catch (ex) {
        return res.status(400).send(ex);
    }
});





router.post('/InsUpBmrCalc', (req, res) => {
    mapper(dbSchema.InsUpBmrCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpChildWtChartCalc', (req, res) => {
    mapper(dbSchema.InsUpChildWtChartCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpBloodCalc', (req, res) => {
    mapper(dbSchema.InsUpBloodCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpBloodCompatbleCalc', (req, res) => {
    mapper(dbSchema.InsUpBloodCompatbleCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpmensCalc', (req, res) => {
    mapper(dbSchema.InsUpmensCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpLifeStyleDetCalc', (req, res) => {
    mapper(dbSchema.InsUpLifeStyleDetCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpBloodAlcoholCalc', (req, res) => {
    mapper(dbSchema.InsUpBloodAlcoholCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpApgorescoreCalc', (req, res) => {
    mapper(dbSchema.InsUpApgorescoreCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpEstimateCalc', (req, res) => {
    mapper(dbSchema.InsUpEstimateCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetWtMgmtCalc', (req, res) => {
    mapper(dbSchema.GetWtMgmtCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBodyMassCalc', (req, res) => {
    mapper(dbSchema.GetBodyMassCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBodyFatDetailsCal', (req, res) => {
    mapper(dbSchema.GetBodyFatDetailsCal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetWaistTohipratioCalc', (req, res) => {
    mapper(dbSchema.GetWaistTohipratioCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBdSurfaceAreaCalc', (req, res) => {
    mapper(dbSchema.GetBdSurfaceAreaCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIdealWeightCalc', (req, res) => {
    mapper(dbSchema.GetIdealWeightCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDietryMgmtCalc', (req, res) => {
    mapper(dbSchema.GetDietryMgmtCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecomCaloreCalc', (req, res) => {
    mapper(dbSchema.GetRecomCaloreCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecommendedFatCals', (req, res) => {
    mapper(dbSchema.GetRecommendedFatCals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetWatrRqmntCalc', (req, res) => {
    mapper(dbSchema.GetWatrRqmntCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFitnessCal', (req, res) => {
    mapper(dbSchema.GetFitnessCal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetActivityCalc', (req, res) => {
    mapper(dbSchema.GetActivityCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBmrCalc', (req, res) => {
    mapper(dbSchema.GetBmrCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLeanBdyMassCalc', (req, res) => {
    mapper(dbSchema.GetLeanBdyMassCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChildrnsCalc', (req, res) => {
    mapper(dbSchema.GetChildrnsCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetApgoreCalc', (req, res) => {
    mapper(dbSchema.GetApgoreCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChildWtChrtCalc', (req, res) => {
    mapper(dbSchema.GetChildWtChrtCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetHtPredctnCalc', (req, res) => {
    mapper(dbSchema.GetHtPredctnCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBloodMgmtCalc', (req, res) => {
    mapper(dbSchema.GetBloodMgmtCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBldAlchlCalc', (req, res) => {
    mapper(dbSchema.GetBldAlchlCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBldCalc', (req, res) => {
    mapper(dbSchema.GetBldCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBldCmptbltyCalc', (req, res) => {
    mapper(dbSchema.GetBldCmptbltyCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMensCalc', (req, res) => {
    mapper(dbSchema.GetMensCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLyfStlylCalc', (req, res) => {
    mapper(dbSchema.GetLyfStlylCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDietryCal', (req, res) => {
    mapper(dbSchema.GetDietryCal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetBloodGroup', (req, res) => {
    mapper(dbSchema.GetBloodGroup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUOM', (req, res) => {
    mapper(dbSchema.GetUOM, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFdCtgry', (req, res) => {
    mapper(dbSchema.GetFdCtgry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFdItems', (req, res) => {
    mapper(dbSchema.GetFdItems, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFdSubCtgry', (req, res) => {
    mapper(dbSchema.GetFdSubCtgry, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPaymentHist', (req, res) => {
    mapper(dbSchema.GetPaymentHist, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUserPreferences', (req, res) => {
    mapper(dbSchema.InsUserPreferences, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdBodyMassCalc', (req, res) => {
    mapper(dbSchema.InsUpdBodyMassCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdBodySrfAreaCalc', (req, res) => {
    mapper(dbSchema.InsUpdBodySrfAreaCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdIdealWtCalc', (req, res) => {
    mapper(dbSchema.InsUpdIdealWtCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdWaistToHipRatioCalc', (req, res) => {
    mapper(dbSchema.InsUpdWaistToHipRatioCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRecomCaloreCalc', (req, res) => {
    mapper(dbSchema.InsRecomCaloreCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpDietaryClac', (req, res) => {
    mapper(dbSchema.InsUpDietaryClac, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpBodyfatDetails', (req, res) => {
    mapper(dbSchema.InsUpBodyfatDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpRecomendedFatCalc', (req, res) => {
    mapper(dbSchema.InsUpRecomendedFatCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpWaterReqmentCalc', (req, res) => {
    mapper(dbSchema.InsUpWaterReqmentCalc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpActivityCal', (req, res) => {
    mapper(dbSchema.InsUpActivityCal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpLeanboyMasscal', (req, res) => {
    mapper(dbSchema.InsUpLeanboyMasscal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpSpecDocSrv', (req, res) => {
    mapper(dbSchema.InsUpSpecDocSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecDocSrv', (req, res) => {
    mapper(dbSchema.GetSpecDocSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUprsrcAvlblty', (req, res) => {
    mapper(dbSchema.InUprsrcAvlblty, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetReasonForVisit', (req, res) => {
    mapper(dbSchema.GetReasonForVisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecByOrg', (req, res) => {
    mapper(dbSchema.GetSpecByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecByLoc', (req, res) => {
    mapper(dbSchema.GetSpecByLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatConsDet', (req, res) => {
    mapper(dbSchema.GetPatConsDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCatgryWiseDAmtRep', (req, res) => {
    mapper(dbSchema.GetCatgryWiseDAmtRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetShiftAmt', (req, res) => {
    mapper(dbSchema.GetShiftAmt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetspcByLoc', (req, res) => {
    mapper(dbSchema.GetspcByLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecialities', (req, res) => {
    mapper(dbSchema.GetSpecialities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllAutoDoctors', (req, res) => {
    mapper(dbSchema.GetAllAutoDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllDoctorSlotsBySpecialityID', (req, res) => {
    mapper(dbSchema.GetAllDoctorSlotsBySpecialityID, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpd', (req, res) => {
    mapper(dbSchema.InsUpd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllDoctorDetailsByDocID', (req, res) => {
    mapper(dbSchema.GetAllDoctorDetailsByDocID, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdQuickAppointment', (req, res) => {
    mapper(dbSchema.InsUpdQuickAppointment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ChangeSlot', (req, res) => {
    mapper(dbSchema.ChangeSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AptReqStatus', (req, res) => {
    mapper(dbSchema.AptReqStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AptBookMsg', (req, res) => {
    mapper(dbSchema.AptBookMsg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCommMsgTypes', (req, res) => {
    mapper(dbSchema.GetCommMsgTypes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetComMsgReg', (req, res) => {
    mapper(dbSchema.GetComMsgReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelCancelByOffice', (req, res) => {
    mapper(dbSchema.DelCancelByOffice, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsQgeneration', (req, res) => {
    mapper(dbSchema.InsQgeneration, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsCheckIn_Out', (req, res) => {
    mapper(dbSchema.InsCheckIn_Out, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/ChangeQno', (req, res) => {
    mapper(dbSchema.ChangeQno, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAptsumary', (req, res) => {
    mapper(dbSchema.GetAptsumary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMonViewCount', (req, res) => {
    mapper(dbSchema.GetMonViewCount, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatPaymentDet', (req, res) => {
    mapper(dbSchema.PatPaymentDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcMonthView', (req, res) => {
    mapper(dbSchema.GetRsrcMonthView, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatDdChequeCashDet', (req, res) => {
    mapper(dbSchema.PatDdChequeCashDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPaLocDocSlotStatus', (req, res) => {
    mapper(dbSchema.GetPaLocDocSlotStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChkRevst', (req, res) => {
    mapper(dbSchema.GetChkRevst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetApmntType', (req, res) => {
    mapper(dbSchema.GetApmntType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetConsultType', (req, res) => {
    mapper(dbSchema.GetConsultType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetApmntDetRpts', (req, res) => {
    mapper(dbSchema.GetApmntDetRpts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDropReqst', (req, res) => {
    mapper(dbSchema.InsUpdDropReqst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRqstApmnt', (req, res) => {
    mapper(dbSchema.GetRqstApmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUprPayReq1', (req, res) => {
    mapper(dbSchema.InsUprPayReq1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPayReq', (req, res) => {
    mapper(dbSchema.GetPayReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InspaymentReq2', (req, res) => {
    mapper(dbSchema.InspaymentReq2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPayReq2', (req, res) => {
    mapper(dbSchema.GetPayReq2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Inspayrespnce1', (req, res) => {
    mapper(dbSchema.Inspayrespnce1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Getpayrespnce1', (req, res) => {
    mapper(dbSchema.Getpayrespnce1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Inspayrespnce2', (req, res) => {
    mapper(dbSchema.Inspayrespnce2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Getpayrespnce2', (req, res) => {
    mapper(dbSchema.Getpayrespnce2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOrgCityLoc', (req, res) => {
    mapper(dbSchema.GetOrgCityLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdOrgBank', (req, res) => {
    mapper(dbSchema.insupdOrgBank, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOrgbankmap', (req, res) => {
    mapper(dbSchema.GetOrgbankmap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Getauthfortran', (req, res) => {
    mapper(dbSchema.Getauthfortran, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdAuthrzation', (req, res) => {
    mapper(dbSchema.insupdAuthrzation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAuthrization', (req, res) => {
    mapper(dbSchema.GetAuthrization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetctyLocs', (req, res) => {
    mapper(dbSchema.GetctyLocs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdApiTrack', (req, res) => {
    mapper(dbSchema.insupdApiTrack, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/HoldSlot', (req, res) => {
    mapper(dbSchema.HoldSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdMergeSlot', (req, res) => {
    mapper(dbSchema.UpdMergeSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insupdpatrsrFav', (req, res) => {
    mapper(dbSchema.insupdpatrsrFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcLocMnthView', (req, res) => {
    mapper(dbSchema.GetRsrcLocMnthView, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpRevistSlot', (req, res) => {
    mapper(dbSchema.InsUpRevistSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComMsgRq', (req, res) => {
    mapper(dbSchema.getComMsgRq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updComMsgRq', (req, res) => {
    mapper(dbSchema.updComMsgRq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getComMsgVoice', (req, res) => {
    mapper(dbSchema.getComMsgVoice, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdComMsgVoice', (req, res) => {
    mapper(dbSchema.UpdComMsgVoice, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdComMsgOrgLocMap', (req, res) => {
    mapper(dbSchema.UpdComMsgOrgLocMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDrpqstSlot', (req, res) => {
    mapper(dbSchema.InsUpdDrpqstSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatRelMap', (req, res) => {
    mapper(dbSchema.InsUpdPatRelMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsPatiRsrcFav', (req, res) => {
    mapper(dbSchema.InsPatiRsrcFav, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetService', (req, res) => {
    mapper(dbSchema.GetService, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetServices', (req, res) => {
    mapper(dbSchema.GetServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetServicesByLoc', (req, res) => {
    mapper(dbSchema.GetServicesByLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetServicesByOrg', (req, res) => {
    mapper(dbSchema.GetServicesByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdService', (req, res) => {
    mapper(dbSchema.InsUpdService, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDoctorFee', (req, res) => {
    mapper(dbSchema.GetDoctorFee, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetServicePrice', (req, res) => {
    mapper(dbSchema.GetServicePrice, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Service_Price_Config', (req, res) => {
    mapper(dbSchema.Service_Price_Config, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdCnsltRoom', (req, res) => {
    mapper(dbSchema.InsupdCnsltRoom, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getprofileCompDet', (req, res) => {
    mapper(dbSchema.getprofileCompDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdLabOutRes', (req, res) => {
    mapper(dbSchema.InsUpdLabOutRes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdQuestnMastr', (req, res) => {
    mapper(dbSchema.insUpdQuestnMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAddQuestion', (req, res) => {
    mapper(dbSchema.InsUpdAddQuestion, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdquesTempMap', (req, res) => {
    mapper(dbSchema.InsUpdquesTempMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpQTemplate', (req, res) => {
    mapper(dbSchema.InsUpQTemplate, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRecursiveAppt', (req, res) => {
    mapper(dbSchema.InsRecursiveAppt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFormat', (req, res) => {
    mapper(dbSchema.InsUpdFormat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFormatDet', (req, res) => {
    mapper(dbSchema.InsUpdFormatDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFormatMap', (req, res) => {
    mapper(dbSchema.InsUpdFormatMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatSum', (req, res) => {
    mapper(dbSchema.InsUpdPatSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDschrgSum', (req, res) => {
    mapper(dbSchema.InsUpdDschrgSum, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDschrgInvest', (req, res) => {
    mapper(dbSchema.InsUpdDschrgInvest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDschrgMedi', (req, res) => {
    mapper(dbSchema.InsUpdDschrgMedi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsBilling', (req, res) => {
    mapper(dbSchema.InsBilling, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsBillSrv', (req, res) => {
    mapper(dbSchema.InsBillSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getGridViewConfig', (req, res) => {
    mapper(dbSchema.getGridViewConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdSrvSyn', (req, res) => {
    mapper(dbSchema.InsUpdSrvSyn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsAddCart', (req, res) => {
    mapper(dbSchema.InsAddCart, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsOrderItem', (req, res) => {
    mapper(dbSchema.InsOrderItem, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdSrvAddlInfo', (req, res) => {
    mapper(dbSchema.UpdSrvAddlInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/logClientError', (req, res) => {
    mapper(dbSchema.logClientError, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdResourceAvail', (req, res) => {
    mapper(dbSchema.UpdResourceAvail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdQmsMig', (req, res) => {
    mapper(dbSchema.InsUpdQmsMig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getQmsTvMig', (req, res) => {
    mapper(dbSchema.getQmsTvMig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEye', (req, res) => {
    mapper(dbSchema.InsUpdEye, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEye2', (req, res) => {
    mapper(dbSchema.InsUpdEye2, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpeyeExam', (req, res) => {
    mapper(dbSchema.InUpeyeExam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEye3', (req, res) => {
    mapper(dbSchema.InsUpdEye3, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdEye3CA', (req, res) => {
    mapper(dbSchema.InsUpdEye3CA, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdFootInf', (req, res) => {
    mapper(dbSchema.InsUpdFootInf, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Diabetic', (req, res) => {
    mapper(dbSchema.Diabetic, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/sendSMS', (req, res) => {
    mapper(dbSchema.sendSMS, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insSmsEmail', (req, res) => {
    mapper(dbSchema.insSmsEmail, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insApiLog', (req, res) => {
    mapper(dbSchema.insApiLog, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetParamGrp', (req, res) => {
    mapper(dbSchema.GetParamGrp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPkgSrvc', (req, res) => {
    mapper(dbSchema.GetPkgSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvcDet', (req, res) => {
    mapper(dbSchema.GetSrvcDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetsrvInstruction', (req, res) => {
    mapper(dbSchema.GetsrvInstruction, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupSrvInstruction', (req, res) => {
    mapper(dbSchema.InsupSrvInstruction, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupsrvcDet', (req, res) => {
    mapper(dbSchema.InsupsrvcDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupsrvcGroup', (req, res) => {
    mapper(dbSchema.InsupsrvcGroup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetsrvcGrp', (req, res) => {
    mapper(dbSchema.GetsrvcGrp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpserviceDet', (req, res) => {
    mapper(dbSchema.InUpserviceDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLookUpConfig', (req, res) => {
    mapper(dbSchema.getLookUpConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLookUpDetails', (req, res) => {
    //console.log("getlookupdetails",req.body);
    mapper(dbSchema.getLookUpDetails, req.body, req.cParams).then((response) => {
        //console.log("getlookupdetails-response",response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        //console.log("getlookupdetails-error",error);
        res.status(400).send(error);
    });
});

router.post('/getGridViewDetails', (req, res) => {

    //console.log("req.body",req.body);
    let startTime = new Date().getTime();

    mapper(dbSchema.getGridViewDetails, req.body, req.cParams).then((response) => {
        //console.log("req-start-time-getGridViewDetails",req.body.LOOKUP_QRY,startTime-new Date().getTime())
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsGridConfig', (req, res) => {
    mapper(dbSchema.InsGridConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdLkUpConfig', (req, res) => {
    mapper(dbSchema.InsUpdLkUpConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getApiData', (req, res) => {
    mapper(dbSchema.getApiData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUserOccpation', (req, res) => {
    mapper(dbSchema.getUserOccpation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insPatReg', (req, res) => {
    mapper(dbSchema.insPatReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetVldConsOlrFee', (req, res) => {
    mapper(dbSchema.GetVldConsOlrFee, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOlrPat', (req, res) => {
    mapper(dbSchema.GetOlrPat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpdSlotCnlSt', (req, res) => {
    mapper(dbSchema.InUpdSlotCnlSt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDocVst', (req, res) => {
    mapper(dbSchema.InsUpdDocVst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHltChkUp', (req, res) => {
    mapper(dbSchema.InsUpdHltChkUp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdHsptzation', (req, res) => {
    mapper(dbSchema.InsUpdHsptzation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMinorSurg', (req, res) => {
    mapper(dbSchema.InsUpdMinorSurg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatStag', (req, res) => {
    mapper(dbSchema.InsUpdPatStag, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdShrSubPatUsr', (req, res) => {
    mapper(dbSchema.InsUpdShrSubPatUsr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatPrefer', (req, res) => {
    mapper(dbSchema.InsUpdPatPrefer, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOrgLocations', (req, res) => {
    mapper(dbSchema.GetOrgLocations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpMapping', (req, res) => {
    mapper(dbSchema.InsUpMapping, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpOLRMap', (req, res) => {
    mapper(dbSchema.InsUpOLRMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelRsrcMap', (req, res) => {
    mapper(dbSchema.DelRsrcMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRsrcMap', (req, res) => {
    mapper(dbSchema.InsUpdRsrcMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdImageMap', (req, res) => {
    mapper(dbSchema.InsUpdImageMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRsrcImgMap', (req, res) => {
    mapper(dbSchema.InsRsrcImgMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsBodyImages', (req, res) => {
    mapper(dbSchema.InsBodyImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpddelBodyImage', (req, res) => {
    mapper(dbSchema.UpddelBodyImage, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMigRsrcDet', (req, res) => {
    mapper(dbSchema.InsUpdMigRsrcDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DeleteDoctor', (req, res) => {
    mapper(dbSchema.DeleteDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetModDoc', (req, res) => {
    mapper(dbSchema.GetModDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_User_Doc_Access', (req, res) => {
    mapper(dbSchema.Get_User_Doc_Access, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdRoleDoc', (req, res) => {
    mapper(dbSchema.InsUpdRoleDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpd_Module', (req, res) => {
    mapper(dbSchema.InsUpd_Module, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUserModuleDocAll', (req, res) => {
    mapper(dbSchema.GetUserModuleDocAll, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUserModules', (req, res) => {
    mapper(dbSchema.GetUserModules, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpd_Module_Doc', (req, res) => {
    mapper(dbSchema.InsUpd_Module_Doc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocByMod', (req, res) => {
    mapper(dbSchema.GetDocByMod, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDoctorScheduleSumm', (req, res) => {
    mapper(dbSchema.GetDoctorScheduleSumm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcByOrg', (req, res) => {
    mapper(dbSchema.GetRsrcByOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatient_Payment', (req, res) => {
    mapper(dbSchema.InsupdPatient_Payment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsPkgDdCheque', (req, res) => {
    mapper(dbSchema.InsPkgDdCheque, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSrvcAuto', (req, res) => {
    mapper(dbSchema.getSrvcAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPrntUsrdataMastr', (req, res) => {
    mapper(dbSchema.InsUpdPrntUsrdataMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdmnNoDtls', (req, res) => {
    mapper(dbSchema.InsUpdAdmnNoDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelERAdmnDtls', (req, res) => {
    mapper(dbSchema.DelERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatHistDocPerms', (req, res) => {
    mapper(dbSchema.InsupdPatHistDocPerms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdClincalPathwayEntInfo', (req, res) => {
    mapper(dbSchema.InsupdClincalPathwayEntInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAnteNatalPcs', (req, res) => {
    mapper(dbSchema.InsupdAnteNatalPcs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAnteNatalRecAbortns', (req, res) => {
    mapper(dbSchema.InsupdAnteNatalRecAbortns, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatTransDetlnInfo', (req, res) => {
    mapper(dbSchema.InsupdPatTransDetlnInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDroupReques', (req, res) => {
    mapper(dbSchema.InsupdDroupReques, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdAdmnDetlsKardex', (req, res) => {
    mapper(dbSchema.UpdAdmnDetlsKardex, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdMediReceivedDet', (req, res) => {
    mapper(dbSchema.InsupdMediReceivedDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdMediBilledInfo', (req, res) => {
    mapper(dbSchema.UpdMediBilledInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdPatSlotConfirmation', (req, res) => {
    mapper(dbSchema.UpdPatSlotConfirmation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdNotifiableDiseasesDet', (req, res) => {
    mapper(dbSchema.InsupdNotifiableDiseasesDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAutoCapturingDataInfo', (req, res) => {
    mapper(dbSchema.InsupdAutoCapturingDataInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdLvlHistDataInfo', (req, res) => {
    mapper(dbSchema.InsupdLvlHistDataInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdHospitalFormulatory', (req, res) => {
    mapper(dbSchema.InsupdHospitalFormulatory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatRequests', (req, res) => {
    mapper(dbSchema.InsupdPatRequests, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOrgLocIPDet', (req, res) => {
    mapper(dbSchema.InsUpdOrgLocIPDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdNurCarePlanInfo', (req, res) => {
    mapper(dbSchema.InsupdNurCarePlanInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdOrgRegisration', (req, res) => {
    mapper(dbSchema.insUpdOrgRegisration, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDeficyChklstInfoXML', (req, res) => {
    mapper(dbSchema.InsupdDeficyChklstInfoXML, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdNurCpMaster', (req, res) => {
    mapper(dbSchema.InsupdNurCpMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprupdAdi', (req, res) => {
    mapper(dbSchema.UprupdAdi, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdMLC', (req, res) => {
    mapper(dbSchema.InsUpdMLC, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdMasterTableInfo', (req, res) => {
    mapper(dbSchema.InsupdMasterTableInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAdtPatientClinicalFlags', (req, res) => {
    mapper(dbSchema.InsupdAdtPatientClinicalFlags, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdDschrgChkLst', (req, res) => {
    mapper(dbSchema.InsupdDschrgChkLst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPostOperetiveSurgnOrds', (req, res) => {
    mapper(dbSchema.InsupdPostOperetiveSurgnOrds, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdIpFormTypePrintInfo', (req, res) => {
    mapper(dbSchema.UpdIpFormTypePrintInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprDelClinicalPathInfo', (req, res) => {
    mapper(dbSchema.UprDelClinicalPathInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprDelIPOTSurgicalSrvc', (req, res) => {
    mapper(dbSchema.UprDelIPOTSurgicalSrvc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdMedBilledInfo', (req, res) => {
    mapper(dbSchema.UprInsupdMedBilledInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpApacheScore', (req, res) => {
    mapper(dbSchema.InsupdIpApacheScore, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpServices', (req, res) => {
    mapper(dbSchema.InsupdIpServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdRecepeintDonorForm', (req, res) => {
    mapper(dbSchema.InsupdRecepeintDonorForm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatPreRegistration', (req, res) => {
    mapper(dbSchema.InsupdPatPreRegistration, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdComMsgReqTemplateStatus', (req, res) => {
    mapper(dbSchema.UpdComMsgReqTemplateStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/AdmnReqProcessInfo', (req, res) => {
    mapper(dbSchema.AdmnReqProcessInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdChildDevscnAssmntInfo', (req, res) => {
    mapper(dbSchema.InsupdChildDevscnAssmntInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcDetails', (req, res) => {
    mapper(dbSchema.GetRsrcDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDatesByOlr', (req, res) => {
    mapper(dbSchema.GetDatesByOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdErDschrgDisp', (req, res) => {
    mapper(dbSchema.UpdErDschrgDisp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetlocationsByDocId', (req, res) => {
    mapper(dbSchema.GetlocationsByDocId, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMethod', (req, res) => {
    mapper(dbSchema.getMethod, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocSlotDetails', (req, res) => {
    mapper(dbSchema.GetDocSlotDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCancelReason', (req, res) => {
    mapper(dbSchema.GetCancelReason, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatByOlr', (req, res) => {
    mapper(dbSchema.GetPatByOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDataNameSexDob', (req, res) => {
    mapper(dbSchema.GetDataNameSexDob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatApoinment', (req, res) => {
    mapper(dbSchema.GetPatApoinment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPrintFormUsrDataMstr', (req, res) => {
    mapper(dbSchema.getPrintFormUsrDataMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSlotDetails', (req, res) => {
    mapper(dbSchema.GetPatSlotDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOrgSpec', (req, res) => {
    mapper(dbSchema.getOrgSpec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvDet', (req, res) => {
    mapper(dbSchema.GetSrvDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSpecialInstruction', (req, res) => {
    mapper(dbSchema.GetSpecialInstruction, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllergies', (req, res) => {
    mapper(dbSchema.GetAllergies, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecomendations', (req, res) => {
    mapper(dbSchema.GetRecomendations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSlotDetailsNew', (req, res) => {
    mapper(dbSchema.GetPatSlotDetailsNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatHistPerms', (req, res) => {
    mapper(dbSchema.GetPatHistPerms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOPDTrendRep', (req, res) => {
    mapper(dbSchema.GetOPDTrendRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecommNew', (req, res) => {
    mapper(dbSchema.GetRecommNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOpemrReport', (req, res) => {
    mapper(dbSchema.GetOpemrReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpUsers', (req, res) => {
    mapper(dbSchema.GetIpUsers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChkRevisit', (req, res) => {
    mapper(dbSchema.GetChkRevisit, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAnteNatalPcs', (req, res) => {
    mapper(dbSchema.GetAnteNatalPcs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAnteNatalRecAbortns', (req, res) => {
    mapper(dbSchema.GetAnteNatalRecAbortns, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetErReport', (req, res) => {
    mapper(dbSchema.GetErReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatTransDetlnInfo', (req, res) => {
    mapper(dbSchema.GetPatTransDetlnInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllHisCal', (req, res) => {
    mapper(dbSchema.getAllHisCal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMediBilledInfo', (req, res) => {
    mapper(dbSchema.GetMediBilledInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSmsTinyUrlInfo', (req, res) => {
    mapper(dbSchema.GetSmsTinyUrlInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatSlotConfirmation', (req, res) => {
    mapper(dbSchema.GetPatSlotConfirmation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUmrNoCheck', (req, res) => {
    mapper(dbSchema.GetUmrNoCheck, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAutoCapturingDataInfo', (req, res) => {
    mapper(dbSchema.GetAutoCapturingDataInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPageLvlHistDataInfo', (req, res) => {
    mapper(dbSchema.GetPageLvlHistDataInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetHospitalFormulatory', (req, res) => {
    mapper(dbSchema.GetHospitalFormulatory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatientRequests', (req, res) => {
    mapper(dbSchema.GetPatientRequests, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOrgLocIPDet', (req, res) => {
    mapper(dbSchema.GetOrgLocIPDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDeficiencyChklstInfo', (req, res) => {
    mapper(dbSchema.GetDeficiencyChklstInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNurCpMaster', (req, res) => {
    mapper(dbSchema.GetNurCpMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMLC', (req, res) => {
    mapper(dbSchema.getMLC, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getNurCarePlanInfo', (req, res) => {
    mapper(dbSchema.getNurCarePlanInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMasterTablesData', (req, res) => {
    mapper(dbSchema.GetMasterTablesData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMasterTablesInfo', (req, res) => {
    mapper(dbSchema.GetMasterTablesInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetProfileDataByid', (req, res) => {
    mapper(dbSchema.GetProfileDataByid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAllDocumentsList', (req, res) => {
    mapper(dbSchema.GetAllDocumentsList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFavCptPcsIcd', (req, res) => {
    mapper(dbSchema.GetDocFavCptPcsIcd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPatientFBDet', (req, res) => {
    mapper(dbSchema.GetPatientFBDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetComMsgReqType', (req, res) => {
    mapper(dbSchema.GetComMsgReqType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDschrgChkLst', (req, res) => {
    mapper(dbSchema.GetDschrgChkLst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPostOperatvSurgnnOrds', (req, res) => {
    mapper(dbSchema.GetPostOperatvSurgnnOrds, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRosPatSysExam', (req, res) => {
    mapper(dbSchema.getRosPatSysExam, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpFormTypePrintInfo', (req, res) => {
    mapper(dbSchema.GetIpFormTypePrintInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMewScor', (req, res) => {
    mapper(dbSchema.GetMewScor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOrgDet', (req, res) => {
    mapper(dbSchema.GetOrgDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIPOPRefLetter', (req, res) => {
    mapper(dbSchema.GetIPOPRefLetter, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMedicationSugg', (req, res) => {
    mapper(dbSchema.GetMedicationSugg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRelationType', (req, res) => {
    mapper(dbSchema.GetRelationType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInvsSugg', (req, res) => {
    mapper(dbSchema.GetInvsSugg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpERReport', (req, res) => {
    mapper(dbSchema.GetIpERReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpApacheScore', (req, res) => {
    mapper(dbSchema.GetIpApacheScore, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRecepientDonorForm', (req, res) => {
    mapper(dbSchema.GetRecepientDonorForm, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatOTP', (req, res) => {
    mapper(dbSchema.getPatOTP, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatPreReg', (req, res) => {
    mapper(dbSchema.getPatPreReg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDisClinicData', (req, res) => {
    mapper(dbSchema.GetDisClinicData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDailyColectionReport', (req, res) => {
    mapper(dbSchema.GetDailyColectionReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetCrossReferalRep', (req, res) => {
    mapper(dbSchema.GetCrossReferalRep, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getStitemStockPoints', (req, res) => {
    mapper(dbSchema.getStitemStockPoints, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmissionReuisitionReport', (req, res) => {
    mapper(dbSchema.getAdmissionReuisitionReport, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFormPrintInfo', (req, res) => {
    mapper(dbSchema.GetFormPrintInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEntityDevScrngAssmnt', (req, res) => {
    mapper(dbSchema.GetEntityDevScrngAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmitinProcedureInfo', (req, res) => {
    mapper(dbSchema.getAdmitinProcedureInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDevScrngAssmnt', (req, res) => {
    mapper(dbSchema.getDevScrngAssmnt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormValidUsers', (req, res) => {
    mapper(dbSchema.getFormValidUsers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/InsUsrSession', (req, res) => {
    mapper(dbSchema.InsUsrSession, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDateNameDayMonth', (req, res) => {
    mapper(dbSchema.GetDateNameDayMonth, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDayMonthYear', (req, res) => {
    mapper(dbSchema.GetDayMonthYear, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DelRec', (req, res) => {
    mapper(dbSchema.DelRec, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_Organization', (req, res) => {
    mapper(dbSchema.Get_Organization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Ins_Upd_Org', (req, res) => {
    mapper(dbSchema.Ins_Upd_Org, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsXrefOrg', (req, res) => {
    mapper(dbSchema.InsXrefOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsXrefLoc', (req, res) => {
    mapper(dbSchema.InsXrefLoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsStateSelect', (req, res) => {
    mapper(dbSchema.InsStateSelect, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_Specialization', (req, res) => {
    mapper(dbSchema.Get_Specialization, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdSlot', (req, res) => {
    mapper(dbSchema.UpdSlot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/SkipQNo', (req, res) => {
    mapper(dbSchema.SkipQNo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Cancel_Slot', (req, res) => {
    mapper(dbSchema.Cancel_Slot, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetbankDetails', (req, res) => {
    mapper(dbSchema.GetbankDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsDiagnosis', (req, res) => {
    mapper(dbSchema.InsDiagnosis, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insertComplaintsMulti', (req, res) => {
    mapper(dbSchema.insertComplaintsMulti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsertInvestMulti', (req, res) => {
    mapper(dbSchema.InsertInvestMulti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSrvGroup', (req, res) => {
    mapper(dbSchema.GetSrvGroup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdconfigManager', (req, res) => {
    mapper(dbSchema.InsUpdconfigManager, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdPatVaccine', (req, res) => {
    mapper(dbSchema.InsUpdPatVaccine, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Create_Schedule', (req, res) => {
    mapper(dbSchema.Create_Schedule, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPADocLocSlotDetails', (req, res) => {
    mapper(dbSchema.GetPADocLocSlotDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcByref', (req, res) => {
    mapper(dbSchema.GetRsrcByref, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUsrLocOrg', (req, res) => {
    mapper(dbSchema.getUsrLocOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updSession', (req, res) => {
    mapper(dbSchema.updSession, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsappRelNotes', (req, res) => {
    mapper(dbSchema.InsappRelNotes, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsPcImages', (req, res) => {
    mapper(dbSchema.InsPcImages, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdModDoc', (req, res) => {
    mapper(dbSchema.InsUpdModDoc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdLockSts', (req, res) => {
    mapper(dbSchema.UpdLockSts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpd_Document', (req, res) => {
    mapper(dbSchema.InsUpd_Document, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpd_Role_Doc', (req, res) => {
    mapper(dbSchema.InsUpd_Role_Doc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Get_Org_Loc_Rsrc', (req, res) => {
    mapper(dbSchema.Get_Org_Loc_Rsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsVitalSigns', (req, res) => {
    mapper(dbSchema.InsVitalSigns, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insertAllergiesMulti', (req, res) => {
    mapper(dbSchema.insertAllergiesMulti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insertHeltConditinMulti', (req, res) => {
    mapper(dbSchema.insertHeltConditinMulti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insMedicationsMulti', (req, res) => {
    mapper(dbSchema.insMedicationsMulti, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetMedications', (req, res) => {
    mapper(dbSchema.GetMedications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAutoFavInvest', (req, res) => {
    mapper(dbSchema.GetAutoFavInvest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupddrugSrvMastr', (req, res) => {
    mapper(dbSchema.InsupddrugSrvMastr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetUserPreferences', (req, res) => {
    mapper(dbSchema.GetUserPreferences, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpDocHolyday', (req, res) => {
    mapper(dbSchema.InUpDocHolyday, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDochelps', (req, res) => {
    mapper(dbSchema.GetDochelps, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupDochelpIn', (req, res) => {
    mapper(dbSchema.InsupDochelpIn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPrfileSetupDet', (req, res) => {
    mapper(dbSchema.GetPrfileSetupDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdDschrgFormat', (req, res) => {
    mapper(dbSchema.InsUpdDschrgFormat, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSpecilizationAuto', (req, res) => {
    mapper(dbSchema.getSpecilizationAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsNotifications', (req, res) => {
    mapper(dbSchema.InsNotifications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/Diabetic1', (req, res) => {
    mapper(dbSchema.Diabetic1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdAdmnDischrgReq', (req, res) => {
    mapper(dbSchema.insUpdAdmnDischrgReq, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFaque', (req, res) => {
    mapper(dbSchema.GetFaque, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFrequencies', (req, res) => {
    mapper(dbSchema.GetFrequencies, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetSlotConsultation', (req, res) => {
    mapper(dbSchema.GetSlotConsultation, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetDocFavHealthCondtin', (req, res) => {
    mapper(dbSchema.GetDocFavHealthCondtin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InUpPatAdmission', (req, res) => {
    mapper(dbSchema.InUpPatAdmission, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsRecommendations', (req, res) => {
    mapper(dbSchema.InsRecommendations, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetHeltConditin', (req, res) => {
    mapper(dbSchema.GetHeltConditin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsCliniclDiet', (req, res) => {
    mapper(dbSchema.InsCliniclDiet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetClinicDet', (req, res) => {
    mapper(dbSchema.GetClinicDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdOtRequest', (req, res) => {
    mapper(dbSchema.InsupdOtRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdChildDentalHistory', (req, res) => {
    mapper(dbSchema.InsupdChildDentalHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatCompanyPolicy', (req, res) => {
    mapper(dbSchema.InsupdPatCompanyPolicy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpFormEntValue', (req, res) => {
    mapper(dbSchema.InsupdIpFormEntValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpFormChkList', (req, res) => {
    mapper(dbSchema.InsupdIpFormChkList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdTaperingDose', (req, res) => {
    mapper(dbSchema.InsupdTaperingDose, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdInsulin', (req, res) => {
    mapper(dbSchema.InsupdInsulin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChldDevScrnAssInfo', (req, res) => {
    mapper(dbSchema.getChldDevScrnAssInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOtSurgery', (req, res) => {
    mapper(dbSchema.GetOtSurgery, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOtTheatre', (req, res) => {
    mapper(dbSchema.GetOtTheatre, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOtRequest', (req, res) => {
    mapper(dbSchema.GetOtRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNotifiableDiseasesRpt', (req, res) => {
    mapper(dbSchema.GetNotifiableDiseasesRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetChildDentalHistory', (req, res) => {
    mapper(dbSchema.GetChildDentalHistory, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEventMapNew', (req, res) => {
    mapper(dbSchema.GetEventMapNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetFormEntityValue', (req, res) => {
    mapper(dbSchema.GetFormEntityValue, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpFormCheckList', (req, res) => {
    mapper(dbSchema.GetIpFormCheckList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getGridViewConfig', (req, res) => {
    mapper(dbSchema.getGridViewConfig, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getGridViewDetails', (req, res) => {
    mapper(dbSchema.getGridViewDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/DigProfile', (req, res) => {
    mapper(dbSchema.DigProfile, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetPrintFormpdf', (req, res) => {
    mapper(dbSchema.GetPrintFormpdf, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetOtSurgeryDtls', (req, res) => {
    mapper(dbSchema.GetOtSurgeryDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetTaperingDose', (req, res) => {
    mapper(dbSchema.GetTaperingDose, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetInsulin', (req, res) => {
    mapper(dbSchema.GetInsulin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetIpVisitDetails', (req, res) => {
    mapper(dbSchema.GetIpVisitDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdPagelvlHistoryData', (req, res) => {
    mapper(dbSchema.UpdPagelvlHistoryData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDropReqGrid', (req, res) => {
    mapper(dbSchema.getDropReqGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAcuteHeartFailure', (req, res) => {
    mapper(dbSchema.getAcuteHeartFailure, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPasBlngCntByOlr', (req, res) => {
    mapper(dbSchema.getPasBlngCntByOlr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotsByOlrPas', (req, res) => {
    mapper(dbSchema.getSlotsByOlrPas, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdCovid19', (req, res) => {
    mapper(dbSchema.InsupdCovid19, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCovid19Details', (req, res) => {
    mapper(dbSchema.getCovid19Details, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getHimsPatDtls', (req, res) => {
    mapper(dbSchema.getHimsPatDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdLabelTranInfo', (req, res) => {
    mapper(dbSchema.InsupdLabelTranInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdFormLableMap', (req, res) => {
    mapper(dbSchema.InsupdFormLableMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormLableMap', (req, res) => {
    mapper(dbSchema.getFormLableMap, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLableName', (req, res) => {
    mapper(dbSchema.getLableName, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getLabelTranInfo', (req, res) => {
    mapper(dbSchema.getLabelTranInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCovid19DetlsRpt', (req, res) => {
    mapper(dbSchema.getCovid19DetlsRpt, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdLableName', (req, res) => {
    mapper(dbSchema.InsupdLableName, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updMnulPayment', (req, res) => {
    mapper(dbSchema.updMnulPayment, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdVdSesn', (req, res) => {
    mapper(dbSchema.insUpdVdSesn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOpIpIndentStatus', (req, res) => {
    mapper(dbSchema.getOpIpIndentStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
function sendSms(patObj, cParams) {
    return new Promise((resolve, reject) => {
        const _patObj = JSON.parse(patObj.PATIEN_DETAILS);
        const message = "Dear " + _patObj.PATIENT_NAME + " you video consultion is ready to start with " + _patObj.DOCTOR_NAME + ", Plese click following link https://nvcapi.doctor9.com/patient/join/" + _patObj.SLOTS_ID + " - " + patObj.ORG_NAME;
        const smsParams = {
            REQ_TYPE_ID: 70,
            REFERENCE_ID: _patObj.PATIENT_ID,
            REFERENCE_TYPE_ID: 1,
            MOBILE: _patObj.MOBILE_NO,
            MOBILE_MSG: message,
            TYPE: 'M',
            IP_SESSION_ID: patObj.SESSION_ID
        };
        mapper(dbSchema.InsMsgVideoCons, smsParams, cParams).then((response) => {
            resolve(true);
        }).catch((error) => {
            resolve(false);
        });
    });
}

function getUpdTmDetails(params, cParams) {
    return new Promise((resolve, reject) => {
        mapper(dbSchema.teleMedMobile, params, cParams).then((response) => {
            resolve(response);
        }).catch((error) => {
            resolve(error);
        });
    });
}

/**
 * This was patch method for IP and OP video consultation
 */
const tmIpOp = {
    isSlot: (value) => {
        try {
            const numbers = /^[0-9]+$/;
            if (!value)
                return false;
            else if (numbers.test(value.toString()))
                return true;
            else
                return false;
        } catch (ex) {
            return false;
        }
    },
    updDocStat: (params, cParams) => {
        return new Promise((resolve, reject) => {
            const _params = {
                "VC_GUID": params.SLOT_ID,
                "TYPE": "SES_STRT"
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                if (response && response.length > 0 && (response = response[0])) {
                    const _resp = {
                        PATIEN_DETAILS: JSON.stringify({
                            PATIENT_NAME: response.PATIENT_NAME,
                            PATIENT_ID: response.PATIENT_ID,
                            MOBILE_NO: response.PAT_MOB || "",
                            DOCTOR_NAME: response.PRIMARY_DOC || "",
                            SLOTS_ID: response.VC_GUID
                        }),
                        SESSION_ID: response.SESSION_ID,
                        ORG_NAME: response.ORG_NAME
                    };
                    sendSms(_resp, cParams).then(success => {
                        resolve({
                            "statusCode": 200,
                            "status": "success"
                        });
                    }).catch(error => {
                        resolve({
                            "statusCode": 404,
                            "status": "error while sending SMS"
                        });
                    });
                }
                else {
                    resolve({
                        "statusCode": 404,
                        "status": "error while update status"
                    });
                }
            }).catch((error) => {
                resolve({
                    "statusCode": 404,
                    "status": "error while fetch Patient Details"
                });
            });
        });
    },
    getPatDetails: (params, cParams) => {
        return new Promise((resolve, reject) => {
            let resp = {
                "statusCode": "",
                "status": "",
                "appointmentTime": "",
                "appointmentWithDoctor": "",
                "openTokToken": "",
                "openTokSession": "",
                "orgKey": ""
            };
            const _params = {
                VC_GUID: params.SLOT_ID,
                TYPE: 'PAT_DTLS',
                VC_REQUEST_BY: params.REQUEST_BY ? params.REQUEST_BY : "PAT"
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                if (response && response.length && response.length > 0 && (response = response[0])) {
                    if (!response.VC_STATUS) response.VC_STATUS = "INITIATED";

                    resp.patientName = response.PATIENT_NAME;
                    resp.appointmentTime = response.VC_DATE;
                    resp.appointmentWithDoctor = response.PRIMARY_DOC;
                    resp.doctorNotes = response.VISIT_REMARKS || null;
                    resp.consent = response.VIDEO_CONSENT || null;
                    resp.orgKey = response.ORG_KEY ? response.ORG_KEY.toUpperCase() : "DOC9";

                    const date = new Date().setHours(0, 0, 0, 0);
                    const apmntTime = new Date(response.VC_DATE).setHours(0, 0, 0, 0);

                    if (date !== apmntTime) {
                        response.VC_STATUS = "COMPLETED";
                    }

                    if (response.VC_STATUS === "INITIATED") {
                        resp.statusCode = 102;
                        resp.status = "session was initiated";
                    }
                    else if (response.VC_STATUS === "STARTED") {
                        resp.statusCode = 200;
                        resp.status = "ready to start";
                        resp.openTokToken = response.VC_TOKEN;
                        resp.openTokSession = response.VC_SESSIONID;
                    }
                    else if (response.VC_STATUS === "COMPLETED") {
                        resp.statusCode = 410;
                        resp.status = "appointment was expired";
                    }
                }
                else {
                    resp.statusCode = 404;
                    resp.status = "Invalid unique key";
                }
                resolve(resp);
            }).catch((error) => {
                resolve({
                    "statusCode": 404,
                    "status": "error while fetch Patient Details"
                });
            });
        });
    },
    start: (params, uParams, cParams) => {
        return new Promise((resolve, reject) => {
            const _params = {
                "VC_GUID": params.SLOT_ID,
                "TYPE": "START",
                "VC_REQUEST_BY": uParams.type === 'doc' ? 'DOC' : 'PAT',
                "START_DATE": date.currentDate(),
                "JOIN_BY": params.JOIN_BY || ""
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                if (response && response.length > 0 && response[0].TM_DET_ID) {
                    resolve({
                        "statusCode": 200,
                        "status": "success",
                        "data": {
                            "TM_DET_ID": response[0].TM_DET_ID
                        }
                    });
                }
                else {
                    resolve({
                        "statusCode": 404,
                        "status": "not exist",
                        "data": null
                    });
                }
            }).catch(ex => {
                resolve({
                    "statusCode": 404,
                    "status": "error while fetch data",
                    "data": null
                });
            });
        });
    },
    end: (params, uParams, cParams) => {
        return new Promise((resolve, reject) => {
            const _params = {
                "VC_GUID": params.SLOT_ID,
                "TYPE": "END",
                "VC_REQUEST_BY": uParams.type === 'doc' ? 'DOC' : 'PAT',
                "END_DATE": date.currentDate(),
                "TM_DET_ID": params.TM_DET_ID
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                if (response && response.length > 0 && response[0].TM_DET_ID) {
                    resolve({
                        "statusCode": 200,
                        "status": "success",
                        "data": {
                            "TM_DET_ID": response[0].TM_DET_ID
                        }
                    });
                }
                else {
                    resolve({
                        "statusCode": 404,
                        "status": "not exist",
                        "data": null
                    });
                }
            }).catch(ex => {
                resolve({
                    "statusCode": 404,
                    "status": "error while fetch data",
                    "data": null
                });
            });
        });
    },
    docNotes: (params, cParams) => {
        return new Promise((resolve, reject) => {
            const _params = {
                "VC_GUID": params.SLOT_ID,
                "TYPE": "REMARKS",
                "VISIT_REAMRKS": params.NOTES
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                resolve({
                    "statusCode": 200,
                    "status": "success"
                });
            }).catch(ex => {
                resolve({
                    "statusCode": 404,
                    "status": ex.message
                });
            });
        });
    },
    upload: (params, cParams) => {
        return new Promise((resolve, reject) => {
            const _params = {
                "VC_GUID": params.SLOT_ID,
                "VC_FILE_NAME": "Document",
                "FILE_TYPE": params.FILE_TYPE,
                "FILE_DATA": params.FILE_DATA,
                "TYPE": "IMAGE"
            };
            mapper(dbSchema.getTeleIpOpMob, _params, cParams).then((response) => {
                resolve({
                    "statusCode": 200,
                    "status": "success"
                });
            }).catch(ex => {
                resolve({
                    "statusCode": 404,
                    "status": ex.message
                });
            });
        });
    }
};

router.post('/vcDocStatUpd', (req, res) => {
    if (req.body && req.body.SLOT_ID) {
        /**
         * This is a patch for video consultation IP and OP
         * First verify either slot_id belongs to video consultation or OP and OP video consultation
         * if slot_id belongs to IP and OP video consultation call below function
         * other wise it continue it's original function
         */
        if (!tmIpOp.isSlot(req.body.SLOT_ID)) {
            tmIpOp.updDocStat(req.body, req.cParams).then((response) => {
                return res.json(response);
            });
            return;
        }

        const params = {
            "SLOT_ID": req.body.SLOT_ID,
            "TYPE": "SES_STRT"
        };
        mapper(dbSchema.teleMedMobile, params, req.cParams).then((response) => {
            if (response && response.length > 0 && (response = response[0])) {
                sendSms(response, req.cParams).then(success => {
                    return res.json({
                        "statusCode": 200,
                        "status": "success"
                    });
                }).catch(error => {
                    return res.json({
                        "statusCode": 404,
                        "status": "error while sending SMS"
                    });
                });
            }
            else {
                return res.json({
                    "statusCode": 404,
                    "status": "error while update status"
                });
            }
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request"
        });
    }
});

router.post('/vcPatDtls', (req, res) => {
    let resp = {
        "statusCode": "",
        "status": "",
        "appointmentTime": "",
        "appointmentWithDoctor": "",
        "openTokToken": "",
        "openTokSession": "",
        "orgKey": "",
        "cnt": 0
    };

    if (req.body && req.body.SLOT_ID) {
        /**
         * This is a patch for video consultation IP and OP
         * First verify either slot_id belongs to video consultation or OP and OP video consultation
         * if slot_id belongs to IP and OP video consultation call below function
         * other wise it continue it's original function
         */
        if (!tmIpOp.isSlot(req.body.SLOT_ID)) {
            tmIpOp.getPatDetails(req.body, req.cParams).then((response) => {
                return res.json(response);
            });
            return;
        }

        const params = {
            SLOT_ID: req.body.SLOT_ID,
            TYPE: 'PAT_DTLS',
            VC_REQUEST_BY: req.body.REQUEST_BY ? req.body.REQUEST_BY : "PAT"
        };

        mapper(dbSchema.teleMedMobile, params, req.cParams).then((response) => {
            if (response && response.length && response.length > 0) {
                const patObj = JSON.parse(response[0].PATIEN_DETAILS);
                if (!response[0].VC_STATUS) response[0].VC_STATUS = "INITIATED";

                resp.patientName = patObj.PATIENT_NAME;
                resp.appointmentTime = patObj.SCH_START_TIME;
                resp.appointmentWithDoctor = patObj.DOCTOR_NAME;
                resp.doctorNotes = response[0].VISIT_REMARKS || null;
                resp.consent = response[0].VIDEO_CONSENT || null;

                const date = new Date().setHours(0, 0, 0, 0);
                const apmntTime = new Date(patObj.SCH_START_TIME).setHours(0, 0, 0, 0);

                if (date !== apmntTime) {
                    response[0].VC_STATUS = "COMPLETED";
                }

                if (response[0].VC_STATUS === "INITIATED") {
                    resp.statusCode = 102;
                    resp.status = "session was initiated";
                }
                else if (response[0].VC_STATUS === "STARTED") {
                    resp.statusCode = 200;
                    resp.status = "ready to start";
                    resp.openTokToken = response[0].TOKEN;
                    resp.openTokSession = response[0].SESSIONID;
                    resp.orgKey = response[0].ORG_KEY ? response[0].ORG_KEY.toUpperCase() : "DOC9";
                }
                else if (response[0].VC_STATUS === "COMPLETED") {
                    resp.statusCode = 410;
                    resp.status = "appointment was expired";
                }
                return res.json(resp);
            }
            else {
                resp.statusCode = 404;
                resp.status = "Invalid unique key";
                return res.json(resp);
            }
        }).catch((error) => {
            resp.statusCode = 404;
            resp.status = "error while fetch data - " + error.message;
            return res.json(resp);
        });
    }
    else {
        resp.statusCode = 404;
        resp.status = "Please Provide unique value";
        return res.json(resp);
    }
});

router.post('/vcConsent', (req, res) => {
    getUpdTmDetails({ "SLOT_ID": req.body.SLOT_ID, TYPE: 'PAT_DTLS' }, req.cParams).then(s => {
        if (s && s.length > 0 && (s = s[0])) {
            if (s.VIDEO_CONSENT !== req.body.CONSENT) {
                if (req.body.CONSENT && (req.body.CONSENT === 'N' || req.body.CONSENT === 'Y')) {
                    const params = {
                        "IP_FLAG": 'CON',
                        "IP_VIDEO_CONSENT": req.body.CONSENT,
                        "IP_SLOTS_ID": req.body.SLOT_ID
                    }
                    mapper(dbSchema.updMnulPayment, params, req.cParams).then((response) => {
                        return res.json({
                            "statusCode": 200,
                            "status": "success"
                        });
                    }).catch((error) => {
                        return res.json({
                            "statusCode": 404,
                            "status": error.message
                        });
                    });
                }
                else {
                    return res.json({
                        "statusCode": 404,
                        "status": "invalid data provided"
                    });
                }
            }
            else {
                return res.json({
                    "statusCode": 200,
                    "status": "success"
                });
            }
        }
    }).catch(e => {
        return res.json({
            "statusCode": 404,
            "status": e.message
        });
    })
});

router.post('/vcDocNotes', (req, res) => {
    /**
     * This is a patch for video consultation IP and OP
     * First verify either slot_id belongs to video consultation or OP and OP video consultation
     * if slot_id belongs to IP and OP video consultation call below function
     * other wise it continue it's original function
     */
    if (!tmIpOp.isSlot(req.body.SLOT_ID)) {
        tmIpOp.docNotes(req.body, req.cParams).then((response) => {
            return res.json(response);
        });
        return;
    }
    getUpdTmDetails({ "SLOT_ID": req.body.SLOT_ID, TYPE: 'PAT_DTLS' }, req.cParams).then(s => {
        if (s && s.length > 0 && (s = s[0])) {
            if (s.VISIT_REMARKS !== req.body.NOTES) {
                if (!req.body.NOTES) req.body.NOTES = "";

                const params = {
                    "IP_FLAG": 'REM',
                    "IP_VD_REMARKS": req.body.NOTES,
                    "IP_SLOTS_ID": req.body.SLOT_ID
                }
                mapper(dbSchema.updMnulPayment, params, req.cParams).then((response) => {
                    return res.json({
                        "statusCode": 200,
                        "status": "success"
                    });
                }).catch((error) => {
                    return res.json({
                        "statusCode": 404,
                        "status": error.message
                    });
                });
            }
            else {
                return res.json({
                    "statusCode": 200,
                    "status": "success"
                });
            }
        }
    }).catch(e => {
        return res.json({
            "statusCode": 404,
            "status": e.message
        });
    })
});

router.post('/vc/:type/start', async (req, res) => {
    if (req.body && req.body.JOIN_BY && req.body.SLOT_ID && req.params && req.params.type && (req.params.type = req.params.type.toLowerCase()) && (req.params.type === 'doc' || req.params.type === 'pat')) {
        /**
         * This is a patch for video consultation IP and OP
         * First verify either slot_id belongs to video consultation or OP and OP video consultation
         * if slot_id belongs to IP and OP video consultation call below function
         * other wise it continue it's original function
         */
        if (!tmIpOp.isSlot(req.body.SLOT_ID)) {
            tmIpOp.start(req.body, req.params, req.cParams).then((response) => {
                return res.json(response);
            });
            return;
        }

        const params = {
            "SLOT_ID": req.body.SLOT_ID,
            "TYPE": "START",
            "VC_REQUEST_BY": req.params.type.toLowerCase() === 'doc' ? 'DOC' : 'PAT',
            "START_DATE": date.currentDate(),
            "JOIN_BY": req.body.JOIN_BY
        };
        mapper(dbSchema.teleMedMobile, params, req.cParams).then((response) => {
            if (response && response.length > 0) {
                return res.json({
                    "statusCode": 200,
                    "status": "success",
                    "data": {
                        "TM_DET_ID": response[0].TM_DET_ID
                    }
                });
            }
            else {
                return res.json({
                    "statusCode": 404,
                    "status": "not exist",
                    "data": null
                });
            }
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request",
            "data": null
        });
    }
});

router.post('/vc/:type/end', async (req, res) => {
    if (req.body && req.body.TM_DET_ID && req.body.SLOT_ID && req.params && req.params.type && (req.params.type = req.params.type.toLowerCase()) && (req.params.type === 'doc' || req.params.type === 'pat')) {
        /**
         * This is a patch for video consultation IP and OP
         * First verify either slot_id belongs to video consultation or OP and OP video consultation
         * if slot_id belongs to IP and OP video consultation call below function
         * other wise it continue it's original function
         */
        if (!tmIpOp.isSlot(req.body.SLOT_ID)) {
            tmIpOp.end(req.body, req.params, req.cParams).then((response) => {
                return res.json(response);
            });
            return;
        }

        const params = {
            "SLOT_ID": req.body.SLOT_ID,
            "TYPE": "END",
            "VC_REQUEST_BY": req.params.type.toLowerCase() === 'doc' ? 'DOC' : 'PAT',
            "END_DATE": date.currentDate(),
            "TM_DET_ID": req.body.TM_DET_ID
        };
        mapper(dbSchema.teleMedMobile, params, req.cParams).then((response) => {
            if (response && response.length > 0 && response[0].TM_DET_ID) {
                return res.json({
                    "statusCode": 200,
                    "status": "success",
                    "data": {
                        "TM_DET_ID": response[0].TM_DET_ID
                    }
                });
            }
            else {
                return res.json({
                    "statusCode": 404,
                    "status": "not exist or invalid tm_det_id",
                    "data": null
                });
            }
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request",
            "data": null
        });
    }
});

router.post('/vc/rpay/getPat', (req, res) => {
    if (req.body.SLOT_ID) {
        mapper(dbSchema.getPatBySlotOnline, req.body, req.cParams).then((response) => {
            if (response && response.length > 0 && (response = response[0])) {
                return res.json({
                    "statusCode": 200,
                    "status": "success",
                    "data": response
                });
            }
            else {
                return res.json({
                    "statusCode": 404,
                    "status": "invalid request",
                    "data": null
                });
            }
        }).catch((error) => {
            return res.json({
                "statusCode": 404,
                "status": "invalid request",
                "data": null
            });
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request",
            "data": null
        });
    }
});

router.post('/vc/rpay/payment', (req, res) => {
    // 'order.paid' currently in use
    const fileName = config.DIR_PATH + "public/static/payment.txt";
    try {
        fs.appendFileSync(fileName, "===================== " + date.currentDate() + " =========================");
        fs.appendFileSync(fileName, "\nbody:- " + JSON.stringify(req.body));

        const payment = req.body && req.body.payload && req.body.payload.payment && req.body.payload.payment.entity ? req.body.payload.payment.entity : {};
        const order = req.body && req.body.payload && req.body.payload.order && req.body.payload.order.entity ? req.body.payload.order.entity : {};
        const desc = req.body ? req.body : {};

        const params = {
            "PAY_ID": 0,
            "ORDER_ID": payment.order_id,
            "ORDER_AMNT": payment.amount,
            "ORDER_AMNT_PAID": order.amount_paid,
            "ORDER_AMNT_DUE": order.amount_due,
            "CURRENCY": order.currency,
            "APMNT_DT": "",
            "SLOTS_ID": (order.receipt && (order.receipt.indexOf("---") > -1)) ? order.receipt.split("---")[0] : order.receipt,
            "PAYMENT_ID": payment.id,
            "INVOICE_ID": payment.invoice_id,
            "INTERNATIONAL": payment.international ? "Y" : "N",
            "PAY_METHOD": payment.method,
            "AMOUNT_REFUND": payment.amount_refunded,
            "REFUND_STATUS": payment.refund_status,
            "CAPTURED": payment.captured ? "Y" : "N",
            "BANK_NAME": payment.bank,
            "WALLET_NAME": payment.wallet,
            "VPA_NAME": payment.vpa,
            "EMAIL_ID": payment.email,
            "PHONE_NO": payment.contact,
            "PATIENT_ID": "",
            "CUSTOMER_ID": payment.customer_id,
            "REMARKS": JSON.stringify(payment.notes || []),
            "FEE": payment.fee,
            "TAX": payment.tax,
            "ERROR_CODE": payment.error_code,
            "ERROR_DESC": payment.error_description,
            "CREATE_AT": payment.created_at,
            "ALL_DATA": JSON.stringify(req.body),
            "PAYMNT_STATUS": (desc.contains && (JSON.stringify(desc.contains).indexOf("payment") > -1) && (JSON.stringify(desc.contains).indexOf("order") > -1)) ? "DONE" : "PENDING",
            "PAYMNT_EVNT": desc.event,
            "RECEIPT_ID": order.receipt || ""
        };

        fs.appendFileSync(fileName, `\n\n\n----- saving params -------`);
        fs.appendFileSync(fileName, JSON.stringify(params));

        mapper(dbSchema.insUpdOnlinePayment, params, req.cParams).then((response) => {
            fs.appendFileSync(fileName, `\n----- inser into database success -------`);
            fs.appendFileSync(fileName, `\n===========================================================`);
            fs.appendFileSync(fileName, `\n\n`);
            return res.json({
                "statusCode": 200,
                "status": "successt"
            });
        }).catch((error) => {
            fs.appendFileSync(fileName, `\n----- inser into database error -------`);
            fs.appendFileSync(fileName, `\n----- ` + error.message || "");
            fs.appendFileSync(fileName, `\n----- ` + JSON.stringify(error));
            fs.appendFileSync(fileName, `\n===========================================================`);
            fs.appendFileSync(fileName, `\n\n`);
            return res.json({
                "statusCode": 404,
                "status": "update failed"
            });
        });
    }
    catch (ex) {
        fs.appendFileSync(fileName, `\n----- method goes to exception -------`);
        fs.appendFileSync(fileName, `\n` + ex.message || "");
        fs.appendFileSync(fileName, `\n===========================================================`);
        fs.appendFileSync(fileName, `\n\n`);
        return res.json({
            "statusCode": 404,
            "status": "Error in method calling"
        });
    }
});

router.post('/vc/rpay/error', (req, res) => {
    req.body.HOST = config.HOST + "_PAYMENT_GATEWAY";
    slack(JSON.stringify(req.body)).then(success => {
        return res.json({
            "statusCode": 200,
            "status": "success"
        });
    }).catch(ex => {
        return res.json({
            "statusCode": 404,
            "status": "error while message push to slack"
        });
    })
});

router.get('/vc/rpay/patient/:SLOT_ID', (req, res) => {
    if (req.params.SLOT_ID) {
        const params = {
            "SLOT_ID": req.params.SLOT_ID,
            "TYPE": "SLOT"
        };
        mapper(dbSchema.teleMedMobile, params, req.cParams).then((response) => {
            if (response && response.length > 0 && (response = response[0])) {
                if (response.DOCTOR_NAME)
                    response.DOCTOR_NAME = "Dr. " + response.DOCTOR_NAME;
                return res.json({
                    "statusCode": 200,
                    "status": "success",
                    "data": response
                });
            }
            else {
                return res.json({
                    "statusCode": 404,
                    "status": "no data found",
                    "data": null
                });
            }
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request",
            "data": null
        });
    }
});

router.post('/vc/upload/:SLOT_ID', cpUpload, (req, res) => {
    if (req.params.SLOT_ID && req.files.file && req.files.file.length > 0) {
        const file = req.files.file[0];
        const params = {
            FILE_TYPE: file.mimetype.indexOf("image") > -1 ? "IMAGE" : file.mimetype.split("/")[1].toUpperCase(),
            SLOT_ID: req.params.SLOT_ID,
            FILE_DATA: `data:${file.mimetype};base64,${Buffer.from(file.buffer).toString("base64")}`,
            REMARKS: "",
            FLAG: "N"
        };

        /**
         * This is a patch for video consultation IP and OP
         * First verify either slot_id belongs to video consultation or OP and OP video consultation
         * if slot_id belongs to IP and OP video consultation call below function
         * other wise it continue it's original function
         */
        if (!tmIpOp.isSlot(req.params.SLOT_ID)) {
            tmIpOp.upload(params, req.cParams).then((response) => {
                return res.json(response);
            });
            return;
        }

        mapper(dbSchema.UprInsPatientEcgData, params, req.cParams).then((response) => {
            return res.json({
                "statusCode": 200,
                "status": "success"
            });
        }).catch((error) => {
            return res.json({
                "statusCode": 404,
                "status": "error while upload file" + error.message
            });
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "invalid request"
        });
    }
});

router.post('/upload/:PATIENT_TYPE/:REF_ID/:VISIT_ID?', cpUpload, (req, res) => {
    if (req.params.REF_ID && req.files.file && req.files.file.length > 0 && (req.params.PATIENT_TYPE && (req.params.PATIENT_TYPE.toUpperCase() === 'IP' || req.params.PATIENT_TYPE.toUpperCase() === 'OP')) && (req.params.PATIENT_TYPE.toUpperCase() === 'IP' ? req.params.VISIT_ID : true)) {
        const file = req.files.file[0];
        req.params.PATIENT_TYPE = req.params.PATIENT_TYPE.toUpperCase();
        const params = {
            FILE_TYPE: file.mimetype.indexOf("image") > -1 ? "IMAGE" : file.mimetype.split("/")[1].toUpperCase(),
            ADMN_NO: req.params.PATIENT_TYPE === 'IP' ? req.params.REF_ID : null,
            SLOT_ID: req.params.PATIENT_TYPE === 'OP' ? req.params.REF_ID : null,
            IP_VISIT_ID: req.params.PATIENT_TYPE === 'IP' ? req.params.VISIT_ID : null,
            PATIENT_TYPE: req.params.PATIENT_TYPE.toUpperCase(),
            FILE_DATA: `data:${file.mimetype};base64,${Buffer.from(file.buffer).toString("base64")}`,
            REMARKS: "",
            FLAG: "N",
            FORMAT_NAME: req.body.FORMAT_NAME || null
        };

        mapper(dbSchema.UprInsPatientEcgData, params, req.cParams).then((response) => {
            return res.json({
                "statusCode": 200,
                "status": "success"
            });
        }).catch((error) => {
            return res.json({
                "statusCode": 404,
                "status": "error while upload file" + error.MESSAGE
            });
        });
    }
    else {
        return res.json({
            "statusCode": 404,
            "status": "Insufficient Parameters"
        });
    }
});

router.post('/getFormUserUpdatedDetails', (req, res) => {
    mapper(dbSchema.getFormUserUpdatedDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCovidClinicalSymtoms', (req, res) => {
    mapper(dbSchema.insUpdCovidClinicalSymtoms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCovidClinicalSymtoms', (req, res) => {
    mapper(dbSchema.getCovidClinicalSymtoms, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotsByOlrPas', (req, res) => {
    mapper(dbSchema.getSlotsByOlrPas, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdVccsToken', (req, res) => {
    const fileName = config.DIR_PATH + "public/static/vc.txt";
    fs.appendFileSync(fileName, "===================== " + date.currentDate() + " =========================");
    fs.appendFileSync(fileName, "\nbody:- " + JSON.stringify(req.body));
    mapper(dbSchema.insUpdVccsToken, req.body, req.cParams).then((response) => {
        fs.appendFileSync(fileName, "\nresponse:- " + JSON.stringify(response) + "\n\n\n");
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        fs.appendFileSync(fileName, "\nerror:- " + JSON.stringify(error) + "\n\n\n");
        res.status(400).send(error);
    });
});

router.post('/getVccsToken', (req, res) => {
    mapper(dbSchema.getVccsToken, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdLableProfileSetup', (req, res) => {
    mapper(dbSchema.InsUpdLableProfileSetup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetLableProfileSetup', (req, res) => {
    mapper(dbSchema.GetLableProfileSetup, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdIPPatInsulin', (req, res) => {
    mapper(dbSchema.insUpdIPPatInsulin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPPatInsulin', (req, res) => {
    mapper(dbSchema.getIPPatInsulin, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllLocationV1', (req, res) => {
    mapper(dbSchema.getAllLocationV1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVideoConsultationSlot', (req, res) => {
    //let startTime=new Date().getTime();	
    //console.log("req-start-time",new Date().getTime())
    mapper(dbSchema.getVideoConsultationSlot, req.body, req.cParams).then((response) => {
        //console.log("req-end-time",startTime-new Date().getTime())
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVideoConsultSlotPay', (req, res) => {
    mapper(dbSchema.getVideoConsultSlotPay, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCoronaryAngioGraphy', (req, res) => {
    mapper(dbSchema.insUpdCoronaryAngioGraphy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCororaryBalloonAngioplasty', (req, res) => {
    mapper(dbSchema.insUpdCororaryBalloonAngioplasty, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCardioProcedure', (req, res) => {
    mapper(dbSchema.insUpdCardioProcedure, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdCoronaryBalloonAngioplasty1', (req, res) => {
    mapper(dbSchema.insUpdCoronaryBalloonAngioplasty1, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getVcSummary', (req, res) => {
    mapper(dbSchema.getVcSummary, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCardioProcedure', (req, res) => {
    mapper(dbSchema.getCardioProcedure, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCoronaryAngioGraphy', (req, res) => {
    mapper(dbSchema.getCoronaryAngioGraphy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpFormTypeInfo', (req, res) => {
    mapper(dbSchema.getIpFormTypeInfo, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updSlotsAll', (req, res) => {
    mapper(dbSchema.updSlotsAll, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsCovidAdmissionDetails', (req, res) => {
    mapper(dbSchema.uprInsCovidAdmissionDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getTeleIpOpMob', (req, res) => {
    mapper(dbSchema.getTeleIpOpMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getUpdVcIpOpDet', (req, res) => {
    mapper(dbSchema.getUpdVcIpOpDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsUpdTeleIpOp', (req, res) => {
    mapper(dbSchema.uprInsUpdTeleIpOp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetTeleIpOp', (req, res) => {
    mapper(dbSchema.uprGetTeleIpOp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatOptmology', (req, res) => {
    mapper(dbSchema.PatOptmology, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/PatCmplts', (req, res) => {
    mapper(dbSchema.PatCmplts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/CmpltMstr', (req, res) => {
    mapper(dbSchema.CmpltMstr, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOptLens', (req, res) => {
    mapper(dbSchema.InsUpdOptLens, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdOptLensInst', (req, res) => {
    mapper(dbSchema.InsUpdOptLensInst, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// need to reconsider this one
router.post('/InsTmplFieldVal', (req, res) => {
    mapper(dbSchema.InsTmplFieldVal, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdPatientDetails', (req, res) => {
    mapper(dbSchema.insUpdPatientDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetAreaDetails', (req, res) => {
    mapper(dbSchema.uprGetAreaDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprInsIpAdmissionDetails', (req, res) => {
    mapper(dbSchema.uprInsIpAdmissionDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdPatFlagAlert', (req, res) => {
    mapper(dbSchema.InsupdPatFlagAlert, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPatFlagAlert', (req, res) => {
    mapper(dbSchema.getPatFlagAlert, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UpdAdmnDetails', (req, res) => {
    mapper(dbSchema.UpdAdmnDetails, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getErAssessmentData', (req, res) => {
    mapper(dbSchema.getErAssessmentData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetEyeDet', (req, res) => {
    mapper(dbSchema.uprGetEyeDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdEyeDet', (req, res) => {
    mapper(dbSchema.uprInsupdEyeDet, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getslotsByRsrc', (req, res) => {
    mapper(dbSchema.getslotsByRsrc, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/**
 * @param { file: file }
 * @param { REF_TYPE_ID: number }
 * @param { IMA_TYPE_ID: number } 
 * @param { REF_ID: number }
 * @param { IP_SESSION_ID: number }
 */
router.post('/uploadAppImage', cpUpload, (req, res) => {
    try {
        //console.log("uploadimage");
        if (req.files.file && req.files.file.length > 0) {
            const refTypId = req.body.REF_TYPE_ID ? parseInt(req.body.REF_TYPE_ID) : null;
            const imgTypId = req.body.IMA_TYPE_ID ? parseInt(req.body.IMA_TYPE_ID) : null;
            const file = req.files.file[0];
            const fileName = Date.parse(new Date()) + "_" + file.originalname;
            let imageBasePath = "";
            let imageEndPath = "";

            if (refTypId == 1) {
                // to store patients or guest users
                imageBasePath += "assets/";
                imageEndPath += 'pat/';
            }
            else if (refTypId == 2) {
                // to store doctor images
                if (imgTypId === 4) {
                    // thumbnails
                    imageBasePath += "assets/";
                    imageEndPath += 'thumbnails/';
                }
                else {
                    // images or signatures
                    imageBasePath += "assets/";
                    imageEndPath += 'doc/';
                }
            }
            else if (refTypId == 5) {
                // to store client logo's
                imageBasePath += "client_logo/";
            }
            else if (refTypId == 7) {
                imageBasePath += "assets/";
                imageEndPath += 'loc/';
            }
            else if (refTypId == 16) {
                // to store employee images
                imageBasePath += "assets/";
                imageEndPath += 'emp/';
            }
            else if (refTypId == 20) {
                // to store cc images
                imageBasePath += "assets/";
                imageEndPath += 'CC/';
            }
            else if (refTypId == 66) {
                imageBasePath += "assets/";
                imageEndPath += 'package-img/';
            }
            else {
                res.status(400).send("There No Path to save this kind of files");
            }
            // console.log("uploadimage", config.APP_DIR_PATH + imageBasePath + imageEndPath);
            const created = fsc.creteDirIfNotExist(config.APP_DIR_PATH + imageBasePath + imageEndPath);
            if (!created)
                return res.status(400).send("Invalid Directory Path or Directory doen't Exist");

            imageBasePath += (imageEndPath + fileName);
            imageEndPath += fileName;

            fs.writeFile((config.APP_DIR_PATH + imageBasePath), file.buffer, (err) => {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    const params = {
                        IP_REFERENCE_ID: req.body.REF_ID,
                        IP_REFERENCE_TYPE_ID: refTypId,
                        IP_IMAGE_TYPE_ID: imgTypId,
                        IP_IMAGE_URL: imageEndPath,
                        IP_IMAGE_TITLE: req.body.IMG_TITLE || fileName,
                        IP_IMAGE_DATA_SIZE: file.size,
                        IP_IMAGE_DATA: file.buffer,
                        IP_IMAGE_MIME_TYPE: file.mimetype,
                        IP_SESSION_ID: req.body.IP_SESSION_ID
                    };
                    mapper(dbSchema.InsUpdImage, params, req.cParams).then((response) => {
                        return res.json(responseChange(response, req.cParams));
                    }).catch((error) => {
                        return res.status(400).send(error);
                    });
                }
            });
        }
        else {
            res.status(400).send("Please Select A File First");
        }
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

/**
 * @param { file: file }
 * @param { ORG_ID: number }
 * @param { UMR: string }
 * @param { SLOT: number }
 * @param { DOC_TYPE_ID: number }
 * @param { TITLE: string }
 * @param { TYPE: char }
 * @param { IP_SESSION_ID: number }
 */
router.post('/uploadPatDocs', cpUpload, (req, res) => {
    try {
        if (req.files.file && req.files.file.length > 0) {
            const file = req.files.file[0];
            const fileName = Date.parse(new Date()) + "_" + file.originalname;
            let imageBasePath = "Assets/Document/";
            let imageEndPath = "";

            if (req.body.ORG_ID)
                imageEndPath += (req.body.ORG_ID + '/');

            if (req.body.UMR)
                imageEndPath += (req.body.UMR + '/');

            if (req.body.SLOT)
                imageEndPath += (req.body.SLOT + '/');

            if (req.body.DOC_TYPE_ID)
                imageEndPath += (req.body.DOC_TYPE_ID + '/');

            const created = fsc.creteDirIfNotExist(config.APP_DIR_PATH + imageBasePath + imageEndPath);
            if (!created)
                return res.status(400).send("Invalid Directory Path or Directory doen't Exist");

            imageBasePath += (imageEndPath + fileName);
            imageEndPath += fileName;
            fs.writeFile((config.APP_DIR_PATH + imageBasePath), file.buffer, (err) => {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    const params = {
                        SLOT_ID: req.body.TYPE !== 'P' ? req.body.SLOT : null,
                        SNO: 0,
                        DOC_TYPE_ID: req.body.DOC_TYPE_ID || null,
                        DOC_PATH: imageEndPath,
                        DOC_TITLE: req.body.TITLE,
                        PATIENT_ID: req.body.TYPE === 'P' ? req.body.SLOT : null,
                        DOC_DT: "",
                        DOC_DATA: file.buffer,
                        DOC_MIME_TYPE: file.mimetype,
                        IP_SESSION_ID: req.body.IP_SESSION_ID
                    };
                    mapper(dbSchema.insUpdPatDoc, params, req.cParams).then((response) => {
                        return res.json(responseChange(response, req.cParams));
                    }).catch((error) => {
                        return res.status(400).send(error);
                    });
                }
            });
        }
        else {
            res.status(400).send("Please Select A File First");
        }
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

/**
 * @param { file: file }
 * @param { IMG_TITLE: string }
 * @param { IMG_DESC: string }
 * @param { SPEC_ID: number }
 * @param { IP_SESSION_ID: number }
 */
router.post('/uploadBodyImages', cpUpload, (req, res) => {
    try {
        if (req.files.file && req.files.file.length > 0) {
            const file = req.files.file[0];
            const fileName = Date.parse(new Date()) + "_" + file.originalname;
            let imageBasePath = "BodyImages/";

            const created = fsc.creteDirIfNotExist(config.APP_DIR_PATH + imageBasePath);
            if (!created)
                return res.status(400).send("Invalid Directory Path or Directory doen't Exist");

            imageBasePath += fileName;
            fs.writeFile((config.APP_DIR_PATH + imageBasePath), file.buffer, (err) => {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    const params = {
                        ID: req.body.ID,
                        BODY_IMAGE_TITLE: req.body.IMG_TITLE || null,
                        BODY_IMAGE_DESC: req.body.IMG_DESC || null,
                        SPEC_ID: req.body.SPEC_ID,
                        PATH: imageBasePath,
                        IMAGE_DATA: file.buffer,
                        IMAGE_MIME_TYPE: file.mimetype,
                        REC_STA: "A",
                        IP_SESSION_ID: req.body.IP_SESSION_ID
                    };
                    mapper(dbSchema.InsBodyImages, params, req.cParams).then((response) => {
                        return res.json(responseChange(response, req.cParams));
                    }).catch((error) => {
                        return res.status(400).send(error);
                    });
                }
            });
        }
        else {
            res.status(400).send("Please Select A File First");
        }
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/uprUpdPatDocPrivacy', (req, res) => {
    mapper(dbSchema.uprUpdPatDocPrivacy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatDocPrivacy', (req, res) => {
    mapper(dbSchema.uprGetPatDocPrivacy, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetFormTypePrintData', (req, res) => {
    mapper(dbSchema.uprGetFormTypePrintData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insIpFormTypePrintInfoManual', (req, res) => {
    mapper(dbSchema.insIpFormTypePrintInfoManual, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprGetDocMsgNew', (req, res) => {
    mapper(dbSchema.uprGetDocMsgNew, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsUpdTeleIpOp', (req, res) => {
    mapper(dbSchema.uprInsUpdTeleIpOp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdSystemVitalsXml', (req, res) => {
    mapper(dbSchema.UprInsupdSystemVitalsXml, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprGetSystemVitals', (req, res) => {
    mapper(dbSchema.UprGetSystemVitals, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCriticalValViewDoctor', (req, res) => {
    mapper(dbSchema.getCriticalValViewDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsComMsgReqOtp', (req, res) => {
    mapper(dbSchema.uprInsComMsgReqOtp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprGetSystemVitals', (req, res) => {
    try {
        mapper(dbSchema.UprGetSystemVitals, req.body, req.cParams).then((response) => {
            return res.json(responseChange(response, req.cParams, req.body));
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/getPackageMasterMobi', (req, res) => {
    mapper(dbSchema.getPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPackageMasterMobi', (req, res) => {
    mapper(dbSchema.uprInsupdPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post("/patientDashborad", (req, res) => {
    try {
        let _params = {
            "org_id": req.body.ORG_ID,
            "loc_id": req.body.LOC_ID,
            "host_name": req.body.HOST_NAME,
            "rsrc_id": req.body.RSRC_ID,
            "flag": req.body.FLAG,
            "lvl_flag": "loc"
        };
        //console.log("uprGetPatientDashborad_params",_params)
        axios.post("http://10.65.12.66:10006/doctor/api/" + "uprGetPatientDashborad", _params).then((response) => {
            //console.log("uprGetPatientDashborad", response)
            if (response.data && response.data.RES_OBJ) {
                //console.log("uprGetPatientDashborad", response.data.RES_OBJ)
                let original = response.data.RES_OBJ
                let output = [];
                //console.log("originalData",original.Table[0].msg.patient_dash_board)
                output = [
                    {
                        "SLIDE_TITLE": "Out Patient",
                        "SLIDE_STATUS": "SUCCESS",
                        "SLIDE_KEY": "OP",
                        "DEFAULT_DATE": "TODAY",
                        "IS_DATE_PICKER": false,
                        "IS_RELOAD": true,

                        "ROWS": [
                            [
                                [
                                    {
                                        "label": "OP",
                                        "icon": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAC2FJREFUeNrsnf912zYXQJ97+r/VCcxOUHaCsBv424DfBsoEVSdQNlA7gdIJpEwgdwIqE8iZwCWPodRNbRGgAPABuPccnOTEDik94uI3gRvJh6pPTZ/e9ak26TUeTPrUp32fjgKvsTAxHGJ6Z+Jbm3+/xKOJ7xDXzybGD+bfYQaGB7jt09PEtDXXAJH7Pq37dLginm+lg7n2PWGOJ8bO4wPcFSrKUCts+nQKIMVb6WTuWZONw7AO+PDWhcSwDVRTTKlZWrK0v3bxIdJDW2QsRqdAjG9ThyjXNwW6yA8spyZAo1SM1+JOn3BCzdHN9LAWGcRum4AYrw2eLMj6dszZVj4kPip1SlCOl535WUe9bhLpkC8d/89HeZ7neHilmfZuQtA/9Ol9ggMZS0/X2ptYfjF/H2vK3co/cyg+SDH+0drNLiXOyrJaXpjfdbl2Ku1iHwMZBxOfxtMzXHv6TDS5vmHnELwpHera4cHtMh/IOJmMXAf+fOsrmn25DZxEqT2uLVlcStxGuRwnmT68GrN0Xsj04eYTkjyzlXjVrq0k24zkODk0SUOKspr42YuWpLIMVO05k9ncc5GBHFsTY03Pe4sk9rSWHXLf2HTcW2Ud8s4xU7XKn7uL7DnMU01iM1NJvrC470ZRnFxGhqYOZMxRI7p+r+IYC1DIvsA2kQfismBzl1hJ6zpUvS5NkLGALAPee2lx/7m5d8g8m4Tzwcbhe94jSJzh1ka5IAuHdvomg7xgK8mppP5IzNGr1ASxHe3JqW1u29zaIkjZNUgjZS7LyGUyF0ECYzOkG3J+oJLnodilxB8Rs53v6RCkzE56a1mCtoHuv5b539mYOwbJtDlLHOa1qT22M2TM2AMBNn2w7GsRJgrdS86ThFs+0ome5TeVZVMr61rEJkOsAtx3pTTwh5nioaFPOPU5ZT3DXgmLFV0+V+g1SdoEsV2DlvViRpa72zc3Q9dqGodWbVoZm5wFaYQXpsSivR1jBlljXBaWscma0l+5tVlzFWOhntbJOZsFm1mv0bKtRXLdtMEmA9QFC1ILK30n7cM79BWW5sG9TEuZtonaXEEeq91ijdRoXt6hJUazUuLGcQtF4moWxKYAndxH+y4RQX6ReQ66OZp7z9V8GONPgT89xTJpQYbTif4XWZKjuedcJyPZlMp7/LCKQZO7IAPD1pc/y3+3E039Xm9xhxzeJLkrQZBzTTJk3A8B7/HB3GPuM/UqC4nBLhZVKYKceW/6Bj5L0b25ppZNksfazV/wwjoWRW8yN7QvczzEU9PIkfa3+BoJ9A7P95m0P4c0DOUNs6Yux0B/FI4nhswFedk/+d0kAC98RwiSLhAAQeANOEwGQQAQBNKnRhCAtxkWDG4QBDR1whtln7edUZLmylgiSIKMLZ+4VfiZ55Lk9spYZinI4sUDufS+yMH8TitpjfwcFbX7PzhKEntv4PrKWGZFJW7nRry200WVwPdcia4tUFvRe675nHuGqaoxrhHjNVE01yiN6FsDpVESjXGKzrDG6iT+X6c9id5dL2xeuZ2jZGwdn0Xo02iDvnLrI+O+3OGuC5Dh1hL+vXOtO19o3ZCgViSJ2k0bLu3Z5EuSjcTbnEHjOL6WbX+0SqJ6259Le6N2kTJH7jXJvfLPXIv7Oe1V5AJktiZ0yBGWe5lvmx9tfRINW4+O9ZVctmXaeLyv6q1HQwnicoqrzUZxO3HvuGsa3dKwebVPSXxt4boU5c3mUIJsHMWwqbIrcXstV1N/RMPxB7aS7CIJksTxByEEqRxK+SmlpssQZaVIkrkP0PFZwPk4X3IlCRygE0KQjYQfDbEdfdFUi7Qy7xFsvp6jj4nDShI5gs23IDYTY76+eCs6T5OaOmo45wE/l2J8eNEEXHuKZzKHePoWpI2cAbaS1kGQbcQCRCtJxcC3IDbNK59NCJv+jrbJQ5taJPTSjjkHK2yaVmqOgPYtyFhHNMQJT2OjLtrOlmhE30raWCNkmo/JiyLI2PWWAb7DUnQtKffVNMzt4BhbOTT1waILEqJkaBIUxGUiNYf3xG3nxbRN8EYXpEaQr7gsxdkUIIfKwzpjC5LK94iFy2LO1Pokruu7VL6ugCDptM2vOSp7jtEq1+8lCIIgb5W0rsvNW8XfpxW3haoa1qAhSAIl7pTVz5Wi71CJ+xkv6ud7ECRtSYbfX8n875KsJn529c1FBElfknMzpY0synlPs06mbbSRxEoBBNEpyZRMd85468CZrzb3mLpDTScJLaNBEL0d94Nc99rxwWTkxsPnacy1fHym6M3Bmyszls9rPwX8rBrvG5ohU/panrOX5/1tv8j4ycKDELempG883X/Y+vR9ag+AGkQ/oTbci5U0b+yHIBkIcm5ybROUYyuJr0hGkLRorujAx0ydZLKXLoKkSatUlPNwczYgSPqiHBSIcZBMXxNGkDwYRps2kTvzJ3NP9XMaDPPmO8w7ddTrnekD+M68wzDxvk+f+vQxlYAgCIJcGv06z2XcyfOCwtpiZOnRyHDs02f5Zw7lMcUgIAiCwAU45RYAQQAQBABBABAEAEEAEAQAQQAQBABBAABBABAEAEEAEAQAQQAQBABBABAEAEEAEAQAEAQAQQAQBABBABAEAEEAEAQAQQBK43tCMIqPM0IeTDpv/f9IWMvIOCUcoBMiDYfHVGQhBEGQcVEWZCUEQZBMzwIHBImV1mQpBEGQ8SYXIAiCUJMgiO/rNYUI8kSfBEE0CRKKxqRln3YTOu6MbiGI0/XaxONV9WlLfwRBpgpyKCTDtKaGsJGkIpshyJmx0vWUUexqS0moRRDkK8sCmlnf1iQ2tQh9EQT52kYfu2aXWYbZFlYoFINNZq4D9ENymyewiSPNrExrkCZgsyOneYKxIeADWS1PQaY2DTqxmyeoM4mjTd8LEmQsI+8Cd15zkaRBkDyx6WA2E6/tMvO8RBDQiE1JP7Sfp4w6VWI/mXaurSoEAU0sLDPvVElaKeNVVgTJmI2DJFOaW2uZthp2awRbIAhcw82V/78ynXVb9n36o09Hed7Z48FSwvaKz7g39/nL3PfMg+jYXaSxGNC4Iaumy0p0vlMROg2Zuo4Qv44slj6HQiXxMdS8kjDD5eABXzsr/iJlboa2EF6RRRALHguWpCEbIYgNQ6f3R8uOd25c08y6IxuWIci5Jvm5T78V2NSaSjXy809k03wEednxHGqT3wkxIMjrHPv0/z79YP78KP+ehwBQT4zjDx5NTeKrNhmbWQ4xqRZyNptXagutQcBPB/+BECGIdsYyaRO4BgYEUQ2ZFEEAAEF0YdM0OxImBAEEQZCMuSUECFIyY8s9akKEIOCfihAgCEwXZE+IEAQAQQAQJF/GZtKndtIZ/UKQLBhbizV1RS4LFREEruALIUAQAAQBQBBwpRn5+ZEQIUgKHD1k9lD3BQRJQhBAEAAEgThUhABB4DpB9oQJQXKB/a0QpGjGln3w0hSCFI3vrX+ocRAErqhxWKiIIBCxxgIEAUAQrSU6J0UhSNH8NfLzyvF670Z+fiTkCAJv85kQIAgAggAgCLhSEQIEyYmxTnPtWZA9IUeQnARh6QiCACAIACDIrDQWv8NiRQSBC7BYEUGSwqZEbwgTglCih29iUXsgSJZUlr/3E/0PCMXTSArJYeTeO0uJxr7DmscMKQqysbh/O3KNncU17nnMOrhJVJC5vlNrJBlj36c/5N+z78NM+69ityTlB/ohZTGUiJ1FyakhdRdK8CGTnwLff0N2KU+OpwTTW5KsAt+3IcuURZeoIN2FWiTUd6L2oFOdVHqLJsC9TsKKYATJRJBzh92nHGxdShMriybWtzVJ5+E+yEEnPZtO+mt9ktXE0a01zSo4S5LDMO+YKK3paF+acR8mCpfCO+lJ8LcAAwAqpES+CItzaQAAAABJRU5ErkJggg==",
                                        "value": original.Table[0].msg.patient_dash_board[0].OPD || 0,
                                        "type": "ICONBOX",
                                        "span": 0.33,
                                        "size": 23.0
                                    }
                                ],
                                [
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "HORIZONTAL_SPACER",
                                        "span": 0.07,
                                        "size": 0.0
                                    }
                                ],
                                [
                                    {
                                        "label": "Male",
                                        "icon": "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",
                                        "value": original.Table[0].msg.patient_dash_board[0].OPD_GENDER[0].OPDM || 0,
                                        "type": "ICONBOX",
                                        "span": 0.29,
                                        "size": 23.0
                                    },
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "SEPARATOR",
                                        "span": 0.02,
                                        "size": 0.0
                                    },
                                    {
                                        "label": "Female",
                                        "icon": "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",
                                        "value": original.Table[0].msg.patient_dash_board[0].OPD_GENDER[0].OPDF || 0,
                                        "type": "ICONBOX",
                                        "span": 0.29,
                                        "size": 23.0
                                    }
                                ]
                            ],
                            [
                                [
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "VERTICAL_SPACER",
                                        "span": 0.07,
                                        "size": 0.0
                                    }
                                ]
                            ]
                        ],
                        "TABVIEW": {
                            "height": 0.45,
                            "data": [
                                {
                                    "tab_title": "Age",
                                    "visualization_type": "TILE",
                                    "tab_body": [
                                        {
                                            "label": "0-1 Years",
                                            "value": original.Table[0].msg.patient_dash_board[0].OPD_AGE[0].OPD0_1 || 0,
                                            "icon": "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"
                                        },
                                        {
                                            "label": "1-13 Years",
                                            "value": original.Table[0].msg.patient_dash_board[0].OPD_AGE[0].OPD1_13 || 0,
                                            "icon": "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"
                                        },
                                        {
                                            "label": "14-60 Years",
                                            "value": original.Table[0].msg.patient_dash_board[0].OPD_AGE[0].OPD14_60 || 0,
                                            "icon": "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"
                                        },
                                        {
                                            "label": "60 & Above Years",
                                            "value": original.Table[0].msg.patient_dash_board[0].OPD_AGE[0].OPD60_120 || 0,
                                            "icon": "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"
                                        }
                                    ]
                                },
                                {
                                    "tab_title": "Doctor",
                                    "visualization_type": "ROWS",
                                    "tab_body": DashBoardDoctorData(original.Table[0].msg.patient_dash_board[0].DOCTOR)
                                },
                                {
                                    "tab_title": "Speciality",
                                    "visualization_type": "ROWS",
                                    "tab_body": DashBoardSpecialityData(original.Table[0].msg.patient_dash_board[0].Speciality)
                                }
                            ]
                        },
                        "IS_SKIP_BUTTON_VISIBLE": true
                    },
                    {
                        "SLIDE_TITLE": "In Patient",
                        "SLIDE_STATUS": "SUCCESS",
                        "SLIDE_KEY": "IP",
                        "DEFAULT_DATE": "TODAY",
                        "IS_DATE_PICKER": false,
                        "IS_RELOAD": true,
                        "ROWS": [
                            [
                                [
                                    {
                                        "label": "Occupied",
                                        "icon": "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",
                                        "value": original.Table1[0].msg.patient_dash_board[0].IPD || 0,
                                        "type": "ICONBOX",
                                        "span": 0.49,
                                        "size": 30.0
                                    },
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "SEPARATOR",
                                        "span": 0.02,
                                        "size": 0.0
                                    },
                                    {
                                        "label": "Available",
                                        "icon": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnRJREFUeNrs3fFN8kAYwOGDMIAb2BEYoRvIBrqBbiBM4AiO4Ai6ASN0BNmgtrFGgpRi4Mq1PE/y/vMZ/czpL70DpCEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQj0U1RTVlM0XzbyCOrTB2RyRcveJAIMXE+nDlykMfnFofEAgIBAQCAgGBgECgRzfV5NXMLQX8jWMdfp/kez3y88qOgcGb78TxM5lAEEcIny2/3PmpgTiDMPQ43pvtlUM69BmHQBCHQBCHQBCHQBBHn3EIBHEIBHEIBHEIBHEIBBKJQyCkaJFKHJCah9D96tr/TH7E/+nVvFxlHAJBHLEDmSVwGKsnq+Y2HPcHLoxPnuo3NrtQFI/NogiCpE23HjmI/fbvefPoxLq5pIqDQYj99u/1w3UvkfaYxkQ/pB98+/czbKcKPygz1EBmHVud7MQ4POHDKM4gMQ7i4kAgLWcOcSCQFm/iQCD7PYWEn/SBSwZSXzWeLSkCab962FohkBb3lhOB7FefOzLLiUD2u7OUCKSdO/ogkI4tFggEBOLqAa4gIBAQCAgEBAICAYGAQEAgIBBAICAQEAgIBAQCAgGBwLic4xZsm2o+LCUJ2pz6BSah+1a3E+vMiJW2WOAMAgIBgYBAQCAgkGVwP26T5ixdQcAWCwQCAgGBgEBAICCQyFbh+yXzxpx7Vq4gYIsFAgGBgEBAIIBAQCAgEBAICAQEAgIBgYBAQCCAQEAgIBAQCAgEBAICAYGAQEAggEBAICAQEAgIBAQCAgGBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEMOXAAMA2Wm0ZGFrs2kAAAAASUVORK5CYII=",
                                        "value": "",// original.Table1[0].msg.patient_dash_board[0].IPD || 0,
                                        "type": "ICONBOX",
                                        "span": 0.49,
                                        "size": 30.0
                                    }
                                ]
                            ],
                            [
                                [
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "VERTICAL_SPACER",
                                        "span": 0.07,
                                        "size": 0.0
                                    }
                                ]
                            ],
                            [
                                [
                                    {
                                        "label": "Male",
                                        "icon": "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",
                                        "value": original.Table1[0].msg.patient_dash_board[0].IPD_GENDER[0].IPDM || 0,
                                        "type": "ICONBOX",
                                        "span": 0.29,
                                        "size": 23.0
                                    },
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "SEPARATOR",
                                        "span": 0.02,
                                        "size": 0.0
                                    },
                                    {
                                        "label": "Female",
                                        "icon": "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",
                                        "value": original.Table1[0].msg.patient_dash_board[0].IPD_GENDER[0].IPDF || 0,
                                        "type": "ICONBOX",
                                        "span": 0.29,
                                        "size": 23.0
                                    }
                                ],
                                [
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "HORIZONTAL_SPACER",
                                        "span": 0.07,
                                        "size": 0.0
                                    }
                                ],
                                [
                                    {
                                        "label": "LOS",
                                        "icon": "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",
                                        "value": 0,
                                        "type": "ICONBOX",
                                        "span": 0.33,
                                        "size": 23.0
                                    }
                                ]
                            ],
                            [
                                [
                                    {
                                        "label": "",
                                        "icon": "",
                                        "value": "",
                                        "type": "VERTICAL_SPACER",
                                        "span": 0.07,
                                        "size": 0.0
                                    }
                                ]
                            ]
                        ],
                        "TABVIEW": {
                            "height": 0.3,
                            "data": [
                                {
                                    "tab_title": "Age",
                                    "visualization_type": "TILE",
                                    "tab_body": [
                                        {
                                            "label": "0-1 Years",
                                            "value": original.Table1[0].msg.patient_dash_board[0].IPD_AGE[0].IPD0_1 || 0,
                                            "icon": "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",
                                        },
                                        {
                                            "label": "1-13 Years",
                                            "value": original.Table1[0].msg.patient_dash_board[0].IPD_AGE[0].IPD1_13 || 0,
                                            "icon": "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"
                                        },
                                        {
                                            "label": "14-60 Years",
                                            "value": original.Table1[0].msg.patient_dash_board[0].IPD_AGE[0].IPD14_60 || 0,
                                            "icon": "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"
                                        },
                                        {
                                            "label": "60 & Above Years",
                                            "value": original.Table1[0].msg.patient_dash_board[0].IPD_AGE[0].IPD60_120 || 0,
                                            "icon": "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"
                                        }
                                    ]
                                },
                                {
                                    "tab_title": "Doctor",
                                    "visualization_type": "ROWS",
                                    "tab_body": DashBoardDoctorData(original.Table1[0].msg.patient_dash_board[0].DOCTOR)
                                },
                                {
                                    "tab_title": "Speciality",
                                    "visualization_type": "ROWS",
                                    "tab_body": DashBoardSpecialityData(original.Table1[0].msg.patient_dash_board[0].Speciality)
                                }
                            ]
                        },
                        "IS_SKIP_BUTTON_VISIBLE": true
                    }
                ]





                //console.log(output);

                return res.status(200).json(output);
            }
            else {
                response.RES_OBJ = [];
                return res.status(200).json(response.RES_OBJ);
            }
        }).catch((error) => {
            // console.log("error", error)
            return res.status(500).json({ status: 500, statusmessage: 'FAIL', description: error });

        });
    }
    catch (ex) {
        //console.log("ex", ex)
        return res.status(500).json({ status: 500, statusmessage: 'FAIL', description: ex });
    }
});

router.post('/uprGetOutsideMedIns', (req, res) => {
    mapper(dbSchema.uprGetOutsideMedIns, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/getMobCounts', (req, res) => {
    mapper(dbSchema.getMobCounts, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFormWiseDataCnt', (req, res) => {
    mapper(dbSchema.getFormWiseDataCnt, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAdmnPatCriticalAdmission', (req, res) => {
    mapper(dbSchema.getAdmnPatCriticalAdmission, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdAdmnPatCriticalDet', (req, res) => {
    mapper(dbSchema.uprInsupdAdmnPatCriticalDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprGetAdmnPatCriticalDet', (req, res) => {
    mapper(dbSchema.uprGetAdmnPatCriticalDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdMedicationSaveJSON', (req, res) => {
    mapper(dbSchema.uprInsupdMedicationSaveJSON, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getScoresAssessment', (req, res) => {
    mapper(dbSchema.getScoresAssessment, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdScoresAssessment', (req, res) => {
    mapper(dbSchema.uprInsupdScoresAssessment, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetDschrgSumData', (req, res) => {
    mapper(dbSchema.uprGetDschrgSumData, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdAdmnPatRequest', (req, res) => {
    mapper(dbSchema.uprInsupdAdmnPatRequest, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetAdmnPatRequest', (req, res) => {
    mapper(dbSchema.uprGetAdmnPatRequest, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdDschrgSumShortUrl', (req, res) => {
    mapper(dbSchema.uprInsupdDschrgSumShortUrl, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetDschrgSumShortUrl', (req, res) => {
    mapper(dbSchema.uprGetDschrgSumShortUrl, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprInsupdCovid19Data', (req, res) => {
    mapper(dbSchema.uprInsupdCovid19Data, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetCovid19Data', (req, res) => {
    mapper(dbSchema.uprGetCovid19Data, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPatOTRequest', (req, res) => {
    mapper(dbSchema.uprInsupdPatOTRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatOtRequest', (req, res) => {
    mapper(dbSchema.uprGetPatOtRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetCv19TeleIpOp', (req, res) => {
    mapper(dbSchema.uprGetCv19TeleIpOp, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprInsupdCv19TeleIpOp', (req, res) => {
    mapper(dbSchema.uprInsupdCv19TeleIpOp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetCv19LabelTranInfo', (req, res) => {
    mapper(dbSchema.uprGetCv19LabelTranInfo, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdCv19LabelTranInfo', (req, res) => {
    mapper(dbSchema.uprInsupdCv19LabelTranInfo, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprGetCvd19VaccineRequest', (req, res) => {
    mapper(dbSchema.uprGetCvd19VaccineRequest, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdCv19VaccineJson', (req, res) => {
    mapper(dbSchema.uprInsupdCv19VaccineJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetCv19VaccineStock', (req, res) => {
    mapper(dbSchema.uprGetCv19VaccineStock, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/covidRegQuetions', (req, res) => {
    return res.json({
        "covidRegQuetions": cv19VaccineReqQuetions,
        "covidVaccineNames": vaccineNames
    });

});

router.post('/uprGetDschrdProcessReq', (req, res) => {
    mapper(dbSchema.uprGetDschrdProcessReq, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdDschrgProcessReq', (req, res) => {
    mapper(dbSchema.uprInsupdDschrgProcessReq, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdDschrgProcessReqJSON', (req, res) => {
    req.body.JSON = JSON.stringify(req.body.JSON)
    mapper(dbSchema.uprInsupdDschrgProcessReqJSON, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

/*endoscopy-----------------start*/

router.post('/uprGetProcedureServiceDet', (req, res) => {
    // console.log("req.body", req.body);
    mapper(dbSchema.uprGetProcedureServiceDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getProcdSrvcMaster', (req, res) => {
    mapper(dbSchema.getProcdSrvcMaster, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetProcdSrvcDet', (req, res) => {
    mapper(dbSchema.uprGetProcdSrvcDet, req.body, req.cParams).then((response) => {
        if (response && response.length > 0) {
            let finalResp = [{
                "template": response[0].FORMAT_NAME,
                "title": response[0].FORMAT_NAME,
                "layout": 1,
                "formatName": "",
                "formatCode": "",
                "isDefaultHeader": true,
                "isDefaultFooter": true,
                "headerTemplateUrl": "Relative_Path_Goes_Here_AAYUSH",
                "footerTemplateUrl": "Relative_Path_Goes_Here_AAYUSH",
                "isImageUploads": true,
                "maxVerticalImages": 3,
                "maxHorizontalImages": 3,
                "maxVerticalImagesList": [],
                "maxHorizontalImagesList": [],
                "patientInfo": {
                    "patName": "Name of patient",
                    "admnNo": ""
                },
                "formFields": ""
            }
            ]



            let _formFields = [];
            response = _.groupBy(response, "PARAMETER_TYPE")
            _.each(response, function (item, index) {
                //console.log(item)
                let childArr = []
                let childData = {}
                //console.log(item.length)
                for (let i = 0; i < item.length; i++) {

                    childData = {
                        "labelName": item[i].PARAMETER_NAME,
                        "labelType": index,
                        "labelCode": item[i].PARAMETER_CD,
                        "isMandatory": item[i].IS_MANDATORY,
                        "control": item[i].CONTROL_VAL,
                        "type": item[i].TYPE_VAL,
                        "value": item[i].REMARKS
                    }
                    childArr.push(childData);
                }
                //console.log(childArr.length)
                if (childArr.length > 1) {
                    _formFields.push({
                        labelName: index,
                        labelType: index,
                        labelCode: "",
                        isMandatory: item[0].IS_MANDATORY,
                        type: item[0].TYPE_VAL,
                        control: "HEADER",
                        children: childArr
                    })
                }
                else {
                    _formFields.push({
                        labelName: index,
                        labelType: index,
                        labelCode: item[0].PARAMETER_CD,
                        control: "TEXTBOX",//item[0].CONTROL_VAL,//
                        isMandatory: "",//item[0].IS_MANDATORY,//
                        type: "FORM_FIELD",//item[0].TYPE_VAL,//
                        value: item[0].REMARKS,
                        children: []
                    })
                }
            })
            finalResp[0].formFields = _formFields

            return res.json(finalResp);

        }
        else return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdProcdSrvcDet', (req, res) => {
    mapper(dbSchema.uprInsupdProcdSrvcDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetProcedSrvcRep', (req, res) => {
    mapper(dbSchema.uprGetProcedSrvcRep, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdProcdSrvcRep', (req, res) => {
    mapper(dbSchema.uprInsupdProcdSrvcRep, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdProcdSrvcDetJSON', (req, res) => {
    mapper(dbSchema.uprInsupdProcdSrvcDetJSON, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsProcdServices', (req, res) => {
    mapper(dbSchema.uprInsProcdServices, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIntgServices', (req, res) => {
    mapper(dbSchema.uprGetIntgServices, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
/*endoscopy----------------------end*/
router.post('/uprGetApptSchRep', (req, res) => {
    mapper(dbSchema.uprGetApptSchRep, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/getGroupParamMap', (req, res) => {
    mapper(dbSchema.getGroupParamMap, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insupdLabParamValue', (req, res) => {
    req.body.lab_param_json = JSON.stringify(req.body.lab_param_json)
    mapper(dbSchema.insupdLabParamValue, req.body, req.cParams).then((response) => {
        return res.status(200).json({ status: response.RES_OBJ });
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/insupdLabGroup', (req, res) => {
    req.body.lab_group_json = JSON.stringify(req.body.lab_group_json)
    mapper(dbSchema.insupdLabGroup, req.body, req.cParams).then((response) => {
        return res.status(200).json({ status: response.RES_OBJ });
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getLabGroup', (req, res) => {
    mapper(dbSchema.getLabGroup, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getLabParamValue', (req, res) => {
    mapper(dbSchema.getLabParamValue, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdClinicManagementJson', (req, res) => {
    let params = {
        "JSON": JSON.stringify(req.body.JSON),
        "CONTEXT": req.body.CONTEXT,
        "IP_SESSION_ID": req.body.IP_SESSION_ID
    }
    mapper(dbSchema.uprInsupdClinicManagementJson, params).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprCmGetStitemsMaster', (req, res) => {
    mapper(dbSchema.uprCmGetStitemsMaster, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprCmGetInvsMaster', (req, res) => {
    mapper(dbSchema.uprCmGetInvsMaster, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/GetCmDoctor', (req, res) => {
    mapper(dbSchema.GetCmDoctor, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetClinicsMasterTypes', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.uprGetClinicsMasterTypes, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdPatDietDet', (req, res) => {
    req.body.FORM_TYPE_JSON = JSON.stringify(req.body.FORM_TYPE_JSON)
    mapper(dbSchema.uprInsupdPatDietDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetPatDietDet', (req, res) => {
    mapper(dbSchema.uprGetPatDietDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprInsupdFormLabelTamplate', (req, res) => {
    mapper(dbSchema.uprInsupdFormLabelTamplate, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetFormLabelTamplate', (req, res) => {
    mapper(dbSchema.uprGetFormLabelTamplate, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetMediInvsOrder', (req, res) => {
    mapper(dbSchema.uprGetMediInvsOrder, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetMasterDataNst', (req, res) => {
    mapper(dbSchema.uprGetMasterDataNst, req.body, req.cParams).then((response) => {
        return res.json(response.RES_OBJ);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdHimsLabParamsMaster', (req, res) => {
    req.body.LAB_PARAMS_JSON = JSON.stringify(req.body.LAB_PARAMS_JSON)
    mapper(dbSchema.uprInsupdHimsLabParamsMaster, req.body).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetHimsLabParamsMaster', (req, res) => {
    mapper(dbSchema.uprGetHimsLabParamsMaster, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getFormFieldDet', (req, res) => {
    mapper(dbSchema.getFormFieldDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getFormFieldMaster', (req, res) => {
    mapper(dbSchema.getFormFieldMaster, req.body, req.cParams).then((response) => {
        // console.log(response)
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/InsFormFieldDet', (req, res) => {
    //req.body.FIELD_JSON=JSON.stringify(req.body.FIELD_JSON)
    mapper(dbSchema.InsFormFieldDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpFraPsNcpReport', (req, res) => {
    mapper(dbSchema.uprGetIpFraPsNcpReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/genratePdfDataAsBase64', async (req, res) => {

    let payload = req.body;
    var locDetails = _.find(pdfConst.LOC_ARR, function (loc) { if (loc.LOC_ID == payload.LOC_ID) return loc })
    var typHtml = _.find(pdfConst.PRNT_RPT_ARR, function (obj) { if (obj.typ == payload.IP_FORM_TYPE_CD) return obj.htm }), sTime, eTime;
    if (typHtml) {
        sTime = new Date();
        payload.RPT_FILE_NAME = typHtml.htm;
        payload.RPT_FILE_DOC_NAME = typHtml.name;
        payload.PDF_URL = payload.VISIT_TYPE == "OP" ? locDetails.OP_PDF_URL : (payload.VISIT_TYPE == "IP") ? locDetails.IP_PDF_URL : "";
        payload.PDF_PATH = locDetails.ROOT_PATH + locDetails.ORG_NAME + "/" + locDetails.LOC_NAME + "/" + locDetails.IP_REPORT_PATH;
        if (!payload.VISIT_DT) payload.VISIT_DT = new Date();
        //console.log("payload",payload)
        let bufData = await createRpt(payload, locDetails.API_URL, locDetails.UPLOAD_DMS, locDetails);
        return res.json({ status: 200, data: bufData, formName: typHtml.name })
    }
    else {
        return res.status(400).json({ status: 400, data: `No Report Template Found To generate Pdf ${payload.IP_FORM_TYPE_CD}` })
    }
});
router.post('/uprInsupdPatDocChat', (req, res) => {
    req.body.MSG_VAL = JSON.stringify(req.body.MSG_VAL)
    mapper(dbSchema.uprInsupdPatDocChat, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetPatDocChat', (req, res) => {
    mapper(dbSchema.uprGetPatDocChat, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetIpAdmnDschrgDashboard', (req, res) => {
    mapper(dbSchema.uprGetIpAdmnDschrgDashboard, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


/*Medication prescription and ordering*/
router.post('/uprGetNurseOrder', (req, res) => {
    mapper(dbSchema.uprGetNurseOrder, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprInsupdNurseOrder', (req, res) => {
    mapper(dbSchema.uprInsupdNurseOrder, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprGetMedicationAdministred', (req, res) => {
    mapper(dbSchema.uprGetMedicationAdministred, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprInsupdMedicationAdinistred', (req, res) => {
    mapper(dbSchema.uprInsupdMedicationAdinistred, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprInsupdMedicationJson', (req, res) => {
    mapper(dbSchema.uprInsupdMedicationJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insUpdMedAdministrationJson', (req, res) => {
    mapper(dbSchema.insUpdMedAdministrationJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetIpAdmnDschrgDashboard', (req, res) => {
    mapper(dbSchema.uprGetIpAdmnDschrgDashboard, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getMedAdministrationData', (req, res) => {
    mapper(dbSchema.getMedAdministrationData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insUpdMedManualReceivalJson', (req, res) => {
    mapper(dbSchema.insUpdMedManualReceivalJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdMobChatApp', (req, res) => {
    req.body.CHAT_JSON = JSON.stringify(req.body.CHAT_JSON)
    mapper(dbSchema.uprInsupdMobChatApp, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetMobChatApp', (req, res) => {
    mapper(dbSchema.uprGetMobChatApp, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});



router.post('/getMedicationsIndentsHistory', (req, res) => {
    mapper(dbSchema.getMedicationsIndentsHistory, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdEntMediAssmntJson', (req, res) => {
    mapper(dbSchema.uprInsupdEntMediAssmntJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetEntMediAssmnt', (req, res) => {
    mapper(dbSchema.uprGetEntMediAssmnt, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insupdAllScoresDataJson', (req, res) => {
    mapper(dbSchema.insupdAllScoresDataJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getAllScoresData', (req, res) => {
    mapper(dbSchema.getAllScoresData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetEolCareAssessment', (req, res) => {
    if (req.body.FORM_TYPE_CD === "EMTRASMT" && req.body.FLAG === "T") {
        req.cParams.IS_MULTI_RESULTSET = "Y";
        mapper(dbSchema.uprGetEolCareAssessment, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            return res.status(400).send(error);
        });
    }
    else {
        mapper(dbSchema.uprGetEolCareAssessment, req.body, req.cParams).then((response) => {
            return res.json(response);
        }).catch((error) => {
            return res.status(400).send(error);
        });
    }
});


router.post('/uprInsupdEolCareAssessmentJson', (req, res) => {
    mapper(dbSchema.uprInsupdEolCareAssessmentJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
/*router.post('/ipExpenditure', (req, res) => {
    try{
    //console.log("ipExpenditure",req.body);
   axios.post("https://nodeapi.drramesh.com/radmb/radiology/api/" + "onBedDtls", req.body).then(async function (response) {
            //console.log("ipExpenditure_response",req.body);
            if (response && response.SQL_ERROR) {
                return res.status(400).send(sCodes.findCode(400, response));
            }
            else if (response && response.length > 0) {
                return res.json(response);
            }
            else {
                response = [];
                return res.json(response);
            }
        }).catch(function (ex) {
            if (ex && ex.response && ex.response.status) return res.status(ex.response.status).send(sCodes.findCode(ex.response.status, ex.response.data));
            else return res.status(500).send(sCodes.findCode(500, ex));
        });
        }
    catch (ex) {
        console.log("ex", ex)
        return res.status(500).json({ status: 500, statusmessage: 'FAIL', description: ex });
    }
});*/
router.post('/getHeartFailure', (req, res) => {
    mapper(dbSchema.getHeartFailure, req.body, req.cParams).then((response) => {
        if (req.body.FLAG == 'M') return res.send(response[0].DATA_JSON);
        else if (req.body.FLAG == 'T') {
            response[0].DATA_JSON = JSON.parse(response[0].DATA_JSON)
            return res.send(response);
        }
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insupdHeartFailure', (req, res) => {
    //console.log("req.body",req.body)
    mapper(dbSchema.insupdHeartFailure, req.body, req.cParams).then((response) => {
        // console.log("response",response)
        return res.json(response);
    }).catch((error) => {
        //console.log(error)
        return res.status(400).send(error);
    });
})


router.post('/ipExpenditure', async (req, res) => {
    try {
        let data = {
            twoLakhs: [],
            oneLakhs: [],
            abovefifty: [],
            belowfifty: [],
            balancecleared: []
        }
        let URL = url(req.body.LOC_ID)
        //console.log("ipExpenditure",req.body)
        axios.post(`${URL}` + "ipExpenditure", req.body).then(async function (response) {
            //console.log("req.body",response)
            if (response && response.length > 0) {
                if (req.body.METHOD == "ONBEDPAT_DETLS") {
                    //if (req.body.ADMN_NO.length > 0) {
                    //let _resp = getDataByAdmno(response,req.body.ADMN_NO);
                    //return res.json(_resp)
                    //}
                    //console.log("ONBEDPAT_DETLS",response)
                    for (let i in response) {
                        //console.log("ONBEDPAT_DETLS",response[i].APPBILLAMOUNT)
                        response[i].APPBILLAMOUNT = parseInt(response[i].APPBILLAMOUNT)
                        if (response[i].APPBILLAMOUNT >= 200000) {
                            data.twoLakhs.push(response[i])
                        }
                        if (response[i].APPBILLAMOUNT >= 100000 && response[i].APPBILLAMOUNT < 200000) {
                            data.oneLakhs.push(response[i])
                        }
                        if (response[i].APPBILLAMOUNT >= 50000 && response[i].APPBILLAMOUNT < 100000) {
                            data.abovefifty.push(response[i])
                        }
                        if (response[i].APPBILLAMOUNT < 50000) {
                            data.belowfifty.push(response[i])
                        }
                    }
                    return res.json(data);
                }
                return res.json(response)
            }
            else {
                response = [];
                return res.send(response)
            }
        }).catch(function (ex) {
            return ex;
        });

    }
    catch (ex) {
        return res.send(500, ex);
    }
});

router.post('/getPendingApprovals', async (req, res) => {
    try {
        let URL = url(req.body.LOC_ID)
        axios.post(`${URL}` + "getPendingApprovals", req.body).then(async function (response) {
            if (response && response.length > 0) {
                return res.json(response)
            }
            else {
                response = [];
                return res.send(response)
            }
        }).catch(function (ex) {
            return ex;
        });
    }
    catch (ex) {
        return res.send(500, ex);
    }
});

router.post('/getRadiology', async (req, res) => {
    try {
        let URL = uri(req.body.SessionId);
        let method = req.body.method;
        axios.post(`${URL}` + `${method}`, req.body).then(async function (response) {
            if (response && response.length > 0) {
                return res.json(response)
            }
            else {
                response = [];
                return res.send(response)
            }
        }).catch(function (ex) {
            return res.send(500, ex);
        });
    }
    catch (ex) {
        return res.send(500, ex);
    }
});
router.post('/uprUpdMlcExpiredDetails', (req, res) => {
    mapper(dbSchema.uprUpdMlcExpiredDetails, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetDoctorUpdate', (req, res) => {
    mapper(dbSchema.uprGetDoctorUpdate, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpReportsHandoverTool', (req, res) => {
    mapper(dbSchema.uprGetIpReportsHandoverTool, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetDocDyncReport', (req, res) => {
    mapper(dbSchema.uprGetDocDyncReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpemrDyncReport', (req, res) => {
    mapper(dbSchema.uprGetIpemrDyncReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetDissumDyncReport', (req, res) => {
    mapper(dbSchema.uprGetDissumDyncReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetDietReport', (req, res) => {
    mapper(dbSchema.uprGetDietReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getIpRepNurreasmnt', (req, res) => {
    mapper(dbSchema.getIpRepNurreasmnt, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.get('/getAvailableSlots', (req, res) => {
    mapper(dbSchema.uprGetIntgSlotsAvailable, req.query, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getAvailableSlots', (req, res) => {
    mapper(dbSchema.getAvailableSlots, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetFieldDetReport', (req, res) => {
    mapper(dbSchema.uprGetFieldDetReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprGetOpemrReportRamesh', (req, res) => {
    mapper(dbSchema.uprGetOpemrReportRamesh, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetFieldDetReport', (req, res) => {
    mapper(dbSchema.uprGetFieldDetReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetIpRepErinitasmnt', (req, res) => {
    mapper(dbSchema.uprGetIpRepErinitasmnt, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getERAdmnDtls', (req, res) => {
    mapper(dbSchema.getERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdAdmnNoDtls', (req, res) => {
    mapper(dbSchema.InsUpdAdmnNoDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updERAdmnDtls', (req, res) => {
    mapper(dbSchema.updERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/DelERAdmnDtls', (req, res) => {
    mapper(dbSchema.DelERAdmnDtls, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsErAdmissionDetails', (req, res) => {
    mapper(dbSchema.uprInsErAdmissionDetails, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetAdminReqGrid', (req, res) => {
    mapper(dbSchema.GetAdminReqGrid, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/UprInsAdmnRqstn', (req, res) => {
    mapper(dbSchema.UprInsAdmnRqstn, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetIpWardPatientDetDaycare', (req, res) => {
    mapper(dbSchema.uprGetIpWardPatientDetDaycare, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpDocumentFormDept', (req, res) => {
    mapper(dbSchema.uprGetIpDocumentFormDept, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprUpdIpDocumentDetails', (req, res) => {
    mapper(dbSchema.uprUpdIpDocumentDetails, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdFormLableDocMap', (req, res) => {
    mapper(dbSchema.uprInsupdFormLableDocMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetFormLableDocMap', (req, res) => {
    mapper(dbSchema.uprGetFormLableDocMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetDynamicFormData', (req, res) => {
    mapper(dbSchema.uprGetDynamicFormData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
})

router.post('/uprGetOpemrDyncReport', (req, res) => {
    mapper(dbSchema.uprGetOpemrDyncReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetFormsWiseCountRpt', (req, res) => {
    mapper(dbSchema.uprGetFormsWiseCountRpt, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetAdmnCriticalDet', (req, res) => {
    mapper(dbSchema.uprGetAdmnCriticalDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    })

});

router.post('/getFormPrintPdf', (req, res) => {
    mapper(dbSchema.getFormPrintPdf, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpDeathMlcReport', (req, res) => {
    mapper(dbSchema.uprGetIpDeathMlcReport, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    })
})

router.post('/uprGetErDetSummaryReport', (req, res) => {
    mapper(dbSchema.uprGetErDetSummaryReport, req.body, req.cParams).then((response) => {
        //console.log("vikram1",response)
        return res.json(response);
    }).catch((error) => {
        //console.log("vikram2",error)
        return res.status(400).send(error);
    });
});


router.post('/uprGetMedicationDetIp', (req, res) => {
    mapper(dbSchema.uprGetMedicationDetIp, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprInsPatEcgData', (req, res) => {
    mapper(dbSchema.uprInsPatEcgData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

router.post('/uprGetIpAsmntHandovr', (req, res) => {
    mapper(dbSchema.uprGetIpAsmntHandovr, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

router.post('/getVisitsMob', (req, res) => {
    mapper(dbSchema.getVisitsMob, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

router.post('/uprPhrInsupdMediPharmaApv', (req, res) => {
    mapper(dbSchema.uprPhrInsupdMediPharmaApv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/uprInsupdLabelTranInfoJson', (req, res) => {
    req.body.LABEL_JSON = JSON.stringify(req.body.LABEL_JSON)
    mapper(dbSchema.uprInsupdLabelTranInfoJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetBookedAppointments', (req, res) => {
    mapper(dbSchema.uprGetBookedAppointments, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/uprGetPatDetAutoSrch', (req, res) => {
    mapper(dbSchema.uprGetPatDetAutoSrch, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsUpdSrvcMaster', (req, res) => {
    mapper(dbSchema.uprInsUpdSrvcMaster, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

/******************************************************* Auto Complete Methods ***************************************************************/
/*
 * This is get Method That was used in auto complete in this params came from req.query, so we need to parse
        those params into database params by calling generateParams method
 * Set IS_LOAD_AJAX to 'Y' and URL to custom method in cParams Object based on this we parse response
 * call generate paramaters function
*/

router.get('/getComponentAuto', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "getComponentAuto";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.getComponentAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/* already there
   Manval chages done here because getAllDoctors POST methods already there
*/
router.get('/getAllDoctors', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "getAllDoctors";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/uprGetSlotStatus', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "uprGetSlotStatus";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.uprGetSlotStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/uprInsIntgFutSlotMan', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "uprInsIntgFutSlotMan";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.uprInsIntgFutSlotMan, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAutoMedications', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoMedications";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAutoMedications, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAutoInvest', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoInvest";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAutoInvest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetDocSrchByNmSpcl', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetDocSrchByNmSpcl";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetDocSrchByNmSpcl, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetOrg', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetOrg";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetOrg, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetOrgAsistant', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetOrgAsistant";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetOrgAsistant, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetUsrRefName', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetUsrRefName";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetUsrRefName, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetUsersAuto', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetUsersAuto";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetUsersAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/* already there
   Manval chages done here because GetPatAuto POST methods already there
*/
router.get('/GetPatAuto', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetPatAuto";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetPatAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/getDesignationList', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "getDesignationList";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.getDesignationList, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetPatIndentAutoCmplt', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetPatIndentAutoCmplt";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetPatIndentAutoCmplt, req.query, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});



/* already there
   Manval chages done here because GetAutoComplete POST methods already there
*/
router.get('/GetAutoComplete', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoComplete";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAutoComplete, req.query, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAllServcs', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAllServcs";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAllServcs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetSearchSrv', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetSearchSrv";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetSearchSrv, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetHealthServices', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetHealthServices";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetHealthServices, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetMediSpanDrug', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetMediSpanDrug";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetMediSpanDrug, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/* already there
   Manval chages done here because getSrvcInvs POST methods already there
*/
router.get('/getSrvcInvs', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "getSrvcInvs";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.getSrvcInvs, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAutoAllergies', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoAllergies";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAutoAllergies, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAutoCond', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoCond";
    req.body = generateParams(req.query, req.cParams);
    // console.log("GetAutoCond",req.body,req.cParams.URL,req.cParams.IS_LOAD_AJAX)
    mapper(dbSchema.GetAutoCond, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetComplaintsAuto', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetComplaintsAuto";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetComplaintsAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAreaAuto', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAreaAuto";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAreaAuto, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetOlrPatSrch', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetOlrPatSrch";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetOlrPatSrch, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/getOrgLocUsers', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "getOrgLocUsers";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.getOrgLocUsers, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/GetAutoEntities', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "GetAutoEntities";
    req.body = generateParams(req.query, req.cParams);

    mapper(dbSchema.GetAutoEntities, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/uprUpdIntgSlotHold', (req, res) => {
    req.cParams.IS_LOAD_AJAX = 'Y';
    req.cParams.URL = "uprUpdIntgSlotHold";
    req.body = generateParams(req.query, req.cParams);
    mapper(dbSchema.uprUpdIntgSlotHold, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/*Generate-pdf*/

router.get('/pdfcreator', (request, response) => {

    var options = {
        height: '297mm',
        width: '210mm',
        orientation: "portrait",
        header: header,
        footer: footer

    };
    let pdfLogPath = appConfig.DIR_PATH + "public/logs/gen-pdf/";
    //console.log("pdf path",pdfLogPath);


    var document = {
        html: html,
        data: {},
        path: `${pdfLogPath}${uuidv4()}-output.pdf`,
        type: 'pdf',
    };

    console.time();
    CreatePdf.create(document, options).then((res) => {
        //console.log(res);
        console.timeEnd();
        response.send(`pdf created.....`)

    }).catch((error) => {
        console.error(error);
    });
})





/*******************************************************End Auto Complete Methods ***************************************************************/
// don't copy any methods from autocomplete block

module.exports = router;
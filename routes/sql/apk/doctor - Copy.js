'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "DOCTOR_APK";
const dbSchema = require("../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
const responseChange = require("../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../db-config/helper-methods/sql/generate-parameters");
const mapper = require("../../../db-config/mapper");

router.all('/*', (req, res, next) => {
    try {
		//console.log(req.body)
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
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});

router.post('/getMasterData', (req, res) => {
	if(req.body.IS_MULTY_SET=="Y"){
		
	req.cParams.IS_MULTI_RESULTSET = "Y";
	}
	//console.log("req.body---getMasterData",req.cParams,req.headers);
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getOpClinicalData', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpClinicalData', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/mobileSlotBook', (req, res) => {
    mapper(dbSchema.mobileSlotBook, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/mobileSlotCancel', (req, res) => {
    mapper(dbSchema.mobileSlotCancel, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/mediFav', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/invsFav', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/mediOrderSet', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/invsOrderSet', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updSlotCheckInOutStatus', (req, res) => {
    mapper(dbSchema.updSlotCheckInOutStatus, req.body, req.cParams).then((response) => {
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

router.post('/getSrvcAuto', (req, res) => {
    mapper(dbSchema.getSrvcAuto, req.body, req.cParams).then((response) => {
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

router.post('/invsOrder', (req, res) => {
    mapper(dbSchema.invsOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/medicationOrder', (req, res) => {
    mapper(dbSchema.medicationOrder, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getFrequencyMaster', (req, res) => {
    mapper(dbSchema.getFrequencyMaster, req.body, req.cParams).then((response) => {
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
router.post('/updSlotHoldStatus', (req, res) => {
    mapper(dbSchema.updSlotHoldStatus, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

	
router.post('/updrecommFollowUpAdviceMob', (req, res) => {
	//console.log('updrecommFollowUpAdviceMob');
    mapper(dbSchema.updrecommFollowUpAdviceMob, req.body, req.cParams).then((response) => {
		//console.log(response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updIpVisitNotesMob', (req, res) => {
    mapper(dbSchema.updIpVisitNotesMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updRecommFollowUpAdviseMobDNDH', (req, res) => {
    mapper(dbSchema.updRecommFollowUpAdviseMobDNDH, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updInvsOrderMob', (req, res) => {
    mapper(dbSchema.updInvsOrderMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/updMedicationsMob', (req, res) => {
    mapper(dbSchema.updMedicationsMob, req.body, req.cParams).then((response) => {
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
router.post('/updLabelTranInfoMob', (req, res) => {
	if(req.body.REFERENCE_ID === 'null')
		req.body.REFERENCE_ID = 0;
    mapper(dbSchema.updLabelTranInfoMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getLabelTranInfoMob', (req, res) => {
    mapper(dbSchema.getLabelTranInfoMob, req.body, req.cParams).then((response) => {
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

router.post('/insUpdpatientDianosis', (req, res) => {
    mapper(dbSchema.insUpdpatientDianosis, req.body, req.cParams).then((response) => {
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

router.post('/InsUpdVitalSigns', (req, res) => {
    mapper(dbSchema.InsUpdVitalSigns, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/insUpdVitalSignsMob', (req, res) => {
    mapper(dbSchema.insUpdVitalSignsMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdQms', (req, res) => {
    mapper(dbSchema.insUpdQms, req.body, req.cParams).then((response) => {
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

router.post('/chngSltType', (req, res) => {
    mapper(dbSchema.chngSltType, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/insUpdRecommHandoverMobDH', (req, res) => {
    mapper(dbSchema.insUpdRecommHandoverMobDH, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getConsltsByDate', (req, res) => {
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSlotApmtMob', (req, res) => {
    mapper(dbSchema.getSlotApmtMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsPatientEcgData', (req, res) => {
    mapper(dbSchema.UprInsPatientEcgData, req.body, req.cParams).then((response) => {
       // console.log("UprInsPatientEcgData",response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		
        res.status(400).send(error);
    });
});

router.post('/getVisitsMob', (req, res) => {
    mapper(dbSchema.getVisitsMob, req.body, req.cParams).then((response) => {
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

router.post('/InsUpdTMDet', (req, res) => {
    mapper(dbSchema.InsUpdTMDet, req.body, req.cParams).then((response) => {
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

router.post('/getCriticalValViewDoctor', (req, res) => {
    mapper(dbSchema.getCriticalValViewDoctor, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprGetMobileCounts', (req, res) => {
    mapper(dbSchema.uprGetMobileCounts, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getMobFmd', (req, res) => {
    mapper(dbSchema.getMobFmd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCntsDataMob', (req, res) => {
    mapper(dbSchema.getCntsDataMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatEcgData', (req, res) => {
    mapper(dbSchema.uprGetPatEcgData, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetDocPaMapMob', (req, res) => {
    mapper(dbSchema.uprGetDocPaMapMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprPhrInsupdPatDiagnosisMob', (req, res) => {
    mapper(dbSchema.uprPhrInsupdPatDiagnosisMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdIpConsVisitMob', (req, res) => {

    mapper(dbSchema.uprInsupdIpConsVisitMob, req.body, req.cParams).then((response) => {

        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		
        res.status(400).send(error);
    });
});

router.post('/uprInsPatEcgDataMob', (req, res) => {
	//console.log("uprInsPatEcgDataMob----req.body",req.body);
    mapper(dbSchema.uprInsPatEcgDataMob, req.body, req.cParams).then((response) => {
		//console.log("uprInsPatEcgDataMob----response",response);
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
		//console.log("uprInsPatEcgDataMob----error",error);
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPatientReqDet', (req, res) => {
    mapper(dbSchema.uprInsupdPatientReqDet, req.body, req.cParams).then((response) => {
		//console.log(req.body,response);
        return res.status(200).json(response);
    }).catch((error) => {
		console.log(req.body,"error:",error);
        res.status(400).send(error);
    });
});

router.post('/uprGetEcgDataDetMob', (req, res) => {
    mapper(dbSchema.uprGetEcgDataDetMob, req.body, req.cParams).then((response) => {
	//console.log("response----------uprGetEcgDataDetMob",response)
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAllAssmntAudit', (req, res) => {
    mapper(dbSchema.getAllAssmntAudit, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getAptReqMob', (req, res) => {
    mapper(dbSchema.getAptReqMob, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprGetCriticalValViewDoctor', (req, res) => {
    mapper(dbSchema.uprGetCriticalValViewDoctor, req.body, req.cParams).then((response) => {
        
        return res.status(200).json(response);
    }).catch((error) => {
        console.log(req.body, error)
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

router.post('/uprInsupdAdmnPatCriticalDet', (req, res) => {
    mapper(dbSchema.uprInsupdAdmnPatCriticalDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetCritInfoCounts', (req, res) => {
    mapper(dbSchema.uprGetCritInfoCounts, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/InsUpdImage', (req, res) => {
    req.body.IP_IMAGE_DATA = Buffer.from(req.body.IP_IMAGE_DATA)

    mapper(dbSchema.InsUpdImage, req.body, req.cParams).then((response) => {

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

router.post('/getReasonForVisit', (req, res) => {
    mapper(dbSchema.getReasonForVisit, req.body, req.cParams).then((response) => {
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

router.post('/getAllDoctors', (req, res) => {
    
    mapper(dbSchema.getAllDoctors, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetIcdMob', (req, res) => {
	req.cParams.IS_MULTI_RESULTSET = "Y";    
    mapper(dbSchema.uprGetIcdMob, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIPPatInsulin', (req, res) => {
    //console.log("req.body",req.body)
    mapper(dbSchema.getIPPatInsulin, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdConditions', (req, res) => {
    //console.log("req.body",req.body)
    mapper(dbSchema.InsUpdConditions, req.body, req.cParams).then((response) => {
		//console.log("response",response)
        return res.status(200).json(response);
    }).catch((error) => {
		//console.log("error",error)
        res.status(400).send(error);
    });
});

router.post('/uprGetPatMediNotifications', (req, res) => {
    mapper(dbSchema.uprGetPatMediNotifications, req.body, req.cParams).then((response) => {
		return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCriticalCareInfo', (req, res) => {
    mapper(dbSchema.getCriticalCarchrtDet, req.body, req.cParams).then((response) => {
		return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getSuppQury', (req, res) => {
    mapper(dbSchema.getSuppQury, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

/*care countunity-----------------------------start-----------------------------------------*/

router.post('/getIpCareContinnum', (req, res) => {
    mapper(dbSchema.getIpCareContinnum, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpEmployee', (req, res) => {
    mapper(dbSchema.getIpEmployee, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetClinicalPathwayParam', (req, res) => {
	req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.GetClinicalPathwayParam, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpClinicalPathwayInfo', (req, res) => {
    mapper(dbSchema.getIpClinicalPathwayInfo, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpPatDet', (req, res) => {
    mapper(dbSchema.getIpPatDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsUpdCareContinnumOrtho', (req, res) => {
    mapper(dbSchema.InsUpdCareContinnumOrtho, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getDisSum', (req, res) => {
    mapper(dbSchema.getDisSum, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/UprInsupdIpClinicalPathwayInfo', (req, res) => {
    mapper(dbSchema.UprInsupdIpClinicalPathwayInfo, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
/*care countunity----------------------------------end*/

router.post('/getIpFraPsNcp', (req, res) => {
    mapper(dbSchema.getIpFraPsNcp, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getIpFraPsNcp1', (req, res) => {
    mapper(dbSchema.getIpFraPsNcp1, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/GetMewScor', (req, res) => {
    mapper(dbSchema.GetMewScor, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetAutoCond', (req, res) => {
    mapper(dbSchema.GetAutoCond, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/deleteRefRec', (req, res) => {
    mapper(dbSchema.DeleteRefRec, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getDocFavCptPcsIcd', (req, res) => {
    mapper(dbSchema.GetDocFavCptPcsIcd, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPatiComplaintData', (req, res) => {
    mapper(dbSchema.uprInsupdPatiComplaintData, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatiComplaintData', (req, res) => {
    mapper(dbSchema.uprGetPatiComplaintData, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetNurCPDet', (req, res) => {
    mapper(dbSchema.GetNurCPDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getRsrcNots1', (req, res) => {
    mapper(dbSchema.getRsrcNots1, req.body, req.cParams).then((response) => {
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

router.post('/uprInsupdAdmnPatRequest', (req, res) => {
    mapper(dbSchema.uprInsupdAdmnPatRequest, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetAdmnPatRequest', (req, res) => {
    mapper(dbSchema.uprGetAdmnPatRequest, req.body, req.cParams).then((response) => {
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

router.post('/uprInsupdCovid19Data', (req, res) => {
    mapper(dbSchema.uprInsupdCovid19Data, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetCovid19Data', (req, res) => {
    mapper(dbSchema.uprGetCovid19Data, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdIpFraPsNcpMob', (req, res) => {
    mapper(dbSchema.uprInsupdIpFraPsNcpMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetMediInvsOrdersDet', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET="Y"
    mapper(dbSchema.uprGetMediInvsOrdersDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdNurCarePlanInfoMob', (req, res) => {
    mapper(dbSchema.uprInsupdNurCarePlanInfoMob, req.body, req.cParams).then((response) => {
        res.json(responseChange(response, req.cParams));
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetFormMasterJson', (req, res) => {
    mapper(dbSchema.uprGetFormMasterJson, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdJson', (req, res) => {
    mapper(dbSchema.uprInsupdJson, req.body, req.cParams).then((response) => {
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

router.post('/updSupQry', (req, res) => {
    mapper(dbSchema.updSupQry, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdAuditLogInfo', (req, res) => {
    mapper(dbSchema.InsupdAuditLogInfo, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdDschrgProcessReq', (req, res) => {
    mapper(dbSchema.uprInsupdDschrgProcessReq, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetDschrdProcessReq', (req, res) => {
    mapper(dbSchema.uprGetDschrdProcessReq, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdDschrgProcessReqJSON', (req, res) => {
    mapper(dbSchema.uprInsupdDschrgProcessReqJSON, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getAdmissionGrid', (req, res) => {
    mapper(dbSchema.getAdmissionGrid, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getChkEvntDetails', (req, res) => {
    mapper(dbSchema.getChkEvntDetails, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEvents', (req, res) => {
    mapper(dbSchema.getEvents, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetProcdSrvcRep', (req, res) => {
    mapper(dbSchema.uprGetProcdSrvcRep, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getProcdSrvcMaster', (req, res) => {
    mapper(dbSchema.getProcdSrvcMaster, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetProcdsrvcDet', (req, res) => {
    mapper(dbSchema.uprGetProcdsrvcDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprInsupdProcdSrvcDetJSON', (req, res) => {
    mapper(dbSchema.uprInsupdProcdSrvcDetJSON, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetProcedureServiceDet', (req, res) => {
    mapper(dbSchema.uprGetProcedureServiceDet, req.body, req.cParams).then((response) => {
       return res.status(200).json(response);
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

router.post('/getVcSlotDet', (req, res) => {
    mapper(dbSchema.getVcSlotDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/InsMsgVideoCons', (req, res) => {
    mapper(dbSchema.InsMsgVideoCons, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPatientRequests', (req, res) => {
    mapper(dbSchema.uprInsupdPatientRequests, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/InsUpdPageDetails', (req, res) => {
    mapper(dbSchema.InsUpdPageDetails, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/InsUpdFRAPSNCP', (req, res) => {
    mapper(dbSchema.InsUpdFRAPSNCP, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdIpApacheScore', (req, res) => {
    mapper(dbSchema.InsupdIpApacheScore, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/UprUpdMewsScore', (req, res) => {
    mapper(dbSchema.UprUpdMewsScore, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});



router.post('/UprInsupdAldScoSys', (req, res) => {
    mapper(dbSchema.UprInsupdAldScoSys, req.body, req.cParams).then((response) => {
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
router.post('/GetChkRevisit', (req, res) => {
    mapper(dbSchema.GetChkRevisit, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getCheckApmntDet', (req, res) => {
    mapper(dbSchema.getCheckApmntDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getNursInitAssmnt', (req, res) => {
    mapper(dbSchema.getNursInitAssmnt, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getEntMulty', (req, res) => {
    mapper(dbSchema.getEntMulty, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getProfSetupDet', (req, res) => {
    mapper(dbSchema.getProfSetupDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsQgeneration', (req, res) => {
    mapper(dbSchema.InsQgeneration, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/UpdSkipQno', (req, res) => {
    mapper(dbSchema.UpdSkipQno, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/ChangeQno', (req, res) => {
    mapper(dbSchema.ChangeQno, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/InsCheckIn_Out', (req, res) => {
    mapper(dbSchema.InsCheckIn_Out, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/GetRecommNew', (req, res) => {
    mapper(dbSchema.GetRecommNew, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprUpdSlotsAllMob', (req, res) => {
    mapper(dbSchema.uprUpdSlotsAllMob, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/InsFormFieldDet', (req, res) => {
    mapper(dbSchema.InsFormFieldDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getFormFieldMaster', (req, res) => {
    mapper(dbSchema.getFormFieldMaster, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getFormFieldDet', (req, res) => {
    mapper(dbSchema.getFormFieldDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getDocStatusByOlr', (req, res) => {
    mapper(dbSchema.getDocStatusByOlr, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/UpdDocStatus', (req, res) => {
    mapper(dbSchema.UpdDocStatus, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/uprInsupdPatDocChat', (req, res) => {
    mapper(dbSchema.uprInsupdPatDocChat, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPatDocChat', (req, res) => {
    mapper(dbSchema.uprGetPatDocChat, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdIpMewsScoreMob', (req, res) => {
    mapper(dbSchema.uprInsupdIpMewsScoreMob, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;
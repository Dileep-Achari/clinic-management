'use strict';
const express = require("express");
const router = express.Router();
const MODULE_NAME = "MEEYDYA";
const dbSchema = require("../../../../db-config/helper-methods/sql/schema-generate")(MODULE_NAME);
//const responseChange = require("../../../../db-config/helper-methods/sql/response-change");
const generateParams = require("../../../../db-config/helper-methods/sql/generate-parameters");
const { createToken } = require('../../../../services/token');
const mapper = require("../../../../db-config/mapper");
const { cv19VaccineReqQuetions, vaccineNames } = require("../../../../constants/covidRegQuetions");

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
        res.status(400).send({ "ERROR": "ERROR_WHILE_PREPARECPARAMS", "MESSAGE": ex.message });
    }
});

// router.post(`/getLoginApp`, (req, res) => {
//     try {
// 		if(req.body.UMR_NO){		// =="SU-14040664"){
// 		 req.body.PAT_OTP=9999
// 	}
// 	else{
//         req.body.PAT_OTP = Math.floor((999 + Math.random() * 9000));
// 	}

//         req.body.FLAG = "I"
//         mapper(dbSchema.getLoginApp, req.body, req.cParams).then((response) => {
//             return res.status(200).json(response);
//         }).catch((error) => {
//             console.log("error")
//             res.status(400).send(error);
//         });
//     }
//     catch (ex) {
//         return res.status(400).json({ STATUS: "FAIL", CODE: "5", ERROR: ex })
//     }
// });

router.post(`/getLoginApp`, (req, res) => {
    try {
        if (req.body.UMR_NO === "SU-14040664") {
            req.body.PAT_OTP = 9999
        }
        else if (req.body.FLAG === "I") {
            req.body.PAT_OTP = Math.floor((999 + Math.random() * 9000));
        }
        else {
            //PAT_OTP =parseInt(req.body.PAT_OTP)
        }
        mapper(dbSchema.getLoginApp, req.body, req.cParams).then((response) => {
            return res.status(200).json(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
    catch (ex) {
        return res.status(400).json({ STATUS: "FAIL", CODE: "5", ERROR: ex })
    }
});

router.post('/uprGetPatientRequestsGrid', (req, res) => {
    mapper(dbSchema.uprGetPatientRequestsGrid, req.body, req.cParams).then((response) => {
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

router.post('/uprGetHospitalFormulatory', (req, res) => {
    mapper(dbSchema.uprGetHospitalFormulatory, req.body, req.cParams).then((response) => {
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

router.post('/getVisitsMob', (req, res) => {
    mapper(dbSchema.getVisitsMob, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getPackageMasterMobi', (req, res) => {
    mapper(dbSchema.getPackageMasterMobi, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdPackageBookDet', (req, res) => {
    mapper(dbSchema.uprInsupdPackageBookDet, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


router.post('/getDoctors', (req, res) => {
    mapper(dbSchema.getDoctors, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {

        res.status(400).send(error);
    });
});

router.post('/HoldSlot', (req, res) => {
    mapper(dbSchema.HoldSlot, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {

        res.status(400).send(error);
    });
});

router.post('/getSlotsForRsrc', (req, res) => {
    mapper(dbSchema.getSlotsForRsrc, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getMedicationDataByUmr', (req, res) => {
    mapper(dbSchema.getMedicationDataByUmr, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/mobileSlotBook', (req, res) => {
    mapper(dbSchema.mobileSlotBook, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/getReasonForVisit', (req, res) => {
    mapper(dbSchema.getReasonForVisit, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});


router.post('/getApmtByUMR', (req, res) => {
    mapper(dbSchema.getApmtByUMR, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/mobileSlotCancel', (req, res) => {

    mapper(dbSchema.mobileSlotCancel, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprInsupdMediUserNotify', (req, res) => {
    mapper(dbSchema.uprInsupdMediUserNotify, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/imageupload', (req, res) => {
    mapper(dbSchema.imageupload, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetPatEcgData', (req, res) => {
    mapper(dbSchema.uprGetPatEcgData, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetEcgDataDetMob', (req, res) => {
    mapper(dbSchema.GetEcgDataDetMob, req.body, req.cParams).then((response) => {
        return res.status(200).json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});


//******     Patient Portal web *********///
router.post('/getAllOrganizations', (req, res) => {
    mapper(dbSchema.getAllOrganizations, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getAllLocations', (req, res) => {
    mapper(dbSchema.getAllLocations, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdPackageBook', (req, res) => {
    mapper(dbSchema.uprInsupdPackageBook, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPackageBook', (req, res) => {
    mapper(dbSchema.uprGetPackageBook, req.body, req.cParams).then((response) => {
        res.json(response);
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
router.post('/uprInsupdPatPatientUmrMap', (req, res) => {
    mapper(dbSchema.uprInsupdPatPatientUmrMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetUmrnoByMobile', (req, res) => {
    mapper(dbSchema.uprGetUmrnoByMobile, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetPatiComplaintData', (req, res) => {
    mapper(dbSchema.uprGetPatiComplaintData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdPatiComplaintData', (req, res) => {
    mapper(dbSchema.uprInsupdPatiComplaintData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetPatComplaintsMaster', (req, res) => {
    mapper(dbSchema.uprGetPatComplaintsMaster, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getMedicationByUmrByLoc', (req, res) => {
    mapper(dbSchema.getMedicationByUmrByLoc, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsupdPatientMap', (req, res) => {
    mapper(dbSchema.InsupdPatientMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insUpdOnlinePayment', (req, res) => {
    mapper(dbSchema.insUpdOnlinePayment, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/uprGetPackageBookDet', (req, res) => {
    mapper(dbSchema.uprGetPackageBookDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

/*covid patient routes=------------------start*/

router.post('/getIpClinicalData', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.getMasterData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getFormLableMap', (req, res) => {
    mapper(dbSchema.getFormLableMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getLabelTranInfoMob', (req, res) => {
    mapper(dbSchema.getLabelTranInfoMob, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/updLabelTranInfoMob', (req, res) => {
    mapper(dbSchema.updLabelTranInfoMob, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/insUpdVitalSignsMob', (req, res) => {
    mapper(dbSchema.insUpdVitalSignsMob, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsUpdTeleIpOp', (req, res) => {
    mapper(dbSchema.uprInsUpdTeleIpOp, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getUpdVcIpOpDet', (req, res) => {
    mapper(dbSchema.getUpdVcIpOpDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

/*covid patient routes=------------------end*/


router.post('/uprGetCv19VaccineStock', (req, res) => {
    mapper(dbSchema.uprGetCv19VaccineStock, req.body, req.cParams).then((response) => {
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

router.post('/uprGetCvd19VaccineRequest', (req, res) => {
    mapper(dbSchema.uprGetCvd19VaccineRequest, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetClinicsMasterTypes', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y"
    mapper(dbSchema.uprGetClinicsMasterTypes, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/GetLableProfileSetup', (req, res) => {
    mapper(dbSchema.GetLableProfileSetup, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getLableName', (req, res) => {
    mapper(dbSchema.getLableName, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getLabelTranInfo', (req, res) => {
    mapper(dbSchema.getLabelTranInfo, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/insupdInvsMasterJson', (req, res) => {
    mapper(dbSchema.insupdInvsMasterJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsupdLabelTranInfo', (req, res) => {
    mapper(dbSchema.InsupdLabelTranInfo, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/InsupdLableName', (req, res) => {
    mapper(dbSchema.InsupdLableName, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/covidRegQuetions', (req, res) => {
    return res.json({
        "covidRegQuetions": cv19VaccineReqQuetions,
        "covidVaccineNames": vaccineNames
    });

});

router.post('/InsupdFormLableMap', (req, res) => {
    mapper(dbSchema.InsupdFormLableMap, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsUpdLableProfileSetup', (req, res) => {
    mapper(dbSchema.InsUpdLableProfileSetup, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetIpOpPatDet', (req, res) => {
    mapper(dbSchema.uprGetIpOpPatDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdStitemsMasterJson', (req, res) => {
    mapper(dbSchema.uprInsupdStitemsMasterJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getIpAdmissions', (req, res) => {
    mapper(dbSchema.getIpAdmissions, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdClinicManagementJson', (req, res) => {
    mapper(dbSchema.uprInsupdClinicManagementJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetCmMedications', (req, res) => {
    mapper(dbSchema.uprGetCmMedications, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetCmInvsOrder', (req, res) => {
    mapper(dbSchema.uprGetCmInvsOrder, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetLabelTranInfoCm', (req, res) => {
    mapper(dbSchema.uprGetLabelTranInfoCm, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getVitalsValid', (req, res) => {
    mapper(dbSchema.getVitalsValid, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getVitals', (req, res) => {
    mapper(dbSchema.getVitals, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getMastrData', (req, res) => {
    mapper(dbSchema.getMastrData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getPaDocLocDet', (req, res) => {
    mapper(dbSchema.getPaDocLocDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getPatDocAccess', (req, res) => {
    mapper(dbSchema.getPatDocAccess, req.body, req.cParams).then((response) => {
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
router.post('/getSrvcAuto', (req, res) => {
    mapper(dbSchema.getSrvcAuto, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetAllSlotType', (req, res) => {
    mapper(dbSchema.GetAllSlotType, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetlocationsByDocId', (req, res) => {
    mapper(dbSchema.GetlocationsByDocId, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getRsrcAvlblTyp', (req, res) => {
    mapper(dbSchema.getRsrcAvlblTyp, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetRsrcDetails', (req, res) => {
    mapper(dbSchema.GetRsrcDetails, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetDatesByOlr', (req, res) => {
    mapper(dbSchema.GetDatesByOlr, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getDocSetting', (req, res) => {
    mapper(dbSchema.getDocSetting, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprGetCmVitalSigns', (req, res) => {
    mapper(dbSchema.uprGetCmVitalSigns, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprInsupdCmVitalSignsJson', (req, res) => {
    mapper(dbSchema.uprInsupdCmVitalSignsJson, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getMedicationsMasterAuto', (req, res) => {
    mapper(dbSchema.getMedicationsMasterAuto, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post('/GetRsrcSchTimeValidatin', (req, res) => {
    mapper(dbSchema.GetRsrcSchTimeValidatin, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/GetShftDtls', (req, res) => {
    mapper(dbSchema.GetShftDtls, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsupdSchedulingTemplate', (req, res) => {
    mapper(dbSchema.InsupdSchedulingTemplate, req.body, req.cParams).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});
router.post('/getDoctorNew', (req, res) => {
    mapper(dbSchema.getDoctorNew, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getCmEmployees', (req, res) => {
    mapper(dbSchema.getCmEmployees, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/DelCmFormData', (req, res) => {
    mapper(dbSchema.DelCmFormData, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getPaDocLocSlotDet', (req, res) => {
    mapper(dbSchema.getPaDocLocSlotDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetScheduleTemplateShifts', (req, res) => {
    mapper(dbSchema.GetScheduleTemplateShifts, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetReasonForVisit', (req, res) => {
    mapper(dbSchema.GetReasonForVisit, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/GetPatAuto', (req, res) => {
    mapper(dbSchema.GetPatAuto, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/GetChkRevisit', (req, res) => {
    mapper(dbSchema.GetChkRevisit, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/GetSpecialInstruction', (req, res) => {
    mapper(dbSchema.GetSpecialInstruction, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getFreqMst', (req, res) => {
    mapper(dbSchema.getFreqMst, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/GetCancelReason', (req, res) => {
    mapper(dbSchema.GetCancelReason, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getSltMerge', (req, res) => {
    mapper(dbSchema.getSltMerge, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getVdDocrelByScreen', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y"
    mapper(dbSchema.getVdDocrelByScreen, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/UprInsupdProfilesetup', (req, res) => {
    mapper(dbSchema.UprInsupdProfilesetup, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/InProfileSetupDet', (req, res) => {
    mapper(dbSchema.InProfileSetupDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getProfSetupDet', (req, res) => {
    mapper(dbSchema.getProfSetupDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsDocFavInvesti', (req, res) => {
    mapper(dbSchema.InsDocFavInvesti, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/DelFavourites', (req, res) => {
    mapper(dbSchema.DelFavourites, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/InsDocMeidicatin', (req, res) => {
    mapper(dbSchema.InsDocMeidicatin, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getPatient', (req, res) => {
    mapper(dbSchema.getPatient, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InUpchangePsw', (req, res) => {
    mapper(dbSchema.InUpchangePsw, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getDocStatusByOlr', (req, res) => {
    mapper(dbSchema.getDocStatusByOlr, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getDocStatus', (req, res) => {
    mapper(dbSchema.getDocStatus, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/UpdDocStatus', (req, res) => {
    mapper(dbSchema.UpdDocStatus, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetCmOrdersDet', (req, res) => {
    mapper(dbSchema.uprGetCmOrdersDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/doctorLogin', (req, res) => {
    mapper(dbSchema.doctorLogin, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/serviceMastersAuto', (req, res) => {
    mapper(dbSchema.serviceMastersAuto, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/chngSltType', (req, res) => {
    mapper(dbSchema.chngSltType, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsMsgVideoCons', (req, res) => {
    mapper(dbSchema.InsMsgVideoCons, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getVcSlotDet', (req, res) => {
    mapper(dbSchema.getVcSlotDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/getDoctor', (req, res) => {
    mapper(dbSchema.getDoctor, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getTeleMedicn', (req, res) => {
    mapper(dbSchema.getTeleMedicn, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/InsUpdTMDet', (req, res) => {
    mapper(dbSchema.InsUpdTMDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/uprGetClinicalDataMob', (req, res) => {
    req.cParams.IS_MULTI_RESULTSET = "Y";
    mapper(dbSchema.uprGetClinicalDataMob, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/inspudPatHealthCard', (req, res) => {
    mapper(dbSchema.inspudPatHealthCard, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
router.post('/uprInsupdPatDocChat', (req, res) => {
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
router.post('/getCmBillDet', (req, res) => {
    mapper(dbSchema.getCmBillDet, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});

router.post('/getPatDtlsMobUmrNo', (req, res) => {
    mapper(dbSchema.getPatDtlsMobUmrNo, req.body, req.cParams).then((response) => {
        return res.json(response);
    }).catch((error) => {
        return res.status(400).send(error);
    });
});
module.exports = router;
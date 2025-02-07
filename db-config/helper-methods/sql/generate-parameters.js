'use strict';
const appointments = require("../../models/sql/appointments/generate-params");
const kdOpApi = require("../../models/sql/apk/kd/generate-params");
const slgOpApi = require("../../models/sql/apk/slg/generate-params");
const patientPortal = require("../../models/sql/apk/patient-portal/generate-params");
const ppv9 = require("../../models/sql/apk/patient-portal-v9/generate-parameters");
const appt = require('../../models/sql/apk/appt/generate-params');
const meeYdya = require('../../models/sql/apk/mee-ydya/generate-params');
const Pmg =require('../../models/sql/pmg/generateParams');
const Pharmacy = require('../../models/sql/pharmacy/generate-params')

module.exports = (params, cParams) => {
    if (cParams.MODULE === "APPOINTMENTS") {
        if (appointments && appointments[cParams.URL])
            return appointments[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "KD_OP_API") {
        if (kdOpApi && kdOpApi[cParams.URL])
            return kdOpApi[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "SLG_OP_API") {
        if (slgOpApi && slgOpApi[cParams.URL])
            return slgOpApi[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "APPT_OP_API") {
        if (appt && appt[cParams.URL])
            return appt[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "PATIENT_PORTAL") {
        if (patientPortal && patientPortal[cParams.URL])
            return patientPortal[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "PATIENT_PORTAL_V9") {
        if (ppv9 && ppv9[cParams.URL])
            return ppv9[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "COVID_PATIENT") {
        if (ppv9 && ppv9[cParams.URL])
            return ppv9[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "YDYA-CALLER") {
        if (ppv9 && ppv9[cParams.URL])
            return ppv9[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    // else if (cParams.MODULE === "HL7") {
    //     if (ppv9 && ppv9[cParams.URL])
    //         return ppv9[cParams.URL](params, cParams.IS_LOAD_AJAX);
    //     else return params;
    // }
	else if (cParams.MODULE === "MEEYDYA") {
        if (meeYdya && meeYdya[cParams.URL])
            return meeYdya[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "PMG") {
        if (Pmg && Pmg[cParams.URL])
            return Pmg[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else if (cParams.MODULE === "PHARMACY") {
        if (Pharmacy && Pharmacy[cParams.URL])
            return Pharmacy[cParams.URL](params, cParams.IS_LOAD_AJAX);
        else return params;
    }
    else {
        return params;
    }
}
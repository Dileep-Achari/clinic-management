'use strict';
const express = require("express");
const router = express.Router();
const dbCall = require("../../constants/db");
// const mobile = require('is-mobile');
const MobileDetect = require('mobile-detect');

router.get('/:type/:shortId', async (req, res) => {
    if (req.params.shortId && req.params.type && (req.params.type = req.params.type.toUpperCase()) && (req.params.type === "IP" || req.params.type === "OP" || req.params.type === "SU")) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
        let md = new MobileDetect(req.headers['user-agent']);
        const dbParams = { "SHORT_URL": (req.params.type.toUpperCase() + "_" + req.params.shortId), "FLAG": (md.mobile() ? "PATDET" : "") };
        dbCall("PDF_APPT", "getPdfBySrtUrl", "getPrtDtaBySrtUrl", dbParams).then(resp => {
            if (resp && resp.length > 0) {
                if (resp[0].PRINT_DATA) {
                    res.set('content-disposition', 'inline');
                    res.type('application/pdf');
                    if (md.mobile()) {
						console.log("is_mobile",md.mobile())
                        let pat_data = ["UHR_NO", "UMR_NO", "ADMN_NO","APMNT_DT", "AGE", "SLOTS_ID", "SUMMARY_ID", "PATIENT_NAME", "ADMN_DT", "DISCHRG_DT", "VISIT_TYPE", "MOBILE_NO", "GENDER_CD", "DOCTOR_NAME"]
                        let resp_data = resp[0];
                        if (req.params.type === "OP") {
                            resp_data["SLOTS_ID"] = resp_data.ADMN_NO;
                            resp_data["ADMN_NO"] = "";
                        }
                        else if (req.params.type !== "OP") {
                            resp_data["ADMN_DT"] = resp_data.APMNT_DT;
                        }
                        for (let j in pat_data) {
                            res.set(pat_data[j], (resp_data[pat_data[j]] ? resp_data[pat_data[j]] : ""));
                        }
						console.log("res",res._headers)
                    }
					
                    res.send(new Buffer.from(resp[0].PRINT_DATA, "base64"));
                }
                else res.send("<b>No Records Found.<b>");
            }
            else res.send("<b>No Records Found.<b>");
        }).catch(ex => {
            res.send("<b>Invalid Request<b>");
        });
    }
    else res.send("<b>Invalid Request<b>");
});

module.exports = router;
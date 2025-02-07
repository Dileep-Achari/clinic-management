'use strict';
const express = require("express");
const router = express.Router();
const dbCall = require("../../constants/db");

router.get('/:type/:shortId', async (req, res) => {
    if (req.params.shortId && req.params.type && (req.params.type = req.params.type.toUpperCase()) && (req.params.type === "IP" || req.params.type === "OP" || req.params.type === "SU")) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
        const dbParams = { "SHORT_URL": (req.params.type.toUpperCase() + "_" + req.params.shortId) };

        dbCall("PDF_APPT", "getPdfBySrtUrl", "getPrtDtaBySrtUrl", dbParams).then(resp => {
            if (resp && resp.length > 0) {
                if (resp[0].PRINT_DATA) {
                    res.set('content-disposition', 'inline');
                    res.type('application/pdf');
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
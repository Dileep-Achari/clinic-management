'use strict';
const express = require("express");
const router = express.Router();
const common = require("../../constants/hims-lab-pdf/common");

router.get('/:rptId/:shortId', async (req, res) => {
	//console.log(req.params);
    if (req.params.shortId && req.params.rptId) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
        const location = common.isValidRptId(req.params.rptId);
        if (location) {
            common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId }).then(response => {
				//console.log(response);
                if (response.pdf && response.pdf.PDF_ATTACHMENT) {
                    res.set('content-disposition', 'inline');
                    res.type('application/pdf');
                    res.send(new Buffer.from(response.pdf.PDF_ATTACHMENT, "base64"));
                }
                else {
                    res.send("<b>no - records found<b>");
                }
            }).catch(ex => {
                res.send("<b>error while fetching data<b>");
            });
        }
        else {
            res.send("<b>Invalid Parameters<b>");
        }
    }
    else {
        res.send("<b>Invalid Parameters<b>");
    }
});

module.exports = router;
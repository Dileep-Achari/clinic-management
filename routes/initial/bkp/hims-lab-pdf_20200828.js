'use strict';
const express = require("express");
const router = express.Router();
const common = require("../../constants/hims-lab-pdf/common");
const mobile = require('is-mobile');
var MobileDetect = require('mobile-detect');

router.get('/mobileTest', (req, res) => {
   let md = new MobileDetect(req.headers['user-agent']);
    console.log(md.mobile())
    //return res.send(md.mobile())
	if(md.mobile())
		return res.send(md.mobile())
	else
		return res.send('Not Mobile')
})

router.get('/:rptId/:shortId', async (req, res) => {
	let md = new MobileDetect(req.headers['user-agent']);
    if (req.params.shortId && req.params.rptId) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
        const location = common.isValidRptId(req.params.rptId);
        if (location) {
			//console.log('location.URL',req.params.shortId);
			//console.log('shortId',location.URL);
            common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId }).then(response => {
				//console.log('response',response);
                if (response.pdf && response.pdf.PDF_ATTACHMENT) {
					
					//console.log("response.pdf",response.pdf);
					//console.log("response.pdf.PDF_ATTACHMENT",response.pdf.PDF_ATTACHMENT);
                    res.set('content-disposition', 'inline');
                    res.type('application/pdf');
					if (md.mobile()) 
					{
						res.set('PatientName', 'PatientName');
						res.set('NumberofDays', '10');
						res.set('OrganizationName', 'OrganizationName');
						res.set('LocationName', 'LocationName');
						res.set('LocationName', 'LocationName');
						res.set('lattitdePoint', '17.385044');
						res.set('longitutudePoint', '78.486671');
						
					}
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

router.get('/:rptType/:rptId/:shortId', async (req, res) => {
	console.log('hb');
	let md = new MobileDetect(req.headers['user-agent']);
    if (req.params.shortId && req.params.rptId) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
		
        const location = common.isValidRptId(req.params.rptId);
        if (location) {
            common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId }).then(response => {
                if (response.pdf && response.pdf.PDF_ATTACHMENT) {
                    res.set('content-disposition', 'inline');
                    res.type('application/pdf');
					//if (md.mobile()) 
					{
						var rptReportType, OrganizationName, LocationName, PatientName;
						if(req.params.rptType === 'o')
						{
							PatientName = 'Test';
							rptReportType = 'OP Bills';
							OrganizationName = 'Soft Health';
							LocationName = 'Ameerpet';
						}
						else if(req.params.rptType === 'i')
						{
							PatientName = 'IPTest';
							rptReportType = 'IP Bills';
							OrganizationName = 'KIMS';
							LocationName = 'Secunderabad';
						}
						else
						{
							PatientName = 'OthersTest';
							rptReportType = 'Others';
							OrganizationName = 'Ramesh';
							LocationName = 'Vijayawada';
						}
								
						//console.log('from mobile', req)
						res.set('PatientName', PatientName);
						res.set('NumberofDays', '10');
						res.set('OrganizationName', OrganizationName);
						res.set('LocationName', LocationName);
						res.set('ReportType', rptReportType);
						res.set('lattitdePoint', '17.385044');
						res.set('longitutudePoint', '78.486671');
						
						var datetime = new Date();
						res.set('RptDate', datetime.toISOString().slice(0,10));
					}
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
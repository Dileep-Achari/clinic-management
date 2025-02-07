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
            common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId },req.params.rptId, req.params.shortId).then(response => {
                if (response.pdf && response.pdf.PDF_ATTACHMENT) {
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
	
	var shortId = 	req.params.shortId;
	var rptReportType, OrganizationName =  'Soft Health', LocationName = 'Ameerpet', PatientName = 'Test Patient', datetime = new Date();
	let md = new MobileDetect(req.headers['user-agent']);
	console.log(md);
    if (req.params.shortId && req.params.rptId) {
        req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
								
        const location = common.isValidRptId(req.params.rptId);
        if (location) {
            common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId },req.params.rptId, req.params.shortId).then(response => {
                if (response.pdf && response.pdf.PDF_ATTACHMENT) 
				{
                    // res.set('content-disposition', 'inline');
                    // res.type('application/pdf');
					if (true)
					{
						if(shortId === 'DS1G2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'DSG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'OPG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'OP1G2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'OP2G2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'IPDG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'IPBSG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'IPBDG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}
						else if (shortId === 'COPBG2RqYPjZS')
						{
							PatientName = 'Test Patient'
						}

						
						if(req.params.rptType === 'L')
						{
							rptReportType = 'Lab Reports';
						}						
						else if(req.params.rptType === 'D')
						{
							rptReportType = 'Discharge Summary';
						}
						else if(req.params.rptType === 'O')
						{
							rptReportType = 'OP Assessment';
						}						
						else if(req.params.rptType === 'IB')
						{
							rptReportType = 'IP Bills Detailed';
						}
						else if(req.params.rptType === 'IBS')
						{
							rptReportType = 'IP Bills Semi Detailed';
						}
						else if(req.params.rptType === 'ID')
						{
							rptReportType = 'IP Dues';
						}	
						else if(req.params.rptType === 'COPB')
						{
							rptReportType = 'Corporate OP Bills';
						}						
						
						else
						{
							rptReportType = 'Others';
						}
								
						// res.setHeader('PatientName', PatientName);
						// res.setHeader('NumberofDays', '10');
						// res.setHeader('OrganizationName', OrganizationName);
						// res.setHeader('LocationName', LocationName);
						// res.setHeader('ReportType', rptReportType);
						// res.setHeader('lattitdePoint', '17.385044');
						// res.setHeader('longitutudePoint', '78.486671');
						// res.set('RptDate', datetime.toISOString().slice(0,10));
					}
                    //res.send(new Buffer.from(response.pdf.PDF_ATTACHMENT, "base64"));
					
					 res.writeHead(200, {'Content-Type':'application/pdf', 'content-disposition': 'inline', 'PatientName':PatientName,
					  'NumberofDays':10, 'OrganizationName':OrganizationName, 'LocationName':LocationName, 'ReportType':rptReportType, 
					  'lattitdePoint':'17.385044', 'longitutudePoint':'78.486671', 'RptDate':datetime.toISOString().slice(0,10)
					 });
					
					 res.write(new Buffer.from(response.pdf.PDF_ATTACHMENT, "base64"));
					 return res.end();
                }
                else {
                    return res.send("<b>no - records found<b>");
                }
            }).catch(ex => {
				console.log(ex);
                return res.send("<b>error while fetching data<b>");
            });
        }
        else {
            return res.send("<b>Invalid Parameters<b>");
        }
    }
    else {
        return res.send("<b>Invalid Parameters<b>");
    }
});





module.exports = router;
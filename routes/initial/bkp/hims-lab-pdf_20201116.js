'use strict';
const express = require("express");
const router = express.Router();
const common = require("../../constants/hims-lab-pdf/common");
const dbCall = require("../../constants/db");
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
		 let _reportId = req.params.rptId;
        if (_reportId === "O" || _reportId === "I" || _reportId === "D") {
            let md = new MobileDetect(req.headers['user-agent']);
            let _reportType = (_reportId === "O" ? "OP" : (_reportId === "D" ? "SU" : (_reportId === "I" ? "IP" : "OP")))
            const dbParams = { "SHORT_URL": (_reportType.toUpperCase() + "_" + req.params.shortId), "FLAG":"PATDET" };
			
			//"FLAG": (md.mobile() ? "PATDET" : "")
            dbCall("PDF_APPT", "getPdfBySrtUrl", "getPrtDtaBySrtUrl", dbParams).then(resp => {
                if (resp && resp.length > 0) {
                    if (resp[0].PRINT_DATA) {
                        res.set('content-disposition', 'inline');
                        res.type('application/pdf');
                        //if (md.mobile()) {
                         //   let pat_data = { "uhrno": "UHR_NO", "umno": "UMR_NO", "admnno": "ADMN_NO", "age": "AGE", "slotid": "SLOTS_ID", "summaryid": "SUMMARY_ID", "patientname": "PATIENT_NAME", "admndt": "ADMN_DT", "dischrgdt": "DISCHRG_DT", "visittype": "VISIT_TYPE", "mobileno": "MOBILE_NO", "gendercd": "GENDER_CD", "doctorname": "DOCTOR_NAME" };
						   let pat_data = {
                                "UMRNO": "UMR_NO", "Name": "PATIENT_NAME", "Gender": "GENDER_CD", "Age": "AGE", "MobileNo": "MOBILE_NO", "DoctorName": "DOCTOR_NAME",
                                "VisitNo": "ADMN_NO", "Address": "PAT_ADDRESS", "VisitDate": "APMNT_DT", "OrganizationName": "ORG_NAME", "LocationName": "LOCATION_NAME", "locLat": "LOC_LAT", "locLong": "LOC_LONG",
                                "DischargeDate": "DISCHRG_DT", "visittype": "VISIT_TYPE",
                            };                          

						  let resp_data = resp[0];
                            // if (_reportType === "OP") {
                                // resp_data["SLOTS_ID"] = resp_data.ADMN_NO;
                                // resp_data["ADMN_NO"] = "";
                            // }
                            // else if (_reportType !== "OP") {
                                // resp_data["ADMN_DT"] = resp_data.APMNT_DT;
                            // }
                            for (let j in pat_data) {
                                res.set(j, (resp_data[pat_data[j]] ? resp_data[pat_data[j]] : ""));
                            }
                       // }
                        res.send(new Buffer.from(resp[0].PRINT_DATA, "base64"));
                    }
                    else res.send("<b>No Records Found.<b>");
                }
                else res.send("<b>No Records Found.<b>");
            }).catch(ex => {
                res.send("<b>Invalid Request<b>");
            });
        }
	    else {
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
							PatientName = 'Mr Muni Kumar'
						}
						else if (shortId === 'DSG2RqYPjZS')
						{
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'OPG2RqYPjZS')
						{
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'OP1G2RqYPjZS')
						{
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'OP2G2RqYPjZS')
						{
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'IPDG2RqYPjZS')
						{
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'IPBSG2RqYPjZS')
						{
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'IPBDG2RqYPjZS')
						{
							PatientName = 'Mr Muni kumar'
						}
						else if (shortId === 'COPBG2RqYPjZS')
						{
							PatientName = 'Muni Kumar'
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
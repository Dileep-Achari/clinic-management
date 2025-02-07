'use strict';
const express = require("express");
const router = express.Router();
const common = require("../../constants/hims-lab-pdf/common");
const dbCall = require("../../constants/db");
const mobile = require('is-mobile');
var MobileDetect = require('mobile-detect');
const moment = require('moment');
const fs = require("fs");

const filePath = "/var/www/html/doc9/node/apk/public/log/himslabpdf/labpdf.txt";

router.get('/mobileTest', (req, res) => {
	console.log('********************************', mobileTest, '****');
	let md = new MobileDetect(req.headers['user-agent']);
	console.log(md.mobile())
	//return res.send(md.mobile())
	if (md.mobile())
		return res.send(md.mobile())
	else
		return res.send('Not Mobile')
})


function changeFunction(loc, _reportType) {
	//console.log("_reportType",loc,_reportType)
	if (_reportType === 'L') {
		return loc.URL;
	}
	else if (_reportType === 'B') {
		//console.log("loc.BILLS",loc.BILLS)
		return loc.BILLS;
	}
	else if (_reportType === 'br' || _reportType === 'BR') {
		return "http://localhost:10016/" || loc.BILLSRECEIPTPDF;
	}
	else {
		return loc.URL;
	}

}

router.get('/:rptId/:shortId', async (req, res) => {

	//console.log('********************************',req.params.rptId,'****',req.params.shortId );
	//console.log("headers", req.params.shortId );
	let md = new MobileDetect(req.headers['user-agent']);
	if (req.params.shortId && req.params.rptId) {
		let _reportId = req.params.rptId;
		//console.log("_reportId1",_reportId)
		if (_reportId === "O" || _reportId === "I" || _reportId === "D" || _reportId === "i") {
			//console.log("_reportId",_reportId)
			//if(md.ua.substring(0, 4)=== 'Dart' && shortId.toLowerCase().slice(shortId.length - 4) != '.pdf' ) res.redirect('/rptId/shortId' + '.pdf');
			if (md.mobile() && req.params.shortId.toLowerCase().slice(req.params.shortId.length - 4) != '.pdf') {
				//console.log('in mobile chrome browser',req.params.shortId)
				var pathTo = '/' + req.params.rptId + '/' + req.params.shortId + '.pdf'
				//var pathTo = 'http://dr9.in' + req.originalUrl + '.pdf'
				//res.send('<script>window.location.href=pathTo;</script>');			
				res.status(301).redirect(pathTo);		//302,307,308
			}

			req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");

			let _reportType = (_reportId === "O" ? "OP" : (_reportId === "D" ? "SU" : (_reportId === "I" ? "IP" : "OP")))
			const dbParams = { "SHORT_URL": (_reportType.toUpperCase() + "_" + req.params.shortId), "FLAG": "PATDET" };


			//console.log("params", dbParams);
			//"FLAG": (md.mobile() ? "PATDET" : "")
			dbCall("PDF_APPT", "getPdfBySrtUrl", "getPrtDtaBySrtUrl", dbParams).then(resp => {
				// console.log("_reportId1",resp)

				if (resp && resp.length > 0) {

					if (resp[0].PRINT_DATA) {

						res.set('content-disposition', 'inline');
						res.type('application/pdf');
						//if (md.mobile()) {
						//   let pat_data = { "uhrno": "UHR_NO", "umno": "UMR_NO", "admnno": "ADMN_NO", "age": "AGE", "slotid": "SLOTS_ID", "summaryid": "SUMMARY_ID", "patientname": "PATIENT_NAME", "admndt": "ADMN_DT", "dischrgdt": "DISCHRG_DT", "visittype": "VISIT_TYPE", "mobileno": "MOBILE_NO", "gendercd": "GENDER_CD", "doctorname": "DOCTOR_NAME" };

						let pat_data = {
							"UMRNO": "UMR_NO", "Name": "PATIENT_NAME", "Gender": "GENDER_CD", "Age": "AGE", "MobileNo": "MOBILE_NO", "DoctorName": "DOCTOR_NAME",
							"VisitNo": "ADMN_NO", "Address": "PAT_ADDRESS", "VisitDate": "APMNT_DT", "OrganizationName": "ORG_NAME", "LocationName": "LOCATION_NAME", "locLat": "LOC_LAT", "locLong": "LOC_LONG",
							"DischargeDate": "DISCHRG_DT", "visittype": "VISIT_TYPE", "documentCreatedDateAt_Unix": "APMNT_DT", "documentCreatedDateAt": "APMNT_DT"// `${parseInt(new Date('APMNT_DT').getTime())}`,
						};

						let resp_data = resp[0];
						// if (_reportType === "OP") {
						// resp_data["SLOTS_ID"] = resp_data.ADMN_NO;
						// resp_data["ADMN_NO"] = "";
						// }
						// else if (_reportType !== "OP") {
						// resp_data["ADMN_DT"] = resp_data.APMNT_DT;
						// }	
						//console.log("resp",resp_data);
						try {
							for (let j in pat_data) {

								if (j == 'documentCreatedDateAt_Unix') {

									//console.log("parseInt(new Date(resp_data[pat_data[j]]).getTime())",parseInt(new Date(resp_data[pat_data[j]]).getTime()));
									res.set(j, parseInt(new Date(resp_data[pat_data[j]]).getTime()));
								}
								else if (j == 'documentCreatedDateAt') {
									res.set(j, moment(resp_data[pat_data[j]]).format('Do MMM YYYY, h:mm'));
								}
								else if (j == 'DischargeDate') {
									res.set(j, moment(resp_data[pat_data[j]]).format('Do MMM YYYY, h:mm'));
								}
								else {
									if (j == 'Address')
										resp_data[pat_data[j]] = resp_data[pat_data[j]].replace(/(\r\n|\n|\r)/gm, " ");
									res.set(j, (resp_data[pat_data[j]] ? resp_data[pat_data[j]] : ""));
								}
							}
						}
						catch (e) {
							console.log(`Error occurred ${e}`);
						}

						// }
						//  console.log("pdfdata",resp_data)
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
			//console.log("location",location)
			if (location) {
				//console.log("clinetPdf",req.params.shortId,location );
				req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
				common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId }, req.params.rptId, req.params.shortId).then(response => {
					//console.log("response",response);
					if (response.pdf && response.pdf.PDF_ATTACHMENT || req.params.rptId == 21) {
						res.set('content-disposition', 'inline');
						res.type('application/pdf');
						//console.log("ISMOBILE", md.mobile());
						// if (md.mobile()) 
						// {
						// console.log("*********************INMOBILE*****************");
						// res.set('PatientName', 'PatientName');
						// res.set('NumberofDays', '10');
						// res.set('OrganizationName', 'OrganizationName');
						// res.set('LocationName', 'LocationName');
						// res.set('LocationName', 'LocationName');
						// res.set('lattitdePoint', '17.385044');
						// res.set('longitutudePoint', '78.486671');

						// }
						let base64Data = "";
						if (req.params.rptId == 21) {
							base64Data = response.pdf;
						}
						else
							base64Data = response.pdf.PDF_ATTACHMENT;
						res.send(new Buffer.from(base64Data, "base64"));
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




router.get('/:rptId/:rptType/:shortId', async (req, res) => {
	//console.log("get")
	// let insertTime = new Date().toLocaleString()


	//console.log('********************************', req.params);
	//console.log("headers", req.headers);
	let md = new MobileDetect(req.headers['user-agent']);
	if (req.params.shortId && req.params.rptId) {
		//console.log("req.params.shortId",req.params)
		let _reportId = req.params.rptId;
		let _reportType = req.params.rptType ? req.params.rptType : "B";
		let _repId = ""; let _flag = "O";
		if (_reportType === 'd' || _reportType === 'D' || _reportType === 'o' || _reportType === 'O') {
			let _repType = ((_reportType === "O" || _reportType === 'o') ? "OP" : ((_reportType === "D" || _reportType === 'd') ? "SU" : ((_reportType === "I" || _reportType === 'i') ? "IP" : "OP")))
			req.params.shortId = (_repType.toUpperCase() + "_" + req.params.shortId);
			_flag = "PATDET";
		}
		else if (_reportType === 'br' || _reportType === 'BR') {
			_flag = "BILLSRECEIPT";
		}
		//	_repId = (_reportType && (_reportType === 'L' || _reportType === 'l')) ? (req.params.rptId == 21 ? 22 : req.params.rptId): req.params.rptId;
		_repId = req.params.rptId;
		const location = common.isValidRptId(_repId);
		//console.log("location",location)
		if (location) {
			req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");
			let URL = changeFunction(location, _reportType);
			//console.log("URL", req.params.shortId, _reportType, req.params.rptId, _flag)
			common.getPdf(URL, { "Flag": _flag, "Shorturl": req.params.shortId, "reportType": _reportType }, req.params.rptId, req.params.shortId).then(response => {
				// if (_repId == 54)
				//console.log("resp", response)
				if (_reportType !== 'br' && _reportType !== 'BR') {
					if ((response.pdf && response.pdf != null && response.pdf)) {
						res.set('content-disposition', 'inline');
						res.type('application/pdf');
						let base64Data = "";
						if (response.pdf.PDF_ATTACHMENT){
							base64Data = response.pdf.PDF_ATTACHMENT;
						}
						else base64Data = response.pdf;
						return res.send(new Buffer.from(base64Data, "base64"));
					}
					else {
						return res.send("<b>no - records found<b>");
					}
				}
				else {
					if (response.pdf && response.pdf != null && response.pdf) {
						return res.status(200).send(response.pdf);
					}
					else {
						return res.send("<b>no - records found<b>");
					}
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



router.get('/br/:shortId', async (req, res) => {
//	console.log(req.params);
	common.getPdf(location.URL, { "Flag": _flag, "Shorturl": req.params.shortId, "reportType": _reportType }, req.params.rptId, req.params.shortId).then(response => {
		if (_repId == 54)
			console.log("response", response);
		if ((response.pdf && response.pdf != null && response.pdf)) {
			res.set('content-disposition', 'inline');
			res.type('application/pdf');

			let base64Data = "";

			if (response.pdf.PDF_ATTACHMENT)
				base64Data = response.pdf.PDF_ATTACHMENT;
			else base64Data = response.pdf;
			res.send(new Buffer.from(base64Data, "base64"));
		}
		else {
			res.send("<b>no - records found<b>");
		}
	}).catch(ex => {
		res.send("<b>error while fetching data<b>");
	});
});
router.get('/:rptType/:rptId/:shortId', async (req, res) => {

	var shortId = req.params.shortId;
	var rptReportType, OrganizationName = 'Soft Health', LocationName = 'Ameerpet', PatientName = 'Test Patient', datetime = new Date();
	let md = new MobileDetect(req.headers['user-agent']);
	//console.log(md);
	if (req.params.shortId && req.params.rptId) {
		req.params.shortId = req.params.shortId.replace(".pdf", "").replace(".PDF", "");

		const location = common.isValidRptId(req.params.rptId);
		if (location) {
			common.getPdf(location.URL, { "Flag": "O", "Shorturl": req.params.shortId }, req.params.rptId, req.params.shortId).then(response => {
				if (response.pdf && response.pdf.PDF_ATTACHMENT) {
					// res.set('content-disposition', 'inline');
					// res.type('application/pdf');
					if (true) {
						if (shortId === 'DS1G2RqYPjZS') {
							PatientName = 'Mr Muni Kumar'
						}
						else if (shortId === 'DSG2RqYPjZS') {
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'OPG2RqYPjZS') {
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'OP1G2RqYPjZS') {
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'OP2G2RqYPjZS') {
							PatientName = 'Muni Kumar'
						}
						else if (shortId === 'IPDG2RqYPjZS') {
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'IPBSG2RqYPjZS') {
							PatientName = 'Muni kumar'
						}
						else if (shortId === 'IPBDG2RqYPjZS') {
							PatientName = 'Mr Muni kumar'
						}
						else if (shortId === 'COPBG2RqYPjZS') {
							PatientName = 'Muni Kumar'
						}


						if (req.params.rptType === 'L') {
							rptReportType = 'Lab Reports';
						}
						else if (req.params.rptType === 'D') {
							rptReportType = 'Discharge Summary';
						}
						else if (req.params.rptType === 'O') {
							rptReportType = 'OP Assessment';
						}
						else if (req.params.rptType === 'IB') {
							rptReportType = 'IP Bills Detailed';
						}
						else if (req.params.rptType === 'IBS') {
							rptReportType = 'IP Bills Semi Detailed';
						}
						else if (req.params.rptType === 'ID') {
							rptReportType = 'IP Dues';
						}
						else if (req.params.rptType === 'COPB') {
							rptReportType = 'Corporate OP Bills';
						}

						else {
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

					res.writeHead(200, {
						'Content-Type': 'application/pdf', 'content-disposition': 'inline', 'PatientName': PatientName,
						'NumberofDays': 10, 'OrganizationName': OrganizationName, 'LocationName': LocationName, 'ReportType': rptReportType,
						'lattitdePoint': '17.385044', 'longitutudePoint': '78.486671', 'RptDate': datetime.toISOString().slice(0, 10)
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
const axios = require("../../services/axios");
const locations = require("./locations");
const dummyPdf = require("./dummyPdfResp");

const fs = require("fs");

const filePath = "/var/www/html/doc9/node/apk/public/log/himslabpdf/labpdf-1.txt";

const gParams = { "Flag": "", "Batchid": "", "Msgstatus": "", "Shorturl": "", "Jobstatus": "", "Fromdate": "", "Todate": "" };
const gParams_mh = { "ptype": "", "shortlink": ""};

let storage = {};

function getNewParams(obj, rptId) {
	  let params ="";
	if(rptId == 21)
		 params = { ...gParams_mh };
	else
        params = { ...gParams };
    for (var i in obj) {
        params[i] = obj[i];
    }
    return params;
}

function isValidRptId(rptId) {
//console.log("locations", locations);
    return locations.find(loc => {
        return loc.RPT_ID === parseInt(rptId);
    });
}

function getTemplate(url, costCntCd) {
    return new Promise((resolve, reject) => {
        if (storage[costCntCd]) {
            if (storage[costCntCd].TEMPLATE) {
                return resolve({ "template": storage[costCntCd].TEMPLATE, "tempError": null });
            }
        }
        else storage[costCntCd] = {};

        axios.get(url, { params: getNewParams({ Flag: 'M' }) }).then(resp => {
            if (resp && resp.Table && resp.Table[0] && resp.Table[0].MSG_DESC) {
                storage[costCntCd]["TEMPLATE"] = resp.Table[0].MSG_DESC;
                return resolve({ "template": resp.Table[0].MSG_DESC, "tempError": null });
            }
            else
                return resolve({ "template": null, "tempError": "no message template found" });

        }).catch(err => {
            return resolve({ "template": null, "tempError": err.message });
        });
    });
}

function getVendorUrl(url, costCntCd) {
    return new Promise((resolve, reject) => {
        if (storage[costCntCd]) {
            if (storage[costCntCd].VENDOR_URL) return resolve({ "vendorUrl": storage[costCntCd].VENDOR_URL, "vendorError": null });

        }
        else storage[costCntCd] = {};

        axios.get(url, { params: getNewParams({ Flag: 'P' }) }).then(resp => {
            if (resp && resp.Table && resp.Table[0] && resp.Table[0].MSG_HTTP_URL) {
                storage[costCntCd]["VENDOR_URL"] = resp.Table[0].MSG_HTTP_URL;
                return resolve({ "vendorUrl": resp.Table[0].MSG_HTTP_URL, "vendorError": null });
            }
            else return resolve({ "vendorUrl": null, "vendorError": "no vendor url found" });

        }).catch(err => {
            return resolve({ "vendorUrl": null, "vendorError": err.message });
        });
    });
}

function getPatients(url) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: getNewParams({ Flag: 'T' }) }).then(resp => {
            if (resp && resp.Table && resp.Table && resp.Table.length && resp.Table.length > 0)
                return resolve({ "patients": resp.Table, "patientsError": null });
            else return resolve({ "patients": [], "patientsError": null });
        }).catch(err => {
            return resolve({ "patients": null, "patientsError": err.message });
        });
    });
}

function updatePatStat(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then(resp => {
            if (resp && resp.Table && resp.Table[0])
                return resolve({ "updStat": JSON.stringify(resp.Table[0]), "updStatError": null });
            else return resolve({ "updStat": null, "updStatError": "error while update status" });
        }).catch(err => {
            return resolve({ "updStat": null, "updStatError": err.message });
        });
    });
}

function getPdf(url, params, rptid, shortId) {
    return new Promise((resolve, reject) => {
        if (rptid == 1 || rptid == 24 || rptid == 32) {
            if (dummyPdf[shortId] && dummyPdf[shortId].PDF_ATTACHMENT)
                return resolve({ "pdf": dummyPdf[shortId], "pdfError": null });
            else return resolve({ "pdf": {}, "pdfError": null });
        }
        else {
			
			if(rptid == 21 || rptid == 22 || rptid == 23|| rptid == 26|| rptid == 27|| rptid == 29|| rptid == 30 || rptid == 28 || rptid == 31|| rptid == 34 || rptid == 33 || rptid == 35  || rptid == 36  || rptid == 37  || rptid == 38 || rptid == 39 || rptid == 40 || rptid == 41 || rptid == 42 || rptid == 43 || rptid == 44 || rptid == 45 || rptid == 46 || rptid == 47 || rptid == 48 || rptid == 49 || rptid == 50 || rptid == 51 || rptid == 52 || rptid == 53 || rptid == 54 || rptid == 55 || rptid == 56 || rptid == 57 || rptid == 58 || rptid == 59 || rptid == 60 || rptid == 61 || rptid == 62 || rptid == 63 || rptid == 64 || rptid == 65 || rptid == 66){
				//console.log("rptid");
				const _headers = {
						"Content-Type": "application/json",
					}
					let _oParams= {};
					if(params.reportType && (params.reportType ==='L' || params.reportType ==='l')){
						_oParams = {
										"BillNo": params.Shorturl || "",
										"ServiceCode": "",
										"Type":"B"
									}
						axios.get(url, { params: _oParams }).then(resp => {
							//console.log("url---",url,params)
              //fs.appendFileSync(filePath, `\n Payload:-${JSON.stringify(resp)}`);
							if (resp && resp.base64 && resp.base64.length && resp.base64.length > 0)
								return resolve({ "pdf": resp.base64, "pdfError": null });
							else return resolve({ "pdf": null, "pdfError": null });
						
						}).catch(err => {
							//console.log("err",err)
							return resolve({ "pdf": null, "pdfError": err.message });
						});
					}
					else {
						_oParams ={"ptype": params.Flag, "shortlink": (params.Shorturl || "") };
					axios.post(url,_oParams, { headers: _headers }).then(async function (resp) {
						//console.log("_oParams",url,_oParams)
						 if (resp && resp.bas64 && resp.bas64.length && resp.bas64.length > 0){
							return resolve({ "pdf":resp.bas64, "pdfError": null });
						 }
						else return resolve({ "pdf": null, "pdfError": null });
						
					}).catch(err => {
						//console.log("err",err)
						return resolve({ "pdf": null, "pdfError": err.message });
					});
				}
				
			}
			else {		
			//console.log("url-getpdf",url,{ params: getNewParams(params ,rptid) });
				axios.get(url, { params: getNewParams(params ,rptid) }).then(resp => {
					if (resp && resp.Table && resp.Table && resp.Table.length && resp.Table.length > 0)
						return resolve({ "pdf": resp.Table[0], "pdfError": null });
					else return resolve({ "pdf": null, "pdfError": null });
				
				}).catch(err => {
					return resolve({ "pdf": null, "pdfError": err.message });
				});	 
			}
        }
    });
}

module.exports = {
    getNewParams,
    isValidRptId,
    getTemplate,
    getVendorUrl,
    getPatients,
    updatePatStat,
    getPdf
}
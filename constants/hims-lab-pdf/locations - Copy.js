const appConfig = require("../../app-config");

const locations = {
    "development": [
        {
            "COMPANYCD": "PINNACLE",
            "COMPANYNAME": "PINNACLE HOSPITAL IND PVT LTD",
            "COSTCENTERCD": "PINNACLE",
            "COSTCENTERNAME": "PINNACLE HOSPITALS IND PVT LTD",
            "MIG_ID": 1003,
            "RPT_ID": 1,
            "URL": "http://172.31.31.61:4567/Patientsmsdetails.asmx/PatientDetails",
            "TEST_MODE": "Y",
            "TEST_MOBILE_NO": "9440104415",
            "TEST_SMS_LIMIT": 4,
            "ACTIVE": "N",
        }
    ],
    "doc9_prod": [
		{
            "COMPANYCD": "SOFTHEALLTH",
            "COMPANYNAME": "SOFTHEALLTH HOSPITALS",
            "COSTCENTERCD": "SOFTHEALLTH",
            "COSTCENTERNAME": "SOFTHEALLTH HOSPITAL",
            "MIG_ID": 0,
            "RPT_ID": 1,
            "URL": "",
            "TEST_MODE": "N",
            "TEST_MOBILE_NO": "",
            "TEST_SMS_LIMIT": 1,
            "ACTIVE": "N",
        },
        {
            "COMPANYCD": "NRI",
            "COMPANYNAME": "QUEEN'S NRI HOSPITAL",
            "COSTCENTERCD": "NRI",
            "COSTCENTERNAME": "QUEEN'S NRI HOSPITAL",
            "MIG_ID": 0,
            "RPT_ID": 11,
            "URL": "http://202.53.69.98:8001/Patientsmsdetails.asmx/PatientDetails",
            "TEST_MODE": "N",
            "TEST_MOBILE_NO": "7799412496",
            "TEST_SMS_LIMIT": 1,
            "ACTIVE": "N",
        },
        {
            "COMPANYCD": "KIMS",
            "COMPANYNAME": "KIMS Hospital",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "KIMS Hospital",
            "MIG_ID": 0,
            "RPT_ID": 12,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails",
            "TEST_MODE": "Y",
            "TEST_MOBILE_NO": "9246545676,8367788899,9440104415,9866399164,9885945475,9885778068,8639244641,9246491199,9703190599, 9642711179",
			//"TEST_MOBILE_NO": "8639244641,9440104415",
			//"TEST_MOBILE_NO": "9440104415",
			//"TEST_MOBILE_NO": "8639244641",
            "TEST_SMS_LIMIT": 10,
            "ACTIVE": "Y",
			"SMS_TYPE":"VOX_PASS",
			"VENDOR_URL":"https://api.vox-cpaas.com/sendsms",
			"PROJECT_ID" : "pid_a1431398_39c4_4ddc_974e_7c4cebba7629",
			"AUTH_TOKEN":"01c9f2c3_6dc2_4b83_9a5a_f64210377ab6",
        },		
        {
            "COMPANYCD": "KIMSK",
            "COMPANYNAME": "KIMS Hospital Enterprises Pvt.Ltd.",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "KONDAPUR",
            "RPT_ID": 13,
            "URL": "http://111.93.30.214:7001/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "KIMSV",
            "COMPANYNAME": "KIMS - ICON HOSPITAL",
            "COSTCENTERCD": "VSP",
            "COSTCENTERNAME": "VISHAKAPATNAM",
            "RPT_ID": 14,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "KSMC",
            "COMPANYNAME": "Saveera Hospital Pvt Ltd",
            "COSTCENTERCD": "ATP",
            "COSTCENTERNAME": "Ananthapur",
            "RPT_ID": 15,
            "URL": "http://lrantp.kimshospitals.com:7001/ShortUrlonSMS/patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "KIMSKU",
            "COMPANYNAME": "Kurnool Rainbow Hospital Pvt. Ltd.",
            "COSTCENTERCD": "KNR",
            "COSTCENTERNAME": "Kurnool",
            "RPT_ID": 16,
            "URL": "http://103.206.112.182:7001/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "BRMH",
            "COMPANYNAME": "KRISHNA INSTITUTE OF MEDICAL SCIENCES Ltd.,",
            "COSTCENTERCD": "NLR",
            "COSTCENTERNAME": "Nellore",
            "RPT_ID": 17,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "BHC",
            "COMPANYNAME": "KIMS Hospital",
            "COSTCENTERCD": "RJ",
            "COSTCENTERNAME": "Rajahmundry",
            "RPT_ID": 18,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },
        {
            "COMPANYCD": "KIMS",
            "COMPANYNAME": "KIMS SAI SESHADRI HOSPITAL",
            "COSTCENTERCD": "SKLM",
            "COSTCENTERNAME": "SRIKAKULAM",
            "RPT_ID": 19,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },	
        {
            "COMPANYCD": "KIMSO",
            "COMPANYNAME": "KIMS HOSPITAL",
            "COSTCENTERCD": "OGL",
            "COSTCENTERNAME": "ONGOLE",
            "RPT_ID": 20,
            "URL": "http://111.93.2.120/ShorturlonSMS/Patientsmsdetails.asmx/PatientDetails"
        },	
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "HITECH CITY",
            "RPT_ID": 21,
            "URL": "http://202.65.140.218:8001/Pdf_rec/ShortUrl/PostPdfBase64"
        },	
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "HITECH CITY",
            "RPT_ID": 22,
            "URL": "http://202.65.140.218:8001/Shorturl/HIMS/LabBillServicePdf"
        },	
		{
            "COMPANYCD": "APEX",
            "COMPANYNAME": "Apex Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "Hydearabad",
            "RPT_ID": 23,
            "URL": "http://182.75.32.70:806/Shorturl/HIS/LabBillServicePdf"
        },	
		{
            "COMPANYCD": "AAYUSH",
            "COMPANYNAME": "Aayush Hospitals",
            "COSTCENTERCD": "VJA",
            "COSTCENTERNAME": "Vijayawada",
            "RPT_ID": 24,
            "URL": "http://182.75.32.70:8001/HIS/LabBillServicePdf"
        },	
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "HITECH CITY",
            "RPT_ID": 25,
            "URL": ""
        },	
		{
             "COMPANYCD": "KIMSN",
            "COMPANYNAME": "KIMS HOSPITAL",
            "COSTCENTERCD": "NLR",
            "COSTCENTERNAME": "Nellore ",
            "RPT_ID": 26,
            "URL": "http://136.233.46.129/Shorturl/HIMS/LabBillServicePdf"
        },
		{
             "COMPANYCD": "AAYUSH",
            "COMPANYNAME": "AAYUSH HOSPITAL",
            "COSTCENTERCD": "AAYUSH",
            "COSTCENTERNAME": "Vijaywada ",
            "RPT_ID": 27,
            "URL": "http://103.90.158.202:8002/Shorturl/HIMS/LabBillServicePdf"
        },
		{
             "COMPANYCD": "PSIMS",
            "COMPANYNAME": "PINNAMANENI SIDDHARTH HOSPITAL",
            "COSTCENTERCD": "PINNAMANENI",
            "COSTCENTERNAME": "Vijaywada ",
            "RPT_ID": 28,
            "URL": "http://103.90.159.43:8001/Shorturl/HIMS/LabBillServicePdf"
        },		
		{
            "COMPANYCD": "APPLE",
            "COMPANYNAME": "APPLE HOSPITAL",
            "COSTCENTERCD": "APPLE",
            "COSTCENTERNAME": "Thanuku",
            "RPT_ID": 29,
            "URL": "http://103.105.103.148:7001/Shorturl/HIMS/LabBillServicePdf"
        },
        {
            "COMPANYCD": "ANH",
            "COMPANYNAME": "ANIL NEERUKONDA HOSPITAL",
            "COSTCENTERCD": "ANH",
            "COSTCENTERNAME": "ANH",
            "RPT_ID": 30,
            "URL": "http://103.141.246.227:8002/Shorturl/HIMS/LabBillServicePdf"
        },
        {
            "COMPANYCD": "DOLPHIN",
            "COMPANYNAME": "DOLPHIN HOSPITAL",
            "COSTCENTERCD": "DOLPHIN HOSPITAL",
            "COSTCENTERNAME": "DOLPHIN HOSPITAL",
            "RPT_ID": 31,
            "URL": "http://49.205.68.139:8001/Shorturl/HIMS/LabPdfReports"
        },
		{
            "COMPANYCD": "SUNSHINE",
            "COMPANYNAME": "SUNSHINE HOSPITAL",
            "COSTCENTERCD": "SUNSHINE HOSPITAL",
            "COSTCENTERNAME": "SUNSHINE HOSPITAL",
            "RPT_ID": 32,
            "URL": ""
        },
		/*secendrabad*/
		{
            "COMPANYCD": "SUNSHINE",
            "COMPANYNAME": "SUNSHINE HOSPITAL",
            "COSTCENTERCD": "SUNSHINE HOSPITAL",
            "COSTCENTERNAME": "SUNSHINE HOSPITAL",
            "RPT_ID": 33,
            "URL": "http://14.97.146.82:8001/ShortUrlSMS/HIMS/LabBillServicePdf"
        },
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "CHANDANAGAR",
            "RPT_ID": 34,
            "URL": "http://14.99.205.2:8002/Shorturl/HIMS/LabBillServicePdf"
        },
        /*Hitech City*/		
		{
            "COMPANYCD": "PACE",
            "COMPANYNAME": "PACE HOSPITAL",
            "COSTCENTERCD": "PACE HOSPITAL",
            "COSTCENTERNAME": "PACE HOSPITAL",
            "RPT_ID": 35,
            "URL": "http://183.82.120.232:7001/Shorturl/HIMS/LabBillServicePdf"
        },
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "medicover srikakulam",
            "RPT_ID": 36,
            "URL": "http://14.99.202.54:8002/ShortUrlSMS/HIMS/LabBillServicePdf"
        },	
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "medicover nizamabad",
            "RPT_ID": 37,
            "URL": "http://103.125.162.2:8002/ShortUrlSMS/HIMS/LabBillServicePdf"
        },
		{
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "medicover nashik",
            "RPT_ID": 38,
            "URL": "http://49.248.142.62:8002/ShortUrlSMS/HIMS/LabBillServicePdf"
        },
        {
            "COMPANYCD": "heritage hospital",
            "COMPANYNAME": "heritage hospital",
            "COSTCENTERCD": "heritage hospital",
            "COSTCENTERNAME": "heritage hospital",
            "RPT_ID": 39,
            "URL": "http://1.22.197.134:8002/ShortUrlSMS/HIMS/LabBillServicePdf"
        },	
        {
            "COMPANYCD": "MCHM",
            "COMPANYNAME": "Medicover Hospitals",
            "COSTCENTERCD": "HY",
            "COSTCENTERNAME": "medicover nellore",
            "RPT_ID": 40,
            "URL": "http://103.248.211.162:8002/ShortUrlSMS/HIMS/LabBillServicePdf"
        },		
    ]
}

module.exports = locations[appConfig.NODE_ENV];
const arr = [
 /*
	{
        "ORG_ID": 1067,
        "LOC_ID": 1088,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.com/sendsms",
            "PROJECT_ID": "pid_e88a693c_8960_4fab_8d26_fb96c83a3401",
            "AUTH_TOKEN": "322081dc_a5d4_442f_91e1_dc9455892170"
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",//"9440104415,8639244641,7095208801,9573444541",//9440104415,9246491199
        "TEST_EMAIL": "suvarnahospitals@gmail.com, muni@suvarna.co.in",
        "ACTIVE": "Y"
    },
	*/
	{
        "ORG_ID": 1067,					// doc9
        "LOC_ID": 1088,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.in/sendsms",
		
            "PROJECT_ID": "pid_d50d7da1_0479_40f0_bcd0_00df9a1f7c32",
            "AUTH_TOKEN": "b6d32e27_eb9c_4e27_bdf9_c29b722ad5c3",
			"FROM" :"DRNINE"			
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "7330958016",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    // DOctor9 end
	//******************intalk started***********
	{
        "ORG_ID": 10677,					// intalk
        "LOC_ID": 10888,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.in/sendsms",
		
            "PROJECT_ID": "pid_947ba691_a0bf_4611_8a89_bad5419ee12c",
            "AUTH_TOKEN": "221af89c_baf9_4ef1_b3a4_b719f53a5101",
			"FROM" :"INTALK"
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "Y",
        "TEST_MOBILE_NUMBER": "8639244641,6300582859",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	//******************intalk end***********
    {
        "ORG_ID": 1001,					// Prime
        "LOC_ID": 1001,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=aprime&passwd=sms12345&sid=APRIME&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
            // "VENDOR_TYPE": "VOX_PASS",
            // "VENDOR_URL": "https://api.vox-cpaas.com/sendsms",
            // "PROJECT_ID": "pid_e88a693c_8960_4fab_8d26_fb96c83a3401",
            // "AUTH_TOKEN": "322081dc_a5d4_442f_91e1_dc9455892170"			
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 465,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1003,					// Aayush
        "LOC_ID": 1004,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.in/sendsms",
		
            "PROJECT_ID": "pid_d50d7da1_0479_40f0_bcd0_00df9a1f7c32",
            "AUTH_TOKEN": "b6d32e27_eb9c_4e27_bdf9_c29b722ad5c3"			
        },
        "EMAIL": {
            "SERVER_HOST": "smtpout.secureserver.net",
            "PORT": 587,
            "HOST_EMAIL": "appointments@aayushhospitals.com",
            "HOST_EMAIL_PWD": "appointments9*9"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "8639244641,6300582859",   //8919545989
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1018,					// MGCancer
        "LOC_ID": 1019,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=MGCHSU&passwd=MGCH@1234&sid=LOTUS&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""		
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "suvarnahospitals@gmail.com",
        "ACTIVE": "Y"
    },	
	{
        "ORG_ID": 1040,		//LOTUS
        "LOC_ID": 1145,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=lotuschildrens&passwd=Lotusit@123&sid=LOTUS&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",//"8106270276,9440104415,8639244641",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1019,				//bbr
        "LOC_ID": 1020,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.in/sendsms",
            "PROJECT_ID": "pid_e88a693c_8960_4fab_8d26_fb96c83a3401",
            "AUTH_TOKEN": "322081dc_a5d4_442f_91e1_dc9455892170"
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",//"9866726447",//9440104415,9246491199
        "TEST_EMAIL": "bbrteleconsultations@gmail.com, suvarnahospitals@gmail",
        "ACTIVE": "Y"
    },	
	{
        "ORG_ID": 1101,		//sudar
        "LOC_ID": 1123,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=SUDAR.HOSPITAL&passwd=sudar123&sid=SUDAR&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",//"9440104415,6305198950",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1020,					// rkh
        "LOC_ID": 1021,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.com/sendsms",
		
            "PROJECT_ID": "pid_e88a693c_8960_4fab_8d26_fb96c83a3401",
            "AUTH_TOKEN": "322081dc_a5d4_442f_91e1_dc9455892170"			
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",//"9440104415,8106270276",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1014,					// Thirumala
        "LOC_ID": 1015,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://sms.teleosms.com/api/mt/SendSMS?user=tmhosp&password=12345&senderid=TMHOSP&channel=Trans&DCS=0&flashsms=0&route=2&number={MOB_NUMBER}&text={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER":"", //"8106270276,9177011519,9440104415",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1174,					// mgm
        "LOC_ID": 1245,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to={MOB_NUMBER}&msg={MOB_MESSAGE}&msg_type=TEXT&userid=2000166401&auth_scheme=plain&password=abc123&v=1.1&format=text",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER":"", //"8106270276,9177011519,9440104415",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	 {
        "ORG_ID": 1049,
        "LOC_ID": 1186,            //srikara-sec
        "SMS": {
            "VENDOR_TYPE": "BULK_SMS_GTWAY",
            "VENDOR_URL": "http://login.bulksmsgateway.in/sendmessage.php?user=srikarahospitals&password=srikara@123&mobile={MOB_NUMBER}&message={MOB_MESSAGE}&sender=SRISEC&type=3",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "8639244641,9666004722",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1049,
        "LOC_ID": 1188,            //srikara-miyapur
        "SMS": {
            "VENDOR_TYPE": "BULK_SMS_GTWAY",
            "VENDOR_URL": "http://login.bulksmsgateway.in/sendmessage.php?user=srikarahospitals&password=srikara@123&mobile={MOB_NUMBER}&message={MOB_MESSAGE}&sender=SRIMYP&type=3",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "8639244641,9666004722",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1049,
        "LOC_ID": 1069,            //srikara-vijayawada
        "SMS": {
            "VENDOR_TYPE": "BULK_SMS_GTWAY",
            "VENDOR_URL": "http://login.bulksmsgateway.in/sendmessage.php?user=srikarahospitals&password=srikara@123&mobile={MOB_NUMBER}&message={MOB_MESSAGE}&sender=SRIVJY&type=3",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "Y",
        "TEST_MOBILE_NUMBER": "8639244641,9666004722",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1049,
        "LOC_ID": 1187,            //srikara-LBNagar
        "SMS": {
            "VENDOR_TYPE": "BULK_SMS_GTWAY",
            "VENDOR_URL": "http://login.bulksmsgateway.in/sendmessage.php?user=srikarahospitals&password=srikara@123&mobile={MOB_NUMBER}&message={MOB_MESSAGE}&sender=SRILBN&type=3",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "Y",
        "TEST_MOBILE_NUMBER": "8639244641,9666004722",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1150,				//parkview
        "LOC_ID": 1196,
        "SMS": {
            "VENDOR_TYPE": "MALERT",
            //"VENDOR_URL": "https://apps.malert.io/api/api_http.php?route=Informative&type=text&username=PARKVIEWBOOKING&password=Admin@2021&senderid=PARKVW&to={MOB_NUMBER}&text={MOB_MESSAGE}",
            "VENDOR_URL": "http://www.apiconnecto.com/API/SMSApiConnector.aspx?UserId=parkviewtr&pwd=pwd2021&Message={MOB_MESSAGE}&Contacts={MOB_NUMBER}&SenderId=PARKVW&ServiceName=SMSTRANS&MessageType=1",
			"PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "8639244641,7671012309",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1026,
        "LOC_ID": 1035,
        "SMS": {
            "VENDOR_TYPE": "ENFFIE",
            "VENDOR_URL": "http://sms.enffie.com/sendsms?uname=hindlabs&pwd=hindlab963&senderid=HLLLAB&to={MOB_NUMBER}&msg={MOB_MESSAGE}&route=SID",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1027,
        "LOC_ID": 1149,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1178,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1179,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1205,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1206,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1180,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1181,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1182,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1183,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1028,
        "LOC_ID": 1190,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1029,
        "LOC_ID": 1032,
        "SMS": {
            "VENDOR_TYPE": "ENFFIE",
            "VENDOR_URL": "http://sms.enffie.com/sendsms?uname=hindlabs&pwd=hindlab963&senderid=HLLLAB&to={MOB_NUMBER}&msg={MOB_MESSAGE}&route=SID",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1030,
        "LOC_ID": 1037,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=pimshims&passwd=pimshims@123&sid=PIMSHO&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1032,
        "LOC_ID": 1042,
        "SMS": {
            "VENDOR_TYPE": "ABSOLUTE_SMS",
            "VENDOR_URL": "http://absolutesms.in/api?uname=subodh@pacehospitals.in&pwd=pace1234&sender=PACEHL&number={MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    
    {
        "ORG_ID": 1049,
        "LOC_ID": 1186,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1049,
        "LOC_ID": 1187,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1049,
        "LOC_ID": 1188,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1071,
        "LOC_ID": 1197,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1090,
        "LOC_ID": 1111,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1118,
        "LOC_ID": 1207,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=cleoskinclinic&passwd=86306477&sid=CLEOSC&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1118,
        "LOC_ID": 1208,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1121,
        "LOC_ID": 1153,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1125,
        "LOC_ID": 1150,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1126,
        "LOC_ID": 1154,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1127,
        "LOC_ID": 1157,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1129,
        "LOC_ID": 1158,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1130,
        "LOC_ID": 1159,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1130,
        "LOC_ID": 1160,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1131,
        "LOC_ID": 1161,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1132,
        "LOC_ID": 1162,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1132,
        "LOC_ID": 1163,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1133,
        "LOC_ID": 1164,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1137,
        "LOC_ID": 1166,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1138,
        "LOC_ID": 1167,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1139,
        "LOC_ID": 1171,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1140,
        "LOC_ID": 1172,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1141,
        "LOC_ID": 1173,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1142,
        "LOC_ID": 1174,        
		"SMS": {
            "VENDOR_TYPE": "SMS9",
            "VENDOR_URL": "http://sms.sms9.in/app/smsapi/index.php?username=sandeep&password=123456&campaign=8175&routeid=100990&type=text&contacts={MOB_NUMBER}&senderid=Sriman&msg={MOB_MESSAGE}"
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1175,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1191,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1192,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1193,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1194,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1144,
        "LOC_ID": 1176,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1145,
        "LOC_ID": 1177,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1185,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kdshirish&passwd=maruti2018&sid=KDHOSP&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "it@kdhospital.co.in",
        "ACTIVE": "Y"
    },
	
    {
        "ORG_ID": 1146,
        "LOC_ID": 1229,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1259,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1232,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1234,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1235,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1146,
        "LOC_ID": 1236,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1147,
        "LOC_ID": 1189,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1149,
        "LOC_ID": 1195,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1150,
        "LOC_ID": 1196,
        "SMS": {
            "VENDOR_TYPE": "apiconnecto",
            //"VENDOR_URL": "https://malert.in/api/api_http.php?username=PARKVIEW&password=PARKADMIN@2018&senderid=PARKVw&route=Informative&type=text&to={MOB_NUMBER}&text={MOB_MESSAGE}",
			"VENDOR_URL": "http://www.apiconnecto.com/API/SMSApiConnector.aspx?UserId=parkviewtr&pwd=pwd2021&Message={MOB_MESSAGE}&Contacts={MOB_NUMBER}&SenderId=PARKVW&ServiceName=SMSTRANS&MessageType=1",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "7671012309,8639244641",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1198,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1213,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1214,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1215,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1216,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1217,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1218,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1219,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1220,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "N"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1221,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1222,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1223,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1224,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1225,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1226,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1227,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1151,
        "LOC_ID": 1228,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1152,
        "LOC_ID": 1199,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=AMCHNASHIK&passwd=Amch@123&sid=AMCH&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1154,
        "LOC_ID": 1201,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1155,
        "LOC_ID": 1203,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=kimskon1&passwd=kimsit1&sid=KIMSHYD&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1165,
        "LOC_ID": 1211,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	{
        "ORG_ID": 1166,
        "LOC_ID": 1231,
        "SMS": {
            "VENDOR_TYPE": "BULKSMSAPPS",
            "VENDOR_URL": "http://www.bulksmsapps.com/api/apismsv2.aspx?apikey=72295b92-d0bb-4146-8142-3b089fa7aa89&sender=NILIMA&number={MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1176,
        "LOC_ID": 1253,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1176,
        "LOC_ID": 1254,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1176,
        "LOC_ID": 1255,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 1178,
        "LOC_ID": 1261,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
	
		// local environment
	
  {
        "ORG_ID": 2,
        "LOC_ID": 2,
        "SMS": {
            "VENDOR_TYPE": "VOX_PASS",
            "VENDOR_URL": "https://api.vox-cpaas.in/sendsms",
            "PROJECT_ID": "pid_e88a693c_8960_4fab_8d26_fb96c83a3401",
            "AUTH_TOKEN": "322081dc_a5d4_442f_91e1_dc9455892170"
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 1,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=AMCHNASHIK&passwd=Amch@123&sid=AMCH&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 3,
        "SMS": {
            "VENDOR_TYPE": "BULK_SMS_GTWAY",
            "VENDOR_URL": "https://login.bulksmsgateway.in/sendmessage.php?user=aayushhospitals&password=aayush@123&type=3&sender=Aayush&mobile={MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 4,
        "SMS": {
            "VENDOR_TYPE": "ENFFIE",
            "VENDOR_URL": "http://sms.enffie.com/sendsms?uname=hindlabs&pwd=hindlab963&senderid=HLLLAB&to={MOB_NUMBER}&msg={MOB_MESSAGE}&route=SID",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 5,
        "SMS": {
            "VENDOR_TYPE": "MALERT",
            "VENDOR_URL": "https://malert.in/api/api_http.php?username=PARKVIEW&password=PARKADMIN@2018&senderid=PARKVw&route=Informative&type=text&to={MOB_NUMBER}&text={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 6,
        "SMS": {
            "VENDOR_TYPE": "ABSOLUTE_SMS",
            "VENDOR_URL": "http://absolutesms.in/api?uname=subodh@pacehospitals.in&pwd=pace1234&sender=PACEHL&number={MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 2,
        "LOC_ID": 7,
        "SMS": {
            "VENDOR_TYPE": "MOBI_SMART",
            "VENDOR_URL": "http://mobismart.in:10010/netxwui/smslink/?user=LH_Prathima&pass=Prath321&sender=PRHKCG&dest={MOB_NUMBER}&type=T&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "",
            "PORT": 0,
            "HOST_EMAIL": "",
            "HOST_EMAIL_PWD": ""
        },
        "IS_TEST": "N",
        "TEST_MOBILE_NUMBER": "",
        "TEST_EMAIL": "",
        "ACTIVE": "Y"
    },
    {
        "ORG_ID": 106711,
        "LOC_ID": 108811,
        "SMS": {
            "VENDOR_TYPE": "SMS_COUNTRY",
            "VENDOR_URL": "http://api.smscountry.com/SMSCwebservice_Bulk.aspx?User=aprime&passwd=sms12345&sid=APRIME&mtype=N&DR=Y&mobilenumber=91{MOB_NUMBER}&message={MOB_MESSAGE}",
            "PROJECT_ID": "",
            "AUTH_TOKEN": ""
        },
        "EMAIL": {
            "SERVER_HOST": "smtp.gmail.com",
            "PORT": 465,
            "HOST_EMAIL": "emr.doc9@gmail.com",
            "HOST_EMAIL_PWD": "emr$123456"
        },
        "IS_TEST": "Y",
        "TEST_MOBILE_NUMBER": "9440104415,9246491199",
        "TEST_EMAIL": "sivareddykota007@gmail.com",
        "ACTIVE": "N"
    },	
];

module.exports = arr;
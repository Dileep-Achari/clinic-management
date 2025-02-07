const globalArr = [
    {
        "REQ_TYPE_ID": 1,
        "REQ_DESC": "Online Appointment with payment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment with {DOC_NAME_DESIG_SPEC} at {ORG_NAME},{LOC_NAME} is confirmed on {APMNT_DT} at {APMNT_TIME}.   Your reference number is {APMNT_ID}. Please visit and register 15 minutes prior to your appointment time",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Appointment Confirmation</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Appointment Confirmation</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {DOC_NAME_DESIG_SPEC}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME} </p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:{OFFICE_PHONE}" style="color: #0000ff; text-decoration: none;">{OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },

    {
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Online Appointment without payment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="{ORG_LOGO}" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;">Thank You For Booking an Appointment</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> Please note that the scheduled appointment time may be delayed/postponed due to the doctorӳ emergency visits/procedures.</p> </li> <li> <p>Please carry your valid address proof (preferably Aadhar card) </p> </li><li><p>Must wear a face mask while entering into the hospital </p></li> <li><p>Please co-operate with our staff and give all details asked sincerely. </p></li><li><p>Please contact OP Manager for any further assistance/grievance</p></li></ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For more information Call<a href="tel:{OFFICE_PHONE}" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div> <br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> {ORG_KEY}.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 3,
        "REQ_DESC": "Payment against an online appointment when walk in",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been confirmed with Dr.{DOC_NAME} at {LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Payment against an online appointment when walk in</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Payment against an online appointment when walk in</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {APMNT_DT} {APMNT_TIME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> Dr.{DOC_NAME_DESIG_SPEC}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ADDRESS}, </p> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ADDRESS}</p> </div> </div> <div style="margin: 25px 0 25px 0;"> <input style="padding:8px 10px; background: #2e5387; color: #fff; font-size: 12px; cursor: pointer; border: none; border-radius: 2px;" type="button" value="Cancel Appointment" /> <input style="padding:8px 10px; background: #2e5387; color: #fff; font-size: 12px; cursor: pointer; border: none; border-radius: 2px;" type="button" value="Re-Schedule Appointment" /> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Reminder of an appointment booked",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Appointment cancellation</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="https://doctime.doctor9.com/email/mainlogo.png" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Appointment cancellation</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been cancelled. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME_DESIG_SPEC}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Remarks</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{REMARKS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>If you would like to book another appointment, <a href="" style=" color: #0000ff;"> www.doctor9.com</a></p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;">{OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 6,
        "REQ_DESC": "Patient Registration ",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have Registered with {ORG_NAME}, {LOC_NAME}. your Unique Medical Record No is {UMR_NO}. Thankyou for registering with us.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Patient Registration</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Patient Registration</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Thank you for Registering with <strong> {ORG_NAME}</strong>. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">UMR Number</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{UMR_NO} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME} </p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}.</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 7,
        "REQ_DESC": "Drop Request for an online appointment by user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Request for Appointment with {DOC_NAME} on {APMNT_DT} at {ORG_NAME},{LOC_NAME} has been successfully submitted. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Drop Request for an online appointment by user</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Drop Request for an online appointment by user</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your Request for an Appointment has been listed. We will get back to you on any improvement with the listing update through email or SMS. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME_DESIG_SPEC}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna.We will try and intimate you if any such forceble changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}.</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 8,
        "REQ_DESC": "Appointment Confirmed against a drop request ",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment has been confirmed with {DOC_NAME} on {APMNT_DT} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Appointment Confirmed against a drop request</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Appointment Confirmed against a drop request</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your Appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME_DESIG_SPEC}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 9,
        "REQ_DESC": "Doctor Delay",
        "MOB_TEMPLATE": "Hi, {PAT_NAME}. Your appointment on {APMNT_DT} has been delayed for {B.NOTES} minutes with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 10,
        "REQ_DESC": "Not sync with clients",
        "MOB_TEMPLATE": "{NOTES}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 11,
        "REQ_DESC": "Corporate Patient Registration",
        "MOB_TEMPLATE": "Dear, {PAT_NAME}, You have Registered with {ORG_NAME}, {LOC_NAME}. your Unique Medical Record No is {UMR_NO}. Thankyou for registering with us.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Corporate Patient Registration</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Corporate Patient Registration</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Thank you for Registering with <strong>{ORG_NAME} </strong>. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">UMR Number</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{UMR_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 12,
        "REQ_DESC": "Corporate Patient Consultation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Corporate Patient Consultation</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Corporate Patient Consultation</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME_DESIG_SPEC} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 13,
        "REQ_DESC": "Corporate Package Booking",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Corporate Package Booking</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Corporate Package Booking</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME_DESIG_SPEC} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 16,
        "REQ_DESC": "Pc Patient Forget Password",
        "MOB_TEMPLATE": "Hi {USER_NAME}, Your password has been reset successfully. Your New Password is:{TEMP_PWD}. Please login and change the password immediately.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Pc Patient Forget Password</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Pc Patient Forget Password</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {USER_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your password has been reset successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">New Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PWD}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please login and change the password immediately.</p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 17,
        "REQ_DESC": "Pc Patient Change Password",
        "MOB_TEMPLATE": "Hi {USER_NAME}, Your password has been changed successfully. Your New Password is:{TEMP_PWD}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Pc Patient Change Password</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Pc Patient Change Password</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {USER_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your password has been reset successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">New Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PWD} </p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please login and change the password immediately.</p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 19,
        "REQ_DESC": "Reminder for an appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, you have an Appointment today with {DOC_NAME} at {APMNT_DT} in {ORG_NAME},#{LOC_NAME}.Please report at the hospital 30 Min prior to the scheduled Time.  Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Reminder for an appointment</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder for an appointment</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME}</strong>. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 20,
        "REQ_DESC": "Appointment booking (walk in)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Thank You For Booking an Appointment</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Thank You For Booking an Appointment</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 21,
        "REQ_DESC": "Rescheduled appointment (by office)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at {ORG_NAME},{LOC_NAME},due to {REMARKS}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Appointment Reschedule</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Appointment Reschedule</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {DOC_NAME} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 22,
        "REQ_DESC": "Cancelling an appointment (by office)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME}, {LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Cancelling an appointment</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Cancelling an appointment (by Hospital)</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been cancelled. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">@$ADDRESS@#</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Remarks</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{REMARKS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Appointment Reschedule</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Appointment Reschedule</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME}</storng>, </h4> <p style="line-height: 20px;"> Reschedule Appointment. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Previous Appointment Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{FROM_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Current Appointment Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TO_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;"> {DOC_NAME} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Remarks</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{REMARKS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 24,
        "REQ_DESC": "Doctor Schedule Creation",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, Your Appointment Schedule has been created successfully {ORG_NAME},{LOC_NAME}. From Date:{FROM_DT}, To Date:{TO_DT}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Doctor Schedule Creation</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Doctor Schedule Creation</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {DOC_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your Appointment Schedule has been created successfully. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">from Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{FROM_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">to Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TO_DT}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}/p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 25,
        "REQ_DESC": "Doctor schedule cancelled by PA",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, Your Appointment Schedule has been cancelled successfully at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Doctor Schedule Cancelled</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg"" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Doctor Schedule Cancelled </h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/client_logo/123.jpg"" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {DOC_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your Appointment Schedule has been cancelled successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">from Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{FROM_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">to Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TO_DT}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME} {LOC_NAME}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Good Morning, Dear {DOC_NAME}, You have  {APMNT_COUNT} appointment bookings for the day at {LOC_NAME}. Have a nice day!" ,
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 27,
        "REQ_DESC": "OP Doctor Leave Message",
        "MOB_TEMPLATE": "Dear Sir, {DOC_NAME} Leave On From {LEAVE_FROM_DT} to {LEAVE_TO_DT} in {LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 28,
        "REQ_DESC": "Forget Password",
        "MOB_TEMPLATE": "Hi {USER_NAME}, Your password has been reset successfully. Your New Password is:{TEMP_PWD}. Please login and change the password immediately.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Forget Password</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Forget Password</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{USER_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your password has been reset successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">New Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PWD} </p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please login and change the password immediately.</p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 29,
        "REQ_DESC": "Practice verification completed",
        "MOB_TEMPLATE": "Dear Admin, Your {ORG_NAME} has been created successfully. Update your Practice details login through our Website using below Credentials.      User Name: {USER_NAME},     Password: {USER_NAME}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Practice verification completed</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Practice verification completed</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Hi <storng style="color: #333;"> Admin </storng>, </h4> <p style="line-height: 20px;"> Your <strong> {ORG_NAME} </strong> Practice has been created successfully. Update your Practice details by login into our <strong>{WEB_URL}</strong> using below Credentials. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom:15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">User Name</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{USER_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PW}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.dotor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 30,
        "REQ_DESC": "Facility Created",
        "MOB_TEMPLATE": "Hi Practice Admin, A New Facility({LOC_NAME}) has been created successfully in {ORG_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Facility Created</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Facility Created</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Hi <storng style="color: #333;"> Practice Admin </storng>, </h4> <p style="line-height: 20px;"> A New Facility <strong>{LOC_NAME}</strong> has been created successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 31,
        "REQ_DESC": "Doctor Created",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, Your Profile has been created in {ORG_NAME},{LOC_NAME}. Please login into our {WEB_URL} using below Credentials. User Name: {USER_NAME}, Password: {TEMP_PWD}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Doctor Created</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Doctor Created</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {DOC_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your Profile has been created successfully. Please login into our <strong> {WEB_URL}</strong> using below Credentials. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">User Name </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{USER_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PWD}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 32,
        "REQ_DESC": "Employee Created",
        "MOB_TEMPLATE": "Hi {EMP_NAME}, Your Profile has been created in {ORG_NAME},{LOC_NAME}. Please Contact Facility Admin for User Credentials.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Employee Created</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Employee Created</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;">{EMP_NAME}</storng>, </h4> <p style="line-height: 20px;"> Your Profile has been created. Please Contact Facility Admin for User Credentials. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 33,
        "REQ_DESC": "Suvarna Admin",
        "MOB_TEMPLATE": "Hi Admin, A new Practice creation request has been dropped in our {WEB_URL} please go through below details and initiate the verification process.      Practice Name:{ORG_NAME},      Contact Person:{CNTCT_NAME},      Contact Number:{CNTCT_NUM},      Email Id:{EMAIL_ID}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Suvarna Admin</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Suvarna Admin</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Hi <storng style="color: #333;"> Admin </storng>, </h4> <p style="line-height: 20px;"> A new Practice creation request has been dropped in our <strong> {WEB_URL}</strong>, please go through below details and initiate the verification process. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom:15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}</p> </div> <div style="margin-bottom:15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Person</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{CNTCT_NAME}</p> </div> <div style="margin-bottom:15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{CNTCT_NUM}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Email Id</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{EMAIL_ID}</p> </div> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 34,
        "REQ_DESC": "Practice Admin",
        "MOB_TEMPLATE": "Hi {CNTCT_NAME}, Your request for Practice creation has been submitted successfully.     Our team will get back to you for verification process and once verification done, you will be sent a confirmation mail with user credentials.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Practice Admin</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Practice Admin</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Hi <storng style="color: #333;"> Admin </storng>, </h4> <p style="line-height: 20px;"> Hi, Your request for Practice creation has been submitted successfully. Our team will get back to you for verification process and you will get a confirmation mail with user credentials once verification process was completed. </p> </div> <div> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;">www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 35,
        "REQ_DESC": "Online Package Booked without payment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Online Package Booked without payment</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Thank You For Booking an Package Appointment</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME}</storng>, </h4> <p style="line-height: 20px;"> Your appointment has been confirmed. following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 40,
        "REQ_DESC": "Change Password",
        "MOB_TEMPLATE": "Hi {USER_NAME}, Your password has been chenged successfully. Your New Password is:{TEMP_PWD}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Change Password</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> For Changing Password</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {USER_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your password has been reset successfully. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">New Password</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{TEMP_PWD} </p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p>Please login and change the password immediately.</p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 41,
        "REQ_DESC": "Slot Cancel SMS For CC Manager",
        "MOB_TEMPLATE": "Cancelled An Appointment in the Name of {PAT_NAME} ON {APMNT_DT} For {DOC_NAME},{SPECIALITY_NAME} at {ORG_NAME}, {LOC_NAME} BY {USER_NAME},{USER_ID}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 42,
        "REQ_DESC": "Doctor Visit Feedback",
        "MOB_TEMPLATE": "Hi,{PAT_NAME}. If you are statisfied with {DOC_NAME} visit experience send sms YES or NO to 9999999999.  Help us to improve make your visit more satisfactory and accomplished.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 43,
        "REQ_DESC": "Resend Online Appointment with or without payment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Resend Appointment Confirmation</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Resend Appointment Confirmation</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%;"> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> Your appointment has been cancelled. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Doctor</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{DOC_NAME} </p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;"> Hospital / Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME}, {LOC_NAME}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:7675801220" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "REQ_TYPE_ID": 46,
        "REQ_DESC": "Health Package Cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your {SERVICE_NAME} Health Checkup appointment on {APMNT_DT} has been cancelled at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 47,
        "REQ_DESC": "Health CheckUp Remainder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your {SERVICE_NAME} Health Checkup appointment on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you..",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 50,
        "REQ_DESC": "OTP",
        "MOB_TEMPLATE": "{OTP} IS YOUR ONE TIME PASSWORD DO NOT SHARE THIS OTP WITH ANY ONE.(EXPIRES IN 5 MINS)",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 52,
        "REQ_DESC": "Lab Services Remainder",
        "MOB_TEMPLATE": "Hi,You have an Appointment with  {DOC_NAME} on {APMNT_DT} at {ORG_NAME},{LOC_NAME}.Avail Lab Services @ Home from Ramesh Hospitals NABL Accredited Lab. Reduce OP wait time. Service within City. Vijayawada - 9666561118 Guntur: 7036662277. Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 53,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "Hi,You have an Appointment with  {DOC_NAME} on {APMNT_DT} at {ORG_NAME},{LOC_NAME}.Avail Lab Services @ Home from Ramesh Hospitals NABL Accredited Lab. Reduce OP wait time. Service within City. Vijayawada - 9666561118 Guntur: 7036662277. Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
    {
        "REQ_TYPE_ID": 54,
        "REQ_DESC": "Discharge Summary Preparation Message",
        "MOB_TEMPLATE": "Summary Completed for {PAT_NAME}, {ADMN_NO} .Please Check and Approve it by Click on this link. {DSCHRG_SUM_URL}{SHORT_URL}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
	 {
        "REQ_TYPE_ID": 68,
        "REQ_DESC": "Video Consultation for Patient",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT} With {DOC_NAME}, Please click following link https://v.doctor9.com/p/j/{SLOTS_ID} to Start - DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
	{
        "REQ_TYPE_ID": 69,
        "REQ_DESC": "Video Consultation for Doctor",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT} With {PAT_NAME}, Please click following link https://v.doctor9.com/d/j/{SLOTS_ID} to Start - DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
	{
        "REQ_TYPE_ID": 70,
        "REQ_DESC": "Video Consultation Remainder",
        "MOB_TEMPLATE": "Dear {PAT_NAME} Your video consultation is ready to start with {DOC_NAME}, Please click following link https://nvcapi.doctor9.com/patient/join/{SLOTS_ID} to join - EMR",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
   {
        "REQ_TYPE_ID": 88,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start - {ORG_NAME}",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start - {ORG_NAME}"
    },	
   {
        "REQ_TYPE_ID": 89,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT} with {PAT_NAME}, Please click following link https://nvcapi.doctor9.com/doctor/join/{VC_GUID} to Start - {ORG_NAME}",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start - {ORG_NAME}"
    },		
    {
        "REQ_TYPE_ID": 103,
        "REQ_DESC": "Mobile Template FeedBack",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Feel free to give your feedback about our {ORG_NAME}, Help us to improve make your visit more satisfactory and accomplished. Please click following link for your feedback https://fb.doctor9.com/{URL_SHORTNER}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": ""
    },
	{
        "REQ_TYPE_ID": 105,
        "REQ_DESC": "appointment sms to doctor",
        "MOB_TEMPLATE": "",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": ""
    },
	 {
        "REQ_TYPE_ID": 108,
        "REQ_DESC": "OPD Assessment Report",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},Your Assment Report With {DOC_NAME} is at : http://dr9.in/O/{SHORT_URL}.pdf ,Thank you-{ORG_NAME}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" class="container" width="402"><tr><td><div style="border:1px solid #cacaca;max-width:500px;margin:20px auto;border-radius:10px;font-family:sans-serif;font-size:13px;padding:20px;box-shadow:2px 3px 8px 0 #a9a9a9"><div style="margin:10px 0 20px 0"><h4 style="margin:0">Dear &nbsp;<storng style="color:#333">{PAT_NAME}</storng>,</h4><h4 style="margin:10px 0 0 0">Warm Greetings from Aayush Hospitals, Vijayawada.</h4><p style="line-height:20px;color:#333">Thank you for obtaining Consultation with <b>{DOC_NAME}</b> at Aayush Hospitals, Vijayawada. Please click on the following link <a href="http://dr9.in/O/{SHORT_URL}.pdf" style="color:#00f;text-decoration:underline">http://dr9.in/O/{SHORT_URL}.pdf</a> to view and save your Assessment report of <b>{UMR_NO}</b></p><p style="line-height:20px;color:#333">If you have any difficulty while accessing the link, please contact our support team using the information below. Please do not contact support for questions related to your clinical information. They are available for technical support only (from 9am to 6pm only on all working days)</p><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px"><b style="color:#4e4e4e;display:block">"Wish You a Speedy Recovery"</b></label></div><div><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px">Thank You,</label><b style="color:#4e4e4e;display:block">Team Aayush..</b></div><div><div style="margin:20px 0"><h2 style="text-align:center;margin:0"><a href=""><img src="{ORG_LOGO}" height="150px"></a></h2></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">appointments@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Mobile : <b>(+91) 84980 61141</b></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">For Emergency Contact : <b>(+91) 8500229874, (+91) 9603 959595; (+91) 9603929292</b></span></div><div style="text-align:center;margin:20px 0"><img style="height:100px" src="http://emr.doctor9.com/assets/img/contact.png"></div><div style="text-align:center;color:#4e4e4e"><p style="margin:0;line-height:20px"><b>AAYUSH NRI LEPL HEALTHCARE PVT LTD</b></p><p style="margin:0;line-height:20px"><b>CIN: U85100AP2011PTC072069</b></p><p style="margin:0;line-height:20px">Sri Ramachandra Nagar, Ring road</p><p style="margin:0;line-height:20px">Vijayawada - 520008, Andhra Pradesh, INDIA</p><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">info@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Website : <a href="#" style="color:#00f;text-decoration:none">www.aayushhospitals.com</a></span></div></div><div style="color:#bdbdbd;font-size:11px;line-height:15px;margin-top:20px"><b>Disclaimer:</b><p>This message contains confidential medical information and is intended only for the individual patient named. If you are not the named addressee, you should not disseminate, distribute or copy this email. Taking any action in reliance on the contents of this information is strictly prohibited. Please notify the sender immediately by email if you have received this email by mistake and delete this email from your system.</p></div></div></div></td></tr></table></td></tr></table></body></html>`
    },
	 {
        "REQ_TYPE_ID": 109,
        "REQ_DESC": "Discharge Summary PDF SMS",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with  {DOC_NAME} is at : http://dr9.in/D/{SHORT_URL}.pdf , Thank you-{ORG_NAME}",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<div><p>Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with {DOC_NAME},Please :<a href="http://dr9.in/D/{SHORT_URL}.pdf">click here</a>,Thank you-{ORG_NAME}</p></div>`
    }
	
];

const locArr = [
    {
        "ORG_ID": 1001,//Prime
        "LOC_ID": 1001,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your have an Appointment with {DOC_NAME} on {APMNT_DT} {APMNT_TIME} (Apmnt Id:{APMNT_ID}) at {ORG_NAME}, {LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1001,//Prime
        "LOC_ID": 1001,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1003,  //Aayush
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161709697145086"
    },
    {
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/aayush.png" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`,
		"MOB_TEMPLATE_ID":"1507161709690202730"
    },
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 54,
        "REQ_DESC": "Discharge Summary Preparation Message",
        "MOB_TEMPLATE": "Summary Completed for {PAT_NAME}, {ADMN_NO} .Please Check and Approve it by Click on this link. {DSCHRG_SUM_URL}{SHORT_URL}.-DRNINE",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161751687535021"
    },
	
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 108,
        "REQ_DESC": "OPD Assessment Report",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},Your Assessment Report With {DOC_NAME} is at :{#var#}http://dr9.in/O/{SHORT_URL}.pdf ,Thank you.-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" class="container" width="402"><tr><td><div style="border:1px solid #cacaca;max-width:500px;margin:20px auto;border-radius:10px;font-family:sans-serif;font-size:13px;padding:20px;box-shadow:2px 3px 8px 0 #a9a9a9"><div style="margin:10px 0 20px 0"><h4 style="margin:0">Dear &nbsp;<storng style="color:#333">{PAT_NAME}</storng>,</h4><h4 style="margin:10px 0 0 0">Warm Greetings from Aayush Hospitals, Vijayawada.</h4><p style="line-height:20px;color:#333">Thank you for obtaining Consultation with <b>{DOC_NAME}</b> at Aayush Hospitals, Vijayawada. Please click on the following link <a href="http://dr9.in/O/{SHORT_URL}.pdf" style="color:#00f;text-decoration:underline">http://dr9.in/O/{SHORT_URL}.pdf</a> to view and save your Assessment report of <b>{UMR_NO}</b></p><p style="line-height:20px;color:#333">If you have any difficulty while accessing the link, please contact our support team using the information below. Please do not contact support for questions related to your clinical information. They are available for technical support only (from 9am to 6pm only on all working days)</p><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px"><b style="color:#4e4e4e;display:block">"Wish You a Speedy Recovery"</b></label></div><div><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px">Thank You,</label><b style="color:#4e4e4e;display:block">Team Aayush..</b></div><div><div style="margin:20px 0"><h2 style="text-align:center;margin:0"><a href=""><img src="{ORG_LOGO}" height="150px"></a></h2></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">appointments@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Mobile : <b>(+91) 84980 61141</b></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">For Emergency Contact : <b>(+91) 8500229874, (+91) 9603 959595; (+91) 9603929292</b></span></div><div style="text-align:center;margin:20px 0"><img style="height:100px" src="http://emr.doctor9.com/assets/img/contact.png"></div><div style="text-align:center;color:#4e4e4e"><p style="margin:0;line-height:20px"><b>AAYUSH NRI LEPL HEALTHCARE PVT LTD</b></p><p style="margin:0;line-height:20px"><b>CIN: U85100AP2011PTC072069</b></p><p style="margin:0;line-height:20px">Sri Ramachandra Nagar, Ring road</p><p style="margin:0;line-height:20px">Vijayawada - 520008, Andhra Pradesh, INDIA</p><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">info@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Website : <a href="#" style="color:#00f;text-decoration:none">www.aayushhospitals.com</a></span></div></div><div style="color:#bdbdbd;font-size:11px;line-height:15px;margin-top:20px"><b>Disclaimer:</b><p>This message contains confidential medical information and is intended only for the individual patient named. If you are not the named addressee, you should not disseminate, distribute or copy this email. Taking any action in reliance on the contents of this information is strictly prohibited. Please notify the sender immediately by email if you have received this email by mistake and delete this email from your system.</p></div></div></div></td></tr></table></td></tr></table></body></html>`,
		"MOB_TEMPLATE_ID":"1507161743303949564"
    },
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 109,
        "REQ_DESC": "Discharge Summary PDF SMS",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with  {DOC_NAME} is at :  http://dr9.in/D/{SHORT_URL}.pdf, Thank you-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<div><p>Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with {DOC_NAME},Please :<a href="http://dr9.in/D/{SHORT_URL}.pdf">click here</a>,Thank you-{ORG_NAME}</p></div>`,
		"MOB_TEMPLATE_ID":"1507161743311881632"
    },
	 {
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 103,
        "REQ_DESC": "Mobile Template FeedBack",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Thank you for your visit to Aayush Hospitals. We would greatly appreciate it if you could fill in the feedback about your experience with us. https://fb.doctor9.com/{URL_SHORTNER} . Have a wonderful day - Team Aayush-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507162796644141055"
    },
	 {
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 89,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "",
        "EMAIL_TEMPLATE": "You have video consultation on {CREATE_DT} with {PAT_NAME}, Please click following link https://nvcapi.doctor9.com/doctor/join/{VC_GUID} to Start.-DRNINE",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 88,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start.-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743278378195"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 151,
        "REQ_DESC": "covid patient Request accepted",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID inpatient admission request {ADMN_REQ_ID} has been accepted. Based on bed availability you will be intimated about admission date & time details. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916554739319"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 152,
        "REQ_DESC": "covid patient Request rejected",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID admission request {ADMN_REQ_ID} has been rejected due to non availability of beds. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916561030516"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 68,	
        "REQ_DESC": "Video Consultation for Patient",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {DOC_NAME}, Please click following link https://v.doctor9.com/p/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 69,	
        "REQ_DESC": "Video Consultation for Doctor",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {PAT_NAME}, Please click following link https://v.doctor9.com/d/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1004,
        "REQ_TYPE_ID": 70,	
        "REQ_DESC": "Video Consultation Remainder",
        "MOB_TEMPLATE": "Dear {PAT_NAME} Your video consultation is ready to start with {DOC_NAME}, Please click following link https://nvcapi.doctor9.com/patient/join/{APMNT_ID} to join - EMR",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161822818204880"
    },
    {
        "ORG_ID": 1018, // MG Cancer
        "LOC_ID": 1019,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} {APMNT_TIME} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at Mahatma Gandhi Cancer Hospital.",
        "EMAIL_TEMPLATE": ""
    },
  	
    {
        "ORG_ID": 1018,
        "LOC_ID": 1019,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in Mahatma Gandhi Cancer Hospital. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1018,
        "LOC_ID": 1019,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at Mahatma Gandhi Cancer Hospital.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1067,
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161709697145086"
    },
    {
        "ORG_ID": 1067,
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
	{
        "ORG_ID": 1067,
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 54,
        "REQ_DESC": "Discharge Summary Preparation Message",
        "MOB_TEMPLATE": "Summary Completed for {PAT_NAME}, {ADMN_NO} .Please Check and Approve it by Click on this link. {DSCHRG_SUM_URL}{SHORT_URL}.-DRNINE",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161751687535021"
    },
	{
		"ORG_ID": 1067,		// SOFTHEALTH
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 68,	
        "REQ_DESC": "Video Consultation for Patient",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {DOC_NAME}, Please click following link https://v.doctor9.com/p/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1067,		// SOFTHEALTH
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 69,	
        "REQ_DESC": "Video Consultation for Doctor",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {PAT_NAME}, Please click following link https://v.doctor9.com/d/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1067,		// SOFTHEALTH
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 70,	
        "REQ_DESC": "Video Consultation Remainder",
        "MOB_TEMPLATE": "Dear {PAT_NAME} Your video consultation is ready to start with {DOC_NAME}, Please click following link https://nvcapi.doctor9.com/patient/join/{APMNT_ID} to join - EMR",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161822818204880"
    },
	{
        "ORG_ID": 1067,		
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 151,
        "REQ_DESC": "covid patient Request accepted",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID inpatient admission request {ADMN_REQ_ID} has been accepted. Based on bed availability you will be intimated about admission date & time details. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916554739319"
    },
    	{
        "ORG_ID": 1067,		
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 115,
        "REQ_DESC": "HIMS Patient Bill Receipts",
        "MOB_TEMPLATE": "Thank you for choosing Suvarna Hospitals,Please click below Url for Your Receipt Report {#var#}{#var#}",
        "EMAIL_TEMPLATE": "",
		    "MOB_TEMPLATE_ID":"1507164904822148117"
    },
	{
        "ORG_ID": 1067,		
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 152,
        "REQ_DESC": "covid patient Request rejected",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID admission request {ADMN_REQ_ID} has been rejected due to non availability of beds. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916561030516"
    },
    {
        "ORG_ID": 1090,
        "LOC_ID": 1111,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at PARKVIEW HOSPITAL,{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
	{
        "ORG_ID": 1150,			//parkview
        "LOC_ID": 1196,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment with {DOC_NAME} is confirmed on {APMNT_DT} (Apmnt. Id:{APMNT_ID}) at {APMNT_TIME}. PARKVIEW HOSPITAL, Tele: 033 4059 1110, Location(http://bit.ly/315i55M)",
        "EMAIL_TEMPLATE": ""
    },
	{
        "ORG_ID": 1150,      //parkview
        "LOC_ID": 1196,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment with {DOC_NAME} on {APMNT_DT} is cancelled . PARKVIEW HOSPITAL, Tele: 033 4059 1110, Location (http://bit.ly/315i55M)",
        "EMAIL_TEMPLATE": ""
    },
	{
        "ORG_ID": 1150,      //parkview
        "LOC_ID": 1196,
        "REQ_TYPE_ID": 21,
        "REQ_DESC": "Rescheduled appointment (by office)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment with Dr.{DOC_NAME} is rescheduled on {APMNT_DT} at {APMNT_TIME}. PARKVIEW HOSPITAL, Tele: 033 4059 1110, Location (http://bit.ly/315i55M)",
        "EMAIL_TEMPLATE": ""
    },
	{
        "ORG_ID": 1150,      //parkview
        "LOC_ID": 1196,
        "REQ_TYPE_ID": 105,
        "REQ_DESC": "appointment sms to doctor",
        "MOB_TEMPLATE": "Dear {DOC_NAME}, {PAT_NAME} has booked an appointment with you at PARKVIEW HOSPITAL on {APMNT_DT} at {APMNT_TIME}.",
        "EMAIL_TEMPLATE": ""
    },
	
    {
        "ORG_ID": 1090,
        "LOC_ID": 1111,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1118,
        "LOC_ID": 1141,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1118,
        "LOC_ID": 1207,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1118,
        "LOC_ID": 1208,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1143,
        "LOC_ID": 1175,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
    {
        "ORG_ID": 1146,			// KD Hospital
        "LOC_ID": 1185,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} (Apmnt Id:{APMNT_ID}) at {APMNT_TIME}. Please report at the hospital 15 Min prior to the scheduled Time. Please carry Government approved ID proof along with you.Thank you. - KD Hospital",
        "EMAIL_TEMPLATE": ""
    },
	 {
        "ORG_ID": 1174,			// MGM Hospital
        "LOC_ID": 1245,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} has been confirmed with {DOC_NAME} at MGM CBD,{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007163912151606458"
		
    },
	{
        "ORG_ID": 1174,		// MGM Hospital
        "LOC_ID": 1245,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at MGM CBD,{LOC_NAME}.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007163912160239799"
    },
	{
        "ORG_ID": 1174,		// MGM Hospital
        "LOC_ID": 1245,
        "REQ_TYPE_ID": 21,
        "REQ_DESC": "Rescheduled appointment (by office)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at MGM CBD,{LOC_NAME}, due to Doctor was is in Not Available.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007163912167292087"
    },
	{
        "ORG_ID": 1174,		// MGM Hospital
        "LOC_ID": 1245,
        "REQ_TYPE_ID": 105,
        "REQ_DESC": "Appointment Confirmation to Doctor",
        "MOB_TEMPLATE": "Dear {DOC_NAME}, {PAT_NAME} has booked an appointment with you at {LOC_NAME} on {APMNT_DT} at {APMNT_TIME}.MGMCBD",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007164162419270468"
    },
    {
        "ORG_ID": 1146,		// KD Hospital
        "LOC_ID": 1185,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 15 Min prior to the scheduled Time. Thank you.",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/KDHospitals.png" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
    {
        "ORG_ID": 1146,		// KD Hospital
        "LOC_ID": 1185,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancellation",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
    },			
    {
        "ORG_ID": 1146,		// KD Hospital
        "LOC_ID": 1185,
        "REQ_TYPE_ID": 103,
        "REQ_DESC": "Mobile Template FeedBack",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Feel free to give your feedback about our {ORG_NAME}, Help us to improve make your visit more satisfactory and accomplished. Please click following link for your feedback https://fb.doctor9.com/{URL_SHORTNER}",
        "EMAIL_TEMPLATE": ""
    },	
	{
	    "ORG_ID": 1146,		// KD Hospital
        "LOC_ID": 1185,
	    "REQ_TYPE_ID": 54,
        "REQ_DESC": "Discharge Summary Preparation Message",
        "MOB_TEMPLATE": "Summary Completed for {PAT_NAME} ,{ADMN_NO}.Please Check and Approve it by Click on this link. https://kd.doctor9.com/ds/dissum.html?{SHORT_URL}  - KD Hospital",
        "EMAIL_TEMPLATE": ""
	},
    {
        "ORG_ID": 1150,
        "LOC_ID": 1196,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.",
        "EMAIL_TEMPLATE": ""
    },
	{
		"ORG_ID": 1067,
		"LOC_ID": 1088,
        "REQ_TYPE_ID": 108,
        "REQ_DESC": "OPD Assessment Report",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},Your Assessment Report With {DOC_NAME} is at :{#var#}http://dr9.in/O/{SHORT_URL}.pdf ,Thank you.-DRNINE",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" class="container" width="402"><tr><td><div style="border:1px solid #cacaca;max-width:500px;margin:20px auto;border-radius:10px;font-family:sans-serif;font-size:13px;padding:20px;box-shadow:2px 3px 8px 0 #a9a9a9"><div style="margin:10px 0 20px 0"><h4 style="margin:0">Dear &nbsp;<storng style="color:#333">{PAT_NAME}</storng>,</h4><h4 style="margin:10px 0 0 0">Warm Greetings from Aayush Hospitals, Vijayawada.</h4><p style="line-height:20px;color:#333">Thank you for obtaining Consultation with <b>{DOC_NAME}</b> at Aayush Hospitals, Vijayawada. Please click on the following link <a href="http://dr9.in/O/{SHORT_URL}.pdf" style="color:#00f;text-decoration:underline">http://dr9.in/O/{SHORT_URL}.pdf</a> to view and save your Assessment report of <b>{UMR_NO}</b></p><p style="line-height:20px;color:#333">If you have any difficulty while accessing the link, please contact our support team using the information below. Please do not contact support for questions related to your clinical information. They are available for technical support only (from 9am to 6pm only on all working days)</p><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px"><b style="color:#4e4e4e;display:block">"Wish You a Speedy Recovery"</b></label></div><div><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px">Thank You,</label><b style="color:#4e4e4e;display:block">Team Aayush..</b></div><div><div style="margin:20px 0"><h2 style="text-align:center;margin:0"><a href=""><img src="{ORG_LOGO}" height="150px"></a></h2></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">appointments@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Mobile : <b>(+91) 84980 61141</b></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">For Emergency Contact : <b>(+91) 8500229874, (+91) 9603 959595; (+91) 9603929292</b></span></div><div style="text-align:center;margin:20px 0"><img style="height:100px" src="http://emr.doctor9.com/assets/img/contact.png"></div><div style="text-align:center;color:#4e4e4e"><p style="margin:0;line-height:20px"><b>AAYUSH NRI LEPL HEALTHCARE PVT LTD</b></p><p style="margin:0;line-height:20px"><b>CIN: U85100AP2011PTC072069</b></p><p style="margin:0;line-height:20px">Sri Ramachandra Nagar, Ring road</p><p style="margin:0;line-height:20px">Vijayawada - 520008, Andhra Pradesh, INDIA</p><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">info@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Website : <a href="#" style="color:#00f;text-decoration:none">www.aayushhospitals.com</a></span></div></div><div style="color:#bdbdbd;font-size:11px;line-height:15px;margin-top:20px"><b>Disclaimer:</b><p>This message contains confidential medical information and is intended only for the individual patient named. If you are not the named addressee, you should not disseminate, distribute or copy this email. Taking any action in reliance on the contents of this information is strictly prohibited. Please notify the sender immediately by email if you have received this email by mistake and delete this email from your system.</p></div></div></div></td></tr></table></td></tr></table></body></html>`,
		"MOB_TEMPLATE_ID":"1507161743303949564"
    },
	{
		"ORG_ID": 1067,
		"LOC_ID": 1088,
        "REQ_TYPE_ID": 109,
        "REQ_DESC": "Discharge Summary PDF SMS",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with  {DOC_NAME} is at :  http://dr9.in/D/{SHORT_URL}.pdf, Thank you-DRNINE",
        "EMAIL_TEMPLATE": `<div><p>Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with {DOC_NAME},Please :<a href="http://dr9.in/D/{SHORT_URL}.pdf">click here</a>,Thank you-{ORG_NAME}</p></div>`,
		"MOB_TEMPLATE_ID":"1507161743311881632"
    },
	{
        "ORG_ID": 1067,		
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 88,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start.-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743278378195"
    },
	 {
        "ORG_ID": 1067,		
        "LOC_ID": 1088,
        "REQ_TYPE_ID": 89,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "",
        "EMAIL_TEMPLATE": "You have video consultation on {CREATE_DT} with {PAT_NAME}, Please click following link https://nvcapi.doctor9.com/doctor/join/{VC_GUID} to Start.-DRNINE",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
        "ORG_ID": 1014,
        "LOC_ID": 1015,	//tirumala
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": ""
    },
	{
		"ORG_ID": 1067,
		"LOC_ID": 1088,
		"REQ_TYPE_ID": 106,
		"REQ_DESC": "Covid patient creation",
		"MOB_TEMPLATE": "Dear {PATIENT_NAME}, your User Id {CP_UMR_NO} and OTP# {OTP} to login our app click on below url: https://play.google.com/store/apps/details?id=com.softhealth.patient_ydya&hl=en_IN .",
		"EMAIL_TEMPLATE": ""
	},
	{
		"ORG_ID": 1003,
		"LOC_ID": 1004,
		"REQ_TYPE_ID": 106,
		"REQ_DESC": "Covid patient creation",
		"MOB_TEMPLATE": "Dear {PATIENT_NAME}, your User Id {CP_UMR_NO} and OTP# {OTP} to login our app click on below url: https://play.google.com/store/apps/details?id=com.softhealth.patient_ydya&hl=en_IN .",
		"EMAIL_TEMPLATE": ""
	},
	{
		"ORG_ID": 1067,
		"LOC_ID": 1088,
		"REQ_TYPE_ID": 107,
		"REQ_DESC": "Covid Resend otp",
		"MOB_TEMPLATE": "Dear Customer,Your OTP is {OTP}.",
		"EMAIL_TEMPLATE": ""
	},
   {
        "ORG_ID": 1003,  //Aayush
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161709697145086"
    },
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Appointment Reminder",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the hospital 30 Min prior to the scheduled Time. Thank you.-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/aayush.png" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`,
		"MOB_TEMPLATE_ID":"1507161709690202730"
    },
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 54,
        "REQ_DESC": "Discharge Summary Preparation Message",
        "MOB_TEMPLATE": "Summary Completed for {PAT_NAME}, {ADMN_NO} .Please Check and Approve it by Click on this link. {DSCHRG_SUM_URL}{SHORT_URL}.-DRNINE",
        "EMAIL_STYLE": "",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161751687535021"
    },
	
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 108,
        "REQ_DESC": "OPD Assessment Report",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},Your Assessment Report With {DOC_NAME} is at :{#var#}http://dr9.in/O/{SHORT_URL}.pdf ,Thank you.-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" class="container" width="402"><tr><td><div style="border:1px solid #cacaca;max-width:500px;margin:20px auto;border-radius:10px;font-family:sans-serif;font-size:13px;padding:20px;box-shadow:2px 3px 8px 0 #a9a9a9"><div style="margin:10px 0 20px 0"><h4 style="margin:0">Dear &nbsp;<storng style="color:#333">{PAT_NAME}</storng>,</h4><h4 style="margin:10px 0 0 0">Warm Greetings from Aayush Hospitals, Vijayawada.</h4><p style="line-height:20px;color:#333">Thank you for obtaining Consultation with <b>{DOC_NAME}</b> at Aayush Hospitals, Vijayawada. Please click on the following link <a href="http://dr9.in/O/{SHORT_URL}.pdf" style="color:#00f;text-decoration:underline">http://dr9.in/O/{SHORT_URL}.pdf</a> to view and save your Assessment report of <b>{UMR_NO}</b></p><p style="line-height:20px;color:#333">If you have any difficulty while accessing the link, please contact our support team using the information below. Please do not contact support for questions related to your clinical information. They are available for technical support only (from 9am to 6pm only on all working days)</p><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px"><b style="color:#4e4e4e;display:block">"Wish You a Speedy Recovery"</b></label></div><div><label style="color:#4e4e4e;display:block;margin-bottom:3px;font-size:12px">Thank You,</label><b style="color:#4e4e4e;display:block">Team Aayush..</b></div><div><div style="margin:20px 0"><h2 style="text-align:center;margin:0"><a href=""><img src="{ORG_LOGO}" height="150px"></a></h2></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">appointments@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Mobile : <b>(+91) 84980 61141</b></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">For Emergency Contact : <b>(+91) 8500229874, (+91) 9603 959595; (+91) 9603929292</b></span></div><div style="text-align:center;margin:20px 0"><img style="height:100px" src="http://emr.doctor9.com/assets/img/contact.png"></div><div style="text-align:center;color:#4e4e4e"><p style="margin:0;line-height:20px"><b>AAYUSH NRI LEPL HEALTHCARE PVT LTD</b></p><p style="margin:0;line-height:20px"><b>CIN: U85100AP2011PTC072069</b></p><p style="margin:0;line-height:20px">Sri Ramachandra Nagar, Ring road</p><p style="margin:0;line-height:20px">Vijayawada - 520008, Andhra Pradesh, INDIA</p><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Email : <a href="#" style="color:#00f;text-decoration:none">info@aayushhospitals.com</a></span></div><div style="text-align:center;margin-bottom:5px"><span style="color:#4e4e4e;font-size:12px">Website : <a href="#" style="color:#00f;text-decoration:none">www.aayushhospitals.com</a></span></div></div><div style="color:#bdbdbd;font-size:11px;line-height:15px;margin-top:20px"><b>Disclaimer:</b><p>This message contains confidential medical information and is intended only for the individual patient named. If you are not the named addressee, you should not disseminate, distribute or copy this email. Taking any action in reliance on the contents of this information is strictly prohibited. Please notify the sender immediately by email if you have received this email by mistake and delete this email from your system.</p></div></div></div></td></tr></table></td></tr></table></body></html>`,
		"MOB_TEMPLATE_ID":"1507161743303949564"
    },
	{
        "ORG_ID": 1003,//Aayush
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 109,
        "REQ_DESC": "Discharge Summary PDF SMS",
        "MOB_TEMPLATE": "Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with  {DOC_NAME} is at :  http://dr9.in/D/{SHORT_URL}.pdf, Thank you-DRNINE",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<div><p>Dear {PAT_NAME},{UMR_NO},{ADMN_NO},Your Discharge Summary with {DOC_NAME},Please :<a href="http://dr9.in/D/{SHORT_URL}.pdf">click here</a>,Thank you-{ORG_NAME}</p></div>`,
		"MOB_TEMPLATE_ID":"1507161743311881632"
    },
	 {
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 103,
        "REQ_DESC": "Mobile Template FeedBack",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Thank you for your visit to Aayush Hospitals. We would greatly appreciate it if you could fill in the feedback about your experience with us. https://fb.doctor9.com/{URL_SHORTNER} . Have a wonderful day - Team Aayush-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507162796644141055"
    },
	 {
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 89,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "",
        "EMAIL_TEMPLATE": "You have video consultation on {CREATE_DT} with {PAT_NAME}, Please click following link https://nvcapi.doctor9.com/doctor/join/{VC_GUID} to Start.-DRNINE",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 88,
        "REQ_DESC": "Video Consultation",
        "MOB_TEMPLATE": "You have video consultation on {CREATE_DT}, Please click following link https://nvcapi.doctor9.com/patient/join/{VC_GUID} to Start.-DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743278378195"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 151,
        "REQ_DESC": "covid patient Request accepted",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID inpatient admission request {ADMN_REQ_ID} has been accepted. Based on bed availability you will be intimated about admission date & time details. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916554739319"
    },
	{
        "ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 152,
        "REQ_DESC": "covid patient Request rejected",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your COVID admission request {ADMN_REQ_ID} has been rejected due to non availability of beds. Thank you - Aayush Hospitals, Vijayawada. -DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161916561030516"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 68,	
        "REQ_DESC": "Video Consultation for Patient",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {DOC_NAME}, Please click following link https://v.doctor9.com/p/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 69,	
        "REQ_DESC": "Video Consultation for Doctor",
        "MOB_TEMPLATE": "You have video consultation on {APMNT_DT} With {PAT_NAME}, Please click following link https://v.doctor9.com/d/j/{APMNT_ID} to Start - DRNINE",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161743286510831"
    },
	{
		"ORG_ID": 1003,		// Aayush Hospital
        "LOC_ID": 1242,
        "REQ_TYPE_ID": 70,	
        "REQ_DESC": "Video Consultation Remainder",
        "MOB_TEMPLATE": "Dear {PAT_NAME} Your video consultation is ready to start with {DOC_NAME}, Please click following link https://nvcapi.doctor9.com/patient/join/{APMNT_ID} to join - EMR",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507161822818204880"
    },
	{
		"ORG_ID": 1215,		// goutamneuro Hospital
        "LOC_ID": 1279,
        "REQ_TYPE_ID": 2,	
        "REQ_DESC": "Online Appointment without payment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":""
    },
	{
		"ORG_ID": 1215,		// goutamneuro Hospital
        "LOC_ID": 1279,
        "REQ_TYPE_ID": 5,	
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":""
    },
	{
		"ORG_ID": 1215,		// goutamneuro Hospital
        "LOC_ID": 1279,
        "REQ_TYPE_ID": 5,	
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME},{LOC_NAME}.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":""
    },
	{
        "ORG_ID": 1215,		// goutamneuro Hospital
        "LOC_ID": 1279,
        "REQ_TYPE_ID": 21,
        "REQ_DESC": "Rescheduled appointment (by office)",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at {ORG_NAME},{LOC_NAME}, due to Doctor was is in Not Available.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":""
    },
	{
        "ORG_ID": 1215,		// goutamneuro Hospital
        "LOC_ID": 1279,
        "REQ_TYPE_ID": 105,
        "REQ_DESC": "Appointment Confirmation to Doctor",
        "MOB_TEMPLATE": "Dear {DOC_NAME}, {PAT_NAME} has booked an appointment with you at {LOC_NAME} on {APMNT_DT} at {APMNT_TIME}.{ORG_NAME}",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":""
    },
	 {
        "ORG_ID": 1040,  //LOTUS  VSP
        "LOC_ID": 1060,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} Apmnt Id:{APMNT_ID} has been confirmed with {DOC_NAME} at {APMNT_TIME} in {LOC_NAME}. Lotus Hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LUKP
        "LOC_ID": 1145,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} Apmnt Id:{APMNT_ID} has been confirmed with {DOC_NAME} at {APMNT_TIME} in {LOC_NAME}. Lotus Hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS KP
        "LOC_ID": 1146,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} Apmnt Id:{APMNT_ID} has been confirmed with {DOC_NAME} at {APMNT_TIME} in {LOC_NAME}. Lotus Hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LB
        "LOC_ID": 1200,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} Apmnt Id:{APMNT_ID} has been confirmed with {DOC_NAME} at {APMNT_TIME} in {LOC_NAME}. Lotus Hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	{
        "ORG_ID": 1040,  //LOTUS  VSP
        "LOC_ID": 1060,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME}in{LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LUKP
        "LOC_ID": 1145,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME}in{LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS KP
        "LOC_ID": 1146,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME}in{LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LB
        "LOC_ID": 1200,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {ORG_NAME}in{LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },	
	{	
        "ORG_ID": 1040,  //LOTUS  VSP
        "LOC_ID": 1060,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at Lotus Hospitals in {LOC_NAME},due to {REMARKS}. Lotus hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LUKP
        "LOC_ID": 1145,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at Lotus Hospitals in {LOC_NAME},due to {REMARKS}. Lotus hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS KP
        "LOC_ID": 1146,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at Lotus Hospitals in {LOC_NAME},due to {REMARKS}. Lotus hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LB
        "LOC_ID": 1200,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at Lotus Hospitals in {LOC_NAME},due to {REMARKS}. Lotus hospitals.",
        "EMAIL_TEMPLATE": ""
	
    },	
	{
        "ORG_ID": 1040,  //LOTUS  VSP
        "LOC_ID": 1060,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have {APMNT_COUNT} appointment bookings for the day at {ORG_NAME} in {LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LUKP
        "LOC_ID": 1145,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have {APMNT_COUNT} appointment bookings for the day at {ORG_NAME} in {LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS KP
        "LOC_ID": 1146,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have {APMNT_COUNT} appointment bookings for the day at {ORG_NAME} in {LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	 {
        "ORG_ID": 1040,  //LOTUS LB
        "LOC_ID": 1200,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have {APMNT_COUNT} appointment bookings for the day at {ORG_NAME} in {LOC_NAME}. Lotus hospitals",
        "EMAIL_TEMPLATE": ""
	
    },
	
    {
        "ORG_ID": 1219,  //mallareddy
        "LOC_ID": 1285,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using MRNMSH.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507165875531441718"
    },
    {
        "ORG_ID": 1219,  //mallareddy
        "LOC_ID": 1285,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have  {APMNT_COUNT} appointment bookings for the day at {ORG_NAME}, {LOC_NAME} MRNMSH.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1507165875545623296"
	
    },
    {
        "ORG_ID": 1211,  //birrd
        "LOC_ID": 1271,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {ORG_NAME},{LOC_NAME}. Thank you for using our services -BIRRD",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007911367392874513"
    },
     {
        "ORG_ID": 1211,  //birrd
        "LOC_ID": 1271,
        "REQ_TYPE_ID": 50,
        "REQ_DESC": "OTP",
        "MOB_TEMPLATE": "{OTP} is your mobile confirmation code. Please do not share this with anyone. - TTD",
        "EMAIL_TEMPLATE": "",
       	"MOB_TEMPLATE_ID":"1007335773437599093"
    },
    {
        "ORG_ID": 1219,  //mallareddy
        "LOC_ID": 1285,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Reminder of an appointment booked",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {ORG_NAME},{LOC_NAME}. Please report at the Hospital 30 Min prior to the scheduled Time. Thank You MRNMSH.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },
	{
        "ORG_ID": 1217,  //eternelle
        "LOC_ID": 1282,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at SREE ETERNELLE HEALTHCARE,{LOC_NAME}. Thank you for using our services.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1007911367392874513"
    },
	{
        "ORG_ID": 1217,  //eternelle
        "LOC_ID": 1282,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at SREE ETERNELLE HEALTHCARE,{LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
	
    },	
	{
        "ORG_ID": 1217,  //eternelle
        "LOC_ID": 1282,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at SREE ETERNELLE HEALTHCARE, {LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
	
    },	
	{
        "ORG_ID": 1217,  //eternelle
        "LOC_ID": 1282,
        "REQ_TYPE_ID": 26,
        "REQ_DESC": "Appointment and schedule reminder to a doctor",
        "MOB_TEMPLATE": "Hi {DOC_NAME}, You have {APMNT_COUNT} appointment bookings for the day at SREE ETERNELLE HEALTHCARE,{LOC_NAME}.",
        "EMAIL_TEMPLATE": ""
	
    },
	{
        "ORG_ID": 1217,  //eternelle
        "LOC_ID": 1282,
        "REQ_TYPE_ID": 50,
        "REQ_DESC": "OTP",
        "MOB_TEMPLATE": "{OTP} is your mobile confirmation code. Please do not share this with anyone.(EXPIRES IN 5 MINS)-SREE ETERNELLE HEALTHCARE",
        "EMAIL_TEMPLATE": "",
       	"MOB_TEMPLATE_ID":"1007335773437599093"
    },

    {
        "ORG_ID": 1049,  //Srikara -sec
        "LOC_ID": 1186,
        "REQ_TYPE_ID": 2,
        "REQ_DESC": "Thank You For Booking an Appointment",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, Your appointment on {APMNT_DT} (Apmnt Id:{APMNT_ID}) has been confirmed with {DOC_NAME} at {LOC_NAME} Srikara Hospitals.",
        "EMAIL_TEMPLATE": "",
		"MOB_TEMPLATE_ID":"1207166244870462063"
    },
    {
        "ORG_ID": 1049,  //Srikara -sec
        "LOC_ID": 1186,
        "REQ_TYPE_ID": 5,
        "REQ_DESC": "Appointment cancelled by an user",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your appointment on {APMNT_DT} has been cancelled with {DOC_NAME} at {LOC_NAME} Srikara Hospitals.",
        "EMAIL_TEMPLATE": "",
        "MOB_TEMPLATE_ID":"1207166244879672535"
	
    },	
    {
        "ORG_ID": 1049,  //Srikara -sec
        "LOC_ID": 1186,
        "REQ_TYPE_ID": 23,
        "REQ_DESC": "Rescheduling an appointment to another day",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, your Appointment on {FROM_DT} with {DOC_NAME} has been rescheduled to {TO_DT} at {LOC_NAME} Srikara Hospitals.",
        "EMAIL_TEMPLATE": "",
        "MOB_TEMPLATE_ID":"1207166244885840779"
	
    },
    {
        "ORG_ID": 1049,  //Srikara -sec
        "LOC_ID": 1186,
        "REQ_TYPE_ID": 4,
        "REQ_DESC": "Reminder of an appointment booked",
        "MOB_TEMPLATE_ID":"1207166244910451555",
        "MOB_TEMPLATE": "Dear {PAT_NAME}, You have an Appointment with {DOC_NAME} on {APMNT_DT} in {LOC_NAME} Srikara Hospitals. Please report at the hospital 30 Min prior to the scheduled Time Thank you.",
        "EMAIL_STYLE": "<style> h1 { color: #2e5387; font-size: 15px; } body { font-family: Verdana; font-size: 12px; } .email-wrapper { margin: 0px auto; width: 90%; height: 600px; background: #fff; padding: 1%; position: relative; } .email-patname h1 { font-size: 14px; color: Red; } .email-patdetails { background: #f2f2f2; padding: 10px; border-bottom: 1px solid #cbcbcb; border-left: 2px solid #186098; } .email-text { float: left; width: 100%; } .email-text ul { list-style: inherit; padding-left: 40px; } .email-text ul li { color: Gray; } .email-text a { color: Blue; } .email-buttons { margin-top: 10px; width: 100%; float: left; margin-bottom: 20px; } .email-footer { width: 98%; padding: 15px 0; background: #DEEDF9; text-align: center; position: absolute; border-bottom: 1px solid #cbcbcb; bottom: 10px; } .email-cancel-app { background: #fac57f; margin-bottom: 10px; padding: 7px 0px; } .email-cancel-app label { margin-left: 5px; font-weight: bold; } .buttons { float: right; padding: 4px 7px 4px 7px; background: #2e5387; color: #fff; text-decoration: none; font-family: Roboto; font-size: 13px; margin-left: 5px; cursor: pointer; position: relative; border: none; border-radius: 2px; } .formtext { border-collapse: inherit; border: 0px; } .formtext td { text-align: left; position: relative; padding: 4px 0 4px 0; vertical-align: middle; } .formtext label { font-size: 13px; color: #6b6b6b; }</style>",
        "EMAIL_TEMPLATE": `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head><body> <table id="bgtable" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top"> <table border="0" cellpadding="0" cellspacing="0" class="container" width="402"> <tr> <td> <div style="border:1px solid #cacaca;max-width: 500px;margin:20px auto;border-radius:10px;font-family: sans-serif;font-size: 13px;padding: 20px;box-shadow: 2px 3px 8px 0px #a9a9a9;"> <h2 style="text-align: center;margin: 0px;"> <a href=""> <img src="http://emr.doctor9.com/client_logo/123.jpg" height="60px"></a> </h2> <h4 style="text-align: center;margin: 15px 0 15px 0;padding: 0;font-size: 16px;color: #1a3352;letter-spacing: -0.6px;"> Reminder of an appointment booked Appointment Reminder</h4> <div style=" text-align: center; "> <img src="http://emr.doctor9.com/assets/img/doc-img-success.jpg" width="100%" style=" width: 60%; "> </div> <div style="margin: 10px 0 20px 0;"> <h4 style="margin: 0px;">Dear <storng style="color: #333;"> {PAT_NAME} </storng>, </h4> <p style="line-height: 20px;"> You have an appointment with <strong> {DOC_NAME_DESIG_SPEC}</strong> following are the details. </p> </div> <div style="background: #fbfbfb; padding: 20px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e6e6e6;"> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Appointment ID</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_ID}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Contact Number </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{MOBILE_NO}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Date </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{APMNT_DT}</p> </div> <div style="margin-bottom: 15px;"> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Hospital/Clinic </h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ORG_NAME},{LOC_NAME}</p> </div> <div> <h3 style="color: #737272; font-size: 12px; margin: 0px;">Address</h3> <p style="color: #0061a8;margin: 2px 0 0 0;font-size: 15px;">{ADDRESS}</p> </div> </div> <div> <b style="color: #bdbdbd; font-size: 11px; line-height: 15px;">Please Note: </b> <ul style="color: #bdbdbd; font-size: 11px; line-height: 15px; padding-left: 13px;"> <li> <p> You are requested to report at the hospital atleast 30 mins before the appointment time. In the event you are late, your appointment will be late.</p> </li> <li> <p>Please note that the scheduled appointment time is a commitment provided by the hospital and any delays or changes to the same is not a responsibility of Suvarna. We will try and intimate you if any such foreseeable changes occur. </p> </li> </ul> <div style=" text-align: center; padding: 7px; margin-bottom: 5px;"> <span style="color: #4e4e4e;font-size:12px;">For any more information Call<a href="tel:@$OFFICE_PHONE@#" style="color: #0000ff; text-decoration: none;"> {OFFICE_PHONE}</a> <span> </span></span></div><br><label style="color: #4e4e4e; display: block;margin-bottom:3px;font-size:12px">Thank You,</label> <label style=" color: #4e4e4e; display: block;">Team <a href="" style=" color: #0000ff;"> www.doctor9.com</a></label> </div> </div> </td> </tr> </table> </td> </tr> </table></body></html>`
    },	
		
	
];

module.exports = (orgId, locId, reqId, typ) => {
    if (!typ) {
        let locFind = locArr.find(l => (l.ORG_ID === parseInt(orgId) && l.LOC_ID === parseInt(locId) && l.REQ_TYPE_ID === parseInt(reqId)));
        let globObj = globalArr.find(g => g.REQ_TYPE_ID === parseInt(reqId));

        if (!locFind) {
            //const globObj = globalArr.find(g => g.REQ_TYPE_ID === parseInt(reqId));
            if (globObj) return globObj;
            else null;
        }
        else {
            if (globObj) {
                if (!locFind.EMAIL_STYLE) locFind.EMAIL_STYLE = globObj.EMAIL_STYLE || "";
                if (!locFind.EMAIL_TEMPLATE) locFind.EMAIL_TEMPLATE = globObj.EMAIL_TEMPLATE || "";
            }
            return locFind;
        }
    }
    else if (typ === "ALL") {
        if (!orgId && !locId) {
            return globalArr;
        }
        else {
            let arr = [];
            for (let tmp of globalArr) {
                const locFind = locArr.find(l => (l.ORG_ID === parseInt(tmp.ORG_ID) && l.LOC_ID === parseInt(tmp.LOC_ID) && l.REQ_TYPE_ID === parseInt(tmp.REQ_TYPE_ID)));
                if (locFind) {
                    arr.push(locFind);
                }
                else {
                    arr.push({
                        "ORG_ID": orgId,
                        "LOC_ID": locId,
                        "REQ_TYPE_ID": tmp.REQ_TYPE_ID,
                        "REQ_DESC": tmp.REQ_DESC,
                        "MOB_TEMPLATE": tmp.MOB_TEMPLATE,
                        "EMAIL_TEMPLATE": tmp.EMAIL_TEMPLATE,
                        "EMAIL_STYLE": tmp.EMAIL_STYLE
                    });
                }
            }
            return arr;
        }
    }
    else return null;
}
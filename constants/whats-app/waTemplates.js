const  _waTemplates = [{
    "orgName": "Ramesh Hospitals",
    "orgKey": "RAMESH",
    "locName": "Vijayawada",
    "orgId": 2,
    "locId": 3,
    "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPUkdfSUQiOiIwMDA0IiwiTE9DX0lEIjoiMDAwNCIsIkhPU1QiOiJSQU1FU0giLCJFTlYiOiJQIiwiaWF0IjoxNjQzNzc3MDk4fQ.5q36r7I_ETyRTPcYzNkEdOqBCy7NKvDxGfcDS9zq8Zo",
    "templates": [
        {
            "reqTypeId": 4,
            "templateId": "rh_4_bkd_appt_rmdr",
            "templateType": "TEXT",
            "template": "Dear <var1>, You have an Appointment with <var2> on <var3> in Ramesh Hospitals, <var4>. Please report at the hospital 30 Min prior to the                              scheduled Time. Thank you. Ramesh Hospitals.",
            "placeHolders": "{PAT_NAME}^^^{DOC_NAME}^^^{APMNT_DT}^^^{LOC_NAME}"
        },
        {
            "reqTypeId": 5,
            "templateId": "rh_5_appt_can_by_user",
            "templateType": "TEXT",
            "template": "Dear <var1>, your appointment on <var2> has been cancelled with <var3> at <var4>,<var5>.",
            "placeHolders": "{PAT_NAME}^^^{APMNT_DT}^^^{DOC_NAME}^^^{ORG_NAME}^^^{LOC_NAME}"
        },
        {
            "reqTypeId": 20,
            "templateId": "rh_20_appt_bkg_wlk_in_new",
            "templateType": "TEXT",
            "template": "Dear <var1>, Your appointment on <var2> (Apmnt Id:<var3>) has been confirmed with <var4> at Ramesh Hospitals, <var5>. Thank you for using our services - Ramesh Hospitals.",
            "placeHolders": "{PAT_NAME}^^^{APMNT_DT}^^^{APMNT_ID}^^^{DOC_NAME}^^^{LOC_NAME}"
        },
       /* {
            "reqTypeId": 75,
            "templateId": "rh_75_doc_init_asmnt_rmdr_inpat",
            "templateType": "TEXT",
            "template": "<var1>, The following Inpatient New Born Initial Assessment not signed off by you, please do it immediately with IP No: (<var2>)",
            "placeHolders": "{DOCTOR_NAME}^^^{IP_NO}"
        },

        {
            "reqTypeId": 76,
            "templateId": "rh_76_doc_init_asmnt_rmdr_new_born_baby",
            "templateType": "TEXT",
            "template": "<var1>, The following Inpatient initial Assessment not signed off by you, please do it immediately with IP No: (<var2>)",
            "placeHolders": "{DOCTOR_NAME}^^^{IP_NO}"
        },*/

        {
            "reqTypeId": 103,
            "templateId": "rh_103_pat_consul_fb",
            "templateType": "TEXT",
            "template": "Dear <var1>, Thank you for choosing Ramesh Hospitals, please provide your valuable feedback to improve our services. var2/var3 - Ramesh Hospitals.",
            "placeHolders": "{PATIENT_NAME}^^^{URL}^^^{URL_SHORTNER}"
        },
        {
            "reqTypeId": 57,
            "templateId": "rh_57_cross_consul_referral",
            "templateType": "TEXT",
            "template": "Cross Consultation Request for <var1>, <var2>. Location is <var3> Suggested By <var4> On <var5>. Request Visit Type is <var6>. Please plan for it - Ramesh Hospitals",
            "placeHolders": "{DISPLAY_NAME}^^^{ADMN_NO}^^^{WARD}^^^{ROOM}^^^{BED}^^^{PRIMARY_DOCTOR}^^^{VST_TIME_RQSTD}^^^{APT_PRIORITY}"
        },
        {
            "reqTypeId": 115,
            "templateId": "rh_115_bill_receipt_with_btn_v3",
            "templateType": "TEXT",
            "template": "Dear <var1>, Greetings, your digital <var2> receipt dated <var3> is ready at a click. <var4>/<var5>. Thank You For choosing Ramesh Hospitals. Note: This link will Expire on <var6>.",
            "placeHolders": "{PATIENT_NAME}^^^{BILL_TITLE}^^^{TRANS_DATE}^^^{RPT_URL}^^^{SHORT_URL}^^^{EXPIRE_DT}",
            "boldExcludes":""
        },
        {
            "reqTypeId": 54,
            "templateId": "rh_54_dis_summ_prep_msg",
            "templateType": "TEXT",
            "template": "Summary Completed for <var1>, <var2>. Please Check and Approve it by Click on this link. <var3>/<var4>?<var5> - Ramesh Hospitals",
            "placeHolders": "{DISPLAY_NAME}^^^{ADMN_NO}^^^{URL}^^^{URL_DISC}^^^{DSCH_GUID}"
        }
        
    ]
}];


module.exports = _waTemplates;
module.exports = {
    verifyumrsendotp: (params, isLoadAjax) => {
        params.FLAG = "U";
        return params;
    },
    verifyotp: (params, isLoadAjax) => {
        params.FLAG = "A";
        return params;
    },


    chkUserLogin: (params, isLoadAjax) => {
        return {
            "USER_NAME": params.USER_NAME,
            "PASSWORD": params.PASSWORD,
            "MACHINE": params.MACHINE,
            "VERSION": params.VERSION,
            "TERMINAL": params.TERMINAL,
            "OSUSER": params.OSUSER,
            "TIMEZONE_ID": params.TIMEZONE_ID,
            "FLAG": params.FLAG,
            "SESSION_ID": params.SESSION_ID,
            "ORG_ID": params.ORG_ID,
            "LOGIN_TYPE": params.LOGIN_TYPE,
            "LOC_ID": params.LOC_ID,
            "PATIENT_TYPE": params.PATIENT_TYPE,
            "CURRENT_TIME": params.CURRENT_TIME,
            "FROM": params.FROM,
            "ORG_KEY": params.ORG_KEY,
            "BROWSER": params.BROWSER,
            "BROWSER_VER": params.BROWSER_VER
        }
    },
    insPortalUserSession: (params, isLoadAjax) => {
        return {
            "IP_MACHINE": params.IP_MACHINE,
            "IP_VERSION": params.IP_VERSION,
            "IP_USER_ID": params.IP_USER_ID,
            "IP_GUID": params.IP_GUID,
            "IP_START_TIME": params.IP_START_TIME,
            "IP_END_TIME": params.IP_END_TIME,
            "IP_ORG_ID": params.IP_ORG_ID,
            "IP_ROLE_ID": params.IP_ROLE_ID,
            "IP_CREATE_BY": params.IP_CREATE_BY,
            "IP_LOC_ID": params.IP_LOC_ID,
            "IP_TIMEZONE_ID": params.IP_TIMEZONE_ID,
            "IP_REFERENCE_TYPE_ID": params.IP_REFERENCE_TYPE_ID,
            "IP_MINUTES": params.IP_MINUTES,
            "IP_ORG_KEY": params.IP_ORG_KEY,
            "BROWSER": params.BROWSER,
            "BROWSER_VER": params.BROWSER_VER,
            "FLAG": params.FLAG,
            "IP_WARD_ID": params.IP_WARD_ID,
            "IP_MODULE_NAME": params.IP_MODULE_NAME,
            "CURRENT_TIME": params.CURRENT_TIME
        }
    },
    getPortalSession: (params, isLoadAjax) => {
        return {
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getOrgKey: (params, isLoadAjax) => {
        return {

            "ORG_KEY": params.ORG_KEY,
            "SESSION_ID": params.SESSION_ID
        }
    },
    getPatApmnts: (params, isLoadAjax) => {
        return {

            "PAT_ID": params.PAT_ID,
            "UHR_NO": params.UHR_NO,
            "UMR_NO": params.UMR_NO,
            "SLOT_ID": params.SLOT_ID,
            "FLAG": params.FLAG,
            "PATIENT_NAME": params.PATIENT_NAME,
            "MOBILE_NO": params.MOBILE_NO,
            "SESSION_ID": params.SESSION_ID
        }
    },
    getPatDoc: (params, isLoadAjax) => {
        return {
            "IP_MRN_NO": params.IP_MRN_NO,
            "IP_SLOT_ID": params.IP_SLOT_ID,
            "IP_SESSION_ID": params.IP_SESSION_ID,
            "IP_OLR_ID": params.IP_OLR_ID,
            "IP_PATIENT_ID": params.IP_PATIENT_ID
        }

    },
    getLoginPatDet: (params, isLoadAjax) => {
        return {

            "USER_NAME": params.USER_NAME,
            "ORG_ID": params.ORG_ID,
            "FLAG": params.FLAG,
            "IP_SESSION_ID": params.IP_SESSION_ID,

        }

    },
    getPatAdtDschrgSum: (params, isLoadAjax) => {
        return {
            "ADMN_NO": params.ADMN_NO,
            "UMR_NO": params.UMR_NO,
            "SUMMARY_ID": params.SUMMARY_ID,
            "FLAG": params.FLAG
        }
    },
    insUpdOtp: (params, isLoadAjax) => {
        return {
            "OTP_ID": params.OTP_ID,
            "USER_NAME": params.USER_NAME,
            "UHR_NO": params.UHR_NO,
            "UMR_NO": params.UMR_NO,
            "MOBILE_NO": params.MOBILE_NO,
            "ROLE_ID": params.ROLE_ID,
            "REMARKS": params.REMARKS,
            "FLAG": params.FLAG,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    updOtp: (params, isLoadAjax) => {
        return {
            "PASSWORD": params.PASSWORD,
            "FLAG": params.FLAG,
            "USER_NAME": params.USER_NAME,
            "UHR_NO": params.UHR_NO,
            "UMR_NO": params.UMR_NO,
            "EMAIL_ID": params.EMAIL_ID,
            "MOBILE_NO": params.MOBILE_NO,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getOtp: (params, isLoadAjax) => {
        return {
            "OTP": params.OTP,
            "USER_NAME": params.USER_NAME,
            "UHR_NO": params.UHR_NO,
            "UMR_NO": params.UMR_NO,
            "MOBILE_NO": params.MOBILE_NO,
            "FLAG": params.FLAG,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getAllDoctors: (params, isLoadAjax) => {
        return {
            "CITY_ID": params.CITY_ID,
            "SPECILIZATION_ID": params.SPECILIZATION_ID,
            "FROM_DT": params.FROM_DT,
            "TO_DT": params.TO_DT,
            "DOCTOR_ID": params.DOCTOR_ID,
            "DOCTOR_NAME": params.DOCTOR_NAME,
            "PAGENUM": params.PAGENUM,
            "ORG_ID": params.ORG_ID,
            "LOC_ID": params.LOC_ID,
            "REFERENCE_TYPE_ID": params.REFERENCE_TYPE_ID,
            "AREA_ID": params.AREA_ID,
            "PREFIEX_TEXT": params.PREFIEX_TEXT,
            "SESSION_ID": params.SESSION_ID
        }
    },
    getlocbyorg: (params, isLoadAjax) => {
        return {
            "ORG_ID": params.ORG_ID,
            "SESSION_ID": params.SESSION_ID
        }
    },
    get7AvlDtsFrOlr: (params, isLoadAjax) => {
        return {
            "OLR_ID": params.OLR_ID,
            "DT": params.DT,
            "DT_FLAG": params.DT_FLAG,
            "AVB_FLAG": params.AVB_FLAG,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getSltsFrOlr: (params, isLoadAjax) => {
        return {
            "OLR_ID": params.OLR_ID,
            "FROM_DT": params.FROM_DT,
            "TO_DT": params.TO_DT,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getOrganizations: (params, isLoadAjax) => {
        return {
            "IP_ORG_ID": params.IP_ORG_ID,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getDoctors: (params, isLoadAjax) => {
        return {
            "IP_RSRC_ID": params.IP_RSRC_ID,
            "IP_OLR_ID": params.IP_OLR_ID,
            "IP_SPECIALITY_ID": params.IP_SPECIALITY_ID,
            "IP_TYPE": params.IP_TYPE,
			"IP_LOC_ID":params.IP_LOC_ID,
			"IP_ORG_ID":params.IP_ORG_ID,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    },
    getSlotsForRsrc: (params, isLoadAjax) => {
        return {
            "RSRC_ID":params.RSRC_ID,
            "OLR_ID":params.OLR_ID,
            "FROM_DT":params.FROM_DT,
            "TO_DT":params.TO_DT,
            "IP_SESSION_ID":params.IP_SESSION_ID
        }
    },
    getLocation: (params, isLoadAjax) => {
        return {
            "IP_ORG_ID": params.IP_ORG_ID,
            "IP_LOC_ID": params.IP_LOC_ID,
            "IP_SESSION_ID": params.IP_SESSION_ID
        }
    }

}

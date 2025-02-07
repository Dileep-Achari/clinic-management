module.exports = {
    getPatientOtpLogin: (params, isLoadAjax) => {
        return {
            "MOBILE_NO": params.MOBILE_NO,
            "COUNTRY_CODE": params.COUNTRY_CODE,
            "IP_FLAG": "I",
            "TYPE": "L",
            "IP_ORG_KEY": params.IP_ORG_KEY,
            "IP_ORG_MIG_KEY": params.IP_ORG_MIG_KEY,
            "IP_SESSION_ID": params.IP_SESSION_ID,
            "IP_USER_ID": params.IP_USER_ID,
            "IP_GUID": params.IP_GUID,
            "IP_MINUTES": params.IP_MINUTES,
        }
    },
    verifyPatientOtpLogin: (params, isLoadAjax) => {
        return {
            "MOBILE_NO": params.MOBILE_NO,
            "COUNTRY_CODE": params.COUNTRY_CODE,
            "IP_FLAG": "V",
            "TYPE": "L",
            "PAT_OTP": params.PAT_OTP,
            "IP_ORG_KEY": params.IP_ORG_KEY,
            "IP_ORG_MIG_KEY": params.IP_ORG_MIG_KEY,
            "IP_SESSION_ID": params.IP_SESSION_ID,
            "IP_USER_ID": params.IP_USER_ID,
            "IP_GUID": params.IP_GUID,
            "IP_MINUTES": params.IP_MINUTES,
        }
    }


}

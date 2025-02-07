module.exports = {
    getAllSpecialities: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DEPARTMENT";
        return params;
    },
    getAllSpecialization: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "SPECIALIZATION";
        return params;
    },
    getAllDoctors: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DOCTORLIST";
        return params;  
    },
    getSpecilizationBySpeciality: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "SPECIALIZATION";
        return params;
    },
    getDoctorsBySplciality: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DOCTORLIST";
        return params;
    },
    getDoctorsBySplcialization: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DOCTORLIST";
        return params;
    },
    getDoctorById: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DOCTORLIST";
        return params;
    },
    getPatientByUniqueId: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PAT_UMR_NO";
        return params;
    },
    getPatientByMobile: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PATDETAILS";
        return params;
    },
    getSlots: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "APPOINTMENT";
        return params;
    },
    bookAppointment: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "BOOKING";
        return params;
    },
    getSlotInfo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "SLOTINFO";
        return params;
    },
    getSpecialityById: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DEPARTMENT";
        return params;
    },
    getSpecilizationById: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "SPECIALIZATION";
        params.IP_PARAM13 = "SP";
        return params;
    },
    getSpecialityBySpeclzId: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DEPARTMENT";
        params.IP_PARAM13 = "SP";
        return params;
    },
    getPatientByUniqueIdMobileNo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PATDETAILS";
        params.flag = "M";
        return params;
    },
    getDocDetByConsultNo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PATCONSULTANT";
        return params;
    },
    getDocDetByPatIpNo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PATCONSULTANT";
        return params;
    },
    getPatientByUniqueId: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "PAT_UMR_NO";
        return params;
    },
    getConsltDtlsByUniqueId: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "CONSULTATION_DTLS";
        return params;
    },
    getUmrDtlsFrmMobNo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "MBL_NO";
        return params;
    },
    getOpOrIpDtlsByUniqueIdMobileNo: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "UMR_MBL_NO";
        return params;
    },
}
module.exports = {
    getAllSpecialities: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DEPARTMENT";
        return params;
    },
    getDoctorsBySplciality: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "DOCTORLIST";
        return params;
    },
    getDocSchTimes:(params,isLoadAjax)=>{
        params.LOOKUP_NAME = "DOC_SCH_TIMES";
        return params;
    },
    getSlots: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "APPOINTMENT";
        return params;
    },
    bookAppointment: (params, isLoadAjax) => {
        params.LOOKUP_NAME = "BOOKING";
        return params;
    }
}
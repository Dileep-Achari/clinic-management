module.exports = {
    GetRsrcDetails: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        return params;
    },
    GetDocSlotDetails: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.Dt ? params.IP_APMNT_DT = params.Dt : '';
        params.Sta_ID ? params.IP_STATUS_ID = params.Sta_ID : null;
        params.A_Type ? params.IP_ACCESS_TYPE = params.A_Type : '';
        params.shftId ? params.IP_RSRC_SCH_TIME_ID = params.shftId : null;
        return params;
    },
    GetModules: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.MODULE_ID = params.MOD_ID
        }
        return params;
    },
    GetMappedDocs: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.IP_ROLE_ID = params.ROLE_ID
            params.IP_MODULE_ID = params.MOD_ID;
            params.IP_ORG_ID = params.ORG_ID;
            params.IP_LOC_ID = params.LOC_ID;
        }
        return params;
    },
    GetUsersByRoles: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.IP_ROLE_ID = params.ROLE_ID
            params.IP_ORG_ID = params.ORG_ID;
            params.IP_LOC_ID = params.LOC_ID;
        }
        return params;
    },
    Get_Role_Doc_Access: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.IP_ROLE_ID = params.ROLE_ID
            params.IP_MODULE_ID = params.MOD_ID;
            params.IP_LOC_ID = params.LOC_ID;
        }
        return params;
    },
    InsUpdMultiLocMap: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.IP_LOC_ID = params.LOC_ID
            params.IP_RSRC_ID = params.RSRC_ID;
            params.IP_REFRENCE_TYPE_ID = params.REF_TYP_ID;
        }
        return params;
    },
    DeleteRefRec: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.IP_TABLE_NAME = params.TAB_NAME
            params.IP_REFERENCE_ID = params.REF_ID;
            params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID;
            params.IP_SNO = params.SNO;
            params.IP_FLAG = params.FLAG;
        }
        return params;
    },
    GetPatSlotDetailsNew: (params, isLoadAjax) => {
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetPatDoc: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : "";
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.SLT_ID ? params.IP_SLOT_ID = params.SLT_ID : null;
        return params;
    },
    GetShiftsTime: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.FROM_DT ? params.IP_FROM_DT = params.FROM_DT : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetPatByOlr: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.FRM_DT ? params.IP_FROM_DT = params.FRM_DT : null;
        params.TO_DT ? params.IP_TO_DT = params.TO_DT : null;
        params.SHFT_ID ? params.IP_SHIFT_ID = params.SHFT_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    getAssistantDoctorMap: (params, isLoadAjax) => {
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.REF_TYP_ID_EQP ? params.IP_REFERENCE_TYPE_ID1 = params.REF_TYP_ID_EQP : null;
        return params;
    },
    // GetReasonForVisit: (params, isLoadAjax) => {
        // return {};
    // },
    DelAstMappedLocs: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.REFERENCE_TYPE_ID ? params.IP_REFERENCE_TYPE_ID = params.REFERENCE_TYPE_ID : null; // POST_API_PARAMS
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        return params;
    },
    InsUpdusers: (params, isLoadAjax) => {
        params.USER_ID ? params.IP_USER_ID = params.USER_ID : null;
        params.USER_CD ? params.IP_USER_CD = params.USER_CD : null;
        params.USER_NAME ? params.IP_USER_NAME = params.USER_NAME : null;
        params.PASSWORD ? params.IP_PASSWORD = params.PASSWORD : null;
        params.LOGINSTATUS ? params.IP_LOGINSTATUS = params.LOGINSTATUS : null;
        params.SYSTEMNAME ? params.IP_SYSTEMNAME = params.SYSTEMNAME : null;
        params.HINT_ANS ? params.IP_HINT_ANS = params.HINT_ANS : null;
        params.HINT2_ANS ? params.IP_HINT2_ANS = params.HINT2_ANS : null;
        params.HINT3_ANS ? params.IP_HINT3_ANS = params.HINT3_ANS : null;
        params.EMAIL ? params.IP_EMAIL = params.EMAIL : null;
        params.MOBILE_NO ? params.IP_MOBILE_NO = params.MOBILE_NO : null;
        params.TRANS_PWD ? params.IP_TRANSACTION_PASSWORD = params.TRANS_PWD : null;
        params.ROLE_ID ? params.IP_ROLE_ID = params.ROLE_ID : null;
        params.APPLY_PWD_RULE ? params.IP_APPLY_PWD_RULE = params.APPLY_PWD_RULE : null;
        params.REF_ID ? params.IP_REFERENCE_ID = params.REF_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.HINT_ID ? params.IP_HINT_ID = params.HINT_ID : null;
        params.HINT2_ID ? params.IP_HINT2_ID = params.HINT2_ID : null;
        params.HINT3_ID ? params.IP_HINT3_ID = params.HINT3_ID : null;
        return params;
    },
    getLoc_ByOrg: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        return params;
    },
    getAstMultiLoc: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    getOrgLocRsrcMap: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetDatesByOlr: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.F_DT ? params.IP_FROM_DT = params.F_DT : null;
        params.T_DT ? params.IP_TO_DT = params.T_DT : null;
        return params;
    },
    InsupVisitDetSet: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.ACT = "N";
            params.EDIT = "N";
            params.SAVES = "N";
            params.NUM_CLS = "Ribbon";
            params.WHILEEDIT = "Y";
            params.AFT_SAV = "Y";
        }
        return params;
    },
    InsNotifications: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.REC_STATUS = "A";
            params.IS_READ = "N";
            params.IS_HIDDEN = "N";
        }
        return params;
    },
    InsBilling: (params, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            params.BILL_TYPE_ID = 7;
        }
        return params;
    },
    GetSpecialInstruction: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.SPEC_ID ? params.IP_SPEC_ID = params.SPEC_ID : null;
        params.SPE_TYPE ? params.IP_SPE_TYPE = params.SPE_TYPE : null;
        params.DESC ? params.IP_DESCRIPTION = params.DESC : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        return params;
    },
    GetlocationsByDocId: (params, isLoadAjax) => {
        params.DocId ? params.IP_DOCTOR_ID = params.DocId : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    insertComplaintsMulti: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.SNO ? params.IP_SNO = params.SNO : null;
        params.COMP_ID ? params.IP_COMPLAINT_ID = params.COMP_ID : null;
        params.COMP_STA ? params.IP_COMPLAINT_STATUS = params.COMP_STA : null;
        params.REC_STA ? params.IP_RECORD_STATUS = params.REC_STA : null;
        params.COMP_TYP_ID ? params.IP_COMPLAINT_TYPE_ID = params.COMP_TYP_ID : null;
        params.DURA ? params.IP_DURATION = params.DURA : null;
        params.NOTS ? params.IP_NOTES = params.NOTS : null;
        params.PERID ? params.IP_PERIOD = params.PERID : null;
        params.PRVDR_ID ? params.IP_PROVIDER_CONTACT_ID = params.PRVDR_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.COMP_NAME ? params.IP_COMPLAINT_NAME = params.COMP_NAME : null;
        params.REF_ID ? params.IP_REFERENCE_ID = params.REF_ID : null;
        return params;
    },
    GetRsrcSchTimeValidatin: (params, isLoadAjax) => {
        params.FROM_DT ? params.IP_FROM_DT = params.FROM_DT : null;
        params.TO_DT ? params.IP_TO_DT = params.TO_DT : null;
        params.FROM_TIME ? params.IP_FROM_TIME = params.FROM_TIME : null;
        params.TO_TIME ? params.IP_TO_TIME = params.TO_TIME : null;
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.DAYS ? params.IP_SCH_DAYS = params.DAYS : null;
        return params;
    },
    // new Added
    GetVisitDet: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REFERENCE_TYPE_ID ? params.IP_REFERENCE_TYPE_ID = params.REFERENCE_TYPE_ID : null;
        params.PAT_TYPE ? params.IP_PAT_TYPE = params.PAT_TYPE : null;
        return params;
    },
    UpdActInact: (params, isLoadAjax) => {
        params.COL_NAME ? params.COLUMN_NAME = params.COL_NAME : null;
        params.COL_VALUE ? params.COLUMN_VALUE = params.COL_VALUE : null;
        params.REC_STATUS ? params.RECORD_STATUS = params.REC_STATUS : null;
        params.TAB_NAME ? params.TABLE_NAME = params.TAB_NAME : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetPatSlotDetails: (params, isLoadAjax) => {
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.PAT_ID ? params.IP_PATIENT_ID = params.PAT_ID : null;
        params.UHR_NO ? params.IP_UHR_NO = params.UHR_NO : null;
        params.UMR_NO ? params.IP_UMR_NO = params.UMR_NO : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        return params;
    },
    DelPaLoc: (params, isLoadAjax) => {
        params.REF_TYP_ID ? params.REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    getAddress: (params, isLoadAjax) => {
        params.REF_ID ? params.IP_REFERENCE_ID = params.REF_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        return params;
    },
    insVisitDetTmp: (params, isLoadAjax) => {
        params.IS_ACT ? params.IS_ACTIVE = params.IS_ACT : null;
        !params.SIGN_OFF ? params.SIGN_OFF = 0 : null;
        !params.FLAG ? params.FLAG = "P" : null;
        return params;
    },
    GetOrgDet: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        return params;
    },
    getAllDoctors: (params, isLoadAjax) => {
        params.City_Id ? params.IP_CITY_ID = params.City_Id : null;
        params.Doctor ? params.IP_DOCTOR_NAME = params.Doctor : null;
        params.Doctor_Id ? params.IP_DOCTOR_ID = params.Doctor_Id : null;
        params.Speciality_Ids ? params.IP_SPECILIZATION_ID = params.Speciality_Ids : null;
        params.Org_Ids ? params.IP_ORG_ID = params.Org_Ids : null;
        params.Loc_Id ? params.IP_LOC_ID = params.Loc_Id : null;
        params.PageNum ? params.IP_PAGENUM = params.PageNum : params.IP_PAGENUM = 0;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.Area_Id ? params.IP_AREA_ID = params.Area_Id : null;
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        return params;
    },
    GetVisitDetcal: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.APMNT_DT ? params.IP_APMNT_DT = params.APMNT_DT : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetDocType: (params, isLoadAjax) => {
        params.DOC_TYPE_ID ? params.IP_DOC_TYPE_ID = params.DOC_TYPE_ID : null;
        !params.RECORD_STATUS ? params.IP_RECORD_STATUS = "A" : null;
        return params;
    },
    getWkOrgSpclDoc: (params, isLoadAjax) => {
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.START_DT ? params.IP_START_DT = params.START_DT : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetTemplateShifts: (params, isLoadAjax) => {
        params.SCH_TEMP_ID ? params.IP_SCH_TEMP_ID = params.SCH_TEMP_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        return params;
    },
    GetShftDtls: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.TO_DT ? params.IP_TO_DT = params.TO_DT : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.FRM_DT ? params.IP_FROM_DT = params.FRM_DT : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetCancelReason: (params, isLoadAjax) => {
        params.RSN_TYPE_ID ? params.IP_REASON_TYPE_ID = params.RSN_TYPE_ID : null;
        return params;
    },
    GetPatApoinment: (params, isLoadAjax) => {
        params.PAT_ID ? params.IP_PAT_ID = params.PAT_ID : null;
        params.UHR_NO ? params.IP_UHR_NO = params.UHR_NO : null;
        params.UMR_NO ? params.IP_UMR_NO = params.UMR_NO : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.PAT_NAME ? params.IP_PATIENT_NAME = params.PAT_NAME : null;
        params.MOBILE_NO ? params.IP_MOBILE_NO = params.MOBILE_NO : null;
        return params;
    },
    GetEquipmentDet: (params, isLoadAjax) => {
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    InUpchangePsw: (params, isLoadAjax) => {
        params.OLD_PWD ? params.OLD_PASSWORD = params.OLD_PWD : null;
        params.NEW_PWD ? params.NEW_PASSWORD = params.NEW_PWD : null;
        return params;
    },
    getLanguage: (params, isLoadAjax) => {
        params.Lang_Id ? params.IP_LANGUAGE_ID = params.Lang_Id : null;
        return params;
    },
    getUNOType: (params, isLoadAjax) => {
        params.UNO_TYPE_ID ? params.IP_UNO_TYPE_ID = params.UNO_TYPE_ID : null;
        return params;
    },
    getAllSlots: (params, isLoadAjax) => {
        params.City_Ids ? params.IP_CITY_ID = params.City_Ids : null;
        params.Speciality_Id ? params.IP_SPECIALIZATION_ID = params.Speciality_Id : null;
        params.Start_Date ? params.IP_FROM_DT = params.Start_Date : null;
        params.End_Date ? params.IP_TO_DT = params.End_Date : null;
        params.Doctor_Id ? params.IP_DOCTOR_ID = params.Doctor_Id : null;
        params.Doctor ? params.IP_DOCTOR_NAME = params.Doctor : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.Loc_Ids ? params.IP_LOC_ID = params.Loc_Ids : null;
        params.PageNum ? params.IP_PAGENUM = params.PageNum : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.Value ? params.OP_COUNT = params.Value : null;
        params.Area_Ids ? params.IP_AREA_ID = params.Area_Ids : null;
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        return params;
    },
    GetOrgCityLoc: (params, isLoadAjax) => {
        params.City_Id ? params.IP_CITY_ID = params.City_Id : null;
        params.Doctor ? params.IP_DOCTOR_NAME = params.Doctor : null;
        params.Doctor_Id ? params.IP_DOCTOR_ID = params.Doctor_Id : null;
        params.Speciality_Id ? params.IP_SPECILIZATION_ID = params.Speciality_Id : null;
        params.Org_Id ? params.IP_ORG_ID = params.Org_Id : null;
        params.PageNum ? params.IP_PAGENUM = params.PageNum : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.Area_Ids ? params.IP_AREA_ID = params.Area_Ids : null;
        params.Start_Date ? params.IP_FROM_DT = params.Start_Date : null;
        params.End_Date ? params.IP_TO_DT = params.End_Date : null;
        params.Value ? params.OP_COUNT = params.Value : null;
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        return params;
    },
    getAdvrtseImg: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.SPEC_ID ? params.IP_SPEC_ID = params.SPEC_ID : null;
        params.SUB_SPEC_ID ? params.IP_SUB_SPEC_ID = params.SUB_SPEC_ID : null;
        params.IMG_POS ? params.IP_IMG_POSITION = params.IMG_POS : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        return params;
    },
    getOrgSpec: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        return params;
    },
    GetSrvDet: (params, isLoadAjax) => {
        params.SRV_ID ? params.IP_SERVICE_ID = params.SRV_ID : null;
        return params;
    },
    GetRecomendations: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetAllergies: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : params.IP_COUNT = 0;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    getAllergy: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : params.IP_COUNT = 0;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        return params;
    },
    GetCmpnyPlcies: (params, isLoadAjax) => {
        params.GROUP_ID ? params.IP_PARAMETER_GROUP_ID = params.GROUP_ID : null;
        return params;
    },
    InsupParmtrValue: (params, isLoadAjax) => {
        params.PARMTR_CD ? params.IP_PARAMETER_CD = params.PARMTR_CD : null;
        params.PARMTR_VAL ? params.IP_PARAMETER_VALUE = params.PARMTR_VAL : null;
        params.PARMTR_DIS_VAL ? params.IP_PARAMETER_DISPLAY_VALUE = params.PARMTR_DIS_VAL : null;
        params.PARMTR_LEV ? params.IP_PARAMETER_LEVEL = params.PARMTR_LEV : null;
        params.FACTY_ID ? params.IP_FACILITY_ID = params.FACTY_ID : null;
        return params;
    },
    InsUpdRsrcLang: (params, isLoadAjax) => {
        params.LANGUAGE_ID ? params.IP_LANGUAGE_ID = params.LANGUAGE_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        return params;
    },
    InsDocHolyday: (params, isLoadAjax) => {
        params.REC_STA ? params.RECORD_STATUS = params.REC_STA : null;
        return params;
    },
    getComplaints: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : params.IP_COUNT = 0;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.FROM ? params.IP_FROM = params.FROM : null;
        return params;
    },
    getAllergy: (params, isLoadAjax) => {
        params.MRN_NO ? params.IP_MRN_NO = params.MRN_NO : null;
        params.VIST_DT ? params.IP_VISIT_DT = params.VIST_DT : null;
        params.REC_TYP_ID ? params.IP_RECORD_TYPE_ID = params.REC_TYP_ID : null;
        params.SLOT_ID ? params.IP_SLOT_ID = params.SLOT_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : params.IP_COUNT = 0;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.FROM ? params.IP_FROM = params.FROM : null;
        return params;
    },
    GetUserdtls: (params, isLoadAjax) => {
        params.USER_ID ? params.IP_USER_ID = params.USER_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        return params;
    },
    getGridViewDetails: (params, isLoadAjax) => {
        params.lkUpName ? params.LOOKUP_NAME = params.lkUpName : null;
        params.lkUpQry ? params.LOOKUP_QRY = params.lkUpQry : null;
        return params;
    },
    getFormUserUpdatedDetails: (params, isLoadAjax) => {
        params.FORM_TYPE_CD ? params.FORM_CD = params.FORM_TYPE_CD : null;
        params.SUB_TYPE ? params.ACTION_TYPE = params.SUB_TYPE : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    insUpdVccsToken: (params, isLoadAjax) => {
        params.RECORD_STATUS ? params.RECORD_STATUS = params.RECORD_STATUS : "A";
        params.sessionId ? params.VC_SESSION_ID = params.sessionId : null;
        params.projectId ? params.VC_PROJECT_ID = params.projectId : null;
        params.size ? params.VC_SIZE = params.size : null;
        params.duration ? params.VC_DURATION = params.duration : null;
        params.outputMode ? params.VC_OUTPUT_MODE = params.outputMode : null;
        params.hasAudio ? params.VC_HASAUDIO = params.hasAudio : null;
        params.hasVideo ? params.VC_HASVIDEO = params.hasVideo : null;
        params.id ? params.TRAN_ID = params.id : null;
        params.status ? params.VC_STATUS = params.status : null;
        params.name ? params.VC_NAME = params.name : null;
        params.reason ? params.REASON = params.reason : null;
        params.certificate ? params.VC_CERTIFICATE = params.certificate : null;
        params.sha256sum ? params.VC_SHA256SUM = params.sha256sum : null;
        params.password ? params.VC_PASSWORD = params.password : null;
        params.width ? params.VC_WIDTH = params.width : null;
        params.height ? params.VC_HEIGHT = params.height : null;
        params.resolution ? params.VC_RESOLUTION = params.resolution : null;
        params.partnerId ? params.PATNER_ID = params.partnerId : null;
        params.event ? params.EVENT_ID = params.event : null;
        params.createdAt ? params.CREATED_AT = params.createdAt : null;
        params.updatedAt ? params.UPDATED_AT = params.updatedAt : null;
        return params;
    },
    /**************************************************** Auto Complete **************************************************/
    getComponentAuto: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoMedications: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoInvest: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PERFIEX_TEXT = params.PRF_TXT : null;
        params.RSRC_ID ? params.IP_RSRC_ID = params.RSRC_ID : null;
        params.MAP_FLAG ? params.IP_MAP_FLAG = params.MAP_FLAG : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetDocSrchByNmSpcl: (params, isLoadAjax) => {
        params.ColName ? params.IP_COLUMN_NAME = params.ColName : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.FLAG ? params.IP_FLAG = params.FLAG : null;
        params.PrefText ? params.IP_PREFIX_TEXT = params.PrefText : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetOrg: (params, isLoadAjax) => {
        params.pf ? params.IP_PREFIEX_TEXT = params.pf : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetOrgAsistant: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.PRF_TXT ? params.IP_PREFIX_TEXT = params.PRF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    uprGetSlotStatus: (params, isLoadAjax) => {
        params.SLOTS_ID ? params.IP_PREFIX = params.SLOTS_ID : null;
        params.MIG_ID ? params.IP_ENTITYTYPE_ID = params.MIG_ID : null;
        params.UMR_NO ? params.UMR_NO = params.UMR_NO : null;
        params.FLAG ? params.IP_ORG_ID = params.FLAG : null;
        return params;
    },

    GetUsrRefName: (params, isLoadAjax) => {
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.REF_TYP_ID : null;
        params.PF_TXT ? params.IP_PRIFEX_TEXT = params.PF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetUsersAuto: (params, isLoadAjax) => {
        params.Flag ? params.IP_FLAG = params.Flag : null;
        params.PrefText ? params.IP_USER_NAME = params.PrefText : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetPatAuto: (params, isLoadAjax) => {
        params.COL_NAME ? params.IP_COLUMN_NAME = params.COL_NAME : null;
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    getDesignationList: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAllServcs: (params, isLoadAjax) => {
        params.SRV_ID ? params.IP_SERVICE_ID = params.SRV_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.PF_TXT ? params.IP_PREFIEX_TEXT = params.PF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetSearchSrv: (params, isLoadAjax) => {
        params.PREFIX ? params.IP_PREFIX = params.PREFIX : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetHealthServices: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetMediSpanDrug: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoAllergies: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.MAP_FLAG ? params.IP_MAP_FLAG = params.MAP_FLAG : null;
        params.COUNT ? params.IP_COUNT = params.COUNT : (params.IP_COUNT = 25);
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoCond: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.MAP_FLAG ? params.IP_MAP_FLAG = params.MAP_FLAG : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetComplaintsAuto: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIEX_TEXT = params.PRF_TXT : null;
        params.MAP_FLAG ? params.IP_MAP_FLAG = params.MAP_FLAG : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        params.COMP_TYPE_ID ? params.IP_COMP_TYPE_ID = params.COMP_TYPE_ID : (params.IP_COMP_TYPE_ID = 1);
        params.COUNT ? params.IP_COUNT = params.COUNT : (params.IP_COUNT = 25);
        return params;
    },
    GetAreaAuto: (params, isLoadAjax) => {
        params.PRF_TXT ? params.PREFIEX_TEXT = params.PRF_TXT : null;
        params.ZIPCODE ? params.PINCODE = params.ZIPCODE : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetOlrPat: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.COL_NAME ? params.IP_COLUMN_NAME = params.COL_NAME : null;
        params.PREFIXTEXT ? params.IP_PREFIXTEXT = params.PREFIXTEXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetOlrPatSrch: (params, isLoadAjax) => {
        params.OLR_ID ? params.IP_OLR_ID = params.OLR_ID : null;
        params.COL_NAME ? params.IP_COLUMN_NAME = params.COL_NAME : null;
        params.PREFIXTEXT ? params.IP_PREFIXTEXT = params.PREFIXTEXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    getOrgLocUsers: (params, isLoadAjax) => {
        params.PRF_TXT ? params.PREFIEX_TEXT = params.PRF_TXT : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoEntities: (params, isLoadAjax) => {
        params.PRF_TXT ? params.IP_PREFIX = params.PRF_TXT : null;
        params.ENTITY_TYP_ID ? params.IP_ENTITYTYPE_ID = params.ENTITY_TYP_ID : null;
        params.ORG_ID ? params.IP_ORG_ID = params.ORG_ID : null;
        params.LOC_ID ? params.IP_LOC_ID = params.LOC_ID : null;
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    uprUpdIntgSlotHold: (params, isLoadAjax) => {
        params.SLOTS_ID ? params.IP_PREFIX = params.SLOTS_ID : null;
        params.MIG_ID ? params.IP_ENTITYTYPE_ID = params.MIG_ID : null;
        params.FLAG ? params.IP_ORG_ID = params.FLAG : null;
        return params;
    },
    uprInsIntgFutSlotMan: (params, isLoadAjax) => {
        params.SLOT_ID ? params.SLOT_ID = params.SLOT_ID : null;
        params.NEW_SLOT_ID ? params.NEW_SLOT_ID = params.NEW_SLOT_ID : null;
        params.SLOT_CHANGE_REASON ? params.SLOT_CHANGE_REASON = params.SLOT_CHANGE_REASON : null;
        params.STATUS_REASON_ID ? params.STATUS_REASON_ID = params.STATUS_REASON_ID : null;
        params.FLAG ? params.FLAG = params.FLAG : null;
        params.MIG_ID ? params.MIG_ID = params.MIG_ID : null;
        params.DOCTOR_ID ? params.DOCTOR_ID = params.DOCTOR_ID : null;
        params.DOCTOR_UNIT_ID ? params.DOCTOR_UNIT_ID = params.DOCTOR_UNIT_ID : null;
        params.DT ? params.DT = params.DT : null;
        params.UMR_NO ? params.UMR_NO = params.UMR_NO : null;
        params.APMNT_TYPE_ID ? params.APMNT_TYPE_ID = params.APMNT_TYPE_ID : null;
        params.USER_NAME ? params.USER_NAME = params.USER_NAME : null;
        params.IP_SESSION_ID ? params.IP_SESSION_ID = params.IP_SESSION_ID : null;
        params.TITILE_CD ? params.TITILE_CD = params.TITILE_CD : null;
        params.FIRST_NAME ? params.FIRST_NAME = params.FIRST_NAME : null;
        params.LAST_NAME ? params.LAST_NAME = params.LAST_NAME : null;
        params.DISPLAY_NAME ? params.DISPLAY_NAME = params.DISPLAY_NAME : null;
        params.GENDER_CD ? params.GENDER_CD = params.GENDER_CD : null;
        params.DOB ? params.DOB = params.DOB : null;
        params.MOBILE_NO ? params.MOBILE_NO = params.MOBILE_NO : null;
        return params;
    },
    GetPatIndentAutoCmplt: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    GetAutoComplete: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : null;
        return params;
    },
    getVideoConsultationSlot: (params, isLoadAjax) => {
        params.IP_SESSION_ID ? params.ip_session_id = params.IP_SESSION_ID : null;
        return params;
    },
    getVideoConsultSlotPay: (params, isLoadAjax) => {
        params.IP_SESSION_ID ? params.ip_session_id = params.IP_SESSION_ID : null;
        return params;
    },
    InsUpdInvsOrder: (params, isLoadAjax) => {
        params.IP_MRN_NO ? params.IP_MRN_NO = params.IP_MRN_NO : "";
        return params;
    },
    postApiData: (params, isLoadAjax) => {
        params.lkupName ? params.LOOKUP_NAME = params.lkupName : "";
        return params;
    },
    UpdSlot: (params, isLoadAjax) => {
        params.SID ? params.IP_SLOTS_ID = params.SID : "";
        params.REF_ID ? params.IP_REFERENCE_ID = params.REF_ID : "";
        params.PAT_REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID = params.PAT_REF_TYP_ID : "";
        params.STATUS_ID ? params.IP_STATUS_ID = params.STATUS_ID : "";
        params.STATUS_REASON_ID ? params.IP_STATUS_REASON_ID = params.STATUS_REASON_ID : "";
        params.REMARKS ? params.IP_REMARKS = params.REMARKS : "";
        params.BILL_ID ? params.IP_BILL_ID = params.BILL_ID : "";
        params.DISPLAY_NAME ? params.IP_DISPLAY_NAME = params.DISPLAY_NAME : "";
        params.REASON_FOR_VISIT ? params.IP_REASON_FOR_VISIT = params.REASON_FOR_VISIT : "";
        params.EMAIL_ID ? params.IP_EMAIL_ID = params.EMAIL_ID : "";
        params.MOBILE ? params.IP_MOBILE = params.MOBILE : "";
        params.REQ_TYPE_ID ? params.IP_REQ_TYPE_ID = params.REQ_TYPE_ID : "";
        params.NOTES ? params.IP_NOTES = params.NOTES : "";
        params.ACCESS_TYPE ? params.IP_ACCESS_TYPE = params.ACCESS_TYPE : "";
        params.CON_TYP_ID ? params.IP_CONSULTATION_TYPE_ID = params.CON_TYP_ID : "";
        params.APMNT_TYPE_ID ? params.IP_APMNT_TYPE_ID = params.APMNT_TYPE_ID : "";
        params.REF_TYP_ID ? params.IP_REFERENCE_TYPE_ID1 = params.REF_TYP_ID : "";
        params.SERV_ID ? params.IP_SERVICE_ID = params.SERV_ID : "";
        params.IS_VIP ? params.IP_IS_VIP = params.IS_VIP : "";
        params.FROM_AREA ? params.IP_FROM_AREA = params.FROM_AREA : "";
        params.REFEREL_ID ? params.IP_REFEREL_ID = params.REFEREL_ID : 0;
        params.REFEREL_NAME ? params.IP_REFEREL_NAME = params.REFEREL_NAME : "";
        params.VISIT_TYPE ? params.IP_VISIT_TYPE = params.VISIT_TYPE : "";
        params.PATIENT_TYPE_CD ? params.IP_PATIENT_TYPE_CD = params.PATIENT_TYPE_CD : "";
        params.TITLE_CD ? params.IP_TITLE_CD = params.TITLE_CD : "";
        params.FIRST_NAME ? params.IP_FIRST_NAME = params.FIRST_NAME : "";
        params.MIDDLE_NAME ? params.IP_MIDDLE_NAME = params.MIDDLE_NAME : "";
        params.LAST_NAME ? params.IP_LAST_NAME = params.LAST_NAME : "";
        params.GENDER_CD ? params.IP_GENDER_CD = params.GENDER_CD : "";
        params.DOB ? params.IP_DOB = params.DOB : "";
        params.MOTHER_MAIDEN_NAME ? params.IP_MOTHER_MAIDEN_NAME = params.MOTHER_MAIDEN_NAME : "";
        params.ADDRESS ? params.IP_ADDRESS = params.ADDRESS : "";
        params.COUNTRY_ID ? params.IP_COUNTRY_ID = params.COUNTRY_ID : 0;
        params.STATE_ID ? params.IP_STATE_ID = params.STATE_ID : 0;
        params.CITY_ID ? params.IP_CITY_ID = params.CITY_ID : 0;
        params.AREA_ID ? params.IP_AREA_ID = params.AREA_ID : "";
        params.ZIPCODE ? params.IP_ZIPCODE = params.ZIPCODE : "";
        params.PRE_REGISTER ? params.IP_PRE_REGISTER = params.PRE_REGISTER : "";
        params.SOURCE ? params.IP_SOURCE = params.SOURCE : "";
        return params;
    },
    Cancel_Slot: (params, isLoadAjax) => {
        params.SESSION_ID ? params.IP_SESSION_ID = params.SESSION_ID : "";
        return params;
    },
    getManualSyncData: (params, isLoadAjax) => {
        for (let key in params) {
            if (params[key] && (typeof params[key] === 'string') && params[key].indexOf('Date(') > -1) {
                const dt = new Date(parseInt(params[key].substring(6, params[key].length - 2)));
                params[key] = `${dt.getFullYear()}-${dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}-${dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()} 00:00`
            }
        }
        return params;
    }
}
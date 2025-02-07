module.exports = {
    GetDocSlotDetails: (data) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.OLR_ID = obj.OLR_ID;
            obj.SID = obj.SLOTS_ID;
            obj.S_ID = obj.STATUS_ID;
            obj.STIME = obj.DISPLAY_TIME;
            obj.UHR = obj.UHR_NO;
            obj.S_R_ID = obj.STATUS_REASON_ID;
            obj.MNO = obj.MOBILE_NO1;
            obj.QNO = obj.Q_NO;
            obj.PHOTO = obj.PATIENT_URL;
            obj.RF_VST = obj.REASON_FOR_VISIT;
            obj.SEX = obj.GENDER_CD;
            obj.DOB = obj.DOB;
            obj.STYPE = obj.SLOT_TYPE_NAME;
            obj.STYPID = obj.SLOT_TYPE;
            obj.APT_DT = obj.APMNT_DT;
            obj.PID = obj.PATIENT_ID;
            obj.PNAME = obj.DISPLAY_NAME;
            obj.PRIORITY = obj.PRIORITY;
        });
        return data;
    },
    GetModules: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "MOD_ID": obj.MODULE_ID || null,
                    "MOD_NAME": obj.MODULE_NAME || null,
                    "MOD_DESC": obj.MODULE_DESC || null,
                    "MOD_NTS": obj.MODULE_NOTES || null,
                    "PAR_MOD_ID": obj.PARENT_MODULE_ID || null,
                    "MOD_PRTY": obj.MODULE_PRIORITY || null,
                    "DISP_ORDR": obj.DISPLAY_ORDER || null,
                    "IMG_URL": obj.IMAGE_URL || null,
                    "PAGE_URL": obj.PAGE_URL || null,
                    "INT_EXPND": obj.INTIAL_EXPAND || null
                });
            });
            data = null;
            return tempArr;
        }
        return data;
    },
    GetMappedDocs: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "ROLE_ID": obj.ROLE_ID || null,
                    "MOD_ID": obj.MODULE_ID || null,
                    "DOC_ID": obj.DOC_ID || null,
                    "DOC_NAME": obj.DOC_NAME || null,
                    "ADD": obj.ACCESS_ADD || null,
                    "MOD": obj.ACCESS_MOD || null,
                    "DEL": obj.ACCESS_DEL || null,
                    "QRY": obj.ACCESS_QRY || null,
                    "APP": obj.ACCESS_APP || null,
                    "EXE": obj.ACCESS_EXE || null,
                    "BAR_COD": obj.BARCODE || null,
                    "PRN_TYP": obj.PRINTTYPE || null,
                    "APP_LEV": obj.APPROVEDLEVEL || null,
                    "PRN_FRMT": obj.PRINTFORMAT || null,
                    "EXP": obj.ACCESS_EXP || null,
                    "PRN": obj.ACCESS_PRN || null,
                    "PRN_PRV": obj.PRN_PREVIEW || null,
                    "PRN_HDR": obj.PRN_HEADER || null,
                    "DMS_UPD": obj.DMS_UPLOAD || null,
                    "DMS_VW": obj.DMS_VIEW || null,
                    "IS_VIP": obj.IS_VIP || null,
                    "CRTL_VAL": obj.CRITICAL_VALUE || null,
                    "LOC_ID": obj.LOC_ID || null
                });
            });
            data = null;
            return tempArr;
        }
        return data;
    },
    GetUsersByRoles: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "USER_ID": obj.USER_ID || null,
                    "USER_NAME": obj.USER_NAME || null,
                    "IMAGE_URL": obj.IMAGE_URL || null
                });
            });
            data = null;
            return tempArr;
        }
        return data;
    },
    Get_Role_Doc_Access: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "DOC_ID": obj.DOC_ID || null,
                    "DOC_NAME": obj.DOC_NAME || null,
                    "MOD_ID": obj.MODULE_ID || null,
                    "MOD_NAME": obj.MODULE_DESC || null,
                    "ADD": obj.ACCESS_ADD || null,
                    "MOD": obj.ACCESS_MOD || null,
                    "DEL": obj.ACCESS_DEL || null,
                    "QRY": obj.ACCESS_QRY || null,
                    "APP": obj.ACCESS_APP || null,
                    "EXE": obj.ACCESS_EXE || null,
                    "PRN_HDR": obj.PRN_HEADER || null,
                    "DMS_UPD": obj.DMS_UPLOAD || null,
                    "DMS_VW": obj.DMS_VIEW || null,
                    "BAR_COD": obj.BARCODE || null,
                    "CRTL_VAL": obj.CRITICAL_VALUE || null
                });
            });
            data = null;
            return tempArr;
        }
        return data;
    },
    GetPatAuto: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "UHR": obj.UHR_NO || null,
                    "DIS_NAME": obj.DISPLAY_NAME || null,
                    "MOB_NO": obj.MOBILE || null,
                    "EMAIL": obj.EMAIL_ID || null,
                    "PAT_ID": obj.PATIENT_ID || null,
                    "UMR": obj.UMR_NO || null,
                    "AGE": obj.AGE || null,
                    "DOB": obj.DOB || null,
                    "GENDER_CD": obj.GENDER_CD || null,
                    "TITLE": obj.TITLE || null,
                    "DESCRIPTION": obj.DESCRIPTION || null,
                    "IS_VIP": obj.IS_VIP || null,
                    "ADMN_STATUS": obj.ADMN_STATUS || null,
                    "PAT_NAME": obj.PAT_NAME || null,
                    "ADMN_NO": obj.ADMN_NO || null,
					 "IS_EXPIRED": obj.IS_EXPIRED || null
                });
            });
            data = null;
            return tempArr;
        }
        return data;
    },
    InsUpdMultiLocMap: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            return true;
        }
        if (!data) return [];
        else return data;
    },
    getLookUpDetails: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            if (!data) return "[]";
            if (data && data.length > 0) return JSON.stringify(data);
            else return "[]";
        }
        if (!data) return [];
        else return data;
    },
    GetRsrcDetails: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SPEC_NAME = obj.SPECILIZATION;
            obj.RESCHEDULE = obj.IS_RESCHEDULE;
        });
        return data;
    },
    GetPatSlotDetailsNew: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SID = obj.SLOTS_ID;
            obj.APT_DT = obj.APMNT_DT;
            obj.S_ID = obj.STATUS_ID;
            obj.STIME = obj.DISPLAY_TIME;
            obj.UHR = obj.UHR_NO;
            obj.UMR = obj.UMR_NO;
            obj.S_R_ID = obj.STATUS_REASON_ID;
            obj.PNAME = obj.PATIENT_NAME;
            obj.MNO = obj.MOBILE_NO;
            obj.QNO = obj.Q_NO;
            obj.PHOTO = obj.PATIENT_URL;
            obj.RF_VST = obj.REASON_FOR_VISIT;
            obj.GENDER_CD = obj.GENDER_CD;
            obj.STYPE = obj.SLOT_TYPE_NAME;
            obj.STYPID = obj.SLOT_TYPE;
            obj.CONSUL_TYP_FMT = obj.CONSULTATION_TYPE_FMT;
            obj.CONSUL_TYP_ID = obj.CONSULTATION_TYPE_ID;
            obj.MRTL_STS_NAME = obj.MARITAL_STATUS_NAME;
            obj.BLD_GRP_NAME = obj.BLOOD_GROUP_NAME;
            obj.DOC_NAME = obj.DOCTOR_NAME;
            obj.DOC_SPE = obj.SPECILIZATION;
            obj.REF_TYPE_ID = obj.REFERENCE_TYPE_ID;
            obj.BOOKED_BY = obj.CREATE_BY;
            obj.BOOKED_DT = obj.CREATE_DT;
            obj.PAT_HISTORY = obj.PAT_HISTORY;
        });

        if (isLoadAjax === 'Y') {
            return data[0]
        }
        return data;
    },
    GetPatDoc: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "RSRC_ID": obj.RSRC_ID,
                    "DIS_NAME": obj.DISPLAY_NAME,
                    "REF_TYP_ID": obj.REFERENCE_TYPE_ID,
                    "SPE_NAME": obj.SPECIALIZATION_NAME,
                    "APMNT_DT": obj.APMNT_DT,
                    "SLOT_ID": obj.SLOTS_ID,
                    "CONSUL_NO": obj.CONSULTATION_NO
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    GetShiftsTime: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SHFT_TIME = obj.SHIFT_TIME;
            obj.FRM_DT = obj.SLOT_DATE;
        });
        return data;
    },
    GetPatByOlr: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.PAT_NAM = obj.PATIENT_NAME;
            obj.DIS_TIM = obj.DISPLAY_TIME;
            obj.MOB_NO = obj.MOBILE_NO;
        });
        return data;
    },
    getAssistantDoctorMap: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.DOC_ID = obj.DOCTOR_ID;
            obj.EMP_NAME = obj.EMPLOYEE_NAME;
            obj.EMP_ID = obj.EMPLOYEE_ID;
            obj.DOC_NAME = obj.DOCTOR_NAME;
            obj.LOC_NAME = obj.LOCATION_NAME;
            obj.LOC_ID = obj.LOCATION_ID;
        });
        return data;
    },
    GetReasonForVisit: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.Id = obj.REASON_FOR_VISIT_ID;
            obj.Pref = obj.IS_PREFFERED;
            obj.Res = obj.REASON_NAME;
        });
        return data;
    },
    getLoc_ByOrg: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "LOC_ID": obj.LOCATION_ID,
                    "LOC_CD": obj.LOCATION_CD,
                    "LOC_NAME": obj.LOCATION_NAME,
                    "LOC_DESC": obj.LOCATION_DESC,
                    "I_URL": obj.IMAGE_URL,
                    "LCK_STA": obj.LOCK_STATUS,
                    "CNTCT_PRSN": obj.CONTACT_PERSON,
                    "ADDR1": obj.ADDRESS1,
                    "E_ID": obj.EMAIL_ID,
                    "MOB": obj.MOBILE_PHONE,
                    "CNTRY_NAME": obj.COUNTRY_NAME,
                    "STATE_NAME": obj.STATE_NAME,
                    "CITY_NAME": obj.CITY_NAME,
                    "AREA_NAME": obj.AREA_NAME,
                    "ORG_NAME": obj.ORG_NAME,
                    "ORG_ID": obj.ORG_ID,
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    getAstMultiLoc: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "ORG_ID": obj.ORG_ID,
                    "LOC_ID": obj.LOC_ID,
                    "RSRC_ID": obj.RSRC_ID,
                    "ORG_NAME": obj.ORG_NAME,
                    "LOC_NAME": obj.LOC_NAME,
                    "DIS_NAME": obj.RSRC_NAME,
                    "ORG_IMAGE": obj.ORG_IMAGE,
                    "LOC_IMAGE": obj.LOC_IMAGE,
                    "RSRC_IMAGE": obj.RSRC_IMAGE
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    getOrgLocRsrcMap: (data, isLoadAjax) => {
        if (!data) return [];
        let tempArr = [];
        if (isLoadAjax === 'Y') {
            data.forEach(obj => {
                tempArr.push({
                    "LOC_NAME": obj.LOCATION_NAME,
                    "RSRC_ID": obj.RSRC_ID,
                    "RSRC_NAME": obj.DISPLAY_NAME,
                    "ORG_NAME": obj.ORG_NAME,
                    "ORG_ID": obj.ORG_ID,
                    "LOC_ID": obj.LOCATION_ID
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    GetSpecialInstruction: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === "Y") {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "SPE_INS_ID": obj.SPE_INSTRUCTION_ID || null,
                    "INS_CD": obj.INSRUCTION_CD || null,
                    "DESC": obj.DESCRIPTION || null
                });
            });
            data = null;
            return tempArr;
        }
        else {
            data.forEach(obj => {
                obj.SPE_INS_ID = obj.SPE_INSTRUCTION_ID;
                obj.INS_CD = obj.INSRUCTION_CD;
                obj.DESC = obj.DESCRIPTION;
            });
            return data;
        }
    },
    GetlocationsByDocId: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            for (var obj in data) {
                tempArr.push({
                    "LOC_ID": data[obj]["LOCATION_ID"] || null,
                    "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                    "OLR_ID": data[obj]["OLR_ID"] || null,
                    "RSRC_ID": data[obj]["RSRC_ID"] || null,
                    "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                    "DOC_NAME": data[obj]["RSRC_NAME"] || null,
                    "ONLINE_CNT": data[obj]["ONLINE_CNT"] || null,
                    "INTERNAL_CNT": data[obj]["INTERNAL_CNT"] || null,
                    "IS_SLOT_RATIO_REQ": data[obj]["IS_SLOT_RATIO_REQ"] || null,
                    "SCH_LIMIT": data[obj]["SCH_LIMIT"] || null
                });
            }
            data = null;
            return tempArr;
        }
        else {
            data.forEach(obj => {
                obj.LOC_ID = obj.LOCATION_ID;
                obj.LOC_NAME = obj.LOCATION_NAME;
                obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
                obj.DOC_NAME = obj.RSRC_NAME;
                obj.DOCTOR_NAME = obj.RSRC_NAME;
            });
        }
        return data;
    },
    InsUpdProfileSetup: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            if (data && data.length > 0) {
                return data && data[0] && data[0].ID ? parseInt(data[0].ID): null;
            }
            else return null;
        }
        else {
            if (!data) return [];
            else return data;
        }
    },
    UprInsUpdIPVisit: (data, isLoadAjax) => {
        if (!data) return [];
        if (data && data.OP_CNT) {
            return [{ "VISIT_ID": parseInt(data.OP_CNT) }];
        }
        else return [];
    },
    InsQgeneration: (data, isLoadAjax) => {
        if (data && data.OP_COUNT) {
            try {
                let count;
                count = parseInt(data.OP_COUNT);
                if (count) data.OP_COUNT = count;
                count = null;
            }
            catch (ex) {

            }
            return data.OP_COUNT;
        }
        else return null;
    },
    getGridViewDetails: (data, isLoadAjax) => {
        if (data && data.length > 0) return JSON.stringify(data);
        else return '[]';
    },
    InUpchangePsw: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            return (data && data[0] && (Object.keys(data[0]).indexOf("OP_COUNT") > -1)) ? data[0].OP_COUNT : 0;
        }
        else {
            return data;
        }
    },
    GetVisitDet: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
            obj.REC_STA = obj.RECORD_STATUS;
            obj.IDX = obj.DISP_ORDER;
            obj.SAVE = obj.SAVES;
            obj.title = obj.TITLE;
            obj.whileEdit = obj.WHILEEDIT;
            obj.AfterSave = obj.AFTERSAVE;
            obj.DIS_NAME = obj.DISPLAY_NAME;
            obj.DIS_STA = obj.DISPLAY_STATUS;
            obj.CALL_FN = obj.CALL_FUNCTION;
            obj.PRNT_ORD = obj.PRINT_ORDER;
        });
        return data;
    },
    UpdActInact: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') return data[0] || {};
        else return data || [];
    },
    InsUpdScheduleTemplate: (data, isLoadAjax) => {
        if (!data) return -1;
        if (data && (data.OP_COUNT || (data.OP_COUNT == 0))) {
            return data.OP_COUNT;
        }
        else return -1;
    },
    getDesignation: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.DSG_CD = obj.DESIGNATION_CD || null;
            obj.DSG_DSC = obj.DESIGNATION_DESC || null;
            obj.DSG_ID = obj.DESIGNATION_ID || null;
            obj.DSG_NAME = obj.DESIGNATION_NAME || null;
        });
        return data;
    },
    GetRefType: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "REF_TYP_ID": obj.REFERENCE_TYPE_ID || null,
                    "REF_TYP_NAME": obj.REFERENCE_TYPE_NAME || null
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    GetPatSlotDetails: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SID = obj.SLOTS_ID;
            obj.APT_DT = obj.APMNT_DT;
            obj.S_ID = obj.STATUS_ID;
            obj.STIME = obj.DISPLAY_TIME;
            obj.UHR = obj.UHR_NO;
            obj.UMR = obj.UMR_NO;
            obj.S_R_ID = obj.STATUS_REASON_ID;
            obj.PNAME = obj.PATIENT_NAME;
            obj.MNO = obj.MOBILE_NO;
            obj.QNO = obj.Q_NO;
            obj.PHOTO = obj.PATIENT_URL;
            obj.RF_VST = obj.REASON_FOR_VISIT;
            obj.SEX = obj.GENDER_CD;
            obj.STYPE = obj.SLOT_TYPE_NAME;
            obj.STYPID = obj.SLOT_TYPE;
            obj.DIA_SITTING = obj.DIASTOLIC_SITTING;
            obj.HEART_RAT = obj.HEART_RATE;
            obj.CONSUL_TYP_FMT = obj.CONSULTATION_TYPE_FMT;
            obj.MRTL_STS_NAME = obj.MARITAL_STATUS_NAME;
            obj.BLD_GRP_NAME = obj.BLOOD_GROUP_NAME;
            obj.DOC_NAME = obj.DOCTOR_NAME;
            obj.DOC_SPE = obj.SPECILIZATION;
            obj.DOC_SPEC_ID = obj.SPECIALITY_ID;
            obj.REF_TYPE_ID = obj.REFERENCE_TYPE_ID;
            obj.BOOKED_BY = obj.CREATE_BY;
            obj.BOOKED_DT = obj.CREATE_DT;
        });
        if (isLoadAjax === 'Y') return data[0];
        return data;
    },
    getAddress: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "ADDRESS1": obj.IP_ADDRESS1 || null,
                    "ADDRESS2": obj.IP_ADDRESS2 || null,
                    "COUNTRY_ID": obj.IP_COUNTRY_ID || null,
                    "COUNTRY_NAME": obj.COUNTRY_NAME || null,
                    "STATE_ID": obj.IP_STATE_ID || null,
                    "STATE_NAME": obj.STATE_NAME || null,
                    "CITY_ID": obj.IP_CITY_ID || null,
                    "CITY_NAME": obj.CITY_NAME || null,
                    "AREA_ID": obj.IP_AREA_ID || null,
                    "AREA_NAME": obj.IP_AREA_NAME || null,
                    "OFFICE_PHONE": obj.IP_OFFICE_PHONE || null,
                    "HOME_PHONE": obj.IP_HOME_PHONE || null,
                    "MOBILE_PHONE": obj.IP_MOBILE_PHONE || null,
                    "FAX_NUMBER": obj.IP_FAX_NUMBER || null,
                    "EMAIL_ID": obj.IP_EMAIL_ID || null,
                    "WEBSITE_URL": obj.IP_WEBSITE_URL || null,
                    "ZIPCODE": obj.IP_ZIPCODE || null,
                    "ADDR_TYPE_ID": obj.IP_ADDR_TYPE_ID || null,
                    "ADDR_TYPE_NAME": obj.ADDR_TYPE_NAME || null,
                    "ADDR_GRP_ID": obj.IP_ADDR_GRP_ID || null,
                    "ADDR_GRP_NAME": obj.ADDR_GRP_NAME || null,
                    "REF_ID": obj.IP_REFERENCE_ID || null,
                    "REF_TYP_ID": obj.IP_REFERENCE_TYPE_ID || null,
                    "REF_TYP_NAME": obj.REFERENCE_TYPE_NAME || null,
                    "SNO": obj.IP_SNO || null,
                    "IS_PRIMARY": obj.IP_IS_PRIMARY || null
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    GetOrgDet: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "ORG_ID": obj.ORG_ID || null,
                    "LOC_ID": obj.LOC_ID || null,
                    "ORG_DESC": obj.ORG_DESC || null,
                    "ORG_NAME": obj.ORG_NAME || null,
                    "LOC_NAME": obj.LOCATION_NAME || null,
                    "ADDRESS1": obj.ADDRESS1 || null,
                    "ADDRESS2": obj.ADDRESS2 || null,
                    "OFC_PHONE": obj.OFFICE_PHONE || null,
                    "FAX_NUM": obj.FAX_NUMBER || null,
                    "IMG_PATH": obj.IMAGE_PATH || null,
                    "TIME_DATE": obj.TIMEDATE || null,
                    "WEB_URL": obj.WEBSITE_URL || null,
                    "EMAIL_ID": obj.EMAIL_ID || null,
                    "OFC_NUM": obj.OFFICE_NUMBER || null,
                    "OFC_NUMBER": obj.OFC_NUM || null,
                    "IMG_URL": obj.IMG_URL || null,
                    "WEB_SITE": obj.WEB_SITE || null,
                    "FRM_EMAIL": obj.FROM_EMAIL || null,
                    "FRM_EMAIL_DSPLY": obj.FROM_EMAIL_DISPLAY || null,
                    "INFO_EMAIL": obj.INFO_EMAIL || null
                });
            });
            data = null;
            return tempArr;
        }
        else return data;
    },
    getAllDoctors: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "OLR_ID": obj.OLR_ID || null,
                    "RSRC_ID": obj.RSRC_ID || null,
                    "ORG_ID": obj.ORG_ID || null,
                    "LOC_ID": obj.LOC_ID || null,
                    "DNM": obj.DOCTOR_NAME || null,
                    "DFT": obj.DEGREES_FMT || null,
                    "SPC": obj.SPECILIZATION || null,
                    "EXP": obj.EXPERIENCE || null,
                    "PNM": obj.PRACTICE_NAME || null,
                    "LAD": obj.LOCATION_ADDR || null,
                    "LOC_NAME": obj.LOCATION_NAME || null,
                    "LOC_IMG": obj.LOCATION_IMAGE || null,
                    "RF": obj.REG_FEE || null,
                    "CF": obj.CONS_FEE || null,
                    "SD1": obj.SCH_DAY1 || null,
                    "SD2": obj.SCH_DAY2 || null,
                    "ST1": obj.SCH_TIME1 || null,
                    "ST2": obj.SCH_TIME2 || null,
                    "DIMG": obj.DOCTOR_IMAGE_URL || null,
                    "MBK": obj.MOST_BOOKED || null,
                    "PHO": obj.DOCTOR_PHOTO || null,
                    "CNT": obj.CNT || null,
                    "LOC_OFC_NO": obj.LOC_OFFICE_NO || null,
                    "IS_PYMNT_REQ": obj.IS_PAYMENT_REQUIRED || null,
                    "CURRENCY_ID": obj.CURRENCY_ID || null,
                    "CURRENCY_NAME": obj.CURRENCY_NAME || null,
                    "CURRENCY_SYMBOL": obj.CURRENCY_SYMBOL || null,
                    "CONS_PAY": obj.CONS_PAY || null,
                    "REG_PAY": obj.REG_PAY || null,
                    "IS_REGI": obj.IS_REGI || null,
                    "REVISIT_FEE": obj.REVISIT_FEE || null,
                    "ONLINE_FEE": obj.ONLINE_FEE || null,
                    "EMERGENCY_FEE": obj.EMERGENCY_FEE || null,
                    "EVENING_CLINIC_FEE": obj.EVENING_CLINIC_FEE || null,
                    "CONSULT_MOBILE": obj.CONSULT_MOBILE || null,
					"DM_CD":obj.DM_CD||null,
					"SPECIALITY_NAME":obj.SPECIALITY_NAME||null
                });
            });
            data = null;
            return tempArr;
        }
        else {
            data.forEach(obj => {
                obj.OLR_ID = obj.OLR_ID;
                obj.RSRC_ID = obj.RSRC_ID;
                obj.ORG_ID = obj.ORG_ID;
                obj.LOC_ID = obj.LOC_ID;
                obj.DNM = obj.DOCTOR_NAME;
                obj.DFT = obj.DEGREES_FMT;
                obj.SPC = obj.SPECILIZATION;
                obj.EXP = obj.EXPERIENCE;
                obj.PNM = obj.PRACTICE_NAME;
                obj.LAD = obj.LOCATION_ADDR;
                obj.LOC_NAME = obj.LOCATION_NAME;
                obj.LOC_IMG = obj.LOCATION_IMAGE;
                obj.RF = obj.REG_FEE;
                obj.CF = obj.CONS_FEE;
                obj.SD1 = obj.SCH_DAY1;
                obj.SD2 = obj.SCH_DAY2;
                obj.ST1 = obj.SCH_TIME1;
                obj.ST2 = obj.SCH_TIME2;
                obj.DIMG = obj.DOCTOR_IMAGE_URL;
                obj.MBK = obj.MOST_BOOKED;
                obj.PHO = obj.DOCTOR_PHOTO;
                obj.CNT = obj.CNT;
                obj.LOC_OFC_NO = obj.LOC_OFFICE_NO;
                obj.IS_PYMNT_REQ = obj.IS_PAYMENT_REQUIRED;
                obj.REVISIT_FEE = obj.REVISIT_FEE;
                obj.ONLINE_FEE = obj.ONLINE_FEE;
                obj.EMERGENCY_FEE = obj.EMERGENCY_FEE;
                obj.EVENING_CLINIC_FEE = obj.EVENING_CLINIC_FEE;
            });
            return data;
        }
    },
    GetVisitDetcal: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.COUNT = obj.BOOKED;
        });
        return data;
    },
    GetDocType: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.DOC_TYPE_NAME = obj.DOCUMENT_TYPE_NAME;
            obj.REC_STS = obj.RECORD_STATUS;
        });
        return data;
    },
    getWkOrgSpclDoc: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.DOCNAME = obj.DOCTOR_NAME;
            obj.LOC_ID = obj.LOCATION_ID;
            obj.LOC_NAME = obj.LOCATION_NAME;
            obj.IMTYPE = obj.IMAGE_URL;
            obj.SPIMG = obj.SPEC_IMAGE;
        });
        return data;
    },
    GetTemplateShifts: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SLOT_TYPE = obj.SLOT_TYPE_NAME;
        });
        return data;
    },
    GetShftDtls: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SLT_DT = obj.SLOT_DATE;
            obj.DURATION = obj.SLOT_DURATION;
            obj.LOC_NAME = obj.LOCATION_NAME;
            obj.WAITING = obj.WL;
        });
        return data;
    },
    GetDurations: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.PERID_ID = obj.PERIOD_ID;
            obj.PERID_NAME = obj.PERIOD_NAME;
        });
        return data;
    },
    GetCancelReason: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.CNCL_RSN_ID = obj.CANCEL_REASON_ID;
            obj.CNCL_RSN = obj.CANCEL_REASON;
            obj.RSN_TYPE_ID = obj.REASON_TYPE_ID;
            obj.RSN_TYPE_NAME = obj.REASON_TYPE_NAME;
        });
        return data;
    },
    GetPatApoinment: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.APMT_DT = obj.APMNT_DT;
            obj.DIS_TIM = obj.DISPLAY_TIME;
            obj.WEK = obj.WK;
            obj.DOC_NAM = obj.DOCTOR_NAME;
            obj.DEG = obj.DEGREES_FMT;
            obj.LOC_NAME = obj.LOCATION_NAME;
            obj.LOC_ADD = obj.LOCATION_ADDR;
            obj.SLOT_STA_NAME = obj.SLOT_STATUS_NAME;
            obj.RSN_FOR_VST = obj.REASON_FOR_VISIT;
            obj.DOC_IMG_URL = obj.DOCTOR_IMAGE_URL;
            obj.MDY_BY = obj.MODIFY_BY;
            obj.SID = obj.STATUS_ID;
            obj.SPEC_ID = obj.SPECIALITY_ID;
            obj.DIS_NAME = obj.DISPLAY_NAME;
        });
        return data;
    },
    getLanguage: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.id = obj.LANGUAGE_ID;
            obj.Cd = obj.LANGUAGE_CD;
            obj.name = obj.LANGUAGE_NAME;
            obj.Desc = obj.LANGUAGE_DESC;
            obj.maker = "";
            obj.icon = "";
            obj.ticked = "";
        });
        return data;
    },
    getAllSlots: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.OLR_ID = obj.OLR_ID;
            obj.ID = obj.SLOTS_ID;
            obj.DT = obj.APMNT_DT;
            obj.ST = obj.DISPLAY_TIME;
            obj.SD = obj.DISPLAY_DAY;
            obj.SLTY = obj.SLOT_TYPE;
            obj.ACCTYPE = obj.ACCESS_TYPE;
        });
        return data;
    },
    getOrgSpec: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SPEC_ID = obj.SPECIALITY_ID;
            obj.SPEC_NAME = obj.SPECIALITY_NAME;
            obj.IMG_URL = obj.IMAGE_URL;
            obj.SM_IMG_URL = obj.SM_IMAGE_URL;
            obj.LG_IMG_URL = obj.LG_IMAGE_URL;
        });
        return data;
    },
    GetSrvDet: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SRV_DET_ID = obj.SERVICE_DET_ID;
            obj.GEN_SRV_ID = obj.GENERAL_SERVICE_ID;
            obj.SRV_ID = obj.SERVICE_ID;
            obj.SRV_GRP_ID = obj.SERVICE_GROUP_ID;
            obj.SER_NAME = obj.SERVICE_NAME;
            obj.SRV_GRP_NAME = obj.SERVICE_GROUP_NAME;
            obj.GEN_SRV_NAME = obj.GENERAL_SERVICE_NAME;
            obj.SRV_TYP_ID = obj.SERVICE_TYPE_ID;
            obj.SRV_TYP_NAME = obj.SERVICE_TYPE_NAME;
        });
        return data;
    },
    GetRecomendations: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.MRN_NO = obj.MRN_NO;
            obj.VIST_DT = obj.VISIT_DT;
            obj.SNO = obj.SNO;
            obj.REF_ID = obj.REFERENCE_ID;
            obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
            obj.REC_TYP_ID = obj.RECORD_TYPE_ID;
            obj.P_MNGMT_PLAN = obj.MANAGEMENT_PLAN;
            obj.MNGMT_PLAN = obj.MANAGEMENT_PLAN;
            obj.P_PHY_ACT = obj.PHYSICAL_ACTIVITY;
            obj.PHY_ACT = obj.PHYSICAL_ACTIVITY;
            obj.P_DIET = obj.DIET;
            obj.P_PREVCARE = obj.PREVENTIVE_CARE;
            obj.PREVCARE = obj.PREVENTIVE_CARE;
            obj.P_ADVICE = obj.ADVICE;
            obj.PRVDR_ID = obj.PROVIDER_CONTACT_ID;
            obj.PRVDR_NAME = obj.PROVIDER_CONTACT_NAME;
            obj.RVW_DT = obj.REVIEW_DT;
            obj.RVW_SLT = obj.REVIEW_SLOT;
            obj.RVW_NOTS = obj.REVIEW_NOTES;
            obj.P_RVW_NOTS = obj.REVIEW_NOTES;
            obj.MDY_BY = obj.MODIFY_BY;
            obj.MDY_DT = obj.MODIFY_DT;
            obj.CRT_BY = obj.CREATE_BY;
            obj.CRT_DT = obj.CREATE_DT;
            obj.ADMN_DT = obj.ADMN_SUGG_DT;
            obj.P_ADMN_REMARKS = obj.ADMN_REMARKS;
        });
        return data;
    },
    GetCmpnyPlcies: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            data.forEach(obj => {
                tempArr.push({
                    "PARMTR_ID": obj.PARAMETER_ID || null,
                    "PARMTR_CD": obj.PARAMETER_CD || null,
                    "PARMTR_NAME": obj.PARAMETER_NAME || null,
                    "PARMTR_VAL": obj.PARAMETER_VALUE || null,
                    "PARMTR_DIS_VAL": obj.PARAMETER_DISPLAY_VALUE || null,
                    "PARMTR_GRP_ID": obj.PARAMETER_GROUP_ID || null,
                    "PARMTR_LEV": obj.PARAMETER_LEVEL || null,
                    "FACTY_ID": obj.FACILITY_ID || null
                });
            });
            data = null;
            return tempArr;
        }
        else {
            return data;
        }

    },
    getAllergy: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.VIST_DT = obj.VISIT_DT;
            obj.REC_TYP_ID = obj.RECORD_TYPE_ID;
            obj.ALRG_ID = obj.ALLERGY_ID;
            obj.ALRG_NAM = obj.ALLERGY_NAME;
            obj.ALRG_CD = obj.ALLERGEN_CD;
            obj.ALRG_GRUP_ID = obj.ALLERGY_GROUP_ID;
            obj.ALRG_STA_CD = obj.ALLERGY_STATUS;
            obj.STRT_DT = obj.START_DT;
            obj.REF_ID = obj.REFERENCE_ID;
            obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
            obj.ALRG_RECT_ID = obj.ALLERGY_REACTION_ID;
            obj.ALRG_TYP_ID = obj.ALLERGY_TYPE_ID;
            obj.FIR_OBS = obj.FIRST_OBSERVED;
            obj.PRVDR_ID = obj.PROVIDER_CONTACT_ID;
            obj.TRTM_STP_RECT_ID = obj.TREATMENT_STOP_REACTION_ID;
            obj.NOTS = obj.NOTES;
            obj.TRTM_STP_RECT_NAM = obj.TREATMENT_STOP_REACTION_NAME;
            obj.ALRG_TYP_NAM = obj.ALLERGY_TYPE_NAME;
            obj.ALRG_RECT_NAM = obj.ALLERGY_REACTION_NAME;
            obj.REC_STA = obj.RECORD_STATUS;
            obj.DURA = (obj.DURATION == "0" ? "" : obj.DURATION);
            obj.PERID_NAME = obj.PERIOD_NAME;
            obj.PERID = obj.PERIOD;
            obj.MDY_BY = obj.MODIFY_BY;
            obj.MDY_DT = obj.MODIFY_DT;
            obj.CRT_BY = obj.CREATE_BY;
            obj.CRT_DT = obj.CREATE_DT;
            obj.PRVDR_NAME = obj.PROVIDER_CONTACT_NAME;
        });
        return data;
    },
    getLocByOrg: (data, isLoadAjax) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.FAX_NUM = obj.FAX_NUMBER;
            obj.FRM_EMAIL = obj.FROM_EMAIL;
            obj.FRM_EMAIL_DSPLY = obj.FROM_EMAIL_DISPLAY;
            obj.IMG_PATH = obj.IMAGE_PATH;
            obj.LOC_NAME = obj.LOCATION_NAME;
            obj.OFC_NUM = obj.OFFICE_NUMBER;
            obj.OFC_NUMBER = obj.OFC_NUM;
            obj.OFC_PHONE = obj.OFFICE_PHONE;
            obj.TIME_DATE = obj.TIMEDATE;
            obj.WEB_URL = obj.WEBSITE_URL;
            obj.IMG_URL = obj.IMAGE_PATH;
            obj.IMAGE_URL = obj.IMAGE_PATH;
        });
        return data;
    },
    GetAllergies: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            for (var obj in data) {
                tempArr.push({
                    "MRN_NO": data[obj]["MRN_NO"] || null,
                    "VIST_DT": data[obj]["VISIT_DT"] || null,
                    "SNO": data[obj]["SNO"] || null,
                    "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                    "ALRG_ID": data[obj]["ALLERGY_ID"] || null,
                    "ALRG_NAM": data[obj]["ALLERGY_NAME"] || null,
                    "ALRG_CD": data[obj]["ALLERGEN_CD"] || null,
                    "ALRG_GRUP_ID": data[obj]["ALLERGY_GROUP_ID"] || null,
                    "ALRG_STA_CD": data[obj]["ALLERGY_STATUS"] || null,
                    "STRT_DT": data[obj]["START_DT"] || null,
                    "END_DT": data[obj]["END_DT"] || null,
                    "REF_ID": data[obj]["REFERENCE_ID"] || null,
                    "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                    "ALRG_RECT_ID": data[obj]["ALLERGY_REACTION_ID"] || null,
                    "ALRG_TYP_ID": data[obj]["ALLERGY_TYPE_ID"] || null,
                    "FIR_OBS": data[obj]["FIRST_OBSERVED"] || null,
                    "PRVDR_ID": data[obj]["PROVIDER_CONTACT_ID"] || null,
                    "TRTM_STP_RECT_ID": data[obj]["TREATMENT_STOP_REACTION_ID"] || null,
                    "NOTS": data[obj]["NOTES"] || null,
                    "TRTM_STP_RECT_NAM": data[obj]["TREATMENT_STOP_REACTION_NAME"] || null,
                    "ALRG_TYP_NAM": data[obj]["ALLERGY_TYPE_NAME"] || null,
                    "ALRG_RECT_NAM": data[obj]["ALLERGY_REACTION_NAME"] || null,
                    "REC_STA": data[obj]["RECORD_STATUS"] || null,
                    "DURA": data[obj]["DURATION"] == 0 ? "" : data[obj]["DURATION"],
                    "PERID_NAME": data[obj]["PERIOD_NAME"] || null,
                    "PERID": data[obj]["PERIOD"] || null,
                    "MDY_BY": data[obj]["MODIFY_BY"] || null,
                    "MDY_DT": data[obj]["MODIFY_DT"] || null,
                    "CRT_BY": data[obj]["CREATE_BY"] || null,
                    "CRT_DT": data[obj]["CREATE_DT"] || null,
                    "PRVDR_NAME": data[obj]["PROVIDER_CONTACT_NAME"] || null
                });
            }
            data = null;
            return tempArr;
        }
        else return data;
    },
    GetHeltConditin: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "VIST_DT": data[obj]["VISIT_DT"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "MC_ID": data[obj]["MC_ID"] || null,
                "ICD_CD": data[obj]["ICD_CODE"] || null,
                "COND_NAM": data[obj]["CONDITION_NAME"] || null,
                "COND_STA_CD": data[obj]["CONDITION_STATUS_ID"] || null,
                "STRT_DT": data[obj]["START_DT"] || null,
                "END_DT": data[obj]["END_DT"] || null,
                "REF_ID": data[obj]["REFERENCE_ID"] || null,
                "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                "PRVDR_ID": data[obj]["PROVIDER_CONTACT_ID"] || null,
                "IT_END": data[obj]["HOW_IT_ENDED"] || null,
                "NOTS": data[obj]["NOTES"] || null,
                "DURA": data[obj]["DURATION"] || null,
                "PERID_NAME": data[obj]["PERIOD_NAME"] || null,
                "PERID": data[obj]["PERIOD"] || null,
                "MDY_BY": data[obj]["MODIFY_BY"] || null,
                "MDY_DT": data[obj]["MODIFY_DT"] || null,
                "CRT_BY": data[obj]["CREATE_BY"] || null,
                "CRT_DT": data[obj]["CREATE_DT"] || null,
                "PRVDR_NAME": data[obj]["PROVIDER_CONTACT_NAME"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetCities: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "C_CD": data[obj]["CITY_CD"] || null,
                "C_DESC": data[obj]["CITY_DESC"] || null,
                "C_ID": data[obj]["CITY_ID"] || null,
                "C_NAME": data[obj]["CITY_NAME"] || null,
            });
        }
        data = null;
        return tempArr;
    },
    getPatTestmnls: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "UHR_NO": data[obj]["UHR_NO"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "SG_DESC": data[obj]["SG_DESC"] || null,
                "LG_DESC": data[obj]["LG_DESC"] || null,
                "IMG_URL": data[obj]["IMAGE_URL"] || null,
                "DSPLY_NAME": data[obj]["DISPLAY_NAME"] || null,
                "REF_ID": data[obj]["REFERENCE_ID"] || null,
                "REF_TYPE_ID": data[obj]["REFERENCE_TYPE_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAreaAuto: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "AREA_NAME": data[obj]["AREA_NAME"] || null,
                "AREA_ID": data[obj]["AREA_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetLoc_By_RSRC: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_ID": data[obj]["LOCATION_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "IMAGE_URL": data[obj]["IMAGE_URL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getOrgCity: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CITY_ID": data[obj]["CITY_ID"] || null,
                "CITY_NAME": data[obj]["CITY_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetlocByPA: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_ID": data[obj]["LOCATION_ID"] || null,
                "LOC_CD": data[obj]["LOCATION_CD"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "LOC_DESC": data[obj]["LOCATION_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDoctorsByLoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DID": data[obj]["DOCTOR_ID"] || null,
                "DNM": data[obj]["DOCTOR_NAME"] || null,
                "DCD": data[obj]["DOCTOR_CD"] || null,
                "FNAME": data[obj]["FIRST_NAME"] || null,
                "MNAME": data[obj]["MIDDLE_NAME"] || null,
                "LNAME": data[obj]["LAST_NAME"] || null,
                "DNAME": data[obj]["DISPLAY_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDoctorDtls: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "DNM": data[obj]["DOCTOR_NAME"] || null,
                "DFT": data[obj]["DEGREES_FMT"] || null,
                "SPC": data[obj]["SPECILIZATION"] || null,
                "EXP": data[obj]["EXPERIENCE"] || null,
                "PNM": data[obj]["PRACTICE_NAME"] || null,
                "LAD": data[obj]["LOCATION_ADDR"] || null,
                "RF": data[obj]["REG_FEE"] || null,
                "CF": data[obj]["CONS_FEE"] || null,
                "SD1": data[obj]["SCH_DAY1"] || null,
                "SD2": data[obj]["SCH_DAY2"] || null,
                "ST1": data[obj]["SCH_TIME1"] || null,
                "ST2": data[obj]["SCH_TIME2"] || null,
                "DIMG": data[obj]["DOCTOR_IMAGE_URL"] || null,
                "MBK": data[obj]["MOST_BOOKED"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSlotsByDoctor_Id: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["ORG_LOC_RSRC_XREF_ID"] || null,
                "SID": data[obj]["SLOTS_ID"] || null,
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "ST": data[obj]["DISPLAY_TIME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSpecialIntrest: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "DSC": data[obj]["INTEREST_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    InsUpdInvestInstruct: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "DSC": data[obj]["INTEREST_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDocFavMedic: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MEDIC_ID": data[obj]["MEDICATION_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "MEDIC_NAME": data[obj]["MEDICATION_NAME"] || null,
                "IS_FAV": data[obj]["IS_FAVOURITES"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDosages: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DOS_ID": data[obj]["DOSAGE_ID"] || null,
                "DOS_DESC": data[obj]["DOSAGE_DESC"] || null,
                "FORM_TYPE": data[obj]["FORM_TYPE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDocFavAllergy: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ALLERGY_ID": data[obj]["ALLERGY_ID"] || null,
                "ALLERGY_NAME": data[obj]["ALLERGY_NAME"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "IS_FAVOURITES": data[obj]["IS_FAVOURITES"] || null,
                "ITEM_FROM": data[obj]["ITEM_FROM"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDocFavComplaints: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "COMP_ID": data[obj]["COMPLAINT_ID"] || null,
                "COMP_NAME": data[obj]["COMPLAINT_NAME"] || null,
                "IS_FAV": data[obj]["IS_FAVOURITES"] || null,
                "COMP_TYP_ID": data[obj]["COMPLAINT_TYPE_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetInvsProfilDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "INVS_PROF_ID": data[obj]["INVS_PROFILE_ID"] || null,
                "INVS_PROF_NAME": data[obj]["INVS_PROFILE_NAME"] || null,
                "SNO": data[obj]["SNO"] || null,
                "SERVICE_ID": data[obj]["SERVICE_ID"] || null,
                "INSRUCTION": data[obj]["INSRUCTION"] || null,
                "SER_NAME": data[obj]["SERVICE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPhrMediProfileDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MEDI_PROF_ID": data[obj]["MEDI_PROFILE_ID"] || null,
                "MEDI_PROF_CD": data[obj]["MEDI_PROFILE_CD"] || null,
                "DEPT_ID": data[obj]["DEPARTMENT_ID"] || null,
                "MEDI_PROF_NAME": data[obj]["MEDI_PROFILE_NAME"] || null,
                "SNO": data[obj]["SNO"] || null,
                "MEDI_ID": data[obj]["MEDICATION_ID"] || null,
                "FRE_ID": data[obj]["FREQUENCY_ID"] || null,
                "FRE_DESC": data[obj]["FREQUENCY_DESC"] || null,
                "DAYS": data[obj]["DAYS"] || null,
                "INSTRUCTION": data[obj]["INSTRUCTION"] || null,
                "QTY": data[obj]["QTY"] || null,
                "ITEM_NAME": data[obj]["ITEM_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDiagnonsTemplate: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DIAG_TEMP_ID": data[obj]["DIAG_TEMP_ID"] || null,
                "TITLE": data[obj]["TITLE"] || null,
                "DIAG_TEMP_NAME": data[obj]["DIAG_TEMP_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    ApptCntByVisitType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "APMNT_TYPE_ID": data[obj]["APMNT_TYPE_ID"] || null,
                "APMNT_TYPE_NAME": data[obj]["APMNT_TYPE_NAME"] || null,
                "CNT": data[obj]["CNT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPrevReport: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLT_ID": data[obj]["SLOT_ID"] || null,
                "CHI_SLT_ID": data[obj]["CHILD_SLOT_ID"] || null,
                "MAIN_VIST_DT": data[obj]["MAIN_VISIT_DT"] || null,
                "CHI_VIST_DT": data[obj]["CHILD_VISIT_DT"] || null,
                "REPT_DATA": data[obj]["REPORT_DATA"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetTariffByOrg: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "TID": data[obj]["TARIFF_ID"] || null,
                "TNM": data[obj]["TARIFF_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDoctorFee: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DOC_ID": data[obj]["DOCTOR_ID"] || null,
                "SRV_ID": data[obj]["SERVICE_ID"] || null,
                "PRICE": data[obj]["PRICE"] || null,
                "COST": data[obj]["COST"] || null,
                "ORG_PRICE": data[obj]["ORG_PRICE"] || null,
                "DOC_PRICE": data[obj]["DOCTOR_PRICE"] || null,
                "NO_OF_DAYS": data[obj]["NO_OF_DAYS"] || null,
                "NO_OF_VISITS": data[obj]["NO_OF_VISITS"] || null,
                "CONS_TYPE_ID": data[obj]["CONSULTATION_TYPE_ID"] || null,
                "CONS_TYPE_NAME": data[obj]["CONSULTATION_TYPE_NAME"] || null,
                "CONS_REG_FEE": data[obj]["CONS_REG_FEE"] || null,
                "EME_PRICE": data[obj]["EMERGNCY_PRICE"] || null,
                "SPE_ID": data[obj]["SPECIALIZATION_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "START_DT": data[obj]["START_DT"] || null,
                "END_DT": data[obj]["END_DT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSrvInstruct: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "GEN_SRV_ID": data[obj]["GENERAL_SERVICE_ID"] || null,
                "GEN_SRV_NAME": data[obj]["GENERAL_SERVICE_NAME"] || null,
                "SRV_ID": data[obj]["SERVICE_ID"] || null,
                "SRV_NAME": data[obj]["SERVICE_NAME"] || null,
                "INSTRUCTIN": data[obj]["INSTRUCTIONS"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetMediSpanDrug: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MEDICINE_ID": data[obj]["MEDICINE_ID"] || null,
                "MEDICINE_NAME": data[obj]["MEDICINE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetHealthServices: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOCATION_NAME": data[obj]["LOCATION_NAME"] || null,
                "PRICE": data[obj]["PRICE"] || null,
                "SERVICE_DISPNAME": data[obj]["LOCATION_NAME"] || null,
                "SERVICE_NAME": data[obj]["SERVICE_NAME"] || null,
                "SERVICE_ID": data[obj]["SERVICE_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSrvLookUp: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SERVICE_ID": data[obj]["SERVICE_ID"] || null,
                "SERVICE_NAME": data[obj]["SERVICE_NAME"] || null,
                "PRICE": data[obj]["PRICE"] || null,
                "SERVICE_CD": data[obj]["SERVICE_CD"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAutoEntities: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ENTITY_MAS_ID": data[obj]["ENTITYMASTERID"] || null,
                "ENTITY_NAME": data[obj]["ENTITYNAME"] || null,
                "EMAIL": data[obj]["EMAIL"] || null,
                "PHONE1": data[obj]["PHONE1"] || null,
                "PHONE2": data[obj]["PHONE2"] || null,
                "MOBILE": data[obj]["MOBILE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSchTemplateByRsrc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SCH_TEMP_ID": data[obj]["SCH_TEMP_ID"] || null,
                "TEMPLATE_NAME": data[obj]["TEMPLATE_NAME"] || null,
                "SCHEDULE_IN_DAYS": data[obj]["SCHEDULE_IN_DAYS"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "ONLINE_CNT": data[obj]["ONLINE_CNT"] || null,
                "INTERNAL_CNT": data[obj]["INTERNAL_CNT"] || null,
                "IS_SLOT_RATIO_REQ": data[obj]["IS_SLOT_RATIO_REQ"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSchTemplateShifts: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SCH_TEMP_ID": data[obj]["SCH_TEMP_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "FROM_TIME": data[obj]["FROM_TIME"] || null,
                "TO_TIME": data[obj]["TO_TIME"] || null,
                "DURATION": data[obj]["DURATION"] || null,
                "WAITING": data[obj]["WAITING"] || null,
                "SLOT_TYPE": data[obj]["SLOT_TYPE_NAME"] || null,
                "SLOT_TYPE_ID": data[obj]["SLOT_TYPE_ID"] || null,
                "TEMPLATE_NAME": data[obj]["TEMPLATE_NAME"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "SCHEDULE_IN_DAYS": data[obj]["SCHEDULE_IN_DAYS"] || null,
                "ONLINE_CNT": data[obj]["ONLINE_CNT"] || null,
                "INTERNAL_CNT": data[obj]["INTERNAL_CNT"] || null,
                "IS_SLOT_RATIO_REQ": data[obj]["IS_SLOT_RATIO_REQ"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSlotType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOT_TYPE_ID": data[obj]["SLOT_TYPE_ID"] || null,
                "SLOT_TYPE_CD": data[obj]["SLOT_TYPE_CD"] || null,
                "SLOT_TYPE_NAME": data[obj]["SLOT_TYPE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetShiftsTime: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_SCH_TIME_ID": data[obj]["RSRC_SCH_TIME_ID"] || null,
                "SHFT_TIME": data[obj]["SHIFT_TIME"] || null,
                "FRM_DT": data[obj]["SLOT_DATE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRsrcSch: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RSRC_SCH_TIME_ID": data[obj]["RSRC_SCH_TIME_ID"] || null,
                "SLT_DT": data[obj]["SLOT_DATE"] || null,
                "SLT_FRM_TIME": data[obj]["SLOT_FROM_TIME"] || null,
                "SLT_TO_TIME": data[obj]["SLOT_TO_TIME"] || null,
                "SLT_DURTN": data[obj]["SLOT_DURATION"] || null,
                "SLT_TYP_NAME": data[obj]["SLOT_TYPE_NAME"] || null,
                "WL": data[obj]["WL"] || null,
                "PAT_COUNT": data[obj]["PAT_COUNT"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "DATE_WK": data[obj]["DATE_WK"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRsrcSchTimeValidatin: (data, isLoadAjax) => {
        if (!data) return [];
        if (isLoadAjax === 'Y') {
            let tempArr = [];
            for (var obj in data) {
                tempArr.push({
                    "NAME": data[obj]["NAME"] || null,
                    "DESCRIPTIONS": data[obj]["DESCRIPTIONS"] || null
                });
            }
            data = null;
            return tempArr[0];
        }
        else {
            return data;
        }
    },
    GetAsistantsByOrgLoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "EID": data[obj]["EMPLOYEE_ID"] || null,
                "ACD": data[obj]["ASSISTANT_CD"] || null,
                "TCD": data[obj]["TITLE_CD"] || null,
                "FNM": data[obj]["FIRST_NAME"] || null,
                "MNM": data[obj]["MIDDLE_NAME"] || null,
                "LNM": data[obj]["LAST_NAME"] || null,
                "DNM": data[obj]["DISPLAY_NAME"] || null,
                "SCD": data[obj]["GENDER_CD"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MSCD": data[obj]["MARITAL_STATUS_CD"] || null,
                "PAN": data[obj]["PAN"] || null,
                "NTS": data[obj]["NOTES"] || null,
                "APHTOPTH": data[obj]["ASSISTANT_PHOTOPATH"] || null,
                "ASGN": data[obj]["ASSISTANT_SIGNATURE"] || null,
                "RCD": data[obj]["RELIGION_CD"] || null,
                "NCD": data[obj]["NATIONALITY_CD"] || null,
                "BGCD": data[obj]["BLOOD_GROUP_CD"] || null,
                "UMR": data[obj]["UMR_NO"] || null,
                "NOC": data[obj]["NO_OF_CHILDREN"] || null,
                "UNO": data[obj]["UNO"] || null,
                "UTID": data[obj]["UNO_TYPE_ID"] || null,
                "DESIG_ID": data[obj]["DESIGNATION_ID"] || null,
                "DSG_NAME": data[obj]["DESIGNATION_NAME"] || null,
                "JOIN_DT": data[obj]["JOINING_DT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAsistantsByLoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "AID": data[obj]["ASSISTANT_ID"] || null,
                "ACD": data[obj]["ASSISTANT_CD"] || null,
                "TCD": data[obj]["TITLE_CD"] || null,
                "FNM": data[obj]["FIRST_NAME"] || null,
                "MNM": data[obj]["MIDDLE_NAME"] || null,
                "LNM": data[obj]["LAST_NAME"] || null,
                "DNM": data[obj]["DISPLAY_NAME"] || null,
                "SCD": data[obj]["SEX_CD"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MSCD": data[obj]["MARITAL_STATUS_CD"] || null,
                "PAN": data[obj]["PAN"] || null,
                "NTS": data[obj]["NOTES"] || null,
                "APHTOPTH": data[obj]["ASSISTANT_PHOTOPATH"] || null,
                "ASGN": data[obj]["ASSISTANT_SIGNATURE"] || null,
                "RCD": data[obj]["RELIGION_CD"] || null,
                "NCD": data[obj]["NATIONALITY_CD"] || null,
                "BGCD": data[obj]["BLOOD_GROUP_CD"] || null,
                "UMR": data[obj]["UMR_NO"] || null,
                "NOC": data[obj]["NO_OF_CHILDREN"] || null,
                "CID": data[obj]["CITIZEN_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAsistantsByDoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "AID": data[obj]["ASSISTANT_ID"] || null,
                "ACD": data[obj]["ASSISTANT_CD"] || null,
                "TCD": data[obj]["TITLE_CD"] || null,
                "FNM": data[obj]["FIRST_NAME"] || null,
                "MNM": data[obj]["MIDDLE_NAME"] || null,
                "LNM": data[obj]["LAST_NAME"] || null,
                "DNM": data[obj]["DISPLAY_NAME"] || null,
                "SCD": data[obj]["SEX_CD"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MSCD": data[obj]["MARITAL_STATUS_CD"] || null,
                "PAN": data[obj]["PAN"] || null,
                "NTS": data[obj]["NOTES"] || null,
                "APHTOPTH": data[obj]["ASSISTANT_PHOTOPATH"] || null,
                "ASGN": data[obj]["ASSISTANT_SIGNATURE"] || null,
                "RCD": data[obj]["RELIGION_CD"] || null,
                "NCD": data[obj]["NATIONALITY_CD"] || null,
                "BGCD": data[obj]["BLOOD_GROUP_CD"] || null,
                "UMR": data[obj]["UMR_NO"] || null,
                "NOC": data[obj]["NO_OF_CHILDREN"] || null,
                "CID": data[obj]["CITIZEN_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPADocLocDetails: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLRXID": data[obj]["OLR_ID"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "DOCNAME": data[obj]["DOCTOR_NAME"] || null,
                "SFTID": data[obj]["SHIFT_ID"] || null,
                "SLALL": data[obj]["SLOT_ALL"] || null,
                "SLOPEN": data[obj]["SLOT_OPEN"] || null,
                "SLWL": data[obj]["SLOT_WL"] || null,
                "SLEME": data[obj]["SLOT_EME"] || null,
                "SLNOR": data[obj]["SLOT_NOR"] || null,
                "PHOTO": data[obj]["DOCTOR_IMAGE_URL"] || null,
                "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                "STAT": data[obj]["STAT"] || null,
                "SEL": data[obj]["IS_SEL"] || null,
                "ORDR": data[obj]["ORDR"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetEmpType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ETYP_CD": data[obj]["EMP_TYPE_CD"] || null,
                "ETYP_ID": data[obj]["EMP_TYPE_ID"] || null,
                "ETYP_NAME": data[obj]["EMP_TYPE_NAME"] || null,
                "ETYP_DSC": data[obj]["EMP_TYPE_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetEquipmentDet: (data) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.EQP_ID = obj.APMNT_DT || null;
            obj.EQP_NAME = obj.DISPLAY_TIME || null;
            obj.SERV_ID = obj.WK || null;
            obj.SER_NAME = obj.DOCTOR_NAME || null;
        });
        return data;
    },
    GetDefEquipmentDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SERV_ID": data[obj]["SERVICE_ID"] || null,
                "SER_NAME": data[obj]["SERVICE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getVisitDashBoardDayWise: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "REF_TYPE_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                "SPLZTN_ID": data[obj]["SPECILIZATION_ID"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "DAY_DT": data[obj]["DAY_DT"] || null,
                "BK_CNT": data[obj]["BOOK_CNT"] || null,
                "WTNG_CNT": data[obj]["WAITING_CNT"] || null,
                "CNLD_CNT": data[obj]["CANCELLED_CNT"] || null,
                "OPEN_CNT": data[obj]["OPEN_CNT"] || null,
                "ONLINE_CNT": data[obj]["ONLINE_CNT"] || null,
                "WALKIN_CNT": data[obj]["WALKIN_CNT"] || null,
                "PRIOR_CNT": data[obj]["PRIOR_CNT"] || null,
                "NEW_CNT": data[obj]["NEW_CNT"] || null,
                "REVISIT_CNT": data[obj]["REVISIT_CNT"] || null,
                "REVIEW_CNT": data[obj]["REVIEW_CNT"] || null,
                "MDY_DT": data[obj]["MODIFY_DT"] || null,
                "ORG_NAME": data[obj]["org_NAME"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "RSRC_NAME": data[obj]["RSRC_NAME"] || null,
                "REF_TYPE_NAME": data[obj]["REFERENCE_TYPE_NAME"] || null,
                "SPEC_NAME": data[obj]["SPECIALIZATION_NAME"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GETUserinfo: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DLOC_ID": data[obj]["DEFAULT_LOC_ID"] || null,
                "L_ST": data[obj]["LOCK_STATUS"] || null,
                "LOC_NAME": data[obj]["LOCATIONNAME"] || null,
                "REF_NAME": data[obj]["REFERENCE_NAME"] || null,
                "REF_TYP_NAME": data[obj]["REFERENCE_TYPE_NAME"] || null,
                "RS": data[obj]["RECORD_STATUS"] || null,
                "U_CD": data[obj]["USER_CD"] || null,
                "U_DSC": data[obj]["USER_DESC"] || null,
                "UID": data[obj]["USER_ID"] || null,
                "UNAM": data[obj]["USER_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },

    GetChkUmrNo: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MIG_ID": data[obj]["ID"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetLogEmail: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOG_NAME": data[obj]["LOGIN_NAME"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetUsrRefName: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DIS_NAME": data[obj]["DISPLAY_NAME"] || null,
                "EMAIL_ID": data[obj]["EMAIL_ID"] || null,
                "MOBILE_PHONE": data[obj]["MOBILE_PHONE"] || null,
                "ID": data[obj]["ID"] || null,
                "RFE_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getOrgLocUsers: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "USER_ID": data[obj]["USER_ID"] || null,
                "USER_NAME": data[obj]["USER_NAME"] || null,
                "REF_ID": data[obj]["REFERENCE_ID"] || null,
                "REF_TYPE_ID": data[obj]["REFERENCE_TYPE_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPatSrchUHR: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "TCD": data[obj]["TITILE_CD"] || null,
                "FNM": data[obj]["FIRST_NAME"] || null,
                "MNM": data[obj]["MIDDLE_NAME"] || null,
                "LNM": data[obj]["LAST_NAME"] || null,
                "DNM": data[obj]["DISPLAY_NAME"] || null,
                "GCD": data[obj]["GENDER_CD"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MSCD": data[obj]["MARITAL_STATUS_CD"] || null,
                "MBNO": data[obj]["MOBILE_NO"] || null,
                "EID": data[obj]["EMAIL_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPatSrchUMR: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MGID": data[obj]["MIGRATION_ID"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "TID": data[obj]["TITILE_ID"] || null,
                "FNM": data[obj]["FIRST_NAME"] || null,
                "MNM": data[obj]["MIDDLE_NAME"] || null,
                "LNM": data[obj]["LAST_NAME"] || null,
                "DNM": data[obj]["DISPLAY_NAME"] || null,
                "GID": data[obj]["GENDER_ID"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MSID": data[obj]["MARITAL_STATUS_ID"] || null,
                "MBNO": data[obj]["MOBILE_NO"] || null,
                "EID": data[obj]["EMAIL_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetQuickAptSlotDetails: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DTIME": data[obj]["DISPLAY_TIME"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "SID": data[obj]["STATUS_ID"] || null,
                "SRID": data[obj]["STATUS_REASON_ID"] || null,
                "ACCTYPE": data[obj]["ACCESS_TYPE"] || null,
                "SLTYPE": data[obj]["SLOT_TYPE"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "LOCADDR": data[obj]["LOCATION_ADDR"] || null,
                "DOCNAME": data[obj]["DOCTOR_NAME"] || null,
                "DOCIURL": data[obj]["DOCTOR_IMAGE_URL"] || null,
                "SPLZTN": data[obj]["SPECILIZATION"] || null,
                "CFEE": data[obj]["CONSULTATION_FEE"] || null,
                "REGFEE": data[obj]["REG_FEE"] || null,
                "RVSTFEE": data[obj]["REVISIT_FEE"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetPatDetails: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PID": data[obj]["PATIENT_ID"] || null,
                "UHR": data[obj]["UMR_NO"] || null,
                "TTL": data[obj]["TITILE_CD"] || null,
                "PNAME": data[obj]["DISPLAY_NAME"] || null,
                "FNAME": data[obj]["FIRST_NAME"] || null,
                "LNAME": data[obj]["LAST_NAME"] || null,
                "SEX": data[obj]["GENDER_CD"] || null,
                "MSTAT": data[obj]["MARITAL_STATUS_CD"] || null,
                "DOB": data[obj]["DOB"] || null,
                "MNO": data[obj]["MOBILE_NO"] || null,
                "MAIL": data[obj]["EMAIL_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPatientMap: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "UHR_NO": data[obj]["UHR_NO"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "REG_DT": data[obj]["REG_DT"] || null,
                "REG_EXPDT": data[obj]["REG_EXPIRY_DT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getPatSrchDtls: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "UHR_NO": data[obj]["UHR_NO"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "REG_DT": data[obj]["REG_DT"] || null,
                "REG_EXP_DT": data[obj]["REG_EXPIRY_DT"] || null,
                "DSP_NAME": data[obj]["DISPLAY_NAME"] || null,
                "GNDR_CD": data[obj]["GENDER_CD"] || null,
                "GNDR_NAME": data[obj]["GENDER_NAME"] || null,
                "DOB": data[obj]["DOB"] || null,
                "AGE": data[obj]["AGE"] || null,
                "MOB_NO": data[obj]["MOBILE_NO1"] || null,
                "EMAIL_ID": data[obj]["EMAIL_ID"] || null,
                "PHOTO": data[obj]["PHOTO"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getUNOType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "UNO_TYPE_ID": data[obj]["UNO_TYPE_ID"] || null,
                "UNO_TYPE_NAME": data[obj]["UNO_TYPE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getHealthTips: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "HLTH_TIP_DOCAPP_ID": data[obj]["HEALTH_TIP_DOCAPP_ID"] || null,
                "HLTH_TIP": data[obj]["HEALTH_TIP"] || null,
                "FILE_NAME": data[obj]["FILE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBodyMassCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "RECORD_TYPE_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "GENDER_ID": data[obj]["GENDER_ID"] || null,
                "WEIGHT": data[obj]["WEIGHT"] || null,
                "WEIGHT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HEIGHT": data[obj]["HEIGHT"] || null,
                "HEIGHT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HEIGHT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HEIGHT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "BMI": data[obj]["BMI"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBodyFatDetailsCal: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYPE_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "GENDER_ID": data[obj]["GENDER_ID"] || null,
                "WEIGHT": data[obj]["WEIGHT"] || null,
                "WEIGHT_ID": data[obj]["WEIGHT_ID"] || null,
                "UOM_ID": data[obj]["UOM_ID"] || null,
                "UOM_NAME": data[obj]["UOM_NAME"] || null,
                "WAIST": data[obj]["WAIST"] || null,
                "WRIST": data[obj]["WRIST"] || null,
                "HIP": data[obj]["HIP"] || null,
                "FOREARM": data[obj]["FOREARM"] || null,
                "BODYFAT_ID": data[obj]["BODYFAT_ID"] || null,
                "BODYFAT_NAME": data[obj]["BODYFAT_NAME"] || null,
                "BODYFAT": data[obj]["BODYFAT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetWaistTohipratioCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYPE_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "WAIST_UOM_ID": data[obj]["WAISTTOHIPRATIO_UOM_ID"] || null,
                "WAIST_UOM_NAME": data[obj]["WAISTTOHIPRATIO_UOM_NAME"] || null,
                "HIPM": data[obj]["HIPM"] || null,
                "WAISTM": data[obj]["WAISTM"] || null,
                "CHESTM": data[obj]["CHESTM"] || null,
                "WAISTCHESTR": data[obj]["WAISTCHESTR"] || null,
                "WAISTHIPR": data[obj]["WAISTHIPR"] || null,
                "CHESTMEASUREMENT": data[obj]["CHESTMEASUREMENT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBdSurfaceAreaCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HT": data[obj]["HEIGHT"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "BODYSUGAR": data[obj]["BODYSUGAR"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetIdealWeightCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "BDY_FRAME_ID": data[obj]["BODY_FRAME_ID"] || null,
                "BDY_FRAME_NAME": data[obj]["BODY_FRAME_NAME"] || null,
                "HT": data[obj]["HEIGHT"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "IDL_WT": data[obj]["IDEAL_WEIGHT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRecomCaloreCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "GENDER_ID": data[obj]["GENDER_ID"] || null,
                "AGE": data[obj]["AGE"] || null,
                "WEIGHT": data[obj]["WEIGHT"] || null,
                "WEIGHT_ID": data[obj]["WEIGHT_ID"] || null,
                "WEIGHT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HEIGHT": data[obj]["HEIGHT"] || null,
                "HEIGHT_ID": data[obj]["HEIGHT_ID"] || null,
                "HEIGHT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HEIGHT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HEIGHT_SUB_ID": data[obj]["HEIGHT_SUB_ID"] || null,
                "HEIGHT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetRecommendedFatCals: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "AGE": data[obj]["AGE"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HT": data[obj]["HEIGHT"] || null,
                "HT_ID": data[obj]["HEIGHT_ID"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HT_SUB_ID": data[obj]["HEIGHT_SUB_ID"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "RECFAT": data[obj]["RECOMMENDEDFAT"] || null,
                "STRTD_F": data[obj]["SATURATEDF"] || null,
                "MONO_STRTD_F": data[obj]["MONOSATURATEDF"] || null,
                "POLY_STRTD": data[obj]["POLYSATURATED"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetWatrRqmntCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "EXR": data[obj]["EXERCISE"] || null,
                "EXR_ID": data[obj]["EXERCISE_ID"] || null,
                "EXR_NAME": data[obj]["EXERCISE_NAME"] || null,
                "ENVI_ID": data[obj]["ENVIRONMENTAL_ID"] || null,
                "ENVI_NAME": data[obj]["ENVIRONMENTAL_NAME"] || null,
                "RECM_WATER": data[obj]["RECOMMDWATER"] || null
            });
        }
        data = null;
        return tempArr;
    },

    GetActivityCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "ACT_ID": data[obj]["ACTIVITY_ID"] || null,
                "ACT_NAME": data[obj]["ACTIVITY_NAME"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "DUR": data[obj]["DURATION"] || null,
                "CALORIES": data[obj]["CALORIES"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBmrCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "AGE": data[obj]["AGE"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HT": data[obj]["HEIGHT"] || null,
                "HT_ID": data[obj]["HEIGHT_ID"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HT_SUB_ID": data[obj]["HEIGHT_SUB_ID"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "BMR_VALUE": data[obj]["BMR_VALUE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetLeanBdyMassCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "HT": data[obj]["HEIGHT"] || null,
                "HT_ID": data[obj]["HEIGHT_ID"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB": data[obj]["HEIGHT_SUB"] || null,
                "HT_SUB_ID": data[obj]["HEIGHT_SUB_ID"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "LEAN_BODY_MASS": data[obj]["LEAN_BODY_MASS"] || null,
                "AGE": data[obj]["AGE"] || null
            });
        }
        data = null;
        return tempArr;
    },

    GetApgoreCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "AGE_OF_BABY_YRS": data[obj]["AGE_OF_BABY_YEARS"] || null,
                "APRNCE_ID": data[obj]["APPEARANCE_ID"] || null,
                "APRNCE_NAME": data[obj]["APPEARANCE_NAME"] || null,
                "PULSE_ID": data[obj]["PULSE_ID"] || null,
                "PULSE_NAME": data[obj]["PULSE_NAME"] || null,
                "RFLX_IRTABLTY_ID": data[obj]["REFLEXIRRITABILITY_ID"] || null,
                "RFLX_IRTABLTY_NAME": data[obj]["REFLEXIRRITABILITY_NAME"] || null,
                "ACTVTY_ID": data[obj]["ACTIVITY_ID"] || null,
                "ACTVTY_NAME": data[obj]["ACTIVITY_NAME"] || null,
                "RSPIRTN_ID": data[obj]["RESPIRATION_ID"] || null,
                "RSPIRTN_NAME": data[obj]["RESPIRATION_NAME"] || null,
                "APGORE_SCORE": data[obj]["APGORESCORE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetChildWtChrtCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "AGE": data[obj]["AGE"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "HT": data[obj]["HEIGHT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetHtPredctnCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "GNDR_ID": data[obj]["GENDER_ID"] || null,
                "HT_ID": data[obj]["HEIGHT_ID"] || null,
                "HT_NAME": data[obj]["HEIGHT_NAME"] || null,
                "HT_SUB_ID": data[obj]["HEIGHT_SUB_ID"] || null,
                "HT_SUB_NAME": data[obj]["HEIGHT_SUB_NAME"] || null,
                "CHILD_AGE": data[obj]["CHILD_AGE"] || null,
                "MTHR_HT": data[obj]["MOTHER_HT"] || null,
                "MTHR_SUB_HT": data[obj]["MOTHER_SUB_HT"] || null,
                "FTHR_HT": data[obj]["FATHER_HT"] || null,
                "FTHR_SUB_HT": data[obj]["FATHER_SUB_HT"] || null,
                "CHILD_HT": data[obj]["CHILD_HT"] || null,
                "CHILD_SUB_HT": data[obj]["CHILD_SUB_HT"] || null,
                "CHILD_WT": data[obj]["CHILD_WT"] || null,
                "CHILD_WT_ID": data[obj]["CHILD_WT_ID"] || null,
                "CHILD_WT_NAME": data[obj]["CHILD_WT_NAME"] || null,
                "ESTMT_HT": data[obj]["ESTMT_HT"] || null
            });
        }
        data = null;
        return tempArr;
    },

    GetBldAlchlCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "QNTY": data[obj]["QUANTITY"] || null,
                "BLD_ALCHL_UNIT_ID": data[obj]["BLOOD_ALCOHOL_UNIT_ID"] || null,
                "BLD_ALCHL_UNIT_NAME": data[obj]["BLOOD_ALCOHOL_UNIT_NAME"] || null,
                "ALCHL_CNT": data[obj]["ALCOHOL_CNT"] || null,
                "WT": data[obj]["WEIGHT"] || null,
                "WT_ID": data[obj]["WEIGHT_ID"] || null,
                "WT_NAME": data[obj]["WEIGHT_NAME"] || null,
                "TIME_STRT_DRNK": data[obj]["TIME_START_DRINK"] || null,
                "BLD_ALCHL": data[obj]["BLD_ALCOHOL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBldCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "LST_DNATN_DT": data[obj]["LDONATION_DT"] || null,
                "NXT_DNATN_DT": data[obj]["NDONATION_DT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBldCmptbltyCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "DONAR_BLD": data[obj]["DONAR_BLOOD"] || null,
                "RECIPENT": data[obj]["RECIPENT"] || null,
                "CMPTBLTY": data[obj]["COMPATIBILITY"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetMensCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "WRST_SIZ": data[obj]["WRIST_SIZE"] || null,
                "WRST_SIZ_ID": data[obj]["WRIST_SIZE_ID"] || null,
                "WRST_SIZ_NAME": data[obj]["WRIST_SIZE_NAME"] || null,
                "CHST_SIZ": data[obj]["CHEST_SIZE"] || null,
                "BICP_SIZ": data[obj]["BICEP_SIZE"] || null,
                "CLV_SIZ": data[obj]["CALVE_SIZE"] || null,
                "WST_SIZ": data[obj]["WAIST_SIZE"] || null,
                "FRE_ARM_SIZ": data[obj]["FOREARM_SIZE"] || null,
                "NECK_SIZ": data[obj]["NECK_SIZE"] || null,
                "HIP_SIZ": data[obj]["HIP_SIZE"] || null,
                "THN_SIZ": data[obj]["THIGN_SIZE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetLyfStlylCalc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "NO_OF_CIGRAT": data[obj]["NO_OF_CIGRAT"] || null,
                "NO_OF_CIGRAT_PK": data[obj]["NO_OF_CIGRAT_PK"] || null,
                "PACK_PRICE": data[obj]["PACK_PRICE"] || null,
                "STRT_SMKNG": data[obj]["START_SMOKING"] || null,
                "YR_CIGRAT_CST": data[obj]["YEAR_CIGERATE_COST"] || null,
                "CIGRAT_CST": data[obj]["CIGERATE_COST"] || null,
                "RDCTIN_LIFE": data[obj]["REDUCTIONLIFE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDietryCal: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MRN_NO": data[obj]["MRN_NO"] || null,
                "REC_TYP_ID": data[obj]["RECORD_TYPE_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STS": data[obj]["RECORD_STATUS"] || null,
                "FOOD_GRP_ID": data[obj]["FOOD_GRP_ID"] || null,
                "FOOD_GRP_NAME": data[obj]["FOOD_GRP_NAME"] || null,
                "FOOD_ITEM_ID": data[obj]["FOOD_ITEM_ID"] || null,
                "FOOD_ITEM_NAME": data[obj]["FOOD_ITEM_NAME"] || null,
                "QUANTITY": data[obj]["QUANTITY"] || null,
                "CALORIES": data[obj]["CALORIES"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetBloodGroup: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "BLD_GRU_CD": data[obj]["BLOOD_GROUP_CD"] || null,
                "BLD_GRU_NAME": data[obj]["BLOOD_GROUP_NAME"] || null,
                "BLD_GRU_DESC": data[obj]["BLOOD_GROUP_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetUOM: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "UOM_ID": data[obj]["UOM_ID"] || null,
                "UOM_TYPE_ID": data[obj]["UOM_TYPE_ID"] || null,
                "UOM_CD": data[obj]["UOM_CD"] || null,
                "UOM_NAME": data[obj]["UOM_NAME"] || null,
                "UOM_DESC": data[obj]["UOM_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetFdCtgry: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "FD_CAT_ID": data[obj]["FOOD_CAT_ID"] || null,
                "FD_CTGRY_NAME": data[obj]["FOOD_CATEGORY_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetFdItems: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "NUTRITION_ID": data[obj]["NUTRITION_ID"] || null,
                "ITEM": data[obj]["ITEM"] || null,
                "CALORIES": data[obj]["CALORIES"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetFdSubCtgry: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "FD_SUB_CAT_ID": data[obj]["FOOD_SUB_CAT_ID"] || null,
                "FD_SUB_CTGRY_NAME": data[obj]["FOOD_SUB_CATEGORY_NAME"] || null,
                "CALORIES": data[obj]["CALORIES"] || null,
                "CTGRY_ID": data[obj]["CATEGORY_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPaymentHist: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PAY_ID": data[obj]["PAYMENT_ID"] || null,
                "AMOUNT": data[obj]["PAID_AMOUNT"] || null,
                "BILL_NO": data[obj]["BILL_NO"] || null,
                "BILL_DT": data[obj]["BILL_DT"] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "DOC_NAME": data[obj]["DOCTOR_NAME"] || null,
                "INVS_ORDER": data[obj]["INVS_ORDER"] || null,
                "MEDI_ORDER": data[obj]["MEDI_ORDER"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSpecDocSrv: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SRV_ID": data[obj]["SRV_ID"] || null,
                "SRV_NAME": data[obj]["SRV_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPatConsDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "BILL_ID": data[obj]["BILL_ID"] || null,
                "DOC_NAME": data[obj]["DOCTOR_NAME"] || null,
                "UHR_NO": data[obj]["UHR_NO"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "PAT_NAME": data[obj]["PATIENT_NAME"] || null,
                "CONSU_NO": data[obj]["CONSUTATION_NO"] || null,
                "BILL_DT": data[obj]["BILL_DT"] || null,
                "DOC_FEE": data[obj]["DOCTOR_FEE"] || null,
                "RECPT_AMT": data[obj]["RECEPIT_AMT"] || null,
                "DUE_AMT": data[obj]["DUE_AMOUNT"] || null,
                "CONS_TYP_NAME": data[obj]["CONSULTATION_TYPE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetCatgryWiseDAmtRep: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CATEGORY": data[obj]["CATEGORY"] || null,
                "TRANS_TYPE": data[obj]["TRANS_TYPE"] || null,
                "PAT_NAME": data[obj]["PATIENT_NAME"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "BILL_NO": data[obj]["BILL_NO"] || null,
                "BILL_DT": data[obj]["BILL_DT"] || null,
                "GROSS_AMT": data[obj]["GROSS_AMOUNT"] || null,
                "DIS_AMT": data[obj]["DISCOUNT_AMOUNT"] || null,
                "NET_AMT": data[obj]["NET_AMOUNT"] || null,
                "RECT_AMT": data[obj]["RECEIPT_AMOUNT"] || null,
                "DUE_AMT": data[obj]["DUE_AMOUNT"] || null

            });
        }
        data = null;
        return tempArr;
    },
    GetShiftAmt: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SRV_TYPE": data[obj]["SERVICE_TYPE"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "DIS_NAME": data[obj]["PATIENT_NAME"] || null,
                "BILL_NO": data[obj]["BILL_NO"] || null,
                "BILL_DT": data[obj]["BILL_DT"] || null,
                "USER_ID": data[obj]["USER_ID"] || null,
                "USER_NAME": data[obj]["USER_NAME"] || null,
                "CONSULTANT": data[obj]["CONSULTANT"] || null,
                "PAID_AMT": data[obj]["PAID_AMOUNT"] || null,
                "GROSS_AMT ": data[obj]["GROSS_AMT"] || null,
                "CONC_AMT ": data[obj]["CONCESSION_AMOUNT"] || null,
                "NET_AMT ": data[obj]["NET_AMOUNT"] || null,
                "DUE_AMT ": data[obj]["DUE_AMOUNT"] || null,
                "ADJ_AMT ": data[obj]["ADJ_AMOUNT"] || null
            })
        }
        data = null;
        return tempArr;
    },
    GetspcByLoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_ID  ": data[obj]["LOC_ID"] || null,
                "SPEC_CD ": data[obj]["SPECIALIZATION_CD"] || null,
                "SPEC_NAME ": data[obj]["SPECIALIZATION_NAME"] || null,
                "SPEC_DESC ": data[obj]["SPECIALIZATION_DESC"] || null,
                "SPEC_ID ": data[obj]["SPECIALIZATION_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSpecialities: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SPECIAL_ID": data[obj]["SPECIALITY_ID"] || null,
                "SPECIAL_NAME ": data[obj]["SPECIALITY_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAllAutoDoctors: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID "] || null,
                "DID ": data[obj]["RSRC_ID"] || null,
                "DNM ": data[obj]["DOCTOR_NAME"] || null,
                "PHO": data[obj]["DOCTOR_PHOTO"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAllDoctorSlotsBySpecialityID: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SID": data[obj]["SLOTS_ID "] || null,
                "ST ": data[obj]["DISPLAY_TIME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAllDoctorDetailsByDocID: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DID": data[obj]["DOCTOR_ID "] || null,
                "DNM ": data[obj]["DOCTOR_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    AptBookMsg: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CMRI": data[obj]["COM_MSG_REQ_ID "] || null,
                "REF_ID ": data[obj]["REFERENCE_ID"] || null,
                "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID "] || null,
                "RTID ": data[obj]["REQ_TYPE_ID"] || null,
                "NTS": data[obj]["NOTES "] || null,
                "DNM ": data[obj]["DISPLAY_NAME"] || null,
                "ADT": data[obj]["APMNT_DT "] || null,
                "TCD ": data[obj]["TITLE_CD"] || null,
                "EID": data[obj]["EMAIL_ID "] || null,
                "MNO ": data[obj]["MOBILE"] || null,
                "RFV": data[obj]["REASON_FOR_VISIT "] || null,
                "ADR1 ": data[obj]["ADDRESS1"] || null,
                "CEMAIL": data[obj]["CC_EMAIL "] || null,
                "UHR ": data[obj]["UHR_NO"] || null,
                "GEN": data[obj]["GENDER_NAME "] || null,
                "DOC_NAME ": data[obj]["DOCTOR_NAME"] || null,
                "APPT_TIME": data[obj]["APPT_TIME "] || null,
                "AGE ": data[obj]["AGE"] || null,
                "SPECLZN": data[obj]["SPECILIZATION "] || null,
                "LOC_ID ": data[obj]["LOC_ID"] || null,
                "ORG_ID ": data[obj]["ORG_ID"] || null,
                "ORG_NAME ": data[obj]["ORG_NAME"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME "] || null,
                "USER_ID ": data[obj]["USER_ID"] || null,
                "USER_NAME": data[obj]["USER_NAME "] || null,
                "TEST_EMAIL ": data[obj]["TEST_EMAIL"] || null,
                "TEST_MODE": data[obj]["TEST_MODE "] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetCommMsgTypes: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RTID": data[obj]["REQ_TYPE_ID "] || null,
                "RDC ": data[obj]["REQ_DESC"] || null,
                "EMAIL_TEMP": data[obj]["EMAIL_TEMPLATE "] || null,
                "MOB_TEMP ": data[obj]["MOBILE_TEMPLATE"] || null,
                "TMPDC": data[obj]["TEMPLATE_DESC "] || null,
                "REC_STS ": data[obj]["RECORD_STATUS"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetComMsgReg: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "TNM": data[obj]["TITLE_NAME "] || null,
                "PNM ": data[obj]["PATIENT_NAME"] || null,
                "UHR": data[obj]["UHR_NO"] || null,
                "AGE ": data[obj]["AGE"] || null,
                "GNM": data[obj]["GENDER_NAME "] || null,
                "RNO ": data[obj]["REG_NO"] || null,
                "RDT": data[obj]["REG_DT "] || null,
                "RECNO ": data[obj]["RECEIPT_NO"] || null,
                "MOBILE": data[obj]["MOBILE "] || null,
                "RPRNM ": data[obj]["RES_PERSON_REL_NAME"] || null,
                "RPNM": data[obj]["RES_PERSON_NAME "] || null,
                "OCU ": data[obj]["OCCUPATION_NAME"] || null,
                "DNM": data[obj]["DOCTOR_NAME "] || null,
                "RBY ": data[obj]["REF_BY"] || null,
                "RFEE": data[obj]["REG_FEE "] || null,
                "RAMT ": data[obj]["RECEIPT_AMT"] || null,
                "ADR1": data[obj]["ADDRESS1 "] || null,
                "CNM ": data[obj]["CITY_NAME"] || null,
                "PIN": data[obj]["PINCODE "] || null,
                "EMAIL ": data[obj]["EMAIL_ID"] || null,
                "MSNM": data[obj]["MARITAL_STATUS_NAME "] || null,
                "NNM ": data[obj]["NATIONALITY_NAME"] || null,
                "SPECNM": data[obj]["SPECIALITY_NAME "] || null,
                "RNM ": data[obj]["RELIGION_NAME"] || null,
                "RVDTY": data[obj]["REG_VALIDITY "] || null,
                "CAMT ": data[obj]["CASH_AMT"] || null,
                "CMRID": data[obj]["COM_MSG_REQ_ID "] || null,
                "ADT ": data[obj]["APMNT_DT"] || null,
                "RTID": data[obj]["REQ_TYPE_ID "] || null,
                "RS ": data[obj]["RECORD_STATUS"] || null,
                "NTS ": data[obj]["NOTES"] || null,
                "RFV": data[obj]["REASON_FOR_VISIT "] || null,
                "CEMAIL ": data[obj]["CC_EMAIL"] || null,
                "ATIME": data[obj]["APPT_TIME "] || null,
                "CONS_FEE ": data[obj]["CONS_FEE"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME "] || null,
                "LOC_ADDR ": data[obj]["LOC_ADDRESS"] || null,
                "LOC_EMAIL": data[obj]["LOC_EMAIL"] || null,
                "LOC_OFFICE ": data[obj]["LOC_OFFICE"] || null,
                "LOC_WEBSITE": data[obj]["LOC_WEBSITE "] || null,
                "LOC_FAX ": data[obj]["LOC_FAX"] || null,
            });
        }
        data = null;
        return tempArr;
    },
    GetAptsumary: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PAT_ID": data[obj]["PATIENT_ID "] || null,
                "UHR_NO ": data[obj]["UHR_NO"] || null,
                "DIS_NAME": data[obj]["DISPLAY_NAME"] || null,
                "RESN_VIST ": data[obj]["REASON_FOR_VISIT"] || null,
                "EMAIL_ID": data[obj]["EMAIL_ID "] || null,
                "MOB ": data[obj]["MOBILE"] || null,
                "ADDR": data[obj]["PAT_ADDR "] || null,
                "ADDR1 ": data[obj]["PAT_ADDR1"] || null,
                "PINCODE": data[obj]["PINCODE "] || null,
                "CITY_ID ": data[obj]["CITY_ID"] || null,
                "COUNTRY_ID": data[obj]["COUNTRY_ID "] || null,
                "AREA_NAME ": data[obj]["AREA_NAME"] || null,
                "OLR_ID": data[obj]["OLR_ID "] || null,
                "DOC_NAME ": data[obj]["DOCTOR_NAME"] || null,
                "LOC_ADD": data[obj]["LOCATION_ADDR "] || null,
                "APMNT_DT ": data[obj]["APMNT_DT"] || null,
                "SLT_TYP": data[obj]["SLOT_TYPE "] || null,
                "SLT_TYP_NAME ": data[obj]["SLOT_TYPE_NAME"] || null,
                "REG_FEE": data[obj]["REG_FEE "] || null,
                "CONS_FEE ": data[obj]["CONS_FEE"] || null,
                "SPLIZTION": data[obj]["SPECILIZATION "] || null,
                "LOCATION_NAME ": data[obj]["LOCATION_NAME"] || null,
                "ORG_NAME": data[obj]["ORG_NAME "] || null,
                "TOTAL_PAID_AMT ": data[obj]["TOTAL_PAID_AMT"] || null,
                "LOC_ID": data[obj]["LOC_ID "] || null,
                "ORG_ID ": data[obj]["ORG_ID "] || null,
                "PAY_ID": data[obj]["PAYMENT_ID "] || null,
                "DUE_AMT ": data[obj]["DUE_AMT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetMonViewCount: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "REC_STUS": data[obj]["RECORD_STATUS"] || null,
                "SLT_AVB_CNT": data[obj]["SLOT_AVAILABLE_CNT"] || null,
                "SLT_BKD_CNT": data[obj]["SLOT_BOOKED_CNT"] || null,
                "SLT_WAITNG_CNT": data[obj]["SLOT_WAITING_CNT"] || null,
                "SLT_CNCEL_CNT": data[obj]["SLOT_CANCELLED_CNT"] || null,
                "SLT_COM_CNT": data[obj]["SLOT_COMPLETED_CNT"] || null,
                "SLT_DRP_CNT": data[obj]["DropReqCnt"] || null,
                "TYPE_HOL": data[obj]["TYPE_HOL"] || null,
                "DAY_STATUS": data[obj]["DAY_STATUS"] || null,
                "NO_SCHEDULE": data[obj]["NO_SCHEDULE"] || null,
                "HOL_NAME": data[obj]["HOL_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRsrcMonthView: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "RSRC_SCH_TIME_ID": data[obj]["RSRC_SCH_TIME_ID"] || null,
                "SLOT_DATE": data[obj]["SLOT_DATE"] || null,
                "SLOT_FROM_TO_TIME": data[obj]["SLOT_FROM_TO_TIME"] || null,
                "SLOT_TYPE": data[obj]["SLOT_TYPE"] || null,
                "DAY_STATUS": data[obj]["DAY_STATUS"] || null,
                "SEQ_NO": data[obj]["SEQ_NO"] || null,
                "TYPE_HOL": data[obj]["TYPE_HOL"] || null,
                "HOL_NAME": data[obj]["HOL_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPaLocDocSlotStatus: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OLR_ID": data[obj]["OLR_ID "] || null,
                "SHIFT_ID ": data[obj]["SHIFT_ID"] || null,
                "SLOT_ALL": data[obj]["SLOT_ALL"] || null,
                "SLOT_OPEN  ": data[obj]["SLOT_OPEN"] || null,
                "SLOT_WL": data[obj]["SLOT_WL"] || null,
                "SLOT_EME ": data[obj]["SLOT_EME"] || null,
                "SLOT_NOR": data[obj]["SLOT_NOR "] || null,
                "SLOT_DT ": data[obj]["SLOT_DT"] || null,
                "SHIFT_TIME": data[obj]["SHIFT_TIME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetChkRevst: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CONS_TYPE_ID": data[obj]["CONSULTATION_TYPE_ID "] || null,
                "CNT ": data[obj]["CNT"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetApmntType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "APMNT_TYPE_ID": data[obj]["APMNT_TYPE_ID "] || null,
                "APMNT_TYPE_NAME ": data[obj]["APMNT_TYPE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetConsultType: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CNSLT_TYPE_ID": data[obj]["CONSULTATION_TYPE_ID "] || null,
                "CNSLT_TYPE_NAME ": data[obj]["CONSULTATION_TYPE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRqstApmnt: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DRP_RQST_ID": data[obj]["DROP_REQUEST_ID "] || null,
                "OLR_ID ": data[obj]["OLR_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "RSRC_ID  ": data[obj]["RSRC_ID"] || null,
                "REF_ID": data[obj]["REFERENCE_ID"] || null,
                "REF_TYP_ID ": data[obj]["REFERENCE_TYPE_ID"] || null,
                "APMNT_DT": data[obj]["APMNT_DT "] || null,
                "SCH_START_TIME ": data[obj]["SCH_START_TIME"] || null,
                "DISP_NAME": data[obj]["DISPLAY_NAME"] || null,
                "RSN_FOR_VST ": data[obj]["REASON_FOR_VISIT"] || null,
                "EMAIL_ID": data[obj]["EMAIL_ID"] || null,
                "MOBILE ": data[obj]["MOBILE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPayReq: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOT_ID": data[obj]["SLOT_ID "] || null,
                "SNO ": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "LOGIN ": data[obj]["LOGIN"] || null,
                "PASS": data[obj]["PASS "] || null,
                "TTYPE ": data[obj]["TTYPE"] || null,
                "PRODID": data[obj]["PRODID "] || null,
                "AMT ": data[obj]["AMT"] || null,
                "TXNCURR": data[obj]["TXNCURR "] || null,
                "TXNSCAMT ": data[obj]["TXNSCAMT"] || null,
                "CLIENTCODE": data[obj]["CLIENTCODE "] || null,
                "TXNID ": data[obj]["TXNID"] || null,
                "DATE": data[obj]["DATE "] || null,
                "CUSTACC ": data[obj]["CUSTACC"] || null,
                "MDD": data[obj]["MDD "] || null,
                "RU ": data[obj]["RU"] || null,
                "UDF1": data[obj]["UDF1 "] || null,
                "UDF2 ": data[obj]["UDF2"] || null,
                "UDF3": data[obj]["UDF3 "] || null,
                "UDF4 ": data[obj]["UDF4"] || null,
                "UDF5": data[obj]["UDF5 "] || null,
                "UDF6 ": data[obj]["UDF6"] || null,
                "UDF9": data[obj]["UDF9 "] || null,
                "RESP_URL ": data[obj]["RESP_URL"] || null,
                "REQ_URL": data[obj]["REQ_URL "] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPayReq2: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOT_ID": data[obj]["SLOT_ID "] || null,
                "SNO ": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "URL": data[obj]["URL"] || null,
                "TTYPE": data[obj]["TTYPE"] || null,
                "TEMPTXNID ": data[obj]["TEMPTXNID"] || null,
                "TOKEN": data[obj]["TOKEN "] || null,
                "TXNSTAGE ": data[obj]["TXNSTAGE"] || null,
                "RESP_URL": data[obj]["RESP_URL"] || null,
                "REQ_URL ": data[obj]["REQ_URL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    Getpayrespnce1: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOT_ID": data[obj]["SLOT_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "MMP_TXN ": data[obj]["MMP_TXN"] || null,
                "MER_TXN": data[obj]["MER_TXN"] || null,
                "AMT": data[obj]["AMT"] || null,
                "SURCHARGE": data[obj]["SURCHARGE "] || null,
                "PRODID": data[obj]["PRODID"] || null,
                "DT": data[obj]["DT"] || null,
                "BANK_TXN": data[obj]["BANK_TXN"] || null,
                "F_CODE": data[obj]["F_CODE"] || null,
                "CLIENTCODE": data[obj]["CLIENTCODE"] || null,
                "BANK_NAME": data[obj]["BANK_NAME"] || null,
                "DICRIMNATR": data[obj]["DISCRIMINATOR"] || null,
                "CARDNUM": data[obj]["CARDNUMBER"] || null,
                "UDF1": data[obj]["UDF1"] || null,
                "UDF2": data[obj]["UDF2"] || null,
                "UDF3": data[obj]["UDF3"] || null,
                "UDF4": data[obj]["UDF4"] || null,
                "UDF5": data[obj]["UDF5"] || null,
                "UDF6": data[obj]["UDF6"] || null,
                "UDF9": data[obj]["UDF9"] || null,
                "DESC": data[obj]["DESCRIPTIONS "] || null,
                "RESP_URL ": data[obj]["RESP_URL"] || null,
                "REQ_URL": data[obj]["REQ_URL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    Getpayrespnce2: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOT_ID": data[obj]["SLOT_ID"] || null,
                "SNO": data[obj]["SNO"] || null,
                "REC_STATUS": data[obj]["RECORD_STATUS"] || null,
                "MERC_ID ": data[obj]["MERCHANTID"] || null,
                "MERT_ID": data[obj]["MERCHANTTXNID"] || null,
                "AMT": data[obj]["AMT"] || null,
                "SURCHARGE": data[obj]["VERIFIED "] || null,
                "DICRIMNATR": data[obj]["BID"] || null,
                "CARDNUM": data[obj]["BANKNAME"] || null,
                "CARDNUM": data[obj]["ATOMTXNID"] || null,
                "SURCHARGE": data[obj]["SURCHARGE"] || null,
                "DICRIMNATR": data[obj]["DISCRIMINATOR"] || null,
                "CARDNUM": data[obj]["CARDNUMBER"] || null,
                "RESP_URL": data[obj]["RESP_URL"] || null,
                "REQ_URL": data[obj]["REQ_URL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetOrgCityLoc: (data) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.Id = obj.ID;
            obj.Name = obj.NAME;
        });
        return data;
    },
    GetOrgbankmap: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "BANK_ID": data[obj]["BANK_ID"] || null,
                "REC_STA": data[obj]["RECORD_STATUS"] || null,
                "BANK_CD": data[obj]["BANK_CD"] || null,
                "BANK_DESC ": data[obj]["BANK_DESC"] || null,
                "BANK_NAME": data[obj]["BANK_NAME"] || null,
                "ORG_CD": data[obj]["ORG_CD"] || null,
                "ORG_DESC": data[obj]["ORG_DESC "] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    Getauthfortran: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "AUTH_FOR_TRAN_ID": data[obj]["AUTHORIZATION_FOR_TRAN_ID"] || null,
                "REC_STA": data[obj]["RECORD_STATUS"] || null,
                "AUTH_FOR_TRAN_CD": data[obj]["AUTHORIZATION_FOR_TRAN_CD"] || null,
                "AUTH_FOR_TRAN_NAME ": data[obj]["AUTHORIZATION_FOR_TRAN_NAME"] || null,
                "AUTH_FOR_TRAN_DESC": data[obj]["AUTHORIZATION_FOR_TRAN_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetAuthrization: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "AUTH_ID": data[obj]["AUTH_ID"] || null,
                "AUTH_FOR_TRAN_ID": data[obj]["AUTH_FOR_TRAN_ID"] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null,
                "LOC_NAME ": data[obj]["LOCATION_NAME"] || null,
                "AUTH_FOR_TRAN_NAME": data[obj]["AUTHORIZATION_FOR_TRAN_NAME"] || null,
                "USER_NAME": data[obj]["USER_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetctyLocs: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_ID": data[obj]["LOCATION_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "CTY_ID": data[obj]["CITY_ID"] || null,
                "CTY_NAME ": data[obj]["CITY_NAME"] || null,
                "AREA_ID": data[obj]["AREA_ID"] || null,
                "AREA_NAME": data[obj]["AREA_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRsrcLocMnthView: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PAT_NAME": data[obj]["PATIENT_NAME"] || null,
                "UHR_NO": data[obj]["UHR_NO"] || null,
                "UMR_NO": data[obj]["UMR_NO"] || null,
                "SLOTS_ID ": data[obj]["SLOTS_ID"] || null,
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "SLT_FRM_TO_TIME": data[obj]["SLOT_FROM_TO_TIME"] || null,
                "SCH_START_TIME": data[obj]["SCH_START_TIME"] || null,
                "SCH_END_TIME": data[obj]["SCH_END_TIME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getComMsgRq: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CMRI": data[obj]["COM_MSG_REQ_ID"] || null,
                "RTID": data[obj]["REQ_TYPE_ID"] || null,
                "RC_STS": data[obj]["RECORD_STATUS"] || null,
                "REF_ID ": data[obj]["REFERENCE_ID"] || null,
                "REF_TYP_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "NTS": data[obj]["NOTES"] || null,
                "ERR_CNT": data[obj]["ERROR_CNT"] || null,
                "ERR_DESC": data[obj]["ERROR_DESC"] || null,
                "REQ_ID": data[obj]["REQ_ID"] || null,
                "APT_ST_TIME ": data[obj]["APT_START_TIME"] || null,
                "APT_END_TIME": data[obj]["APT_END_TIME"] || null,
                "SCH_DAYS": data[obj]["SCH_DAYS"] || null,
                "TO_EMAIL": data[obj]["TO_EMAIL"] || null,
                "FROM_EMAIL": data[obj]["FROM_EMAIL"] || null,
                "EMAIL_MSG_TPL": data[obj]["EMAIL_MSG_TPL"] || null,
                "MOB_MSG_TPL": data[obj]["MOB_MSG_TPL"] || null,
                "IS_MOB": data[obj]["IS_MOBILE"] || null,
                "IS_EMAIL ": data[obj]["IS_EMAIL"] || null,
                "MOB_URI": data[obj]["MOBILE_URI"] || null,
                "TO_MOB": data[obj]["TO_MOBILE_NO"] || null,
                "SUBJECT": data[obj]["SUBJECT"] || null,
                "HOST_EMAIL": data[obj]["HOST_EMAIL"] || null,
                "EMAIL_PWD": data[obj]["EMAIL_PWD"] || null,
                "SERVER_HOST ": data[obj]["SERVER_HOST"] || null,
                "PORT": data[obj]["PORT"] || null,
                "ENABLE_SSL": data[obj]["ENABLE_SSL"] || null,
                "IS_BODYHTML": data[obj]["IS_BODYHTML"] || null,
                "SMTP_CC": data[obj]["SMTP_CC"] || null,
                "SMTP_BCC": data[obj]["SMTP_BCC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getComMsgVoice: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "CMVI": data[obj]["COM_MSG_VOICE_ID"] || null,
                "REQ_TYPE_ID": data[obj]["REQ_TYPE_ID"] || null,
                "REF_ID": data[obj]["REFERENCE_ID"] || null,
                "REF_TYPE_ID ": data[obj]["REFERENCE_TYPE_ID"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "LANG_ID": data[obj]["LANGUAGE_ID"] || null,
                "LANG_NAME": data[obj]["LANGUAGE_NAME"] || null,
                "LANGUAGE_NAME": data[obj]["NOTES"] || null,
                "IS_MOB": data[obj]["IS_MOBILE"] || null,
                "TO_MOB": data[obj]["TO_MOBILE_NO"] || null,
                "MOB_MSG_TPL ": data[obj]["MOB_MSG_TPL"] || null,
                "MOB_SENT_DT": data[obj]["MOBILE_SENT_DT"] || null,
                "MOB_URI": data[obj]["MOBILE_URI"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetService: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SID": data[obj]["SERVICE_ID"] || null,
                "SNM": data[obj]["SERVICE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetComponentAuto: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "COMP_ID": data[obj]["COMPONENT_ID"] || null,
                "I_COMP_ID": data[obj]["I_COMP_ID"] || null,
                "COMP_CD": data[obj]["COMPONENT_CD"] || null,
                "COMP_NAME": data[obj]["COMPONENT_NAME"] || null,
                "SRV_GRP_NAME": data[obj]["SERVICE_GROUP_NAME"] || null,
                "SRV_GRP_ID": data[obj]["SERVICE_GROUP_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getprofileCompDet: (data) => {
        if (!data) return [];
        return JSON.stringify(data);
    },
    getGridViewConfig: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ID": data[obj]["ID"] || null,
                "Name": data[obj]["NAME"] || null,
                "Title": data[obj]["TITLE"] || null,
                "SrvMeth": data[obj]["SERVICE_METHOD"] || null,
                "SrvPath": data[obj]["SERVICE_PATH"] || null,
                "GridLvl": data[obj]["GRID_LEVEL"] || null,
                "RowLvl": data[obj]["ROW_LEVEL"] || null,
                "CellLvl": data[obj]["CELL_LEVEL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSearchSrv: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SRV_ID": data[obj]["SERVICE_ID"] || null,
                "SRV_CD": data[obj]["SERVICE_CD"] || null,
                "SRV_NAME": data[obj]["SERVICE_NAME"] || null,
                "SEA_SRV": data[obj]["SEARCH_SRVC"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "LOC_ID": data[obj]["ORG_ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getQmsTvMig: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ID": data[obj]["ID"] || null,
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "IP_ADDR": data[obj]["IP_ADDR"] || null,
                "MAC_ADDR": data[obj]["MAC_ADDR"] || null,
                "RESOLUTION_X": data[obj]["RESOLUTION_X"] || null,
                "RESOLUTION_Y": data[obj]["RESOLUTION_Y"] || null,
                "POSITION_X": data[obj]["POSITION_X"] || null,
                "POSITION_Y": data[obj]["POSITION_Y"] || null,
                "HTML": data[obj]["HTML"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetParamGrp: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PARM_GRP_ID": data[obj]["PARAMETER_GROUP_ID"] || null,
                "PARM_GRP_NAME": data[obj]["PARAMETER_GROUP_NAME"] || null,
                "PARM_GRP_DESC": data[obj]["PARAMETER_GROUP_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPkgSrvc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "PKG_ID": data[obj]["PKG_ID"] || null,
                "PKG_NAME": data[obj]["PKG_NAME"] || null,
                "PRICE": data[obj]["PRICE"] || null,
                "DISC_PRICE": data[obj]["DISC_PRICE"] || null,
                "DISC_PERC": data[obj]["DISC_PERC"] || null,
                "SERVICE_CNT": data[obj]["SERVICE_CNT"] || null,
                "PROFILE_CNT": data[obj]["PROFILE_CNT"] || null,
                "INSTCT": data[obj]["INSTRUCTION"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetSrvcDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SRV_DET_ID": data[obj]["SERVICE_DET_ID"] || null,
                "SRV_ID": data[obj]["SERVICE_ID"] || null,
                "GEN_SRV_ID": data[obj]["GENERAL_SERVICE_ID"] || null,
                "GEN_SRV_NAME": data[obj]["GENERAL_SERVICE_NAME"] || null,
                "SRV_NAME": data[obj]["SERVICE_NAME"] || null,
                "SRV_GRP_ID": data[obj]["SRVC_GROUP_ID"] || null,
                "SRV_GRP_NAME": data[obj]["SRVC_GROUP_NAME"] || null,
                "SRVC_DET_NAME": data[obj]["SRVC_DET_NAME"] || null,
                "DISC_PRICE": data[obj]["DISC_PRICE"] || null,
                "DISP_GRP_NAME": data[obj]["DISPLAY_GROUP_NAME"] || null,
                "DISP_SRV_NAME": data[obj]["DISPLAY_SRVC_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetsrvInstruction: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SNO": data[obj]["SNO"] || null,
                "TITLE": data[obj]["TITLE"] || null,
                "INSTRUCTIONS": data[obj]["INSTRUCTIONS"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetsrvcGrp: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SRVC_GRP_ID": data[obj]["SRVC_GROUP_ID"] || null,
                "SRVC_GRP_NAME": data[obj]["SRVC_GROUP_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    getLookUpConfig: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LKUP_SRV_MTHD": data[obj]["LOOKUP_SERVICE_METHOD"] || null,
                "LKUP_SRV_PATH": data[obj]["LOOKUP_SERVICE_PATH"] || null,
                "LKUP_CLMN": data[obj]["LOOKUP_COLUMN"] || null,
                "LKUP_CLMN_ALIAS": data[obj]["LOOKUP_COLUMN_ALIAS"] || null,
                "LKUP_KEY_CLMNS": data[obj]["LOOKUP_KEY_COLUMNS"] || null,
                "LKUP_TITLE": data[obj]["LOOKUP_TITLE"] || null,
                "LOOKUP_COL_DATA_TYPE": data[obj]["LOOKUP_COL_DATA_TYPE"] || null,
                "REP_PARAM": data[obj]["REP_PARAM"] || null,
                "lookUpCols": (data[obj]["LOOKUP_COLUMN"] ? data[obj]["LOOKUP_COLUMN"].split(',') : []),
                "lookUpColAls": (data[obj]["LOOKUP_COLUMN_ALIAS"] ? data[obj]["LOOKUP_COLUMN_ALIAS"].split(',') : []),
                "lookUpKeyCols": (data[obj]["LOOKUP_KEY_COLUMNS"] ? data[obj]["LOOKUP_KEY_COLUMNS"].split(',') : []),
                "lookUpColDataType": (data[obj]["LOOKUP_COL_DATA_TYPE"] ? data[obj]["LOOKUP_COL_DATA_TYPE"].split(',') : []),
                "repParam": (data[obj]["REP_PARAM"] ? data[obj]["REP_PARAM"].split(',') : [])
            });
        }
        data = null;
        return tempArr;
    },
    getUserOccpation: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "OCCUPATION_CD": data[obj]["OCCUPATION_CD"] || null,
                "OCCUPATION_NAME": data[obj]["OCCUPATION_NAME"] || null,
                "OCCUPATION_DESC": data[obj]["OCCUPATION_DESC"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetPatIndentAutoCmplt: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "SLOTS_ID": data[obj]["SLOTS_ID"] || null,
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "DIS_NAME": data[obj]["DISPLAY_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetVldConsOlrFee: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ID": data[obj]["ID"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetOrg: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ORG_ID": data[obj]["ORG_ID"] || null,
                "ORG_CD": data[obj]["ORG_CD"] || null,
                "ORG_NAME": data[obj]["ORG_NAME"] || null,
                "ORG_DESC": data[obj]["ORG_DESC"] || null,
                "IMTYPE": data[obj]["IMAGE_URL"] || null,
                "FDATA": data[obj]["FORMAT_DATA"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetOrgLocations: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "LOC_ID": data[obj]["LOCATION_ID"] || null,
                "LOC_CD": data[obj]["LOCATION_CD"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "LOC_DESC": data[obj]["LOCATION_DESC"] || null,
                "IMTYPE": data[obj]["IMAGE_URL"] || null,
                "FDATA": data[obj]["FORMAT_DATA"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetOrgAsistant: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "EMP_ID": data[obj]["EMPLOYEE_ID"] || null,
                "EMP_NAME": data[obj]["EMPLOYEE_CD"] || null,
                "DIS_NAME": data[obj]["DISPLAY_NAME"] || null,
                "IMG_URL": data[obj]["IMAGE_URL"] || null,
                "FDATA": data[obj]["FORMAT_DATA"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDocSrchByNmSpcl: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "RSRC_NAME": data[obj]["DOCTOR_NAME"] || null,
                "SPCLNM": data[obj]["SPECILIZATION"] || null,
                "REFERENCE_TYPE_ID": data[obj]["REFERENCE_TYPE_ID"] || null,
                "SPECIALITY_ID": data[obj]["SPECIALITY_ID"] || null,
                "IMGURL": data[obj]["DOCTOR_IMAGE_URL"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "LOCATION": data[obj]["LOCATION"] || null,
                "SPECILIZATION_LOCATION": data[obj]["SPECILIZATION_LOCATION"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetModDoc: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DOC_ID": data[obj]["DOC_ID"] || null,
                "DOC_NAME": data[obj]["DOC_NAME"] || null,
                "MOD_ID": data[obj]["MODULE_ID"] || null,
                "MOD_NAME": data[obj]["MODULE_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    Get_User_Doc_Access: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "DOC_ID": data[obj]["DOC_ID"] || null,
                "DOC_NAME": data[obj]["DOC_NAME"] || null,
                "DOC_DESC": data[obj]["DOC_DESC"] || null,
                "DOC_TYPE_ID": data[obj]["DOC_TYPE_ID"] || null,
                "MOD_ID": data[obj]["MODULE_ID"] || null,
                "MOD_NAME": data[obj]["MODULE_DESC"] || null,
                "ADD": data[obj]["ACCESS_ADD"] || null,
                "MOD": data[obj]["ACCESS_MOD"] || null,
                "DEL": data[obj]["ACCESS_DEL"] || null,
                "QRY": data[obj]["ACCESS_QRY"] || null,
                "APP": data[obj]["ACCESS_APP"] || null,
                "EXE": data[obj]["ACCESS_EXE"] || null,
                "PRN_HDR": data[obj]["PRN_HEADER"] || null,
                "DMS_UPD": data[obj]["DMS_UPLOAD"] || null,
                "DMS_VW": data[obj]["DMS_VIEW"] || null,
                "BAR_COD": data[obj]["BARCODE"] || null,
                "CRTL_VAL": data[obj]["CRITICAL_VALUE"] || null,
                "PAGE_URL": data[obj]["PAGE_URL"] || null,
                "IMAGE_URL": data[obj]["IMAGE_URL"] || null,
                "GRID_URL": data[obj]["GRID_URL"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetUserModuleDocAll: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "ROLE_ID": data[obj]["ROLE_ID"] || null,
                "PRN_HEADER": data[obj]["PRN_HEADER"] || null,
                "DOC_ID": data[obj]["DOC_ID"] || null,
                "MOD_ID": data[obj]["MOD_ID"] || null,
                "ACC_ADD": data[obj]["ACCESS_ADD"] || null,
                "LOC_ID": data[obj]["LOC_ID"] || null,
                "ACC_MOD": data[obj]["ACCESS_MOD"] || null,
                "ACC_DEL": data[obj]["ACCESS_DEL"] || null,
                "ACC_QRY": data[obj]["ACCESS_QRY"] || null,
                "ACC_APP": data[obj]["ACCESS_APP"] || null,
                "ACC_EXE": data[obj]["ACCESS_EXE"] || null,
                "BARCODE": data[obj]["BARCODE"] || null,
                "CRITC_VALUE": data[obj]["CRITC_VALUE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDocByMod: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "MOD_NAM": data[obj]["MODULE_NAME"] || null,
                "DOC_ID": data[obj]["DOC_ID"] || null,
                "DOC_CD": data[obj]["DOC_CD"] || null,
                "DOC_NAM": data[obj]["DOC_NAME"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetDoctorScheduleSumm: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "A_TYP": data[obj]["ACCESS_TYPE"] || null,
                "APMNT_DT": data[obj]["APMNT_DT"] || null,
                "LOC_ID": data[obj]["LOCATION_ID"] || null,
                "LOC_NAME": data[obj]["LOCATION_NAME"] || null,
                "OLR_ID": data[obj]["OLR_ID"] || null,
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "RST_ID": data[obj]["RSRC_SCH_TIME_ID"] || null,
                "SLOT_DUR": data[obj]["SLOT_DURATION"] || null,
                "SFT": data[obj]["SLOT_FROM_TIME"] || null,
                "STT": data[obj]["SLOT_TO_TIME"] || null,
                "S_TYP": data[obj]["SLOT_TYPE"] || null
            });
        }
        data = null;
        return tempArr;
    },
    GetRsrcByOrg: (data) => {
        if (!data) return [];
        let tempArr = [];
        for (var obj in data) {
            tempArr.push({
                "RSRC_ID": data[obj]["RSRC_ID"] || null,
                "RSRC_NAME": data[obj]["RSRC_NAME"] || null,
                "IMAGE_URL": data[obj]["IMAGE_URL"] || null,
                "SPECIALIZATION": data[obj]["SPECIALIZATION"] || null
            });
        }
        data = null;
        return tempArr;
    },
    HoldSlot: (data) => {
        if (!data) return -1;
        return data[0] && data[0]["OP_COUNT"] ? data[0]["OP_COUNT"] : -1;
    },
    Get_Organization: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SNO": obj.SNO || null,
                "ORG_ID": obj.ORG_ID || null,
                "ORG_CD": obj.ORG_CD || null,
                "ORG_NAME": obj.ORG_NAME || null,
                "ORG_DESC": obj.ORG_DESC || null,
                "CONTACT_PERSON": obj.CONTACT_PERSON || null,
                "REC_STATUS": obj.RECORD_STATUS || null,
                "DISPLAY_NAME": obj.DISPLAY_NAME || null,
                "IS_REGISTERED": obj.IS_REGISTERED || null,
                "IS_LISTED": obj.IS_LISTED || null,
                "DEFAULT_ACCT_ID": obj.DEFAULT_ACCT_ID || null,
                "NATURE_OF_BUSINESS_ID": obj.NATURE_OF_BUSINESS_ID || null,
                "NO_OF_LOCATIONS": obj.NO_OF_LOCATIONS || null,
                "ADDRESS1": obj.ADDRESS1 || null,
                "ADDRESS2": obj.ADDRESS2 || null,
                "CITY_ID": obj.CITY_ID || null,
                "COUNTRY_ID": obj.COUNTRY_ID || null,
                "STATE_ID": obj.STATE_ID || null,
                "OFFICE_PHONE": obj.OFFICE_PHONE || null,
                "HOME_PHONE": obj.HOME_PHONE || null,
                "MOBILE_PHONE": obj.MOBILE_PHONE || null,
                "FAX_NUMBER": obj.FAX_NUMBER || null,
                "EMAIL_ID": obj.EMAIL_ID || null,
                "WEBSITE_URL": obj.WEBSITE_URL || null,
                "ZIPCODE": obj.ZIPCODE || null,
                "IS_PRIMARY": obj.IS_PRIMARY || null,
                "ADDR_TYPE_ID": obj.ADDR_TYPE_ID || null,
                "ADDR_GRP_ID": obj.ADDR_GRP_ID || null,
                "REF_ID": obj.REFERENCE_ID || null,
                "REF_TYP_ID": obj.REFERENCE_TYPE_ID || null,
                "AREA_ID": obj.AREA_ID || null,
                "AREA_NAME": obj.AREA_NAME || null,
                "CITY_NAME": obj.CITY_NAME || null,
                "STATE_NAME": obj.STATE_NAME || null,
                "COUNTRY_NAME": obj.COUNTRY_NAME || null,
                "IMAGE_URL": obj.IMAGE_URL || null,
                "ORG_KEY": obj.ORG_KEY || null,
                "DEF_CURRENCY_ID": obj.DEFAULT_CURRENCY_ID || null,
                "CORP_PKG_ALL": obj.CORP_PKG_ALL || null,
                "ORG_PAT_FORMAT": obj.ORG_PAT_FORMAT || null

            });
        })
        data = null;
        return tempArr;
    },
    getDesignationList: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "DESG_ID": obj.DESIGNATION_ID || null,
                "DESG_CD": obj.DESIGNATION_CD || null,
                "DESG_NAME": obj.DESIGNATION_NAME || null,
                "DESG_DESC": obj.DESIGNATION_DESC || null
            });
        })
        data = null;
        return tempArr;
    },
    Get_Specialization: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "ID": obj.SPECIALIZATION_ID || null,
                "CD": obj.SPECIALIZATION_CD || null,
                "NAME": obj.SPECIALIZATION_NAME || null,
                "DESC": obj.SPECIALIZATION_DESC || null
            });
        })
        data = null;
        return tempArr;
    },
    GetbankDetails: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "BANK_ID": obj.BANK_ID || null,
                "BANK_CD": obj.BANK_CD || null,
                "BANK_DESC": obj.BANK_DESC || null,
                "BANK_NAME": obj.BANK_NAME || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoAllergies: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "ID": data[obj]["ALLERGY_ID"] || null,
                "NAME": data[obj]["ALLERGY_NAME"] || null,
                "Chcked": data[obj]["chcked"] || null
            });
        })
        data = null;
        return tempArr;
    },
    GetComplaintsAuto: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "COMP_ID": obj.COMPLAINT_ID || null,
                "COMP_CD": obj.COMPLAINT_CD || null,
                "RSRC_ID": obj.RSRC_ID || null,
                "COMP_NAME": obj.COMPLAINT_NAME || null,
                "Chcked": obj.chcked || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoAllergies: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "ID": obj.ALLERGY_ID || null,
                "NAME": obj.ALLERGY_NAME || null,
                "Chcked": obj.chcked || null
            });
        })
        data = null;
        return tempArr;
    },
    GetSrvGroup: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SRV_GRP_ID": obj.SERVICE_GROUP_ID || null,
                "SRV_GRP_CD": obj.SERVICE_GROUP_CD || null,
                "SRV_GRP_NAME": obj.SERVICE_GROUP_NAME || null,
                "SRV_GRP_DESC": obj.SERVICE_GROUP_DESC || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAllServcs: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SRV_ID": obj.SERVICE_ID || null,
                "SRV_NAME": obj.SERVICE_NAME || null,
                "PRICE": obj.PRICE || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoComplete: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "COL1": obj.COL1 || null,
                "COL2": obj.COL2 || null,
                "COL3": obj.COL3 || null,
                "COL4": obj.COL4 || null,
                "COL5": obj.COL5 || null,
                "COL6": obj.COL6 || null,
                "COL7": obj.COL7 || null,
                "COL8": obj.COL8 || null,
                "COL9": obj.COL9 || null,
                "COL10": obj.COL10 || null,
                "COL11": obj.COL11 || null,
                "COL12": obj.COL12 || null,
                "COL13": obj.COL13 || null,
                "COL14": obj.COL14 || null,
                "COL15": obj.COL15 || null,
                "COL16": obj.COL16 || null,
                "COL17": obj.COL17 || null,
                "COL18": obj.COL18 || null,
                "COL19": obj.COL19 || null,
                "COL20": obj.COL20 || null

            });
        });
        data = null;
        return tempArr;
    },
    GetPADocLocSlotDetails: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "OLRXID": obj.OLR_ID || null,
                "SLID": obj.SLOTS_ID || null,
                "APMNT_DT": obj.APMNT_DT || null,
                "SID": obj.STATUS_ID || null,
                "SCH_STRT_TIME": obj.SCH_START_TIME || null,
                "PNAME": obj.PATIENT_NAME || null,
                "QNO": obj.Q_NO || null,
                "DTIME": obj.DISPLAY_TIME || null,
                "COL9": obj.COL9 || null,
                "SLTYPE": obj.SLOT_TYPE || null,
                "UHR": obj.UHR_NO || null,
                "UMR_NO": obj.UMR_NO || null,
                "IS_CLINICAL": obj.IS_CLINICAL || null,
                "CNSLT_TYPE_NAME": obj.CONSULTATION_TYPE_NAME || null,
                "PAT_REF_TYPE_ID": obj.PAT_REFERENCE_TYPE_ID || null,
                "STATUS": obj.STATUS || null,
                "APMNT_TYPE": obj.APMNT_TYPE_CD || null,
                "LAB_STATUS": obj.VIEW_STATUS || null,
                "Q_TIME": obj.Q_TIME || null,
                "PTYPECD": obj.PATIENT_TYPE_CD || null,
                "FIR_VIST": obj.FIRST_VISIT || null,
                "IS_VIP": obj.IS_VIP || null,
                "IS_ADM_SUGG": obj.IS_ADM_SUGG || null,
                "PRIORITY": obj.PRIORITY || null,
                "VISIT_TYPE": obj.VISIT_TYPE || null,
                "IS_ADDED_SLOT": obj.IS_ADDED_SLOT || null,
                "PATIENT_TYPE": obj.PATIENT_TYPE || null
            });
        })
        data = null;
        return tempArr;
    },
    GetRsrcByref: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "RSRC_ID": obj.RSRC_ID || null,
                "RSRC_CD": obj.RSRC_CD || null,
                "RSRC_NAME": obj.RSRC_NAME || null,
                "IS_ADMIN": obj.IS_ADMIN || null,
                "IMAGE_URL": obj.IMAGE_URL || null

            });
        })
        data = null;
        return tempArr;
    },
    getUsrLocOrg: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "OLR_ID": obj.OLR_ID || null,
                "ORG_ID": obj.ORG_ID || null,
                "ORG_NAME": obj.ORG_NAME || null,
                "LOC_ID": obj.LOC_ID || null,
                "LOC_NAME": obj.LOCATION_NAME || null,
                "API_URL": obj.API_URL || null,
                "DMS_URL": obj.DMS_URL || null,
                "DS_URL": obj.DS_URL || null,
                "PACKS_URL": obj.PACKS_URL || null,
                "DMS": obj.DMS || null,
                "DS": obj.DS || null,
                "PACS": obj.PACS || null,
                "STOP_CONS": obj.STOP_CONS || null,
                "TEXT_SMS": obj.TEXT_SMS || null,
                "VOICE_SMS": obj.VOICE_SMS || null,
                "EMAIL": obj.EMAIL || null,
                "REPLY_EMAIL": obj.REPLY_EMAIL || null,
                "DATE_FMT": obj.FORMAT_NAME || null,
                "DATE_DESC": obj.FORMAT_DESC || null,
                "CHK_PHRMCY_STK": obj.CHK_PHRMCY_STK || null,
                "DELAY_SMS": obj.DELAY_SMS || null,
                "DELAY_SMS_TEXT": obj.DOCTOR_DELAY_MSG_TEXT || null,
                "CRM_INTG": obj.CRM_INTG || null,
                "CHANGE_SLOT_TYPE": obj.CHANGE_SLOT_TYPE || null,
                "CHG_SLOT_PRTY": obj.CHG_SLOT_PRTY || null,
                "FREE_REG": obj.FREE_REG || null,
                "OPEN_SLOT_TYPE": obj.OPEN_SLOT_TYPE || null,
                "ORG_ITEM_MSTR": obj.ORG_ITEM_MASTER || null,
                "ORG_SRVC_MSTR": obj.ORG_SRVC_MASTER || null,
                "REG_PAY": obj.REG_PAY || null,
                "SRVC_PAY": obj.SRVC_PAY || null,
                "SUGG_LAB": obj.SUGG_LAB || null,
                "SUGG_PHARMACY": obj.SUGG_PHARMACY || null,
                "LOC_PAT_FORMAT": obj.LOC_PAT_FORMAT || null,
                "ORG_PAT_FORMAT": obj.ORG_PAT_FORMAT || null,
                "UMR_LVL": obj.UMR_LVL || null,
                "LAB_RPT": obj.LAB_RPT || null,
                "VITALS_PRMSN": obj.VISIT_DTLS_PRMSN || null,
                "PAT_WAIT_ALERT": obj.PAT_WAIT_ALERT || null,
                "HLTH_CHK_REM": obj.HLTH_CHK_REM || null,
                "CC_TURNUP_ALERT": obj.CC_TURNUP_ALERT || null,
                "FAV_ORD_FLOAT": obj.FAV_ORD_FLOAT || null,
                "RPT_WM_IMG": obj.RPT_WM_IMG || null,
                "OT_URL": obj.OT_URL || null,
                "OP_CASESHEET": obj.OP_CASESHEET || null,
                "OT_ICON": obj.OT_ICON || null,
                "ASSMNT_REP_HDR": obj.ASSMNT_REP_HDR || null,
                "ASSMNT_REP_HI_WI": obj.ASSMNT_REP_HI_WI || null,
                "CRM_URL": obj.CRM_URL || null,
                "DISPLY_TEXT": obj.DISPLY_TEXT || null

            });
        })
        data = null;
        return tempArr;
    },
    GetUsersAuto: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "LOC_ID": obj.LOC_ID || null,
                "USER_ID": obj.USER_ID || null,
                "USER_NAME": obj.USER_NAME || null
            });
        })
        data = null;
        return tempArr;
    },
    Get_Org_Loc_Rsrc: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "RSRC_ID": obj.RSRC_ID || null,
                "RSRC_NAME": obj.RSRC_NAME || null,
                "RSRC_URL": obj.RSRC_URL || null,
                "SPLZN": obj.SPECILIZATION || null,
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoInvest: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SERV_ID    ": obj.SERVICE_ID || null,
                "SERV_NAME": obj.SERVICE_NAME || null,
                "SERV_TYP_ID": obj.SERVICE_TYPE_ID || null,
                "SERV_TYP_NAME": obj.SERVICE_TYPE_NAME || null,
                "SERV_CODE": obj.SERVICE_CD || null,
                "PRICE": obj.PRICE || null,
                "DURA": obj.DURATION || null,
                "QTY": obj.QTY || null,
                "SERV_CLAS_ID": obj.SERVICECLASS_ID || null,
                "FLAG": obj.ITEM_FROM || null,
                "INSTRUC": obj.INSTRUCTION || null,
                "MAND_INSTRUC": obj.MANDATORY_INSTRUCTION || null,
                "SRV_GUIDELINES": obj.IS_SRV_GUIDELINES_REQUIRED || null,
                "SRV_CHECKLIST": obj.CHECKLIST_PRINT_FORM_NAME || null,
                "SRV_REQUISITE": obj.PRE_REQUIST_NOTE || null,
                "CONSENT_FORM": obj.CONSENT_FORM || null,
                "SRV_TEMP_ID": obj.SERVICE_QUESTION_TEMPLATE_ID || null,
                "NO_DAYS": obj.NUM_OF_DAYS || null,
                "FROM_AGE": obj.FROM_AGE || null,
                "TO_AGE": obj.TO_AGE || null,
                "FLAG_ID": obj.FLAG || null,
                "SRV_GENDER_CD": obj.SRV_GENDER_CD || null,
                "FOREIGN_SRV": obj.IS_FOREIGN_SERVICE || null,
            });
        })
        data = null;
        return tempArr;
    },
    GetMedications: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "MRN_NO": obj.MRN_NO || null,
                "VIST_DT": obj.MRN_NO || null,
                "SNO": obj.SNO || null,
                "REC_TYP_ID": obj.RECORD_TYPE_ID || null,
                "MEDIC_ID": obj.MEDICATION_ID || null,
                "MEDIC_NAME": obj.MEDICATION_NAME || null,
                "DAYS": obj.DAYS || null,
                "DOS_MAS_ID": obj.DOSAGE_MASTER_ID || null,
                "DRUG_DOSE": obj.DOSAGE || null,
                "DOS_UNT_ID": obj.DOSAGE_UNIT_ID || null,
                "DOS_DESC": obj.DOSAGE_DESC || null,
                "MEDIC_TAK_ID": obj.MEDICATION_TAKEN_ID || null,
                "MEDIC_TAK_NAME": obj.MEDICATION_TAKEN_NAME || null,
                "HOW_TAK": obj.HOW_OFTEN_TAKEN || null,
                "RESN_TAK": obj.REASON_FOR_TAKING || null,
                "REF_ID": obj.REFERENCE_ID || null,
                "PRVDR_ID": obj.PROVIDER_CONTACT_ID || null,
                "PRVDR_NAME": obj.PROVIDER_CONTACT_NAME || null,
                "INSTRUC": obj.INSTRUCTIONS || null,
                "NOTS": obj.NOTES || null,
                "BILL_STA": obj.BILL_STATUS || null,
                "PRVDR_NAME": obj.PROVIDER_CONTACT_NAME || null,
                "FRE_ID": obj.FREQUENCY_ID || null,
                "FRE_DESC": obj.FREQUENCY_DESC || null,
                "CONTXT": obj.CONTEXT || null,
                "FLAG": obj.ITEM_FROM || null,
                "STOP": obj.STOP_MEDI || null,
                "I_MED_ID": obj.I_MEDICATION_ID || null,
                "STOP_RESN": obj.STOP_MEDI_DESC || null,
                "MDY_BY": obj.MODIFY_BY || null,
                "MDY_DT": obj.MODIFY_DT || null,
                "CRT_BY": obj.CREATE_BY || null,
                "CRT_DT": obj.CREATE_DT || null,
                "SEQ_ORDR": obj.SEQ_ORDER || null,
                "QTY": obj.QTY || null,
                "GENERIC_NAME": obj.GENERIC_NAME || null,
                "ROUTE_MEDICATION": obj.ROUTE_MEDICATION || null,
                "MEDICATION_TYPE": obj.MEDICATION_TYPE || null,
                "DRUG_SCHEDULE": obj.DRUG_SCHEDULE || null,
                "STRENGTH": obj.STRENGTH || null,
                "CAN_RSN": obj.CANCEL_REASON || null,
                "DURATION": obj.DURATION || null,
                "DURATION_TYPE": obj.DURATION_TYPE || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoMedications: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "MEDIC_ID": obj.MEDICATION_ID || null,
                "MEDIC_NAME": obj.MEDICATION_NAME || null,
                "MEDIC_DESC": obj.MEDICATION_DESC || null,
                "FRM_TYP": obj.FORM_TYPE || null,
                "MEDSPAN_ID": obj.MEDSPAN_ID || null,
                "I_MED_ID": obj.I_MEDICATION_ID || null,
                "FLAG": obj.ITEM_FROM === 'I' ? true : false,
                "FREQ_ID": obj.FREQUENCY_ID || null,
                "FREQ_DESC": obj.FREQUENCY_DESC || null,
                "INSTRCUTION": obj.INSTRUCTION || null,
                "DAYS": obj.DAYS || null,
                "DRUG_SCHEDULE": obj.DRUG_SCHEDULE || null,
                "DRUG_DOSE": obj.DRUG_DOSE || null,
                "FLAG_ID": obj.FLAG || null
            });
        })
        data = null;
        return tempArr;
    },
    GetAutoFavInvest: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "INVEST_ID": obj.INVS_ID || null,
                "RSRC_ID": obj.RSRC_ID || null,
                "SERV_NAME": obj.SERVICE_NAME || null,
                "SERV_TYP_NAME": obj.SERVICE_TYPE_NAME || null,
                "SERV_CD": obj.SERVICE_CD || null,
                "IS_FAV": obj.IS_FAVOURITES || null,
                "SERV_CLAS_ID": obj.SERVICECLASS_ID || null,
                "PRICE": obj.PRICE || null,
                "MAND_INSTRUC": obj.MAND_INSTRUCTION || null,
                "SERV_GROUP_ID": obj.FLAG || null
            });
        })
        data = null;
        return tempArr;
    },
    getAdvrtseImg: (data) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.AD_IMG_ID = obj.AD_IMG_ID;
            obj.IMAGE_URL = obj.IMAGE_URL;
        });
        return data;
    },
    getComplaints: (data) => {
        if (!data) return [];
        data.forEach(obj => {
            obj.SNO = obj.SNO;
            obj.MRN_NO = obj.MRN_NO;
            obj.VIST_DT = obj.VISIT_DT;
            obj.REF_ID = obj.REFERENCE_ID;
            obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
            obj.REC_TYP_ID = obj.RECORD_TYPE_ID;
            obj.COMP_TYP_ID = obj.COMPLAINT_TYPE_ID;
            obj.COMP_TYP_NAME = obj.COMP_TYPE_NAME;
            obj.COMP_ID = obj.COMPLAINT_ID;
            obj.COMP_NAME = obj.COMPLAINT_NAME;
            obj.REF_ID = obj.REFERENCE_ID;
            obj.REF_TYP_ID = obj.REFERENCE_TYPE_ID;
            obj.REC_TYP_ID = obj.RECORD_TYPE_ID;
            obj.COMP_STA = obj.COMPLAINT_STATUS;
            obj.DURA = (obj.DURATION == 0 ? "" : obj.DURATION);
            obj.PERID = obj.PERIOD_ID;
            obj.PERID_NAME = obj.PERIOD_NAME;
            obj.PRVDR_ID = obj.PROVIDER_CONTACT_ID;
            obj.PRVDR_NAME = obj.PROVIDER_CONTACT_NAME;
            obj.NOTS = obj.NOTES;
            obj.REC_STA = 'A';
            obj.MDY_BY = obj.MODIFY_BY;
            obj.MDY_DT = obj.MODIFY_DT;
            obj.CRT_BY = obj.CREATE_BY;
            obj.CRT_DT = obj.CREATE_DT;
        });
        return data;
    },
    GetPrfileSetupDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "PROF_ID": obj.PROFILE_ID || null,
                "PROF_NAME": obj.PROFILE_NAME || null,
                "SNO": obj.SNO || null,
                "ITEM_ID": obj.ITEM_ID || null,
                "ITEM_NAME": obj.ITEM_NAME || null,
                "INSTR": obj.INSTRUCTION || null,
                "FLAG": obj.ITEM_FROM || null
            });
        });
        data = null;
        return tempArr;
    },
    GetSlotConsultation: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SLOT_ID": obj.SLOT_ID || null,
                "CHILD_SLOT_ID": obj.CHILD_SLOT_ID || null,
                "MAIN_VIST_DT": obj.MAIN_VISIT_DT || null,
                "CHILD_VIST_DT": obj.CHILD_VISIT_DT || null,
                "REPRT_DATA": obj.REPORT_DATA || null

            });
        });
        data = null;
        return tempArr;
    },
    GetFrequencies: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "FORM_TYPE": obj.FORM_TYPE || null,
                "FRE_DESC": obj.FREQUENCY_DESC || null,
                "FRE_ID": obj.FREQUENCY_ID || null,
                "QUANT": obj.QUANTITY || null,
                "REPRT_DATA": obj.IL3_ID || null

            });
        });
        data = null;
        return tempArr;
    },
    GetDocFavHealthCondtin: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "MC_ID": obj.MC_ID || null,
                "ICD_CD": obj.ICD_CODE || null,
                "CONDITION_NAME": obj.CONDITION_NAME || null,
                "RSRC_ID": obj.RSRC_ID || null,
                "IS_FAV": obj.IS_FAVOURITES || null
            });
        });
        data = null;
        return tempArr;
    },
    GetUserPreferences: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "PREF_TYP_ID": obj.COM_PREFER_TYPE_ID || null,
                "PREF_TYP_NAME": obj.COM_PREFER_TYPE_NAME || null,
                "SNO": obj.SNO || null,
                "PREF_NAME": obj.COM_PREFER_NAME || null,
                "MOBIL": obj.MOBILE || null,
                "EMAIl": obj.EMAIL || null,
                "USER_ID": obj.USER_ID || null
            });
        });
        data = null;
        return tempArr;
    },
    GetUserPreferences: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "DOC_HELP_ID": obj.DOC_ID || null,
                "DOC_HELP_DESC": obj.DOC_HELP_DESC || null,
                "MANUAL_HELP_DESC": obj.MANUAL_HELP_DESC || null,
                "DB_HELP_DESC": obj.DB_HELP_DESC || null,
                "DOC_NAME": obj.DOC_NAME || null
            });
        });
        data = null;
        return tempArr;
    },
    getSpecilizationAuto: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "SPEC_ID": obj.SPECIALIZATION_ID || null,
                "SPEC_CD": obj.SPECIALIZATION_CD || null,
                "SPEC_NAME": obj.SPECIALIZATION_NAME || null,
                "SPEC_DESC": obj.SPECIALIZATION_DESC || null,
                "IMAGE_ID": obj.IMAGE_ID || null,
                "IMAGE_URL": obj.IMAGE_URL || null
            });
        });
        data = null;
        return tempArr;
    },
    GetFaque: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "MOD_ID": obj.MODULE_ID || null,
                "MOD_NAME": obj.MODULE_NAME || null,
                "FAQ_GRP_ID": obj.FAQ_GROUP_ID || null,
                "FAQ_GRP_NAME": obj.FAQ_GROUP_NAME || null,
                "REF_TYPE_NAME": obj.REFERENCE_TYPE_NAME || null,
                "REF_TYPE_ID": obj.REFERENCE_TYPE_ID || null,
                "SNO": obj.SNO || null,
                "QUESTION": obj.QUESTION || null,
                "ANSWER": obj.ANSWER || null
            });
        });
        data = null;
        return tempArr;
    },
    GetHeltConditin: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "MRN_NO": obj.MRN_NO || null,
                "VIST_DT": obj.VISIT_DT || null,
                "SNO": obj.SNO || null,
                "REC_TYP_ID": obj.RECORD_TYPE_ID || null,
                "MC_ID": obj.MC_ID || null,
                "ICD_CD": obj.ICD_CODE || null,
                "COND_NAM": obj.CONDITION_NAME || null,
                "COND_STA_CD": obj.CONDITION_STATUS_ID || null,
                "STRT_DT": obj.START_DT || null,
                "END_DT": obj.END_DT || null,
                "REF_ID": obj.REFERENCE_ID || null,
                "REF_TYP_ID": obj.REFERENCE_TYPE_ID || null,
                "PRVDR_ID": obj.PROVIDER_CONTACT_ID || null,
                "IT_END": obj.HOW_IT_ENDED || null,
                "NOTS": obj.NOTES || null,
                "DURA": obj.DURATION || null,
                "DURA": obj.DURA == "0" ? '' : obj.DURA,
                "PERID_NAME": obj.PERIOD_NAME || null,
                "PERID": obj.PERIOD || null,
                "MDY_BY": obj.MODIFY_BY || null,
                "MDY_DT": obj.MODIFY_DT || null,
                "CRT_BY": obj.CREATE_BY || null,
                "CRT_DT": obj.CREATE_DT || null,
                "PRVDR_NAME": obj.PROVIDER_CONTACT_NAME || null
            });
        });
        data = null;
        return tempArr;
    },
    GetAutoCond: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "COND_ID": obj.CONDITIONS_MASTER_ID || null,
                "MC_ID": obj.MC_ID || null,
                "ICD_CD": obj.ICD_CODE || null,
                "COND_NAM": obj.CONDITION_NAME || null,
                "COND_DESC": obj.CONDITION_DESC || null,
                "FLAG_ID": obj.FLAG || null
            });
        });
        data = null;
        return tempArr;
    },
    GetClinicDet: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "HEAD_ID": obj.VD_DOC_DEF_CLINICAL_HEAD_ID || null,
                "VIST_DT": obj.VISIT_DT || null,
                "OLR_ID": obj.OLR_ID || null,
                "HEADING_DESC": obj.HEADING_DESC || null,
                "DESC": obj.DESCRIPTION || null,
                "P_DESC": obj.DESCRIPTION || null,
                "SNO": obj.SNO || null,
                "PRVDR_ID": obj.PROVIDER_CONTACT_ID || null,
                "PRVDR_NAME": obj.PROVIDER_CONTACT_NAME || null,
                "REF_ID": obj.REFERENCE_ID || null,
                "MDY_BY": obj.MODIFY_BY || null,
                "MDY_DT": obj.MODIFY_DT || null,
                "CRT_BY": obj.CREATE_BY || null,
                "CRT_DT": obj.CREATE_DT || null
            });
        });
        data = null;
        return tempArr;
    },
    GetOlrPatSrch: (data) => {
        if (!data) return [];
        let tempArr = [];
        data.forEach(obj => {
            tempArr.push({
                "UHR_NO": obj.UHR_NO || null,
                "DISPLAY_NAME": obj.DISPLAY_NAME || null,
                "MOBILE": obj.MOBILE_NO1 || null,
                "UMR_NO": obj.UMR_NO || null,
                "PAT_ID": obj.PATIENT_ID || null
            })
        })
        data = null;
        return tempArr;
    },
    UpdSlot: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            if (!data) return null;
            return data && data[0] && data[0].ID ? data[0].ID : null;
        }
        return data;
    },
    Cancel_Slot: (data, isLoadAjax) => {
        if (isLoadAjax === 'Y') {
            if (!data) return null;
            return data && data[0] && data[0].STATUS && data[0].STATUS == 1 ? true : false;
        }
        return data;
    }
}
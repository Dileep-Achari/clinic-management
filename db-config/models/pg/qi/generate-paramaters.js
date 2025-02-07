module.exports = {
    insUpdOperTheater: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        } else params = {};

        params.operation_theater_info = JSON.stringify([params]);
        return params;
    },
    insUpdQiBed: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.qi_bed = JSON.stringify([params]);
        return params;
    },
    insUpdEntity: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.entity_json = JSON.stringify([params]);
        return params;
    },
    insUpdDefChkInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (params[val] === 0 || params[val] === '0') {
                    params[val] = 0;
                }
                else {
                    if (!params[val]) params[val] = null;
                }
            }
        }
        else params = {};
        params.deficiency_checklist_info = JSON.stringify([params]);
        return params;
    },
    insUpdIndctrMonDta: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.indi_monthly_data_info = JSON.stringify([params]);
        return params;
    },
    insUpdIndctTranInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.indc_ansthes_tran_info = JSON.stringify([params]);
        return params;
    },
    insUpdEleWtrCon: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.elec_water_consumtn = JSON.stringify([params]);
        return params;
    },
    insUpdCrtlEquWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.critical_equipment_info = JSON.stringify([params]);
        return params;
    },
    insUpdEquMas: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.equipment_master = JSON.stringify([params]);
        return params;
    },
    uploadImage: (params, cParams) => {
        if (params && params.img_binary) {
            //params.img_binary = "\\x" + new Buffer.from(params.img_binary, "base64").toString('hex');
        }

        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.images = JSON.stringify([params]);
        return params;
    },
    insUpdEmpWrkngDignWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.emp_working_dign_wrkp_info = JSON.stringify([params]);
        return params;
    },
    insUpdBioMedEngSrvWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.bio_medical_engg_service_wrkp_info = JSON.stringify([params]);
        return params;
    },
    // insUpdIndctTranInfo: (params, cParams) => {
    //     if (params && Object.keys(params) && Object.keys(params).length > 0) {
    //         for (let val in params) {
    //             if (!params[val]) params[val] = null;
    //         }
    //     }
    //     else params = {};
    //     params.indc_asmnt_tran_info = JSON.stringify([params]);
    //     return params;
    // },
    insUpdAsmntWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.assessment_wrkp_info = JSON.stringify([params]);
        return params;
    },
    insUpdPrcRepCliDiagWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.percentage_of_rep_clincal_dignosis_wrkp_info = JSON.stringify([params]);
        return params;
    },
    // insUpdHandHygenWrkpInfo: (params, cParams) => {
    //     if (params && Object.keys(params) && Object.keys(params).length > 0) {
    //         for (let val in params) {
    //             if (!params[val]) params[val] = null;
    //         }
    //     }
    //     else params = {};
    //     params.hand_hygen_json = JSON.stringify([params]);
    //     return params;
    // },
    insUpdIndTran: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.json_value = JSON.stringify([params]);
        return params;
    },
    insUpdNumRepErs: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		//for mobile app only use this condition
        if(params.flag!='undefined'&&params.flag=='mob') return params
        params.num_rep_errors = JSON.stringify([params]);
        return params;
    },
    insUpdIncdntRptng: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
		if(params.mode!='undefined'&&params.mode=='mob') return params
        params.incident_reporting_info = JSON.stringify([params]);
        return params;
    },
    insUpdInfCtrlWrkpInfo: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.infection_control_wrkp_info = JSON.stringify([params]);
        return params;
    },
    insUpdInftnSrvlnc: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.infection_surveilance_info = JSON.stringify([params]);
        return params;
    },
    insUpdEmployee: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.employee_information_info_json = JSON.stringify([params]);
        return params;
    },
    insUpdInfctionSurv: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (params[val] === 0 || params[val] === '0') {
                    params[val] = 0;
                }
                else {
                    if (!params[val]) params[val] = null;
                }
            }
        }
        else params = {};
        params.infection_surveilance_info = JSON.stringify([params]);
        return params;
    },
    insUpdMedicErr: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (params[val] === 0 || params[val] === '0') {
                    params[val] = 0;
                }
                else {
                    if (!params[val]) params[val] = null;
                }
            }
        }
        else params = {};
        params.medic_error_report = JSON.stringify([params]);
        return params;
    }
}
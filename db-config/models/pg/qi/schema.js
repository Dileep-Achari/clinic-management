module.exports = {
    insUpdOperTheater: {
        SpName: "upr_insupd_operation_theater_info",
        Schema: [{ type: "json", column: "operation_theater_info", direction: "IN", alias: "par_operation_theater_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getOperTheater: {
        SpName: "upr_get_operation_theater_info",
        Schema: [{ type: "integer", column: "ot_id", direction: "IN", alias: "par_ot_id" },
        { type: "character", column: "ot_cd", direction: "IN", alias: "par_ot_cd" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "text", column: "remarks_any", direction: "IN", alias: "par_remarks_any" },
        { type: "character", column: "tran_status", direction: "IN", alias: "par_tran_status" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "character", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getQiBed: {
        SpName: "upr_get_qi_bed",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdQiBed: {
        SpName: "upr_insupd_qi_bed",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "json", column: "qi_bed", direction: "IN", alias: "par_qi_bed" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdEntity: {
        SpName: "upr_insupd_entity",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "json", column: "entity_json", direction: "IN", alias: "par_entity_json" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getEntity: {
        SpName: "upr_get_entity",
        Schema: [{ type: "bigint", column: "entity_id", direction: "IN", alias: "par_entity_id" },
        { type: "character", column: "entity_cd", direction: "IN", alias: "par_entity_cd" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getMasterData: {
        SpName: "upr_get_master_data",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_ip_session_id" }],
        Server: "PG", Database: "QI"
    },
    getOtSurgeryMast: {
        SpName: "upr_get_qi_ot_surgery",
        Schema: [{ type: "integer", column: "surgery_id", direction: "IN", alias: "par_surgery_id" },
        { type: "character", column: "surgery_cd", direction: "IN", alias: "par_surgery_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getOtTheaterMast: {
        SpName: "upr_get_qi_ot_theatre",
        Schema: [{ type: "integer", column: "theatre_id", direction: "IN", alias: "par_theatre_id" },
        { type: "character", column: "ot_cd", direction: "IN", alias: "par_ot_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_ip_session_id" }],
        Server: "PG", Database: "QI"
    },
    getPatSearch: {
        SpName: "upr_get_patient_search",
        Schema: [{ type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "character", column: "mobile_number", direction: "IN", alias: "par_mobile_number" },
        { type: "character", column: "patient_name", direction: "IN", alias: "par_patient_name" },
        { type: "character", column: "doctor_name", direction: "IN", alias: "par_doctor_name" },
        { type: "character", column: "from_date", direction: "IN", alias: "par_from_date" },
        { type: "character", column: "to_date", direction: "IN", alias: "par_to_date" },
        { type: "character", column: "ward", direction: "IN", alias: "par_ward" },
        { type: "character", column: "bed", direction: "IN", alias: "par_bed" },
        { type: "character", column: "consultation_no", direction: "IN", alias: "par_consultation_no" },
        { type: "character", column: "nrs_statn", direction: "IN", alias: "par_nrs_statn" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_ip_session_id" }],
        Server: "PG", Database: "QI"
    },
    getPatDet: {
        SpName: "upr_get_pat_det",
        Schema: [{ type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "character", column: "mobile_number", direction: "IN", alias: "par_mobile_number" },
        { type: "character", column: "patient_name", direction: "IN", alias: "par_patient_name" },
        { type: "character", column: "doctor_name", direction: "IN", alias: "par_doctor_name" },
        { type: "character", column: "from_date", direction: "IN", alias: "par_from_date" },
        { type: "character", column: "to_date", direction: "IN", alias: "par_to_date" },
        { type: "character", column: "ward", direction: "IN", alias: "par_ward" },
        { type: "character", column: "bed", direction: "IN", alias: "par_bed" },
        { type: "character", column: "consultation_no", direction: "IN", alias: "par_consultation_no" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_ip_session_id" }],
        Server: "PG", Database: "QI"
    },
    getDefChkInfo: {
        SpName: "upr_get_deficiency_checklist_info",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "nurse_station", direction: "IN", alias: "par_nurse_station" },
        { type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "character", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "uuid", column: "dc_id", direction: "IN", alias: "par_dc_id" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdDefChkInfo: {
        SpName: "upr_insupd_deficiency_checklist_info",
        Schema: [{ type: "json", column: "deficiency_checklist_info", direction: "IN", alias: "par_deficiency_checklist_info" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdFile: {
        SpName: "upr_insupd_file_info",
        Schema: [{ type: "json", column: "file_info", direction: "IN", alias: "par_file_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getFile: {
        SpName: "upr_get_file_info",
        Schema: [{ type: "character", column: "file_cd", direction: "IN", alias: "par_file_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getIndctrMonDta: {
        SpName: "upr_get_indicator_monthly_data",
        Schema: [{ type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "character", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "bigint", column: "imd_id", direction: "IN", alias: "par_imd_id" },
        { type: "uuid", column: "ind_uid", direction: "IN", alias: "par_ind_uid" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    insUpdIndctrMonDta: {
        SpName: "upr_insupd_indc_monthly_data_info",
        Schema: [{ type: "json", column: "indi_monthly_data_info", direction: "IN", alias: "par_indi_monthly_data_info" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getIndctTranInfo: {
        SpName: "upr_get_indc_qi_tran_info",
        Schema: [{ type: "character", column: "slno", direction: "IN", alias: "par_slno" },
        { type: "character", column: "stdcode", direction: "IN", alias: "par_stdcode" },
        { type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "character", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdIndctTranInfo: {
        SpName: "upr_insupd_indc_ansthes_tran_info",
        Schema: [{ type: "json", column: "indc_ansthes_tran_info", direction: "IN", alias: "par_indc_ansthes_tran_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getPatInfo: {
        SpName: "upr_get_patient_data",
        Schema: [{ type: "character", column: "admn_no", direction: "IN", alias: "par_ip_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_ip_umr_no" },
        { type: "integer", column: "session_id", direction: "IN", alias: "par_ip_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    insUpdEleWtrCon: {
        SpName: "upr_insupd_elec_water_consumtn",
        Schema: [{ type: "json", column: "elec_water_consumtn", direction: "IN", alias: "par_elec_water_consumtn" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getEleWtrCon: {
        SpName: "upr_get_elec_water_consumtn",
        Schema: [{ type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdCrtlEquWrkpInfo: {
        SpName: "upr_insupd_critical_equipment_wrkp_info",
        Schema: [{ type: "json", column: "critical_equipment_info", direction: "IN", alias: "par_critical_equipment_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getCrtlEquWrkpInfo: {
        SpName: "upr_get_critical_equipment_wrkp_info",
        Schema: [{ type: "character", column: "equ_cd", direction: "IN", alias: "par_equ_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdEquMas: {
        SpName: "upr_insupd_equipment_master",
        Schema: [{ type: "json", column: "equipment_master", direction: "IN", alias: "par_equipment_master" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getEquMas: {
        SpName: "upr_get_equipment_master",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "equ_cd", direction: "IN", alias: "par_equ_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdAsmntWrkpInfo: {
        SpName: "upr_insupd_assessment_json",
        Schema: [{ type: "json", column: "assessment_wrkp_info", direction: "IN", alias: "par_assessment_wrkp_info" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getAsmntWrkpInfo: {
        SpName: "upr_get_assessment_wrkp_info",
        Schema: [{ type: "character", column: "asmnt_cd", direction: "IN", alias: "par_asmnt_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    uprActiveInactive: {
        SpName: "upr_upd_active_inactive",
        Schema: [{ type: "character", column: "table", direction: "IN", alias: "par_table" },
        { type: "character", column: "value", direction: "IN", alias: "par_value" },
        { type: "character", column: "record_status", direction: "IN", alias: "par_record_status" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    updAppUnapp: {
        SpName: "upr_upd_approve_unapprove",
        Schema: [{ type: "character", column: "table", direction: "IN", alias: "par_table" },
        { type: "character", column: "value", direction: "IN", alias: "par_value" },
        { type: "character", column: "approved_status", direction: "IN", alias: "par_approved_status" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    //new
    insUpdEmpWrkngDignWrkpInfo: {
        SpName: "upr_insupd_emp_working_dign_wrkp_info",
        Schema: [{ type: "json", column: "emp_working_dign_wrkp_info", direction: "IN", alias: "par_emp_working_dign_wrkp_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getEmpWrkngDignWrkpInfo: {
        SpName: "upr_get_emp_working_dign_wrkp_info",
        Schema: [{ type: "character", column: "emp_cd", direction: "IN", alias: "par_emp_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getBioMedEngSrvWrkpInfo: {
        SpName: "upr_get_bio_medical_engg_service_wrkp_info",
        Schema: [{ type: "character", column: "bio_cd", direction: "IN", alias: "par_bio_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "years", direction: "IN", alias: "par_years" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdBioMedEngSrvWrkpInfo: {
        SpName: "upr_insupd_bio_medical_engg_service_wrkp_info",
        Schema: [{ type: "json", column: "bio_medical_engg_service_wrkp_info", direction: "IN", alias: "par_bio_medical_engg_service_wrkp_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdIndctTranInfo: {
        SpName: "upr_insupd_indc_ansthes_tran_info",
        Schema: [{ type: "json", column: "indc_ansthes_tran_info", direction: "IN", alias: "par_indc_ansthes_tran_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getPrcRepCliDiagWrkpInfo: {
        SpName: "upr_get_percentage_of_rep_clincal_dignosis_wrkp_info",
        Schema: [{ type: "character", column: "per_cd", direction: "IN", alias: "par_per_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdPrcRepCliDiagWrkpInfo: {
        SpName: "upr_insupd_percentage_of_rep_clincal_dignosis",
        Schema: [{ type: "json", column: "percentage_of_rep_clincal_dignosis", direction: "IN", alias: "par_percentage_of_rep_clincal_dignosis" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getHandHygenWrkpInfo: {
        SpName: "upr_get_hand_hygen_form_wrkp_info",
        Schema: [{ type: "character", column: "hand_cd", direction: "IN", alias: "par_hand_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdHandHygenWrkpInfo: {
        SpName: "upr_insupd_hand_hygen_form_wrkp_info",
        Schema: [{ type: "json", column: "hand_hygen_json", direction: "IN", alias: "par_hand_hygen_json" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdIndTran: {
        SpName: "upr_insupd_indc_all",
        Schema: [{ type: "character", column: "ip_flag", direction: "IN", alias: "par_ip_flag" },
        { type: "json", column: "json_value", direction: "IN", alias: "par_json_value" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getNumRepErs: {
        SpName: "upr_get_num_rep_errors",
        Schema: [{ type: "character", column: "rep_err_cd", direction: "IN", alias: "par_rep_err_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "character", column: "years", direction: "IN", alias: "par_years" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdNumRepErs: {
        SpName: "upr_insupd_num_rep_errors",
        Schema: [{ type: "json", column: "num_rep_errors", direction: "IN", alias: "par_num_rep_errors" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdIncdntRptng: {
        SpName: "upr_insupd_incident_reporting",
        Schema: [{ type: "json", column: "incident_reporting_info", direction: "IN", alias: "par_incident_reporting_info" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getIncdntRptng: {
        SpName: "upr_get_incident_reporting",
        Schema: [{ type: "character", column: "incd_rep_cd", direction: "IN", alias: "par_incd_rep_cd" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdInfCtrlWrkpInfo: {
        SpName: "upr_insupd_infection_control_wrkp_info",
        Schema: [{ type: "json", column: "infection_control_wrkp_info", direction: "IN", alias: "par_infection_control_wrkp_info" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getInfCtrlWrkpInfo: {
        SpName: "upr_get_infection_control_wrkp_info",
        Schema: [{ type: "character", column: "infectn_cntrl_cd", direction: "IN", alias: "par_infectn_cntrl_cd" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdInftnSrvlnc: {
        SpName: "upr_insupd_infection_surveilance_wrkp_info",
        Schema: [{ type: "json", column: "infection_surveilance_info", direction: "IN", alias: "par_infection_surveilance_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getInftnSrvlnc: {
        SpName: "upr_get_infection_surveilance_wrkp_info",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "character", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getFormMaster: {
        SpName: "upr_get_form_master",
        Schema: [{ type: "character", column: "form_name", direction: "IN", alias: "par_form_name" },
        { type: "character", column: "section", direction: "IN", alias: "par_section" },
        { type: "character", column: "lable", direction: "IN", alias: "par_lable" },
        { type: "character", column: "frm_mst_cd", direction: "IN", alias: "par_frm_mst_cd" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "uuid", column: "uuid", direction: "IN", alias: "par_uuid" },
        { type: "character", column: "lvl", direction: "IN", alias: "par_lvl" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getAutoComplete: {
        SpName: "upr_get_auto_complete",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "prefix_text", direction: "IN", alias: "par_prefix_text" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdImage: {
        SpName: "upr_insupd_images",
        Schema: [{ type: "json", column: "images", direction: "IN", alias: "par_images" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getImage: {
        SpName: "upr_get_images",
        Schema: [{ type: "character", column: "form_name", direction: "IN", alias: "par_form_name" },
        { type: "character", column: "form_unique_id", direction: "IN", alias: "par_form_unique_id" },
        { type: "integer", column: "img_leve", direction: "IN", alias: "par_img_level" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getExcelData: {
        SpName: "upr_get_form_export",
        Schema: [{ type: "character", column: "type", direction: "IN", alias: "par_type" },
		{ type: "character", column: "sub_type", direction: "IN", alias: "par_sub_type" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "timestamp", column: "from_date", direction: "IN", alias: "par_from_date" },
        { type: "timestamp", column: "to_date", direction: "IN", alias: "par_to_date" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdEmployee: {
        SpName: "upr_insupd_employee_information_info_json",
        Schema: [{ type: "json", column: "employee_information_info_json", direction: "IN", alias: "par_employee_information_info_json" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getEmployee: {
        SpName: "upr_get_employee_information_info",
        Schema: [{ type: "bigint", column: "emp_id", direction: "IN", alias: "par_emp_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getPermissions: {
        SpName: "upr_get_user_permissions",
        Schema: [{ type: "integer", column: "module_id", direction: "IN", alias: "par_module_id" },
        { type: "integer", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "integer", column: "role_id", direction: "IN", alias: "par_role_id" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdRoleDocAccess: {
        SpName: "upr_insupd_role_doc_access_json",
        Schema: [{ type: "json", column: "role_doc_access", direction: "IN", alias: "par_role_doc_access" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdUserDocAccess: {
        SpName: "upr_insupd_user_doc_access_json",
        Schema: [{ type: "json", column: "user_doc_access_json", direction: "IN", alias: "par_user_doc_access_json" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdComMsgReq: {
        SpName: "upr_insupd_com_msg_req",
        Schema: [{ type: "json", column: "com_msg_req", direction: "IN", alias: "par_com_msg_req" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getComMsgReqType: {
        SpName: "upr_get_com_msg_req_type",
        Schema: [{ type: "bigint", column: "req_type_id", direction: "IN", alias: "par_req_type_id" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getFormPrint: {
        SpName: "upr_get_form_print_data",
        Schema: [{ type: "character", column: "form_cd", direction: "IN", alias: "par_form_cd" },
        { type: "uuid", column: "form_uuid", direction: "IN", alias: "par_form_uuid" },
        { type: "character", column: "ip_flag", direction: "IN", alias: "par_ip_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    insUpdInfctionSurv: {
        SpName: "upr_insupd_infection_surveilance_wrkp_info",
        Schema: [{ type: "json", column: "infection_surveilance_info", direction: "IN", alias: "par_infection_surveilance_info" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
    getInfctionSurv: {
        SpName: "upr_get_infection_surveilance_wrkp_info",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "month", direction: "IN", alias: "par_month_nm" },
        { type: "character", column: "year", direction: "IN", alias: "par_year_nm" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getWorkupForm: {
        SpName: "upr_get_wrkp_form",
        Schema: [{ type: "character", column: "form_type_cd", direction: "IN", alias: "par_form_type_cd" },
        { type: "character", column: "type", direction: "IN", alias: "par_type" },
        { type: "uuid", column: "wrkp_uuid", direction: "IN", alias: "par_wrkp_uuid" },
        { type: "character", column: "wrkp_cd", direction: "IN", alias: "par_wrkp_cd" },
        { type: "character", column: "umr_no", direction: "IN", alias: "par_umr_no" },
        { type: "character", column: "admn_no", direction: "IN", alias: "par_admn_no" },
        { type: "character", column: "month_name", direction: "IN", alias: "par_month_name" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "nurse_station", direction: "IN", alias: "par_nurse_station" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
		{ type: "timestamp", column: "dt", direction: "IN", alias: "par_dt" }],
        Server: "PG", Database: "QI"
    },
    insUpdMedicErr: {
        SpName: "upr_insupd_medic_error_report",
        Schema: [{ type: "json", column: "medic_error_report", direction: "IN", alias: "par_medic_error_report" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    getDocs: {
        SpName: "upr_get_documents",
        Schema: [{ type: "character", column: "module_cd", direction: "IN", alias: "par_module_cd" },
        { type: "character", column: "document_cd", direction: "IN", alias: "par_document_cd" }],
        Server: "PG", Database: "QI"
    },
    getOrgInfo: {
        SpName: "upr_get_org_info",
        Schema: [{ type: "character", column: "org_key", direction: "IN", alias: "par_org_key" },
        { type: "character", column: "loc_key", direction: "IN", alias: "par_loc_key" }],
        Server: "PG", Database: "QI"
    },
    getAccessDocs: {
        SpName: "upr_get_doc_access",
        Schema: [{ type: "integer", column: "role_id", direction: "IN", alias: "par_role_id" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
    login: {
        SpName: "upr_get_validate_user_login",
        Schema: [{ type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "password", direction: "IN", alias: "par_password" },
        { type: "timestamp", column: "start_time", direction: "IN", alias: "par_start_time" },
        { type: "timestamp", column: "end_time", direction: "IN", alias: "par_end_time" },
        { type: "character", column: "machine", direction: "IN", alias: "par_machine" },
        { type: "character", column: "version", direction: "IN", alias: "par_version" },
        { type: "character", column: "terminal", direction: "IN", alias: "par_terminal" },
        { type: "character", column: "browser", direction: "IN", alias: "par_browser" },
        { type: "character", column: "browser_versn", direction: "IN", alias: "par_browser_versn" },
        { type: "bigint", column: "timezone_id", direction: "IN", alias: "par_timezone_id" },
        { type: "integer", column: "utc_minutes", direction: "IN", alias: "par_utc_minutes" },
        { type: "character", column: "loc_key", direction: "IN", alias: "par_loc_key" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" }],
        Server: "PG", Database: "QI"
    },
    logout: {
        SpName: "upr_upd_session_loc",
        Schema: [{ type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
	updChangePwd: {
        SpName: "upr_upd_change_pwd",
        Schema: [{ type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "password", direction: "IN", alias: "par_password" },
        { type: "character", column: "new_password", direction: "IN", alias: "par_new_password" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
	getOpClinicalData: {
        SpName: "UPR_PHR_GET_OP_CLINICAL_DATA",
        Schema: [{ type: "VARCHAR", column: "IP_CLINICAL_DATA_TYPE", direction: "IN", alias: "IP_CLINICAL_DATA_TYPE" },
        { type: "VARCHAR", column: "IP_DIAGNOSIS_TYPE", direction: "IN", alias: "IP_DIAGNOSIS_TYPE" },
        { type: "INT", column: "IP_PROFILE_TYPE_ID", direction: "IN", alias: "IP_PROFILE_TYPE_ID" },
        { type: "BIGINT", column: "IP_SLOT_ID", direction: "IN", alias: "IP_SLOT_ID" },
        { type: "VARCHAR", column: "IP_MRN_NO", direction: "IN", alias: "IP_MRN_NO" },
        { type: "VARCHAR", column: "IP_ADMN_NO", direction: "IN", alias: "IP_ADMN_NO" },
        { type: "CHAR", column: "IP_FLAG", direction: "IN", alias: "IP_FLAG" },
        { type: "CHAR", column: "IP_FROM", direction: "IN", alias: "IP_FROM" },
        { type: "BIGINT", column: "IP_SESSION_ID", direction: "IN", alias: "IP_SESSION_ID" },
        { type: "INT", column: "IP_RECORD_TYPE_ID", direction: "IN", alias: "IP_RECORD_TYPE_ID" },
        { type: "VARCHAR", column: "FORM_TYPE_CD", direction: "IN", alias: "FORM_TYPE_CD" },
        { type: "INT", column: "IP_COUNT", direction: "IN", alias: "IP_COUNT" },
        { type: "DATE_TIME_2", column: "IP_VISIT_DT", direction: "IN", alias: "IP_VISIT_DT" },
        { type: "BIGINT", column: "IP_REFERENCE_TYPE_ID", direction: "IN", alias: "IP_REFERENCE_TYPE_ID" },
        { type: "VARCHAR", column: "IP_BILL_ID", direction: "IN", alias: "IP_BILL_ID" },
        { type: "BIGINT", column: "IP_VISIT_ID", direction: "IN", alias: "IP_VISIT_ID" },
        { type: "VARCHAR", column: "IP_UMR_NO", direction: "IN", alias: "IP_UMR_NO" },
        { type: "VARCHAR", column: "IP_IPOP_FLAG", direction: "IN", alias: "IP_IPOP_FLAG" }],
        Server: "SQL", Database: "APPT"
    },
	
	uprGetQiReports: {
        SpName: "upr_get_qi_reports",
        Schema: [{ type: "json", column: "fields_json", direction: "IN", alias: "par_fields_json" },
        { type: "json", column: "filter_json", direction: "IN", alias: "par_filter_json" },
        { type: "character", column: "form_cd", direction: "IN", alias: "par_form_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
	uprInsupdNurseRatio: {
        SpName: "upr_insupd_nurse_ratio",
        Schema: [{ type: "json", column: "nurse_ratio_json", direction: "IN", alias: "par_nurse_ratio_json" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
	uprGetIndicatorMonthlydataCnt: {
        SpName: "upr_get_indicator_monthly_data_cnt",
        Schema: [{ type: "date", column: "dt", direction: "IN", alias: "par_dt" },
        { type: "date", column: "from_dt", direction: "IN", alias: "par_from_dt" },
        { type: "date", column: "to_dt", direction: "IN", alias: "par_to_dt" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" },
        { type: "character", column: "imd_id", direction: "IN", alias: "par_imd_id" },
        { type: "uuid", column: "ind_uid", direction: "IN", alias: "par_ind_uid" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "QI"
    },
	uprInsupdIndicatorMonthlyData: {
        SpName: "upr_insupd_indicator_monthly_data",
        Schema: [{ type: "json", column: "indi_monthly_data_info", direction: "IN", alias: "par_indi_monthly_data_info" },
        { type: "character", column: "month", direction: "IN", alias: "par_month" },
        { type: "integer", column: "year", direction: "IN", alias: "par_year" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
	uprInsupFormMaster: {
        SpName: "upr_insupd_form_master",
        Schema: [{ type: "json", column: "master_json", direction: "IN", alias: "par_master_json" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "QI"
    },
}
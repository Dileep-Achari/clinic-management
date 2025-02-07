module.exports = {
    getAllHosts: {
        SpName: "upr_get_host_names",
        Schema: [],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdMasterData: {
        SpName: "upr_insupd_evts_in_master_data_info",
        Schema: [{ type: "character", column: "HOST_NAME", direction: "IN", alias: "par_host_name" },
        { type: "character", column: "DOCUMENT_CD", direction: "IN", alias: "par_document_cd" },
        { type: "json", column: "JSON_DATA", direction: "IN", alias: "par_json_data" },
        { type: "bigint", column: "ORG_ID", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "LOC_ID", direction: "IN", alias: "par_loc_id" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	getInsUpdUser: {
        SpName: "upr_getinsupd_users",
        Schema: [{ type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "character", column: "org_cd", direction: "IN", alias: "par_org_cd" },
        { type: "character", column: "loc_cd", direction: "IN", alias: "par_loc_cd" },
        { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "display_name", direction: "IN", alias: "par_display_name" },
        { type: "bigint", column: "gender_id", direction: "IN", alias: "par_gender_id" },
        { type: "character", column: "role_cd", direction: "IN", alias: "par_role_cd" },
        { type: "bigint", column: "reference_id", direction: "IN", alias: "par_reference_id" },
        { type: "bigint", column: "reference_type_id", direction: "IN", alias: "par_reference_type_id" },
        { type: "character", column: "password", direction: "IN", alias: "par_password" },
        { type: "text", column: "old_password", direction: "IN", alias: "par_old_password" },
        { type: "text", column: "transaction_password", direction: "IN", alias: "par_transaction_password" },
        { type: "character", column: "imei_no", direction: "IN", alias: "par_imei_no" },
        { type: "character", column: "hint2_ans", direction: "IN", alias: "par_hint2_ans" },
        { type: "character", column: "hint3_ans", direction: "IN", alias: "par_hint3_ans" },
        { type: "character", column: "email_id", direction: "IN", alias: "par_email_id" },
        { type: "character", column: "mobile_no", direction: "IN", alias: "par_mobile_no" },
        { type: "bigint", column: "default_cost_center", direction: "IN", alias: "par_default_cost_center" },
        { type: "json", column: "access_orgs", direction: "IN", alias: "par_access_orgs" },
        { type: "json", column: "access_locations", direction: "IN", alias: "par_access_locations" },
        { type: "json", column: "access_cost_centers", direction: "IN", alias: "par_access_cost_centers" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "integer", column: "device_count", direction: "IN", alias: "par_device_count" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
     InsUpdUser: {
            SpName: "upr_getinsupd_users",
            Schema: [{ type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
            { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
            { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
            { type: "character", column: "display_name", direction: "IN", alias: "par_display_name" },
            { type: "bigint", column: "gender_id", direction: "IN", alias: "par_gender_id" },
            { type: "character", column: "role_cd", direction: "IN", alias: "par_role_cd" },
            { type: "bigint", column: "reference_id", direction: "IN", alias: "par_reference_id" },
            { type: "bigint", column: "reference_type_id", direction: "IN", alias: "par_reference_type_id" },
            { type: "character", column: "password", direction: "IN", alias: "par_password" },
            { type: "text", column: "old_password", direction: "IN", alias: "par_old_password" },
            { type: "character", column: "imei_no", direction: "IN", alias: "par_imei_no" },
            { type: "character", column: "imei_no2", direction: "IN", alias: "par_imei_no2" },
            { type: "character", column: "imei_no3", direction: "IN", alias: "par_imei_no3" },
            { type: "character", column: "email_id", direction: "IN", alias: "par_email_id" },
            { type: "character", column: "mobile_no", direction: "IN", alias: "par_mobile_no" },
            { type: "json", column: "access_location", direction: "IN", alias: "par_access_location" },
            { type: "character", column: "access_doc_cd", direction: "IN", alias: "par_access_doc_cd" },
            { type: "bigint", column: "default_selection", direction: "IN", alias: "par_default_selection" },
            { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
            { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" },
            { type: "character", column: "device_id", direction: "IN", alias: "par_device_id" },
            { type: "character", column: "fcm_id", direction: "IN", alias: "par_fcm_id" },
            { type: "uuid", column: "uuid", direction: "IN", alias: "par_uuid" },
            { type: "character", column: "otp", direction: "IN", alias: "par_otp" },
            { type: "character", column: "is_tc_accept", direction: "IN", alias: "par_is_tc_accept" },
            { type: "json", column: "user_doc", direction: "IN", alias: "par_user_doc" }],
            Server: "PG", Database: "APK_DOCTOR"
        },
    getMasterData: {
        SpName: "upr_get_master_data_info",
        Schema: [{ type: "bigint", column: "ORG_ID", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "LOC_ID", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "DOCUMENT_CD", direction: "IN", alias: "par_document_cd" },
        { type: "character", column: "HOST_API", direction: "IN", alias: "par_host_api" },
        { type: "character", column: "DM_CD", direction: "IN", alias: "par_dm_cd" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getUserValiditate: {
        SpName: "upr_get_user_validate",
        Schema: [{ type: "character", column: "USER_NAME", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "PASSWORD", direction: "IN", alias: "par_password" },
        { type: "json", column: "USER_LOG_INFO", direction: "IN", alias: "par_user_log_info" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprGetUserLogInfoDoc: {
        SpName: "upr_get_user_log_info",
        Schema: [{ type: "character", column: "USER_NAME", direction: "IN", alias: "par_user_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprGetOrgLoc: {
        SpName: "upr_get_org_loc",
        Schema: [{ type: "bigint", column: "ORG_ID", direction: "IN", alias: "par_org_id" },
        { type: "character", column: "ORG_CD", direction: "IN", alias: "par_org_cd" },
        { type: "bigint", column: "LOC_ID", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "HOST_NAME", direction: "IN", alias: "par_host_name" },
        { type: "bigint", column: "SESSION_ID", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdTransactionDataInfo: {
        SpName: "upr_insupd_transaction_data_info",
        Schema: [{ type: "bigint", column: "ORG_ID", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "LOC_ID", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "MASTER_TYPE", direction: "IN", alias: "par_master_type" },
        { type: "bigint", column: "VISIT_ID", direction: "IN", alias: "par_visit_id" },
        { type: "character", column: "ADMN_NO", direction: "IN", alias: "par_admn_no" },
        { type: "bigint", column: "PATIENT_ID", direction: "IN", alias: "par_patient_id" },
        { type: "bigint", column: "SLOT_ID", direction: "IN", alias: "par_slot_id" },
        { type: "json", column: "JSON_DATA", direction: "IN", alias: "par_json_data" },
        { type: "character", column: "HOST_API", direction: "IN", alias: "par_host_api" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getTransactionDataInfo: {
        SpName: "upr_get_transaction_data_info",
        Schema: [{ type: "bigint", column: "ORG_ID", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "LOC_ID", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "MASTER_TYPE", direction: "IN", alias: "par_master_type" },
        { type: "bigint", column: "VISIT_ID", direction: "IN", alias: "par_visit_id" },
        { type: "character", column: "ADMN_NO", direction: "IN", alias: "par_admn_no" },
        { type: "bigint", column: "PATIENT_ID", direction: "IN", alias: "par_patient_id" },
        { type: "character", column: "HOST_API", direction: "IN", alias: "par_host_api" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprGetUserDet: {
        SpName: "upr_get_user_det",
        Schema: [{ type: "character", column: "USER_NAME", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "ROLE", direction: "IN", alias: "par_role" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getLocation: {
        SpName: "upr_get_location",
        Schema: [{ type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "loc_cd", direction: "IN", alias: "par_loc_cd" },
        { type: "character", column: "loc_name", direction: "IN", alias: "par_loc_name" },
        { type: "character", column: "org_cd", direction: "IN", alias: "par_org_cd" },
        { type: "character", column: "host_api", direction: "IN", alias: "par_host_api" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getOrganization: {
        SpName: "upr_get_organization",
        Schema: [{ type: "character", column: "org_cd", direction: "IN", alias: "par_org_cd" },
        { type: "bigint", column: "session_id", direction: "IN", alias: "par_session_id" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getInsUsers: {
        SpName: "upr_getinsupd_users",
        Schema: [{ type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "display_name", direction: "IN", alias: "par_display_name" },
        { type: "bigint", column: "gender_id", direction: "IN", alias: "par_gender_id" },
        { type: "character", column: "role_cd", direction: "IN", alias: "par_role_cd" },
        { type: "bigint", column: "reference_id", direction: "IN", alias: "par_reference_id" },
        { type: "bigint", column: "reference_type_id", direction: "IN", alias: "par_reference_type_id" },
        { type: "character", column: "password", direction: "IN", alias: "par_password" },
        { type: "text", column: "old_password", direction: "IN", alias: "par_old_password" },
        { type: "character", column: "imei_no", direction: "IN", alias: "par_imei_no" },
        { type: "character", column: "imei_no2", direction: "IN", alias: "par_imei_no2" },
        { type: "character", column: "imei_no3", direction: "IN", alias: "par_imei_no3" },
        { type: "character", column: "email_id", direction: "IN", alias: "par_email_id" },
        { type: "character", column: "mobile_no", direction: "IN", alias: "par_mobile_no" },
        { type: "character", column: "access_location", direction: "IN", alias: "par_access_location" },
        { type: "character", column: "access_doc_cd", direction: "IN", alias: "par_access_doc_cd" },
        { type: "bigint", column: "default_selection", direction: "IN", alias: "par_default_selection" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" },
        { type: "character", column: "device_id", direction: "IN", alias: "par_device_id" },
        { type: "character", column: "fcm_id", direction: "IN", alias: "par_fcm_id" },
        { type: "uuid", column: "uuid", direction: "IN", alias: "par_uuid" },
        { type: "character", column: "otp", direction: "IN", alias: "par_otp" },
        { type: "character", column: "is_tc_accept", direction: "IN", alias: "par_is_tc_accept" },
        { type: "json", column: "user_doc", direction: "IN", alias: "par_user_doc" },
        { type: "character", column: "user_pin", direction: "IN", alias: "par_user_pin" },
        { type: "character", column: "pin_req", direction: "IN", alias: "par_pin_req" },
        { type: "character", column: "pin_hint", direction: "IN", alias: "par_pin_hint" },
        { type: "json", column: "par_loc_json", direction: "IN", alias: "par_loc_json" },
        { type: "integer", column: "device_count", direction: "IN", alias: "par_device_count" },
        { type: "character", column: "login_user", direction: "IN", alias: "par_login_user" },
        { type: "varchar", column: "usr_valdip_address", direction: "IN", alias: "par_usr_valdip_address" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdComMsgReq: {
        SpName: "upr_ins_com_msg_req_type",
        Schema: [{ type: "bigint", column: "req_type_id", direction: "IN", alias: "par_req_type_id" },
        { type: "character", column: "record_status", direction: "IN", alias: "par_record_status" },
        { type: "character", column: "req_desc", direction: "IN", alias: "par_req_desc" },
        { type: "text", column: "mob_template", direction: "IN", alias: "par_mob_template" },
        { type: "text", column: "email_style", direction: "IN", alias: "par_email_style" },
        { type: "text", column: "email_template", direction: "IN", alias: "par_email_template" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    getMasterDataNew: {
        SpName: "upr_get_master_data",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "type", direction: "IN", alias: "par_type" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdRazerPayCust: {
        SpName: "upr_insupd_razer_opentok_pay_customers",
        Schema: [{ type: "uuid", column: "razer_pay_uuid", direction: "IN", alias: "par_razer_pay_uuid" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "client_name", direction: "IN", alias: "par_client_name" },
        { type: "character", column: "key_id", direction: "IN", alias: "par_key_id" },
        { type: "character", column: "key_secret", direction: "IN", alias: "par_key_secret" },
        { type: "character", column: "currency", direction: "IN", alias: "par_currency" },
        { type: "character", column: "description", direction: "IN", alias: "par_description" },
        { type: "boolean", column: "reminder_enable", direction: "IN", alias: "par_reminder_enable" },
        { type: "integer", column: "sms_notify", direction: "IN", alias: "par_sms_notify" },
        { type: "integer", column: "email_notify", direction: "IN", alias: "par_email_notify" },
        { type: "character", column: "callback_url", direction: "IN", alias: "par_callback_url" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" },
        { type: "uuid", column: "opentok_pay_uuid", direction: "IN", alias: "par_opentok_pay_uuid" },
        { type: "bigint", column: "api_key", direction: "IN", alias: "par_api_key" },
        { type: "character", column: "api_secret", direction: "IN", alias: "par_api_secret" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdVendorDetails: {
        SpName: "upr_insupd_vendor_details",
        Schema: [{ type: "uuid", column: "vendor_uuid", direction: "IN", alias: "par_vendor_uuid" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "json", column: "sms", direction: "IN", alias: "par_sms" },
        { type: "json", column: "email", direction: "IN", alias: "par_email" },
        { type: "character", column: "is_test", direction: "IN", alias: "par_is_test" },
        { type: "character", column: "test_mobile_no", direction: "IN", alias: "par_test_mobile_no" },
        { type: "character", column: "test_email", direction: "IN", alias: "par_test_email" },
        { type: "character", column: "is_active", direction: "IN", alias: "par_is_active" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdOrganization: {
        SpName: "upr_insupd_evts_in_organization",
        Schema: [{ type: "json", column: "evts_in_organization", direction: "IN", alias: "par_evts_in_organization" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdLocation: {
        SpName: "upr_insupd_evts_in_location",
        Schema: [{ type: "json", column: "evts_in_location", direction: "IN", alias: "par_evts_in_location" },
        { type: "character", column: "host_api", direction: "IN", alias: "par_host_api" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdUserRoleDocAccess: {
        SpName: "upr_ins_user_role_doc_access",
        Schema: [{ type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "character", column: "role_cd", direction: "IN", alias: "par_role_cd" },
        { type: "character", column: "role_name", direction: "IN", alias: "par_role_name" },
        { type: "json", column: "role_json", direction: "IN", alias: "par_role_json" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprGetFeedBackRequest: {
        SpName: "upr_get_feed_back_request",
        Schema: [{ type: "bigint", column: "request_id", direction: "IN", alias: "par_request_id" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprInsupdFeedBackRequest: {
        SpName: "upr_insupd_feed_back_request",
        Schema: [{ type: "bigint", column: "request_id", direction: "IN", alias: "par_request_id" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "request", direction: "IN", alias: "par_request" },
        { type: "integer", column: "query_type", direction: "IN", alias: "par_query_type" },
        { type: "character", column: "request_path", direction: "IN", alias: "par_request_path" },
        { type: "bigint", column: "response_id", direction: "IN", alias: "par_response_id" },
        { type: "character", column: "response", direction: "IN", alias: "par_response" },
        { type: "integer", column: "resolution_type", direction: "IN", alias: "par_resolution_type" },
        { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
		{ type: "character", column: "type", direction: "IN", alias: "par_type" },
        { type: "bigint", column: "user_id", direction: "IN", alias: "par_user_id" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprGetUserAuditInfo: {
        SpName: "upr_get_user_audit_info",
        Schema: [{ type: "character", column: "flag", direction: "IN", alias: "par_flag" },
        { type: "character", column: "app_name", direction: "IN", alias: "par_app_name" },
        { type: "character", column: "user_name", direction: "IN", alias: "par_user_name" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "date", column: "from_dt", direction: "IN", alias: "par_from_dt" },
        { type: "date", column: "to_dt", direction: "IN", alias: "par_to_dt" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprGetPackageMasterMobi: {
        SpName: "upr_get_package_master_mobi",
        Schema: [{ type: "character", column: "package_type", direction: "IN", alias: "par_package_type" },
        { type: "integer", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "integer", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprInsupdPackageMasterMobi: {
        SpName: "upr_insupd_package_master_mobi",
        Schema: [{ type: "integer", column: "pack_id", direction: "IN", alias: "par_pack_id" },
        { type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" },
        { type: "character", column: "package_cd", direction: "IN", alias: "par_package_cd" },
        { type: "character", column: "package_name", direction: "IN", alias: "par_package_name" },
        { type: "character", column: "package_desc", direction: "IN", alias: "par_package_desc" },
        { type: "integer", column: "total_tests", direction: "IN", alias: "par_total_tests" },
        { type: "character", column: "test_preparation", direction: "IN", alias: "par_test_preparation" },
        { type: "character", column: "reprot_tat", direction: "IN", alias: "par_reprot_tat" },
        { type: "character", column: "about_package", direction: "IN", alias: "par_about_package" },
        { type: "character", column: "specimen", direction: "IN", alias: "par_specimen" },
        { type: "numeric", column: "package_price", direction: "IN", alias: "par_package_price" },
        { type: "numeric", column: "offer_price", direction: "IN", alias: "par_offer_price" },
        { type: "integer", column: "max_postpone_days", direction: "IN", alias: "par_max_postpone_days" },
        { type: "numeric", column: "discount_percent", direction: "IN", alias: "par_discount_percent" },
        { type: "timestamp", column: "effect_from_dt", direction: "IN", alias: "par_effect_from_dt" },
        { type: "timestamp", column: "effect_to_dt", direction: "IN", alias: "par_effect_to_dt" },
        { type: "character", column: "guidelines", direction: "IN", alias: "par_guidelines" },
        { type: "character", column: "dos_donts", direction: "IN", alias: "par_dos_donts" },
        { type: "character", column: "package_type", direction: "IN", alias: "par_package_type" },
        { type: "character", column: "popular_package", direction: "IN", alias: "par_popular_package" },
        { type: "jsonb", column: "all_packages_json", direction: "IN", alias: "par_all_packages_json" },
        { type: "integer", column: "package_limit", direction: "IN", alias: "par_package_limit" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprGetAppUsageRep: {
        SpName: "upr_get_app_usage_rep",
        Schema: [{ type: "character", column: "app_name", direction: "IN", alias: "par_app_name" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" },
    		{ type: "character", column: "host_cd", direction: "IN", alias: "par_host_cd" },
        { type: "character", column: "user_name", direction: "IN", alias: "user_name" },
        { type: "integer", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "integer", column: "loc_id", direction: "IN", alias: "par_loc_id" },
    		{ type: "date", column: "from_dt", direction: "IN", alias: "par_from_dt" },
    		{ type: "date", column: "to_dt", direction: "IN", alias: "par_to_dt" }],
        Server: "PG", Database: "APK_DOCTOR"
        },
     uprGetWhatsappLog: {
        SpName: "upr_get_whatsapp_log",
        Schema: [{ type: "character", column: "org_key", direction: "IN", alias: "par_org_key" },
        { type: "character", column: "response_id", direction: "IN", alias: "par_response_id" },
        { type: "character", column: "to_mobile", direction: "IN", alias: "par_to_mobile" },
        { type: "date", column: "from_dt", direction: "IN", alias: "par_from_dt" },
        { type: "date", column: "to_dt", direction: "IN", alias: "par_to_dt" },
		    { type: "character", column: "type", direction: "IN", alias: "par_type" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprInsWhatsappLog: {
        SpName: "upr_ins_whatsapp_log",
        Schema: [{ type: "json", column: "whatsapp_log", direction: "IN", alias: "par_whatsapp_log" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	uprInsLabReportsLog: {
        SpName: "upr_ins_lab_reports_log",
        Schema: [{ type: "json", column: "lab_reports_log", direction: "IN", alias: "par_lab_reports_log" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    insUpdEmrApps: {
            SpName: "upr_inspud_emr_apps",
            Schema: [{ type: "jsonb", column: "header_app", direction: "IN", alias: "header_app" },
            { type: "jsonb", column: "body", direction: "IN", alias: "body" },
            { type: "character", column: "app_name", direction: "IN", alias: "app_name" },
            { type: "character", column: "parm1", direction: "IN", alias: "parm1" },
            { type: "character", column: "parm2", direction: "IN", alias: "parm2" },
            { type: "character", column: "parm3", direction: "IN", alias: "parm3" }],
            Server: "PG", Database: "DOC"
        },
    uprInsupdBillSmsLink: {
        SpName: "upr_insupd_bill_sms_link",
        Schema: [{ type: "character", column: "xml_data", direction: "IN", alias: "par_xml_data" },
        { type: "bigint", column: "run_no", direction: "IN", alias: "par_run_no" },
        { type: "character", column: "short_url", direction: "IN", alias: "par_short_url" },
        { type: "character", column: "companycd", direction: "IN", alias: "par_companycd" },
        { type: "character", column: "locationcd", direction: "IN", alias: "par_locationcd" },
        { type: "character", column: "costcentercd", direction: "IN", alias: "par_costcentercd" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprGetBillSmsLink: {
        SpName: "upr_get_bill_sms_link",
        Schema: [{ type: "character", column: "short_url", direction: "IN", alias: "par_short_url" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
     getInsupdOrgLocMaster: {
        SpName: "upr_getinsupd_org_loc_master",
        Schema: [{ type: "bigint", column: "org_id", direction: "IN", alias: "par_org_id" },
        { type: "bigint", column: "loc_id", direction: "IN", alias: "par_loc_id" },
        { type: "character", column: "org_key", direction: "IN", alias: "par_org_key" },
        { type: "character", column: "lvl", direction: "IN", alias: "par_lvl" },
        { type: "character", column: "host_name", direction: "IN", alias: "par_host_name" },
        { type: "character", column: "master_cd", direction: "IN", alias: "par_master_cd" },
        { type: "json", column: "master_json", direction: "IN", alias: "par_master_json" },
        { type: "character", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
    uprInsupdMedDataXml: {
        SpName: "upr_insupd_med_data_xml",
        Schema: [{ type: "xml", column: "xml", direction: "IN", alias: "par_xml" },
        { type: "character", column: "type", direction: "IN", alias: "par_type" },
        { type: "varchar", column: "setid", direction: "IN", alias: "par_setid" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
     getInsupdBillsSmsPdf: {
        SpName: "upr_get_insupd_bill_sms_pdf_data",
        Schema: [{ type: "varchar", column: "short_url", direction: "IN", alias: "par_short_url" },
        { type: "text", column: "sms_pdf_data", direction: "IN", alias: "par_sms_pdf_data" },
        { type: "varchar", column: "host_name", direction: "IN", alias: "par_host_name" },
        { type: "varchar", column: "flag", direction: "IN", alias: "par_flag" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
     insertSmartRptBase64Data: {
        SpName: "upr_insupd_report_pdf_data",
        Schema: [{ type: "varchar", column: "flag", direction: "IN", alias: "par_flag" },
          { type: "json", column: "report_pdf_data_json", direction: "IN", alias: "par_report_pdf_data_json" }],
        Server: "PG", Database: "APK_DOCTOR" 
    },
     getSmartRptBase64Data: {
        SpName: "upr_get_report_pdf_data",
        Schema: [{ type: "varchar", column: "short_url", direction: "IN", alias: "par_short_url" },
        { type: "varchar", column: "bill_no", direction: "IN", alias: "par_bill_no" },
        { type: "varchar", column: "org_cd", direction: "IN", alias: "par_org_cd" },
        { type: "varchar", column: "loc_cd", direction: "IN", alias: "par_loc_cd" }],
        Server: "PG", Database: "APK_DOCTOR"
    },
	
}
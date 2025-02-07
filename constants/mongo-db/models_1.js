module.exports = [
    {
        "method": "getData",
        "query": "find",
        "model": "nmcs",
        "selectors": "method reqDtTime respDtTime hfidabdm txn_id from_date to_date create_dt HimsStatusCode EmrStatusCode respDtTimeISO",
        "sort": "_id"
    },
    {
        "method": "getMasters",
        "query": "find",
        "model": "porter_masters",
        "selectors": "type name data",
        "sort": "_id"
    },
    {
        "method": "getMastersById",
        "query": "findById",
        "model": "porter_masters",
        "selectors": "type name data",
        "sort": "_id"
    },
    {
        "method": "insertDashboard",
        "query": "insertMany",
        "model": "nmcs",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "insertMasterData",
        "query": "insertMany",
        "model": "porter_masters",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "insertRequest",
        "query": "insertMany",
        "model": "porter_transactions",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "getRequestDataById",
        "query": "findById",
        "model": "porter_transactions",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "getPatientData",
        "query": "find",
        "model": "patient_care_patients",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertPatientData",
        "query": "insertMany",
        "model": "patient_care_patients",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "getPatientById",
        "query": "findById",
        "model": "patient_care_patients",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "getDataPatientById",
        "query": "findById",
        "model": "patient_care_patients",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertTransactionData",
        "query": "insertMany",
        "model": "patient_care_transactions",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "getTransactionData",
        "query": "find",
        "model": "patient_care_transactions",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "getTransactionById",
        "query": "findById",
        "model": "patient_care_transactions",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertSurgeryData",
        "query": "insertMany",
        "model": "patient_care_surgeries",
        "selectors": "",
        "sort": ""
    },
    {
        "method": "getSurgeryData",
        "query": "find",
        "model": "patient_care_surgeries",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "uploadDocuments",
        "query": "insertMany",
        "model": "patient_care_documents",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertScores",
        "query": "insertMany",
        "model": "patient_care_scores",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertAbhaDetails",
        "query": "insertMany",
        "model": "abha_callbacks",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "getAbhaDetails",
        "query": "find",
        "model": "abha_callbacks",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertAbhaApiesDetails",
        "query": "insertMany",
        "model": "abha_apies",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "getAbhaApiesDetails",
        "query": "find",
        "model": "abha_apies",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertAbhaOTP",
        "query": "insertMany",
        "model": "abha_otps",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertAbhaDiscover",
        "query": "insertMany",
        "model": "abha_discover",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertAbhaCareContexts",
        "query": "insertMany",
        "model": "abha_care-contexts",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertLevelData",
        "query": "insertMany",
        "model": "monography_levels",
        "coll": "levels",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertRoleData",
        "query": "insertMany",
        "model": "monography_roles",
        "coll": "roles",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertiHstoryData",
        "query": "insertMany",
        "model": "monography_histories",
        "coll": "roles",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertUsersData",
        "query": "insertMany",
        "model": "monography_users",
        "coll": "users",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertDrugCreation",
        "query": "insertMany",
        "model": "monography_drugCreation",
        "coll": "drugCreation",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertUserAssign",
        "query": "insertMany",
        "model": "monography_userAssign",
        "coll": "userAssign",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertOrgLoc",
        "query": "insertMany",
        "model": "clinicManagement_orglocs",
        "coll": "orglocs",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertOrganization",
        "query": "insertMany",
        "model": "cm_organization",
        "coll": "organization",
        "selectors": "",
        "sort": "_id"
    },
    {
        "method": "insertHistoryData",
        "query": "insertMany",
        "model": "cm_histories",
        "coll": "histories",
        "selectors": "",
        "sort": "_id"
    },

]


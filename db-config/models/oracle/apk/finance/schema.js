'use strict';
module.exports = {
    MobAppUserPerm: {
        SpName: "MEDINEED.PROC_MOBAPP_USERPERM",
        Schema: [
            { type: "STRING", column: "USER", direction: "IN", alias: "PUSER" },
            { type: "STRING", column: "PWD", direction: "IN", alias: "PPWD" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    },
    getRevenueInformation: {
        SpName: "MEDINEED.PROC_MISDAILYRPT_MAPP_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "NUMBER", column: "SMSTIME", direction: "IN", alias: "PSMSTIME" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "CURSOR", column: "PREFMSG1", direction: "OUT", alias: "PREFMSG1" }],
        Server: "ORACLE"
    },
    getAdmissionDeails: {
        SpName: "MEDINEED.PROC_ADMNDTLSORGWISE_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "NUMBER", column: "SMSTIME", direction: "IN", alias: "PSMSTIME" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "CURSOR", column: "PREFMSG1", direction: "OUT", alias: "PREFMSG1" }],
        Server: "ORACLE"
    },
    getRevenueDepartmentWiseOrDoctorwise: {
        SpName: "MEDINEED.GETSMS_REV_DEPTWISE_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "USERID", direction: "IN", alias: "PUSERID" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDATE" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODATE" },
            { type: "STRING", column: "PATIENTTYPE", direction: "IN", alias: "PPATIENTTYPE" },
            { type: "STRING", column: "ISSHOWPHARM", direction: "IN", alias: "PISSHOWPHARM" },
            { type: "STRING", column: "USERDEPT", direction: "IN", alias: "PUSERDEPT" },
            { type: "STRING", column: "ISUSERDEPTWS", direction: "IN", alias: "PISUSERDEPTWS" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    },
    getBedOccupancyDetails: {
        SpName: "MEDINEED.PROC_BEDOCPYDTLSCATWSMAP_NEW",
        Schema: [
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "CURSOR", column: "PREFMSG", direction: "OUT", alias: "PREFMSG" }],
        Server: "ORACLE"
    },
    getDischargeDetails: {
        SpName: "MEDINEED.PROC_MIS_DIS_INFOMAPPP_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "CURSOR", column: "PREF_MSG", direction: "OUT", alias: "PREF_MSG" }],
        Server: "ORACLE"
    },
    getConsultationDetails: {
        SpName: "MEDINEED.PROC_CONSDTLSORGWISE_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "NUMBER", column: "SMSTIME", direction: "IN", alias: "PSMSTIME" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "CURSOR", column: "PREFMSG1", direction: "OUT", alias: "PREFMSG1" }],
        Server: "ORACLE"
    },
    getDailyDataReports: {
        SpName: "MEDINEED.PROC_DAILYDATARPT",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "STRING", column: "FLAG", direction: "IN", alias: "PFLAG" },
            { type: "CURSOR", column: "PREFMSG1", direction: "OUT", alias: "PREFMSG1" }],
        Server: "ORACLE"
    },
    getUserLocation: {
        SpName: "MEDINEED.PROC_MOBAPP_COMPPERM_NEW",
        Schema: [
            { type: "STRING", column: "USER", direction: "IN", alias: "PUSER" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    },
    changePassword: {
        SpName: "MEDINEED.PROC_MOBAPP_USERPWDCHNGM",
        Schema: [
            { type: "STRING", column: "USERID", direction: "IN", alias: "PUSER" },
            { type: "STRING", column: "PASSWORD", direction: "IN", alias: "PPWD" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    },
    getUserDocumentPermission: {
        SpName: "MEDINEED.PROC_MOBAPP_MODPERM",
        Schema: [
            { type: "STRING", column: "PPROFILECD", direction: "IN", alias: "PPROFILECD" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    },
    getNotConvertBills: {
        SpName: "MEDINEED.PROC_NOTCNVRTDBILLS_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "NUMBER", column: "SMSTIME", direction: "IN", alias: "PSMSTIME" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "CURSOR", column: "PREFMSG1", direction: "OUT", alias: "PREFMSG1" }],
        Server: "ORACLE"
    },
    getServiceGroupDetails: {
        SpName: "MEDINEED.PROC_MISINVBRKUP_MAPP_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "CURSOR", column: "PREFDATA", direction: "OUT", alias: "PREFDATA" }],
        Server: "ORACLE"
    },
    getStoresSales: {
        SpName: "MEDINEED.PROC_ST_SALES_TRANSFERS_NEW",
        Schema: [
            { type: "STRING", column: "COMPANYCD", direction: "IN", alias: "PCOMPANYCD" },
            { type: "STRING", column: "LOCATIONCD", direction: "IN", alias: "PLOCATIONCD" },
            { type: "STRING", column: "FROMDATE", direction: "IN", alias: "PFROMDT" },
            { type: "STRING", column: "TODATE", direction: "IN", alias: "PTODT" },
            { type: "STRING", column: "COSTCENTERCD", direction: "IN", alias: "PCOSTCENTERCD" },
            { type: "CURSOR", column: "PREF", direction: "OUT", alias: "PREF" }],
        Server: "ORACLE"
    }
}
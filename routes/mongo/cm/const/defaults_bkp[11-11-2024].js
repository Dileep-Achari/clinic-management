module.exports = [
    {
        "type": "DOCUMENTS",
        "coll": "cm_documents",
        "depColl": [],
        "payLoad": { "orgId": "", "sessionId":"", "audit": {} },
        "data": [
            {
                groupCd: "DOCTOR",
                groupName: "Doctor",
                docmntName: "Doctor Assessment",
                docmntUrl: "/doc-assmnt",
                reportUrl: "/print-doc-assmnt"
            },
            {
                groupCd: "DOCTOR",
                groupName: "Doctor",
                docmntName: "Doctor Re Assessment",
                docmntUrl: "/doc-re-assmnt",
                reportUrl: "/print-doc-re-assmnt"
            },
            {
                groupCd: "ORDERS",
                groupName: "Orders",
                docmntName: "Vitals",
                docmntUrl: "/vitals",
                reportUrl: "/print-vitals"
            },
            {
                groupCd: "ORDERS",
                groupName: "Orders",
                docmntName: "Medication",
                docmntUrl: "/meds",
                reportUrl: "/print-meds"
            },
            {
                groupCd: "ORDERS",
                groupName: "Orders",
                docmntName: "Investigation",
                docmntUrl: "/invs",
                reportUrl: "/print-invs"
            },
            {
                groupCd: "NURSE",
                groupName: "Nurse",
                docmntName: "Nurse Assessment",
                docmntUrl: "/nur-assmnt",
                reportUrl: "/print-nur-assmnt"
            },
            {
                groupCd: "NURSE",
                groupName: "Nurse",
                docmntName: "Nurse Re Assessment",
                docmntUrl: "/nur-re-assmnt",
                reportUrl: "/print-nur-re-assmnt"
            },
            {
                groupCd: "MASTERS",
                groupName: "Masters",
                docmntName: "Masters",
                docmntUrl: "/masters",
                reportUrl: "/print-masters"
            },
            {
                groupCd: "OP",
                groupName: "Op",
                docmntName: "Op Assessment",
                docmntUrl: "/op-assessment",
                reportUrl: "/print-op-assmnt"
            },
            {
                groupCd: "DIABETIC",
                groupName: "Diabetic",
                docmntName: "Diabetic Assessment",
                docmntUrl: "/diabetic-assessment",
                reportUrl: "/print-diabetic-assmnt"
            },
        ]
    },
    {
        "type": "ROLES",
        "coll": "cm_roles",
        "depColl": ["cm_documents"],
        "payLoad": { "audit": {} },
        "data": [
            {
                cd: "PRACTICE_ADMIN",
                label: "Practice Admin",
                documents: ["Op Assessment", "Masters", "Diabetic Assessment"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": true,
                    "write": true,
                    "delete": true,
                    "print": true,
                    "adendum": true,
                    "signOff": true,
                    "rework": true,
                    "fileUpload": true
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
            {
                cd: "DOCTOR",
                label: "Doctor",
                documents: ["Op Assessment", "Diabetic Assessment"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": true,
                    "write": true,
                    "delete": true,
                    "print": true,
                    "adendum": true,
                    "signOff": true,
                    "rework": true,
                    "fileUpload": true
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
            {
                cd: "NURSE",
                label: "Nurse",
                documents: ["Op Assessment", "Diabetic Assessment"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": true,
                    "write": true,
                    "delete": false,
                    "print": false,
                    "adendum": false,
                    "signOff": false,
                    "rework": false,
                    "fileUpload": true
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
            {
                cd: "SECRETARY",
                label: "Secretary",
                documents: ["Op Assessment", "Masters", "Diabetic Assessment"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": false,
                    "write": false,
                    "delete": false,
                    "print": false,
                    "adendum": false,
                    "signOff": false,
                    "rework": false,
                    "fileUpload": false
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
            {
                cd: "FACILITY_ADMIN",
                label: "Facility Admin",
                documents: ["Op Assessment", "Masters", "Diabetic Assessment"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": true,
                    "write": true,
                    "delete": true,
                    "print": true,
                    "adendum": true,
                    "signOff": true,
                    "rework": true,
                    "fileUpload": true
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
            {
                cd: "HIMS_SYNC",
                label: "HIMS Sync",
                documents: ["Masters"],
                access: {
                    "read": true,
                    "view": true,
                    "edit": true,
                    "write": true,
                    "delete": true,
                    "print": true,
                    "adendum": true,
                    "signOff": true,
                    "rework": true,
                    "fileUpload": true
                },
                tabsMap: [
                    {
                      "label": "Dashboard",
                      "cd": "DASH",
                      "iconClass": "pi pi-th-large",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "dashboard"
                    },
                    {
                      "label": "Appointments",
                      "cd": "APMNT",
                      "iconClass": "pi pi-clock",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "appointment"
                    },
                    {
                      "label": "Documents ",
                      "cd": "DOCMNT",
                      "iconClass": "pi pi-folder-open",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "docmnt"
                    },
                    {
                      "label": "Patients List",
                      "cd": "PAT",
                      "iconClass": "pi pi-users",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "patRegistration"
                    },
                    {
                      "label": "Result Entry",
                      "cd": "REP",
                      "iconClass": "pi pi-book",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "result"
                    },
                    {
                      "label": "Billing",
                      "cd": "BILL",
                      "iconClass": "pi pi-wallet",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "billing"
                    },
                    {
                      "label": "Settings",
                      "cd": "SET",
                      "iconClass": "pi pi-cog",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    },
                    {
                      "label": "Masters",
                      "cd": "MST",
                      "iconClass": "pi pi-table",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": "masters"
                    },
                    {
                      "label": "Sign Off",
                      "cd": "LOGOUT",
                      "iconClass": "pi pi-power-off",
                      "isActive": true,
                      "isShown": true,
                      "permission": {
                        "isActive": true,
                        "isShown": true
                      },
                      "routeUrl": ""
                    }
                  ],
            },
        ]
    },
    {
        "type": "COUNTERS",
        "coll": "cm_counters",
        "depColl": [],
        "payLoad": { "locId": "", "locName": "", "audit": {}, "orgId": "" },
        "data": [
            {
                "seqName": "UMR",
                "seqType": "MB",
                "seqValue": 0,
                "digits": 5,
                "format": "YYMM"
            },
            {
                "seqName": "Speciality",
                "seqType": "SPEC",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Specialization",
                "seqType": "SPLZ",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Complaint",
                "seqType": "CMPL",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Notification",
                "seqType": "NTFC",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Allergy",
                "seqType": "ALRG",
                "seqValue": 25,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Entity",
                "seqType": "ENTY",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Investigation",
                "seqType": "INSG",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Medication",
                "seqType": "MDCT",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Labels",
                "seqType": "LBLS",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Employee",
                "seqType": "EMPL",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Document",
                "seqType": "DCMT",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Doctor",
                "seqType": "DM",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Labelmap",
                "seqType": "LBMP",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "AdminCreatePatients",
                "seqType": "ADCP",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Bills",
                "seqType": "bill",
                "seqValue": 0,
                "digits": 4,
                "format": ""
            },
            {
                "seqName": "Transaction",
                "seqType": "TNSC",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "Consultation",
                "seqType": "CNST",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "Admission",
                "seqType": "ADMS",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "LabResults",
                "seqType": "LARS",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "Orderset",
                "seqType": "ORST",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "Orderset",
                "seqType": "ORDSET",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "InvestigationFav",
                "seqType": "INFV",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            },
            {
                "seqName": "Invoice",
                "seqType": "0",
                "seqValue": 0,
                "digits": 4,
                "format": "",
            }
        ]
    },
    {
        "type": "ENTITIES",
        "coll": "cm_entity",
        "depColl": [],
        "payLoad": { "sessionId": "", "audit": {} },
        "data": [
            {
                "cd": "TITLE",
                "label": "Title",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "MR",
                        "revNo": 1,
                        "label": "Mr.",
                        "recStatus": true
                    },
                    {
                        "cd": "MRS",
                        "revNo": 1,
                        "label": "Mrs.",
                        "recStatus": true
                    },
                    {
                        "cd": "MS",
                        "revNo": 1,
                        "label": "Ms.",
                        "recStatus": true
                    },
                    {
                        "cd": "DR",
                        "revNo": 1,
                        "label": "Dr.",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "GENDER",
                "label": "Gender",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "M",
                        "revNo": 1,
                        "label": "Male",
                        "recStatus": true
                    },
                    {
                        "cd": "F",
                        "revNo": 1,
                        "label": "Female",
                        "recStatus": true
                    },
                    {
                        "cd": "U",
                        "revNo": 1,
                        "label": "Unspecified",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "SERVICE_TYPE",
                "label": "Service Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "INVS",
                        "revNo": 1,
                        "label": "Investigations",
                        "recStatus": true
                    },
                    {
                        "cd": "SRVC",
                        "revNo": 1,
                        "label": "Services",
                        "recStatus": true
                    },
                    {
                        "cd": "PROC",
                        "revNo": 1,
                        "label": "Procedures",
                        "recStatus": true
                    },
                    {
                        "cd": "PACK",
                        "revNo": 1,
                        "label": "Packages",
                        "recStatus": true
                    },
                    {
                        "cd": "MISC",
                        "revNo": 1,
                        "label": "Miscellaneous",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "SERVICE_GROUP",
                "label": "Service Group",
                "revNo": 11,
                "recStatus": true,
                "child": [
                    {
                        "cd": "BIO",
                        "revNo": 1,
                        "label": "BIOCHEMISTRY",
                        "recStatus": true
                    },
                    {
                        "cd": "CAR",
                        "revNo": 1,
                        "label": "CARDIOLOGY",
                        "recStatus": true
                    },
                    {
                        "cd": "MIC",
                        "revNo": 1,
                        "label": "MICRO BIOLOGY",
                        "recStatus": true
                    },
                    {
                        "cd": "RAD",
                        "revNo": 1,
                        "label": "RADIOLOGY",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "cd": "PAC",
                        "revNo": 1,
                        "label": "PACKAGE",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "cd": "CTS",
                        "revNo": 1,
                        "label": "CT SCANNING",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "cd": "MRI",
                        "revNo": 1,
                        "label": "MRI",
                        "recStatus": true
                    },
                    {
                        "cd": "ORT",
                        "revNo": 1,
                        "label": "ORTHOPAEDICS",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "cd": "PUL",
                        "revNo": 1,
                        "label": "PULMONOLOGY",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "cd": "CCTA",
                        "revNo": 1,
                        "label": "CCTA",
                        "recStatus": true
                    },
                    {
                        "cd": "CAR",
                        "revNo": 1,
                        "label": "CARDIOLOGY1",
                        "recStatus": true,
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    },
                    {
                        "revNo": 1,
                        "label": "MISCELLANEOUS",
                        "recStatus": true,
                        "cd": "",
                        "iconClass": "",
                        "indicator": "",
                        "value": ""
                    }
                ]
            },
            {
                "cd": "IS_APPLICABLE_FOR",
                "label": "Is Applicable For",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "OP",
                        "revNo": 1,
                        "label": "OP",
                        "recStatus": true
                    },
                    {
                        "cd": "IP",
                        "revNo": 1,
                        "label": "IP",
                        "recStatus": true
                    },
                    {
                        "cd": "BOTH",
                        "revNo": 1,
                        "label": "Both",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "TARRIF",
                "label": "Tarrif",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "OP",
                        "revNo": 1,
                        "label": "OP",
                        "recStatus": true
                    },
                    {
                        "cd": "IP",
                        "revNo": 1,
                        "label": "IP",
                        "recStatus": true
                    },
                    {
                        "cd": "INSUR",
                        "revNo": 1,
                        "label": "Insurance",
                        "recStatus": true
                    },
                    {
                        "cd": "AROGY",
                        "revNo": 1,
                        "label": "Arogyasree",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "SPECIMAN",
                "label": "Speciman",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ONEIL",
                        "revNo": 1,
                        "label": "Oneil",
                        "recStatus": true
                    },
                    {
                        "cd": "SEMEN",
                        "revNo": 1,
                        "label": "Semen",
                        "recStatus": true
                    },
                    {
                        "cd": "SPUTUM",
                        "revNo": 1,
                        "label": "Sputum",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "CONTAINER",
                "label": "Container",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "MEMIL",
                        "revNo": 1,
                        "label": "Mcmillan",
                        "recStatus": true
                    },
                    {
                        "cd": "BOWLS",
                        "revNo": 1,
                        "label": "Bowls",
                        "recStatus": true,
                        "history": []
                    },
                    {
                        "cd": "BEAKER",
                        "revNo": 1,
                        "label": "Beakers",
                        "recStatus": true,
                        "history": []
                    },
                    {
                        "cd": "TRAY",
                        "revNo": 1,
                        "label": "Trays",
                        "recStatus": true,
                        "history": []
                    },
                    {
                        "cd": "VIALSTUB",
                        "revNo": 1,
                        "label": "Vials & Test Tubes",
                        "recStatus": true,
                        "history": []
                    }
                ]
            },
            {
                "cd": "MEDICATION_TYPE",
                "label": "Medication Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "TAB",
                        "revNo": 1,
                        "label": "Tablet",
                        "recStatus": true
                    },
                    {
                        "cd": "INJ",
                        "revNo": 1,
                        "label": "Injections",
                        "recStatus": true
                    },
                    {
                        "cd": "SUR",
                        "revNo": 1,
                        "label": "Surgicals",
                        "recStatus": true
                    },
                    {
                        "cd": "GEN",
                        "revNo": 1,
                        "label": "General",
                        "recStatus": true
                    },
                    {
                        "cd": "FLU",
                        "revNo": 1,
                        "label": "Fluids",
                        "recStatus": true
                    },
                    {
                        "cd": "NCOS",
                        "revNo": 1,
                        "label": "Non Consumables",
                        "recStatus": true
                    },
                    {
                        "cd": "COS",
                        "revNo": 1,
                        "label": "Consumables",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "GENERIC",
                "label": "Generic",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "MOOO758",
                        "revNo": 1,
                        "label": "TRAMADOL HCL PARACETAMOL DOMPERIDNE",
                        "recStatus": true
                    },
                    {
                        "cd": "MOOO759",
                        "revNo": 1,
                        "label": "PARACETAMOL DOMPERIDNE",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "UNITS",
                "label": "Units",
                "revNo": 10,
                "recStatus": true,
                "child": [
                    {
                        "cd": "MG",
                        "revNo": 1,
                        "label": "MG",
                        "recStatus": true
                    },
                    {
                        "cd": "ML",
                        "revNo": 1,
                        "label": "ML",
                        "recStatus": true
                    },
                    {
                        "cd": "MM",
                        "revNo": 1,
                        "label": "MM",
                        "recStatus": true
                    },
                    {
                        "cd": "KG",
                        "revNo": 1,
                        "label": "KG",
                        "recStatus": true
                    },
                    {
                        "cd": "FINGERTIP",
                        "label": "FINGERTIP",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "TABLESPOON",
                        "label": "TABLESPOON",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "PUFFS",
                        "label": "PUFFS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "RESPULES",
                        "label": "RESPULES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ROTACAPS",
                        "label": "ROTACAPS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SACHET",
                        "label": "SACHET",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SPRAY",
                        "label": "SPRAY",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "Gm/gm",
                        "label": "Gm/gm",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS",
                        "label": "DROPS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "MCG",
                        "label": "MCG",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "U",
                        "label": "U",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "NO",
                        "label": "NO",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "%w/v",
                        "label": "%w/v",
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "ROUTE",
                "label": "Route",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ORL",
                        "revNo": 1,
                        "label": "Oral",
                        "recStatus": true
                    },
                    {
                        "cd": "AUR",
                        "revNo": 1,
                        "label": "Auricular(OTIC)",
                        "recStatus": true
                    },
                    {
                        "cd": "BUCCAL",
                        "revNo": 1,
                        "label": "BUCCAL",
                        "recStatus": true
                    },
                    {
                        "cd": "CONJUNC",
                        "revNo": 1,
                        "label": "CONJUNCTIVAL",
                        "recStatus": true
                    },
                    {
                        "cd": "DENTAL",
                        "revNo": 1,
                        "label": "DENTAL",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "FREQUENCY",
                "label": "Frequency",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "3HRS",
                        "label": "Every 3 hours",
                        "value": "3hours",
                        "indicator": "1-0-0",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "ప్రతి మూడు గంటలకు ఒకసారి"
                            },
                            {
                                "label": "Hindi",
                                "value": "हर तीन  घंटे में एक बार"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "ஒவ்வொரு மூன்று மணி நேரத்திற்கும் ஒரு முறை"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ഓരോ മൂന്ന് മണിക്കൂറിലും ഒരിക്കൽ"
                            },
                            {
                                "label": "Telugu",
                                "value": " మూడు గంటలకు ఒకసారి"
                            },
                            {
                                "label": "Telugu",
                                "value": "ప్రతి మూడు గంటలకు ఒకసారి"
                            },
                            {
                                "label": "Malayalam",
                                "value": ""
                            },
                            {
                                "label": "Malayalam",
                                "value": "ഓരോ മൂന്ന് മണിക്കൂറിലും ഒരിക്കൽ"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "4HRS",
                        "label": "Every 4 hours",
                        "value": "Every 4 hours",
                        "indicator": "1-0-0-0",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "ప్రతి నాలుగు గంటలకు ఒకసారి"
                            },
                            {
                                "label": "Hindi",
                                "value": "हर  चार घंटे में एक बार"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "ஒவ்வொரு நான்கு  மணி நேரத்திற்கும் ஒரு முறை"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ഓരോ നാല്  മണിക്കൂറിലും ഒരിക്കൽ"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "",
                        "iconClass": "",
                        "label": "",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "2HOURS",
                        "iconClass": "",
                        "label": "2 hours",
                        "value": "Two hours",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "",
                        "iconClass": "",
                        "label": "",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "",
                        "iconClass": "",
                        "label": "",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "",
                        "iconClass": "",
                        "label": "",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "2",
                        "label": "1",
                        "value": "3",
                        "indicator": "4",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "ab"
                            },
                            {
                                "label": "Hindi",
                                "value": "b"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "c"
                            },
                            {
                                "label": "Malayalam",
                                "value": "d"
                            },
                            {
                                "label": "Telugu",
                                "value": "a"
                            },
                            {
                                "label": "Telugu",
                                "value": "aa"
                            },
                            {
                                "label": "Hindi",
                                "value": "bbb"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "ccccc"
                            },
                            {
                                "label": "Malayalam",
                                "value": "dddddd"
                            },
                            {
                                "label": "Telugu",
                                "value": "a"
                            },
                            {
                                "label": "Hindi",
                                "value": "b"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "c"
                            },
                            {
                                "label": "Malayalam",
                                "value": "d"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "a",
                        "label": "ab",
                        "value": "a",
                        "indicator": "a",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "b"
                            },
                            {
                                "label": "Hindi",
                                "value": "bb"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "b"
                            },
                            {
                                "label": "Malayalam",
                                "value": "b"
                            },
                            {
                                "label": "Telugu",
                                "value": "bb"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "sd",
                        "label": "34",
                        "value": "asd",
                        "indicator": "asdasd",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "2"
                            },
                            {
                                "label": "Hindi",
                                "value": "222"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "2222"
                            },
                            {
                                "label": "Malayalam",
                                "value": "2222"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1,
                        "iconClass": ""
                    },
                    {
                        "cd": "a",
                        "iconClass": "",
                        "label": "b",
                        "value": "acccc",
                        "indicator": "cca",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "aa"
                            },
                            {
                                "label": "Hindi",
                                "value": "a"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "a"
                            },
                            {
                                "label": "Malayalam",
                                "value": "a"
                            },
                            {
                                "label": "Telugu",
                                "value": "aac"
                            },
                            {
                                "label": "Hindi",
                                "value": "ac"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "ac"
                            },
                            {
                                "label": "Malayalam",
                                "value": "c"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "b",
                        "iconClass": "",
                        "label": "b",
                        "value": "b",
                        "indicator": "b",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "b"
                            },
                            {
                                "label": "Hindi",
                                "value": "b"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "b"
                            },
                            {
                                "label": "Malayalam",
                                "value": "b"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "2344",
                        "iconClass": "",
                        "label": "2342342",
                        "value": "324234",
                        "indicator": "2342",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "4234"
                            },
                            {
                                "label": "Hindi",
                                "value": "234"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "234"
                            },
                            {
                                "label": "Malayalam",
                                "value": "234"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "SCHEDULE_DRUG",
                "label": "Schedule Drug",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "SA",
                        "revNo": 1,
                        "label": "Schedule-A",
                        "recStatus": true
                    },
                    {
                        "cd": "SB",
                        "revNo": 1,
                        "label": "Schedule-B",
                        "recStatus": true
                    },
                    {
                        "cd": "SH",
                        "revNo": 1,
                        "label": "Schedule-H",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "INSTRUCTIONS",
                "label": "Instructions",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "AF",
                        "label": "After food",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "తిన్న తరువాత"
                            },
                            {
                                "label": "Hindi",
                                "value": "भोजन के बाद"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "உணவுக்குப் பிறகு"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ഭക്ഷണത്തിനു ശേഷം"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "BF",
                        "label": "Before food",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "తిన్నకు ముందు"
                            },
                            {
                                "label": "Hindi",
                                "value": "भोजन से पहले\t"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "உணவுக்கு முன்"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ഭക്ഷണത്തിന് മുമ്പ്"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "DOCTOR_TYPE",
                "label": "Doctor Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "PHY",
                        "revNo": 1,
                        "label": "Physician",
                        "recStatus": true
                    },
                    {
                        "cd": "SURG",
                        "revNo": 1,
                        "label": "Surgeon",
                        "recStatus": true
                    },
                    {
                        "cd": "AUDIO",
                        "revNo": 1,
                        "label": "Audiologists",
                        "recStatus": true
                    },
                    {
                        "cd": "CARD",
                        "revNo": 1,
                        "label": "Cardiologists",
                        "recStatus": true
                    },
                    {
                        "cd": "DENT",
                        "revNo": 1,
                        "label": "Dentist",
                        "recStatus": true
                    },
                    {
                        "cd": "ENDO",
                        "revNo": 1,
                        "label": "Endocrinologist",
                        "recStatus": true
                    },
                    {
                        "cd": "RADIO",
                        "revNo": 1,
                        "label": "Radiologist",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "QMS",
                "label": "Qms",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "F",
                        "revNo": 1,
                        "label": "First in First out",
                        "recStatus": true
                    },
                    {
                        "cd": "SG",
                        "revNo": 1,
                        "label": "Schedule Generated",
                        "recStatus": true
                    },
                    {
                        "cd": "SQG",
                        "revNo": 1,
                        "label": "Sequentially Generated",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "EMPLOYEE_TYPE",
                "label": "Employee Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "PER",
                        "revNo": 1,
                        "label": "Permanent",
                        "recStatus": true
                    },
                    {
                        "cd": "TEMP",
                        "revNo": 1,
                        "label": "Temporary",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DESIGNATION",
                "label": "Designation",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ADMN",
                        "revNo": 1,
                        "label": "Administrator",
                        "recStatus": true
                    },
                    {
                        "cd": "CEO",
                        "revNo": 1,
                        "label": "C.E.O",
                        "recStatus": true
                    },
                    {
                        "cd": "FOE",
                        "revNo": 1,
                        "label": "Front Office Executive",
                        "recStatus": true
                    },
                    {
                        "cd": "SCRT",
                        "revNo": 1,
                        "label": "Secretary",
                        "recStatus": true
                    },
                    {
                        "cd": "CONEURPHY",
                        "revNo": 1,
                        "label": "Consultant Neuro Physician",
                        "recStatus": true
                    },
                    {
                        "cd": "SRCONS",
                        "revNo": 1,
                        "label": "sr.cons",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "QUALIFICATION",
                "label": "Qualification",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "MBBSO",
                        "revNo": 1,
                        "label": "MBBS O",
                        "recStatus": true
                    },
                    {
                        "cd": "MBBSMD",
                        "revNo": 1,
                        "label": "MBBS, MD,DM (Neuro)",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "SPECIALITY",
                "label": "Speciality",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ADMNDEP",
                        "revNo": 1,
                        "label": "Admin Department",
                        "recStatus": true
                    },
                    {
                        "cd": "BMT",
                        "revNo": 1,
                        "label": "BMT",
                        "recStatus": true
                    },
                    {
                        "cd": "CARD",
                        "revNo": 1,
                        "label": "Cardiology",
                        "recStatus": true
                    },
                    {
                        "cd": "CTSURG",
                        "revNo": 1,
                        "label": "Ct Surgery",
                        "recStatus": true
                    },
                    {
                        "cd": "DIALYSIS",
                        "revNo": 1,
                        "label": "DIALYSIS",
                        "recStatus": true
                    },
                    {
                        "cd": "GENMED",
                        "revNo": 1,
                        "label": "General Medicine",
                        "recStatus": true
                    },
                    {
                        "cd": "NEURSURG",
                        "revNo": 1,
                        "label": "Neuro Surgery",
                        "recStatus": true
                    },
                    {
                        "cd": "UROLOG",
                        "revNo": 1,
                        "label": "Urology",
                        "recStatus": true
                    },
                    {
                        "cd": "Endocrinologist",
                        "iconClass": "",
                        "label": "Endocrinologist",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "SPECIALIZATION",
                "label": "Specialization",
                "revNo": 2,
                "recStatus": true,
                "child": [
                    {
                        "cd": "GENMEDIC",
                        "revNo": 1,
                        "label": "General Medicine",
                        "recStatus": true
                    },
                    {
                        "cd": "BMT",
                        "revNo": 1,
                        "label": "BMT",
                        "recStatus": true
                    },
                    {
                        "cd": "CARD",
                        "revNo": 1,
                        "label": "Cardiology",
                        "recStatus": true
                    },
                    {
                        "cd": "CARDSURG",
                        "revNo": 1,
                        "label": "Cardiothoracic Surgeon",
                        "recStatus": true
                    },
                    {
                        "cd": "DIALYSIS",
                        "revNo": 1,
                        "label": "DIALYSIS",
                        "recStatus": true
                    },
                    {
                        "cd": "DIALYTECH",
                        "revNo": 1,
                        "label": "DIALYSIS TECHNICIAN",
                        "recStatus": true
                    },
                    {
                        "cd": "NEURSURG",
                        "revNo": 1,
                        "label": "Neuro Surgery",
                        "recStatus": true
                    },
                    {
                        "cd": "NEURGST",
                        "revNo": 1,
                        "label": "Neurologist",
                        "recStatus": true
                    },
                    {
                        "cd": "UROLOG",
                        "revNo": 1,
                        "label": "Urology",
                        "recStatus": true
                    },
                    {
                        "cd": "Endocrinologist",
                        "iconClass": "",
                        "label": "Endocrinologist",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "PAYERTYPE",
                "label": "Payer Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "CORPORATE",
                        "revNo": 1,
                        "label": "Corporate",
                        "recStatus": true
                    },
                    {
                        "cd": "GENERAL",
                        "revNo": 1,
                        "label": "General",
                        "recStatus": true
                    },
                    {
                        "cd": "INSURANCE",
                        "revNo": 1,
                        "label": "Insurance",
                        "recStatus": true
                    },
                    {
                        "cd": "STAFF",
                        "revNo": 1,
                        "label": "Staff",
                        "recStatus": true
                    },
                    {
                        "cd": "STD",
                        "revNo": 1,
                        "label": "Staff Dependent",
                        "recStatus": true
                    },
                    {
                        "cd": "CASH",
                        "revNo": 1,
                        "label": "Cash",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "BLOODGROUP",
                "label": "Blood GRoup",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "A",
                        "revNo": 1,
                        "label": "A",
                        "recStatus": true
                    },
                    {
                        "cd": "B",
                        "revNo": 1,
                        "label": "B",
                        "recStatus": true
                    },
                    {
                        "cd": "AB",
                        "revNo": 1,
                        "label": "AB",
                        "recStatus": true
                    },
                    {
                        "cd": "O",
                        "revNo": 1,
                        "label": "O",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "RESPPERSON",
                "label": "Responsible Person",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "BRO",
                        "revNo": 1,
                        "label": "Brother",
                        "recStatus": true
                    },
                    {
                        "cd": "CHLD1",
                        "revNo": 1,
                        "label": "CHILD ONE",
                        "recStatus": true
                    },
                    {
                        "cd": "CHLD2",
                        "revNo": 1,
                        "label": "CHILD TWO",
                        "recStatus": true
                    },
                    {
                        "cd": "DINL",
                        "revNo": 1,
                        "label": "Daughter In Law",
                        "recStatus": true
                    },
                    {
                        "cd": "FTHR",
                        "revNo": 1,
                        "label": "Father",
                        "recStatus": true
                    },
                    {
                        "cd": "FINL",
                        "revNo": 1,
                        "label": "Father In Law",
                        "recStatus": true
                    },
                    {
                        "cd": "GNDFTHR",
                        "revNo": 1,
                        "label": "Grand Father",
                        "recStatus": true
                    },
                    {
                        "cd": "GNDMTHR",
                        "revNo": 1,
                        "label": "Grand Mother",
                        "recStatus": true
                    },
                    {
                        "cd": "MGNDFTHR",
                        "revNo": 1,
                        "label": "Maternal GrandFather",
                        "recStatus": true
                    },
                    {
                        "cd": "MGNDMTHR",
                        "revNo": 1,
                        "label": "Maternal GrandMother",
                        "recStatus": true
                    },
                    {
                        "cd": "MTHR",
                        "revNo": 1,
                        "label": "Mother",
                        "recStatus": true
                    },
                    {
                        "cd": "MINL",
                        "revNo": 1,
                        "label": "Mother In Law",
                        "recStatus": true
                    },
                    {
                        "cd": "PGNDFTHR",
                        "revNo": 1,
                        "label": "Paternal GrandFather",
                        "recStatus": true
                    },
                    {
                        "cd": "PGNDMTHR",
                        "revNo": 1,
                        "label": "Paternal GrandMother",
                        "recStatus": true
                    },
                    {
                        "cd": "SLF",
                        "revNo": 1,
                        "label": "Self",
                        "recStatus": true
                    },
                    {
                        "cd": "SIS",
                        "revNo": 1,
                        "label": "Sister",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DISEASE",
                "label": "Disease",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ARTHRITIS",
                        "revNo": 1,
                        "label": "Arthritis",
                        "recStatus": true
                    },
                    {
                        "cd": "ASTHMA",
                        "revNo": 1,
                        "label": "Asthma",
                        "recStatus": true
                    },
                    {
                        "cd": "CANCER",
                        "revNo": 1,
                        "label": "Cancer",
                        "recStatus": true
                    },
                    {
                        "cd": "CORONARYHEART",
                        "revNo": 1,
                        "label": "Coronary Heart Disease",
                        "recStatus": true
                    },
                    {
                        "cd": "DIABETES",
                        "revNo": 1,
                        "label": "Diabetes",
                        "recStatus": true
                    },
                    {
                        "cd": "DYSLIPIDEMIA",
                        "revNo": 1,
                        "label": "Dyslipidemia",
                        "recStatus": true
                    },
                    {
                        "cd": "HYPERTENSION",
                        "revNo": 1,
                        "label": "Hypertension",
                        "recStatus": true
                    },
                    {
                        "cd": "MENTAL",
                        "revNo": 1,
                        "label": "Mental Disease",
                        "recStatus": true
                    },
                    {
                        "cd": "OTHERS1",
                        "revNo": 1,
                        "label": "Others1",
                        "recStatus": true
                    },
                    {
                        "cd": "OTHERS2",
                        "revNo": 1,
                        "label": "Others2",
                        "recStatus": true
                    },
                    {
                        "cd": "OTHERS3",
                        "revNo": 1,
                        "label": "Others3",
                        "recStatus": true
                    },
                    {
                        "cd": "RESPIRATORY",
                        "revNo": 1,
                        "label": "Respiratory Disease",
                        "recStatus": true
                    },
                    {
                        "cd": "STROKE",
                        "revNo": 1,
                        "label": "Stroke",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DURATION",
                "label": "Duration",
                "revNo": 148,
                "recStatus": true,
                "child": [
                    {
                        "cd": "SECONDS",
                        "label": "Weeks",
                        "value": "7",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "సెకన్లు"
                            },
                            {
                                "label": "Hindi",
                                "value": "सेकंड"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "வினாடிகள்"
                            },
                            {
                                "label": "Malayalam",
                                "value": "സെക്കൻ്റുകൾ"
                            },
                            {
                                "label": "Telugu",
                                "value": "వారాలు"
                            },
                            {
                                "label": "Hindi",
                                "value": "हफ्तों"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "வாரங்கள்"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ആഴ്ചകൾ"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "MINS",
                        "label": "Days",
                        "value": "1",
                        "lang": [
                            {
                                "label": "Telugu",
                                "value": "నిమిషాలు"
                            },
                            {
                                "label": "Hindi",
                                "value": "मिनट"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "நிமிடங்கள்"
                            },
                            {
                                "label": "Malayalam",
                                "value": "മിനിറ്റ്"
                            },
                            {
                                "label": "Telugu",
                                "value": "రోజులు"
                            },
                            {
                                "label": "Hindi",
                                "value": "दिन"
                            },
                            {
                                "label": "Tamil\t",
                                "value": "நாட்களில்"
                            },
                            {
                                "label": "Malayalam",
                                "value": "ദിവസങ്ങളിൽ"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "RESONFORVISIT",
                "label": "Reson For Visit",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "Illness",
                        "revNo": 1,
                        "label": "Illness",
                        "recStatus": true
                    },
                    {
                        "cd": "General Consultation",
                        "revNo": 1,
                        "label": "General Consultation",
                        "recStatus": true
                    },
                    {
                        "cd": "General Follow Up",
                        "revNo": 1,
                        "label": "General Follow Up",
                        "recStatus": true
                    },
                    {
                        "cd": "Annual Physical",
                        "revNo": 1,
                        "label": "Annual Physical",
                        "recStatus": true
                    },
                    {
                        "cd": "Cardiovascular Screening Visit",
                        "revNo": 1,
                        "label": "Cardiovascular Screening Visit",
                        "recStatus": true
                    },
                    {
                        "cd": "Pre-Surgery Checkup",
                        "revNo": 1,
                        "label": "Pre-Surgery Checkup",
                        "recStatus": true
                    },
                    {
                        "cd": "Pre-Travel Checkup",
                        "revNo": 1,
                        "label": "Pre-Travel Checkup",
                        "recStatus": true
                    },
                    {
                        "cd": "Prescription / Refill",
                        "revNo": 1,
                        "label": "Prescription / Refill",
                        "recStatus": true
                    },
                    {
                        "cd": "STD (Sexually Transmitted Disease)",
                        "revNo": 1,
                        "label": "STD (Sexually Transmitted Disease)",
                        "recStatus": true
                    },
                    {
                        "cd": "Abscess",
                        "revNo": 1,
                        "label": "Abscess",
                        "recStatus": true
                    },
                    {
                        "cd": "Tooth Pain",
                        "revNo": 1,
                        "label": "Tooth Pain",
                        "recStatus": true
                    },
                    {
                        "cd": "Bleeding Gums",
                        "revNo": 1,
                        "label": "Bleeding Gums",
                        "recStatus": true
                    },
                    {
                        "cd": "Dental Decay",
                        "revNo": 1,
                        "label": "Dental Decay",
                        "recStatus": true
                    },
                    {
                        "cd": "Dental Cosmetics",
                        "revNo": 1,
                        "label": "Dental Cosmetics",
                        "recStatus": true
                    },
                    {
                        "cd": "Braces/Orthodentics",
                        "revNo": 1,
                        "label": "Braces/Orthodentics",
                        "recStatus": true
                    },
                    {
                        "cd": "Acne",
                        "revNo": 1,
                        "label": "Acne",
                        "recStatus": true
                    },
                    {
                        "cd": "Addiction / Substance Abuse",
                        "revNo": 1,
                        "label": "Addiction / Substance Abuse",
                        "recStatus": true
                    },
                    {
                        "cd": "Alcoholism",
                        "revNo": 1,
                        "label": "Alcoholism",
                        "recStatus": true
                    },
                    {
                        "cd": "Allergic Cough",
                        "revNo": 1,
                        "label": "Allergic Cough",
                        "recStatus": true
                    },
                    {
                        "cd": "Annual Skin Screening",
                        "revNo": 1,
                        "label": "Annual Skin Screening",
                        "recStatus": true
                    },
                    {
                        "cd": "Anti-Aging Treatment",
                        "revNo": 1,
                        "label": "Anti-Aging Treatment",
                        "recStatus": true
                    },
                    {
                        "cd": "Arthritis",
                        "revNo": 1,
                        "label": "Arthritis",
                        "recStatus": true
                    },
                    {
                        "cd": "Asthma",
                        "revNo": 1,
                        "label": "Asthma",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DATA",
                "label": "data",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "O",
                        "revNo": 1,
                        "label": "By Online",
                        "recStatus": true
                    },
                    {
                        "cd": "P",
                        "revNo": 1,
                        "label": "By Phone",
                        "recStatus": true
                    },
                    {
                        "cd": "W",
                        "revNo": 1,
                        "label": "Walk-in",
                        "recStatus": true
                    },
                    {
                        "cd": "C",
                        "revNo": 1,
                        "label": "Clinics",
                        "recStatus": true
                    },
                    {
                        "cd": "E",
                        "revNo": 1,
                        "label": "Email",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0061",
                        "label": "Label 1",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ENTY0062",
                        "label": "Label 2",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ENTY0071",
                        "revNo": 1,
                        "label": "Label 3",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0072",
                        "revNo": 1,
                        "label": "Label 4",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DMS",
                "label": "DMS",
                "revNo": 14,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ENTY0073",
                        "revNo": 1,
                        "label": "Label-1111asasas",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0074",
                        "label": "Label-2",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ENTY0075",
                        "label": "Label-3",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "label": "Label-4",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "label": "Data",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "revNo": 1,
                        "label": "Label-1111",
                        "recStatus": true
                    },
                    {
                        "revNo": 1,
                        "label": "label-123",
                        "recStatus": true
                    },
                    {
                        "revNo": 1,
                        "label": "Label DMS123",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "APMNTTYPE",
                "label": "Appointment Type",
                "revNo": 7,
                "recStatus": true,
                "child": [
                    {
                        "cd": "NORMAL",
                        "revNo": 1,
                        "label": "NORMAL",
                        "recStatus": true
                    },
                    {
                        "cd": "ONLINE",
                        "revNo": 1,
                        "label": "ONLINE",
                        "recStatus": true
                    },
                    {
                        "cd": "REVISIT",
                        "revNo": 1,
                        "label": "REVISIT",
                        "recStatus": true
                    },
                    {
                        "cd": "REVIEW",
                        "revNo": 1,
                        "label": "REVIEW",
                        "recStatus": true
                    },
                    {
                        "cd": "EMERGENCY",
                        "revNo": 1,
                        "label": "EMERGENCY",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DATA1",
                "label": "data",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ENTY0076",
                        "revNo": 1,
                        "label": "Label 3 ddd",
                        "recStatus": false
                    },
                    {
                        "cd": "dddd",
                        "label": "sddd",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "DATA2",
                "label": "data",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ENTY0078",
                        "revNo": 1,
                        "label": "Label 3",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DOCUMENT_GROUP",
                "label": "Document Group",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ENTY0089",
                        "iconClass": "pi pi-user",
                        "revNo": 1,
                        "label": "Doctor",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0090",
                        "iconClass": "pi pi-user-plus",
                        "revNo": 1,
                        "label": "Nurse",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0091",
                        "iconClass": "pi pi-users",
                        "revNo": 1,
                        "label": "Dietary",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0092",
                        "iconClass": "pi pi-users",
                        "revNo": 1,
                        "label": "Masters",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0093",
                        "iconClass": "pi pi-users",
                        "revNo": 1,
                        "label": "Orders",
                        "recStatus": true
                    },
                    {
                        "cd": "sdfsd",
                        "iconClass": "pi pi-user",
                        "label": "saikrishna",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "DUE_REASONS",
                "label": "Due Reasons",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ENTY0094",
                        "revNo": 1,
                        "label": "Balance owed",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0095",
                        "revNo": 1,
                        "label": "Deposit on procedure",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0096",
                        "revNo": 1,
                        "label": "Doctors Request",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0097",
                        "revNo": 1,
                        "label": "Insufficient Funds",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0098",
                        "revNo": 1,
                        "label": "Office Discount",
                        "recStatus": true
                    },
                    {
                        "cd": "ENTY0099",
                        "revNo": 1,
                        "label": "Part Payment on due amount",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "DOCUMENT_GROUP12",
                "label": "Document 122",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "DOCTOR",
                        "revNo": 1,
                        "label": "Doctor",
                        "recStatus": true
                    },
                    {
                        "cd": "NURSE",
                        "revNo": 1,
                        "label": "Nurse",
                        "recStatus": true
                    },
                    {
                        "cd": "DIET",
                        "revNo": 1,
                        "label": "Dietary",
                        "recStatus": true
                    },
                    {
                        "cd": "MASTERS",
                        "revNo": 1,
                        "label": "Masters",
                        "recStatus": true
                    },
                    {
                        "cd": "ORDERS",
                        "revNo": 1,
                        "label": "Orders",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "MARITALSTATUS",
                "label": "Marital Status",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "S",
                        "revNo": 1,
                        "label": "Single",
                        "recStatus": true
                    },
                    {
                        "cd": "M",
                        "revNo": 1,
                        "label": "Married",
                        "recStatus": true
                    },
                    {
                        "cd": "D",
                        "revNo": 1,
                        "label": "Divours",
                        "recStatus": true
                    },
                    {
                        "cd": "W",
                        "revNo": 1,
                        "label": "Widow",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "LANGUAGE",
                "label": "Languages",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "1",
                        "label": "Telugu",
                        "lang": [],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "2",
                        "label": "Hindi",
                        "lang": [],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "3",
                        "label": "Tamil\t",
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "Hindi"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "4",
                        "label": "Malayalam",
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "Hindi"
                            }
                        ],
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "ADDRESSTYPE",
                "label": "Address Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "PER",
                        "revNo": 1,
                        "label": "Permanent",
                        "recStatus": true
                    },
                    {
                        "cd": "RENT",
                        "revNo": 1,
                        "label": "Rent",
                        "recStatus": true
                    },
                    {
                        "cd": "HST",
                        "revNo": 1,
                        "label": "Hostel",
                        "recStatus": true
                    },
                    {
                        "cd": "OFC",
                        "revNo": 1,
                        "label": "Office",
                        "recStatus": true
                    },
                    {
                        "cd": "TEMP",
                        "revNo": 1,
                        "label": "Temporary",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "PROOFTYPE",
                "label": "Proof Type",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "ADHAR",
                        "revNo": 1,
                        "label": "Aadhar",
                        "recStatus": true
                    },
                    {
                        "cd": "DRVL",
                        "revNo": 1,
                        "label": "Driving License",
                        "recStatus": true
                    },
                    {
                        "cd": "PSPT",
                        "revNo": 1,
                        "label": "Passport",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "CANCELREASON",
                "label": "Cancel Reason",
                "revNo": 1,
                "recStatus": true,
                "child": [
                    {
                        "cd": "APMNTRESC",
                        "revNo": 1,
                        "label": "Appointment Rescheduled",
                        "recStatus": true
                    },
                    {
                        "cd": "CLIMTCON",
                        "revNo": 1,
                        "label": "Climatic Conditions",
                        "recStatus": true
                    },
                    {
                        "cd": "DOCAN",
                        "revNo": 1,
                        "label": "Doctor Cancelled",
                        "recStatus": true
                    },
                    {
                        "cd": "DOCNAVL",
                        "revNo": 1,
                        "label": "Doctor is not available at the moment.",
                        "recStatus": true
                    },
                    {
                        "cd": "UNAVDCIR",
                        "revNo": 1,
                        "label": "Due to unavoidable circumstances the appointment has been cancelled.",
                        "recStatus": true
                    },
                    {
                        "cd": "HELTNSP",
                        "revNo": 1,
                        "label": "Health not Supporting",
                        "recStatus": true
                    },
                    {
                        "cd": "MERGSLT",
                        "revNo": 1,
                        "label": "Merging Slots",
                        "recStatus": true
                    },
                    {
                        "cd": "PATREQ",
                        "revNo": 1,
                        "label": "Patient Requested",
                        "recStatus": true
                    },
                    {
                        "cd": "REPDLY",
                        "revNo": 1,
                        "label": "Reports Delay",
                        "recStatus": true
                    },
                    {
                        "cd": "OTHR",
                        "revNo": 1,
                        "label": "Others",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "RELIGION",
                "label": "Religion",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "BUDDISM",
                        "revNo": 1,
                        "label": "Buddism",
                        "recStatus": true
                    },
                    {
                        "cd": "CRSTNTY",
                        "revNo": 1,
                        "label": "Christian",
                        "recStatus": true
                    },
                    {
                        "cd": "HINDU",
                        "revNo": 1,
                        "label": "Hindu",
                        "recStatus": true
                    },
                    {
                        "cd": "JAINISM",
                        "revNo": 1,
                        "label": "Jainism",
                        "recStatus": true
                    },
                    {
                        "cd": "Muslim",
                        "revNo": 1,
                        "label": "Muslim",
                        "recStatus": true
                    },
                    {
                        "cd": "OTHERS",
                        "revNo": 1,
                        "label": "Others",
                        "recStatus": true
                    },
                    {
                        "cd": "Sikh",
                        "revNo": 1,
                        "label": "Sikh",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "NATIONALITY",
                "label": "Nationality",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "AMRCAN",
                        "revNo": 1,
                        "label": "American",
                        "recStatus": true
                    },
                    {
                        "cd": "INDN",
                        "revNo": 1,
                        "label": "Indian",
                        "recStatus": true
                    },
                    {
                        "cd": "NIGERIAN",
                        "revNo": 1,
                        "label": "Nigerian",
                        "recStatus": true
                    },
                    {
                        "cd": "AFGHAN",
                        "revNo": 1,
                        "label": "Afghan",
                        "recStatus": true
                    },
                    {
                        "cd": "ANDORRAN",
                        "revNo": 1,
                        "label": "Andorran",
                        "recStatus": true
                    },
                    {
                        "cd": "BANGLADESH",
                        "revNo": 1,
                        "label": "Bangladesh",
                        "recStatus": true
                    },
                    {
                        "cd": "BELGIAN",
                        "revNo": 1,
                        "label": "Belgian",
                        "recStatus": true
                    },
                    {
                        "cd": "CANADIAN",
                        "revNo": 1,
                        "label": "Canadian",
                        "recStatus": true
                    },
                    {
                        "cd": "JAMAICAN",
                        "revNo": 1,
                        "label": "Jamaican"
                    },
                    {
                        "cd": "JAPANESE",
                        "revNo": 1,
                        "label": "Japanese",
                        "recStatus": true
                    },
                    {
                        "cd": "KOREAN",
                        "revNo": 1,
                        "label": "Korean",
                        "recStatus": true
                    },
                    {
                        "cd": "MALDIVIAN",
                        "revNo": 1,
                        "label": "Maldivian",
                        "recStatus": true
                    },
                    {
                        "cd": "NEPALESE",
                        "revNo": 1,
                        "label": "Nepalese"
                    },
                    {
                        "cd": "OTH",
                        "revNo": 1,
                        "label": "Others",
                        "recStatus": true
                    }
                ]
            },
            {
                "cd": "FORMTYPE",
                "label": "Form Type",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "BISCUIT",
                        "label": "BISCUIT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "CAPSULE",
                        "label": "CAPSULE",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "CREAM",
                        "label": "CREAM",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS",
                        "label": "DROPS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS-EAR",
                        "label": "DROPS-EAR",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS-EYE",
                        "label": "DROPS-EYE",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS-EYE/EAR",
                        "label": "DROPS-EYE/EAR",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS-NASAL",
                        "label": "DROPS-NASAL",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "DROPS-ORAL",
                        "label": "DROPS-ORAL",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ELIXIR",
                        "label": "ELIXIR",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ENEMA",
                        "label": "ENEMA",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "EXPECTORANT",
                        "label": "EXPECTORANT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "FLEXPEN",
                        "label": "FLEXPEN",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "GEL",
                        "label": "GEL",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "GRANULES",
                        "label": "GRANULES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "GUMMIES",
                        "label": "GUMMIES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "INFUSION",
                        "label": "INFUSION",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "INHALER",
                        "label": "INHALER",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "INJECTION",
                        "label": "INJECTION",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "IV FLUIDS",
                        "label": "IV FLUIDS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "LIQUID",
                        "label": "LIQUID",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "LOTION",
                        "label": "LOTION",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "LOZENGES",
                        "label": "LOZENGES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "MOUTH PAINT",
                        "label": "MOUTH PAINT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "MULTIHALER",
                        "label": "MULTIHALER",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "NOS",
                        "label": "NOS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "NUMBERS",
                        "label": "NUMBERS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "OIL",
                        "label": "OIL",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "OINTMENT",
                        "label": "OINTMENT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "PAINT",
                        "label": "PAINT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "PATCH",
                        "label": "PATCH",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "PESSARIES",
                        "label": "PESSARIES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "PKT",
                        "label": "PKT",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "POWDER",
                        "label": "POWDER",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "RESPULES",
                        "label": "RESPULES",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ROTACAP",
                        "label": "ROTACAP",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SHAMPOO",
                        "label": "SHAMPOO",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SOAP",
                        "label": "SOAP",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SOLUTION",
                        "label": "SOLUTION",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SPRAY",
                        "label": "SPRAY",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SUPPOSITORY",
                        "label": "SUPPOSITORY",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SURGICAL",
                        "label": "SURGICAL",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SUSPENSION",
                        "label": "SUSPENSION",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "SYRUP",
                        "label": "SYRUP",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "TABLET",
                        "label": "TABLET",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "VACCINE",
                        "label": "VACCINE",
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "ITEMCLASS",
                "label": "ItemClas1",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "5-HT3 RECEPTOR ANTAGONIST",
                        "label": "5-HT3 RECEPTOR ANTAGONIST",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ACETAMINOPHEN ANALGESIC &ANTIPYRETIC",
                        "label": "ACETAMINOPHEN ANALGESIC &ANTIPYRETIC",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ACIDOPHILUS",
                        "label": "ACIDOPHILUS",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "ACUTE CHONIC INFECTION HEPATIS B",
                        "label": "ACUTE CHONIC INFECTION HEPATIS B",
                        "recStatus": true,
                        "revNo": 1
                    }
                ]
            },
            {
                "cd": "CIMSTYPE",
                "label": "CIMSTY1",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "GenericItem",
                        "label": "GenericItemlw",
                        "revNo": 1,
                        "recStatus": true
                    },
                    {
                        "cd": "GGPI",
                        "label": "GGPI",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "Product",
                        "label": "Product",
                        "recStatus": true,
                        "revNo": 1
                    },
                    {
                        "cd": "",
                        "label": "product",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "English"
                            },
                            {
                                "label": "Hindi"
                            },
                            {
                                "label": "Tamil"
                            },
                            {
                                "label": "Malayalam"
                            },
                            {
                                "label": "marati"
                            },
                            {
                                "label": "Kannada"
                            },
                            {
                                "label": "spanish"
                            },
                            {
                                "label": "Oriya"
                            },
                            {
                                "label": "French"
                            },
                            {
                                "label": "arabic"
                            }
                        ]
                    },
                    {
                        "cd": "",
                        "label": "w",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "English"
                            },
                            {
                                "label": "Hindi"
                            },
                            {
                                "label": "Tamil"
                            },
                            {
                                "label": "Malayalam"
                            },
                            {
                                "label": "marati"
                            },
                            {
                                "label": "Kannada"
                            },
                            {
                                "label": "spanish"
                            },
                            {
                                "label": "Oriya"
                            },
                            {
                                "label": "French"
                            },
                            {
                                "label": "arabic"
                            }
                        ]
                    },
                    {
                        "cd": "item",
                        "label": "item2",
                        "revNo": 1,
                        "recStatus": true,
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "English"
                            },
                            {
                                "label": "Hindi"
                            },
                            {
                                "label": "Tamil"
                            },
                            {
                                "label": "Malayalam"
                            },
                            {
                                "label": "marati"
                            },
                            {
                                "label": "Kannada"
                            },
                            {
                                "label": "spanish"
                            },
                            {
                                "label": "Oriya"
                            },
                            {
                                "label": "French"
                            },
                            {
                                "label": "arabic"
                            }
                        ]
                    },
                    {
                        "cd": "item2",
                        "label": "item1",
                        "revNo": 1,
                        "recStatus": true,
                        "lang": [
                            {
                                "label": "Telugu"
                            },
                            {
                                "label": "English"
                            },
                            {
                                "label": "Hindi"
                            },
                            {
                                "label": "Tamil"
                            },
                            {
                                "label": "Malayalam"
                            },
                            {
                                "label": "marati"
                            },
                            {
                                "label": "Kannada"
                            },
                            {
                                "label": "spanish"
                            },
                            {
                                "label": "Oriya"
                            },
                            {
                                "label": "French"
                            },
                            {
                                "label": "arabic"
                            }
                        ]
                    }
                ]
            },
            {
                "cd": "PATIDTYPE",
                "label": "PatIdType",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "AADHAAR",
                        "label": "Aadhaar",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "PANCD",
                        "iconClass": "",
                        "label": "Pan Card",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "CLINICENTRYMODULE",
                "label": "Clinical Entry Module",
                "recStatus": true,
                "revNo": 1,
                "child": [
                    {
                        "cd": "commonurl/op-assessment",
                        "label": "General",
                        "iconClass": "",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    },
                    {
                        "cd": "diabetic-assessment",
                        "iconClass": "",
                        "label": "Diabetrics",
                        "value": "",
                        "indicator": "",
                        "recStatus": true,
                        "revNo": 1,
                        "lang": []
                    }
                ]
            },
            {
                "cd": "TABS",
                "label": "Tabs",
                "recStatus": true,
                "sessionId": "671f1937c1412d25548018fa",
                "child": [
                  {
                    "cd": "DASH",
                    "iconClass": "pi pi-th-large",
                    "routeUrl": "dashboard",
                    "label": "Dashboard",
                    "value": "",
                    "indicator": "",
                    "lang": [],
                    "recStatus": true,
                    "revNo": 1
                  },
                  {
                    "cd": "APMNT",
                    "iconClass": "pi pi-clock",
                    "routeUrl": "appointment",
                    "label": "Appointments",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "DOCMNT",
                    "iconClass": "pi pi-folder-open",
                    "routeUrl": "docmnt",
                    "label": "Documents ",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "PAT",
                    "iconClass": "pi pi-users",
                    "routeUrl": "docmnt",
                    "label": "Patients List",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "REP",
                    "iconClass": "pi pi-book",
                    "routeUrl": "result",
                    "label": "Result Entry",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "BILL",
                    "iconClass": "pi pi-wallet",
                    "routeUrl": "billing",
                    "label": "Billing",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "SET",
                    "iconClass": "pi pi-cog",
                    "routeUrl": "",
                    "label": "Settings",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "MST",
                    "iconClass": "pi pi-table",
                    "routeUrl": "masters",
                    "label": "Masters",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  },
                  {
                    "cd": "LOGOUT",
                    "iconClass": "pi pi-power-off",
                    "routeUrl": "",
                    "label": "Sign Off",
                    "value": "",
                    "indicator": "",
                    "recStatus": true,
                    "revNo": 1,
                    "lang": []
                  }
                ],
                "revNo": 1
                }
        ]
    },
    {
        "type": "FIELDMANAGEMENTS",
        "coll": "cm_fieldsmanagement",
        "depColl": [],
        "payLoad": { "orgId": "", "locId": "", "userId": "", "audit": {} },
        "data": [
            {
                "type": "ORG_LOC",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "locName",
                        "header": "Location Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 3,
                        "field": "locKey",
                        "header": "Location Key",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 4,
                        "field": "orgName",
                        "header": "Organization Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 5,
                        "field": "orgKey",
                        "header": "Organization Key",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 6,
                        "field": "imgUrl",
                        "header": "Image",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 8,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 9,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 10,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "INV",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "name",
                        "header": "Service Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "serviceTypeName",
                        "header": "Service Type Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 4,
                        "field": "serviceGroupName",
                        "header": "Service Group Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 5,
                        "field": "isApplicableFor",
                        "header": "Applicable For",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 6,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 8,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 9,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "MED",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "medName",
                        "header": "Medication Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 3,
                        "field": "medFormTypeName",
                        "header": "Medication Type Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 230
                    },
                    {
                        "orderNo": 4,
                        "field": "genericName",
                        "header": "Generic Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 5,
                        "field": "drugDose",
                        "header": "Drug Dose",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 6,
                        "field": "unitName",
                        "header": "Units",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 8,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 9,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 10,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "DOC",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "dispName",
                        "header": "Doctor Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "docCd",
                        "header": "Doctor Cd",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 4,
                        "field": "userName",
                        "header": "User Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 5,
                        "field": "dob",
                        "header": "Date of Birth",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 6,
                        "field": "mobile",
                        "header": "Mobile Number",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 7,
                        "field": "regNo",
                        "header": "Registration No",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 250
                    },
                    {
                        "orderNo": 8,
                        "field": "docTypeName",
                        "header": "Doctor Type",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 9,
                        "field": "designation",
                        "header": "Designation",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 10,
                        "field": "qualf",
                        "header": "Qualification",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 11,
                        "field": "speclityName",
                        "header": "Specality Name",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 12,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 13,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 14,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 15,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "EMP",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "userName",
                        "header": "User Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "dispName",
                        "header": "Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 4,
                        "field": "emailID",
                        "header": "Email",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 5,
                        "field": "mobile",
                        "header": "Mobile",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 6,
                        "field": "joinDt",
                        "header": "Joining Date",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "mediumDate",
                        "width": 200
                    },
                    {
                        "orderNo": 7,
                        "field": "dob",
                        "header": "Date of Birth",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    }, 
                    {
                        "orderNo": 8,
                        "field": "empTypeName",
                        "header": "Employee Type",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 9,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 10,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo":11,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 12,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "DOCMNT",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "docmntName",
                        "header": "Document Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "docmntUrl",
                        "header": "Document URL",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 4,
                        "field": "reportUrl",
                        "header": "Report URL",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 5,
                        "field": "groupName",
                        "header": "Group Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 6,
                        "field": "qualityDocNo",
                        "header": "Quality No.",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 7,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 8,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 9,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 10,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "ROLE",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "label",
                        "header": "Role Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "docmntMap[0].documentName",
                        "header": "Document Permission",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 4,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 5,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 6,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "ENT",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "label",
                        "header": "Entity Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 4,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 5,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 6,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "ALRG",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "label",
                        "header": "Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "desc",
                        "header": "Description",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 4,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 5,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 6,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            },
            {
                "type": "COMP",
                "recStatus": true,
                "fields": [
                    {
                        "orderNo": 1,
                        "field": "mng",
                        "header": "Manage",
                        "sortFilter": false,
                        "visible": true,
                        "cellFilter": "",
                        "width": 40
                    },
                    {
                        "orderNo": 2,
                        "field": "label",
                        "header": "Name",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 3,
                        "field": "desc",
                        "header": "Description",
                        "sortFilter": true,
                        "visible": true,
                        "cellFilter": "",
                        "width": 200
                    },
                    {
                        "orderNo": 4,
                        "field": "documentedBy",
                        "header": "Created By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 5,
                        "field": "documentedDt",
                        "header": "Created Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    },
                    {
                        "orderNo": 6,
                        "field": "modifiedBy",
                        "header": "Modified By",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "",
                        "width": 150
                    },
                    {
                        "orderNo": 7,
                        "field": "modifiedDt",
                        "header": "Modified Dt",
                        "sortFilter": true,
                        "visible": false,
                        "cellFilter": "medium",
                        "width": 250
                    }
                ],
                "revNo": 1
            }
        ]
    },
    {
        "type": "LABELS",
        "coll": "cm_labels",
        "depColl": [],
        "payLoad": { "orgId": "", "locId": "", "sessionId": "", "audit": {} },
        "data": [
            {
                "recStatus": true,
                "revNo": 1,
                "labels": [
                    {
                        "cd": "LBLS0025",
                        "lblName": "Vital Signs"
                    },
                    {
                        "cd": "LBLS0026",
                        "lblName": "Diagnosis"
                    },
                    {
                        "cd": "LBLS0027",
                        "lblName": "Chief Complaints"
                    },
                    {
                        "cd": "LBLS0028",
                        "lblName": "Nurse Notes"
                    },
                    {
                        "cd": "LBLS0029",
                        "lblName": "Past History"
                    },
                    {
                        "cd": "LBLS0030",
                        "lblName": "Notes"
                    },
                    {
                        "cd": "LBLS0031",
                        "lblName": "History of Present Illness"
                    },
                    {
                        "cd": "LBLS0001",
                        "lblName": "test"
                    },
                    {
                        "cd": "LBLS0002",
                        "lblName": "General Examination",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0003",
                        "lblName": "Labs",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0004",
                        "lblName": "Medications",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0005",
                        "lblName": "Advice",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0006",
                        "lblName": "Investigations",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0007",
                        "lblName": "ICD",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0008",
                        "lblName": "Family History",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0009",
                        "lblName": "Complaints",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0013",
                        "lblName": "History of Present Illness",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0014",
                        "lblName": "Vitals",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0015",
                        "lblName": "Complaints",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0016",
                        "lblName": "Notes",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0017",
                        "lblName": "Test",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0018",
                        "lblName": "Vital Signs",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0019",
                        "lblName": "Complaints",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0020",
                        "lblName": "Diagnosis",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0021",
                        "lblName": "Investigations",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0022",
                        "lblName": "Medications",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0023",
                        "lblName": "ICD",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0024",
                        "lblName": "Family History",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0025",
                        "lblName": "Vitals",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0026",
                        "lblName": "Investigations",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0027",
                        "lblName": "Medications",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0028",
                        "lblName": "Complaints",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0029",
                        "lblName": "Diagnosis",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0030",
                        "lblName": "ICD",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0031",
                        "lblName": "Family History",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0032",
                        "lblName": "Notes",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0034",
                        "lblName": "Lab Results",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0035",
                        "lblName": "medicines",
                        "recStatus": true
                    },
                    {
                        "cd": "LBLS0036",
                        "lblName": "dynamic forms",
                        "recStatus": true
                    }
                ]
            }
        ]
    },
    // {
    //     "type": "ICD_MASTERS",
    //     "coll": "cm_icd_masters",
    //     "depColl": [],
    //     "payLoad": {},
    //     "data": []
    // },
    // {
    //     "type": "PINCODES",
    //     "coll": "cm_pincodes",
    //     "depColl": [],
    //     "payLoad": {},
    //     "data": []
    // },
];
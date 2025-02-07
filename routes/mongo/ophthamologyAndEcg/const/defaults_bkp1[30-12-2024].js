module.exports = [
  {
    "type": "DOCUMENTS",
    "coll": "ophthamology_ecg_Documents",
    "depColl": [],
    "payLoad": { "orgId": "", "sessionId": "", "audit": {} },
    "data": [
      {
        groupCode: "DOCTOR",
        groupName: "Doctor",
        documentName: "Prescription List",
        documentCode: "PRSCRPTN_LST",
        documentUrl: "/precscription",
        reportUrl: "/report-precscription"
      },
      {
        groupCode: "DOCTOR",
        groupName: "Doctor",
        documentName: "Assessment",
        documentCode: "ASSMNT",
        documentUrl: "/prescription-assessment",
        reportUrl: "/report-prescription-assessment"
      },
      {
        groupCode: "MASTERS",
        groupName: "Masters",
        documentName: "Masters",
        documentCode: "MASTERS",
        documentUrl: "/masters",
        reportUrl: "/print-masters"
      },
      {
        groupCode: "DOCTOR",
        groupName: "Doctor",
        iconClass: "pi pi-user",
        documentName: "Manufacturer Approvals",
        documentCode: "MANFACTURERS",
        documentUrl: "/manufacturer",
        reportUrl: "/report-manufacturers"
      },
      {
        groupCode: "DOCTOR",
        groupName: "Doctor",
        iconClass: "pi pi-user",
        documentName: "Overview Section",
        documentCode: "OVERVIEWSECTion",
        documentUrl: "/overviewSection",
        reportUrl: "/report-overviewSection"
      },
    ]
  },
  {
    "type": "ROLES",
    "coll": "ophthamology_ecg_Roles",
    "depColl": ["ophthamology_ecg_Documents"],
    "payLoad": { "audit": {} },
    "tabsMap": [
      {
        "label": "Dashboard",
        "cd": "DASH",
        "iconClass": "pi pi-th-large",
        "isActive": true,
        "isShown": true,
        "displayOrder": "1",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "dashboard"
      },
      {
        "label": "Visits",
        "cd": "VISTS",
        "iconClass": "pi pi-clock",
        "isActive": true,
        "isShown": true,
        "displayOrder": "2",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "appointment"
      },
      {
        "label": "Patients List",
        "cd": "PAT",
        "iconClass": "pi pi-users",
        "isActive": true,
        "isShown": true,
        "displayOrder": "3",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "patRegistration"
      },
      {
        "label": "Masters",
        "cd": "MST",
        "iconClass": "pi pi-table",
        "isActive": true,
        "isShown": true,
        "displayOrder": "7",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "masters"
      },
      {
        "label": "Sign Off",
        "cd": "LOGOUT",
        "iconClass": "pi pi-power-off",
        "isActive": true,
        "isShown": true,
        "displayOrder": "8",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": ""
      },
      {
        "label": "Prescription List",
        "cd": "PRC_RPT",
        "iconClass": "pi pi-book",
        "isActive": true,
        "isShown": true,
        "displayOrder": "4",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "prescription"
      },
      {
        "label": "Overview Section",
        "cd": "OVR_VIW_SEC",
        "iconClass": "pi pi-wallet",
        "isActive": true,
        "isShown": true,
        "displayOrder": "6",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "overviewSection"
      },
      {
        "label": "Ophtha Dashboard",
        "cd": "OPTHA_DASH",
        "iconClass": "pi pi-wallet",
        "isActive": true,
        "isShown": true,
        "displayOrder": "5",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "ophthadashboard"
      },
      {
        "label": "Manufacturer Approvals",
        "cd": "MANF_APPROV",
        "iconClass": "pi pi-check-circle",
        "isActive": true,
        "isShown": true,
        "displayOrder": "5",
        "permission": {
          "isActive": true,
          "isShown": true,
          "read": true,
          "write": true,
          "delete": true,
          "print": true,
          "adendum": true,
          "complete": true,
          "signOff": true,
          "rework": true,
          "fileUpload": true,
          "approve": true,
          "edit": true,
          "accessUser": true,
          "reject": true,
        },
        "routeUrl": "manufacturer"
      },
    ],
    "data": [
      {
        code: "PRACTICE_ADMIN",
        name: "Practice Admin",
        docmntMap: ["Prescription List", "Assessment", "Masters", "Manufacturer Approvals", "Overview Section"],
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
        "tabsMap": [
         
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          {
            "label": "Manufacturer Approvals",
            "cd": "MANF_APPROV",
            "iconClass": "pi pi-check-circle",
            "isActive": true,
            "isShown": true,
            "displayOrder": "6",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "manufacturer"
          },
          {
            "label": "Masters",
            "cd": "MST",
            "iconClass": "pi pi-table",
            "isActive": true,
            "isShown": true,
            "displayOrder": "7",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "masters"
          },
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "8",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
        ],
      },

      {
        code: "FACILITY_ADMIN",
        name: "Facility Admin",
        docmntMap: ["Prescription List", "Assessment", "Masters", "Manufacturer Approvals", "Overview Section"],
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
        "tabsMap": [
          
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          {
            "label": "Manufacturer Approvals",
            "cd": "MANF_APPROV",
            "iconClass": "pi pi-check-circle",
            "isActive": true,
            "isShown": true,
            "displayOrder": "6",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "manufacturer"
          },
          {
            "label": "Masters",
            "cd": "MST",
            "iconClass": "pi pi-table",
            "isActive": true,
            "isShown": true,
            "displayOrder": "7",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "masters"
          },
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "8",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
        ],
      },

      {
        code: "PHC_USER",
        name: "PHC User",
        defaultTabCd: "PAT",
        defaultTabName: "Patients List",
        docmntMap: ["Prescription List", "Assessment", "Overview Section"],
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
        "tabsMap": [
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": false,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
          
        ],
      },
      {
        code: "CHC_USER",
        name: "CHC User",
        defaultTabCd: "PAT",
        defaultTabName: "Patients List",
        docmntMap: ["Prescription List", "Assessment", "Overview Section"],
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
        "tabsMap": [
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": false,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
          
        ],
      },
      {
        code: "PHC_DOCTOR",
        name: "PHC Doctor",
        defaultTabCd: "VISTS",
        defaultTabName: "Visits",
        docmntMap: ["Prescription List", "Assessment", "Overview Section"],
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
        "tabsMap": [
          
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": false,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "6",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
          
        ],
      },
      {
        code: "CHC_DOCTOR",
        name: "CHC Doctor",
        defaultTabCd: "VISTS",
        defaultTabName: "Visits",
        docmntMap: ["Prescription List", "Assessment", "Overview Section"],
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
        "tabsMap": [
          
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
         
          {
            "label": "Visits",
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "appointment"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": false,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "6",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
          
        ],
      },
      {
        code: "CHC_Nodal_OFFICER",
        name: "CHC Nodal Officer",
        defaultTabCd: "DASH",
        defaultTabName: "Dashboard",
        docmntMap: ["Prescription List", "Overview Section"],
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
        "tabsMap": [
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
        ],
      },
      {
        code: "STATE_Nodal_OFFICER",
        name: "State Nodal Officer",
        defaultTabCd: "DASH",
        defaultTabName: "Dashboard",
        docmntMap: ["Prescription List", "Overview Section"],
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
        "tabsMap": [

          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Overview Section",
            "cd": "OVR_VIW_SEC",
            "iconClass": "pi pi-wallet",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "overviewSection"
          },
          {
            "label": "Patients List",
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "patRegistration"
          },
          {
            "label": "Prescription List",
            "cd": "PRC_RPT",
            "iconClass": "pi pi-book",
            "isActive": true,
            "isShown": true,
            "displayOrder": "4",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "prescription"
          },
          {
            "label": "Masters",
            "cd": "MST",
            "iconClass": "pi pi-table",
            "isActive": true,
            "isShown": true,
            "displayOrder": "5",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "masters"
          },
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "6",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
        ],
      },
      {
        code: "MANFACTURER_USER",
        name: "Manufacturer User",
        defaultTabCd: "DASH",
        defaultTabName: "Dashboard",
        docmntMap: [ "Manufacturer Approvals"],
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
        "tabsMap": [
          {
            "label": "Dashboard",
            "cd": "DASH",
            "iconClass": "pi pi-th-large",
            "isActive": true,
            "isShown": true,
            "displayOrder": "1",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "dashboard"
          },
          {
            "label": "Manufacturer Approvals",
            "cd": "MANF_APPROV",
            "iconClass": "pi pi-check-circle",
            "isActive": true,
            "isShown": true,
            "displayOrder": "2",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": "manufacturer"
          },
            
          {
            "label": "Sign Off",
            "cd": "LOGOUT",
            "iconClass": "pi pi-power-off",
            "isActive": true,
            "isShown": true,
            "displayOrder": "3",
            "permission": {
              "isActive": true,
              "isShown": true,
              "read": true,
              "write": true,
              "delete": true,
              "print": true,
              "adendum": true,
              "complete": true,
              "signOff": true,
              "rework": true,
              "fileUpload": true,
              "approve": true,
              "edit": true,
              "accessUser": true,
              "reject": true,
            },
            "routeUrl": ""
          },
        ],
      },
    ]
  },
  {
    "type": "COUNTERS",
    "coll": "ophthamology_ecg_counters",
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
        "seqValue": 0,
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
      },
      {
        "seqName": "AppointmentId",
        "seqType": "",
        "seqValue": 0,
        "digits": 4,
        "format": "YYMM",
      }
    ]
  },
  {
    "type": "ENTITIES",
    "coll": "ophthamology_ecg_Entities",
    "depColl": [],
    "payLoad": { "sessionId": "", "audit": {} },
    "data": [
      {

        "cd": "FACILITY_TYP",
        "label": "Facility Type",
        "recStatus": true,
        "revNo": 1,
        "child": [
          {
            "cd": "PHC",
            "iconClass": "",
            "routeUrl": "",
            "label": "PHCs",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
          },
          {
            "cd": "CHCs",
            "iconClass": "",
            "routeUrl": "",
            "label": "CHCs",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
          },
          {
            "cd": "STELVLHSP",
            "iconClass": "",
            "routeUrl": "",
            "label": "State Level Hospitals",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
          },
          {
            "cd": "MANUFACTURES",
            "iconClass": "",
            "routeUrl": "",
            "label": "Manufactures",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
          },
        ],
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
            "revNo": 1,
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
            "recStatus": true
          },
          {
            "cd": "4HRS",
            "revNo": 1,
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
            "recStatus": true
          },
          {
            "cd": "Once a Day",
            "label": "Once a Day (1 - 0 - 0)",
            "value": "1",
            "indicator": "1 - 0 - 0",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఒకసారి (1 - 0 - 0)"
              },
              {

                "label": "English",
                "value": "Once a Day (1 - 0 - 0)"
              },
              {

                "label": "Hindi",
                "value": "दिन में एक बार (1 - 0 - 0)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून एकदा (1 - 0 - 0)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாள் (1 - 0 - 0)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಒಂದು ಬಾರಿ (1 - 0 - 0)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once a Day",
            "label": "Once a Day (0 - 1 - 0)",
            "value": "1",
            "indicator": "0 - 1 - 0",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఒకసారి (0 - 1 - 0)"
              },
              {

                "label": "English",
                "value": "Once a Day (0 - 1 - 0)"
              },
              {

                "label": "Hindi",
                "value": "दिन में एक बार (0 - 1 - 0)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून एकदा (0 - 1 - 0)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாள் (0 - 1 - 0)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಒಂದು ಬಾರಿ (0 - 1 - 0)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once a Day",
            "label": "Once a Day (0 - 0 - 1)",
            "value": "1",
            "indicator": "0 - 0 - 1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఒకసారి (0 - 0 - 1)"
              },
              {

                "label": "English",
                "value": "Once a Day (0 - 0 - 1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में एक बार (0 - 0 - 1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून एकदा (0 - 0 - 1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாள் (0 - 0 - 1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಒಂದು ಬಾರಿ (0 - 0 - 1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Twice a Day",
            "label": "Twice a Day (1 - 0 - 1)",
            "value": "2",
            "indicator": "1 - 0 - 1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు రెండు సార్లు (1 - 0 - 1)"
              },
              {

                "label": "English",
                "value": "Twice a Day (1 - 0 - 1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में दो बार (1 - 0 - 1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून दोनदा (1 - 0 - 1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளைக்கு இரண்டு முறை (1 - 0 - 1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಎರಡು ಬಾರಿ (1 - 0 - 1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Twice a Day",
            "label": "Twice a Day (0 - 1 - 1)",
            "value": "2",
            "indicator": "0 - 1 - 1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు రెండు సార్లు (0 - 1 - 1)"
              },
              {

                "label": "English",
                "value": "Twice a Day (0 - 1 - 1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में दो बार (0 - 1 - 1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून दोनदा (0 - 1 - 1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளைக்கு இரண்டு முறை (0 - 1 - 1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಎರಡು ಬಾರಿ (0 - 1 - 1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Twice a Day",
            "label": "Twice a Day (1 - 1 - 0)",
            "value": "2",
            "indicator": "1 - 1 - 0",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు రెండు సార్లు (1 - 1 - 0)"
              },
              {

                "label": "English",
                "value": "Twice a Day (1 - 1 - 0)"
              },
              {

                "label": "Hindi",
                "value": "दिन में दो बार (1 - 1 - 0)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून दोनदा (1 - 1 - 0)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளைக்கு இரண்டு முறை (1 - 1 - 0)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಎರಡು ಬಾರಿ (1 - 1 - 0)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Thrice a Day",
            "label": "Thrice a Day (1 - 1 - 1)",
            "value": "3",
            "indicator": "1 - 1 - 1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు మూడు సార్లు (1 - 1 - 1)"
              },
              {

                "label": "English",
                "value": "Thrice a Day (1 - 1 - 1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में तीन बार (1 - 1 - 1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून तीनदा (1 - 1 - 1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளைக்கு மூன்று முறை (1 - 1 - 1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ಮೂರು ಬಾರಿ (1 - 1 - 1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Four times a Day (1-1-1-1)",
            "label": "Four times a Day (1-1-1-1)",
            "value": "4",
            "indicator": "1-1-1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు నాలుగు సార్లు (1-1-1-1)"
              },
              {

                "label": "English",
                "value": "Four times a Day (1-1-1-1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में चार बार (1-1-1-1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून चारदा (1-1-1-1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளைக்கு நான்கு முறை (1-1-1-1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನದಲ್ಲಿ ನಾಲ್ಕು ಬಾರಿ (1-1-1-1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Five times a day (1-1-1-1-1)",
            "label": "Five times a day (1-1-1-1-1)",
            "value": "5",
            "indicator": "1-1-1",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఐదు సార్లు (1-1-1-1-1)"
              },
              {

                "label": "English",
                "value": "Five times a day (1-1-1-1-1)"
              },
              {

                "label": "Hindi",
                "value": "दिन में पांच बार (1-1-1-1-1)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून पाचदा (1-1-1-1-1)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளில் ஐந்து முறை (1-1-1-1-1)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನಕ್ಕೆ ಐದು ಬಾರಿ (1-1-1-1-1)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Every Morning",
            "label": "Every Morning",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి ఉదయం"
              },
              {

                "label": "English",
                "value": "Every Morning"
              },
              {

                "label": "Hindi",
                "value": "हर सुबह"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक सकाळ"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு காலை"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Every Evening",
            "label": "Every Evening",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి సాయంత్రం"
              },
              {

                "label": "English",
                "value": "Every Evening"
              },
              {

                "label": "Hindi",
                "value": "हर शाम"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक संध्याकाळ"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு மாலை"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ ಸಂಜೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Every Alternate Day",
            "label": "Every Alternate Day",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి ప్రత్యామ్నాయ రోజు"
              },
              {

                "label": "English",
                "value": "Every Alternate Day"
              },
              {

                "label": "Hindi",
                "value": "हर दूसरे दिन"
              },
              {

                "label": "Marathi",
                "value": "दर पर्यायी दिवस"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு மாற்று நாளும்"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ ಪರ್ಯಾಯ ದಿನ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once a Week",
            "label": "Once a Week",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "వారానికి ఒకసారి"
              },
              {

                "label": "English",
                "value": "Once a Week"
              },
              {

                "label": "Hindi",
                "value": "सप्ताह में एक बार"
              },
              {

                "label": "Marathi",
                "value": "आठवड्यातून एकदा"
              },
              {

                "label": "Tamil",
                "value": "வாரத்தில் ஒருமுறை"
              },
              {

                "label": "Kannada",
                "value": "ವಾರಕ್ಕೆ ಒಂದು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once in 10 Days",
            "label": "Once in 10 Days",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "10 రోజులకు ఒకసారి"
              },
              {

                "label": "English",
                "value": "Once in 10 Days"
              },
              {

                "label": "Hindi",
                "value": "10 दिनों में एक बार"
              },
              {

                "label": "Marathi",
                "value": "10 दिवसांतून एकदा"
              },
              {

                "label": "Tamil",
                "value": "10 நாட்களில் ஒருமுறை"
              },
              {

                "label": "Kannada",
                "value": "10 ದಿನಗಳಲ್ಲಿ ಒಂದು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once in 15 Days",
            "label": "Once in 15 Days",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "15 రోజులకు ఒకసారి"
              },
              {

                "label": "English",
                "value": "Once in 15 Days"
              },
              {

                "label": "Hindi",
                "value": "15 दिनों में एक बार"
              },
              {

                "label": "Marathi",
                "value": "15 दिवसांतून एकदा"
              },
              {

                "label": "Tamil",
                "value": "15 நாட்களில் ஒருமுறை"
              },
              {

                "label": "Kannada",
                "value": "15 ದಿನಗಳಲ್ಲಿ ಒಂದು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once in a Month",
            "label": "Once in a Month",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "నెలలో ఒకసారి"
              },
              {

                "label": "English",
                "value": "Once in a Month"
              },
              {

                "label": "Hindi",
                "value": "महीने में एक बार"
              },
              {

                "label": "Marathi",
                "value": "महिन्यातून एकदा"
              },
              {

                "label": "Tamil",
                "value": "மாதத்திற்கு ஒருமுறை"
              },
              {

                "label": "Kannada",
                "value": "ತಿಂಗಳಲ್ಲಿ ಒಂದು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Six times a Day",
            "label": "Six times a Day",
            "value": "6",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఆరు సార్లు"
              },
              {

                "label": "English",
                "value": "Six times a Day"
              },
              {

                "label": "Hindi",
                "value": "दिन में छह बार"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून सहा वेळा"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளுக்கு ஆறு முறை"
              },
              {

                "label": "Kannada",
                "value": "ದಿನಕ್ಕೆ ಆರು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "SOS (As Needed)",
            "label": "SOS (As Needed)",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "అవసరమైనప్పుడు"
              },
              {

                "label": "English",
                "value": "SOS (As Needed)"
              },
              {

                "label": "Hindi",
                "value": "आवश्यकतानुसार"
              },
              {

                "label": "Marathi",
                "value": "आवश्यकतेनुसार"
              },
              {

                "label": "Tamil",
                "value": "தேவைப்பட்டால்"
              },
              {

                "label": "Kannada",
                "value": "ಅವಶ್ಯಕತೆ ಬಂದಾಗ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "STAT",
            "label": "STAT",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "తక్షణమే"
              },
              {

                "label": "English",
                "value": "STAT"
              },
              {

                "label": "Hindi",
                "value": "तत्काल"
              },
              {

                "label": "Marathi",
                "value": "तातडीने"
              },
              {

                "label": "Tamil",
                "value": "உடனே"
              },
              {

                "label": "Kannada",
                "value": "ತಕ್ಷಣ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Twice a Week",
            "label": "Twice a Week",
            "value": "2",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "వారం రెండు సార్లు"
              },
              {

                "label": "English",
                "value": "Twice a Week"
              },
              {

                "label": "Hindi",
                "value": "सप्ताह में दो बार"
              },
              {

                "label": "Marathi",
                "value": "आठवड्यातून दोनदा"
              },
              {

                "label": "Tamil",
                "value": "வாரத்திற்கு இருமுறை"
              },
              {

                "label": "Kannada",
                "value": "ವಾರಕ್ಕೆ ಎರಡು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Twice in a Month",
            "label": "Twice in a Month",
            "value": "2",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "నెలలో రెండు సార్లు"
              },
              {

                "label": "English",
                "value": "Twice in a Month"
              },
              {

                "label": "Hindi",
                "value": "महीने में दो बार"
              },
              {

                "label": "Marathi",
                "value": "महिन्यातून दोनदा"
              },
              {

                "label": "Tamil",
                "value": "மாதத்தில் இருமுறை"
              },
              {

                "label": "Kannada",
                "value": "ತಿಂಗಳಲ್ಲಿ ಎರಡು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once a day (Early morning)",
            "label": "Once a day (Early morning)",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఒకసారి (ఉదయాన్నే)"
              },
              {

                "label": "English",
                "value": "Once a day (Early morning)"
              },
              {

                "label": "Hindi",
                "value": "दिन में एक बार (सुबह)"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून एकदा (लवकर सकाळी)"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளில் ஒருமுறை (காலை)"
              },
              {

                "label": "Kannada",
                "value": "ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿ (ಬೆಳಗ್ಗೆ)"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q2H",
            "label": "Q2H",
            "value": "12",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 2 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 2 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 2 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 2 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 2 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 2 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q4H",
            "label": "Q4H",
            "value": "8",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 4 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 4 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 4 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 4 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 4 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 4 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q6H",
            "label": "Q6H",
            "value": "6",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 6 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 6 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 6 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 6 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 6 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 6 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q8H",
            "label": "Q8H",
            "value": "3",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 8 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 8 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 8 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 8 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 8 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 8 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q12H",
            "label": "Q12H",
            "value": "2",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 12 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 12 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 12 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 12 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 12 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 12 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Q24H",
            "label": "Q24H",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "ప్రతి 24 గంటలకు"
              },
              {

                "label": "English",
                "value": "Every 24 hours"
              },
              {

                "label": "Hindi",
                "value": "हर 24 घंटे"
              },
              {

                "label": "Marathi",
                "value": "प्रत्येक 24 तासांनी"
              },
              {

                "label": "Tamil",
                "value": "ஒவ்வொரு 24 மணிநேரத்திற்கு"
              },
              {

                "label": "Kannada",
                "value": "ಪ್ರತಿ 24 ಗಂಟೆಗೆ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Once a Day",
            "label": "Once a Day",
            "value": "1",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు ఒకసారి"
              },
              {

                "label": "English",
                "value": "Once a Day"
              },
              {

                "label": "Hindi",
                "value": "दिन में एक बार"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून एकदा"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளில் ஒருமுறை"
              },
              {

                "label": "Kannada",
                "value": "ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "Thrice a Day",
            "label": "Thrice a Day",
            "value": "3",
            "indicator": "",
            "lang": [
              {

                "label": "Telugu",
                "value": "రోజుకు మూడు సార్లు"
              },
              {

                "label": "English",
                "value": "Thrice a Day"
              },
              {

                "label": "Hindi",
                "value": "दिन में तीन बार"
              },
              {

                "label": "Marathi",
                "value": "दिवसातून तीनदा"
              },
              {

                "label": "Tamil",
                "value": "ஒரு நாளில் மூன்று முறை"
              },
              {

                "label": "Kannada",
                "value": "ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ"
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
                "label": "English",
                "value": "After Food"
              },
              {
                "label": "Telugu",
                "value": "తిన్న తరువాత"
              },
              {
                "label": "Hindi",
                "value": "भोजन के बाद"
              },
              {
                "label": "Tamil",
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
                "label": "English",
                "value": "Before Food"
              },
              {
                "label": "Telugu",
                "value": "తిన్నకు ముందు"
              },
              {
                "label": "Hindi",
                "value": "भोजन से पहले"
              },
              {
                "label": "Tamil",
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
            "label": "Sr.cons",
            "recStatus": true
          },
          {
            "cd": "CONS",
            "revNo": 1,
            "label": "Consultant",
            "recStatus": true
          },
          {
            "cd": "JRCONS",
            "revNo": 1,
            "label": "Jr.cons",
            "recStatus": true
          },
          {
            "cd": "ATNDPHYSN",
            "revNo": 1,
            "label": "Attending Physician",
            "recStatus": true
          },
          {
            "cd": "RESDTDOC",
            "revNo": 1,
            "label": "Resident Doctor",
            "recStatus": true
          },
          {
            "cd": "MEDOFCR",
            "revNo": 1,
            "label": "Medical Officer",
            "recStatus": true
          },
          {
            "cd": "CLNASOCTE",
            "revNo": 1,
            "label": "Clinical Associate",
            "recStatus": true
          },
          {
            "cd": "VSTSPLST",
            "revNo": 1,
            "label": "Visiting Specialist",
            "recStatus": true
          },
          {
            "cd": "CLNMNGR",
            "revNo": 1,
            "label": "Clinic Manager",
            "recStatus": true
          },
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
        "revNo": 1,
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
        "revNo": 1,
        "recStatus": true,
        "child": [
          {
            "cd": "WEEKS",
            "label": "Weeks",
            "value": "7",
            "lang": [
              {
                "label": "English",
                "value": "Weeks"
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
                "label": "Tamil",
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
            "cd": "DAYS",
            "label": "Days",
            "value": "1",
            "lang": [
              {
                "label": "English",
                "value": "Days"
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
                "label": "Tamil",
                "value": "நாட்களில்"
              },
              {
                "label": "Malayalam",
                "value": "ദിവസങ്ങളിൽ"
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "MONTHS",
            "label": "Months",
            "value": "30",
            "lang": [
              {
                "label": "English",
                "value": "Months"
              },
              {
                "label": "Telugu",
                "value": ""
              },
              {
                "label": "Hindi",
                "value": ""
              },
              {
                "label": "Tamil",
                "value": ""
              },
              {
                "label": "Malayalam",
                "value": ""
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "YEARS",
            "label": "Years",
            "value": "365",
            "lang": [
              {
                "label": "English",
                "value": "Years"
              },
              {
                "label": "Telugu",
                "value": ""
              },
              {
                "label": "Hindi",
                "value": ""
              },
              {
                "label": "Tamil",
                "value": ""
              },
              {
                "label": "Malayalam",
                "value": ""
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
        "revNo": 1,
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
        "revNo": 1,
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
            "label": "Tamil",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "4",
            "label": "Malayalam",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "5",
            "label": "English",
            "lang": [],
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
            "cd": "VISTS",
            "iconClass": "pi pi-clock",
            "routeUrl": "appointment",
            "label": "Visits",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
            "lang": []
          },
          {
            "cd": "PAT",
            "iconClass": "pi pi-users",
            "routeUrl": "patRegistration",
            "label": "Patients List",
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
          },
          {
            "cd": "PRC_LIST",
            "iconClass": "pi pi-book",
            "routeUrl": "prescription",
            "label": "Prescription List",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
            "lang": []
          },
          {
            "cd": "MANF_APPROV",
            "iconClass": "pi pi-check-circle",
            "routeUrl": "/manufacturer",
            "label": "Manufacturer Approvals",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
            "lang": []
          },
        ],
        "revNo": 1
      },
      {
        "cd": "DATETIMEFORMATE",
        "label": "Date Time Formate",
        "recStatus": true,
        "child": [
          {
            "cd": "dd-MMM-yyyy, HH:mm",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd-MMM-yyyy, HH:mm",
            "value": "",
            "indicator": "",
            "lang": [
              {
                "label": "English",
                "value": ""
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "dd-MM-y, HH:mm",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd-MM-y, HH:mm",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "dd/MM/y, HH:mm",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd/MM/y, HH:mm",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "dd-MM-y, h:mm a",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd-MM-y, h:mm a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "dd MMM y, h:mm a",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd MMM y, h:mm a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "dd MMMM y, h:mm a",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd MMMM y, h:mm a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "M/d/yy, h:mm a",
            "iconClass": "",
            "routeUrl": "",
            "label": "M/d/yy, h:mm a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "MMM d, y, h:mm:ss a",
            "iconClass": "",
            "routeUrl": "",
            "label": "MMM d, y, h:mm:ss a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "EEEE, MMMM d, y, h:mm:ss a",
            "iconClass": "",
            "routeUrl": "",
            "label": "EEEE, MMMM d, y, h:mm:ss a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          }
        ],
        "revNo": 1
      },
      {
        "cd": "DATEFORMATE",
        "label": "Date Formate",
        "recStatus": true,
        "child": [
          {

            "cd": "dd-MMM-yyyy",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd-MMM-yyyy",
            "value": "",
            "indicator": "",
            "lang": [
              {

                "label": "English",
                "value": ""
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "dd-MM-y",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd-MM-y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "dd/MM/y",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd/MM/y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "dd MMM y",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd MMM y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "dd MMMM y",
            "iconClass": "",
            "routeUrl": "",
            "label": "dd MMMM y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "M/d/yy",
            "iconClass": "",
            "routeUrl": "",
            "label": "M/d/yy",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "MMM d, y",
            "iconClass": "",
            "routeUrl": "",
            "label": "MMM d, y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "EEEE, MMMM d, y",
            "iconClass": "",
            "routeUrl": "",
            "label": "EEEE, MMMM d, y",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          }
        ],
        "revNo": 1
      },
      {
        "cd": "TIMEFORMATE",
        "label": "Time Formate",
        "recStatus": true,
        "child": [
          {
            "cd": "h:mm a",
            "iconClass": "",
            "routeUrl": "",
            "label": "h:mm a",
            "value": "",
            "indicator": "",
            "lang": [
              {
                "label": "English",
                "value": ""
              }
            ],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "h:mm:ss a",
            "iconClass": "",
            "routeUrl": "",
            "label": "h:mm:ss a",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "H:mm",
            "iconClass": "",
            "routeUrl": "",
            "label": "H:mm",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "H:mm:ss",
            "iconClass": "",
            "routeUrl": "",
            "label": "H:mm:ss",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {

            "cd": "H:mmm",
            "iconClass": "",
            "routeUrl": "",
            "label": "H:mmm",
            "value": "",
            "indicator": "",
            "recStatus": true,
            "revNo": 1,
            "lang": []
          }
        ],
        "revNo": 1
      },
      {

        "cd": "WHATSAPP_VENDER",
        "label": "WHATSAPP_VENDER",
        "recStatus": true,
        "child": [
          {
            "cd": "ACL",
            "iconClass": "",
            "routeUrl": "",
            "label": "ACL",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          }
        ],
        "revNo": 1
      },
      {

        "cd": "SMSVENDERS",
        "label": "SMSVENDERS",
        "recStatus": true,
        "child": [
          {

            "cd": "SMS_COUNTRY",
            "iconClass": "",
            "routeUrl": "",
            "label": "SMS_COUNTRY",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "MOBI_SMART",
            "iconClass": "",
            "routeUrl": "",
            "label": "MOBI_SMART",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "ABSOLUTE_SMS",
            "iconClass": "",
            "routeUrl": "",
            "label": "ABSOLUTE_SMS",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "MALERT",
            "iconClass": "",
            "routeUrl": "",
            "label": "MALERT",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "ENFFIE",
            "iconClass": "",
            "routeUrl": "",
            "label": "ENFFIE",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "BULK_SMS_GTWAY",
            "iconClass": "",
            "routeUrl": "",
            "label": "BULK_SMS_GTWAY",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "VOX_PASS",
            "iconClass": "",
            "routeUrl": "",
            "label": "VOX_PASS",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "BULKSMSAPPS",
            "iconClass": "",
            "routeUrl": "",
            "label": "BULKSMSAPPS",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "SMS9",
            "iconClass": "",
            "routeUrl": "",
            "label": "SMS9",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          }
        ],
        "revNo": 1
      },
      {
        "cd": "RECEIVERSLIST",
        "label": "receiversList",
        "recStatus": true,
        "child": [
          {
            "cd": "DOC",
            "iconClass": "",
            "routeUrl": "",
            "label": "DOC",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "PAT",
            "iconClass": "",
            "routeUrl": "",
            "label": "PAT",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          },
          {
            "cd": "BOTH",
            "iconClass": "",
            "routeUrl": "",
            "label": "BOTH",
            "value": "",
            "indicator": "",
            "lang": [],
            "recStatus": true,
            "revNo": 1
          }
        ],
        "revNo": 1
      }

    ]
  },
  {
    "type": "FIELDMANAGEMENTS",
    "coll": "ophthamology_ecg_Fieldsmanagement",
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
            "field": "name",
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
            "field": "joiningDate",
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
            "orderNo": 11,
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
          },
          {
            "orderNo": 13,
            "field": "role",
            "header": "Role",
            "sortFilter": true,
            "visible": true,
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
            "field": "documentName",
            "header": "Document Name",
            "sortFilter": true,
            "visible": true,
            "cellFilter": "",
            "width": 200
          },
          {
            "orderNo": 3,
            "field": "documentUrl",
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
            "field": "name",
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
    "type": "TITLE",
    "coll": "ophthamology_ecg_Title",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "MR", "name": "Mr." },
      { "code": "MRS", "name": "Mrs." },
      { "code": "MISS", "name": "Miss" },
      { "code": "DR", "name": "Dr." },
      { "code": "PROF", "name": "Prof." },
      { "code": "MS", "name": "Ms." }
    ]
  },
  {
    "type": "GENDER",
    "coll": "ophthamology_ecg_Gender",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "M", "name": "Male", "displayOrder":1 },
      { "code": "F", "name": "Female", "displayOrder":2  },
      { "code": "U", "name": "UnSpecified", "displayOrder":3 },
      { "code": "O", "name": "Others", "displayOrder":4 }
    ]
  },
  {
    "type": "BLOODGROUP",
    "coll": "ophthamology_ecg_BloodGroup",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "O_POS", "name": "O+" },
      { "code": "A_POS", "name": "A+" },
      { "code": "B_POS", "name": "B+" },
      { "code": "AB_POS", "name": "AB+" },
      { "code": "O_NEG", "name": "O-" },
      { "code": "A_NEG", "name": "A-" },
      { "code": "B_NEG", "name": "B-" },
      { "code": "AB_NEG", "name": "AB-" }
    ]
  },
  {
    "type": "RELATIONSHIP",
    "coll": "ophthamology_ecg_Relationship",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "relationType": "FATHER", "code": "FATHER", "name": "Father" },
      { "relationType": "MOTHER", "code": "MOTHER", "name": "Mother" },
      { "relationType": "DAUGHTER", "code": "DAUGHTER", "name": "Daughter" },
      { "relationType": "BROTHER", "code": "BROTHER", "name": "Brother" },
      { "relationType": "SISTER", "code": "SISTER", "name": "Sister" },
      { "relationType": "HUSBAND", "code": "HUSBAND", "name": "Husband" },
      { "relationType": "WIFE", "code": "WIFE", "name": "Wife" },
      { "relationType": "FRIEND", "code": "FRIEND", "name": "Friend" },
      { "relationType": "COLLEAGUE", "code": "COLLEAGUE", "name": "Colleague" },
      { "relationType": "GRANDMOTHER", "code": "GRANDMOTHER", "name": "Grandmother" }
    ]
  },

  {
    "type": "CHIEFCOMPLAINT",
    "coll": "ophthamology_ecg_ChiefComplaint",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "BLURRED_VISION", "complaint": "Blurred Vision" },
      { "code": "EYE_PAIN", "complaint": "Eye Pain" },
      { "code": "REDNESS", "complaint": "Redness" },
      { "code": "ITCHING", "complaint": "Itching" },
      { "code": "DRYNESS", "complaint": "Dryness" },
      { "code": "WATERY_EYES", "complaint": "Watery Eyes" },
      { "code": "FLOATERS", "complaint": "Floaters" },
      { "code": "DOUBLE_VISION", "complaint": "Double Vision" },
      { "code": "PHOTOPHOBIA", "complaint": "Sensitivity to Light (Photophobia)" },
      { "code": "VISION_LOSS", "complaint": "Loss of Vision" }
    ]
  },

  {
    "type": "PREFERLANGUAGE",
    "coll": "ophthamology_ecg_PreferLanguage",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "HI", "name": "Hindi" },
      { "code": "BH", "name": "Bhojpuri" },
      { "code": "MG", "name": "Magahi" },
      { "code": "MA", "name": "Maithili" },
      { "code": "UR", "name": "Urdu" },
      { "code": "BN", "name": "Bengali" },
      { "code": "EN", "name": "English" },
      { "code": "TA", "name": "Tamil" },
      { "code": "TE", "name": "Telugu" },
      { "code": "KN", "name": "Kannada" },
      { "code": "MR", "name": "Marathi" },
      { "code": "GU", "name": "Gujarati" },
      { "code": "PA", "name": "Punjabi" },
      { "code": "ML", "name": "Malayalam" },
      { "code": "OR", "name": "Odia" },
      { "code": "AS", "name": "Assamese" },
      { "code": "NE", "name": "Nepali" },
      { "code": "SI", "name": "Sinhala" },
      { "code": "MP", "name": "Manipuri" },
      { "code": "BO", "name": "Bodo" },
      { "code": "SD", "name": "Sindhi" }
    ]
  },

  {
    "type": "NATIONALITY",
    "coll": "ophthamology_ecg_Nationality",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "IND", "name": "Indian" },
      { "code": "USA", "name": "American" },
      { "code": "UK", "name": "British" },
      { "code": "AUS", "name": "Australian" },
      { "code": "CAN", "name": "Canadian" }
    ]
  },
  {
    "type": "RELIGION",
    "coll": "ophthamology_ecg_Religion",
    "depColl": [],
    "payLoad": { "orgId": "" },
    "data": [
      { "code": "HINDU", "name": "Hindu" },
      { "code": "CHRISTIAN", "name": "Christian" },
      { "code": "MUSLIM", "name": "Muslim" },
      { "code": "SIKH", "name": "Sikh" },
      { "code": "BUDDHIST", "name": "Buddhist" },
      { "code": "JAIN", "name": "Jain" }
    ]
  },
  {
    "type": "SPECIALITIES",
    "coll": "ophthamology_ecg_Speciality",
    "depColl": [],
    "payLoad": { "orgId": "", "audit": {} },
    "data": [
      { "code": "CARDIOLOGY", "name": "Cardiology" },
      { "code": "NEUROLOGY", "name": "Neurology" },
      { "code": "ORTHOPEDICS", "name": "Orthopedics" },
      { "code": "DERMATOLOGY", "name": "Dermatology" },
      { "code": "GYNECOLOGY", "name": "Gynecology" },
      { "code": "OPHTHALMOLOGY", "name": "Ophthalmology" }
    ]
  },
  {
    "type": "SPECIALIZATIONS",
    "coll": "ophthamology_ecg_Specializations",
    "depColl": [],
    "payLoad": { "orgId": "", "audit": {} },
    "data": [
      { "specialtyCode": "CARDIOLOGY", "code": "INT_CARD", "name": "Interventional Cardiology" },
      { "specialtyCode": "CARDIOLOGY", "code": "PED_CARD", "name": "Pediatric Cardiology" },
      { "specialtyCode": "CARDIOLOGY", "code": "ECHOCARD", "name": "Echocardiography" },
      { "specialtyCode": "NEUROLOGY", "code": "PED_NEURO", "name": "Pediatric Neurology" },
      { "specialtyCode": "NEUROLOGY", "code": "NEUROPHYS", "name": "Neurophysiology" },
      { "specialtyCode": "NEUROLOGY", "code": "MOV_DIS", "name": "Movement Disorders" },
      { "specialtyCode": "ORTHOPEDICS", "code": "SPINE", "name": "Spine Surgery" },
      { "specialtyCode": "ORTHOPEDICS", "code": "JOINT", "name": "Joint Replacement" },
      { "specialtyCode": "ORTHOPEDICS", "code": "SPORTS", "name": "Sports Medicine" },
      { "specialtyCode": "DERMATOLOGY", "code": "COSMETIC", "name": "Cosmetic Dermatology" },
      { "specialtyCode": "DERMATOLOGY", "code": "PED_DERM", "name": "Pediatric Dermatology" },
      { "specialtyCode": "DERMATOLOGY", "code": "DERM_SURG", "name": "Dermatologic Surgery" },
      { "specialtyCode": "GYNECOLOGY", "code": "ONCO_GYN", "name": "Gynecologic Oncology" },
      { "specialtyCode": "GYNECOLOGY", "code": "REPROD_MED", "name": "Reproductive Medicine" },
      { "specialtyCode": "GYNECOLOGY", "code": "FETAL_MED", "name": "Fetal Medicine" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "CORNEA", "name": "Cornea Specialist" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "RETINA", "name": "Retina Specialist" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "GLAUCOMA", "name": "Glaucoma Specialist" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "PED_OPHTH", "name": "Pediatric Ophthalmology" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "OCULOPLASTY", "name": "Oculoplasty Specialist" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "NEURO_OPHTH", "name": "Neuro-Ophthalmology" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "UVEA", "name": "Uvea Specialist" },
      { "specialtyCode": "OPHTHALMOLOGY", "code": "REFRACT_SURG", "name": "Refractive Surgery" }
    ]
  },
  {
    "type": "DEPARTMENTS",
    "coll": "ophthamology_ecg_Departments",
    "depColl": [],
    "payLoad": { "orgId": "", "audit": {} },
    "data": [
      {
        "code": "OPTHMLGY",
        "name": "Ophthamology",
        "history": []
      }
    ]
  },
];
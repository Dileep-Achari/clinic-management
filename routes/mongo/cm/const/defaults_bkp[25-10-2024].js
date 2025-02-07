module.exports = [
    {
        "type": "DOCUMENTS",
        "coll": "cm_documents",
        "depColl": [],
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
            }
        ]
    },
    {      
        "type": "ROLES",
        "coll": "cm_roles",
        "depColl": ["cm_documents"],
        "data": [
            {
                label: "Practice Admin",
                access: {
                    "view": true,
                    "edit": true,
                    "print": true
                }
            }
        ]

    }
];
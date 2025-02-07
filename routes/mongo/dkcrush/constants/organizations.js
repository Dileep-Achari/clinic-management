const _org = [
    {
        "orgId": 1067,
        "locId": 1088,
        "orgKey": "emrr",
        "orgName": "Softhealth",
        "locName": "Hyderabad",
        //"apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        // "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "dbName": "dk_crush",
        "apkApiUrl": "https://drramesh.com/napi/apk/doctor",
        "emrApiUrl": "https://drramesh.com/napi/apt/api",
        "documentPhysicalPath": "/appdata/dk_crush",
        "documentPathUrl": "https://dkcrush.doctor9.com/path",
        "hisSyncUrls": [
            {
                "locId": 1088,
                "hisApiUrl": "https://drramesh.com/gntlabres/"
            }
        ],
        "labParams": []
    },
    {
        "orgId": 1002,
        "locId": 1047,
        "orgKey": "emr",
        "orgName": "Softhealth",
        "locName": "Hyderabad",
        "dbName": "dk_crush",
        "apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        //"emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        // "apkApiUrl": "https://drramesh.com/napi/apk/doctor",
         "emrApiUrl": "http://172.30.29.110:9001/patcareapi" || "https://drramesh.com/napi/apt/api",
        "documentPhysicalPath": "/appdata/dk_crush",
        "documentPathUrl": "https://dkcrush.doctor9.com/path",
        "hisSyncUrls": [
            {
                "locId": 1088,
                "hisApiUrl": "https://drramesh.com/gntlabres/"
            }
        ],
        "patSearch":true,
        "reports":[
            {
                "label":"New Surgeries",
                "cd":"NewSurgeries",
                "displayOrder":1,
                "count":0
            },
            {
                "label":"Closed Surgeries",
                "cd":"ClosedSurgeries",
                "displayOrder":2,
                "count":0
            },
            {
                "label":"System Closed Surgeries",
                "cd":"SystemClosedSurgeries",
                "displayOrder":3,
                "count":0
            },
            {
                 "label":"Open Surgeries Still",
                 "cd":"OpenSurgeries",
                 "displayOrder":4,
                 "count":0
             },
             {
                 "label":"Reopen Surgeries",
                 "cd":"ReopenSurgeries",
                 "displayOrder":5,
                 "count":0
             },
             {
                 "label":"Reopen Surgeries Approval",
                 "cd":"ReopenSurgeriesApproval",
                 "displayOrder":6,
                 "count":0
             },
         ],
        "labParams": [
            {
                "PARAMETERCD": "LPR1313",
                "PARAMETERDESC": "HAEMOGLOBIN",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 1,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1421",
                "PARAMETERDESC": "WBC COUNT",
                "SERVICEGROUPCD": "PAT",
                "SERVICEGROUPNAME": "PATHOLOGY",
                "ORDER": 2,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1363",
                "PARAMETERDESC": "PLATELET COUNT",
                "SERVICEGROUPCD": "PAT",
                "SERVICEGROUPNAME": "PATHOLOGY",
                "ORDER": 3,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0213",
                "PARAMETERDESC": "SERUM SODIUM",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 4,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR990",
                "PARAMETERDESC": "SERUM POTASSIUM", // Not found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 5,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR991",
                "PARAMETERDESC": "SERUM CHLORIDE", // Not found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 6,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0085",
                "PARAMETERDESC": "SERUM CREATININE",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 7,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0059",
                "PARAMETERDESC": "BLOOD UREA",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 8,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR61",
                "PARAMETERDESC": "SERUM URIC ACID", // Not Found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 9,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR59",
                "PARAMETERDESC": "SERUM CALCIUM", // Not Found
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 10,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR62",
                "PARAMETERDESC": "SERUM MAGNESIUM",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 11,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1519",
                "PARAMETERDESC": "RANDOM BLOOD SUGAR",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 12,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1432",
                "PARAMETERDESC": "FASTING BLOOD GLUCOSE",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 13,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0188",
                "PARAMETERDESC": "POST PRANDIAL BLOOD GLUCOSE",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 14,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0140",
                "PARAMETERDESC": "HBA1C",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 15,
                "ENABLED": "true"
            },

            {
                "PARAMETERCD": "LPR1835",
                "PARAMETERDESC": "D-DIMER",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 16,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR65",
                "PARAMETERDESC": "LDH",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 17,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1838",
                "PARAMETERDESC": "CRP QUANTITATIVE",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 18,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1839",
                "PARAMETERDESC": "CRP-PENTRA",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 19,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR68",
                "PARAMETERDESC": "FERRITIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 20,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1819",
                "PARAMETERDESC": "IL-6 (INTERLEUKIN)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 21,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR994",
                "PARAMETERDESC": "SERUM TROP-T HS",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 22,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0231",
                "PARAMETERDESC": "TOTAL BILIRUBIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 23,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0207",
                "PARAMETERDESC": "AST (SGOT)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 24,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0208",
                "PARAMETERDESC": "ALT (SGPT)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 25,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1241",
                "PARAMETERDESC": "GGT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 26,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR0234",
                "PARAMETERDESC": "TOTAL PROTEIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 27,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1833",
                "PARAMETERDESC": "SERUM ALBUMIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 28,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0232",
                "PARAMETERDESC": "TOTAL CHOLESTEROL (TOTAL)",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 29,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0160",
                "PARAMETERDESC": "SERUM LDL DIRECT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 30,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0230",
                "PARAMETERDESC": "SERUM HDL DIRECT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 31,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0239",
                "PARAMETERDESC": "TRIGLYCERIDES",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 32,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR89",
                "PARAMETERDESC": "SERUM TSH",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 33,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR468",
                "PARAMETERDESC": "SERUM PSA (TOTAL)",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 34,
                "ENABLED": "true"
            },
        ]
    },
    {
        "orgId": 1001,
        "locId": 1001,
        "orgKey": "ss",
        "orgName": "sunShine",
        "locName": "Hyderabad",
        "dbName": "dk_crush",
        //"apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        // "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "apkApiUrl": "https://drramesh.com/napi/apk/doctor",
        "emrApiUrl": "http://172.30.29.110:9001/patcareapi",
        "documentPhysicalPath": "/appdata/dk_crush",
        "documentPathUrl": "https://dkcrush.doctor9.com/path",
        "hisSyncUrls": [
            {
                "locId": 1088,
                "hisApiUrl": "https://drramesh.com/gntlabres/"
            }
        ],
        "labParams": [
            {
                "PARAMETERCD": "LPR1313",
                "PARAMETERDESC": "HAEMOGLOBIN",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 1,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1421",
                "PARAMETERDESC": "WBC COUNT",
                "SERVICEGROUPCD": "PAT",
                "SERVICEGROUPNAME": "PATHOLOGY",
                "ORDER": 2,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1363",
                "PARAMETERDESC": "PLATELET COUNT",
                "SERVICEGROUPCD": "PAT",
                "SERVICEGROUPNAME": "PATHOLOGY",
                "ORDER": 3,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0213",
                "PARAMETERDESC": "SERUM SODIUM",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 4,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR990",
                "PARAMETERDESC": "SERUM POTASSIUM", // Not found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 5,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR991",
                "PARAMETERDESC": "SERUM CHLORIDE", // Not found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 6,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0085",
                "PARAMETERDESC": "SERUM CREATININE",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 7,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0059",
                "PARAMETERDESC": "BLOOD UREA",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 8,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR61",
                "PARAMETERDESC": "SERUM URIC ACID", // Not Found
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 9,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR59",
                "PARAMETERDESC": "SERUM CALCIUM", // Not Found
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 10,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR62",
                "PARAMETERDESC": "SERUM MAGNESIUM",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 11,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1519",
                "PARAMETERDESC": "RANDOM BLOOD SUGAR",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 12,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1432",
                "PARAMETERDESC": "FASTING BLOOD GLUCOSE",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 13,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0188",
                "PARAMETERDESC": "POST PRANDIAL BLOOD GLUCOSE",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 14,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0140",
                "PARAMETERDESC": "HBA1C",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 15,
                "ENABLED": "true"
            },

            {
                "PARAMETERCD": "LPR1835",
                "PARAMETERDESC": "D-DIMER",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 16,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR65",
                "PARAMETERDESC": "LDH",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 17,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1838",
                "PARAMETERDESC": "CRP QUANTITATIVE",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 18,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1839",
                "PARAMETERDESC": "CRP-PENTRA",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 19,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR68",
                "PARAMETERDESC": "FERRITIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 20,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1819",
                "PARAMETERDESC": "IL-6 (INTERLEUKIN)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 21,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR994",
                "PARAMETERDESC": "SERUM TROP-T HS",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 22,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0231",
                "PARAMETERDESC": "TOTAL BILIRUBIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 23,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0207",
                "PARAMETERDESC": "AST (SGOT)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 24,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0208",
                "PARAMETERDESC": "ALT (SGPT)",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 25,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1241",
                "PARAMETERDESC": "GGT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 26,
                "ENABLED": "true"

            },
            {
                "PARAMETERCD": "LPR0234",
                "PARAMETERDESC": "TOTAL PROTEIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 27,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR1833",
                "PARAMETERDESC": "SERUM ALBUMIN",
                "SERVICEGROUPCD": "BIO",
                "SERVICEGROUPNAME": "BIOCHEMISTRY",
                "ORDER": 28,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0232",
                "PARAMETERDESC": "TOTAL CHOLESTEROL (TOTAL)",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 29,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0160",
                "PARAMETERDESC": "SERUM LDL DIRECT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 30,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0230",
                "PARAMETERDESC": "SERUM HDL DIRECT",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 31,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR0239",
                "PARAMETERDESC": "TRIGLYCERIDES",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 32,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR89",
                "PARAMETERDESC": "SERUM TSH",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 33,
                "ENABLED": "true"
            },
            {
                "PARAMETERCD": "LPR468",
                "PARAMETERDESC": "SERUM PSA (TOTAL)",
                "SERVICEGROUPCD": "",
                "SERVICEGROUPNAME": "",
                "ORDER": 34,
                "ENABLED": "true"
            },
        ]
    },
    {
        "orgId": 2,
        "locId": 31,
        "orgKey": "ss",
        "orgName": "Sunshine Hospitals",
        "locName": "Secunderabad",
        "apkApiUrl": "http://14.97.145.138/mobileapk/doctor",
        "emrApiUrl": "http://14.97.145.138/mobileapt/api",
        "documentPhysicalPath": "/appdata/dk_crush",
        "documentPathUrl": "https://dkcrush.doctor9.com/path",
        "hisSyncUrls": [
            {
                "locId": 31,
                "hisApiUrl": "http://14.97.145.138/hissync/oahstservice.asmx/"
            },
            {
                "locId": 32,
                "hisApiUrl": "http://14.97.145.138/hissyncgch/oahstservice.asmx/"
            }
        ],
        "labParams": []
    },
    {
        "orgId": 2,
        "locId": 32,
        "orgKey": "ss",
        "orgName": "Sunshine Hospitals",
        "locName": "Gachibowli",
        "apkApiUrl": "http://14.97.145.138/mobileapk/doctor",
        "emrApiUrl": "http://14.97.145.138/mobileapt/api",
        "documentPhysicalPath": "/appdata/dk_crush",
        "documentPathUrl": "https://dkcrush.doctor9.com/path",
        "hisSyncUrls": [
            {
                "locId": 31,
                "hisApiUrl": "http://14.97.145.138/hissync/oahstservice.asmx/"
            },
            {
                "locId": 32,
                "hisApiUrl": "http://14.97.145.138/hissyncgch/oahstservice.asmx/"
            }
        ],
        "labParams": []
    }
];

module.exports = _org;
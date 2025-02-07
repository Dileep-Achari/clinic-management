const _org = [
    {
        "orgId": 1000,
        "locId": 1001,
        "orgKey": "emr",
        "orgName": "Softhealth",
        "locName": "Hyderabad",
        "apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "hisSyncUrls": [
            {
                "locId": 1001,
                "hisApiUrl": "http://14.98.213.178:10002/HitechCity-hisSyncSrvc/oahstservice.asmx/"
            }
        ]
    },
    {
        "orgId": 1003,
        "locId": 1,
        "orgKey": "rh",
        "orgName": "Ramesh Hospitals",
        "locName": "Vijayawada",
        "apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "hisSyncUrls": [
            {
                "locId": 1088,
                "hisApiUrl": "http://14.98.213.178:10002/HitechCity-hisSyncSrvc/oahstservice.asmx/"
            }
        ],
        "fieldsSettings": [
            {
                "labelName": "Vitals",
                "fields": {
                    "bp": true,
                    "temp": true,
                    "weight": true,
                    "height": true,
                    "bmi": true,
                    "bsa": true,
                    "bloodGroup": true,
                    "heartRate": true,
                    "temprature": true,
                    "spo2": true,
                    "respRate": true,
                    "hdLengt": true,
                    "headCircum": true,
                    "WaistCircum": true,
                    "urinalysis": true,
                    "grbs": true,
                    "painScore": true,
                    "chestInsp": true,
                    "chestExp": true
                },
            }
        ]
    },
    {
        "orgId": 1001,
        "locId": 1,
        "orgKey": "ah",
        "orgName": "Aayush Hospitals",
        "locName": "Hyderabad",
        "apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "hisSyncUrls": [
            {
                "locId": 1088,
                "hisApiUrl": "http://14.98.213.178:10002/HitechCity-hisSyncSrvc/oahstservice.asmx/"
            }
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
        "hisSyncUrls": [
            {
                "locId": 31,
                "hisApiUrl": "http://14.97.145.138/hissync/oahstservice.asmx/"
            },
            {
                "locId": 32,
                "hisApiUrl": "http://14.97.145.138/hissyncgch/oahstservice.asmx/"
            }
        ]
    },
    {
        "orgId": 2,
        "locId": 32,
        "orgKey": "ss",
        "orgName": "Sunshine Hospitals",
        "locName": "Gachibowli",
        "apkApiUrl": "http://14.97.145.138/mobileapk/doctor",
        "emrApiUrl": "http://14.97.145.138/mobileapt/api",
        "hisSyncUrls": [
            {
                "locId": 31,
                "hisApiUrl": "http://14.97.145.138/hissync/oahstservice.asmx/"
            },
            {
                "locId": 32,
                "hisApiUrl": "http://14.97.145.138/hissyncgch/oahstservice.asmx/"
            }
        ]
    },
    {
        "orgId": "643015a8dcb6ba449bcd9de3",
        "locId": "643015a8dcb6ba449bcd9deb",
        //"orgKey": "rh",
        "orgName": "Softhealth",
        "locName": "Vijayawada",
        //"apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        // "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "dbName":"cm",
        // "apkApiUrl": "https://drramesh.com/napi/apk/doctor",
        // "emrApiUrl": "https://drramesh.com/napi/apt/api",
        "documentPhysicalPath":"/appdata/cm",
        "documentPathUrl":"https://cm.doctor9.com/path",
        // "hisSyncUrls": [
        //     {
        //         "locId": 1088,
        //         "hisApiUrl": "https://drramesh.com/gntlabres/"
        //     }
        // ],
        "labParams": [],
    },
     {
        "orgId": "673313b8199c57efb3cfc105",
        "locId": "673313b8199c57efb3cfc10e",
        "orgKey": "km",
        "orgName": "km clinic",
        "locName": "km clinic bhavanguda",
        //"apkApiUrl": "https://emr.doctor9.com/napi_cmn/apk/doctor",
        // "emrApiUrl": "https://emr.doctor9.com/napi_cmn/apt/api",
        "dbName":"cm",
        // "apkApiUrl": "https://drramesh.com/napi/apk/doctor",
        // "emrApiUrl": "https://drramesh.com/napi/apt/api",
        "documentPhysicalPath":"E://hosting/emr/Local/documents/",
        "documentPathUrl":"http://emr.doc9.xyz/path",
        // "hisSyncUrls": [
        //     {
        //         "locId": 1088,
        //         "hisApiUrl": "https://drramesh.com/gntlabres/"
        //     }
        // ],
        "labParams": []
    },
];

module.exports = _org;
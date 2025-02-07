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
    }
];

module.exports = _org;
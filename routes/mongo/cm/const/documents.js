const docs = [
    {
        "_id": "6355e5f256666f5555f2fff2",
        "orgId": 1000,
        "locId": 1001,
        "roles": [
            {
                "cd": "DOCTOR",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "NURSE",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "ADMIN",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f6666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "14477",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "6355e5f256666f5555f2fff2",
        "orgId": 1001,
        "locId": 1088,
        "roles": [
            {
                "cd": "DOCTOR",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "NURSE",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "ADMIN",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "6355e5f256666f5555f2fff2",
        "orgId": 1002,
        "locId": 1,
        "roles": [
            {
                "cd": "DOCTOR",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "NURSE",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "ADMIN",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "6355e5f256666f5555f2fff2",
        "orgId": 1003,
        "locId": 1,
        "roles": [
            {
                "cd": "DOCTOR",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "NURSE",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MASTERS",
                        "docName": "Masters",
                        "docUrl": "/masters",
                        "reportUrl": "masters.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    }
                ]
            },
            {
                "cd": "ADMIN",
                "recStatus": "A",
                "documents": [
                    {
                        "_id": "6355e5f256666f5555f2fff8",
                        "docCd": "DOCASS",
                        "docName": "Doctor Assessment",
                        "docUrl": "/doc-assmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "DOCREASS",
                        "docName": "Doctor Re-Assessment",
                        "docUrl": "/doc-reassmnt",
                        "reportUrl": "doctorassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "VITALS",
                        "docName": "Vitals",
                        "docUrl": "/vitals",
                        "reportUrl": "vitals.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURSEASS",
                        "docName": "Nurse Assessment",
                        "docUrl": "/nur-assmnt",
                        "reportUrl": "nurseassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "NURREASS",
                        "docName": "Nurse Re-Assessment",
                        "docUrl": "/nur-reassmnt",
                        "reportUrl": "nursereassmnt.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "SCORES",
                        "docName": "Scores",
                        "docUrl": "/scores",
                        "reportUrl": "scores.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "MEDICATION",
                        "docName": "Medication",
                        "docUrl": "/meds",
                        "reportUrl": "medication.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": false,
                            "edit": false,
                            "print": false
                        }
                    },
                    {
                        "_id": "6355e5f256666f5555fff8",
                        "docCd": "INVESTIGATION",
                        "docName": "Investigation",
                        "docUrl": "/invs",
                        "reportUrl": "investigation.html",
                        "recStatus": "A",
                        "qualityDocNo": "144577",
                        "isActive": true,
                        "access": {
                            "view": true,
                            "edit": true,
                            "print": true
                        }
                    }
                ]
            }
        ]
    }
]

module.exports = docs;
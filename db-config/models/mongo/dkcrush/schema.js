const mongoose = require("mongoose");
const moment = require("moment");
//let _dateTimeFormate = "DD/MM/yyyy HH:mm:ss";
//const nonoid=require('nanoid');
const _patient = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        recStatus: {
            type: String,
            default: () => { return 'A' }
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        revHist: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revNo: {
                    type: Number,
                    required: true
                },
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        cd: {
            type: String,
            required: true,
            default: () => { return `PAT001` }
        },
        patientId: {
            type: Number,
            //required: true
        },
        umr: {
            type: String,
            required: true,
            unique: true,
            immutable: true
        },
        uhr: {
            type: String
        },  // mand
        title: String,
        fName: {
            type: String,
            required: true
        },  // mand 
        mName: String,
        lName: String,
        disName: String,
        gender: {
            type: String,
            required: true
        },   // mand
        dob: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        age: Number,
        mobile: Number,
        bloodGroup: String,
        rhtype: String,
        height: Number,
        heightUnits: String,
        weight: Number,
        weightUnits: String,
        phone: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                def: String,
                num: String,
                type: { type: String }
            }
        ],
        nationality: String,
        languages: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: String,
                name: String,
                primary: String
            }
        ],
        address: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                def: {
                    type: String
                },
                type: {
                    type: String
                },
                city: String,
                zipcode: String,
                district: String,
                area: String,
                landMark: String,
                state: String,
                isNRI: {
                    type: Boolean,
                    default: () => { return false; }
                },
                country: String,
            }
        ],
        proof: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: String,
                value: String
            }
        ],
        photo: String,
        maritalStatus: String,
        isExipred: String,
        expiredDtTime: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        asaGrade: String,
        acompnyRelativeName: String,
        relationWithPatient: String,
        residenceOfRelative: String,
        countryOfRelative: String,
        contactDetOfRelative: String,
        isCompleted: Boolean,
        healthHist: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "allergy": [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    cd: String,
                    dtOfOnSetDays: Number,
                    dtOfOnSetEntered: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    isActive: String,
                    remarks: String
                }
            ],
            "ICD": [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    ver: Number,
                    cd: String,
                    dtOfOnSetDays: Number,
                    dtOfOnSetEntered: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    isActive: String,
                    remarks: String
                }
            ],
            "complaints": [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    cd: String,
                    dtOfOnSetDays: String,
                    dtOfOnSetEntered: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    active: String,
                    remarks: String
                }
            ]
        },
        "comorbidities": [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: String,
                name: {
                    type: String
                },
                dtOfOnSetDays: String,
                dtOfOnSetEntered: String,
                documentedBy: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        isActive: String,
                        remarks: String
                    }
                ],
                recordStatus: {
                    type: Boolean,
                    default: () => { return }
                },
                value: String,
                remarks: String
            }
        ],
        charlsonComorbidityIndex: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: String,
                name: String,
                value: String,
                count: String,
                recordStatus: {
                    type: Boolean,
                    default: () => { return }
                },
                documentedBy: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        isActive: String,
                        remarks: String
                    }
                ],
            }
        ],
        bmi: [
            {
                height: Number,
                weight: Number,
                bmi: Number
            }
        ],
        totalAdmnCount: Number,
        activeAdmn: String,
        admns: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                locCd: String,
                recStatus: String,
                admn: String,
                admnDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                disDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                admnStatus: String,
                admnType: String,
                primaryDoc: String,
                documentedBy: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        surgeries: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                admn: String,
                admnDt: String,
                disDt: String,
                surgId: {
                    type: String,
                    required: true
                }, //mand
                surgName: String,
                surgery: String,
                type: {
                    type: String
                },
                ps: String,
                route: String,
                surgeryClosed: {
                    type: Boolean,
                    default: () => { return false; }
                },
                systemClosed: {
                    type: Boolean,
                    default: () => { return false; }
                },
                surgeryClosedId: String,
                surgeryClosedBy: String,
                surgeryClosedDt: String,
                reviewDt: String,
                reviewRemarks: String,
                isRequest: {
                    type: Boolean,
                    default: () => { return false; }
                },
                reqRaisedBy: String,
                reqRaisedId: String,
                reqRaisedDt: {
                    type: String,
                    //default: () => { return new Date().toISOString() },
                },
                reasonForUnlock: String,
                reqApprovedBy: String,
                reqApprovedId: String,
                unlockReqSurgId: String,
                reqApprovedDt: {
                    type: String,
                    //default: () => { return new Date().toISOString() },
                },
                unlockRequest: {
                    type: Boolean,
                    default: () => { return false; }
                },
                unlockReqId: String,
                preOperative: {
                    type: Boolean,
                    default: false
                },
                intraOperative: {
                    type: Boolean,
                    default: false
                },
                prosthesis: {
                    type: Boolean,
                    default: false
                },
                scores: {
                    type: Boolean,
                    default: false
                },
                documents: {
                    type: Boolean,
                    default: false
                },
                progressStatus: String,
                surgeryBranch: String,
                surgeryIntraOPComp: String,
                tags: String,
                surgDtTm: String,
                followups: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        surgFollowupId: String,
                        followupNo: String,
                        followupOn: String,
                        date: String,
                        remarks: String,
                        nextFollowupDt: String,
                        documentedBy: String,
                        documentedId: String,
                        documentedDt: {
                            type: String,
                            default: () => { return new Date().toISOString() },
                        }
                    }
                ],
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        scores: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                admn: String,
                admnDt: String,
                scoreId: {
                    type: String,
                    required: true
                },
                scoreCd: {
                    type: String,
                    required: true
                },
                scoreName: {
                    type: String,
                    required: true
                },
                surgId: String,
                surgName: String,
                surgDtTm: String,
                followupId: String,
                followupNo: String,
                followupOn: String,
                followupDate: String,
                totalScore: {
                    type: String,
                    required: true
                },
                percentage: String,
                documentedId: String,
                documentedBy: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        document: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                docId: String,
                admNo: {
                    type: String
                },
                admnDt: String,
                docName: {
                    type: String,
                    required: true
                },
                docType: {
                    type: String,
                    required: true
                },
                format: {
                    type: String,
                    required: true
                },
                docData: {
                    type: Buffer
                },
                docMimeType: String,
                remarks: String,
                isImage: Boolean,
                path: String,
                surgId: String,
                surgName: String,
                surgDt: String,
                followupId: String,
                followupNo: String,
                followupOn: String,
                followupDate: String,
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        emrClinicalInfo: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            visits: {
                type: Object
            }
        },
        labResults: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            data: {
                type: Object
            }
        },
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

const _surgery = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        umr: {
            type: String,
            required: true
        },
        dg: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            dispName: String,
            gen: String,
            dob: {
                type: String
            },
            mob: String,
            addr: String,
            city: String,
            isNri: Boolean,
            state: String,
            zipcode: String,

            country: String,

        },
        admns: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                admnNo: {
                    type: String,
                    //required: true
                },
                datOfAdmn: {
                    type: String,
                    //required: true
                },
                disDt: {
                    type: String
                },
                surgDtls: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        revNo: {
                            type: Number,
                            required: true
                        },
                        revHist: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                revNo: Number,
                                documentedBy: String,
                                documentedId: String,
                                documentedDt: {
                                    type: String,
                                    default: () => { return new Date().toISOString() },
                                }
                            }
                        ],
                        surgery: {
                            type: String,
                            required: true
                        },
                        type: {
                            type: String,
                            required: true
                        },
                        surgeryClosed: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        systemClosed: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        surgeryClosedId: String,
                        surgeryClosedBy: String,
                        surgeryClosedDt: String,
                        reviewDt: String,
                        reviewRemarks: String,
                        isRequest: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        reqRaisedBy: String,
                        reqRaisedId: String,
                        reasonForUnlock: String,
                        reqRaisedDt: {
                            type: String,
                            //default: () => { return new Date().toISOString() },
                        },
                        reqApprovedBy: String,
                        reqApprovedId: String,
                        reqApprovedDt: {
                            type: String,
                            //default: () => { return new Date().toISOString() },
                        },
                        unlockRequest: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        unlockReqId: String,
                        ps: {
                            type: String,
                            required: true
                        },
                        route: {
                            type: String,
                            required: true
                        },
                        surgInfo: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true
                            },
                            dignosis: String,
                            pulseRate: String,
                            bloodPressure: String,
                            weightHight: String,
                            hemoglobin: String,
                            creatinine: String,
                            electrolites: String,
                            ldl: String,
                            hba1c: String,
                            trpinLvls: String,
                            ntProBnp: String,
                            dimer: String,
                            ecg: String,
                            ptca: String,
                            efEcho: String,
                            rmwa: String,
                            cag: String,
                            proInfo: String,
                            datOfAdmn: String,
                            dtOfproce: String,
                            consltName: String,
                            dkCrush: String,
                            bifurcation: String,
                            rota: String,
                            imaging: String,
                            imgingRemrks: String,
                            ivl: String,
                            mcs: String,
                            ffr: String,
                            ffrRemarks: String,
                            polmarisDone: String,
                            approch: String,
                            stentTyps: String,
                            bifuracationTechniq: String
                        },
                        followups: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true
                                },
                                followupNo: String,
                                followupOn: String,
                                date: String,
                                remarks: String,
                                nextFollowupDt: String,
                                audit: {
                                    documentedById: String,
                                    documentedBy: String,
                                    documentedDt: {
                                        type: String,
                                        default: () => { return new Date().toISOString() },
                                    },
                                    modifiedById: String,
                                    modifiedBy: String,
                                    modifiedDt: {
                                        type: String
                                    }
                                }
                            }
                        ],
                        audit: {
                            documentedById: String,
                            documentedBy: String,
                            documentedDt: {
                                type: String,
                                default: () => { return new Date().toISOString() },
                            },
                            modifiedById: String,
                            modifiedBy: String,
                            modifiedDt: {
                                type: String
                            }
                        },
                        history: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                revTranId: {
                                    type: String
                                },
                                revNo: {
                                    type: Number
                                }
                            }
                        ]
                    }],
                audit: {

                    documentedById: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    modifiedById: String,
                    modifiedBy: String,
                    modifiedDt: {
                        type: String
                    }
                },
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        revTranId: {
                            type: String
                        },
                        revNo: {
                            type: Number
                        }
                    }
                ]
            }
        ],
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

const _documents = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        umr: {
            type: String,
            required: true
        },
        admnNo: {
            type: String
        },
        admnDt: String,
        docName: {
            type: String,
            required: true
        },
        docType: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: true
        },
        docData: {
            type: Buffer
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        isImage: Boolean,
        path: String,
        surgId: String,
        surgName: String,
        surgDt: String,
        followupId: String,
        followupNo: String,
        followupOn: String,
        followupDate: String,
        docMimeType: String,
        remarks: String,
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

const _scores = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        patientId: String,
        umr: String,
        admn: String,
        admnDt: String,
        surgId: String,
        surgName: String,
        surgDtTm: String,
        recStatus: {
            type: Boolean,
            default: () => { return true }
        },
        scoreCd: {
            type: String,
            required: true
        },
        scoreName: {
            type: String,
            required: true
        },
        followupId: String,
        followupNo: String,
        followupOn: String,
        followupDate: String,
        totalScore: {
            type: String,
            required: true
        },
        percentage: String,
        childs: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: String,
                label: {
                    type: String
                },
                valueCd: {
                    type: String
                },
                value: {
                    type: String
                },
                valDesc: {
                    type: String
                }
            }
        ],
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        revHist: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revNo: {
                    type: Number,
                    required: true
                },
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        audit: {

            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

const _reviews = new mongoose.Schema([
    {
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        recStatus: {
            type: String,
            default: () => { return 'A' }
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        revHist: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revNo: {
                    type: Number,
                    required: true
                },
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        patientRefId: {
            type: String
        },
        umr: {
            type: String
        },
        disName: String,
        gender: String,
        dob: String,
        mobile: String,
        reviewDate: String,
        remarks: String,
        surgeryId: String,
        surgeryName: String,
        position: String,
        surgeryDate: String,
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

/**Role Master */
const _roles = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        cd: {
            type: String,
            immutable: true
        },
        department: {
            type: String
        },
        departmentCd: String,
        docmntMap: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                documentId: {
                    type: String
                },
                documentName: {
                    type: String,
                },
                groupCd: {
                    type: String,
                },
                groupName: {
                    type: String
                },
                iconClass: {
                    type: String
                },
                documentCd: String,
                docmntUrl: String,
                reportUrl: String,
                isMulti: {
                    type: Boolean,
                    default: false
                },
                access: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    read: {
                        type: Boolean,
                        default: false
                    },
                    write: {
                        type: Boolean,
                        default: false
                    },
                    edit: {
                        type: Boolean,
                        default: false
                    },
                    delete: {
                        type: Boolean,
                        default: false
                    },
                    approve: {
                        type: Boolean,
                        default: false
                    },
                    print: {
                        type: Boolean,
                        default: false
                    },
                    complete: {
                        type: Boolean,
                        default: false
                    },
                    adendum: {
                        type: Boolean,
                        default: false
                    },
                    signOff: {
                        type: Boolean,
                        default: false
                    },
                    rework: {
                        type: Boolean,
                        default: false
                    },
                    fileUpload: {
                        type: Boolean,
                        default: false
                    },
                }
            }
        ],
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
], { strict: true });

/**employee data */
const _employees = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true,
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        cd: {
            type: String,

            immutable: true
            // required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        empTypeCd: {
            type: String,
            required: true
        },
        empTypeName: {
            type: String,
            //  required: true
        },
        titleCd: {
            type: String,
            // required: true
        },
        titleName: {
            type: String,
            // required: true
        },
        fName: {
            type: String,
            //  required: true
        },
        mName: String,
        lName: String,
        dispName: {
            type: String,
            //  required: true
        },
        genderCd: {
            type: String,
            // required: true
        },
        gender: {
            type: String,
            // required: true
        },
        dob: String,
        emailID: String,
        photo: String,
        joinDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        adharNo: String,
        passport: String,
        userCd: String,
        userName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phone: String,
        mobile: {
            type: String,
            // required: true
        },
        address1: String,
        address2: String,
        areaCd: String,
        area: String,
        cityCd: String,
        city: String,
        stateCd: String,
        state: String,
        countryCd: String,
        country: String,
        zipCd: String,
        locations: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                locId: {
                    type: Number,
                    required: true
                },
                locName: {
                    type: String,
                    required: true
                },
                defLoc: {
                    type: Boolean,
                    default: false
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                designationCd: {
                    type: String,
                    //  required: true
                },
                designationName: {
                    type: String,
                    // required: true
                },
                departmentCd: {
                    type: String,
                },
                departmentName: {
                    type: String,
                    //  required: true
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                roleName: {
                    type: String,
                    required: true
                },

                audit: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    documentedById: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    modifiedById: String,
                    modifiedBy: String,
                    modifiedDt: {
                        type: String
                    }
                },
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        revTranId: {
                            type: String
                        },
                        revNo: {
                            type: Number
                        }
                    }
                ]
            }
        ],
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);
/**Forms data */
const _forms = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        cd: {
            type: String,
            immutable: true
        },
        groupCd: {
            type: String
        },
        groupName: {
            type: String
        },
        iconClass: {
            type: String
        },
        docmntCd: {
            type: String
        },
        docmntName: {
            type: String
        },
        docmntUrl: {
            type: String,

        },
        reportUrl: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        qualityDocNo: {
            type: String
        },
        isDynamic: {
            type: Boolean,
            default: false
        },
        isMulti: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

const _counter = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    locId: {
        type: String,
        required: true
    },
    seqName: {
        type: String,
        required: true,

    },
    recStatus: {
        type: Boolean,
        default: true
    },
    seqType: {
        type: String,
        required: true,

    },
    seqValue: {
        type: Number,
        required: true,
        default: 0
    },
    digits: {
        type: Number,
        required: true,
        default: 1
    },
    format: {
        type: String
    }
});

/**History  */
const _history = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        tranId: {
            type: String,
            //  required: true
        },
        method: {
            type: String,
            // required: true
        },
        collectionName: {
            type: String,
            //  required: true
        },
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: {
                type: String
            },
            documentedBy: {
                type: String,
                required: true
            },
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() }
            },
            modifiedById: {
                type: String,
                required: true
            },
            modifiedBy: {
                type: String,
                required: true
            },
            modifiedDt: {
                type: String,
                default: () => { return new Date().toISOString() }
            }
        },
        revNo: {
            type: Number
        },
        history: {
            type: Object
        }
    }
]);

/*Field Management */
const _field_management = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: String,
            required: true,
            immutable: true
        },
        locId: {
            type: String,
            required: true,
            immutable: true
        },
        userId: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        fields: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                orderNo: {
                    type: Number
                },
                field: {
                    type: String
                },
                header: {
                    type: String
                },
                sortFilter: {
                    type: Boolean,
                    default: false
                },
                visible: {
                    type: Boolean,
                    default: false
                },
                cellFilter: {
                    type: String
                },
                width: {
                    type: Number
                }
            }
        ],
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
]);

/**Entity data */
const _entity = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        cd: {
            type: String
        },
        label: {
            type: String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        child: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String
                },
                iconClass: {
                    type: String
                },
                revNo: {
                    type: Number,
                    required: true,
                    default: () => { return 1 }
                },
                label: {
                    type: String,
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                audit: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    documentedById: String,
                    documentedBy: String,
                    documentedDt: {
                        type: String,
                        default: () => { return new Date().toISOString() },
                    },
                    modifiedById: String,
                    modifiedBy: String,
                    modifiedDt: {
                        type: String
                    }
                },
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        revTranId: {
                            type: String
                        },
                        revNo: {
                            type: Number
                        }
                    }
                ]
            }
        ],
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        }
    }
]);

/** User Session */
const _userSession = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        recStatus: {
            type: Boolean,
            default: () => { return true; }
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: String,
        displayName: String,
        roleId: {
            type: String,
            required: true
        },
        roleName: String,
        logInTime: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        logOutTime: String,
        machine: String,
        browser: String,
        version: String,
        terminal: String,
        timeZone: String,
        token: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        revHist: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revNo: {
                    type: Number,
                    required: true
                },
                documentedBy: String,
                documentedId: String,
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                }
            }
        ],
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        }
    }
]);

const _unlockrequests = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        umr: {
            type: String,
            required: true
        },
        disName: String,
        dob: String,
        gender: String,
        patId: String,
        fName: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        recStatus: {
            type: Boolean,
            required: true
        },
        mName: String,
        lName: String,
        reqRaisedBy: String,
        reqRaisedId: String,
        reasonForUnlock: String,
        reqRaisedDt: {
            type: String,
            //default: () => { return new Date().toISOString() },
        },
        reqApprovedBy: String,
        reqApprovedId: String,
        reqApprovedDt: {
            type: String,
            //default: () => { return new Date().toISOString() },
        },
        unlockRequest: {
            type: Boolean,
            default: () => { return false; }
        },
        isRequest: {
            type: Boolean,
            default: () => { return true; }
        },
        address: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                def: {
                    type: String
                },
                type: {
                    type: String
                },
                city: String,
                zipcode: String,
                area: String,
                landMark: String,
                state: String,
                isNRI: {
                    type: Boolean,
                    default: () => { return false; }
                },
                country: String,
            }
        ],
        surgeries: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                admn: String,
                admnDt: String,
                surgId: {
                    type: String,
                    required: true
                }, //mand
                surgName: String,
                selPatSurgId: String,
                surgery: String,
                type: {
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    required: true
                },
                ps: String,
                route: String,
                surgeryClosed: {
                    type: Boolean,
                    default: () => { return false; }
                },
                systemClosed: {
                    type: Boolean,
                    default: () => { return false; }
                },
                surgeryClosedId: String,
                surgeryClosedBy: String,
                surgeryClosedDt: String,
                reviewDt: String,
                reviewRemarks: String,
                surgDtTm: String,
            }],
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }

])

const _mirth_event_trans = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        migId: {
            type: String,
            required: true
        },
        host: {
            type: String,
            required: true
        },
        eventId: {
            type: String,
            required: true
        },
        eventTrackId: {
            type: String,
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        recStatus: {
            type: Boolean,
            required: true
        },
        audit: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
    }
]);

const _templates = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number
        },
        locId: {
            type: Number,
        },
        reqTypeId: Number,
        reqDesc: String,
        isSms: Boolean,
        isEmail: Boolean,
        isWhatsApp: Boolean,
        recStatus: Boolean,
        isPushNotification: Boolean,
        smsTemplateId: String,
        smsTemplate: String,
        emailStyle: String,
        emailTemplate: String,
        waTemplateId: String,
        WaTemplate: String,
        pushNotificationTitle: String,
        pushNotificationTemplate: String,
        receiversRoles: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: String,
                roleName: String
            }
        ],
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
])

const _alerts = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: Number,
            required: true
        },
        locId: {
            type: Number,
            required: true
        },
        reqTypeId: Number,
        isSms: Boolean,
        isEmail: Boolean,
        isWhatsApp: Boolean,
        isPushNotification: Boolean,
        toMobile: String,
        smsTemplate: String,
        smsStatus: String,
        smsError: String,
        toEmail: String,
        recStatus: Boolean,
        emailTemplate: String,
        emailStatus: String,
        emailError: String,
        WaTemplate: String,
        WaStatus: String,
        WaError: String,
        toFcmToken: String,
        pushNotificationTitle: String,
        pushNotificationTemplate: String,
        pushNotificationStatus: String,
        pushNotificationError: String,
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
])

const _reportRequests = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        reportTypeCode: String,
        reportType: String,
        timePeriod: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            startDt: String,
            endDt: String
        },
        requestDt: String,
        payload: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            }
        },
        recStatus: Boolean,
        staus: String,
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
])


const _reports = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        requestId: String,
        requestDt: String,
        reportType: String,
        timePeriod: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            startDt: String,
            endDt: String
        },
        generatedData: Array,
        reportSize: Number,
        generatedAt: String,
        updatedAt: String,
        recStatus: Boolean,
        audit: {
            documentedById: String,
            documentedBy: String,
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: String,
            modifiedBy: String,
            modifiedDt: {
                type: String
            }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String
                },
                revNo: {
                    type: Number
                }
            }
        ]
    }
])

// const _zipcodes = new mongoose.Schema([
//     {
//         "_id": {
//             type: mongoose.Schema.Types.ObjectId,
//             required: true,
//             auto: true,
//         },
//         countryCd: String,
//         countryName: String,
//         stateCd: String,
//         stateName: String,
//         district: String,
//         area: String,
//         pinCode: Number
//     }
// ]);

const _pincodes = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        countryCd: String,
        countryName: String,
        stateCd: String,
        stateName: String,
        district: String,
        pinCode: Number,
        areas: [
            { name: String }
        ],

    }
]);

module.exports = [
    { "coll": 'patients', "schema": _patient, "db": "dk_crush" },
    { "coll": 'surgeries', "schema": _surgery, "db": "dk_crush" },
    { "coll": 'documents', "schema": _documents, "db": "dk_crush" },
    { "coll": 'scores', "schema": _scores, "db": "dk_crush" },
    { "coll": 'reviews', "schema": _reviews, "db": "dk_crush" },
    { "coll": 'roles', "schema": _roles, "db": "dk_crush" },
    { "coll": 'users', "schema": _employees, "db": "dk_crush" },
    { "coll": 'forms', "schema": _forms, "db": "dk_crush" },
    { "coll": 'counters', "schema": _counter, "db": "dk_crush" },
    { "coll": 'histories', "schema": _history, "db": "dk_crush" },
    { "coll": 'fieldsmanagement', "schema": _field_management, "db": "dk_crush" },
    { "coll": 'entity', "schema": _entity, "db": "dk_crush" },
    { "coll": 'usersessions', "schema": _userSession, "db": "dk_crush" },
    { "coll": 'unlockrequests', "schema": _unlockrequests, "db": "dk_crush" },
    { "coll": 'mirtheventtrans', "schema": _mirth_event_trans, "db": "dk_crush" },
    { "coll": 'templates', "schema": _templates, "db": "dk_crush" },
    { "coll": 'alerts', "schema": _alerts, "db": "dk_crush" },
    { "coll": 'reportrequests', "schema": _reportRequests, "db": "dk_crush" },
    { "coll": 'reports', "schema": _reports, "db": "dk_crush" },
    //{ "coll": 'zipcodes', "schema": _zipcodes, "db": "dk_crush" },
    { "coll": 'pincodes', "schema": _pincodes, "db": "dk_crush" },
];       
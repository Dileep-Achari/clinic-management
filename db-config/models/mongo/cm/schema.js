const mongoose = require('mongoose');
const shortId = require('shortid');

const _org = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgName: {
            type: String,
            required: true
        },
        orgKey: {
            type: String,
            immutable: true,
            required: true
        },
        syncOrgId: {
            type: Number,
            //required: true
        },
        dbType: {
            type: String,
            required: true,
            immutable: true
        },
        imgUrl: {
            type: String,
            required: true
        },
        orglogo: {
            type: Buffer
        },
        orglogoMimeType: {
            type: String
        },
        favIcon: {
            type: Buffer
        },
        favIconMimeType: {
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
        sessionTimeOut: {
            type: String
        },
        defLocId: {
            type: String,
            required: true
        },
        printHeader: String,
        getPatData: [
            {
                lblName: String,
                isShown: Boolean,
                sequenceNo: Number,
                cd:String
            }
        ],
        settings: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            formats: {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true
                },
                dtTm: {
                    type: String
                },
                dt: {
                    type: String
                },
                tm: {
                    type: String
                },
            },
            medSourceCd: String,
            medSourceLabel: String,
            autoSaveMed: Boolean,
            autoSaveIns: Boolean,
            autoSaveComp: Boolean,
            autoSaveICD: Boolean,
            autoSaveClinicInfo: Boolean
        },
        notificationTemplate: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
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
            cd: String,
            notificationType: {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                SMS: {
                    type: Boolean,
                    default: false
                },
                EMAIL: {
                    type: Boolean,
                    default: false
                },
                WHATSAPP: {
                    type: Boolean,
                    default: false
                },
                PUSHNOTIFICATION: {
                    type: Boolean,
                    default: false
                }
            },
            templateName: {
                type: String,
                required: function () {
                    return this.notificationType.SMS || this.notificationType.EMAIL || this.notificationType.WHATSAPP || this.notificationType.PUSHNOTIFICATION
                },
            },
            templates: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    receivers: {
                        type: String,
                    },
                    notificationType: {
                        type: String,
                        required: function () {
                            return this.notificationType.SMS || this.notificationType.EMAIL || this.notificationType.WHATSAPP || this.notificationType.PUSHNOTIFICATION
                        },
                    },
                    templateId: {
                        type: String,
                        required: function () {
                            return this.notificationType.SMS || this.notificationType.WHATSAPP
                        }
                    },
                    patMessageBody: {
                        type: String,
                        // required: function () {
                        //     return this.notificationType.SMS || this.notificationType.EMAIL || this.notificationType.WHATSAPP || this.notificationType.PUSHNOTIFICATION
                        // },
                    },
                    docMessageBody: {
                        type: String,
                        // required: function () {
                        //     return this.notificationType.SMS || this.notificationType.EMAIL || this.notificationType.WHATSAPP || this.notificationType.PUSHNOTIFICATION
                        // },
                    },
                    subject: {
                        type: String,
                        required: function () {
                            return this.notificationType.EMAIL || this.notificationType.PUSHNOTIFICATION;
                        },
                    },
                    patPlaceholders: {
                        type: String,
                    },
                    docPlaceholders: {
                        type: String,
                    },
                    attachments: {
                        type: String,
                    },
                    media: {
                        type: String,
                    },
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
        }],
        notificationVendors: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
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
            cd: String,
            vendorDetails: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    notificationType: String,
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    vendorCd: String,
                    vendorName: String,
                    vendorUrl: {
                        type: String,
                        required: function () {
                            return this.notificationType == "SMS"
                        },
                    },
                    projectId: {
                        type: String,
                        required: function () {
                            return this.notificationType == "SMS" && this.vendorCd == "VOX_PASS"
                        },
                    },
                    smsAuthToken: {
                        type: String,
                        required: function () {
                            return this.notificationType == "SMS" && this.vendorCd == "VOX_PASS"
                        },
                    },
                    from: {
                        type: String,
                        required: function () {
                            return this.notificationType == "SMS" && this.vendorCd == "VOX_PASS"
                        },
                    },
                    serverHost: {
                        type: String,
                        required: function () {
                            return this.notificationType == "EMAIL"
                        },
                    },
                    port: {
                        type: String,
                        required: function () {
                            return this.notificationType == "EMAIL"
                        },
                    },
                    hostEmail: {
                        type: String,
                        required: function () {
                            return this.notificationType == "EMAIL"
                        },
                    },
                    hostEmailPwd: {
                        type: String,
                        required: function () {
                            return this.notificationType == "EMAIL"
                        },
                    },
                    enterpriseId: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    user: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    password: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    sender: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    waToken: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    optInUrl: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    pushUrl: {
                        type: String,
                        required: function () {
                            return this.notificationType == "WHATSAPP"
                        },
                    },
                    pushNotificationUrl: {
                        type: String,
                        required: function () {
                            return this.notificationType == "PUSHNOTIFICATION"
                        },
                    },
                    patProjectId: {
                        type: String,
                        required: function () {
                            return this.notificationType == "PUSHNOTIFICATION"
                        },
                    },
                    docProjectId: {
                        type: String,
                        required: function () {
                            return this.notificationType == "PUSHNOTIFICATION"
                        },
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
        }],
        sessionId: {
            type: String,
            required: true
        },
        locations: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                sessionTimeOut: {
                    type: String
                },
                unitConcept: {
                    type: Boolean,
                    default: false
                },
                // linkedFacilities: [
                //     {
                //         "_id": {
                //             type: mongoose.Schema.Types.ObjectId,
                //             required: true,
                //             auto: true,
                //         },
                //         recStatus: {
                //             type: Boolean,
                //             default: true
                //         },
                //         locId: {
                //             type: String,
                //             required: true
                //         },
                //         code: {
                //             type: String
                //         },
                //         name: String,
                //         locKey: String,
                //         area: String,
                //         city: String,
                //         state: String,
                //         country: String,
                //         zipCd: String,
                //     }
                // ],
                faclityTyp: String,
                faclityCd: String,
                printStyles: {
                    type: String
                },
                serverTimeOut: String,
                himsSync: {
                    type: String
                },
                himsLabResUrl: {
                    type: String
                },
                syncServUrl: {
                    type: String
                },
                migId: {
                    type: String,
                    //required: true
                },
                emrMigId: {
                    type: String,
                    //required: true
                },
                syncLocId: {
                    type: Number,
                    //required: true
                },
                i_orgCd: {
                    type: String
                },
                i_locCd: {
                    type: String
                },
                locKey: {
                    type: String,
                    required: true
                },
                locName: {
                    type: String,
                    required: true
                },
                //locationCd: String,
                //companyCd: String,
                // himsSync: String,
                himsSyncCd: String,
                "printLang": {
                    type: String
                },
                regFeeAmount: {
                    type: String
                },
                regFee: {
                    type: Boolean,
                    default: false
                },
                sessionOut: String,
                defLoc: {
                    type: Boolean
                },
                nabhLogo: {
                    type: Buffer,
                },
                nabhMimeType: {
                    type: String,
                },
                notification: [{
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true
                    },
                    cd: String,
                    name: {
                        type: String,
                        required: true
                    },
                    apiUrl: String,
                    uName: String,
                    pwd: String,
                }],
                settings: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    dateFormat: {
                        type: String
                    },
                    calenderDtFormat: {
                        type: String
                    },
                    placeholderDtFormat: {
                        type: String
                    },
                    timeFormat: {
                        type: String
                    },
                    currency: {
                        type: String
                    },
                    printWithHeader: {
                        type: Boolean
                    },
                    printMarginTop: {
                        type: String
                    },
                    printMarginButtom: {
                        type: String
                    },
                    viewTemplate: {
                        type: String
                    },
                    docSignature: {
                        type: String
                    },
                    autoQNo: {
                        type: Boolean,
                        default: false
                    },
                    sessionExpireLimit: {
                        type: Number
                    },
                    autoApprove: {
                        type: Boolean,
                        default: false
                    },
                    watermark: {
                        type: Boolean,
                        default: false
                    },
                    editDuration: {
                        type: Number
                    },
                    orderSets: {
                        type: String
                    },
                    notification: [{
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        cd: String,
                        name: {
                            type: String,
                            required: true
                        },
                        apiUrl: String,
                        uName: String,
                        pwd: String,
                    }],
                    formats: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        dtTm: {
                            type: String
                        },
                        dt: {
                            type: String
                        },
                        tm: {
                            type: String
                        },
                    },
                    documentsPrint: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            documentCd: {
                                type: String
                            },
                            documentId: {
                                type: String
                            },
                            documentName: {
                                type: String
                            },
                        }
                    ],
                    vitalsUnits: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        temp: {
                            type: String
                        },
                        weight: {
                            type: String
                        },
                        height: {
                            type: String
                        },
                    },
                    medSourceCd: String,
                    medSourceLabel: String,
                    autoSaveMed: Boolean,
                    autoSaveIns: Boolean,
                    autoSaveComp: Boolean,
                    autoSaveICD: Boolean,
                    autoSaveClinicInfo: Boolean
                },
                formats: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true
                    },
                    dtTm: {
                        type: String
                    },
                    dt: {
                        type: String
                    },
                    tm: {
                        type: String
                    },
                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                emailID: {
                    type: String,
                    required: true
                },
                ofcPhnNo: String,
                faxNo: String,
                mblNo: String,
                webUrl: String,
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
                geoCoordinats: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    lat: String,
                    long: String
                },
                contactPerson: String,
                contactMobile: String,
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
        sessionId: {
            type: String,
            // required:true
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
            type: Number,
            //  required: true
        },
        history: {
            type: Object,
            // required: true
        }
    }
]);

/**Role Master */
const _role_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        cd: {
            type: String,

            immutable: true
            // required: true
        },
        defaultTabCd: String,
        defaultTabName: String,
        department: {
            type: String,
            //   required: true
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
                    type: String,
                    // required: true
                },
                documentName: {
                    type: String,
                    // required: true
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
                    delete: {
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
        tabsMap: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                label: String,
                cd: String,
                iconClass: String,
                isActive: Boolean,
                isShown: Boolean,
                permission: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    isActive: Boolean,
                    isShown: Boolean,
                    read: Boolean,
                    write: Boolean,
                    delete: Boolean,
                    print: Boolean,
                    adendum: Boolean,
                    complete: Boolean,
                    signOff: Boolean,
                    rework: Boolean,
                    fileUpload: Boolean,
                    edit: Boolean,
                    approve: Boolean,
                    reject : Boolean,
                    accessUser: Boolean,
                },
                routeUrl: String,
                displayOrder: Number,
            }
        ],
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        sessionId: {
            type: String,
            required: true
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
const _employee_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: mongoose.Schema.Types.ObjectId,
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
        sessionId: {
            type: String,
            // required:true
        },
        locations: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                locId: {
                    type: mongoose.Schema.Types.ObjectId,
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
                resourceMap: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
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
                        docCd: {
                            type: String
                            //  required: true
                        },
                        docTypeCd: {
                            type: String,
                            //  required: true
                        },
                        docTypeName: {
                            type: String,
                            //  required: true
                        },
                        titleCd: {
                            type: String,
                            //   required: true
                        },
                        titleName: {
                            type: String,
                            //  required: true
                        },
                        fName: {
                            type: String,
                            //  required: true
                        },
                        mName: {
                            type: String,
                            //  required: true
                        },
                        lName: {
                            type: String,
                            //  required: true
                        },
                        dispName: {
                            type: String,
                            //  required: true
                        },
                        genderCd: {
                            type: String,
                            //  required: true
                        },
                        gender: {
                            type: String,
                            // required: true
                        },
                        dob: {
                            type: String,
                            //  required: true
                        },
                        emailID: {
                            type: String,
                            // required: true
                        },
                        userName: {
                            type: String,
                            // required: true,
                            immutable: true
                        },
                        password: {
                            type: String,
                            //  required: true
                        },
                        phone: {
                            type: String,
                            //  required: true
                        },
                        mobile: {
                            type: String,
                            // required: true
                        },
                        photo: {
                            type: String,
                            // required: true
                        },
                        signature: {
                            type: String,
                            //  required: true
                        },
                        apmntReq: {
                            type: Boolean,
                            default: true
                        },
                        speclityCd: {
                            type: String,
                            //required: true
                        },
                        speclityId: {
                            type: String,
                            //required: true
                        },
                        speclityName: {
                            type: String,
                            // required: true
                        },
                        specializations: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                cd: {
                                    type: String
                                    // required: true
                                },
                                name: {
                                    type: String,
                                    //  required: true
                                },
                                recStatus: {
                                    type: Boolean,
                                    default: true
                                }
                            }
                        ],
                        qualfCd: {
                            type: String,
                            // required: true
                        },
                        qualf: {
                            type: String,
                            // required: true
                        },
                        designationCd: {
                            type: String
                        },
                        designation: {
                            type: String,
                            // required: true
                        },
                        regNo: {
                            type: String,
                            //    required: true
                        },
                        sessionId: {
                            type: String,
                            // required:true
                        },
                        locations: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true
                                },
                                locId: {
                                    type: String,
                                    //  required: true
                                },
                                locName: {
                                    type: String,
                                    //  required: true
                                },
                                defLoc: {
                                    type: Boolean,
                                    default: false
                                },
                                recStatus: {
                                    type: Boolean,
                                    default: true
                                },
                                roleId: {
                                    type: mongoose.Schema.Types.ObjectId,
                                    //  required: true
                                },
                                roleName: {
                                    type: String,
                                    // required: true
                                },
                                isActive: {
                                    type: Boolean,
                                    default: true
                                },
                                settings: {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true
                                    },
                                    allergyMandatory: {
                                        type: Boolean,
                                        default: false
                                    },
                                    autoCancel: {
                                        type: Boolean,
                                        default: false
                                    },
                                    autoQno: {
                                        type: Boolean,
                                        default: false
                                    },
                                    autoSchedule: {
                                        type: Boolean,
                                        default: false
                                    },
                                    autoCheckOut: {
                                        type: Boolean,
                                        default: false
                                    },
                                    autoWlRequired: {
                                        type: Boolean,
                                        default: false
                                    },
                                    chekOutEdit: {
                                        type: Boolean,
                                        default: false
                                    },
                                    chekOutEditDays: {
                                        type: String,
                                        //  required: true
                                    },
                                    genericOrItem: {
                                        type: String,
                                        // required: true
                                    },
                                    multiAptms: {
                                        type: Boolean,
                                        //  default: false
                                    },
                                    qmsOrder: {
                                        type: String,
                                        //  required: true
                                    },
                                    zeroStockShow: {
                                        type: Boolean,
                                        default: false
                                    },
                                    printMedication: {
                                        type: Boolean,
                                        default: false
                                    },
                                    printReptHead: {
                                        type: Boolean,
                                        default: false
                                    },
                                    shiftDaysAval: {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        sun: {
                                            type: Boolean,
                                            default: false
                                        },
                                        mon: {
                                            type: Boolean,
                                            default: true
                                        },
                                        tue: {
                                            type: Boolean,
                                            default: true
                                        },
                                        wed: {
                                            type: Boolean,
                                            default: true
                                        },
                                        thu: {
                                            type: Boolean,
                                            default: true
                                        },
                                        fri: {
                                            type: Boolean,
                                            default: true
                                        },
                                        sat: {
                                            type: Boolean,
                                            default: true
                                        },
                                    },
                                    vitColInd: {
                                        type: Boolean,
                                        default: false
                                    },
                                    vitUnitCon: {
                                        type: Boolean,
                                        default: false
                                    },
                                    waitListCountReq: {
                                        type: Boolean,
                                        default: false
                                    },
                                    waitListCount: {
                                        type: Number,
                                    },
                                    walkInAssignFirstWL: {
                                        type: String,
                                        //  required: true
                                    },
                                    weekOff: {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        sun: {
                                            type: Boolean,
                                            default: true
                                        },
                                        mon: {
                                            type: Boolean,
                                            default: false
                                        },
                                        tue: {
                                            type: Boolean,
                                            default: false
                                        },
                                        wed: {
                                            type: Boolean,
                                            default: false
                                        },
                                        thu: {
                                            type: Boolean,
                                            default: false
                                        },
                                        fri: {
                                            type: Boolean,
                                            default: false
                                        },
                                        sat: {
                                            type: Boolean,
                                            default: false
                                        }
                                    },
                                },
                                shifts: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        type: {
                                            type: String
                                            //  required: true
                                        },
                                        duration: {
                                            type: String,
                                            //   required: true
                                        },
                                        from: {
                                            type: String,
                                            //   required: true
                                        },
                                        to: {
                                            type: String,
                                            //  required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                fees: {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true
                                    },
                                    reg: {
                                        type: String,
                                        // required: true
                                    },
                                    normal: {
                                        type: String,
                                        //  required: true
                                    },
                                    emergency: {
                                        type: String,
                                        // required: true
                                    },
                                    online: {
                                        type: String,
                                        //  required: true
                                    },
                                    reVisit: {
                                        type: String,
                                        //  required: true
                                    },
                                },
                                medsFavs: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        mId: {
                                            type: String
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        name: {
                                            type: String,
                                            //  required: true
                                        },
                                        seq: {
                                            type: Number,
                                            //   required: true
                                        },
                                        instr: {
                                            type: String,
                                            //   required: true
                                        },
                                        freq: {
                                            type: String,
                                            //  required: true
                                        },
                                        days: {
                                            type: String,
                                            // required: true
                                        },
                                        qty: {
                                            type: String,
                                            //   required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                testsFavs: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true,
                                        },
                                        tId: {
                                            type: String
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        name: {
                                            type: String,
                                            // required: true
                                        },
                                        instr: {
                                            type: String,
                                            //  required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                medsOrderSets: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        name: {
                                            type: String,
                                            //  required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        },
                                        childs: [
                                            {
                                                "_id": {
                                                    type: mongoose.Schema.Types.ObjectId,
                                                    required: true,
                                                    auto: true,
                                                },
                                                mId: {
                                                    type: String
                                                },
                                                cd: {
                                                    type: String
                                                    // required: true
                                                },
                                                seq: {
                                                    type: Number,
                                                    //  required: true
                                                },
                                                instr: {
                                                    type: String,
                                                    //   required: true
                                                },
                                                freq: {
                                                    type: String,
                                                    //  required: true
                                                },
                                                days: {
                                                    type: String,
                                                    //  required: true
                                                },
                                                qty: {
                                                    type: String,
                                                    //   required: true
                                                },
                                                recStatus: {
                                                    type: Boolean,
                                                    default: true
                                                },
                                                isActive: {
                                                    type: Boolean,
                                                    default: true
                                                }
                                            }
                                        ]
                                    }
                                ],
                                testsOrderSets: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        name: {
                                            type: String,
                                            //  required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        },
                                        childs: [
                                            {
                                                "_id": {
                                                    type: mongoose.Schema.Types.ObjectId,
                                                    required: true,
                                                    auto: true
                                                },
                                                tId: {
                                                    type: String
                                                },
                                                cd: {
                                                    type: String
                                                    // required: true
                                                },
                                                seq: {
                                                    type: Number,
                                                    //  required: true
                                                },
                                                instr: {
                                                    type: String,
                                                    //  required: true
                                                },
                                                recStatus: {
                                                    type: Boolean,
                                                    default: true
                                                },
                                                isActive: {
                                                    type: Boolean,
                                                    default: true
                                                },
                                            }
                                        ]
                                    }
                                ],
                                documentSettings: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true,
                                        },
                                        docId: {
                                            type: String
                                        },
                                        docmntCd: {
                                            type: String,
                                            //  required: true
                                        },
                                        docmntName: {
                                            type: String,
                                            //   required: true
                                        },
                                        status: {
                                            type: String,
                                            //  required: true,
                                            //  default: () => { return A }
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                printSettings: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true,
                                        },
                                        docId: {
                                            type: String
                                        },
                                        docmntCd: {
                                            type: String,
                                            //  required: true
                                        },
                                        docmntName: {
                                            type: String,
                                            //  required: true
                                        },
                                        status: {
                                            type: String,
                                            //  required: true,
                                            //  default: () => { return A }
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                holiDays: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true,
                                        },
                                        name: {
                                            type: String,
                                            //   required: true
                                        },
                                        date: {
                                            type: String,
                                            //   required: true
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        type: {
                                            type: String,
                                            //  required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
                                        isActive: {
                                            type: Boolean,
                                            default: true
                                        }
                                    }
                                ],
                                unitMap: [
                                    {
                                        "_id": {
                                            type: mongoose.Schema.Types.ObjectId,
                                            required: true,
                                            auto: true,
                                        },
                                        cd: {
                                            type: String
                                            // required: true
                                        },
                                        recStatus: {
                                            type: Boolean,
                                            default: true
                                        },
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
                        ]
                    }
                    // {
                    //     "_id": {
                    //         type: mongoose.Schema.Types.ObjectId,
                    //         auto: true,
                    //     },
                    //     type: {
                    //         type: String,
                    //         // required: true
                    //     },
                    //     docCd: {
                    //         type: String
                    //     },
                    //     docName: {
                    //         type: String
                    //     },
                    //     docDegree: {
                    //         type: String
                    //     },
                    //     registerId: {
                    //         type: String
                    //     },
                    //     speciality: {
                    //         type: String
                    //     },
                    //     specialization: {
                    //         type: String
                    //     },
                    //     recStatus: {
                    //         type: Boolean,
                    //         default: true
                    //     },
                    //     audit: {
                    //         "_id": {
                    //             type: mongoose.Schema.Types.ObjectId,
                    //             required: true,
                    //             auto: true,
                    //         },
                    //         documentedById: String,
                    //         documentedBy: String,
                    //         documentedDt: {
                    //             type: String,
                    //             default: () => { return new Date().toISOString() },
                    //         },
                    //         modifiedById: String,
                    //         modifiedBy: String,
                    //         modifiedDt: {
                    //             type: String
                    //         }
                    //     },
                    // }
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

/*Users  */
const _users = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: mongoose.Schema.Types.ObjectId
        },
        empId: {
            type: mongoose.Schema.Types.ObjectId
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            immutable: true

        },
        password: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        // photo: Buffer,
        // signature: Buffer,
        // photoMimeType: String,
        // signatureMimeType: String,
        mobile: {
            type: String,
            //required: true
        },
        email: {
            type: String,
            //required: true
        },
        otp: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        defaultLocId: String,
        locations: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            recStatus: {
                type: Boolean,
                default: true
            },
            locId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            locName: {
                type: String,
                required: true
            },
            roleId: {
                type: mongoose.Schema.Types.ObjectId
                //required: true
            },
            role: {
                type: String,
                required: true
            },
        }],
        loginStatus: {
            type: Boolean,
            default: () => { return false }
        },
        logHistory: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            systemName: String,
            dateTime: String

        }],
        lockStatus: {
            type: Boolean,
            default: () => { return false }
        },
        sessionId: {
            type: String,
            // required:true
        },
        lockDtTime: String,
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

/** Doctors Data */
const _doctors = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        userInsertion: {
            type: Boolean,
            default: true
        },
        docCd: {
            type: String
            //  required: true
        },
        i_docCd: {
            type: String,
        },
        isSrDoctor: {
            type: Boolean,
            //default: true
        },
        docTypeCd: {
            type: String,
            //  required: true
        },
        docTypeName: {
            type: String,
            //required: true
        },
        titleCd: {
            type: String,
            //   required: true
        },
        titleName: {
            type: String,
            //required: true
        },
        fName: {
            type: String,
            //  required: true
        },
        mName: {
            type: String,
            //  required: true
        },
        lName: {
            type: String,
            //  required: true
        },
        dispName: {
            type: String,
            //  required: true
        },
        genderCd: {
            type: String,
            //  required: true
        },
        gender: {
            type: String,
            //required: true
        },
        dob: {
            type: String,
            //required: true
        },
        emailID: {
            type: String,
            // required: true
        },
        userName: {
            type: String,
            required: true,
            immutable: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            //  required: true
        },
        mobile: {
            type: String,
            //required: true
        },
        photo: {
            type: Buffer,
            // required: true
        },
        signature: {
            type: Buffer,
            //  required: true
        },
        photoMimeType: String,
        signatureMimeType: String,
        apmntReq: {
            type: Boolean,
            default: true
        },
        speclityCd: {
            type: String,
            //required: true
        },
        speclityId: {
            type: String,
            //required: true
        },
        speclityName: {
            type: String,
            //required: true
        },
        clinicentrymoduleCd: String,
        clinicentrymoduleName: String,
        specializations: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String
                    // required: true
                },
                name: {
                    type: String,
                    //  required: true
                },
                recStatus: {
                    type: Boolean,
                    default: true
                }
            }
        ],
        qualfCd: {
            type: String,
            //required: true
        },
        qualf: {
            type: String,
            //required: true
        },
        designationCd: {
            type: String
        },
        designation: {
            type: String,
            //required: true
        },
        regNo: {
            type: String,
            //    required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        locations: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true
                },
                locId: {
                    type: String,
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
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                departmentName: {
                    type: String,
                    //required: true
                },
                departmentCd: {
                    type: String,
                    //required: true
                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                settings: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true
                    },
                    allergyMandatory: {
                        type: Boolean,
                        default: false
                    },
                    autoCancel: {
                        type: Boolean,
                        default: false
                    },
                    autoQno: {
                        type: Boolean,
                        default: false
                    },
                    autoSchedule: {
                        type: Boolean,
                        default: false
                    },
                    autoCheckOut: {
                        type: Boolean,
                        default: false
                    },
                    autoWlRequired: {
                        type: Boolean,
                        default: false
                    },
                    chekOutEdit: {
                        type: Boolean,
                        default: false
                    },
                    chekOutEditDays: {
                        type: String,
                        //  required: true
                    },
                    genericOrItem: {
                        type: String,
                        // required: true
                    },
                    multiAptms: {
                        type: Boolean,
                        //  default: false
                    },
                    qmsOrder: {
                        type: String,
                        //  required: true
                    },
                    zeroStockShow: {
                        type: Boolean,
                        default: false
                    },
                    printMedication: {
                        type: Boolean,
                        default: false
                    },
                    printReptHead: {
                        type: Boolean,
                        default: false
                    },
                    shiftDaysAval: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        sun: {
                            type: Boolean,
                            default: false
                        },
                        mon: {
                            type: Boolean,
                            default: true
                        },
                        tue: {
                            type: Boolean,
                            default: true
                        },
                        wed: {
                            type: Boolean,
                            default: true
                        },
                        thu: {
                            type: Boolean,
                            default: true
                        },
                        fri: {
                            type: Boolean,
                            default: true
                        },
                        sat: {
                            type: Boolean,
                            default: true
                        },
                    },
                    vitColInd: {
                        type: Boolean,
                        default: false
                    },
                    vitUnitCon: {
                        type: Boolean,
                        default: false
                    },
                    waitListCountReq: {
                        type: Boolean,
                        default: false
                    },
                    waitListCount: {
                        type: Number,
                    },
                    walkInAssignFirstWL: {
                        type: String,
                        //  required: true
                    },
                    vitals: {
                        BP: Boolean,
                        PULSE: Boolean,
                        WTG: Boolean,
                        HGT: Boolean,
                        BMI: Boolean,
                        BSA: Boolean,
                        BDGP: Boolean,
                        HTRE: Boolean,
                        TEM: Boolean,
                        SPO2: Boolean,
                        RPRT: Boolean,
                        HDLG: Boolean,
                        HDCFR: Boolean,
                        WTCFR: Boolean,
                        URISIS: Boolean,
                        GRBS: Boolean,
                        PAINSCR: Boolean,
                        CHESTIN: Boolean,
                        CHESTEX: Boolean
                    },
                    weekOff: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        sun: {
                            type: Boolean,
                            default: true
                        },
                        mon: {
                            type: Boolean,
                            default: false
                        },
                        tue: {
                            type: Boolean,
                            default: false
                        },
                        wed: {
                            type: Boolean,
                            default: false
                        },
                        thu: {
                            type: Boolean,
                            default: false
                        },
                        fri: {
                            type: Boolean,
                            default: false
                        },
                        sat: {
                            type: Boolean,
                            default: false
                        }
                    },
                    diabetictab: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true
                            },
                            show: Boolean,
                            code: String,
                            idx: Number,
                            name: String
                        }
                    ],
                    diabeticPrinttab: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true
                            },
                            show: Boolean,
                            code: String,
                            idx: Number,
                            name: String
                        }
                    ]
                },
                shifts: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        type: {
                            type: String
                            //  required: true
                        },
                        duration: {
                            type: String,
                            //required: true
                        },
                        from: {
                            type: String,
                            //required: true
                        },
                        to: {
                            type: String,
                            //required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                fees: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true
                    },
                    reg: {
                        type: String,
                        // required: true
                    },
                    normal: {
                        type: String,
                        //  required: true
                    },
                    emergency: {
                        type: String,
                        // required: true
                    },
                    online: {
                        type: String,
                        //  required: true
                    },
                    reVisit: {
                        type: String,
                        //  required: true
                    },
                },
                medsFavs: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        mId: {
                            type: String
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        name: {
                            type: String,
                            required: true
                        },
                        seq: {
                            type: Number,
                            //   required: true
                        },
                        instr: {
                            type: String,
                            //   required: true
                        },
                        freq: {
                            type: String,
                            //  required: true
                        },
                        days: {
                            type: String,
                            // required: true
                        },
                        qty: {
                            type: String,
                            //   required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                testsFavs: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        tId: {
                            type: String
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        name: {
                            type: String,
                            required: true
                        },
                        instr: {
                            type: String,
                            //  required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                medsOrderSets: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        name: {
                            type: String,
                            //  required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        },
                        childs: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                mId: {
                                    type: String
                                },
                                cd: {
                                    type: String
                                    // required: true
                                },
                                seq: {
                                    type: Number,
                                    //  required: true
                                },
                                instr: {
                                    type: String,
                                    //   required: true
                                },
                                freq: {
                                    type: String,
                                    //  required: true
                                },
                                days: {
                                    type: String,
                                    //  required: true
                                },
                                qty: {
                                    type: String,
                                    //   required: true
                                },
                                recStatus: {
                                    type: Boolean,
                                    default: true
                                },
                                isActive: {
                                    type: Boolean,
                                    default: true
                                }
                            }
                        ]
                    }
                ],
                testsOrderSets: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        name: {
                            type: String,
                            //  required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        },
                        childs: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true
                                },
                                tId: {
                                    type: String
                                },
                                cd: {
                                    type: String
                                    // required: true
                                },
                                seq: {
                                    type: Number,
                                    //  required: true
                                },
                                instr: {
                                    type: String,
                                    //  required: true
                                },
                                recStatus: {
                                    type: Boolean,
                                    default: true
                                },
                                isActive: {
                                    type: Boolean,
                                    default: true
                                },
                            }
                        ]
                    }
                ],
                documentSettings: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        docId: {
                            type: String
                        },
                        docmntCd: {
                            type: String,
                            //  required: true
                        },
                        docmntName: {
                            type: String,
                            //   required: true
                        },
                        status: {
                            type: String,
                            //  required: true,
                            //  default: () => { return A }
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                printSettings: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        docId: {
                            type: String
                        },
                        docmntCd: {
                            type: String,
                            //  required: true
                        },
                        docmntName: {
                            type: String,
                            //  required: true
                        },
                        status: {
                            type: String,
                            //  required: true,
                            //  default: () => { return A }
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                holiDays: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        name: {
                            type: String,
                            //   required: true
                        },
                        date: {
                            type: String,
                            //   required: true
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        type: {
                            type: String,
                            //  required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
                        isActive: {
                            type: Boolean,
                            default: true
                        }
                    }
                ],
                unitMap: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        cd: {
                            type: String
                            // required: true
                        },
                        recStatus: {
                            type: Boolean,
                            default: true
                        },
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

/**document data */
const _document_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        cd: {
            type: String,

            immutable: true
            // required: true
        },
        groupCd: {
            type: String,
            // required: true
        },
        groupName: {
            type: String,
            //  required: true
        },
        iconClass: {
            type: String
        },
        docmntCd: {
            type: String,
            //  required: true
        },
        docmntName: {
            type: String,
            //    required: true
        },
        docmntCd: {
            type: String,
            //    required: true
        },
        docmntUrl: {
            type: String,
            // required: true
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
            type: String,
            //required: true
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
        sessionId: {
            type: String,
            // required:true
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

/**med data */
const _med_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: String,
            // required: true
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
        medCd: {
            type: String,
            //  required: true
        },
        medName: {
            type: String,
            // required: true
        },
        i_cd: {
            type: String
        },
        medFormTypeCd: {
            type: String,
            //   required: true
        },
        medFormTypeName: {
            type: String,
            //  required: true
        },
        i_il1_cd: {
            type: String,
        },
        i_il2_cd: {
            type: String,
        },
        catCd: {
            type: String,
            //required: true
        },
        catName: {
            type: String,
            //  required: true
        },
        isOutside: {
            type: Boolean,
            default: false
        },
        genericCd: {
            type: String,
            //  required: true
        },
        genericName: {
            type: String,
            //  required: true
        },
        drugDose: {
            type: String,
            // required: true
        },
        i_il3_cd: {
            type: String,
        },
        unitCd: String,
        unitName: String,
        scheduleDrugCd: String,
        scheduleDrugName: String,
        defRouteCd: {
            type: String,
            // required: true
        },
        defRouteName: {
            type: String,
            // required: true
        },
        defFreqCd: {
            type: String,
            // required: true
        },
        defFreqName: {
            type: String,
            //  required: true
        },
        defInstruction: {
            type: String,
            // required: true
        },
        defDays: {
            type: String,
            //   required: true
        },
        drugSched: {
            type: Boolean,
            //  required: true
        },
        isNarcotic: {
            type: Boolean,
            //  required: true
        },
        isHazardous: {
            type: Boolean,
            //   required: true
        },
        isHighrisk: {
            type: Boolean,
            // required: true
        },
        isLooklike: {
            type: Boolean,
            // required: true
        },
        isSoundlike: {
            type: Boolean,
            // required: true
        },
        isCritical: {
            type: Boolean,
            // required: true
        },
        isConsumable: {
            type: Boolean,
            //  required: true
        },
        isDualAuthReq: {
            type: String,
            // required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        medItemTypeCd: {
            type: String,
            // required:true
        },
        medItemTypeName: {
            type: String,
            // required:true
        },
        medPackSize: {
            type: String,
            // required:true
        },
        medPackSizeUnitCd: {
            type: String,
            // required:true
        },
        medPackSizeUnitName: {
            type: String,
            // required:true
        },
        wholeNo: {
            type: Boolean,
            default: false
        },
        allowDoseVolume: {
            type: Boolean,
            default: false
        },
        doseVolume: {
            type: Number
        },
        doseVolumeUnitCd: {
            type: String
        },
        doseVolumeUnitName: {
            type: String
        },
        rateOfInfusion: {
            type: Number
        },
        rateOfInfusionUnitCd: {
            type: String
        },
        rateOfInfusionUnitName: {
            type: String
        },
        duration: {
            type: Number
        },
        durationUnitCd: {
            type: String
        },
        durationUnitName: {
            type: String
        },
        isVaccine: {
            type: Boolean,
            default: false
        },
        itemCategoryCd: {
            type: String
        },
        itemCategoryName: {
            type: String
        },
        itemCategory: {
            type: String
        },
        itemClassCd: {
            type: String
        },
        itemClassName: {
            type: String
        },
        itemClass: {
            type: String
        },
        lookLikeCombinations: [
            {
                any: mongoose.Schema.Types.Mixed
            }
        ],
        soundLikeCombinations: [
            {
                any: mongoose.Schema.Types.Mixed
            }
        ],
        multyRout: [
            {
                any: mongoose.Schema.Types.Mixed
            }
        ],
        cimsTypeCd: {
            type: String
        },
        cimsTypeName: {
            type: String
        },
        cimsCd: {
            type: String
        },
        stock: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    // required: true
                },
                quantity: {
                    type: String,
                    // required: true
                }
            }
        ],
        defInstructionCd: String,
        defInstructionName: String,
        prescribedUnitMulty: [
            {
                any: mongoose.Schema.Types.Mixed
            }
        ],
        prescribedUnitCd: String,
        prescribedUnitName: String,
        prescribedDose: String,
        tarrif: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    //   required: true
                },
                price: {
                    type: String,
                    // required: true
                },
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
], { strict: false });

/**Investigation data */
const _inv_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: String,
            //   required: true,
            immutable: true
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
        cd: {
            type: String,

            immutable: true
            // required: true
        },
        isParameter: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            //  required: true
        },
        i_cd: {
            type: String
        },
        i_typecd: {
            type: String
        },
        i_groupcd: {
            type: String
        },
        serviceTypeName: {
            type: String,
            //  required: true
        },
        serviceTypeCd: {
            type: String,
            //   required: true
        },
        serviceGroupCd: {
            type: String,
            //   required: true
        },
        serviceGroupName: {
            type: String,
            //   required: true
        },
        isOutside: {
            type: Boolean,
            default: false
        },
        specimen: {
            type: String,
            //  required: true
        },
        specimenCd: String,
        container: {
            type: String,
            //  required: true
        },
        containerCd: String,
        childAvailable: {
            type: Boolean,
            // required: true
        },
        instruction: {
            type: String,
            //   required: true
        },
        mandInstruct: {
            type: Boolean,
            //  required: true
        },
        isConsentForm: {
            type: Boolean,
            // required: true
        },
        isDiet: {
            type: Boolean,
            // required: true
        },
        isQtyEdit: {
            type: Boolean,
            //required: true
        },
        isAppointment: {
            type: Boolean,
            //  required: true
        },
        isSampleNeeded: {
            type: Boolean,
            //  required: true
        },
        image: {
            type: String,
            //  required: true
        },
        isApplicableFor: {
            type: String,
            //   required: true
        },
        isApplicableForCd: {
            type: String,
            //   required: true
        },
        unitCd: {
            type: String,
            //   required: true  
        },
        unitName: {
            type: String,
            //   required: true  
        },
        sessionId: {
            type: String,
            // required:true
        },
        parameters: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                paramId: {
                    type: String,
                    //   required: true  
                },
                paramCd: {
                    type: String,
                    //   required: true  
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                paramName: {
                    type: String,
                    //   required: true  
                },
                unit: {
                    type: String,
                    //   required: true  
                },
                ageGenderRanges: {
                    male: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            age: {
                                type: String,
                                //   required: true  
                            },
                            range: {
                                type: String,
                                //   required: true   
                            }
                        }
                    ],
                    female: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            age: {
                                type: String,
                                //   required: true  
                            },
                            range: {
                                type: String,
                                //   required: true   
                            }
                        }
                    ],
                    default: [
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            age: {
                                type: String,
                                //   required: true  
                            },
                            range: {
                                type: String,
                                //   required: true   
                            }
                        }
                    ],
                }

            }
        ],
        ageGenderRanges: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            male: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
            female: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
            default: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
        },
        tarrif: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    //   required: true
                },
                price: {
                    type: String,
                    // required: true
                },
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

const _speciality = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String,

                    immutable: true
                    // required: true
                },
                label: {
                    type: String, required: true,
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
    }
]);

const _labelNames = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String
                    // required: true
                },
                lblName: {
                    type: String,
                    required: true
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                placeholder: String,
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
    }
])


/**Specialization data */
const _specialization = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String,

                    immutable: true
                    // required: true
                },
                label: {
                    type: String,
                    // required: true
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
    }
])

/**Complaint data */
const _complaint = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
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
                desc: {
                    type: String,
                    // required: true
                },
                label: {
                    type: String,
                    // required: true
                },
                common_symptoms: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        name: String
                    }
                ],
                dispOrder: Number,
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
])

/**Complaint data */
const _notification_template = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String,
                    // required: true
                },
                desc: {
                    type: String,
                    // required: true
                },
                context: {
                    type: String,
                    // required: true
                },
                label: {
                    type: String,
                    // required: true
                },
                template: {
                    sms: {
                        body: {
                            type: String,
                            // required: true
                        },
                        tempId: {
                            type: Number,
                            // required: true
                        },

                    },
                    whatsapp: {
                        body: {
                            type: String,
                            // required: true
                        },
                        tempId: {
                            type: Number,
                            // required: true
                        },

                    },
                    email: {
                        body: {
                            type: String,
                            // required: true
                        },
                        tempId: {
                            type: Number,
                            // required: true
                        },

                    }
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
    }
])

/**Complaint data */
const _allergies = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd: {
                    type: String,
                    // required: true
                },
                desc: {
                    type: String,
                    // required: true
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    // required: true
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
])

/**Entity data */
const _entity = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        cd: {
            type: String,
            // required: true
        },
        label: {
            type: String,
            // required: true
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
        sessionId: {
            type: String,
            // required:true
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
                    // required: true
                },
                iconClass: {
                    type: String
                },
                routeUrl: String,
                revNo: {
                    type: Number,
                    required: true,
                    default: () => { return 1 }
                },
                label: {
                    type: String,
                    // required: true
                },
                value: String,
                indicator: String,
                lang: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        "label": {
                            type: String
                        },
                        "value": {
                            type: String
                        },

                    }
                ],
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
])

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
    orgId: {
        type: String
    },
    locName: {
        type: String,
        required: true
    },
    seqName: {
        type: String,
        required: true,

    },
    seqType: {
        type: String,
        //required: true,

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
    sessionId: {
        type: String,
        // required:true
    },
    format: {
        type: String
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
    }
});

const _patient = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        outStandingDue: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        "tokenNumber": String,
        "registDt": {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        "registExpireDt": String,
        "titleCd": String,
        "titleName": String,
        "payerTypeCd": String,
        "payerTypeName": String,
        "crpType": String,
        "crpName": String,
        "UMR": {
            type: String,
            required: true,
            immutable: true
        },
        staffReferId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee',
            required: false,
        },
        "abhaNo": String,
        "abhaAddress": String,
        // "abhaJson": [{
        //     any: mongoose.Schema.Types.Mixed
        // }],
        abhaAddressList: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            abhaAddress: String
        }],
        abhaCard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'media',
            required: false,
        },
        abhaJson: [{ type: mongoose.Schema.Types.ObjectId, ref: 'abha_json' }],
        "photo": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'media',
            required: false,
        },
        "profilePhoto": String,
        "patient_png_card": String,
        //"abhaCard": String,
        "fName": String,
        "mName": String,
        "lName": String,
        "dispName": String,
        "genderCd": String,
        "gender": String,
        "dob": String,
        "age": String,
        "ageVal": String,
        "ageEntry": Boolean,
        "bloodGroupCd": String,
        "bloodGroupName": String,
        "rhType": String,
        "reasonToDelete": String,
        "emailID": String,
        "userName": {
            type: String,
            immutable: true
        },
        "maritalStatusCd": String,
        "maritalStatus": String,
        "prefferedLanquage": String,
        "religion": String,
        "resPersonType": String,
        "resPersonName": String,
        "resppersonCd": String,
        "nationality": String,
        "nationalityCd": String,
        "religionCd": String,
        "religionName": String,
        "resPersonTypeCd": String,
        "motherMaidenName": String,
        "isVIP": {
            type: Boolean,
            default: () => { return false }
        },
        "isExpired": {
            type: Boolean,
            default: () => { return false }
        },
        "expiredDt": String,
        // "adharNo": String,
        // "passport": String,
        "patProof": {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "typeCd": String,
            "typeName": String,
            "patIdVal": String
        },
        "fromArea": String,
        //"photo": String,
        "signature": String,
        "proofUpload": String,
        "phone": {
            type: String
        },
        "mobile": {
            type: String
        },
        sessionId: {
            type: String,
            // required:true
        },
        "languages": [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                "name": String,
                "cd": String,
                "recStatus": {
                    type: Boolean,
                    default: true
                }
            }
        ],
        "identifications": {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "identity1": String,
            "identity2": String
        },
        "homeAddress": {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "typeCd": {
                type: String
            },
            "typeName": {
                type: String
            },
            "address1": String,
            "address2": String,
            "areaCd": String,
            "areaName": String,
            "cityCd": String,
            "cityName": String,
            "stateCd": String,
            "stateName": String,
            "countryCd": String,
            "countryName": String,
            "zipCd": String,
            "isActive": {
                type: Boolean,
                default: () => { return true }
            }
        },
        "commuAddress": {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "typeCd": {
                type: String
            },
            "typeName": {
                type: String
            },
            "address1": String,
            "address2": String,
            "areaCd": String,
            "areaName": String,
            "cityCd": String,
            "cityName": String,
            "stateCd": String,
            "stateName": String,
            "countryCd": String,
            "countryName": String,
            "zipCd": String,
            "isActive": {
                type: Boolean,
                default: () => { return true }
            }
        },
        "policy": [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                "companyPolicy": String,
                "policyNumber": String,
                "groupNumber": String,
                "individualNumber": String,
                "primaryPolicy": String,
                "primaryNumber": String,
                "isPrimary": String,
                "recStatus": {
                    type: Boolean,
                    default: true
                }
            }
        ],
        "visits": [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                "docId": {
                    type: mongoose.Schema.Types.ObjectId,
                    // required: true
                },
                "locId": {
                    type: String,
                    // required: true
                },
                "visitId": String,
                "visit": String,
                "visitNo": String,
                "dateTime": String,
                "docName": String,
                "status": String,
                "tranId": String,
                'documentId': String,
                "diabTranId": String,
                "diabStatus": {
                    type: Boolean,
                    default: true
                }
            }
        ],
        "visitTrans": [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "tranId": String,
            "visit": String,
            "visitNo": String,
            "dateTime": String,
            "docName": String,
            "diabTranId": String,
            "diabStatus": {
                type: Boolean,
                default: true
            }
        }],
        "bills": [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "billId": String,
            "billNo": String,
            "dateTime": String,
            "visit": String,
            "visitNo": String
        }],
        "loggedInDetls": {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            "lockStatus": String,
            "lockDt": String,
            "lockTm": String,
            "loclCnt": Number,
            "mobLstLogin": String,
            "mobDeviceNm": String,
            "webLstLogin": String
        },
        document: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                remarks: String,
                docId: {
                    type: String
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
                    // required: true
                },
                format: {
                    type: String,
                    required: true
                },
                isImage: Boolean,
                size: {
                    type: Number
                },
                path: String,
                docMimeType: String,
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

const _user_label_map = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        orgId: {
            type: Number,
            // required: true
        },
        locId: {
            type: String,
            //  required: true
        },
        formCd: {
            type: String,
            //  required: true
        },
        userId: {
            type: String,
            //  required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                lblCd: {
                    type: String,
                    // required: true
                },
                recStatus: {
                    type: Boolean,
                    // required: true
                },
                sequenceNo: {
                    type: Number,
                    // required: true
                },
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

/**labelMap Data */
const _label_map = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        orgId: {
            type: String,
            required: true,
            immutable: true
        },
        locId: {
            type: String
        },
        empId: {
            type: String
        },
        documentId: {
            type: String,
            required: true
        },
        documentCd: {
            type: String,
            //required: true
        },
        documentName: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        settingType: String,
        userId: String,
        roleId: String,
        empId: String,
        docId: String,
        settings: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            multiSave: {
                type: Boolean,
                default: false
            },
            isComplt: {
                type: Boolean,
                default: false
            },
            isSignOff: {
                type: Boolean,
                default: false
            },
            isSms: {
                type: Boolean,
                default: false
            },
            isCaps: {
                type: Boolean,
                default: false
            },
            isSignature: {
                type: Boolean,
                default: false
            },
            isPrimary: {
                type: Boolean,
                default: false
            },
            isApprove: {
                type: Boolean,
                default: false
            }
        },
        labels: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true
                },
                lblId: {
                    type: String,
                    required: true
                },
                lblCd: {
                    type: String,
                    required: true
                },
                lblName: {
                    type: String,
                    required: true
                },
                lblDispName: String,
                recStatus: {
                    type: Boolean,
                    default: true
                },
                notes: String,
                viewType: String,
                isMand: {
                    type: Boolean,
                    default: false
                },
                sequenceNo: {
                    type: Number,
                    // required: true
                },
                isHistory: {
                    type: Boolean,
                    default: false
                },
                isTemplate: {
                    type: Boolean,
                    default: false
                },
                isDefault: {
                    type: Boolean,
                    default: false
                },
                placeholder: String,
                //lblDispNameForm: String,
                //formPlace: String,
                isShown: Boolean,
                //lblDispNamePrint: String,
                //printPlace: String,
                //isShownPrint: Boolean,
                clinicalOptions: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true
                    },
                    inv: {
                        type: Boolean,
                        default: false
                    },
                    med: {
                        type: Boolean,
                        default: false
                    },
                    results: {
                        type: Boolean,
                        default: false
                    },
                    doctors: {
                        type: Boolean,
                        default: false
                    },
                    crosConslt: {
                        type: Boolean,
                        default: false
                    },
                    vitals: {
                        type: Boolean,
                        default: false
                    },
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

/**Billing Data */
const _bills_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        billNo: {
            type: String,
            required: true,

            immutable: true
        },
        billDate: {
            type: String,
            immutable: true,
            default: () => { return new Date().toISOString() },
        },
        age: {
            type: String
        },
        gender: {
            type: String
        },
        mobile: {
            type: String
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        patientName: {
            type: String,
            immutable: true
        },
        patientAmt: {
            type: Number,
            //immutable: true
        },
        invoiceNo: {
            type: String,
            immutable: true
        },
        patId: {
            type: String
        },
        referalCd: String,
        referalName: String,
        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },
        billAmount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },
        concessionAmt: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },
        dueAmount: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        outStandingDue: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        changeAmount: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        discount: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        discountPer: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        cgst: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        sgst: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        gst: {
            type: mongoose.Schema.Types.Decimal128,
            default: () => { return 0.00 }
        },
        visit: {
            type: String
        },
        paymentDone: {
            type: Boolean,
            default: false
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
        paymentMode: {
            type: String,
            default: ""
            //required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        transactions: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true
                },
                code: {
                    type: String,
                    default: () => { return shortId.generate() },
                    immutable: true
                },
                billType: String,
                paymentMode: {
                    type: String,
                    required: true
                },
                remainAmount: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true
                },
                amount: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true
                },
                transactionNumber: String,
                refNumber: String,
                remark: String,
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
        ],
        services: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    required: true
                },
                serviceCd: {
                    type: String,
                    //required: true
                },
                serviceName: {
                    type: String,
                    //required: true
                },
                serviceType: {
                    type: String,
                    //required: true
                },
                qty: {
                    type: Number,
                    //required: true
                },
                price: {
                    type: mongoose.Schema.Types.Decimal128,
                    //required: true
                },
                totPrice: {
                    type: mongoose.Schema.Types.Decimal128,
                    //required: true
                },
                amount: {
                    type: mongoose.Schema.Types.Decimal128,
                    required: true
                },
                discount: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: () => { return 0.00 }
                },
                discountPer: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: () => { return 0.00 }
                },
                cgst: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: () => { return 0.00 }
                },
                sgst: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: () => { return 0.00 }
                },
                gst: {
                    type: mongoose.Schema.Types.Decimal128,
                    default: () => { return 0.00 }
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

/**ICD Masters */
const _icd_masters = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        code: String,
        name: String,
        type: {
            type: String
        },
        sessionId: {
            type: String,
            // required:true
        },
        recStatus: {
            type: Boolean,
            default: true
        }
    }
]);

/*Appointment Booking */
const _appointments = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: String,
            required: true
        },
        dateTime: {
            type: String,
            default: () => { return new Date().toISOString() }
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
        code: String,
        consultationNo: String,
        documentId: {
            type: String,
        },
        reasonForSlotCancelCD: {
            type: String,
        },
        reasonForSlotCancelName: {
            type: String,
        },
        docDetails: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            docId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            i_docCd: {
                type: String,
            },
            cd: String,
            name: String,
            regNo: String,
            degree: String,
            designation: String,
            specName: String,
            imgSign: String,
            titleName: String
        },
        UMR: {
            type: String
        },
        admnNo: {
            type: String
        },
        admnDt: String,
        tranId: {
            type: String
        },
        titleCd: String,
        titleName: String,
        visit: {
            type: String
        },
        appointmentId: {
            type: Number,
            //required: true
        },
        patId: {
            type: mongoose.Schema.Types.ObjectId
        },
        patName: {
            type: String
        },
        age: String,
        gender: String,
        email: String,
        isVIP: {
            type: Boolean,
            default: false
        },
        mobile: String,
        address: String,
        reasonForVisit: String,
        remarks: String,
        source: String,
        apmntType: String,
        apmntDtTime: {
            type: String
        },
        amount: {
            type: mongoose.Schema.Types.Decimal128
        },
        isPayment: {
            type: Boolean,
            default: false
        },
        paymentMode: String,
        paymentRefId: String,
        checkStatus: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            status: String,
            checkInDt: String,
            checkOutDt: String,
        },
        queueNo: String,
        queueDt: String,
        tokenNo: String,
        isDraft: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "NEW"
        },
        refBy: String,
        sessionId: {
            type: String,
            // required:true
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

const subSchema = mongoose.Schema({

});

const mySchemaObj = new mongoose.Schema([{ any: mongoose.Schema.Types.Mixed }], { strict: false });
const _clinical_transaction = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: mongoose.Schema.Types.ObjectId
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },

        admnNo: {
            type: String
        },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        appointmentId: {
            type: Number,
            //required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String,
                // required: true
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String,
                // required: true
            }
        },
        docDetails: {
            docId: {
                type: mongoose.Schema.Types.ObjectId
            },
            cd: {
                type: String,
            },
            i_docCd: {
                type: String,
            },
            regNo: {
                type: String
            },
            name: {
                type: String
            },
            degree: {
                type: String
            },
            designation: {
                type: String
            },
            specName: {
                type: String
            },
            imgSign: {
                type: String
            },
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        documentNo: {
            type: String
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        documentCd: {
            type: String,
            //required: true
        },
        documentName: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        status: {
            type: String,
            default: () => { return "REQUESTED" },
        },
        data: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    required: true
                },
                child: [{
                    any: mongoose.Schema.Types.Mixed
                }]
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
            },
            completedById: String,
            completedBy: String,
            completedDt: String,
            approvedById: String,
            approvedBy: String,
            approvedDt: String,
            reworkById: String,
            reworkBy: String,
            reworkDt: String,
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
], { strict: false });

/** Vitals Transaction */
const _vitals_tran = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        locId: {
            type: mongoose.Schema.Types.ObjectId
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String
            }
        },
        docDetails: {
            docId: {
                type: mongoose.Schema.Types.ObjectId
            },
            cd: {
                type: String,
            },
            regNo: {
                type: String
            },
            name: {
                type: String
            },
            degree: {
                type: String
            },
            designation: {
                type: String
            },
            specName: {
                type: String
            },
            imgSign: {
                type: String
            },
        },
        captureDtTm: {
            type: String,
            required: true
        },
        bloodGrp: {
            type: String
        },
        weight: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        height: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        bmi: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        bsa: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        bpSit: {
            unit: {
                type: String
            },
            systolic: {
                type: Number
            },
            diastolic: {
                type: Number
            },
            type: {
                type: String
            },
            range: {
                type: String
            }
        },
        bpSup: {
            unit: {
                type: String
            },
            systolic: {
                type: Number
            },
            diastolic: {
                type: Number
            },
            type: {
                type: String
            },
            range: {
                type: String
            }
        },
        bpStnd: {
            unit: {
                type: String
            },
            systolic: {
                type: Number
            },
            diastolic: {
                type: Number
            },
            type: {
                type: String
            },
            range: {
                type: String
            }
        },
        pulse: {
            value: {
                type: Number
            },
            type: {
                type: String
            },
            range: {
                type: String
            },
            class: {
                type: String
            }
        },
        heartRate: {
            value: {
                type: Number
            },
            rateTyp: {
                type: String
            },
            unit: {
                type: String
            }
        },
        respRate: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        temp: {
            value: {
                type: Number
            },
            tempTyp: {
                type: String
            },
            unit: {
                type: String
            }
        },
        spo2: {
            value: {
                type: Number
            },
            o2Unit: {
                type: String
            },
            unit: {
                type: String
            }
        },
        waistCirc: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        chestInsp: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        chestExp: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        headCirc: {
            value: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        headLength: {
            type: Number,
            //  required: true  
        },
        grbs: {
            type: Number,
            //  required: true  
        },
        painScore: {
            type: Number,
            //  required: true  
        },
        urineAnalysis: {
            type: Number,
            //  required: true  
        },
        sessionId: {
            type: String,
            // required:true
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

/**Investigations tran */
const _investigations_tran = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        sNo: {
            type: Number
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
        cd: {
            type: String,
        },
        name: {
            type: String,
        },
        locId: {
            type: mongoose.Schema.Types.ObjectId
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String
            }
        },
        docDetails: {
            docId: {
                type: mongoose.Schema.Types.ObjectId
            },
            cd: {
                type: String,
            },
            regNo: {
                type: String
            },
            name: {
                type: String
            },
            degree: {
                type: String
            },
            designation: {
                type: String
            },
            specName: {
                type: String
            },
            imgSign: {
                type: String
            },
        },
        tarrif: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    //   required: true
                },
                price: {
                    type: String,
                    // required: true
                },
            }
        ],
        dtTime: {
            type: String
        },
        serviceCd: {
            type: String
        },
        serviceName: {
            type: String,
            //  required: true
        },
        serviceTypeName: {
            type: String
        },
        serviceTypeCd: {
            type: String
        },
        serviceGroupCd: {
            type: String
        },
        serviceType: {
            type: String
        },
        isOutside: {
            type: Boolean,
            default: true
        },
        insideItem: {
            type: Boolean,
            default: true
        },
        qty: {
            type: Number,
            // required: true
        },
        isfavoritAdd: {
            type: Boolean,
            default: true
        },
        serviceDt: {
            type: String
        },
        instruction: {
            type: String
        },
        stat: {
            type: Boolean,
            default: true
        },
        nextOrdDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        lastOrderDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        orderType: {
            type: String
        },
        status: {
            type: String
        },
        parentServiceCd: {
            type: Number,
            // required: true
        },
        isPackageType: {
            type: String
        },
        cancelFrom: {
            type: String
        },
        billNo: {
            type: String
        },
        isBilled: {
            type: Boolean,
            default: true
        },
        billDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        parameters: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                paramId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                paramCd: {
                    type: String,
                    // required: true,   
                },
                paramName: {
                    type: String,
                    // required: true,   
                },
                ageRange: {
                    type: String,
                    // required: true,   
                },
                status: {
                    type: String,
                    // required: true,  
                },
                statusCd: {
                    type: String,
                    // required: true,  
                },
                class: {
                    type: String,
                    // required: true,  
                },
                lowVal: {
                    type: String,
                    // required: true,   
                },
                highVal: {
                    type: String,
                    // required: true,   
                },
                value: {
                    type: String,
                    // required: true,   
                },
                unit: {
                    type: String,
                    // required: true,   
                },
            }
        ],
        ageGenderRanges: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            male: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
            female: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
            default: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    age: {
                        type: String,
                        //   required: true  
                    },
                    range: {
                        type: String,
                        //   required: true   
                    }
                }
            ],
        },
        statusAudit: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                status: {
                    type: String
                },
                remarks: {
                    type: String
                },
                documentedId: {
                    type: String
                },
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                documentedBy: {
                    type: String
                }
            }
        ],
        translateLanguage: {
            instruction: {
                type: String
            }
        },
        sessionId: {
            type: String,
            // required:true
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

/* Medications*/
const _medications_tran = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        sNo: {
            type: Number
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
        locId: {
            type: mongoose.Schema.Types.ObjectId
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String
            }
        },
        docDetails: {
            docId: {
                type: mongoose.Schema.Types.ObjectId
            },
            cd: {
                type: String,
            },
            regNo: {
                type: String
            },
            name: {
                type: String
            },
            degree: {
                type: String
            },
            designation: {
                type: String
            },
            specName: {
                type: String
            },
            imgSign: {
                type: String
            },
        },
        statusAudit: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                status: {
                    type: String
                },
                remarks: {
                    type: String
                },
                documentedId: {
                    type: String
                },
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                documentedBy: {
                    type: String
                }
            }
        ],
        genericName: {
            type: String
        },
        genericCd: {
            type: String
        },
        medCd: {
            type: String
        },
        medName: {
            type: String
        },
        medFormTypeCd: {
            type: String
        },
        medFormTypeName: {
            type: String
        },
        manufacture: {
            type: String
        },
        isOutside: {
            type: Boolean,
            default: true
        },
        insideItem: {
            type: Boolean,
            default: true
        },
        isfavoritAdd: {
            type: Boolean,
            default: false
        },
        drugDose: {
            type: String
        },
        dosageCd: {
            type: Number
        },
        dosageUnit: {
            type: String
        },
        drugSchedule: {
            type: String
        },
        admnstrTyp: {
            type: String
        },
        admnstrCd: {
            type: String
        },
        freqCd: {
            type: String
        },
        freqDesc: {
            type: String
        },
        freqQty: {
            type: String
        },
        cd: {
            type: String,
        },
        duration: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        timings: {
            type: String
        },
        days: {
            type: Number
        },
        qty: {
            type: Number
        },
        indication: {
            type: String
        },
        instruction: {
            type: String
        },
        prescDocCd: {
            type: String
        },
        prescDocName: {
            type: String
        },
        isDschrgMed: {
            type: Boolean,
            default: true
        },
        lastOrderDt: {
            type: String
        },
        nebulization: {
            type: String
        },
        stockPointCd: {
            type: String
        },
        routeCd: {
            type: String
        },
        routeName: {
            type: String
        },
        parentMedCd: {
            type: String
        },
        childParentMedCd: {
            type: String
        },
        startDt: {
            type: String
        },
        endDt: {
            type: String
        },
        indentRequired: {
            type: Boolean,
            default: true
        },
        antibioticCd: {
            type: Number
        },
        isConsumable: {
            type: Boolean,
            default: false
        },
        isAuthReq: {
            type: Boolean,
            default: false
        },
        billNo: {
            type: String
        },
        isBilled: {
            type: Boolean,
            default: false
        },
        billDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        tarrif: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                type: {
                    type: String,
                    //   required: true
                },
                price: {
                    type: String,
                    // required: true
                },
            }
        ],
        authAudit: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                documentedId: {
                    type: String
                },
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                documentedBy: {
                    type: String
                }
            }
        ],
        categoryCd: {
            type: Number
        },
        translateLanguage: {
            freqDesc: {
                type: String
            },
            indication: {
                type: String
            },
            instructions: {
                type: String
            }
        },
        sessionId: {
            type: String,
            // required:true
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


/*lab-results */
const _lab_results = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: String,
            // required: true,
            immutable: true
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
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
        visit: {
            type: String,
            required: true,
        },
        visitNo: {
            type: String,
            required: true,
        },
        visitId: {
            type: String,
            required: true
        },
        dateTime: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        sessionId: {
            type: String,
            // required:true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            patId: {
                type: mongoose.Schema.Types.ObjectId
            },
            name: {
                type: String,
                //  required: true,
            },
            age: {
                type: String,
                //  required: true,
            },
            gender: {
                type: String,
                //  required: true,
            },
            location: {
                type: String,
                //  required: true,
            },

        },
        docDetails: {
            docId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            cd: {
                type: String,
                // required: true, 
            },
            regNo: {
                type: String,
                // required: true, 
            },
            name: {
                type: String,
                // required: true, 
            },
            degree: {
                type: String,
                // required: true, 
            },
            designation: {
                type: String,
                // required: true, 
            },
            specName: {
                type: String,
                // required: true, 
            },
            imgSign: {
                type: String,
                // required: true, 
            },
        },
        data: [
            {
                invsId: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                invsCd: {
                    type: String,
                    // required: true,  
                },
                invsName: {
                    type: String,
                    // required: true,  
                },
                ageRange: {
                    type: String,
                    // required: true,  
                },
                status: {
                    type: String,
                    // required: true,  
                },
                statusCd: {
                    type: String,
                    // required: true,  
                },
                class: {
                    type: String,
                    // required: true,  
                },

                lowVal: {
                    type: String,
                    // required: true,  
                },
                highVal: {
                    type: String,
                    // required: true,  
                },
                value: {
                    type: String,
                    // required: true,  
                },
                unit: {
                    type: String,
                    // required: true,  
                },
                isChildAvailable: {
                    type: Boolean,
                    default: true
                },
                parameters: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        paramId: {
                            type: mongoose.Schema.Types.ObjectId,
                        },
                        paramCd: {
                            type: String,
                            // required: true,   
                        },
                        paramName: {
                            type: String,
                            // required: true,   
                        },
                        ageRange: {
                            type: String,
                            // required: true,   
                        },
                        status: {
                            type: String,
                            // required: true,  
                        },
                        statusCd: {
                            type: String,
                            // required: true,  
                        },
                        class: {
                            type: String,
                            // required: true,  
                        },
                        lowVal: {
                            type: String,
                            // required: true,   
                        },
                        highVal: {
                            type: String,
                            // required: true,   
                        },
                        value: {
                            type: String,
                            // required: true,   
                        },
                        unit: {
                            type: String,
                            // required: true,   
                        },
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
])

/*order-set */
const _order_sets = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        locId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        specId: {
            type: String
        },
        specName: {
            type: String
        },
        context: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            // required:true
        },
        child: [{
            any: mongoose.Schema.Types.Mixed
        }],
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
            modifiedByBy: String,
            modifiedByDt: {
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
], { strict: false });

const _lbl_template = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        locId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        docId: String,
        docName: String,
        specId: {
            type: String
        },
        specName: {
            type: String
        },
        tempName: {
            type: String,
            required: true
        },
        labelId: {
            type: String,
            required: true
        },
        labelCd: {
            type: String,
            required: true
        },
        labelName: {
            type: String,
            required: true
        },
        data: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            // required:true
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

/*investigation fav */
const _investigations_fav = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        locId: {
            type: String,
            required: true,
            immutable: true
        },
        userId: {
            type: String
        },
        specId: {
            type: String
        },
        i_cd: {
            type: String
        },
        i_typecd: {
            type: String
        },
        i_groupcd: {
            type: String
        },
        itemId: {
            type: String
        },
        itemCd: {
            type: String
        },
        itemName: {
            type: String,
            required: true,
        },
        qty: {
            type: Number
        },
        // instruction: {
        //     "_id": {
        //         type: mongoose.Schema.Types.ObjectId,
        //         required: true,
        //         auto: true,
        //     },
        //     label: String,
        //     cd: String
        // },
        instructionCd: String,
        instruction: String,
        isOutside: {
            type: Boolean,
            default: false
        },
        serviceGroupCd: {
            type: String
        },
        serviceGroupName: {
            type: String
        },
        serviceTypeCd: {
            type: String
        },
        serviceTypeName: {
            type: String
        },
        sessionId: {
            type: String,
            // required:true
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
])

/*medication fav */
const _medications_fav = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: String,
            required: true,
            immutable: true
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
        userId: {
            type: String
        },
        specId: {
            type: String
        },
        itemId: {
            type: String,
        },
        itemCd: {
            type: String
        },
        i_cd: {
            type: String
        },
        medFormTypeCd: {
            type: String
        },
        medFormTypeName: String,
        itemName: {
            type: String,
            required: true,
        },
        i_il1_cd: {
            type: String,
        },
        i_il2_cd: {
            type: String,
        },
        i_il3_cd: {
            type: String,
        },
        genericCd: {
            type: String
        },
        genericName: {
            type: String
        },
        freqCd: {
            type: String
        },
        freqDesc: {
            type: String
        },
        freqQty: {
            type: Number
        },
        days: {
            type: Number
        },
        qty: {
            type: Number
        },
        instruction: {
            type: String
        },
        instructionCd: {
            type: String
        },
        indication: {
            type: String
        },
        isOutside: {
            type: Boolean,
            default: false
        },
        routeName: {
            type: String
        },
        routeCd: {
            type: String
        },
        admnstrCd: {
            type: String
        },
        admnstrTyp: {
            type: String
        },
        sessionId: {
            type: String,
            // required:true
        },
        unitCd: {
            type: String
        },
        unitName: {
            type: String
        },
        drugDose: String,
        doseVolume: String,
        medPackSize: String,
        //duration: String,
        startDate: String,
        stopDate: String,
        indication: String,
        displayFrequency: String,
        duration: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            cd: String,
            label: String,
            value: String,
            English: String,
            Telugu: String,
            Hindi: String,
            Tamil: String,
            Malayalam: String,
            show: Boolean
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
])
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
        sessionId: {
            type: String,
            // required:true
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
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        locId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: String,
        displayName: String,
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
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

const errorLogging = new mongoose.Schema([
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        insertTime: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        method: String,
        payload: mongoose.Schema.Types.Mixed,
        error: String,
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
])

const _documents = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        remarks: String,
        type: String,
        UMR: String,
        orgId: {
            type: String,
            required: true
        },
        locId: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        docData: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
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
                    // required: true
                },
                format: {
                    type: String,
                    required: true
                },
                docInfo: {
                    type: Buffer
                },
                isImage: Boolean,
                size: {
                    type: Number
                },
                path: String,
                // surgId: String,
                // surgName: String,
                // surgDt: String,
                // followupId: String,
                // followupNo: String,
                // followupOn: String,
                // followupDate: String,
                docMimeType: String
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


const _notifications = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        notificationType: {
            type: String
        },
        notificationContent: {
            type: String
        },
        toWhom: {
            type: String
        },
        deliveryType: {
            type: String
        },
        timeStamp: {
            type: String
        },
        notificationCount: {
            type: String
        },
        purpose: {
            type: String
        }
    }
])

const _diabetics_tran = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        locId: {
            type: mongoose.Schema.Types.ObjectId
        },
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        admnNo: {
            type: String
        },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String
            }
        },
        docDetails: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            docId: {
                type: mongoose.Schema.Types.ObjectId
            },
            cd: {
                type: String,
            },
            regNo: {
                type: String
            },
            name: {
                type: String
            },
            degree: {
                type: String
            },
            designation: {
                type: String
            },
            specName: {
                type: String
            },
            imgSign: {
                type: String
            },
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        documentNo: {
            type: String
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        documentCd: {
            type: String,
            //required: true
        },
        documentName: {
            type: String,
            required: true
        },
        sessionId: {
            type: String
        },
        status: {
            type: String,
            default: () => { return "REQUESTED" },
        },
        any: mongoose.Schema.Types.Mixed,

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
            },
            completedById: String,
            completedBy: String,
            completedDt: String,
            approvedById: String,
            approvedBy: String,
            approvedDt: String,
            reworkById: String,
            reworkBy: String,
            reworkDt: String,
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
    { strict: false });




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
        recStatus: {
            type: Boolean,
            default: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        audit: {
            documentedById: String,
            documentedBy: {
                type: String,
                default: 'All in one Satish'
            },
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
    }
], { strict: false });

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
// 		district: String,
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

const _pharmacy_med_masters = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    BRAND_PRODUCT_MAP_CD: {
        type: String,
        required: true
    },

    fileUploads: [
        {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            fileName: {
                type: String
            },
            format: {
                type: String
            },
            imageData: {
                type: String
            },
            recStatus: {
                type: Boolean,
                default: true
            }
        }
    ],
    recStatus:
    {
        type: Boolean,
        default: true
    },
    PARENT_BRAND_CD: {
        type: String
    },
    PARENT_BRAND: {
        type: String
    },
    BRAND_CD: {
        type: String
    },
    BRAND_NAME: {
        type: String
    },
    BRAND_EXTENSION_CD: {
        type: String
    },
    BRAND_EXTENSION_NAME: {
        type: String
    },
    THERAPY_CD: {
        type: String
    },
    THERAPY_NAME: {
        type: String
    },
    FLAVOUR_CD: {
        type: String
    },
    FLAVOUR_NAME: {
        type: String
    },
    STRENGTH_CD: {
        type: String
    },
    STRENGTH_NAME: {
        type: String
    },
    COUNTRY_NAME: {
        type: String
    },
    VOLUME_CD: {
        type: String
    },
    VOLUME_NAME: {
        type: String
    },
    PACKAGE_INFO_CD: {
        type: String
    },
    PACKAGE_INFO: {
        type: String
    },
    METRL_TYPE_CD: {
        type: String
    },
    METRL_TYPE_NAME: {
        type: String
    },
    DOSE_FORM_CD: {
        type: String
    },
    DOSE_FORM_NAME: {
        type: String
    },
    USE_CD: {
        type: String
    },
    USE_NAME: {
        type: String
    },
    STRG_CNDTN_CD: {
        type: String
    },
    STRG_CNDTN_NAME: {
        type: String
    },
    AGE_GEN_CD: {
        type: String
    },
    AGE_GEN_NAME: {
        type: String
    },
    COMPANY_CD: {
        type: String
    },
    COMPANY_NAME: {
        type: String
    },
    CDCI_CODE: {
        type: String
    },
    CDCI_NAME: {
        type: String
    },
    BRAND_STRING1_CD: {
        type: String
    },
    BRAND_STRING1: {
        type: String
    },
    BRAND_STRING1_XML: {
        type: String
    },
    BRAND_STRING2_CD: {
        type: String
    },
    BRAND_STRING2: {
        type: String
    },
    BRAND_STRING2_XML: {
        type: String
    },
    BRAND_STRING3_CD: {
        type: String
    },
    BRAND_STRING3: {
        type: String
    },
    BRAND_STRING3_XML: {
        type: String
    },
    IS_SUGAR_FREE: {
        type: String
    },
    STRING_3: {
        type: String
    },
    STRING_3_CD: {
        type: String
    },
    BRAND_CUSTOM: {
        type: String
    },
    BRAND_CUSTOM_CD: {
        type: String
    },
    BRAND_CUSTOM_XML: {
        type: String
    },
    BRAND_FINAL_CD: {
        type: String
    },
    BRAND_FINAL: {
        type: String
    },
    BRAND_FINAL_XML: {
        type: String
    },
    BRAND_DRUG_FINAL_CD: {
        type: String
    },
    BRAND_DRUG_FINAL: {
        type: String
    },
    BRAND_DRUG_XML: {
        type: String
    },
    IS_FORCEBLE_BRAND: {
        type: String
    },
    SOURCE_DATA: {
        type: String
    },
    BRAND_DISPLAY_NAME: {
        type: String
    },
    BRAND_DISPLAY_CD: {
        type: String
    },
    BRAND_MASTER_ID: {
        type: String
    },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
    },
    REMARKS: {
        type: String
    },

    SESSION_ID: {
        TYPE: String
    },
    CDCI_IDENTIFIER: {
        type: String
    },
    CDCI_SUPPLIER_IDENTIFIER: {
        type: String
    },
    CDCI_GENERIC_IDENTIFIER: {
        type: String
    },
    CDCI_PRODUCT_IDENTIFIER: {
        type: String
    },
    audit: {
        "_id": {
            type:
                mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,

        },
        documentedById: String,
        documentedBy: String,
        documentedDt: {
            type: String,
            default: () => {
                return new Date().toISOString()
            },
        },
        modifiedById: String,
        modifiedBy: String,
        modifiedDt: {
            Types: String
        }

    },
    history: [{
        "_id": {
            type:
                mongoose.Schema.Types.ObjectId,
            required: true,

        },
        revTranId: {
            type: String,
            //required:true
        },
        revNo: {
            type: Number,
            //required:true
        },
    }
    ]
})

const _grn_entry = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    grnNumber: {
        type: String,
        unique: true
    },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
    },
    dateOfReceipt: {
        type: String,
        required: true,
        default: () => new Date().toISOString(),
    },
    purchaseOrderNumber: {
        type: String
    },
    supplierName: {
        type: String
    },
    supplierId: {
        type: String
    },
    productId: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    dosageForm: {
        type: String,
        required: true
    },
    unitOfMeasure: {
        type: String
    },
    quantityReceived: {
        type: Number,
        required: true,
        //min:1
        validate: {
            validator: function (value) {
                return value >= 1;
            },
            message: 'Quantity received must be at least 1'
        }
    },
    batchNumber: {
        type: String,
        required: true
    },
    lotNumber: {
        type: String
    },
    manufactureDate: {
        type: String
    },
    expirationDate: {
        type: String,
        required: true
    },
    quantityPerBatch: {
        type: Number,
        //min: 1
        validate: {
            validator: function (value) {
                return value >= 1;
            },
            message: 'Quantity received must be at least 1'
        }
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
            default: () => {
                return new Date().toISOString()
            },
        },
        modifiedById: String,
        modifiedBy: String,
        modifiedDt: {
            Types: String
        }
    },
    history: [{
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        revTranId: {
            type: String
        },
        revNo: {
            type: Number
        },
    }]
})

const _emrToHisSync = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    orgId: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
    },
    locId: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
    },
    migId: {
        type: Number,
        required: true
    },
    eventId: {
        type: Number,
        required: true
    },
    eventName: {
        type: String
    },
    eventTrackId: {
        type: Number,
        required: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    eventDataJson: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    syncStatus: {
        type: Boolean,
        default: false
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
            default: () => {
                return new Date().toISOString()
            },
        },
        modifiedById: String,
        modifiedBy: String,
        modifiedDt: {
            Types: String
        }
    },
    history: [{
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        revTranId: {
            type: String
        },
        revNo: {
            type: Number
        },
    }]
})

const _specialities = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        specialties: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                speciality: String,
                cd: String,
                specilizations: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        label: String,
                        cd: String
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
const _hims_lab_results = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        UMR: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        visitNo: {
            type: String,
            // required: true,
        },
        visitId: {
            type: String,
            // required: true
        },
        patDet: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            patId: {
                type: mongoose.Schema.Types.ObjectId
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: String
            },
            gender: {
                type: String,
                required: true
            },
            location: {
                type: String
            }
        },
        fromDt: {
            type: String,
            // required: true
        },
        toDt: {
            type: String,
            // required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        audit: {
            documentedById: String,
            documentedBy: {
                type: String,
                default: 'All in one Satish'
            },
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
], { strict: false });


const _drafts = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: String,
        locId: String,
        userId: {
            type: String,
            required: true
        },
        formId: {
            type: String,
            required: true
        },
        UMR: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        formName: String,
        formData: [
            {
                type: mongoose.Schema.Types.Mixed
            }
        ],
        status: String,
        lastSavedAt: {
            type: Date,
            default: () => { return new Date().toISOString() },
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


const _notifications_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: String,
        orgKey: String,
        recStatus: {
            type: Boolean,
            default: true
        },
        locId: String,
        notifCd: String,
        receiver: String,
        UMR: String,
        docId: String,
        isSMS: Boolean,
        isEmail: Boolean,
        isWhatsApp: Boolean,
        isPushNotification: Boolean,
        templateName: String,
        smsTemplate:String,
        toSMSMobile: String,
        smsStatus: String,
        smsError: String,
        emailTemplate:String,
        emailSubject: String,
        toEmail:String,
        emailStatus: String,
        emailError: String,
        whatsAppTemplate:String,
        toWhatsAppMobile:String,
        waStatus: String,
        waError: String,
        pushNotificationTemplate:String,
        pushNotificationSubject: String,
        toFCMToken:String,
        pushNotificationStatus: String,
        pushNotificationError: String,
        apptCd: String,
        dateTime: String,

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
])

const _abha_json = new mongoose.Schema([{ any: mongoose.Schema.Types.Mixed }], { strict: false });

const _media = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
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
    abhaNo: {
        type: String
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    referenceType: {
        type: String,
        required: true
    },
    orglogo: {
        type: Buffer,
        required: false,
    },
    favIcon: {
        type: Buffer,
        required: false,
    },
    photo: {
        type: Buffer,
        required: false,
    },
    signature: {
        type: Buffer,
        required: false,
    },
    abhaCard: {
        type: Buffer,
        required: false,
    },
    dispatchIdentity:{
        type: Buffer,
        required: false,
    },
    dispatchIdentityMimeType: String,
    orglogoMimeType: String,
    favIconMimeType: String,
    photoMimeType: String,
    signatureMimeType: String,
    abhaCardMimeType: String,
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
});



/* Conversion from String to Float */
_bills_data.set('toJSON', {
    transform: (doc, ret) => {
        ret.billAmount = parseFloat(ret.billAmount);
        ret.concessionAmt = parseFloat(ret.concessionAmt);
        ret.amount = parseFloat(ret.amount);
        ret.dueAmount = parseFloat(ret.dueAmount);
        ret.outStandingDue = parseFloat(ret.outStandingDue);
        ret.changeAmount = parseFloat(ret.changeAmount);
        ret.discount = parseFloat(ret.discount);
        ret.discountPer = parseFloat(ret.discountPer);
        ret.cgst = parseFloat(ret.cgst);
        ret.sgst = parseFloat(ret.sgst);
        ret.gst = parseFloat(ret.gst);

        for (let i in ret.transactions) {
            ret.transactions[i].amount = parseFloat(ret.transactions[i].amount);
            ret.transactions[i].remainAmount = parseFloat(ret.transactions[i].remainAmount);
        }
        for (let indx in ret.services) {
            ret.services[indx].amount = parseFloat(ret.services[indx].amount);
            ret.services[indx].price = parseFloat(ret.services[indx].price);
            ret.services[indx].totPrice = parseFloat(ret.services[indx].totPrice);
            ret.services[indx].discount = parseFloat(ret.services[indx].discount);
            ret.services[indx].discountPer = parseFloat(ret.services[indx].discountPer);
            ret.services[indx].cgst = parseFloat(ret.services[indx].cgst);
            ret.services[indx].sgst = parseFloat(ret.services[indx].sgst);
            ret.services[indx].gst = parseFloat(ret.services[indx].gst);
        }
        return ret;
    },
});

_appointments.set('toJSON', {
    transform: (doc, ret) => {
        ret.amount = parseFloat(ret.amount);
        return ret;
    },
});

_patient.set('toJSON', {
    transform: (doc, ret) => {
        ret.outStandingDue = parseFloat(ret.outStandingDue);
        return ret;
    },
});


module.exports = [
    { "coll": 'organization', "schema": _org, "db": "cm" },
    { "coll": 'histories', "schema": _history, "db": "cm" },
    { "coll": 'roles', "schema": _role_master, "db": "cm" },
    { "coll": 'employee', "schema": _employee_data, "db": "cm" },
    { "coll": 'doctors', "schema": _doctors, "db": "cm" },
    { "coll": 'documents', "schema": _document_data, "db": "cm" },
    { "coll": 'medications', "schema": _med_data, "db": "cm" },
    { "coll": 'investigations', "schema": _inv_data, "db": "cm" },
    { "coll": 'speciality', "schema": _speciality, "db": "cm" },
    { "coll": 'labels', "schema": _labelNames, "db": "cm" },
    { "coll": 'labelsmaps', "schema": _label_map, "db": "cm" },
    { "coll": 'specialization', "schema": _specialization, "db": "cm" },
    { "coll": 'complaints', "schema": _complaint, "db": "cm" },
    //{ "coll": 'notifications', "schema": _notification_template, "db": "cm" },
    { "coll": 'allergies', "schema": _allergies, "db": "cm" },
    { "coll": 'entity', "schema": _entity, "db": "cm" },
    { "coll": 'patients', "schema": _patient, "db": "cm" },
    { "coll": 'counters', "schema": _counter, "db": "cm" },
    { "coll": 'users', "schema": _users, "db": "cm" },
    //{ "coll": 'admincreatepatients', "schema": _Admin_Create_patient_Data, "db": "cm" },
    { "coll": 'bills', "schema": _bills_data, "db": "cm" },
    { "coll": 'icd_masters', "schema": _icd_masters, "db": "cm" },
    { "coll": 'appointments', "schema": _appointments, "db": "cm" },
    { "coll": 'transactions', "schema": _clinical_transaction, "db": "cm" },
    { "coll": 'vitals_tran', "schema": _vitals_tran, "db": "cm" },
    { "coll": 'investigation_tran', "schema": _investigations_tran, "db": "cm" },
    { "coll": 'medications_tran', "schema": _medications_tran, "db": "cm" },
    { "coll": 'labresults', "schema": _lab_results, "db": "cm" },
    { "coll": 'ordersets', "schema": _order_sets, "db": "cm" },
    { "coll": 'labels_templates', "schema": _lbl_template, "db": "cm" },
    { "coll": 'inv_fav', "schema": _investigations_fav, "db": "cm" },
    { "coll": 'med_fav', "schema": _medications_fav, "db": "cm" },
    { "coll": 'fieldsmanagement', "schema": _field_management, "db": "cm" },
    { "coll": 'usersessions', "schema": _userSession, "db": "cm" },
    { "coll": 'errorLogging', "schema": errorLogging, "db": "cm" },
    { "coll": 'uploadDocuments', "schema": _documents, "db": "cm" },
    { "coll": 'diabetics_tran', "schema": _diabetics_tran, "db": "cm" },
    { "coll": 'mirtheventtrans', "schema": _mirth_event_trans, "db": "cm" },
    //{ "coll": 'zipcodes', "schema": _zipcodes, "db": "cm" },
    { "coll": 'pincodes', "schema": _pincodes, "db": "cm" },
    { "coll": 'pharmacy_med_masters', "schema": _pharmacy_med_masters, "db": "cm" },
    { "coll": 'grn_entries', "schema": _grn_entry, "db": "cm" },
    { "coll": 'specialities', "schema": _specialities, "db": "cm" },
    { "coll": 'emr_to_his_syncs', "schema": _emrToHisSync, "db": "cm" },
    { "coll": 'drafts', "schema": _drafts, "db": "cm" },
    { "coll": 'hims_lab_results', "schema": _hims_lab_results, "db": "cm" },
    { "coll": 'notifications', "schema": _notifications_data, "db": "cm" },
    { "coll": 'media', "schema": _media, "db": "cm" },
    { "coll": 'abha_json', "schema": _abha_json, "db": "cm" },

];

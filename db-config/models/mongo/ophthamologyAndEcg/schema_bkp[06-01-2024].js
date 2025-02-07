const mongoose = require('mongoose');
const shortId = require('shortid');

const _auditSchema = new mongoose.Schema({
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

})

const _historySchema = new mongoose.Schema([
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
]);

const _addressSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    areaCode: {
        type: String,
    },
    areaName: {
        type: String,
    },
    cityCode: {
        type: String,
    },
    cityName: {
        type: String,
    },
    stateCode: {
        type: String,
    },
    stateName: {
        type: String,
    },
    countryCode: {
        type: String,
    },
    countryName: {
        type: String,
    },
    postalCode: {
        type: String,
        required: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});


const _contactSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    phone: {
        type: String,
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    audit: _auditSchema,
    history: [_historySchema]
});


const _genderSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    displayOrder:{
        type: Number,
        // required: true,
        // unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _blood_GroupSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _maritalStatusSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});


const _departmentSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});


const _relationshipSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    relationType: { type: String, required: true, unique: true }, // Example: Spouse, Parent, Sibling, Friend
    code: {
        type: String,
        // required: true,
        // unique: true
    },
    name: {
        type: String
    },
    audit: _auditSchema,
    history: [_historySchema]

});

const _titleSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _chief_ComplaintSchema = new mongoose.Schema([
    {
        code: { type: String, required: true, unique: true },
        complaint: { type: String, required: true, unique: true },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _locationSchema = new mongoose.Schema(
    {
        recStatus: {
            type: Boolean,
            default: true
        },
        i_orgCode: {
            type: String
        },
        i_locCode: {
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
        linkedFacilities: [
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
                locId: {
                    type: String,
                    required: true
                },
                code: {
                    type: String
                },
                name: String,
                locKey: String,
                area: String,
                city: String,
                state: String,
                country: String,
                zipCd: String,
            }
        ],
        locType: {
            type: String,
            required: true
        },
        locTypeCode: {
            type: String,
        },
        defLoc: {
            type: Boolean
        },
        nabhLogo: {
            type: Buffer,
        },
        nabhMimeType: {
            type: String,
        },
        sessionTimeOut: {
            type: String
        },
        printStyles: {
            type: String
        },
        serverTimeOut: String,

        printLang: {
            type: String
        },
        regFee: {
            type: Boolean,
            default: false
        },
        regFeeAmount: {
            type: String
        },
        sessionOut: String,
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
        address: _addressSchema,
        contact: _contactSchema,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
);

const _nationalitySchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _preferLanguageSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _religionSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _specialitySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _specializationsSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    specialtyCode: {
        type: String,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    audit: _auditSchema,
    history: [_historySchema]
});

const _medicationFavsSchema = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        mId: {
            type: String
        },
        code: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        seq: {
            type: Number
        },
        instr: {
            type: String
        },
        freq: {
            type: String,
        },
        days: {
            type: String
        },
        qty: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _testFavsSchema = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        tId: {
            type: String
        },
        code: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        instrction: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);


const _medsOrderSetsSchema = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        code: {
            type: String
        },
        name: {
            type: String
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
                },
                seq: {
                    type: Number
                },
                instr: {
                    type: String
                },
                freq: {
                    type: String,
                },
                days: {
                    type: String,
                },
                qty: {
                    type: String
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
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _invsOrderSetSchema = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        cd: {
            type: String
        },
        name: {
            type: String
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
                code: {
                    type: String
                },
                seq: {
                    type: Number
                },
                instr: {
                    type: String,

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
        ],
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _manufacturerSchema = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    "name": {
        type: String
    },
    "contact": _contactSchema,
    "address": _addressSchema,
    isDefault: {
        type: Boolean,
        default: () => { return false }
    },
    audit: _auditSchema,
    history: [_historySchema]
}]);

const _entitySchema = new mongoose.Schema([
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
                audit: _auditSchema,
                history: [_historySchema]
            }
        ],
        audit: _auditSchema
    }
]);

const _counterSchema = new mongoose.Schema({
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
        //required: true
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
    }
});

const _pincodesSchema = new mongoose.Schema([
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



const _organizationSchema = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    orgKey: {
        type: String,
        required: true,
    },
    dbType: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        sparse: true
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
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    orgImgUrl: {
        type: String,
        required: true
    },
    orglogo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: false,
    },
    orglogoMimeType: {
        type: String
    },
    favIcon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: false,
    },
    favIconMimeType: {
        type: String
    },
    contact: _contactSchema,
    establishedYear: {
        type: Number
    },
    hospitalType: {
        type: String,
        enum: ['Public', 'Private', 'Charitable'],
        required: true
    },
    accreditation: {
        type: [String]
    },
    associatedDoctors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctors'
        }
    ],
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
        code: String,
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
                    type: String
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
                    type: String
                },
                docMessageBody: {
                    type: String
                },
                subject: {
                    type: String,
                    required: function () {
                        return this.notificationType.EMAIL || this.notificationType.PUSHNOTIFICATION;
                    },
                },
                patPlaceholders: {
                    type: String
                },
                docPlaceholders: {
                    type: String
                },
                attachments: {
                    type: String
                },
                media: {
                    type: String,
                },
            }
        ],
        audit: _auditSchema,
        history: [_historySchema]
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
        code: String,
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
        audit: _auditSchema,
        history: [_historySchema]
    }],
    printHeader: String,
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
    },
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locations' }],
    audit: _auditSchema,
    history: [_historySchema]
});


const _documentsSchema = new mongoose.Schema([
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
        groupCode: {
            type: String,
        },
        groupName: {
            type: String,
        },
        iconClass: {
            type: String
        },
        documentCode: {
            type: String,
        },
        documentName: {
            type: String,
        },
        documentUrl: {
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
            type: String,
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
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _roleSchema = new mongoose.Schema([
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
        code: {
            type: String,
            immutable: true
        },
        name: {
            type: String,
            required: true
        },
        departmentCd: String,
        department: {
            type: String
        },
        isLinkedFacility: {
            type: Boolean,
            default: false
        },
        defaultTabCd: String,
        defaultTabName: String,
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
                    type: String
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
                documentUrl: String,
                reportUrl: String,
                isMulti: {
                    type: Boolean,
                    default: false
                },
                displayOrder:String,
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
                code: String,
                iconClass: String,
                isActive: Boolean,
                isShown: Boolean,
                displayOrder:String,
                permission: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    isActive: Boolean,
                    isShown: Boolean,
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
                    approve: {
                        type: Boolean,
                        default: false
                    },
                    reject: {
                        type: Boolean,
                        default: false
                    },
                    edit: {
                        type: Boolean,
                        default: false
                    },
                    accessUser: {
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
                },
                routeUrl: String,
            }
        ],
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        sessionId: {
            type: String,
            //required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);


const _patientSchema = new mongoose.Schema([
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
        UMR: {
            type: String,
            required: true,
            immutable: true
        },
        registeredLocId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Locations',
            required: true
        },
        title: { type: mongoose.Schema.Types.ObjectId, ref: 'Title', required: true, default: null },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        dispName: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String
        },
        gender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gender',
            required: true
        },
        bloodGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BloodGroup'
        },
        maritalStatus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MaritalStatus'
        },
        aadhaarNo: String,
        abhaNo: {
            type: String,
            required: true,
            immutable: true
        },
        abhaAddress: {
            type: String,
            required: true
        },
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
            ref: 'Media',
            required: false,
        },
        abhaJson: Array,
        contact: _contactSchema,
        homeAddress: _addressSchema,
        commuAddress: _addressSchema,
        emergencyContact: {
            name: { type: String, required: false },
            phone: { type: String, required: false },
            relationship: { type: mongoose.Schema.Types.ObjectId, ref: 'Relationship' },
        },
        isVIP: {
            type: Boolean,
            default: () => { return false }
        },
        isExpired: {
            type: Boolean,
            default: () => { return false }
        },
        expiredDt: String,
        chiefComplaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChiefComplaint',
            required: false
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enities.child',
            required: false
        },
        registrationDate: {
            type: String,
            default: () => { return new Date().toISOString() }
        },
        registrationExpireDt: {
            type: String
        },
        languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreferLanguage' }],
        prefferedLanquage: String,
        nationality: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Nationality',
        },
        religion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Religion',
        },
        motherMaidenName: String,
        proofOfDoc: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                auto: true,
            },
            code: String,
            name: String,
            value: String
        },
        photo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
        },
        signature: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
            default: null
        },
        identifications: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                auto: true,
            },
            identity1: String,
            identity2: String
        },
        visits: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consultations'
        }],
        visitTransactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VisitTransactions'
        }],
        bills: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            billId: String,
            billNo: String,
            dateTime: String,
            visit: String,
            visitNo: String
        }],
        document: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                docId: {
                    type: String
                },
                docName: {
                    type: String,
                    required: true
                },
                docType: {
                    type: String
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
                remarks: String
            }
        ],

        audit: _auditSchema,
        history: [_historySchema]
    }
]);


const _doctorsSchema = new mongoose.Schema([
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
        docCode: {
            type: String
        },
        i_docCd: {
            type: String,
        },
        docTypeCode: {
            type: String
        },
        docTypeName: {
            type: String
        },
        title: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        dispName: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String
        },
        gender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gender',
            required: true
        },
        bloodGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BloodGroup',
        },
        contact: _contactSchema,
        userName: {
            type: String,
            required: true,
            immutable: true
        },
        password: {
            type: String,
            required: true
        },
        photo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
        },
        signature: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
        },

        speciality: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speciality', required: true }],
        specializations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specializations', required: true }],
        experienceYears: { type: Number, required: true },
        qualification: { type: String, required: true },
        designation: { type: String, required: true },
        registrationNo: {
            type: String
        },
        apmntReq: {
            type: Boolean,
            default: false
        },
        isDefDoc: {
            type: Boolean,
            default: false
        },
        userInsertion: {
            type: Boolean,
            default: false
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

                    },
                    vitals: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true
                        },
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
                        },
                        name: {
                            type: String
                        },
                        startTime: {
                            type: String
                        },
                        endTime: {
                            type: String
                        },
                        duration: {
                            type: String
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
                        type: String
                    },
                    normal: {
                        type: String
                    },
                    emergency: {
                        type: String
                    },
                    online: {
                        type: String
                    },
                    reVisit: {
                        type: String
                    },
                },
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

                        },
                        docmntName: {
                            type: String,
                            //   required: true
                        },
                        status: {
                            type: String,
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

                        },
                        docmntName: {
                            type: String,

                        },
                        status: {
                            type: String
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
                        code: {
                            type: String
                        },
                        name: {
                            type: String
                        },
                        date: {
                            type: String
                        },
                        type: {
                            type: String
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
                audit: _auditSchema,
                history: [_historySchema]
            }
        ],
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _employeeSchema = new mongoose.Schema([
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
        recStatus: {
            type: Boolean,
            default: true
        },
        code: {
            type: String,
            immutable: true
        },
        empTypeCode: {
            type: String,
            required: true
        },
        empTypeName: {
            type: String,
        },
        title: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Title',
            required: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        dispName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            unique: true,
            immutable: true
        },
        userCreation: Boolean,
        gender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gender'
        },
        dateOfBirth: {
            type: String
        },
        contact: _contactSchema,
        photo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
        },
        signature: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: false,
        },
        joiningDate: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        address: _addressSchema,
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
                designationCode: {
                    type: String,
                    required: true
                },
                designation: {
                    type: String,
                    required: true
                },
                department: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Department',
                    required: true
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                roleName: {
                    type: String,
                    required: true
                },

                audit: _auditSchema,
                history: [_historySchema]
            }
        ],
        audit: _auditSchema,
        history: [_historySchema]
    }
]);


const _usersSchema = new mongoose.Schema([
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
        contact: _contactSchema,
        defaultLocId: String,
        locations: [{
            locId: {
                type: String,
                required: true
            },
            code: {
                type: String
            },
            name: {
                type: String
            },
            roleId: {
                type: mongoose.Schema.Types.ObjectId
            },
            role: {
                type: String,
                required: true
            }
        }],
        linkedFacilities: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            locId: {
                type: String,
                //required: true
            },
            code: {
                type: String
            },
            name: {
                type: String
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
        lockDtTime: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        otp: {
            type: String
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _userSessionSchema = new mongoose.Schema([
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
        token: String,
        terminal: String,
        timeZone: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 0 }
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);

const _consultationSchema = new mongoose.Schema([
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
        visitType: {
            type: String
        },
        dateTime: {
            type: String,
            default: () => { return new Date().toISOString() }
        },
        documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Documents', required: false },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors', required: true },
        UMR: { type: String },
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
        visitTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitTransactions', required: false },

        reasonForVisit: String,
        remarks: String,
        source: String,
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
        status: {
            type: String,
            default: "NEW"
        },
        refBy: String,
        reasonForSlotCancelCode: {
            type: String,
        },
        reasonForSlotCancelName: {
            type: String,
        },
        audit: _auditSchema,
        history: [_historySchema]
    }
]);


const _glassPrescriptionSchema = new mongoose.Schema({
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
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultations', required: true },
    sphere: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        right: { type: String, required: true },
        left: { type: String, required: true },
    },
    cylinder: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        right: { type: String, required: true },
        left: { type: String, required: true },
    },
    axis: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        right: { type: String, required: true },
        left: { type: String, required: true },
    },
    addition: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        right: { type: String },
        left: { type: String },
    },
    frameSize: { type: String },
    remarks: { type: String },
    status: {
        type: String,
        enum: ['Pending for CHC Approval', 'Pending for State Approval', 'Reject at CHC Level', 'Reject at State Level', 'Approved', 'Sent to Manufacturer', 'Received from Manufacturer', 'Dispached to Patient', 'Rejected'],
        default: 'Pending for CHC Approval',
        required: true,
    },
    prescribedLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locations',
        required: true
    },
    approvals: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        phc: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            location: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Locations',
                required: false
            },
            approved: { type: Boolean, default: false },
            rejected: { type: Boolean, default: false },
            rejectionReason: { type: String },
            rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            rejectedDateTime: { type: String },
            approvedDateTime: { type: String },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            requestReceivedDateTime: { type: String },
            tat: { type: Number },
        },
        chc: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            location: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Locations',
                required: false
            },
            approved: { type: Boolean, default: false },
            rejected: { type: Boolean, default: false },
            approvedDateTime: { type: String },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            rejectionReason: { type: String },
            rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            rejectedDateTime: { type: String },
            requestReceivedDateTime: { type: String },
            tat: { type: Number },
        },
        state: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            approved: { type: Boolean, default: false },
            rejected: { type: Boolean, default: false },
            approvedDateTime: { type: String },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            requestReceivedDateTime: { type: String },
            rejectionReason: { type: String },
            rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            rejectedDateTime: { type: String },
            tat: { type: Number },
        },
        manufacturer: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            approved: { type: Boolean, default: false },
            rejected: { type: Boolean, default: false },
            approvedDateTime: { type: String },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            requestReceivedDateTime: { type: String },
            rejectionReason: { type: String },
            rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            rejectedDateTime: { type: String },
            tat: { type: Number },
        },
    },
    batchNumber: { type: String },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturers',
        required: false
    },
    manufacturerActions: {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        viewed: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            datetime: { type: Date },
            viewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            viewedBy: { type: String },
            viewedDt: { type: Date },
        },
        downloaded: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            datetime: { type: Date },
            viewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            viewedBy: { type: String },
            viewedDt: { type: Date },
        },
        uploaded: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            status: { type: Boolean, default: false },
            datetime: { type: Date },
            viewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            viewedBy: { type: String },
            viewedDt: { type: Date },
        },
        tat: { type: Number },
    },
    audit: _auditSchema,
    history: [_historySchema]
});



// Pre-save middleware to calculate TAT dynamically
_glassPrescriptionSchema.pre('save', function (next) {
    const approvalSteps = ['phc', 'chc', 'state'];
    const now = new Date();

    approvalSteps.forEach((step) => {
        const approval = this.approvals[step];
        if (approval.approved && !approval.tat) {
            if (approval.requestReceivedDateTime && approval.approvedAt) {
                approval.tat = Math.round(
                    (new Date(approval.approvedAt) - new Date(approval.requestReceivedDateTime)) / (1000 * 60 * 60) // TAT in hours
                );
            } else if (approval.requestReceivedDateTime) {
                approval.tat = Math.round(
                    (now - new Date(approval.requestReceivedDateTime)) / (1000 * 60 * 60) // TAT in hours if approvedAt is missing
                );
            }
        }
    });

    next();
});

// Method to update the status based on the approval/rejection state
_glassPrescriptionSchema.methods.updateStatus = function () {
    const { phc, chc, state } = this.approvals;

    if (phc.rejected || chc.rejected || state.rejected) {
        this.status = 'Rejected';  // If any level rejects, set the status to Rejected
    } else if (phc.approved && chc.approved && state.approved) {
        this.status = 'Approved';  // If all levels approve, set status to Approved
    } else if (!phc.approved && !phc.rejected) {
        this.status = 'Pending for CHC Approval';  // PHC pending approval
    } else if (phc.approved && !chc.approved && !chc.rejected) {
        this.status = 'Pending for State Approval';  // CHC pending approval
    } else {
        this.status = 'Pending for CHC Approval';  // Default for any other condition
    }

    // Save the updated status and return the updated document
    return this.save();
};


const _transactionSchema = new mongoose.Schema([
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
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
        visit: {
            type: String,
            required: true
        },
        visitNo: {
            type: String,
            required: true
        },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors', required: true },
        documentNo: {
            type: String
        },
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        documentCode: {
            type: String,
        },
        documentName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: () => { return "REQUESTED" },
        },
        diagnosis: { type: String, required: false },
        prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'GlassPrescriptions' },
        followUpDate: { type: String },
        audit: _auditSchema,
        history: [_historySchema]
    }
], { strict: false });


const _glassPrescriptionReceivalsSchema = new mongoose.Schema({
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
    glassPrescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GlassPrescriptions',
        required: true
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturers',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients',
        required: true
    },
    consultation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultations',
        required: true
    },
    sphere: {
        right: { type: Number, required: true },
        left: { type: Number, required: true },
    },
    cylinder: {
        right: { type: Number, required: true },
        left: { type: Number, required: true },
    },
    axis: {
        right: { type: Number, required: true },
        left: { type: Number, required: true },
    },
    addition: {
        right: { type: Number },
        left: { type: Number },
    },
    frameSize: { type: Number },
    remarks: { type: String },
    prescribedLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locations',
        required: true
    },
    batchNumber: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Uploaded', 'Pending', 'Approved'],
        default: 'Uploaded'
    },
    receivedDateTime: {
        type: String,
        default: () => { return new Date().toISOString() },
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    tat: {
        type: Number,
        required: false,
        default: 0
    },
    finalStatus: {
        type: String,
        enum: ['Received', 'Processed', 'Completed'],
        default: 'Received'
    },
    audit: _auditSchema,
    history: [_historySchema]
});



const _mediaSchema = new mongoose.Schema({
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
        type: String,
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    referenceType: {
        type: String,
        required: true
    },
    photo: {
        type: Buffer,
        required: false,
    },
    orglogo: {
        type: Buffer,
        required: false,
    },
    orglogoMimeType: {
        type: String
    },
    favIcon: {
        type: Buffer,
        required: false,
    },
    favIconMimeType: {
        type: String
    },
    signature: {
        type: Buffer,
        required: false,
    },
    abhaCard: {
        type: Buffer,
        required: false,
    },
    photoMimeType: String,
    signatureMimeType: String,
    abhaMimeType: String,
    audit: _auditSchema,
    history: [_historySchema]
});



/**History  */
const _tranHistorySchema = new mongoose.Schema([
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
        audit: _auditSchema,
        history: [_historySchema]
    }
]);



module.exports = [
    { "coll": 'BloodGroup', "schema": _blood_GroupSchema, "db": "ophthamology_ecg" },
    { "coll": 'Gender', "schema": _genderSchema, "db": "ophthamology_ecg" },
    { "coll": 'Address', "schema": _addressSchema, "db": "ophthamology_ecg" },
    { "coll": 'Relationship', "schema": _relationshipSchema, "db": "ophthamology_ecg" },
    { "coll": 'ChiefComplaint', "schema": _chief_ComplaintSchema, "db": "ophthamology_ecg" },
    { "coll": 'Title', "schema": _titleSchema, "db": "ophthamology_ecg" },
    { "coll": 'Locations', "schema": _locationSchema, "db": "ophthamology_ecg" },
    { "coll": 'Religion', "schema": _religionSchema, "db": "ophthamology_ecg" },
    { "coll": 'PreferLanguage', "schema": _preferLanguageSchema, "db": "ophthamology_ecg" },
    { "coll": 'Nationality', "schema": _nationalitySchema, "db": "ophthamology_ecg" },
    { "coll": 'Speciality', "schema": _specialitySchema, "db": "ophthamology_ecg" },
    { "coll": 'Specializations', "schema": _specializationsSchema, "db": "ophthamology_ecg" },
    { "coll": 'Manufacturers', "schema": _manufacturerSchema, "db": "ophthamology_ecg" },
    { "coll": 'counters', "schema": _counterSchema, "db": "ophthamology_ecg" },
    { "coll": 'Entities', "schema": _entitySchema, "db": "ophthamology_ecg" },
    { "coll": 'Pincodes', "schema": _pincodesSchema, "db": "ophthamology_ecg" },
    { "coll": 'Departments', "schema": _departmentSchema, "db": "ophthamology_ecg" },
    { "coll": 'MaritalStatus', "schema": _maritalStatusSchema, "db": "ophthamology_ecg" },
    { "coll": 'histories', "schema": _tranHistorySchema, "db": "ophthamology_ecg" },
    { "coll": 'Fieldsmanagement', "schema": _field_management, "db": "ophthamology_ecg" },


    { "coll": 'Organization', "schema": _organizationSchema, "db": "ophthamology_ecg" },
    { "coll": 'Documents', "schema": _documentsSchema, "db": "ophthamology_ecg" },
    { "coll": 'Roles', "schema": _roleSchema, "db": "ophthamology_ecg" },
    { "coll": 'Employees', "schema": _employeeSchema, "db": "ophthamology_ecg" },
    { "coll": 'Doctors', "schema": _doctorsSchema, "db": "ophthamology_ecg" },
    { "coll": 'Users', "schema": _usersSchema, "db": "ophthamology_ecg" },
    { "coll": 'UserSessions', "schema": _userSessionSchema, "db": "ophthamology_ecg" },
    { "coll": 'Patients', "schema": _patientSchema, "db": "ophthamology_ecg" },
    { "coll": 'Consultations', "schema": _consultationSchema, "db": "ophthamology_ecg" },
    { "coll": 'GlassPrescriptions', "schema": _glassPrescriptionSchema, "db": "ophthamology_ecg" },
    { "coll": 'VisitTransactions', "schema": _transactionSchema, "db": "ophthamology_ecg" },
    { "coll": 'GlassOrdersReceivals', "schema": _glassPrescriptionReceivalsSchema, "db": "ophthamology_ecg" },
    { "coll": 'Media', "schema": _mediaSchema, "db": "ophthamology_ecg" },


];
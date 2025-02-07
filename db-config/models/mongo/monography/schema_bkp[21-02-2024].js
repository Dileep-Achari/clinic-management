const mongoose = require("mongoose");

/** levels schema*/
const _levels = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },    
        label: {
            type: String,
            required: true
        },
        sequence: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        permissions: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            edit: {
                type: Boolean,
                default: false
            },
            view: {
                type: Boolean,
                default: false
            },
            accept: {
                type: Boolean,
                default: false
            },
            start: {
                type: Boolean,
                default: false
            },
            submitForReview: {
                type: Boolean,
                default: false
            },
            revisionOpen: {
                type: Boolean,
                default: false
            },
            revisionClose: {
                type: Boolean,
                default: false
            },
            reviewApproved: {
                type: Boolean,
                default: false
            },
            approve: {
                type: Boolean,
                default: false
            },
            publish: {
                type: Boolean,
                default: false
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
]);

/** roles schema */
const _roles = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        label: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        level: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            label: {
                type: String,
                required: true
            },
            sequence: {
                type: Number
            },
            isActive: {
                type: Boolean,
                default: true,
                required: true
            },
        },
        sections: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                hcpId: {
                    type: String
                    // type: mongoose.Schema.Types.ObjectId,
                    //  required: true
                },
                patientId: {
                    type: String
                    //  type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                drugInteractionId: {
                    type: String
                },
                content_name: {
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    default: true
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
        content_type: {
            type: String
        },
        // audit: {
        //     "_id": {
        //         type: mongoose.Schema.Types.ObjectId,
        //         required: true,
        //         auto: true,
        //     },
        //     documentedById:{
        //         type: String,
        //      //   required: true
        //     },
        //     documentedBy: {
        //         type: String,
        //       //  required: true
        //     },
        //     documentedDt: {
        //         type: String,
        //         default: () => { return new Date().toISOString() },
        //     },
        //     modifiedBy: {
        //         type: String
        //     },
        //     modifiedDt: {
        //         type: String
        //     }
        // },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        sequence: {
            type: Number
        },
        actionOfRole: {
            type: String
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
            }
        ]
    }
]);

/** user schema */
const _users = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        address: {
            type: String,
            //   required: true
        },
        userName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profilePic: {
            type: String,
            //  required: true
        },
        EmpId: {
            type: String
        },
        content_type: {
            type: String
        },
        defaultRoleId: {
            type: mongoose.Types.ObjectId,
            //required: true
        },
        defaultRoleName: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        assignedRoles: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Types.ObjectId
                },
                roleName: {
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    default: true
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
            }
        ]
    }
]);

/** drug creation schema */
const _drugCreation = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        DD_SUBSTANCE_NAME: {
            type: String,
            required: true
        },
        DD_SUBSTANCE_CD: {
            type: String,
            // required: true
        },
        PARENT_DRUG_CD: {
            type: String
        },
        manufacturer: {
            type: String,
            // required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        description: {
            type: String,
            //required: true
        },
        lastApprovedBy: {
            type: String
        },
        lastApprovedDate: {
            type: String
        },
        version: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        mainSections: {
            type: Number,
            // required: true
        },
        entrySections: {
            type: Number,
            // required: true     
        },
        assignedTo: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName: {
                    type: String
                }
            }
        ],
        // template: {
        //     "_id": {
        //         type: mongoose.Schema.Types.ObjectId,
        //         required: true,
        //         //auto: true,
        //     },
        //     hcp: [
        //         {
        //             "_id": {
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 required: true,
        //               //  auto: true,
        //             },
        //             label: {
        //                 type: String,
        //               //  required: true
        //             },
        //             depth: {
        //                 type: String,
        //               //  required: true
        //             },
        //             isActive: {
        //                 type: Boolean,
        //               //  default: true
        //             },
        //             mId:{
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 required: true,
        //               //  auto: true,
        //             },
        //             sequence: {
        //                 type: Number,
        //               //  required: true
        //             },
        //             superParent: {
        //                 type: Number,
        //               //  required: true
        //             },
        //             imdParent: {
        //                 type: Number,
        //               //  required: true
        //             },
        //             version: {
        //                 type: Number,
        //              //   required: true
        //             },
        //             data: {
        //                 type: String,
        //              //   required: true
        //             },
        //             status: {
        //                 type: String,
        //              //   required: true
        //             },
        //             isEditable: {
        //                 type: Boolean,
        //                 default: true
        //             },
        //             history: [
        //                 {
        //                     "_id": {
        //                         type: mongoose.Schema.Types.ObjectId,
        //                         required: true,
        //                         auto: true,
        //                     },
        //                     revTranId: {
        //                         type: String,
        //                       //  required: true
        //                     },
        //                     revNo: {
        //                         type: Number,
        //                       //  required: true
        //                     },
        //                 }
        //             ],
        //             children: []
        //         }
        //     ],
        //     patient: [
        //         {
        //             "_id": {
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 required: true,
        //                // auto: true,
        //             },
        //             label: {
        //                 type: String,
        //               //  required: true
        //             },
        //             depth: {
        //                 type: String,
        //                 //required: true
        //             },
        //             isActive: {
        //                 type: Boolean,
        //                 //default: true
        //             },
        //             mId:{
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 required: true,
        //               //  auto: true,
        //             },
        //             sequence: {
        //                 type: Number,
        //                 //required: true
        //             },
        //             superParent: {
        //                 type: Number,
        //                 //required: true
        //             },
        //             imdParent: {
        //                 type: Number,
        //                 //required: true
        //             },
        //             version: {
        //                 type: Number,
        //               //  required: true
        //             },
        //             data: {
        //                 type: String,
        //               //  required: true
        //             },
        //             status: {
        //                 type: String,
        //                // required: true
        //             },
        //             isEditable: {
        //                 type: Boolean,
        //                 default: true
        //             },
        //             history: [
        //                 {
        //                     "_id": {
        //                         type: mongoose.Schema.Types.ObjectId,
        //                         required: true,
        //                         auto: true,
        //                     },
        //                     revTranId: {
        //                         type: String,
        //                      //   required: true
        //                     },
        //                     revNo: {
        //                         type: Number,
        //                      //   required: true
        //                     },
        //                 }
        //             ],
        //             children: []
        //         }
        //     ]
        // },
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        metaSearchKeywords: [],
        comments: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                date: {  
                    type: String,
                    default: () => { return new Date().toISOString() }
                },
                whom: {
                    type: String
                },
                comment: {
                    type: String
                },
                precompled: {
                    type: String
                }
            }
        ],
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
                // approvedBy: {
                //     type: String
                // },
                // approvedDate:{
                //     type: String,
                // },
                // approvedVersion: {
                //     type: Number
                // },
            }
        ]
    }
]);

/** user_assign schema*/
const _user_assign = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        dId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        DD_SUBSTANCE_CD: {
            type: String
        },
        DD_SUBSTANCE_NAME: {
            type: String
        },
        PARENT_DRUG_CD: {
            type: String
        },
        // dName: {
        //     type: String,
        //     required: true
        // },
        assignedTo: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                sequence: {
                    type: Number
                },
                actionOfRole: {
                    type: String
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                levelName: {
                    type: String
                },
                content_type: {
                    type: String
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName: {
                    type: String
                }
            }
        ],
        previousAssigned: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                levelName: {
                    type: String
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName: {
                    type: String
                }
            }
        ],
        assignedDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        status: {
            type: String,
            default: () => { return 'ASSIGNED' }
        },
        current_status: {
            type: String,
            default: () => { return 'NOT ACCEPTED' }
        },
        next_status: {
            type: String
        },
        previous_status: {
            type: String,
            default: () => { return 'NOT ACCEPTED' }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        operation_type: {
            type: String
        },
        content_type: {
            type: String
        },
        fromSource: String,
        sections: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                hcpId: {
                    type: mongoose.Schema.Types.ObjectId
                },
                patientId: {
                    type: mongoose.Schema.Types.ObjectId
                },
                drugInteractionId: {
                    type: String
                },
                content_name: {
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                status: {
                    type: String,
                    default: () => { return 'ASSIGNED' }
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
            }
        ]
    }
]);

// drug_current_flow

const _drug_flow = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        dId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        DD_SUBSTANCE_CD: {
            type: String
        },
        DD_SUBSTANCE_NAME: {
            type: String
        },
        PARENT_DRUG_CD: {
            type: String
        },
        // dName: {
        //     type: String,
        //     required: true
        // },
        assignedTo: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                levelId: {
                    type: String,
                    //   required: true
                },
                sequence: {
                    type: Number
                },
                actionOfRole: {
                    type: String
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName: {
                    type: String
                }
            }
        ],
        previousAssigned: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                roleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleName: {
                    type: String,
                    required: true
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                    //   required: true
                },
                roleType: {
                    type: String
                },
                sequence: {
                    type: Number
                },
                actionOfRole: {
                    type: String
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName: {
                    type: String
                }
            }
        ],
        assignedDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        status: {
            type: String,
            default: () => { return 'ASSIGNED' }
        },
        current_status: {
            type: String,
            default: () => { return 'NOT ACCEPTED' }
        },
        next_status: {
            type: String
        },
        previous_status: {
            type: String,
            default: () => { return 'NOT ACCEPTED' }
        },
        operation_type: {
            type: String
        },
        content_type: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        fromSource: String,
        sections: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                hcpId: {
                    type: mongoose.Schema.Types.ObjectId
                },
                patientId: {
                    type: mongoose.Schema.Types.ObjectId
                },
                drugInteractionId: {
                    type: String
                },
                content_name: {
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                status: {
                    type: String,
                    default: () => { return 'ASSIGNED' }
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
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
            }
        ]
    }
]);


const _coreMaster_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
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
        suvExt: {
            type: String,
            required: true
        },
        suvExtCd: {
            type: Number,
            required: true
        },
        bdf: {
            type: String,
            //  required: true
        },
        bdfCd: {
            type: String,
            //  required: true
        },
        is: {
            type: String,
            //  required: true
        },
        isCd: {
            type: Number,
            required: true
        },
        strength: {
            type: Number,
            required: true
        },
        strengthCd: {
            type: Number,
            required: true
        },
        uom: {
            type: String,
            //  required: true
        },
        uomCd: {
            type: Number,
            //  required: true
        },
        release: {
            type: String,
            //  required: true
        },
        releaseCd: {
            type: Number,
            //  required: true
        },
        dam: {
            type: String,
            //  required: true
        },
        damCd: {
            type: Number,
            //  required: true
        },
        roa: {
            type: String,
            //  required: true
        },
        roaCd: {
            type: Number,
            //  required: true
        },
        fullName: {
            type: String,
            //  required: true
        },
        dispName: {
            type: String,
            //  required: true
        },
        orgId: {
            type: Number,
            //  required: true
        },
        locId: {
            type: Number,
            //  required: true
        },
        documentDt: {
            type: String,
            //  required: true
        },
        documentBy: {
            type: Number,
            //  required: true
        },
        modifyDt: {
            type: String,
            //  required: true
        },
        modifyBy: {
            type: String,
            //  required: true
        },
    }
])
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
            required: true
        },
        method: {
            type: String,
            required: true
        },
        collectionName: {
            type: String,
            //    required: true
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
        revNo: {
            type: Number,
            required: true
        },
        history: {
            type: Object,
            required: true
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
        //  required: true
    },
    locName: {
        type: String,
        //  required: true
    },
    seqName: {
        type: String,
        required: true,

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

const _template = new mongoose.Schema([
    // { 
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        label: String,
        depth: String,
        content_type: {
            type: String
        },
        INT_ID: {
            type: Number
        },
        isActive: {
            type: Boolean,
            default: true
        },
        section_type: {
            type: String
        },
        sequence: {
            type: Number,
            required: true
        },
        superParent: {
            type: Number,
            required: true
        },
        imdParent: {
            type: Number,
            required: true
        },
        version: {
            type: Number,
            required: true
        },
        isMandatory: {
            type: Boolean
        },
        logoPath:{
          type:String
        },
        data: String,
        status: String,
        isEditable: {
            type: Boolean,
            default: true
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
                // approvedBy: {
                //     type: String
                // },
                // approvedDate:{
                //     type: String,
                // },
                // approvedVersion: {
                //     type: Number
                // },
            }
        ],
        children: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                label: String,
                depth: String,
                isActive: {
                    type: Boolean,
                    default: true
                },
                sequence: {
                    type: Number,
                    required: true
                },
                superParent: String,
                imdParent: String,
                isMandatory: {
                    type: Boolean
                },
                version: {
                    type: Number,
                    required: true
                },
                logoPath:{
                    type:String
                  },
                data: String,
                status: String,
                history: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        revTranId: {
                            type: String,
                            // required: true
                        },
                        revNo: {
                            type: Number,
                            // required: true
                        },

                    }
                ],
                children: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        label: String,
                        depth: String,
                        isActive: {
                            type: Boolean,
                            default: true
                        },
                        sequence: {
                            type: Number,
                            //  required: true
                        },
                        superParent: String,
                        imdParent: String,
                        version: {
                            type: Number,
                            //  required: true
                        },
                        data: String,
                        status: String,
                        history: [
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                revTranId: {
                                    type: String,
                                    // required: true
                                },
                                revNo: {
                                    type: Number,
                                    // required: true
                                },

                            }
                        ],
                        children: []
                    }
                ]
            }
        ]

    }
    // "_id": {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     auto: true,
    // },
    // hcp:[
    //     {
    //         "_id": {
    //             type: mongoose.Schema.Types.ObjectId,
    //             required: true,
    //             auto: true,
    //         },
    //         label:String,
    //         depth:String,
    //         isActive: {
    //             type: Boolean,
    //             default: true
    //         },
    //         sequence:{
    //             type: Number,
    //             required: true
    //         },
    //         superParent:{
    //             type: Number,
    //             required: true
    //         },
    //         imdParent:{
    //             type: Number,
    //             required: true
    //         },
    //         version:{
    //             type: Number,
    //             required: true
    //         },
    //         data:String,
    //         status:String,
    //         isEditable:{
    //             type: Boolean,
    //             default: true
    //         },
    //         history:[
    //             {
    //                 "_id": {
    //                     type: mongoose.Schema.Types.ObjectId,
    //                     required: true,
    //                     auto: true,
    //                 },
    //                 revTranId: {
    //                     type: String,
    //                   //  required: true
    //                 },
    //                 revNo: {
    //                     type: Number,
    //                    // required: true
    //                 },
    //                 // approvedBy: {
    //                 //     type: String
    //                 // },
    //                 // approvedDate:{
    //                 //     type: String,
    //                 // },
    //                 // approvedVersion: {
    //                 //     type: Number
    //                 // },
    //             }
    //         ],
    //         children:[
    //             {
    //                 "_id": {
    //                     type: mongoose.Schema.Types.ObjectId,
    //                     required: true,
    //                     auto: true,
    //                 },
    //                 label:String,
    //                 depth:String,
    //                 isActive: {
    //                     type: Boolean,
    //                     default: true
    //                 },
    //                 sequence:{
    //                     type: Number,
    //                     required: true
    //                 },
    //                 superParent:String,
    //                 imdParent:String,
    //                 version:{
    //                     type: Number,
    //                     required: true
    //                 },
    //                 data:String,
    //                 status:String,
    //                 history:[
    //                     {
    //                         "_id": {
    //                             type: mongoose.Schema.Types.ObjectId,
    //                             required: true,
    //                             auto: true,
    //                         },
    //                         revTranId: {
    //                             type: String,
    //                            // required: true
    //                         },
    //                         revNo: {
    //                             type: Number,
    //                            // required: true
    //                         },

    //                     }
    //                 ],
    //                 children:[
    //                     {
    //                         "_id": {
    //                             type: mongoose.Schema.Types.ObjectId,
    //                             required: true,
    //                             auto: true,
    //                         },
    //                         label:String,
    //                         depth:String,
    //                         isActive: {
    //                             type: Boolean,
    //                             default: true
    //                         },
    //                         sequence:{
    //                             type: Number,
    //                           //  required: true
    //                         },
    //                         superParent:String,
    //                         imdParent:String,
    //                         version:{
    //                             type: Number,
    //                           //  required: true
    //                         },
    //                         data:String,
    //                         status:String,
    //                         history:[
    //                             {
    //                                 "_id": {
    //                                     type: mongoose.Schema.Types.ObjectId,
    //                                     required: true,
    //                                     auto: true,
    //                                 },
    //                                 revTranId: {
    //                                     type: String,
    //                                    // required: true
    //                                 },
    //                                 revNo: {
    //                                     type: Number,
    //                                    // required: true
    //                                 },

    //                             }
    //                         ],
    //                         children: []
    //                     }
    //                 ]
    //             }
    //         ]

    //     }
    // ],
    // patient:[
    //     {
    //             "_id": {
    //                 type: mongoose.Schema.Types.ObjectId,
    //                 required: true,
    //                 auto: true,
    //             },
    //             label:String,
    //             depth:String,
    //             isActive: {
    //                 type: Boolean,
    //                 default: true
    //             },
    //             sequence:{
    //                 type: Number,
    //                 required: true
    //             },
    //             superParent:{
    //                 type: Number,
    //                 required: true
    //             },
    //             imdParent:{
    //                 type: Number,
    //                 required: true
    //             },
    //             version:{
    //                 type: Number,
    //                 required: true
    //             },
    //             data:String,
    //             status:String,
    //             isEditable:{
    //                 type: Boolean,
    //                 default: true
    //             },
    //             history:[
    //                 {
    //                     "_id": {
    //                         type: mongoose.Schema.Types.ObjectId,
    //                         required: true,
    //                         auto: true,
    //                     },
    //                     revTranId: {
    //                         type: String,
    //                         required: true
    //                     },
    //                     revNo: {
    //                         type: Number,
    //                         required: true
    //                     },
    //                     // approvedBy: {
    //                     //     type: String
    //                     // },
    //                     // approvedDate:{
    //                     //     type: String,
    //                     // },
    //                     // approvedVersion: {
    //                     //     type: Number
    //                     // },
    //                 }
    //             ],
    //             children:[
    //                 {
    //                     "_id": {
    //                         type: mongoose.Schema.Types.ObjectId,
    //                         required: true,
    //                         auto: true,
    //                     },
    //                     label:String,
    //                     depth:String,
    //                     isActive: {
    //                         type: Boolean,
    //                         default: true
    //                     },
    //                     sequence:{
    //                         type: Number,
    //                         required: true
    //                     },
    //                     superParent:String,
    //                     imdParent:String,
    //                     version:{
    //                         type: Number,
    //                         required: true
    //                     },
    //                     data:String,
    //                     status:String,
    //                     history:[
    //                         {
    //                             "_id": {
    //                                 type: mongoose.Schema.Types.ObjectId,
    //                                 required: true,
    //                                 auto: true,
    //                             },
    //                             revTranId: {
    //                                 type: String,
    //                                // required: true
    //                             },
    //                             revNo: {
    //                                 type: Number,
    //                                // required: true
    //                             },

    //                         }
    //                     ],
    //                     children:[
    //                         {
    //                             "_id": {
    //                                 type: mongoose.Schema.Types.ObjectId,
    //                                 required: true,
    //                                 auto: true,
    //                             },
    //                             label:String,
    //                             depth:String,
    //                             isActive: {
    //                                 type: Boolean,
    //                                 default: true
    //                             },
    //                             sequence:{
    //                                 type: Number,
    //                               //  required: true
    //                             },
    //                             superParent:String,
    //                             imdParent:String,
    //                             version:{
    //                                 type: Number,
    //                               //  required: true
    //                             },
    //                             data:String,
    //                             status:String,
    //                             history:[
    //                                 {
    //                                     "_id": {
    //                                         type: mongoose.Schema.Types.ObjectId,
    //                                         required: true,
    //                                         auto: true,
    //                                     },
    //                                     revTranId: {
    //                                         type: String,
    //                                        // required: true
    //                                     },
    //                                     revNo: {
    //                                         type: Number,
    //                                        // required: true
    //                                     },

    //                                 }
    //                             ],
    //                             children: []
    //                         }
    //                     ]
    //                 }
    //             ]

    //      } 
    // ]
    // }
])

const _status = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        drug_Mongrophy_Status_Code: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        session_Id: {
            type: String
        },
        Drug_Mon_Status: {
            type: String
        },
        next_status: {
            type: String
        },
        roleType: {
            type: String
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
])

//section Data
const _sectionsData = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        drug_monography_Code: {
            type: String
        },
        drug_monography_description: {
            type: String
        },
        drugId: {
            type: String,
            //  required:true
        },
        type: {
            type: String
        },
        INT_ID: {
            type: Number
        },
        operation_type: {
            type: String
        },
        PARENT_DRUG_ID: {
            type: String
        },
        DD_SUBSTANCE_CD: {
            type: String
        },
        SECTION_TYPE: {
            type: String
        },
        SECTION_NAME: {
            type: String
        },
        drug_code: {
            type: String
        },
        drug_section_id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        userName: {
            type: String
        },
        role_id: {
            type: String,
            required: true
        },
        roleName: {
            type: String
        },
        drug_content: {
            type: String
        },
        content_type: {
            type: String,
            required: true
        },
        // interacaction_drug_content:[{
        //     any: mongoose.Schema.Types.Mixed
        // }],
        interacaction_drug_content: [{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            DRUG_IN_PARENT_ID: {
                type: Number
            },
            SRC_DRUG_CD: {
                type: String
            },
            DD_SUBSTANCE_NAME: {
                type: String
            },
            ROA_CD: {
                type: String
            },
            ROA_NAME: {
                type: String
            },
            INT_TYPE_ID: {
                type: String
            },
            ENTITY_VALUE_NAME: {
                type: String
            },
            INT_ID: {
                type: Number
            },
            ENTITY_NAME: {
                type: String
            },
            SEVERITY_ID: {
                type: Number
            },
            SEVERITY_NAME: {
                type: String
            },
            SRC_ID: {
                type: Number
            },
            SRC_NAME: {
                type: String
            },
            SRC_DESC: {
                type: String
            },
            SRC_URL: {
                type: String
            },
            INTERACTIONS: {
                type: String
            },
            REFERENCES: {
                type: String
            },
            STATUS: {
                type: String
            }
        }],
        section_comment: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                comment_desc: {
                    type: String
                },
                profilePic: {
                    type: String
                },
                date:{
                    type:String
                },
                userName:{
                    type:String
                },
                roleName:{
                    type:String
                }
            }
        ],
        current_status: {
            type: String
        },
        current_status_id: {
            type: String
        },
        next_status: {
            type: String
        },
        next_status_id: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        session_id: {
            type: String
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

//user-session

const _userSession = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        user_revNo: {
            type: String
        },
        userId: {
            type: mongoose.Types.ObjectId
        },
        userName: {
            type: String
        },
        session_id: {
            type: Number
        },
        orgId: {
            type: mongoose.Types.ObjectId
        },
        roleId: {
            type: mongoose.Types.ObjectId
        },
        roleName: {
            type: String
        },
        machine: {
            type: String
        },
        version: {
            type: String
        },
        startTime: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        endTime: {
            type: String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        timeZoneId: {
            type: Number
        },
        browserVersion: {
            type: String
        },
        browser: {
            type: String
        },
        idUserLoggedIn: {
            type: String
        },
        logOutTime: {
            type: String
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
])


//tracking flow

const _tracking = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        current_status_id: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true
        },
        current_status: {
            type: String
        },
        next_status: {
            type: String
        },
        next_status_id: {
            type: String
        },
        previous_status: {
            type: String
        },
        operation_type: {
            type: String
        },
        content_type: {
            type: String
        },
        done_by: {
            type: String
        },
        roleName: {
            type: String
        },
        roleId: {
            type: String
        },
        userName: {
            type: String
        },
        userId: {
            type: String
        },
        previousRoleId: {
            type: String
        },
        previousRoleName: {
            type: String
        },
        previousUserId: {
            type: String
        },
        previousUserName: {
            type: String
        },
        drugId: {
            type: String
        },
        DD_SUBSTANCE_NAME: {
            type: String
        },
        DD_SUBSTANCE_CD: {
            type: String
        },
        status_dt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        status: {
            type: String,
            default: () => { return 'ASSIGNED' }
        },
        user_assigned_table_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        drug_mono_id: {
            type: mongoose.Schema.Types.ObjectId
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

//section-comments-history
const _sections_comment_history = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        referenceType: {
            type: String
        },
        referenceId: {                      //referenceId means drugId 
            type: String
        },
        userId: {
            type: String
        },
        userName: {
            type: String
        },
        roleId: {
            type: String
        },
        roleName: {
            type: String
        },
        drug_section_id: {
            type: String
        },
        sectionName: {
            type: String
        },
        section_comment: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                comment_desc: {
                    type: String
                },
                profilePic: {
                    type: String
                },
                date:{
                    type:String
                },
                userName:{
                    type:String
                },
                roleName:{
                    type:String
                }
            }
        ],
        sections_table_id: {
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
    }
])

/**sections content types */
const _section_content_type = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        S_no: {
            type: Number
        },
        content_type_desc: {
            type: String
        }


    }
])

/**section types */
const _section_types = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        S_no: {
            type: Number
        },
        section_type_desc: {
            type: String
        }

    }
])

/**only generete _id */
const _idgenerates = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        }
    }
])

//////////////// masters /////////////////
/**uom schema */
const _uom = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        UOM_CD: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        UOM_L0_CODE: {
            type: String
        },
        UOM_L0_NAME: {
            type: String
        },
        UOM_L1_CODE: {
            type: String
        },
        UOM_L1_NAME: {
            type: String
        },
        UOM_L2_CODE: {
            type: String
        },
        UOM_L2_NAME: {
            type: String
        },
        UOM_L3_CODE: {
            type: String
        },
        UOM_L3_NAME: {
            type: String
        },
        UOM_L4_CODE: {
            type: String
        },
        UOM_L4_NAME: {
            type: String
        },
        UOM_L5_CODE: {
            type: String
        },
        UOM_L5_NAME: {
            type: String
        },
        UOM_ALL_CODE: {
            type: String
        },
        UOM_ALL_NAME: {
            type: String
        },
        DISPLAY_NAME: {
            type: String
        },
        ALTERNATIVE_NAME: {
            type: String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        session_id: {
            type: String
        },
        REMARKS: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])

/*  nummber schema */
const _numbers = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    NUMBER_CD: {
        type: String,
        //  required:true
    },
    NUM_L1_CODE: {
        type: String
    },
    NUM_L1_NAME: {
        type: String
    },
    NUM_L2_CODE: {
        type: String
    },
    NUM_L2_NAME: {
        type: String
    },
    NUM_ALL_CODE: {
        type: String
    },
    NUM_ALL_NAME: {
        type: String
    },
    DISPLAY_NAME: {
        type: String
    },
    REMARKS: {
        type: String
    },
    session_id: {
        type: String
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
                type: String,
                //  required: true
            },
            revNo: {
                type: Number,
                // required: true
            },
        }
    ]
}
])

/**intended sites  */
const _intendedSites = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        INTENDED_SITE_CD: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        IS_L1_CODE: {
            type: String
        },
        IS_L1_NAME: {
            type: String
        },
        IS_L2_CODE: {
            type: String
        },
        IS_L2_NAME: {
            type: String
        },
        IS_L3_CODE: {
            type: String
        },
        IS_L3_NAME: {
            type: String
        },
        IS_ALL_CODE: {
            type: String
        },
        IS_ALL_NAME: {
            type: String
        },
        DISPLAY_NAME: {
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
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                }
            }
        ]
    }
])

/**route Of Administration */
const _routeOfAdministration = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        ROUTE_OF_ADMINISTRATION_CD: {
            type: String
        },
        ROA_L1_CODE: {
            type: String
        },
        ROA_L1_NAME: {
            type: String
        },
        ROA_L2_CODE: {
            type: String
        },
        ROA_L2_NAME: {
            type: String
        },
        ROA_ALL_CODE: {
            type: String
        },
        ROA_ALL_NAME: {
            type: String
        },
        DISPLAY_NAME: {
            type: String
        },
        REMARKS: {
            type: String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        session_id: {
            type: String
        },
        audit:{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true
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
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])


const _whoatc = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        UNIQUE_CODE_ATC:{
            type:String,
            required:true
        },
        recStatus: {    
            type: Boolean,
            default: true
        },
        NO:{
            type:Number
        },
        SIZE:{
            type:Number
        },
        FL_CD:{
            type:String
        },
        FL_NAME:{
            type:String
        },
        SL_CD:{
            type:String
        },
        SL_NAME:{
            type:String
        },
        TL_CD:{
            type:String
        },
        TL_NAME:{
            type:String
        },
        FTL_CD:{
            type:String
        },
        FTL_NAME:{
            type:String
        },
        ATC_CODE:{
            type:String
        },
        ATC_LEVEL_NAME:{
            type:String
        },
        DDD:{
            type: mongoose.Schema.Types.Decimal128
        },
        UNIT:{
            type:String
        },
        ADM_R:{
            type:String
        },
        COMMENT:{
            type:String
        },
        CLASS_TYPE:{
            type:String
        },
        UNII_CODE:{
            type:String
        },
        UNII_NAME:{
            type:String
        },
        SNOMED:{
            type:String
        },
        SNOMED_NAME:{
            type:String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        REMARKS:{
            type:String
        },
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])

/**INN schema */
const _inn = new mongoose.Schema([
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
        UNII:{
            type:String
        },
        PT:{
            type:String
        },
        INN_ID:{
            type:String
        },
        INN_NAME:{
            type:String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        REMARKS:{
            type:String
        },
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])

/**release master */
const _release = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        DRUG_RELEASE_CD:{
            type:String,
           // required:true,
           // auto:true
        },        
        recStatus: {    
            type: Boolean,
            default: true
        },
        RL_L1_CODE:{
            type:String
        },
        RL_L1_NAME:{
            type:String
        },
        RL_L2_CODE:{
            type:String
        },
        RL_L2_NAME:{
            type:String
        },
        RL_L3_CODE:{
            type:String
        },
        RL_L3_NAME:{
            type:String
        },
        RL_L4_CODE:{
            type:String
        },
        RL_L4_NAME:{
            type:String
        },
        RL_ALL_CODE:{
            type:String
        },
        RL_ALL_NAME:{
            type:String
        },
        DISPLAY_NAME:{
            type:String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        REMARKS:{
            type:String
        },
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])

/**unii master  */
const _unii = new mongoose.Schema([
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
        UNII:{
            type:String
        },
        PT:{
            type:String
        },
        RN:{
            type:String
        },
        EC:{
            type:String
        },
        NCIT:{
            type:String
        },
        RXCUI:{
            type:String
        },
        PUBCHEM:{
            type:String
        },
        ITIS:{
            type:String
        },
        NCBI:{
            type:String
        },
        PLANTS:{
            type:String
        },
        GRIN:{
            type:String
        },
        MPNS:{
            type:String
        },
        INN_ID:{
            type:String
        },
        USAN_ID:{
            type:String
        },
        MF:{
            type:String
        },
        INCHIKEY:{
            type:String
        },
        SMILES:{
            type:String
        },
        INGREDIENT_TYPE:{
            type:String
        },
        UUID:{
            type:String
        },
        SUBSTANCE_TYPE:{
            type:String
        },
        DAILYMED:{
            type:String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        REMARKS:{
            type:String
        },
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])
/**snowmed */
const _snowmed = new mongoose.Schema([
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
        IDENTIFIER_SUBSTANCE:{
            type:String
        },
        SUBSTANCE_NAME:{
            type:String
        },
        CAS_NUMBER:{
            type:String
        },
        UNII:{
            type:String
        },
        SUBSTANCE_DESRIPTION:{
            type:String
        },
        MOLECULAR_WEIGHT:{
            type:String
        },
        TOXICITY:{
            type:String
        },
        SMILE:{
            type:String
        },
        INCHI:{
            type:String
        },
        IUPAC_NAME:{
            type:String
        },
        MOLECULAR_FORMULA:{
            type:String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
        },
        REMARKS:{
            type:String
        },
        session_id: {
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
        },
        history: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                revTranId: {
                    type: String,
                    //  required: true
                },
                revNo: {
                    type: Number,
                    // required: true
                },
            }
        ]
    }
])

const _basic_dose_form= new mongoose.Schema([{
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    BASIC_DOSE_FORM_CD:{
        type:String,
        required:true
    },
    recStatus:{
        type:Boolean,
        default:true
    },
    DISPLAY_NAME:{
        type:String
    },
    BDF_L1_CODE:{
        type:String
    },
    BDF_L1_NAME:{
        type:String
    },
    BDF_L2_CODE:{
        type:String
    },
    BDF_L2_NAME:{
        type:String
    },
    BDF_L3_CODE:{
        type:String
    },
    BDF_L3_NAME:{
        type:String
    },
    BDF_ALL_CODE:{
        type:String
    },
    BDF_ALL_NAME:{
        type:String
    },
    IS_JSON:{
        type:String
    },
    DAM_JSON:{
        type:String
    },
    ROA_JSON:{
        type:String
    },
    RNS_JSON:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
     SESSION_ID:{
        type:String
    },
    audit:{
            "_id":{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()},
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
     history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
}])

const _dose_form_administration_method = new mongoose.Schema([
    {
        "_id":{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true
        },
        DOSE_FORM_ADMINISTRATION_METHOD_CD:{
            type:String,
            required:true
        },
        recStatus:
        {
            type:Boolean,
            default:true
        },
        DAM_METHOD_CODE:{
            type:String
        },
        DAM_METHOD_NAME:{
            type:String
        },
        DAM_ALL_CODE:{
            type:String
        },
        DAM_ALL_NAME:{
            type:String
        },
        DAM_L1_CODE:{
            type:String
        },    
        DAM_L1_NAME:{
            type:String
        },  
        DAM_L2_CODE:{
            type:String
        },    
        DAM_L2_NAME:{
            type:String
        },  
        DISPLAY_NAME:{
            type:String
        },    
        revNo:{
            type:Number,
            required:true,
            default:() =>{return 1}
        },
        REMARKS:{
            type:String
        },
        
            SESSION_ID:{
            TYPE:String
        },
        
            audit:{
                "_id":{
                    type:
                    mongoose.Schema.Types.ObjectId,
                    required:true,
                    auto:true,
    
                    },
                documentedById:String,
                documentedBy:String,
                documentedDt:{
                    type:String,
                    default:()=>{return new Date().toISOString()}
                },
                modifiedById:String,
                modifiedBy:String,
                modifieddt:{
                    Types:String
                }
    
            } ,
            history:[{
                "_id":{
                    type:
                    mongoose.Schema.Types.ObjectId,
                    required:true,
    
                },
                revTranId:{
                    type:String,
                    //required:true
                },
                revNo:{
                    type:Number,
                    //required:true
                },
            }
            ]                
    }
])

const _dd_substance= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DD_SUBSTANCE_CD:{
        type:String,
        required:true
    },
    recStatus:{
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_NAME:{
        type:String
    },
    DD_WHO_REF:{
        type:String
    },
    UNII:{
        type:String
    },
    UNII_NAME:{
        type:String
    },
    UNIQUE_CD_ATC:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    session_id: {
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
})


const _flavour= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    FLAVOUR_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    FDA_CODE:{
        type:String
    },
    FLAVOUR_NAME:{
        type:String
    },
    SYNONYM_1:{
        type:String
    },
    SYNONYM_1_CD:{
        type:String
    },
    SYNONYM_2:{
        type:String
    },
    SYNONYM_2_CD:{
        type:String
    },
    SYNONYM_3:{
        type:String
    },
    SYNONYM_3_CD:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _theraphy= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    THERAPY_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    THERAPY_NAME:{
        type:String
    },
    SYNONYM_1:{
        type:String
    },
    SYNONYM_1_CD:{
        type:String
    },
    SYNONYM_2:{
        type:String
    },
    SYNONYM_2_CD:{
        type:String
    },
    SYNONYM_3:{
        type:String
    },
    SYNONYM_3_CD:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _dd_substance_comb= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DD_SUBSTANCE_COMB_CD:{
        type:String,
        required:true
    },
    recStatus:{
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_COMB_NAME:{
        type:String
    },
    DD_SUBSTANCE_COMB_REF:{
        type:String
    },
    DD_SUBSTANCE_CD:{
        type:String
    },
    DD_SUBSTANCE_NAME:{
        type:String
    },
    DD_SUBSTANCE_REF:{
        type:String
    },
    DD_SUBSTANCE_COMB_REF_CODE:{
        type:String
    },
    UNII:{
        type:String
    },
    UNII_NAME:{
        type:String
    },
    UNIQUE_CODE_ATC:{
        type:String
    },
    IDENTIFIER:{
        type:String
    },
    SUBSTANCE_NAME:{
        type:String
    },
    FL1_CD:{
        type:String
    },
    FL1_NAME:{
        type:String
    },
    SL2_CD:{
        type:String
    },
    SL2_NAME:{
        type:String
    },
    TL3_CD:{
        type:String
    },
    TL3_NAME:{
        type:String
    },
    FTL4_CD:{
        type:String
    },
    FTL4_NAME:{
        type:String
    },
    ATCL5_CODE:{
        type:String
    },
    ATCL5_LEVEL_NAME:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
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
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _dose_form_map= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DOSE_FORM_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    IDENTIFIER:{
        type:String
    },
    BDF_NAME:{
        type:String
    },
    BDF_CODE:{
        type:String
    },
    IS_NAME:{
        type:String
    },
    IS_CODE:{
        type:String
    },
    DAM_NAME:{
        type:String
    },
    DAM_CODE:{
        type:String
    },
    ROA_NAME:{
        type:String
    },
    ROA_CODE:{
        type:String
    },
    RNS_NAME:{
        type:String
    },
    RNS_CODE:{
        type:String
    },
    DOSE_DEFAULT_NAME:{
        type:String
    },
    DOSE_DISPLAY_NAME:{
        type:String
    },
    ADDL_ATBR1:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _strength= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    STRENGTH_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    STRENGTH_NAME:{
        type:String
    },
    NUMERATOR_NUM_CD:{
        type:String
    },
    NUMERATOR_NUM_NAME:{
        type:String
    },
    NUMERATOR_UOM_CD:{
        type:String
    },
    NUMERATOR_UOM_NAME:{
        type:String
    },
    DENOMINATOR_NUM_CD:{
        type:String
    },
    DENOMINATOR_NUM_NAME:{
        type:String
    },
    DENOMINATOR_UOM_CD:{
        type:String
    },
    DENOMINATOR_UOM_NAME:{
        type:String
    },
    TYPE:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _dd_substance_comb_mapping= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DD_SUBSTANCE_CD:{
        type:String,
       // required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_NAME:{
        type:String
    },
    DD_SUBSTANCE_COMB_CD:{
        type:String
    },
    DD_SUBSTANCE_COMB_NAME:{
        type:String
    },
    DOSE_FORM_NAME:{
        type:String
    },
    DOSE_FORM_CD:{
        type:String
    },
    STRENGTH:{
        type:String
    },
    STRENGTH_CD:{
        type:String
    },
    DD_DRUG_MASTER_CD:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return  new Date().toISOString() },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _dd_drug_master= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DD_DRUG_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_COMB_CD:{
        type:String
    },
    DD_SUBSTANCE_COMB_NAME:{
        type:String
    },
    TYPE:{
        type:String
    },
    DRUG_CNT:{
        type:Number
    },
    DISPLAY_NAME:{
        type:String
    },
    IS_DEFAULT:{
        type:String
    },
    IS_ASSIGNED:{
        type:String
    },
    IS_MONOGRAPHY_REQUIRED:{
        type:String
    },
    PARENT_DRUG_ID:{
        type:String
    },
    PARENT_DRUG_CD:{
        type:String
    },
    DD_SUBSTANCE_CD:{
        type:String
    },
    DD_SUBSTANCE_NAME:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    audit:{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true,

            },
        documentedById:String,
        documentedBy:String,
        documentedDt:{
            type:String,
            default:()=>{return new Date().toISOString()
            },
        },
        modifiedById:String,
        modifiedBy:String,
        modifieddt:{
            Types:String
        }

    } ,
    history:[{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,

        },
        revTranId:{
            type:String,
            //required:true
        },
        revNo:{
            type:Number,
            //required:true
        },
    }
    ]
    
})

const _brand= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    BRAND_MASTER_ID:{
        type:Number
    },
    BRAND_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    BRAND_NAME:{
        type:String
    },
    IS_PARENT_BRAND:{
        type:String
    },
    PARENT_BRAND:{
        type:String
    },
    PARENT_BRAND_CD:{
        type:String
    },
    CDCI_CODE:{
        type:String
    },
    CIMS_CODE:{
        type:String
    },
    CODE_2:{
        type:String
    },
    BRAND_EXTENSION_CD:{
        type:String
    },
    BRAND_EXTENSION_NAME:{
        type:String
    },
    SYNONYM_1:{
        type:String
    },
    SYNONYM_1_CD:{
        type:String
    },
    SYNONYM_2:{
        type:String
    },
    SYNONYM_2_CD:{
        type:String
    },
    DETAILING:{
        type:String
    },
    BRAND_DISPLAY_NAME:{
        type:String
    },
    BRAND_DISPLAY_CD:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
    audit:{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true,

            },
        documentedById:String,
        documentedBy:String,
        documentedDt:{
            type:String,
            default:()=>{return  new Date().toISOString() },
        },
        modifiedById:String,
        modifiedBy:String,
        modifieddt:{
            Types:String
        }

    } ,
    history:[{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,

        },
        revTranId:{
            type:String,
            //required:true
        },
        revNo:{
            type:Number,
            //required:true
        },
    }
    ]
})


const _dd_product_master= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DD_PRODUCT_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_COMB_CD:{
        type:String
    },
    DD_SUBSTANCE_COMB_NAME:{
        type:String
    },
    STRENGTH_CD:{
        type:String
    },
    STRENGTH:{
        type:String
    },
    VOLUME_CD:{
        type:String
    },
    VOLUME:{
        type:String
    },
    RELEASE_CD:{
        type:String
    },
    RELEASE:{
        type:String
    },
    DOSAGE_FORM_CD:{
        type:String
    },
    DOSAGE_FORM:{
        type:String
    },
    BDF_CD:{
        type:String
    },
    BDF_NAME:{
        type:String
    },
    IS_CD:{
        type:String
    },
    IS_NAME:{
        type:String
    },
    DAM_CD:{
        type:String
    },
    DAM_NAME:{
        type:String
    },
    ROA_CD:{
        type:String
    },
    ROA_NAME:{
        type:String
    },
    RNS_CD:{
        type:String
    },
    RNS_NAME:{
        type:String
    },
    DRUG_CLASS_CD:{
        type:String
    },
    DRUG_CLASS:{
        type:String
    },
    STRING_1_CD:{
        type:String
    },
    STRING_1:{
        type:String
    },
    STRING_2_CD:{
        type:String
    },
    STRING_2:{
        type:String
    },
    STRING_2_XML:{
        type:String
    },
    STRING_3_CD:{
        type:String
    },
    STRING_3:{
        type:String
    },
    STRING_3_XML:{
        type:String
    },
    DISPLAY_NAME_CD:{
        type:String
    },
    DISPLAY_NAME:{
        type:String
    },
    DISPLAY_NAME_XML:{
        type:String
    },
    DRUG_TYPE:{
        type:String
    },
    SOURCE_DATA:{
        type:String
    },
    SOURCE_DATA1:{
        type:String
    },
    BRAND_PRODUCT_MAP_CD:{
        type:String
    },
    IS_IMG:{
        type:String
    },
    DD_DRUG_MASTER_CD:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _disease_master = new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    DISEASE_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DISEASE_MASTER_NAME:{
        type:String,
        required:true
    },
    REFERENCE_ID1:{
        type:String
    },
    REFERENCE_NAME1:{
        type:String
    },
    REFERENCE_ID2:{
        type:String
    },
    REFERENCE_NAME2:{
        type:String
    },
    TYPE:{
        type:String
    },
    SOURCE:{
        type:String
    },
    SOURCE_CD:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _food_master = new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    FOOD_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    FOOD_MASTER_NAME:{
        type:String,
        required:true
    },
    REFERENCE_ID1:{
        type:String
    },
    REFERENCE_NAME1:{
        type:String
    },
    REFERENCE_ID2:{
        type:String
    },
    REFERENCE_NAME2:{
        type:String
    },
    TYPE:{
        type:String
    },
    SOURCE:{
        type:String
    },
    SOURCE_CD:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _lab_test_master = new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    LAB_TEST_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    LAB_TEST_MASTER_NAME:{
        type:String,
        required:true
    },
    REFERENCE_ID1:{
        type:String
    },
    REFERENCE_NAME1:{
        type:String
    },
    REFERENCE_ID2:{
        type:String
    },
    REFERENCE_NAME2:{
        type:String
    },
    TYPE:{
        type:String
    },
    SOURCE:{
        type:String
    },
    SOURCE_CD:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _brand_product_mapping= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    BRAND_PRODUCT_MAP_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    PARENT_BRAND_CD:{
        type:String
    },
    PARENT_BRAND:{
        type:String
    },
    BRAND_CD:{
        type:String
    },
    BRAND_NAME:{
        type:String
    },
    BRAND_EXTENSION_CD:{
        type:String
    },
    BRAND_EXTENSION_NAME:{
        type:String
    },
    THERAPY_CD:{
        type:String
    },
    THERAPY_NAME:{
        type:String
    },
    FLAVOUR_CD:{
        type:String
    },
    FLAVOUR_NAME:{
        type:String
    },
    STRENGTH_CD:{
        type:String
    },
    STRENGTH_NAME:{
        type:String
    },
    VOLUME_CD:{
        type:String
    },
    VOLUME_NAME:{
        type:String
    },
    PACKAGE_INFO_CD:{
        type:String
    },
    PACKAGE_INFO:{
        type:String
    },
    METRL_TYPE_CD:{
        type:String
    },
    METRL_TYPE_NAME:{
        type:String
    },
    DOSE_FORM_CD:{
        type:String
    },
    DOSE_FORM_NAME:{
        type:String
    },
    USE_CD:{
        type:String
    },
    USE_NAME:{
        type:String
    },
    STRG_CNDTN_CD:{
        type:String
    },
    STRG_CNDTN_NAME:{
        type:String
    },
    AGE_GEN_CD:{
        type:String
    },
    AGE_GEN_NAME:{
        type:String
    },
    COMPANY_CD:{
        type:String
    },
    COMPANY_NAME:{
        type:String
    },
    CDCI_CODE:{
        type:String
    },
    CDCI_NAME:{
        type:String
    },
    BRAND_STRING1_CD:{
        type:String
    },
    BRAND_STRING1:{
        type:String
    },
    BRAND_STRING1_XML:{
        type:String
    },
    BRAND_STRING2_CD:{
        type:String
    },
    BRAND_STRING2:{
        type:String
    },
    BRAND_STRING2_XML:{
        type:String
    },
    BRAND_STRING3_CD:{
        type:String
    },
    BRAND_STRING3:{
        type:String
    },
    BRAND_STRING3_XML:{
        type:String
    },
    IS_SUGAR_FREE:{
        type:String
    },
    STRING_3:{
        type:String
    },
    STRING_3_CD:{
        type:String
    },
    BRAND_CUSTOM:{
        type:String
    },
    BRAND_CUSTOM_CD:{
        type:String
    },
    BRAND_CUSTOM_XML:{
        type:String
    },
    BRAND_FINAL_CD:{
        type:String
    },
    BRAND_FINAL:{
        type:String
    },
    BRAND_FINAL_XML:{
        type:String
    },
    BRAND_DRUG_FINAL_CD:{
        type:String
    },
    BRAND_DRUG_FINAL:{
        type:String
    },
    BRAND_DRUG_XML:{
        type:String
    },
    IS_FORCEBLE_BRAND:{
        type:String
    },
    SOURCE_DATA:{
        type:String
    },
    BRAND_DISPLAY_NAME:{
        type:String
    },
    BRAND_DISPLAY_CD:{
        type:String
    },
    BRAND_MASTER_ID:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})


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
        ENTITY_ID:{
           type:Number
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
                ENTITY_VALUE_ID:{
                   type:Number
                },
                REFERENCEID:{
                   TYPE:Number
                },
                cd: {
                    type: String
                    // required: true
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
                    // required: true
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
])

const _company= new mongoose.Schema([{
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    COMPANY_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    COMPANY_NAME:{
        type:String
    },
    SEL_DIVISION:{
        type:String
    },
    DIVISION_NAME:{
        type:String
    },
    ADDRESS1:{
        type:String
    },
    ADDRESS2:{
        type:String
    },
    CITY:{
        type:String
    },
    STATE:{
        type:String
    },
    COUNTRY:{
        type:String
    },
    PIN_CODE:{
        type:String
    },
    CONTACT_PERSON:{
        type:String
    },
    DESIGNATION:{
        type:String
    },
    PHONE:{
        type:String
    },
    MOBILE:{
        type:String
    },
    FAX:{
        type:String
    },
    EMAIL:{
        type:String
    },
    COMPANY_CATEGORY:{
        type:String
    },
    COMPANY_TYPE:{
        type:String
    },
    FILES:{
        type:String
    },
    WEBSITE_NAME:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
}])


const _class_name = new mongoose.Schema([{
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    CLASS_NAME_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    CLASS_NAME:{
        type:String,
        required:true
    },
    CLASS_NAME_DESC:{
        type:String
    },
    REFERENCE_ID:{
        type:String
    },
    REFERENCE_NAME:{
        type:String
    },
    CLASS_SOURCE:{
        type:String
    },
    CLASS_SOURCE_CD:{
        type:String
    },
    CLASS_TYPE:{
        type:String
    },
    CLASS_TYPE_CD:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
}])

const _dd_substance_classifications = new mongoose.Schema([{
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    DD_SUBSTANCE_CLS_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DD_SUBSTANCE_CD:{
        type:String,
        required:true
    },
    DD_SUBSTANCE_NAME:{
        type:String
    },
    CLASS_NAME_CD:{
        type:String
    },
    CLASS_NAME:{
        type:String
    },
    CLASS_TYPE_CD:{
        type:String
    },
    CLASS_TYPE:{
        type:String
    },
    CLASS_SOURCE_CD:{
        type:String
    },
    CLASS_SOURCE:{
        type:String
    },
    PREFERABLE:{
        type:String
    },
    CMB_PREFERABLE:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
}])

const _source_master = new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    SRC_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    SRC_NAME:{
        type:String,
        required:true
    },
    SRC_DESC:{
        type:String
    },
    SRC_URL:{
        type:String
    },
    FILE_UPLOAD_URL:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()},
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const   _drug_int_parent= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    SRC_DRUG_CD:{
        type:String,
        required:true
    },
    SRC_DRUG_NAME:{
        type:String
    },
    DRUG_IN_PARENT_ID:{
        type:Number
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    IS_CD:{
        type:String
    },
    IS_NAME:{
        type:String
    },
    SRC_CD:{
        type:String
    },
    SRC_NAME:{
        type:String
    },
    SRC_URL:{
        type:String
    },
    INT_TYPE_ID:{
        type:String
    },
    INT_TYPE_NAME:{
        type:String
    },
    INT_ID:{
        type:Number
    },
    SEVERITY_ID:{
        type:String
    },
    SEVERITY_NAME:{
        type:String
    },
    INT_NAME:{
        type:String
    },
    IS_ASSIGNED:{
        type:String
    },
    INTERACTIONS:{
        type:String
    },
    REFERENCES:{
        type:String
    },
    STATUS:{
        type:String
       // default:() =>{return "NOT ACCEPTED"}
    },
    TYPE:{
        type:String
    },
    CLASS_NAME_CD:{
        type:String
    },
    CLASS_NAME:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _drug_int_child= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    SRC_DRUG_CD:{
        type:String,
        required:true
    },
    SRC_DRUG_NAME:{
        type:String
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    IS_CD:{
        type:String
    },
    IS_NAME:{
        type:String
    },
    INT_TYPE_ID:{
        type:String
    },
    INT_TYPE_NAME:{
        type:String
    },
    INT_ID:{
        type:Number
    },
    INT_NAME:{
        type:String
    },
    SEVERITY_ID:{
        type:String
    },
    SEVERITY_NAME:{
        type:String
    },
    SRC_ID:{
        type:String
    },
    SRC_NAME:{
        type:String
    },
    SRC_URL:{
        type:String
    },
    IS_ASSIGNED:{
        type:String
    },
    DRUG_IN_PARENT_ID:{
        type:Number
    },
    DRUG_IN_PARENT_MONGO_ID:{
        type:String
    },
    INTERACTIONS:{
        type:String
    },
    REFERENCES:{
        type:String
    },
    STATUS:{
        type:String,
        default:() =>{return "NOT ACCEPTED"}
    },
    TYPE:{
        type:String
    },
    CLASS_NAME_CD:{
        type:String
    },
    CLASS_NAME:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
   
            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _allergy_master= new mongoose.Schema([
    {
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    ALLERGY_MASTER_CD:{
        type:String
    },
    ALLERGY_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    ALLERGY_NAME:{
        type:String
    },
    ALLERGY_TYPE:{
        type:String
    },
    TYPE:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
    audit:{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true,

            },
        documentedById:String,
        documentedBy:String,
        documentedDt:{
            type:String,
            default:()=>{return new Date().toISOString()
            },
        },
        modifiedById:String,
        modifiedBy:String,
        modifieddt:{
            Types:String
        }

    } ,
    history:[{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,

        },
        revTranId:{
            type:String,
            //required:true
        },
        revNo:{
            type:Number,
            //required:true
        },
    }
    ]
}])

const _document = new mongoose.Schema([
    {
        "_id":{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true,
        },
        "DOC_ID":{
         type:Number
        },
        "DOC_NAME":{
            type:String
        },
        "DISCRIPTION":{
            type:String
        },
        "URL":{
            type:String
        },
        "KEYS":[
            {
                "_id":{
                    type:mongoose.Schema.Types.ObjectId,
                    required:true,
                    auto:true,
                },
                "label":{
                    type:String
                },
                "value":{
                    type:String
                }
            }
        ],
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().toISOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
   
            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
    }
])

const _sections_history = new mongoose.Schema([{
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    drug_monography_Code: {
        type: String
    },
    sections_table_id:{
        type:String
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    drugId:{
        type: String
    },
    DD_SUBSTANCE_CD: {
        type: String
    },
    SECTION_TYPE: {
        type: String
    },
    SECTION_NAME: {
        type: String
    },
    drug_section_id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    roleId: {
        type: String,
        required: true
    },
    roleName: {
        type: String
    },
    drug_content: {
        type: String
    },
    content_type: {
        type: String,
        required: true
    },
    version:{
        type:Number
    },
    audit:{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,
            auto:true,

            },
        documentedById:String,
        documentedBy:String,
        documentedDt:{
            type:String,
            default:()=>{return new Date().toISOString()
            },
        },
        modifiedById:String,
        modifiedBy:String,
        modifieddt:{
            Types:String
        }

    } ,
    history:[{
        "_id":{
            type:
            mongoose.Schema.Types.ObjectId,
            required:true,

        },
        revTranId:{
            type:String,
            //required:true
        },
        revNo:{
            type:Number,
            //required:true
        },
    }
    ]

}])


const _frequently_used_type_details = new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true
    },
    FRQ_ID:{
        type:String,
        required:true
    }, 
    recStatus:
    {
        type:Boolean,
        default:true
    },
    FRQ_SEARCH_NAME:{
        type:String,
        required:true
    },
    FRQ_SEARCH_CD:{
        type:String
    },
    FRQ_TYPE:{
        type:String
    },
    FRQ_SEARCH_TYPE:{
        type:String
    },
     revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new Date().tolSOString()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _icdmaster= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    ICD_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    ICD_CODE:{
        type:String
    },
    PARENT_CODE:{
        type:String
    },
    ICD_CONDITION_NAME:{
        type:String
    },
    ICD_CODE_STANDARD:{
        type:String
    },
    ICD_LEVEL:{
        type:String
    },
    NCI_ID:{
        type:String
    },
    UMLS_CUI_CD:{
        type:String
    },
    MESH_DUI_CD:{
        type:String
    },
    MESH_CUI_CD:{
        type:String
    },
    MESH_UNQ_ID:{
        type:String
    },
    DF_CD:{
        type:String
    },    
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new date().tolSOSring()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})


const _meshmaster= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    MESH_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    MESH_PREFERRED_TERM:{
        type:String
    },
    NCI_ID:{
        type:String
    },
    MESH_UNQ_ID:{
        type:String
    },
    MESH_DUI_CD:{
        type:String
    },
    MESH_CUI_CD:{
        type:String
    },
    MESH_DEFINATION:{
        type:String
    },
    TYPE:{
        type:String
    },   
    UMLS_CUI_CD:{
        type:String
    },
    DF_CD:{
        type:String
    },
    ICD_CD:{
        type:String
    },
    ICD_DESCRIPTION:{
        type:String
    }, 
    MESHTREE_ID:{
        type:String
    },   
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new date().tolSOSring()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})



const _snowmeddiseasemaster= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    SNOWMED_DS_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DF_CD:{
        type:String
    },
    DISEASE_NAME:{
        type:String
    },
    PARENTHESIS:{
        type:String
    },
    MAP_RANK:{
        type:String
    },
    NCI_ID:{
        type:String
    },
    ICD_CD:{
        type:String
    },
    ICD_CONDITION_NAME:{
        type:String
    },
    MESH_UNQ_ID:{
        type:String
    },   
    MESH_DUI_CD:{
        type:String
    },
    MESH_CUI_CD:{
        type:String
    },
    UMLS_CUI_CD:{
        type:String
    },   
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new date().tolSOSring()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})


const _umlsmaster= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    UMLS_MASTER_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    UMLS_CUI_CD:{
        type:String
    },
    UMLS_PREFERRED_TERM:{
        type:String
    },
    SEMANTIC_TYPE:{
        type:String
    },
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new date().tolSOSring()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})

const _diseasemapping= new mongoose.Schema({
    "_id":{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        auto:true,
    },
    DISEASE_MAP_CD:{
        type:String,
        required:true
    },
    recStatus:
    {
        type:Boolean,
        default:true
    },
    DISEASE_PREFERRED_TERM:{
        type:String
    },
    ICD_CODE:{
        type:String
    },
    REFERENCE_ID:{
        type:String
    },
    REFERENCE_SOURCE:{
        type:String
    },  
    NCI_ID:{
        type:String
    },     
    revNo:{
        type:Number,
        required:true,
        default:() =>{return 1}
    },
    REMARKS:{
        type:String
    },
    
        SESSION_ID:{
        TYPE:String
    },
    
        audit:{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,
                auto:true,

                },
            documentedById:String,
            documentedBy:String,
            documentedDt:{
                type:String,
                default:()=>{return new date().tolSOSring()
                },
            },
            modifiedById:String,
            modifiedBy:String,
            modifieddt:{
                Types:String
            }

        } ,
        history:[{
            "_id":{
                type:
                mongoose.Schema.Types.ObjectId,
                required:true,

            },
            revTranId:{
                type:String,
                //required:true
            },
            revNo:{
                type:Number,
                //required:true
            },
        }
        ]
})



_whoatc.set('toJSON', {
    transform: (doc, ret) => {
        ret.DDD = parseFloat(ret.DDD);
        return ret;
    },
});

module.exports = [
    { "coll": 'levels', "schema": _levels, "db": "monography" },
    { "coll": 'roles', "schema": _roles, "db": "monography" },
    { "coll": 'users', "schema": _users, "db": "monography" },
    { "coll": 'drugcreation', "schema": _drugCreation, "db": "monography" },
    { "coll": 'userAssign', "schema": _user_assign, "db": "monography" },
    { "coll": 'coreMasters', "schema": _coreMaster_data, "db": "monography" },
    { "coll": 'histories', "schema": _history, "db": "monography" },
    { "coll": 'templates', "schema": _template, "db": "monography" },
    { "coll": 'counters', "schema": _counter, "db": "monography" },
    { "coll": 'drugmonographyworkflowstatuses', "schema": _status, "db": "monography" },
    { "coll": 'drugmonographyworkflowtracking', "schema": _tracking, "db": "monography" },
    { "coll": 'sections', "schema": _sectionsData, "db": "monography" },
    { "coll": 'userSession', "schema": _userSession, "db": "monography" },
    { "coll": 'drugworkflow', "schema": _drug_flow, "db": "monography" },
    { "coll": 'comments', "schema": _sections_comment_history, "db": "monography" },
    { "coll": 'contenttypes', "schema": _section_content_type, "db": "monography" },
    { "coll": 'sectiontypes', "schema": _section_types, "db": "monography" },
    { "coll": 'idgenerates', "schema": _idgenerates, "db": "monography" },
    { "coll": 'uoms', "schema": _uom, "db": "monography" },
    { "coll": 'numbers', "schema": _numbers, "db": "monography" },
    { "coll": 'intendedsites', "schema": _intendedSites, "db": "monography" },
    { "coll": 'routeofadministrations', "schema": _routeOfAdministration, "db": "monography" },
    { "coll": 'whoatcs', "schema": _whoatc, "db": "monography" },
    { "coll": 'inns', "schema": _inn, "db": "monography" },
    { "coll": 'releases', "schema": _release, "db": "monography" },
    { "coll": 'uniis', "schema": _unii, "db": "monography" },
    { "coll": 'snowmeds', "schema": _snowmed, "db": "monography" },
    { "coll": 'bdf', "schema": _basic_dose_form, "db": "monography" },
    {"coll":'dam',"schema":_dose_form_administration_method,"db":"monography"},
    {"coll":'substance',"schema":_dd_substance,"db":"monography"},
    {"coll":'flavour',"schema":_flavour,"db":"monography"},
    {"coll":'theraphy',"schema":_theraphy,"db":"monography"},
    {"coll":'dd_substance_combination',"schema":_dd_substance_comb,"db":"monography"},   
    {"coll":'dose_form_map',"schema":_dose_form_map,"db":"monography"},
    {"coll":'strength',"schema":_strength,"db":"monography"},     
    {"coll":'dd_substance_comb_mapping',"schema":_dd_substance_comb_mapping,"db":"monography"},
    {"coll":'dd_drug_master',"schema":_dd_drug_master,"db":"monography"},
    {"coll":'brand',"schema":_brand,"db":"monography"},
    {"coll":'dd_product_master',"schema":_dd_product_master,"db":"monography"},    
    {"coll":'disease_master',"schema":_disease_master,"db":"monography"},
    {"coll":'food_master',"schema":_food_master,"db":"monography"},
    {"coll":'lab_test_master',"schema":_lab_test_master,"db":"monography"},
    {"coll":'brand_product_mapping',"schema":_brand_product_mapping,"db":"monography"},
    {"coll":'entity',"schema":_entity,"db":"monography"},
    {"coll":'company',"schema":_company,"db":"monography"},
    {"coll":'class_name',"schema":_class_name,"db":"monography"},
    {"coll":'dd_substance_classifications',"schema":_dd_substance_classifications,"db":"monography"},
    {"coll":'source_master',"schema":_source_master,"db":"monography"},
    {"coll":'drugparentinteraction',"schema":_drug_int_parent,"db":"monography"},
    {"coll":'drugchildinteraction',"schema":_drug_int_child,"db":"monography"},
    {"coll":'allergy_master',"schema":_allergy_master,"db":"monography"},
    {"coll":'document',"schema":_document,"db":"monography"},
    {"coll":'sections_history',"schema":_sections_history,"db":"monography"},
    {"coll":'frequently_used_type_details',"schema":_frequently_used_type_details,"db":"monography"},
    {"coll":'icdmaster',"schema":_icdmaster,"db":"monography"},
    {"coll":'meshmaster',"schema":_meshmaster,"db":"monography"},
    {"coll":'snowmeddiseasemaster',"schema":_snowmeddiseasemaster,"db":"monography"},
    {"coll":'umlsmaster',"schema":_umlsmaster,"db":"monography"},
    {"coll":'diseasemapping',"schema":_diseasemapping,"db":"monography"},    
];
    
   
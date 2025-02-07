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
        Role_Type: {
            type: String
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
        roleType: {
            type: String
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
        roleType: {
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
        logoPath: {
            type: String
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
                logoPath: {
                    type: String
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
        sequence: {
            type: Number
            // required: true
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
                date: {
                    type: String
                },
                userName: {
                    type: String
                },
                roleName: {
                    type: String
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
        roleType: {
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
                date: {
                    type: String
                },
                gender: {
                    type: String
                },
                userName: {
                    type: String
                },
                roleName: {
                    type: String
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
        ALTERNATIVE_NAME: {
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
        audit: {
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
        UNIQUE_CODE_ATC: {
            type: String,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        CUI:{
            type:String
        },
        NO: {
            type: Number
        },
        SIZE: {
            type: Number
        },
        FL_CD: {
            type: String
        },
        FL_NAME: {
            type: String
        },
        SL_CD: {
            type: String
        },
        SL_NAME: {
            type: String
        },
        TL_CD: {
            type: String
        },
        TL_NAME: {
            type: String
        },
        FTL_CD: {
            type: String
        },
        FTL_NAME: {
            type: String
        },
        ATC_CODE: {
            type: String
        },
        ATC_LEVEL_NAME: {
            type: String
        },
        DDD: {
            type: mongoose.Schema.Types.Decimal128
        },
        UNIT: {
            type: String
        },
        ADM_R: {
            type: String
        },
        COMMENT: {
            type: String
        },
        CLASS_TYPE: {
            type: String
        },
        UNII_CODE: {
            type: String
        },
        UNII_NAME: {
            type: String
        },
        SNOMED: {
            type: String
        },
        SNOMED_NAME: {
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
        UNII: {
            type: String
        },
        PT: {
            type: String
        },
        INN_ID: {
            type: String
        },
        INN_NAME: {
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
        DRUG_RELEASE_CD: {
            type: String,
            // required:true,
            // auto:true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        RL_L1_CODE: {
            type: String
        },
        RL_L1_NAME: {
            type: String
        },
        RL_L2_CODE: {
            type: String
        },
        RL_L2_NAME: {
            type: String
        },
        RL_L3_CODE: {
            type: String
        },
        RL_L3_NAME: {
            type: String
        },
        RL_L4_CODE: {
            type: String
        },
        RL_L4_NAME: {
            type: String
        },
        RL_ALL_CODE: {
            type: String
        },
        RL_ALL_NAME: {
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
        UNII: {
            type: String
        },
        PT: {
            type: String
        },
        RN: {
            type: String
        },
        EC: {
            type: String
        },
        NCIT: {
            type: String
        },
        RXCUI: {
            type: String
        },
        PUBCHEM: {
            type: String
        },
        ITIS: {
            type: String
        },
        NCBI: {
            type: String
        },
        PLANTS: {
            type: String
        },
        GRIN: {
            type: String
        },
        MPNS: {
            type: String
        },
        INN_ID: {
            type: String
        },
        USAN_ID: {
            type: String
        },
        MF: {
            type: String
        },
        INCHIKEY: {
            type: String
        },
        SMILES: {
            type: String
        },
        INGREDIENT_TYPE: {
            type: String
        },
        UUID: {
            type: String
        },
        SUBSTANCE_TYPE: {
            type: String
        },
        DAILYMED: {
            type: String
        },
        EPA_COMPTOX: {
            type: String
        },
        CATALOGUE_OF_LIFE: {
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
        IDENTIFIER_SUBSTANCE: {
            type: String
        },
        SUBSTANCE_NAME: {
            type: String
        },
        CUI:{
            type: String 
        },
        CAS_NUMBER: {
            type: String
        },
        UNII: {
            type: String
        },
        SUBSTANCE_DESRIPTION: {
            type: String
        },
        MOLECULAR_WEIGHT: {
            type: String
        },
        TOXICITY: {
            type: String
        },
        SMILE: {
            type: String
        },
        INCHI: {
            type: String
        },
        IUPAC_NAME: {
            type: String
        },
        MOLECULAR_FORMULA: {
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
                },
            }
        ]
    }
])

const _basic_dose_form = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    BASIC_DOSE_FORM_CD: {
        type: String,
        required: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    DISPLAY_NAME: {
        type: String
    },
    BDF_L1_CODE: {
        type: String
    },
    BDF_L1_NAME: {
        type: String
    },
    BDF_L2_CODE: {
        type: String
    },
    BDF_L2_NAME: {
        type: String
    },
    BDF_L3_CODE: {
        type: String
    },
    BDF_L3_NAME: {
        type: String
    },
    BDF_ALL_CODE: {
        type: String
    },
    BDF_ALL_NAME: {
        type: String
    },
    IS_JSON: {
        type: String
    },
    DAM_JSON: {
        type: String
    },
    ROA_JSON: {
        type: String
    },
    RNS_JSON: {
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
}])

const _dose_form_administration_method = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        DOSE_FORM_ADMINISTRATION_METHOD_CD: {
            type: String,
            required: true
        },
        recStatus:
        {
            type: Boolean,
            default: true
        },
        DAM_METHOD_CODE: {
            type: String
        },
        DAM_METHOD_NAME: {
            type: String
        },
        DAM_ALL_CODE: {
            type: String
        },
        DAM_ALL_NAME: {
            type: String
        },
        DAM_L1_CODE: {
            type: String
        },
        DAM_L1_NAME: {
            type: String
        },
        DAM_L2_CODE: {
            type: String
        },
        DAM_L2_NAME: {
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

        SESSION_ID: {
            TYPE: String
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
                default: () => { return new Date().toISOString() }
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
    }
])

const _dd_substance = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_SUBSTANCE_CD: {
        type: String,
        required: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    DD_WHO_REF: {
        type: String
    },
    UNII: {
        type: String
    },
    UNII_NAME: {
        type: String
    },
    UNIQUE_CD_ATC: {
        type: String
    },
    CUI:{
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
                type: String
            },
            revNo: {
                type: Number
            }
        }
    ]
})
const _dd_substance_cui = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_SUBSTANCE_CD: {
        type: String,
        required: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    DD_WHO_REF: {
        type: String
    },
    UNII: {
        type: String
    },
    UNII_NAME: {
        type: String
    },
    UNIQUE_CD_ATC: {
        type: String
    },
    CUI:{
        type: String
    },
    CLASS_CHECK:{
        type: String
    },
    DISEASE_CHECK:{
        type:String
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
                type: String
            },
            revNo: {
                type: Number
            }
        }
    ]
})


const _flavour = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    FLAVOUR_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    FDA_CODE: {
        type: String
    },
    FLAVOUR_NAME: {
        type: String
    },
    SYNONYM_1: {
        type: String
    },
    SYNONYM_1_CD: {
        type: String
    },
    SYNONYM_2: {
        type: String
    },
    SYNONYM_2_CD: {
        type: String
    },
    SYNONYM_3: {
        type: String
    },
    SYNONYM_3_CD: {
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

const _theraphy = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    THERAPY_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    THERAPY_NAME: {
        type: String
    },
    SYNONYM_1: {
        type: String
    },
    SYNONYM_1_CD: {
        type: String
    },
    SYNONYM_2: {
        type: String
    },
    SYNONYM_2_CD: {
        type: String
    },
    SYNONYM_3: {
        type: String
    },
    SYNONYM_3_CD: {
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

const _dd_substance_comb = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_SUBSTANCE_COMB_CD: {
        type: String,
        required: true
    },
    recStatus: {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_COMB_NAME: {
        type: String
    },
    DD_SUBSTANCE_COMB_REF: {
        type: String
    },
    DD_SUBSTANCE_CD: {
        type: String
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    DD_SUBSTANCE_REF: {
        type: String
    },
    DD_SUBSTANCE_COMB_REF_CODE: {
        type: String
    },
    UNII: {
        type: String
    },
    UNII_NAME: {
        type: String
    },
    UNIQUE_CODE_ATC: {
        type: String
    },
    IDENTIFIER: {
        type: String
    },
    SUBSTANCE_NAME: {
        type: String
    },
    FL1_CD: {
        type: String
    },
    FL1_NAME: {
        type: String
    },
    SL2_CD: {
        type: String
    },
    SL2_NAME: {
        type: String
    },
    TL3_CD: {
        type: String
    },
    TL3_NAME: {
        type: String
    },
    FTL4_CD: {
        type: String
    },
    FTL4_NAME: {
        type: String
    },
    ATCL5_CODE: {
        type: String
    },
    ATCL5_LEVEL_NAME: {
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

const _dose_form_map = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DOSE_FORM_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    IDENTIFIER: {
        type: String
    },
    BDF_NAME: {
        type: String
    },
    BDF_CODE: {
        type: String
    },
    IS_NAME: {
        type: String
    },
    IS_CODE: {
        type: String
    },
    DAM_NAME: {
        type: String
    },
    DAM_CODE: {
        type: String
    },
    ROA_NAME: {
        type: String
    },
    ROA_CODE: {
        type: String
    },
    RNS_NAME: {
        type: String
    },
    RNS_CODE: {
        type: String
    },
    DOSE_DEFAULT_NAME: {
        type: String
    },
    DOSE_DISPLAY_NAME: {
        type: String
    },
    ADDL_ATBR1: {
        type: String
    },
    ROA_NAMEARRAY: [{
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        ROA_CODE: {
            type: String
        },
        DISPLAY_NAME: {
            type: String
        }
    }],
    SOURCE_DATA: {
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

const _strength = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    STRENGTH_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    STRENGTH_NAME: {
        type: String
    },
    NUMERATOR_NUM_CD: {
        type: String
    },
    NUMERATOR_NUM_NAME: {
        type: String
    },
    NUMERATOR_UOM_CD: {
        type: String
    },
    NUMERATOR_UOM_NAME: {
        type: String
    },
    DENOMINATOR_NUM_CD: {
        type: String
    },
    DENOMINATOR_NUM_NAME: {
        type: String
    },
    DENOMINATOR_UOM_CD: {
        type: String
    },
    DENOMINATOR_UOM_NAME: {
        type: String
    },
    TYPE: {
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

const _dd_substance_comb_mapping = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_SUBSTANCE_CD: {
        type: String,
        // required:true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    DD_SUBSTANCE_COMB_CD: {
        type: String
    },
    DD_SUBSTANCE_COMB_NAME: {
        type: String
    },
    DOSE_FORM_NAME: {
        type: String
    },
    DOSE_FORM_CD: {
        type: String
    },
    STRENGTH: {
        type: String
    },
    STRENGTH_CD: {
        type: String
    },
    DD_DRUG_MASTER_CD: {
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
            default: () => { return new Date().toISOString() },
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

const _dd_drug_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_DRUG_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_COMB_CD: {
        type: String
    },
    DD_SUBSTANCE_COMB_NAME: {
        type: String
    },
    TYPE: {
        type: String
    },
    DRUG_CNT: {
        type: Number
    },
    DISPLAY_NAME: {
        type: String
    },
    IS_DEFAULT: {
        type: String
    },
    IS_ASSIGNED: {
        type: String
    },
    IS_MONOGRAPHY_REQUIRED: {
        type: String
    },
    PARENT_DRUG_ID: {
        type: String
    },
    PARENT_DRUG_CD: {
        type: String
    },
    DD_SUBSTANCE_CD: {
        type: String
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    BASIC_STRENGTH: {
        type: String
    },
    STRENGTH_CD: {
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

const _brand = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    BRAND_MASTER_ID: {
        type: Number
    },
    BRAND_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    BRAND_NAME: {
        type: String
    },
    IS_PARENT_BRAND: {
        type: Boolean
    },
    PARENT_BRAND: {
        type: String
    },
    PARENT_BRAND_CD: {
        type: String
    },
    CDCI_CODE: {
        type: String
    },
    CIMS_CODE: {
        type: String
    },
    CODE_2: {
        type: String
    },
    BRAND_EXTENSION_CD: {
        type: String
    },
    BRAND_EXTENSION_NAME: {
        type: String
    },
    SYNONYM_1: {
        type: String
    },
    SYNONYM_1_CD: {
        type: String
    },
    SYNONYM_2: {
        type: String
    },
    SYNONYM_2_CD: {
        type: String
    },
    DETAILING: {
        type: String
    },
    BRAND_DISPLAY_NAME: {
        type: String
    },
    BRAND_DISPLAY_CD: {
        type: String
    },
    fileUploadPaths: [
        {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true
            },
            imagePath: {
                type: String
            }
        }
    ],
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
            default: () => { return new Date().toISOString() },
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


const _dd_product_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DD_PRODUCT_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_COMB_CD: {
        type: String
    },
    DD_SUBSTANCE_COMB_NAME: {
        type: String
    },
    STRENGTH_CD: {
        type: String
    },
    STRENGTH: {
        type: String
    },
    VOLUME_CD: {
        type: String
    },
    VOLUME: {
        type: String
    },
    COUNTRY_NAME: {
        type: String
    },
    RELEASE_CD: {
        type: String
    },
    RELEASE: {
        type: String
    },
    DOSAGE_FORM_CD: {
        type: String
    },
    DOSAGE_FORM: {
        type: String
    },
    BDF_CD: {
        type: String
    },
    BDF_NAME: {
        type: String
    },
    IS_CD: {
        type: String
    },
    IS_NAME: {
        type: String
    },
    DAM_CD: {
        type: String
    },
    DAM_NAME: {
        type: String
    },
    ROA_CD: {
        type: String
    },
    ROA_NAME: {
        type: String
    },
    RNS_CD: {
        type: String
    },
    RNS_NAME: {
        type: String
    },
    DRUG_CLASS_CD: {
        type: String
    },
    DRUG_CLASS: {
        type: String
    },
    STRING_1_CD: {
        type: String
    },
    STRING_1: {
        type: String
    },
    STRING_2_CD: {
        type: String
    },
    STRING_2: {
        type: String
    },
    STRING_2_XML: {
        type: String
    },
    STRING_3_CD: {
        type: String
    },
    STRING_3: {
        type: String
    },
    STRING_3_XML: {
        type: String
    },
    DISPLAY_NAME_CD: {
        type: String
    },
    DISPLAY_NAME: {
        type: String
    },
    DISPLAY_NAME_XML: {
        type: String
    },
    DRUG_TYPE: {
        type: String
    },
    SOURCE_DATA: {
        type: String
    },
    SOURCE_DATA1: {
        type: String
    },
    BRAND_PRODUCT_MAP_CD: {
        type: String
    },
    IS_IMG: {
        type: String
    },
    DD_DRUG_MASTER_CD: {
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

const _disease_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    DISEASE_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DISEASE_MASTER_NAME: {
        type: String,
        required: true
    },
    REFERENCE_ID1: {
        type: String
    },
    REFERENCE_NAME1: {
        type: String
    },
    REFERENCE_ID2: {
        type: String
    },
    REFERENCE_NAME2: {
        type: String
    },
    TYPE: {
        type: String
    },
    SOURCE: {
        type: String
    },
    SOURCE_CD: {
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

const _food_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    FOOD_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    FOOD_MASTER_NAME: {
        type: String,
        required: true
    },
    REFERENCE_ID1: {
        type: String
    },
    REFERENCE_NAME1: {
        type: String
    },
    REFERENCE_ID2: {
        type: String
    },
    REFERENCE_NAME2: {
        type: String
    },
    TYPE: {
        type: String
    },
    SOURCE: {
        type: String
    },
    SOURCE_CD: {
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

const _lab_test_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    LAB_TEST_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    LAB_TEST_MASTER_NAME: {
        type: String,
        required: true
    },
    REFERENCE_ID1: {
        type: String
    },
    REFERENCE_NAME1: {
        type: String
    },
    REFERENCE_ID2: {
        type: String
    },
    REFERENCE_NAME2: {
        type: String
    },
    TYPE: {
        type: String
    },
    SOURCE: {
        type: String
    },
    SOURCE_CD: {
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

const _brand_product_mapping = new mongoose.Schema({
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
    CDCI_PRODUCT_IDENTIFIER:{
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
        ENTITY_ID: {
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
        child: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                ENTITY_VALUE_ID: {
                    type: Number
                },
                REFERENCEID: {
                    TYPE: Number
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
                reference:{
                    type: String
                },
                recStatus: {
                    type: Boolean,
                    default: true
                },
                child1: [
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        ENTITY_VALUE_ID: {
                            type: Number
                        },
                        REFERENCEID: {
                            TYPE: Number
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

const _company = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    COMPANY_CD: {
        type: String,
        required: true
    },
    CDCI_IDENTIFIER: {
        type: String
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    COMPANY_NAME: {
        type: String
    },
    SEL_DIVISION: {
        type: String
    },
    DIVISION_NAME: {
        type: String
    },
    ADDRESS1: {
        type: String
    },
    ADDRESS2: {
        type: String
    },
    CITY: {
        type: String
    },
    STATE: {
        type: String
    },
    COUNTRY: {
        type: String
    },
    PIN_CODE: {
        type: String
    },
    CONTACT_PERSON: {
        type: String
    },
    DESIGNATION: {
        type: String
    },
    PHONE: {
        type: String
    },
    MOBILE: {
        type: String
    },
    FAX: {
        type: String
    },
    EMAIL: {
        type: String
    },
    COMPANY_CATEGORY: {
        type: String
    },
    COMPANY_TYPE: {
        type: String
    },
    FILES: {
        type: String
    },
    WEBSITE_NAME: {
        type: String
    },
    COMPANY_ALTERNATIVE_NAME: {
        type: String
    },
    DIVISION_ALTERNATIVE_NAME: {
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
}])

  // interacaction_drug_content:[{
        //     any: mongoose.Schema.Types.Mixed
        // }],

const _class_name = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    CLASS_NAME_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    CLASS_NAME: {
        type: String,
        required: true
    },
    CLASS_NAME_DESC: {
        type: String
    },
    REFERENCE_ID: {
        type: String
    },
    REFERENCE_NAME: {
        type: String
    },
    CLASS_SOURCE: {
        type: String
    },
    CLASS_SOURCE_CD: {
        type: String
    },
    CLASS_TYPE: {
        type: String
    },
    CLASS_TYPE_CD: {
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
    PTC_TYPE: {
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
}])

const _class_name_cui = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        }

    }
],{strict:false})

const _dd_substance_classifications = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    DD_SUBSTANCE_CLS_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DD_SUBSTANCE_CD: {
        type: String,
        required: true
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    CLASS_NAME_CD: {
        type: String
    },
    CLASS_NAME: {
        type: String
    },
    CLASS_TYPE_CD: {
        type: String
    },
    CLASS_TYPE: {
        type: String
    },
    CLASS_SOURCE_CD: {
        type: String
    },
    CLASS_SOURCE: {
        type: String
    },
    PREFERABLE: {
        type: String
    },
    CMB_PREFERABLE: {
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
}])

const _dd_substance_classifications_cui = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    DD_SUBSTANCE_CLS_CD: {
        type: String,
        required: true
    },
    CUI1:{
      type:String
    },
    CUI:{
        type:String
    },
    CODE:{
        type:String
    },
    CUI2_RELA:{
        type:String
    },
    DD_SUBSTANCE_CD: {
        type: String,
        required: true
    },
    DD_SUBSTANCE_NAME: {
        type: String
    },
    CLASS_NAME:{
      type:String
    },
    CLASS_NAME_CD:{
      type:String
    },
    CLASS_TYPE:{
      type:String
    },
    CLASS_TYPE_CD:{
      type:String
    },
    CLASS_SOURCE:{
      type:String
    },
    CLASS_SOURCE_CD:{
      type:String
    },
    IS_PREFERED_SINGLE:{
      type:Boolean
    },
    IS_PREFERED_COMBINATION:{
      type:Boolean
    },
    recStatus:
    {
        type: Boolean,
        default: true
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
}])

const _source_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    SRC_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    SRC_NAME: {
        type: String,
        required: true
    },
    SRC_DESC: {
        type: String
    },
    SRC_URL: {
        type: String
    },
    FILE_UPLOAD_URL: {
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
            default: () => { return new Date().toISOString() },
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

const _drug_int_parent = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    STATUS_TYPE:{
        type:String
    },
    INTERACTION_CD:{
        type:String
    },
    POTENTIAL_MECHANISM:{
        type:String
    },
    Recommendations:{
        type:String
    },
    isApproved: {
        type: Boolean
    },
    CLASS_DRUGS_CD: {
        type: String
    },
    CLASS_DRUGS_NAMES: {
        type: String
    },
    SRC_DRUG_CD: {
        type: String,
        required: true
    },
    SRC_DRUG_NAME: {
        type: String
    },
    DRUG_IN_PARENT_ID: {
        type: Number
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    IS_CD: {
        type: String
    },
    IS_NAME: {
        type: String
    },
    SRC_CD: {
        type: String
    },
    SRC_NAME: {
        type: String
    },
    SRC_URL: {
        type: String
    },
    INT_TYPE_ID: {
        type: String
    },
    INT_TYPE_NAME: {
        type: String
    },
    INT_ID: {
        type: Number
    },
    SEVERITY_ID: {
        type: String
    },
    SEVERITY_NAME: {
        type: String
    },
    INT_NAME: {
        type: String
    },
    IS_ASSIGNED: {
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
        // default:() =>{return "NOT ACCEPTED"}
    },
    TYPE: {
        type: String
    },
    CLASS_NAME_CD: {
        type: String
    },
    CLASS_NAME: {
        type: String
    },
    USFDAPREGNANCYCATEGORYY: {
        type: String
    },
    EVIDENCEDATATYPE: {
        type: String
    },
    CROSSESPLACENTA: {
        type: String
    },
    DRUGEXCRETONINHUMANMILK: {
        type: String
    },
    USAGECATEGORY: {
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

const _drug_int_child = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    STATUS_TYPE:{
        type:String
    },
    INTERACTION_CD:{
        type:String
    },
    POTENTIAL_MECHANISM:{
        type:String
    },
    Recommendations:{
        type:String
    },
    SRC_DRUG_CD: {
        type: String,
        required: true
    },
    SRC_DRUG_NAME: {
        type: String
    },
    isApproved: {
        type: Boolean
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    IS_CD: {
        type: String
    },
    IS_NAME: {
        type: String
    },
    INT_TYPE_ID: {
        type: String
    },
    INT_TYPE_NAME: {
        type: String
    },
    INT_ID: {
        type: Number
    },
    INT_NAME: {
        type: String
    },
    SEVERITY_ID: {
        type: String
    },
    SEVERITY_NAME: {
        type: String
    },
    SRC_ID: {
        type: String
    },
    SRC_NAME: {
        type: String
    },
    SRC_URL: {
        type: String
    },
    IS_ASSIGNED: {
        type: String
    },
    DRUG_IN_PARENT_ID: {
        type: Number
    },
    DRUG_IN_PARENT_MONGO_ID: {
        type: String
    },
    INTERACTIONS: {
        type: String
    },
    REFERENCES: {
        type: String
    },
    STATUS: {
        type: String,
        default: () => { return "NOT ACCEPTED" }
    },
    TYPE: {
        type: String
    },
    CLASS_NAME_CD: {
        type: String
    },
    CLASS_NAME: {
        type: String
    },
    USFDAPREGNANCYCATEGORYY: {
        type: String
    },
    EVIDENCEDATATYPE: {
        type: String
    },
    CROSSESPLACENTA: {
        type: String
    },
    DRUGEXCRETONINHUMANMILK: {
        type: String
    },
    USAGECATEGORY: {
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

const _allergy_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        ALLERGY_MASTER_CD: {
            type: String
        },
        ALLERGY_CD: {
            type: String,
            required: true
        },
        recStatus:
        {
            type: Boolean,
            default: true
        },
        ALLERGY_NAME: {
            type: String
        },
        ALLERGY_TYPE: {
            type: String
        },
        TYPE: {
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
    }])

const _document = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        "DOC_ID": {
            type: Number
        },
        "DOC_NAME": {
            type: String
        },
        "DISCRIPTION": {
            type: String
        },
        "URL": {
            type: String
        },
        "KEYS": [
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
                }
            }
        ],
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
    }
])

const _sections_history = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    drug_monography_Code: {
        type: String
    },
    sections_table_id: {
        type: String
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    drugId: {
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
    plainText: {
        type: String
    },
    content_type: {
        type: String,
        required: true
    },
    version: {
        type: Number
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

}])

const _frequently_used_type_details = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    FRQ_ID: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    FRQ_SEARCH_NAME: {
        type: String,
        required: true
    },
    FRQ_SEARCH_CD: {
        type: String
    },
    FRQ_TYPE: {
        type: String
    },
    FRQ_SEARCH_TYPE: {
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
                return new Date().tolSOString()
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

const _icdmaster = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    ICD_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    ICD_CODE: {
        type: String
    },
    PARENT_CODE: {
        type: String
    },
    ICD_CONDITION_NAME: {
        type: String
    },
    ICD_CODE_STANDARD: {
        type: String
    },
    ICD_LEVEL: {
        type: String
    },
    NCI_ID: {
        type: String
    },
    UMLS_CUI_CD: {
        type: String
    },
    MESH_DUI_CD: {
        type: String
    },
    MESH_CUI_CD: {
        type: String
    },
    MESH_UNQ_ID: {
        type: String
    },
    DF_CD: {
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
                return new date().tolSOSring()
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

const _meshmaster = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    MESH_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    MESH_PREFERRED_TERM: {
        type: String
    },
    NCI_ID: {
        type: String
    },
    MESH_UNQ_ID: {
        type: String
    },
    MESH_DUI_CD: {
        type: String
    },
    MESH_CUI_CD: {
        type: String
    },
    MESH_DEFINATION: {
        type: String
    },
    TYPE: {
        type: String
    },
    UMLS_CUI_CD: {
        type: String
    },
    DF_CD: {
        type: String
    },
    ICD_CD: {
        type: String
    },
    ICD_DESCRIPTION: {
        type: String
    },
    MESHTREE_ID: {
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
                return new date().tolSOSring()
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

const _snowmeddiseasemaster = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    SNOWMED_DS_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DF_CD: {
        type: String
    },
    DISEASE_NAME: {
        type: String
    },
    PARENTHESIS: {
        type: String
    },
    MAP_RANK: {
        type: String
    },
    NCI_ID: {
        type: String
    },
    ICD_CD: {
        type: String
    },
    ICD_CONDITION_NAME: {
        type: String
    },
    MESH_UNQ_ID: {
        type: String
    },
    MESH_DUI_CD: {
        type: String
    },
    MESH_CUI_CD: {
        type: String
    },
    UMLS_CUI_CD: {
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
                return new date().tolSOSring()
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

const _umlsmaster = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    UMLS_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    UMLS_CUI_CD: {
        type: String
    },
    UMLS_PREFERRED_TERM: {
        type: String
    },
    SEMANTIC_TYPE: {
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
                return new date().tolSOSring()
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

const _diseasemapping = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DISEASE_MAP_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DISEASE_NAME: {
        type: String
    },
    DISEASE_PREFERRED_TERM: {
        type: String
    },
    ICD_CODE: {
        type: String
    },
    REFERENCE_ID: {
        type: String
    },
    REFERENCE_SOURCE: {
        type: String
    },
    NCI_ID: {
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
                return new date().tolSOSring()
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

const _diseasemapping_cui = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DISEASE_MAP_CD: {
        type: String,
        //required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DISEASE_NAME: {
        type: String
    },
    DISEASE_CUI: {
        type: String
    },
    DISEASE_PREFERRED_TERM: {
        type: String
    },
    ICD_CODE: {
        type: String
    },
    ICD_NAME: {
        type: String
    },
    DISEASE_PARENT_CD: {
        type: String
    },
    REFERENCE_ID: {
        type: String
    },
    REFERENCE_SOURCE: {
        type: String
    },
    NCI_ID: {
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
}, { strict: false })


const _disease_map_with_substance = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      },
      CUI1:{                                                     //cui1 is consider as a substance 
        type:String
      },
      CUI1_NAME:{
        type:String
      },
      STR:{                                                     //get str name from diseaseMapping collection with comparing cui2_rela code
        type:String
      },
      RELA:{
        type:String
      },
      CUI2_RELA:{                                                //cui2_rela consider as a disease code
        type:String
      },
      SAB:{
        type:String
      },
      CUI:{
        type:String
      },
      CODE:{
        type:String
      },
      DD_SUBSTANCE_CD:{
          type:String
      },
      DD_SUBSTANCE_NAME:{
          type:String
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
},{strict:false})

const _disease_source_masters = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DISEASE_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DISEASE_CD: {
        type: String
    },
    DISEASE_NAME: {
        type: String
    },
    DISEASE_DESC: {
        type: String
    },
    NCI_ID: {
        type: String
    },
    DISEASE_DEFINATION: {
        type: String
    },
    DISEASE_CUI: {
        type: String
    },
    DISEASE_DUI: {
        type: String
    },
    DISEASE_PARENT_CD: {
        type: String
    },
    DISEASE_MASTER_TYPE: {
        type: String
    },
    DISEASE_MASTER_ID: {
        type: String
    },

    THIS_PARENTHESIS: {
        type: String
    },
    UMLS_CD: {
        type: String
    },
    UMLS_NAME: {
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


const _disease_source_masters_from_umls = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DISEASE_MASTER_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DISEASE_CD: {
        type: String
    },
    Version:{
        type:String
    },
    DISEASE_NAME: {
        type: String
    },
    DISEASE_DESC: {
        type: String
    },
    NCI_ID: {
        type: String
    },
    DISEASE_DEFINATION: {
        type: String
    },
    DISEASE_CUI: {
        type: String
    },
    DISEASE_MESH_CUI: {
        type: String
    },
    DISEASE_DUI: {
        type: String
    },
    DISEASE_PARENT_CD: {
        type: String
    },
    DISEASE_MASTER_TYPE: {
        type: String
    },
    DISEASE_MASTER_ID: {
        type: String
    },
    DISEASE_CHECK:{
        type: String
    },
    STY:{
        type: String
    },
    AUI:{
        type: String
    },
    CVF:{
        type: String
    },
    ISPREF:{
        type: String
    },
    LAT:{
        type: String
    },
    LUI:{
        type: String
    },
    SAUI:{
        type: String
    },
    SCUI:{
        type: String
    },
    SDUI:{
        type: String
    },
    SRL:{
        type: String
    },
    STT:{
        type: String
    },
    SUI:{
        type: String
    },
    TTY:{
        type: String
    },
    SUPPRESS:{
        type: String
    },
    TS:{
        type: String
    },
    ATUI:{
        type: String
    },
    DEF:{
        type: String
    },
    SATUI:{
        type: String
    },
    AUI1:{
        type: String
    },
    AUI2:{
        type: String
    },
    CUI1:{
        type: String
    },
    CUI2:{
        type: String
    },
    DIR:{
        type: String
    },
    REL:{
        type: String
    },
    RELA:{
        type: String
    },
    RG:{
        type: String
    },
    RUI:{
        type: String
    },
    SL:{
        type: String
    },
    SRUI:{
        type: String
    },
    STYPE1:{
        type: String
    },
    STYPE2:{
        type: String
    },
    STN:{
        type: String
    },
    TUI:{
        type: String
    },
    STR_AUI:{
        type: String
    },
    SNO:{
        type: String
    },
    RUI:{
        type: String
    },
    RUI:{
        type: String
    },
    THIS_PARENTHESIS: {
        type: String
    },
    UMLS_CD: {
        type: String
    },
    UMLS_NAME: {
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


const _his_item_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        DB_TYPE:{
            type:String
        },
        HIMS_STATUS:{
            type:String
        },
        IS_REQUIRED: {
            type: Boolean,
            default: true
        },
        Match_Type: {
            type: String
        },
        STRING_3: {
            type: String
        },
        COMPANYCD: {
            type: String
            // required:true
        },
        COMPANYNAME: {
            type: String
        },
        ITEMCD: {
            type: String
            // required:true
        },
        ITEMDESC: {
            type: String
            // required:true
        },
        ITEMLEVEL0: {
            type: String
            // required:true
        },
        ITEMLEVEL1CD: {
            type: String
            // required:true
        },
        ITEMLEVEL1DESC: {
            type: String
            // required:true
        },
        ITEMLEVEL2CD: {
            type: String
            // required:true
        },
        ITEMLEVEL2DESC: {
            type: String
            // required:true
        },
        ITEMLEVEL3CD: {
            type: String
            // required:true
        },
        ITEMLEVEL3DESC: {
            type: String
            // required:true
        },
        MANUFACTURERCD: {
            type: String
            // required:true
        },
        MANUFACTURERNAME: {
            type: String
            // required:true
        },
        DRUGSCHEDULE: {
            type: String
            // required:true
        },
        ISACTIVE: {
            type: String
            // required:true
        },
        CATEGORYCD: {
            type: String
            // required:true
        },
        CATEGORYNAME: {
            type: String
            // required:true
        },
        PURUOMCD: {
            type: String
            // required:true
        },
        PURUOMDESC: {
            type: String
            // required:true
        },
        ISSUOMCD: {
            type: String
            // required:true
        },
        ISSUOMDESC: {
            type: String
            // required:true
        },
        CONVERSIONFACTOR: {
            type: Number
            // required:true
        },
        SCRAPCD: {
            type: String
            // required:true
        },
        SCRAPCONFACTOR: {
            type: Number
            // required:true
        },
        SPECIFICATION: {
            type: String
            // required:true
        },
        CLASSIFICATION1: {
            type: String
            // required:true
        },
        CLASSIFICATION2: {
            type: String
            // required:true
        },
        CLASSIFICATION3: {
            type: String
            // required:true
        },
        CLASSIFICATION4: {
            type: String
            // required:true
        },
        CLASSIFICATION5: {
            type: String
            // required:true
        },
        DRUGDOSE: {
            type: String
            // required:true
        },
        DPURCTAX: {
            type: Number
            // required:true
        },
        DSALETAX: {
            type: Number
            // required:true
        },
        ISASSET: {
            type: String
            // required:true
        },
        USAGE: {
            type: String
            // required:true
        },
        ISREUSED: {
            type: String
            // required:true
        },
        REORDERITEM: {
            type: String
            // required:true
        },
        LEADTIMETYPE: {
            type: String
            // required:true
        },
        VENDORCD: {
            type: String
            // required:true
        },
        ITEMCONCINBILLING: {
            type: String
            // required:true
        },
        ISEXPDTREQ: {
            type: String
            // required:true
        },
        ISBATCHNOREQ: {
            type: String
            // required:true
        },
        CIMSTYPE: {
            type: String
            // required:true
        },
        CIMSID: {
            type: String
            // required:true
        },
        ABC_CLS: {
            type: String
            // required:true
        },
        HML_CLS: {
            type: String
            // required:true
        },
        LEADTIME: {
            type: Number
            // required:true
        },
        AUTOINDENTREQUIRED: {
            type: String
            // required:true
        },
        COLOR: {
            type: String
            // required:true
        },
        ISLOOKLIKE: {
            type: String
            // required:true
        },
        ISSOUNDLIKE: {
            type: String
            // required:true
        },
        ISNARCOTIC: {
            type: String
            // required:true
        },
        ISHIGHRISK: {
            type: String
            // required:true
        },
        MESSAGE: {
            type: String
            // required:true
        },
        MAINITEMCD: {
            type: String
            // required:true
        },
        WRAPPERSREQ: {
            type: String
            // required:true
        },
        ESRFORBILLING: {
            type: String
            // required:true
        },
        SALERATE: {
            type: Number
            // required:true
        },
        CONCTYPE: {
            type: String
            // required:true
        },
        SPECIALIZATIONCD: {
            type: String
            // required:true
        },
        ISFORMULARY: {
            type: String
            // required:true
        },
        USEDFOROP: {
            type: String
            // required:true
        },
        USEDFORIP: {
            type: String
            // required:true
        },
        USEDFOROT: {
            type: String
            // required:true
        },
        STORAGETYPE: {
            type: String
            // required:true
        },
        S1_CD: {
            type: String
            // required:true
        },
        S2_CD: {
            type: String
            // required:true
        },
        VERIFYBY: {
            type: String
            // required:true
        },
        VERIFYDT: {
            type: String,
            default: () => {
                return new Date().toISOString()
            }
            // required:true
        },
        CANCELLEDBY: {
            type: String
            // required:true
        },
        CANCELLEDDT: {
            type: String,
            default: () => {
                return new Date().toISOString()
            }
            // required:true
        },
        ISIMPORTED: {
            type: String
            // required:true
        },
        ISHAZARDOUS: {
            type: String
            // required:true
        },
        ISBILLABLE: {
            type: String
            // required:true
        },
        DEFAULTPOQTY: {
            type: Number
            // required:true
        },
        TEMPERATURE: {
            type: Number
            // required:true
        },
        STATUS: {
            type: String
            // required:true
        },
        TAXTYPE: {
            type: String
            // required:true
        },
        USEDFORLAB: {
            type: String
            // required:true
        },
        POTERMS: {
            type: String
            // required:true
        },
        REQCONTRACT: {
            type: String
            // required:true
        },
        MARGINFLAG: {
            type: String
            // required:true
        },
        ALLOWDECIMALQTY: {
            type: String
            // required:true
        },
        SHIFTHANDOVER: {
            type: String
            // required:true
        },
        LESSMARGINPERCENT: {
            type: Number
            // required:true
        },
        EXPIRYPROFILECD: {
            type: String
            // required:true
        },
        OTC: {
            type: String
            // required:true
        },
        DIRECTIONS: {
            type: String
            // required:true
        },
        SPECIFICATIONS: {
            type: String
            // required:true
        },
        HSN_SAC_CODE: {
            type: String
            // required:true
        },
        CGST_TAX: {
            type: Number
            // required:true
        },
        SGST_TAX: {
            type: Number
            // required:true
        },
        IGST_TAX: {
            type: Number
            // required:true
        },
        CESS_PER: {
            type: Number
            // required:true
        },
        ISNON_RETURNABLE_ITEM: {
            type: String
            // required:true
        },
        ISTAXEXCEMPTED: {
            type: String
            // required:true
        },
        IS_RESERVE_ANTIBIOTIC: {
            type: String
            // required:true
        },
        ISCRITICAL: {
            type: String
            // required:true
        },
        ISDRUG: {
            type: String
            // required:true
        },
        VENDOR_PACK: {
            type: Number
            // required:true
        },
        IS_MAR_REQ: {
            type: String
            // required:true
        },
        CC_PER: {
            type: Number
            // required:true
        },
        MARKETEDBYCD: {
            type: String
            // required:true
        },
        DPOC: {
            type: String
            // required:true
        },
        DPOCPURCRATE: {
            type: Number
            // required:true
        },
        DPOCSALERATE: {
            type: Number
            // required:true
        },
        FIXED_REORDER_QTY: {
            type: Number
            // required:true
        },
        MIN_PO_QTY: {
            type: Number
            // required:true
        },
        DRUG_DELIVERY_MECHANISM: {
            type: String
            // required:true
        },
        TYPE_OF_ITEM: {
            type: String
            // required:true
        },
        MANFDIVISIONCD: {
            type: String
            // required:true
        },
        MAN_DIVISIONDESC: {
            type: String
            // required:true
        },
        NO_OF_TIMES_USED: {
            type: Number
            // required:true
        },
        IS_NON_RETURNABLE_ITEM_PURC: {
            type: String
            // required:true
        },
        ACCSERVICEGROUPCD: {
            type: String
            // required:true
        },
        SALERATE_MARGIN: {
            type: String
            // required:true
        },
        MARGIN: {
            type: Number
            // required:true
        },
        PROCESS_MODE: {
            type: String
            // required:true
        },
        LOCATIONCD: {
            type: String
        },
        LOCATIONNAME: {
            type: String
        },
        BRAND_PRODUCT_MAP_CD: {
            type: String,
            // required: true
        },
        BRAND_STRING2: {
            type: String
        },
        recStatus:
        {
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

    }
])

// const _drug_intended_search=new mongoose.Schema({
//     "_id": {
//         type:
//             mongoose.Schema.Types.ObjectId,
//         required: true,
//         auto: true,

//     },
//     DISPlAY_NAME:{
//         type:String
//     },
//     IS_CODE:{
//         type:String
//     },
//     MASTER_NAME:{
//         type:String
//     }
// })


//modules
//user_module_schema
const _modules = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    data:[
        {
            any: mongoose.Schema.Types.Mixed
        }
    ],
    // MODULE_NAME: {
    //     type: String
    // },
    // IS_SUB_MODULE: {
    //     type: String
    // },
    // ROUTER_LINK: {
    //     type: String
    // },
    // PARENT_ID: {
    //     type: String
    // },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
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

    }
},{strict:false})


//users_access_documents_schema
const _user_module_documents = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    DOC_NAME: {
        type: String
    },
    MODULE_ID: {
        type: String
    },
    MODULE_NAME: {
        type: String
    },
    SUB_MODULE_ID: {
        type: String
    },
    SUB_MODULE_NAME: {
        type: String
    },
    VISIBLE: {
        type: String
    },
    ICON: {
        type: String
    },
    COMMAND: {
        type: String
    },
    ROUTER_LINK: {
        type: String
    },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
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

    }

})


//role_doc_access_schema
const _role_doc_access = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    ROLE_ID: {
        type: String
    },
    ROLE_NAME: {
        type: String
    },
    DOCUEMENTS_MAP: [
        {
            "_id": {
                type:
                    mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true
            },
            MODULE_ID: {
                type: String
            },
            SUB_MODULE_ID: {
                type: String
            },
            DOC_ID: {
                type: String
            },
            DOC_NAME: {
                type: String
            },
            PERMISSIONS: {
                "_id": {
                    type:
                        mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                ADD: {
                    type: Boolean,
                    default: false
                },
                GET: {
                    type: Boolean,
                    default: false
                },
                DELETE: {
                    type: Boolean,
                    default: false
                },
                UPDATE: {
                    type: Boolean,
                    default: false

                },
                PRINT: {
                    type: Boolean,
                    default: false
                },
                EXPORT: {
                    type: Boolean,
                    default: false
                }
            },
        }
    ],
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
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

    }
})

const _uploadDocuments = new mongoose.Schema(
    {
        "_id": {
            type:
                mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        type: String,
        fileName: {
            type: String,
            // required: true
        },
        fileType: {
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
            type: String
        },
        recStatus:
        {
            type: Boolean,
            default: true
        },
        path: String,
        docMimeType: String,
        remarks: String,
        refId: String,
        masterName: String,
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
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
                //required:truer
            },
        }
        ]
    })

const _drug_intended_search = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,

    },
    DISPlAY_NAME: {
        type: String
    },
    IS_CODE: {
        type: String
    },
    MASTER_NAME: {
        type: String
    }
})

const _dd_mrconso_rela = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
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
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        revTranId: {
            type: String,
            //required:true
        },
        revNo: {
            type: Number,
            //required:truer
        },
    }
    ]
}, { strict: false });

const _spl_set_id = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
}, { strict: false })

const _umls_dd = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
}, { strict: false })

const _brand_dose_form_master = new mongoose.Schema({
    "_id": {
        type:
            mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,

    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    DOSE_FORM_CD: {
        type: String
    },
    DOSE_FORM_NAME: {
        type: String
    },
    ALTERNATIVE_NAME: {
        type: String,
    },
    ALTERNATIVE_CODE:{
        type: String
    },
    DESCRIPTION: {
        type: String
    },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
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

const _country_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    COUNTRY_CD: {
        type: String,
        required: true
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    COUNTRY_NAME: {
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
            default: () => { return new Date().toISOString() },
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

//synonymy master
const _synonymy_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        recStatus:
        {
            type: Boolean,
            default: true
        },
        SYNONYM_MASTER_CD: {
            type: String
        },
        SYNONYM_NAME: {
            type: String
        },
        SYNONYM_CD: {
            type: String
        },
        REFERENCE_NAME: {
            type: String
        },
        REFERENCE_ID: {
            type: String
        },
        SYNONYM_TYPE: {                                  //type of masterName
            type: String
        },
        REFERENCE_TYPE: {
            type: String
        },
        REFERENCE_URL: {
            type: String
        },
        SYNONYM_DESC: {
            type: String
        },
        revNo: {
            type: Number,
            required: true,
            default: () => { return 1 }
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
                default: () => { return new Date().toISOString() },
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

    }
])



const _country_state_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    country_cd: {
        type: String,
        required: true
    },
    country_name: {
        type: String
    },
    STATE_CD: {
        type: String
    },
    STATE_NAME: {
        type: String
    },
    CITY_CD: {
        type: String
    },
    CITY_NAME: {
        type: String
    },
    DISTRICT_CD: {
        type: String
    },
    DISTRICT_NAME: {
        type: String
    },
    AREA_CD: {
        type: String
    },
    AREA_NAME: {
        type: String
    },
    PINCODE: {
        type: String
    },
    LOCATION_NAME: {
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
            default: () => { return new Date().toISOString() },
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



const _brand_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    BRAND_CD: {
        type: String,
        required: true
    },
    BRAND_NAME: {
        type: String
    },
    recStatus:
    {
        type: Boolean,
        default: true
    },
    revNo: {
        type: Number,
        required: true,
        default: () => { return 1 }
    },
    REMARKS: {
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
            default: () => { return new Date().toISOString() },
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

const _parent_brand_master = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    PARENT_BRAND_CD: {
        type: String,
        required: true
    },
    PARENT_BRAND: {
        type: String
    },
    REMARKS: {
        type: String
    },
    recStatus:
    {
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
            type:
                mongoose.Schema.Types.ObjectId,
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


const _parent_brand_mapping = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    PARENT_BRAND_MAPPING_CD: {
        type: String,
        required: true
    },
    PARENT_BRAND_CD: {
        type: String,
        required: true
    },
    PARENT_BRAND: {
        type: String
    },
    BRAND_CD: {
        type: String,
        required: true
    },
    BRAND_NAME: {
        type: String
    },
    REMARKS: {
        type: String
    },
    recStatus:
    {
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
            type:
                mongoose.Schema.Types.ObjectId,
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

const _brand_extension = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    BRAND_EXTENSION_CD: {
        type: String,
        required: true
    },
    BRAND_EXTENSION_NAME: {
        type: String
    },
    REMARKS: {
        type: String
    },
    recStatus:
    {
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
            type:
                mongoose.Schema.Types.ObjectId,
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


const _brand_display_name = new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    // BRAND_MASTER_ID: {
    //     type: Number
    // },
    BRAND_DISPLAY_CD: {
        type: String,
        required: true
    },
    BRAND_DISPLAY_NAME: {
        type: String
    },
    IS_PARENT_BRAND: {
        type: Boolean
    },
    BRAND_EXTENSION_CD: {
        type: String,
    },
    BRAND_EXTENSION_NAME: {
        type: String
    },
    PARENT_BRAND_CD: {
        type: String,
        required: true
    },
    PARENT_BRAND: {
        type: String
    },
    BRAND_CD: {
        type: String,
        required: true
    },
    BRAND_NAME: {
        type: String
    },
    CDCI_IDENTIFIER: {
        type: String
    },
    REMARKS: {
        type: String
    },
    recStatus:
    {
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
            type:
                mongoose.Schema.Types.ObjectId,
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

//logs of inforamtion 
const _logInfo= new mongoose.Schema({
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    TYPE:{
        type:String
    },
    IP:{
        type:String
    },
    USER_AGENT:{
        type:String
    },
    METHOD:{
        type:String
    },
    PAYLOAD:{
        type:Object
    },
    ERROR:{
        type:Object
    },
    RESPONSE:[{
            any: mongoose.Schema.Types.Mixed
    }],
    ORG_ID:{
        type:String
    },
    LOC_ID:{
        type:String
    },
    HOST:{
        type:String
    },
    ORG_NAME:{
        type:String
    },
    LOC_NAME:{
        type:String
    },
    STOCK_POINT:{
        type:String
    },
    SOURCE:{
        type:String
    },
    CLIENT:{
        type:String
    },
    PAT_NAME:{
        type:String
    },
    UMR_NO:{
        type:String
    },
    AGE:{
        type:String
    },
    EMAIL:{
        type:String
    },
    PAGE_TYPE:{
        type:String
    },
    CONTACT_NUMBER:{
        type:String
    },
    USER_DESIGNATION:{
        type:String
    },
    USER_SPECIALIZATION:{
        type:String
    },
    USER_DEPARTMENT:{
        type:String
    },
    GENDER:{
        type:String
    },
    VISIT_TYPE:{
        type:String
    },
    VISIT_NO:{
        type:String
    },
    ORDER_NO:{
        type:Number
    },
    APPT_ID:{
        type:String
    },
    PRIMARY_DOCTOR:{
        type:String
    },
    patientInfo:{
        type:Object
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
            default: () => { return new Date().toISOString() },
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
},{strict:false})


_whoatc.set('toJSON', {
    transform: (doc, ret) => {
        ret.DDD = parseFloat(ret.DDD);
        return ret;
    },
});




let _dbWithCol = `monography`
module.exports = [
    { "coll": 'levels', "schema": _levels, "db": _dbWithCol },
    { "coll": 'roles', "schema": _roles, "db": _dbWithCol },
    { "coll": 'users', "schema": _users, "db": _dbWithCol },
    { "coll": 'drugcreation', "schema": _drugCreation, "db": _dbWithCol },
    { "coll": 'userAssign', "schema": _user_assign, "db": _dbWithCol },
    { "coll": 'coreMasters', "schema": _coreMaster_data, "db": _dbWithCol },
    { "coll": 'histories', "schema": _history, "db": _dbWithCol },
    { "coll": 'templates', "schema": _template, "db": _dbWithCol },
    { "coll": 'counters', "schema": _counter, "db": _dbWithCol },
    { "coll": 'drugmonographyworkflowstatuses', "schema": _status, "db": _dbWithCol },
    { "coll": 'drugmonographyworkflowtracking', "schema": _tracking, "db": _dbWithCol },
    { "coll": 'sections', "schema": _sectionsData, "db": _dbWithCol },
    { "coll": 'userSession', "schema": _userSession, "db": _dbWithCol },
    { "coll": 'drugworkflow', "schema": _drug_flow, "db": _dbWithCol },
    { "coll": 'comments', "schema": _sections_comment_history, "db": _dbWithCol },
    { "coll": 'contenttypes', "schema": _section_content_type, "db": _dbWithCol },
    { "coll": 'sectiontypes', "schema": _section_types, "db": _dbWithCol },
    { "coll": 'idgenerates', "schema": _idgenerates, "db": _dbWithCol },
    { "coll": 'uoms', "schema": _uom, "db": _dbWithCol },
    { "coll": 'numbers', "schema": _numbers, "db": _dbWithCol },
    { "coll": 'intendedsites', "schema": _intendedSites, "db": _dbWithCol },
    { "coll": 'routeofadministrations', "schema": _routeOfAdministration, "db": _dbWithCol },
    { "coll": 'whoatcs', "schema": _whoatc, "db": _dbWithCol },
    { "coll": 'inns', "schema": _inn, "db": _dbWithCol },
    { "coll": 'releases', "schema": _release, "db": _dbWithCol },
    { "coll": 'uniis', "schema": _unii, "db": _dbWithCol },
    { "coll": 'snowmeds', "schema": _snowmed, "db": _dbWithCol },
    { "coll": 'bdf', "schema": _basic_dose_form, "db": _dbWithCol },
    { "coll": 'dam', "schema": _dose_form_administration_method, "db": _dbWithCol },
    { "coll": 'substance', "schema": _dd_substance, "db": _dbWithCol },
    { "coll": 'substance_cui', "schema": _dd_substance_cui, "db": _dbWithCol },
    { "coll": 'flavour', "schema": _flavour, "db": _dbWithCol },
    { "coll": 'theraphy', "schema": _theraphy, "db": _dbWithCol },
    { "coll": 'dd_substance_combination', "schema": _dd_substance_comb, "db": _dbWithCol },
    { "coll": 'dose_form_map', "schema": _dose_form_map, "db": _dbWithCol },
    { "coll": 'strength', "schema": _strength, "db": _dbWithCol },
    { "coll": 'dd_substance_comb_mapping', "schema": _dd_substance_comb_mapping, "db": _dbWithCol },
    { "coll": 'dd_drug_master', "schema": _dd_drug_master, "db": _dbWithCol },
    { "coll": 'brand', "schema": _brand, "db": _dbWithCol },
    { "coll": 'dd_product_master', "schema": _dd_product_master, "db": _dbWithCol },
    { "coll": 'disease_master', "schema": _disease_master, "db": _dbWithCol },
    { "coll": 'food_master', "schema": _food_master, "db": _dbWithCol },
    { "coll": 'lab_test_master', "schema": _lab_test_master, "db": _dbWithCol },
    { "coll": 'brand_product_mapping', "schema": _brand_product_mapping, "db": _dbWithCol },
    { "coll": 'entity', "schema": _entity, "db": _dbWithCol },
    { "coll": 'company', "schema": _company, "db": _dbWithCol },
    { "coll": 'class_name', "schema": _class_name, "db": _dbWithCol },
    { "coll": 'class_name_cui', "schema": _class_name_cui, "db": _dbWithCol },
    { "coll": 'dd_substance_classifications', "schema": _dd_substance_classifications, "db": _dbWithCol },
    { "coll": 'dd_substance_classifications_cui', "schema": _dd_substance_classifications_cui, "db": _dbWithCol },
    { "coll": 'source_master', "schema": _source_master, "db": _dbWithCol },
    { "coll": 'drugparentinteraction', "schema": _drug_int_parent, "db": _dbWithCol },
    { "coll": 'drugchildinteraction', "schema": _drug_int_child, "db": _dbWithCol },
    { "coll": 'allergy_master', "schema": _allergy_master, "db": _dbWithCol },
    { "coll": 'document', "schema": _document, "db": _dbWithCol },
    { "coll": 'sections_history', "schema": _sections_history, "db": _dbWithCol },
    { "coll": 'frequently_used_type_details', "schema": _frequently_used_type_details, "db": _dbWithCol },
    { "coll": 'icdmaster', "schema": _icdmaster, "db": _dbWithCol },
    { "coll": 'meshmaster', "schema": _meshmaster, "db": _dbWithCol },
    { "coll": 'snowmeddiseasemaster', "schema": _snowmeddiseasemaster, "db": _dbWithCol },
    { "coll": 'umlsmaster', "schema": _umlsmaster, "db": _dbWithCol },
    { "coll": 'diseasemapping', "schema": _diseasemapping, "db": _dbWithCol },
    { "coll": 'diseasemapping_cui', "schema": _diseasemapping_cui, "db": _dbWithCol },
    { "coll": 'disease_map_with_substance', "schema": _disease_map_with_substance, "db": _dbWithCol },
    { "coll": 'disease_source_masters', "schema": _disease_source_masters, "db": _dbWithCol },
    { "coll": 'disease_source_masters_with_umls_dd', "schema": _disease_source_masters_from_umls, "db": _dbWithCol },
    { "coll": 'pharmacology_master', "schema": _his_item_master, "db": _dbWithCol },
    { "coll": 'drugintendedsite', "schema": _drug_intended_search, "db": _dbWithCol },
    { "coll": 'user_module', "schema": _modules, "db": _dbWithCol },
    { "coll": 'role_doc_access', "schema": _role_doc_access, "db": _dbWithCol },
    { "coll": 'user_documents', "schema": _user_module_documents, "db": _dbWithCol },
    { "coll": 'uploadDocuments', "schema": _uploadDocuments, "db": _dbWithCol },
    { "coll": 'dd_mrconso_rela', "schema": _dd_mrconso_rela, "db": _dbWithCol },
    { "coll": 'spl_set_id', "schema": _spl_set_id, "db": _dbWithCol },
    { "coll": 'umls_dd', "schema": _umls_dd, "db": _dbWithCol },
    { "coll": 'brand_dose_form_master', "schema": _brand_dose_form_master, "db": _dbWithCol },
    { "coll": 'country', "schema": _country_master, "db": _dbWithCol },
    { "coll": 'synonymy_master', "schema": _synonymy_master, "db": _dbWithCol },
    { "coll": 'country_state_master', "schema": _country_state_master, "db": _dbWithCol },
    { "coll": 'brand_master', "schema": _brand_master, "db": _dbWithCol },
    { "coll": 'parent_brand_master', "schema": _parent_brand_master, "db": _dbWithCol },
    { "coll": 'parent_brand_mapping', "schema": _parent_brand_mapping, "db": _dbWithCol },
    { "coll": 'brand_extension', "schema": _brand_extension, "db": _dbWithCol },
    { "coll": 'brand_display_name', "schema": _brand_display_name, "db": _dbWithCol },
    { "coll": 'logsInfo', "schema": _logInfo, "db": _dbWithCol },
];


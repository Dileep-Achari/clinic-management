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
            approve: {
                type: Boolean,
                default: false
            },
            return: {
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
            modifiedByBy: String,
            modifiedByDt: {
                type: String
            }
        },
        // audit: {
        //     "_id": {
        //         type: mongoose.Schema.Types.ObjectId,
        //         required: true,
        //         auto: true,
        //     },
        //     documentedById:{
        //         type: String,
        //       //  required: true
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
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                patientId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
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
            modifiedByBy: String,
            modifiedByDt: {
                type: String
            }
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
            required: true
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
            required: true
        },
        roleId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        permissions: [],
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
        documentTitle: {
            type: String,
            required: true
        },
        Cd:{
            type: String,
           // required: true
        },
        manufacturer: {
            type: String,
          //  required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        description: {
            type: String,
           // required: true
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
         //   required: true     
        },
        template: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                //auto: true,
            },
            hcp: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                      //  auto: true,
                    },
                    label: {
                        type: String,
                      //  required: true
                    },
                    depth: {
                        type: String,
                      //  required: true
                    },
                    isActive: {
                        type: Boolean,
                      //  default: true
                    },
                    mId:{
                        type: mongoose.Schema.Types.ObjectId,
                       // required: true,
                      //  auto: true,
                    },
                    sequence: {
                        type: Number,
                      //  required: true
                    },
                    superParent: {
                        type: Number,
                      //  required: true
                    },
                    imdParent: {
                        type: Number,
                      //  required: true
                    },
                    version: {
                        type: Number,
                     //   required: true
                    },
                    data: {
                        type: String,
                     //   required: true
                    },
                    status: {
                        type: String,
                     //   required: true
                    },
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
                              //  required: true
                            },
                        }
                    ],
                    children: []
                }
            ],
            patient: [
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                       // auto: true,
                    },
                    label: {
                        type: String,
                      //  required: true
                    },
                    depth: {
                        type: String,
                        //required: true
                    },
                    isActive: {
                        type: Boolean,
                        //default: true
                    },
                    mId:{
                        type: mongoose.Schema.Types.ObjectId,
                      //  required: true,
                      //  auto: true,
                    },
                    sequence: {
                        type: Number,
                        //required: true
                    },
                    superParent: {
                        type: Number,
                        //required: true
                    },
                    imdParent: {
                        type: Number,
                        //required: true
                    },
                    version: {
                        type: Number,
                      //  required: true
                    },
                    data: {
                        type: String,
                      //  required: true
                    },
                    status: {
                        type: String,
                       // required: true
                    },
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
                             //   required: true
                            },
                            revNo: {
                                type: Number,
                             //   required: true
                            },
                        }
                    ],
                    children: []
                }
            ]
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
            modifiedByBy: String,
            modifiedByDt: {
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
                   // required: true
                },
                revNo: {
                    type: Number,
                  //  required: true
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
        dName: {
            type: String,
            required: true
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
                    required: true
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                userId: mongoose.Schema.Types.ObjectId
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
            modifiedByBy: String,
            modifiedByDt: {
                type: String
            }
        }
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
            documentedById: {
                type: String
            },
            documentedBy: {
                type: String,
                //  required: true
            },
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() }
            },
            modifiedById: {
                type: String,
                //  required: true
            },
            modifiedBy: {
                type: String,
                // required: true
            },
            modifiedDt: {
                type: String,
                default: () => { return new Date().toISOString() }
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

module.exports = [
    { "coll": 'levels', "schema": _levels, "db": "monography" },
    { "coll": 'roles', "schema": _roles, "db": "monography" },
    { "coll": 'users', "schema": _users, "db": "monography" },
    { "coll": 'drugcreation', "schema": _drugCreation, "db": "monography" },
    { "coll": 'userAssign', "schema": _user_assign, "db": "monography" },
    { "coll": 'coreMasters', "schema": _coreMaster_data, "db": "monography" },
    { "coll": 'histories', "schema": _history, "db": "monography" },
];

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
            accept:{
                type: Boolean,
                default: false
            },
            start:{
                type: Boolean,
                default: false
            },
            submitForReview:{
                type: Boolean,
                default: false
            },
            revisionOpen:{
                type: Boolean,
                default: false
            },
            revisionClose:{
                type: Boolean,
                default: false
            },
            reviewApproved:{
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
            sequence:{
                type:Number
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
                    type:String
                   // type: mongoose.Schema.Types.ObjectId,
                  //  required: true
                },
                patientId: {
                    type:String
                  //  type: mongoose.Schema.Types.ObjectId,
                 //   required: true
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
        sequence:{
            type:Number
        },
        actionOfRole:{
            type:String
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
        EmpId:{
            type: String
        },
        defaultRoleId: {
            type: mongoose.Types.ObjectId,
            //required: true
        },
        defaultRoleName:{
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
                roleId:{
                    type: mongoose.Types.ObjectId
                }, 
                roleName:{
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
        DD_SUBSTANCE_CD:{
            type: String,
           // required: true
        },
        PARENT_DRUG_CD:{
            type:String
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
                roleName:{
                   type:String,
                   required: true
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                 //   required: true
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName:{
                    type:String
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
        DD_SUBSTANCE_CD:{
           type:String
        },
        DD_SUBSTANCE_NAME:{
           type:String
        },
        PARENT_DRUG_CD:{
            type:String
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
                roleName:{
                   type:String,
                   required: true
                },
                sequence:{
                    type:Number
                },
                actionOfRole:{
                    type:String
                },
                levelId: {
                    type: mongoose.Schema.Types.ObjectId,
                 //   required: true
                },
                levelName:{
                  type:String
                },
                userId: mongoose.Schema.Types.ObjectId,
                userName:{
                    type:String
                }
            }
        ],
        previousAssigned:[
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
            roleName:{
               type:String,
               required: true
            },
            sequence:{
                type:Number
            },
            actionOfRole:{
                type:String
            },
            levelId: {
                type: mongoose.Schema.Types.ObjectId,
             //   required: true
            },
            levelName:{
              type:String
            },
            userId: mongoose.Schema.Types.ObjectId,
            userName:{
                type:String
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
        current_status:{
            type:String,
            default: () => { return 'NOT ACCEPTED' }
        },
        next_status:{
           type:String
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
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        hcp:[
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                label:String,
                depth:String,
                isActive: {
                    type: Boolean,
                    default: true
                },
                sequence:{
                    type: Number,
                    required: true
                },
                superParent:{
                    type: Number,
                    required: true
                },
                imdParent:{
                    type: Number,
                    required: true
                },
                version:{
                    type: Number,
                    required: true
                },
                data:String,
                status:String,
                isEditable:{
                    type: Boolean,
                    default: true
                },
                history:[
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
                children:[
                    {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        label:String,
                        depth:String,
                        isActive: {
                            type: Boolean,
                            default: true
                        },
                        sequence:{
                            type: Number,
                            required: true
                        },
                        superParent:String,
                        imdParent:String,
                        version:{
                            type: Number,
                            required: true
                        },
                        data:String,
                        status:String,
                        history:[
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
                        children:[
                            {
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                label:String,
                                depth:String,
                                isActive: {
                                    type: Boolean,
                                    default: true
                                },
                                sequence:{
                                    type: Number,
                                  //  required: true
                                },
                                superParent:String,
                                imdParent:String,
                                version:{
                                    type: Number,
                                  //  required: true
                                },
                                data:String,
                                status:String,
                                history:[
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
        ],
        patient:[
            {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    label:String,
                    depth:String,
                    isActive: {
                        type: Boolean,
                        default: true
                    },
                    sequence:{
                        type: Number,
                        required: true
                    },
                    superParent:{
                        type: Number,
                        required: true
                    },
                    imdParent:{
                        type: Number,
                        required: true
                    },
                    version:{
                        type: Number,
                        required: true
                    },
                    data:String,
                    status:String,
                    isEditable:{
                        type: Boolean,
                        default: true
                    },
                    history:[
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
                    ],
                    children:[
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            label:String,
                            depth:String,
                            isActive: {
                                type: Boolean,
                                default: true
                            },
                            sequence:{
                                type: Number,
                                required: true
                            },
                            superParent:String,
                            imdParent:String,
                            version:{
                                type: Number,
                                required: true
                            },
                            data:String,
                            status:String,
                            history:[
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
                            children:[
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    label:String,
                                    depth:String,
                                    isActive: {
                                        type: Boolean,
                                        default: true
                                    },
                                    sequence:{
                                        type: Number,
                                      //  required: true
                                    },
                                    superParent:String,
                                    imdParent:String,
                                    version:{
                                        type: Number,
                                      //  required: true
                                    },
                                    data:String,
                                    status:String,
                                    history:[
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
        ]
    }
])     

const _status = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        drug_Mongrophy_Status_Code:{
            type:String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        org_Id:{
            type:String
        },
        session_Id:{
            type:String
        },
        Drug_Mon_Status:{
            type:String 
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
        drug_monography_Code:{
            type:String
        },
        drug_monography_description:{
            type:String
        },
        drug_id	:{
            type: mongoose.Types.ObjectId, 
        },
        PARENT_DRUG_ID:{
            type:String   
        },
        DD_SUBSTANCE_CD:{
            type:String
        },
        SECTION_TYPE:{
            type:String
        },
        SECTION_NAME:{
            type:String
        },
        drug_code:{
            type:String 
        },
        drug_section_id	:{
            type:String,
            required:true 
        },
        user_id:{
            type: mongoose.Types.ObjectId,
            required:true 
        },
        role_id:{     
            type: mongoose.Types.ObjectId,
            required:true 
        },
        drug_content:{
            type:String  
        },
        section_comment:{
            type:String
        },
        current_status:{
            type:String  
        },
        current_status_id:{
            type:String  
        },
        next_status:{
            type:String  
        },
        next_status_id:{
            type:String  
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        session_id:{
            type:String
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

//user-session

const _userSession = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        user_revNo:{
            type:String
        },
        userId:{
            type: mongoose.Types.ObjectId
        },
        session_id:{
            type:Number
        },
        orgId:{
            type: String
        },
        roleId:{
            type: mongoose.Types.ObjectId
        },
        machine:{
            type:String
        },
        version:{
            type:String
        },
        startTime:{
            type: String,
            default: () => { return new Date().toISOString() },
        },
        endTime:{
            type:String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        timeZoneId:{
            type:Number
        },
        browserVersion:{
            type:String
        },
        browser:{
            type:String
        },
        idUserLoggedIn:{
            type:String
        },
        logOutTime:{
            type:String
        } ,
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

const _tracking =new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        current_status_id:{
            type: mongoose.Schema.Types.ObjectId,
           // required: true
        } ,
        current_status:{
           type:String
        },
        next_status:{
           type:String
        },
        next_status_id:{
            type:String
        },
        done_by:{
            type:String
        },
        roleName:{
            type:String
        },
        roleId:{
            type: mongoose.Schema.Types.ObjectId
        },
        userName:{
            type:String
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId
        },
        previousRoleId:{
            type: mongoose.Schema.Types.ObjectId
        },
        previousRoleName:{
            type:String
        },
        previousUserId:{
            type: mongoose.Schema.Types.ObjectId
        },
        previousUserName:{
            type:String
        },
        drugId:{
            type: mongoose.Schema.Types.ObjectId 
        },
        drugName:{
            type:String
        },
        status_dt:{
            type: String,
            default: () => { return new Date().toISOString() },
        },
        user_assigned_table_id:{
            type: mongoose.Schema.Types.ObjectId
        },
        drug_mono_id:{
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

module.exports = [
    { "coll": 'levels', "schema": _levels, "db": "monography_staging" },
    { "coll": 'roles', "schema": _roles, "db": "monography_staging" },
    { "coll": 'users', "schema": _users, "db": "monography_staging" },
    { "coll": 'drugcreation', "schema": _drugCreation, "db": "monography_staging" },
    { "coll": 'userAssign', "schema": _user_assign, "db": "monography_staging" },
    { "coll": 'coreMasters', "schema": _coreMaster_data, "db": "monography_staging" },
    { "coll": 'histories', "schema": _history, "db": "monography_staging" },
    { "coll": 'templates', "schema": _template, "db": "monography_staging" },
    { "coll": 'counters', "schema": _counter, "db": "monography_staging" },
    { "coll": 'drugmonographyworkflowstatuses', "schema": _status, "db": "monography_staging" },
    { "coll": 'drugmonographyworkflowtracking', "schema": _tracking, "db": "monography_staging" },
    { "coll": 'sections', "schema": _sectionsData, "db": "monography_staging" },
    { "coll": 'userSession', "schema": _userSession, "db": "monography_staging" },
];

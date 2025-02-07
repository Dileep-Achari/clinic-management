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
                drugInteractionId:{
                    type:String
                },
                content_name:{
                    type:String
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
        content_type:{
            type:String
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
        content_type:{
            type:String
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
                content_type:{
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
        previous_status:{
            type:String,
            default: () => { return 'NOT ACCEPTED' }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        operation_type:{
          type:String
        },
        content_type:{
            type:String
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
                drugInteractionId:{
                    type:String
                },
                content_name:{
                    type:String
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
                levelId: {
                    type: String,
                 //   required: true
                },
                sequence:{
                    type:Number
                },
                actionOfRole:{
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
            levelId: {
                type: mongoose.Schema.Types.ObjectId,
             //   required: true
            },
            roleType:{
                type:String
             },
             sequence:{
                type:Number
            },
            actionOfRole:{
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
        previous_status:{
            type:String,
            default: () => { return 'NOT ACCEPTED' }
        },
        operation_type:{
            type:String
        },
        content_type:{
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
                drugInteractionId:{
                    type:String
                },
                content_name:{
                    type:String
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
             label:String,
             depth:String,
             content_type:{
               type:String
             },
             INT_ID:{
                 type:Number
             },
             isActive: {
                 type: Boolean,
                 default: true
             },
             section_type:{
                 type:String
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
             isMandatory:{
                 type:Boolean
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
                     isMandatory:{
                         type:Boolean
                     },
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
        drug_Mongrophy_Status_Code:{
            type:String
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        session_Id:{
            type:String
        },
        Drug_Mon_Status:{
            type:String 
        },
        next_status:{
            type:String
        },
        roleType:{
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
        drugId:{
            type: String,
          //  required:true
        },
        type:{
           type:String
        },
        INT_ID:{
            type:Number
        },
        operation_type:{
            type:String
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
            type: String,
            required:true 
        },
        userName:{
           type:String
        },
        role_id:{     
            type: String,
            required:true 
        },
        roleName:{
          type:String
        },
        drug_content:{
            type:String  
        },
        content_type:{
            type:String,
            required:true
        },
        // interacaction_drug_content:[{
        //     any: mongoose.Schema.Types.Mixed
        // }],
        interacaction_drug_content:[{
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            DRUG_IN_PARENT_ID:{
                type:Number
            },
            SRC_DRUG_CD:{
                type:String
            },
            DD_SUBSTANCE_NAME:{
                type:String
            },
            ROA_CD:{
                type:String
            },
            ROA_NAME:{
                type:String
            },
            INT_TYPE_ID:{
                type:String
            },
            ENTITY_VALUE_NAME:{
                type:String
            },
            INT_ID:{
                type:Number
            },
            ENTITY_NAME:{
                type:String
            },
            SEVERITY_ID:{
                type:Number
            },
            SEVERITY_NAME:{
                type:String
            },
            SRC_ID:{
                type:Number
            },
            SRC_NAME:{
                type:String
            },
            SRC_DESC:{
                type:String
            },
            SRC_URL:{
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
            }
        }],
        section_comment:[
          {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            comment_desc:{
                type:String
            },
            profilePic:{
                type:String
              }
          }
        ],
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
],{ strict: false });

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
            type: mongoose.Types.ObjectId
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
        previous_status:{
            type:String
        },
        operation_type:{
            type:String
        },
        content_type:{
            type:String
        },
        done_by:{
            type:String
        },
        roleName:{
            type:String
        },
        roleId:{
            type: String
        },
        userName:{
            type:String
        },
        userId:{
            type:String
        },
        previousRoleId:{
            type:String
        },
        previousRoleName:{
            type:String
        },
        previousUserId:{
            type:String
        },
        previousUserName:{
            type:String
        },
        drugId:{
            type:String
        },
        DD_SUBSTANCE_NAME:{
            type:String
        },
        DD_SUBSTANCE_CD:{
           type:String
        },
        status_dt:{
            type: String,
            default: () => { return new Date().toISOString() },
        },
        status: {
            type: String,
            default: () => { return 'ASSIGNED' }
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

//section-comments-history
const _sections_comment_history = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        referenceType:{
            type:String
        },
        referenceId:{                      //referenceId means drugId 
             type:String
        },
        userId:{
             type:String
        },
        roleId:{
             type:String
        },
        drug_section_id:{
             type:String
        },
        sectionName:{
            type:String
        },
        section_comment:[
            {
              "_id": {
                  type: mongoose.Schema.Types.ObjectId,
                  required: true,
                  auto: true,
              },
              comment_desc:{
                  type:String
              },
              profilePic:{
                type:String
              }
            }
          ],
        sections_table_id:{
            type:String
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
        S_no:{
            type:Number
        },
        content_type_desc:{
            type:String
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
        S_no:{
            type:Number
        },
        section_type_desc:{
            type:String
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
        RL_L1_NAME:{
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
            type:Number
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
    { "coll": 'snowmeds', "schema": _snowmed, "db": "monography" }
];

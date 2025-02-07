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
                    type: String,
                
                },
                patientId: {
                    type: String
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
        manufacturer: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        lastApprovedBy: {
            type: String,
            required: true
        },
        lastApprovedDate: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        version: {
            type: Number,
            required: true
        },
        mainSections: {
            type: Number,
            required: true
        },
        entrySections: {
            type: Number,
            required: true
        },
        template: {
            hcp:[
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
                    depth: {
                        type: String,
                        required: true
                    },
                    isActive: {
                        type: Boolean,
                        default: true
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
                    data: {
                        type: String,
                        required: true
                    },
                    status: {
                        type: String,
                        required: true
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
                                required: true
                            },
                            revNo: {
                                type: Number,
                                required: true
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
                        auto: true,
                    },
                    label: {
                        type: String,
                        required: true
                    },
                    depth: {
                        type: String,
                        required: true
                    },
                    isActive: {
                        type: Boolean,
                        default: true
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
                    data: {
                        type: String,
                        required: true
                    },
                    status: {
                        type: String,
                        required: true
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
                                required: true
                            },
                            revNo: {
                                type: Number,
                                required: true
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
        metaSearchKeywords:[],
        comments:[
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                date:{
                    type: String,
                    default: () => { return new Date().toISOString() }
                },
                whom: {
                    type: String,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                },
                precompled: {
                    type: String,
                    required: true
                },
            }
        ],
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
                    type: String,
                  //  required: true
                },   
                levelId: {
                    type: String,
                  //  required: true
                }, 
                user:{
                    _id:{
                        type: String, 
                    },
                    label: {
                        type: String,
                      //  required: true
                    },   
                }  
            }
        ],
        assignedDt: {
            type: String,
            default: () => { return new Date().toISOString() },
        },
        status: {
            type: String,
         //   required: true
        },
        isActive: {
            type: Boolean,
         default: true
        },
        fromSource: {
            type: String,
            required: true
        },
        sections: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                secId: {
                    type: String,
                  //  required: true
                },
                status: {
                    type: String,
                 //   required: true
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
            required: true
        },
        history: {            
            type: Object,
            required: true
        }
    }
])

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

module.exports = [
    { "coll": 'levels', "schema": _levels, "db": "monography" },
    { "coll": 'roles', "schema": _roles, "db": "monography" },
    { "coll": 'users', "schema": _users, "db": "monography" },
    { "coll": 'drugCreation', "schema": _drugCreation, "db": "monography" },
    { "coll": 'userAssign', "schema": _user_assign, "db": "monography" },
    { "coll": 'histories', "schema": _history, "db": "monography" },
    { "coll": 'templates', "schema": _template, "db": "monography" },
];

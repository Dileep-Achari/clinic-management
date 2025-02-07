const mongoose = require("mongoose");

/**organisation location details */

const _org_loc = new mongoose.Schema([
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
            required: true
        },
        imgUrl: {
            type: String,
            required: true
        },
        revNo: {
            type: Number,
            required: true
        },
        recStatus: {
            type: Boolean,
            default: true
        },
        defLocId: {
            type: String,
            required: true
        },
        location: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                locName: {
                    type: String,
                    required: true
                },
                defLoc: {
                    type: Boolean,
                    default: true
                },
                notification: {
                    sms: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        apiUrl: {
                            type: String,
                            required: true
                        },
                        uName: {
                            type: String,
                            required: true
                        },
                        pwd: {
                            type: String,
                            required: true
                        },
                    },
                    whatsapp: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        apiUrl: {
                            type: String,
                            required: true
                        },
                        uName: {
                            type: String,
                            required: true
                        },
                        pwd: {
                            type: String,
                            required: true
                        },
                    },
                    email: {
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        apiUrl: {
                            type: String,
                            required: true
                        },
                        uName: {
                            type: String,
                            required: true
                        },
                        pwd: {
                            type: String,
                            required: true
                        },
                    }

                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                emailID: {
                    type: String,
                    required: true
                },
                ofcPhnNo: {
                    type: String,
                    required: true
                },
                faxNo: {
                    type: String,
                    required: true
                },
                mblNo: {
                    type: String,
                    required: true
                },
                webUrl: {
                    type: String,
                    required: true
                },
                address1: {
                    type: String,
                    required: true
                },
                address2: {
                    type: String,
                    required: true
                },
                areaCd: {
                    type: String,
                    required: true
                },
                area: {
                    type: String,
                    required: true
                },
                cityCd: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                stateCd: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                countryCd: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                },
                zipCd: {
                    type: String,
                    required: true
                },
                geoCoordinats: {
                    type: String,
                    required: true
                },
                contactPerson: {
                    type: String,
                    required: true
                },
                contactMobile: {
                    type: String,
                    required: true
                },
                revNo: {
                    type: Number,
                    required: true
                },
                documentedId: {
                    type: String,
                    required: true
                },
                documentedBy: {
                    type: String,
                    required: true
                },
                documentedDt: {
                    type: String,
                    default: () => { return new Date().toISOString() },
                },
                modifyId: {
                    type: String,
                },
                modifyBy: {
                    type: String,
                },
                modifyDt: {
                    type: String
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
                        documentedDt: {
                            type: String,
                            default: () => { return new Date().toISOString() },
                        },
                        documentedBy: {
                            type: String,
                            required: true
                        }
                    }
                ]
            }
        ],
        audit: {
            "_id": {
                type: mongoose.Schema.Types.ObjectId
            },
            documentedById: {
                type: String,
                required: true
            },
            documentedBy: {
                type: String,
                required: true
            },
            documentedDt: {
                type: String,
                default: () => { return new Date().toISOString() },
            },
            modifiedById: {
                type: Number,
                default: () => { return 0 }
            },
            modifiedBy: {
                type: String,
                default: () => { return "" }
            },
            modifiedDt: {
                type: String,
                default: () => { return "" }
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
]);

/** form creation schema*/
const _documnet_creation = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        orgId: {
            type: String,
            required: true
        },
        locId: {
            type: String,
            required: true
        },
        formCd: {
            type: String,
            required: true,
            unique: true,
            //  immutable: true
        },
        multiSave: {
            type: Boolean
        },
        formName: {
            type: String,
            // required: true
        },
        formDesc: {
            type: String,
            // required: true
        },
        formUrl: {
            type: String,
            unique: true,
            // immutable: true,
            required: true
        },
        isDataBase: {
            type: Boolean
        },
        formDept: {
            type: String,
            // required: true
        },
        formDeptName: {
            type: String,
            // required: true
        },
        reportUrl: {
            type: String,
            // required: true
        },
        imageUrl: {
            type: String,
            // required: true
        },
        qualityDocNo: {
            type: String,
            // required: true
        },
        displayOrder: {
            type: String,
            // required: true
        },
        module:{
         type:String
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

//_documnet_tarnsaction_data
const _document_transaction_data = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        formId: {
            type: String
        },
        orgId: {
            type: String
        },
        locId: {
            type: String
        },
        visitStatus: {
            type: String
        },
        visitId: {
            type: Number
        },
        formCd: {
            type: String,
            //   required: true
        },
        formName: {
            type: String,
            //  required: true
        },
        treatmentId: {
            type: String,
            //  required: true
        },
        treatmentType: {
            type: String,
            //  required: true
        },
        data: [
            {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            autoid:{
                type:String
            },
            lblId:{
                type:String
            },
            label:{
                type:String
            },
            value:{
                type:String
            },
            value1:{
                type:String
            },
            checkValue:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    value:{
                        type:String
                    },
                    id:{
                        type:String
                    }
                }
            ],
            chldArr:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                }
            ],
            layoutArr:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    autoid:{
                        type:String
                    },
                    label:{
                        type:String
                    },
                    value:{
                        type:String
                    },
                    value1:{
                        type:String
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    checkValue:[]
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
                modifiedByBy: String,
                modifiedByDt: {
                    type: String
                }
            }
        }],
        umrNo: {
            type: String,
            required: true
            // immutable: true
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

//document specific masters
const _document_specific_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        formId: {
            type: String,
            required: true,
            // unique:true, 
            // immutable: true
        },
        formName: {
            type: String,
            required: true
        },
        masterKeys:{
         type:String
        },      
        data: [
        {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            type:{
                type:String
            },
            id:{
                type:String
            },
            parntCd:{
                type:String
            },
            visible:{
                type:Boolean
            },
            label:{
                type:String
            },
            labelName:{
                type:String
            },
            classname:{
                type:String
            },
            bindValue:{
                type:String
            },
            dataSelTyp:{
                type:String
            },
            labelposition:{
                type:String
            },
            lblId:{
                type:String
               },
            defaultvalue:{
                type:String
            },
            value:{
                type:String
            },
            placeholder:{
                type:String
            },
            description:{
                type:String
            },
            tooltip:{
                type:String
            },
            autocomplete:{
                type:String
            },
            tabIndex:{
                type:String
            },
            customcssclass:{
                type:String
            },
            eventTrigger:{
                type:String
            },
            validations:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                required:{
                    type:Boolean
                },
                minlength:{
                    type:String
                },
                maxlength:{
                    type:String
                }
            },
            addOptns:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    label:{
                        type:String
                    },
                    id:{
                        type:String
                    },
                    value:{
                        type:String
                    }
                }
            ],
            chnageEvntLogic:{
                type:String
            },
            blurEvntLogic:{
                type:String
            },
            keyDownEvntLogic:{
                type:String
            },
            viewTemp:{
                type:Boolean
            },
            saveTemp:{
                type:Boolean
            },
            isHistory:{
                type:Boolean
            },
            isAddReq:{
                type:Boolean
            },
            masterCd:{
              type:String
            },
            masterObj:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                }, 
                name:{
                    type:String
                } ,
                cd:{
                    type:String
                },
                async:{
                    type:Boolean
                }
            },
            bindings: 
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    cd:{
                        type:String
                    },
                    obj:{
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        key:{
                            type:String 
                        },
                        label:{
                            type:String 
                        },
                        isReadOnly:{
                            type:Boolean 
                        },
                        isSystemItem:{
                            type:Boolean 
                        },
                        dataType:{
                            type:String 
                        }
                    }
                },
            options:[
              {
                id:{
                    type:String
                },
                value:{
                    type:String
                }
              }
            ],
            properties:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    size:{
                        type:String
                    },
                    width:{
                        type:String
                    },
                    chlds:[
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            type:{
                                type:String
                            },  
                            id:{
                                type:String
                            },  
                            parntCd:{
                                type:String
                            },  
                            visible:{
                                type:String
                            },  
                            autoid:{
                                type:String
                            },  
                            label:{
                                type:String
                            },  
                            labelName:{
                                type:String
                            },  
                            classname:{
                                type:String
                            },  
                            labelposition:{
                                type:String
                            },  
                            defaultvalue:{
                                type:String
                            },  
                            value:{
                                type:String
                            },  
                            placeholder:{
                                type:String
                            },  
                            description:{
                                type:String
                            },  
                            tooltip:{
                                type:String
                            },  
                            autocomplete:{
                                type:String
                            },  
                            tabIndex:{
                                type:String
                            },  
                            customcssclass:{
                                type:String
                            },  
                            eventTrigger:{
                                type:String
                            },
                            validations:{
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                required:{
                                    type:Boolean
                                }
                            } 
                        }
                    ]
                }
            ],
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
                modifiedByBy: String,
                modifiedByDt: {
                    type: String
                }
            }
        }
        ],
        orgId: {
            type: String,
            required: true
        },
        locId: {
            type: String,
            required: true
        },
        formCd: {
            type: String,
            required: true,
            // unique:true,
            //  immutable: true
        },
      
        formSettings: [{
            any: mongoose.Schema.Types.Mixed
        }],
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
]);

//predefined control
const _predefined_control_master = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        }, 
        data: [
        {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            type:{
                type:String
            },
            id:{
                type:String
            },
            parntCd:{
                type:String
            },
            visible:{
                type:Boolean
            },
            label:{
                type:String
            },
            labelName:{
                type:String
            },
            classname:{
                type:String
            },
            bindValue:{
                type:String
            },
            labelposition:{
                type:String
            },
            defaultvalue:{
                type:String
            },
            value:{
                type:String
            },
            placeholder:{
                type:String
            },
            description:{
                type:String
            },
            tooltip:{
                type:String
            },
            autocomplete:{
                type:String
            },
            tabIndex:{
                type:String
            },
            customcssclass:{
                type:String
            },
            eventTrigger:{
                type:String
            },
            validations:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                required:{
                    type:Boolean
                },
                minlength:{
                    type:String
                },
                maxlength:{
                    type:String
                }
            },
            addOptns:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    label:{
                        type:String
                    },
                    id:{
                        type:String
                    },
                    value:{
                        type:String
                    }
                }
            ],
            chnageEvntLogic:{
                type:String
            },
            blurEvntLogic:{
                type:String
            },
            keyDownEvntLogic:{
                type:String
            },
            viewTemp:{
                type:Boolean
            },
            saveTemp:{
                type:Boolean
            },
            isHistory:{
                type:Boolean
            },
            isAddReq:{
                type:Boolean
            },
            masterCd:{
              type:String
            },
            masterObj:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                }, 
                name:{
                    type:String
                } ,
                cd:{
                    type:String
                },
                async:{
                    type:Boolean
                }
            },
            bindings: {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    cd:{
                        type:String
                    },
                    obj:{
                        "_id": {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            auto: true,
                        },
                        key:{
                            type:String 
                        },
                        label:{
                            type:String 
                        },
                        isReadOnly:{
                            type:Boolean 
                        },
                        isSystemItem:{
                            type:Boolean 
                        },
                        dataType:{
                            type:String 
                        }
                    }
                },
            options:[
              {
                id:{
                    type:String
                },
                value:{
                    type:String
                }
              }
            ],
            properties:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    size:{
                        type:String
                    },
                    width:{
                        type:String
                    },
                    chlds:[
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            type:{
                                type:String
                            },  
                            id:{
                                type:String
                            },  
                            parntCd:{
                                type:String
                            },  
                            visible:{
                                type:String
                            },  
                            autoid:{
                                type:String
                            },  
                            label:{
                                type:String
                            },  
                            labelName:{
                                type:String
                            },  
                            classname:{
                                type:String
                            },  
                            labelposition:{
                                type:String
                            },  
                            defaultvalue:{
                                type:String
                            },  
                            value:{
                                type:String
                            },  
                            placeholder:{
                                type:String
                            },  
                            description:{
                                type:String
                            },  
                            tooltip:{
                                type:String
                            },  
                            autocomplete:{
                                type:String
                            },  
                            tabIndex:{
                                type:String
                            },  
                            customcssclass:{
                                type:String
                            },  
                            eventTrigger:{
                                type:String
                            },
                            validations:{
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                required:{
                                    type:Boolean
                                }
                            } 
                        }
                    ]
                }
            ],
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
                modifiedByBy: String,
                modifiedByDt: {
                    type: String
                }
            }
        }
        ],
        orgId: {
            type: String,
            required: true
        },
        locId: {
            type: String,
            required: true
        },
      
        formSettings: [{
            any: mongoose.Schema.Types.Mixed
        }],
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
]);


//document specify history
const document_specific_history = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        formId: {
            type: String,
            required: true,
            // unique:true, 
            // immutable: true
        },
        formName: {
            type: String,
            required: true
        },
        masterKeys:{
         type:String
        },
        lblId:{
            type:String
           },
        bindValue:{
         type:String
        },
        data: [
        {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            type:{
                type:String
            },
            id:{
                type:String
            },
            parntCd:{
                type:String
            },
            visible:{
                type:Boolean
            },
            label:{
                type:String
            },
            labelName:{
                type:String
            },
            classname:{
                type:String
            },
            labelposition:{
                type:String
            },
            defaultvalue:{
                type:String
            },
            value:{
                type:String
            },
            placeholder:{
                type:String
            },
            description:{
                type:String
            },
            tooltip:{
                type:String
            },
            autocomplete:{
                type:String
            },
            tabIndex:{
                type:String
            },
            customcssclass:{
                type:String
            },
            eventTrigger:{
                type:String
            },
            validations:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                required:{
                    type:Boolean
                },
                minlength:{
                    type:String
                },
                maxlength:{
                    type:String
                }
            },
            addOptns:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    label:{
                        type:String
                    },
                    id:{
                        type:String
                    },
                    value:{
                        type:String
                    }
                }
            ],
            chnageEvntLogic:{
                type:String
            },
            blurEvntLogic:{
                type:String
            },
            keyDownEvntLogic:{
                type:String
            },
            viewTemp:{
                type:Boolean
            },
            saveTemp:{
                type:Boolean
            },
            isHistory:{
                type:Boolean
            },
            isAddReq:{
                type:Boolean
            },
            masterCd:{
              type:String
            },
            masterObj:{
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                }, 
                name:{
                    type:String
                } ,
                cd:{
                    type:String
                },
                async:{
                    type:Boolean
                }
            },
            bindings:[],
            options:[
              {
                id:{
                    type:String
                },
                value:{
                    type:String
                }
              }
            ],
            properties:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    size:{
                        type:String
                    },
                    width:{
                        type:String
                    },
                    chlds:[
                        {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            type:{
                                type:String
                            },  
                            id:{
                                type:String
                            },  
                            parntCd:{
                                type:String
                            },  
                            visible:{
                                type:String
                            },  
                            autoid:{
                                type:String
                            },  
                            label:{
                                type:String
                            },  
                            labelName:{
                                type:String
                            },  
                            classname:{
                                type:String
                            },  
                            labelposition:{
                                type:String
                            },  
                            defaultvalue:{
                                type:String
                            },  
                            value:{
                                type:String
                            },  
                            placeholder:{
                                type:String
                            },  
                            description:{
                                type:String
                            },  
                            tooltip:{
                                type:String
                            },  
                            autocomplete:{
                                type:String
                            },  
                            tabIndex:{
                                type:String
                            },  
                            customcssclass:{
                                type:String
                            },  
                            eventTrigger:{
                                type:String
                            },
                            validations:{
                                "_id": {
                                    type: mongoose.Schema.Types.ObjectId,
                                    required: true,
                                    auto: true,
                                },
                                required:{
                                    type:Boolean
                                }
                            } 
                        }
                    ]
                }
            ],
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
                modifiedByBy: String,
                modifiedByDt: {
                    type: String
                }
            }
        }
        ],
        orgId: {
            type: String,
            required: true
        },
        locId: {
            type: String,
            required: true
        },
        formCd: {
            type: String,
            required: true,
            // unique:true,
            //  immutable: true
        },
        bindings: [
            {
                "_id": {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    auto: true,
                },
                cd:{
                    type:String
                },
                obj:{
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    key:{
                        type:String 
                    },
                    label:{
                        type:String 
                    },
                    isReadOnly:{
                        type:Boolean 
                    },
                    isSystemItem:{
                        type:Boolean 
                    },
                    dataType:{
                        type:String 
                    }
                }
            }
        ],
        formSettings: [{
            any: mongoose.Schema.Types.Mixed
        }],
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
]);

//document transaction history
const document_transaction_history = new mongoose.Schema([
    {
        "_id": {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        formId: {
            type: String
        },
        orgId: {
            type: String
        },
        locId: {
            type: String
        },
        visitStatus: {
            type: String
        },
        lblId:{
            type:String
           },
        formCd: {
            type: String,
            //   required: true
        },
        formName: {
            type: String,
            //  required: true
        },
        treatmentId: {
            type: String,
            //  required: true
        },
        treatmentType: {
            type: String,
            //  required: true
        },
        data: [
            {
            "_id": {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true,
            },
            autoid:{
                type:String
            },
            lblId:{
                type:String
            },
            label:{
                type:String
            },
            value:{
                type:String
            },
            checkValue:[],
            chldArr:[],
            layoutArr:[
                {
                    "_id": {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        auto: true,
                    },
                    autoid:{
                        type:String
                    },
                    label:{
                        type:String
                    },
                    value:{
                        type:String
                    },
                    value1:{
                        type:String
                    },
                    recStatus: {
                        type: Boolean,
                        default: true
                    },
                    checkValue:[]
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
                modifiedByBy: String,
                modifiedByDt: {
                    type: String
                }
            }
        }],
        umrNo: {
            type: String,
            required: true
            // immutable: true
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

const _template = new mongoose.Schema([{
    "_id": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    templateName: {
        type: String,
        required: true
    },
    templateContent: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        // required:true
    },
    templateId: {
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
    recStatus: {
        type: Boolean,
        default: true
    }
}]);

module.exports = [
    { "coll": 'orglocs', "schema": _org_loc, "db": "formBuilder" },
    { "coll": 'doc_creation', "schema": _documnet_creation, "db": "formBuilder" },
    { "coll": 'document_transaction_data', "schema": _document_transaction_data, "db": "formBuilder" },
    { "coll": 'document_specific_data', "schema": _document_specific_master, "db": "formBuilder" },
    { "coll": 'predefined_control_master', "schema": _predefined_control_master, "db": "formBuilder" },
    { "coll": 'document_specific_history', "schema": document_specific_history, "db": "formBuilder" },
    { "coll": 'document_transaction_history', "schema": document_transaction_history, "db": "formBuilder" },
    { "coll": 'template', "schema": _template, "db": "formBuilder" },
];

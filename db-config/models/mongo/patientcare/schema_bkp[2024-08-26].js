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
                surgeryClosedId: String,
                surgeryClosedBy: String,
                surgeryClosedDt: String,
                reviewDt: String,
                reviewRemarks: String,

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
                admNo: {
                    type: String,
                    required: true
                },
                admDt: {
                    type: String,
                    required: true
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
                        surgeryClosedId: String,
                        surgeryClosedBy: String,
                        surgeryClosedDt: String,
                        reviewDt: String,
                        reviewRemarks: String,
                        ps: {
                            type: String,
                            required: true
                        },
                        route: {
                            type: String,
                            required: true
                        },
                        operKnee: String,
                        knee: String,
                        secKnee: String,
                        surDt: {
                            type: String
                        },
                        brnch: String,
                        tags: String,
                        mandFilledInPreop: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        mandFilledInIntraop: {
                            type: Boolean,
                            default: () => { return false; }
                        },
                        mandFilledInProsthesis: {
                            type: Boolean,
                            default: () => { return false; }
                        },

                        patInfo: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            deform: String,
                            hospName: String,
                            conslGrd: String,
                            conslGrdOthrs: String,
                            fAsoctGrd: String,
                            fAsoctGrdOthr: String,
                            acompnyRelat: String,
                            patReltin: String,
                            resdReltiv: String,
                            contDet: String,
                            admnDt: {
                                type: String
                            },
                            surgDtTm: {
                                type: String
                            },
                            disDt: {
                                type: String
                            },
                            admnNo: String,
                            operFnd: String,
                            operFndDet: String,
                            aadharNo: String,
                            patTyp: String,
                            patTypNo: String,
                            oprtKnee: String,
                            surgeonName: String,
                            opstkneeDtOfSurgery: String,
                            opstkneeSurgeryData: String,
                            opstKneeSurgHsptlName: String,
                            opstKneeSurgImplantSizes: String,
                            unilatKnee: String,
                            secndKnee: String,
                            oppositeSideRemarks: String,
                            date: {
                                type: String
                            },
                            text: String,
                            jointInvolve: String,
                            crntSymptom: String,
                            onSetSymptom: String,
                            srmAlbum: String,
                            poHb: String,
                            podHb: String,
                            esr: String,
                            vitDLvl: String,
                            vitB12Lvl: String,
                            oprtHip: String,
                            primDia: String,
                            primDiaOthr: String,
                            comorb: String,
                            comorbOthr: String,
                            preHipSurg: String,
                            preHipSurgDt: {
                                type: String
                            },
                            orif: String,
                            whchHosp: String,
                            appLimbShort: String,
                            trueLimbShort: String,
                            cauRev: String,
                            cauRevOthr: String,
                            prevSur: String,
                            prevSurOthr: String,
                            berSur: String,
                            compny: String,
                            painRst: String,
                            paiNigt: String,
                            prevIncis: String,
                            sinTrac: String,
                            abdPwer: String,
                            crp: String,
                            docList: String,
                            unit: String,
                            docListOthrs: String
                        },
                        preOp: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            aetiolgy: String,
                            aetiolgyOthrs: String,
                            rangMotion: String,
                            deformity: String,
							coronal:String,
							coronalShape:String,
							coronalAngle:String,
							sagittalShape:String,
							sagittalAngle:String,
                            //deformityCurvePattern: String,
                            //deformityShape: String,
                            //deformityAngle: String,
                            jointInvolve: String,
                            crntSymptom: String,
                            onSetSymptom: String,
                            onSetSymptomValue: String,
                            symptomAggravate: String,
                            prevKneeSurg: String,
                            prevKneeSurgOthrs: String,
                            intratriInject: String,
                            viscoSupplmnt: String,
                            retroPatlaTendr: String,
                            patlrTrack: String,
                            quadriPwer: String,
                            patela: String,
                            patelaOthrs: String,
                            avalCT: String,
                            avalMRI: String,
                            pPrstTyp: String,
                            pPrstTypOthrs: String,
                            cRev: String,
                            cRevOthrs: String,
                            tmIdxSurg: String,
                            prevSurgDt: {
                                type: String
                            },
                            sinsTract: String,
                            esr: String,
                            vitDLvl: String,
                            //vitB12Lvl: String,
                            surgPln: String,
                            surgPlnOthrs: String,
                            intratriInjectRmrks: String,
                            durationLstVst: String
                        },
                        radEval: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            impInSit: String,
                            deform: String,
                            defVol: String,
                            defVar: String,
                            patela: String,
                            patelaOthrs: String,
                            strsFrac: String,
                            volgCorAng: String,
                            avalCT: String,
                            avalMRI: String,
                            blodLos: String,
                            drains: String,
                            addInfo: String,
                            gradAVN: String,
                            protrus: String,
                            crowClass: String,
                            bonLosAce: String,
                            bonLosFemur: String,
                            femurMorp: String,
                            preOPLimb: String,
                            osteopn: String,
                            postClosr: String,
                            operaTm: String,
                            thrmbProp: String,
                            postOPLimbL: String,
                            proplHO: String,
                            postOPRad: String,
                            acetblCom: String,
                            femCom: String,
                            preOPLLD: String,
                            //apixiban:String
                        },
                        intraOpDet: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            procd: String,
                            navgtn: String,
                            drapes: String,
                            hoods: String,
                            prphylAntbio: String,
                            tranAcid: String,
                            tranAcidYes: String,
                            anaesth: String,
                            anaesthOther: String,
                            pstOpBlk: String,
                            pstOpBlkYes: String,
                            pstOpBlkYesAcb: String,
                            pstOpBlkYesIAcath: String,
                            pstOpBlkYesIppac: String,
                            tournquet: String,
                            tournquetTm: String,
                            turnqutPres: String,
                            incision: String,
                            //incisionOthers: String,
                            arthrotomy: String,
                            tibDef: String,
                            tibAOR: String,
                            ptlaOuterBridg: String,
                            prphylThick: String,
                            latrtRel: String,
                            acl: String,
                            pcl: String,
                            mcl: String,
                            lcl: String,
                            // varus: String,
                            varus: [
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    code: String,
                                    name: String
                                }
                            ],
                            //valgus: String,
                            valgus: [
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    code: String,
                                    name: String
                                }
                            ],
                            flexion: [
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    code: String,
                                    name: String
                                }
                            ],
                            // flexion: String,
                            distFemCut: String,
                            volgCorAng: String,
                            extnRot: String,
                            invTibCut: String,
                            unInvTibCut: String,
                            postSlop: String,
                            patelSurface: String,
                            debulking: String,
                            denrvtn: String,
                            defecRecon: String,
                            femStm: String,
                            femStmYes: String,
                            tiblStm: String,
                            tiblStmSize: String,
                            tiblStmYes: String,
                            cemntVisco: String,
                            intCktailInfil: String,
                            intOpComp: String,
                            minInvasTechUse: String,
                            computrGuidSurgUse: String,
                            robotcArmAss: String,
                            patSpecInstmUse: String,
                            untoWardIntraEvent: String,
                            //untoWardIntraEventOther: String,
                            prevFemComp: String,
                            prevTiblComp: String,
                            patelaStats: String,
                            retrPE: String,
                            tibDefAORI: String,
                            femDefAORI: String,
                            patelaTend: String,
                            uSpacer: String,
                            uSpacerOthr: String,
                            patlrRetRel: String,
                            medColl: String,
                            latColl: String,
                            cemntUse: String,
                            pyrfrms: String,
                            headSiz: String,
                            femStem: String,
                            stemSiz: String,
                            length: String,
                            diamtr: String,
                            fermAntver: String,
                            shrtOsteo: String,
                            OstoFix: String,
                            acetblrFix: String,
                            acetblrPrep: String,
                            acetblrRemSiz: String,
                            acetblrVersn: String,
                            inclin: String,
                            prostTrail: String,
                            surgPln: String,
                            prevAceCom: String,
                            bonGrft: String,
                            impac: String,
                            bulk: String,
                            cemtd: String,
                            sftTisRel: String,
                            distFemCutmm: String,
                            surgPlnOthrs: String,
                            cmntUsed: String,
                            cmntUsedAnt: String,
                            antiBioRmrks: String,
                            ArthrotomyOthers: String,
                            femStmSize: String,
                            femrlStmOthRmrks: String,
                            untoIntraEvntRmrks: String,
                            namOfOpThtrOthrsRmrks: String,
                            posterio: [
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    code: String,
                                    name: String
                                }
                            ],
                            felxion: [
                                {
                                    "_id": {
                                        type: mongoose.Schema.Types.ObjectId,
                                        required: true,
                                        auto: true,
                                    },
                                    code: String,
                                    name: String
                                }
                            ],
                            unqComKneeOption: String
                        },
                        intraRobotic:{
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            robSysUsd: String,
                            clinicParam: String,
                            //deforNatv: String,
                            //deforFnl: String,
                            //crnlPlneNtv: String,
                            //crnlFnl: String,
                            //sgtlPlneNtv: String,
                            //sgtlFnl: String,
                            romNtv: String,
                            romFnl: String,
                            alignment: String,
                            algnStrUsd: String,
                            implantSizes: String,
                            femurPlnd: String,
                            femurFnlImpl: String,
                            tibiaPlnd: String,
                            tibiaFnlImpl: String,
                            //insrtPlnd: String,
                            // insrtFnlImpl: String,
                            clinicParam: String,
                            fmrPreBlnce: String,
                            fmrFnlPst: String,
                            tibiaPreBlnce: String,
                            tibiaFnlPst: String,
                            fmrRotPreBlnce: String,
                            fmrRotFnlPst: String,
                            tblSlope: String,
                            tblMedlNtv: String,
                            tblMedlFnl: String,
                            tblLtrllNtv: String,
                            tblLtrlFnl: String,
                            fmrPcaNtv: String,
                            fmrPcaFnl: String,
                            fmrTeaNtv: String,
                            fmrTeaFnl: String,
                            fmrflexNtv: String,
                            fmrFlexFnl: String,
                            initGapAssem: String,
                            initExtLtrl: String,
                            initExtMedl: String,
                            initFlxLtrl: String,
                            initFlxMedl: String,
                            fnlGapAssem: String,
                            fnlExtLtrl: String,
                            fnlExtMedl: String,
                            fnlFlxLtrl: String,
                            fnlFlxMedl: String,
                            fnlGapAssem: String,
                            fumrPostMdl: String,
                            fumrPostLtrl: String,
                            fumrDistMdl: String,
                            fumrDistLtrl: String,
                            tibiaMdl: String,
                            tibiaLtrl: String,
                            cpak: String,
                            limbVrsPreop: String,
                            limbVrsPostop: String,
                            mLdfaPreop: String,
                            mLdfaPostop: String,
                            mptaPreop: String,
                            mptaPostop: String,
                            jloPreop: String,
                            jloPostop: String,
                            aHkaPreop: String,
                            aHkaPostop: String,
                            cpakPreop: String,
                            cpakPostop: String,
                            cpakChanges: String,
                            resdLaxityMedl: String,
                            resdLaxityltrl: String,
                            addSftTisRls: String,
                            addSodtRlsRadio: String,
                            pclRadio: String,
                            plnRmks: String,
                            fnlRmks: String,
                            sMclRmks: String,
                            pstroMdlRmks: String,
                            pstroCapslRmks: String,
                            tblRedOsteoRmks: String,
                            others: String,
                            comp: String,
                            anyCompSysRmrks: String,
                            deforCrnNatv:String,
                            deforSgtNatv:String,
                            fnlCrnlAlign:String,
                            deforCrnNatv:String,
                            fnlSgtAlign:String,
                            fnlInsSiz: String
                           
                        },
                        periOperPeriodObj:{
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            periOperPeriod: String,
                            periOperCompRmrks: String,
                            trasfusion: String,
                            transYesRemarks: String,
                        },
                        prosthUsd: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            comp: String,
                            compName: String,
                            prsthFemSiz: String,
                            prsthTiblSiz: String,
                            prsthPatla: String,
                            prsthInsTyp: String,
                            compStab: String,
                            tisueSntHisto: String,
                            tisueSntHistoRmks: String,
                            tisueSntCult: String,
                            // tisueSntCultRmks: String,
                            organisam: String,
                            drugSensitivity: String,

                            flexContra: String,
                            hyprExtent: String,
                            medicLaxity: String,
                            latrlLaxity: String,
                            patelTrack: String,
                            //operTm: String,
                            blodLos: String,
                            drains: String,
                            bonGraftUseFemr: String,
                            bonGraftUseTibia: String,
                            postSlop: String,
                            desgn: String,
                            femSiz: String,
                            tiblSiz: String,
                            patlaSiz: String,
                            insrtPol: String,
                            mlLaxity: String,
                            addInfo: String,
                            dtInpt: String,
                            notes: String,
                            hipKneAnkl: String,
                            limbSts: String,
                            trmoprophy: String,
                            mechanical: String,
                            pharma: String,
                            phormologicalRemarks: String
                        },
                        addrsDet: {
                            "_id": {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                auto: true,
                            },
                            patOTinTm: String,
                            nameOptTheater: String,
                            incisTm: String,
                            closeTm: String,
                            patOToutTm: String,
                            OperatingTm: String
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

    
module.exports = [
    { "coll": 'patients', "schema": _patient, "db": "patient_care" },
    { "coll": 'surgeries', "schema": _surgery, "db": "patient_care" },
    { "coll": 'documents', "schema": _documents, "db": "patient_care" },
    { "coll": 'scores', "schema": _scores, "db": "patient_care" },
    { "coll": 'reviews', "schema": _reviews, "db": "patient_care" },
    { "coll": 'roles', "schema": _roles, "db": "patient_care" },
    { "coll": 'users', "schema": _employees, "db": "patient_care" },
    { "coll": 'forms', "schema": _forms, "db": "patient_care" },
    { "coll": 'counters', "schema": _counter, "db": "patient_care" },
    { "coll": 'histories', "schema": _history, "db": "patient_care" },
    { "coll": 'fieldsmanagement', "schema": _field_management, "db": "patient_care" },
    { "coll": 'entity', "schema": _entity, "db": "patient_care" },
    { "coll": 'usersessions', "schema": _userSession, "db": "patient_care" },

];       
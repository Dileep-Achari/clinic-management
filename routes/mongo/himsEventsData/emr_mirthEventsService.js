const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const _mUtils = require("../../../constants/mongo-db/utils");
const cron = require('node-cron');
const xml2js = require('xml2js');
const { promisify } = require('util');
const parseStringAsync = promisify(xml2js.parseString);

const moment = require('moment');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../../../app-config');
const dirPath = appConfig.DIR_PATH;


let req = {
    tokenData: {
        dbType: "emr",
        dbName: "emr",
        userId: "642d0a87570a0a1e0d6bdeba",
        displayName: "emr Admin",
        userName: "emr@gmail.com"
    },
    body: {
        params: {
            sessionId: ""
        }
    }
}

const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/emr_hims_events_data/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/emr_hims_events_data/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const loggerInfo = winston.createLogger({ transports: loggingTransports });
const errloggerInfo = winston.createLogger({ transports: errorLoggingTransports });

// Logging Function
async function logMessage(level, message) {
    try {
        if (level === 'error') {
            errloggerInfo.error(message);
        } else {
            loggerInfo.info(message);
        }
        return true;
    } catch (error) {
        console.error(`Failed to log message: ${logError.message}`)
    }
}

/*Generate Payload for Slots */
async function generateSlotsPayload(_data, _time, _duration, _cnt, _idx, _output, _coll, _method, req) {
    try {
        if (_idx < _cnt) {
            let _apmntTime = _idx === 0 ? moment(_time).toISOString() : moment(_time).add(_duration, 'm').toISOString();
            let isSlotBooked = await checkIfSlotBooked(req.tokenData.locId, _data.docDetails.docId, _apmntTime, req, _duration)
            if (isSlotBooked) {
                return { success: false, desc: "This slot is already booked. please choose another time slot.", data: [] };
            } else {
                let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Consultation' }, "cm", req);
                if (!(_seqResp && _seqResp.success)) {
                    _output.push({ success: false, type: _data[_idx].type, desc: _seqResp.desc || "", data: [] });
                }
                else {
                    let _cloneData = JSON.parse(JSON.stringify(_data));
                    _cloneData["code"] = _seqResp.data;
                    _cloneData["dateTime"] = _apmntTime;
                    _output.push({ success: true, desc: "", data: _cloneData || [] });
                }
                _idx = _idx + 1;
                await generateSlotsPayload(_data, _apmntTime, _duration, _cnt, _idx, _output, _coll, _method, req);
            }
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output || []
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

async function updateVisitsOrBillData(_umrNo, _type, _data, req, _result) {
    try {
        return new Promise(async (resolve, reject) => {
            let _filter = {
                "filter": {
                    "recStatus": true,
                    "UMR": _umrNo
                },
                "selectors": "-history"
            }
            let _mPatResp = await _mUtils.commonMonogoCall("cm_patients", "find", _filter, "", "", "", req.tokenData.dbType)
            if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                resolve({ success: false, data: [], desc: "Error, No patient data found.." });
            }
            let patData = {
                params: {
                    _id: _mPatResp.data[0]._id,
                    revNo: _mPatResp.data[0].revNo,
                    audit: {
                        documentedById: _mPatResp.data[0].audit.documentedById,
                        documentedBy: _mPatResp.data[0].audit.documentedBy,
                        documentedDt: _mPatResp.data[0].audit.documentedDt
                    }
                }
            };
            let pLoadResp = { payload: {} };

            let _hResp = await _mUtils.insertHistoryData('cm_patients', patData.params, patData.params, req, "cm");
            if (_type && _type === "VISITS") {
                patData.params.visits = _data;
            }
            patData.params.audit = {};
            patData.params.audit["modifiedById"] = req.tokenData.userId;
            patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
            patData.params.audit["modifiedByDt"] = new Date().toISOString();
            patData.params.revNo = patData.params.revNo + 1;
            patData.params["history"] = {
                "revNo": _hResp.data[0].revNo,
                "revTranId": _hResp.data[0]._id
            }
            pLoadResp = await _mUtils.preparePayload("U", patData);
            if (!pLoadResp.success) {
                resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            let _uResp = await _mUtils.commonMonogoCall("cm_patients", 'findOneAndUpdate', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            if (!(_uResp && _uResp.success && _uResp.data)) {
                resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
            }
            else {
                resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
            }
        });
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

/*check Slots already booked or not */
async function checkIfSlotBooked(locId, docId, _apmntTime, req, _duration) {
    let _cParams = {
        "filter": {
            "locId": locId,
            "docId": docId,
            "dateTime": _apmntTime
        },
        "selectors": "-audit -history"
    };
    let _mResp = await _mUtils.commonMonogoCall("cm_appointments", 'findOne', _cParams, "", "", "", req.tokenData.dbName.toLowerCase());
    if (_mResp && _mResp.success == true && _mResp.data.dateTime == _apmntTime) {
        _apmntTime = new Date(_apmntTime);
        _apmntTime.setMinutes(_apmntTime.getMinutes() + _duration)
        
        return checkIfSlotBooked(locId, docId, _apmntTime, req, _duration);
    }
    else {
        return false;
    }

}

function getDetailedAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years}Y ${months}M ${days}D`;
}

async function insertAndUpdateUser(type, req, empData) {
    return new Promise(async (resolve, reject) => {
        try {
            if (type === "I") {
                let userData = {
                    orgId: req.tokenData.orgId,
                    empId: empData._id,
                    userName: req.body.params.userName,
                    password: req.body.params.password,
                    displayName: req.body.params.dispName,
                    sessionId: req.body.params.sessionId,
                    locations: [],
                    audit: req.cAudit
                };
                _.each(empData.loc, (_lo, _li) => {
                    let _userDataFromEmp = {
                        locId: _lo.locId,
                        locName: _lo.locName,
                        roleId: _lo.roleId,
                        role: _lo.roleName,
                        audit: req.cAudit
                    }
                    userData.locations.push(_userDataFromEmp)
                })
                if (empData.loc.defLoc) {
                    userData["defaultLocId"] = empData.loc.locId;
                }
                let _mResp = await _mUtils.commonMonogoCall("cm_users", "insertMany", userData, "", "", "", req.tokenData.dbType)
                if (!(_mResp && _mResp.success)) {
                    console.log("userData ff _mResp.desc", _mResp)
                    resolve({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
                }
                else {
                    resolve({ success: true, status: 200, desc: "", data: _mResp.data || [] });
                }
            }
        }
        catch (err) {
            resolve({ success: false, status: 400, desc: err.message || err, data: [] });
        }
    });
};

const eventConfig = {
    // '7011': {
    //     collectionName: 'cm_patients',
    //     preparePayload: prepareEvent701,
    //     specialHandling: true
    // },
    '900': {
        collectionName: 'cm_patients',
        preparePayload: prepareEvent900,
        specialHandling: true,
        seqName: "UMR"
    },
    '198': {
        collectionName: 'cm_doctors',
        preparePayload: prepareEvent198,
        specialHandling: true,
        seqName: "Doctor"
    },
    // '1811': {
    //     collectionName: 'cm_medications',
    //     preparePayload: prepareEvent181,
    //     specialHandling: true,
    //     seqName: "Medication"
    // },
    // '184': {
    //     collectionName: 'cm_investigations',
    //     preparePayload: prepareEvent184,
    //     specialHandling: true,
    //     seqName: "Investigation"
    // },
    '700': {
        collectionName: 'cm_appointments',
        preparePayload: prepareEvent700,
        specialHandling: true,
        //seqName: "Investigation"
    }
};

function prepareEvent701(result) {
    try {
        return {
            homeAddress: {
                countryName: result.country || "",
                countryCd: result.country_id || "",
                stateName: result.state || "",
                stateCd: result.state_id || "",
                cityName: result.city || "",
                cityCd: result.city_id || "",
                address1: result.address1 || "",
                address2: result.address2 || "",
            },
            visits: [{
                locId: result.locationcd || result.loc_id || "",
                //docId: result.duty_doctor_id || result.primary_doctor || result.duty_doctor || result.primary_doctor_id || ""
            }],
            UMR: result.umr_no || "",
            titleCd: result.titile_cd || "",
            fName: result.first_name || "",
            dispName: result.display_name || "",
            dob: result.dob || "",
            genderCd: result.gender_cd || "",
            mobile: result.mobile_no || result.mobile_no2 || "",
            maritalStatusCd: result.marital_status_cd || "",
            bloodGroupCd: result.blood_group_cd || "",
            religionCd: result.religion_cd || "",
            nationality: result.nationality_cd || "",
            isVIP: result.is_vip || false,
            //recStatus: result.record_status || "",

            userName: result.umr_no || ""
        };
    } catch (error) {
        console.error(`Error preparing payload for event 701: ${error.message}`);
        return {};
    }
}
function prepareEvent900(result) {
    try {
        console.log("result", result)
        return {
            locId: "",
            patProof: {
                typeCd: "",
                typeNam: "",
                patIdVa: ""
            },
            identifications: {
                identity1: "",
                identity2: ""
            },
            homeAddress: {
                typeCd: "PER",
                typeName: "Permanent",
                countryName: result.country || "",
                countryCd: result.country_id || "",
                stateName: result.state || "",
                stateCd: result.state_id || "",
                cityName: result.city || "",
                cityCd: result.city_id || "",
                address1: result.address1 || "",
                address2: result.address2 || "",
                areaCd: "",
                areaName: "",
                zipCd: ""
            },
            commuAddress: {
                typeCd: "PER",
                typeName: "Permanent",
                address1: "",
                address2: "",
                areaCd: "",
                areaName: "",
                cityCd: "",
                cityName: "",
                stateCd: "",
                stateName: "",
                countryCd: "",
                countryName: "",
                zipCd: ""
            },
            audit: {
                documentedById: "642d0a87570a0a1e0d6bdeba",
                documentedBy: "emr@gmail.com",
                documentedDt: new Date().toISOString()
            },
            registDt: result.reg_dt || "",
            registExpireDt: "",
            titleName: result.titile_cd || result.title_cd || "",
            titleCd: result.titile_cd ? { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.titile_cd.trim().toLowerCase()] || "" : { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.title_cd.trim().toLowerCase()] || "",
            paryerTypeCd: result.patient_type_cd || "",
            //payerTypeCd: "",
            //payerTypeName: "",
            crpType: "",
            crpName: "",
            UMR: result.umr_no || "",
            fName: result.first_name || "",
            mName: result.middle_name || "",
            lName: result.last_name || "",
            dispName: result.display_name || "",
            genderCd: result.gender_cd || "",
            gender: { "F": "Female", "M": "Male" }[result.gender_cd] || "",
            dob: result.dob || "",
            age: new Date().getFullYear() - new Date(result.dob).getFullYear() + "Y",
            ageVal: getDetailedAge(result.dob),
            ageEntry: false,
            emailID: "",
            userName: "",
            maritalStatusCd: result.marital_status_cd || "",
            maritalStatus: "",
            prefferedLanquage: "",
            religionName: result.religion_cd || "",
            religionCd: result.religion_cd ? { "Buddism": "BUDDISM", "Christianity": "CRSTNTY", "Hindu": "HINDU", "Jainism": "JAINISM", "Muslim": "MUSLIM", "sikh": "SIKH" }[result.religion_cd.trim()] || "" : "",
            nationality: result.nationality_cd || "",
            nationalityCd: { "Indian": "INIDAN", "American": "AMRCAN", "Nigerian": "NIGERIAN", "Afghan": "AFGHAN", "Andorran": "ANDORRAN", "Bangladesh": "BANGLADESH", "Belgian": "BELGIAN", "Canadian": "CANADIAN", "Jamaican": "JAMAICAN", "Japanese": "JAPANESE", "Korean": "KOREAN", "Maldivian": "MALDIVIAN", "Nepalese": "NEPALESE", "Others": "OTH" }[result.nationality_cd] || "",
            motherMaidenName: result.mother_maiden_name || "",
            //expiredDt: "",
            //isExpired: result.expiry_dt ? true : false,
            fromArea: "",
            photo: "",
            signature: "",
            proofUpload: "",
            phone: "",
            mobile: result.mobile_no1 || result.mobile_no2 || "",
            policy: [
                {
                    companyPolicy: "",
                    policyNumber: "",
                    groupNumber: "",
                    individualNumber: "",
                    primaryPolicy: "",
                    primaryNumber: ""
                }
            ],
            bloodGroupCd: result.blood_group_cd || "",
            resPersonName: result.father_name || "",
            tokenNumber: result.token_no || "",
        };
    } catch (error) {
        console.error(`Error preparing payload for event 900: ${error}`);
    }
}
function prepareEvent198(result, matchedMigId) {
    try {
        // console.log("result", result)
        return {
            fName: result.first_name || "",
            mName: "",
            lName: result.last_name || "",
            i_docCd: result.doctor_cd || "",
            phone: "",
            mobile: "",
            dispName: result.doctor || "",
            dob: "",
            emailID: "",
            regNo: "",
            photo: "",
            signature: "",
            userName: result.doctor_cd || "",
            password: "Password01",
            apmntReq: false,
            specializations: [
                {
                    cd: result.specilization ? { "cardiology": "CARD", "cardiothoracic surgeon": "CARDSURG", "general medicine": "GENMEDIC", "bmt": "BMT", "endocrinologist": "Endocrinologist", "dialysis": "DIALYSIS", "neuro surgery": "NEURSURG", "dialysis technician": "DIALYTECH" }[result.specilization.trim().toLowerCase()] || null : null,
                    name: result.specilization || "",
                    recStatus: true
                }
            ],
            docTypeName: result.doctor_type || "",
            docTypeCd: result.doctor_type ? { "physician": "PHY", "dentist": "DENT", "surgeon": "SURG", "cardiologists": "CARD", "audiologists": "AUDIO" }[result.doctor_type.trim()] || "" : "",
            titleName: result.title || "",
            titleCd: result.title ? { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.title.trim().toLowerCase()] || "" : "",
            genderCd: "",
            gender: "",
            speclityId: "",
            speclityCd: result.speciality || "",
            speclityName: result.speciality ? { "ADMNDEP": "Admin Department", "NEURSURG": "Neuro Surgery", "Endocrinologist": "Endocrinologist", "CARD": "Cardiology", "CARDIOLOGY": "Cardiology", "BMT": "BMT", "CTSURG": "Ct Surgery", "DIALYSIS": "DIALYSIS" }[result.speciality.trim()] || null : null,
            designationCd: "ADMN",
            designation: result.designation || "",
            locations: [
                {
                    settings: {
                        qmsOrder: "",
                        chekOutEditDays: "",
                        genericOrItem: "",
                        multiAptms: true,
                        waitListCount: "",
                        walkInAssignFirstWL: "",
                        vitals: {
                            BP: true,
                            PULSE: true,
                            WTG: true,
                            HGT: true,
                            BMI: true,
                            BSA: true,
                            BDGP: true,
                            HTRE: true,
                            TEM: true,
                            SPO2: true,
                            RPRT: true,
                            HDLG: true,
                            HDCFR: true,
                            WTCFR: true,
                            URISIS: true,
                            GRBS: true,
                            PAINSCR: true,
                            CHESTIN: true,
                            CHESTEX: true
                        }
                    },
                    shifts: [
                        {
                            from: "10:00",
                            to: "14:00",
                            type: "a",
                            duration: "10",
                            recStatus: true
                        }
                    ],
                    fees: {
                        reg: "",
                        normal: "",
                        emergency: "",
                        online: "",
                        reVisit: ""
                    },
                    locId: matchedMigId ? matchedMigId._id : '642d0a86570a0a1e0d6bde91',
                    locName: matchedMigId ? matchedMigId.locName : "Ameerpet",
                    locKey: matchedMigId ? matchedMigId.locKey : "emr",
                    roleId: "671b3f0148bb592270a812d6",
                    roleName: "Doctor"
                }
            ],
            audit: {
                documentedById: "642d0a87570a0a1e0d6bdeba",
                documentedBy: "emr@gmail.com",
                documentedDt: new Date().toISOString()
            }

        };
    } catch (error) {
        console.error(`Error preparing payload for event 198: ${error}`);
        return {};
    }
}
function prepareEvent181(result) {
    try {
        console.log("result", result)
        return {
            "medName": result.il2_name || "",
            "i_cd": result.item_cd || "",
            "isNarcotic": false,
            "isHazardous": false,
            "drugDose": "",
            "i_il1_cd": result.il1_cd || "",
            "i_il2_cd": result.il2_cd || "",
            "isHighrisk": false,
            "isLooklike": false,
            "isSoundlike": false,
            "isCritical": false,
            "isConsumable": false,
            "rateOfInfusion": "",
            "duration": "",
            "medPackSize": "",
            "itemCategory": "",
            "itemClass": "",
            "lookLikeCombinations": [],
            "soundLikeCombinations": [],
            "cimsCd": result.cimsid || "",
            "doseVolume": "",
            "prescribedUnitMulty": [],
            "prescribedDose": "",
            "formtypeCd": result.il3_desc.toUpperCase() || "",
            "formtypeName": result.il3_name.toUpperCase() || "",
            "i_il3_cd": result.il3_cd || "",
            "stock": [
                {
                    "type": result.item_name.split(",")[0] || "",
                    "quantity": result.item_name.split(",")[1] || ""
                }
            ],
            "tarrif": [
                { "type": "OP", "price": "" },
                { "type": "IP", "price": "" },
                { "type": "Insurance", "price": "" },
                { "type": "Arogyasree", "price": "" }
            ],
            audit: {
                documentedById: "6716207a63bfefeff4418687",
                documentedBy: "system",
                documentedDt: new Date().toISOString()
            }
        }
    } catch (error) {
        console.error(`Error preparing payload for event 181: ${error}`);
        return {};
    }
}
function prepareEvent184(result) {
    try {
        return {
            serviceTypeCd: result.SERVICE_TYPE_CD || "",//service_type_cd,
            serviceTypeName: result.SERVICE_TYPE_NAME || "",//service_type_name
            i_typecd: result.SERVICE_TYPE_CD || "",//service_type_cd || ""
            name: result.SERVICE_NAME || "",//service_name
            i_cd: result.SERVICE_CD || "",//service_cd
            instruction: "",//INSTRUCTIONS
            isOutside: false, //true,
            childAvailable: false, //true,
            mandInstruct: false,//true,//MANDATORY_INSTRUCTION
            isConsentForm: false,//true,//IS_CONSENT_FORM
            isDiet: (!result.IS_DIET || result.IS_DIET == "N") ? false : true,//is_diet
            isQtyEdit: true,//IS_QUANTITY_EDIT
            isAppointment: false,//true ,//IS_APPOINTMENT
            isSampleNeeded: (!result.IS_SAMPLE_NEEDED || result.IS_SAMPLE_NEEDED == "N") ? false : true,//is_sample_needed
            image: "",
            i_groupcd: result.SERVICE_GROUP_CD || "", //service_group_cd || ""
            serviceGroupCd: result.SERVICE_GROUP_CD || "", //service_group_cd || "",//"BIO"
            serviceGroupName: result.SERVICE_GROUP_NAME || "", //service_group_name || "", //"BIOCHEMISTRY"
            specimenCd: "",
            specimen: "",//SPECIMEN
            containerCd: "",
            container: "",//CONTAINER
            isApplicableForCd: "OP",
            isApplicableFor: "OP",//IS_APPLICABLE_FOR
            tarrif: [
                { "type": "OP", "price": "" },
                { "type": "IP", "price": "" },
                { "type": "Insurance", "price": "" },
                { "type": "Arogyasree", "price": "" }
            ],
            ageGenderRanges: {
                "male": [{ "age": "", "range": "" }],
                "female": [{ "age": "", "range": "" }],
                "default": [{ "age": "", "range": "" }]
            },
            parameters: [],
            audit: {
                documentedById: "6716207a63bfefeff4418687",
                documentedBy: "system",
                documentedDt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error(`Error preparing payload for event 701: ${error.message}`);
        return {};
    }
}
function prepareEvent700(result) {
    try {

        let isApptTime = new Date();
        let minutes = isApptTime.getMinutes();
        if (minutes % 10 !== 0) {
            isApptTime.setMinutes(Math.ceil(minutes / 10) * 10, 0, 0);
        } else {
            isApptTime.setSeconds(0, 0);
        }

        return {
            "docId": "",
            "docDetails": "",
            "consultationNo": result.consultationno || "",
            "isVIP": result.is_vip || false, 
            "patName": result.display_name || result.first_name || "",
            "reasonForVisit": "Illness",
            "email": "",
            "mobile": result.mobile_no2 || "", 
            "apmntType": result.consultation_type || "NORMAL", 
            "address": result.address2 || result.address1 || "", 
            "refBy": "",
            "titleCd": result.titile_cd ? { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.titile_cd.trim().toLowerCase()] || "" : "",
            "titleName": result.title_cd || "",
            "shiftId": "",
            "locId": "",
            "patId": "",
            "UMR": result.umr_no,
            "age": new Date().getFullYear() - new Date(result.dob).getFullYear() + "Y", 
            "gender": { "F": "Female", "M": "Male" }[result.gender_cd] || "", 
            "visit": result.consultationno,
            "apmntDtTime": result.consultationType || isApptTime ||  "",
            "amount": 0.00,
            "isPayment": false,
            "paymentMode": "",
            "queueNo": "",
            "status": "BOOKED",
            "admnNo": "",
            "admnDt": "",
            "remarks": "",
            "source": "",
        };
    } catch (error) {
        console.error(`Error preparing payload for event 701: ${error.message}`);
    }
}

async function getMongoData(collection, filter, db) {
    return mongoMapper(collection, 'find', filter, db).then(async result => {
        let response = JSON.parse(JSON.stringify(result));

        if (!response.data || response.data.length === 0) {
            let errorMsg = `No records found in ${collection}`;
            await logMessage('info', errorMsg);
            return { success: false, data: [], desc: errorMsg };
        }

        await logMessage('info', `getData successful from collection ${collection}, ${response.data.length} records found`)
        return { success: true, data: response.data, desc: [] };

    }).catch(async error => {
        let errorMsg = `Failed to find records in ${collection} -- ${error.message}`;
        await logMessage('error', errorMsg);
        return { success: false, data: [], desc: errorMsg };
    });
}

async function bookApmnt(collectionName, preparedData, dbName, eventId, _docLoc) {
    let _finalResp = [];
    let _lstApmntDt = moment(preparedData.apmntDtTime).toISOString();
    let _amount = 0.00;
    if (preparedData.apmntType === "NORMAL") {
        _amount = parseFloat(_docLoc.fees.normal);
    }
    else if (preparedData.apmntType === "ONLINE") {
        _amount = parseFloat(_docLoc.fees.online);
    }
    else if (preparedData.apmntType === "REVISIT") {
        _amount = parseFloat(_docLoc.fees.reVisit);
    }
    else if (preparedData.apmntType === "EMERGENCY") {
        _amount = parseFloat(_docLoc[0].fees.emergency);
    }
    preparedData['isPayment'] = _amount === 0 ? true : false;
    let _gPayload = await generateSlotsPayload(preparedData, _lstApmntDt, _docLoc.shifts[0].duration, 1, 0, [], "", "", req);
    if (!(_gPayload && _gPayload.success)) {
        return { success: false, desc: _gPayload.desc };
        //return res.status(400).json({ success: false, status: 400, desc: _gPayload.desc || "Error occurred while Generating Slots Payload", data: [] });
    }
    _.each(_gPayload.data, (_o) => {
        _finalResp.push(_o.data);
    });
    await logMessage('info', `prepared payload successful for Book appointment `)
    return { success: true, data: _finalResp, desc: [] };
}

async function insertOrUpdateData(collectionName, preparedData, dbName, eventId, matchedMigId, _docLoc) {
    try {
        //const specialEventIds = ['7011', '9001', '1981', '1811', '184', '7001'];
        const specialEventIds = ['900', '198', '700'];
        let existingRecord;
        let eventConfigItem = eventConfig[eventId];
        if (specialEventIds.includes(eventId)) {
            let _filter;
            if (eventId === '198') {
                _filter = { "filter": { "userName": preparedData.userName }, "selectors": "-audit -history" }
            } else if (eventId === '900') {
                _filter = { "filter": { 'UMR': preparedData.UMR }, "selectors": {} }
            } else if (eventId === '1811') {
                _filter = { "filter": { "i_cd": preparedData.i_cd }, "selectors": {} }
            } else if (eventId === '184') {
                _filter = { "filter": { "i_cd": preparedData.i_cd }, "selectors": {} }
            } else if (eventId === '700') {
                _filter = {  "filter": { 'docDetails.docId': preparedData.docId, 'consultationNo': preparedData.consultationNo },  "selectors": {} }
            }
            existingRecord = await mongoMapper(collectionName, 'find', _filter, dbName);
        }
        if (existingRecord && existingRecord.data.length > 0) {
            await logMessage('info', `INSIDE IF EXISTING RECORD UPDATING"${collectionName}`);
            if (eventId === '700') {
                await logMessage('info', `Appointment has already booked against docId ${preparedData.docId} and consultationNo ${preparedData.consultationNo}`);
                return { success: true };
            }
            else {
                let _payload = {
                    by: { _id: existingRecord.data[0]._id },
                    query: { $set: preparedData },
                    mode: { $upsert: true }
                }
                let updateResult = await mongoMapper(collectionName, 'findOneAndUpdate', _payload, dbName);
                await logMessage('info', `INSIDE IF EXISTING RECORD UPDATING"${collectionName}`);
                if (!(updateResult && updateResult.data)) {
                    let errorMsg = `Failed to update data in ${collectionName} for UMR ${preparedData.UMR}`;
                    await logMessage('error', errorMsg);
                    return { success: false, desc: errorMsg };
                }
                await logMessage('info', `already exists, record updated against to existing record in collection "${collectionName}"`);
                return { success: true };
            }
        }
        else if (specialEventIds.includes(eventId)) {
            await logMessage('info', `INSIDE ELSE NEW RECORD INSERTION"${collectionName}`);
            if (eventConfigItem && eventConfigItem.seqName) {
                let req = {
                    tokenData: {
                        dbType: dbName
                    }
                }
                let _seqResp = await _mUtils.getSequenceNextValue({ locId: matchedMigId._id, seqName: eventConfigItem.seqName }, "cm", req);
                if (!(_seqResp && _seqResp.success)) {
                    let errorMsg = `Failed to preocess getSequenceNextValue for eventId ${eventId}, ${eventInsertResult.desc}`
                    await logMessage('Error', errorMsg)
                    return { success: false, desc: errorMsg };
                }
                else {
                    if (eventId === '198') {
                        preparedData["docCd"] = _seqResp.data;
                    }
                    else {
                        preparedData['cd'] = _seqResp.data
                    }
                }
            }
            if (eventId && eventId == '700') {
                let bookAppointment = await bookApmnt(collectionName, preparedData, dbName, eventId, _docLoc);
                if (!bookAppointment.success) {
                    await logMessage('info', `No data found with recStatus true in cm_mirtheventtrans`)
                    return { success: false, desc: errorMsg };
                }
                preparedData = bookAppointment.data[0];
            }
            let insertResult = await mongoMapper(collectionName, "insertMany", preparedData, dbName);
            await logMessage('info', `INSIDE ELSE NEW RECORD INSERTION2"${collectionName}`);
            if (!(insertResult && insertResult.data)) {
                let errorMsg = `Failed to insert data into ${collectionName} `;
                await logMessage('error', errorMsg);
                return { success: false, data: [], desc: errorMsg };
            }
            await logMessage('info', `Data inserted sucessfully into "${collectionName}`);
            if (eventId === '198') {
                let location = preparedData.locations[0];
                let _lData = [];
                _lData.push({ locId: location.locId, locName: location.locName, roleId: location.roleId, roleName: location.roleName });
                let empData = {
                    _id: insertResult.data[0]._id,
                    loc: _lData
                }
                let doctorReq = {
                    tokenData: {
                        orgId: '642d0a86570a0a1e0d6bde8c',
                        dbType: dbName
                    },
                    cAudit: preparedData.audit,
                    body: {
                        params: {
                            sessionId: "",
                            userName: preparedData.userName,
                            password: preparedData.password,
                            dispName: preparedData.dispName
                        }
                    }
                };
                //console.log("ise empData", doctorReq, empData, empData.loc);
                let _userRep = await insertAndUpdateUser("I", doctorReq, empData);
                if (!(_userRep && _userRep.success)) {
                    let _fParams = {
                        params: {
                            userInsertion: false,
                            _id: result.data[0]._id
                        }
                    }
                    let pLoadResp = await _mUtils.preparePayload('U', _fParams);
                    if (!(pLoadResp.success)) {
                        let errorMsg = `Failed to prepare payload for user insertion false: ${pLoadResp.desc}`;
                        await logMessage('error', errorMsg);
                        return { success: false, data: [], desc: errorMsg };
                    }
                    else {
                        try {
                            const updateResult = await mongoMapper(collectionName, "findOneAndUpdate", pLoadResp.payload, dbName)
                            let errorMsg = `Doctor inserted, but Failed to insert in users: ${updateResult.data}`;
                            await logMessage('error', errorMsg);
                            return { success: false, desc: errorMsg };
                        } catch (error) {
                            console.error(`Error updating doctor userInsetion key in record: ${error.desc || error}`);
                            return { success: false };
                        }
                    }
                }
                await logMessage('info', `Doctor data processed sucessfully for "${preparedData.userName}"`);
                return { success: true};
            }
            else if (eventId === '700') {
                if (preparedData.UMR) {
                    let _obj = {
                        "visitId": preparedData.apmntId ? insertResult.data._id : insertResult.data[0]._id,
                        "dateTime": preparedData.apmntId ? insertResult.data.audit.documentedDt : insertResult.data[0].audit.documentedDt,
                        "docName": preparedData.apmntId ? `${insertResult.data.docDetails.name} ${insertResult.data.docDetails.degree}` : `${insertResult.data[0].docDetails.name} ${insertResult.data[0].docDetails.degree}`,
                        "docId": preparedData.apmntId ? insertResult.data.docDetails.docId : insertResult.data[0].docDetails.docId,
                        "locId": preparedData.apmntId ? insertResult.data.locId : insertResult.data[0].locId,
                        "visit": "OP",
                        "visitNo": preparedData.apmntId ? insertResult.data.code : insertResult.data[0].code || "",
                        "status": preparedData.apmntId ? insertResult.data.status : insertResult.data[0].status,
                    };
                    let _patResp = await updateVisitsOrBillData(preparedData.UMR, "VISITS", _obj, req);
                    if (!(_patResp && _patResp.success)) {;
                        return { success: false, desc: errorMsg };
                    }
                }
                return { success: true};
            }
            return { success: true };
        }
    } catch (error) {
        let errorMsg = `Error inserting or updating data into ${collectionName}: ${error}`;
        await logMessage('error', errorMsg);
        return { success: false, desc: errorMsg };
    }
}

async function updateRecStatus(record, eventId, dbName) {
    let _sParams = {
        query: "bulkWrite",
        flag: "BW",
        "params": {
            "_id": record._id,
            "eventTrackId": record.SERVICE_ID || record.eventTrackId,
            "eventId": eventId,
            "recStatus": false,
        }
    };
    try {
        let pLoadResp = await _mUtils.preparePayload("BW", _sParams);
        if (!(pLoadResp.success)) {
            let errorMsg = `Failed to update recStatus for eventTrackId ${record.eventTrackId || record.SERVICE_ID} with _id ${record._id} : ${pLoadResp.desc}`;
            await logMessage('error', errorMsg);
            return { success: false, data: [], desc: errorMsg };
        }
        await mongoMapper('cm_mirtheventtrans', 'bulkWrite', pLoadResp.payload, dbName);
        await logMessage('info', `Record status updated for eventTrackId ${record.eventTrackId || record.SERVICE_ID} with _id ${record._id}.`);
        return { success: true }
    } catch (error) {
        let errorMsg = `Error updating recStatus for eventTrackId ${record.eventTrackId || record.SERVICE_ID} with _id ${record._id} : ${error}`;
        await logMessage('error', errorMsg);
        return { success: false, data: [], desc: errorMsg };
    }
}

async function getdata(dbName) {
    let _filter = {
        filter: { recStatus: { $eq: true } },
        selectors: "-history -child.audit -child.history",
    };
    try {
        let getdata = await getMongoData('cm_mirtheventtrans', _filter, dbName);
        if (!getdata.success) {
            await logMessage('info', `No data found with recStatus true in cm_mirtheventtrans`)
            return;
        }
        if (getdata && Array.isArray(getdata.data) && getdata.data.length > 0) {
            let filteredData = getdata.data.filter(record => eventConfig[record.eventId]);
            if (filteredData.length === 0) {
                await logMessage('info', "No records found with valid eventId matching the eventConfig.");
                return;
            } else {
                for (let record of filteredData) {
                    let patId;
                    let eventId = record.eventId;
                    let eventConfigItem = eventConfig[eventId];
                    if (!eventConfigItem) {
                        await logMessage('Error', `Skipping record with eventId ${eventId}, no matching event configuration found.`);
                        continue;
                    }
                    let collectionName = eventConfigItem.collectionName;
                    let migID = record.mig_id || record.data.mig_id;
                    let _filter = {
                        "filter": { 'locations[0].migId': migID },
                        "selectors": {}
                    }
                    let locRecord = await mongoMapper('cm_organization', 'find', _filter, dbName);
                    let matchedMigId = locRecord.data.flatMap(item => item.locations).find(location => location.migId == migID);
                    let preparedData = eventConfigItem.preparePayload(record.data || record, matchedMigId);
                    preparedData["locId"] = matchedMigId._id || JSON.parse(JSON.stringify(matchedMigId._id))
                    req.tokenData["locId"] = matchedMigId._id || JSON.parse(JSON.stringify(matchedMigId._id))

                    let _docLoc;
                    if (eventId === '700') {
                        let _docFilter = { "filter": { "i_docCd": record.data.rsrc_cd }, "selectors": "-audit -history" }
                        let _mResp;
                        _mResp = await _mUtils.commonMonogoCall("cm_doctors", "find", _docFilter, "", "", "", dbName)
                        if ((_mResp && _mResp.success && _mResp.data.length === 0)) {
                            let docFilter = { "filter": { "docCd": record.rsrc_cd }, "selectors": "-audit -history" }
                            _mResp = await _mUtils.commonMonogoCall("cm_doctors", "find", docFilter, "", "", "", req.tokenData.dbType);

                            if ((!(_mResp && _mResp.success)) || (_mResp && _mResp.success && _mResp.data.length === 0)) {
                                let errorMsg = `There is no Doctor available in this hospital against to ${record.rsrc_cd}`
                                await logMessage('Error', errorMsg)
                                updateRecStatus(record, eventId, dbName)
                                continue;
                            }
                        }
                        _docLoc = _mResp.data.flatMap(item => item.locations).find(location => location.locId == preparedData.locId);
                        let docDetails = {
                            "docId": JSON.parse(JSON.stringify(_mResp.data[0]._id)),
                            "cd": _mResp.data[0].docCd || "",
                            "name": _mResp.data[0].dispName,
                            "regNo": _mResp.data[0].regNo || "",
                            "degree": _mResp.data[0].degree || "",
                            "designation": _mResp.data[0].designation || "",
                            "specName": _mResp.data[0].specName || "",
                            "imgSign": _mResp.data[0].imgSign || "",
                            "titleName": _mResp.data[0].titleName || ""
                        }
                        let shiftTimeId = null;
                        preparedData.apmntDtTime = new Date(preparedData.apmntDtTime);
                        let _docShift = _docLoc.shifts || [];
                        for(let i = 0; i < _docShift.length; i++){
                            let shift = _docShift[i];
                            let shiftFrom = moment(shift.from, "HH:mm").toDate();
                            let shiftTo = moment(shift.to, "HH:mm").toDate();

                            if(preparedData.apmntDtTime >= shiftFrom && preparedData.apmntDtTime <= shiftTo){
                                shiftTimeId = shift._id;
                                break;
                            } else if (preparedData.apmntDtTime < shiftFrom){
                                preparedData.apmntDtTime = shiftFrom;
                                shiftTimeId = shift._id;
                                break;
                            } else if (preparedData.apmntDtTime > shiftTo && i + 1 < _docShift.length){
                                let nextShift = _docShift[i + 1];
                                let nextShiftFrom = moment(nextShift.from, "HH:mm").toDate();
                                if(preparedData.apmntDtTime >= shiftTo && preparedData.apmntDtTime < nextShiftFrom){
                                    preparedData.apmntDtTime = nextShiftFrom;
                                    shiftTimeId = nextShift._id;
                                    break;
                                }

                            } else if (preparedData.apmntDtTime > shiftTo && i === _docShift.length - 1){
                                shiftTimeId = shift._id;
                                break;
                            }
                        }
                        preparedData["docId"] = JSON.parse(JSON.stringify(_mResp.data[0]._id));
                        preparedData["shiftId"] = shiftTimeId || JSON.parse(JSON.stringify(_docLoc.shifts[0]._id));
                        preparedData["patId"] = patId;
                        preparedData["docDetails"] = docDetails;
                    }
                    let eventInsertResult = await insertOrUpdateData(collectionName, preparedData, dbName, eventId, matchedMigId, _docLoc);
                    if (!(eventInsertResult.success)) {
                        let errorMsg = `Failed to preocess record for eventId ${eventId}, ${eventInsertResult}`
                        await logMessage('Error', errorMsg)
                        continue;
                    }
                    let updateResult = await updateRecStatus(record, eventId, dbName);
                    if (!(updateResult.success)) {
                        let errorMsg = `Failed to update recStatus for eventId ${eventId}: ${updateResult.desc}`
                        await logMessage('Error', errorMsg);
                    } else {
                        await logMessage('info', `Sucessfully processed and updated recStatus for eventId ${eventId}`)
                        await logMessage('info', `-------------------------------------     SUCCESSFULLY COMPLETED    ----------------------------------`)
                    }
                }
            }
        } else {
            await logMessage('info', "No matching records found for processing.");
        }
    } catch (error) {
        await logMessage('Error', `Error fetching data from mongoDB: ${error}`)
    }

}

cron.schedule('*/10 * * * * *', () => {
    console.log("starting emr mirthEventsTransaction service")
    getdata('emr');
});

module.exports = router;
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

const loggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/rh_hims_events_data/%DATE%.log`,
        maxFiles: '15d',
        maxsize: 10000000
    })
];

const errorLoggingTransports = [
    new DailyRotateFile({
        name: 'file',
        datePattern: 'YYYYMMDD',
        filename: `${dirPath}public/logs/winston/rh_hims_events_data/%DATE%.log`,
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
    '181': {
        collectionName: 'cm_medications',
        preparePayload: prepareEvent181,
        specialHandling: true,
        seqName: "Medication"
    },
    '184': {
        collectionName: 'cm_investigations',
        preparePayload: prepareEvent184,
        specialHandling: true,
        seqName: "Investigation"
    }
};

function prepareEvent900(result) {
    try {
        return {
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
                documentedById: "6716207a63bfefeff4418687",
                documentedBy: "system",
                documentedDt: new Date().toISOString()
            },
            registDt: result.reg_dt || "",
            registExpireDt: "",
            titleName: result.titile_cd || "",
            titleCd: result.titile_cd ? { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.titile_cd.trim().toLowerCase()] || "" : "",
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
        return {};
    }
}
function prepareEvent198(result, matchedMigId) {
    try {
        return {
            fName: result.first_name,
            mName: "",
            lName: result.last_name,
            i_docCd: result.doctor_cd || "",
            phone: "",
            mobile: "",
            dispName: result.doctor,
            dob: "",
            emailID: "",
            regNo: "",
            photo: "",
            signature: "",
            userName: result.doctor_cd,
            password: "Password01",
            apmntReq: false,
            specializations: [
                {
                    cd: result.specilization ? { "cardiology": "CARD", "cardiothoracic surgeon": "CARDSURG", "general medicine": "GENMEDIC", "bmt": "BMT", "endocrinologist": "Endocrinologist", "dialysis": "DIALYSIS", "neuro surgery": "NEURSURG", "dialysis technician": "DIALYTECH" }[result.specilization.trim().toLowerCase()] || null : null,
                    name: result.specilization,
                    recStatus: true
                }
            ],
            docTypeName: result.doctor_type,
            docTypeCd: result.doctor_type ? { "physician": "PHY", "dentist": "DENT", "surgeon": "SURG", "cardiologists": "CARD", "audiologists": "AUDIO" }[result.doctor_type.trim()] || "" : "",
            titleName: result.title || "",
            titleCd: result.title ? { "mr": "MR", "mrs": "MRS", "dr": "DR", "ms": "MS" }[result.title.trim().toLowerCase()] || "" : "",
            genderCd: "",
            gender: "",
            speclityId: "",
            speclityCd: result.speciality,
            speclityName: result.speciality ? { "ADMNDEP": "Admin Department", "NEURSURG": "Neuro Surgery", "Endocrinologist": "Endocrinologist", "CARD": "Cardiology", "CARDIOLOGY": "Cardiology", "BMT": "BMT", "CTSURG": "Ct Surgery", "DIALYSIS": "DIALYSIS" }[result.speciality.trim()] || null : null,
            designationCd: "ADMN",
            designation: result.designation,
            locations: [
                {
                    settings: {
                        qmsOrder: "F",
                        chekOutEditDays: "",
                        genericOrItem: "GS",
                        multiAptms: true,
                        waitListCount: "",
                        walkInAssignFirstWL: "FA",
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
                    locId: matchedMigId ? matchedMigId._id : '643015a8dcb6ba449bcd9deb',
                    locName: matchedMigId ? matchedMigId.locName : "Vijayawada",
                    locKey: matchedMigId ? matchedMigId.locKey : "VJW",
                    roleId: "6435677ce340ab6b7307f812",
                    roleName: "Doctor"
                }
            ],
            audit: {
                documentedById: "6716207a63bfefeff4418687",
                documentedBy: "system",
                documentedDt: new Date().toISOString()
            }

        };
    } catch (error) {
        console.error(`Error preparing payload for event 900: ${error}`);
        return {};
    }
}
function prepareEvent181(result) {
    try {
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
        console.error(`Error preparing payload for event 900: ${error}`);
        return {};
    }
}
function prepareEvent184(result) {
    try {
        return {
            serviceTypeCd: result.service_type_cd,
            serviceTypeName: result.service_type_name,
            i_typecd: result.service_type_cd || "",
            name: result.service_name,
            i_cd: result.service_cd,
            instruction: "",
            isOutside: true,
            childAvailable: true,
            mandInstruct: true,
            isConsentForm: true,
            isDiet: (!result.is_diet || result.is_diet == "N") ? false : true,
            isQtyEdit: true,
            isAppointment: true,
            isSampleNeeded: (!result.is_sample_needed || result.is_sample_needed == "N") ? false : true,
            image: "",
            i_groupcd: result.service_group_cd || "",
            serviceGroupCd: result.service_group_cd || "",//"BIO",
            serviceGroupName: result.service_group_name || "", //"BIOCHEMISTRY",
            specimenCd: "",
            specimen: "",
            containerCd: "",
            container: "",
            isApplicableForCd: "OP",
            isApplicableFor: "OP",
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

async function insertOrUpdateData(collectionName, preparedData, dbName, eventId, matchedMigId) {
    try {
        const specialEventIds = ['900', '198', '181', '184'];
        let existingRecord;
        let eventConfigItem = eventConfig[eventId];
        if (specialEventIds.includes(eventId)) {
            let _filter;
            if (eventId === '198') {
                _filter = { "filter": { "userName": preparedData.userName }, "selectors": "-audit -history" }
            } else if (eventId === '900') {
                _filter = { "filter": { 'UMR': { $eq: preparedData.UMR } }, "selectors": {} }
            } else if (eventId === '181') {
                _filter = { "filter": { "i_cd": preparedData.i_cd }, "selectors": {} }
            } else if (eventId === '184') {
                _filter = { "filter": { "i_cd": preparedData.i_cd }, "selectors": {} }
            }
            existingRecord = await mongoMapper(collectionName, 'find', _filter, dbName);
        }
        if (existingRecord && existingRecord.data.length > 0) {
            await logMessage('info', `INSIDE IF EXISTING RECORD UPDATING"${collectionName}`);
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
            //return { success: true };
        } else if (specialEventIds.includes(eventId)) {
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
                        orgId: '643015a8dcb6ba449bcd9de3',
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
                        } catch (error) {
                            console.error(`Error updating doctor userInsetion key in record: ${error.desc || error}`);
                        }
                    }
                }
                await logMessage('info', `Doctor data processed sucessfully for "${preparedData.userName}"`);
            }
        }
        return { success: true };
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
            "eventTrackId": record.eventTrackId,
            "eventId": eventId,
            "recStatus": false,
        }
    };
    try {
        let pLoadResp = await _mUtils.preparePayload("BW", _sParams);
        if (!(pLoadResp.success)) {
            let errorMsg = `Failed to update recStatus for eventTrackId ${record.eventTrackId} with _id ${record._id} : ${pLoadResp.desc}`;
            await logMessage('error', errorMsg);
            return { success: false, data: [], desc: errorMsg };
        }
        await mongoMapper('cm_mirtheventtrans', 'bulkWrite', pLoadResp.payload, dbName);
        await logMessage('info', `Record status updated for eventTrackId ${record.eventTrackId} with _id ${record._id}.`);
        return { success: true }

    } catch (error) {
        let errorMsg = `Error updating recStatus for eventTrackId ${record.eventTrackId} with _id ${record._id} : ${error.message}`;
        await logMessage('error', errorMsg);
        return { success: false, data: [], desc: errorMsg };
    }
}

async function getdata(dbName) {
    console.log("inside getdata");
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
                    let eventId = record.eventId;
                    let eventConfigItem = eventConfig[eventId];
                    if (!eventConfigItem) {
                        await logMessage('Error', `Skipping record with eventId ${eventId}, no matching event configuration found.`);
                        continue;
                    }
                    let collectionName = eventConfigItem.collectionName;
                    let _filter = {
                        "filter": { 'locations[0].migId': record.data.mig_id },
                        "selectors": {}
                    }
                    let locRecord = await mongoMapper('cm_organization', 'find', _filter, dbName);
                    let matchedMigId = locRecord.data.flatMap(item => item.locations).find(location => location.migId === record.data.mig_id);
                    let preparedData = eventConfigItem.preparePayload(record.data, matchedMigId);
                    let eventInsertResult = await insertOrUpdateData(collectionName, preparedData, dbName, eventId, matchedMigId);
                    if (!(eventInsertResult.success)) {
                        let errorMsg = `Failed to preocess record for eventId ${eventId}, ${eventInsertResult.desc}`
                        await logMessage('Error', errorMsg)
                        continue;
                    }
                    let updateResult = await updateRecStatus(record, eventId, dbName);
                    if (!(updateResult.success)) {
                        let errorMsg = `Failed to update recStatus for eventId ${eventId}: ${updateResult.desc}`
                        await logMessage('Error', errorMsg);
                    } else {
                        await logMessage('info', `Sucessfully processed and updated recStatus for eventId ${eventId}`)
                    }
                }
            }
        } else {
            await logMessage('info', "No matching records found for processing.");
        }
    } catch (error) {
        await logMessage('Error', `Error fetching data from mongoDB: ${error.message}`)
    }
}

cron.schedule('*/10 * * * * *', () => {
    console.log("starting rh mirthEventsTransaction service")
    getdata('rh');
});

module.exports = router;
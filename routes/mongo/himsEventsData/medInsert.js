const _ = require('lodash');
const axios = require('axios');
const cron = require('node-cron');
const _mUtils = require("../../../constants/mongo-db/utils");
const medicationsData = require('./kmclinic_Medication_Master');
//const _inserttedMedications = require('./cm_km.medications');

let req = { tokenData: { dbType: 'sh', locId: "673ad5042a36715fbc9284f9" } };

function transformRecord(result) {
    try {
        let drugDose = "";
        let unitCd = "";
        if (result.DOSE) {
            if (typeof result.DOSE === 'number') {
                drugDose = result.DOSE;
                unitCd = "";
            } else if (typeof result.DOSE === 'string') {
                if (result.DOSE.includes("/")) {
                    drugDose = result.DOSE;
                    unitCd = "";
                } else {
                    let doseMatch = result.DOSE.match(/^([\d.]+)([a-zA-Z]+)$/);
                    if (doseMatch) {
                        drugDose = parseFloat(doseMatch[1]);
                        unitCd = doseMatch[2];
                    } else {
                        drugDose = result.DOSE;
                        unitCd = result.DOSE
                    }
                }

            }
        }
        return {
            "medName": `${result.DRUG_NAME} ${result.DOSE || ""}`.trim() || "",
            "drugDose": drugDose || "",
            "unitCd": unitCd || "",
            "unitName": unitCd || "",
            "tarrif": [],
            audit: {
                documentedById: "673ad5052a36715fbc928c3b",
                documentedBy: "sh_practiceadmin",
                documentedDt: new Date().toISOString()
            }
        }
    } catch (error) {
        console.log(`Error preparing payload for medications: ${error}`);
        return {};
    }
}


async function processMedData() {
    try {
        for (let _o of medicationsData) {
            _o["FORMETTED_MED_NAME"] = `${_o.DRUG_NAME} ${_o.DOSE}`;
        }
        let _uMedication = _.uniqBy(medicationsData, 'FORMETTED_MED_NAME')
        let _finalMedData = [];
        for (let record of _uMedication) {
            const medRecord = transformRecord(record);
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Medication' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                console.log("Error occurred while generating Investigation Code.. ");
                continue;
            }
            medRecord["cd"] = _seqResp.data;
            //console.log("medRecord", medRecord)
            _finalMedData.push(medRecord);
            //console.log("_finalMedData", _finalMedData)
        }
        console.log("_finalMedData22", _finalMedData)
        let _insertResult = await _mUtils.commonMonogoCall("cm_medications", "insertMany", _finalMedData, "", "", "", req.tokenData.dbType)
        if (!(_insertResult && _insertResult.success)) {
            console.log("Error occurred while generating medication Code.. ");
            return;
        }
        console.log("Investigation record insertted successfully..", _insertResult.data);

    } catch (err) {
        console.log("Run time error: ", err)
    }
}

async function processStockEntriesData() {
    try {
        //let _uMedication = _.groupBy(medicationsData, 'DRUG NAME');
        for (let _o of medicationsData) {
            _o["FORMETTED_MED_NAME"] = `${_o.DRUG_NAME} ${_o.DOSE}`;
        }
        let _uMedication = _.uniqBy(medicationsData, 'FORMETTED_MED_NAME')
        let _mData = _.map(_uMedication, (_v, _k) => {
            let medName = `${_v.DRUG_NAME} ${_v.DOSE || ""}`.trim();
            let _existsMedication = _.filter(_inserttedMedications, (_eo) => { return _eo.medName === medName });
            //console.log("_existsMedication", _existsMedication)
            return {
                "productId": _existsMedication && _existsMedication.length > 0 ? _existsMedication[0]._id.$oid : "",
                "productName": medName,
                "dosageForm": _existsMedication && _existsMedication.length > 0 ? _existsMedication[0].unitCd : "",
                "quantityReceived": _v.TOTAL_QUANTITY || "",
                "batchNumber": "",
                "manufactureDate": _v.MFD_DATE || "",
                "expirationDate": _v.EXP || "",
                "quantityPerBatch": _v.TOTAL_QUANTITY || ""
            }
        });
        console.log("_mData", _mData)

        for (let _o of _mData) {
            // pLoadResp = await _mUtils.preparePayload('BW', { params: _o });
            // if (!pLoadResp.success) {
            //     console.log("Error occurred while preparing Payload", pLoadResp.desc);
            // }
            //let _uResp = await _mUtils.commonMonogoCall("cm_stock_entries", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'grnEntry' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                console.log("Error occurred while generating Investigation Code.. ");
                continue;
            }
            _o["grnNumber"] = _seqResp.data;
            let _uResp = await _mUtils.commonMonogoCall("cm_grn_entries", 'insertMany', _o, "", "", "", req.tokenData.dbType);
            if (!(_uResp && _uResp.success && _uResp.data)) {
                console.log("Error occurred while preparing Payload", _uResp.desc);
            } else {
                console.log("Medications Parameter mapped sucessfully..", _uResp)
            }
        }
    } catch (error) {
        console.log("error in processStockEntriesData", error)
    }

}

setTimeout(() => {
    processMedData();
    //processStockEntriesData();
}, 6000);

const _ = require('lodash');
const axios = require('axios');
const cron = require('node-cron');
const _mUtils = require("../../../constants/mongo-db/utils");
const frequencyMaster = require('./Frequency_Master');
//const _inserttedMedications = require('./cm_km.medications');

let req = { tokenData: { dbType: 'km', locId: "67332700efbf5fc46f62eacc" } }; //km - 673313b8199c57efb3cfc10e ah - 67172d7a59f27710711cfb9d rh- 643015a8dcb6ba449bcd9deb

function transformRecord(result) {
    try {
        let frequencyMatch = result.FREQUENCY.match(/^(.+?)(?:\s*\((\d+\s*-\s*\d+\s*-\s*\d+)\))?$/);
        let cd = frequencyMatch && frequencyMatch[1] ? frequencyMatch[1].trim() : result.FREQUENCY;
        let indicator = frequencyMatch && frequencyMatch[2] ? frequencyMatch[2].trim() : "";
        return {
            "cd": cd || result.FREQUENCY.split('')[0].toUpperCase(),
            "label":result.FREQUENCY,
            "value":result.Quantity,
            "timings":result.Timingss,
            "indicator": indicator || result.FREQUENCY.match(/\d+\s*-\s*\d+\s*-\s*\d+/) ? result.FREQUENCY.match(/\d+\s*-\s*\d+\s*-\s*\d+/)[0] : "",
            "lang": result.lang.map(langItem => ({
                "label": langItem.label,
                "value":langItem.value
            })),
            audit: {
                documentedById: "67332702efbf5fc46f62f120",//km -- 673313b8199c57efb3cfc762  ah - 67172d9159f2771071219fa3
                documentedBy: "km_practiceadmin", //km -- km_practiceadmin ah - aayush@gmail.com
                documentedDt: new Date().toISOString()
            }
        }
    } catch (error) {
        console.log(`Error preparing payload for medications: ${error}`);
        return {};
    }
}

async function processFrequencyData(){
    try{
        const transformFrequencies = [];
        for (let freq of frequencyMaster){
            const transformedFrequency = await transformRecord(freq);
            transformFrequencies.push(transformedFrequency);
        }

        let _fParams = {
            params: {
                _id: "67332701efbf5fc46f62ec8f", //ah - 67172d7a59f27710711cfd1a km - 673313b8199c57efb3cfc2d1
                child: transformFrequencies
            }
        }
        let pLoadResp = { payload: {} };
        pLoadResp = await _mUtils.preparePayload('U', _fParams);
        if (!pLoadResp.success) {
            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc, data: [] });
        }
        let _uResp = await _mUtils.commonMonogoCall("cm_entity", 'findOneAndUpdate',  pLoadResp.payload, "", "", "", req.tokenData.dbType);
            if (!(_uResp && _uResp.success && _uResp.data)) {
                console.log("Error occurred while preparing Payload", _uResp.desc);
            } else {
                console.log("Medications Parameter mapped sucessfully..", _uResp)
            }
    } catch (err) {
        console.log("Run time error: ", err)
    }
}

setTimeout(() => {
    //processFrequencyData();
}, 6000);
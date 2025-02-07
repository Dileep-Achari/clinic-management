
const _ = require('lodash');
const axios = require('axios');
const cron = require('node-cron');
const _mUtils = require("../../../constants/mongo-db/utils");
const servicesData = require('./lab_service_data');
//const _inserttedServices = require('./cm_sh.investigations');

let req = { tokenData: { dbType: 'kd', locId: "673ad5042a36715fbc9284f9" } };

const _serviceGroups = [
    {
        "SERVICE_GROUP_CD": "BIO",
        "SERVICE_GROUP_NAME": "Biochemistry"
    },
    {
        "SERVICE_GROUP_CD": "MIC",
        "SERVICE_GROUP_NAME": "Microbiology"
    },
    {
        "SERVICE_GROUP_CD": "BLO",
        "SERVICE_GROUP_NAME": "Blood Group Outside"
    },
    {
        "SERVICE_GROUP_CD": "CAR",
        "SERVICE_GROUP_NAME": "Cardiology"
    },
    {
        "SERVICE_GROUP_CD": "CLI",
        "SERVICE_GROUP_NAME": "Clinical"
    },
    {
        "SERVICE_GROUP_CD": "CTS",
        "SERVICE_GROUP_NAME": "CT Scanning"
    },
    {
        "SERVICE_GROUP_CD": "ULT",
        "SERVICE_GROUP_NAME": "Ultrasonography"
    },
    {
        "SERVICE_GROUP_CD": "BBI",
        "SERVICE_GROUP_NAME": "Blood Bank Investigation"
    },
    {
        "SERVICE_GROUP_CD": "CIV",
        "SERVICE_GROUP_NAME": "Clinical Immunology And Virology"
    },
    {
        "SERVICE_GROUP_CD": "CPA",
        "SERVICE_GROUP_NAME": "Cytopathology"
    },
    {
        "SERVICE_GROUP_CD": "CT",
        "SERVICE_GROUP_NAME": "CT Scanning"
    },
    {
        "SERVICE_GROUP_CD": "CYT",
        "SERVICE_GROUP_NAME": "Cytology"
    },
    {
        "SERVICE_GROUP_CD": "DOP",
        "SERVICE_GROUP_NAME": "Doppler"
    },
    {
        "SERVICE_GROUP_CD": "FMI",
        "SERVICE_GROUP_NAME": "Fetal Maternal Investigation"
    },
    {
        "SERVICE_GROUP_CD": "HEM",
        "SERVICE_GROUP_NAME": "Haematology"
    },
    {
        "SERVICE_GROUP_CD": "HIS",
        "SERVICE_GROUP_NAME": "Histo Pathology"
    },
    {
        "SERVICE_GROUP_CD": "MBI",
        "SERVICE_GROUP_NAME": "Molecular Biology"
    },
    {
        "SERVICE_GROUP_CD": "MOB",
        "SERVICE_GROUP_NAME": "Molecular Biology"
    },
    {
        "SERVICE_GROUP_CD": "MRI",
        "SERVICE_GROUP_NAME": "Mri Scan"
    },
    {
        "SERVICE_GROUP_CD": "PCV",
        "SERVICE_GROUP_NAME": "Packed Cell Volume (Pcv)"
    },
    {
        "SERVICE_GROUP_CD": "RDO",
        "SERVICE_GROUP_NAME": "Radiation Oncology"
    },
    {
        "SERVICE_GROUP_CD": "SER",
        "SERVICE_GROUP_NAME": "Serology"
    },
    {
        "SERVICE_GROUP_CD": "USS",
        "SERVICE_GROUP_NAME": "Ultrasonography"
    },
    {
        "SERVICE_GROUP_CD": "XRY",
        "SERVICE_GROUP_NAME": "Digital X-Ray"
    },
    {
        "SERVICE_GROUP_CD": "HCU",
        "SERVICE_GROUP_NAME": "Health Check-Up"
    },
    {
        "SERVICE_GROUP_CD": "BBP",
        "SERVICE_GROUP_NAME": "Blood-Borne Pathogen Testing"
    },
    {
        "SERVICE_GROUP_CD": "BLP",
        "SERVICE_GROUP_NAME": "Blood Profile Panel"
    },
    {
        "SERVICE_GROUP_CD": "SGO6",
        "SERVICE_GROUP_NAME": "Health Check-Up"
    }
];

function generateAgeGenderRanges(_val) {
    let _range = {
        "male": [{ "age": "", "range": "" }],
        "female": [{ "age": "", "range": "" }],
        "default": [{ "age": "", "range": "" }]
    }
    if (_val.GENDER && _val.GENDER == 'M') {

    }
    else if (_val.GENDER && _val.GENDER == 'F') {

    }
    else {
        if (_val.MINVALUE || _val.MAXVALUE) {
            _range.default[0].age = '1-120';
            _range.default[0].range = `${_val.MINVALUE || ""}-${_val.MAXVALUE || ""}`;
        }
    }
    return _range;
}

function transformRecord(result) {
    try {
        return {

            "serviceTypeName": "Investigations",
            "serviceTypeCd": "INVS",
            cd: result.cd,
            name: result.TESTNAME || "",//
            i_cd: result.TESTCD || "",//
            instruction: "",
            isOutside: false,
            childAvailable: false,
            mandInstruct: false,
            isConsentForm: false,
            isDiet: false,
            isQtyEdit: true,
            isAppointment: false,
            isSampleNeeded: false,
            image: "",
            i_groupcd: result.TESTMAINGROUPCD || "", //
            serviceGroupCd: result.TESTMAINGROUPCD || "",//
            serviceGroupName: result.SERVICE_GROUP_NAME || "",
            specimenCd: "",
            specimen: "",
            containerCd: "",
            container: "",
            isApplicableForCd: "BOTH",
            isApplicableFor: "BOTH",
            tarrif: [],
            unitName: result.NORMALVALUEUOM || "",
            ageGenderRanges: generateAgeGenderRanges(result),
            parameters: [],
            audit: {
                documentedById: "673ad5052a36715fbc928c3b",
                documentedBy: "sh_practiceadmin",
                documentedDt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error(`Error preparing payload for event 701: ${error.message}`);
        return {};
    }
}


async function processServicesData() {
    try {
        // Formate services data
        let _uService = _.uniqBy(servicesData, 'TESTCD')
        let _finalServicesData = [];
        for (let _o of _uService) {
            let srvgrp = _.filter(_serviceGroups, (_fo) => { return _fo.SERVICE_GROUP_CD == _o.TESTMAINGROUPCD });
            _o.SERVICE_GROUP_NAME = srvgrp && srvgrp.length > 0 ? srvgrp[0].SERVICE_GROUP_NAME : "";
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Investigation' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                console.log("Error occurred while generating Investigation Code.. ");
            }
            else {
                console.log("_seqResp.data", _seqResp.data)
                _o["cd"] = _seqResp.data;
                _finalServicesData.push(transformRecord(_o));
            }
        }


        // Formate Parameters data as Services
        let _uParameter = _.uniqBy(servicesData, 'PARAMCD')
        for (let _o of _uParameter) {
            let srvgrp = _.filter(_serviceGroups, (_fo) => { return _fo.SERVICE_GROUP_CD == _o.TESTMAINGROUPCD });
            _o.SERVICE_GROUP_NAME = srvgrp && srvgrp.length > 0 ? srvgrp[0].SERVICE_GROUP_NAME : "";
            _o.TESTCD = _o.PARAMCD;
            _o.TESTNAME = _o.PARAMDESC;
            let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Investigation' }, "cm", req);
            if (!(_seqResp && _seqResp.success)) {
                console.log("Error occurred while generating Investigating Code.. ");
            }
            else {
                _o["cd"] = _seqResp.data;
                _finalServicesData.push(transformRecord(_o));
            }
        }
        console.log("length", _finalServicesData.length);

        // Final prepared data Inserted into db 
        for (let _o of _finalServicesData) {
            let _insertResult = await _mUtils.commonMonogoCall("cm_investigations", "insertMany", _o, "", "", "", req.tokenData.dbType)
            if (!(_insertResult && _insertResult.success)) {
                console.log("Error occurred while generating Investigating Code.. ");
            }
            else {
                console.log("Investigation record insertted successfully..", _insertResult.data);
            }
        }
    }
    catch (err) {
        console.log("Run time error: ", err)
    }

}


async function serviceParameterMap() {
    let _uService = _.groupBy(servicesData, 'TESTCD');
    let _sData = _.map(_uService, (_v, _k) => {

        let _existsService = _.filter(_inserttedServices, (_eo) => { return _eo.i_cd == _k });
        let uniqueParams = _.uniqBy(_v, 'PARAMCD')
        let _parameters = [];
        for (let _p of uniqueParams) {
            let _existsParameter = _.filter(_inserttedServices, (_eo) => { return _eo.i_cd == _p.PARAMCD });

            if (_existsParameter && _existsParameter.length > 0) {
                let _parameter = _.filter(servicesData, (_eo) => { return _eo.PARAMCD == _p.PARAMCD });
                let _pObj = {
                    paramId: _existsParameter[0]._id.$oid,
                    paramCd: _existsParameter[0].cd,
                    paramName: _existsParameter[0].name,
                    unit: _existsParameter[0].unitName || "",
                    ageGenderRanges: generateAgeGenderRanges(_parameter[0]),
                }
                _parameters.push(_pObj);
            }

        }


        return {
            "_id": _existsService && _existsService.length > 0 ? _existsService[0]._id.$oid : "",
            "childAvailable": _v.length > 0 ? true : false,
            "parameters": _parameters
        }
    });


    for (let _o of _sData) {
        pLoadResp = await _mUtils.preparePayload('BW', { params: _o });
        if (!pLoadResp.success) {
            console.log("Error occurred while preparing Payload", pLoadResp.desc);
        }

        let _uResp = await _mUtils.commonMonogoCall("cm_investigations", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
        if (!(_uResp && _uResp.success && _uResp.data)) {
            console.log("Error occurred while preparing Payload", _uResp.desc);
        } else {
            console.log("Service Parameter mapped sucessfully..", _uResp.data)
        }
    }
}


setTimeout(() => {
    processServicesData();
    //serviceParameterMap();
}, 6000);

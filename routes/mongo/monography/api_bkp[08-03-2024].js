const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const axios = require("axios");
const fs = require("fs")
const path = require("path")
const axios1 = require("../../../services/axios")
const { transform } = require('node-json-transform');
const imageThumbnail = require('image-thumbnail');
const moment = require('moment');
const _mUtils = require("../../../constants/mongo-db/utils");
const _transformapi = require('../patientcare/transformation');
const _token = require("../../../services/token");
const _util = require("../../../utilities/is-valid")
const model = require("../../../db-config/helper-methods/mongo/preparePayload");
const getTemplateData = require("../../../constants/mongo-db/getTemplate.json")
const _orgDetails = require("../patientcare/constants/organizations");
//let url = "http://172.30.29.107:9001/pharmacyv1/api/getMasterData"
//let url = "http://testing.rxseed.com/rxseedapi/dev/pharmacy/api/getMasterData"      //testing
//let url = "http://prod.rxseed.com/rxseedapi/prod/pharmacy/api/getMasterData"          //production
let url = "http://staging.rxseed.com/rxseedapi/staging/pharmacy/api/getMasterData"          //old staging
//let url = "http://sqlmaster.rxseed.com/rxseedapi/prod/pharmacy/api/getMasterData"            //new staging
//let url = "http://sqlmaster.rxseed.com/rxseedapi/staging/pharmacy/api/getMasterData"
//let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"           //doc9


let _bwObj = {
    "updateOne": {
        "filter": {},
        "update": {
            "$set": {},
            "$push": {}
        }
    }
};

let _queries = ["find", "findById", "findOne", "insertMany", "updateOne", "bulkWrite"];

let _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';

let _users = [
    {
        "users": [
            { "userId": 1234, "userName": "admin", "pwd": "abc123", "displayName": "EMR Admin" }
        ]
    },
    {
        "users": [
            { "userId": 2345, "userName": "ssadmin", "pwd": "sunshine", "displayName": "Sunshine Admin" }
        ]
    }
];


router.post('/getting-data', async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "INT_ID": 11
            }
        }
        let _data = []
        let _mRespData = await _mUtils.commonMonogoCall(`monography_staging_drugparentinteraction`, "find", _filter, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        } else {
            _.each(_mRespData.data, (o, i) => {
                _data.push({
                    "SRC_DRUG_CD": o.SRC_DRUG_CD != null ? o.SRC_DRUG_CD : "",
                    "SRC_DRUG_NAME": o.SRC_DRUG_NAME != null ? o.SRC_DRUG_NAME : "",
                    "DRUG_IN_PARENT_ID": o.DRUG_IN_PARENT_ID != null ? o.DRUG_IN_PARENT_ID : "",
                    "IS_CD": o.IS_CD != null ? o.IS_CD : "",
                    "IS_NAME": o.IS_NAME != null ? o.IS_NAME : "",
                    "SRC_CD": o.SRC_CD != null ? o.SRC_CD : "",
                    "SRC_NAME": o.SRC_NAME != null ? o.SRC_NAME : "UNASSIGNED",
                    "SRC_URL": o.SRC_URL != null ? o.SRC_URL : "",
                    "INT_TYPE_ID": o.INT_TYPE_ID != null ? o.INT_TYPE_ID : "",
                    "INT_TYPE_NAME": o.INT_TYPE_NAME != null ? o.INT_TYPE_NAME : "",
                    "INT_ID": o.INT_ID != null ? o.INT_ID : "",
                    "TYPE": o.TYPE != null ? o.TYPE : "",
                    "SEVERITY_ID": o.SEVERITY_ID != null ? o.SEVERITY_ID : "",
                    "SEVERITY_NAME": o.SEVERITY_NAME != null ? o.SEVERITY_NAME : "",
                    "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                    "IS_ASSIGNED": o.IS_ASSIGNED != null ? o.IS_ASSIGNED : "",
                    "INTERACTIONS": o.INTERACTIONS != null ? o.INTERACTIONS : "",
                    "REFERENCES": o.REFERENCES != null ? o.REFERENCES : "",
                    "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                    "STATUS": o.STATUS != null ? o.STATUS : "",
                    "TYPE": o.TYPE != null ? o.TYPE : "",
                    "CLASS_NAME_CD": o.CLASS_NAME_CD != null ? o.CLASS_NAME_CD : "",
                    "CLASS_NAME": o.CLASS_NAME != null ? o.CLASS_NAME : "",
                    "REMARKS": o.REMARKS != null ? o.REMARKS : ""
                })

            })
            req.body.params = _data
            mongoMapper('monography_drugparentinteraction', "insertMany", req.body.params).then(async (result) => {
                res.status(200).json({ success: true, status: 200, desc: '', data: result.data })
            })
        }


    } catch (error) {
      //  console.log(error)
    }
})

router.post("/excelToJsontest", (req, res) => {

    let _testdata = [
        { "IS_CD": "IS0001", "IS_NAME": "ORAL", "INT_TYPE_ID": "SS0001", "INT_TYPE_NAME": "ABACAVIR" },
        { "IS_CD": "IS0002,IS0001", "IS_NAME": "ORAL,PARENTAL", "INT_TYPE_ID": "SS0001,SS0003", "INT_TYPE_NAME": "ABACAVIR,AMLODIPINE" },
        { "IS_CD": "IS0001", "IS_NAME": "ORAL", "INT_TYPE_ID": "SS0001,SS0002", "INT_TYPE_NAME": "ABACAVIR,DICLOFENAC" }
    ]
    let indx = 0
    let _drugData = []
    while (_testdata.length > indx) {
        try {
            // _.each(_testdata.data[indx],(_obj,_indx) =>{
            _.each(_testdata[indx].IS_CD.split(","), (_is_obj, _is_indx) => {
                //console.log(_is_indx)
                //   _.each(_testdata[indx].IS_NAME.split(","),(_is_name_obj,_is_name_indx)=>{
                _.each(_testdata[indx].INT_TYPE_ID.split(","), (_int_obj, _int_indx) => {
                    //   _.each(_testdata[indx].INT_TYPE_NAME.split(","),(_int_name_obj,_int_name_indx)=>{
                    _drugData.push({
                        //  "SRC_DRUG_CD": o.SRC_DRUG_CD != null ? o.SRC_DRUG_CD : "",
                        //  "SRC_DRUG_NAME": o.SRC_DRUG_NAME != null ? o.SRC_DRUG_NAME : "",
                        //  "DRUG_IN_PARENT_ID": o.DRUG_IN_PARENT_ID != null ? o.DRUG_IN_PARENT_ID : "",
                        "IS_CD": _is_obj != null ? _is_obj : "",
                        "IS_NAME": _testdata[indx].IS_NAME.split(",")[_is_indx] != null ? _testdata[indx].IS_NAME.split(",")[_is_indx] : "",
                        //  "SRC_CD": o.SRC_CD != null ? o.SRC_CD : "",
                        //  "SRC_NAME": o.SRC_NAME != null ? o.SRC_NAME : "",
                        //  "SRC_URL": o.SRC_URL != null ? o.SRC_URL : "",
                        "INT_TYPE_ID": _int_obj != null ? _int_obj : "",
                        "INT_TYPE_NAME": _testdata[indx].INT_TYPE_NAME.split(",")[_int_indx] != null ? _testdata[indx].INT_TYPE_NAME.split(",")[_int_indx] : "",
                        //  "INT_ID": o.INT_ID != null ? o.INT_ID : "",
                        //  "TYPE": o.TYPE != null ? o.TYPE : "",
                        //  "SEVERITY_ID": o.SEVERITY_ID != null ? o.SEVERITY_ID : "",
                        //  "SEVERITY_NAME": o.SEVERITY_NAME != null ? o.SEVERITY_NAME : "",
                        //  "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                        //  "IS_ASSIGNED": o.IS_ASSIGNED != null ? o.IS_ASSIGNED : "",
                        //  "INTERACTIONS": o.INTERACTIONS != null ? o.INTERACTIONS : "",
                        //  "REFERENCES": o.REFERENCES != null ? o.REFERENCES : "",     
                        //  "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                        //  "STATUS": o.STATUS != null ? o.STATUS : "",
                        //  "TYPE": o.TYPE != null ? o.TYPE : "",
                        //  "CLASS_NAME_CD": o.CLASS_NAME_CD != null ? o.CLASS_NAME_CD : "",   
                        //  "CLASS_NAME": o.CLASS_NAME != null ? o.CLASS_NAME :""  ,   
                        //  "REMARKS": o.REMARKS != null ? o.REMARKS : "",                 
                        //  "audit": req.body.params.audit
                    })
                    //  _drugData.data
                    // mongoMapper('monography_drug_int_child', "insertMany", req.body.params).then(async (result) => {

                    // }).catch((error) => {
                    //     return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
                    // });
                    //   })
                })
                // })
            })

            // })
        } catch (error) {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        }
        indx++
    }
    return res.status(200).json({ success: true, status: 200, desc: '', data: _drugData });



});

router.post("/excelToJsonInteractions", (req, res) => {
    try {
        const excelDta = excelToJson({
            sourceFile: path.join(__dirname, `/Revised Drug interactions.xlsx`),

            header: {
                rows: 1
            },
            columnToKey: {
                "*": "{{columnHeader}}"
            }
        })
        // let dd = excelDta['PlainTable'].filter((excData, excIndx) => {
        //  fs.writeFile(path.join(__dirname,`Jsondata/${(excIndx +1)}.txt`),JSON.stringify(excData),(err,otData)=>{
        //     //console.log(__dirname)
        //     if(err){
        //         console.log(err)
        //     }else{
        //         console.log(otData)
        //     }
        //  }) 
        // })
       // console.log(excelDta)
        let _excelData = []
        _.each(excelDta("Drug-drug interactions"), async (o, i) => {
            //  let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'unitsOfMeasurement' }, "monography", req);
            _excelData.push({
                "SRC_DRUG_CD": o.SRC_DRUG_CD != null ? o.SRC_DRUG_CD : "",
                "SRC_DRUG_NAME": o.SRC_DRUG_NAME != null ? o.SRC_DRUG_NAME : "",
                "DRUG_IN_PARENT_ID": o.DRUG_IN_PARENT_ID != null ? o.DRUG_IN_PARENT_ID : "",
                "IS_CD": o.ROA_CD != null ? o.ROA_CD : "",
                "IS_NAME": o.ROA_NAME != null ? o.ROA_NAME : "",
                "SRC_CD": o.SRC_CD != null ? o.SRC_CD : "",
                "SRC_NAME": o.SRC_NAME != null ? o.SRC_NAME : "UNASSIGNED",
                "SRC_URL": o.SRC_URL != null ? o.SRC_URL : "",
                "INT_TYPE_ID": o.INT_TYPE_ID != null ? o.INT_TYPE_ID : "",
                "INT_TYPE_NAME": o.INT_TYPE_NAME != null ? o.INT_TYPE_NAME : "",
                "INT_ID": o.INT_ID != null ? o.INT_ID : "",
                "TYPE": o.TYPE != null ? o.TYPE : "",
                "SEVERITY_ID": o.SEVERITY_ID != null ? o.SEVERITY_ID : "",
                "SEVERITY_NAME": o.SEVERITY_NAME != null ? o.SEVERITY_NAME : "",
                "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                "IS_ASSIGNED": o.IS_ASSIGNED != null ? o.IS_ASSIGNED : "",
                "INTERACTIONS": o.INTERACTIONS != null ? o.INTERACTIONS : "",
                "REFERENCES": o.REFERENCES != null ? o.REFERENCES : "",
                "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                "STATUS": o.STATUS != null ? o.STATUS : "",
                "TYPE": o.TYPE != null ? o.TYPE : "",
                "CLASS_NAME_CD": o.CLASS_NAME_CD != null ? o.CLASS_NAME_CD : "",
                "CLASS_NAME": o.CLASS_NAME != null ? o.CLASS_NAME : "",
                "REMARKS": o.REMARKS != null ? o.REMARKS : "",
                "audit": req.body.params.audit
            })




        })
        req.body.params = _excelData
        mongoMapper('monography_drug_int_parent', "insertMany", req.body.params).then(async (result) => {
            let _drugData = []
            let indx = 0
            while (result.data.length > indx) {
                try {
                    // _.each(result.data[indx],(_obj,_indx) =>{
                    _.each(result.data[indx].IS_CD.split(","), (_is_obj, _is_indx) => {
                        _.each(result.data[indx].IS_NAME.split(","), (_is_name_obj, _is_name_indx) => {
                            _.each(result.data[indx].INT_TYPE_ID.split(","), (_int_obj, _int_indx) => {
                                _.each(result.data[indx].INT_TYPE_NAME.split(","), (_int_name_obj, _int_name_indx) => {
                                    _drugData.push({
                                        "SRC_DRUG_CD": o.SRC_DRUG_CD != null ? o.SRC_DRUG_CD : "",
                                        "SRC_DRUG_NAME": o.SRC_DRUG_NAME != null ? o.SRC_DRUG_NAME : "",
                                        "DRUG_IN_PARENT_ID": o.DRUG_IN_PARENT_ID != null ? o.DRUG_IN_PARENT_ID : "",
                                        "IS_CD": _is_obj != null ? _is_obj : "",
                                        "IS_NAME": _is_name_obj != null ? _is_name_obj : "",
                                        "SRC_CD": o.SRC_CD != null ? o.SRC_CD : "",
                                        "SRC_NAME": o.SRC_NAME != null ? o.SRC_NAME : "",
                                        "SRC_URL": o.SRC_URL != null ? o.SRC_URL : "",
                                        "INT_TYPE_ID": o.INT_TYPE_ID != null ? o.INT_TYPE_ID : "",
                                        "INT_TYPE_NAME": o.INT_TYPE_NAME != null ? o.INT_TYPE_NAME : "",
                                        "INT_ID": o.INT_ID != null ? o.INT_ID : "",
                                        "TYPE": o.TYPE != null ? o.TYPE : "",
                                        "SEVERITY_ID": o.SEVERITY_ID != null ? o.SEVERITY_ID : "",
                                        "SEVERITY_NAME": o.SEVERITY_NAME != null ? o.SEVERITY_NAME : "",
                                        "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                                        "IS_ASSIGNED": o.IS_ASSIGNED != null ? o.IS_ASSIGNED : "",
                                        "INTERACTIONS": o.INTERACTIONS != null ? o.INTERACTIONS : "",
                                        "REFERENCES": o.REFERENCES != null ? o.REFERENCES : "",
                                        "INT_NAME": o.INT_NAME != null ? o.INT_NAME : "",
                                        "STATUS": o.STATUS != null ? o.STATUS : "",
                                        "TYPE": o.TYPE != null ? o.TYPE : "",
                                        "CLASS_NAME_CD": o.CLASS_NAME_CD != null ? o.CLASS_NAME_CD : "",
                                        "CLASS_NAME": o.CLASS_NAME != null ? o.CLASS_NAME : "",
                                        "REMARKS": o.REMARKS != null ? o.REMARKS : "",
                                        "audit": req.body.params.audit
                                    })
                                    req.body.params = _drugData
                                    mongoMapper('monography_drug_int_child', "insertMany", req.body.params).then(async (result) => {
                                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                                    }).catch((error) => {
                                        return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
                                    });
                                })
                            })
                        })
                    })
                    // })
                } catch (error) {
                    return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
                }
                indx++
            }



            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });

        return res.status(200).send({ status: "200", data: excelDta })

    } catch (error) {
       // console.log(error)
    }
})

router.post("/excelToJson", (req, res) => {
    try {
        const excelDta = excelToJson({
            sourceFile: path.join(__dirname, `/test.xlsx`),

            header: {
                rows: 1
            },
            columnToKey: {
                "*": "{{columnHeader}}"
            }
        })
        // let dd = excelDta['PlainTable'].filter((excData, excIndx) => {
      //  console.log(excelDta)
        //  fs.writeFile(path.join(__dirname,`Jsondata/${(excIndx +1)}.txt`),JSON.stringify(excData),(err,otData)=>{
        //     //console.log(__dirname)
        //     if(err){
        //         console.log(err)
        //     }else{
        //         console.log(otData)
        //     }
        //  }) 
        // })

        let _excelData = []
        _.each(excelDta, async (o, i) => {
            //  let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'unitsOfMeasurement' }, "monography", req);
            _excelData.push({
                "MESH_MASTER_CD": o.Auto_ID != null ? o.Auto_ID : "",
                "MESH_PREFERRED_TERM": o.MeSH_Preferred_Term != null ? o.MeSH_Preferred_Term : "",
                "NCI_ID": o.NCI_ID != null ? o.NCI_ID : "",
                "MESH_UNQ_ID": o.MeSH_Unique_ID != null ? o.MeSH_Unique_ID : "",
                "MESH_DUI_CD": o.MeSH_DUI != null ? o.MeSH_DUI : "",
                "MESH_CUI_CD": o.MeSH_CUI != null ? o.MeSH_CUI : "",
                "MESH_DEFINATION": o.MESH_DEFINITION != null ? o.MESH_DEFINITION : "",
                "TYPE": o.Type != null ? o.Type : "",
                "UMLS_CUI_CD": o.UMLS_CUI_1 != null ? o.UMLS_CUI_1 : "",
                "ICD_CD": o.ICD_10 != null ? o.ICD_10 : "",
                "ICD_DESCRIPTION": o.ICD_DESCRIPTION != null ? o.ICD_DESCRIPTION + ',' + o.ICD_DESCRIPTION_1 + ',' + o.ICD_DESCRIPTION_2 + ',' + o.ICD_DESCRIPTION_3 + ',' + o.ICD_DESCRIPTION_4 + ',' + o.ICD_DESCRIPTION_5 + ',' + o.ICD_DESCRIPTION_6 : "",
                "MESHTREE_ID": o.MESHTREE_ID != null ? o.MESHTREE_ID : "",
                "audit": req.body.params.audit
            })
        })
        req.body.params = _excelData
        mongoMapper('monography_meshmaster', "insertMany", req.body.params).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });

        return res.status(200).send({ status: "200", data: excelDta })

    } catch (error) {
       // console.log(error)
    }
})

router.post("/colectData-and-convert-json-to-excel", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
            }
        }
        let finalJsonData = []

        let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_brand_product_mapping", "find", _filter, "", "", "", "")
        if (!(_mBrandProductResp && _mBrandProductResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
        } else {
            let _indx = 0;
            while (_mBrandProductResp.data.length > _indx) {
                let _exactRespObject = {}
                _filter.filter = {}
                _filter.filter['recStatus'] = { $eq: true }
                _filter.filter['STRING_3_CD'] = _mBrandProductResp.data[_indx].STRING_3_CD
                let _mClinicalProductResp = await _mUtils.commonMonogoCall("monography_dd_product_master", "find", _filter, "", "", "", "")
               // console.log("sdfhsdf", _mClinicalProductResp.data, _indx)
                if (!(_mClinicalProductResp && _mClinicalProductResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mClinicalProductResp.desc || "", data: _mClinicalProductResp.data || [] });
                } else {
                    _filter.filter = {}
                    _filter.filter['recStatus'] = { $eq: true }
                    if (_mClinicalProductResp.data.length > 0 && _mClinicalProductResp.data[0].DD_DRUG_MASTER_CD) {
                        _filter.filter['DD_DRUG_MASTER_CD'] = _mClinicalProductResp.data[0].DD_DRUG_MASTER_CD
                        let _mMedicinalProductResp = await _mUtils.commonMonogoCall("monography_dd_drug_master", "find", _filter, "", "", "", "")
                        if (!(_mMedicinalProductResp && _mMedicinalProductResp.success)) {

                        } else {
                            delete _filter.filter.DD_DRUG_MASTER_CD
                            if (_mMedicinalProductResp.data.length > 0 && _mMedicinalProductResp.data[0].DD_SUBSTANCE_CD) {
                                _filter.filter['SRC_DRUG_CD'] = _mMedicinalProductResp.data[0].DD_SUBSTANCE_CD;
                                _exactRespObject['BRAND_PRODUCT_MAP_CD'] = _mBrandProductResp.data[_indx].BRAND_PRODUCT_MAP_CD
                                _exactRespObject['BRAND_STRING2'] = _mBrandProductResp.data[_indx].BRAND_STRING2
                                //"BRAND_PRODUCT_MAP_CD":_mBrandProductResp.data[_indx].BRAND_PRODUCT_MAP_CD,
                                //"BRAND_STRING2":_mBrandProductResp.data[_indx].BRAND_STRING2

                                let _mMedicinalChildernResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
                                _exactRespObject['IS_ALLERTS'] = _mMedicinalChildernResp.data.length > 0 ? true : false;
                                delete _filter.filter.SRC_DRUG_CD
                                _filter.filter['DD_SUBSTANCE_CD'] = _mMedicinalProductResp.data[0].DD_SUBSTANCE_CD
                                let _mectionResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "")
                                _exactRespObject['IS_MONOGRAPH'] = _mectionResp.data.length > 0 ? true : false;
                                finalJsonData.push(_exactRespObject)
                            }
                        }

                    }

                }
                _indx++;
            }

            fs.writeFile(path.join(__dirname, "/excelData1.json"), JSON.stringify(finalJsonData), () => {
                return res.status(200).json({ success: false, status: 200, desc: "", data: [] });
            })

            // let _mClinicalProductResp = await _mUtils.commonMonogoCall("monography_dd_product_master", "find", _filterObj, "", "", "", "")
            // if (!(_mClinicalProductResp && _mClinicalProductResp.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _mClinicalProductResp.desc || "", data: _mClinicalProductResp.data || [] });
            // } else {
            //     _filterObj.filter['DD_DRUG_MASTER_CD'] = _mClinicalProductResp.data[0].DD_DRUG_MASTER_CD
            //     let _mMedicinalProductResp = await _mUtils.commonMonogoCall("monography_dd_drug_master", "find", _filterObj, "", "", "", "")
            //     if (_mMedicinalProductResp.data.length > 0) {
            //         _.each(JSON.parse(JSON.stringify(_mMedicinalProductResp.data)), (_obj, _ind) => {
            //             _obj['BRAND_CD'] = _mBrandProductResp.data[0].BRAND_STRING2_CD
            //             _obj['BRAND_NAME'] = _mBrandProductResp.data[0].BRAND_STRING2
            //             _output.push(_obj)
            //         })
            //     }
            // }
        }
    } catch (error) {
       // console.log("fgfug", error)
    }
})

router.post("/colectData-and-convert-json-to-excel_1", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
            }
        }
        let finalJsonData = []

        let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_brand_product_mapping", "find", _filter, "", "", "", "")
        if (!(_mBrandProductResp && _mBrandProductResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
        } else {
            let _indx = 0;
            let _parseData=JSON.parse(JSON.stringify(_mBrandProductResp.data))
            while (_parseData.length > _indx) {
               // console.log("_indx",_indx)
                let _exactRespObject = {}
                _filter.filter = {}
                _filter.filter['recStatus'] = { $eq: true }
                _filter.filter['STRING_3_CD'] = _mBrandProductResp.data[_indx].STRING_3_CD
                let _mClinicalProductResp = await _mUtils.commonMonogoCall("monography_dd_product_master", "find", _filter, "", "", "", "")
                if (!(_mClinicalProductResp && _mClinicalProductResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mClinicalProductResp.desc || "", data: _mClinicalProductResp.data || [] });
                } else {
                    if(_mClinicalProductResp.data.length > 0){
                        _parseData[_indx]['CDP Code'] = _mClinicalProductResp.data[0].DD_PRODUCT_MASTER_CD
                        finalJsonData.push(_parseData[_indx])
                    }
                }
                _indx++;
            }
            
            fs.writeFile(path.join(__dirname, "/onlyBrandProduct2.json"), JSON.stringify(finalJsonData), () => {
                return res.status(200).json({ success: false, status: 200, desc: "", data: [] });
            })

        }
    } catch (error) {
       // console.log("fgfug", error)
    }
})


router.post("/testing_purpose",async(req,res)=>{
    try {
     let _filter = {
         "filter": {
             "recStatus": { $eq: true }
         }
     }
     
     _filter.filter['$or']=[
         {
             "ICD_CODE": req.body.JSON[0].DIS_CD
         },
         {
             "DISEASE_MAP_CD": req.body.JSON[0].DIS_CD
         }
     ] 
 
     let _mRespData = await _mUtils.commonMonogoCall(`monography_diseasemapping`, "find", _filter, "", "", "", "")
     if (!(_mRespData && _mRespData.success)) {
         return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
     }
 
    } catch (error) {
        // console.log("dfhgsf",error)
    }
 })
/* Generate Token */
async function generateToken(_data) {
    return await _token.createTokenWithExpire(_data, "9000000ms");
};

/* Get Client Urls */
async function getClientUrls(_data) {
    let _org = await _.filter(_orgDetails, (o) => { return o.orgId === _data.orgId });
    return _org && _org.length > 0 ? _org[0] : _org;
};

/*Custom Sort By Date */
function custom_sort(a, b) {
    return new Date(a.CREATE_DT).getTime() - new Date(b.CREATE_DT).getTime();
};

async function prepareGetPayload(_payload, _inParams) {
    try {
        _.each(_inParams, (_i, _k) => {
            if (_k != 'audit' && _i) {
                _payload.filter[_k] = _i;
            }
        });
        return { success: true, data: _payload };
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err };
    }
}

/* Get Organization Details */
router.get("/get-org-details", async (req, res) => {
    try {
        if (req.headers && req.headers.orgkey) {
            let _orgDtls = _.filter(_orgDetails, (o) => { return o.orgKey == req.headers.orgkey });
            if (!(_orgDtls && _orgDtls.length > 0)) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            }
            let _orgObj = { "orgId": _orgDtls[0].orgId, "createdDt": new Date().toISOString() };

            // let _tkn = await generateToken(_orgObj);
            //  res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true, domain: 'localhost', path: '/' });
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _orgObj });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

//get totalView data  to rxseed 
router.post("/get-totalView-data-to-rxseed", async (req, res) => {
    try {
        if (req.body.params.drug_substance_code) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "content_type": req.body.params.content_type,
                    "DD_SUBSTANCE_CD": req.body.params.drug_substance_code
                },
                "selectors": "-history"
            }

            if (req.body.params.section_type) {
                _filter.filter['SECTION_TYPE'] = req.body.params.section_type
            }

            //    let _pGData = await prepareGetPayload(_filter, req.body.params);
            //    if (!_pGData.success) {
            //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            //    }
            mongoMapper("monography_sections", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})


router.post("/get-data-from-monogodb", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
            }
        }

        let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.params.BRAND_PRODUCT_CD.split(","), 0, [], req, _filter)
        if (_getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0) {
            _filter.filter['DD_SUBSTANCE_CD'] = _getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0 ? _getBerandSubstanceNames.data[0].DD_SUBSTANCE_CD : "";
            let _getSubstanceName = await _mUtils.commonMonogoCall("monography_drugcreation", "find", _filter, "", "", "", "")
            let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "");
            if (!(_mBrandProductResp && _mBrandProductResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
            } else {
                let _finalOutput = []
                _.each(JSON.parse(JSON.stringify(_mBrandProductResp.data)), (_sectionObj, _sectionIndex) => {
                    _sectionObj['DD_SUBSTANCE_NAME'] = _getSubstanceName.data && _getSubstanceName.data[0].DD_SUBSTANCE_NAME ? _getSubstanceName.data[0].DD_SUBSTANCE_NAME : "";
                    _finalOutput.push(_sectionObj)
                });
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalOutput });
            }

        } else {
            return res.status(200).json({ success: true, status: 200, desc: '', data: [] });
        }
    } catch (error) {
       // console.log("fsdgufsdg", error)
    }
})

/**Auth User */
router.post("/auth-user-deprecated", async (req, res) => {
    try {
        let finalData;
        if (req.body && req.body.uName && req.body.pwd) {

            // let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
            // if (!(_orgDtls && _orgDtls.length > 0)) {
            //     return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
            // }

            let _userDtls = _.filter(_users, (o) => {
                _.filter(o.users, (oData, oIndx) => {
                    if (oData.userName == req.body.uName && oData.pwd == req.body.pwd) {
                        finalData = oData

                    }
                })
            });
            // console.log("finalData",finalData.length)
            if (finalData == undefined || finalData == null) {
                return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
            }
            let _user = {
                "createdDt": new Date(), "userId": finalData.userId, "userName": finalData.userName, "permissions": ["1102"],
                "displayName": finalData.displayName
            };
            let _tkn = await generateToken(_user);
            res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
            _user['x-token'] = _tkn;
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: _user });
        }
        else {
            return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
        }
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
    // try {
    //     if (req.body && req.body.uName && req.body.pwd) {
    //     //    let _orgDtls = _.filter(_users, (o) => { return o.orgId == req.body.orgId });
    //     //     if (!(_orgDtls && _orgDtls.length > 0)) {
    //     //         return res.status(400).send({ status: 'FAIL', data: [], desc: "No Client found.." });
    //     //     }
    //     let _userDtls = _.filter(_users[0].users, (o) => { return o.userName == req.body.uName && o.pwd == req.body.pwd });
    //         if (!(_userDtls && _userDtls.length > 0)) {
    //             return res.status(400).send({ status: 'FAIL', data: [], desc: "No User found.." });
    //         }
    //         let _user = {
    //              "createdDt": new Date(), "userId": _userDtls[0].userId, "userName": _userDtls[0].userName,"permissions": ["1102"],
    //             "displayName": _userDtls[0].displayName
    //         };
    //         let _tkn = await generateToken(_user);
    //         res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
    //         _user['x-token'] = _tkn;
    //         return res.status(200).json({ status: 'SUCCESS', desc: '', data: _user });
    //     }
    //     else {
    //         return res.status(400).send({ status: 'FAIL', data: [], desc: "Invalid Parameters" });
    //     }
    // } catch (error) {
    //     return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    // }
});

router.post("/auth-user", async (req, res) => {
    try {
        if (req.body && req.body.params.uName && req.body.params.pwd) {
            let _filter = {
                "filter": {
                    "isActive": true,
                    "userName": { $eq: req.body.params.uName },
                    "password": { $eq: req.body.params.pwd }
                },
                "selectors": "-audit -history"
            }
            let _sessionInsertRes;
            let session_id;
            mongoMapper("monography_users", "find", _filter, "").then(async (result) => {
                if (result.data && result.data.length === 0) {
                    return res.status(400).json({ success: false, status: 400, desc: `Invalid credentials / No user found ..`, data: [] });
                }

                if (result.data && result.data.length > 0) {
                    let _filter = {
                        "filter": { recStatus: true },
                        "selectors": "-audit -history"
                    }
                    let _sessionRes = await _mUtils.commonMonogoCall("monography_userSession", "find", _filter, "", "", "", "")
                    //   let num = _sessionRes.data[0].session_id
                    let params = {};
                    if (_sessionRes.data.length == 0) {
                        session_id = 1
                    } else {
                        let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
                        let _cal = _descData[0].session_id + 1;
                        session_id = _cal
                    }
                    params = {
                        "userId": result.data[0]._id,
                        "userName": result.data[0].displayName,
                        'orgId': result.data[0].orgId,
                        "roleId": result.data[0].defaultRoleId ? result.data[0].defaultRoleId : "",
                        "roleName": result.data[0].defaultRoleName ? result.data[0].defaultRoleName : "",
                        "user_revNo": result.data[0].revNo,
                        "machine": req.body.params.machine ? req.body.params.machine : "",
                        "version": req.body.params.version ? req.body.params.version : "",
                        "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
                        "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
                        "session_id": session_id,
                        "browser": req.body.params.browser ? req.body.params.browser : "",
                        "audit": {
                            "documentedBy": result.data[0].displayName,
                            "documentedById": result.data[0]._id
                        }
                    }
                    _sessionInsertRes = await _mUtils.commonMonogoCall("monography_userSession", "insertMany", params, "", "", "", "")
                    if (!(_sessionInsertRes && _sessionInsertRes.success)) {
                        console.log("Error Occured while updating appointment details to Patient");
                    }

                }

                let _user = {
                    "createdDt": new Date(), "userId": result.data[0]._id, "userName": result.data[0].userName, "roleId": result.data[0].defaultRoleId,
                    "displayName": result.data[0].displayName, "session_id": _sessionInsertRes.data[0].session_id, gender: result.data[0].gender
                };
                let _tkn = await generateToken(_user);
                res.cookie('x-token', _tkn, { maxAge: 9000000, httpOnly: true });
                _user['x-token'] = _tkn;
                return res.status(200).json({ success: true, status: 200, desc: '', data: _user });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Invalid Parameters", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

async function findDuplicatesAndCombinedData(_data, _key1, _key2) {
    try {
        let setCombinationData = new Set();
        let uniqueEntries = [];

        _data.forEach((item) => {
            let combination = `${item[_key1]}-${item[_key2]}`;
            if (!setCombinationData.has(combination)) {
                setCombinationData.add(combination);
                uniqueEntries.push(item)
            }
        })
        return uniqueEntries;
    } catch (error) {
       // console.log("gfdghjsf", error)
    }
}

async function _givenDataagainstAddingClassData(_data, _idx, _output, req, _filterObj) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true }
                }
            }
            _filter.filter['DD_SUBSTANCE_CD'] = _data[_idx].DD_SUBSTANCE_CD.trim();
            let _dd_substance_classification_resp = await _mUtils.commonMonogoCall("monography_dd_substance_classifications", "find", _filter, "", "", "", "");
            _.each(JSON.parse(JSON.stringify(_dd_substance_classification_resp.data)), (_o, _i) => {
                _substanceAddClass = {}
                _.each(_data[_idx], (_v, _k) => {
                    _substanceAddClass['CLASS_NAME_CD']=_o.CLASS_NAME_CD
                    _substanceAddClass['CLASS_NAME']=_o.CLASS_NAME
                    _substanceAddClass[_k] = _v
                })
                _output.push(_substanceAddClass)
            })
            _idx = _idx + 1
            await _givenDataagainstAddingClassData(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
      //  console.log("efdfhgudfhfdgh", error)
    }
}


router.post("/get-allerts_1", async (req, res) => {
    try {
        let _filter = { "filter": { "recStatus": { $eq: true } } }
        let _brandProductName = "";
        let _comparisonData = [];
        let _BrandOrClassOrDrugCds = [];
        let _withoutBrandOrClassOrDrugCds = []
        let _commaseperateData = "";
        let _finalData = {
            alertsData: [],
            mongraphData: []
        };

        let config = {
            "data": req.body.params,
            "headers": req.headers,
            "url": req.protocol + '://' + req.headers.host + req.originalUrl,
            "method": req.method
        }
        //JOINING AND GET MEDICINAL CD FROM BRAND_PRODUCT_CD START.
        let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].BRAND_PRODUCT_CD.split(","), 0, [], req, _filter);
        let _splitFinalData = [];
        let _substanceObject = {}
        _.each(JSON.parse(JSON.stringify(_getBerandSubstanceNames.data)), (_o, _i) => {
            _.each(_o.DD_SUBSTANCE_CD.split('+'), (_o1, _i1) => {
                _substanceObject = {}
                _.each(_o, (_val, _key) => {
                    if (_key == "DD_SUBSTANCE_CD") {
                        _substanceObject['DD_SUBSTANCE_CD'] = _o1.trim()
                    } else {
                        _substanceObject[_key] = _val
                    }

                })
                _splitFinalData.push(_substanceObject)
            })
        })

         ///GET CLASS_NAME AND CLAA_NAME_CD
        let givenDataagainstAddingClassData =  await _givenDataagainstAddingClassData(_splitFinalData,0,[],req,_filter);

        //  let _indxNum = 0;
        //  _filter.filter = {};
        // _filter.filter['recStatus'] = { $eq: true }
        // let _substanceAddClass = {}
        // let _classAddTotalData=[]
        // while (_splitFinalData.length > _indxNum) {
        //     _filter.filter['DD_SUBSTANCE_CD'] = _splitFinalData[_indxNum].DD_SUBSTANCE_CD.trim();
        //     let _dd_substance_classification_resp = await _mUtils.commonMonogoCall("monography_dd_substance_classifications", "find", _filter, "", "", "", "");
        //     _.each(JSON.parse(JSON.stringify(_dd_substance_classification_resp.data)), (_o, _i) => {
        //         _substanceAddClass = {}
        //         _.each(_splitFinalData[_indxNum], (_v, _k) => {
        //             _substanceAddClass['CLASS_NAME_CD']=_o.CLASS_NAME_CD
        //             _substanceAddClass['CLASS_NAME']=_o.CLASS_NAME
        //             _substanceAddClass[_k] = _v
        //         })
        //         _classAddTotalData.push(_substanceAddClass)
        //     })
        //     _indxNum++
        // }
        // console.log("fddfsd",_classAddTotalData)
        //JOINING AND GET MEDICINAL CD FROM BRAND_PRODUCT_CD END.
        _getBerandSubstanceNames.data = _splitFinalData
        if (req.body.JSON[0].TYPE == "ALL" || req.body.JSON[0].TYPE == "") {
            if ((req.body.JSON[0].BRAND_PRODUCT_CD.length == 0) || (req.body.JSON[0].BRAND_PRODUCT_CD.length != 0)) {
                if (req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD == "" && req.body.JSON[0].FOOD_CD == "" && req.body.JSON[0].DIS_CD == "" && req.body.JSON[0].LAB_TEST_CD == "" && req.body.JSON[0].ALLERGY.length == 0 ) {
                    if (_getBerandSubstanceNames.data.length > 1) {
                        _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                            _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                                if (_o != _o1) {
                                    _comparisonData.push(
                                        {
                                            "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                            "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                            "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                            "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                            "BRAND_NAME_1": _o.BRAND_NAME,
                                            "BRAND_NAME_2": _o1.BRAND_NAME, 
                                            "SRC_SUBSTANCE_NAME": _o.DD_SUBSTANCE_NAME,
                                            "INT_SUBSTANCE_NAME": _o1.DD_SUBSTANCE_NAME
                                        }
                                    )
                                }
                            })
                        })

                        //GET DATA ONLY DRUG TO DRUG (AGANIST SUBSTANCE TO SUBSTANCE)
                        let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                        _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                            _finalData.alertsData.push(_o)
                        })

                        //GET DATA ONLY DRUG TO DRUG (AGANIST SUBSTANCE TO CLASS)
                        _comparisonData=[]  
                        _.each(givenDataagainstAddingClassData.data, (_o, _i) => {
                            _.each(givenDataagainstAddingClassData.data, (_o1, _i1) => {
                                if (_o != _o1) {
                                    _comparisonData.push(
                                        {
                                            "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                            "INT_TYPE_ID": _o1.CLASS_NAME_CD,
                                            "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                            "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                            "BRAND_NAME_1": _o.BRAND_NAME,
                                            "BRAND_NAME_2": _o1.BRAND_NAME,
                                            "SRC_SUBSTANCE_NAME": _o.DD_SUBSTANCE_NAME,
                                            "INT_SUBSTANCE_NAME": _o1.DD_SUBSTANCE_NAME
                                        }
                                    )
                                }
                            })
                        });
                        let _duplicateData= _comparisonData.filter((_o,_i)=>{return _o.BRAND_NAME_1 != _o.BRAND_NAME_2})
                        let _findDuplicatesAndCombinedData = await findDuplicatesAndCombinedData(JSON.parse(JSON.stringify(_duplicateData)), 'SRC_DRUG_CD', "INT_TYPE_ID");
                        let _getInteractionWithagainstClass = await getInteractionWithagainstClass(_findDuplicatesAndCombinedData, 0, [], req, _filter, _brandProductName);
                        _.each(_getInteractionWithagainstClass.data, (_o, _i) => {
                            _finalData.alertsData.push(_o)
                        })

                        //GET DATA ALERGY MASTER
                        // let _ALLERGY_CD = []
                        // _.each(_getBerandSubstanceNames.data, (_obj, _idx) => {
                        //     _ALLERGY_CD.push(_obj.DD_SUBSTANCE_CD)
                        // })
                        // let classAganistSubstances = await getDataBasedOnLooping(_getBerandSubstanceNames.data, 0, [], req, _filter, "dd_substance_classifications", "SUBSTANCE_AGANIST_CLASS");
                        // let substanceAganistClass = await getDataBasedOnLooping(_ALLERGY_CD, 0, [], req, _filter, "dd_substance_classifications", "CLASS_NAME");
                        // let allergyAgainstData = await getDataBasedOnLooping(_ALLERGY_CD, 0, [], req, _filter, "allergy_master", "ALLERGY_NAME");
                        // let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ALLERGY", "", _getBerandSubstanceNames, allergyAgainstData, classAganistSubstances, substanceAganistClass);
                        // console.log("sfdsdfgdjfg", _BrandWithDifferentTypes)
                        // _.each(_BrandWithDifferentTypes.length > 0, (_Bo, _Bi) => {
                        //     _finalData.alertsData.push(_Bo)
                        // })
                    }
                    //GET DATA REMAIG ALL TYPES
                    let _commonGetData = await commonGetData(_getBerandSubstanceNames.data, 0, [], req, _filter,"GIVEN_ONLY_BRAND_PRODUCT")
                    let _findDuplicatesAndCombinedData = await findDuplicatesAndCombinedData(JSON.parse(JSON.stringify(_commonGetData.data)), 'SRC_DRUG_CD', "INT_TYPE_ID");
                    _.each(_findDuplicatesAndCombinedData, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                } else if ((req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.bodyJSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD == "" && (req.bodyJSON[0].FOOD_CD != "" || req.body.JSON[0].DIS_CD != "" || req.body.JSON[0].LAB_TEST_CD != ""  || req.body.JSON[0].ALLERGY.length != ""))) {
                    let filterKeyData = []
                    let _fil = _.filter(req.body.JSON[0], (_O, _I) => {
                        if (_O != "" && _I !== "TYPE") {
                            let _object = {}
                            _object[`${_I}`] = _O
                            filterKeyData.push(_object)
                        }
                    })

                    let _eachWiseData = await alertsWithSpecificKey(filterKeyData, 0, [], req, _filter)
                    _.each(_eachWiseData.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData, config: config });
                } else {
                    let _matchingInteractingKeys = []
                    let clonedObject = _.omit(_.clone(req.body.JSON[0]),["AGE",'GENDER','ISPREGNANCY','ISLACTATION'])
                    _.each(clonedObject, (_v, _k) => {
                        if (_v != "" && _k != "TYPE") {
                            _.each(clonedObject, (_v1, _k1) => {
                                let _obj = {}
                                if (_v1 != "" && _k1 != _k && _k1 != "TYPE") {
                                    _obj[`${_k}`] = _v
                                    _obj[`${_k1}`] = _v1
                                    if (_matchingInteractingKeys.length === 0) {
                                        _matchingInteractingKeys.push(_obj)
                                    } else {
                                        let _dd = _.filter(_matchingInteractingKeys, (_o, _i) => { return JSON.stringify(_.orderBy(Object.keys(_o))) == JSON.stringify(_.orderBy(Object.keys(_obj))) })
                                        if (_dd.length == 0) {
                                            _matchingInteractingKeys.push(_obj)
                                        } else {
                                          //  console.log("dfsdjfgsdjhfgsj")
                                        }
                                    }
                                }
                            })
                        }
                    })

                    _.each(_matchingInteractingKeys, (_o, _i) => {
                        if (_o.BRAND_PRODUCT_CD || _o.DRUG_CD || _o.CLS_CD) {
                            _BrandOrClassOrDrugCds.push(_o)
                        } else {
                            _withoutBrandOrClassOrDrugCds.push(_o)
                        }
                    })

                    if (_BrandOrClassOrDrugCds.length > 0) {
                        if (_getBerandSubstanceNames.data.length > 1) {
                            _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                                _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                                    if (_o != _o1) {
                                        _comparisonData.push(
                                            {
                                                "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                                "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                                "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                                "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                                "BRAND_NAME_1": _o.BRAND_NAME,
                                                "BRAND_NAME_2": _o1.BRAND_NAME
                                            }
                                        )
                                    }
                                })
                            })
                            //GET DATA ONLY DRUG TO DRUG
                         let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                        _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                             _finalData.alertsData.push(_o)
                         })
                        }
                        let _finalGetInteractionDataWithAllScenearios = await finalGetInteractionDataWithAllScenearios(_BrandOrClassOrDrugCds, 0, [], req, _filter,_getBerandSubstanceNames)
                        let _findDuplicatesAndCombinedDatawithAllData = await findDuplicatesAndCombinedData(JSON.parse(JSON.stringify(_finalGetInteractionDataWithAllScenearios.data)), 'SRC_DRUG_CD', "INT_TYPE_ID");
                        if (_findDuplicatesAndCombinedDatawithAllData.length > 0) {
                            _.each(_findDuplicatesAndCombinedDatawithAllData, (_o, _i) => {
                                _finalData.alertsData.push(_o)
                            })
                        }
                    }

                    // if(_withoutBrandOrClassOrDrugCds.length > 0){
                    //     let filterKeyData = []
                    //     let _fil = _.filter(req.body.JSON[0], (_O, _I) => {
                    //         if (_O != "" && _I !== "TYPE") {
                    //             let _object = {}
                    //             _object[`${_I}`] = _O
                    //             filterKeyData.push(_object)
                    //         }
                    //     })

                    //     let _eachWiseData = await alertsWithSpecificKey(filterKeyData, 0, [], req, _filter)
                    //     _.each(_eachWiseData.data, (_o, _i) => {
                    //         _finalData.alertsData.push(_o)
                    //     })
                    // }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData, config: config });
                }
                //  else if (req.body.params.JSON[0].BRAND_PRODUCT_CD && req.body.params.JSON[0].BRAND_PRODUCT_CD != "" && req.body.params.JSON[0].DRUG_CD == "" && req.body.params.JSON[0].CLS_CD != "" && req.body.params.JSON[0].FOOD_CD == "" && req.body.params.JSON[0].DIS_CD == "" && req.body.params.JSON[0].LAB_TEST_CD == "") {
                //     let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.params.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS", res,_getBerandSubstanceNames)
                //     _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                //         _finalData.alertsData.push(_o)
                //     })
                //     // let _ChildResponse = await getDataBasedOnLooping(req.body.params.JSON[0].CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD")
                //     // if (_ChildResponse.data.length > 0) {
                //     //     _.each(_ChildResponse.data, (_o, _v) => {
                //     //         _getBerandSubstanceNames.data.push(_o)
                //     //     })
                //     //     if (_getBerandSubstanceNames.data.length > 1) {
                //     //         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                //     //             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                //     //                 if (_o != _o1) {
                //     //                     _comparisonData.push(
                //     //                         {
                //     //                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                //     //                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                //     //                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                //     //                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                //     //                             "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                //     //                             "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                //     //                         }
                //     //                     )
                //     //                 }
                //     //             })
                //     //         })
                //     //         //GET DATA ONLY DRUG TO DRUG
                //     //         let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                //     //         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                //     //             _finalData.alertsData.push(_o)
                //     //         })
                //     //     }
                //     // }
                //   return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                // } else if (req.body.params.JSON[0].BRAND_PRODUCT_CD && req.body.params.JSON[0].BRAND_PRODUCT_CD != "" && req.body.params.JSON[0].DRUG_CD != "" && req.body.params.JSON[0].CLS_CD != "" && req.body.params.JSON[0].FOOD_CD == "" && req.body.params.JSON[0].DIS_CD == "" && req.body.params.JSON[0].LAB_TEST_CD == "") {
                //     let _getInteractingBrandSubstanceNames = await getBerandSubstanceNames(req.body.params.JSON[0].DRUG_CD.split(","), 0, [], req, _filter);
                //     _.each(_getInteractingBrandSubstanceNames.data, (_o, _i) => {
                //         _getBerandSubstanceNames.data.push(_o)
                //     });
                //     if (_getBerandSubstanceNames.data.length > 1) {
                //         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                //             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                //                 if (_o != _o1) {
                //                     _comparisonData.push(
                //                         {
                //                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                //                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                //                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                //                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                //                             "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                //                             "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                //                         }
                //                     )
                //                 }
                //             })
                //         })

                //         let _classPushingData = [];
                //         _.each(req.body.params.JSON[0].CLS_CD.split(","), (_splitObj, _splitIndx) => {
                //             _.each(_comparisonData, (_comO, _comI) => {
                //                 _classPushingData.push({
                //                     SRC_DRUG_CD: _comO.SRC_DRUG_CD,
                //                     INT_TYPE_ID: _comO.INT_TYPE_ID,
                //                     SRC_BRAND_PRODUCT_CD: _comO.SRC_BRAND_PRODUCT_CD,
                //                     INT_BRAND_PRODUCT_CD: _comO.INT_BRAND_PRODUCT_CD,
                //                     BRAND_NAME_1: _comO.BRAND_NAME_1,
                //                     BRAND_NAME_2: _comO.BRAND_NAME_2,
                //                     CLASS_NAME_CD: _splitObj,
                //                 })
                //             })
                //         })
                //         //GET DATA ONLY DRUG TO DRUG
                //         let _getInteractionWithAlternative = await getInteractionWithAlternative(_classPushingData, 0, [], req, _filter, _brandProductName);
                //         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                //             _finalData.alertsData.push(_o)
                //         })
                //     }
                //     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                // } else if (req.body.params.JSON[0].BRAND_PRODUCT_CD && req.body.params.JSON[0].BRAND_PRODUCT_CD != "" && req.body.params.JSON[0].DRUG_CD == "" && req.body.params.JSON[0].CLS_CD != "" && req.body.params.JSON[0].FOOD_CD != "" && req.body.params.JSON[0].DIS_CD == "" && req.body.params.JSON[0].LAB_TEST_CD == "") {
                //     let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.params.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS", res,_getBerandSubstanceNames)
                //     _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                //         _finalData.alertsData.push(_o)
                //     })
                //     _.each(_getBerandSubstanceNames.data,(_o,_i)=>{
                //         _.each(req.body.params.JSON[0].FOOD_CD.split(","),(_o1,_i1)=>{
                //             if (_o != _o1) {
                //                 _comparisonData.push(
                //                     {
                //                         "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                //                         "INT_TYPE_ID": _o1,
                //                         "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                //                         "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                //                         "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                //                         "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                //                     }
                //                 )
                //             } 
                //         })
                //     })
                //     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                //     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                //         _finalData.alertsData.push(_o)
                //     })
                //     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData }); 
                // } else if (req.body.params.JSON[0].BRAND_PRODUCT_CD && req.body.params.JSON[0].BRAND_PRODUCT_CD != "" && req.body.params.JSON[0].DRUG_CD == "" && req.body.params.JSON[0].CLS_CD != "" && req.body.params.JSON[0].FOOD_CD != "" && req.body.params.JSON[0].DIS_CD == "" && req.body.params.JSON[0].LAB_TEST_CD == ""){

                // }
            } else {
                let filterKeyData = []
                let _fil = _.filter(req.body.JSON[0], (_O, _I) => {
                    if (_O != "" && _I !== "TYPE") {
                        let _object = {}
                        _object[`${_I}`] = _O
                        filterKeyData.push(_object)
                    }
                })

                let _eachWiseData = await alertsWithSpecificKey(filterKeyData, 0, [], req, _filter)
                _.each(_eachWiseData.data, (_o, _i) => {
                    _finalData.alertsData.push(_o)
                })
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData, config: config });
        } else if (req.body.JSON[0].TYPE == "DRTODR") {
            if (req.bodyJSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && (!(req.body.JSON[0].DRUG_CD)) && req.body.JSON[0].CLS_CD == "") {
                if (_getBerandSubstanceNames.data.length > 1) {

                    _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                        _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                            if (_o != _o1) {
                                _comparisonData.push(
                                    {
                                        "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                        "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                        "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                        "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                        "BRAND_NAME_1": _o.BRAND_NAME,
                                        "BRAND_NAME_2": _o1.BRAND_NAME
                                    }
                                )
                            }
                        })
                    })
                    //GET DATA ONLY DRUG TO DRUG
                    let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                    _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD != "" && req.body.JSON[0].CLS_CD == "") {
                let interactingbrandresp = await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter)
                _.each(interactingbrandresp.data, (_o, _i) => {
                    _getBerandSubstanceNames.data.push(_o)
                })
                if (_getBerandSubstanceNames.data.length > 1) {
                    _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                        _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                            if (_o != _o1) {
                                _comparisonData.push(
                                    {
                                        "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                        "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                        "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                        "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                        "BRAND_NAME_1": _o.BRAND_NAME,
                                        "BRAND_NAME_2": _o1.BRAND_NAME
                                    }
                                )
                            }
                        })
                    })
                    //GET DATA ONLY DRUG TO DRUG
                    let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                    _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].CLS_CD != "") {
                if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && (!(req.body.JSON[0].DRUG_CD)) && req.body.JSON[0].CLS_CD != "") {
                    let _ChildResponse = await getDataBasedOnLooping(req.body.JSON[0].CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD")
                    if (_ChildResponse.data.length > 0) {
                        _.each(_ChildResponse.data, (_o, _v) => {
                            _getBerandSubstanceNames.data.push(_o)
                        })
                        if (_getBerandSubstanceNames.data.length > 1) {
                            _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                                _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                                    if (_o != _o1) {
                                        _comparisonData.push(
                                            {
                                                "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                                "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                                "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                                "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                                "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                                                "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                                            }
                                        )
                                    }
                                })
                            })
                            //GET DATA ONLY DRUG TO DRUG
                            let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                            _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                                _finalData.alertsData.push(_o)
                            })
                        }
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                } else {
                    let _getInteractingBrandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter);
                    _.each(_getInteractingBrandSubstanceNames.data, (_o, _i) => {
                        _getBerandSubstanceNames.data.push(_o)
                    });
                    if (_getBerandSubstanceNames.data.length > 1) {
                        _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                            _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
                                if (_o != _o1) {
                                    _comparisonData.push(
                                        {
                                            "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                            "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                            "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                            "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                            "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                                            "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                                        }
                                    )
                                }
                            })
                        })

                        let _classPushingData = [];
                        _.each(req.body.JSON[0].CLS_CD.split(","), (_splitObj, _splitIndx) => {
                            _.each(_comparisonData, (_comO, _comI) => {
                                _classPushingData.push({
                                    SRC_DRUG_CD: _comO.SRC_DRUG_CD,
                                    INT_TYPE_ID: _comO.INT_TYPE_ID,
                                    SRC_BRAND_PRODUCT_CD: _comO.SRC_BRAND_PRODUCT_CD,
                                    INT_BRAND_PRODUCT_CD: _comO.INT_BRAND_PRODUCT_CD,
                                    BRAND_NAME_1: _comO.BRAND_NAME_1,
                                    BRAND_NAME_2: _comO.BRAND_NAME_2,
                                    CLASS_NAME_CD: _splitObj,
                                })
                            })
                        })
                        //GET DATA ONLY DRUG TO DRUG
                        let _getInteractionWithAlternative = await getInteractionWithAlternative(_classPushingData, 0, [], req, _filter, _brandProductName);
                        _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                            _finalData.alertsData.push(_o)
                        })
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                }
            }
        } else if (req.body.JSON[0].TYPE == "DRTOFD") {
            if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].FOOD_CD != "") {
                if (_getBerandSubstanceNames.data.length > 1) {
                    _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                        _.each(req.body.JSON[0].FOOD_CD.split(","), (_o1, _i1) => {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME
                                }
                            )
                        })
                    })
                    //GET DATA ONLY DRUG TO DRUG
                    let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                    _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].FOOD_CD != "") {
                let _foodResponse = await getDataBasedOnLooping(req.body.JSON[0].FOOD_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "FOOD");
                _.each(_foodResponse.data, (_fo, _fi) => {
                    _finalData.alertsData.push(_fo)
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            }
        } else if (req.body.JSON[0].TYPE == "DRTODIS") {
            if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DIS_CD != "") {
                if (_getBerandSubstanceNames.data.length > 1) {
                    let _getDiseaseCodesAganistICDS = await getDiseaseCodesAganistICDS(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter)
                    _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                        _.each(_getDiseaseCodesAganistICDS.data, (_o1, _i1) => {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1.INT_TYPE_ID,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME
                                }
                            )
                        })
                    })
                    //GET DATA ONLY DRUG TO DRUG
                    let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                    _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].DIS_CD != "") {
                let _foodResponse = await getDataBasedOnLooping(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "DISEASE");
                _.each(_foodResponse.data, (_fo, _fi) => {
                    _finalData.alertsData.push(_fo)
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            }
        } else if (req.body.JSON[0].TYPE == "DRTOLAB") {
            if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].LAB_TEST_CD != "") {
                if (_getBerandSubstanceNames.data.length > 1) {
                    _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                        _.each(req.body.JSON[0].LAB_TEST_CD.split(","), (_o1, _i1) => {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME
                                }
                            )
                        })
                    })
                    //GET DATA ONLY DRUG TO DRUG
                    let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
                    _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                        _finalData.alertsData.push(_o)
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].LAB_TEST_CD != "") {
                let _diseaseResponse = await getDataBasedOnLooping(req.body.JSON[0].LAB_TEST_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "LAB");
                _.each(_diseaseResponse.data, (_fo, _fi) => {
                    _finalData.alertsData.push(_fo)
                })
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
            }
        } else if (req.body.JSON[0].TYPE == "MONOGRAPH") {
            // let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.params.BRAND_PRODUCT_CD.split(","), 0, [], req, _filter)
            if (_getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0 && _getBerandSubstanceNames.data[0].IS_ASSIGNED == "PUBLISHED") {
                _filter.filter['DD_SUBSTANCE_CD'] = _getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0 ? _getBerandSubstanceNames.data[0].DD_SUBSTANCE_CD : "";
                //get drug against class start.
                let concatinate = "";
                let _finalData = []
                let classAganistSubstances = await getDataBasedOnLooping(_getBerandSubstanceNames.data, 0, [], req, _filter, "dd_substance_classifications", "SUBSTANCE_AGANIST_CLASS");
                if (classAganistSubstances.data.length > 0) {
                    _.each(classAganistSubstances.data, (_o, _i) => {
                        concatinate += _o.CLASS_NAME + ","
                    })
                }
                //get drug against class end.
                let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "");
                if (!(_mBrandProductResp && _mBrandProductResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
                } else {
                    if (_mBrandProductResp.data.length > 0) {
                        _.each(JSON.parse(JSON.stringify(_mBrandProductResp.data)), (_obj, _indx) => {
                            _obj['DD_SUBSTANCE_NAME'] = _getBerandSubstanceNames.data[0].DD_SUBSTANCE_NAME
                            _obj['CLASS_NAME'] = concatinate.substring(0, concatinate.length - 1)
                            _finalData.push(_obj)
                        })
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData, config: config });
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: [] });
            }
        }

    } catch (error) {
      //  console.log(error)
    }
})


/**get templates */
router.post("/get-template-data", async (req, res) => {
    try {
        if (req.body.params.content_type) {
            let _filter = {
                "filter": {
                    "content_type": req.body.params.content_type
                },
                "selectors": "-history"
            }

            //    let _pGData = await prepareGetPayload(_filter, req.body.params);
            //    if (!_pGData.success) {
            //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            //    }
            mongoMapper("monography_templates", "find", _filter, "").then(async (result) => {

                // if (content_type === "650a9d0ad9a18e495d89d223" && req.body.params.id2) {
                //     let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
                //     let resonseData = []
                //     let params = {
                //         "TYPE": "DRUG_INTERACTIONS",
                //         "FLAG": "A",
                //         "ID2": req.body.params.id2
                //     }
                //     await axios1.post(url, params).then((response) => { resonseData = response.data })
                //         .catch((err) => {
                //             console.log("err", err)
                //         })
                //     console.log("resonseData", resonseData)

                // }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})

/* Verify Token Function */
router.use(async function verifyToken(req, res, next) {
    // if (!req.cookies || !req.cookies["x-token"]) {
    //     return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    // }
    if (!req.headers || !req.headers["x-token"]) {
        return res.status(400).send({ status: 'FAIL', data: [], desc: "Missing Token ." });
    }
    try {
        _token.verifyToken(req.headers["x-token"]).then(async (data) => {
            req.tokenData = data;
            req.clientUrls = await getClientUrls(data);
            next();
        }).catch((error) => {
            if (error.name && error.name == 'TokenExpiredError') {
                return res.status(401).json({
                    "code": 401,
                    "message": "Token was Expired. Please generate new Token..",
                    "timestamp": moment(new Date()).format(_dateTimeFormate),
                    "version": "1.0.0"
                });
            }
            return res.status(401).json({
                "code": 401,
                "message": "Authentication failed, Invalid token .",
                "timestamp": moment(new Date()).format(_dateTimeFormate),
                "version": "1.0.0"
            });
        });
    } catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err.message || err, data: [] });
    }
});


/* Parameter Validation Midleware function */
router.use(function paramValidation(req, res, next) {
    try {
        // req.tokenData = { "userId": 1234, "userName": "Somesh P" };
        let _query = req.body.query || req.query.query || "";
        if (!_query || _query == "") {
            return res.status(400).json({ status: 'FAIL', desc: `Require Query Paramer..`, data: [] });
        }
        let _index = _.findIndex(_queries, function (o) { return o.trim() == _query.trim(); });
        if (_index == -1) {
            return res.status(400).json({ status: 'FAIL', desc: `Provided ${_query} Query Paramer is not supported..`, data: [] });
        }
        if (_query == 'findById') {
            let _methods = ["body", "query"];
            let _exists = false;
            for (let _idx of _methods) {
                if (req.method == 'POST')
                    _exists = req[_idx].params && req[_idx].params["_id"] != undefined && req[_idx].params["_id"] != '' ? true : false;
                else if (req.method == 'GET')
                    _exists = req[_idx] && req[_idx]["_id"] != undefined && req[_idx]["_id"] != '' ? true : false;
                if (_exists) break;
            }
            if (!_exists) {
                return res.status(400).json({ status: 'FAIL', desc: `Invalid Paramers..`, data: [] });
            }
        }
        else if (_query === 'insertMany') {
            req.body.params["audit"] = {
                documentedBy: req.tokenData ? req.tokenData.displayName : "EMR Admin",
                documentedById: req.tokenData ? req.tokenData.userId : null
            }
            req["cAudit"] = {
                documentedById: req.tokenData ? req.tokenData.userId : null,
                documentedBy: req.tokenData ? req.tokenData.displayName : null,
                documentedDt: req.tokenData ? new Date().toISOString() : null
            }
        }
        else if (_query === 'updateOne') {

            //if (req.body.flag !== 'BW') {
            req.body.params["audit"] = {
                modifiedById: req.tokenData.userId,
                modifiedBy: req.tokenData.displayName,
                modifiedDt: new Date().toISOString()
            };

            if (req.body.params.status == "COMPLETED") {
                req.body.params["audit"] = {
                    completedById: req.tokenData.userId,
                    completedBy: req.tokenData.displayName,
                    completedDt: new Date().toISOString(),
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.displayName,
                    modifiedDt: new Date().toISOString()
                }
            } else if (req.body.params.status == "APPROVED") {
                req.body.params["audit"] = {
                    approvedById: req.tokenData.userId,
                    approvedBy: req.tokenData.displayName,
                    approvedDt: new Date().toISOString(),
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.displayName,
                    modifiedDt: new Date().toISOString()
                }
            }

            //   if(req.body.params.checkStatus){
            //   if(req.body.params.checkStatus.status === "checkIn"){
            //     req.body.params["checkStatus"].checkInDt=new Date().toISOString()

            //    }else if(req.body.params.checkStatus.status === "checkOut"){
            //     req.body.params["checkStatus"].checkOutDt=new Date().toISOString()
            //    }
            // }



            // }     
            req["cAudit"] = {
                documentedById: req.tokenData.userId,
                documentedBy: req.tokenData.displayName
            }
        }
        next();
    }
    catch (err) {
        return res.status(500).json({ status: 'FAIL', desc: err.message, data: [] });
    }
});
/* Insert Levels Data */
router.post("/insert-level", async (req, res) => {
    try {
        // req.body.params["audit"]={
        //     documentedBy:req.tokenData.userName,
        //     documentedById:req.tokenData.userId
        // }
        mongoMapper('monography_levels', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});
/* get all levels */
router.post("/get-levels", async (req, res) => {
    try {
        // let _filter = {
        //     "filter": { "_id":req.body.params._id },
        //     "selectors": ""
        // }
        mongoMapper("monography_levels", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

/*update levels */
router.post("/update-level", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_levels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_levels', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_levels', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*Insert Role Data*/
router.post("/insert-role", async (req, res) => {
    try {
        mongoMapper('monography_roles', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Get Doctors */
router.post("/get-roles", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                // "content_type":req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "label": "$label",
                "isActive": "$isActive",
                "revNo": "$revNo",
                "content_type": "$content_type",
                "sequence": "$sequence",
                "actionOfRole": "$actionOfRole",
                "sections": {
                    $filter: {
                        input: "$sections",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "level": "$level",
            }

        }

        // if(req.body.params.content_type){
        //   _filter.filter['content_type'] = req.body.params.content_type
        // }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("monography_roles", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Role */
router.post("/update-roles", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_roles', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {
            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('monography_roles', 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("check-role-with-section", (req, res) => {
    try {
        if (req.body.params.roleId && req.body, params.sectionId) {
            let _filter = {
                "filter": {
                    "role_id": req.body.params.roleId,
                    "drug_section_id": req.body.params.sectionId
                }
            }
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }
    } catch (error) {

    }
})

/**insert-users Data */
router.post("/insert-users", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            //req.body.params.roleId=req.tokenData.roleId
            mongoMapper('monography_users', req.body.query, req.body.params).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Provide Valid Details", data: [] });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Users */
// router.post("/get-users", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": { "_id": req.body.params._id },
//             "selectors": ""
//         }
//         mongoMapper("monography_users", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });

router.post("/get-users", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                // content_type:req.body.params.content_type
            },
            "selectors": {
                "_id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "displayName": "$displayName",
                "gender": "$gender",
                "mobile": "$mobile",
                "address": "$address",
                "userName": "$userName",
                "password": "$password",
                "profilePic": "$profilePic",
                "EmpId": "$EmpId",
                "defaultRoleId": "$defaultRoleId",
                "defaultRoleName": "$defaultRoleName",
                "revNo": "$revNo",
                "isActive": "$isActive",
                "assignedRoles": {
                    $filter: {
                        input: "$assignedRoles",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit"
            }
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("monography_users", "find", _pGData.data, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/**Update Users */
router.post("/update-users", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_users", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_users', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }

                //  pLoadResp.payload.query.$push["permissions"]=permsDta
                // = req.body.params.permissions
            }
            mongoMapper('monography_users', 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert-drug-creation Data */
// router.post("/insert-drug-details", async (req, res) => {
//     try {
//         _.each(req.body.params, (_p) => {
//             _p["audit"] = req.body.params.audit
//         });
//         //  delete req.body.params.audit;
//         req.body.params["template"] = getTemplateData.data
//         mongoMapper('monography_drugcreation', "insertMany", req.body.params).then(async (result) => {
//             if (!(result && result.data && result.data.length > 0)) {
//                 return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
//             }
//             let _filter = {
//                 "filter": {
//                     "recStatus": true
//                 },
//                 "selectors": {
//                     "_id": "$_id",
//                     "label": "$label",
//                     "isActive": "$isActive",
//                     "regNo": "$regNo",
//                     "sections": {
//                         $filter: {
//                             input: "$sections",
//                             cond: {
//                                 $eq: ["$$this.recStatus", true]
//                             }
//                         }
//                     },
//                     "audit": "$audit",
//                     "level": "$level",
//                 }
//             }
//             let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
//             if (!(_rResp && _rResp.success)) {
//                 return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
//             }

//             let _assignedTo = [];
//             _.each(req.body.params, (_p) => {
//                 _.each(_p.assignedTo, (_o) => {
//                     let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
//                     if (_fRole && _fRole.length > 0) {
//                         let _sections = [];
//                         _.each(_fRole[0].sections, (_s) => {
//                             _sections.push({
//                                 hcpId: _s.hcpId || null,
//                                 patientId: _s.patientId || null
//                             });
//                         });
//                         _assignedTo.push({
//                             dId: result.data[0]._id,
//                             DD_SUBSTANCE_COMB_NAME: result.data[0].DD_SUBSTANCE_COMB_NAME,
//                             DD_DRUG_MASTER_CD: result.data[0].DD_DRUG_MASTER_CD ? result.data[0].DD_DRUG_MASTER_CD : "",
//                             DD_SUBSTANCE_COMB_CD: result.data[0].DD_SUBSTANCE_COMB_CD ? result.data[0].DD_SUBSTANCE_COMB_CD : "",
//                             PARENT_DRUG_CD: result.data[0].PARENT_DRUG_CD ? result.data[0].PARENT_DRUG_CD : "",
//                             assignedTo: _o,
//                             sections: _sections
//                         });
//                     }
//                 });
//             });
//             let _mResp;
//             if (!(result.data[0].PARENT_DRUG_CD === "" || result.data[0].PARENT_DRUG_CD === null)) {
//                 delete _filter.selectors
//                 _filter.filter['DD_DRUG_MASTER_CD'] = result.data[0].PARENT_DRUG_CD
//                 let _mResp1 = await _mUtils.commonMonogoCall("monography_userAssign", "find", _filter, "", "", "", "");
//                 if (_mResp1.data.length > 0) {
//                     _mResp  = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
//                     if (!(_mResp && _mResp.success)) {
//                         return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//                     }
//                    }else {
//                     return res.status(400).json({ success: false, status: 400, desc:`this ${result.data[0].DD_SUBSTANCE_COMB_NAME} of parent drug not assigned to any user`, data:  [] });
//                    }
//             } else {
//                  _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
//                 if (!(_mResp && _mResp.success)) {
//                     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//                 }
//             }
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });


async function insertSectionDataAganistContentType(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {

            let _filter = {
                "filter": {
                    "isActive": true,
                    "content_type": _data[_idx].content_type
                },
                "selectors": "-history"
            };
            let resonseData = [];
            let _tResp = await _mUtils.commonMonogoCall("monography_templates", "find", _filter, "", "", "", "");
            if (!(_tResp && _tResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }
            delete _filter.filter.content_type
            _filter.filter['SRC_DRUG_CD'] = _data[_idx].DD_SUBSTANCE_CD
            let _childResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", {}, "", "", "", "");
            if (_childResp.data.length > 0) {
                _.each(_childResp.data, (_o, _i) => {
                    resonseData.push(_o)
                })
            }
            // await axios1.post(url, { "TYPE": "DRUG_INTERACTIONS", "FLAG": "A", "ID2": _data[_idx].DD_SUBSTANCE_CD })
            //     .then((response) => { resonseData = response.data.Table1 })
            //     .catch((err) => {
            //         console.log("err", err)
            //     })

            let _intIdData = [];
            let _intChildData = []
            let _sectionPushData = [];
            let _insertSection;
            if (resonseData.length > 0) {
                _.each(_tResp.data, (_obj, _indx) => {
                    _intIdData = []
                    let _reduceData = resonseData.filter((_keys, _objects) => {
                        if (_obj.INT_ID == _keys.INT_ID) {
                            _intIdData.push(_keys)
                        }
                    })
                    if (_intIdData.length > 0) {
                        _sectionPushData.push({
                            DD_SUBSTANCE_CD: _intIdData[0].SRC_DRUG_CD,
                            SECTION_NAME: _obj.label,
                            INT_ID: _obj.INT_ID,
                            SECTION_TYPE: "interaction",
                            drug_section_id: _obj._id,
                            drugId: _data[_idx]._id,
                            content_type: _data[_idx].content_type,
                            user_id: _data[_idx].assignedTo[0].userId,
                            role_id: _data[_idx].assignedTo[0].roleId,
                            audit: req.body.params.audit,
                            interacaction_drug_content: _intIdData
                        })
                    }
                })
                _insertSection = await _mUtils.commonMonogoCall("monography_sections", "insertMany", _sectionPushData, "", "", "", "");
                if (!(_insertSection && _insertSection.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: "insert section failed", data: [] })
                }
            }

            _sectionPushData = []
            if (resonseData.length > 0) {
                _.each(_tResp.data, (_obj, _indx) => {
                    _intIdData = []
                    let _reduceData = resonseData.filter((_keys, _objects) => {
                        if (_obj.INT_ID == _keys.INT_ID) {
                            _intIdData.push(_keys)
                        }
                    })
                    if (_intIdData.length > 0) {
                        if (_obj.children[0].label == "References") {
                            _intChildData = []
                            _.each(_intIdData, (_intObj, _intIndx) => {
                                _intObj.INTERACTIONS = ""
                                _intObj.REFERENCES = _intObj.REFERENCES
                                _intChildData.push(_intObj)
                            })
                            _sectionPushData.push({
                                DD_SUBSTANCE_CD: _intIdData[0].SRC_DRUG_CD,
                                SECTION_NAME: _obj.children[0].label,
                                SECTION_TYPE: "interaction",
                                INT_ID: _intChildData[0].INT_ID,
                                drug_section_id: _obj.children[0]._id,
                                drugId: _data[_idx]._id,
                                content_type: _data[_idx].content_type,
                                user_id: _data[_idx].assignedTo[0].userId,
                                role_id: _data[_idx].assignedTo[0].roleId,
                                audit: req.body.params.audit,
                                interacaction_drug_content: _intChildData
                            })
                          //  console.log("_sectionPushData", _sectionPushData)
                        }
                        //    _sectionPushData.push({
                        //        DD_SUBSTANCE_CD:_intIdData[0].SRC_DRUG_CD,
                        //        SECTION_NAME:_obj.label,
                        //        SECTION_TYPE:"interaction",
                        //        drug_section_id:_obj._id,
                        //        drugId:_data[_idx]._id,
                        //        content_type:_data[_idx].content_type,
                        //        user_id:_data[_idx].assignedTo[0].userId,
                        //        role_id:_data[_idx].assignedTo[0].roleId,
                        //        audit:req.body.params.audit,
                        //        interacaction_drug_content:_intIdData
                        //    })
                    }
                })
                _insertSection1 = await _mUtils.commonMonogoCall("monography_sections", "insertMany", _sectionPushData, "", "", "", "");
                if (!(_insertSection1 && _insertSection1.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: "insert section failed", data: [] })
                }
            }
            _output.push({ success: true, desc: "", data: _insertSection.data || [] });
            _idx = _idx + 1
            await insertSectionDataAganistContentType(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

router.post("/insert-drug-details", async (req, res) => {
    try {
        _.each(req.body.params, (_p) => {
            _p["audit"] = req.body.params.audit
        });
        //  delete req.body.params.audit;
        // req.body.params["template"] = getTemplateData.data

        //      //insert section data aganist content type(interaction) start.
        //      //if(_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223"){
        //         let _insSectionData = await insertSectionDataAganistContentType(req.body.params,0,[],req)
        //    // }

        ////insert section data aganist content type(interaction) end.
        mongoMapper('monography_drugcreation', "insertMany", req.body.params).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }

            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": {
                    "_id": "$_id",
                    "label": "$label",
                    "isActive": "$isActive",
                    "content_type": "$content_type",
                    "revNo": "$revNo",
                    "sections": {
                        $filter: {
                            input: "$sections",
                            cond: {
                                $eq: ["$$this.recStatus", true]
                            }
                        }
                    },
                    "audit": "$audit",
                    "level": "$level",
                }
            }


            let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
            if (!(_rResp && _rResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            let statusResp_next_status;
            let _statusResp = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
            _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
            if (_statusResp && _statusResp.success) {
                let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === "NOT ACCEPTED" && objects.roleType === "" })
                statusResp_next_status = findIndx[0].next_status
            }


            let _assignedTo = [];
            let _idx = 0;
            _.each(req.body.params, (_p) => {
                _.each(_p.assignedTo, (_o) => {
                    //  let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    // && _r.content_type === _o.content_type
                    let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    if (_fRole && _fRole.length > 0) {
                        let _sections = [];
                        _.each(_fRole[0].sections, (_s) => {
                            _sections.push({
                                hcpId: _s.hcpId || null,
                                patientId: _s.patientId || null,
                                drugInteractionId: _s.drugInteractionId || null
                            });
                        });

                        _assignedTo.push({
                            dId: result.data[_idx]._id,
                            DD_SUBSTANCE_NAME: result.data[_idx].DD_SUBSTANCE_NAME,
                            DD_SUBSTANCE_CD: result.data[_idx].DD_SUBSTANCE_CD ? result.data[_idx].DD_SUBSTANCE_CD : "",
                            PARENT_DRUG_CD: result.data[_idx].PARENT_DRUG_CD ? result.data[_idx].PARENT_DRUG_CD : "",
                            next_status: statusResp_next_status,
                            assignedTo: _o,
                            content_type: _o.content_type,
                            previousAssigned: _p.previousAssigned,
                            audit: req.body.params.audit ? req.body.params.audit : "",
                            sections: _sections
                        });
                        _idx = _idx + 1
                    }
                });
            });

            let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }


            ///drug work flows functionality start          
            let _getContentWriterData = []
            _.each(_mResp.data, (_o, _i) => {
                _.each(_o.assignedTo, (_o1, _i1) => {
                    if (_o1.actionOfRole === "CONTENT WRITER") {
                        _getContentWriterData.push(_o)
                    }
                })
            })
            if (_getContentWriterData.length > 0) {
                let _cResp = await _mUtils.commonMonogoCall("monography_drugworkflow", "insertMany", _getContentWriterData, "", "", "", req.tokenData.dbType)
                if (!(_cResp && _cResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _cResp.desc || "", data: _cResp.data || [] });
                }
            }
            ///drug wrok flow functionality end.


            //tracking logic start
            let statusData = []
            _.each(_mResp.data, (obj, indx) => {
                statusData.push({
                    current_status: obj.current_status,
                    next_status: statusResp_next_status,
                    previous_status: obj.previous_status,
                    roleId: obj.assignedTo[0].roleId ? obj.assignedTo[0].roleId : "",
                    roleName: obj.assignedTo[0].roleName ? obj.assignedTo[0].roleName : "",
                    userId: obj.assignedTo[0].userId ? obj.assignedTo[0].userId : "",
                    userName: obj.assignedTo[0].userName ? obj.assignedTo[0].userName : "",
                    previousRoleId: obj.previousAssigned[0].roleId ? obj.previousAssigned[0].roleId : "",
                    previousRoleName: obj.previousAssigned[0].roleName ? obj.previousAssigned[0].roleName : "",
                    previousUserId: obj.previousAssigned[0].userId ? obj.previousAssigned[0].userId : "",
                    previousUserName: obj.previousAssigned[0].userName ? obj.previousAssigned[0].userName : "",
                    drugId: obj.dId,
                    operation_type: obj.operation_type ? obj.operation_type : "",
                    DD_SUBSTANCE_NAME: obj.DD_SUBSTANCE_NAME,
                    DD_SUBSTANCE_CD: obj.DD_SUBSTANCE_CD,
                    content_type: obj.content_type ? obj.content_type : "",
                    audit: req.body.params.audit,
                    user_assigned_table_id: _mResp.data[indx]._id,
                    drug_mono_id: obj._id
                })
            })
            let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", req.tokenData.dbType)
            //tracking logic end

            //insert section data aganist content type(interaction) start.
            if (_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223") {
                let _insSectionData = await insertSectionDataAganistContentType(_getContentWriterData, 0, [], req)
                if (!(_insSectionData && _insSectionData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _insSectionData || "", data: [] });
                }
            }

            ////insert section data aganist content type(interaction) end.
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Insert (or) Update Multiple documents in Nested Array */
async function insertUpdateInMultiData(_data, _idx, _output, req, _dbType, ...cmf) {
    try {
        if (_data.params.length > _idx) {

            if (_data.params[_idx]._id) {

                let _cBody = JSON.parse(JSON.stringify(_data));
                if (_idx !== 0) {
                    delete _cBody.params.history;
                }

                let statusData = []
                let statusResp_next_status;
                let _statusResp = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
                _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
                if (_statusResp && _statusResp.success) {
                    let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === _data.params[_idx].current_status && (objects.roleType === "" || objects.roleType === _data.params[_idx].assignedTo[0].actionOfRole) }, 0)
                    statusResp_next_status = findIndx[0].next_status
                }


                _cBody.params = {}
                _data.params[_idx].next_status = statusResp_next_status;
                _data.params[_idx]['audit'] = req.body.params.audit;
                _data.params[_idx]["revNo"] = _data.params[_idx].revNo ? _data.params[_idx].revNo + 1 : ""
                _cBody.params = _data.params[_idx];

                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
                let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
                if (!(_mResp && _mResp.success)) {
                    _output.push({ success: false, desc: _mResp.desc || "", data: [] });
                }
                else {
                    let updateDrugFlowData = {};
                    _.each(_cBody.params, (v, k) => {
                        if (k === "assignedTo") {
                            _.each(v, (o, i) => {
                                if (o.actionOfRole && o.actionOfRole === "CONTENT WRITER") {
                                    updateDrugFlowData = _cBody.params
                                }
                            })
                        }
                    })

                    if (Object.keys(updateDrugFlowData).length > 0) {
                        pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
                        let _mResp1 = await _mUtils.commonMonogoCall("monography_drugworkflow", cmf[1], pLoadResp.payload, "", "", "", _dbType)
                        if (!(_mResp1 && _mResp1.success)) {
                            //  _output.push({ success: false, desc: _mResp.desc || "", data: [] });
                        }
                    }

                    //get updating data with _id
                    let _s = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")

                    statusData.push({
                        current_status: _data.params[_idx].current_status ? _data.params[_idx].current_status : "",
                        next_status: statusResp_next_status ? statusResp_next_status : "",
                        roleId: _data.params[_idx].assignedTo[0].roleId ? _data.params[_idx].assignedTo[0].roleId : "",
                        roleName: _data.params[_idx].assignedTo[0].roleName ? _data.params[_idx].assignedTo[0].roleName : "",
                        userId: _data.params[_idx].assignedTo[0].userId ? _data.params[_idx].assignedTo[0].userId : "",
                        userName: _data.params[_idx].assignedTo[0].userName ? _data.params[_idx].assignedTo[0].userName : "",
                        drugId: _data.params[_idx].dId,
                        DD_SUBSTANCE_NAME: _data.params[_idx].DD_SUBSTANCE_NAME,
                        operation_type: _data.params[_idx].operation_type ? _data.params[_idx].operation_type : "",
                        audit: _data.params[_idx].audit ? _data.params[_idx].audit : "",
                        user_assigned_table_id: _data.params[_idx]._id ? _data.params[_idx]._id : "",
                        drug_mono_id: _data.params[_idx]._id ? _data.params[_idx]._id : ""
                    })
                    let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                    if (!(_statusflowTracking && _statusflowTracking.success)) {
                        _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                    }
                    _output.push({ success: true, desc: "", data: _mResp.data || [] });
                }
            }
            else {
                let insertData = [];

                insertData.push(_data.params[_idx])
                req.body.params = insertData;
                req.body.params[0].audit = req.cAudit;
                let _pResp = await _mUtils.commonMonogoCall("monography_drugcreation", "insertMany", req.body.params, "", "", "", "")
                if (!(_pResp && _pResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _pResp.desc || "", data: _pResp.data || [] });
                }

                let _filter = {
                    "filter": {
                        "recStatus": true
                    },
                    "selectors": {
                        "_id": "$_id",
                        "label": "$label",
                        "isActive": "$isActive",
                        "content_type": "$content_type",
                        "revNo": "$revNo",
                        "sections": {
                            $filter: {
                                input: "$sections",
                                cond: {
                                    $eq: ["$$this.recStatus", true]
                                }
                            }
                        },
                        "audit": "$audit",
                        "level": "$level",
                    }
                }

                let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
                if (!(_rResp && _rResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                }


                let statusResp_next_status;
                let _statusResp = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
                _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
                if (_statusResp && _statusResp.success) {
                    let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === "NOT ACCEPTED" && objects.roleType === "" })
                    statusResp_next_status = findIndx[0].next_status
                }


                let _assignedTo = [];
                //      let _idx = 0;
                _.each(req.body.params, (_p) => {
                    _.each(_p.assignedTo, (_o) => {
                        // && _r.content_type === _o.content_type 
                        let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                        if (_fRole && _fRole.length > 0) {
                            let _sections = [];
                            _.each(_fRole[0].sections, (_s) => {
                                _sections.push({
                                    hcpId: _s.hcpId || null,
                                    patientId: _s.patientId || null,
                                    drugInteractionId: _s.drugInteractionId || null
                                });
                            });

                            _assignedTo.push({
                                dId: _pResp.data[0]._id,
                                DD_SUBSTANCE_NAME: _pResp.data[0].DD_SUBSTANCE_NAME,
                                DD_SUBSTANCE_CD: _pResp.data[0].DD_SUBSTANCE_CD ? _pResp.data[0].DD_SUBSTANCE_CD : "",
                                PARENT_DRUG_CD: _pResp.data[0].PARENT_DRUG_CD ? _pResp.data[0].PARENT_DRUG_CD : "",
                                next_status: statusResp_next_status,
                                assignedTo: _o,
                                content_type: _o.content_type,
                                previousAssigned: _p.previousAssigned,
                                audit: req.cAudit ? req.cAudit : "",
                                sections: _sections
                            });
                            //  console.log("_assignedTo", _assignedTo)
                            //  _idx = _idx + 1
                        }
                    });
                });


                let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }

                let _getContentWriterData = []
                _.each(_mResp.data, (_o, _i) => {
                    _.each(_o.assignedTo, (_o1, _i1) => {
                        if (_o1.actionOfRole === "CONTENT WRITER") {
                            _getContentWriterData.push(_o)
                        }
                    })
                })

                if (_getContentWriterData.length > 0) {
                    let _cResp = await _mUtils.commonMonogoCall("monography_drugworkflow", "insertMany", _getContentWriterData, "", "", "", req.tokenData.dbType)
                    if (!(_cResp && _cResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _cResp.desc || "", data: _cResp.data || [] });
                    }
                }

                ///drug wrok flow functionality end.


                let statusData = []
                _.each(_mResp.data, (obj, indx) => {
                    statusData.push({
                        current_status: obj.current_status,
                        next_status: statusResp_next_status,
                        roleId: obj.assignedTo[0].roleId ? obj.assignedTo[0].roleId : "",
                        roleName: obj.assignedTo[0].roleName ? obj.assignedTo[0].roleName : "",
                        userId: obj.assignedTo[0].userId ? obj.assignedTo[0].userId : "",
                        userName: obj.assignedTo[0].userName ? obj.assignedTo[0].userName : "",
                        previousRoleId: obj.previousAssigned[0].roleId ? obj.previousAssigned[0].roleId : "",
                        previousRoleName: obj.previousAssigned[0].roleName ? obj.previousAssigned[0].roleName : "",
                        previousUserId: obj.previousAssigned[0].userId ? obj.previousAssigned[0].userId : "",
                        previousUserName: obj.previousAssigned[0].userName ? obj.previousAssigned[0].userName : "",
                        operation_type: obj.operation_type ? obj.operation_type : "",
                        content_type: obj.content_type ? obj.content_type : "",
                        drugId: obj.dId,
                        DD_SUBSTANCE_NAME: obj.DD_SUBSTANCE_NAME,
                        DD_SUBSTANCE_CD: obj.DD_SUBSTANCE_CD,
                        audit: req.cAudit,
                        user_assigned_table_id: _mResp.data[indx]._id,
                        drug_mono_id: obj._id
                    })
                })
                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", req.tokenData.dbType);

                //insert section data aganist content type(interaction) start.
                if (_getContentWriterData.length > 0 && _getContentWriterData[0].content_type == "650a9d0ad9a18e495d89d223") {
                    let _insSectionData = await insertSectionDataAganistContentType(_getContentWriterData, 0, [], req)
                    if (!(_insSectionData && _insSectionData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _insSectionData || "", data: [] });
                    }
                }

                ////insert section data aganist content type(interaction) end.

                //   return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }
            _idx = _idx + 1;
            await insertUpdateInMultiData(_data, _idx, _output, req, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};

/**update userassigning data */
router.post("/update-userAssign-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        //  _cBody = { params:{_cBody}}
        let _updateResp = await insertUpdateInMultiData(_cBody, 0, [], req, "", 'monography_userAssign', 'bulkWrite', 'BW')
        return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

//update drugFlow Data functions start
async function InsertCommentdata(_data, _params, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let commentMaindata = []
            commentMaindata.push(_data[_idx])
            let _comments = {
                referenceType: _data[_idx].content_type ? _data[_idx].content_type : "",
                referenceId: _data[_idx].drugId ? _data[_idx].drugId : "",
                userId: _params.assignedTo[0].userId ? _params.assignedTo[0].userId : "",
                roleId: _params.assignedTo[0].roleId ? _params.assignedTo[0].roleId : "",
                roleName: _params.assignedTo[0].roleName ? _params.assignedTo[0].roleName : "",
                drug_section_id: _data[_idx].section_id ? _data[_idx].section_id : "",
                sectionName: _data[_idx].SECTION_NAME ? _data[_idx].SECTION_NAME : "",
                section_comment: commentMaindata.length > 0 ? commentMaindata : [],
                audit: req.cAudit
            }
            let _insertComment = await _mUtils.commonMonogoCall("monography_comments", "insertMany", _comments, "", "", "", "")
            if (!(_statusflowTracking && _statusflowTracking.success)) {
                //   _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
            }
            _output.push({ success: true, desc: "", data: _insertComment.data || [] });
            _idx = _idx + 1
            await InsertCommentdata(_data, _params, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function updateSectionData(_data, _idx, _output, req, _asnData, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));
            // if (_idx !== 0) {
            //     delete _cBody.params.history;
            // }

            let patData = {
                params: {
                    _id: _cBody[_idx]._id,
                    user_id: _asnData.assignedTo[0].userId,
                    role_id: _asnData.assignedTo[0].roleId,
                    audit: req.body.params.audit
                }
            };

            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], patData);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                // statusData.push({
                //     current_status: _data.params[_idx].current_status ? _data.params[_idx].current_status : "",
                //     next_status: statusResp_next_status ? statusResp_next_status : "",
                //     roleId: _data.params[_idx].assignedTo[0].roleId ? _data.params[_idx].assignedTo[0].roleId : "",
                //     roleName: _data.params[_idx].assignedTo[0].roleName ? _data.params[_idx].assignedTo[0].roleName : "",
                //     userId: _data.params[_idx].assignedTo[0].userId ? _data.params[_idx].assignedTo[0].userId : "",
                //     userName: _data.params[_idx].assignedTo[0].userName ? _data.params[_idx].assignedTo[0].userName : "",
                //     drugId: _data.params[_idx].dId,
                //     drugName: _data.params[_idx].DD_SUBSTANCE_NAME,
                //     audit: _data.params[_idx].audit ? _data.params[_idx].audit : "",
                //     user_assigned_table_id: _data.params[_idx]._id ? _data.params[_idx]._id : "",
                //     drug_mono_id: _data.params[_idx]._id ? _data.params[_idx]._id : ""
                // })
                // let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                // if (!(_statusflowTracking && _statusflowTracking.success)) {
                //     _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                // }
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await updateSectionData(_data, _idx, _output, req, _asnData, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("error", error)
    }
}

async function insertSectionsData(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let _idGenerateData = await _mUtils.commonMonogoCall("monography_idgenerates", "insertMany", {}, "", "", "", "");
            _data[_idx]._id = _idGenerateData.data[0]._id
            _output.push(_data[_idx])
            _idx = _idx + 1
            await insertSectionsData(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function testingFunction(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let _idGenerateData = await _mUtils.commonMonogoCall("monography_idgenerates", "insertMany", {}, "", "", "", "");
           // console.log("_dData", _idGenerateData)
            _data[_idx]._id = _idGenerateData.data[0]._id
            _output.push(_data[_idx])
            _idx = _idx + 1
            await testingFunction(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
        console.log("error", error)
    }
}

async function commonDeleteReferenceData(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            if (_data[_idx].SECTION_NAME != "References" && (_data[_idx].drug_section_id == "6513f63d7bcc4d73a8c91134" || _data[_idx].drug_section_id == "6513f6be7bcc4d73a8c91138" || _data[_idx].drug_section_id == "6513f6e07bcc4d73a8c9113c" || _data[_idx].drug_section_id == "6513f7087bcc4d73a8c91140")) {
                _output.push(_data[_idx])
            }
            _idx = _idx + 1
            await commonDeleteReferenceData(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("error", error)
    }
}

async function parentinteractionUpdate(_data, _idx, _output, req, _asnData, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));

            let patData = {
                params: {
                    _id: _cBody[_idx]._id,
                    STATUS: "PUBLISHED",
                    audit: req.body.params.audit
                }
            };
            if (_asnData.REFERENCES != "" && _asnData.INTERACTIONS == "") {
                patData.params['REFERENCES'] = _asnData.REFERENCES
            } else if (_asnData.REFERENCES != "" && _asnData.INTERACTIONS != "") {
                patData.params['REFERENCES'] = _asnData.REFERENCES
                patData.params['INTERACTIONS'] = _asnData.INTERACTIONS
            }

            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], patData);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                _.each(_mResp.data, (_o, _i) => {
                    _output.push(_o);
                })

            }
            _idx = _idx + 1;
            await parentinteractionUpdate(_data, _idx, _output, req, _asnData, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
      //  console.log("error", error)
    }
}

async function updateMasterChildrenData(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "DRUG_IN_PARENT_ID": _data[_idx].DRUG_IN_PARENT_ID,
                    "SRC_DRUG_CD": _data[_idx].SRC_DRUG_CD
                }
            }
            let _sResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "find", _filter, "", "", "", "");
            if (_sResp.data.length > 0) {
                let _parentinteractionUpdate = await parentinteractionUpdate(_sResp.data, 0, [], req, _data[_idx], "", "monography_drugparentinteraction", "bulkWrite", "BW");
                _.each(_parentinteractionUpdate.data, (_o, _i) => {
                    _output.push(_o)
                })
            }

            let _cResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "");
            if (_cResp.data.length > 0) {
                let _childinteractionUpdate = await parentinteractionUpdate(_cResp.data, 0, [], req, _data[_idx], "", "monography_drugchildinteraction", "bulkWrite", "BW");
                _.each(_childinteractionUpdate.data, (_o, _i) => {
                    _output.push(_o)
                })
            }

            _idx = _idx + 1
            await updateMasterChildrenData(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("error", error)
    }
}

async function updateDrugFlowDataWithSections(_data, _idx, _output, req, _dbType, ...cmf) {
    try {
        if (_data.params.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));
            let statusResp_next_status;
            let _statusResp = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowstatuses", "find", {}, "", "", "", "");
            _statusResp.data = _.orderBy(_statusResp.data, 'drug_Mongrophy_Status_Code', 'asc')
            if (_statusResp && _statusResp.success) {
                let findIndx = _.filter(_statusResp.data, (objects) => { return objects.Drug_Mon_Status === _data.params[_idx].current_status && (objects.roleType === "" || objects.roleType === _data.params[_idx].assignedTo[0].actionOfRole) }, 0)
                statusResp_next_status = findIndx[0].next_status
            }

            _cBody.params = {}
            let statusData = []
            _data.params[_idx].next_status = statusResp_next_status;
            _data.params[_idx]['audit'] = req.body.params.audit;
            _data.params[_idx]["revNo"] = _data.params[_idx].revNo ? _data.params[_idx].revNo + 1 : "";


            _cBody.params = _data.params[_idx];

            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], _cBody);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                let _filter = { "filter": { "recStatus": { $eq: true } } }
                let _sResp;
                // if (_cBody.params.previous_status == "SUBMIT FOR REVIEW" || _cBody.params.previous_status == "REVIEW APPROVED" || _cBody.params.previous_status == "APPROVED") {
                //     if (_cBody.params.section_comment.length > 0) {
                //         let _commentData = await InsertCommentdata(_cBody.params.section_comment, _cBody.params, 0, [], req)
                //         if (!(_commentData && _commentData.success)) {
                //             _output.push({ success: false, desc: _commentData.desc || "", data: [] });
                //         }
                //     }

                // }

                if (_cBody.params.assignedTo[0].actionOfRole === "REVIEWER" || _cBody.params.assignedTo[0].actionOfRole === "EXTERNAL REVIEWER" || _cBody.params.assignedTo[0].actionOfRole === "CONTENT WRITER") {

                    _filter.filter['role_id'] = _cBody.params.previousAssigned[0].roleId;
                    _filter.filter['user_id'] = _cBody.params.previousAssigned[0].userId;
                    _filter.filter['DD_SUBSTANCE_CD'] = _cBody.params.DD_SUBSTANCE_CD;
                    _filter.filter['content_type'] = _cBody.params.content_type
                    _sResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "")
                    if (!(_sResp && _sResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                    }
                    if ((_cBody.params.previousAssigned[0].actionOfRole === "APPROVER" && _cBody.params.current_status === "REVISION OPENED")) {
                        //  || (_cBody.params.previousAssigned[0].actionOfRole === "REVIEWER" && _cBody.params.current_status === "REVISION OPENED")
                        let _uResp = await _mUtils.commonMonogoCall("monography_roles", "findById", _cBody.params.assignedTo[0].roleId, "", "", "", "")
                        let _finalData = []
                        _.each(_uResp.data.sections, (objects, index) => {
                            _.each(_sResp.data, (_secObj, _secIndx) => {
                                if ((objects.hcpId === _secObj.drug_section_id) || (objects.patientId === _secObj.drug_section_id)) {
                                    _finalData.push(_secObj)
                                }
                            })
                            // _finalData= _.find(_sResp.data,(_secObj,_secIndx)=>{return objects.hcpId === _secObj.drug_section_id || objects.patientId === _secObj.drug_section_id });
                            // if(Object.keys(_finalData).length > 0){
                            //    console.log("_finalData",_finalData)
                            // }
                        })

                        _sResp.data = _finalData
                    }
                } else if (_cBody.params.assignedTo[0].actionOfRole === "APPROVER" || _cBody.params.assignedTo[0].actionOfRole === "PUBLISHER") {
                    delete _filter.filter.role_id
                    delete _filter.filter.user_id
                    delete _filter.filter.content_type
                    _filter.filter['DD_SUBSTANCE_CD'] = _cBody.params.DD_SUBSTANCE_CD;
                    _filter.filter['content_type'] = _cBody.params.content_type
                    _sResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "")
                    if (!(_sResp && _sResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                    }

                    if (_cBody.params.assignedTo[0].actionOfRole === "PUBLISHER" && _cBody.params.current_status == "PUBLISHED") {
                        delete _filter.filter.content_type
                        let _dddrugdata = await _mUtils.commonMonogoCall("monography_dd_drug_master", "find", _filter, "", "", "", "")
                        let meddetails = {
                            "params": {
                                "_id": JSON.parse(JSON.stringify(_dddrugdata.data))[0]._id,
                                "IS_ASSIGNED": "PUBLISHED",
                                "revNo": JSON.parse(JSON.stringify(_dddrugdata.data))[0].revNo + 1,
                                "audit": req.body.params.audit
                            }
                        }
                        pLoadResp = { payload: {} };
                        pLoadResp = await _mUtils.preparePayload("BW", meddetails);
                        let _medicinalProductUpdateResp = await _mUtils.commonMonogoCall("monography_dd_drug_master", "bulkWrite", pLoadResp.payload, "", "", "", "")

                    }

                    if (_sResp.data.length > 0 && _cBody.params.content_type == "650a9d0ad9a18e495d89d223" && _cBody.params.assignedTo[0].actionOfRole === "PUBLISHER" && _cBody.params.previousAssigned[0].actionOfRole === "PUBLISHER") {
                        let _finalData = []
                        _.each(_sResp.data, (_obj, _indx) => {
                            if (_obj.interacaction_drug_content.length > 0) {
                                _.each(_obj.interacaction_drug_content, (_interObj, _interIndx) => {
                                    _finalData.push(_interObj)
                                })
                            }

                        })

                        let _updateMasterChildrenData = await updateMasterChildrenData(_finalData, 0, [], req, _filter)
                      //  console.log("_updateMasterChildrenData", _updateMasterChildrenData)

                        //isert and update sections data with monograph start
                        if (_sResp.data.length > 0) {
                            _sResp = await commonDeleteReferenceData(_sResp.data, 0, [], req)
                        }
                        let _finalDataresp = [];
                        _filter.filter['content_type'] = "650a9cc5d9a18e495d89d221"
                        let monoGraphSectionData = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "");
                        if (monoGraphSectionData.data.length > 0) {
                            monoGraphSectionData = await commonDeleteReferenceData(monoGraphSectionData.data, 0, [], req);
                        }

                        //insert unMatched section data start.
                        let groupdata = []
                        let _differentData = []
                        _statusResp.data.every((item1, index) => {
                            const item2 = monoGraphSectionData.data.find(element => element.SECTION_NAME == item1.SECTION_NAME);
                            if (item2) {
                                return groupdata.push(item2);
                            }
                            else {
                                return _differentData.push(item1);
                            }
                        });
                        if (_differentData.length > 0) {
                            let _diffDataSectionInsert = await testingFunction(_differentData, 0, [], req)
                            let _diffData = await _mUtils.commonMonogoCall("monography_sections", "insertMany", _diffDataSectionInsert.data, "", "", "", "");
                        }
                        //insert unMatched section data end.

                        let _monoData = monoGraphSectionData.data.length > 0 ? JSON.parse(JSON.stringify(monoGraphSectionData.data)) : [];
                        let _statusData = _statusResp.data.length > 0 ? JSON.parse(JSON.stringify(_sResp.data)) : [];

                        if (_monoData.length > 0 && _statusData.length > 0) {
                            _.each(_statusData, (_statusObjects, _statusIndx) => {
                                _.each(_monoData, (_monoObjects, _monoStatus) => {
                                    let _arrey = []
                                    if (_statusObjects.SECTION_NAME == _monoObjects.SECTION_NAME) {
                                        _monoObjects.interacaction_drug_content = []
                                        _.each(_statusObjects.interacaction_drug_content, (_intrnObj, _intrIndx) => {
                                            let _interactionObj = {
                                                CREATE_BY: _intrnObj.CREATE_BY,
                                                CREATE_DT: _intrnObj.CREATE_DT,
                                                DRUG_IN_PARENT_ID: _intrnObj.DRUG_IN_PARENT_ID,
                                                ENTITY_NAME: _intrnObj.ENTITY_NAME,
                                                ENTITY_VALUE_NAME: _intrnObj.ENTITY_VALUE_NAME,
                                                INT_ID: _intrnObj.INT_ID,
                                                INT_TYPE_ID: _intrnObj.INT_TYPE_ID,
                                                INTERACTIONS: _intrnObj.INTERACTIONS,
                                                LOC_ID: _intrnObj.LOC_ID,
                                                INTERACTIONS: _intrnObj.INTERACTIONS,
                                                ORG_ID: _intrnObj.ORG_ID,
                                                ROA_NAME: _intrnObj.ROA_NAME,
                                                SEVERITY_ID: _intrnObj.SEVERITY_ID,
                                                SEVERITY_NAME: _intrnObj.SEVERITY_NAME,
                                                SRC_DRUG_CD: _intrnObj.SRC_DRUG_CD,
                                            }
                                            _arrey.push(_interactionObj)
                                        })
                                        _monoObjects.interacaction_drug_content = _arrey
                                    }
                                })
                            })
                            let _uSections = await updateSectionData(_monoData, 0, [], req, "", "", "monography_sections", "bulkWrite", "BW")
                            if (!(_uSections && _uSections.success)) {
                                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                            }
                        } else {
                            let _hgh = _.each(_sResp.data, async (_statusObjects, _statusIndx) => {
                                //  if(_statusObjects.SECTION_NAME !="References"){
                                _statusObjects['content_type'] = "650a9cc5d9a18e495d89d221"
                                _finalDataresp.push(_statusObjects)
                                // }
                            })
                            let jhdfdh = await testingFunction(_finalDataresp, 0, [], req)
                            let _dData = await _mUtils.commonMonogoCall("monography_sections", "insertMany", jhdfdh.data, "", "", "", "");

                        }


                        //isert and update sections data with monograph end


                        ////insert interactionData  start.
                        // _filter.filter['content_type'] = "650a9cc5d9a18e495d89d221"
                        // let _getDataSectionAgnstFilter = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "")
                        // if (_getDataSectionAgnstFilter.data.length > 0) {

                        // } else {
                        //     let _finalDataInsertData = []
                        //     let _hgh = _.each(_sResp.data, async (_statusObjects, _statusIndx) => {
                        //         if (_statusObjects.SECTION_NAME != "References") {
                        //             _statusObjects['content_type'] = "650a9cc5d9a18e495d89d221"
                        //             _finalDataInsertData.push(_statusObjects)
                        //         }
                        //     })

                        //     let _insertSections = await insertSectionsData(_finalDataInsertData, 0, [], req)
                        //     let _dData = await _mUtils.commonMonogoCall("monography_sections", "insertMany", _insertSections.data, "", "", "", "");
                        //     if (!(_dData && _dData.success)) {
                        //         // return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                        //     }
                        // }

                        ////insert interactionData end.

                        //////////////////////////////sending data to sql


                        // let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
                        // let params = {
                        //     "TYPE": "DD_DRUG_MASTER",
                        //     "FLAG": "published",
                        //     "VAL1": _cBody.params.DD_SUBSTANCE_CD,
                        //     "JSON": _finalData
                        //     // "STATUS": req.body.params.status ? req.body.params.status : "",
                        //     // "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
                        //     // "ID": req.body.params.id ? req.body.params.id : ""
                        // }
                        // let _responseData;
                        // let axiosData = await axios1.post(url, params).then((response) => {
                        //     _responseData = response
                        //     //  return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
                        // }).catch((err) => {
                        //     console.log("err", err)
                        // })

                    }

                }

                let _rParams = _cBody.params
                let _uSections = await updateSectionData(_sResp.data, 0, [], req, _rParams, "", "monography_sections", "findOneAndUpdate", "U")
                if (!(_uSections && _uSections.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
                }


                //get drugFlow data with _id
                let _getId = _mResp.data._id;
                let _dData = await _mUtils.commonMonogoCall("monography_drugworkflow", "findById", _getId, "", "", "", "")
                statusData.push({
                    current_status: _dData.data.current_status ? _dData.data.current_status : "",
                    next_status: _dData.data.next_status ? _dData.data.next_status : "",
                    previous_status: _dData.data.previous_status ? _dData.data.previous_status : "",
                    roleId: _dData.data.assignedTo[0].roleId ? _dData.data.assignedTo[0].roleId : "",
                    roleName: _dData.data.assignedTo[0].roleName ? _dData.data.assignedTo[0].roleName : "",
                    userId: _dData.data.assignedTo[0].userId ? _dData.data.assignedTo[0].userId : "",
                    userName: _dData.data.assignedTo[0].userName ? _dData.data.assignedTo[0].userName : "",
                    previousRoleId: _dData.data.previousAssigned[0].roleId ? _dData.data.previousAssigned[0].roleId : "",
                    previousRoleName: _dData.data.previousAssigned[0].roleName ? _dData.data.previousAssigned[0].roleName : "",
                    previousUserId: _dData.data.previousAssigned[0].userId ? _dData.data.previousAssigned[0].userId : "",
                    previousUserName: _dData.data.previousAssigned[0].userName ? _dData.data.previousAssigned[0].userName : "",
                    operation_type: _dData.data.operation_type ? _dData.data.operation_type : "",
                    drugId: _dData.data.dId,
                    content_type: _dData.data.content_type ? _dData.data.content_type : "",
                    DD_SUBSTANCE_NAME: _dData.data.DD_SUBSTANCE_NAME,
                    DD_SUBSTANCE_CD: _dData.data.DD_SUBSTANCE_CD,
                    audit: req.cAudit,
                    drug_mono_id: _dData.data._id
                })

                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", statusData, "", "", "", "")
                if (!(_statusflowTracking && _statusflowTracking.success)) {
                    _output.push({ success: false, desc: _statusflowTracking.desc || "", data: [] });
                }
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await updateDrugFlowDataWithSections(_data, _idx, _output, req, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
        console.log("error", error)
    }
}

router.post("/update-drugFlow-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _updateResp = await updateDrugFlowDataWithSections(_cBody, 0, [], req, "", 'monography_drugworkflow', 'bulkWrite', 'BW');
        return res.status(200).json({ success: true, status: 200, desc: '', data: _updateResp.data });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Common Axios call */
async function commonAxiosCall(type, url, params, config) {
    return new Promise((resolve, reject) => {
        try {
            if (type == "POST") {
                axios.post(url, params).then(function (res) {
                    resolve({ success: true, data: res.data || [] });
                }).catch(function (err) {
                    resolve({ success: false, data: [], desc: err });
                });
            }
            else if (type == "GET") {
                axios.get(url).then(function (res) {
                    resolve({ success: true, data: res.data || [] });
                }).catch(function (err) {
                    resolve({ success: false, data: [], desc: err });
                });
            }
        }
        catch (ex) {
            resolve({ success: false, data: [], desc: ex.message || ex });
        }
    });
};

router.post("/get-drugFlow-data", async (req, res) => {
    try {

        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "content_type": req.body.params.content_type,
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
            }
        }

        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_drugworkflow", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
     //   console.log("error", error)
    }
})

router.post("/get-history-drugFlow-data", async (req, res) => {
    try {

        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
                "content_type": req.body.params.content_type
            }
        }

        //    let _pGData = await prepareGetPayload(_filter, req.body.params);
        //    if (!_pGData.success) {
        //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        //    }
        mongoMapper("monography_drugmonographyworkflowtracking", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {

    }
})

//update drugFlow Data functions end.

//convert excel to json data
router.post("/convertToExcel", (req, res) => {
    try {

    } catch (error) {

    }
})

/*Buk Insert Entity */
router.post("/bulk-insert-drug-details", async (req, res) => {
    try {
        let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
        let resonseData = []
        let params = {
            "TYPE": "DD_DRDFMUG_MASTER",
            "FLAG": "DD_DRUG"
        }

        await axios1.post(url, params).then((response) => {
            resonseData = response.data
        }).catch((err) => {
           // console.log("err", err)
        })

        let _drugData = []
        _.each(resonseData, (o, i) => {
            _drugData.push({
                "documentTitle": o.DD_SUBSTANCE_NAME,
                "Cd": o.DD_SUBSTANCE_CD,
                "medicinalCode": o.DD_DRUG_MASTER_CD,
                "template": getTemplateData.data,
                "audit": req.body.params.audit,
                "assignedTo": [
                    {
                        "roleId": "642ed10515dc6eeb77d902f2",
                        "levelId": "642eb96f5a774ad6f7d22e6f",
                        "userId": "642fe4f4a8c7d34e77b33c3a"
                    }
                ]

            })
        })


        req.body.params = _drugData
        mongoMapper('monography_drugcreation', "insertMany", req.body.params).then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
            }
            let _filter = {
                "filter": {
                    "recStatus": true
                },
                "selectors": "-audit -history"
            }
            let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
            if (!(_rResp && _rResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
            }

            let _assignedTo = [];
            let _idx = 0
            _.each(req.body.params, (_p, _i) => {
                _.each(_p.assignedTo, (_o) => {
                    let _fRole = _.filter(_rResp.data, (_r) => { return _r._id.toString() == _o.roleId });
                    if (_fRole && _fRole.length > 0) {
                        let _sections = [];
                        _.each(_fRole[0].sections, (_s) => {
                            _sections.push({
                                hcpId: _s.hcpId || null,
                                patientId: _s.patientId || null
                            });
                        });
                        _assignedTo.push({
                            dId: result.data[_idx]._id,
                            DD_SUBSTANCE_NAME: result.data[_idx].documentTitle,
                            assignedTo: _o,
                            sections: _sections
                        });
                        _idx = _idx + 1
                    }
                });
            });
            let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "insertMany", _assignedTo, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all Employee */
// router.post("/get-user-drug-details", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": {
//                 "assignedTo.userId": req.body.params.userId
//             },
//             "limit":req.body.params.limit,
//             "selectors": "-history"    
//         }       

//         // let _pGData = await prepareGetPayload(_filter, req.body.params);
//         // if (!_pGData.success) {
//         //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//         // }
//         mongoMapper("monography_userAssign", "find", _filter, "").then(async (result) => {
//             if (!(result && result.data && result.data.length > 0)) {
//                 return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
//             }
//             let _mapData = _.chain(result.data).groupBy('status')
//                 .map((_d, _k) => {
//                     return {
//                         "status": _k,
//                         "list": _d
//                     }
//                 }).value();
//             return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });


router.post("/get-user-drug-details", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                recStatus: { $eq: true }
            },
            "limit": req.body.params.limit,
            "selectors": "-history"
        }
        let _method = "";
        let _drugsList = [];
        if (req.body.params.flag === "cStatus") {
            _filter.filter['assignedTo.userId'] = req.body.params.userId;
            _filter.filter['assignedTo.roleId'] = req.body.params.roleId;
            _filter.filter['current_status'] = req.body.params.current_status;
            _filter.filter['content_type'] = req.body.params.content_type
            _method = "monography_drugworkflow"
        } else if (req.body.params.flag === "pStatus") {
            _filter['filter'] = {}
            _filter.filter['previousUserId'] = req.body.params.userId
            _filter.filter['previousRoleId'] = req.body.params.roleId
            _filter.filter['previous_status'] = req.body.params.previous_status;
            _filter.filter['content_type'] = req.body.params.content_type
            _method = "monography_drugmonographyworkflowtracking"
        }

        mongoMapper(_method, "find", _filter, "").then(async (result) => {
            if (!(result && result.data && result.data.length > 0)) {
                return res.status(400).json({ success: false, status: 400, desc: `no data found`, data: [] });
            }
            if (req.body.params.flag === "cStatus") {
                let _sessionInsertRes;
                let session_id;
                if (result.data && result.data.length > 0) {
                    let _filter = {
                        "filter": { recStatus: true },
                        "selectors": "-audit -history"
                    }
                    let _sessionRes = await _mUtils.commonMonogoCall("monography_userSession", "find", _filter, "", "", "", "")
                    //   let num = _sessionRes.data[0].session_id
                    let params = {};
                    if (_sessionRes.data.length == 0) {
                        session_id = 1
                    } else {
                        let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
                        let _cal = _descData[0].session_id + 1;
                        session_id = _cal
                    }
                    params = {
                        "userId": req.body.params.userId,
                        "roleId": req.body.params.roleId,
                        "user_revNo": result.data[0].revNo,
                        "machine": req.body.params.machine ? req.body.params.machine : "",
                        "version": req.body.params.version ? req.body.params.version : "",
                        "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
                        "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
                        "session_id": session_id,
                        "browser": req.body.params.browser ? req.body.params.browser : "",
                        "audit": {
                            "documentedBy": result.data[0].displayName,
                            "documentedById": result.data[0]._id
                        }
                    }
                    _sessionInsertRes = await _mUtils.commonMonogoCall("monography_userSession", "insertMany", params, "", "", "", "")
                    if (!(_sessionInsertRes && _sessionInsertRes.success)) {
                        console.log("Error Occured while updating appointment details to Patient");
                    }

                }

                let _drugsList = [];
                let _mapData = _.chain(result.data).groupBy('status')
                    .map((_d, _k) => {
                        // console.log("dId", _.chain(_d).groupBy('dId').value());
                        let _drugs = _.groupBy(_d, "dId");
                        _.map(_drugs, (_o, _i) => {
                            if (_o && _o.length > 0) {
                                _drugsList.push(_o[0]);
                            }
                        });
                        return {
                            "status": _k,
                            "session_id": _sessionInsertRes.data[0].session_id,
                            "list": _drugsList
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
            } else if (req.body.params.flag === "pStatus") {
                let _getFinalTrackData = []
                let _mapData1 = _.chain(result.data).groupBy('status')
                    .map((_obj, _ind) => {
                        _.map(_obj, (_o, _i) => {
                            _getFinalTrackData.push({
                                dId: _o._id,
                                DD_SUBSTANCE_CD: _o.DD_SUBSTANCE_CD,
                                DD_SUBSTANCE_NAME: _o.DD_SUBSTANCE_NAME,
                                PARENT_DRUG_CD: _o.PARENT_DRUG_CD ? _o.PARENT_DRUG_CD : "",
                                assignedTo: [
                                    {
                                        roleId: _o.previousRoleId ? _o.previousRoleId : "",
                                        roleName: _o.previousRoleName ? _o.previousRoleName : "",
                                        sequence: _o.sequence ? _o.sequence : "",
                                        actionOfRole: _o.actionOfRole ? _o.actionOfRole : "",
                                        levelId: _o.levelId ? _o.levelId : "",
                                        levelName: _o.levelName ? _o.levelName : "",
                                        userId: _o.previousUserId ? _o.previousUserId : "",
                                        userName: _o.previousUserName ? _o.previousUserName : ""
                                        // roleId: _o.roleId ? _o.roleId  :"",
                                        // roleName:_o.roleName ? _o.roleName  :"",
                                        // sequence:_o.sequence ? _o.sequence  :"",
                                        // actionOfRole:_o.actionOfRole ? _o.actionOfRole  :"",
                                        // levelId:_o.levelId ? _o.levelId  :"" ,
                                        // levelName:_o.levelName ? _o.levelName  :"" ,
                                        // userId: _o.userId ? _o.userId  :"",
                                        // userName: _o.userName ? _o.userName  :""
                                    }
                                ],
                                previousAssigned: [
                                    {
                                        roleId: _o.roleId ? _o.roleId : "",
                                        roleName: _o.roleName ? _o.roleName : "",
                                        sequence: _o.sequence ? _o.sequence : "",
                                        actionOfRole: _o.actionOfRole ? _o.actionOfRole : "",
                                        levelId: _o.levelId ? _o.levelId : "",
                                        levelName: _o.levelName ? _o.levelName : "",
                                        userId: _o.userId ? _o.userId : "",
                                        userName: _o.userName ? _o.userName : ""
                                        // roleId: _o.previousRoleId ? _o.previousRoleId  :"",
                                        // roleName:_o.previousRoleName ? _o.previousRoleName  :"",
                                        // sequence:_o.sequence ? _o.sequence  :"",
                                        // actionOfRole:_o.actionOfRole ? _o.actionOfRole  :"",
                                        // levelId:_o.levelId ? _o.levelId  :"" ,
                                        // levelName:_o.levelName ? _o.levelName  :"" ,
                                        // userId: _o.previousUserId ? _o.previousUserId  :"",
                                        // userName: _o.previousUserName ? _o.previousUserName  :""
                                    }
                                ],
                                assignedDt: new Date().toISOString(),
                                current_status: _o.previous_status,
                                next_status: _o.next_status,
                                audit: _o.audit
                            })
                        })
                        return {
                            "status": _ind,
                            "list": _getFinalTrackData
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData1 || [] });

            }
        })

        // let _filter = {
        //     "filter": {
        //         "assignedTo.userId": req.body.params.userId,
        //         "assignedTo.roleId": req.body.params.roleId,
        //         "current_status": req.body.params.current_status
        //     },
        //     "limit": req.body.params.limit,
        //     "selectors": "-history"
        // }

        // // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // // if (!_pGData.success) {
        // //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // // }

        // let _sessionInsertRes;
        // let session_id;
        // mongoMapper(_method, "find", _filter, "").then(async (result) => {
        //     if (!(result && result.data && result.data.length > 0)) {
        //         return res.status(400).json({ success: false, status: 400, desc: `Error occurred while insert Employee`, data: [] });
        //     }

        //     if (result.data && result.data.length > 0) {
        //         let _filter = {
        //             "filter": { recStatus: true },
        //             "selectors": "-audit -history"
        //         }
        //         let _sessionRes = await _mUtils.commonMonogoCall("monography_userSession", "find", _filter, "", "", "", "")
        //         //   let num = _sessionRes.data[0].session_id
        //         let params = {};
        //         if (_sessionRes.data.length == 0) {
        //             session_id = 1
        //         } else {
        //             let _descData = _.orderBy(_sessionRes.data, ['session_id'], ['desc'])
        //             let _cal = _descData[0].session_id + 1;
        //             session_id = _cal
        //         }
        //         params = {
        //             "userId": req.body.params.userId,
        //             "roleId": req.body.params.roleId,
        //             "user_revNo": result.data[0].revNo,
        //             "machine": req.body.params.machine ? req.body.params.machine : "",
        //             "version": req.body.params.version ? req.body.params.version : "",
        //             "timeZoneId": req.body.params.timeZoneId ? req.body.params.timeZoneId : "",
        //             "browserVersion": req.body.params.browserVersion ? req.body.params.browserVersion : "",
        //             "session_id": session_id,
        //             "browser": req.body.params.browser ? req.body.params.browser : "",
        //             "audit": {
        //                 "documentedBy": result.data[0].displayName,
        //                 "documentedById": result.data[0]._id
        //             }
        //         }
        //         _sessionInsertRes = await _mUtils.commonMonogoCall("monography_userSession", "insertMany", params, "", "", "", "")
        //         if (!(_sessionInsertRes && _sessionInsertRes.success)) {
        //             console.log("Error Occured while updating appointment details to Patient");
        //         }

        //     }



        //     let _drugsList = [];
        //     let _mapData = _.chain(result.data).groupBy('status')
        //         .map((_d, _k) => {
        //             // console.log("dId", _.chain(_d).groupBy('dId').value());
        //             let _drugs = _.groupBy(_d, "dId");
        //             _.map(_drugs, (_o, _i) => {
        //                 if (_o && _o.length > 0) {
        //                     _drugsList.push(_o[0]);
        //                 }
        //             });
        //             return {
        //                 "status": _k,
        //                 "session_id": _sessionInsertRes.data[0].session_id,
        //                 "list": _drugsList
        //             }
        //         }).value();
        //     return res.status(200).json({ success: true, status: 200, desc: '', data: _mapData || [] });
        // }).catch((error) => {
        //    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        //  });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/get-search-drug-details", (req, res) => {
    try {
        if (req.body && req.body.params && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
            let _filter = { "filter": { recStatus: { $eq: true } } };
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
            _filter.filter["DD_SUBSTANCE_NAME"] = nameExp
            mongoMapper("monography_userAssign", req.body.query, _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });

        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
     //   console.log("error", error)
    }
})


// async function drugDataRoleWithSections(_data, _flag, _idx, _output, req) {
//     try {

//         if (_flag='SECTIONS'){
//         if (_data.length > _idx) {
//             let _filter = {
//                 "filter": {
//                     "recStatus": { $eq: true },
//                     "role_id": _data[_idx].assignedTo[_idx].roleId
//                 }
//             }
//             let _mRespDataUserRole = await _mUtils.commonMonogoCall(`monography_sections`, "find", _filter, "", "", "", "")
//             if (!(_mRespDataUserRole && _mRespDataUserRole.success)) {
//                 // return res.status(400).json({ success: false, status: 400, desc: _mRespDataUserRole.desc || "", data: _mRespDataUserRole.data || [] });
//             } else {
//                 _data[_idx]['role_section_id'] = _mRespDataUserRole.data[0]._id ? _mRespDataUserRole.data[0]._id : "";
//                 _data[_idx]['role_section_hcp_id'] = _mRespDataUserRole.data[0].drug_section_id ? _mRespDataUserRole.data[0].drug_section_id : "";
//                  _output.push(_data[_idx])
//             }


//             _idx = _idx + 1
//             await drugDataRoleWithSections(_data, _idx, _output, req)
//         } else {
//             return { success: true, data: _output }
//         }
//         let _final = _.filter(_output, (_r) => { return !_r.success });
//         return {
//             "success": _final.length > 0 ? false : true,
//             "data": _output
//         }
//         }
//     } catch (error) {

//     }
// }

router.post("/get-total-drugData-with-allUsers", async (req, res) => {
    try {
        let indx = 0
        let _finaldata = []
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
                "content_type": req.body.params.content_type
            },
            "selectors": "-history"
        }

        mongoMapper("monography_userAssign", "find", _filter, req.tokenData.dbType).then(async (result) => {
            _filter = {}

            while (result.data.length > indx) {

                _filter = {
                    "filter": {
                        "isActive": { $eq: true },
                        "_id": result.data[indx].assignedTo[0].roleId
                        // "content_type":req.body.params.content_type
                    },
                    "selectors": {
                        "_id": "$_id",
                        "label": "$label",
                        "isActive": "$isActive",
                        "revNo": "$revNo",
                        "content_type": "$content_type",
                        "sequence": "$sequence",
                        "actionOfRole": "$actionOfRole",
                        "sections": {
                            $filter: {
                                input: "$sections",
                                cond: {
                                    $eq: ["$$this.recStatus", true]
                                }
                            }
                        },
                        "audit": "$audit",
                        "level": "$level",
                    }
                }
                let _mResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
                result.data[indx].sections = []
                result.data[indx].sections = _mResp.data[0].sections
                _finaldata.push(result.data[indx])
                // console.log(_finaldata.data)
                // console.log(_mResp)
                indx++
            }

            return res.status(200).json({ success: true, status: 200, desc: '', data: _finaldata });
            // let _drugDataRoleWithSections =    drugDataRoleWithSections(JSON.parse(JSON.stringify(result.data)),'SECTIONS', 0, [], req);
            // return res.status(200).json({ success: true, status: 200, desc: '', data: _drugDataRoleWithSections.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

// Get Drug Detail
router.post("/get-drug-detail", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "isActive": { $eq: true },
                "DD_SUBSTANCE_CD": req.body.params.dd_substance_code,
                "content_type": req.body.params.content_type
            },
            "selectors": "-history"
        }
        mongoMapper("monography_dd_drug_masters", "find", _filter, '').then((result) => {

        })
    }
    catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }

})

/**Update DrugDetails */
router.post("/update-drug-details", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {

            let dataJson = _cBody.params.template.patient;
            let hcpData = _cBody.params.template.hcp
            // [
            //     {
            //       "_id":"642ea9b76b3fd6884b63e335",
            //       "data":  `<p>
            //       <style type="text/css"></style><span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}"><strong>If you want more information about Atorvastatin:&nbsp;</strong></span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Talk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}"><strong>General information about Atorvastatin:&nbsp;</strong></span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Medicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets.&nbsp;</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Do not use Atorvastatin for a condition for which it was not prescribed.&nbsp;</span></span>
            //       <br>
            //       <span style="font-family:Calibri,Arial;font-size:11pt;"><span style="font-style:normal;font-weight:normal;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;If you want more information about Atorvastatin:  \nTalk to your healthcare professional. Find the full product monograph that is prepared for healthcare professionals and includes this Patient Information section.\nGeneral information about Atorvastatin: \r\nMedicines are sometimes prescribed for conditions that are not mentioned in patient information leaflets. \r\nDo not use Atorvastatin for a condition for which it was not prescribed. \r\nDo not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.\r\n&quot;}" data-sheets-userformat="{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}" data-sheets-textstyleruns="{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:51}{&quot;1&quot;:214,&quot;2&quot;:{&quot;5&quot;:1}}{&quot;1&quot;:254}">Do not give atorvastatin calcium tablets to other people, even if they have the same problem you have. It may harm them.&nbsp;</span></span>
            //       <br>
            //       &nbsp;
            //   </p>`
            //      }
            //     ]

            // let _data = `[
            // 	{
            // 		"_id":"642ea9b76b3fd6884b63e335",
            // 		"data":'<p>\n<style type=\"text/css\">
            // 		</style>
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\">
            // 		<span style=\"font-style:normal;font-weight:normal;\" 
            // 		data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">
            // 		<strong>What is the medication used for?&nbsp;</strong>
            // 		</span></span>\n                        
            // 		<br>\n                       
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\">
            // 		<span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine has been prescribed to you for;&nbsp;
            // 		</span></span>\n       
            // 		<br>\n                       
            // 		<span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">The treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine can be used by itself or with other medicines to treat these conditions.&nbsp;</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\"><strong>What it does?&nbsp;</strong></span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">Amlodipine is a type of medicine known as a calcium channel blocker (CCB).&nbsp;</span></span>\n                        <br>\n                        <span style=\"font-family:Calibri,Arial;font-size:11pt;\"><span style=\"font-style:normal;font-weight:normal;\" data-sheets-value=\"{&quot;1&quot;:2,&quot;2&quot;:&quot;What is the medication used for? \nAmlodipine has been prescribed to you for; \nThe treatment of high blood pressure (hypertension), or management of a type of chest pain called angina.\nAmlodipine can be used by itself or with other medicines to treat these conditions. \nWhat it does? \nAmlodipine is a type of medicine known as a calcium channel blocker (CCB). \nIt relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.\n&quot;}\" data-sheets-userformat=\"{&quot;2&quot;:13185,&quot;3&quot;:{&quot;1&quot;:0},&quot;10&quot;:0,&quot;11&quot;:4,&quot;12&quot;:0,&quot;15&quot;:&quot;Calibri&quot;,&quot;16&quot;:11}\" data-sheets-textstyleruns=\"{&quot;1&quot;:0,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:33}?{&quot;1&quot;:269,&quot;2&quot;:{&quot;5&quot;:1}}?{&quot;1&quot;:283}\">It relaxes your blood vessels, which lets your blood flow more easily and helps lower your blood pressure and controls chest pain by improving the supply of blood and oxygen to the heart and by reducing its workload.</span></span>\n                        <br>\n                        &nbsp;\n                    </p>'
            //     }
            // ]
            //     `

            let pLoadResp = { payload: {} };
            if (_cBody.params.template['patient']) {
                _cBody.params.template['patient'] = dataJson
            } else if (_cBody.params.template['hcp']) {
                _cBody.params.template['hcp'] = hcpData
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_drugcreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_drugcreation', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }

            }
            mongoMapper('monography_drugcreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* get all drugCreation */
router.post("/get-drugData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_drugcreation", "find", _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/* get all drugCreation */
router.post("/get-drug-list", async (req, res) => {
    try {
        let url = "http://172.30.29.107:9001/pharmacyv1/api/getMasterData"
        let resonseData = []
        let params = {
            "TYPE": "DD_DRUG_MASTER",
            "FLAG": "DD_DRUG"
        }

        await axios1.post(url, params).then((response) => {
            resonseData = response.data
        }).catch((err) => {
           // console.log("err", err)
        })
        res.status(200).json({ success: true, status: 200, desc: '', data: resonseData });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/update-drugCreation", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_drugCreation", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.orgKey)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            let _hResp = await _mUtils.insertHistoryData('monography_drugCreation', _mResp.data.params, _cBody.params, req, "monography");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                // if (_cBody.params.locations) {
                //     _.each(_cBody.params.locations, (_l) => {
                //         if (_l._id) {
                //             _l.audit = JSON.parse(JSON.stringify((_cBody.params.audit)));
                //         }
                //         else {
                //             _l.audit = JSON.parse(JSON.stringify((req.cAudit)));
                //         }
                //     });
                // }
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                pLoadResp.payload.query.$push["history"] = {
                    "revNo": _hResp.data[0].revNo,
                    "revTranId": _hResp.data[0]._id
                }

            }
            mongoMapper('monography_drugCreation', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert-userAssign Data */
router.post("/insert-userAssign", async (req, res) => {
    try {
        mongoMapper('monography_userAssign', req.body.query, req.body.params).then(async (result) => {
            let _filter = {
                "filter": { "_id": result.data[0].assignedTo[0].roleId },
                "selectors": "-audit -history"
            }

            let _mResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", req.body.params.dbType)
            if (!_mResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc, data: [] });
            } else {

            }
            //  return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*get all userAssign */
router.post("/get-userAssignData", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_userAssign", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*inserHistory*/
router.post("/insert-history", async (req, res) => {
    try {
        // req.body.params["orgId"] = req.tokenData.orgId;
        // req.body.params["locId"] = req.tokenData.locId;
        mongoMapper('insertiHstoryData', req.body.query, req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/*insert coremasterData */
router.post("/insert-coreMasterData", async (req, res) => {
    try {
        mongoMapper('monography_coreMasters', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*get coreMasterData */
router.post("/get-coreData", async (req, res) => {
    try {
        let _filter = {
            "filter": { recStatus: true },
            "selectors": ""
        }
        mongoMapper("monography_coreMasters", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert histroryData */
router.post("/insert-history", async (req, res) => {
    try {
        // req.body.params["orgId"] = req.tokenData.orgId;
        req.body.params["locId"] = req.tokenData.locId;
        mongoMapper('insertiHstoryData', req.body.query, req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

async function emptyTempalteData(keys, values) {
    if (keys === "hcp" || keys === "patient") {
        _.each(values, (_obj, _ind) => {
            if (_obj.children.length > 0) {
                _.each(_obj.children, (_cObj, _cInd) => {
                    if (_cObj.children.length > 0) {
                        _.each(_cObj.children, (_c1Obj, _c1Ind) => {
                            _c1Obj.data = ""
                        })
                    }
                    _cObj.data = ""
                })
            }
            _obj.data = ""
        })
    }
}


router.post("/get-template", async (req, res) => {
    try {
        _.each(getTemplateData.data, async (_val, _key) => {
            let templateEmptyData = await emptyTempalteData(_key, _val)
        })
        return res.status(200).send(getTemplateData);
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
})


/**get data from sql server with limit records from sql server*/
// router.post("/get-db-data", async (req, res) => {
//     try {
//         let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
//         let params = {
//             "TYPE": "DD_DRUG_MASTER",
//             "STATUS": req.body.params.status ? req.body.params.status : "",
//             "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
//             "ID": req.body.params.id ? req.body.params.id : ""
//         }
//         if (req.body.params.flag === "DRUG_INTERACTIONS") {
//             params['FLAG'] = req.body.params.flag
//         } else if (req.body.params.flag === "DD_DRUG") {
//             params['FLAG'] = req.body.params.flag
//         }

//         let arrey1 = []
//         axios1.post(url, params).then((response) => {
//             // _.each(response.data,(obj,indx)=>{
//             //     let arrey=[]
//             //     arrey1=[]
//             //     arrey.push(obj)
//             //     _.each(response.data,(o,i)=>{
//             //          if(o.DD_DRUG_MASTER_CD ===arrey[0].PARENT_DRUG_CD){
//             //             arrey1.push(o)
//             //          }
//             //     })
//             //     obj['children']=arrey1
//             // })

//             //  let parentData = _.filter(response.data,(obj,indx)=>{ return obj.PARENT_DRUG_CD !==null })
//             //  console.log("parentData",parentData)
//             //  _.each(parentData,(obj,indx)=>{
//             //      _.each(response.data,(obj1,indx1)=>{
//             //         if(obj1.DD_DRUG_MASTER_CD=== obj.PARENT_DRUG_CD){
//             //             arrey.push(obj)
//             //             obj1['children']=arrey
//             //         }
//             //      })
//             //  })
//             //  console.log("response",response.data)
//             // let filterData = response.data.slice(0, 10)
//             if (response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
//                 let filterData = JSON.parse(response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]).slice(0, 10)
//                 return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
//             }

//         }).catch((err) => {
//             console.log("err", err)
//         })
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });


// router.post("/get-db-data", async (req, res) => {
//     try {
//         let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
//         let params = {
//             "TYPE": "DD_DRUG_MASTER",
//             "FLAG":"DD_DRUG",
//             "STATUS": req.body.params.status ? req.body.params.status : "",
//             "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
//             "ID": req.body.params.id ? req.body.params.id : ""
//         }
//         // if (req.body.params.flag === "DRUG_INTERACTIONS") {
//         //     params['FLAG'] = req.body.params.flag
//         // } else if (req.body.params.flag === "DD_DRUG") {
//         //     params['FLAG'] = req.body.params.flag
//         // }

//         let arrey1 = []
//         axios1.post(url, params).then((response) => {
//             // _.each(response.data,(obj,indx)=>{
//             //     let arrey=[]
//             //     arrey1=[]
//             //     arrey.push(obj)
//             //     _.each(response.data,(o,i)=>{
//             //          if(o.DD_DRUG_MASTER_CD ===arrey[0].PARENT_DRUG_CD){
//             //             arrey1.push(o)
//             //          }
//             //     })
//             //     obj['children']=arrey1
//             // })

//             //  let parentData = _.filter(response.data,(obj,indx)=>{ return obj.PARENT_DRUG_CD !==null })
//             //  console.log("parentData",parentData)
//             //  _.each(parentData,(obj,indx)=>{
//             //      _.each(response.data,(obj1,indx1)=>{
//             //         if(obj1.DD_DRUG_MASTER_CD=== obj.PARENT_DRUG_CD){
//             //             arrey.push(obj)
//             //             obj1['children']=arrey
//             //         }
//             //      })
//             //  })
//             //  console.log("response",response.data)
//             // let filterData = response.data.slice(0, 10)
//             if (response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
//                 let filterData = JSON.parse(response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]).slice(0, 10)
//                 return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
//             }

//         }).catch((err) => {
//             console.log("err", err)
//         })
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });

async function updateMedicinalProductAndInteraction(_data, _idx, _output, req, _asnData, _dbType, ...cmf) {
    try {
        if (_data.length > _idx) {
            let _cBody = JSON.parse(JSON.stringify(_data));

            let patData = {
                params: {
                    _id: _cBody[_idx]._id,
                    audit: req.body.params.audit
                }
            };

            if (req.body.params.flag == "DD_DRUG") {
                patData.params['IS_ASSIGNED'] = "ASSIGNED"
            } else if (req.body.params.flag == "DRUG_INTERACTIONS") {
                patData.params['STATUS'] = "ACCEPTED"
            }
            let pLoadResp = { payload: {} };
            pLoadResp = await _mUtils.preparePayload(cmf[2], patData);
            let _mResp = await _mUtils.commonMonogoCall(cmf[0], cmf[1], pLoadResp.payload, "", "", "", _dbType)
            if (!(_mResp && _mResp.success)) {
                _output.push({ success: false, desc: _mResp.desc || "", data: [] });
            }
            else {
                _output.push({ success: true, desc: "", data: _mResp.data || [] });
            }
            _idx = _idx + 1;
            await updateMedicinalProductAndInteraction(_data, _idx, _output, req, _asnData, _dbType, ...cmf);
        }
        else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
      //  console.log("error", error)
    }
}

async function updateMedicinalProduct(_data, _indx, _output, req, _collName, filterKey) {
    try {
        if (_data.length > _indx) {
            let _filter = {
                filter: {
                    'recStatus': { $eq: true }
                }
            }
            _filter.filter[`${filterKey}`] = _data[_indx];
            let _mResp = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            } else {
                let _updateAllRecords = await updateMedicinalProductAndInteraction(_mResp.data, 0, [], req, "", "", `monography_${_collName}`, "bulkWrite", "BW")
               // console.log("sfgfhufg", _updateAllRecords)
                _.each(_updateAllRecords.data, (_obj, _in) => {
                    _output.push(_obj)
                })

            }
            _indx = _indx + 1;
            await updateMedicinalProduct(_data, _indx, _output, req, _collName, filterKey);
        }
        else {
            return { data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};
/**get data from sql server with limit records  from mongodb */
router.post("/get-db-data", async (req, res) => {
    try {
        if (req.body.params.val1 != "") {
            let _collName = "";
            let _filterKey = ""
            if (req.body.params.flag === "DRUG_INTERACTIONS") {
                _collName = "drugparentinteraction"
                _filterKey = "SRC_DRUG_CD"
                let _updateMedicinalProduct = await updateMedicinalProduct(req.body.params.val1.split(","), 0, [], req, _collName, _filterKey);
                return res.status(200).json({ success: true, status: 200, data: _updateMedicinalProduct.data, desc: "" });
            } else if (req.body.params.flag === "DD_DRUG") {
                _collName = "dd_drug_master"
                _filterKey = "DD_SUBSTANCE_CD"
                let _updateMedicinalProduct = await updateMedicinalProduct(req.body.params.val1.split(","), 0, [], req, _collName, _filterKey);
                return res.status(200).json({ success: true, status: 200, data: _updateMedicinalProduct.data, desc: "" });
            }
        } else {
            return res.status(400).json({ success: false, status: 400, data: [], desc: "Provide Valid Details" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

async function getRoleParticularData(_flag, _params) {
    new Promise(async (resolve, reject) => {
        let _filter = {
            "filter": {
                "recStatus": true
            },
            "selectors": {
                "_id": "$_id",
                "label": "$label",
                "isActive": "$isActive",
                "content_type": "$content_type",
                "revNo": "$revNo",
                "sections": {
                    $filter: {
                        input: "$sections",
                        cond: {
                            $eq: ["$$this.recStatus", true]
                        }
                    }
                },
                "audit": "$audit",
                "level": "$level",
            }
        }
        if (_flag === 'G') {
            _filter.filter['_id'] = _params.assignedTo[0].roleId;
        }

        mongoMapper("monography_roles", "find", _filter, "").then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

        // let _rResp = await _mUtils.commonMonogoCall("monography_roles", "find", _filter, "", "", "", "")
        // if (!(_rResp && _rResp.success)) {
        //     resolve({ success: false, data: [], desc: `Error occured While executing proc, Error: - ${_rResp.desc || error} ` })
        //    // return res.status(400).json({ success: false, status: 400, desc: _resp.desc || "", data: [] })
        // }
        // resolve({ success: true, data: _rResp.data || [] })
    })
}

async function getAllAssignDrugDetails(_data, _indx, _output, req) {
    try {
        if (_data.length > _indx) {
            let _filter = {
                "filter": {
                    "DD_SUBSTANCE_NAME": _data[_indx].DD_SUBSTANCE_NAME,
                    "content_type": req.body.params.content_type
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "find", _filter, "", req.body, "", req.tokenData.dbType);
            if (_mResp.data.length > 0) {

                _.each(_mResp.data, async (obj, indx) => {
                    obj['child'] = _data[_indx].child
                    //  let _getRoleData = await getRoleParticularData("G",obj)
                    //  console.log("_getRoleData",_getRoleData)
                    _output.push(obj)
                })
            }
            _indx = _indx + 1;
            await getAllAssignDrugDetails(_data, _indx, _output, req);
        }
        else {
            return { data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};

/*get assign drus data with all users from sql server  */
// router.post('/get-assignData-all-users', async (req, res) => {
//     try {
//         // let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
//         let params = {
//             "TYPE": "DD_DRUG_MASTER",
//             // "FLAG": "DD_DRUG",
//             "STATUS": req.body.params.status ? req.body.params.status : "",
//             "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
//             "ID": req.body.params.id ? req.body.params.id : ""
//         }
//         if (req.body.params.flag === "DRUG_INTERACTIONS") {
//             params['FLAG'] = req.body.params.flag
//         } else if (req.body.params.flag === "DD_DRUG") {
//             params['FLAG'] = req.body.params.flag
//         }

//         axios1.post(url, params).then(async (response) => {
//             if (response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
//                 let filterData = JSON.parse(response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
//                 let getPatientData = await getAllAssignDrugDetails(filterData, 0, [], req)
//                 return res.status(200).json({ success: true, status: 200, data: getPatientData.data, desc: "" });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
//             }

//         }).catch((err) => {
//             console.log("err", err)
//         })
//     } catch (error) {

//     }
// })

/**get search data from sql server */
// router.post("/get-search-db-data", async (req, res) => {
//     try {
//         //let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
//         let params = {
//             "TYPE": "DD_DRUG_MASTER",
//             "STATUS": req.body.params.status ? req.body.params.status : "",
//             "SEARCH_COL": req.body.params.searchValue ? req.body.params.searchValue : "",
//             "VAL1": req.body.params.val1 ? req.body.params.val1 : "",
//             "ID": req.body.params.id ? req.body.params.id : ""
//         }
//         if (req.body.params.flag === "DRUG_INTERACTIONS") {
//             params['FLAG'] = req.body.params.flag
//         } else if (req.body.params.flag === "DD_DRUG") {
//             params['FLAG'] = req.body.params.flag
//         }
//         let finalData = []
//         axios1.post(url, params).then((response) => {
//             if (response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
//                 let filterData = JSON.parse(response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
//                 // _.filter(filterData, (_ro, _ri) => {
//                 //     if (_ro.DD_SUBSTANCE_NAME.toLowerCase().includes(req.body.params.searchValue.toLowerCase())) {
//                 //         finalData.push(_ro)
//                 //     }
//                 // })
//                 return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
//             }

//         }).catch((err) => {
//             return res.status(500).json({ success: fgalse, status: 400, data: [], desc: err })
//         })
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });

/*get assign drus data with all users  */
router.post('/get-assignData-all-users', async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
            }
        }

        let _mResp = await _mUtils.commonMonogoCall("monography_userAssign", "find", _filter, "", "", "", "")
        if (!(_mResp && _mResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
        }
        return res.status(200).json({ success: true, status: 200, data: _mResp.data, desc: "" });
    } catch (error) {

    }
})

async function findDuplicateData(_data, _indx, _output, req, _filterObj) {
    try {
        if (_data.length > _indx) {
            _filterObj.filter = {};
            _filterObj.filter['recStatus'] = { $eq: true }
            _filterObj.filter['DD_SUBSTANCE_CD'] = _data[_indx].DD_SUBSTANCE_CD;
            let _mResp = await _mUtils.commonMonogoCall("monography_dd_substance_combination", "find", _filterObj, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            } else {
                if (_mResp.data.length > 0) {
                    let _distResp = _.chain(_mResp.data).groupBy("DD_SUBSTANCE_NAME")
                        .map((_v, _k) => {
                            if (_k != "") {
                                _output.push({
                                    DD_SUBSTANCE_NAME: _k,
                                    DD_SUBSTANCE_CD: _v[0].DD_SUBSTANCE_CD ? _v[0].DD_SUBSTANCE_CD : "",
                                    DD_SUBSTANCE_COMB_CD: _v[0].DD_SUBSTANCE_COMB_CD ? _v[0].DD_SUBSTANCE_COMB_CD : "",
                                    DD_SUBSTANCE_COMB_NAME: _v[0].DD_SUBSTANCE_COMB_NAME ? _v[0].DD_SUBSTANCE_COMB_NAME : "",
                                    DD_SUBSTANCE_COMB_REF: _v[0].DD_SUBSTANCE_COMB_REF ? _v[0].DD_SUBSTANCE_COMB_REF : "",
                                    DD_SUBSTANCE_COMB_REF_CODE: _v[0].DD_SUBSTANCE_COMB_REF_CODE ? _v[0].DD_SUBSTANCE_COMB_REF_CODE : "",
                                })
                            }
                        }).value();
                }
            }
            _indx = _indx + 1;
            await findDuplicateData(_data, _indx, _output, req, _filterObj);
        }
        else {
            return { data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
};


/**get search data from sql server */
router.post("/get-search-db-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true }
            }
        }
        let _collName = "";
        let _output = [];
        let finalData = []
        if (req.body.params.flag === "DRUG_INTERACTIONS") {
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
            _filter.filter['SRC_DRUG_NAME'] = nameExp;
            _filter.filter['STATUS'] = req.body.params.status.toUpperCase() === "UNASSIGNED" ? "NOT ACCEPTED" : req.body.params.status.toUpperCase() === "ASSIGNED" ? "ACCEPTED" : ""

            let _mResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            } else {
                if (_mResp.data.length > 0) {
                    let _distResp = _.chain(_mResp.data).groupBy("SRC_DRUG_NAME")
                        .map((_v, _k) => {
                            if (_k != "") {
                                _output.push({
                                    DD_SUBSTANCE_NAME: _k,
                                    DD_SUBSTANCE_CD: _v[0].SRC_DRUG_CD ? _v[0].SRC_DRUG_CD : ""
                                })
                            }
                        }).value();
                }
                return res.status(200).json({ success: true, status: 200, data: _output, desc: "" });
            }
        } else if (req.body.params.flag === "DD_DRUG") {
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
            _filter.filter['DD_SUBSTANCE_NAME'] = nameExp;
            _filter.filter['IS_ASSIGNED'] = req.body.params.status.toUpperCase();

            let _mResp = await _mUtils.commonMonogoCall(`monography_dd_drug_master`, "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            } else {
                if (_mResp.data.length > 0) {
                    let _distResp = _.chain(_mResp.data).groupBy("DD_SUBSTANCE_NAME")
                        .map((_v, _k) => {
                            if (_k != "") {
                                _output.push({
                                    DD_SUBSTANCE_NAME: _k,
                                    DD_SUBSTANCE_CD: _v[0].DD_SUBSTANCE_CD ? _v[0].DD_SUBSTANCE_CD : ""
                                })
                            }
                        }).value();
                }
                let _getChilddata = await findDuplicateData(_output, 0, [], req, _filter)
                _.each(_output, (_obj, _indx) => {
                    _obj['child'] = []
                    if (_getChilddata.data.length > 0) {
                        _.each(_getChilddata.data, (_obj1, _indx1) => {
                            if (_obj.DD_SUBSTANCE_CD === _obj1.DD_SUBSTANCE_CD) {
                                _obj.child.push(_obj1)
                            }
                        })
                    }
                    finalData.push(_obj)
                })
            }
            return res.status(200).json({ success: true, status: 200, data: finalData, desc: "" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-interactions-from-db", async (req, res) => {
    try {
        // let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
        let params = {
            "TYPE": "DRUG_INTERACTIONS",
            "FLAG": "A",
            "ID2": req.body.params.id2
        }
        let finalData = []
        axios1.post(url, params).then((response) => {
            // if (response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"].length > 0) {
            //     let filterData = JSON.parse(response.data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"])
            //     return res.status(200).json({ success: true, status: 200, data: filterData, desc: "" });
            // } else {
            //     return res.status(200).json({ success: true, status: 200, data: [], desc: "" });
            // }
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {

        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

/**Insert Counter */
router.post("/insert-counter", async (req, res) => {
    try {
        // req.body.params.locId = req.tokenData.locId;
        //  req.body.params.locName = req.tokenData.locName;
        mongoMapper('monography_counters', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert Status */
router.post("/insert-status", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Status' }, "monography", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params["drug_Mongrophy_Status_Code"] = _seqResp.data;
        mongoMapper('monography_drugmonographyworkflowstatuses', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**get status */
router.post("/get-status", async (req, res) => {
    try {
        let _filter = {
            "filter": { recStatus: true },
            "selectors": "-history"
        }
        mongoMapper("monography_drugmonographyworkflowstatuses", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


async function insertCommentsData(_method, data, req) {
    return new Promise(async (resolve, rejected) => {
        try {
            let params = {
                referenceType: req.body.params.content_type ? req.body.params.content_type : "",
                referenceId: req.body.params.drugId ? req.body.params.drugId : "",
                userId: req.body.params.user_id ? req.body.params.user_id : "",
                roleId: req.body.params.role_id ? req.body.params.role_id : "",
                roleName: req.body.params.roleName ? req.body.params.roleName : "",
                drug_section_id: req.body.params.drug_section_id ? req.body.params.drug_section_id : "",
                sectionName: req.body.params.SECTION_NAME ? req.body.params.SECTION_NAME : "",
                section_comment: data.section_comment ? data.section_comment : "",
                sections_table_id: data._id ? data._id : "",
                audit: req.body.params.audit
            }
            let _mResp = await _mUtils.commonMonogoCall(_method, "insertMany", params, "", "", "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error: - ${_mResp.desc} ` });
            }
            resolve({ success: true, data: _mResp.data, desc: `` });
        } catch (error) {
            return { success: false, data: [], desc: `Error occured, Error: - ${error} ` }
        }
    })
}


async function sectionVersionData(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "DD_SUBATANCE_CD": _data[_idx].DD_SUBSTANCE_CD,
                    "drug_section_id": _data[_idx].drug_section_id,
                    "content_type": _data[_idx].content_type
                }
            }
            let _sResp = await _mUtils.commonMonogoCall("monography_sections_history", "find", _filter, "", "", "", "")
            if (_sResp.data.length > 0) {
                let _descData = _.orderBy(_sResp.data, ['version'], ['desc']);
                let _version = _descData[0].version + 1
                let params = {
                    "sections_table_id": _data[_idx]._id,
                    "drug_monography_Code": _data[_idx].drug_monography_Code,
                    'DD_SUBSTANCE_CD': _data[_idx].DD_SUBSTANCE_CD,
                    "SECTION_TYPE": _data[_idx].SECTION_TYPE ? _data[_idx].SECTION_TYPE : "",
                    "SECTION_NAME": _data[_idx].SECTION_NAME ? _data[_idx].SECTION_NAME : "",
                    "drug_section_id": _data[_idx].drug_section_id,
                    "userId": _data[_idx].user_id ? _data[_idx].user_id : "",
                    "userName": _data[_idx].userName ? _data[_idx].userName : "",
                    "roleId": _data[_idx].role_id ? _data[_idx].role_id : "",
                    "roleName": _data[_idx].roleName ? _data[_idx].roleName : "",
                    "drug_content": _data[_idx].drug_content ? _data[_idx].drug_content : "",
                    "content_type": _data[_idx].content_type ? _data[_idx].content_type : "",
                    "version": _version,
                    "audit": {
                        "documentedBy": _data[_idx].audit.modifiedBy,
                        "documentedById": _data[_idx].audit.modifiedById
                    }
                }
                let sectionInsertVersionData = await _mUtils.commonMonogoCall("monography_sections_history", "insertMany", params, "", "", "", "")
                if (!(sectionInsertVersionData && sectionInsertVersionData.success)) {
                    console.log("Error Occured while updating appointment details to Patient");
                } else {
                    _output.push(sectionInsertVersionData.data[0])
                }
            } else {
                let params = {
                    "sections_table_id": _data[_idx]._id,
                    "drug_monography_Code": _data[_idx].drug_monography_Code,
                    'DD_SUBSTANCE_CD': _data[_idx].DD_SUBSTANCE_CD,
                    "SECTION_TYPE": _data[_idx].SECTION_TYPE ? _data[_idx].SECTION_TYPE : "",
                    "SECTION_NAME": _data[_idx].SECTION_NAME ? _data[_idx].SECTION_NAME : "",
                    "drug_section_id": _data[_idx].drug_section_id,
                    "userId": _data[_idx].user_id ? _data[_idx].user_id : "",
                    "userName": _data[_idx].userName ? _data[_idx].userName : "",
                    "roleId": _data[_idx].role_id ? _data[_idx].role_id : "",
                    "roleName": _data[_idx].roleName ? _data[_idx].roleName : "",
                    "drug_content": _data[_idx].drug_content ? _data[_idx].drug_content : "",
                    "content_type": _data[_idx].content_type ? _data[_idx].content_type : "",
                    "version": 1,
                    "audit": {
                        "documentedBy": _data[_idx].audit.documentedBy,
                        "documentedById": _data[_idx].audit.documentedById
                    }
                }
                let sectionInsertVersionData = await _mUtils.commonMonogoCall("monography_sections_history", "insertMany", params, "", "", "", "")
               // console.log("sdhsgsd", sectionInsertVersionData)
                if (!(sectionInsertVersionData && sectionInsertVersionData.success)) {
                    console.log("Error Occured while updating appointment details to Patient");
                } else {
                    _output.push(sectionInsertVersionData.data[0])
                }
            }
            _idx = _idx + 1
            await sectionVersionData(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? true : false,
            "data": _output
        }
    } catch (error) {
       // console.log("efdfhgudfhfdgh", error)
    }
}

/**insert Status */
router.post("/insert-section-data", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Section' }, "monography", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        let _filter = {
            "filter": { session_id: req.body.params.session_id },
            "selectors": "-history"
        };
        let _userAssignResp;
        let _sessionResp = await _mUtils.commonMonogoCall("monography_userSession", "find", _filter, "", "", "", req.tokenData.dbType)
        req.body.params['user_id'] = _sessionResp.data[0].userId;
        req.body.params['role_id'] = _sessionResp.data[0].roleId;
        req.body.params["drug_monography_Code"] = _seqResp.data;
        // let _statusResp = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowstatuses", "find", req.body.params.current_status_id, "", "", "", req.tokenData.dbType)
        //    req.body.params['current_status'] = _statusResp.data.Drug_Mon_Status;
        // delete _filter.filter.session_id
        if (req.body.params.user_id && req.body.params.drugId) {
            _filter.filter['dId'] = req.body.params.drugId;
            _filter.filter['assignedTo.userId'] = req.body.params.user_id;
            _filter.filter['assignedTo.roleId'] = req.body.params.role_id
            _userAssignResp = await _mUtils.commonMonogoCall("monography_drugworkflow", "find", _filter, "", "", "", req.tokenData.dbType)
        }

        _.each(req.body.params.interacaction_drug_content, (_o) => {
            _o.recStatus = true;
            _o.audit = req.body.params.audit;
        });
        mongoMapper('monography_sections', req.body.query, req.body.params, req.tokenData.dbType).then(async (result) => {
            if (result.data.length > 0) {
                let _trackingFlowdata = {
                    current_status: result.data[0].current_status ? result.data[0].current_status : "",
                    userId: result.data[0].userId ? result.data[0].userId : "",
                    roleId: result.data[0].roleId ? result.data[0].roleId : "",
                    drugId: result.data[0].drugId ? result.data[0].drugId : "",
                    content_type: result.data[0].content_type ? result.data[0].content_type : "",
                    DD_SUBSTANCE_NAME: result.data[0].DD_SUBSTANCE_NAME ? result.data[0].DD_SUBSTANCE_NAME : "",
                    done_by: result.data[0].audit.documentedBy,
                    //  user_assigned_table_id: _userAssignResp.data[0]._id ? _userAssignResp.data[0]._id : "",
                    drug_mono_id: result.data[0]._id,
                    audit: req.body.params.audit
                }
                let _statusflowTracking = await _mUtils.commonMonogoCall("monography_drugmonographyworkflowtracking", "insertMany", _trackingFlowdata, "", "", "", req.tokenData.dbType);
                if (!(_statusflowTracking && _statusflowTracking.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _statusflowTracking.desc || "", data: _statusflowTracking.data || [] });
                }

                //section version logic start.
                let _sectionVersionData = await sectionVersionData(JSON.parse(JSON.stringify(result.data)), 0, [], req)
                if (!(_sectionVersionData && _sectionVersionData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _sectionVersionData.desc || "", data: _sectionVersionData.data || [] });
                }
                //section version logic end
            }
            let _cResp = await insertCommentsData("monography_comments", result.data[0], req)
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**insert comment data */
router.post("/insert-comment-data", async (req, res) => {
    try {
        mongoMapper('monography_comments', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**get-comment box */
router.post("/get-comments-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                recStatus: { $eq: true },
                "referenceId": req.body.params.drugId,
                "drug_section_id": req.body.params.drug_section_id
            }
        }
        mongoMapper("monography_comments", req.body.query, _filter, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {

    }
})


// router.post("/insert-section-data", async (req, res) => {
//     try {
//         let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Section' }, "monography", req);
//         if (!(_seqResp && _seqResp.success)) {
//             return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
//         }
//         let _filter = {
//             "filter": { session_id:req.body.params.session_id},
//             "selectors": "-history"
//         }
//         let _sessionResp = await _mUtils.commonMonogoCall("monography_userSession", "find",_filter, "","", "", req.tokenData.dbType)
//         console.log("_sessionResp",_sessionResp)
//         req.body.params['user_id']=_sessionResp.data[0].userId;
//         req.body.params['role_id']=_sessionResp.data[0].roleId;
//         // if (!(_mResp && _mResp.success)) {
//         //     return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
//         // }
//         req.body.params["drug_monography_Code"] = _seqResp.data;
//         mongoMapper('monography_sections', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });

/* get section-data */
router.post("/get-section-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "drug_section_id": req.body.params.drug_section_id,
                "DD_SUBSTANCE_CD": req.body.params.drug_substance_code,
                "content_type": req.body.params.content_type,
                //"role_id": req.body.params.roleId
            },
            "selectors": "-history"
        }
        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        mongoMapper("monography_sections", "find", _filter, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});


/* get view data(against roleid and userId from Section Table)*/
// router.post("/get-view-data", async (req, res) => {
//     try {
//         if (req.body.params.userId && req.body.params.roleId) {
//             let _filter = {
//                 "filter": {
//                     "recStatus": { $eq: true },
//                     "role_id": req.body.params.roleId,
//                     "user_id": req.body.params.userId,
//                     "content_type": req.body.params.content_type,
//                     "DD_SUBSTANCE_CD": req.body.params.drug_substance_code
//                 },
//                 "selectors": "-history"
//             }

//             if (req.body.params.section_type) {
//                 _filter.filter['SECTION_TYPE'] = req.body.params.section_type
//             }

//             //    let _pGData = await prepareGetPayload(_filter, req.body.params);
//             //    if (!_pGData.success) {
//             //        return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//             //    }
//             mongoMapper("monography_sections", "find", _filter, req.tokenData.dbType).then((result) => {
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//             }).catch((error) => {
//                 return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//             });
//         } else {
//             return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
//         }

//     } catch (error) {

//     }
// })

router.post("/get-view-data", async (req, res) => {
    try {
        if (req.body.params && req.body.params.content_type && req.body.params.drug_substance_code) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "content_type": req.body.params.content_type,
                    "DD_SUBSTANCE_CD": req.body.params.drug_substance_code
                },
                "selectors": "-history"
            }
            if (req.body.params.flag === "U") {
                _filter.filter['role_id'] = req.body.params.roleId
                _filter.filter['user_id'] = req.body.params.userId
            }

            if (req.body.params.section_type) {
                _filter.filter['SECTION_TYPE'] = req.body.params.section_type
            }

            mongoMapper("monography_sections", "find", _filter, req.tokenData.dbType).then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
})

/**update-section-data*/
router.post("/update-section-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let pLoadResp = { payload: {} };
            let _mResp = await _mUtils.commonMonogoCall("monography_sections", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            let _cResp = await insertCommentsData("monography_comments", _mResp.data.params, req)
            if (!(_cResp && _cResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: "comments data not valid", data: [] });
            }

            let _hResp = await _mUtils.insertHistoryData('monography_sections', _mResp.data.params, _cBody.params, req, "cm");
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                // pLoadResp.payload.query.$push["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
            }
            mongoMapper('monography_sections', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
                //section version logic start.
                let _finalData = []
                _finalData.push(_cBody.params)
                let _sectionVersionData = await sectionVersionData(_finalData, 0, [], req)
                if (!(_sectionVersionData && _sectionVersionData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _sectionVersionData.desc || "", data: _sectionVersionData.data || [] });
                }
                //section version logic end

                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/insert-session-data", async (req, res) => {
    try {
        mongoMapper('monography_userSession', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*insert-contentTypes*/
router.post("/insert-contentType-data", async (req, res) => {
    try {
        mongoMapper('monography_contenttypes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
// get-contentTypes/

router.post("/get-contentType-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_contenttypes", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert-sectiontype*/
router.post("/insert-sectiontype-data", async (req, res) => {
    try {
        mongoMapper('monography_sectiontypes', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*  get-sectiontype*/
router.post("/get-sectiontype-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "_id": req.body.params._id },
            "selectors": ""
        }
        mongoMapper("monography_sectiontypes", req.body.query, req.body.params, req.tokenData.orgKey).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

/*insert-template*/
router.post("/insert-template-data", async (req, res) => {
    try {
        mongoMapper('monography_templates', req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});



async function commonDropdownData(_finalArreyData, req, _lCode1, _lName1, _lCode2, _lName2, _lCode3, _lName3, _lCode4, _lName4, _lCode5, _lName5) {
    try {
        //  return new Promise((resolve,reject)=>{
        let _data = []
        let _object = {}
        if (req.body.params.flag1 == "L0") {
            let groupData = _.chain(_finalArreyData).groupBy(_lCode1)
                .map((_v, _k) => {
                    if (_k != "") {
                        _object = {}
                        _object[`${_lCode1}`] = _k
                        _object[`${_lName1}`] = _v[0][`${_lName1}`]
                        _data.push(_object)
                    }
                }).value();

            return { success: true, status: 200, desc: '', data: _data }
        } else if (req.body.params.flag1 == "L1") {
            let _uomData = _.chain(_finalArreyData).groupBy(_lCode1)
                .map((_v, _k) => {
                    if (_k != "" && _k == req.body.params.code) {
                        let _groupBy = _.groupBy(_v, `${_lCode2}`)
                        _.map(_groupBy, (_v1, _k1) => {
                            if (_k1 != "") {
                                _object = {}
                                _object[`${_lCode2}`] = _k1
                                _object[`${_lName2}`] = _v1[0][`${_lName2}`]
                                _data.push(_object)
                            }
                        })
                    }
                }).value();
            return { success: true, status: 200, desc: '', data: _data }
        } else if (req.body.params.flag1 == "L2") {
            let _uomData = _.chain(_finalArreyData).groupBy(_lCode2)
                .map((_v, _k) => {
                    if (_k != "" && _k == req.body.params.code) {
                        let _groupBy = _.groupBy(_v, `${_lCode3}`)
                        _.map(_groupBy, (_v1, _k1) => {
                            if (_k1 != "") {
                                _object = {}
                                _object[`${_lCode3}`] = _k1
                                _object[`${_lName3}`] = _v1[0][`${_lName3}`]
                                _data.push(_object)
                            }
                        })
                    }
                }).value();
            return { success: true, status: 200, desc: '', data: _data }
        } else if (req.body.params.flag1 == "L3") {
            let _uomData = _.chain(_finalArreyData).groupBy(_lCode3)
                .map((_v, _k) => {
                    if (_k != "" && _k == req.body.params.code) {
                        let _groupBy = _.groupBy(_v, `${_lCode4}`)
                        _.map(_groupBy, (_v1, _k1) => {
                            if (_k1 != "") {
                                _object = {}
                                _object[`${_lCode4}`] = _k1
                                _object[`${_lName4}`] = _v1[0][`${_lName4}`]
                                _data.push(_object)
                            }
                        })
                    }
                }).value();
            return { success: true, status: 200, desc: '', data: _data }
        } else if (req.body.params.flag1 == "L4") {
            let _uomData = _.chain(_finalArreyData).groupBy(_lCode4)
                .map((_v, _k) => {
                    if (_k != "" && _k == req.body.params.code) {
                        let _groupBy = _.groupBy(_v, `${_lCode5}`)
                        _.map(_groupBy, (_v1, _k1) => {
                            if (_k1 != "") {
                                _object = {}
                                _object[`${_lCode5}`] = _k1
                                _object[`${_lName5}`] = _v1[0][`${_lName5}`]
                                _data.push(_object)
                            }
                        })
                    }
                }).value();
            return { success: true, status: 200, desc: '', data: _data }
        }
        //    })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error, data: [] })
    }
}

async function commonCheckExitOrNot(_colName, req, _filterObj, _flag, _method, _columnNames) {
    try {
        let limit = parseInt(req.body.params.limit) || 50;
        if (_flag === "EXIST") {
            _.each(req.body.params, (_v, _k) => {
                if (_k != "flag" && _k != "_id" && _k != "audit" && _k != "history" && _k != "revNo" && _k != "REMARKS" && _k != "BRAND_PRODUCT_MAP_ID" && _k != "BRAND_PRODUCT_MAP_CD" && _k != "SOURCE_DATA" && _k != "recStatus") {
                    _filterObj.filter[_k] = _v
                }
            })
            let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, "find", _filterObj, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] }
            } else {
                if (_mResp.data.length > 0) {
                    return { success: true, status: 200, desc: '', data: "already exist", code: 0 };
                } else {
                    return { success: true, status: 200, desc: '', data: "not exist", code: 1 };
                }
            }
        } else if (_flag === "GETALL") {
            if (_method == "find") {
                // let _deleteLimit = _method != "find"  ? delete _filterObj.limit : _filterObj.limit ;
                // let _pGData = await prepareGetPayload(_filterObj, req.body.params);
                // if (!_pGData.success) {
                //     return { success: false, status: 400, desc: _pGData.desc, data: [] };
                // }
                let pageNumber = parseInt(req.body.params.pageNumber) || 0;
                let startIndex = pageNumber * limit;
                _filterObj['limit'] = limit
                _filterObj['skipData'] = startIndex;
                if (req.body.params.SEARCH_TYPE != "ALL") {
                    if (req.body.params.SEARCH_COL != "") {
                        let nameExp = { $regex: req.body.params.SEARCH_COL, $options: "i" };
                        _filterObj.filter[`${req.body.params.SEARCH_TYPE}`] = nameExp
                    }
                } else {
                    if (req.body.params.SEARCH_COL != "") {
                        let nameExp = { $regex: req.body.params.SEARCH_COL, $options: "i" };
                        _filterObj.filter = { $or: [] }
                        _.each(_columnNames, (_obj, _indx) => {
                            let _object = {}
                            _object[`${_obj}`] = nameExp
                            _filterObj.filter.$or.push(_object)
                            _filterObj.filter["recStatus"] = { $eq: req.body.params.recStatus }
                        })
                        if (req.body.params.type) {
                            _filterObj.filter['INT_ID'] = req.body.params.type
                        }


                    }
                }
                let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, _method, _filterObj, "", "", "", "")
                if (!(_mResp && _mResp.success)) {
                    return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] };
                }
                return { success: true, status: 200, desc: '', data: _mResp.data };
            } else {
                let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, _method, _filterObj, "", "", "", "")
                if (!(_mResp && _mResp.success)) {
                    return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] };
                }
                let _divisionData = Math.ceil(_mResp.data / limit)
                let _finalCounts = [
                    {
                        CNT: _divisionData,
                        TOTAL_COUNT: _mResp.data
                    }
                ]
                return { success: true, status: 200, desc: '', data: _finalCounts };
            }
        } else if (_flag === "BRNDEXIST") {
            _.each(req.body.params, (_v, _k) => {
                if (_k == "PARENT_BRAND_CD" || _k == "BRAND_DISPLAY_NAME") {
                    _filterObj.filter[_k] = _v
                }
            })
            let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, "find", _filterObj, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] }
            } else {
                if (_mResp.data.length > 0) {
                    return { success: true, status: 200, desc: '', data: "already exist", code: 0 };
                } else {
                    return { success: true, status: 200, desc: '', data: "not exist", code: 1 };
                }
            }
        } else if (_flag === "CHECKBRAND") {
            if (_method === "BRAND_NAME" || _method === "PARENT_BRAND" || _method === "BRAND_EXTENSION_NAME") {
                _filterObj.filter = {}
                _filterObj.filter['recStatus'] = { $eq: true }
                _filterObj.filter[`${_method}`] = req.body.params[`${_method}`]
                let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, "find", _filterObj, "", "", "", "")
                if (!(_mResp && _mResp.success)) {
                    return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] }
                }
                if (_mResp.data.length > 0) {
                    return { success: true, status: 200, desc: '', data: _mResp.data };
                } else {
                    return { success: true, status: 200, desc: '', data: [] };
                }
            }
        } else if (_flag === "EXACTKEYSEXISTORNOT") {
            _.each(req.body.params, (_v, _k) => {
                if (_k != "_id" && _k != "audit" && _k != "history" && _k != "revNo" && _k != "REMARKS") {
                    _filterObj.filter[_k] = _v
                }
            })
            // _filterObj.filter['recStatus'] = {$eq : true}
            let _mResp = await _mUtils.commonMonogoCall(`monography_${_colName}`, "find", _filterObj, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return { success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] }
            } else {
                if (_mResp.data.length > 0) {
                    return { success: true, status: 200, desc: '', data: "already exist", code: 0 };
                } else {
                    return { success: true, status: 200, desc: '', data: "not exist", code: 1 };
                }
            }
        }
    } catch (error) {
        return { success: true, status: 500, desc: error, data: [] };
    }
}

async function paginationResp(_coll, req, _filterObj) {
    try {
        let pageNumber = parseInt(req.body.params.pageNumber) || 0;
        let limit = parseInt(req.body.params.limit) || 50;
        let startIndex = pageNumber * limit;
        _filterObj['limit'] = limit
        _filterObj['skipData'] = startIndex
        let _mRespOfAppt = await _mUtils.commonMonogoCall(`monography_${_coll}`, "find", _filterObj, "", "", "", "")
        return { success: true, status: 200, desc: '', data: _mRespOfAppt.data }
    } catch (error) {
        return { success: false, status: 500, desc: error, data: [] };
    }
}

async function dropdowndata(_data, _indx, _output, req, _filterObj, res) {
    try {
        let _collName;
        let _distinctCol;
        let _masterName;
        if (_data.length > _indx) {
            _collName = _data[_indx];
            let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };

            if (_collName === "whoatcs") {
                _filterObj.filter["ATC_LEVEL_NAME"] = nameExp;
                _distinctCol = "ATC_LEVEL_NAME";
                _masterName = "WHO-ATC",
                _cd = "UNIQUE_CODE_ATC"
            } else if (_collName === "snowmeds") {
                _filterObj.filter["SUBSTANCE_NAME"] = nameExp;
                _distinctCol = "SUBSTANCE_NAME"
                _masterName = "NRCeS-SNOMED",
                 _cd = "IDENTIFIER_SUBSTANCE"
            } else if (_collName === "uniis") {
                _filterObj.filter["PT"] = nameExp;
                _distinctCol = "PT"
                _masterName = "UNII",
                _cd = "UNII"
            } else if (_collName === "inns") {
                _filterObj.filter["PT"] = nameExp;
                _distinctCol = "PT"
                _masterName = "INN",
                 _cd = "INN_ID"
            }

            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filterObj, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }

            if (_mRespData.data.length > 0 && req.body.params.flag1 === "DRPDATA") {
                let _distResp = _.chain(_mRespData.data).groupBy(`${_distinctCol}`)
                    .map((_v, _k) => {
                        if (_k != "") {
                            _output.push({
                                NAMES: _k,
                                MASTER_NAME: `${_masterName}`,
                                SUV_CODE: _v[0][`${_cd}`]
                            })
                        }
                    }).value();
            }
            _indx = _indx + 1
            await dropdowndata(_data, _indx, _output, req, _filterObj, res)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("sdfsfusf", error)
    }
}

async function dropdownGetdata(_data, _indx, _output, req, _filterObj, res) {
    try {
        // let _Resp =[];
        if (_data.length > _indx) {
            _filterObj.filter = {}
            _filterObj.filter['recStatus'] = { $eq: true }
            let _collName = _data[_indx];
            let _distinctCol;
            let _masterName = ""
            let nameExp = { $regex: new RegExp("\\b" + req.body.params.searchValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\\b", "i") };

            if (_collName === "whoatcs") {
                _filterObj.filter["ATC_LEVEL_NAME"] = nameExp;
                _distinctCol = "ATC_LEVEL_NAME"
                code = "UNIQUE_CODE_ATC"
                _masterName = "WHO-ATC"
            } else if (_collName === "snowmeds") {
                _filterObj.filter["SUBSTANCE_NAME"] = nameExp;
                _distinctCol = "SUBSTANCE_NAME"
                code = "IDENTIFIER_SUBSTANCE"
                _masterName = "NRCeS-SNOMED"
            } else if (_collName === "uniis") {
                _filterObj.filter["PT"] = nameExp;
                _distinctCol = "PT"
                code = "UNII"
                _masterName = "UNII"
            } else if (_collName === "inns") {
                _filterObj.filter["PT"] = nameExp;
                _distinctCol = "PT"
                code = "UNII"
                _masterName = "INN"
            } else if (_collName === "brand") {
                _filterObj.filter["BRAND_NAME"] = nameExp;
                _distinctCol = "BRAND_NAME"
                code = "BRAND_CD"
            } else if (_collName === "brand") {
                _filterObj.filter["BRAND_EXTENSION_NAME"] = nameExp;
                _distinctCol = "BRAND_EXTENSION_NAME"
                code = "BRAND_EXTENSION_CD"
            } else if (_collName === "brand") {
                _filterObj.filter["PARENT_BRAND"] = nameExp;
                _distinctCol = "PARENT_BRAND"
                code = "PARENT_BRAND_CD"
            }


            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filterObj, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }

            if (_mRespData.data.length > 0) {
                let _distResp = _.chain(_mRespData.data).groupBy(`${_distinctCol}`)
                    .map((_v, _k) => {
                        if (_k != "") {
                            _output.push({
                                SUV_NAME: _k,
                                MASTER_NAME: `${_masterName}`,
                                SUV_CODE: _v[0][`${code}`]
                            })
                        }
                    }).value();

                // if(_Resp.length > 0){
                //     return res.status(200).json({ success: false, status: 400, desc:"", data: _Resp || [] });
                // }
            }

            _indx = _indx + 1
            await dropdownGetdata(_data, _indx, _output, req, _filterObj, res)
        } else {
            return { success: true, data: _output || [] };
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("sdfsfusf", error)
    }
}

async function dropdownMasterWiseData(req, _output, _filterObj, res) {
    try {
        let _masterName;
        let col1 = ""
        let col2 = ""
        let val1 = ""
        let val2 = ""
        let val3 = ""
        let col3 = "MASTER_NAME"
        let _collName = ""
        let nameExp = req.body.params.searchValue && req.body.params.searchValue.length > 8 ? { $regex: new RegExp("\\b" + req.body.params.searchValue.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\\b", "i") } : { $regex: req.body.params.searchValue, $options: "i" };
        if (req.body.params.MASTER_NAME == "UNII") {
            _collName = "uniis";
            _filterObj.filter["PT"] = nameExp;
            _distinctCol = "PT"
            col1 = "NAMES"
            col2 = "SUV_CODE"
            val2 = "UNII"
            _masterName = "UNII"
        } else if (req.body.params.MASTER_NAME == "WHO-ATC") {
            _collName = "whoatcs";
            _filterObj.filter["ATC_LEVEL_NAME"] = nameExp;
            _distinctCol = "ATC_LEVEL_NAME"
            col1 = "NAMES"
            col2 = "SUV_CODE"
            val2 = "UNIQUE_CODE_ATC"
            _masterName = "WHO-ATC"
        } else if (req.body.params.MASTER_NAME == "NRCeS-SNOMED") {
            _collName = "snowmeds";
            _filterObj.filter["SUBSTANCE_NAME"] = nameExp;
            _distinctCol = "SUBSTANCE_NAME"
            col1 = "NAMES"
            col2 = "SUV_CODE"
            val2 = "IDENTIFIER_SUBSTANCE"
            _masterName = "NRCeS-SNOMED"
        } else if (req.body.params.MASTER_NAME == "INN") {
            _collName = "inns";
            _filterObj.filter["PT"] = nameExp;
            _distinctCol = "PT"
            col1 = "NAMES"
            col2 = "SUV_CODE"
            val2 = "UNII"
            _masterName = "INN"
        } else if (req.body.params.MASTER_NAME == "IS") {
            _collName = "intendedsites";
            //_filterObj.filter["DISPLAY_NAME"] = namExp;
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "IS"
            col1 = "DISPlAY_NAME"
            col2 = "IS_CODE"
            val1 = "IS";
            val2 = "IS_ALL_CODE"
        } else if (req.body.params.MASTER_NAME == "DAM") {
            _collName = "dam";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "DAM"
            col1 = "DISPlAY_NAME"
            col2 = "DAM_CODE"
            val1 = "DAM";
            val2 = "DAM_ALL_CODE"
        } else if (req.body.params.MASTER_NAME == "ROA") {
            _collName = "routeofadministrations";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "ROA"
            col1 = "DISPlAY_NAME"
            col2 = "ROA_CODE"
            val1 = "ROA";
            val2 = "ROA_ALL_CODE"
        } else if (req.body.params.MASTER_NAME == "RNS") {
            _collName = "bdf";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "RNS"
            col1 = "DISPlAY_NAME"
            col2 = "RNS_CODE"
            col3 = "MASTER_NAME"
            val1 = "BDF";
            val2 = "BDF_ALL_CODE"
        } else if (req.body.params.MASTER_NAME == "BDF") {
            _collName = "bdf";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "BDF"
            col1 = "DISPlAY_NAME"
            col2 = "BDF_CODE"
            col3 = "MASTER_NAME"
            val1 = "BDF";
            val2 = "BDF_ALL_CODE"
        } else if (req.body.params.MASTER_NAME == "NUMBER") {
            _collName = "numbers";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "NUMBER"
            col1 = "DISPlAY_NAME"
            col2 = "NUMBER_CD"
            col3 = "MASTER_NAME"
            // val1 = "BDF";
            val2 = "NUMBER_CD"
        } else if (req.body.params.MASTER_NAME == "UOM") {
            _collName = "uoms";
            delete nameExp;
            _distinctCol = "DISPlAY_NAME"
            _masterName = "UOM"
            col1 = "DISPlAY_NAME"
            col2 = "UOM_CD"
            col3 = "MASTER_NAME"
            // val1 = "BDF";
            val2 = "UOM_CD"
        } else if (req.body.params.MASTER_NAME == "SUBSTANCE") {
            _collName = "substance";
            _filterObj.filter["DD_SUBSTANCE_NAME"] = nameExp;
            _distinctCol = "DD_SUBSTANCE_NAME"
            _masterName = "SUBSTANCE"
            col1 = "DD_SUBSTANCE_NAME"
            col2 = "DD_SUBSTANCE_CD"
            // col3 ="MASTER_NAME"
            // val1 = "BDF";
            val2 = "DD_SUBSTANCE_CD"
        } else if (req.body.params.MASTER_NAME == "DD_SUBSTANCE_COMB") {
            _collName = "dd_substance_combination";
            delete nameExp;
            _distinctCol = "DD_SUBSTANCE_COMB_NAME"
            _masterName = "DD_SUBSTANCE_COMBINATION"
            col1 = "DD_SUBSTANCE_COMB_NAME"
            col2 = "DD_SUBSTANCE_COMB_CD"
            // col3 ="MASTER_NAME"
            // val1 = "BDF";
            val2 = "DD_SUBSTANCE_COMB_CD"
        } else if (req.body.params.MASTER_NAME == "DD_DRUG_MASTER") {
            _collName = "dd_drug_master";
            // if (req.body.params.searchValue == "")
            delete nameExp;
            _distinctCol = "DD_SUBSTANCE_COMB_NAME"
            _masterName = "DD_DRUG_MASTER"
            col1 = "MEDICINAL_NAME"
            col2 = "MEDICINAL_CODE"
            // col3 ="MASTER_NAME"
            // val1 = "BDF";
            val2 = "DD_SUBSTANCE_COMB_CD"
            // _filterObj.skipData = 0
            // _filterObj.limit = 20
        } else if (req.body.params.MASTER_NAME == "BRAND_NAME") {
            _collName = "brand";
            if (req.body.params.searchValue && req.body.params.searchValue != '') {

                _filterObj.filter["BRAND_NAME"] = nameExp;
                _distinctCol = "BRAND_NAME"
                col1 = "BRAND_NAME"
                col2 = "BRAND_CD"
                val2 = "BRAND_CD"
                _masterName = "BRAND_NAME"
                _filterObj.skipData = 0
                _filterObj.limit = 50
            } else if (req.body.params.name && req.body.params.name != '') {
                _filterObj.filter["PARENT_BRAND"] = req.body.params.name
                delete nameExp
                _distinctCol = "BRAND_NAME"
                col1 = "BRAND_NAME"
                col2 = "BRAND_CD"
                val2 = "BRAND_CD"
                _masterName = "BRAND_NAME"
                _filterObj.skipData = 0
                _filterObj.limit = 50
                // let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filterObj, "", "", "", "")
                // if (!(_mRespData && _mRespData.success)) {
                //     return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                // }

            }

        } else if (req.body.params.MASTER_NAME == "PARENT_BRAND") {
            _collName = "brand";
            if (req.body.params.searchValue && req.body.params.searchValue != '') {
                _filterObj.filter["PARENT_BRAND"] = nameExp;
                _distinctCol = "PARENT_BRAND"
                col1 = "PARENT_BRAND"
                col2 = "PARENT_BRAND_CD"
                val2 = "PARENT_BRAND_CD"
                _masterName = "PARENT_BRAND"
                _filterObj.skipData = 0
                _filterObj.limit = 50
            } else if (req.body.params.name && req.body.params.name != '') {
                _filterObj.filter["BRAND_NAME"] = req.body.params.name;
                delete nameExp
                _distinctCol = "PARENT_BRAND"
                col1 = "PARENT_BRAND"
                col2 = "PARENT_BRAND_CD"
                val2 = "PARENT_BRAND_CD"
                _masterName = "PARENT_BRAND"
                _filterObj.skipData = 0
                _filterObj.limit = 50
            }
        } else if (req.body.params.MASTER_NAME == "BRAND_EXTENSION_NAME") {
            _collName = "brand";
            _filterObj.filter["BRAND_EXTENSION_NAME"] = nameExp;
            delete nameExp
            _distinctCol = "BRAND_EXTENSION_NAME"
            col1 = "BRAND_EXTENSION_NAME"
            col2 = "BRAND_EXTENSION_CD"
            val2 = "BRAND_EXTENSION_CD"
            _masterName = "BRAND_EXTENSION_NAME"
            _filterObj.skipData = 0
            _filterObj.limit = 50
        } else if (req.body.params.MASTER_NAME == "STRENGTH") {
            _collName = "strength";
            delete nameExp;
            _distinctCol = "STRENGTH_NAME"
            _masterName = "STRENGTH"
            col1 = "STRENGTH_NAME"
            col2 = "STRENGTH_MASTER_CD"
            val2 = "STRENGTH_MASTER_CD"
        } else if (req.body.params.MASTER_NAME == "DOSE_FORM") {
            _collName = "dose_form_map";
            delete nameExp;
            _distinctCol = "DOSE_DISPLAY_NAME"
            _masterName = "DOSE_FORM"
            col1 = "DOSE_DISPLAY_NAME"
            col2 = "DOSE_FORM_CD"
            val2 = "DOSE_FORM_CD"
        } else if (req.body.params.MASTER_NAME == "RELEASE") {
            _collName = "releases";
            delete nameExp;
            _distinctCol = "DISPLAY_NAME"
            _masterName = "RELEASE"
            col1 = "DISPLAY_NAME"
            col2 = "DRUG_RELEASE_CD"
            val2 = "DRUG_RELEASE_CD"
        } else if (req.body.params.MASTER_NAME == "CLINIC_DRUG") {
            _collName = "dd_product_master";
            _distinctCol = "STRING_3"
            _filterObj.filter["STRING_3"] = nameExp;
            _masterName = "CLINIC_DRUG"
            col1 = "STRING_3"
            col2 = "STRING_3_CD"
            val2 = "STRING_3_CD"
            _filterObj.skipData = 0
            _filterObj.limit = 50
        } else if (req.body.params.MASTER_NAME == "BRAND_DISPLAY_NAME") {
            _collName = "brand";
            _distinctCol = "BRAND_DISPLAY_NAME"
            _filterObj.filter["BRAND_DISPLAY_NAME"] = nameExp;
            _masterName = "BRAND_DISPLAY_NAME"
            col1 = "BRAND_DISPLAY_NAME"
            col2 = "BRAND_MASTER_ID"
            val2 = "BRAND_MASTER_ID"
            col4 = "BRAND_DISPLAY_CD"
            val3 = "BRAND_DISPLAY_CD"
            _filterObj.skipData = 0
            _filterObj.limit = 50
            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filterObj, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            if (_mRespData.data.length > 0) {
                let _distResp = _.chain(JSON.parse(JSON.stringify(_mRespData.data))).groupBy(`${_distinctCol}`)
                    .map((_v, _k) => {
                        if (_k != "") {
                            let _objwct = {};
                            _objwct[`${col1}`] = _k
                            _objwct[`${col2}`] = `${val1}` + _v[0][`${val2}`]
                            _objwct[`${col3}`] = `${_masterName}`
                            _objwct[`${col4}`] = _v[0][`${val3}`]
                            _output.push(_objwct)
                        }
                    }).value();
            }
            return { success: true, status: 200, data: _output }
        } else if (req.body.params.MASTER_NAME == "THERAPHY") {
            _collName = "theraphy";
            _distinctCol = "THERAPY_NAME"
            _masterName = "THERAPHY"
            col1 = "THERAPY_NAME"
            col2 = "THERAPY_CD"
            val2 = "THERAPY_CD"
        } else if (req.body.params.MASTER_NAME == "FLAVOUR") {
            _collName = "flavour";
            _distinctCol = "FLAVOUR_NAME"
            _masterName = "FLAVOUR"
            col1 = "FLAVOUR_NAME"
            col2 = "FLAVOUR_CD"
            val2 = "FLAVOUR_CD"
        } else if (req.body.params.MASTER_NAME == "BRAND_STRENGTH") {
            _collName = "brand_product_mapping"
            _distinctCol = "STRENGTH_NAME"
            _filterObj.filter['STRENGTH_NAME'] = nameExp
            _masterName = "FLAVOUR"
            col1 = "STRENGTH_NAME"
            col2 = "STRENGTH_CD"
            val2 = "STRENGTH_CD"
        } else if (req.body.params.MASTER_NAME == "COMPANY_NAME") {
            _collName = "company"
            _distinctCol = "COMPANY_NAME"
            _filterObj.filter["COMPANY_NAME"] = nameExp;
            _masterName = "COMPANY_NAME"
            col1 = "COMPANY_NAME"
            col2 = "COMPANY_CD"
            val2 = "COMPANY_CD"
        } else if (req.body.params.MASTER_NAME == "BRAND_PROD_DOSE_FORM") {
            _collName = "brand_product_mapping"
            _distinctCol = "DOSE_FORM_NAME"
            _filterObj.filter['DOSE_FORM_NAME'] = nameExp
            _masterName = "BRAND_PRODUCT"
            col1 = "DOSE_FORM_NAME"
            col2 = "DOSE_FORM_CD"
            val2 = "DOSE_FORM_CD"
            _filterObj.skipData = 0
            _filterObj.limit = 50
        } else if (req.body.params.MASTER_NAME == "STRENGTH_FROM_DD_MAPPING") {
            _collName = "dd_substance_comb_mapping"
            _distinctCol = "STRENGTH_CD"
            _filterObj.filter['DD_SUBSTANCE_COMB_CD'] = nameExp
            _masterName = "DD_SUBSTANCE_MAPPING"
            col1 = "STRENGTH_CD"
            col2 = "STRENGTH"
            val2 = "STRENGTH"
            _filterObj.skipData = 0
            _filterObj.limit = 50
        } else if (req.body.params.MASTER_NAME == "DOSE_FORM_FROM_DD_MAPPING") {
            _collName = "dd_substance_comb_mapping"
            _distinctCol = "DOSE_FORM_NAME"
            _filterObj.filter['DD_SUBSTANCE_COMB_CD'] = nameExp
            _masterName = "DD_SUBSTANCE_MAPPING"
            col1 = "DOSE_FORM_NAME"
            col2 = "DOSE_FORM_CD"
            val2 = "DOSE_FORM_CD"
            _filterObj.skipData = 0
            _filterObj.limit = 50
        } else if (req.body.params.MASTER_NAME == "FOOD_MASTER") {
            _collName = "food_master";
            delete nameExp;
            _distinctCol = "FOOD_MASTER_NAME"
            _masterName = "FOOD_MASTER"
            col1 = "FOOD_MASTER_NAME"
            col2 = "FOOD_MASTER_CD"
            val2 = "FOOD_MASTER_CD"
        } else if (req.body.params.MASTER_NAME == "DISEASE_MASTER") {
            // _collName = "disease_master";
            // delete nameExp;
            // _distinctCol = "DISEASE_MASTER_NAME"
            // _masterName = "DISEASE_MASTER"
            // col1 = "DISEASE_MASTER_NAME"
            // col2 = "REFERENCE_ID1"
            // val2 = "REFERENCE_ID1"
            if (!(req.body.params.searchValue)) {
                _collName = "diseasemapping";
                _distinctCol = "DISEASE_NAME"
                //  _filterObj.filter["DISEASE_NAME"] = nameExp;
                _masterName = "DISEASE_MASTER"
                col1 = "DISEASE_MASTER_NAME"
                col2 = "REFERENCE_ID1"
                val2 = "DISEASE_MAP_CD"
                // _filterObj.skipData = 0
                // _filterObj.limit = 50
            } else {
                _collName = "diseasemapping";
                _distinctCol = "DISEASE_NAME"
                _filterObj.filter["DISEASE_NAME"] = nameExp;
                _masterName = "DISEASE_MASTER"
                col1 = "DISEASE_MASTER_NAME"
                col2 = "REFERENCE_ID1"
                val2 = "DISEASE_MAP_CD"
                // _filterObj.skipData = 0
                // _filterObj.limit = 50
            }

        } else if (req.body.params.MASTER_NAME == "LAB_TEST_MASTER") {
            _collName = "lab_test_master";
            delete nameExp;
            _distinctCol = "LAB_TEST_MASTER_NAME"
            _masterName = "LAB_TEST_MASTER"
            col1 = "LAB_TEST_MASTER_NAME"
            col2 = "LAB_TEST_MASTER_CD"
            val2 = "LAB_TEST_MASTER_CD"
        } else if (req.body.params.MASTER_NAME == "CLASS_NAME") {
            if (req.body.params.searchValue && req.body.params.searchValue != "") {
                _collName = "class_name";
                _filterObj.filter['CLASS_NAME'] = nameExp;
                _distinctCol = "CLASS_NAME"
                _masterName = "CLASS_NAME"
                col1 = "CLASS_NAME"
                col2 = "CLASS_NAME_CD"
                val2 = "CLASS_NAME_CD"
            } else {
                _collName = "class_name";
                delete nameExp;
                _distinctCol = "CLASS_NAME"
                _masterName = "CLASS_NAME"
                col1 = "CLASS_NAME"
                col2 = "CLASS_NAME_CD"
                val2 = "CLASS_NAME_CD"
            }
        } else if (req.body.params.MASTER_NAME == "DD_DRUG_INTERACTING_DRUG") {
            _collName = "brand_product_mapping";
            if (req.body.params.searchValue && req.body.params.searchValue != "" && !req.body.params.CODE) {
                _filterObj.filter["BRAND_STRING2"] = nameExp;
            } else {
                _filterObj.filter['BRAND_STRING2'] = nameExp
                _filterObj.filter['BRAND_STRING2_CD'] = { $ne: req.body.params.CODE }
            }
            _distinctCol = "BRAND_STRING2"
            _masterName = "BRAND_PRODUCT_MAPPING"
            col1 = "BRAND_PRODUCT_NAME"
            col2 = "BRAND_PRODUCT_CD"
            val2 = "BRAND_PRODUCT_MAP_CD"
        } else if (req.body.params.MASTER_NAME == "SOURCE") {
            let _mRespData = await _mUtils.commonMonogoCall(`monography_source_master`, "find", {}, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            return { success: true, status: 200, data: _mRespData.data }

        } else if (req.body.params.MASTER_NAME == "ALLERGY") {
            if (req.body.params.searchValue && req.body.params.searchValue != "") {
                _collName = "allergy_master";
                _filterObj.filter['ALLERGY_NAME'] = nameExp;
                _distinctCol = "ALLERGY_NAME"
                _masterName = "ALLERGY"
                col1 = "ALLERGY_NAME"
                col2 = "ALLERGY_CD"
                val2 = "ALLERGY_CD"
            } else {
                _collName = "allergy_master";
                delete nameExp;
                _distinctCol = "ALLERGY_NAME"
                _masterName = "ALLERGY"
                col1 = "ALLERGY_NAME"
                col2 = "ALLERGY_CD"
                val2 = "ALLERGY_CD"
            }
        }
        let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collName}`, "find", _filterObj, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        }
        if (_mRespData.data.length > 0) {
            let _distResp = _.chain(JSON.parse(JSON.stringify(_mRespData.data))).groupBy(`${_distinctCol}`)
                .map((_v, _k) => {
                    if (_k != "") {
                        let _objwct = {};
                        _objwct[`${col1}`] = _k
                        _objwct[`${col2}`] = `${val1}` + _v[0][`${val2}`]
                        _objwct[`${col3}`] = `${_masterName}`
                        _output.push(_objwct)
                    }
                }).value();
        }
        return { success: true, status: 200, data: _output }
    } catch (error) {
      //  console.log(error)
    }
}

async function checkMatchingData(_coll, req, _filterObj, res, _compKey) {
    try {
        let _mRespData = await _mUtils.commonMonogoCall(`monography_${_coll}`, "find", _filterObj, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        }
        let _data = []
        _.each(_mRespData.data, (_obj, _indx) => {
            if (_obj.DD_SUBSTANCE_COMB_CD != "" && _obj.DD_SUBSTANCE_COMB_CD != undefined && _obj.DD_SUBSTANCE_COMB_CD != null) {
                if (_obj.DD_SUBSTANCE_COMB_CD.split("+").map(str => str.trim()).sort().join("+").trim() == _compKey) {
                    _data.push(_obj)
                }
            }
        })
        if (_data.length > 0) {
            return { success: true, status: 200, desc: '', data: "already exist", code: 0 };
        } else {
            delete req.body.params.DD_SUBSTANCE_COMB_CD
            let _existData = await commonCheckExitOrNot(_coll, req, _filterObj, "EXIST")
            return _existData
        }
    } catch (error) {
       // console.log("hgv", error)
    }
}

async function assembleData(_data, _idx, _output, req, _filterObj, _arrey1, _arrey2) {
    try {
        if (_data.length > _idx) {
            _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    DD_SUBSTANCE_COMB_CD: _data[_idx].trim()
                }
            }
            //  _filterObj.filter['DD_SUBSTANCE_COMB_CD'] = _data[_idx];
            _collectionName = "dd_substance_combination"
            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            _output.push({ success: true, desc: "", data: _mRespData.data || [] });
            _idx = _idx + 1
            await assembleData(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function getDataBasedOnLooping(_data, _idx, _output, req, _filterObj, _coll, _type) {
    try {
        if (_data.length > _idx) {
            _filterObj.filter = {}
            _filterObj.filter['recStatus'] = { $eq: true }

            if (_type == "CLASS_CD") {
                _filterObj.filter['CLASS_NAME_CD'] = _data[_idx];
            } else if (_type == "FOOD") {
                _filterObj.filter['INT_ID'] = 9;
                _filterObj.filter['INT_TYPE_ID'] = _data[_idx];
            } else if (_type == "DISEASE") {
                _filterObj.filter['INT_ID'] = 10;
                _filterObj.filter['INT_TYPE_ID'] = _data[_idx];
            } else if (_type == "LAB") {
                _filterObj.filter['INT_ID'] = 11;
                _filterObj.filter['INT_TYPE_ID'] = _data[_idx];
            } else if (_type == "CLASS_NAME") {
                _filterObj.filter['DD_SUBSTANCE_CD'] = _data[_idx];
            } else if (_type == "SUBSTANCE_AGANIST_CLASS") {
                _filterObj.filter['DD_SUBSTANCE_CD'] = _data[_idx].DD_SUBSTANCE_CD;
            } else if (_type == "ALLERGY_NAME") {
                _filterObj.filter['ALLERGY_CD'] = _data[_idx];
            } else if (_type == "REFERENCE") {
                _filterObj.filter['REFERENCE_ID'] = _data[_idx];
            }
            //_filterObj.filter['INT_TYPE_ID'] = _data[_idx];
            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_coll}`, "find", _filterObj, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            if (_mRespData.data.constructor.name == "Array" && _mRespData.data.length > 0) {
                _.each(_mRespData.data, (_o, _i) => {
                    _output.push(_o)
                })
            }
            //  else {
            //     _output.push(_mRespData.data);
            // }

            _idx = _idx + 1
            await getDataBasedOnLooping(_data, _idx, _output, req, _filterObj, _coll, _type)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function getDataBasedOnLooping1(_data, _idx, _output, req, _filterObj, _coll) {
    try {
        if (_data.length > _idx) {
            // _filter = {
            //     "filter": {
            //         "recStatus": { $eq: true },
            //         DD_SUBSTANCE_COMB_CD: _data[_idx].trim()
            //     }
            // }
            _filterObj.filter['DOSE_FORM_CD'] = _data[_idx].DOSE_FORM_CD ? _data[_idx].DOSE_FORM_CD : delete _filterObj.filter.DOSE_FORM_CD;
            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_coll}`, "find", _filterObj, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            if (_mRespData.data.constructor.name == "Array" && _mRespData.data.length > 0) {
                _.each(_mRespData.data, (_o, _i) => {
                    _output.push(_o)
                })
            } else {
                _output.push(_mRespData.data);
            }

            _idx = _idx + 1
            await getDataBasedOnLooping1(_data, _idx, _output, req, _filterObj, _coll)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function updateParentData(data, _idx, _output, req, _result) {
    try {
        // return new Promise(async (resolve, reject) => {
        //     let _filter = {
        //         "filter": {
        //             "recStatus": true,
        //             "_id": id
        //         },
        //         "selectors": "-history"
        //     }
        //     let _mPatResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "find", _filter, "", "", "", req.tokenData.dbType);

        //     if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
        //         resolve({ success: false, data: [], desc: "Error, No patient data found.." });
        //     }
        //     let patData = {
        //         params: {
        //             _id: _mPatResp.data[0]._id,
        //             revNo: _mPatResp.data[0].revNo,
        //             SRC_DRUG_CD: req.body.params.JSON1[0].SRC_DRUG_CD,
        //             SRC_DRUG_NAME: req.body.params.JSON1[0].SRC_DRUG_NAME,
        //             IS_NAME: req.body.params.JSON1[0].IS_NAME,
        //             IS_CD: req.body.params.JSON1[0].IS_CD,
        //             INT_TYPE_NAME: req.body.params.JSON1[0].INT_TYPE_NAME,
        //             INT_TYPE_ID: req.body.params.JSON1[0].INT_TYPE_ID,
        //             CLASS_NAME_CD: req.body.params.JSON1[0].CLASS_NAME_CD ? req.body.params.JSON1[0].CLASS_NAME_CD : "",
        //             CLASS_NAME: req.body.params.JSON1[0].CLASS_NAME ? req.body.params.JSON1[0].CLASS_NAME : "",
        //             INT_ID: req.body.params.JSON1[0].INT_ID,
        //             SEVERITY_NAME: req.body.params.JSON1[0].SEVERITY_NAME,
        //             SEVERITY_ID: req.body.params.JSON1[0].SEVERITY_ID,
        //             SRC_NAME: req.body.params.JSON1[0].SRC_NAME,
        //             SRC_CD: req.body.params.JSON1[0].SRC_CD,
        //             SRC_URL: req.body.params.JSON1[0].SRC_URL,
        //             INTERACTIONS: req.body.params.JSON1[0].INTERACTIONS,
        //             REFERENCES: req.body.params.JSON1[0].REFERENCES,
        //             REMARKS: req.body.params.JSON1[0].REMARKS,
        //             recStatus: req.body.params.JSON1[0].recStatus == false || req.body.params.JSON1[0].recStatus == true ? req.body.params.JSON1[0].recStatus : true,
        //             DRUG_IN_PARENT_ID: req.body.params.JSON1[0].DRUG_IN_PARENT_ID,
        //             audit: {
        //                 documentedById: _mPatResp.data[0].audit.documentedById,
        //                 documentedBy: _mPatResp.data[0].audit.documentedBy,
        //                 documentedDt: _mPatResp.data[0].audit.documentedDt
        //             }
        //         }
        //     };

        //     let pLoadResp = { payload: {} };
        //     patData.params.audit = {};
        //     patData.params.audit["modifiedById"] = req.tokenData.userId;
        //     patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
        //     patData.params.audit["modifiedByDt"] = new Date().toISOString();
        //     patData.params.revNo = patData.params.revNo + 1;

        //     pLoadResp = await _mUtils.preparePayload("BW", patData);
        //     if (!pLoadResp.success) {
        //         resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
        //     }

        //     let _uResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
        //     if (!(_uResp && _uResp.success && _uResp.data)) {
        //         resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
        //     }
        //     else {
        //         delete _filter.filter._id
        //         _filter.filter['DRUG_IN_PARENT_ID'] = req.body.params.JSON1[0].DRUG_IN_PARENT_ID
        //         let _mChildResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "");
        //         if (!(_mChildResp && _mChildResp.success && _mChildResp.data && _mChildResp.data.length > 0)) {
        //             resolve({ success: false, data: [], desc: "Error, No patient data found.." });
        //         }

        //         let _indx = 0;
        //         while (_mChildResp.data.length > _indx) {
        //             let _params = {
        //                 "params": {
        //                     "_id": _mChildResp.data[_indx]._id,
        //                     "recStatus": false
        //                 }
        //             }
        //             pLoadResp = { payload: {} };
        //             pLoadResp = await _mUtils.preparePayload("BW", _params);
        //             if (!pLoadResp.success) {
        //                 resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
        //             }
        //             let _uChildResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
        //             if (!(_uChildResp && _uChildResp.success && _uChildResp.data)) {
        //                 resolve({ success: false, status: 400, desc: _uChildResp.desc || 'Error occurred while insert User ..', data: [] });
        //             }
        //             _indx++;
        //         }
        //  resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
        //     }
        // });
        try {
            if (data.length > _idx) {
                let _filter = {
                    "filter": {
                        "recStatus": true,
                        "_id": data[_idx]._id
                    },
                    "selectors": "-history"
                }
                if(req.body.params.hasOwnProperty('isActive')){
                   _filter.filter['recStatus'] =false
                }
                let _mPatResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "find", _filter, "", "", "", req.tokenData.dbType);

                if (!(_mPatResp && _mPatResp.success && _mPatResp.data && _mPatResp.data.length > 0)) {
                    resolve({ success: false, data: [], desc: "Error, No patient data found.." });
                }
                let patData = {
                    params: {
                        _id: _mPatResp.data[0]._id,
                        revNo: _mPatResp.data[0].revNo,
                        SRC_DRUG_CD: req.body.params.JSON1[0].SRC_DRUG_CD,
                        SRC_DRUG_NAME: req.body.params.JSON1[0].SRC_DRUG_NAME,
                        IS_NAME: req.body.params.JSON1[0].IS_NAME,
                        IS_CD: req.body.params.JSON1[0].IS_CD,
                        INT_TYPE_NAME: req.body.params.JSON1[0].INT_TYPE_NAME,
                        INT_TYPE_ID: req.body.params.JSON1[0].INT_TYPE_ID,
                        CLASS_NAME_CD: req.body.params.JSON1[0].CLASS_NAME_CD ? req.body.params.JSON1[0].CLASS_NAME_CD : "",
                        CLASS_NAME: req.body.params.JSON1[0].CLASS_NAME ? req.body.params.JSON1[0].CLASS_NAME : "",
                        INT_ID: req.body.params.JSON1[0].INT_ID,
                        SEVERITY_NAME: req.body.params.JSON1[0].SEVERITY_NAME,
                        SEVERITY_ID: req.body.params.JSON1[0].SEVERITY_ID,
                        SRC_NAME: req.body.params.JSON1[0].SRC_NAME,
                        SRC_CD: req.body.params.JSON1[0].SRC_CD,
                        SRC_URL: req.body.params.JSON1[0].SRC_URL,
                        INTERACTIONS: req.body.params.JSON1[0].INTERACTIONS,
                        REFERENCES: req.body.params.JSON1[0].REFERENCES,
                        REMARKS: req.body.params.JSON1[0].REMARKS,
                        recStatus: req.body.params.JSON1[0].recStatus == false || req.body.params.JSON1[0].recStatus == true ? req.body.params.JSON1[0].recStatus : true,
                        DRUG_IN_PARENT_ID: req.body.params.JSON1[0].DRUG_IN_PARENT_ID,
                        audit: {
                            documentedById: _mPatResp.data[0].audit.documentedById,
                            documentedBy: _mPatResp.data[0].audit.documentedBy,
                            documentedDt: _mPatResp.data[0].audit.documentedDt
                        }
                    }
                };

                let pLoadResp = { payload: {} };
                patData.params.audit = {};
                patData.params.audit["modifiedById"] = req.tokenData.userId;
                patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
                patData.params.audit["modifiedByDt"] = new Date().toISOString();
                patData.params.revNo = patData.params.revNo + 1;

                pLoadResp = await _mUtils.preparePayload("BW", patData);
                if (!pLoadResp.success) {
                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }

                let _uResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                if (!(_uResp && _uResp.success && _uResp.data)) {
                    _output.push({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                }
                else {
                    delete _filter.filter._id
                    _filter.filter.recStatus=true
                    _filter.filter['DRUG_IN_PARENT_ID'] = req.body.params.JSON1[0].DRUG_IN_PARENT_ID
                    let _mChildResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "");
                    if (!(_mChildResp && _mChildResp.success)) {
                        _output.push({ success: false, data: [], desc: "Error, No patient data found.." });
                    } else {
                        if(_mChildResp.data.length > 0){
                            let _indx = 0;
                            while (_mChildResp.data.length > _indx) {
                                let _params = {
                                    "params": {
                                        "_id": _mChildResp.data[_indx]._id,
                                        "recStatus": false
                                    }
                                }
                                pLoadResp = { payload: {} };
                                pLoadResp = await _mUtils.preparePayload("BW", _params);
                                if (!pLoadResp.success) {
                                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                                }
                                let _uChildResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                                if (!(_uChildResp && _uChildResp.success && _uChildResp.data)) {
                                    resolve({ success: false, status: 400, desc: _uChildResp.desc || 'Error occurred while insert User ..', data: [] });
                                } else {
                                    _output.push({ success: true, status: 200, desc: "", data: _uChildResp.data });
                                }
                                _indx++;
                            }
                        }
                       
                    }


                    //  resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
                }
                _idx = _idx + 1
                await updateParentData(data, _idx, _output, req, _result)
            } else {
                return { success: true, data: _output }
            }
            let _final = _.filter(_output, (_r) => { return !_r.success });
            return {
                "success": _final.length > 0 ? false : true,
                "data": _output
            }
        } catch (error) {
          //  console.log("sgjhugfhdhf", error)
        }
    }
    catch (err) {
        return { success: false, data: [], desc: err.message || err }
    }
}

async function updatChildData(_data, _idx, _output, req, res) {
    try {
        if (_data.length > _idx) {
            _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    INT_ID: _data[_idx].INT_ID,
                    INT_TYPE_ID: _data[_idx].INT_TYPE_ID,
                    DRUG_IN_PARENT_ID: _data[_idx].DRUG_IN_PARENT_ID,
                    CLASS_NAME_CD: _data[_idx].CLASS_NAME_CD,
                    IS_CD: _data[_idx].IS_CD,
                    SRC_DRUG_CD: _data[_idx].SRC_DRUG_CD
                }
            }
            let _mRespData = await _mUtils.commonMonogoCall('monography_drugchildinteraction', "find", _filter, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }

            let patData = {
                params: {}
            }
            let _method = ""
            if (_mRespData.data.length > 0) {

                patData.params = {
                    _id: _mRespData.data[0]._id,
                    revNo: _mRespData.data[0].revNo,
                    SRC_DRUG_CD: req.body.params.JSON[_idx].SRC_DRUG_CD,
                    SRC_DRUG_NAME: req.body.params.JSON[_idx].SRC_DRUG_NAME,
                    IS_NAME: req.body.params.JSON[_idx].IS_NAME,
                    IS_CD: req.body.params.JSON[_idx].IS_CD,
                    INT_TYPE_NAME: req.body.params.JSON[_idx].INT_TYPE_NAME,
                    INT_TYPE_ID: req.body.params.JSON[_idx].INT_TYPE_ID,
                    CLASS_NAME_CD: req.body.params.JSON[_idx].CLASS_NAME_CD ? req.body.params.JSON[_idx].CLASS_NAME_CD : "",
                    CLASS_NAME: req.body.params.JSON[_idx].CLASS_NAME ? req.body.params.JSON[_idx].CLASS_NAME : "",
                    INT_ID: req.body.params.JSON[_idx].INT_ID,
                    SEVERITY_NAME: req.body.params.JSON[_idx].SEVERITY_NAME,
                    SEVERITY_ID: req.body.params.JSON[_idx].SEVERITY_ID,
                    SRC_NAME: req.body.params.JSON[_idx].SRC_NAME,
                    SRC_CD: req.body.params.JSON[_idx].SRC_CD,
                    SRC_URL: req.body.params.JSON[_idx].SRC_URL,
                    INTERACTIONS: req.body.params.JSON[_idx].INTERACTIONS,
                    REFERENCES: req.body.params.JSON[_idx].REFERENCES,
                    REMARKS: req.body.params.JSON[_idx].REMARKS,
                    recStatus: req.body.params.JSON[0].recStatus == false ? false : true,
                    DRUG_IN_PARENT_ID: req.body.params.JSON[_idx].DRUG_IN_PARENT_ID,
                    audit: {
                        documentedById: _mRespData.data[0].audit.documentedById,
                        documentedBy: _mRespData.data[0].audit.documentedBy,
                        documentedDt: _mRespData.data[0].audit.documentedDt
                    }
                }
                let pLoadResp = { payload: {} };

                // let _hResp = await _mUtils.insertHistoryData('cm_patients', patData.params, patData.params, req, "cm");

                patData.params.audit = {};
                patData.params.audit["modifiedById"] = req.tokenData.userId;
                patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
                patData.params.audit["modifiedByDt"] = new Date().toISOString();
                patData.params.revNo = patData.params.revNo + 1;
                // patData.params["history"] = {
                //     "revNo": _hResp.data[0].revNo,
                //     "revTranId": _hResp.data[0]._id
                // }
                pLoadResp = await _mUtils.preparePayload("BW", patData);
                if (!pLoadResp.success) {
                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }

                let _uResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);

                if (!(_uResp && _uResp.success && _uResp.data)) {
                    resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                }
                else {
                    _output.push({ success: true, status: 200, desc: "", data: _uResp.data || [] })
                    // resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
                }
            } else {
                patData.params = _data[_idx]
                let _mInsertChildDataData = await _mUtils.commonMonogoCall('monography_drugchildinteraction', "find", _filter, "", "", "", "")
                if (!(_mInsertChildDataData && _mInsertChildDataData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mInsertChildDataData.desc || "", data: _mInsertChildDataData.data || [] });
                }
                _output.push({ success: true, status: 200, desc: "", data: _mInsertChildDataData.data || [] })
            }
            // if (_mRespData.data.constructor.name == "Array" && _mRespData.data.length > 0) {
            //     _.each(_mRespData.data, (_o, _i) => {
            //         _output.push(_o)
            //     })
            // } else {
            //     _output.push(_mRespData.data);
            // }

            _idx = _idx + 1
            await updatChildData(_data, _idx, _output, req, res)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

async function childActiveInActive(_data, _idx, _output, req, res) {
    try {
        if (_data.length > _idx) {
            let patData = {
                params: {
                    _id: _data[_idx]._id,
                    recStatus: req.body.params.recStatus,
                    INTERACTIONS: req.body.params.INTERACTIONS,
                    REFERENCES: req.body.params.REFERENCES,
                    revNo: _data[_idx].revNo ? _data[_idx].revNo : 1,
                    audit: {}
                }
            }

            let pLoadResp = { payload: {} };

            patData.params.audit = {};
            patData.params.audit["modifiedById"] = req.tokenData.userId;
            patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
            patData.params.audit["modifiedByDt"] = new Date().toISOString();
            //  patData.params.revNo = patData.params.revNo + 1;

            pLoadResp = await _mUtils.preparePayload("BW", patData);
            if (!pLoadResp.success) {
                resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            let _uResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);

            if (!(_uResp && _uResp.success && _uResp.data)) {
                resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
            }
            else {
                _output.push({ success: true, status: 200, desc: "", data: _uResp.data || [] })
                // resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
            }
            _idx = _idx + 1
            await childActiveInActive(_data, _idx, _output, req, res)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

//insert or update(at a time) function 
async function insertOrUpdate(_data, _idx, _output, req, res, _collName) {
    try {
        if (_data.length > _idx) {
            if (_data[_idx]._id) {
                let patData = {
                    params: _data[_idx]
                }

                let pLoadResp = { payload: {} };
                patData.params.audit = {};
                patData.params.audit["modifiedById"] = req.tokenData.userId;
                patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
                patData.params.audit["modifiedByDt"] = new Date().toISOString();
                patData.params.revNo = patData.params.revNo + 1;

                pLoadResp = await _mUtils.preparePayload("BW", patData);
                if (!pLoadResp.success) {
                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }

                let _uResp = await _mUtils.commonMonogoCall(`monography_${_collName}`, 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);

                if (!(_uResp && _uResp.success && _uResp.data)) {
                    resolve({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] });
                }
                else {
                    _output.push({ success: true, status: 200, desc: "", data: _uResp.data || [] })
                    // resolve({ success: true, status: 200, desc: "", data: _uResp.data || [] });
                }
            } else {
                req.body.params = _data[_idx]
                _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: "DdsubstanceClassifications" }, "monography", req);
                if (!(_seqResp && _seqResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
                }

                let _filter = {
                    "filter": {
                        "recStatus": { $eq: true },
                        "DD_SUBSTANCE_NAME": _data[_idx].DD_SUBSTANCE_NAME
                    }
                }
                let _sResp = await _mUtils.commonMonogoCall("monography_substance", 'find', _filter, "", "", "", "");
                if (!(_sResp && _sResp.success && _sResp.data)) {
                    _output.push({ success: true, status: 200, desc: "", data: _sResp.data || [] })
                }
                req.body.params['DD_SUBSTANCE_CD'] = _sResp.data && _sResp.data.length > 0 ? _sResp.data[0].DD_SUBSTANCE_CD : ""
                req.body.params['DD_SUBSTANCE_CLS_CD'] = _seqResp.data;

                let _iResp = await _mUtils.commonMonogoCall("monography_dd_substance_classifications", 'insertMany', req.body.params, "", "", "", "");
                if (!(_iResp && _iResp.success && _iResp.data)) {
                    _output.push({ success: true, status: 200, desc: "", data: _iResp.data || [] })
                } else {
                    _output.push({ success: true, status: 200, desc: "", data: _iResp.data || [] })
                }

            }
            _idx = _idx + 1
            await insertOrUpdate(_data, _idx, _output, req, res, _collName)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

/**insert all master data */
router.post("/insert-master-data", async (req, res) => {
    try {
        let _seqResp;
        let _filter = { "filter": { "recStatus": { $eq: true } } };
        if (req.body.params.flag != "INN" && req.body.params.flag != "UNII" && req.body.params.flag != "SNOWMED" && req.body.params.flag !== "DMF" && req.body.params.flag !== undefined && req.body.params.flag !== "ENTITY" && req.body.params.flag !== "DD_SUBSTANCE_CLASSIFICATIONS" && req.body.params.flag !== "DRUG_INTERACTIONS" && req.body.params.flag !== "VALIDATE_BRAND_PRODUCT") {
            _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: `${req.body.params.sequenceName}` }, "monography", req);
            if (!(_seqResp && _seqResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
            }
        };

        let _collectionName = "";
        if (req.body.params.flag == "UOM") {
            _collectionName = "uoms"
            delete req.body.params.flag
            let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_exitData.code == 1) {
                req.body.params["UOM_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "NUM") {
            _collectionName = "numbers"
            delete req.body.params.flag
            let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_exitData.code == 1) {
                req.body.params["NUMBER_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }

        } else if (req.body.params.flag == "IS") {
            _collectionName = "intendedsites"
            delete req.body.params.flag
            _filter.filter = {
                $or: [
                    {
                        "IS_ALL_CODE": req.body.params.IS_ALL_CODE
                    },
                    {
                        "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            } else {
                req.body.params["INTENDED_SITE_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            }
            // let _exactKeysMatch = {
            //     "body": {
            //         "params": {
            //             "IS_ALL_CODE": req.body.params.IS_ALL_CODE,
            //             "DISPLAY_NAME": req.body.params.DISPLAY_NAME
            //         }
            //     }
            // }
            // let _exitData = await commonCheckExitOrNot(_collectionName, _exactKeysMatch, _filter, "EXACTKEYSEXISTORNOT")
            // if (_exitData.code == 1) {
            //     req.body.params["INTENDED_SITE_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            // } else {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            // }
        } else if (req.body.params.flag == "ROA") {
            // req.body.params["ROUTE_OF_ADMINISTRATION_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            _collectionName = "routeofadministrations";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "ROA_ALL_CODE": req.body.params.ROA_ALL_CODE
                    },
                    {
                        "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            } else {
                req.body.params["ROUTE_OF_ADMINISTRATION_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            }
        } else if (req.body.params.flag == "WAS") {
            _collectionName = "whoatcs"
            delete req.body.params.flag
            let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_exitData.code == 1) {
                let _filter = {
                    "filter": {
                        "ATC_LEVEL_NAME": req.body.params.ATCL5_LEVEL_NAME
                    }
                }

                let _getWhoAtc = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", req.tokenData.orgKey)
                if (!(_getWhoAtc && _getWhoAtc.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _getWhoAtc.desc || "", data: _getWhoAtc.data || [] });
                }

                if (_getWhoAtc.data.length > 0) {
                    req.body.params['UNIQUE_CODE_ATC'] = _getWhoAtc.data[0].UNIQUE_CODE_ATC
                } else {
                    req.body.params["UNIQUE_CODE_ATC"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                }
                // req.body.params["NUMBER_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }


        } else if (req.body.params.flag == "INN") {
            _collectionName = "inns"
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "INN_ID": req.body.params.INN_ID
                    },
                    {
                        "INN_NAME": req.body.params.INN_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "REL") {
            _collectionName = "releases";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "RL_ALL_CODE": req.body.params.RL_ALL_CODE
                    },
                    {
                        "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            } else {
                req.body.params["DRUG_RELEASE_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            }
            // let _exactKeysMatch = {
            //     "body": {
            //         "params": {
            //             "RL_ALL_CODE": req.body.params.RL_ALL_CODE,
            //             "DISPLAY_NAME": req.body.params.DISPLAY_NAME
            //         }
            //     }
            // }

            // let _existData = await commonCheckExitOrNot(_collectionName, _exactKeysMatch, _filter, "EXACTKEYSEXISTORNOT")
            // if (_existData.code == 1) {
            //     req.body.params["DRUG_RELEASE_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            // } else {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            // }

        } else if (req.body.params.flag == "UNII") {
            _collectionName = "uniis";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "UNII": req.body.params.UNII
                    },
                    {
                        "PT": req.body.params.PT
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "SNOWMED") {
            _collectionName = "snowmeds";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "SUBSTANCE_NAME": req.body.params.SUBSTANCE_NAME
                    },
                    {
                        "IDENTIFIER_SUBSTANCE": req.body.params.IDENTIFIER_SUBSTANCE
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "BDF") {
            _collectionName = "bdf";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "BDF_ALL_CODE": req.body.params.BDF_ALL_CODE
                    },
                    {
                        "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            } else {
                req.body.params["BASIC_DOSE_FORM_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            }
        } else if (req.body.params.flag == "DAM") {
            _collectionName = "dam";
            delete req.body.params.flag;
            _filter.filter = {
                $or: [
                    {
                        "DAM_ALL_CODE": req.body.params.DAM_ALL_CODE
                    },
                    {
                        "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                    }
                ]
            }

            let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
            if (_getIntendedSite.data.length > 0) {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            } else {
                req.body.params["DOSE_FORM_ADMINISTRATION_METHOD_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            }
        } else if (req.body.params.flag == "DD_SUBSTANCE") {
            _collectionName = "substance"
            delete req.body.params.flag;
            let _coll = ""
            let _filterKey = ""
            _filter.filter['PT'] = { $eq: req.body.params.DD_SUBSTANCE_NAME.toUpperCase() }
            let _mRespData = await _mUtils.commonMonogoCall("monography_uniis", "find", _filter, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            req.body.params['UNII'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII : "";
            req.body.params['UNII_NAME'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].PT : "";
            if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "WHO-ATC") {
                delete _filter.filter.PT
                _coll = "whoatcs"
                _filterKey = "UNIQUE_CODE_ATC"
                _filter.filter['ATC_LEVEL_NAME'] = req.body.params.DD_SUBSTANCE_NAME
            } else if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "NRCeS-SNOMED") {
                _coll = "snowmeds"
                _filterKey = "IDENTIFIER_SUBSTANCE"
                _filter.filter['SUBSTANCE_NAME'] = req.body.params.DD_SUBSTANCE_NAME
            } else if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "UNII") {
                _coll = "uniis"
                _filterKey = "UNII"
            }

            let _uniqCdRespData = await _mUtils.commonMonogoCall(`monography_${_coll}`, "find", _filter, "", "", "", "")
            if (!(_uniqCdRespData && _uniqCdRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _uniqCdRespData.desc || "", data: _uniqCdRespData.data || [] });
            }
            req.body.params['UNIQUE_CD_ATC'] = _uniqCdRespData.data && _uniqCdRespData.data.length > 0 ? _uniqCdRespData.data[0][`${_filterKey}`] : "";

          //  console.log("fsdfgdfjhgfd", req.body.params)




            // if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "WHO-ATC") {
            //     _filter.filter['ATC_LEVEL_NAME'] = req.body.params.DD_SUBSTANCE_NAME
            //     let _mRespData = await _mUtils.commonMonogoCall(`monography_whoatcs`, "find", _filter, "", "", "", "")
            //     if (!(_mRespData && _mRespData.success)) {
            //         return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            //     }
            //     req.body.params['UNII'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII_CODE : "";
            //     req.body.params['UNII_NAME'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII_NAME : "";
            //     req.body.params['UNIQUE_CD_ATC'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNIQUE_CODE_ATC : "";
            // } else if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "NRCeS-SNOMED") {
            //     _filter.filter['PT'] = req.body.params.DD_SUBSTANCE_NAME;
            //     let _mRespData = await _mUtils.commonMonogoCall(`monography_uniis`, "find", _filter, "", "", "", "")
            //     if (!(_mRespData && _mRespData.success)) {
            //         return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            //     }

            //     delete _filter.filter.PT
            //     _filter.filter['SUBSTANCE_NAME'] = req.body.params.DD_SUBSTANCE_NAME;
            //     let _mRespData1 = await _mUtils.commonMonogoCall(`monography_snowmeds`, "find", _filter, "", "", "", "")
            //     if (!(_mRespData1 && _mRespData1.success)) {
            //         return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            //     }
            //     req.body.params['UNII'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII : "";
            //     req.body.params['UNII_NAME'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII_NAME : "";
            //     req.body.params['UNIQUE_CD_ATC'] = _mRespData1.data && _mRespData1.data.length > 0 ? _mRespData1.data[0].IDENTIFIER_SUBSTANCE : "";
            // } else if (req.body.params.DD_WHO_REF && req.body.params.DD_WHO_REF === "UNII") {
            //     _filter.filter['PT'] = req.body.params.DD_SUBSTANCE_NAME;
            //     let _mRespData = await _mUtils.commonMonogoCall(`monography_uniis`, "find", _filter, "", "", "", "")
            //     if (!(_mRespData && _mRespData.success)) {
            //         return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            //     }
            //     req.body.params['UNII'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII : "";
            //     req.body.params['UNII_NAME'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII_NAME : "";
            //     req.body.params['UNIQUE_CD_ATC'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNII : "";
            // }
            _filter.filter = {}
            _filter = { "filter": { "recStatus": { $eq: true } } }
            let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_exitData.code == 1) {
                req.body.params["DD_SUBSTANCE_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }

        } else if (req.body.params.flag == "FLV") {
            _collectionName = 'flavour';
            delete req.body.params.flag;
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["FLAVOUR_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            }
        } else if (req.body.params.flag == "THE") {
            _collectionName = 'theraphy';
            delete req.body.params.flag;
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["THERAPY_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            }
        } else if (req.body.params.flag == "DD_SUBSTANCE_COMB") {
            _collectionName = "dd_substance_combination"
            delete req.body.params.flag;
            let _exactKeysMatch = {
                "body": {
                    "params": {
                        "DD_SUBSTANCE_COMB_NAME": req.body.params.DD_SUBSTANCE_COMB_NAME
                    }
                }
            }
            let _exitData = await commonCheckExitOrNot(_collectionName, _exactKeysMatch, _filter, "EXACTKEYSEXISTORNOT")
            if (_exitData.code == 1) {
                req.body.params["DD_SUBSTANCE_COMB_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                let _getWhoatcData;
                _filter.filter['ATC_LEVEL_NAME'] = req.body.params.DD_SUBSTANCE_NAME
                let _mRespData = await _mUtils.commonMonogoCall(`monography_whoatcs`, "find", _filter, "", "", "", "")
                if (_mRespData.data.length > 0) {
                    req.body.params['UNIQUE_CD_ATC'] = _mRespData.data && _mRespData.data.length > 0 ? _mRespData.data[0].UNIQUE_CODE_ATC : "";
                }
                delete _filter.filter.ATC_LEVEL_NAME
                _filter.filter['PT'] = req.body.params.DD_SUBSTANCE_COMB_NAME;
                let _mRespData1 = await _mUtils.commonMonogoCall(`monography_uniis`, "find", _filter, "", "", "", "")
                if (_mRespData1.data.length > 0) {
                    req.body.params['UNII'] = _mRespData1.data && _mRespData1.data.length > 0 ? _mRespData1.data[0].UNII : "";
                    req.body.params['UNII_NAME'] = _mRespData1.data && _mRespData1.data.length > 0 ? _mRespData1.data[0].PT : "";
                }
                let _mRespData2 = await _mUtils.commonMonogoCall(`monography_snowmeds`, "find", _filter, "", "", "", "")
                if (_mRespData2.data.length > 0) {
                    req.body.params['IDENTIFIER'] = _mRespData2.data && _mRespData2.data.length > 0 ? _mRespData2.data[0].IDENTIFIER_SUBSTANCE : "";
                }
                delete _filter.filter.PT
                // let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
                // if (_exitData.code == 1) {
                //     req.body.params["DD_SUBSTANCE_COMB_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                // } else {
                //     return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
                // }

                _filter.filter = {}
                _filter.filter['recStatus'] = { $eq: true }
                _filter.filter['ATC_LEVEL_NAME'] = req.body.params.DD_SUBSTANCE_NAME
                _getWhoatcData = await _mUtils.commonMonogoCall(`monography_whoatcs`, "find", _filter, "", "", "", "")
                if (!(_getWhoatcData && _getWhoatcData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _getWhoatcData.desc || "", data: _getWhoatcData.data || [] });
                }
                let _attachWhoaAtcData = []
                if (_getWhoatcData.data.length > 0) {
                    let ConsiderOutput = []
                    ConsiderOutput.push(_getWhoatcData.data[0])
                    _.each(ConsiderOutput, (_obj, _indx) => {
                        _attachWhoaAtcData.push({
                            "DD_SUBSTANCE_COMB_CD": req.body.params.DD_SUBSTANCE_COMB_CD != null ? req.body.params.DD_SUBSTANCE_COMB_CD : "",
                            "DD_SUBSTANCE_COMB_NAME": req.body.params.DD_SUBSTANCE_COMB_NAME != null ? req.body.params.DD_SUBSTANCE_COMB_NAME : "",
                            "DD_SUBSTANCE_COMB_REF": req.body.params.DD_SUBSTANCE_COMB_REF != null ? req.body.params.DD_SUBSTANCE_COMB_REF : "",
                            "DD_SUBSTANCE_CD": req.body.params.DD_SUBSTANCE_CD != null ? req.body.params.DD_SUBSTANCE_CD : "",
                            "DD_SUBSTANCE_NAME": req.body.params.DD_SUBSTANCE_NAME != null ? req.body.params.DD_SUBSTANCE_NAME : "",
                            "DD_SUBSTANCE_REF": req.body.params.DD_SUBSTANCE_REF && req.body.params.DD_SUBSTANCE_REF != null ? req.body.params.DD_SUBSTANCE_REF : "",
                            "DD_SUBSTANCE_COMB_REF_CODE": req.body.params.DD_SUBSTANCE_COMB_REF_CODE != null ? req.body.params.DD_SUBSTANCE_COMB_REF_CODE : "",
                            "UNII": req.body.params.UNII && req.body.params.UNII != null ? req.body.params.UNII : "",
                            "UNIQUE_CODE_ATC": req.body.params.UNIQUE_CODE_ATC && req.body.params.UNIQUE_CODE_ATC != null ? req.body.params.UNIQUE_CODE_ATC : "",
                            "IDENTIFIER": req.body.params.IDENTIFIER && req.body.params.IDENTIFIER != null ? req.body.params.IDENTIFIER : "",
                            "REMARKS": req.body.params.REMARKS && req.body.params.REMARKS != null ? req.body.params.REMARKS : "",
                            "FL1_CD": _obj.FL_CD != null ? _obj.FL_CD : "",
                            "FL1_NAME": _obj.FL_NAME != null ? _obj.FL_NAME : "",
                            "SL2_CD": _obj.SL_CD != null ? _obj.SL_CD : "",
                            "SL2_NAME": _obj.SL_NAME != null ? _obj.SL_NAME : "",
                            "TL3_CD": _obj.TL_CD != null ? _obj.TL_CD : "",
                            "TL3_NAME": _obj.TL_NAME != null ? _obj.TL_NAME : "",
                            "FTL4_CD": _obj.FTL_CD != null ? _obj.FTL_CD : "",
                            "FTL4_NAME": _obj.FTL_NAME != null ? _obj.FTL_NAME : "",
                            "ATCL5_CODE": _obj.ATC_CODE != null ? _obj.ATC_CODE : "",
                            "ATCL5_LEVEL_NAME": _obj.ATC_LEVEL_NAME != null ? _obj.ATC_LEVEL_NAME : "",
                            "REMARKS": req.body.params.REMARKS && req.body.params.REMARKS != null ? req.body.params.REMARKS : "",
                            "audit": req.body.params.audit
                        })
                    })

                } else {
                    _attachWhoaAtcData.push({
                        "DD_SUBSTANCE_COMB_CD": req.body.params.DD_SUBSTANCE_COMB_CD != null ? req.body.params.DD_SUBSTANCE_COMB_CD : "",
                        "DD_SUBSTANCE_COMB_NAME": req.body.params.DD_SUBSTANCE_COMB_NAME != null ? req.body.params.DD_SUBSTANCE_COMB_NAME : "",
                        "DD_SUBSTANCE_COMB_REF": req.body.params.DD_SUBSTANCE_COMB_REF != null ? req.body.params.DD_SUBSTANCE_COMB_REF : "",
                        "DD_SUBSTANCE_CD": req.body.params.DD_SUBSTANCE_CD != null ? req.body.params.DD_SUBSTANCE_CD : "",
                        "DD_SUBSTANCE_NAME": req.body.params.DD_SUBSTANCE_NAME != null ? req.body.params.DD_SUBSTANCE_NAME : "",
                        "DD_SUBSTANCE_REF": req.body.params.DD_SUBSTANCE_REF && req.body.params.DD_SUBSTANCE_REF != null ? req.body.params.DD_SUBSTANCE_REF : "",
                        "DD_SUBSTANCE_COMB_REF_CODE": req.body.params.DD_SUBSTANCE_COMB_REF_CODE != null ? req.body.params.DD_SUBSTANCE_COMB_REF_CODE : "",
                        "UNII": req.body.params.UNII && req.body.params.UNII != null ? req.body.params.UNII : "",
                        "UNIQUE_CODE_ATC": req.body.params.UNIQUE_CODE_ATC && req.body.params.UNIQUE_CODE_ATC != null ? req.body.params.UNIQUE_CODE_ATC : "",
                        "IDENTIFIER": req.body.params.IDENTIFIER && req.body.params.IDENTIFIER != null ? req.body.params.IDENTIFIER : "",
                        "REMARKS": req.body.params.REMARKS && req.body.params.REMARKS != null ? req.body.params.REMARKS : "",
                        "FL1_CD": "",
                        "FL1_NAME": "",
                        "SL2_CD": "",
                        "SL2_NAME": "",
                        "TL3_CD": "",
                        "TL3_NAME": "",
                        "FTL4_CD": "",
                        "FTL4_NAME": "",
                        "ATCL5_CODE": "",
                        "ATCL5_LEVEL_NAME": "",
                        "REMARKS": req.body.params.REMARKS && req.body.params.REMARKS != null ? req.body.params.REMARKS : "",
                        "audit": req.body.params.audit
                    })
                }
                req.body.params = _attachWhoaAtcData
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "DOSE_FORM_MAP") {
            _collectionName = "dose_form_map";
            delete req.body.params.flag
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["DOSE_FORM_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            }
        } else if (req.body.params.flag == "STRENGTH") {
            _collectionName = "strength";
            delete req.body.params.flag;
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["STRENGTH_MASTER_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            }
        } else if ((req.body.params.constructor.name == "Object" && req.body.params.flag == "DMF") || req.body.flag == "DMF") {
            _collectionName = "dd_substance_comb_mapping"
            delete req.body.params.flag;
            if (req.body.params.constructor.name == "Object") {
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
                if (_exitData.code == 0) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
                }
            }
        } else if (req.body.params.flag == "DD_DRUG_MASTER") {
            _collectionName = "dd_drug_master";
            delete req.body.params.flag;
            let _reqSubstanceCombCd = req.body.params.DD_SUBSTANCE_COMB_CD
            let _reqSubstanceCd = []
            let _splitParam = req.body.params.DD_SUBSTANCE_COMB_CD.split("+").forEach((_obj, _indx) => {
                _reqSubstanceCd.push(_obj.trim())
            })
            let _splitData = _reqSubstanceCd.length > 0 ? _reqSubstanceCd.sort().join("+").trim() : [];
            let _checkMatchingData = await checkMatchingData(_collectionName, req, _filter, res, _splitData)
            if (_checkMatchingData.code == 1) {
                let _assembleData = await assembleData(_reqSubstanceCd, 0, [], req, _filter, [], [])
                let _cdName = []
                let _Sname = []
                _.each(_assembleData.data, (_obj, _indx) => {
                    _.each(_obj.data, (_obj1, _indx1) => {
                        _Sname.push(_obj1.DD_SUBSTANCE_NAME)
                        _cdName.push(_obj1.DD_SUBSTANCE_CD)
                    })
                })

                if (_cdName.length > 0 && _Sname.length > 0) {
                    req.body.params["DD_SUBSTANCE_NAME"] = _Sname.join('+')
                    req.body.params["DD_SUBSTANCE_CD"] = _cdName.join('+')
                }
                req.body.params["DD_DRUG_MASTER_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                req.body.params['DD_SUBSTANCE_COMB_CD'] = _reqSubstanceCombCd
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }

        } else if (req.body.params.flag == "BRAND") {
            _collectionName = "brand"
            delete req.body.params.flag;
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "BRNDEXIST")
            if (_existData.code == 1) {
                _filter.filter = {}
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                req.body.params["BRAND_MASTER_ID"] = _exitData.data[0].TOTAL_COUNT + 1
                _filter.filter['recStatus'] = { $eq: true }

                //Adding The Brand DisplayName Code start
                _filter.filter['BRAND_DISPLAY_NAME'] = req.body.params.BRAND_DISPLAY_NAME

                let _getBrandname = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", req.tokenData.orgKey)
                if (!(_getBrandname && _getBrandname.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _getBrandname.desc || "", data: _getBrandname.data || [] });
                }
                req.body.params["BRAND_DISPLAY_CD"] = _getBrandname.data.length > 0 ? _getBrandname.data[0].BRAND_DISPLAY_CD : await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'BrandDisplaycode' }, "monography", req).then((_obj) => { return _obj.data });
                delete _filter.filter.BRAND_DISPLAY_NAME
                //Adding The Brand DisplayName Code End;

                let _filterBrandName = req.body.params.BRAND_NAME ? _filter.filter["BRAND_NAME"] = req.body.params.BRAND_NAME : _filter.filter["BRAND_NAME"] = "";
                let _checkBrandData = await commonCheckExitOrNot(_collectionName, req, _filter, "CHECKBRAND", "BRAND_NAME");
                req.body.params['BRAND_CD'] = _checkBrandData.data.length > 0 ? _checkBrandData.data[0].BRAND_CD : Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                let _checkParentBrandData = await commonCheckExitOrNot(_collectionName, req, _filter, "CHECKBRAND", "PARENT_BRAND");
                if (_checkParentBrandData.data.length > 0) {
                    req.body.params["PARENT_BRAND_CD"] = _checkParentBrandData.data[0].PARENT_BRAND_CD
                } else {
                    let _seqParenBrandResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'ParentBrand' }, "monography", req);
                    if (!(_seqParenBrandResp && _seqParenBrandResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
                    }
                    req.body.params["PARENT_BRAND_CD"] = _seqParenBrandResp.data
                }


                if (req.body.params.BRAND_EXTENSION_NAME != "") {
                    let _checkBrandExtData = await commonCheckExitOrNot(_collectionName, req, _filter, "CHECKBRAND", "BRAND_EXTENSION_NAME");
                    if (_checkBrandExtData.data.length > 0) {
                        req.body.params["BRAND_EXTENSION_CD"] = _checkBrandExtData.data[0].BRAND_EXTENSION_CD
                    } else {
                        let _seqBrandextnResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'BrandExtension' }, "monography", req);
                        if (!(_seqBrandextnResp && _seqBrandextnResp.success)) {
                            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
                        }
                        req.body.params["BRAND_EXTENSION_CD"] = _seqBrandextnResp.data
                    }
                } else {
                    req.body.params["BRAND_EXTENSION_CD"] = ""
                }


                //  req.body.params["BRAND_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" })
            }
        } else if (req.body.params.flag == "DD_PRODUCT") {
            _collectionName = "dd_product_master"
            delete req.body.params.flag;
            _filter.filter["DOSE_FORM_CD"] = req.body.params.DOSE_FORM_CD
            let _doseFormData = await _mUtils.commonMonogoCall(`monography_dose_form_map`, "find", _filter, "", "", "", "")
            if (!(_doseFormData && _doseFormData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _doseFormData.desc || "", data: _doseFormData.data || [] });
            }
            if (_doseFormData.data.length > 0) {
                req.body.params["BDF_CD"] = _doseFormData.data[0].BDF_CODE ? _doseFormData.data[0].BDF_CODE : "";
                req.body.params["BDF_NAME"] = _doseFormData.data[0].BDF_NAME ? _doseFormData.data[0].BDF_NAME : "";
                req.body.params["IS_NAME"] = _doseFormData.data[0].IS_NAME ? _doseFormData.data[0].IS_NAME : "";
                req.body.params["IS_CD"] = _doseFormData.data[0].IS_CODE ? _doseFormData.data[0].IS_CODE : "";
                req.body.params["DAM_CD"] = _doseFormData.data[0].DAM_CODE ? _doseFormData.data[0].DAM_CODE : "";
                req.body.params["DAM_NAME"] = _doseFormData.data[0].DAM_NAME ? _doseFormData.data[0].DAM_NAME : "";
                req.body.params["ROA_CD"] = _doseFormData.data[0].ROA_CODE ? _doseFormData.data[0].ROA_CODE : "";
                req.body.params["ROA_NAME"] = _doseFormData.data[0].ROA_NAME ? _doseFormData.data[0].ROA_NAME : "";
                req.body.params["RNS_CD"] = _doseFormData.data[0].RNS_CODE ? _doseFormData.data[0].RNS_CODE : "";
                req.body.params["RNS_NAME"] = _doseFormData.data[0].RNS_NAME ? _doseFormData.data[0].RNS_NAME : "";
            }
            let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_exitData.code == 1) {
                req.body.params["DD_PRODUCT_MASTER_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                if (req.body.params.STRING_1 && req.body.params.STRING_1 != "") {
                    let _seqString1 = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'String1' }, "monography", req);
                    if (!(_seqString1 && _seqString1.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _seqString1.desc || "", data: _seqString1.data || [] });
                    }
                    req.body.params['STRING_1_CD'] = Object.keys(_seqString1.data).length > 0 ? _seqString1.data : "";
                }
                if (req.body.params.STRING_2 && req.body.params.STRING_2 != "") {
                    let _seqString2 = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'String2' }, "monography", req);
                    if (!(_seqString2 && _seqString2.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _seqString2.desc || "", data: _seqString2.data || [] });
                    }
                    req.body.params['STRING_2_CD'] = Object.keys(_seqString2.data).length > 0 ? _seqString2.data : "";
                }
                if (req.body.params.STRING_3 && req.body.params.STRING_3 != "") {
                    let _seqString3 = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'String3' }, "monography", req);
                    if (!(_seqString3 && _seqString3.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _seqString3.desc || "", data: _seqString3.data || [] });
                    }
                    req.body.params['STRING_3_CD'] = Object.keys(_seqString3.data).length > 0 ? _seqString3.data : "";
                }
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }

        } else if (req.body.params.flag == "ENTITY") {
            _collectionName = "entity"
            delete req.body.params.flag;
        } else if (req.body.params.flag == "VALIDATE_BRAND_PRODUCT") {
            delete req.body.params.flag;
            _.each(req.body.params, (_v, _k) => {
                // if (_k != "_id" && _k != "audit" && _k != "history" && _k != "revNo" && _k != "REMARKS" && _k != "COMPANY_CD" && _k != "COMPANY_NAME" && _k != "VOLUME_CD" && _k != "VOLUME_NAME" && _k != "SOURCE_DATA" && _k != "BRAND_STRING3_XML" 
                // && _k != "BRAND_CUSTOM_XML" && _k != "BRAND_FINAL_XML" && _k != "BRAND_STRING2_XML" && _k != "BRAND_STRING1_XML" && _k != "BRAND_PRODUCT_MAP_ID" && _k != "BRAND_PRODUCT_MAP_CD" 
                // && _k != "BRAND_DRUG_FINAL"  && _k != "BRAND_FINAL" && _k != "BRAND_STRING3" ) 
                if (_k == "BRAND_DISPLAY_NAME" || _k == "BRAND_MASTER_ID" || _k == "BRAND_STRING1" || _k == "BRAND_STRING2" || _k == "DOSE_FORM_CD" || _k == "FLAVOUR_CD" || _k == "METRL_TYPE_CD" || _k == "STRENGTH_MASTER_CD" || _k == "STRG_CNDTN_CD" || _k == "THERAPY_CD" || _k == "USE_CD" || _k == "AGE_GEN_CD") {
                    _filter.filter[_k] = _v
                }
            })
            let _mResp = await _mUtils.commonMonogoCall(`monography_brand_product_mapping`, "find", _filter, "", "", "", "");
            if (_mResp.data.length > 0) {
                if (_mResp.data[0].COMPANY_CD != req.body.params.COMPANY_CD && _mResp.data[0].VOLUME_CD != req.body.params.VOLUME_CD) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist", message: "ALL PARAMETERS SAME IN THE EXISTING  PREVIOUS RECORDS EXCEPT PACKAGE INFO AND COMPANY MASTER" });
                } else if (_mResp.data[0].COMPANY_CD != req.body.params.COMPANY_CD) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist", message: "ALL PARAMETERS SAME IN THE EXISTING  PREVIOUS RECORDS EXCEPT COMPANY_MASTER" });
                } else if (_mResp.data[0].VOLUME_CD != req.body.params.VOLUME_CD) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist", message: "ALL PARAMETERS SAME IN THE EXISTING  PREVIOUS RECORDS EXCEPT PACKAGE INFO" });
                } else if (_mResp.data[0].COMPANY_CD == req.body.params.COMPANY_CD && _mResp.data[0].VOLUME_CD == req.body.params.VOLUME_CD) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist", message: "ALL PARAMETERS ARE  MATCHED WITH EXISTING PREVIOUS RECORDS" });
                }
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist", message: "ALL PARAMETERS ARE NOT MATCHED WITH EXISTING PREVIOUS RECORDS" });
            }
        } else if (req.body.params.flag == "BRAND_PRODUCT") {
            _collectionName = "brand_product_mapping"
            delete req.body.params.flag
            delete req.body.params.sequenceName
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["BRAND_PRODUCT_MAP_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
                req.body.params["BRAND_STRING1_CD"] = req.body.params.BRAND_STRING1 && req.body.params.BRAND_STRING1 != "" ? await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Brandproduct1' }, "monography", req).then((_obj) => { return _obj.data }) : "";
                req.body.params["BRAND_STRING2_CD"] = req.body.params.BRAND_STRING2 && req.body.params.BRAND_STRING2 != "" ? await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Brandproduct2' }, "monography", req).then((_obj) => { return _obj.data }) : "";
                req.body.params["BRAND_STRING3_CD"] = req.body.params.BRAND_STRING3 && req.body.params.BRAND_STRING3 != "" ? await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Brandproduct3' }, "monography", req).then((_obj) => { return _obj.data }) : "";
                req.body.params["BRAND_CUSTOM_CD"] = req.body.params.BRAND_CUSTOM && req.body.params.BRAND_CUSTOM != "" ? await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Brandproductcustom' }, "monography", req).then((_obj) => { return _obj.data }) : "";


                let _filter = {
                    "filter": {
                        "recStatus": { $eq: true },
                        "BRAND_MASTER_ID": req.body.params.BRAND_MASTER_ID
                    }
                }
                let _mRespDatabrand = await _mUtils.commonMonogoCall(`monography_brand`, "find", _filter, "", "", "", "")
                if (!(_mRespDatabrand && _mRespDatabrand.success)) {
                    // return res.status(400).json({ success: false, status: 400, desc: _mRespDatabrand.desc || "", data: _mRespDatabrand.data || [] });
                } else {
                    req.body.params['BRAND_CD'] = _mRespDatabrand.data[0].BRAND_CD ? _mRespDatabrand.data[0].BRAND_CD : "";
                    req.body.params['BRAND_NAME'] = _mRespDatabrand.data[0].BRAND_NAME ? _mRespDatabrand.data[0].BRAND_NAME : "";
                    req.body.params['PARENT_BRAND_CD'] = _mRespDatabrand.data[0].PARENT_BRAND_CD ? _mRespDatabrand.data[0].PARENT_BRAND_CD : "";
                    req.body.params['PARENT_BRAND'] = _mRespDatabrand.data[0].PARENT_BRAND ? _mRespDatabrand.data[0].PARENT_BRAND : "";
                    req.body.params['BRAND_EXTENSION_CD'] = _mRespDatabrand.data[0].BRAND_EXTENSION_CD ? _mRespDatabrand.data[0].BRAND_EXTENSION_CD : "";
                    req.body.params['BRAND_EXTENSION_NAME'] = _mRespDatabrand.data[0].BRAND_EXTENSION_NAME ? _mRespDatabrand.data[0].BRAND_EXTENSION_NAME : "";
                    // _output.push(_data[_idx])
                   // console.log(req.body.params)
                }
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "CLASS_NAME") {
            _collectionName = "class_name"
            delete req.body.params.flag
            let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            if (_existData.code == 1) {
                req.body.params["CLASS_NAME_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            } else {
                return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
            }
        } else if (req.body.params.flag == "DD_SUBSTANCE_CLASSIFICATIONS") {
            _collectionName = "dd_substance_classifications"
            delete req.body.params.flag
            let _insertOrUpdate = await insertOrUpdate(req.body.params.JSON, 0, [], req, res, _collectionName)
            return res.status(200).json({ success: true, status: 200, desc: '', data: _insertOrUpdate.data });
            // let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
            // if (_existData.code == 1) {
            //     req.body.params["DD_SUBSTANCE_CLS_CD"] = Object.keys(_seqResp.data).length > 0 ? _seqResp.data : "";
            // } else {
            //     
            // }
        } else if (req.body.params.flag == "DRUG_INTERACTIONS") {
            let parent_data;
            let _finalJsonData = [];
            _filter['sort'] = "DRUG_IN_PARENT_ID"
            _filter['limit'] = 1;
            if (req.body.params.JSON1 && req.body.params.JSON1.length > 0 && req.body.params.JSON && req.body.params.JSON.length > 0) {
                // let _exitData = await commonCheckExitOrNot("drugparentinteraction", req, _filter, "GETALL", "findCount");
                let _child_data = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "find", _filter, "", "", "", "");
                req.body.params.JSON1[0]['DRUG_IN_PARENT_ID'] = JSON.parse(JSON.stringify(_child_data.data))[0].DRUG_IN_PARENT_ID + 1
                parent_data = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "insertMany", req.body.params.JSON1, "", "", "", "")
                if (!(parent_data && parent_data.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: parent_data.desc || "", data: parent_data.data || [] });
                }

                if (parent_data.data.length > 0) {
                    _.each(req.body.params.JSON, (_o, _i) => {
                        _o['DRUG_IN_PARENT_ID'] = parent_data.data[0].DRUG_IN_PARENT_ID
                        _o['DRUG_IN_PARENT_MONGO_ID'] = parent_data.data[0]._id
                        _finalJsonData.push(_o)
                    })
                    let _child_data = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "insertMany", _finalJsonData, "", "", "", "")
                    if (!(_child_data && _child_data.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _child_data.desc || "", data: _child_data.data || [] });
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: parent_data.data });

                }

            } else {
                return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
            }
        } else if (req.body.params.flag == "ICD") {
            _collectionName = "icdmaster"
            delete req.body.params.flag

        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
        }

        mongoMapper(`monography_${_collectionName}`, req.body.query, req.body.params, req.tokenData.dbType).then((result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        return res.status(400).json({ success: false, status: 400, desc: error, data: [] });
    }
})

async function addionbranddisplaycd(_data, _idx, _output, req) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true }
                    // "BRAND_DISPLAY_NAME": _data[_idx].BRAND_DISPLAY_NAME
                }
            }
            // let _mRespDatabrand = await _mUtils.commonMonogoCall(`monography_brand`, "find", _filter, "", "", "", "")
            // if (!(_mRespDatabrand && _mRespDatabrand.success)) {
            //     // return res.status(400).json({ success: false, status: 400, desc: _mRespDatabrand.desc || "", data: _mRespDatabrand.data || [] });
            // } else {
            //     _data[_idx]['BRAND_DISPLAY_CD'] = _mRespDatabrand.data.length > 0 && _mRespDatabrand.data[0].BRAND_DISPLAY_CD ? _mRespDatabrand.data[0].BRAND_DISPLAY_CD : "";
            //     // _output.push(_data[_idx])
            // }

            // //product also joing here
            // delete _filter.filter.BRAND_DISPLAY_NAME
            _filter.filter['STRING_3_CD'] = _data[_idx].STRING_3_CD
            let _mRespDataProduct = await _mUtils.commonMonogoCall(`monography_dd_product_master`, "find", _filter, "", "", "", "")
            if (!(_mRespDataProduct && _mRespDataProduct.success)) {
                // return res.status(400).json({ success: false, status: 400, desc: _mRespDataProduct.desc || "", data: _mRespDataProduct.data || [] });
            } else {
                _data[_idx]['DD_PRODUCT_MASTER_CD'] = _mRespDataProduct.data.length > 0 && _mRespDataProduct.data[0].DD_PRODUCT_MASTER_CD ? _mRespDataProduct.data[0].DD_PRODUCT_MASTER_CD : "";
                _output.push(_data[_idx])
            }
            //PRODUCT CODE JOIN ENDING



            _idx = _idx + 1
            await addionbranddisplaycd(_data, _idx, _output, req)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {

    }
}

/**get masters data */
router.post("/get-master-data", async (req, res) => {
    try {
        let _collectionName = "";
        let _filter = {
            "filter": {
                // "recStatus": { $eq: req.body.params.recStatus}
            }
        }

        _filter.filter['recStatus'] = req.body.params.hasOwnProperty('recStatus') ? { $eq: req.body.params.recStatus } : { $eq: true };
        if (req.body.params.fromDt) {
            if (req.body.params.toDt) {
                _filter.filter["audit.documentedDt"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.toDt).setHours(23, 59, 59, 999)).toISOString() }
            } else {
                _filter.filter["audit.documentedDt"] = { $gte: new Date(new Date(req.body.params.fromDt).setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date(req.body.params.fromDt).setHours(23, 59, 59, 999)).toISOString() }
            }
        }
        let _mdrpData;
        let _finalCountData = {}
        if (req.body.params.flag == "UOM") {
            _collectionName = "uoms";
            delete req.body.params.flag;
            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            let _data = []
            let _finalCountData = {};
            if (req.body.params.flag1 === "L0") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L0_CODE')
                    .map((_v, _k) => {
                        if (_k != "") {
                            _data.push({
                                UOM_L0_CODE: _k,
                                UOM_L0_NAME: _v[0].UOM_L0_NAME
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 === "L1") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L0_CODE')
                    .map((_v, _k) => {
                        if (_k != "" && _k == req.body.params.code) {
                            let _groupBy = _.groupBy(_v, 'UOM_L1_CODE')
                            _.map(_groupBy, (_v1, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        UOM_L1_CODE: _k1,
                                        UOM_L1_NAME: _v1[0].UOM_L1_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 === "L2") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L1_CODE')
                    .map((_v, _k) => {
                        if (_k != "" && _k == req.body.params.code) {
                            let _groupBy = _.groupBy(_v, 'UOM_L2_CODE')
                            _.map(_groupBy, (_v1, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        UOM_L2_CODE: _k1,
                                        UOM_L2_NAME: _v1[0].UOM_L2_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 === "L3") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L2_CODE')
                    .map((_v, _k) => {
                        if (_k != "" && _k == req.body.params.code) {
                            let _groupBy = _.groupBy(_v, 'UOM_L3_CODE')
                            _.map(_groupBy, (_v1, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        UOM_L3_CODE: _k1,
                                        UOM_L3_NAME: _v1[0].UOM_L3_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 === "L4") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L3_CODE')
                    .map((_v, _k) => {
                        if (_k != "" && _k == req.body.params.code) {
                            let _groupBy = _.groupBy(_v, 'UOM_L4_CODE')
                            _.map(_groupBy, (_v1, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        UOM_L4_CODE: _k1,
                                        UOM_L4_NAME: _v1[0].UOM_L4_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 === "L5") {
                let _uomData = _.chain(_mRespData.data).groupBy('UOM_L4_CODE')
                    .map((_v, _k) => {
                        if (_k != "" && _k == req.body.params.code) {
                            let _groupBy = _.groupBy(_v, 'UOM_L5_CODE')
                            _.map(_groupBy, (_v1, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        UOM_L5_CODE: _k1,
                                        UOM_L5_NAME: _v1[0].UOM_L5_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["UOM_CD", "UOM_L0_CODE", "UOM_L0_NAME", "UOM_L1_CODE", "UOM_L1_NAME", "UOM_L2_CODE", "UOM_L2_NAME", "UOM_L3_CODE", "UOM_L3_NAME", "UOM_L4_CODE", "UOM_L4_NAME", "UOM_L5_CODE", "UOM_L5_NAME", "UOM_ALL_CODE", "UOM_ALL_NAME", "DISPLAY_NAME", "ALTERNATIVE_NAME", "REMARKS"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "EXIST") {
                delete req.body.params.UOM_CD
                delete req.body.params.flag1
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _exitData.data });
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
            }
        } else if (req.body.params.flag == "NUM") {
            _collectionName = "numbers";
            delete req.body.params.flag
            if (req.body.params.flag1 == "ALL") {
                delete req.body.params.flag1
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
                _.filter.filter = {}
                _.filter.filter = {
                    $or: [
                        { "NUMBER_CD": nameExp },
                        { "NUM_L1_CODE": nameExp },
                        { "NUM_L1_NAME": nameExp },
                        { "NUM_L2_CODE": nameExp },
                        { "NUM_L2_NAME": nameExp },
                        { "NUM_ALL_CODE": nameExp },
                        { "NUM_ALL_NAME": nameExp },
                        { "DISPLAY_NAME": nameExp },
                        { "REMARKS": nameExp },
                    ],
                    //  "type": req.body.params.type
                }
            } else if (req.body.params.flag1 == "EXSH") {
                _.filter.filter = {};
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' }
                _filter.filter["NUM_ALL_NAME"] = nameExp;
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["NUMBER_CD", "NUM_L1_CODE", "NUM_L1_NAME", "NUM_L2_CODE", "NUM_L2_NAME", "NUM_ALL_CODE", "NUM_ALL_NAME", "DISPLAY_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "L1") {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }

                let _data = []
                let _L1Names = _.chain(_mRespData.data).groupBy('NUM_L1_CODE')
                    .map((_d, _k) => {
                        if (_k != "") {
                            _data.push({
                                NUM_L1_CODE: _k,
                                NUM_L1_NAME: _d[0].NUM_L1_NAME
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 == "L2") {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }

                let _data = []
                // let _groupData = req.body.params.NUM_L1_CODE
                let _L1Names = _.chain(_mRespData.data).groupBy('NUM_L1_CODE')
                    .map((_d, _k) => {
                        if (_k != "" && _k === req.body.params.NUM_L1_CODE) {
                            let _groupData = _.groupBy(_d, 'NUM_L2_CODE')
                            _.map(_groupData, (_v, _k1) => {
                                if (_k1 != "") {
                                    _data.push({
                                        NUM_L1_CODE: _k,
                                        NUM_L2_CODE: _k1,
                                        NUM_L2_NAME: _v[0].NUM_L2_NAME
                                    })
                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 == "L3") {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _data = [];
                let _L1Names = _.chain(_mRespData.data).groupBy('NUM_L1_CODE')
                    .map((_d, _k) => {
                        if (_k != "" && _k === req.body.params.NUM_L1_CODE) {
                            let _groupData = _.groupBy(_d, 'NUM_L2_CODE')
                            _.map(_groupData, (_v, _k1) => {
                                if (_k1 != "" && _k1 == req.body.params.NUM_L2_CODE) {
                                    let _L2GroupData = _.groupBy(_v, 'NUM_ALL_CODE')
                                    _.map(_L2GroupData, (_v1, _k2) => {
                                        _data.push({
                                            NUM_ALL_CODE: _k2,
                                            NUM_ALL_NAME: _v1[0].NUM_ALL_NAME
                                        })
                                    })

                                }
                            })
                        }
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 == "EXIST") {
                delete req.body.params.NUMBER_CD
                delete req.body.params.flag1
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _exitData.data });
            }

            // mongoMapper("monography_numbers", req.body.query, _filter, req.tokenData.dbType).then((result) => {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            // }).catch((error) => {
            //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            // });
        } else if (req.body.params.flag == "IS") {
            _collectionName = "intendedsites";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                let _totalIsAddingData = []
                delete req.body.params.flag1;
                let _columnNames = ["INTENDED_SITE_CD", "IS_L1_CODE", "IS_L1_NAME", "IS_L2_CODE", "IS_L2_NAME", "IS_L3_CODE", "IS_L3_NAME", "IS_ALL_CODE", "IS_ALL_NAME", "DISPLAY_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames);
                _.each(JSON.parse(JSON.stringify(_totaldata.data)), (_obj, _indx) => {
                    _obj['SUV_IS_ALL_CODE'] = "IS" + _obj.IS_ALL_CODE
                    _obj['SUV_IS_ALL_NAME'] = _obj.IS_ALL_NAME
                    _totalIsAddingData.push(_obj)
                })
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totalIsAddingData
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }

                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "IS_L1_CODE", "IS_L1_NAME", "IS_L2_CODE", "IS_L2_NAME", "IS_L3_CODE", "IS_L3_NAME", "IS_ALL_CODE", "IS_ALL_NAME", "", "")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _commonDropData.data });
            }
        } else if (req.body.params.flag == "ROA") {
            _collectionName = "routeofadministrations";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["ROUTE_OF_ADMINISTRATION_CD", "ROA_L1_CODE", "ROA_L1_NAME", "ROA_L2_CODE", "ROA_L2_NAME", "ROA_ALL_CODE", "ROA_ALL_NAME", "DISPLAY_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }

                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "ROA_L1_CODE", "ROA_L1_NAME", "ROA_L2_CODE", "ROA_L2_NAME", "ROA_ALL_CODE", "ROA_ALL_NAME", "", "", "", "")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _commonDropData.data });
            }
        } else if (req.body.params.flag == "WAS") {
            _collectionName = "whoatcs";
            delete req.body.params.flag;
            // mongoMapper(`monography_${_collectionName}`, "find",_filter, req.tokenData.dbType).then(async (result) => {
            //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            // }).catch((error) => {
            //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            // });

            let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["UNIQUE_CODE_ATC", "FL_CD", "FL_NAME", "SL_CD", "SL_NAME", "TL_CD", "TL_NAME", "FTL_CD", "FTL_NAME", "ATC_CODE", "ATC_LEVEL_NAME", "UNIT", "ADM_R", "COMMENT", "CLASS_TYPE", "UNII_CODE", "UNII_NAME", "SNOMED", "SNOMED_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    let _totalManupulateData = [];
                    _.each(_totaldata.data, (obj, indx) => {
                        _totalManupulateData.push({
                            _id: obj._id ? obj._id : "",
                            FL1_CD: obj.FL_CD ? obj.FL_CD : "",
                            FL1_NAME: obj.FL_NAME ? obj.FL_NAME : "",
                            SL2_CD: obj.SL_CD ? obj.SL_CD : "",
                            SL2_NAME: obj.SL_NAME ? obj.SL_NAME : "",
                            TL3_CD: obj.TL_CD ? obj.TL_CD : "",
                            TL3_NAME: obj.TL_NAME ? obj.TL_NAME : "",
                            FTL4_CD: obj.FTL_CD ? obj.FTL_CD : "",
                            FTL4_NAME: obj.FTL_NAME ? obj.FTL_NAME : "",
                            ATCL5_CODE: obj.ATC_CODE ? obj.ATC_CODE : "",
                            ATCL5_LEVEL_NAME: obj.ATC_LEVEL_NAME ? obj.ATC_LEVEL_NAME : "",
                            ADM_R: obj.ADM_R ? obj.ADM_R : "",
                            UNIT: obj.UNIT ? obj.UNIT : "",
                            UNIQUE_CODE_ATC: obj.UNIQUE_CODE_ATC ? obj.UNIQUE_CODE_ATC : "",
                            NO: obj.NO ? obj.NO : "",
                            SIZE: obj.SIZE ? obj.SIZE : "",
                            DDD: parseFloat(obj.DDD),
                            COMMENT: obj.COMMENT ? obj.COMMENT : "",
                            CLASS_TYPE: obj.CLASS_TYPE ? obj.CLASS_TYPE : "",
                            UNII_CODE: obj.UNII_CODE ? obj.UNII_CODE : "",
                            UNII_NAME: obj.UNII_NAME ? obj.UNII_NAME : "",
                            SNOMED: obj.SNOMED ? obj.SNOMED : "",
                            SNOMED_NAME: obj.SNOMED_NAME ? obj.SNOMED_NAME : "",
                            REMARKS: obj.REMARKS ? obj.REMARKS : "",
                            audit: obj.audit ? obj.audit : "",
                            revNo: obj.revNo ? obj.revNo : "",

                        })
                    })

                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totalManupulateData
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "L0" || req.body.params.flag1 == "L1" || req.body.params.flag1 == "L2" || req.body.params.flag1 == "L3" || req.body.params.flag1 == "L4") {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }

                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "FL_CD", "FL_NAME", "SL_CD", "SL_NAME", "TL_CD", "TL_NAME", "FTL_CD", "FTL_NAME", "ATC_CODE", "ATC_LEVEL_NAME")
                let _getWasData = [];
                if (_commonDropData.data.length > 0) {
                    _.each(_commonDropData.data, (_obj, _indx) => {
                        if (Object.keys(_obj)[0] == "FL_CD" && Object.keys(_obj)[1] == "FL_NAME") {
                            _getWasData.push({
                                FL1_CD: _obj.FL_CD ? _obj.FL_CD : "",
                                FL1_NAME: _obj.FL_NAME ? _obj.FL_NAME : ""
                            })
                        } else if (Object.keys(_obj)[0] == "SL_CD" && Object.keys(_obj)[1] == "SL_NAME") {
                            _getWasData.push({
                                SL2_CD: _obj.SL_CD ? _obj.SL_CD : "",
                                SL2_NAME: _obj.SL_NAME ? _obj.SL_NAME : ""
                            })
                        } else if (Object.keys(_obj)[0] == "TL_CD" && Object.keys(_obj)[1] == "TL_NAME") {
                            _getWasData.push({
                                TL3_CD: _obj.TL_CD ? _obj.TL_CD : "",
                                TL3_NAME: _obj.TL_NAME ? _obj.TL_NAME : ""
                            })
                        } else if (Object.keys(_obj)[0] == "FTL_CD" && Object.keys(_obj)[1] == "FTL_NAME") {
                            _getWasData.push({
                                FTL4_CD: _obj.FTL_CD ? _obj.FTL_CD : "",
                                FTL4_NAME: _obj.FTL_NAME ? _obj.FTL_NAME : ""
                            })
                        } else if (Object.keys(_obj)[0] == "ATC_CODE" && Object.keys(_obj)[1] == "ATC_LEVEL_NAME") {
                            _getWasData.push({
                                ATCL5_CODE: _obj.ATC_CODE ? _obj.ATC_CODE : "",
                                ATCL5_LEVEL_NAME: _obj.ATC_LEVEL_NAME ? _obj.ATC_LEVEL_NAME : ""
                            })
                        }
                    })
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _getWasData });
            } else if (req.body.params.flag1 == "ADM") {
                _filter.filter['ADM_R'] = { $ne: "" }
                let _mAdmData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
                if (!(_mAdmData && _mAdmData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mAdmData.desc || "", data: _mAdmData.data || [] });
                }
                let _finalAdmData = []
                let _admData = _.chain(_mAdmData.data).groupBy("ADM_R")
                    .map((_v, _k) => {
                        _finalAdmData.push(_v[0])
                    }).value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalAdmData });
            }
        } else if (req.body.params.flag == "INN") {
            _collectionName = "inns";
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["UNII", "PT", "INN_ID", "INN_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }
        } else if (req.body.params.flag == "REL") {
            _collectionName = "releases";
            let _finalReleaseData = []
            let _data = []

            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DRUG_RELEASE_CD", "RL_L1_CODE", "RL_L1_NAME", "RL_L2_CODE", "RL_L2_NAME", "RL_L3_CODE", "RL_L3_NAME", "RL_L4_CODE", "RL_L4_NAME", "RL_ALL_CODE", "RL_ALL_NAME", "DISPLAY_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "RL_L1_CODE", "RL_L1_NAME", "RL_L2_CODE", "RL_L2_NAME", "RL_L3_CODE", "RL_L3_NAME", "RL_L4_CODE", "RL_L4_NAME", "RL_ALL_CODE", "RL_ALL_NAME")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _commonDropData.data });
            }
        } else if (req.body.params.flag == "UNII") {
            _collectionName = "uniis";
            delete req.body.params.flag;
            // let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
            // if (!(_mRespData && _mRespData.success)) {
            //     return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            // }
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["UNII", "PT", "RN", "EC", "NCIT", "RXCUI", "PUBCHEM", "ITIS", "NCBI", "PLANTS", "GRIN", "MPNS", "INN_ID", "USAN_ID", "MF", "INCHIKEY", "SMILES", "INGREDIENT_TYPE", "UUID", "SUBSTANCE_TYPE", "DAILYMED"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }
        } else if (req.body.params.flag == "SNOWMED") {
            _collectionName = "snowmeds";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["IDENTIFIER_SUBSTANCE", "SUBSTANCE_NAME", "CAS_NUMBER", "UNII", "SUBSTANCE_DESRIPTION", "MOLECULAR_WEIGHT", "TOXICITY", "SMILE", "INCHI", "IUPAC_NAME", "MOLECULAR_FORMULA"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }
        } else if (req.body.params.flag == "BDF") {
            _collectionName = "bdf";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["BASIC_DOSE_FORM_CD", "DISPLAY_NAME", "BDF_L1_CODE", "BDF_L1_NAME", "BDF_L2_CODE", "BDF_L2_NAME", "BDF_L3_CODE", "BDF_L3_NAME", "BDF_ALL_CODE", "BDF_ALL_NAME", "IS_JSON", "DAM_JSON", "ROA_JSON", "RNS_JSON"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "BDF_L1_CODE", "BDF_L1_NAME", "BDF_L2_CODE", "BDF_L2_NAME", "BDF_L3_CODE", "BDF_L3_NAME", "BDF_ALL_CODE", "BDF_ALL_NAME", "", "")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _commonDropData.data });
            }
        } else if (req.body.params.flag == "DAM") {
            _collectionName = "dam";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DOSE_FORM_ADMINISTRATION_METHOD_CD", "DAM_METHOD_CODE", "DAM_METHOD_NAME", "DAM_ALL_CODE", "DAM_ALL_NAME", "DAM_L1_CODE", "DAM_L1_NAME", "DAM_L2_CODE", "DAM_L2_NAME", "DISPLAY_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _finalData = JSON.parse(JSON.stringify(_mRespData.data))
                let _commonDropData = await commonDropdownData(_finalData, req, "DAM_L1_CODE", "DAM_L1_NAME", "DAM_L2_CODE", "DAM_L2_NAME", "DAM_ALL_CODE", "DAM_ALL_NAME", "", "", "", "")
                return res.status(200).json({ success: true, status: 200, desc: '', data: _commonDropData.data });
            }
        } else if (req.body.params.flag == "DD_SUBSTANCE") {
            _collectionName = "substance";
            delete req.body.params.flag;
            if (req.body.params.flag1 === "DRPDATA") {
                let _mdrpData;
                if (req.body.params.MASTER_NAME == "") {
                    let _colNames = ["whoatcs", "snowmeds", "uniis", "inns"]
                    _mdrpData = await dropdowndata(_colNames, 0, [], req, _filter, res)
                } else {
                    _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                }

                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 === "L0") {
                let _colNames = ["whoatcs", "snowmeds", "uniis", "inns"]
                let _mdrpData = await dropdownGetdata(_colNames, 0, [], req, _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 === "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DD_SUBSTANCE_CD", "DD_SUBSTANCE_NAME", "DD_WHO_REF", "UNII", "UNII_NAME", "UNIQUE_CD_ATC"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }
        } else if (req.body.params.flag == "DD_SUBSTANCE_COMB") {
            _collectionName = "dd_substance_combination";
            delete req.body.params.flag;
            if (req.body.params.flag1 === "DRPDATA") {
                if (req.body.params.MASTER_NAME == "") {
                    let _colNames = ["whoatcs", "snowmeds", "uniis", "inns"]
                    _mdrpData = await dropdowndata(_colNames, 0, [], req, _filter, res)
                } else {
                    _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 === "L0") {
                if (req.body.params.MASTER_NAME == "") {
                    let _colNames = ["snowmeds", "uniis", "inns", "whoatcs"]
                    _mdrpData = await dropdownGetdata(_colNames, 0, [], req, _filter, res)
                } else {
                    _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data[0] });
            } else if (req.body.params.flag1 === "GETALL") {
                delete req.body.params.flag;
                let _columnNames = ["DD_SUBSTANCE_COMB_CD", "DD_SUBSTANCE_COMB_NAME", "DD_SUBSTANCE_COMB_REF", "DD_SUBSTANCE_CD", "DD_SUBSTANCE_NAME", "DD_SUBSTANCE_REF", "DD_SUBSTANCE_COMB_REF_CODE", "UNII", "UNII_NAME", "UNIQUE_CODE_ATC", "IDENTIFIER", "SUBSTANCE_NAME", "FL1_CD", "FL1_NAME", "SL2_CD", "SL2_NAME", "TL3_CD", "TL3_NAME", "FTL4_CD", "FTL4_NAME", "ATCL5_CODE", "ATCL5_LEVEL_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 === "DS") {
                delete req.body.params.flag1
                let _mRespData = await _mUtils.commonMonogoCall(`monography_substance`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _data = []
                let _finalCountData = {};
                if (_mRespData.data.length > 0) {
                    let _uomData = _.chain(_mRespData.data).groupBy('DD_SUBSTANCE_NAME')
                        .map((_v, _k) => {
                            if (_k != "") {
                                _data.push({
                                    DD_SUBSTANCE_NAME: _k,
                                    DD_SUBSTANCE_CD: _v[0].DD_SUBSTANCE_CD,
                                    DD_SUBSTANCE_REF: _v[0].DD_WHO_REF
                                })
                            }
                        }).value();
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
                }
            } else if (req.body.params.flag1 === "EXTN") {
                delete req.body.params.flag1
                _filter.filter['DD_SUBSTANCE_NAME'] = req.body.params.searchValue
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_substance_combination`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData.data });
            }
        } else if (req.body.params.flag == "FLV") {
            _collectionName = "flavour";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["FLAVOUR_CD", "FDA_CODE", "FLAVOUR_NAME", "SYNONYM_1", "SYNONYM_1_CD", "SYNONYM_2", "SYNONYM_2_CD", "SYNONYM_3", "SYNONYM_3_CD"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }

        } else if (req.body.params.flag == "THE") {
            _collectionName = "theraphy";
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["THERAPY_CD", "THERAPY_NAME", "SYNONYM_1", "SYNONYM_1_CD", "SYNONYM_2", "SYNONYM_2_CD", "SYNONYM_3", "SYNONYM_3_CD"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }

        } else if (req.body.params.flag == "DOSE_FORM_MAP") {
            _collectionName = "dose_form_map";
            delete req.body.params.flag;
            let _finalCountData = {}
            if (req.body.params.flag1 === "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DOSE_FORM_CD", "IDENTIFIER", "BDF_NAME", "BDF_CODE", "IS_NAME", "IS_CODE", "DAM_NAME", "DAM_CODE", "ROA_NAME", "ROA_CODE", "RNS_NAME", "RNS_CODE", "DOSE_DEFAULT_NAME", "DOSE_DISPLAY_NAME", "ADDL_ATBR1", "REMARKS"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }

        } else if (req.body.params.flag == "STRENGTH") {
            _collectionName = "strength";
            delete req.body.params.flag;
            if (req.body.params.flag1 === "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["STRENGTH_MASTER_CD", "STRENGTH_NAME", "NUMERATOR_NUM_CD", "NUMERATOR_NUM_NAME", "NUMERATOR_UOM_CD", "NUMERATOR_UOM_NAME", "DENOMINATOR_NUM_CD", "DENOMINATOR_NUM_NAME", "DENOMINATOR_UOM_CD", "DENOMINATOR_UOM_NAME", "TYPE"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "UOM") {
                let _totalUomData = []
                let _mRespData = await _mUtils.commonMonogoCall(`monography_uoms`, "find", {}, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                } else {
                    let _distinctData = _.chain(_mRespData.data).groupBy('UOM_ALL_NAME')
                        .map((_d, _k) => {
                            if (_k != "") {
                                _totalUomData.push({
                                    DISPlAY_NAME: _d[0].ALTERNATIVE_NAME.length > 0 ? _d[0].ALTERNATIVE_NAME : _d[0].DISPLAY_NAME,
                                    UOM_CD: _d[0].UOM_CD
                                })
                            }
                        })
                        .value()
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _totalUomData });
                }
            }
        } else if (req.body.params.flag == "DMF") {
            _collectionName = "dd_substance_comb_mapping"
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                if (req.body.params.DD_SUBSTANCE_COMB_CD && req.body.params.DD_SUBSTANCE_COMB_CD != "") {
                    _filter.filter['DD_SUBSTANCE_COMB_CD'] = req.body.params.DD_SUBSTANCE_COMB_CD
                    let _mRespData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
                    if (!(_mRespData && _mRespData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData.data });
                } else {
                    delete req.body.params.flag1;
                    let _columnNames = ["DD_SUBSTANCE_CD", "DD_SUBSTANCE_NAME", "DD_SUBSTANCE_COMB_CD", "DD_SUBSTANCE_COMB_NAME", "DOSE_FORM_NAME", "DOSE_FORM_CD", "STRENGTH", "STRENGTH_CD", "DD_DRUG_MASTER_CD"]
                    let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                    let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                    if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                        _finalCountData = {
                            Table: _exitData.data,
                            Table1: _totaldata.data
                        }
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
                }

            }
        } else if (req.body.params.flag == "DD_DRUG_MASTER") {
            _collectionName = "dd_drug_master"
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DD_DRUG_MASTER_CD", "DD_SUBSTANCE_COMB_CD", "DD_SUBSTANCE_COMB_NAME", "DISPLAY_NAME", "PARENT_DRUG_ID", "PARENT_DRUG_CD", "DD_SUBSTANCE_CD", "DD_SUBSTANCE_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "L0") {
                delete req.body.params.flag1
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
                _filter.filter["DD_SUBSTANCE_COMB_NAME"] = nameExp
                _filter["limit"] = 20
              //  console.log(nameExp)
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_substance_combination`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData.data })
            }
        } else if (req.body.params.flag == "BRAND") {
            _collectionName = "brand";
            delete req.body.params.flag;
            let _finalCountData = {}
            if (req.body.params.flag1 === "DRPDATA") {
                delete req.body.params.flag1
                let _mRespData = await dropdownMasterWiseData(req, [], _filter, res)
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData.data })
            } else if (req.body.params.flag1 === "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["BRAND_CD", "IS_PARENT_BRAND", 'PARENT_BRAND', 'PARENT_BRAND_CD', "CDCI_CODE", "CIMS_CODE", 'CODE_2', 'BRAND_EXTENSION_CD', "BRAND_EXTENSION_NAME", "SYNONYM_1", "SYNONYM_1_CD", 'SYNONYM_2', 'SYNONYM_2_CD', 'DETAILING', 'BRAND_DISPLAY_NAME']
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData })
            } else if (req.body.params.flag1 = "L0") {

            }

        } else if (req.body.params.flag == "DD_PRODUCT") {
            _collectionName = "dd_product_master"
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["DD_PRODUCT_MASTER_CD", "DD_SUBSTANCE_COMB_CD", "DD_SUBSTANCE_COMB_NAME", "STRENGTH_CD", "STRENGTH", "VOLUME_CD", "VOLUME", "RELEASE_CD", "RELEASE", "DOSAGE_FORM_CD", "DOSAGE_FORM", "BDF_CD", "BDF_NAME", "IS_CD", "IS_NAME", "DAM_CD", "DAM_NAME", "ROA_CD", "ROA_NAME", "RNS_CD", "RNS_NAME", "DRUG_CLASS_CD", "DRUG_CLASS", "STRING_1_CD", "STRING_1", "STRING_2_CD", "STRING_2", "STRING_2_XML", "STRING_3_CD", "STRING_3", "STRING_3_XML", "DISPLAY_NAME_CD", "DISPLAY_NAME", "DISPLAY_NAME_XML", "DRUG_TYPE", "SOURCE_DATA", "BRAND_PRODUCT_MAP_CD", "IS_IMG", "DD_DRUG_MASTER_CD", "REMARKS"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "L0") {
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
                _filter.filter['DD_SUBSTANCE_COMB_CD'] = nameExp;
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_substance_comb_mapping`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _data = []
                if (_mRespData.data.length > 0) {
                    let _ddProductData = _.chain(_mRespData.data).groupBy("DOSE_FORM_CD")
                        .map((_v, _k) => {
                            if (_k != "") {
                                _data.push({
                                    "DOSE_FORM_CD": _k,
                                    "DOSE_FORM_NAME": _v[0].DOSE_FORM_NAME
                                })
                            }
                        })
                        .value();
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _data })
                }

            } else if (req.body.params.flag1 == "L1") {
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
                _filter.filter['DD_SUBSTANCE_COMB_CD'] = nameExp;
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_substance_comb_mapping`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _data = []
                if (_mRespData.data.length > 0) {
                    let _ddProductData = _.chain(_mRespData.data).groupBy("DOSE_FORM_CD")
                        .map((_v, _k) => {
                            if (_k != "" && _k == req.body.params.DOSE_FORM_CD) {
                                let _groupBy = _.groupBy(_v, "STRENGTH_CD")
                                _.map(_groupBy, (_v1, _k1) => {
                                    if (_k1 != "") {
                                        _data.push(
                                            {
                                                "STRENGTH_CD": _k1,
                                                "STRENGTH": _v1[0].STRENGTH
                                            }
                                        )
                                    }
                                })
                            }
                        })
                        .value();
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _data })
                }
            } else if (req.body.params.flag1 == "DMFDATA") {
                _filter.filter["DD_SUBSTANCE_COMB_CD"] = req.body.params.DD_SUBSTANCE_COMB_CD
                let _mDMFDATA = await _mUtils.commonMonogoCall('monography_dd_substance_comb_mapping', "find", _filter, "", "", "", "")
                if (!(_mDMFDATA && _mDMFDATA.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mDMFDATA.desc || "", data: _mDMFDATA.data || [] });
                }
                delete _filter.filter.DD_SUBSTANCE_COMB_CD
                let _totalData = []
                let _DMFDATA = await getDataBasedOnLooping1(_mDMFDATA.data, 0, [], req, _filter, 'dose_form_map');
                let _dmfDistinct = _.chain(_DMFDATA.data).groupBy('DOSE_FORM_CD')
                    .map((_v, _k) => {
                        if (_k != "") {
                            _totalData.push(_v[0])
                        }
                    })
                    .value();
                return res.status(200).json({ success: true, status: 200, desc: '', data: _totalData });
            } else if (req.body.params.flag1 == "MDPDRPDATA") {
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_drug_master`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                } else {
                    let _finalData = []
                    _.each(JSON.parse(JSON.stringify(_mRespData.data)), (_obj, _indx) => {
                        let _finalObj = {
                            MEDICINAL_NAME: _obj.DISPLAY_NAME != "" ? _obj.DISPLAY_NAME : _obj.DD_SUBSTANCE_COMB_NAME,
                            MEDICINAL_CODE: _obj.DD_SUBSTANCE_COMB_CD,
                            DD_DRUG_MASTER_CD: _obj.DD_DRUG_MASTER_CD
                        }
                        _finalData.push(_finalObj)
                    })
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                }
            }
        } else if (req.body.params.flag == "BRAND_PRODUCT") {
            _collectionName = "brand_product_mapping"
            delete req.body.params.flag;
            let _finalCountData = {};
            let _data = []
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "L0") {
                _filter.filter['TYPE'] = "PACKAGE_INFO"
                let _mRespData = await _mUtils.commonMonogoCall(`monography_strength`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                if (_mRespData.data.length > 0) {
                    let _strethData = _.chain(_mRespData.data).groupBy("STRENGTH_MASTER_CD")
                        .map((_v, _k) => {
                            if (_k != "") {
                                _data.push({
                                    VOLUMN_CD: _k,
                                    VOLUMN_NAME: _v[0].STRENGTH_NAME
                                })
                            }

                        })
                        .value();
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["BRAND_PRODUCT_MAP_CD", "PARENT_BRAND_CD", "PARENT_BRAND", "BRAND_CD", "BRAND_NAME", "BRAND_EXTENSION_CD", "BRAND_EXTENSION_NAME", "THERAPY_CD", "THERAPY_NAME", "FLAVOUR_CD", "FLAVOUR_NAME", "STRENGTH_CD", "STRENGTH_NAME", "VOLUME_CD", "VOLUME_NAME", "PACKAGE_INFO", "METRL_TYPE_CD", "METRL_TYPE_NAME", "DOSE_FORM_CD", "DOSE_FORM_NAME", "USE_CD", "USE_NAME", "STRG_CNDTN_CD", "STRG_CNDTN_NAME", "AGE_GEN_CD", "AGE_GEN_NAME", "COMPANY_CD", "COMPANY_NAME", "CDCI_CODE", "CDCI_NAME", "BRAND_STRING1_CD", "BRAND_STRING1", "BRAND_STRING2_CD", "BRAND_STRING2", "BRAND_STRING3_CD", "BRAND_STRING3", "STRING_3_CD", "BRAND_CUSTOM_CD", "BRAND_FINAL_CD", "BRAND_FINAL", "BRAND_DRUG_FINAL_CD", "BRAND_DRUG_FINAL", "IS_FORCEBLE_BRAND", "BRAND_DISPLAY_NAME", "BRAND_MASTER_ID"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames);
                let _addionbranddisplaycd = await addionbranddisplaycd(JSON.parse(JSON.stringify(_totaldata.data)), 0, [], req)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            } else if (req.body.params.flag1 == "L1") {
                let nameExp = { $regex: req.body.params.searchValue, $options: "i" }
                _filter.filter['BRAND_DISPLAY_NAME'] = nameExp
                let _mBrandDispData = await _mUtils.commonMonogoCall(`monography_brand`, "find", _filter, "", "", "", "")
                if (!(_mBrandDispData && _mBrandDispData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mBrandDispData.desc || "", data: _mBrandDispData.data || [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mBrandDispData.data });
            }
        } else if (req.body.params.flag == "CLASS_NAME") {
            _collectionName = "class_name"
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "GETALL") {

                delete req.body.params.flag1;
                let _columnNames = ["CLASS_NAME_CD", "CLASS_NAME", "CLASS_NAME_DESC", "REFERENCE_ID", "REFERENCE_NAME", "CLASS_SOURCE", "CLASS_SOURCE_CD", "CLASS_TYPE", "CLASS_TYPE_CD"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }

        } else if (req.body.params.flag == "DD_SUBSTANCE_CLASSIFICATIONS") {
            _collectionName = "dd_substance_classifications"
            delete req.body.params.flag;
            let _finalCountData = {};
            if (req.body.params.flag1 == "GETALL") {
                if (req.body.params.DD_SUBSTANCE_NAME && req.body.params.DD_SUBSTANCE_NAME != '') {
                    _filter.filter['DD_SUBSTANCE_NAME'] = req.body.params.DD_SUBSTANCE_NAME
                    let _msubclsData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
                    if (!(_msubclsData && _msubclsData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _msubclsData.desc || "", data: _msubclsData.data || [] });
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _msubclsData.data });
                } else {
                    delete req.body.params.flag1;
                    let _columnNames = ["DD_SUBSTANCE_CLS_CD", "DD_SUBSTANCE_CD", "DD_SUBSTANCE_NAME", "CLASS_NAME_CD", "CLASS_NAME", "PREFERABLE", "CMB_PREFERABLE"]
                    let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                    let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                    if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                        _finalCountData = {
                            Table: _exitData.data,
                            Table1: _totaldata.data
                        }
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });

                }
            }
        } else if (req.body.params.flag == "DRUG_INTERACTIONS") {
            _collectionName = "drugparentinteraction"
            delete req.body.params.flag;
            let _finalcountdata = {}
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            } else if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                _filter.filter['INT_ID'] = parseInt(req.body.params.type)
                let _columnNames = ["SRC_DRUG_CD", "SRC_DRUG_NAME", "IS_CD", "IS_NAME", "INT_TYPE_ID", "INT_TYPE_NAME", "INT_NAME", "IS_ASSIGNED", "INTERACTIONS", "REFERENCES", "STATUS", "TYPE", "CLASS_NAME_CD", "CLASS_NAME"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                if (req.body.params.type == 8) {
                    let indx = 0;
                    while (_totaldata.data.length > indx) {
                        if (_totaldata.data[indx].INT_TYPE_ID.startsWith("N")) {
                            let _filter = {
                                "filter": {
                                    "recStatus": { $eq: true },
                                    "REFERENCE_ID": _totaldata.data[indx].INT_TYPE_ID
                                }
                            }
                            let _mRespDatacls = await _mUtils.commonMonogoCall(`monography_class_name`, "find", _filter, "", "", "", "")
                            if (!(_mRespDatacls && _mRespDatacls.success)) {
                                // return res.status(400).json({ success: false, status: 400, desc: _mRespDatacls.desc || "", data: _mRespDatacls.data || [] });
                            } else {
                                JSON.parse(JSON.stringify(_totaldata.data[indx]))
                                _totaldata.data[indx]['INT_TYPE_NAME'] = _mRespDatacls.data.length > 0 && _mRespDatacls.data[0].CLASS_NAME ? _mRespDatacls.data[0].CLASS_NAME : "";
                                // _output.push(_data[_idx])
                            }
                        }
                        indx++
                    }
                }
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalcountdata = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalcountdata });
            } else if (req.body.params.flag1 == "L0") {
                _filter.filter['CLASS_NAME_CD'] = req.body.params.DOC_NAME
                _filter.filter['DD_SUBSTANCE_CD'] = { $ne: req.body.params.CODE }
                let _mClassificationData = await _mUtils.commonMonogoCall(`monography_dd_substance_classifications`, "find", _filter, "", "", "", "")
                if (!(_mClassificationData && _mClassificationData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mClassificationData.desc || "", data: _mClassificationData.data || [] });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mClassificationData.data });
            } else if (req.body.params.flag1 == "SUBSTANCE_DROPDOWN") {
                let nameExp = { $regex: req.body.params.searchValue, $options: 'i' };
                if (req.body.params.searchValue && req.body.params.searchValue != "" && !req.body.params.CODE) {
                    _filter.filter["DD_SUBSTANCE_NAME"] = nameExp;
                } else {
                    //_filterObj.filter['DD_SUBSTANCE_NAME'] = nameExp
                    _filter.filter['DD_SUBSTANCE_CD'] = { $ne: req.body.params.CODE }
                }
                let _mRespData = await _mUtils.commonMonogoCall(`monography_dd_drug_master`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }
                let _data = []
                let _finalCountData = {};
                if (_mRespData.data.length > 0) {
                    let _uomData = _.chain(_mRespData.data).groupBy('DD_SUBSTANCE_NAME')
                        .map((_v, _k) => {
                            if (_k != "") {
                                _data.push({
                                    DD_SUBSTANCE_NAME: _k,
                                    DD_SUBSTANCE_CD: _v[0].DD_SUBSTANCE_CD
                                })
                            }
                        }).value();
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _data });
                }
            }
        } else if (req.body.params.flag == "ALERTS_") {
            _collectionName = "drugchildinteraction";
            _filter.filter['SRC_DRUG_CD'] = req.body.params.ID2
            _filter.filter['IS_CD'] = req.body.params.ID3
            _filter.filter['INT_ID'] = req.body.params.TYPE

            let config = {
                "data": req.body.params,
                "headers": req.headers,
                "url": req.protocol + '://' + req.headers.host + req.originalUrl,
                "method": req.method
            }

            if (req.body.params.ID2 != "" && req.body.params.ID3 != "" && req.body.params.VAL1 != "" && req.body.params.VAL2 == "" && (req.body.params.TYPE == 8 || req.body.params.TYPE == 9 || req.body.params.TYPE == 10 || req.body.params.TYPE == 11)) {
                let _ChildResponse = await getDataBasedOnLooping(req.body.params.VAL1.split(","), 0, [], req, _filter, _collectionName)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _ChildResponse.data, config: config });
            } else if (req.body.params.ID2 != "" && req.body.params.ID3 != "" && req.body.params.VAL2 != "" && req.body.params.TYPE) {
                _filter.filter['CLASS_NAME_CD'] = req.body.params.VAL2
                if (req.body.params.VAL1 == "" && req.body.params.VAL2 != "") {
                    let _mChildpData = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
                    if (!(_mChildpData && _mChildpData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _mChildpData.desc || "", data: _mChildpData.data || [] });
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _mChildpData.data, config: config });
                } else {
                    let _ChildResponse = await getDataBasedOnLooping(req.body.params.VAL1.split(","), 0, [], req, _filter, _collectionName)
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _ChildResponse.data, config: config });
                }
            }
        } else if (req.body.params.flag == "ALERTS") {
            if (req.body.params.flag1 == "DRPDATA") {
                let _mdrpData = await dropdownMasterWiseData(req, [], _filter, res)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _mdrpData.data });
            }
        } else if (req.body.params.flag == "ALLERGY") {
            _collectionName = "allergy_master"
            delete req.body.params.flag;
            if (req.body.params.flag1 == "GETALL") {
                delete req.body.params.flag1;
                let _columnNames = ["ALLERGY_MASTER_CD", "ALLERGY_CD", "ALLERGY_NAME", "ALLERGY_TYPE"]
                let _totaldata = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "find", _columnNames)
                let _exitData = await commonCheckExitOrNot(_collectionName, req, _filter, "GETALL", "findCount");
                if (_totaldata.data.length > 0 && _exitData.data.length > 0) {
                    _finalCountData = {
                        Table: _exitData.data,
                        Table1: _totaldata.data
                    }
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: _finalCountData });
            }
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
        }

        delete req.body.params.flag
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper(`monography_${_collectionName}`, "find", _pGData.data, req.tokenData.dbType).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });

    } catch (error) {
        return res.status(400).json({ success: false, status: 400, desc: error, data: [] });
    }
})

/**update masters data */
router.post("/update-master-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _filter = { "filter": { "recStatus": { $eq: true } } };
        if (req.body.params._id || req.body.params[0]._id) {
            let _collectionName = "";
            if (req.body.params.flag == "UOM") {
                _collectionName = "uoms"
            } else if (req.body.params.flag == "NUM") {
                _collectionName = "numbers"
            } else if (req.body.params.flag == "IS") {
                _collectionName = "intendedsites"
                _filter.filter = {
                    $or: [
                        {
                            "IS_ALL_CODE": req.body.params.IS_ALL_CODE
                        },
                        {
                            "DISPLAY_NAME": req.body.params.DISPLAY_NAME
                        }
                    ]
                }
                _filter.filter['recStatus'] = { $eq: true }
                let _getIntendedSite = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "find", _filter, "", "", "", "")
                if (_getIntendedSite.data.length > 0) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
                }

            } else if (req.body.params.flag == "ROA") {
                _collectionName = "routeofadministrations"
            } else if (req.body.params.flag == "WAS") {
                _collectionName = "whoatcs"
            } else if (req.body.params.flag == "INN") {
                _collectionName = "inns"
            } else if (req.body.params.flag == "REL") {
                _collectionName = "releases";
            } else if (req.body.params.flag == "SNOWMED") {
                _collectionName = "snowmeds";
            } else if (req.body.params.flag == "BDF") {
                _collectionName = "bdf";
            } else if (req.body.params.flag == "UNII") {
                _collectionName = "uniis";
            } else if (req.body.params.flag == "DAM") {
                _collectionName = "dam";
            } else if (req.body.params.flag == "FLV") {
                _collectionName = "flavour"
            } else if (req.body.params.flag == "THE") {
                _collectionName = "theraphy"
            } else if (req.body.params.flag == "DD_SUBSTANCE_COMB") {
                _collectionName = "dd_substance_combination"
            } else if (req.body.params.flag == "DD_SUBSTANCE_CLASSIFICATIONS") {
                _collectionName = "dd_substance_classifications"
                let _insertOrUpdate = await insertOrUpdate(req.body.params.JSON, 0, [], req, res, _collectionName)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _insertOrUpdate.data });
            } else if (req.body.params.flag == "DOSE_FORM_MAP") {
                _collectionName = "dose_form_map"
            } else if (req.body.params.flag == "STRENGTH") {
                _collectionName = "strength"
            } else if (req.body.params.flag == "DMF") {
                _collectionName = "dd_substance_comb_mapping"
            } else if (req.body.params.flag == "DD_DRUG_MASTER") {
                _collectionName = "dd_drug_master"
            } else if (req.body.params.flag == "BRAND") {
                _collectionName = "brand"
            } else if (req.body.params.flag == "DD_PRODUCT") {
                _collectionName = "dd_product_master"
            } else if (req.body.params.flag == "BRAND_PRODUCT") {
                _collectionName = "brand_product_mapping"
            } else if (req.body.params.flag == "CLASS_NAME") {
                delete req.body.params.sectionName
                _collectionName = "class_name"
            } else if (req.body.params.flag == "ENTITY") {
                _collectionName = "entity"
                let sequenceName;
                if (req.body.params.type == "CLASSTYPE") {
                    sequenceName = "Classtype"
                } else if (req.body.params.type == "SOURCETYPE") {
                    sequenceName = "ClassSource"
                }
                let filterData = _.filter(req.body.params.child, (_d, _i) => { return !_d._id })
                if (filterData.length > 0) {
                    let _seqClassData = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: `${sequenceName}` }, "monography", req)
                    filterData[0]['cd'] = _seqClassData.data
                    _cBody.params.child = filterData
                }
            } else if (req.body.params.flag == "DRUG_INTERACTIONS") {
                if (req.body.params.JSON1 && req.body.params.JSON1.length > 0) {
                    let _updateParentData = await updateParentData(req.body.params.JSON1, 0, [], req, "")
                    if (!(_updateParentData && _updateParentData.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _updateParentData.desc || "", data: _updateParentData.data || [] });
                    }
                    let _mResp;
                    if (req.body.params.JSON && req.body.params.JSON.length > 0) {
                        _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "insertMany", req.body.params.JSON, "", "", "", "")
                        if (!(_mResp && _mResp.success)) {
                            return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                        }
                    }
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _updateParentData.data });
                }

                // if (req.body.params.flag1 === "STATUS") {
                //     _filter.filter['DRUG_IN_PARENT_ID'] = req.body.params.JSON1[0].DRUG_IN_PARENT_ID ? req.body.params.JSON1[0].DRUG_IN_PARENT_ID : 0;
                //     let _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
                //     if (!(_mResp && _mResp.success)) {
                //         return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                //     }
                //     let _childActiveInActive = await childActiveInActive(_mResp.data, 0, [], req, res)
                //     return res.status(200).json({ success: true, status: 200, desc: '', data: _childActiveInActive.data });
                // } else {
                //     if (req.body.params.JSON && req.body.params.JSON.length > 0) {
                //         let _updatChildData = await updatChildData(req.body.params.JSON, 0, [], req, res)
                //         if (!(_updatChildData && _updatChildData.success)) {
                //             return res.status(400).json({ success: false, status: 400, desc: _updatChildData.desc || "", data: _updatChildData.data || [] });
                //         }
                //         return res.status(200).json({ success: true, status: 200, desc: '', data: _updatChildData.data });
                //     } else {
                //         return res.status(200).json({ success: true, status: 200, desc: '', data: "provide child data" });
                //     }
                // }

            }
            //  else if (req.body.params.flag == "DRUG_INTERACTIONS") { 
            //     if (req.body.params.JSON1 && req.body.params.JSON1.length> 0) {
            //         let _updateParentData = await updateParentData(req.body.params._id, "", "", req)
            //         if (!(_updateParentData && _updateParentData.success)) {
            //             return res.status(400).json({ success: false, status: 400, desc: _updateParentData.desc || "", data: _updateParentData.data || [] });
            //         }
            //     }
            //     if (req.body.params.flag1 === "STATUS") {
            //         _filter.filter['DRUG_IN_PARENT_ID'] = req.body.params.DRUG_IN_PARENT_ID ? req.body.params.DRUG_IN_PARENT_ID : 0;
            //         let _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
            //         if (!(_mResp && _mResp.success)) {
            //             return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            //         }
            //         let _childActiveInActive = await childActiveInActive(_mResp.data, 0, [], req, res)
            //         return res.status(200).json({ success: true, status: 200, desc: '', data: _childActiveInActive.data });
            //     } else {
            //         if (req.body.params.JSON && req.body.params.JSON.length > 0) {
            //             let _updatChildData = await updatChildData(req.body.params.JSON, 0, [], req, res)
            //             if (!(_updatChildData && _updatChildData.success)) {
            //                 return res.status(400).json({ success: false, status: 400, desc: _updatChildData.desc || "", data: _updatChildData.data || [] });
            //             }
            //             return res.status(200).json({ success: true, status: 200, desc: '', data: _updatChildData.data });
            //         } else {
            //             return res.status(200).json({ success: true, status: 200, desc: '', data: "provide child data" });
            //         }
            //     }

            // } 
            else if (req.body.params[0].flag == "DD_SUBSTANCE") {
                _collectionName = "substance";
                let _insertOrUpdate = await insertOrUpdate(req.body.params, 0, [], req, res, _collectionName)
                return res.status(200).json({ success: true, status: 200, desc: '', data: _insertOrUpdate.data });
            } else {
                return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
            }
            // delete req.body.params.flag
            // if(req.body.params.recStatus == false){
            //    delete _filter.filter.recStatus
            // }
            let pLoadResp = { payload: {} };
            if (req.body.params.recStatus == false) {
                pLoadResp = { payload: {} };
                let _mResp = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "findById", req.body.params._id, "REVNO", req.body, "", "")
                if (!(_mResp && _mResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                }
               // console.log("sdgfvsjfsgdf", _cBody)
                let _hResp = await _mUtils.insertHistoryData(`monography_${_collectionName}`, _mResp.data.params, _cBody.params, req, "monography");
                if (!(_hResp && _hResp.success)) {

                }
                else {
                    _cBody.params.revNo = _mResp.data.params.revNo;
                    pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                    if (!pLoadResp.success) {
                        return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                    }
                    // pLoadResp.payload.query.$push["history"] = {
                    //     "revNo": _hResp.data[0].revNo,
                    //     "revTranId": _hResp.data[0]._id
                    // }

                    //  pLoadResp.payload.query.$push["permissions"]=permsDta
                    // = req.body.params.permissionseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkRHQiOiIyMDIzLTExLTAzVDEzOjM2OjAzLjYyM1oiLCJ1c2VySWQiOiI2NGNjYzkyMTlmOTMwODZhOTAwYWNmNTkiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZUlkIjoiNjUxZWI1ZTRjYzYyYTAxMjY0NDUzNjM3IiwiZGlzcGxheU5hbWUiOiJwcmFzYWQga3VjaGlwdWRpIiwic2Vzc2lvbl9pZCI6OTAzNCwiaWF0IjoxNjk5MDE4NTYzLCJleHAiOjE2OTkwMjc1NjN9.Cr94uBh5bxMmlKq-3Xfe5Dv7vjx14BhoHIUBDVa8SWc
                }
                mongoMapper(`monography_${_collectionName}`, 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                });
            } else {
                let _existData = await commonCheckExitOrNot(_collectionName, req, _filter, "EXIST")
                if (_existData.code == 0) {
                    return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist" });
                } else {
                    pLoadResp = { payload: {} };
                    let _mResp = await _mUtils.commonMonogoCall(`monography_${_collectionName}`, "findById", req.body.params._id, "REVNO", req.body, "", "")
                    if (!(_mResp && _mResp.success)) {
                        return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
                    }
                  //  console.log("sdgfvsjfsgdf", _cBody)
                    let _hResp = await _mUtils.insertHistoryData(`monography_${_collectionName}`, _mResp.data.params, _cBody.params, req, "monography");
                    if (!(_hResp && _hResp.success)) {

                    }
                    else {
                        _cBody.params.revNo = _mResp.data.params.revNo;
                        pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
                        if (!pLoadResp.success) {
                            return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                        }
                        // pLoadResp.payload.query.$push["history"] = {
                        //     "revNo": _hResp.data[0].revNo,
                        //     "revTranId": _hResp.data[0]._id
                        // }

                        //  pLoadResp.payload.query.$push["permissions"]=permsDta
                        // = req.body.params.permissionseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkRHQiOiIyMDIzLTExLTAzVDEzOjM2OjAzLjYyM1oiLCJ1c2VySWQiOiI2NGNjYzkyMTlmOTMwODZhOTAwYWNmNTkiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZUlkIjoiNjUxZWI1ZTRjYzYyYTAxMjY0NDUzNjM3IiwiZGlzcGxheU5hbWUiOiJwcmFzYWQga3VjaGlwdWRpIiwic2Vzc2lvbl9pZCI6OTAzNCwiaWF0IjoxNjk5MDE4NTYzLCJleHAiOjE2OTkwMjc1NjN9.Cr94uBh5bxMmlKq-3Xfe5Dv7vjx14BhoHIUBDVa8SWc
                    }
                    mongoMapper(`monography_${_collectionName}`, 'bulkWrite', pLoadResp.payload, req.tokenData.orgKey).then(async (result) => {
                        return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
                    }).catch((error) => {
                        return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
                    });
                    // }else {
                    //     return res.status(200).json({ success: true, status: 200, desc: '', data: "already exist"});
                    // }
                }
            }
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.desc, data: [] });
    }
})

router.post("/entity-get-dropdowns", async (req, res) => {
    try {
        _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "cd": req.body.params.flag
            }
        }
        let _mRespData = await _mUtils.commonMonogoCall("monography_entity", "find", _filter, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        }
        return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData.data });
    } catch (error) {
       // console.log(error)
    }
})

/**bulk master data */
router.post("/get-section-histories", async (req, res) => {

    try {
        let _filter = {
            "filter": {
                "DD_SUBSTANCE_CD": req.body.params.DD_SUBSTANCE_CD,
                "drug_section_id": req.body.params.drug_section_id
            }
        }

        let _getsectionhistData = await _mUtils.commonMonogoCall("monography_sections_history", "find", _filter, "", "", "", "")
        return res.status(200).json({ success: true, status: 200, desc: '', data: _getsectionhistData.data })
    } catch (error) {
        return res.status(400).json({ success: false, status: 400, desc: error, data: "" })
    }
})

// router.post("/bulk-data", async (req, res) => {
//     try {
//         // let url = "http://staging.rxseed.com/rxseedapi/staging/pharmacy/api/getMasterData01"
//         let resonseData = []
//         let params = {
//             "TYPE": "STRENGTH_MASTER",
//             "FLAG": "A",
//             "PAGENUM": 1,
//             "PAGE_SIZE": 150000
//         }

//         await axios1.post(url, params).then((response) => {
//             resonseData = response.data.Table1
//         }).catch((err) => {
//             console.log("err", err)
//         })

//         let _drugData = []
//         _.each(resonseData, async (_o, i) => {
//             let _DATA={
//                 "STRENGTH_MASTER_CD": o.STRENGTH_MASTER_CD != null ? o.STRENGTH_MASTER_CD : "",
//                 "STRENGTH_NAME": o.STRENGTH_NAME != null ? o.STRENGTH_NAME : "",
//                 "NUMERATOR_NUM_CD": o.NUMERATOR_NUM_CD != null ? o.NUMERATOR_NUM_CD : "",
//                 "NUMERATOR_NUM_NAME": o.NUMERATOR_NUM_NAME != null ? o.NUMERATOR_NUM_NAME : "",
//                 "NUMERATOR_UOM_CD": o.NUMERATOR_UOM_CD != null ? o.NUMERATOR_UOM_CD : "",
//                 "NUMERATOR_UOM_NAME": o.NUMERATOR_UOM_NAME != null ? o.NUMERATOR_UOM_NAME : "",
//                 "DENOMINATOR_NUM_CD": o.DENOMINATOR_NUM_CD != null ? o.DENOMINATOR_NUM_CD : "",
//                 "DENOMINATOR_NUM_NAME": o.DENOMINATOR_NUM_NAME != null ? o.DENOMINATOR_NUM_NAME : "",
//                 "DENOMINATOR_UOM_CD": o.DENOMINATOR_UOM_CD != null ? o.DENOMINATOR_UOM_CD : "",
//                 "DENOMINATOR_UOM_NAME": o.DENOMINATOR_UOM_NAME != null ? o.DENOMINATOR_UOM_NAME : "",
//                 "TYPE": o.TYPE != null ? o.TYPE : "",
//                 "REMARKS": o.REMARKS != null ? o.REMARKS : "",                                                                                                                  
//                 "audit": req.body.params.audit       
//             }
//             //  let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'unitsOfMeasurement' }, "monography", req);
//             _drugData.push(_DATA)
//         })
//         req.body.params = _drugData
//         mongoMapper('monography_strength', "insertMany", req.body.params).then(async (result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });




router.post("/bulk-data", async (req, res) => {
    try {
        // let url = "http://staging.rxseed.com/rxseedapi/staging/pharmacy/api/getMasterData01"
        let resonseData = []
        let params = {
            "TYPE": "DFM",
            "FLAG": "A",
            "PAGENUM": 1,
            "flag":"D",
            "PAGE_SIZE": 50000
        }

        await axios1.post(url, params).then((response) => {
            resonseData = response.data.Table1
        }).catch((err) => {
         //   console.log("err", err)
        })

        let _drugData = []
        _.each(resonseData, async (o, i) => {
            //  let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'unitsOfMeasurement' }, "monography", req);
            _drugData.push({
                "DOSE_FORM_CD": o.DOSE_FORM_CD != null ? o.DOSE_FORM_CD : "",
                "IDENTIFIER": o.IDENTIFIER != null ? o.IDENTIFIER : "",
                "BDF_NAME": o.BDF_NAME != null ? o.BDF_NAME : "",
                "BDF_CODE": o.BDF_CODE != null ? o.BDF_CODE : "",
                "IS_NAME": o.IS_NAME != null ? o.IS_NAME : "",
                "IS_CODE": o.IS_CODE != null ? o.IS_CODE : "UNASSIGNED",
                "DAM_NAME": o.DAM_NAME != null ? o.DAM_NAME : "",
                "ROA_NAME": o.ROA_NAME != null ? o.ROA_NAME : "",
                "DAM_CODE": o.DAM_CODE != null ? o.DAM_CODE : "",
                "ROA_CODE": o.ROA_CODE  != null ? o.ROA_CODE  : "",
                "RNS_CODE": o.RNS_CODE != null ? o.RNS_CODE : "",
                "RNS_NAME": o.RNS_NAME != null ? o.RNS_NAME : "",
                "DOSE_DEFAULT_NAME": o.DOSE_DEFAULT_NAME != null ? o.DOSE_DEFAULT_NAME : "",
                "DOSE_DISPLAY_NAME  ": o.DOSE_DISPLAY_NAME     != null ? o.DOSE_DISPLAY_NAME   : "",
                "ADDL_ATBR1": o.ADDL_ATBR1 != null ? o.ADDL_ATBR1 : "",   
                "REMARKS": o.REMARKS != null ? o.REMARKS : "",
                "recStatus":false,             
                "audit": req.body.params.audit
            })
        })
        req.body.params = _drugData
        mongoMapper('monography_dose_form_map', "insertMany", req.body.params).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.message || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**update interactions */
router.post("/update-interactions", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params._id) {
            let _mResp = await _mUtils.commonMonogoCall("monography_drugparentinteraction", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            if (req.body.params.JSON1 && req.body.params.JSON1.length > 0) {
                let _updateParentData = await updateParentData(req.body.params._id, "", "", req)
                if (!(_updateParentData && _updateParentData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _updateParentData.desc || "", data: _updateParentData.data || [] });
                }
            }
            if (req.body.params.JSON && req.body.params.JSON.length > 0) {
                let _updatChildData = await updatChildData(req.body.params.JSON, 0, [], req, res)
                if (!(_updatChildData && _updatChildData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _updatChildData.desc || "", data: _updatChildData.data || [] });
                }
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: _updatChildData.data });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/**Update specialization */
router.post("/update-entity", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        let _mResp = await _mUtils.commonMonogoCall("monography_entity", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType)
        if (!(_mResp && _mResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
        }
        let _hResp = await _mUtils.insertHistoryData('monography_entity', _mResp.data.params, _cBody.params, req);

        let pLoadResp = { payload: {} };
        if (!(_hResp && _hResp.success)) {

        }
        else {
            _cBody.params.revNo = _mResp.data.params.revNo;
            pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
        }
        mongoMapper('monography_entity', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(async (result) => {
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

async function getInteractionWithAlternative(_data, _idx, _output, req, _filterObj, _bName) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "SRC_DRUG_CD": _data[_idx].SRC_DRUG_CD,
                    "INT_TYPE_ID": _data[_idx].INT_TYPE_ID
                }
            }
            if (_data[_idx].CLASS_NAME_CD) {
                _filter.filter['CLASS_NAME_CD'] = _data[_idx].CLASS_NAME_CD
            }
            // _filter.filter['CLASS_NAME_CD'] = _data[_idx].CLASS_NAME_CD != "" ? _data[_idx].CLASS_NAME_CD : ""
            //  _filterObj.filter['INT_TYPE_ID']=_data[_idx].INT_TYPE_ID

            let _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            if (_mResp.data.length > 0) {
                _.each(JSON.parse(JSON.stringify(_mResp.data)).splice(0, 1), (_obj, _ind) => {
                    _obj['BRAND_PRODUCT_NAME'] = _data[_idx].BRAND_NAME_1 + "<-->" + _data[_idx].BRAND_NAME_2
                    _obj['SRC_BRAND_PRODUCT_CD'] = _data[_idx].SRC_BRAND_PRODUCT_CD
                    _obj['INT_BRAND_PRODUCT_CD'] = _data[_idx].INT_BRAND_PRODUCT_CD
                    _obj['SRC_SUBSTANCE_NAME'] = _data[_idx].SRC_SUBSTANCE_NAME
                    _obj['INT_SUBSTANCE_NAME'] = _data[_idx].INT_SUBSTANCE_NAME
                    _output.push(_obj)
                })
            }

            _idx = _idx + 1
            await getInteractionWithAlternative(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("efdfhgudfhfdgh", error)
    }
}

async function getInteractionWithagainstClass(_data, _idx, _output, req, _filterObj, _bName) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "SRC_DRUG_CD": _data[_idx].SRC_DRUG_CD,
                    "CLASS_NAME_CD": _data[_idx].INT_TYPE_ID
                }
            }
            if (_data[_idx].CLASS_NAME_CD) {
                _filter.filter['CLASS_NAME_CD'] = _data[_idx].CLASS_NAME_CD
            }
            // _filter.filter['CLASS_NAME_CD'] = _data[_idx].CLASS_NAME_CD != "" ? _data[_idx].CLASS_NAME_CD : ""
            //  _filterObj.filter['INT_TYPE_ID']=_data[_idx].INT_TYPE_ID

            let _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            if (_mResp.data.length > 0) {
                _.each(JSON.parse(JSON.stringify(_mResp.data)).splice(0, 1), (_obj, _ind) => {
                    _obj['BRAND_PRODUCT_NAME'] = _data[_idx].BRAND_NAME_1 + "<-->" + _data[_idx].BRAND_NAME_2
                    _obj['SRC_BRAND_PRODUCT_CD'] = _data[_idx].SRC_BRAND_PRODUCT_CD
                    _obj['INT_BRAND_PRODUCT_CD'] = _data[_idx].INT_BRAND_PRODUCT_CD
                    _obj['SRC_SUBSTANCE_NAME'] = _data[_idx].SRC_SUBSTANCE_NAME
                    _obj['INT_SUBSTANCE_NAME'] = _data[_idx].INT_SUBSTANCE_NAME
                    _output.push(_obj)
                })
            }

            _idx = _idx + 1
            await getInteractionWithagainstClass(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("efdfhgudfhfdgh", error)
    }
}

async function getBerandSubstanceNames(_data, _idx, _output, req, _filterObj) {
    try {
        if (_data.length > _idx) {
            _filterObj.filter = {}
            _filterObj.filter['recStatus'] = { $eq: true }
            // _filterObj.filter['BRAND_STRING2_CD'] = _data[_idx]
            _filterObj.filter['BRAND_PRODUCT_MAP_CD'] = _data[_idx]
           // _filterObj['selectors']={'STRING_3_CD':"$STRING_3_CD",'BRAND_STRING2_CD':"$BRAND_STRING2_CD",'BRAND_STRING2':"$BRAND_STRING2",}
            let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_brand_product_mapping", "find", _filterObj, "", "", "", "")
            if (!(_mBrandProductResp && _mBrandProductResp.success)) {
                // return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
            } else {
                // delete _filterObj.selectors
                _filterObj.filter = {}
                _filterObj.filter['recStatus'] = { $eq: true }
                _filterObj.filter['STRING_3_CD'] = _mBrandProductResp.data[0].STRING_3_CD
                let _mClinicalProductResp = await _mUtils.commonMonogoCall("monography_dd_product_master", "find", _filterObj, "", "", "", "")
                if (!(_mClinicalProductResp && _mClinicalProductResp.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mClinicalProductResp.desc || "", data: _mClinicalProductResp.data || [] });
                } else {
                    _filterObj.filter['DD_DRUG_MASTER_CD'] = _mClinicalProductResp.data[0].DD_DRUG_MASTER_CD
                    let _mMedicinalProductResp = await _mUtils.commonMonogoCall("monography_dd_drug_master", "find", _filterObj, "", "", "", "")
                    if (_mMedicinalProductResp.data.length > 0) {
                        _.each(JSON.parse(JSON.stringify(_mMedicinalProductResp.data)), (_obj, _ind) => {
                            _obj['BRAND_CD'] = _mBrandProductResp.data[0].BRAND_STRING2_CD
                            _obj['BRAND_NAME'] = _mBrandProductResp.data[0].BRAND_STRING2
                            // _obj['IS_ASSIGNED']= _mBrandProductResp.data[0].IS_ASSIGNED
                            _output.push(_obj)
                        })
                    }
                }
            }
            _idx = _idx + 1
            await getBerandSubstanceNames(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("efdfhgudfhfdgh", error)
    }
}

async function commonGetData(_data, _idx, _output, req, _filterObj,_flag) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "SRC_DRUG_CD": _data[_idx].DD_SUBSTANCE_CD,
                    "INT_ID":{}
                   // "INT_ID": { $in: [9,11] }
                    // "INT_ID": { $eq: "10" }    GIVEN_ONLY_BRAND_PRODUCT
                }
            }

            if(_flag ==="GIVEN_ONLY_BRAND_PRODUCT"){
               _filter.filter['INT_ID'] = { $in: [9,11] }
            }else{
                _filter.filter['INT_ID'] = { $ne: 8 }
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", "find", _filter, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            if (_mResp.data.length > 0) {
                _.each(JSON.parse(JSON.stringify(_mResp.data)), (_obj, _ind) => {
                    _obj['BRAND_PRODUCT_NAME'] = _data[_idx].BRAND_NAME
                    _obj['SRC_BRAND_PRODUCT_CD'] = _data[_idx].BRAND_CD
                    _obj['INT_BRAND_PRODUCT_CD'] = ""
                    _output.push(_obj)
                })
            }

            _idx = _idx + 1
            await commonGetData(_data, _idx, _output, req, _filterObj,_flag)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
      //  console.log("efdfhgudfhfdgh", error)
    }
}

async function alertsWithSpecificKey(_data, _idx, _output, req, _filterObj) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true }
                }
            }
            let _collectionName = "drugchildinteraction"
            if (_data[_idx].DRUG_CD && _data[_idx].DRUG_CD.length > 0) {
            } else if (_data[_idx].FOOD_CD && _data[_idx].FOOD_CD.length > 0) {
                let _foodData = []
                if (_output.length > 0) {
                    _foodData = _.filter(_output, (_o, _i) => { return _o.INT_ID === 9 })
                }
                if (_foodData.length == 0) {
                    let _foodDataResponse = await getDataBasedOnLooping(_data[_idx].FOOD_CD.split(","), 0, [], req, _filter, _collectionName, "FOOD");
                    if (_foodDataResponse.data.length > 0) {
                        _.each(JSON.parse(JSON.stringify(_foodDataResponse.data)), (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                }
            } else if (_data[_idx].DIS_CD && _data[_idx].DIS_CD.length > 0) {
                let _diseaseDataResponse = await getDataBasedOnLooping(_data[_idx].DIS_CD.split(","), 0, [], req, _filter, _collectionName, "DISEASE");
                if (_diseaseDataResponse.data.length > 0) {
                    _.each(_diseaseDataResponse.data, (_o, _i) => {
                        _output.push(_o)
                    })
                }
            } else if (_data[_idx].LAB_TEST_CD && _data[_idx].LAB_TEST_CD.length > 0) {
                let _labDataResponse = await getDataBasedOnLooping(_data[_idx].LAB_TEST_CD.split(","), 0, [], req, _filter, _collectionName, "LAB");
                if (_labDataResponse.data.length > 0) {
                    _.each(_labDataResponse.data, (_o, _i) => {
                        _output.push(_o)
                    })
                }
            } else if (_data[_idx].ALLERGY_CD && _data[_idx].ALLERGY_CD.length > 0) {
                let _labDataResponse = await getDataBasedOnLooping(_data[_idx].ALLERGY_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_NAME");

                for (var i = 0; i <= JSON.parse(JSON.stringify(_labDataResponse.data)).length - 1; i++) {
                    for (var j = i + 1; j <= JSON.parse(JSON.stringify(_labDataResponse.data)).length - 1; j++) {
                        if (JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_CD'] == JSON.parse(JSON.stringify(_labDataResponse.data))[j]['DD_SUBSTANCE_CD']) {
                            _output.push({ "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_NAME']}.the prescribed medication ${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_NAME']} includes ${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_NAME']},which belongs to the class of medications known as ${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['CLASS_NAME']}` })
                        } else if (JSON.parse(JSON.stringify(_labDataResponse.data))[i]['CLASS_NAME'] == JSON.parse(JSON.stringify(_labDataResponse.data))[j]['CLASS_NAME']) {
                            _output.push({ "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to "${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_CD']}".the prescribed medication "${JSON.parse(JSON.stringify(_labDataResponse.data))[j]['DD_SUBSTANCE_CD']}" includes "${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['DD_SUBSTANCE_CD']}",which belongs to the class of medications known as "${JSON.parse(JSON.stringify(_labDataResponse.data))[i]['CLASS_NAME']}"` })
                        }
                    }
                }




                //  _.each(JSON.parse(JSON.stringify(_labDataResponse.data)),(_v,_k)=>{
                //      if(_v !=""){
                //         //  let cloneData = _.clone(JSON.parse(JSON.stringify(_labDataResponse.data)));
                //         //  let c = _.filter(JSON.parse(JSON.stringify(_labDataResponse.data)),(_obj,_indx)=>{return !(_indx ===_k) })
                //       //  let deleteObjectsData = _k==0 ? _.filter(JSON.parse(JSON.stringify(_labDataResponse.data)),(_obj,_indx)=>{return !(_indx ===_k) }) :JSON.parse(JSON.stringify(_labDataResponse.data)).slice(_k);
                //       //  let deleteObjectsData =  JSON.parse(JSON.stringify(_labDataResponse.data)).slice(_k) 
                //         _.each(deleteObjectsData,(_v1,_k1)=>{
                //            // let _obj ={}
                //              if(_v1 !=""){
                //                  if(_v1.DD_SUBSTANCE_CD === _v.DD_SUBSTANCE_CD){
                //                      if(_alergySameSubstanceAllert.length === 0){
                //                         _alergySameSubstanceAllert.push({"INTERACTIONS":`Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to "${_v1.DD_SUBSTANCE_NAME}".the prescribed medication "${_v1.DD_SUBSTANCE_NAME}" includes "${_v1.DD_SUBSTANCE_NAME}",which belongs to the class of medications known as "${_v1.CLASS_NAME}"`}) 
                //                      }else {
                //                          let _samedrugData = {"INTERACTIONS":`Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to "${_v1.DD_SUBSTANCE_NAME}".the prescribed medication "${_v1.DD_SUBSTANCE_NAME}" includes "${_v1.DD_SUBSTANCE_NAME}",which belongs to the class of medications known as "${_v1.CLASS_NAME}"`}
                //                          _.each(_alergySameSubstanceAllert,(_o,_i)=>{
                //                             if(!(_o.INTERACTIONS === _samedrugData.INTERACTIONS)){
                //                                 _alergySameSubstanceAllert.push(_samedrugData)
                //                             }
                //                          })
                //                      }
                //                     console.log(_alergySameSubstanceAllert)
                //                  }else if(_v1.CLASS_NAME === _v.CLASS_NAME){

                //                  }
                //                 //  if(_matchingInteractingKeys.length === 0){
                //                 //     _matchingInteractingKeys.push(_obj)
                //                 //  }else {
                //                 //     let _dd = _.filter(_matchingInteractingKeys,(_o,_i)=>{return JSON.stringify(_.orderBy(Object.keys(_o))) == JSON.stringify(_.orderBy(Object.keys(_obj)) )})
                //                 //     if(_dd.length == 0){
                //                 //         _matchingInteractingKeys.push(_obj)
                //                 //     }else {
                //                 //         console.log("dfsdjfgsdjhfgsj")
                //                 //     }
                //                 //  }
                //              } 
                //         })
                //      }
                //  })
            }
            _idx = _idx + 1
            await alertsWithSpecificKey(_data, _idx, _output, req, _filterObj)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
        //console.log("efdfhgudfhfdgh", error)
    }
}

async function finalGetInteractionDataWithAllScenearios(_data, _idx, _output, req, _filterObj,_getBerandSubstanceNames) {
    try {
        if (_data.length > _idx) {
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true }
                }
            }
            if (_data[_idx].BRAND_PRODUCT_CD || _data[_idx].CLS_CD || _data[_idx].DRUG_CD) {
               // let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].BRAND_PRODUCT_CD.split(","), 0, [], req, _filter);
                let classAganistSubstances = req.body.JSON[0].CLS_CD && req.body.JSON[0].CLS_CD.length > 0 ? await getDataBasedOnLooping(req.body.JSON[0].CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD") : [];
                let interactingBrandAganistSubstances = req.body.JSON[0].DRUG_CD && req.body.JSON[0].DRUG_CD.length > 0 ? await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter) : [];

                if ((_data[_idx].BRAND_PRODUCT_CD && _data[_idx].CLS_CD) || (_data[_idx].BRAND_PRODUCT_CD && _data[_idx].DRUG_CD)) {
                    if (_data[_idx].CLS_CD) {
                        _.each(JSON.parse(JSON.stringify(classAganistSubstances.data)), (_o, _i) => {
                            _getBerandSubstanceNames.data.push(_o)
                        })
                    }
                    if (_data[_idx].DRUG_CD) {
                        _.each(JSON.parse(JSON.stringify(interactingBrandAganistSubstances.data)), (_o, _i) => {
                            _getBerandSubstanceNames.data.push(_o)
                        })

                         /////////////////////////////////////////////////////////////////////////
                    let _splitFinalData = [];
                    let _substanceObject = {}
                    _.each(JSON.parse(JSON.stringify(_getBerandSubstanceNames.data)), (_o, _i) => {
                        _.each(_o.DD_SUBSTANCE_CD.split('+'), (_o1, _i1) => {
                            _substanceObject = {}
                            _.each(_o, (_val, _key) => {
                                if (_key == "DD_SUBSTANCE_CD") {
                                    _substanceObject['DD_SUBSTANCE_CD'] = _o1.trim()
                                } else {
                                    _substanceObject[_key] = _val
                                }
            
                            })
                            _splitFinalData.push(_substanceObject)
                        })
                    })
                    
                    let givenDataagainstAddingClassData =  await _givenDataagainstAddingClassData(_splitFinalData,0,[],req,_filter);
                    let _comparisonData=[]
                    _.each(givenDataagainstAddingClassData.data, (_o, _i) => {
                        _.each(givenDataagainstAddingClassData.data, (_o1, _i1) => {
                            if (_o != _o1) {
                                _comparisonData.push(
                                    {
                                        "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                        "INT_TYPE_ID": _o1.CLASS_NAME_CD,
                                        "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
                                        "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
                                        "BRAND_NAME_1": _o.BRAND_NAME,
                                        "BRAND_NAME_2": _o1.BRAND_NAME,
                                        "SRC_SUBSTANCE_NAME": _o.DD_SUBSTANCE_NAME,
                                        "INT_SUBSTANCE_NAME": _o1.DD_SUBSTANCE_NAME
                                    }
                                )
                            }
                        })
                    });
                    let _duplicateData= _comparisonData.filter((_o,_i)=>{return _o.BRAND_NAME_1 != _o.BRAND_NAME_2})
                    let _findDuplicatesAndCombinedData = await findDuplicatesAndCombinedData(JSON.parse(JSON.stringify(_duplicateData)), 'SRC_DRUG_CD', "INT_TYPE_ID");
                    let _getInteractionWithagainstClass = await getInteractionWithagainstClass(_findDuplicatesAndCombinedData, 0, [], req, _filter, "");
                    _.each(_getInteractionWithagainstClass.data, (_o, _i) => {
                        _output.push(_o)
                        //_finalData.alertsData.push(_o)
                    })
                    ////////////////////////////////////////////////////////////////////////
                    }

                    let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS_CD", "", _getBerandSubstanceNames)
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                   
                } else if ((_data[_idx].BRAND_PRODUCT_CD && _data[_idx].FOOD_CD) || (_data[_idx].BRAND_PRODUCT_CD && _data[_idx].DIS_CD) || (_data[_idx].BRAND_PRODUCT_CD && _data[_idx].LAB_TEST_CD)) {
                    let _BrandWithDifferentTypes;
                    if (_data[_idx].FOOD_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", _getBerandSubstanceNames, _data[_idx].FOOD_CD.split(","))
                    } else if (_data[_idx].DIS_CD) {
                        let _getDiseaseCodesAganistICDS = await getDiseaseCodesAganistICDS(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter)
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ITEMS", "", _getBerandSubstanceNames, _getDiseaseCodesAganistICDS);
                    } else if (_data[_idx].LAB_TEST_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", _getBerandSubstanceNames, _data[_idx].LAB_TEST_CD.split(","))
                    }
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                } else if (_data[_idx].BRAND_PRODUCT_CD && _data[_idx].ALLERGY) {
                    let classAganistSubstances = await getDataBasedOnLooping(_getBerandSubstanceNames.data, 0, [], req, _filter, "dd_substance_classifications", "SUBSTANCE_AGANIST_CLASS");

                    let index = 0;
                    let substanceAganistClass;
                    let referenceIdAgnaistClassCd;
                    let allergyAgainstData;
                    while (index < _data[_idx].ALLERGY.length) {
                        if (_data[_idx].ALLERGY[index].TYPE == "DRUG" || _data[_idx].ALLERGY[index].TYPE == "Substance") {
                            substanceAganistClass = await getDataBasedOnLooping(_data[_idx].ALLERGY[index].ALLERGY_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_NAME");
                            allergyAgainstData = await getDataBasedOnLooping(_data[_idx].ALLERGY[index].ALLERGY_CD.split(","), 0, [], req, _filter, "allergy_master", "ALLERGY_NAME");
                            _.each(_getBerandSubstanceNames.data, (_o, _i) => {
                                _.each(JSON.parse(JSON.stringify(allergyAgainstData.data)), (_o1, _i1) => {
                                    if (_o.DD_SUBSTANCE_CD === _o1.ALLERGY_CD) {
                                        let _filterSubstanceAgnstClassData = _.filter(classAganistSubstances.data, (_obj, _indx) => { return _obj.DD_SUBSTANCE_CD === _o.DD_SUBSTANCE_CD })
                                        _output.push(
                                            {
                                                "INT_NAME": "Drug To Allergy",
                                                "BRAND_PRODUCT_NAME": _o.BRAND_NAME + "<-->" + _o1.ALLERGY_NAME,
                                                "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${_o['DD_SUBSTANCE_NAME']}.the prescribed medication ${_o.BRAND_NAME} includes ${_o1['ALLERGY_NAME']},which belongs to the class of medications known as ${_filterSubstanceAgnstClassData[0].CLASS_NAME}`
                                            }
                                        )
                                    }
                                })
                            })
                        } else if (_data[_idx].ALLERGY[index].TYPE == "CLASS") {
                            referenceIdAgnaistClassCd = await getDataBasedOnLooping(_data[_idx].ALLERGY[index].ALLERGY_CD.split(","), 0, [], req, _filter, "class_name", "REFERENCE")
                            let index1 = 0;
                            while (index1 < _getBerandSubstanceNames.data.length) {
                                let _totalBrandWithData = [];
                                _totalBrandWithData.push(_getBerandSubstanceNames.data[index1])
                                let classAganistSubstances = await getDataBasedOnLooping(_totalBrandWithData, 0, [], req, _filter, "dd_substance_classifications", "SUBSTANCE_AGANIST_CLASS");
                                _.each(classAganistSubstances.data, (_firstClass, _firstIndx) => {
                                    _.each(referenceIdAgnaistClassCd.data, (_secondClass, _secondIndx) => {
                                        if (_firstClass.CLASS_NAME_CD === _secondClass.CLASS_NAME_CD) {
                                            _output.push({
                                                "INT_NAME": "Drug To Allergy",
                                                "BRAND_PRODUCT_NAME": _getBerandSubstanceNames.data[index1].BRAND_NAME + "<-->" + _secondClass.CLASS_NAME,
                                                "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${_firstClass.DD_SUBSTANCE_NAME}.the prescribed medication ${_firstClass.BRAND_NAME} includes ${_secondClass['CLASS_NAME']},which belongs to the class of medications known as ${_firstClass.CLASS_NAME}`
                                            })
                                        }
                                    })
                                })
                                index1++;
                            }

                            // referenceIdAgnaistClassCd= await getDataBasedOnLooping(_data[_idx].ALLERGY[index].ALLERGY_CD.split(","), 0, [], req, _filter, "class_name", "REFERENCE")
                            // console.log("wdfgsdhfgsd",referenceIdAgnaistClassCd.data)
                            // _.each(classAganistSubstances.data, (_firstClass, _firstIndx) => {
                            //     _.each(referenceIdAgnaistClassCd.data, (_secondCalss, _secondIndx) => {
                            //         if (_firstClass.CLASS_NAME === _secondCalss.CLASS_NAME) {
                            //             _output.push(
                            //                 {   
                            //                     "INT_NAME": "Drug To Allergy",
                            //                     "BRAND_PRODUCT_NAME":_o.BRAND_NAME +"<-->"+_o1.ALLERGY_NAME,
                            //                     "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${_firstClass.DD_SUBSTANCE_NAME}.the prescribed medication ${_o.BRAND_NAME} includes ${_o1['ALLERGY_NAME']},which belongs to the class of medications known as ${_firstClass.CLASS_NAME}`
                            //                 }
                            //             )
                            //         }
                            //     })
                            // })
                        }
                        index++;
                    }

                    // let substanceAganistClass = await getDataBasedOnLooping(req.body.JSON[0].ALLERGY_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_NAME");
                    // let allergyAgainstData = await getDataBasedOnLooping(req.body.JSON[0].ALLERGY_CD.split(","), 0, [], req, _filter, "allergy_master", "ALLERGY_NAME");
                    // let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ALLERGY", "", _getBerandSubstanceNames, allergyAgainstData, classAganistSubstances, substanceAganistClass);
                    // console.log("sfdsdfgdjfg", _BrandWithDifferentTypes)
                    // _.each(_BrandWithDifferentTypes, (_Bo, _Bi) => {
                    //     _output.push(_Bo)
                    // })
                } else if ((_data[_idx].BRAND_PRODUCT_CD && _data[_idx].PREG_CD) &&  req.body.JSON[0].AGE =="Y" && req.body.JSON[0].GENDER =="Y" && req.body.JSON[0].ISPREGNANCY =="Y"){
                   let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", _getBerandSubstanceNames, _data[_idx].PREG_CD.split(",")) 
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                } else if ((_data[_idx].BRAND_PRODUCT_CD && _data[_idx].LACT_CD) &&  req.body.JSON[0].AGE =="Y" && req.body.JSON[0].GENDER =="Y" && req.body.JSON[0].ISLACTATION =="Y"){
                    let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", _getBerandSubstanceNames, _data[_idx].LACT_CD.split(",")) 
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                } else if (_data[_idx].CLS_CD && _data[_idx].DRUG_CD) {
                    _.each(interactingBrandAganistSubstances.data, (_IntDrgO, _IntDrgI) => {
                        classAganistSubstances.data.push(_IntDrgO)
                    })
                    let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS_CD", "", interactingBrandAganistSubstances)
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }

                } else if ((_data[_idx].CLS_CD && _data[_idx].FOOD_CD) || (_data[_idx].CLS_CD && _data[_idx].DIS_CD) || (_data[_idx].CLS_CD && _data[_idx].LAB_TEST_CD)) {
                    let _BrandWithDifferentTypes;
                    if (_data[_idx].FOOD_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", classAganistSubstances, _data[_idx].FOOD_CD.split(","))
                    } else if (_data[_idx].DIS_CD) {
                        let _getDiseaseCodesAganistICDS = await getDiseaseCodesAganistICDS(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter)
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ITEMS", "", classAganistSubstances, _getDiseaseCodesAganistICDS);
                        // _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ITEMS", "",classAganistSubstances,_data[_idx].DIS_CD.split(","))
                    } else if (_data[_idx].LAB_TEST_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", classAganistSubstances, _data[_idx].LAB_TEST_CD.split(","))
                    }
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                } else if ((_data[_idx].DRUG_CD && _data[_idx].FOOD_CD) || (_data[_idx].DRUG_CD && _data[_idx].DIS_CD) || (_data[_idx].DRUG_CD && _data[_idx].LAB_TEST_CD)) {
                    let _BrandWithDifferentTypes;
                    if (_data[_idx].FOOD_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", interactingBrandAganistSubstances, _data[_idx].FOOD_CD.split(","))
                    } else if (_data[_idx].DIS_CD) {
                        let _getDiseaseCodesAganistICDS = await getDiseaseCodesAganistICDS(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter)
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ITEMS", "", interactingBrandAganistSubstances, _getDiseaseCodesAganistICDS);
                        //_BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_ITEMS", "",interactingBrandAganistSubstances,_data[_idx].DIS_CD.split(","))
                    } else if (_data[_idx].LAB_TEST_CD) {
                        _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_FOOD_OR_LAB", "", interactingBrandAganistSubstances, _data[_idx].LAB_TEST_CD.split(","))
                    }
                    if (_BrandWithDifferentTypes.data.length > 0) {
                        _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
                            _output.push(_o)
                        })
                    }
                }
            } else {
                let filterKeyData = []
                let _fil = _.filter(_data[_idx], (_O, _I) => {
                    if (_O != "" && _I !== "TYPE") {
                        let _object = {}
                        _object[`${_I}`] = _O
                        filterKeyData.push(_object)
                    }
                })
                let _eachWiseData = await alertsWithSpecificKey(filterKeyData, 0, [], req, _filter)
                _.each(_eachWiseData.data, (_o, _i) => {
                    _output.push(_o)
                })
              //  console.log("sdfsdfgsdjhf")
            }
            _idx = _idx + 1
            await finalGetInteractionDataWithAllScenearios(_data, _idx, _output, req, _filterObj,_getBerandSubstanceNames)
        } else {
            return { success: true, data: _output }
        }
        let _final = _.filter(_output, (_r) => { return !_r.success });
        return {
            "success": _final.length > 0 ? false : true,
            "data": _output
        }
    } catch (error) {
       // console.log("efdfhgudfhfdgh", error)
    }
}

async function BrandWithDifferentTypes(_keys, _indx, _output, req, _filterObj, _type, res, _brandData, _itemType, _classData, _classData1) {
    let _comparisonData = []
    let _filter = {
        "filter": {
            "recStatus": { $eq: true }
        }
    }
    if (_type === "BRAND_WITH_CLASS") {
        let _ChildResponse = await getDataBasedOnLooping(_keys.CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD")
        if (_ChildResponse.data.length > 0) {
            _.each(_ChildResponse.data, (_o, _v) => {
                _brandData.data.push(_o)
            })
            if (_brandData.data.length > 1) {
                _.each(_brandData.data, (_o, _i) => {
                    _.each(_brandData.data, (_o1, _i1) => {
                        if (_o != _o1) {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                                    "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                                }
                            )
                        }
                    })
                })
                //GET DATA ONLY DRUG TO DRUG
                _output = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, "");
                // _.each(_getInteractionWithAlternative.data, (_o, _i) => {
                //     _finalData.alertsData.push(_o)
                // })
            }
        }
        return _output
        // return res.status(200).json({ success: true, status: 200, desc: '', data: _output });
    } else if (_type == "BRAND_WITH_CLASS_CD") {
        if (_brandData.data.length > 1) {
            _.each(_brandData.data, (_o, _i) => {
                _.each(_brandData.data, (_o1, _i1) => {
                    if (_o != _o1) {
                        _comparisonData.push(
                            {
                                "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
                                "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                                "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : "",
                                "SRC_SUBSTANCE_NAME": _o.DD_SUBSTANCE_NAME,
                                "INT_SUBSTANCE_NAME": _o1.DD_SUBSTANCE_NAME
                            }
                        )
                    }
                })
            })
            //GET DATA ONLY DRUG TO DRUG
            _output = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, "");
            // _.each(_getInteractionWithAlternative.data, (_o, _i) => {
            //     _finalData.alertsData.push(_o)
            // })
        }
        return _output
    } else if (_type == "BRAND_WITH_ITEMS") {
        if (req.body.JSON[0].TYPE === "" || req.body.JSON[0].TYPE === "ALL") {
            if (_brandData.data.length > 0) {
                _.each(_brandData.data, (_o, _i) => {
                    _.each(_itemType.data, (_o1, _i1) => {
                        if (_o != _o1) {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1.INT_TYPE_ID,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME  ? _o.BRAND_NAME : "",
                                    "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                                }
                            )
                        }
                    })
                })
                //GET DATA ONLY DRUG TO DRUG
                _output = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, "");
            }
        }
        // else {
        //     let _commonGetData = await commonGetData(_brandData.data, 0, [], req, _filter,"GIVEN_NOT_ONLY_BRAND_PRODUCT")
        //     if (_commonGetData.data.length > 0) {
        //         let _filterOnlyDiseaseData = _.filter(_commonGetData.data, (_obj, _indx) => { return _obj.INT_ID == 10 });
        //         if (_filterOnlyDiseaseData.length > 0) {
        //             _.each(_filterOnlyDiseaseData, (_IoBJ, _Iindx) => {
        //                 let _existmatch = _.filter(_itemType.data, (_itemObj, _itemIndx) => { return _itemObj.INT_TYPE_ID === _IoBJ.INT_TYPE_ID });
        //                 if (_existmatch.length > 0) {
        //                     _IoBJ['IS_EXIST'] = true
        //                 } else {
        //                     _IoBJ['IS_EXIST'] = false
        //                 }
        //             })
        //             _output['data'] = _filterOnlyDiseaseData
        //         }
        //     }
        // }
        return _output
    } else if (_type === "BRAND_WITH_FOOD_OR_LAB") {
        if (req.body.JSON[0].TYPE === ""  || req.body.JSON[0].TYPE === "ALL") {
            if (_brandData.data.length > 1) {
                _.each(_brandData.data, (_o, _i) => {
                    _.each(_itemType, (_o1, _i1) => {
                        if (_o != _o1) {
                            _comparisonData.push(
                                {
                                    "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
                                    "INT_TYPE_ID": _o1,
                                    "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
                                    "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
                                    "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
                                    "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
                                }
                            )
                        }
                    })
                })
                //GET DATA ONLY DRUG TO DRUG
                _output = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, "");
            }
        } 
        // else {
        //     let _commonGetData = await commonGetData(_brandData.data, 0, [], req, _filter,"GIVEN_NOT_ONLY_BRAND_PRODUCT")
        //     if (_commonGetData.data.length > 0) {
        //         let _filterOnlyDiseaseData = _.filter(_commonGetData.data, (_obj, _indx) => { return _obj.INT_ID == 10 });
        //         if (_filterOnlyDiseaseData.length > 0) {
        //             _.each(_filterOnlyDiseaseData, (_IoBJ, _Iindx) => {
        //                 let _existmatch = _.filter(_itemType.data, (_itemObj, _itemIndx) => { return _itemObj.INT_TYPE_ID === _IoBJ.INT_TYPE_ID });
        //                 if (_existmatch.length > 0) {
        //                     _IoBJ['IS_EXIST'] = true
        //                 } else {
        //                     _IoBJ['IS_EXIST'] = false
        //                 }
        //             })
        //             _output['data'] = _filterOnlyDiseaseData
        //         }
        //     }
        // }
        return _output
    } else if (_type == "BRAND_WITH_ALLERGY") {
        if (_brandData.data.length > 0) {
            _.each(_brandData.data, async (_o, _i) => {
                _.each(_itemType.data, async (_o1, _i1) => {
                    if (_o.DD_SUBSTANCE_CD === _o1.ALLERGY_CD) {
                        let _filterSubstanceAgnstClassData = _.filter(_classData.data, (_obj, _indx) => { return _obj.DD_SUBSTANCE_CD === _o.DD_SUBSTANCE_CD })
                        _output.push(
                            {
                                "INT_NAME": "Drug To Allergy",
                                "BRAND_PRODUCT_NAME": _o.BRAND_NAME + "<-->" + _o1.ALLERGY_NAME,
                                "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${_o['DD_SUBSTANCE_NAME']}.the prescribed medication ${_o.BRAND_NAME} includes ${_o1['ALLERGY_NAME']},which belongs to the class of medications known as ${_filterSubstanceAgnstClassData[0].CLASS_NAME}`
                            }
                        )
                    } else {
                        let _filterSubstanceAgnstClassData = _.filter(_classData.data, (_obj, _indx) => { return _obj.DD_SUBSTANCE_CD === _o.DD_SUBSTANCE_CD })
                        let _filterItemTypeAgnstClassData = _.filter(_classData1.data, (_obj1, _indx1) => { return _obj1.DD_SUBSTANCE_CD === _o1.ALLERGY_CD });
                        _.each(_filterSubstanceAgnstClassData, (_firstClass, _firstIndx) => {
                            _.each(_filterItemTypeAgnstClassData, (_secondCalss, _secondIndx) => {
                                if (_firstClass.CLASS_NAME === _secondCalss.CLASS_NAME) {
                                    _output.push(
                                        {
                                            "INT_NAME": "Drug To Allergy",
                                            "BRAND_PRODUCT_NAME": _o.BRAND_NAME + "<-->" + _o1.ALLERGY_NAME,
                                            "INTERACTIONS": `Drug allergy identified in response to the prescribed medication the patient has a documented history of drug allergy to ${_firstClass.DD_SUBSTANCE_NAME}.the prescribed medication ${_o.BRAND_NAME} includes ${_o1['ALLERGY_NAME']},which belongs to the class of medications known as ${_firstClass.CLASS_NAME}`
                                        }
                                    )
                                }
                            })
                        })
                    }
                })
            })
        }
        return _output
    }
}

// router.post("/get-allerts_1", async (req, res) => {
//     try {
//         let _filter = { "filter": { "recStatus": { $eq: true } } }
//         let _commaseperateData = "";
//         let _brandProductName = "";
//         let _comparisonData = [];
//         let _totalAllData = [];
//         let _finalData = {
//             alertsData: [],
//             mongraphData: []
//         }
//         let config = {
//             "data": req.body.params,
//             "headers": req.headers,
//             "url": req.protocol + '://' + req.headers.host + req.originalUrl,
//             "method": req.method
//         }
//         //JOINING AND GET MEDICINAL CD FROM BRAND_PRODUCT_CD START.
//         let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].BRAND_PRODUCT_CD.split(","), 0, [], req, _filter);
//         //JOINING AND GET MEDICINAL CD FROM BRAND_PRODUCT_CD END.

//         if (req.body.JSON[0].TYPE == "ALL" || req.body.JSON[0].TYPE == "") {
//             if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD.length > 0) {
//                 if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD == "" && req.body.JSON[0].FOOD_CD == "" && req.body.JSON[0].DIS_CD == "" && req.body.JSON[0].LAB_TEST_CD == "" && req.body.JSON[0].ALLERGY_CD == "") {
//                     if (_getBerandSubstanceNames.data.length > 1) {
//                         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                                 if (_o != _o1) {
//                                     _comparisonData.push(
//                                         {
//                                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
//                                             "BRAND_NAME_1": _o.BRAND_NAME,
//                                             "BRAND_NAME_2": _o1.BRAND_NAME
//                                         }
//                                     )
//                                 }
//                             })
//                         })
//                         //GET DATA ONLY DRUG TO DRUG
//                         let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                             _finalData.alertsData.push(_o)
//                         })
//                         //GET DATA REMAIG ALL TYPES
//                         let _commonGetData = await commonGetData(_getBerandSubstanceNames.data, 0, [], req, _filter)
//                         _.each(_commonGetData.data, (_o, _i) => {
//                             _finalData.alertsData.push(_o)
//                         })
//                     }
//                 }else {
//                     let _matchingInteractingKeys =[]
//                     _.each(req.body.JSON[0],(_v,_k)=>{
//                         if(_v !="" && _k !="TYPE"){
//                            _.each(req.body.JSON[0],(_v1,_k1)=>{
//                                let _obj ={}
//                                 if(_v1 !="" && _k1 !=_k && _k1 !="TYPE"){
//                                     _obj[`${_k}`] = _v
//                                     _obj[`${_k1}`] = _v1
//                                     if(_matchingInteractingKeys.length === 0){
//                                        _matchingInteractingKeys.push(_obj)
//                                     }else {
//                                        let _dd = _.filter(_matchingInteractingKeys,(_o,_i)=>{return JSON.stringify(_.orderBy(Object.keys(_o))) == JSON.stringify(_.orderBy(Object.keys(_obj)) )})
//                                        if(_dd.length == 0){
//                                            _matchingInteractingKeys.push(_obj)
//                                        }else {
//                                            console.log("dfsdjfgsdjhfgsj")
//                                        }
//                                     }
//                                 } 
//                            })
//                         }
//                     })

//                     let _finalGetInteractionDataWithAllScenearios= await finalGetInteractionDataWithAllScenearios(_matchingInteractingKeys,0,[],req,_filter)
//                     if(_finalGetInteractionDataWithAllScenearios.data.length > 0){
//                        _.each(_finalGetInteractionDataWithAllScenearios.data, (_o, _i) => {
//                            _finalData.alertsData.push(_o)
//                        })  

//                     }
//                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData,config: config });
//                 }
//                 //  else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD != "" && req.body.JSON[0].FOOD_CD == "" && req.body.JSON[0].DIS_CD == "" && req.body.JSON[0].LAB_TEST_CD == "") {
//                 //     let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS", res,_getBerandSubstanceNames)
//                 //     _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
//                 //         _finalData.alertsData.push(_o)
//                 //     })
//                 //     // let _ChildResponse = await getDataBasedOnLooping(req.body.JSON[0].CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD")
//                 //     // if (_ChildResponse.data.length > 0) {
//                 //     //     _.each(_ChildResponse.data, (_o, _v) => {
//                 //     //         _getBerandSubstanceNames.data.push(_o)
//                 //     //     })
//                 //     //     if (_getBerandSubstanceNames.data.length > 1) {
//                 //     //         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                 //     //             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                 //     //                 if (_o != _o1) {
//                 //     //                     _comparisonData.push(
//                 //     //                         {
//                 //     //                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                 //     //                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                 //     //                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
//                 //     //                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                 //     //                             "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
//                 //     //                             "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
//                 //     //                         }
//                 //     //                     )
//                 //     //                 }
//                 //     //             })
//                 //     //         })
//                 //     //         //GET DATA ONLY DRUG TO DRUG
//                 //     //         let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                 //     //         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                 //     //             _finalData.alertsData.push(_o)
//                 //     //         })
//                 //     //     }
//                 //     // }
//                 //   return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//                 // } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD != "" && req.body.params.JSON[0].CLS_CD != "" && req.body.params.JSON[0].FOOD_CD == "" && req.body.params.JSON[0].DIS_CD == "" && req.body.params.JSON[0].LAB_TEST_CD == "") {
//                 //     let _getInteractingBrandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter);
//                 //     _.each(_getInteractingBrandSubstanceNames.data, (_o, _i) => {
//                 //         _getBerandSubstanceNames.data.push(_o)
//                 //     });
//                 //     if (_getBerandSubstanceNames.data.length > 1) {
//                 //         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                 //             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                 //                 if (_o != _o1) {
//                 //                     _comparisonData.push(
//                 //                         {
//                 //                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                 //                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                 //                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
//                 //                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                 //                             "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
//                 //                             "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
//                 //                         }
//                 //                     )
//                 //                 }
//                 //             })
//                 //         })

//                 //         let _classPushingData = [];
//                 //         _.each(req.body.JSON[0].CLS_CD.split(","), (_splitObj, _splitIndx) => {
//                 //             _.each(_comparisonData, (_comO, _comI) => {
//                 //                 _classPushingData.push({
//                 //                     SRC_DRUG_CD: _comO.SRC_DRUG_CD,
//                 //                     INT_TYPE_ID: _comO.INT_TYPE_ID,
//                 //                     SRC_BRAND_PRODUCT_CD: _comO.SRC_BRAND_PRODUCT_CD,
//                 //                     INT_BRAND_PRODUCT_CD: _comO.INT_BRAND_PRODUCT_CD,
//                 //                     BRAND_NAME_1: _comO.BRAND_NAME_1,
//                 //                     BRAND_NAME_2: _comO.BRAND_NAME_2,
//                 //                     CLASS_NAME_CD: _splitObj,
//                 //                 })
//                 //             })
//                 //         })
//                 //         //GET DATA ONLY DRUG TO DRUG
//                 //         let _getInteractionWithAlternative = await getInteractionWithAlternative(_classPushingData, 0, [], req, _filter, _brandProductName);
//                 //         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                 //             _finalData.alertsData.push(_o)
//                 //         })
//                 //     }
//                 //     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//                 // } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD != "" && req.body.JSON[0].FOOD_CD != "" && req.body.JSON[0].DIS_CD == "" && req.body.JSON[0].LAB_TEST_CD == "") {
//                 //     let _BrandWithDifferentTypes = await BrandWithDifferentTypes(req.body.JSON[0], 0, [], req, _filter, "BRAND_WITH_CLASS", res,_getBerandSubstanceNames)
//                 //     _.each(_BrandWithDifferentTypes.data, (_o, _i) => {
//                 //         _finalData.alertsData.push(_o)
//                 //     })
//                 //     _.each(_getBerandSubstanceNames.data,(_o,_i)=>{
//                 //         _.each(req.body.JSON[0].FOOD_CD.split(","),(_o1,_i1)=>{
//                 //             if (_o != _o1) {
//                 //                 _comparisonData.push(
//                 //                     {
//                 //                         "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                 //                         "INT_TYPE_ID": _o1,
//                 //                         "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
//                 //                         "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                 //                         "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
//                 //                         "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
//                 //                     }
//                 //                 )
//                 //             } 
//                 //         })
//                 //     })
//                 //     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                 //     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                 //         _finalData.alertsData.push(_o)
//                 //     })
//                 //     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData }); 
//                 // } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD == "" && req.body.JSON[0].CLS_CD != "" && req.body.JSON[0].FOOD_CD != "" && req.body.JSON[0].DIS_CD == "" && req.body.JSON[0].LAB_TEST_CD == ""){

//                 // }
//             } else {
//                 let filterKeyData = []
//                 let _fil = _.filter(req.body.JSON[0], (_O, _I) => {
//                     if (_O != "" && _I !== "TYPE") {
//                         let _object = {}
//                         _object[`${_I}`] = _O
//                         filterKeyData.push(_object)
//                     }
//                 })

//                 let _eachWiseData = await alertsWithSpecificKey(filterKeyData, 0, [], req, _filter)
//                 _.each(_eachWiseData.data, (_o, _i) => {
//                     _finalData.alertsData.push(_o)
//                 })
//             }
//             return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData,config: config});
//         } else if (req.body.JSON[0].TYPE == "DRTODR") {
//             if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && (!(req.body.JSON[0].DRUG_CD)) && req.body.JSON[0].CLS_CD == "") {
//                 if (_getBerandSubstanceNames.data.length > 1) {

//                     _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                         _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                             if (_o != _o1) {
//                                 _comparisonData.push(
//                                     {
//                                         "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                         "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                                         "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                         "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
//                                         "BRAND_NAME_1": _o.BRAND_NAME,
//                                         "BRAND_NAME_2": _o1.BRAND_NAME
//                                     }
//                                 )
//                             }
//                         })
//                     })
//                     //GET DATA ONLY DRUG TO DRUG
//                     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                         _finalData.alertsData.push(_o)
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DRUG_CD != "" && req.body.JSON[0].CLS_CD == "") {
//                 let interactingbrandresp = await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter)
//                 _.each(interactingbrandresp.data, (_o, _i) => {
//                     _getBerandSubstanceNames.data.push(_o)
//                 })
//                 if (_getBerandSubstanceNames.data.length > 1) {
//                     _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                         _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                             if (_o != _o1) {
//                                 _comparisonData.push(
//                                     {
//                                         "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                         "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                                         "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                         "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD,
//                                         "BRAND_NAME_1": _o.BRAND_NAME,
//                                         "BRAND_NAME_2": _o1.BRAND_NAME
//                                     }
//                                 )
//                             }
//                         })
//                     })
//                     //GET DATA ONLY DRUG TO DRUG
//                     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                         _finalData.alertsData.push(_o)
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             } else if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].CLS_CD != "") {
//                 if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && (!(req.body.JSON[0].DRUG_CD)) && req.body.JSON[0].CLS_CD != "") {
//                     let _ChildResponse = await getDataBasedOnLooping(req.body.JSON[0].CLS_CD.split(","), 0, [], req, _filter, "dd_substance_classifications", "CLASS_CD")
//                     if (_ChildResponse.data.length > 0) {
//                         _.each(_ChildResponse.data, (_o, _v) => {
//                             _getBerandSubstanceNames.data.push(_o)
//                         })
//                         if (_getBerandSubstanceNames.data.length > 1) {
//                             _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                                 _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                                     if (_o != _o1) {
//                                         _comparisonData.push(
//                                             {
//                                                 "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                                 "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                                                 "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
//                                                 "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                                                 "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
//                                                 "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
//                                             }
//                                         )
//                                     }
//                                 })
//                             })
//                             //GET DATA ONLY DRUG TO DRUG
//                             let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                             _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                                 _finalData.alertsData.push(_o)
//                             })
//                         }
//                     }
//                     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//                 } else {
//                     let _getInteractingBrandSubstanceNames = await getBerandSubstanceNames(req.body.JSON[0].DRUG_CD.split(","), 0, [], req, _filter);
//                     _.each(_getInteractingBrandSubstanceNames.data, (_o, _i) => {
//                         _getBerandSubstanceNames.data.push(_o)
//                     });
//                     if (_getBerandSubstanceNames.data.length > 1) {
//                         _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                             _.each(_getBerandSubstanceNames.data, (_o1, _i1) => {
//                                 if (_o != _o1) {
//                                     _comparisonData.push(
//                                         {
//                                             "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                             "INT_TYPE_ID": _o1.DD_SUBSTANCE_CD,
//                                             "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD ? _o.BRAND_CD : "",
//                                             "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                                             "BRAND_NAME_1": _o.BRAND_NAME ? _o.BRAND_NAME : "",
//                                             "BRAND_NAME_2": _o1.BRAND_NAME ? _o1.BRAND_NAME : ""
//                                         }
//                                     )
//                                 }
//                             })
//                         })

//                         let _classPushingData = [];
//                         _.each(req.body.JSON[0].CLS_CD.split(","), (_splitObj, _splitIndx) => {
//                             _.each(_comparisonData, (_comO, _comI) => {
//                                 _classPushingData.push({
//                                     SRC_DRUG_CD: _comO.SRC_DRUG_CD,
//                                     INT_TYPE_ID: _comO.INT_TYPE_ID,
//                                     SRC_BRAND_PRODUCT_CD: _comO.SRC_BRAND_PRODUCT_CD,
//                                     INT_BRAND_PRODUCT_CD: _comO.INT_BRAND_PRODUCT_CD,
//                                     BRAND_NAME_1: _comO.BRAND_NAME_1,
//                                     BRAND_NAME_2: _comO.BRAND_NAME_2,
//                                     CLASS_NAME_CD: _splitObj,
//                                 })
//                             })
//                         })
//                         //GET DATA ONLY DRUG TO DRUG
//                         let _getInteractionWithAlternative = await getInteractionWithAlternative(_classPushingData, 0, [], req, _filter, _brandProductName);
//                         _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                             _finalData.alertsData.push(_o)
//                         })
//                     }
//                     return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//                 }
//             }
//         } else if (req.body.JSON[0].TYPE == "DRTOFD") {
//             if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].FOOD_CD != "") {
//                 if (_getBerandSubstanceNames.data.length > 1) {
//                     _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                         _.each(req.body.JSON[0].FOOD_CD.split(","), (_o1, _i1) => {
//                             _comparisonData.push(
//                                 {
//                                     "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                     "INT_TYPE_ID": _o1,
//                                     "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                     "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                                     "BRAND_NAME_1": _o.BRAND_NAME
//                                 }
//                             )
//                         })
//                     })
//                     //GET DATA ONLY DRUG TO DRUG
//                     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                         _finalData.alertsData.push(_o)
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].FOOD_CD != "") {
//                 let _foodResponse = await getDataBasedOnLooping(req.body.JSON[0].FOOD_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "FOOD");
//                 _.each(_foodResponse.data, (_fo, _fi) => {
//                     _finalData.alertsData.push(_fo)
//                 })
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             }
//         } else if (req.body.JSON[0].TYPE == "DRTODIS") {
//             if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].DIS_CD != "") {
//                 if (_getBerandSubstanceNames.data.length > 1) {
//                     _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                         _.each(req.body.JSON[0].DIS_CD.split(","), (_o1, _i1) => {
//                             _comparisonData.push(
//                                 {
//                                     "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                     "INT_TYPE_ID": _o1,
//                                     "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                     "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                                     "BRAND_NAME_1": _o.BRAND_NAME
//                                 }
//                             )
//                         })
//                     })
//                     //GET DATA ONLY DRUG TO DRUG
//                     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                         _finalData.alertsData.push(_o)
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].DIS_CD != "") {
//                 let _foodResponse = await getDataBasedOnLooping(req.body.JSON[0].DIS_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "DISEASE");
//                 _.each(_foodResponse.data, (_fo, _fi) => {
//                     _finalData.alertsData.push(_fo)
//                 })
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             }
//         } else if (req.body.JSON[0].TYPE == "DRTOLAB") {
//             if (req.body.JSON[0].BRAND_PRODUCT_CD && req.body.JSON[0].BRAND_PRODUCT_CD != "" && req.body.JSON[0].LAB_TEST_CD != "") {
//                 if (_getBerandSubstanceNames.data.length > 1) {
//                     _.each(_getBerandSubstanceNames.data, (_o, _i) => {
//                         _.each(req.body.JSON[0].LAB_TEST_CD.split(","), (_o1, _i1) => {
//                             _comparisonData.push(
//                                 {
//                                     "SRC_DRUG_CD": _o.DD_SUBSTANCE_CD,
//                                     "INT_TYPE_ID": _o1,
//                                     "SRC_BRAND_PRODUCT_CD": _o.BRAND_CD,
//                                     "INT_BRAND_PRODUCT_CD": _o1.BRAND_CD ? _o1.BRAND_CD : "",
//                                     "BRAND_NAME_1": _o.BRAND_NAME
//                                 }
//                             )
//                         })
//                     })
//                     //GET DATA ONLY DRUG TO DRUG
//                     let _getInteractionWithAlternative = await getInteractionWithAlternative(_comparisonData, 0, [], req, _filter, _brandProductName);
//                     _.each(_getInteractionWithAlternative.data, (_o, _i) => {
//                         _finalData.alertsData.push(_o)
//                     })
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             } else if (req.body.JSON[0].BRAND_PRODUCT_CD == "" && req.body.JSON[0].LAB_TEST_CD != "") {
//                 let _diseaseResponse = await getDataBasedOnLooping(req.body.JSON[0].LAB_TEST_CD.split(","), 0, [], req, _filter, "drugchildinteraction", "LAB");
//                 _.each(_diseaseResponse.data, (_fo, _fi) => {
//                     _finalData.alertsData.push(_fo)
//                 })
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
//             }
//         } else if (req.body.JSON[0].TYPE == "MONOGRAPH") {
//             // let _getBerandSubstanceNames = await getBerandSubstanceNames(req.body.params.BRAND_PRODUCT_CD.split(","), 0, [], req, _filter)
//             if (_getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0) {
//                 _filter.filter['DD_SUBSTANCE_CD'] = _getBerandSubstanceNames.data && _getBerandSubstanceNames.data.length > 0 ? _getBerandSubstanceNames.data[0].DD_SUBSTANCE_CD : ""
//                 let _mBrandProductResp = await _mUtils.commonMonogoCall("monography_sections", "find", _filter, "", "", "", "")
//                 if (!(_mBrandProductResp && _mBrandProductResp.success)) {
//                     return res.status(400).json({ success: false, status: 400, desc: _mBrandProductResp.desc || "", data: _mBrandProductResp.data || [] });
//                 }
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: _mBrandProductResp.data });
//             } else {
//                 return res.status(200).json({ success: true, status: 200, desc: '', data: [] });
//             }
//         }

//     } catch (error) {
//         console.log(error)
//     }
// })



// async function getDiseaseCodesAganistICDS(_data, _idx, _output, req, _filterObj) {
//     try {
//         if (_data.length > _idx) {
//             let _filter = {
//                 "filter": {
//                     "recStatus": { $eq: true }
//                 }
//             }
//             let _icdCodeData = [
//                 {
//                     "INT_TYPE_ID": "N0000002351",
//                     "ICD": "K27"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000002932",
//                     "ICD": "D69.6"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001382",
//                     "ICD": "M10.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000010941",
//                     "ICD": "K72.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000171642",
//                     "ICD": "N19"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000000498",
//                     "ICD": "J45.909"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000002830",
//                     "ICD": "K25"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001434",
//                     "ICD": "I50.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001482",
//                     "ICD": "K92.2"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000000721",
//                     "ICD": "I61.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001485",
//                     "ICD": "D69.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000002729",
//                     "ICD": "R57.0"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001649",
//                     "ICD": "I95.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000002362",
//                     "ICD": "I30.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000000687",
//                     "ICD": "I42.1"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000000722",
//                     "ICD": "I63.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000004102",
//                     "ICD": "I62.9"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001047",
//                     "ICD": "O15"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000002473",
//                     "ICD": "O14"
//                 },
//                 {
//                     "INT_TYPE_ID": "N0000001617",
//                     "ICD": "I10"
//                 }
//             ]
//             let _icdInfo = _.filter(_icdCodeData, (_obj, _indx) => { return _obj.ICD === _data[_idx] })
//             if (_icdInfo.length > 0) {
//                 _output.push(_icdInfo[0])
//             } else {
//                 _output.push({
//                     "INT_TYPE_ID": _data[_idx],
//                     "ICD": ""
//                 })
//             }
//             _idx = _idx + 1
//             await getDiseaseCodesAganistICDS(_data, _idx, _output, req, _filterObj)
//         } else {
//             return { success: true, data: _output }
//         }
//         let _final = _.filter(_output, (_r) => { return !_r.success });
//         return {
//             "success": _final.length > 0 ? false : true,
//             "data": _output
//         }
//     } catch (error) {
//         console.log("efdfhgudfhfdgh", error)
//     }
// }


async function getDiseaseCodesAganistICDS(_data, _idx, _output, req, _filterObj) {
        try {
            if (_data.length > _idx) {
                let _filter = {
                    "filter": {
                        "recStatus": { $eq: true }
                    }
                }
                
                _filter.filter['$or']=[
                    {
                        "ICD_CODE": _data[_idx]
                    },
                    {
                        "DISEASE_MAP_CD": _data[_idx]
                    }
                ] 
            
                let _mRespData = await _mUtils.commonMonogoCall(`monography_diseasemapping`, "find", _filter, "", "", "", "")
                if (!(_mRespData && _mRespData.success)) {
                    return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
                }else{
                    if(_mRespData.data.length > 0){
                        _output.push({
                            "INT_TYPE_ID": _mRespData.data[0].DISEASE_MAP_CD,
                            "DIS_NAME": _mRespData.data[0].DISEASE_NAME
                        }) 
                    }
                }
                _idx = _idx + 1
                await getDiseaseCodesAganistICDS(_data, _idx, _output, req, _filterObj)
            } else {
                return { success: true, data: _output }
            }
            let _final = _.filter(_output, (_r) => { return !_r.success });
            return {
                "success": _final.length > 0 ? false : true,
                "data": _output
            }
        } catch (error) {
            //console.log("efdfhgudfhfdgh", error)
        }
    }



/* Insert documnets Data */
router.post("/insert-document", async (req, res) => {
    try {
        mongoMapper('monography_document', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Insert documnets Data */
router.post("/insert-food_master", async (req, res) => {
    try {
        let _seqResp = await _mUtils.getSequenceNextValue({ locId: req.tokenData.locId, seqName: 'Foodmaster' }, "monography", req);
        if (!(_seqResp && _seqResp.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _seqResp.desc || "", data: _seqResp.data || [] });
        }
        req.body.params['FOOD_MASTER_CD'] = _seqResp.data
        mongoMapper('monography_food_master', req.body.query, req.body.params).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

// Append audit for childs
function childAuditAppend(_data, _by) {
    _.each(_data[`${_by}`], (_l) => {
        _l.audit = _data.audit;
    });
    return _data;
};

/**insert-entities */
router.post("/insert-entity", async (req, res) => {
    try {
        if (req.body && req.body.params) {
            req.body.params = await childAuditAppend(req.body.params, "child");
            let _query = "insertMany";
            let _params = req.body.params;
            let _filter = {
                "filter": { "cd": req.body.params.cd, recStatus: true },
                "selectors": "-audit -history"
            }
            let _mResp = await _mUtils.commonMonogoCall("monography_entity", "find", _filter, "", "", "", "");
            if ((_mResp && _mResp.success && _mResp.data && _mResp.data.length > 0)) {
                req.body.params._id = _mResp.data[0]._id;
                _query = "findOneAndUpdate";
                let pLoadResp = { payload: {} };
                pLoadResp = await _mUtils.preparePayload("U", req.body);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                else {
                    _params = pLoadResp.payload;
                }
            }
            mongoMapper('monography_entity', _query, _params, "").then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/* Insert Data */
router.post("/update-assigned_data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "INT_ID": { $nin: [13,14] }
            }
        }
        let _data = []
        let _mRespData = await _mUtils.commonMonogoCall(`monography_staging_drugchildinteraction`, "find", _filter, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        }
        _.each(JSON.parse(JSON.stringify(_mRespData.data)), (_obj, _indx) => {
            _obj.audit = req.body.params.audit
            _data.push(_obj)
        })
        //. req.body.params = _mRespData.data
        let _mRespData1 = await _mUtils.commonMonogoCall(`monography_drugchildinteraction`, "insertMany", _data, "", "", "", "")
        return res.status(200).json({ success: true, status: 200, desc: '', data: _mRespData1.data });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

/* Insert Data */
router.post("/update-change_data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "INT_TYPE_ID": { $regex: "N", $options: "i" },

            }
        }
        let _data = []
        let _mRespData = await _mUtils.commonMonogoCall(`monography_drugchildinteraction`, "find", _filter, "", "", "", "")
        if (!(_mRespData && _mRespData.success)) {
            return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
        }
        let _indx = 0
        let _data1 = JSON.parse(JSON.stringify(_mRespData.data))
        while (_data1.length > _indx) {
            delete _filter.filter.INT_TYPE_ID
            _filter.filter['REFERENCE_ID'] = _data1[_indx].INT_TYPE_ID.split(",")[0].trim();
            let _mRespData1 = await _mUtils.commonMonogoCall(`monography_class_name`, "find", _filter, "", "", "", "")
           // console.log("sdfhsdgf", _mRespData1.data)
           // console.log("datttttttttttttttttttttttt", _indx)
            if (_mRespData1.data.length > 0) {
                let patData = {
                    "params": {
                        "_id": _data1[_indx]._id,
                        "INT_TYPE_ID": "",
                        "INT_TYPE_NAME": "",
                        "CLASS_NAME_CD": JSON.parse(JSON.stringify(_mRespData1.data))[0].CLASS_NAME_CD,
                        "CLASS_NAME": JSON.parse(JSON.stringify(_mRespData1.data))[0].CLASS_NAME,
                    }
                }

                let pLoadResp = { payload: {} };
                patData.params.audit = {};
                patData.params.audit["modifiedById"] = req.tokenData.userId;
                patData.params.audit["modifiedByBy"] = req.tokenData.displayName;
                patData.params.audit["modifiedByDt"] = new Date().toISOString();
                patData.params.revNo = _data1[_indx].revNo + 1;

                pLoadResp = await _mUtils.preparePayload("BW", patData);
                if (!pLoadResp.success) {
                    resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }

                let _uResp = await _mUtils.commonMonogoCall("monography_drugchildinteraction", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                if (!(_uResp && _uResp.success && _uResp.data)) {
                   // console.log("sgbhdfgbudfgydfgb")
                    // _output.push({ success: false, status: 400, desc: _uResp.desc || 'Error occurred while insert User ..', data: [] }) ;
                }
              //  console.log("gsdgjhsdgd", _filter)
            }

            _indx++;
        }
        return res.status(200).json({ success: true, status: 200, desc: "", data: _data1 || [] });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});

router.post("/update-brand-product-data", async (req,res) => {
    try {
        let _data = ["STRM00001298","STRM00001299","STRM00001381","STRM00001382","STRM00001383","STRM00001384","STRM00001447"]
        let _data_volume = ["5 mL/ 1 Vial","2 mL/ 1 Ampule","1 Tablet/ 1 Strip","2 Tablet/ 1 Strip","5 Tablet/ 1 Strip","6 Tablet/ 1 Strip","5 mL/ 1 Bottle"]
        let _data_update = ["STRM00001375","STRM00001374","STRM00001544","STRM00001446","STRM00001440","STRM00001450","STRM00001434"]
        let _indx = 0;
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
               
            }
        }
        while (_data.length > _indx) {            
            _filter.filter['VOLUME_CD'] = _data[_indx]
            _filter.filter['VOLUME_NAME'] = _data_volume[_indx]
            let _mRespData = await _mUtils.commonMonogoCall(`monography_brand_product_mapping`, "find", _filter, "", "", "", "")
            if (!(_mRespData && _mRespData.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mRespData.desc || "", data: _mRespData.data || [] });
            }
            let _Indx1 = 0;
            if (_mRespData.data.length > 0) {
                while (_mRespData.data.length > _Indx1) {
                        let patData = {
                            "params": {
                                "_id": _mRespData.data[_Indx1]._id,
                                "VOLUME_CD": _data_update[_indx]
                            }
                        }
                        pLoadResp = await _mUtils.preparePayload("BW", patData);
                        if (!pLoadResp.success) {
                            resolve({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                        }

                        let _uResp = await _mUtils.commonMonogoCall("monography_brand_product_mapping", 'bulkWrite', pLoadResp.payload, "", "", "", req.tokenData.dbType);
                       // console.log("_uResp", _uResp.data)

                    _Indx1++;
                }
            }
            _indx++;
        }
        console('brand_product_volume_cd')
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error.message || error });
    }
});


module.exports = router;


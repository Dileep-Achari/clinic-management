const router = require("express").Router();
const mongoMapper = require("../../../../db-config/helper-methods/mongo/mongo-helper");
 const _ = require('lodash');
// const axios = require("axios");
 const axios1 = require("../../../../services/axios")
// const { transform } = require('node-json-transform');
// const imageThumbnail = require('image-thumbnail');
const moment = require('moment');
const _mUtils = require("../../../../constants/mongo-db/utils");
// const _transformapi = require('../patientcare/transformation');
const _token = require("../../../../services/token");
// const _util = require("../../../utilities/is-valid")
// const model = require("../../../db-config/helper-methods/mongo/preparePayload");
// const getTemplateData = require("../../../constants/mongo-db/getTemplate.json")
 const _orgDetails = require("../../patientcare/constants/organizations");
 let getDataurl = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"


router.post("/get-db-data", async (req, res) => {
    try {
        let url =getDataurl
        let params = {
            "TYPE": req.body.params.type,
            "FLAG": "A"
        }
        axios1.post(url, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-drugDetail-data", async (req, res) => {
    try {
        let url =getDataurl
        let params = {
           "TYPE": req.body.params.type,
            "FLAG": req.body.params.flag,
            "DOC_CODE": req.body.params.DOC_CODE
        }
        axios1.post(url, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-frequently-data", async (req, res) => {
    try {
        let url = getDataurl
        let params = {
           "TYPE": req.body.params.type,
            "FLAG": req.body.params.flag
        }
        axios1.post(url, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-avail-combination-data", async (req, res) => {
    try {
        let url = getDataurl
        let params = {
            "TYPE": req.body.params.type,
                "FLAG": req.body.params.flag,
                "DOC_CODE":req.body.params.doc_code,
                "ID3":req.body.params.id3,
                "ID1":req.body.params.id1,
                "ID":req.body.params.id,
                "ID2":req.body.params.id2   
        //    "TYPE": "COMB_EXT",
        //     "FLAG": "COMB",
        //     "DOC_CODE":"PD00000108",
        //     "ID3":"DRUG",
        //     "ID1":"SSE0000115",
        //     "ID":"Ampicillin",
        //     "ID2":"search"   
        }
        axios1.post(url, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

router.post("/get-sections-data", async (req, res) => {
    try {
        let data = []
        if (req.body && req.body.params && req.body.params.searchCode && req.body.params.searchCode.length > 2) {
            let searchData = { $regex: req.body.params.searchCode, $options: 'i' }
            let _filter = {
                "filter": {
                    "recStatus": true
                   // "medicinalCode": searchData
                },
                // "selectors": selector
            }
            let dd=[]
            let _mResp1 = await _mUtils.commonMonogoCall("monography_drugcreation", "find", _filter);
           let search = req.body.params.searchCode
              let _mResp = _.filter(_mResp1.data,(obj,indx)=>{return obj.medicinalCode.includes(search)})
              if(_mResp.length > 0){
                _.each(_mResp, (obj, ind) => {
                    _.each(obj.template, (tObj, tIndx) => {
                        if (tIndx === "hcp" && req.body.params.flag === "hcp") {
                            _.each(tObj, (tObj1, tIndx) => {
                                if (tObj1.data !== "") {
                                    data.push(tObj1)
                                }
                            })
                        } else if (tIndx === "patient" && req.body.params.flag === "patient") {
                            _.each(tObj, (tObj1, tIndx) => {
                                if (tObj1.data !== "") {
                                    data.push(tObj1)
                                }
                            })
                        }
                    })
                })
              }else{
                return res.status(400).json({ success: false, status: 400, desc: 'provide valid details', data: [] });
              }
            return res.status(200).json({ success: true, status: 200, desc: '', data: data });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});


// router.post("/get-sections-data", async (req, res) => {
//     try {
//         let data = []
//         if (req.body && req.body.params && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
//           //  let searchData = { $regex: req.body.params.searchValue}
//             let _filter = {
//                 "filter": {
//                     "recStatus": true,
//                     "drug_id": req.body.params.searchValue
//                 },
//                 // "selectors": selector
//             }     
//             let _mResp = await _mUtils.commonMonogoCall("monography_staging_sections", "find", _filter);
           
//             // if(req.body.params.flag === "HCP"){
//             // _.each(_mResp.data, (obj, ind) => {
//             //     _.each(obj.template, (tObj, tIndx) => {
//             //         if (tIndx === "hcp" && req.body.params.flag === "HCP") {
//             //             _.each(tObj, (tObj1, tIndx) => {
//             //                 if (tObj1.data !== "") {
//             //                     data.push(tObj1)
//             //                 }
//             //             })
//             //         } else if (tIndx === "patient" && req.body.params.flag === "PATIENT") {
//             //             _.each(tObj, (tObj1, tIndx) => {
//             //                 if (tObj1.data !== "") {
//             //                     data.push(tObj1)
//             //                 }
//             //             })
//             //         }
//             //     })
//             // })
//             //  }
//             // mongoMapper("cm_investigations", req.body.query, _filter, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: _mResp.data });
//             // }).catch((error) => {
//             //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//             // });
//         } else {
//             return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing ..", data: [] });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });

module.exports = router;
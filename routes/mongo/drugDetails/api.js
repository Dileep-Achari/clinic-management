const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper")
//const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const axios = require("axios");
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
let getDataurl = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"


/**get data from sql server with limit records */
router.post("/get-db-data", async (req, res) => {
    try {
        // let url=getDataurl
        let params={
            "TYPE":"DD_DRUG_MASTER",
            "FLAG":"DD_DRUG",
            "STATUS":req.body.params.status ? req.body.params.status :"",
            "VAL1" :req.body.params.val1 ? req.body.params.val1 :"",
            "ID":req.body.params.id ? req.body.params.id :""
        }
       axios1.post(getDataurl,params).then((response)=>{
           let filterData=response.data.slice(0,10)
        return res.status(200).json({ success: true, status: 200,data :filterData, desc: "" });
      }).catch((err)=>{
          console.log("err",err)
      })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data :[],desc: error });
    }
});

/**get search data fro m sql server */
router.post("/get-search-db-data", async (req, res) => {
    try {
        let url="https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
        let params={
            "TYPE":"DD_DRUG_MASTER",
            "FLAG":"DD_DRUG",
            "STATUS":req.body.params.status ? req.body.params.status :"",
            "VAL1" :req.body.params.val1 ? req.body.params.val1 :"",
            "ID":req.body.params.id ? req.body.params.id :""
        }
        let finalData=[]
       axios1.post(url,params).then((response)=>{
            _.each(response.data,(_ro,_ri)=>{
               if(_ro.DD_SUBSTANCE_COMB_NAME.toLowerCase().includes(req.body.params.searchValue.toLowerCase())){
                   finalData.push(_ro)
               }
            })
        return res.status(200).json({ success: true, status: 200,data :finalData, desc: "" });
      }).catch((err)=>{
           
      })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data :[],desc: error });
    }
});

// router.post("/get-db-data", async (req, res) => {
//     try {
//         let url = "http://172.30.29.107:9001/pharmacy/api/getMasterData"
//         let params = {
//             "TYPE": req.body.params.type,
//             "FLAG": "A"
//         }
//         axios1.post(url, params).then((response) => {
//             return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
//         }).catch((err) => {
//             console.log("err", err)
//         })
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, data: [], desc: error });
//     }
// });


router.post("/get-drugDetail-data", async (req, res) => {
    try {
        let url = getDataurl
        let params = {
           "TYPE": req.body.params.type,
            "FLAG": req.body.params.flag,
            "SEARCH_COL": req.body.params.search_col,
            "SEARCH_TYPE": req.body.params.search_type,
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

/* get frequent data */
router.post("/get-frequently-data", async (req, res) => {
    try {
      //  let url = "http://172.30.29.107:9001/pharmacy/api/getMasterData"
     // let url = "https://emr.doctor9.com/napi_cmn/pharmacyv1/api/getMasterData"
        let params = {
           "TYPE": req.body.params.type,
            "FLAG": req.body.params.flag
        }
        axios1.post(getDataurl, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});

/*get availble combination data */
router.post("/get-avail-combination-data", async (req, res) => {
    try {
    //  let url = getDataurl
     
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
        axios1.post(getDataurl, params).then((response) => {
            return res.status(200).json({ success: true, status: 200, data: response.data, desc: "" });
        }).catch((err) => {
            console.log("err", err)
        })
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, data: [], desc: error });
    }
});


/*get sections data*/
// router.post("/get-sections-data", async (req, res) => {
//     try {
//         let data = []
//         if (req.body && req.body.params && req.body.params.searchValue && req.body.params.searchValue.length > 2) {
//             let searchData = { $regex: req.body.params.searchValue, $options: 'i' }
//             let _filter = {
//                 "filter": {
//                     "recStatus": true,
//                     "documentTitle": searchData
//                 },
//                 // "selectors": selector
//             }
//             let _mResp = await _mUtils.commonMonogoCall("monography_drugcreation", "find", _filter);
//             //  console.log("_mResp",_mResp)
//             // if(req.body.params.flag === "HCP"){
//             _.each(_mResp.data, (obj, ind) => {
//                 _.each(obj.template, (tObj, tIndx) => {
//                     if (tIndx === "hcp" && req.body.params.flag === "HCP") {
//                         _.each(tObj, (tObj1, tIndx) => {
//                             if (tObj1.data !== "") {
//                                 data.push(tObj1)
//                             }
//                         })
//                     } else if (tIndx === "patient" && req.body.params.flag === "PATIENT") {
//                         _.each(tObj, (tObj1, tIndx) => {
//                             if (tObj1.data !== "") {
//                                 data.push(tObj1)
//                             }
//                         })
//                     }
//                 })
//             })
//             //  }
//             // mongoMapper("cm_investigations", req.body.query, _filter, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: data });
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

// router.post("/get-section-data", async (req, res) => {
//     try {
//         let _filter = {
//             "filter": {
//                 "recStatus": { $eq: true },
//                 "drug_section_id": req.body.params.drug_section_id,
//                 "DD_DRUG_MASTER_CD": req.body.params.drug_master_code,
//                 "role_id": req.body.params.roleId
//             },
//             "selectors": "-history"
//         }
//         let _pGData = await prepareGetPayload(_filter, req.body.params);
//         if (!_pGData.success) {
//             return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
//         }
//         mongoMapper("monography_sections", "find", _pGData.data, req.tokenData.dbType).then((result) => {
//             return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//         }).catch((error) => {
//             return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error });
//     }
// });

router.post("/get-section-data", async (req, res) => {
    try {
        let _filter = {
            "filter": {
                "recStatus": { $eq: true },
                "DD_DRUG_MASTER_CD": req.body.params.searchCode,
                "SECTION_TYPE":req.body.params.flag
            },
            "selectors": "-history"
        } 
        if(req.body.params.flag==="patient" || req.body.params.flag==="hcp"){
            let data=_.filter(getTemplateData.data,(value,key)=>{return key===req.body.params.flag})
            console.log("data",data)
            let _sessionRes = await _mUtils.commonMonogoCall("monography_production_sections", "find", _filter, "", "", "", "")
            
            if(_sessionRes.data.length > 0 ){
                _.each(_sessionRes.data,(obj,indx)=>{
                    _.each(data[0],(gObj,gIndx)=>{
                          if(obj.drug_section_id ===gObj._id){
                            gObj.data=obj.drug_content
                          }
                          if(gObj.children.length > 0){
                             _.each(gObj.children,(gcObj,gcIndx)=>{
                                if(obj.drug_section_id ===gcObj._id){
                                    gcObj.data=obj.drug_content
                                }
                             })
                          }
                    })
                 })
              return res.status(200).json({ success: true, status: 200, desc: '', data:data[0] });
            }else {
                return res.status(200).json({ success: true, status: 200, desc: '', data:data[0] });
            }

        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valid details", data: [] });
        }

        // let _pGData = await prepareGetPayload(_filter, req.body.params);
        // if (!_pGData.success) {
        //     return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        // }
        // mongoMapper("monography_sections", "find", _pGData.data, req.tokenData.dbType).then((result) => {
        //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        // }).catch((error) => {
        //     return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        // });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

module.exports = router;
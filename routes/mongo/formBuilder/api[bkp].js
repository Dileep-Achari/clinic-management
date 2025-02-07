const router = require("express").Router();
const _ = require('lodash');
const moment = require('moment');

const axios1 = require("../../../services/axios")
const axios = require("axios");
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _token = require("../../../services/token");
const _mUtils = require("../../../constants/mongo-db/utils");
const fs = require("fs")
const path = require("path")
const countryDetails = require("./countryDetails.json")

//Read Files
async function readFileData(_url) {
    try {
        return new Promise((resolve, reject) => {
            fs.readFile(_url, "utf8", (err, data) => {
                if (err) {
                    resolve({
                        success: false,
                        desc: err,
                        data: []
                    })
                }
                else {
                    resolve({
                        success: true,
                        data: JSON.parse(data)
                    })
                }
            });
        });
    }
    catch (err) {
        return {
            success: false,
            desc: err.message,
            data: []
        }
    }
}

router.get("/", (req, res) => {
    res.send("Api working Fine")
})
router.post('/saveForm', async (req, res) => {
    try {
        if (req.body) {
            fs.readFile(path.join(__dirname, `/jsons/forms.json`), 'utf8', async function (err, oData) {
                if (!oData)
                    return res.status(404).json({ messege: "FAIL", status: "4", error: "File not found" });
                else {
                    let _data = JSON.parse(oData)
                    let resp = _data
                    await resp.push(req.body.json)
                    await fs.writeFile(path.join(__dirname, `/jsons/forms.json`), JSON.stringify(resp), async function (err, oData) {
                        return res.status(200).json({ messege: "SUCCESS", status: "200", data: [] });
                    })
                }
            });
        }
        else {
            return res.status(400).send({
                "Status": 400,
                "StatusMessage": "Fail",
                "data": "please Provide details"
            })
        }
    }
    catch (ex) {
        return res.status(500).json({ messege: "FAIL", status: "4", error: ex });
    }
});

router.post("/getFormsData", async (req, res) => {
    try {
        fs.readFile(path.join(__dirname, `/jsons/forms.json`), 'utf8', function (err, oData) {
            if (!oData)
                return res.status(404).json({ messege: "FAIL", status: "4", error: "File not found" });
            else {
                let _data = JSON.parse(oData)
                return res.status(200).json({ messege: "SUCCESS", status: "1", data: _data });
            }
        });
    } catch (error) {
        return res.status(400).send({
            "Status": 400,
            "StatusMessage": "Fail",
            "data": error
        })
    }
});

router.post("/getFormId", async (req, res) => {
    try {
        if (req.body.formId) {
            fs.readFile(path.join(__dirname, `/jsons/forms.json`), 'utf8', function (err, oData) {
                if (!oData)
                    return res.status(404).json({ messege: "FAIL", status: "4", error: "File not found" });
                else {
                    let _data = JSON.parse(oData)
                    let finalResp = _.filter(_data, (o) => { return o.formId == req.body.formId });
                    if (finalResp && finalResp.length > 0) {
                        return res.status(200).json({ messege: "SUCCESS", status: "200", data: finalResp });
                    } else {
                        return res.status(400).json({ messege: "fail", status: "400", data: "no Data Found" });
                    }

                }
            });
        }
        else {
            return res.status(400).send({
                "Status": 400,
                "StatusMessage": "Fail",
                "data": "Please Provide id"
            })
        }
    } catch (error) {
        return res.status(400).send({
            "Status": 400,
            "StatusMessage": "Fail",
            "data": error
        })
    }
});

router.post("/getlabel-transaction", (req, res) => {
    try {
        let finalData = {
            "status": "",
            "statusmessage": "",
            "data": []
        }
        let finalobj = fs.readFile(path.join(__dirname, `/jsons/transaction.json`), "utf8", (err, data) => {
            let final = JSON.parse(data)

            let filter = final.filter((fildata, filIndx) => {
              //  if (fildata.formId === req.body.formId) {
                    fildata['data'].filter((fillData1) => {
                        if (fillData1.autoid === req.body.autoid) {
                            fildata.data = []
                            fildata["data"].push(fillData1)
                            finalData.status = 200,
                                finalData.statusmessage = "success",
                                finalData["data"].push(fildata)
                        }
                    })
              //  }
            })
            if (finalData && finalData.data && finalData.data.length > 0) {
                return res.send(finalData)
            }
            else {
                return res.send({
                    "status": 400,
                    "statusmessage": "fail",
                    "data": "no data found"
                })
            }
        })
    } catch (error) {
        return res.send({
            message: "fail",
            status: 400,
            data: []
        })
    }
})

function functionName(final, reqBody) {
    let finalObjData = {
        "status": "",
        "statusmessage": "",
        "fdata": []
    }
    let king = []
    _.filter(final, function (data, indx) {
        king = Object.keys(data).filter((key) => key.includes(reqBody.field))
        if (king && king.length > 0) {
            if (king[0] === reqBody.field && data[`${reqBody.field}`] === reqBody.value) {
                finalObjData.status = 200,
                    finalObjData.statusmessage = "success",
                    finalObjData["fdata"].push(data)
            }
            else {
                finalObjData.status = 400,
                    finalObjData.statusmessage = "fail",
                    finalObjData.fdata = "no data found"
            }
        }
        else {
            finalObjData.status = 400,
                finalObjData.statusmessage = "fail",
                finalObjData.fdata = "no field found"
        }
    })
    return finalObjData
}

router.post("/json/:body", async (req, res) => {
    let splitParams = req.params.body.split("-")
    let final = fs.readdirSync(path.join(__dirname, `/jsons`)).map(fileName => {
        return fileName
    })
    let finalData = final.filter((data, ind) => {
        let params = data.split(".")
        return splitParams[1] === params[0]
    })

    if (finalData && finalData.length > 0) {
        if (splitParams && splitParams[0] && splitParams[0] === "get") {
            let finalobj = fs.readFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), "utf8", (err, data) => {
                return res.send({ "status": 200, "statusmessage": "success", "data": JSON.parse(data) })
            })
        }
        else if (splitParams && splitParams[0] && splitParams[0] === "getspecific") {
            let finalObjData5 = {
                "status": "",
                "statusmessage": "",
                "data": []
            }
            let finalobj = fs.readFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), "utf8", (err, final) => {
                final = JSON.parse(final)
                let king = []
                _.filter(final, function (data, indx) {
                    king = Object.keys(data).filter((key) => key.includes(req.body.field))
                    if (king && king.length > 0) {
                        if (king[0] === req.body.field && data[`${req.body.field}`] === req.body.value) {
                            finalObjData5.status = 200,
                                finalObjData5.statusmessage = "success",
                                finalObjData5["data"].push(data)
                        }
                    }
                    else {
                        finalObjData5.status = 400,
                            finalObjData5.statusmessage = "fail",
                            finalObjData5.data = "no field found"
                    }
                })

                if (finalObjData5 && finalObjData5.data && finalObjData5.data.length > 0) {
                    return res.send(finalObjData5)
                }
                else {
                    return res.send({
                        "status": 400,
                        "statusmessage": "fail",
                        "data": "no data found"
                    })
                }
            })
            // let finalObjData = []
            // let finalobj = fs.readFile(path.join(__dirname,`/jsons/${splitParams[1]}.json`),"utf8",(err,data)=>{
            //      let final = JSON.parse(data) 
            //  let funName=functionName(final,req.body)
            //     return res.send(funName)
            //     })
        }
        else if (splitParams && splitParams[0] && splitParams[0] === "insert") {
            if (req.body.json) {
                let finalobj = fs.readFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), "utf8", (err, data) => {
                    let final = JSON.parse(data)
                    let inputData = final
                    inputData.push(req.body.json)
                    fs.writeFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), JSON.stringify(inputData), () => {
                        return res.status(200).json({ "status": 200, "statusmessage": "success", "data": [] })
                    })

                })
            }
            else {
                return res.status(400).json(
                    {
                        "status": 400,
                        "statusmessage": "fail",
                        "data": "provide valid details"
                    }

                )
            }
        }
        else if (splitParams && splitParams[0] && splitParams[0] === "update") {
            let findIndexs;
            let finalobj = fs.readFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), "utf8", (err, data) => {
                let final = JSON.parse(data);
                let king = []
                let finalObjData = {
                    "status": "",
                    "statusmessage": "",
                    "data": []
                }
                _.filter(final, function (data, indx) {
                    king = Object.keys(data).filter((key) => key.includes(req.body.field))
                    if (king && king.length > 0) {
                        if (king[0] === req.body.field && data[`${req.body.field}`] === req.body.value) {
                            finalObjData.status = 200,
                                finalObjData.statusmessage = "success",
                                finalObjData["data"].push(data)
                        }
                    }
                    else {
                        finalObjData.status = 400,
                            finalObjData.statusmessage = "fail",
                            finalObjData.data = "no field found"
                    }
                })

                if (finalObjData && finalObjData.data && finalObjData.data.length > 0) {
                    let getData = finalObjData["data"].filter(filterdata => {
                        console.log(filterdata)
                        findIndexs = final.findIndex(obj => { return obj == filterdata })
                    });
                    final[findIndexs] = req.body.json
                    fs.writeFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), JSON.stringify(final), () => {
                        return res.status(200).json({ message: "success", status: 200, data: [] })
                    });
                }
                else {
                    return res.status(400).json({
                        "status": 400,
                        "statusmessage": "fail",
                        "data": "no data found"
                    })
                }

            })
        }
        else if (splitParams && splitParams[0] && splitParams[0] === "delete") {
            let finalobj = fs.readFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), "utf8", (err, data) => {
                let final = JSON.parse(data)
                if (final && final.length > 0) {
                    let finalObjData1 = {
                        "status": "",
                        "statusmessage": "",
                        "data": []
                    }
                    _.filter(final, function (data) {
                        let king = Object.keys(data).filter((key) => key.includes(req.body.field))
                        if (king && king.length > 0) {
                            if (king[0] === req.body.field && data[`${req.body.field}`] === req.body.value) {
                                delete data
                            }
                            else {
                                finalObjData1.status = 200,
                                    finalObjData1.statusmessage = "success",
                                    finalObjData1["data"].push(data)
                            }
                        }
                        else {
                            finalObjData1.status = 400,
                                finalObjData1.statusmessage = "fail",
                                finalObjData1.data = "no field found"
                        }
                    })
                    fs.writeFile(path.join(__dirname, `/jsons/${splitParams[1]}.json`), JSON.stringify(finalObjData1.data), (err, data) => {
                        return res.status(200).json({ "status": 200, "statusmessage": "success", "data": [] })
                    })
                }
                else {
                    return res.status(400).json({ "status": 400, "statusmessage": "fail", "data": "no data found" })
                }
            })



        }
        else {
            res.send("no data found aganist parameters")
        }
    }
    else {
        res.send("no data found aganist parameters")
    }
})



router.post("/getMasters", (req, res) => {
    try {
        let keys = Object.keys(countryDetails);
        let finalData = [];
        let getArrey = [];
        keys.filter((data, index) => {
            if (req.body.flag === data && !req.body.hasOwnProperty('dataset')) {

                countryDetails[data].filter((obj, idx) => {
                    finalData.push(obj)

                })
                return res.send({
                    "status": 200,
                    "statusmessage": "success",
                    "data": finalData
                })
            }
            else if (req.body.flag === data && req.body.data && req.body.hasOwnProperty('dataset')) {

                let reqData = req.body.data;
                // let getArrey = reqData.filter((filData, filIndx) => {
                //     return req.body.dataset === filData.type
                // })
                reqData.forEach((filData) => {
                    if (req.body.dataset === filData.type) {
                        getArrey.push(filData);
                    }
                })


            }

        })
        if (getArrey && getArrey.length && getArrey.length > 0) {
            getArrey.filter((getDta) => {
                countryDetails[req.body.flag].filter((chld, chldIdx) => {
                    if (getDta.value === chld.value) {
                        getDta['data'] = chld['data']
                        finalData.push(getDta);
                    }
                })
            })
            return res.send({
                "status": 200,
                "statusmessage": "success",
                "data": finalData
            })
        } else {
            return res.send({
                "status": 400,
                "statusmessage": "fail",
                "data": "provide valid dataset"
            })
        }
        /*   if (req.body.flag === "Countries") {
   
               return res.send({
                   "status": 200,
                   "statusmessage": "success",
                   "data": countryDetails.country || []
               })
           } else if (req.body.flag === "States" && req.body.data && req.body.dataset) {
               let countryData = req.body.data
               let getStateArrey = countryData.filter((filData, filIndx) => {
                   return req.body.dataset === filData.type
               })
               if (getStateArrey && getStateArrey.length && getStateArrey.length > 0) {
                   getStateArrey.filter((getDta) => {
                       countryDetails['states'].filter((countrydata, countryIndx) => {
                           if (getDta.value === countrydata.value) {
                               getDta['data'] = countrydata['data']
                               finalData.push(getDta)
                               // finalData.push(countrydata)
                           }
                       })
                   })
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "provide valid dataset"
                   })
               }
               if (finalData && finalData.length && finalData.length > 0) {
                   return res.send({
                       "status": 200,
                       "statusmessage": "success",
                       "data": finalData
                   })
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "please provide valid details"
                   })
               }
               //   let countryData=req.body.data
               //   countryData.filter((filData,filIndx)=>{
               //     countryDetails['states'].filter((countrydata,countryIndx)=>{
               //            if(filData.value === countrydata.value){
               //               finalData.push(countrydata)
               //            } 
               //     })
               //   })
               //  if(finalData && finalData.length && finalData.length > 0){
               //     return res.send({
               //         "status":200,
               //         "statusmessage":"success",
               //         "data":finalData
               //        })
               //  }else{
               //    return res.send({
               //     "status":200,
               //     "statusmessage":"success",
               //     "data":"no data found"
               //    })
               // }
           } else if (req.body.flag === "Districts" && req.body.data && req.body.dataset) {
               let filterFinalData = []
               let countryData = req.body.data
               let getStateArrey = countryData.filter((filData, filIndx) => {
                   return req.body.dataset === filData.type
               })
               if (getStateArrey && getStateArrey.length && getStateArrey.length > 0) {
                   getStateArrey.filter((getDta) => {
                       countryDetails['Districts'].filter((countrydata, countryIndx) => {
                           if (getDta.value === countrydata.value) {
                               getDta['data'] = countrydata['data']
                               filterFinalData.push(getDta)
                               // finalData.push(countrydata)
                           }
                       })
                   })
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "provide valid dataset"
                   })
               }
               let findIndx = countryData.findIndex((findDta) => { return req.body.dataset === findDta.type })
               if (findIndx) {
                   if (filterFinalData && filterFinalData.length && filterFinalData.length > 0) {
                       countryData[findIndx] = filterFinalData[0]
                       return res.send({
                           "status": 200,
                           "statusmessage": "success",
                           "data": countryData
                       })
                   } else {
                       return res.send({
                           "status": 400,
                           "statusmessage": "fail",
                           "data": "please provide valid details"
                       })
   
                   }
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "provide valid dataset"
                   })
               }
           } else if (req.body.flag === "Cities" && req.body.data && req.body.dataset) {
               let filterFinalData = []
               let countryData = req.body.data
               let getStateArrey = countryData.filter((filData, filIndx) => {
                   return req.body.dataset === filData.type
               })
               if (getStateArrey && getStateArrey.length && getStateArrey.length > 0) {
                   getStateArrey.filter((getDta) => {
                       countryDetails['Cities'].filter((countrydata, countryIndx) => {
                           if (getDta.value === countrydata.value) {
                               getDta['data'] = countrydata['data']
                               filterFinalData.push(getDta)
                               // finalData.push(countrydata)
                           }
                       })
                   })
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "provide valid dataset"
                   })
               }
               console.log("filterFinalData", filterFinalData[0])
               let findIndx = countryData.findIndex((findDta) => { return req.body.dataset === findDta.type })
               if (findIndx) {
                   if (filterFinalData && filterFinalData.length && filterFinalData.length > 0) {
                       countryData[findIndx] = filterFinalData[0]
                       return res.send({
                           "status": 200,
                           "statusmessage": "success",
                           "data": countryData
                       })
                   } else {
                       return res.send({
                           "status": 400,
                           "statusmessage": "fail",
                           "data": "please provide valid details"
                       })
   
                   }
               } else {
                   return res.send({
                       "status": 400,
                       "statusmessage": "fail",
                       "data": "provide valid dataset"
                   })
               }
           }
           else if (req.body.flag === "") {
               let keys = Object.keys(countryDetails);
   
               return res.send({
                   "status": 200,
                   "statusmessage": "success",
                   "data": keys || []
               })
           }
           else {
               return res.send({
                   message: "fail",
                   status: 400,
                   data: "please provide valid details"
               })
           }*/
    } catch (error) {
        return res.send({
            message: "fail",
            status: 400,
            data: []
        })
    }
})


router.post("/getGenderMaster", (req, res) => {
    try {
        let finalData = []
        let finalobj = fs.readFile(path.join(__dirname, `/jsons/genderinfo.json`), "utf8", (err, data) => {
            let final = JSON.parse(data)
            if (req.body.flag == "gender") {
                return res.send({
                    message: "sucess",
                    status: 200,
                    data: final.genderInfo
                })
            } else if (req.body.flag == "GenderInfo" && req.body.data) {
                let genderReadData = req.body.data
                genderReadData.filter((reqGenderData) => {
                    final['typesOfGenderData'].filter((typeGenderData) => {
                        if (reqGenderData.value === typeGenderData.value) {
                            reqGenderData['data'] = typeGenderData['data']
                            finalData.push(reqGenderData)
                        }
                    })
                })
                if (finalData && finalData.length && finalData.length > 0) {
                    return res.send({
                        "status": 200,
                        "statusmessage": "success",
                        "data": finalData
                    })
                } else {
                    return res.send({
                        "status": 400,
                        "statusmessage": "fail",
                        "data": "provide valid details"
                    })
                }
            }
            else {
                return res.send({
                    message: "fail",
                    status: 400,
                    data: "no data found"
                })
            }
        })
    } catch (error) {
        return res.send({
            message: "fail",
            status: 400,
            data: []
        })
    }
});

/* Get Countries-States-Cities */
router.post("/getCountriesStatesCities", async (req, res) => {
    try {
        if (!req.body || !req.body.type || (req.body.type !== 'COUNTRIES' && !req.body.id)) {
            return res.status(400).send({
                message: "fail",
                desc: `Invalid inputs..`,
                status: 400,
                data: []
            });
        }
        else {
            let _path = path.join(__dirname, `/jsons/${req.body.type}.json`);
            let _rData = await readFileData(_path);
            if (_rData.success && _rData.data && _rData.data.length > 0) {
                let _data = [];
                if (req.body.type === "STATES") {
                    _data = _.filter(_rData.data, (_o) => { return _o["country_id"] == req.body.id; });
                }
                else if (req.body.type === "CITIES") {
                    _data = _.filter(_rData.data, (_o) => { return _o["state_id"] == req.body.id; });
                }
                else {
                    _data = _rData.data;
                }
                if (_data && _data.length > 0) {
                    let _mData = _.map(_data, _.partialRight(_.pick, ['id', 'name']));
                    let _fData = _mData.map(function (o) {
                        return Object.assign({
                            id: o.id,
                            value: o.name
                        }, _.omit(o, 'id', 'name'));
                    });
                   // console.log("_fData", _fData);
                    return res.status(200).send({
                        message: "success",
                        desc: ``,
                        status: 200,
                        data: _fData || []
                    });
                }
                else {
                    return res.status(200).send({
                        message: "fail",
                        desc: `No data found ..`,
                        status: 200,
                        data: []
                    });
                }
            }
            else {
                return res.status(400).send({
                    message: "fail",
                    desc: `No data found ..`,
                    status: 400,
                    data: []
                });
            }
        }

    } catch (error) {
        return res.status(500).send({
            message: "fail",
            desc: `${error.message}`,
            status: 500,
            data: []
        });
    }
});

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
};

async function checkRecordExistOrNot(_collName,req,_filterObj,_type,_collectionKeys,res){
    try {
        _.each(req.body.params,(_v,_k)=>{
           if(_k !="_id" && _k !="audit" && _k !="recStatus"){
              _filterObj.filter[_k]=_v
           }
        })
        let _mResp = await _mUtils.commonMonogoCall(`formBuilder_${_collName}`, "find", _filterObj, "", "", "", "")
        console.log("sdfhsdjhsd",_mResp)
        if (!(_mResp && _mResp.success)) {
          resolve({ success: false, status: 400, desc: _mResp.desc || "", data: [] });
       }else{
          if(_mResp.data.length > 0){
              return { success: true, status: 200, desc: '', data:"already exist",code:0 };
          }else{
              return { success: true, status: 200, desc: '', data:"not exist",code:1 };
          }
       }
    } catch (error) {
      
    }
  }
//insert documents
// router.post("/insert-document", async (req, res) => {
//     try {
//                 mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then((result) => {
//                     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
//                 }).catch((error) => {
//                     if(error.desc.code==11000){
//                         return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()} already exist`, data: [] });
//                     }else{
//                         return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
//                     }
                    
//                 });
        
//     } catch (error) {
//         return res.status(500).json({ success: false, status: 500, desc: error.message || error });
//     }
// });
//insert documents
router.post("/insert-document", async (req, res) => {
    try {
        let _query = ''
        let _finalData;
        if (req.body.params._id) {
            _query = "bulkWrite"
            let _cBody = JSON.parse(JSON.stringify((req.body)));
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_doc_creation", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            delete _mResp.data.params._id
          //  let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params, req);
            let pLoadResp = { payload: {} };
            // if (!(_hResp && _hResp.success)) {

            // }
           // else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                _finalData = pLoadResp.payload
         //   }
            mongoMapper('formBuilder_doc_creation', _query, pLoadResp.payload, "").then(async (result) => {
                // if(_query =="insertMany"){
                //     let _historyData= await insertHistoryData('formBuilder_document_transaction_history',result.data,req)
                // }
                if(_cBody.params.isDataBase==true){
                    let params={
                        "MST_JSON":JSON.parse(JSON.stringify(_cBody.params))
                    }
                    let _dataBaseResponse =[]
                     let _sendDataToDB =await  axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr",params).then((res,err)=>{
                         _dataBaseResponse=res.data
                     }).catch((error)=>{
                      return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] }); 
                     })
                   }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            _query = "insertMany"
            _.each(req.body.params.data, (_o) => {
                _o.recStatus = true
                _o.audit = req.body.params.audit;
            });

            mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then(async(result) => {
                console.log("result.data[0].isDataBase==true",result.data[0].isDataBase)
                   if(result.data.length > 0 && result.data[0].isDataBase==true){
                    let params={
                        "MST_JSON":JSON.parse(JSON.stringify(result.data[0]))
                    }
                    let _dataBaseResponse =[]
                     let _sendDataToDB =await  axios.post(" https://emr.doctor9.com/napi_cmn/apt/api/uprInsDocumentFormBldr",params).then((res,err)=>{
                         _dataBaseResponse=res.data
                     }).catch((error)=>{
                      return res.status(400).json({ success: false, status: 400, desc: "mongodb To sql request failed", data: [] }); 
                     })
                   }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                console.log("error",error)
                if (error.desc.code == 11000) {
                    // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
                    return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
                } else {
                    return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
                }

            });
        }

        // mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then((result) => {
        //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        // }).catch((error) => {
        //     if (error.desc.code == 11000) {
        //         // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
        //         return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
        //     } else {
        //         return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
        //     }

        // });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});
;

/**get-documents */
router.post("/get-documents", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_doc_creation", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

//insert documents specific master
router.post("/insert-document_transaction-data", async(req, res) => {
    try {
        let _query=''
        let _finalData;
        if(req.body.params._id){
            _query="bulkWrite"

            let _cBody = JSON.parse(JSON.stringify((req.body)));
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_transaction_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            delete _mResp.data.params._id
            let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params,req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                _finalData=pLoadResp.payload
            }
        }else{
            _query="insertMany"
            if(req.body.params.data.length > 0){
                _.each(req.body.params.data, (_o) => {
                    _o.recStatus = true,
                    // _o['formCd']=req.body.params.formCd,
                    // _o['formId']=req.body.params.formId,
                    // _o['formName']=req.body.params.formName,
                    _o.audit = req.body.params.audit;
                });
            }
          
            _finalData=req.body.params
        }
        mongoMapper('formBuilder_document_transaction_data', _query, _finalData, "").then(async(result) => {
            if(_query =="insertMany"){
                let _historyData= await insertHistoryData('formBuilder_document_transaction_history',result.data,req)
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error })
    }
});

/**get document transaction data */
router.post("/get-document_transaction-data", async (req, res) => {
    try {
        if(req.body.params.flag=="GET"){
            let _filter = {
                "filter": { "recStatus": { $eq: true } },
                "selectors": "-history "
            }
            delete req.body.params.flag
            let _pGData = await prepareGetPayload(_filter, req.body.params);
            if (!_pGData.success) {
                return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
            }
            mongoMapper("formBuilder_document_transaction_data", req.body.query, _pGData.data, "").then((result) => {
                return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }else if(req.body.params.flag =="SPECIFIC_GET"){
            let _filter = {
                "filter": {
                    "recStatus": { $eq: true },
                    "treatmentId":req.body.params.treatmentId
                    // "content_type":req.body.params.content_type
                },
                "selectors": {
                    "_id": "$_id",
                    "formId": "$formId",
                    "orgId": "$orgId",
                    "revNo": "$revNo",
                    "locId": "$locId",
                    "formCd": "$formCd",
                    "formName": "$formName",
                    "treatmentId": "$treatmentId",
                    "umrNo": "$umrNo",
                    "treatmentType": "$treatmentType",
                    "visitStatus": "$visitStatus",
                    "data": {
                        $filter: {
                            input: "$data",
                            cond: {
                                $eq: ["$$this.lblId", `${req.body.params.lblId}`]
                            }
                        }
                    },
                    "audit": "$audit"
                }
            }
            mongoMapper("formBuilder_document_transaction_data", "find", _filter, "").then((result) => {
                let convertdata=JSON.parse(JSON.stringify(result.data))
                let _indx=0;
                let _finalData=[]
                while(convertdata.length > _indx){
                    if(convertdata[_indx].data.length > 0){
                       _.each(convertdata[_indx].data,(_obj,_indx)=>{
                        if(_obj.value !=""){
                            _obj['formCd']=convertdata[0].formCd
                            _obj['formId']=convertdata[0].formId
                            _obj['formName']=convertdata[0].formName
                            _finalData.push(_obj)
                        }
                       })
                    }
                    _indx++;  
                }
                convertdata[0].data=_finalData
                //JSON.parse(JSON.stringify(result.data[0])).data=_finalData
                return res.status(200).json({ success: true, status: 200, desc: '', data:convertdata[0]});
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
       
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});
/**histroy function */
async function insertHistoryData(_method, _mParams, _body, req) {
    return new Promise(async (resolve, reject) => {
        try {
            let _mResp = await _mUtils.commonMonogoCall(`${_method}`, "insertMany", _mParams, "", "", "", "")
            if (!(_mResp && _mResp.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error: - ${_mResp.desc} ` });
            }
            resolve({ success: true, data: _mResp.data, desc: `` });
        }
        catch (err) {
            return { success: false, data: [], desc: `Error occured, Error: - ${err} ` }
        }
    });

};
/** */
//insert documents specific master
router.post("/insert-document-specific-master", async(req, res) => {
    try {
        let _query=''
        let _finalData;
        if(req.body.params._id){
            _query="bulkWrite"

            let _cBody = JSON.parse(JSON.stringify((req.body)));
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_document_specific_data", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            delete _mResp.data.params._id
            let _hResp = await insertHistoryData('formBuilder_document_specific_history', _mResp.data.params,req);
            let pLoadResp = { payload: {} };
            if (!(_hResp && _hResp.success)) {

            }
            else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                _finalData=pLoadResp.payload
            }
        }else{
            _query="insertMany"
            _.each(req.body.params.data, (_o) => {
                _o.recStatus = true
                _o.audit = req.body.params.audit;
            });
            _finalData=req.body.params
        }
        mongoMapper('formBuilder_document_specific_data', _query, _finalData, "").then(async(result) => {
            if(_query =="insertMany"){
                let _historyData= await insertHistoryData('formBuilder_document_specific_history',result.data,req)
            }
            return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error })
    }
});

/**get-documents documents specific master */
router.post("/get-documents-specific-master", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_document_specific_data", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

router.post("/insert-template", async (req, res) => {
    try {
        let _query = ''
        let _finalData;
        if (req.body.params._id) {
            _query = "bulkWrite"
            let _cBody = JSON.parse(JSON.stringify((req.body)));
            let _mResp = await _mUtils.commonMonogoCall("formBuilder_template", "findById", req.body.params._id, "REVNO", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }
            delete _mResp.data.params._id
          //  let _hResp = await insertHistoryData('formBuilder_document_transaction_history', _mResp.data.params, req);
            let pLoadResp = { payload: {} };
            // if (!(_hResp && _hResp.success)) {

            // }
           // else {
                _cBody.params.revNo = _mResp.data.params.revNo;
                pLoadResp = await _mUtils.preparePayload('BW', _cBody);
                if (!pLoadResp.success) {
                    return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
                }
                _finalData = pLoadResp.payload
         //   }
            mongoMapper('formBuilder_template', _query, pLoadResp.payload, "").then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            _query = "insertMany"
            mongoMapper('formBuilder_template', req.body.query, req.body.params, "").then((result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                    return res.status(400).json({ success: false, status: 400, desc: error.desc, data: [] })
            });
        }

        // mongoMapper('formBuilder_doc_creation', req.body.query, req.body.params, "").then((result) => {
        //     return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
        // }).catch((error) => {
        //     if (error.desc.code == 11000) {
        //         // ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}
        //         return res.status(400).json({ success: false, status: 400, desc: ` ${error.desc.writeErrors[0].err.errmsg.split(':')[3].replace(/{|}/g, '').trim()}  already exist`, data: [] });
        //     } else {
        //         return res.status(400).json({ success: false, status: 400, desc: "", data: [] });
        //     }

        // });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

router.post("/get-template", async (req, res) => {
    try {
        let _filter = {
            "filter": { "recStatus": { $eq: true } },
            "selectors": "-history "
        }
        let _pGData = await prepareGetPayload(_filter, req.body.params);
        if (!_pGData.success) {
            return res.status(400).json({ success: false, status: 400, desc: _pGData.desc, data: [] });
        }
        mongoMapper("formBuilder_template", req.body.query, _pGData.data, "").then((result) => {
            return res.status(200).send({ success: true, status: 200, desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error });
    }
});

module.exports = router;
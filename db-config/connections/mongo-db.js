'use strict';
const mongoose = require("mongoose");
const option = { useNewUrlParser: true, useUnifiedTopology: true ,enableUtf8Validation: false};
const mongo = [     
    // { url: "mongodb://10.15.79.214:27017/EMR", name: "emr" },
    // { url: "mongodb://10.15.79.214:27017/porter", name: "porter" },
    // { url: "mongodb://10.15.79.214:27017/patient_care", name: "patient_care" },
    // { url: "mongodb://10.15.79.214:27017/patient_care_emr", name: "patient_care_emr" },
    // { url: "mongodb://10.15.79.214:27017/patient_care_speed", name: "patient_care_speed" },
    // { url: "mongodb://10.15.79.214:27017/ABHA", name: "abha" },
    // { url: "mongodb://10.15.79.214:27017/monography", name: "monography" },
    // { url: "mongodb://10.15.79.214:27017/monography_staging", name: "monography_staging" },
    // { url: "mongodb://10.15.79.214:27017/drugDetails_staging", name: "drugDetails_staging" },
    // { url: "mongodb://10.15.79.214:27017/monography_production", name: "monography_production" },
    // { url: "mongodb://10.15.79.214:27017/drugDetails_production", name: "drugDetails_production" },
    // { url: "mongodb://10.15.79.214:27017/formBuilder", name: "formBuilder" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_emr?retryWrites=true&w=majority&appName=Cluster0", name: "cm_emr" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_rh?retryWrites=true&w=majority&appName=Cluster0", name: "cm_rh" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_kd?retryWrites=true&w=majority&appName=Cluster0", name: "cm_kd" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_sh?retryWrites=true&w=majority&appName=Cluster0", name: "cm_sh" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_hm?retryWrites=true&w=majority&appName=Cluster0", name: "cm_hm" },
    { url: "mongodb+srv://dileepachari090:ZVgE9vCg94m3rAMp@cluster0.ijlyb.mongodb.net/cm_km?retryWrites=true&w=majority&appName=Cluster0", name: "cm_km" },
    // { url: "mongodb://10.15.79.214:27017/cm_gtb", name: "cm_gtb" },
    // { url: "mongodb://10.15.79.214:27017/dk_crush_emr", name: "dk_crush_emr" },
    // { url: "mongodb://10.15.79.214:27017/ophthamology_ecg_emr", name: "ophthamology_ecg_emr" },
    // { url: "mongodb://10.15.79.214:27017/ophthamology_ecg_shoptha", name: "ophthamology_ecg_shoptha" },
];
(async () => {
    try {
        global.db = {};
        for (let _mObj of mongo) {
            const _mDb = await mongoose.createConnection(_mObj.url, option);
            await _mDb.on("error", console.error.bind(console, `${_mObj.name} MongoDB Connection Error >> :`));
            await _mDb.once("open", function () {
                console.log(`client ${_mObj.name} MongoDB Connection ok!`);
            });
            global.db[_mObj.name] = _mDb;
        }
    }
    catch (err) {
        console.log("Error ocurred while connceting Mongodb ..", err)
    }
})();
    
      
module.exports = (_coll, _action, _params) => {
    return new Promise(async (resolve, reject) => {
        try {   
            if (_action === 'find' || _action === 'findCount') {
                if(_action === 'find'){
                    // _coll.find(_params.filter, _params.selectors)
                    // .sort(_params.sort || { '_id': -1 }).skip(_params.skipData).limit(_params.limit).then((result) => {
                    //     resolve({ status: "SUCCESS", data: result || [] })
                    // }).catch((error) => {
                    //     reject({ status: "FAIL", data: [], desc: error })
                    // });
                    let _query = _coll.find(_params.filter, _params.selectors)
                    .sort(_params.sort || { '_id': -1 }).limit(_params.limit || 3000);
                    if(_params.populate && Array.isArray(_params.populate)){
                        _params.populate.forEach((populateField) => {
                            _query = _query.populate(populateField);
                        });
                    }
                    _query.then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
                }else if(_action === 'findCount') {
                    _coll.find(_params.filter, _params.selectors)
                    .sort(_params.sort || { '_id': -1 }).count().then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
                }
            }
            else if (_action === 'findOne') {
                // _coll.findOne(_params.filter, _params.selectors)
                //     .sort(_params.sort || { '_id': -1 }).limit(5000).then((result) => {
                //         resolve({ status: "SUCCESS", data: result || [] })
                //     }).catch((error) => {
                //         reject({ status: "FAIL", data: [], desc: error })
                //     });
                let _query =  _coll.findOne(_params.filter, _params.selectors).sort(_params.sort || { '_id': -1 }).limit(5000)
                if (_params.populate && Array.isArray(_params.populate)) {
                    _params.populate.forEach((populateField) => {
                        _query = _query.populate(populateField);
                    });
                }
                _query.then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
            }
            else if (_action === 'findById') {
                // _coll.findById(_params.data)
                //     .sort(_params.sort || { '_id': -1 }).limit(5000).then((result) => {
                //         resolve({ status: "SUCCESS", data: result || [] })
                //     }).catch((error) => {
                //         reject({ status: "FAIL", data: [], desc: error })
                //     });
                let _query = _coll.findById(_params.data)
                if (_params.populate && Array.isArray(_params.populate)) {
                    _params.populate.forEach((populateField) => {
                        _query = _query.populate(populateField);
                    });
                }
                _query.sort(_params.sort || { '_id': -1 }).limit(5000).then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
            }    
            else if (_action === 'insertMany') {
                _coll.insertMany(_params.data)
                    .then((result) => {
                        //   resolve({ status: "SUCCESS", data: (result[0] && result[0]._id) ? { _id: result[0]._id } : [] })
                        resolve({ status: "SUCCESS", data: result })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
            }         
            else if (_action === 'findOneAndUpdate') {
                _coll.findOneAndUpdate(_params.data.by, _params.data.query, _params.data.mode)
                    .then((result) => {
                        resolve({ status: "SUCCESS", data: (result && result._id) ? result : [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error.message || error })
                    });

                /* _coll.findOneAndUpdate(
                     _params.data.by,
                     {
                       $setOnInsert:  _params.data.query.$push,
                     },
                     {
                       returnOriginal: false,
                       upsert: true,
                       new : false
                     }
                   )
                 .then((result) => {
                     resolve({ status: "SUCCESS", data: (result && result._id) ? { "_id": result._id } : [] })
                 }).catch((error) => {
                     reject({ status: "FAIL", data: [], desc: error.message || error })
                 });
                 */
            }
            else if (_action === 'updateOne') {
                _coll.updateOne(_params.data.by, _params.data.query, _params.data.mode)
                    .then((result) => {
                        if (result.modifiedCount && result.modifiedCount > 0) {
                            resolve({ status: "SUCCESS", data: result._id ? result._id : [] })
                        }
                        else {
                            reject({ status: "FAIL", data: result._id ? result._id : [], desc: 'Update Failed., No Records match against provided parameters.' })
                        }
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error.message || error })
                    });
            }
            else if (_action === 'bulkWrite') {
                _coll.bulkWrite(_params.data.pData).then(result => {
                    if (result && result.result && result.result.ok && result.result.ok == 1) {
                        _coll.findById(_params.data._id)
                            .then((result) => {
                                resolve({ status: "SUCCESS", data: (result && result._id) ? { "_id": result._id } : [] })
                            }).catch((error) => {
                                reject({ status: "FAIL", data: [], desc: error.message || error })
                            });
                    }
                    else {
                        reject({ status: "FAIL", data: [], desc: "Not Updated.." })
                    }
                }).catch((error) => {
                    reject({ status: "FAIL", data: [], desc: error.message || error })
                });
            }
            else if (_action === 'replaceOne') {
                _coll.replaceOne(_params.data.by, _params.data.query, _params.data.mode)
                    .then((result) => {
                        if (result.modifiedCount && result.modifiedCount > 0) {
                            resolve({ status: "SUCCESS", data: result._id ? result._id : [] })
                        }
                        else {
                            reject({ status: "FAIL", data: result._id ? result._id : [], desc: 'Update Failed., No Records match against provided parameters.' })
                        }
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error.message || error })
                    });
            }
            else if (_action === 'findOneAndReplace') {
                _coll.findOneAndUpdate(_params.data.by, _params.data.query, _params.data.mode)
                    .then((result) => {
                        resolve({ status: "SUCCESS", data: (result && result._id) ? result : [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error.message || error })
                    });
            }
            else if (_action === 'aggregation') { 
                _coll.aggregate(_params.filter).then((result) => {
                    resolve({ status: "SUCCESS", data: result })
                }).catch((error) => {
                    reject({ status: "FAIL", data: [], desc: error.message || error })
                });
            }
            else if (_action === 'updateMany') { 
                _coll.updateMany(_params.filter, _params.update).then((result) => {
                    resolve({ status: "SUCCESS", data: result })
                }).catch((error) => {
                    reject({ status: "FAIL", data: [], desc: error.message || error })
                });
            }
            else {
                reject({ status: "FAIL", data: [], desc: `No Action is found against this ${_action}` })
            }
        }
        catch (err) {
            reject({ status: "FAIL", data: [], desc: err });
        }
    });
}



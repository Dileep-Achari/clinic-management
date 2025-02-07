'use strict';
const mongoose = require("mongoose");
const option = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = [
    { url: "mongodb://10.15.79.214:27017/EMR", name: "emr" },
    { url: "mongodb://10.15.79.214:27017/porter", name: "porter" },
    { url: "mongodb://10.15.79.214:27017/patient_care", name: "patient_care" },
    { url: "mongodb://10.15.79.214:27017/ABHA", name: "abha" },
    { url: "mongodb://10.15.79.214:27017/monography", name: "monography" },
    { url: "mongodb://10.15.79.214:27017/clinicManagement", name: "clinicManagement" },
    { url: "mongodb://10.15.79.214:27017/cm_emr", name: "cm_emr" },
    { url: "mongodb://10.15.79.214:27017/cm_ah", name: "cm_ah" },
    { url: "mongodb://10.15.79.214:27017/cm_rh", name: "cm_rh" },
    { url: "mongodb://10.15.79.214:27017/cm_kd", name: "cm_kd" }
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
            if (_action === 'find') {
                _coll.find(_params.filter, _params.selectors)
                    .sort(_params.sort || { '_id': -1 }).limit(_params.limit).then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
            }
            else if (_action === 'findOne') {
                _coll.findOne(_params.filter, _params.selectors)
                    .sort(_params.sort || { '_id': -1 }).limit(5000).then((result) => {
                        resolve({ status: "SUCCESS", data: result || [] })
                    }).catch((error) => {
                        reject({ status: "FAIL", data: [], desc: error })
                    });
            }
            else if (_action === 'findById') {
                _coll.findById(_params.data)
                    .sort(_params.sort || { '_id': -1 }).limit(5000).then((result) => {
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
            else {
                reject({ status: "FAIL", data: [], desc: `No Action is found against this ${_action}` })
            }
        }
        catch (err) {
            reject({ status: "FAIL", data: [], desc: err });
        }
    });
}



const moment = require("moment");
const _ = require('lodash');
const mongoMapper = require("../../db-config/helper-methods/mongo/mongo-helper");
const _models = require("../../constants/mongo-db/models")
const _schmeModules = require("../../constants/mongo-db/schema_modules");

let _schemaData = [];
// Object.values(_s.schema).flat()
_.each(_schmeModules, (_s) => {
    _schemaData = _schemaData.concat(_s.schema)
})

/* Prepare Payload function */
function preparePayload_deprecated(_type, _body) {
    try {
        return new Promise((resolve, reject) => {
            let _params = {};
            let _payload = {
                by: {},
                query: { $set: {}, $push: {} },
                mode: { upsert: true, new: true }
            }
            _payload.by = { "_id": _body.params._id };
            //console.log("_payload.by ", _payload.by)
            let _alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            if (_type === "U") {
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && !_val._id || _val._id == '') {
                            delete _val._id;
                            _payload.query.$push[`${_key} `] = _val;
                        }
                        else if (_val.constructor.name === 'Array') {
                            //   delete _val1._id;
                            let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                            if (_rest && _rest.length > 0) {
                                _.each(_rest, (item) => { delete item._id })
                                _payload.query.$push[`${_key} `] = _rest;
                            }
                        }
                        _.each(_val, (_val1, _key1) => {
                            /*    if (_val.constructor.name === 'Array' && !_val1._id || _val1._id == '') {
                                    delete _val1._id;
                                    _payload.query.$push[`${ _key } `] = _val1;
                                }
                                else {
                                    */
                            if (_val.constructor.name === 'Object') {
                                if (_key1 == "_id" && _val1 != '') {
                                    _payload.by[`${_key}._id`] = _val1;
                                }
                                else {
                                    _params[`${_key}.${_key1} `] = _val1;
                                }
                            }
                            else if (_val.constructor.name === 'Array') {
                                _.each(_val1, (_val2, _key2) => {
                                    if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
                                        _.each(_val2, (_val3, _key3) => {
                                            if (_val3.constructor.name === 'Object') {
                                                _.each(_val3, (_val4, _key4) => {
                                                    if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                        _.each(_val4, (_val5, _key5) => {
                                                            if (_val5.constructor.name === 'Object') {
                                                                _.each(_val5, (_val6, _key6) => {
                                                                    if (_key6 == "_id" && _val6 != '') {
                                                                        _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                    }
                                                                    else {
                                                                        _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6} `] = _val6;
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5} `] = _val5;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        if (_key4 == "_id" && _val4 != '') {
                                                            _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                        }
                                                        else {
                                                            _params[`${_key}.$.${_key2}.$[].${_key4} `] = _val4;
                                                        }
                                                    }
                                                })
                                            }
                                            else {
                                                _params[`${_key}.$.${_key2}.${_key3} `] = _val3;
                                            }
                                        })
                                    }
                                    else {
                                        if (_key2 == "_id" && _val2 != '') {
                                            _payload.by[`${_key}._id`] = _val2;
                                        }
                                        else {
                                            _params[`${_key}.$.${_key2} `] = _val2;
                                        }
                                    }
                                });
                            }
                            // }
                        })
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                _payload.query.$set = _params;
            }
            else if (_type === 'IAU') {
                _.each(_body.params, (_value, _keys) => {
                    if (_value.constructor.name === 'Object' || _value.constructor.name === 'Array') {
                        if (_value.constructor.name === 'Array') {
                            _.each(_value, (_value1, _keys1) => {
                                if (_value1.constructor.name === 'Object') {
                                    _.each(_value1, (_value2, _keys2) => {
                                        if (_value2.constructor.name === 'Object' || _value2.constructor.name === 'Array') {
                                            if (_value2.constructor.name === 'Array') {
                                                _.each(_value2, (_value3, _keys3) => {
                                                    if (_value3.constructor.name === 'Object' || _value3.constructor.name === 'Array') {
                                                        //if (_value3.constructor.name === 'Array') {
                                                        _.each(_value3, (_value4, _keys4) => {
                                                            if (_keys4 === '_id') {
                                                                _payload.by[`${_keys}.${_keys2}.${_keys4} `] = _value4;
                                                                delete _keys4;
                                                            }
                                                            else {
                                                                _params[`${_keys}.$.${_keys2}.$[].${_keys4} `] = _value4;
                                                            }
                                                        });
                                                        //  }
                                                        //  else {
                                                        //      _params[`${ _keys }.$.${ _keys2 }.$.${ _keys3 } `] = _value2;
                                                        //  }
                                                    }
                                                    else {
                                                        if (_keys3 === '_id') {
                                                            _payload.by[`${_keys}.${_keys2}._id`] = _value3;
                                                            delete _keys2;
                                                        }
                                                        //_params[`${ _keys }.$.${ _keys2 }.${ _keys3 } `] = _value3;
                                                    }
                                                });
                                            }
                                            else {
                                                _params[`${_keys}.$.${_keys2} `] = _value2;
                                            }
                                        }
                                        else {
                                            if (_keys2 === '_id') {
                                                _payload.by[`${_keys}._id`] = _value2;
                                                delete _keys2;
                                            }
                                        }
                                    });
                                }
                                else {

                                }
                            });
                        }
                        else {
                            _params[`${_keys} `] = _value;
                        }
                    }
                });
                _payload.query.$push = _params;
            }
            else if (_type === 'AE') {
                delete _body.params._id;
                _payload.query.$push = _body.params;
            }
            else if (_type === 'BW') {
                let _bwObj = {
                    "updateOne": {
                        "filter": { "_id": _body.params._id },
                        "update": {
                            "$set": {},
                            "$push": {}

                        },
                        upsert: true, new: true
                    }
                };
                let _bwData = [];
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && !_val._id || _val._id == '') {
                            delete _val._id;
                            _payload.query.$push[`${_key} `] = _val;
                        }
                        else if (_val.constructor.name === 'Array') {
                            //   delete _val1._id;
                            let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                            if (_rest && _rest.length > 0) {
                                _.each(_rest, (item) => { delete item._id })
                                _payload.query.$push[`${_key} `] = _rest;
                            }
                            let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            if (_elm && _elm.length > 0) {
                                _.each(_elm, (_ev, _ek) => {
                                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                                    _.each(_ev, (_ev1, _ek1) => {
                                        if (_ek1 === '_id') {
                                            _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
                                        }
                                        else {
                                            if (_ev1.constructor.name === 'Array') {
                                                _.each(_ev1, (_ev2, _ek2) => {
                                                    let _cloneBw1 = JSON.parse(JSON.stringify(_bwObj));
                                                    _.each(_ev2, (_ev3, _ek3) => {
                                                        if (_ek3 === '_id') {
                                                            _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                            _cloneBw1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev3;
                                                        }
                                                        else {
                                                            if (_ev3.constructor.name === 'Object') {
                                                                _.each(_ev3, (_ev4, _ek4) => {
                                                                    _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.${_ek4} `] = _ev4;
                                                                });
                                                            }
                                                            else {
                                                                _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3} `] = _ev3;
                                                            }
                                                        }
                                                    });
                                                    if (Object.keys(_cloneBw1.updateOne.update.$set).length > 0) {
                                                        _bwData.push(_cloneBw1);
                                                    }
                                                });

                                            }
                                            else {
                                                _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1} `] = _ev1;
                                            }
                                        }
                                    });
                                    if (Object.keys(_cloneBw.updateOne.update.$set).length > 0 || Object.keys(_cloneBw.updateOne.update.$push).length > 0) {
                                        _bwData.push(_cloneBw);
                                    }
                                });
                            }
                        }
                        if (_val.constructor.name !== 'Array') {
                            // let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            // if (_elm && _elm.length > 0) {
                            //     _.each(_elm, (_ev, _ek) => {
                            //         let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                            //         _.each(_ev, (_ev1, _ek1) => {
                            //             if (_ek1 === '_id') {
                            //                 _cloneBw.updateOne.filter[`${ _key }._id`] = _ev1;
                            //             }
                            //             else {
                            //                 _cloneBw.updateOne.update.$set[`${ _key }.$.${ _ek1 } `] = _ev1;
                            //             }
                            //         });
                            //         _bwData.push(_cloneBw);

                            //     });
                            // }
                            // else {
                            _.each(_val, (_val1, _key1) => {
                                if (_val.constructor.name === 'Object') {
                                    _params[`${_key}.${_key1} `] = _val1;
                                }
                                else if (_val.constructor.name === 'Array') {
                                    _.each(_val1, (_val2, _key2) => {
                                        if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
                                            _.each(_val2, (_val3, _key3) => {
                                                if (_val3.constructor.name === 'Object') {
                                                    _.each(_val3, (_val4, _key4) => {
                                                        if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                            _.each(_val4, (_val5, _key5) => {
                                                                if (_val5.constructor.name === 'Object') {
                                                                    _.each(_val5, (_val6, _key6) => {
                                                                        if (_key6 == "_id" && _val6 != '') {
                                                                            _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                        }
                                                                        else {
                                                                            _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6} `] = _val6;
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5} `] = _val5;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            if (_key4 == "_id" && _val4 != '') {
                                                                _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                            }
                                                            else {
                                                                _params[`${_key}.$.${_key2}.$[].${_key4} `] = _val4;
                                                            }
                                                        }
                                                    })
                                                }
                                                else {
                                                    _params[`${_key}.$.${_key2}.${_key3} `] = _val3;
                                                }
                                            })
                                        }
                                        else {
                                            if (_key2 == "_id" && _val2 != '') {
                                                _payload.by[`${_key}._id`] = _val2;
                                            }
                                            else {
                                                _params[`${_key}.$.${_key2} `] = _val2;
                                            }
                                        }
                                    });
                                }
                                // }
                            })
                            // }
                        }
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                if (Object.keys(_params).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$set = _params;
                    _cloneBw.updateOne.filter = _payload.by;
                    _bwData.push(_cloneBw);
                }
                if (Object.keys(_payload.query.$push).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$push = _payload.query.$push;
                    // _cloneBw.updateOne.filter = _payload.by;
                    _cloneBw.updateOne.filter = { "_id": _body.params._id };
                    _bwData.push(_cloneBw);
                }
                _payload = { "_id": _body.params._id, "pData": _bwData };

            }
            resolve({ "success": true, payload: _payload, desc: "" });
        })
    }
    catch (err) {
        return { "success": false, payload: {}, desc: err };
    }
};

// function preparePayload(_type, _body) {
//     try {
//         return new Promise((resolve, reject) => {
//             let _params = {};
//             let _payload = {
//                 by: {},
//                 query: { $set: {}, $push: {} },
//                 mode: { upsert: true, new: true, arrayFilters: [] }
//             }
//             _payload.by = { "_id": _body.params._id };
//             //console.log("_payload.by ", _payload.by)
//             let _alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
//             if (_type === "U") {
//                 _.each(_body.params, (_val, _key) => {
//                     if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
//                         if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && (!_val._id || _val._id == '') && _key != 'audit') {
//                             delete _val._id;
//                             _payload.query.$push[`${_key}`] = _val;
//                         }
//                         else {
//                             if (_val.constructor.name === 'Array') {
//                                 //   delete _val1._id;
//                                 let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
//                                 if (_rest && _rest.length > 0) {
//                                     _.each(_rest, (item) => { delete item._id })
//                                     _payload.query.$push[`${_key}`] = _rest;
//                                 }
//                             }
//                             _.each(_val, (_val1, _key1) => {
//                                 if (_val.constructor.name === 'Array' && !_val1._id || _val1._id == '') {

//                                 }
//                                 else {
//                                     if (_val.constructor.name === 'Object') {
//                                         if (_val1 && _val1.constructor.name === 'Array') {
//                                             _.each(_val1, (_ov, _ok) => {
//                                                 _.each(_ov, (_ov1, _ok1) => {
//                                                     if (_ok1 == "_id" && _ov1 != '') {
//                                                         _payload.by[`${_key}.${_key1}.${_ok1}`] = _ov1;
//                                                     } else {
//                                                         _params[`${_key}.${_key1}.$.${_ok1}`] = _ov1;
//                                                     }
//                                                 })
//                                             })
//                                         } else {
//                                             if (_key1 == "_id" && _val1 != '') {
//                                                 _payload.by[`${_key}._id`] = _val1;
//                                             }
//                                             else {
//                                                 _params[`${_key}.${_key1}`] = _val1
//                                                 //  _params[`${_key}.$.${_key1}`] = _val1;
//                                             }
//                                         }
//                                         //_params[`${_key}.${_key1}`] = _val1;
//                                     }
//                                     else if (_val.constructor.name === 'Array') {
//                                         _.each(_val1, (_val2, _key2) => {
//                                             if(_val2 != null || _val2 != undefined ){
//                                                 if ((_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array')) {
//                                                     if (_key2 === 'history') {
//                                                         _params[`${_key}.$.${_key2}`] = _val2 ;
//                                                     }
//                                                     else {
//                                                         if(_val2.length === 0 || Object.keys(_val2).length ===0){
//                                                             _params[`${_key}.$.${_key2}`] = _val2 ;
//                                                         }else{
//                                                             _.each(_val2, (_val3, _key3) => {
//                                                                 if (_val3.constructor.name === 'Object') {
//                                                                     if (!_val3._id || _val3._id === '') {
//                                                                         let _dLen = _payload.query.$push[`${_key}.$.${_key2}`];
//                                                                         if (_dLen) {
//                                                                             let _apndList = [];
//                                                                             _apndList.push(_dLen);
//                                                                             _apndList.push(_val3);
//                                                                             _payload.query.$push[`${_key}.$.${_key2}`] = _apndList;
//                                                                         }
//                                                                         else {
//                                                                             _payload.query.$push[`${_key}.$.${_key2}`] = _val3;
//                                                                         }
//                                                                     }
//                                                                     else {
//                                                                         _.each(_val3, (_val4, _key4) => {
//                                                                             if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
//                                                                                 _.each(_val4, (_val5, _key5) => {
//                                                                                     if (_val5.constructor.name === 'Object') {
//                                                                                         if (!_val5._id && _val5._id !== '') {
//                                                                                             _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val5;
//                                                                                         }
//                                                                                         else {
//                                                                                             _.each(_val5, (_val6, _key6) => {
//                                                                                                 if (_key6 == "_id" && _val6 != '') {
//                                                                                                     _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
//                                                                                                 }
//                                                                                                 else {
//                                                                                                     _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
//                                                                                                 }
//                                                                                             });
//                                                                                         }
//                                                                                     }
//                                                                                     else {
//                                                                                         _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
//                                                                                     }
//                                                                                 });
//                                                                             }
//                                                                             else {
//                                                                                 if (_key4 == "_id" && _val4 != '') {
//                                                                                     _payload.by[`${_key}.${_key2}._id`] = _val4;
//                                                                                 }
//                                                                                 else {
//                                                                                     if (_val2.constructor.name === 'Array') {
//                                                                                         let _fObj = _.filter(_payload.mode.arrayFilters, (_o) => { return _o[`${_key2}${_key3}._id`] });
//                                                                                         if (_fObj.length === 0) {
//                                                                                             let _obj = {};
//                                                                                             _obj[`${_key2}${_key3}._id`] = _payload.by[`${_key}.${_key2}._id`];
//                                                                                             _payload.mode.arrayFilters.push(_obj);
//                                                                                         }
//                                                                                         _params[`${_key}.$.${_key2}.$[${_key2}${_key3}].${_key4}`] = _val4;
//                                                                                     }
//                                                                                     else {
//                                                                                         _params[`${_key}.$.${_key2}.${_key3}.${_key4}`] = _val4;
//                                                                                     }
//                                                                                 }
//                                                                             }
//                                                                         });
//                                                                     }
//                                                                 }
//                                                                 else {
//                                                                     if (_key3 == "_id" && _val3 != '') {
//                                                                         _payload.by[`${_key}.${_key2}._id`] = _val3;
//                                                                     }
//                                                                     else {
//                                                                         _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
//                                                                     }
//                                                                 }
//                                                             });
//                                                         }

//                                                     }
//                                                 }
//                                                 else {
//                                                     if (_key2 == "_id" && _val2 != '') {
//                                                         _payload.by[`${_key}._id`] = _val2;
//                                                     }
//                                                     else {
//                                                         _params[`${_key}.$.${_key2}`] = _val2;
//                                                     }
//                                                 }
//                                             }else {
//                                                 _params[`${_key}.$.${_key2}`] = _val2;
//                                             }

//                                         });
//                                     }
//                                 }
//                             });
//                         }
//                     }
//                     else {
//                         _params[_key] = _val;
//                     }
//                 });
//                 delete _params._id;
//                 _payload.query.$set = _params;
//             }
//             else if (_type === 'IAU') {
//                 _.each(_body.params, (_value, _keys) => {
//                     if (_value.constructor.name === 'Object' || _value.constructor.name === 'Array') {
//                         if (_value.constructor.name === 'Array') {
//                             _.each(_value, (_value1, _keys1) => {
//                                 if (_value1.constructor.name === 'Object') {
//                                     _.each(_value1, (_value2, _keys2) => {
//                                         if (_value2.constructor.name === 'Object' || _value2.constructor.name === 'Array') {
//                                             if (_value2.constructor.name === 'Array') {
//                                                 _.each(_value2, (_value3, _keys3) => {
//                                                     if (_value3.constructor.name === 'Object' || _value3.constructor.name === 'Array') {
//                                                         //if (_value3.constructor.name === 'Array') {
//                                                         _.each(_value3, (_value4, _keys4) => {
//                                                             if (_keys4 === '_id') {
//                                                                 _payload.by[`${_keys}.${_keys2}.${_keys4}`] = _value4;
//                                                                 delete _keys4;
//                                                             }
//                                                             else {
//                                                                 _params[`${_keys}.$.${_keys2}.$[].${_keys4}`] = _value4;
//                                                             }
//                                                         });
//                                                         //  }
//                                                         //  else {
//                                                         //      _params[`${_keys}.$.${_keys2}.$.${_keys3}`] = _value2;
//                                                         //  }
//                                                     }
//                                                     else {
//                                                         if (_keys3 === '_id') {
//                                                             _payload.by[`${_keys}.${_keys2}._id`] = _value3;
//                                                             delete _keys2;
//                                                         }
//                                                         //_params[`${_keys}.$.${_keys2}.${_keys3}`] = _value3;
//                                                     }
//                                                 });
//                                             }
//                                             else {
//                                                 _params[`${_keys}.$.${_keys2}`] = _value2;
//                                             }
//                                         }
//                                         else {
//                                             if (_keys2 === '_id') {
//                                                 _payload.by[`${_keys}._id`] = _value2;
//                                                 delete _keys2;
//                                             }
//                                         }
//                                     });
//                                 }
//                                 else {

//                                 }
//                             });
//                         }
//                         else {
//                             _params[`${_keys}`] = _value;
//                         }
//                     }
//                 });
//                 _payload.query.$push = _params;
//             }
//             else if (_type === 'AE') {
//                 delete _body.params._id;
//                 _payload.query.$push = _body.params;
//             }
//             else if (_type === 'BW') {
//                 let _bwObj = {
//                     "updateOne": {
//                         "filter": { "_id": _body.params._id },
//                         "update": {
//                             "$set": {},
//                             "$push": {}

//                         },
//                         upsert: true, new: true
//                     }
//                 };
//                 let _bwData = [];
//                 _.each(_body.params, (_val, _key) => {
//                     if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
//                         if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && (!_val._id || _val._id == '') && _key != 'audit') {
//                             delete _val._id;
//                             _payload.query.$push[`${_key}`] = _val;
//                         }
//                         else if (_val.constructor.name === 'Array') {
//                             //   delete _val1._id;
//                             let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
//                             if (_rest && _rest.length > 0) {
//                                 _.each(_rest, (item) => { delete item._id })
//                                 _payload.query.$push[`${_key}`] = _rest;
//                             }
//                             let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
//                             if (_elm && _elm.length > 0) {
//                                 _.each(_elm, (_ev, _ek) => {
//                                     let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
//                                     _.each(_ev, (_ev1, _ek1) => {
//                                         if (_ek1 === '_id') {
//                                             _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
//                                         }
//                                         else {
//                                             if(_ev1 !=null){
//                                                 if (_ev1.constructor.name === 'Array') {
//                                                     let _fId = _.filter(_ev1, function (o) { return o._id && o._id !== '' });
//                                                     if (_fId && _fId.length === 0) {
//                                                         if (_ev1.length > 1) {
//                                                             _.each(_ev1, (_eV, _eK) => {
//                                                                 let _cloneBwV1 = JSON.parse(JSON.stringify(_bwObj));
//                                                                 _cloneBwV1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
//                                                                 _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}`] = [];
//                                                                 _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}`].push(_eV);
//                                                                 if (Object.keys(_cloneBwV1.updateOne.update.$push).length > 0) {
//                                                                     _bwData.push(_cloneBwV1);
//                                                                 }
//                                                             });
//                                                         }
//                                                         else {
//                                                             _cloneBw.updateOne.update.$push[`${_key}.$.${_ek1}`] = _ev1;
//                                                         }
//                                                     }
//                                                     else {
//                                                         _.each(_ev1, (_ev2, _ek2) => {
//                                                             let _cloneBw1 = JSON.parse(JSON.stringify(_bwObj));
//                                                             if (!_ev2._id) {
//                                                                 _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
//                                                                 _cloneBw1.updateOne.update.$push[`${_key}.$.${_ek1}`] = _ev2;
//                                                             }
//                                                             else {
//                                                                 _.each(_ev2, (_ev3, _ek3) => {
//                                                                     if (_ek3 === '_id') {
//                                                                         _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
//                                                                         _cloneBw1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev3;
//                                                                     }
//                                                                     else {
//                                                                         if (_ev3.constructor.name === 'Array' || _ev3.constructor.name === 'Object') {
//                                                                             _.each(_ev3, (_ev4, _ek4) => {
//                                                                                 if (_ev3.constructor.name === 'Array') {
//                                                                                     if (!_ev4._id && _ev4._id !== '') {
//                                                                                         let _cloneBwV1 = JSON.parse(JSON.stringify(_bwObj));
//                                                                                         _cloneBwV1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
//                                                                                         _cloneBwV1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev2._id;
//                                                                                         _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}.$[].${_ek3}`] = _ev4;
//                                                                                         if (Object.keys(_cloneBwV1.updateOne.update.$push).length > 0) {
//                                                                                             _bwData.push(_cloneBwV1);
//                                                                                         }
//                                                                                     }
//                                                                                     else {
//                                                                                         _.each(_ev4, (_ev5, _ek5) => {
//                                                                                             if (_ek5 === '_id') {
//                                                                                                 _cloneBw1.updateOne.filter[`${_key}.${_ek1}.${_ek3}._id`] = _ev5;
//                                                                                             }
//                                                                                             else {
//                                                                                                 _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.$[].${_ek5}`] = _ev5;
//                                                                                             }
//                                                                                         });
//                                                                                     }
//                                                                                 }
//                                                                                 else {
//                                                                                     _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.${_ek4}`] = _ev4;
//                                                                                 }
//                                                                             });
//                                                                         }
//                                                                         else {
//                                                                             _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}`] = _ev3;
//                                                                         }
//                                                                     }
//                                                                 });
//                                                             }
//                                                             if (Object.keys(_cloneBw1.updateOne.update.$set).length > 0) {
//                                                                 _bwData.push(_cloneBw1);
//                                                             }
//                                                             else if (Object.keys(_cloneBw1.updateOne.update.$push).length > 0) {
//                                                                 _bwData.push(_cloneBw1);
//                                                             }
//                                                         });
//                                                     }
//                                                 }
//                                                 else {
//                                                     if (_ev1.constructor.name === 'Object' && (_ek1 === 'audit')) {
//                                                         _.each(_ev1, (_ev, _ek) => {
//                                                             _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}.${_ek}`] = _ev;
//                                                         });
//                                                     }
//                                                     else {
//                                                         if (_ev1._id) {
//                                                             _.each(_ev1, (_ev, _ek) => {
//                                                                 if (!_ek._id) {
//                                                                     _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}.${_ek}`] = _ev;
//                                                                 }
//                                                             });
//                                                         }
//                                                         else {
//                                                             _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
//                                                         }
//                                                     }
//                                                 }
//                                             }else {
//                                                 _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
//                                             }
//                                         }
//                                     });
//                                     if (Object.keys(_cloneBw.updateOne.update.$set).length > 0 || Object.keys(_cloneBw.updateOne.update.$push).length > 0) {
//                                         _bwData.push(_cloneBw);
//                                     }
//                                 });
//                             }
//                         }
//                         if (_val.constructor.name !== 'Array') {
//                             // let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
//                             // if (_elm && _elm.length > 0) {
//                             //     _.each(_elm, (_ev, _ek) => {
//                             //         let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
//                             //         _.each(_ev, (_ev1, _ek1) => {
//                             //             if (_ek1 === '_id') {
//                             //                 _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
//                             //             }
//                             //             else {
//                             //                 _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
//                             //             }
//                             //         });
//                             //         _bwData.push(_cloneBw);

//                             //     });
//                             // }
//                             // else {
//                             _.each(_val, (_val1, _key1) => {
//                                 if (_val.constructor.name === 'Object' && _key !== 'history') {
//                                     _params[`${_key}.${_key1}`] = _val1;
//                                 }
//                                 else if (_val.constructor.name === 'Array') {
//                                     _.each(_val1, (_val2, _key2) => {
//                                         if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
//                                             _.each(_val2, (_val3, _key3) => {
//                                                 if (_val3.constructor.name === 'Object') {
//                                                     _.each(_val3, (_val4, _key4) => {
//                                                         if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
//                                                             _.each(_val4, (_val5, _key5) => {
//                                                                 if (_val5.constructor.name === 'Object') {
//                                                                     _.each(_val5, (_val6, _key6) => {
//                                                                         if (_key6 == "_id" && _val6 != '') {
//                                                                             _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
//                                                                         }
//                                                                         else {
//                                                                             _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
//                                                                         }
//                                                                     });
//                                                                 }
//                                                                 else {
//                                                                     _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
//                                                                 }
//                                                             });
//                                                         }
//                                                         else {
//                                                             if (_key4 == "_id" && _val4 != '') {
//                                                                 _payload.by[`${_key}.${_key2}._id`] = _val4;
//                                                             }
//                                                             else {
//                                                                 _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val4;
//                                                             }
//                                                         }
//                                                     })
//                                                 }
//                                                 else {
//                                                     _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
//                                                 }
//                                             })
//                                         }
//                                         else {
//                                             if (_key2 == "_id" && _val2 != '') {
//                                                 _payload.by[`${_key}._id`] = _val2;
//                                             }
//                                             else {
//                                                 _params[`${_key}.$.${_key2}`] = _val2;
//                                             }
//                                         }
//                                     });
//                                 }
//                                 // }
//                             })
//                             // }
//                         }
//                     }
//                     else {
//                         _params[_key] = _val;
//                     }
//                 });
//                 delete _params._id;
//                 if (Object.keys(_params).length > 0) {
//                     let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
//                     _cloneBw.updateOne.update.$set = _params;
//                     _cloneBw.updateOne.filter = _payload.by;
//                     _bwData.push(_cloneBw);
//                 }
//                 if (Object.keys(_payload.query.$push).length > 0) {
//                     let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
//                     _cloneBw.updateOne.update.$push = _payload.query.$push;
//                     // _cloneBw.updateOne.filter = _payload.by;
//                     _cloneBw.updateOne.filter = { "_id": _body.params._id };
//                     _bwData.push(_cloneBw);
//                 }
//                 _payload = { "_id": _body.params._id, "pData": _bwData };

//             }
//             resolve({ "success": true, payload: _payload, desc: "" });
//         })
//     }
//     catch (err) {
//         return { "success": false, payload: {}, desc: err };
//     }
// }

function preparePayload(_type, _body) {
    try {
        return new Promise((resolve, reject) => {
            let _params = {};
            let _payload = {
                by: {},
                query: { $set: {}, $push: {} },
                mode: { upsert: true, new: true, arrayFilters: [] }
            }
            _payload.by = { "_id": _body.params._id };
            //console.log("_payload.by ", _payload.by)
            let _alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            if (_type === "U") {
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && (!_val._id || _val._id == '') && _key != 'audit') {
                            delete _val._id;
                            _payload.query.$push[`${_key}`] = _val;
                        }
                        else {
                            if (_val.constructor.name === 'Array') {
                                //   delete _val1._id;
                                let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                                if (_rest && _rest.length > 0) {
                                    _.each(_rest, (item) => { delete item._id })
                                    _payload.query.$push[`${_key}`] = _rest;
                                }
                            }
                            _.each(_val, (_val1, _key1) => {
                                if (_val.constructor.name === 'Array' && !_val1._id || _val1._id == '') {

                                }
                                else {
                                    if (_val.constructor.name === 'Object') {
                                        if (_val1 && _val1.constructor.name === 'Array') {
                                            _.each(_val1, (_ov, _ok) => {
                                                _.each(_ov, (_ov1, _ok1) => {
                                                    if (_ok1 == "_id" && _ov1 != '') {
                                                        _payload.by[`${_key}.${_key1}.${_ok1}`] = _ov1;
                                                    } else {
                                                        _params[`${_key}.${_key1}.$.${_ok1}`] = _ov1;
                                                    }
                                                })
                                            })
                                        } else {
                                            if (_key1 == "_id" && _val1 != '') {
                                                _payload.by[`${_key}._id`] = _val1;
                                            }
                                            else {
                                                _params[`${_key}.${_key1}`] = _val1
                                                //  _params[`${_key}.$.${_key1}`] = _val1;
                                            }
                                        }
                                        //_params[`${_key}.${_key1}`] = _val1;
                                    }
                                    else if (_val.constructor.name === 'Array') {
                                        _.each(_val1, (_val2, _key2) => {
                                            if (_val2 != null || _val2 != undefined) {
                                                if ((_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array')) {
                                                    if (_key2 === 'history') {
                                                        _params[`${_key}.$.${_key2}`] = _val2;
                                                    }
                                                    else {
                                                        if (_val2.length === 0 || Object.keys(_val2).length === 0) {
                                                            _params[`${_key}.$.${_key2}`] = _val2;
                                                        } else {
                                                            _.each(_val2, (_val3, _key3) => {
                                                                if (_val3.constructor.name === 'Object') {
                                                                    if (!_val3._id || _val3._id === '') {
                                                                        let _dLen = _payload.query.$push[`${_key}.$.${_key2}`];
                                                                        if (_dLen) {
                                                                            let _apndList = [];
                                                                            _apndList.push(_dLen);
                                                                            _apndList.push(_val3);
                                                                            _payload.query.$push[`${_key}.$.${_key2}`] = _apndList;
                                                                        }
                                                                        else {
                                                                            _payload.query.$push[`${_key}.$.${_key2}`] = _val3;
                                                                        }
                                                                    }
                                                                    else {
                                                                        _.each(_val3, (_val4, _key4) => {
                                                                            if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                                                _.each(_val4, (_val5, _key5) => {
                                                                                    if (_val5.constructor.name === 'Object') {
                                                                                        if (!_val5._id && _val5._id !== '') {
                                                                                            _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val5;
                                                                                        }
                                                                                        else {
                                                                                            _.each(_val5, (_val6, _key6) => {
                                                                                                if (_key6 == "_id" && _val6 != '') {
                                                                                                    _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                                                }
                                                                                                else {
                                                                                                    _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                if (_key4 == "_id" && _val4 != '') {
                                                                                    _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                                                }
                                                                                else {
                                                                                    if (_val2.constructor.name === 'Array') {
                                                                                        let _fObj = _.filter(_payload.mode.arrayFilters, (_o) => { return _o[`${_key2}${_key3}._id`] });
                                                                                        if (_fObj.length === 0) {
                                                                                            let _obj = {};
                                                                                            _obj[`${_key2}${_key3}._id`] = _payload.by[`${_key}.${_key2}._id`];
                                                                                            _payload.mode.arrayFilters.push(_obj);
                                                                                        }
                                                                                        _params[`${_key}.$.${_key2}.$[${_key2}${_key3}].${_key4}`] = _val4;
                                                                                    }
                                                                                    else {
                                                                                        _params[`${_key}.$.${_key2}.${_key3}.${_key4}`] = _val4;
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                                else {
                                                                    if (_key3 == "_id" && _val3 != '') {
                                                                        _payload.by[`${_key}.${_key2}._id`] = _val3;
                                                                    }
                                                                    else {
                                                                        _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
                                                                    }
                                                                }
                                                            });
                                                        }

                                                    }
                                                }
                                                else {
                                                    if (_key2 == "_id" && _val2 != '') {
                                                        _payload.by[`${_key}._id`] = _val2;
                                                    }
                                                    else {
                                                        _params[`${_key}.$.${_key2}`] = _val2;
                                                    }
                                                }
                                            } else {
                                                _params[`${_key}.$.${_key2}`] = _val2;
                                            }

                                        });
                                    }
                                }
                            });
                        }
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                _payload.query.$set = _params;
            }
            else if (_type === 'IAU') {
                _.each(_body.params, (_value, _keys) => {
                    if (_value.constructor.name === 'Object' || _value.constructor.name === 'Array') {
                        if (_value.constructor.name === 'Array') {
                            _.each(_value, (_value1, _keys1) => {
                                if (_value1.constructor.name === 'Object') {
                                    _.each(_value1, (_value2, _keys2) => {
                                        if (_value2.constructor.name === 'Object' || _value2.constructor.name === 'Array') {
                                            if (_value2.constructor.name === 'Array') {
                                                _.each(_value2, (_value3, _keys3) => {
                                                    if (_value3.constructor.name === 'Object' || _value3.constructor.name === 'Array') {
                                                        //if (_value3.constructor.name === 'Array') {
                                                        _.each(_value3, (_value4, _keys4) => {
                                                            if (_keys4 === '_id') {
                                                                _payload.by[`${_keys}.${_keys2}.${_keys4}`] = _value4;
                                                                delete _keys4;
                                                            }
                                                            else {
                                                                _params[`${_keys}.$.${_keys2}.$[].${_keys4}`] = _value4;
                                                            }
                                                        });
                                                        //  }
                                                        //  else {
                                                        //      _params[`${_keys}.$.${_keys2}.$.${_keys3}`] = _value2;
                                                        //  }
                                                    }
                                                    else {
                                                        if (_keys3 === '_id') {
                                                            _payload.by[`${_keys}.${_keys2}._id`] = _value3;
                                                            delete _keys2;
                                                        }
                                                        //_params[`${_keys}.$.${_keys2}.${_keys3}`] = _value3;
                                                    }
                                                });
                                            }
                                            else {
                                                _params[`${_keys}.$.${_keys2}`] = _value2;
                                            }
                                        }
                                        else {
                                            if (_keys2 === '_id') {
                                                _payload.by[`${_keys}._id`] = _value2;
                                                delete _keys2;
                                            }
                                        }
                                    });
                                }
                                else {

                                }
                            });
                        }
                        else {
                            _params[`${_keys}`] = _value;
                        }
                    }
                });
                _payload.query.$push = _params;
            }
            else if (_type === 'AE') {
                delete _body.params._id;
                _payload.query.$push = _body.params;
            }
            else if (_type === 'BW') {
                let _bwObj = {
                    "updateOne": {
                        "filter": { "_id": _body.params._id },
                        "update": {
                            "$set": {},
                            "$push": {}

                        },
                        upsert: true, new: true
                    }
                };
                let _bwData = [];
                _.each(_body.params, (_val, _key) => {
                    if (_val.constructor.name === 'Object' || _val.constructor.name === 'Array') {
                        if (_val.constructor.name === 'Object' && Object.keys(_val).length > 0 && (!_val._id || _val._id == '') && _key != 'audit') {
                            delete _val._id;
                            _payload.query.$push[`${_key}`] = _val;
                        }
                        else if (_val.constructor.name === 'Array') {
                            // if(_val.length === 0){
                            //     _params[_key] = _val;
                            // }
                            //   delete _val1._id;
                            let _rest = _.filter(_val, function (o) { return !o._id || o._id == '' });
                            if (_rest && _rest.length > 0) {
                                _.each(_rest, (item) => { delete item._id })
                                _payload.query.$push[`${_key}`] = _rest;
                            }
                            let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            if (_elm && _elm.length > 0) {
                                _.each(_elm, (_ev, _ek) => {
                                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                                    _.each(_ev, (_ev1, _ek1) => {
                                        if (_ek1 === '_id') {
                                            _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
                                        }
                                        else {
                                            if (_ev1 != null) {
                                                if (_ev1.constructor.name === 'Array') {
                                                    if (_ev1.length > 0) {
                                                        let _fId = _.filter(_ev1, function (o) { return o._id && o._id !== '' });
                                                        if (_fId && _fId.length === 0) {
                                                            if (_ev1.length > 1) {
                                                                _.each(_ev1, (_eV, _eK) => {
                                                                    let _cloneBwV1 = JSON.parse(JSON.stringify(_bwObj));
                                                                    _cloneBwV1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                                    _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}`] = [];
                                                                    _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}`].push(_eV);
                                                                    if (Object.keys(_cloneBwV1.updateOne.update.$push).length > 0) {
                                                                        _bwData.push(_cloneBwV1);
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                _cloneBw.updateOne.update.$push[`${_key}.$.${_ek1}`] = _ev1;
                                                            }
                                                        }
                                                        else {
                                                            _.each(_ev1, (_ev2, _ek2) => {
                                                                let _cloneBw1 = JSON.parse(JSON.stringify(_bwObj));
                                                                if (!_ev2._id) {
                                                                    _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                                    _cloneBw1.updateOne.update.$push[`${_key}.$.${_ek1}`] = _ev2;
                                                                }
                                                                else {
                                                                    _.each(_ev2, (_ev3, _ek3) => {
                                                                        if (_ek3 === '_id') {
                                                                            _cloneBw1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                                            _cloneBw1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev3;
                                                                        }
                                                                        else {
                                                                            if (_ev3.constructor.name === 'Array' || _ev3.constructor.name === 'Object') {
                                                                                _.each(_ev3, (_ev4, _ek4) => {
                                                                                    if (_ev3.constructor.name === 'Array') {
                                                                                        if (!_ev4._id && _ev4._id !== '') {
                                                                                            let _cloneBwV1 = JSON.parse(JSON.stringify(_bwObj));
                                                                                            _cloneBwV1.updateOne.filter = JSON.parse(JSON.stringify(_cloneBw.updateOne.filter));
                                                                                            _cloneBwV1.updateOne.filter[`${_key}.${_ek1}._id`] = _ev2._id;
                                                                                            _cloneBwV1.updateOne.update.$push[`${_key}.$.${_ek1}.$[].${_ek3}`] = _ev4;
                                                                                            if (Object.keys(_cloneBwV1.updateOne.update.$push).length > 0) {
                                                                                                _bwData.push(_cloneBwV1);
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            _.each(_ev4, (_ev5, _ek5) => {
                                                                                                if (_ek5 === '_id') {
                                                                                                    _cloneBw1.updateOne.filter[`${_key}.${_ek1}.${_ek3}._id`] = _ev5;
                                                                                                }
                                                                                                else {
                                                                                                    _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.$[].${_ek5}`] = _ev5;
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}.${_ek4}`] = _ev4;
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                _cloneBw1.updateOne.update.$set[`${_key}.$.${_ek1}.$[].${_ek3}`] = _ev3;
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                                if (Object.keys(_cloneBw1.updateOne.update.$set).length > 0) {
                                                                    _bwData.push(_cloneBw1);
                                                                }
                                                                else if (Object.keys(_cloneBw1.updateOne.update.$push).length > 0) {
                                                                    _bwData.push(_cloneBw1);
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1
                                                    }

                                                }
                                                else {
                                                    if (_ev1.constructor.name === 'Object' && (_ek1 === 'audit')) {
                                                        _.each(_ev1, (_ev, _ek) => {
                                                            _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}.${_ek}`] = _ev;
                                                        });
                                                    }
                                                    else {
                                                        if (_ev1._id) {
                                                            _.each(_ev1, (_ev, _ek) => {
                                                                if (!_ek._id) {
                                                                    _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}.${_ek}`] = _ev;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
                                                        }
                                                    }
                                                }
                                            } else {
                                                _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
                                            }
                                        }
                                    });
                                    if (Object.keys(_cloneBw.updateOne.update.$set).length > 0 || Object.keys(_cloneBw.updateOne.update.$push).length > 0) {
                                        _bwData.push(_cloneBw);
                                    }
                                });
                            }
                        }
                        if (_val.constructor.name !== 'Array') {
                            // let _elm = _.filter(_val, function (o) { return o._id && o._id !== '' });
                            // if (_elm && _elm.length > 0) {
                            //     _.each(_elm, (_ev, _ek) => {
                            //         let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                            //         _.each(_ev, (_ev1, _ek1) => {
                            //             if (_ek1 === '_id') {
                            //                 _cloneBw.updateOne.filter[`${_key}._id`] = _ev1;
                            //             }
                            //             else {
                            //                 _cloneBw.updateOne.update.$set[`${_key}.$.${_ek1}`] = _ev1;
                            //             }
                            //         });
                            //         _bwData.push(_cloneBw);

                            //     });
                            // }
                            // else {
                            _.each(_val, (_val1, _key1) => {
                                if (_val.constructor.name === 'Object' && _key !== 'history') {
                                    _params[`${_key}.${_key1}`] = _val1;
                                }
                                else if (_val.constructor.name === 'Array') {
                                    _.each(_val1, (_val2, _key2) => {
                                        if (_val2.constructor.name === 'Object' || _val2.constructor.name === 'Array') {
                                            _.each(_val2, (_val3, _key3) => {
                                                if (_val3.constructor.name === 'Object') {
                                                    _.each(_val3, (_val4, _key4) => {
                                                        if (_val4.constructor.name === 'Object' || _val4.constructor.name === 'Array') {
                                                            _.each(_val4, (_val5, _key5) => {
                                                                if (_val5.constructor.name === 'Object') {
                                                                    _.each(_val5, (_val6, _key6) => {
                                                                        if (_key6 == "_id" && _val6 != '') {
                                                                            _payload.by[`${_key}.${_key2}.${_key4}._id`] = _val6;
                                                                        }
                                                                        else {
                                                                            _params[`${_key}.$.${_key2}.$[].${_key4}.$[].${_key6}`] = _val6;
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    _params[`${_key}.$.${_key2}.$[].${_key4}.${_key5}`] = _val5;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            if (_key4 == "_id" && _val4 != '') {
                                                                _payload.by[`${_key}.${_key2}._id`] = _val4;
                                                            }
                                                            else {
                                                                _params[`${_key}.$.${_key2}.$[].${_key4}`] = _val4;
                                                            }
                                                        }
                                                    })
                                                }
                                                else {
                                                    _params[`${_key}.$.${_key2}.${_key3}`] = _val3;
                                                }
                                            })
                                        }
                                        else {
                                            if (_key2 == "_id" && _val2 != '') {
                                                _payload.by[`${_key}._id`] = _val2;
                                            }
                                            else {
                                                _params[`${_key}.$.${_key2}`] = _val2;
                                            }
                                        }
                                    });
                                }
                                // }
                            })
                            // }
                        }
                    }
                    else {
                        _params[_key] = _val;
                    }
                });
                delete _params._id;
                if (Object.keys(_params).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$set = _params;
                    _cloneBw.updateOne.filter = _payload.by;
                    _bwData.push(_cloneBw);
                }
                if (Object.keys(_payload.query.$push).length > 0) {
                    let _cloneBw = JSON.parse(JSON.stringify(_bwObj));
                    _cloneBw.updateOne.update.$push = _payload.query.$push;
                    // _cloneBw.updateOne.filter = _payload.by;
                    _cloneBw.updateOne.filter = { "_id": _body.params._id };
                    _bwData.push(_cloneBw);
                }
                _payload = { "_id": _body.params._id, "pData": _bwData };

            }
            resolve({ "success": true, payload: _payload, desc: "" });
        })
    }
    catch (err) {
        return { "success": false, payload: {}, desc: err };
    }
}

/** Common Mongo Function */
async function commonMonogoCall(_method, _query, _params, _flag, _body, _filter, _key) {
    try {
        return new Promise((resolve, reject) => {
            mongoMapper(_method, _query, _params, _key).then((result) => {
                if (_flag == 'REVNO') {
                    if (result && Object.keys(result.data).length > 0) {
                        if (_query === 'findOne' && _filter && result.data[_filter] && result.data[_filter][0]) {
                            result.data = result.data[_filter][0];
                        }
                        let _cBody = _.clone(_body);
                        if (_cBody.params.revNo == result.data.revNo) {
                            _cBody.params.revNo = parseInt(result.data.revNo) + 1;
                            _cBody.params.audit = result.data.audit;
                            resolve({ success: true, data: _cBody || [] })
                        }
                        else {
                            let _revHist = (result.data && result.data.revHist) ? result.data.revHist.sort().reverse()[0] : "";
                            resolve({
                                success: false,
                                data: [{
                                    "modifiedBy": _revHist.documentedBy || "",
                                    "modifiedDt": _revHist.documentedDt || ""
                                }],
                                desc: `Provided RevNo not matched, someone updated this record, please reload the page..`
                            })
                        }
                    }
                    else {
                        resolve({ success: false, data: [], desc: `No data found..` })
                    }
                }
                else {
                    resolve({ success: true, data: result.data || [] })
                }
            }).catch((error) => {
                console.log("error", error)
                resolve({ success: false, data: [], desc: `Error occured While executing proc, Error: - ${error.desc || error} ` })
            });
        })
    }
    catch (err) {
        return { success: false, data: [], desc: `Error occured, Error: - ${err.message} ` }
    }
};

async function validateMethod(_method, _payload) {
    let output = { method: "", filter: "", sort: "", selectors: "" };
    if (!_method) {
        return { success: false, data: [], desc: "Missing Method .." };
    }
    else {
        let _mdl = _.find(_schemaData, function (o) { return `${o.db}_${o.coll}` == _method; });
        if (!_mdl || Object.keys(_mdl).length == 0) {
            return { success: false, data: [], desc: "No Model data is available .." };
        }
        else {
            _.each(_mdl, (_obj, _key) => {
                if (_key != 'schema') {
                    output[_key] = _obj;
                }
            });
            let _fMdl = `${_mdl.db}_${_mdl.coll}`;
            output.method = _fMdl;
            output.model = _fMdl;
            return { success: true, data: output, desc: "" }
        }
    }
};

/*Insert History Data */
async function insertHistoryData(_method, _mParams, _body, req) {

    return new Promise(async (resolve, reject) => {
        try {
            let _payload = await validateMethod(_method);
            if (!(_payload && _payload.success)) {
                resolve({ success: false, data: [], desc: `Error occured, Error: - ${_payload.desc} ` });
            }
            let _hParams = {
                tranId: _mParams._id,
                method: _method,
                collectionName: _payload.data.coll,
                audit: {
                    documentedById: _mParams.audit.documentedById,
                    documentedBy: _mParams.audit.documentedBy,
                    documentedDt: _mParams.audit.documentedDt,
                    modifiedById: req.tokenData.userId,
                    modifiedBy: req.tokenData.userName
                },
                revNo: _body.revNo,
                history: _body
            }
            let _hMethod = "";
            if (req.clientUrls && req.clientUrls.dbName && req.clientUrls.dbName.length > 0) {
                _hMethod = req.clientUrls.dbName;
            } else {
                _hMethod = _method.split('_')[0];
            }

            let _mResp = await commonMonogoCall(`${_hMethod}_histories`, "insertMany", _hParams, "", "", "", req.tokenData.dbType)
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

async function getSequenceNextValue(params, _cntrs, req) {
    try {
        let _filter = {
            by: { locId: params.locId, seqName: params.seqName },
            query: { $inc: { seqValue: 1 } },
            mode: { new: true }
        }
        let cntrsMtd = `${_cntrs}_counters`
        let _seqResp = await commonMonogoCall(cntrsMtd, "findOneAndUpdate", _filter, "", "", "", req.tokenData.dbType);
        if (!(_seqResp && _seqResp.success && _seqResp.data && Object.keys(_seqResp.data).length > 0)) {
            return { success: false, desc: _seqResp.desc || "No Data found", data: [] };
        }
        let _digits = _seqResp.data.digits || 5;
        let _frmDigit = _seqResp.data.seqValue.toLocaleString('en-US', { minimumIntegerDigits: _digits, useGrouping: false });
        if (_seqResp.data.format && _seqResp.data.format === 'YYMM') {
            _frmDigit = moment().format('YY') + moment().format('MM') + _frmDigit;
        }
        return { success: true, data: `${_seqResp.data.seqType}${_frmDigit}` };
    }
    catch (err) {
        return { success: false, desc: err.message || err, data: [] };
    }
};



module.exports = {
    preparePayload,
    commonMonogoCall,
    insertHistoryData,
    getSequenceNextValue,
    validateMethod
}
'use strict';
const mongo = require("../../connections/mongo-db");
const _modules = require("../../../constants/mongo-db/schema_modules");
//const _mUtils = require("../../../constants/mongo-db/utils");
let _collections = {};

setTimeout(() => {
    for (const _m of _modules) {
        if (_m.schema.constructor.name === 'Schema') {
            _collections[_m] = global.db.emr.model(_m.db, _m.schema);
        }
        else {
            for (const _key of _m.schema) {
                if (_key["db"].trim() && _key["coll"]) {
                    if (!_m.multi) {
                        let _alias = `${_key["db"].trim()}_${_key["coll"].trim()}`
                        _collections[_alias.trim()] = global.db[_key["db"].trim()].model(_key["coll"].trim(), _key["schema"])
                    }
                    else {
                        for (const _mkey of _m.alias) {
                            let _alias = `${_mkey}_${_key["db"].trim()}_${_key["coll"].trim()}`;
                            let _db = `${_key["db"].trim()}_${_mkey}`
                            _collections[_alias.trim()] = global.db[_db].model(_key["coll"].trim(), _key["schema"])
                        }
                    }
                }
            }
        }
    }
}, 1000);

module.exports = (_method, _action, _params, _key) => {
    const _mUtils = require("../../../constants/mongo-db/utils");
    return new Promise(async (resolve, reject) => {

        try {
            let _payload = await _mUtils.validateMethod(_method);
            if (!_payload.success || !_payload.data.model || !_action) {
                reject({ status: "FAIL", data: [], desc: `No Model Found against this ${_method} / Missing required params` })
            }
            else {
                if (_action === 'find') {
                    _payload.data.filter = _params.filter;
                    _payload.data.selectors = _params.selectors;
                    _payload.data.limit = _params.limit;
                }
                else if (_action === 'findOne') {
                    _payload.data.filter = _params.filter;
                    _payload.data.selectors = _params.selectors;
                }
                else if (_action === 'findById') {
                    _payload.data.data = _params._id || _params;
                }
                else if (_action === 'insertMany') {
                    _payload.data.data = _params;
                }
                else if (_action === 'findOneAndUpdate' || _action === 'updateOne' || _action === 'bulkWrite' || _action === 'replaceOne' || _action === 'findOneAndReplace') {
                    _payload.data.data = _params;
                }
                let _model = null;
                if (!_key) {
                    _model = _collections[_payload.data.model] ? _collections[_payload.data.model] : "";
                }
                else {
                    let _mdl = `${_key}_${_payload.data.model}`
                    _model = _collections[_mdl] ? _collections[_mdl] : "";
                }
                if (typeof _model == 'undefined' || _model == null || _model == "") {
                    reject({ status: "FAIL", data: [], desc: `No Model Found against this ${_payload.data.model}` })
                }
                else {
                    mongo(_model, _action, _payload.data).then((result) => {
                        resolve({ status: 'SUCCESS', desc: '', data: result.data });
                    }).catch((error) => {
                        reject({ status: 'FAIL', data: [], desc: error.desc || error });
                    });
                }
            }
        }
        catch (err) {
            reject({ status: "FAIL", data: [], desc: err.message || err })
        }
    })

};


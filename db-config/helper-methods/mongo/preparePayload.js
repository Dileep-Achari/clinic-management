const _ = require("lodash");
const _models = require("../../../constants/mongo-db/models");

module.exports = {
    prepare: (_method, _payload) => {
        let output = { method: "", filter: "", sort: "", selectors: "" };
        if (!_method) {
            return { success: false, data: [], desc: "Missing Method .." };
        }
        else { 
            let _mdl = _.find(_models, function (o) { return o.method == _method; });
            if (!_mdl || Object.keys(_mdl).length == 0) {
                return { success: false, data: [], desc: "No Model data is available .." };
            }
            else {
             
                _.each(_mdl, (_obj, _key) => {
                    output[_key] = _obj;
                })
                return { success: true, data: output, desc: "" }
            }
        }
    }

}
const mapper = require("../db-config/mapper");
const dbSchema = require("../db-config/helper-methods/sql/schema-generate");
const responseChange = require("../db-config/helper-methods/sql/response-change");
const generateParams = require("../db-config/helper-methods/sql/generate-parameters");

function generateCustomParams(_method, _module, _loadAjax = "N", _multiResult = "N") {
    return {
        "URL": _method,
        "IS_MULTI_RESULTSET": _multiResult,
        "IS_LOAD_AJAX": _loadAjax,
        "MODULE": _module
    }
}

module.exports = (_module, _method, _schemaName, _params, _loadAjax, _multiResult) => {
    return new Promise((resolve, reject) => {
        let _cParams = generateCustomParams(_method, _module, _loadAjax, _multiResult);
        let _dbSchema = dbSchema(_module);
        _dbSchema = _dbSchema[_schemaName];
        _params = generateParams(_params, _cParams);
        mapper(_dbSchema, _params, _cParams).then((response) => {
            return resolve(responseChange(response, _cParams));
        }).catch((error) => {
            return reject(error);
        });
    });
}
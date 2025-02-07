'use strict';
const datatype = require("./datatype");
const direction = require("./direction");
const TIMEZONE_OFFSET = 0;

function getValue(val, type) {
    if (!val) {
        if (type === "NUMBER") {
            if (val === 0 || val === "0") {
                val = 0;
            }
            else val = null;
        }
        else val = null;
    }
    return val;
}


module.exports = (oracle, schema, payLoad) => {
    try {
        let pObj = { PROC: `BEGIN ${schema.SpName}(`, PARAMS: {}, OUTPUT: "" };
        let pSchema = schema.Schema;
        let error;
        pSchema.forEach(obj => {
            pObj.PROC += `:${obj.alias}, `;
            const cDataType = datatype(oracle, obj.type);
            const cDirection = direction(oracle, obj.direction);
            if (cDataType && cDirection && (cDataType.ERROR || cDirection.ERROR)) {
                error = cDataType || cDirection;
                return;
            }
            else {
                if (obj.direction === "IN") {
                    const value = getValue(payLoad[obj.column ? obj.column : obj.alias], obj.type);
                    pObj.PARAMS[obj.alias] = { val: value, dir: cDirection, type: cDataType };
                }
                else if (obj.direction === "OUT" || obj.direction === "IN_OUT") {
                    pObj.PARAMS[obj.alias] = { type: cDataType, dir: cDirection };
                    pObj.OUTPUT = obj.alias;
                }
            }
        });

        if (error) return error;
        pObj.PROC = pObj.PROC.substr(0, pObj.PROC.length - 2) + "); END;"
        return pObj;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_PARAMS", "MESSAGE": ex.message };
    }
}
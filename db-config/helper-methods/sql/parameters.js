'use strict';
const prepareDatatype = require("./datatype");
const TIMEZONE_OFFSET = 0;

function getFrmtDateTime(_dt) {
    try {
        return `${_dt.getFullYear()}-${(_dt.getMonth() + 1) > 9 ? (_dt.getMonth() + 1) : "0" + (_dt.getMonth() + 1)}-${_dt.getDate() < 10 ? ("0" + _dt.getDate()) : _dt.getDate()}T${(_dt.getHours() > 9 ? _dt.getHours() : "0" + _dt.getHours())}:${(_dt.getMinutes() > 9 ? _dt.getMinutes() : "0" + _dt.getMinutes())}Z`;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PARSE_DATE", "MESSAGE": `Error in parsing datetime Into ISO` };
    }
}

function getValue(type, value) {
    try {
        if (type === "DATE_TIME_2") {
            if (!value) value = null;
            else {
                if (value.indexOf("Z") === -1) {
                    if (value.length === 10) {
                        if (value.indexOf('/')) value = value.replace(/\//gm, '-');
                        let nDt = value.split('-');
                        if (nDt && nDt[2] && nDt[2].length === 4) value = `${nDt[2]}-${nDt[0]}-${nDt[1]}`;
                        nDt = null;
                        value = `${value}T00:00Z`
                    }
                    else {
                        value = getFrmtDateTime(new Date(value));
                        if (value && value.ERROR) return value;
                    }
                }
                else {
                    value = new Date(new Date(value).setMinutes(new Date(value).getMinutes() - (TIMEZONE_OFFSET)));
                    value = getFrmtDateTime(value);
                    if (value && value.ERROR) return value;
                }
            }
        }
        else if (type === "TIME") {
            if (!value) value = null;
            else value = `1970-01-01T${value}:00.000Z`;
        }
        else if (type === 'TINYINT' || type === 'SMALLINT' || type === 'INT' || type === 'BIGINT' || type === 'NUMERIC' || type === 'FLOAT' || type === 'MONEY' || type === 'SMALLMONEY') {
            if (value === 0 || value === "0") value = 0;
            else if (!value) value = null;
        }
        else {
            if (!value) value = null;
        }
        return value;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_GEN_VALUE", "MESSAGE": `Error in parsing given value ${value}` };
    }
}

module.exports = (sql, pool, schema, payLoad) => {
    try {
        let isError;
        if (schema && Array.isArray(schema.Schema)) {
            schema.Schema.forEach(obj => {
                obj.alias = obj.alias ? obj.alias.trim() : "";
                obj.column = obj.column ? obj.column.trim() : "";
                if (payLoad[obj.column] && typeof payLoad[obj.column] === 'string')
                    payLoad[obj.column] = payLoad[obj.column].trim();

                const dataType = prepareDatatype(sql, obj.type);
                if (dataType && dataType.ERROR) {
                    isError = dataType
                    return;
                }

                if (obj.direction === 'IN') {
                    const value = getValue(obj.type, payLoad[obj.column]);
                    if (value && value.ERROR) {
                        isError = value;
                        return;
                    }
                    pool.input(obj.alias, dataType, value);
                }
                else if (obj.direction === 'OUT') {
                    pool.output(obj.alias, dataType);
                }
            });
            sql = schema = payLoad = null;
            if (isError) return isError;
            return pool;
        }
        else {
            return { "ERROR": "ERROR_WHILE_PREPARE_PARAMS", "MESSAGE": "In correct schema" }
        }
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_PARAMS", "MESSAGE": ex.message }
    }
}
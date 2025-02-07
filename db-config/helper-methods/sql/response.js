'use strict';

function formatData(columns, arr, _conToBigint) {
    if (!_conToBigint) _conToBigint = 'Y';
    let dateArr = [], bigIntArr = [];

    for (var i in columns) {
        if (i && (columns[i].type.name === 'DateTime' || columns[i].type.name === 'SmallDateTime')) {
            dateArr.push(i);
        }
        if (i && columns[i].type.name === 'BigInt' && (_conToBigint === 'Y')) {
            bigIntArr.push(i);
        }
    }

    if (dateArr && dateArr.length > 0 || bigIntArr && bigIntArr.length > 0) {
        for (let k in arr) {
            for (let dt in dateArr) {
                if (arr[k][dateArr[dt]] && arr[k][dateArr[dt]].toISOString) {
                    arr[k][dateArr[dt]] = arr[k][dateArr[dt]].toISOString();
                    arr[k][dateArr[dt]] = arr[k][dateArr[dt]].substr(0, arr[k][dateArr[dt]].length - 5)
                }
            }

            for (let int in bigIntArr) {
                if (arr[k][bigIntArr[int]]) {
                    try {
                        let intData = parseInt(arr[k][bigIntArr[int]]);
                        if (intData) arr[k][bigIntArr[int]] = intData;
                    }
                    catch (ex) {
                    }
                }
            }
        }
    }
    return arr;
}


module.exports = (result, isMulti, isLoadAjax, method, conToBigint) => {
    try {
        if (!isMulti) isMulti = 'N';
        if (isMulti === 'Y' && result.recordsets && result.recordsets.length > 0) {
            let obj = {};
            for (var k in result.recordsets) {
                obj['Table' + (parseInt(k) === 0 ? '' : k)] = (result.recordsets[k] && result.recordsets[k].length > 0) ? formatData(result.recordsets[k].columns, result.recordsets[k], conToBigint) : [];
            }
            result = obj;
            obj = null;
        }
        else if (result.output && Object.keys(result.output) && (Object.keys(result.output).length > 0) && (!result.recordset || (result.recordset && result.recordset.length == 0))) {
            result = result.output || "";
        }
        else if (result.recordset && result.recordset.length > 0) {
            result = formatData(result.recordset.columns, result.recordset, conToBigint);
        } else result = [];
        return result;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_PARAMS", "MESSAGE": ex.message }
    }
}
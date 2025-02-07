const pg = require('pg');
const connectionString = require("../../config/connection-string")("pgDbMIS");
const pool = new pg.Pool(connectionString);

async function fetchData(ftch, ftchName) {
    return new Promise(function (resolve, reject) {
        ftch.query(ftchName, function (err, data) {
            if (err) reject(err);
            else resolve(data.rows);
        });
    });
}

function prepareDtaFn(sch, val) {
    if (sch.type == 'timestamp') {
        if (val == '' || val == 'undefined' || val == undefined) {
            return null;
        } else return `'${val}'`;
    }
    else if (sch.type == 'bigint') {
        if (val == '' || val == 0 || val == 'undefined' || val == undefined) {
            return (val == 0 ? 0 : null);
        } else return val;
    }
    else {
        if (!val || val == '' || val == 'undefined' || val == undefined) {
            if (val === 0 || val === '0') {
                return '0'
            }
            else
                return null;
        } else return `'${val}'`;
    }
}

function genDbExecuton(mObj, payload) {
    let str = `begin;\n select * from ${mObj.SpName} (`;
    for (var k in mObj.Schema) {
        mObj.Schema[k].column = mObj.Schema[k].column;
        str += `${mObj.Schema[k].alias}:=${prepareDtaFn(mObj.Schema[k], payload[mObj.Schema[k].column])}, `;
    }

    str = str.substr(0, str.length - 2);
    str += `)\nFETCH ALL IN "<unnamed portal 1>"\ncommit;`;
    return str;
}

function preTxtVal(mObj, payload) {
    let text = "select " + (mObj.SpName) + "(", value = [];

    for (var i in mObj.Schema) {
        text += "$" + (parseInt(i) + 1) + ", ";
        mObj.Schema[i].column = mObj.Schema[i].column;
        if (mObj.Schema[i].column && payload[mObj.Schema[i].column])
            value.push(payload[mObj.Schema[i].column]);
        else {
            if (mObj.Schema[i].type == 'timestamp') {
                value.push(null);
            }
            else if ((mObj.Schema[i].type == 'bigint') && (payload[mObj.Schema[i].column] == 0)) {
                value.push(0);
            }
            else value.push(null);
        }

    }

    if (mObj.Schema && mObj.Schema.length > 0) text = text.substr(0, text.length - 2) + ")";
    else text = text + ")";
    return { "TEXT": text, "VALUE": value };
}

function genArr(arr, pName) {
    let cursorArr = [], curStr = null;
    if (arr && (typeof arr === 'object') && arr.length > 0) {
        if (JSON.stringify(arr).indexOf('<unnamed portal') > -1) {
            if (arr.length > 1) {
                for (var cr in arr) cursorArr.push(arr[cr][pName]);
            }
            else {
                curStr = arr[0][pName];
                if (curStr && (curStr.indexOf("(") > -1) && (curStr.indexOf(")") > -1)) {
                    curStr = curStr.replace("(", "").replace(")", "").replace(/"/gmi, "");
                    cursorArr = curStr.split(",");
                } else {
                    cursorArr.push(curStr);
                }
            }
        }
        else {
            if (arr && arr.length > 1) curStr = arr;
            else curStr = arr[0][pName];
        }
    }
    if (!cursorArr || cursorArr.length == 0) cursorArr = null;
    if (cursorArr && cursorArr.length > 0) curStr = null;
    return { "ARR": cursorArr, "STR": curStr };
}

module.exports = (_schema, _payLoad, _cParams) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        const dbExec = genDbExecuton(_schema, _payLoad);
        try {
            let preData = preTxtVal(_schema, _payLoad), resObj = {}, resStr = "", resArr = [], sendRespArr;
            await client.query("BEGIN;");
            let results = await client.query({ text: preData.TEXT, values: preData.VALUE });
//console.log("reslts",results);
            resObj = genArr(results.rows, _schema.SpName.toLowerCase());
            resArr = resObj.ARR;
            resStr = resObj.STR;
//console.log("reslts",resStr);
            if (resArr && (resArr.length > 0) && resArr[0] && resArr[1]) {
                let i = 0;
                sendRespArr = {};
                while (resArr.length > i) {
                    if (resArr[i]) {
                        sendRespArr[`Table${(i === 0 ? "" : i)}`] = await fetchData(client, `FETCH ALL FROM "${resArr[i]}"`);
                        if (sendRespArr[`Table${(i === 0 ? "" : i)}`] && sendRespArr[`Table${(i === 0 ? "" : i)}`].length > 0) {
                            sendRespArr[`Table${(i === 0 ? "" : i)}`] = sendRespArr[`Table${(i === 0 ? "" : i)}`];
                        }
                    }
                    i++;
                }
            }
            else if (resArr && (resArr.length > 0) && resArr[0] && !resArr[1]) {
                sendRespArr = await fetchData(client, `FETCH ALL FROM "${resArr[0]}"`);
                if (sendRespArr && sendRespArr.length > 0) {
                    sendRespArr = sendRespArr;
                }
            }
            else {
                if (resStr) {
                    sendRespArr = resStr;
                }
                else sendRespArr = null;
            }

            // await client.query("COMMIT;");
            // await client.release();

            if (sendRespArr && sendRespArr.length > 0 && (sendRespArr[0].error_cd || sendRespArr[0].par_error_code) && (sendRespArr[0].error_msg || sendRespArr[0].par_error_msg)) {
                return reject({ "ERROR": sendRespArr[0], "DB_EXEC": dbExec });
            }
            else {
                return resolve({ "RES_OBJ": sendRespArr, "DB_EXEC": dbExec }, null);
            }
        }
        catch (ex) {
            if (client) {
                await client.query("ROLLBACK;");
                // await client.query("COMMIT;");
                // await client.release();
            }
            return reject({ "ERROR": ex.message, "DB_EXEC": dbExec });
        }
        finally {
            if (client) {
                await client.query("COMMIT;");
                await client.release();
            }
        }
    });
};
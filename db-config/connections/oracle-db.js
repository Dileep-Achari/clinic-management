'use strict';
const oracledb = require('oracledb');
const connectionString = require("../../config/connection-string")("oracleDb");
const params = require("../helper-methods/oracle/parameters");
let pool;

async function createPool() {
    try {
        return { "_pool": await oracledb.createPool(connectionString), "_error": null };
    }
    catch (ex) {
        return { "_pool": null, "_error": ex.message };
    }
}

function merColumnData(column, data) {
    if (column && data && column.length > 0 && data.length > 0) {
        let obj = {}, __rows = [];
        for (var k in data) {
            for (var i in column) {
                obj[column[i].name] = data[k][i];
            }
            __rows.push(obj);
            obj = {};
        }
        column = data = null;
        return __rows;
    }
    else return [];
}


function fetchRowsFromRS(connection, resultSet, numRows, arr) {
    return new Promise((resolve, reject) => {
        function helper(connection, resultSet, numRows, arr) {
            resultSet.getRows(numRows, function (err, rows) {
                if (err) {
                    doClose(connection, resultSet).then(function () {
                        reject({ "ERROR": "FEATCH_DATA", "MESSAGE": err.message });
                    }).catch(function (rError) {
                        reject({ "ERROR": "FEATCH_DATA_DO_CLOSE_AND_RELEASE", "MESSAGE": { "FETCH_DATA": err.message, "DO_CLOSE_AND_RELEASE": rError.message } });
                    });
                } else if (rows.length > 0) {
                    if (arr.length === 0) arr = merColumnData(resultSet.metaData, rows);
                    else arr = arr.concat(merColumnData(resultSet.metaData, rows));
                    if (rows.length === numRows)
                        helper(connection, resultSet, numRows, arr);
                    else {
                        doClose(connection, resultSet).then(function () {
                            resolve(arr);
                        }).catch(function (rError) {
                            reject({ "ERROR": "DO_CLOSE_AND_RELEASE", "MESSAGE": rError.message });
                        });
                    }
                } else {
                    doClose(connection, resultSet).then(function () {
                        resolve(arr);
                    }).catch(function (rError) {
                        reject({ "ERROR": "DO_CLOSE_AND_RELEASE", "MESSAGE": rError.message });
                    });
                }
            });
        }
        helper(connection, resultSet, numRows, arr);
    });
}

function doClose(connection, resultSet) {
    return new Promise((resolve, reject) => {
        resultSet.close(function (err) {
            doRelease(connection).then(function () {
                if (err) {
                    reject({ "ERROR": "DO_CLOSE_ERROR", "MESSAGE": err.message });
                }
                else resolve(true);
            }).catch(function (dErr) {
                if (err) {
                    reject({ "ERROR": "DO_CLOSE_ERROR", "MESSAGE": err.message });
                }
                reject({ "ERROR": "DO_CLOSE_ERROR_AND_DO_RELEASE_ERROR", "MESSAGE": { "DO_CLOSE_ERROR": err.message, "DO_RELEASE_ERROR": dErr.message } });
            });
        });
    });
}

function doRelease(connection) {
    return new Promise((resolve, reject) => {
        connection.close(function (err) {
            if (err) {
                reject({ "ERROR": "ERROR_WHILE_DO_RELEAER", "MESSAGE": err.message });
            }
            else resolve(true);
        });
    });
}

module.exports = (_schema, _payLoad, _cParams) => {
    return new Promise(async (resolve, reject) => {
        const bindParams = params(oracledb, _schema, _payLoad);
        if (bindParams && bindParams.ERROR) {
            reject(bindParams)
        }
        else {
            if (!pool) {
                const { _pool, _error } = await createPool();
                if (_error) reject({ "ERROR": "ERROR_WHILE_CREATE_POOL", "MESSAGE": _error });
                else pool = _pool;
            }
            pool.getConnection((err, connection) => {
                if (err) {
                    reject({ "ERROR": "ERROR_WHILE_CONNECTING", "MESSAGE": err.message });
                }
                else {
                    connection.execute(bindParams.PROC, bindParams.PARAMS, function (err, result) {
                        if (err) {
                            doRelease(connection).then(function (success) {
                                reject({ "ERROR": "PROC_EXEC_ERROR", "MESSAGE": err.message });
                            }).catch(function (error) {
                                reject({ "ERROR": "PROC_EXEC_ERROR_AND_RELEASE_ERROR", "MESSAGE": { "RELEASE_ERROR": error.message, "PROC_EXEC_ERROR": err.message } });
                            });
                        }
                        else {
                            if (result && result.outBinds && result.outBinds[bindParams.OUTPUT]) {
                                fetchRowsFromRS(connection, result.outBinds[bindParams.OUTPUT], 100, []).then(function (_res) {
                                    resolve(_res);
                                }).catch(function (_err) {
                                    reject({ "ERROR": "FEATCH_DATA", "MESSAGE": _err.message });
                                });
                            }
                            else {
                                doRelease(connection).then(function (success) {
                                    resolve(merColumnData(result.metaData, result.rows));
                                }).catch(function (error) {
                                    reject({ "ERROR": "RELEASE_ERROR", "MESSAGE": error.message });
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
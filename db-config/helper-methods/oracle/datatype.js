'use strict';
module.exports = (oracle, dataType) => {
    try {
        if (!dataType) dataType = "STRING";
        if (dataType == "BLOB") dataType =  oracle.BLOB;
        else if (dataType == "BUFFER") dataType =  oracle.BUFFER;
        else if (dataType == "CLOB") dataType =  oracle.CLOB;
        else if (dataType == "CURSOR") dataType =  oracle.CURSOR;
        else if (dataType == "DATE") dataType =  oracle.DATE;
        else if (dataType == "DEFAULT") dataType =  oracle.DEFAULT;
        else if (dataType == "NUMBER") dataType =  oracle.NUMBER;
        else if (dataType == "STRING") dataType =  oracle.STRING;
        else return { "ERROR": "ERROR_WHILE_PREPARE_DATA_TYPE", "MESSAGE": `No datatype found with give type ${dataType}` };
        oracle = null;
        return dataType;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_DATA_TYPE", "MESSAGE": ex.message };
    }
}
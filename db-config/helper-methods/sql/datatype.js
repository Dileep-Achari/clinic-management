'use strict';
module.exports = (sql, dataType) => {
    try {
        if (dataType) dataType = dataType.trim();
        if (dataType === "BIT") dataType = sql.Bit;
        else if (dataType === "TINYINT") dataType = sql.TinyInt;
        else if (dataType === "SMALLINT") dataType = sql.SmallInt;
        else if (dataType === "INT") dataType = sql.Int;
        else if (dataType === "BIGINT") dataType = sql.BigInt;
        else if (dataType === "CHAR") dataType = sql.Char;
        else if (dataType === "VARCHAR") dataType = sql.VarChar;
        else if (dataType === "VARCHAR_MAX") dataType = sql.VarChar(sql.MAX);
        else if (dataType === "N_VARCHAR") dataType = sql.NVarChar(sql.MAX);
        else if (dataType === "N_VARCHAR_MAX") dataType = sql.NVarChar(sql.MAX);
        else if (dataType === "TEXT") dataType = sql.Text;
        else if (dataType === "NTEXT") dataType = sql.NText;
        else if (dataType === "BINARY") dataType = sql.Binary;
        else if (dataType === "VARBINARY") dataType = sql.VarBinary;
        else if (dataType === "IMAGE") dataType = sql.Image;
        else if (dataType === "DECIMAL") dataType = sql.Decimal;
        else if (dataType === "NUMERIC") dataType = sql.Numeric;
        else if (dataType === "SMALLMONEY") dataType = sql.SmallMoney;
        else if (dataType === "MONEY") dataType = sql.Money;
        else if (dataType === "FLOAT") dataType = sql.Float;
        else if (dataType === "REAL") dataType = sql.Real;
        else if (dataType === "XML") dataType = sql.XML;
        else if (dataType === "TIME") dataType = sql.Time;
        else if (dataType === "DATE") dataType = sql.Date;
        else if (dataType === "DATE_TIME") dataType = sql.DateTime;
        else if (dataType === "DATE_TIME_2") dataType = sql.DateTime2;
        else if (dataType === "SMALLDATETIME") dataType = sql.SmallDateTime;
        else if (dataType === "UNIQUEIDENTIFIER") dataType = sql.UniqueIdentifier;
        else return { "ERROR": "ERROR_WHILE_PREPARE_DATA_TYPE", "MESSAGE": `No datatype found with give type ${dataType}` };
        sql = null;
        return dataType;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_DATA_TYPE", "MESSAGE": ex.message };
    }
}
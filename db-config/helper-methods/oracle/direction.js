'use strict';
module.exports = (oracle, direction) => {
    try {
        if (!direction) direction = "IN";
        if (direction == "IN") direction =  oracle.BIND_IN;
        else if (direction == "OUT") direction =  oracle.BIND_OUT;
        else if (direction == "IN_OUT") direction =  oracle.BIND_INOUT;
        else return { "ERROR": "ERROR_WHILE_PREPARE_DIRECTION", "MESSAGE": `No direction found with give value ${direction}` };
        oracle = null;
        return direction;
    }
    catch (ex) {
        return { "ERROR": "ERROR_WHILE_PREPARE_DIRECTION", "MESSAGE": ex.message };
    }
}
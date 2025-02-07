const fs = require("fs");
const mkdirp = require("mkdirp");


function creteDirIfNotExist(path) {
    try {
        mkdirp.sync(path);
        return true;
    }
    catch (ex) {
        console.log("error:service/fs.js:" + ex.message)
        return false;
    }
}



module.exports = {
    creteDirIfNotExist
}
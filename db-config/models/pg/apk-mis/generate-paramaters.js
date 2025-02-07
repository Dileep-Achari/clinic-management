function convertKeysToLower(arr) {
    let newArr = [], key, n, keys = "";
    for (let i in arr) {
        keys = Object.keys(arr[i]);
        n = keys.length;
        var newobj = {}, j = 0;
        while (j < n) {
            key = keys[j];
            j++;
            newobj[key.toLowerCase()] = arr[i][key]
        }
        newArr.push(newobj)
    }
    return newArr
}


module.exports = {
    auth: (body, cParams) => {
        return {
            USER_NAME: body.USER_NAME,
            PASSWORD: body.PASSWORD,
            USER_LOG_INFO: JSON.stringify([{
                "imei1": body.IMEI_1 || "",
                "imei2": body.IMEI_2 || "",
                "geo_lati": body.GEO_LATI || "",
                "geo_lang": body.GEO_LANGI || "",
            }])
        }
    },
    putMasterData: (body, cParams) => {
        body.FLAG = (body.RENDER_BY === "COST_CENTER") ? "COS" : "LOC";
        return body;
    },
    getMasterData: (body, cParams) => {
        body.FLAG = (body.RENDER_BY === "COST_CENTER") ? "COS" : "LOC";
        return body;
    },
    insUpdMasterData: (body, cParams) => {
        if (body.DATA && Array.isArray(body.DATA) && body.DATA.length > 0) {
            body.DATA = convertKeysToLower(body.DATA);
        }
        return body;
    }
}
function convertKeysToUpper(arr) {
    let newArr = [], key, n, keys = "";
    for (let i in arr) {
        keys = Object.keys(arr[i]);
        n = keys.length;
        var newobj = {}, j = 0;
        while (j < n) {
            key = keys[j];
            j++;
            newobj[key.toUpperCase()] = arr[i][key]
        }
        newArr.push(newobj)
    }
    return newArr
}

module.exports = {
    getDocuments: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    getOrgLocCos: (data, params) => {
        if (data && Array.isArray(data)) {
            if (data.length > 0) {
                data = data[0];
                if (data.var_organization_location_cost && data.var_organization_location_cost.organization_location_cost) {
                    data = convertKeysToUpper(data.var_organization_location_cost.organization_location_cost);
                }
            }
        }
        return data;
    },
    auth: (data, params) => {
        if (data && Array.isArray(data)) {
            if (data.length > 0 && data[0].status === 1) {
                data = data[0];
                if (data.msg && data.msg.users_role_det) {
                    data = data.msg.users_role_det[0];
                }
            }
            else data = convertKeysToUpper(data);
        }
        return data;
    },
    getOrgLocCosById: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    getMasterData: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    putMasterData: (data, params) => {
        return true;
    }
}
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
    getHosts: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    putMaster: (data, params) => {
        if (data && data === "1") {
            data = true;
        }
        return data;
    },
    getMaster: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    getOrgLocDataByLocId: (data, params) => {
        if (data && Array.isArray(data)) {
            data = data[0];
            if (data.msg && data.msg.organization_location) {
                data = convertKeysToUpper(data.msg.organization_location)[0];
            }
        }
        return data;
    },
    putMastTran: (data, params) => {
        return true;
    },
    getMastTran: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    },
    getUserInfo: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data)[0];
        }
        return data;
    },
    loginUsersGrid: (data, params) => {
        if (data && Array.isArray(data)) {
            data = convertKeysToUpper(data);
        }
        return data;
    }
}
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
    insUpdOrganization: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.evts_in_organization = JSON.stringify([params]);
        return params;
    },
    insUpdLocation: (params, cParams) => {
        if (params && Object.keys(params) && Object.keys(params).length > 0) {
            for (let val in params) {
                if (!params[val]) params[val] = null;
            }
        }
        else params = {};
        params.evts_in_location = JSON.stringify([params]);
        return params;
    }
}
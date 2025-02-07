module.exports = {
    UprGetSystemVitals: (response, params, [body, _]) => {
        if (response && response.length) {
            response = _.sortBy(response, function (item) { return item.OBSERVATION_ID_NAME && new Date(item.CREATE_DT) }).reverse();
            if (body.UMR_NO && body.ADMN_NO) {
                response = _.groupBy(response, function (item) { return item.ADMN_NO });
                response = _.map(response, function (value, key) {
                    let gDataNa = _.groupBy(value, function (item) { return item.OBSERVATION_ID_NAME });
                    const arr = [];

                    for (let obj in gDataNa) {
                        gDataNa[obj] = _.sortBy(gDataNa[obj], function (item) { return item.CREATE_DT }).reverse();
                        arr.push({
                            OBSERVATION_ID_NAME: gDataNa[obj][0].OBSERVATION_ID_NAME,
                            OBSERVATION_ID: gDataNa[obj][0].OBSERVATION_ID || "",
                            OBSERVATION_UNIT: gDataNa[obj][0].OBSERVATION_UNIT || "",
                            OBSERVATION_VALE: gDataNa[obj][0].OBSERVATION_VALE || "",
                            OBSERVATION_DATE: gDataNa[obj][0].CREATE_DT,
                            TOTAL: gDataNa[obj]
                        });
                    }
                    return {
                        ADMN_NO: key,
                        UMR_NO: value[0].UMR_NO || "",
                        PAT_NAME: value[0].PAT_NAME || "",
                        GENDER: value[0].GENDER || "",
                        AGE: value[0].AGE || "",
                        OBSERVATIONS: arr || []
                    }
                });
            }
        }

        return response;
    }
};
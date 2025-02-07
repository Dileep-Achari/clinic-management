module.exports = {
    getMasterData: (params, isLoadAjax) => {
        params.ID ? params.ID = params.ID : null;
        params.FLAG ? params.FLAG = params.FLAG : null;
        params.TYPE ? params.TYPE = params.TYPE : null;
        return params;
    },
    insUpdMasterDt: (params, isLoadAjax) => {
        params.TYPE ? params.TYPE = params.TYPE : null;
        params.JSON ? params.JSON = params.JSON : null;
        return params;
    },
}
module.exports = {
    UprGetSystemVitals: (body) => {
        body.OBSERVATION_ID ? body.OBJ_I_N = body.OBSERVATION_ID_NAME : null;
        return body;
    }
};
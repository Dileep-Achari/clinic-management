const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const xml2js = require('xml2js');
const { promisify } = require('util');
const parseStringAsync = promisify(xml2js.parseString);

async function encryptData(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(_data);
        }
        catch (err) {
            resolve(_data)
        }
    })
};
//118
router.post("/insert-hims-events-data", async (req, res) => {
    try {
        if (req.body && req.headers.host) {
            let xmlData = req.body;
            let dbName = req.headers.host;
            try {
                let jsonResult = await parseStringAsync(xmlData, { explicitArray: false });
                if (jsonResult.results && jsonResult.results.result) {
                    const resultArray = Array.isArray(jsonResult.results.result) ? jsonResult.results.result : [jsonResult.results.result];
                    let results = [];
                    for (let result of resultArray) {
                        let dataToInsert = {
                            "migId": result.mig_id,
                            "host": req.headers.host,
                            "eventId": result.event_id,
                            "eventTrackId": result.event_track_id,
                            "data": result
                        };
                        let insertResult = await mongoMapper('cm_mirtheventtrans', "insertMany", dataToInsert, dbName);
                        if (insertResult && insertResult.data) {
                            results.push(`${result.event_track_id}^S`)
                        }
                        else {
                            results.push(`${result.event_track_id}^F`)
                        }
                    }
                    return res.status(200).send(results.join('|'));
                }
                else {
                    return res.status(400).json(await encryptData({ success: false, status: 400, desc: "No valid results found in the xml data", data: [] }));
                }
            } catch (error) {
                return res.status(500).json(await encryptData({ success: false, status: 500, desc: "xml parsing error:" + error.message || error }));
            }
        } else {
            return res.status(400).json(await encryptData({ success: false, status: 400, desc: "Missing Required Parameters ..", data: [] }));
        }
    } catch (error) {
        return res.status(500).json(await encryptData({ success: false, status: 500, desc: error.message || error }));
    }
});

module.exports = router;

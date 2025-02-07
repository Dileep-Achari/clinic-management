const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");


/**
 * Insert logs data from all EMR projects
 * Created Dt : 2024-05-18
 */
router.post("/insert-logging", async (req, res) => {
    try {
        // if (!(req.body)) {
        //     return res.status(400).send({ success: false, status: 400, data: [], desc: "Required parameters are missing.." });
        // }
        mongoMapper('emr_logging', "insertMany", req.body).then((result) => {
            res.sendStatus(204);
        }).catch((error) => {
            res.sendStatus(204);
        });
    }
    catch (error) {
        res.sendStatus(204);
    }
});

module.exports = router;
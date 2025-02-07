const router = require("express").Router();
const _ = require("lodash");
const _dd = require("./const/drugDetails.json");


function filterData(_field) {
    let _resp = {};
    _.each(_dd, (_d, _k) => {
        const filtered = _.filter(_dd[_k], function (o) {
            return o.searchField.toLowerCase().indexOf(_field.toLowerCase()) > -1;
        });
        if (_k == 'drugs' || _k == 'brands') {
            _.each(filtered, (_cd) => {
                let _class = _.filter(_dd["class"], function (o) {
                    return o.suvSubCode == _cd.suvSubCode;
                });
                let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                _cd["class"] = preparedData;
            });
        }
        _resp[_k] = filtered;
    });
    return _resp;
}


router.post("/getAllDrugs", async (req, res) => {
    try {
        if (req.body && req.body.searchField && req.body.searchField.length > 2) {
            let _resp = await filterData(req.body.searchField);
            return res.status(200).json({ success: true, status: 200, desc: '', data: _resp || {} });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Required parameters are missing /  Missing required Characters ..", data: [] });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

module.exports = router;
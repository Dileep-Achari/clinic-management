const router = require("express").Router();
const _ = require("lodash");
const _dd = require("./const/drugDetails.json");


function filterData(_field, _flag) {
    let _resp = {};
    if (!_flag) {
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
    }
    else {
        let _types = [
            { type: "drugs", field: "suvSubExtName", comb: "", groupBy: 'compName' },
            { type: "brands", field: "productName", comb: "productName", groupBy: 'compName' },
            { type: "class", field: "drugClsDesc", comb: "suvSubName", groupBy: 'compName' },
            { type: "comp", field: "compName", comb: "productName", groupBy: 'compName' }];
        let _fType = _.filter(_types, (_t) => { return _t.type == _flag });
        if (_flag === 'comp') {
            _dd[_flag] = _dd.brands;
        }
        const filtered = _.filter(_dd[_flag], function (o) {
            return o[_fType[0].field].toLowerCase().indexOf(_field.toLowerCase()) > -1;
        });
        if (_flag == 'drugs' || _flag == 'brands') {
            _.each(filtered, (_v1, _k1) => {
                let _class = _.filter(_dd["class"], function (o) {
                    return o.suvSubCode == _v1.suvSubCode;
                });
                let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                _v1["class"] = preparedData;
            });
        }
        let _gData = _.chain(filtered).groupBy(_fType[0].field).map((_v, _k) => {
            let _combString = "";
            if (_flag === 'drugs' || _flag === 'brands') {
                _combString = _v[0].class
            }
            else if (_flag === 'comp' || _flag === 'class') {
                _combString = Array.prototype.map.call(_v, function (item) { return item[_fType[0].comb].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
            }
            return {
                field: _v[0][_fType[0].field].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()),
                combString: _combString || "",
                childs: _v
            }
        }).value();
        _resp = _gData;
    }
    return _resp;
}


router.post("/getAllDrugs", async (req, res) => {
    try {
        if (req.body && req.body.searchField && req.body.searchField.length > 2) {
            let _resp = await filterData(req.body.searchField, req.body.flag);
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
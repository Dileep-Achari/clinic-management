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
            /*
              _.each(filtered, (_cd) => {
                  if (_k == 'drugs' || _k == 'brands') {
                      let _class = _.filter(_dd["class"], function (o) {
                          return o.suvSubCode == _cd.suvSubCode;
                      });
                      let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                      if (_k == 'drugs') {
                          _cd['displayName'] = _cd.suvSubName;
                      }
                      else if (_k == 'brands') {
                          _cd['displayName'] = _cd.productName;
                      }
                      _cd["combString"] = preparedData;
                  }
                  else if (_k == 'class') {
                      let _class = _.filter(_dd['drugs'], function (o) {
                          return o.suvSubCode == _cd.suvSubCode;
                      });
                      let preparedData = Array.prototype.map.call(_class, function (item) { return item["suvSubName"].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                      let arr = preparedData.split(',');
                      for (let i in arr) {
                          arr[i] = arr[i].replace(/\s/g, '');
                      };
                      preparedData = arr.filter(function (value, index, self) {
                          return self.indexOf(value) == index;
                      }).join(',');
                      _cd['displayName'] = _cd.drugClsDesc;
                      _cd["combString"] = preparedData;
                  }
                  else if (_k == 'comp') {
                      let preparedData = Array.prototype.map.call(_dd['comp'], function (item) { return item["productName"].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                      let arr = preparedData.split(',');
                      for (let i in arr) {
                          arr[i] = arr[i].replace(/\s/g, '');
                      };
                      preparedData = arr.filter(function (value, index, self) {
                          return self.indexOf(value) == index;
                      }).join(',');
                      _cd['displayName'] = _cd.compName;
                      _cd["combString"] = preparedData;
                  }
              });
              */

            if (_k == 'drugs' || _k == 'brands') {
                _.each(filtered, (_v1, _k1) => {
                    let _class = _.filter(_dd["class"], function (o) {
                        return o.suvSubCode == _v1.suvSubCode;
                    });
                    let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                    _v1["class"] = preparedData;
                });
            }
            let _types = [
                { type: "drugs", field: "suvSubExtName", comb: "", groupBy: 'compName' },
                { type: "brands", field: "productName", comb: "productName", groupBy: 'compName' },
                { type: "class", field: "drugClsDesc", comb: "suvSubName", groupBy: 'compName' },
                { type: "comp", field: "compName", comb: "productName", groupBy: 'compName' }];
            let _fType = _.filter(_types, (_t) => { return _t.type == _k });
            let _gData = _.chain(filtered).groupBy(_fType[0].field).map((_v2, _k2) => {
                let _combString = "";
                if (_k === 'drugs' || _k === 'brands') {
                    _combString = _v2[0].class;
                }
                else if (_k === 'comp' || _k === 'class') {
                    _combString = Array.prototype.map.call(_v2, function (item) { return item[_fType[0].comb].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                }
                _.map(_v2, (_e) => {
                    if (_k == 'drugs') {
                        _e['displayName'] = _e.suvSubExtName;
                        _e['combString'] = _e.class;
                    }
                    else if (_k == 'brands') {
                        _e['displayName'] = _e.productName;
                        _e['combString'] = _e.class;
                    }
                    else if (_k == 'class') {
                        let _class = _.filter(_dd["class"], function (o) {
                            return o.suvSubCode == _e.suvSubCode;
                        });
                        let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                        _e['displayName'] = _e.suvSubName;
                        _e["combString"] = preparedData;
                    }
                    else if (_k == 'comp') {
                        let _class = _.filter(_dd["class"], function (o) {
                            return o.suvSubCode == _e.suvSubCode;
                        });
                        let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                        _e['displayName'] = _e.productName;
                        _e['combString'] = preparedData;
                    }
                });

                //let _dispName = _v2[0][_fType[0].field].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
               let _dispName = _v2[0][_fType[0].field];
                return {
                    field: _dispName,
                    displayName: _dispName,
                    combString: _combString || "",
                    childs: _v2
                }
            }).value();

            _resp[_k] = _gData;
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
                _combString = _v[0].class;
            }
            else if (_flag === 'comp' || _flag === 'class') {
                _combString = Array.prototype.map.call(_v, function (item) { return item[_fType[0].comb].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
            }
            _.map(_v, (_e) => {
                if (_flag == 'drugs') {
                    _e['displayName'] = _e.suvSubExtName;
                    _e['combString'] = _e.class;
                }
                else if (_flag == 'brands') {
                    _e['displayName'] = _e.productName;
                    _e['combString'] = _e.class;
                }
                else if (_flag == 'class') {
                    let _class = _.filter(_dd["class"], function (o) {
                        return o.suvSubCode == _e.suvSubCode;
                    });
                    let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                    let arr = preparedData.split(',');
                    // for (let i in arr) {
                    //     arr[i] = arr[i].replace(/\s/g, '');
                    // };
                    preparedData = arr.filter(function (value, index, self) {
                        return self.indexOf(value) == index;
                    }).join(',');
                    _e['displayName'] = _e.suvSubName;
                    _e["combString"] = preparedData;
                }
                else if (_flag == 'comp') {
                    let _class = _.filter(_dd["class"], function (o) {
                        return o.suvSubCode == _e.suvSubCode;
                    });
                    let preparedData = Array.prototype.map.call(_class, function (item) { return item.drugClsDesc.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()); }).join(", ");
                    let arr = preparedData.split(',');
                    preparedData = arr.filter(function (value, index, self) {
                        return self.indexOf(value) == index;
                    }).join(',');
                    _e['displayName'] = _e.productName;
                    _e['combString'] = preparedData;
                }
            });

            let _dispName = _v[0][_fType[0].field].replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
            return {
                field: _dispName,
                displayName: _dispName,
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
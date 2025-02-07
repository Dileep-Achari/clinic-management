'use strict';

var mongo = require("../../connections/mongo-db");

var _modules = require("../../../constants/mongo-db/schema_modules"); //const _mUtils = require("../../../constants/mongo-db/utils");


var _collections = {};
setTimeout(function () {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _m = _step.value;

      if (_m.schema.constructor.name === 'Schema') {
        _collections[_m] = global.db.emr.model(_m.db, _m.schema);
      } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _m.schema[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _key = _step2.value;

            if (_key["db"].trim() && _key["coll"]) {
              if (!_m.multi) {
                var _alias = "".concat(_key["db"].trim(), "_").concat(_key["coll"].trim());

                _collections[_alias.trim()] = global.db[_key["db"].trim()].model(_key["coll"].trim(), _key["schema"]);
              } else {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = _m.alias[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _mkey = _step3.value;

                    var _alias2 = "".concat(_mkey, "_").concat(_key["db"].trim(), "_").concat(_key["coll"].trim());

                    var _db = "".concat(_key["db"].trim(), "_").concat(_mkey);

                    _collections[_alias2.trim()] = global.db[_db].model(_key["coll"].trim(), _key["schema"]);
                  }
                } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                      _iterator3["return"]();
                    }
                  } finally {
                    if (_didIteratorError3) {
                      throw _iteratorError3;
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}, 1000);

module.exports = function (_method, _action, _params, _key) {
  var _mUtils = require("../../../constants/mongo-db/utils");

  return new Promise(function _callee(resolve, reject) {
    var _payload, _model, _mdl;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(_mUtils.validateMethod(_method));

          case 3:
            _payload = _context.sent;

            if (!_payload.success || !_payload.data.model || !_action) {
              reject({
                status: "FAIL",
                data: [],
                desc: "No Model Found against this ".concat(_method, " / Missing required params")
              });
            } else {
              if (_action === 'find') {
                _payload.data.filter = _params.filter;
                _payload.data.selectors = _params.selectors;
                _payload.data.limit = _params.limit;
              } else if (_action === 'findOne') {
                _payload.data.filter = _params.filter;
                _payload.data.selectors = _params.selectors;
              } else if (_action === 'findById') {
                _payload.data.data = _params._id || _params;
              } else if (_action === 'insertMany') {
                _payload.data.data = _params;
              } else if (_action === 'findOneAndUpdate' || _action === 'updateOne' || _action === 'bulkWrite' || _action === 'replaceOne' || _action === 'findOneAndReplace') {
                _payload.data.data = _params;
              }

              _model = null;

              if (!_key) {
                _model = _collections[_payload.data.model] ? _collections[_payload.data.model] : "";
              } else {
                _mdl = "".concat(_key, "_").concat(_payload.data.model);
                _model = _collections[_mdl] ? _collections[_mdl] : "";
              }

              if (typeof _model == 'undefined' || _model == null || _model == "") {
                reject({
                  status: "FAIL",
                  data: [],
                  desc: "No Model Found against this ".concat(_payload.data.model)
                });
              } else {
                mongo(_model, _action, _payload.data).then(function (result) {
                  resolve({
                    status: 'SUCCESS',
                    desc: '',
                    data: result.data
                  });
                })["catch"](function (error) {
                  reject({
                    status: 'FAIL',
                    data: [],
                    desc: error.desc || error
                  });
                });
              }
            }

            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            reject({
              status: "FAIL",
              data: [],
              desc: _context.t0.message || _context.t0
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  });
};
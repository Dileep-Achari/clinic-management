"use strict";

var router = require("express").Router();

var _ = require('lodash');

var moment = require('moment');

var mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");

var _token = require("../../../services/token");

var _mUtils = require("../../../constants/mongo-db/utils");

var _orgDetails = require("./const/organizations");

var _defaults = require("./const/defaults");

var _queries = ["find", "findById", "findOne", "insertMany", "updateOne", "bulkWrite"];
var _dateTimeFormate = 'DD-MMM-YYYY, HH:mm';
/* Generate Token */

function generateToken(_data) {
  return regeneratorRuntime.async(function generateToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_token.createTokenWithExpire(_data, "9000000ms"));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

;
/**Default Documents insert */

function insertDefaultData(_data, _idx, _output, _dbType, _orgData) {
  var _mResp, _filter, _mResp2, _docs, _params, _mResp1, _final;

  return regeneratorRuntime.async(function insertDefaultData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(_data.length > _idx)) {
            _context2.next = 31;
            break;
          }

          _.each(_data[_idx].data, function (_o) {
            _o.orgId = _orgData._id;
          });

          if (!(_data[_idx].depColl && _data[_idx].depColl.length == 0)) {
            _context2.next = 10;
            break;
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", _data[_idx].data, "", "", "", _dbType));

        case 6:
          _mResp = _context2.sent;

          if (!(_mResp && _mResp.success)) {
            _output.push({
              success: false,
              type: _data[_idx].type,
              desc: _mResp.desc || "",
              data: []
            });
          } else {
            _output.push({
              success: true,
              type: _data[_idx].type,
              desc: "",
              data: _mResp.data || []
            });
          }

          _context2.next = 26;
          break;

        case 10:
          if (!(_data[_idx].type === "ROLES")) {
            _context2.next = 26;
            break;
          }

          _filter = {
            "filter": {
              "orgId": _orgData._id
            },
            "selectors": "-audit -history"
          };
          _context2.next = 14;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_documents", "find", _filter, "", "", "", _dbType));

        case 14:
          _mResp2 = _context2.sent;

          if (_mResp2 && _mResp2.success) {
            _context2.next = 19;
            break;
          }

          _output.push({
            success: false,
            type: _data[_idx].type,
            desc: _mResp2.desc || "",
            data: []
          });

          _context2.next = 26;
          break;

        case 19:
          _docs = [];

          _.each(_mResp2.data, function (_d) {
            _docs.push({
              documentId: _d._id,
              documentName: _d.docmntName,
              docmntUrl: _d.docmntUrl,
              access: {
                read: true,
                write: true,
                "delete": true,
                print: true,
                adendum: true,
                signOff: true,
                rework: false,
                fileUpload: true
              }
            });
          });

          _params = {
            orgId: _orgData._id,
            label: "Practice Admin",
            docmntMap: _docs
          };
          _context2.next = 24;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall(_data[_idx].coll, "insertMany", _params, "", "", "", _dbType));

        case 24:
          _mResp1 = _context2.sent;

          if (!(_mResp1 && _mResp1.success)) {
            _output.push({
              success: false,
              type: _data[_idx].type,
              desc: _mResp1.desc || "",
              data: []
            });
          } else {
            _output.push({
              success: true,
              type: _data[_idx].type,
              desc: "",
              data: _mResp1.data || []
            });
          }

        case 26:
          _idx = _idx + 1;
          _context2.next = 29;
          return regeneratorRuntime.awrap(insertDefaultData(_data, _idx, _output, _dbType, _orgData));

        case 29:
          _context2.next = 32;
          break;

        case 31:
          return _context2.abrupt("return", {
            success: true,
            data: _output
          });

        case 32:
          _final = _.filter(_output, function (_r) {
            return !_r.success;
          });
          return _context2.abrupt("return", {
            "success": _final.length > 0 ? false : true,
            "data": _output
          });

        case 36:
          _context2.prev = 36;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", {
            success: false,
            data: [],
            desc: _context2.t0.message || _context2.t0
          });

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 36]]);
}

;
/* Get Client Urls */

function getClientUrls(_data) {
  var _org;

  return regeneratorRuntime.async(function getClientUrls$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_.filter(_orgDetails, function (o) {
            return o.orgId === _data.orgId;
          }));

        case 2:
          _org = _context3.sent;
          return _context3.abrupt("return", _org && _org.length > 0 ? _org[0] : _org);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

;
/* Common Axios call */

function commonAxiosCall(type, url, params, config) {
  return new Promise(function (resolve, reject) {
    try {
      if (type == "POST") {
        axios.post(url, params).then(function (res) {
          resolve({
            success: true,
            data: res.data || []
          });
        })["catch"](function (err) {
          resolve({
            success: false,
            data: [],
            desc: err
          });
        });
      } else if (type == "GET") {
        axios.get(url).then(function (res) {
          resolve({
            success: true,
            data: res.data || []
          });
        })["catch"](function (err) {
          resolve({
            success: false,
            data: [],
            desc: err
          });
        });
      }
    } catch (ex) {
      resolve({
        success: false,
        data: [],
        desc: ex.message || ex
      });
    }
  });
}

;
/* Get Organization Details */

router.get("/get-org-details", function _callee(req, res) {
  var _filter;

  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          if (!(req.query && req.query.orgKey)) {
            _context4.next = 6;
            break;
          }

          _filter = {
            "filter": {
              "orgKey": req.query.orgKey,
              "recStatus": true
            },
            "selectors": "-history"
          };
          mongoMapper("cm_organization", "find", _filter, req.query.orgKey.toLowerCase()).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context4.next = 7;
          break;

        case 6:
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Missing Required Parameters ..",
            data: []
          }));

        case 7:
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context4.t0.message || _context4.t0
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
/**Auth User */

router.post("/auth-user", function _callee3(req, res) {
  var _filter;

  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;

          if (!(req.body && req.body.params.orgId && req.body.params.orgKey && req.body.params.locId && req.body.params.uName && req.body.params.pwd)) {
            _context6.next = 6;
            break;
          }

          _filter = {
            "filter": {
              "locId": req.body.params.locId,
              "recStatus": true,
              "userName": {
                $eq: req.body.params.uName
              },
              "password": {
                $eq: req.body.params.pwd
              }
            },
            "selectors": "-history"
          };
          mongoMapper("cm_users", "find", _filter, req.body.params.orgKey.toLowerCase()).then(function _callee2(result) {
            var _filter, _mResp, _roleDocs, _docAccess, _docString, _mOrgResp, _user, _tkn;

            return regeneratorRuntime.async(function _callee2$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(result.data && result.data.length === 0)) {
                      _context5.next = 2;
                      break;
                    }

                    return _context5.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: "Invalid credentials / No user found ..",
                      data: []
                    }));

                  case 2:
                    _filter = {
                      "filter": {
                        "orgId": req.body.params.orgId
                      },
                      "selectors": "-audit -history"
                    };
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_roles", "find", _filter, "", "", "", req.body.params.orgKey.toLowerCase()));

                  case 5:
                    _mResp = _context5.sent;

                    if (_mResp && _mResp.success && _mResp.data) {
                      _context5.next = 8;
                      break;
                    }

                    return _context5.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: "User Role does not match with Role mastes..",
                      data: []
                    }));

                  case 8:
                    _roleDocs = _.filter(_mResp.data, function (_d) {
                      return _d._id.toString() == result.data[0].roleId.toString();
                    });

                    if (_roleDocs && _roleDocs.length > 0 && _roleDocs[0].docmntMap) {
                      _context5.next = 11;
                      break;
                    }

                    return _context5.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: "No Documents found..",
                      data: []
                    }));

                  case 11:
                    _docAccess = _.filter(_roleDocs[0].docmntMap, function (o) {
                      return o.access.view || o.access.edit || o.access.print;
                    });
                    _docString = [];

                    _.each(_docAccess, function (_i) {
                      _docString.push(_i.docmntUrl);
                    });

                    _context5.next = 16;
                    return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_organization", "findById", req.body.params.orgId, "", "", "", req.body.params.orgKey.toLowerCase()));

                  case 16:
                    _mOrgResp = _context5.sent;

                    if (_mOrgResp && _mOrgResp.success && _mOrgResp.data) {
                      _context5.next = 19;
                      break;
                    }

                    return _context5.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: "No Organization data found ..",
                      data: []
                    }));

                  case 19:
                    _user = {
                      "orgKey": req.body.params.orgKey,
                      "orgId": req.body.params.orgId,
                      "locId": req.body.params.locId,
                      "dbType": _mOrgResp.data.dbType,
                      "createdDt": new Date(),
                      "userId": result.data[0]._id,
                      "userName": result.data[0].userName,
                      "displayName": result.data[0].displayName,
                      "role": result.data[0].role,
                      docAccess: _docString
                    };
                    _context5.next = 22;
                    return regeneratorRuntime.awrap(generateToken(_user));

                  case 22:
                    _tkn = _context5.sent;
                    _user["documents"] = _docAccess;
                    res.cookie('x-token', _tkn, {
                      maxAge: 9000000,
                      httpOnly: true
                    });
                    _user['x-token'] = _tkn;
                    return _context5.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: _user
                    }));

                  case 27:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              status: 'FAIL',
              desc: error.desc || error,
              data: []
            });
          });
          _context6.next = 7;
          break;

        case 6:
          return _context6.abrupt("return", res.status(400).send({
            status: 'FAIL',
            data: [],
            desc: "Invalid Parameters"
          }));

        case 7:
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).json({
            status: 'FAIL',
            desc: _context6.t0.message || _context6.t0
          }));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
/* Verify Token Function */

router.use(function verifyToken(req, res, next) {
  return regeneratorRuntime.async(function verifyToken$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!(req.url === '/auth-user' || req.headers.exclude)) {
            _context8.next = 4;
            break;
          }

          next();
          _context8.next = 13;
          break;

        case 4:
          if (!(!req.headers || !req.headers["x-token"])) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(400).send({
            success: false,
            status: 400,
            data: [],
            desc: "Missing Token.."
          }));

        case 6:
          _context8.prev = 6;

          _token.verifyToken(req.headers["x-token"]).then(function _callee4(data) {
            return regeneratorRuntime.async(function _callee4$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    req.tokenData = data;
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(getClientUrls(data));

                  case 3:
                    req.clientUrls = _context7.sent;
                    next();

                  case 5:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })["catch"](function (error) {
            if (error.name && error.name == 'TokenExpiredError') {
              return res.status(401).json({
                success: false,
                status: 401,
                data: [],
                desc: "Token was Expired. Please generate new Token."
              });
            }

            return res.status(401).json({
              success: false,
              status: 401,
              data: [],
              desc: "Authentication failed, Invalid token."
            });
          });

          _context8.next = 13;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](6);
          return _context8.abrupt("return", res.status(500).json({
            success: false,
            status: 400,
            desc: _context8.t0.message || _context8.t0,
            data: []
          }));

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[6, 10]]);
});
/* Parameter Validation Midleware function */

router.use(function paramValidation(req, res, next) {
  try {
    // req.tokenData = { "userId": 1234, "userName": "Somesh P" };
    var _query = req.body.query || req.query.query || "";

    if (!_query || _query == "") {
      return res.status(400).json({
        status: 'FAIL',
        desc: "Require Query Paramer..",
        data: []
      });
    }

    var _index = _.findIndex(_queries, function (o) {
      return o.trim() == _query.trim();
    });

    if (_index == -1) {
      return res.status(400).json({
        status: 'FAIL',
        desc: "Provided ".concat(_query, " Query Paramer is not supported.."),
        data: []
      });
    }

    if (_query == 'findById') {
      var _methods = ["body", "query"];
      var _exists = false;

      for (var _i2 = 0, _methods2 = _methods; _i2 < _methods2.length; _i2++) {
        var _idx = _methods2[_i2];
        if (req.method == 'POST') _exists = req[_idx].params && req[_idx].params["_id"] != undefined && req[_idx].params["_id"] != '' ? true : false;else if (req.method == 'GET') _exists = req[_idx] && req[_idx]["_id"] != undefined && req[_idx]["_id"] != '' ? true : false;
        if (_exists) break;
      }

      if (!_exists) {
        return res.status(400).json({
          status: 'FAIL',
          desc: "Invalid Paramers..",
          data: []
        });
      }
    } else if (_query === 'insertMany') {
      req.body.params["audit"] = {
        documentedBy: req.tokenData ? req.tokenData.userName : "EMR Admin",
        documentedById: req.tokenData ? req.tokenData.userId : null
      };
    } else if (_query === 'updateOne') {
      //if (req.body.flag !== 'BW') {
      req.body.params["audit"] = {
        modifiedById: req.tokenData.userId,
        modifiedByBy: req.tokenData.userName,
        modifiedByDt: new Date().toISOString()
      }; // }     

      req["cAudit"] = {
        documentedBy: req.tokenData.userName,
        documentedById: req.tokenData.userId
      };
    }

    next();
  } catch (err) {
    return res.status(500).json({
      status: 'FAIL',
      desc: err.message,
      data: []
    });
  }
});
/** Common Mongo Function */

function commonMonogoCall(_method, _query, _params, _flag, _body, _filter) {
  return regeneratorRuntime.async(function commonMonogoCall$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          return _context9.abrupt("return", new Promise(function (resolve, reject) {
            mongoMapper(_method, _query, _params).then(function (result) {
              if (_flag == 'REVNO') {
                if (result && Object.keys(result.data).length > 0) {
                  if (_query === 'findOne' && _filter && result.data[_filter] && result.data[_filter][0]) {
                    result.data = result.data[_filter][0];
                  }

                  if (_body.params.revNo == result.data.revNo) {
                    _body.params.revNo = parseInt(result.data.revNo) + 1;
                    resolve({
                      success: true,
                      data: _body || []
                    });
                  } else {
                    // let _revHist = result.data.revHist.sort().reverse()[0];
                    resolve({
                      success: false,
                      data: [{
                        "modifiedBy": "somesh" || _revHist.documentedBy,
                        "modifiedDt": "" || _revHist.documentedDt
                      }],
                      desc: "Provided RevNo not matched, someone updated this record, please reload the page .."
                    });
                  }
                } else {
                  resolve({
                    success: false,
                    data: [],
                    desc: "No data found.."
                  });
                }
              } else {
                resolve({
                  success: true,
                  data: result.data || []
                });
              }
            })["catch"](function (error) {
              resolve({
                success: false,
                data: [],
                desc: "Error occured While executing proc, Error:- ".concat(error)
              });
            });
          }));

        case 4:
          _context9.prev = 4;
          _context9.t0 = _context9["catch"](0);
          return _context9.abrupt("return", {
            success: false,
            data: [],
            desc: "Error occured, Error:- ".concat(_context9.t0)
          });

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 4]]);
}

;

function prepareGetPayload(_payload, _inParams) {
  return regeneratorRuntime.async(function prepareGetPayload$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;

          _.each(_inParams, function (_i, _k) {
            if (_k != 'audit' && _i) {
              _payload.filter[_k] = _i;
            }
          });

          return _context10.abrupt("return", {
            success: true,
            data: _payload
          });

        case 5:
          _context10.prev = 5;
          _context10.t0 = _context10["catch"](0);
          return _context10.abrupt("return", {
            success: false,
            data: [],
            desc: _context10.t0.message || _context10.t0
          });

        case 8:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 5]]);
}
/* Get Organization Details */


router.post("/validate-doc-access", function _callee5(req, res) {
  var _access;

  return regeneratorRuntime.async(function _callee5$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;

          if (!(req.body && req.body.orgId && req.body.userId && req.body.routeUrl)) {
            _context11.next = 8;
            break;
          }

          _access = req.tokenData.docAccess.includes(req.body.routeUrl);

          if (_access) {
            _context11.next = 5;
            break;
          }

          return _context11.abrupt("return", res.status(400).json({
            status: 'FAIL',
            desc: '',
            data: [{
              "access": _access
            }]
          }));

        case 5:
          return _context11.abrupt("return", res.status(200).json({
            status: 'SUCCESS',
            desc: '',
            data: [{
              "access": _access
            }]
          }));

        case 8:
          return _context11.abrupt("return", res.status(400).send({
            status: 'FAIL',
            data: [],
            desc: "Invalid Parameters"
          }));

        case 9:
          _context11.next = 14;
          break;

        case 11:
          _context11.prev = 11;
          _context11.t0 = _context11["catch"](0);
          return _context11.abrupt("return", res.status(500).json({
            status: 'FAIL',
            desc: _context11.t0.message || _context11.t0
          }));

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
/* Get Organization Details */

router.post("/errors-logging", function _callee6(req, res) {
  var filePath, insertTime;
  return regeneratorRuntime.async(function _callee6$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;

          if (!req.body) {
            _context12.next = 13;
            break;
          }

          req.body.user = {
            "orgId": req.tokenData.orgId,
            "locId": req.tokenData.locId,
            "userId": req.tokenData.userId,
            "userName": req.tokenData.userName,
            "dtTime": new Date().toISOString()
          };
          filePath = __dirname + "error-log.txt";
          insertTime = new Date().toLocaleString();
          fs.appendFileSync(filePath, "\n-------------------------------------------------------------------------------------------------------");
          fs.appendFileSync(filePath, "\n Insert Time:".concat(insertTime));
          fs.appendFileSync(filePath, "\n Method :".concat(req.body.method));
          fs.appendFileSync(filePath, "\n Payload :".concat(JSON.stringify(req.body.payload)));
          fs.appendFileSync(filePath, "\n Error :".concat(JSON.stringify(req.body.desc)));
          return _context12.abrupt("return", res.status(200).json({
            status: 'SUCCESS',
            desc: '',
            data: []
          }));

        case 13:
          return _context12.abrupt("return", res.status(400).send({
            status: 'FAIL',
            data: [],
            desc: "Invalid Parameters"
          }));

        case 14:
          _context12.next = 19;
          break;

        case 16:
          _context12.prev = 16;
          _context12.t0 = _context12["catch"](0);
          return _context12.abrupt("return", res.status(500).json({
            status: 'FAIL',
            desc: _context12.t0.message || _context12.t0
          }));

        case 19:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
/**Insert OrgLoaction */

router.post("/insert-organization", function _callee8(req, res) {
  return regeneratorRuntime.async(function _callee8$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;

          if (!(req.body && req.body.params && req.body.params.dbType && req.body.params.dbType.length > 0)) {
            _context14.next = 6;
            break;
          }

          req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper("cm_organization", req.body.query, req.body.params, req.body.params.dbType).then(function _callee7(result) {
            var defaultsResp, _roles, _fRole, userData, _mResp;

            return regeneratorRuntime.async(function _callee7$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.next = 2;
                    return regeneratorRuntime.awrap(insertDefaultData(_defaults, 0, [], req.body.params.dbType, result.data[0]));

                  case 2:
                    defaultsResp = _context13.sent;

                    if (defaultsResp.success) {
                      _context13.next = 5;
                      break;
                    }

                    return _context13.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: "Error occurred while insert default documents",
                      data: defaultsResp.data
                    }));

                  case 5:
                    _roles = _.filter(defaultsResp.data, function (_o) {
                      return _o.type == 'ROLES';
                    });
                    _fRole = _.filter(_roles[0].data, function (_o) {
                      return _o.label == 'Practice Admin';
                    });
                    userData = {
                      locId: result.data[0].locations[0]._id,
                      roleId: _fRole[0]._id,
                      role: _fRole[0].label,
                      userName: result.data[0].locations[0].emailID,
                      password: "".concat(result.data[0].orgKey.toLowerCase(), "123"),
                      displayName: "".concat(result.data[0].orgKey, " Admin")
                    };

                    if (result.data[0].locations[0].defLoc) {
                      userData["defaultLocId"] = userData.locId;
                    }

                    _context13.next = 11;
                    return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_users", "insertMany", userData, "", "", "", req.body.params.dbType));

                  case 11:
                    _mResp = _context13.sent;

                    if (_mResp && _mResp.success) {
                      _context13.next = 14;
                      break;
                    }

                    return _context13.abrupt("return", res.status(400).json({
                      success: false,
                      status: 400,
                      desc: _mResp.desc || "",
                      data: _mResp.data || []
                    }));

                  case 14:
                    result.data[0]["userName"] = _mResp.data[0].userName;
                    result.data[0]["password"] = _mResp.data[0].password;
                    return _context13.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 17:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context14.next = 7;
          break;

        case 6:
          return _context14.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Missing Required Parameters ..",
            data: []
          }));

        case 7:
          _context14.next = 12;
          break;

        case 9:
          _context14.prev = 9;
          _context14.t0 = _context14["catch"](0);
          return _context14.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context14.t0.message || _context14.t0
          }));

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
/**Update OrgLoc */

router.post("/update-organization", function _callee10(req, res) {
  var _cBody, pLoadResp, _mResp, _hResp;

  return regeneratorRuntime.async(function _callee10$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context16.next = 26;
            break;
          }

          pLoadResp = {
            payload: {}
          };
          _context16.next = 6;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_organization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 6:
          _mResp = _context16.sent;

          if (_mResp && _mResp.success) {
            _context16.next = 9;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 9:
          _context16.next = 11;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_organization', _mResp.data.params, _cBody.params, req, "cm"));

        case 11:
          _hResp = _context16.sent;

          if (_hResp && _hResp.success) {
            _context16.next = 15;
            break;
          }

          _context16.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context16.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context16.sent;

          if (pLoadResp.success) {
            _context16.next = 22;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_organization', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee9(result) {
            return regeneratorRuntime.async(function _callee9$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    return _context15.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context16.next = 27;
          break;

        case 26:
          return _context16.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context16.next = 32;
          break;

        case 29:
          _context16.prev = 29;
          _context16.t0 = _context16["catch"](0);
          return _context16.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context16.t0.message || _context16.t0
          }));

        case 32:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Role */

router.post("/insert-role", function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          req.body.params.orgId = req.tokenData.orgId;
          mongoMapper('cm_roles', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context17.next = 8;
          break;

        case 5:
          _context17.prev = 5;
          _context17.t0 = _context17["catch"](0);
          return _context17.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context17.t0.message || _context17.t0
          }));

        case 8:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Roles */

router.post("/get-roles", function _callee12(req, res) {
  var _filter, _pGData;

  return regeneratorRuntime.async(function _callee12$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _filter = {
            "filter": {
              "recStatus": {
                $eq: true
              }
            },
            "selectors": "-history"
          };
          _context18.next = 4;
          return regeneratorRuntime.awrap(prepareGetPayload(_filter, req.body.params));

        case 4:
          _pGData = _context18.sent;

          if (_pGData.success) {
            _context18.next = 7;
            break;
          }

          return _context18.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _pGData.desc,
            data: []
          }));

        case 7:
          mongoMapper("cm_roles", "find", _pGData.data, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context18.next = 13;
          break;

        case 10:
          _context18.prev = 10;
          _context18.t0 = _context18["catch"](0);
          return _context18.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context18.t0
          }));

        case 13:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
/**Update Role */

router.post("/update-role", function _callee14(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee14$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context20.next = 26;
            break;
          }

          _context20.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_roles", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context20.sent;

          if (_mResp && _mResp.success) {
            _context20.next = 8;
            break;
          }

          return _context20.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context20.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_roles', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context20.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context20.next = 15;
            break;
          }

          _context20.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context20.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context20.sent;

          if (pLoadResp.success) {
            _context20.next = 22;
            break;
          }

          return _context20.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_roles', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee13(result) {
            return regeneratorRuntime.async(function _callee13$(_context19) {
              while (1) {
                switch (_context19.prev = _context19.next) {
                  case 0:
                    return _context19.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context19.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context20.next = 27;
          break;

        case 26:
          return _context20.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context20.next = 32;
          break;

        case 29:
          _context20.prev = 29;
          _context20.t0 = _context20["catch"](0);
          return _context20.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context20.t0.message || _context20.t0
          }));

        case 32:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Employee */

router.post("/insert-employee", function _callee15(req, res) {
  return regeneratorRuntime.async(function _callee15$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_employee', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context21.next = 8;
          break;

        case 5:
          _context21.prev = 5;
          _context21.t0 = _context21["catch"](0);
          return _context21.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context21.t0.message || _context21.t0
          }));

        case 8:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Employee */

router.post("/get-all-employee", function _callee16(req, res) {
  return regeneratorRuntime.async(function _callee16$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.prev = 0;
          mongoMapper("cm_employee", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context22.next = 7;
          break;

        case 4:
          _context22.prev = 4;
          _context22.t0 = _context22["catch"](0);
          return _context22.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context22.t0
          }));

        case 7:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Employee */

router.post("/update-employee", function _callee18(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee18$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context24.next = 26;
            break;
          }

          _context24.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_employee", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context24.sent;

          if (_mResp && _mResp.success) {
            _context24.next = 8;
            break;
          }

          return _context24.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context24.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_employee', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context24.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context24.next = 15;
            break;
          }

          _context24.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context24.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context24.sent;

          if (pLoadResp.success) {
            _context24.next = 22;
            break;
          }

          return _context24.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_employee', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee17(result) {
            return regeneratorRuntime.async(function _callee17$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    return _context23.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context23.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context24.next = 27;
          break;

        case 26:
          return _context24.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context24.next = 32;
          break;

        case 29:
          _context24.prev = 29;
          _context24.t0 = _context24["catch"](0);
          return _context24.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context24.t0.message || _context24.t0
          }));

        case 32:
        case "end":
          return _context24.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Doctors */

router.post("/insert-doctor", function _callee19(req, res) {
  return regeneratorRuntime.async(function _callee19$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_doctors', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context25.next = 8;
          break;

        case 5:
          _context25.prev = 5;
          _context25.t0 = _context25["catch"](0);
          return _context25.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context25.t0.message || _context25.t0
          }));

        case 8:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Doctors */

router.post("/get-all-doctor", function _callee20(req, res) {
  return regeneratorRuntime.async(function _callee20$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.prev = 0;
          mongoMapper("cm_doctors", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context26.next = 7;
          break;

        case 4:
          _context26.prev = 4;
          _context26.t0 = _context26["catch"](0);
          return _context26.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context26.t0
          }));

        case 7:
        case "end":
          return _context26.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Docter */

router.post("/update-doctor", function _callee22(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee22$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          _context28.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context28.next = 26;
            break;
          }

          _context28.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_doctors", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context28.sent;

          if (_mResp && _mResp.success) {
            _context28.next = 8;
            break;
          }

          return _context28.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context28.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_doctors', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context28.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context28.next = 15;
            break;
          }

          _context28.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context28.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context28.sent;

          if (pLoadResp.success) {
            _context28.next = 22;
            break;
          }

          return _context28.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_doctors', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee21(result) {
            return regeneratorRuntime.async(function _callee21$(_context27) {
              while (1) {
                switch (_context27.prev = _context27.next) {
                  case 0:
                    return _context27.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context27.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context28.next = 27;
          break;

        case 26:
          return _context28.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context28.next = 32;
          break;

        case 29:
          _context28.prev = 29;
          _context28.t0 = _context28["catch"](0);
          return _context28.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context28.t0.message || _context28.t0
          }));

        case 32:
        case "end":
          return _context28.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Document */

router.post("/insert-document", function _callee23(req, res) {
  return regeneratorRuntime.async(function _callee23$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.prev = 0;
          // req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_documents', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context29.next = 7;
          break;

        case 4:
          _context29.prev = 4;
          _context29.t0 = _context29["catch"](0);
          return _context29.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context29.t0.message || _context29.t0
          }));

        case 7:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/* get all Document */

router.post("/get-all-document", function _callee24(req, res) {
  return regeneratorRuntime.async(function _callee24$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          _context30.prev = 0;
          mongoMapper("cm_documents", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context30.next = 7;
          break;

        case 4:
          _context30.prev = 4;
          _context30.t0 = _context30["catch"](0);
          return _context30.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context30.t0
          }));

        case 7:
        case "end":
          return _context30.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Document */

router.post("/update-document", function _callee26(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee26$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context32.next = 26;
            break;
          }

          _context32.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_documents", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context32.sent;

          if (_mResp && _mResp.success) {
            _context32.next = 8;
            break;
          }

          return _context32.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context32.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_documents', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context32.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context32.next = 15;
            break;
          }

          _context32.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context32.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context32.sent;

          if (pLoadResp.success) {
            _context32.next = 22;
            break;
          }

          return _context32.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_documents', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee25(result) {
            return regeneratorRuntime.async(function _callee25$(_context31) {
              while (1) {
                switch (_context31.prev = _context31.next) {
                  case 0:
                    return _context31.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context31.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context32.next = 27;
          break;

        case 26:
          return _context32.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context32.next = 32;
          break;

        case 29:
          _context32.prev = 29;
          _context32.t0 = _context32["catch"](0);
          return _context32.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context32.t0.message || _context32.t0
          }));

        case 32:
        case "end":
          return _context32.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Medication */

router.post("/insert-medication", function _callee27(req, res) {
  return regeneratorRuntime.async(function _callee27$(_context33) {
    while (1) {
      switch (_context33.prev = _context33.next) {
        case 0:
          _context33.prev = 0;
          // req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_medications', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context33.next = 7;
          break;

        case 4:
          _context33.prev = 4;
          _context33.t0 = _context33["catch"](0);
          return _context33.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context33.t0.message || _context33.t0
          }));

        case 7:
        case "end":
          return _context33.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/* get all Medication */

router.post("/get-all-medication", function _callee28(req, res) {
  return regeneratorRuntime.async(function _callee28$(_context34) {
    while (1) {
      switch (_context34.prev = _context34.next) {
        case 0:
          _context34.prev = 0;
          mongoMapper("cm_medications", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context34.next = 7;
          break;

        case 4:
          _context34.prev = 4;
          _context34.t0 = _context34["catch"](0);
          return _context34.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context34.t0
          }));

        case 7:
        case "end":
          return _context34.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Medication */

router.post("/update-medication", function _callee30(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee30$(_context36) {
    while (1) {
      switch (_context36.prev = _context36.next) {
        case 0:
          _context36.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context36.next = 26;
            break;
          }

          _context36.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_medications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context36.sent;

          if (_mResp && _mResp.success) {
            _context36.next = 8;
            break;
          }

          return _context36.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context36.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_medications', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context36.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context36.next = 15;
            break;
          }

          _context36.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context36.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context36.sent;

          if (pLoadResp.success) {
            _context36.next = 22;
            break;
          }

          return _context36.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_medications', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee29(result) {
            return regeneratorRuntime.async(function _callee29$(_context35) {
              while (1) {
                switch (_context35.prev = _context35.next) {
                  case 0:
                    return _context35.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context35.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context36.next = 27;
          break;

        case 26:
          return _context36.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context36.next = 32;
          break;

        case 29:
          _context36.prev = 29;
          _context36.t0 = _context36["catch"](0);
          return _context36.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context36.t0.message || _context36.t0
          }));

        case 32:
        case "end":
          return _context36.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
/**Insert Investigation */

router.post("/insert-investigation", function _callee31(req, res) {
  return regeneratorRuntime.async(function _callee31$(_context37) {
    while (1) {
      switch (_context37.prev = _context37.next) {
        case 0:
          _context37.prev = 0;
          // req.body.params.locations[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_investigations', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context37.next = 7;
          break;

        case 4:
          _context37.prev = 4;
          _context37.t0 = _context37["catch"](0);
          return _context37.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context37.t0.message || _context37.t0
          }));

        case 7:
        case "end":
          return _context37.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/* get all Investigations */

router.post("/get-all-investigation", function _callee32(req, res) {
  return regeneratorRuntime.async(function _callee32$(_context38) {
    while (1) {
      switch (_context38.prev = _context38.next) {
        case 0:
          _context38.prev = 0;
          mongoMapper("cm_investigations", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context38.next = 7;
          break;

        case 4:
          _context38.prev = 4;
          _context38.t0 = _context38["catch"](0);
          return _context38.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context38.t0
          }));

        case 7:
        case "end":
          return _context38.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Investigations */

router.post("/update-investigation", function _callee34(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee34$(_context40) {
    while (1) {
      switch (_context40.prev = _context40.next) {
        case 0:
          _context40.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context40.next = 26;
            break;
          }

          _context40.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_investigations", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context40.sent;

          if (_mResp && _mResp.success) {
            _context40.next = 8;
            break;
          }

          return _context40.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context40.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_investigations', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context40.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context40.next = 15;
            break;
          }

          _context40.next = 23;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.locations) {
            _.each(_cBody.params.locations, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context40.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context40.sent;

          if (pLoadResp.success) {
            _context40.next = 22;
            break;
          }

          return _context40.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 23:
          mongoMapper('cm_investigations', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee33(result) {
            return regeneratorRuntime.async(function _callee33$(_context39) {
              while (1) {
                switch (_context39.prev = _context39.next) {
                  case 0:
                    return _context39.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context39.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context40.next = 27;
          break;

        case 26:
          return _context40.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 27:
          _context40.next = 32;
          break;

        case 29:
          _context40.prev = 29;
          _context40.t0 = _context40["catch"](0);
          return _context40.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context40.t0.message || _context40.t0
          }));

        case 32:
        case "end":
          return _context40.stop();
      }
    }
  }, null, null, [[0, 29]]);
});

function childAuditAppend(req) {
  _.each(req.body.params.labels, function (_labelData) {
    _labelData.audit = req.body.params.audit;
  });

  return req.body.params.labels;
}
/**Insert Speciality */


router.post("/insert-speciality", function _callee35(req, res) {
  return regeneratorRuntime.async(function _callee35$(_context41) {
    while (1) {
      switch (_context41.prev = _context41.next) {
        case 0:
          _context41.prev = 0;
          req.body.params.labels = childAuditAppend(req);
          req.body.params.locId = req.tokenData.userId;
          mongoMapper('cm_speciality', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context41.next = 9;
          break;

        case 6:
          _context41.prev = 6;
          _context41.t0 = _context41["catch"](0);
          return _context41.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context41.t0.message || _context41.t0
          }));

        case 9:
        case "end":
          return _context41.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
/**Update Speciality */

router.post("/update-speciality", function _callee37(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee37$(_context43) {
    while (1) {
      switch (_context43.prev = _context43.next) {
        case 0:
          _context43.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context43.next = 25;
            break;
          }

          _context43.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_speciality", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context43.sent;

          if (_mResp && _mResp.success) {
            _context43.next = 8;
            break;
          }

          return _context43.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context43.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_speciality', _mResp.data.params, _cBody.params, req, "cm"));

        case 10:
          _hResp = _context43.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context43.next = 15;
            break;
          }

          _context43.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labels) {
            _.each(_cBody.params.labels, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context43.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context43.sent;

          if (pLoadResp.success) {
            _context43.next = 22;
            break;
          }

          return _context43.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_speciality', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee36(result) {
            return regeneratorRuntime.async(function _callee36$(_context42) {
              while (1) {
                switch (_context42.prev = _context42.next) {
                  case 0:
                    return _context42.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context42.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context43.next = 26;
          break;

        case 25:
          return _context43.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context43.next = 31;
          break;

        case 28:
          _context43.prev = 28;
          _context43.t0 = _context43["catch"](0);
          return _context43.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context43.t0.message || _context43.t0
          }));

        case 31:
        case "end":
          return _context43.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Specialization */

router.post("/insert-specialization", function _callee38(req, res) {
  return regeneratorRuntime.async(function _callee38$(_context44) {
    while (1) {
      switch (_context44.prev = _context44.next) {
        case 0:
          _context44.prev = 0;
          req.body.params.labels[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_specialization', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context44.next = 8;
          break;

        case 5:
          _context44.prev = 5;
          _context44.t0 = _context44["catch"](0);
          return _context44.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context44.t0.message || _context44.t0
          }));

        case 8:
        case "end":
          return _context44.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Complaint */

router.post("/get-all-specialization", function _callee39(req, res) {
  return regeneratorRuntime.async(function _callee39$(_context45) {
    while (1) {
      switch (_context45.prev = _context45.next) {
        case 0:
          _context45.prev = 0;
          mongoMapper("cm_specialization", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context45.next = 7;
          break;

        case 4:
          _context45.prev = 4;
          _context45.t0 = _context45["catch"](0);
          return _context45.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context45.t0
          }));

        case 7:
        case "end":
          return _context45.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update specialization */

router.post("/update-specialization", function _callee41(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee41$(_context47) {
    while (1) {
      switch (_context47.prev = _context47.next) {
        case 0:
          _context47.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context47.next = 25;
            break;
          }

          _context47.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_specialization", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context47.sent;

          if (_mResp && _mResp.success) {
            _context47.next = 8;
            break;
          }

          return _context47.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context47.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_specialization', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context47.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context47.next = 15;
            break;
          }

          _context47.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labels) {
            _.each(_cBody.params.labels, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context47.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context47.sent;

          if (pLoadResp.success) {
            _context47.next = 22;
            break;
          }

          return _context47.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_specialization', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee40(result) {
            return regeneratorRuntime.async(function _callee40$(_context46) {
              while (1) {
                switch (_context46.prev = _context46.next) {
                  case 0:
                    return _context46.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context46.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context47.next = 26;
          break;

        case 25:
          return _context47.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context47.next = 31;
          break;

        case 28:
          _context47.prev = 28;
          _context47.t0 = _context47["catch"](0);
          return _context47.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context47.t0.message || _context47.t0
          }));

        case 31:
        case "end":
          return _context47.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Complaint */

router.post("/insert-complaint", function _callee42(req, res) {
  return regeneratorRuntime.async(function _callee42$(_context48) {
    while (1) {
      switch (_context48.prev = _context48.next) {
        case 0:
          _context48.prev = 0;
          req.body.params.labels[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_complaints', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context48.next = 8;
          break;

        case 5:
          _context48.prev = 5;
          _context48.t0 = _context48["catch"](0);
          return _context48.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context48.t0.message || _context48.t0
          }));

        case 8:
        case "end":
          return _context48.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Complaint */

router.post("/get-all-complaint", function _callee43(req, res) {
  return regeneratorRuntime.async(function _callee43$(_context49) {
    while (1) {
      switch (_context49.prev = _context49.next) {
        case 0:
          _context49.prev = 0;
          mongoMapper("cm_complaints", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context49.next = 7;
          break;

        case 4:
          _context49.prev = 4;
          _context49.t0 = _context49["catch"](0);
          return _context49.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context49.t0
          }));

        case 7:
        case "end":
          return _context49.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Complaint */

router.post("/update-complaint", function _callee45(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee45$(_context51) {
    while (1) {
      switch (_context51.prev = _context51.next) {
        case 0:
          _context51.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context51.next = 25;
            break;
          }

          _context51.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_complaints", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context51.sent;

          if (_mResp && _mResp.success) {
            _context51.next = 8;
            break;
          }

          return _context51.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context51.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_complaints', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context51.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context51.next = 15;
            break;
          }

          _context51.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labels) {
            _.each(_cBody.params.labels, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context51.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context51.sent;

          if (pLoadResp.success) {
            _context51.next = 22;
            break;
          }

          return _context51.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_complaints', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee44(result) {
            return regeneratorRuntime.async(function _callee44$(_context50) {
              while (1) {
                switch (_context50.prev = _context50.next) {
                  case 0:
                    return _context50.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context50.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context51.next = 26;
          break;

        case 25:
          return _context51.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context51.next = 31;
          break;

        case 28:
          _context51.prev = 28;
          _context51.t0 = _context51["catch"](0);
          return _context51.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context51.t0.message || _context51.t0
          }));

        case 31:
        case "end":
          return _context51.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Notification */

router.post("/insert-notification", function _callee46(req, res) {
  return regeneratorRuntime.async(function _callee46$(_context52) {
    while (1) {
      switch (_context52.prev = _context52.next) {
        case 0:
          _context52.prev = 0;
          req.body.params.labels[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_notifications', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context52.next = 8;
          break;

        case 5:
          _context52.prev = 5;
          _context52.t0 = _context52["catch"](0);
          return _context52.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context52.t0.message || _context52.t0
          }));

        case 8:
        case "end":
          return _context52.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Notification */

router.post("/get-all-notification", function _callee47(req, res) {
  return regeneratorRuntime.async(function _callee47$(_context53) {
    while (1) {
      switch (_context53.prev = _context53.next) {
        case 0:
          _context53.prev = 0;
          mongoMapper("cm_notifications", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context53.next = 7;
          break;

        case 4:
          _context53.prev = 4;
          _context53.t0 = _context53["catch"](0);
          return _context53.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context53.t0
          }));

        case 7:
        case "end":
          return _context53.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Notification */

router.post("/update-notification", function _callee49(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee49$(_context55) {
    while (1) {
      switch (_context55.prev = _context55.next) {
        case 0:
          _context55.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context55.next = 25;
            break;
          }

          _context55.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_notifications", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context55.sent;

          if (_mResp && _mResp.success) {
            _context55.next = 8;
            break;
          }

          return _context55.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context55.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_notifications', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context55.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context55.next = 15;
            break;
          }

          _context55.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labels) {
            _.each(_cBody.params.labels, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context55.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context55.sent;

          if (pLoadResp.success) {
            _context55.next = 22;
            break;
          }

          return _context55.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_notifications', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee48(result) {
            return regeneratorRuntime.async(function _callee48$(_context54) {
              while (1) {
                switch (_context54.prev = _context54.next) {
                  case 0:
                    return _context54.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context54.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context55.next = 26;
          break;

        case 25:
          return _context55.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context55.next = 31;
          break;

        case 28:
          _context55.prev = 28;
          _context55.t0 = _context55["catch"](0);
          return _context55.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context55.t0.message || _context55.t0
          }));

        case 31:
        case "end":
          return _context55.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Allergy */

router.post("/insert-allergy", function _callee50(req, res) {
  return regeneratorRuntime.async(function _callee50$(_context56) {
    while (1) {
      switch (_context56.prev = _context56.next) {
        case 0:
          _context56.prev = 0;
          req.body.params.labels[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_allergies', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context56.next = 8;
          break;

        case 5:
          _context56.prev = 5;
          _context56.t0 = _context56["catch"](0);
          return _context56.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context56.t0.message || _context56.t0
          }));

        case 8:
        case "end":
          return _context56.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Allergy */

router.post("/get-all-allergy", function _callee51(req, res) {
  return regeneratorRuntime.async(function _callee51$(_context57) {
    while (1) {
      switch (_context57.prev = _context57.next) {
        case 0:
          _context57.prev = 0;
          mongoMapper("cm_allergies", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context57.next = 7;
          break;

        case 4:
          _context57.prev = 4;
          _context57.t0 = _context57["catch"](0);
          return _context57.abrupt("return", res.status(500).json({
            success: false,
            status: 400,
            desc: _context57.t0
          }));

        case 7:
        case "end":
          return _context57.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Allergy */

router.post("/update-allergy", function _callee53(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee53$(_context59) {
    while (1) {
      switch (_context59.prev = _context59.next) {
        case 0:
          _context59.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context59.next = 25;
            break;
          }

          _context59.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_allergies", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context59.sent;

          if (_mResp && _mResp.success) {
            _context59.next = 8;
            break;
          }

          return _context59.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context59.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_allergies', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context59.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context59.next = 15;
            break;
          }

          _context59.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labels) {
            _.each(_cBody.params.labels, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context59.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context59.sent;

          if (pLoadResp.success) {
            _context59.next = 22;
            break;
          }

          return _context59.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_allergies', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee52(result) {
            return regeneratorRuntime.async(function _callee52$(_context58) {
              while (1) {
                switch (_context58.prev = _context58.next) {
                  case 0:
                    return _context58.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context58.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context59.next = 26;
          break;

        case 25:
          return _context59.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context59.next = 31;
          break;

        case 28:
          _context59.prev = 28;
          _context59.t0 = _context59["catch"](0);
          return _context59.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context59.t0.message || _context59.t0
          }));

        case 31:
        case "end":
          return _context59.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert labels */

router.post("/insert-label", function _callee54(req, res) {
  return regeneratorRuntime.async(function _callee54$(_context60) {
    while (1) {
      switch (_context60.prev = _context60.next) {
        case 0:
          _context60.prev = 0;
          req.body.params.labelData[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_labels', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context60.next = 8;
          break;

        case 5:
          _context60.prev = 5;
          _context60.t0 = _context60["catch"](0);
          return _context60.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context60.t0.message || _context60.t0
          }));

        case 8:
        case "end":
          return _context60.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all labels */

router.post("/get-all-label", function _callee55(req, res) {
  return regeneratorRuntime.async(function _callee55$(_context61) {
    while (1) {
      switch (_context61.prev = _context61.next) {
        case 0:
          _context61.prev = 0;
          mongoMapper("cm_labels", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context61.next = 7;
          break;

        case 4:
          _context61.prev = 4;
          _context61.t0 = _context61["catch"](0);
          return _context61.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context61.t0
          }));

        case 7:
        case "end":
          return _context61.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update labels */

router.post("/update-label", function _callee57(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee57$(_context63) {
    while (1) {
      switch (_context63.prev = _context63.next) {
        case 0:
          _context63.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context63.next = 25;
            break;
          }

          _context63.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_labels", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context63.sent;

          if (_mResp && _mResp.success) {
            _context63.next = 8;
            break;
          }

          return _context63.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context63.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_labels', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context63.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context63.next = 15;
            break;
          }

          _context63.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.labelData) {
            _.each(_cBody.params.labelData, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context63.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context63.sent;

          if (pLoadResp.success) {
            _context63.next = 22;
            break;
          }

          return _context63.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_labels', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee56(result) {
            return regeneratorRuntime.async(function _callee56$(_context62) {
              while (1) {
                switch (_context62.prev = _context62.next) {
                  case 0:
                    return _context62.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context62.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context63.next = 26;
          break;

        case 25:
          return _context63.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context63.next = 31;
          break;

        case 28:
          _context63.prev = 28;
          _context63.t0 = _context63["catch"](0);
          return _context63.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context63.t0.message || _context63.t0
          }));

        case 31:
        case "end":
          return _context63.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Entity */

router.post("/insert-entity", function _callee58(req, res) {
  return regeneratorRuntime.async(function _callee58$(_context64) {
    while (1) {
      switch (_context64.prev = _context64.next) {
        case 0:
          _context64.prev = 0;
          req.body.params.child[0]["audit"] = req.body.params.audit;
          mongoMapper('cm_entity', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context64.next = 8;
          break;

        case 5:
          _context64.prev = 5;
          _context64.t0 = _context64["catch"](0);
          return _context64.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context64.t0.message || _context64.t0
          }));

        case 8:
        case "end":
          return _context64.stop();
      }
    }
  }, null, null, [[0, 5]]);
});
/* get all Entity */

router.post("/get-all-entity", function _callee59(req, res) {
  return regeneratorRuntime.async(function _callee59$(_context65) {
    while (1) {
      switch (_context65.prev = _context65.next) {
        case 0:
          _context65.prev = 0;
          mongoMapper("cm_entity", req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context65.next = 7;
          break;

        case 4:
          _context65.prev = 4;
          _context65.t0 = _context65["catch"](0);
          return _context65.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context65.t0
          }));

        case 7:
        case "end":
          return _context65.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/**Update Entity */

router.post("/update-entity", function _callee61(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee61$(_context67) {
    while (1) {
      switch (_context67.prev = _context67.next) {
        case 0:
          _context67.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context67.next = 25;
            break;
          }

          _context67.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_entity", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context67.sent;

          if (_mResp && _mResp.success) {
            _context67.next = 8;
            break;
          }

          return _context67.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context67.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_entity', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context67.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context67.next = 15;
            break;
          }

          _context67.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;

          if (_cBody.params.child) {
            _.each(_cBody.params.child, function (_l) {
              if (_l._id) {
                _l.audit = JSON.parse(JSON.stringify(_cBody.params.audit));
                _l["history"] = {
                  "revNo": _hResp.data[0].revNo,
                  "revTranId": _hResp.data[0]._id
                };
              } else {
                _l.audit = JSON.parse(JSON.stringify(req.cAudit));
              }
            });
          }

          _context67.next = 19;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 19:
          pLoadResp = _context67.sent;

          if (pLoadResp.success) {
            _context67.next = 22;
            break;
          }

          return _context67.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 22:
          mongoMapper('cm_entity', 'bulkWrite', pLoadResp.payload, req.tokenData.dbType).then(function _callee60(result) {
            return regeneratorRuntime.async(function _callee60$(_context66) {
              while (1) {
                switch (_context66.prev = _context66.next) {
                  case 0:
                    return _context66.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context66.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context67.next = 26;
          break;

        case 25:
          return _context67.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context67.next = 31;
          break;

        case 28:
          _context67.prev = 28;
          _context67.t0 = _context67["catch"](0);
          return _context67.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context67.t0.message || _context67.t0
          }));

        case 31:
        case "end":
          return _context67.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
/**Insert Counter */

router.post("/insert-counter", function _callee62(req, res) {
  return regeneratorRuntime.async(function _callee62$(_context68) {
    while (1) {
      switch (_context68.prev = _context68.next) {
        case 0:
          _context68.prev = 0;
          req.body.params.locId = req.tokenData.locId;
          req.body.params.locName = req.tokenData.locName;
          mongoMapper('cm_counters', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context68.next = 9;
          break;

        case 6:
          _context68.prev = 6;
          _context68.t0 = _context68["catch"](0);
          return _context68.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context68.t0.message || _context68.t0
          }));

        case 9:
        case "end":
          return _context68.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
/**Insert Patient */

router.post("/insert-patient", function _callee63(req, res) {
  var _seqResp;

  return regeneratorRuntime.async(function _callee63$(_context69) {
    while (1) {
      switch (_context69.prev = _context69.next) {
        case 0:
          _context69.prev = 0;
          _context69.next = 3;
          return regeneratorRuntime.awrap(_mUtils.getSequenceNextValue({
            locId: req.tokenData.locId,
            seqName: 'UMR'
          }, req.tokenData.dbType));

        case 3:
          _seqResp = _context69.sent;

          if (_seqResp && _seqResp.success) {
            _context69.next = 6;
            break;
          }

          return _context69.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _seqResp.desc || "",
            data: _seqResp.data || []
          }));

        case 6:
          req.body.params["UMR"] = _seqResp.data;
          mongoMapper('cm_patients', req.body.query, req.body.params, req.tokenData.dbType).then(function (result) {
            return res.status(200).json({
              success: true,
              status: 200,
              desc: '',
              data: result.data
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context69.next = 13;
          break;

        case 10:
          _context69.prev = 10;
          _context69.t0 = _context69["catch"](0);
          return _context69.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context69.t0.message || _context69.t0
          }));

        case 13:
        case "end":
          return _context69.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
/**Update Patient */

router.post("/update-patient", function _callee65(req, res) {
  var _cBody, _mResp, _hResp, pLoadResp;

  return regeneratorRuntime.async(function _callee65$(_context71) {
    while (1) {
      switch (_context71.prev = _context71.next) {
        case 0:
          _context71.prev = 0;
          _cBody = JSON.parse(JSON.stringify(req.body));

          if (!req.body.params._id) {
            _context71.next = 25;
            break;
          }

          _context71.next = 5;
          return regeneratorRuntime.awrap(_mUtils.commonMonogoCall("cm_patients", "findById", req.body.params._id, "REVNO", req.body, "", req.tokenData.dbType));

        case 5:
          _mResp = _context71.sent;

          if (_mResp && _mResp.success) {
            _context71.next = 8;
            break;
          }

          return _context71.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: _mResp.desc || "",
            data: _mResp.data || []
          }));

        case 8:
          _context71.next = 10;
          return regeneratorRuntime.awrap(_mUtils.insertHistoryData('cm_patients', _mResp.data.params, _cBody.params, req));

        case 10:
          _hResp = _context71.sent;
          pLoadResp = {
            payload: {}
          };

          if (_hResp && _hResp.success) {
            _context71.next = 15;
            break;
          }

          _context71.next = 22;
          break;

        case 15:
          _cBody.params.revNo = _mResp.data.params.revNo;
          _context71.next = 18;
          return regeneratorRuntime.awrap(_mUtils.preparePayload(req.body.flag, _cBody));

        case 18:
          pLoadResp = _context71.sent;

          if (pLoadResp.success) {
            _context71.next = 21;
            break;
          }

          return _context71.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: pLoadResp.desc || "",
            data: []
          }));

        case 21:
          pLoadResp.payload.query.$push["history"] = {
            "revNo": _hResp.data[0].revNo,
            "revTranId": _hResp.data[0]._id
          };

        case 22:
          mongoMapper('cm_patients', 'findOneAndUpdate', pLoadResp.payload, req.tokenData.dbType).then(function _callee64(result) {
            return regeneratorRuntime.async(function _callee64$(_context70) {
              while (1) {
                switch (_context70.prev = _context70.next) {
                  case 0:
                    return _context70.abrupt("return", res.status(200).json({
                      success: true,
                      status: 200,
                      desc: '',
                      data: result.data
                    }));

                  case 1:
                  case "end":
                    return _context70.stop();
                }
              }
            });
          })["catch"](function (error) {
            return res.status(400).json({
              success: false,
              status: 400,
              desc: error.desc || error,
              data: []
            });
          });
          _context71.next = 26;
          break;

        case 25:
          return _context71.abrupt("return", res.status(400).json({
            success: false,
            status: 400,
            desc: "Require Parameters ..",
            data: []
          }));

        case 26:
          _context71.next = 31;
          break;

        case 28:
          _context71.prev = 28;
          _context71.t0 = _context71["catch"](0);
          return _context71.abrupt("return", res.status(500).json({
            success: false,
            status: 500,
            desc: _context71.t0.message || _context71.t0
          }));

        case 31:
        case "end":
          return _context71.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
module.exports = router;
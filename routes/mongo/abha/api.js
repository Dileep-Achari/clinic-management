const router = require("express").Router();
const mongoMapper = require("../../../db-config/helper-methods/mongo/mongo-helper");
const _ = require('lodash');
const axios = require("axios");
const moment = require('moment');
const _mUtils = require("../../../constants/mongo-db/utils");

router.post("/insert-abha-data", async (req, res) => {
    try {
        mongoMapper("abha_callbacks", "insertMany", req.body).then((result) => {
            // console.log("result", result);
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            console.log("error", error);
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("ex-error", error);
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

router.post("/getAbhaDetails", async (req, res) => {
    try {
        mongoMapper("abha_callbacks", "find", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

router.post("/insert-abha-apies-data", async (req, res) => {
    try {
        mongoMapper("abha_apies", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

router.post("/get-abha-apies-data", async (req, res) => {
    try {
        console.log("body", req.body)
        let _filter = {
            "filter": { "method": req.body.method, "healthId": req.body.healthId },
            "selectors": {},
            "limit": req.body.limit || 5000
        }
        console.log("_filter", _filter)
        mongoMapper("abha_apies", "find", _filter).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/* Insert OTP */
router.post("/insert-abha-pat-otp", async (req, res) => {
    try {
        mongoMapper("abha_otps", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/*Get OTP Details */
router.post("/get-abha-pat-otp-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "referenceNumber": req.body.referenceNumber },
            "selectors": "-headers"
        }
        mongoMapper("abha_otps", "find", _filter).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});


/*Insert Discover Data */
router.post("/insert-abha-discover-data", async (req, res) => {
    try {
        mongoMapper("abha_discover", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/*Get Discover Data */
router.post("/get-abha-discover-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "patientId": req.body.patientId },
            "selectors": "-headers"
        }
        mongoMapper("abha_discover", "find", _filter).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});


/*Insert Care Contexts Data */
router.post("/insert-abha-care-context-data", async (req, res) => {
    try {
        mongoMapper("abha_care-contexts", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/*Get Care Context Data */
router.post("/get-abha-care-context-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "patientId": req.body.patientId },
            "selectors": "-headers"
        }
        mongoMapper("abha_care-contexts", "find", _filter).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/**get data against umrNo */
router.post("/get-care-context-by-addr", async (req, res) => {
    try {
        if (req.body.params.abhaAddress) {
            let _filter = {
                "filter": {
                    "abhaAddress": req.body.params.abhaAddress,
                    "createdDt": { $gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), $lt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString() }
                },
                "selectors": "-history"
            }
            let _finalData;
            mongoMapper("abha_callbacks", "find", _filter, "").then((result) => {
                if (result.data.length > 0) {
                    _.each(result.data[0], (_obj, _indx) => {
                        _finalData = _obj.body
                    })
                    return res.status(200).json({ success: true, status: 200, desc: '', data: _finalData });
                }
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        } else {
            return res.status(400).json({ success: false, status: 400, desc: "provide valide details", data: [] });
        }

    } catch (error) {

    }
});

/**update abha details */
router.post("/update-abha-details", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params) {
            let _filter = {
                "filter": {
                    "clientRequestId": req.body.params.clientRequestId
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("abha_callbacks", "find", _filter, "", req.body, "", "")
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            let pLoadResp = { payload: {} };

            _cBody.params._id = _mResp.data[0]._id;
            _cBody.params.createdDt = new Date().toISOString()
            pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }

            mongoMapper('abha_callbacks', 'findOneAndUpdate', pLoadResp.payload, "").then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*Insert Discover Data */
router.post("/insert-abha-notify-data", async (req, res) => {
    try {
        mongoMapper("abha_notify", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/*Get Abha notify Data */
router.post("/get-abha-care-notify-data", async (req, res) => {
    try {
        let _filter = {
            "filter": { "consentId": req.body.consentId },
            "selectors": "-headers"
        }
        mongoMapper("abha_notify", "find", _filter).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }
});

/*Insert Consent Requests */
router.post("/insert-consent-request-data", async (req, res) => {
    try {
        mongoMapper("abha_consent_requests", "insertMany", req.body).then((result) => {
            // console.log("result", result);
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            console.log("error", error);
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("ex-error", error);
        return res.status(500).json({ status: 'FAIL', desc: error, data: [] });
    }
});

/*Get Consent Requests */
router.post("/get-consent-request-data", async (req, res) => {
    try {
        mongoMapper("abha_consent_requests", "find", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

/**update abha details */
router.post("/update-consent-request-data", async (req, res) => {
    try {
        let _cBody = JSON.parse(JSON.stringify((req.body)));
        if (req.body.params) {
            let _filter = {
                "filter": {
                    "consentRequest": req.body.params.consentRequest
                }
            }
            if (req.body.params.status == "REVOKED" && req.body.params.consentArtefacts && req.body.params.consentArtefacts.length > 0) {
                _filter.filter = {
                    "consentArtefacts.id": req.body.params.consentArtefacts[0].id
                }
            }
            let _mResp = await _mUtils.commonMonogoCall("abha_consent_requests", "find", _filter, "", req.body, "", "");
            //  console.log("_mResp", _mResp);
            if (!(_mResp && _mResp.success)) {
                return res.status(400).json({ success: false, status: 400, desc: _mResp.desc || "", data: _mResp.data || [] });
            }

            let pLoadResp = { payload: {} };
            // console.log("_cBody", _mResp.data[0].permission);
            _cBody.params._id = _mResp.data[0]._id;
            // _cBody.params.createdDt = new Date().toISOString()
            pLoadResp = await _mUtils.preparePayload(req.body.flag, _cBody);
            if (!pLoadResp.success) {
                return res.status(400).json({ success: false, status: 400, desc: pLoadResp.desc || "", data: [] });
            }
            if (_cBody.params.hiTypes) {
                pLoadResp.payload.query.$set["hiTypes"] = _cBody.params.hiTypes;
                delete pLoadResp.payload.query.$push["hiTypes"];
            }
            if (_cBody.params.grantedHiTypes) {
                pLoadResp.payload.query.$set["grantedHiTypes"] = _cBody.params.grantedHiTypes;
                delete pLoadResp.payload.query.$push["grantedHiTypes"];
            }
            if (_cBody.params.grantedPermission) {
                pLoadResp.payload.query.$set["grantedPermission"] = _cBody.params.grantedPermission;
                delete pLoadResp.payload.query.$push["grantedPermission"];
            }
            mongoMapper('abha_consent_requests', 'findOneAndUpdate', pLoadResp.payload, "").then(async (result) => {
                return res.status(200).json({ success: true, status: 200, desc: '', data: result.data });
            }).catch((error) => {
                return res.status(400).json({ success: false, status: 400, desc: error.desc || error, data: [] });
            });
        }
        else {
            return res.status(400).json({ success: false, status: 400, desc: "Require Parameters ..", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: 500, desc: error.message || error });
    }
});

/*Insert Consent Requests Artifacts Transaction*/
router.post("/insert-consent-artifacts-transaction", async (req, res) => {
    try {
        mongoMapper("abha_artefacts_transactions", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            console.log("error", error);
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("ex-error", error);
        return res.status(500).json({ status: 'FAIL', desc: error, data: [] });
    }
});

/*Get Consent Requests Artifacts Transaction */
router.post("/get-consent-artifacts-transaction", async (req, res) => {
    try {
        mongoMapper("abha_artefacts_transactions", "find", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});


/*Insert Consent Requests Artifacts Transaction*/
router.post("/insert-consent-content-data", async (req, res) => {
    try {
        mongoMapper("abha_consent_content_data", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            console.log("error", error);
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("ex-error", error);
        return res.status(500).json({ status: 'FAIL', desc: error, data: [] });
    }
});

/*Get Consent Requests Artifacts Transaction */
router.post("/get-consent-content-data", async (req, res) => {
    try {
        mongoMapper("abha_consent_content_data", "find", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});



/*Insert Logging Data*/
router.post("/insert-data-logging", async (req, res) => {
    try {
        mongoMapper("abha_logging", "insertMany", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        console.log("ex-error", error);
        return res.status(500).json({ status: 'FAIL', desc: error, data: [] });
    }
});

/*Get Logging Data */
router.post("/get-logging-data", async (req, res) => {
    try {
        mongoMapper("abha_logging", "find", req.body).then((result) => {
            return res.status(200).json({ status: 'SUCCESS', desc: '', data: result.data });
        }).catch((error) => {
            return res.status(400).json({ status: 'FAIL', desc: error.desc || error, data: [] });
        });
    } catch (error) {
        return res.status(500).json({ status: 'FAIL', desc: error });
    }

});

module.exports = router;
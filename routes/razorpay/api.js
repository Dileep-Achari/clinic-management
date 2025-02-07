'use strict';
const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post('/paymentDone', (req, res) => {
    try {
        const done = fs.writeFileSync('../routes/razorpay/json/paymentDone.json', JSON.stringify(req.body || {}));
		//const done = fs.writeFileSync('../paymentDone.json', JSON.stringify(req.body || {}));
        res.json({ "STATUS": 200 });
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

router.get('/readReceipt', (req, res) => {
    try {
        const done = fs.readFileSync('../routes/razorpay/json/paymentDone.json');
        res.json({ "STATUS": 200, "DESC": JSON.parse(done) });
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

router.post('/callbackDone', (req, res) => {
    try {
        const done = fs.writeFileSync('../routes/razorpay/json/callback.json', JSON.stringify(req.body || {}));
		//const done = fs.writeFileSync('../paymentDone.json', JSON.stringify(req.body || {}));
        res.json({ "STATUS": 200 });
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

router.get('/callbackReceipt', (req, res) => {
    try {
        const done = fs.readFileSync('../routes/razorpay/json/callback.json');
        res.json({ "STATUS": 200, "DESC": JSON.parse(done) });
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

router.post('/vcCallback', (req, res) => {
    try {
        if (typeof req.body === 'object') {
            req.body = JSON.stringify(req.body || {}) + ",";
        }
        else req.body = req.body + ",";

        const done = fs.appendFileSync('../routes/razorpay/json/vcLog.txt', req.body);
        res.json({ "STATUS": 200, "DESC": done });
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

router.get('/vcRead', (req, res) => {
    try {
        let done = fs.readFileSync('../routes/razorpay/json/vcLog.txt', 'utf8');
        done = JSON.parse("[" + done.substr(0, done.length - 1) + "]");
        res.json(done);
    }
    catch (ex) {
        res.json({ "STATUS": 400, "DESC": ex.message });
    }
});

module.exports = router;
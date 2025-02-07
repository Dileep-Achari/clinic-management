'use strict';
const express = require("express");
const router = express.Router();
const rdf = require('./rdf');

/** 
 * Is redis is working or not
 * If yes return true else false
 */
router.get('/', (req, res) => {
    return res.json(true);
});


/**
 * @body { }
 * @response { object }
 */
router.get('/list', (req, res) => {
    rdf.list().then((resesponse) => {
        return res.json(resesponse);
    }).catch((err) => {
        return res.json({ "status": null, "error": err.message });
    });
});

/**
 * @body { }
 * @response { object }
 */
router.get('/len', (req, res) => {
    rdf.rangeQue(req.query.key).then((resesponse) => {
        return res.json(resesponse);
    }).catch((err) => {
        return res.json({ "status": null, "error": err.message });
    });
});

/**
 * @body { key: string , data: string, orderBy:string }
 * @response { object }
 */
router.post('/putQue', (req, res) => {
    rdf.putQue(req.body.key, req.body.data).then((response) => {
        return res.json({ "status": response, "error": null });
    }).catch((err) => {
        return res.json({ "status": null, "error": err.message });
    });
});

/**
 * @body { key: string, orderBy:string, limit:number }
 * @response { object }
 */
router.post('/getQue', (req, res) => {
    rdf.getQue(req.body.key).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    });
});

router.post('/increKey', (req, res) => {
    rdf.increKey(req.body.key).then((response) => {
        return res.json({ "count": response, "error": null });
    }).catch((err) => {
        return res.json({ "count": null, "error": err.message });
    })
});

router.post('/getKey', (req, res) => {
    rdf.getkey(req.body.key).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    })
});

router.post('/putKey', (req, res) => {
    if (!req.body.tte) req.body.expire = false;
    req.body.expire = req.body.expire ? true : false;
	console.log("putkey",req.body);
    rdf.putkey(req.body.key, req.body.data, req.body.expire, req.body.tte).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    });
});

router.post('/delKey', (req, res) => {
    rdf.delkey(req.body.key).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    })
});

router.post('/resetKey', (req, res) => {
    rdf.delkey(req.body.key).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    })
});

router.post('/smsCount', (req, res) => {
    rdf.increKey(req.body.key).then((response) => {
        return res.json({ "count": response, "error": null });
    }).catch((err) => {
        return res.json({ "count": null, "error": err.message });
    })
});

router.post('/matchKeys', (req, res) => {
    rdf.matchedkeys(req.body.key).then((response) => {
        return res.json({ "count": response, "error": null });
    }).catch((err) => {
        return res.json({ "count": null, "error": err.message });
    })
});

module.exports = router;
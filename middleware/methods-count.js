const config = require('../app-config');
const axios = require('../services/axios');
const env = process.env.CUSTOM_NODE_ENV || config.NODE_ENV;
const preFix = `${config.HOST}.count.${env.toUpperCase()}.`

/**
 * 
router.post('/putKey', (req, res) => {
    if (!req.body.tte) req.body.expire = false;
    req.body.expire = req.body.expire ? true : false;
    rdf.putkey(req.body.key, req.body.data, req.body.expire, req.body.tte).then((response) => {
        return res.json({ "data": response, "error": null });
    }).catch((err) => {
        return res.json({ "data": null, "error": err.message });
    })
});

*/

module.exports = (app) => {
	/*
    app.get('/delete', (req, res) => {
		const _preFix = `${config.HOST}.${env.toUpperCase()}.`;
        axios.post(config.REDIS_URL + 'matchKeys', { "key": _preFix }).then(async (result) => {
            if (result && result.error) {
                res.json(result.error);
            }
            else {
                if (result.count && Array.isArray(result.count) && result.count.length > 0) {
                    for (let key of result.count) {
                        await axios.post(config.REDIS_URL + 'delKey', { "key": key });
                    }
                    res.send(`All keys are deleted....`);
                }
                else {
                    res.send(`<h1>No more keys to delete....</h1>`);
                }
            }
        }).catch(ex => {
            res.json(ex.message);
        });
    });
	*/

    app.get('/methodsCount', (req, res) => {
        /**
         * return html table with method name count
         * get all keys
         * match key start eith prefix
         * if match get count of that key and push into array
         * apply order by on count key on array
         */
		 
		const _preFix = `${config.HOST}.${env.toUpperCase()}.`;
        axios.post(config.REDIS_URL + 'matchKeys', { "key": preFix }).then(async (result) => {
            if (result && result.error) {
                res.json(result.error);
            }
            else {
                if (result.count && Array.isArray(result.count) && result.count.length > 0) {
                    let count = [];
                    for (let key of result.count) {
                        const value = await axios.post(config.REDIS_URL + 'getkey', { "key": key });
                        if (value && value.data) {
                            count.push({ "name": key, "count": value.data });
                        }
                    }
                    count = count.sort((a, b) => {
                        return b.count - a.count;
                    });

                    let style = `<style>
                    .sh-grid { border-collapse:collapse; font-family: monospace;}
                    .sh-grid th, .sh-grid td { padding:5px; border:1px solid #e0e0e0; vertical-align:top;}
                    .sh-grid th { text-align:left; background:#f3f3f3; padding:8px 5px;}
                    </style>`;
                    let _resp = `${style} <table cellpadding="0" cellspacing="0" border="0" class="sh-grid" width="100%">
                        <thead>
                            <tr>
                                <th style="width:100px;">Id(${count.length})</th>
                                <th>name</th>
                                <th>count</th>
                            </tr>
                        </thead>
                        <tbody>
                        `;
                    for (let obj in count) {
                        _resp += `<tr>
                                <td>${parseInt(obj) + 1}</td>
                                <td>${count[obj].name}</td>
                                <td>${count[obj].count || 0}</td>
                             </tr>`;
                    }
                    _resp += "</tbody></table>";
                    res.send(_resp);
                }
                else {
                    res.send(`<h1>No Records Found!...</h1>`);
                }
            }
        }).catch(ex => {
            res.json(ex.message);
        });
    });
}
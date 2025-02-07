const compression = require("compression");


function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false; // don't compress responses with this request header
    }
    return compression.filter(req, res); // fallback to standard filter function
}

module.exports = (app) => {
    app.use(compression({ filter: shouldCompress }))
};
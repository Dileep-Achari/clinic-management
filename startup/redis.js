const redis = require('../routes/redis/api');

module.exports = (app) => {
    app.use('/redis', redis);
}
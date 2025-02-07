const qiAuth = require('../routes/pg/qi/auth');
const qiApi = require('../routes/pg/qi/api');

module.exports = (app) => {
    app.use('/qi/post', qiApi);
    app.use('/qi/get', qiApi);
    app.use('/qi/auth', qiAuth);
}
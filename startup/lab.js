const himsPdfApi = require('../routes/initial/hims-lab-pdf');
const defApptPdf = require('../routes/initial/appt-pdf');
const razorpayApi = require('../routes/razorpay/api');
const qiApi = require('../routes/pg/qi/api');
const apkPgMis = require('../routes/pg/apk-mis/api');
const apkPgDoctor = require('../routes/pg/apk-doctor/api');

module.exports = (app) => {
    app.use('/auto', defApptPdf);
    app.use('/', himsPdfApi);
    app.use('/rpay/api', razorpayApi);
    app.use('/qi/post', qiApi);
    app.use('/qi/get', qiApi);
    app.use('/apk/pg/mis', apkPgMis);
    app.use('/apk/pg/doctor', apkPgDoctor);
    
    
}
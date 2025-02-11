
// const apptApi = require('../routes/sql/appointments/api');
/*
const apkDoctor = require('../routes/sql/apk/doctor');
const apkKd = require('../routes/sql/apk/kd');
const apkSlg = require('../routes/sql/apk/slg');
const apkAppt = require('../routes/sql/apk/appt');
const apkPatientPortal = require('../routes/sql/apk/patient-portal');
const apkppv9 = require('../routes/sql/apk/patient-portal-v9');
const apiSmsEmail = require('../routes/sms-email/api');
const opSmsEmail = require('../routes/sql/console-applications/op-sms-email');
const fbSmsEmail = require('../routes/sql/console-applications/fb-sms-email');
const pdfAppt = require('../routes/sql/console-applications/pdf');
const suTvApi = require('../routes/sql/su-tv/api');
const ipAnalytics = require('../routes/sql/analytics/ip');
const finance = require('../routes/sql/finance/api');
const kiosk = require('../routes/sql/kiosk/api');
const razorpayApi = require('../routes/razorpay/api');
const covidpatient = require('../routes/sql/apk/covid-patient');
const ydyaCaller = require('../routes/sql/apk/ydya-caller');
const hl7 = require("../routes/sql/hl7/api");
const feedback = require("../routes/sql/feedback/api");
const meeydyaAuth = require("../routes/sql/apk/mee-ydya/api");
const osApi = require("../routes/sql/apk/os-api");
const waApi=require("../routes/whats-app/api");
const pmg =require('../routes/sql/pmg/api');
const tokenApp = require('../routes/token-app/api');
const abdmApp = require("../routes/sql/abdm/api");
const Pharmacy =require('../routes/sql/pharmacy/api');
*/
const patientCare = require('../routes/mongo/patientcare/api');
const _abha = require('../routes/mongo/abha/api');
const cliniManagement = require('../routes/mongo/formBuilder/api');
const rxseed = require("../routes/mongo/rxseed/api");
const monography = require("../routes/mongo/monography/api");
const cm = require("../routes/mongo/cm/api");
const drugDetails = require("../routes/mongo/drugDetails/api");
const monograp_staging = require("../routes/mongo/stating/monography_staging/api")
const monograpy_production = require("../routes/mongo/production/monography_production/api")
const drugDetail_staging = require("../routes/mongo/stating/drugDetails/api")
const drugDetail_production = require("../routes/mongo/production/drugDetails_production/api");
const emr = require("../routes/mongo/emr/api");
const dkcrush = require("../routes/mongo/dkcrush/api");
const ophthamology_ecg = require("../routes/mongo/ophthamologyAndEcg/api");

module.exports = (app) => {
    // app.use('/apt/api', apptApi);
    /*app.use('/apk/doctor', apkDoctor);
    app.use('/apk/kd', apkKd);
    app.use('/apk/slg', apkSlg);
    app.use('/apk/appt', apkAppt);
    app.use('/apk/patientPortal', apkPatientPortal);
    app.use('/patientPortal/api', apkppv9);
    app.use('/smsEmail/api', apiSmsEmail);
    app.use('/smsEmail/op', opSmsEmail);
    app.use('/smsEmail/fb', fbSmsEmail);
    app.use('/pdf/appt', pdfAppt);
    app.use('/sutv/api', suTvApi);
    app.use('/analytics/ip', ipAnalytics);
    app.use('/finance/api', finance);
    app.use('/kiosk/api', kiosk);
    app.use('/rpay/api', razorpayApi);
    app.use('/apk/cp', covidpatient);
    app.use('/apk/ydyaCaller', ydyaCaller);
    app.use('/hl7/api', hl7);
    app.use('/feedback/api', feedback);
    app.use('/meeydya/api', meeydyaAuth);
    app.use('/osApi/api', osApi);
    app.use('/wa/api',waApi);
    app.use('/pmg/api', pmg);
    app.use('/tokenapp/api/', tokenApp);
    app.use('/abdm/api/', abdmApp);
    app.use('/pharmacy/api',Pharmacy);*/
    app.use('/patcare/api', patientCare);
    app.use('/abha/api', _abha);
    app.use('/cliniManagement/api', cliniManagement);
    app.use('/rxseed/api', rxseed);
    app.use('/monography/api', monography);
    app.use('/cm/api', cm);
    app.use('/drugDetail/api', drugDetails);
    app.use('/staging/monography/api', monograp_staging);
    app.use('/staging/drugDetail/api', drugDetail_staging);
    app.use('/production/monography/api', monograpy_production);
    app.use('/production/drugDetail/api', drugDetail_production);
    app.use('/emr/api', emr);
    app.use('/dkcrush/api', dkcrush);
    app.use('/ophtha/api', ophthamology_ecg);
}
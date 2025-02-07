/**
 * USAGE:- process.env.CUSTOM_NODE_ENV = "development";
 * CUSTOM_NODE_ENV
 * Why this is created if we need to point development --> production (or) development --> testing
 * This variable will help us to point current enviroment to selected environment
 * Which options are available to assign that custom environment variable(process.env.CUSTOM_NODE_ENV) for that please verify app-config.js
 */
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


const express = require("express");
const config = require("../config/connection-string")("ports");
const app = express();
const fs = require("fs");

const helmet = require("helmet");
const _filepath = "/var/www/html/doc9/node/api/public/logs/api/log.txt"

const port = config.appt;

app.use(helmet.hidePoweredBy());




/** Middlewares */
require("../middleware/cors")(app);
require("../middleware/compression")(app);
require("../middleware/body-parser")(app, "1020mb");
require("../middleware/morgan")(app, "appt", false);
require("../middleware/url-working")(app);
require("../middleware/methods-count")(app);
require('../middleware/redis-mothods-log')(app);


const dbCall = require("../db-config/connections/pg-db-doc");
const dbSchema = require("../db-config/models/pg/apk-doctor/schema");



function inslogData(params) {
    return new Promise(function (resolve, reject) {
        dbCall(dbSchema.insUpdEmrApps, params).then((response) => {
            //console.log(response.RES_OBJ)
            resolve({ insUpd: true, qerror: null });
        }).catch((error) => {
                console.log(error)
            if (error.ERROR) resolve({ insUpd: null, qerror: error.ERROR });
            else resolve({ insUpd: null, qerror: error.message });
        });
    });
}



app.use(function (req, res, next) {
   
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
      // res.header('Access-Control-Allow-Origin', "https://patientcare.doctor9.com");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")

    next();
});

app.use('/',(req,res,next)=>{
if(!req.url.includes("/smsEmail")){
      /*	let insertTime = new Date().toLocaleString();
        fs.appendFileSync(_filepath, `\n-------------------------------------------------------------------------------------------------------`);
        fs.appendFileSync(_filepath, `\n Request Time:${insertTime}`);
        fs.appendFileSync(_filepath, `\n Method:-${JSON.stringify(req.url)}`);
        console.log("body", req.body);  
        fs.appendFileSync(_filepath, `\n Headers:-${JSON.stringify(req.headers)}`);
       fs.appendFileSync(_filepath, `\n Payload:-${JSON.stringify(req.body)}`);*/
       
       let method_arr = req.url.split('/')
       let _appName = req.originalUrl.split('/')[1];
       method = method_arr[method_arr.length - 1];
       req.headers.method = method_arr[method_arr.length - 1]
      let _params = {
          header_app: JSON.stringify(req.headers),
          body: JSON.stringify(req.body),
          app_name: _appName
      }
    let { insUpd, qerror } = inslogData(_params)
    
  }
	// res.setHeader("Access-Control-Allow-Origin", "*");
	// res.setHeader("Access-Control-Allow-Credentials", "true");
	// res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	// res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, -Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();   
});

/** routes Reference */
require("../startup/appt")(app);
//app.use(express.static('public'));



/** Server start */
app.listen(port, () =>
    console.log(`Application Running At http://localhost:${port}`)
); 
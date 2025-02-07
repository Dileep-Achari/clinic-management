/**
 * USAGE:- process.env.CUSTOM_NODE_ENV = "development";
 * CUSTOM_NODE_ENV
 * Why this is created if we need to point development --> production (or) development --> testing
 * This variable will help us to point current enviroment to selected environment
 * Which options are available to assign that custom environment variable(process.env.CUSTOM_NODE_ENV) for that please verify app-config.js
 */

const express = require("express");
const config = require("../config/connection-string")("ports");
const app = express();
const port = config.lab;
const path = require("path");

// app.use("/", express.static(path.join(__dirname.replace("applications", "" + "public/static"))));

/** Middlewares */
require("../middleware/cors")(app);
require("../middleware/compression")(app);
require("../middleware/body-parser")(app, "50mb");
require("../middleware/morgan")(app, "lab", false);
require("../middleware/url-working")(app);



const dbCall = require("../db-config/connections/pg-db-doc");
const dbSchema = require("../db-config/models/pg/apk-doctor/schema");
const labRptLocData = require("../constants/hims-lab-pdf/locations.js")


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

app.use('/',(req,res,next)=>{
if(!req.url.includes("/smsEmail")){
       let method_arr = req.url.split('/')
       // let _appName = req.originalUrl.split('/')[1];
       let _appName = "";   
       let _additionalParams =""; 
        let _additionalParams1 ="";      
       let _method ="";
       let _host ="";
       if(req.originalUrl.includes('.pdf')){
           _appName ="shorturl";
           _additionalParams = req.originalUrl;
           _splitUrl = req.originalUrl.split('/')[1].trim();
           _additionalParams1 =  req.originalUrl.split('/')[2].trim();
           if(!isNaN(_splitUrl)){
               const _locData = labRptLocData.find(h => (h.RPT_ID == parseInt(_splitUrl)));
               _host = _locData.COMPANYCD || "" ; 
           }
       }
       else if(req.originalUrl.includes('/apk/pg/mis/')){
           _appName ="emis";
           _method = method_arr[method_arr.length - 1];
       }
       else {
         _appName = req.originalUrl.split('/')[1];
         _method = method_arr[method_arr.length - 1];
       }
              
       
      /*console.log("locData", labRptLocData);
       console.log("_appName", _appName);
       console.log("method", _method);
       */
       req.headers.method = _method || "";
       req.headers.host = _host || "";
      let _params = {
          header_app: JSON.stringify(req.headers),
          body: JSON.stringify(req.body),
          app_name: _appName,
          parm1 : _additionalParams || "",
          parm2 : _additionalParams1 || ""
      }
        //console.log("_params", _params);
    let { insUpd, qerror } = inslogData(_params)
    
    
  }
	next();   
});


/** routes Reference */
require("../startup/lab")(app);

/** Server start */
app.listen(port, () =>
    console.log(`Application Running At http://localhost:${port}`)
); 
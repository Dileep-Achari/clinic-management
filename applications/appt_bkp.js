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

const helmet = require("helmet");

const port = config.appt;

app.use(helmet.hidePoweredBy());

app.use('/',(req,res,next)=>{
	// res.setHeader("Access-Control-Allow-Origin", "*");
	// res.setHeader("Access-Control-Allow-Credentials", "true");
	// res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	// res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, -Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();   
});



/** Middlewares */
//require("../middleware/cors")(app);
require("../middleware/compression")(app);
require("../middleware/body-parser")(app, "1020mb");
require("../middleware/morgan")(app, "appt", false);
require("../middleware/url-working")(app);
require("../middleware/methods-count")(app);
require('../middleware/redis-mothods-log')(app);

/** routes Reference */
require("../startup/appt")(app);
//app.use(express.static('public'));



/** Server start */
app.listen(port, () =>
    console.log(`Application Running At http://localhost:${port}`)
); 
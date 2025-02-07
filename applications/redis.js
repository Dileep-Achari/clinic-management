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
const port = config.redis;

/** Middlewares */
require("../middleware/cors")(app);
require("../middleware/compression")(app);
require("../middleware/body-parser")(app, "50mb");
require("../middleware/morgan")(app, "redis", false);
require("../middleware/url-working")(app);

/** routes Reference */
require("../startup/redis")(app);

/** Server start */
app.listen(port, () =>
    console.log(`Application Running At http://localhost:${port}`)
);
const cors = require("cors");
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    const corsOption =
    {
        "origin": "*",
        origin: "https://patientcare.doctor9.com",

        // origin: true,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        "credentials": true
    }
    
    
    app.use(cors(corsOption));
    app.options('*', cors(corsOption));
    app.use(cookieParser());
  app.use(cors()); // set cors here
};

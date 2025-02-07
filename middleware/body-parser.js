/**
 * If you want to set size of the query string pass "size" variable into this module
 * Example:- 50mb, 10mb, 30mb like this
 */

const bodyParser = require("body-parser");

module.exports = (app, size) => {
  if (!size) {
    app.use(bodyParser.urlencoded({ extended: true })); // Use to Convert FormData To req.body
    app.use(bodyParser.json()); // Use to Convert payload To req.body
  }
  else {
    app.use(bodyParser.urlencoded({ limit: size, extended: true })); // Use to Convert FormData To req.body
    app.use(bodyParser.json({ limit: size })); // Use to Convert payload To req.body
  }
};
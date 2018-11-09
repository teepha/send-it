"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _winston = _interopRequireDefault(require("winston"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import router from index.js
var logger = _winston["default"].createLogger({
  transports: [new _winston["default"].transports.Console()]
});

var app = (0, _express["default"])(); // Set port number

var PORT = 3030; // Set up Endpoint

app.get('/', function (req, res) {
  res.send('Welcome to SendIT API!!!');
}); // Mount a middleware function on the path

app.use('/api/v1', _routes["default"]); // Set up the server

app.listen(PORT, function () {
  return logger.info("Listening on port ".concat(PORT));
});
var _default = app;
exports["default"] = _default;
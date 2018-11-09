"use strict";

var _express = _interopRequireDefault(require("express"));

var _logger = _interopRequireDefault(require("logger"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import router from index.js
var app = (0, _express["default"])(); // Set port number

var PORT = 3030; // Set up Endpoint

app.get('/', function (req, res) {
  res.send('Welcome to SendIT API!!!');
}); // Mount a middleware function on the path

app.use('/api/v1', _routes["default"]); // Set up the server

app.listen(PORT, function () {
  return _logger["default"].info("Listening on port ".concat(PORT));
});
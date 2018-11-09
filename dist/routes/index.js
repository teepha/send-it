"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _parcelRoutes = _interopRequireDefault(require("./v1/parcel-routes"));

var _userRoutes = _interopRequireDefault(require("./v1/user-routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import router from user-routes.js & parcel-routes.js
var router = _express["default"].Router(); // Mount a middleware function on the path


router.use('/', _parcelRoutes["default"]);
router.use('/', _userRoutes["default"]);
router.get('/', function (req, res) {
  res.send('Welcome to version1 of SendIT API!!!');
}); // Export router to server.js

var _default = router;
exports["default"] = _default;
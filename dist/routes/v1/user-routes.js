"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _parcelsdb = _interopRequireDefault(require("../../parcelsdb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Set up Endpoint to get all parcel orders by a specific user


router.get('/users/:userId/parcels', function (req, res) {
  var userParcels = _parcelsdb["default"].filter(function (parcel) {
    return parcel.userId === req.params.userId;
  });

  res.send(userParcels);
}); // Export router to index.js

var _default = router;
exports["default"] = _default;
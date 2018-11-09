"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _parcelsdb = _interopRequireDefault(require("../../parcelsdb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_bodyParser["default"].json()); // Set up Endpoint to get all parcel orders

router.get('/parcels', function (req, res) {
  res.send(_parcelsdb["default"]);
}); // Set up Endpoint to get a specific parcel order

router.get('/parcels/:id', function (req, res) {
  var parcelId = parseInt(req.params.id, 10);

  var foundParcel = _parcelsdb["default"].find(function (parcel) {
    return parcel.id === parcelId;
  });

  res.send(foundParcel);
}); // Export router to index.js

var _default = router;
exports["default"] = _default;
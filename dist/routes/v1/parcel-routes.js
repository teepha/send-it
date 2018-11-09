"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _fs = _interopRequireDefault(require("fs"));

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
}); // Set up Endpoint to cancel a specific parcel order

router.put('/parcels/:id/cancel', function (req, res) {
  var cancelParcel = _parcelsdb["default"].find(function (parcel) {
    return parcel.id === parseInt(req.params.id, 10);
  });

  if (cancelParcel.status === 'Delivered') {
    res.send('Parcel Delivered! Cannot cancel parcel order.');
  } else {
    cancelParcel.status = 'Cancelled';

    _fs["default"].writeFile('parcelsdb.json', JSON.stringify(_parcelsdb["default"], null, 2), function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send(cancelParcel);
      }
    });
  }
}); // Set up Endpoint to create a new parcel order

router.post('/parcels', function (req, res) {
  var newParcel = {
    id: _parcelsdb["default"].length + 1,
    userId: req.body.userId,
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    recipientName: req.body.recipientName,
    recipientPhone: req.body.recipientPhone,
    status: 'Ready for Pickup',
    presentLocation: ''
  };

  _parcelsdb["default"].push(newParcel);

  _fs["default"].writeFile('parcelsdb.json', JSON.stringify(_parcelsdb["default"], null, 2), function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send(newParcel);
    }
  });
}); // Export router to index.js

var _default = router;
exports["default"] = _default;
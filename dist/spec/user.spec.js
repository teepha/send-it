"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('User-routes unit test', function () {
  it('Should return parcel orders for a specific user', function (done) {
    (0, _supertest["default"])(_server["default"]).get('/api/v1/users/2/parcels').expect(200).end(function (err, res) {
      expect(res.status).toEqual(200);
      expect(res.body.error).toEqual(undefined);
      expect(Array.isArray(res.body)).toBeTruthy();
      done();
    });
  });
});
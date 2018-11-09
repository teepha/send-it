"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Parcel-routes unit test', function () {
  it('Should return the list of all parcel orders', function (done) {
    (0, _supertest["default"])(_server["default"]).get('/api/v1/parcels').expect(200).end(function (err, res) {
      expect(res.status).toEqual(200);
      expect(res.body.error).toEqual(undefined);
      expect(Array.isArray(res.body)).toBeTruthy();
      done();
    });
  });
  it('Should return a specific parcel order', function (done) {
    (0, _supertest["default"])(_server["default"]).get('/api/v1/parcels/2').expect(200).end(function (err, res) {
      expect(res.status).toEqual(200);
      expect(res.body.error).toEqual(undefined);
      expect(res.body.id).toEqual(2);
      done();
    });
  });
  it('Should cancel a specific parcel order', function (done) {
    (0, _supertest["default"])(_server["default"]).put('/api/v1/parcels/9/cancel').expect('Content-Type', /json/).expect(202).end(function (err, res) {
      expect(res.status).toEqual(202);
      expect(res.body.error).toEqual(undefined);
      expect(res.body.status).toEqual('Cancelled');
      done();
    });
  });
  it('Should create a new parcel order', function (done) {
    (0, _supertest["default"])(_server["default"]).post('/api/v1/parcels').send({
      userId: 4,
      pickupLocation: '42, Abdulmujeeb close, Mende, Lagos',
      destination: '12 complex Street, Victoria Island, Lagos',
      recipientName: 'Aisha',
      recipientPhone: '08123409876',
      status: 'Delivered',
      presentLocation: ' '
    }).expect('Content-Type', /json/).expect(201).end(function (err, res) {
      expect(res.status).toEqual(201);
      expect(res.body.error).toEqual(undefined);
      done();
    });
  });
});
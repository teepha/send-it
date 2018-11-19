import server from 'supertest'; // Allows to test server
import app from '../server';
import parcelsDb from '../parcelsdb';

describe('Parcel-routes unit test', () => {
  describe('GET => Get all Parcel delivery orders', () => {
    it('Should return the list of all parcel orders', (done) => {
      server(app)
        .get('/api/v1/parcels')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(Array.isArray(res.body)).toBeTruthy();
          done();
        });
    });
  });


  describe('GET => Get single Parcel delivery order', () => {
    it('Should return errors if parcel Id is not a number', (done) => {
      server(app)
        .get('/api/v1/parcels/string')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if parcel not found', (done) => {
      server(app)
        .get('/api/v1/parcels/1234')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Parcel not found');
          done();
        });
    });

    it('Should return a specific parcel order', (done) => {
      server(app)
        .get('/api/v1/parcels/2')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.id).toEqual(2);
          done();
        });
    });
  })


  describe('PUT => Cancel a Parcel delivery order', () => {
    let deliveredParcel = parcelsDb[0];
    let cancelledParcel = parcelsDb[1];
    let parcelToCancel = parcelsDb[2];
    beforeAll(done => {
      deliveredParcel.status = "Delivered";
      cancelledParcel.status = "Cancelled";
      parcelToCancel.status = "Ready for Pickup"
      done();
    })

    it('Should return errors if parcel Id is not a number', (done) => {
      server(app)
        .put('/api/v1/parcels/string/cancel')
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if parcel not found', (done) => {
      server(app)
        .put('/api/v1/parcels/1234/cancel')
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Error! Parcel Order Not Found');
          done();
        });
    });

    it('Should return error message if Parcel is already delivered', (done) => {
      server(app)
        .put(`/api/v1/parcels/${deliveredParcel.id}/cancel`)
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Parcel Delivered! Cannot cancel Parcel Order.');
          done();
        });
    });

    it('Should return error message if Parcel is already cancelled', (done) => {
      server(app)
        .put(`/api/v1/parcels/${cancelledParcel.id}/cancel`)
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Cannot Cancel Parcel Order, Order Already Cancelled.');
          done();
        });
    });

    it('Should cancel the Parcel Delivery order if it is "Ready for Pickup"', (done) => {
      server(app)
        .put(`/api/v1/parcels/${parcelToCancel.id}/cancel`)
        .expect('Content-Type', /json/)
        .expect(202)
        .end((err, res) => {
          expect(res.status).toEqual(202);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.status).toEqual('Cancelled');
          done();
        });
    });
  });


  describe('POST => Create a Parcel Delivery order', () => {
    it('Should return error message if userId is not a Number', (done) => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 'string',
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if pickupLocation is missing', (done) => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 4,
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });
    
    it('Should create a new parcel order', (done) => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 2,
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.recipientName).toEqual('Aisha');
          done();
        });
    });    
  });
});

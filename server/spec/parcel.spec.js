import server from 'supertest'; // Allows to test server
import app from '../server';
import { createUser, createUserWithParcel } from './support/helper';

describe('Parcel-routes unit test', () => {
  describe('POST => Create a Parcel Delivery order', () => {
    let testUser;
    beforeAll((done) => {
      createUser('member', (err, userInfo) => {
        testUser = userInfo;
        done();
      });
    });

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
        .set('Authorization', testUser.token)
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
        .set('Authorization', testUser.token)
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
          userId: testUser.id,
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testUser.token)
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.recipient_name).toEqual('Aisha');
          done();
        });
    });
  });

  describe('GET => Get all Parcel delivery orders', () => {
    let memberUser, adminUser;
    beforeAll((done) => {
      createUserWithParcel('admin', (err, userInfo1) => {
        adminUser = userInfo1;
        createUserWithParcel('member', (err, userInfo2) => {
          memberUser = userInfo2;
          done();
        });
      });
    });

    it('Should return error msg if user is not admin', (done) => {
      server(app)
        .get('/api/v1/parcels')
        .set('Authorization', memberUser.token)
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(401);
          expect(res.body.msg).toEqual('Sorry, only admins can access this');
          done();
        });
    });

    it('Should return the list of all parcel orders is user is admin', (done) => {
      server(app)
        .get('/api/v1/parcels')
        .set('Authorization', adminUser.token)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });
  });

  describe('GET => Get single Parcel delivery order', () => {
    let userWithParcel1, userWithParcel2;
    beforeAll((done) => {
      createUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        createUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          done();
        });
      });
    });

    it('Should return errors if parcel Id is not a number', (done) => {
      server(app)
        .get('/api/v1/parcels/string')
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if parcel if for another user', (done) => {
      const user1ParcelId = userWithParcel1.parcels[0].id;
      server(app)
        .get(`/api/v1/parcels/${user1ParcelId}`)
        .set('Authorization', userWithParcel2.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry you can not fetch Parcel for another User!');
          done();
        });
    });

    it('Should return error message if parcel not found', (done) => {
      server(app)
        .get('/api/v1/parcels/1234')
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('This Parcel Delivery Order Does Not Exist');
          done();
        });
    });

    it('Should return a specific parcel order', (done) => {
      const user1ParcelId = userWithParcel1.parcels[0].id;
      server(app)
        .get(`/api/v1/parcels/${user1ParcelId}`)
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.id).toEqual(user1ParcelId);
          done();
        });
    });
  });

  /*
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
    */
});
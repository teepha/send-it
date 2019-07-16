import server from 'supertest'; // Allows to test server
import app from '../server';
import { signUpUser, signUpUserWithParcel, clearDatabase, updateParcelStatus } from './support/helper';

describe('Parcel-routes unit test', () => {
  describe('POST => Create a Parcel Delivery order', () => {
    let testMember, testAdmin;
    beforeEach(done => {
      signUpUser('admin', (err, adminInfo) => {
        testAdmin = adminInfo;
        signUpUser('member', (err, memberInfo) => {
          testMember = memberInfo;
          done();
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return error message if userId is not a Number', done => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 'string',
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testMember.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if pickupLocation is missing', done => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 4,
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testMember.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if admin tries to create a parcel', done => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: testAdmin.id,
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testAdmin.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry, you can\'t perform this operation!');
          done();
        });
    });

    it('Should create a new parcel order', done => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: testMember.id,
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testMember.token)
        .end((err, res) => {
          expect(res.status).toEqual(201);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.recipient_name).toEqual('Aisha');
          done();
        });
    });

    it('Should return error message if user tries to create parcel for another User', done => {
      server(app)
        .post('/api/v1/parcels')
        .send({
          userId: 100000,
          pickupLocation: '42, Awelewa close, Mende, Lagos',
          destination: '12 complex Street, Victoria Island, Lagos',
          recipientName: 'Aisha',
          recipientPhone: '08123409876'
        })
        .set('Authorization', testMember.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry you can not create Parcel Order for another User!');
          done();
        });
    });
  });

  describe('GET => Get all Parcel delivery orders', () => {
    let memberUser, adminUser;
    beforeAll(done => {
      signUpUser('admin', (err, userInfo1) => {
        adminUser = userInfo1;
        signUpUser('member', (err, userInfo2) => {
          memberUser = userInfo2;
          done();
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return error msg if user is not admin', done => {
      server(app)
        .get('/api/v1/parcels')
        .set('Authorization', memberUser.token)
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(401);
          expect(res.body.msg).toEqual('Sorry, only admins can access this!');
          done();
        });
    });

    it('Should return error msg if no parcel delivery orders', done => {
      server(app)
        .get('/api/v1/parcels')
        .set('Authorization', adminUser.token)
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(404);
          expect(res.body.msg).toEqual('No Parcel Delivery Orders');
          done();
        });
    });

    it('Should return the list of all parcel orders is user is admin', done => {
      signUpUserWithParcel('member', (err, userInfo) => {
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
  });


  describe('GET => Get single Parcel delivery order', () => {
    let userWithParcel1, userWithParcel2;
    beforeAll(done => {
      signUpUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        signUpUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          done();
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return errors if parcel Id is not a number', done => {
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

    it('Should return error message if parcel if for another user', done => {
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

    it('Should return error message if parcel not found', done => {
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

    it('Should return a specific parcel order', done => {
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

    it('Should return error message if a User tries to get parcel for another User', done => {
      server(app)
        .get(`/api/v1/parcels/${userWithParcel2.parcels[0].id}`)
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry you can not fetch Parcel for another User!');
          done();
        });
    });
  });


  describe('PUT => Edit a Parcel delivery order details', () => {
    let userWithParcel1, userWithParcel2, adminUser;
    beforeAll(done => {
      signUpUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        signUpUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          signUpUser('admin', (err, adminInfo) => {
            adminUser = adminInfo;
            done();
          });
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return errors if parcel Id is not a number', done => {
      server(app)
        .put('/api/v1/parcels/string')
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if Admin tries to update parcel details', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel1.parcels[0].id}`)
        .set('Authorization', adminUser.token)
        .send({
          pickupLocation: 'new pickup-location',
          destination: 'new destination',
          recipientName: 'New Recipient',
          recipientPhone: '08123456789'
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry, you can not perform this operation!');
          done();
        });
    });

    it('Should return error message if parcel not found', done => {
      server(app)
        .put('/api/v1/parcels/123456789')
        .set('Authorization', userWithParcel1.token)
        .send({
          pickupLocation: 'new pickup-location',
          destination: 'new destination',
          recipientName: 'New Recipient',
          recipientPhone: '08123456789'
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('This Parcel Delivery Order Does Not Exist');
          done();
        });
    });

    it('Should return error message if Parcel is already delivered', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'delivered', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}`)
          .set('Authorization', userWithParcel1.token)
          .send({
            pickupLocation: 'new pickup-location',
            destination: 'new destination',
            recipientName: 'New Recipient',
            recipientPhone: '08123456789'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      })
    });

    it('Should return error message if Parcel is already cancelled', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'cancelled', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}`)
          .set('Authorization', userWithParcel1.token)
          .send({
            pickupLocation: 'new pickup-location',
            destination: 'new destination',
            recipientName: 'New Recipient',
            recipientPhone: '08123456789'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      });
    });

    it('Should cancel the Parcel Delivery order if it is "Ready for Pickup"', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel2.parcels[0].id}`)
        .set('Authorization', userWithParcel2.token)
        .send({
          pickupLocation: 'new pickup-location',
          destination: 'new destination',
          recipientName: 'New Recipient',
          recipientPhone: '08123456789'
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.recipient_name).toEqual('New Recipient');
          done();
        });
    });
  });


  describe('PUT => Cancel a Parcel delivery order', () => {
    let userWithParcel1, userWithParcel2, adminUser;
    beforeAll(done => {
      signUpUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        signUpUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          signUpUser('admin', (err, adminInfo) => {
            adminUser = adminInfo;
            done();
          });
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return errors if parcel Id is not a number', done => {
      server(app)
        .put('/api/v1/parcels/string/cancel')
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if Admin tries to cancel a parcel', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel1.parcels[0].id}/cancel`)
        .set('Authorization', adminUser.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry, you can not perform this operation!');
          done();
        });
    });

    it('Should return error message if parcel not found', done => {
      server(app)
        .put('/api/v1/parcels/123456789/cancel')
        .set('Authorization', userWithParcel1.token)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('This Parcel Delivery Order Does Not Exist');
          done();
        });
    });

    it('Should return error message if Parcel is already delivered', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'delivered', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/cancel`)
          .set('Authorization', userWithParcel1.token)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      })
    });

    it('Should return error message if Parcel is already cancelled', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'cancelled', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/cancel`)
          .set('Authorization', userWithParcel1.token)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      });
    });

    it('Should cancel the Parcel Delivery order if it is "Ready for Pickup"', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel2.parcels[0].id}/cancel`)
        .set('Authorization', userWithParcel2.token)
        .send({
          status: 'delivered'
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.status).toEqual('cancelled');
          done();
        });
    });
  });


  describe('PUT => Update a Parcel delivery order Location', () => {
    let userWithParcel1, userWithParcel2, adminUser;
    beforeAll(done => {
      signUpUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        signUpUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          signUpUser('admin', (err, adminInfo) => {
            adminUser = adminInfo;
            done();
          });
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return errors if parcel Id is not a number', done => {
      server(app)
        .put('/api/v1/parcels/string/presentLocation')
        .set('Authorization', adminUser.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if a User tries to update a parcel location', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel1.parcels[0].id}/presentLocation`)
        .set('Authorization', userWithParcel1.token)
        .send({
          presentLocation: 'current location'
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry, only admins can access this!');
          done();
        });
    });

    it('Should return error message if parcel not found', done => {
      server(app)
        .put('/api/v1/parcels/123456789/presentLocation')
        .set('Authorization', adminUser.token)
        .send({
          presentLocation: 'current location'
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('This Parcel Delivery Order Does Not Exist');
          done();
        });
    });

    it('Should return error message if Parcel is already delivered', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'delivered', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/presentLocation`)
          .set('Authorization', adminUser.token)
          .send({
            presentLocation: 'current location'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      })
    });

    it('Should return error message if Parcel is already cancelled', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'cancelled', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/presentLocation`)
          .set('Authorization', adminUser.token)
          .send({
            presentLocation: 'current location'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      });
    });

    it('Should change presentLocation if the Parcel Delivery order if it is "Ready for Pickup"', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel2.parcels[0].id}/presentLocation`)
        .set('Authorization', adminUser.token)
        .send({
          presentLocation: 'current location'
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.present_location).toEqual('current location');
          done();
        });
    });
  });


  describe('PUT => Update a Parcel delivery order Status', () => {
    let userWithParcel1, userWithParcel2, adminUser;
    beforeAll(done => {
      signUpUserWithParcel('member', (err, userInfo1) => {
        userWithParcel1 = userInfo1;
        signUpUserWithParcel('member', (err, userInfo2) => {
          userWithParcel2 = userInfo2;
          signUpUser('admin', (err, adminInfo) => {
            adminUser = adminInfo;
            done();
          });
        });
      });
    });

    afterAll(done => {
      clearDatabase(() => done());
    });

    it('Should return errors if parcel Id is not a number', done => {
      server(app)
        .put('/api/v1/parcels/string/status')
        .set('Authorization', adminUser.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if a User tries to update a parcel status', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel1.parcels[0].id}/status`)
        .set('Authorization', userWithParcel1.token)
        .send({
          status: 'current location'
        })
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry, only admins can access this!');
          done();
        });
    });

    it('Should return error message if parcel not found', done => {
      server(app)
        .put('/api/v1/parcels/123456789/status')
        .set('Authorization', adminUser.token)
        .send({
          status: 'delivered'
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('This Parcel Delivery Order Does Not Exist');
          done();
        });
    });

    it('Should return error message if Parcel is already delivered', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'delivered', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/status`)
          .set('Authorization', adminUser.token)
          .send({
            status: 'delivered'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      })
    });

    it('Should return error message if Parcel is already cancelled', done => {
      const parcelToUpdateId = userWithParcel1.parcels[0].id;
      updateParcelStatus(parcelToUpdateId, 'cancelled', (err, updatedParcel) => {
        server(app)
          .put(`/api/v1/parcels/${parcelToUpdateId}/status`)
          .set('Authorization', adminUser.token)
          .send({
            status: 'delivered'
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.body.error).toEqual(undefined);
            expect(res.body.msg).toEqual('Sorry, can not update this parcel. Parcel already Cancelled or Delivered');
            done();
          });
      });
    });

    it('Should change status of the Parcel Delivery order if it is "Ready for Pickup"', done => {
      server(app)
        .put(`/api/v1/parcels/${userWithParcel2.parcels[0].id}/status`)
        .set('Authorization', adminUser.token)
        .send({
          status: 'delivered'
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.status).toEqual('delivered');
          done();
        });
    });
  });
});
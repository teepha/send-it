import server from 'supertest';
import faker from 'faker';
import app from '../server.js';
import { createUser, createUserWithParcel } from './support/helper';

describe('User-routes unit test', () => {
  describe('POST => Create a User account', () => {
    it('Should return error message if firstName is not a string', (done) => {
      server(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: faker.name.firstName(),
          lastName: 111,
          email: faker.internet.email(),
          phoneNumber: faker.phone.phoneNumber(),
          password: faker.internet.password()
        })
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(422);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return user info if registration is successful', (done) => {
      server(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.phoneNumber(),
          password: faker.internet.password()
        })
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(201);
          expect(res.body.msg).toEqual('Registration successful');
          done();
        });
    });
  });

  describe('POST => Login a User', () => {
    let testUser;
    beforeAll((done) => {
      createUser('member', (err, userInfo) => {
        testUser = userInfo;
        done();
      });
    });

    it('Should return error message if email is not a string', (done) => {
      server(app)
        .post('/api/v1/auth/login')
        .send({
          email: 666,
          password: faker.internet.password()
        })
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(422);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if email or password is invalid', (done) => {
      server(app)
        .post('/api/v1/auth/login')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password()
        })
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(401);
          expect(res.body.msg).toEqual('Invalid User credentials');
          done();
        });
    });

    it('Should login a user with valid email and password', (done) => {
      server(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .end((err, res) => {
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(200);
          expect(res.body.msg).toEqual('Login successful');
          done();
        });
    });
  });

  describe('GET => Get all Parcel delivery orders by a User', () => {
    let userWithoutParcel, userWithParcel;
    beforeAll((done) => {
      createUser('member', (err, userInfo1) => {
        userWithoutParcel = userInfo1;
        createUserWithParcel('member', (err, userInfo2) => {
          userWithParcel = userInfo2;
          done();
        });
      });
    });

    it('Should return error message if userId is not a Number', (done) => {
      server(app)
        .get('/api/v1/users/string/parcels')
        .set('Authorization', userWithParcel.token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });

    it('Should return error message if user does not exist', (done) => {
      server(app)
        .get('/api/v1/users/1234/parcels')
        .set('Authorization', userWithParcel.token)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('Sorry you can not fetch Parcels for another User!');
          done();
        });
    });

    it('Should return error message if user has no parcels', (done) => {
      server(app)
        .get(`/api/v1/users/${userWithoutParcel.id}/parcels`)
        .set('Authorization', userWithoutParcel.token)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('No Parcel Delivery Orders found for this User');
          done();
        });
    });

    it('Should return parcel orders for a specific user', (done) => {
      server(app)
        .get(`/api/v1/users/${userWithParcel.id}/parcels`)
        .set('Authorization', userWithParcel.token)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });
  });
});

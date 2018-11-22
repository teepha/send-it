import server from 'supertest';
import faker from 'faker';
import app from '../server.js';

describe('User-routes unit test', () => {

  let firstName, lastName, email, phoneNumber, password, token;
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
      firstName = faker.name.firstName();
      lastName = faker.name.lastName();
      email = faker.internet.email();
      phoneNumber = faker.phone.phoneNumber();
      password = faker.internet.password();

      server(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          password: password
        })
        .end((err, res) => {
          token = res.body.token;
          expect(res.body.error).toEqual(undefined);
          expect(res.status).toEqual(201);
          expect(res.body.msg).toEqual('Registration successful');
          done();
        });
    });
  });

  describe('POST => Login a User', () => {
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
          email: email,
          password: password
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
    it('Should return error message if userId is not a Number', (done) => {
      server(app)
        .get('/api/v1/users/string/parcels')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).toEqual(422);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
          done();
        });
    });
  
    /*
    it('Should return error message if user does not exist', (done) => {
      server(app)
        .get('/api/v1/users/1234/parcels')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('User not found!!!');
          done();
        });
    });
  
    it('Should return error message if user has no parcels', (done) => {
      server(app)
        .get('/api/v1/users/4/parcels')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.body.error).toEqual(undefined);
          expect(res.body.msg).toEqual('User has no Parcel Delivery Orders yet');
          done();
        });
    });    
  
    it('Should return parcel orders for a specific user', (done) => {
      server(app)
        .get('/api/v1/users/2/parcels')
        .expect(200)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.error).toEqual(undefined);
          expect(Array.isArray(res.body)).toBeTruthy();
          done();
        });
    });
    */
  });
});

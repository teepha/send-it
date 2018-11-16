import server from 'supertest';
import app from '../../server.js';

describe('User-routes unit test', () => {
  it('Should return error message if userId is not a Number', (done) => {
    server(app)
      .get('/api/v1/users/string/parcels')
      .expect(200)
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
});

import server from 'supertest';
import app from '../server';

describe('User-routes unit test', () => {
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

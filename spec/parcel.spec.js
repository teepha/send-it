import server from 'supertest';
import app from '../server';

describe('Parcel-routes unit test', () => {
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

  it('Should cancel a specific parcel order', (done) => {
    server(app)
      .put('/api/v1/parcels/9/cancel')
      .expect('Content-Type', /json/)
      .expect(202)
      .end((err, res) => {
        expect(res.status).toEqual(202);
        expect(res.body.error).toEqual(undefined);
        expect(res.body.status).toEqual('Cancelled');
        done();
      });
  });

  it('Should create a new parcel order', (done) => {
    server(app)
      .post('/api/v1/parcels')
      .send({
        userId: 4,
        pickupLocation: '42, Abdulmujeeb close, Mende, Lagos',
        destination: '12 complex Street, Victoria Island, Lagos',
        recipientName: 'Aisha',
        recipientPhone: '08123409876',
        status: 'Delivered',
        presentLocation: ' ',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        expect(res.status).toEqual(201);
        expect(res.body.error).toEqual(undefined);
        done();
      });
  });
});

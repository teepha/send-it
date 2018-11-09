import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import parcelsdb from '../../parcelsdb';

const router = express.Router();
router.use(bodyParser.json());

// Set up Endpoint to get all parcel orders
router.get('/parcels', (req, res) => {
  res.send(parcelsdb);
});

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const foundParcel = parcelsdb.find(parcel => parcel.id === parcelId);
  res.send(foundParcel);
});

// Set up Endpoint to cancel a specific parcel order
router.put('/parcels/:id/cancel', (req, res) => {
  const cancelParcel = parcelsdb.find(parcel => parcel.id === parseInt(req.params.id, 10));
  if (cancelParcel.status === 'Delivered') {
    res.send('Parcel Delivered! Cannot cancel parcel order.');
  } else {
    cancelParcel.status = req.body.status;
    fs.writeFile('parcelsdb.json', JSON.stringify(parcelsdb, null, 2), (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(cancelParcel);
      }
    });
  }
});

// Export router to index.js
export default router;

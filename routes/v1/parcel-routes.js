import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import parcelsdb from '../../parcelsdb';

const router = express.Router();
router.use(bodyParser.json());

// Set up Endpoint to get all parcel orders
router.get('/parcels', (req, res) => {
  res.status(200).send(parcelsdb);
});

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const foundParcel = parcelsdb.find(parcel => parcel.id === parcelId);
  res.status(200).send(foundParcel);
});

// Set up Endpoint to cancel a specific parcel order
router.put('/parcels/:id/cancel', (req, res) => {
  const cancelParcel = parcelsdb.find(parcel => parcel.id === parseInt(req.params.id, 10));
  if (cancelParcel.status === 'Delivered') {
    res.status(304).send('Parcel Delivered! Cannot cancel parcel order.');
  } else {
    cancelParcel.status = 'Cancelled';
    fs.writeFile('parcelsdb.json', JSON.stringify(parcelsdb, null, 2), (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(202).send(cancelParcel);
      }
    });
  }
});

// Set up Endpoint to create a new parcel order
router.post('/parcels', (req, res) => {
  const newParcel = {
    id: parcelsdb.length + 1,
    userId: req.body.userId,
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    recipientName: req.body.recipientName,
    recipientPhone: req.body.recipientPhone,
    status: 'Ready for Pickup',
    presentLocation: '',
  };

  parcelsdb.push(newParcel);

  fs.writeFile('parcelsdb.json', JSON.stringify(parcelsdb, null, 2), (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(newParcel);
    }
  });
});

// Export router to index.js
export default router;

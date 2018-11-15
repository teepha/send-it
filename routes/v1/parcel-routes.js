import express from 'express';
import bodyParser from 'body-parser'; // Allows us to receive data sent via POST/PUT API request
import fs from 'fs';
import parcelsdb from '../../parcelsdb';

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json());// Specifically allow us to read data sent in JSON format

// Set up Endpoint to get all parcel orders
router.get('/parcels', (req, res) => {
  res.status(200).send(parcelsdb);
});

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const foundParcel = parcelsdb.find(parcel => parcel.id === parcelId);
  if (isNaN(req.params.id)){
    res.status(400).send('Error! Please enter a number')
  } else if (req.params.id > parcelsdb[parcelsdb.length-1].id) {
    res.status(404).send('Error! Parcel not found')
  } else {
  res.status(200).send(foundParcel);
  }
});

// Set up Endpoint to cancel a specific parcel order
router.put('/parcels/:id/cancel', (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const parcelToCancel = parcelsdb.find(parcel => parcel.id === parcelId);
  if (isNaN(req.params.id)){
    res.status(400).send('Error! Please enter a valid Parcel ID')
  } else if (!parcelToCancel) {
    res.status(404).send('Error! Parcel Order Not Found')
  } else if (parcelToCancel.status === 'Delivered') {
    res.status(400).send('Parcel Delivered! Cannot cancel Parcel Order.');
  } else if (parcelToCancel.status === 'Cancelled') {
    res.status(400).send('Cannot Cancel Parcel Order, Order Already Cancelled.');
  } else {
    parcelToCancel.status = 'Cancelled';
    fs.writeFile('parcelsdb.json', JSON.stringify(parcelsdb, null, 2), (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(202).send(parcelToCancel);
      }
    });
  }
});

// Set up Endpoint to create a new parcel order
router.post('/parcels', (req, res) => {
  const newParcel = {
    id: parcelsdb[parcelsdb.length-1].id + 1, //find a better way to do this
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

import express from 'express';
import bodyParser from 'body-parser';

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

// Export router to index.js
export default router;

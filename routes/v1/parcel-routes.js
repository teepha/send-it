import express from 'express';
import bodyParser from 'body-parser';

import parcelsdb from '../../parcelsdb';

const router = express.Router();
router.use(bodyParser.json());

// Set up Endpoint to get all parcel orders
router.get('/parcels', (req, res) => {
  res.send(parcelsdb);
});

// Export router to index.js
export default router;

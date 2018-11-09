import express from 'express';
import parcelsdb from '../../parcelsdb';

const router = express.Router();

// Set up Endpoint to get all parcel orders by a specific user
router.get('/users/:userId/parcels', (req, res) => {
  const userParcels = parcelsdb.filter(parcel => parcel.userId === req.params.userId);
  res.send(userParcels);
});

// Export router to index.js
export default router;

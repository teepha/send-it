import express from 'express';
import parcelsdb from '../../parcelsdb';

const router = express.Router();

// Set up Endpoint to get all parcel orders by a specific user
router.get('/users/:userId/parcels', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const userParcels = parcelsdb.filter(parcel => parcel.userId === userId);
  res.status(200).send(userParcels);
});

// Export router to index.js
export default router;

import express from 'express';
import parcelsdb from '../../parcelsdb';
import usersdb from '../../usersdb';


const router = express.Router();

// Set up Endpoint to get all parcel orders by a specific user
router.get('/users/:userId/parcels', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const userParcels = parcelsdb.filter(parcel => parcel.userId === userId);
  if (isNaN(req.params.userId)){
    res.status(400).send('Error! Please enter a valid User ID')
  } else if (userId > usersdb.length) {
    res.status(404).send('Error! User ID not found')
  } else {
    res.status(200).send(userParcels);
  }
});

// Export router to index.js
export default router;

import express from 'express';
import idChecker from '../middlewares/id-checker';
import { getUserParcels } from '../controllers/user-controller';

const router = express.Router();

// Set up Endpoint to get all parcel orders by a specific user
router.get('/users/:userId/parcels', idChecker('userId', ['params'], 'userId should be a number'), getUserParcels);

// Export router to index.js
export default router;

import express from 'express';
import bodyParser from 'body-parser'; // Allows us to receive data sent via POST/PUT API request
import { body } from 'express-validator/check';
import idChecker from '../../middlewares/id-checker';
import {
  getAllParcels, getParcel, updateParcel, createParcel,
} from '../../controllers/parcel-controller';

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json());// Specifically allow us to read data sent in JSON format

// Set up Endpoint to get all parcel orders
router.get('/parcels', getAllParcels);

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', idChecker('id', ['params'], 'id should be a number'), getParcel);

// Set up Endpoint to cancel a specific parcel order
router.put('/parcels/:id/cancel', idChecker('id', ['params'], 'id should be a number'), updateParcel);

// Set up Endpoint to create a new parcel order
router.post('/parcels', [
  body('userId', 'Value must be a Number').isInt(),
  body(['pickupLocation', 'destination', 'recipientName', 'recipientPhone'], 'Value must be a String').isString(),
], createParcel);

// Export router to index.js
export default router;

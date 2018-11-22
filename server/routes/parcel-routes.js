import express from 'express';
import bodyParser from 'body-parser'; // Allows us to receive data sent via POST/PUT API request
import { body, param } from 'express-validator/check'; // to validate request parameter
import { JwtDocoder } from '../middlewares/middleware';
import {
  getAllParcels,
  getParcel,
  updateParcelDestination,
  cancelParcel,
  createParcel,
  updateParcelStatus,
  updateParcelLocation
} from '../controllers/parcel-controller';

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json());// Specifically allow us to read data sent in JSON format

// Set up Endpoint to create a new parcel order
router.post('/parcels', JwtDocoder, [
  body('userId', 'Value must be a Number').isInt(),
  body(['pickupLocation', 'destination', 'recipientName', 'recipientPhone'], 'Value must be a String').isString(),
], createParcel);

// Admin get all parcel orders
router.get('/parcels', JwtDocoder, getAllParcels);

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', JwtDocoder, param('id', 'Id must be a Number').isInt(), getParcel);

// Export router to index.js
export default router;

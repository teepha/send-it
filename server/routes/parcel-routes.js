import express from 'express';
import bodyParser from 'body-parser'; // Allows us to receive data sent via POST/PUT API request
import { body, param } from 'express-validator/check'; // to validate request parameter
import { JwtDecoder } from '../middlewares/middleware';
import {
  getAllParcels,
  getParcel,
  updateParcelDetails,
  cancelParcel,
  createParcel,
  updateParcelStatus,
  updateParcelLocation,
} from '../controllers/parcel-controller';

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json());// Specifically allow us to read data sent in JSON format

// Set up Endpoint to create a new parcel order
router.post('/parcels', JwtDecoder, [
  body('userId', 'Value must be a Number').isInt(),
  body(['pickupLocation', 'destination', 'recipientName', 'recipientPhone']).trim()
    .not().isEmpty()
    .withMessage('field must not be Empty!')
    .isString()
    .withMessage('Value must be a String!'),
], createParcel);

// Admin get all parcel orders
router.get('/parcels', JwtDecoder, getAllParcels);

// Set up Endpoint to get a specific parcel order
router.get('/parcels/:id', JwtDecoder, param('id', 'Id must be a Number').isInt(), getParcel);

// Set up Endpoint to update the details of a parcel order
router.put('/parcels/:id',
  JwtDecoder,
  param('id', 'Id must be a Number').isInt(),
  body(['pickupLocation', 'destination', 'recipientName', 'recipientPhone']).trim()
    .not().isEmpty()
    .withMessage('Field must not be empty!')
    .isString()
    .withMessage('Value must be a string!'),
  updateParcelDetails);

// Set up Endpoint to cancel a specific parcel order
router.put('/parcels/:id/cancel', JwtDecoder, param('id', 'Id must be a Number').isInt(), cancelParcel);

// Admin change present location of a parcel
router.put('/parcels/:id/presentLocation',
  JwtDecoder,
  param('id', 'Id must be a Number').isInt(),
  body('presentLocation', 'presentLocation must be a String')
    .not().isEmpty().withMessage('Field must not be empty!')
    .isString()
    .withMessage('Value must be a string!'),
  updateParcelLocation);

// Admin change status of parcel
router.put('/parcels/:id/status',
  JwtDecoder,
  param('id', 'Id must be a Number').isInt(),
  body('status', 'Status must be a String').isString(),
  updateParcelStatus);

// Export router to index.js
export default router;

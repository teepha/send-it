import express from 'express';
import bodyParser from 'body-parser'; // Allows us to receive data sent via POST/PUT API request
import { body } from 'express-validator/check'; // to validate request parameter
import { idChecker, JwtDocoder } from '../middlewares/middleware';
import { createUser, getUser, getUserParcels } from '../controllers/user-controller';

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json()); // Specifically allow us to read data sent in JSON format

// To register a new user
router.post('/auth/signup', [
  body(['firstName', 'lastName', 'email', 'phoneNumber', 'password'], 'Value must be a String').isString(),
], createUser);

// Login a user
router.post('/auth/login', body(['email', 'password'], 'Value must be a String').isString(), getUser);

// To get all parcel orders by a specific user
router.get('/users/:userId/parcels', JwtDocoder, idChecker('userId', ['params'], 'userId should be a number'), getUserParcels);

// Export router to index.js
export default router;

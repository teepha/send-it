import express from "express";
import bodyParser from "body-parser"; // Allows us to receive data sent via POST/PUT API request
import { body, param } from "express-validator/check"; // to validate request parameter
import { JwtDecoder } from "../middlewares/middleware";
import { checkUniqueEmail } from "../middlewares/validation";
import {
  signUpUser,
  loginUser,
  getUser,
  getUserParcels
} from "../controllers/user-controller";

const router = express.Router(); // Create a new instance of express Router
router.use(bodyParser.json()); // Specifically allow us to read data sent in JSON format

// To register a new user
router.post(
  "/auth/signup",
  body(["firstName", "lastName", "email", "phoneNumber", "password"])
    .trim()
    .not()
    .isEmpty()
    .withMessage("field must not be Empty!")
    .isString()
    .withMessage("Value must be a String!"),
  checkUniqueEmail,
  signUpUser
);

// Login a user
router.post(
  "/auth/login",
  body(["email", "password"])
    .trim()
    .not()
    .isEmpty()
    .withMessage("field must not be Empty!")
    .isString()
    .withMessage("Value must be a String!"),
  loginUser
);

// Return user details
router.get("/me", JwtDecoder, getUser);

// To get all parcel orders by a specific user
router.get(
  "/users/:userId/parcels",
  JwtDecoder,
  param("userId", "userId must be a Number").isInt(),
  getUserParcels
);

// Export router to index.js
export default router;

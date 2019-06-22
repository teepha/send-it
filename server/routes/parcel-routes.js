import express from "express";
import bodyParser from "body-parser";
import { body, param } from "express-validator/check";
import { JwtDecoder } from "../middlewares/middleware";
import {
  getAllParcels,
  getParcel,
  updateParcelDetails,
  cancelParcel,
  createNewParcel,
  updateParcelStatus,
  updateParcelLocation
} from "../controllers/parcel-controller";
import {
  checkParcel,
  checkNewParcel,
  checkGetAllParcels,
  checkGetSingleParcel,
  checkIfParcelExists,
  checkIfParcelIsValid
} from "../middlewares/validation";

const router = express.Router();
router.use(bodyParser.json());

// Create a new parcel order
router.post(
  "/parcels",
  JwtDecoder,
  [
    body("userId", "Value must be a Number").isInt(),
    body(["pickupLocation", "destination", "recipientName", "recipientPhone"])
      .trim()
      .not()
      .isEmpty()
      .withMessage("field must not be Empty!")
      .isString()
      .withMessage("Value must be a String!")
  ],
  checkNewParcel,
  checkParcel,
  createNewParcel
);

// Admin get all parcel orders
router.get("/parcels", JwtDecoder, checkGetAllParcels, getAllParcels);

// Get a specific parcel order
router.get(
  "/parcels/:id",
  JwtDecoder,
  param("id", "Id must be a Number").isInt(),
  checkIfParcelExists,
  checkGetSingleParcel,
  getParcel
);

// Update the details of a parcel order
router.put(
  "/parcels/:id",
  JwtDecoder,
  param("id", "Id must be a Number").isInt(),
  body(["pickupLocation", "destination", "recipientName", "recipientPhone"])
    .trim()
    .not()
    .isEmpty()
    .withMessage("Field must not be empty!")
    .isString()
    .withMessage("Value must be a string!"),
  checkIfParcelExists,
  checkParcel,
  checkIfParcelIsValid,
  updateParcelDetails
);

// Cancel a specific parcel order
router.put(
  "/parcels/:id/cancel",
  JwtDecoder,
  param("id", "Id must be a Number").isInt(),
  checkIfParcelExists,
  checkParcel,
  checkIfParcelIsValid,
  cancelParcel
);

// Admin change present location of a parcel
router.put(
  "/parcels/:id/presentLocation",
  JwtDecoder,
  param("id", "Id must be a Number").isInt(),
  body("presentLocation", "presentLocation must be a String")
    .not()
    .isEmpty()
    .withMessage("Field must not be empty!")
    .isString()
    .withMessage("Value must be a string!"),
  checkIfParcelExists,
  checkGetAllParcels,
  checkIfParcelIsValid,
  updateParcelLocation
);

// Admin change status of parcel
router.put(
  "/parcels/:id/status",
  JwtDecoder,
  param("id", "Id must be a Number").isInt(),
  body("status", "Status must be a String").isString(),
  checkIfParcelExists,
  checkGetAllParcels,
  checkIfParcelIsValid,
  updateParcelStatus
);

// Export router to index.js
export default router;

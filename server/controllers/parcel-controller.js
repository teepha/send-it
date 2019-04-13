/* eslint-disable no-undef */
import { validationResult } from "express-validator/check"; // calls the specified validation
import {
  createParcel,
  findAllParcels,
  findSingleParcel,
  editParcelDetails,
  parcelCancel,
  editParcelLocation,
  updateStatus
} from "../helpers/models/parcel-model";
import { serverError, successResponse } from "../helpers/http-response";

export const createNewParcel = async (req, res) => {
  const {
    userId,
    pickupLocation,
    destination,
    recipientName,
    recipientPhone
  } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const newParcel = await createParcel(req.body, res);
      res.status(201).send(newParcel);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const getAllParcels = async (req, res) => {
  try {
    const allParcels = await findAllParcels(res);
    if (!allParcels.length) {
      res.status(404).send({ msg: "No Parcel Delivery Orders" });
    } else {
      return successResponse(res, allParcels);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const getParcel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const singleParcel = req.parcel;
      return successResponse(res, singleParcel);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateParcelDetails = async (req, res) => {
  const {
    pickupLocation,
    destination,
    recipientName,
    recipientPhone
  } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const updatedParcel = await editParcelDetails(req.body, req, res);
      return successResponse(res, updatedParcel);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const cancelParcel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const cancelledParcel = await parcelCancel(req, res);
      return successResponse(res, cancelledParcel);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateParcelLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const updatedLocation = await editParcelLocation(req, res);
      return successResponse(res, updatedLocation);
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateParcelStatus = async (req, res) => {
  console.log(">>>>>>>>", req.body);
  const { status } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const updatedStatus = await updateStatus(req.body, res);
      return successResponse(req.body, updatedStatus);
    }
  } catch (error) {
    return serverError(res, error);
  }
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   res.status(422).json({ errors: errors.array() });
  // } else if (req.user.userInfo.role === "admin") {
  //   const parcelId = parseInt(req.params.id, 10);
  //   client.query(
  //     `SELECT * FROM parcels WHERE id = ${parcelId};`,
  //     (selectErr, selectResp) => {
  //       const parcel = selectResp.rows[0];
  //       if (selectErr) {
  //         res.status(500).send(selectErr);
  //       } else if (!parcel) {
  //         res
  //           .status(404)
  //           .send({ msg: "This Parcel Delivery Order Does Not Exist" });
  //       } else if (parcel.status === "delivered") {
  //         res.status(401).send({
  //           msg:
  //             "Sorry, can't change status for this Order. Parcel already Delivered"
  //         });
  //       } else if (parcel.status === "cancelled") {
  //         res.status(401).send({
  //           msg:
  //             "Sorry, can't change status for this Order. Parcel already Cancelled"
  //         });
  //       } else {
  //         client.query(
  //           `UPDATE parcels SET status = '${
  //             req.body.status
  //           }' WHERE id = ${parcelId} RETURNING *;`,
  //           (updateErr, updateResp) => {
  //             if (updateErr) {
  //               res.status(500).send(updateErr);
  //             } else {
  //               res.status(200).send(updateResp.rows[0]);
  //             }
  //           }
  //         );
  //       }
  //     }
  //   );
  // } else {
  //   res.status(401).send({ msg: "Sorry, you can't perform this operation" });
  // }
};

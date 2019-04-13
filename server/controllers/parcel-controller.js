/* eslint-disable no-undef */
import { validationResult } from "express-validator/check"; // calls the specified validation
import {
  createParcel,
  findAllParcels,
  findSingleParcel
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

export const updateParcelDetails = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === "member") {
    const parcelId = parseInt(req.params.id, 10);
    client.query(
      `SELECT * FROM parcels WHERE id = ${parcelId};`,
      (selectErr, selectResp) => {
        const parcel = selectResp.rows[0];
        if (selectErr) {
          res.send(selectErr);
        } else if (!parcel) {
          res
            .status(404)
            .send({ msg: "This Parcel Delivery Order Does Not Exist" });
        } else {
          const userIdFromToken = parseInt(req.user.userInfo.id, 10);
          if (userIdFromToken === parcel.user_id) {
            if (parcel.status === "delivered") {
              res.status(401).send({
                msg:
                  "Sorry, can not update parcel details. Parcel already Delivered"
              });
            } else if (parcel.status === "cancelled") {
              res.status(401).send({
                msg:
                  "Sorry, can not update parcel details. Parcel already Cancelled"
              });
            } else {
              client.query(
                `UPDATE parcels 
              SET pickup_location = '${req.body.pickupLocation}',
              destination = '${req.body.destination}',
              recipient_name = '${req.body.recipientName}',
              recipient_phone = '${req.body.recipientPhone}'
              WHERE id= ${parcelId} RETURNING *;`,
                (updateErr, updateResp) => {
                  if (updateErr) {
                    res.status(500).send(updateErr);
                  } else {
                    res.status(200).send(updateResp.rows[0]);
                  }
                }
              );
            }
          } else {
            res.send({
              msg: "Sorry you can not update Parcel for another User!"
            });
          }
        }
      }
    );
  } else {
    res
      .status(401)
      .send({ msg: "Sorry, only users can change the Destination" });
  }
};

export const cancelParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === "member") {
    const parcelId = parseInt(req.params.id, 10);
    client.query(
      `SELECT * FROM parcels WHERE id = ${parcelId};`,
      (selectErr, selectResp) => {
        const parcel = selectResp.rows[0];
        if (selectErr) {
          res.status(500).send(selectErr);
        } else if (!parcel) {
          res
            .status(404)
            .send({ msg: "This Parcel Delivery Order Does Not Exist" });
        } else {
          const userIdFromToken = parseInt(req.user.userInfo.id, 10);
          if (userIdFromToken === parcel.user_id) {
            if (parcel.status === "delivered") {
              res.status(401).send({
                msg: "Sorry, can not cancel Order. Parcel already Delivered"
              });
            } else if (parcel.status === "cancelled") {
              res.status(401).send({
                msg: "Sorry, can not cancel Order. Parcel already Cancelled"
              });
            } else {
              client.query(
                `UPDATE parcels SET status = 'cancelled' WHERE id = ${parcelId} RETURNING *;`,
                (updateErr, updateResp) => {
                  if (updateErr) {
                    res.status(500).send(updateErr);
                  } else {
                    res.status(200).send(updateResp.rows[0]);
                  }
                }
              );
            }
          } else {
            res.send({
              msg: "Sorry you can not cancel Parcel for another User!"
            });
          }
        }
      }
    );
  } else {
    res.status(401).send({ msg: "Sorry, only users can cancel Parcel Order" });
  }
};

export const updateParcelLocation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === "admin") {
    const parcelId = parseInt(req.params.id, 10);
    client.query(
      `SELECT * FROM parcels WHERE id = ${parcelId};`,
      (selectErr, selectResp) => {
        const parcel = selectResp.rows[0];
        if (selectErr) {
          res.send(selectErr);
        } else if (!parcel) {
          res
            .status(404)
            .send({ msg: "This Parcel Delivery Order Does Not Exist" });
        } else if (parcel.status === "delivered") {
          res.status(401).send({
            msg:
              "Sorry, can't change presentLocation for this Order. Parcel already Delivered"
          });
        } else if (parcel.status === "cancelled") {
          res.status(401).send({
            msg:
              "Sorry, can't change presentLocation for this Order. Parcel already Cancelled"
          });
        } else {
          client.query(
            `UPDATE parcels SET present_location = '${
              req.body.presentLocation
            }' WHERE id = ${parcelId} RETURNING *;`,
            (updateErr, updateResp) => {
              if (updateErr) {
                res.status(500).send(updateErr);
              } else {
                res.status(200).send(updateResp.rows[0]);
              }
            }
          );
        }
      }
    );
  } else {
    res.status(401).send({ msg: "Sorry, you can't perform this operation" });
  }
};

export const updateParcelStatus = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === "admin") {
    const parcelId = parseInt(req.params.id, 10);
    client.query(
      `SELECT * FROM parcels WHERE id = ${parcelId};`,
      (selectErr, selectResp) => {
        const parcel = selectResp.rows[0];
        if (selectErr) {
          res.status(500).send(selectErr);
        } else if (!parcel) {
          res
            .status(404)
            .send({ msg: "This Parcel Delivery Order Does Not Exist" });
        } else if (parcel.status === "delivered") {
          res.status(401).send({
            msg:
              "Sorry, can't change status for this Order. Parcel already Delivered"
          });
        } else if (parcel.status === "cancelled") {
          res.status(401).send({
            msg:
              "Sorry, can't change status for this Order. Parcel already Cancelled"
          });
        } else {
          client.query(
            `UPDATE parcels SET status = '${
              req.body.status
            }' WHERE id = ${parcelId} RETURNING *;`,
            (updateErr, updateResp) => {
              if (updateErr) {
                res.status(500).send(updateErr);
              } else {
                res.status(200).send(updateResp.rows[0]);
              }
            }
          );
        }
      }
    );
  } else {
    res.status(401).send({ msg: "Sorry, you can't perform this operation" });
  }
};

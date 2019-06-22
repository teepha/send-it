/* eslint-disable no-undef */
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
    const newParcel = await createParcel(req.body, res);
    res.status(201).send(newParcel);
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
    const singleParcel = req.parcel;
    return successResponse(res, singleParcel);
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
      const updatedParcel = await editParcelDetails(req.body, req, res);
      return successResponse(res, updatedParcel);
  } catch (error) {
    return serverError(res, error);
  }
};

export const cancelParcel = async (req, res) => {
  try {
    const cancelledParcel = await parcelCancel(req, res);
    return successResponse(res, cancelledParcel);
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateParcelLocation = async (req, res) => {
  try {
    const updatedLocation = await editParcelLocation(req, res);
    return successResponse(res, updatedLocation);
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateParcelStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updatedStatus = await updateStatus(res, req, res);
    return successResponse(res, updatedStatus);
  } catch (error) {
    return serverError(res, error);
  }
};

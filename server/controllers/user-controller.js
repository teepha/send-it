/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import {
  createUser,
  findUser,
  findUserById
} from "../helpers/models/user-model";
import { findUserParcels } from "../helpers/models/parcel-model";
import { serverError, successResponse } from "../helpers/http-response";

export const signUpUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const userInfo = await createUser(req.body, res);
    const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
    res.status(201).send({
      msg: "Registration successful",
      userId: userInfo.id,
      token
    });
  } catch (error) {
    return serverError(res, error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userInfo = await findUser(req.body, res);
    if (userInfo) {
      const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
      res
        .status(200)
        .send({ msg: "Login successful", userId: userInfo.id, token });
    } else {
      res.status(401).send({ msg: "Invalid User credentials" });
    }
  } catch (error) {
    return serverError(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.user.userInfo.id;
    const userInfo = await findUserById(id, res);
    return successResponse(res, userInfo);
  } catch (error) {
    return serverError(res, error);
  }
};

export const getUserParcels = async (req, res) => {
  try {
    const userIdFromPath = parseInt(req.params.userId, 10);
    const userParcels = await findUserParcels(userIdFromPath, res);
      if (!userParcels.length) {
        res
          .status(404)
          .send({ msg: "No Parcel Delivery Orders found for this User" });
      } else {
        return successResponse(res, userParcels);
      }
  } catch (error) {
    return serverError(res, error);
  }
};

import { validationResult } from "express-validator/check";
import { findSingleParcel } from "../helpers/models/parcel-model";

export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
  return next();
};

export const checkUniqueEmail = (req, res, next) => {
  const { email } = req.body;
  const existingEmail = "SELECT * FROM users WHERE email = $1";
  const incomingEmail = [email];
  client.query(existingEmail, incomingEmail, (err, resp) => {
    if (err) {
      res.status(500).send(err);
    } else if (resp.rows[0]) {
      res.status(401).send({ msg: "Email already exist!" });
    } else {
      return next();
    }
  });
};

export const checkUserRole = (req, res, next) => {
  if (req.user.userInfo.role === "admin") {
    res.status(401).send({ msg: "Sorry, you can't perform this operation!" });
  } else if (req.user.userInfo.id !== parseInt(req.body.userId, 10)) {
    res
      .status(401)
      .send({ msg: "Sorry you can not create Parcel Order for another User!" });
  } else {
    return next();
  }
};

export const checkAdminRole = (req, res, next) => {
  if (req.user.userInfo.role !== "admin") {
    res.status(401).send({ msg: "Sorry, only admins can access this" });
  } else {
    return next();
  }
};

export const checkAllRoles = (req, res, next) => {
  const userIdFromToken = parseInt(req.user.userInfo.id, 10);
  const parcel = req.parcel;
  if (
    userIdFromToken === parcel.user_id ||
    req.user.userInfo.role === "admin"
  ) {
    return next();
  } else {
    res.status(401).send({
      msg: "Sorry you can not fetch Parcel for another User!"
    });
  }
};

export const checkIfParcelExists = async (req, res, next) => {
  const parcelId = parseInt(req.params.id, 10);
  const singleParcel = await findSingleParcel(parcelId, res);
  if (!singleParcel) {
    res.status(404).send({ msg: "This Parcel Delivery Order Does Not Exist" });
  } else {
    req.parcel = singleParcel;
    return next();
  }
};

import { findSingleParcel } from "../helpers/models/parcel-model";

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

export const checkNewParcel = (req, res, next) => {
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

export const checkParcel = (req, res, next) => {
  const userInfo = req.user.userInfo;
  if (userInfo.role === "admin") {
    res.status(401).send({
      msg: "Sorry, you can not perform this operation!"
    });
  } else if (
    userInfo.id !== parseInt(req.body.userId || req.parcel.user_id, 10)
  ) {
    res.status(401).send({
      msg: "Sorry, you can not perform this operation! You entered a wrong Id!"
    });
  } else {
    return next();
  }
};

export const checkGetAllParcels = (req, res, next) => {
  if (req.user.userInfo.role !== "admin") {
    res.status(401).send({ msg: "Sorry, only admins can access this!" });
  } else {
    return next();
  }
};

export const checkGetSingleParcel = (req, res, next) => {
  const userIdFromToken = parseInt(req.user.userInfo.id, 10);
  if (
    userIdFromToken === req.parcel.user_id ||
    req.user.userInfo.role === "admin"
  ) {
    return next();
  } else {
    res.status(401).send({
      msg: "Sorry you can not fetch Parcel for another User!"
    });
  }
};

export const checkUserParcels = (req, res, next) => {
  const userIdFromToken = parseInt(req.user.userInfo.id, 10);
  const userIdFromPath = parseInt(req.params.userId, 10);
  if (
    userIdFromToken === userIdFromPath ||
    req.user.userInfo.role === "admin"
  ) {
    return next();
  } else {
    res
      .status(401)
      .send({ msg: "Sorry you can not fetch Parcels for another User!" });
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

export const checkIfParcelIsValid = (req, res, next) => {
  const parcelStatus = req.parcel.status;
  if (parcelStatus === "cancelled" || parcelStatus === "delivered") {
    res.status(401).send({
      msg:
        "Sorry, can not update this parcel. Parcel already Cancelled or Delivered"
    });
  } else {
    return next();
  }
};

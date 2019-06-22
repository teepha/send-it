import { serverError } from "../../helpers/http-response";

export const createParcel = async (parcelReqBody, res) => {
  const {
    userId,
    pickupLocation,
    destination,
    recipientName,
    recipientPhone
  } = parcelReqBody;

  try {
    const text =
      "INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone, status, present_location) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      userId,
      pickupLocation,
      destination,
      recipientName,
      recipientPhone,
      "ready_for_pickup",
      ""
    ];
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const findAllParcels = async res => {
  try {
    const response = await client.query("SELECT * FROM parcels;");
    return response.rows;
  } catch (error) {
    return serverError(res, error);
  }
};

export const findSingleParcel = async (id, res) => {
  try {
    const response = await client.query(
      `SELECT * FROM parcels WHERE id = ${id};`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const findUserParcels = async (userId, res) => {
  try {
    const response = await client.query(
      `SELECT * FROM parcels WHERE user_id = ${userId};`
    );
    return response.rows;
  } catch (error) {
    return serverError(res, error);
  }
};

export const editParcelDetails = async (parcelReqBody, req, res) => {
  const {
    pickupLocation,
    destination,
    recipientName,
    recipientPhone
  } = parcelReqBody;
  const parcelId = parseInt(req.params.id, 10);

  try {
    const response = await client.query(
      `UPDATE parcels
              SET pickup_location = '${parcelReqBody.pickupLocation}',
              destination = '${parcelReqBody.destination}',
              recipient_name = '${parcelReqBody.recipientName}',
              recipient_phone = '${parcelReqBody.recipientPhone}'
              WHERE id= ${parcelId} RETURNING *;`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const parcelCancel = async (req, res) => {
  const parcelId = parseInt(req.params.id, 10);

  try {
    const response = await client.query(
      `UPDATE parcels SET status = 'cancelled' WHERE id = ${parcelId} RETURNING *;`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const editParcelLocation = async (req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  try {
    const response = await client.query(
      `UPDATE parcels SET present_location = '${
        req.body.presentLocation
      }' WHERE id = ${parcelId} RETURNING *;`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const updateStatus = async (reqBody, req, res) => {
  const parcelId = parseInt(req.params.id, 10);
  const { status } = reqBody;

  try {
    const response = await client.query(
      `UPDATE parcels SET status = '${status}' WHERE id = ${parcelId} RETURNING *;`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

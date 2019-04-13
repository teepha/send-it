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

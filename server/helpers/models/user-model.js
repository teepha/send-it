import { serverError } from "../../helpers/http-response";

export const createUser = async (userReqBody, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = userReqBody;
    const text =
      "INSERT INTO users (first_name, last_name, email, phone_number, password) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [firstName, lastName, email, phoneNumber, password];
    const response = await client.query(text, values);
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const findUser = async (userReqBody, res) => {
  const { email, password } = userReqBody;
  try {
    const text = "SELECT * FROM users WHERE email = $1 AND password = $2";
    const values = [email, password];
    const response = await client.query(text, values);
    console.log("response");
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

export const findUserById = async (id, res) => {
  try {
    const response = await client.query(
      `SELECT id, 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        role 
        FROM users WHERE id = ${id};`
    );
    return response.rows[0];
  } catch (error) {
    return serverError(res, error);
  }
};

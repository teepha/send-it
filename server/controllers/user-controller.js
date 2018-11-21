import { validationResult } from 'express-validator/check';

const { client } = global;

export const createUser = (req, res) => {
  const {
    firstName, lastName, email, phoneNumber, password,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const text = 'INSERT INTO users (first_name, last_name, email, phone_number, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [firstName, lastName, email, phoneNumber, password];
    client.query(text, values, (err, resp) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resp.rows[0]);
      }
    });
  }
};

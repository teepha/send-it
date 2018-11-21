import { validationResult } from 'express-validator/check';
import jwt from 'jsonwebtoken';

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
        const userInfo = resp.rows[0];
        const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
        res.send({ msg: 'Registration successful', token });
      }
    });
  }
};

export const getUser = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];
    client.query(text, values, (err, resp) => {
      if (err) {
        res.send(err);
      } else {
        const userInfo = resp.rows[0];
        if (userInfo) {
          const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
          res.send({ msg: 'Login successful', token });
        } else {
          res.send({msg: 'Invalid User credentials'});
        }
      }
    });
  }
};

export const getUserParcels = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    client.query(`SELECT * FROM parcels WHERE user_id = ${req.params.userId};`, (err, resp) => {
      if (err) {
        res.send(err);
      } else if (req.user.userInfo.id = req.params.userId) {
        if (!resp.rows.length) {
          res.send({ msg: 'No Parcel Delivery Order' });
        } else {
          res.send(resp.rows);
        }
      } else {
        res.send({ msg: 'User not found!!!' });
      }
    });
  }
};

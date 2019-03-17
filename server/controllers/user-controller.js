/* eslint-disable no-undef */
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
    const existingEmail = 'SELECT * FROM users WHERE email = $1';
    const incomingEmail = [email];
    client.query(existingEmail, incomingEmail, (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else if (resp.rows[0]) {
        res.status(401).send({ msg: 'Email already exists!' });
      } else {
        const text = 'INSERT INTO users (first_name, last_name, email, phone_number, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [firstName, lastName, email, phoneNumber, password];
        client.query(text, values, (error, response) => {
          if (err) {
            response.status(500).send(error);
          } else {
            const userInfo = response.rows[0];
            const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
            res.status(201).send({
              msg: 'Registration successful',
              userId: userInfo.id,
              token,
            });
          }
        });
      }
    });
  }
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];
    client.query(text, values, (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        const userInfo = resp.rows[0];
        if (userInfo) {
          const token = jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY);
          res
            .status(200)
            .send({ msg: 'Login successful', userId: userInfo.id, token });
        } else {
          res.status(401).send({ msg: 'Invalid User credentials' });
        }
      }
    });
  }
};

export const getUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    client.query(
      `SELECT id, 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        role 
        FROM users WHERE id = ${req.user.userInfo.id};`,
      (err, resp) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(resp.rows[0]);
        }
      },
    );
  }
};

export const getUserParcels = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const userIdFromToken = parseInt(req.user.userInfo.id, 10);
    const userIdFromPath = parseInt(req.params.userId, 10);
    if (
      userIdFromToken === userIdFromPath
      || req.user.userInfo.role === 'admin'
    ) {
      client.query(
        `SELECT * FROM parcels WHERE user_id = ${userIdFromPath};`,
        (err, resp) => {
          if (err) {
            res.status(500).send(err);
          } else if (!resp.rows.length) {
            res
              .status(404)
              .send({ msg: 'No Parcel Delivery Orders found for this User' });
          } else {
            res.status(200).send(resp.rows);
          }
        },
      );
    } else {
      res
        .status(401)
        .send({ msg: 'Sorry you can not fetch Parcels for another User!' });
    }
  }
};

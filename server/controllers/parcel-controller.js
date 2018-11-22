import { validationResult } from 'express-validator/check'; // calls the specified validation

export const createParcel = (req, res) => {
  const {userId, pickupLocation, destination, recipientName, recipientPhone} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    if (req.user.userInfo.id === userId) {
      const text = 'INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone, status, present_location) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [userId, pickupLocation, destination, recipientName, recipientPhone, 'Ready for Pickup', ''];
      client.query(text, values, (err, resp) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(resp.rows[0]);
        }
      });
    } else {
      res.status(401).send({ msg: 'Sorry you can not create Parcel Order for another User!' });
    }
  }
};

export const getAllParcels = (req, res) => {
  if (req.user.userInfo.role === 'admin') {
    client.query('SELECT * FROM parcels;', (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else if (!resp.rows.length) {
        res.status(404).send({ msg: 'No Parcel Delivery Orders' });
      } else {
        res.status(200).send(resp.rows);
      }
    });
  } else {
    res.status(401).send({ msg: 'Sorry, only admins can access this' });
  }
};

export const getParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const parcelId = parseInt(req.params.id, 10);
    client.query(`SELECT * FROM parcels WHERE id = ${parcelId};`, (err, resp) => {
      const parcel = resp.rows[0];
      if (err) {
        res.status(500).send(err);
      } else if (!parcel) {
        res.status(404).send({ msg: 'This Parcel Delivery Order Does Not Exist' });
      } else {
        const userIdFromToken = parseInt(req.user.userInfo.id, 10);
        if (userIdFromToken === parcel.user_id || req.user.userInfo.role === 'admin') {
          res.status(200).send(parcel);
        } else {
          res.status(401).send({ msg: 'Sorry you can not fetch Parcel for another User!' });
        }
      }
    });
  }
};

export const updateParcelDestination = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === 'member') {
    const parcelId = parseInt(req.params.id, 10);
    client.query(`SELECT * FROM parcels WHERE id = ${parcelId};`, (err, resp) => {
      const parcel = resp.rows[0];
      if (err) {
        res.send(err);
      } else if (!parcel) {
        res.send({ msg: 'This Parcel Delivery Order Does Not Exist' });
      } else {
        const userIdFromToken = parseInt(req.user.userInfo.id, 10);
        if (userIdFromToken === parcel.user_id) {
          if (parcel.status == 'Delivered') {
            res.send({ msg: 'Sorry, can not Change Destination. Parcel already Delivered' });
          } else if (parcel.status == 'Cancelled') {
            res.send({ msg: 'Sorry, can not Change Destination. Parcel already Cancelled' });
          } else {
            client.query(`UPDATE parcels SET destination = '${req.body.destination}' WHERE id= ${parcelId} RETURNING *;`, (err, resp) => {
              if (err) {
                res.send(err);
              } else {
                res.send(resp.rows[0]);
              }
            });
          }
        } else {
          res.send({ msg: 'Sorry you can not update Parcel for another User!' });
        }
      }
    });
  } else {
    res.send({ msg: 'Sorry, only users can change the Destination' });
  }
};

export const cancelParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === 'member') {
    const parcelId = parseInt(req.params.id, 10);
    client.query(`SELECT * FROM parcels WHERE id = ${parcelId};`, (err, resp) => {
      const parcel = resp.rows[0];
      if (err) {
        res.send(err);
      } else if (!parcel) {
        res.send({ msg: 'This Parcel Delivery Order Does Not Exist' });
      } else {
        const userIdFromToken = parseInt(req.user.userInfo.id, 10);
        if (userIdFromToken === parcel.user_id) {
          if (parcel.status == 'Delivered') {
            res.send({ msg: 'Sorry, can not cancel Order. Parcel already Delivered' });
          } else if (parcel.status == 'Cancelled') {
            res.send({ msg: 'Sorry, can not cancel Order. Parcel already Cancelled' });
          } else {
            client.query(`UPDATE parcels SET status = 'Cancelled' WHERE id = ${parcelId} RETURNING *;`, (err, resp) => {
              if (err) {
                res.send(err);
              } else {
                res.send(resp.rows[0]);
              }
            });
          }
        } else {
          res.send({ msg: 'Sorry you can not cancel Parcel for another User!' });
        }
      }
    });
  } else {
    res.send({ msg: 'Sorry, only users can cancel Parcel Order' });
  }
};

export const updateParcelLocation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === 'admin') {
    const parcelId = parseInt(req.params.id, 10);
    client.query(`SELECT * FROM parcels WHERE id = ${parcelId};`, (err, resp) => {
      const parcel = resp.rows[0];
      if (err) {
        res.send(err);
      } else if (!parcel) {
        res.send({ msg: 'This Parcel Delivery Order Does Not Exist' });
      } else {
        if (parcel.status == 'Delivered') {
          res.send({ msg: 'Sorry, can\'t change presentLocation for this Order. Parcel already Delivered' });
        } else if (parcel.status == 'Cancelled') {
          res.send({ msg: 'Sorry, can\'t change presentLocation for this Order. Parcel already Cancelled' });
        } else {
          client.query(`UPDATE parcels SET present_location = '${req.body.presentLocation}' WHERE id = ${parcelId} RETURNING *;`, (err, resp) => {
            if (err) {
              res.send(err);
            } else {
              res.send(resp.rows[0]);
            }
          });
        }
      }
    });
  } else {
    res.send({ msg: 'Sorry, you can\'t perform this operation' });
  }
};

export const updateParcelStatus = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else if (req.user.userInfo.role === 'admin') {
    const parcelId = parseInt(req.params.id, 10);
    client.query(`SELECT * FROM parcels WHERE id = ${parcelId};`, (err, resp) => {
      const parcel = resp.rows[0];
      if (err) {
        res.send(err);
      } else if (!parcel) {
        res.send({ msg: 'This Parcel Delivery Order Does Not Exist' });
      } else {
        if (parcel.status == 'Delivered') {
          res.send({ msg: 'Sorry, can\'t change status for this Order. Parcel already Delivered' });
        } else if (parcel.status == 'Cancelled') {
          res.send({ msg: 'Sorry, can\'t change status for this Order. Parcel already Cancelled' });         
        } else {
          client.query(`UPDATE parcels SET status = '${req.body.status}' WHERE id = ${parcelId} RETURNING *;`, (err, resp) => {
            if (err) {
              res.send(err);
            } else {
              res.send(resp.rows[0]);
            }
          });
        }
      }
    });
  } else {
    res.send({ msg: 'Sorry, you can\'t perform this operation' });
  }
};

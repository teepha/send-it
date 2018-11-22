import { validationResult } from 'express-validator/check'; // calls the specified validation

export const createParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const text = 'INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone, status, present_location) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [req.body.userId, req.body.pickupLocation, req.body.destination, req.body.recipientName, req.body.recipientPhone, 'Ready for Pickup', ''];
    client.query(text, values, (err, resp) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resp.rows[0]);
      }
    });
  }
};

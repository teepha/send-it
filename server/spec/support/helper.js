import faker from 'faker';
import jwt from 'jsonwebtoken';

export const createUser = (role, callback) => {
  const firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    email = faker.internet.email(),
    phoneNumber = faker.phone.phoneNumber(),
    password = faker.internet.password();
  const text = 'INSERT INTO users (first_name, last_name, email, phone_number, password, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
  const values = [firstName, lastName, email, phoneNumber, password, role];
  client.query(text, values, (err, resp) => {
    if (err) {
      callback(err, null);
    } else {
      const userInfo = resp.rows[0];
      jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY, (err, token) => {
        userInfo.token = token;
        callback(null, userInfo);
      });
    }
  });
}

export const createUserWithParcel = (role, callback) => {
  createUser(role, (err, userInfo) => {
    if (err) {
      callback(err, null);
    } else {
      const userId = userInfo.id,
        pickupLocation = faker.address.streetAddress(),
        destination = faker.address.streetAddress(),
        recipientName = faker.name.findName(),
        recipientPhone = faker.phone.phoneNumber();
      const text = 'INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone, status, present_location) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [userId, pickupLocation, destination, recipientName, recipientPhone, 'Ready for Pickup', ''];
      client.query(text, values, (err, resp) => {
        if (err) {
          callback(err, null);
        } else {
          userInfo.parcels = resp.rows;
          callback(null, userInfo);
        }
      });
    }
  });
}

export const clearDatabase = (callback) => {
  client.query('DELETE from parcels;', (err, resp) => {
    if (err) {
      callback(err, null);
    } else {
      client.query('DELETE from users;', (err, resp) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, 'all done');
        }
      });
    }
  });
}

export const updateParcelStatus = (parcelId, status, callback) => {
  if (!isNaN(parcelId)) {
    client.query(`UPDATE parcels SET status = '${status}' WHERE id = ${parcelId} RETURNING *;`, (err, resp) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, resp.rows[0]);
      }
    });
  }
}
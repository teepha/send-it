import Dotenv from 'dotenv';
import express from 'express';
import winston from 'winston'; // for logging
import path from 'path'; // to locate files and folders in the file system
import { Client } from 'pg';
import config from './config/config';

// Import router from index.js
import v1Routes from './routes';

Dotenv.config();

// set up winston for logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

const env = config[process.env.NODE_ENV];
const connectionString = env.DATABASE_URL;
const client = new Client({
  connectionString,
});

// In order to use Postgres client anywhere in the codebase(controllers, routes);
global.client = client;

// connect to Postgres
client.connect().then(() => {
  logger.info('Connected to DB');

  // create parcels and users tables
  client.query(`CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone_number VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'member'
  );`,
  (err) => {
    if (err) {
      logger.info('error occured while creating users table', err);
    } else {
      logger.info('users table created');

      client.query(`CREATE TABLE IF NOT EXISTS parcels(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            date DATE NOT NULL DEFAULT CURRENT_DATE,
            pickup_location VARCHAR NOT NULL,
            destination VARCHAR NOT NULL,
            recipient_name VARCHAR NOT NULL,
            recipient_phone VARCHAR NOT NULL,
            status VARCHAR NOT NULL,
            present_location VARCHAR NOT NULL
          );`,
      (error) => {
        if (error) {
          logger.info('error occured while creating parcels table', error);
        } else {
          logger.info('parcels table created');
        }
      });
    }
  });
}).catch((err) => {
  logger.info(`err connecting to DB: ${err}`);
});

// initialize a new express instance
const app = express();

// Set port number
const PORT = process.env.PORT || 3030;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

// Load static assets
app.use(express.static(path.resolve(`${__dirname}/../ui`)));

// Mount a middleware function on the path
app.use('/api/v1', v1Routes);

// Wildcard route to catch any request that doesn't match the ones defined before it
app.all('*', (req, res) => {
  res.status(400).send('Route/Endpoint does not exist!!!');
});

// start up the server
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

// Export app to test file
export default app;

import express from 'express';
import winston from 'winston';

// Import router from index.js
import v1Routes from './routes';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

const app = express();

// Set port number
const PORT = process.env.PORT || 3030;

// Set up Endpoint
app.get('/', (req, res) => {
  res.send(`Welcome to SendIT API!!! <br><br>
            Available routes: <br>
            GET  =>  /api/v1/parcels  =>  Fetch all parcel delivery orders <br>
            GET  =>  /api/v1/parcels/:parcelId  =>  Fetch a specific parcel delivery order <br>
            GET  =>  /api/v1/users/:userId/parcels  =>  Fetch all parcel delivery orders by a specific user <br>
            PUT  =>  /api/v1/parcels/:parcelId/cancel  =>  Cancel the specific parcel delivery order <br>
            POST  =>  /api/v1/parcels  =>  Create a parcel delivery order`);
});

// Mount a middleware function on the path
app.use('/api/v1', v1Routes);

// Set up the server
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

export default app;

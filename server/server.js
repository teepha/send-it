import express from 'express';
import winston from 'winston'; // for logging
import path from 'path'; // to locate files and folders in the file system

// Import router from index.js
import v1Routes from './routes';

// set up winston for logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

// initialize a new express instance
const app = express();

// Set port number
const PORT = process.env.PORT || 3030;

// Load static assets
app.use(express.static(path.resolve(`${__dirname}/../ui`)));

// Mount a middleware function on the path
app.use('/api/v1', v1Routes);

// Wildcard route to catch any kind of request to endpoints that doesn't match the ones defined before it
app.all('*', (req, res) => {
  res.status(400).send('Route/Endpoint does not exist!!!');
});

// start up the server
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

// Export app to test file
export default app;

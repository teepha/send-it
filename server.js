import express from 'express';
import winston from 'winston'; // for logging
import path from 'path';

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
app.use(express.static(path.resolve(__dirname + '/ui')));

// Set up the homepage to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});

// Mount a middleware function on the path
app.use('/api/v1', v1Routes);

// Wildcard routes to catch Any kind of request to endpoints that doesn't exist
app.all('*', (req, res) => {
  res.status(400).send('Route/Endpoint does not exist!!!')
});

// Set up the server
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

// Export app to test file
export default app;

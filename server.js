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
const PORT = 3030;

// Set up Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to SendIT API!!!');
});

// Mount a middleware function on the path
app.use('/api/v1', v1Routes);

// Set up the server
app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

export default app;

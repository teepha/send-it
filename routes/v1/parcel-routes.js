import express from 'express';

const router = express.Router();

// Set up Endpoint
router.get('/parcels', (req, res) => {
  res.send('Fetch all parcel delivery orders');
});

// Set up Endpoint
router.get('/parcels/:id', (req, res) => {
  res.send(`Fetch parcel delivery order: ${req.params.id}`);
});

router.put('/parcels/:id/cancel', (req, res) => {
  res.send(`Cancel parcel delivery order: ${req.params.id}`);
});

router.post('/parcels', (req, res) => {
  res.send('Create a parcel delivery order');
});

// Export router to index.js
export default router;

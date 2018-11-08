import express from 'express';

const router = express.Router();

// Set up Endpoint
router.get('/users/:id/parcels', (req, res) => {
  res.send(`Fetch all parcel delivery orders for User: ${req.params.id}`);
});

// Export router to index.js
export default router;

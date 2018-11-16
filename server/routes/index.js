import express from 'express';

// Import router from user-routes.js & parcel-routes.js
import parcelRoutes from './v1/parcel-routes';
import userRoutes from './v1/user-routes';

const router = express.Router();

// Mount a middleware function on the path
router.use('/', parcelRoutes);
router.use('/', userRoutes);

router.get('/', (req, res) => {
  res.send(`Welcome to version1 of SendIT API!!! <br><br>
            Available routes: <br>
            GET  =>  /api/v1/parcels  =>  Fetch all parcel delivery orders <br>
            GET  =>  /api/v1/parcels/:parcelId  =>  Fetch a specific parcel delivery order <br>
            GET  =>  /api/v1/users/:userId/parcels  =>  Fetch all parcel delivery orders by a specific user <br>
            PUT  =>  /api/v1/parcels/:parcelId/cancel  =>  Cancel the specific parcel delivery order <br>
            POST  =>  /api/v1/parcels  =>  Create a parcel delivery order`);
});

// Export router to server.js
export default router;

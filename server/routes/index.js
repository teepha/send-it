import express from 'express';

// Import router from user-routes.js & parcel-routes.js
import parcelRoutes from './parcel-routes';
import userRoutes from './user-routes';

const router = express.Router();

// Mount a middleware function on the path
router.use('/', parcelRoutes);
router.use('/', userRoutes);

router.get('/', (req, res) => {
  res.send(`Welcome to version1 of SendIT API!!! <br><br>
            Available routes: <br>
            POST =>  /auth/signup  =>  Register a user
            POST =>  /auth/login  =>  Login a user
            POST =>  /api/v1/parcels  =>  Create a parcel delivery order
            GET  =>  /api/v1/users/:userId/parcels  =>  Fetch all parcel delivery orders by a specific user <br>
            GET  =>  /api/v1/parcels  =>  Admin Fetch all parcel delivery orders <br>
            GET  =>  /api/v1/parcels/:parcelId  =>  Fetch a specific parcel delivery order <br>
            PUT  =>  /parcels/<parcelId>/destination  =>  User change the location of a specific parcel delivery order
            PUT  =>  /api/v1/parcels/:parcelId/cancel  =>  User cancel a specific parcel delivery order <br>
            PUT  =>  /parcels/<parcelId>/status  => Admin change the status of a specific parcel delivery order
            PUT  =>  /parcels/<parcelId>/presentLocation  => Admin change the Present Location of a specific parcel delivery order`);
});

// Export router to server.js
export default router;

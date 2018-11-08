import express from 'express';

// Import router from user-routes.js & parcel-routes.js
import parcelRoutes from './v1/parcel-routes';
import userRoutes from './v1/user-routes';

const router = express.Router();

// Mount a middleware function on the path
router.use('/', parcelRoutes);
router.use('/', userRoutes);

// Export router to server.js
export default router;

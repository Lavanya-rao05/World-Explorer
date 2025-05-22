import express from 'express';
import { getPlacesByQuery } from '../controllers/placeController.js'; // <-- note the .js extension

const router = express.Router();

router.get('/places', getPlacesByQuery);

export default router;

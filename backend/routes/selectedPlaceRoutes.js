// routes/selectedPlaceRoutes.js
import express from "express";
import { saveUserPlaces } from "../controllers/selectedController.js";

const router = express.Router();

router.post("/", saveUserPlaces);

export default router;

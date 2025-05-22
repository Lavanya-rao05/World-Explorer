import express from "express";
import { getRestaurantsByCity } from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", getRestaurantsByCity); // ✅ final route = /api/restaurants?city=mumbai

export default router;

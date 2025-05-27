import express from "express";
import Selection from "../models/Selection.js"; // Make sure path and extension are correct
import { getLatLonFromGeoapify } from "../controllers/getLatLonFromGeoapify.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, places } = req.body;

    if (!userId || !places || !Array.isArray(places)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // If you want to update previous selection by user instead of always creating new:
    // await Selection.findOneAndUpdate({ userId }, { places }, { upsert: true });

    await Selection.findOneAndUpdate(
      { userId },
      { $set: { places } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Selection saved" });
  } catch (error) {
    console.error("Error saving selection:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// e.g., GET /api/selections/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const selection = await Selection.findOne({ userId: req.params.userId });

    if (!selection) {
      return res.status(404).json({ message: "Selection not found" });
    }

    let updated = false;

    for (const place of selection.places) {
      if (
        (place.category === "restaurant" || place.category === "hotel") &&
        (!place.latitude || !place.longitude)
      ) {
        console.log(`Fetching coordinates for ${place.name}...`);
        try {
          const coords = await getLatLonFromGeoapify(place.name);
          if (coords && coords.latitude && coords.longitude) {
            place.latitude = coords.latitude;
            place.longitude = coords.longitude;
            updated = true;
            console.log(
              `✅ Updated: ${place.name} -> (${coords.latitude}, ${coords.longitude})`
            );
          } else {
            console.warn(`⚠️ No coordinates returned for: ${place.name}`);
          }
        } catch (err) {
          console.error(`❌ Error fetching for ${place.name}:`, err);
        }
      }
    }

    if (updated) {
      await selection.save();
      console.log("✅ Selection updated in DB.");
    } else {
      console.log("ℹ️ No updates made to selection.");
    }

    res.json(selection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

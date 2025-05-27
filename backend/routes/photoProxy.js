import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/places-photo", async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: "Missing photo_reference" });
  }

  try {
    const googlePhotoUrl = "https://maps.googleapis.com/maps/api/place/photo";
    const params = {
      maxwidth: 400,
      photoreference: reference,
      key: process.env.GOOGLE_PLACE_API,
    };

    // Fetch photo as stream
    const response = await axios({
      method: "GET",
      url: googlePhotoUrl,
      params,
      responseType: "stream",
    });

    // Set correct content-type headers and pipe the response stream
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Photo proxy error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
});

export default router;

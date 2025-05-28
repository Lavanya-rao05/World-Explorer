import axios from "axios";
import { categorizePlaces } from "./gemini.js";

export const getPlacesByQuery = async (req, res) => {
  const {
    textQuery,
    latitude,
    longitude,
    radius = "50000",
    languageCode = "en",
    regionCode = "en",
    openNow = "false",
  } = req.query;

  if (!textQuery || !latitude || !longitude) {
    return res.status(400).json({
      error: "Please provide textQuery, latitude, and longitude parameters.",
    });
  }

  const location = `${latitude},${longitude}`;

  const params = new URLSearchParams({
    query: textQuery,
    location,
    radius,
    opennow: openNow,
    language: languageCode,
    region: regionCode,
    key: process.env.GOOGLE_PLACE_API,
  });

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;

  try {
    const response = await axios.get(url);
    const rawPlaces = response.data.results;

    const placeMap = {};
    const simplifiedPlaces = rawPlaces.map((place) => {
      const photoRef = place.photos?.[0]?.photo_reference || null;
      const photoUrl = photoRef
        ? `https://world-explorer-hvpi.onrender.com/media/places-photo?reference=${photoRef}`
        : null;

      placeMap[place.place_id] = {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        photo_url: photoUrl,
      };

      return {
        place_id: place.place_id,
        name: place.name,
        types: place.types,
      };
    });

    const categorizedPlaces = await categorizePlaces(simplifiedPlaces);

    const finalPlaces = categorizedPlaces.map((place) => {
      const rawPlace = rawPlaces.find((p) => p.place_id === place.place_id);
      const location = rawPlace?.geometry?.location || {};
      const meta = placeMap[place.place_id] || {};

      return {
        place_id: place.place_id,
        category: place.category,
        name: meta.name || place.name,
        address: meta.address || "",
        rating: meta.rating || null,
        user_ratings_total: meta.user_ratings_total || 0,
        photo_url: meta.photo_url || null,
        latitude: location.lat || null,
        longitude: location.lng || null,
      };
    });

    res.json({ categorizedPlaces: finalPlaces });
  } catch (error) {
    console.error(
      "[Places Controller Error]",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
};

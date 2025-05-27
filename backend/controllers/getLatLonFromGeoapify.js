// controllers/geoapify.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export const getLatLonFromGeoapify = async (placeName, address = "") => {
  try {
    // Combine name and address if address exists, else just name
    const query = address ? `${placeName}, ${address}` : placeName;

    // Encode query for URL
    const encodedQuery = encodeURIComponent(query);

    // Construct URL with query and API key
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedQuery}&apiKey=${GEOAPIFY_API_KEY}`;

    // Make the request
    const response = await axios.get(url);

    // Check and extract coordinates if available
    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      const coords = response.data.features[0].geometry.coordinates; // [lon, lat]
      return { longitude: coords[0], latitude: coords[1] };
    } else {
      console.warn("⚠️ No geocoding results for:", query);
      return null;
    }
  } catch (error) {
    console.error("❌ Geoapify error:", error.message);
    return null;
  }
};

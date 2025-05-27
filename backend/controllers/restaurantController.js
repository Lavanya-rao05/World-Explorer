import axios from "axios";

export const getRestaurantsByCity = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    // 1. Use Google Geocoding API to get lat/lng for city
    const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: city,
        key: process.env.GOOGLE_PLACE_API,
      },
    });

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return res.status(404).json({ error: "No location found for the city" });
    }

    const location = geoRes.data.results[0].geometry.location;
    const lat = location.lat;
    const lng = location.lng;

    // 2. Use Google Places API to find restaurants near the city lat/lng
    // You can use either Places Nearby Search or Text Search API.
    // Here, we use Nearby Search for restaurants within a 10km radius.
    const placesRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 10000, // 10km radius
          type: "restaurant",
          key: process.env.GOOGLE_PLACE_API,
        },
      }
    );

    if (!placesRes.data.results || placesRes.data.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found in this city" });
    }

    // 3. Format the restaurant data
    const restaurants = placesRes.data.results.map((r) => ({
      name: r.name,
      rating: r.rating || "N/A",
      userRatingsTotal: r.user_ratings_total || 0,
      address: r.vicinity,
      placeId: r.place_id,
      openingHours: r.opening_hours?.open_now !== undefined ? (r.opening_hours.open_now ? "Open" : "Closed") : "Unknown",
      // Google places may have photos array - you can build photo URLs using the photo_reference
      photoUrl:
        r.photos && r.photos.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACE_API}`
          : null,
      
    }));

    res.json({
      city,
      location: { lat, lng },
      restaurants,
    });
  } catch (error) {
    console.error("[Google Places API Error]", error.message);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
};

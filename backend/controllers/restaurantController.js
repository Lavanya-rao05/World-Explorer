import axios from "axios";

export const getRestaurantsByCity = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const placesRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: `restaurants in ${city}`,
          key: process.env.GOOGLE_PLACE_API,
        },
      }
    );

    if (!placesRes.data.results || placesRes.data.results.length === 0) {
      return res
        .status(404)
        .json({ error: "No restaurants found in this city" });
    }

    // 3. Format the restaurant data
    const restaurants = placesRes.data.results.map((r) => {
      const photoRef = r.photos?.[0]?.photo_reference || null;

      return {
        name: r.name,
        rating: r.rating || "N/A",
        userRatingsTotal: r.user_ratings_total || 0,
        address: r.formatted_address || r.vicinity || "N/A",
        placeId: r.place_id,
        location: {
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
        },
        openingHours:
          r.opening_hours?.open_now !== undefined
            ? r.opening_hours.open_now
              ? "Open"
              : "Closed"
            : "Unknown",
        photoUrl: photoRef
          ? `https://world-explorer-hvpi.onrender.com/media/places-photo?reference=${photoRef}`
          : null,
      };
    });

    const firstLocation = placesRes.data.results[0]?.geometry?.location;
    res.json({
      city,
      location: {
        lat: firstLocation?.lat,
        lng: firstLocation?.lng,
      },
      restaurants,
    });
  } catch (error) {
    console.error("[Google Places API Error]", error.message);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
};

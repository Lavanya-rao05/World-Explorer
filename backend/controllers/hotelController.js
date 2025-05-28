import axios from "axios";

export const getHotelsByCity = async (req, res) => {
  const { city, checkIn, checkOut, pageNumber = 1 } = req.query;

  if (!city) {
    return res.status(400).json({ error: "city is required" });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACE_API;
  const RESULTS_PER_PAGE = 24;

  try {
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
    const textSearchRes = await axios.get(textSearchUrl, {
      params: {
        query: `hotels in ${city}`,
        key: GOOGLE_API_KEY,
        // optionally add pagination token if you implement it later
      },
    });

    const allResults = textSearchRes.data.results;

    if (!allResults || allResults.length === 0) {
      return res.status(404).json({ error: "No hotels found for the city" });
    }

    const startIndex = (pageNumber - 1) * RESULTS_PER_PAGE;
    const paginatedHotels = allResults.slice(
      startIndex,
      startIndex + RESULTS_PER_PAGE
    );

    const hotels = paginatedHotels.map((hotel) => {
      const photoRef = hotel.photos?.[0]?.photo_reference || null;
      const proxyPhotoUrl = photoRef
        ? `https://qw3js3n6-5000.inc1.devtunnels.ms/media/places-photo?reference=${photoRef}`
        : null;

      return {
        id: hotel.place_id,
        name: hotel.name,
        address: hotel.formatted_address || hotel.vicinity || "N/A",
        rating: hotel.rating || null,
        priceLevel: hotel.price_level || null,
        types: hotel.types || [],
        location: hotel.geometry?.location || null,
        images: proxyPhotoUrl ? [proxyPhotoUrl] : [],
        bookingUrl: `https://www.google.com/maps/place/?q=place_id:${hotel.place_id}`,
      };
    });

    res.json({
      city,
      pageNumber,
      hotels,
    });
  } catch (error) {
    console.error("[Google Places API Error]", error.message);
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
};

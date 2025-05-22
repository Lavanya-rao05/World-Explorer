import axios from "axios";

export const getHotelsByCity = async (req, res) => {
  const { city, checkIn, checkOut, pageNumber = 1 } = req.query;

  if (!city || !checkIn || !checkOut) {
    return res
      .status(400)
      .json({ error: "city, checkIn, and checkOut are required" });
  }

  const headers = {
    "x-rapidapi-key": process.env.RESTAURANT_API_KEY,
    "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
  };

  try {
    // 1. Search Location to get geoId
    const locationRes = await axios.get(
      "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation",
      {
        headers,
        params: { query: city },
      }
    );

    const locations = locationRes.data.data;
    if (!locations || locations.length === 0) {
      return res.status(404).json({ error: "No locations found for the city" });
    }

    const geoId = locations[0].geoId || locations[0].locationId;

    // 2. Search Hotels using geoId
    const hotelRes = await axios.get(
      "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        headers,
        params: {
          geoId,
          checkIn,
          checkOut,
          pageNumber,
        },
      }
    );

    const hotelsRaw = hotelRes.data.data.data; // Nested data array

    if (!hotelsRaw || hotelsRaw.length === 0) {
      return res
        .status(404)
        .json({ error: "No hotels found for the given parameters" });
    }

    // 3. Map hotel data to simplified response
    const usdToInrRate = 82; // example rate, update as needed

    const hotels = hotelsRaw.map((hotel) => {
      // Extract numeric price from string, e.g., "$208" → 208
      const priceText =
        hotel.priceForDisplay ||
        hotel.commerceInfo?.priceForDisplay?.text ||
        null;
      let priceInInr = null;

      if (priceText) {
        // Remove any non-digit or decimal chars and parse float
        const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        if (!isNaN(priceNumber)) {
          priceInInr = `₹${(priceNumber * usdToInrRate).toFixed(0)}`; // rounded to whole number
        }
      }

      return {
        id: hotel.id,
        name: hotel.title,
        primaryInfo: hotel.primaryInfo || null,
        secondaryInfo: hotel.secondaryInfo || null,
        rating: hotel.bubbleRating?.rating ?? null,
        price: priceInInr,
        details: hotel.commerceInfo?.details?.text || null,
        images: hotel.cardPhotos
          ?.map((photo) =>
            photo.sizes?.urlTemplate
              ? photo.sizes.urlTemplate
                  .replace("{width}", "500")
                  .replace("{height}", "300")
              : null
          )
          .filter(Boolean),
        bookingUrl: hotel.commerceInfo?.externalUrl || null,
        isSponsored: hotel.isSponsored || false,
      };
    });

    res.json({
      city,
      geoId,
      checkIn,
      checkOut,
      pageNumber,
      hotels,
    });
  } catch (error) {
    console.error("[TripAdvisor Hotel API Error]", error.message);
    res.status(500).json({ error: "Failed to fetch hotel data" });
  }
};

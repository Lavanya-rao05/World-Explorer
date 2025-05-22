import axios from "axios";

export const getRestaurantsByCity = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const headers = {
    "x-rapidapi-key": process.env.RESTAURANT_API_KEY,
    "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
  };

  try {
    const locationRes = await axios.get(
      "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation",
      {
        headers,
        params: { query: city },
      }
    );

    const locations = locationRes.data.data;
    if (!locations || locations.length === 0) {
      return res.status(404).json({ error: "No locations found for the city" });
    }

    const locationId = locations[0].locationId;

    const restaurantRes = await axios.get(
      "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants",
      {
        headers,
        params: { locationId },
      }
    );

    const restaurants = restaurantRes.data.data.data; // <-- Fix here

    const filteredRestaurants = restaurants.map((r) => ({
      name: r.name,
      rating: r.averageRating,
      reviews: r.userReviewCount,
      cuisines: r.establishmentTypeAndCuisineTags,
      price: r.priceTag,
      image: r.heroImgUrl || r.squareImgUrl,
      isOpen: r.currentOpenStatusText,
      reviewSnippets: r.reviewSnippets?.reviewSnippetsList?.map((s) => ({
        text: s.reviewText,
        url: s.reviewUrl,
      })),
    }));

    res.json({
      city,
      locationId,
      restaurants: filteredRestaurants,
    });
  } catch (error) {
    console.error("[TripAdvisor API Error]", error.message);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
};

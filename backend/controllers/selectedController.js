import SelectedPlace from "../models/SelectedPlaces.js";

export const saveUserPlaces = async (req, res) => {
  const { userId, places, selectedRestaurants = [], selectedHotels = [] } = req.body;

  if (!userId || !Array.isArray(places)) {
    return res.status(400).json({ error: "userId and places array are required" });
  }

  const optionalPlaces = [
    ...selectedRestaurants.map((r) => ({
      place_id: r.place_id || r.name,
      name: r.name,
      category: "restaurant",
      address: r.address || "",
      rating: r.rating || r.averageRating,
      user_ratings_total: r.user_ratings_total || r.userReviewCount || 0,
      photo_url: r.photo_url || r.heroImgUrl || r.squareImgUrl || "",
      optional: true
    })),
    ...selectedHotels.map((h) => ({
      place_id: h.place_id || h.id,
      name: h.name || h.title,
      category: "hotel",
      address: h.address || h.secondaryInfo || "",
      rating: h.rating || h.bubbleRating?.rating || null,
      user_ratings_total: h.user_ratings_total || 0,
      photo_url: h.photo_url || (h.images && h.images[0]) || "",
      optional: true
    }))
  ];

  const fullPlaces = [...places, ...optionalPlaces];

  try {
    const saved = await SelectedPlace.findOneAndUpdate(
      { userId },
      { places: fullPlaces, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Places saved successfully", data: saved });
  } catch (error) {
    console.error("Error saving places:", error.message);
    res.status(500).json({ error: "Failed to save selected places" });
  }
};

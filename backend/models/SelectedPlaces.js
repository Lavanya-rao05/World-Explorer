// models/SelectedPlace.js
import mongoose from "mongoose";

const SelectedPlaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  places: [
    {
      place_id: String,
      name: String,
      category: String, // e.g., temple, attraction, restaurant, hotel
      address: String,
      rating: Number,
      user_ratings_total: Number,
      photo_url: String,
      optional: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SelectedPlace", SelectedPlaceSchema);

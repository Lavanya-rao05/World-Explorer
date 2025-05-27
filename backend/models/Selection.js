import mongoose from "mongoose";
const selectionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // or ObjectId if you have auth
  places: [
    {
      name: String,
      address: String,
      latitude: Number,
      longitude: Number,
      category: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Selection', selectionSchema);

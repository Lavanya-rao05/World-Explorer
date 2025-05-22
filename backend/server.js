import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js'
import hotelRoutes from "./routes/hotelRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api', placeRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/hotels', hotelRoutes);

app.get("/",(req,res)=>{
  res.send("Welcome to world explorer")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

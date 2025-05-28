import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'

import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js'
import hotelRoutes from "./routes/hotelRoutes.js";
import photoProxy from "./routes/photoProxy.js";
import selectionsRouter  from './routes/selectedPlaceRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://qw3js3n6-5173.inc1.devtunnels.ms',
  'https://worldexplorer-umber.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api', placeRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/hotels', hotelRoutes);
// app.use("/api/user-places", selectedPlaceRoutes);
app.use("/media", photoProxy);
app.use('/api/selections', selectionsRouter);


app.get("/",(req,res)=>{
  res.send("Welcome to world explorer")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

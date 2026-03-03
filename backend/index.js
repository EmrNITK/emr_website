import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Initialize App
const app = express();
const PORT = process.env.PORT || 3000;

// Database
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  "https://app.unibrik.com",
  "https://app2.unibrik.com"
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

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();

// Connecter à MongoDB
connectDB();

app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

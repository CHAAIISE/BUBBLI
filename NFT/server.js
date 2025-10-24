require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const nftRoutes = require('./routes/nftRoutes');

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// DATABASE CONNECTION
// =====================
connectDB();

// =====================
// ROUTES
// =====================
app.use('/api', nftRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Mood NFT Backend Server Running    ║
╠════════════════════════════════════════╣
║  📍 URL: http://localhost:${PORT}         ║
║  🏠 Health: http://localhost:${PORT}/health║
║  📊 API: http://localhost:${PORT}/api     ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}          ║
╚════════════════════════════════════════╝
  `);
});

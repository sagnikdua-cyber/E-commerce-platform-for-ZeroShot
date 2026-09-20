const mongoose = require('mongoose');

// Cached connection for Vercel Serverless environment
let isConnected = false;
let app = null;

module.exports = async (req, res) => {
  // Return debug info on /api/debug
  if (req.url === '/api/debug') {
    return res.status(200).json({
      hasMongoUri: !!process.env.MONGO_URI,
      mongoUriStart: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      isConnected,
      mongoState: mongoose.connection.readyState,
    });
  }

  // Lazy-load express app to catch require errors
  if (!app) {
    try {
      app = require('../server/app');
    } catch (err) {
      return res.status(500).json({ message: 'Failed to load Express app', error: err.message });
    }
  }

  if (!isConnected) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      isConnected = true;
      console.log('MongoDB connected for serverless function');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      res.status(500).json({ message: 'Database connection failed', error: error.message });
      return;
    }
  }

  // Forward to Express app
  return app(req, res);
};

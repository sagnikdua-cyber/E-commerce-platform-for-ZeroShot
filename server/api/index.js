const app = require('../app');
const mongoose = require('mongoose');

// Cached connection for Vercel Serverless environment
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      isConnected = true;
      console.log('MongoDB connected for serverless function');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      res.status(500).json({ message: 'Database connection failed' });
      return;
    }
  }
  
  // Forward to Express app
  return app(req, res);
};

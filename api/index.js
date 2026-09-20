const mongoose = require('mongoose');
const { parse } = require('url');

let isConnected = false;
let app = null;

module.exports = async (req, res) => {
  // Lazy-load Express app
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
    } catch (error) {
      return res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
  }

  return app(req, res);
};

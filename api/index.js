const mongoose = require('mongoose');

let isConnected = false;
let app = null;

module.exports = async (req, res) => {
  // Vercel rewrites /api/:path* → /api/index.js?path=...
  // We must reconstruct the original URL so Express can route correctly
  if (req.query && req.query.path) {
    const pathParts = Array.isArray(req.query.path)
      ? req.query.path.join('/')
      : req.query.path;
    const { path: _, ...restQuery } = req.query;
    const queryString = new URLSearchParams(restQuery).toString();
    req.url = `/api/${pathParts}${queryString ? '?' + queryString : ''}`;
  }

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

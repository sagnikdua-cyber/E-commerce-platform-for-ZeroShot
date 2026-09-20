import { createRequire } from 'module';
import { connect, connection } from 'mongoose';

const require = createRequire(import.meta.url);
const app = require('../server/app');

// Cached connection for Vercel Serverless environment
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      if (connection.readyState !== 1) {
        await connect(process.env.MONGO_URI);
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
}

// Shared DB connection and models for Vercel serverless functions
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  brand: String,
  image: String,
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) { isConnected = true; return; }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = { connectDB, Product };

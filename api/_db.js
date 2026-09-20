// Shared DB connection and Product model for Vercel serverless functions
// Schema matches server/models/Product.js exactly
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Transform _id to id in JSON output — matches original server model
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) { isConnected = true; return; }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = { connectDB, Product };

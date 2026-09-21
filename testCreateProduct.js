const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });
const Product = require('./server/models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const productData = {
      name: 'Test Product',
      price: 10,
      stock: 5,
      rating: 4,
      description: 'Test description',
      category: 'Test Category',
      brand: 'Test Brand',
      sku: 'TEST-SKU-1234',
      image: 'http://example.com/image.png'
    };
    const product = new Product(productData);
    await product.save();
    console.log('Product created successfully');
    
    // Clean up
    await Product.deleteOne({ sku: 'TEST-SKU-1234' });
    process.exit(0);
  } catch (err) {
    console.error('Error creating product:', err);
    process.exit(1);
  }
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({ image: { $regex: '\\.jpg$' } });
    console.log(`Found ${products.length} products with .jpg images`);
    
    for (const p of products) {
      if (p.image.startsWith('/products/')) {
        p.image = p.image.replace('.jpg', '.png');
        await p.save();
        console.log(`Updated ${p.name} to ${p.image}`);
      }
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixImages();

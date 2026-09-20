require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  {
    sku: 'DEMO-001',
    image: '/products/1.jpg',
    name: "Men's White & Green Casual Sneakers",
    price: 35.00,
    currency: 'USD',
    stock: 120,
    rating: 4.4,
    category: 'Footwear',
    brand: "Men's Fashion",
    description: 'Stylish and comfortable low-top casual sneakers featuring a clean white base with sleek grey and green accents, designed for everyday wear.',
  },
  {
    sku: 'DEMO-002',
    image: '/products/2.png',
    name: "Indie Flavors All-in-One Mixture",
    price: 3.50,
    currency: 'USD',
    stock: 250,
    rating: 4.6,
    category: 'Groceries & Snacks',
    brand: 'Indie Flavors',
    description: 'A crunchy and authentic Indian namkeen snack mix packed with traditional spices and savory ingredients for a flavorful treat.',
  },
  {
    sku: 'DEMO-003',
    image: '/products/3.png',
    name: "Ghar Soaps Magic Face Wash (Saffron & Lactic Acid)",
    price: 6.00,
    currency: 'USD',
    stock: 180,
    rating: 4.7,
    category: 'Beauty & Personal Care',
    brand: 'Ghar Soaps',
    description: 'Ayurvedic science face wash infused with saffron and encapsulated lactic acid to help reduce tanning, brighten dull skin, and improve overall texture. Suitable for all skin types.',
  },
  {
    sku: 'DEMO-004',
    image: '/products/4.png',
    name: "OnePlus Smartphone (Green)",
    price: 699.00,
    currency: 'USD',
    stock: 45,
    rating: 4.8,
    category: 'Electronics',
    brand: 'OnePlus',
    description: 'Sleek modern smartphone featuring a dual-camera system, a vibrant bezel-less display with a centered punch-hole camera, and an elegant dark green matte finish.',
  },
  {
    sku: 'DEMO-005',
    image: '/products/5.png',
    name: "Casio Vintage Digital Watch",
    price: 29.99,
    currency: 'USD',
    stock: 90,
    rating: 4.5,
    category: 'Watches',
    brand: 'Casio',
    description: 'Classic retro-style digital watch featuring a stainless steel strap, digital display with alarm, chronograph, and water-resistant build.',
  },
  {
    sku: 'DEMO-006',
    image: '/products/6.png',
    name: "Purple Travel Duffle Bag with Wheels",
    price: 45.00,
    currency: 'USD',
    stock: 85,
    rating: 4.6,
    category: 'Luggage & Travel Gear',
    brand: 'Travel Gear',
    description: 'Spacious rolling travel duffle bag in a rich purple shade featuring smooth-glide wheels, sturdy top handles, an adjustable shoulder strap, and multiple exterior zip pockets for convenient packing.',
  },
  {
    sku: 'DEMO-007',
    image: '/products/7.png',
    name: "Men's White Wide-Leg Denim Jeans",
    price: 38.00,
    currency: 'USD',
    stock: 110,
    rating: 4.4,
    category: 'Apparel',
    brand: "Men's Fashion",
    description: 'Trendy, relaxed-fit wide-leg denim jeans in a clean white color, offering a contemporary streetwear look and comfortable everyday wear.',
  },
  {
    sku: 'DEMO-008',
    image: '/products/8.jpg',
    name: "Prestlee Stainless Steel Water Bottles (2-Pack)",
    price: 22.00,
    currency: 'USD',
    stock: 140,
    rating: 4.7,
    category: 'Home & Kitchen',
    brand: 'Prestlee',
    description: 'Sleek metallic stainless steel water bottles featuring the Prestlee brand logo, secure caps with carrying straps, and an ergonomic silhouette suitable for office or outdoor use.',
  },
  {
    sku: 'DEMO-009',
    image: '/products/9.jpg',
    name: "CUBE Aerosol Lacquer Spray Paint (Matte Black)",
    price: 8.50,
    currency: 'USD',
    stock: 300,
    rating: 4.5,
    category: 'Tools & Home Improvement',
    brand: 'CUBE',
    description: 'High-quality acrylic lacquer spray paint in a versatile matte black finish, ideal for DIY crafts, touch-ups, and protective coating on various surfaces.',
  },
  {
    sku: 'DEMO-010',
    image: '/products/10.jpg',
    name: "Blue Floral Ceramic Serving Tray Set (3-Piece)",
    price: 32.00,
    currency: 'USD',
    stock: 65,
    rating: 4.8,
    category: 'Home & Kitchen',
    brand: 'Home Decor',
    description: 'Elegant nested set of ceramic serving trays featuring charming blue floral and sunflower artwork with integrated handles, perfect for serving guests or home decor.',
  },
  {
    sku: 'DEMO-011',
    image: '/products/11.png',
    name: "Portronics Wireless Over-Ear Headphones",
    price: 49.99,
    currency: 'USD',
    stock: 95,
    rating: 4.6,
    category: 'Electronics / Audio',
    brand: 'Portronics',
    description: 'Ergonomic black over-ear wireless headphones featuring plush cushioned ear cups, a flexible headband, and clear acoustic sound for immersive listening.',
  },
  {
    sku: 'DEMO-012',
    image: '/products/12.png',
    name: "Triggr Gaming True Wireless Earbuds",
    price: 39.99,
    currency: 'USD',
    stock: 120,
    rating: 4.5,
    category: 'Electronics / Audio',
    brand: 'Triggr',
    description: 'Unique sci-fi warrior-inspired black and gold TWS gaming earbuds featuring striking LED lighting effects and low-latency performance for gamers.',
  },
  {
    sku: 'DEMO-013',
    image: '/products/13.png',
    name: "Men's Mustard Formal/Casual Shirt",
    price: 24.50,
    currency: 'USD',
    stock: 150,
    rating: 4.3,
    category: 'Apparel',
    brand: "Men's Clothing",
    description: 'Premium long-sleeve button-down shirt in a rich mustard color, tailored for a sharp, smart-casual look.',
  },
  {
    sku: 'DEMO-014',
    image: '/products/14.png',
    name: "Parle-G Gold Biscuits (1 kg)",
    price: 2.50,
    currency: 'USD',
    stock: 500,
    rating: 4.9,
    category: 'Groceries & Snacks',
    brand: 'Parle',
    description: 'Large economy pack of nourishing glucose biscuits enriched with milk and wheat, offering a delicious and crunchy taste.',
  },
  {
    sku: 'DEMO-015',
    image: '/products/15.png',
    name: "Zyko Tomato Makhana (Roasted Fox Nuts)",
    price: 4.00,
    currency: 'USD',
    stock: 210,
    rating: 4.4,
    category: 'Groceries & Healthy Snacks',
    brand: 'Zyko',
    description: 'Healthy, gluten-free roasted fox nuts flavored with tangy tomato seasoning, rich in protein and calcium.',
  },
  {
    sku: 'DEMO-016',
    image: '/products/16.png',
    name: "RC Remote Control Sports Car (Black & Red)",
    price: 19.99,
    currency: 'USD',
    stock: 75,
    rating: 4.2,
    category: 'Toys & Games',
    brand: 'Remote Control Toys',
    description: 'Sleek aerodynamic remote-controlled toy sports car in black and red, complete with a handheld controller, rechargeable battery, and USB charging cable.',
  },
  {
    sku: 'DEMO-017',
    image: '/products/17.png',
    name: "5-Tier Slim Rolling Storage Cart",
    price: 28.00,
    currency: 'USD',
    stock: 60,
    rating: 4.5,
    category: 'Home & Kitchen',
    brand: 'Storage & Organization',
    description: 'Space-saving utility organizer cart featuring five tier baskets and smooth-rolling wheels, ideal for kitchens, bathrooms, or tight spaces.',
  },
  {
    sku: 'DEMO-018',
    image: '/products/18.png',
    name: "Women's Embroidered Velvet Mule Slippers",
    price: 26.00,
    currency: 'USD',
    stock: 70,
    rating: 4.3,
    category: 'Footwear',
    brand: "Women's Fashion",
    description: 'Luxurious black velvet slip-on mules adorned with colorful floral embroidery and subtle sequin detailing for an ethnic yet modern casual look.',
  },
  {
    sku: 'DEMO-019',
    image: '/products/19.png',
    name: "Cadbury Oreo Golden Vanilla Sandwich Biscuits (Family Pack)",
    price: 4.50,
    currency: 'USD',
    stock: 400,
    rating: 4.8,
    category: 'Groceries & Snacks',
    brand: 'Cadbury Oreo',
    description: 'Delicious golden vanilla-flavored cookie biscuits filled with smooth, creamy vanilla creme in a convenient 3x family pack.',
  },
  {
    sku: 'DEMO-020',
    image: '/products/20.png',
    name: "Indie Flavors Chana Jor Garam",
    price: 3.00,
    currency: 'USD',
    stock: 220,
    rating: 4.4,
    category: 'Groceries & Snacks',
    brand: 'Indie Flavors',
    description: 'Spicy and crunchy flattened chickpea snack seasoned with authentic Indian spices, offering a protein-rich traditional treat.',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    let createdCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Find if product with this SKU already exists
      const existingProduct = await Product.findOne({ sku: product.sku });
      
      if (!existingProduct) {
        // Only insert if it doesn't exist, preventing overwrite of owner changes
        await Product.create(product);
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`Seeding complete. Created: ${createdCount}, Skipped: ${skippedCount}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

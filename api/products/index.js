const { connectDB, Product } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try { await connectDB(); }
  catch (err) { return res.status(500).json({ message: 'DB connection failed', error: err.message }); }

  if (req.method === 'GET') {
    try {
      const { category, brand, search, sort, inStock } = req.query;
      let filter = {};
      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (inStock === 'true') filter.countInStock = { $gt: 0 };
      if (search) filter.name = { $regex: search, $options: 'i' };

      let sortObj = {};
      if (sort === 'price_asc') sortObj = { price: 1 };
      else if (sort === 'price_desc') sortObj = { price: -1 };
      else if (sort === 'rating_desc') sortObj = { rating: -1 };

      // Return plain array to match original API format
      const products = await Product.find(filter).sort(sortObj);
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  if (req.method === 'POST') {
    const jwt = require('jsonwebtoken');
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
    try { jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET); }
    catch { return res.status(401).json({ message: 'Token invalid' }); }
    try {
      const product = new Product(req.body);
      const saved = await product.save();
      return res.status(201).json(saved);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
};

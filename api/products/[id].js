const { connectDB, Product } = require('../_db');
const jwt = require('jsonwebtoken');

function verifyAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) throw new Error('Not authorized');
  jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try { await connectDB(); }
  catch (err) { return res.status(500).json({ message: 'DB error', error: err.message }); }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch (err) { return res.status(500).json({ message: err.message }); }
  }

  if (req.method === 'PUT') {
    try { verifyAuth(req); } catch { return res.status(401).json({ message: 'Not authorized' }); }
    try {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.json(product);
    } catch (err) { return res.status(500).json({ message: err.message }); }
  }

  if (req.method === 'DELETE') {
    try { verifyAuth(req); } catch { return res.status(401).json({ message: 'Not authorized' }); }
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ message: 'Not found' });
      return res.json({ message: 'Product removed' });
    } catch (err) { return res.status(500).json({ message: err.message }); }
  }

  res.status(405).json({ message: 'Method not allowed' });
};

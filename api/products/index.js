// Simple diagnostic - no DB
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  return res.status(200).json({ 
    products: [{ _id: 'test123', name: 'Test Product', price: 9.99, image: '', category: 'Groceries', brand: 'Test', countInStock: 10, rating: 4.5, numReviews: 1 }], 
    total: 1, page: 1, pages: 1 
  });
};

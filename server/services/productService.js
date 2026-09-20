const Product = require('../models/Product');

const getProducts = async (query = {}) => {
  const { search, category, brand, inStock, lowStock, sort } = query;
  
  let filter = {};
  
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (brand) {
    filter.brand = brand;
  }
  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  }
  if (lowStock === 'true') {
    filter.stock = { $gt: 0, $lte: 10 };
  }
  
  let sortObj = {};
  if (sort === 'price_asc') sortObj.price = 1;
  else if (sort === 'price_desc') sortObj.price = -1;
  else if (sort === 'rating_desc') sortObj.rating = -1;
  else if (sort === 'newest') sortObj.createdAt = -1;
  
  return await Product.find(filter).sort(sortObj);
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    return true;
  }
  return false;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

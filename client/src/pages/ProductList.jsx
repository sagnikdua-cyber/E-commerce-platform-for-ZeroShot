import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import productService from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const inStock = searchParams.get('inStock') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (sort) params.sort = sort;
        if (inStock) params.inStock = inStock;

        const data = await productService.getProducts(params);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, brand, sort, inStock]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">All Products</h1>
        
        <div className="flex flex-wrap gap-4">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="px-4 py-2 border rounded-md"
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
          />
          
          <select 
            className="px-4 py-2 border rounded-md"
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Footwear">Footwear</option>
            <option value="Groceries & Snacks">Groceries & Snacks</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
            <option value="Electronics">Electronics</option>
            <option value="Watches">Watches</option>
            <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
            <option value="Apparel">Apparel</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Tools & Home Improvement">Tools & Home Improvement</option>
            <option value="Toys & Games">Toys & Games</option>
          </select>
          
          <select 
            className="px-4 py-2 border rounded-md"
            value={brand}
            onChange={(e) => updateParam('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            <option value="Men's Fashion">Men's Fashion</option>
            <option value="Women's Fashion">Women's Fashion</option>
            <option value="TechGear">TechGear</option>
            <option value="OutdoorPro">OutdoorPro</option>
          </select>

          <select 
            className="px-4 py-2 border rounded-md"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>

          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={inStock === 'true'}
              onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} />
      ) : products.length === 0 ? (
        <EmptyState message="No products match your filters." />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default ProductList;

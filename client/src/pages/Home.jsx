import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import productService from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
        setLoading(false);
      } catch (err) {
        setError("Failed to load featured products.");
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      <Hero />
      <CategorySection />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>
    </div>
  );
};

export default Home;

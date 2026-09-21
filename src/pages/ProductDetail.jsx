import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found.");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
  if (error || !product) return <div className="pt-24"><ErrorState message={error || "Product not found"} /></div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
          {/* Product image */}
          <div className="mt-10 lg:mt-0 lg:row-span-2 lg:self-center bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-8 min-h-[400px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3 flex items-center justify-between">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
              
              <div className="ml-4 flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${
                        product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900 mr-2">Brand:</span> {product.brand}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900 mr-2">Category:</span> {product.category}
              </div>
              {product.dimensions && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900 mr-2">Dimensions:</span> {product.dimensions}
                </div>
              )}
              {product.weight && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900 mr-2">Weight:</span> {product.weight} kg
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-gray-900 mr-2">Availability:</span> 
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="mt-10 flex sm:flex-col1">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

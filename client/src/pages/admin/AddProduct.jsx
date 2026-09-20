import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import productService from '../../services/productService';

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.createProduct(productData);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/admin/products" className="text-gray-500 hover:text-gray-700 mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddProduct;

import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            <Link to={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          {(product.dimensions || product.weight) && (
            <div className="text-xs text-gray-400 space-y-1">
              {product.dimensions && <p>Dimensions: {product.dimensions}</p>}
              {product.weight && <p>Weight: {product.weight} kg</p>}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

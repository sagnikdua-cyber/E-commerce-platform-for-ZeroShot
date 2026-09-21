import { useState, useEffect, useRef } from 'react';
import productService from '../../services/productService';

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    stock: '',
    rating: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    image: '',
    dimensions: '',
    weight: '',
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        currency: initialData.currency || 'USD',
        stock: initialData.stock || '',
        rating: initialData.rating || '',
        description: initialData.description || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        sku: initialData.sku || '',
        image: initialData.image || '',
        dimensions: initialData.dimensions || '',
        weight: initialData.weight || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.price === '' || Number(formData.price) < 0) newErrors.price = 'Price must be 0 or greater';
    if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stock must be 0 or greater';
    if (formData.rating === '' || Number(formData.rating) < 0 || Number(formData.rating) > 5) newErrors.rating = 'Rating must be between 0 and 5';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.image.trim()) newErrors.image = 'Image path/URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    try {
      setIsUploading(true);
      setErrors(prev => ({ ...prev, image: null }));
      const data = await productService.uploadImage(file);
      setFormData(prev => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      setErrors(prev => ({ ...prev, image: 'Image upload failed: ' + err.message }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        rating: Number(formData.rating),
        weight: formData.weight !== '' ? Number(formData.weight) : undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
          <div className="mt-1">
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU *</label>
          <div className="mt-1">
            <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.sku && <p className="mt-2 text-sm text-red-600">{errors.sku}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input type="number" step="0.01" name="price" id="price" value={formData.price} onChange={handleChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock *</label>
          <div className="mt-1">
            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5) *</label>
          <div className="mt-1">
            <input type="number" step="0.1" min="0" max="5" name="rating" id="rating" value={formData.rating} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <div className="mt-1">
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <div className="mt-1">
            <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensions (Size)</label>
          <div className="mt-1">
            <input type="text" name="dimensions" id="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g. 10x20x5 cm"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <div className="mt-1">
            <input type="number" step="0.01" min="0" name="weight" id="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 1.5"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">Product Image *</label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.image && (
              <div className="flex-shrink-0 h-24 w-24 border rounded-md overflow-hidden bg-gray-100">
                <img src={formData.image} alt="Preview" className="h-24 w-24 object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} placeholder="Image URL or relative path (e.g. /products/1.jpg)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button 
                type="button" 
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isUploading ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Uploading...
                   </span>
                ) : 'Upload Image File'}
              </button>
            </div>
          </div>
          {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
          <div className="mt-1">
            <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
          </div>
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

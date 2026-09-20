const API_URL = (import.meta.env.VITE_API_URL || '/api') + '/products';

const getAuthHeaders = () => {
  const storedData = localStorage.getItem('adminToken');
  if (storedData) {
    const { token } = JSON.parse(storedData);
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

const getAuthHeadersForm = () => {
  const storedData = localStorage.getItem('adminToken');
  if (storedData) {
    const { token } = JSON.parse(storedData);
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

// Public
export const getProducts = async (params = {}) => {
  const queryStr = new URLSearchParams(params).toString();
  const url = queryStr ? `${API_URL}?${queryStr}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

// Public
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

// Protected Admin
export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create product');
  return data;
};

// Protected Admin
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update product');
  return data;
};

// Protected Admin
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete product');
  }
  return true;
};

// Protected Admin
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const UPLOAD_URL = (import.meta.env.VITE_API_URL || '/api') + '/upload';
  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: getAuthHeadersForm(),
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to upload image');
  return data;
};

// Public
export const getFeaturedProducts = async () => {
  const data = await getProducts({ sort: 'rating_desc' });
  return data.slice(0, 4);
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getFeaturedProducts,
};

export default productService;

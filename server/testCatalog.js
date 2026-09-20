const http = require('http');

const runTest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runAllTests = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    let res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'admin@shopnexus.com', password: 'admin123' });
    const token = res.data.token;
    if (!token) throw new Error('Login failed');
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // 2. Add Product
    console.log('\nAdding product...');
    const newProduct = {
      name: 'Test Product',
      price: 10.99,
      currency: 'USD',
      stock: 100,
      rating: 4.5,
      description: 'A test product',
      category: 'Test',
      brand: 'Tester',
      sku: 'TEST-001',
      image: '/test.jpg'
    };
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: authHeaders }, newProduct);
    console.log('Add product status:', res.status);
    const productId = res.data.id;

    // 3. Duplicate SKU
    console.log('\nTesting duplicate SKU...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: authHeaders }, newProduct);
    console.log('Duplicate SKU status:', res.status, res.data.message);

    // 4. Invalid Data (Empty name, invalid price/stock)
    console.log('\nTesting invalid data...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: authHeaders }, {
      ...newProduct, name: '', price: -5, stock: -10, rating: 6, sku: 'TEST-002'
    });
    console.log('Invalid data status:', res.status, res.data.message);

    if (productId) {
      // 5. Edit Product
      console.log('\nEditing product...');
      res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'PUT', headers: authHeaders }, { ...newProduct, price: 15.99 });
      console.log('Edit product status:', res.status, 'New Price:', res.data.price);

      // 6. Delete Product
      console.log('\nDeleting product...');
      res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'DELETE', headers: authHeaders });
      console.log('Delete product status:', res.status, res.data.message);
    }

  } catch (err) {
    console.error(err);
  }
};

runAllTests();

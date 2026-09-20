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

const runE2E = async () => {
  try {
    console.log('--- STARTING E2E CATALOG TEST ---');

    // 1. Login Admin
    console.log('\n[Admin] Logging in...');
    let res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'admin@shopnexus.com', password: 'admin123' });
    const token = res.data.token;
    if (!token) throw new Error('Login failed');
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // 2. Customer sees initial catalog
    console.log('\n[Customer] Fetching catalog...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    const initialCount = res.data.length;
    console.log('Initial catalog size:', initialCount);

    // 3. Admin creates product
    console.log('\nTEST 1: Admin creating product...');
    const newProduct = {
      name: 'E2E Test Product 3', price: 99.99, currency: 'USD', stock: 50, rating: 5,
      description: 'E2E testing description', category: 'Testing', brand: 'QA', sku: 'E2E-003', image: '/e2e-test.jpg'
    };
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: authHeaders }, newProduct);
    console.log('API Response:', res.data);
    const productId = res.data._id || res.data.id;
    console.log('Admin created product ID:', productId);

    // 4. Customer verifies product
    console.log('\nTEST 1: Customer verifying product appears...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    let found = res.data.find(p => p.id === productId || p._id === productId);
    console.log('Customer sees new product in list?', !!found);

    // 5. Admin edits price, stock, image
    console.log('\nTEST 4/5/6: Admin edits price, stock, and image...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'PUT', headers: authHeaders }, {
      ...newProduct, price: 149.99, stock: 25, image: '/e2e-updated.jpg'
    });
    console.log('Admin updated product. Status:', res.status);

    // 6. Customer fetches specific product details
    console.log('\nTEST 2/4/5/6: Customer fetching updated product details...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'GET' });
    console.log('Customer sees new price:', res.data.price === 149.99 ? 'YES (149.99)' : 'NO');
    console.log('Customer sees new stock:', res.data.stock === 25 ? 'YES (25)' : 'NO');
    console.log('Customer sees new image:', res.data.image === '/e2e-updated.jpg' ? 'YES' : 'NO');

    // 7. Admin deletes product
    console.log('\nTEST 3: Admin deleting product...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'DELETE', headers: authHeaders });
    console.log('Admin deleted product. Status:', res.status);

    // 8. Customer verifies product is gone
    console.log('\nTEST 3: Customer verifying product disappeared...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    found = res.data.find(p => p.id === productId || p._id === productId);
    console.log('Customer sees deleted product in list?', !!found);

    res = await runTest({ hostname: 'localhost', port: 5000, path: `/api/products/${productId}`, method: 'GET' });
    console.log('Customer fetches deleted product. Status:', res.status, res.data.message);

    console.log('\n--- E2E TEST COMPLETE ---');
  } catch (err) {
    console.error(err);
  }
};

runE2E();

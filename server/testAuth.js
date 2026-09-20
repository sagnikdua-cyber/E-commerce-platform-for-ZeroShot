const http = require('http');

const runTest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
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
    // 1. Invalid Login
    console.log('Testing invalid login...');
    let res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'admin@shopnexus.com', password: 'wrong' });
    console.log('Invalid login status:', res.status);

    // 2. Valid Login
    console.log('\nTesting valid login...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'admin@shopnexus.com', password: 'admin123' });
    const token = JSON.parse(res.data).token;
    console.log('Valid login status:', res.status, !!token ? '(Token received)' : '(No token)');

    // 3. Protected Route (No token)
    console.log('\nTesting protected route without token...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { name: 'Test' });
    console.log('No token status:', res.status);

    // 4. Protected Route (Invalid token)
    console.log('\nTesting protected route with invalid token...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer invalidtoken' } }, { name: 'Test' });
    console.log('Invalid token status:', res.status);

    // 5. Protected Route (Valid token)
    console.log('\nTesting protected route with valid token...');
    // We expect validation error (400) instead of 401
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }, { name: 'Test' });
    console.log('Valid token status (expect 400 validation error):', res.status);

  } catch (err) {
    console.error(err);
  }
};

runAllTests();

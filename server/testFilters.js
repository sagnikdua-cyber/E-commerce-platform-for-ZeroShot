const http = require('http');

const runTest = (options) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    req.end();
  });
};

const runFilterTest = async () => {
  try {
    console.log('--- STARTING FILTER TEST ---');

    // TEST: Search
    console.log('\n[Customer] Searching for "Sneakers"...');
    let res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?search=Sneakers', method: 'GET' });
    console.log('Results length:', res.data.length);
    if (res.data.length > 0) console.log('First result:', res.data[0].name);

    // TEST: Category
    console.log('\n[Customer] Filtering by category "Footwear"...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?category=Footwear', method: 'GET' });
    console.log('Results length:', res.data.length);

    // TEST: Brand
    console.log('\n[Customer] Filtering by brand "TechGear"...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?brand=TechGear', method: 'GET' });
    console.log('Results length:', res.data.length);

    // TEST: Price sorting (asc)
    console.log('\n[Customer] Sorting by price ASC...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?sort=price_asc', method: 'GET' });
    console.log('First result price:', res.data[0].price);
    console.log('Last result price:', res.data[res.data.length - 1].price);

    // TEST: Rating sorting (desc)
    console.log('\n[Customer] Sorting by rating DESC...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?sort=rating_desc', method: 'GET' });
    console.log('First result rating:', res.data[0].rating);
    console.log('Last result rating:', res.data[res.data.length - 1].rating);

    // TEST: Empty results
    console.log('\n[Customer] Searching for a non-existent item...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?search=NonExistentItem12345', method: 'GET' });
    console.log('Empty result handled? (Length = 0):', res.data.length === 0);

    // TEST: Low Stock
    console.log('\n[Owner] Filtering by Low Stock (<=10)...');
    res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/products?lowStock=true', method: 'GET' });
    console.log('Results length:', res.data.length);
    if (res.data.length > 0) console.log('First low stock item stock:', res.data[0].stock);

    console.log('\n--- FILTER TEST COMPLETE ---');
  } catch (err) {
    console.error(err);
  }
};

runFilterTest();

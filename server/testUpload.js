const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const runTest = (options, body = null, isFormData = false, boundary = '') => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    
    if (isFormData && body) {
      req.write(body);
    } else if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runUploadTest = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    let res = await runTest({ hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, { email: 'admin@shopnexus.com', password: 'admin123' });
    const token = res.data.token;
    if (!token) throw new Error('Login failed');

    // 2. Upload valid image
    console.log('\nTesting valid image upload...');
    const imagePath = path.join(__dirname, '../client/public/products/1.png');
    if (fs.existsSync(imagePath)) {
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const fileBuffer = fs.readFileSync(imagePath);
      
      let payload = `--${boundary}\r\n`;
      payload += `Content-Disposition: form-data; name="image"; filename="1.png"\r\n`;
      payload += `Content-Type: image/png\r\n\r\n`;
      
      const footer = `\r\n--${boundary}--`;
      
      const reqBuffer = Buffer.concat([
        Buffer.from(payload),
        fileBuffer,
        Buffer.from(footer)
      ]);

      const uploadOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/upload',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': reqBuffer.length
        }
      };
      
      const req = http.request(uploadOptions, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('Upload status:', res.statusCode);
          console.log('Response:', data);
        });
      });
      req.write(reqBuffer);
      req.end();
    } else {
      console.log('Test image not found, skipping valid upload test.');
    }
  } catch (err) {
    console.error(err);
  }
};

runUploadTest();

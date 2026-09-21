const http = require('http');
require('dotenv').config({ path: 'server/.env' });
const uploadHandler = require('./api/upload/index.js');

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/upload' && req.method === 'POST') {
    await uploadHandler(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(4000, async () => {
  console.log('Test server running on port 4000');
  
  // Now send a request
  const fs = require('fs');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  // Create a 1x1 png in memory
  const fileBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
  
  let payload = `--${boundary}\r\n`;
  payload += `Content-Disposition: form-data; name="image"; filename="1.png"\r\n`;
  payload += `Content-Type: image/png\r\n\r\n`;
  
  const footer = `\r\n--${boundary}--`;
  
  const reqBuffer = Buffer.concat([
    Buffer.from(payload),
    fileBuffer,
    Buffer.from(footer)
  ]);

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET);

  const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/upload',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': reqBuffer.length
    }
  }, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Upload status:', res.statusCode);
      console.log('Response:', data);
      process.exit(0);
    });
  });
  
  req.on('error', err => {
    console.error('Request failed:', err);
    process.exit(1);
  });
  
  req.write(reqBuffer);
  req.end();
});

const http = require('http');
require('dotenv').config({path: 'server/.env'});
const jwt = require('jsonwebtoken');

const token = jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: '30d' });

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const fileBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
let payload = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="1.png"\r\nContent-Type: image/png\r\n\r\n`;
const footer = `\r\n--${boundary}--`;
const reqBuffer = Buffer.concat([Buffer.from(payload), fileBuffer, Buffer.from(footer)]);

const req = http.request('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': reqBuffer.length
  }
}, res2 => {
  let data = '';
  res2.on('data', c => data += c);
  res2.on('end', () => { console.log('UPLOAD STATUS:', res2.statusCode, data); process.exit(0); });
});
req.write(reqBuffer);
req.end();

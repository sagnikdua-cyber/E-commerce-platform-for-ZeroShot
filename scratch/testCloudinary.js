const https = require('https');
const FormData = require('form-data');
const crypto = require('crypto');
require('dotenv').config({path: 'server/.env'});
const cloudName = process.env.CLOUDINARY_CLOUD_NAME.trim();
const apiKey = process.env.CLOUDINARY_API_KEY.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET.trim();

const timestamp = Math.round(new Date().getTime() / 1000);
const signatureStr = `timestamp=${timestamp}${apiSecret}`;
const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

const form = new FormData();
form.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==');
form.append('api_key', apiKey);
form.append('timestamp', timestamp);
form.append('signature', signature);

const req = https.request('https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload', {
  method: 'POST',
  headers: form.getHeaders()
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
form.pipe(req);

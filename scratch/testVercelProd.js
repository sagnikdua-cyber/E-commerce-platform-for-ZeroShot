const http = require('https');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const fileBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
let payload = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="1.png"\r\nContent-Type: image/png\r\n\r\n`;
const footer = `\r\n--${boundary}--`;
const reqBuffer = Buffer.concat([Buffer.from(payload), fileBuffer, Buffer.from(footer)]);
const req = http.request('https://client-six-iota-30.vercel.app/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImR1bW15IiwiaWF0IjoxNzkwMDA2NTUyLCJleHAiOjE3OTAwMTAxNTJ9.FavE3IVfs35vWlkO9eARai17CuMQcA5nu5omC0esMn0',
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': reqBuffer.length
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(res.statusCode, data));
});
req.write(reqBuffer);
req.end();

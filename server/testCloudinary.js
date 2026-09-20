require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

console.log('Testing Cloudinary config:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary Ping Failed:', error);
  } else {
    console.log('Cloudinary Ping Success:', result);
    
    // Now test upload
    cloudinary.uploader.upload('../client/public/products/1.png', {
      resource_type: 'image'
    }).then(uploadResult => {
      console.log('Cloudinary Upload Success:', uploadResult.secure_url);
    }).catch(uploadError => {
      console.error('Cloudinary Upload Failed:', uploadError);
    });
  }
});

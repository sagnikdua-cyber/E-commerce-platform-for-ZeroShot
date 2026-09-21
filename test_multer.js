require('dotenv').config({ path: 'server/.env' });
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp']
  },
});

console.log('Storage configured', storage);

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'shopnexus', allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const upload = multer({ storage });

const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) => {
    if (result instanceof Error) reject(result);
    else resolve(result);
  });
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  // Verify auth
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
  try { jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Token invalid' }); }

  try {
    await runMiddleware(req, res, upload.single('image'));
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    return res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: req.file.path 
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

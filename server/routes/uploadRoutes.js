const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/authMiddleware');

// Configure Cloudinary
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

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload product image
// @route   POST /api/upload
// @access  Private (Admin)
router.post('/', protect, upload.single('image'), (req, res) => {
  console.log(req.file); if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file format' });
  }

  res.json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path, // Cloudinary URL
  });
});

module.exports = router;

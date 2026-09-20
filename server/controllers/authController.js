const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth owner/admin & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check if the provided email matches the environment variable admin email
    if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Compare the provided password against the bcrypt hash in the environment variable
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (isMatch) {
      res.json({
        email: process.env.ADMIN_EMAIL,
        token: generateToken(process.env.ADMIN_EMAIL),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    // If the request makes it past authMiddleware, it's a valid admin
    res.json({
      email: req.admin.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authAdmin,
  getAdminProfile,
};

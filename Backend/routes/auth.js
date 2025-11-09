var express = require('express');
var router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', getProfile);

// PUT /api/auth/profile
router.put('/profile', updateProfile);

module.exports = router;


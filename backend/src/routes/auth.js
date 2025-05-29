const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

// Request password reset
router.post('/forgot-password', authController.requestPasswordReset);

// Reset password
router.post('/reset-password', authController.resetPassword);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 
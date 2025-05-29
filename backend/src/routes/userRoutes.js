const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);

// Update user permissions (admin only)
router.put('/:id/permissions', authenticateToken, isAdmin, userController.updatePermissions);

// Get current user's permissions
router.get('/me/permissions', authenticateToken, userController.getMyPermissions);

module.exports = router; 
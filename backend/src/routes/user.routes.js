const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const { auth, checkPermission } = require('../middleware/auth.middleware');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user permissions (admin only)
router.patch('/:userId/permissions',
  auth,
  checkPermission('delete'), // Only users with delete permission can modify permissions
  [
    body('permissions').isObject().withMessage('Permissions must be an object'),
    body('permissions.read').isBoolean().withMessage('Read permission must be boolean'),
    body('permissions.write').isBoolean().withMessage('Write permission must be boolean'),
    body('permissions.delete').isBoolean().withMessage('Delete permission must be boolean')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.permissions = req.body.permissions;
      await user.save();

      res.json({
        message: 'Permissions updated successfully',
        permissions: user.permissions
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating permissions' });
    }
  }
);

// Get all users (admin only)
router.get('/', auth, checkPermission('delete'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router; 
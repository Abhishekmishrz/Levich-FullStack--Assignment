const User = require('../models/User');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -resetToken -resetTokenExpiry');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user permissions
exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;

    // Validate permissions
    const validPermissions = ['read', 'write', 'delete'];
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    
    if (invalidPermissions.length > 0) {
      return res.status(400).json({ 
        message: `Invalid permissions: ${invalidPermissions.join(', ')}` 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update permissions
    user.permissions = permissions;
    await user.save();

    res.json({
      message: 'Permissions updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({ message: 'Error updating permissions' });
  }
};

// Get current user's permissions
exports.getMyPermissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('permissions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ permissions: user.permissions });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ message: 'Error fetching permissions' });
  }
}; 
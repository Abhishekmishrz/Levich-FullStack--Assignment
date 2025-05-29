const Comment = require('../models/Comment');

// Get all comments (with permission check)
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      $or: [
        { author: req.user.userId },
        { 'permissions.user': req.user.userId, 'permissions.canRead': true }
      ],
      isDeleted: false
    }).populate('author', 'name email');

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, permissions } = req.body;

    const comment = new Comment({
      content,
      author: req.user.userId,
      permissions: permissions || []
    });

    await comment.save();
    await comment.populate('author', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, permissions } = req.body;

    const comment = await Comment.findOne({
      _id: id,
      $or: [
        { author: req.user.userId },
        { 'permissions.user': req.user.userId, 'permissions.canWrite': true }
      ],
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or no permission' });
    }

    comment.content = content;
    if (permissions) {
      comment.permissions = permissions;
    }
    comment.updatedAt = Date.now();

    await comment.save();
    await comment.populate('author', 'name email');

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Error updating comment' });
  }
};

// Delete a comment (soft delete)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({
      _id: id,
      $or: [
        { author: req.user.userId },
        { 'permissions.user': req.user.userId, 'permissions.canDelete': true }
      ],
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or no permission' });
    }

    comment.isDeleted = true;
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
}; 
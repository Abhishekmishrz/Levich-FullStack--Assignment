const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment.model');
const { auth, checkPermission } = require('../middleware/auth.middleware');

// Get all comments (requires read permission)
router.get('/', auth, checkPermission('read'), async (req, res) => {
  try {
    const comments = await Comment.find({ isDeleted: false })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Create new comment (requires write permission)
router.post('/',
  auth,
  checkPermission('write'),
  [
    body('content').trim().notEmpty().withMessage('Comment content is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const comment = new Comment({
        content: req.body.content,
        author: req.user._id
      });

      await comment.save();
      await comment.populate('author', 'name email');

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment' });
    }
  }
);

// Delete comment (requires delete permission)
router.delete('/:commentId',
  auth,
  checkPermission('delete'),
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      comment.isDeleted = true;
      await comment.save();

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment' });
    }
  }
);

// Get comment by ID (requires read permission)
router.get('/:commentId',
  auth,
  checkPermission('read'),
  async (req, res) => {
    try {
      const comment = await Comment.findOne({
        _id: req.params.commentId,
        isDeleted: false
      }).populate('author', 'name email');

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comment' });
    }
  }
);

module.exports = router; 
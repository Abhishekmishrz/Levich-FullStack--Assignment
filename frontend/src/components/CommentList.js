import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/comments', { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setOpenDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/comments/${editingComment._id}`, { content: editContent });
      setOpenDialog(false);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const canEdit = (comment) => {
    if (!user) return false;
    return comment.author._id === user.id || 
           comment.permissions.some(p => p.user === user.id && p.canWrite);
  };

  const canDelete = (comment) => {
    if (!user) return false;
    return comment.author._id === user.id || 
           comment.permissions.some(p => p.user === user.id && p.canDelete);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      {!user ? (
        <Typography variant="h6" align="center">
          Please log in to view and manage comments
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleCreateComment}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </form>
          </Paper>

          <List>
            {comments.map((comment) => (
              <ListItem
                key={comment._id}
                divider
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" color="text.secondary">
                      {comment.author.name}
                    </Typography>
                  }
                  secondary={comment.content}
                />
                <ListItemSecondaryAction>
                  {canEdit(comment) && (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditClick(comment)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {canDelete(comment) && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleEditSubmit} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default CommentList; 
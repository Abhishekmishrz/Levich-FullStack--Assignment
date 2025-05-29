import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/api';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await commentService.getComments();
      setComments(response.data);
    } catch (err) {
      setError('Failed to fetch comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await commentService.createComment(newComment);
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to create comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Comments
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {user?.permissions?.write && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <TextField
                label="Add a comment"
                multiline
                rows={2}
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                disabled={loading || !newComment.trim()}
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </Button>
            </Box>
          )}
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.content}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.author.name}
                        </Typography>
                        {` — ${new Date(comment.createdAt).toLocaleString()}`}
                      </>
                    }
                  />
                  {user?.permissions?.delete && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Comments; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Box
} from '@mui/material';
import  api  from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    delete: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Fetch users error:', error);
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setPermissions({
      read: user.permissions.includes('read'),
      write: user.permissions.includes('write'),
      delete: user.permissions.includes('delete')
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setPermissions({
      read: false,
      write: false,
      delete: false
    });
  };

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleUpdatePermissions = async () => {
    try {
      const selectedPermissions = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      await api.put(`/users/${selectedUser._id}/permissions`, {
        permissions: selectedPermissions
      });

      setSuccess('Permissions updated successfully');
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to update permissions');
      console.error('Update permissions error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.permissions.join(', ')}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    Edit Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User Permissions</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.read}
                    onChange={() => handlePermissionChange('read')}
                  />
                }
                label="Read"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.write}
                    onChange={() => handlePermissionChange('write')}
                  />
                }
                label="Write"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.delete}
                    onChange={() => handlePermissionChange('delete')}
                  />
                }
                label="Delete"
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdatePermissions} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 
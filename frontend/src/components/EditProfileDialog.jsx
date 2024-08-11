// src/components/EditProfileDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Avatar,
  Stack,
} from '@mui/material';

const EditProfileDialog = ({ open, onClose, user, onSave }) => {
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    onSave({ name });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            alt={user?.name || 'User Avatar'}
            src={user?.profilePic || ''}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;

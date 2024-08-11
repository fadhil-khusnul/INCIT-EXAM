// src/components/ResetPasswordDialog.js
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

const ResetPasswordDialog = ({ open, onClose, user, onSave }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [matchNewPassword, setMatchNewPassword] = useState('');

 
  const handleSave = () => {
    onSave({ oldPassword, newPassword, matchNewPassword });

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset Password</DialogTitle>
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
          label="Old Password"
          type="password"
          fullWidth
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Re-enter New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={matchNewPassword}
          onChange={(e) => setMatchNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarMessage = ({ open, message, severity = 'info', onClose, autoHideDuration = 3000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;

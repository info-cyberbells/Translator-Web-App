import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const DeleteAccountRequest = () => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // Store request status

  const deletionReasons = [
    'No longer need the account',
    'Privacy concerns',
    'Switching to another service',
    'Too many notifications',
    'Other',
  ];

  useEffect(() => {
    fetchRequestStatus(); // Fetch status on component mount
  }, []);

  const fetchRequestStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`${apiBaseUrl}/user/delete-request-status/${userId}`);
      if (response.data) {
        setRequestStatus(response.data.status); // Set the status from backend
      }
    } catch (err) {
      console.error('Error fetching request status:', err);
      // Optionally handle error silently or show a toast
    }
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason for deletion');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const response = await axios.post(`${apiBaseUrl}/user/request-delete`, {
        userId,
        reason,
      });

      if (response.data) {
        toast.success('Account deletion request submitted successfully');
        setRequestStatus('pending'); // Update status immediately after submission
        setReason(''); // Reset the form
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error submitting deletion request';
      toast.error(errorMessage);
      console.error('Error submitting delete request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusMessage = () => {
    switch (requestStatus) {
      case 'pending':
        return (
          <Typography variant="body1" align="center" sx={{ mt: 2, color: '#ff9800' }}>
            Your request is sent and is awaiting admin review.
          </Typography>
        );
      case 'approved':
        return (
          <Typography variant="body1" align="center" sx={{ mt: 2, color: '#4caf50' }}>
            Your account is scheduled for deletion.
          </Typography>
        );
      case 'rejected':
        return (
          <Typography variant="body1" align="center" sx={{ mt: 2, color: '#f44336' }}>
            Your request has been rejected by the admin.
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Request Account Deletion
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Please select a reason for deleting your account.
        </Typography>

        {/* Show form only if no request is pending/approved */}
        {!requestStatus || requestStatus === 'rejected' ? (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="delete-reason-label">Reason for Deletion</InputLabel>
              <Select
                labelId="delete-reason-label"
                label="Reason for Deletion"
                value={reason}
                onChange={handleReasonChange}
                disabled={isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#231f20' },
                    '&:hover fieldset': { borderColor: '#231f20' },
                    '&.Mui-focused fieldset': { borderColor: '#231f20' },
                  },
                  '& .MuiInputLabel-root': { color: '#231f20' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#231f20' },
                }}
              >
                <MenuItem value="">
                  <em>Select a reason</em>
                </MenuItem>
                {deletionReasons.map((reasonOption) => (
                  <MenuItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                backgroundColor: '#231f20',
                '&:hover': { backgroundColor: '#1a1718' },
                '&.Mui-disabled': { backgroundColor: '#4d4d4d' },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Submit Deletion Request'
              )}
            </Button>
          </>
        ) : null}

        {/* Show status message */}
        {renderStatusMessage()}
      </Box>
    </React.Fragment>
  );
};

export default DeleteAccountRequest;
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error and success states
    setError('');
    setSuccess(false);

    // Basic validation check for amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    // Handle the donation logic here
    console.log('Donation Amount:', parsedAmount);
    
    // Simulate successful donation submission
    setSuccess(true);

    // Clear the fields after submission
    setAmount('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Donate
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Enter Donation Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
           
                error={!!error}
                helperText={error}
              />
            </Box>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Thank you for your donation of ${parseFloat(amount).toFixed(2)}!
              </Alert>
            )}
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button type="submit" variant="contained" color="primary">
                Donate
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Donate;

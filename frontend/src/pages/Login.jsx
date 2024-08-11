import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Stack, IconButton, FormHelperText, FormControl, InputLabel, OutlinedInput, InputAdornment, Link, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, VisibilityOff, Visibility } from '@mui/icons-material';
import { useSigin, useOauth } from '../hooks/auth';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const [showPassword, setShowPassword] = useState(false);

  const mutation = useSigin();

  const { login } = useAuth()
  const mutationOauth = useOauth();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }


    if (!validatePassword(password)) {
      newErrors.password = 'Password must contain at least 8 characters, including one lowercase, one uppercase, one digit, and one special character';
    }



    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);



      try {
        const response = await login(email, password);
        console.log(response); // Now you should see the response data
        // Proceed with any further actions, e.g., updating the auth context or redirecting the user
      } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        // Handle the error, e.g., by showing a notification to the user
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
      }








      // Set loading state to true
      // mutation.mutate({ email, password }, {
      //   onSuccess: (data) => {
      //     setSnackbarMessage(data.message);
      //     setSnackbarSeverity('success');
      //     setSnackbarOpen(true);
      //     setLoading(false); // Reset loading state
      //   },
      //   onError: (error) => {
      //     setSnackbarMessage(error.response?.data?.message || error.message);
      //     setSnackbarSeverity('error');
      //     setSnackbarOpen(true);
      //     setLoading(false); // Reset loading state
      //   },
      // });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOAuthSignUp = async (provider) => {
    setSnackbarMessage(`Oauth to ${provider}...`);
    setSnackbarSeverity('info');
    setSnackbarOpen(true);

    try {
      mutationOauth.mutate(provider, {
      });


    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }


  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Box
        bgcolor="background.paper"
        boxShadow={3}
        borderRadius={2}
        p={4}
        maxWidth={400}
        width="100%"
        textAlign="center"
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Sign In
        </Typography>

        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src="/static/images/avatar/default-profile.png"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
        </Stack>




        <FormControl fullWidth required error={!!errors.email} sx={{ mb: 2 }}>
          <InputLabel>Email</InputLabel>

          <OutlinedInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
          />
          <FormHelperText>{errors.email}</FormHelperText>
        </FormControl>

        <FormControl fullWidth required error={!!errors.password} sx={{ mb: 2 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}


          />
          <FormHelperText>{errors.password}</FormHelperText>

        </FormControl>



        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={24} /> : null}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ mb: 2 }}
          onClick={() => handleOAuthSignUp('google')}
        >
          Sign Up with Google
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<FacebookIcon />}
          onClick={() => handleOAuthSignUp('facebook')}
        >
          Sign Up with Facebook
        </Button>

        <Typography textAlign={'center'} mt={3}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Login;

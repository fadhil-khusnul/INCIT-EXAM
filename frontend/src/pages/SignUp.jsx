import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, Stack, IconButton, FormHelperText, FormControl, InputLabel, OutlinedInput, InputAdornment, Link } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, VisibilityOff, Visibility } from '@mui/icons-material';

const SignUp = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});


  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show);

  const handleMouseDownPasswordConfirm = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    console.log(password);
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }


    if (!validatePassword(password)) {
      newErrors.password = 'Password must contain at least 8 characters, including one lowercase, one uppercase, one digit, and one special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Proceed with form submission or API call
      console.log('Form submitted successfully');
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
          Sign Up
        </Typography>

        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src="/static/images/avatar/default-profile.png"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
        </Stack>

        <FormControl fullWidth required error={!!errors.name} sx={{ mb: 2 }}>
        <InputLabel>Name</InputLabel>

          <OutlinedInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.name}

          />
          <FormHelperText>{errors.name}</FormHelperText>
        </FormControl>


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

        <FormControl fullWidth required error={!!errors.password} sx={{ mb: 2 }}  variant="outlined">
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
        <FormControl fullWidth required error={!!errors.confirmPassword} sx={{ mb: 3 }}  variant="outlined">
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            type={showPasswordConfirm ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPasswordConfirm}
                  onMouseDown={handleMouseDownPasswordConfirm}
                  edge="end"
                >
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"

            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}


          />
          <FormHelperText>{errors.confirmPassword}</FormHelperText>

        </FormControl>
  

        <Button type='submit' onClick={handleSubmit} variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Sign Up
        </Button>

        <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ mb: 2 }}>
          Sign Up with Google
        </Button>

        <Button variant="outlined" fullWidth startIcon={<FacebookIcon />}>
          Sign Up with Facebook
        </Button>
        <Typography textAlign={'center'} mt={3}>
          

        Already have an account? <Link href="/login">Sign In</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default SignUp;

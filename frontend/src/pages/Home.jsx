import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AssignmentInd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();


  const handleNavigate = (link) => {
    navigate(link);
  };
  return (
    <Box
      // gap={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.200"
    >
      <Box

        bgcolor="background.paper"
        boxShadow={3}
        borderRadius={2}
        p={6}
        width={500}
        alignContent={'center'}
        // maxWidth={800}
        textAlign="center"
      >
        <AssignmentInd sx={{ mt: 2, fontSize: 40, color: 'grey.600' }} />


        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            // letterSpacing: '.1rem',
            // mb: 2,
            color: 'grey.600',
          }}
        >
          Welcome to Simple App
        </Typography>

        <Typography variant="h6" sx={{ color: 'grey.400', }}>
          Full-Stack Exam
        </Typography>

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Button variant="contained" fullWidth
            onClick={() => { handleNavigate(`/login`) }}

          >
            Sign In
          </Button>
          <Button variant="outlined" fullWidth
            onClick={() => { handleNavigate(`/signup`) }}

          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

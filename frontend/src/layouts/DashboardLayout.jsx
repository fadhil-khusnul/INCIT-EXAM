import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MenuApp from '../components/MenuApp';

const DashboardLayout = ({ children, user }) => {  
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuApp toggleDarkMode={toggleDarkMode} user={user} />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: darkMode ? 'grey.900' : 'grey.100',
          padding: '16px',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;

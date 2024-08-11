import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { Alert, ListItemIcon, Snackbar } from '@mui/material';
import { MdSunny } from "react-icons/md";
import { WiMoonAltThirdQuarter } from "react-icons/wi";
import { LockResetOutlined, Logout, Person } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import { useAuth } from '../contexts/AuthContext';
import EditProfileDialog from './EditProfileDialog.jsx';
import { useState } from 'react';
import ResetPasswordDialog from './ResetPasswordDialog.jsx';

const pages = ['Dashboard'];

const settings = [
  { label: 'Profile', icon: <Person />, link: '/edit-profile' },
  { label: 'Reset Password', icon: <LockResetOutlined />, link: '/reset-password' },
  { label: 'Logout', icon: <Logout />, link: '/logout' },
];

const MenuApp = ({ toggleDarkMode, user, isAuthenticated }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { logout } = useAuth()

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openResetPasswordDialog, setopenResetPasswordDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isLoading, setLoading] = useState(false); // New state for loading


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (link) => {
    navigate(link);
    handleCloseUserMenu(); // Close menu after navigating
  };

  const handleLogout = async () => {
    const accessToken = Cookies.get('accessToken');

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {

        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        await logout()

      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  const handleMenuItemClick = (setting) => {
    if (setting.label === 'Logout') {
      handleLogout();
    } else if (setting.label === 'Profile') {
      setOpenEditDialog(true);
    } else if (setting.label === 'Reset Password') {
      setopenResetPasswordDialog(true);
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditSave = async (updatedUser) => {

    const accessToken = Cookies.get('accessToken');


    try {

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/edit-profile`, updatedUser, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setLoading(false);

      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
      }



    } catch (error) {
      console.log(error);


    }



    // Save the updated user information here, such as sending to an API


  };


  const handleResetPasswordSave = async ({ oldPassword, newPassword, matchNewPassword }) => {
    const accessToken = Cookies.get('accessToken');

    console.log(oldPassword, newPassword, matchNewPassword);


    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
        { oldPassword, newPassword, matchNewPassword }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error resetting password');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AssignmentInd sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              INCIT EXAM
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AssignmentInd sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              INCIT EXAM
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ ml: 1, mr: 1 }} onClick={toggleDarkMode} color="inherit">
                {theme.palette.mode === 'dark' ? <WiMoonAltThirdQuarter /> : <MdSunny />}
              </IconButton>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={user?.profilePic} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'Loading...'}
                    </Typography>
                  </Box>

                  <MenuItem divider />

                  {settings.map((setting) => (
                    <MenuItem key={setting.label} onClick={() => handleMenuItemClick(setting)}>
                      <ListItemIcon>{setting.icon}</ListItemIcon>
                      <Typography textAlign="center">{setting.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onSave={handleEditSave}
      />

      <ResetPasswordDialog
        open={openResetPasswordDialog}
        onClose={() => setopenResetPasswordDialog(false)}
        user={user}
        onSave={handleResetPasswordSave}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


    </>
  );
};

export default MenuApp;

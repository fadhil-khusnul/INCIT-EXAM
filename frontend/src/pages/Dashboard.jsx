import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { Await } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {

  const { isAuthenticated, token, user } = useAuth()


  

  const [data, setData] = useState({
    totalSignups: 0,
    activeSessionsToday: 0,
    averageActiveSessions: 0,
  });

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [cookies, setCookie] = useCookies(['accessToken']);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard-stats`);
        setData(statsResponse.data);

        const usersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
        setUsers(usersResponse.data);


        // const userProfile = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user-profile`, {
        //   withCredentials: true, 
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // setUser(userProfile.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardLayout user={user} isAuthenticated={isAuthenticated}>
      <Divider>User Database Dashboard</Divider>
      <Grid container spacing={3} mt={1} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Signups</Typography>
              <Typography>{data.totalSignups}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Sessions Today</Typography>
              <Typography>{data.activeSessionsToday}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Active Sessions (7 days)</Typography>
              <Typography>{data.averageActiveSessions.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider>Users</Divider>
      <TableContainer component={Paper} mt={6}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Sign Up Date</TableCell>
              <TableCell>Login Count</TableCell>
              <TableCell>Last Logout</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.email}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell>{user.loginCount}</TableCell>
                <TableCell>{user.logoutAt ? new Date(user.logoutAt).toLocaleString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </DashboardLayout>
  );
};

export default Dashboard;

import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
    
      <Divider>User Database Dashboard</Divider>


      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Signups</Typography>
              {/* <Typography>{data.totalSignups}</Typography> */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Sessions Today</Typography>
              {/* <Typography>{data.activeSessionsToday}</Typography> */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Active Sessions (7 days)</Typography>
              {/* <Typography>{data.averageActiveSessions}</Typography> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;

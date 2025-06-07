import React from 'react';
import { Grid } from '@mui/material';
import DataEntry from './DataEntry';
import ExpenseTracker from './ExpenseTracker';
import RotorEntry from './RotorEntry';
import DailyLogs from './DailyLogs'

const YourComponent = () => {
  return (
     <Grid
  container
  spacing={2}
  justifyContent="flex-start"
  alignItems="flex-start"
>
  <Grid item xs={12} lg={6}>
    <DataEntry />
  </Grid>

  <Grid item xs={12} lg={6}>
    <ExpenseTracker />
  </Grid>

  <Grid item xs={12} lg={6}>
    <RotorEntry />
  </Grid>

  <Grid item xs={12} lg={6}>
    <DailyLogs />
  </Grid>
</Grid>

  );
};

export default YourComponent;

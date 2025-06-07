import React, { useState } from 'react'
import DailyActivities from './DailyActivities'
import DailyTransactions from './DailyTransactions'
import ExpenseOverviewCard from '../Cards/ExpenseOverviewCard'
import ActivitiesOverviewCard from '../Cards/ActivitiesOverviewCard'
import Rotors from './Rotors'
import Layout from '../Layout'
import '../Styles.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Box, Grid, Typography } from '@mui/material'
import moment from 'moment'
import DailyLogs from './DailyLogs'

const Reports = (props) => {
  const today = new Date()
  const [fromValue, setFromValue] = useState(today)
  const [toValue, setToValue] = useState(today)
  const [formattedFromDate, setFormattedFromDate] = useState(today.getTime())
  const [formattedToDate, setFormattedToDate] = useState(today.getTime())

  const handleFromDateChange = (newValue) => {
    const time = newValue.$d.getTime()
    setFromValue(newValue.$d)
    setFormattedFromDate(time)
  }

  const handleToDateChange = (newValue) => {
    const time = newValue.$d.getTime()
    setToValue(newValue.$d)
    setFormattedToDate(time)
  }

  return (
    <Layout title="Reports">
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* Parent Container */}
        <Grid container spacing={2} sx={{ ml: 3, mr: 3 }}>
          
          {/* Left Container: Cards */}
          <Grid item xs={12} md={8} lg={8}>
            <Grid container spacing={2}>
              {props.role === 'Admin' && (
                <Grid item xs={12} sm={6} md={6}>
                  <ExpenseOverviewCard
                    className="reportMargin"
                    customDates={[formattedFromDate, formattedToDate]}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={6}>
                <ActivitiesOverviewCard
                  className="reportMargin"
                  customDates={[formattedFromDate, formattedToDate]}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Container: Date Pickers */}
          <Grid item xs={12} md={4} lg={4}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <DesktopDatePicker
                    label="From"
                    inputFormat="MM/DD/YYYY"
                    value={fromValue}
                    onChange={handleFromDateChange}
                    renderInput={(params) => (
                      <TextField size="small" {...params} sx={{ width: '150px' }} />
                    )}
                  />
                  <DesktopDatePicker
                    label="To"
                    inputFormat="MM/DD/YYYY"
                    value={toValue}
                    onChange={handleToDateChange}
                    renderInput={(params) => (
                      <TextField size="small" {...params} sx={{ width: '150px' }} />
                    )}
                  />
                </Stack>
              </LocalizationProvider>

              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Date Range:
                </Typography>
                <Typography variant="body2">
                  {moment(formattedFromDate).format('MMM Do YY')}
                </Typography>
                <Typography variant="body2" sx={{ mx: 0.5 }}>
                  -
                </Typography>
                <Typography variant="body2">
                  {moment(formattedToDate).format('MMM Do YY')}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DailyActivities
            customDates={[formattedFromDate, formattedToDate]}
            className="reportMargin"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DailyTransactions
            customDates={[formattedFromDate, formattedToDate]}
            className="reportMargin"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Rotors
            customDates={[formattedFromDate, formattedToDate]}
            className="reportMargin"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DailyLogs
            customDates={[formattedFromDate, formattedToDate]}
            className="reportMargin"
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Reports

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  TextField,
  Stack,
} from '@mui/material'

const FanClient = ({ client }) => {
  const today = new Date().toISOString().split('T')[0]
  const [dateFilter, setDateFilter] = useState({ from: '', to: today })

  const isInRange = (date) => {
    const d = new Date(date)
    const from = dateFilter.from ? new Date(dateFilter.from) : null
    const to = dateFilter.to ? new Date(dateFilter.to) : null
    return (!from || d >= from) && (!to || d <= to)
  }

  const sales = client.sales?.filter(s => isInRange(s.date)) || []
  const payments = client.payments?.filter(p => isInRange(p.date)) || []
  const inventory = client.inventory || []

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>{client.name}</Typography>
      <Typography variant="subtitle1" color="warning.main" gutterBottom>
        💰 Remaining Balance: ₹{client.balance}
      </Typography>

      <Stack direction="row-reverse" spacing={2} mb={3}>
        <TextField
          label="From"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFilter.from}
          onChange={(e) =>
            setDateFilter((prev) => ({ ...prev, from: e.target.value }))
          }
        />
        <TextField
          label="To"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFilter.to}
          onChange={(e) =>
            setDateFilter((prev) => ({ ...prev, to: e.target.value }))
          }
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Fan Sales</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip label={new Date(s.date).toLocaleDateString()} color="info" />
                      </TableCell>
                      <TableCell>
                        <Chip label={s.model} />
                      </TableCell>
                      <TableCell>
                        <Chip label={s.quantity} color="secondary" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Transactions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip label={new Date(p.date).toLocaleDateString()} color="info" />
                      </TableCell>
                      <TableCell>
                        <Chip label={`₹${p.amount}`} color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Inventory</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Model</TableCell>
                    <TableCell>Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FanClient

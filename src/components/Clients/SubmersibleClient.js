import React, { useState, useMemo,useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Stack,
  TextField,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { MonetizationOn, ShoppingCart, Download } from '@mui/icons-material';
import rateList from '../Utils/RateList';
import { jsPDF } from 'jspdf';

const SubmersibleClient = ({ client }) => {
  const today = new Date().toISOString().split('T')[0];
  const [dateFilter, setDateFilter] = useState({ from: '', to: today });
  const [entryPage, setEntryPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setEntryPage(1);
    setPaymentPage(1);
  }, [dateFilter]);
  
  const rates = rateList[client.name?.toLowerCase()] || {};

  const isInRange = (date) => {
    const d = new Date(date);
    const from = dateFilter.from ? new Date(dateFilter.from) : null;
    const to = dateFilter.to ? new Date(dateFilter.to) : null;
    return (!from || d >= from) && (!to || d <= to);
  };

  const filteredEntries = useMemo(() =>
    client.entries
      .map((e) => ({
        ...e,
        rate: rates[e.size] || 0,
        amount: (Number(e.quantity) || 0) * (Number(rates[e.size]) || 0),
      }))
      .filter((e) => isInRange(e.date))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  , [client.entries, dateFilter, rates]);

  const filteredPayments = useMemo(() =>
    client.payments
      .filter((p) => isInRange(p.date))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  , [client.payments, dateFilter]);

const handleExportToPDF = () => {
  const doc = new jsPDF();
  let y = 10;

  const fromDate = dateFilter.from || 'start';
  const toDate = dateFilter.to || today;
  const filename = `${client.name}_from-${fromDate}_to-${toDate}.pdf`;

  // Colors
  const primaryColor = [33, 150, 243];
  const dangerColor = [244, 67, 54];
  const successColor = [76, 175, 80];
  const lightGray = [230, 230, 230];

  // Header
  doc.setFontSize(20).setTextColor(...primaryColor);
  doc.text(client.name, 10, y);
  y += 10;

  doc.setFontSize(11).setTextColor(0, 0, 0);
  doc.text(`Report Period: ${fromDate} to ${toDate}`, 10, y);
  y += 6;
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, y);
  y += 8;

  doc.setTextColor(...dangerColor).setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Remaining Balance: ₹${client.calculatedBalance?.toLocaleString()}`, 10, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  // Draw line
  doc.setDrawColor(150).line(10, y, 200, y);
  y += 6;

  // === Sales Section ===
  doc.setFontSize(14).setTextColor(...primaryColor).text('Submersible Rotor Sales', 10, y);
  y += 8;

  doc.setFontSize(10).setTextColor(0, 0, 0);
  const entryHeaderY = y;
  doc.text('Date', 10, y);
  doc.text('Qty', 45, y);
  doc.text('Size', 70, y);
  doc.text('Amount', 140, y);
  y += 5;

  doc.setDrawColor(...lightGray).line(10, y, 200, y);
  y += 3;

  let totalEntryAmount = 0;
  filteredEntries.forEach((entry, i) => {
    const entryColor = i % 2 === 0 ? lightGray : [255, 255, 255];
    doc.setFillColor(...entryColor);
    doc.rect(10, y - 3, 190, 6, 'F');

    doc.text(new Date(entry.date).toLocaleDateString(), 10, y);
    doc.text(String(entry.quantity), 45, y);
    doc.text(String(entry.size), 70, y);
    doc.text(`${entry.amount.toLocaleString()}`, 140, y);

    totalEntryAmount += entry.amount;
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  if (filteredEntries.length === 0) {
    doc.text('No sales found in selected period.', 10, y);
    y += 6;
  } else {
    doc.setFont(undefined, 'bold').setTextColor(...primaryColor);
    doc.text(`Total Sales: ₹${totalEntryAmount.toLocaleString()}`, 10, y);
    y += 10;
  }

  doc.setFont(undefined, 'normal');

  // === Transactions Section ===
  doc.setFontSize(14).setTextColor(...successColor).text('Transactions', 10, y);
  y += 8;

  doc.setFontSize(10).setTextColor(0, 0, 0);
  doc.text('Date', 10, y);
  doc.text('Amount', 45, y);
  doc.text('Medium', 85, y);
  doc.text('Method', 125, y);
  doc.text('Comment', 160, y);
  y += 5;

  doc.setDrawColor(...lightGray).line(10, y, 200, y);
  y += 3;

  let totalPayments = 0;
  filteredPayments.forEach((p, i) => {
    const paymentColor = i % 2 === 0 ? lightGray : [255, 255, 255];
    doc.setFillColor(...paymentColor);
    doc.rect(10, y - 3, 190, 6, 'F');

    doc.text(new Date(p.date).toLocaleDateString(), 10, y);
    doc.text(`₹${p.amount?.toLocaleString() || 0}`, 45, y);
    doc.text(p.medium || '-', 85, y);
    doc.text(p.transferMethod || '-', 125, y);
    doc.text(p.comment || '-', 160, y);

    totalPayments += p.amount || 0;
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  if (filteredPayments.length === 0) {
    doc.text('No transactions found in selected period.', 10, y);
    y += 6;
  }

  y += 5;
  doc.setFont(undefined, 'bold').setTextColor(...primaryColor);
  doc.text(`Total Transactions: ₹${totalPayments.toLocaleString()}`, 10, y);
  y += 10;

  // Final Balance
  doc.setFontSize(13).setTextColor(...dangerColor);
  doc.setFont(undefined, 'bold');
  doc.text(`Final Balance: ₹${client.calculatedBalance?.toLocaleString()}`, 10, y);

  // Save
  doc.save(filename);
};

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>
        {client.name}
      </Typography>
      <Typography variant="subtitle1" color="warning.main" gutterBottom>
      <Typography variant="subtitle1" color="warning.main" gutterBottom>
  💰 Remaining Balance: ₹{client.calculatedBalance || 0}
</Typography>

</Typography>


      <Stack direction="row-reverse" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          label="To"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFilter.to}
          onChange={(e) => setDateFilter((prev) => ({ ...prev, to: e.target.value }))}
        />
        <TextField
          label="From"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFilter.from}
          onChange={(e) => setDateFilter((prev) => ({ ...prev, from: e.target.value }))}
        />
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            label="Rows"
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setEntryPage(1);
              setPaymentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
   <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleExportToPDF}
        >
          Export to PDF
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" align="left" color="error" sx={{ fontWeight: 'bold' }}>
              <ShoppingCart sx={{ verticalAlign: 'middle', mr: 1 }} />
              Submersible Rotor Sale Details
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredEntries
  .slice((entryPage - 1) * rowsPerPage, entryPage * rowsPerPage)
  .map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip label={new Date(entry.date).toLocaleDateString()} color="info" />
                      </TableCell>
                      <TableCell>
                        <Chip label={entry.quantity} color="secondary" />
                      </TableCell>
                      <TableCell>
                        <Chip label={entry.size} />
                      </TableCell>
                      <TableCell>
                        <Chip label={`₹${entry.amount.toLocaleString()}`} color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No records found for selected date range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(filteredEntries.length / rowsPerPage)}
                page={entryPage}
                onChange={(e, page) => setEntryPage(page)}
                color="primary"
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" align="left" color="primary" sx={{ fontWeight: 'bold' }}>
              <MonetizationOn fontSize="small" sx={{ mr: 1 }} />
              Transactions
            </Typography>
           <TableContainer>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>Medium</TableCell>
        <TableCell>Transfer Method</TableCell>
        <TableCell>Comment</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredPayments
        .slice((paymentPage - 1) * rowsPerPage, paymentPage * rowsPerPage)
        .map((p, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <Chip label={new Date(p.date).toLocaleDateString()} color="info" />
            </TableCell>
            <TableCell>
              <Chip label={`₹${p.amount?.toLocaleString() || 0}`} color="success" />
            </TableCell>
            <TableCell>
              <Chip label={p.medium || '-'} />
            </TableCell>
            <TableCell>
              <Chip label={p.transferMethod || '-'} />
            </TableCell>
            <TableCell>
              <Chip label={p.comment || '-'} />
            </TableCell>
          </TableRow>
        ))}
      {filteredPayments.length === 0 && (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No transactions found for selected date range.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(filteredPayments.length / rowsPerPage)}
                page={paymentPage}
                onChange={(e, page) => setPaymentPage(page)}
                color="primary"
                size="small"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubmersibleClient;

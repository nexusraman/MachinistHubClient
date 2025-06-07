import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Container,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import SnackbarMessage from '../Utils/Snackbar'; 

const DataEntry = () => {
  const [clients, setClients] = useState([]);

  const [singleClient, setSingleClient] = useState('');
  const [singleFrom, setSingleFrom] = useState('');
  const [singleRotorSize, setSingleRotorSize] = useState('');
  const [singleQuantity, setSingleQuantity] = useState('');
  const [singleDate, setSingleDate] = useState(dayjs());

  const defaultRow = {
    client: '',
    from: '',
    rotorSize: '',
    quantity: '',
    date: dayjs(),
  };
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([{ ...defaultRow }]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const rotorSizes = ["6'", "7'", '1"', '1.25"', "6' kit", '1" kit', '1.25 kit'];

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_LINK + '/client').then((res) => {
      setClients(res.data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, []);

  useEffect(() => {
    if (open && rows.length === 0) {
      setRows([{ ...defaultRow }]);
    }
  }, [open, rows.length]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isSingleValid = () =>
    singleClient && singleFrom && singleRotorSize && singleQuantity && singleDate;

  const handleSingleSubmit = async () => {
    if (!isSingleValid()) {
      showSnackbar('Please fill all fields before submitting.', 'error');
      return;
    }
    try {
      const payload = {
        client: singleClient,
        from: singleFrom,
        rotorSize: singleRotorSize,
        quantity: singleQuantity,
        date: new Date(singleDate),
      };
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_LINK + '/fanRotor',
        payload
      );
      showSnackbar("Rotor entry submitted successfully", 'success');
      setSingleClient('');
      setSingleFrom('');
      setSingleRotorSize('');
      setSingleQuantity('');
      setSingleDate(dayjs());
    } catch (error) {
      showSnackbar(error.message || 'Something went wrong.', 'error');
    }
  };

  const handleRowChange = (idx, field, val) => {
    const next = [...rows];
    next[idx][field] = val;
    setRows(next);
  };
  const handleAddRow = () => setRows([...rows, { ...defaultRow }]);
  const handleRemoveRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const handleMultiSubmit = async () => {
    for (let i = 0; i < rows.length; i++) {
      const { client, from, rotorSize, quantity, date } = rows[i];
      if (!client || !from || !rotorSize || !quantity || !date) {
        showSnackbar(`Fill all fields in row ${i + 1}.`, 'error');
        return;
      }
    }
    try {
      for (const row of rows) {
        const payload = {
          client: row.client,
          from: row.from,
          rotorSize: row.rotorSize,
          quantity: row.quantity,
          date: new Date(row.date),
        };
        await axios.post(
          process.env.REACT_APP_BACKEND_LINK + '/fanRotor',
          payload
        );
      }
      showSnackbar('All ROtor entry submitted successfully!', 'success');
      setRows([{ ...defaultRow }]);
      setOpen(false);
    } catch (error) {
      showSnackbar(error.message || 'Something went wrong.', 'error');
    }
  };

  return (
    <Layout title="Rotor Entry">
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 2,
              width: '100%',
              maxWidth: 600,
              height: { xs: 'auto', sm: 250 },
              backgroundColor: '#fafafa',
              boxShadow: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={singleClient}
                    onChange={(e) => setSingleClient(e.target.value)}
                  >
                    {clients
                      .filter((c) => c.category === 'fan')
                      .map((c, i) => (
                        <MenuItem key={i} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="From"
                  fullWidth
                  value={singleFrom}
                  onChange={(e) => setSingleFrom(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Rotor Size</InputLabel>
                  <Select
                    value={singleRotorSize}
                    onChange={(e) => setSingleRotorSize(e.target.value)}
                  >
                    {rotorSizes.map((s, i) => (
                      <MenuItem key={i} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="standard"
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={singleQuantity}
                  onChange={(e) => setSingleQuantity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={singleDate}
                    onChange={(newVal) => setSingleDate(newVal)}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Box textAlign="right" mt={2}>
              <Button
                variant="contained"
                onClick={handleSingleSubmit}
                disabled={!isSingleValid()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
        >
          Add Multiple Entries
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add Multiple Entries</DialogTitle>
        <DialogContent dividers>
          {rows.length === 0 && (
            <Typography color="textSecondary" mt={1} mb={2}>
              Use the + button to start adding rows.
            </Typography>
          )}
          {rows.map((row, idx) => (
            <Box key={idx} border={1} borderRadius={2} p={2} mb={3}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={2.4}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Client</InputLabel>
                    <Select
                      value={row.client}
                      onChange={(e) => handleRowChange(idx, 'client', e.target.value)}
                    >
                      {clients
                        .filter((c) => c.category === 'fan')
                        .map((c, i) => (
                          <MenuItem key={i} value={c.name}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2.4}>
                  <TextField
                    variant="standard"
                    label="From"
                    fullWidth
                    value={row.from}
                    onChange={(e) => handleRowChange(idx, 'from', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Rotor Size</InputLabel>
                    <Select
                      value={row.rotorSize}
                      onChange={(e) => handleRowChange(idx, 'rotorSize', e.target.value)}
                    >
                      {rotorSizes.map((s, i) => (
                        <MenuItem key={i} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    variant="standard"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={row.quantity}
                    onChange={(e) => handleRowChange(idx, 'quantity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2.4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={row.date}
                      onChange={(nv) => handleRowChange(idx, 'date', nv)}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={0.8}>
                  <IconButton color="error" onClick={() => handleRemoveRow(idx)} size="large">
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box textAlign="center">
            <IconButton onClick={handleAddRow} size="large">
              <AddIcon fontSize="large" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleMultiSubmit} variant="contained">
            Submit All
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Layout>
  );
};

export default DataEntry;

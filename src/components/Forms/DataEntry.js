import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import {nanoid} from 'nanoid';
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
} from '@mui/material';
import dayjs from 'dayjs';
import SnackbarMessage from '../Utils/Snackbar'; // Import the SnackbarComponent

const DataEntry = () => {
  const [open, setOpen] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('submersible');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const defaultRow = {
    client: '',
    quantity: '',
    rotorSize: '',
    shaftSize: '',
    date: dayjs(),
  };

  const [rows, setRows] = useState([{ ...defaultRow }]);
  const [singleEntry, setSingleEntry] = useState({
    category: 'submersible',
    client: '',
    quantity: '',
    rotorSize: '',
    shaftSize: '',
    date: dayjs(),
  });

  const fanItems = {
    fanRotor: ["6'", "7'", '1"', '1.25"', "6' kit", '1" kit', '1.25 kit'],
    fanShaft: ['Farata Relxo', 'Farata Goltu', 'CK Goltu', 'CK Relxo', 'ABC', 'Dhokha'],
    submersibleSize: [3, 4, 4.5, 5, '5v4', 5.5, '5.5v4', 6, '6v4', '7v3', '7v4', 8, 9, 10,11, 12,13, 15,'Repair'],
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_LINK}/client`)
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setClientList(sorted);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open && rows.length === 0) {
      setRows([{ ...defaultRow }]);
    }
  }, [open]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSingleChange = (field, value) => {
    setSingleEntry((prev) => ({ ...prev, [field]: value }));
  };

  const isSingleValid = () => {
    const s = singleEntry;
    if (!s.client || !s.quantity || !s.rotorSize || !s.date) return false;
    if (s.category === 'fan' && !s.shaftSize) return false;
    return true;
  };

  const handleSingleSubmit = async () => {
    if (!isSingleValid()) {
      showSnackbar('Please fill all required fields.', 'error');
      return;
    }
    const s = singleEntry;
    const payload = {
      subId: nanoid(),  // ✅ generate nanoid here
      client: s.client,
      rotorSize: s.rotorSize,
      quantity: s.quantity,
      date: new Date(s.date),
      ...(s.category === 'fan' && { shaftSize: s.shaftSize }),
    };
    const endpoint = s.category === 'fan' ? '/fan' : '/submersible';
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_LINK}${endpoint}`, payload);
      showSnackbar('Entry submitted successfully!', 'success');
      setSingleEntry({
        category: 'submersible',
        client: '',
        quantity: '',
        rotorSize: '',
        shaftSize: '',
        date: dayjs(),
      });
    } catch (err) {
      showSnackbar(err.message || 'Something went wrong.', 'error');
    }
  };
  
  const handleRowChange = (i, field, value) => {
    const next = [...rows];
    next[i][field] = value;
    setRows(next);
  };

  const handleAddRow = () => {
    const last = rows[rows.length - 1] || defaultRow;
    setRows([
      ...rows,
      {
        client: last.client,
        quantity: last.quantity,
        rotorSize: last.rotorSize,
        shaftSize: last.shaftSize,
        date: last.date,
      },
    ]);
  };

  const handleRemoveRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    for (let r of rows) {
      if (
        !r.client ||
        !r.quantity ||
        !r.rotorSize ||
        !r.date ||
        (selectedCategory === 'fan' && !r.shaftSize)
      ) {
        showSnackbar('Please fill all required fields in each row.', 'error');
        return;
      }
    }
    const endpoint = selectedCategory === 'fan' ? '/fan/multiple' : '/submersible/multiple';
    const payload = rows.map((r) => ({
      subId: nanoid(),  // ✅ generate nanoid for each entry
      client: r.client,
      rotorSize: r.rotorSize,
      quantity: r.quantity,
      date: new Date(r.date),
      ...(selectedCategory === 'fan' && { shaftSize: r.shaftSize }),
    }));
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_LINK}${endpoint}`, payload);
      showSnackbar('All entries submitted successfully!', 'success');
      setRows([{ ...defaultRow }]);
      setOpen(false);
    } catch (err) {
      showSnackbar(err.message || 'Something went wrong.', 'error');
    }
  };
  
  return (
    <Layout title='Data Entry'>
      {/* SINGLE ENTRY */}
      <Container maxWidth="md">
        <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
          <Box sx={{
            display:'flex', flexDirection:'column', justifyContent:'space-between',
            border:'1px solid #ddd', borderRadius:2, p:2,
            width:'100%', maxWidth:600, height:{ xs:'auto', sm:280 },
            backgroundColor:'#fafafa', boxShadow:3
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant='standard'>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={singleEntry.category}
                    onChange={e=>handleSingleChange('category',e.target.value)}
                  >
                    <MenuItem value='fan'>Fan</MenuItem>
                    <MenuItem value='submersible'>Submersible</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant='standard'>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={singleEntry.client}
                    onChange={e=>handleSingleChange('client',e.target.value)}
                  >
                    {clientList
                      .filter(c=>c.category===singleEntry.category)
                      .map((c,i)=><MenuItem key={i} value={c.name}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  variant='standard' label='Quantity' type='number' fullWidth
                  value={singleEntry.quantity}
                  onChange={e=>handleSingleChange('quantity',e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant='standard'>
                  <InputLabel>
                    {singleEntry.category==='fan'?'Rotor Size':'Size'}
                  </InputLabel>
                  <Select
                    value={singleEntry.rotorSize}
                    onChange={e=>handleSingleChange('rotorSize',e.target.value)}
                  >
                    {(singleEntry.category==='fan'
                      ? fanItems.fanRotor
                      : fanItems.submersibleSize
                    ).map((x,i)=><MenuItem key={i} value={x}>{x}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {singleEntry.category==='fan' && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant='standard'>
                    <InputLabel>Shaft Size</InputLabel>
                    <Select
                      value={singleEntry.shaftSize}
                      onChange={e=>handleSingleChange('shaftSize',e.target.value)}
                    >
                      {fanItems.fanShaft.map((x,i)=><MenuItem key={i} value={x}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Date'
                    value={singleEntry.date}
                    onChange={v=>handleSingleChange('date',v)}
                    renderInput={params=><TextField {...params} fullWidth variant='standard' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box textAlign="right" mt={2}>
              <Button
                variant='contained'
                onClick={handleSingleSubmit}
                disabled={!isSingleValid()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* MULTI ENTRY BUTTON */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          onClick={()=>{
            setOpen(true)
            if(rows.length===0) setRows([{ ...defaultRow }])
          }}
          startIcon={<AddIcon />}
        >
          Add Multiple Entries
        </Button>
      </Box>

      {/* MULTI ENTRY DIALOG */}
      <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Add Multiple Entries</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={e=>setSelectedCategory(e.target.value)}
              >
                <MenuItem value="fan">Fan</MenuItem>
                <MenuItem value="submersible">Submersible</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {rows.map((row,i)=>(
            <Box key={i} border={1} borderRadius={2} p={2} mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Client</InputLabel>
                    <Select
                      value={row.client}
                      onChange={e=>handleRowChange(i,'client',e.target.value)}
                    >
                      {clientList
                        .filter(c=>c.category===selectedCategory)
                        .map((c,j)=><MenuItem key={j} value={c.name}>{c.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    variant="standard" label="Quantity" type="number" fullWidth
                    value={row.quantity}
                    onChange={e=>handleRowChange(i,'quantity',e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel>{selectedCategory==='fan'?'Rotor Size':'Size'}</InputLabel>
                    <Select
                      value={row.rotorSize}
                      onChange={e=>handleRowChange(i,'rotorSize',e.target.value)}
                    >
                      {(selectedCategory==='fan'
                        ? fanItems.fanRotor
                        : fanItems.submersibleSize
                      ).map((x,j)=><MenuItem key={j} value={x}>{x}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                {selectedCategory==='fan' && (
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel>Shaft Size</InputLabel>
                      <Select
                        value={row.shaftSize}
                        onChange={e=>handleRowChange(i,'shaftSize',e.target.value)}
                      >
                        {fanItems.fanShaft.map((x,j)=><MenuItem key={j} value={x}>{x}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={row.date}
                      onChange={v=>handleRowChange(i,'date',v)}
                      renderInput={p=> <TextField {...p} fullWidth variant="standard" />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} textAlign="center">
                  <IconButton onClick={()=>handleRemoveRow(i)} color="error">
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
          <Button onClick={()=>setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit All</Button>
        </DialogActions>
      </Dialog>

            {/* SNACKBAR */}
            <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Layout>
  )
}

export default DataEntry

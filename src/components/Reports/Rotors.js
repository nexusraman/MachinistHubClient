import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  InputAdornment,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import moment from 'moment';
import MicsData from '../MicsData';
import SnackbarMessage from '../Utils/Snackbar'; // Importing the SnackbarMessage component
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// Styled components for table cells and rows
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.success.light
  },
  '&.MuiTableCell-body': {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#b9dcee'
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const DailyActivities = (props) => {
  const [fanData, setFanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searched, setSearched] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteItem, setDeleteItem] = useState(null); // Store full row data
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchFanData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/fanRotor`);
      setFanData(res.data.data || res.data); // Adjust for the data structure from your backend
    } catch (error) {
      console.error('Failed to fetch fan rotor data', error);
    }
  };

  useEffect(() => {
    fetchFanData();
  }, []);

  useEffect(() => {
    const now = new Date();
    let startDate = new Date(now);

    if (props.calenderValue === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (props.calenderValue === 'monthly') {
      startDate.setDate(now.getDate() - 30);
    }

    let filtered = fanData;

    if (props.calenderValue === 'daily') {
      filtered = fanData.filter((d) =>
        new Date(d.date).toLocaleDateString() === now.toLocaleDateString()
      );
    } else if (props.calenderValue === 'weekly' || props.calenderValue === 'monthly') {
      filtered = fanData.filter(
        (d) => new Date(d.date).getTime() >= startDate.getTime()
      );
    } else if (props.customDates[0] && props.customDates[1]) {
      filtered = fanData.filter(
        (d) =>
          new Date(d.date).getTime() >= props.customDates[0] &&
          new Date(d.date).getTime() <= props.customDates[1]
      );
    }

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredData(sorted);
  }, [props.calenderValue, fanData, props.customDates]);

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/deleteFanRotor`, {
        _id: deleteItem._id
      });
      setSnackbar({
        open: true,
        message: res.data.message || 'Deleted successfully',
        severity: 'success'
      });
      fetchFanData(); // refresh after delete
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.message.includes('Network') ? e.message : 'Data exists or cannot delete',
        severity: 'error'
      });
    } finally {
      setDialogOpen(false);
      setDeleteItem(null);
    }
  };

  const filteredFanData = filteredData.filter((row) =>
    row.client.toLowerCase().includes(searched.toLowerCase())
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card sx={{ m: 2, boxShadow: 3 }}>
      <CardHeader title="Fan Rotor Inventory" />
      <CardContent>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {MicsData.submersibleColumn.map((cl, i) => (
                  <StyledTableCell
                    key={'clMicsSub' + i}
                    align={cl.align}
                    style={{ minWidth: 50, width: 'auto' }}
                  >
                    {cl.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFanData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell>{row.client}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.rotorSize}</TableCell>
                    <TableCell>{moment(row.date).format('MM/DD/YY')}</TableCell>
                    <TableCell>
                      <DeleteForeverIcon
                        sx={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleDeleteClick(row)} // Pass full row
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component="div"
          count={filteredFanData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {deleteItem ? (
            <>
              Are you sure you want to delete this entry?
              <br />
              <strong>Client:</strong> {deleteItem.client} <br />
              <strong>Rotor Size:</strong> {deleteItem.rotorSize} <br />
              <strong>Date:</strong> {moment(deleteItem.date).format('MM/DD/YY')}
            </>
          ) : (
            'Loading...'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Card>
  );
};

export default DailyActivities;

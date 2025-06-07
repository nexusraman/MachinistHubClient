import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import moment from 'moment';
import SnackbarMessage from '../Utils/Snackbar'; // <-- ensure the path is correct

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

const DailyLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searched, setSearched] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
  const [selectedLog, setSelectedLog] = useState(null); // Store selected log for deletion

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/log`);
      setLogs(res.data.logs);
    } catch (error) {
      console.error('Failed to fetch daily logs', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_LINK}/log/${id}`);
      setSnackbar({
        open: true,
        message: 'Deleted successfully',
        severity: 'success'
      });
      fetchLogs(); // Refresh the list after deletion
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete',
        severity: 'error'
      });
    }
  };

  const openDeleteDialog = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedLog(null); // Clear selected log
  };

  const confirmDelete = () => {
    if (selectedLog) {
      handleDelete(selectedLog._id);
      closeDeleteDialog(); // Close dialog after confirming delete
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.relatedTo.toLowerCase().includes(searched.toLowerCase()) ||
      (log.comment && log.comment.toLowerCase().includes(searched.toLowerCase()))
  );

  return (
    <Card sx={{ m: 2, boxShadow: 3 }}>
      <CardHeader title="Daily Logs" />
      <CardContent>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
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
                <StyledTableCell>Related To</StyledTableCell>
                <StyledTableCell>Comment</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <StyledTableRow key={log._id}>
                    <TableCell>{log.relatedTo}</TableCell>
                    <TableCell>{log.comment || '-'}</TableCell>
                    <TableCell>{moment(log.date).format('MMMM Do YYYY')}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openDeleteDialog(log)} // Open dialog with log data
                        color="error"
                        size="small"
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </CardContent>

      {/* Snackbar for Feedback */}
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {selectedLog ? (
            <>
              Are you sure you want to delete this entry?
              <br />
              <strong>Related To:</strong> {selectedLog.relatedTo} <br />
              <strong>Comment:</strong> {selectedLog.comment || '-'} <br />
              <strong>Date:</strong> {moment(selectedLog.date).format('MMMM Do YYYY')}
            </>
          ) : (
            'Loading...'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DailyLogs;

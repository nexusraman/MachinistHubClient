import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  TablePagination,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import moment from 'moment';
import MicsData from '../MicsData';
import { useNavigate } from 'react-router-dom';
import SnackbarMessage from '../Utils/Snackbar'; // <-- ensure this path is correct

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
  const [category, setCategory] = useState('submersible');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [submersibleData, setSubmersibleData] = useState([]);
  const [fanData, setFanData] = useState([]);
  const [formattedFanData, setFormattedFanData] = useState([]);
  const [formattedSubData, setFormattedSubData] = useState([]);
  const [searched, setSearched] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      if (category === 'submersible') {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/submersible`);
        setSubmersibleData(res.data);
      } else {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/fan`);
        setFanData(res.data);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch data',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  useEffect(() => {
    const now = new Date();
    const backwardDate = new Date(now);
    if (props.calenderValue === 'weekly') backwardDate.setDate(now.getDate() - 7);
    if (props.calenderValue === 'monthly') backwardDate.setDate(now.getDate() - 30);

    const filterData = (data) => {
      if (props.calenderValue === 'daily') {
        return data.filter((d) => new Date(d.date).toLocaleDateString() === now.toLocaleDateString());
      } else if (props.calenderValue === 'weekly' || props.calenderValue === 'monthly') {
        return data.filter((d) => new Date(d.date).getTime() >= backwardDate.getTime());
      } else if (props.customDates[0] && props.customDates[1]) {
        return data.filter(
          (d) =>
            new Date(d.date).getTime() >= props.customDates[0] &&
            new Date(d.date).getTime() <= props.customDates[1]
        );
      }
      return data;
    };

    setFormattedSubData(filterData(submersibleData).sort((a, b) => new Date(b.date) - new Date(a.date)));
    setFormattedFanData(filterData(fanData).sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [props.calenderValue, fanData, submersibleData, props.customDates]);

  const handleDeleteClick = (item) => {
    setDeleteInfo(item);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const endpoint =
        deleteInfo.category === 'fan' ? '/deleteFan' : '/deleteSub';
      // Sending subIds instead of _id to the backend
      await axios.post(`${process.env.REACT_APP_BACKEND_LINK}${endpoint}`, {
        subId: deleteInfo.subId, 
        category: deleteInfo.category,
        clientName:deleteInfo.client,
      });

      setSnackbar({
        open: true,
        message: 'Deleted successfully',
        severity: 'success'
      });

      fetchData(); // Re-fetch data after deletion
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Failed to delete',
        severity: 'error'
      });
    } finally {
      setDialogOpen(false); // Close the delete confirmation dialog
      setDeleteInfo(null); // Clear the delete info
    }
  };

  const filteredData =
    category === 'fan'
      ? formattedFanData.filter((row) =>
          row.client.toLowerCase().includes(searched.toLowerCase())
        )
      : formattedSubData.filter((row) =>
          row.client.toLowerCase().includes(searched.toLowerCase())
        );

  return (
    <>
      <Card sx={{ m: 2, boxShadow: 3 }}>
        <CardHeader title="Daily Activities" />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Tabs value={category} onChange={(e, val) => setCategory(val)}>
              <Tab label="Submersible" value="submersible" />
              <Tab label="Fan" value="fan" />
            </Tabs>
            <TextField
              size="small"
              placeholder="Search client"
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
                  {(category === 'fan' ? MicsData.fanColumn : MicsData.submersibleColumn).map((col, i) => (
                    <StyledTableCell key={i} align={col.align}>
                      {col.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow key={row.subId}> {/* Use subId here */}
                      <TableCell onClick={() => navigate(`/clients/${row.client}`)}>{row.client}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      {category === 'fan' ? (
                        <>
                          <TableCell>{row.shaftSize}</TableCell>
                          <TableCell>{row.rotorSize}</TableCell>
                        </>
                      ) : (
                        <TableCell>{row.rotorSize}</TableCell>
                      )}
                      <TableCell>{moment(row.date).format('MMMM Do YYYY')}</TableCell>
                      <TableCell>
                        <DeleteForeverIcon
                          sx={{ cursor: 'pointer', color: 'red' }}
                          onClick={() => handleDeleteClick({ subId: row.subId, category, ...row })} 
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
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Box>
            <strong>Client:</strong> {deleteInfo?.client}
          </Box>
          <Box>
            <strong>Quantity:</strong> {deleteInfo?.quantity}
          </Box>
          {category === 'fan' ? (
            <>
              <Box>
                <strong>Shaft Size:</strong> {deleteInfo?.shaftSize}
              </Box>
              <Box>
                <strong>Rotor Size:</strong> {deleteInfo?.rotorSize}
              </Box>
            </>
          ) : (
            <Box>
              <strong>Rotor Size:</strong> {deleteInfo?.rotorSize}
            </Box>
          )}
          <Box>
            <strong>Date:</strong> {moment(deleteInfo?.date).format('MMMM Do YYYY, h:mm a')}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default DailyActivities;

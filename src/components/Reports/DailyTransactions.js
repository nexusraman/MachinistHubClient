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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import moment from 'moment';
import MicsData from '../MicsData';
import SnackbarMessage from '../Utils/Snackbar'; // adjust path if needed

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
    backgroundColor: '#b9dceb'
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const DailyTransactions = (props) => {
  const [category, setCategory] = useState('income');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [formattedIncome, setFormattedIncome] = useState([]);
  const [formattedExpenses, setFormattedExpenses] = useState([]);
  const [searched, setSearched] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchData = async () => {
    try {
      if (category === 'expense') {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/expense`);
        setExpense(res.data);
      } else {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/income`);
        setIncome(res.data);
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

    setFormattedIncome(filterData(income).sort((a, b) => new Date(b.date) - new Date(a.date)));
    setFormattedExpenses(filterData(expense).sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [props.calenderValue, income, expense, props.customDates]);

  const handleDeleteClick = (row) => {
    setDeleteInfo({
      _id: row._id,
      category: category,
      amount: row.amount,
      reason: row.reason,
      payee: row.payee,
      client: row.client,
      date: row.date,
      medium: row.medium,
    });
    setDialogOpen(true);
  };
  
  

  const confirmDelete = async () => {
    try {
      const res=  await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/deleteEntry`, {
        _id: deleteInfo._id,
        category: deleteInfo.category,
      });
      
      setSnackbar({
        open: true,
        message: res.data.message || 'Deleted successfully',
        severity: 'success',
      });
  
      fetchData();
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Failed to delete',
        severity: 'error',
      });
    } finally {
      setDialogOpen(false);
      setDeleteInfo(null);
    }
  };
  

  const filteredExpense = formattedExpenses.filter((row) =>
    (row?.payee || '').toLowerCase().includes(searched.toLowerCase())
  );

  const filteredIncome = formattedIncome.filter((row) =>
    (row?.client || '').toLowerCase().includes(searched.toLowerCase())
  );

  const filteredData = category === 'expense' ? filteredExpense : filteredIncome;

  return (
    <>
      <Card sx={{ m: 2, boxShadow: 3 }}>
        <CardHeader title="Daily Transactions" />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Tabs value={category} onChange={(e, val) => setCategory(val)}>
              <Tab label="Income" value="income" />
              <Tab label="Expenses" value="expense" />
            </Tabs>
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
                  {(category === 'income' ? MicsData.incomeColumn : MicsData.expenseColumn).map((col, i) => (
                    <StyledTableCell key={i} align={col.align}>
                      {col.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <StyledTableRow key={row._id}>
                    <TableCell>{category === 'income' ? row?.client || ' ' : row?.payee || ' '}</TableCell>
                    <TableCell>{row?.amount !== undefined ? row.amount : ' '}</TableCell>
                    <TableCell>{row?.reason || ' '}</TableCell>
                    <TableCell>{row?.date ? moment(row.date).format('MMMM Do YYYY') : ' '}</TableCell>
                    <TableCell>{row?.medium || ' '}</TableCell>
                    <TableCell>
                    <DeleteForeverIcon
  sx={{ cursor: 'pointer', color: 'red' }}
  onClick={() => handleDeleteClick(row)} // Pass the entire row here
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
      <strong>{category === 'income' ? 'Client' : 'Payee'}:</strong> {deleteInfo?.client || deleteInfo?.payee}
    </Box>
    <Box>
      <strong>Amount:</strong> {deleteInfo?.amount !== undefined ? deleteInfo.amount : 'N/A'}
    </Box>
    <Box>
      <strong>Reason:</strong> {deleteInfo?.reason || 'N/A'}
    </Box>
    <Box>
      <strong>Date:</strong> {deleteInfo?.date ? moment(deleteInfo.date).format('MMMM Do YYYY') : 'N/A'}
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
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default DailyTransactions;

import React, { useEffect } from "react"
import EditExpenseDialog from "./components/EditExpenseDialogComponent.jsx";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'price',
    numeric: false,
    disablePadding: true,
    label: 'Amount',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'currency',
    numeric: false,
    disablePadding: false,
    label: 'Currency',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all expenses',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected, selected, handleDelete }) {
  const navigate=useNavigate()
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          className="flex !font-dm-serif !text-3xl align-center"
          component="div"
        >
          Expenses
        </Typography>
      )}
      {numSelected > 0 ? (
       <Tooltip title="Delete">
          <IconButton onClick={() => selected.forEach(handleDelete)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      
      ) : (
        <div className="flex justify-between align-center gap-4" >
          <Tooltip title="New Expense">
          <Button
            variant="contained"
            className="w-40"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/home/addexpense')}
          >
            New Expense
          </Button>
          </Tooltip>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
        
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected:PropTypes.array.isRequired
};

export default function ExpensesPage(){

  const [expenses,setExpenses]=React.useState([])
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isEditing,setIsEditing]= React.useState(false)
  const[editingExpense,setEditingExpense]=React.useState(null)
  
  useEffect(()=>{
    fetchExpenses()
  },[])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = expenses.map((expense) => expense.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - expenses.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...expenses]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [expenses, order, orderBy, page, rowsPerPage],
  );
 
  async function fetchExpenses(){
    try{
      const response = await fetch('/api/expense',{
        method: 'GET',
        headers: {
          'Content-Type':'application/json'
        },
        credentials:'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data) 
        setExpenses(data.expenses) 
      }
    }
    catch(error){
      console.error('Error fetching expenses:', error)
    }
  }

  async function handleDelete(expenseId) {
    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        fetchExpenses(); 
        setSelected([]); 
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(expense){
    setIsEditing(true)
    setEditingExpense(expense)
  }

  function handleDialogClose(){
    setIsEditing(false)
    setEditingExpense(null)
  }

  async function handleUpdateExpense(newExpense){

    try{
      const response=await fetch(`/api/expense/${newExpense.id}`,{
        method:'PUT',
        credentials:'include',
        headers: { 'Content-Type': 'application/json' },
        body:
        JSON.stringify({
          price:newExpense.price,
          description:newExpense.description,
          currency:newExpense.currency,
          category:newExpense.category,
          createdAt:newExpense.createdAt
        })
      })
        if (response.ok) {
          const updatedExpense = await response.json();
          const updatedExpenses = expenses.map(item =>
            item.id === updatedExpense.id ? updatedExpense : item
          );
          setExpenses(updatedExpenses);
          setIsEditing(false);
          setEditingExpense(null);
        } else {
          alert('Failed to update the expense')
        }
      
    }catch (error) {
      console.error('Error:', error)
    }
  }

  return(
    <div className="flex w-full">
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} handleDelete={handleDelete}/>
        <TableContainer>
          <Table
            sx={{ width: '100%' }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={expenses.length}
            />
            <TableBody>
              {visibleRows.map((expense, index) => {
                const isItemSelected = selected.includes(expense.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, expense.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={expense.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {expense.price}
                    </TableCell>
                    <TableCell align="left">{expense.description}</TableCell>
                    <TableCell align="left">{expense.currency}</TableCell>
                    <TableCell align="left">{expense.category}</TableCell>
                    <TableCell align="left">{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={e=>{
                          e.stopPropagation();
                          handleEdit(expense)
                        }}>
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <EditExpenseDialog 
          open={isEditing}
          expense={editingExpense}
          onClose={handleDialogClose}
          onSave={handleUpdateExpense}
        />
        <TablePagination
          rowsPerPageOptions={[7, 14, 21]}
          component="div"
          count={expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
    </Box>
   
    
    </div>
  )
}
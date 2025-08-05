import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import currencies from './currencies';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import categories from './categories';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function EditExpenseDialog({ open, expense, onClose, onSave }) {
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [currency, setCurrency] = React.useState('INR');
  const [category, setCategory] = React.useState('');
  const [date, setDate] = React.useState(null);

  React.useEffect(() => {
    if (expense) {
      setPrice(expense.price || '');
      setDescription(expense.description || '');
      setCurrency(expense.currency || 'INR');
      setCategory(expense.category || '');
      setDate(expense.createdAt ? dayjs(expense.createdAt) : null);
    }
  }, [expense]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    const found = currencies.find(option => option.value === event.target.value);
    
  };


  return (
    <React.Fragment>
      
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit Expense
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        
        <TextField
        required
        label="Amount"
        variant="outlined"
        value={price}
        onChange={e => setPrice(e.target.value)}
        
        slotProps={{
          startAdornment: <InputAdornment position="start">${currency}</InputAdornment>,
        }}
      />
      
      <TextField
        label="Description"
        variant="outlined"
        value={description}
        onChange={e => setDescription(e.target.value)}
        multiline
        maxRows={4}
         
      />
      <TextField
          id="outlined-select-currency"
          select
          label="Currency"
          value={currency}
          onChange={handleCurrencyChange}
          helperText="Please select your currency"
      >
          {currencies.map((currency) => (
            <MenuItem key={currency.value} value={currency.value}>
              {currency.label} {currency.name}
            </MenuItem>
          ))}
        </TextField>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
          autoWidth
          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DatePicker
          label="Date"
          value={date}
          onChange={newValue => setDate(newValue)}
        />
      
    </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {
           const createdAt = date ? date.toISOString() : null;
           onSave({
              ...expense,
              price,
              description,
              currency,
              category,
              createdAt
            });
          }}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

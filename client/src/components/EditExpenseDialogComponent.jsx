import * as React from 'react';
import Button from '@mui/material/Button';
import GlassDialog from './GlassDialog';
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
    <GlassDialog
      open={open}
      onClose={onClose}
      title="Edit Expense"
      actions={
        <Button 
          autoFocus 
          onClick={() => {
            const createdAt = date ? date.toISOString() : null;
            onSave({
              ...expense,
              price,
              description,
              currency,
              category,
              createdAt
            });
          }}
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Save changes
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField
          required
          label="Amount"
          variant="outlined"
          value={price}
          onChange={e => setPrice(e.target.value)}
          slotProps={{
            startAdornment: <InputAdornment position="start">${currency}</InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        />
        
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        />
        
        <TextField
          id="outlined-select-currency"
          select
          label="Currency"
          value={currency}
          onChange={handleCurrencyChange}
          helperText="Please select your currency"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
            '& .MuiFormHelperText-root': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          {currencies.map((currency) => (
            <MenuItem key={currency.value} value={currency.value}>
              {currency.label} {currency.name}
            </MenuItem>
          ))}
        </TextField>
        
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel 
            id="category-select-label"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Category
          </InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            autoWidth
            label="Category"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255, 255, 255, 0.9)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </GlassDialog>
  );
}

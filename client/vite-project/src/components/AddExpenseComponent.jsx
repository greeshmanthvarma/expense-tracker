import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';


export default function AddExpenseComponent() {
  const [categoryInput, setCategoryInput] = React.useState('');
  const [currencyValue,setCurrencyValue]=React.useState('INR');
  const [currencyLabel,setCurrencyLabel]=React.useState('₹');
  const amountInputRef= React.useRef(null)
  const descriptionInputRef=React.useRef(null)

  const currencies = [
    {
      value: 'USD',
      label: '$',
    },
    {
      value: 'EUR',
      label: '€',
    },
    {
      value: 'BTC',
      label: '฿',
    },
    {
      value: 'JPY',
      label: '¥',
    },
    {
      value: 'INR',
      label: '₹'
    }
  ];
  
  const handleCategoryChange = (event) => {
    setCategoryInput(event.target.value);
  };
  const handleCurrencyChange = (event) => {
    setCurrencyValue(event.target.value);
    const found = currencies.find(option => option.value === event.target.value);
    setCurrencyLabel(found ? found.label : '');
  };

  async function addExpense(){
   let price=amountInputRef.current.value
   let description=descriptionInputRef.current.value
   let currency=currencyValue
   let category=categoryInput
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({ price, description, currency, category })
      })

      if (!response.ok) {
        throw new Error('Failed to create expense')
      }

      
      amountInputRef.current.value = '' 
      descriptionInputRef.current.value=''
      
    } catch (error) {
      console.error('Error creating expense:', error)
      alert(error.message)
    }
  }

  return (
    <div className='flex'>
      <div className='flex w-24'>
      <TextField
        required
        id="amount-input"
        label="Amount"
        variant="outlined"
        inputRef={amountInputRef} 
        slotProps={{
          startAdornment: <InputAdornment position="start">{currencyLabel}</InputAdornment>,
        }}
      />
      </div>
      <TextField
        id="description-input"
        label="Description"
        variant="outlined"
        multiline
        maxRows={4}
        inputRef={descriptionInputRef} 
      />
      <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="INR"
          helperText="Please select your currency"
          onChange={handleCurrencyChange}
      >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={categoryInput}
          onChange={handleCategoryChange}
          autoWidth
          label="Category"
        >
          
          <MenuItem value={"Food"}>Food</MenuItem>
          <MenuItem value={"Entertainment"}>Entertainment</MenuItem>
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
      </FormControl>
      <button className="w-full rounded-md border-1 border-gray-200 bg-white text-black cursor-pointer" onClick={addExpense}>
        Add Expense
      </button>
    </div>
  );
}

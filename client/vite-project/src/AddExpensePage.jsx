import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import categories from './components/categories';
import currencies from './components/currencies';

export default function AddExpensePage(){
  const [isUploading,setIsUploading]=React.useState(false)
  const [selectedFileName, setSelectedFileName] = React.useState('')
  const [categoryInput, setCategoryInput] = React.useState('');
  const [currencyValue,setCurrencyValue]=React.useState('INR');
  const [currencyLabel,setCurrencyLabel]=React.useState('₹');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const navigate=useNavigate()

  const handleCategoryChange = (event) => {
    setCategoryInput(event.target.value);
  };
  const handleCurrencyChange = (event) => {
    setCurrencyValue(event.target.value);
    const found = currencies.find(option => option.value === event.target.value);
    setCurrencyLabel(found ? found.label : '');
  };

  async function addExpense(){
   let currency=currencyValue
   let category=categoryInput
   const createdAt = date ? date.toISOString() : null;
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({ price, description, currency, category, createdAt })
      })

      if (!response.ok) {
        throw new Error('Failed to create expense')
      }
      
      navigate('/home/expenses')
    } catch (error) {
      console.error('Error creating expense:', error)
      alert(error.message)
    }
  }
  
  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      setSelectedFileName(file.name)
    } else {
      setSelectedFileName('')
    }
  }

  async function uploadFile(){
    const file = fileInputRef.current.files[0]
    if (!file) {
      alert('Please select a file first')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/receipt', {
        method: 'POST',
        credentials:'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const aiExpense = await response.json();
      console.log('Upload successful:', aiExpense)
      setPrice(aiExpense.price || '');
      setCurrencyValue(aiExpense.currency || 'INR');
      setCategoryInput(aiExpense.category || '');
      setDescription(aiExpense.description || ''); 
      if (aiExpense.createdAt) setDate(dayjs(aiExpense.createdAt));
      fileInputRef.current.value = '' 
      setSelectedFileName('')
     
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to upload file: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  React.useEffect(() => {
    const found = currencies.find(option => option.value === currencyValue);
    setCurrencyLabel(found ? found.label : '');
  }, [currencyValue]);

  React.useEffect(() => {
    console.log('Updated state:', price, currencyValue, categoryInput, description, date);
  }, [price, currencyValue, categoryInput, description, date]);

  return(
   <div className='flex flex-col'>
    <div className='border-r'>
    <div className='flex w-full space-between'>
      <div className='flex w-48'>
      <TextField
        required
        id="amount-input"
        label="Amount"
        variant="outlined"
        value={price}
        onChange={e => setPrice(e.target.value)} 
        slotProps={{
          startAdornment: <InputAdornment position="start">${currencyLabel}</InputAdornment>,
        }}
      />
      </div>
      <TextField
        id="description-input"
        label="Description"
        variant="outlined"
        multiline
        maxRows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
          id="outlined-select-currency"
          select
          label="Currency"
          value={currencyValue}
          helperText="Please select your currency"
          onChange={handleCurrencyChange}
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
          value={categoryInput}
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

      <button className="w-24 rounded-md border-1 border-gray-200 bg-white text-black cursor-pointer" onClick={addExpense}>
        Add Expense
      </button>
    </div>
    </div>
    <div className='flex flex-col'>
      <p className="font-dm-serif text-xl mb-6"> Create using AI </p>
        <form id="upload-form" encType="multipart/form-data">
        <label>
            <div className="px-4 py-2 w-auto mb-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer">
              Add File
            </div>
              <input 
                className="hidden" 
                type="file" 
                name="avatar" 
                accept="image/*"
                ref={fileInputRef}
                disabled={isUploading}
                onChange={handleFileSelect}
              />
          </label> 
          {selectedFileName ? (
            <p className="text-sm text-gray-600 mt-2">{selectedFileName}</p>
          ) : <p> </p>}
          <button 
            type="button" 
            className={`px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 
              ${isUploading ? 'cursor-not-allowed opacity-50 ': 'cursor-pointer'}
              `} 
            onClick={uploadFile}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>    
    </div>
   </div>
  )

  
}
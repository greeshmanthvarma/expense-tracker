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
import { useAuth } from '../AuthContext';

export default function AddExpenseDialog({ open, onClose, onSave }) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState('');
  const [categoryInput, setCategoryInput] = React.useState('');
  const [currencyValue, setCurrencyValue] = React.useState(user?.currency || 'USD');
  const [currencyLabel, setCurrencyLabel] = React.useState('$');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    const found = currencies.find(option => option.value === currencyValue);
    setCurrencyLabel(found ? found.label : '$');
  }, [currencyValue]);

  React.useEffect(() => {
    if (user?.currency) {
      setCurrencyValue(user.currency);
    }
  }, [user?.currency]);

  React.useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setPrice('');
      setDescription('');
      setCategoryInput('');
      setCurrencyValue(user?.currency || 'USD');
      setDate(null);
      setSelectedFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, user?.currency]);

  const handleCategoryChange = (event) => {
    setCategoryInput(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrencyValue(event.target.value);
    const found = currencies.find(option => option.value === event.target.value);
    setCurrencyLabel(found ? found.label : '$');
  };

  async function handleSave() {
    const createdAt = date ? date.toISOString() : null;
    await onSave({ price, description, currency: currencyValue, category: categoryInput, createdAt });
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName('');
    }
  }

  async function uploadFile() {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Please select a file first');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload/receipt', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const aiExpense = await response.json();
      setPrice(aiExpense.price || '');
      setCurrencyValue(aiExpense.currency || user?.currency || 'USD');
      setCategoryInput(aiExpense.category || '');
      setDescription(aiExpense.description || '');
      if (aiExpense.createdAt) setDate(dayjs(aiExpense.createdAt));
      fileInputRef.current.value = '';
      setSelectedFileName('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  }

  const textFieldSx = {
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
  };

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      title="Add Expense"
      maxWidth="md"
      actions={
        <Button
          autoFocus
          onClick={handleSave}
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Add Expense
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            required
            label="Amount"
            variant="outlined"
            value={price}
            onChange={e => setPrice(e.target.value)}
            slotProps={{
              startAdornment: <InputAdornment position="start">{currencyLabel}</InputAdornment>,
            }}
            sx={textFieldSx}
          />
          
          <TextField
            id="outlined-select-currency"
            select
            label="Currency"
            value={currencyValue}
            onChange={handleCurrencyChange}
            helperText="Please select your currency"
            sx={textFieldSx}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label} {currency.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          maxRows={4}
          sx={textFieldSx}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormControl sx={{ minWidth: 120 }}>
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
              value={categoryInput}
              onChange={handleCategoryChange}
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

        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/80 mb-4 font-semibold">Create using AI</p>
          <form id="upload-form" encType="multipart/form-data" className="flex flex-col gap-2">
            <label>
              <div className="px-4 py-2 w-32 mb-2 bg-white/10 rounded hover:bg-white/20 cursor-pointer text-white/90 text-center">
                {selectedFileName ? selectedFileName : 'Select File'}
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
            <Button
              type="button"
              variant="outlined"
              onClick={uploadFile}
              disabled={isUploading || !selectedFileName}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
                '&:disabled': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload Receipt'}
            </Button>
          </form>
        </div>
      </div>
    </GlassDialog>
  );
}


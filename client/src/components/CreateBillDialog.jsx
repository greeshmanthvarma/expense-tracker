import * as React from 'react';
import Button from '@mui/material/Button';
import GlassDialog from './GlassDialog';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';

export default function CreateBillDialog({ open, group, user, onClose, onSave }) {
  const [description, setDescription] = React.useState('')
  const [totalAmount, setTotalAmount] = React.useState('');
  const [error, setError] = React.useState(null);
  const [expenseItems, setExpenseItems] = React.useState([])
  const [selectedFileName, setSelectedFileName] = React.useState('')
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false)
  const [payerId, setPayerId] = React.useState(null)
  const theme = useTheme();


  React.useEffect(() => {
    setTotalAmount('');

    setError(null)
    setDescription('')
    setSelectedFileName('')
  }, [open, group, user]);

  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      setSelectedFileName(file.name)
    } else {
      setSelectedFileName('')
    }
  }

  async function uploadFile() {
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

      const response = await fetch('/api/upload/bill', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const aiBill = await response.json();
      console.log('Upload successful:', aiBill)


      const { itemDetails, billDetails } = aiBill;


      const processedItems = itemDetails.map(item => ({
        ...item,
        owers: item.owers || []
      }));

      setTotalAmount(billDetails.totalAmount)
      setDescription(billDetails.description)
      setExpenseItems(processedItems)
      setSelectedFileName('')

    } catch (error) {
      console.error('Error:', error)
      setError('Failed to upload file: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  function handleExpenseItemChange(index, field, value) {
    const updatedExpenseItems = expenseItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setExpenseItems(updatedExpenseItems)
  }

  function getStyles(friendId, selectedFriendIds, theme) {
    return {
      fontWeight: (selectedFriendIds || []).includes(friendId)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  function handleOwersChange(index, owers) {
    const updatedExpenseItems = expenseItems.map((item, i) => {
      if (i === index) {
        owers = (typeof owers === 'string') ? owers.split(',') : owers;
        return { ...item, owers }
      }
      return item
    })
    setExpenseItems(updatedExpenseItems)
  };


  const handleSaveClick = () => {

    onSave({
      description,
      totalAmount,
      payerId,
      expenseItems
    });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
  };

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      title="Create Bill with AI"
      maxWidth="md"
      actions={
        <Button
          autoFocus
          onClick={handleSaveClick}
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Save Changes
        </Button>
      }
    >
      <div className="flex flex-col gap-4">

        <TextField
          required
          label="Total Amount"
          variant="outlined"
          value={totalAmount}
          onChange={e => {
            const value = parseFloat(e.target.value);
            if (value < 0) {
              setError('Total amount must be a positive number');
              return;
            }
            setError(null);
            setTotalAmount(value);
          }}
          sx={textFieldSx}
        />
        <TextField
          required
          label="Description"
          variant="outlined"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
          sx={textFieldSx}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel
            id="payer-select-label"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Paid By (Entire Bill)
          </InputLabel>
          <Select
            labelId="payer-select-label"
            id="payer-select"
            value={payerId || ''}
            onChange={e => setPayerId(e.target.value)}
            label="Paid By"
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
              {
                group?.members?.map(member => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.id === user?.id ? 'You' : member.username}
                  </MenuItem>
                )) || []
            }
          </Select>
        </FormControl>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex flex-col gap-4">
          {expenseItems.map((item, index) => (
            <div key={index} className="p-4 border border-white/10 rounded-lg">
              <div className="flex flex-col gap-3">
                <TextField
                  required
                  label="Description"
                  variant="outlined"
                  value={item.description}
                  onChange={e => {
                    handleExpenseItemChange(index, 'description', e.target.value)
                  }}
                  sx={textFieldSx}
                />
                <TextField
                  required
                  label="Amount"
                  variant="outlined"
                  value={item.price}
                  onChange={e => {
                    handleExpenseItemChange(index, 'price', e.target.value)
                  }}
                  sx={textFieldSx}
                />
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel
                    id={`owers-select-label-${index}`}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': {
                        color: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Select Members
                  </InputLabel>
                  <Select
                    labelId={`owers-select-label-${index}`}
                    id={`owers-select-${index}`}
                    multiple
                    value={item.owers || []}
                    onChange={e => handleOwersChange(index, e.target.value)}
                    input={<OutlinedInput id={`select-multiple-chip-${index}`} label="Select Members" />}
                    renderValue={(selectedIds) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedIds.map((id) => {
                          const member = group?.members?.find(member => member.id === id);
                          return <Chip key={id} label={member ? member.username : id} sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)' }} />;
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
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
                    {group?.members?.map((member) => (
                      <MenuItem
                        key={member.id}
                        value={member.id}
                        style={getStyles(member.id, item.owers, theme)}
                      >
                        {member.username}
                      </MenuItem>
                    )) || []}
                  </Select>
                </FormControl>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-4 pt-4 border-t border-white/10'>
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


















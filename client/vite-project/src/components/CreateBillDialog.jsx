import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

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

  return (
    <React.Fragment>

      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Group Expense
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
          />
          <TextField
            required
            label="Description"
            variant="outlined"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Paid By (Entire Bill)</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={payerId || ''}
              onChange={e => setPayerId(e.target.value)}
              label="Paid By"
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div>
            {
              expenseItems.map((item, index) => (
                <div key={index}>
                  <TextField
                    required
                    label="Description"
                    variant="outlined"
                    value={item.description}
                    onChange={e => {
                      handleExpenseItemChange(index, 'name', e.target.value)
                    }}
                  />
                  <TextField
                    required
                    label="Amount"
                    variant="outlined"
                    value={item.price}
                    onChange={e => {
                      handleExpenseItemChange(index, 'amount', e.target.value)
                    }}
                  />
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="multiple-friend-select-label">Select Members</InputLabel>
                    <Select
                      labelId="multiple-friend-select-label"
                      id="multiple-chip"
                      multiple
                      value={item.owers}
                      onChange={e => handleOwersChange(index, e.target.value)}
                      input={<OutlinedInput id="select-multiple-chip" label="Select Members" />}
                      renderValue={(selectedIds) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedIds.map((id) => {
                            // Find the member object to display the username
                            const member = group?.members?.find(member => member.id === id);
                            // Display the username in the Chip, fallback to id if not found
                            return <Chip key={id} label={member ? member.username : id} />;
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
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

              ))
            }

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
              ${isUploading ? 'cursor-not-allowed opacity-50 ' : 'cursor-pointer'}
              `}
                onClick={uploadFile}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSaveClick}>
            Save Changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}


















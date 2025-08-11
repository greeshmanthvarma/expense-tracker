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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PercentIcon from '@mui/icons-material/Percent';
import PieChartIcon from '@mui/icons-material/PieChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function EditGroupDialog({ open, group, onClose, onSave}) {
  
  const [totalAmount, setTotalAmount] = React.useState('');
  const [friends, setFriends] = React.useState([]);
  const [name, setName] = React.useState('');
  const [selectedFriends, setSelectedFriends] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [paidById, setPaidById] = React.useState(null);
  const [splitSelect, setSplitSelect] = React.useState('amount');
  
  
  
  React.useEffect(() => {
    
  }, []);

  const handleChange = (event) => {
      setPaidById(event.target.value);
    };
  
  const handleSplitSelectChange = (event) => {
      setSplitSelect(event.target.value);
    };
  
  function createSplit(){

  }
    const handleSaveClick = () => {
    if (!name.trim()) {
      alert("Group name cannot be empty.");
      return;
    }
    if (selectedFriends.length === 0) {
      alert("Please select at least one member for the group.");
      return;
    }
    
    onSave({ 
      id: group.id,
      name, 
      members: selectedFriends 
    });
  };

  

  return (
    <React.Fragment>
      
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit Group
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
        label="Group Name"
        variant="outlined"
        value={totalAmount}
        onChange={e => setTotalAmount(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Paid By</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={paidById}
          onChange={handleChange}
          label="Paid By"
        >
         {
          group.members.map(member => (
            <MenuItem key={member.id} value={member.id}>
              {member.username}
            </MenuItem>
          ))
        }
         </Select>
      </FormControl>
    </div>
    <ToggleButtonGroup
      color="primary"
      value={splitSelect}
      exclusive
      onChange={handleSplitSelectChange}
      aria-label="Platform"
    >
      <ToggleButton value="amount"> <AttachMoneyIcon fontSize="small" /> Amount</ToggleButton>
      <ToggleButton value="share"> <PieChartIcon fontSize="small" /> Share</ToggleButton>
      <ToggleButton value="percentage"> <PercentIcon fontSize="small" /> Percentage</ToggleButton>
    </ToggleButtonGroup>
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












  
  

  

 
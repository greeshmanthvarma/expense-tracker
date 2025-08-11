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

export default function EditGroupDialog({ open, group, onClose, onSave, friends}) {
  
  const [name, setName] = React.useState('');
  const [selectedFriends, setSelectedFriends] = React.useState([]);
  const [error, setError] = React.useState(null);
  const theme = useTheme();
  
  React.useEffect(() => {
    if (group) {
      setName(group.name || '');
      setSelectedFriends(group.members.map(member => member.id));
    } else {
      setName('');
      setSelectedFriends([]);
    }
  }, [group]);

  function getStyles(friendId, selectedFriendIds, theme) {
    return {
      fontWeight: selectedFriendIds.includes(friendId)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }
  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFriends(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleSaveClick = () => {
    if (!name.trim()) {
      alert("Group name cannot be empty.");
      return;
    }
    if (selectedFriends.length === 0) {
      alert("Please select at least one member for the group.");
      return;
    }
    // Pass the group's ID back along with the updated name and members
    onSave({ 
      id: group.id,
      name, 
      members: selectedFriends 
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
        value={name}
        onChange={e => setName(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-friend-select-label">Select Members</InputLabel>
        <Select
          labelId="multiple-friend-select-label"
          id="multiple-chip"
          multiple
          value={selectedFriends}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Select Members" />}
          renderValue={(selectedIds) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedIds.map((id) => {
                // The `group` prop contains the full member objects for everyone currently in the group.
                // We use this as the source of truth to find the username for the chips.
                const member = group?.members.find(m => m.id === id);
                return <Chip key={id} label={member ? member.username : ''} />;
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {friends.map((friend) => (
            <MenuItem
              key={friend.id}
              value={friend.id}
              style={getStyles(friend.id, selectedFriends, theme)}
            >
              {friend.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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












  
  

  

 
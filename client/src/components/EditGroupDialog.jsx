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
      title="Edit Group"
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
          label="Group Name"
          variant="outlined"
          value={name}
          onChange={e => setName(e.target.value)}
          sx={textFieldSx}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <FormControl sx={{ width: '100%' }}>
          <InputLabel
            id="multiple-friend-select-label"
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
            labelId="multiple-friend-select-label"
            id="multiple-chip"
            multiple
            value={selectedFriends}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Select Members" />}
            renderValue={(selectedIds) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedIds.map((id) => {
                  const member = group?.members.find(m => m.id === id);
                  return <Chip key={id} label={member ? member.username : ''} sx={{ background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.9)' }} />;
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
    </GlassDialog>
  );
}












  
  

  

 
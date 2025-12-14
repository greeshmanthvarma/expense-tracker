import * as React from 'react';
import Button from '@mui/material/Button';
import GlassDialog from './GlassDialog';
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

export default function CreateGroupExpenseDialog({ open, group,user, onClose, onSave}) {
  const [title,setTitle]= React.useState('')
  const [totalAmount, setTotalAmount] = React.useState('');
  const [error, setError] = React.useState(null);
  const [paidById, setPaidById] = React.useState(null);
  const [splitSelect, setSplitSelect] = React.useState('amount');
  const [splits,setSplits]=React.useState([])
  const[remainingAmount,setRemainingAmount]=React.useState('')
  const[totalShares,setTotalShares]=React.useState(0)
  const [isUploading,setIsUploading]=React.useState(false)

  React.useEffect(() => {
    setTotalAmount(''); 
    setSplitSelect('amount');
    setTotalShares(group?.members?.length || 0); 
    setPaidById(null)
    setError(null)
    setTitle('')
    const initialSplits= group?.members?.map(member=>({
      memberId:member.id,
      amount:0,
      share:1,
      percent:100
    })) || []
    setSplits(initialSplits)
  }, [open, group, user]);

  React.useEffect(() => {
    if (!group?.members?.length) return; 
    const total = parseFloat(totalAmount);
    if (isNaN(total)) {
      setError('Invalid total amount');
      return;
    }

    
    const updatedSplits = group.members.map(member => ({
      memberId: member.id,
      amount: total / group.members.length,
      share: 1,
      percent: 100 / group.members.length,
    }));

    setSplits(updatedSplits);
  }, [totalAmount, group?.members]);
  
  const handleChange = (event) => {
      const newPayerId = event.target.value;
      setPaidById(newPayerId)
    };
  
  const handleSplitSelectChange = (event) => {
      setSplitSelect(event.target.value);
    };
  

  function handleAmountSplitChange(memberId, newAmount) {
    const total= parseFloat(totalAmount)
    const updatedSplits = splits.map(item =>
      item.memberId === memberId ? { ...item, amount: newAmount } : item
    );
    setSplits(updatedSplits);
  
    const totalAssigned = updatedSplits.reduce((sum, item) => sum + (item.amount || 0), 0);
    setRemainingAmount(total - totalAssigned);
  }

  function handleSharesSplitChange(memberId, action) {
    const total= parseFloat(totalAmount)
    const updatedSplits = splits.map(split => {
     if (split.memberId === memberId) {
        let updatedShare = split.share || 1;
        if (action === 'add') updatedShare += 1;
        else if (action === 'sub' && updatedShare > 1) updatedShare -= 1;
        return { ...split, share: updatedShare };
      }
      return split;
    });
  
    setSplits(updatedSplits);
  
    const totalShares = updatedSplits.reduce((sum, split) => sum + (split.share || 0), 0);
    setTotalShares(totalShares);
  
    const updatedAmounts = updatedSplits.map(split => ({
      ...split,
      amount: (split.share / totalShares) * total,
    }));
    setSplits(updatedAmounts);
  }

  function handlePercentSplitChange(memberId, percent) {
    const total= parseFloat(totalAmount)
    const newPercent = parseFloat(percent);
    const updatedSplits = splits.map(item =>
      item.memberId === memberId ? { ...item, percent: newPercent } : item
    );
    const updatedAmounts = updatedSplits.map(item => ({
      ...item,
      amount: (item.percent / 100) * total,
    }));
  
    setSplits(updatedAmounts);
  }  

    const handleSaveClick = () => {
    
    onSave({ 
      title,
      paidById,
      totalAmount,
      splits
    });
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
      title="Create Group Expense"
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
          label="Title"
          variant="outlined"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          sx={textFieldSx}
        />
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
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel
            id="paid-by-select-label"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Paid By
          </InputLabel>
          <Select
            labelId="paid-by-select-label"
            id="paid-by-select"
            value={paidById || ''}
            onChange={handleChange}
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
              {member.id===user?.id ? 'You': member.username}
            </MenuItem>
          )) || []
        }
          </Select>
        </FormControl>
        {
          (totalAmount > 0) ? (
            <div className="flex flex-col gap-4">
              <ToggleButtonGroup
                value={splitSelect}
                exclusive
                onChange={handleSplitSelectChange}
                aria-label="Split method"
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&.Mui-selected': {
                      color: 'rgba(255, 255, 255, 1)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                  },
                }}
              >
                <ToggleButton value="amount"> <AttachMoneyIcon fontSize="small" /> Amount</ToggleButton>
                <ToggleButton value="share"> <PieChartIcon fontSize="small" /> Share </ToggleButton>
                <ToggleButton value="percentage"> <PercentIcon fontSize="small" /> Percentage </ToggleButton>
              </ToggleButtonGroup>
              {error && <p className='text-red-400 text-sm mt-2'>{error}</p>}
              <div className="flex flex-col gap-2">
                {remainingAmount !== 0 && (
                  <p className='text-red-400'>Remaining Amount: {remainingAmount}</p>
                )}
                
                {splitSelect === 'amount' ? (
                  group.members.map(member => (
                    <div key={member.id} className='flex justify-between items-center gap-4'>
                      <p className="text-white/90">{(member.id === user?.id) ? 'You' : member.username}</p>
                      <TextField
                        required
                        label="Amount Owed"
                        variant="outlined"
                        value={splits?.find(item => item.memberId === member.id)?.amount || ''}
                        onChange={e => handleAmountSplitChange(member.id, e.target.value)}
                        sx={textFieldSx}
                      />
                    </div>
                  ))
                ) : splitSelect === 'share' ? (
                  group.members.map(member => (
                    <div key={member.id} className='flex justify-between items-center gap-4'>
                      <p className="text-white/90">{(member.id === user?.id) ? 'You' : member.username}</p>
                      <span className="text-white/80">{splits?.find(item => item.memberId === member.id)?.amount || 0}</span>
                      <div className='flex gap-2 items-center'>
                        <Button
                          onClick={() => handleSharesSplitChange(member.id, 'add')}
                          sx={{ minWidth: '32px', color: 'rgba(255, 255, 255, 0.9)' }}
                        >
                          +
                        </Button>
                        <span className="text-white/90">{splits?.find(split => split.memberId === member.id)?.share || 1}</span>
                        <Button
                          onClick={() => handleSharesSplitChange(member.id, 'sub')}
                          sx={{ minWidth: '32px', color: 'rgba(255, 255, 255, 0.9)' }}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  ))
                ) : splitSelect === 'percentage' ? (
                  group.members.map(member => (
                    <div key={member.id} className='flex justify-between items-center gap-4'>
                      <p className="text-white/90">{(member.id === user?.id) ? 'You' : member.username}</p>
                      <div className='flex gap-2 items-center'>
                        <span className="text-white/80">{splits?.find(item => item.memberId === member.id)?.amount || ''}</span>
                        <TextField
                          required
                          label="Percentage"
                          variant="outlined"
                          value={splits?.find(item => item.memberId === member.id)?.percent || 50}
                          onChange={e => handlePercentSplitChange(member.id, e.target.value)}
                          sx={textFieldSx}
                        />
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          ) : null
        }
      </div>
    </GlassDialog>
  );
}


















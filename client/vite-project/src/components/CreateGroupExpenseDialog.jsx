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

export default function CreateGroupExpenseDialog({ open, group,user, onClose, onSave}) {
  const [title,setTitle]= React.useState('')
  const [totalAmount, setTotalAmount] = React.useState('');
  const [error, setError] = React.useState(null);
  const [paidById, setPaidById] = React.useState(null);
  const [splitSelect, setSplitSelect] = React.useState('amount');
  const [splits,setSplits]=React.useState([])
  const[remainingAmount,setRemainingAmount]=React.useState('')
  const[totalShares,setTotalShares]=React.useState(0)
  

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
        label="Title"
        variant="outlined"
        value={title}
        onChange={e => {
          setTitle(e.target.value);
        }}
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
          group?.members?.map(member => (
            <MenuItem key={member.id} value={member.id}>
              {member.id===user?.id ? 'You': member.username}
            </MenuItem>
          )) || []
        }
         </Select>
      </FormControl>
    </div>
    {
      (totalAmount >0 ) ? (
      <div>
      <ToggleButtonGroup
      color="primary"
      value={splitSelect}
      exclusive
      onChange={handleSplitSelectChange}
      aria-label="Platform"
    >
      <ToggleButton value="amount"> <AttachMoneyIcon fontSize="small" /> Amount</ToggleButton>
      <ToggleButton value="share"> <PieChartIcon fontSize="small" /> Share </ToggleButton>
      <ToggleButton value="percentage"> <PercentIcon fontSize="small" /> Percentage </ToggleButton>
    </ToggleButtonGroup>
    {
      (error)?(
        <p className='text-red-500 text-sm mt-2'>{error}</p>
      ):''
    }
    <div>
      {
        remainingAmount !==0 ? (
          <p className='text-red'>Remaining Amount: {remainingAmount}</p>
        ):''
      }
      
      {
        splitSelect=== 'amount' ?(
        
          group.members.map(member =>(
            <div key={member.id} className='flex justify-between'>
              <p>{(member.id === user?.id) ? 'You': member.username}</p>
              <TextField
                required
                label="Amount Owed"
                variant="outlined"
                value={splits?.find(item=> item.memberId===member.id)?.amount || 0 }
                onChange={e => handleAmountSplitChange(member.id,e.target.value)}
              />
            </div>
          ))
        ):splitSelect=== 'share'? (
          group.members.map(member =>(
            <div key={member.id} className='flex justify-between'>
              <p>{(member.id === user?.id) ? 'You': member.username}</p>
              {splits?.find(item=> item.memberId===member.id)?.amount || 0}
              <div className='flex gap-2'>
              <button onClick={() => handleSharesSplitChange(member.id, 'add')}> + </button>
              {splits?.find(split => split.memberId === member.id)?.share || 1}
              <button onClick={() => handleSharesSplitChange(member.id, 'sub')}> - </button>
              </div>
            </div>
          ))
        ) : splitSelect === 'percentage' ? (
          group.members.map(member => (
            <div key={member.id} className='flex justify-between'>
              <p>{(member.id === user?.id) ? 'You': member.username}</p>
              <div className='flex gap-2'>
                {splits?.find(item=> item.memberId===member.id)?.amount || 0}
                <TextField
                  required
                  label="Amount Owed"
                  variant="outlined"
                  value={splits?.find(item=> item.memberId===member.id)?.percent || 50}
                  onChange={e => handlePercentSplitChange(member.id, e.target.value)}
                />
              </div>
            </div>
          ))
        ) : null
      }
      </div>
     </div> 
    ) : ''
  }
    
    
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


















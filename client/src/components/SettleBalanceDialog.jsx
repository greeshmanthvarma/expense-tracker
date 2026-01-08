import * as React from 'react';
import Button from '@mui/material/Button';
import GlassDialog from './GlassDialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import currencies from './currencies';

export default function SettleBalanceDialog({ open, group, payer, receiver, amount, user, onClose, onSave }) {
  const [error, setError] = React.useState(null);
  const [payerState, setPayerState] = React.useState(null);
  const [receiverState, setReceiverState] = React.useState(null);
  const [settlementAmount, setSettlementAmount] = React.useState('');
  const maxAmount = Math.abs(amount || 0);
  const currencySymbol = currencies.find(c => c.value === (user?.currency || 'USD'))?.label || '$';

  React.useEffect(() => {
    if (open) {
      setPayerState(payer);
      setReceiverState(receiver);
      setSettlementAmount(maxAmount.toFixed(2));
      setError(null);
    }
  }, [open, payer, receiver, maxAmount])

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

  function handleSave() {
    const parsedAmount = parseFloat(settlementAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (parsedAmount > maxAmount) {
      setError(`Amount cannot exceed ${maxAmount.toFixed(2)}`);
      return;
    }

    onSave(payerState?.id, receiverState?.id, parsedAmount);
  }
  
  return (
    <GlassDialog 
      open={open} 
      onClose={onClose} 
      title="Settle Balance"
      actions={
        <>
          <Button 
            onClick={onClose}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              bgcolor: 'rgba(59, 130, 246, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(59, 130, 246, 1)',
              },
            }}
          >
            Settle Balance
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-4'>
        <p className='text-white'>Payer: {payerState?.username}</p>
        <p className='text-white'>Receiver: {receiverState?.username}</p>
        <p className='text-white/70'>Balance: {currencySymbol}{maxAmount.toFixed(2)}</p>
        <TextField
          label="Settlement Amount"
          variant="outlined"
          type="number"
          value={settlementAmount}
          onChange={e => {
            setSettlementAmount(e.target.value);
            setError(null);
          }}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
          }}
          sx={textFieldSx}
        />
        <Button
          size="small"
          onClick={() => setSettlementAmount(maxAmount.toFixed(2))}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Use Full Amount
        </Button>
      </div>
    </GlassDialog>
  )
}
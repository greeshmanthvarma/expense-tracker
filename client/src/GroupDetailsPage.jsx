import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import CreateGroupExpenseDialog from './components/CreateGroupExpenseDialog';
import CreateBillDialog from './components/CreateBillDialog'
import AnimatedTabs from './components/animatedTabs';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import currencies from './components/currencies';
import { Button } from './components/ui/button';
import SettleBalanceDialog from './components/SettleBalanceDialog';

export default function GroupPage() {

  const { groupId } = useParams()
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [group, setGroup] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [groupExpenses, setGroupExpenses] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [totalToPay, setTotalToPay] = React.useState(0)
  const [totalOwed, setTotalOwed] = React.useState(0)
  const [totalExpenses, setTotalExpenses] = React.useState(0)
  const [selectedTab, setSelectedTab] = React.useState('expenses')
  const [isCreatingBill, setIsCreatingBill] = React.useState(false)
  const [groupBills, setGroupBills] = React.useState([])
  const [balances, setBalances] = React.useState([])
  const [settlements, setSettlements] = React.useState([])
  const [isSettlingBalance, setIsSettlingBalance] = React.useState(false)
  const [payer, setPayer] = React.useState(null)
  const [receiver, setReceiver] = React.useState(null)
  const [amount, setAmount] = React.useState(0)
  const navigate=useNavigate()

  const tabs = [
    { id: "expenses", label: "Expenses" },
    { id: "bills", label: "Bills" },
    { id: "members", label: "Members" },
    { id: "balances", label: "Balances" }
  ]

  React.useEffect(() => {
    fetchGroup();
    fetchGroupExpenses();
    fetchGroupBills();
    fetchSettlements();
  }, [])

  React.useEffect(() => {
    if (groupExpenses.length > 0 || groupBills.length > 0) {
      calculateTotals()
      calculateBalances()
    }
  }, [])

  React.useEffect(() => {
    if (groupExpenses || groupBills || settlements.length > 0) {
      calculateTotals()
      calculateBalances() 
    }
  }, [groupExpenses, groupBills, settlements])

  
  async function fetchSettlements(){
    try{
      const response = await fetch(`/api/groups/${groupId}/settlements`)
      if (!response.ok) throw new Error('Failed to fetch settlements');
      const data = await response.json();
      setSettlements(data?.settlements || [])
    }catch(error){
      console.error('Error fetching settlements:', error);
      setError('Failed to load settlements')
    }
  }

  async function handleSettleBalance(payerId, receiverId, amount){
    try{
      const response = await fetch(`/api/groups/${groupId}/settle-balance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payerId, receiverId, amount }),
      })
      if (!response.ok) throw new Error('Failed to settle balance');
      await fetchSettlements();
      setIsSettlingBalance(false);
      setError(null);
    }catch(error){
      console.error('Error settling balance:', error);
      setError('Failed to settle balance');
    }
  }

  function calculateTotals() {
    const totalSum = groupExpenses.reduce((sum, expense) => sum + parseFloat(expense.totalAmount), 0)
    const totalBills = groupBills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0)
    setTotalExpenses(totalSum + totalBills)
  }

  function calculateBalances() {
    const balances = {}
    groupExpenses.forEach(expense => {
      if (!expense.expenseSplit || !Array.isArray(expense.expenseSplit)) return
      
      if (expense.paidById === user.id) {
        expense.expenseSplit.forEach(split => {
          if (split.userId !== user.id) {
            balances[split.userId] = (balances[split.userId] || 0) - parseFloat(split.amountOwed || 0)
          }
        })
      }
      else if (expense.paidById !== user.id) {
        expense.expenseSplit.forEach(split => {
          if (split.userId === user.id) {
            balances[expense.paidById] = (balances[expense.paidById] || 0) + parseFloat(split.amountOwed || 0)
          }
        })
      }
    })
    groupBills.forEach(bill => {
      if (!bill.items || !Array.isArray(bill.items)) return
      
      if(bill.payerId === user.id){
        bill.items.forEach(item => {
          if (item.owers && Array.isArray(item.owers) && item.owers.length > 0) {
            const sharePerOwer = parseFloat(item.price || 0) / item.owers.length
            item.owers.forEach(ower => {
              if (ower.id !== user.id) {
                balances[ower.id] = (balances[ower.id] || 0) - sharePerOwer
              }
            })
          }
        })
      }
      else if(bill.payerId !== user.id){
        bill.items.forEach(item => {
          if(item.owers && Array.isArray(item.owers) && item.owers.length > 0 && item.owers.some(ower => ower.id === user.id)){
            const sharePerOwer = parseFloat(item.price || 0) / item.owers.length
            balances[bill.payerId] = (balances[bill.payerId] || 0) + sharePerOwer
      }
    })
      }
    })
    settlements.forEach(settlement => {
      if(settlement.payerId === user.id){
        balances[settlement.receiverId] = (balances[settlement.receiverId] || 0) - parseFloat(settlement.amount || 0)
      }
      else if(settlement.receiverId === user.id){
        balances[settlement.payerId] = (balances[settlement.payerId] || 0) + parseFloat(settlement.amount || 0)
      }
    })
    setBalances(balances)
    // Positive balances = user owes (totalToPay)
    // Negative balances = user is owed (totalOwed)
    const totalToPayAmount = Object.values(balances).reduce((sum, balance) => {
      return balance > 0 ? sum + balance : sum
    }, 0)
    
    const totalOwedAmount = Object.values(balances).reduce((sum, balance) => {
      return balance < 0 ? sum + Math.abs(balance) : sum
    }, 0)
    
    setTotalToPay(totalToPayAmount.toFixed(2))
    setTotalOwed(totalOwedAmount.toFixed(2))
  }

  async function fetchGroup() {
    setError(null)
    try {
      const response = await fetch(`/api/groups/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group');
      const data = await response.json()
      setGroup(data?.group)
    } catch (error) {
      console.error('Error fetching group:', error)
      setError('Failed to load group')
    }
  }

  async function fetchGroupExpenses() {
    setError(null)
    try {
      const response = await fetch(`/api/groupExpenses/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group expenses');
      const data = await response.json()
      console.log('Group Expenses API Response:', data?.groupExpenses);
      console.log('splits:', data?.groupExpenses[0]?.expenseSplit)
      setGroupExpenses(data?.groupExpenses || [])
    } catch (error) {
      console.error('Error fetching group expenses:', error)
      setError('Failed to load group expenses')
    }
  }

  async function fetchGroupBills() {
    setError(null)
    try {
      const response = await fetch(`/api/groupExpenses/bill/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group bills');
      const data = await response.json()
      console.log('Group bills API Response:', data?.groupBills);
      console.log('splits:', data?.groupBills[0]?.expenseItems)
      setGroupBills(data?.groupBills || [])
    } catch (error) {
      console.error('Error fetching group bills:', error)
      setError('Failed to load group bills')
    }
  }

  async function handleCreateGroupExpense({ title, paidById, totalAmount, splits }) {

    if (!title || !paidById || !totalAmount || !splits) {
      setError('Invalid expense data. Please provide all required fields.');
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/groupExpenses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          title,
          paidById,
          totalAmount,
          splits,
          currency: user?.currency || 'USD'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const createdExpense = data.newExpense;
        const updatedGroupExpenses = [...groupExpenses, createdExpense];
        setGroupExpenses(updatedGroupExpenses);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating group expense:', error);
      setError('Failed to create group expense');
    }
  }

  async function handleCreateBill({ description, totalAmount, payerId, expenseItems }) {
    if (!description || !totalAmount || !expenseItems) {
      setError('Invalid expense data. Please provide all required fields.');
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/groupExpenses/bill', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          description,
          totalAmount,
          payerId,
          expenseItems,
          currency: user?.currency || 'USD'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const createdBill = data.newBill;
        const updatedGroupBills = [...groupBills, createdBill];
        setGroupBills(updatedGroupBills);
        setIsCreatingBill(false);
      }
    } catch (error) {
      console.error('Error creating group bill:', error);
      setError('Failed to create group bill');
    }
  }


  async function handleRemoveMember(memberId) {
    const prevGroup=group
    try{
      const response = await fetch(`/api/groups/${groupId}/delete-member`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId })
      })
      if (!response.ok) throw new Error('Failed to delete member from group');
      const updatedMembers = prevGroup.members.filter(member => member.id !== memberId)
      setGroup({ ...prevGroup, members: updatedMembers })
      fetchGroup()
      setError(null);
    } catch (error) {
      console.error('Error deleting member from group:', error);
      setError('Failed to delete member from group');
    }
  }
  
  function openSettleBalanceDialog(payer, receiver, amount){
    setIsSettlingBalance(true)
    setPayer(payer)
    setReceiver(receiver)
    setAmount(amount)
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>Loading group details...</p>;

  return (
    <div className='flex flex-col h-screen gap-4 p-6'>
      <div>
        <div className='flex justify-between p-2'>
          <div className='flex items-center gap-2'>
          <IconButton onClick={()=>{
                navigate('/home/groups');
              }} sx={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }}>
              <ArrowBackIcon/>
          </IconButton> 
          <h1 className='text-2xl font-bold text-[#0f172a] dark:text-white dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.3)]'>{group.name}</h1>
          </div>
          <div className='flex items-center gap-2'>
          <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onClick={() => setIsCreatingBill(true)} >Create Bill with AI</button>
          <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onClick={() => setIsCreating(true)} >Create New Expense</button>
          </div>
        </div>
        <CreateGroupExpenseDialog
          open={isCreating}
          group={group}
          user={user}
          onClose={() => setIsCreating(false)}
          onSave={handleCreateGroupExpense}
        />
        <CreateBillDialog
          open={isCreatingBill}
          group={group}
          user={user}
          onClose={() => setIsCreatingBill(false)}
          onSave={handleCreateBill}
        />
        <SettleBalanceDialog
          open={isSettlingBalance}
          group={group}
          payer={payer}
          receiver={receiver}
          amount={amount}
          onClose={() => setIsSettlingBalance(false)}
          onSave={handleSettleBalance}
        />
        <div className='flex gap-6'>
          <div className='flex items-center gap-3 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 px-4 py-2 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg'>
            <p className='text-black dark:text-white'>Total Expenses: {totalExpenses}</p>
          </div>
          <div className='flex items-center gap-3 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 px-4 py-2 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg'>
            <p className='text-black dark:text-white'>You Owe: {totalToPay}</p>
          </div>
          <div className='flex items-center gap-3 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 px-4 py-2 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg'>
            <p className='text-black dark:text-white'> You are Owed: {totalOwed}</p>
          </div>
        </div>
      </div>
      <div className='flex'>
        <AnimatedTabs tabs={tabs} activeTab={selectedTab} setActiveTab={setSelectedTab} layoutId='group-tabs' textColor='text-black dark:text-white' textHoverColor='text-gray-600 dark:text-gray-400' backgroundColor='bg-white dark:bg-gray-900' backgroundColorHover='bg-gray-100 dark:bg-gray-800' activeTextColor='text-black dark:text-white' />
      </div>
      <div>
        {
          selectedTab === 'expenses' && groupExpenses?.length > 0 ? (
            groupExpenses.filter((groupExpense) => groupExpense && groupExpense.id).map((groupExpense) => (
              <div key={groupExpense.id} className="flex items-center gap-3 mb-4 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 p-4 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-black dark:text-white">{groupExpense.title || 'Untitled Expense'}</p>
                  {groupExpense.paidById !== user?.id ? (
                    <p className='text-black dark:text-white'>
                      You Owe :{' '}
                      {currencies.find(currency => currency.value === groupExpense.currency)?.label || '$'}
                      {parseFloat(groupExpense.expenseSplit?.find((split) => split.userId === user?.id)?.amountOwed || 0).toFixed(2)} {' '} to {groupExpense.paidBy?.username || 'Unknown'}
                    </p>
                  ) : (
                    <p className='text-black dark:text-white'>
                       You are owed :{' '} 
                       {currencies.find(currency => currency.value === groupExpense.currency)?.label || '$'}
                      {(groupExpense.expenseSplit?.reduce(
                        (sum, split) => split.userId !== groupExpense.paidById ? sum + parseFloat(split.amountOwed || 0) : sum,
                        0
                      ) || 0).toFixed(2)}
                    </p>
                  )}
                  <p className='text-black dark:text-white'>Total Amount: {currencies.find(currency => currency.value === groupExpense.currency)?.label || '$'} {groupExpense.totalAmount}</p>
                </div>
              </div>
            ))
          ) : selectedTab === 'expenses' && groupExpenses?.length === 0 ? (
            <p className='text-black dark:text-white'>No expenses found for this group.</p>
          ) :

            selectedTab === 'bills' && groupBills?.length > 0 ? (
              groupBills.filter((groupBill) => groupBill && groupBill.id).map((groupBill) => (
                <div key={groupBill.id} className="flex items-center gap-3 mb-4 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 p-4 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-black dark:text-white">{groupBill.description || 'Untitled Expense'}</p>
                    {groupBill.payerId === user?.id ? (
                      <p>
                        Paid By : You
                      </p>
                    ) : (
                      <p> Paid By : {groupBill.payer?.username || 'Unknown'}
                      </p>
                    )}
                    <p>Total Amount: {currencies.find(currency => currency.value === groupBill.currency)?.label || '$'} {groupBill.totalAmount}</p>
                  </div>
                </div>
              ))
            ) : selectedTab === 'bills' && groupBills?.length === 0 ? (
              <p className='text-black dark:text-white'>No Bills found for this group.</p>
            ) :

              selectedTab === 'members' ? (
                <div className="space-y-3 max-w-2xl">
                  {group.members?.map((member) => (
                    <div 
                      key={member.id} 
                      className='flex items-center gap-3 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 p-4 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg' 
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={member.profilephoto ? member.profilephoto : '/assets/defaultprofilephoto.png'} 
                            alt={member.username} 
                            className='w-12 h-12 rounded-full border-2 border-white/20 shadow-md object-cover' 
                          />
                          {member.id === user?.id && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900"></span>
                          )}
                        </div>
                        <p className='text-lg font-medium text-black dark:text-white'>
                          {member.username} 
                          {member.id === user?.id && <span className='text-blue-400 ml-2'>(You)</span>}
                        </p>
                      </div>
                      {member.id !== user?.id && (
                        <button 
                          className='bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedTab === 'members' && group.members?.length === 0 ? (
                <p className='text-black dark:text-white'>No members found for this group.</p>
              ) :
               selectedTab === 'balances' ? (
                <div className="space-y-3 max-w-2xl">
                  {Object.entries(balances).map(([memberId, balance]) => (
                    <div key={memberId} className='flex items-center gap-3 bg-white/20 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/10 p-4 justify-between transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-900/60 hover:border-white/40 dark:hover:border-white/20 hover:shadow-lg'>
                      <p className='text-lg font-medium text-black dark:text-white'>{group.members.find(member => String(member.id) === String(memberId))?.username}</p>
                      <p className='text-lg font-medium text-black dark:text-white'>{balance > 0 ? 'You owe' : 'You are owed'}</p>
                      <p className='text-lg font-medium text-black dark:text-white'>{balance > 0 ? balance.toFixed(2) : (-balance).toFixed(2)}</p>
                      <Button onClick={()=> {
                        const member = group.members.find(member => String(member.id) === String(memberId))
                        const payer = balance > 0 ? user : member
                        const receiver = balance > 0 ? member : user
                        const amount = balance > 0 ? balance : -balance
                        openSettleBalanceDialog(payer, receiver, amount)
                      }}>Settle Balance</Button>
                    </div>
                  ))}
              </div>
              ) : selectedTab === 'balances' && Object.entries(balances).length === 0 ? (
                <p className='text-white'>No balances found for this group.</p>
              ) : null
        }
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import CreateGroupExpenseDialog from './components/CreateGroupExpenseDialog';
import CreateBillDialog from './components/CreateBillDialog' 

export default function GroupPage() {

  const { groupId } = useParams()
  const { user } = useAuth();
  const [group, setGroup] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [groupExpenses, setGroupExpenses] = React.useState([])
  const [isCreating, setIsCreating] = React.useState(false)
  const [totalToPay, setTotalToPay] = React.useState(0)
  const [totalOwed, setTotalOwed] = React.useState(0)
  const [totalExpenses, setTotalExpenses] = React.useState(0)
  const [selectedTab, setSelectedTab] = React.useState('expenses')
  const [isCreatingBill,setIsCreatingBill]=React.useState(false)

  React.useEffect(() => {
    fetchGroup();
    fetchGroupExpenses();
    if (groupExpenses.length > 0) {
      calculateTotals()
    }
  }, [])

  React.useEffect(() => {
    if (groupExpenses) {
      calculateTotals()
    }
  }, [groupExpenses])

  function calculateTotals() {
    const totalSum = groupExpenses.reduce((sum, expense) => sum + parseFloat(expense.totalAmount), 0)
    setTotalExpenses(totalSum)

    
    const paidByUserExpenses = groupExpenses?.filter(expense => expense.paidById === user.id) || []
    const totalOwedToUser = paidByUserExpenses.reduce((sum, expense) => {
      const owedFromSplits = expense.expenseSplit?.reduce((splitSum, split) => {
        return split.userId !== user.id ? splitSum + parseFloat(split.amountOwed || 0) : splitSum
      }, 0) || 0
      return sum + owedFromSplits
    }, 0)
    setTotalOwed(totalOwedToUser)

    
    const notPaidByUserExpenses = groupExpenses?.filter(expense => expense.paidById !== user.id) || []
    const totalUserOwes = notPaidByUserExpenses.reduce((sum, expense) => {
      const userSplit = expense.expenseSplit?.find(split => split.userId === user.id)
      return sum + parseFloat(userSplit?.amountOwed || 0)
    }, 0)
    setTotalToPay(totalUserOwes)
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
          splits
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

  function handleRemoveMember(memberId) {
    // You would implement the API call here
    console.log(`Attempting to remove member ${memberId} from group ${groupId}`);
    alert('Remove member functionality not yet implemented.');
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>Loading group details...</p>;

  return (
    <div className='flex flex-col h-screen gap-4'>
      <div>
        <div className='flex justify-between p-2'>
          <h1 className='text-2xl font-bold'>{group.name}</h1>
          <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onClick={() => setIsCreatingBill(true)} >Create Bill with AI</button>
          <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onClick={() => setIsCreating(true)} >Create New Expense</button>
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
          onClose={() => setIsCreatingBill(false)}
          onSave={handleCreateBill}
        />
        <div className='flex gap-6'>
          <div className='flex items-center p-2 rounded-lg shadow-md'>
            <p>Total Expenses: {totalExpenses}</p>
          </div>
          <div className='flex items-center p-2 rounded-lg shadow-md'>
            <p>You Owe: {totalToPay}</p>
          </div>
          <div className='flex items-center p-2 rounded-lg shadow-md'>
            <p> You are Owed: {totalOwed}</p>
          </div>
        </div>
      </div>
      <div className='flex justify-between p-2'>
        <div className={`flex items-center p-3 rounded-lg transition-colors ${selectedTab === 'expenses'
          ? 'bg-notion-gray-2 text-white'
          : 'text-gray-500 hover:bg-notion-gray-2 hover:text-white'
          }`} onClick={() => setSelectedTab('expenses')}>
          Expenses
        </div>
        <div className={`flex items-center p-3 rounded-lg transition-colors ${selectedTab === 'members'
          ? 'bg-notion-gray-2 text-white'
          : 'text-gray-500 hover:bg-notion-gray-2 hover:text-white'
          }`} onClick={() => setSelectedTab('members')}>
          Members
        </div>
        <div className={`flex items-center p-3 rounded-lg transition-colors ${selectedTab === 'balances'
          ? 'bg-notion-gray-2 text-white'
          : 'text-gray-500 hover:bg-notion-gray-2 hover:text-white'
          }`} onClick={() => setSelectedTab('balances')}>
          Balances
        </div>
      </div>
      <div>
        {
          selectedTab === 'expenses' && groupExpenses?.length > 0 ? (
            groupExpenses.filter((groupExpense) => groupExpense && groupExpense.id).map((groupExpense) => (
              <div key={groupExpense.id} className="flex items-center justify-between gap-2 rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium">{groupExpense.title || 'Untitled Expense'}</p>
                  {groupExpense.paidById !== user?.id ? (
                    <p>
                      You Owe :{' '}
                      {groupExpense.expenseSplit?.find((split) => split.userId === user?.id)?.amountOwed || 0} {' '} to {groupExpense.paidBy.username}
                    </p>
                  ) : (
                    <p>
                      You are owed :{' '}
                      {groupExpense.expenseSplit?.reduce(
                        (sum, split) => split.userId !== groupExpense.paidById && sum + parseFloat(split.amountOwed || 0),
                        0
                      )}
                    </p>
                  )}
                  <p>Total Amount: {groupExpense.totalAmount}</p>
                </div>
              </div>
            ))
          ) : selectedTab === 'expenses' && groupExpenses?.length === 0 ? (
            <p>No expenses found for this group.</p>
          ) : selectedTab === 'members' ? (
            group.members?.map((member) => (
              <div key={member.id} className='flex items-center justify-between gap-2 rounded-lg p-4 shadow-md' >
                <div className="flex items-center gap-2">
                  <img src={member.profilephoto} alt={member.username} className='w-10 h-10 rounded-full' />
                  <p className='text-lg font-medium'>{member.username} {member.id === user?.id && '(You)'}</p>
                </div>
                {member.id !== user?.id && <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => handleRemoveMember(member.id)}>Remove</button>}
              </div>
            ))
          ) : null
        }

      </div>

    </div>
  )

}

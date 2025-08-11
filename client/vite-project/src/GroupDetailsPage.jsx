import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchFriends from './components/fetchFriends';
import { useAuth } from './AuthContext';

export default function GroupPage(){

  const {groupId}= useParams()
  const { user } = useAuth(); 
  const [group,setGroup]=React.useState(null)
  const[error,setError]=React.useState(null)
  const[groupExpenses,setGroupExpenses]=React.useState([])
  const[isCreating,setIsCreating]=React.useState(false)
  

  React.useEffect(()=>{
    fetchGroup();
    fetchGroupExpenses();
  },[])

  async function fetchGroup(){
    try{
      const response = await fetch(`/api/groups/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group');
      const data= await response.json()
      setGroup(data?.group)
    }catch(error){
      console.error('Error fetching group:',error)
      setError('Failed to load group')
    }
  }

  async function fetchGroupExpenses(){
    try{
      const response = await fetch(`/api/groupExpenses/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group');
      const data= await response.json()
      setGroupExpenses(data?.groupExpenses)
    }catch(error){
      console.error('Error fetching group expenses:',error)
      setError('Failed to load group expenses')
    }
  }
  function handleCreateGroupExpense(newExpense){

  }

  function handleRemoveMember(memberId) {
    // You would implement the API call here
    console.log(`Attempting to remove member ${memberId} from group ${groupId}`);
    alert('Remove member functionality not yet implemented.');
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p>Loading group details...</p>;

  return(
    <div>
      <div className='flex justify-space-between p-2'>
        <h1>{group.name}</h1>
        <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onclick={setIsCreating(true)} >Create New Expense</button>
      </div>
      <CreateGroupExpenseDialog
              open={isCreating}
              group={editingGroup}
              onClose={()=>setIsCreating(false)}
              onSave={handleCreateGroupExpense}
              
      />
      <div>
        {
          group.members?.map((member)=>(
            <div key={member.id} className='flex items-center justify-between gap-2 rounded-lg p-4 shadow-md' >
              <div className="flex items-center gap-2">
                <img src={member.profilephoto} alt={member.username} className='w-10 h-10 rounded-full' />
                <p className='text-lg font-medium'>{member.username} {member.id === user?.id && '(You)'}</p>
              </div>
              {member.id !== user?.id && <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={()=>handleRemoveMember(member.id)}>Remove</button>}
            </div>
          ))
        }
      </div>
    </div>
  )

  }


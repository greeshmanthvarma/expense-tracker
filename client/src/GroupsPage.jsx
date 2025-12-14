import React from 'react';
import CreateGroupDialog from './components/CreateGroupDialog';
import EditGroupDialog from './components/EditGroupDialog';
import fetchFriends from './components/fetchFriends'; 
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';


export default function GroupsPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const navigate=useNavigate()
  const [friends,setFriends]=React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);

  React.useEffect(() => {
    async function getFriends(){
      const friendsData = await fetchFriends();
      setFriends(friendsData);
    };
    fetchGroups();
    getFriends();
  }, []);

  async function fetchGroups() {
    try {
      const response = await fetch('/api/groups', { 
        credentials: 'include' 
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

async function handleSaveGroup (group){
    console.log('Group:',group)
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(group)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create group' }));
        throw new Error(errorData.message);
      }
      const newGroupData = await response.json();
      setGroups(prevGroups => [...prevGroups, newGroupData]);
      setCreateDialogOpen(false); 
    } catch (error) {
      console.error("Error creating group:", error);
      setError(error.message);
    }
  };

  async function handleEditGroup(newGroup){
    try{
      const response= await fetch(`/api/groups/${newGroup.id}`,{
        method:'PUT',
        credentials:'include',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name:newGroup.name,
          members:newGroup.members
        })
      })
      if (response.ok) {
        const updatedGroup = await response.json();
        const updatedGroups = groups.map(item =>
          item.id === updatedGroup.id ? updatedGroup : item
        );
        setGroups(updatedGroups);
       setEditDialogOpen(false)
       setEditingGroup(null)
      } else {
        alert('Failed to update the expense')
      }
    }catch(error){
        console.error("Error updating group:", error);
        setError(error.message);
      }
  }
  
  function handleGroupClick(groupId) {
    navigate(`/home/groups/${groupId}`);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Groups</h1>
        <button className="bg-notion-gray-3 text-white px-4 py-2 rounded-lg hover:bg-notion-gray-2 transition-colors cursor-pointer " onClick={() => setCreateDialogOpen(true)}>
          Create Group
        </button>
      </div>
      
      {loading && <p>Loading groups...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && groups.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-white py-8">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-lg font-medium mb-2">No groups yet</h3>
            <p className="text-white">Create groups to manage shared expenses with multiple people</p>
          </div>
        </div>
      )}
       <div className="flex flex-wrap gap-4"> 
        {groups.map((group) => (
          <div key={group.id} className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/10 p-4 cursor-pointer w-100" onClick={() => handleGroupClick(group.id)}>
            <h2 className="text-xl font-bold text-white">{group.name}</h2>
            <p className="text-white mt-2">
              {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
            </p>
            <IconButton onClick={e=>{
                e.stopPropagation();
                setEditingGroup(group);
                setEditDialogOpen(true);
              }}>
              <EditIcon/>
            </IconButton>              
          </div>
        ))}
      </div>

      <EditGroupDialog
        open={isEditDialogOpen}
        group={editingGroup}
        onClose={()=>setEditDialogOpen(false)}
        onSave={handleEditGroup}
        friends={friends}
      />
      <CreateGroupDialog
        open={isCreateDialogOpen}
        onClose={()=>setCreateDialogOpen(false)}
        onSave={handleSaveGroup}
        friends={friends}
      />
    </div>
  );
} 
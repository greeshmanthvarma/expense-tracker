import React from 'react';
import FriendsList from './components/FriendsList';
import FriendRequests from './components/FriendRequests';
import AddFriend from './components/AddFriend';
import AnimatedTabs from './components/animatedTabs';

export default function FriendsPage(){
  const [friends,setFriends]=React.useState([])
  const [friendRequests,setFriendRequests]=React.useState([])
  const [isLoading,setIsLoading]=React.useState(true)
  const [error,setError]=React.useState(null)
  const [sentFriendRequests,setSentFriendRequests]=React.useState([])
  const [receivedFriendRequests,setReceivedFriendRequests]=React.useState([])
  const [selectedTab,setSelectedTab]=React.useState('friends')
  const tabs = [
    { id: "friends", label: "Friends" },
    { id: "requests", label: "Requests" },
    { id: "addfriend", label: "Add Friend" },
  ]

  React.useEffect(()=>{
    async function fetchAllData() {
      setIsLoading(true);
      setError(null);
      try {
        
        const [friendsData, requestsData] = await Promise.all([
          fetchFriends(),
          fetchRequests()
        ]);
        
        setFriends(friendsData);
        setSentFriendRequests(requestsData.sent);
        setReceivedFriendRequests(requestsData.received);

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError(err.message || "Failed to load page data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  },[])

  async function fetchFriends() {
    const response = await fetch('/api/user/friends');
    if (!response.ok) throw new Error('Failed to load friends');
    const data = await response.json();
    return data.user?.friends || [];
  }

  async function fetchRequests() {
    const [sentRes, receivedRes] = await Promise.all([
      fetch('/api/friendrequest/sentfriendrequests'),
      fetch('/api/friendrequest/receivedfriendrequests')
    ]);
    if (!sentRes.ok || !receivedRes.ok) throw new Error('Failed to load friend requests');
    const sentData = await sentRes.json();
    const receivedData = await receivedRes.json();
    return { sent: sentData?.sentRequests || [], received: receivedData?.receivedRequests || [] };
  }


async function handleSendRequest(friendId) {
    if (!friendId || isNaN(Number(friendId))) {
      return;
    }
    console.log('Sending friend request to:', friendId)
    try{
      const response= await fetch('/api/friendrequest/send',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ friendId })
      })
      
      if (response.ok) {
        console.log('Friend request sent successfully')
        const requestsData = await fetchRequests();
        setSentFriendRequests(requestsData.sent);
        setReceivedFriendRequests(requestsData.received);
      } else {
        console.error('Failed to send friend request')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      setError('Failed to send friend request')
    }
  }

  async function handleDeleteRequest(requestId){
    try {
      const response = await fetch(`/api/friendrequest/${requestId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        const requestsData = await fetchRequests();
        setSentFriendRequests(requestsData.sent);
        setReceivedFriendRequests(requestsData.received);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAcceptRequest(senderId,requestId){
    try {
      const addFriendResponse = await fetch('/api/user/friends', {
        method:'PUT',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: Number(senderId) })
      });

      if (!addFriendResponse.ok) {
        throw new Error('Failed to add friend');
      }

      
      await handleDeleteRequest(requestId);

     
      const friendsData = await fetchFriends();
      setFriends(friendsData);

    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    }
  }

  async function handleRemoveFriend(friendId){
    try {
      const response = await fetch(`/api/user/friends`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: Number(friendId) })
      });
      if (response.ok) {
        const friendsData = await fetchFriends();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error deleting friend:', error)
      setError('Failed to delete friend')
    }
  }

  function renderUserCard(user, type) {
    const profilePhotoUrl = user.profilephoto ? user.profilephoto : '/assets/defaultprofilephoto.png';
    return(
      <div key={user.id} className='flex items-center gap-2 rounded-lg p-4 shadow-md justify-between' >
        <div className="flex items-center gap-2">
          <img src={profilePhotoUrl} alt={user.username} className='w-10 h-10 rounded-full' />
          <p className='text-lg font-medium'>{user.username}</p>
        </div>
        
        {
          type === 'friend' && <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={()=>handleRemoveFriend(user.id)}>Remove</button>
        }
        {type === 'search' && (
          friends.some(friend => friend.id === user.id) ? (
            <span className='text-green-500 font-medium'> (Friend)</span>
          ) : sentFriendRequests.some(request => request.receiverId === user.id) ? (
            <span className='text-yellow-500 font-medium'> (Request Sent)</span>
          ) : receivedFriendRequests.some(request => request.senderId === user.id) ? (
            <span className='text-blue-500 font-medium'> (Request Received)</span>
          ) : <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={()=>handleSendRequest(user.id)}>Send Request</button>
        )}
        {type === 'sent' && (
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={()=>handleDeleteRequest(user.request_id)}>Cancel Request</button>
        )}
        {type === 'received' && (
          <div className='flex gap-2'>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={()=>handleAcceptRequest(user.id,user.request_id)}>Accept</button>
            <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={()=>handleDeleteRequest(user.request_id)}>Reject</button>
          </div>
        )}
      </div>
    )
  }

  return(
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
      <div className='flex justify-between p-2 mt-4'>
        <AnimatedTabs tabs={tabs} activeTab={selectedTab} setActiveTab={setSelectedTab} />
      </div>
      {isLoading && <p>Loading...</p>}  
      <div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className='mt-8'>
        {
          (selectedTab === 'friends' && <FriendsList friends={friends} renderUserCard={renderUserCard} />) ||
          (selectedTab === 'requests' && <FriendRequests receivedRequests={receivedFriendRequests} sentRequests={sentFriendRequests} renderUserCard={renderUserCard}/>) ||
          (selectedTab === 'addfriend' && <AddFriend renderUserCard={renderUserCard}/>)
        }
      </div>
    </div>
  )
}
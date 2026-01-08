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
  const [friendsSelectedTab,setFriendsSelectedTab]=React.useState('friends')
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
      <div 
        key={user.id} 
        className='flex flex-col items-center bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 p-6 transition-all duration-200 hover:bg-white/30 hover:border-white/40 hover:shadow-lg' 
      >
        <div className="relative mb-3">
          <img 
            src={profilePhotoUrl} 
            alt={user.username} 
            className='w-20 h-20 rounded-full border-2 border-white/20 shadow-md object-cover' 
          />
        </div>
        <p className='text-lg font-medium text-white mb-4 text-center'>{user.username}</p>
        
        {type === 'friend' && (
          <button 
            className='w-full bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
            onClick={()=>handleRemoveFriend(user.id)}
          >
            Remove
          </button>
        )}
      </div>
    )
  }

  function renderUserCardHorizontal(user, type) {
    const profilePhotoUrl = user.profilephoto ? user.profilephoto : '/assets/defaultprofilephoto.png';
    return(
      <div 
        key={user.id} 
        className='flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 p-4 justify-between transition-all duration-200 hover:bg-white/30 hover:border-white/40 hover:shadow-lg' 
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profilePhotoUrl} 
              alt={user.username} 
              className='w-12 h-12 rounded-full border-2 border-white/20 shadow-md object-cover' 
            />
          </div>
          <p className='text-lg font-medium text-white'>{user.username}</p>
        </div>
        
        {type === 'search' && (
          friends.some(friend => friend.id === user.id) ? (
            <span className='text-green-400 font-medium flex items-center gap-1'>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Friend
            </span>
          ) : sentFriendRequests.some(request => request.receiverId === user.id) ? (
            <span className='text-yellow-400 font-medium flex items-center gap-1'>
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Request Sent
            </span>
          ) : receivedFriendRequests.some(request => request.senderId === user.id) ? (
            <span className='text-blue-400 font-medium flex items-center gap-1'>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Request Received
            </span>
          ) : (
            <button 
              className='bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
              onClick={()=>handleSendRequest(user.id)}
            >
              Send Request
            </button>
          )
        )}
        {type === 'sent' && (
          <button 
            className='bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
            onClick={()=>handleDeleteRequest(user.request_id)}
          >
            Cancel Request
          </button>
        )}
        {type === 'received' && (
          <div className='flex gap-2'>
            <button 
              className='bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
              onClick={()=>handleAcceptRequest(user.id,user.request_id)}
            >
              Accept
            </button>
            <button 
              className='bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md font-medium' 
              onClick={()=>handleDeleteRequest(user.request_id)}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    )
  }

  return(
    <div className='p-6'>
      <h1 className="text-3xl font-bold text-white">Friends</h1>
      <div className='flex justify-between mt-4'>
        <AnimatedTabs tabs={tabs} activeTab={friendsSelectedTab} setActiveTab={setFriendsSelectedTab} layoutId='friends-tabs' textColor='text-white' textHoverColor='text-gray-600' />
      </div>
      {isLoading && <p>Loading...</p>}  
      <div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className='mt-8'>
        {
          (friendsSelectedTab === 'friends' && <FriendsList friends={friends} renderUserCard={renderUserCard} />) ||
          (friendsSelectedTab === 'requests' && <FriendRequests receivedRequests={receivedFriendRequests} sentRequests={sentFriendRequests} renderUserCard={renderUserCardHorizontal}/>) ||
          (friendsSelectedTab === 'addfriend' && <AddFriend renderUserCard={renderUserCardHorizontal}/>)
        }
      </div>
    </div>
  )
}
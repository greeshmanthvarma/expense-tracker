import React from 'react';


export default function FriendsPage(){
  const [friends,setFriends]=React.useState([])
  const [friendRequests,setFriendRequests]=React.useState([])
  const [searchQuery,setSearchQuery]=React.useState('')
  const [isLoading,setIsLoading]=React.useState(true)
  const [error,setError]=React.useState(null)
  const [userSearchResults,setUserSearchResults]=React.useState([])
  const [userSearchResultsCount,setUserSearchResultsCount]=React.useState(0)
  const [userSearchQuery,setUserSearchQuery]=React.useState('')
  const [searchClicked,setSearchClicked]=React.useState(false)
  const [sentFriendRequests,setSentFriendRequests]=React.useState([])
  const [receivedFriendRequests,setReceivedFriendRequests]=React.useState([])

  React.useEffect(()=>{
    fetchFriends()
    fetchRequests()
  },[])
  
 async function fetchFriends(){
    try{
      const response=await fetch('/api/user/friends')
      const data=await response.json()
      console.log('Fetched friends data:', data);
      setFriends(data.user?.friends || []);
    }catch(error){
      console.error('Error fetching friends:',error)
      setError('Failed to load friends')
    }finally{
      setIsLoading(false)
    }
  }

  async function fetchRequests(){

    try{
      const response1 = await fetch('/api/friendrequest/sentfriendrequests')
      const data1 = await response1.json();
      setSentFriendRequests(data1?.sentRequests || []);
      const response2 = await fetch('/api/friendrequest/receivedfriendrequests')
      const data2 = await response2.json();
      setReceivedFriendRequests(data2?.receivedRequests || []);
    } catch (error) {
      console.log("sentFriendRequests",sentFriendRequests)
      console.log("receivedFriendRequests",receivedFriendRequests)
      console.error('Error fetching friend requests:', error);
      setError('Failed to load friend requests');
    }
  }
  async function handleUserSearch(){
    setSearchClicked(true)
    try{
      const response= await fetch(`/api/user/search?username=${encodeURIComponent(userSearchQuery)}`)
      const data=await response.json()
      setUserSearchResults(data.users || []);
      setUserSearchResultsCount(data.count || 0);
    }catch(error){
      console.error('Error searching users:', error)
      setError('Failed to search users')
    }
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
        fetchRequests(); // Refetch requests to update the UI
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
        fetchRequests(); 
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

      // After successfully adding the friend, delete the request
      await handleDeleteRequest(requestId);

      // Now, refetch the friends list to show the newly added friend
      await fetchFriends();

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
        fetchFriends();
      }
    } catch (error) {
      console.error('Error deleting friend:', error)
      setError('Failed to delete friend')
    }
  }

  return(
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Friends</h1>

      {
        friends.map((friend)=>(
          <div key={friend.id} className='flex items-center gap-2 rounded-lg p-4 shadow-md' >
            <img src={friend.profilephoto} alt={friend.username} className='w-10 h-10 rounded-full' />
            <p className='text-lg font-medium'>{friend.username}</p>
            <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={()=>handleRemoveFriend(friend.id)}>Remove</button>
          </div>
        ))
      }
      <div className='flex items-center gap-2'>
        <input type="text" placeholder='Search Users' value={userSearchQuery} onChange={(e)=>setUserSearchQuery(e.target.value)}/>
        <button onClick={handleUserSearch}>Search</button>
      </div>
      {
        searchClicked && 
        (userSearchResultsCount > 0 ?(
        userSearchResults.map((user)=>(
          <div key={user.id} className='flex items-center gap-2 rounded-lg p-4 shadow-md' >
            <img src={user.profilephoto} alt={user.username} className='w-10 h-10 rounded-full' />
            <p className='text-lg font-medium'>{user.username}</p>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={()=>handleSendRequest(user.id)}>Send Request</button>
          </div>
        ))
        ):(
            <p> No results found! </p>
          )
      )
      }
      <div className='flex flex-col gap-2'>
        <div>
          <p> Sent Requests </p>

          {
            sentFriendRequests?.length === 0 ? ( // Check if the array is empty
              <p> No friend requests sent </p>
            ) : (
              sentFriendRequests.map((sentRequest)=>(
                <div key={sentRequest.id}>
                  <img
                    src={sentRequest.receiver?.profilephoto || '/default-profile.png'} // Fallback for missing profile photo
                    alt={sentRequest.receiver?.username || 'Unknown User'}
                    className='w-10 h-10 rounded-full'
                  />
                  <p className='text-lg font-medium'>{sentRequest.receiver?.username || 'Unknown User'}</p>
                  <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md'
                    onClick={()=>handleDeleteRequest(sentRequest.id)}
                  >
                    Cancel Request
                  </button>
                </div>
              ))
            )
          }
        </div>
        <div>
          <p> Received Requests </p>
          {
            receivedFriendRequests?.length === 0 ? ( // Check if the array is empty
              <p> No pending requests </p>
            ) : (
              receivedFriendRequests.map((receivedRequest)=>(
                <div key={receivedRequest.id}>
                  <img
                    src={receivedRequest.sender?.profilephoto || '/default-profile.png'} // Fallback for missing profile photo
                    alt={receivedRequest.sender?.username || 'Unknown User'}
                    className='w-10 h-10 rounded-full'
                  />
                  <p className='text-lg font-medium'>{receivedRequest.sender?.username || 'Unknown User'}</p>
                  <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md'
                    onClick={()=>handleAcceptRequest(receivedRequest.sender.id,receivedRequest.id)}
                  >
                    Accept Request
                  </button>
                  <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md'
                    onClick={()=>handleDeleteRequest(receivedRequest.id)}
                  >
                    Reject Request
                  </button>
                </div>
              ))
            )
          }
        </div>
      </div>
      
      
    </div>
  )
}
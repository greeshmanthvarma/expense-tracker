export default async function fetchFriends(){
  try{
    const response=await fetch('/api/user/friends')
    const data=await response.json()
    console.log('Fetched friends data:', data);
    return data?.user?.friends || []
  }catch(error){
    console.error('Error fetching friends:',error)
    return []
  }
} 
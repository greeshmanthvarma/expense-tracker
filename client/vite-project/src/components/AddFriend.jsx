import React, { useState } from 'react';

export default function AddFriend({renderUserCard }) {
    const [query, setQuery] = useState('');
    const [userSearchResults,setUserSearchResults]=React.useState([])
    const [searchClicked,setSearchClicked]=React.useState(false)
    const [loading,setLoading]=React.useState(false)
    const [error,setError]=React.useState(null)


    async function handleUserSearch(e){
    e.preventDefault() // stops the page from reloading on form submit
    if(!query.trim()) return; // if the query is empty, do nothing
    setSearchClicked(true)
    setLoading(true)
    setError(null)
    setUserSearchResults([])
    try{
      const response= await fetch(`/api/user/search?username=${encodeURIComponent(query)}`)
      const data=await response.json()
      setUserSearchResults(data.users || []);
        setLoading(false)
      
    }catch(error){
      console.error('Error searching users:', error)
      setError('Failed to search users')
        setLoading(false)
    }
    }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Find New Friends</h2>
      <form onSubmit={handleUserSearch} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {searchClicked && !loading && (
        <div className="space-y-3">
          {userSearchResults.length > 0 ? userSearchResults.map(user => renderUserCard(user, 'search')) : <p className="text-gray-500">No users found for "{query}".</p>}
        </div>
      )}
    </div>
  );
}
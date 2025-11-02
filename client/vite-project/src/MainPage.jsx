import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { IconLogout } from '@tabler/icons-react';

export default function MainPage(){
  const location = useLocation();
  const { user, loading} = useAuth();
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  async function onLogout(){
    
    try{
      const response = await fetch('/auth/logout',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if(response.ok){
        window.location.href='/';
      }else{
        alert('Logout Failed');
      }
      
    }catch(error){
      console.error(error);
      alert('Logout Failed');
    }
  }

  if(loading){
    return <div>Loading...</div>
  }

  return(
    <div className='w-screen h-screen bg-gray-50'>
      <div className='flex flex-col w-64 h-screen bg-notion-gray-3 fixed shadow-lg'>
        <div className='p-6 border-b border-notion-gray-2'>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-notion-gray-2 rounded-full flex items-center justify-center'>
              {user && <img src={user.profilephoto ? user.profilephoto : '/assets/defaultprofilephoto.png'} className='rounded-full'/>}
            </div>
            <div>
              <h3 className='text-white font-medium'>{user && user.username}</h3>
            </div>
          </div>
        </div>

        
        <nav className='flex-1 p-4 space-y-2'>
        <Link 
            to='/home'
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('home') 
                ? 'bg-notion-gray-2 text-white' 
                : 'text-gray-300 hover:bg-notion-gray-2 hover:text-white'
            }`}
          >
            <span className='mr-3'>🏠</span>
            Home
          </Link>
          <Link 
            to='/home/expenses'
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('expenses') 
                ? 'bg-notion-gray-2 text-white' 
                : 'text-gray-300 hover:bg-notion-gray-2 hover:text-white'
            }`}
          >
            <span className='mr-3'>💰</span>
            Expenses
          </Link>
          
          <Link 
            to='/home/friends'
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('friends') 
                ? 'bg-notion-gray-2 text-white' 
                : 'text-gray-300 hover:bg-notion-gray-2 hover:text-white'
            }`}
          >
            <span className='mr-3'>🫂</span>
            Friends
          </Link>
          
          <Link 
            to='/home/groups'
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('groups') 
                ? 'bg-notion-gray-2 text-white' 
                : 'text-gray-300 hover:bg-notion-gray-2 hover:text-white'
            }`}
          >
            <span className='mr-3'>👥</span>
            Groups
          </Link>
        </nav>

       
        <div className='p-4 border-t border-notion-gray-2'>
          <button className='w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-notion-gray-2 hover:text-white transition-colors'
            onClick={()=>onLogout()}
          >
            <span className='mr-3'>
              <IconLogout stroke={2} />
            </span>
            Logout
          </button>
        </div>
      </div>

      
      <div className='ml-64 h-screen overflow-auto bg-zinc-900'>
        <div className='p-6'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
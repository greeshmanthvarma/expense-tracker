import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function MainPage(){
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  function onLogout(){
    
  }

  return(
    <div className='w-screen h-screen bg-gray-50'>
      <div className='flex flex-col w-64 h-screen bg-notion-gray-3 fixed shadow-lg'>
        <div className='p-6 border-b border-notion-gray-2'>
          <div className='flex items-center space-x-3'>
            <div className='w-12 h-12 bg-notion-gray-2 rounded-full flex items-center justify-center'>
              <img src={user.profilephoto} className='rounded-full'/>
            </div>
            <div>
              <h3 className='text-white font-medium'>{user.username}</h3>
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
            <span className='mr-3'>🚪</span>
            Logout
          </button>
        </div>
      </div>

      
      <div className='ml-64 h-screen overflow-auto'>
        <div className='p-6'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MainPage(){

  return(
    <div className='w-screen h-screen'>
      <div className='flex flex-col w-64 h-screen bg-notion-gray-3 fixed'>
        <h2>Username</h2>
        <Link to='/home/expenses'>Expenses</Link> 
        <Link to='/home/friends'>Friends</Link>
        <Link to='/home/groupexpenses'>Group Expenses</Link>
      </div>
      <div className='flex ml-64'>
        <Outlet/>
      </div>
    </div>
  )

  
}
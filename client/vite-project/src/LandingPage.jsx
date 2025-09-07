import React from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

export default function LandingPage(){

  const navigate=useNavigate()

  return(
    <div className='flex flex-col h-full w-full bg-main-maroon'>
      <div className='flex h-auto w-100% ml-10 mt-10 mr-10 justify-between items-center '>
        <p className='text-white font-instrument-serif text-3xl'>FinTrack AI</p>
        <div onClick={()=>navigate('/login')} className='cursor-pointer'>
          <p className='text-white'>Login/Sign Up</p>
        </div>
        
      </div>
      <div className='flex justify-center text-6xl text-white font-serif font-bold mt-12 pt-12'> 
        <p>Track.Split.Manage.</p>
      </div>

      <div className='flex justify-center mt-12'>
        <img src='../assets/ipad1.png'></img>
      </div>

    </div>
  )
}
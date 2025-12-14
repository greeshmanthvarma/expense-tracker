import React from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

export default function LandingPage(){

  const navigate=useNavigate()

  return(
    <div className="min-h-screen w-full relative bg-black">
    
    <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
      }}
    >
      <div className="mt-15 flex justify-between items-center px-30">
        <p className='text-white font-instrument-serif text-3xl'>FinTrack AI</p>
        <div onClick={()=>navigate('/login')} className='cursor-pointer'>
            <p className='text-white'>Login/Sign Up</p>
        </div>
      </div>
      
      <div className='flex justify-center text-6xl text-white font-serif font-bold mt-12 pt-12'> 
        <p>Track.Split.Manage.</p>
      </div>

      
    </div>
  </div>
  )
}


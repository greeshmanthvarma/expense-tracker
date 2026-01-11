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
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.1), transparent 50%),
          radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0, 0, 0, 0.1), transparent 50%),
          linear-gradient(to bottom, #35578F 0%, #4A6FA5 30%, #7A9BC4 50%, #B8A68A 80%, #D4B994 100%)
        `,
      }}
    >
      <div className="mt-15 flex justify-between items-center px-30">
        <p className='text-white font-instrument-serif text-3xl' style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>FinTrack AI</p>
        <div onClick={()=>navigate('/login')} className='cursor-pointer'>
            <p className='text-white' style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>Login/Sign Up</p>
        </div>
      </div>
      
      <div className='flex justify-center text-6xl text-white font-serif font-bold mt-12 pt-12' style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}> 
        <p>Track.Split.Manage.</p>
      </div>

      
    </div>
  </div>
  )
}


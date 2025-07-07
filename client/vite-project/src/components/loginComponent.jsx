import {useRef} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

export default function LoginComponent(){
  const emailInputRef=useRef(null)
  const passwordInputRef=useRef(null)
  const navigate=useNavigate()
  
  async function authenticate(){
    const email=emailInputRef.current.value
    const password=passwordInputRef.current.value
  
    if(!email || !password || password.length<6 || !email.includes('@')){
      alert('Please enter a valid email and password (min 6 characters)')
      return
    }
  
    try{
      const response = await fetch('/auth/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      })
      const data = await response.json()
      console.log('Login response:', data) // Debug log
  
      if(data.token){
        console.log('Storing token:', data.token) // Debug log
        localStorage.setItem('token', data.token)
        console.log('Token stored, current localStorage:', localStorage.getItem('token')) // Debug log
        navigate('/decks') // Redirect to decks page after successful login
      }
      else{
        throw new Error('Failed to Authenticate')
      }
    }
    catch(err){
      console.error('Login error:', err)
      alert('Login failed: ' + err.message)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && 
        emailInputRef.current.value && 
        passwordInputRef.current.value) {
      authenticate()
    }
  }

  return(
    <div className="h-96 w-96 flex flex-col rounded-xl border border-gray-800 gap-6 p-6 bg-notion-gray-1 shadow-lg font-dm-serif text-white">
      <div className='flex flex-col gap-3'>
        <h4 className='font-bold'>Login to your account</h4>
        <p className="text-sm text-gray">Enter your email below to login to your account</p>
      </div>
      <div className='flex flex-col gap-3'>
        <p>Email</p>
        <input 
        placeholder="abc@example.com" 
        className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
        ref={emailInputRef}
        onKeyDown={handleKeyDown}
        required
      />
      </div>
      <div className='flex flex-col gap-3'>
        <p>Password</p>
        <input 
          type="password" 
          className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
          ref={passwordInputRef}
          onKeyDown={handleKeyDown}
          required
        />
      </div>
      <button className="w-full rounded-md border-1 border-gray-200 bg-white text-black cursor-pointer" onClick={authenticate}>Login</button>
      <div className='flex justify-center'>
        Don't have an account?{" "}
        <Link to="/register" className='underline underline-offset-4 ml-1'> Sign Up </Link>
      </div>
    </div>
  )
}
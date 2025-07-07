import {useRef} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

export default function RegisterComponent(){
  
  const usernameInputRef=useRef(null)
  const emailInputRef=useRef(null)
  const passwordInputRef=useRef(null)
  const confirmPasswordRef=useRef(null)
  const navigate=useNavigate()
  
  async function registerUser(){
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    const confirmPass = confirmPasswordRef.current.value;
    const username = usernameInputRef.current.value;
    try {
      if (!username || !email || !password || !confirmPass || password !== confirmPass) {
        throw new Error('Passwords do not match or fields are empty');
      }
  
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username,email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message);
    } finally {
      usernameInputRef.current.value = '';
      emailInputRef.current.value = '';
      passwordInputRef.current.value = '';
      confirmPasswordRef.current.value = '';
    }
  }

  function handleKeyDown(e){
    if(e.key ===' Enter' && 
        usernameInputRef && emailInputRef && passwordInputRef && confirmPasswordRef
    ){
      registerUser()
    }
  }
  
  return(
    <div className="h-auto w-96 flex flex-col rounded-xl border border-gray-800 gap-6 p-6 bg-notion-gray-1 shadow-lg font-dm-serif text-white">
      <div className='flex flex-col gap-3'>
        <h4 className='font-bold'>Create an account</h4>
      </div>
      <div className='flex flex-col gap-3'>
        <p>Username</p>
        <input 
        placeholder="Username" 
        className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
        ref={usernameInputRef}
        onKeyDown={handleKeyDown}
        />
        <p> Email</p>
        <input 
        placeholder="Email" 
        className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
        ref={emailInputRef}
        onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <p>Password</p>
        <input 
        placeholder="Password" 
        type="password" 
        className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
        ref={passwordInputRef}
        onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <p>Confirm Password</p>
        <input 
        placeholder="Confirm Password" 
        type="password" 
        className="border-1 border-gray-200 w-full rounded-md h-[30px] pl-4"
        ref={confirmPasswordRef}
        onKeyDown={handleKeyDown}
        />
      </div>
      <button className="w-full rounded-md border-1 border-gray-200 bg-white text-black cursor-pointer" onClick={registerUser}>Create account </button>
      <div className='flex justify-center'>
        Have an account?{" "}
        <Link to="/login" className='underline underline-offset-4 ml-1'> Login </Link>
      </div>
    </div>
  )


}
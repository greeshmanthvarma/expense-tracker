import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { IconLogout } from '@tabler/icons-react';
import AnimatedTabs from './components/animatedTabs';
import currencies from '@/currencies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function MainPage(){
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading} = useAuth();
  const [currency, setCurrency] = React.useState(user?.currency || 'USD');
  const tabs = [
    { id: "home", label: "Home" },
    { id: "expenses", label: "Expenses" },
    { id: "friends", label: "Friends" },
    { id: "groups", label: "Groups" },
  ]
  
  function getTabFromLocation(){
    const path = location.pathname;
    if(path.includes('expenses')){
      return 'expenses';
    }else if(path.includes('friends')){
      return 'friends';
    }else if(path.includes('groups')){
      return 'groups';
    }
    return 'home';
  }

  const [selectedTab,setSelectedTab]=React.useState(getTabFromLocation())
  React.useEffect(()=>{
   if(selectedTab !== getTabFromLocation()){
    switch(selectedTab){
      case 'home':
        navigate('/home')
        break
      case 'expenses':
        navigate('/home/expenses')
        break
      case 'friends':
        navigate('/home/friends')
        break
      case 'groups':
        navigate('/home/groups')
        break
      }
    }
  },[selectedTab])

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
    <div className='w-screen h-screen bg-black flex flex-col relative'>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
        }}
      />
      

      <div className='flex w-auto h-16 rounded-full mx-auto my-2 px-4 py-2 gap-6 justify-between items-center bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl sticky top-0 z-10 relative'>
        
        <span onClick={()=>{navigate('/home'); setSelectedTab('home')}} className='cursor-pointer'>
          <p className='text-black font-instrument-serif text-2xl'>FinTrack AI</p>
        </span>
        
        <div className='flex justify-between gap-2'>
          <AnimatedTabs tabs={tabs} activeTab={selectedTab} setActiveTab={setSelectedTab} layoutId='main-tabs' />
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
           <div className='w-8 h-8 rounded-full flex items-center justify-center'>
              {user && <img src={user.profilephoto ? user.profilephoto : '/assets/defaultprofilephoto.png'} className='rounded-full'/>}
            </div>
            <h3 className='text-black font-medium text-sm'>{user && user.username}</h3>
          </div>
        </div>
       <Select value={user?.currency || 'USD'}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select Currency' />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>{currency.label} {currency.name}</SelectItem>
          ))}
        </SelectContent>
       </Select>
        <div className='p-4'>
          <button className='w-full flex items-center p-3 rounded-lg text-black hover:bg-notion-gray-2 hover:text-white transition-colors'
            onClick={()=>onLogout()}
          >
            <span className='mr-3'>
              <IconLogout stroke={2} />
            </span>
            Logout
          </button>
        </div>
      </div>


      <div className='w-screen overflow-y-auto flex-1 mx-auto relative z-0'>
        <div className='mx-6 my-4 h-7/8'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
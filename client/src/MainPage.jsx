import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { IconLogout, IconChevronDown, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeContext';
import AnimatedTabs from './components/animatedTabs';
import currencies from './components/currencies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
export default function MainPage(){
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, setUser} = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  async function handleCurrencyChange(value){
    const oldCurrency = user?.currency;
    
    if(user){
      setUser({ ...user, currency: value });
    }
    
    try{
      const response = await fetch('/api/user/currency', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ currency: value })
      });
      if(!response.ok){
        if(user && oldCurrency){
          setUser({ ...user, currency: oldCurrency });
        }
        alert('Failed to update currency');
      }
    }catch(error){
      if(user && oldCurrency){
        setUser({ ...user, currency: oldCurrency });
      }
      console.error('Error updating currency:', error);
      alert('Failed to update currency');
    }
  }

  return(
    <div className='w-screen h-screen bg-black flex flex-col relative'>
      
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.1), transparent 50%),
            radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0, 0, 0, 0.1), transparent 50%),
            linear-gradient(to bottom, #35578F 0%, #4A6FA5 30%, #7A9BC4 50%, #B8A68A 80%, #D4B994 100%)
          `,
        }}
      />

      <div className='flex w-auto h-16 rounded-full mx-auto my-2 px-4 py-2 gap-6 justify-between items-center bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl sticky top-0 z-10 relative'>
        
        <span onClick={()=>{navigate('/home'); setSelectedTab('home')}} className='cursor-pointer'>
          <p className='text-black dark:text-white font-instrument-serif text-2xl'>FinTrack AI</p>
        </span>
        
        <div className='flex justify-between gap-2'>
          <AnimatedTabs tabs={tabs} activeTab={selectedTab} setActiveTab={setSelectedTab} layoutId='main-tabs' />
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/30 dark:bg-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-gray-900/60 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <IconSun className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <IconMoon className="w-5 h-5 text-black dark:text-white" />
            )}
          </button>
          <Select value={user?.currency || 'USD'} onValueChange={handleCurrencyChange}>
            <SelectTrigger className='h-10 rounded-full bg-white/30 backdrop-blur-xl border border-white/30 text-black hover:bg-white/40 transition-all px-4 py-2'>
              <SelectValue>
                {currencies.find(c => c.value === (user?.currency || 'USD'))?.label || '$'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label} {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none cursor-pointer">
                <div className='w-8 h-8 rounded-full flex items-center justify-center'>
                  {user && <img src={user.profilephoto ? user.profilephoto : '/assets/defaultprofilephoto.png'} className='rounded-full w-full h-full object-cover'/>}
                </div>
                <h3 className='text-black dark:text-white font-medium text-sm'>{user && user.username}</h3>
                <IconChevronDown className="w-4 h-4 text-black dark:text-white" stroke={2} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-xl border-white/30">
              <DropdownMenuItem 
                onClick={onLogout}
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
              >
                <IconLogout className="w-4 h-4" stroke={2} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
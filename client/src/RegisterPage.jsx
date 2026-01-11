import RegisterComponent from "./components/registerComponent.jsx"
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeContext';
export default function RegisterPage(){
  
  const { theme, toggleTheme } = useTheme();
  return(
    <div className="min-h-svh w-screen relative bg-black flex justify-center items-center">
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
      <div className='absolute top-4 right-4'>
      <button
            onClick={toggleTheme}
            className="p-2 rounded-full cursor-pointer bg-white/30 dark:bg-gray-900/50 backdrop-blur-xl border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-gray-900/60 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <IconSun className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <IconMoon className="w-5 h-5 text-black dark:text-white" />
            )}
          </button>
      </div>
      <div className="relative z-10">
        <RegisterComponent/> 
      </div>
    </div>
  )
}
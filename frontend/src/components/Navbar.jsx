import React from 'react';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name ? name.trim().split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() : '??';
  };

  return (
    <header className="h-16 bg-app-surface border-b border-app-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-app-surface-muted rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center bg-app-surface-muted rounded-full px-4 py-2 w-64 lg:w-96">
          <Search className="h-4 w-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-app-muted"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/search')}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-full border border-app-border bg-app-surface px-3 py-2 text-sm font-medium text-app-text transition-colors hover:bg-app-surface-muted"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        
        <button className="p-2 rounded-full relative text-app-muted hover:bg-app-surface-muted transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-app-border"></span>
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-app-border ml-2">
          <div className="w-8 h-8 rounded-full bg-app-surface-muted flex items-center justify-center text-app-text font-bold text-xs">
            {getInitials(user?.username)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-app-text leading-none">{user?.username}</p>
            <p className="text-xs text-app-muted mt-1">Free Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

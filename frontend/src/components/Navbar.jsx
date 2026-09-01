import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Moon, Sun, Menu, CheckCircle2, Shield, X, Command } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const notificationsRef = useRef(null);

  const getInitials = (name) => {
    return name ? name.trim().split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() : 'DS';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const notifications = [
    { id: 1, title: 'Welcome to DocSphere', desc: 'Get started by uploading your first document.', time: 'Just now', unread: true },
    { id: 2, title: 'AI Assistant Ready', desc: 'Ask any PDF question directly in the viewer.', time: '1h ago', unread: false },
  ];

  return (
    <header className="h-16 bg-app-surface/90 backdrop-blur-md border-b border-app-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-app-muted hover:text-app-text hover:bg-app-surface-muted rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center bg-app-surface-muted border border-app-border/60 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 rounded-full px-3.5 py-1.5 w-64 lg:w-96 transition-all">
          <Search className="h-4 w-4 text-app-muted shrink-0" />
          <input 
            type="text" 
            placeholder="Search documents, tags, or AI summaries..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="bg-transparent border-none focus:outline-none text-sm ml-2.5 w-full text-app-text placeholder:text-app-muted/70"
          />
          <div className="hidden lg:flex items-center gap-0.5 text-[10px] font-bold text-app-muted/80 bg-app-surface border border-app-border px-1.5 py-0.5 rounded-md shrink-0">
            <Command className="h-3 w-3" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Switcher Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-full border border-app-border bg-app-surface px-3 py-1.5 text-xs font-semibold text-app-text transition-all hover:bg-app-surface-muted hover:border-primary-500/30 cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-indigo-600" />
              <span>Dark</span>
            </>
          )}
        </button>
        
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full relative text-app-muted hover:text-app-text hover:bg-app-surface-muted transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-app-surface"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-app-surface border border-app-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-app-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary-600" />
                  <h3 className="font-bold text-sm text-app-text">Notifications</h3>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-app-muted hover:text-app-text p-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="divide-y divide-app-border/60 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition-colors hover:bg-app-surface-muted/60 ${n.unread ? 'bg-primary-500/5' : ''}`}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-app-text">{n.title}</h4>
                      <span className="text-[10px] text-app-muted whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-app-muted leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-app-surface-muted/50 border-t border-app-border text-center">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-primary-600 font-semibold hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-app-border ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-primary-500/20">
            {getInitials(user?.username || user?.full_name)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-app-text leading-tight">{user?.username || user?.full_name || 'Member'}</p>
            <p className="text-[10px] text-primary-600 font-semibold capitalize flex items-center gap-1">
              <Shield className="h-2.5 w-2.5" /> {user?.role || 'Standard'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

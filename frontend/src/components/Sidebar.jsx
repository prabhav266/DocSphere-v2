import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Files, 
  Upload as UploadIcon, 
  Search, 
  Settings, 
  Shield, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    ...(isAdmin ? [{ name: 'Admin Hub', path: '/dashboard/admin', icon: Shield, badge: 'Admin' }] : []),
    { name: 'Dashboard', path: '/dashboard/home', icon: Home },
    { name: 'All Library', path: '/dashboard/library', icon: Files },
    { name: 'My PDFs', path: '/dashboard/pdf-library', icon: FileText },
    { name: 'Upload', path: '/dashboard/upload', icon: UploadIcon },
    { name: 'Search', path: '/dashboard/search', icon: Search },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 bg-app-surface border-r border-app-border transition-all duration-300 ease-in-out md:relative flex flex-col",
      isOpen ? "w-64" : "w-20",
      !isOpen && "md:w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-5 border-b border-app-border shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div className={cn(
              "flex flex-col transition-all duration-300",
              isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none absolute"
            )}>
              <span className="text-lg font-extrabold text-app-text tracking-tight flex items-center gap-1.5">
                DocSphere
              </span>
              <span className="text-[10px] text-primary-600 font-semibold uppercase tracking-widest -mt-1">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard/home' && location.pathname === '/dashboard');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center h-11 px-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-2xs" 
                    : "text-app-muted hover:bg-app-surface-muted hover:text-app-text"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-600 dark:text-primary-400" : "text-app-muted group-hover:text-app-text"
                )} />
                
                <span className={cn(
                  "ml-3 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none absolute"
                )}>
                  {item.name}
                </span>

                {item.badge && isOpen && (
                  <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-600 dark:text-primary-400">
                    {item.badge}
                  </span>
                )}

                {!isOpen && (
                  <div className="absolute left-16 bg-app-surface border border-app-border text-app-text px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-app-border shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full h-11 px-3 rounded-xl text-app-muted hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors group cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            <span className={cn(
              "ml-3 text-sm font-medium transition-all duration-200 whitespace-nowrap",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none absolute"
            )}>Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-app-surface border border-app-border text-app-text rounded-full p-1.5 shadow-md hidden md:flex items-center justify-center hover:bg-app-surface-muted transition-colors cursor-pointer z-50"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
};

export default Sidebar;

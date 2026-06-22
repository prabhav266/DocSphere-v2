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
  FileText
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Library', path: '/dashboard/library', icon: Files },
  { name: 'My Uploads', path: '/dashboard/pdf-library', icon: FileText },
  { name: 'Upload', path: '/dashboard/upload', icon: UploadIcon },
  { name: 'Search', path: '/dashboard/search', icon: Search },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:relative",
      isOpen ? "w-64" : "w-20",
      !isOpen && "md:w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <Shield className="h-8 w-8 text-primary-600 shrink-0" />
            <span className={cn(
              "text-xl font-bold transition-opacity",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>DocSphere</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center h-12 px-3 rounded-lg transition-colors group relative",
                  isActive 
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                <span className={cn(
                  "ml-3 font-medium transition-opacity",
                  isOpen ? "opacity-100" : "opacity-0 absolute left-12 w-0 overflow-hidden"
                )}>
                  {item.name}
                </span>
                {!isOpen && (
                   <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                     {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full h-12 px-3 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/10 transition-colors group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn(
              "ml-3 font-medium transition-opacity",
              isOpen ? "opacity-100" : "opacity-0"
            )}>Logout</span>
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-md hidden md:block"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;

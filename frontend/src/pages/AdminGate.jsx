import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogIn, UserPlus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const AdminGate = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold">DocSphere Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-600 text-white">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Admin Login Required</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Access your DocSphere dashboard by logging in or creating an account. Only authorized administrators should proceed.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link to="/login" className="block">
              <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-primary-500 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-primary-500/30 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary-600 p-3 text-white">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Admin Login</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in with your administrator credentials.</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/register" className="block">
              <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-primary-500 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-primary-500/30 dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Create Account</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Register a new admin account to manage documents.</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminGate;

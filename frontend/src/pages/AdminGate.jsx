import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogIn, UserPlus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const AdminGate = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <nav className="fixed top-0 w-full bg-app-surface/90 backdrop-blur-md border-b border-app-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold">DocSphere Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-full p-2 hover:bg-app-surface-muted"
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
        <div className="w-full max-w-3xl rounded-3xl border border-app-border bg-app-surface/90 p-10 shadow-xl shadow-slate-900/5 backdrop-blur dark:bg-app-surface/95">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-600 text-white">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Admin Login Required</h1>
            <p className="mt-4 text-lg text-app-muted max-w-2xl mx-auto">
              Access your DocSphere dashboard by logging in or creating an account. Only authorized administrators should proceed.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link to="/login" className="block">
              <div className="group rounded-3xl border border-app-border bg-app-surface-muted p-8 transition hover:border-primary-500 hover:bg-primary-50 dark:hover:border-primary-500/30 dark:hover:bg-primary-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-app-text p-3 text-white">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Admin Login</h2>
                    <p className="mt-2 text-app-muted">Sign in with your administrator credentials.</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/register" className="block">
              <div className="group rounded-3xl border border-app-border bg-app-surface-muted p-8 transition hover:border-primary-500 hover:bg-primary-50 dark:hover:border-primary-500/30 dark:hover:bg-primary-900/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-app-text p-3 text-white">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Create Account</h2>
                    <p className="mt-2 text-app-muted">Register a new admin account to manage documents.</p>
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

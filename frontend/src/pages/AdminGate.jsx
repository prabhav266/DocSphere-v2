import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogIn, UserPlus, Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const AdminGate = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />

      <nav className="fixed top-0 w-full bg-app-surface/90 backdrop-blur-md border-b border-app-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">DocSphere</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-app-muted hover:text-app-text hover:bg-app-surface-muted rounded-full transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
              </button>
              <Link to="/login">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16 relative z-10">
        <div className="w-full max-w-2xl rounded-3xl border border-app-border bg-app-surface/95 p-8 sm:p-12 shadow-2xl backdrop-blur">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400">
              DocSphere Gateway
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-app-text">
              Welcome to DocSphere
            </h1>
            <p className="mt-3 text-sm text-app-muted max-w-md mx-auto leading-relaxed">
              Access your document management workspace, upload files, or review platform analytics.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link to="/login" className="block group">
              <div className="h-full rounded-2xl border border-app-border bg-app-surface-muted/60 p-6 transition-all duration-300 group-hover:border-primary-500/50 group-hover:bg-app-surface group-hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary-600 p-3 text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-app-text flex items-center gap-1 group-hover:text-primary-600 transition-colors">
                      Account Sign In <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="mt-1 text-xs text-app-muted leading-normal">Sign in to access your library and dashboard.</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/register" className="block group">
              <div className="h-full rounded-2xl border border-app-border bg-app-surface-muted/60 p-6 transition-all duration-300 group-hover:border-primary-500/50 group-hover:bg-app-surface group-hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-indigo-600 p-3 text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-app-text flex items-center gap-1 group-hover:text-primary-600 transition-colors">
                      New Account <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="mt-1 text-xs text-app-muted leading-normal">Register a new account for document access.</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-app-muted border-t border-app-border/40">
        © 2026 DocSphere Platform.
      </footer>
    </div>
  );
};

export default AdminGate;

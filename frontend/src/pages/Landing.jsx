import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Shield, Layout, Search, Cloud, Menu, X, Moon, Sun, Sparkles, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full bg-app-bg text-app-text">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-app-surface/85 backdrop-blur-md z-50 border-b border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-app-text tracking-tight">DocSphere</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-app-muted hover:text-primary-600 transition-colors font-medium">Features</a>
              <a href="#security" className="text-sm text-app-muted hover:text-primary-600 transition-colors font-medium">Security</a>
              <button onClick={toggleTheme} className="p-2 rounded-full text-app-muted hover:text-app-text hover:bg-app-surface-muted transition-colors cursor-pointer">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
              </button>
              <Link to="/login">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gap-2">Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 text-app-muted">
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-app-muted">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-app-border bg-app-surface p-4 space-y-3 animate-fade-in">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-sm text-app-muted font-medium py-1">Features</a>
            <a href="#security" onClick={() => setIsMenuOpen(false)} className="block text-sm text-app-muted font-medium py-1">Security</a>
            <div className="pt-2 border-t border-app-border flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden bg-gradient-to-b from-primary-500/10 via-app-bg to-app-bg">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-600 dark:text-primary-400 text-xs font-bold mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Document Management
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-app-text mb-6 tracking-tight leading-tight">
            Manage Documents with <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Precision.</span>
          </h1>

          <p className="text-lg md:text-xl text-app-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate secure repository for your PDFs, notes, and reports. Upload, organize, and interact with your files using built-in AI summaries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 shadow-lg gap-2 text-base">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 text-base">
                Sign In to Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-app-surface border-y border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Everything you need</h2>
            <p className="text-app-muted text-base">High-performance tools designed for modern document organization.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cloud className="h-7 w-7 text-primary-600" />}
              iconBg="bg-primary-500/10"
              title="Cloud Synchronization"
              description="Upload and store your documents with high-availability enterprise cloud storage."
            />
            <FeatureCard 
              icon={<Search className="h-7 w-7 text-indigo-600" />}
              iconBg="bg-indigo-500/10"
              title="Instant AI Search"
              description="Locate documents instantly with keyword search, type filters, and auto-generated tags."
            />
            <FeatureCard 
              icon={<Sparkles className="h-7 w-7 text-emerald-600" />}
              iconBg="bg-emerald-500/10"
              title="Interactive AI Q&A"
              description="Ask questions directly to your PDF documents and receive instant summaries and answers."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-app-bg">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-app-surface border border-app-border shadow-sm flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shrink-0">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-app-text mb-2">Admin Moderation & Security</h3>
              <p className="text-app-muted text-sm leading-relaxed mb-4">
                DocSphere includes built-in admin approval workflows to ensure user accounts and public uploaded documents are vetted before exposure.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-app-text">
                <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary-600" /> Role Control</span>
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Fast Moderation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-app-border bg-app-surface">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-app-text">DocSphere</span>
          </div>
          <p className="text-app-muted text-xs">
            © 2026 DocSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, iconBg, title, description }) => (
  <div className="p-8 rounded-3xl border border-app-border hover:border-primary-500/40 transition-all duration-300 bg-app-surface hover:-translate-y-1 hover:shadow-lg">
    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-app-text">{title}</h3>
    <p className="text-app-muted text-sm leading-relaxed">{description}</p>
  </div>
);

export default Landing;

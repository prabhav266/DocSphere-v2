import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Shield, Layout, Search, Cloud, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-app-surface/80 backdrop-blur-md z-50 border-b border-app-border text-app-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-app-text">DocSphere</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-app-muted hover:text-primary-600 transition-colors">Features</a>
              <a href="#about" className="text-app-muted hover:text-primary-600 transition-colors">About</a>
              <a href="#contact" className="text-app-muted hover:text-primary-600 transition-colors">Contact</a>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-app-surface-muted">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-950/20 dark:to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-app-text mb-6 tracking-tight">
            Manage Documents with <span className="text-primary-600">Precision.</span>
          </h1>
          <p className="text-xl text-app-muted mb-10 max-w-2xl mx-auto">
            The ultimate repository for your PDFs, notes, reports, and presentations. Organize, search, and access everything in one secure place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-8">Create Free Account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">Live Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-24 bg-app-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-app-muted">Streamlined features for modern document management.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cloud className="h-8 w-8 text-blue-500" />}
              title="Secure Storage"
              description="Upload and store your documents with enterprise-grade security and reliability."
            />
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-teal-500" />}
              title="Smart Search"
              description="Find any document instantly with powerful keyword search and advanced filtering."
            />
            <FeatureCard 
              icon={<Layout className="h-8 w-8 text-purple-500" />}
              title="Easy Organization"
              description="Group your files into folders and categories. Toggle between grid and list views."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-app-border bg-app-surface-muted">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold">DocSphere</span>
          </div>
          <p className="text-app-muted text-sm">
            © 2026 DocSphere. Built for productivity.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl border border-app-border hover:border-primary-500/50 transition-all bg-app-surface shadow-sm">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-app-text">{title}</h3>
    <p className="text-app-muted leading-relaxed">{description}</p>
  </div>
);

export default Landing;

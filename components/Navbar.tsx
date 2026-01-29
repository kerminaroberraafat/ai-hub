
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Zap } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Chat', path: '/chat' },
    { name: 'Images', path: '/image' },
    { name: 'Video', path: '/video' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-primary/80 dark:bg-bg-primary-dark/80 backdrop-blur-xl shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light flex items-center justify-center transition-transform group-hover:-rotate-12 ease-bounce">
            <Zap size={20} className="text-accent-blue" fill="currentColor" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight gradient-text">AI HUB</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                location.pathname === link.path 
                  ? 'bg-white dark:bg-bg-secondary-dark shadow-neu-inset text-accent-blue' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-accent-blue'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light flex items-center justify-center text-slate-700 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="hidden sm:block px-6 py-2.5 bg-accent-blue text-white rounded-xl font-semibold shadow-lg hover:-translate-y-1 transition-all">
            Get Started
          </button>
          <button 
            className="md:hidden w-10 h-10 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-primary dark:bg-bg-primary-dark border-t border-slate-200 dark:border-slate-800 p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium ${
                  location.pathname === link.path 
                    ? 'bg-white dark:bg-bg-secondary-dark shadow-neu-inset text-accent-blue' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

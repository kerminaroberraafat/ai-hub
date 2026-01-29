
import React from 'react';
import { Github, Twitter, Linkedin, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-secondary dark:bg-bg-primary-dark border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light flex items-center justify-center">
                <Zap size={20} className="text-accent-blue" fill="currentColor" />
              </div>
              <span className="font-display font-extrabold text-2xl dark:text-white">AI HUB</span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed">
              Empowering creators with cutting-edge AI technology. Transform your workflow with intelligent tools designed for the modern era.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6 dark:text-white">Platform</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-accent-blue transition-colors">Chat Assistant</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Image Studio</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">Video Gen</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">API Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 dark:text-white">Connect</h4>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-neu-light flex items-center justify-center text-slate-400 hover:text-accent-blue hover:-translate-y-1 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold text-slate-400">
          <p>© 2024 AI HUB Platform. Built with Gemini AI.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

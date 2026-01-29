
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import ImageGen from './pages/ImageGen';
import VideoGen from './pages/VideoGen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const AppContent: React.FC<{ theme: 'light' | 'dark', toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname === '/chat';

  return (
    <div className={`min-h-screen flex flex-col bg-bg-primary dark:bg-bg-primary-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 ${isChatPage ? 'h-screen overflow-hidden' : ''}`}>
      {!isChatPage && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
      
      <main className={`flex-grow ${isChatPage ? 'h-full flex flex-col' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/image" element={<ImageGen />} />
          <Route path="/video" element={<VideoGen />} />
        </Routes>
      </main>

      {isHomePage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <HashRouter>
      <AppContent theme={theme} toggleTheme={toggleTheme} />
    </HashRouter>
  );
};

export default App;

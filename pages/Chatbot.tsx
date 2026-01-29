
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, User, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';
import { aiService } from '../services/aiService';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getWelcomeMessage = () => ({
    role: 'ai',
    content: "Neural link established. I'm your AI Hub assistant, powered by Gemini 3.0. How can I facilitate your creative workflow today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.length > 0 ? parsed : [getWelcomeMessage() as Message]);
      } catch {
        setMessages([getWelcomeMessage() as Message]);
      }
    } else {
      setMessages([getWelcomeMessage() as Message]);
    }
  }, []);

  // Save history & scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages));
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: Message = {
      role: 'user',
      content: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(msg => msg.role !== 'error')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: msg.content }]
        }));

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiPlaceholder: Message = {
        role: 'ai',
        content: '',
        timestamp
      };
      
      setMessages(prev => [...prev, aiPlaceholder]);
      
      let fullContent = '';
      const stream = aiService.chatStream(currentInput, history);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'ai') {
            lastMsg.content = fullContent;
          }
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        role: 'error',
        content: error.message || "Neural link interrupted. Please verify connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary dark:bg-bg-primary-dark">
      {/* Header */}
      <div className="z-30 bg-bg-primary/80 dark:bg-bg-primary-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/" className="p-2 md:p-2.5 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light hover:scale-105 active:scale-95 transition-all">
              <ArrowLeft size={18} className="text-slate-600 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="font-display font-black text-sm md:text-lg gradient-text leading-tight tracking-tight uppercase">Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_#10B981] animate-pulse"></div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">LINK ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <div className="px-4 py-1.5 bg-accent-blue/5 border border-accent-blue/10 rounded-full text-[9px] font-black uppercase tracking-widest text-accent-blue">
               Gemini 3.0 Engine
             </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 md:gap-4 animate-in slide-in-from-bottom-2 duration-400 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-neu-light shrink-0 relative group ${
                msg.role === 'ai' ? 'bg-gradient-to-br from-accent-blue via-accent-purple to-accent-pink text-white' : 
                msg.role === 'user' ? 'bg-white dark:bg-bg-secondary-dark text-accent-blue border border-slate-100 dark:border-slate-800' : 'bg-red-500 text-white'
              }`}>
                {msg.role === 'ai' ? <Sparkles size={16} className="md:w-5 md:h-5" /> : msg.role === 'user' ? <User size={16} className="md:w-5 md:h-5" /> : <AlertCircle size={16} className="md:w-5 md:h-5" />}
              </div>
              
              <div className={`flex flex-col gap-1 md:gap-2 max-w-[88%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-neu-light leading-relaxed group transition-all text-xs md:text-sm font-medium ${
                  msg.role === 'user' ? 'bg-accent-blue text-white rounded-tr-none' : 
                  msg.role === 'error' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200' : 'bg-white dark:bg-bg-secondary-dark dark:text-slate-200 rounded-tl-none border border-slate-50 dark:border-slate-800'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content || (isLoading && msg.role === 'ai' ? '...' : '')}</p>
                  
                  {msg.content && msg.role === 'ai' && (
                    <div className={`absolute top-0 -right-12 md:-right-14 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button 
                        onClick={() => copyMessage(msg.content, idx)}
                        className="p-1.5 bg-white dark:bg-bg-secondary-dark rounded-lg text-slate-400 hover:text-accent-blue shadow-neu-light border border-slate-100 dark:border-slate-800"
                      >
                        {copiedId === idx ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Footer Input */}
      <div className="p-4 md:p-8 z-40 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent dark:from-bg-primary-dark dark:via-bg-primary-dark/95">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="flex gap-2 md:gap-3 items-end bg-white/95 dark:bg-bg-secondary-dark/95 backdrop-blur-xl p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] shadow-raised border border-white dark:border-slate-800">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={`Type your message...`}
                className="flex-grow bg-transparent border-none focus:ring-0 px-2 md:px-3 py-2 md:py-2.5 resize-none max-h-32 md:max-h-40 dark:text-white font-medium text-xs md:text-sm placeholder:text-slate-400"
                style={{ height: 'auto' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all disabled:opacity-30 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-pink"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

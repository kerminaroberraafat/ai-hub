
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wand2, Download, RefreshCw, Layers, Maximize2, Square, Layout, Smartphone, Sparkles, Image as ImageIcon, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/aiService';

interface ImageHistoryItem {
  url: string;
  prompt: string;
  ratio: string;
  timestamp: string;
}

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history
  useEffect(() => {
    const savedHistory = localStorage.getItem('image_gen_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Sync persistence
  useEffect(() => {
    localStorage.setItem('image_gen_history', JSON.stringify(history));
  }, [history]);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const url = await aiService.generateImage(prompt, aspectRatio);
      const newItem: ImageHistoryItem = {
        url,
        prompt,
        ratio: aspectRatio,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (err: any) {
      setError("The neural engine encountered an error. Please refine your prompt.");
    } finally {
      setLoading(false);
    }
  };

  const ratios = [
    { label: '1:1', value: '1:1', icon: <Square size={14} />, desc: 'Social' },
    { label: '4:3', value: '4:3', icon: <Layout size={14} className="rotate-90" />, desc: 'Classic' },
    { label: '3:4', value: '3:4', icon: <Layout size={14} />, desc: 'Portrait' },
    { label: '16:9', value: '16:9', icon: <Maximize2 size={14} />, desc: 'Wide' },
    { label: '9:16', value: '9:16', icon: <Smartphone size={14} />, desc: 'Story' },
  ];

  const currentImage = history[0];

  return (
    <div className="pt-24 md:pt-32 pb-12 md:pb-24 max-w-7xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-8 md:mb-16 animate-in fade-in slide-in-from-top-6 duration-700">
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-neu-light text-slate-600 dark:text-slate-400 font-bold mb-6 md:mb-10 hover:shadow-raised transition-all text-xs md:text-sm">
          <ArrowLeft size={16} /> Exit Studio
        </Link>
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-blue/10 rounded-xl md:rounded-2xl flex items-center justify-center text-accent-blue">
            <ImageIcon className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-7xl gradient-text tracking-tighter">Vision Studio</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 order-1">
          <div className="bg-white dark:bg-bg-secondary-dark p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-neu-light border border-slate-100 dark:border-slate-800">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Aesthetic Description</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 md:h-40 bg-bg-primary dark:bg-bg-primary-dark rounded-2xl p-4 shadow-neu-inset border-none resize-none dark:text-white transition-all text-sm font-medium placeholder:text-slate-400"
                  placeholder="Describe your vision..."
                />
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Dimensions</p>
                <div className="grid grid-cols-5 gap-2">
                  {ratios.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setAspectRatio(r.value)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all border-2 ${
                        aspectRatio === r.value 
                          ? 'bg-accent-blue border-accent-blue text-white shadow-xl scale-105' 
                          : 'bg-white dark:bg-bg-secondary-dark text-slate-500 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {r.icon}
                      <span className="text-[8px] font-black">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-pink text-white rounded-2xl font-black shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-40 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                {loading ? 'Synthesizing...' : 'Manifest Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="lg:col-span-7 space-y-6 order-2">
          <div className="bg-white dark:bg-bg-secondary-dark rounded-[2rem] md:rounded-[2.5rem] shadow-neu-light border border-slate-50 dark:border-slate-800 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <History className="text-accent-blue" size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Gallery</h2>
            </div>

            <div className="relative mb-8">
              <div className="w-full bg-bg-primary dark:bg-bg-primary-dark rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center relative min-h-[280px] md:min-h-[400px]">
                {loading && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-bg-primary-dark/60 backdrop-blur-md flex items-center justify-center z-20">
                     <RefreshCw className="animate-spin text-accent-blue w-10 h-10 mb-4" />
                  </div>
                )}
                
                {currentImage ? (
                  <div className="group relative w-full h-full flex items-center justify-center">
                    <img src={currentImage.url} className="max-w-full max-h-[400px] md:max-h-[550px] object-contain" alt="Current" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                       <p className="text-white text-[10px] font-medium italic line-clamp-1 max-w-[80%]">"{currentImage.prompt}"</p>
                       <button onClick={() => { const link = document.createElement('a'); link.href = currentImage.url; link.download = 'render.png'; link.click(); }} className="p-3 bg-white rounded-xl text-accent-blue shadow-lg hover:scale-110 active:scale-90 transition-all"><Download size={20} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 opacity-40">
                    <Sparkles size={24} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Synthesis</p>
                  </div>
                )}
              </div>
            </div>

            {history.length > 1 && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {history.slice(1).map((item, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-bg-primary rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent-blue transition-all group relative"
                      onClick={() => { const filtered = history.filter((_, idx) => idx !== i + 1); setHistory([item, ...filtered]); }}
                    >
                      <img src={item.url} className="w-full h-full object-cover" alt="History" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40">
                         <Maximize2 className="text-white" size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGen;


import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Sparkles, RefreshCw, Maximize2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/aiService';

interface ShowcaseVideo {
  id: string;
  url: string;
  preview_url: string;
  prompt: string;
  author: string;
  tags: string[];
}

const VideoGen: React.FC = () => {
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShowcase = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await aiService.searchPexels('cinematic surreal nature drone 4k motion', 'videos');
      
      if (data && data.videos && Array.isArray(data.videos)) {
        const mappedVideos: ShowcaseVideo[] = data.videos.map((v: any) => ({
          id: v.id.toString(),
          url: v.video_files[0]?.link || '',
          preview_url: v.image,
          author: v.user?.name || 'Anonymous',
          prompt: `Synthetic motion render featuring hyper-realistic ${v.duration}s fluid movement with volumetric lighting effects.`,
          tags: ['Motion', '4K', 'Gen-3']
        }));
        setVideos(mappedVideos);
      } else {
        console.error("Unexpected Pexels API structure:", data);
        setVideos([]);
        setError("The exhibition is currently undergoing maintenance. Please try syncing again.");
      }
    } catch (err) {
      console.error("Failed to load showcase:", err);
      setError("Connectivity to the neural gallery was lost. Check your network.");
      setVideos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShowcase();
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-32 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white dark:bg-bg-secondary-dark rounded-xl md:rounded-[1.5rem] shadow-neu-light text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-8 md:mb-16 hover:-translate-y-1 transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <ArrowLeft size={14} /> Hub Entrance
        </Link>
        
        <div className="mb-6 md:mb-8">
          <span className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 text-accent-blue rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border border-accent-blue/20">
            Infinite Motion Exhibition
          </span>
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-7xl md:text-9xl mb-6 md:mb-10 gradient-text tracking-tighter leading-tight md:leading-none">THE GALLERY</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-4xl mx-auto text-sm sm:text-xl md:text-2xl leading-relaxed px-4">
          A definitive exhibition of cinematic motion synthesized by next-generation neural architectures.
        </p>

        <div className="flex flex-col items-center gap-4 mt-10 md:mt-16">
          <button 
            onClick={() => fetchShowcase(true)}
            disabled={refreshing}
            className="group inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 bg-white dark:bg-bg-secondary-dark rounded-xl md:rounded-[2rem] shadow-neu-light hover:shadow-raised transition-all font-black uppercase tracking-widest text-[10px] md:text-xs text-slate-700 dark:text-slate-300 disabled:opacity-50 border border-slate-50 dark:border-slate-800"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
            Sync New Works
          </button>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest animate-pulse mt-4">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-14">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-video bg-white dark:bg-bg-secondary-dark rounded-[2rem] md:rounded-[3.5rem] shadow-neu-light animate-pulse border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-14">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : !error ? (
              <div className="col-span-full py-20 text-center opacity-40">
                <Sparkles size={40} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest">No works discovered in this frequency</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {!loading && videos.length > 0 && (
        <div className="mt-20 md:mt-40 text-center opacity-30 px-6">
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-4">
            <div className="h-[1px] w-12 md:w-24 bg-slate-400"></div>
            <Sparkles size={20} className="md:w-6 md:h-6" />
            <div className="h-[1px] w-12 md:w-24 bg-slate-400"></div>
          </div>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-500">End of Exhibition</p>
        </div>
      )}
    </div>
  );
};

const VideoCard: React.FC<{ video: ShowcaseVideo }> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white dark:bg-bg-secondary-dark rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-neu-light hover:shadow-raised transition-all duration-700 md:duration-1000 border border-slate-50 dark:border-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative overflow-hidden bg-slate-950">
        {!isHovered ? (
          <img 
            src={video.preview_url} 
            alt="Preview" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
        ) : (
          <video 
            src={video.url} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover scale-105 transition-transform duration-700"
          />
        )}
        
        {/* Play State Indicator */}
        {!isHovered && (
          <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-black/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 text-white/90 border border-white/10 group-hover:opacity-0 transition-opacity">
            <Play className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="currentColor" />
          </div>
        )}

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-10">
          <div className="flex gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
            {video.tags.map(tag => (
              <span key={tag} className="px-3 md:px-4 py-1 md:py-1.5 bg-white/10 backdrop-blur-2xl rounded-full text-[8px] md:text-[10px] font-black uppercase text-white tracking-[0.1em] border border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                if (!video.url) return;
                const link = document.createElement('a');
                link.href = video.url;
                link.download = `motion-artwork-${video.id}.mp4`;
                link.click();
              }}
              className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl hover:scale-110 active:scale-90 transition-all"
              title="Export Original"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button className="flex items-center gap-2 md:gap-4 px-4 md:px-8 py-2 md:py-4 bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-white/20 transition-all">
              <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Inspect
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-10">
        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse"></div>
          <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400">Synthesis Engine v4.8</p>
        </div>
        <p className="text-sm md:text-lg font-medium text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed italic mb-6 md:mb-8">
          "{video.prompt}"
        </p>
        <div className="flex items-center justify-between pt-5 md:pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-accent-blue via-accent-purple to-accent-pink shadow-xl"></div>
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Artist</p>
              <p className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-300">@{video.author.split(' ')[0]}</p>
            </div>
          </div>
          <div className="px-3 md:px-4 py-1 md:py-1.5 bg-accent-blue/5 border border-accent-blue/20 rounded-lg md:rounded-xl">
             <span className="text-[8px] md:text-[10px] font-black text-accent-blue uppercase tracking-widest">COLLECTOR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGen;

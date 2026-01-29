
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Image, Film, Sparkles, ArrowRight, Rocket, Play } from 'lucide-react';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  tags: string[];
  demo: React.ReactNode;
}> = ({ title, description, icon, link, tags, demo }) => (
  <div className="group relative bg-white dark:bg-bg-secondary-dark rounded-[2rem] md:rounded-[2.5rem] p-6 lg:p-8 shadow-neu-light hover:shadow-raised transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
    <div className="mb-5 md:mb-6 w-14 h-14 md:w-16 md:h-16 bg-bg-primary dark:bg-bg-primary-dark rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-neu-inset group-hover:scale-110 group-hover:-rotate-6 transition-all ease-bounce text-accent-blue">
      {icon}
    </div>
    <h3 className="font-display font-bold text-xl md:text-2xl mb-3 md:mb-4 text-slate-900 dark:text-white leading-tight">{title}</h3>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">{description}</p>
    
    <div className="mb-6 md:mb-8 bg-bg-primary dark:bg-bg-primary-dark rounded-xl md:rounded-2xl p-4 shadow-neu-inset min-h-[120px] md:min-h-[140px] flex flex-col justify-center overflow-hidden">
      {demo}
    </div>

    <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
      {tags.map(tag => (
        <span key={tag} className="px-2.5 py-1 bg-accent-blue/5 border border-accent-blue/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent-blue whitespace-nowrap">
          {tag}
        </span>
      ))}
    </div>

    <Link to={link} className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-accent-blue text-white rounded-xl font-bold text-sm shadow-lg hover:bg-accent-blue/90 transition-all w-full sm:w-fit mt-auto justify-center sm:justify-start">
      Start Now <ArrowRight size={18} />
    </Link>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24 md:mb-32">
        <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 bg-white dark:bg-bg-secondary-dark shadow-neu-light rounded-full text-accent-blue font-bold text-[9px] sm:text-xs md:text-sm mb-6 sm:mb-8 md:mb-10 animate-bounce-slow border border-slate-50 dark:border-slate-800">
          <Sparkles size={14} className="md:w-4 md:h-4" /> <span>Powered by Advanced Gemini 3.0</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-8xl leading-tight lg:leading-none mb-6 md:mb-8 tracking-tighter text-slate-900 dark:text-white">
          Transform Ideas Into<br />
          <span className="gradient-text">Reality</span>
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 md:mb-12 font-medium px-4">
          Experience the cutting edge of artificial intelligence. Transform ideas into reality with our revolutionary suite of AI tools—designed for creators, innovators, and visionaries.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 md:mb-20 px-4">
          <Link to="/chat" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-accent-blue text-white rounded-2xl font-bold text-base md:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all text-center">
            Explore Platform
          </Link>
          <a href="#process" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white dark:bg-bg-secondary-dark shadow-neu-light rounded-2xl font-bold text-base md:text-lg hover:shadow-raised transition-all text-center border border-slate-50 dark:border-slate-800">
            How It Works
          </a>
        </div>
        
        <div className="flex justify-center gap-6 sm:gap-10 md:gap-12 flex-wrap opacity-60">
          {[
            { value: '3', label: 'AI Tools' },
            { value: '∞', label: 'Possibilities' },
            { value: '24/7', label: 'Online' }
          ].map((stat, i) => (
            <div key={i} className="text-center min-w-[80px]">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text">{stat.value}</div>
              <div className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 md:mb-40">
        <div className="text-center mb-12 md:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/10 text-accent-blue text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full mb-4 md:mb-6">
            <Sparkles size={14} /> Core Features
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl mb-4 md:mb-6 tracking-tighter uppercase text-slate-900 dark:text-white leading-tight w-full text-center">Powerful AI Tools</h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium px-4 text-center">
            Three powerful technologies designed to elevate your creative and professional workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard 
            title="AI Chatbot Assistant"
            description="Engage with our intelligent conversational AI. Get instant answers, creative solutions, technical guidance, and expert insights across unlimited domains."
            icon={<MessageSquare className="w-8 h-8 md:w-10 md:h-10" />}
            link="/chat"
            tags={["Natural Language", "Context-Aware", "Real-Time"]}
            demo={
              <div className="space-y-2 md:space-y-3 px-2">
                <div className="bg-accent-blue text-white p-2.5 md:p-3 rounded-xl rounded-tr-none ml-4 md:ml-10 text-[10px] md:text-[11px] font-bold shadow-md">How can AI transform my workflow?</div>
                <div className="bg-white dark:bg-bg-secondary-dark p-2.5 md:p-3 rounded-xl rounded-tl-none mr-4 md:mr-10 text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 font-medium border border-slate-100 dark:border-slate-800">I can help automate tasks, analyze data, and provide intelligent recommendations.</div>
              </div>
            }
          />
          <FeatureCard 
            title="Text to Image Generation"
            description="Transform words into stunning visuals. Our advanced AI creates professional-quality images from your descriptions with unprecedented detail and artistic flair."
            icon={<Image className="w-8 h-8 md:w-10 md:h-10" />}
            link="/image"
            tags={["4K Quality", "Multiple Styles", "Instant"]}
            demo={
              <div className="h-20 md:h-24 bg-gradient-to-tr from-accent-blue/10 via-accent-purple/10 to-accent-pink/10 rounded-xl flex items-center justify-center border border-white/40 dark:border-slate-800">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-bg-secondary-dark rounded-xl shadow-lg flex items-center justify-center animate-pulse border border-slate-50 dark:border-slate-800">
                  <Image size={24} className="text-accent-blue" />
                </div>
              </div>
            }
          />
          <FeatureCard 
            title="Image to Video Creation"
            description="Animate your images with AI-powered motion. Transform static visuals into dynamic, cinematic videos with smooth transitions and professional effects."
            icon={<Film className="w-8 h-8 md:w-10 md:h-10" />}
            link="/video"
            tags={["Cinematic", "Smooth Motion", "HD Export"]}
            demo={
              <div className="flex gap-3 justify-center items-center h-full">
                <div className="w-7 h-12 md:w-9 md:h-16 bg-accent-blue/20 rounded-md animate-bounce border border-accent-blue/20"></div>
                <div className="w-7 h-12 md:w-9 md:h-16 bg-accent-purple/20 rounded-md animate-bounce delay-75 border border-accent-purple/20"></div>
                <div className="w-7 h-12 md:w-9 md:h-16 bg-accent-pink/20 rounded-md animate-bounce delay-150 border border-accent-pink/20"></div>
              </div>
            }
          />
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 md:mb-40">
        <div className="text-center mb-12 md:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/10 text-accent-blue text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full mb-4 md:mb-6">
            <Play size={14} /> Simple Process
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl mb-4 md:mb-6 tracking-tighter uppercase text-slate-900 dark:text-white leading-tight w-full text-center">How It Works</h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium px-4 text-center">
            Three effortless steps to unlock the power of AI
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 relative">
          {/* Decorative connector line for desktop */}
          <div className="hidden lg:block absolute top-10 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -z-10"></div>
          
          {[
            { n: 1, t: "Select Your Tool", d: "Choose from our premium AI suite—intelligent chatbot, image generation, or video animation." },
            { n: 2, t: "Input Your Vision", d: "Describe what you need using natural language. Our AI understands your intent perfectly." },
            { n: 3, t: "Receive Excellence", d: "Get professional-grade results instantly. Download, share, or refine with ease." }
          ].map(step => (
            <div key={step.n} className="text-center group px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent-blue text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl font-black mx-auto mb-6 md:mb-8 shadow-raised group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-white dark:ring-bg-primary-dark">
                {step.n}
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">{step.t}</h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 md:mb-20">
        <div className="bg-white dark:bg-bg-secondary-dark rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center shadow-raised relative overflow-hidden border border-slate-50 dark:border-slate-800 flex flex-col items-center">
          <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 hidden sm:block pointer-events-none">
            <Rocket size={180} className="rotate-12" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl mb-6 relative z-10 leading-tight md:leading-tight tracking-tighter uppercase text-slate-900 dark:text-white max-w-4xl text-center">
            Ready to <span className="gradient-text">Transform</span> Your Workflow?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 md:mb-12 max-w-2xl relative z-10 font-medium px-4 text-center">
            Join visionary creators using AI Hub to push the boundaries of what's possible
          </p>
          <Link to="/chat" className="relative z-10 w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-accent-blue text-white rounded-xl md:rounded-2xl font-bold text-lg md:text-xl shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 justify-center">
            <span>Start Creating Free</span> <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Avatar } from '../../types';
import { X, Volume2, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';

interface ModalProps {
  avatar: Avatar;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Modal: React.FC<ModalProps> = ({ avatar, onClose, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [avatar]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 transition-all duration-500 ${isVisible ? 'backdrop-blur-md bg-black/40' : 'backdrop-blur-none bg-transparent pointer-events-none'}`}>
      
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div 
        className={`relative w-full max-w-5xl h-[85vh] bg-[#0a0a1a]/95 border border-yellow-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl flex flex-col md:flex-row overflow-hidden transition-all duration-500 transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10'}`}
      >
        
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>

        {/* Left Panel - Visual/Symbol */}
        <div className="md:w-5/12 h-full relative overflow-hidden bg-gradient-to-br from-black via-[#090915] to-[#1a1a3a] flex flex-col items-center justify-center p-8 border-r border-white/5">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at center, ${avatar.color}, transparent 70%)` }}></div>
          
          <div className="relative z-10 text-center">
            <div className="text-[120px] md:text-[180px] opacity-20 font-sanskrit text-white leading-none select-none">
              {avatar.sanskritName.charAt(0)}
            </div>
            
            <div className="mt-8 relative">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                 <div className="w-40 h-40 rounded-full border border-white/10" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-6xl">{getSymbolEmoji(avatar.symbol)}</span>
              </div>
            </div>
            
            <h2 className="mt-8 text-3xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500">
                {avatar.sanskritName}
            </h2>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="md:w-7/12 h-full flex flex-col relative bg-black/20">
            {/* Header Area */}
            <div className="p-8 pb-4 border-b border-white/5">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-white/20 rounded-full text-white/60">
                        Avatar #{avatar.id}
                    </span>
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white/5 rounded-full text-cyan-300">
                        {avatar.yuga}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-cinzel text-white mb-1">{avatar.name}</h1>
                <h3 className="text-xl font-philosopher text-yellow-500/80 italic">{avatar.title}</h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="mb-8">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-4 font-bold">The Legend</h4>
                    <p className="font-philosopher text-lg leading-relaxed text-gray-300 text-justify">
                        {avatar.description}
                    </p>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden group">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-transparent"></div>
                     <h4 className="text-xs uppercase tracking-[0.2em] text-yellow-400 mb-2 font-bold flex items-center gap-2">
                        Sacred Mantra <Volume2 size={14} className="opacity-70" />
                     </h4>
                     <p className="font-sanskrit text-2xl text-white mb-1">{avatar.mantra}</p>
                     <p className="font-serif text-white/60 italic">"{avatar.mantraTransliteration}"</p>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-rose-400 mb-3 font-bold">Divine Lesson</h4>
                    <p className="font-philosopher text-white/90 border-l-2 border-rose-500 pl-4 italic">
                        "{avatar.lesson}"
                    </p>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center backdrop-blur-sm">
                <button onClick={onPrev} className="flex items-center space-x-2 text-white/60 hover:text-cyan-300 transition-colors group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="uppercase tracking-wider text-sm hidden sm:inline">Previous</span>
                </button>
                
                <button className="p-3 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    <Share2 size={18} />
                </button>

                <button onClick={onNext} className="flex items-center space-x-2 text-white/60 hover:text-cyan-300 transition-colors group">
                    <span className="uppercase tracking-wider text-sm hidden sm:inline">Next</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper for pure emoji fallback if assets aren't real
function getSymbolEmoji(symbol: string): string {
    const map: Record<string, string> = {
        'Fish': '🐟',
        'Turtle': '🐢',
        'Boar': '🐗',
        'Lion': '🦁',
        'Umbrella': '☂️',
        'Axe': '🪓',
        'Bow': '🏹',
        'Flute': '🪈',
        'Lotus': '🪷',
        'Sword': '⚔️'
    };
    return map[symbol] || '✨';
}

export default Modal;

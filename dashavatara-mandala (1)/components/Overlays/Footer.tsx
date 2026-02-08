import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full p-6 z-10 pointer-events-none">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-cyan-900/60 md:text-cyan-500/40 font-cinzel">
        <div className="mb-2 md:mb-0">
          <span>Dashavatara Project</span>
        </div>
        
        <div className="flex space-x-6 pointer-events-auto">
           <span className="opacity-50">Rotate to Explore</span>
           <span className="opacity-50">•</span>
           <span className="opacity-50">Click Orbs for Details</span>
        </div>
        
        <div className="mt-2 md:mt-0 text-right">
          <span>© 2024 Cosmic Visions</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

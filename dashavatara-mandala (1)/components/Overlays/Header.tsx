import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 z-10 flex flex-col items-center justify-center pointer-events-none select-none">
      <div className="text-center">
        <h2 className="text-yellow-500/80 font-sanskrit text-xl mb-1 animate-pulse">ॐ नमो नारायणाय</h2>
        <h1 className="text-4xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-yellow-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Dashavatara Mandala
        </h1>
        <p className="text-cyan-200/60 font-philosopher tracking-[0.2em] text-sm mt-2 uppercase">
          The Cosmic Dance of Vishnu
        </p>
      </div>
    </div>
  );
};

export default Header;

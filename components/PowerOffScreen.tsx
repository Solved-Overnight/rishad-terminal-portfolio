
import React from 'react';

interface PowerOffScreenProps {
  onPowerOn: () => void;
}

const PowerOffScreen: React.FC<PowerOffScreenProps> = ({ onPowerOn }) => {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <button 
        onClick={onPowerOn}
        className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 hover:border-terminal-green/50 hover:shadow-[0_0_30px_rgba(74,246,38,0.3)] transition-all duration-500"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-zinc-600 group-hover:text-terminal-green transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
      </button>
      <div className="absolute bottom-10 text-zinc-800 text-xs font-mono">System Halted. Press Power Button.</div>
    </div>
  );
};

export default PowerOffScreen;

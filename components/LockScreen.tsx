
import React, { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for any key press to unlock
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
        // Prevent unlock on simple modifier keys to avoid accidental unlocks
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
            return;
        }
        onUnlock();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onUnlock]);

  return (
    <div 
        className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center relative font-sans text-white"
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')`,
        }}
    >
      {/* Backdrop Blur Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      {/* Top Bar */}
      <div className="absolute top-0 w-full p-2 flex justify-center z-10 bg-black/20">
        <span className="font-bold drop-shadow-md">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="z-20 flex flex-col items-center animate-slideIn">
         {/* Clock */}
         <h1 className="text-8xl font-thin tracking-tight mb-12 drop-shadow-lg">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
         </h1>

         {/* User Profile */}
         <div className="bg-black/30 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center w-80">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/20 shadow-lg">
                <img 
                    src="https://raw.githubusercontent.com/Solved-Overnight/rishad-terminal-portfolio/refs/heads/main/img/Rishad.jpg?auto=format&fit=crop" 
                    alt="User" 
                    className="w-full h-full object-cover grayscale contrast-125"
                />
            </div>
            <h2 className="text-xl font-bold mb-6">M. Rishad</h2>
            
            <button
                id="login-btn"
                onClick={onUnlock}
                className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
                Log In
            </button>
            <p className="mt-4 text-xs text-white/50">Press any key to unlock</p>
         </div>
      </div>
    </div>
  );
};

export default LockScreen;

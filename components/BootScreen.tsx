
import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState("Initializing System...");
  
  useEffect(() => {
    const messages = [
      "Loading Linux 6.1.0-kali9-amd64...",
      "Loading initial ramdisk...",
      "Mounting /root filesystem...",
      "Starting Network Manager...",
      "Starting GNOME Display Manager...",
      "Loading security modules...",
      "Establishing neural link...",
      "System Ready."
    ];
    
    let currentIndex = 0;
    
    // Update text every 400ms to simulate boot logs
    const textInterval = setInterval(() => {
      if (currentIndex < messages.length - 1) {
        currentIndex++;
        setLoadingText(messages[currentIndex]);
      }
    }, 400);

    // Complete boot sequence after 3.5 seconds
    const bootTimeout = setTimeout(() => {
        onComplete();
    }, 3500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(bootTimeout);
    };
  }, [onComplete]);

  return (
    <div className="h-screen w-screen bg-[#000000] flex flex-col items-center justify-center relative overflow-hidden font-mono">
      
      {/* Kali Logo */}
      <div className="flex flex-col items-center z-10">
         {/* Using SimpleIcons CDN for reliable loading. Color: #4af626 (Terminal Green) */}
         {/* Added -translate-x-4 to visually center the irregular dragon shape over the spinner */}
         <img 
            src="https://raw.githubusercontent.com/Solved-Overnight/rishad-terminal-portfolio/refs/heads/main/img/wolf_color_png.png"
            alt="Wolf OS" 
            className="w-32 h-32 md:w-48 md:h-48 mb-12 drop-shadow-[0_0_25px_rgba(74,246,38,0.2)] animate-pulse -translate-x-2 md:-translate-x-4"
         />
         
         {/* Kali Style Spinner */}
         <div className="relative w-12 h-12 mb-8">
            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#4af626] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
         </div>

         {/* Boot Text Animation */}
         <div className="h-6 text-[#4af626] text-sm md:text-base font-bold tracking-wider flex items-center gap-2">
            <span className="animate-pulse">_</span>
            {loadingText}
         </div>
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none"></div>
    </div>
  );
};

export default BootScreen;

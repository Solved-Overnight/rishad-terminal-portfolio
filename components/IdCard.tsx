
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OPEN_FOR_WORK } from '../constants';

const IdCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Physics state: stores target (mouse position) and current (interpolated) values
  // rX, rY: Rotation X and Y axes
  // gX, gY: Glare X and Y positions (percentage)
  const targetState = useRef({ rX: 0, rY: 0, gX: 50, gY: 50 });
  const currentState = useRef({ rX: 0, rY: 0, gX: 50, gY: 50 });

  useEffect(() => {
    let rafId: number;
    
    const updatePhysics = () => {
      // Lerp factor controls the "weight" or "sluggishness" of the card
      // 0.1 = heavy/smooth, 0.2 = snappy
      const lerpFactor = 0.1;
      
      // Interpolate rotation
      currentState.current.rX += (targetState.current.rX - currentState.current.rX) * lerpFactor;
      currentState.current.rY += (targetState.current.rY - currentState.current.rY) * lerpFactor;
      
      // Interpolate glare
      currentState.current.gX += (targetState.current.gX - currentState.current.gX) * lerpFactor;
      currentState.current.gY += (targetState.current.gY - currentState.current.gY) * lerpFactor;

      // Apply transforms directly to the DOM to avoid React render overhead
      if (cardRef.current) {
        // Round to 3 decimal places for sanity
        const rX = currentState.current.rX.toFixed(3);
        const rY = currentState.current.rY.toFixed(3);
        
        // Apply rotation
        cardRef.current.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg)`;
      }
      
      if (glareRef.current) {
          const gX = currentState.current.gX.toFixed(2);
          const gY = currentState.current.gY.toFixed(2);
          
          // Move gradient background
          glareRef.current.style.backgroundPosition = `${gX}% ${gY}%`;
          
          // Adjust opacity based on tilt intensity
          const tiltIntensity = Math.max(Math.abs(currentState.current.rX), Math.abs(currentState.current.rY));
          const opacity = (tiltIntensity / 40) + 0.1; // Base 0.1, maxes out higher
          glareRef.current.style.opacity = Math.min(0.6, opacity).toString();
      }

      rafId = requestAnimationFrame(updatePhysics);
    };
    
    updatePhysics();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const calculateTilt = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const w = rect.width;
    const h = rect.height;
    
    // Normalize coordinates (-1 to 1)
    const nX = (x / w) * 2 - 1;
    const nY = (y / h) * 2 - 1;

    // Set target rotation (Max tilt: 20 degrees)
    // Invert Y axis for correct "look at" feel
    targetState.current.rX = nY * -20; 
    targetState.current.rY = nX * 20;
    
    // Set target glare position (moves opposite to tilt for realism)
    targetState.current.gX = 50 + (nX * 40);
    targetState.current.gY = 50 + (nY * 40);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    calculateTilt(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent default scrolling only if necessary, but here we likely want to tilt
    // e.preventDefault(); // Uncomment if scrolling interferes with tilting
    const touch = e.touches[0];
    calculateTilt(touch.clientX, touch.clientY);
  };

  const handleMouseLeave = () => {
    // Reset to center when mouse leaves
    targetState.current = { rX: 0, rY: 0, gX: 50, gY: 50 };
  };

  // QR Code URL (using a free API for simplicity)
  const qrData = "https://mzrishad.netlify.app/";
  const qrUrlSmall = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}&bgcolor=255-255-255&color=0-0-0&margin=0`;
  const qrUrlLarge = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=255-255-255&color=0-0-0`;

  return (
    <>
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center perspective-1000 bg-terminal-black"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        style={{ perspective: '1200px' }}
      >
        {/* The 3D Card Container */}
        <div
          ref={cardRef}
          className="relative w-[300px] h-[480px] preserve-3d group cursor-pointer will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Lanyard Strap */}
          <div 
              className="absolute -top-[1000px] left-1/2 w-[24px] h-[1000px] bg-zinc-900 z-0 flex flex-col items-center justify-end overflow-hidden border-x border-zinc-800" 
              style={{ transform: 'translateX(-50%) translateZ(-2px)' }}
          >
              {/* Lanyard Text Pattern */}
              <div className="absolute bottom-10 flex flex-col items-center space-y-8 opacity-50">
                  <span className="text-[10px] font-mono text-gray-500 font-bold rotate-180 writing-vertical">M.RISHAD</span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold rotate-180 writing-vertical">M.RISHAD</span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold rotate-180 writing-vertical">M.RISHAD</span>
              </div>
          </div>

          {/* Lanyard Clip/Hardware */}
          <div 
            className="absolute -top-8 left-1/2 w-12 h-12 z-10"
            style={{ transform: 'translateX(-50%) translateZ(10px)' }}
          >
              <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="w-8 h-2 bg-black rounded-full opacity-50"></div>
              </div>
              {/* Metal ring connecting card */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-8 border-2 border-zinc-600 rounded-full"></div>
          </div>

          {/* Card Body */}
          <div className="absolute inset-0 bg-[#0a0a0a] rounded-xl shadow-2xl overflow-hidden border border-zinc-800/50 group-hover:border-terminal-green/30 transition-colors duration-300">
              {/* Dynamic Glare Effect */}
              <div 
                  ref={glareRef}
                  className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-300"
                  style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)',
                      backgroundSize: '200% 200%',
                      opacity: 0,
                  }}
              ></div>
              
              {/* Texture/Noise Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none z-10"></div>
              
              {/* Card Layout */}
              <div className="h-full flex flex-col p-6 relative z-10">
                  
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-8">
                      {/* Logo */}
                      <div className="w-10 h-10 border-2 border-zinc-700 rounded flex items-center justify-center bg-black/50">
                          <span className="font-bold text-xl text-zinc-500 font-mono">R</span>
                      </div>
                      {/* Brand */}
                      <div className="text-right">
                          <span className="block font-mono text-xs text-zinc-600 tracking-widest font-bold">m.rishad</span>
                      </div>
                  </div>

                  {/* Photo Area */}
                  <div className="flex-grow flex flex-col items-center justify-center">
                      
                      {/* Professional "Open for Remote job" Tag Above Image */}
                      {OPEN_FOR_WORK && (
                        <div className="mb-4 flex items-center gap-2 px-3 py-1 bg-terminal-green/5 border border-terminal-green/20 rounded-full shadow-[0_0_15px_rgba(74,246,38,0.1)] backdrop-blur-sm animate-slideInDown">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
                            </span>
                            <span className="text-[10px] text-terminal-green uppercase font-bold tracking-[0.15em] font-mono">Open for Remote job</span>
                        </div>
                      )}

                      <div className="w-48 h-48 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 mb-6 relative grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-500">
                          <img src="https://raw.githubusercontent.com/Solved-Overnight/rishad-terminal-portfolio/refs/heads/main/img/Rishad.jpg?auto=format&fit=crop" alt="M. Rishad" className="w-full h-full object-cover" />
                          {/* Photo overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                      </div>
                      
                      <h2 className="text-3xl text-white font-bold font-mono tracking-tight text-center">M. Rishad</h2>
                      <div className="flex flex-col items-center mt-2 gap-2">
                          <p className="text-white font-mono text-xs bg-[#4af626]/40 backdrop-blur-md px-3 py-1 rounded-full border border-[#4af626]/20">
                              AI & ML Engineer
                          </p>
                      </div>
                  </div>

                  {/* Footer Row */}
                  <div className="mt-auto pt-6 border-t border-zinc-800/50 flex justify-between items-end relative">
                      <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Join Date</span>
                          <span className="text-xs text-zinc-400 font-mono">Oct 2023</span>
                      </div>

                      {/* QR Code Icon (Click to Enlarge) */}
                      <div 
                          className="absolute left-1/2 -translate-x-1/2 bottom-0 group/qr cursor-pointer p-1 z-30"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowQrCode(true); 
                          }}
                          title="Scan to visit website"
                      >
                          <div className="bg-white/10 p-1 rounded hover:bg-white/20 transition-colors border border-white/5 hover:border-white/30 backdrop-blur-sm">
                              <img 
                                  src={qrUrlSmall} 
                                  alt="QR" 
                                  className="w-6 h-6 opacity-70 group-hover/qr:opacity-100 transition-opacity rounded-sm bg-white" 
                              />
                          </div>
                      </div>

                      <div className="flex flex-col items-end">
                          {/* Barcode-ish visual */}
                          <div className="flex space-x-[2px] h-4 mb-1 opacity-50">
                              {[...Array(12)].map((_, i) => (
                                  <div key={i} className={`w-[2px] bg-zinc-600 ${Math.random() > 0.5 ? 'h-full' : 'h-2/3'}`}></div>
                              ))}
                          </div>
                          <span className="text-[10px] text-zinc-600 font-mono">ID: 948382</span>
                      </div>
                  </div>
              </div>

              {/* Static Glossy Reflection (Corner) */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-xl z-10"></div>
          </div>
        </div>
      </div>

      {/* QR Code Modal Overlay - Portaled to document.body to ignore transforms */}
      {showQrCode && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-slideInDown"
          onClick={(e) => { 
            e.stopPropagation(); 
            setShowQrCode(false); 
          }}
        >
          <div 
            className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-inner mb-4">
               <img 
                  src={qrUrlLarge} 
                  alt="Scan to visit" 
                  className="w-64 h-64"
               />
            </div>
            <p className="text-black font-mono font-bold text-lg tracking-wider mb-1">SCAN TO VISIT</p>
            <a 
              href={qrData} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-500 font-mono text-xs hover:text-[#4af626] transition-colors"
            >
              mzrishad.netlify.app
            </a>
            <button 
              onClick={() => setShowQrCode(false)}
              className="mt-6 text-xs font-mono text-zinc-400 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black transition-all"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default IdCard;

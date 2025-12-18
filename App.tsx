
import React, { useState, useEffect, useCallback, useRef } from 'react';
import IdCard from './components/IdCard';
import Terminal from './components/Terminal';
import { SOCIALS } from './constants';
import { ThemeProvider } from './contexts/ThemeContext';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import Toast from './components/Toast';
import BootScreen from './components/BootScreen';
import LockScreen from './components/LockScreen';
import PowerOffScreen from './components/PowerOffScreen';
import { HistoryItem } from './types';

type SystemStatus = 'active' | 'booting' | 'locked' | 'off';

interface PowerMenuProps {
    onRestart: () => void;
    onPowerOff: () => void;
    onLogOut: () => void;
}

const PowerMenu: React.FC<PowerMenuProps> = ({ onRestart, onPowerOff, onLogOut }) => (
    <div className="absolute top-full right-0 mt-2 bg-terminal-dim/95 backdrop-blur-md border border-terminal-dim rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1 w-40 animate-slideInDown origin-top-right">
        <button onClick={onRestart} className="flex items-center gap-2 text-terminal-text hover:bg-terminal-primary hover:text-terminal-black px-3 py-2 rounded transition-colors text-sm text-left whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Restart
        </button>
        <button onClick={onPowerOff} className="flex items-center gap-2 text-terminal-text hover:bg-red-500 hover:text-white px-3 py-2 rounded transition-colors text-sm text-left whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Power Off
        </button>
        <div className="h-px bg-terminal-text-dim/20 my-0.5"></div>
        <button onClick={onLogOut} className="flex items-center gap-2 text-terminal-text hover:bg-terminal-text-dim hover:text-white px-3 py-2 rounded transition-colors text-sm text-left whitespace-nowrap">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
        </button>
    </div>
);

const PortfolioOS: React.FC = () => {
  // System State - Start with 'booting' to show boot animation on load
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('booting');
  
  // App Logic State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'terminal' | 'profile'>('terminal');
  
  const [externalCommand, setExternalCommand] = useState<string | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('terminal_sidebar_width');
          if (saved) {
              const parsed = parseFloat(saved);
              if (!isNaN(parsed) && parsed >= 20 && parsed <= 70) {
                  return parsed;
              }
          }
      }
      return 35;
  });
  
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for Power Button Containers to handle click outside logic
  const desktopPowerRef = useRef<HTMLDivElement>(null);
  const mobilePowerRef = useRef<HTMLDivElement>(null);

  const RESUME_URL = "https://drive.google.com/uc?export=download&id=1CPjiqOI3YlBRBFlw85FkyLAITE0tC653";

  useEffect(() => {
      localStorage.setItem('terminal_sidebar_width', sidebarWidth.toString());
  }, [sidebarWidth]);

  const [commandHistory, setCommandHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('terminal_command_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                    return parsed.map((cmd: string) => ({
                        command: cmd,
                        output: 'Command executed',
                        timestamp: Date.now()
                    }));
                }
                return parsed;
            } catch (e) {
                console.error("Failed to parse history", e);
                return [];
            }
        }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('terminal_command_history', JSON.stringify(commandHistory));
  }, [commandHistory]);

  // Handle Click Outside for Power Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
            (desktopPowerRef.current && desktopPowerRef.current.contains(target)) ||
            (mobilePowerRef.current && mobilePowerRef.current.contains(target))
        ) {
            return;
        }
        setIsPowerMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearHistory = () => {
      setCommandHistory([]);
      setToastMessage("History Cleared Successfully");
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setIsMobile(window.innerWidth < 768);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((mouseMoveEvent.clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth >= 20 && newWidth <= 70) {
            setSidebarWidth(newWidth);
        }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Power System Actions
  const handleRestart = () => {
      setIsPowerMenuOpen(false);
      setSystemStatus('off');
      setTimeout(() => {
          setSystemStatus('booting');
      }, 1000);
  };

  const handlePowerOff = () => {
      setIsPowerMenuOpen(false);
      setSystemStatus('off');
  };

  const handleLogOut = () => {
      setIsPowerMenuOpen(false);
      setSystemStatus('locked');
  };

  const handleBootComplete = useCallback(() => {
      setSystemStatus('active');
  }, []);

  const handleUnlock = () => {
      setSystemStatus('active');
  };

  const handlePowerOn = () => {
      setSystemStatus('booting');
  };

  // Render System States
  if (systemStatus === 'booting') {
      return <BootScreen onComplete={handleBootComplete} />;
  }

  if (systemStatus === 'locked') {
      return <LockScreen onUnlock={handleUnlock} />;
  }

  if (systemStatus === 'off') {
      return <PowerOffScreen onPowerOn={handlePowerOn} />;
  }

  const formattedTime = currentTime.toLocaleString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });

  const sidebarPx = isMobile ? windowWidth : windowWidth * (sidebarWidth / 100);
  const isSidebarCompact = !isMobile && sidebarPx < 400;
  const cardScale = isMobile ? 0.8 : Math.min(1.1, Math.max(0.4, (sidebarPx - 40) / 320));

  const socialLinks = [
    { 
        name: 'GitHub', 
        url: SOCIALS.github, 
        path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" 
    },
    { 
        name: 'LinkedIn', 
        url: SOCIALS.linkedin, 
        path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
    },
    { 
        name: 'Facebook', 
        url: "#", 
        path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" 
    },
    { 
        name: 'Instagram', 
        url: "#", 
        path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6"
    }
  ];

  const handleDownloadResume = () => {
    setExternalCommand(`git clone ${RESUME_URL}`);
    if (isMobile) setActiveMobileTab('terminal');
  };

  return (
    <div 
        ref={containerRef}
        className="h-[100dvh] w-screen bg-terminal-black text-terminal-text font-mono flex flex-col md:flex-row overflow-hidden relative selection:bg-terminal-primary selection:text-terminal-black"
    >
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Mobile Header & Navigation */}
      <div className="md:hidden flex-none h-14 bg-terminal-black/80 backdrop-blur-md border-b border-terminal-dim flex items-center justify-between px-4 z-40 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          <div className="flex bg-terminal-dim/30 rounded-lg p-1 border border-terminal-dim/30 absolute left-1/2 -translate-x-1/2">
             <button 
                onClick={() => setActiveMobileTab('profile')}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === 'profile' ? 'bg-terminal-primary text-terminal-black shadow-sm' : 'text-terminal-text-dim hover:text-terminal-text'}`}
             >
                ID Card
             </button>
             <button 
                onClick={() => setActiveMobileTab('terminal')}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeMobileTab === 'terminal' ? 'bg-terminal-primary text-terminal-black shadow-sm' : 'text-terminal-text-dim hover:text-terminal-text'}`}
             >
                Terminal
             </button>
          </div>

          <div className="flex items-center gap-0">
            {/* Mobile Resume Button */}
            <button 
                onClick={handleDownloadResume}
                className="text-terminal-text-dim hover:text-terminal-primary p-2"
                title="Download Resume"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
            
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-terminal-text-dim hover:text-terminal-primary p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            </button>
            <div className="relative" ref={mobilePowerRef}>
                <button 
                    onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)}
                    className="text-terminal-text-dim hover:text-red-500 p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
                {isPowerMenuOpen && (
                    <PowerMenu 
                        onRestart={handleRestart} 
                        onPowerOff={handlePowerOff} 
                        onLogOut={handleLogOut} 
                    />
                )}
            </div>
          </div>
      </div>

      {/* Left Column */}
      <div 
        className={`
            relative flex-shrink-0 bg-terminal-black flex flex-col items-center 
            md:justify-center overflow-y-auto md:overflow-hidden pb-20 md:pb-0
            transition-opacity duration-300 ease-in-out
            ${activeMobileTab === 'profile' ? 'flex opacity-100 z-30' : 'hidden md:flex opacity-0 md:opacity-100'}
            md:opacity-100 w-full md:w-auto h-[calc(100dvh-3.5rem)] md:h-auto
        `}
        style={{ width: isMobile ? '100%' : `${sidebarWidth}%` }}
      >
        <div className="md:absolute md:top-6 md:left-6 z-20 font-mono pointer-events-none select-none relative text-center md:text-left mt-4 md:mt-0 mb-0 md:mb-0 flex-shrink-0">
            <h1 className="text-4xl font-bold text-terminal-green tracking-tighter">M. Rishad</h1>
            <p className="text-gray-400 text-sm mt-1 tracking-wide">AI & ML Engineer</p>
        </div>

        {/* Top Right Buttons Container (Desktop) */}
        <div 
            className={`absolute top-4 right-4 z-30 flex hidden md:flex transition-all duration-500 ease-in-out ${isSidebarCompact ? 'flex-col gap-3' : 'flex-row gap-2'}`}
        >
            {/* Resume Download Icon */}
            <button 
              onClick={handleDownloadResume}
              className="p-2 text-terminal-text-dim hover:text-terminal-primary transition-all duration-300 rounded-full hover:bg-terminal-dim/20"
              title="Download Resume"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* History Icon */}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-terminal-text-dim hover:text-terminal-primary transition-all duration-300 rounded-full hover:bg-terminal-dim/20"
              title="Command History"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Settings Icon */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-terminal-text-dim hover:text-terminal-primary hover:rotate-90 transition-all duration-500 rounded-full hover:bg-terminal-dim/20"
              title="Settings & Themes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Power Icon */}
            <div className="relative" ref={desktopPowerRef}>
                <button 
                    onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)}
                    className="p-2 text-terminal-text-dim hover:text-red-500 transition-all duration-300 rounded-full hover:bg-terminal-dim/20"
                    title="Power Options"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                </button>
                {isPowerMenuOpen && (
                    <PowerMenu 
                        onRestart={handleRestart} 
                        onPowerOff={handlePowerOff} 
                        onLogOut={handleLogOut} 
                    />
                )}
            </div>
        </div>

        <button 
            onClick={() => setIsHistoryOpen(true)}
            className="md:hidden absolute top-4 right-4 p-2 bg-terminal-dim/30 rounded-full text-terminal-primary border border-terminal-dim/50 z-30"
            title="Command History"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
        </button>

        <div 
          className="transition-transform duration-100 ease-out flex-shrink-0 mb-0 md:mb-2"
          style={{ transform: `scale(${cardScale})` }}
        >
            <IdCard />
        </div>
        
        <div className={`md:absolute md:bottom-6 md:left-6 z-20 flex transition-all duration-500 ease-in-out relative mt-auto md:mt-0 mb-8 md:mb-0 flex-shrink-0 ${isSidebarCompact ? 'md:flex-col md:gap-3 items-center' : 'md:flex-row md:gap-4 items-center'} gap-4 flex-col items-center`}>
            <div className={`flex gap-4 ${isSidebarCompact ? 'md:flex-col' : ''}`}>
                {socialLinks.map((social) => (
                    <a 
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-terminal-dim flex items-center justify-center text-terminal-text-dim hover:text-terminal-primary hover:border-terminal-primary transition-all bg-terminal-black/50 hover:bg-terminal-dim/30"
                        title={social.name}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                        </svg>
                    </a>
                ))}
            </div>

            <button 
                onClick={() => {
                    setExternalCommand('contact');
                    if (isMobile) setActiveMobileTab('terminal');
                }}
                className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-full 
                    border border-terminal-green/30 bg-terminal-green/10 text-terminal-green 
                    hover:bg-terminal-green hover:text-terminal-black hover:shadow-[0_0_15px_rgba(74,246,38,0.4)]
                    transition-all duration-300 text-xs font-bold uppercase tracking-wider
                    ${isSidebarCompact ? 'md:w-8 md:h-8 md:p-0 md:justify-center md:overflow-hidden' : ''}
                `}
                title="Contact Me"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={`${isSidebarCompact ? 'md:hidden' : 'block'}`}>Contact Me</span>
            </button>
        </div>

        <div className="absolute bottom-6 right-6 z-20 select-none hidden md:block pointer-events-none">
            <p className="text-terminal-green text-[10px] font-mono tracking-widest opacity-50">
                [Interactive 3D Card]
            </p>
        </div>

      </div>

      {/* Resizer Handle (Desktop Only) */}
      <div 
        className={`hidden md:block w-1 h-full cursor-col-resize z-50 transition-colors flex-shrink-0
            ${isResizing ? 'bg-terminal-primary' : 'bg-terminal-dim hover:bg-terminal-primary/50'}`}
        onMouseDown={startResizing}
      />

      {/* Right Column: Terminal Interface */}
      <div 
        className={`
            flex-col bg-terminal-black relative
            ${activeMobileTab === 'terminal' ? 'flex' : 'hidden md:flex'}
            w-full md:w-auto
            h-[calc(100dvh-3.5rem)] md:h-auto
        `}
        style={{ width: isMobile ? '100%' : `${100 - sidebarWidth}%` }}
      >
        <Terminal 
            commandHistory={commandHistory} 
            setCommandHistory={setCommandHistory} 
            externalCommand={externalCommand}
            onCommandComplete={() => setExternalCommand(null)}
            onRestart={handleRestart}
            onPowerOff={handlePowerOff}
            onLogOut={handleLogOut}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-terminal-black border-t border-terminal-dim flex items-center justify-center px-4 text-sm z-30 select-none">
            <span className="text-terminal-green font-bold absolute left-4 hidden md:inline text-xs">Portfolio OS v2.5</span>
            <span className="text-terminal-primary text-xs md:text-sm">{formattedTime}</span>
            <a href="#" className="absolute right-4 font-mono text-xs text-terminal-text-dim hover:text-terminal-primary transition-colors border-b border-transparent hover:border-terminal-primary pb-0.5 flex items-center gap-1 hidden md:flex">
               Featured on Solved Overnight <span className="text-[10px]">↗</span>
            </a>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={commandHistory}
        onClear={handleClearHistory}
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PortfolioOS />
    </ThemeProvider>
  );
};

export default App;

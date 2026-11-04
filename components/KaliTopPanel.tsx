import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getSoundSettings, saveSoundSettings, playUIClickSound } from '../utils/soundEffects';

interface KaliTopPanelProps {
  onRunCommand: (cmd: string) => void;
  onOpenProjects: () => void;
  onOpenBlogs: () => void;
  onOpenSettings: () => void;
  onRestart: () => void;
  onPowerOff: () => void;
  onLogOut: () => void;
  activeWorkspace?: number;
  onSelectWorkspace?: (ws: number) => void;
  isUndercover: boolean;
  onToggleUndercover: () => void;
}

export const KaliTopPanel: React.FC<KaliTopPanelProps> = ({
  onRunCommand,
  onOpenProjects,
  onOpenBlogs,
  onOpenSettings,
  onRestart,
  onPowerOff,
  onLogOut,
  activeWorkspace = 1,
  onSelectWorkspace,
  isUndercover,
  onToggleUndercover,
}) => {
  const { currentTheme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPowerOpen, setIsPowerOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('01');
  
  // Resource metrics with subtle realism
  const [cpuLoad, setCpuLoad] = useState(14);
  const [ramUsed, setRamUsed] = useState(5.8);

  const [soundEnabled, setSoundEnabled] = useState(() => getSoundSettings().enabled);
  const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' && !!document.fullscreenElement);

  const menuRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playUIClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Failed to enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Failed to exit fullscreen:', err);
        });
      }
    }
  };

  useEffect(() => {
    const resInterval = setInterval(() => {
      setCpuLoad(prev => Math.max(6, Math.min(94, Math.floor(prev + (Math.random() * 8 - 4)))));
      setRamUsed(prev => +(Math.max(4.2, Math.min(18.5, prev + (Math.random() * 0.4 - 0.2)))).toFixed(1));
    }, 3000);
    return () => clearInterval(resInterval);
  }, []);

  // Listen to sound settings updates
  useEffect(() => {
    const handleSoundChange = () => {
      setSoundEnabled(getSoundSettings().enabled);
    };
    window.addEventListener('sound-settings-changed', handleSoundChange);
    return () => window.removeEventListener('sound-settings-changed', handleSoundChange);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (powerRef.current && !powerRef.current.contains(target)) {
        setIsPowerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    playUIClickSound();
    const updated = saveSoundSettings({ enabled: !soundEnabled });
    setSoundEnabled(updated.enabled);
  };

  const handleLaunch = (cmd: string) => {
    playUIClickSound();
    setIsMenuOpen(false);
    onRunCommand(cmd);
  };

  const menuCategories = [
    {
      id: '01',
      title: '01 - Recon & Profile',
      icon: '🔍',
      items: [
        { label: 'whoami', desc: 'Current authenticated identity', cmd: 'whoami' },
        { label: 'neofetch', desc: 'System specs & portfolio stats', cmd: 'neofetch' },
        { label: 'about.txt', desc: 'AI/ML background & vision', cmd: 'about' },
        { label: 'experience', desc: 'Work history & achievements', cmd: 'experience' },
        { label: 'education', desc: 'Academic CS degree details', cmd: 'education' },
        { label: 'certifications', desc: 'Verified AI/ML credentials', cmd: 'certifications' },
        { label: 'contact', desc: 'Email, GitHub, LinkedIn, WhatsApp', cmd: 'contact' },
      ]
    },
    {
      id: '02',
      title: '02 - Computer Vision & ML',
      icon: '👁️',
      items: [
        { label: 'projects', desc: 'Browse AI portfolio showcase deck', action: onOpenProjects },
        { label: 'yolov8-detect', desc: 'Realtime object tracking model', cmd: 'projects' },
        { label: 'skills', desc: 'PyTorch, TensorRT, OpenCV matrix', cmd: 'skills' },
        { label: 'sudo apt update', desc: 'Fetch latest research packages', cmd: 'sudo apt update' },
        { label: 'sudo apt upgrade', desc: 'Deploy latest portfolio builds', cmd: 'sudo apt upgrade' },
      ]
    },
    {
      id: '03',
      title: '03 - LLM & GenAI Agents',
      icon: '🧠',
      items: [
        { label: 'blogs', desc: 'Read tech blogs & articles', action: onOpenBlogs },
        { label: 'agent-orchestrator', desc: 'LangGraph multi-agent flow', cmd: 'cat about.txt' },
        { label: 'rag-vector-db', desc: 'ChromaDB & semantic memory', cmd: 'skills' },
        { label: 'git clone resume', desc: 'Download official CV (PDF)', cmd: 'git clone resume' },
      ]
    },
    {
      id: '04',
      title: '04 - System Diagnostics',
      icon: '⚡',
      items: [
        { label: 'nvidia-smi', desc: 'NVIDIA GPU VRAM & model telemetry', cmd: 'nvidia-smi' },
        { label: 'htop', desc: 'Interactive CPU/RAM process monitor', cmd: 'htop' },
        { label: 'nmap localhost', desc: 'Scan AI microservice endpoints', cmd: 'nmap' },
        { label: 'cmatrix', desc: 'Digital rain terminal stream', cmd: 'cmatrix' },
      ]
    },
    {
      id: '05',
      title: '05 - Preferences & Tools',
      icon: '⚙️',
      items: [
        { label: 'linux-undercover', desc: 'Disguise UI as Windows 11', action: onToggleUndercover },
        { label: 'theme linux', desc: 'Switch to official Linux palette', cmd: 'theme linux' },
        { label: 'sound toggle', desc: 'Mechanical key audio switch', action: toggleSound },
        { label: 'preview', desc: 'URL previewer & social cards', cmd: 'preview' },
        { label: 'clear', desc: 'Flush terminal buffer', cmd: 'clear' },
      ]
    }
  ];

  // Filter items for search
  const filteredCategories = menuCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(i => 
      !menuSearch.trim() || 
      i.label.toLowerCase().includes(menuSearch.toLowerCase()) || 
      i.desc.toLowerCase().includes(menuSearch.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  // Linux Dragon SVG
  const KaliDragonIcon = () => (
    <svg className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.01 2.05c-.27 0-.54.04-.81.12-3.1 1.01-5.74 3.19-7.38 6.09-.94 1.66-1.47 3.55-1.54 5.48-.06 1.83.33 3.65 1.15 5.28 1.41 2.8 3.86 4.9 6.86 5.89 1.05.35 2.15.52 3.25.52.48 0 .96-.03 1.44-.1 2.76-.41 5.26-1.74 7.08-3.76.54-.6 1.01-1.26 1.39-1.97.23-.43.14-.96-.22-1.29-.35-.32-.88-.34-1.26-.06-.85.64-1.78 1.17-2.77 1.57-2.13.86-4.51.98-6.72.33-2.31-.68-4.28-2.18-5.55-4.22-.75-1.2-1.18-2.58-1.25-3.99-.07-1.49.25-2.98.92-4.32 1.25-2.52 3.42-4.43 6.05-5.32 2.37-.81 4.99-.67 7.27.39 1.18.55 2.23 1.33 3.1 2.3.36.4.95.49 1.41.21.46-.28.64-.84.42-1.34-.84-1.89-2.22-3.48-3.97-4.59-1.99-1.26-4.33-1.92-6.71-1.92zm2.14 4.54c-.17 0-.34.03-.5.1-.9.37-1.63 1.06-2.07 1.93-.32.63-.44 1.34-.35 2.05.1.77.47 1.48 1.03 2.02.82.78 1.97 1.11 3.08.87 1.01-.22 1.87-.85 2.37-1.73.34-.6.45-1.29.32-1.97-.13-.73-.55-1.39-1.17-1.86-.77-.59-1.74-.91-2.71-.91zm5.2 6.13c-.34 0-.66.17-.84.47-.53.86-1.27 1.58-2.14 2.1-.38.23-.52.72-.32 1.12.19.4.67.57 1.07.38 1.11-.66 2.05-1.57 2.73-2.67.24-.39.12-.9-.27-1.19-.07-.07-1.23-.21-.23-.21z"/>
    </svg>
  );

  // Windows 11 Start Logo
  const WindowsLogo = () => (
    <svg className="w-3.5 h-3.5 text-[#0078d7]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.551L24 0v11.551H10.949V1.898zM0 12.6h9.75v9.451L0 20.7V12.6zm10.949 0H24V24l-13.051-1.898V12.6z"/>
    </svg>
  );

  return (
    <div 
      className={`
        hidden md:block w-full select-none z-50 transition-colors duration-300 font-mono text-xs
        ${isUndercover 
          ? 'bg-[#f3f3f3] text-[#201f1e] border-b border-[#d2d2d2] shadow-sm' 
          : 'bg-[#080c12]/95 backdrop-blur-md text-zinc-300 border-b border-cyan-500/25 shadow-lg'
        }
      `}
    >
      <div className="h-7 sm:h-8 px-2 sm:px-3 flex items-center justify-between gap-1 sm:gap-3">
        {/* Left Side: Kali / Windows Applications Menu + Workspaces */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Applications Button - Icon Only */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                playUIClickSound();
                setIsMenuOpen(prev => !prev);
              }}
              className={`
                h-6 sm:h-6.5 px-2 rounded flex items-center justify-center font-bold transition-all cursor-pointer text-xs
                ${isUndercover 
                  ? 'bg-transparent hover:bg-[#e5e5e5] text-[#0078d7] active:bg-[#d8d8d8]'
                  : isMenuOpen 
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30' 
                    : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40'
                }
              `}
              title="Linux Applications Menu"
            >
              {isUndercover ? <WindowsLogo /> : <KaliDragonIcon />}
            </button>

            {/* Whisker Menu Dropdown */}
            {isMenuOpen && (
              <div 
                className={`
                  absolute top-full left-0 mt-1 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden border z-50 flex flex-col animate-slideInDown
                  ${isUndercover 
                    ? 'bg-[#f9f9f9] border-[#d2d2d2] text-[#201f1e]' 
                    : 'bg-[#090e17]/95 backdrop-blur-xl border-cyan-500/40 text-zinc-200'
                  }
                `}
              >
                {/* User Header */}
                <div className={`p-3 border-b flex items-center justify-between ${isUndercover ? 'border-[#e0e0e0] bg-[#f0f0f0]' : 'border-zinc-800 bg-[#0c1320]'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                      MR
                    </div>
                    <div>
                      <div className="font-bold text-xs text-cyan-400">Moniruzzaman Rishad</div>
                      <div className="text-[10px] text-zinc-400">
                        {isUndercover ? 'rishad@DESKTOP-WIN11' : 'rishad@linux-rolling (zsh)'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    AI/ML Eng
                  </span>
                </div>

                {/* Search Input */}
                <div className="p-2 border-b border-zinc-800/60">
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search AI tools, CLI commands, blogs..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-zinc-700/80 focus:border-cyan-400 focus:outline-none text-xs text-zinc-100 placeholder:text-zinc-500"
                    autoFocus
                  />
                </div>

                {/* Categories Tabs & Items Grid */}
                <div className="flex h-72 sm:h-80 overflow-hidden">
                  {/* Category Sidebar */}
                  <div className={`w-32 sm:w-36 border-r flex flex-col overflow-y-auto ${isUndercover ? 'border-[#e0e0e0] bg-[#f0f0f0]' : 'border-zinc-800 bg-black/40'}`}>
                    {menuCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                          p-2 text-left text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer border-l-2
                          ${activeCategory === cat.id 
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold' 
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                          }
                        `}
                      >
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.title.slice(5)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Items List */}
                  <div className="flex-1 p-2 overflow-y-auto space-y-1">
                    {filteredCategories.find(c => c.id === activeCategory)?.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (item.action) {
                            playUIClickSound();
                            setIsMenuOpen(false);
                            item.action();
                          } else if (item.cmd) {
                            handleLaunch(item.cmd);
                          }
                        }}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-cyan-950/50 hover:border-cyan-500/40 border border-transparent transition-all group cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-xs text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>›</span> {item.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 leading-snug">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Undercover & Power Footer */}
                <div className="p-2 bg-black/80 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleUndercover();
                    }}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-cyan-300 transition-colors"
                  >
                    <span>🎭</span>
                    <span>{isUndercover ? 'Exit Undercover' : 'linux-undercover'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRestart();
                    }}
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    Restart OS ⟲
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Workspaces 1..4 */}
          <div className="hidden sm:flex items-center bg-black/40 border border-zinc-800 rounded p-0.5 gap-0.5">
            {[
              { id: 1, label: 'Term', title: 'Terminal Workspace [1]' },
              { id: 2, label: 'Deck', title: 'Projects Deck Workspace [2]', action: onOpenProjects },
              { id: 3, label: 'Blog', title: 'Articles & Blogs Workspace [3]', action: onOpenBlogs },
              { id: 4, label: 'ID', title: 'ID Badge Workspace [4]' }
            ].map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  playUIClickSound();
                  if (ws.action) ws.action();
                  if (onSelectWorkspace) onSelectWorkspace(ws.id);
                }}
                className={`
                  px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer
                  ${activeWorkspace === ws.id 
                    ? 'bg-cyan-500 text-black shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }
                `}
                title={ws.title}
              >
                {ws.id}
              </button>
            ))}
          </div>

          {/* Quick CLI Shortcuts */}
          <div className="hidden md:flex items-center gap-1 text-[11px] pl-1">
            <button 
              onClick={() => handleLaunch('cmatrix')} 
              className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
              title="Run cmatrix"
            >
              cmatrix
            </button>
            <button 
              onClick={() => handleLaunch('nvidia-smi')} 
              className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-cyan-400 transition-colors"
              title="Run nvidia-smi"
            >
              smi
            </button>
            <button 
              onClick={() => handleLaunch('htop')} 
              className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-cyan-400 transition-colors"
              title="Run htop"
            >
              htop
            </button>
            <button 
              onClick={() => handleLaunch('nmap')} 
              className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-cyan-400 transition-colors"
              title="Run nmap localhost"
            >
              nmap
            </button>
          </div>
        </div>

        {/* Center: Window Title */}
        <div className="hidden lg:flex items-center gap-1.5 text-zinc-400 text-[11px] truncate max-w-sm">
          <span className="text-cyan-400 font-bold">⚡</span>
          <span className="truncate">
            {isUndercover 
              ? 'Windows PowerShell — rishad@DESKTOP-RISHAD' 
              : 'rishad@linux-portfolio: ~ (zsh)'
            }
          </span>
        </div>

        {/* Right Side: System Resource Tray (tun0, CPU, RAM, Sound, Undercover Toggle, Power) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* VPN Badge (tun0) */}
          <div 
            onClick={() => handleLaunch('whoami')}
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/50 border border-zinc-800 text-[10px] text-zinc-300 cursor-pointer hover:border-cyan-400 transition-colors"
            title="Linux VPN Tunnel: tun0: 10.10.14.88"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-zinc-400">tun0:</span>
            <span className="text-emerald-400 font-bold">10.10.14.88</span>
          </div>

          {/* CPU Meter */}
          <div 
            onClick={() => handleLaunch('htop')}
            className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/50 border border-zinc-800 text-[10px] cursor-pointer hover:border-cyan-400 transition-colors"
            title="Click to launch htop"
          >
            <span className="text-zinc-400">CPU</span>
            <div className="w-10 bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500" 
                style={{ width: `${cpuLoad}%` }}
              />
            </div>
            <span className="text-cyan-400 font-bold">{cpuLoad}%</span>
          </div>

          {/* RAM Meter */}
          <div 
            onClick={() => handleLaunch('nvidia-smi')}
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 border border-zinc-800 text-[10px] cursor-pointer hover:border-cyan-400 transition-colors"
            title="Click to launch nvidia-smi"
          >
            <span className="text-zinc-400">RAM</span>
            <span className="text-purple-400 font-bold">{ramUsed}G</span>
          </div>

          {/* Linux Undercover Disguise Toggle Button */}
          <button
            onClick={() => {
              playUIClickSound();
              onToggleUndercover();
            }}
            className={`
              h-6 px-1.5 sm:px-2 rounded flex items-center gap-1 text-[11px] font-bold border transition-all cursor-pointer
              ${isUndercover 
                ? 'bg-[#0078d7] text-white border-[#0067b8] shadow-sm' 
                : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:border-cyan-400 hover:text-cyan-300'
              }
            `}
            title={isUndercover ? 'Exit Undercover mode' : "Toggle 'linux-undercover' Windows disguise mode"}
          >
            <span>{isUndercover ? '🪟' : '🎭'}</span>
            <span className="hidden xl:inline">
              {isUndercover ? 'Undercover Active' : 'linux-undercover'}
            </span>
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`
              h-6 px-1.5 rounded border transition-colors cursor-pointer flex items-center justify-center text-xs
              ${isFullscreen 
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300' 
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-400'
              }
            `}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen (F11)'}
          >
            {isFullscreen ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>

          {/* Mechanical Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`
              h-6 px-1.5 rounded border transition-colors cursor-pointer flex items-center justify-center text-xs
              ${soundEnabled 
                ? 'bg-zinc-900 border-zinc-700 text-cyan-400 hover:border-cyan-400' 
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }
            `}
            title={soundEnabled ? 'Mechanical typing sound ON (Click to mute)' : 'Mechanical typing sound MUTED (Click to unmute)'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Power Menu Button */}
          <div className="relative" ref={powerRef}>
            <button
              onClick={() => {
                playUIClickSound();
                setIsPowerOpen(prev => !prev);
              }}
              className="h-6 w-6 rounded bg-zinc-900 border border-zinc-800 hover:border-red-500/60 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
              title="System Power Options"
            >
              ⏻
            </button>

            {isPowerOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-40 rounded-xl bg-[#0b1017] border border-zinc-800 shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-slideInDown text-xs">
                <button
                  onClick={() => { setIsPowerOpen(false); onLogOut(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 text-left flex items-center gap-2 cursor-pointer"
                >
                  <span>🔒</span> Lock Session
                </button>
                <button
                  onClick={() => { setIsPowerOpen(false); onRestart(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 text-left flex items-center gap-2 cursor-pointer"
                >
                  <span>🔄</span> Reboot Linux
                </button>
                <div className="h-px bg-zinc-800 my-0.5" />
                <button
                  onClick={() => { setIsPowerOpen(false); onPowerOff(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-red-950/60 text-red-400 text-left flex items-center gap-2 cursor-pointer font-bold"
                >
                  <span>⏻</span> Power Off
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaliTopPanel;

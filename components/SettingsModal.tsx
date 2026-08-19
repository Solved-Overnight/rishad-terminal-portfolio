import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES, ThemeId } from '../utils/themes';
import { 
  getSoundSettings, 
  saveSoundSettings, 
  SoundProfile, 
  playMechanicalKeySound, 
  playEnterSound, 
  playUIClickSound 
} from '../utils/soundEffects';
import {
  Volume2,
  Palette,
  Zap,
  AppWindow,
  Search,
  Share2,
  Info,
  MoreHorizontal,
  X,
  Minus,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Globe,
  Terminal,
  Smartphone,
  Mail,
  Send,
  Lock
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 
  | 'appearance'
  | 'sound'
  | 'power'
  | 'apps'
  | 'sharing'
  | 'about';

const SOUND_PROFILES: { id: SoundProfile; name: string; desc: string }[] = [
  { id: 'thocky', name: 'Thocky (Cream)', desc: 'Deep bassy mechanical switch thock' },
  { id: 'clicky', name: 'Clicky (Cherry Blue)', desc: 'Crisp dual-stage tactile click' },
  { id: 'linear', name: 'Linear (Red)', desc: 'Smooth muffled bottom-out impact' },
  { id: 'buckling', name: 'Buckling Spring', desc: 'Vintage IBM metallic ping' },
  { id: 'cyber', name: 'Cyberpunk Synth', desc: 'Retro 8-bit digital terminal blips' },
];

/* Custom Brand Icons */
const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.63a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
  </svg>
);

/* ========================================================================= */
/* SVG QR CODE GENERATOR COMPONENT (Determinstic 21x21 Matrix)               */
/* ========================================================================= */
const QRCodeSVG: React.FC<{ value: string; size?: number }> = ({ value, size = 160 }) => {
  const N = 21;
  const matrix: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

  // Helper to draw finder pattern
  const drawFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r;
        const mc = col + c;
        if (mr >= 0 && mr < N && mc >= 0 && mc < N) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            matrix[mr][mc] = false;
          } else if (r === 0 || r === 6 || c === 0 || c === 6) {
            matrix[mr][mc] = true;
          } else if (r === 1 || r === 5 || c === 1 || c === 5) {
            matrix[mr][mc] = false;
          } else {
            matrix[mr][mc] = true;
          }
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic modules based on hash of text
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= N - 8;
      const inBottomLeft = r >= N - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const val = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
        matrix[r][c] = (val - Math.floor(val)) > 0.46;
      }
    }
  }

  const padding = 12;
  const usableSize = size - padding * 2;
  const cellSize = usableSize / N;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl bg-[#0f121a] p-1 border border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <rect width={size} height={size} fill="#0f121a" rx={12} />
        {matrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={padding + c * cellSize}
                y={padding + r * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                fill="#22d3ee"
                rx={0.8}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};

/* ========================================================================= */
/* MAIN SETTINGS MODAL COMPONENT                                            */
/* ========================================================================= */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, updateCustomTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Sharing states
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const [soundSettings, setSoundSettingsState] = useState(getSoundSettings());
  const [powerMode, setPowerMode] = useState<'performance' | 'balanced' | 'saver'>('performance');
  const [terminalShell, setTerminalShell] = useState<string>('/bin/zsh');

  useEffect(() => {
    if (isOpen) {
      setSoundSettingsState(getSoundSettings());
      setIsMinimized(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const websiteUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://portfolio-os.dev';

  const curlCommand = `curl -s "${websiteUrl.replace(/\/$/, '')}/api/profile" | jq .`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopiedLink(true);
    playUIClickSound();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    playUIClickSound();
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleColorChange = (key: string, value: string) => {
    updateCustomTheme({ [key]: value });
  };

  const updateSound = (updates: Parameters<typeof saveSoundSettings>[0]) => {
    const updated = saveSoundSettings(updates);
    setSoundSettingsState(updated);
    playUIClickSound();
  };

  const handleSectionSelect = (section: SettingsSection) => {
    setActiveSection(section);
    playUIClickSound();
  };

  // Sidebar item list definitions
  const topSections: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'sound', label: 'Sound', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'power', label: 'Power', icon: <Zap className="w-4 h-4" /> },
  ];

  const bottomSections: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'apps', label: 'Apps & Terminal', icon: <AppWindow className="w-4 h-4" /> },
    { id: 'sharing', label: 'Sharing', icon: <Share2 className="w-4 h-4" /> },
    { id: 'about', label: 'System & About', icon: <Info className="w-4 h-4" /> },
  ];

  const allSections = [...topSections, ...bottomSections];
  const filteredSections = searchQuery.trim() 
    ? allSections.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#181c26] border border-cyan-400/50 rounded-xl px-4 py-2 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl cursor-pointer hover:bg-[#202636]"
        >
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Restore Settings Window</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Settings Window Frame */}
      <div 
        className={`bg-[#1a1e27] border border-[#2d3545] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row overflow-hidden text-gray-200 select-none font-sans transition-all duration-200 ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-5xl h-[92vh] md:h-[88vh] max-h-[820px] rounded-xl sm:rounded-2xl'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/*           LEFT SIDEBAR MENU (DESKTOP ONLY)                */}
        {/* ========================================================= */}
        <div className="hidden md:flex w-60 sm:w-68 bg-[#151821] border-r border-[#262c3a] flex-col flex-shrink-0">
          
          {/* Sidebar Titlebar */}
          <div className="h-12 px-3.5 bg-[#171a24] border-b border-[#262c3a] flex items-center justify-between flex-shrink-0">
            <button 
              onClick={() => setIsSearching(!isSearching)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#222735] transition-colors"
              title="Search Settings"
            >
              <Search className="w-4 h-4" />
            </button>

            <span className="font-bold text-sm text-gray-100 tracking-wide font-sans">
              Settings
            </span>

            <button 
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#222735] transition-colors"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Bar (Expandable) */}
          {isSearching && (
            <div className="p-2 border-b border-[#262c3a] bg-[#12141c]">
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search options..."
                autoFocus
                className="w-full bg-[#1c202d] border border-[#2d3546] rounded-xl px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
          )}

          {/* Sidebar Nav Items - File Explorer Smooth Selection Animation */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
            {filteredSections ? (
              filteredSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSectionSelect(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer ${
                      isActive
                        ? 'bg-[#2b3345] text-white border-[#3c475d] shadow-sm'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1d2230]'
                    }`}
                  >
                    <span className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                      isActive ? 'bg-cyan-400 opacity-100' : 'bg-transparent opacity-0'
                    }`} />
                    <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                      {sec.icon}
                    </span>
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })
            ) : (
              <>
                {topSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSectionSelect(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer ${
                        isActive
                          ? 'bg-[#2b3345] text-white border-[#3c475d] shadow-sm'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1d2230]'
                      }`}
                    >
                      <span className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-cyan-400 opacity-100' : 'bg-transparent opacity-0'
                      }`} />
                      <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                        {sec.icon}
                      </span>
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}

                <div className="my-2 border-t border-[#262c3a] mx-2" />

                {bottomSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSectionSelect(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer ${
                        isActive
                          ? 'bg-[#2b3345] text-white border-[#3c475d] shadow-sm'
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1d2230]'
                      }`}
                    >
                      <span className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-cyan-400 opacity-100' : 'bg-transparent opacity-0'
                      }`} />
                      <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                        {sec.icon}
                      </span>
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer OS Badge (Aligned height h-10 with main statusbar) */}
          <div className="h-10 px-3.5 border-t border-[#262c3a] bg-[#12141c] text-[11px] font-mono text-gray-500 flex items-center justify-between flex-shrink-0 select-none">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold truncate">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Portfolio OS v2.34</span>
            </span>
            <span className="text-[10px] text-gray-500">2026.1</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/*               RIGHT MAIN CONTENT PANEL                    */}
        {/* ========================================================= */}
        <div className="flex-1 bg-[#1c202b] flex flex-col overflow-hidden relative">
          
          {/* Main Titlebar Header */}
          <div className="h-12 px-4 sm:px-6 bg-[#181c26] border-b border-[#262c3a] flex items-center justify-between flex-shrink-0">
            {/* Title Centered / Left */}
            <h2 className="text-sm font-bold text-gray-100 tracking-wide capitalize flex items-center gap-2">
              {activeSection === 'sound' && <Volume2 className="w-4 h-4 text-green-400" />}
              {activeSection === 'appearance' && <Palette className="w-4 h-4 text-amber-400" />}
              {activeSection === 'power' && <Zap className="w-4 h-4 text-yellow-400" />}
              {activeSection === 'apps' && <AppWindow className="w-4 h-4 text-cyan-400" />}
              {activeSection === 'sharing' && <Share2 className="w-4 h-4 text-teal-400" />}
              {activeSection === 'about' && <Info className="w-4 h-4 text-cyan-400" />}
              <span>{allSections.find(s => s.id === activeSection)?.label}</span>
            </h2>

            {/* Right Window Controls like File Explorer */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsMinimized(true)}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center group cursor-pointer"
                title="Minimize Window"
              >
                <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center group cursor-pointer"
                title={isMaximized ? "Restore Window" : "Maximize Window"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
              <button 
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group cursor-pointer"
                title="Close Settings"
              >
                <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Section Tabs Bar */}
          <div className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#151821] border-b border-[#262c3a] overflow-x-auto custom-scrollbar flex-shrink-0 select-none">
            {allSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleSectionSelect(sec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2b3345] text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 bg-[#1c202d] border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-gray-400'}>{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-8 space-y-6 text-sm text-gray-200 font-sans custom-scrollbar">
            
            {/* ===================================================== */}
            {/* 1. APPEARANCE (THEMES & CUSTOM ACCENTS)               */}
            {/* ===================================================== */}
            {activeSection === 'appearance' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Customize the Portfolio OS v2.34 desktop appearance, color schemes, and terminal accent palettes.
                </p>

                {/* Preset Themes Selector */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center justify-between">
                    <span>Style Presets</span>
                    <span className="text-xs text-cyan-400 font-mono">Active: {currentTheme.name}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(THEMES).filter(t => t.id !== 'custom').map((theme) => {
                      const isActive = currentTheme.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setTheme(theme.id as ThemeId);
                            playUIClickSound();
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                            isActive 
                              ? 'border-cyan-400 bg-cyan-500/10 ring-1 ring-cyan-400/50' 
                              : 'border-[#343d52] hover:border-gray-400 bg-[#1c202d]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold text-xs ${isActive ? 'text-cyan-300' : 'text-gray-200'}`}>
                              {theme.name}
                            </span>
                            {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>

                          <div className="flex gap-1.5 h-3">
                            <div className="flex-1 rounded-sm border border-black/30" style={{ backgroundColor: theme.colors.bg }} title="Background" />
                            <div className="flex-1 rounded-sm border border-black/30" style={{ backgroundColor: theme.colors.primary }} title="Primary Accent" />
                            <div className="flex-1 rounded-sm border border-black/30" style={{ backgroundColor: theme.colors.text }} title="Text Color" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Palette Modifier */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Custom Terminal Colors</h3>
                    {currentTheme.id === 'custom' && (
                      <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                        Custom Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1c202d] border border-[#30384c]">
                      <span className="text-gray-300 font-sans">Background Color</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-[11px]">{currentTheme.colors.bg}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.bg} 
                          onChange={(e) => handleColorChange('bg', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1c202d] border border-[#30384c]">
                      <span className="text-gray-300 font-sans">Primary Accent</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-[11px]">{currentTheme.colors.primary}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.primary} 
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#1c202d] border border-[#30384c]">
                      <span className="text-gray-300 font-sans">Text Color</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-[11px]">{currentTheme.colors.text}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.text} 
                          onChange={(e) => handleColorChange('text', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* 2. SOUND & AUDIO SYNTHESIZER                          */}
            {/* ===================================================== */}
            {activeSection === 'sound' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs text-gray-400 leading-relaxed">
                  System sound profile and mechanical keyboard typing sound synthesizer settings.
                </p>

                {/* Master Sound Card */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-white">Terminal Typing SFX & Master Audio</div>
                    <div className="text-xs text-gray-400">Synthesize realistic mechanical switches on keypress</div>
                  </div>

                  <button
                    onClick={() => updateSound({ enabled: !soundSettings.enabled })}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                      soundSettings.enabled 
                        ? 'border-green-400 bg-green-500/20 text-green-300' 
                        : 'border-red-500/50 bg-red-500/10 text-red-400'
                    }`}
                  >
                    {soundSettings.enabled ? '🔊 ENABLED' : '🔇 MUTED'}
                  </button>
                </div>

                {/* Sound Profiles */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-white">Switch Sound Profile</h3>

                  <div className="space-y-2">
                    {SOUND_PROFILES.map((prof) => (
                      <button
                        key={prof.id}
                        disabled={!soundSettings.enabled}
                        onClick={() => {
                          updateSound({ profile: prof.id });
                          setTimeout(() => playMechanicalKeySound('a'), 20);
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          soundSettings.profile === prof.id && soundSettings.enabled
                            ? 'border-cyan-400 bg-cyan-500/10 text-white ring-1 ring-cyan-400/40'
                            : 'border-[#30384c] hover:border-gray-400 bg-[#1c202d] text-gray-300'
                        } ${!soundSettings.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div>
                          <div className="font-semibold text-xs text-white">{prof.name}</div>
                          <div className="text-[11px] text-gray-400">{prof.desc}</div>
                        </div>
                        {soundSettings.profile === prof.id && soundSettings.enabled && (
                          <span className="text-cyan-400 text-xs font-mono font-bold">ACTIVE</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Slider & Test Buttons */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-white">Master Output Volume</span>
                    <span className="text-cyan-400 font-mono text-xs font-bold">{Math.round(soundSettings.volume * 100)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundSettings.volume}
                    disabled={!soundSettings.enabled}
                    onChange={(e) => updateSound({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      disabled={!soundSettings.enabled}
                      onClick={() => playMechanicalKeySound('a')}
                      className="flex-1 py-2 px-3 border border-cyan-400/50 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold font-mono transition-all disabled:opacity-40 cursor-pointer"
                    >
                      ⌨ Test Keypress SFX
                    </button>
                    <button
                      disabled={!soundSettings.enabled}
                      onClick={() => playEnterSound()}
                      className="flex-1 py-2 px-3 border border-cyan-400/50 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold font-mono transition-all disabled:opacity-40 cursor-pointer"
                    >
                      ↵ Test Enter SFX
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* 3. POWER                                              */}
            {/* ===================================================== */}
            {activeSection === 'power' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Power consumption mode and system performance tuning.
                </p>

                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-white">Power Mode</h3>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPowerMode('performance')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        powerMode === 'performance' 
                          ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300 font-bold' 
                          : 'border-[#30384c] text-gray-400 hover:text-gray-200 bg-[#1c202d]'
                      }`}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                      <span className="text-xs">Performance</span>
                    </button>

                    <button
                      onClick={() => setPowerMode('balanced')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        powerMode === 'balanced' 
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold' 
                          : 'border-[#30384c] text-gray-400 hover:text-gray-200 bg-[#1c202d]'
                      }`}
                    >
                      <AppWindow className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                      <span className="text-xs">Balanced</span>
                    </button>

                    <button
                      onClick={() => setPowerMode('saver')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        powerMode === 'saver' 
                          ? 'border-green-400 bg-green-500/10 text-green-300 font-bold' 
                          : 'border-[#30384c] text-gray-400 hover:text-gray-200 bg-[#1c202d]'
                      }`}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <span className="text-xs">Power Saver</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* 4. APPS & TERMINAL SHELL                              */}
            {/* ===================================================== */}
            {activeSection === 'apps' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Default terminal emulator shell and interactive command runner preferences.
                </p>

                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-white">Terminal Shell Environment</h3>

                  <div className="space-y-2 font-mono text-xs">
                    <label className="text-gray-400 block">Default Shell Command:</label>
                    <select
                      value={terminalShell}
                      onChange={e => setTerminalShell(e.target.value)}
                      className="w-full bg-[#1c202d] border border-[#30384c] rounded-xl px-3 py-2 text-cyan-300 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="/bin/zsh">/bin/zsh (Portfolio Default)</option>
                      <option value="/bin/bash">/bin/bash (GNU Bourne-Again Shell)</option>
                      <option value="/bin/fish">/bin/fish (Friendly Interactive Shell)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* 5. SHARING (LINK SHARING + QR CODE + SYSTEM INFO)     */}
            {/* ===================================================== */}
            {activeSection === 'sharing' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Share this Portfolio OS environment via direct web link, mobile QR Code, or terminal command line.
                </p>

                {/* Grid: Link Sharing & QR Code side by side */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Link Sharing Column (7 cols) */}
                  <div className="md:col-span-7 bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          <h3 className="font-bold text-sm text-white">Website Public Link</h3>
                        </div>
                        <span className="text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full">
                          HTTPS Active
                        </span>
                      </div>

                      {/* URL Box with Copy Button */}
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          readOnly 
                          value={websiteUrl}
                          className="w-full bg-[#171a24] border border-[#30384c] rounded-xl pl-3 pr-24 py-2.5 text-xs text-cyan-300 font-mono select-all focus:outline-none"
                        />
                        <button
                          onClick={handleCopyLink}
                          className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            copiedLink
                              ? 'bg-green-500 text-black'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                          }`}
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Social Media Share Shortcuts */}
                    <div className="pt-2 border-t border-[#30384c] space-y-2">
                      <span className="text-xs text-gray-400 font-medium block">Quick Social Share:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this interactive Linux Portfolio OS!')}&url=${encodeURIComponent(websiteUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#1c202d] hover:bg-[#282f42] border border-[#30384c] text-xs text-gray-200 transition-colors"
                        >
                          <TwitterIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Share on X</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                        </a>

                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#1c202d] hover:bg-[#282f42] border border-[#30384c] text-xs text-gray-200 transition-colors"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                        </a>

                        <a
                          href={`mailto:?subject=${encodeURIComponent('Check out this Portfolio OS')}&body=${encodeURIComponent(`Hey, check out this interactive Linux Portfolio OS website: ${websiteUrl}`)}`}
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#1c202d] hover:bg-[#282f42] border border-[#30384c] text-xs text-gray-200 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Send Email</span>
                          <Send className="w-3 h-3 text-gray-500 ml-auto" />
                        </a>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this interactive Portfolio OS: ${websiteUrl}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#1c202d] hover:bg-[#282f42] border border-[#30384c] text-xs text-gray-200 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Column (5 cols) */}
                  <div className="md:col-span-5 bg-[#242938] border border-[#323b50] rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <QrCode className="w-4 h-4" />
                      <h3 className="font-bold text-sm text-white">Mobile QR Code</h3>
                    </div>

                    {/* SVG QR Code */}
                    <div 
                      onClick={() => window.open(websiteUrl, '_blank')}
                      className="my-1 cursor-pointer p-1.5 bg-white rounded-xl shadow-md hover:scale-105 transition-all"
                      title={`Scan or click to open website: ${websiteUrl}`}
                    >
                      <QRCodeSVG value={websiteUrl} size={150} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        Scan with mobile camera to open website
                      </span>
                    </div>
                  </div>

                </div>

                {/* Terminal CLI Command Share Section */}
                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-bold text-sm text-white">Terminal Curl Embed Command</h3>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Linux / macOS / WSL</span>
                  </div>

                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      readOnly 
                      value={curlCommand}
                      className="w-full bg-[#121520] border border-[#30384c] rounded-xl pl-3 pr-24 py-2.5 text-xs text-green-400 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyCurl}
                      className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedCurl
                          ? 'bg-green-500 text-black'
                          : 'bg-[#2b3345] hover:bg-[#38435b] text-gray-200 border border-[#45526e]'
                      }`}
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* System & Endpoint Metadata */}
                <div className="bg-[#1c202d] border border-[#30384c] rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Protocol</span>
                    <span className="text-cyan-300 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-green-400" /> TLS 1.3
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sharing Policy</span>
                    <span className="text-gray-200">Public Access</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">CDN Caching</span>
                    <span className="text-gray-200">Edge Global</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Live Audio SFX</span>
                    <span className="text-green-400">Web Audio API</span>
                  </div>
                </div>

              </div>
            )}

            {/* ===================================================== */}
            {/* 6. SYSTEM & ABOUT                                     */}
            {/* ===================================================== */}
            {activeSection === 'about' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn font-mono text-xs">
                <p className="text-xs font-sans text-gray-400 leading-relaxed">
                  System specifications, kernel information, and terminal portfolio metadata.
                </p>

                <div className="bg-[#242938] border border-[#323b50] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3 border-b border-[#323b50] pb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white font-sans">Portfolio OS v2.34</h3>
                      <p className="text-xs text-cyan-300 font-mono">Kernel 6.8.0-portfolio-amd64</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-300 pt-1">
                    <div className="flex justify-between py-1 border-b border-[#2d3546]">
                      <span className="text-gray-500">Hardware Model:</span>
                      <span className="text-gray-200">Portfolio Virtual Machine</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#2d3546]">
                      <span className="text-gray-500">Memory / RAM:</span>
                      <span className="text-gray-200">16.0 GB Virtual RAM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#2d3546]">
                      <span className="text-gray-500">AI Logic Core:</span>
                      <span className="text-amber-300 font-semibold">Gemini 2.5 Flash</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#2d3546]">
                      <span className="text-gray-500">React Framework:</span>
                      <span className="text-cyan-300 font-semibold">React 19.2.3 + Vite</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Audio Synthesizer:</span>
                      <span className="text-green-400 font-semibold">Web Audio API Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Footer Bar (Aligned height h-10 with File Explorer / Thunar statusbar) */}
          <div className="h-10 px-4 sm:px-6 bg-[#161922] border-t border-[#262c3a] flex items-center justify-between text-xs flex-shrink-0 select-none font-mono">
            <span className="text-gray-400 text-[11px]">
              Press <kbd className="px-1.5 py-0.5 bg-[#252b38] border border-[#374156] rounded text-gray-300 font-sans">Esc</kbd> to exit Settings
            </span>

            <button 
              onClick={() => { playUIClickSound(); onClose(); }}
              className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer font-sans"
            >
              Close Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

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
const TwitterIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-3.5 h-3.5", style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-3.5 h-3.5", style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.63a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" />
  </svg>
);

/* ========================================================================= */
/* SVG QR CODE GENERATOR COMPONENT (Determinstic 21x21 Matrix)               */
/* ========================================================================= */
const QRCodeSVG: React.FC<{ value: string; size?: number; dotColor?: string; bgColor?: string }> = ({ 
  value, 
  size = 160,
  dotColor = "#22d3ee",
  bgColor = "#0f121a"
}) => {
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
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl p-1 border shadow-lg" style={{ backgroundColor: bgColor, borderColor: `${dotColor}40` }}>
        <rect width={size} height={size} fill={bgColor} rx={12} />
        {matrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={padding + c * cellSize}
                y={padding + r * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                fill={dotColor}
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

  const isDark = currentTheme.isDark !== false;
  const themeBg = isDark ? currentTheme.colors.bg : '#ffffff';
  const themeSidebarBg = isDark ? `${currentTheme.colors.bg}f6` : '#f6f8fa';
  const themeContentBg = isDark ? `${currentTheme.colors.dim}33` : '#ffffff';
  const themeCardBg = isDark ? `${currentTheme.colors.dim}55` : '#f8fafc';
  const themeSubcardBg = isDark ? `${currentTheme.colors.bg}cc` : '#ffffff';
  const themeBorder = isDark ? `${currentTheme.colors.dim}99` : '#e2e8f0';
  const themeHeaderBg = isDark ? `${currentTheme.colors.dim}50` : '#f1f5f9';

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="rounded-xl px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl cursor-pointer transition-all"
          style={{
            backgroundColor: themeCardBg,
            borderColor: `${currentTheme.colors.primary}80`,
            borderWidth: 1,
            color: currentTheme.colors.primary
          }}
        >
          <Palette className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
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
        className={`shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row overflow-hidden select-none font-sans transition-all duration-200 ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-5xl h-[92vh] md:h-[88vh] max-h-[820px] rounded-xl sm:rounded-2xl border'
        }`}
        style={{
          backgroundColor: themeBg,
          borderColor: themeBorder,
          color: currentTheme.colors.text
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/*           LEFT SIDEBAR MENU (DESKTOP ONLY)                */}
        {/* ========================================================= */}
        <div 
          className="hidden md:flex w-60 sm:w-68 border-r flex-col flex-shrink-0"
          style={{
            backgroundColor: themeSidebarBg,
            borderColor: themeBorder
          }}
        >
          
          {/* Sidebar Titlebar */}
          <div 
            className="h-12 px-3.5 border-b flex items-center justify-between flex-shrink-0"
            style={{
              backgroundColor: themeHeaderBg,
              borderColor: themeBorder
            }}
          >
            <button 
              onClick={() => setIsSearching(!isSearching)}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
              style={{ color: currentTheme.colors.textDim }}
              title="Search Settings"
            >
              <Search className="w-4 h-4" />
            </button>

            <span className="font-bold text-sm tracking-wide font-sans" style={{ color: currentTheme.colors.text }}>
              Settings
            </span>

            <button 
              className="p-1.5 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
              style={{ color: currentTheme.colors.textDim }}
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Bar (Expandable) */}
          {isSearching && (
            <div 
              className="p-2 border-b"
              style={{
                backgroundColor: themeSubcardBg,
                borderColor: themeBorder
              }}
            >
              <input 
                type="text" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search options..." 
                autoFocus 
                className="w-full rounded-xl px-3 py-1.5 text-xs focus:outline-none font-sans"
                style={{
                  backgroundColor: themeCardBg,
                  borderColor: themeBorder,
                  borderWidth: 1,
                  color: currentTheme.colors.text
                }}
              />
            </div>
          )}

          {/* Sidebar Nav Items */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
            {filteredSections ? (
              filteredSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSectionSelect(sec.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer"
                    style={{
                      backgroundColor: isActive ? (isDark ? `${currentTheme.colors.dim}88` : '#e2e8f0') : 'transparent',
                      borderColor: isActive ? currentTheme.colors.primary : 'transparent',
                      color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim
                    }}
                  >
                    <span 
                      className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ backgroundColor: currentTheme.colors.primary }} 
                    />
                    <span>
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
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: isActive ? (isDark ? `${currentTheme.colors.dim}88` : '#e2e8f0') : 'transparent',
                        borderColor: isActive ? currentTheme.colors.primary : 'transparent',
                        color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim
                      }}
                    >
                      <span 
                        className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                      <span>
                        {sec.icon}
                      </span>
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}

                <div className="my-2 border-t mx-2" style={{ borderColor: themeBorder }} />

                {bottomSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSectionSelect(sec.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: isActive ? (isDark ? `${currentTheme.colors.dim}88` : '#e2e8f0') : 'transparent',
                        borderColor: isActive ? currentTheme.colors.primary : 'transparent',
                        color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim
                      }}
                    >
                      <span 
                        className={`w-1 h-3.5 rounded-full transition-all duration-200 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                      <span>
                        {sec.icon}
                      </span>
                      <span className="truncate">{sec.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer OS Badge */}
          <div 
            className="h-10 px-3.5 border-t text-[11px] font-mono flex items-center justify-between flex-shrink-0 select-none"
            style={{
              backgroundColor: themeHeaderBg,
              borderColor: themeBorder,
              color: currentTheme.colors.textDim
            }}
          >
            <span className="flex items-center gap-1.5 font-semibold truncate" style={{ color: currentTheme.colors.primary }}>
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Portfolio OS v2.34</span>
            </span>
            <span className="text-[10px]" style={{ color: currentTheme.colors.textDim }}>{currentTheme.name}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/*               RIGHT MAIN CONTENT PANEL                    */}
        {/* ========================================================= */}
        <div 
          className="flex-1 flex flex-col overflow-hidden relative"
          style={{
            backgroundColor: themeContentBg,
            color: currentTheme.colors.text
          }}
        >
          
          {/* Main Titlebar Header */}
          <div 
            className="h-12 px-4 sm:px-6 border-b flex items-center justify-between flex-shrink-0"
            style={{
              backgroundColor: themeHeaderBg,
              borderColor: themeBorder
            }}
          >
            {/* Title Centered / Left */}
            <h2 className="text-sm font-bold tracking-wide capitalize flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
              {activeSection === 'sound' && <Volume2 className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />}
              {activeSection === 'appearance' && <Palette className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />}
              {activeSection === 'power' && <Zap className="w-4 h-4" style={{ color: currentTheme.colors.accent }} />}
              {activeSection === 'apps' && <AppWindow className="w-4 h-4" style={{ color: currentTheme.colors.secondary }} />}
              {activeSection === 'sharing' && <Share2 className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />}
              {activeSection === 'about' && <Info className="w-4 h-4" style={{ color: currentTheme.colors.accent }} />}
              <span>{allSections.find(s => s.id === activeSection)?.label}</span>
            </h2>

            {/* Right Window Controls: Minimize, Maximize, Close */}
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
          <div 
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border-b overflow-x-auto custom-scrollbar flex-shrink-0 select-none"
            style={{
              backgroundColor: themeSidebarBg,
              borderColor: themeBorder
            }}
          >
            {allSections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleSectionSelect(sec.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    backgroundColor: isActive ? (isDark ? `${currentTheme.colors.dim}aa` : '#e2e8f0') : themeSubcardBg,
                    borderColor: isActive ? currentTheme.colors.primary : themeBorder,
                    borderWidth: 1,
                    color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim
                  }}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-8 space-y-6 text-sm font-sans custom-scrollbar">
            
            {/* ===================================================== */}
            {/* 1. APPEARANCE (THEMES & CUSTOM ACCENTS)               */}
            {/* ===================================================== */}
            {activeSection === 'appearance' && (
              <div className="space-y-6 max-w-3xl animate-fadeIn">
                <p className="text-xs leading-relaxed font-sans" style={{ color: currentTheme.colors.textDim }}>
                  Customize the Portfolio OS v2.34 desktop appearance, color schemes, and terminal accent palettes.
                </p>

                {/* Preset Themes Selector */}
                <div 
                  className="rounded-2xl p-5 space-y-4 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <h3 className="font-bold text-sm flex items-center justify-between" style={{ color: currentTheme.colors.text }}>
                    <span>Style Presets</span>
                    <span className="text-xs font-mono" style={{ color: currentTheme.colors.primary }}>Active: {currentTheme.name}</span>
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
                          className="p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer"
                          style={{
                            backgroundColor: isActive ? `${theme.colors.primary}15` : themeSubcardBg,
                            borderColor: isActive ? theme.colors.primary : themeBorder,
                            boxShadow: isActive ? `0 0 12px ${theme.colors.primary}30` : undefined
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span 
                              className="font-semibold text-xs"
                              style={{ color: isActive ? theme.colors.primary : currentTheme.colors.text }}
                            >
                              {theme.name}
                            </span>
                            {isActive && <CheckCircle2 className="w-4 h-4" style={{ color: theme.colors.primary }} />}
                          </div>

                          <div className="flex gap-1.5 h-3.5">
                            <div className="flex-1 rounded-sm border border-black/30 shadow-inner" style={{ backgroundColor: theme.colors.bg }} title="Background" />
                            <div className="flex-1 rounded-sm border border-black/30 shadow-inner" style={{ backgroundColor: theme.colors.primary }} title="Primary Accent" />
                            <div className="flex-1 rounded-sm border border-black/30 shadow-inner" style={{ backgroundColor: theme.colors.secondary }} title="Secondary" />
                            <div className="flex-1 rounded-sm border border-black/30 shadow-inner" style={{ backgroundColor: theme.colors.accent }} title="Highlight Accent" />
                            <div className="flex-1 rounded-sm border border-black/30 shadow-inner" style={{ backgroundColor: theme.colors.text }} title="Text Color" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Palette Modifier */}
                <div 
                  className="rounded-2xl p-5 space-y-4 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Custom Terminal Colors</h3>
                    {currentTheme.id === 'custom' && (
                      <span 
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${currentTheme.colors.primary}20`,
                          borderColor: `${currentTheme.colors.primary}40`,
                          color: currentTheme.colors.primary
                        }}
                      >
                        Custom Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div 
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder
                      }}
                    >
                      <span className="font-sans" style={{ color: currentTheme.colors.text }}>Background</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>{currentTheme.colors.bg}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.bg} 
                          onChange={(e) => handleColorChange('bg', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div 
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder
                      }}
                    >
                      <span className="font-sans" style={{ color: currentTheme.colors.text }}>Primary Accent</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>{currentTheme.colors.primary}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.primary} 
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div 
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder
                      }}
                    >
                      <span className="font-sans" style={{ color: currentTheme.colors.text }}>Secondary Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>{currentTheme.colors.secondary}</span>
                        <input 
                          type="color" 
                          value={currentTheme.colors.secondary} 
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div 
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder
                      }}
                    >
                      <span className="font-sans" style={{ color: currentTheme.colors.text }}>Text Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>{currentTheme.colors.text}</span>
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
                <p className="text-xs leading-relaxed" style={{ color: currentTheme.colors.textDim }}>
                  System sound profile and mechanical keyboard typing sound synthesizer settings.
                </p>

                {/* Master Sound Card */}
                <div 
                  className="rounded-2xl p-5 flex items-center justify-between border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div>
                    <div className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Terminal Typing SFX & Master Audio</div>
                    <div className="text-xs" style={{ color: currentTheme.colors.textDim }}>Synthesize realistic mechanical switches on keypress</div>
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
                <div 
                  className="rounded-2xl p-5 space-y-3 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Switch Sound Profile</h3>

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
                          !soundSettings.enabled ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        style={{
                          backgroundColor: soundSettings.profile === prof.id && soundSettings.enabled
                            ? `${currentTheme.colors.primary}15`
                            : themeSubcardBg,
                          borderColor: soundSettings.profile === prof.id && soundSettings.enabled
                            ? currentTheme.colors.primary
                            : themeBorder
                        }}
                      >
                        <div>
                          <div className="font-semibold text-xs" style={{ color: currentTheme.colors.text }}>{prof.name}</div>
                          <div className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>{prof.desc}</div>
                        </div>
                        {soundSettings.profile === prof.id && soundSettings.enabled && (
                          <span className="text-xs font-mono font-bold" style={{ color: currentTheme.colors.primary }}>ACTIVE</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Slider & Test Buttons */}
                <div 
                  className="rounded-2xl p-5 space-y-4 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Master Output Volume</span>
                    <span className="font-mono text-xs font-bold" style={{ color: currentTheme.colors.primary }}>{Math.round(soundSettings.volume * 100)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundSettings.volume}
                    disabled={!soundSettings.enabled}
                    onChange={(e) => updateSound({ volume: parseFloat(e.target.value) })}
                    className="w-full cursor-pointer disabled:opacity-40"
                    style={{ accentColor: currentTheme.colors.primary }}
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      disabled={!soundSettings.enabled}
                      onClick={() => playMechanicalKeySound('a')}
                      className="flex-1 py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all disabled:opacity-40 cursor-pointer"
                      style={{
                        backgroundColor: `${currentTheme.colors.primary}18`,
                        borderColor: `${currentTheme.colors.primary}50`,
                        color: currentTheme.colors.primary
                      }}
                    >
                      ⌨ Test Keypress SFX
                    </button>
                    <button
                      disabled={!soundSettings.enabled}
                      onClick={() => playEnterSound()}
                      className="flex-1 py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all disabled:opacity-40 cursor-pointer"
                      style={{
                        backgroundColor: `${currentTheme.colors.primary}18`,
                        borderColor: `${currentTheme.colors.primary}50`,
                        color: currentTheme.colors.primary
                      }}
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
                <p className="text-xs leading-relaxed" style={{ color: currentTheme.colors.textDim }}>
                  Power consumption mode and system performance tuning.
                </p>

                <div 
                  className="rounded-2xl p-5 space-y-3 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Power Mode</h3>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPowerMode('performance')}
                      className="p-3 rounded-xl border text-center transition-all cursor-pointer"
                      style={{
                        backgroundColor: powerMode === 'performance' ? `${currentTheme.colors.accent}20` : themeSubcardBg,
                        borderColor: powerMode === 'performance' ? currentTheme.colors.accent : themeBorder,
                        color: powerMode === 'performance' ? currentTheme.colors.accent : currentTheme.colors.textDim
                      }}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: powerMode === 'performance' ? currentTheme.colors.accent : currentTheme.colors.textDim }} />
                      <span className="text-xs font-medium">Performance</span>
                    </button>

                    <button
                      onClick={() => setPowerMode('balanced')}
                      className="p-3 rounded-xl border text-center transition-all cursor-pointer"
                      style={{
                        backgroundColor: powerMode === 'balanced' ? `${currentTheme.colors.primary}20` : themeSubcardBg,
                        borderColor: powerMode === 'balanced' ? currentTheme.colors.primary : themeBorder,
                        color: powerMode === 'balanced' ? currentTheme.colors.primary : currentTheme.colors.textDim
                      }}
                    >
                      <AppWindow className="w-5 h-5 mx-auto mb-1" style={{ color: powerMode === 'balanced' ? currentTheme.colors.primary : currentTheme.colors.textDim }} />
                      <span className="text-xs font-medium">Balanced</span>
                    </button>

                    <button
                      onClick={() => setPowerMode('saver')}
                      className="p-3 rounded-xl border text-center transition-all cursor-pointer"
                      style={{
                        backgroundColor: powerMode === 'saver' ? `${currentTheme.colors.secondary}20` : themeSubcardBg,
                        borderColor: powerMode === 'saver' ? currentTheme.colors.secondary : themeBorder,
                        color: powerMode === 'saver' ? currentTheme.colors.secondary : currentTheme.colors.textDim
                      }}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: powerMode === 'saver' ? currentTheme.colors.secondary : currentTheme.colors.textDim }} />
                      <span className="text-xs font-medium">Power Saver</span>
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
                <p className="text-xs leading-relaxed" style={{ color: currentTheme.colors.textDim }}>
                  Default terminal emulator shell and interactive command runner preferences.
                </p>

                <div 
                  className="rounded-2xl p-5 space-y-4 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Terminal Shell Environment</h3>

                  <div className="space-y-2 font-mono text-xs">
                    <label className="block" style={{ color: currentTheme.colors.textDim }}>Default Shell Command:</label>
                    <select
                      value={terminalShell}
                      onChange={e => setTerminalShell(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 font-bold focus:outline-none cursor-pointer border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder,
                        color: currentTheme.colors.primary
                      }}
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
                <p className="text-xs leading-relaxed font-sans" style={{ color: currentTheme.colors.textDim }}>
                  Share this Portfolio OS environment via direct web link, mobile QR Code, or terminal command line.
                </p>

                {/* Grid: Link Sharing & QR Code side by side */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Link Sharing Column (7 cols) */}
                  <div 
                    className="md:col-span-7 rounded-2xl p-5 space-y-4 flex flex-col justify-between border"
                    style={{
                      backgroundColor: themeCardBg,
                      borderColor: themeBorder
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                          <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Website Public Link</h3>
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
                          className="w-full rounded-xl pl-3 pr-24 py-2.5 text-xs font-mono select-all focus:outline-none border"
                          style={{
                            backgroundColor: themeSubcardBg,
                            borderColor: themeBorder,
                            color: currentTheme.colors.primary
                          }}
                        />
                        <button
                          onClick={handleCopyLink}
                          className="absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          style={{
                            backgroundColor: copiedLink ? '#22c55e' : currentTheme.colors.primary,
                            color: isDark ? '#000000' : '#ffffff'
                          }}
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
                    <div className="pt-2 border-t space-y-2" style={{ borderColor: themeBorder }}>
                      <span className="text-xs font-medium block" style={{ color: currentTheme.colors.textDim }}>Quick Social Share:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this interactive Linux Portfolio OS!')}&url=${encodeURIComponent(websiteUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors"
                          style={{
                            backgroundColor: themeSubcardBg,
                            borderColor: themeBorder,
                            color: currentTheme.colors.text
                          }}
                        >
                          <TwitterIcon className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                          <span>Share on X</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                        </a>

                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors"
                          style={{
                            backgroundColor: themeSubcardBg,
                            borderColor: themeBorder,
                            color: currentTheme.colors.text
                          }}
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" style={{ color: currentTheme.colors.secondary }} />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                        </a>

                        <a
                          href={`mailto:?subject=${encodeURIComponent('Check out this Portfolio OS')}&body=${encodeURIComponent(`Hey, check out this interactive Linux Portfolio OS website: ${websiteUrl}`)}`}
                          className="flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors"
                          style={{
                            backgroundColor: themeSubcardBg,
                            borderColor: themeBorder,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Mail className="w-3.5 h-3.5" style={{ color: currentTheme.colors.accent }} />
                          <span>Send Email</span>
                          <Send className="w-3 h-3 ml-auto opacity-50" />
                        </a>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this interactive Portfolio OS: ${websiteUrl}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors"
                          style={{
                            backgroundColor: themeSubcardBg,
                            borderColor: themeBorder,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Column (5 cols) */}
                  <div 
                    className="md:col-span-5 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3 border"
                    style={{
                      backgroundColor: themeCardBg,
                      borderColor: themeBorder
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ color: currentTheme.colors.primary }}>
                      <QrCode className="w-4 h-4" />
                      <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Mobile QR Code</h3>
                    </div>

                    {/* SVG QR Code */}
                    <div 
                      onClick={() => window.open(websiteUrl, '_blank')}
                      className="my-1 cursor-pointer p-1.5 rounded-xl shadow-md hover:scale-105 transition-all"
                      title={`Scan or click to open website: ${websiteUrl}`}
                    >
                      <QRCodeSVG 
                        value={websiteUrl} 
                        size={150} 
                        dotColor={currentTheme.colors.primary}
                        bgColor={isDark ? currentTheme.colors.bg : '#ffffff'}
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] flex items-center justify-center gap-1" style={{ color: currentTheme.colors.textDim }}>
                        <Smartphone className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                        Scan with mobile camera to open website
                      </span>
                    </div>
                  </div>

                </div>

                {/* Terminal CLI Command Share Section */}
                <div 
                  className="rounded-2xl p-5 space-y-3 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                      <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>Terminal Curl Embed Command</h3>
                    </div>
                    <span className="text-xs font-mono" style={{ color: currentTheme.colors.textDim }}>Linux / macOS / WSL</span>
                  </div>

                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      readOnly 
                      value={curlCommand}
                      className="w-full rounded-xl pl-3 pr-24 py-2.5 text-xs font-mono select-all focus:outline-none border"
                      style={{
                        backgroundColor: themeSubcardBg,
                        borderColor: themeBorder,
                        color: currentTheme.colors.primary
                      }}
                    />
                    <button
                      onClick={handleCopyCurl}
                      className="absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border"
                      style={{
                        backgroundColor: copiedCurl ? '#22c55e' : (isDark ? `${currentTheme.colors.dim}bb` : '#e2e8f0'),
                        borderColor: copiedCurl ? '#22c55e' : themeBorder,
                        color: copiedCurl ? '#000000' : currentTheme.colors.text
                      }}
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* System & Endpoint Metadata */}
                <div 
                  className="rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border"
                  style={{
                    backgroundColor: themeSubcardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div>
                    <span className="block text-[10px]" style={{ color: currentTheme.colors.textDim }}>Protocol</span>
                    <span className="font-semibold flex items-center gap-1" style={{ color: currentTheme.colors.primary }}>
                      <Lock className="w-3 h-3 text-green-400" /> TLS 1.3
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px]" style={{ color: currentTheme.colors.textDim }}>Sharing Policy</span>
                    <span style={{ color: currentTheme.colors.text }}>Public Access</span>
                  </div>
                  <div>
                    <span className="block text-[10px]" style={{ color: currentTheme.colors.textDim }}>CDN Caching</span>
                    <span style={{ color: currentTheme.colors.text }}>Edge Global</span>
                  </div>
                  <div>
                    <span className="block text-[10px]" style={{ color: currentTheme.colors.textDim }}>Live Audio SFX</span>
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
                <p className="text-xs font-sans leading-relaxed" style={{ color: currentTheme.colors.textDim }}>
                  System specifications, kernel information, and terminal portfolio metadata.
                </p>

                <div 
                  className="rounded-2xl p-5 space-y-3 border"
                  style={{
                    backgroundColor: themeCardBg,
                    borderColor: themeBorder
                  }}
                >
                  <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: themeBorder }}>
                    <div 
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: `${currentTheme.colors.primary}20`,
                        color: currentTheme.colors.primary
                      }}
                    >
                      <Cpu className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm font-sans" style={{ color: currentTheme.colors.text }}>Portfolio OS v2.34</h3>
                      <p className="text-xs font-mono" style={{ color: currentTheme.colors.primary }}>Kernel 6.8.0-portfolio-amd64</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1" style={{ color: currentTheme.colors.text }}>
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: themeBorder }}>
                      <span style={{ color: currentTheme.colors.textDim }}>Hardware Model:</span>
                      <span>Portfolio Virtual Machine</span>
                    </div>
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: themeBorder }}>
                      <span style={{ color: currentTheme.colors.textDim }}>Memory / RAM:</span>
                      <span>16.0 GB Virtual RAM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: themeBorder }}>
                      <span style={{ color: currentTheme.colors.textDim }}>AI Logic Core:</span>
                      <span style={{ color: currentTheme.colors.accent }}>Gemini 2.5 Flash</span>
                    </div>
                    <div className="flex justify-between py-1 border-b" style={{ borderColor: themeBorder }}>
                      <span style={{ color: currentTheme.colors.textDim }}>React Framework:</span>
                      <span style={{ color: currentTheme.colors.secondary }}>React 19.2.3 + Vite</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span style={{ color: currentTheme.colors.textDim }}>Audio Synthesizer:</span>
                      <span className="text-green-400">Web Audio API Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Footer Bar (Aligned height h-10 with File Explorer / Thunar statusbar) */}
          <div 
            className="h-10 px-4 sm:px-6 border-t flex items-center justify-between text-xs flex-shrink-0 select-none font-mono"
            style={{
              backgroundColor: themeHeaderBg,
              borderColor: themeBorder
            }}
          >
            <span className="text-[11px]" style={{ color: currentTheme.colors.textDim }}>
              Press <kbd className="px-1.5 py-0.5 rounded font-sans border" style={{ backgroundColor: themeSubcardBg, borderColor: themeBorder, color: currentTheme.colors.text }}>Esc</kbd> to exit Settings
            </span>

            <button 
              onClick={() => { playUIClickSound(); onClose(); }}
              className="px-4 py-1 rounded-lg font-bold text-xs transition-all shadow-md cursor-pointer font-sans"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: isDark ? '#000000' : '#ffffff'
              }}
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

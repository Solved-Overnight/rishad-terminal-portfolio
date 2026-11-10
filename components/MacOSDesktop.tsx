import React, { useState, useEffect, useRef, useCallback } from 'react';
import Terminal from './Terminal';
import IdCard from './IdCard';
import StarBorder from './StarBorder';
import { useTheme } from '../contexts/ThemeContext';
import { HistoryItem } from '../types';
import { SOCIALS } from '../constants';
import { 
  getSoundSettings, 
  saveSoundSettings, 
  playUIClickSound, 
  playEnterSound 
} from '../utils/soundEffects';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Folder, 
  Search, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Battery, 
  Bell, 
  Calendar, 
  Power, 
  Settings as SettingsIcon, 
  Share2, 
  RefreshCw, 
  Sliders, 
  FileText, 
  Info,
  ChevronRight,
  ExternalLink,
  Download,
  RotateCcw,
  Check,
  Image as ImageIcon,
  SlidersHorizontal,
  Moon,
  Sun,
  Laptop,
  HardDrive,
  Cpu,
  Monitor
} from 'lucide-react';

/* ========================================================================= */
/* MACOS NATIVE BRAND & APPLICATION ICONS (AUTHENTIC SVGS)                    */
/* ========================================================================= */

// Apple Logo ()
export const AppleLogo: React.FC<{ className?: string; size?: number }> = ({ className = "w-4 h-4", size = 16 }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 170 170" 
    fill="currentColor"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.65-8.7-10.09-18.73-13.32-30.08-3.23-11.36-4.84-22.25-4.84-32.68 0-14.79 3.82-27.13 11.45-37.04 7.64-9.91 17.38-14.98 29.21-15.22 4.35 0 9.49 1.16 15.42 3.48 5.93 2.32 9.77 3.54 11.51 3.65 1.74 0 5.86-1.33 12.37-3.99 6.51-2.66 11.75-3.84 15.72-3.54 11.36.87 20.48 5.17 27.35 12.91-10.44 6.31-15.54 15.11-15.3 26.4.24 9.14 3.73 16.79 10.48 22.95 6.74 6.16 14.86 9.61 24.36 10.35-2.17 6.74-4.78 13.56-7.83 20.47zM119.22 33.09c0-6.74 2.51-13.25 7.54-19.53 5.03-6.28 11.23-10.44 18.6-12.48.24 1.3.36 2.44.36 3.42 0 6.96-2.61 13.62-7.83 19.98-5.22 6.36-11.5 10.4-18.84 12.12-.12-1.19-.18-2.36-.18-3.51z"/>
  </svg>
);

// macOS Finder App Icon
export const MacFinderIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#finder_bg)" />
    <path d="M50 15v70" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 38c0-4 4-8 8-8s8 4 8 8" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M56 38c0-4 4-8 8-8s8 4 8 8" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 60c4 10 14 16 20 16s16-6 20-16" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <defs>
      <linearGradient id="finder_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa" />
        <stop offset="0.5" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Terminal App Icon
export const MacTerminalIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#terminal_bg)" />
    <rect x="4" y="4" width="92" height="92" rx="18" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    <path d="M24 34l18 16-18 16" stroke="#4ade80" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 66h26" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
    <defs>
      <linearGradient id="terminal_bg" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2c2c2e" />
        <stop offset="1" stopColor="#1c1c1e" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Safari App Icon
export const MacSafariIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#safari_bg)" />
    <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 3" />
    <polygon points="50,18 56,44 50,50 44,44" fill="#ef4444" />
    <polygon points="50,82 44,56 50,50 56,56" fill="#f8fafc" />
    <circle cx="50" cy="50" r="3" fill="#ffffff" />
    <defs>
      <linearGradient id="safari_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.5" stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Contacts / ID Pass Icon
export const MacContactsIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#contacts_bg)" />
    <rect x="20" y="24" width="60" height="52" rx="8" fill="white" fillOpacity="0.95" />
    <circle cx="50" cy="42" r="11" fill="#3b82f6" />
    <path d="M34 66c0-9 7-14 16-14s16 5 16 14" fill="#3b82f6" />
    <rect x="14" y="32" width="6" height="8" rx="2" fill="#cbd5e1" />
    <rect x="14" y="46" width="6" height="8" rx="2" fill="#cbd5e1" />
    <rect x="14" y="60" width="6" height="8" rx="2" fill="#cbd5e1" />
    <defs>
      <linearGradient id="contacts_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Notes Icon
export const MacNotesIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="#fffbeb" />
    <rect x="0" y="0" width="100" height="26" fill="#f59e0b" rx="22" />
    <rect x="0" y="16" width="100" height="12" fill="#f59e0b" />
    <line x1="16" y1="42" x2="84" y2="42" stroke="#e2e8f0" strokeWidth="2" />
    <line x1="16" y1="56" x2="84" y2="56" stroke="#e2e8f0" strokeWidth="2" />
    <line x1="16" y1="70" x2="84" y2="70" stroke="#e2e8f0" strokeWidth="2" />
    <line x1="16" y1="84" x2="64" y2="84" stroke="#e2e8f0" strokeWidth="2" />
  </svg>
);

// macOS System Settings Gear Icon
export const MacSettingsIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#gear_bg)" />
    <circle cx="50" cy="50" r="16" fill="url(#gear_inner)" />
    <circle cx="50" cy="50" r="8" fill="#475569" />
    <g stroke="#94a3b8" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="20" x2="50" y2="28" />
      <line x1="50" y1="72" x2="50" y2="80" />
      <line x1="20" y1="50" x2="28" y2="50" />
      <line x1="72" y1="50" x2="80" y2="50" />
      <line x1="29" y1="29" x2="35" y2="35" />
      <line x1="65" y1="65" x2="71" y2="71" />
      <line x1="29" y1="71" x2="35" y2="65" />
      <line x1="65" y1="35" x2="71" y2="29" />
    </g>
    <defs>
      <linearGradient id="gear_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#64748b" />
        <stop offset="1" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="gear_inner" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#94a3b8" />
        <stop offset="1" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Trash Icon
export const MacTrashIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#trash_bg)" />
    <rect x="28" y="32" width="44" height="48" rx="6" stroke="#94a3b8" strokeWidth="3" fill="rgba(255,255,255,0.15)" />
    <line x1="22" y1="28" x2="78" y2="28" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
    <rect x="42" y="20" width="16" height="8" rx="3" stroke="#cbd5e1" strokeWidth="3" fill="none" />
    <line x1="40" y1="40" x2="40" y2="68" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="40" x2="50" y2="68" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="60" y1="40" x2="60" y2="68" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="trash_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#475569" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
    </defs>
  </svg>
);

// macOS Code / Projects Icon
export const MacCodeIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="22" fill="url(#code_bg)" />
    <path d="M34 36l-14 14 14 14" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M66 36l14 14-14 14" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="56" y1="28" x2="44" y2="72" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
    <defs>
      <linearGradient id="code_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
    </defs>
  </svg>
);

/* ========================================================================= */
/* WALLPAPER PRESETS (OFFICIAL MACOS SEQUOIA & SONOMA)                       */
/* ========================================================================= */
export interface WallpaperPreset {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  src?: string;
  gradient?: string;
}

const WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'sequoia',
    name: 'macOS Sequoia Redwoods',
    type: 'image',
    src: '/img/macos_sequoia_wallpaper.jpg'
  },
  {
    id: 'sonoma',
    name: 'macOS Sonoma Pacific Twilight',
    type: 'image',
    src: '/img/macos_sonoma_wallpaper.jpg'
  },
  {
    id: 'monterey',
    name: 'macOS Monterey Neon Wave',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 70% 30%, #ec4899 0%, #8b5cf6 40%, #1e1b4b 100%)'
  },
  {
    id: 'ventura',
    name: 'macOS Ventura Amber Blossom',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 30% 20%, #f59e0b 0%, #d97706 45%, #451a03 100%)'
  },
  {
    id: 'midnight',
    name: 'macOS Cyber Dark Slate',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 10%, #1e293b 0%, #0f172a 60%, #020617 100%)'
  }
];

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getInitialRect = (key: string, defaultRect: WindowRect): WindowRect => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.x === 'number' &&
          typeof parsed.y === 'number' &&
          typeof parsed.width === 'number' &&
          typeof parsed.height === 'number'
        ) {
          return {
            x: Math.max(0, Math.min(window.innerWidth - 120, parsed.x)),
            y: Math.max(30, Math.min(window.innerHeight - 100, parsed.y)),
            width: Math.max(340, Math.min(window.innerWidth - 16, parsed.width)),
            height: Math.max(300, Math.min(window.innerHeight - 80, parsed.height))
          };
        }
      }
    } catch {
      // ignore
    }
  }
  return defaultRect;
};

interface MacOSDesktopProps {
  onToggleUndercover: () => void;
  onRunCommand: (cmd: string) => void;
  onOpenProjects: () => void;
  onOpenBlogs: (blogId?: string) => void;
  onOpenSettings: () => void;
  onOpenUrlPreview: () => void;
  onRestart: () => void;
  onPowerOff: () => void;
  onLogOut: () => void;
  onDownloadResume: () => void;
  commandHistory: HistoryItem[];
  setCommandHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  externalCommand?: string | null;
  onCommandComplete?: () => void;
}

export const MacOSDesktop: React.FC<MacOSDesktopProps> = ({
  onToggleUndercover,
  onRunCommand,
  onOpenProjects,
  onOpenBlogs,
  onOpenSettings,
  onOpenUrlPreview,
  onRestart,
  onPowerOff,
  onLogOut,
  onDownloadResume,
  commandHistory,
  setCommandHistory,
  externalCommand,
  onCommandComplete,
}) => {
  const { currentTheme, setTheme } = useTheme();

  // Desktop States
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Wallpaper state
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('macos_wallpaper_idx');
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < WALLPAPERS.length) return idx;
      }
    }
    return 0;
  });

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(() => getSoundSettings().enabled);
  const [volume, setVolume] = useState(() => getSoundSettings().volume);

  // Windows Open / Minimized / Maximized States
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);

  const [isBadgeOpen, setIsBadgeOpen] = useState(true);
  const [isBadgeMinimized, setIsBadgeMinimized] = useState(false);
  const [isBadgeMaximized, setIsBadgeMaximized] = useState(false);

  const [isAboutMacOpen, setIsAboutMacOpen] = useState(false);
  const [isAboutMacMinimized, setIsAboutMacMinimized] = useState(false);

  // Active focus
  const [activeWindow, setActiveWindow] = useState<'terminal' | 'badge' | 'about'>('terminal');

  // Full Screen State
  const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' && !!document.fullscreenElement);

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
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  };

  // Window Geometries
  const [badgeRect, setBadgeRect] = useState<WindowRect>(() =>
    getInitialRect('macos_badge_geometry', {
      x: typeof window !== 'undefined' ? Math.max(20, Math.floor(window.innerWidth * 0.05)) : 40,
      y: 44,
      width: typeof window !== 'undefined' ? Math.min(430, window.innerWidth - 32) : 430,
      height: typeof window !== 'undefined' ? Math.min(610, window.innerHeight - 100) : 610
    })
  );

  const [terminalRect, setTerminalRect] = useState<WindowRect>(() =>
    getInitialRect('macos_terminal_geometry', {
      x: typeof window !== 'undefined' ? Math.max(80, Math.floor(window.innerWidth * 0.36)) : 470,
      y: 44,
      width: typeof window !== 'undefined' ? Math.min(840, window.innerWidth - 80) : 820,
      height: typeof window !== 'undefined' ? Math.min(610, window.innerHeight - 100) : 610
    })
  );

  const [aboutMacRect, setAboutMacRect] = useState<WindowRect>(() =>
    getInitialRect('macos_about_geometry', {
      x: typeof window !== 'undefined' ? Math.max(40, Math.floor((window.innerWidth - 520) / 2)) : 220,
      y: typeof window !== 'undefined' ? Math.max(60, Math.floor((window.innerHeight - 440) / 2)) : 120,
      width: 520,
      height: 440
    })
  );

  // Dragging & Resizing States
  const [activeDragWindow, setActiveDragWindow] = useState<'terminal' | 'badge' | 'about' | null>(null);
  const [activeResizeWindow, setActiveResizeWindow] = useState<{
    id: 'terminal' | 'badge' | 'about';
    handle: string;
  } | null>(null);

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0
  });

  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; rect: WindowRect }>({
    mouseX: 0,
    mouseY: 0,
    rect: { x: 0, y: 0, width: 0, height: 0 }
  });

  // Dock items target refs for fluid macOS minimize animation
  const terminalDockRef = useRef<HTMLButtonElement>(null);
  const badgeDockRef = useRef<HTMLButtonElement>(null);
  const aboutDockRef = useRef<HTMLButtonElement>(null);

  const appleMenuRef = useRef<HTMLDivElement>(null);
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  // Current rect refs to eliminate stale closure issues
  const currentTerminalRectRef = useRef(terminalRect);
  currentTerminalRectRef.current = terminalRect;
  const currentBadgeRectRef = useRef(badgeRect);
  currentBadgeRectRef.current = badgeRect;
  const currentAboutRectRef = useRef(aboutMacRect);
  currentAboutRectRef.current = aboutMacRect;

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Global click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (appleMenuRef.current && !appleMenuRef.current.contains(target)) {
        setIsAppleMenuOpen(false);
      }
      if (controlCenterRef.current && !controlCenterRef.current.contains(target)) {
        setIsControlCenterOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
      if (spotlightRef.current && !spotlightRef.current.contains(target)) {
        setIsSpotlightOpen(false);
      }
      if (contextRef.current && !contextRef.current.contains(target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save geometries helper
  const saveGeometry = useCallback((id: 'terminal' | 'badge' | 'about', rect: WindowRect) => {
    try {
      localStorage.setItem(`macos_${id}_geometry`, JSON.stringify(rect));
    } catch {}
  }, []);

  // Global window listeners for silky smooth drag & resize
  useEffect(() => {
    if (!activeDragWindow && !activeResizeWindow) return;

    const originalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (activeDragWindow) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const newX = Math.max(-200, Math.min(screenW - 80, dragStartRef.current.startX + dx));
        const newY = Math.max(30, Math.min(screenH - 70, dragStartRef.current.startY + dy));

        if (activeDragWindow === 'terminal') {
          setTerminalRect(prev => ({ ...prev, x: newX, y: newY }));
        } else if (activeDragWindow === 'badge') {
          setBadgeRect(prev => ({ ...prev, x: newX, y: newY }));
        } else if (activeDragWindow === 'about') {
          setAboutMacRect(prev => ({ ...prev, x: newX, y: newY }));
        }
      } else if (activeResizeWindow) {
        const { id, handle } = activeResizeWindow;
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;
        const init = resizeStartRef.current.rect;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const minW = id === 'terminal' ? 440 : id === 'badge' ? 340 : 400;
        const minH = id === 'badge' ? 420 : 280;

        let newX = init.x;
        let newY = init.y;
        let newW = init.width;
        let newH = init.height;

        if (handle.includes('e')) {
          newW = Math.max(minW, Math.min(screenW - init.x - 8, init.width + dx));
        }
        if (handle.includes('w')) {
          const proposedW = init.width - dx;
          if (proposedW >= minW && init.x + dx >= 0) {
            newW = proposedW;
            newX = init.x + dx;
          }
        }
        if (handle.includes('s')) {
          newH = Math.max(minH, Math.min(screenH - init.y - 70, init.height + dy));
        }
        if (handle.includes('n')) {
          const proposedH = init.height - dy;
          if (proposedH >= minH && init.y + dy >= 30) {
            newH = proposedH;
            newY = init.y + dy;
          }
        }

        const updated = { x: newX, y: newY, width: newW, height: newH };
        if (id === 'terminal') setTerminalRect(updated);
        else if (id === 'badge') setBadgeRect(updated);
        else if (id === 'about') setAboutMacRect(updated);
      }
    };

    const handleGlobalPointerUp = () => {
      if (activeDragWindow) {
        if (activeDragWindow === 'terminal') saveGeometry('terminal', currentTerminalRectRef.current);
        if (activeDragWindow === 'badge') saveGeometry('badge', currentBadgeRectRef.current);
        if (activeDragWindow === 'about') saveGeometry('about', currentAboutRectRef.current);
        setActiveDragWindow(null);
      }
      if (activeResizeWindow) {
        if (activeResizeWindow.id === 'terminal') saveGeometry('terminal', currentTerminalRectRef.current);
        if (activeResizeWindow.id === 'badge') saveGeometry('badge', currentBadgeRectRef.current);
        if (activeResizeWindow.id === 'about') saveGeometry('about', currentAboutRectRef.current);
        setActiveResizeWindow(null);
      }
      document.body.style.userSelect = originalUserSelect;
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
      document.body.style.userSelect = originalUserSelect;
    };
  }, [activeDragWindow, activeResizeWindow, saveGeometry]);

  // Next Wallpaper cycle
  const handleNextWallpaper = () => {
    playUIClickSound();
    setWallpaperIndex((prev) => {
      const next = (prev + 1) % WALLPAPERS.length;
      localStorage.setItem('macos_wallpaper_idx', next.toString());
      setToastMessage(`🖼️ macOS Wallpaper: ${WALLPAPERS[next].name}`);
      return next;
    });
    setContextMenu(null);
  };

  // Drag start
  const handleStartDrag = (e: React.PointerEvent, windowId: 'terminal' | 'badge' | 'about') => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) return;

    setActiveWindow(windowId);
    if (windowId === 'terminal' && isTerminalMaximized) setIsTerminalMaximized(false);
    if (windowId === 'badge' && isBadgeMaximized) setIsBadgeMaximized(false);

    let initialX = 0;
    let initialY = 0;
    if (windowId === 'terminal') {
      initialX = terminalRect.x;
      initialY = terminalRect.y;
    } else if (windowId === 'badge') {
      initialX = badgeRect.x;
      initialY = badgeRect.y;
    } else if (windowId === 'about') {
      initialX = aboutMacRect.x;
      initialY = aboutMacRect.y;
    }

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: initialX,
      startY: initialY
    };
    setActiveDragWindow(windowId);
  };

  // Resize start
  const handleStartResize = (e: React.PointerEvent, windowId: 'terminal' | 'badge' | 'about', handle: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setActiveWindow(windowId);

    if (windowId === 'terminal' && isTerminalMaximized) setIsTerminalMaximized(false);
    if (windowId === 'badge' && isBadgeMaximized) setIsBadgeMaximized(false);

    let initialRect = terminalRect;
    if (windowId === 'badge') initialRect = badgeRect;
    if (windowId === 'about') initialRect = aboutMacRect;

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      rect: { ...initialRect }
    };
    setActiveResizeWindow({ id: windowId, handle });
  };

  // macOS Fluid Genie / Scale minimize delta
  const getMinimizeDelta = (rect: WindowRect, ref: React.RefObject<HTMLButtonElement | null>, fallbackX: number) => {
    let dockX = fallbackX;
    let dockY = typeof window !== 'undefined' ? window.innerHeight - 34 : 720;

    if (ref.current) {
      const b = ref.current.getBoundingClientRect();
      dockX = b.left + b.width / 2;
      dockY = b.top + b.height / 2;
    }

    const windowCenterX = rect.x + rect.width / 2;
    const windowCenterY = rect.y + rect.height / 2;

    return {
      dx: dockX - windowCenterX,
      dy: dockY - windowCenterY
    };
  };

  // Right-click desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ 
      x: Math.min(window.innerWidth - 240, e.clientX), 
      y: Math.min(window.innerHeight - 340, e.clientY) 
    });
  };

  // Time format: e.g. "Tue Nov 4  11:58 AM"
  const formattedTime = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formattedDay = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const toggleSound = () => {
    playUIClickSound();
    const updated = saveSoundSettings({ enabled: !soundEnabled });
    setSoundEnabled(updated.enabled);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    saveSoundSettings({ volume: newVol });
  };

  // Keyboard shortcut listener for Spotlight (Cmd+Space / Ctrl+Space)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsAppleMenuOpen(false);
        setIsControlCenterOpen(false);
        setIsNotificationOpen(false);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to render 8 resize handles
  const renderResizeHandles = (id: 'terminal' | 'badge' | 'about') => (
    <>
      <div onPointerDown={(e) => handleStartResize(e, id, 'n')} className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-40" />
      <div onPointerDown={(e) => handleStartResize(e, id, 's')} className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-40" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'w')} className="absolute top-3 bottom-3 left-0 w-2 cursor-ew-resize z-40" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'e')} className="absolute top-3 bottom-3 right-0 w-2 cursor-ew-resize z-40" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'nw')} className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-50" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'ne')} className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-50" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'sw')} className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-50" />
      <div onPointerDown={(e) => handleStartResize(e, id, 'se')} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5">
        <div className="w-2 h-2 border-r-[1.5px] border-b-[1.5px] border-white/40" />
      </div>
    </>
  );

  const activeWallpaper = WALLPAPERS[wallpaperIndex] || WALLPAPERS[0];

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden select-none text-white bg-black z-40 flex flex-col justify-between"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        ...(activeWallpaper.type === 'image'
          ? {
              backgroundImage: `url('${activeWallpaper.src}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'background-image 0.5s ease-in-out'
            }
          : {
              background: activeWallpaper.gradient,
              transition: 'background 0.5s ease-in-out'
            })
      }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setIsAppleMenuOpen(false);
        setIsControlCenterOpen(false);
        setIsNotificationOpen(false);
        setContextMenu(null);
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-2xl border border-white/20 text-xs font-medium text-white shadow-2xl flex items-center gap-2 animate-slideInDown">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. TOP MACOS MENU BAR                                             */}
      {/* ================================================================= */}
      <div 
        className="w-full h-7 bg-black/40 backdrop-blur-2xl border-b border-white/[0.12] px-3.5 flex items-center justify-between text-[13px] text-white/90 z-50 select-none shadow-sm relative font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Apple Logo + Active App Menus */}
        <div className="flex items-center gap-4">
          {/* Apple Logo Dropdown Trigger */}
          <div className="relative" ref={appleMenuRef}>
            <button 
              onClick={() => setIsAppleMenuOpen(prev => !prev)}
              className={`p-1 rounded hover:bg-white/20 active:bg-white/30 transition-colors cursor-default ${isAppleMenuOpen ? 'bg-white/20' : ''}`}
              title="Apple Menu"
            >
              <AppleLogo className="w-3.5 h-3.5 text-white drop-shadow" />
            </button>

            {/* Apple Menu Dropdown */}
            {isAppleMenuOpen && (
              <div className="absolute top-7 left-0 w-60 rounded-xl bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 shadow-2xl p-1 text-[13px] text-white z-50 animate-fadeIn space-y-0.5">
                <button 
                  onClick={() => {
                    setIsAppleMenuOpen(false);
                    setIsAboutMacOpen(true);
                    setIsAboutMacMinimized(false);
                    setActiveWindow('about');
                  }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  About This Mac
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onOpenSettings(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  System Settings...
                </button>
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onOpenProjects(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  App Store (Projects)...
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onRestart(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  Restart...
                </button>
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onPowerOff(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  Shut Down...
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onLogOut(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
                >
                  Log Out Moniruzzaman Rishad...
                </button>
                <div className="h-px bg-white/10 my-1" />
                {/* Exit Disguise */}
                <button 
                  onClick={() => { setIsAppleMenuOpen(false); onToggleUndercover(); }}
                  className="w-full text-left px-3 py-1 rounded-[6px] bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500 hover:text-black transition-colors cursor-default flex items-center gap-2"
                >
                  <span>🐧</span>
                  <span>Exit Disguise (Switch to Linux)</span>
                </button>
              </div>
            )}
          </div>

          {/* Active App Title (Bold) */}
          <span className="font-bold text-white text-[13px] tracking-tight">
            {activeWindow === 'terminal' ? 'Terminal' : activeWindow === 'badge' ? 'Contacts' : 'Finder'}
          </span>

          {/* macOS Menus */}
          <div className="hidden sm:flex items-center gap-3.5 text-white/85 text-[13px]">
            <button 
              onClick={() => {
                setIsTerminalOpen(true);
                setIsTerminalMinimized(false);
                setActiveWindow('terminal');
              }}
              className="hover:text-white cursor-default"
            >
              File
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("https://mzrishad.is-a.dev/");
                setToastMessage('📋 Portfolio URL copied to clipboard');
              }}
              className="hover:text-white cursor-default"
            >
              Edit
            </button>
            <button 
              onClick={handleNextWallpaper}
              className="hover:text-white cursor-default"
            >
              View
            </button>
            <button 
              onClick={onOpenProjects}
              className="hover:text-white cursor-default"
            >
              Go
            </button>
            <button 
              onClick={() => {
                setIsTerminalMinimized(false);
                setIsBadgeMinimized(false);
              }}
              className="hover:text-white cursor-default"
            >
              Window
            </button>
            <button 
              onClick={() => {
                setIsTerminalOpen(true);
                setIsTerminalMinimized(false);
                setActiveWindow('terminal');
                onRunCommand('help');
              }}
              className="hover:text-white cursor-default"
            >
              Help
            </button>
          </div>
        </div>

        {/* Right Side: macOS Status Tray & Clock */}
        <div className="flex items-center gap-2.5 text-xs text-white/90">
          {/* Quick Wallpaper Switcher */}
          <button 
            onClick={handleNextWallpaper}
            className="p-1 rounded hover:bg-white/20 transition-colors cursor-default text-zinc-300 hover:text-white"
            title={`Cycle Wallpaper (${WALLPAPERS[(wallpaperIndex + 1) % WALLPAPERS.length].name})`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen}
            className={`p-1 rounded transition-colors cursor-default ${isFullscreen ? 'text-emerald-400 bg-white/20' : 'hover:bg-white/20 text-zinc-300 hover:text-white'}`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Wi-Fi Icon */}
          <span className="p-1" title="Wi-Fi: AI-Workstation-5G">
            <Wifi className="w-3.5 h-3.5" />
          </span>

          {/* Sound Toggle / Volume */}
          <button 
            onClick={toggleSound}
            className="p-1 rounded hover:bg-white/20 transition-colors cursor-default"
            title={`Sound ${soundEnabled ? 'Enabled' : 'Muted'}`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
          </button>

          {/* Battery */}
          <div className="flex items-center gap-1 text-[11px]" title="Battery: 100% (Power Adapter Connected)">
            <span>100%</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Spotlight Search Icon */}
          <button 
            onClick={() => setIsSpotlightOpen(prev => !prev)}
            className={`p-1 rounded hover:bg-white/20 transition-colors cursor-default ${isSpotlightOpen ? 'bg-white/20' : ''}`}
            title="Spotlight Search (Cmd+Space)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Control Center Icon */}
          <button 
            onClick={() => {
              setIsControlCenterOpen(prev => !prev);
              setIsNotificationOpen(false);
            }}
            className={`p-1 rounded hover:bg-white/20 transition-colors cursor-default ${isControlCenterOpen ? 'bg-white/20' : ''}`}
            title="Control Center"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* macOS Date & Time */}
          <button 
            onClick={() => {
              setIsNotificationOpen(prev => !prev);
              setIsControlCenterOpen(false);
            }}
            className={`px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-default text-[12px] font-normal tracking-tight ${isNotificationOpen ? 'bg-white/20' : ''}`}
            title="Notification Center & Calendar"
          >
            <span>{formattedDay} &nbsp;{formattedTime}</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. MACOS CONTROL CENTER POPUP                                     */}
      {/* ================================================================= */}
      {isControlCenterOpen && (
        <div 
          ref={controlCenterRef}
          className="fixed top-9 right-3 w-80 rounded-2xl bg-[#1e1e1e]/85 backdrop-blur-3xl border border-white/20 shadow-2xl p-3 z-50 animate-slideInDown text-white select-none space-y-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top 4 Quick Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#007aff] flex items-center justify-center text-white">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold">Wi-Fi</div>
                <div className="text-[10px] text-zinc-400">AI-Lab-5G</div>
              </div>
            </div>

            <div 
              onClick={toggleSound}
              className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2.5 cursor-pointer hover:bg-white/15 transition-colors"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${soundEnabled ? 'bg-[#007aff]' : 'bg-zinc-600'}`}>
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold">Sound</div>
                <div className="text-[10px] text-zinc-400">{soundEnabled ? `${Math.round(volume * 100)}%` : 'Muted'}</div>
              </div>
            </div>
          </div>

          {/* Display & Sound Sliders */}
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-2">
            <div className="text-[11px] text-zinc-300 font-medium">Sound Volume</div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#007aff] bg-white/20 h-2 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Wallpapers Switcher */}
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="font-medium">macOS Wallpaper</span>
              <span className="text-[10px] text-zinc-400">{wallpaperIndex + 1}/{WALLPAPERS.length}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {WALLPAPERS.map((wp, i) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    playUIClickSound();
                    setWallpaperIndex(i);
                    localStorage.setItem('macos_wallpaper_idx', i.toString());
                    setToastMessage(`🖼️ Wallpaper: ${wp.name}`);
                  }}
                  className={`h-10 rounded-lg border overflow-hidden transition-all ${wallpaperIndex === i ? 'border-[#007aff] ring-2 ring-[#007aff]/50 scale-105' : 'border-white/15 hover:border-white/40'}`}
                  title={wp.name}
                >
                  {wp.type === 'image' ? (
                    <img src={wp.src} alt={wp.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: wp.gradient }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Return to Linux Shortcut */}
          <button
            onClick={() => {
              setIsControlCenterOpen(false);
              onToggleUndercover();
            }}
            className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold border border-cyan-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>🐧</span>
            <span>Exit Disguise (Switch to Linux)</span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2.5 MACOS NOTIFICATION CENTER / CALENDAR FLYOUT                   */}
      {/* ================================================================= */}
      {isNotificationOpen && (
        <div 
          ref={notificationRef}
          className="fixed top-9 right-3 w-80 rounded-2xl bg-[#1e1e1e]/85 backdrop-blur-3xl border border-white/20 shadow-2xl p-4 z-50 animate-slideInDown text-white select-none space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <div className="text-2xl font-bold">{formattedTime}</div>
              <div className="text-xs text-blue-400 font-medium">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
            <Calendar className="w-6 h-6 text-zinc-400" />
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs space-y-1">
            <div className="font-semibold text-white">Full-Time Availability</div>
            <div className="text-[11px] text-emerald-400">AI / ML Engineer & System Architect</div>
            <div className="text-[10px] text-zinc-400 pt-1">Remote • Worldwide • Immediate Onboarding</div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. MACOS SPOTLIGHT SEARCH MODAL (CMD+SPACE)                       */}
      {/* ================================================================= */}
      {isSpotlightOpen && (
        <div 
          ref={spotlightRef}
          className="fixed top-24 left-1/2 -translate-x-1/2 w-[640px] max-w-[92vw] rounded-2xl bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 shadow-2xl z-50 flex flex-col overflow-hidden animate-slideInDown text-white select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Spotlight Search Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400 ml-1" />
            <input 
              type="text" 
              value={spotlightQuery}
              onChange={(e) => setSpotlightQuery(e.target.value)}
              placeholder="Spotlight Search (cmatrix, htop, nvidia-smi, projects)..." 
              className="bg-transparent border-none outline-none text-base w-full text-white placeholder:text-zinc-500 font-light"
              autoFocus
            />
            {spotlightQuery && (
              <button onClick={() => setSpotlightQuery('')} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Commands & Results */}
          <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar text-xs space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold px-3 py-1">Top Suggestions</div>
            {[
              { name: 'Terminal.app (macOS CLI)', desc: 'Run CLI commands & scripts', icon: <MacTerminalIcon className="w-6 h-6" />, cmd: 'help' },
              { name: 'cmatrix', desc: 'Terminal matrix digital rain stream', icon: <span className="font-mono text-emerald-400 font-bold text-xs">MTRX</span>, cmd: 'cmatrix' },
              { name: 'nvidia-smi', desc: 'GPU VRAM allocation & neural telemetry', icon: <span className="font-mono text-purple-400 font-bold text-xs">GPU</span>, cmd: 'nvidia-smi' },
              { name: 'htop', desc: 'Real-time CPU & memory process monitor', icon: <span className="font-mono text-cyan-400 font-bold text-xs">HTOP</span>, cmd: 'htop' },
              { name: 'Projects Showcase', desc: 'Interactive AI & ML application deck', icon: <MacCodeIcon className="w-6 h-6" />, action: onOpenProjects },
              { name: 'Articles & Blogs', desc: 'Read AI R&D engineering papers', icon: <MacNotesIcon className="w-6 h-6" />, action: onOpenBlogs }
            ]
              .filter(item => !spotlightQuery.trim() || item.name.toLowerCase().includes(spotlightQuery.toLowerCase()) || item.desc.toLowerCase().includes(spotlightQuery.toLowerCase()))
              .map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playEnterSound();
                    setIsSpotlightOpen(false);
                    if (item.action) item.action();
                    else if (item.cmd) {
                      setIsTerminalOpen(true);
                      setIsTerminalMinimized(false);
                      setActiveWindow('terminal');
                      onRunCommand(item.cmd);
                    }
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#007aff] flex items-center justify-between transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-[10px] text-zinc-400 group-hover:text-blue-100">{item.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 group-hover:text-white font-mono">Return ↵</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. DESKTOP WORKSPACE (FLOATING MACOS WINDOWS & DESKTOP FILES)       */}
      {/* ================================================================= */}
      <div className="flex-1 w-full relative p-4 overflow-hidden">
        
        {/* Desktop Icons (Top Right Column - macOS Standard) */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-10 w-fit select-none">
          {[
            { id: 'macintosh', name: 'Macintosh HD', icon: <HardDrive className="w-10 h-10 text-slate-300 drop-shadow-md" />, action: () => { setIsAboutMacOpen(true); setIsAboutMacMinimized(false); setActiveWindow('about'); } },
            { id: 'resume', name: 'Rishad_Resume.pdf', icon: <FileText className="w-10 h-10 text-red-400 drop-shadow-md" />, action: onDownloadResume },
            { id: 'projects_folder', name: 'AI_Projects', icon: <Folder className="w-10 h-10 text-sky-400 drop-shadow-md" />, action: onOpenProjects }
          ].map(icon => (
            <button
              key={icon.id}
              onDoubleClick={(e) => {
                e.stopPropagation();
                playEnterSound();
                icon.action();
              }}
              className="w-24 p-2 rounded-lg flex flex-col items-center text-center gap-1 hover:bg-white/10 active:bg-white/20 transition-all cursor-default group"
              title={`${icon.name} (Double-click to open)`}
            >
              {icon.icon}
              <span className="text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2 px-1 rounded bg-black/20">
                {icon.name}
              </span>
            </button>
          ))}
        </div>

        {/* =============================================================== */}
        {/* WINDOW 1: EMPLOYEE ID BADGE VIEWER WINDOW (MACOS CHROME)        */}
        {/* =============================================================== */}
        {isBadgeOpen && (
          <div 
            onClick={() => setActiveWindow('badge')}
            style={
              isBadgeMaximized
                ? {
                    left: 8,
                    top: 36,
                    right: 8,
                    bottom: 84,
                    width: 'calc(100% - 16px)',
                    height: 'calc(100% - 120px)',
                    transform: isBadgeMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(badgeRect, badgeDockRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 30 : 500);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isBadgeMinimized ? 0 : 1,
                    pointerEvents: isBadgeMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge') ? 'left, top, width, height' : 'auto'
                  }
                : {
                    left: `${badgeRect.x}px`,
                    top: `${badgeRect.y}px`,
                    width: `${badgeRect.width}px`,
                    height: `${badgeRect.height}px`,
                    transform: isBadgeMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(badgeRect, badgeDockRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 30 : 500);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isBadgeMinimized ? 0 : 1,
                    pointerEvents: isBadgeMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge') ? 'left, top, width, height' : 'auto'
                  }
            }
            className={`
              absolute rounded-xl overflow-hidden flex flex-col border
              ${activeWindow === 'badge' 
                ? 'z-30 border-white/20 shadow-[0_24px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/10' 
                : 'z-20 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] opacity-95'
              }
              bg-[#1c1c1e]/95 backdrop-blur-3xl text-white
            `}
          >
            {/* macOS Title Bar with Traffic Light Controls */}
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'badge')}
              onDoubleClick={() => setIsBadgeMaximized(!isBadgeMaximized)}
              className="h-9 px-3 bg-[#2c2c2e]/80 border-b border-white/[0.08] flex items-center justify-between select-none cursor-default active:cursor-grabbing relative"
              title="Click & drag to reposition window"
            >
              {/* Traffic Light Window Controls */}
              <div className="flex items-center gap-2 group/traffic">
                {/* Close (Red) */}
                <button
                  onClick={() => setIsBadgeOpen(false)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Close"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">×</span>
                </button>
                {/* Minimize (Yellow) */}
                <button
                  onClick={() => setIsBadgeMinimized(true)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Minimize (Into Dock)"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">–</span>
                </button>
                {/* Zoom / Fullscreen (Green) */}
                <button
                  onClick={() => setIsBadgeMaximized(!isBadgeMaximized)}
                  className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Zoom"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">+</span>
                </button>
              </div>

              {/* Centered Window Title */}
              <div className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/80 pointer-events-none truncate max-w-[220px]">
                Employee Profile — Moniruzzaman Rishad
              </div>

              <div className="w-12" />
            </div>

            {/* Window Content: 3D ID Card Viewer */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-[#141416]/60">
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <IdCard />
              </div>

              {/* ID Card Window Bottom Action Bar with Pure White Social Icons */}
              <div className="h-13 py-2 bg-[#1c1c1e]/95 border-t border-white/20 px-4 flex items-center justify-between text-xs relative z-20 pointer-events-auto shadow-lg">
                {/* Social Icons Group (Pure White with High-Contrast Badges) */}
                <div className="flex items-center gap-2">
                  {/* GitHub */}
                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 hover:border-white/70 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md group"
                    title="GitHub: Solved-Overnight"
                  >
                    <svg className="w-4 h-4 fill-white text-white drop-shadow" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={SOCIALS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 hover:border-white/70 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md group"
                    title="LinkedIn Profile: mzrishad"
                  >
                    <svg className="w-4 h-4 fill-white text-white drop-shadow" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={SOCIALS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 hover:border-white/70 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md group"
                    title="Twitter / X: @mzrishad"
                  >
                    <svg className="w-3.5 h-3.5 fill-white text-white drop-shadow" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${SOCIALS.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 hover:border-white/70 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md group"
                    title={`WhatsApp: ${SOCIALS.whatsapp}`}
                  >
                    <svg className="w-4 h-4 fill-white text-white drop-shadow" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${SOCIALS.email}`}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 hover:border-white/70 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md group"
                    title={`Email: ${SOCIALS.email}`}
                  >
                    <svg className="w-4 h-4 stroke-white text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </a>
                </div>

                <StarBorder
                  as="button"
                  color="#007aff"
                  speed="4s"
                  thickness={1}
                  onClick={() => {
                    setIsTerminalOpen(true);
                    setIsTerminalMinimized(false);
                    setActiveWindow('terminal');
                    onRunCommand('contact');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#007aff] hover:bg-[#0062cc] text-white transition-all cursor-pointer rounded-lg border border-blue-400/50 shadow-md flex-shrink-0"
                >
                  <span className="text-white font-medium">Contact Me</span>
                </StarBorder>
              </div>
            </div>

            {/* Resize Handles */}
            {!isBadgeMaximized && renderResizeHandles('badge')}
          </div>
        )}

        {/* =============================================================== */}
        {/* WINDOW 2: WINDOWS / MACOS TERMINAL.APP                          */}
        {/* =============================================================== */}
        {isTerminalOpen && (
          <div 
            onClick={() => setActiveWindow('terminal')}
            style={
              isTerminalMaximized
                ? {
                    left: 8,
                    top: 36,
                    right: 8,
                    bottom: 84,
                    width: 'calc(100% - 16px)',
                    height: 'calc(100% - 120px)',
                    transform: isTerminalMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(terminalRect, terminalDockRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 90 : 440);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isTerminalMinimized ? 0 : 1,
                    pointerEvents: isTerminalMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal') ? 'left, top, width, height' : 'auto'
                  }
                : {
                    left: `${terminalRect.x}px`,
                    top: `${terminalRect.y}px`,
                    width: `${terminalRect.width}px`,
                    height: `${terminalRect.height}px`,
                    transform: isTerminalMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(terminalRect, terminalDockRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 90 : 440);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isTerminalMinimized ? 0 : 1,
                    pointerEvents: isTerminalMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal') ? 'left, top, width, height' : 'auto'
                  }
            }
            className={`
              absolute rounded-xl overflow-hidden flex flex-col border
              ${activeWindow === 'terminal' 
                ? 'z-30 border-white/20 shadow-[0_24px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/10' 
                : 'z-20 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] opacity-95'
              }
              bg-[#1c1c1e]/95 backdrop-blur-3xl text-white
            `}
          >
            {/* macOS Title Bar with Traffic Light Controls */}
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'terminal')}
              onDoubleClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
              className="h-9 px-3 bg-[#2c2c2e]/80 border-b border-white/[0.08] flex items-center justify-between select-none cursor-default active:cursor-grabbing relative"
              title="Click & drag to reposition window"
            >
              {/* Traffic Lights */}
              <div className="flex items-center gap-2 group/traffic">
                {/* Close (Red) */}
                <button
                  onClick={() => setIsTerminalOpen(false)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Close"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">×</span>
                </button>
                {/* Minimize (Yellow) */}
                <button
                  onClick={() => setIsTerminalMinimized(true)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Minimize (Into Dock)"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">–</span>
                </button>
                {/* Zoom (Green) */}
                <button
                  onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                  className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Zoom"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">+</span>
                </button>
              </div>

              {/* Title Header */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-medium text-white/80 pointer-events-none truncate max-w-[280px]">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">rishad — -zsh — 80×24 (AI-Workstation)</span>
              </div>

              <div className="w-12" />
            </div>

            {/* Terminal CLI Core Content */}
            <div className="flex-1 overflow-hidden relative">
              <Terminal 
                onOpenProjectsModal={onOpenProjects}
                onOpenBlogsModal={onOpenBlogs}
                onOpenUrlPreview={onOpenUrlPreview}
                onRestart={onRestart}
                onPowerOff={onPowerOff}
                onLogOut={onLogOut}
                commandHistory={commandHistory}
                setCommandHistory={setCommandHistory}
                externalCommand={externalCommand}
                onCommandComplete={onCommandComplete}
                isUndercover={true}
                onToggleUndercover={onToggleUndercover}
                isMobile={false}
              />
            </div>

            {/* Resize Handles */}
            {!isTerminalMaximized && renderResizeHandles('terminal')}
          </div>
        )}

        {/* =============================================================== */}
        {/* WINDOW 3: ABOUT THIS MAC (SYSTEM INFORMATION MODAL)             */}
        {/* =============================================================== */}
        {isAboutMacOpen && (
          <div 
            onClick={() => setActiveWindow('about')}
            style={{
              left: `${aboutMacRect.x}px`,
              top: `${aboutMacRect.y}px`,
              width: `${aboutMacRect.width}px`,
              transform: isAboutMacMinimized
                ? (() => {
                    const delta = getMinimizeDelta(aboutMacRect, aboutDockRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 150 : 380);
                    return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                  })()
                : 'translate3d(0, 0, 0) scale(1, 1)',
              opacity: isAboutMacMinimized ? 0 : 1,
              pointerEvents: isAboutMacMinimized ? 'none' : 'auto',
              transition: (activeDragWindow === 'about' || activeResizeWindow?.id === 'about')
                ? 'none'
                : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className={`
              absolute rounded-2xl overflow-hidden flex flex-col border border-white/20
              ${activeWindow === 'about' ? 'z-40 shadow-[0_24px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/10' : 'z-20'}
              bg-[#1e1e1e]/95 backdrop-blur-3xl text-white font-sans
            `}
          >
            {/* Title Bar */}
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'about')}
              className="h-8 px-3 bg-[#2c2c2e]/80 border-b border-white/[0.08] flex items-center justify-between cursor-default active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2 group/traffic">
                <button
                  onClick={() => setIsAboutMacOpen(false)}
                  className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Close"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">×</span>
                </button>
                <button
                  onClick={() => setIsAboutMacMinimized(true)}
                  className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-[8px] text-black/60 font-bold hover:text-black transition-colors"
                  title="Minimize"
                >
                  <span className="opacity-0 group-hover/traffic:opacity-100">–</span>
                </button>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]/40 border border-[#1AAB29]/40" />
              </div>
              <span className="text-xs font-medium text-white/80">About This Mac</span>
              <div className="w-12" />
            </div>

            {/* About This Mac Hardware Specs Dialog */}
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-white/30 flex items-center justify-center text-white shadow-xl">
                <AppleLogo size={42} className="text-white drop-shadow" />
              </div>

              <div>
                <div className="text-xl font-bold text-white tracking-tight">MacBook Pro</div>
                <div className="text-xs text-zinc-400">16-inch, 2026 • AI Portfolio Workstation</div>
              </div>

              <div className="w-full max-w-sm rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Chip</span>
                  <span className="font-semibold text-white">Apple M3 Max (16-core CPU, 40-core GPU)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Memory</span>
                  <span className="font-semibold text-white">32 GB Unified AI Memory</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Host OS</span>
                  <span className="font-semibold text-cyan-400">Linux Rolling (Undercover)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">macOS</span>
                  <span className="font-semibold text-white">Sequoia 15.2 (24C101)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Engineer</span>
                  <span className="font-semibold text-white">Moniruzzaman Rishad</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onToggleUndercover}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>🐧 Return to Linux OS</span>
                </button>
                <button
                  onClick={() => setIsAboutMacOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {renderResizeHandles('about')}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 5. MACOS RIGHT-CLICK CONTEXT MENU                                 */}
      {/* ================================================================= */}
      {contextMenu && (
        <div 
          ref={contextRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-56 rounded-xl bg-[#1e1e1e]/90 backdrop-blur-3xl border border-white/20 shadow-2xl p-1 text-[13px] text-white animate-fadeIn select-none space-y-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { playUIClickSound(); setContextMenu(null); onOpenBlogs(); }}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
          >
            New Folder
          </button>
          <button 
            onClick={() => { playUIClickSound(); setContextMenu(null); onOpenProjects(); }}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
          >
            Get Info
          </button>

          <div className="h-px bg-white/10 my-1" />

          {/* Change Wallpaper... */}
          <button 
            onClick={handleNextWallpaper}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white flex items-center justify-between transition-colors cursor-default group"
          >
            <span>Change Wallpaper...</span>
            <span className="text-[10px] text-zinc-400 group-hover:text-blue-100">
              {WALLPAPERS[(wallpaperIndex + 1) % WALLPAPERS.length].name.split(' ')[1] || 'Next'}
            </span>
          </button>

          <button 
            onClick={() => { playUIClickSound(); setContextMenu(null); }}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default"
          >
            Clean Up
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button 
            onClick={() => {
              setIsTerminalOpen(true);
              setIsTerminalMinimized(false);
              setActiveWindow('terminal');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default flex items-center gap-2"
          >
            <MacTerminalIcon className="w-4 h-4" />
            <span>Open in Terminal</span>
          </button>

          <button 
            onClick={() => {
              onOpenProjects();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1 rounded-[6px] hover:bg-[#007aff] hover:text-white transition-colors cursor-default flex items-center gap-2"
          >
            <MacCodeIcon className="w-4 h-4" />
            <span>Open Projects Showcase</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          {/* Exit Disguise */}
          <button 
            onClick={() => {
              setContextMenu(null);
              onToggleUndercover();
            }}
            className="w-full text-left px-3 py-1 rounded-[6px] bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500 hover:text-black transition-colors cursor-default flex items-center gap-2"
          >
            <span>🐧</span>
            <span>Exit Disguise (Switch to Linux)</span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. MACOS FLOATING DOCK (ICONIC GLASS SHELF)                       */}
      {/* ================================================================= */}
      <div 
        className="w-full flex justify-center pb-2.5 z-50 pointer-events-none select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto h-16 bg-white/[0.16] dark:bg-black/[0.42] backdrop-blur-3xl border border-white/[0.18] rounded-[24px] px-3.5 py-1.5 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Finder */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsAboutMacOpen(true);
              setIsAboutMacMinimized(false);
              setActiveWindow('about');
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Finder (About This Mac)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Finder
            </div>
            <MacFinderIcon className="w-11 h-11 drop-shadow-lg" />
            <span className="w-1 h-1 rounded-full bg-white/90 absolute -bottom-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_4px_white]" />
          </button>

          {/* Launchpad / Spotlight */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsSpotlightOpen(prev => !prev);
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Launchpad / Spotlight Search"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Launchpad
            </div>
            <div className="w-11 h-11 rounded-[13px] bg-gradient-to-tr from-slate-700 to-slate-500 border border-white/20 flex items-center justify-center text-white drop-shadow-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* Terminal.app */}
          <button
            ref={terminalDockRef}
            onClick={() => {
              playUIClickSound();
              if (isTerminalMinimized) {
                setIsTerminalMinimized(false);
                setActiveWindow('terminal');
              } else if (activeWindow === 'terminal') {
                setIsTerminalMinimized(true);
              } else {
                setActiveWindow('terminal');
              }
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Terminal (Click to Minimize / Restore)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Terminal
            </div>
            <MacTerminalIcon className="w-11 h-11 drop-shadow-lg" />
            {isTerminalOpen && (
              <span className={`w-1 h-1 rounded-full absolute -bottom-0.5 left-1/2 -translate-x-1/2 transition-colors ${isTerminalMinimized ? 'bg-zinc-500' : 'bg-white shadow-[0_0_4px_white]'}`} />
            )}
          </button>

          {/* Employee ID / Contacts */}
          <button
            ref={badgeDockRef}
            onClick={() => {
              playUIClickSound();
              if (isBadgeMinimized) {
                setIsBadgeMinimized(false);
                setActiveWindow('badge');
              } else if (activeWindow === 'badge') {
                setIsBadgeMinimized(true);
              } else {
                setActiveWindow('badge');
              }
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Contacts / Employee ID Card"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Contacts (ID Card)
            </div>
            <MacContactsIcon className="w-11 h-11 drop-shadow-lg" />
            {isBadgeOpen && (
              <span className={`w-1 h-1 rounded-full absolute -bottom-0.5 left-1/2 -translate-x-1/2 transition-colors ${isBadgeMinimized ? 'bg-zinc-500' : 'bg-white shadow-[0_0_4px_white]'}`} />
            )}
          </button>

          {/* Safari (URL Preview) */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenUrlPreview();
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Safari (Share & URL Preview)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Safari
            </div>
            <MacSafariIcon className="w-11 h-11 drop-shadow-lg" />
          </button>

          {/* Xcode / Projects Showcase */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenProjects();
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Xcode (Projects Showcase)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Projects Showcase
            </div>
            <MacCodeIcon className="w-11 h-11 drop-shadow-lg" />
          </button>

          {/* Notes (Blogs & Research) */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenBlogs();
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Notes (Articles & Blogs)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Notes (Blogs)
            </div>
            <MacNotesIcon className="w-11 h-11 drop-shadow-lg" />
          </button>

          {/* System Settings */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenSettings();
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="System Settings"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              System Settings
            </div>
            <MacSettingsIcon className="w-11 h-11 drop-shadow-lg" />
          </button>

          {/* Dock Separator */}
          <div className="h-8 w-px bg-white/20 mx-1" />

          {/* Exit Undercover Disguise Icon */}
          <button
            onClick={() => {
              playEnterSound();
              onToggleUndercover();
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Exit Disguise (Switch back to Linux)"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-cyan-300 text-[11px] font-bold backdrop-blur-md shadow-lg border border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Exit Disguise 🐧
            </div>
            <div className="w-11 h-11 rounded-[13px] bg-gradient-to-tr from-cyan-600 to-blue-700 border border-cyan-400/50 flex items-center justify-center text-white drop-shadow-lg">
              <span className="text-2xl">🐧</span>
            </div>
          </button>

          {/* Trash */}
          <button
            onClick={() => {
              playUIClickSound();
              setToastMessage('🗑️ Trash is empty');
            }}
            className="relative group p-1 transition-transform hover:-translate-y-2 hover:scale-115 active:scale-95 duration-200 cursor-pointer"
            title="Trash"
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-[6px] bg-[#1e1e1e]/90 text-white text-[11px] font-medium backdrop-blur-md shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Trash
            </div>
            <MacTrashIcon className="w-11 h-11 drop-shadow-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MacOSDesktop;

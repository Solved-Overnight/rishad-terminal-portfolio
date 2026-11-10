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
  Square, 
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
  ChevronUp,
  ChevronRight,
  ExternalLink,
  Download,
  Terminal as TerminalIcon,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Grid,
  Layers,
  Layout,
  ArrowRight,
  Sparkles
} from 'lucide-react';

/* ========================================================================= */
/* WINDOWS 11 BRAND ICONS (AUTHENTIC SVG PATHS)                              */
/* ========================================================================= */

// Windows 11 4-Square Logo
export const Win11Logo: React.FC<{ className?: string; size?: number }> = ({ className = "w-4 h-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path fill="#0078d4" d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.551L24 0v11.551H10.949V1.898zM0 12.6h9.75v9.451L0 20.7V12.6zm10.949 0H24V24l-13.051-1.898V12.6z"/>
  </svg>
);

// Windows 11 File Explorer Icon
export const Win11ExplorerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <path d="M3 8a3 3 0 013-3h6.586a2 2 0 011.414.586l2.414 2.414A2 2 0 0017.828 9H26a3 3 0 013 3v13a3 3 0 01-3 3H6a3 3 0 01-3-3V8z" fill="#F9A825"/>
    <path d="M3 13a2 2 0 012-2h22a2 2 0 012 2v12a3 3 0 01-3 3H6a3 3 0 01-3-3V13z" fill="#FBC02D"/>
    <path d="M6 11h20a2 2 0 012 2v2H4v-2a2 2 0 012-2z" fill="#FFF59D" fillOpacity="0.8"/>
  </svg>
);

// Microsoft Edge Icon
export const Win11EdgeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#0078d4" />
    <path d="M16 4C9.373 4 4 9.373 4 16c0 5.15 3.242 9.537 7.807 11.238-.172-.888-.266-1.808-.266-2.748 0-4.664 2.822-8.675 6.883-10.373A7.962 7.962 0 0116 12c4.418 0 8 3.582 8 8 0 .807-.12 1.585-.343 2.317C26.31 20.697 28 17.55 28 14c0-5.523-5.373-10-12-10z" fill="#00C7FD"/>
    <path d="M16 12a8 8 0 00-7.859 9.49A9.957 9.957 0 0016 26c5.523 0 10-4.477 10-10 0-.807-.12-1.585-.343-2.317A7.966 7.966 0 0016 12z" fill="#0BD897" fillOpacity="0.85"/>
  </svg>
);

// Windows Terminal Icon
export const Win11TerminalIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="7" fill="#1e1e1e"/>
    <path d="M8 11l6 5-6 5" stroke="#4af626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21h7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// VS Code Icon
export const Win11VSCodeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="7" fill="#0066b8"/>
    <path d="M24.5 5.5l-6 5.5 6 6-18-8.5 7.5-3 10.5 0z" fill="#007acc" opacity="0.4"/>
    <path d="M24.5 26.5l-6-5.5 6-6-18 8.5 7.5 3 10.5 0z" fill="#007acc" opacity="0.4"/>
    <path d="M6.5 13.5l6-3.5 12 16.5-6 5.5-12-18.5z" fill="#1f9cf0"/>
    <path d="M6.5 18.5l6 3.5 12-16.5-6-5.5-12 18.5z" fill="#007acc"/>
  </svg>
);

// This PC Computer Icon
export const Win11ComputerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <rect x="3" y="4" width="26" height="18" rx="2" fill="#0078d4" />
    <rect x="5" y="6" width="22" height="14" rx="1" fill="#e1dfdd" />
    <path d="M12 25h8M16 22v3" stroke="#0078d4" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Recycle Bin Icon
export const Win11RecycleBinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <path d="M7 10h18l-1.5 17a3 3 0 01-3 2.7H11.5A3 3 0 018.5 27L7 10z" fill="#89d3df"/>
    <path d="M5 8h22M12 5h8" stroke="#0078d4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 14v10M16 14v10M20 14v10" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// PDF Document Icon
export const Win11PdfIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <rect x="5" y="3" width="22" height="26" rx="2" fill="#e53935"/>
    <path d="M19 3v8h8" fill="#b71c1c"/>
    <path d="M19 3l8 8H19V3z" fill="#ffcdd2" opacity="0.6"/>
    <text x="16" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PDF</text>
  </svg>
);

// Task View / Desktops Icon
export const Win11TaskViewIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <rect x="3" y="5" width="12" height="12" rx="2" />
    <rect x="9" y="8" width="12" height="12" rx="2" strokeOpacity="0.7" />
  </svg>
);

/* ========================================================================= */
/* WALLPAPER PRESETS                                                         */
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
    id: 'bloom',
    name: 'Windows 11 Bloom Dark',
    type: 'image',
    src: '/img/win11_bloom_wallpaper.jpg'
  },
  {
    id: 'glow',
    name: 'Windows 11 Glow Flow Ribbons',
    type: 'image',
    src: '/img/win11_glow_wallpaper.jpg'
  },
  {
    id: 'sunrise',
    name: 'Windows 11 Sunrise Amber Bloom',
    type: 'image',
    src: '/img/win11_sunrise_wallpaper.jpg'
  },
  {
    id: 'midnight',
    name: 'Windows 11 Midnight Cyber Slate',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 25%, #1e1b4b 0%, #0f172a 50%, #020617 100%)'
  },
  {
    id: 'emerald',
    name: 'Windows 11 Emerald Aurora',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 25%, #064e3b 0%, #022c22 55%, #020617 100%)'
  }
];

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getInitialRect = (
  key: string,
  defaultRect: WindowRect,
  minWidth = 220,
  minHeight = 240
): WindowRect => {
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem(key);
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
            y: Math.max(0, Math.min(window.innerHeight - 100, parsed.y)),
            width: Math.max(minWidth, Math.min(window.innerWidth - 16, parsed.width)),
            height: Math.max(minHeight, Math.min(window.innerHeight - 58, parsed.height))
          };
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }
  return defaultRect;
};

const getWin11SplitDefaults = (): { badge: WindowRect; terminal: WindowRect } => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const h = typeof window !== 'undefined' ? window.innerHeight : 720;
  const top = 10;
  const bottomTaskbar = 58;
  const marginX = 12;
  const gap = 8;
  const defaultHeight = Math.max(320, h - top - bottomTaskbar);
  const availableWidth = Math.max(540, w - marginX * 2 - gap);
  const badgeWidth = Math.max(220, Math.floor(availableWidth * 0.20));
  const terminalWidth = Math.max(320, availableWidth - badgeWidth);

  return {
    badge: { x: marginX, y: top, width: badgeWidth, height: defaultHeight },
    terminal: { x: marginX + badgeWidth + gap, y: top, width: terminalWidth, height: defaultHeight }
  };
};

interface Win11WindowStates {
  isTerminalOpen: boolean;
  isTerminalMinimized: boolean;
  isTerminalMaximized: boolean;
  isBadgeOpen: boolean;
  isBadgeMinimized: boolean;
  isBadgeMaximized: boolean;
  isThisPCOpen: boolean;
  isThisPCMinimized: boolean;
  isThisPCMaximized: boolean;
}

const getInitialWindowStates = (): Win11WindowStates => {
  const defaults: Win11WindowStates = {
    isTerminalOpen: true,
    isTerminalMinimized: false,
    isTerminalMaximized: false,
    isBadgeOpen: true,
    isBadgeMinimized: false,
    isBadgeMaximized: false,
    isThisPCOpen: false,
    isThisPCMinimized: false,
    isThisPCMaximized: false,
  };
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('win11_window_states');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaults, ...parsed };
        }
      }
    } catch {}
  }
  return defaults;
};

interface Windows11DesktopProps {
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
  onTriggerSwarm?: () => void;
  commandHistory: HistoryItem[];
  setCommandHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  externalCommand?: string | null;
  onCommandComplete?: () => void;
}

export const Windows11Desktop: React.FC<Windows11DesktopProps> = ({
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
  onTriggerSwarm,
  commandHistory,
  setCommandHistory,
  externalCommand,
  onCommandComplete,
}) => {
  const { currentTheme, setTheme } = useTheme();

  // Desktop State
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);
  const [desktopIconSize, setDesktopIconSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Wallpaper index state
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('win11_wallpaper_idx');
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < WALLPAPERS.length) return idx;
      }
    }
    return 0;
  });

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(() => getSoundSettings().enabled);
  const [volume, setVolume] = useState(() => getSoundSettings().volume);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<'view' | 'sort' | 'new' | null>(null);

  // Windows 11 Windows Open/Minimized/Maximized States (retained in sessionStorage across OS switches, cleared on reload)
  const [initialStates] = useState<Win11WindowStates>(() => getInitialWindowStates());
  const [isTerminalOpen, setIsTerminalOpen] = useState(initialStates.isTerminalOpen);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(initialStates.isTerminalMinimized);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(initialStates.isTerminalMaximized);

  const [isBadgeOpen, setIsBadgeOpen] = useState(initialStates.isBadgeOpen);
  const [isBadgeMinimized, setIsBadgeMinimized] = useState(initialStates.isBadgeMinimized);
  const [isBadgeMaximized, setIsBadgeMaximized] = useState(initialStates.isBadgeMaximized);

  const [isThisPCOpen, setIsThisPCOpen] = useState(initialStates.isThisPCOpen);
  const [isThisPCMinimized, setIsThisPCMinimized] = useState(initialStates.isThisPCMinimized);
  const [isThisPCMaximized, setIsThisPCMaximized] = useState(initialStates.isThisPCMaximized);

  // Snap layout menu hover state for windows
  const [snapHoverWindow, setSnapHoverWindow] = useState<'terminal' | 'badge' | 'thispc' | null>(null);

  // Window Focus order
  const [activeWindow, setActiveWindow] = useState<'terminal' | 'badge' | 'thispc'>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('win11_active_window');
      if (saved === 'terminal' || saved === 'badge' || saved === 'thispc') return saved;
    }
    return 'terminal';
  });

  // Persist window open/minimized/maximized/active states in sessionStorage during the session
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'win11_window_states',
        JSON.stringify({
          isTerminalOpen,
          isTerminalMinimized,
          isTerminalMaximized,
          isBadgeOpen,
          isBadgeMinimized,
          isBadgeMaximized,
          isThisPCOpen,
          isThisPCMinimized,
          isThisPCMaximized,
        })
      );
    } catch {}
  }, [
    isTerminalOpen,
    isTerminalMinimized,
    isTerminalMaximized,
    isBadgeOpen,
    isBadgeMinimized,
    isBadgeMaximized,
    isThisPCOpen,
    isThisPCMinimized,
    isThisPCMaximized,
  ]);

  useEffect(() => {
    try {
      sessionStorage.setItem('win11_active_window', activeWindow);
    } catch {}
  }, [activeWindow]);

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

  // Window Geometry States: Default 20% ID Badge & 80% Terminal on reload, persisted in sessionStorage during session
  const [badgeRect, setBadgeRect] = useState<WindowRect>(() =>
    getInitialRect('win11_badge_geometry', getWin11SplitDefaults().badge, 220, 240)
  );

  const [terminalRect, setTerminalRect] = useState<WindowRect>(() =>
    getInitialRect('win11_terminal_geometry', getWin11SplitDefaults().terminal, 320, 240)
  );

  const [thisPCRect, setThisPCRect] = useState<WindowRect>(() =>
    getInitialRect(
      'win11_thispc_geometry',
      {
        x: typeof window !== 'undefined' ? Math.max(20, Math.floor((window.innerWidth - 540) / 2)) : 200,
        y: typeof window !== 'undefined' ? Math.max(40, Math.floor((window.innerHeight - 540) / 2)) : 100,
        width: 540,
        height: 520
      },
      320,
      240
    )
  );

  // Dragging & Resizing States
  const [activeDragWindow, setActiveDragWindow] = useState<'terminal' | 'badge' | 'thispc' | null>(null);
  const [activeResizeWindow, setActiveResizeWindow] = useState<{
    id: 'terminal' | 'badge' | 'thispc';
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

  // Current rect refs to avoid stale closures in event listeners
  const currentTerminalRectRef = useRef(terminalRect);
  currentTerminalRectRef.current = terminalRect;
  const currentBadgeRectRef = useRef(badgeRect);
  currentBadgeRectRef.current = badgeRect;
  const currentThisPCRectRef = useRef(thisPCRect);
  currentThisPCRectRef.current = thisPCRect;

  // Taskbar button references to target for macOS-style fluid minimize effect
  const terminalTaskbarRef = useRef<HTMLButtonElement>(null);
  const badgeTaskbarRef = useRef<HTMLButtonElement>(null);
  const thisPCTaskbarRef = useRef<HTMLButtonElement>(null);

  const startRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

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

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (startRef.current && !startRef.current.contains(target)) {
        setIsStartOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(target)) {
        setIsQuickSettingsOpen(false);
      }
      if (calRef.current && !calRef.current.contains(target)) {
        setIsCalendarOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (contextRef.current && !contextRef.current.contains(target)) {
        setContextMenu(null);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent any browser viewport or document scroll jumps
  useEffect(() => {
    const lockScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };
    window.addEventListener('scroll', lockScroll, { passive: true });
    return () => window.removeEventListener('scroll', lockScroll);
  }, []);

  // Save geometries to sessionStorage (resets on page reload / reboot)
  const saveGeometry = useCallback((id: 'terminal' | 'badge' | 'thispc', rect: WindowRect) => {
    try {
      sessionStorage.setItem(`win11_${id}_geometry`, JSON.stringify(rect));
    } catch {}
  }, []);

  // Global window listeners for 100% smooth, uninterrupted drag and resize
  useEffect(() => {
    if (!activeDragWindow && !activeResizeWindow) return;

    // Prevent text selection during drag/resize
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (activeDragWindow) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const newX = Math.max(-200, Math.min(screenW - 80, dragStartRef.current.startX + dx));
        const newY = Math.max(0, Math.min(screenH - 70, dragStartRef.current.startY + dy));

        if (activeDragWindow === 'terminal') {
          setTerminalRect(prev => ({ ...prev, x: newX, y: newY }));
        } else if (activeDragWindow === 'badge') {
          setBadgeRect(prev => ({ ...prev, x: newX, y: newY }));
        } else if (activeDragWindow === 'thispc') {
          setThisPCRect(prev => ({ ...prev, x: newX, y: newY }));
        }
      } else if (activeResizeWindow) {
        const { id, handle } = activeResizeWindow;
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;
        const init = resizeStartRef.current.rect;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const minW = id === 'terminal' ? 320 : id === 'badge' ? 220 : 320;
        const minH = 240;

        let newX = init.x;
        let newY = init.y;
        let newW = init.width;
        let newH = init.height;

        // Horizontal: East
        if (handle.includes('e')) {
          newW = Math.max(minW, Math.min(screenW - init.x - 8, init.width + dx));
        }
        // Horizontal: West
        if (handle.includes('w')) {
          const proposedW = init.width - dx;
          if (proposedW >= minW && init.x + dx >= 0) {
            newW = proposedW;
            newX = init.x + dx;
          }
        }

        // Vertical: South
        if (handle.includes('s')) {
          newH = Math.max(minH, Math.min(screenH - init.y - 56, init.height + dy));
        }
        // Vertical: North
        if (handle.includes('n')) {
          const proposedH = init.height - dy;
          if (proposedH >= minH && init.y + dy >= 0) {
            newH = proposedH;
            newY = init.y + dy;
          }
        }

        const updated = { x: newX, y: newY, width: newW, height: newH };
        if (id === 'terminal') setTerminalRect(updated);
        else if (id === 'badge') setBadgeRect(updated);
        else if (id === 'thispc') setThisPCRect(updated);
      }
    };

    const handleGlobalPointerUp = () => {
      if (activeDragWindow) {
        if (activeDragWindow === 'terminal') saveGeometry('terminal', currentTerminalRectRef.current);
        if (activeDragWindow === 'badge') saveGeometry('badge', currentBadgeRectRef.current);
        if (activeDragWindow === 'thispc') saveGeometry('thispc', currentThisPCRectRef.current);
        setActiveDragWindow(null);
      }
      if (activeResizeWindow) {
        if (activeResizeWindow.id === 'terminal') saveGeometry('terminal', currentTerminalRectRef.current);
        if (activeResizeWindow.id === 'badge') saveGeometry('badge', currentBadgeRectRef.current);
        if (activeResizeWindow.id === 'thispc') saveGeometry('thispc', currentThisPCRectRef.current);
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

  // Next Desktop Wallpaper Handler
  const handleNextWallpaper = () => {
    playUIClickSound();
    setWallpaperIndex((prev) => {
      const next = (prev + 1) % WALLPAPERS.length;
      localStorage.setItem('win11_wallpaper_idx', next.toString());
      setToastMessage(`🖼️ Background: ${WALLPAPERS[next].name}`);
      return next;
    });
    setContextMenu(null);
    setActiveSubmenu(null);
  };

  // Dragging initiation
  const handleStartDrag = (e: React.PointerEvent, windowId: 'terminal' | 'badge' | 'thispc') => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return;
    }

    setActiveWindow(windowId);

    // If maximized, restore on drag
    if (windowId === 'terminal' && isTerminalMaximized) setIsTerminalMaximized(false);
    if (windowId === 'badge' && isBadgeMaximized) setIsBadgeMaximized(false);
    if (windowId === 'thispc' && isThisPCMaximized) setIsThisPCMaximized(false);

    let initialX = 0;
    let initialY = 0;
    if (windowId === 'terminal') {
      initialX = terminalRect.x;
      initialY = terminalRect.y;
    } else if (windowId === 'badge') {
      initialX = badgeRect.x;
      initialY = badgeRect.y;
    } else if (windowId === 'thispc') {
      initialX = thisPCRect.x;
      initialY = thisPCRect.y;
    }

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: initialX,
      startY: initialY
    };

    setActiveDragWindow(windowId);
  };

  // Resizing initiation (Smooth across all 8 directions)
  const handleStartResize = (e: React.PointerEvent, windowId: 'terminal' | 'badge' | 'thispc', handle: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setActiveWindow(windowId);

    if (windowId === 'terminal' && isTerminalMaximized) setIsTerminalMaximized(false);
    if (windowId === 'badge' && isBadgeMaximized) setIsBadgeMaximized(false);
    if (windowId === 'thispc' && isThisPCMaximized) setIsThisPCMaximized(false);

    let initialRect = terminalRect;
    if (windowId === 'badge') initialRect = badgeRect;
    if (windowId === 'thispc') initialRect = thisPCRect;

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      rect: { ...initialRect }
    };
    setActiveResizeWindow({ id: windowId, handle });
  };

  // Snap Window Action (Native Windows 11 4-Zone Snap Layouts)
  const handleSnap = (windowId: 'terminal' | 'badge' | 'thispc', zone: 'left' | 'right' | 'full' | 'center') => {
    playUIClickSound();
    setSnapHoverWindow(null);
    setActiveWindow(windowId);
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topBar = 8;
    const bottomH = 54;
    const fullHeight = screenH - topBar - bottomH;

    let targetRect: WindowRect;

    if (zone === 'left') {
      targetRect = {
        x: 8,
        y: topBar,
        width: Math.floor(screenW / 2) - 12,
        height: fullHeight
      };
      if (windowId === 'terminal') {
        setIsTerminalMaximized(false);
        setTerminalRect(targetRect);
        saveGeometry('terminal', targetRect);
      } else if (windowId === 'badge') {
        setIsBadgeMaximized(false);
        setBadgeRect(targetRect);
        saveGeometry('badge', targetRect);
      } else {
        setIsThisPCMaximized(false);
        setThisPCRect(targetRect);
        saveGeometry('thispc', targetRect);
      }
    } else if (zone === 'right') {
      targetRect = {
        x: Math.floor(screenW / 2) + 4,
        y: topBar,
        width: Math.floor(screenW / 2) - 12,
        height: fullHeight
      };
      if (windowId === 'terminal') {
        setIsTerminalMaximized(false);
        setTerminalRect(targetRect);
        saveGeometry('terminal', targetRect);
      } else if (windowId === 'badge') {
        setIsBadgeMaximized(false);
        setBadgeRect(targetRect);
        saveGeometry('badge', targetRect);
      } else {
        setIsThisPCMaximized(false);
        setThisPCRect(targetRect);
        saveGeometry('thispc', targetRect);
      }
    } else if (zone === 'center') {
      targetRect = {
        x: Math.floor(screenW * 0.15),
        y: topBar + 16,
        width: Math.floor(screenW * 0.7),
        height: fullHeight - 32
      };
      if (windowId === 'terminal') {
        setIsTerminalMaximized(false);
        setTerminalRect(targetRect);
        saveGeometry('terminal', targetRect);
      } else if (windowId === 'badge') {
        setIsBadgeMaximized(false);
        setBadgeRect(targetRect);
        saveGeometry('badge', targetRect);
      } else {
        setIsThisPCMaximized(false);
        setThisPCRect(targetRect);
        saveGeometry('thispc', targetRect);
      }
    } else if (zone === 'full') {
      if (windowId === 'terminal') setIsTerminalMaximized(true);
      else if (windowId === 'badge') setIsBadgeMaximized(true);
      else setIsThisPCMaximized(true);
    }
  };

  // Calculate macOS-Style Fluid minimize delta toward taskbar icon
  const getMinimizeDelta = (rect: WindowRect, ref: React.RefObject<HTMLButtonElement | null>, fallbackX: number) => {
    let taskbarX = fallbackX;
    let taskbarY = typeof window !== 'undefined' ? window.innerHeight - 24 : 700;

    if (ref.current) {
      const b = ref.current.getBoundingClientRect();
      taskbarX = b.left + b.width / 2;
      taskbarY = b.top + b.height / 2;
    }

    const windowCenterX = rect.x + rect.width / 2;
    const windowCenterY = rect.y + rect.height / 2;

    return {
      dx: taskbarX - windowCenterX,
      dy: taskbarY - windowCenterY
    };
  };

  // Handle right click on desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSubmenu(null);
    setContextMenu({ 
      x: Math.min(window.innerWidth - 270, e.clientX), 
      y: Math.min(window.innerHeight - 380, e.clientY) 
    });
  };

  const handleRefresh = () => {
    playUIClickSound();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
    setContextMenu(null);
    setActiveSubmenu(null);
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });

  const toggleSound = () => {
    playUIClickSound();
    const updated = saveSoundSettings({ enabled: !soundEnabled });
    setSoundEnabled(updated.enabled);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    saveSoundSettings({ volume: newVol });
  };

  // Desktop Icons Configuration
  const desktopIcons = [
    {
      id: 'thispc',
      name: 'This PC',
      icon: <Win11ComputerIcon className="w-10 h-10 drop-shadow-md" />,
      action: () => {
        setIsThisPCOpen(true);
        setIsThisPCMinimized(false);
        setActiveWindow('thispc');
      }
    },
    {
      id: 'terminal',
      name: 'Windows Terminal',
      icon: <Win11TerminalIcon className="w-10 h-10 drop-shadow-md" />,
      action: () => {
        setIsTerminalOpen(true);
        setIsTerminalMinimized(false);
        setActiveWindow('terminal');
      }
    },
    {
      id: 'badge',
      name: 'Employee ID Card',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
          <span className="font-bold text-xs tracking-wider">ID</span>
        </div>
      ),
      action: () => {
        setIsBadgeOpen(true);
        setIsBadgeMinimized(false);
        setActiveWindow('badge');
      }
    },
    {
      id: 'projects',
      name: 'Projects Showcase',
      icon: <Win11VSCodeIcon className="w-10 h-10 drop-shadow-md" />,
      action: onOpenProjects
    },
    {
      id: 'explorer',
      name: 'File Explorer (Blogs)',
      icon: <Win11ExplorerIcon className="w-10 h-10 drop-shadow-md" />,
      action: () => onOpenBlogs()
    },
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: <Win11EdgeIcon className="w-10 h-10 drop-shadow-md" />,
      action: onOpenUrlPreview
    },
    {
      id: 'resume',
      name: 'Rishad_Resume.pdf',
      icon: <Win11PdfIcon className="w-10 h-10 drop-shadow-md" />,
      action: onDownloadResume
    },
    {
      id: 'recycle',
      name: 'Recycle Bin',
      icon: <Win11RecycleBinIcon className="w-10 h-10 drop-shadow-md" />,
      action: () => {
        playUIClickSound();
      }
    },
    {
      id: 'undercover',
      name: 'linux-undercover.exe',
      badge: 'Exit Disguise',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg border border-cyan-400/50 hover:scale-105 transition-transform">
          <span className="text-xl">🐧</span>
        </div>
      ),
      action: onToggleUndercover
    }
  ];

  // Helper to render all 8 resize handles for a window
  const renderResizeHandles = (id: 'terminal' | 'badge' | 'thispc') => (
    <>
      {/* 4 Edges (Generous 8px Hitbox) */}
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'n')}
        className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-40" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 's')}
        className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-40" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'w')}
        className="absolute top-3 bottom-3 left-0 w-2 cursor-ew-resize z-40" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'e')}
        className="absolute top-3 bottom-3 right-0 w-2 cursor-ew-resize z-40" 
        title="Resize"
      />

      {/* 4 Corners (Generous 14px Hitbox) */}
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'nw')}
        className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-50" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'ne')}
        className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-50" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'sw')}
        className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-50" 
        title="Resize"
      />
      <div 
        onPointerDown={(e) => handleStartResize(e, id, 'se')}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5" 
        title="Resize window"
      >
        <div className="w-2 h-2 border-r-[1.5px] border-b-[1.5px] border-white/40" />
      </div>
    </>
  );

  const activeWallpaper = WALLPAPERS[wallpaperIndex] || WALLPAPERS[0];

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden select-none text-white bg-black z-40 flex flex-col justify-between"
      style={{
        fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif",
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
        setSelectedDesktopIcon(null);
        setContextMenu(null);
        setActiveSubmenu(null);
        setSnapHoverWindow(null);
        if (typeof window !== 'undefined') {
          if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
          if (document.documentElement.scrollTop !== 0) document.documentElement.scrollTop = 0;
          if (document.body.scrollTop !== 0) document.body.scrollTop = 0;
        }
      }}
    >
      {/* Subtle Ambient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Windows 11 Action Center Notification Banner */}
      {toastMessage && (
        <div 
          role="alert"
          aria-live="polite"
          className="fixed bottom-14 sm:bottom-16 right-4 sm:right-6 z-[150] w-[360px] max-w-[calc(100vw-2rem)] select-none font-sans animate-slideIn"
        >
          <div className="bg-[#202020]/95 backdrop-blur-2xl border border-white/15 rounded-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-3.5 text-white flex flex-col gap-2 transition-all">
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#0078d7] flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                    <path d="M0 2.25L6.5 1.35V7.5H0V2.25ZM7.5 1.21L16 0V7.5H7.5V1.21ZM0 8.5H6.5V14.65L0 13.75V8.5ZM7.5 8.5H16V16L7.5 14.79V8.5Z"/>
                  </svg>
                </div>
                <span className="font-semibold text-white/90 text-xs">Windows System</span>
                <span className="text-white/40">·</span>
                <span className="text-white/50 text-[10px]">Just now</span>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-default text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col pl-6 pr-2">
              <span className="text-[13px] font-semibold text-white leading-snug">
                {toastMessage.includes(':') ? toastMessage.split(':')[0] : 'System Notification'}
              </span>
              <span className="text-[12px] text-white/80 leading-normal mt-0.5">
                {toastMessage.includes(':') ? toastMessage.split(':').slice(1).join(':').trim() : toastMessage}
              </span>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setToastMessage(null)}
                className="px-2.5 py-1 rounded-[4px] bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-medium text-white/90 border border-white/10 transition-colors cursor-default"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. DESKTOP WORKSPACE AREA (ICONS + FLOATING WINDOWS)               */}
      {/* ================================================================= */}
      <div 
        className="flex-1 w-full relative p-4 overflow-hidden"
        onScroll={(e) => {
          e.currentTarget.scrollTop = 0;
          e.currentTarget.scrollLeft = 0;
        }}
      >
        
        {/* Desktop Icons Grid (Left Column) */}
        <div data-rebuild="icons" className={`absolute top-4 left-4 flex flex-col flex-wrap gap-2 max-h-[calc(100vh-80px)] z-10 w-fit transition-opacity duration-200 ${isRefreshing ? 'opacity-30 scale-95' : 'opacity-100'}`}>
          {desktopIcons.map((icon) => {
            const isSelected = selectedDesktopIcon === icon.id;
            return (
              <button
                key={icon.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDesktopIcon(icon.id);
                  playUIClickSound();
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  playEnterSound();
                  icon.action();
                }}
                className={`
                  ${desktopIconSize === 'small' ? 'w-20 p-1.5' : desktopIconSize === 'large' ? 'w-28 p-2.5' : 'w-24 p-2'}
                  rounded-[4px] flex flex-col items-center text-center gap-1.5 transition-colors group cursor-default border
                  ${isSelected 
                    ? 'bg-white/[0.18] border-white/[0.28] shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.08] hover:border-white/[0.12]'
                  }
                `}
                title={`${icon.name} (Double-click to open)`}
              >
                <div className="relative">
                  {icon.icon}
                  {icon.badge && (
                    <span className="absolute -top-1 -right-2 text-[8px] bg-cyan-500 text-black px-1 rounded-[2px] font-bold font-mono shadow-sm">
                      LINUX
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] font-normal leading-snug text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2">
                  {icon.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* =============================================================== */}
        {/* WINDOW 1: EMPLOYEE ID BADGE VIEWER WINDOW                       */}
        {/* =============================================================== */}
        {isBadgeOpen && (
          <div 
            data-rebuild="id-card"
            onClick={() => setActiveWindow('badge')}
            style={
              isBadgeMaximized 
                ? { 
                    left: 8, 
                    top: 8, 
                    right: 8, 
                    bottom: 54, 
                    width: 'calc(100% - 16px)', 
                    height: 'calc(100% - 62px)',
                    transform: isBadgeMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(badgeRect, badgeTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 + 15 : 600);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isBadgeMinimized ? 0 : 1,
                    visibility: isBadgeMinimized ? 'hidden' : 'visible',
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
                          const delta = getMinimizeDelta(badgeRect, badgeTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 + 15 : 600);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isBadgeMinimized ? 0 : 1,
                    visibility: isBadgeMinimized ? 'hidden' : 'visible',
                    pointerEvents: isBadgeMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'badge' || activeResizeWindow?.id === 'badge') ? 'left, top, width, height' : 'auto'
                  }
            }
            className={`
              absolute rounded-[8px] overflow-hidden flex flex-col border
              ${activeWindow === 'badge' 
                ? 'z-30 border-white/[0.22] shadow-[0_24px_54px_rgba(0,0,0,0.65)] ring-1 ring-white/10' 
                : 'z-20 border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.4)] opacity-95'
              }
              bg-[#1f2430]/95 backdrop-blur-2xl text-white
            `}
          >
            {/* Windows 11 Title Bar - Draggable */}
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'badge')}
              onDoubleClick={() => setIsBadgeMaximized(!isBadgeMaximized)}
              className="h-8 px-3 bg-[#191d28]/95 border-b border-white/[0.08] flex items-center justify-between select-none cursor-default active:cursor-grabbing relative"
              title="Click & drag to reposition window"
            >
              <div className="flex items-center gap-2 text-xs font-normal text-white/90 truncate pointer-events-none">
                <span className="w-3.5 h-3.5 rounded bg-blue-500 flex items-center justify-center text-[9px] font-bold">ID</span>
                <span className="truncate">Employee Profile - Moniruzzaman Rishad</span>
              </div>

              {/* Windows 11 Window Controls */}
              <div className="flex items-center -mr-3 pointer-events-auto h-full relative">
                <button 
                  onClick={() => setIsBadgeMinimized(true)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setSnapHoverWindow('badge')}
                  onMouseLeave={() => setSnapHoverWindow(null)}
                >
                  <button 
                    onClick={() => setIsBadgeMaximized(!isBadgeMaximized)}
                    className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                    title={isBadgeMaximized ? "Restore" : "Maximize (Hover for Snap Layouts)"}
                  >
                    <Square className="w-3 h-3" />
                  </button>

                  {/* Windows 11 Snap Layouts Flyout */}
                  {snapHoverWindow === 'badge' && (
                    <div className="absolute top-full right-0 mt-1 w-44 p-2 bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/20 rounded-[8px] shadow-2xl z-50 animate-fadeIn">
                      <div className="text-[10px] text-zinc-400 font-semibold mb-1.5 px-1">Snap Layouts</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => handleSnap('badge', 'left')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Snap Left (50%)"
                        >
                          <div className="flex-1 w-full flex gap-1">
                            <div className="w-1/2 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                            <div className="w-1/2 h-full border border-dashed border-white/20 rounded-sm" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Left 50%</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('badge', 'right')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Snap Right (50%)"
                        >
                          <div className="flex-1 w-full flex gap-1">
                            <div className="w-1/2 h-full border border-dashed border-white/20 rounded-sm" />
                            <div className="w-1/2 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Right 50%</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('badge', 'center')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Centered Focus"
                        >
                          <div className="flex-1 w-full flex justify-center items-center">
                            <div className="w-3/4 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Center</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('badge', 'full')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Full Screen"
                        >
                          <div className="flex-1 w-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Full</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsBadgeOpen(false)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white text-white/70 transition-colors cursor-default"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content: 3D ID Card Viewer */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-[#141824]/60">
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <IdCard />
              </div>

              {/* ID Card Window Bottom Action Bar with Official Social Icons */}
              {(() => {
                const badgeW = isBadgeMaximized ? (typeof window !== 'undefined' ? window.innerWidth : 800) : badgeRect.width;
                const isBadgeNarrow = badgeW < 340;
                return (
              <div className={`${isBadgeNarrow ? 'py-2 px-2.5 flex-col items-center gap-2' : 'h-13 py-2 px-4 flex-row items-center justify-between'} bg-[#161a26]/95 border-t border-white/20 flex text-xs relative z-20 pointer-events-auto shadow-lg`}>
                {/* Social Icons Group (Pure White with Crisp High-Contrast Badges) */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
                  color="#0078d4"
                  speed="4s"
                  thickness={1}
                  onClick={() => {
                    setIsTerminalOpen(true);
                    setIsTerminalMinimized(false);
                    setActiveWindow('terminal');
                    onRunCommand('contact');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#0078d4] hover:bg-[#1084d8] text-white transition-all cursor-pointer rounded-[4px] border border-blue-400/50 shadow-md flex-shrink-0"
                >
                  <span className="text-white font-medium">Contact Me</span>
                </StarBorder>
              </div>
                );
              })()}
            </div>

            {/* Resize Handles for ID Card Window */}
            {!isBadgeMaximized && renderResizeHandles('badge')}
          </div>
        )}

        {/* =============================================================== */}
        {/* WINDOW 2: WINDOWS TERMINAL (POWERSHELL)                         */}
        {/* =============================================================== */}
        {isTerminalOpen && (
          <div 
            data-rebuild="terminal"
            onClick={() => setActiveWindow('terminal')}
            style={
              isTerminalMaximized 
                ? { 
                    left: 8, 
                    top: 8, 
                    right: 8, 
                    bottom: 54, 
                    width: 'calc(100% - 16px)', 
                    height: 'calc(100% - 62px)',
                    transform: isTerminalMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(terminalRect, terminalTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 45 : 500);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isTerminalMinimized ? 0 : 1,
                    visibility: isTerminalMinimized ? 'hidden' : 'visible',
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
                          const delta = getMinimizeDelta(terminalRect, terminalTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 45 : 500);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isTerminalMinimized ? 0 : 1,
                    visibility: isTerminalMinimized ? 'hidden' : 'visible',
                    pointerEvents: isTerminalMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease',
                    willChange: (activeDragWindow === 'terminal' || activeResizeWindow?.id === 'terminal') ? 'left, top, width, height' : 'auto'
                  }
            }
            className={`
              absolute rounded-[8px] overflow-hidden flex flex-col border
              ${activeWindow === 'terminal' 
                ? 'z-30 border-white/[0.22] shadow-[0_24px_54px_rgba(0,0,0,0.65)] ring-1 ring-white/10' 
                : 'z-20 border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.4)] opacity-95'
              }
              bg-[#12151f]/95 backdrop-blur-2xl text-white
            `}
          >
            {/* Windows Terminal Title Bar (Fluent Chrome) */}
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'terminal')}
              onDoubleClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
              className="h-8 bg-[#191d28]/95 border-b border-white/[0.08] flex items-center justify-between select-none cursor-default active:cursor-grabbing relative"
              title="Click & drag to reposition window"
            >
              {/* Tab Header (PowerShell & Bash Tabs) */}
              <div className="flex items-center h-full pl-2 gap-1 overflow-hidden pointer-events-none">
                <div className="h-7 px-3 rounded-t-[6px] bg-[#12151f] border-t border-x border-white/10 flex items-center gap-2 text-xs font-normal text-white">
                  <Win11TerminalIcon className="w-3.5 h-3.5" />
                  <span className="truncate">Windows PowerShell (AI-RIG)</span>
                </div>
              </div>

              {/* Windows 11 Window Controls */}
              <div className="flex items-center h-full pointer-events-auto relative">
                {/* Rebuild Icon on the left of minimize button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playUIClickSound();
                    onTriggerSwarm?.();
                  }}
                  className="h-6 px-2 mr-1 rounded-[4px] bg-cyan-500/15 hover:bg-cyan-500 hover:text-black border border-cyan-400/30 text-cyan-300 text-[11px] font-sans flex items-center gap-1.5 transition-all cursor-default group"
                  title="Rebuild website UI with swarm animation"
                >
                  <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                  <span>Rebuild</span>
                </button>

                <button 
                  onClick={() => setIsTerminalMinimized(true)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setSnapHoverWindow('terminal')}
                  onMouseLeave={() => setSnapHoverWindow(null)}
                >
                  <button 
                    onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                    className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                    title={isTerminalMaximized ? "Restore" : "Maximize (Hover for Snap Layouts)"}
                  >
                    <Square className="w-3 h-3" />
                  </button>

                  {/* Windows 11 Snap Layouts Flyout */}
                  {snapHoverWindow === 'terminal' && (
                    <div className="absolute top-full right-0 mt-1 w-44 p-2 bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/20 rounded-[8px] shadow-2xl z-50 animate-fadeIn">
                      <div className="text-[10px] text-zinc-400 font-semibold mb-1.5 px-1">Snap Layouts</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => handleSnap('terminal', 'left')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Snap Left (50%)"
                        >
                          <div className="flex-1 w-full flex gap-1">
                            <div className="w-1/2 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                            <div className="w-1/2 h-full border border-dashed border-white/20 rounded-sm" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Left 50%</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('terminal', 'right')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Snap Right (50%)"
                        >
                          <div className="flex-1 w-full flex gap-1">
                            <div className="w-1/2 h-full border border-dashed border-white/20 rounded-sm" />
                            <div className="w-1/2 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Right 50%</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('terminal', 'center')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Centered Focus"
                        >
                          <div className="flex-1 w-full flex justify-center items-center">
                            <div className="w-3/4 h-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          </div>
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Center</span>
                        </button>

                        <button 
                          onClick={() => handleSnap('terminal', 'full')}
                          className="h-14 rounded border border-white/20 hover:border-blue-400 bg-white/5 hover:bg-blue-500/20 flex flex-col p-1 transition-all group"
                          title="Full Screen"
                        >
                          <div className="flex-1 w-full bg-blue-500/40 rounded-sm group-hover:bg-blue-400/80 transition-colors" />
                          <span className="text-[9px] text-zinc-400 mt-1 text-center">Full</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsTerminalOpen(false)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white text-white/70 transition-colors cursor-default"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal CLI Core Content */}
            <div className="flex-1 overflow-hidden relative">
              <Terminal 
                onOpenProjectsModal={onOpenProjects}
                onOpenBlogsModal={onOpenBlogs}
                onOpenUrlPreview={onOpenUrlPreview}
                onTriggerSwarm={onTriggerSwarm}
                onRestart={onRestart}
                onPowerOff={onPowerOff}
                onLogOut={onLogOut}
                commandHistory={commandHistory}
                setCommandHistory={setCommandHistory}
                externalCommand={externalCommand}
                onCommandComplete={onCommandComplete}
                isUndercover={true}
                isMinimized={isTerminalMinimized}
                onToggleUndercover={onToggleUndercover}
                isMobile={false}
              />
            </div>

            {/* Resize Handles for Terminal Window */}
            {!isTerminalMaximized && renderResizeHandles('terminal')}
          </div>
        )}

        {/* =============================================================== */}
        {/* WINDOW 3: THIS PC / SYSTEM PROPERTIES DIALOG                    */}
        {/* =============================================================== */}
        {isThisPCOpen && (
          <div 
            onClick={() => setActiveWindow('thispc')}
            style={
              isThisPCMaximized
                ? {
                    left: 8,
                    top: 8,
                    right: 8,
                    bottom: 54,
                    width: 'calc(100% - 16px)',
                    height: 'calc(100% - 62px)',
                    transform: isThisPCMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(thisPCRect, thisPCTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isThisPCMinimized ? 0 : 1,
                    visibility: isThisPCMinimized ? 'hidden' : 'visible',
                    pointerEvents: isThisPCMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'thispc' || activeResizeWindow?.id === 'thispc')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease'
                  }
                : {
                    left: `${thisPCRect.x}px`,
                    top: `${thisPCRect.y}px`,
                    width: `${thisPCRect.width}px`,
                    height: `${thisPCRect.height}px`,
                    transform: isThisPCMinimized
                      ? (() => {
                          const delta = getMinimizeDelta(thisPCRect, thisPCTaskbarRef, typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400);
                          return `translate3d(${delta.dx}px, ${delta.dy}px, 0) scale(0.04, 0.04)`;
                        })()
                      : 'translate3d(0, 0, 0) scale(1, 1)',
                    opacity: isThisPCMinimized ? 0 : 1,
                    visibility: isThisPCMinimized ? 'hidden' : 'visible',
                    pointerEvents: isThisPCMinimized ? 'none' : 'auto',
                    transition: (activeDragWindow === 'thispc' || activeResizeWindow?.id === 'thispc')
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), width 200ms ease, height 200ms ease'
                  }
            }
            className={`
              absolute rounded-[8px] overflow-hidden flex flex-col border
              ${activeWindow === 'thispc' 
                ? 'z-40 border-white/[0.22] shadow-[0_24px_54px_rgba(0,0,0,0.65)] ring-1 ring-white/10' 
                : 'z-20 border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.4)]'
              }
              bg-[#1c2130]/95 backdrop-blur-2xl text-white font-sans
            `}
          >
            <div 
              onPointerDown={(e) => handleStartDrag(e, 'thispc')}
              onDoubleClick={() => setIsThisPCMaximized(!isThisPCMaximized)}
              className="h-8 px-3 bg-[#191d28]/95 border-b border-white/[0.08] flex items-center justify-between cursor-default active:cursor-grabbing select-none"
              title="Click & drag to reposition dialog"
            >
              <div className="flex items-center gap-2 text-xs font-normal pointer-events-none">
                <Win11ComputerIcon className="w-4 h-4" />
                <span>About This PC - System Specifications</span>
              </div>
              <div className="flex items-center h-full -mr-3">
                <button 
                  onClick={() => setIsThisPCMinimized(true)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsThisPCMaximized(!isThisPCMaximized)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-default"
                  title={isThisPCMaximized ? "Restore" : "Maximize"}
                >
                  <Square className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setIsThisPCOpen(false)}
                  className="w-11 h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white text-white/70 transition-colors cursor-default"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-[8px] border border-white/10">
                <div className="w-12 h-12 rounded-[6px] bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-lg">
                  MR
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">Moniruzzaman Rishad</div>
                  <div className="text-zinc-400 text-xs">AI & ML Engineer • Portfolio OS Workstation</div>
                </div>
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="font-semibold text-white border-b border-white/10 pb-1">Device Specifications</div>
                <div className="grid grid-cols-[140px_1fr] gap-y-1.5 text-xs">
                  <span className="text-zinc-400">Device name</span>
                  <span className="font-mono text-cyan-300">RISHAD-AI-RIG</span>
                  <span className="text-zinc-400">Processor</span>
                  <span>Neural Coprocessor (PyTorch, TensorFlow, LangGraph)</span>
                  <span className="text-zinc-400">Installed RAM</span>
                  <span>32.0 GB High Performance VRAM</span>
                  <span className="text-zinc-400">System type</span>
                  <span>64-bit operating system, ARM/x64 AI architecture</span>
                </div>
              </div>

              <div className="space-y-2 text-zinc-300 pt-2">
                <div className="font-semibold text-white border-b border-white/10 pb-1">Windows Specifications</div>
                <div className="grid grid-cols-[140px_1fr] gap-y-1.5 text-xs">
                  <span className="text-zinc-400">Edition</span>
                  <span>Windows 11 Pro (Linux Undercover Disguise)</span>
                  <span className="text-zinc-400">Version</span>
                  <span>24H2 Portfolio Build 26100.1882</span>
                  <span className="text-zinc-400">Original Host</span>
                  <span className="text-cyan-400 font-bold">Linux Rolling 2026</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={onToggleUndercover}
                  className="px-3 py-1.5 rounded-[4px] bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>🐧 Return to Linux OS</span>
                </button>
                <button
                  onClick={() => setIsThisPCOpen(false)}
                  className="px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Resize Handles for This PC Window */}
            {!isThisPCMaximized && renderResizeHandles('thispc')}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. WINDOWS 11 START MENU                                          */}
      {/* ================================================================= */}
      {isStartOpen && (
        <div 
          ref={startRef}
          className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[600px] max-w-[95vw] h-[580px] rounded-[10px] bg-[#202020]/95 backdrop-blur-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden animate-slideInUp text-white select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Start Menu Search Bar */}
          <div className="p-6 pb-4">
            <div 
              onClick={() => {
                setIsStartOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[6px] bg-[#1a1a1a] border border-white/10 hover:border-cyan-400 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-inner"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Type here to search apps, commands, or portfolio...</span>
            </div>
          </div>

          <div className="flex-1 px-6 overflow-y-auto custom-scrollbar space-y-6">
            {/* Pinned Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white">Pinned</span>
                <button 
                  onClick={() => onOpenProjects()}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>All apps</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {[
                  { name: 'Terminal', icon: <Win11TerminalIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); setIsTerminalOpen(true); setIsTerminalMinimized(false); setActiveWindow('terminal'); } },
                  { name: 'Projects', icon: <Win11VSCodeIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); onOpenProjects(); } },
                  { name: 'Blogs & R&D', icon: <Win11ExplorerIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); onOpenBlogs(); } },
                  { name: 'ID Badge', icon: <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">ID</div>, action: () => { setIsStartOpen(false); setIsBadgeOpen(true); setIsBadgeMinimized(false); setActiveWindow('badge'); } },
                  { name: 'Edge Share', icon: <Win11EdgeIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); onOpenUrlPreview(); } },
                  { name: 'Resume', icon: <Win11PdfIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); onDownloadResume(); } },
                  { name: 'Settings', icon: <SettingsIcon className="w-7 h-7 text-blue-400" />, action: () => { setIsStartOpen(false); onOpenSettings(); } },
                  { name: 'This PC', icon: <Win11ComputerIcon className="w-7 h-7" />, action: () => { setIsStartOpen(false); setIsThisPCOpen(true); setIsThisPCMinimized(false); setActiveWindow('thispc'); } },
                  { name: 'Matrix Rain', icon: <span className="font-mono text-emerald-400 font-bold text-xs">MTRX</span>, action: () => { setIsStartOpen(false); setIsTerminalOpen(true); setIsTerminalMinimized(false); setActiveWindow('terminal'); onRunCommand('cmatrix'); } },
                  { name: 'GPU Monitor', icon: <span className="font-mono text-purple-400 font-bold text-xs">GPU</span>, action: () => { setIsStartOpen(false); setIsTerminalOpen(true); setIsTerminalMinimized(false); setActiveWindow('terminal'); onRunCommand('nvidia-smi'); } },
                  { name: 'htop Monitor', icon: <span className="font-mono text-cyan-400 font-bold text-xs">HTOP</span>, action: () => { setIsStartOpen(false); setIsTerminalOpen(true); setIsTerminalMinimized(false); setActiveWindow('terminal'); onRunCommand('htop'); } },
                  { name: 'Port Scanner', icon: <span className="font-mono text-amber-400 font-bold text-xs">NMAP</span>, action: () => { setIsStartOpen(false); setIsTerminalOpen(true); setIsTerminalMinimized(false); setActiveWindow('terminal'); onRunCommand('nmap localhost'); } },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      playUIClickSound();
                      item.action();
                    }}
                    className="p-2 rounded-[6px] hover:bg-white/[0.08] flex flex-col items-center gap-1.5 transition-colors group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-[6px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[11px] text-zinc-300 group-hover:text-white truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white">Recommended</span>
                <span className="text-[10px] text-zinc-400">Recent AI Models & Blogs</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {[
                  { title: 'YOLOv8 Real-time Vision', time: '2 hours ago', icon: <FileText className="w-4 h-4 text-blue-400" />, action: () => { setIsStartOpen(false); onOpenProjects(); } },
                  { title: 'LangGraph Multi-Agent Stack', time: 'Yesterday', icon: <FileText className="w-4 h-4 text-purple-400" />, action: () => { setIsStartOpen(false); onOpenBlogs(); } },
                  { title: 'Vastu AI Architectural Platform', time: '3 days ago', icon: <FileText className="w-4 h-4 text-emerald-400" />, action: () => { setIsStartOpen(false); onOpenProjects(); } },
                  { title: 'Resume_ML_Engineer_Rishad.pdf', time: 'Just now', icon: <Download className="w-4 h-4 text-red-400" />, action: () => { setIsStartOpen(false); onDownloadResume(); } },
                ].map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playUIClickSound();
                      rec.action();
                    }}
                    className="p-2 rounded-[6px] hover:bg-white/[0.08] flex items-center gap-3 transition-colors cursor-default"
                  >
                    <div className="p-2 rounded-[4px] bg-white/5 border border-white/10">
                      {rec.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{rec.title}</div>
                      <div className="text-[10px] text-zinc-400">{rec.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="h-16 bg-[#161616]/95 border-t border-white/[0.08] px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                MR
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Moniruzzaman Rishad</div>
                <div className="text-[10px] text-zinc-400">rishad@DESKTOP-WIN11</div>
              </div>
            </div>

            {/* Quick Actions (Exit Undercover + Restart) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsStartOpen(false);
                  onToggleUndercover();
                }}
                className="px-2.5 py-1.5 rounded-[4px] bg-cyan-600/30 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all flex items-center gap-1 cursor-pointer"
                title="Deactivate Undercover & Return to Linux OS"
              >
                <span>🐧</span>
                <span>Exit Undercover</span>
              </button>

              <button
                onClick={() => {
                  setIsStartOpen(false);
                  onRestart();
                }}
                className="p-2 rounded-[4px] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Restart System"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsStartOpen(false);
                  onPowerOff();
                }}
                className="p-2 rounded-[4px] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Shut Down"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2.5 WINDOWS 11 SEARCH FLYOUT                                      */}
      {/* ================================================================= */}
      {isSearchOpen && (
        <div 
          ref={searchRef}
          className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[540px] max-w-[95vw] h-[480px] rounded-[10px] bg-[#202020]/95 backdrop-blur-3xl border border-white/20 shadow-2xl z-50 flex flex-col overflow-hidden animate-slideInUp text-white select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[6px] bg-[#1a1a1a] border border-white/15 focus-within:border-cyan-400 transition-colors">
              <Search className="w-4 h-4 text-cyan-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a command (cmatrix, htop, nvidia-smi) or search portfolio..." 
                className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-zinc-400"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Top Results & Commands</div>
            <div className="space-y-1">
              {[
                { name: 'Windows Terminal (PowerShell)', desc: 'Run CLI commands & scripts', icon: <Win11TerminalIcon className="w-5 h-5" />, cmd: 'help' },
                { name: 'cmatrix', desc: 'Digital terminal matrix rain stream', icon: <span className="font-mono text-emerald-400 font-bold">MTRX</span>, cmd: 'cmatrix' },
                { name: 'nvidia-smi', desc: 'GPU VRAM allocation & AI process telemetry', icon: <span className="font-mono text-purple-400 font-bold">GPU</span>, cmd: 'nvidia-smi' },
                { name: 'htop', desc: 'Interactive system resource monitor', icon: <span className="font-mono text-cyan-400 font-bold">HTOP</span>, cmd: 'htop' },
                { name: 'nmap localhost', desc: 'Port scanner on AI endpoints & services', icon: <span className="font-mono text-amber-400 font-bold">NMAP</span>, cmd: 'nmap' },
                { name: 'Projects Deck', desc: 'Browse 3D AI portfolio showcase deck', icon: <Win11VSCodeIcon className="w-5 h-5" />, action: onOpenProjects },
                { name: 'Articles & Blogs', desc: 'Read AI & Engineering tech publications', icon: <Win11ExplorerIcon className="w-5 h-5" />, action: onOpenBlogs }
              ]
                .filter(item => !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playEnterSound();
                      setIsSearchOpen(false);
                      if (item.action) item.action();
                      else if (item.cmd) {
                        setIsTerminalOpen(true);
                        setIsTerminalMinimized(false);
                        setActiveWindow('terminal');
                        onRunCommand(item.cmd);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-between transition-colors group cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">{item.name}</div>
                        <div className="text-[10px] text-zinc-400">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. WINDOWS 11 QUICK SETTINGS FLYOUT                               */}
      {/* ================================================================= */}
      {isQuickSettingsOpen && (
        <div 
          ref={quickRef}
          className="fixed bottom-14 right-2 w-84 rounded-[10px] bg-[#202020]/95 backdrop-blur-3xl border border-white/20 shadow-2xl p-4 z-50 animate-slideInUp space-y-4 text-white"
        >
          {/* Quick Toggle Tiles */}
          <div className="grid grid-cols-3 gap-2">
            <button className="h-16 rounded-[6px] bg-[#0078d4] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-white">
              <Wifi className="w-5 h-5" />
              <span className="text-[10px] font-medium">Wi-Fi (Online)</span>
            </button>

            <button 
              onClick={toggleSound}
              className={`h-16 rounded-[6px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${soundEnabled ? 'bg-[#0078d4] text-white' : 'bg-white/10 text-zinc-400'}`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-medium">Audio {soundEnabled ? 'On' : 'Muted'}</span>
            </button>

            <button 
              onClick={handleNextWallpaper}
              className="h-16 rounded-[6px] bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-zinc-200"
              title="Next Desktop Wallpaper"
            >
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-medium">Wallpaper</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Volume</span>
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#0078d4] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Wallpaper Switcher */}
          <div className="space-y-1.5 pt-1 border-t border-white/[0.08]">
            <div className="text-xs text-zinc-400 flex items-center justify-between">
              <span>Theme Wallpapers</span>
              <span className="text-[10px] text-zinc-500">{wallpaperIndex + 1} of {WALLPAPERS.length}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {WALLPAPERS.map((wp, i) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    playUIClickSound();
                    setWallpaperIndex(i);
                    localStorage.setItem('win11_wallpaper_idx', i.toString());
                    setToastMessage(`🖼️ Background: ${wp.name}`);
                  }}
                  className={`h-10 rounded-[4px] border overflow-hidden transition-all ${wallpaperIndex === i ? 'border-[#0078d4] ring-2 ring-[#0078d4]/50 scale-105' : 'border-white/15 hover:border-white/40'}`}
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

          {/* Footer Info */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Battery className="w-3.5 h-3.5" />
              <span>100% Fully Charged</span>
            </span>
            <button 
              onClick={() => {
                setIsQuickSettingsOpen(false);
                onOpenSettings();
              }}
              className="hover:text-white flex items-center gap-1"
            >
              <SettingsIcon className="w-3 h-3" />
              <span>All settings</span>
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. WINDOWS 11 CALENDAR FLYOUT                                     */}
      {/* ================================================================= */}
      {isCalendarOpen && (
        <div 
          ref={calRef}
          className="fixed bottom-14 right-2 w-80 rounded-[10px] bg-[#202020]/95 backdrop-blur-3xl border border-white/20 shadow-2xl p-4 z-50 animate-slideInUp space-y-3 text-white"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div>
              <div className="text-xl font-bold text-white">{formattedTime}</div>
              <div className="text-xs text-blue-400 font-medium">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <Calendar className="w-6 h-6 text-zinc-400" />
          </div>

          <div className="text-xs space-y-1">
            <div className="font-semibold text-zinc-300 mb-1">Calendar & Schedule</div>
            <div className="p-2.5 rounded-[6px] bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Full-Time Available</div>
                <div className="text-[10px] text-emerald-400">AI / ML Engineer & System Architect</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ready
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. NATIVE WINDOWS 11 RIGHT-CLICK DESKTOP CONTEXT MENU             */}
      {/* ================================================================= */}
      {contextMenu && (
        <div 
          ref={contextRef}
          style={{ 
            top: contextMenu.y, 
            left: contextMenu.x,
            fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif"
          }}
          className="fixed z-50 w-64 rounded-[8px] bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/[0.09] shadow-[0_12px_40px_rgba(0,0,0,0.65)] p-1 text-[12.5px] text-zinc-100 animate-fadeIn select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('view')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <div className="mx-0.5 px-3 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-white/[0.08] transition-colors cursor-default">
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-zinc-300" />
                <span>View</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {activeSubmenu === 'view' && (
              <div className="absolute top-0 left-full -ml-1 w-52 rounded-[8px] bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/[0.09] shadow-2xl p-1 text-[12.5px] z-50">
                <button
                  onClick={() => { setDesktopIconSize('large'); setContextMenu(null); setActiveSubmenu(null); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between cursor-default"
                >
                  <span>Large icons</span>
                  {desktopIconSize === 'large' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  onClick={() => { setDesktopIconSize('medium'); setContextMenu(null); setActiveSubmenu(null); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between cursor-default"
                >
                  <span>Medium icons</span>
                  {desktopIconSize === 'medium' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  onClick={() => { setDesktopIconSize('small'); setContextMenu(null); setActiveSubmenu(null); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between cursor-default"
                >
                  <span>Small icons</span>
                  {desktopIconSize === 'small' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />
                <div className="px-3 py-1.5 text-zinc-400 flex items-center justify-between cursor-default text-[11.5px]">
                  <span>Auto arrange icons</span>
                  <Check className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="px-3 py-1.5 text-zinc-400 flex items-center justify-between cursor-default text-[11.5px]">
                  <span>Align icons to grid</span>
                  <Check className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />
                <div className="px-3 py-1.5 text-zinc-400 flex items-center justify-between cursor-default text-[11.5px]">
                  <span>Show desktop icons</span>
                  <Check className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            )}
          </div>

          {/* Sort by Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('sort')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <div className="mx-0.5 px-3 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-white/[0.08] transition-colors cursor-default">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-zinc-300" />
                <span>Sort by</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {activeSubmenu === 'sort' && (
              <div className="absolute top-0 left-full -ml-1 w-44 rounded-[8px] bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/[0.09] shadow-2xl p-1 text-[12.5px] z-50">
                {['Name', 'Size', 'Item type', 'Date modified'].map((item, i) => (
                  <button
                    key={item}
                    onClick={() => { playUIClickSound(); setContextMenu(null); setActiveSubmenu(null); }}
                    className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between cursor-default"
                  >
                    <span>{item}</span>
                    {i === 0 && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Desktop */}
          <button 
            onClick={handleRefresh}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <RefreshCw className="w-4 h-4 text-zinc-300" />
            <span>Refresh</span>
          </button>

          {/* NEXT DESKTOP BACKGROUND OPTION */}
          <button 
            onClick={handleNextWallpaper}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between transition-colors cursor-default group"
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-zinc-300" />
              <span>Next desktop background</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-normal">
              {WALLPAPERS[(wallpaperIndex + 1) % WALLPAPERS.length].name.split(' ')[2] || 'Next'}
            </span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />

          {/* New Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('new')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <div className="mx-0.5 px-3 py-1.5 rounded-[4px] flex items-center justify-between hover:bg-white/[0.08] transition-colors cursor-default">
              <div className="flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-amber-300" />
                <span>New</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {activeSubmenu === 'new' && (
              <div className="absolute top-0 left-full -ml-1 w-48 rounded-[8px] bg-[#2c2c2c]/95 backdrop-blur-3xl border border-white/[0.09] shadow-2xl p-1 text-[12.5px] z-50">
                <button
                  onClick={() => { playUIClickSound(); setContextMenu(null); setActiveSubmenu(null); onOpenBlogs(); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2 cursor-default"
                >
                  <Folder className="w-4 h-4 text-amber-300" />
                  <span>Folder</span>
                </button>
                <button
                  onClick={() => { playUIClickSound(); setContextMenu(null); setActiveSubmenu(null); onOpenProjects(); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2 cursor-default"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Shortcut</span>
                </button>
                <button
                  onClick={() => { playUIClickSound(); setContextMenu(null); setActiveSubmenu(null); onRunCommand('cat bio.txt'); }}
                  className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2 cursor-default"
                >
                  <FileText className="w-4 h-4 text-zinc-300" />
                  <span>Text Document</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />

          {/* Display settings */}
          <button 
            onClick={() => {
              setIsThisPCOpen(true);
              setIsThisPCMinimized(false);
              setActiveWindow('thispc');
              setContextMenu(null);
              setActiveSubmenu(null);
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <Layout className="w-4 h-4 text-zinc-300" />
            <span>Display settings</span>
          </button>

          {/* Reset Split (20% / 80%) */}
          <button 
            onClick={() => {
              playUIClickSound();
              const defaults = getWin11SplitDefaults();
              setBadgeRect(defaults.badge);
              setTerminalRect(defaults.terminal);
              saveGeometry('badge', defaults.badge);
              saveGeometry('terminal', defaults.terminal);
              setIsBadgeOpen(true);
              setIsBadgeMinimized(false);
              setIsBadgeMaximized(false);
              setIsTerminalOpen(true);
              setIsTerminalMinimized(false);
              setIsTerminalMaximized(false);
              setActiveWindow('terminal');
              setContextMenu(null);
              setActiveSubmenu(null);
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <Maximize2 className="w-4 h-4 text-zinc-300" />
            <span>Reset Split (20% / 80%)</span>
          </button>

          {/* Personalize */}
          <button 
            onClick={() => {
              onOpenSettings();
              setContextMenu(null);
              setActiveSubmenu(null);
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <Sliders className="w-4 h-4 text-zinc-300" />
            <span>Personalize</span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />

          {/* Open in Windows Terminal */}
          <button 
            onClick={() => {
              setIsTerminalOpen(true);
              setIsTerminalMinimized(false);
              setActiveWindow('terminal');
              setContextMenu(null);
              setActiveSubmenu(null);
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <Win11TerminalIcon className="w-4 h-4" />
            <span>Open in Windows Terminal</span>
          </button>

          {/* Open Projects in VS Code */}
          <button 
            onClick={() => {
              onOpenProjects();
              setContextMenu(null);
              setActiveSubmenu(null);
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-default"
          >
            <Win11VSCodeIcon className="w-4 h-4" />
            <span>Open Projects Showcase</span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />

          {/* Exit Undercover (Switch to Linux OS) */}
          <button 
            onClick={() => {
              setContextMenu(null);
              setActiveSubmenu(null);
              onToggleUndercover();
            }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-cyan-500/20 text-cyan-300 flex items-center gap-2.5 transition-colors cursor-default font-medium"
          >
            <span className="text-sm">🐧</span>
            <span>Exit Undercover (Switch to Linux)</span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1 mx-2" />

          {/* Show more options (Shift+F10) */}
          <button 
            onClick={() => { playUIClickSound(); setContextMenu(null); setActiveSubmenu(null); }}
            className="w-full text-left mx-0 px-3 py-1.5 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors cursor-default text-[12px]"
          >
            <span>Show more options</span>
            <span className="text-[10px] text-zinc-500 font-mono">Shift+F10</span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. WINDOWS 11 CENTERED TASKBAR (BOTTOM BAR - 48px NATIVE HEIGHT)  */}
      {/* ================================================================= */}
      <div 
        data-rebuild="panel"
        className="w-full h-12 bg-[#1c1c1c]/85 backdrop-blur-3xl border-t border-white/[0.08] px-3 flex items-center justify-between select-none z-50 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Windows 11 Widgets (Weather / Tech News) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playUIClickSound();
              onOpenBlogs();
            }}
            className="px-2.5 py-1 rounded-[6px] hover:bg-white/[0.08] active:bg-white/[0.05] flex items-center gap-2 text-xs text-white/90 transition-colors cursor-default group"
            title="Widgets & Tech Feeds"
          >
            <span className="text-base group-hover:scale-110 transition-transform">⛅</span>
            <div className="text-left leading-tight hidden lg:block">
              <div className="text-[11px] font-semibold text-white">24°C Sunny</div>
              <div className="text-[9px] text-zinc-400">Dhaka, Bangladesh</div>
            </div>
          </button>
        </div>

        {/* Center: Windows 11 App Icons Dock */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Start Menu Button */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsStartOpen(prev => !prev);
              setIsQuickSettingsOpen(false);
              setIsCalendarOpen(false);
              setIsSearchOpen(false);
            }}
            className={`
              w-10 h-10 rounded-[6px] flex items-center justify-center transition-all cursor-default group
              ${isStartOpen ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] active:scale-95'}
            `}
            title="Start"
          >
            <Win11Logo className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsSearchOpen(prev => !prev);
              setIsStartOpen(false);
              setIsQuickSettingsOpen(false);
              setIsCalendarOpen(false);
            }}
            className={`
              w-10 h-10 rounded-[6px] flex items-center justify-center transition-all cursor-default group
              ${isSearchOpen ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] active:scale-95'}
            `}
            title="Search"
          >
            <Search className="w-4 h-4 text-zinc-300 group-hover:scale-105 transition-transform" />
          </button>

          {/* Task View / Desktops Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              setToastMessage('🪟 Windows 11 Virtual Desktops: Workspace 1 (Active)');
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-default text-zinc-300 hover:text-white"
            title="Task View (Desktops)"
          >
            <Win11TaskViewIcon className="w-4 h-4" />
          </button>

          {/* Terminal Taskbar Icon (With macOS Genie Minimize / Restore Toggle) */}
          <button
            ref={terminalTaskbarRef}
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
            className={`
              w-10 h-10 rounded-[6px] flex items-center justify-center transition-all cursor-default group relative
              ${activeWindow === 'terminal' && !isTerminalMinimized ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] active:scale-95'}
            `}
            title="Windows Terminal (Click to Minimize / Restore)"
          >
            <Win11TerminalIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />
            {isTerminalOpen && (
              <span className={`absolute bottom-1 rounded-full transition-all duration-300 ${isTerminalMinimized ? 'w-1.5 h-[3px] bg-white/40' : 'w-4 h-[3px] bg-[#0078d4]'}`} />
            )}
          </button>

          {/* ID Card Taskbar Icon (With macOS Genie Minimize / Restore Toggle) */}
          <button
            ref={badgeTaskbarRef}
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
            className={`
              w-10 h-10 rounded-[6px] flex items-center justify-center transition-all cursor-default group relative
              ${activeWindow === 'badge' && !isBadgeMinimized ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] active:scale-95'}
            `}
            title="Employee ID Card (Click to Minimize / Restore)"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-[10px] group-hover:scale-105 transition-transform shadow-sm">
              ID
            </div>
            {isBadgeOpen && (
              <span className={`absolute bottom-1 rounded-full transition-all duration-300 ${isBadgeMinimized ? 'w-1.5 h-[3px] bg-white/40' : 'w-4 h-[3px] bg-blue-400'}`} />
            )}
          </button>

          {/* This PC Icon */}
          <button
            ref={thisPCTaskbarRef}
            onClick={() => {
              playUIClickSound();
              if (!isThisPCOpen) {
                setIsThisPCOpen(true);
                setIsThisPCMinimized(false);
                setActiveWindow('thispc');
              } else if (isThisPCMinimized) {
                setIsThisPCMinimized(false);
                setActiveWindow('thispc');
              } else if (activeWindow === 'thispc') {
                setIsThisPCMinimized(true);
              } else {
                setActiveWindow('thispc');
              }
            }}
            className={`
              w-10 h-10 rounded-[6px] flex items-center justify-center transition-all cursor-default group relative
              ${activeWindow === 'thispc' && !isThisPCMinimized ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] active:scale-95'}
            `}
            title="This PC / System Specs"
          >
            <Win11ComputerIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />
            {isThisPCOpen && (
              <span className={`absolute bottom-1 rounded-full transition-all duration-300 ${isThisPCMinimized ? 'w-1.5 h-[3px] bg-white/40' : 'w-4 h-[3px] bg-[#0078d4]'}`} />
            )}
          </button>

          {/* File Explorer Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenBlogs();
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-default group"
            title="File Explorer (Articles & Blogs)"
          >
            <Win11ExplorerIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />
          </button>

          {/* Projects (VS Code) Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenProjects();
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-default group"
            title="Projects Showcase"
          >
            <Win11VSCodeIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />
          </button>

          {/* Microsoft Edge Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenUrlPreview();
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-default group"
            title="Microsoft Edge (Share Preview)"
          >
            <Win11EdgeIcon className="w-6 h-6 group-hover:scale-105 transition-transform" />
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              onOpenSettings();
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-default text-zinc-300 hover:text-white"
            title="Settings & Personalization"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Swarm Rebuild Taskbar Icon */}
          <button
            onClick={() => {
              playUIClickSound();
              onTriggerSwarm?.();
            }}
            className="w-10 h-10 rounded-[6px] hover:bg-white/[0.08] active:scale-95 flex items-center justify-center transition-all cursor-default group relative"
            title="Rebuild website with Swarm Cursors (DhvanilPatel/swarm-cursors)"
          >
            <div className="w-6 h-6 rounded-[5px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="absolute bottom-1 w-1.5 h-[3px] rounded-full bg-cyan-400/80" />
          </button>

          <div className="h-5 w-px bg-white/10 mx-0.5" />

          {/* EXIT UNDERCOVER BUTTON (LINUX DISGUISE TOGGLE) */}
          <button
            onClick={() => {
              playEnterSound();
              onToggleUndercover();
            }}
            className="h-8 px-2.5 rounded-[6px] bg-gradient-to-r from-cyan-600/40 to-blue-600/40 hover:from-cyan-500 hover:to-blue-500 hover:text-black border border-cyan-400/50 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-cyan-300 shadow-md active:scale-95"
            title="Exit Undercover Disguise (Return to Linux OS)"
          >
            <span className="text-sm">🐧</span>
            <span className="hidden md:inline font-mono text-[11px]">Exit Undercover</span>
          </button>
        </div>

        {/* Right Side: Windows 11 System Tray */}
        <div className="flex items-center gap-1">
          {/* Hidden icons chevron */}
          <button 
            className="w-5 h-9 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-default"
            title="Show hidden icons"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Next Wallpaper Quick Icon */}
          <button 
            onClick={handleNextWallpaper}
            className="w-7 h-9 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-amber-400 transition-colors cursor-default"
            title={`Next Desktop Background (${WALLPAPERS[(wallpaperIndex + 1) % WALLPAPERS.length].name})`}
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`
              h-9 px-2 rounded-[4px] flex items-center justify-center transition-colors cursor-default text-xs
              ${isFullscreen ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40' : 'hover:bg-white/[0.08] text-zinc-300 hover:text-white'}
            `}
            title={isFullscreen ? 'Exit Full Screen' : 'Go Full Screen (F11)'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Network + Volume + Battery Compound Pill */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsQuickSettingsOpen(prev => !prev);
              setIsCalendarOpen(false);
              setIsSearchOpen(false);
            }}
            className={`
              h-9 px-2 rounded-[4px] flex items-center gap-2 transition-colors cursor-default
              ${isQuickSettingsOpen ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] text-white/90'}
            `}
            title="Quick Settings (Wi-Fi, Audio, Wallpapers)"
          >
            <Wifi className="w-3.5 h-3.5" />
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Clock & Date */}
          <button
            onClick={() => {
              playUIClickSound();
              setIsCalendarOpen(prev => !prev);
              setIsQuickSettingsOpen(false);
              setIsSearchOpen(false);
            }}
            className={`
              h-9 px-2.5 rounded-[4px] flex flex-col justify-center text-right leading-tight transition-colors cursor-default
              ${isCalendarOpen ? 'bg-white/[0.14]' : 'hover:bg-white/[0.08] text-white/90'}
            `}
            title="Notification Center & Calendar"
          >
            <span className="text-[12px] font-normal">{formattedTime}</span>
            <span className="text-[10px] text-zinc-400">{formattedDate}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsCalendarOpen(prev => !prev)}
            className="w-8 h-9 rounded-[4px] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white relative cursor-default"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-2.5 right-2" />
          </button>

          {/* Show Desktop Vertical Line (Far Right Corner - Aero Peek / Minimize All) */}
          <div 
            onClick={() => {
              playUIClickSound();
              if (isTerminalMinimized && isBadgeMinimized) {
                setIsTerminalMinimized(false);
                setIsBadgeMinimized(false);
              } else {
                setIsTerminalMinimized(true);
                setIsBadgeMinimized(true);
                if (isThisPCOpen) setIsThisPCMinimized(true);
              }
            }}
            className="w-[6px] h-full hover:bg-white/20 border-l border-white/[0.08] ml-1 cursor-default"
            title="Show Desktop"
          />
        </div>
      </div>
    </div>
  );
};

export default Windows11Desktop;

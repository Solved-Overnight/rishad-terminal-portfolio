import React, { useState, useEffect, useRef } from 'react';
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
  GnomeNotification,
  DEFAULT_LINUX_NOTIFICATIONS,
  getStoredLinuxNotifications,
  saveLinuxNotifications,
  pushLinuxNotification,
  formatNotificationTime
} from '../utils/linuxNotifications';
import { 
  X, 
  Minus, 
  Square, 
  Folder, 
  Search, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Clock, 
  Power, 
  Settings as SettingsIcon, 
  Sparkles, 
  Download, 
  Grid,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Upload,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  Calendar as CalendarIcon,
  RotateCcw,
  Plus,
  ExternalLink,
  ShieldCheck,
  Terminal as TerminalIcon,
  ChevronDown,
  Sun,
  Moon,
  Bluetooth,
  Zap,
  Plane,
  Camera,
  Lock,
  Copy,
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
  Gauge
} from 'lucide-react';

/* ========================================================================= */
/* GNOME DOCK ICONS (UNIFORM SQUIRCLE SHAPE & COMPACT SIZE)                  */
/* ========================================================================= */

const DOCK_SQUIRCLE = "w-8 h-8 sm:w-8.5 sm:h-8.5 shrink-0 flex-shrink-0 aspect-square rounded-[7px] sm:rounded-[8px] flex items-center justify-center border border-white/20 shadow-md relative overflow-hidden transition-all group-hover:scale-110 group-hover:border-cyan-400/50";

// 1. Terminal Icon (>_)
const GnomeTerminalIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#2d313c] to-[#12141a] p-1 flex flex-col justify-between`}>
    <div className="flex items-center gap-0.5 opacity-70 w-full">
      <div className="w-1 h-1 rounded-full bg-red-500" />
      <div className="w-1 h-1 rounded-full bg-yellow-500" />
      <div className="w-1 h-1 rounded-full bg-green-500" />
    </div>
    <div className="font-mono font-bold text-[10px] text-white flex items-center gap-0.5 pl-0.5 w-full">
      <span className="text-cyan-400 font-extrabold">&gt;</span>
      <span className="w-1.5 h-0.5 bg-white inline-block animate-pulse ml-0.5" />
    </div>
  </div>
);

// 2. VS Code Icon (Official Visual Studio Code Folded Ribbon)
const GnomeVSCodeIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#1b202c] to-[#0e1017] p-1 flex items-center justify-center`}>
    <svg className="w-5.5 h-5.5 drop-shadow-sm" viewBox="0 0 256 256" fill="none">
      <path d="M178.6 22.8c-2.4-.9-5.1-.4-7 1.3L89.4 97.4 39.5 59.8c-2.8-2.1-6.7-1.7-9 1L7.8 89c-2 2.4-1.9 5.9.3 8.1l43.2 39-43.2 39c-2.2 2.2-2.3 5.7-.3 8.1l22.7 28.2c2.3 2.8 6.2 3.1 9 1l49.9-37.6 82.2 73.3c1.9 1.7 4.6 2.2 7 1.3 2.4-.9 4-3.2 4-5.8V28.6c0-2.6-1.6-4.9-4-5.8z" fill="#0065a9" fillOpacity="0.35"/>
      <path d="M182.6 28.6L89.4 102.5l28.7 25.5 64.5-57.3V28.6z" fill="#007acc"/>
      <path d="M182.6 227.4L89.4 153.5l28.7-25.5 64.5 57.3v42.1z" fill="#1f9cf0"/>
      <path d="M182.6 227.4l49.5-23.7c4.6-2.2 7.5-6.8 7.5-11.9V64.2c0-5.1-2.9-9.7-7.5-11.9l-49.5-23.7v198.8z" fill="#0098ff"/>
      <path d="M39.5 63.8l78.6 64.2-78.6 64.2-27.7-25.2c-2.2-2-2.3-5.4-.2-7.5l34.8-31.5-34.8-31.5c-2.1-2.1-2-5.5.2-7.5l27.7-25.2z" fill="#007acc" fillOpacity="0.9"/>
      <path d="M118.1 128L39.5 63.8l-8.7 7.9 66.8 56.3-66.8 56.3 8.7 7.9L118.1 128z" fill="#ffffff" fillOpacity="0.25"/>
    </svg>
  </div>
);

// 3. Projects Folder Icon (Yellow folder)
const GnomeFolderIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#f2cc60] to-[#d4a72c] border-yellow-200/40 p-1`}>
    <Folder className="w-5 h-5 text-white fill-white/80 drop-shadow-sm" />
  </div>
);

// 4. Firefox Browser Icon (Matching squircle container)
const GnomeFirefoxIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-br from-[#ff5e3a] via-[#e5097f] to-[#5b2b8c] p-1`}>
    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#3b5998] to-[#00d2ff] flex items-center justify-center relative overflow-hidden border border-white/30">
      <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tl from-[#ff9900] to-[#ff0055] opacity-90" />
      <span className="text-[9px] font-bold text-white z-10 drop-shadow">🦊</span>
    </div>
  </div>
);

// 5. Lightning / Dev Icon (Orange lightning bolt)
const GnomeLightningIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#ff8c00] to-[#e65100] p-1.5`}>
    <svg className="w-5 h-5 text-white fill-white drop-shadow" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  </div>
);

// 6. VLC Media Player Icon (Original Official VideoLAN Traffic Cone)
const GnomeVlcIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#ff8800] via-[#ea6100] to-[#c75500] p-1 flex items-center justify-center`}>
    <svg className="w-5.5 h-5.5 drop-shadow-md" viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="vlcBaseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFA64D" />
          <stop offset="70%" stopColor="#E65100" />
          <stop offset="100%" stopColor="#8F2D00" />
        </radialGradient>
        <linearGradient id="vlcConeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7700" />
          <stop offset="50%" stopColor="#FFA040" />
          <stop offset="100%" stopColor="#D94E00" />
        </linearGradient>
      </defs>
      {/* Base Platform */}
      <ellipse cx="24" cy="42" rx="19" ry="4.5" fill="#782300" />
      <ellipse cx="24" cy="40.5" rx="18" ry="4" fill="url(#vlcBaseGrad)" />
      
      {/* Lower Orange Section */}
      <path d="M10 39.5L15 28.5H33L38 39.5C33 42 15 42 10 39.5Z" fill="url(#vlcConeGrad)" />
      
      {/* Lower White Ring */}
      <path d="M15 28.5L18 21.5H30L33 28.5C29 30.5 19 30.5 15 28.5Z" fill="#F4F4F6" />
      <path d="M15 28.5C19 30.5 29 30.5 33 28.5L32.2 27C28.5 29 19.5 29 15.8 27L15 28.5Z" fill="#D2D4D8" />
      
      {/* Middle Orange Section */}
      <path d="M18 21.5L20.5 14H27.5L30 21.5C27 23 21 23 18 21.5Z" fill="url(#vlcConeGrad)" />
      
      {/* Upper White Ring */}
      <path d="M20.5 14L22 9H26L27.5 14C25.5 15.2 22.5 15.2 20.5 14Z" fill="#F4F4F6" />
      <path d="M20.5 14C22.5 15.2 25.5 15.2 27.5 14L27 12.8C25.2 13.8 22.8 13.8 21 12.8L20.5 14Z" fill="#D2D4D8" />
      
      {/* Top Orange Tip */}
      <path d="M22 9L24 4L26 9C25 9.8 23 9.8 22 9Z" fill="#FFAC54" />
      <ellipse cx="24" cy="4" rx="2" ry="1" fill="#FFE5CC" />
    </svg>
  </div>
);

// 7. Settings Icon (Gear)
const GnomeSettingsIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#4e535e] to-[#252830] p-1`}>
    <SettingsIcon className="w-4.5 h-4.5 text-zinc-200 drop-shadow" />
  </div>
);

// 8. Blogs / Articles Icon (Horizontal colored lines)
const GnomeBlogsIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#1e232f] to-[#0f1218] p-2 flex flex-col justify-center gap-1`}>
    <div className="h-1 w-full bg-[#00d2ff] rounded-full" />
    <div className="h-1 w-4/5 bg-[#ff4b82] rounded-full" />
    <div className="h-1 w-full bg-[#ffb703] rounded-full" />
  </div>
);

// 9. Resume / PDF Viewer Icon (Red doc with glasses)
const GnomeResumeIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#ea4335] to-[#b31412] p-1 flex flex-col items-center justify-center`}>
    <div className="w-5 h-5.5 bg-white rounded-[2px] p-0.5 flex flex-col items-center justify-center relative shadow-sm">
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-600 rounded-bl-[1.5px]" />
      <span className="text-[7px] font-bold text-red-600 leading-none">CV</span>
      <span className="text-[6px] leading-none">👓</span>
    </div>
  </div>
);

// 10. Downloads / ID Card Icon (Blue folder with arrow)
const GnomeDownloadsIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#0288d1] to-[#01579b] p-1.5`}>
    <div className="w-5 h-5 rounded bg-white/20 border border-white/40 flex items-center justify-center">
      <Download className="w-3.5 h-3.5 text-white" />
    </div>
  </div>
);

// 11. Search / Spotlight Icon (Magnifying Glass on Dark Silver Squircle)
const GnomeSearchIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-gradient-to-b from-[#3a3f4d] to-[#1c1f26] p-1 flex items-center justify-center`}>
    <Search className="w-4.5 h-4.5 text-cyan-300 drop-shadow" />
  </div>
);

// 12. App Grid Icon (9 Dots)
const GnomeGridIcon: React.FC = () => (
  <div className={`${DOCK_SQUIRCLE} bg-black/40 hover:bg-white/10 p-1.5 border-dashed border-white/30 cursor-pointer`}>
    <Grid className="w-5 h-5 text-white/90 drop-shadow" />
  </div>
);

/* ========================================================================= */
/* WALLPAPER PRESETS (PERSISTENT IN LOCALSTORAGE)                            */
/* ========================================================================= */

const AVAILABLE_WALLPAPERS = [
  {
    id: 'landscape',
    name: 'Rishad Branded (Default)',
    desc: 'Official Build • Learn • Explore Banner',
    url: '/img/Landscape_wallpaper.png',
  },
  {
    id: 'win11-bloom',
    name: 'Windows 11 Bloom',
    desc: 'Classic Blue Petals',
    url: '/img/win11_bloom_wallpaper.jpg',
  },
  {
    id: 'win11-glow',
    name: 'Windows 11 Dark Glow',
    desc: 'Dark Mode Velvet Flow',
    url: '/img/win11_glow_wallpaper.jpg',
  },
  {
    id: 'win11-sunrise',
    name: 'Windows 11 Sunrise',
    desc: 'Warm Golden Hues',
    url: '/img/win11_sunrise_wallpaper.jpg',
  },
  {
    id: 'macos-sonoma',
    name: 'macOS Sonoma',
    desc: 'Organic Abstract Topography',
    url: '/img/macos_sonoma_wallpaper.jpg',
  },
  {
    id: 'macos-sequoia',
    name: 'macOS Sequoia',
    desc: 'Deep Forest Redwood Sunset',
    url: '/img/macos_sequoia_wallpaper.jpg',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Matrix',
    desc: 'Futuristic Terminal Glow',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'deep-space',
    name: 'Deep Space Nebula',
    desc: 'Cosmic Starfield & Galaxy',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2070&auto=format&fit=crop',
  },
];

/* ========================================================================= */
/* MAIN LINUX GNOME DESKTOP COMPONENT                                        */
/* ========================================================================= */

interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type { GnomeNotification };

interface LinuxGnomeDesktopProps {
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
  onTriggerSwarm: () => void;
  commandHistory: HistoryItem[];
  setCommandHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  externalCommand: string | null;
  onCommandComplete: () => void;
  isSwarmRebuilding?: boolean;
}

export const LinuxGnomeDesktop: React.FC<LinuxGnomeDesktopProps> = ({
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
  isSwarmRebuilding = false
}) => {
  const { currentTheme } = useTheme();

  // Desktop State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPlacesOpen, setIsPlacesOpen] = useState(false);
  const [isAppGridOpen, setIsAppGridOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSystemTrayOpen, setIsSystemTrayOpen] = useState(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(84.6);
  const [uploadSpeed, setUploadSpeed] = useState(31.2);
  const [pingLatency, setPingLatency] = useState(12);
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);
  const [isNightLightActive, setIsNightLightActive] = useState(false);
  const [isBluetoothActive, setIsBluetoothActive] = useState(true);
  const [powerProfile, setPowerProfile] = useState<'balanced' | 'performance' | 'power-saver'>('balanced');
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [isScreenshotFlashing, setIsScreenshotFlashing] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(() => getSoundSettings().enabled);

  // Notifications State for GNOME Notification Center (persisted in localStorage)
  const [notifications, setNotifications] = useState<GnomeNotification[]>(() => getStoredLinuxNotifications());
  const [isDndActive, setIsDndActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('linux_gnome_dnd') === 'true';
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('linux_gnome_dnd', String(isDndActive));
    } catch {}
  }, [isDndActive]);

  // Keep Notification Center synced with global/app-level notifications
  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<GnomeNotification[]>;
      if (Array.isArray(custom.detail)) {
        setNotifications(custom.detail);
      } else {
        setNotifications(getStoredLinuxNotifications());
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'linux_gnome_notifications') {
        setNotifications(getStoredLinuxNotifications());
      }
    };
    window.addEventListener('linux-notifications-updated', handleSync);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('linux-notifications-updated', handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Track newly executed terminal commands and store recent ones in Notification Center
  const prevCommandCountRef = useRef(commandHistory.length);
  useEffect(() => {
    if (commandHistory.length > prevCommandCountRef.current) {
      const latest = commandHistory[commandHistory.length - 1];
      const cmdText = latest?.command?.trim();
      if (cmdText && cmdText.toLowerCase() !== 'clear') {
        const lower = cmdText.toLowerCase();
        const isSecurity = lower.includes('nmap') || lower.includes('whoami') || lower.includes('sudo') || lower.includes('htop');
        const isNetwork = lower.includes('ping') || lower.includes('ip ') || lower.includes('curl') || lower.includes('git clone');
        pushLinuxNotification({
          source: 'Kali Terminal',
          title: `Executed: ${cmdText.length > 32 ? `${cmdText.slice(0, 32)}...` : cmdText}`,
          message: `Command completed in zsh session on /dev/pts/1.`,
          category: isSecurity ? 'security' : isNetwork ? 'network' : 'terminal',
        });
      }
    }
    prevCommandCountRef.current = commandHistory.length;
  }, [commandHistory]);

  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(() => new Date().getDate());

  // Interactive Agenda Events Map (defaults to empty like reference screenshot)
  const [calendarEvents, setCalendarEvents] = useState<Record<number, { id: string; time: string; title: string; tag: string }[]>>({});
  const [newEventInput, setNewEventInput] = useState('');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const handleAddEvent = () => {
    if (!newEventInput.trim()) return;
    playUIClickSound();
    const newEntry = {
      id: `ev-${Date.now()}`,
      time: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      title: newEventInput.trim(),
      tag: 'Task'
    };
    setCalendarEvents(prev => ({
      ...prev,
      [selectedCalendarDay]: [...(prev[selectedCalendarDay] || []), newEntry]
    }));
    pushLinuxNotification({
      source: 'Calendar',
      title: 'Agenda Note Added',
      message: `"${newEntry.title}" scheduled for day ${selectedCalendarDay}.`,
      category: 'system',
    });
    setNewEventInput('');
    setIsAddingEvent(false);
  };

  const clearAllNotifications = () => {
    playUIClickSound();
    saveLinuxNotifications([]);
  };

  const restoreDefaultNotifications = () => {
    playUIClickSound();
    const freshDefaults = DEFAULT_LINUX_NOTIFICATIONS.map((n, idx) => ({
      ...n,
      timestamp: Date.now() - idx * 3 * 60 * 1000,
    }));
    saveLinuxNotifications(freshDefaults);
  };

  const removeNotification = (id: string) => {
    playUIClickSound();
    saveLinuxNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationAction = (notification: GnomeNotification) => {
    playUIClickSound();
    if (notification.category === 'disguise') {
      onToggleUndercover();
    } else if (notification.category === 'terminal') {
      setIsTerminalMinimized(false);
      setActivePane('terminal');
    } else if (notification.category === 'system') {
      setIsIdCardMinimized(false);
      setActivePane('idcard');
    } else if (notification.category === 'security') {
      setIsTerminalMinimized(false);
      setActivePane('terminal');
      onRunCommand('whoami');
    } else if (notification.category === 'network') {
      onOpenUrlPreview();
    }
  };

  // Mac-like Spotlight Search Modal State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightActiveIndex, setSpotlightActiveIndex] = useState(0);
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  // Global Spotlight shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleSpotlightKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playUIClickSound();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleSpotlightKey);
    return () => window.removeEventListener('keydown', handleSpotlightKey);
  }, []);

  // Spotlight Searchable Index
  const spotlightItems = [
    { id: 'terminal', title: 'Terminal', subtitle: 'Launch Kali Linux Zsh shell and pentesting tools', category: 'Application', icon: '💻', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); } },
    { id: 'projects', title: 'Projects Explorer', subtitle: 'Interactive 3D deck of AI/ML, cloud, and systems projects', category: 'Application', icon: '📁', action: onOpenProjects },
    { id: 'blogs', title: 'Blogs & Research Articles', subtitle: 'Read technical engineering publications & writeups', category: 'Application', icon: '📝', action: () => onOpenBlogs() },
    { id: 'vscode', title: 'Visual Studio Code', subtitle: 'Open IDE development workspace (code .)', category: 'Application', icon: '⚡', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('code .'); } },
    { id: 'idcard', title: '3D Holographic ID Badge', subtitle: 'Interact with Three.js / Rapier dynamic lanyard badge', category: 'Application', icon: '🪪', action: () => { setIsIdCardMinimized(false); setActivePane('idcard'); } },
    { id: 'undercover', title: 'Linux Undercover Disguise', subtitle: 'Morph Linux OS skin into Windows 11', category: 'Feature', icon: '🎭', action: onToggleUndercover },
    { id: 'swarm', title: 'Swarm Rebuild', subtitle: 'Reconstruct workspace UI with swarm cursors', category: 'Action', icon: '✨', action: onTriggerSwarm },
    { id: 'wallpaper', title: 'Change Desktop Wallpaper', subtitle: 'Select from 8 curated presets or upload custom background', category: 'Action', icon: '🖼️', action: () => setIsWallpaperModalOpen(true) },
    { id: 'resume', title: 'Download Resume CV (PDF)', subtitle: 'Download official Curriculum Vitae', category: 'Action', icon: '📄', action: onDownloadResume },
    { id: 'settings', title: 'System Settings & Themes', subtitle: 'Configure theme palettes, audio FX & system preferences', category: 'Application', icon: '⚙️', action: onOpenSettings },
    { id: 'preview', title: 'Web Preview & OpenGraph', subtitle: 'Social share preview cards & metadata preview', category: 'Feature', icon: '🌐', action: onOpenUrlPreview },
    { id: 'focus', title: 'Toggle Focus Mode', subtitle: 'Turn distraction-free work timer on or off', category: 'Action', icon: '⏱️', action: () => setIsFocusMode(p => !p) },
    { id: 'neofetch', title: 'neofetch', subtitle: 'Display system telemetry, CPU, RAM and kernel in terminal', category: 'Command', icon: '>_', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('neofetch'); } },
    { id: 'skills', title: 'skills', subtitle: 'Show comprehensive technical skills matrix', category: 'Command', icon: '>_', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('skills'); } },
    { id: 'whoami', title: 'whoami', subtitle: 'Show user identity and developer background', category: 'Command', icon: '>_', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('whoami'); } },
    { id: 'help', title: 'help', subtitle: 'List available offensive & defensive shell commands', category: 'Command', icon: '>_', action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('help'); } },
    { id: 'reboot', title: 'reboot', subtitle: 'Reboot system into initial bootstrap state', category: 'Action', icon: '🔄', action: onRestart },
  ];

  const filteredSpotlightItems = spotlightItems.filter(item =>
    item.title.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  useEffect(() => {
    if (isSpotlightOpen) {
      setSpotlightActiveIndex(0);
      const timer = setTimeout(() => spotlightInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    } else {
      setSpotlightQuery('');
    }
  }, [isSpotlightOpen]);

  const handleExecuteSpotlightItem = (item?: typeof spotlightItems[0]) => {
    const target = item || filteredSpotlightItems[spotlightActiveIndex];
    if (target) {
      playUIClickSound();
      setIsSpotlightOpen(false);
      target.action();
    }
  };

  const handleSpotlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredSpotlightItems.length > 0) {
        setSpotlightActiveIndex(prev => (prev + 1) % filteredSpotlightItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredSpotlightItems.length > 0) {
        setSpotlightActiveIndex(prev => (prev - 1 + filteredSpotlightItems.length) % filteredSpotlightItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSpotlightItem();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSpotlightOpen(false);
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document !== 'undefined') {
      return !!document.fullscreenElement;
    }
    return false;
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    playUIClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Persistent Wallpaper State in localStorage
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('linux_desktop_wallpaper');
      if (saved) return saved;
    }
    return '/img/Landscape_wallpaper.png';
  });

  const handleSelectWallpaper = (url: string) => {
    playUIClickSound();
    setCurrentWallpaper(url);
    try {
      localStorage.setItem('linux_desktop_wallpaper', url);
    } catch {}
    const matched = AVAILABLE_WALLPAPERS.find(w => w.url === url);
    pushLinuxNotification({
      source: 'Personalization',
      title: 'Desktop Wallpaper Updated',
      message: `Applied "${matched ? matched.name : 'Custom Background'}" to GNOME workspace.`,
      category: 'system',
    });
  };

  // Right-click Desktop Context Menu & Wallpaper Modal States
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [customWallpaperInput, setCustomWallpaperInput] = useState('');
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Tab states in sessionStorage: Retains placement across undercover switches, resets on reload/reboot
  const [isTerminalMinimized, setIsTerminalMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linux_terminal_minimized');
      return saved === 'true';
    }
    return false;
  });

  const [isIdCardMinimized, setIsIdCardMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linux_idcard_minimized');
      return saved === 'true';
    }
    return false;
  });

  // Maximized states (retained in sessionStorage across OS switches, cleared on reload)
  const [isTerminalMaximized, setIsTerminalMaximized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('linux_terminal_maximized') === 'true';
    }
    return false;
  });
  const [isIdCardMaximized, setIsIdCardMaximized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('linux_idcard_maximized') === 'true';
    }
    return false;
  });

  // Active focused window
  const [activePane, setActivePane] = useState<'idcard' | 'terminal'>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linux_active_pane');
      if (saved === 'idcard' || saved === 'terminal') return saved;
    }
    return 'terminal';
  });

  // Save window states to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('linux_terminal_minimized', String(isTerminalMinimized));
    } catch {}
  }, [isTerminalMinimized]);

  useEffect(() => {
    try {
      sessionStorage.setItem('linux_idcard_minimized', String(isIdCardMinimized));
    } catch {}
  }, [isIdCardMinimized]);

  useEffect(() => {
    try {
      sessionStorage.setItem('linux_terminal_maximized', String(isTerminalMaximized));
    } catch {}
  }, [isTerminalMaximized]);

  useEffect(() => {
    try {
      sessionStorage.setItem('linux_idcard_maximized', String(isIdCardMaximized));
    } catch {}
  }, [isIdCardMaximized]);

  useEffect(() => {
    try {
      sessionStorage.setItem('linux_active_pane', activePane);
    } catch {}
  }, [activePane]);

  // Window Rects: Initial 20% ID Card & 80% Terminal (resets on page reload / reboot)
  const [idCardRect, setIdCardRect] = useState<WindowRect>(() => {
    if (typeof window !== 'undefined') {
      const top = 34;
      const defaultHeight = Math.max(320, window.innerHeight - top - 62);
      const marginX = 12;
      const gap = 8;
      const availableWidth = Math.max(540, window.innerWidth - marginX * 2 - gap);
      const defaultWidth = Math.max(220, Math.floor(availableWidth * 0.20));

      const saved = sessionStorage.getItem('linux_idcard_rect');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.width === 'number' && typeof parsed.height === 'number') {
            const safeWidth = Math.min(Math.max(220, parsed.width), window.innerWidth - 24);
            const safeHeight = Math.min(Math.max(220, parsed.height), window.innerHeight - top - 30);
            const safeX = Math.max(4, Math.min(parsed.x, window.innerWidth - 100));
            const safeY = Math.max(top, Math.min(parsed.y, window.innerHeight - 100));
            return { x: safeX, y: safeY, width: safeWidth, height: safeHeight };
          }
        } catch {}
      }
      return { x: marginX, y: top, width: defaultWidth, height: defaultHeight };
    }
    return { x: 12, y: 34, width: 250, height: 600 };
  });

  const [terminalRect, setTerminalRect] = useState<WindowRect>(() => {
    if (typeof window !== 'undefined') {
      const top = 34;
      const defaultHeight = Math.max(320, window.innerHeight - top - 62);
      const marginX = 12;
      const gap = 8;
      const availableWidth = Math.max(540, window.innerWidth - marginX * 2 - gap);
      const idWidth = Math.max(220, Math.floor(availableWidth * 0.20));
      const defaultStartX = marginX + idWidth + gap;
      const defaultWidth = Math.max(320, availableWidth - idWidth);

      const saved = sessionStorage.getItem('linux_terminal_rect');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.width === 'number' && typeof parsed.height === 'number') {
            const safeWidth = Math.min(Math.max(320, parsed.width), window.innerWidth - 24);
            const safeHeight = Math.min(Math.max(220, parsed.height), window.innerHeight - top - 30);
            const safeX = Math.max(4, Math.min(parsed.x, window.innerWidth - 100));
            const safeY = Math.max(top, Math.min(parsed.y, window.innerHeight - 100));
            return { x: safeX, y: safeY, width: safeWidth, height: safeHeight };
          }
        } catch {}
      }
      return { x: defaultStartX, y: top, width: defaultWidth, height: defaultHeight };
    }
    return { x: 270, y: 34, width: 990, height: 600 };
  });

  // Save rects on change in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('linux_idcard_rect', JSON.stringify(idCardRect));
    } catch {}
  }, [idCardRect]);

  useEffect(() => {
    try {
      sessionStorage.setItem('linux_terminal_rect', JSON.stringify(terminalRect));
    } catch {}
  }, [terminalRect]);

  // Drag & Resize State
  const [draggingWindow, setDraggingWindow] = useState<'idcard' | 'terminal' | null>(null);
  const [resizingWindow, setResizingWindow] = useState<{ id: 'idcard' | 'terminal'; direction: string } | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef<{ startX: number; startY: number; startRect: WindowRect }>({
    startX: 0,
    startY: 0,
    startRect: { x: 0, y: 0, width: 0, height: 0 }
  });

  // Refs for outside click handling
  const placesRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live fluctuating network speed rates when Wi-Fi popup is open
  useEffect(() => {
    if (!isNetworkMenuOpen) return;
    const interval = setInterval(() => {
      setDownloadSpeed(+(81 + Math.random() * 8.4).toFixed(1));
      setUploadSpeed(+(28.5 + Math.random() * 5.2).toFixed(1));
      setPingLatency(Math.floor(10 + Math.random() * 4));
    }, 1800);
    return () => clearInterval(interval);
  }, [isNetworkMenuOpen]);

  const handleRunSpeedTest = () => {
    playUIClickSound();
    setIsSpeedTesting(true);
    setDownloadSpeed(118.4);
    setUploadSpeed(49.2);
    setPingLatency(8);
    setTimeout(() => {
      const nextDown = +(86 + Math.random() * 5).toFixed(1);
      const nextUp = +(32 + Math.random() * 4).toFixed(1);
      setIsSpeedTesting(false);
      setDownloadSpeed(nextDown);
      setUploadSpeed(nextUp);
      pushLinuxNotification({
        source: 'Network Manager',
        title: 'Speed Test Complete',
        message: `Down: ${nextDown} MB/s • Up: ${nextUp} MB/s • Ping: 8 ms on WolfNet-5G.`,
        category: 'network',
      });
    }, 2200);
  };

  // Sync sound settings
  useEffect(() => {
    const handleSoundChange = () => {
      setSoundEnabled(getSoundSettings().enabled);
    };
    window.addEventListener('sound-settings-changed', handleSoundChange);
    return () => window.removeEventListener('sound-settings-changed', handleSoundChange);
  }, []);

  // Open terminal on external command
  useEffect(() => {
    if (externalCommand) {
      setIsTerminalMinimized(false);
      setActivePane('terminal');
    }
  }, [externalCommand]);

  // Global Linux hotkey (Ctrl+Alt+T) to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') || (e.ctrlKey && e.key === '`')) {
        e.preventDefault();
        playEnterSound();
        setIsTerminalMinimized(prev => !prev);
        setActivePane('terminal');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-adjust window boundaries when screen size changes to prevent stretching/overflow
  useEffect(() => {
    const handleWindowResize = () => {
      const top = 34;
      const availableH = Math.max(300, window.innerHeight - top - 62);
      const availableW = window.innerWidth;

      setIdCardRect(prev => {
        const newH = Math.min(prev.height, availableH);
        const newW = Math.min(prev.width, Math.max(220, availableW - 40));
        const newX = Math.max(4, Math.min(prev.x, availableW - newW - 4));
        const newY = Math.max(top, Math.min(prev.y, window.innerHeight - 80));
        return { x: newX, y: newY, width: newW, height: newH };
      });

      setTerminalRect(prev => {
        const newH = Math.min(prev.height, availableH);
        const newW = Math.min(prev.width, Math.max(320, availableW - 40));
        const newX = Math.max(4, Math.min(prev.x, availableW - newW - 4));
        const newY = Math.max(top, Math.min(prev.y, window.innerHeight - 80));
        return { x: newX, y: newY, width: newW, height: newH };
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Determine if ID Card tab is narrow to adapt footer vertically
  const currentCardWidth = isIdCardMaximized ? (typeof window !== 'undefined' ? window.innerWidth : 800) : idCardRect.width;
  const isCardNarrow = currentCardWidth < 340;

  // Format date like screenshot: "Nov 9  11:16 AM"
  const formattedDateTime = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) + '  ' + currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (placesRef.current && !placesRef.current.contains(target)) setIsPlacesOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(target)) setIsCalendarOpen(false);
      if (trayRef.current && !trayRef.current.contains(target)) setIsSystemTrayOpen(false);
      if (networkRef.current && !networkRef.current.contains(target)) setIsNetworkMenuOpen(false);
      if (contextMenuRef.current && !contextMenuRef.current.contains(target)) setDesktopContextMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Desktop Background Right-Click Context Menu
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-rebuild="terminal"]') ||
      target.closest('[data-rebuild="profile"]') ||
      target.closest('[data-rebuild="bottom-bar"]') ||
      target.closest('header') ||
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }
    e.preventDefault();
    playUIClickSound();
    setDesktopContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 280)
    });
  };

  // Drag handlers
  const handleStartDrag = (e: React.PointerEvent, windowType: 'idcard' | 'terminal') => {
    if ((e.target as HTMLElement).closest('button')) return;
    if ((windowType === 'terminal' && isTerminalMaximized) || (windowType === 'idcard' && isIdCardMaximized)) return;
    setActivePane(windowType);
    setDraggingWindow(windowType);
    const rect = windowType === 'terminal' ? terminalRect : idCardRect;
    dragOffsetRef.current = {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Resize handlers
  const handleStartResize = (e: React.PointerEvent, windowType: 'idcard' | 'terminal', direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActivePane(windowType);
    setResizingWindow({ id: windowType, direction });
    const rect = windowType === 'terminal' ? terminalRect : idCardRect;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRect: { ...rect }
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Moving window
    if (draggingWindow) {
      const nx = Math.max(4, Math.min(window.innerWidth - 100, e.clientX - dragOffsetRef.current.x));
      const ny = Math.max(30, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y));
      if (draggingWindow === 'terminal') {
        setTerminalRect(prev => ({ ...prev, x: nx, y: ny }));
      } else {
        setIdCardRect(prev => ({ ...prev, x: nx, y: ny }));
      }
      return;
    }

    // 2. Resizing window
    if (resizingWindow) {
      const { id, direction } = resizingWindow;
      const { startX, startY, startRect } = resizeStartRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const minW = id === 'idcard' ? 220 : 320;
      const minH = 220;

      let newX = startRect.x;
      let newY = startRect.y;
      let newW = startRect.width;
      let newH = startRect.height;

      if (direction.includes('e')) {
        newW = Math.max(minW, startRect.width + dx);
      }
      if (direction.includes('s')) {
        newH = Math.max(minH, startRect.height + dy);
      }
      if (direction.includes('w')) {
        const potentialW = startRect.width - dx;
        if (potentialW >= minW) {
          newW = potentialW;
          newX = startRect.x + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialH = startRect.height - dy;
        if (potentialH >= minH) {
          newH = potentialH;
          newY = Math.max(30, startRect.y + dy);
        }
      }

      if (id === 'terminal') {
        setTerminalRect({ x: newX, y: newY, width: newW, height: newH });
      } else {
        setIdCardRect({ x: newX, y: newY, width: newW, height: newH });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingWindow || resizingWindow) {
      setDraggingWindow(null);
      setResizingWindow(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Toggle audio effects
  const handleToggleSound = () => {
    playUIClickSound();
    const updated = saveSoundSettings({ enabled: !soundEnabled });
    setSoundEnabled(updated.enabled);
    pushLinuxNotification({
      source: 'Audio Mixer',
      title: updated.enabled ? 'System Audio Unmuted' : 'System Audio Muted',
      message: updated.enabled ? 'Sound effects and terminal audio restored.' : 'Audio output muted.',
      category: 'system',
    });
  };

  // Apps list for GNOME App Grid launcher
  const allApps = [
    { id: 'terminal', name: 'Terminal', desc: 'Zsh shell & Kali pentest tools', icon: <GnomeTerminalIcon />, action: () => { setIsTerminalMinimized(false); setActivePane('terminal'); } },
    { id: 'projects', name: 'Projects Showcase', desc: 'AI/ML interactive projects deck', icon: <GnomeFolderIcon />, action: onOpenProjects },
    { id: 'blogs', name: 'Articles & Blogs', desc: 'Technical research & engineering blogs', icon: <GnomeBlogsIcon />, action: () => onOpenBlogs() },
    { id: 'idcard', name: '3D Holographic ID', desc: 'Interactive physics badge', icon: <GnomeDownloadsIcon />, action: () => { setIsIdCardMinimized(false); setActivePane('idcard'); } },
    { id: 'preview', name: 'Web Preview', desc: 'Portfolio OpenGraph social card', icon: <GnomeFirefoxIcon />, action: onOpenUrlPreview },
    { id: 'settings', name: 'Settings', desc: 'Themes, audio & system preferences', icon: <GnomeSettingsIcon />, action: onOpenSettings },
    { id: 'resume', name: 'Curriculum Vitae', desc: 'Download official CV / Resume PDF', icon: <GnomeResumeIcon />, action: onDownloadResume },
    { id: 'swarm', name: 'Swarm Rebuild', desc: 'Rebuild UI with swarm cursors', icon: <GnomeLightningIcon />, action: onTriggerSwarm },
    { id: 'undercover', name: 'Linux Undercover', desc: 'Switch disguise skin to Windows 11', icon: <span className="text-3xl">🎭</span>, action: onToggleUndercover },
  ];

  const filteredApps = allApps.filter(a => 
    a.name.toLowerCase().includes(appSearch.toLowerCase()) || 
    a.desc.toLowerCase().includes(appSearch.toLowerCase())
  );

  return (
    <div 
      className="h-[100dvh] w-screen relative overflow-hidden select-none font-sans bg-black"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleDesktopContextMenu}
      style={{
        backgroundImage: `url('${currentWallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        filter: `${brightness < 100 ? `brightness(${brightness}%)` : ''} ${isNightLightActive ? 'sepia(30%) saturate(115%)' : ''}`.trim() || undefined
      }}
    >
      {/* Interactive Screenshot Shutter Flash Effect */}
      {isScreenshotFlashing && (
        <div className="fixed inset-0 bg-white/70 pointer-events-none z-[100] transition-opacity duration-300" />
      )}
      {/* ================================================================= */}
      {/* 1. GNOME SHELL TOP BAR (PIXEL-ACCURATE TO REFERENCE SCREENSHOT)    */}
      {/* ================================================================= */}
      <header className="fixed top-0 left-0 right-0 h-7 bg-black/65 backdrop-blur-md border-b border-white/10 px-3 flex items-center justify-between text-white text-[12px] z-50 select-none font-sans">
        {/* Left Side: White Capsule/Pill, Dot, Apps, Places */}
        <div className="flex items-center gap-2 shrink-0">
          {/* White Capsule/Pill indicator matching screenshot */}
          <span className="w-3.5 h-1.5 rounded-full bg-white/90 inline-block shrink-0 shadow-sm" />

          {/* Dot */}
          <span className="text-white/60 text-[10px] leading-none">•</span>

          {/* Apps Button */}
          <button
            onClick={() => { playUIClickSound(); setIsAppGridOpen(prev => !prev); }}
            className="px-1.5 py-0.5 rounded hover:bg-white/15 transition-colors font-medium text-white/90 hover:text-white cursor-pointer"
          >
            Apps
          </button>

          {/* Places Dropdown */}
          <div className="relative" ref={placesRef}>
            <button
              onClick={() => { playUIClickSound(); setIsPlacesOpen(prev => !prev); }}
              className={`px-1.5 py-0.5 rounded transition-colors font-medium text-white/90 hover:text-white cursor-pointer ${isPlacesOpen ? 'bg-white/20' : 'hover:bg-white/15'}`}
            >
              Places
            </button>

            {isPlacesOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl bg-[#141416]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-1.5 z-50 text-xs flex flex-col gap-0.5 animate-slideInDown text-zinc-200">
                <button
                  onClick={() => { playUIClickSound(); setIsPlacesOpen(false); setIsTerminalMinimized(false); setActivePane('terminal'); onRunCommand('cd ~ && ls'); }}
                  className="px-2.5 py-1.5 rounded hover:bg-white/10 flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>🏠</span>
                  <span className="font-mono">Home (~)</span>
                </button>
                <button
                  onClick={() => { playUIClickSound(); setIsPlacesOpen(false); onOpenProjects(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-white/10 flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>📁</span>
                  <span>Projects Deck</span>
                </button>
                <button
                  onClick={() => { playUIClickSound(); setIsPlacesOpen(false); onOpenBlogs(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-white/10 flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>📝</span>
                  <span>Articles & Blogs</span>
                </button>
                <button
                  onClick={() => { playUIClickSound(); setIsPlacesOpen(false); onDownloadResume(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-white/10 flex items-center gap-2 text-left cursor-pointer"
                >
                  <span>📄</span>
                  <span>Downloads (Resume.pdf)</span>
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => { playUIClickSound(); setIsPlacesOpen(false); onTriggerSwarm(); }}
                  className="px-2.5 py-1.5 rounded hover:bg-cyan-500/20 text-cyan-400 flex items-center gap-2 text-left cursor-pointer font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Swarm Rebuild</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Date & Time ("Nov 9  11:16 AM") - Horizontally centered */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex items-center justify-center z-30" ref={calendarRef}>
          <button
            onClick={() => { playUIClickSound(); setIsCalendarOpen(prev => !prev); }}
            className={`px-2.5 py-0.5 rounded-md hover:bg-white/15 transition-all font-medium tracking-wide text-white/95 cursor-pointer flex items-center gap-1.5 ${isCalendarOpen ? 'bg-white/20 shadow-sm' : ''}`}
            title="Click for Calendar & Notification Center"
          >
            <span>{formattedDateTime}</span>
            {notifications.length > 0 && !isDndActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3584e4] shadow-[0_0_8px_#3584e4] inline-block" />
            )}
            {isDndActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] inline-block" />
            )}
          </button>

          {/* DUAL POPUP: EXACT GNOME 44 DESIGN MATCHING ATTACHED SCREENSHOT - SHIFTED LEFT & 25% TRANSPARENT */}
          {isCalendarOpen && (() => {
            const displayedMonthDate = new Date(
              currentTime.getFullYear(),
              currentTime.getMonth() + calendarMonthOffset,
              1
            );
            const displayedMonthName = displayedMonthDate.toLocaleDateString('en-US', { month: 'long' });
            const daysInDisplayedMonth = new Date(displayedMonthDate.getFullYear(), displayedMonthDate.getMonth() + 1, 0).getDate();
            const startDayOfDisplayedMonth = new Date(displayedMonthDate.getFullYear(), displayedMonthDate.getMonth(), 1).getDay();
            const daysInPrevMonth = new Date(displayedMonthDate.getFullYear(), displayedMonthDate.getMonth(), 0).getDate();
            const isCurrentMonthView = calendarMonthOffset === 0;
            const todayDateNum = currentTime.getDate();

            const totalSlots = (startDayOfDisplayedMonth + daysInDisplayedMonth) > 35 ? 42 : 35;
            const nextMonthDaysCount = totalSlots - (startDayOfDisplayedMonth + daysInDisplayedMonth);

            const activeEvents = calendarEvents[selectedCalendarDay] || [];

            const getCategoryIcon = (category: GnomeNotification['category']) => {
              switch (category) {
                case 'disguise': return <span className="text-xs">🎭</span>;
                case 'terminal': return <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />;
                case 'system': return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
                case 'security': return <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />;
                case 'network': return <Wifi className="w-3.5 h-3.5 text-amber-400" />;
                default: return <Bell className="w-3.5 h-3.5 text-zinc-400" />;
              }
            };

            const getActionLabel = (category: GnomeNotification['category']) => {
              switch (category) {
                case 'disguise': return 'Switch Disguise';
                case 'terminal': return 'Launch Shell';
                case 'system': return 'View 3D Badge';
                case 'security': return 'Security Audit';
                case 'network': return 'Host Preview';
                default: return 'Open';
              }
            };

            return (
              <div 
                className="absolute top-full left-1/2 -translate-x-[68%] max-md:-translate-x-1/2 mt-2 w-[720px] max-w-[95vw] rounded-[28px] bg-[#141416]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-7 z-50 text-xs animate-slideInDown text-white flex flex-col md:flex-row gap-8 selection:bg-[#3584e4] selection:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. LEFT PANE: NOTIFICATIONS (AUTHENTIC GNOME SCREENSHOT REPRODUCTION) */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] relative select-none">
                        {/* Outline Bell matching screenshot */}
                        <svg 
                          className="w-20 h-20 text-[#5a5a60]" 
                          viewBox="0 0 64 64" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.8" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M32 10c-1.6 0-3 1.3-3 3v2.2C22.3 17 17 23.5 17 31v10l-4 5v2h38v-2l-4-5V31c0-7.5-5.3-14-12-15.8V13c0-1.7-1.4-3-3-3z" />
                          <path d="M26 48c0 3.3 2.7 6 6 6s6-2.7 6-6" />
                        </svg>
                        <span className="text-[#727278] font-bold text-[17px] tracking-wide mt-3.5 select-none">
                          No Notifications
                        </span>

                        <button
                          onClick={restoreDefaultNotifications}
                          className="mt-4 text-[11px] text-zinc-500 hover:text-zinc-300 font-mono transition-colors cursor-pointer"
                          title="Restore default system notifications"
                        >
                          Restore default alerts
                        </button>
                      </div>

                      {/* Do Not Disturb Toggle */}
                      <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-white/80 text-[11px]">
                          {isDndActive ? <BellOff className="w-3.5 h-3.5 text-amber-400" /> : <Bell className="w-3.5 h-3.5 text-white/60" />}
                          <span>Do Not Disturb</span>
                        </div>
                        <button
                          onClick={() => {
                            playUIClickSound();
                            setIsDndActive(prev => !prev);
                          }}
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${isDndActive ? 'bg-amber-500' : 'bg-white/20'}`}
                          title={isDndActive ? 'Turn off Do Not Disturb' : 'Turn on Do Not Disturb'}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isDndActive ? 'translate-x-3.5 shadow-sm' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-[#3584e4]" />
                            <span className="font-semibold text-xs text-white">Notifications</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-[#3584e4]/20 text-[#3584e4] text-[10px] font-mono font-bold">
                              {notifications.length}
                            </span>
                          </div>
                          <button
                            onClick={clearAllNotifications}
                            className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear</span>
                          </button>
                        </div>

                        {/* Notifications Feed */}
                        <div className="overflow-y-auto max-h-[290px] space-y-2 pr-1 scrollbar-thin">
                          {notifications.map(n => (
                            <div
                              key={n.id}
                              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all text-left flex flex-col gap-1 shadow-sm"
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1.5 font-medium">
                                  {getCategoryIcon(n.category)}
                                  <span className="text-[#3584e4] font-semibold uppercase tracking-wider text-[9px] font-mono">{n.source}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white/40 text-[9px] font-mono">{formatNotificationTime(n.timestamp, n.time)}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(n.id);
                                    }}
                                    className="hover:text-red-400 text-white/40 transition-opacity p-0.5 rounded cursor-pointer"
                                    title="Dismiss notification"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="font-semibold text-[11px] text-white/95 leading-snug">
                                {n.title}
                              </div>
                              <div className="text-[10px] text-white/70 leading-relaxed">
                                {n.message}
                              </div>
                              <div className="pt-1 mt-0.5 flex items-center justify-between border-t border-white/[0.06]">
                                <button
                                  onClick={() => handleNotificationAction(n)}
                                  className="text-[10px] text-[#3584e4] hover:text-[#559df4] font-mono flex items-center gap-1 cursor-pointer font-medium hover:underline"
                                >
                                  <span>{getActionLabel(n.category)}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[9px] text-white/30 font-mono">id: {n.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Do Not Disturb Toggle */}
                      <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-white/80 text-[11px]">
                          {isDndActive ? <BellOff className="w-3.5 h-3.5 text-amber-400" /> : <Bell className="w-3.5 h-3.5 text-white/60" />}
                          <span>Do Not Disturb</span>
                        </div>
                        <button
                          onClick={() => {
                            playUIClickSound();
                            setIsDndActive(prev => !prev);
                          }}
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${isDndActive ? 'bg-amber-500' : 'bg-white/20'}`}
                          title={isDndActive ? 'Turn off Do Not Disturb' : 'Turn on Do Not Disturb'}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isDndActive ? 'translate-x-3.5 shadow-sm' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. RIGHT PANE: CALENDAR & AGENDA (MATCHING ATTACHED SCREENSHOT) */}
                <div className="w-[280px] shrink-0 flex flex-col justify-between">
                  <div>
                    {/* Day of Week & Date matching screenshot */}
                    <div className="text-left mb-4">
                      <div className="text-[13px] text-[#9a9aa0] font-normal tracking-wide">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-[21px] font-bold text-white tracking-tight mt-0.5">
                        {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '')}
                      </div>
                    </div>

                    {/* Month Switcher Row */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <button
                        onClick={() => {
                          playUIClickSound();
                          setCalendarMonthOffset(p => p - 1);
                        }}
                        className="text-[#9a9aa0] hover:text-white transition-colors p-1 cursor-pointer text-xs"
                        title="Previous Month"
                      >
                        <span>◀</span>
                      </button>
                      <button
                        onClick={() => {
                          playUIClickSound();
                          setCalendarMonthOffset(0);
                          setSelectedCalendarDay(todayDateNum);
                        }}
                        className="text-[13px] font-medium text-white hover:text-[#3584e4] transition-colors cursor-pointer tracking-wide"
                        title="Current Month"
                      >
                        {displayedMonthName}
                      </button>
                      <button
                        onClick={() => {
                          playUIClickSound();
                          setCalendarMonthOffset(p => p + 1);
                        }}
                        className="text-[#9a9aa0] hover:text-white transition-colors p-1 cursor-pointer text-xs"
                        title="Next Month"
                      >
                        <span>▶</span>
                      </button>
                    </div>

                    {/* Weekday Labels (S M T W T F S) */}
                    <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-medium text-[#9a9aa0] mb-2">
                      <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-y-2 text-center font-sans text-xs">
                      {/* Days from previous month (formatted with 2 digits) */}
                      {Array.from({ length: startDayOfDisplayedMonth }, (_, i) => {
                        const prevDay = daysInPrevMonth - startDayOfDisplayedMonth + 1 + i;
                        return (
                          <span 
                            key={`prev-${i}`} 
                            className="text-[#55555a] text-xs font-normal py-1 select-none cursor-default"
                          >
                            {String(prevDay).padStart(2, '0')}
                          </span>
                        );
                      })}

                      {/* Current month days (formatted with 2 digits) */}
                      {Array.from({ length: daysInDisplayedMonth }, (_, i) => {
                        const day = i + 1;
                        const isToday = isCurrentMonthView && day === todayDateNum;
                        const isSelected = day === selectedCalendarDay;
                        const hasEvents = !!calendarEvents[day]?.length;
                        const dayStr = String(day).padStart(2, '0');

                        return (
                          <button
                            key={`day-${day}`}
                            onClick={() => {
                              playUIClickSound();
                              setSelectedCalendarDay(day);
                            }}
                            className="py-0.5 flex items-center justify-center cursor-pointer transition-all relative"
                            title={`Select day ${day}`}
                          >
                            {isToday ? (
                              <span className="w-7 h-7 rounded-full bg-[#3584e4] text-white font-semibold text-xs flex items-center justify-center mx-auto shadow-sm">
                                {dayStr}
                              </span>
                            ) : isSelected ? (
                              <span className="w-7 h-7 rounded-full bg-white/20 text-white font-medium text-xs flex items-center justify-center mx-auto ring-1 ring-[#3584e4]">
                                {dayStr}
                              </span>
                            ) : (
                              <span className="w-7 h-7 rounded-full text-[#d0d0d5] hover:text-white hover:bg-white/10 flex items-center justify-center mx-auto text-xs font-normal transition-colors">
                                {dayStr}
                              </span>
                            )}
                            {hasEvents && !isToday && (
                              <span className="w-1 h-1 rounded-full bg-[#3584e4] absolute bottom-0.5" />
                            )}
                          </button>
                        );
                      })}

                      {/* Days from next month (formatted with 2 digits) */}
                      {Array.from({ length: nextMonthDaysCount }, (_, i) => (
                        <span 
                          key={`next-${i}`} 
                          className="text-[#55555a] text-xs font-normal py-1 select-none cursor-default"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      ))}
                    </div>

                    {/* Bottom "Today / No Events" Card matching screenshot */}
                    <div className="bg-[#2a2a2d]/70 border border-white/[0.04] rounded-[16px] p-3.5 mt-3 text-left">
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-semibold text-white/90">
                          Today
                        </div>
                        <button
                          onClick={() => setIsAddingEvent(p => !p)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono flex items-center gap-0.5 cursor-pointer"
                          title="Add quick note"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {isAddingEvent && (
                        <div className="mt-2 flex items-center gap-1">
                          <input
                            type="text"
                            value={newEventInput}
                            onChange={(e) => setNewEventInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddEvent();
                              if (e.key === 'Escape') setIsAddingEvent(false);
                            }}
                            placeholder="Add note..."
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-0.5 text-[10px] text-white placeholder-white/40 focus:outline-none focus:border-[#3584e4]"
                            autoFocus
                          />
                          <button
                            onClick={handleAddEvent}
                            className="px-2 py-0.5 bg-[#3584e4] text-white font-semibold rounded text-[10px] cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      )}

                      {activeEvents.length === 0 ? (
                        <div className="text-[12px] italic text-[#9a9aa0] mt-0.5">
                          No Events
                        </div>
                      ) : (
                        <div className="mt-1.5 space-y-1 max-h-[80px] overflow-y-auto scrollbar-thin">
                          {activeEvents.map(ev => (
                            <div key={ev.id} className="text-[11px] text-zinc-200 flex items-center justify-between">
                              <span className="truncate">{ev.title}</span>
                              <span className="text-[9px] font-mono text-zinc-400 ml-1 shrink-0">{ev.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Side: Windows 11 Undercover (Angled Windows Icon), Focus, Wi-Fi, Volume, Battery, Fullscreen, Power */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Windows 11 Undercover Disguise Button (Left of Focus, original angled Windows icon, icon only, hover shows "visit windows version") */}
          <button
            onClick={() => {
              playUIClickSound();
              onToggleUndercover();
            }}
            className="h-6 w-6 rounded hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer group"
            title="visit windows version"
            aria-label="visit windows version"
          >
            {/* Original Angled Windows Icon in 3D Perspective */}
            <svg className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path fill="#0078D4" d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.551L24 0v11.551H10.949V1.898zM0 12.6h9.75v9.451L0 20.7V12.6zm10.949 0H24V24l-13.051-1.898V12.6z"/>
            </svg>
          </button>

          {/* Focus Mode (Alarm Clock + Focus) */}
          <button
            onClick={() => {
              playUIClickSound();
              const next = !isFocusMode;
              setIsFocusMode(next);
              pushLinuxNotification({
                source: 'GNOME Clock',
                title: next ? 'Focus Mode Enabled' : 'Focus Mode Disabled',
                message: next ? 'Distraction-free focus session started.' : 'Focus timer ended.',
                category: 'system',
              });
            }}
            className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer text-[12px] font-medium ${
              isFocusMode ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40' : 'hover:bg-white/15 text-white/90'
            }`}
            title={isFocusMode ? 'Focus Mode Active' : 'Toggle Focus Mode'}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>

          {/* Wi-Fi / Network Status Trigger with IP & Details Popup */}
          <div className="relative" ref={networkRef}>
            <button
              onClick={() => {
                playUIClickSound();
                setIsNetworkMenuOpen(prev => !prev);
                setIsSystemTrayOpen(false);
              }}
              className={`p-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                isNetworkMenuOpen ? 'bg-white/20 text-[#3584e4]' : 'hover:bg-white/15 text-white/90'
              }`}
              title="Network & IP Details (wlan0: 10.10.14.88) - Click for Details"
            >
              <Wifi className="w-3.5 h-3.5" />
            </button>

            {/* Network Info & IP Details Popup - 10% Transparent (90% Opacity) */}
            {isNetworkMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-[390px] max-w-[95vw] rounded-[28px] bg-[#141416]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 z-50 text-xs animate-slideInDown text-white flex flex-col gap-3.5 pointer-events-auto selection:bg-[#3584e4] selection:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#3584e4]/20 flex items-center justify-center text-[#3584e4] shrink-0">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-[13px] flex items-center gap-1.5 leading-tight">
                        <span>WolfNet-5G</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      </div>
                      <span className="text-[10px] text-zinc-400">Wi-Fi 6 (802.11ax) • 5 GHz</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wide">
                    Connected
                  </span>
                </div>

                {/* Upload & Download Speed Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Download Speed Card */}
                  <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.06] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider font-semibold">Download</span>
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                        <ArrowDown className={`w-3.5 h-3.5 ${isSpeedTesting ? 'animate-bounce' : ''}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[18px] font-bold font-mono text-cyan-300 leading-none">
                        {downloadSpeed}
                      </span>
                      <span className="text-[11px] font-medium text-cyan-400/80">MB/s</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate">
                      {(downloadSpeed * 8).toFixed(0)} Mbps • Total: 1.42 GB
                    </span>
                  </div>

                  {/* Upload Speed Card */}
                  <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.06] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider font-semibold">Upload</span>
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                        <ArrowUp className={`w-3.5 h-3.5 ${isSpeedTesting ? 'animate-bounce' : ''}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[18px] font-bold font-mono text-emerald-300 leading-none">
                        {uploadSpeed}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400/80">MB/s</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate">
                      {(uploadSpeed * 8).toFixed(0)} Mbps • Total: 418 MB
                    </span>
                  </div>
                </div>

                {/* Latency & Signal Bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px]">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Latency:</span>
                    <strong className="font-mono text-white">{pingLatency} ms</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="text-zinc-400">Signal:</span>
                    <span className="font-mono text-emerald-400 font-medium">-42 dBm (98%)</span>
                  </div>
                </div>

                {/* Network IP & Interface Parameters Table */}
                <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/[0.06] flex flex-col gap-2 font-mono text-[11px]">
                  {/* IPv4 Address */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">IPv4 Address</span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-cyan-300 font-bold text-[12px] truncate">10.10.14.88</span>
                      <button
                        onClick={() => {
                          playUIClickSound();
                          navigator.clipboard?.writeText('10.10.14.88');
                          setCopiedIp(true);
                          setTimeout(() => setCopiedIp(false), 2000);
                          pushLinuxNotification({
                            source: 'Network Manager',
                            title: 'IPv4 Address Copied',
                            message: 'Copied 10.10.14.88 (wlan0) to clipboard.',
                            category: 'network',
                          });
                        }}
                        className="p-1 rounded-md hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy IPv4 Address"
                      >
                        {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* IPv6 Address */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">IPv6 Address</span>
                    <span className="text-zinc-300 text-[10.5px] truncate max-w-[200px]" title="fe80::1ff:fe23:4567:890a">
                      fe80::1ff:fe23:4567:890a
                    </span>
                  </div>

                  {/* Default Gateway */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">Default Gateway</span>
                    <span className="text-zinc-200">10.10.14.1</span>
                  </div>

                  {/* Subnet Mask */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">Subnet Mask</span>
                    <span className="text-zinc-200">255.255.255.0 (/24)</span>
                  </div>

                  {/* DNS Servers */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">DNS Servers</span>
                    <span className="text-zinc-200">1.1.1.1, 8.8.8.8</span>
                  </div>

                  {/* Hardware MAC */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400 font-sans shrink-0">Hardware (MAC)</span>
                    <span className="text-zinc-300 text-[10.5px]">52:54:00:c3:2a:19</span>
                  </div>

                  {/* Interface & Link Speed */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5">
                    <span className="text-zinc-400 font-sans shrink-0">Interface</span>
                    <span className="text-emerald-300 font-sans font-medium text-[11px] truncate">
                      wlan0 (1201 Mbps, Full Duplex)
                    </span>
                  </div>
                </div>

                {/* Diagnostics & Speed Test Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-0.5">
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsNetworkMenuOpen(false);
                      setIsTerminalMinimized(false);
                      setActivePane('terminal');
                      onRunCommand('ping -c 3 10.10.14.1');
                    }}
                    className="px-2 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors flex items-center justify-center gap-1.5 text-zinc-200 cursor-pointer text-[11px] font-medium"
                    title="Ping local network gateway"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Ping</span>
                  </button>
                  <button
                    onClick={handleRunSpeedTest}
                    disabled={isSpeedTesting}
                    className="px-2 py-2 rounded-xl bg-[#3584e4]/20 hover:bg-[#3584e4]/30 border border-[#3584e4]/30 transition-colors flex items-center justify-center gap-1.5 text-cyan-300 cursor-pointer text-[11px] font-medium"
                    title="Run live network speed test"
                  >
                    <Gauge className={`w-3.5 h-3.5 text-cyan-300 shrink-0 ${isSpeedTesting ? 'animate-spin' : ''}`} />
                    <span>{isSpeedTesting ? 'Testing...' : 'Speed Test'}</span>
                  </button>
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsNetworkMenuOpen(false);
                      setIsTerminalMinimized(false);
                      setActivePane('terminal');
                      onRunCommand('ip a');
                    }}
                    className="px-2 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors flex items-center justify-center gap-1.5 text-zinc-200 cursor-pointer text-[11px] font-medium"
                    title="View Linux IP configuration"
                  >
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>`ip a`</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* GNOME Quick Settings Cluster (Sound & Battery) - 10% Transparent (90% Opacity) */}
          <div className="relative" ref={trayRef}>
            <button
              onClick={() => {
                playUIClickSound();
                setIsSystemTrayOpen(prev => !prev);
                setIsNetworkMenuOpen(false);
              }}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-all ${
                isSystemTrayOpen ? 'bg-white/20 text-white shadow-sm' : 'hover:bg-white/15 text-white/90'
              }`}
              title="Quick Settings & System Tray (Sound, Battery, Power)"
            >
              {/* Volume Icon */}
              <span>
                {soundEnabled && volume > 0 ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                )}
              </span>

              {/* Battery Indicator */}
              <div className="flex items-center gap-0.5" title="Battery: 98% (Power Connected)">
                <div className="w-4 h-2 rounded-[2px] border border-white/80 p-0.5 flex items-center">
                  <div className="h-full w-[98%] bg-emerald-400 rounded-[1px]" />
                </div>
                <div className="w-0.5 h-1 bg-white/80 rounded-r-[1px]" />
              </div>

              {/* Small Down Arrow */}
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {/* GNOME 44 QUICK SETTINGS POPUP - 10% TRANSPARENT (90% OPACITY) */}
            {isSystemTrayOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-[380px] max-w-[95vw] rounded-[28px] bg-[#141416]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 z-50 text-xs animate-slideInDown text-white flex flex-col gap-4 pointer-events-auto selection:bg-[#3584e4] selection:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Volume Slider Row */}
                <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/[0.05]">
                  <button
                    onClick={() => {
                      playUIClickSound();
                      handleToggleSound();
                    }}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      soundEnabled && volume > 0 ? 'bg-[#3584e4]/20 text-[#3584e4]' : 'bg-red-500/20 text-red-400'
                    }`}
                    title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
                  >
                    {soundEnabled && volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundEnabled ? volume : 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      if (val > 0 && !soundEnabled) {
                        saveSoundSettings({ enabled: true });
                        setSoundEnabled(true);
                      }
                    }}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#3584e4]"
                  />
                  <span className="text-[11px] font-mono w-8 text-right text-zinc-300">
                    {soundEnabled ? `${volume}%` : '0%'}
                  </span>
                </div>

                {/* 2. Brightness Slider Row */}
                <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/[0.05]">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
                    <Sun className="w-4 h-4" />
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <span className="text-[11px] font-mono w-8 text-right text-zinc-300">
                    {brightness}%
                  </span>
                </div>

                {/* 3. GNOME Quick Toggle Pills Grid (2 columns) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Wi-Fi Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsNetworkMenuOpen(true);
                      setIsSystemTrayOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-[#3584e4] hover:bg-[#2e74c9] text-white flex items-center justify-between transition-colors cursor-pointer text-left shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wifi className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Wi-Fi</span>
                        <span className="text-[10px] text-white/80">WolfNet-5G</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                  </button>

                  {/* Bluetooth Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsBluetoothActive(prev => !prev);
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isBluetoothActive ? 'bg-[#3584e4] text-white' : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bluetooth className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Bluetooth</span>
                        <span className="text-[10px] opacity-80">{isBluetoothActive ? 'MX Master 3S' : 'Off'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-75">{isBluetoothActive ? 'On' : 'Off'}</span>
                  </button>

                  {/* Power Mode Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setPowerProfile(prev => prev === 'balanced' ? 'performance' : prev === 'performance' ? 'power-saver' : 'balanced');
                    }}
                    className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className={`w-4 h-4 ${powerProfile === 'performance' ? 'text-amber-400' : powerProfile === 'power-saver' ? 'text-emerald-400' : 'text-cyan-400'}`} />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Power Mode</span>
                        <span className="text-[10px] capitalize text-zinc-400">{powerProfile}</span>
                      </div>
                    </div>
                  </button>

                  {/* Night Light Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      const next = !isNightLightActive;
                      setIsNightLightActive(next);
                      pushLinuxNotification({
                        source: 'Display Settings',
                        title: next ? 'Night Light Enabled' : 'Night Light Disabled',
                        message: next ? 'Warm color temperature applied to reduce eye strain.' : 'Restored standard display color profile.',
                        category: 'system',
                      });
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isNightLightActive ? 'bg-[#3584e4] text-white' : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Night Light</span>
                        <span className="text-[10px] opacity-80">{isNightLightActive ? 'Active' : 'Off'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-75">{isNightLightActive ? 'On' : 'Off'}</span>
                  </button>

                  {/* Dark Style Pill */}
                  <div className="p-3 rounded-2xl bg-[#3584e4] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Dark Style</span>
                        <span className="text-[10px] text-white/80">Default GNOME</span>
                      </div>
                    </div>
                    <Check className="w-3.5 h-3.5 text-white/80" />
                  </div>

                  {/* Do Not Disturb Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsDndActive(prev => !prev);
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isDndActive ? 'bg-amber-600/90 text-white' : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDndActive ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">DND</span>
                        <span className="text-[10px] opacity-80">{isDndActive ? 'Active' : 'Off'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-75">{isDndActive ? 'On' : 'Off'}</span>
                  </button>

                  {/* Airplane Mode Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      const next = !isAirplaneMode;
                      setIsAirplaneMode(next);
                      pushLinuxNotification({
                        source: 'Network Manager',
                        title: next ? 'Airplane Mode Enabled' : 'Airplane Mode Disabled',
                        message: next ? 'Wireless interfaces suspended.' : 'Wireless interfaces restored.',
                        category: 'network',
                      });
                    }}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isAirplaneMode ? 'bg-[#3584e4] text-white' : 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Plane className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Airplane</span>
                        <span className="text-[10px] opacity-80">{isAirplaneMode ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-75">{isAirplaneMode ? 'On' : 'Off'}</span>
                  </button>

                  {/* Screenshot Pill */}
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsScreenshotFlashing(true);
                      setTimeout(() => setIsScreenshotFlashing(false), 300);
                      pushLinuxNotification({
                        source: 'GNOME Screenshot',
                        title: 'Screenshot Captured',
                        message: `Saved workspace capture to ~/Pictures/Screenshot_${new Date().toISOString().slice(11, 19).replace(/:/g, '-')}.png`,
                        category: 'system',
                      });
                    }}
                    className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[12px]">Screenshot</span>
                        <span className="text-[10px] text-zinc-400">Capture area</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* 4. Battery Status Card */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-3 rounded-[3px] border border-emerald-400 p-0.5 flex items-center">
                      <div className="h-full w-[98%] bg-emerald-400 rounded-[1px]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[12px]">Battery: 98%</span>
                      <span className="text-[10px] text-zinc-400">4 hrs 25 mins remaining • Power Connected</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                    Charging
                  </span>
                </div>

                {/* 5. Footer Quick Actions (Settings, Lock, Restart, Power Off) */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsSystemTrayOpen(false);
                      onOpenSettings();
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-zinc-300 hover:text-white cursor-pointer"
                    title="Settings"
                  >
                    <SettingsIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsSystemTrayOpen(false);
                      onLogOut();
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-zinc-300 hover:text-white cursor-pointer"
                    title="Lock Screen"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsSystemTrayOpen(false);
                      onRestart();
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors text-zinc-300 cursor-pointer"
                    title="Reboot System"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playUIClickSound();
                      setIsSystemTrayOpen(false);
                      onPowerOff();
                    }}
                    className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Power Off"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Full Screen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1 rounded hover:bg-white/15 text-white/85 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen (F11)"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. WINDOWS: 20% ID CARD (LEFT) & 80% TERMINAL (RIGHT)             */}
      {/* Both can be dragged, resized, and minimized without expanding     */}
      {/* ================================================================= */}

      {/* LEFT WINDOW: 3D HOLOGRAPHIC ID CARD (20% DEFAULT) */}
      {!isIdCardMinimized && (
        <div
          data-rebuild="profile"
          onClick={() => setActivePane('idcard')}
          style={
            isIdCardMaximized
              ? { left: 8, top: 32, width: 'calc(100vw - 16px)', height: 'calc(100vh - 32px - 58px)', zIndex: 35 }
              : {
                  left: `${idCardRect.x}px`,
                  top: `${idCardRect.y}px`,
                  width: `${idCardRect.width}px`,
                  height: `${idCardRect.height}px`,
                  zIndex: activePane === 'idcard' ? 30 : 20
                }
          }
          className={`
            fixed rounded-[10px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]
            bg-[#0a0d14]/90 backdrop-blur-2xl flex flex-col overflow-hidden select-none
            transition-shadow
            ${activePane === 'idcard' ? 'ring-1 ring-cyan-500/40' : 'opacity-95'}
          `}
        >
          {/* ID Card Window Header (Draggable) */}
          <div 
            onPointerDown={(e) => handleStartDrag(e, 'idcard')}
            className="h-8 bg-[#151922]/95 border-b border-white/10 px-2.5 flex items-center justify-between select-none shrink-0 cursor-grab active:cursor-grabbing"
            title="Click & drag to move window"
          >
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold truncate">
              <span>🪪</span>
              <span className="truncate">ID Card</span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => { playUIClickSound(); setIsIdCardMinimized(true); }}
                className="w-5 h-5 rounded hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize ID Card"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => { playUIClickSound(); setIsIdCardMaximized(!isIdCardMaximized); }}
                className="w-5 h-5 rounded hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isIdCardMaximized ? "Restore" : "Maximize"}
              >
                <Square className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => { playUIClickSound(); setIsIdCardMinimized(true); }}
                className="w-5 h-5 rounded hover:bg-red-500 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close ID Card"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ID Card 3D Canvas Body */}
          <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent to-black/40">
            <IdCard isMobile={false} />

            {/* Social Links & Contact Footer (Adapts to width: vertical if narrow, horizontal if wide) */}
            <div className={`absolute bottom-2.5 left-2 right-2 flex ${isCardNarrow ? 'flex-col items-center gap-2' : 'flex-row items-center justify-between gap-1.5'} pointer-events-auto z-20 transition-all duration-200`}>
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shrink-0 shadow-lg">
                <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors p-0.5 shrink-0" title="GitHub">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors p-0.5 shrink-0" title="LinkedIn">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href={SOCIALS.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-cyan-400 transition-colors p-0.5 shrink-0" title="Twitter / X">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>

              <StarBorder
                as="button"
                color={currentTheme.colors.primary}
                speed="5s"
                thickness={1}
                onClick={() => {
                  setIsTerminalMinimized(false);
                  setActivePane('terminal');
                  onRunCommand('contact');
                }}
                className="shrink-0 cursor-pointer"
                title="Contact Moniruzzaman Rishad"
              >
                <span className="text-[11px] font-semibold px-2 py-0.5 whitespace-nowrap">Contact</span>
              </StarBorder>
            </div>
          </div>

          {/* Resize Handles (E, S, SE) */}
          {!isIdCardMaximized && (
            <>
              <div onPointerDown={(e) => handleStartResize(e, 'idcard', 'e')} className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-cyan-500/20" />
              <div onPointerDown={(e) => handleStartResize(e, 'idcard', 's')} className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-cyan-500/20" />
              <div onPointerDown={(e) => handleStartResize(e, 'idcard', 'se')} className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize hover:bg-cyan-500/40 z-30" />
            </>
          )}
        </div>
      )}

      {/* RIGHT WINDOW: TERMINAL (80% DEFAULT) */}
      {!isTerminalMinimized && (
        <div
          data-rebuild="terminal"
          onClick={() => setActivePane('terminal')}
          style={
            isTerminalMaximized
              ? { left: 8, top: 32, width: 'calc(100vw - 16px)', height: 'calc(100vh - 32px - 58px)', zIndex: 35 }
              : {
                  left: `${terminalRect.x}px`,
                  top: `${terminalRect.y}px`,
                  width: `${terminalRect.width}px`,
                  height: `${terminalRect.height}px`,
                  zIndex: activePane === 'terminal' ? 30 : 20
                }
          }
          className={`
            fixed rounded-[10px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]
            bg-[#0a0d14]/90 backdrop-blur-2xl flex flex-col overflow-hidden select-none
            transition-shadow
            ${activePane === 'terminal' ? 'ring-1 ring-cyan-500/40' : 'opacity-95'}
          `}
        >
          {/* Terminal Window Header (Draggable) */}
          <div 
            onPointerDown={(e) => handleStartDrag(e, 'terminal')}
            className="h-8 bg-[#151922]/95 border-b border-white/10 px-3 flex items-center justify-between select-none shrink-0 cursor-grab active:cursor-grabbing"
            title="Click & drag to move window"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-white/90 truncate">
              <span className="text-cyan-400 font-bold">&gt;_</span>
              <span className="font-semibold truncate">Terminal — rishad@linux-portfolio: ~ (zsh)</span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playUIClickSound();
                  onTriggerSwarm();
                }}
                className="px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-semibold flex items-center gap-1 transition-all mr-1 cursor-pointer"
                title="Rebuild website UI with Swarm Cursors"
              >
                <Sparkles className="w-3 h-3 text-cyan-400 group-hover:text-black transition-transform" />
                <span>Rebuild</span>
              </button>

              <button
                onClick={() => { playUIClickSound(); setIsTerminalMinimized(true); }}
                className="w-5 h-5 rounded hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize Terminal"
              >
                <Minus className="w-3 h-3" />
              </button>

              <button
                onClick={() => { playUIClickSound(); setIsTerminalMaximized(!isTerminalMaximized); }}
                className="w-5 h-5 rounded hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isTerminalMaximized ? "Restore" : "Maximize"}
              >
                <Square className="w-2.5 h-2.5" />
              </button>

              <button
                onClick={() => { playUIClickSound(); setIsTerminalMinimized(true); }}
                className="w-5 h-5 rounded hover:bg-red-500 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Terminal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 w-full h-[calc(100%-2rem)] overflow-hidden relative">
            <Terminal 
              commandHistory={commandHistory}
              setCommandHistory={setCommandHistory}
              externalCommand={externalCommand}
              onCommandComplete={onCommandComplete}
              onRestart={onRestart}
              onPowerOff={onPowerOff}
              onLogOut={onLogOut}
              onOpenBlogsModal={onOpenBlogs}
              onOpenProjectsModal={onOpenProjects}
              onOpenUrlPreview={onOpenUrlPreview}
              onTriggerSwarm={onTriggerSwarm}
              isUndercover={false}
              onToggleUndercover={onToggleUndercover}
              isMobile={false}
            />
          </div>

          {/* Resize Handles (W, E, S, SE, SW) */}
          {!isTerminalMaximized && (
            <>
              <div onPointerDown={(e) => handleStartResize(e, 'terminal', 'w')} className="absolute top-0 left-0 w-2 h-full cursor-ew-resize hover:bg-cyan-500/20" />
              <div onPointerDown={(e) => handleStartResize(e, 'terminal', 'e')} className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-cyan-500/20" />
              <div onPointerDown={(e) => handleStartResize(e, 'terminal', 's')} className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-cyan-500/20" />
              <div onPointerDown={(e) => handleStartResize(e, 'terminal', 'se')} className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize hover:bg-cyan-500/40 z-30" />
              <div onPointerDown={(e) => handleStartResize(e, 'terminal', 'sw')} className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize hover:bg-cyan-500/40 z-30" />
            </>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. GNOME BOTTOM DOCK (BALANCED GAPS & REDUCED ROUNDNESS)           */}
      {/* ================================================================= */}
      <div 
        data-rebuild="bottom-bar"
        className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 bg-[#161616]/85 hover:bg-[#161616]/95 backdrop-blur-2xl border border-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 sm:gap-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] select-none transition-all max-w-[calc(100vw-16px)] overflow-x-auto scrollbar-hide shrink-0"
      >
        {/* 1. Terminal (>_) */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsTerminalMinimized(prev => !prev);
            setActivePane('terminal');
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Terminal (zsh / bash)"
        >
          <GnomeTerminalIcon />
          <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all ${!isTerminalMinimized ? 'w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'w-1 h-1 bg-white/40'}`} />
        </button>

        {/* 2. Visual Studio Code */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsTerminalMinimized(false);
            setActivePane('terminal');
            onRunCommand('code .');
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Visual Studio Code (IDE & Code Editor)"
        >
          <GnomeVSCodeIcon />
        </button>

        {/* 3. Files / Blogs Explorer */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenBlogs();
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Files (Blogs Explorer)"
        >
          <GnomeFolderIcon />
        </button>

        {/* 4. Firefox Web Browser */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenUrlPreview();
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Firefox Browser (Social & Preview Cards)"
        >
          <GnomeFirefoxIcon />
        </button>

        {/* 5. Lightning Bolt (AI Agents / Fast Code) */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsTerminalMinimized(false);
            setActivePane('terminal');
            onRunCommand('whoami && neofetch');
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="AI Agents & System Telemetry"
        >
          <GnomeLightningIcon />
        </button>

        {/* 6. VLC Media Player */}
        <button
          onClick={handleToggleSound}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title={soundEnabled ? 'VLC Audio Active (Click to Mute)' : 'VLC Audio Muted (Click to Unmute)'}
        >
          <GnomeVlcIcon />
        </button>

        {/* 7. Settings */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenSettings();
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="System Settings & Themes"
        >
          <GnomeSettingsIcon />
        </button>

        {/* 8. Icon right to system settings: Project Explorer */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenProjects();
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Project Explorer"
        >
          <GnomeBlogsIcon />
        </button>

        {/* 9. Resume / CV Document */}
        <button
          onClick={() => {
            playUIClickSound();
            onDownloadResume();
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Curriculum Vitae (Download Resume PDF)"
        >
          <GnomeResumeIcon />
        </button>

        {/* 10. Downloads / 3D Holographic ID Card */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsIdCardMinimized(prev => !prev);
            setActivePane('idcard');
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="3D Holographic ID Card Badge"
        >
          <GnomeDownloadsIcon />
          <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all ${!isIdCardMinimized ? 'w-1.5 h-1.5 bg-cyan-400' : 'w-1 h-1 bg-white/40'}`} />
        </button>

        {/* 11. Spotlight Search (Mac-style Search Bar) */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsSpotlightOpen(true);
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Spotlight Search (Mac style)"
        >
          <GnomeSearchIcon />
        </button>

        {/* 12. App Grid Launcher (9 Dots) */}
        <button
          onClick={() => {
            playUIClickSound();
            setIsAppGridOpen(true);
          }}
          className="relative group cursor-pointer hover:-translate-y-1 transition-transform shrink-0"
          title="Show Applications (Activities Overview)"
        >
          <GnomeGridIcon />
        </button>
      </div>

      {/* ================================================================= */}
      {/* 4. GNOME ACTIVITIES / APP GRID OVERLAY MODAL                       */}
      {/* ================================================================= */}
      {isAppGridOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0d0f14]/90 backdrop-blur-3xl flex flex-col items-center p-6 animate-fadeIn text-white"
          onClick={() => setIsAppGridOpen(false)}
        >
          <div 
            className="w-full max-w-lg mt-8 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full relative">
              <Search className="w-5 h-5 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Type to search apps, commands, blogs..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-sans"
                autoFocus
              />
            </div>
          </div>

          <div 
            className="w-full max-w-4xl mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 sm:gap-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  playUIClickSound();
                  setIsAppGridOpen(false);
                  app.action();
                }}
                className="flex flex-col items-center p-3 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {app.icon}
                </div>
                <span className="mt-2.5 font-medium text-xs text-white/90 group-hover:text-cyan-300 text-center">
                  {app.name}
                </span>
                <span className="text-[10px] text-white/50 text-center truncate max-w-full">
                  {app.desc}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto mb-4 text-xs text-white/40 font-mono">
            Press Esc or click anywhere to exit Activities overview
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. LINUX DESKTOP RIGHT-CLICK CONTEXT MENU                         */}
      {/* ================================================================= */}
      {desktopContextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: desktopContextMenu.y, left: desktopContextMenu.x }}
          className="fixed z-50 w-56 rounded-xl bg-[#16181e]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-1.5 text-xs text-zinc-200 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              setIsWallpaperModalOpen(true);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 text-left flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">Change Wallpaper...</span>
          </button>

          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              // Reset tab positions to default 20% and 80% split
              const top = 34;
              const defaultHeight = Math.max(320, window.innerHeight - top - 62);
              const marginX = 12;
              const gap = 8;
              const availableWidth = Math.max(540, window.innerWidth - marginX * 2 - gap);
              const defaultWidth = Math.max(220, Math.floor(availableWidth * 0.20));
              const defaultStartX = marginX + defaultWidth + gap;
              const termWidth = Math.max(320, availableWidth - defaultWidth);

              setIdCardRect({ x: marginX, y: top, width: defaultWidth, height: defaultHeight });
              setTerminalRect({ x: defaultStartX, y: top, width: termWidth, height: defaultHeight });
              setIsIdCardMinimized(false);
              setIsTerminalMinimized(false);
              setIsIdCardMaximized(false);
              setIsTerminalMaximized(false);
              setActivePane('terminal');
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white/70" />
            <span>Reset Split (20% / 80%)</span>
          </button>

          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              setIsTerminalMinimized(true);
              setIsIdCardMinimized(true);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-white/70" />
            <span>Show Desktop (Minimize All)</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              onTriggerSwarm();
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left flex items-center gap-2 cursor-pointer transition-colors text-cyan-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Swarm Rebuild</span>
          </button>

          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              onToggleUndercover();
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-[#0078d4]/20 hover:text-blue-300 text-left flex items-center gap-2 cursor-pointer transition-colors"
          >
            {/* Windows 11 4-Quadrant Blue Icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 88 88" fill="none">
              <path d="M0 0H41V41H0V0Z" fill="#00ADEF"/>
              <path d="M47 0H88V41H47V0Z" fill="#00ADEF"/>
              <path d="M0 47H41V88H0V47Z" fill="#00ADEF"/>
              <path d="M47 47H88V88H47V47Z" fill="#00ADEF"/>
            </svg>
            <span>Switch Undercover (Win 11)</span>
          </button>

          <button
            onClick={() => {
              playUIClickSound();
              setDesktopContextMenu(null);
              onOpenSettings();
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left flex items-center gap-2 cursor-pointer transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-white/70" />
            <span>Settings</span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. WALLPAPER CHOOSER MODAL (PERSISTENT IN LOCALSTORAGE)           */}
      {/* ================================================================= */}
      {isWallpaperModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsWallpaperModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl max-h-[85vh] bg-[#14161c] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100">Desktop Background</h3>
                  <p className="text-[11px] text-zinc-400">Choose a curated wallpaper or upload your own (saved in persistent storage)</p>
                </div>
              </div>
              <button
                onClick={() => setIsWallpaperModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* Presets Grid */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Curated Wallpapers
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVAILABLE_WALLPAPERS.map(wp => {
                    const isSelected = currentWallpaper === wp.url;
                    return (
                      <button
                        key={wp.id}
                        onClick={() => handleSelectWallpaper(wp.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer aspect-video flex flex-col justify-end p-2 ${
                          isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg' : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{
                          backgroundImage: `url('${wp.url}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />
                        <div className="relative z-10">
                          <div className="text-[11px] font-semibold text-white truncate drop-shadow-sm flex items-center justify-between">
                            <span>{wp.name}</span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                            )}
                          </div>
                          <div className="text-[9px] text-zinc-300 truncate opacity-80">{wp.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL or Upload */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Custom Wallpaper
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={customWallpaperInput}
                      onChange={(e) => setCustomWallpaperInput(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      onClick={() => {
                        if (customWallpaperInput.trim()) {
                          handleSelectWallpaper(customWallpaperInput.trim());
                          setCustomWallpaperInput('');
                        }
                      }}
                      disabled={!customWallpaperInput.trim()}
                      className="px-3 h-9 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  <label className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            const result = uploadEvent.target?.result as string;
                            if (result) {
                              handleSelectWallpaper(result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-black/40 text-xs">
              <button
                onClick={() => handleSelectWallpaper('/img/Landscape_wallpaper.png')}
                className="text-zinc-400 hover:text-white underline cursor-pointer text-[11px]"
              >
                Reset to Default Rishad Wallpaper
              </button>
              <button
                onClick={() => setIsWallpaperModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/20 text-white font-medium cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. MAC-LIKE SPOTLIGHT SEARCH MODAL                                */}
      {/* ================================================================= */}
      {isSpotlightOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4 animate-fadeIn"
          onClick={() => setIsSpotlightOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#1c202a]/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-white animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={spotlightInputRef}
                type="text"
                value={spotlightQuery}
                onChange={(e) => {
                  setSpotlightQuery(e.target.value);
                  setSpotlightActiveIndex(0);
                }}
                onKeyDown={handleSpotlightKeyDown}
                placeholder="Spotlight Search... (e.g., Blogs, Projects, Terminal, Neofetch)"
                className="flex-1 bg-transparent text-base text-white placeholder-white/40 focus:outline-none font-sans"
              />
              {spotlightQuery ? (
                <button
                  onClick={() => {
                    setSpotlightQuery('');
                    setSpotlightActiveIndex(0);
                    spotlightInputRef.current?.focus();
                  }}
                  className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/50 font-mono">
                  ESC to close
                </kbd>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/20">
              {filteredSpotlightItems.length === 0 ? (
                <div className="py-12 px-4 text-center text-sm text-white/50 flex flex-col items-center gap-2">
                  <Search className="w-8 h-8 text-white/20" />
                  <p>No results found for &ldquo;{spotlightQuery}&rdquo;</p>
                  <p className="text-xs text-white/30">Try searching for Blogs, Projects, Terminal, or shell commands</p>
                </div>
              ) : (
                filteredSpotlightItems.map((item, idx) => {
                  const isSelected = idx === spotlightActiveIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleExecuteSpotlightItem(item)}
                      onMouseEnter={() => setSpotlightActiveIndex(idx)}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-white shadow-[inset_0_0_0_1px_rgba(6,182,212,0.4)]' 
                          : 'hover:bg-white/10 text-zinc-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base shrink-0 select-none shadow-inner">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-white truncate">{item.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-mono font-semibold tracking-wider ${
                            item.category === 'Application' ? 'bg-blue-500/20 text-blue-300' :
                            item.category === 'Command' ? 'bg-emerald-500/20 text-emerald-300' :
                            item.category === 'Feature' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 truncate mt-0.5">{item.subtitle}</div>
                      </div>
                      <div className="shrink-0 text-white/30 text-xs">
                        {isSelected && <span className="font-mono text-[11px] text-cyan-400 font-semibold">↵ Open</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Spotlight Footer */}
            <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{filteredSpotlightItems.length} {filteredSpotlightItems.length === 1 ? 'result' : 'results'}</span>
                <span>•</span>
                <span>Spotlight ⌘K</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinuxGnomeDesktop;

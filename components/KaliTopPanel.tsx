import React, { useState, useEffect } from 'react';
import { FolderGit2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { playUIClickSound } from '../utils/soundEffects';

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
  onTriggerSwarm?: () => void;
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
  onTriggerSwarm
}) => {
  const { currentTheme } = useTheme();
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

  return (
    <header className="h-10 sm:h-11 px-3 sm:px-4 bg-[#131722]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between select-none relative z-40 text-white font-mono shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Left: Project Showcase & 3D Interactive Deck Badge matching attached reference */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            playUIClickSound();
            onOpenProjects();
          }}
          className="flex items-center gap-2 group cursor-pointer text-left"
          title="Open Projects Showcase (3D Interactive Deck)"
        >
          <FolderGit2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="text-xs font-bold tracking-wider uppercase text-white group-hover:text-emerald-400 transition-colors">
            PROJECTS SHOWCASE
          </span>
        </button>

        {/* 3D Interactive Deck pill badge */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenProjects();
          }}
          className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm"
          title="Launch 3D Interactive Deck"
        >
          3D Interactive Deck
        </button>
      </div>

      {/* Center / Right Shortcuts: Clean, professional navigation & Rebuild */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Terminal Tab */}
        <button
          onClick={() => {
            playUIClickSound();
            onSelectWorkspace?.(1);
          }}
          className={`hidden md:inline-flex px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            activeWorkspace === 1
              ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
          }`}
          title="Terminal Workspace [1]"
        >
          Terminal
        </button>

        {/* Blogs Tab */}
        <button
          onClick={() => {
            playUIClickSound();
            onOpenBlogs();
          }}
          className="hidden md:inline-flex px-2 py-0.5 rounded text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          title="Read Tech Articles & Blogs"
        >
          Blogs
        </button>

        {/* Swarm Rebuild Action Button */}
        <button
          onClick={() => {
            playUIClickSound();
            onTriggerSwarm?.();
          }}
          className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer shadow-sm"
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

        {/* Linux Undercover Disguise Toggle */}
        <button
          onClick={() => {
            playUIClickSound();
            onToggleUndercover();
          }}
          className="px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 hover:border-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
          title="Toggle linux-undercover (Windows 11 disguise)"
        >
          <span>🎭</span>
          <span className="hidden lg:inline">linux-undercover</span>
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-white/10 mx-0.5 sm:mx-1" />

        {/* Right: The 3 Window Control Dots matching attached reference (Yellow, Green, Cyan) */}
        <div className="flex items-center gap-1.5 pl-0.5">
          {/* Yellow Dot: Restart OS / Reload Session */}
          <button
            onClick={() => {
              playUIClickSound();
              onRestart();
            }}
            className="w-3 h-3 rounded-full bg-[#f5a623] hover:scale-125 transition-transform cursor-pointer shadow-[0_0_8px_rgba(245,166,35,0.4)]"
            title="Restart Linux Environment"
          />

          {/* Green Dot: Maximize / Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:scale-125 transition-transform cursor-pointer shadow-[0_0_8px_rgba(39,201,63,0.4)]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen (F11)"}
          />

          {/* Cyan/Blue Dot: Disguise Switch / Lock / Power */}
          <button
            onClick={() => {
              playUIClickSound();
              onToggleUndercover();
            }}
            className="w-3 h-3 rounded-full bg-[#00f0ff] hover:scale-125 transition-transform cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            title="Toggle linux-undercover disguise"
          />
        </div>
      </div>
    </header>
  );
};

export default KaliTopPanel;

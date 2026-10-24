import React, { useEffect, useRef } from 'react';
import { 
  X, 
  History, 
  Layers, 
  Download, 
  Settings, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenProjects: () => void;
  onDownloadResume: () => void;
  onOpenSettings: () => void;
  onRestart: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenHistory,
  onOpenProjects,
  onDownloadResume,
  onOpenSettings,
  onRestart
}) => {
  const { currentTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'history',
      label: 'Command History',
      sub: 'View terminal logs & history',
      icon: <History className="w-4 h-4 text-terminal-primary" />,
      onClick: () => {
        onClose();
        onOpenHistory();
      }
    },
    {
      id: 'projects',
      label: 'Projects Showcase',
      sub: 'Interactive stack & applications',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      onClick: () => {
        onClose();
        onOpenProjects();
      }
    },
    {
      id: 'resume',
      label: 'Download Resume',
      sub: 'Download PDF Curriculum Vitae',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      onClick: () => {
        onClose();
        onDownloadResume();
      }
    },
    {
      id: 'settings',
      label: 'Settings & Themes',
      sub: 'Custom colors, sounds & styles',
      icon: <Settings className="w-4 h-4 text-amber-400" />,
      onClick: () => {
        onClose();
        onOpenSettings();
      }
    },
    {
      id: 'restart',
      label: 'Reload System',
      sub: 'Reboot & clear shell state',
      icon: <RotateCcw className="w-4 h-4 text-red-400" />,
      onClick: () => {
        onClose();
        onRestart();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Menu Card */}
      <div
        ref={menuRef}
        className="relative z-10 w-72 max-w-[85vw] h-full bg-terminal-black border-l border-terminal-primary/30 p-4 shadow-2xl flex flex-col justify-between overflow-y-auto"
        style={{
          boxShadow: `-10px 0 30px rgba(0,0,0,0.85), -2px 0 10px ${currentTheme.colors.primary}25`
        }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-terminal-dim/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terminal-primary animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-terminal-primary tracking-wider uppercase">
                SYSTEM MENU
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-terminal-text-dim hover:text-terminal-primary hover:bg-terminal-dim/30 transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick System Badge */}
          <div className="mb-4 p-2.5 rounded-lg bg-terminal-dim/20 border border-terminal-dim/40 font-mono text-xs space-y-1">
            <div className="text-terminal-text-dim text-[10px]">HOST & USER</div>
            <div className="text-terminal-primary font-bold">rishad@kali-portfolio</div>
            <div className="text-terminal-text-dim text-[10px] flex items-center justify-between pt-1 border-t border-terminal-dim/30">
              <span>TTY1 / zsh 5.9</span>
              <span className="text-terminal-green">ONLINE ●</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1.5 font-mono">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all group bg-terminal-dim/15 hover:bg-terminal-primary/15 border border-terminal-dim/30 hover:border-terminal-primary/50 text-terminal-text hover:text-terminal-primary cursor-pointer"
              >
                <div className="p-2 rounded-md bg-terminal-black/60 border border-terminal-dim/40 group-hover:border-terminal-primary/40 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate group-hover:text-terminal-primary">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-terminal-text-dim truncate">
                    {item.sub}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-terminal-dim group-hover:text-terminal-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-terminal-dim/40 font-mono text-[11px] text-terminal-text-dim flex items-center justify-between">
          <span>PORTFOLIO OS</span>
          <span className="text-terminal-primary/70">v2.6.4</span>
        </div>
      </div>
    </div>
  );
};

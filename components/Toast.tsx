import React, { useEffect, useState, useRef } from 'react';
import { playUIClickSound } from '../utils/soundEffects';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  isUndercover?: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3800, isUndercover = false }) => {
  const [isExiting, setIsExiting] = useState(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const isLinuxDnd =
    !isUndercover &&
    typeof window !== 'undefined' &&
    localStorage.getItem('linux_gnome_dnd') === 'true';

  useEffect(() => {
    if (isLinuxDnd) {
      onCloseRef.current?.();
      return;
    }

    const exitTime = Math.max(0, duration - 350);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, exitTime);

    const closeTimer = setTimeout(() => {
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, isLinuxDnd]);

  if (isLinuxDnd) return null;

  const handleDismiss = () => {
    try { playUIClickSound(); } catch {}
    setIsExiting(true);
    setTimeout(() => onCloseRef.current?.(), 300);
  };

  // Parse title & body from message
  let appName = isUndercover ? 'Windows System' : 'GNOME Shell';
  let title = 'System Notification';
  let body = message;
  let icon = isUndercover ? (
    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
      <path d="M0 2.25L6.5 1.35V7.5H0V2.25ZM7.5 1.21L16 0V7.5H7.5V1.21ZM0 8.5H6.5V14.65L0 13.75V8.5ZM7.5 8.5H16V16L7.5 14.79V8.5Z"/>
    </svg>
  ) : (
    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );

  const lower = message.toLowerCase();
  if (lower.includes('recreated') || lower.includes('rebuild')) {
    appName = 'Swarm Engine';
    title = 'Rebuild Complete';
    body = 'Workspace and active apps have been reconstructed with swarm cursors animation.';
    icon = (
      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    );
  } else if (lower.includes('undercover activated')) {
    appName = 'Windows Security';
    title = 'Disguise Mode Active';
    body = 'Linux Undercover activated: System successfully disguised as Windows 11.';
  } else if (lower.includes('undercover deactivated')) {
    appName = isUndercover ? 'System Settings' : 'GNOME Shell';
    title = 'Disguise Mode Disabled';
    body = 'Linux Undercover deactivated: Restored Linux OS environment.';
  } else if (lower.includes('background') || lower.includes('wallpaper')) {
    appName = 'Personalization';
    title = 'Desktop Wallpaper';
    body = message.replace('🖼️', '').trim();
  } else if (lower.includes('history')) {
    appName = isUndercover ? 'Windows PowerShell' : 'Kali Terminal';
    title = 'History Cleared';
    body = 'Terminal session command history was successfully cleared.';
  }

  // Native GNOME 44 top-center notification banner when in Linux mode
  if (!isUndercover) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`fixed top-9 left-1/2 -translate-x-1/2 z-[150] w-[390px] max-w-[calc(100vw-2rem)] select-none font-sans transition-all duration-300 ${
          isExiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 animate-slideInDown'
        }`}
      >
        <div className="bg-[#1b1c20]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_14px_40px_rgba(0,0,0,0.75)] px-3.5 py-3 text-white flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-[#3584e4] flex items-center justify-center shrink-0 shadow-sm text-white mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                <span className="font-semibold text-white/95">{title}</span>
                <span className="text-white/35">·</span>
                <span className="text-[#68aef8] text-[10px] font-mono">{appName}</span>
              </div>
              <button
                onClick={handleDismiss}
                className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer text-[11px] shrink-0"
                title="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p className="text-[12px] text-white/80 leading-snug mt-0.5">
              {body}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      role="alert"
      aria-live="polite"
      className={`fixed bottom-14 sm:bottom-16 right-4 sm:right-6 z-[150] w-[360px] max-w-[calc(100vw-2rem)] select-none font-sans ${
        isExiting ? 'animate-slideOut' : 'animate-slideIn'
      }`}
    >
      <div className="bg-[#202020]/95 backdrop-blur-2xl border border-white/15 rounded-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-3.5 text-white flex flex-col gap-2 transition-all">
        {/* Header Row: Windows App Icon, App Title, Timestamp, Close */}
        <div className="flex items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#0078d7] flex items-center justify-center shrink-0 shadow-sm text-white">
              {icon}
            </div>
            <span className="font-semibold text-white/90 text-xs">{appName}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/50 text-[10px]">Just now</span>
          </div>

          <button 
            onClick={handleDismiss}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-default text-xs"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>

        {/* Title & Body Row */}
        <div className="flex flex-col pl-6 pr-2">
          <span className="text-[13px] font-semibold text-white leading-snug">
            {title}
          </span>
          <span className="text-[12px] text-white/80 leading-normal mt-0.5">
            {body}
          </span>
        </div>

        {/* Subtle Action Pill */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleDismiss}
            className="px-2.5 py-1 rounded-[4px] bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-medium text-white/90 border border-white/10 transition-colors cursor-default"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
import React, { useEffect, useState, useRef } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const onCloseRef = useRef(onClose);

  // Update ref whenever the handler changes to ensure we call the latest version
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Determine when to start the exit animation (400ms before close, matching CSS animation time)
    const exitTime = Math.max(0, duration - 400);

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
  }, [duration]); // Only reset timers if duration changes, not on parent re-renders

  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}>
      <div className="bg-terminal-dim/90 backdrop-blur-md border border-terminal-green/50 px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-4 rounded-lg border-l-4 border-l-terminal-green">
        <div className="bg-terminal-green/20 p-2 rounded-full">
            <span className="text-xl leading-none">✅</span>
        </div>
        <div className="flex flex-col">
            <span className="text-terminal-text font-bold text-sm tracking-wide">Success</span>
            <span className="text-terminal-text-dim text-xs font-mono">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
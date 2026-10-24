import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { playEnterSound } from '../utils/soundEffects';

interface MobileSlideToTerminalProps {
  onSlideComplete: () => void;
  className?: string;
}

export const MobileSlideToTerminal: React.FC<MobileSlideToTerminalProps> = ({
  onSlideComplete,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  // Exact concentric dimensions: 40px (h-10) track, 4px (p-1) uniform padding, 32px (w-8 h-8) round knob
  const KNOB_WIDTH = 32; // px
  const PADDING = 4; // px

  const getMaxDrag = useCallback(() => {
    if (!trackRef.current) return 140;
    return Math.max(50, trackRef.current.clientWidth - KNOB_WIDTH - (PADDING * 2));
  }, []);

  const handleStart = (clientX: number) => {
    if (isSuccess) return;
    setIsDragging(true);
    startXRef.current = clientX - currentXRef.current;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isSuccess) return;
    const maxDrag = getMaxDrag();
    const newX = Math.min(Math.max(0, clientX - startXRef.current), maxDrag);
    currentXRef.current = newX;
    setDragX(newX);
  }, [isDragging, isSuccess, getMaxDrag]);

  const handleEnd = useCallback(() => {
    if (!isDragging || isSuccess) return;
    setIsDragging(false);

    const maxDrag = getMaxDrag();
    const threshold = maxDrag * 0.55;

    if (currentXRef.current >= threshold) {
      // Completed slide!
      setIsSuccess(true);
      setDragX(maxDrag);
      try {
        playEnterSound();
      } catch {
        // ignore audio errors
      }

      setTimeout(() => {
        onSlideComplete();
        // Reset after transition
        setTimeout(() => {
          setIsSuccess(false);
          setDragX(0);
          currentXRef.current = 0;
        }, 400);
      }, 150);
    } else {
      // Spring back to start
      setDragX(0);
      currentXRef.current = 0;
    }
  }, [isDragging, isSuccess, getMaxDrag, onSlideComplete]);

  // Global mouse/pointer move and up listeners when dragging
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onPointerUp = () => {
      if (isDragging) handleEnd();
    };

    if (isDragging) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Touch move / end listeners
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  const maxDrag = getMaxDrag();
  const progress = maxDrag > 0 ? Math.min(1, Math.max(0, dragX / maxDrag)) : 0;

  return (
    <div
      ref={trackRef}
      className={`
        relative w-52 sm:w-56 h-10 rounded-full p-1 select-none touch-none
        border border-terminal-primary/40 bg-terminal-black/85 backdrop-blur-md
        shadow-md shadow-terminal-primary/10 overflow-hidden flex items-center
        transition-colors ${className}
      `}
      style={{
        borderColor: isSuccess 
          ? currentTheme.colors.primary 
          : `${currentTheme.colors.primary}55`
      }}
      onClick={(e) => {
        // If clicked on the right half, auto-slide to terminal
        const rect = trackRef.current?.getBoundingClientRect();
        if (rect && !isDragging && !isSuccess) {
          const clickRelX = e.clientX - rect.left;
          if (clickRelX > rect.width * 0.5) {
            setIsSuccess(true);
            setDragX(maxDrag);
            try { playEnterSound(); } catch {}
            setTimeout(() => {
              onSlideComplete();
              setTimeout(() => {
                setIsSuccess(false);
                setDragX(0);
                currentXRef.current = 0;
              }, 400);
            }, 200);
          }
        }
      }}
    >
      <style>{`
        @keyframes arrowWaveGlow {
          0%, 100% {
            opacity: 0.25;
            transform: translateX(0);
            filter: drop-shadow(0 0 0px transparent);
          }
          50% {
            opacity: 1;
            transform: translateX(1.5px);
            filter: drop-shadow(0 0 4px ${currentTheme.colors.primary});
          }
        }
      `}</style>

      {/* Background active fill progress */}
      <div
        className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-75 pointer-events-none"
        style={{
          width: `${dragX + KNOB_WIDTH + PADDING * 2}px`,
          background: `linear-gradient(90deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.primary}40 100%)`,
        }}
      />

      {/* Prompt text and 3 arrows glowing left to right */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-8 pr-3 transition-opacity duration-200"
        style={{ opacity: Math.max(0.1, 1 - progress * 1.5) }}
      >
        <span className="font-mono text-[10px] sm:text-[11px] tracking-wide font-semibold text-terminal-primary/90 flex items-center gap-1.5 drop-shadow-sm">
          <span>Slide to Terminal</span>
          <span className="inline-flex items-center text-terminal-primary">
            <ChevronRight 
              className="w-3 h-3 -mr-1" 
              style={{ animation: 'arrowWaveGlow 1.2s ease-in-out infinite 0s' }}
            />
            <ChevronRight 
              className="w-3 h-3 -mr-1" 
              style={{ animation: 'arrowWaveGlow 1.2s ease-in-out infinite 0.25s' }}
            />
            <ChevronRight 
              className="w-3 h-3" 
              style={{ animation: 'arrowWaveGlow 1.2s ease-in-out infinite 0.5s' }}
            />
          </span>
        </span>
      </div>

      {/* Concentric Draggable Knob matching outer track curvature */}
      <div
        onPointerDown={(e) => handleStart(e.clientX)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          relative z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing
          shadow-md select-none
          ${isDragging ? 'scale-105' : ''}
          ${isSuccess ? 'scale-110' : ''}
        `}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.2), scale 0.15s ease',
          backgroundColor: currentTheme.colors.primary,
          color: currentTheme.colors.bg || '#000000',
          boxShadow: `0 0 10px ${currentTheme.colors.primary}85`,
        }}
      >
        {isSuccess ? (
          <Terminal className="w-4.5 h-4.5 animate-bounce stroke-[2.5]" />
        ) : (
          <div className="flex items-center justify-center">
            <Terminal className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';

interface CMatrixViewProps {
  onClose: () => void;
  color?: string; // default emerald/green
}

export const CMatrixView: React.FC<CMatrixViewProps> = ({ onClose, color = '#22c55e' }) => {
  const [isClosed, setIsClosed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClose = () => {
    setIsClosed(true);
    onClose();
  };

  useEffect(() => {
    if (isClosed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isClosed]);

  if (isClosed) {
    return (
      <div className="text-emerald-500/70 text-xs font-mono my-1.5 flex items-center gap-2">
        <span>✓</span>
        <span>[ cmatrix stream terminated — terminal restored ]</span>
      </div>
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = Math.max(380, canvas.parentElement?.clientHeight || 450));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = Math.max(380, canvas.parentElement?.clientHeight || 450);
    };

    window.addEventListener('resize', handleResize);

    // Matrix characters: Katakana + Latin + Digits + Math
    const katakana = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA$+-*/=%';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    let lastTime = 0;
    const fps = 28;
    const interval = 1000 / fps;

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      // Translucent black fill for authentic trail fade
      ctx.fillStyle = 'rgba(10, 14, 20, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = katakana[Math.floor(Math.random() * katakana.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // White glowing leading tip character
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 4;
        ctx.fillText(char, x, y);

        // Previous character in matrix green/cyan
        if (drops[i] > 1) {
          const prevChar = katakana[Math.floor(Math.random() * katakana.length)];
          ctx.shadowBlur = 0;
          ctx.fillStyle = color;
          ctx.fillText(prevChar, x, y - fontSize);
        }

        // Reset drop to top with randomized delay when reaching bottom
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-emerald-500/40 bg-[#070b0f] shadow-2xl my-3 select-none">
      {/* Top HUD Bar */}
      <div 
        onClick={onClose}
        className="flex items-center justify-between px-3 py-1.5 bg-black/90 border-b border-emerald-500/30 text-xs font-mono cursor-pointer hover:bg-emerald-950/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold tracking-wide">CMATRIX v2.0 — LINUX STREAM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-zinc-800 text-emerald-300 rounded border border-zinc-700 font-bold">q</kbd> or <kbd className="px-1.5 py-0.5 bg-zinc-800 text-emerald-300 rounded border border-zinc-700 font-bold">ESC</kbd>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="px-2 py-0.5 rounded bg-red-950/60 hover:bg-red-800 text-red-200 border border-red-500/40 text-[10px] uppercase font-bold tracking-wider"
          >
            [ Exit Matrix ✕ ]
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1 bg-black/90 border-t border-emerald-500/20 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
        <span>Active Processes: AI Neural Engine, Vision Pipeline, Mistral-7B</span>
        <span className="text-emerald-400 font-semibold">120 FPS / WebGL Accelerated</span>
      </div>
    </div>
  );
};

export default CMatrixView;

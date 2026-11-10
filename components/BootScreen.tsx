import React, { useEffect, useRef, useState } from 'react';
import { playBootSound, playWindowsBootSound } from '../utils/soundEffects';

interface BootScreenProps {
  onComplete: () => void;
  onSwitchOS?: () => void;
  targetOS?: 'windows' | 'linux';
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete, onSwitchOS, targetOS = 'linux' }) => {
  const [loadingText, setLoadingText] = useState(
    targetOS === 'windows' ? "Starting Windows 11..." : "Initializing System..."
  );
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const onSwitchOSRef = useRef(onSwitchOS);
  useEffect(() => {
    onSwitchOSRef.current = onSwitchOS;
  }, [onSwitchOS]);

  useEffect(() => {
    setIsFadingOut(false);
    setLoadingText(targetOS === 'windows' ? "Starting Windows 11..." : "Initializing System...");

    if (targetOS === 'windows') {
      playWindowsBootSound();
    } else {
      playBootSound();
    }

    if (targetOS === 'windows') {
      const winMessages = [
        "Starting Windows 11...",
        "Getting devices ready...",
        "Applying user policies...",
        "Please wait...",
        "Welcome"
      ];
      let winIndex = 0;
      const textInterval = setInterval(() => {
        if (winIndex < winMessages.length - 1) {
          winIndex++;
          setLoadingText(winMessages[winIndex]);
        }
      }, 500);

      // Swap underlying OS while splash screen is 100% opaque black so fade-out reveals Windows directly
      const switchTimeout = setTimeout(() => {
        onSwitchOSRef.current?.();
      }, 1600);

      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 2450);

      const bootTimeout = setTimeout(() => {
        onCompleteRef.current();
      }, 2800);

      return () => {
        clearInterval(textInterval);
        clearTimeout(switchTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(bootTimeout);
      };
    } else {
      const linuxMessages = [
        "Loading Linux 6.1.0-generic-amd64...",
        "Loading initial ramdisk...",
        "Mounting /root filesystem...",
        "Starting GNOME Display Manager...",
        "Restoring Linux Workspace...",
        "System Ready."
      ];
      let linuxIndex = 0;
      const textInterval = setInterval(() => {
        if (linuxIndex < linuxMessages.length - 1) {
          linuxIndex++;
          setLoadingText(linuxMessages[linuxIndex]);
        }
      }, 430);

      // Swap underlying OS while splash screen is 100% opaque black so fade-out reveals Linux directly
      const switchTimeout = setTimeout(() => {
        onSwitchOSRef.current?.();
      }, 1600);

      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 2450);

      const bootTimeout = setTimeout(() => {
        onCompleteRef.current();
      }, 2800);

      return () => {
        clearInterval(textInterval);
        clearTimeout(switchTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(bootTimeout);
      };
    }
  }, [targetOS]);

  // =========================================================================
  // WINDOWS 11 INTRODUCTION MOTION-GRAPHICS BOOT SPLASH SCREEN
  // =========================================================================
  if (targetOS === 'windows') {
    return (
      <div 
        className={`fixed inset-0 h-screen w-screen bg-[#000000] z-[100] flex flex-col items-center justify-center font-sans select-none overflow-hidden transition-opacity duration-350 ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Ambient Volumetric Light Rays & Radial Blue Bloom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Radial electric-blue bloom behind logo */}
          <div
            className="w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(0,164,239,0.42)_0%,rgba(0,120,212,0.18)_42%,transparent_72%)]"
            style={{ animation: 'win11AuraBloom 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          />
          {/* Diagonal volumetric light beam sweeping across */}
          <div
            className="absolute w-[180px] sm:w-[240px] h-[140vh] blur-2xl bg-gradient-to-b from-transparent via-[#38bdf8]/25 to-transparent"
            style={{ animation: 'win11RaySweep 2.1s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* 3D Perspective Camera Sweep & Unfolding Glass Panes */}
          <div
            className="relative mb-14"
            style={{ animation: 'win11CameraPan 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="relative grid grid-cols-2 gap-2 sm:gap-2.5 w-24 h-24 sm:w-28 sm:h-28 p-0.5 drop-shadow-[0_0_45px_rgba(0,164,239,0.55)] overflow-hidden">
              {/* Top-Left Pane */}
              <div
                className="relative rounded-[3px] bg-gradient-to-br from-[#62d8ff] via-[#00a4ef] to-[#0078d4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_0_20px_rgba(0,164,239,0.45)]"
                style={{ animation: 'win11PaneTL 1.1s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              />
              {/* Top-Right Pane */}
              <div
                className="relative rounded-[3px] bg-gradient-to-br from-[#4cc8ff] via-[#0098e6] to-[#006cbe] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_0_20px_rgba(0,164,239,0.4)]"
                style={{ animation: 'win11PaneTR 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.07s both' }}
              />
              {/* Bottom-Left Pane */}
              <div
                className="relative rounded-[3px] bg-gradient-to-br from-[#35b9ff] via-[#008ee0] to-[#0062b5] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(0,142,224,0.4)]"
                style={{ animation: 'win11PaneBL 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both' }}
              />
              {/* Bottom-Right Pane */}
              <div
                className="relative rounded-[3px] bg-gradient-to-br from-[#29aef8] via-[#0078d4] to-[#00559c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_0_20px_rgba(0,120,212,0.4)]"
                style={{ animation: 'win11PaneBR 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both' }}
              />

              {/* Diagonal Glass Specular Light Sweep across the 4 panes */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[-20%] left-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[2px]"
                style={{ animation: 'win11LightSweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) 0.78s both' }}
              />
            </div>
          </div>

          {/* Windows 11 Orbiting Dot Spinner */}
          <div
            className="relative w-12 h-12 mb-7 flex items-center justify-center"
            style={{ animation: 'win11HudFadeIn 0.6s ease-out 0.75s both' }}
          >
            <div className="w-10 h-10 relative animate-spin [animation-duration:1.4s]">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const angle = (idx * 60) * (Math.PI / 180);
                const x = 20 + 16 * Math.cos(angle);
                const y = 20 + 16 * Math.sin(angle);
                return (
                  <span
                    key={idx}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      opacity: 0.25 + idx * 0.15,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Windows Status Text */}
          <div
            className="h-6 text-white/90 text-sm sm:text-base font-normal tracking-wide flex items-center justify-center"
            style={{ animation: 'win11HudFadeIn 0.6s ease-out 0.85s both' }}
          >
            {loadingText}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LINUX MOTION-GRAPHICS BOOT SPLASH SCREEN
  // =========================================================================
  return (
    <div 
      className={`fixed inset-0 h-screen w-screen bg-[#000000] z-[100] flex flex-col items-center justify-center font-mono select-none overflow-hidden transition-opacity duration-350 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient Volumetric Light Rays & Emerald/Cyan Radial Bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(74,246,38,0.34)_0%,rgba(0,240,255,0.16)_44%,transparent_72%)]"
          style={{ animation: 'win11AuraBloom 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        />
        <div
          className="absolute w-[180px] sm:w-[240px] h-[140vh] blur-2xl bg-gradient-to-b from-transparent via-[#4af626]/20 to-transparent"
          style={{ animation: 'win11RaySweep 2.1s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-[90vw]">
        {/* 3D Perspective Camera Sweep & Glass Linux Shell Emblem */}
        <div
          className="relative mb-12"
          style={{ animation: 'win11CameraPan 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-2xl border border-[#4af626]/45 bg-gradient-to-br from-[#102617] via-[#09140e] to-[#040806] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_50px_rgba(74,246,38,0.35)] p-3.5 flex flex-col justify-between overflow-hidden">
            {/* Staggered Window Header Dots */}
            <div
              className="flex items-center gap-1.5"
              style={{ animation: 'win11PaneTL 1.05s cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.6)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#4af626] shadow-[0_0_8px_rgba(74,246,38,0.7)]" />
            </div>

            {/* Staggered Terminal Prompt & Neon Glyph */}
            <div className="flex items-center justify-center gap-1.5 my-auto">
              <span
                className="text-3xl sm:text-4xl font-extrabold text-[#4af626] drop-shadow-[0_0_14px_rgba(74,246,38,0.75)]"
                style={{ animation: 'win11PaneBL 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
              >
                &gt;
              </span>
              <span
                className="w-4 sm:w-5 h-1.5 rounded-sm bg-[#00f0ff] shadow-[0_0_14px_rgba(0,240,255,0.8)] translate-y-2 animate-pulse"
                style={{ animation: 'win11PaneBR 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both' }}
              />
            </div>

            {/* Subtle Bottom Kernel Label */}
            <div
              className="text-[9px] tracking-[0.22em] uppercase text-[#4af626]/75 text-center font-semibold"
              style={{ animation: 'win11PaneTR 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both' }}
            >
              GNOME • ZSH
            </div>

            {/* Diagonal Glass Specular Light Sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-[-20%] left-0 w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[2px]"
              style={{ animation: 'win11LightSweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) 0.78s both' }}
            />
          </div>
        </div>
         
        {/* Linux Style Circular Spinner */}
        <div
          className="relative w-10 h-10 mb-6"
          style={{ animation: 'win11HudFadeIn 0.6s ease-out 0.75s both' }}
        >
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#4af626] border-r-[#00f0ff]/40 border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>

        {/* Linux Kernel Boot Text Animation */}
        <div
          className="h-6 text-[#4af626] text-xs sm:text-sm font-bold tracking-wider flex items-center gap-2"
          style={{ animation: 'win11HudFadeIn 0.6s ease-out 0.85s both' }}
        >
          <span className="animate-pulse">_</span>
          <span>{loadingText}</span>
        </div>
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none" />
    </div>
  );
};

export default BootScreen;

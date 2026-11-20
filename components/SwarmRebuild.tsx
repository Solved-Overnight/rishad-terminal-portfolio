import React, { useEffect, useRef } from 'react';

export interface SwarmRebuildProps {
  onComplete: () => void;
  autoStart?: boolean;
  isUndercover?: boolean;
}

declare global {
  interface Window {
    __swarmRebuild?: {
      toggle: () => void;
      start: () => void;
      stop: (reveal?: boolean) => void;
      isRunning?: () => boolean;
      app: any;
      debug?: any;
    };
    __swarmOnFinish?: (reveal?: boolean) => void;
    __swarmShot?: string | null;
  }
}

export const SwarmRebuild: React.FC<SwarmRebuildProps> = ({ onComplete }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let isTerminated = false;

    const handleFinish = () => {
      if (isTerminated) return;
      isTerminated = true;
      onCompleteRef.current();
    };

    window.__swarmOnFinish = handleFinish;
    window.addEventListener('swarm-rebuild:finished', handleFinish);

    // Pre-snapshot the 3D IdCard WebGL canvas for full-fidelity preview
    try {
      const idCardContainer = document.querySelector('[data-rebuild="id-card"]');
      const cardCanvas = idCardContainer ? idCardContainer.querySelector('canvas') : null;
      const targetCanvas = cardCanvas || document.querySelector('canvas');
      if (targetCanvas && typeof targetCanvas.toDataURL === 'function') {
        const shot = targetCanvas.toDataURL('image/png');
        if (shot && shot.length > 500) {
          window.__swarmShot = shot;
        }
      }
    } catch (_) {}

    // Check if Swarm script is already loaded
    if (window.__swarmRebuild) {
      window.__swarmRebuild.start();
    } else {
      // Inject authentic Swarm Rebuild script
      const script = document.createElement('script');
      script.src = '/assets/aistudio/swarm_6a30f19d.js';
      script.async = true;
      script.onerror = (e) => {
        console.error('[swarm-rebuild] Failed to load swarm script', e);
        handleFinish();
      };
      document.body.appendChild(script);
    }

    return () => {
      window.removeEventListener('swarm-rebuild:finished', handleFinish);
      if (window.__swarmOnFinish === handleFinish) {
        delete window.__swarmOnFinish;
      }
    };
  }, []);

  // Host element <swarm-rebuild> is managed directly in documentElement by the Swarm engine
  return null;
};

export default SwarmRebuild;

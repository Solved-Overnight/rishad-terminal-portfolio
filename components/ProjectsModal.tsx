import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { 
  X, 
  Minus,
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Star, 
  GitFork, 
  Copy, 
  Check,
  Code, 
  Activity, 
  ShieldCheck, 
  FolderGit2, 
  Folder, 
  FolderOpen, 
  Terminal,
  Layers
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Classnames helper
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// GitHub Icon SVG Component
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface ProjectCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCards: number;
  onClick: () => void;
  isSelected: boolean;
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, totalCards, onClick, isSelected }, ref) => {
    const { currentTheme } = useTheme();
    let rotation = 0;
    let translateX = 0;
    let translateY = -120;

    if (totalCards === 1) {
      rotation = 0;
      translateX = 0;
      translateY = -154;
    } else {
      const maxAngle = Math.min(32, 14 * (totalCards - 1));
      const angleStep = (maxAngle * 2) / (totalCards - 1);
      rotation = -maxAngle + index * angleStep;

      const maxTranslateX = Math.min(160, 68 * (totalCards - 1));
      const translateXStep = (maxTranslateX * 2) / (totalCards - 1);
      translateX = -maxTranslateX + index * translateXStep;

      const norm = (index - (totalCards - 1) / 2) / ((totalCards - 1) / 2 || 1);
      translateY = -150 - (1 - norm * norm) * 22;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-32 h-44 rounded-xl overflow-hidden shadow-2xl border transition-all duration-300 cursor-pointer hover:scale-115 group",
          isSelected && "opacity-0 pointer-events-none"
        )}
        style={{
          transform: isVisible
            ? `translateY(${translateY}px) translateX(${translateX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: isVisible ? 20 + index : 10 - index,
          left: "-48px",
          top: "-64px",
          backgroundColor: currentTheme.colors.dim,
          borderColor: `${currentTheme.colors.primary}60`,
          boxShadow: isVisible ? `0 10px 30px ${currentTheme.colors.primary}25` : undefined
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <img 
          src={image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-2 left-1.5 right-1.5">
          <p 
            className="text-[10px] font-bold truncate font-mono tracking-tight leading-tight"
            style={{ color: '#ffffff' }}
          >
            {title}
          </p>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: Project[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  stageRect?: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  stageRect,
  onCloseComplete,
  onNavigate,
}: ImageLightboxProps) {
  const { currentTheme } = useTheme();
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech'>('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;

  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);

      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setIsSliding(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 400);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, sourceRect]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return;
    onNavigate(idx);
  };

  const handleCopyGithub = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!shouldRender || !currentProject) return null;

  const getCardDimensions = () => {
    // Explorer stage width or fallback
    const explorerW = stageRect ? stageRect.width : Math.min(window.innerWidth * 0.90, 1300);
    const explorerH = stageRect ? stageRect.height : Math.min(window.innerHeight * 0.90, 800);
    const isMobile = window.innerWidth < 768;

    // Cover exactly 70% of the explorer width on desktop, 94% on mobile
    const targetWidth = Math.round(isMobile ? window.innerWidth * 0.94 : explorerW * 0.70);
    const targetHeight = Math.min(explorerH * 0.88, 700);

    return { targetWidth, targetHeight, isMobile, explorerW, explorerH };
  };

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};

    const { targetWidth, targetHeight } = getCardDimensions();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Centered target position in viewport
    // Center coordinates relative to explorer stage
    const containerW = stageRect ? stageRect.width : window.innerWidth;
    const containerH = stageRect ? stageRect.height : window.innerHeight;
    const targetCenterX = containerW / 2 + (containerW >= 768 ? 20 : 0);
    const targetCenterY = containerH / 2;

    const sourceCenterX = (stageRect ? sourceRect.left - stageRect.left : sourceRect.left) + sourceRect.width / 2;
    const sourceCenterY = (stageRect ? sourceRect.top - stageRect.top : sourceRect.top) + sourceRect.height / 2;

    const deltaX = sourceCenterX - targetCenterX;
    const deltaY = sourceCenterY - targetCenterY;

    // Dynamic anisotropic expansion widthwise and heightwise
    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;

    return {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
      opacity: 1,
    };
  };

  const getFinalStyles = (): React.CSSProperties => {
    return {
      transform: "translate(0, 0) scale(1, 1)",
      opacity: 1,
    };
  };

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

  return (
    <div
      className={cn("absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden")}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Background overlay with blur */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Floating Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className={cn(
          "absolute top-4 right-4 sm:top-6 sm:right-6 z-50",
          "w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md border shadow-xl cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        )}
        style={{
          backgroundColor: currentTheme.colors.dim,
          borderColor: `${currentTheme.colors.textDim}40`,
          color: currentTheme.colors.text,
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
        title="Close Preview"
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigatePrev();
        }}
        disabled={!hasPrev || isSliding}
        className={cn(
          "absolute left-3 md:left-8 z-50",
          "w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border shadow-2xl transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
        )}
        style={{
          backgroundColor: currentTheme.colors.dim,
          borderColor: `${currentTheme.colors.primary}50`,
          color: currentTheme.colors.primary,
          opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
        title="Previous Project"
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigateNext();
        }}
        disabled={!hasNext || isSliding}
        className={cn(
          "absolute right-3 md:right-8 z-50",
          "w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md border shadow-2xl transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
        )}
        style={{
          backgroundColor: currentTheme.colors.dim,
          borderColor: `${currentTheme.colors.primary}50`,
          color: currentTheme.colors.primary,
          opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
        title="Next Project"
      >
        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Expanded Modal Box covering 70% of explorer width */}
      <div
        ref={containerRef}
        className="relative z-10 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          width: `${getCardDimensions().targetWidth}px`,
          maxWidth: '96vw',
          transform: isClosing ? "translate(0, 0) scale(0.92)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div
          className={cn(
            "relative overflow-hidden flex flex-col border shadow-2xl",
            "rounded-2xl sm:rounded-3xl"
          )}
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "12px" : "24px",
            backgroundColor: currentTheme.colors.bg,
            borderColor: `${currentTheme.colors.primary}40`,
            color: currentTheme.colors.text,
            boxShadow: `0 0 80px ${currentTheme.colors.primary}20`,
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top Banner / Image Carousel Stage */}
          <div 
            className="relative overflow-hidden h-52 sm:h-64 md:h-72 flex-shrink-0"
            style={{ backgroundColor: currentTheme.colors.bg }}
          >
            <div
              className="flex h-full transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding ? "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
              }}
            >
              {projects.map((proj) => (
                <div key={proj.id || proj.name} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={proj.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
                    alt={proj.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t via-black/30 to-transparent" 
                    style={{ backgroundImage: `linear-gradient(to top, ${currentTheme.colors.bg} 0%, rgba(0,0,0,0.3) 50%, transparent 100%)` }}
                  />
                </div>
              ))}
            </div>

            {/* Floating Category Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full backdrop-blur-md border font-mono text-xs font-semibold shadow-lg"
                style={{
                  backgroundColor: `${currentTheme.colors.bg}cc`,
                  borderColor: `${currentTheme.colors.primary}50`,
                  color: currentTheme.colors.primary
                }}
              >
                {currentProject.category || 'AI & Machine Learning'}
              </span>
            </div>

            {/* Pagination Dots Overlay */}
            <div 
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border"
              style={{
                backgroundColor: `${currentTheme.colors.dim}dd`,
                borderColor: `${currentTheme.colors.textDim}30`
              }}
            >
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === internalIndex
                      ? "w-6"
                      : "w-2.5 opacity-40 hover:opacity-80"
                  )}
                  style={{
                    backgroundColor: idx === internalIndex ? currentTheme.colors.primary : currentTheme.colors.textDim
                  }}
                />
              ))}
            </div>
          </div>

          {/* Modal Header & Navigation Tabs */}
          <div 
            className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}30`
            }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === 'overview' ? currentTheme.colors.primary : 'transparent',
                  color: activeTab === 'overview' 
                    ? (currentTheme.isDark === false ? '#ffffff' : '#000000') 
                    : currentTheme.colors.textDim,
                  boxShadow: activeTab === 'overview' ? `0 2px 8px ${currentTheme.colors.primary}40` : undefined
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === 'features' ? currentTheme.colors.primary : 'transparent',
                  color: activeTab === 'features' 
                    ? (currentTheme.isDark === false ? '#ffffff' : '#000000') 
                    : currentTheme.colors.textDim,
                  boxShadow: activeTab === 'features' ? `0 2px 8px ${currentTheme.colors.primary}40` : undefined
                }}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('tech')}
                className="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer font-mono"
                style={{
                  backgroundColor: activeTab === 'tech' ? currentTheme.colors.primary : 'transparent',
                  color: activeTab === 'tech' 
                    ? (currentTheme.isDark === false ? '#ffffff' : '#000000') 
                    : currentTheme.colors.textDim,
                  boxShadow: activeTab === 'tech' ? `0 2px 8px ${currentTheme.colors.primary}40` : undefined
                }}
              >
                Tech Stack
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono" style={{ color: currentTheme.colors.textDim }}>
              {currentProject.stars && (
                <span className="flex items-center gap-1.5 font-bold" style={{ color: '#eab308' }}>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {currentProject.stars} Stars
                </span>
              )}
              {currentProject.forks && (
                <span className="flex items-center gap-1.5" style={{ color: currentTheme.colors.textDim }}>
                  <GitFork className="w-3.5 h-3.5" />
                  {currentProject.forks}
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Modal Content */}
          <div 
            className="p-6 overflow-y-auto max-h-[42vh] custom-scrollbar space-y-5"
            style={{ backgroundColor: currentTheme.colors.bg }}
          >
            
            {/* Title & Tagline */}
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono"
                style={{ color: currentTheme.colors.text }}
              >
                {currentProject.name}
              </h2>
              <p 
                className="text-xs sm:text-sm font-mono font-medium mt-1"
                style={{ color: currentTheme.colors.primary }}
              >
                {currentProject.tagline || currentProject.description}
              </p>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-5">
                <p 
                  className="text-sm leading-relaxed p-4 rounded-xl border"
                  style={{
                    backgroundColor: currentTheme.colors.dim,
                    borderColor: `${currentTheme.colors.textDim}30`,
                    color: currentTheme.colors.text
                  }}
                >
                  {currentProject.longDescription || currentProject.description}
                </p>

                {currentProject.highlights && currentProject.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 
                      className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      <Activity className="w-4 h-4" />
                      <span>Performance Metrics</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {currentProject.highlights.map((h, i) => (
                        <div 
                          key={i} 
                          className="border p-3 rounded-xl text-center"
                          style={{
                            backgroundColor: currentTheme.colors.dim,
                            borderColor: `${currentTheme.colors.textDim}30`
                          }}
                        >
                          <div className="text-[11px] font-mono" style={{ color: currentTheme.colors.textDim }}>{h.label}</div>
                          <div 
                            className="text-base font-bold font-mono mt-0.5"
                            style={{ color: currentTheme.colors.accent || currentTheme.colors.primary }}
                          >
                            {h.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                <h4 
                  className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Key Architecture & Capabilities</span>
                </h4>
                <div className="space-y-2">
                  {currentProject.features?.map((feat, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 p-3.5 rounded-xl border"
                      style={{
                        backgroundColor: currentTheme.colors.dim,
                        borderColor: `${currentTheme.colors.textDim}30`
                      }}
                    >
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5 border"
                        style={{
                          backgroundColor: `${currentTheme.colors.primary}20`,
                          borderColor: `${currentTheme.colors.primary}40`,
                          color: currentTheme.colors.primary
                        }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: currentTheme.colors.text }}>{feat}</span>
                    </div>
                  )) || (
                    <p className="text-xs" style={{ color: currentTheme.colors.textDim }}>Standard features list included in code repository.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-3">
                <h4 
                  className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <Code className="w-4 h-4" />
                  <span>Technologies & Libraries</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {currentProject.tech.map((t) => (
                    <div 
                      key={t} 
                      className="p-3 rounded-xl border flex items-center gap-2"
                      style={{
                        backgroundColor: currentTheme.colors.dim,
                        borderColor: `${currentTheme.colors.textDim}30`
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                      <span className="font-mono text-xs font-bold truncate" style={{ color: currentTheme.colors.text }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div 
            className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3"
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}30`
            }}
          >
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: currentTheme.colors.textDim }}>
              <span>Use</span>
              <kbd 
                className="px-2 py-0.5 rounded border text-xs"
                style={{
                  backgroundColor: currentTheme.colors.bg,
                  borderColor: `${currentTheme.colors.textDim}40`,
                  color: currentTheme.colors.text
                }}
              >
                ←
              </kbd>
              <kbd 
                className="px-2 py-0.5 rounded border text-xs"
                style={{
                  backgroundColor: currentTheme.colors.bg,
                  borderColor: `${currentTheme.colors.textDim}40`,
                  color: currentTheme.colors.text
                }}
              >
                →
              </kbd>
              <span>or swipe to navigate</span>
            </div>

            <div className="flex items-center gap-2">
              {currentProject.github && (
                <button
                  onClick={() => handleCopyGithub(currentProject.github)}
                  className="px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}40`,
                    color: currentTheme.colors.text
                  }}
                  title="Copy GitHub URL"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Repo'}</span>
                </button>
              )}

              {currentProject.github && (
                <a
                  href={currentProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}40`,
                    color: currentTheme.colors.text
                  }}
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}

              {currentProject.link && currentProject.link !== '#' && (
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:opacity-95"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.isDark === false ? '#ffffff' : '#000000',
                    boxShadow: `0 4px 14px ${currentTheme.colors.primary}40`
                  }}
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnimatedFolderProps {
  title: string;
  projects: Project[];
  className?: string;
  onSelectProject: (project: Project, index: number, rect: DOMRect | null) => void;
  hiddenCardId?: string | null;
}

export function AnimatedFolder({ title, projects, className, onSelectProject, hiddenCardId }: AnimatedFolderProps) {
  const { currentTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleProjectClick = (project: Project, index: number) => {
    const cardEl = cardRefs.current[index];
    const rect = cardEl ? cardEl.getBoundingClientRect() : null;
    onSelectProject(project, index, rect);
  };

  return (
    <div
        className={cn(
          "relative flex flex-col items-center justify-center select-none",
          "p-4 sm:p-6 pt-12 sm:pt-16 cursor-pointer group",
          className
        )}
        style={{
          width: "100%",
          maxWidth: "520px",
          minHeight: "420px",
          perspective: "1000px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center justify-center mb-6 mt-4" style={{ height: "260px", width: "340px" }}>
          {/* Folder back layer - z-index 10 */}
          <div
            className="absolute w-64 h-48 rounded-2xl shadow-md border"
            style={{
              top: "calc(50% - 96px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-18deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}40`
            }}
          />

          {/* Folder tab - z-index 10 */}
          <div
            className="absolute w-28 h-8 rounded-t-xl border-t border-x"
            style={{
              top: "calc(50% - 96px - 24px)",
              left: "calc(50% - 128px + 32px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-28deg) translateY(-3px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}40`
            }}
          />

          {/* ALL Project cards render & fan out on hover - z-index 20 */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id || project.name}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                image={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"}
                title={project.name}
                delay={index * 60}
                isVisible={isHovered}
                index={index}
                totalCards={projects.length}
                onClick={() => handleProjectClick(project, index)}
                isSelected={hiddenCardId === (project.id || project.name)}
              />
            ))}
          </div>

          {/* Folder front layer - z-index 30 */}
          <div
            className="absolute w-64 h-48 rounded-2xl shadow-2xl border"
            style={{
              top: "calc(50% - 96px + 4px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(28deg) translateY(14px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.primary}60`,
              boxShadow: `0 20px 40px ${currentTheme.colors.primary}20`
            }}
          />

          {/* Folder shine effect - z-index 31 */}
          <div
            className="absolute w-64 h-48 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              top: "calc(50% - 96px + 4px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(28deg) translateY(14px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {/* Folder title */}
        <h3
          className="text-xl font-extrabold font-mono mt-2 transition-all duration-300 text-center"
          style={{
            color: isHovered ? currentTheme.colors.primary : currentTheme.colors.text,
            transform: isHovered ? "translateY(4px)" : "translateY(0)",
          }}
        >
          {title}
        </h3>

        {/* Project count */}
        <p
          className="text-xs font-mono mt-1 transition-all duration-300"
          style={{
            color: currentTheme.colors.primary,
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} inside
        </p>

        {/* Hover hint */}
        <div
          className="mt-3 flex items-center gap-1.5 text-xs font-mono transition-all duration-300"
          style={{
            color: currentTheme.colors.textDim,
            opacity: isHovered ? 0 : 0.75,
            transform: isHovered ? "translateY(8px)" : "translateY(0)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
          <span>Hover to fan out all {projects.length} cards</span>
        </div>
      </div>
  );
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isDirMinimized, setIsDirMinimized] = useState<boolean>(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [selectedSourceRect, setSelectedSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageRect, setStageRect] = useState<DOMRect | null>(null);

  const measureStage = useCallback(() => {
    if (stageRef.current) {
      setStageRect(stageRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    measureStage();
    window.addEventListener('resize', measureStage);
    return () => window.removeEventListener('resize', measureStage);
  }, [measureStage, isOpen, isMaximized]);

  // Automatically minimize directory when card opens, and restore when card closes
  useEffect(() => {
    setIsDirMinimized(isCardOpen);
    measureStage();
  }, [isCardOpen, measureStage]);

  // Reset states on open/close
  useEffect(() => {
    if (!isOpen) {
      setIsMaximized(false);
      setIsMinimized(false);
      setIsCardOpen(false);
      setIsDirMinimized(false);
      setSelectedProjectIndex(null);
      setSelectedSourceRect(null);
      setHiddenCardId(null);
      setCurrentFolderIndex(0);
    }
  }, [isOpen]);

  const handleSelectProject = (project: Project, index: number, rect: DOMRect | null) => {
    measureStage();
    setSelectedSourceRect(rect);
    setSelectedProjectIndex(index);
    setHiddenCardId(project.id || project.name);
    setIsCardOpen(true);
  };

  const handleCloseLightbox = () => {
    setSelectedProjectIndex(null);
    setSelectedSourceRect(null);
    setIsCardOpen(false);
  };

  const handleCloseComplete = () => {
    setHiddenCardId(null);
  };

  const handleNavigate = (newIndex: number) => {
    setSelectedProjectIndex(newIndex);
    const proj = activeFolder?.projects[newIndex];
    setHiddenCardId(proj ? (proj.id || proj.name) : null);
  };

  // Group portfolio projects into 3D folders by category
  const portfolioFolders = [
    {
      title: "Generative AI & LLMs",
      projects: PROJECTS.filter(p => p.category?.includes("AI") || p.category?.includes("Generative") || p.category?.includes("Full Stack"))
    },
    {
      title: "Computer Vision & ML",
      projects: PROJECTS.filter(p => p.category?.includes("Vision") || p.category?.includes("Computer"))
    },
    {
      title: "FinTech & E-Commerce",
      projects: PROJECTS.filter(p => p.category?.includes("Commerce") || p.category?.includes("E-Commerce"))
    },
    {
      title: "MLOps & Systems",
      projects: PROJECTS.filter(p => p.category?.includes("MLOps") || p.category?.includes("Infrastructure"))
    }
  ].filter(folder => folder.projects.length > 0);

  const totalFolders = portfolioFolders.length;

  const handlePrevFolder = useCallback(() => {
    setSelectedProjectIndex(null);
    setSelectedSourceRect(null);
    setHiddenCardId(null);
    setIsCardOpen(false);
    setSlideDirection('right');
    setAnimationKey(prev => prev + 1);
    setCurrentFolderIndex((prev) => (prev > 0 ? prev - 1 : totalFolders - 1));
  }, [totalFolders]);

  const handleNextFolder = useCallback(() => {
    setSelectedProjectIndex(null);
    setSelectedSourceRect(null);
    setHiddenCardId(null);
    setIsCardOpen(false);
    setSlideDirection('left');
    setAnimationKey(prev => prev + 1);
    setCurrentFolderIndex((prev) => (prev < totalFolders - 1 ? prev + 1 : 0));
  }, [totalFolders]);

  const handleSelectFolder = (idx: number) => {
    if (idx === currentFolderIndex) return;
    setSelectedProjectIndex(null);
    setSelectedSourceRect(null);
    setHiddenCardId(null);
    setIsCardOpen(false);
    setSlideDirection(idx > currentFolderIndex ? 'left' : 'right');
    setAnimationKey(prev => prev + 1);
    setCurrentFolderIndex(idx);
  };

  // Touch swipe handling for folder navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextFolder();
      } else {
        handlePrevFolder();
      }
    }
    touchStartX.current = null;
  };

  // Keyboard arrow keys left / right navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        handlePrevFolder();
      } else if (e.key === 'ArrowRight') {
        handleNextFolder();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevFolder, handleNextFolder, onClose]);

  if (!isOpen) return null;

  // Minimized floating dock button
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs cursor-pointer transition-all select-none group animate-fadeIn border"
        style={{
          backgroundColor: currentTheme.colors.dim,
          borderColor: currentTheme.colors.primary,
          color: currentTheme.colors.text
        }}
        title="Click to restore Projects Showcase window"
      >
        <div 
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        ></div>
        <FolderGit2 className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
        <span className="font-semibold">Projects Showcase</span>
        <span 
          className="text-[10px] px-2 py-0.5 rounded border"
          style={{
            backgroundColor: currentTheme.colors.bg,
            borderColor: currentTheme.colors.dim,
            color: currentTheme.colors.textDim
          }}
        >
          Minimized ↗
        </span>
      </div>
    );
  }

  const activeFolder = portfolioFolders[currentFolderIndex] || portfolioFolders[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      
      {/* Swipe Animations CSS Styles */}
      <style>{`
        @keyframes swipeSlideLeft {
          0% { transform: translateX(110px) scale(0.85); opacity: 0; }
          65% { transform: translateX(-8px) scale(1.02); opacity: 0.95; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes swipeSlideRight {
          0% { transform: translateX(-110px) scale(0.85); opacity: 0; }
          65% { transform: translateX(8px) scale(1.02); opacity: 0.95; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-swipe-left {
          animation: swipeSlideLeft 480ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }
        .animate-swipe-right {
          animation: swipeSlideRight 480ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }
      `}</style>

      {/* Terminal Main Window Frame */}
      <div 
        className={`border shadow-2xl flex flex-col overflow-hidden rounded-2xl font-sans transition-all duration-300 ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-6xl xl:max-w-7xl h-[92vh] max-h-[880px]'
        }`}
        style={{
          backgroundColor: currentTheme.colors.bg,
          borderColor: currentTheme.colors.dim,
          color: currentTheme.colors.text,
          boxShadow: `0 0 90px ${currentTheme.colors.primary}25`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar Header */}
        <div 
          className="h-12 px-4 border-b flex items-center justify-between flex-shrink-0"
          style={{
            backgroundColor: currentTheme.colors.dim,
            borderColor: `${currentTheme.colors.textDim}30`,
            color: currentTheme.colors.text
          }}
        >
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
            <span className="text-xs font-bold tracking-wider font-mono uppercase" style={{ color: currentTheme.colors.text }}>
              Projects Showcase
            </span>
            <span 
              className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono"
              style={{
                backgroundColor: `${currentTheme.colors.primary}15`,
                borderColor: `${currentTheme.colors.primary}30`,
                color: currentTheme.colors.primary
              }}
            >
              3D Interactive Deck
            </span>
          </div>

          {/* Window Controls: strictly Minimize, Maximize, Close */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(true)} 
              className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 flex items-center justify-center transition-colors group cursor-pointer"
              title="Minimize Window"
            >
              <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-colors group cursor-pointer"
              title={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              {isMaximized ? (
                <Minimize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            <button 
              onClick={onClose} 
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors group cursor-pointer"
              title="Close Window"
            >
              <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Main Content Stage with 3D Menu on Left */}
        <div 
          ref={stageRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative custom-scrollbar flex flex-col md:flex-row items-center justify-center gap-6"
          style={{ backgroundColor: currentTheme.colors.bg }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Side Terminal Explorer Category Sidebar */}
          <div 
            className={cn(
              "flex flex-col border shadow-2xl overflow-hidden transition-all duration-300 ease-in-out",
              isDirMinimized
                ? "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-[60] w-12 sm:w-13 h-auto rounded-2xl py-2 px-1 gap-2 items-center justify-center"
                : "w-full md:w-64 flex-shrink-0 z-20 rounded-xl relative"
            )}
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: isDirMinimized 
                ? `${currentTheme.colors.primary}60` 
                : `${currentTheme.colors.textDim}30`,
              boxShadow: isDirMinimized
                ? `0 0 25px ${currentTheme.colors.primary}30`
                : undefined
            }}
          >
            {isDirMinimized ? (
              /* Minimized Directory Rail (moved all the way to the left with reduced length) */
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                {/* Minimized Header with Terminal Icon */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setIsDirMinimized(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer group relative hover:scale-105"
                    style={{
                      backgroundColor: currentTheme.colors.bg,
                      borderColor: `${currentTheme.colors.primary}50`,
                      color: currentTheme.colors.primary
                    }}
                    title="Directories (Click to expand)"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {/* Hover Tooltip */}
                    <span 
                      className="absolute left-11 px-2.5 py-1 rounded-md border text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[70] shadow-xl"
                      style={{
                        backgroundColor: currentTheme.colors.bg,
                        borderColor: `${currentTheme.colors.primary}50`,
                        color: currentTheme.colors.text
                      }}
                    >
                      Directories (minimized) • Click to expand
                    </span>
                  </button>
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  />
                </div>

                {/* Vertical Category Folder Icons */}
                <div className="flex flex-col items-center gap-1.5 w-full">
                  {portfolioFolders.map((folder, idx) => {
                    const isActive = idx === currentFolderIndex;
                    return (
                      <button
                        key={folder.title}
                        onClick={() => {
                          handleSelectFolder(idx);
                          setIsCardOpen(false);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative group border"
                        style={{
                          backgroundColor: isActive ? currentTheme.colors.bg : 'transparent',
                          borderColor: isActive ? `${currentTheme.colors.primary}80` : 'transparent',
                          color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim,
                          boxShadow: isActive ? `0 0 10px ${currentTheme.colors.primary}30` : undefined
                        }}
                        title={`${folder.title} (${folder.projects.length} ${folder.projects.length === 1 ? 'project' : 'projects'})`}
                      >
                        {isActive ? (
                          <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
                        ) : (
                          <Folder className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.colors.textDim }} />
                        )}

                        {/* Active Edge Indicator Bar */}
                        {isActive && (
                          <div 
                            className="absolute -left-1 top-1.5 bottom-1.5 w-1 rounded-r"
                            style={{
                              backgroundColor: currentTheme.colors.primary,
                              boxShadow: `0 0 8px ${currentTheme.colors.primary}`
                            }}
                          />
                        )}

                        {/* Hover Tooltip showing folder name & count */}
                        <div 
                          className="absolute left-11 px-2.5 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[70] shadow-2xl flex items-center gap-2"
                          style={{
                            backgroundColor: currentTheme.colors.bg,
                            borderColor: `${currentTheme.colors.primary}50`,
                            color: currentTheme.colors.text
                          }}
                        >
                          <span className="font-bold" style={{ color: currentTheme.colors.primary }}>{folder.title}</span>
                          <span 
                            className="text-[10px] px-1.5 py-0.5 rounded border"
                            style={{
                              backgroundColor: currentTheme.colors.dim,
                              borderColor: `${currentTheme.colors.textDim}30`,
                              color: currentTheme.colors.textDim
                            }}
                          >
                            {folder.projects.length}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Expand Toggle Button at Bottom */}
                <button
                  onClick={() => setIsDirMinimized(false)}
                  className="w-7 h-7 rounded-md flex items-center justify-center border transition-all cursor-pointer hover:scale-105 mt-0.5"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}30`,
                    color: currentTheme.colors.textDim
                  }}
                  title="Expand directory list"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              /* Expanded Normal Directory View */
              <>
                {/* Sidebar Explorer Header */}
                <div 
                  className="px-3.5 py-2.5 border-b flex items-center justify-between"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}30`
                  }}
                >
                  <div 
                    className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider uppercase"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    <Terminal className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                    <span>Directories</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: currentTheme.colors.dim,
                        borderColor: `${currentTheme.colors.textDim}30`,
                        color: currentTheme.colors.textDim
                      }}
                    >
                      {portfolioFolders.length} FOLDERS
                    </span>
                    {isCardOpen && (
                      <button
                        onClick={() => setIsDirMinimized(true)}
                        className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                        title="Minimize directory"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" style={{ color: currentTheme.colors.textDim }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Folder Directory Tree List */}
                <div className="p-2 flex flex-col gap-1.5">
                  {portfolioFolders.map((folder, idx) => {
                    const isActive = idx === currentFolderIndex;
                    return (
                      <button
                        key={folder.title}
                        onClick={() => handleSelectFolder(idx)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg font-mono text-xs flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer select-none group relative overflow-hidden border"
                        )}
                        style={{
                          backgroundColor: isActive ? currentTheme.colors.bg : 'transparent',
                          borderColor: isActive ? `${currentTheme.colors.primary}60` : 'transparent',
                          color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim,
                          boxShadow: isActive ? `0 0 15px ${currentTheme.colors.primary}20` : undefined,
                          fontWeight: isActive ? 700 : 500
                        }}
                      >
                        {/* Active Edge Indicator Bar */}
                        {isActive && (
                          <div 
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r" 
                            style={{
                              backgroundColor: currentTheme.colors.primary,
                              boxShadow: `0 0 8px ${currentTheme.colors.primary}`
                            }}
                          />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0 pl-1">
                          {isActive ? (
                            <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
                          ) : (
                            <Folder className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.colors.textDim }} />
                          )}
                          <span className="truncate tracking-wide" style={{ color: isActive ? currentTheme.colors.primary : currentTheme.colors.text }}>
                            {folder.title}
                          </span>
                        </div>

                        <span 
                          className="text-[10px] font-mono px-2 py-0.5 rounded transition-colors flex-shrink-0 border"
                          style={{
                            backgroundColor: isActive ? `${currentTheme.colors.primary}20` : currentTheme.colors.bg,
                            borderColor: isActive ? `${currentTheme.colors.primary}40` : `${currentTheme.colors.textDim}30`,
                            color: isActive ? currentTheme.colors.primary : currentTheme.colors.textDim,
                            fontWeight: isActive ? 700 : 400
                          }}
                        >
                          {folder.projects.length} {folder.projects.length === 1 ? 'project' : 'projects'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Centerpiece 3D Animated Folder Stage */}
          <div className="flex-1 w-full max-w-xl flex flex-col items-center justify-center py-4 my-auto relative">
            <div 
              key={`${activeFolder.title}-${animationKey}`}
              className={cn(
                "w-full flex items-center justify-center min-h-[320px] sm:min-h-[360px]",
                slideDirection === 'left' ? 'animate-swipe-left' : 'animate-swipe-right'
              )}
            >
              <AnimatedFolder 
                title={activeFolder.title} 
                projects={activeFolder.projects} 
                onSelectProject={handleSelectProject}
                hiddenCardId={hiddenCardId}
              />
            </div>

            {/* Bottom Dots Indicator */}
            <div className="flex items-center gap-2 mt-4">
              {portfolioFolders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectFolder(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    idx === currentFolderIndex
                      ? "w-8"
                      : "w-2 opacity-40 hover:opacity-80"
                  )}
                  style={{
                    backgroundColor: idx === currentFolderIndex ? currentTheme.colors.primary : currentTheme.colors.textDim,
                    boxShadow: idx === currentFolderIndex ? `0 0 10px ${currentTheme.colors.primary}` : undefined
                  }}
                  title={`Go to category ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Expanded Project Card covering EXACTLY 70% of explorer width */}
          {selectedProjectIndex !== null && (
            <ImageLightbox
              projects={activeFolder.projects}
              currentIndex={selectedProjectIndex}
              isOpen={selectedProjectIndex !== null}
              onClose={handleCloseLightbox}
              sourceRect={selectedSourceRect}
              stageRect={stageRect}
              onCloseComplete={handleCloseComplete}
              onNavigate={handleNavigate}
            />
          )}

        </div>
      </div>
    </div>
  );
};

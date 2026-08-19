import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { 
  X, ExternalLink, ChevronLeft, ChevronRight, Layers, Sparkles, 
  Maximize2, Minimize2, Star, GitFork, ArrowLeft, Copy, Check,
  Code, Cpu, Activity, ShieldCheck, FolderGit2, Folder, FolderOpen, Terminal
} from 'lucide-react';

// Classnames helper
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// GitHub Icon SVG Component
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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
          "absolute w-32 h-44 rounded-xl overflow-hidden shadow-2xl border border-cyan-500/40",
          "bg-[#1e2638]",
          "cursor-pointer hover:ring-2 hover:ring-cyan-400 hover:scale-115 transition-all duration-300",
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
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <img 
          src={image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-2 left-1.5 right-1.5">
          <p className="text-[10px] font-bold text-white truncate font-mono tracking-tight leading-tight">
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
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}: ImageLightboxProps) {
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

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.min(840, viewportWidth - 32);
    const targetHeight = Math.min(viewportHeight * 0.88, 680);

    const targetX = (viewportWidth - targetWidth) / 2;
    const targetY = (viewportHeight - targetHeight) / 2;

    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;
    const scale = Math.max(scaleX, scaleY);

    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2);
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2);

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 1,
    };
  };

  const getFinalStyles = (): React.CSSProperties => {
    return {
      transform: "translate(0, 0) scale(1)",
      opacity: 1,
    };
  };

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8")}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
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
          "w-11 h-11 flex items-center justify-center",
          "rounded-full bg-[#181d2a]/80 backdrop-blur-md",
          "border border-[#2d3850]",
          "text-gray-300 hover:text-white hover:bg-[#252d42]",
          "transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
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
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-[#181d2a]/90 backdrop-blur-md",
          "border border-[#2d3850]",
          "text-cyan-400 hover:text-white hover:bg-[#252d42] hover:border-cyan-500/50",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer shadow-2xl",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
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
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-[#181d2a]/90 backdrop-blur-md",
          "border border-[#2d3850]",
          "text-cyan-400 hover:text-white hover:bg-[#252d42] hover:border-cyan-500/50",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer shadow-2xl",
          "disabled:opacity-0 disabled:pointer-events-none"
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Expanded Modal Box */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-4xl max-h-[88vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.95)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div
          className={cn(
            "relative overflow-hidden flex flex-col",
            "rounded-2xl sm:rounded-3xl",
            "bg-[#111520] border border-[#273248]",
            "ring-1 ring-cyan-500/20 shadow-[0_0_80px_rgba(0,240,255,0.15)] text-gray-200"
          )}
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "12px" : "24px",
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top Banner / Image Carousel Stage */}
          <div className="relative overflow-hidden bg-[#0a0d14] h-52 sm:h-64 md:h-72 flex-shrink-0">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-black/30 to-transparent" />
                </div>
              ))}
            </div>

            {/* Floating Category Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-lg">
                {currentProject.category || 'AI & Machine Learning'}
              </span>
            </div>

            {/* Pagination Dots Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === internalIndex
                      ? "bg-cyan-400 w-6"
                      : "bg-gray-500 hover:bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Modal Header & Navigation Tabs */}
          <div className="px-6 py-3 bg-[#161b2a] border-b border-[#252f44] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'features' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab('tech')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'tech' ? 'bg-cyan-500 text-black font-bold shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tech Stack
              </button>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-xs">
              {currentProject.stars && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {currentProject.stars} Stars
                </span>
              )}
              {currentProject.forks && (
                <span className="flex items-center gap-1.5 text-gray-300">
                  <GitFork className="w-3.5 h-3.5" />
                  {currentProject.forks}
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[42vh] custom-scrollbar space-y-5 bg-[#111520]">
            
            {/* Title & Tagline */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentProject.name}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-400 font-mono font-medium mt-1">
                {currentProject.tagline || currentProject.description}
              </p>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-5">
                <p className="text-sm text-gray-300 leading-relaxed bg-[#161c2b] p-4 rounded-xl border border-[#263148]">
                  {currentProject.longDescription || currentProject.description}
                </p>

                {currentProject.highlights && currentProject.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      <span>Performance Metrics</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {currentProject.highlights.map((h, i) => (
                        <div key={i} className="bg-[#161c2b] border border-[#263148] p-3 rounded-xl text-center">
                          <div className="text-[11px] font-mono text-gray-400">{h.label}</div>
                          <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">{h.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Key Architecture & Capabilities</span>
                </h4>
                <div className="space-y-2">
                  {currentProject.features?.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#161c2b] p-3.5 rounded-xl border border-[#263148]">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-xs text-gray-200 leading-relaxed">{feat}</span>
                    </div>
                  )) || <p className="text-gray-400 text-xs">Standard features list included in code repository.</p>}
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  <span>Technologies & Libraries</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {currentProject.tech.map((t) => (
                    <div key={t} className="bg-[#161c2b] p-3 rounded-xl border border-[#263148] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-mono text-xs font-bold text-gray-200">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-[#161b2a] border-t border-[#252f44] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>Use</span>
              <kbd className="px-2 py-0.5 bg-[#202738] rounded border border-[#2f3b54] text-gray-300">←</kbd>
              <kbd className="px-2 py-0.5 bg-[#202738] rounded border border-[#2f3b54] text-gray-300">→</kbd>
              <span>or swipe to navigate</span>
            </div>

            <div className="flex items-center gap-2">
              {currentProject.github && (
                <button
                  onClick={() => handleCopyGithub(currentProject.github)}
                  className="px-3 py-2 rounded-xl bg-[#202738] hover:bg-[#2b354c] border border-[#2f3b54] text-gray-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
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
                  className="px-4 py-2 rounded-xl bg-[#202738] hover:bg-[#2b354c] border border-[#2f3b54] text-white text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer"
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
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
}

export function AnimatedFolder({ title, projects, className }: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleProjectClick = (project: Project, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) {
      setSourceRect(cardEl.getBoundingClientRect());
    }
    setSelectedIndex(index);
    setHiddenCardId(project.id || project.name);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
    setSourceRect(null);
  };

  const handleCloseComplete = () => {
    setHiddenCardId(null);
  };

  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex);
    setHiddenCardId(projects[newIndex]?.id || projects[newIndex]?.name || null);
  };

  return (
    <>
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
            className="absolute w-64 h-48 bg-[#1e2638] rounded-2xl shadow-md border border-[#2d3a56]"
            style={{
              top: "calc(50% - 96px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-18deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Folder tab - z-index 10 */}
          <div
            className="absolute w-28 h-8 bg-[#1e2638] rounded-t-xl border-t border-x border-[#2d3a56]"
            style={{
              top: "calc(50% - 96px - 24px)",
              left: "calc(50% - 128px + 32px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-28deg) translateY(-3px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
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
            className="absolute w-64 h-48 bg-[#25324a] rounded-2xl shadow-2xl border border-cyan-500/40"
            style={{
              top: "calc(50% - 96px + 4px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(28deg) translateY(14px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
            }}
          />

          {/* Folder shine effect - z-index 31 */}
          <div
            className="absolute w-64 h-48 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              top: "calc(50% - 96px + 4px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(28deg) translateY(14px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {/* Folder title */}
        <h3
          className="text-xl font-extrabold text-white mt-2 transition-all duration-300 group-hover:text-cyan-300 text-center"
          style={{
            transform: isHovered ? "translateY(4px)" : "translateY(0)",
          }}
        >
          {title}
        </h3>

        {/* Project count */}
        <p
          className="text-xs font-mono text-cyan-400 mt-1 transition-all duration-300"
          style={{
            opacity: isHovered ? 0.95 : 0.7,
          }}
        >
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} inside
        </p>

        {/* Hover hint */}
        <div
          className="mt-3 flex items-center gap-1.5 text-xs font-mono text-gray-400 transition-all duration-300"
          style={{
            opacity: isHovered ? 0 : 0.75,
            transform: isHovered ? "translateY(8px)" : "translateY(0)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hover to fan out all {projects.length} cards</span>
        </div>
      </div>

      <ImageLightbox
        projects={projects}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        sourceRect={sourceRect}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
      />
    </>
  );
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({ isOpen, onClose }) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [animationKey, setAnimationKey] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

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
    setSlideDirection('right');
    setAnimationKey(prev => prev + 1);
    setCurrentFolderIndex((prev) => (prev > 0 ? prev - 1 : totalFolders - 1));
  }, [totalFolders]);

  const handleNextFolder = useCallback(() => {
    setSlideDirection('left');
    setAnimationKey(prev => prev + 1);
    setCurrentFolderIndex((prev) => (prev < totalFolders - 1 ? prev + 1 : 0));
  }, [totalFolders]);

  const handleSelectFolder = (idx: number) => {
    if (idx === currentFolderIndex) return;
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

  const activeFolder = portfolioFolders[currentFolderIndex] || portfolioFolders[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      
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

        .arrow-hover-right-to-left {
          background: linear-gradient(to left, #22d3ee 50%, #475569 50%);
          background-size: 200% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: background-position 350ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .arrow-hover-right-to-left:hover {
          background-position: 0 0;
        }

        .arrow-hover-left-to-right {
          background: linear-gradient(to right, #22d3ee 50%, #475569 50%);
          background-size: 200% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: background-position 350ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .arrow-hover-left-to-right:hover {
          background-position: 0 0;
        }
      `}</style>

      {/* Terminal Main Window Frame */}
      <div 
        className={`bg-[#0d111a] border border-[#232c3f] shadow-[0_0_90px_rgba(0,240,255,0.18)] flex flex-col overflow-hidden rounded-2xl text-gray-200 font-sans transition-all duration-300 ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-5xl h-[90vh] max-h-[840px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar Header */}
        <div className="h-12 px-4 bg-[#141824] border-b border-[#232c3f] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-gray-100 tracking-wider font-mono uppercase">
              Projects Showcase
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
              3D Interactive Deck
            </span>
          </div>

          {/* Window Controls placed on the RIGHT side */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 flex items-center justify-center transition-colors group cursor-pointer"
              title="Minimize/Restore"
            >
              <Minimize2 className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 flex items-center justify-center transition-colors group cursor-pointer"
              title="Maximize Window"
            >
              <Maximize2 className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={onClose} 
              className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors group cursor-pointer"
              title="Close Window"
            >
              <X className="w-2.5 h-2.5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Main Content Stage with 3D Glass Menu on Left */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative bg-[#0a0d14] custom-scrollbar flex flex-col md:flex-row items-center justify-center gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Side Terminal Explorer Category Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col bg-[#0f131f] border border-[#1e273a] rounded-xl shadow-2xl overflow-hidden relative z-20">
            {/* Sidebar Explorer Header */}
            <div className="px-3.5 py-2.5 bg-[#141a29] border-b border-[#1e273a] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Directories</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#0b0e17] px-2 py-0.5 rounded border border-[#1e273a]">
                {portfolioFolders.length} FOLDERS
              </span>
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
                      "w-full text-left px-3 py-2.5 rounded-lg font-mono text-xs flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer select-none group relative overflow-hidden",
                      isActive
                        ? "bg-[#162032] border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.12)] font-bold"
                        : "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#141b2a] border border-transparent hover:border-[#222d42]"
                    )}
                  >
                    {/* Active Edge Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#22d3ee]" />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0 pl-1">
                      {isActive ? (
                        <FolderOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-500 group-hover:text-cyan-400/80 transition-colors flex-shrink-0" />
                      )}
                      <span className="truncate tracking-wide">{folder.title}</span>
                    </div>

                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded transition-colors flex-shrink-0",
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "bg-[#131926] text-slate-500 group-hover:text-slate-300 border border-[#1d2638]"
                    )}>
                      {folder.projects.length} {folder.projects.length === 1 ? 'project' : 'projects'}
                    </span>
                  </button>
                );
              })}
            </div>
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
                      ? "w-8 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      : "w-2 bg-gray-700 hover:bg-gray-400"
                  )}
                  title={`Go to category ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PROJECTS, EXPERIENCE, SOCIALS, ABOUT_TEXT, SKILLS, CERTIFICATIONS } from '../constants';

interface AptUpdateAnimationProps {
  onComplete?: () => void;
  onTriggerUpgrade?: () => void;
  isChained?: boolean;
}

export const UPGRADABLE_PACKAGES = [
  {
    name: 'agentic-automation-platform',
    currentVersion: '1.9.0',
    newVersion: '2.4.0-latest',
    size: '15.4 MB',
    summary: 'LangGraph, LangChain, Groq LLMs & ChromaDB RAG automation platform'
  },
  {
    name: 'vastu-floorplan-analyzer',
    currentVersion: '2.1.0',
    newVersion: '2.5.0',
    size: '18.2 MB',
    summary: 'TensorFlow CNN floor-plan compliance classifier (88% acc, 5k+ users)'
  },
  {
    name: 'lantabur-industrial-hub',
    currentVersion: '1.0.0',
    newVersion: '1.2.0-live',
    size: '9.8 MB',
    summary: 'Real-time IoT KPIs & ML demand forecasting (+22% factory output)'
  },
  {
    name: 'scorpion-dataset-engine',
    currentVersion: '1.5.0',
    newVersion: '2.0.0',
    size: '7.1 MB',
    summary: 'Concurrent Selenium ML training dataset generator (3x throughput)'
  },
  {
    name: 'vastu-spatial-compass',
    currentVersion: '1.2.0',
    newVersion: '1.4.0',
    size: '11.5 MB',
    summary: 'Android GPS & device sensor fusion spatial intelligence (5,000+ users)'
  },
  {
    name: 'dev-insights-feed',
    currentVersion: '2.0.0',
    newVersion: '2.4.0',
    size: '3.1 MB',
    summary: 'Technical articles on agentic architectures, deep learning & IoT'
  }
];

export const AptUpdateAnimation: React.FC<AptUpdateAnimationProps> = ({
  onComplete,
  onTriggerUpgrade,
  isChained = false
}) => {
  const [step, setStep] = useState(0);
  const { currentTheme } = useTheme();

  const lines = [
    { text: 'Hit:1 http://http.kali.org/kali kali-rolling InRelease', type: 'hit' },
    { text: 'Get:2 https://repo.rishad.dev/kali/projects InRelease [4,820 B]', type: 'get' },
    { text: 'Get:3 https://repo.rishad.dev/kali/current-work InRelease [2,150 B]', type: 'get' },
    { text: 'Get:4 https://repo.rishad.dev/kali/research-lab InRelease [3,490 B]', type: 'get' },
    { text: 'Get:5 https://repo.rishad.dev/kali/blog-feed InRelease [2,880 B]', type: 'get' },
    { text: 'Fetched 13.3 kB in 1s (12.8 kB/s)', type: 'info' },
    { text: 'Reading package lists... Done', type: 'done' },
    { text: 'Building dependency tree... Done', type: 'done' },
    { text: 'Reading state information... Done', type: 'done' }
  ];

  useEffect(() => {
    if (step < lines.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 140);
      return () => clearTimeout(timer);
    } else {
      if (onComplete) {
        onComplete();
      }
      if (isChained && onTriggerUpgrade) {
        const chainTimer = setTimeout(() => {
          onTriggerUpgrade();
        }, 700);
        return () => clearTimeout(chainTimer);
      }
    }
  }, [step, isChained]);

  return (
    <div className="font-mono text-sm sm:text-base space-y-1.5 mt-2 max-w-4xl">
      {lines.slice(0, step).map((l, i) => {
        let textClass = 'text-terminal-text';
        if (l.type === 'hit') textClass = 'text-terminal-cyan';
        if (l.type === 'get') textClass = 'text-terminal-primary';
        if (l.type === 'info') textClass = 'text-terminal-text-dim italic';
        if (l.type === 'done') textClass = 'text-terminal-green font-semibold';

        return (
          <div key={i} className={`${textClass} leading-tight`}>
            {l.text}
          </div>
        );
      })}

      {step >= lines.length && (
        <div className="mt-4 pt-3 border-t border-terminal-dim/50 space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-terminal-dim/30 border border-terminal-primary/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-primary animate-pulse"></span>
              <span className="text-terminal-primary font-bold text-sm sm:text-base">
                6 packages can be upgraded
              </span>
            </div>
            <span className="text-xs text-terminal-text-dim font-mono">
              Ready to pull recent work & projects
            </span>
          </div>

          {/* Upgradable Packages Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {UPGRADABLE_PACKAGES.map((pkg, i) => (
              <div 
                key={i} 
                className="p-2.5 rounded bg-terminal-dim/15 border border-terminal-dim/40 hover:border-terminal-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-terminal-cyan">{pkg.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-terminal-dim/40 text-terminal-text-dim font-mono">
                    {pkg.size}
                  </span>
                </div>
                <div className="text-terminal-text-dim text-[11px] mb-1">
                  {pkg.summary}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-terminal-text-dim line-through">{pkg.currentVersion}</span>
                  <span className="text-terminal-text">→</span>
                  <span className="text-terminal-primary font-bold">{pkg.newVersion}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade prompt and interactive button */}
          {!isChained && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-terminal-primary/10 via-terminal-dim/20 to-transparent border border-terminal-primary/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
              <div>
                <div className="text-sm font-bold text-terminal-text">
                  Run <span className="text-terminal-primary font-mono bg-black/40 px-1.5 py-0.5 rounded border border-terminal-primary/30">sudo apt upgrade</span> to deploy latest updates
                </div>
                <div className="text-xs text-terminal-text-dim mt-0.5">
                  Downloads and unpacks all recent projects, live status, and what Rishad is up to.
                </div>
              </div>

              {onTriggerUpgrade && (
                <button
                  onClick={onTriggerUpgrade}
                  className="px-4 py-2 rounded-lg bg-terminal-primary hover:bg-terminal-primary/80 text-black font-mono font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-terminal-primary/20 hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>⚡ Upgrade System Now</span>
                  <span>↗</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AptUpgradeAnimationProps {
  onComplete?: () => void;
  onOpenProjectsModal?: () => void;
  onOpenBlogsModal?: (blogId?: string) => void;
  onRunCommand?: (cmd: string) => void;
}

export const AptUpgradeAnimation: React.FC<AptUpgradeAnimationProps> = ({
  onComplete,
  onOpenProjectsModal,
  onOpenBlogsModal,
  onRunCommand
}) => {
  const [percent, setPercent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'projects' | 'skills' | 'certifications' | 'blogs'>('status');
  const { currentTheme } = useTheme();

  // Simulation speed: finishes in approx 2 seconds
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Faster progression with randomized ticks
      const increment = Math.random() * 6 + 3;
      current += increment;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setPercent(100);
        setTimeout(() => {
          setIsFinished(true);
          if (onComplete) onComplete();
        }, 350);
      } else {
        setPercent(current);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const getUnpackStatusText = (p: number) => {
    if (p < 15) return 'Preparing to unpack agentic-automation-platform_2.4.0_all.deb ...';
    if (p < 35) return 'Unpacking vastu-floorplan-analyzer (2.5.0) over (2.1.0) ...';
    if (p < 55) return 'Unpacking lantabur-industrial-hub (1.2.0-live) ...';
    if (p < 75) return 'Unpacking scorpion-dataset-engine (2.0.0) ...';
    if (p < 90) return 'Setting up vastu-spatial-compass (1.4.0) ...';
    if (p < 98) return 'Processing triggers for kali-menu & system database ...';
    return 'Setting up packages & synchronizing live work tree ...';
  };

  const width = 28;
  const filled = Math.floor((percent / 100) * width);
  const empty = Math.max(0, width - filled);
  const filledStr = '█'.repeat(filled);
  const emptyStr = '░'.repeat(empty);

  return (
    <div className="font-mono text-sm sm:text-base space-y-3 mt-2 max-w-4xl">
      {/* Linux apt upgrade terminal output */}
      <div className="space-y-1 text-terminal-text-dim text-xs sm:text-sm">
        <div>Reading package lists... <span className="text-terminal-green">Done</span></div>
        <div>Building dependency tree... <span className="text-terminal-green">Done</span></div>
        <div>Calculating upgrade... <span className="text-terminal-green">Done</span></div>
        <div className="text-terminal-text">
          The following packages will be upgraded:
        </div>
        <div className="text-terminal-cyan pl-2 font-semibold">
          agentic-automation-platform vastu-floorplan-analyzer lantabur-industrial-hub scorpion-dataset-engine vastu-spatial-compass dev-insights-feed
        </div>
        <div>
          6 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
        </div>
        <div>
          Need to get 42.8 MB of archives. After this operation, 18.4 MB of additional disk space will be used.
        </div>
      </div>

      {/* Progress Bar & Unpacking Live Status */}
      {!isFinished ? (
        <div className="p-3 rounded-lg bg-terminal-dim/30 border border-terminal-dim/60 space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-terminal-primary font-bold flex items-center gap-2">
              <span className="animate-spin inline-block">⠋</span>
              <span>Upgrading packages: {Math.floor(percent)}%</span>
            </span>
            <span className="text-terminal-text-dim font-mono">
              {( (percent / 100) * 42.8 ).toFixed(1)} MB / 42.8 MB (16.4 MB/s)
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-terminal-primary font-bold hidden sm:inline text-xs">
              [{filledStr}{emptyStr}]
            </span>
            <div className="flex-1 sm:hidden h-2.5 bg-black/60 rounded-full overflow-hidden border border-terminal-primary/30">
              <div 
                className="h-full bg-terminal-primary transition-all duration-100" 
                style={{ width: `${percent}%` }}
              />
            </div>
            <button
              onClick={() => {
                setPercent(100);
                setIsFinished(true);
                if (onComplete) onComplete();
              }}
              className="text-[10px] text-terminal-text-dim hover:text-terminal-primary px-2 py-0.5 rounded border border-terminal-dim/50 ml-auto shrink-0"
            >
              Skip »
            </button>
          </div>

          <div className="text-xs text-terminal-text-dim font-mono truncate">
            {getUnpackStatusText(percent)}
          </div>
        </div>
      ) : (
        <div className="text-terminal-green text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Setting up complete. All 6 packages successfully upgraded. System up to date.</span>
        </div>
      )}

      {/* RECENT WORK & WHAT I'M UP TO DASHBOARD */}
      {isFinished && (
        <div className="mt-4 pt-2 space-y-4 animate-fadeIn">
          {/* Kali Linux Synchronization Header Badge */}
          <div className="relative overflow-hidden p-4 rounded-xl border border-terminal-primary/40 bg-gradient-to-br from-terminal-primary/10 via-terminal-dim/30 to-terminal-bg shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-terminal-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-terminal-primary/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-terminal-primary/20 border border-terminal-primary flex items-center justify-center text-xl shrink-0">
                  🐉
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-terminal-primary font-bold flex items-center gap-2">
                    <span>Kali Linux OS</span>
                    <span className="text-terminal-dim">•</span>
                    <span>System Sync Complete</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-terminal-text">
                    Moniruzzaman Rishad's Live Work & Status Feed
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>100% Synced</span>
                </span>
                <span className="text-terminal-text-dim text-[11px] hidden sm:inline">
                  Kernel 6.12-kali
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-3 pt-1 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'status'
                    ? 'bg-terminal-primary text-black shadow-md shadow-terminal-primary/20'
                    : 'bg-terminal-dim/40 text-terminal-text hover:bg-terminal-dim hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>What I'm Up To & Summary</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'bg-terminal-primary text-black shadow-md shadow-terminal-primary/20'
                    : 'bg-terminal-dim/40 text-terminal-text hover:bg-terminal-dim hover:text-white'
                }`}
              >
                <span>🚀</span>
                <span>Recent Projects ({PROJECTS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'skills'
                    ? 'bg-terminal-primary text-black shadow-md shadow-terminal-primary/20'
                    : 'bg-terminal-dim/40 text-terminal-text hover:bg-terminal-dim hover:text-white'
                }`}
              >
                <span>🛠️</span>
                <span>Technical Skills ({SKILLS.length} Domains)</span>
              </button>

              <button
                onClick={() => setActiveTab('certifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'certifications'
                    ? 'bg-terminal-primary text-black shadow-md shadow-terminal-primary/20'
                    : 'bg-terminal-dim/40 text-terminal-text hover:bg-terminal-dim hover:text-white'
                }`}
              >
                <span>📜</span>
                <span>Certifications ({CERTIFICATIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'blogs'
                    ? 'bg-terminal-primary text-black shadow-md shadow-terminal-primary/20'
                    : 'bg-terminal-dim/40 text-terminal-text hover:bg-terminal-dim hover:text-white'
                }`}
              >
                <span>📰</span>
                <span>Fresh Tech Blogs</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT 1: WHAT I'M UP TO RIGHT NOW */}
          {activeTab === 'status' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Primary Focus Card */}
              <div className="p-4 rounded-xl bg-terminal-dim/20 border border-terminal-dim hover:border-terminal-primary/50 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-terminal-green font-bold text-base">
                    <span>🛰️</span>
                    <span>Current Role & Primary Mission</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-terminal-primary/15 text-terminal-primary border border-terminal-primary/30">
                    Active • October 2026
                  </span>
                </div>

                <div className="text-terminal-text text-sm sm:text-base leading-relaxed">
                  Working as an <span className="text-terminal-primary font-bold">AI/Machine Learning Engineer at Lantabur Apparels Ltd.</span> (Gazipur, Dhaka). Built ML demand forecasting models expanding monthly factory output from <span className="text-terminal-cyan font-bold">18 to 22 tons (+22%)</span> with zero procurement delays, and deployed AI visual inspection reducing QA staffing by <span className="text-terminal-cyan font-bold">40%</span>.
                </div>

                {/* Professional Summary Card */}
                <div className="p-3.5 rounded-xl bg-black/45 border-l-4 border-terminal-primary border-t border-r border-b border-terminal-dim/50 space-y-1.5">
                  <div className="text-xs font-mono font-bold text-terminal-primary flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Professional Summary</span>
                  </div>
                  <div className="text-xs sm:text-sm text-terminal-text leading-relaxed">
                    {ABOUT_TEXT}
                  </div>
                </div>

                {/* Sub-grid of active tracks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-dim/50 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🤖</span>
                      <span>Agentic Business Automation Platform</span>
                    </div>
                    <div className="text-xs text-terminal-text-dim leading-normal">
                      Building configurable agent platforms for enterprise Q&A and workflow automation using Python, LangGraph state machines, LangChain, Groq LLMs, FastAPI, and ChromaDB vector retrieval.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-dim/50 space-y-1">
                    <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>👁️</span>
                      <span>Deep Learning & Computer Vision</span>
                    </div>
                    <div className="text-xs text-terminal-text-dim leading-normal">
                      Engineered CNN floor-plan classification models in TensorFlow achieving 88% accuracy in live production for 5,000+ users (AppliedVastu), plus visual QA inspection for industrial pipelines.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-dim/50 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>🏭</span>
                      <span>Lantabur Industrial Intelligence Hub</span>
                    </div>
                    <div className="text-xs text-terminal-text-dim leading-normal">
                      Real-time IoT sensor telemetry streams monitoring garment-manufacturing KPIs, with scalable data pipelines designed for predictive analytics and proactive procurement.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-dim/50 space-y-1">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <span>🕷️</span>
                      <span>Scorpion 2.0 & Spatial Intelligence</span>
                    </div>
                    <div className="text-xs text-terminal-text-dim leading-normal">
                      Concurrent web-scraping framework boosting ML dataset throughput 3x, plus Android sensor-fusion & GPS spatial alignment mapping serving 5,000+ active users.
                    </div>
                  </div>
                </div>

                {/* Quick stats ribbon */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-terminal-dim/30 text-xs text-terminal-text-dim font-mono">
                  <div><span className="text-terminal-text font-bold">Experience:</span> AI/ML Engineer (2023 – Present)</div>
                  <div><span className="text-terminal-text font-bold">Core Tech:</span> Python, TensorFlow, LangGraph, FastAPI, React</div>
                  <div><span className="text-terminal-text font-bold">Location:</span> Gazipur, Dhaka, Bangladesh</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: RECENT PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-terminal-text-dim">
                <span>Pulled 5 active repository packages from Rishad's work tree:</span>
                {onOpenProjectsModal && (
                  <button
                    onClick={onOpenProjectsModal}
                    className="text-terminal-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Open 3D Showcase Deck</span>
                    <span>↗</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECTS.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3.5 rounded-xl bg-terminal-dim/20 border border-terminal-dim hover:border-terminal-primary/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-sm sm:text-base text-terminal-text group-hover:text-terminal-primary transition-colors">
                          {p.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terminal-dim/60 text-terminal-cyan shrink-0">
                          {p.category}
                        </span>
                      </div>

                      <div className="text-xs text-terminal-text-dim mb-3 line-clamp-2">
                        {p.description}
                      </div>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-terminal-text/80 border border-terminal-dim/40"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions and Metrics */}
                    <div className="pt-2 border-t border-terminal-dim/30 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 text-terminal-text-dim font-mono text-[11px]">
                        {p.highlights && p.highlights[0] && (
                          <span>★ {p.highlights[0].label}: {p.highlights[0].value}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {p.github && p.github !== '#' && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded bg-terminal-dim/50 hover:bg-terminal-primary hover:text-black font-mono text-xs transition-colors"
                          >
                            GitHub ↗
                          </a>
                        )}
                        {onOpenProjectsModal && (
                          <button
                            onClick={onOpenProjectsModal}
                            className="px-2.5 py-1 rounded bg-terminal-primary/20 text-terminal-primary hover:bg-terminal-primary hover:text-black font-mono text-xs font-semibold transition-colors"
                          >
                            3D Deck ↗
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: TECHNICAL SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-terminal-text-dim">
                <span>Verified technical skill stack categorized by operational domain:</span>
                <span className="font-mono text-terminal-primary text-[11px]">{SKILLS.reduce((acc, c) => acc + c.skills.length, 0)} total competencies</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SKILLS.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-terminal-dim/20 border border-terminal-dim hover:border-terminal-primary/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-terminal-dim/40">
                        <span className="font-bold text-xs sm:text-sm text-terminal-primary uppercase tracking-wide">
                          {cat.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-terminal-dim/60 text-terminal-cyan">
                          {cat.skills.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/50 text-terminal-text border border-terminal-dim/40 hover:border-terminal-primary/60 transition-colors"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-terminal-text-dim">
                <span>Professional certifications and verified industry credentials:</span>
                <span className="font-mono text-terminal-primary text-[11px]">Coursera • Google • Tata Group Forage</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {CERTIFICATIONS.map((cert, idx) => {
                  const isInProgress = cert.status?.toLowerCase().includes('progress') || cert.year.toLowerCase().includes('progress');
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-terminal-dim/20 border border-terminal-dim hover:border-terminal-primary/60 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-terminal-accent uppercase tracking-wider font-mono">
                            {cert.issuer}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-terminal-dim/50 text-terminal-text-dim border border-terminal-dim/40">
                            {cert.year}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-terminal-text mb-1.5">
                          {cert.name}
                        </h4>
                        {cert.details && (
                          <p className="text-xs text-terminal-text-dim leading-relaxed">
                            {cert.details}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-terminal-dim/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isInProgress ? 'bg-amber-400 animate-ping' : 'bg-terminal-green animate-pulse'}`}></span>
                          <span className="text-[11px] font-mono uppercase tracking-wide text-terminal-text-dim">
                            {cert.status || (isInProgress ? 'In Progress' : 'Verified Credential')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: FRESH TECH BLOGS */}
          {activeTab === 'blogs' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-terminal-text-dim">
                <span>Recent technical publications & research notes:</span>
                {onOpenBlogsModal && (
                  <button
                    onClick={() => onOpenBlogsModal()}
                    className="text-terminal-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Open GUI Reader</span>
                    <span>↗</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'blog1.md',
                    title: 'Building High-Performance AI Applications with Gemini 3.6 & 3.8 Flash',
                    date: '2026-08-01',
                    readTime: '5 min read',
                    tags: ['AI', 'Gemini', 'TypeScript', 'Performance'],
                    summary: 'Optimizing response latency, server-side streaming, tool calling, and high-throughput context windows with the official @google/genai SDK.'
                  },
                  {
                    id: 'blog2.md',
                    title: 'Why Every AI Engineer Needs an Interactive Terminal Portfolio',
                    date: '2026-07-15',
                    readTime: '4 min read',
                    tags: ['WebDev', 'Terminal', 'UI/UX', 'Portfolio'],
                    summary: 'How combining Unix shell aesthetics, interactive 3D physics lanyards, and real-time LLMs turns a standard CV into an unforgettable engineering showcase.'
                  },
                  {
                    id: 'blog3.md',
                    title: 'Architecting Real-Time LLM Agents and Local State Engines',
                    date: '2026-06-20',
                    readTime: '6 min read',
                    tags: ['Architecture', 'Agents', 'State Management'],
                    summary: 'Designing state machines, event streaming, and client-server synchronization patterns for multi-turn agentic workflows.'
                  }
                ].map((blog, idx) => (
                  <div
                    key={blog.id}
                    className="p-3.5 rounded-xl bg-terminal-dim/20 border border-terminal-dim hover:border-terminal-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-terminal-primary font-bold">
                          [{idx + 1}] {blog.id}
                        </span>
                        <span className="text-[11px] font-mono text-terminal-text-dim">
                          {blog.date} • {blog.readTime}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-terminal-text">
                        {blog.title}
                      </h4>
                      <p className="text-xs text-terminal-text-dim line-clamp-1 max-w-2xl">
                        {blog.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onRunCommand && (
                        <button
                          onClick={() => onRunCommand(`cat blogs/${blog.id}`)}
                          className="px-2.5 py-1 rounded bg-terminal-dim/50 hover:bg-terminal-primary hover:text-black font-mono text-xs transition-colors"
                        >
                          cat {blog.id}
                        </button>
                      )}
                      {onOpenBlogsModal && (
                        <button
                          onClick={() => onOpenBlogsModal(blog.id)}
                          className="px-2.5 py-1 rounded bg-terminal-primary/20 text-terminal-primary hover:bg-terminal-primary hover:text-black font-mono text-xs font-semibold transition-colors"
                        >
                          Read ↗
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Dock */}
          <div className="pt-3 border-t border-terminal-dim/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-terminal-text-dim font-mono">
              Quick Kali Commands:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {onOpenProjectsModal && (
                <button
                  onClick={onOpenProjectsModal}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black font-mono font-bold transition-all"
                >
                  🗂️ Explore 3D Project Deck
                </button>
              )}
              {onRunCommand && (
                <>
                  <button
                    onClick={() => onRunCommand('contact')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black font-mono font-bold transition-all"
                  >
                    ✉️ Contact Rishad
                  </button>
                  <button
                    onClick={() => onRunCommand('neofetch')}
                    className="px-3 py-1.5 rounded-lg bg-terminal-dim/50 text-terminal-text hover:bg-terminal-dim hover:text-white font-mono transition-all"
                  >
                    🖥️ neofetch
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

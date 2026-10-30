import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Folder, 
  FileText, 
  Home, 
  Clock, 
  Star, 
  Globe, 
  Trash2, 
  HardDrive, 
  Search, 
  Grid, 
  List, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Minus,
  Maximize2,
  Minimize2,
  Copy, 
  Check, 
  Terminal as TerminalIcon, 
  Share2, 
  Tag, 
  User, 
  Calendar, 
  MoreVertical,
  Code2,
  FileCode,
  SlidersHorizontal,
  ExternalLink,
  BookOpen,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  Info,
  ArrowUpDown
} from 'lucide-react';
import { BlogPost } from '../types';
import { fetchAllBlogs, findBlog } from '../utils/blogUtils';
import { useTheme } from '../contexts/ThemeContext';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBlogId?: string | null;
  onOpenInTerminal?: (cmd: string) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  selectedBlogId,
  onOpenInTerminal
}) => {
  const { currentTheme } = useTheme();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [sidebarSection, setSidebarSection] = useState<'home' | 'recent' | 'starred' | 'all' | string>('home');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Sorting method state (default by date desc)
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'readTime-asc'>('date-desc');

  // Document Reader interactive state & tile hover
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [hoveredBlog, setHoveredBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAllBlogs().then(data => {
        setBlogs(data);
        setLoading(false);

        if (selectedBlogId) {
          const found = findBlog(data, selectedBlogId);
          if (found) setActiveBlog(found);
        }
      });
    } else {
      setActiveBlog(null);
      setSearchQuery('');
      setSelectedCategory('all');
      setSelectedTag('All');
      setSidebarSection('home');
      setSortBy('date-desc');
      setIsMaximized(false);
      setIsMinimized(false);
    }
  }, [isOpen, selectedBlogId]);

  if (!isOpen) return null;

  // Minimized floating taskbar dock button
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-50 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs cursor-pointer transition-all select-none group animate-fadeIn border"
        style={{
          backgroundColor: currentTheme.colors.dim,
          borderColor: currentTheme.colors.primary,
          color: currentTheme.colors.text
        }}
        title="Click to restore File Manager window"
      >
        <div 
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        ></div>
        <Folder className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
        <span className="font-semibold">{activeBlog ? `Document: ${activeBlog.filename}` : 'Blogs & Articles'}</span>
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

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(blogs.flatMap(b => b.tags || [])))];

  // Filtered blogs according to active sidebar selection & search
  const filteredBlogs = blogs.filter(b => {
    // Sidebar section filtering
    if (sidebarSection === 'recent') {
      // Show recent
    } else if (sidebarSection === 'starred') {
      // Filter starred
    } else if (sidebarSection !== 'home' && sidebarSection !== 'all') {
      // Filter by tag
      if (!b.tags?.includes(sidebarSection)) return false;
    }

    // Tag filtering from toolbar
    const matchesTag = selectedTag === 'All' || (b.tags && b.tags.includes(selectedTag));
    
    // Search query filtering
    const matchesQuery = searchQuery === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesQuery;
  });

  // Sorted blogs according to user selected sort method
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'readTime-asc') {
      const parseReadTime = (t: string) => parseInt(t.replace(/\D/g, '')) || 0;
      return parseReadTime(a.readTime) - parseReadTime(b.readTime);
    }
    return 0;
  });

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleShareArticle = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  /* ==================================================================== */
  /*  STANDALONE DOCUMENT READER APPLICATION VIEW (WHEN BLOG IS ACTIVE)   */
  /* ==================================================================== */
  if (activeBlog) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={() => setActiveBlog(null)}
      >
        {/* Document Reader Application Window */}
        <div 
          className={`border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 select-none font-sans ${
            isMaximized 
              ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
              : 'w-full max-w-5xl h-[92vh] max-h-[880px] rounded-2xl'
          }`}
          style={{
            backgroundColor: currentTheme.colors.bg,
            borderColor: currentTheme.colors.dim,
            color: currentTheme.colors.text
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Document Reader OS Window Titlebar */}
          <div 
            className="h-10 px-4 border-b flex items-center justify-between text-xs font-mono flex-shrink-0 select-none"
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: currentTheme.colors.dim,
              color: currentTheme.colors.text
            }}
          >
            {/* Left Title Badge */}
            <div className="flex items-center gap-2.5">
              <div 
                className="p-1 rounded border"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  borderColor: `${currentTheme.colors.primary}40`,
                  color: currentTheme.colors.primary
                }}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs sm:text-sm truncate">
                Document Reader — <span style={{ color: currentTheme.colors.primary }} className="font-semibold">{activeBlog.filename}</span>
              </span>
              <span 
                className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded border font-mono"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}15`,
                  borderColor: `${currentTheme.colors.primary}30`,
                  color: currentTheme.colors.primary
                }}
              >
                v3.2 Reader App
              </span>
            </div>

            {/* Right Window Controls: Order is strictly Minimize, Maximize, Close */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(true)}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center group cursor-pointer"
                title="Minimize Window"
              >
                <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center group cursor-pointer"
                title={isMaximized ? "Restore Window" : "Maximize Window"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
              <button 
                onClick={() => setActiveBlog(null)}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group cursor-pointer"
                title="Close Document Reader (Return to File Explorer)"
              >
                <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div 
            className="px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-mono flex-shrink-0"
            style={{
              backgroundColor: currentTheme.colors.bg,
              borderColor: currentTheme.colors.dim
            }}
          >
            <div 
              className="flex items-center border rounded-xl px-3 py-1 gap-3"
              style={{
                backgroundColor: currentTheme.colors.dim,
                borderColor: `${currentTheme.colors.textDim}30`
              }}
            >
              <div 
                className="flex items-center gap-1 border-r pr-3"
                style={{ borderColor: `${currentTheme.colors.textDim}40` }}
              >
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 rounded transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.text }}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span 
                  className="text-[11px] font-bold min-w-[36px] text-center"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {zoomLevel}%
                </span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-1 rounded transition-colors hover:opacity-80"
                  style={{ color: currentTheme.colors.text }}
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px]" style={{ color: currentTheme.colors.textDim }}>
                <span>Page <strong style={{ color: currentTheme.colors.text }}>1</strong> of 1</span>
                <span>•</span>
                <span style={{ color: currentTheme.colors.accent }} className="font-semibold">
                  {activeBlog.content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCmd(`blogs ${activeBlog.filename}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all hover:opacity-90"
                style={{
                  backgroundColor: currentTheme.colors.dim,
                  borderColor: `${currentTheme.colors.primary}40`,
                  color: currentTheme.colors.text
                }}
                title="Copy terminal command"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copiedCmd ? 'Copied' : 'blogs cmd'}</span>
              </button>

              {onOpenInTerminal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenInTerminal(`blogs ${activeBlog.filename}`);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] shadow-sm hover:opacity-90"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.isDark === false ? '#ffffff' : '#000000'
                  }}
                  title="Execute command in shell"
                >
                  <TerminalIcon className="w-3 h-3" />
                  <span>Shell ▶</span>
                </button>
              )}

              <button
                onClick={() => setActiveBlog(null)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border transition-all text-[11px] font-bold hover:opacity-90"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  borderColor: `${currentTheme.colors.primary}50`,
                  color: currentTheme.colors.primary
                }}
                title="Return to File Explorer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Return to Explorer</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div 
            className="flex-1 p-2.5 sm:p-8 overflow-y-auto overflow-x-hidden"
            style={{ backgroundColor: currentTheme.colors.bg }}
          >
            <div 
              className="mx-auto max-w-4xl border rounded-2xl shadow-2xl p-4 sm:p-10 transition-all duration-200"
              style={{ 
                zoom: `${zoomLevel}%`,
                backgroundColor: currentTheme.colors.dim,
                borderColor: `${currentTheme.colors.textDim}30`,
                color: currentTheme.colors.text
              }}
            >
              {/* Paper Header */}
              <div 
                className="border-b pb-6 mb-6 space-y-4"
                style={{ borderColor: `${currentTheme.colors.textDim}30` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}15`,
                      borderColor: `${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    TECHNICAL DOCUMENTATION
                  </span>
                  <span className="flex items-center gap-1" style={{ color: currentTheme.colors.textDim }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                    Published: {activeBlog.date}
                  </span>
                </div>

                <h1 
                  className="text-2xl sm:text-3xl font-bold font-mono leading-snug"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {activeBlog.title}
                </h1>

                <p 
                  className="text-xs sm:text-sm italic border-l-4 pl-3 py-1 rounded-r leading-relaxed"
                  style={{
                    borderColor: currentTheme.colors.accent,
                    backgroundColor: `${currentTheme.colors.accent}10`,
                    color: currentTheme.colors.text
                  }}
                >
                  {activeBlog.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2">
                  <div className="flex items-center gap-2" style={{ color: currentTheme.colors.textDim }}>
                    <User className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                    <span>Author: <strong style={{ color: currentTheme.colors.text }}>{activeBlog.author}</strong></span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" style={{ color: currentTheme.colors.accent }} />
                    <span style={{ color: currentTheme.colors.accent }} className="font-semibold">{activeBlog.readTime} read</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeBlog.tags?.map(t => (
                      <span 
                        key={t} 
                        className="px-2 py-0.5 rounded border text-[10px] font-mono"
                        style={{
                          backgroundColor: `${currentTheme.colors.secondary}15`,
                          borderColor: `${currentTheme.colors.secondary}30`,
                          color: currentTheme.colors.secondary
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered Markdown */}
              <div className="text-sm leading-relaxed" style={{ color: currentTheme.colors.text }}>
                <div className="markdown-body">
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <h1 
                          className="text-xl sm:text-2xl font-bold font-mono mt-6 mb-3 border-b pb-2 flex items-center gap-2"
                          style={{
                            color: currentTheme.colors.primary,
                            borderColor: `${currentTheme.colors.textDim}30`
                          }}
                        >
                          <span style={{ color: currentTheme.colors.accent }}>#</span> {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 
                          className="text-lg sm:text-xl font-bold font-mono mt-5 mb-2 flex items-center gap-2"
                          style={{ color: currentTheme.colors.secondary }}
                        >
                          <span style={{ color: currentTheme.colors.accent }}>##</span> {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 
                          className="text-base font-bold font-mono mt-4 mb-2"
                          style={{ color: currentTheme.colors.accent }}
                        >
                          ### {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <div className="mb-4 text-sm sm:text-base leading-relaxed opacity-95">
                          {children}
                        </div>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 opacity-95">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 opacity-95 font-mono">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote 
                          className="border-l-4 p-3 my-4 rounded-r-lg font-mono text-xs sm:text-sm italic"
                          style={{
                            borderColor: currentTheme.colors.primary,
                            backgroundColor: `${currentTheme.colors.primary}10`,
                            color: currentTheme.colors.text
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      pre: ({ children }) => (
                        <div 
                          className="border rounded-xl p-4 my-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed shadow-inner"
                          style={{
                            backgroundColor: currentTheme.colors.bg,
                            borderColor: `${currentTheme.colors.textDim}30`,
                            color: currentTheme.colors.primary
                          }}
                        >
                          <pre><code>{children}</code></pre>
                        </div>
                      ),
                      code: ({ inline, children }: any) => {
                        if (inline) {
                          return (
                            <code 
                              className="font-mono text-xs px-1.5 py-0.5 rounded border"
                              style={{
                                backgroundColor: currentTheme.colors.bg,
                                borderColor: `${currentTheme.colors.accent}40`,
                                color: currentTheme.colors.accent
                              }}
                            >
                              {children}
                            </code>
                          );
                        }
                        return <code>{children}</code>;
                      },
                      hr: () => <hr className="my-6" style={{ borderColor: `${currentTheme.colors.textDim}30` }} />
                    }}
                  >
                    {activeBlog.content || ''}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>

          {/* Reader Bottom Footer */}
          <div 
            className="px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono flex-shrink-0"
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}30`,
              color: currentTheme.colors.textDim
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold flex items-center gap-1" style={{ color: currentTheme.colors.primary }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Document Loaded
              </span>
              <span>•</span>
              <span>Encoding: UTF-8</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleShareArticle}
                className="transition-colors flex items-center gap-1 hover:opacity-80"
                style={{ color: currentTheme.colors.text }}
              >
                <Share2 className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                <span>{copiedLink ? 'Link Copied!' : 'Share Document'}</span>
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveBlog(null)}
                className="font-bold flex items-center gap-1 hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Explorer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================================================================== */
  /*            KALI LINUX THUNAR FILE EXPLORER MAIN WINDOW               */
  /* ==================================================================== */
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Kali Linux Thunar / File Manager Window Frame */}
      <div 
        className={`border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 select-none font-sans ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-6xl h-[90vh] max-h-[850px] rounded-2xl'
        }`}
        style={{
          backgroundColor: currentTheme.colors.bg,
          borderColor: currentTheme.colors.dim,
          color: currentTheme.colors.text
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Body with Left Sidebar & Right Content */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Mobile Overlay Backdrop for Sidebar */}
          {mobileSidebarOpen && (
            <div 
              className="md:hidden absolute inset-0 bg-black/70 z-30 animate-fadeIn" 
              onClick={() => setMobileSidebarOpen(false)} 
            />
          )}

          {/* ==================================================== */}
          {/*           LEFT SIDEBAR (Kali File Manager)          */}
          {/* ==================================================== */}
          <div 
            className={`border-r flex flex-col flex-shrink-0 select-none transition-all duration-300 ${
              mobileSidebarOpen 
                ? 'absolute inset-y-0 left-0 z-40 w-64 shadow-2xl flex' 
                : 'hidden md:flex w-56 sm:w-64'
            }`}
            style={{
              backgroundColor: currentTheme.colors.dim,
              borderColor: `${currentTheme.colors.textDim}30`
            }}
          >
            {/* Sidebar Header */}
            <div 
              className="p-3.5 border-b flex items-center justify-between"
              style={{
                borderColor: `${currentTheme.colors.textDim}30`,
                color: currentTheme.colors.textDim
              }}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                <span className="text-xs font-bold tracking-wide uppercase font-mono" style={{ color: currentTheme.colors.text }}>
                  Files
                </span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="p-1 rounded hover:opacity-80 cursor-pointer"
                style={{ color: currentTheme.colors.textDim }}
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-medium">
              {/* Top Quick Access Links */}
              <div className="space-y-0.5">
                <button
                  onClick={() => { setSidebarSection('home'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    sidebarSection === 'home'
                      ? 'font-semibold shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: sidebarSection === 'home' ? currentTheme.colors.bg : 'transparent',
                    color: sidebarSection === 'home' ? currentTheme.colors.primary : currentTheme.colors.textDim
                  }}
                >
                  <Home className="w-4 h-4" style={{ color: sidebarSection === 'home' ? currentTheme.colors.primary : currentTheme.colors.textDim }} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('recent'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    sidebarSection === 'recent'
                      ? 'font-semibold shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: sidebarSection === 'recent' ? currentTheme.colors.bg : 'transparent',
                    color: sidebarSection === 'recent' ? currentTheme.colors.accent : currentTheme.colors.textDim
                  }}
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Recent</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('starred'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    sidebarSection === 'starred'
                      ? 'font-semibold shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: sidebarSection === 'starred' ? currentTheme.colors.bg : 'transparent',
                    color: sidebarSection === 'starred' ? currentTheme.colors.secondary : currentTheme.colors.textDim
                  }}
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Starred</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('all'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    sidebarSection === 'all'
                      ? 'font-semibold shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: sidebarSection === 'all' ? currentTheme.colors.bg : 'transparent',
                    color: sidebarSection === 'all' ? currentTheme.colors.primary : currentTheme.colors.textDim
                  }}
                >
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Network</span>
                </button>

                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors cursor-not-allowed opacity-40"
                  style={{ color: currentTheme.colors.textDim }}
                  title="Empty Trash"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Trash</span>
                </button>
              </div>

              <div className="h-[1px] mx-2" style={{ backgroundColor: `${currentTheme.colors.textDim}20` }}></div>

              {/* Places / Folders Section */}
              <div className="space-y-1">
                <div 
                  className="px-3 text-[10px] font-bold tracking-wider uppercase font-mono mb-1"
                  style={{ color: currentTheme.colors.textDim }}
                >
                  Topics & Tags
                </div>

                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (tag === 'All') setSidebarSection('home');
                      else setSidebarSection(tag);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition-all ${
                      sidebarSection === tag
                        ? 'font-semibold'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: sidebarSection === tag ? currentTheme.colors.bg : 'transparent',
                      color: sidebarSection === tag ? currentTheme.colors.primary : currentTheme.colors.textDim
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                      <span className="truncate max-w-[120px]">{tag === 'All' ? 'Documents' : tag}</span>
                    </div>
                    {tag !== 'All' && (
                      <span 
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded-md border"
                        style={{
                          backgroundColor: currentTheme.colors.bg,
                          borderColor: `${currentTheme.colors.textDim}30`,
                          color: currentTheme.colors.textDim
                        }}
                      >
                        {blogs.filter(b => b.tags?.includes(tag)).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="h-[1px] mx-2" style={{ backgroundColor: `${currentTheme.colors.textDim}20` }}></div>

              {/* System Drives / Volumes Section */}
              <div className="space-y-1">
                <div 
                  className="px-3 text-[10px] font-bold tracking-wider uppercase font-mono mb-1"
                  style={{ color: currentTheme.colors.textDim }}
                >
                  Volumes
                </div>

                <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs" style={{ color: currentTheme.colors.textDim }}>
                  <HardDrive className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                  <span className="font-mono text-[11px] truncate">195 GB Volume (/blogs)</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs opacity-60" style={{ color: currentTheme.colors.textDim }}>
                  <HardDrive className="w-4 h-4" />
                  <span className="font-mono text-[11px] truncate">263 GB Volume (github)</span>
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div 
              className="h-10 px-3.5 border-t flex items-center justify-between text-[11px] font-mono flex-shrink-0 select-none"
              style={{
                backgroundColor: currentTheme.colors.bg,
                borderColor: `${currentTheme.colors.textDim}30`,
                color: currentTheme.colors.textDim
              }}
            >
              <span className="flex items-center gap-1.5">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                ></span>
                <span className="font-semibold" style={{ color: currentTheme.colors.text }}>Portfolio OS v2.34</span>
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/*          RIGHT MAIN CONTENT AREA (Thunar View)       */}
          {/* ==================================================== */}
          <div 
            className="flex-1 flex flex-col overflow-hidden relative min-w-0"
            style={{ backgroundColor: currentTheme.colors.bg }}
          >

            {/* Top Kali File Manager Toolbar */}
            <div 
              className="p-2 sm:p-2.5 border-b flex items-center justify-between gap-2 flex-shrink-0 select-none"
              style={{
                backgroundColor: currentTheme.colors.dim,
                borderColor: `${currentTheme.colors.textDim}30`
              }}
            >
              {/* Back / Forward Navigation & Breadcrumb Location Bar */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {/* Mobile Folders Sidebar Toggle Button */}
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.primary}40`,
                    color: currentTheme.colors.primary
                  }}
                  title="Toggle Folders Sidebar"
                >
                  <Folder className="w-3.5 h-3.5" style={{ color: currentTheme.colors.primary }} />
                  <span className="hidden xs:inline">Folders</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  <button 
                    disabled 
                    className="p-1.5 rounded-lg border cursor-not-allowed opacity-30"
                    style={{ borderColor: `${currentTheme.colors.textDim}30`, color: currentTheme.colors.textDim }}
                    title="Back"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled 
                    className="p-1.5 rounded-lg border cursor-not-allowed opacity-30"
                    style={{ borderColor: `${currentTheme.colors.textDim}30`, color: currentTheme.colors.textDim }}
                    title="Forward"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Path Pill Breadcrumb */}
                <div 
                  className="flex-1 min-w-0 border rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs font-mono truncate"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}30`,
                    color: currentTheme.colors.text
                  }}
                >
                  <Home className="w-3.5 h-3.5 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span style={{ color: currentTheme.colors.textDim }}>/</span>
                  <span className="font-semibold hidden sm:inline" style={{ color: currentTheme.colors.text }}>Home</span>
                  <span style={{ color: currentTheme.colors.textDim }} className="hidden sm:inline">/</span>
                  <span className="font-semibold truncate" style={{ color: currentTheme.colors.primary }}>
                    {sidebarSection === 'home' ? 'blogs' : sidebarSection}
                  </span>
                </div>
              </div>

              {/* Toolbar Controls: Sort, Search, View Toggle, Window Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                
                {/* SORT BY DROPDOWN METHOD SELECTOR */}
                <div 
                  className="flex items-center gap-1.5 border rounded-xl px-2.5 py-1 text-xs font-mono"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}30`
                  }}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
                  <span className="hidden lg:inline text-[11px]" style={{ color: currentTheme.colors.textDim }}>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-semibold focus:outline-none cursor-pointer text-xs"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    <option value="date-desc" style={{ backgroundColor: currentTheme.colors.bg, color: currentTheme.colors.text }}>Date (Newest)</option>
                    <option value="date-asc" style={{ backgroundColor: currentTheme.colors.bg, color: currentTheme.colors.text }}>Date (Oldest)</option>
                    <option value="title-asc" style={{ backgroundColor: currentTheme.colors.bg, color: currentTheme.colors.text }}>Title (A - Z)</option>
                    <option value="readTime-asc" style={{ backgroundColor: currentTheme.colors.bg, color: currentTheme.colors.text }}>Read Time</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2" style={{ color: currentTheme.colors.textDim }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="border rounded-xl pl-8 pr-6 py-1 text-xs font-mono w-28 lg:w-40 transition-all focus:outline-none"
                    style={{
                      backgroundColor: currentTheme.colors.bg,
                      borderColor: `${currentTheme.colors.textDim}30`,
                      color: currentTheme.colors.text
                    }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1.5 text-xs hover:opacity-80"
                      style={{ color: currentTheme.colors.textDim }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* View Mode Switcher (Grid vs List) */}
                <div 
                  className="flex items-center border rounded-xl p-0.5"
                  style={{
                    backgroundColor: currentTheme.colors.bg,
                    borderColor: `${currentTheme.colors.textDim}30`
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: viewMode === 'grid' ? currentTheme.colors.dim : 'transparent',
                      color: viewMode === 'grid' ? currentTheme.colors.primary : currentTheme.colors.textDim
                    }}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: viewMode === 'list' ? currentTheme.colors.dim : 'transparent',
                      color: viewMode === 'list' ? currentTheme.colors.primary : currentTheme.colors.textDim
                    }}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Window Controls Dots: strictly Minimize (yellow), Maximize (green), Close (red) */}
                <div className="flex items-center gap-2 ml-1 pl-2 border-l" style={{ borderColor: `${currentTheme.colors.textDim}30` }}>
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center group cursor-pointer"
                    title="Minimize"
                  >
                    <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center group cursor-pointer"
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
                    className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group cursor-pointer"
                    title="Close"
                  >
                    <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Quick Folder Tag Selector Bar */}
            <div 
              className="md:hidden flex items-center gap-1.5 px-3 py-2 border-b overflow-x-auto custom-scrollbar flex-shrink-0 text-xs select-none"
              style={{
                backgroundColor: currentTheme.colors.dim,
                borderColor: `${currentTheme.colors.textDim}30`
              }}
            >
              <button
                onClick={() => { setSidebarSection('home'); setMobileSidebarOpen(false); }}
                className="px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 transition-all border"
                style={{
                  backgroundColor: sidebarSection === 'home' ? currentTheme.colors.bg : 'transparent',
                  borderColor: sidebarSection === 'home' ? currentTheme.colors.primary : 'transparent',
                  color: sidebarSection === 'home' ? currentTheme.colors.primary : currentTheme.colors.textDim
                }}
              >
                <Home className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                <span>Home</span>
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'All') setSidebarSection('home');
                    else setSidebarSection(tag);
                    setMobileSidebarOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 transition-all border"
                  style={{
                    backgroundColor: sidebarSection === tag ? currentTheme.colors.bg : 'transparent',
                    borderColor: sidebarSection === tag ? currentTheme.colors.primary : 'transparent',
                    color: sidebarSection === tag ? currentTheme.colors.primary : currentTheme.colors.textDim
                  }}
                >
                  <Folder className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                  <span>{tag === 'All' ? 'Documents' : tag}</span>
                </button>
              ))}
            </div>

            {/* Main Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
              {loading ? (
                <div className="py-28 text-center font-mono space-y-3 animate-pulse" style={{ color: currentTheme.colors.primary }}>
                  <FileCode className="w-10 h-10 mx-auto" style={{ color: currentTheme.colors.primary }} />
                  <p className="text-xs" style={{ color: currentTheme.colors.textDim }}>[THUNAR] Reading /blogs directory files...</p>
                </div>
              ) : sortedBlogs.length === 0 ? (
                /* Empty state */
                <div 
                  className="py-20 text-center font-mono border border-dashed rounded-2xl p-8 space-y-3"
                  style={{ borderColor: `${currentTheme.colors.textDim}30`, color: currentTheme.colors.textDim }}
                >
                  <p className="text-sm">No files found matching criteria</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedTag('All'); setSidebarSection('home'); }}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      borderColor: `${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                  >
                    Reset Directory View
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* ==================================================== */
                /*             KALI LINUX THUNAR GRID VIEW              */
                /* ==================================================== */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {sortedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => setActiveBlog(blog)}
                      onMouseEnter={() => setHoveredBlog(blog)}
                      onMouseLeave={() => setHoveredBlog(null)}
                      className="group flex flex-col items-center text-center cursor-pointer p-3 rounded-2xl border transition-all duration-200 select-none hover:scale-105"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent'
                      }}
                    >
                      {/* Theme-aware Folder/File Tile */}
                      <div className="relative mb-2 w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center">
                        <div 
                          className="w-full h-full rounded-2xl shadow-md transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden border"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                            borderColor: `${currentTheme.colors.primary}80`
                          }}
                        >
                          <div className="bg-black/30 w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute top-1 right-1 px-1 py-0.2 bg-black/50 rounded text-[9px] font-mono text-white font-bold">
                            .md
                          </div>
                        </div>
                      </div>

                      {/* File Name Label Underneath */}
                      <span 
                        className="text-xs font-mono font-semibold truncate max-w-[120px] transition-colors"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {blog.filename}
                      </span>
                      
                      <span 
                        className="text-[10px] font-mono line-clamp-1 max-w-[130px] mt-0.5"
                        style={{ color: currentTheme.colors.textDim }}
                      >
                        {blog.title}
                      </span>

                      <div 
                        className="text-[9px] font-mono mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        <span>{blog.readTime}</span>
                        <span>•</span>
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ==================================================== */
                /*             THUNAR DETAILED LIST VIEW                */
                /* ==================================================== */
                <div 
                  className="border rounded-2xl overflow-hidden shadow-lg font-mono text-xs"
                  style={{
                    backgroundColor: currentTheme.colors.dim,
                    borderColor: `${currentTheme.colors.textDim}30`
                  }}
                >
                  {/* Table Header */}
                  <div 
                    className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b font-bold text-[11px] uppercase tracking-wider"
                    style={{
                      backgroundColor: currentTheme.colors.bg,
                      borderColor: `${currentTheme.colors.textDim}30`,
                      color: currentTheme.colors.textDim
                    }}
                  >
                    <div className="col-span-5 sm:col-span-4">Name</div>
                    <div className="col-span-3 sm:col-span-4 truncate">Title</div>
                    <div className="col-span-2 hidden sm:block">Date</div>
                    <div className="col-span-4 sm:col-span-2 text-right">Size / Time</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y" style={{ borderColor: `${currentTheme.colors.textDim}20` }}>
                    {sortedBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => setActiveBlog(blog)}
                        onMouseEnter={() => setHoveredBlog(blog)}
                        onMouseLeave={() => setHoveredBlog(null)}
                        className="grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-colors group hover:opacity-90"
                        style={{
                          color: currentTheme.colors.text
                        }}
                      >
                        <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                          <div 
                            className="p-1.5 rounded-lg flex-shrink-0"
                            style={{
                              backgroundColor: `${currentTheme.colors.primary}20`,
                              color: currentTheme.colors.primary
                            }}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-bold truncate" style={{ color: currentTheme.colors.text }}>
                            {blog.filename}
                          </span>
                        </div>

                        <div className="col-span-3 sm:col-span-4 truncate" style={{ color: currentTheme.colors.textDim }}>
                          {blog.title}
                        </div>

                        <div className="col-span-2 hidden sm:block text-[11px]" style={{ color: currentTheme.colors.textDim }}>
                          {blog.date}
                        </div>

                        <div className="col-span-4 sm:col-span-2 text-right font-semibold text-[11px]" style={{ color: currentTheme.colors.primary }}>
                          {blog.readTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================== */}
            {/* HOVER INFO LAYER PINNED AT RIGHT BOTTOM OF EXPLORER  */}
            {/* ==================================================== */}
            {hoveredBlog && (
              <div 
                className="absolute bottom-12 right-4 z-40 backdrop-blur-md border rounded-md px-3.5 py-1.5 shadow-2xl font-mono text-xs animate-fadeIn pointer-events-none flex items-center gap-2.5"
                style={{
                  backgroundColor: currentTheme.colors.bg,
                  borderColor: `${currentTheme.colors.primary}80`,
                  color: currentTheme.colors.text
                }}
              >
                <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: currentTheme.colors.primary }} />
                <span className="font-bold truncate max-w-[200px]" style={{ color: currentTheme.colors.primary }}>{hoveredBlog.filename}</span>
                <span style={{ color: currentTheme.colors.textDim }}>•</span>
                <span>{hoveredBlog.date}</span>
                <span style={{ color: currentTheme.colors.textDim }}>•</span>
                <span style={{ color: currentTheme.colors.accent }} className="font-semibold">{((hoveredBlog.content?.length || 500) / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {/* Bottom Thunar Statusbar */}
            <div 
              className="h-10 px-3.5 border-t flex items-center justify-between text-xs font-mono flex-shrink-0 select-none"
              style={{
                backgroundColor: currentTheme.colors.dim,
                borderColor: `${currentTheme.colors.textDim}30`,
                color: currentTheme.colors.textDim
              }}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold" style={{ color: currentTheme.colors.primary }}>{sortedBlogs.length} items</span>
                <span>•</span>
                <span>Free space: 142.8 GB</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px]" style={{ color: currentTheme.colors.textDim }}>
                <span>Type <code className="font-bold font-mono" style={{ color: currentTheme.colors.accent }}>blogs</code> in terminal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

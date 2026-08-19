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
        className="fixed bottom-4 left-4 z-50 bg-[#1c202a] border border-[#2e3545] text-cyan-300 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs cursor-pointer hover:bg-[#283042] hover:border-cyan-400/50 transition-all select-none group animate-fadeIn"
        title="Click to restore File Manager window"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
        <Folder className="w-4 h-4 text-cyan-400" />
        <span className="font-semibold text-gray-200 group-hover:text-cyan-300">Blogs & Articles</span>
        <span className="text-[10px] bg-[#12151c] px-2 py-0.5 rounded text-gray-400 border border-[#2a3142]">Minimized ↗</span>
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
          className={`bg-[#12151d] border border-[#2a354a] shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-gray-200 transition-all duration-300 select-none font-sans ${
            isMaximized 
              ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
              : 'w-full max-w-5xl h-[92vh] max-h-[880px] rounded-2xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Document Reader OS Window Titlebar */}
          <div className="h-10 px-4 bg-[#181d28] border-b border-[#2a354a] flex items-center justify-between text-xs font-mono flex-shrink-0 select-none">
            {/* Left Title Badge */}
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-200 text-xs sm:text-sm truncate">
                Document Reader — <span className="text-cyan-300 font-semibold">{activeBlog.filename}</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                v3.2 Reader App
              </span>
            </div>

            {/* Right Window Controls */}
            <div className="flex items-center gap-1.5">
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
          <div className="px-4 py-2 bg-[#141822] border-b border-[#2a354a] flex flex-wrap items-center justify-between gap-2 text-xs font-mono flex-shrink-0">
            <div className="flex items-center bg-[#0d0f15] border border-[#2a354a] rounded-xl px-3 py-1 gap-3">
              <div className="flex items-center gap-1 border-r border-[#2a354a] pr-3 text-gray-400">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 hover:text-cyan-300 hover:bg-[#1f2636] rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-cyan-300 min-w-[36px] text-center">
                  {zoomLevel}%
                </span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-1 hover:text-cyan-300 hover:bg-[#1f2636] rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <span className="text-gray-300">Page <strong className="text-white">1</strong> of 1</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{activeBlog.content.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCmd(`blogs ${activeBlog.filename}`)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a202c] border border-[#2a354a] text-gray-300 hover:text-cyan-300 hover:border-cyan-400 transition-all text-[11px]"
                title="Copy terminal command"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copiedCmd ? 'Copied' : 'blogs cmd'}</span>
              </button>

              {onOpenInTerminal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenInTerminal(`blogs ${activeBlog.filename}`);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all text-[11px] shadow-sm"
                  title="Execute command in shell"
                >
                  <TerminalIcon className="w-3 h-3" />
                  <span>Shell ▶</span>
                </button>
              )}

              <button
                onClick={() => setActiveBlog(null)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all text-[11px] font-bold"
                title="Return to File Explorer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Return to Explorer</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="flex-1 p-2.5 sm:p-8 bg-[#0b0d13] overflow-y-auto overflow-x-hidden">
            <div 
              className="mx-auto max-w-4xl bg-[#161a24] border border-[#2e374c] rounded-2xl shadow-2xl p-4 sm:p-10 text-gray-200 transition-all duration-200"
              style={{ zoom: `${zoomLevel}%` }}
            >
              {/* Paper Header */}
              <div className="border-b border-[#2e374c] pb-6 mb-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    TECHNICAL DOCUMENTATION
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Published: {activeBlog.date}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-mono text-cyan-200 leading-snug">
                  {activeBlog.title}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 italic border-l-4 border-cyan-400/80 pl-3 py-1 bg-cyan-500/5 rounded-r">
                  {activeBlog.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Author: <strong className="text-gray-200">{activeBlog.author}</strong></span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-amber-300 font-semibold">{activeBlog.readTime} read</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeBlog.tags?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered Markdown */}
              <div className="text-gray-200 text-sm leading-relaxed">
                <div className="markdown-body">
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 mt-6 mb-3 border-b border-[#2e374c] pb-2 flex items-center gap-2">
                          <span className="text-cyan-500">#</span> {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg sm:text-xl font-bold font-mono text-cyan-400 mt-5 mb-2 flex items-center gap-2">
                          <span className="text-cyan-500/70">##</span> {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-bold font-mono text-amber-300 mt-4 mb-2">
                          ### {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <div className="mb-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                          {children}
                        </div>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 text-gray-300 marker:text-cyan-400">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-gray-300 marker:text-cyan-400 font-mono">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-cyan-400 bg-cyan-500/10 p-3 my-4 rounded-r-lg text-cyan-200 font-mono text-xs sm:text-sm italic">
                          {children}
                        </blockquote>
                      ),
                      pre: ({ children }) => (
                        <div className="bg-[#0b0d13] border border-[#2a3142] rounded-xl p-4 my-4 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-300 leading-relaxed shadow-inner">
                          <pre><code>{children}</code></pre>
                        </div>
                      ),
                      code: ({ inline, children }: any) => {
                        if (inline) {
                          return (
                            <code className="bg-black/70 text-amber-300 border border-amber-500/30 font-mono text-xs px-1.5 py-0.5 rounded">
                              {children}
                            </code>
                          );
                        }
                        return <code>{children}</code>;
                      },
                      hr: () => <hr className="border-[#2a3142] my-6" />
                    }}
                  >
                    {activeBlog.content || ''}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>

          {/* Reader Bottom Footer */}
          <div className="px-4 py-2 bg-[#0f121a] border-t border-[#2a354a] flex items-center justify-between text-[11px] font-mono text-gray-400 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Document Loaded
              </span>
              <span>•</span>
              <span>Encoding: UTF-8</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleShareArticle}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-gray-300"
              >
                <Share2 className="w-3 h-3 text-cyan-400" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Document'}</span>
              </button>
              <span>•</span>
              <button 
                onClick={() => setActiveBlog(null)}
                className="hover:text-cyan-300 transition-colors text-cyan-400 font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Explorer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Minimized File Explorer Dock Button */}
        <div 
          onClick={() => setActiveBlog(null)}
          className="fixed bottom-4 left-4 z-50 bg-[#1c202a] border border-[#2e3545] text-cyan-300 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 font-mono text-xs cursor-pointer hover:bg-[#283042] hover:border-cyan-400/50 transition-all select-none group animate-fadeIn"
          title="Click to minimize Document Reader & return to File Explorer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <Folder className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-gray-200 group-hover:text-cyan-300">File Explorer</span>
          <span className="text-[10px] bg-[#12151c] px-2 py-0.5 rounded text-gray-400 border border-[#2a3142]">Minimized ↙</span>
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
        className={`bg-[#1c202a] border border-[#2e3545] shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-gray-200 transition-all duration-300 select-none font-sans ${
          isMaximized 
            ? 'fixed inset-0 w-full h-full rounded-none border-0 z-50' 
            : 'w-full max-w-6xl h-[90vh] max-h-[850px] rounded-2xl'
        }`}
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
          <div className={`bg-[#171a23] border-r border-[#262c3b] flex flex-col flex-shrink-0 select-none transition-all duration-300 ${
            mobileSidebarOpen 
              ? 'absolute inset-y-0 left-0 z-40 w-64 shadow-2xl flex bg-[#171a23]' 
              : 'hidden md:flex w-56 sm:w-64'
          }`}>
            {/* Sidebar Header */}
            <div className="p-3.5 border-b border-[#262c3b] flex items-center justify-between text-gray-400">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-gray-200 tracking-wide uppercase font-mono">Files</span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)} 
                className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-gray-800/60 cursor-pointer"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-medium text-gray-300">
              {/* Top Quick Access Links */}
              <div className="space-y-0.5">
                <button
                  onClick={() => { setSidebarSection('home'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    sidebarSection === 'home'
                      ? 'bg-[#2a3142] text-white font-semibold shadow-sm'
                      : 'hover:bg-[#202533] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Home className={`w-4 h-4 ${sidebarSection === 'home' ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('recent'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    sidebarSection === 'recent'
                      ? 'bg-[#2a3142] text-white font-semibold shadow-sm'
                      : 'hover:bg-[#202533] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Recent</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('starred'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    sidebarSection === 'starred'
                      ? 'bg-[#2a3142] text-white font-semibold shadow-sm'
                      : 'hover:bg-[#202533] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Starred</span>
                </button>

                <button
                  onClick={() => { setSidebarSection('all'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    sidebarSection === 'all'
                      ? 'bg-[#2a3142] text-white font-semibold shadow-sm'
                      : 'hover:bg-[#202533] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Network</span>
                </button>

                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-500 hover:bg-[#202533] hover:text-gray-400 transition-colors cursor-not-allowed opacity-60"
                  title="Empty Trash"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                  <span>Trash</span>
                </button>
              </div>

              <div className="h-[1px] bg-[#262c3b] mx-2"></div>

              {/* Places / Folders Section */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-gray-500 tracking-wider uppercase font-mono mb-1">
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
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition-colors ${
                      sidebarSection === tag
                        ? 'bg-[#2a3142] text-cyan-300 font-semibold'
                        : 'hover:bg-[#202533] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className={`w-4 h-4 ${sidebarSection === tag ? 'text-cyan-400 fill-cyan-400/20' : 'text-cyan-500/70'}`} />
                      <span className="truncate max-w-[120px]">{tag === 'All' ? 'Documents' : tag}</span>
                    </div>
                    {tag !== 'All' && (
                      <span className="text-[10px] font-mono text-gray-500 px-1.5 py-0.2 bg-black/40 rounded-md">
                        {blogs.filter(b => b.tags?.includes(tag)).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="h-[1px] bg-[#262c3b] mx-2"></div>

              {/* System Drives / Volumes Section */}
              <div className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-gray-500 tracking-wider uppercase font-mono mb-1">
                  Volumes
                </div>

                <div className="flex items-center gap-2.5 px-3 py-1.5 text-gray-400 text-xs">
                  <HardDrive className="w-4 h-4 text-cyan-400/80" />
                  <span className="font-mono text-[11px] truncate">195 GB Volume (/blogs)</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-gray-500 text-xs">
                  <HardDrive className="w-4 h-4 text-gray-600" />
                  <span className="font-mono text-[11px] truncate">263 GB Volume (github)</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-gray-500 text-xs">
                  <HardDrive className="w-4 h-4 text-gray-600" />
                  <span className="font-mono text-[11px] truncate">210 GB Volume (sys)</span>
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="h-10 px-3.5 border-t border-[#262c3b] bg-[#141720] flex items-center justify-between text-[11px] font-mono text-gray-400 flex-shrink-0 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="font-semibold text-gray-300">Portfolio OS v2.34</span>
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/*          RIGHT MAIN CONTENT AREA (Thunar View)       */}
          {/* ==================================================== */}
          <div className="flex-1 bg-[#1e232f] flex flex-col overflow-hidden relative min-w-0">

            {/* Top Kali File Manager Toolbar */}
            <div className="p-2 sm:p-2.5 bg-[#181c26] border-b border-[#2a3142] flex items-center justify-between gap-2 flex-shrink-0 select-none">
              {/* Back / Forward Navigation & Breadcrumb Location Bar */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {/* Mobile Folders Sidebar Toggle Button */}
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg border border-[#2e374a] bg-[#222836] text-cyan-300 text-xs font-mono font-semibold flex-shrink-0"
                  title="Toggle Folders Sidebar"
                >
                  <Folder className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden xs:inline">Folders</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  <button 
                    disabled 
                    className="p-1.5 rounded-lg border border-[#2e374a] text-gray-600 cursor-not-allowed opacity-50"
                    title="Back"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled 
                    className="p-1.5 rounded-lg border border-[#2e374a] text-gray-600 cursor-not-allowed opacity-50"
                    title="Forward"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Path Pill Breadcrumb */}
                <div className="flex-1 min-w-0 bg-[#12151c] border border-[#2a3142] rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs font-mono text-gray-300 truncate">
                  <Home className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-500">/</span>
                  <span className="font-semibold text-gray-300 hidden sm:inline">Home</span>
                  <span className="text-gray-500 hidden sm:inline">/</span>
                  <span className="font-semibold text-cyan-400 truncate">{sidebarSection === 'home' ? 'blogs' : sidebarSection}</span>
                </div>
              </div>

              {/* Toolbar Controls: Sort, Search, View Toggle, Window Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                
                {/* SORT BY DROPDOWN METHOD SELECTOR */}
                <div className="flex items-center gap-1.5 bg-[#12151c] border border-[#2a3142] rounded-xl px-2.5 py-1 text-xs font-mono">
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="hidden lg:inline text-gray-400 text-[11px]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="date-desc" className="bg-[#181c26] text-gray-200">Date (Newest)</option>
                    <option value="date-asc" className="bg-[#181c26] text-gray-200">Date (Oldest)</option>
                    <option value="title-asc" className="bg-[#181c26] text-gray-200">Title (A - Z)</option>
                    <option value="readTime-asc" className="bg-[#181c26] text-gray-200">Read Time</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                    className="bg-[#12151c] border border-[#2a3142] rounded-xl pl-8 pr-6 py-1 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 w-28 lg:w-40 transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1.5 text-gray-500 hover:text-gray-300 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* View Mode Switcher (Grid vs List) */}
                <div className="flex items-center bg-[#12151c] border border-[#2a3142] rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#2a3142] text-cyan-300 font-bold' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[#2a3142] text-cyan-300 font-bold' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Kali Window Controls Dots */}
                <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-[#2a3142]">
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
            <div className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#141720] border-b border-[#262c3b] overflow-x-auto custom-scrollbar flex-shrink-0 text-xs select-none">
              <button
                onClick={() => { setSidebarSection('home'); setMobileSidebarOpen(false); }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  sidebarSection === 'home'
                    ? 'bg-[#2a3142] text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                    : 'text-gray-400 bg-[#1a1e29] border border-transparent'
                }`}
              >
                <Home className="w-3 h-3 text-cyan-400" />
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
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    sidebarSection === tag
                      ? 'bg-[#2a3142] text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                      : 'text-gray-400 bg-[#1a1e29] border border-transparent'
                  }`}
                >
                  <Folder className={`w-3 h-3 ${sidebarSection === tag ? 'text-cyan-400' : 'text-cyan-500/70'}`} />
                  <span>{tag === 'All' ? 'Documents' : tag}</span>
                </button>
              ))}
            </div>

            {/* Main Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
              {loading ? (
                <div className="py-28 text-center font-mono text-cyan-400 space-y-3 animate-pulse">
                  <FileCode className="w-10 h-10 mx-auto text-cyan-400" />
                  <p className="text-xs text-gray-400">[THUNAR] Reading /blogs directory files...</p>
                </div>
              ) : sortedBlogs.length === 0 ? (
                /* Empty state */
                <div className="py-20 text-center font-mono text-gray-400 border border-dashed border-[#2a3142] rounded-2xl p-8 space-y-3">
                  <p className="text-sm">No files found matching criteria</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedTag('All'); setSidebarSection('home'); }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs hover:bg-cyan-500 hover:text-black font-semibold transition-all"
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
                      className="group flex flex-col items-center text-center cursor-pointer p-3 rounded-2xl hover:bg-[#283042]/80 border border-transparent hover:border-cyan-400/50 transition-all duration-200 select-none"
                    >
                      {/* Cyan/Blue Folder/File Tile */}
                      <div className="relative mb-2 w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-b from-[#38bdf8] to-[#0284c7] rounded-2xl shadow-[0_4px_16px_rgba(14,165,233,0.3)] group-hover:shadow-[0_6px_24px_rgba(56,189,248,0.6)] group-hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden border border-cyan-300/40">
                          <div className="bg-black/25 w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute top-1 right-1 px-1 py-0.2 bg-black/40 rounded text-[9px] font-mono text-cyan-200 font-bold">
                            .md
                          </div>
                        </div>
                      </div>

                      {/* File Name Label Underneath */}
                      <span className="text-xs font-mono font-semibold text-gray-200 group-hover:text-cyan-300 truncate max-w-[120px] transition-colors">
                        {blog.filename}
                      </span>
                      
                      <span className="text-[10px] font-mono text-gray-400 line-clamp-1 max-w-[130px] mt-0.5">
                        {blog.title}
                      </span>

                      <div className="text-[9px] font-mono text-cyan-400/90 mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="bg-[#141720] border border-[#2a3142] rounded-2xl overflow-hidden shadow-lg font-mono text-xs">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#0f121a] border-b border-[#2a3142] text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                    <div className="col-span-5 sm:col-span-4">Name</div>
                    <div className="col-span-3 sm:col-span-4 truncate">Title</div>
                    <div className="col-span-2 hidden sm:block">Date</div>
                    <div className="col-span-4 sm:col-span-2 text-right">Size / Time</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#202636]">
                    {sortedBlogs.map((blog) => (
                      <div
                        key={blog.id}
                        onClick={() => setActiveBlog(blog)}
                        onMouseEnter={() => setHoveredBlog(blog)}
                        onMouseLeave={() => setHoveredBlog(null)}
                        className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-[#232a3a] cursor-pointer transition-colors text-gray-300 hover:text-cyan-300 group"
                      >
                        <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 flex-shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-bold truncate text-gray-200 group-hover:text-cyan-300">
                            {blog.filename}
                          </span>
                        </div>

                        <div className="col-span-3 sm:col-span-4 truncate text-gray-400 group-hover:text-gray-200">
                          {blog.title}
                        </div>

                        <div className="col-span-2 hidden sm:block text-gray-500 text-[11px]">
                          {blog.date}
                        </div>

                        <div className="col-span-4 sm:col-span-2 text-right text-cyan-400/90 font-semibold text-[11px]">
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
              <div className="absolute bottom-12 right-4 z-40 bg-[#121520]/95 backdrop-blur-md border border-cyan-400/60 rounded-md px-3.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] font-mono text-xs text-gray-200 animate-fadeIn pointer-events-none flex items-center gap-2.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-cyan-300 font-bold truncate max-w-[200px]">{hoveredBlog.filename}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-300">{hoveredBlog.date}</span>
                <span className="text-gray-600">•</span>
                <span className="text-amber-300 font-semibold">{((hoveredBlog.content?.length || 500) / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {/* Bottom Thunar Statusbar */}
            <div className="h-10 px-3.5 bg-[#141720] border-t border-[#2a3142] flex items-center justify-between text-xs font-mono text-gray-400 flex-shrink-0 select-none">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{sortedBlogs.length} items</span>
                <span>•</span>
                <span>Free space: 142.8 GB</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-gray-500 text-[11px]">
                <span>Type <code className="text-amber-300 font-bold">blogs</code> in terminal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


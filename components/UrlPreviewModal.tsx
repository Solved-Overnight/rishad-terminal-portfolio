import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  MessageSquare, 
  Send, 
  Code,
  Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface UrlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrlPreviewModal: React.FC<UrlPreviewModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'social' | 'chat' | 'meta'>('social');
  const [copiedUrl, setCopiedUrl] = useState<'primary' | 'netlify' | 'meta' | null>(null);

  const primaryUrl = "https://mzrishad.is-a.dev/";
  const netlifyUrl = "https://mzrishad.netlify.app/";
  const previewImage = "/img/url-preview-img.png";
  const title = "M. Rishad | AI & ML Engineer";
  const description = "Official interactive terminal portfolio of Moniruzzaman Rishad, an AI & ML Engineer. Explore machine learning systems, computer vision models, LLM agents, and projects.";

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (url: string, type: 'primary' | 'netlify' | 'meta') => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: primaryUrl,
        });
      } catch {
        // Fallback or user canceled
      }
    } else {
      handleCopy(primaryUrl, 'primary');
    }
  };

  const metaTagsCode = `<!-- Open Graph / WhatsApp / Discord / LinkedIn / Slack -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${primaryUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${primaryUrl}img/url-preview-img.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${primaryUrl}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${primaryUrl}img/url-preview-img.png" />`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-terminal-dim/95 border border-terminal-primary/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: `0 0 35px ${currentTheme.colors.primary}25, 0 20px 40px rgba(0,0,0,0.6)`
        }}
      >
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-terminal-surface border-b border-terminal-surface-border flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            <span className="font-mono text-xs font-bold text-terminal-primary ml-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>URL Previewer & Social Share Card</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-terminal-text-dim hover:text-terminal-text hover:bg-terminal-dim/50 transition-colors"
            title="Close Previewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-3 pb-2 bg-terminal-dim/50 border-b border-terminal-dim/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'social'
                  ? 'bg-terminal-primary text-terminal-black shadow-md'
                  : 'text-terminal-text-dim hover:text-terminal-text hover:bg-terminal-dim/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Social Card (X / LinkedIn)</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-terminal-primary text-terminal-black shadow-md'
                  : 'text-terminal-text-dim hover:text-terminal-text hover:bg-terminal-dim/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat Apps (WhatsApp / iMessage)</span>
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'meta'
                  ? 'bg-terminal-primary text-terminal-black shadow-md'
                  : 'text-terminal-text-dim hover:text-terminal-text hover:bg-terminal-dim/60'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Meta Tags</span>
            </button>
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="px-2.5 py-1 text-xs font-mono font-bold text-terminal-accent bg-terminal-accent/10 hover:bg-terminal-accent/20 border border-terminal-accent/30 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap"
              title="Share via device menu"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* TAB 1: SOCIAL CARD PREVIEW (Twitter / LinkedIn / Discord style) */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-terminal-text-dim">
                <span>PREVIEW: When sharing link on X / Twitter, LinkedIn, Discord, or Slack</span>
                <span className="text-[11px] text-terminal-green">1200 × 630 (1.91:1)</span>
              </div>

              {/* The Social Preview Card Container */}
              <div className="rounded-xl border border-terminal-dim bg-[#0e1117] overflow-hidden shadow-xl transition-all duration-300 hover:border-terminal-primary/50">
                {/* Preview Image with Fallback */}
                <div className="relative w-full aspect-[1.91/1] bg-black/80 overflow-hidden border-b border-terminal-dim/50 group">
                  <img 
                    src={previewImage} 
                    alt="M. Rishad Portfolio URL Preview" 
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if not loaded
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-terminal-primary border border-terminal-primary/40 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>url-preview-img.png</span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-4 space-y-1.5 bg-[#12151c]">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-text-dim flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-terminal-primary" />
                    <span>mzrishad.is-a.dev</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed font-sans">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAT APPS PREVIEW (WhatsApp / iMessage / Telegram style) */}
          {activeTab === 'chat' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-terminal-text-dim">
                PREVIEW: When sending the link in WhatsApp, Telegram, or iMessage
              </div>

              <div className="p-4 bg-[#0a1014] rounded-xl border border-terminal-dim/60 space-y-3">
                {/* Chat Bubble Simulation */}
                <div className="max-w-md ml-auto bg-[#005c4b]/80 border border-[#00a884]/40 rounded-2xl rounded-tr-sm p-2.5 shadow-lg text-white space-y-2">
                  <div className="text-xs text-[#53bdeb] break-all underline">
                    {primaryUrl}
                  </div>
                  <div className="rounded-xl overflow-hidden bg-[#022c24] border border-[#00a884]/30">
                    <img 
                      src={previewImage} 
                      alt="WhatsApp preview" 
                      className="w-full aspect-[1.91/1] object-cover"
                    />
                    <div className="p-2.5 bg-[#022c24]/90 space-y-1">
                      <div className="text-xs font-bold text-white leading-tight">
                        {title}
                      </div>
                      <div className="text-[11px] text-gray-300 line-clamp-2 leading-normal">
                        {description}
                      </div>
                      <div className="text-[9px] uppercase tracking-wide text-gray-400 font-mono pt-1">
                        mzrishad.is-a.dev
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/60 text-right font-mono">
                    10:00 AM • Read ✓✓
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: META TAGS INSPECTOR */}
          {activeTab === 'meta' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-terminal-text-dim">
                <span>INSPECT: Active Open Graph & Twitter Cards HTML Meta Tags</span>
                <button
                  onClick={() => handleCopy(metaTagsCode, 'meta')}
                  className="px-2.5 py-1 bg-terminal-dim hover:bg-terminal-primary hover:text-terminal-black border border-terminal-dim/70 rounded text-[11px] font-mono transition-all flex items-center gap-1"
                >
                  {copiedUrl === 'meta' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === 'meta' ? 'Copied Tags!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="bg-black/80 border border-terminal-primary/30 rounded-xl p-3 font-mono text-xs text-terminal-primary overflow-x-auto leading-relaxed shadow-inner">
                <pre><code>{metaTagsCode}</code></pre>
              </div>
            </div>
          )}

          {/* Quick Copy & Direct Share Bar */}
          <div className="pt-2 border-t border-terminal-dim/60 space-y-3">
            <div className="text-xs font-mono font-bold text-terminal-text-dim uppercase tracking-wider flex items-center gap-1.5">
              <span>Quick Copy & Share Links:</span>
            </div>

            {/* URL Copy Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2.5 bg-terminal-surface border border-terminal-surface-border rounded-xl">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] font-mono uppercase text-terminal-primary font-bold">Primary Domain</span>
                  <span className="text-xs font-mono text-terminal-text truncate">{primaryUrl}</span>
                </div>
                <button
                  onClick={() => handleCopy(primaryUrl, 'primary')}
                  className="p-2 rounded-lg bg-terminal-dim hover:bg-terminal-primary hover:text-terminal-black text-terminal-text transition-all flex-shrink-0"
                  title="Copy Primary URL"
                >
                  {copiedUrl === 'primary' ? <Check className="w-4 h-4 text-terminal-primary hover:text-terminal-black" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-terminal-surface border border-terminal-surface-border rounded-xl">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] font-mono uppercase text-terminal-secondary font-bold">Netlify Mirror</span>
                  <span className="text-xs font-mono text-terminal-text truncate">{netlifyUrl}</span>
                </div>
                <button
                  onClick={() => handleCopy(netlifyUrl, 'netlify')}
                  className="p-2 rounded-lg bg-terminal-dim hover:bg-terminal-secondary hover:text-terminal-black text-terminal-text transition-all flex-shrink-0"
                  title="Copy Netlify URL"
                >
                  {copiedUrl === 'netlify' ? <Check className="w-4 h-4 text-terminal-secondary hover:text-terminal-black" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Instant Social Share Buttons */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${primaryUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — ${description}`)}&url=${encodeURIComponent(primaryUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>Twitter / X</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(primaryUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span>LinkedIn</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(primaryUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-terminal-surface border-t border-terminal-surface-border flex items-center justify-between text-xs font-mono text-terminal-text-dim flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-terminal-primary animate-pulse"></span>
            <span>Meta Tags active on mzrishad.is-a.dev</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-terminal-dim hover:bg-terminal-primary hover:text-terminal-black text-terminal-text rounded-lg transition-colors font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrlPreviewModal;

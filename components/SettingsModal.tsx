import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES, ThemeId } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, updateCustomTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'themes' | 'about'>('themes');

  if (!isOpen) return null;

  const handleColorChange = (key: string, value: string) => {
    updateCustomTheme({ [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-terminal-black border border-terminal-dim rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-terminal-dim bg-terminal-dim/20">
          <h2 className="text-terminal-green font-bold text-lg font-mono flex items-center gap-2">
            <span className="text-xl">⚙</span> SETTINGS
          </h2>
          <button 
            onClick={onClose}
            className="text-terminal-text-dim hover:text-terminal-primary transition-colors text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-terminal-dim text-sm font-mono">
          <button 
            className={`flex-1 py-3 px-4 transition-colors ${activeTab === 'themes' ? 'bg-terminal-primary/10 text-terminal-primary border-b-2 border-terminal-primary' : 'text-terminal-text-dim hover:bg-terminal-dim/20'}`}
            onClick={() => setActiveTab('themes')}
          >
            Themes
          </button>
          <button 
            className={`flex-1 py-3 px-4 transition-colors ${activeTab === 'about' ? 'bg-terminal-primary/10 text-terminal-primary border-b-2 border-terminal-primary' : 'text-terminal-text-dim hover:bg-terminal-dim/20'}`}
            onClick={() => setActiveTab('about')}
          >
            System
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar font-mono text-sm">
          
          {activeTab === 'themes' && (
            <div className="space-y-6">
              
              {/* Preset Selector */}
              <div>
                <label className="block text-terminal-text-dim uppercase text-xs tracking-wider mb-3">Select Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(THEMES).filter(t => t.id !== 'custom').map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setTheme(theme.id as ThemeId)}
                      className={`p-3 rounded border text-left transition-all relative overflow-hidden group ${
                        currentTheme.id === theme.id 
                          ? 'border-terminal-primary ring-1 ring-terminal-primary bg-terminal-primary/5' 
                          : 'border-terminal-dim hover:border-terminal-text-dim bg-terminal-dim/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold ${currentTheme.id === theme.id ? 'text-terminal-primary' : 'text-terminal-text'}`}>
                          {theme.name}
                        </span>
                        {currentTheme.id === theme.id && <span className="text-terminal-primary text-xs">●</span>}
                      </div>
                      <div className="flex gap-1 h-2">
                        <div className="flex-1 rounded-sm" style={{ backgroundColor: theme.colors.bg }}></div>
                        <div className="flex-1 rounded-sm" style={{ backgroundColor: theme.colors.primary }}></div>
                        <div className="flex-1 rounded-sm" style={{ backgroundColor: theme.colors.secondary }}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer */}
              <div className="pt-4 border-t border-terminal-dim">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-terminal-text-dim uppercase text-xs tracking-wider">Custom Theme</label>
                  {currentTheme.id === 'custom' && <span className="text-terminal-primary text-xs border border-terminal-primary px-2 py-0.5 rounded">Active</span>}
                </div>
                
                <div className="bg-terminal-dim/10 p-4 rounded border border-terminal-dim space-y-3">
                   <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                      <span className="text-terminal-text">Background</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-terminal-text-dim font-mono uppercase">{currentTheme.colors.bg}</span>
                         <input type="color" value={currentTheme.colors.bg} onChange={(e) => handleColorChange('bg', e.target.value)} />
                      </div>
                   </div>
                   <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                      <span className="text-terminal-text">Primary Color</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-terminal-text-dim font-mono uppercase">{currentTheme.colors.primary}</span>
                         <input type="color" value={currentTheme.colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                      </div>
                   </div>
                   <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                      <span className="text-terminal-text">Text Color</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-terminal-text-dim font-mono uppercase">{currentTheme.colors.text}</span>
                         <input type="color" value={currentTheme.colors.text} onChange={(e) => handleColorChange('text', e.target.value)} />
                      </div>
                   </div>
                </div>
                
                <p className="text-xs text-terminal-text-dim mt-2">
                   * Editing these automatically switches you to "Custom" mode.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-terminal-text">
               <p>
                 Terminal Portfolio OS v2.5
               </p>
               <div className="p-3 bg-terminal-dim/20 rounded border border-terminal-dim text-xs space-y-2">
                  <div className="flex justify-between">
                     <span className="text-terminal-text-dim">React Version</span>
                     <span>19.2.3</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-terminal-text-dim">Tailwind</span>
                     <span>Enabled</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-terminal-text-dim">AI Model</span>
                     <span>Gemini 2.5 Flash</span>
                  </div>
               </div>
               <p className="text-xs text-terminal-text-dim leading-relaxed">
                  This interface is designed to provide a developer-centric experience. 
                  Themes are persisted locally on your device.
               </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-terminal-dim bg-terminal-dim/10 text-center">
          <button 
            onClick={onClose}
            className="text-terminal-primary hover:text-terminal-bg hover:bg-terminal-primary border border-terminal-primary px-6 py-2 rounded transition-all text-sm uppercase font-bold"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
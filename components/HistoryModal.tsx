
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-terminal-black border border-terminal-dim rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-terminal-dim bg-terminal-dim/20">
          <h2 className="text-terminal-green font-bold text-lg font-mono flex items-center gap-2">
            <span className="text-xl">📜</span> SESSION LOG
          </h2>
          <button 
            onClick={onClose}
            className="text-terminal-text-dim hover:text-terminal-primary transition-colors text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 font-mono text-sm space-y-4">
            {history.length === 0 ? (
                <div className="text-terminal-text-dim italic text-center py-4">No session history found.</div>
            ) : (
                history.slice().reverse().map((item, index) => (
                    <div key={index} className="border-b border-terminal-dim/30 last:border-0 pb-3">
                         <div className="flex gap-2 mb-1">
                            <span className="text-terminal-green select-none font-bold">$</span>
                            <span className="text-terminal-text break-all font-bold">{item.command}</span>
                            <span className="text-terminal-text-dim text-xs ml-auto self-center">
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                         </div>
                         <div className="pl-5 text-terminal-text-dim whitespace-pre-wrap break-words text-xs leading-relaxed opacity-80 border-l-2 border-terminal-dim/30 ml-1">
                            {item.output || <span className="italic opacity-50">No output recorded</span>}
                         </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-terminal-dim bg-terminal-dim/10 text-center flex gap-3">
           <button 
            onClick={() => { onClear(); onClose(); }}
            className="flex-1 text-red-500 hover:text-white hover:bg-red-600 border border-red-500/50 px-4 py-2 rounded transition-all text-sm uppercase font-bold"
           >
            Clear History
           </button>
           <button 
            onClick={onClose}
            className="flex-1 text-terminal-primary hover:text-white hover:bg-terminal-primary border border-terminal-primary px-4 py-2 rounded transition-all text-sm uppercase font-bold"
           >
            Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

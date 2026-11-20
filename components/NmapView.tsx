import React, { useState } from 'react';

interface NmapViewProps {
  onRunCommand?: (cmd: string) => void;
}

export const NmapView: React.FC<NmapViewProps> = ({ onRunCommand }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanTime, setScanTime] = useState('1.24');

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanTime((1.1 + Math.random() * 0.4).toFixed(2));
    }, 700);
  };

  const services = [
    {
      port: '22/tcp',
      state: 'open',
      service: 'ssh',
      version: 'OpenSSH 9.6p1 Debian-4 (protocol 2.0)',
      category: 'Secured Remote Access',
      cmd: 'whoami'
    },
    {
      port: '80/tcp',
      state: 'open',
      service: 'http',
      version: 'nginx 1.24.0 (Portfolio Web Gateway)',
      category: 'Interactive Web Terminal',
      cmd: 'neofetch'
    },
    {
      port: '6379/tcp',
      state: 'open',
      service: 'redis',
      version: 'Redis 7.2.4 (Vector Embedding Cache)',
      category: 'In-Memory Semantic Cache',
      cmd: 'skills'
    },
    {
      port: '8000/tcp',
      state: 'open',
      service: 'http-alt',
      version: 'FastAPI / PyTorch YOLOv8 Inference',
      category: 'Computer Vision Microservice',
      cmd: 'projects'
    },
    {
      port: '8501/tcp',
      state: 'open',
      service: 'http',
      version: 'Streamlit (AI Performance Dashboard)',
      category: 'Realtime Model Evaluation',
      cmd: 'experience'
    },
    {
      port: '11434/tcp',
      state: 'open',
      service: 'http',
      version: 'Ollama Gateway (Mistral-7B / Llama 3)',
      category: 'Local LLM Orchestration',
      cmd: 'blogs'
    }
  ];

  return (
    <div className="font-mono text-xs sm:text-[13px] my-3 max-w-4xl bg-black/90 p-3 sm:p-4 rounded-xl border border-cyan-500/40 shadow-2xl text-zinc-200 overflow-x-auto selection:bg-cyan-500/30">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
            Nmap 7.94SVN — Portfolio Microservices Reconnaissance
          </span>
        </div>
        <button
          onClick={handleRescan}
          disabled={isScanning}
          className="px-2.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>{isScanning ? '⚡ Scanning Ports...' : '↻ Rescan Localhost'}</span>
        </button>
      </div>

      <div className="space-y-1 text-zinc-400 text-xs">
        <div>Starting Nmap 7.94SVN ( https://nmap.org ) at {new Date().toLocaleTimeString()}</div>
        <div>Nmap scan report for <span className="text-cyan-300 font-bold">localhost (127.0.0.1)</span></div>
        <div>Host is up (0.000084s latency). Scanned 1000 ports.</div>
        <div className="text-zinc-500 text-[11px]">Not shown: 994 closed tcp ports (reset)</div>
      </div>

      {/* Ports Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-700 text-cyan-400">
              <th className="py-1 px-2">PORT</th>
              <th className="py-1 px-2">STATE</th>
              <th className="py-1 px-2">SERVICE</th>
              <th className="py-1 px-2">VERSION / PURPOSE</th>
              <th className="py-1 px-2 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, idx) => (
              <tr 
                key={idx}
                className="border-b border-zinc-800/80 hover:bg-cyan-950/20 transition-colors"
              >
                <td className="py-1.5 px-2 text-cyan-300 font-bold">{s.port}</td>
                <td className="py-1.5 px-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {s.state}
                  </span>
                </td>
                <td className="py-1.5 px-2 text-amber-300">{s.service}</td>
                <td className="py-1.5 px-2 text-zinc-300">
                  <span className="text-zinc-100">{s.version}</span>
                  <span className="text-zinc-500 text-[11px] ml-2 font-sans italic">({s.category})</span>
                </td>
                <td className="py-1.5 px-2 text-right">
                  {onRunCommand && (
                    <button
                      onClick={() => onRunCommand(s.cmd)}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 hover:bg-cyan-800 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Inspect ↗
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-0.5">
        <div>Service Info: OS: <span className="text-emerald-400">Linux 6.8.11-generic-amd64</span>; Device: general purpose</div>
        <div>Nmap done: 1 IP address (1 host up) scanned in <span className="text-cyan-300 font-bold">{scanTime} seconds</span></div>
      </div>
    </div>
  );
};

export default NmapView;

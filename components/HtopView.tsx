import React, { useState, useEffect } from 'react';

interface HtopProps {
  onClose: () => void;
}

interface ProcessItem {
  pid: number;
  user: string;
  pri: number;
  ni: number;
  virt: string;
  res: string;
  shr: string;
  state: string;
  cpu: number;
  mem: number;
  time: string;
  command: string;
}

export const HtopView: React.FC<HtopProps> = ({ onClose }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [selectedPid, setSelectedPid] = useState<number | null>(14210);
  const [cpuUsage, setCpuUsage] = useState([42.4, 68.1, 31.8, 89.2, 22.0, 54.3, 19.5, 77.6]);
  const [sortField, setSortField] = useState<'cpu' | 'mem'>('cpu');

  const handleClose = () => {
    setIsClosed(true);
    onClose();
  };

  useEffect(() => {
    if (isClosed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape' || e.key === 'F10' || (e.ctrlKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isClosed]);

  if (isClosed) {
    return (
      <div className="text-cyan-400/80 text-xs font-mono my-1.5 flex items-center gap-2">
        <span>✓</span>
        <span>[ htop monitoring session closed (return code 0) ]</span>
      </div>
    );
  }

  // Gentle fluctuation for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev =>
        prev.map(c => Math.max(5, Math.min(99, +(c + (Math.random() * 8 - 4)).toFixed(1))))
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const processes: ProcessItem[] = [
    {
      pid: 14210,
      user: 'rishad',
      pri: 20,
      ni: 0,
      virt: '14.8G',
      res: '9.2G',
      shr: '1.4G',
      state: 'R',
      cpu: 88.4,
      mem: 29.5,
      time: '42:15.82',
      command: 'python train_yolov8.py --weights yolov8x.pt --epochs 100 --device 0'
    },
    {
      pid: 18902,
      user: 'rishad',
      pri: 20,
      ni: 0,
      virt: '9.2G',
      res: '5.8G',
      shr: '820M',
      state: 'S',
      cpu: 48.2,
      mem: 18.6,
      time: '18:44.10',
      command: 'vllm.entrypoints.openai.api_server --model mistral-7b-instruct-v0.2'
    },
    {
      pid: 21045,
      user: 'rishad',
      pri: 20,
      ni: 0,
      virt: '4.1G',
      res: '2.1G',
      shr: '450M',
      state: 'S',
      cpu: 24.6,
      mem: 6.7,
      time: '08:12.35',
      command: 'python agent_orchestrator.py --runtime langgraph --workers 4'
    },
    {
      pid: 23411,
      user: 'rishad',
      pri: 20,
      ni: 0,
      virt: '1.8G',
      res: '820M',
      shr: '120M',
      state: 'S',
      cpu: 6.4,
      mem: 2.6,
      time: '04:55.20',
      command: 'chroma run --path ./vector_db --port 8000 --cors'
    },
    {
      pid: 25102,
      user: 'redis',
      pri: 20,
      ni: 0,
      virt: '980M',
      res: '340M',
      shr: '64M',
      state: 'S',
      cpu: 3.1,
      mem: 1.1,
      time: '02:30.12',
      command: 'redis-server 127.0.0.1:6379 (embeddings-cache)'
    },
    {
      pid: 27814,
      user: 'rishad',
      pri: 20,
      ni: 0,
      virt: '1.2G',
      res: '410M',
      shr: '90M',
      state: 'S',
      cpu: 2.5,
      mem: 1.3,
      time: '01:45.05',
      command: 'code-server --auth none --bind-addr 0.0.0.0:8080'
    },
    {
      pid: 29012,
      user: 'root',
      pri: 20,
      ni: 0,
      virt: '180M',
      res: '42M',
      shr: '12M',
      state: 'S',
      cpu: 0.8,
      mem: 0.2,
      time: '00:18.90',
      command: 'nginx: worker process (portfolio gateway)'
    }
  ];

  const sortedProcesses = [...processes].sort((a, b) => b[sortField] - a[sortField]);

  return (
    <div className="font-mono text-xs my-3 bg-[#0a0e14] border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl text-zinc-300 select-none">
      {/* htop Header Banner */}
      <div 
        onClick={onClose}
        className="flex items-center justify-between px-3 py-1.5 bg-[#0e1622] border-b border-cyan-500/30 text-xs font-bold cursor-pointer hover:bg-cyan-950/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400">HTOP 3.3.0 — LINUX SYSTEM PROCESS MONITOR</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-zinc-800 text-cyan-300 rounded border border-zinc-700">q</kbd> or <kbd className="px-1.5 py-0.5 bg-zinc-800 text-cyan-300 rounded border border-zinc-700">F10</kbd>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="px-2 py-0.5 rounded bg-red-950/70 hover:bg-red-800 text-red-200 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider"
          >
            [ Exit htop ✕ ]
          </button>
        </div>
      </div>

      {/* Gauges Section */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 border-b border-zinc-800 bg-[#070b10]">
        {/* Left Column: CPU 1-4 & Mem */}
        <div className="space-y-1">
          {cpuUsage.slice(0, 4).map((cpu, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px]">
              <span className="text-cyan-400 font-bold w-4">{idx + 1}</span>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 h-3.5 rounded overflow-hidden flex items-center relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                  style={{ width: `${cpu}%` }}
                />
                <span className="absolute right-1 text-[10px] font-bold text-zinc-200">
                  {cpu.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[11px] pt-1">
            <span className="text-emerald-400 font-bold w-8">Mem</span>
            <div className="flex-1 bg-zinc-900 border border-zinc-800 h-3.5 rounded overflow-hidden flex items-center relative">
              <div className="h-full bg-emerald-500" style={{ width: '56.4%' }} />
              <span className="absolute right-1 text-[10px] font-bold text-zinc-200">
                17.6G / 31.2G
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: CPU 5-8 & Swap */}
        <div className="space-y-1">
          {cpuUsage.slice(4, 8).map((cpu, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px]">
              <span className="text-cyan-400 font-bold w-4">{idx + 5}</span>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 h-3.5 rounded overflow-hidden flex items-center relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                  style={{ width: `${cpu}%` }}
                />
                <span className="absolute right-1 text-[10px] font-bold text-zinc-200">
                  {cpu.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[11px] pt-1">
            <span className="text-blue-400 font-bold w-8">Swp</span>
            <div className="flex-1 bg-zinc-900 border border-zinc-800 h-3.5 rounded overflow-hidden flex items-center relative">
              <div className="h-full bg-blue-500" style={{ width: '14.2%' }} />
              <span className="absolute right-1 text-[10px] font-bold text-zinc-200">
                1.14G / 8.00G
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Summary Bar */}
      <div className="px-3 py-1.5 bg-[#0a0f16] border-b border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-3">
          <span>Tasks: <b className="text-zinc-200">194</b>, 512 thr; <b className="text-emerald-400">2 running</b></span>
          <span>Load average: <b className="text-cyan-300">1.84 1.52 1.30</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Uptime: <b className="text-zinc-200">42 days, 14:18:02</b></span>
          <span className="text-zinc-600">|</span>
          <button 
            onClick={() => setSortField(sortField === 'cpu' ? 'mem' : 'cpu')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Sort by: %{sortField.toUpperCase()} ↕
          </button>
        </div>
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto max-h-60 overflow-y-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead className="bg-[#111927] text-cyan-300 sticky top-0 border-b border-zinc-800">
            <tr>
              <th className="py-1 px-2">PID</th>
              <th className="py-1 px-2">USER</th>
              <th className="py-1 px-1">PRI</th>
              <th className="py-1 px-1">NI</th>
              <th className="py-1 px-2">VIRT</th>
              <th className="py-1 px-2">RES</th>
              <th className="py-1 px-1">S</th>
              <th className="py-1 px-2 cursor-pointer hover:text-white" onClick={() => setSortField('cpu')}>CPU% ↕</th>
              <th className="py-1 px-2 cursor-pointer hover:text-white" onClick={() => setSortField('mem')}>MEM% ↕</th>
              <th className="py-1 px-2">TIME+</th>
              <th className="py-1 px-2">COMMAND</th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((p) => {
              const isSelected = selectedPid === p.pid;
              return (
                <tr 
                  key={p.pid}
                  onClick={() => setSelectedPid(p.pid)}
                  className={`border-b border-zinc-900/60 cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-950/60 text-white font-semibold' : 'hover:bg-zinc-900/50 text-zinc-300'
                  }`}
                >
                  <td className="py-1 px-2 text-cyan-400 font-mono">{p.pid}</td>
                  <td className="py-1 px-2 text-emerald-400">{p.user}</td>
                  <td className="py-1 px-1 text-zinc-500">{p.pri}</td>
                  <td className="py-1 px-1 text-zinc-500">{p.ni}</td>
                  <td className="py-1 px-2 text-zinc-400">{p.virt}</td>
                  <td className="py-1 px-2 text-zinc-400">{p.res}</td>
                  <td className="py-1 px-1 font-bold text-amber-400">{p.state}</td>
                  <td className="py-1 px-2 font-bold text-emerald-400">{p.cpu.toFixed(1)}</td>
                  <td className="py-1 px-2 text-cyan-300">{p.mem.toFixed(1)}</td>
                  <td className="py-1 px-2 text-zinc-400">{p.time}</td>
                  <td className="py-1 px-2 truncate max-w-xs text-zinc-200 font-mono">{p.command}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Function Keys Bar (F1-F10) */}
      <div className="grid grid-cols-5 sm:grid-cols-10 bg-black text-[10px] font-mono border-t border-zinc-800">
        {[
          { key: 'F1', label: 'Help' },
          { key: 'F2', label: 'Setup' },
          { key: 'F3', label: 'Search' },
          { key: 'F4', label: 'Filter' },
          { key: 'F5', label: 'Tree' },
          { key: 'F6', label: 'SortBy', action: () => setSortField(sortField === 'cpu' ? 'mem' : 'cpu') },
          { key: 'F7', label: 'Nice -' },
          { key: 'F8', label: 'Nice +' },
          { key: 'F9', label: 'Kill' },
          { key: 'F10', label: 'Quit', action: onClose, highlight: true },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={btn.action}
            className={`py-1 px-1 border-r border-zinc-800 flex items-center justify-center gap-1 hover:bg-zinc-800 transition-colors cursor-pointer ${
              btn.highlight ? 'bg-red-950/60 text-red-200' : 'text-zinc-300'
            }`}
          >
            <span className="text-cyan-400 font-bold">{btn.key}</span>
            <span className="truncate">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HtopView;

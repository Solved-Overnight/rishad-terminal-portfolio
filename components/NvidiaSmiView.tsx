import React, { useState } from 'react';

interface NvidiaSmiProps {
  onRunHtop?: () => void;
}

export const NvidiaSmiView: React.FC<NvidiaSmiProps> = ({ onRunHtop }) => {
  const [timestamp, setTimestamp] = useState(() => new Date().toUTCString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gpuUtil, setGpuUtil] = useState(91);
  const [memUsage, setMemUsage] = useState(18432);
  const [temp, setTemp] = useState(64);
  const [power, setPower] = useState(218);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTimestamp(new Date().toUTCString());
      setGpuUtil(Math.floor(82 + Math.random() * 16));
      setMemUsage(Math.floor(17800 + Math.random() * 1200));
      setTemp(Math.floor(62 + Math.random() * 6));
      setPower(Math.floor(205 + Math.random() * 40));
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="font-mono text-xs sm:text-[13px] my-3 max-w-4xl bg-black/90 p-3 sm:p-4 rounded-xl border border-emerald-500/30 shadow-2xl text-zinc-200 overflow-x-auto selection:bg-emerald-500/40">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
            NVIDIA System Management Interface (nvidia-smi)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <span>{isRefreshing ? '↻ Polling...' : '↻ Refresh'}</span>
          </button>
          {onRunHtop && (
            <button
              onClick={onRunHtop}
              className="px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-800 text-cyan-300 text-[11px] border border-cyan-500/40 transition-colors cursor-pointer"
            >
              htop ↗
            </button>
          )}
        </div>
      </div>

      <div className="text-zinc-400 text-[11px] mb-2">{timestamp}</div>

      {/* Driver and CUDA Bar */}
      <div className="text-zinc-300 whitespace-pre font-mono leading-none">
{`+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4090        Off |   00000000:01:00.0 Off |                  Off |
|  58%   ${temp}C    P2           ${power}W / 450W |   ${memUsage}MiB / 24576MiB |        ${gpuUtil}%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+`}
      </div>

      {/* Visual Memory Bar */}
      <div className="mt-3 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="flex justify-between items-center text-[11px] text-zinc-400 mb-1">
          <span className="flex items-center gap-1.5 font-bold text-zinc-300">
            <span>VRAM Allocation:</span>
            <span className="text-emerald-400">{(memUsage / 1024).toFixed(1)} GB / 24.0 GB</span>
          </span>
          <span className="text-cyan-400 font-bold">{((memUsage / 24576) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
            style={{ width: `${(memUsage / 24576) * 100}%` }}
          />
        </div>
      </div>

      {/* Processes Section */}
      <div className="mt-3 text-zinc-300 whitespace-pre font-mono leading-none">
{`+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A     14210      C   python train_yolov8.py                       8192MiB |
|    0   N/A  N/A     18902      C   vllm-serve-mistral-7b                        6144MiB |
|    0   N/A  N/A     21045      C   python -m torchserve.model_server            4096MiB |
+-----------------------------------------------------------------------------------------+`}
      </div>

      {/* Workload Badges */}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
          Tensor Core: Active (FP16/BF16)
        </span>
        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
          CUDA Streams: 16
        </span>
        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
          PyTorch 2.3 + vLLM
        </span>
      </div>
    </div>
  );
};

export default NvidiaSmiView;

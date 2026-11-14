import React from "react";
import { Cpu, CheckCircle2, ShieldCheck, Zap, HardDrive } from "lucide-react";

export const TaskManagerBenchmark: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20 select-none border-t border-white/[0.08]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          So light, you'll forget it's there.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed">
          Wisa is compiled natively for Windows using Rust and Tauri. No heavy Chromium engine
          idling in the background, no battery drain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Windows Task Manager Realistic Dark UI Mockup (5 cols) */}
        <div className="lg:col-span-6 bg-[#161619] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Task Manager Title Bar */}
          <div className="bg-[#1f1f24] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-cyan-500 rounded-sm flex items-center justify-center text-[9px] font-bold text-black">
                ≡
              </div>
              <span className="text-xs font-semibold text-white/90">Task Manager</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <span>Processes</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">1% Total CPU</span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase font-bold text-white/40 border-b border-white/[0.06] bg-[#121215]">
            <span className="col-span-5">Name</span>
            <span className="col-span-2 text-right">CPU</span>
            <span className="col-span-3 text-right">Memory</span>
            <span className="col-span-2 text-right">Disk</span>
          </div>

          {/* Process Rows */}
          <div className="divide-y divide-white/[0.04] text-xs font-mono">
            {/* Wisa - Highlighted */}
            <div className="grid grid-cols-12 px-4 py-2.5 items-center bg-cyan-500/10 border-l-2 border-cyan-400">
              <div className="col-span-5 flex items-center gap-2 min-w-0 font-sans">
                {/* Wisa Mascot Mini Icon */}
                <div className="w-4 h-4 rounded bg-black border border-white/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <span className="font-semibold text-white truncate">Wisa</span>
              </div>
              <span className="col-span-2 text-right text-emerald-400 font-bold">0.0%</span>
              <span className="col-span-3 text-right text-cyan-300 font-bold">19.4 MB</span>
              <span className="col-span-2 text-right text-white/50">0 MB/s</span>
            </div>

            {/* Other app 1 */}
            <div className="grid grid-cols-12 px-4 py-2.5 items-center text-white/60">
              <div className="col-span-5 flex items-center gap-2 min-w-0 font-sans">
                <div className="w-4 h-4 rounded bg-emerald-500/30 shrink-0" />
                <span className="truncate">Spotify</span>
              </div>
              <span className="col-span-2 text-right">0.8%</span>
              <span className="col-span-3 text-right">184.2 MB</span>
              <span className="col-span-2 text-right">0 MB/s</span>
            </div>

            {/* Other app 2 */}
            <div className="grid grid-cols-12 px-4 py-2.5 items-center text-white/60">
              <div className="col-span-5 flex items-center gap-2 min-w-0 font-sans">
                <div className="w-4 h-4 rounded bg-blue-500/30 shrink-0" />
                <span className="truncate">Google Chrome</span>
              </div>
              <span className="col-span-2 text-right">2.4%</span>
              <span className="col-span-3 text-right">742.0 MB</span>
              <span className="col-span-2 text-right">0.1 MB/s</span>
            </div>

            {/* Other app 3 */}
            <div className="grid grid-cols-12 px-4 py-2.5 items-center text-white/60">
              <div className="col-span-5 flex items-center gap-2 min-w-0 font-sans">
                <div className="w-4 h-4 rounded bg-purple-500/30 shrink-0" />
                <span className="truncate">Discord</span>
              </div>
              <span className="col-span-2 text-right">1.2%</span>
              <span className="col-span-3 text-right">312.8 MB</span>
              <span className="col-span-2 text-right">0 MB/s</span>
            </div>
          </div>

          <div className="p-3 bg-[#111114] border-t border-white/[0.06] text-center">
            <p className="text-[11px] text-white/50 font-sans">
              Windows Task Manager during everyday music playback & idle use
            </p>
          </div>
        </div>

        {/* Right: 3 Big Metrics & 4 Technical Highlights (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#18181b]/90 border border-white/10 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">
                ~30 MB
              </div>
              <div className="text-xs text-white/60 mt-1 font-medium">typical memory</div>
            </div>

            <div className="bg-[#18181b]/90 border border-white/10 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                0%
              </div>
              <div className="text-xs text-white/60 mt-1 font-medium">CPU when idle</div>
            </div>

            <div className="bg-[#18181b]/90 border border-white/10 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
                ~5 MB
              </div>
              <div className="text-xs text-white/60 mt-1 font-medium">installer size</div>
            </div>
          </div>

          {/* 4 Technical Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Native code</h4>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                  Compiled directly into machine binary with Rust and Tauri. Zero bloated Electron
                  runaways consuming background memory.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Draws only when something moves</h4>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                  GPU frames are only scheduled during active spring morphs. Stationary states consume
                  absolute zero GPU rendering cycles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Waits instead of checking</h4>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                  Subscribes passively to Windows SMTC media hooks and OS notification interrupts with
                  zero CPU-polling loops.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Files stay where they are</h4>
                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                  The File Shelf stages filesystem path references rather than copying entire disk
                  payloads into memory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


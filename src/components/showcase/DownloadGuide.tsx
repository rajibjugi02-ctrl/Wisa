import React from "react";
import {
  Download,
  ShieldCheck,
  CheckCircle,
  FolderDown,
  MonitorPlay,
  Sliders,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const DownloadGuide: React.FC = () => {
  return (
    <section
      id="download"
      className="w-full max-w-5xl mx-auto px-4 py-24 select-none border-t border-white/[0.08]"
    >
      {/* Center Mascot & Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
        {/* Glowing Wisa Mascot Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#25252c] to-[#121216] border border-white/20 p-2 shadow-2xl flex items-center justify-center relative overflow-hidden mb-5">
          <div className="relative w-14 h-12 flex items-center justify-center">
            {/* Left & Right Ears */}
            <div className="absolute -top-1 left-1.5 w-3 h-3 bg-indigo-500 rounded-tl-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <div className="absolute -top-1 right-1.5 w-3 h-3 bg-indigo-500 rounded-tr-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            {/* Head Capsule */}
            <div className="w-13 h-9 bg-black rounded-xl border border-white/20 shadow-inner flex items-center justify-center gap-3">
              <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse" />
              <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Get Wisa for Windows
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/60">
          Compatible with Windows 10 (version 1809 or later) or Windows 11, 64-bit.
        </p>
      </div>

      {/* 2 Download CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-16">
        {/* Installer (.EXE / .MSI) */}
        <a
          href="https://github.com/rajibjugi02-ctrl/Wisa/releases/latest/download/Wisa-Setup.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-b from-white to-neutral-200 text-black hover:brightness-105 active:scale-[0.98] transition-all p-6 rounded-2xl shadow-xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-black/10 px-2.5 py-0.5 rounded-full">
                Recommended
              </span>
              <Download className="w-5 h-5 text-black/60 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Download Installer</h3>
            <p className="text-xs text-black/70 mt-1">
              Wisa-Setup.exe (~5.2 MB)
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-black/10 text-xs font-semibold text-black/80 flex items-center justify-between">
            <span>Automated setup & desktop shortcut</span>
            <span>→</span>
          </div>
        </a>

        {/* Portable (.ZIP) */}
        <a
          href="https://github.com/rajibjugi02-ctrl/Wisa/releases/latest/download/Wisa-portable.zip"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1c1c20] hover:bg-[#24242a] text-white border border-white/10 hover:border-white/25 active:scale-[0.98] transition-all p-6 rounded-2xl shadow-xl flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                Standalone
              </span>
              <FolderDown className="w-5 h-5 text-white/60 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Download Portable</h3>
            <p className="text-xs text-white/60 mt-1">
              Wisa-portable-1.2.0.zip (~4.8 MB)
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-white/10 text-xs text-white/70 flex items-center justify-between">
            <span>No installation required • Run anywhere</span>
            <span>→</span>
          </div>
        </a>
      </div>

      {/* How to Install & Use (4-Step Numbered Cards) */}
      <div className="mb-14">
        <h3 className="text-center text-lg sm:text-xl font-bold text-white mb-8 tracking-tight">
          How to install & start using
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-[#18181b] border border-white/[0.08] rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <span className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center mb-3">
              1
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Download the file</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Grab <code className="text-cyan-400">WisaSetup.exe</code> or the portable ZIP above.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40">
              Verified 64-bit release
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#18181b] border border-white/[0.08] rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <span className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center mb-3">
              2
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Run the application</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                If Windows SmartScreen appears, click{" "}
                <span className="text-white font-medium">"More info"</span> then{" "}
                <span className="text-cyan-400 font-medium">"Run anyway"</span>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40">
              Zero admin rights needed
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#18181b] border border-white/[0.08] rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <span className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center mb-3">
              3
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Wisa appears on top</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                The notch pins seamlessly at the top center of your display without getting in the way.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40">
              Always on top & responsive
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#18181b] border border-white/[0.08] rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
            <span className="w-7 h-7 rounded-full bg-white/10 text-white font-bold text-xs flex items-center justify-center mb-3">
              4
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Hover to expand</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Move cursor over the notch to view music, focus timer, or click the Gear icon to setup
                prayer city and AI key.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40">
              Instant fluid controls
            </div>
          </div>
        </div>
      </div>

      {/* Why you can trust it */}
      <div className="bg-[#141417] border border-white/[0.06] rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Why you can trust it</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/65">
          <div className="space-y-1">
            <strong className="text-white block">No admin rights needed</strong>
            <span>Runs entirely in your standard user account space without system file modifications.</span>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Data stays on your PC</strong>
            <span>Settings, API keys, and notes are saved exclusively in your local storage.</span>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">Clean uninstall anytime</strong>
            <span>No lingering registry clutter or stubborn services left behind upon removal.</span>
          </div>
        </div>
      </div>
    </section>
  );
};


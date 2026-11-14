import React from "react";
import {
  Download,
  FolderArchive,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const DownloadGuide: React.FC = () => {
  return (
    <section
      id="download"
      className="w-full max-w-5xl mx-auto px-4 py-24 select-none border-t border-white/[0.08]"
    >
      {/* Center Mascot & Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
        {/* Glowing Wisa Mascot Avatar (Matching Nusa's squircle) */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-b from-[#2a2a34] via-[#1a1a22] to-[#0e0e12] border border-white/20 p-2 shadow-[0_0_50px_rgba(56,189,248,0.3)] flex items-center justify-center relative overflow-hidden mb-6">
          <div className="relative w-14 h-12 flex items-center justify-center">
            {/* Left & Right Ears */}
            <div className="absolute -top-1 left-1.5 w-3.5 h-3.5 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-tl-full shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
            <div className="absolute -top-1 right-1.5 w-3.5 h-3.5 bg-gradient-to-tl from-indigo-500 to-cyan-400 rounded-tr-full shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
            {/* Head Capsule */}
            <div className="w-13 h-9 bg-black/90 rounded-xl border border-white/20 shadow-inner flex items-center justify-center gap-3">
              <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8] animate-pulse" />
              <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8] animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Get Wisa for Windows
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/60">
          Windows 10 (version 1809 or later) or Windows 11, 64-bit.
        </p>
      </div>

      {/* 2 Primary Download Pills (Nusa 1:1 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 items-start">
        {/* Left: Direct EXE Installer */}
        <div className="flex flex-col items-center">
          <a
            href="https://github.com/rajibjugi02-ctrl/Wisa/releases/download/v1.2.0/Wisa-Setup.exe"
            className="w-full py-3.5 px-6 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:translate-y-0.5 transition-transform" />
            <span>Download Installer (.exe)</span>
          </a>
          <div className="mt-3 text-center">
            <p className="text-xs font-semibold text-white">
              Direct Installer • <span className="text-emerald-400 font-bold">Recommended</span>
            </p>
            <p className="text-[11px] text-white/50 mt-1 max-w-xs leading-normal">
              Official setup executable (~5.2 MB). Fast setup, desktop shortcut, no unzipping required.
            </p>
          </div>
        </div>

        {/* Right: Direct ZIP Download (Nusa style) */}
        <div className="flex flex-col items-center">
          <a
            href="https://github.com/rajibjugi02-ctrl/Wisa/releases/download/v1.2.0/Wisa-portable.zip"
            className="w-full py-3.5 px-6 rounded-full bg-[#16161b] text-white border border-white/20 hover:border-cyan-400/60 hover:bg-[#202028] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <FolderArchive className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Download ZIP</span>
          </a>
          <div className="mt-3 text-center">
            <p className="text-xs font-semibold text-white">
              Version 1.2.0 • <span className="text-cyan-400 font-bold">Classic portable</span>
            </p>
            <p className="text-[11px] text-white/50 mt-1 max-w-xs leading-normal">
              Portable package inside ZIP (~4.8 MB). Extract and run anywhere without installing.
            </p>
          </div>
        </div>
      </div>

      {/* Portable option link */}
      <div className="text-center mb-16">
        <a
          href="https://github.com/rajibjugi02-ctrl/Wisa/releases/download/v1.2.0/Wisa-portable.zip"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-cyan-400 transition-colors"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Need a standalone version? Download Portable ZIP (No install required)</span>
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
                Click <span className="text-cyan-400 font-medium">Download ZIP</span> or the direct installer above.
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
              <h4 className="text-sm font-bold text-white">Run WisaSetup</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Extract the ZIP and open <code className="text-cyan-400 font-medium">WisaSetup.exe</code>. If Windows SmartScreen appears, click{" "}
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
                The smart notch seamlessly docks at the top center of your display without getting in the way.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40">
              Always on top & fluid
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

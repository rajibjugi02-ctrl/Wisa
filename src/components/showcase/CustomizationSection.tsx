import React, { useState } from "react";
import { Sliders, Sparkles, Check, ChevronRight } from "lucide-react";

export const CustomizationSection: React.FC = () => {
  const [trayStartWindows, setTrayStartWindows] = useState(true);
  const [trayMascot, setTrayMascot] = useState(true);
  const [trayMinimal, setTrayMinimal] = useState(true);
  const [traySize, setTraySize] = useState<"Small" | "Medium" | "Large">("Medium");

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20 select-none border-t border-white/[0.08]">
      {/* 1. Make It Yours */}
      <div className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Make it yours.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed">
            Configure Wisa once through clean, intuitive toggles. Designed to adapt gracefully to
            your display and habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Quick Preferences Tray Popup Mockup */}
          <div className="md:col-span-5 bg-[#18181b] border border-white/15 rounded-2xl p-4 shadow-2xl space-y-4 max-w-sm mx-auto w-full">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                {/* Wisa Mascot head */}
                <div className="w-5 h-5 rounded-md bg-black border border-white/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
                <span className="text-xs font-bold text-white">Wisa Preferences</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">v1.2.0</span>
            </div>

            {/* Toggles */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Start with Windows</span>
                <button
                  type="button"
                  onClick={() => setTrayStartWindows(!trayStartWindows)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    trayStartWindows ? "bg-[#34C759]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                      trayStartWindows ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Wisa mascot</span>
                <button
                  type="button"
                  onClick={() => setTrayMascot(!trayMascot)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    trayMascot ? "bg-[#34C759]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                      trayMascot ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80">Minimalist notch</span>
                <button
                  type="button"
                  onClick={() => setTrayMinimal(!trayMinimal)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    trayMinimal ? "bg-[#34C759]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                      trayMinimal ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 font-medium">Notch size</span>
                  <span className="text-[10px] text-white/40">Top-center scale</span>
                </div>
                <div className="bg-[#121214] p-0.5 rounded-lg flex border border-white/[0.08]">
                  {(["Small", "Medium", "Large"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTraySize(s)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-all ${
                        traySize === s
                          ? "bg-[#3e3e44] text-white shadow"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-white/50 hover:text-white cursor-pointer">
                <span>About Wisa & Full Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Right: Explanations */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Instant Hover Mechanics
              </h3>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">
                Move your cursor to the top center of your screen to expand Wisa instantly without
                lag. Move away, and it tucks away smoothly with an 80ms intentional debounce.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Auto-Minimalist Mode
              </h3>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">
                When you focus on a full-screen browser or creative application, Wisa condenses into an
                ultra-compact pill showing only a time indicator, giving you complete screen clarity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                True Top-Center Scaling
              </h3>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">
                Whether you prefer Small (85%), Medium (100%), or Large (115%), the entire Notch
                scales proportionately from top-center without ever submerging or clipping the bottom
                dock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. New in Wisa 1.2 */}
      <div className="bg-gradient-to-b from-[#18181b] to-[#121215] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              New in Wisa 1.2
            </h3>
            <p className="text-xs text-white/50">Major update with real system integrations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {/* Column 1: New Features */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              New Capabilities
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Prayer times & Sun Arc:</strong> Official Indonesian
                  Kemenag calculation, 5 daily times, and fine-tune shift options.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Built-in AI Assistant:</strong> Real-time SSE streaming
                  from Google Gemini 2.5 Flash and OpenAI GPT-4o.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Synced Lyrics from LRCLIB:</strong> Live timestamps
                  with dynamic notch width that expands naturally with sung verses.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Interactive File Shelf:</strong> Staging dropzone at
                  the notch for fast drag-and-drop workflow.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Fixes & Polish */}
          <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
            <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Polish & Performance
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">60fps Micro-Interactions:</strong> Spring transitions
                  tuned with zero lag and instant hover responsiveness.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Seamless Notch Ears:</strong> 1px overlapping concave
                  SVGs that eliminate vertical slits against the body.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Native Windows Autostart:</strong> Integrated into
                  Windows Registry Run key without background daemons.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>
                  <strong className="text-white">Memory trimmed below 20 MB:</strong> Optimized
                  resource cleanup during static resting modes.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};


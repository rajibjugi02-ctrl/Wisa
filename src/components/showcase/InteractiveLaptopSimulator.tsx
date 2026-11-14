import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Clock,
  Sparkles,
  Timer,
  Bell,
  Moon,
  Inbox,
  CheckSquare,
  Zap,
  BatteryCharging,
  Copy,
  Check,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";

type SimulatorMode =
  | "resting"
  | "closed"
  | "music"
  | "lyrics"
  | "focus"
  | "notification"
  | "prayer"
  | "shelf"
  | "clipboard"
  | "todo"
  | "ai"
  | "charging";

interface StatePill {
  id: SimulatorMode;
  label: string;
  caption: string;
}

const STATE_PILLS: StatePill[] = [
  {
    id: "resting",
    label: "Resting",
    caption:
      "Resting mode: a friendly little mascot lives in the notch, quietly blinking and keeping you company.",
  },
  {
    id: "closed",
    label: "Closed",
    caption:
      "Closed mode: a compact pill displaying your live system clock and battery level with zero screen clutter.",
  },
  {
    id: "music",
    label: "Music",
    caption:
      "Music mode: real-time SMTC detection with bottom-up liquid glow extracted from your active album cover.",
  },
  {
    id: "lyrics",
    label: "Lyrics",
    caption:
      "Lyrics mode: the notch widens and highlights each line dynamically as it is sung via the LRCLIB API.",
  },
  {
    id: "focus",
    label: "Focus timer",
    caption:
      "Focus timer: circular Pomodoro with 25-minute focus intervals and gentle completion chimes.",
  },
  {
    id: "notification",
    label: "Notification",
    caption:
      "Smart Notifications: priority WhatsApp and message pop-downs that slide smoothly below the notch.",
  },
  {
    id: "prayer",
    label: "Prayer",
    caption:
      "Prayer times: precise 5-prayer schedule with golden sun arc trajectory and configurable reminders.",
  },
  {
    id: "shelf",
    label: "Shelf",
    caption:
      "File Shelf: instant drag-and-drop staging area for screenshots and assets right at the top of your screen.",
  },
  {
    id: "clipboard",
    label: "Clipboard",
    caption:
      "Clipboard history: quick access to your recent text and image clips with instant one-click copy.",
  },
  {
    id: "todo",
    label: "To-do",
    caption:
      "To-do: lightweight task checklist with built-in focus timers and start reminders.",
  },
  {
    id: "ai",
    label: "AI Assistant",
    caption:
      "AI Assistant: live streaming intelligence powered by Google Gemini and ChatGPT right from your notch.",
  },
  {
    id: "charging",
    label: "Charging",
    caption:
      "Charging HUD: dynamic battery status and charging wattage indication when plugging in.",
  },
];

export const InteractiveLaptopSimulator: React.FC = () => {
  const [activeMode, setActiveMode] = useState<SimulatorMode>("lyrics");
  const [isPlaying, setIsPlaying] = useState(true);
  const [todoDone, setTodoDone] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Auto-cycle through lyrics lines for preview
  const [lyricIndex, setLyricIndex] = useState(0);
  const sampleLyrics = [
    "Synced lyrics floating seamlessly right on your Windows desktop",
    "Live integration with Spotify, Apple Music, and LRCLIB",
    "Real-time audio waveform and fluid VisionOS glassmorphism",
    "Dynamic ambient glow reflecting album colors",
  ];

  useEffect(() => {
    if (activeMode !== "lyrics") return;
    const interval = setInterval(() => {
      setLyricIndex((prev) => (prev + 1) % sampleLyrics.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [activeMode, sampleLyrics.length]);

  const activePill = STATE_PILLS.find((p) => p.id === activeMode) || STATE_PILLS[0];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 1. Laptop Bezel Shell */}
      <div className="w-full max-w-4xl relative">
        {/* Top Edge / Screen Bezel */}
        <div className="relative bg-[#101014] rounded-t-2xl sm:rounded-t-3xl pt-2 sm:pt-3 px-2 sm:px-3 border-t border-x border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
          {/* Webcam dot */}
          <div className="w-full flex justify-center pb-1.5 sm:pb-2">
            <div className="w-2 h-2 rounded-full bg-black/90 ring-1 ring-white/10 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-blue-500/80 animate-pulse" />
            </div>
          </div>

          {/* Laptop Screen Glass */}
          <div
            className="relative w-full h-[360px] sm:h-[440px] md:h-[470px] rounded-t-lg sm:rounded-t-xl overflow-hidden bg-cover bg-center border border-black/40 flex flex-col items-center shadow-inner"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at top, #2b1d44 0%, #151624 50%, #0c0d15 100%)",
            }}
          >
            {/* Ambient Desktop Wallpaper Glow Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 backdrop-blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Desktop Mock Windows Taskbar at bottom */}
            <div className="absolute bottom-2 inset-x-4 h-9 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-between px-3 z-10 text-[11px] text-white/60">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-blue-500 rounded-sm shadow-sm" />
                <span className="text-white/80 font-medium">Search</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> 85%
                </span>
                <span>Sat 9:40 AM</span>
              </div>
            </div>

            {/* --- THE LIVE INTERACTIVE WISA NOTCH AT SCREEN TOP --- */}
            <div className="absolute top-0 inset-x-0 flex justify-center z-30">
              <AnimatePresence mode="wait">
                {/* 1. RESTING MASCOT MODE */}
                {activeMode === "resting" && (
                  <motion.div
                    key="sim-resting"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative bg-[#070709] border-x border-b border-white/15 rounded-b-[20px] px-6 py-2.5 flex items-center gap-3.5 shadow-2xl cursor-pointer"
                  >
                    <div className="relative w-8 h-6 flex items-center justify-center">
                      <div className="w-7 h-5 bg-black/80 border border-white/20 rounded-md flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ scaleY: [1, 1, 0.1, 1] }}
                          transition={{ repeat: Infinity, duration: 3.2, times: [0, 0.8, 0.85, 1] }}
                          className="w-1.5 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_#38bdf8]"
                        />
                        <motion.span
                          animate={{ scaleY: [1, 1, 0.1, 1] }}
                          transition={{ repeat: Infinity, duration: 3.2, times: [0, 0.8, 0.85, 1] }}
                          className="w-1.5 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_#38bdf8]"
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-white/90">Wisa is listening</span>
                  </motion.div>
                )}

                {/* 2. CLOSED MINIMAL PILL */}
                {activeMode === "closed" && (
                  <motion.div
                    key="sim-closed"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative bg-[#070709] border-x border-b border-white/15 rounded-b-[18px] px-5 py-2 flex items-center gap-4 shadow-xl"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white/90">
                      <Clock className="w-3.5 h-3.5 text-white/50" />
                      <span>09:40 AM</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>85%</span>
                    </div>
                  </motion.div>
                )}

                {/* 3. MUSIC MODE */}
                {activeMode === "music" && (
                  <motion.div
                    key="sim-music"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[480px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 via-orange-500/10 to-transparent pointer-events-none" />
                    <div className="flex items-center justify-between text-xs text-white/60 mb-3 relative z-10">
                      <span className="font-bold text-white">Live Media Session</span>
                      <span className="font-mono text-[11px] text-white/80">02:15 / 03:45</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">Windows Media SMTC</h4>
                        <p className="text-xs text-white/60 truncate">Spotify & System Audio Sync</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setLyricIndex((prev) => (prev + 1) % sampleLyrics.length)}
                          className="p-1.5 text-white/70 hover:text-white transition-transform active:scale-90"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. LYRICS MODE */}
                {activeMode === "lyrics" && (
                  <motion.div
                    key="sim-lyrics"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative bg-[#070709] border-x border-b border-white/15 rounded-b-[20px] px-6 py-2.5 flex items-center gap-3 shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-transparent pointer-events-none" />
                    <Music className="w-4 h-4 text-rose-400 shrink-0 relative z-10 animate-bounce" />
                    <motion.span
                      key={lyricIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-white tracking-tight whitespace-nowrap relative z-10"
                    >
                      {sampleLyrics[lyricIndex]}
                    </motion.span>
                  </motion.div>
                )}

                {/* 5. FOCUS TIMER MODE */}
                {activeMode === "focus" && (
                  <motion.div
                    key="sim-focus"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[440px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-4 shadow-2xl flex items-center gap-6"
                  >
                    <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                      <div className="w-16 h-16 rounded-full border-4 border-amber-400/80 flex flex-col items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                        <span className="text-sm font-bold font-mono text-white">25:00</span>
                        <span className="text-[9px] uppercase tracking-wider text-amber-300">Focus</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                        Pomodoro Session
                      </span>
                      <h4 className="text-sm font-semibold text-white">Deep Work Block</h4>
                      <p className="text-xs text-white/60 mt-0.5">Stay focused. Chime rings in 25 min.</p>
                    </div>
                  </motion.div>
                )}

                {/* 6. NOTIFICATION MODE */}
                {activeMode === "notification" && (
                  <motion.div
                    key="sim-notification"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[380px] max-w-[90%] bg-[#121216] border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3 mt-1.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow">
                      <Bell className="w-4 h-4 fill-current" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">Windows System</span>
                        <span className="text-[10px] text-white/40">Just now</span>
                      </div>
                      <p className="text-xs text-white/80 truncate mt-0.5">
                        Calendar: Design team sync starts in 10 minutes
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 7. PRAYER MODE */}
                {activeMode === "prayer" && (
                  <motion.div
                    key="sim-prayer"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[480px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-4 shadow-2xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                        Next Prayer
                      </span>
                      <h4 className="text-base font-bold text-white">Ashar</h4>
                      <p className="text-xs text-teal-400 font-medium">14:56 • in 2 h 42 min</p>
                      <p className="text-[11px] text-white/40">Jakarta (Kemenag RI)</p>
                    </div>
                    <div className="relative w-36 h-14 flex items-center justify-center">
                      <svg className="w-32 h-10 overflow-visible" viewBox="0 0 100 40">
                        <path
                          d="M 5 35 Q 50 -10 95 35"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                        <circle cx="50" cy="8" r="5" fill="#f59e0b" className="shadow-lg" />
                      </svg>
                      <span className="absolute bottom-0 text-[10px] text-white/50 font-mono">
                        Sun Arc
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 8. SHELF MODE */}
                {activeMode === "shelf" && (
                  <motion.div
                    key="sim-shelf"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[460px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-3.5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                      <span className="font-semibold text-white">File Shelf (3 items)</span>
                      <span className="text-[11px] text-amber-400">Drag & drop ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {["ProjectBrief.pdf", "wisa-tokens.json", "AppIcon.ico"].map((file, i) => (
                        <div
                          key={file}
                          className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <Inbox className="w-5 h-5 text-amber-400 mb-1" />
                          <span className="text-[10px] font-medium text-white truncate w-full px-1">
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 9. CLIPBOARD MODE */}
                {activeMode === "clipboard" && (
                  <motion.div
                    key="sim-clipboard"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[460px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-3.5 shadow-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                      <span className="font-semibold text-white">Recent Clips</span>
                      <span className="text-[11px] text-white/40">Click to copy</span>
                    </div>
                    {[
                      "https://github.com/rajibjugi02-ctrl/Wisa",
                      "npm run build -- --target x86_64",
                    ].map((clip, idx) => (
                      <button
                        key={clip}
                        type="button"
                        onClick={() => {
                          setCopiedIndex(idx);
                          setTimeout(() => setCopiedIndex(null), 1200);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-left transition-colors"
                      >
                        <span className="truncate pr-2 text-white/80">{clip}</span>
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* 10. TODO MODE */}
                {activeMode === "todo" && (
                  <motion.div
                    key="sim-todo"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[440px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-3.5 shadow-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="font-semibold text-white">Today's Focus</span>
                      <span className="text-[11px] text-emerald-400">1 of 2 done</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTodoDone(!todoDone)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-left transition-colors"
                    >
                      <CheckSquare
                        className={`w-4 h-4 shrink-0 ${
                          todoDone ? "text-emerald-400" : "text-white/40"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          todoDone ? "line-through text-white/40" : "text-white font-medium"
                        }`}
                      >
                        Review Wisa notch pull request
                      </span>
                    </button>
                  </motion.div>
                )}

                {/* 11. AI ASSISTANT MODE */}
                {activeMode === "ai" && (
                  <motion.div
                    key="sim-ai"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative w-[480px] max-w-[92%] bg-[#070709] border-x border-b border-white/15 rounded-b-[24px] p-3.5 shadow-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Wisa AI (Gemini Flash)
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono">Live Stream</span>
                    </div>
                    <div className="bg-white/[0.05] border border-white/10 rounded-xl p-2.5 text-xs text-white/90 leading-relaxed font-sans">
                      Quantum computing uses quantum bits that can exist in multiple states
                      simultaneously, enabling exponential computing power for complex problems.
                    </div>
                  </motion.div>
                )}

                {/* 12. CHARGING MODE */}
                {activeMode === "charging" && (
                  <motion.div
                    key="sim-charging"
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="relative bg-[#070709] border-x border-b border-white/15 rounded-b-[20px] px-6 py-2.5 flex items-center gap-3 shadow-2xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <BatteryCharging className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-white">85%</span>
                      <span className="text-xs text-emerald-400 font-medium">Fast Charging • 65W</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Laptop Bottom Chin / Base */}
        <div className="w-full h-3.5 bg-gradient-to-b from-[#1b1b22] to-[#0c0c10] rounded-b-xl border-t border-white/10 shadow-xl flex justify-center items-center">
          <div className="w-20 h-1 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* 2. Interactive State Switcher Pills */}
      <div className="w-full max-w-4xl mt-7">
        <div className="flex items-center justify-center flex-wrap gap-2 px-2">
          {STATE_PILLS.map((pill) => {
            const isActive = activeMode === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveMode(pill.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-lg scale-105 font-semibold"
                    : "bg-white/[0.08] text-white/70 hover:bg-white/15 hover:text-white border border-white/[0.06]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Caption below pills */}
        <div className="text-center mt-4 min-h-[32px] px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeMode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm text-white/75 font-medium max-w-xl mx-auto"
            >
              {activePill.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


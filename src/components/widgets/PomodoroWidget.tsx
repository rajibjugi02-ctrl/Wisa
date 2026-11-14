import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Timer,
  Clock,
  Hourglass,
} from "lucide-react";

export type TimerMode = "timer" | "pomodoro" | "stopwatch";

export const PomodoroWidget: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>("timer");
  const [durationSec, setDurationSec] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "stopwatch") {
          return prev + 1;
        }

        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleModeSwitch = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "pomodoro") {
      setDurationSec(25 * 60);
      setSeconds(25 * 60);
    } else if (newMode === "timer") {
      setDurationSec(15 * 60);
      setSeconds(15 * 60);
    } else {
      setDurationSec(0);
      setSeconds(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === "stopwatch") {
      setSeconds(0);
    } else {
      setSeconds(durationSec);
    }
  };

  const adjustMinutes = (delta: number) => {
    if (isRunning || mode === "stopwatch") return;
    const currentMins = Math.floor(seconds / 60);
    const currentSecs = seconds % 60;
    const newMins = Math.max(1, Math.min(180, currentMins + delta));
    const total = newMins * 60 + currentSecs;
    setDurationSec(total);
    setSeconds(total);
  };

  const adjustSeconds = (delta: number) => {
    if (isRunning || mode === "stopwatch") return;
    const currentMins = Math.floor(seconds / 60);
    const currentSecs = seconds % 60;
    const newSecs = (currentSecs + delta + 60) % 60;
    const total = currentMins * 60 + newSecs;
    setDurationSec(Math.max(1, total));
    setSeconds(Math.max(1, total));
  };

  const applyPresetMinutes = (mins: number) => {
    setIsRunning(false);
    const total = mins * 60;
    setDurationSec(total);
    setSeconds(total);
  };

  const addExtraMinutes = (mins: number) => {
    if (mode === "stopwatch") return;
    setSeconds((prev) => prev + mins * 60);
    setDurationSec((prev) => prev + mins * 60);
  };

  const displayMins = Math.floor(seconds / 60);
  const displaySecs = seconds % 60;
  const timeFormatted = `${displayMins.toString().padStart(2, "0")}:${displaySecs
    .toString()
    .padStart(2, "0")}`;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progressRatio =
    mode === "stopwatch"
      ? 1
      : durationSec > 0
      ? Math.max(0, Math.min(1, seconds / durationSec))
      : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="flex h-full w-full select-none text-white items-center gap-2.5 px-1 py-0.5">
      {/* Left Column: Visual Circular Ring & Action Controls */}
      <div className="flex flex-col items-center justify-between h-full w-[40%] shrink-0">
        <div className="relative h-24 w-24 flex items-center justify-center my-auto">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
            <circle
              cx="44"
              cy="44"
              r={radius}
              className="text-white/10"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx="44"
              cy="44"
              r={radius}
              className={
                seconds === 0 && durationSec > 0
                  ? "text-red-400 transition-all duration-300"
                  : "text-amber-400 transition-all duration-300"
              }
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono tracking-tight text-white">
              {timeFormatted}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-white/50 font-medium">
              {mode === "stopwatch"
                ? "Running"
                : isRunning
                ? "Active"
                : seconds === 0
                ? "Done"
                : "Paused"}
            </span>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-center gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all active:scale-90"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-full transition-all active:scale-90 ${
              soundEnabled
                ? "text-white/70 hover:text-white bg-white/10"
                : "text-white/30 hover:text-white bg-white/5"
            }`}
            title={soundEnabled ? "Mute alarm" : "Unmute alarm"}
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="w-[1px] h-full bg-white/10 shrink-0" />

      {/* Right Column: Mode Switcher, Time Stepper & Presets */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full pl-2 overflow-hidden">
        {/* Mode Selector - Guaranteed 3-Column Equal Grid */}
        <div className="grid grid-cols-3 gap-0.5 bg-white/10 p-0.5 rounded-xl border border-white/10 w-full shrink-0">
          <button
            type="button"
            onClick={() => handleModeSwitch("timer")}
            className={`py-1 px-1 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all truncate ${
              mode === "timer"
                ? "bg-white/25 text-white font-semibold shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Timer className="h-3 w-3 shrink-0" />
            <span className="truncate">Timer</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("pomodoro")}
            className={`py-1 px-1 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all truncate ${
              mode === "pomodoro"
                ? "bg-white/25 text-white font-semibold shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Hourglass className="h-3 w-3 shrink-0" />
            <span className="truncate">Pomodoro</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("stopwatch")}
            className={`py-1 px-1 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 transition-all truncate ${
              mode === "stopwatch"
                ? "bg-white/25 text-white font-semibold shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">Stopwatch</span>
          </button>
        </div>

        {mode !== "stopwatch" ? (
          <>
            {/* Custom Time Stepper */}
            <div className="flex items-center justify-center gap-1.5 my-auto">
              <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => adjustMinutes(-1)}
                  disabled={isRunning}
                  className="p-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="w-8 text-center">
                  <span className="text-xs font-mono font-bold text-white">
                    {displayMins.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8px] text-white/40 block -mt-0.5">min</span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustMinutes(1)}
                  disabled={isRunning}
                  className="p-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <span className="text-white/40 font-mono text-xs">:</span>

              <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => adjustSeconds(-5)}
                  disabled={isRunning}
                  className="p-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="w-8 text-center">
                  <span className="text-xs font-mono font-bold text-white">
                    {displaySecs.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8px] text-white/40 block -mt-0.5">sec</span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustSeconds(5)}
                  disabled={isRunning}
                  className="p-1 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Quick Presets & Additions - Guaranteed 6-Column Grid */}
            <div className="grid grid-cols-6 gap-1 w-full pt-1 border-t border-white/10 shrink-0">
              {[5, 15, 25, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => applyPresetMinutes(m)}
                  className="py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-medium text-white/70 hover:text-white border border-white/5 transition-colors text-center"
                >
                  {m}m
                </button>
              ))}
              <button
                type="button"
                onClick={() => addExtraMinutes(1)}
                className="py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-medium border border-amber-500/30 transition-colors text-center"
              >
                +1m
              </button>
              <button
                type="button"
                onClick={() => addExtraMinutes(5)}
                className="py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-medium border border-amber-500/30 transition-colors text-center"
              >
                +5m
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center h-full space-y-1 text-xs text-white/60">
            <p className="text-xs font-medium text-white">Stopwatch Active</p>
            <p className="text-[10px] text-white/40">
              Measures elapsed time with sub-second accuracy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { Sun, Moon, MapPin } from "lucide-react";
import { NextPrayerInfo, PrayerTimesData, SunArcMetrics } from "../../types/prayer";

interface SunArcWidgetProps {
  city: string;
  times: PrayerTimesData;
  nextPrayer: NextPrayerInfo;
  sunArc: SunArcMetrics;
  isMeditationMode?: boolean;
}

export const SunArcWidget: React.FC<SunArcWidgetProps> = ({
  city,
  times,
  nextPrayer,
  sunArc,
  isMeditationMode = false,
}) => {
  const pathD = "M 15 50 Q 110 8 205 50";
  const { progressRatio, isDaytime } = sunArc;

  const t = Math.min(1, Math.max(0, progressRatio));
  const orbX = (1 - t) * (1 - t) * 15 + 2 * (1 - t) * t * 110 + t * t * 205;
  const orbY = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 8 + t * t * 50;

  const prayers = [
    { name: "Subuh", time: times.subuh },
    { name: "Dzuhur", time: times.dzuhur },
    { name: "Ashar", time: times.ashar },
    { name: "Maghrib", time: times.maghrib },
    { name: "Isya", time: times.isya },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 h-full w-full select-none text-white items-center py-0.5">
      {/* Left Column (5 of 12): Location Badge, Next Prayer & Countdown */}
      <div className="col-span-5 flex flex-col justify-between h-full pr-1">
        <div className="flex items-center gap-1.5 text-[11px] text-white/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 self-start">
          <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
          <span className="truncate max-w-[110px]">{city}</span>
        </div>

        <div className="my-auto">
          <span className="text-[10px] tracking-wider uppercase text-white/45 font-bold block">
            {isMeditationMode ? "MINDFUL SESSION" : "NEXT PRAYER"}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-xl font-extrabold tracking-tight text-white">
              {isMeditationMode ? "Focus" : nextPrayer.name}
            </h3>
            <span className="text-sm font-semibold text-blue-400 font-mono">
              {isMeditationMode ? "15:00" : nextPrayer.time}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">
            {nextPrayer.formattedCountdown}
          </p>

          <div className="w-full bg-white/10 rounded-full h-1 mt-2.5 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round(progressRatio * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Column (7 of 12): Horizon Sun Arc Graphic & 5-Time Schedule */}
      <div className="col-span-7 flex flex-col justify-between h-full pl-2 border-l border-white/10">
        <div className="relative w-full h-16 flex items-center justify-center">
          <svg viewBox="0 0 220 58" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={`${pathD} L 205 54 L 15 54 Z`} fill="url(#areaFill)" />

            <line
              x1="10"
              y1="50"
              x2="210"
              y2="50"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            <path
              d={pathD}
              fill="none"
              stroke="url(#arcGlow)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Moving Sun / Moon Orb */}
            <g transform={`translate(${orbX}, ${orbY})`}>
              <circle
                r="6.5"
                fill={isDaytime ? "#fbbf24" : "#e0e7ff"}
                className="drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
              />
              <circle r="3" fill="#ffffff" />
            </g>
          </svg>

          <div className="absolute right-0 bottom-1 text-white/40">
            {isDaytime ? (
              <Sun className="h-3.5 w-3.5 text-amber-300 animate-spin-slow" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-indigo-300" />
            )}
          </div>
        </div>

        {/* 5-Time Daily Prayer Schedule Row */}
        <div className="grid grid-cols-5 gap-1 text-center pt-1 border-t border-white/10">
          {prayers.map((p) => {
            const isNext = p.name === nextPrayer.name;
            return (
              <div
                key={p.name}
                className={`py-0.5 rounded-lg transition-colors ${
                  isNext
                    ? "bg-blue-500/15 border border-blue-400/30"
                    : "bg-white/[0.02]"
                }`}
              >
                <span
                  className={`text-[9px] uppercase tracking-wider block ${
                    isNext ? "text-blue-300 font-bold" : "text-white/40"
                  }`}
                >
                  {p.name}
                </span>
                <span
                  className={`text-[10px] font-mono block font-medium ${
                    isNext ? "text-white font-bold" : "text-white/70"
                  }`}
                >
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const WeekCalendarWidget: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(6); // Sunday

  const days = [
    { label: "M", date: 26 },
    { label: "T", date: 27 },
    { label: "W", date: 28 },
    { label: "T", date: 29 },
    { label: "F", date: 30 },
    { label: "S", date: 31 },
    { label: "S", date: 1 },
  ];

  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          This Week
        </span>
        <button
          type="button"
          className="text-white/40 hover:text-white transition-colors"
          title="Next week"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 text-center my-auto">
        {days.map((item, idx) => {
          const isSelected = idx === activeDayIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDayIndex(idx)}
              className="flex flex-col items-center gap-1 group py-1"
            >
              <span className="text-[10px] text-white/40 group-hover:text-white/70">
                {item.label}
              </span>
              <span
                className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-sm font-semibold scale-105"
                    : "text-white/80 group-hover:bg-white/10"
                }`}
              >
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-white/5 text-[11px] text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
        <span className="truncate">All done today</span>
        <span className="text-white/30 text-[9px] ml-auto">Nothing timed later</span>
      </div>
    </div>
  );
};


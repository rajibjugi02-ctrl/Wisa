import React from "react";
import { BatteryCharging } from "lucide-react";

export const BatteryWidget: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          Power
        </span>
        <BatteryCharging className="h-3 w-3 text-emerald-400" />
      </div>

      <div className="flex items-center gap-3 my-auto">
        <div className="relative h-11 w-11 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-400"
              strokeDasharray="88, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-bold">88%</span>
        </div>

        <div>
          <span className="text-xs font-medium text-white block">Connected</span>
          <span className="text-[10px] text-emerald-400">Charging rapidly</span>
        </div>
      </div>

      <div className="text-[9px] text-white/40">
        Est. full charge in 22 min
      </div>
    </div>
  );
};


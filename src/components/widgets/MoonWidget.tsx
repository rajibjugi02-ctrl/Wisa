import React from "react";
import { Moon } from "lucide-react";

export const MoonWidget: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          Lunar Phase
        </span>
        <Moon className="h-3 w-3 text-indigo-300" />
      </div>

      <div className="flex items-center gap-3 my-auto">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500/30 to-purple-500/20 border border-white/20 flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white/80 rounded-r-full blur-[0.5px]" />
        </div>
        <div>
          <span className="text-xs font-semibold text-white block">Waxing Gibbous</span>
          <span className="text-[10px] text-white/50">72% Illumination</span>
        </div>
      </div>

      <div className="text-[9px] text-white/40">
        Next Full Moon in 4 days
      </div>
    </div>
  );
};


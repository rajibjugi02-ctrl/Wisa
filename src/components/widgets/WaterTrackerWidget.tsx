import React, { useState } from "react";
import { Droplet, Plus } from "lucide-react";

export const WaterTrackerWidget: React.FC = () => {
  const [currentMl, setCurrentMl] = useState(450);
  const targetMl = 2000;
  const percent = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const addWater = (amount: number) => {
    setCurrentMl((prev) => Math.min(prev + amount, 3500));
  };

  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          Hydration
        </span>
        <span className="text-[11px] text-cyan-400 font-medium">{percent}%</span>
      </div>

      <div className="flex items-center justify-between my-auto">
        <div>
          <div className="text-xl font-bold tracking-tight text-white flex items-baseline gap-1">
            {currentMl} <span className="text-xs font-normal text-white/50">ml</span>
          </div>
          <p className="text-[10px] text-white/40 mt-0.5">Target {targetMl} ml</p>
        </div>

        <button
          type="button"
          onClick={() => addWater(250)}
          className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
        >
          <Plus className="h-3 w-3" />
          <span>250 ml</span>
        </button>
      </div>

      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-cyan-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};


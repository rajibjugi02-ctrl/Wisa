import React from "react";
import { Sparkles } from "lucide-react";

interface CountdownWidgetProps {
  title?: string;
  daysRemaining?: number;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({
  title = "Eid al-Fitr",
  daysRemaining = 129,
}) => {
  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          Countdown
        </span>
        <Sparkles className="h-3 w-3 text-amber-300" />
      </div>

      <div className="flex items-baseline gap-2 my-auto">
        <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {daysRemaining}
        </span>
        <span className="text-xs font-medium text-white/60">days to go</span>
      </div>

      <div className="text-[11px] font-medium text-amber-200/90 truncate">
        {title}
      </div>
    </div>
  );
};


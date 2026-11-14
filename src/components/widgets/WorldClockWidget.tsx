import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";

interface WorldClockWidgetProps {
  city1?: string;
  city2?: string;
}

export const WorldClockWidget: React.FC<WorldClockWidgetProps> = ({
  city1 = "Tokyo",
  city2 = "London",
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(time);
    } catch {
      return "--:--";
    }
  };

  const tokyoTime = formatCityTime("Asia/Tokyo");
  const londonTime = formatCityTime("Europe/London");

  return (
    <div className="flex flex-col justify-between h-full w-full p-2.5 text-white select-none">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-wider uppercase text-white/50 font-medium">
          World Clock
        </span>
        <Globe className="h-3 w-3 text-white/40" />
      </div>

      <div className="grid grid-cols-2 gap-2 my-auto">
        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
          <span className="text-[10px] text-white/50 block truncate">{city1}</span>
          <span className="text-sm font-bold font-mono text-white">{tokyoTime}</span>
        </div>
        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
          <span className="text-[10px] text-white/50 block truncate">{city2}</span>
          <span className="text-sm font-bold font-mono text-white">{londonTime}</span>
        </div>
      </div>

      <div className="text-[9px] text-white/40 truncate">
        Dual timezone synchronized
      </div>
    </div>
  );
};


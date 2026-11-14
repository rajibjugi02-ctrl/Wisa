import React from "react";
import { AppSettings } from "../../types/settings";
import { SunArcWidget } from "./SunArcWidget";
import { WeekCalendarWidget } from "./WeekCalendarWidget";
import { WaterTrackerWidget } from "./WaterTrackerWidget";
import { PomodoroWidget } from "./PomodoroWidget";
import { WorldClockWidget } from "./WorldClockWidget";
import { BatteryWidget } from "./BatteryWidget";
import { MoonWidget } from "./MoonWidget";
import { CountdownWidget } from "./CountdownWidget";
import { NextPrayerInfo, PrayerTimesData, SunArcMetrics } from "../../types/prayer";
import { WidgetId } from "../../types/island";

interface WidgetsViewProps {
  settings: AppSettings;
  times: PrayerTimesData;
  nextPrayer: NextPrayerInfo;
  sunArc: SunArcMetrics;
  now: Date;
}

export const WidgetsView: React.FC<WidgetsViewProps> = ({
  settings,
  times,
  nextPrayer,
  sunArc,
  now,
}) => {
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const renderWidgetById = (id: WidgetId) => {
    switch (id) {
      case "next-prayer":
        return (
          <SunArcWidget
            city={settings.prayerCity}
            times={times}
            nextPrayer={nextPrayer}
            sunArc={sunArc}
            isMeditationMode={settings.isGeneralMeditationMode}
          />
        );
      case "this-week":
        return <WeekCalendarWidget />;
      case "water":
        return <WaterTrackerWidget />;
      case "focus-today":
        return <PomodoroWidget />;
      case "world-clock":
        return (
          <WorldClockWidget
            city1={settings.worldClockCity1}
            city2={settings.worldClockCity2}
          />
        );
      case "battery":
        return <BatteryWidget />;
      case "moon":
        return <MoonWidget />;
      case "countdown":
        return (
          <CountdownWidget
            title={settings.countdownTargetName}
            daysRemaining={129}
          />
        );
      default:
        return <WeekCalendarWidget />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-4 py-2.5 select-none text-white">
      {/* Top Status Header */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-2">
        <span className="font-semibold text-white/80 tracking-tight">Widgets</span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="h-2 w-2 rounded-full border border-emerald-400 bg-emerald-500/30" />
          <span>{formattedDate}</span>
          <span className="text-white/80 font-bold">{formattedTime}</span>
        </div>
      </div>

      {/* Two Widgets Grid */}
      <div className="grid grid-cols-2 gap-3 h-[142px]">
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-1 backdrop-blur-md overflow-hidden shadow-islandCard hover:border-white/20 transition-colors">
          {renderWidgetById(settings.widgetSlotLeft)}
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-1 backdrop-blur-md overflow-hidden shadow-islandCard hover:border-white/20 transition-colors">
          {renderWidgetById(settings.widgetSlotRight)}
        </div>
      </div>
    </div>
  );
};


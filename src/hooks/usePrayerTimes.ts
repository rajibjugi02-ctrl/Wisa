import { useEffect, useState } from "react";
import { computeSunArcMetrics, DEFAULT_PRAYER_TIMES, getNextPrayer } from "../lib/prayer-calc";
import { NextPrayerInfo, PrayerTimesData, SunArcMetrics } from "../types/prayer";

export function usePrayerTimes(city: string = "Tangerang") {
  const [times] = useState<PrayerTimesData>(DEFAULT_PRAYER_TIMES);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextPrayer: NextPrayerInfo = getNextPrayer(times, now);
  const sunArc: SunArcMetrics = computeSunArcMetrics(times, now);

  return {
    city,
    times,
    now,
    nextPrayer,
    sunArc,
  };
}


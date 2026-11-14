import { NextPrayerInfo, PrayerTimesData, SunArcMetrics } from "../types/prayer";

export const DEFAULT_PRAYER_TIMES: PrayerTimesData = {
  subuh: "04:22",
  syuruq: "05:38",
  dzuhur: "11:52",
  ashar: "15:08",
  maghrib: "18:04",
  isya: "19:16",
};

export function getNextPrayer(
  times: PrayerTimesData,
  now: Date = new Date()
): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerSchedule = [
    { name: "Subuh", time: times.subuh },
    { name: "Dzuhur", time: times.dzuhur },
    { name: "Ashar", time: times.ashar },
    { name: "Maghrib", time: times.maghrib },
    { name: "Isya", time: times.isya },
  ].map((p) => {
    const [h, m] = p.time.split(":").map(Number);
    return {
      name: p.name,
      time: p.time,
      totalMinutes: h * 60 + m,
    };
  });

  for (const prayer of prayerSchedule) {
    if (prayer.totalMinutes > currentMinutes) {
      const diff = prayer.totalMinutes - currentMinutes;
      return {
        name: prayer.name,
        time: prayer.time,
        remainingMinutes: diff,
        formattedCountdown: formatMinutesCountdown(diff),
        isTomorrow: false,
      };
    }
  }

  // If all prayers passed today, next is tomorrow's Subuh
  const firstPrayer = prayerSchedule[0];
  const minutesUntilMidnight = 24 * 60 - currentMinutes;
  const diff = minutesUntilMidnight + firstPrayer.totalMinutes;

  return {
    name: firstPrayer.name,
    time: firstPrayer.time,
    remainingMinutes: diff,
    formattedCountdown: formatMinutesCountdown(diff),
    isTomorrow: true,
  };
}

function formatMinutesCountdown(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) {
    return `in ${hours} h ${remainingMins} min`;
  }
  return `in ${remainingMins} min`;
}

export function computeSunArcMetrics(
  times: PrayerTimesData,
  now: Date = new Date()
): SunArcMetrics {
  const [subuhH, subuhM] = times.subuh.split(":").map(Number);
  const [maghribH, maghribM] = times.maghrib.split(":").map(Number);

  const sunriseMin = subuhH * 60 + subuhM + 45; // approximately syuruq
  const sunsetMin = maghribH * 60 + maghribM;
  const currentMin = now.getHours() * 60 + now.getMinutes();

  if (currentMin >= sunriseMin && currentMin <= sunsetMin) {
    const dayLength = sunsetMin - sunriseMin;
    const progress = Math.min(1, Math.max(0, (currentMin - sunriseMin) / dayLength));
    return {
      progressRatio: progress,
      isDaytime: true,
      sunElevationAngle: Math.sin(progress * Math.PI),
    };
  }

  // Nighttime arc calculation
  const nightLength = 24 * 60 - sunsetMin + sunriseMin;
  const elapsedNight =
    currentMin > sunsetMin
      ? currentMin - sunsetMin
      : 24 * 60 - sunsetMin + currentMin;

  const progress = Math.min(1, Math.max(0, elapsedNight / nightLength));
  return {
    progressRatio: progress,
    isDaytime: false,
    sunElevationAngle: Math.sin(progress * Math.PI),
  };
}


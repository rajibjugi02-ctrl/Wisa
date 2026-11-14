export interface PrayerTimesData {
  subuh: string;
  syuruq: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  remainingMinutes: number;
  formattedCountdown: string;
  isTomorrow: boolean;
}

export interface SunArcMetrics {
  progressRatio: number;
  isDaytime: boolean;
  sunElevationAngle: number;
}


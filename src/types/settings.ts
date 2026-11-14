import { WidgetId } from "./island";
import { TodoItem, AlarmSound } from "./todo";

export type SettingsSection =
  | "general"
  | "music-lyrics"
  | "pomodoro"
  | "todo"
  | "prayer"
  | "shelf"
  | "ai-keys"
  | "about";

export type ReligionMode =
  | "Islam (5 Waktu)"
  | "Christian"
  | "Hindu"
  | "Buddhist"
  | "Mindfulness";

export type CalculationMethod =
  | "kemenag"
  | "mwl"
  | "egypt"
  | "makkah"
  | "isna";

export interface AppSettings {
  // General
  launchOnStartup: boolean;
  autoCheckUpdates: boolean;
  closeToTray: boolean;
  soundFeedbackEnabled: boolean;
  autoExpandOnHover: boolean;
  hoverDelayMs: number;

  notchSize: "Small" | "Medium" | "Large";
  notchScale?: "Auto" | "100%" | "115%" | "130%" | "150%";
  minimalNotch: boolean;
  wisaMascot: boolean;
  nusaMascot: boolean;
  reminderSounds: boolean;
  hideInFullScreen: boolean;
  notchTopOffset: number;
  notchMaxWidth: number;
  alwaysOnTop: boolean;
  acrylicOpacity: number;
  glassSpecularIntensity: "subtle" | "balanced" | "vibrant";

  // Music & Lyrics
  showLyrics: boolean;
  dynamicCoverGlow: boolean;
  enableLiquidGlow: boolean;
  autoScrollLyrics: boolean;
  lyricsFontSize: "small" | "medium" | "large";

  // Timer & Pomodoro
  focusDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  alarmSoundWhenTimeUp: boolean;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  defaultFocusMinutes: number;
  alarmSound: AlarmSound;

  // To-do
  todoReminderTaskStarts: boolean;
  todoReminderTimeUp: boolean;
  todoSnoozeMinutes: 5 | 10 | 15;
  todoList: TodoItem[];

  // Prayer
  prayerShowPage: boolean;
  religionMode: ReligionMode;
  prayerProvince: string;
  prayerCity: string;
  prayerCountry: string;
  calculationMethod: CalculationMethod;
  adzanOrChimeSound: string;
  prayerReminderAtTime: boolean;
  prayerReminder10mBefore: boolean;
  prayerReminderSound: boolean;
  prayerPauseMedia: boolean;
  prayerFineTuneTarget: "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";
  prayerFineTuneShift: number;
  preAlertMinutes: 0 | 5 | 10 | 15;
  isGeneralMeditationMode: boolean;

  // Shelf & Clipboard
  shelfEnableDropzone: boolean;
  shelfSaveClipboardHistory: boolean;
  shelfMaxClipboardItems: number;
  shelfPersistent: boolean;
  clipboardHistoryLimit: number;
  autoFilterPasswords: boolean;

  // AI Assistant
  aiProvider: "Gemini" | "ChatGPT";
  preferredAiModel: "gemini-2.5-flash" | "gemini-1.5-pro" | "gpt-4o-mini" | "gpt-4o";
  geminiApiKey: string;
  openaiApiKey: string;
  aiTemperature: number;

  // Optional legacy / system values
  statusRingBattery?: boolean;
  statusRingColorMode?: "dynamic" | "monochrome";
  lowBatteryThreshold?: number;
  chargingGlow?: boolean;
  widgetSlotLeft: WidgetId;
  widgetSlotRight: WidgetId;
  worldClockCity1?: string;
  worldClockCity2?: string;
  countdownTargetName?: string;
  countdownTargetDate?: string;
  calendarStartOfWeek?: "sunday" | "monday";
  calendarShowDots?: boolean;
  waterTargetMl?: number;
  waterCupSizeMl?: number;
  waterReminderIntervalMinutes?: number;
  interceptVolumeHud?: boolean;
  interceptBrightnessHud?: boolean;
  notificationDurationSec?: number;
}

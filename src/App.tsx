import React, { useState, useEffect } from "react";
import { AppSettings } from "./types/settings";
import { IslandContainer } from "./components/island/IslandContainer";
import { SettingsModal } from "./components/settings/SettingsModal";
import { LandingPage } from "./pages/LandingPage";
import { isTauriEnvironment } from "./lib/tauri-bridge";

const DEFAULT_SETTINGS: AppSettings = {
  launchOnStartup: true,
  autoCheckUpdates: true,
  closeToTray: true,
  soundFeedbackEnabled: true,
  autoExpandOnHover: false,
  hoverDelayMs: 200,

  notchSize: "Medium",
  notchScale: "100%",
  minimalNotch: true,
  wisaMascot: true,
  nusaMascot: true,
  reminderSounds: true,
  hideInFullScreen: true,
  notchTopOffset: 0,
  notchMaxWidth: 600,
  alwaysOnTop: true,
  acrylicOpacity: 0.82,
  glassSpecularIntensity: "balanced",

  showLyrics: false,
  dynamicCoverGlow: true,
  enableLiquidGlow: true,
  autoScrollLyrics: true,
  lyricsFontSize: "medium",

  widgetSlotLeft: "next-prayer",
  widgetSlotRight: "this-week",

  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false,
  alarmSoundWhenTimeUp: true,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  defaultFocusMinutes: 25,
  alarmSound: "chime",

  todoReminderTaskStarts: true,
  todoReminderTimeUp: true,
  todoSnoozeMinutes: 10,
  todoList: [
    {
      id: "todo-1",
      title: "Review Wisa notch pull request",
      completed: false,
      focusMinutes: 25,
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: "todo-2",
      title: "Export VisionOS optical glass tokens",
      completed: true,
      focusMinutes: 15,
      createdAt: Date.now() - 1000 * 60 * 90,
    },
  ],

  prayerShowPage: true,
  religionMode: "Islam (5 Waktu)",
  prayerProvince: "Jawa Barat",
  prayerCity: "Bogor",
  prayerCountry: "Indonesia",
  calculationMethod: "kemenag",
  adzanOrChimeSound: "makkah",
  prayerReminderAtTime: true,
  prayerReminder10mBefore: false,
  prayerReminderSound: true,
  prayerPauseMedia: false,
  prayerFineTuneTarget: "Subuh",
  prayerFineTuneShift: 0,
  preAlertMinutes: 10,
  isGeneralMeditationMode: false,

  shelfEnableDropzone: true,
  shelfSaveClipboardHistory: true,
  shelfMaxClipboardItems: 10,
  shelfPersistent: true,
  clipboardHistoryLimit: 10,
  autoFilterPasswords: true,

  aiProvider: "Gemini",
  preferredAiModel: "gemini-2.5-flash",
  geminiApiKey: (import.meta.env.VITE_GEMINI_API_KEY as string) || "",
  openaiApiKey: (import.meta.env.VITE_OPENAI_API_KEY as string) || "",
  aiTemperature: 0.7,
};

export function App() {
  const isTauri = isTauriEnvironment();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const forceWeb =
    searchParams?.get("web") === "true" || searchParams?.get("view") === "website";
  const forceNotch =
    searchParams?.get("notch") === "true" ||
    searchParams?.get("app") === "true" ||
    searchParams?.get("view") === "notch";

  // Desktop Notch is rendered when inside Tauri app or explicitly tested with ?view=notch
  const isDesktopNotch = (isTauri || forceNotch) && !forceWeb;

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved =
        localStorage.getItem("wisa_settings") ||
        localStorage.getItem("nusa_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          geminiApiKey: parsed.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey,
          openaiApiKey: parsed.openaiApiKey || DEFAULT_SETTINGS.openaiApiKey,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // On first run inside the desktop Tauri app, open SettingsModal automatically
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    if (isTauri) {
      const hasOpened = localStorage.getItem("wisa_first_run_settings");
      if (!hasOpened) {
        localStorage.setItem("wisa_first_run_settings", "true");
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem("wisa_settings", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    val: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  // State 1: Native Windows Desktop App (Tauri / Wisa.exe)
  if (isDesktopNotch) {
    return (
      <div className="relative min-h-screen w-full select-none overflow-hidden bg-transparent">
        <main className="w-full flex justify-center items-start pt-1.5 z-40 relative">
          <IslandContainer
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onUpdateSetting={updateSetting}
          />
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSetting={updateSetting}
        />
      </div>
    );
  }

  // State 2: Official Wisa Product Website (Browser / GitHub Pages)
  // Clean showcase without any floating developer controls
  return <LandingPage />;
}

export default App;

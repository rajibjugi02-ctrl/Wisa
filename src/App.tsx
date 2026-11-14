import React, { useState, useEffect } from "react";
import { AppSettings } from "./types/settings";
import { IslandContainer } from "./components/island/IslandContainer";
import { SettingsModal } from "./components/settings/SettingsModal";
import { LandingPage } from "./pages/LandingPage";
import { isTauriEnvironment } from "./lib/tauri-bridge";
import { Image as ImageIcon, Sliders, Globe, Monitor } from "lucide-react";

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
  geminiApiKey: "",
  openaiApiKey: "",
  aiTemperature: 0.7,
};

export function App() {
  const isTauri = isTauriEnvironment();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const forceWeb = searchParams?.get("web") === "true";
  const forceNotch =
    searchParams?.get("notch") === "true" || searchParams?.get("app") === "true";
  const isDesktopNotch = (isTauri || forceNotch) && !forceWeb;

  const [viewMode, setViewMode] = useState<"showcase" | "desktop">("showcase");

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved =
        localStorage.getItem("wisa_settings") ||
        localStorage.getItem("nusa_settings");
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [browserWallpaperIndex, setBrowserWallpaperIndex] = useState(0);

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

  const wallpapers = [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80",
  ];

  // If in desktop Tauri app or requested ?notch=true, render the floating island directly
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

  // Web Browser environment: Showcase Website or Desktop Preview
  if (viewMode === "showcase") {
    return (
      <div className="relative min-h-screen w-full bg-[#09090b]">
        <LandingPage
          onSwitchToDesktopPreview={() => setViewMode("desktop")}
        />

        {/* Floating Quick Action to Preview Desktop Mode */}
        <aside
          aria-label="Mode Switcher"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-white/20 px-3.5 py-2 rounded-full text-xs text-white shadow-2xl"
        >
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors font-medium"
            title="Preview standalone floating notch over desktop wallpaper"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Open Desktop Notch View</span>
          </button>
        </aside>
      </div>
    );
  }

  // Standalone Desktop Wallpaper Preview in Browser
  return (
    <div
      className="relative min-h-screen w-full select-none overflow-hidden transition-all duration-700 bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpapers[browserWallpaperIndex]})`,
      }}
    >
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

      <aside
        aria-label="Preview Controls"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full text-xs text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setViewMode("showcase")}
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded-md hover:bg-white/10 font-semibold"
          title="Return to the Wisa official showcase website"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Website Showcase</span>
        </button>

        <span className="w-[1px] h-3 bg-white/20" />

        <button
          type="button"
          onClick={() =>
            setBrowserWallpaperIndex((prev) => (prev + 1) % wallpapers.length)
          }
          className="flex items-center gap-1 hover:text-blue-300 transition-colors px-2 py-0.5 rounded-md hover:bg-white/10"
          title="Switch background wallpaper to test glassmorphism"
        >
          <ImageIcon className="h-3 w-3" />
          <span>Wallpaper</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1 hover:text-blue-300 transition-colors px-2 py-0.5 rounded-md hover:bg-white/10"
          title="Open Settings"
        >
          <Sliders className="h-3 w-3" />
          <span>Settings</span>
        </button>
      </aside>
    </div>
  );
}

export default App;

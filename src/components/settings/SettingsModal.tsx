import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  AppSettings,
  SettingsSection,
  ReligionMode,
} from "../../types/settings";
import { SettingsSidebar } from "./SettingsSidebar";
import {
  checkWindowsAutostart,
  setWindowsAutostart,
} from "../../services/autostartService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => void;
}

/* iOS Green Toggle Switch matching macOS dark settings */
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none ${
      checked ? "bg-[#34C759]" : "bg-[#39393D]"
    }`}
  >
    <span
      className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out absolute top-0.5 ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

/* macOS Circular Stepper (- / +) */
interface StepperProps {
  value: string | number;
  onPrev: () => void;
  onNext: () => void;
}

const Stepper: React.FC<StepperProps> = ({ value, onPrev, onNext }) => (
  <div className="flex items-center gap-2.5">
    <button
      type="button"
      onClick={onPrev}
      className="w-6 h-6 rounded-full bg-[#323236] text-white/90 hover:bg-[#3e3e43] hover:text-white flex items-center justify-center transition-all active:scale-95 text-xs font-bold shrink-0"
    >
      <Minus className="w-3 h-3" />
    </button>
    <span className="min-w-[90px] text-center text-[13px] font-medium text-white/90 select-none">
      {value}
    </span>
    <button
      type="button"
      onClick={onNext}
      className="w-6 h-6 rounded-full bg-[#323236] text-white/90 hover:bg-[#3e3e43] hover:text-white flex items-center justify-center transition-all active:scale-95 text-xs font-bold shrink-0"
    >
      <Plus className="w-3 h-3" />
    </button>
  </div>
);

/* Segmented Pill Selector */
interface SegmentedControlProps<T extends string> {
  options: readonly T[] | T[];
  value: T;
  onChange: (val: T) => void;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="bg-[#18181A] p-0.5 rounded-lg flex items-center border border-white/[0.06] shrink-0">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded-md text-xs transition-all ${
            value === opt
              ? "bg-[#505054] text-white font-medium shadow-sm"
              : "text-white/60 hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* Card Container */
interface SettingsGroupProps {
  title?: string;
  children: React.ReactNode;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, children }) => (
  <div className="mb-6">
    {title && (
      <h2 className="text-xs text-white/40 mb-1.5 px-1 font-medium select-none">
        {title}
      </h2>
    )}
    <div className="bg-[#232325] rounded-xl border border-white/[0.04] divide-y divide-white/[0.06] overflow-hidden">
      {children}
    </div>
  </div>
);

/* Settings Row with Title & Controls */
interface SettingsRowProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="flex items-center justify-between px-4 py-3 min-h-[52px]">
    <div className="min-w-0 pr-4">
      <div className="text-[13px] font-medium text-white select-none">{title}</div>
      {subtitle && (
        <div className="text-[11px] text-white/50 mt-0.5 leading-snug select-none">
          {subtitle}
        </div>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkWindowsAutostart().then((enabled) => {
        if (enabled !== settings.launchOnStartup) {
          onUpdateSetting("launchOnStartup", enabled);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* Helper constants for Steppers */
  const notchScales = ["Auto", "100%", "115%", "130%", "150%"] as const;
  const religionModes: ReligionMode[] = [
    "Islam (5 Waktu)",
    "Christian",
    "Hindu",
    "Buddhist",
    "Mindfulness",
  ];
  const provinces = [
    "Jawa Barat",
    "DKI Jakarta",
    "Banten",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Bali",
  ];
  const cities = [
    "Bogor",
    "Tangerang",
    "Jakarta",
    "Bandung",
    "Depok",
    "Bekasi",
    "Semarang",
    "Yogyakarta",
    "Surabaya",
  ];
  const prayerTimesList = [
    "Subuh",
    "Dzuhur",
    "Ashar",
    "Maghrib",
    "Isya",
  ] as const;
  const clipboardLimits = [10, 20, 30, 50];

  const cycleNext = <T,>(arr: readonly T[] | T[], current: T): T => {
    const idx = arr.indexOf(current);
    return arr[(idx + 1) % arr.length];
  };

  const cyclePrev = <T,>(arr: readonly T[] | T[], current: T): T => {
    const idx = arr.indexOf(current);
    return arr[(idx - 1 + arr.length) % arr.length];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="w-[760px] h-[530px] max-w-[94vw] max-h-[90vh] bg-[#181818] rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden flex select-none"
        >
          {/* macOS Sidebar (Width 220px, #121212) */}
          <SettingsSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onClose={onClose}
          />

          {/* Right Content Area (#181818) */}
          <main className="flex-1 bg-[#181818] overflow-y-auto scrollbar-none p-6 text-white">
            {/* TAB 1: GENERAL */}
            {activeSection === "general" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  General
                </h1>

                <SettingsGroup title="Startup">
                  <SettingsRow
                    title="Start with Windows"
                    subtitle="Automatically open Nusa when signing into your PC"
                  >
                    <Toggle
                      checked={settings.launchOnStartup}
                      onChange={async (v) => {
                        onUpdateSetting("launchOnStartup", v);
                        await setWindowsAutostart(v);
                      }}
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Notch">
                  <SettingsRow
                    title="Notch size"
                    subtitle="Small (85%), Medium (100%), Large (115%)"
                  >
                    <SegmentedControl
                      options={["Small", "Medium", "Large"] as const}
                      value={settings.notchSize || "Medium"}
                      onChange={(v) => onUpdateSetting("notchSize", v)}
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Minimalist notch"
                    subtitle="Auto-compact when focused on other apps or browser"
                  >
                    <Toggle
                      checked={settings.minimalNotch}
                      onChange={(v) => onUpdateSetting("minimalNotch", v)}
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Wisa mascot"
                    subtitle="A little friend that lives in the notch"
                  >
                    <Toggle
                      checked={settings.wisaMascot ?? settings.nusaMascot ?? true}
                      onChange={(v) => {
                        onUpdateSetting("wisaMascot", v);
                        onUpdateSetting("nusaMascot", v);
                      }}
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Sounds">
                  <SettingsRow
                    title="Reminder sounds"
                    subtitle="Chimes for Pomodoro, To-do and Prayer"
                  >
                    <Toggle
                      checked={settings.reminderSounds}
                      onChange={(v) => onUpdateSetting("reminderSounds", v)}
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Full screen">
                  <SettingsRow
                    title="Hide in full screen"
                    subtitle="Games, videos and slides that fill the screen"
                  >
                    <Toggle
                      checked={settings.hideInFullScreen}
                      onChange={(v) => onUpdateSetting("hideInFullScreen", v)}
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 2: MUSIC AND LYRICS */}
            {activeSection === "music-lyrics" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  Music and lyrics
                </h1>

                <SettingsGroup title="Lyrics">
                  <SettingsRow
                    title="Show lyrics"
                    subtitle="From LRCLIB, a community-contributed lyrics database"
                  >
                    <Toggle
                      checked={settings.showLyrics}
                      onChange={(v) => onUpdateSetting("showLyrics", v)}
                    />
                  </SettingsRow>
                  <SettingsRow
                    title="Dynamic cover glow"
                    subtitle="Bottom-up ambient color from album art"
                  >
                    <Toggle
                      checked={settings.dynamicCoverGlow}
                      onChange={(v) => {
                        onUpdateSetting("dynamicCoverGlow", v);
                        onUpdateSetting("enableLiquidGlow", v);
                      }}
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 3: TIMER & POMODORO */}
            {activeSection === "pomodoro" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  Timer & Pomodoro
                </h1>

                <SettingsGroup title="Durations">
                  <SettingsRow
                    title="Focus duration"
                    subtitle="Length of focus session"
                  >
                    <Stepper
                      value={`${settings.focusDurationMinutes || 25} min`}
                      onPrev={() =>
                        onUpdateSetting(
                          "focusDurationMinutes",
                          Math.max(5, (settings.focusDurationMinutes || 25) - 5)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "focusDurationMinutes",
                          Math.min(120, (settings.focusDurationMinutes || 25) + 5)
                        )
                      }
                    />
                  </SettingsRow>

                  <SettingsRow
                    title="Short break"
                    subtitle="Length of short break"
                  >
                    <Stepper
                      value={`${settings.shortBreakMinutes || 5} min`}
                      onPrev={() =>
                        onUpdateSetting(
                          "shortBreakMinutes",
                          Math.max(1, (settings.shortBreakMinutes || 5) - 1)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "shortBreakMinutes",
                          Math.min(30, (settings.shortBreakMinutes || 5) + 1)
                        )
                      }
                    />
                  </SettingsRow>

                  <SettingsRow
                    title="Long break"
                    subtitle="Length of long break"
                  >
                    <Stepper
                      value={`${settings.longBreakMinutes || 15} min`}
                      onPrev={() =>
                        onUpdateSetting(
                          "longBreakMinutes",
                          Math.max(5, (settings.longBreakMinutes || 15) - 5)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "longBreakMinutes",
                          Math.min(60, (settings.longBreakMinutes || 15) + 5)
                        )
                      }
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Behavior">
                  <SettingsRow title="Auto-start breaks">
                    <Toggle
                      checked={settings.autoStartBreaks}
                      onChange={(v) => onUpdateSetting("autoStartBreaks", v)}
                    />
                  </SettingsRow>
                  <SettingsRow title="Alarm sound when time is up">
                    <Toggle
                      checked={settings.alarmSoundWhenTimeUp}
                      onChange={(v) => onUpdateSetting("alarmSoundWhenTimeUp", v)}
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 4: TO-DO */}
            {activeSection === "todo" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  To-do
                </h1>

                <SettingsGroup title="Reminders">
                  <SettingsRow title="When a task starts">
                    <Toggle
                      checked={settings.todoReminderTaskStarts}
                      onChange={(v) => onUpdateSetting("todoReminderTaskStarts", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="When time is up">
                    <Toggle
                      checked={settings.todoReminderTimeUp}
                      onChange={(v) => onUpdateSetting("todoReminderTimeUp", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="Snooze for">
                    <SegmentedControl
                      options={["5 min", "10 min", "15 min"]}
                      value={`${settings.todoSnoozeMinutes || 10} min`}
                      onChange={(v) => {
                        const mins = parseInt(v, 10) as 5 | 10 | 15;
                        onUpdateSetting("todoSnoozeMinutes", mins);
                      }}
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 5: PRAYER */}
            {activeSection === "prayer" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  Prayer
                </h1>

                <SettingsGroup title="Prayer times · Kemenag RI method">
                  <SettingsRow title="Show Prayer page">
                    <Toggle
                      checked={settings.prayerShowPage}
                      onChange={(v) => onUpdateSetting("prayerShowPage", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="Religion / Mode">
                    <Stepper
                      value={settings.religionMode}
                      onPrev={() =>
                        onUpdateSetting(
                          "religionMode",
                          cyclePrev(religionModes, settings.religionMode)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "religionMode",
                          cycleNext(religionModes, settings.religionMode)
                        )
                      }
                    />
                  </SettingsRow>

                  <SettingsRow title="Province">
                    <Stepper
                      value={settings.prayerProvince}
                      onPrev={() =>
                        onUpdateSetting(
                          "prayerProvince",
                          cyclePrev(provinces, settings.prayerProvince)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "prayerProvince",
                          cycleNext(provinces, settings.prayerProvince)
                        )
                      }
                    />
                  </SettingsRow>

                  <SettingsRow title="City">
                    <Stepper
                      value={settings.prayerCity}
                      onPrev={() =>
                        onUpdateSetting(
                          "prayerCity",
                          cyclePrev(cities, settings.prayerCity)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "prayerCity",
                          cycleNext(cities, settings.prayerCity)
                        )
                      }
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Reminders">
                  <SettingsRow title="At prayer time">
                    <Toggle
                      checked={settings.prayerReminderAtTime}
                      onChange={(v) => onUpdateSetting("prayerReminderAtTime", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="10 minutes before">
                    <Toggle
                      checked={settings.prayerReminder10mBefore}
                      onChange={(v) => onUpdateSetting("prayerReminder10mBefore", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="Sound">
                    <Toggle
                      checked={settings.prayerReminderSound}
                      onChange={(v) => onUpdateSetting("prayerReminderSound", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="Pause media at prayer time">
                    <Toggle
                      checked={settings.prayerPauseMedia}
                      onChange={(v) => onUpdateSetting("prayerPauseMedia", v)}
                    />
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="Fine-tune">
                  <SettingsRow title="Prayer">
                    <Stepper
                      value={settings.prayerFineTuneTarget || "Subuh"}
                      onPrev={() =>
                        onUpdateSetting(
                          "prayerFineTuneTarget",
                          cyclePrev(prayerTimesList, settings.prayerFineTuneTarget || "Subuh")
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "prayerFineTuneTarget",
                          cycleNext(prayerTimesList, settings.prayerFineTuneTarget || "Subuh")
                        )
                      }
                    />
                  </SettingsRow>

                  <SettingsRow title="Shift">
                    <Stepper
                      value={`${settings.prayerFineTuneShift || 0} min`}
                      onPrev={() =>
                        onUpdateSetting(
                          "prayerFineTuneShift",
                          Math.max(-15, (settings.prayerFineTuneShift || 0) - 1)
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "prayerFineTuneShift",
                          Math.min(15, (settings.prayerFineTuneShift || 0) + 1)
                        )
                      }
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 6: SHELF */}
            {activeSection === "shelf" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  Shelf
                </h1>

                <SettingsGroup title="Shelf & Clipboard">
                  <SettingsRow
                    title="Enable file dropzone"
                    subtitle="Stage files in the notch for quick drag and drop"
                  >
                    <Toggle
                      checked={settings.shelfEnableDropzone}
                      onChange={(v) => onUpdateSetting("shelfEnableDropzone", v)}
                    />
                  </SettingsRow>

                  <SettingsRow
                    title="Save clipboard history"
                    subtitle="Text & Images"
                  >
                    <Toggle
                      checked={settings.shelfSaveClipboardHistory}
                      onChange={(v) =>
                        onUpdateSetting("shelfSaveClipboardHistory", v)
                      }
                    />
                  </SettingsRow>

                  <SettingsRow title="Max clipboard items">
                    <Stepper
                      value={`${settings.shelfMaxClipboardItems || 10} items`}
                      onPrev={() =>
                        onUpdateSetting(
                          "shelfMaxClipboardItems",
                          cyclePrev(
                            clipboardLimits,
                            settings.shelfMaxClipboardItems || 10
                          )
                        )
                      }
                      onNext={() =>
                        onUpdateSetting(
                          "shelfMaxClipboardItems",
                          cycleNext(
                            clipboardLimits,
                            settings.shelfMaxClipboardItems || 10
                          )
                        )
                      }
                    />
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 7: AI ASSISTANT */}
            {activeSection === "ai-keys" && (
              <div>
                <h1 className="text-2xl font-bold text-white mb-5 tracking-tight">
                  AI Assistant
                </h1>

                <SettingsGroup title="Provider & Model">
                  <SettingsRow title="AI Provider">
                    <SegmentedControl
                      options={["Gemini", "ChatGPT"] as const}
                      value={settings.aiProvider || "Gemini"}
                      onChange={(v) => onUpdateSetting("aiProvider", v)}
                    />
                  </SettingsRow>

                  <SettingsRow title="Model">
                    {settings.aiProvider === "ChatGPT" ? (
                      <Stepper
                        value={
                          settings.preferredAiModel === "gpt-4o"
                            ? "GPT-4o"
                            : "GPT-4o mini"
                        }
                        onPrev={() =>
                          onUpdateSetting(
                            "preferredAiModel",
                            settings.preferredAiModel === "gpt-4o"
                              ? "gpt-4o-mini"
                              : "gpt-4o"
                          )
                        }
                        onNext={() =>
                          onUpdateSetting(
                            "preferredAiModel",
                            settings.preferredAiModel === "gpt-4o"
                              ? "gpt-4o-mini"
                              : "gpt-4o"
                          )
                        }
                      />
                    ) : (
                      <Stepper
                        value={
                          settings.preferredAiModel === "gemini-1.5-pro"
                            ? "Gemini 1.5 Pro"
                            : "Gemini 2.5 Flash"
                        }
                        onPrev={() =>
                          onUpdateSetting(
                            "preferredAiModel",
                            settings.preferredAiModel === "gemini-1.5-pro"
                              ? "gemini-2.5-flash"
                              : "gemini-1.5-pro"
                          )
                        }
                        onNext={() =>
                          onUpdateSetting(
                            "preferredAiModel",
                            settings.preferredAiModel === "gemini-1.5-pro"
                              ? "gemini-2.5-flash"
                              : "gemini-1.5-pro"
                          )
                        }
                      />
                    )}
                  </SettingsRow>
                </SettingsGroup>

                <SettingsGroup title="API Configuration">
                  <SettingsRow
                    title="Gemini API Key"
                    subtitle={
                      <span>
                        Free tier key from Google AI Studio.{" "}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline inline-flex items-center gap-0.5 ml-1"
                        >
                          Get free key <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </span>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          settings.geminiApiKey && settings.geminiApiKey.trim().length > 5
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {settings.geminiApiKey && settings.geminiApiKey.trim().length > 5
                          ? "Connected"
                          : "Not configured"}
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type={showGeminiKey ? "text" : "password"}
                          placeholder="AIzaSy..."
                          value={settings.geminiApiKey || ""}
                          onChange={(e) =>
                            onUpdateSetting("geminiApiKey", e.target.value)
                          }
                          className="bg-[#18181A] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400 w-52 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-2 text-white/40 hover:text-white transition-colors"
                          title={showGeminiKey ? "Hide key" : "Show key"}
                        >
                          {showGeminiKey ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </SettingsRow>

                  <SettingsRow
                    title="OpenAI API Key"
                    subtitle={
                      <span>
                        Key from platform.openai.com.{" "}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline inline-flex items-center gap-0.5 ml-1"
                        >
                          Get key <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </span>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          settings.openaiApiKey && settings.openaiApiKey.trim().length > 5
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {settings.openaiApiKey && settings.openaiApiKey.trim().length > 5
                          ? "Connected"
                          : "Not configured"}
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type={showOpenAiKey ? "text" : "password"}
                          placeholder="sk-..."
                          value={settings.openaiApiKey || ""}
                          onChange={(e) =>
                            onUpdateSetting("openaiApiKey", e.target.value)
                          }
                          className="bg-[#18181A] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400 w-52 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                          className="absolute right-2 text-white/40 hover:text-white transition-colors"
                          title={showOpenAiKey ? "Hide key" : "Show key"}
                        >
                          {showOpenAiKey ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </SettingsRow>
                </SettingsGroup>
              </div>
            )}

            {/* TAB 8: ABOUT */}
            {activeSection === "about" && (
              <div className="pt-2">
                {/* Center Mascot Card */}
                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#242428] to-[#101012] border border-white/20 p-2 shadow-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Glowing Mascot Head Illustration */}
                    <div className="relative w-14 h-12 flex items-center justify-center">
                      {/* Left & Right Ears */}
                      <div className="absolute -top-1 left-1.5 w-3 h-3 bg-indigo-500 rounded-tl-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <div className="absolute -top-1 right-1.5 w-3 h-3 bg-indigo-500 rounded-tr-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />

                      {/* Head Capsule */}
                      <div className="w-13 h-9 bg-black rounded-xl border border-white/20 shadow-inner flex items-center justify-center gap-3">
                        {/* Eyes */}
                        <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse" />
                        <div className="w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
                    Wisa
                  </h1>
                  <p className="text-xs text-white/50 mt-0.5">
                    Version 1.2.0
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    A living notch for Windows
                  </p>
                </div>

                <SettingsGroup title="Info">
                  <div className="flex items-center justify-between px-4 py-3 text-[13px] text-white">
                    <span className="font-medium text-white select-none">Website</span>
                    <a
                      href="https://rajibjugi02-ctrl.github.io/Wisa/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                    >
                      <span>rajibjugi02-ctrl.github.io/Wisa</span>
                      <ChevronRight className="w-4 h-4 text-white/40" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-[13px] text-white">
                    <span className="font-medium text-white select-none">Lyrics</span>
                    <a
                      href="https://lrclib.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                    >
                      <span>LRCLIB</span>
                      <ChevronRight className="w-4 h-4 text-white/40" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 text-[13px] text-white">
                    <span className="font-medium text-white select-none">Made by</span>
                    <span className="text-white/60">Rajib</span>
                  </div>
                </SettingsGroup>
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

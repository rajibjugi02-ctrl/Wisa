import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Timer,
  Inbox,
  CheckCheck,
  Moon,
  Sparkles,
  Settings,
  Minimize2,
  Zap,
} from "lucide-react";
import { NotchMode } from "../../types/island";
import { AppSettings } from "../../types/settings";
import { TodoItem } from "../../types/todo";
import { useMediaSession } from "../../hooks/useMediaSession";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";
import { useClipboardHistory } from "../../hooks/useClipboardHistory";
import { useNotifications } from "../../hooks/useNotifications";
import { IslandPill } from "./IslandPill";
import { DynamicMeshGlow } from "./DynamicMeshGlow";
import { MediaPlayerView } from "../media/MediaPlayerView";
import { ShelfClipboardView } from "../shelf/ShelfClipboardView";
import { TodoView } from "../todo/TodoView";
import { PomodoroWidget } from "../widgets/PomodoroWidget";
import { SunArcWidget } from "../widgets/SunArcWidget";
import { AiAssistantView } from "../assistant/AiAssistantView";
import { NotificationBanner } from "../notification/NotificationBanner";
import { invokeTauri } from "../../lib/tauri-bridge";

interface IslandContainerProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => void;
}

interface DockTabItem {
  id: NotchMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DOCK_ITEMS: DockTabItem[] = [
  { id: "media", label: "Music", icon: Music, color: "#FF2D55" },
  { id: "timer", label: "Timer", icon: Timer, color: "#FF9F0A" },
  { id: "shelf", label: "Shelf", icon: Inbox, color: "#FFD60A" },
  { id: "todo", label: "TodoList", icon: CheckCheck, color: "#34C759" },
  { id: "prayer", label: "Prayer", icon: Moon, color: "#64D2FF" },
  { id: "assistant", label: "AI Assistant", icon: Sparkles, color: "#BF5AF2" },
];

const CAROUSEL_MODES: NotchMode[] = [
  "media",
  "timer",
  "shelf",
  "todo",
  "prayer",
  "assistant",
];

const NOTCH_SCALES: Record<"Small" | "Medium" | "Large", number> = {
  Small: 0.85,
  Medium: 1.0,
  Large: 1.15,
};

export const IslandContainer: React.FC<IslandContainerProps> = ({
  settings,
  onOpenSettings,
  onUpdateSetting,
}) => {
  const [mode, setMode] = useState<NotchMode>("pill");
  const [lastExpandedMode, setLastExpandedMode] = useState<NotchMode>("media");
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [mousePos, setMousePos] = useState({ x: 280, y: 100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const isPinnedRef = useRef(false);
  isPinnedRef.current = isPinned;

  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    mediaState,
    activeLyric,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    toggleLyrics,
    setVolume,
  } = useMediaSession(settings.showLyrics);

  const { times, nextPrayer, sunArc, now } = usePrayerTimes(settings.prayerCity);
  const { history, copiedId, copyItem, removeItem } = useClipboardHistory();
  const { currentNotification, showNotification, dismiss } = useNotifications();

  const isPill = mode === "pill";
  const hasIncomingNotif = !!currentNotification;

  /* Track Window Focus for Auto-Minimalist Mode */
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  /* Pin Notch when typing into text inputs (AI Assistant / To-do) */
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        setIsPinned(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        setTimeout(() => {
          const active = document.activeElement;
          if (!active || (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
            setIsPinned(false);
          }
        }, 150);
      }
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  /* Real-Time Lyric Width Measurement */
  const lyricMeasureRef = useRef<HTMLDivElement>(null);
  const [measuredLyricWidth, setMeasuredLyricWidth] = useState<number>(260);

  const currentLyricText =
    activeLyric?.text || (mediaState.isPlaying ? mediaState.track.title : "Not Playing");

  useLayoutEffect(() => {
    if (lyricMeasureRef.current) {
      const textWidth = lyricMeasureRef.current.scrollWidth;
      const computed = Math.min(560, Math.max(160, textWidth + 56));
      setMeasuredLyricWidth(computed);
    }
  }, [currentLyricText, mediaState.showLyrics, isPill]);

  /* Scale calculations */
  const sizeScale = NOTCH_SCALES[settings.notchSize || "Medium"] || 1.0;

  const dynamicPillWidth = mediaState.showLyrics
    ? measuredLyricWidth
    : 260;

  const baseExpandedWidth =
    mode === "media"
      ? mediaState.showLyrics
        ? 650
        : 540
      : 560;

  const baseExpandedHeight = 270;

  const isUltraMinimalist =
    isPill &&
    settings.minimalNotch &&
    !isWindowFocused &&
    !isHovered &&
    !isPinned;

  const targetWidth = isPill
    ? hasIncomingNotif
      ? 380
      : isUltraMinimalist
      ? 124
      : dynamicPillWidth
    : baseExpandedWidth;

  const targetHeight = isPill
    ? hasIncomingNotif
      ? 68
      : isUltraMinimalist
      ? 26
      : 38
    : baseExpandedHeight;

  /* Hover to Expand & Leave to Collapse with 80ms Debounce */
  const handleMouseEnter = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    setIsHovered(true);
    if (mode === "pill") {
      setMode(lastExpandedMode);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isPinnedRef.current) return;
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    collapseTimerRef.current = setTimeout(() => {
      if (!isPinnedRef.current) {
        setMode("pill");
      }
    }, 80);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(false);
    setMode("pill");
  };

  const handlePrevMode = () => {
    setSlideDirection(-1);
    const currentIndex = CAROUSEL_MODES.indexOf(mode);
    const prevIndex = (currentIndex - 1 + CAROUSEL_MODES.length) % CAROUSEL_MODES.length;
    const nextM = CAROUSEL_MODES[prevIndex];
    setLastExpandedMode(nextM);
    setMode(nextM);
  };

  const handleNextMode = () => {
    setSlideDirection(1);
    const currentIndex = CAROUSEL_MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % CAROUSEL_MODES.length;
    const nextM = CAROUSEL_MODES[nextIndex];
    setLastExpandedMode(nextM);
    setMode(nextM);
  };

  const handleSelectMode = (newMode: NotchMode) => {
    const currentIndex = CAROUSEL_MODES.indexOf(mode);
    const targetIndex = CAROUSEL_MODES.indexOf(newMode);
    setSlideDirection(targetIndex >= currentIndex ? 1 : -1);
    setLastExpandedMode(newMode);
    setMode(newMode);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    invokeTauri("set_notch_size", {
      width: targetWidth + 24,
      height: targetHeight + (hasIncomingNotif && !isPill ? 80 : 20),
      isSettings: false,
    }).catch(() => {});
  }, [targetWidth, targetHeight, hasIncomingNotif, isPill]);

  useEffect(() => {
    const handleTestNotif = (e: Event) => {
      const customEvent = e as CustomEvent<{ appName: string; title: string; body: string }>;
      if (customEvent.detail) {
        showNotification(customEvent.detail.appName, customEvent.detail.title, customEvent.detail.body);
      }
    };
    window.addEventListener("wisa-test-notification", handleTestNotif);
    return () => window.removeEventListener("wisa-test-notification", handleTestNotif);
  }, [showNotification]);

  const getHeaderTitle = () => {
    switch (mode) {
      case "media":
        return mediaState.track.title || "Music";
      case "shelf":
        return "Shelf";
      case "todo":
        return (
          <span>
            Todo<span className="text-emerald-400">List</span>
          </span>
        );
      case "timer":
        return "Focus Timer";
      case "prayer":
        return "Prayer & Worship";
      case "assistant":
        return "AI Assistant";
      default:
        return "Wisa Notch";
    }
  };

  const formattedDateTime = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleToggleTodo = (id: string) => {
    const updated = (settings.todoList || []).map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdateSetting("todoList", updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = (settings.todoList || []).filter((t) => t.id !== id);
    onUpdateSetting("todoList", updated);
  };

  const handleAddQuickTodo = (title: string) => {
    const newTask: TodoItem = {
      id: "todo-" + Date.now(),
      title,
      completed: false,
      focusMinutes: 25,
      createdAt: Date.now(),
    };
    onUpdateSetting("todoList", [newTask, ...(settings.todoList || [])]);
  };

  /* Smooth Directional Slide Variants (500 stiffness, 36 damping, 0.6 mass) */
  const slideVariants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir * 24,
      scale: 0.98,
      filter: "blur(6px)",
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 36,
        mass: 0.6,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir * -24,
      scale: 0.98,
      filter: "blur(6px)",
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    }),
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none bg-transparent"
    >
      {/* Offscreen Real-Time Measurement for Dynamic Lyric Width */}
      <div
        ref={lyricMeasureRef}
        aria-hidden="true"
        className="fixed -top-[9999px] left-0 pointer-events-none opacity-0 invisible inline-flex items-center gap-3 whitespace-nowrap px-6 text-xs font-semibold tracking-tight"
      >
        <Music className="h-3.5 w-3.5 shrink-0" />
        <span>{currentLyricText}</span>
      </div>

      {/* Top-Center Transform Scaler (Small: 0.85, Medium: 1.0, Large: 1.15) */}
      <div
        className="relative bg-transparent overflow-visible pointer-events-auto"
        style={{
          transform: `scale(${sizeScale})`,
          transformOrigin: "top center",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* NotchWrapper: 100% Transparent without background or shadow */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            width: targetWidth,
            height: targetHeight,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 32,
            mass: 0.7,
          }}
          className="relative bg-transparent shadow-none border-none overflow-visible select-none"
          style={{
            width: targetWidth,
            height: targetHeight,
            willChange: "transform, width, height",
          }}
        >
          {/* Seamless Left Ear (MacBook Notch Concave SVG) with 1px overlap */}
          <svg
            className="absolute -mr-[1px] top-0 w-4 h-4 text-[#070709] pointer-events-none fill-current z-20"
            viewBox="0 0 16 16"
            style={{ left: "-15px" }}
          >
            <path d="M 0 0 H 16 V 16 C 16 7.163 8.837 0 0 0 Z" />
          </svg>

          {/* Seamless Right Ear (MacBook Notch Concave SVG) with 1px overlap */}
          <svg
            className="absolute -ml-[1px] top-0 w-4 h-4 text-[#070709] pointer-events-none fill-current z-20"
            viewBox="0 0 16 16"
            style={{ right: "-15px" }}
          >
            <path d="M 0 16 V 0 H 16 C 7.163 0 0 7.163 0 16 Z" />
          </svg>

          {/* NotchBody: Encapsulates background, borders, and glows */}
          <motion.div
            whileHover={isPill ? { scaleX: 1.02, scaleY: 1.04 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full h-full rounded-t-none rounded-b-[24px] overflow-hidden border-x border-b border-white/10 flex flex-col justify-between"
            style={{
              backgroundColor: "#070709",
              isolation: "isolate",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Bottom-Up Ambient Liquid Glow */}
            <DynamicMeshGlow
              colors={mediaState.track.ambientColors}
              isPlaying={
                settings.dynamicCoverGlow !== false &&
                settings.enableLiquidGlow !== false &&
                mediaState.isPlaying &&
                (mode === "media" || isPill)
              }
              opacity={isPill ? 0.45 : 0.8}
            />

          {/* Cursor Spotlight Surface Sheen Effect */}
          {!isPill && (
            <div
              className="pointer-events-none absolute inset-0 opacity-70 z-20"
              style={{
                background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 70%)`,
              }}
            />
          )}

          {/* State 1: Notification when pill */}
          {isPill && hasIncomingNotif ? (
            <NotificationBanner
              notification={currentNotification}
              isPill={true}
              onDismiss={dismiss}
            />
          ) : isUltraMinimalist ? (
            /* Auto-Minimalist Mode: Ultra-thin strip when focused on other apps/browser */
            <div className="flex items-center justify-center gap-2 h-full w-full px-2.5 cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-white/90 tracking-tight">
                {formattedTime}
              </span>
            </div>
          ) : isPill ? (
            <IslandPill
              mediaState={mediaState}
              activeLyric={activeLyric}
              onExpand={() => setMode(lastExpandedMode)}
              now={now}
            />
          ) : (
            /* State 2: Strict 3-Row Expanded Grid Architecture */
            <div className="relative z-10 flex flex-col justify-between h-full w-full pb-3">
              {/* ROW 1: Top Header Bar (Height 36px) */}
              <div className="h-[36px] flex items-center justify-between px-5 text-xs text-white/70 shrink-0">
                <span className="font-bold text-white text-xs tracking-wide">
                  {getHeaderTitle()}
                </span>

                <div className="flex items-center gap-2 font-mono text-[11px] text-white/80">
                  <span className="h-4 w-4 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                    <Zap className="h-2.5 w-2.5 fill-current" />
                  </span>
                  <span>{formattedDateTime}</span>
                  <span className="text-white font-bold">{formattedTime}</span>
                </div>
              </div>

              {/* Left & Right Circular Carousel Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevMode();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-30"
                title="Previous View"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextMode();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-30"
                title="Next View"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              {/* ROW 2: Main Widget Body (Height 154px with px-12 Safe-Zone Padding) */}
              <div className="h-[154px] w-full px-12 relative overflow-hidden flex items-center justify-center shrink-0">
                <AnimatePresence custom={slideDirection} mode="popLayout" initial={false}>
                  <motion.div
                    key={mode}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="h-full w-full flex items-center justify-center will-change-transform"
                  >
                    {mode === "media" && (
                      <MediaPlayerView
                        mediaState={mediaState}
                        onTogglePlay={togglePlayPause}
                        onNext={nextTrack}
                        onPrev={prevTrack}
                        onSeek={seekTo}
                        onToggleLyrics={toggleLyrics}
                        onVolumeChange={setVolume}
                      />
                    )}

                    {mode === "shelf" && (
                      <ShelfClipboardView
                        clipboardHistory={history}
                        onCopyClip={copyItem}
                        copiedId={copiedId}
                        onRemoveClip={removeItem}
                      />
                    )}

                    {mode === "todo" && (
                      <TodoView
                        todoList={settings.todoList || []}
                        onToggleTodo={handleToggleTodo}
                        onDeleteTodo={handleDeleteTodo}
                        onAddQuickTodo={handleAddQuickTodo}
                        onOpenSettings={onOpenSettings}
                      />
                    )}

                    {mode === "timer" && <PomodoroWidget />}

                    {mode === "prayer" && (
                      <SunArcWidget
                        city={settings.prayerCity}
                        times={times}
                        nextPrayer={nextPrayer}
                        sunArc={sunArc}
                        isMeditationMode={settings.isGeneralMeditationMode}
                      />
                    )}

                    {mode === "assistant" && (
                      <AiAssistantView
                        settings={settings}
                        onOpenSettings={onOpenSettings}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ROW 3: Bottom Footer Area with Smart Pagination Dots <-> Capsule Dock Morph */}
              <div
                onMouseEnter={() => setIsFooterHovered(true)}
                onMouseLeave={() => setIsFooterHovered(false)}
                className="h-[48px] w-full flex items-center justify-center shrink-0"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {!isFooterHovered ? (
                    /* Default: Minimalist Pagination Dots ("— • • • • •") */
                    <motion.div
                      key="pagination-dots"
                      initial={{ opacity: 0, scale: 0.92, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -4 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08]"
                    >
                      {DOCK_ITEMS.map((item) => {
                        const isActive = mode === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMode(item.id);
                            }}
                            className="focus:outline-none py-0.5"
                            title={item.label}
                          >
                            {isActive ? (
                              <motion.div
                                layoutId="activePaginationIndicator"
                                className="w-3.5 h-1 rounded-full shadow-[0_0_8px_currentColor]"
                                style={{ backgroundColor: item.color, color: item.color }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  ) : (
                    /* Hovered Footer: Bottom Capsule Dock */
                    <motion.div
                      key="capsule-dock"
                      initial={{ opacity: 0, scale: 0.94, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: 4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-white/40 text-xs"
                    >
                      {DOCK_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = mode === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMode(item.id);
                            }}
                            className="relative flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
                            title={item.label}
                          >
                            {/* Soft Pill Highlight */}
                            {isActive && (
                              <motion.div
                                layoutId="dockActivePill"
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: `${item.color}20` }}
                                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                              />
                            )}

                            {/* Bouncing Animated Icon */}
                            <motion.span
                              whileHover={{ scale: 1.18, y: -1 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              className="relative z-10 flex items-center justify-center transition-colors duration-150"
                              style={{
                                color: isActive ? item.color : "rgba(255, 255, 255, 0.45)",
                              }}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </motion.span>

                            {/* 100% Centered Active Dot Indicator */}
                            {isActive && (
                              <div className="absolute inset-x-0 bottom-1 flex justify-center pointer-events-none z-10">
                                <motion.div
                                  layoutId="dockActiveDot"
                                  className="w-1 h-1 rounded-full"
                                  style={{
                                    backgroundColor: item.color,
                                    boxShadow: `0 0 6px ${item.color}`,
                                  }}
                                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}

                      <span className="w-[1px] h-3 bg-white/20 mx-0.5 shrink-0" />

                      {/* Settings Gear */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSettings();
                        }}
                        className="relative flex items-center justify-center w-8 h-8 rounded-full text-white/45 hover:text-white transition-colors"
                        title="Settings"
                      >
                        <motion.span
                          whileHover={{ scale: 1.18, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          className="flex items-center justify-center"
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </motion.span>
                      </button>

                      {/* Minimize to Pill Button */}
                      <button
                        type="button"
                        onClick={handleMinimize}
                        className="relative flex items-center justify-center w-8 h-8 rounded-full text-white/45 hover:text-white transition-colors"
                        title="Minimize to Pill"
                      >
                        <motion.span
                          whileHover={{ scale: 1.18, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          className="flex items-center justify-center"
                        >
                          <Minimize2 className="h-3.5 w-3.5" />
                        </motion.span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>

      {/* State 2 Notification: Floats centered 8px directly below notch */}
      {!isPill && hasIncomingNotif && (
        <NotificationBanner
          notification={currentNotification}
          isPill={false}
          onDismiss={dismiss}
        />
      )}
    </div>
  );
};

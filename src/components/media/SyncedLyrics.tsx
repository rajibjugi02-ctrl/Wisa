import React, { useEffect, useRef } from "react";
import { LyricLine } from "../../types/music";

interface SyncedLyricsProps {
  lyrics: LyricLine[];
  currentTimeMs: number;
  onLineClick?: (timeMs: number) => void;
}

export const SyncedLyrics: React.FC<SyncedLyricsProps> = ({
  lyrics,
  currentTimeMs,
  onLineClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = lyrics.reduce(
    (acc, line, idx) => (currentTimeMs >= line.timeMs ? idx : acc),
    0
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      const container = containerRef.current;
      const targetScroll = activeEl.offsetTop - container.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-3 h-full overflow-y-auto pr-2 scrollbar-none select-none mask-fade-y"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div className="h-6 shrink-0" />
      {lyrics.map((line, index) => {
        const isActive = index === activeIndex;
        const distance = Math.abs(index - activeIndex);

        let opacity = "opacity-25";
        let blur = "blur-[1px]";
        let scale = "scale-[0.96]";

        if (isActive) {
          opacity = "opacity-100 text-white font-semibold";
          blur = "blur-0";
          scale = "scale-100";
        } else if (distance === 1) {
          opacity = "opacity-60 text-white/80";
          blur = "blur-[0.5px]";
          scale = "scale-[0.98]";
        }

        return (
          <button
            key={line.id}
            type="button"
            onClick={() => onLineClick?.(line.timeMs)}
            className={`text-left text-sm tracking-tight transition-all duration-500 ease-out origin-left cursor-pointer hover:opacity-90 ${opacity} ${blur} ${scale}`}
          >
            {line.text}
          </button>
        );
      })}
      <div className="h-10 shrink-0" />
    </div>
  );
};


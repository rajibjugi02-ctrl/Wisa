import React, { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  MessageSquareQuote,
  Music,
} from "lucide-react";
import { MediaState } from "../../types/music";
import { formatTimeMs, formatRemainingTime } from "../../lib/utils";
import { AudioWaveform } from "./AudioWaveform";

interface MediaPlayerViewProps {
  mediaState: MediaState;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (ms: number) => void;
  onToggleLyrics: () => void;
  onVolumeChange: (vol: number) => void;
}

export const MediaPlayerView: React.FC<MediaPlayerViewProps> = ({
  mediaState,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleLyrics,
  onVolumeChange,
}) => {
  const { track, isPlaying, positionMs, showLyrics, volume } = mediaState;
  const progressRatio = track.durationMs > 0 ? positionMs / track.durationMs : 0;
  const remainingMs = Math.max(0, track.durationMs - positionMs);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const activeIndex = track.lyrics.findIndex((l, i) => {
    const nextLine = track.lyrics[i + 1];
    return positionMs >= l.timeMs && (!nextLine || positionMs < nextLine.timeMs);
  });

  useEffect(() => {
    if (!lyricsContainerRef.current || activeIndex === -1 || !showLyrics) return;
    const activeEl = lyricsContainerRef.current.children[activeIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex, showLyrics]);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val * track.durationMs);
  };

  if (!showLyrics) {
    return (
      <div className="flex flex-col justify-between h-full w-full max-w-[420px] mx-auto select-none text-white py-1">
        {/* Row 1: Cover Art (locked 56x56) + Track Details & Equalizer */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden shrink-0 shadow-md border border-white/15 bg-black/40">
            {track.coverUrl ? (
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10">
                <Music className="h-6 w-6 text-white/50" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">
                {track.title}
              </h3>
              <AudioWaveform isPlaying={isPlaying} barCount={4} className="shrink-0" />
            </div>
            <p className="text-xs text-white/60 truncate mt-0.5">
              {track.artist}
            </p>
          </div>
        </div>

        {/* Row 2: Timeline Scrubber with Timestamps */}
        <div className="space-y-1 my-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>{formatTimeMs(positionMs)}</span>
            <span>{formatRemainingTime(remainingMs)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progressRatio}
            onChange={handleScrubberChange}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white transition-all hover:h-2"
          />
        </div>

        {/* Row 3: Proportional Controls */}
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={onToggleLyrics}
            className="p-1.5 rounded-xl text-white/45 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            title="Show lyrics"
          >
            <MessageSquareQuote className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onPrev}
              className="p-1.5 text-white/70 hover:text-white transition-transform active:scale-90"
              title="Previous"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              className="p-1.5 text-white/70 hover:text-white transition-transform active:scale-90"
              title="Next"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.85)}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 h-full w-full select-none text-white items-center">
      {/* Left Column (50%): Full Player */}
      <div className="flex flex-col justify-between h-full py-0.5 pr-2">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 min-w-[52px] min-h-[52px] max-w-[52px] max-h-[52px] rounded-xl overflow-hidden shrink-0 shadow-md border border-white/15 bg-black/40">
            {track.coverUrl ? (
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10">
                <Music className="h-5 w-5 text-white/50" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white tracking-tight truncate">
              {track.title}
            </h3>
            <p className="text-xs text-white/60 truncate mt-0.5">
              {track.artist}
            </p>
          </div>
        </div>

        <div className="space-y-1 my-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-0.5">
            <span>{formatTimeMs(positionMs)}</span>
            <span>{formatRemainingTime(remainingMs)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progressRatio}
            onChange={handleScrubberChange}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white transition-all hover:h-1.5"
          />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={onToggleLyrics}
            className="p-1.5 rounded-xl bg-white/25 text-white shadow-sm ring-1 ring-white/30 transition-all active:scale-90"
            title="Hide lyrics"
          >
            <MessageSquareQuote className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="p-1.5 text-white/70 hover:text-white transition-transform active:scale-90"
              title="Previous"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              className="p-1.5 text-white/70 hover:text-white transition-transform active:scale-90"
              title="Next"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.85)}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Right Column (50%): Synced Lyrics List */}
      <div
        ref={lyricsContainerRef}
        className="h-full overflow-y-auto scrollbar-none border-l border-white/10 pl-5 py-1 flex flex-col justify-start space-y-2.5"
      >
        {track.lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          return (
            <p
              key={line.id}
              onClick={() => onSeek(line.timeMs)}
              className={`cursor-pointer transition-all duration-300 leading-snug ${
                isActive
                  ? "text-sm font-bold text-white scale-100 opacity-100"
                  : "text-xs font-normal text-white/35 hover:text-white/70 opacity-60"
              }`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};

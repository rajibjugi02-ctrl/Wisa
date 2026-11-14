import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { MediaState, LyricLine } from "../../types/music";
import { AudioWaveform } from "../media/AudioWaveform";

interface IslandPillProps {
  mediaState: MediaState;
  activeLyric: LyricLine | null;
  onExpand: () => void;
  now: Date;
}

export const IslandPill: React.FC<IslandPillProps> = ({
  mediaState,
  activeLyric,
  onExpand,
}) => {
  const { track, isPlaying, showLyrics } = mediaState;

  if (!showLyrics) {
    return (
      <div
        onClick={onExpand}
        className="group relative flex items-center justify-between h-full w-full px-3.5 select-none text-white cursor-pointer outline-none overflow-hidden"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt=""
              className="h-5 w-5 rounded-md object-cover border border-white/20 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
              <Music className="h-3 w-3 text-white/70" />
            </div>
          )}

          <div className="min-w-0 text-left">
            <span className="text-xs font-semibold text-white/95 truncate block max-w-[150px]">
              {track.title}
            </span>
          </div>
        </div>

        <div className="shrink-0 pl-2">
          <AudioWaveform isPlaying={isPlaying} barCount={4} />
        </div>
      </div>
    );
  }

  const currentLyricText =
    activeLyric?.text || (isPlaying ? track.title : "Not Playing");

  return (
    <div
      onClick={onExpand}
      className="group relative flex items-center h-full w-full px-4 select-none text-white cursor-pointer outline-none overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0 text-white/80 group-hover:text-white transition-colors">
          <Music className="h-3.5 w-3.5" />
        </div>

        <div className="flex-1 min-w-0 text-left overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentLyricText}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-xs font-semibold text-white tracking-tight truncate block"
            >
              {currentLyricText}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

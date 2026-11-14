import React from "react";

interface AudioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  barCount = 4,
  className = "",
}) => {
  return (
    <div className={`flex items-end gap-[2px] h-3.5 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const heightPercent = isPlaying
          ? [40, 90, 60, 100, 50, 75][i % 6]
          : 25;
        const animationDelay = `${(i * 0.15).toFixed(2)}s`;

        return (
          <span
            key={i}
            className="w-[2.5px] rounded-full bg-emerald-400 transition-all duration-300"
            style={{
              height: `${heightPercent}%`,
              animation: isPlaying ? "equalizer 0.8s ease-in-out infinite alternate" : "none",
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
};


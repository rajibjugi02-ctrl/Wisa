import React from "react";

interface DynamicMeshGlowProps {
  colors: [string, string];
  isPlaying?: boolean;
  opacity?: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

export const DynamicMeshGlow: React.FC<DynamicMeshGlowProps> = ({
  colors,
  isPlaying = true,
  opacity = 0.85,
}) => {
  const [color1, color2] = colors;

  if (!isPlaying) {
    return null;
  }

  const primaryRgba = hexToRgba(color1, 0.65);
  const secondaryRgba = hexToRgba(color2 || color1, 0.22);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[24px] select-none transition-opacity duration-700 ease-out z-0"
      style={{
        background: `linear-gradient(to top, ${primaryRgba} 0%, ${secondaryRgba} 52%, #070709 100%)`,
        opacity,
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-24 rounded-full blur-[24px] opacity-75"
        style={{
          background: `radial-gradient(ellipse at bottom, ${color1} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

import React from "react";
import {
  Music,
  LayoutGrid,
  Bot,
  Layers,
  Settings,
  Minimize2,
} from "lucide-react";
import { NotchMode } from "../../types/island";

interface IslandDockProps {
  currentMode: NotchMode;
  onSelectMode: (mode: NotchMode) => void;
  onOpenSettings: () => void;
  onCollapse: () => void;
}

export const IslandDock: React.FC<IslandDockProps> = ({
  currentMode,
  onSelectMode,
  onOpenSettings,
  onCollapse,
}) => {
  const dockItems: Array<{
    mode: NotchMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { mode: "media", label: "Media", icon: Music },
    { mode: "widgets", label: "Widgets", icon: LayoutGrid },
    { mode: "assistant", label: "AI Assistant", icon: Bot },
    { mode: "shelf", label: "Shelf & Clip", icon: Layers },
  ];

  return (
    <div className="flex items-center justify-between w-full px-4 py-1.5 border-t border-white/10 select-none bg-black/20">
      <div className="flex items-center gap-1">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              type="button"
              onClick={() => onSelectMode(item.mode)}
              className={`relative px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all text-xs ${
                isActive
                  ? "bg-white/20 text-white font-medium shadow-sm"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              title={item.label}
            >
              <Icon className="h-3.5 w-3.5" />
              {isActive && <span className="text-[11px]">{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Open Settings"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onCollapse}
          className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          title="Collapse to pill"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};


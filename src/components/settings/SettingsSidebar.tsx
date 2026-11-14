import React from "react";
import {
  Settings,
  Music,
  Timer,
  Check,
  Moon,
  Inbox,
  Sparkles,
  Info,
} from "lucide-react";
import { SettingsSection } from "../../types/settings";

interface SidebarItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "general", label: "General", icon: Settings, color: "#6E6E73" },
  { id: "music-lyrics", label: "Music and lyrics", icon: Music, color: "#FF2D55" },
  { id: "pomodoro", label: "Timer & Pomodoro", icon: Timer, color: "#5856D6" },
  { id: "todo", label: "To-do", icon: Check, color: "#34C759" },
  { id: "prayer", label: "Prayer", icon: Moon, color: "#28CD9B" },
  { id: "shelf", label: "Shelf", icon: Inbox, color: "#FF9F0A" },
  { id: "ai-keys", label: "AI Assistant", icon: Sparkles, color: "#0A84FF" },
];

const ABOUT_ITEM: SidebarItem = {
  id: "about",
  label: "About",
  icon: Info,
  color: "#6E6E73",
};

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
  onClose: () => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSelectSection,
  onClose,
}) => {
  return (
    <aside className="w-[220px] shrink-0 bg-[#121212] select-none flex flex-col justify-between p-3 border-r border-white/[0.06]">
      <div>
        {/* macOS Window Close Dot */}
        <div className="flex items-center px-1 mb-3.5 pt-0.5">
          <button
            type="button"
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-110 active:scale-95 transition-all shadow-sm"
            title="Close"
          />
        </div>

        {/* Primary Settings Navigation */}
        <nav className="space-y-0.5" aria-label="Settings categories">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg w-full text-left transition-colors ${
                  isActive
                    ? "bg-[#2C2C2E] text-white shadow-sm font-medium"
                    : "text-white/80 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium tracking-tight truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Separated About section at the bottom */}
      <div className="border-t border-white/[0.06] pt-2 mt-auto">
        <button
          type="button"
          onClick={() => onSelectSection(ABOUT_ITEM.id)}
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg w-full text-left transition-colors ${
            activeSection === ABOUT_ITEM.id
              ? "bg-[#2C2C2E] text-white shadow-sm font-medium"
              : "text-white/80 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: ABOUT_ITEM.color }}
          >
            <ABOUT_ITEM.icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[13px] font-medium tracking-tight truncate">
            {ABOUT_ITEM.label}
          </span>
        </button>
      </div>
    </aside>
  );
};

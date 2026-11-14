import React from "react";
import {
  Music,
  MessageSquareQuote,
  Timer,
  Sparkles,
  Inbox,
  CheckCircle,
  Moon,
  Copy,
  Bell,
  Zap,
} from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "Music from any player",
    description:
      "Controls Spotify, Apple Music, YouTube Music, Tidal, or any browser tab seamlessly through Windows SMTC.",
    icon: Music,
    iconBg: "bg-[#FF2D55]",
    iconColor: "text-white",
  },
  {
    title: "Synced lyrics",
    description:
      "Line-by-line synchronized lyrics powered by LRCLIB. The notch naturally flexes its width to mirror every sung lyric.",
    icon: MessageSquareQuote,
    iconBg: "bg-[#FF375F]",
    iconColor: "text-white",
  },
  {
    title: "Focus timer & Pomodoro",
    description:
      "Configurable 25-minute focus intervals and breaks with clean circular countdown rings and gentle completion chimes.",
    icon: Timer,
    iconBg: "bg-[#5856D6]",
    iconColor: "text-white",
  },
  {
    title: "AI Assistant (Gemini & ChatGPT)",
    description:
      "Live SSE streaming answers right from the notch. Ask anything without switching away from your active work.",
    icon: Sparkles,
    iconBg: "bg-[#0A84FF]",
    iconColor: "text-white",
  },
  {
    title: "File shelf & Dropzone",
    description:
      "Stage screenshots, assets, and project files at the very top of your display for rapid drag-and-drop into any app.",
    icon: Inbox,
    iconBg: "bg-[#FF9F0A]",
    iconColor: "text-white",
  },
  {
    title: "To-do with reminders",
    description:
      "Keep track of daily priorities with actionable task checkboxes and punctual chimes when focus sessions start or end.",
    icon: CheckCircle,
    iconBg: "bg-[#34C759]",
    iconColor: "text-white",
  },
  {
    title: "Prayer times & sun arc",
    description:
      "Accurate 5-prayer daily timetable with Indonesian Kemenag calculation, fine-tune shifts, and a celestial sun trajectory arc.",
    icon: Moon,
    iconBg: "bg-[#28CD9B]",
    iconColor: "text-white",
  },
  {
    title: "Clipboard history",
    description:
      "Browse and re-copy recent text and code snippets with single-tap clipboard recall and privacy protection.",
    icon: Copy,
    iconBg: "bg-[#FF9500]",
    iconColor: "text-white",
  },
  {
    title: "Smart Notifications",
    description:
      "Priority banners smoothly glide beneath the notch, presenting important context without ever stealing window focus.",
    icon: Bell,
    iconBg: "bg-[#FF3B30]",
    iconColor: "text-white",
  },
  {
    title: "Battery & Charging HUD",
    description:
      "Monitors system battery percentage, power delivery wattage, and charging state instantly upon cable insertion.",
    icon: Zap,
    iconBg: "bg-[#30D158]",
    iconColor: "text-white",
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20 select-none">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          Everything you glance at, in one place.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed">
          Hover the notch to open it. Move away and it closes. Nothing to arrange, nothing to pin.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-[#18181b]/80 border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-[#202024]/90 flex items-start gap-4 shadow-lg group"
            >
              {/* Rounded-Square Apple Style App Icon */}
              <div
                className={`w-11 h-11 rounded-xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


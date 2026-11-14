import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Sparkles, ChevronDown } from "lucide-react";
import { InteractiveLaptopSimulator } from "../components/showcase/InteractiveLaptopSimulator";
import { FeatureGrid } from "../components/showcase/FeatureGrid";
import { TaskManagerBenchmark } from "../components/showcase/TaskManagerBenchmark";
import { CustomizationSection } from "../components/showcase/CustomizationSection";
import { DownloadGuide } from "../components/showcase/DownloadGuide";
import { FeedbackAndFaq } from "../components/showcase/FeedbackAndFaq";

interface LandingPageProps {
  onSwitchToDesktopPreview?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSwitchToDesktopPreview,
}) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Mascot Logo Icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#282830] to-[#121216] border border-white/20 p-1 shadow-md flex items-center justify-center">
            <div className="w-5 h-4 bg-black rounded-md flex items-center justify-center gap-1">
              <span className="w-1 h-1.5 bg-cyan-400 rounded-full" />
              <span className="w-1 h-1.5 bg-cyan-400 rounded-full" />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-none">
              Wisa
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5">
              by Rajib • v1.2.0
            </span>
          </div>
        </div>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-white/60">
          <a href="#simulator" className="hover:text-white transition-colors">
            Simulator
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#performance" className="hover:text-white transition-colors">
            Performance
          </a>
          <a href="#customization" className="hover:text-white transition-colors">
            Customization
          </a>
          <a href="#download" className="hover:text-white transition-colors">
            Download
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {onSwitchToDesktopPreview && (
            <button
              type="button"
              onClick={onSwitchToDesktopPreview}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all hidden sm:inline-block"
            >
              Floating Notch Mode
            </button>
          )}

          <a
            href="https://github.com/rajibjugi02-ctrl/Wisa"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="#download"
            className="text-xs px-4 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="simulator" className="pt-16 pb-12 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wisa 1.2 is here • Real SMTC, Synced Lyrics & Live AI</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
        >
          A living notch for Windows.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Music, lyrics, focus timers, smart notifications, prayer schedules, and AI intelligence.
          Tucked neatly at the top of your screen.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#download"
            className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download for Windows (Free)</span>
          </a>

          <a
            href="#features"
            className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-sm border border-white/[0.08] transition-all active:scale-95"
          >
            Explore Features
          </a>
        </motion.div>

        {/* Interactive Laptop Simulator Component */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14"
        >
          <InteractiveLaptopSimulator />
        </motion.div>
      </section>

      {/* 3. Feature Grid Section */}
      <div id="features">
        <FeatureGrid />
      </div>

      {/* 4. Task Manager Performance Benchmark Section */}
      <div id="performance">
        <TaskManagerBenchmark />
      </div>

      {/* 5. Customization & Release Notes Section */}
      <div id="customization">
        <CustomizationSection />
      </div>

      {/* 6. Download CTA & Visual Installation Guide Section */}
      <DownloadGuide />

      {/* 7. Support, Feedback Form, Note from Rajib, FAQ & Footer */}
      <div id="faq">
        <FeedbackAndFaq />
      </div>
    </div>
  );
};


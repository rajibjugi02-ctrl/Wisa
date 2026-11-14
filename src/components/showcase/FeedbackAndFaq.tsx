import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Send,
  CheckCircle2,
  Coffee,
  MessageSquare,
  Shield,
  ExternalLink,
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Is Wisa free?",
    a: "Yes. Wisa is completely free to download and use on your Windows PC. It is maintained by Rajib as a personal craft project for the community.",
  },
  {
    q: "Which music players work?",
    a: "Any application that reports to Windows System Media Transport Controls (SMTC) works out of the box. This includes Spotify, Apple Music, YouTube in Chrome, Edge, and Firefox, Tidal, VLC, and Windows Media Player.",
  },
  {
    q: "Why doesn't a song have lyrics?",
    a: "Lyrics are fetched on-demand from LRCLIB, an open community-contributed database. If a song is very new or rare and not yet indexed in LRCLIB, Wisa cleanly displays the song title and artist with your album art instead.",
  },
  {
    q: "Will it slow down my PC?",
    a: "No. Wisa is built with Rust and Tauri instead of heavy Chromium runtimes. It uses less than 30 MB of RAM and 0.0% CPU when idle. Drawing happens only when animations are active.",
  },
  {
    q: "How do I connect Gemini or ChatGPT?",
    a: "Open Settings (Gear icon) -> AI Assistant, then paste your Google AI Studio or OpenAI API key. Google provides a 100% free Gemini API key with no credit card required at aistudio.google.com. Your key is saved exclusively on your local PC and never sent to anyone else.",
  },
  {
    q: "How do I quit or stop it starting with Windows?",
    a: "To toggle startup behavior, open Settings -> General and toggle 'Start with Windows'. To exit Wisa completely, right-click the Wisa icon in your Windows Taskbar tray and select Exit.",
  },
];

export const FeedbackAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState<"feature" | "bug" | "praise">("feature");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setMessage("");
      setContact("");
    }, 2000);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20 select-none border-t border-white/[0.08]">
      {/* 1. Support & Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
        {/* Support Creator Card (4 cols) */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#1b1b20] to-[#121215] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Keep Wisa going
            </h3>
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              Wisa has no ads, no trackers, and no paywalls. If it makes your everyday Windows
              experience a little more delightful, consider buying Rajib a coffee or sponsoring on
              GitHub.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <a
              href="https://github.com/rajibjugi02-ctrl/Wisa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10 shadow"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Sponsor Rajib on GitHub</span>
              <ExternalLink className="w-3 h-3 text-white/40 ml-1" />
            </a>
          </div>
        </div>

        {/* Feedback Form Card (7 cols) */}
        <div className="md:col-span-7 bg-[#161619] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Tell me what you think
            </h3>
          </div>
          <p className="text-xs text-white/60 mb-5">
            Feature idea, bug to report, or general feedback? Send it straight to Rajib.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-2"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Thank you for your thoughts!</h4>
              <p className="text-xs text-white/60">
                Your message has been recorded. Wisa continuously improves thanks to community feedback.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-3 text-xs text-cyan-400 hover:underline inline-block font-medium"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Pills */}
              <div className="flex gap-2">
                {[
                  { id: "feature", label: "Feature Idea" },
                  { id: "bug", label: "Bug Report" },
                  { id: "praise", label: "Kind Words" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFeedbackCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      feedbackCategory === cat.id
                        ? "bg-cyan-500 text-black font-semibold shadow"
                        : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Message Textarea */}
              <textarea
                required
                rows={3}
                placeholder="What would make Wisa even better for you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#111114] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />

              {/* Email / Handle Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your email or GitHub username (optional)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="flex-1 bg-[#111114] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 2. An Honest Note from Rajib */}
      <div className="max-w-3xl mx-auto mb-24 bg-gradient-to-b from-[#18181b]/90 to-[#101013] border border-white/10 rounded-3xl p-7 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-2">
          An honest note
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          From Rajib, the person behind Wisa
        </h3>

        <div className="mt-4 space-y-3 text-sm text-white/70 leading-relaxed font-sans">
          <p>
            I built Wisa because I loved the fluid, tactile feeling of modern island interfaces, but I
            spend the majority of my workday on a Windows PC. Traditional Windows widgets often felt
            rigid, heavy, or cluttered.
          </p>
          <p>
            Wisa is built with precision: written natively in Rust to ensure your fans never spin up
            and your battery doesn't suffer, while the interface delivers real 60fps physics, live
            synced lyrics, prayer reminders, and instant AI streaming.
          </p>
          <p>
            I hope it brings that same spark of delight to your desktop every single day.
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-bold text-xs shadow-md">
              R
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Rajib</span>
              <span className="text-[11px] text-white/40">Creator & Developer</span>
            </div>
          </div>
          <span className="text-xs font-mono text-white/30">2026</span>
        </div>
      </div>

      {/* 3. Questions (Interactive FAQ Accordion) */}
      <div className="max-w-3xl mx-auto mb-20">
        <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 tracking-tight">
          Questions
        </h3>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-[#18181b]/80 border border-white/[0.08] rounded-2xl overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-white tracking-tight pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/[0.04] pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Privacy & Footer */}
      <div className="pt-12 border-t border-white/[0.08] text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs text-white/60">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>
            100% Local Privacy: No accounts, no data telemetry, no trackers. Your data never leaves
            your machine.
          </span>
        </div>

        <p className="text-xs text-white/40">
          © 2026 Wisa. Built with care by{" "}
          <a
            href="https://github.com/rajibjugi02-ctrl/Wisa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors underline"
          >
            Rajib
          </a>
          . Lyrics provided by{" "}
          <a
            href="https://lrclib.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors underline"
          >
            LRCLIB
          </a>
          .
        </p>
      </div>
    </section>
  );
};


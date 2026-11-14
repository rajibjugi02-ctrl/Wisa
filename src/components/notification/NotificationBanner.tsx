import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bell, X, Send } from "lucide-react";
import { ActiveNotification } from "../../hooks/useNotifications";

interface NotificationBannerProps {
  notification: ActiveNotification | null;
  isPill: boolean;
  onDismiss: () => void;
  onOpenApp?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  isPill,
  onDismiss,
  onOpenApp,
}) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  if (!notification) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setShowReplyInput(false);
    setReplyText("");
    onDismiss();
  };

  const isWhatsApp = notification.appName.toLowerCase().includes("whatsapp");

  if (isPill) {
    return (
      <div className="relative z-20 flex items-center justify-between h-full w-full px-3.5 text-white">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              isWhatsApp
                ? "bg-gradient-to-tr from-emerald-500 to-green-600 text-white"
                : "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white"
            }`}
          >
            {isWhatsApp ? (
              <MessageSquare className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {notification.appName}
              </span>
              <span className="text-[9px] text-white/40">just now</span>
            </div>
            <h4 className="text-xs font-semibold text-white truncate leading-tight">
              {notification.title}
            </h4>
            <p className="text-[11px] text-white/70 truncate leading-tight">
              {notification.body}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[540px] z-50 rounded-2xl visionos-glass p-3 shadow-2xl text-white"
        style={{
          boxShadow:
            "inset 0 1px 1px 0 rgba(255, 255, 255, 0.28), 0 20px 40px -10px rgba(0, 0, 0, 0.75)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isWhatsApp
                  ? "bg-gradient-to-tr from-emerald-500 to-green-600 text-white"
                  : "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white"
              }`}
            >
              {isWhatsApp ? (
                <MessageSquare className="h-4.5 w-4.5" />
              ) : (
                <Bell className="h-4.5 w-4.5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  {notification.appName}
                </span>
                <span className="text-[10px] text-white/40">just now</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">
                {notification.title}
              </h4>
              <p className="text-[11px] text-white/70 truncate max-w-[340px]">
                {notification.body}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <button
              type="button"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {showReplyInput && (
          <form
            onSubmit={handleSendReply}
            className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${notification.title}...`}
              autoFocus
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="p-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              title="Send reply"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

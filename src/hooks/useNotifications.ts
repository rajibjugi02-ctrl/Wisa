import { useEffect, useState } from "react";

export interface ActiveNotification {
  id: string;
  appName: string;
  title: string;
  body: string;
  timestamp: number;
}

export function useNotifications() {
  const [currentNotification, setCurrentNotification] = useState<ActiveNotification | null>(null);

  const showNotification = (appName: string, title: string, body: string) => {
    const notif: ActiveNotification = {
      id: "notif-" + Date.now(),
      appName,
      title,
      body,
      timestamp: Date.now(),
    };
    setCurrentNotification(notif);
  };

  const dismiss = () => {
    setCurrentNotification(null);
  };

  useEffect(() => {
    if (!currentNotification) return;
    const timer = setTimeout(() => {
      setCurrentNotification(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentNotification]);

  return {
    currentNotification,
    showNotification,
    dismiss,
  };
}


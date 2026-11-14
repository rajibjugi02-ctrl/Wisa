import { invokeTauri, isTauriEnvironment } from "../lib/tauri-bridge";

const AUTOSTART_STORAGE_KEY = "nusa_autostart_enabled";

/**
 * Checks whether Nusa Notch is registered to start with Windows
 */
export async function checkWindowsAutostart(): Promise<boolean> {
  if (isTauriEnvironment()) {
    try {
      const isEnabled = await invokeTauri<boolean>("get_autostart_status");
      return Boolean(isEnabled);
    } catch {
      // Fallback to stored preference
    }
  }

  const stored = localStorage.getItem(AUTOSTART_STORAGE_KEY);
  return stored !== null ? stored === "true" : true;
}

/**
 * Enables or disables starting Nusa Notch with Windows
 */
export async function setWindowsAutostart(enable: boolean): Promise<boolean> {
  localStorage.setItem(AUTOSTART_STORAGE_KEY, String(enable));

  if (isTauriEnvironment()) {
    try {
      const result = await invokeTauri<boolean>("set_autostart_status", { enable });
      return Boolean(result);
    } catch {
      return enable;
    }
  }

  return enable;
}


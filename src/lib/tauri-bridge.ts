declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
    electron?: {
      isElectron: boolean;
      setNotchSize: (width: number, height: number) => void;
      exitApp: () => void;
      openSettings: () => void;
      onOpenSettings: (callback: () => void) => void;
      onToggleMinimalist: (callback: () => void) => void;
    };
  }
}

export const isTauriEnvironment = (): boolean => {
  return typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__);
};

export const isElectronEnvironment = (): boolean => {
  return typeof window !== "undefined" && Boolean(window.electron?.isElectron);
};

export async function invokeTauri<T = unknown>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T> {
  // Support Electron IPC bridge
  if (isElectronEnvironment() && window.electron) {
    if (cmd === "exit_app") {
      window.electron.exitApp();
      return undefined as T;
    }
    if (cmd === "set_notch_size" && args) {
      window.electron.setNotchSize(Number(args.width) || 640, Number(args.height) || 280);
      return undefined as T;
    }
    if (cmd === "open_settings_window") {
      window.electron.openSettings();
      return undefined as T;
    }
  }

  // Support Tauri IPC bridge
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      return await invoke<T>(cmd, args);
    } catch {
      return getSimulatedFallback<T>(cmd);
    }
  }

  return getSimulatedFallback<T>(cmd);
}

function getSimulatedFallback<T>(cmd: string): T {
  switch (cmd) {
    case "get_media_state":
      return {
        title: "Die With A Smile",
        artist: "Lady Gaga & Bruno Mars",
        album: "Die With A Smile",
        is_playing: true,
        position_ms: 196000,
        duration_ms: 252000,
        thumbnail_base64: null,
      } as T;
    case "poll_notifications":
      return [] as T;
    default:
      return undefined as T;
  }
}

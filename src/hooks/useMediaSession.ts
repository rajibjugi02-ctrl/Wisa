import { useEffect, useRef, useState, useCallback } from "react";
import { LyricLine, MediaState, SongTrack } from "../types/music";
import { EMPTY_TRACK } from "../lib/lyrics-data";
import { invokeTauri, isTauriEnvironment, isElectronEnvironment } from "../lib/tauri-bridge";
import { fetchLyricsFromLrclib } from "../services/lyricsService";
import { extractCoverColors } from "../services/colorExtractor";

interface SmtcMediaTrackInfo {
  title: string;
  artist: string;
  album: string;
  is_playing: boolean;
  position_ms: number;
  duration_ms: number;
  thumbnail_base64?: string | null;
}

export function useMediaSession(settingsShowLyrics?: boolean) {
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(EMPTY_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [showLyrics, setShowLyrics] = useState(settingsShowLyrics ?? false);
  const [volume, setVolume] = useState(0.85);

  useEffect(() => {
    if (typeof settingsShowLyrics === "boolean") {
      setShowLyrics(settingsShowLyrics);
    }
  }, [settingsShowLyrics]);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const lastTrackKeyRef = useRef<string>("");

  /* Update active track from Windows SMTC session */
  const syncWithWindowsSmtc = useCallback(async () => {
    const isDesktop = isTauriEnvironment() || isElectronEnvironment();
    if (!isDesktop) return;

    try {
      const smtcInfo = await invokeTauri<SmtcMediaTrackInfo>("get_media_state");
      if (!smtcInfo || !smtcInfo.title || smtcInfo.title.trim() === "") {
        // No media active in Windows
        if (currentTrack.id !== "empty-track") {
          setCurrentTrack(EMPTY_TRACK);
          setIsPlaying(false);
          setPositionMs(0);
        }
        return;
      }

      const trackKey = `${smtcInfo.artist}-${smtcInfo.title}`;
      setIsPlaying(smtcInfo.is_playing);
      setPositionMs(smtcInfo.position_ms || 0);

      // Only fetch new lyrics and colors when song title/artist changes
      if (trackKey !== lastTrackKeyRef.current) {
        lastTrackKeyRef.current = trackKey;

        const coverSrc = smtcInfo.thumbnail_base64 || "";
        const ambientColors: [string, string] = coverSrc
          ? await extractCoverColors(coverSrc)
          : ["#18181b", "#09090b"];

        // Fetch real synced lyrics from LRCLIB API
        const fetchedLyrics = await fetchLyricsFromLrclib(
          smtcInfo.artist,
          smtcInfo.title,
          smtcInfo.album
        );

        const formattedLyrics: LyricLine[] = fetchedLyrics.map((l, idx) => ({
          id: idx,
          timeMs: l.timeMs,
          text: l.text,
        }));

        setCurrentTrack({
          id: `smtc-${Date.now()}`,
          title: smtcInfo.title,
          artist: smtcInfo.artist || "Unknown Artist",
          album: smtcInfo.album || "",
          coverUrl: coverSrc,
          durationMs: smtcInfo.duration_ms || 0,
          ambientColors,
          lyrics: formattedLyrics,
        });
      }
    } catch {
      // Keep silent on IPC failure
    }
  }, [currentTrack.id]);

  /* Poll Windows SMTC every 1.5 seconds */
  useEffect(() => {
    const isDesktop = isTauriEnvironment() || isElectronEnvironment();
    if (isDesktop) {
      syncWithWindowsSmtc();
      const interval = setInterval(syncWithWindowsSmtc, 1500);
      return () => clearInterval(interval);
    }
  }, [syncWithWindowsSmtc]);

  /* Smooth tick only when real media is actively playing */
  useEffect(() => {
    if (!isPlaying || currentTrack.durationMs <= 0) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setPositionMs((prev) => {
        const next = prev + delta;
        if (next >= currentTrack.durationMs) {
          return currentTrack.durationMs;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentTrack.durationMs]);

  /* Find currently active synced lyric line */
  const activeLyric = currentTrack.lyrics.reduce<LyricLine | null>(
    (acc, line) => (positionMs >= line.timeMs ? line : acc),
    null
  );

  const togglePlayPause = async () => {
    setIsPlaying((prev) => !prev);
    await invokeTauri("media_play_pause").catch(async () => {
      await invokeTauri("send_media_command", { action: "toggle" }).catch(() => {});
    });
  };

  const nextTrack = async () => {
    await invokeTauri("media_next").catch(async () => {
      await invokeTauri("send_media_command", { action: "next" }).catch(() => {});
    });
    setTimeout(syncWithWindowsSmtc, 300);
  };

  const prevTrack = async () => {
    await invokeTauri("media_prev").catch(async () => {
      await invokeTauri("send_media_command", { action: "previous" }).catch(() => {});
    });
    setTimeout(syncWithWindowsSmtc, 300);
  };

  const seekTo = (ms: number) => {
    if (currentTrack.durationMs > 0) {
      setPositionMs(Math.max(0, Math.min(ms, currentTrack.durationMs)));
    }
  };

  const toggleLyrics = () => setShowLyrics((prev) => !prev);

  const mediaState: MediaState = {
    track: currentTrack,
    isPlaying,
    positionMs,
    volume,
    showLyrics,
  };

  return {
    mediaState,
    activeLyric,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seekTo,
    toggleLyrics,
    setVolume,
  };
}

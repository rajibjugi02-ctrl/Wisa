import { useEffect, useRef, useState, useCallback } from "react";
import { LyricLine, MediaState, SongTrack } from "../types/music";
import { SAMPLE_TRACKS } from "../lib/lyrics-data";
import { invokeTauri, isTauriEnvironment } from "../lib/tauri-bridge";
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
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(SAMPLE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [positionMs, setPositionMs] = useState(44000);
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
    if (!isTauriEnvironment()) return;

    try {
      const smtcInfo = await invokeTauri<SmtcMediaTrackInfo>("get_media_state");
      if (!smtcInfo || !smtcInfo.title) return;

      const trackKey = `${smtcInfo.artist}-${smtcInfo.title}`;
      setIsPlaying(smtcInfo.is_playing);
      setPositionMs(smtcInfo.position_ms);

      // Only fetch new lyrics and colors when song title/artist changes
      if (trackKey !== lastTrackKeyRef.current) {
        lastTrackKeyRef.current = trackKey;

        const coverSrc =
          smtcInfo.thumbnail_base64 ||
          SAMPLE_TRACKS[trackIndex % SAMPLE_TRACKS.length].coverUrl;

        // Extract real RGB ambient colors from cover image
        const ambientColors = await extractCoverColors(coverSrc);

        // Fetch real synced lyrics from LRCLIB API
        const fetchedLyrics = await fetchLyricsFromLrclib(
          smtcInfo.artist,
          smtcInfo.title,
          smtcInfo.album
        );

        const formattedLyrics: LyricLine[] =
          fetchedLyrics.length > 0
            ? fetchedLyrics.map((l, idx) => ({ id: idx, timeMs: l.timeMs, text: l.text }))
            : SAMPLE_TRACKS[trackIndex % SAMPLE_TRACKS.length].lyrics;

        setCurrentTrack({
          id: `smtc-${Date.now()}`,
          title: smtcInfo.title,
          artist: smtcInfo.artist || "Unknown Artist",
          album: smtcInfo.album || "Unknown Album",
          coverUrl: coverSrc,
          durationMs: smtcInfo.duration_ms || 210000,
          ambientColors,
          lyrics: formattedLyrics,
        });
      }
    } catch {
      // Continue with local state on failure
    }
  }, [trackIndex]);

  /* Poll Windows SMTC every 1.5 seconds */
  useEffect(() => {
    if (isTauriEnvironment()) {
      syncWithWindowsSmtc();
      const interval = setInterval(syncWithWindowsSmtc, 1500);
      return () => clearInterval(interval);
    }
  }, [syncWithWindowsSmtc]);

  /* Smooth tick between polling intervals */
  useEffect(() => {
    if (!isPlaying) {
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
    if (isTauriEnvironment()) {
      await invokeTauri("media_play_pause").catch(async () => {
        await invokeTauri("send_media_command", { action: "toggle" }).catch(() => {});
      });
    }
  };

  const nextTrack = async () => {
    if (isTauriEnvironment()) {
      await invokeTauri("media_next").catch(async () => {
        await invokeTauri("send_media_command", { action: "next" }).catch(() => {});
      });
      setTimeout(syncWithWindowsSmtc, 400);
    } else {
      const nextIdx = (trackIndex + 1) % SAMPLE_TRACKS.length;
      setTrackIndex(nextIdx);
      setCurrentTrack(SAMPLE_TRACKS[nextIdx]);
      setPositionMs(0);
    }
  };

  const prevTrack = async () => {
    if (isTauriEnvironment()) {
      await invokeTauri("media_prev").catch(async () => {
        await invokeTauri("send_media_command", { action: "previous" }).catch(() => {});
      });
      setTimeout(syncWithWindowsSmtc, 400);
    } else {
      const prevIdx = (trackIndex - 1 + SAMPLE_TRACKS.length) % SAMPLE_TRACKS.length;
      setTrackIndex(prevIdx);
      setCurrentTrack(SAMPLE_TRACKS[prevIdx]);
      setPositionMs(0);
    }
  };

  const seekTo = (ms: number) => {
    setPositionMs(Math.max(0, Math.min(ms, currentTrack.durationMs)));
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

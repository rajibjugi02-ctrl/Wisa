import { LyricLine } from "../types/music";

interface LrcLibResponse {
  id?: number;
  name?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
  instrumental?: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

const lyricsCache = new Map<string, LyricLine[]>();

/**
 * Parses LRCLIB timestamp format: [mm:ss.xx] or [mm:ss.xxx]
 */
export function parseLrcString(lrcContent: string): LyricLine[] {
  const lines = lrcContent.split("\n");
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const fractionalStr = match[3];
      const fractionMs =
        fractionalStr.length === 2
          ? parseInt(fractionalStr, 10) * 10
          : parseInt(fractionalStr, 10);

      const timeMs = minutes * 60 * 1000 + seconds * 1000 + fractionMs;
      const text = match[4].trim();

      if (text) {
        result.push({
          id: result.length + 1,
          timeMs,
          text,
        });
      }
    }
  }

  return result.sort((a, b) => a.timeMs - b.timeMs);
}

/**
 * Fetches real synchronized lyrics from LRCLIB API
 */
export async function fetchLyricsFromLrclib(
  artist: string,
  title: string,
  album?: string
): Promise<LyricLine[]> {
  const cleanArtist = artist.trim();
  const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, "").trim(); // strip (Remastered), [feat...], etc.
  const cacheKey = `${cleanArtist.toLowerCase()}-${cleanTitle.toLowerCase()}`;

  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey)!;
  }

  try {
    // 1. Direct get endpoint
    const url = new URL("https://lrclib.net/api/get");
    url.searchParams.set("artist_name", cleanArtist);
    url.searchParams.set("track_name", cleanTitle);
    if (album) {
      url.searchParams.set("album_name", album.trim());
    }

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "NusaNotch/1.2 (https://github.com/rama2555/nusa)",
      },
    });

    if (response.ok) {
      const data: LrcLibResponse = await response.json();
      if (data.syncedLyrics) {
        const parsed = parseLrcString(data.syncedLyrics);
        if (parsed.length > 0) {
          lyricsCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    }

    // 2. Fallback search endpoint if direct get fails
    const searchUrl = new URL("https://lrclib.net/api/search");
    searchUrl.searchParams.set("q", `${cleanArtist} ${cleanTitle}`);

    const searchRes = await fetch(searchUrl.toString(), {
      headers: {
        "User-Agent": "NusaNotch/1.2 (https://github.com/rama2555/nusa)",
      },
    });

    if (searchRes.ok) {
      const results: LrcLibResponse[] = await searchRes.json();
      const matchWithSynced = results.find((r) => r.syncedLyrics && r.syncedLyrics.length > 0);
      if (matchWithSynced && matchWithSynced.syncedLyrics) {
        const parsed = parseLrcString(matchWithSynced.syncedLyrics);
        if (parsed.length > 0) {
          lyricsCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    }
  } catch {
    // Graceful fallback on network error
  }

  return [];
}

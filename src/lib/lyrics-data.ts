import { SongTrack } from "../types/music";

export const EMPTY_TRACK: SongTrack = {
  id: "empty-track",
  title: "Not Playing",
  artist: "No active media",
  album: "",
  coverUrl: "",
  durationMs: 0,
  ambientColors: ["#18181b", "#09090b"],
  lyrics: [],
};

export const SAMPLE_TRACKS: SongTrack[] = [EMPTY_TRACK];

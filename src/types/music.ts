export interface LyricLine {
  id: number;
  timeMs: number;
  text: string;
}

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
  ambientColors: [string, string];
  lyrics: LyricLine[];
}

export interface MediaState {
  track: SongTrack;
  isPlaying: boolean;
  positionMs: number;
  volume: number;
  showLyrics: boolean;
}


import { SongTrack } from "../types/music";

export const SAMPLE_TRACKS: SongTrack[] = [
  {
    id: "birds-of-a-feather",
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish - HIT ME HARD AND SOFT",
    album: "HIT ME HARD AND SOFT",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80",
    durationMs: 199000,
    ambientColors: ["#ea580c", "#dc2626"],
    lyrics: [
      { id: 1, timeMs: 0, text: "I want you to stay" },
      { id: 2, timeMs: 11000, text: "'Til I'm in the grave" },
      { id: 3, timeMs: 24000, text: "'Til I rot away, dead and buried" },
      { id: 4, timeMs: 44000, text: "'Til I'm in the casket you carry" },
      { id: 5, timeMs: 62000, text: "If you go, I'm going too, uh" },
      { id: 6, timeMs: 80000, text: "'Cause it was always you, alright" },
      { id: 7, timeMs: 104000, text: "And if I'm turnin' blue, please don't save me" },
      { id: 8, timeMs: 125000, text: "Nothin' in this world could ever break me" },
      { id: 9, timeMs: 150000, text: "Birds of a feather, we should stick together" },
    ],
  },
  {
    id: "die-with-a-smile",
    title: "Die With A Smile",
    artist: "Lady Gaga & Bruno Mars",
    album: "Die With A Smile - Single",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    durationMs: 252000,
    ambientColors: ["#3b82f6", "#8b5cf6"],
    lyrics: [
      { id: 1, timeMs: 0, text: "Ooh, ooh" },
      { id: 2, timeMs: 14000, text: "I, I just woke up from a dream" },
      { id: 3, timeMs: 24000, text: "Where you and I had to say goodbye" },
      { id: 4, timeMs: 44000, text: "If the world was ending, I'd wanna be next to you" },
      { id: 5, timeMs: 70000, text: "And die with a smile" },
    ],
  },
];

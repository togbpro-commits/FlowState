export type AudioFormat = "MP3" | "AAC" | "FLAC" | "WAV" | "OGG" | "OPUS";
export type SortMode = "ascend" | "descend" | "valley" | "peak" | "smart";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  bpm: number;
  key: string; // e.g. "A♭ Min", "C Maj"
  genre: string;
  format: AudioFormat;
  artworkColor: string;
  artworkColorSecondary: string;
  energy: number;
  danceability: number;
  analyzed: boolean;
  coverImage?: any;
  plays?: string;
}

export interface ArtistStory {
  id: string;
  name: string;
  avatarColor: string;
  isLive?: boolean;
  image?: any;
}

function t(
  id: string,
  title: string,
  artist: string,
  album: string,
  duration: number,
  bpm: number,
  key: string,
  genre: string,
  format: AudioFormat,
  artworkColor: string,
  artworkColorSecondary: string,
  energy: number,
  danceability: number,
  plays?: string,
): Track {
  return {
    id,
    title,
    artist,
    album,
    duration,
    bpm,
    key,
    genre,
    format,
    artworkColor,
    artworkColorSecondary,
    energy,
    danceability,
    analyzed: true,
    plays,
  };
}

export const MOCK_TRACKS: Track[] = [
  t("1",  "Golden Summer Nights", "Dua Lipa",          "Future Nostalgia", 322, 124, "A♭ Min", "Pop/Dance", "FLAC", "#e06040", "#661133", 94, 91, "100M"),
  t("2",  "Neon Descent",       "Circuit Ghost",     "Dark Matter",      247, 128, "F# Min", "Techno",    "FLAC", "#8833cc", "#220066", 92, 88, "45M"),
  t("3",  "Acid Rain",          "VoltAge",           "Voltage Drop",     312, 140, "F# Min", "Acid House","MP3",  "#cc3344", "#550011", 85, 94, "82M"),
  t("4",  "Solar Flare",        "Synthetic Dawn",    "Helio",            198, 122, "D Maj",  "Trance",    "WAV",  "#ff8800", "#aa3300", 78, 82, "12M"),
  t("5",  "Deep Descent",       "Bassline Project",  "Below Zero",       421, 95,  "G Min",  "Deep House","AAC",  "#114488", "#001133", 65, 78, "28M"),
  t("6",  "Prism Break",        "Refract",           "Light Theory",     285, 132, "B♭ Min", "Progressive","FLAC","#44ccdd", "#006688", 88, 91, "64M"),
  t("7",  "Ghost Protocol",     "Phantom Signal",    "Transmission",     336, 145, "E Min",  "Drum & Bass","MP3", "#22cc66", "#005522", 96, 89, "91M"),
  t("8",  "Velvet Vortex",      "Silk Circuit",      "Thread Count",     271, 118, "C# Min", "Ambient",   "OGG",  "#cc6699", "#550033", 45, 55, "15M"),
  t("9",  "Midnight Protocol",  "Dark Mode",         "Night Shift",      388, 138, "A Min",  "Techno",    "WAV",  "#334466", "#111122", 90, 86, "37M"),
  t("10", "Tessellate",         "Grid Runner",       "Geometry Wars",    223, 127, "D# Min", "Electro",   "FLAC", "#ffcc00", "#886600", 80, 85, "53M"),
  t("11", "Warp Core",          "Reactor Seven",     "Critical Mass",    295, 155, "F Min",  "Hardstyle", "MP3",  "#ff4400", "#661100", 98, 93, "76M"),
  t("12", "Cobalt Dreams",      "Azure Waves",       "Blue Spectrum",    342, 108, "G Maj",  "Chill Out", "AAC",  "#0088ff", "#003366", 42, 48, "19M"),
];

export const ARTIST_STORIES: ArtistStory[] = [
  { id: "1", name: "You",    avatarColor: "#ff44aa", isLive: false, image: require("../../assets/images/artist_sofia.png") },
  { id: "2", name: "Dua",    avatarColor: "#8844ff", isLive: true  },
  { id: "3", name: "Kimi",   avatarColor: "#44ccff", isLive: false },
  { id: "4", name: "Alex",   avatarColor: "#ffaa22", isLive: false },
  { id: "5", name: "REMI",   avatarColor: "#22cc88", isLive: false },
];

export const FEATURED_COLLECTIONS = [
  { id: "c1", title: "Top Songs Global",    subtitle: "Discover 76 Songs", colorStart: "#e03377", colorEnd: "#661144" },
  { id: "c2", title: "Popular Hip-Hop",     subtitle: "Discover 96 Songs", colorStart: "#ffaa22", colorEnd: "#aa3300" },
  { id: "c3", title: "Chill Electronic",    subtitle: "Discover 42 Songs", colorStart: "#22ccff", colorEnd: "#004488" },
];

export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  duration: string;
  color: string;
  cover: any;
}

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: "p1", name: "Favorites",      trackCount: 28, duration: "1h 52m", color: "#cc2244", cover: require("../../assets/images/albums/neon_nights.png") },
  { id: "p2", name: "Golden Hour",    trackCount: 14, duration: "58m",    color: "#ff8800", cover: require("../../assets/images/albums/golden_hour.png") },
  { id: "p3", name: "Late Night",     trackCount: 22, duration: "1h 28m", color: "#220066", cover: require("../../assets/images/albums/eclipse.png") },
  { id: "p4", name: "Workout Beats",  trackCount: 18, duration: "1h 12m", color: "#cc3300", cover: require("../../assets/images/albums/pulse.png") },
];

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function sortTracksByMode(tracks: Track[], mode: SortMode): Track[] {
  const sorted = [...tracks];
  switch (mode) {
    case "ascend":
      return sorted.sort((a, b) => a.bpm - b.bpm);
    case "descend":
      return sorted.sort((a, b) => b.bpm - a.bpm);
    case "valley": {
      const asc = sorted.sort((a, b) => a.bpm - b.bpm);
      const result: Track[] = [];
      let lo = 0, hi = asc.length - 1;
      while (lo <= hi) {
        result.push(asc[lo++]);
        if (lo <= hi) result.push(asc[hi--]);
      }
      return result;
    }
    case "peak": {
      const desc = sorted.sort((a, b) => b.bpm - a.bpm);
      const result: Track[] = [];
      let lo = 0, hi = desc.length - 1;
      while (lo <= hi) {
        result.push(desc[lo++]);
        if (lo <= hi) result.push(desc[hi--]);
      }
      return result;
    }
    case "smart":
      return sorted.sort((a, b) => {
        const scoreA = a.energy * 0.6 + a.danceability * 0.4;
        const scoreB = b.energy * 0.6 + b.danceability * 0.4;
        return scoreB - scoreA;
      });
    default:
      return sorted;
  }
}

export const SORT_MODES: { mode: SortMode; label: string; icon: string }[] = [
  { mode: "ascend",  label: "BPM ↑",  icon: "arrow.up" },
  { mode: "descend", label: "BPM ↓",  icon: "arrow.down" },
  { mode: "valley",  label: "Valley", icon: "waveform.path" },
  { mode: "peak",    label: "Peak",   icon: "waveform" },
  { mode: "smart",   label: "Smart",  icon: "sparkles" },
];

export const FORMAT_COLORS: Record<AudioFormat, { bg: string; text: string; lossless: boolean }> = {
  FLAC: { bg: "#f0a03022", text: "#f0c060", lossless: true },
  WAV:  { bg: "#22ccaa22", text: "#44eebb", lossless: true },
  MP3:  { bg: "#ffffff15", text: "#aaaacc", lossless: false },
  AAC:  { bg: "#ffffff15", text: "#9999bb", lossless: false },
  OGG:  { bg: "#ffffff15", text: "#8888aa", lossless: false },
  OPUS: { bg: "#ffffff15", text: "#7777aa", lossless: false },
};

export const MOCK_ACTIVITY = {
  stepsPerMinute: 92,
  targetBpm: 124,
  recommendedTracks: ["1", "6", "11", "3"],
  heartRate: 74,
  sessionDuration: 1843,
  caloriesBurned: 312,
};

export const MOCK_HR_CHART: number[] = [
  0.52, 0.55, 0.58, 0.60, 0.63, 0.66, 0.70, 0.72, 0.75, 0.73,
  0.71, 0.68, 0.70, 0.72, 0.74, 0.76, 0.74, 0.72, 0.70, 0.68,
];

export const TRANSITION_TYPES = [
  { id: "crossfade", label: "Crossfade",   icon: "arrow.left.arrow.right", description: "Smooth 4-bar blend" },
  { id: "echo",      label: "Echo Tail",   icon: "waveform.path.ecg",      description: "Natural reverb decay" },
  { id: "beatmatch", label: "Beat Match",  icon: "metronome",               description: "BPM-synced transition" },
] as const;

export type TransitionType = typeof TRANSITION_TYPES[number]["id"];

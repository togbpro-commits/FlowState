import { Platform } from "react-native";
import { Color } from "expo-router";

// ─── Native semantic colors ───────────────────────────────────────────────────
export const semanticColors = {
  label: Platform.select({
    ios: Color.ios.label,
    android: Color.android.dynamic.onSurface,
    default: "#ffffff",
  })!,
  secondaryLabel: Platform.select({
    ios: Color.ios.secondaryLabel,
    android: Color.android.dynamic.onSurfaceVariant,
    default: "#aaaabb",
  })!,
  separator: Platform.select({
    ios: Color.ios.separator,
    android: Color.android.dynamic.outlineVariant,
    default: "#2a2a3a",
  })!,
  systemBackground: Platform.select({
    ios: Color.ios.systemBackground,
    android: Color.android.dynamic.surface,
    default: "#0e0e14",
  })!,
};

// ─── Theme definitions ────────────────────────────────────────────────────────

export type ThemeName =
  | "studio"
  | "club"
  | "midnight"
  | "vinyl"
  | "prism"
  | "high-contrast";

export interface ThemeColors {
  name: ThemeName;
  label: string;
  /** Primary background */
  bg: string;
  /** Secondary / card surface */
  surface: string;
  /** Elevated surface */
  surfaceElevated: string;
  /** Primary accent */
  accent: string;
  /** Secondary accent */
  accentSecondary: string;
  /** Accent gradient pair */
  gradientStart: string;
  gradientEnd: string;
  /** Text: primary, secondary, tertiary */
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  /** Separator / divider */
  border: string;
  /** Waveform / visualizer color */
  waveform: string;
  /** Gesture trail color */
  gestureTrail: string;
  /** Tab bar active color */
  tabActive: string;
  /** Status: success, warning, error */
  success: string;
  warning: string;
  error: string;
  /** BPM badge */
  bpmBg: string;
  bpmText: string;
  /** Lossless badge */
  losslessBg: string;
  losslessText: string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  studio: {
    name: "studio",
    label: "Studio",
    bg: "#0d0d0f",
    surface: "#1a1a1f",
    surfaceElevated: "#252530",
    accent: "#f0a030",
    accentSecondary: "#e07820",
    gradientStart: "#f0a030",
    gradientEnd: "#e05030",
    textPrimary: "#f5f5f0",
    textSecondary: "#aaa89e",
    textMuted: "#666660",
    border: "#2a2a32",
    waveform: "#f0a030",
    gestureTrail: "#f0a03088",
    tabActive: "#f0a030",
    success: "#4caf70",
    warning: "#f0a030",
    error: "#e05030",
    bpmBg: "#f0a03022",
    bpmText: "#f0a030",
    losslessBg: "#f0a03022",
    losslessText: "#f0c060",
  },
  club: {
    name: "club",
    label: "Club",
    bg: "#050507",
    surface: "#0f0f14",
    surfaceElevated: "#1a1020",
    accent: "#cc44ff",
    accentSecondary: "#8844ff",
    gradientStart: "#cc44ff",
    gradientEnd: "#4422cc",
    textPrimary: "#ffffff",
    textSecondary: "#cc99ee",
    textMuted: "#664488",
    border: "#1f1028",
    waveform: "#cc44ff",
    gestureTrail: "#cc44ff88",
    tabActive: "#cc44ff",
    success: "#44ddaa",
    warning: "#ffaa22",
    error: "#ff4466",
    bpmBg: "#cc44ff22",
    bpmText: "#dd88ff",
    losslessBg: "#ffaa2222",
    losslessText: "#ffcc44",
  },
  midnight: {
    name: "midnight",
    label: "Midnight",
    bg: "#060c18",
    surface: "#0e1826",
    surfaceElevated: "#162034",
    accent: "#22d4e8",
    accentSecondary: "#1a8acc",
    gradientStart: "#22d4e8",
    gradientEnd: "#1a5acc",
    textPrimary: "#e8f4ff",
    textSecondary: "#7aaace",
    textMuted: "#3a5a7a",
    border: "#162030",
    waveform: "#22d4e8",
    gestureTrail: "#22d4e888",
    tabActive: "#22d4e8",
    success: "#44d488",
    warning: "#f0aa44",
    error: "#e04466",
    bpmBg: "#22d4e822",
    bpmText: "#44eeff",
    losslessBg: "#22ccaa22",
    losslessText: "#44eebb",
  },
  vinyl: {
    name: "vinyl",
    label: "Vinyl",
    bg: "#12100c",
    surface: "#1e1a14",
    surfaceElevated: "#2a2420",
    accent: "#e06030",
    accentSecondary: "#c04818",
    gradientStart: "#e06030",
    gradientEnd: "#882208",
    textPrimary: "#f0e8d8",
    textSecondary: "#b0a090",
    textMuted: "#6a5a4a",
    border: "#2e2820",
    waveform: "#e06030",
    gestureTrail: "#e0603088",
    tabActive: "#e06030",
    success: "#6ab870",
    warning: "#e0a040",
    error: "#c03828",
    bpmBg: "#e0603022",
    bpmText: "#f08050",
    losslessBg: "#e0a04022",
    losslessText: "#f0c060",
  },
  prism: {
    name: "prism",
    label: "Prism",
    bg: "#0a0a0e",
    surface: "#141418",
    surfaceElevated: "#1e1e28",
    accent: "#a844ff",
    accentSecondary: "#44aaff",
    gradientStart: "#ff4488",
    gradientEnd: "#4488ff",
    textPrimary: "#f8f8ff",
    textSecondary: "#9999cc",
    textMuted: "#555577",
    border: "#1e1e2e",
    waveform: "#a844ff",
    gestureTrail: "#ff448888",
    tabActive: "#a844ff",
    success: "#44ff88",
    warning: "#ffaa00",
    error: "#ff4444",
    bpmBg: "#a844ff22",
    bpmText: "#cc88ff",
    losslessBg: "#44aaff22",
    losslessText: "#88ccff",
  },
  "high-contrast": {
    name: "high-contrast",
    label: "High Contrast",
    bg: "#000000",
    surface: "#0a0a0a",
    surfaceElevated: "#141414",
    accent: "#ffee00",
    accentSecondary: "#ffffff",
    gradientStart: "#ffee00",
    gradientEnd: "#ff8800",
    textPrimary: "#ffffff",
    textSecondary: "#eeeeee",
    textMuted: "#999999",
    border: "#333333",
    waveform: "#ffee00",
    gestureTrail: "#ffee0088",
    tabActive: "#ffee00",
    success: "#00ff88",
    warning: "#ffaa00",
    error: "#ff2222",
    bpmBg: "#ffee0033",
    bpmText: "#ffee00",
    losslessBg: "#00ff8833",
    losslessText: "#00ff88",
  },
};

export const ALL_THEME_NAMES: ThemeName[] = [
  "studio",
  "club",
  "midnight",
  "vinyl",
  "prism",
  "high-contrast",
];

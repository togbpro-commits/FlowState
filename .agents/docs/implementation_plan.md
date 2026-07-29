# FlowState Music App — Implementation Plan

A full-featured DJ/music player app built with Expo SDK 57, Expo Router (`NativeTabs`), and React Native.

---

## Overview

FlowState is a music application featuring intelligent BPM sequencing, seamless crossfade transitions, 6 visual themes, theme-matched gesture controls, activity-aware cadence matching, on-device audio analysis, and universal format support.

---

## App Architecture

### Tab Structure (5 tabs via NativeTabs)

| Tab | Icon | Description |
|-----|------|-------------|
| **Library** | `music.note.list` | Track list with sort/filter controls |
| **Now Playing** | `waveform` | Full-screen player with visualizer |
| **Queue** | `list.number` | Intelligent sequencer / queue view |
| **Activity** | `figure.walk` | Step sensor BPM matching + analytics |
| **Settings** | `gearshape` | Themes, gestures, analysis options |

### Route Structure
```
src/app/
  _layout.tsx                    — NativeTabs root
  (library)/
    _layout.tsx                  — Stack
    index.tsx                    — Track list screen
    track/[id].tsx               — Track detail sheet
  (player)/
    _layout.tsx                  — Stack
    index.tsx                    — Now Playing screen
  (queue)/
    _layout.tsx                  — Stack
    index.tsx                    — Queue / Sequencer
  (activity)/
    _layout.tsx                  — Stack
    index.tsx                    — Activity mode
  (settings)/
    _layout.tsx                  — Stack
    index.tsx                    — Settings: themes, gestures
    theme-preview.tsx            — Full theme preview modal
```

---

## Feature Implementation Details

### 1. Intelligent Sequencing (Queue Tab)
- **Sort modes**: BPM Ascend, Descend, Valley (low→high→low), Peak (high→low→high), Smart (energy-aware)
- Horizontal scroll pill selector for mode
- Animated track list re-ordering with Reanimated layout animations
- BPM badge on every track card

### 2. Seamless Transitions (Now Playing)
- Crossfade, Echo Tail, and Beat Match mode toggle panel
- Waveform-style progress bar with "blend zone" overlay visual
- Animated "Next Track" preview at bottom of Now Playing

### 3. 6 Themes (Settings)
| Theme | Color Story |
|-------|-------------|
| **Studio** | Deep charcoal + amber warm accents |
| **Club** | Pure black + electric purple/magenta UV |
| **Midnight** | Navy/indigo + teal-cyan highlights |
| **Vinyl** | Warm cream/sepia + rust orange |
| **Prism** | Dark neutral + rainbow gradient accents |
| **High Contrast** | WCAG AAA black/white + vivid yellow |

- Theme stored in React context + `@react-native-async-storage/async-storage` persistence
- Live preview cards in Settings with animated selection ring
- Each theme ships its own color token object

### 4. Gesture Controls
- Swipe left/right on Now Playing → skip/prev with haptic impact
- Theme-matched gesture color trail (visual feedback strip)
- `expo-haptics` for impact/selection feedback

### 5. Activity Mode (Activity Tab)
- Step count display with animated BPM target badge
- Opt-in toggle (Switch) with privacy disclaimer
- Real-time BPM recommendation: e.g., "Walk: 95 BPM target"
- Cadence history bar chart

### 6. Powerful Analysis (Library / Track Detail)
- Mock analysis results: BPM, musical key (e.g. A♭ Min), genre, energy, danceability
- Track detail sheet shows analysis card with animated waveform bars

### 7. Universal Formats (Library)
- Format badge on each track card: MP3 / AAC / FLAC / WAV / OGG / OPUS
- Filter chip row: "All Formats" | MP3 | FLAC | WAV | etc.
- Color-coded badges: FLAC/WAV = gold (lossless), lossy = blue/gray

---

## Verification Plan

### Verification Steps
1. Run `npx expo start` and scan with Expo Go
2. Verify all 5 tabs render and navigate correctly
3. Verify theme switching applies instantly across all screens
4. Verify BPM sort modes reorder the queue list with animation
5. Verify gesture swipes on Now Playing trigger haptics + navigation
6. Verify Activity tab step/BPM mock data displays correctly
7. Verify track detail sheet shows analysis card
8. Run `npx tsc --noEmit` to verify type safety (passed cleanly)

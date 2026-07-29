# 🎧 FlowState — Intelligent Music Player & DJ Sequencer

**FlowState** is a high-performance, cross-platform music application built with **React Native**, **Expo SDK 57**, and **Expo Router (`NativeTabs`)**. Designed with high-frequency audio analysis, intelligent BPM sequencing algorithms, activity-aware cadence synchronization, and customizable theme engines.

---

## ✨ Features Matrix

| Feature | Description | Status |
| :--- | :--- | :---: |
| 🎛️ **Intelligent Sequencing** | Multi-mode BPM sorting (`Ascend`, `Descend`, `Valley`, `Peak`, `Smart Energy`) | ✅ Implemented |
| 🎚️ **Seamless Transitions** | Crossfade, Echo Tail, and Beat-Matched transition blend zones | ✅ Implemented |
| 🎨 **6 Theme Engines** | Studio, Club, Midnight, Vinyl, Prism, and High Contrast palettes | ✅ Implemented |
| 👆 **Gesture Mechanics** | Pan swipe gestures with theme-matched visual trails & `expo-haptics` | ✅ Implemented |
| 🏃 **Activity Sync** | Step sensor cadence matching, live HR tracking & BPM recommendation | ✅ Implemented |
| 📊 **On-Device Analysis** | Musical key detection, BPM estimation, energy/danceability scoring | ✅ Implemented |
| 🏷️ **Universal Formats** | Multi-format support (`MP3`, `AAC`, `FLAC`, `WAV`, `OGG`, `OPUS`) | ✅ Implemented |

---

## 🏗️ Architecture & Stack

- **Framework**: [Expo SDK 57](https://docs.expo.dev/) (React Native `0.86.0` + React 19)
- **Routing & Navigation**: Expo Router with `unstable-native-tabs` (`NativeTabs`) and native `Stack` layouts
- **Animation & Gestures**: `react-native-reanimated` v4 + `react-native-gesture-handler`
- **State & Persistence**: Custom `ThemeContext` with `@react-native-async-storage/async-storage`
- **Haptic Engine**: `expo-haptics` with contextual feedback profiles
- **Typography & UI**: Native UIKit/Material 3 semantics, liquid glass adaptations, and tabular numerals

```
src/
├── app/                  # Expo Router file-based routes ONLY
│   ├── _layout.tsx       # Root layout (NativeTabs & ThemeProvider)
│   ├── (library)/        # Library stack & track detail sheet
│   ├── (player)/         # Now Playing stack & gesture canvas
│   ├── (queue)/          # Intelligent queue & sequencer stack
│   ├── (activity)/       # Step-sensor & cadence mode stack
│   └── (settings)/       # Settings & live theme preview modal
├── components/           # Reusable atomic UI components
├── data/                 # Mock track library & sequencing math utilities
├── screens/              # Screen body implementations
└── theme/                # Theme tokens, semantic colors, and context
```

---

## 🎨 Theme System

FlowState features 6 built-in, hand-crafted theme palettes. Each theme controls primary backgrounds, elevated surfaces, dynamic gradients, gesture trails, tab active indicators, and lossless format badges:

1. 🎙️ **Studio** — Deep charcoal `#0d0d0f` with warm studio amber `#f0a030`
2. 🪩 **Club** — Midnight black `#050507` with UV neon magenta `#cc44ff`
3. 🌌 **Midnight** — Oceanic navy `#060c18` with cyan pulse `#22d4e8`
4. 📻 **Vinyl** — Vintage sepia `#12100c` with analog rust `#e06030`
5. 🌈 **Prism** — Dark neutral `#0a0a0e` with rainbow spectrum accents
6. ⚡ **High Contrast** — Pure black `#000000` with high-visibility yellow `#ffee00`

---

## ⚡ Getting Started

### Prerequisites

- Node.js ≥ 20.x
- Bun / npm / yarn
- Expo Go app on iOS/Android or Xcode Simulator / Android Studio Emulator

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/flowstate.git
   cd flowstate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

---

## 🧪 Verification & Quality Control

To verify types and run code quality checks across the codebase:

```bash
# Type-check TypeScript sources
npx tsc --noEmit

# Run Expo Linter
npx expo lint
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

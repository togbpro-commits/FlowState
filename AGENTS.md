# FlowState Agent Context & Project Guidelines

> **Expo Version Requirement**: Read exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

## 📌 Project Overview

**FlowState** is an Expo SDK 57 universal React Native music application with intelligent BPM sequencing, 6 dynamic themes, gesture-driven playback, activity cadence matching, and format badging.

---

## 📂 Project Architecture

```
.agents/
  ├── docs/                      # Architectural documentation & project history
  │   ├── implementation_plan.md # Initial technical spec and architecture design
  │   ├── task.md                # Feature completion checklist
  │   └── walkthrough.md         # Comprehensive feature implementation walkthrough
  └── skills/                    # Installed Expo skills (expo-native-ui, expo-router, etc.)
src/
  ├── app/                       # Expo Router routes ONLY (NativeTabs + Stacks)
  │   ├── _layout.tsx            # NativeTabs root navigator & ThemeProvider
  │   ├── (library)/             # Library stack & track detail sheet modal
  │   ├── (player)/              # Now Playing stack with swipe gesture canvas
  │   ├── (queue)/               # Queue & Sequencer stack with Reanimated list layout
  │   ├── (activity)/            # Step-sensor cadence matching stack
  │   └── (settings)/            # Settings & Live Theme Preview modal
  ├── components/                # Modular UI components (TrackCard, WaveformBars, BpmBadge, etc.)
  ├── data/                      # Track data structures, sorting algorithms, and mock dataset
  ├── screens/                   # Decoupled screen view bodies
  └── theme/                     # 6 Theme palettes (Studio, Club, Midnight, Vinyl, Prism, High Contrast)
```

---

## 💡 Key Architectural Guidelines for Future Work

1. **Expo Router Routing (`src/app`)**:
   - `src/app` contains **routes ONLY**. Do not place components, state hooks, or utils inside `src/app`.
   - Use `NativeTabs` from `expo-router/unstable-native-tabs`.
   - Use `<NativeTabs tintColor={theme.tabActive}>` for tab bar tinting.
   - Use Material Symbol names in `md` prop with underscores (e.g. `queue_music`, `graphic_eq`, `format_list_numbered`).

2. **Styling & Themes (`src/theme`)**:
   - Always derive active colors from `useTheme()` context.
   - Do not hardcode raw hex values in components — use `theme.surface`, `theme.accent`, `theme.textPrimary`, etc.
   - Theme selection persists across app launches via `@react-native-async-storage/async-storage`.

3. **Performance & Gestures**:
   - Use `react-native-reanimated` shared values and layout animations for list re-ordering.
   - Combine `GestureDetector` with `Gesture.Pan()` for touch gesture trails.
   - Use `expo-haptics` for tactile user interaction feedback.

---

## 🚀 Roadmap & Next Steps

If expanding FlowState in future sessions, consider:
- [ ] Integrating real audio playback via `expo-audio`
- [ ] Connecting hardware CoreMotion / Pedometer step sensors via `expo-sensors`
- [ ] Adding custom audio file importing from device storage
- [ ] Real-time FFT audio visualizer rendering via WebGL / Skia

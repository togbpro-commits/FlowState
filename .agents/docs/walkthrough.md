# FlowState Music App — Walkthrough & Design System

We have updated **FlowState** to match the ultra-modern, clean aesthetic of the reference design system, combining glassmorphism (`expo-glass-effect` + `expo-blur`), vibrant ambient imagery, and theme customization.

---

## 🎨 Design System & Reference Mockup Alignment

### 1. 🌅 Onboarding / Welcome Screen (`/welcome`)
- **Matching Left Mockup**:
  - Full-bleed ambient floral artwork wallpaper (`onboarding_art.png`).
  - Top right frosted glass **Skip** button.
  - Category glass pill badge: **Music app**.
  - Typography: **"Smarter Sounds Start Here."**
  - Subtitle: *"Discover personalized music powered by intelligent technology today."*
  - Solid white capsule CTA button: **"Get Started"** (navigates seamlessly into the app).

### 2. 🎛️ Discovery & Home Feed (`(library)`)
- **Matching Center Mockup**:
  - **Top User Header**: User avatar ("Adrian Alex"), greeting ("Good Morning"), glass search icon and notification bell.
  - **Live Stories / Artist Row**: Horizontal scroll list of artist avatars with glowing accent borders and `LIVE` badges.
  - **Top Daily Playlist Hero Card**: Full-height featured cover image (`hero_art.png`), `100M` views pill badge, and a **docked Frosted Glass Mini-Player** embedded directly inside the card (`Golden Summer Nights - Dua Lipa`).
  - **New Collection Section**: Vibrant horizontal cards (*Top Songs Global*, *Popular Hiphop Songs*, *Chill Electronic*) with circular arrow action buttons.
  - **Audio Format Filter Chips**: `MP3`, `AAC`, `FLAC`, `WAV`, `OGG`, `OPUS`.

### 3. 🎵 Suspended Glass Now Playing Screen (`(player)`)
- **Matching Right Mockup**:
  - **Full-Bleed Artwork Canvas**: Ambient high-resolution artist portrait background (`player_art.png`).
  - **Top Glass Header Navigation**: Back button `<` glass button, "Now Playing" title, and Favorite heart `♡` button.
  - **Suspended Frosted Glass Card**: Large floating glass card suspended over the lower half of the background image.
    - Track details: *"Golden Summer Nights - Dua Lipa"*.
    - Vibrant accent progress slider with timestamp counters (`2:12` / `5:22`).
    - Control Dock: Shuffle `⇄`, Prev `⏮`, Play/Pause `▶` (glowing circular play button), Next `⏭`, Favorite `♥`.
  - **Intelligent Sequencing & Transition Controls**: Expandable glass sheet for Crossfade, Echo Tail, and Beat Match modes.

### 4. 🔮 Universal Theme Integration
All 6 theme engines (**Studio**, **Club**, **Midnight**, **Vinyl**, **Prism**, **High Contrast**) remain active across all glass components, controls, and dynamic highlights.

---

## 📂 Updated Project Structure

```
src/
├── app/
│   ├── _layout.tsx              # Root layout with 5-tab NativeTabs & ThemeProvider
│   ├── welcome.tsx              # Onboarding / Splash route
│   ├── (library)/               # Library Stack (Index & Track Detail Sheet)
│   ├── (player)/                # Now Playing Stack
│   ├── (queue)/                 # Queue / Sequencer Stack
│   ├── (activity)/              # Activity Mode Stack
│   └── (settings)/              # Settings & Theme Preview Stack
├── components/
│   ├── glass-view.tsx           # AdaptiveGlassView (expo-glass-effect + expo-blur fallback)
│   ├── track-card.tsx           # Track list item with artwork & badges
│   ├── bpm-badge.tsx            # Theme-styled BPM badge
│   ├── format-badge.tsx         # Lossless & Lossy format badge
│   ├── waveform-bars.tsx        # Animated equalizer bars
│   ├── theme-card.tsx           # Theme preview selector card
│   └── transition-indicator.tsx # Crossfade / Echo / Beatmatch selector
├── data/
│   └── mock-tracks.ts           # Reference tracks (Dua Lipa), artist stories, collections
├── screens/
│   ├── onboarding/index.tsx     # Onboarding welcome screen (Left Mockup)
│   ├── library/index.tsx        # Home / Discovery screen (Center Mockup)
│   └── player/index.tsx         # Now Playing suspended glass screen (Right Mockup)
└── theme/
    ├── colors.ts                # 6 theme color definitions
    └── theme-context.tsx        # ThemeContext + AsyncStorage hook
```

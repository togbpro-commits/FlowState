import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MOCK_TRACKS, formatDuration, TransitionType, TRANSITION_TYPES } from "@/data/mock-tracks";
import { WaveformBars } from "@/components/waveform-bars";
import { BpmBadge } from "@/components/bpm-badge";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";

const ALBUM_ARTS = [
  require("../../../assets/images/albums/neon_nights.png"),
  require("../../../assets/images/albums/golden_hour.png"),
  require("../../../assets/images/albums/eclipse.png"),
  require("../../../assets/images/albums/pulse.png"),
];

export function PlayerScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [activeTransition, setActiveTransition] = useState<TransitionType>("crossfade");
  const progress = 0.37; // mock

  const track = MOCK_TRACKS[currentIdx];
  const albumArt = ALBUM_ARTS[currentIdx % ALBUM_ARTS.length];

  // Vinyl spin animation
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      rotation.value = withTiming(rotation.value, { duration: 500 });
    }
  }, [isPlaying]);

  const vinylStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Swipe gesture for track skipping
  const swipeX = useSharedValue(0);

  function skipNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIdx((i) => (i + 1) % MOCK_TRACKS.length);
  }
  function skipPrev() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIdx((i) => (i - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);
  }

  const pan = Gesture.Pan()
    .onUpdate((e) => { swipeX.value = e.translationX * 0.1; })
    .onEnd((e) => {
      if (e.translationX < -60) runOnJS(skipNext)();
      else if (e.translationX > 60) runOnJS(skipPrev)();
      swipeX.value = withSpring(0);
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeX.value }],
  }));

  const elapsed = formatDuration(Math.floor(track.duration * progress));
  const total = formatDuration(track.duration);
  const VINYL_SIZE = width * 0.7;

  return (
    <View style={{ flex: 1, backgroundColor: "#050508" }}>
      {/* Blurred artwork background */}
      <Image
        source={albumArt}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
      />
      <BlurView tint="dark" intensity={95} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.55)" }} />

      {/* Colored accent glow bottom */}
      <View
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: height * 0.4,
          backgroundColor: `${theme.accent}10`,
        }}
      />

      {/* ── Top nav ── */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BlurView tint="dark" intensity={70} style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
          </Pressable>
        </BlurView>

        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Now Playing
          </Text>
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600", marginTop: 1 }}>
            {track.genre}
          </Text>
        </View>

        <BlurView tint="dark" intensity={70} style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <MaterialIcons name="more-horiz" size={24} color="#fff" />
          </Pressable>
        </BlurView>
      </View>

      {/* ── Vinyl disc ── */}
      <GestureDetector gesture={pan}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {/* Outer glow ring */}
          <View
            style={{
              width: VINYL_SIZE + 32,
              height: VINYL_SIZE + 32,
              borderRadius: (VINYL_SIZE + 32) / 2,
              backgroundColor: `${theme.accent}12`,
              borderWidth: 1,
              borderColor: `${theme.accent}25`,
              position: "absolute",
            }}
          />

          {/* Spinning vinyl */}
          <Animated.View
            style={[
              vinylStyle,
              {
                width: VINYL_SIZE,
                height: VINYL_SIZE,
                borderRadius: VINYL_SIZE / 2,
                overflow: "hidden",
                backgroundColor: "#111",
                shadowColor: theme.accent,
                shadowOpacity: 0.35,
                shadowRadius: 32,
                shadowOffset: { width: 0, height: 8 },
                elevation: 20,
              },
            ]}
          >
            <Image source={albumArt} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            {/* Center label hole */}
            <View
              style={{
                position: "absolute",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#0d0d10",
                alignSelf: "center",
                top: VINYL_SIZE / 2 - 28,
                borderWidth: 3,
                borderColor: `${theme.accent}50`,
              }}
            />
            {/* Vinyl grooves overlay */}
            <View
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: VINYL_SIZE / 2,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.04)",
                backgroundColor: "transparent",
              }}
            />
          </Animated.View>
        </View>
      </GestureDetector>

      {/* ── Bottom control card ── */}
      <Animated.View style={[cardStyle, { paddingHorizontal: 20, paddingBottom: insets.bottom + 90 }]}>
        <BlurView
          tint="dark"
          intensity={80}
          style={{
            borderRadius: 30,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            padding: 22,
            gap: 18,
          }}
        >
          {/* Track info + waveform */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", letterSpacing: -0.5 }} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                {track.artist} · {track.album}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 8, marginLeft: 10 }}>
              <Pressable onPress={() => { Haptics.selectionAsync(); setIsLiked((l) => !l); }}>
                <MaterialIcons
                  name={isLiked ? "favorite" : "favorite-border"}
                  size={22}
                  color={isLiked ? "#ff3366" : "rgba(255,255,255,0.5)"}
                />
              </Pressable>
              <WaveformBars barCount={6} height={18} playing={isPlaying} color={theme.accent} />
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ gap: 6 }}>
            <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden" }}>
              <View style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: theme.accent, borderRadius: 2 }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontVariant: ["tabular-nums"] }}>{elapsed}</Text>
              <BpmBadge bpm={track.bpm} />
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontVariant: ["tabular-nums"] }}>{total}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable onPress={() => { Haptics.selectionAsync(); setIsShuffled((s) => !s); }}>
              <MaterialIcons name="shuffle" size={24} color={isShuffled ? theme.accent : "rgba(255,255,255,0.5)"} />
            </Pressable>

            <Pressable onPress={skipPrev}>
              <MaterialIcons name="skip-previous" size={36} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setIsPlaying((p) => !p); }}
              style={{
                width: 68, height: 68, borderRadius: 34,
                backgroundColor: "#fff",
                justifyContent: "center", alignItems: "center",
                shadowColor: theme.accent,
                shadowOpacity: 0.6,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 6 },
                elevation: 12,
              }}
            >
              <MaterialIcons
                name={isPlaying ? "pause" : "play-arrow"}
                size={34}
                color="#0a0a12"
              />
            </Pressable>

            <Pressable onPress={skipNext}>
              <MaterialIcons name="skip-next" size={36} color="#fff" />
            </Pressable>

            <Pressable onPress={() => { Haptics.selectionAsync(); setIsRepeating((r) => !r); }}>
              <MaterialIcons name="repeat" size={24} color={isRepeating ? theme.accent : "rgba(255,255,255,0.5)"} />
            </Pressable>
          </View>

          {/* Transition mode chips */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {TRANSITION_TYPES.map((tt) => {
              const active = activeTransition === tt.id;
              return (
                <Pressable
                  key={tt.id}
                  onPress={() => { Haptics.selectionAsync(); setActiveTransition(tt.id); }}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: active ? `${theme.accent}25` : "rgba(255,255,255,0.07)",
                    borderWidth: 1,
                    borderColor: active ? `${theme.accent}60` : "transparent",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: active ? theme.accent : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "700" }}>
                    {tt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

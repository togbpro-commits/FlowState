import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/theme/theme-context";
import { MOCK_ACTIVITY, MOCK_HR_CHART, MOCK_TRACKS, formatDuration } from "@/data/mock-tracks";
import { BpmBadge } from "@/components/bpm-badge";
import { FormatBadge } from "@/components/format-badge";
import { WaveformBars } from "@/components/waveform-bars";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const ALBUM_COVERS = [
  require("../../../assets/images/albums/neon_nights.png"),
  require("../../../assets/images/albums/golden_hour.png"),
  require("../../../assets/images/albums/eclipse.png"),
  require("../../../assets/images/albums/pulse.png"),
];

const WORKOUT_MODES = [
  { id: "run",   label: "Outdoor Run",   icon: "directions-run" as const,  targetBpm: 145 },
  { id: "walk",  label: "Power Walk",   icon: "directions-walk" as const, targetBpm: 120 },
  { id: "cycle", label: "Cycling",      icon: "pedal-bike" as const,      targetBpm: 132 },
  { id: "hiit",  label: "HIIT Cardio",  icon: "bolt" as const,            targetBpm: 155 },
];

export function ActivityScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activityEnabled, setActivityEnabled] = useState(true);
  const [selectedMode, setSelectedMode] = useState("run");

  const pulseScale = useSharedValue(1);

  const activeWorkout = WORKOUT_MODES.find((m) => m.id === selectedMode) ?? WORKOUT_MODES[0];

  useEffect(() => {
    if (activityEnabled) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 450, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 450, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [activityEnabled]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const recommended = MOCK_ACTIVITY.recommendedTracks
    .map((id) => MOCK_TRACKS.find((t) => t.id === id))
    .filter(Boolean) as (typeof MOCK_TRACKS)[0][];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Ambient background glow */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 300,
          backgroundColor: activityEnabled ? `${theme.accent}12` : `${theme.accent}05`,
          borderBottomLeftRadius: 200,
          borderBottomRightRadius: 200,
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 110,
          gap: 16,
        }}
      >
        {/* ── Header Row ── */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
              Real-Time Sensor Sync
            </Text>
            <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
              Activity Cadence
            </Text>
          </View>
          <View
            style={{
              backgroundColor: activityEnabled ? `${theme.accent}20` : theme.surface,
              borderRadius: 14,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: activityEnabled ? theme.accent : theme.border,
            }}
          >
            <Text style={{ color: activityEnabled ? theme.accent : theme.textMuted, fontSize: 11, fontWeight: "800" }}>
              {activityEnabled ? "LIVE SYNC ON" : "PAUSED"}
            </Text>
          </View>
        </View>

        {/* ── Workout Modes Selector Strip ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {WORKOUT_MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <Pressable
                key={mode.id}
                onPress={() => { Haptics.selectionAsync(); setSelectedMode(mode.id); }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: isSelected ? theme.accent : theme.surface,
                  borderWidth: 1,
                  borderColor: isSelected ? theme.accent : theme.border,
                }}
              >
                <MaterialIcons name={mode.icon} size={18} color={isSelected ? "#fff" : theme.textSecondary} />
                <Text style={{ color: isSelected ? "#fff" : theme.textSecondary, fontSize: 13, fontWeight: "700" }}>
                  {mode.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Main Cadence Gauge Hero Card ── */}
        <View
          style={{
            borderRadius: 24,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: activityEnabled ? `${theme.accent}40` : theme.border,
            backgroundColor: theme.surfaceElevated,
          }}
        >
          <BlurView tint="dark" intensity={70} style={{ padding: 20, gap: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ gap: 2 }}>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>
                  Target Match: {activeWorkout.label}
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "800" }}>
                  {activityEnabled ? `Cadence Locked @ ${activeWorkout.targetBpm} BPM` : "Sensor Sync Offline"}
                </Text>
              </View>
              <Switch
                value={activityEnabled}
                onValueChange={(v) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActivityEnabled(v); }}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Big Pulse Ring & Center BPM gauge */}
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Animated.View
                style={[
                  pulseStyle,
                  {
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    backgroundColor: activityEnabled ? `${theme.accent}20` : theme.surface,
                    borderWidth: 3,
                    borderColor: activityEnabled ? theme.accent : theme.border,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: theme.accent,
                    shadowOpacity: activityEnabled ? 0.5 : 0,
                    shadowRadius: 20,
                    elevation: 10,
                  },
                ]}
              >
                <MaterialIcons
                  name={activeWorkout.icon}
                  size={28}
                  color={activityEnabled ? theme.accent : theme.textMuted}
                />
                <Text
                  style={{
                    color: activityEnabled ? theme.accent : theme.textPrimary,
                    fontSize: 34,
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                    marginTop: 2,
                  }}
                >
                  {activityEnabled ? activeWorkout.targetBpm : "--"}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: "700", textTransform: "uppercase" }}>
                  BPM Pace
                </Text>
              </Animated.View>
            </View>

            {/* Live Status tagline */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <WaveformBars barCount={5} height={14} playing={activityEnabled} color={theme.accent} />
              <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "600" }}>
                {activityEnabled ? "Pace matching track queue automatically" : "Enable sync to adapt music tempo"}
              </Text>
            </View>
          </BlurView>
        </View>

        {/* ── Live Sensor Metrics Bar ── */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Steps/min */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: activityEnabled ? `${theme.accent}30` : theme.border,
              padding: 14,
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialIcons name="directions-run" size={20} color={activityEnabled ? theme.accent : theme.textMuted} />
            <Text style={{ color: activityEnabled ? theme.accent : theme.textPrimary, fontSize: 24, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.stepsPerMinute : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>steps/min</Text>
          </View>

          {/* Heart Rate */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 14,
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialIcons name="favorite" size={20} color="#ff3366" />
            <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.heartRate : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>bpm HR</Text>
          </View>

          {/* Energy Burn */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 14,
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialIcons name="local-fire-department" size={20} color="#ffaa22" />
            <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.caloriesBurned : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>kcal burned</Text>
          </View>
        </View>

        {/* ── Cadence History Graph ── */}
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>Cadence History</Text>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>Last 20 beats</Text>
          </View>
          <View style={{ height: 50, flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
            {MOCK_HR_CHART.map((v, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: Math.max(6, v * 46),
                  backgroundColor: activityEnabled ? theme.accent : theme.surfaceElevated,
                  borderRadius: 4,
                  opacity: 0.45 + v * 0.55,
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Recommended Workout Tracks ── */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "800" }}>
              Pace-Matched Playlist
            </Text>
            <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "700" }}>Auto-Matched</Text>
          </View>

          {recommended.map((track, idx) => (
            <Pressable
              key={track.id}
              onPress={() => { Haptics.selectionAsync(); router.push("/(player)"); }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 12,
                backgroundColor: theme.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Image
                source={ALBUM_COVERS[idx % ALBUM_COVERS.length]}
                style={{ width: 48, height: 48, borderRadius: 12 }}
                contentFit="cover"
              />
              <View style={{ flex: 1, gap: 3 }}>
                <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>
                  {track.title}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{track.artist}</Text>
              </View>

              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <BpmBadge bpm={track.bpm} size="md" />
                <View style={{ backgroundColor: `${theme.accent}18`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ color: theme.accent, fontSize: 9, fontWeight: "800" }}>MATCH</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ── Privacy Notice ── */}
        <View
          style={{
            backgroundColor: `${theme.accent}10`,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: `${theme.accent}25`,
            padding: 14,
            flexDirection: "row",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <MaterialIcons name="security" size={18} color={theme.accent} style={{ marginTop: 1 }} />
          <Text style={{ color: theme.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 }}>
            Step sensor & health cadence data is processed{" "}
            <Text style={{ color: theme.accent, fontWeight: "700" }}>entirely on-device</Text>
            {" "}and never leaves your device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MOCK_ACTIVITY, MOCK_HR_CHART, MOCK_TRACKS, formatDuration } from "@/data/mock-tracks";
import { BpmBadge } from "@/components/bpm-badge";
import * as Haptics from "expo-haptics";

export function ActivityScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activityEnabled, setActivityEnabled] = useState(false);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (activityEnabled) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.sin) }),
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
      {/* Ambient glow */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 280,
          backgroundColor: `${theme.accent}09`,
          borderBottomLeftRadius: 180,
          borderBottomRightRadius: 180,
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 110,
          gap: 16,
        }}
      >
        {/* ── Header ── */}
        <View style={{ gap: 2 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
            Cadence Sync
          </Text>
          <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
            Activity Mode
          </Text>
        </View>

        {/* ── Enable Card ── */}
        <View
          style={{
            backgroundColor: activityEnabled ? `${theme.accent}18` : theme.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: activityEnabled ? `${theme.accent}35` : theme.border,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: activityEnabled ? `${theme.accent}28` : theme.surfaceElevated,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source="sf:figure.walk"
              style={{ width: 22, height: 22, tintColor: activityEnabled ? theme.accent : theme.textMuted }}
              contentFit="contain"
            />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "700" }}>Step Cadence Sync</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Matches BPM to your walking pace</Text>
          </View>
          <Switch
            value={activityEnabled}
            onValueChange={(v) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActivityEnabled(v); }}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#ffffff"
          />
        </View>

        {/* ── Live Metrics ── */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Steps/min */}
          <Animated.View
            style={[
              pulseStyle,
              {
                flex: 1,
                backgroundColor: theme.surface,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: activityEnabled ? `${theme.accent}30` : theme.border,
                padding: 16,
                alignItems: "center",
                gap: 4,
              },
            ]}
          >
            <Image
              source="sf:shoeprints.walk"
              style={{ width: 20, height: 20, tintColor: activityEnabled ? theme.accent : theme.textMuted }}
              contentFit="contain"
            />
            <Text style={{ color: activityEnabled ? theme.accent : theme.textPrimary, fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.stepsPerMinute : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>steps/min</Text>
          </Animated.View>

          {/* Target BPM */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 16,
              alignItems: "center",
              gap: 4,
            }}
          >
            <Image source="sf:music.note" style={{ width: 20, height: 20, tintColor: theme.textMuted }} contentFit="contain" />
            <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.targetBpm : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>target BPM</Text>
          </View>

          {/* Heart rate */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 16,
              alignItems: "center",
              gap: 4,
            }}
          >
            <Image source="sf:heart.fill" style={{ width: 20, height: 20, tintColor: "#ff3366" }} contentFit="contain" />
            <Text style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
              {activityEnabled ? MOCK_ACTIVITY.heartRate : "--"}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 10 }}>bpm HR</Text>
          </View>
        </View>

        {/* ── HR Chart ── */}
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 16,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>Cadence History</Text>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>Last 20 beats</Text>
          </View>

          {/* Bar chart */}
          <View
            style={{
              height: 60,
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 3,
            }}
          >
            {MOCK_HR_CHART.map((v, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: Math.max(4, v * 56),
                  backgroundColor: activityEnabled ? theme.accent : theme.surfaceElevated,
                  borderRadius: 3,
                  opacity: 0.4 + v * 0.6,
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Session Stats ── */}
        {activityEnabled && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            {[
              { label: "Duration", value: formatDuration(MOCK_ACTIVITY.sessionDuration), icon: "sf:timer" },
              { label: "Calories", value: `${MOCK_ACTIVITY.caloriesBurned} kcal`, icon: "sf:flame.fill" },
            ].map((s) => (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: theme.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.border,
                  padding: 14,
                  gap: 6,
                }}
              >
                <Image source={s.icon} style={{ width: 18, height: 18, tintColor: theme.accent }} contentFit="contain" />
                <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "700" }}>{s.value}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 11 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Recommended Tracks ── */}
        <View style={{ gap: 10 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "700" }}>
            Recommended Tracks
          </Text>
          {recommended.map((track) => (
            <Pressable
              key={track.id}
              onPress={() => Haptics.selectionAsync()}
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
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 11,
                  backgroundColor: track.artworkColor,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "60%",
                    height: "60%",
                    backgroundColor: track.artworkColorSecondary,
                    borderTopLeftRadius: 14,
                  }}
                />
                <Image source="sf:music.note" style={{ width: 18, height: 18, tintColor: "rgba(255,255,255,0.8)" }} contentFit="contain" />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>{track.title}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{track.artist}</Text>
              </View>
              <BpmBadge bpm={track.bpm} size="md" />
            </Pressable>
          ))}
        </View>

        {/* ── Privacy notice ── */}
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
          <Image source="sf:lock.shield" style={{ width: 18, height: 18, tintColor: theme.accent, marginTop: 1 }} contentFit="contain" />
          <Text style={{ color: theme.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 }}>
            Step sensor data is processed{" "}
            <Text style={{ color: theme.accent, fontWeight: "700" }}>entirely on-device</Text>
            {" "}and never shared.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

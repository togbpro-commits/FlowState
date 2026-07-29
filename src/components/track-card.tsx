import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useTheme } from "@/theme/theme-context";
import { Track, formatDuration } from "@/data/mock-tracks";
import { BpmBadge } from "./bpm-badge";
import { FormatBadge } from "./format-badge";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

import { MaterialIcons } from "@expo/vector-icons";

interface TrackCardProps {
  track: Track;
  onPress?: () => void;
  onLongPress?: () => void;
  showIndex?: number;
  compact?: boolean;
}

export function TrackCard({
  track,
  onPress,
  onLongPress,
  showIndex,
  compact = false,
}: TrackCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
    opacity.value = withTiming(0.85, { duration: 80 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  }

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        {
          flexDirection: "row",
          alignItems: "center",
          padding: compact ? 10 : 14,
          gap: 12,
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Index */}
      {showIndex !== undefined && (
        <Text
          style={{
            width: 22,
            color: theme.textMuted,
            fontSize: 12,
            fontVariant: ["tabular-nums"],
            textAlign: "center",
          }}
        >
          {showIndex}
        </Text>
      )}

      {/* Artwork gradient */}
      <View
        style={{
          width: compact ? 44 : 52,
          height: compact ? 44 : 52,
          borderRadius: 10,
          borderCurve: "continuous",
          overflow: "hidden",
          flexShrink: 0,
          justifyContent: "center",
          alignItems: "center",
          // Gradient approximation with nested views
          backgroundColor: track.artworkColor,
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "70%",
            height: "70%",
            backgroundColor: track.artworkColorSecondary,
            borderTopLeftRadius: 20,
          }}
        />
        <MaterialIcons
          name="music-note"
          size={24}
          color="#ffffffaa"
        />
      </View>

      {/* Track info */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text
          numberOfLines={1}
          style={{
            color: theme.textPrimary,
            fontSize: compact ? 13 : 15,
            fontWeight: "600",
            letterSpacing: -0.3,
          }}
        >
          {track.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: theme.textSecondary,
            fontSize: compact ? 11 : 12,
          }}
        >
          {track.artist} · {track.genre}
        </Text>
        {!compact && (
          <View style={{ flexDirection: "row", gap: 6, marginTop: 2 }}>
            <BpmBadge bpm={track.bpm} />
            <FormatBadge format={track.format} />
          </View>
        )}
      </View>

      {/* Duration + key */}
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatDuration(track.duration)}
        </Text>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 10,
          }}
        >
          {track.key}
        </Text>
        {compact && <BpmBadge bpm={track.bpm} />}
      </View>
    </AnimatedPressable>
  );
}

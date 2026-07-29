import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import Animated, { Layout, FadeInLeft } from "react-native-reanimated";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MOCK_TRACKS, SortMode, sortTracksByMode, formatDuration } from "@/data/mock-tracks";
import { SequencerSortBar } from "@/components/sequencer-sort-bar";
import { BpmBadge } from "@/components/bpm-badge";
import { FormatBadge } from "@/components/format-badge";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export function QueueScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [sortMode, setSortMode] = useState<SortMode>("smart");

  const sortedTracks = sortTracksByMode(MOCK_TRACKS, sortMode);
  const bpmMin = Math.min(...sortedTracks.map((t) => t.bpm));
  const bpmMax = Math.max(...sortedTracks.map((t) => t.bpm));

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Ambient glow */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 260,
          backgroundColor: `${theme.accent}08`,
          borderBottomLeftRadius: 180,
          borderBottomRightRadius: 180,
        }}
      />

      <FlatList
        data={sortedTracks}
        keyExtractor={(t) => t.id}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 110,
          gap: 10,
        }}
        ListHeaderComponent={
          <View style={{ gap: 16, paddingTop: insets.top + 16, marginBottom: 4 }}>
            {/* Title */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Sequence
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 }}>
                  Smart Queue
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: `${theme.accent}18`,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: `${theme.accent}30`,
                }}
              >
                <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "700" }}>
                  {sortedTracks.length} tracks
                </Text>
              </View>
            </View>

            {/* Sort bar */}
            <SequencerSortBar activeMode={sortMode} onModeChange={(m) => { Haptics.selectionAsync(); setSortMode(m); }} />

            {/* Stats row */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: theme.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                padding: 14,
                gap: 0,
              }}
            >
              {[
                { label: "Tracks", value: String(sortedTracks.length) },
                { label: "BPM Range", value: `${bpmMin}–${bpmMax}` },
                { label: "Mode", value: sortMode.charAt(0).toUpperCase() + sortMode.slice(1) },
              ].map((s, i) => (
                <View key={s.label} style={{ flex: 1, alignItems: "center", borderRightWidth: i < 2 ? 1 : 0, borderColor: theme.border }}>
                  <Text style={{ color: theme.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</Text>
                  <Text style={{ color: i === 2 ? theme.accent : theme.textPrimary, fontSize: 14, fontWeight: "700", marginTop: 3 }}>{s.value}</Text>
                </View>
              ))}
            </View>

            {/* Column headers */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 4 }}>
              <Text style={{ color: theme.textMuted, fontSize: 10, width: 22, textAlign: "center" }}>#</Text>
              <Text style={{ color: theme.textMuted, fontSize: 10, flex: 1 }}>TRACK</Text>
              <Text style={{ color: theme.textMuted, fontSize: 10 }}>BPM / TIME</Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInLeft.delay(index * 25).springify()} layout={Layout.springify()}>
            <Pressable
              onPress={() => Haptics.selectionAsync()}
              onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 12,
                backgroundColor: theme.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              {/* Index */}
              <Text style={{ color: theme.textMuted, fontSize: 12, width: 22, textAlign: "center", fontVariant: ["tabular-nums"] }}>
                {index + 1}
              </Text>

              {/* Artwork */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: item.artworkColor,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "65%",
                    height: "65%",
                    backgroundColor: item.artworkColorSecondary,
                    borderTopLeftRadius: 14,
                  }}
                />
                <MaterialIcons name="music-note" size={20} color="rgba(255,255,255,0.75)" />
              </View>

              {/* Info */}
              <View style={{ flex: 1, gap: 2 }}>
                <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 13, fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={{ color: theme.textSecondary, fontSize: 11 }}>
                  {item.artist}
                </Text>
                <FormatBadge format={item.format} />
              </View>

              {/* Right column */}
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <BpmBadge bpm={item.bpm} />
                <Text style={{ color: theme.textMuted, fontSize: 10, fontVariant: ["tabular-nums"] }}>
                  {formatDuration(item.duration)}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      />
    </View>
  );
}

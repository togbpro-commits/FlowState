import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import Animated, { Layout, FadeInLeft } from "react-native-reanimated";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MOCK_TRACKS, SortMode, sortTracksByMode, formatDuration, Track } from "@/data/mock-tracks";
import { SequencerSortBar } from "@/components/sequencer-sort-bar";
import { BpmBadge } from "@/components/bpm-badge";
import { FormatBadge } from "@/components/format-badge";
import { WaveformBars } from "@/components/waveform-bars";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const ALBUM_COVERS = [
  require("../../../assets/images/albums/neon_nights.png"),
  require("../../../assets/images/albums/golden_hour.png"),
  require("../../../assets/images/albums/eclipse.png"),
  require("../../../assets/images/albums/pulse.png"),
];

const FILTER_TAGS = ["All", "High Energy", "Upbeat (125+ BPM)", "Lossless Only"];

export function QueueScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sortMode, setSortMode] = useState<SortMode>("smart");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  let sortedTracks = sortTracksByMode(MOCK_TRACKS, sortMode);

  if (activeFilter === "High Energy") {
    sortedTracks = sortedTracks.filter((t) => t.energy >= 85);
  } else if (activeFilter === "Upbeat (125+ BPM)") {
    sortedTracks = sortedTracks.filter((t) => t.bpm >= 125);
  } else if (activeFilter === "Lossless Only") {
    sortedTracks = sortedTracks.filter((t) => t.format === "FLAC" || t.format === "WAV");
  }

  if (searchQuery.trim()) {
    sortedTracks = sortedTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const currentHeadTrack = sortedTracks[0] ?? MOCK_TRACKS[0];
  const bpmMin = sortedTracks.length > 0 ? Math.min(...sortedTracks.map((t) => t.bpm)) : 0;
  const bpmMax = sortedTracks.length > 0 ? Math.max(...sortedTracks.map((t) => t.bpm)) : 0;
  const totalDuration = sortedTracks.reduce((acc, t) => acc + t.duration, 0);
  const formattedTotal = `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Ambient glow header */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 300,
          backgroundColor: `${theme.accent}0a`,
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
          <View style={{ gap: 16, paddingTop: insets.top + 14, marginBottom: 4 }}>
            {/* ── Top Bar Header ── */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                  Smart Sequencer
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 }}>
                  Playback Queue
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => { Haptics.selectionAsync(); setShowSearch((s) => !s); }}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: showSearch ? theme.accent : theme.surface,
                    borderWidth: 1, borderColor: showSearch ? theme.accent : theme.border,
                    justifyContent: "center", alignItems: "center",
                  }}
                >
                  <MaterialIcons name="search" size={20} color={showSearch ? "#fff" : theme.textSecondary} />
                </Pressable>
                <Pressable
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(player)"); }}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: `${theme.accent}20`,
                    borderWidth: 1, borderColor: `${theme.accent}40`,
                    justifyContent: "center", alignItems: "center",
                  }}
                >
                  <MaterialIcons name="graphic-eq" size={20} color={theme.accent} />
                </Pressable>
              </View>
            </View>

            {/* Search Input Bar */}
            {showSearch && (
              <View
                style={{
                  backgroundColor: theme.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 14,
                }}
              >
                <MaterialIcons name="search" size={18} color={theme.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Filter queue tracks…"
                  placeholderTextColor={theme.textMuted}
                  style={{ flex: 1, color: theme.textPrimary, paddingVertical: 10, fontSize: 14 }}
                  autoFocus
                />
              </View>
            )}

            {/* ── Hero Next Up Card ── */}
            {currentHeadTrack && (
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/(player)"); }}
              >
                <View
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: `${theme.accent}35`,
                    backgroundColor: theme.surfaceElevated,
                  }}
                >
                  <BlurView tint="dark" intensity={60} style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
                    <Image
                      source={ALBUM_COVERS[0]}
                      style={{ width: 64, height: 64, borderRadius: 14 }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <View style={{ backgroundColor: theme.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>PLAYING NEXT</Text>
                        </View>
                        <BpmBadge bpm={currentHeadTrack.bpm} />
                      </View>
                      <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "800" }}>
                        {currentHeadTrack.title}
                      </Text>
                      <Text numberOfLines={1} style={{ color: theme.textSecondary, fontSize: 12 }}>
                        {currentHeadTrack.artist} · {currentHeadTrack.genre}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center", gap: 6 }}>
                      <WaveformBars barCount={5} height={16} playing color={theme.accent} />
                      <View
                        style={{
                          width: 36, height: 36, borderRadius: 18,
                          backgroundColor: theme.accent,
                          justifyContent: "center", alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="play-arrow" size={22} color="#fff" />
                      </View>
                    </View>
                  </BlurView>
                </View>
              </Pressable>
            )}

            {/* ── Sort & Sequence Selector Bar ── */}
            <SequencerSortBar activeMode={sortMode} onModeChange={(m) => { Haptics.selectionAsync(); setSortMode(m); }} />

            {/* ── Stats Summary Bar ── */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: theme.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                padding: 14,
              }}
            >
              {[
                { label: "Tracks", value: String(sortedTracks.length) },
                { label: "BPM Range", value: `${bpmMin}–${bpmMax}` },
                { label: "Duration", value: formattedTotal },
              ].map((s, i) => (
                <View key={s.label} style={{ flex: 1, alignItems: "center", borderRightWidth: i < 2 ? 1 : 0, borderColor: theme.border }}>
                  <Text style={{ color: theme.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</Text>
                  <Text style={{ color: i === 0 ? theme.accent : theme.textPrimary, fontSize: 14, fontWeight: "700", marginTop: 3 }}>{s.value}</Text>
                </View>
              ))}
            </View>

            {/* ── Filter Tags Strip ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FILTER_TAGS.map((tag) => {
                const active = activeFilter === tag;
                return (
                  <Pressable
                    key={tag}
                    onPress={() => { Haptics.selectionAsync(); setActiveFilter(tag); }}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: active ? `${theme.accent}25` : theme.surface,
                      borderWidth: 1,
                      borderColor: active ? theme.accent : theme.border,
                    }}
                  >
                    <Text style={{ color: active ? theme.accent : theme.textSecondary, fontSize: 12, fontWeight: "600" }}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Column Headers */}
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
              {/* Index / Drag handle */}
              <View style={{ width: 22, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: theme.textMuted, fontSize: 12, fontVariant: ["tabular-nums"] }}>
                  {index + 1}
                </Text>
              </View>

              {/* Artwork Cover */}
              <View style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                <Image
                  source={ALBUM_COVERS[index % ALBUM_COVERS.length]}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>

              {/* Track Info */}
              <View style={{ flex: 1, gap: 2 }}>
                <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 13, fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={{ color: theme.textSecondary, fontSize: 11 }}>
                  {item.artist} · {item.key}
                </Text>
                <View style={{ flexDirection: "row", gap: 4, marginTop: 1 }}>
                  <FormatBadge format={item.format} />
                </View>
              </View>

              {/* Right column: BPM & Duration */}
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <BpmBadge bpm={item.bpm} />
                <Text style={{ color: theme.textMuted, fontSize: 10, fontVariant: ["tabular-nums"] }}>
                  {formatDuration(item.duration)}
                </Text>
              </View>

              {/* Drag reorder icon */}
              <MaterialIcons name="drag-handle" size={18} color={theme.textMuted} style={{ marginLeft: 2 }} />
            </Pressable>
          </Animated.View>
        )}
      />
    </View>
  );
}

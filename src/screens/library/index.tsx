import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MOCK_TRACKS, MOCK_PLAYLISTS, formatDuration, Track } from "@/data/mock-tracks";
import { BpmBadge } from "@/components/bpm-badge";
import { FormatBadge } from "@/components/format-badge";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

const CATEGORIES = ["All", "Pop", "Techno", "Hip-Hop", "Ambient", "House", "D&B"];

const TRENDING_TRACKS = MOCK_TRACKS.slice(0, 6);
const RECENT_TRACKS = [...MOCK_TRACKS].reverse().slice(0, 8);

export function LibraryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = MOCK_TRACKS.filter((t) => {
    const matchCat =
      activeCategory === "All" || t.genre.toLowerCase().includes(activeCategory.toLowerCase());
    const matchQ =
      !query.trim() ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Ambient top glow */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 320,
          backgroundColor: `${theme.accent}0c`,
          borderBottomLeftRadius: 200,
          borderBottomRightRadius: 200,
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + 12 }}>
            {/* ── Header row ── */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Image
                  source={require("../../../assets/images/artist_sofia.png")}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                  contentFit="cover"
                />
                <View>
                  <Text style={{ color: theme.textMuted, fontSize: 12 }}>Good Morning 👋</Text>
                  <Text style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "800" }}>
                    Your Library
                  </Text>
                </View>
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
                  <Image source="sf:magnifyingglass" style={{ width: 16, height: 16, tintColor: showSearch ? "#fff" : theme.textSecondary }} contentFit="contain" />
                </Pressable>
                <Pressable
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: theme.surface,
                    borderWidth: 1, borderColor: theme.border,
                    justifyContent: "center", alignItems: "center",
                  }}
                >
                  <Image source="sf:bell" style={{ width: 16, height: 16, tintColor: theme.textSecondary }} contentFit="contain" />
                </Pressable>
              </View>
            </View>

            {/* ── Search bar ── */}
            {showSearch && (
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <View
                  style={{
                    backgroundColor: theme.surface,
                    borderRadius: 14, borderWidth: 1, borderColor: theme.border,
                    flexDirection: "row", alignItems: "center", paddingHorizontal: 14,
                  }}
                >
                  <Image source="sf:magnifyingglass" style={{ width: 14, height: 14, tintColor: theme.textMuted, marginRight: 8 }} contentFit="contain" />
                  <TextInput
                    value={query} onChangeText={setQuery}
                    placeholder="Search songs, artists…"
                    placeholderTextColor={theme.textMuted}
                    style={{ flex: 1, color: theme.textPrimary, paddingVertical: 12, fontSize: 14 }}
                    autoFocus
                  />
                </View>
              </View>
            )}

            {/* ── Featured / Hero Card ── */}
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/(player)"); }}
              style={{ marginHorizontal: 20, marginBottom: 24 }}
            >
              <View style={{ height: 200, borderRadius: 24, overflow: "hidden", backgroundColor: theme.surfaceElevated }}>
                <Image source={require("../../../assets/images/albums/neon_nights.png")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
                {/* Tags */}
                <View style={{ position: "absolute", top: 14, left: 14, flexDirection: "row", gap: 6 }}>
                  <BlurView tint="dark" intensity={80} style={{ borderRadius: 8, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>🔥 TRENDING</Text>
                  </BlurView>
                </View>
                {/* Track info bottom */}
                <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 }}>
                  <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>Neon Descent</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Circuit Ghost</Text>
                    <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>•</Text>
                    <BpmBadge bpm={128} />
                  </View>
                </View>
                {/* Play button */}
                <View
                  style={{
                    position: "absolute", bottom: 14, right: 14,
                    width: 44, height: 44, borderRadius: 22,
                    backgroundColor: theme.accent,
                    justifyContent: "center", alignItems: "center",
                  }}
                >
                  <Image source="sf:play.fill" style={{ width: 18, height: 18, tintColor: "#fff" }} contentFit="contain" />
                </View>
              </View>
            </Pressable>

            {/* ── Playlists horizontal strip ── */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 14 }}>
                <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "800" }}>Your Playlists</Text>
                <Text style={{ color: theme.accent, fontSize: 13, fontWeight: "600" }}>See All</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
                {MOCK_PLAYLISTS.map((pl) => (
                  <Pressable
                    key={pl.id}
                    onPress={() => { Haptics.selectionAsync(); router.push("/(player)"); }}
                    style={{ width: 130, gap: 8 }}
                  >
                    <View style={{ width: 130, height: 130, borderRadius: 18, overflow: "hidden", backgroundColor: pl.color }}>
                      <Image source={pl.cover} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                      <View style={{ position: "absolute", bottom: 8, right: 8 }}>
                        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 }}>
                          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>{pl.trackCount} songs</Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 13, fontWeight: "700" }}>{pl.name}</Text>
                      <Text style={{ color: theme.textMuted, fontSize: 11 }}>{pl.duration}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* ── Categories ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 16 }}
            >
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => { Haptics.selectionAsync(); setActiveCategory(cat); }}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: active ? theme.accent : theme.surface,
                      borderWidth: 1,
                      borderColor: active ? theme.accent : theme.border,
                    }}
                  >
                    <Text style={{ color: active ? "#fff" : theme.textSecondary, fontSize: 13, fontWeight: "600" }}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* ── Section label ── */}
            <Text style={{ paddingHorizontal: 20, color: theme.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              {activeCategory === "All" ? "All Tracks" : `${activeCategory} Tracks`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
            <TrackRow track={item} onPress={() => { Haptics.selectionAsync(); router.push(`/(library)/track/${item.id}`); }} />
          </View>
        )}
      />
    </View>
  );
}

function TrackRow({ track, onPress }: { track: Track; onPress: () => void }) {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      onPress={onPress}
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
      {/* Artwork */}
      <View style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
        <View style={{ flex: 1, backgroundColor: track.artworkColor, justifyContent: "center", alignItems: "center" }}>
          <View style={{ position: "absolute", bottom: 0, right: 0, width: "60%", height: "60%", backgroundColor: track.artworkColorSecondary, borderTopLeftRadius: 16 }} />
          <Image source="sf:music.note" style={{ width: 22, height: 22, tintColor: "rgba(255,255,255,0.85)" }} contentFit="contain" />
        </View>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 3 }}>
        <Text numberOfLines={1} style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>
          {track.title}
        </Text>
        <Text numberOfLines={1} style={{ color: theme.textSecondary, fontSize: 12 }}>
          {track.artist} · {track.album}
        </Text>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 1 }}>
          <BpmBadge bpm={track.bpm} />
          <FormatBadge format={track.format} />
        </View>
      </View>

      {/* Actions */}
      <View style={{ alignItems: "flex-end", gap: 8 }}>
        <Pressable onPress={() => { Haptics.selectionAsync(); setLiked((l) => !l); }} hitSlop={8}>
          <Image
            source={liked ? "sf:heart.fill" : "sf:heart"}
            style={{ width: 18, height: 18, tintColor: liked ? "#ff3366" : theme.textMuted }}
            contentFit="contain"
          />
        </Pressable>
        <Text style={{ color: theme.textMuted, fontSize: 10, fontVariant: ["tabular-nums"] }}>
          {formatDuration(track.duration)}
        </Text>
      </View>
    </Pressable>
  );
}

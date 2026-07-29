import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/theme/theme-context";
import { MOCK_TRACKS } from "@/data/mock-tracks";
import { BpmBadge } from "@/components/bpm-badge";
import { FormatBadge } from "@/components/format-badge";
import { WaveformBars } from "@/components/waveform-bars";
import { MaterialIcons } from "@expo/vector-icons";

export default function TrackDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const track = MOCK_TRACKS.find((t) => t.id === id) ?? MOCK_TRACKS[0];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 60 }}
    >
      {/* Artwork */}
      <View
        style={{
          height: 160,
          borderRadius: 20,
          borderCurve: "continuous",
          backgroundColor: track.artworkColor,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
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
            borderTopLeftRadius: 60,
          }}
        />
        <WaveformBars barCount={20} height={60} playing color="#ffffffcc" />
      </View>

      {/* Track info */}
      <View style={{ gap: 6 }}>
        <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "700", letterSpacing: -0.5 }}>
          {track.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
          {track.artist} · {track.album}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <BpmBadge bpm={track.bpm} size="md" />
          <FormatBadge format={track.format} />
        </View>
      </View>

      {/* Analysis card */}
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: theme.border,
          padding: 16,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name="analytics" size={20} color={theme.accent} />
          <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "700" }}>
            Audio Analysis
          </Text>
          <View style={{ flex: 1 }} />
          <View
            style={{
              backgroundColor: `${theme.success}22`,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: theme.success, fontSize: 10, fontWeight: "700" }}>
              ✓ ANALYZED
            </Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <AnalysisRow label="BPM" value={`${track.bpm}`} theme={theme} />
          <AnalysisRow label="Key" value={track.key} theme={theme} />
          <AnalysisRow label="Genre" value={track.genre} theme={theme} />
          <AnalysisRow label="Energy" value={`${track.energy}%`} theme={theme} barValue={track.energy / 100} />
          <AnalysisRow label="Danceability" value={`${track.danceability}%`} theme={theme} barValue={track.danceability / 100} />
        </View>
      </View>
    </ScrollView>
  );
}

function AnalysisRow({
  label,
  value,
  theme,
  barValue,
}: {
  label: string;
  value: string;
  theme: any;
  barValue?: number;
}) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: theme.textMuted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: "600" }}>{value}</Text>
      </View>
      {barValue !== undefined && (
        <View style={{ height: 3, backgroundColor: theme.surfaceElevated, borderRadius: 2 }}>
          <View
            style={{
              width: `${barValue * 100}%`,
              height: "100%",
              backgroundColor: theme.accent,
              borderRadius: 2,
            }}
          />
        </View>
      )}
    </View>
  );
}

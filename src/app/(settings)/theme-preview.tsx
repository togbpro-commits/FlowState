import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/theme/theme-context";
import { ALL_THEME_NAMES, THEMES } from "@/theme/colors";
import { ThemeCard } from "@/components/theme-card";
import { WaveformBars } from "@/components/waveform-bars";
import * as Haptics from "expo-haptics";

export default function ThemePreviewRoute() {
  const { theme, themeName, setTheme } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 60 }}
    >
      <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 20 }}>
        Each theme applies a complete color palette across all screens, including
        gesture trails and haptic feedback colors.
      </Text>

      {ALL_THEME_NAMES.map((name) => {
        const t = THEMES[name];
        const isActive = themeName === name;
        return (
          <View
            key={name}
            style={{
              borderRadius: 20,
              borderCurve: "continuous",
              overflow: "hidden",
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? t.accent : t.border,
            }}
          >
            {/* Preview header */}
            <View
              style={{
                backgroundColor: t.bg,
                padding: 16,
                gap: 12,
              }}
            >
              {/* Fake nav bar */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: t.textPrimary, fontSize: 17, fontWeight: "700" }}>
                  {t.label}
                </Text>
                {isActive && (
                  <View
                    style={{
                      backgroundColor: `${t.accent}22`,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: t.accent, fontSize: 11, fontWeight: "700" }}>ACTIVE</Text>
                  </View>
                )}
              </View>

              {/* Fake player card */}
              <View
                style={{
                  backgroundColor: t.surface,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: t.accent,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.8,
                  }}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ height: 8, width: "70%", backgroundColor: t.textPrimary, borderRadius: 4, opacity: 0.8 }} />
                  <View style={{ height: 6, width: "45%", backgroundColor: t.textMuted, borderRadius: 3 }} />
                </View>
                <WaveformBars barCount={8} height={24} playing color={t.waveform} />
              </View>

              {/* Gradient bar */}
              <View
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: t.accent,
                  width: "100%",
                  opacity: 0.7,
                }}
              />

              {/* Color swatches */}
              <View style={{ flexDirection: "row", gap: 6 }}>
                {[t.accent, t.accentSecondary, t.waveform, t.surface, t.surfaceElevated, t.textMuted].map(
                  (color, i) => (
                    <View
                      key={i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: color,
                        borderWidth: 1,
                        borderColor: t.border,
                      }}
                    />
                  ),
                )}
              </View>
            </View>

            {/* Apply button */}
            <View
              style={{
                backgroundColor: isActive ? `${t.accent}22` : t.surface,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: isActive ? t.accent : t.textSecondary,
                  fontSize: 14,
                  fontWeight: "700",
                  textAlign: "center",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setTheme(name);
                }}
              >
                {isActive ? "✓ Applied" : `Apply ${t.label}`}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

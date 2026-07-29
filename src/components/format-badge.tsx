import React from "react";
import { Text, View } from "react-native";
import { AudioFormat, FORMAT_COLORS } from "@/data/mock-tracks";
import { useTheme } from "@/theme/theme-context";

interface FormatBadgeProps {
  format: AudioFormat;
}

export function FormatBadge({ format }: FormatBadgeProps) {
  const { theme } = useTheme();
  const colors = FORMAT_COLORS[format];

  return (
    <View
      style={{
        backgroundColor: colors.lossless ? theme.losslessBg : "#ffffff12",
        borderRadius: 6,
        borderCurve: "continuous",
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
      }}
    >
      {colors.lossless && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.text,
          }}
        />
      )}
      <Text
        style={{
          color: colors.lossless ? theme.losslessText : theme.textMuted,
          fontSize: 9,
          fontWeight: "700",
          letterSpacing: 0.5,
        }}
      >
        {format}
      </Text>
    </View>
  );
}

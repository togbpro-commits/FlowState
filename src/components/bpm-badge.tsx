import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme/theme-context";

interface BpmBadgeProps {
  bpm: number;
  size?: "sm" | "md";
}

export function BpmBadge({ bpm, size = "sm" }: BpmBadgeProps) {
  const { theme } = useTheme();
  const isLarge = size === "md";

  return (
    <View
      style={{
        backgroundColor: theme.bpmBg,
        borderRadius: isLarge ? 10 : 6,
        borderCurve: "continuous",
        paddingHorizontal: isLarge ? 10 : 6,
        paddingVertical: isLarge ? 4 : 2,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: theme.bpmText,
          fontSize: isLarge ? 15 : 10,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
          letterSpacing: -0.5,
        }}
      >
        {bpm}
      </Text>
      <Text
        style={{
          color: theme.bpmText,
          fontSize: isLarge ? 10 : 8,
          fontWeight: "500",
          opacity: 0.75,
        }}
      >
        BPM
      </Text>
    </View>
  );
}

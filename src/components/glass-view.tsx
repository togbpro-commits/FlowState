import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";

interface GlassViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: "light" | "dark" | "default" | "systemMaterial" | "systemThinMaterial" | "systemUltraThinMaterial";
  isInteractive?: boolean;
  borderHighlight?: boolean;
}

export function AdaptiveGlassView({
  children,
  style,
  intensity = 80,
  tint = "dark",
  borderHighlight = true,
}: GlassViewProps) {
  const containerStyle: ViewStyle = {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: borderHighlight ? 1 : 0,
    borderColor: "rgba(255, 255, 255, 0.18)",
  };

  return (
    <View style={[containerStyle, { backgroundColor: "rgba(18, 18, 28, 0.65)" }, style]}>
      <BlurView
        tint={tint}
        intensity={intensity}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {children}
    </View>
  );
}

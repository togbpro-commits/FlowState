import React from "react";
import { View, ViewStyle, StyleProp, Platform } from "react-native";
import { BlurView } from "expo-blur";

// Safely resolve expo-glass-effect to prevent fatal startup crash in standard Expo Go
let GlassView: any = View;
let isLiquidGlassAvailable = () => false;

try {
  const GlassEffect = require("expo-glass-effect");
  GlassView = GlassEffect.GlassView;
  isLiquidGlassAvailable = GlassEffect.isLiquidGlassAvailable;
} catch (error) {
  // Native module is not available in standard Expo Go
}

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
  isInteractive = false,
  borderHighlight = true,
}: GlassViewProps) {
  const containerStyle: ViewStyle = {
    borderRadius: 24,
    borderCurve: "continuous",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
    borderWidth: borderHighlight ? 1 : 0,
    borderColor: "rgba(255, 255, 255, 0.18)",
  };

  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <GlassView isInteractive={isInteractive} style={[containerStyle, style]}>
        {children}
      </GlassView>
    );
  }

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

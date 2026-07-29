import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemeName, ThemeColors, THEMES } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";

interface ThemeCardProps {
  themeName: ThemeName;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ThemeCard({ themeName, isSelected, onPress }: ThemeCardProps) {
  const theme: ThemeColors = THEMES[themeName];
  const scale = useSharedValue(1);
  const ringOpacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    ringOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 20, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
    >
      <AnimatedView style={animatedStyle}>
        {/* Active Selection Glow Ring */}
        <AnimatedView
          style={[
            ringStyle,
            {
              position: "absolute",
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              borderRadius: 21,
              borderWidth: 2,
              borderColor: theme.accent,
              zIndex: 10,
            },
          ]}
        />

        {/* Theme Card Container */}
        <View
          style={{
            width: 140,
            height: 120,
            backgroundColor: theme.bg,
            borderRadius: 18,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: isSelected ? theme.accent : theme.border,
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          {/* Mini UI Header Preview */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text
                style={{
                  color: theme.textPrimary,
                  fontSize: 12,
                  fontWeight: "800",
                }}
              >
                {theme.label}
              </Text>
              {isSelected ? (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: theme.accent,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="check" size={12} color="#fff" />
                </View>
              ) : (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.textMuted,
                    opacity: 0.4,
                  }}
                />
              )}
            </View>

            {/* Mock Waveform / Equalizer */}
            <View style={{ height: 26, backgroundColor: theme.surface, borderRadius: 8, paddingHorizontal: 6, justifyContent: "center" }}>
              <View style={{ flexDirection: "row", gap: 3, alignItems: "flex-end", height: 16 }}>
                {[0.4, 0.9, 0.6, 1.0, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4].map((h, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      height: h * 16,
                      borderRadius: 1.5,
                      backgroundColor: theme.waveform,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Color Swatch Dots */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {[theme.bg, theme.surface, theme.accent, theme.textPrimary].map((color, i) => (
                <View
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: color,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </View>
            <Text style={{ color: theme.accent, fontSize: 9, fontWeight: "800", textTransform: "uppercase" }}>
              {themeName === "high-contrast" ? "OLED" : "PRO"}
            </Text>
          </View>
        </View>
      </AnimatedView>
    </Pressable>
  );
}

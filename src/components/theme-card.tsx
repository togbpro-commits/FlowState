import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemeName, ThemeColors, THEMES } from "@/theme/colors";

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
        {/* Selection ring */}
        <AnimatedView
          style={[
            ringStyle,
            {
              position: "absolute",
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              borderRadius: 19,
              borderCurve: "continuous",
              borderWidth: 2,
              borderColor: theme.accent,
              zIndex: 10,
            },
          ]}
        />

        {/* Card */}
        <View
          style={{
            width: 110,
            backgroundColor: theme.bg,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          {/* Mini preview header */}
          <View
            style={{
              height: 56,
              backgroundColor: theme.surface,
              padding: 8,
              gap: 6,
            }}
          >
            {/* Gradient accent strip */}
            <View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.accent,
                width: "60%",
              }}
            />
            {/* Mock bars */}
            <View style={{ flexDirection: "row", gap: 3, alignItems: "flex-end", height: 20 }}>
              {[0.6, 1.0, 0.7, 0.4, 0.8, 0.5, 0.9].map((h, i) => (
                <View
                  key={i}
                  style={{
                    width: 4,
                    height: h * 18,
                    borderRadius: 2,
                    backgroundColor: theme.waveform,
                    opacity: 0.7,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Label */}
          <View
            style={{
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: theme.textPrimary,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {theme.label}
            </Text>
            {isSelected && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.accent,
                }}
              />
            )}
          </View>
        </View>
      </AnimatedView>
    </Pressable>
  );
}

import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/theme/theme-context";
import { TransitionType, TRANSITION_TYPES } from "@/data/mock-tracks";
import { Image } from "expo-image";

interface TransitionIndicatorProps {
  activeType: TransitionType;
  onSelect?: (type: TransitionType) => void;
}

export function TransitionIndicator({
  activeType,
  onSelect,
}: TransitionIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: 16,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.border,
        padding: 12,
        gap: 8,
      }}
    >
      <Text
        style={{
          color: theme.textMuted,
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        Transition Mode
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {TRANSITION_TYPES.map((t) => {
          const isActive = t.id === activeType;
          return (
            <TransitionPill
              key={t.id}
              label={t.label}
              icon={t.icon}
              description={t.description}
              isActive={isActive}
              accent={theme.accent}
              bg={theme.surface}
              surfaceElevated={theme.surfaceElevated}
              textPrimary={theme.textPrimary}
              textMuted={theme.textMuted}
              border={theme.border}
              onPress={() => onSelect?.(t.id as TransitionType)}
            />
          );
        })}
      </View>
    </View>
  );
}

function TransitionPill({
  label,
  icon,
  description,
  isActive,
  accent,
  bg,
  surfaceElevated,
  textPrimary,
  textMuted,
  border,
  onPress,
}: {
  label: string;
  icon: string;
  description: string;
  isActive: boolean;
  accent: string;
  bg: string;
  surfaceElevated: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: isActive ? `${accent}22` : surfaceElevated,
            borderRadius: 12,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: isActive ? accent : border,
            padding: 10,
            gap: 4,
            alignItems: "center",
          },
        ]}
      >
        <Image
          source={`sf:${icon}`}
          style={{ width: 18, height: 18, tintColor: isActive ? accent : textMuted }}
          contentFit="contain"
        />
        <Text
          style={{
            color: isActive ? accent : textPrimary,
            fontSize: 11,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: textMuted,
            fontSize: 9,
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

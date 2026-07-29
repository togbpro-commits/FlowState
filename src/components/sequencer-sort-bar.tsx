import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme/theme-context";
import { SortMode, SORT_MODES } from "@/data/mock-tracks";
import { MaterialIcons } from "@expo/vector-icons";

interface SequencerSortBarProps {
  activeMode: SortMode;
  onModeChange: (mode: SortMode) => void;
}

export function SequencerSortBar({
  activeMode,
  onModeChange,
}: SequencerSortBarProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          color: theme.textMuted,
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          paddingHorizontal: 2,
        }}
      >
        Intelligent Sequencing
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {SORT_MODES.map((item) => (
          <SortPill
            key={item.mode}
            label={item.label}
            icon={item.icon}
            isActive={activeMode === item.mode}
            accent={theme.accent}
            surfaceElevated={theme.surfaceElevated}
            textPrimary={theme.textPrimary}
            textMuted={theme.textMuted}
            border={theme.border}
            onPress={() => onModeChange(item.mode)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function SortPill({
  label,
  icon,
  isActive,
  accent,
  surfaceElevated,
  textPrimary,
  textMuted,
  border,
  onPress,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  accent: string;
  surfaceElevated: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    bgOpacity.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.93); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: isActive ? `${accent}28` : surfaceElevated,
            borderRadius: 20,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: isActive ? accent : border,
            paddingHorizontal: 14,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          },
        ]}
      >
        <MaterialIcons
          name={icon as any}
          size={16}
          color={isActive ? accent : textMuted}
        />
        <Text
          style={{
            color: isActive ? accent : textPrimary,
            fontSize: 13,
            fontWeight: isActive ? "700" : "500",
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

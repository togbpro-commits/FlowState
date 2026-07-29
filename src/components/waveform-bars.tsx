import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/theme/theme-context";

interface WaveformBarsProps {
  barCount?: number;
  height?: number;
  playing?: boolean;
  color?: string;
}

export function WaveformBars({
  barCount = 12,
  height = 32,
  playing = true,
  color,
}: WaveformBarsProps) {
  const { theme } = useTheme();
  const barColor = color ?? theme.waveform;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 3,
        height,
      }}
    >
      {Array.from({ length: barCount }, (_, i) => (
        <WaveformBar
          key={i}
          index={i}
          maxHeight={height}
          color={barColor}
          playing={playing}
        />
      ))}
    </View>
  );
}

function WaveformBar({
  index,
  maxHeight,
  color,
  playing,
}: {
  index: number;
  maxHeight: number;
  color: string;
  playing: boolean;
}) {
  const heightVal = useSharedValue(0.15 + Math.random() * 0.35);
  const speed = 600 + index * 80 + Math.random() * 200;

  useEffect(() => {
    if (playing) {
      const minH = 0.1 + Math.random() * 0.15;
      const maxH = 0.5 + Math.random() * 0.5;
      heightVal.value = withRepeat(
        withSequence(
          withTiming(maxH, { duration: speed, easing: Easing.inOut(Easing.sin) }),
          withTiming(minH, { duration: speed, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else {
      heightVal.value = withTiming(0.15, { duration: 400 });
    }
  }, [playing]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightVal.value * maxHeight,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 3,
          borderRadius: 2,
          backgroundColor: color,
          opacity: 0.85,
        },
      ]}
    />
  );
}

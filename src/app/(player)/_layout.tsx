import { Stack } from "expo-router/stack";
import { useTheme } from "@/theme/theme-context";

export default function PlayerLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

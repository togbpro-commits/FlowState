import { Stack } from "expo-router/stack";
import { useTheme } from "@/theme/theme-context";

export default function SettingsLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="theme-preview"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

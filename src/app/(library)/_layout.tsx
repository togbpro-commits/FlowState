import { Stack } from "expo-router/stack";
import { useTheme } from "@/theme/theme-context";

export default function LibraryLayout() {
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
        name="track/[id]"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.6, 1.0],
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}

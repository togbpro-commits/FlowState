import { Tabs } from "expo-router";
import {
  ThemeProvider,
  DarkTheme,
} from "expo-router/react-navigation";
import {
  View,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider as AppThemeProvider, useTheme } from "@/theme/theme-context";
import { Stack } from "expo-router/stack";
import { useEffect, useState, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";

// Inline type for the custom tabBar render prop
type TabBarProps = {
  state: { routes: Array<{ key: string; name: string }>; index: number };
  navigation: { emit: (e: any) => any; navigate: (name: any) => void };
};

export const OnboardingContext = createContext<{
  setHasOnboarded: (value: boolean) => void;
} | null>(null);

const TAB_DEFS = [
  { name: "(library)",  icon: "library-music" as const },
  { name: "(player)",   icon: "graphic-eq" as const },
  { name: "(queue)",    icon: "queue-music" as const },
  { name: "(activity)", icon: "directions-walk" as const },
  { name: "(settings)", icon: "settings" as const },
] as const;

// ─── Custom pill tab bar ─────────────────────────────────────────────────────

function FlowStateTabBar({ state, navigation }: TabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const PILL_HEIGHT = 62;
  const PILL_BOTTOM = Math.max(insets.bottom, 8) + 10;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: PILL_BOTTOM,
        left: 20,
        right: 20,
        height: PILL_HEIGHT,
        zIndex: 100,
      }}
    >
      <BlurView
        tint="dark"
        intensity={90}
        style={{
          flex: 1,
          borderRadius: PILL_HEIGHT / 2,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          backgroundColor: "rgba(8,8,18,0.55)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: 8,
        }}
      >
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          // Skip the "welcome" route
          if (route.name === "welcome") return null;

          const def = TAB_DEFS.find((d) => d.name === route.name);
          if (!def) return null;

          const isFocused = state.index === index;
          const tint = isFocused ? theme.accent : "rgba(255,255,255,0.38)";

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name as any);
                }
              }}
              style={{
                flex: 1,
                height: PILL_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: isFocused ? `${theme.accent}28` : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name={def.icon}
                  size={24}
                  color={tint}
                />
              </View>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

// ─── Root layout ─────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("hasOnboarded")
      .then((v) => setHasOnboarded(v === "true"))
      .catch(() => setHasOnboarded(false));
  }, []);

  if (hasOnboarded === null) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingContext.Provider value={{ setHasOnboarded }}>
        <AppThemeProvider>
          <ThemeProvider value={DarkTheme}>
            {hasOnboarded ? (
              <AppTabs />
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="welcome" />
              </Stack>
            )}
          </ThemeProvider>
        </AppThemeProvider>
      </OnboardingContext.Provider>
    </GestureHandlerRootView>
  );
}

function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <FlowStateTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="(library)" />
      <Tabs.Screen name="(player)" />
      <Tabs.Screen name="(queue)" />
      <Tabs.Screen name="(activity)" />
      <Tabs.Screen name="(settings)" />
      <Tabs.Screen name="welcome" options={{ href: null }} />
    </Tabs>
  );
}

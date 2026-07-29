import React, { useContext } from "react";
import { View, Text, ScrollView, Switch, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { ALL_THEME_NAMES, THEMES } from "@/theme/colors";
import { ThemeCard } from "@/components/theme-card";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingContext } from "@/app/_layout";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

// ── Music player settings ──────────────────────────────────────────────────

const PLAYBACK_SETTINGS = [
  { icon: "graphic-eq" as const,            title: "High Quality Streaming",  desc: "Stream in lossless quality when on Wi-Fi",         defaultOn: true },
  { icon: "cloud-download" as const,        title: "Auto-Download",           desc: "Download liked tracks automatically",              defaultOn: false },
  { icon: "tune" as const,                  title: "Crossfade Transitions",   desc: "Blend between tracks with smart BPM matching",     defaultOn: true },
  { icon: "bedtime" as const,               title: "Sleep Timer",              desc: "Automatically stop playback after a set time",     defaultOn: false },
];

const AUDIO_SETTINGS = [
  { icon: "speed" as const,                 title: "BPM Auto-Detection",  desc: "Analyse BPM from your imported audio files",  defaultOn: true },
  { icon: "piano" as const,                 title: "Key Detection",        desc: "Camelot wheel compatible musical key tagging", defaultOn: true },
  { icon: "category" as const,              title: "Genre AI Tagging",     desc: "Smart genre classification from audio",        defaultOn: false },
  { icon: "bar-chart" as const,             title: "Energy Analysis",      desc: "Detect track energy & danceability score",      defaultOn: true },
];

const SOCIAL_SETTINGS = [
  { icon: "share" as const,                 title: "Share Listening Activity", desc: "Let friends see what you're playing",            defaultOn: false },
  { icon: "people" as const,                title: "Friend Suggestions",       desc: "Get playlist suggestions from friends' taste",    defaultOn: true },
];

function SectionHeader({ title, theme }: { title: string; theme: any }) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 10 }}>
      <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </Text>
    </View>
  );
}

function ToggleRow({
  icon, title, desc, defaultOn, theme, danger,
}: {
  icon: string; title: string; desc: string; defaultOn: boolean; theme: any; danger?: boolean;
}) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <Pressable
      style={{
        flexDirection: "row", alignItems: "center", gap: 12,
        padding: 14, backgroundColor: theme.surface,
        borderRadius: 16, borderWidth: 1, borderColor: theme.border,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 38, height: 38, borderRadius: 10,
          backgroundColor: danger ? "#ff336622" : `${theme.accent}18`,
          justifyContent: "center", alignItems: "center",
        }}
      >
        <MaterialIcons name={icon as any} size={20} color={danger ? "#ff3366" : theme.accent} />
      </View>
      <View style={{ flex: 1, gap: 1 }}>
        <Text style={{ color: danger ? "#ff3366" : theme.textPrimary, fontSize: 14, fontWeight: "600" }}>{title}</Text>
        <Text style={{ color: theme.textMuted, fontSize: 11 }}>{desc}</Text>
      </View>
      <Switch
        value={on}
        onValueChange={(v) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setOn(v); }}
        trackColor={{ false: theme.border, true: theme.accent }}
        thumbColor="#ffffff"
      />
    </Pressable>
  );
}

export function SettingsScreen() {
  const { theme, themeName, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const onboarding = useContext(OnboardingContext);
  const router = useRouter();

  async function handleLogout() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your local library will be preserved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("hasOnboarded");
            onboarding?.setHasOnboarded(false);
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 110,
      }}
    >
      {/* Ambient glow */}
      <View
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 250,
          backgroundColor: `${theme.accent}08`,
          borderBottomLeftRadius: 160, borderBottomRightRadius: 160,
        }}
      />

      {/* ── Profile card ── */}
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: theme.surface, borderRadius: 24,
            borderWidth: 1, borderColor: theme.border, padding: 18,
            flexDirection: "row", alignItems: "center", gap: 14,
          }}
        >
          <Image
            source={require("../../../assets/images/artist_sofia.png")}
            style={{ width: 60, height: 60, borderRadius: 30 }}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "800" }}>Adrian Alex</Text>
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>@adrianalex · Midnight Plan</Text>
            <View style={{ flexDirection: "row", gap: 14, marginTop: 8 }}>
              {[{ v: "412", l: "Songs" }, { v: "28", l: "Playlists" }, { v: "1.2K", l: "Following" }].map((s) => (
                <View key={s.l}>
                  <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "700" }}>{s.v}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 10 }}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(settings)/edit-profile");
            }}
            style={{
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
              backgroundColor: `${theme.accent}20`, borderWidth: 1, borderColor: `${theme.accent}40`,
            }}
          >
            <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "700" }}>Edit</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Themes / Appearance ── */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 20 }}>
        <SectionHeader title="Appearance & Themes" theme={theme} />
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/(settings)/theme-preview");
          }}
          style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 12 }}
        >
          <Text style={{ color: theme.accent, fontSize: 12, fontWeight: "700" }}>Studio Preview</Text>
          <MaterialIcons name="chevron-right" size={16} color={theme.accent} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}>
        {ALL_THEME_NAMES.map((name) => (
          <ThemeCard
            key={name}
            themeName={name}
            isSelected={themeName === name}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTheme(name); }}
          />
        ))}
      </ScrollView>

      {/* ── Playback ── */}
      <SectionHeader title="Playback" theme={theme} />
      <View style={{ paddingHorizontal: 20 }}>
        {PLAYBACK_SETTINGS.map((s) => <ToggleRow key={s.title} {...s} theme={theme} />)}
      </View>

      {/* ── Audio Intelligence ── */}
      <SectionHeader title="Audio Intelligence" theme={theme} />
      <View style={{ paddingHorizontal: 20 }}>
        {AUDIO_SETTINGS.map((s) => <ToggleRow key={s.title} {...s} theme={theme} />)}
        <View
          style={{
            backgroundColor: `${theme.accent}10`, borderRadius: 14,
            borderWidth: 1, borderColor: `${theme.accent}25`,
            padding: 12, flexDirection: "row", gap: 10, alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <MaterialIcons name="security" size={18} color={theme.accent} style={{ marginTop: 1 }} />
          <Text style={{ color: theme.textSecondary, fontSize: 12, flex: 1, lineHeight: 18 }}>
            All audio analysis runs{" "}
            <Text style={{ color: theme.accent, fontWeight: "700" }}>entirely on-device</Text>
            {" "}— your music never leaves your phone.
          </Text>
        </View>
      </View>

      {/* ── Social ── */}
      <SectionHeader title="Social" theme={theme} />
      <View style={{ paddingHorizontal: 20 }}>
        {SOCIAL_SETTINGS.map((s) => <ToggleRow key={s.title} {...s} theme={theme} />)}
      </View>

      {/* ── About ── */}
      <SectionHeader title="About" theme={theme} />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        {[
          { icon: "help-outline" as const, label: "Help & Support" },
          { icon: "description" as const,  label: "Terms of Service" },
          { icon: "privacy-tip" as const,  label: "Privacy Policy" },
          { icon: "star-outline" as const, label: "Rate FlowState" },
        ].map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 12,
              padding: 14, backgroundColor: theme.surface,
              borderRadius: 16, borderWidth: 1, borderColor: theme.border,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <MaterialIcons name={item.icon} size={20} color={theme.textMuted} />
            <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "500", flex: 1 }}>{item.label}</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
          </Pressable>
        ))}

        {/* Version */}
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>FlowState v1.0.0 · Expo SDK 57</Text>
        </View>
      </View>

      {/* ── Sign Out ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
            padding: 16, backgroundColor: "#ff333615",
            borderRadius: 16, borderWidth: 1, borderColor: "#ff333635",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <MaterialIcons name="logout" size={20} color="#ff3336" />
          <Text style={{ color: "#ff3336", fontSize: 15, fontWeight: "700" }}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

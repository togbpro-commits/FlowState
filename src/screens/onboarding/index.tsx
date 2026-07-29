import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/theme/theme-context";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingContext } from "@/app/_layout";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const SOCIAL_BUTTONS = [
  {
    id: "google",
    label: "Continue with Google",
    color: "#fff",
    textColor: "#111",
    icon: "🇬",
    emoji: "G",
  },
  {
    id: "apple",
    label: "Continue with Apple",
    color: "#111",
    textColor: "#fff",
    icon: "🍎",
    emoji: "",
  },
  {
    id: "spotify",
    label: "Continue with Spotify",
    color: "#1DB954",
    textColor: "#fff",
    icon: "♪",
    emoji: "♫",
  },
];

const FEATURED_STATS = [
  { label: "Songs", value: "80M+" },
  { label: "Artists", value: "5M+" },
  { label: "Users", value: "200M" },
];

export function OnboardingScreen() {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const onboarding = useContext(OnboardingContext);
  const [step, setStep] = useState<"hero" | "auth">("hero");

  async function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem("hasOnboarded", "true");
    onboarding?.setHasOnboarded(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Full-bleed hero image */}
      <Image
        source={require("../../../assets/images/onboarding_hero.png")}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentFit="cover"
      />

      {/* Multi-stop gradient overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />
      {/* Strong bottom gradient */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.65,
          backgroundColor: "rgba(0,0,0,0.82)",
        }}
      />

      {/* App logo top */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 16,
          left: 28,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="graphic-eq" size={22} color="#fff" />
        </View>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: -0.5 }}>
          FlowState
        </Text>
      </View>

      {/* Bottom content */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 28,
          paddingBottom: insets.bottom + 24,
          gap: 0,
        }}
      >
        {step === "hero" ? (
          <HeroStep
            onGetStarted={() => { Haptics.selectionAsync(); setStep("auth"); }}
            onSkip={handleContinue}
            stats={FEATURED_STATS}
            theme={theme}
          />
        ) : (
          <AuthStep
            onBack={() => { Haptics.selectionAsync(); setStep("hero"); }}
            onSocialAuth={handleContinue}
            onEmail={handleContinue}
            theme={theme}
          />
        )}
      </View>
    </View>
  );
}

function HeroStep({
  onGetStarted,
  onSkip,
  stats,
  theme,
}: {
  onGetStarted: () => void;
  onSkip: () => void;
  stats: typeof FEATURED_STATS;
  theme: any;
}) {
  return (
    <View style={{ gap: 22 }}>
      {/* Stats row */}
      <View style={{ flexDirection: "row", gap: 24, marginBottom: 4 }}>
        {stats.map((s) => (
          <View key={s.label}>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{s.value}</Text>
            <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Headline */}
      <View style={{ gap: 8 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 42,
            fontWeight: "800",
            letterSpacing: -1.5,
            lineHeight: 48,
          }}
        >
          Enjoy your{"\n"}favorite{"\n"}
          <Text style={{ color: theme.accent }}>music.</Text>
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 22 }}>
          Smart BPM sequencing, seamless transitions, and activity-aware playback — all on-device.
        </Text>
      </View>

      {/* Primary CTA */}
      <Pressable
        onPress={onGetStarted}
        style={({ pressed }) => ({
          backgroundColor: theme.accent,
          borderRadius: 30,
          paddingVertical: 17,
          alignItems: "center",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: -0.3 }}>
          Get Started — It's Free
        </Text>
      </Pressable>

      {/* Secondary */}
      <Pressable onPress={onSkip} style={{ alignItems: "center", paddingVertical: 4 }}>
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          Continue as Guest
        </Text>
      </Pressable>

      <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", lineHeight: 14 }}>
        By continuing, you agree to our{" "}
        <Text style={{ color: "rgba(255,255,255,0.5)" }}>Terms of Service</Text>
        {" "}and{" "}
        <Text style={{ color: "rgba(255,255,255,0.5)" }}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

function AuthStep({
  onBack,
  onSocialAuth,
  onEmail,
  theme,
}: {
  onBack: () => void;
  onSocialAuth: (id: string) => void;
  onEmail: () => void;
  theme: any;
}) {
  return (
    <View style={{ gap: 16 }}>
      {/* Back */}
      <Pressable onPress={onBack} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <MaterialIcons name="chevron-left" size={20} color="rgba(255,255,255,0.5)" />
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Back</Text>
      </Pressable>

      {/* Title */}
      <View style={{ marginBottom: 4 }}>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: -0.8 }}>
          Join FlowState
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 4 }}>
          Connect your account for personalized recommendations & sync across devices.
        </Text>
      </View>

      {/* Social auth buttons */}
      {SOCIAL_BUTTONS.map((btn) => (
        <Pressable
          key={btn.id}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSocialAuth(btn.id); }}
          style={({ pressed }) => ({
            backgroundColor: btn.color,
            borderRadius: 16,
            paddingVertical: 15,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            borderWidth: btn.id === "google" ? 1 : 0,
            borderColor: "rgba(255,255,255,0.15)",
          })}
        >
          {/* Icon placeholder */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: "rgba(0,0,0,0.12)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: btn.textColor, fontSize: 14, fontWeight: "800" }}>
              {btn.emoji}
            </Text>
          </View>
          <Text style={{ color: btn.textColor, fontSize: 15, fontWeight: "600", flex: 1 }}>
            {btn.label}
          </Text>
          <MaterialIcons name="chevron-right" size={20} color={btn.textColor + "88"} />
        </Pressable>
      ))}

      {/* Divider */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 2 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" }} />
        <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" }} />
      </View>

      {/* Email */}
      <Pressable
        onPress={onEmail}
        style={({ pressed }) => ({
          borderRadius: 16,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
      >
        <MaterialIcons name="email" size={20} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>Continue with Email</Text>
      </Pressable>

      <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center" }}>
        We'll never post to social media without your permission.
      </Text>
    </View>
  );
}

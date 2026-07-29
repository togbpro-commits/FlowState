import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

const GENRES = ["Techno", "House", "Pop", "Synthwave", "Ambient", "Drum & Bass", "Hip-Hop", "Trance"];

export function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("Adrian Alex");
  const [username, setUsername] = useState("adrianalex");
  const [bio, setBio] = useState("DJ & Electronic Producer. Crafting high-energy sets & smooth transitions.");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Techno", "House", "Synthwave"]);
  const [isSaving, setIsSaving] = useState(false);

  function toggleGenre(genre: string) {
    Haptics.selectionAsync();
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  }

  function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Profile Updated", "Your profile changes have been saved successfully.");
      router.back();
    }, 400);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Top Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        <Pressable
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={{ padding: 4 }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: "600" }}>Cancel</Text>
        </Pressable>
        <Text style={{ color: theme.textPrimary, fontSize: 17, fontWeight: "800" }}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: theme.accent,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          gap: 20,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Avatar Photo Picker Section */}
        <View style={{ alignItems: "center", gap: 12 }}>
          <View style={{ position: "relative" }}>
            <Image
              source={require("../../../assets/images/artist_sofia.png")}
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: theme.accent }}
              contentFit="cover"
            />
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: theme.accent,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: theme.bg,
              }}
            >
              <MaterialIcons name="photo-camera" size={18} color="#fff" />
            </Pressable>
          </View>
          <Text style={{ color: theme.accent, fontSize: 14, fontWeight: "600" }}>Change Profile Photo</Text>
        </View>

        {/* Input Fields */}
        <View style={{ gap: 14 }}>
          {/* Display Name */}
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
              Display Name
            </Text>
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "600" }}
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Handle / Username */}
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
              Username
            </Text>
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 14,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: "600", marginRight: 2 }}>@</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={{ flex: 1, color: theme.textPrimary, fontSize: 15, fontWeight: "600" }}
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bio */}
          <View style={{ gap: 6 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
              Bio
            </Text>
            <View
              style={{
                backgroundColor: theme.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                style={{ color: theme.textPrimary, fontSize: 14, minHeight: 60, textAlignVertical: "top" }}
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Favorite Genres Selector */}
        <View style={{ gap: 10 }}>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700", textTransform: "uppercase" }}>
            Favorite Genres
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {GENRES.map((g) => {
              const isSelected = selectedGenres.includes(g);
              return (
                <Pressable
                  key={g}
                  onPress={() => toggleGenre(g)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 18,
                    backgroundColor: isSelected ? theme.accent : theme.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? theme.accent : theme.border,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? "#fff" : theme.textSecondary,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {isSelected ? `✓ ${g}` : g}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Subscription Plan Card */}
        <View
          style={{
            backgroundColor: `${theme.accent}14`,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: `${theme.accent}35`,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MaterialIcons name="stars" size={18} color={theme.accent} />
              <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "800" }}>FlowState Pro</Text>
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Midnight Member · Lossless Audio Enabled</Text>
          </View>
          <View
            style={{
              backgroundColor: theme.accent,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>ACTIVE</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

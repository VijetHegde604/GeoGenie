import { FeedbackAPI } from "@/api/feedback";
import { LandmarksAPI } from "@/api/landmarks";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Mime from "react-native-mime-types";
import Toast from "react-native-toast-message";

import { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedbackScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [allLandmarks, setAllLandmarks] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // LOAD LANDMARK LIST
  // ------------------------------------------
  useEffect(() => {
    LandmarksAPI.listFolders()
      .then((res) => {
        console.log("📍 Landmark list:", res);
        if (Array.isArray(res?.landmarks)) setAllLandmarks(res.landmarks);
        else Toast.show({ type: "error", text1: "Invalid landmark response" });
      })
      .catch((err) => console.log("❌ Landmark fetch error:", err));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered([]);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(allLandmarks.filter((n) => n.toLowerCase().includes(q)));
  }, [search, allLandmarks]);

  // ------------------------------------------
  // IMAGE PICKER
  // ------------------------------------------
  const pickPhoto = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.85,
    });
    if (img.assets?.[0]?.uri) setImageUri(img.assets[0].uri);
  };

  const takePhoto = async () => {
    const img = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (img.assets?.[0]?.uri) setImageUri(img.assets[0].uri);
  };

  // ------------------------------------------
  // LOCATION PICKER
  // ------------------------------------------
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return Toast.show({
        type: "error",
        text1: "Location permission denied",
      });
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLat(loc.coords.latitude.toFixed(6));
    setLng(loc.coords.longitude.toFixed(6));
  };

  // ------------------------------------------
  // RESET FORM
  // ------------------------------------------
  const resetForm = () => {
    Keyboard.dismiss();
    setImageUri(null);
    setSelected(null);
    setSearch("");
    setDesc("");
    setLat("");
    setLng("");

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 200);
  };

  // ------------------------------------------
  // SUBMIT FEEDBACK (2 STEP FLOW)
  // ------------------------------------------
  const submitFeedback = async () => {
    if (!imageUri) {
      return Toast.show({ type: "error", text1: "Pick a photo first" });
    }
    if (!selected) {
      return Toast.show({ type: "error", text1: "Select a landmark" });
    }

    try {
      setLoading(true);

      // detect MIME type (best effort)
      const mime = (Mime.lookup(imageUri) as string | false) || "image/jpeg";
      console.log("📌 USING MIME:", mime);

      // ---- STEP 1: upload image ----
      const uploadRes = await FeedbackAPI.uploadImage(imageUri, mime);
      console.log("📦 Upload response:", uploadRes);

      const image_id = uploadRes?.image_id;
      if (!image_id) {
        throw new Error("Backend did not return image_id");
      }

      // ---- STEP 2: send metadata ----
      await FeedbackAPI.updateMeta(image_id, selected, desc, lat, lng);

      Toast.show({ type: "success", text1: "🎉 Feedback submitted!" });
      resetForm();
    } catch (e: any) {
      console.log("❌ FEEDBACK ERROR:", e);
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: e?.message ?? "Check backend logs",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // UI
  // ------------------------------------------
  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            <Text style={styles.header}>Submit Feedback</Text>

            {/* PHOTO BUTTONS */}
            <View style={styles.photoRow}>
              <Button mode="contained" icon="camera" onPress={takePhoto}>
                Camera
              </Button>
              <Button mode="outlined" icon="image" onPress={pickPhoto}>
                Gallery
              </Button>
            </View>

            {/* PREVIEW */}
            {imageUri && (
              <View style={styles.previewCard}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              </View>
            )}

            {/* LANDMARK SEARCH */}
            <Text style={styles.label}>Landmark</Text>
            <View style={styles.searchBox}>
              <TextInput
                value={search}
                placeholder="Search landmark..."
                onChangeText={(t) => {
                  setSearch(t);
                  setSelected(null);
                }}
                style={styles.searchInput}
                textColor="#fff"
                mode="flat"
                underlineColor="transparent"
              />
              {selected && (
                <TouchableOpacity onPress={() => setSelected(null)}>
                  <Ionicons name="close-circle" size={22} color="#888" />
                </TouchableOpacity>
              )}
            </View>

            {selected && (
              <View style={styles.selectedChip}>
                <Text style={{ color: "#fff" }}>{selected}</Text>
              </View>
            )}

            {!selected && filtered.length > 0 && (
              <View style={styles.dropdown}>
                {filtered.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelected(item);
                      setSearch(item);
                      setFiltered([]);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {!selected && search.trim() && filtered.length === 0 && (
              <TouchableOpacity
                style={styles.newItem}
                onPress={() => {
                  setSelected(search.trim());
                  setFiltered([]);
                }}
              >
                <Ionicons name="add-circle-outline" size={20} color="#8AB4F8" />
                <Text style={styles.newItemText}>Use “{search.trim()}”</Text>
              </TouchableOpacity>
            )}

            {/* DESCRIPTION */}
            <TextInput
              label="Description (optional)"
              value={desc}
              onChangeText={setDesc}
              mode="outlined"
              multiline
              style={styles.input}
              textColor="#fff"
              outlineColor="#333"
            />

            {/* LOCATION */}
            <Button
              mode="outlined"
              icon="map-marker"
              onPress={getLocation}
              style={styles.locationBtn}
              textColor="#8AB4F8"
            >
              Use Current Location
            </Button>

            {(lat || lng) && (
              <View style={styles.locationCard}>
                <Text style={{ color: "#ccc" }}>
                  Latitude: {lat}
                  {"\n"}Longitude: {lng}
                </Text>
              </View>
            )}

            <View style={styles.coordRow}>
              <TextInput
                label="Latitude"
                value={lat}
                onChangeText={setLat}
                mode="outlined"
                style={styles.coordInput}
                textColor="#fff"
              />
              <TextInput
                label="Longitude"
                value={lng}
                onChangeText={setLng}
                mode="outlined"
                style={styles.coordInput}
                textColor="#fff"
              />
            </View>

            {/* SUBMIT */}
            <Button
              mode="contained"
              disabled={!imageUri || !selected || loading}
              onPress={submitFeedback}
              style={styles.submitBtn}
            >
              {loading ? <ActivityIndicator color="#fff" /> : "Submit Feedback"}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", paddingHorizontal: 18 },
  header: {
    fontSize: 26,
    color: "#fff",
    marginTop: 12,
    marginBottom: 18,
    fontWeight: "600",
  },
  photoRow: { flexDirection: "row", gap: 12 },
  previewCard: {
    height: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    marginTop: 14,
  },
  previewImage: { width: "100%", height: "100%" },
  label: {
    color: "#fff",
    marginTop: 26,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 6,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  selectedChip: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  newItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginTop: 8,
  },
  newItemText: { color: "#8AB4F8", marginLeft: 6 },
  input: { backgroundColor: "#111", marginTop: 20, borderRadius: 12 },
  coordRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  coordInput: { flex: 1, backgroundColor: "#111", borderRadius: 12 },
  locationBtn: {
    marginTop: 18,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "#121212",
  },
  locationCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    backgroundColor: "#111",
  },
  submitBtn: {
    marginTop: 26,
    borderRadius: 14,
    backgroundColor: "#8AB4F8",
    paddingVertical: 10,
  },
});

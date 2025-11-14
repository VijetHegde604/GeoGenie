// app/(tabs)/feedback.tsx
import api from "@/api/clients";
import { LandmarksAPI } from "@/api/landmarks";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Image,
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Landmark selector
  const [allLandmarks, setAllLandmarks] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // Optional fields
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Load landmark names
  // -------------------------------
  useEffect(() => {
    LandmarksAPI.listFolders().then((res) => {
      if (res?.landmarks) setAllLandmarks(res.landmarks);
    });
  }, []);

  // Filter as user types
  useEffect(() => {
    if (!search.trim()) {
      setFiltered([]);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(allLandmarks.filter((n) => n.toLowerCase().includes(q)));
  }, [search, allLandmarks]);

  // -------------------------------
  // Image picker
  // -------------------------------
  const pickPhoto = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
    });
    if (img.assets?.[0]?.uri) setImageUri(img.assets[0].uri);
  };

  const takePhoto = async () => {
    const img = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (img.assets?.[0]?.uri) setImageUri(img.assets[0].uri);
  };

  // -------------------------------
  // Location picker
  // -------------------------------
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return alert("Permission denied.");

    const loc = await Location.getCurrentPositionAsync({});
    setLat(loc.coords.latitude.toFixed(6));
    setLng(loc.coords.longitude.toFixed(6));
  };

  // -------------------------------
  // Submit Feedback
  // -------------------------------
  const submitFeedback = async () => {
    if (!selected || !imageUri) return alert("Photo + place required!");

    try {
      setLoading(true);

      const form = new FormData();

      // Get actual asset info (IMPORTANT)
      const asset = {
        uri: imageUri,
        name: "feedback.jpg",
        type: "image/jpeg",
      };

      form.append("file", asset as any);

      form.append("landmark_name", selected);
      if (desc) form.append("description", desc);
      if (lat) form.append("latitude", lat);
      if (lng) form.append("longitude", lng);

      // ❗ IMPORTANT: DO NOT SET HEADERS HERE
      const res = await api.post("/feedback/upload", form);

      alert("Thank you! Your feedback helps improve recognition.");

      setImageUri(null);
      setSelected(null);
      setSearch("");
      setDesc("");
      setLat("");
      setLng("");
    } catch (err) {
      console.log(err);
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
          <Text style={styles.header}>Submit Feedback</Text>

          {/* --- Photo Section --- */}
          <View style={styles.photoRow}>
            <Button
              icon="camera"
              mode="contained"
              onPress={takePhoto}
              style={styles.photoBtn}
            >
              Take Photo
            </Button>

            <Button
              icon="image"
              mode="outlined"
              onPress={pickPhoto}
              style={styles.photoBtn}
            >
              Gallery
            </Button>
          </View>

          {imageUri && (
            <View style={styles.previewCard}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            </View>
          )}

          {/* --- Landmark Selector --- */}
          <Text style={styles.label}>Landmark</Text>

          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search landmark..."
              placeholderTextColor="#666"
              value={search}
              onChangeText={(t) => {
                setSearch(t);
                setSelected(null);
              }}
              mode="flat"
              style={styles.searchInput}
              underlineColor="transparent"
            />
            {selected && (
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Ionicons name="close-circle" size={22} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Selected Landmark */}
          {selected && (
            <View style={styles.selectedChip}>
              <Text style={{ color: "#fff" }}>{selected}</Text>
            </View>
          )}

          {/* Dropdown */}
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

          {/* Add new landmark */}
          {!selected && search.trim() && filtered.length === 0 && (
            <TouchableOpacity
              style={styles.newItem}
              onPress={() => {
                setSelected(search.trim());
                setFiltered([]);
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#8AB4F8" />
              <Text style={styles.newItemText}>
                Use “{search.trim()}” as a new landmark
              </Text>
            </TouchableOpacity>
          )}

          {/* --- Description --- */}
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

          {/* --- Location --- */}
          <Button
            mode="outlined"
            icon="map-marker"
            onPress={getLocation}
            textColor="#8AB4F8"
            style={styles.locationBtn}
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

          {/* Manual location input */}
          <View style={styles.coordRow}>
            <TextInput
              label="Latitude"
              value={lat}
              onChangeText={setLat}
              keyboardType="numeric"
              mode="outlined"
              style={styles.coordInput}
              textColor="#fff"
              outlineColor="#333"
            />
            <TextInput
              label="Longitude"
              value={lng}
              onChangeText={setLng}
              keyboardType="numeric"
              mode="outlined"
              style={styles.coordInput}
              textColor="#fff"
              outlineColor="#333"
            />
          </View>

          {/* --- Submit Button --- */}
          <Button
            mode="contained"
            onPress={submitFeedback}
            disabled={loading || !selected || !imageUri}
            style={styles.submitBtn}
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Submit Feedback"}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------
//                       Styles
// -----------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", paddingHorizontal: 20 },
  header: {
    color: "#fff",
    fontSize: 24,
    marginVertical: 20,
    fontWeight: "600",
  },

  photoRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  photoBtn: { flex: 1, borderRadius: 12 },

  previewCard: {
    height: 220,
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderColor: "#333",
    borderWidth: 1,
  },

  previewImage: { width: "100%", height: "100%" },

  label: { color: "#fff", marginBottom: 6, fontSize: 16 },

  searchBox: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#fff",
  },

  dropdown: {
    backgroundColor: "#111",
    borderRadius: 12,
    borderColor: "#333",
    borderWidth: 1,
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
    marginTop: 10,
    padding: 8,
  },

  newItemText: { color: "#8AB4F8", marginLeft: 6 },

  input: {
    marginTop: 20,
    backgroundColor: "#111",
    borderRadius: 12,
  },

  locationBtn: {
    marginTop: 18,
    borderRadius: 12,
    borderColor: "#333",
    backgroundColor: "#121212",
  },

  locationCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
  },

  coordRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  coordInput: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
  },

  submitBtn: {
    marginTop: 28,
    borderRadius: 14,
    backgroundColor: "#8AB4F8",
    paddingVertical: 8,
  },
});

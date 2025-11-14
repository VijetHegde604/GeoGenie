// app/(tabs)/index.tsx
import api from "@/api/clients";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGeoStore } from "../../store/useGeoStore";

export default function CameraScreen() {
  const { setImage, setUploading, isUploading, setLandmark, clear } =
    useGeoStore();

  const upload = async (uri: string) => {
    setImage(uri);
    setUploading(true);
    clear();

    try {
      const filename = uri.split("/").pop()!;
      const form = new FormData();
      form.append("image", { uri, name: filename, type: "image/jpeg" } as any);

      const res = await api.post("/recognize", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = res.data;

      // Navigate to recognition result screen
      router.push({
        pathname: "/recognized",
        params: {
          place: result.place_name,
          confidence: result.confidence.toString(),
          source: result.source,
          image: uri,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
    });
    if (result.assets?.[0]?.uri) upload(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (result.assets?.[0]?.uri) upload(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Text variant="headlineLarge" style={styles.appTitle}>
          GeoGenie
        </Text>
        <Text variant="bodyMedium" style={styles.sub}>
          Snap a monument to begin
        </Text>
      </View>

      {isUploading ? (
        <ActivityIndicator
          size="large"
          color="#8AB4F8"
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={takePhoto}
            icon="camera"
            style={styles.primaryBtn}
            labelStyle={styles.btnLabel}
          >
            Take Photo
          </Button>

          <Button
            mode="outlined"
            onPress={pickImage}
            icon="image"
            style={styles.secondaryBtn}
            labelStyle={styles.btnLabel}
          >
            Choose from Gallery
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "center",
  },

  headerCard: {
    alignItems: "center",
    marginBottom: 40,
  },

  appTitle: {
    color: "#8AB4F8",
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  sub: {
    color: "#bbb",
    textAlign: "center",
    fontSize: 16,
  },

  buttonContainer: {
    marginTop: 10,
    gap: 16,
  },

  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 6,
    backgroundColor: "#8AB4F8",
  },

  secondaryBtn: {
    borderRadius: 14,
    borderColor: "#444",
    backgroundColor: "#111",
  },

  btnLabel: {
    fontSize: 16,
  },
});

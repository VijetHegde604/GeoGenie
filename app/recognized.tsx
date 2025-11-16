import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecognizedScreen() {
  const { place, confidence, image } = useLocalSearchParams();

  // --------------------------
  // 🔤 BEAUTIFY LANDMARK NAME
  // --------------------------
  function beautifyName(name: string): string {
    if (!name) return "Unknown Place";

    // Replace underscores / dashes with spaces
    let cleaned = name.replace(/[_-]+/g, " ").trim();

    // Capitalize every word
    cleaned = cleaned.replace(/\b\w+/g, (w) => w[0].toUpperCase() + w.slice(1));

    // Special common cases
    cleaned = cleaned
      .replace(/\bIskcon\b/i, "ISKCON")
      .replace(/\bSai\b/i, "Sai")
      .replace(/\bIit\b/i, "IIT")
      .replace(/\bIiisc\b/i, "IISc");

    return cleaned;
  }

  // Fix param array issue
  const imageUri = Array.isArray(image) ? image[0] : image;
  const rawName = String(place);
  const prettified = beautifyName(rawName);

  const isUnknown =
    rawName.toLowerCase() === "unknown" ||
    rawName.toLowerCase() === "unknown_place";

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri as string }} style={styles.preview} />

      <View style={styles.card}>
        <Text style={styles.title}>
          {isUnknown ? "No Match Found" : "We Found a Match!"}
        </Text>

        <Text style={styles.placeName}>
          {isUnknown ? "Unknown Place" : prettified}
        </Text>

        {!isUnknown && (
          <Text style={styles.conf}>
            Confidence: {(Number(confidence) * 100).toFixed(1)}%
          </Text>
        )}

        <Text style={styles.question}>
          {isUnknown
            ? "Would you like to help us identify it?"
            : "Is this correct?"}
        </Text>

        <View style={styles.buttons}>
          {!isUnknown && (
            <TouchableOpacity
              style={[styles.btn, styles.yesBtn]}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/chat",
                  params: { place: prettified },
                })
              }
            >
              <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.noBtn]}
            onPress={() => router.push("/(tabs)/feedback")}
          >
            <Text style={styles.btnText}>
              {isUnknown ? "Add Info" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ---------------------
// 🎨 STYLES
// ---------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  preview: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(20,20,20,0.85)",
    padding: 22,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  title: {
    color: "#8AB4F8",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeName: {
    fontSize: 28,
    color: "white",
    fontWeight: "700",
    marginBottom: 4,
  },
  conf: {
    color: "#BBBBBB",
    marginBottom: 18,
  },
  question: {
    fontSize: 18,
    color: "#EEE",
    marginBottom: 14,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  yesBtn: {
    backgroundColor: "#4CAF50",
  },
  noBtn: {
    backgroundColor: "#E53935",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecognizedScreen() {
  const { place, confidence, image } = useLocalSearchParams();

  // FIX: always use a single string
  const imageUri = Array.isArray(image) ? image[0] : image;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri as string }} style={styles.preview} />

      <View style={styles.card}>
        <Text style={styles.title}>We found a match!</Text>

        <Text style={styles.placeName}>{place}</Text>
        <Text style={styles.conf}>
          Confidence: {(Number(confidence) * 100).toFixed(1)}%
        </Text>

        <Text style={styles.question}>Is this correct?</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.btn, styles.yesBtn]}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/chat",
                params: { place },
              })
            }
          >
            <Text style={styles.btnText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.noBtn]}
            onPress={() => router.push("/(tabs)/feedback")}
          >
            <Text style={styles.btnText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
    backgroundColor: "rgba(20,20,20,0.8)",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  title: {
    color: "#8AB4F8",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 6,
  },
  placeName: {
    fontSize: 28,
    color: "white",
    fontWeight: "700",
    marginBottom: 2,
  },
  conf: {
    color: "#BBB",
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

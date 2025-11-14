import { ChatAPI } from "@/api";
import PixelChat from "@/components/PixelChat";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  // Read the param from /recognized → router.push({ params: { place } })
  const params = useLocalSearchParams();
  const placeFromRecognition = Array.isArray(params.place)
    ? params.place[0]
    : params.place;

  const [place, setPlace] = useState(placeFromRecognition || "");
  const [confirmedPlace, setConfirmedPlace] = useState<string | null>(null);

  // Auto-confirm if coming from recognized screen
  useEffect(() => {
    if (placeFromRecognition) {
      setConfirmedPlace(placeFromRecognition);
    }
  }, [placeFromRecognition]);

  const sendToAPI = async (msg: string) => {
    if (!confirmedPlace) return "No place selected.";

    try {
      const reply = await ChatAPI.chatAboutPlace(confirmedPlace, msg);
      return reply;
    } catch {
      return "Server error. Try again.";
    }
  };

  // If place not selected → show input screen
  if (!confirmedPlace) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text
            variant="headlineSmall"
            style={{ color: "#fff", marginBottom: 12 }}
          >
            Start Chatting About a Place
          </Text>

          <TextInput
            label="Enter a place name"
            value={place}
            onChangeText={setPlace}
            mode="outlined"
            style={styles.input}
            textColor="#fff"
            outlineColor="#333"
          />

          <Button
            mode="contained"
            style={styles.btn}
            disabled={!place.trim()}
            onPress={() => setConfirmedPlace(place.trim())}
          >
            Start Chat
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // If place selected → show chat UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
      <PixelChat onSend={sendToAPI} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    justifyContent: "center",
    padding: 20,
  },
  inner: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#111",
    borderRadius: 12,
  },
  btn: {
    borderRadius: 12,
    backgroundColor: "#8AB4F8",
  },
});

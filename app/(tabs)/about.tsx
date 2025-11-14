// app/(tabs)/about.tsx
import { Linking, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              GeoGenie
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Discover the world around you with AI.
            </Text>
            <Divider style={styles.divider} />

            <Text variant="bodyMedium" style={styles.paragraph}>
              <Text style={styles.highlight}>GeoGenie</Text> uses cutting-edge
              computer vision and AI to identify monuments, landmarks, and
              scenic places — instantly. Just snap a photo, and our intelligent
              system will recognize where you are and tell you the story behind
              it.
            </Text>

            <Text variant="bodyMedium" style={styles.paragraph}>
              Built with modern technologies like{" "}
              <Text style={styles.highlight}>React Native</Text>,{" "}
              <Text style={styles.highlight}>FastAPI</Text>, and{" "}
              <Text style={styles.highlight}>CLIP/DINOv2</Text>, the app merges
              vision and geography to make exploration smarter and more fun.
            </Text>

            <Text variant="bodyMedium" style={styles.paragraph}>
              Whether you’re traveling, studying history, or just curious about
              a landmark nearby — GeoGenie is your personal AI-powered guide to
              the world.
            </Text>

            <Divider style={styles.divider} />

            <Text variant="labelSmall" style={styles.version}>
              Version 1.0.0 • Made with ❤️ by Vijeth Hegde
            </Text>

            <Button
              mode="outlined"
              textColor="#8AB4F8"
              style={styles.button}
              onPress={() =>
                Linking.openURL("https://github.com/vijethegde604/GeoGenie")
              }
            >
              View Source on GitHub
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  inner: { padding: 20 },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    paddingBottom: 10,
  },
  title: {
    color: "#8AB4F8",
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  paragraph: {
    color: "#DDD",
    marginTop: 8,
    lineHeight: 22,
  },
  highlight: {
    color: "#8AB4F8",
    fontWeight: "600",
  },
  divider: {
    marginVertical: 12,
    opacity: 0.2,
  },
  version: {
    color: "#666",
    marginTop: 10,
    alignSelf: "center",
  },
  button: {
    borderColor: "#8AB4F8",
    marginTop: 16,
    alignSelf: "center",
  },
});

// components/LandmarkCard.tsx
import { Card, Text, ProgressBar, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Landmark } from "@/store/useGeoStore";
import { Image } from "expo-image";

export function LandmarkCard({ landmark }: { landmark: Landmark }) {
  const theme = useTheme();
  const conf = landmark.confidence / 100;

  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: landmark.image }}
        style={styles.cover}
        contentFit="cover"
      />
      <Card.Content style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          {landmark.name}
        </Text>
        <Text variant="bodyMedium" style={styles.desc}>
          {landmark.description}
        </Text>
        <Text variant="labelSmall" style={styles.label}>
          Confidence
        </Text>
        <ProgressBar
          progress={conf}
          color={theme.colors.primary}
          style={styles.bar}
        />
        <Text variant="labelSmall" style={styles.pct}>
          {landmark.confidence.toFixed(1)}%
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 16, backgroundColor: "#1E1E1E" },
  cover: { height: 200 },
  content: { paddingTop: 16 },
  title: { fontFamily: "JetBrainsMonoBold" },
  desc: { marginTop: 8, opacity: 0.8 },
  label: { marginTop: 16, opacity: 0.7 },
  bar: { height: 6, borderRadius: 3, marginTop: 4 },
  pct: { marginTop: 4, alignSelf: "flex-end" },
});

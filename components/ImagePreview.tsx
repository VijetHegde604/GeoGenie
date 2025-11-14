// components/ImagePreview.tsx
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export function ImagePreview({ uri }: { uri: string | null }) {
  if (!uri) return null;
  return (
    <View style={styles.box}>
      <Image source={{ uri }} style={styles.img} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
  },
  img: { width: "100%", height: "100%" },
});

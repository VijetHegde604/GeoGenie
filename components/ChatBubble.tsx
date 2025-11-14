// components/ChatBubble.tsx
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export function ChatBubble({
  role,
  text,
}: {
  role: "user" | "bot";
  text: string;
}) {
  return (
    <View style={[styles.bubble, role === "user" ? styles.user : styles.bot]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16, marginVertical: 4 },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#8AB4F8",
    borderBottomRightRadius: 4,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#1E1E1E",
    borderBottomLeftRadius: 4,
  },
  text: { color: "#fff", fontFamily: "JetBrainsMonoRegular" },
});

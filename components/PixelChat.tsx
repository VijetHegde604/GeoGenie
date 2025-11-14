import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";

export default function PixelChat({
  onSend,
}: {
  onSend: (message: string) => Promise<string>;
}) {
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const listRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    const userMsg = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTyping(true);
    const reply = await onSend(userText);
    setTyping(false);

    const botMsg = {
      id: Date.now().toString() + "-bot",
      sender: "bot" as const,
      text: reply,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const renderItem = ({ item }: any) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        {isUser ? (
          <Text style={styles.bubbleText}>{item.text}</Text>
        ) : (
          <RenderHTML
            contentWidth={width - 80}
            source={{ html: item.text }}
            baseStyle={styles.bubbleText}
            tagsStyles={{
              p: { color: "white", marginBottom: 6, lineHeight: 22 },
              strong: { fontWeight: "700" },
              em: { fontStyle: "italic" },
              ul: { paddingLeft: 16 },
              li: { color: "white", marginBottom: 4 },
            }}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0F0F0F" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        {typing && (
          <View style={styles.typingContainer}>
            <View style={styles.botBubble}>
              <Text style={styles.typingDots}>•••</Text>
            </View>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message…"
            placeholderTextColor="#888"
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
            disabled={!input.trim()}
            onPress={sendMessage}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  list: {
    padding: 16,
    paddingBottom: 100,
  },

  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 12,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4F8EF7",
    borderBottomRightRadius: 6,
  },

  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1E1E1E",
    borderBottomLeftRadius: 6,
  },

  bubbleText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 60,
  },

  typingDots: {
    color: "#ccc",
    fontSize: 20,
    letterSpacing: 2,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },

  input: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    padding: 12,
    borderRadius: 24,
    color: "white",
    maxHeight: 150,
    fontSize: 16,
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#4F8EF7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
  },

  sendText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

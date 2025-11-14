import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { theme } from "../../constants/theme";

const LogoTitle = () => (
  <View style={{ width: 32, height: 32 }}>
    <Image
      source={require("../../assets/images/geogenie_logo.png")}
      style={{ width: "100%", height: "100%" }}
      contentFit="contain"
    />
  </View>
);

export default function TabLayout() {
  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#8AB4F8",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: { backgroundColor: "#121212" },
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Camera",
            tabBarIcon: ({ color }) => (
              <Ionicons name="camera-outline" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="feedback"
          options={{
            title: "Feedback",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />

        {/* 🔥 Chat Tab */}
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}

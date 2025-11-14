import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

export default function PulseLoader() {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 700,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 700,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#8AB4F8",
    alignSelf: "center",
    marginTop: 40,
  },
});

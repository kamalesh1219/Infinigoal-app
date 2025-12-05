import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        onFinish();
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require("../assets/images/InfiniGoal.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
      />

      <Animated.Text style={[styles.title,{color: "#FF7B00"}, { opacity: fadeAnim }]}>
        🛒  InfiniGoal Ecommerce
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        💬 Shop Smart. Live Better.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",  
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF7B00",
    marginTop: 6,
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#00C853",
    marginTop: 8,
  },
});
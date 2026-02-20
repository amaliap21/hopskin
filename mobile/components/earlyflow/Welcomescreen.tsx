import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.circle} />
        <Image 
          source={require("../../assets/logo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text 
        style={[
          styles.tagline,
          { opacity: fadeAnim }
        ]}
      >
        Your circle of recovery
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: 300,
    height: 200,
  },
  logo: {
    width: 264,
    height: 112,
    zIndex: 1,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderColor: "#58A4B0",
    borderWidth: 2,
    position: "absolute",
    top: -35,
    left: 125,
    zIndex: 0,
  },
  tagline: {
    fontSize: 24,
    color: "#1E1E1E",
    fontWeight: "500",
    fontFamily: "League Spartan",
    marginTop: 40,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

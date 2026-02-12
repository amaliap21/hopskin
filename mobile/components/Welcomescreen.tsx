import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <View style={styles.circle}></View>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.tagline}>Your circle of recovery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
    fontFamily: "LeagueSpartan",
  },
});

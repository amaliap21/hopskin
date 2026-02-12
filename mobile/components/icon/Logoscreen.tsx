import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

interface LogoProps {
  width?: number;
  height?: number;
}

export default function LogoScreen({ width, height }: LogoProps) {
  return (
    <View style={[{ width, height }, styles.container]}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <View style={styles.circle}></View>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.tagline}>Your circle of recovery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    width: 162,
    height: 68,
    zIndex: 1,
  },
  circle: {
    width: 86,
    height: 86,
    borderRadius: 70,
    borderColor: "#58A4B0",
    borderWidth: 2,
    position: "absolute",
    top: -25,
    left: 80,
    zIndex: 0,
  },
  tagline: {
    fontSize: 24,
    color: "#1E1E1E",
    fontWeight: "500",
    fontFamily: "LeagueSpartan",
  },
});

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export default function SplashScreen({ 
  onFinish, 
  duration = 2500 
}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo and tagline
    Animated.sequence([
      // Circle animation
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 8,
        friction: 5,
        useNativeDriver: true,
        delay: 200,
      }),
      // Logo and tagline animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // After animation completes, wait a bit then call onFinish
      if (onFinish) {
        setTimeout(onFinish, 500);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.contentContainer}>
        {/* Logo Container with Circle */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: circleScale }],
                opacity: circleScale,
              },
            ]}
          />
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Tagline */}
        <Animated.Text
          style={[styles.tagline, { opacity: fadeAnim }]}
        >
          Your circle of recovery
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  logo: {
    width: 264,
    height: 112,
    zIndex: 2,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderColor: "#58A4B0",
    borderWidth: 2.5,
    position: "absolute",
    top: -35,
    left: 125,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  tagline: {
    fontSize: 24,
    color: "#1E1E1E",
    fontWeight: "500",
    fontFamily: "League Spartan",
    marginTop: 20,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

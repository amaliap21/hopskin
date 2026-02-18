import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import SafeAreaView, { SafeAreaProvider } from "react-native-safe-area-view";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// ─── Responsive Scaling ────────────────────────────────────
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const scaleW = (size: number) => (width / BASE_WIDTH) * size;
const scaleH = (size: number) => (height / BASE_HEIGHT) * size;
const scaleFont = (size: number) => {
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  const newSize = size * scale;
  return Math.round(Math.max(size * 0.8, Math.min(newSize, size * 1.3)));
};

const isSmallDevice = height < 700;

// ─── Component ─────────────────────────────────────────────
interface OnBoardingMonitorProps {
  onNext?: () => void;
}

export default function OnBoardingMonitor({ onNext }: OnBoardingMonitorProps) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* ── Person Image ── */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/monitor.png")}
            style={styles.personImage}
            resizeMode="contain"
          />

          {/* Gradient overlay: transparent atas → putih bawah */}
          <LinearGradient
            colors={["rgba(255, 255, 255, 0)", "#FFFFFF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradientOverlay}
          />
        </View>

        {/* ── Bottom Content ── */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>Easy Monitor{"\n"}Patients</Text>

          {/* Description */}
          <Text style={styles.description}>
            View compliance recaps, symptom logs, and receive alerts for your
            patient in one view
          </Text>

          {/* Next Button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={onNext}>
              <Text style={styles.startButtonText}>Start</Text>
              <Ionicons
                name="arrow-forward"
                size={scaleFont(20)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Image area
  imageContainer: {
    flex: isSmallDevice ? 0.56 : 0.62,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: scaleH(isSmallDevice ? 16 : 28),
    position: "relative",
  },
  personImage: {
    height: "100%",
    transform: [{ scaleX: -1 }],
    position: "absolute",
    top: 70,
  },

  // Gradient: positioned at the bottom of imageContainer
  // Matches: background: linear-gradient(0deg, #FFF -0.69%, rgba(255,255,255,0) 103.8%)
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: scaleH(120),
    zIndex: 1,
  },

  // Bottom content
  contentContainer: {
    backgroundColor: "#FFFFFF",
    flex: isSmallDevice ? 0.44 : 0.38,
    paddingHorizontal: scaleW(40),
    paddingBottom: scaleH(isSmallDevice ? 18 : 28),
    justifyContent: "flex-start",
    zIndex: 1,
  },

  // Title
  title: {
    fontSize: scaleFont(isSmallDevice ? 36 : 40),
    letterSpacing: 1.6,
    fontWeight: "800",
    color: "#58A4B0",
    lineHeight: scaleFont(isSmallDevice ? 44 : 52),
    marginBottom: scaleH(10),
    fontFamily: "Be Vietnam Pro",
  },

  // Description
  description: {
    fontSize: scaleFont(isSmallDevice ? 15 : 21),
    fontFamily: "League Spartan",
    color: "#1E1E1E",
    lineHeight: scaleFont(isSmallDevice ? 22 : 26),
    fontWeight: "500",
    marginBottom: scaleH(isSmallDevice ? 18 : 22),
  },

  // Button row
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: scaleH(isSmallDevice ? 10 : 20),
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#58A4B0",
    borderRadius: scaleW(12),
    paddingVertical: scaleH(14),
    paddingHorizontal: scaleW(25),
    gap: scaleW(16),
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "600",
  },
});

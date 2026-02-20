import * as React from "react";
import { StyleSheet, View, Text, Image, Pressable, ScrollView, Dimensions } from "react-native";
import { SvgXml } from "react-native-svg";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Base design: 430 × 932 (iPhone 14 Pro Max)
const BASE_W = 430;
const BASE_H = 932;
const scaleW = (n: number) => (SCREEN_W / BASE_W) * n;
const scaleH = (n: number) => (SCREEN_H / BASE_H) * n;
const scaleFont = (n: number) => Math.round(scaleW(n));

const WAVE_H = SCREEN_H * 0.38;

const waveSvg = `
<svg width="${SCREEN_W}" height="${WAVE_H}" viewBox="0 0 430 354" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0H430V280C430 280 340 354 215 354C90 354 0 280 0 280V0Z" fill="#ADD2D8"/>
</svg>
`;

const ChooseRole = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Wave background header */}
      <View style={styles.waveWrapper}>
        <SvgXml xml={waveSvg} width={SCREEN_W} height={WAVE_H} />

        {/* Logo + tagline on top of wave */}
        <View style={styles.logoArea}>
          {/* Logo with circle decoration */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle} />
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>Your circle of recovery</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>How will you be{"\n"}using Orbi?</Text>
      </View>

      {/* Role Cards */}
      <View style={styles.groupParent}>
        {/* Patient */}
        <Pressable style={styles.card} onPress={onFinish}>
          <View style={styles.cardInner}>
            <Image
              source={require("../assets/person.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>I am a Patient</Text>
              <Text style={styles.cardDesc}>I want to track my TBC therapy and stay healthy</Text>
            </View>
          </View>
        </Pressable>

        {/* Caregiver */}
        <Pressable style={styles.card} onPress={onFinish}>
          <View style={styles.cardInner}>
            <Image
              source={require("../assets/support.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>I am a Caregiver</Text>
              <Text style={styles.cardDesc}>I want to support a loved one during their recovery</Text>
            </View>
          </View>
        </Pressable>

        {/* Health Provider */}
        <Pressable style={styles.card} onPress={onFinish}>
          <View style={styles.cardInner}>
            <Image
              source={require("../assets/doctor.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>I am a Health Provider</Text>
              <Text style={styles.cardDesc}>I want to monitor and manage my patients' progress</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: scaleH(40),
  },

  // ── Wave header ──
  waveWrapper: {
    width: SCREEN_W,
    height: WAVE_H,
    position: "relative",
  },
  logoArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: scaleH(30),
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: scaleW(280),
    height: scaleH(120),
    marginBottom: scaleH(8),
  },
  logoCircle: {
    width: scaleW(120),
    height: scaleW(120),
    borderRadius: scaleW(60),
    borderColor: "#fff",
    borderWidth: 2.5,
    position: "absolute",
    top: scaleH(-30),
    right: scaleW(30),
    zIndex: 1,
    backgroundColor: "transparent",
  },
  logo: {
    width: scaleW(220),
    height: scaleH(90),
    zIndex: 2,
  },
  subtitle: {
    fontSize: scaleFont(15),
    fontWeight: "500",
    color: "#1e1e1e",
    textAlign: "center",
    letterSpacing: -0.3,
    marginTop: scaleH(4),
  },

  // ── Title below wave ──
  titleWrapper: {
    paddingHorizontal: scaleW(36),
    paddingTop: scaleH(24),
    paddingBottom: scaleH(20),
  },
  title: {
    fontSize: scaleFont(34),
    fontWeight: "800",
    color: "#2e2e2e",
    textAlign: "center",
    lineHeight: scaleFont(42),
    letterSpacing: 0.8,
  },

  // ── Cards ──
  groupParent: {
    paddingHorizontal: scaleW(28),
    gap: scaleH(20),
  },
  card: {
    borderWidth: 2,
    borderColor: "#58a4b0",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    paddingVertical: scaleH(18),
    paddingHorizontal: scaleW(16),
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleW(14),
  },
  cardImage: {
    width: scaleW(80),
    height: scaleH(80),
    borderRadius: 10,
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    color: "#2c2c2e",
    marginBottom: scaleH(6),
    textTransform: "capitalize",
  },
  cardDesc: {
    fontSize: scaleFont(13),
    color: "#6b6b6e",
    lineHeight: scaleFont(18),
  },
});

export default ChooseRole;
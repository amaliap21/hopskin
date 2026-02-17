import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import Logo from "./icon/Logoscreen";

const { width, height } = Dimensions.get("window");

// ─── Responsive Scaling ────────────────────────────────────
// Base: iPhone 14 Pro (393 × 852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const scaleW = (size: number) => (width / BASE_WIDTH) * size;
const scaleH = (size: number) => (height / BASE_HEIGHT) * size;
const scaleFont = (size: number) => {
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  const newSize = size * scale;
  // Clamp: never go below 80% or above 130% of original
  return Math.round(Math.max(size * 0.8, Math.min(newSize, size * 1.3)));
};

// Device categories
const isSmallDevice = height < 700; // iPhone SE, small Androids

// ─── Wave SVG ──────────────────────────────────────────────
const waveSvg = `
<svg width="${width}" height="${height * 0.8}" viewBox="0 0 445 563" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dddd_33_126)">
<path d="M346.495 120.323C387.716 125.078 452 107.745 452 107.745V638H3.05176e-05V29.6301C3.05176e-05 29.6301 25.8302 17.0563 43.2398 12.4183C80.5248 2.4856 103.948 2.56897 141.25 12.4183C191.413 25.6637 210.473 60.2437 254.827 89.2093C286.796 110.088 308.942 115.991 346.495 120.323Z" fill="#ADD2D8"/>
</g>
<defs>
<filter id="filter0_dddd_33_126" x="-22" y="0" width="496" height="715" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3"/>
<feGaussianBlur stdDeviation="4"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.05 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_126"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="14"/>
<feGaussianBlur stdDeviation="7"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.04 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_33_126" result="effect2_dropShadow_33_126"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="31"/>
<feGaussianBlur stdDeviation="9.5"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.03 0"/>
<feBlend mode="normal" in2="effect2_dropShadow_33_126" result="effect3_dropShadow_33_126"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="55"/>
<feGaussianBlur stdDeviation="11"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.01 0"/>
<feBlend mode="normal" in2="effect3_dropShadow_33_126" result="effect4_dropShadow_33_126"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_33_126" result="shape"/>
</filter>
</defs>
</svg>
`;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Logo ── */}
        <View style={styles.header}>
          <Logo width={undefined} height={scaleH(80)} />
        </View>

        {/* ── Form Area ── */}
        <View style={styles.formContainer}>
          {/* Wave Background */}
          <View style={styles.waveContainer}>
            <SvgXml xml={waveSvg} style={styles.waveSvg} />
          </View>

          {/* Form Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Log In</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="alicia@gmail.com"
                placeholderTextColor="#4FA8B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="**************"
                  placeholderTextColor="#4FA8B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={scaleFont(22)}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forget Password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },

  // Logo
  header: {
    alignItems: "center",
    marginTop: isSmallDevice ? height * 0.06 : height * 0.125,
    marginBottom: scaleH(isSmallDevice ? 10 : 20),
  },

  // Form wrapper
  formContainer: {
    flex: 1,
    position: "relative",
  },
  waveContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: isSmallDevice ? scaleH(20) : scaleH(150),
  },
  waveSvg: {
    width: "100%",
    height: "100%",
  },

  // Form content
  contentContainer: {
    flex: 1,
    paddingHorizontal: scaleW(30),
    zIndex: 1,
    paddingTop: isSmallDevice ? scaleH(70) : scaleH(200),
  },

  // Title
  title: {
    fontSize: scaleFont(48),
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: isSmallDevice ? scaleH(24) : scaleH(36),
  },

  // Inputs
  inputGroup: {
    marginBottom: scaleH(22),
  },
  label: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: scaleH(8),
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: scaleW(12),
    paddingHorizontal: scaleW(18),
    paddingVertical: scaleH(16),
    fontSize: scaleFont(16),
    color: "#4FA8B8",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: scaleW(12),
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: scaleW(18),
    paddingVertical: scaleH(16),
    fontSize: scaleFont(16),
    color: "#4FA8B8",
  },
  eyeIcon: {
    padding: scaleW(10),
    paddingRight: scaleW(18),
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: scaleH(8),
  },
  forgotPasswordText: {
    fontSize: scaleFont(14),
    color: "#2C2C2C",
    fontWeight: "500",
  },

  // Button
  loginButton: {
    backgroundColor: "#2C3E50",
    borderRadius: scaleW(12),
    paddingVertical: scaleH(16),
    alignItems: "center",
    marginTop: scaleH(20),
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "600",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleH(25),
    paddingBottom: scaleH(30),
  },
  footerText: {
    fontSize: scaleFont(14),
    color: "#2C2C2C",
  },
  signUpLink: {
    fontSize: scaleFont(14),
    color: "#4FA8B8",
    fontWeight: "600",
  },
});

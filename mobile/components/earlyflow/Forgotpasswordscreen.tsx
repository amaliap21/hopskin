import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import Logo from "../icon/Logoscreen";
import { forgotPassword } from '../../services/supabase';

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

// ─── Wave SVG ──────────────────────────────────────────────
// Wave yang menutupi ~70% bawah layar, dengan kurva S di atas
const waveSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="445" height="642" viewBox="0 0 445 642" fill="none">
  <g filter="url(#filter0_dddd_34_375)">
    <path d="M346.495 120.323C387.716 125.078 452 107.745 452 107.745V638H3.05176e-05V29.6301C3.05176e-05 29.6301 25.8302 17.0563 43.2398 12.4183C80.5248 2.4856 103.948 2.56897 141.25 12.4183C191.413 25.6637 210.473 60.2437 254.827 89.2093C286.796 110.088 308.942 115.991 346.495 120.323Z" fill="#ADD2D8"/>
  </g>
  <defs>
    <filter id="filter0_dddd_34_375" x="-22" y="0" width="496" height="715" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.05 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_34_375"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="14"/>
      <feGaussianBlur stdDeviation="7"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.04 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_34_375" result="effect2_dropShadow_34_375"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="31"/>
      <feGaussianBlur stdDeviation="9.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.03 0"/>
      <feBlend mode="normal" in2="effect2_dropShadow_34_375" result="effect3_dropShadow_34_375"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="55"/>
      <feGaussianBlur stdDeviation="11"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.01 0"/>
      <feBlend mode="normal" in2="effect3_dropShadow_34_375" result="effect4_dropShadow_34_375"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_34_375" result="shape"/>
    </filter>
  </defs>
</svg>
`;

// ─── Component ─────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      Alert.alert('Email Sent', 'A password reset link has been sent to your email. Please check your inbox.');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
          <Logo width={undefined} height={scaleH(isSmallDevice ? 60 : 80)} />
        </View>

        {/* ── Form Area ── */}
        <View style={styles.formContainer}>
          {/* Wave Background */}
          <View style={styles.waveContainer}>
            <SvgXml xml={waveSvg} style={styles.waveSvg} />
          </View>

          {/* Form Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Forgot{"\n"}Password</Text>

            <Text style={styles.description}>
              Password change confirmation will be sent to your email address
              you used in sign up. Please confirm the password change.
            </Text>

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
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="**************"
                  placeholderTextColor="#4FA8B8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={scaleFont(22)}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Create New Password Button */}
            <TouchableOpacity style={styles.createButton} activeOpacity={0.8}>
              <Text style={styles.createButtonText}>Create New Password</Text>
            </TouchableOpacity>

            <View style={styles.emailInputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="example@example.com"
                  placeholderTextColor="#4FA8B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.forgotPasswordButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.forgotPasswordButtonText}>Forgot Password</Text>
              )}
            </TouchableOpacity>
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
    paddingTop: isSmallDevice ? scaleH(20) : scaleH(55),
  },
  waveSvg: {
    width: "100%",
    height: "100%",
  },

  // Form content — pushed down to sit on the wave
  contentContainer: {
    flex: 1,
    paddingHorizontal: scaleW(30),
    zIndex: 1,
    paddingTop: isSmallDevice ? scaleH(70) : scaleH(106),
    paddingBottom: scaleH(40),
  },

  // Title
  title: {
    fontSize: scaleFont(isSmallDevice ? 40 : 48),
    fontWeight: "700",
    color: "#2C2C2C",
    lineHeight: scaleFont(isSmallDevice ? 48 : 56),
    marginBottom: scaleH(isSmallDevice ? 14 : 20),
  },

  // Description
  description: {
    fontSize: scaleFont(isSmallDevice ? 13 : 15),
    color: "#2C2C2C",
    lineHeight: scaleFont(isSmallDevice ? 19 : 22),
    marginBottom: scaleH(isSmallDevice ? 24 : 34),
  },

  // Inputs
  inputGroup: {
    marginBottom: scaleH(isSmallDevice ? 16 : 22),
  },
  label: {
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: scaleH(6),
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
    paddingVertical: scaleH(isSmallDevice ? 13 : 16),
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    color: "#4FA8B8",
  },
  eyeIcon: {
    padding: scaleW(10),
    paddingRight: scaleW(18),
  },

  // Button
  createButton: {
    backgroundColor: "#2C3E50",
    borderRadius: scaleW(12),
    paddingVertical: scaleH(isSmallDevice ? 14 : 16),
    alignItems: "center",
    marginTop: scaleH(isSmallDevice ? 18 : 28),
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "600",
  },

  emailInputGroup: {
    marginBottom: scaleH(isSmallDevice ? 16 : 22),
  },
  emailInput: {
    flex: 1,
    paddingHorizontal: scaleW(18),
    paddingVertical: scaleH(isSmallDevice ? 13 : 16),
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    color: "#4FA8B8",
  },

  forgotPasswordButton: {
    backgroundColor: "#2C3E50",
    borderRadius: scaleW(12),
    paddingVertical: scaleH(isSmallDevice ? 14 : 16),
    alignItems: "center",
    marginTop: scaleH(isSmallDevice ? 18 : 28),
  },
  forgotPasswordButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "600",
  },
});

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
import { registerUser } from '../../services/supabase';

const { width, height } = Dimensions.get("window");

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

const waveSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="445" height="736" viewBox="0 0 445 736" fill="none">
  <g filter="url(#filter0_dddd_33_212)">
    <path d="M390.957 138.177C437.467 143.668 510 123.652 510 123.652V736H0V33.4433C0 33.4433 29.1446 18.9228 48.7883 13.5668C90.8577 2.09631 117.287 2.19257 159.375 13.5668C215.975 28.8628 237.481 68.7963 287.525 102.246C323.597 126.357 348.585 133.175 390.957 138.177Z" fill="#ADD2D8"/>
  </g>
  <defs>
    <filter id="filter0_dddd_33_212" x="-22" y="0" width="554" height="813" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.05 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_33_212"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="14"/>
      <feGaussianBlur stdDeviation="7"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.04 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_33_212" result="effect2_dropShadow_33_212"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="31"/>
      <feGaussianBlur stdDeviation="9.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.03 0"/>
      <feBlend mode="normal" in2="effect2_dropShadow_33_212" result="effect3_dropShadow_33_212"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="55"/>
      <feGaussianBlur stdDeviation="11"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0.01 0"/>
      <feBlend mode="normal" in2="effect3_dropShadow_33_212" result="effect4_dropShadow_33_212"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_33_212" result="shape"/>
    </filter>
  </defs>
</svg>
`;

export default function SignUpScreen({ onNavigateToLogin, onSignUpSuccess }: {
  onNavigateToLogin?: () => void;
  onSignUpSuccess?: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(email.trim(), password, "user", phoneNumber.trim());
      Alert.alert('Success', 'Account created! Please check your email to verify your account.', [
        { text: 'OK', onPress: () => onSignUpSuccess?.() },
      ]);
    } catch (error) {
      Alert.alert('Sign Up Failed', (error as Error).message);
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

      <View style={styles.header}>
        <Logo width={undefined} height={scaleH(isSmallDevice ? 60 : 80)} />
      </View>

      <View style={styles.formContainer}>
        {/* Wave Background */}
        <View style={styles.waveContainer}>
          <SvgXml xml={waveSvg} style={styles.waveSvg} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Text style={styles.title}>Sign Up</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Alicia D"
              placeholderTextColor="#4FA8B8"
              value={fullName}
              onChangeText={setFullName}
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
          </View>

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

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="08xxxxxxx"
              placeholderTextColor="#4FA8B8"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.logInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Logo
  header: {
    alignItems: "center",
    marginTop: isSmallDevice ? height * 0.06 : height * 0.125,
    marginBottom: scaleH(isSmallDevice ? 10 : 20),
  },

  // Form wrapper (relative untuk wave positioning)
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
  },
  waveSvg: {
    width: "100%",
    height: "100%",
  },

  // ScrollView di atas wave
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaleW(30),
    paddingTop: scaleH(isSmallDevice ? 30 : 45),
    paddingBottom: scaleH(40),
  },

  // Title
  title: {
    fontSize: scaleFont(isSmallDevice ? 40 : 48),
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: scaleH(isSmallDevice ? 20 : 28),
  },

  // Inputs
  inputGroup: {
    marginBottom: scaleH(isSmallDevice ? 14 : 18),
  },
  label: {
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: scaleH(6),
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: scaleW(12),
    paddingHorizontal: scaleW(18),
    paddingVertical: scaleH(isSmallDevice ? 13 : 16),
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
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
    paddingVertical: scaleH(isSmallDevice ? 13 : 16),
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    color: "#4FA8B8",
  },
  eyeIcon: {
    padding: scaleW(10),
    paddingRight: scaleW(18),
  },

  // Button
  signUpButton: {
    backgroundColor: "#2C3E50",
    borderRadius: scaleW(12),
    paddingVertical: scaleH(isSmallDevice ? 14 : 16),
    alignItems: "center",
    marginTop: scaleH(isSmallDevice ? 14 : 20),
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "600",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleH(isSmallDevice ? 18 : 25),
  },
  footerText: {
    fontSize: scaleFont(14),
    color: "#2C2C2C",
  },
  logInLink: {
    fontSize: scaleFont(14),
    color: "#4FA8B8",
    fontWeight: "600",
  },
});

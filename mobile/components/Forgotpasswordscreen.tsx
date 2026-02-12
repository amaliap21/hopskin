import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoBold}>orbi.</Text>
        </Text>
        <Text style={styles.tagline}>Your circle of recovery</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.waveBackground}>
          <Text style={styles.title}>Forgot{"\n"}Password</Text>

          <Text style={styles.description}>
            Password change confirmation will be sent to your email address you
            used in sign up. Please confirm the password change.
          </Text>

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
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

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
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create New Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 60,
    fontWeight: "300",
    color: "#2C2C2C",
  },
  logoBold: {
    fontWeight: "700",
  },
  tagline: {
    fontSize: 16,
    color: "#2C2C2C",
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
  },
  waveBackground: {
    backgroundColor: "#A8D5DC",
    borderTopLeftRadius: 150,
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 20,
    lineHeight: 56,
  },
  description: {
    fontSize: 14,
    color: "#2C2C2C",
    marginBottom: 35,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: "#4FA8B8",
  },
  eyeIcon: {
    padding: 10,
    paddingRight: 18,
  },
  createButton: {
    backgroundColor: "#2C3E50",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

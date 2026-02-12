import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import WelcomeScreen from "./components/Welcomescreen";
import LoginScreen from "./components/Loginscreen";
import SignUpScreen from "./components/Signupscreen";
import ForgotPasswordScreen from "./components/Forgotpasswordscreen";

type Screen = "welcome" | "login" | "signup" | "forgot";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen />;
      case "login":
        return <LoginScreen />;
      case "signup":
        return <SignUpScreen />;
      case "forgot":
        return <ForgotPasswordScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      {/* Navigation Menu - for demo purposes */}
      <View style={styles.navMenu}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "welcome" && styles.activeButton,
          ]}
          onPress={() => setCurrentScreen("welcome")}
        >
          <Text style={styles.navText}>Welcome</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "login" && styles.activeButton,
          ]}
          onPress={() => setCurrentScreen("login")}
        >
          <Text style={styles.navText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "signup" && styles.activeButton,
          ]}
          onPress={() => setCurrentScreen("signup")}
        >
          <Text style={styles.navText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === "forgot" && styles.activeButton,
          ]}
          onPress={() => setCurrentScreen("forgot")}
        >
          <Text style={styles.navText}>Forgot PW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#2C3E50",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: "#1a252f",
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activeButton: {
    backgroundColor: "#4FA8B8",
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});

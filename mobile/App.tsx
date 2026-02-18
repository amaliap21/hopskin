import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from "react-native";
import WelcomeScreen from "./components/earlyflow/Welcomescreen";
import LoginScreen from "./components/earlyflow/Loginscreen";
import SignUpScreen from "./components/earlyflow/Signupscreen";
import ForgotPasswordScreen from "./components/earlyflow/Forgotpasswordscreen";
import OnboardingDose from "./components/onboarding/OnBoardingDose";
import OnboardingDoctor from "./components/onboarding/OnBoardingDoctor";
import OnboardingMedical from "./components/onboarding/OnBoardingMedical";
import OnboardingMonitor from "./components/onboarding/OnBoardingMonitor";
import OnboardingSupport from "./components/onboarding/OnBoardingSupport";
import OnboardingRealTime from "./components/onboarding/OnBoardingRealTime";

const { width } = Dimensions.get("window");

type Screen =
  | "welcome"
  | "login"
  | "signup"
  | "forgot"
  | "onboarding_dose"
  | "onboarding_doctor"
  | "onboarding_medical"
  | "onboarding_monitor"
  | "onboarding_support"
  | "onboarding_realtime";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding_dose");
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in from right to left when screen changes
    slideAnim.setValue(width);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  const onboardingScreens: Screen[] = [
    "onboarding_dose",
    "onboarding_doctor",
    "onboarding_medical",
    "onboarding_monitor",
    "onboarding_support",
    "onboarding_realtime",
  ];

  const currentIndex = onboardingScreens.indexOf(currentScreen);
  const handleNext = () => {
    if (currentIndex < onboardingScreens.length - 1) {
      setCurrentScreen(onboardingScreens[currentIndex + 1]);
    } else {
      // Last screen - navigate to welcome or other screen
      setCurrentScreen("welcome");
    }
  };

  const renderScreen = () => {
    if (currentScreen === "onboarding_dose") {
      return <OnboardingDose onNext={handleNext} />;
    } else if (currentScreen === "onboarding_doctor") {
      return <OnboardingDoctor onNext={handleNext} />;
    } else if (currentScreen === "onboarding_medical") {
      return <OnboardingMedical onNext={handleNext} />;
    } else if (currentScreen === "onboarding_monitor") {
      return <OnboardingMonitor onNext={handleNext} />;
    } else if (currentScreen === "onboarding_support") {
      return <OnboardingSupport onNext={handleNext} />;
    } else if (currentScreen === "onboarding_realtime") {
      return <OnboardingRealTime onNext={handleNext} />;
    }

    return (
      <View style={styles.container}>
        <Text>Welcome</Text>
      </View>
    );
  };

  return <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>{renderScreen()}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

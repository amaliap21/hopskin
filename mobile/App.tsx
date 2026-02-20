import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from "react-native";
import SplashScreen from "./components/SplashScreen";
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
import ChooseRole from "./components/ChooseRole";

const { width } = Dimensions.get("window");

type Screen =
  | "splash"
  | "welcome"
  | "login"
  | "signup"
  | "forgot"
  | "onboarding_dose"
  | "onboarding_doctor"
  | "onboarding_medical"
  | "onboarding_monitor"
  | "onboarding_support"
  | "onboarding_realtime"
  | "choose_role";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Skip animation for splash screen
    if (currentScreen === "splash") return;

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
      // Last onboarding screen - navigate to ChooseRole
      setCurrentScreen("choose_role");
    }
  };

  const handleSplashFinish = () => {
    setCurrentScreen("onboarding_dose");
  };

  const renderScreen = () => {
    if (currentScreen === "splash") {
      return <SplashScreen onFinish={handleSplashFinish} />;
    } else if (currentScreen === "onboarding_dose") {
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
    } else if (currentScreen === "choose_role") {
      return <ChooseRole onFinish={() => setCurrentScreen("login")} />;
    } else if (currentScreen === "login") {
      return (
        <LoginScreen
          onSignUp={() => setCurrentScreen("signup")}
          onForgotPassword={() => setCurrentScreen("forgot")}
        />
      );
    } else if (currentScreen === "signup") {
      return <SignUpScreen />;
    } else if (currentScreen === "forgot") {
      return <ForgotPasswordScreen />;
    } else if (currentScreen === "welcome") {
      return <WelcomeScreen />;
    }

    return (
      <View style={styles.container}>
        <Text>Welcome</Text>
      </View>
    );
  };

  // Don't animate splash screen
  if (currentScreen === "splash") {
    return renderScreen();
  }

  return <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>{renderScreen()}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

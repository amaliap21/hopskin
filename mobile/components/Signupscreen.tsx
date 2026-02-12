import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoBold}>orbi.</Text>
        </Text>
        <Text style={styles.tagline}>Your circle of recovery</Text>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.waveBackground}>
          <Text style={styles.title}>Sign Up</Text>

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
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

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

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.logInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: '300',
    color: '#2C2C2C',
  },
  logoBold: {
    fontWeight: '700',
  },
  tagline: {
    fontSize: 16,
    color: '#2C2C2C',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
  },
  waveBackground: {
    backgroundColor: '#A8D5DC',
    borderTopLeftRadius: 150,
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#4FA8B8',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: '#4FA8B8',
  },
  eyeIcon: {
    padding: 10,
    paddingRight: 18,
  },
  signUpButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  logInLink: {
    fontSize: 14,
    color: '#4FA8B8',
    fontWeight: '600',
  },
});
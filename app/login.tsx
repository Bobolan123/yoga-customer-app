import { Colors, Gradients } from '@/constants/Design';
import { SharedStyles } from '@/constants/SharedStyles';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };


  return (
    <LinearGradient colors={Gradients.accent} style={{ flex: 1 }}>
      <SafeAreaView style={SharedStyles.container}>
        <KeyboardAvoidingView 
          style={SharedStyles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={[SharedStyles.scrollContainer, { minHeight: '100%' }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={SharedStyles.logoContainer}>
              <View style={SharedStyles.logoCircle}>
                <Ionicons name="log-in" size={40} color={Colors.white} />
              </View>
              <Text style={SharedStyles.logoText}>Welcome Back</Text>
              <Text style={SharedStyles.tagline}>Sign in to continue your journey</Text>
            </View>

            {/* Form Container */}
            <View style={SharedStyles.cardContainer}>
              {/* Email Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  emailFocused && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="mail-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  passwordFocused && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={[SharedStyles.input, { paddingRight: 50 }]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={[SharedStyles.primaryButton, loading && SharedStyles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? [Colors.gray[400], Colors.gray[500]] : Gradients.primary}
                  style={SharedStyles.primaryButtonGradient}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                      <Text style={SharedStyles.primaryButtonText}>Sign In</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.signupLink}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Back to Home Link */}
              <View style={styles.signupContainer}>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={styles.signupLink}>← Back to Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = {
  eyeIcon: {
    position: 'absolute' as const,
    right: 15,
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end' as const,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  signupContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 20,
  },
  signupText: {
    color: Colors.gray[600],
    fontSize: 16,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
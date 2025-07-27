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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { register } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const normalized = phone.replace(/\s+/g, '');
    const phoneRegex = /^(?:\+84|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
    return phoneRegex.test(normalized);
  };
  

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Error', 
        'Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    
    try {
      const result = await register(formData);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        console.log(result);
        Alert.alert('Registration Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };


  return (
    <LinearGradient colors={Gradients.accent} style={{ flex: 1 }}>
      <SafeAreaView style={SharedStyles.container}>
        <KeyboardAvoidingView 
          style={SharedStyles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={SharedStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={SharedStyles.logoContainer}>
              <View style={SharedStyles.logoCircle}>
                <Ionicons name="person-add" size={40} color={Colors.white} />
              </View>
              <Text style={SharedStyles.logoText}>Join YogaFlow</Text>
              <Text style={SharedStyles.tagline}>Start your wellness journey today</Text>
            </View>

            {/* Form Container */}
            <View style={SharedStyles.cardContainer}>
              {/* Name Row */}
              <View style={styles.nameRow}>
                <View style={[SharedStyles.inputContainer, styles.halfWidth]}>
                  <View style={[
                    SharedStyles.inputWrapper,
                    focusedField === 'firstName' && SharedStyles.inputWrapperFocused
                  ]}>
                    <Ionicons name="person-outline" size={20} style={SharedStyles.inputIcon} />
                    <TextInput
                      style={SharedStyles.input}
                      placeholder="First Name"
                      value={formData.firstName}
                      onChangeText={(value) => handleInputChange('firstName', value)}
                      autoCapitalize="words"
                      autoCorrect={false}
                      placeholderTextColor={Colors.gray[400]}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                <View style={[SharedStyles.inputContainer, styles.halfWidth]}>
                  <View style={[
                    SharedStyles.inputWrapper,
                    focusedField === 'lastName' && SharedStyles.inputWrapperFocused
                  ]}>
                    <Ionicons name="person-outline" size={20} style={SharedStyles.inputIcon} />
                    <TextInput
                      style={SharedStyles.input}
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChangeText={(value) => handleInputChange('lastName', value)}
                      autoCapitalize="words"
                      autoCorrect={false}
                      placeholderTextColor={Colors.gray[400]}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  focusedField === 'email' && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="mail-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="Email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  focusedField === 'phone' && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="call-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={SharedStyles.input}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  focusedField === 'password' && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={[SharedStyles.input, { paddingRight: 50 }]}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
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
                <Text style={SharedStyles.inputHint}>
                  Must be 8+ characters with uppercase, lowercase & numbers
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View style={SharedStyles.inputContainer}>
                <View style={[
                  SharedStyles.inputWrapper,
                  focusedField === 'confirmPassword' && SharedStyles.inputWrapperFocused
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} style={SharedStyles.inputIcon} />
                  <TextInput
                    style={[SharedStyles.input, { paddingRight: 50 }]}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.gray[400]}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <TouchableOpacity 
                style={[SharedStyles.primaryButton, loading && SharedStyles.buttonDisabled]}
                onPress={handleRegister}
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
                      <Ionicons name="person-add-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                      <Text style={SharedStyles.primaryButtonText}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Back to Home Link */}
              <View style={styles.loginContainer}>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={styles.loginLink}>← Back to Home</Text>
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
  nameRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  halfWidth: {
    width: '48%' as const,
  },
  eyeIcon: {
    position: 'absolute' as const,
    right: 15,
    padding: 5,
  },
  termsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 2,
    backgroundColor: Colors.transparent,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  loginContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 15,
  },
  loginText: {
    color: Colors.gray[600],
    fontSize: 16,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { Colors, Gradients } from '@/constants/Design';
import { SharedStyles } from '@/constants/SharedStyles';

export default function StartScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={SharedStyles.container}>
        <LinearGradient colors={Gradients.accent} style={SharedStyles.container}>
          <View style={SharedStyles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
            <Text style={SharedStyles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={SharedStyles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.accent} style={SharedStyles.container}>
        <View style={styles.content}>
          {/* Logo and Branding */}
          <View style={SharedStyles.logoContainer}>
            <View style={SharedStyles.logoCircle}>
              <Ionicons name="flower" size={50} color={Colors.white} />
            </View>
            <Text style={SharedStyles.logoText}>YogaFlow</Text>
            <Text style={SharedStyles.tagline}>Find Your Inner Peace</Text>
            <Text style={styles.subtitle}>
              Discover tranquility through our guided yoga classes
            </Text>
          </View>

          {/* Feature Highlights */}
          <View style={SharedStyles.featuresContainer}>
            <View style={SharedStyles.featureItem}>
              <Ionicons name="people" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={SharedStyles.featureText}>Expert Instructors</Text>
            </View>
            <View style={SharedStyles.featureItem}>
              <Ionicons name="calendar" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={SharedStyles.featureText}>Flexible Scheduling</Text>
            </View>
            <View style={SharedStyles.featureItem}>
              <Ionicons name="heart" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={SharedStyles.featureText}>Wellness Focused</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={SharedStyles.primaryButton}
              onPress={navigateToLogin}
            >
              <LinearGradient
                colors={Gradients.primary}
                style={SharedStyles.primaryButtonGradient}
              >
                <Ionicons name="log-in-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
                <Text style={SharedStyles.primaryButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={SharedStyles.secondaryButton}
              onPress={navigateToRegister}
            >
              <Ionicons name="person-add-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={SharedStyles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = {
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between' as const,
    paddingTop: 60,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center' as const,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    lineHeight: 18,
  },
};
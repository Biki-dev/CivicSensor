import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Polygon, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen({ navigation }: any) {
  const login = useAppStore(state => state.login);
  const [email, setEmail] = useState('elena.rostova@civic.org');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Hexagonal Motif & Header Illustration */}
          <View style={styles.headerIllustration}>
            <Svg width="120" height="120" viewBox="0 0 100 100" style={styles.logoSvg}>
              {/* Hexagon shape */}
              <Polygon
                points="50,5 90,28 90,72 50,95 10,72 10,28"
                fill={colors.bgDarkSecondary}
                stroke={colors.brandAccent}
                strokeWidth="2.5"
              />
              {/* Civic Seal Inner Graphic */}
              <Path
                d="M50 25 L65 40 L65 60 L50 75 L35 60 L35 40 Z"
                fill="none"
                stroke={colors.brandReward}
                strokeWidth="2"
              />
              {/* Dynamic Pulse waves inside */}
              <Path
                d="M30 50 H70"
                stroke={colors.brandAccent}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <Path
                d="M40 43 H60"
                stroke={colors.brandAccent}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M45 57 H55"
                stroke={colors.brandAccent}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
            <Text style={styles.title}>CivicSensor</Text>
            <Text style={styles.tagline}>Your city. Your voice. Your change.</Text>
            
            {/* Civic Pulse underline */}
            <View style={styles.pulseContainer}>
              <LinearGradient
                colors={['transparent', colors.brandAccent, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.pulseLine}
              />
            </View>
          </View>

          {/* Login Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionHeading}>Welcome Back Watcher</Text>
            <Text style={styles.sectionSubtitle}>Sign in to verify, report and clean up your district.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSPHRASE</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter passphrase"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Passphrase?</Text>
            </TouchableOpacity>

            {/* Login CTA with Linear Gradient */}
            <TouchableOpacity 
              style={[styles.loginBtn, isSubmitting && styles.disabledBtn]} 
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={[colors.brandAccent, '#00A896']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                <Text style={styles.loginBtnText}>
                  {isSubmitting ? 'AUTHORIZING ACCESS...' : 'ENTER CIVIC SPACE'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to the watch? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                <Text style={styles.registerLink}>Initialize Passport</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.screenV * 1.5,
    paddingBottom: spacing.screenV,
    justifyContent: 'center',
  },
  headerIllustration: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoSvg: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLG,
    color: colors.textOnDark,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  pulseContainer: {
    width: '60%',
    height: 4,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseLine: {
    width: '100%',
    height: 2,
  },
  formContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card * 1.5,
    padding: spacing.xl,
    ...shadows.lg,
  },
  sectionHeading: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.bodySM,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelSM,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingVertical: spacing.inputPadV,
    paddingHorizontal: spacing.inputPadH,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.labelSM,
    color: colors.textLink,
  },
  loginBtn: {
    borderRadius: radius.btn,
    overflow: 'hidden',
    ...shadows.teal,
    marginBottom: spacing.md,
  },
  gradientBtn: {
    paddingVertical: spacing.inputPadV + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    ...typography.btnLG,
    color: colors.btnPrimaryText,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.labelSM,
    color: colors.textLink,
    fontWeight: '700',
  },
});

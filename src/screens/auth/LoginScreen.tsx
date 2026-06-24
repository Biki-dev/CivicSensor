import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@appTypes/index';
import { palette, colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, radius, shadows } from '@theme/spacing';
import { useAppStore } from '@store/index';
import { isValidEmail, isValidPassword } from '@utils/helpers';
import { Button }    from '@components/ui/Button';
import { TextInput } from '@components/ui/TextInput';

const { height } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { login } = useAppStore();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailErr,    setEmailErr]    = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [showPass,    setShowPass]    = useState(false);

  const passwordRef = useRef<any>(null);
  const shakeAnim   = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = (): boolean => {
    let valid = true;
    setEmailErr('');
    setPasswordErr('');

    if (!isValidEmail(email)) {
      setEmailErr('Enter a valid email address');
      valid = false;
    }
    if (!isValidPassword(password)) {
      setPasswordErr('Password must be at least 8 characters');
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) { shake(); return; }
    setIsSubmitting(true);
    await login(email.trim().toLowerCase(), password);
    setIsSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={palette.navyDeep} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dark header panel ── */}
        <View style={styles.header}>
          {/* Teal accent bar */}
          <View style={styles.accentBar} />

          {/* Logo mark */}
          <View style={styles.logoMark}>
            <Text style={{ fontSize: 28 }}>🏙️</Text>
          </View>

          <Text style={styles.appTitle}>CivicSensor</Text>
          <Text style={styles.headerSubtitle}>
            Report. Verify. Transform your city.
          </Text>
        </View>

        {/* ── Form card ── */}
        <Animated.View
          style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}
        >
          <Text style={[typography.h2, styles.formTitle]}>Welcome back</Text>
          <Text style={[typography.body, styles.formSubtitle]}>
            Sign in to continue your civic journey
          </Text>

          {/* API-level error banner */}
          {/* Authentication errors are validated locally in the form. */}

          <TextInput
            label="Email address"
            value={email}
            onChangeText={t => { setEmail(t); setEmailErr(''); }}
            error={emailErr}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            containerStyle={styles.fieldGap}
          />

          <TextInput
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={t => { setPassword(t); setPasswordErr(''); }}
            error={passwordErr}
            placeholder="Min. 8 characters"
            secureTextEntry={!showPass}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            containerStyle={styles.fieldGap}
            rightIcon={
              <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
            }
            onRightIconPress={() => setShowPass(v => !v)}
          />

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={[typography.label, styles.forgotText]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Button
            label="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            fullWidth
            style={styles.signInBtn}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google sign-in placeholder (Phase 5: Firebase) */}
          <Button
            label="Continue with Google"
            onPress={() => {}}
            variant="ghost"
            size="lg"
            fullWidth
          />
        </Animated.View>

        {/* ── Sign up link ── */}
        <View style={styles.signUpRow}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            New to CivicSensor?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[typography.labelLG, { color: colors.brandAccent }]}>
              Join now →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom trust badge */}
        <View style={styles.trustRow}>
          <Text style={[typography.caption, styles.trustText]}>
            🔒  Secure · Private · Community-powered
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: palette.slateLight },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    backgroundColor: palette.navyDeep,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screenH,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: palette.tealVibrant,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(0,201,177,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,201,177,0.3)',
    marginBottom: spacing.md,
  },
  appTitle: {
    ...typography.h1,
    color: palette.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },

  // Form card
  formCard: {
    backgroundColor: palette.white,
    borderRadius: radius.modal,
    marginHorizontal: spacing.screenH,
    marginTop: -spacing.lg,
    padding: spacing.lg + 4,
    ...shadows.lg,
  },
  formTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  // Error banner
  errorBanner: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.coral,
  },
  errorBannerText: {
    ...typography.bodySM,
    color: colors.coralDeep,
  },

  fieldGap: {
    marginBottom: spacing.md,
  },
  eyeIcon: {
    fontSize: 18,
  },

  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -spacing.xs,
    marginBottom: spacing.lg,
  },
  forgotText: {
    color: colors.textLink,
  },

  signInBtn: {
    marginBottom: spacing.lg,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },

  // Bottom links
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenH,
  },
  trustRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  trustText: {
    color: colors.textMuted,
  },
});
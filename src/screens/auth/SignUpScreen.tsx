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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@appTypes/index';
import { palette, colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, radius, shadows } from '@theme/spacing';
import { useAuthStore } from '@store/authStore';
import { isValidEmail, isValidPassword } from '@utils/helpers';
import { Button }    from '@components/ui/Button';
import { TextInput } from '@components/ui/TextInput';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

// Password strength calculator
const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8)                      score++;
  if (pw.length >= 12)                     score++;
  if (/[A-Z]/.test(pw))                    score++;
  if (/[0-9]/.test(pw))                    score++;
  if (/[^A-Za-z0-9]/.test(pw))            score++;

  if (score <= 1) return { score, label: 'Weak',   color: colors.urgencyHigh };
  if (score <= 3) return { score, label: 'Fair',   color: colors.amber };
  return             { score, label: 'Strong', color: colors.success };
};

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [agreed,      setAgreed]      = useState(false);

  const [nameErr,        setNameErr]        = useState('');
  const [emailErr,       setEmailErr]       = useState('');
  const [passwordErr,    setPasswordErr]    = useState('');
  const [confirmPassErr, setConfirmPassErr] = useState('');
  const [agreeErr,       setAgreeErr]       = useState('');

  const emailRef    = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmRef  = useRef<any>(null);
  const shakeAnim   = useRef(new Animated.Value(0)).current;

  const pwStrength = passwordStrength(password);

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
    setNameErr(''); setEmailErr(''); setPasswordErr('');
    setConfirmPassErr(''); setAgreeErr(''); clearError();

    if (name.trim().length < 2) {
      setNameErr('Enter your full name (at least 2 characters)');
      valid = false;
    }
    if (!isValidEmail(email)) {
      setEmailErr('Enter a valid email address');
      valid = false;
    }
    if (!isValidPassword(password)) {
      setPasswordErr('Password must be at least 8 characters');
      valid = false;
    }
    if (password !== confirmPass) {
      setConfirmPassErr('Passwords do not match');
      valid = false;
    }
    if (!agreed) {
      setAgreeErr('You must agree to the Terms to continue');
      valid = false;
    }
    return valid;
  };

  const handleSignUp = async () => {
    if (!validate()) { shake(); return; }
    await signUp(name.trim(), email.trim().toLowerCase(), password);
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
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.accentBar} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Join CivicSensor</Text>
            <Text style={styles.headerSub}>
              Become a guardian of your neighbourhood
            </Text>
          </View>

          {/* Impact stats row */}
          <View style={styles.statsRow}>
            {[
              { value: '12k+', label: 'Reports Filed' },
              { value: '4.2k', label: 'Issues Fixed' },
              { value: '38+',  label: 'Cities' },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Form card ── */}
        <Animated.View
          style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}
        >
          <Text style={[typography.h3, styles.sectionTitle]}>
            Create your account
          </Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          )}

          <TextInput
            label="Full name"
            value={name}
            onChangeText={t => { setName(t); setNameErr(''); }}
            error={nameErr}
            placeholder="Arjun Sharma"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            containerStyle={styles.field}
          />

          <TextInput
            ref={emailRef}
            label="Email address"
            value={email}
            onChangeText={t => { setEmail(t); setEmailErr(''); }}
            error={emailErr}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            containerStyle={styles.field}
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
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            containerStyle={styles.field}
            rightIcon={
              <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
            }
            onRightIconPress={() => setShowPass(v => !v)}
          />

          {/* Password strength bar */}
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <View
                  key={i}
                  style={[
                    styles.strengthBar,
                    {
                      backgroundColor:
                        i <= pwStrength.score ? pwStrength.color : colors.slateMid,
                    },
                  ]}
                />
              ))}
              <Text style={[typography.caption, { color: pwStrength.color, marginLeft: spacing.xs }]}>
                {pwStrength.label}
              </Text>
            </View>
          )}

          <TextInput
            ref={confirmRef}
            label="Confirm password"
            value={confirmPass}
            onChangeText={t => { setConfirmPass(t); setConfirmPassErr(''); }}
            error={confirmPassErr}
            placeholder="Re-enter password"
            secureTextEntry={!showPass}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            containerStyle={styles.field}
          />

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => { setAgreed(v => !v); setAgreeErr(''); }}
            activeOpacity={0.75}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[typography.bodySM, styles.termsText]}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {agreeErr ? (
            <Text style={[typography.caption, { color: colors.textDanger, marginTop: 4 }]}>
              {agreeErr}
            </Text>
          ) : null}

          <Button
            label="Create Account"
            onPress={handleSignUp}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            style={styles.createBtn}
          />
        </Animated.View>

        {/* Points welcome note */}
        <View style={styles.welcomePoints}>
          <Text style={[typography.bodySM, styles.welcomeText]}>
            🎁  Sign up and earn{' '}
            <Text style={{ color: colors.amber, fontWeight: '700' }}>
              50 bonus points
            </Text>
            {' '}to kick-start your civic journey!
          </Text>
        </View>

        {/* Sign in link */}
        <View style={styles.signInRow}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Already a member?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[typography.labelLG, { color: colors.brandAccent }]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: palette.slateLight },
  scroll: { flexGrow: 1, paddingBottom: spacing.xxl },

  // Header
  header: {
    backgroundColor: palette.navyDeep,
    paddingTop: Platform.OS === 'ios' ? 52 : 40,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screenH,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    backgroundColor: palette.tealVibrant,
  },
  backBtn: { marginBottom: spacing.md },
  backText: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
  },
  headerContent: { marginBottom: spacing.lg },
  headerTitle: {
    ...typography.h1,
    color: palette.white,
    marginBottom: spacing.xs,
  },
  headerSub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.55)',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    ...typography.statSM,
    color: palette.tealVibrant,
  },
  statLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },

  // Form
  formCard: {
    backgroundColor: palette.white,
    borderRadius: radius.modal,
    marginHorizontal: spacing.screenH,
    marginTop: -spacing.lg,
    padding: spacing.lg + 4,
    ...shadows.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  field: { marginBottom: spacing.md },

  // Error
  errorBanner: {
    backgroundColor: colors.coralSoft,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.coral,
  },
  errorText: {
    ...typography.bodySM,
    color: colors.coralDeep,
  },

  // Password strength
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: colors.bgCard,
  },
  checkboxChecked: {
    backgroundColor: colors.brandAccent,
    borderColor: colors.brandAccent,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.textLink,
    fontWeight: '600',
  },

  createBtn: { marginTop: spacing.xs },

  // Welcome bonus
  welcomePoints: {
    backgroundColor: colors.amberSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.screenH,
    marginTop: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  welcomeText: {
    color: colors.amberDeep,
    lineHeight: 20,
  },

  // Bottom link
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});
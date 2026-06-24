import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@appTypes/index';
import { palette, colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, radius, shadows } from '@theme/spacing';
import { useAppStore } from '@store/index';
import { Button } from '@components/ui/Button';

const { width, height } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

// Illustrated feature cards
const FEATURES = [
  { emoji: '📍', title: 'Report Issues',    desc: 'Photo, location, AI category — done in 30 seconds' },
  { emoji: '✅', title: 'Verify Reports',   desc: 'Confirm real issues. Earn points. Build trust.' },
  { emoji: '🏆', title: 'Earn & Level Up',  desc: 'Badges, streaks, leaderboards, and civic rewards' },
  { emoji: '🌆', title: 'See Real Change',  desc: 'Track your reports from filed to fixed' },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAppStore();

  // Staggered animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(-30)).current;
  const cardsOpacity  = useRef(new Animated.Value(0)).current;
  const cardsY        = useRef(new Animated.Value(40)).current;
  const btnOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerY, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
        Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(cardsY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(cardsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.navyDeep} />

      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.heroBg} />
        <Animated.View
          style={[
            styles.heroContent,
            { opacity: headerOpacity, transform: [{ translateY: headerY }] },
          ]}
        >
          <Text style={styles.waveEmoji}>👋</Text>
          <Text style={styles.heroGreeting}>
            Welcome, {user?.displayName?.split(' ')[0] ?? 'Citizen'}!
          </Text>
          <Text style={styles.heroTagline}>
            You're now part of a growing movement to fix our cities — one report at a time.
          </Text>

          {/* Bonus points callout */}
          <View style={styles.bonusPill}>
            <Text style={[typography.label, { color: palette.navyDeep }]}>
              🎁  +50 bonus XP credited to your account
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Feature cards */}
      <Animated.View
        style={[
          styles.featureGrid,
          { opacity: cardsOpacity, transform: [{ translateY: cardsY }] },
        ]}
      >
        <Text style={[typography.h3, styles.featureTitle]}>Here's what you can do</Text>
        <View style={styles.grid}>
          {FEATURES.map(f => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={[typography.h4, styles.featureCardTitle]}>{f.title}</Text>
              <Text style={[typography.caption, styles.featureCardDesc]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.cta, { opacity: btnOpacity }]}>
        <Button
          label="Choose My Neighbourhood →"
          onPress={() => navigation.navigate('ChooseNeighborhood')}
          variant="primary"
          size="lg"
          fullWidth
        />
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Walkthrough', { step: 0 })}
        >
          <Text style={[typography.label, styles.skipText]}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  // Hero
  hero: {
    backgroundColor: palette.navyDeep,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screenH,
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(0,201,177,0.05)',
    top: -width * 0.5,
    right: -width * 0.3,
  },
  heroContent: { alignItems: 'flex-start' },
  waveEmoji: { fontSize: 36, marginBottom: spacing.sm },
  heroGreeting: {
    ...typography.h1,
    color: palette.white,
    marginBottom: spacing.sm,
  },
  heroTagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 24,
    marginBottom: spacing.lg,
    maxWidth: '90%',
  },
  bonusPill: {
    backgroundColor: palette.amber,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },

  // Features
  featureGrid: {
    flex: 1,
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.lg,
  },
  featureTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureCard: {
    width: (width - spacing.screenH * 2 - spacing.sm) / 2,
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.sm,
    borderLeftWidth: 3,
    borderLeftColor: palette.tealVibrant,
  },
  featureEmoji: { fontSize: 28, marginBottom: spacing.xs },
  featureCardTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  featureCardDesc: {
    color: colors.textMuted,
    lineHeight: 17,
  },

  // CTA
  cta: {
    paddingHorizontal: spacing.screenH,
    paddingVertical: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : spacing.lg,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  skipText: {
    color: colors.textMuted,
  },
});
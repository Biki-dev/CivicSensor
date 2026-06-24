import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@appTypes/index';
import { palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { useAppStore } from '@store/index';

const { width, height } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated, user } = useAppStore();

  // Animation values
  const logoScale   = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineY    = useRef(new Animated.Value(20)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Phase 1: logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: tagline entrance
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(taglineY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Phase 3: logo pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    // Navigate after 2.8s
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace(user?.onboardingComplete ? 'Main' : 'Onboarding');
      } else {
        navigation.replace('Auth');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.navyDeep} />

      {/* Background geometric accent circles */}
      <View style={[styles.circle, styles.circleLarge]} />
      <View style={[styles.circle, styles.circleMedium]} />

      {/* Logo + wordmark */}
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: logoOpacity,
            transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
          },
        ]}
      >
        {/* Hexagon logo mark */}
        <View style={styles.hexWrapper}>
          <View style={styles.hexOuter}>
            <View style={styles.hexInner}>
              <Text style={styles.hexEmoji}>🏙️</Text>
            </View>
          </View>
          {/* Teal accent ring */}
          <View style={styles.accentRing} />
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: logoOpacity }}>
        <Text style={styles.appName}>CivicSensor</Text>
        <View style={styles.nameDivider} />
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: taglineY }],
        }}
      >
        <Text style={styles.tagline}>Your city. Your voice. Your change.</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.loadingRow, { opacity: textOpacity }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={styles.dot} />
        ))}
      </Animated.View>

      {/* Version */}
      <Animated.Text style={[styles.version, { opacity: textOpacity }]}>
        v1.0.0 · Beta
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.navyDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Background decoration
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(0,201,177,0.05)',
  },
  circleLarge: {
    width: width * 1.4,
    height: width * 1.4,
    top: -width * 0.6,
    right: -width * 0.4,
  },
  circleMedium: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.3,
    left: -width * 0.2,
    backgroundColor: 'rgba(245,166,35,0.04)',
  },
  // Logo
  logoArea: {
    marginBottom: 20,
  },
  hexWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  hexOuter: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(0,201,177,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  hexInner: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: palette.tealVibrant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexEmoji: {
    fontSize: 32,
    transform: [{ rotate: '-45deg' }],
  },
  accentRing: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(0,201,177,0.3)',
    transform: [{ rotate: '45deg' }],
  },
  // Text
  appName: {
    ...typography.displayLG,
    color: palette.white,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  nameDivider: {
    alignSelf: 'center',
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.tealVibrant,
    marginBottom: 12,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.60)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  // Loading
  loadingRow: {
    flexDirection: 'row',
    marginTop: 48,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.tealVibrant,
    opacity: 0.8,
  },
  version: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.25)',
    position: 'absolute',
    bottom: 40,
  },
});
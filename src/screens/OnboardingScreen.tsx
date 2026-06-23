import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  FlatList
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Polygon, Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const MOCK_NEIGHBORHOODS = [
  'Greenview Valley',
  'Downtown Civic Core',
  'Oakridge Heights',
  'Bayview Wharf',
  'Summit Ridge',
  'Eldorado Estates'
];

export default function OnboardingScreen({ navigation }: any) {
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  const [step, setStep] = useState(0); // 0: Intro, 1: Gamification Explainer, 2: Neighborhood Select
  const [selectedNeigh, setSelectedNeigh] = useState('Greenview Valley');
  const [customNeigh, setCustomNeigh] = useState('');

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const finalNeighborhood = customNeigh.trim() || selectedNeigh;
      completeOnboarding(finalNeighborhood);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Svg width="100" height="100" viewBox="0 0 100 100">
                <Polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill={colors.bgDarkSecondary} stroke={colors.brandAccent} strokeWidth="2" />
                <Path d="M50 25 V75 M25 50 H75" stroke={colors.brandAccent} strokeWidth="3" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={styles.stepTitle}>Initialize Passport</Text>
            <Text style={styles.stepDescription}>
              Welcome to CivicSensor. You are joining a network of active citizens dedicated to monitoring and resolving infrastructure concerns.
            </Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.bulletText}>Report potholes, broken lighting, waste dumping</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.bulletText}>Verify alerts from neighbors to establish truth</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.bulletText}>Track issues from dispatch to resolution</Text>
              </View>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Svg width="100" height="100" viewBox="0 0 100 100">
                <Polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill={colors.bgDarkSecondary} stroke={colors.brandReward} strokeWidth="2" />
                <Path d="M35 55 L45 65 L65 40" stroke={colors.brandReward} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <Circle cx="50" cy="50" r="35" stroke={colors.brandAccent} strokeWidth="1" strokeDasharray="5,5" fill="none" />
              </Svg>
            </View>
            <Text style={styles.stepTitle}>The Civic Pulse</Text>
            <Text style={styles.stepDescription}>
              Your participation earns you points and levels up your status, unlocking powerful moderation perks.
            </Text>
            
            <View style={styles.gamifyCard}>
              <View style={styles.gamifyHeader}>
                <Text style={styles.gamifyBadgeText}>NEWCOMER</Text>
                <Text style={styles.gamifyPoints}>0 XP</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '15%' }]} />
              </View>
              <Text style={styles.gamifyPerk}>🔒 Next Rank unlocks: Neighborhood verification permissions</Text>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Locate Your Sector</Text>
            <Text style={styles.stepDescription}>
              Select your primary watch neighborhood. This filters your civic feed and notifies you of nearby issues.
            </Text>

            <View style={styles.selectionBox}>
              <Text style={styles.label}>CHOOSE FROM DISTRICTS</Text>
              <View style={styles.chipGrid}>
                {MOCK_NEIGHBORHOODS.map(item => {
                  const isSelected = selectedNeigh === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.chip,
                        isSelected && styles.selectedChip
                      ]}
                      onPress={() => {
                        setSelectedNeigh(item);
                        setCustomNeigh('');
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.selectedChipText
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CUSTOM</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                style={styles.customInput}
                placeholder="Enter custom neighborhood name"
                placeholderTextColor={colors.textMuted}
                value={customNeigh}
                onChangeText={setCustomNeigh}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.topTitle}>PASSPORT INITIALIZATION</Text>
        <View style={styles.stepIndicators}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.stepDot,
                step === i && styles.activeStepDot,
                step > i && styles.completedStepDot
              ]}
            />
          ))}
        </View>
      </View>

      {/* Main card space */}
      <View style={styles.card}>
        {renderStepContent()}
      </View>

      {/* Action buttons footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>{step === 0 ? 'CANCEL' : 'BACK'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <LinearGradient
            colors={[colors.brandAccent, '#00A896']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.nextBtnText}>
              {step === 2 ? 'ACTIVATE PASSPORT' : 'NEXT'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    paddingHorizontal: spacing.screenH,
    paddingVertical: spacing.screenV,
    justifyContent: 'space-between',
  },
  topBanner: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  topTitle: {
    ...typography.labelSM,
    color: colors.brandAccent,
    fontWeight: '700',
    letterSpacing: 2,
  },
  stepIndicators: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 6,
  },
  activeStepDot: {
    backgroundColor: colors.brandAccent,
    width: 24,
  },
  completedStepDot: {
    backgroundColor: colors.brandReward,
  },
  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.card * 1.5,
    marginVertical: spacing.lg,
    padding: spacing.xl,
    justifyContent: 'center',
    ...shadows.lg,
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  bulletList: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandAccent,
    marginRight: spacing.md,
  },
  bulletText: {
    ...typography.bodySM,
    color: colors.textSecondary,
    flex: 1,
  },
  gamifyCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.bgDark,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.md,
  },
  gamifyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  gamifyBadgeText: {
    ...typography.label,
    color: colors.textOnDark,
    fontWeight: '700',
  },
  gamifyPoints: {
    ...typography.statSM,
    color: colors.brandReward,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.brandAccent,
    borderRadius: 4,
  },
  gamifyPerk: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
  selectionBox: {
    alignSelf: 'stretch',
  },
  label: {
    ...typography.labelSM,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs * 1.5,
    paddingHorizontal: spacing.sm * 1.5,
    margin: 4,
    backgroundColor: '#F8FAFC',
  },
  selectedChip: {
    borderColor: colors.brandAccent,
    backgroundColor: colors.brandAccent + '15', // translucent teal
  },
  chipText: {
    ...typography.labelSM,
    color: colors.textSecondary,
  },
  selectedChipText: {
    color: colors.brandAccent,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
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
    fontWeight: '700',
  },
  customInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingVertical: spacing.inputPadV,
    paddingHorizontal: spacing.inputPadH,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backBtnText: {
    ...typography.btn,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  nextBtn: {
    flex: 1,
    borderRadius: radius.btn,
    overflow: 'hidden',
    ...shadows.teal,
    marginLeft: spacing.md,
  },
  gradientBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    ...typography.btnLG,
    color: colors.btnPrimaryText,
    fontWeight: '700',
  },
});

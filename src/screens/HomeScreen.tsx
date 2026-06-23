import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Polygon, Path, Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const { user, challenges, notifications, markAllNotificationsRead } = useAppStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>WELCOME BACK,</Text>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.neighborhoodText}>📍 Sector: {user.neighborhoodName}</Text>
          </View>
          
          {/* Active Streak */}
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{user.streakDays} Day Streak</Text>
          </View>
        </View>

        {/* Level & XP Card */}
        <View style={styles.levelCard}>
          <LinearGradient
            colors={[colors.bgDarkSecondary, colors.bgDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.levelCardGradient}
          >
            <View style={styles.levelHeader}>
              <View style={styles.badgeWrapper}>
                <Svg width="56" height="56" viewBox="0 0 100 100">
                  <Polygon 
                    points="50,5 92,29 92,71 50,95 8,71 8,29" 
                    fill={colors.brandPrimary} 
                    stroke={colors.brandReward} 
                    strokeWidth="3.5" 
                  />
                  {/* Outer glowing ring */}
                  <Circle cx="50" cy="50" r="30" stroke={colors.brandAccent} strokeWidth="1" strokeDasharray="3,3" fill="none" />
                  {/* Level Number */}
                  <Path d="M50 30 L60 45 L50 60 L40 45 Z" fill={colors.brandReward} />
                </Svg>
                <View style={styles.levelNumberContainer}>
                  <Text style={styles.levelNumberText}>L2</Text>
                </View>
              </View>

              <View style={styles.levelNameWrapper}>
                <Text style={styles.levelSub}>CURRENT CITIZEN STATUS</Text>
                <Text style={styles.levelName}>
                  {user.level.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            {/* XP Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.xpRow}>
                <Text style={styles.xpText}>{user.points} XP Earned</Text>
                <Text style={styles.xpNext}>200 XP FOR L3</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${user.levelProgress}%` }]}>
                  <LinearGradient
                    colors={[colors.brandAccent, '#00A896']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fillGradient}
                  />
                </View>
              </View>
              <Text style={styles.perkNote}>
                ⚡ Current Perk: You can verify reports and earn double streak bonuses.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Notifications Alert Banner */}
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.notificationBanner}
            onPress={markAllNotificationsRead}
          >
            <View style={styles.notificationInner}>
              <Text style={styles.notificationEmoji}>🔔</Text>
              <Text style={styles.notificationText}>
                You have {unreadCount} new verification update{unreadCount > 1 ? 's' : ''}!
              </Text>
            </View>
            <Text style={styles.dismissText}>DISMISS</Text>
          </TouchableOpacity>
        )}

        {/* Quick Statistics Grid */}
        <Text style={styles.sectionTitle}>PASSPORT METRICS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{user.reportCount}</Text>
            <Text style={styles.statLbl}>Reports Filed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{user.verificationCount}</Text>
            <Text style={styles.statLbl}>Verifications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: colors.tabActive }]}>
              {user.credibilityScore}%
            </Text>
            <Text style={styles.statLbl}>Credibility Rating</Text>
          </View>
        </View>

        {/* Active Quests & Challenges */}
        <View style={styles.challengesHeader}>
          <Text style={styles.sectionTitle}>ACTIVE CHALLENGES</Text>
          <View style={styles.pulseIndicator} />
        </View>

        {challenges.map(challenge => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeIcon}>
              <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={colors.brandReward} strokeWidth="2" />
                <Path d="M12 8V12L14 14" stroke={colors.brandReward} strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>

            <View style={styles.challengeContent}>
              <Text style={styles.challengeName}>{challenge.title}</Text>
              <Text style={styles.challengeDesc}>{challenge.description}</Text>
              <View style={styles.challengeProgressRow}>
                <View style={styles.miniProgressBg}>
                  <View 
                    style={[
                      styles.miniProgressFill, 
                      { width: `${(challenge.current / challenge.target) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressFraction}>
                  {challenge.current}/{challenge.target}
                </Text>
              </View>
            </View>

            <View style={styles.challengePoints}>
              <Text style={styles.ptsVal}>+{challenge.rewardPoints}</Text>
              <Text style={styles.ptsLbl}>XP</Text>
            </View>
          </View>
        ))}

        {/* Quick Navigation CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity 
            style={styles.primaryCta}
            onPress={() => navigation.navigate('Report')}
          >
            <LinearGradient
              colors={[colors.brandAccent, '#00A896']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>FILE NEW REPORT</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryCta}
            onPress={() => navigation.navigate('Feed')}
          >
            <Text style={styles.secondaryCtaText}>VERIFY REPORTS</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.screenV,
    paddingBottom: spacing.screenV * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcomeText: {
    ...typography.labelSM,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userName: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  neighborhoodText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  streakContainer: {
    backgroundColor: colors.bgDarkSecondary,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs * 1.5,
    paddingHorizontal: spacing.sm * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.xs,
  },
  streakEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    ...typography.labelSM,
    color: colors.brandReward,
    fontWeight: '700',
  },
  levelCard: {
    borderRadius: radius.card * 1.5,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  levelCardGradient: {
    padding: spacing.xl,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  levelNumberContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.brandReward,
    borderRadius: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.bgDark,
  },
  levelNameWrapper: {
    justifyContent: 'center',
  },
  levelSub: {
    ...typography.labelSM,
    color: colors.textOnDarkMuted,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  levelName: {
    ...typography.h2,
    color: colors.textOnDark,
    fontWeight: '800',
    marginTop: 2,
  },
  progressSection: {
    marginTop: spacing.lg,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  xpText: {
    ...typography.label,
    color: colors.brandAccent,
    fontWeight: '700',
  },
  xpNext: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  fillGradient: {
    flex: 1,
  },
  perkNote: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  notificationBanner: {
    backgroundColor: colors.brandReward + '15',
    borderColor: colors.brandReward,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  notificationInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationEmoji: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  notificationText: {
    ...typography.bodySM,
    color: colors.textWarning,
    fontWeight: '600',
    flex: 1,
  },
  dismissText: {
    ...typography.labelSM,
    color: colors.brandReward,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    ...shadows.xs,
  },
  statVal: {
    ...typography.stat,
    color: colors.textPrimary,
  },
  statLbl: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 4,
  },
  challengesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brandAccent,
  },
  challengeCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  challengeIcon: {
    marginRight: spacing.md,
  },
  challengeContent: {
    flex: 1,
  },
  challengeName: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  challengeDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  challengeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  miniProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.brandReward,
    borderRadius: 3,
  },
  progressFraction: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
  },
  challengePoints: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  ptsVal: {
    ...typography.label,
    color: colors.brandReward,
    fontWeight: '800',
  },
  ptsLbl: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  primaryCta: {
    flex: 1.2,
    borderRadius: radius.btn,
    overflow: 'hidden',
    ...shadows.teal,
    marginRight: spacing.sm,
  },
  ctaGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...typography.btnLG,
    color: colors.btnPrimaryText,
    fontWeight: '700',
  },
  secondaryCta: {
    flex: 0.8,
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
    borderRadius: radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  secondaryCtaText: {
    ...typography.btn,
    color: colors.brandPrimary,
    fontWeight: '700',
  },
});

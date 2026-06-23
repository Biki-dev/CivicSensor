import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Polygon, Path, Circle } from 'react-native-svg';
import { BADGES } from '@constants/index';

export default function ProfileScreen() {
  const { user, logout } = useAppStore();

  if (!user) return null;

  const renderBadgeIcon = (id: string, color: string, earned: boolean) => {
    return (
      <Svg width="48" height="48" viewBox="0 0 100 100">
        <Polygon
          points="50,5 90,28 90,72 50,95 10,72 10,28"
          fill={earned ? colors.bgDark : '#E2E8F0'}
          stroke={earned ? color : palette.slateGray}
          strokeWidth="3"
        />
        {/* Simple geometric shapes for different badge symbols */}
        {id === 'first_fix' && (
          <Path d="M35 52 L45 62 L65 40" stroke={earned ? palette.success : palette.slateGray} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
        {id === 'pothole_patrol' && (
          <Path d="M30 65 L45 35 L55 35 L70 65 Z" fill={earned ? color : palette.slateGray} />
        )}
        {id === 'eco_warrior' && (
          <Circle cx="50" cy="50" r="18" fill="none" stroke={earned ? color : palette.slateGray} strokeWidth="4" />
        )}
        {id === 'bright_knight' && (
          <Path d="M50 25 L65 45 L50 65 L35 45 Z" fill={earned ? color : palette.slateGray} />
        )}
        {id === 'impact_10' && (
          <Path d="M30 35 H70 V45 H30 Z M40 45 H60 V65 H40 Z" fill={earned ? color : palette.slateGray} />
        )}
        {!['first_fix', 'pothole_patrol', 'eco_warrior', 'bright_knight', 'impact_10'].includes(id) && (
          <Circle cx="50" cy="50" r="12" fill={earned ? color : palette.slateGray} />
        )}
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Passport Identity Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View style={styles.hexagonBorder}>
              <Svg width="110" height="110" viewBox="0 0 100 100" style={styles.borderSvg}>
                <Polygon
                  points="50,2 93,27 93,73 50,98 7,73 7,27"
                  fill="none"
                  stroke={colors.brandAccent}
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                />
              </Svg>
            </View>
          </View>
          
          <Text style={styles.profileName}>{user.displayName}</Text>
          <Text style={styles.profileRole}>CITIZEN WATCHER · LEVEL 2</Text>
          <Text style={styles.profileSector}>Sector: {user.neighborhoodName}, {user.city}</Text>
        </View>

        {/* Credibility & Trust Matrix */}
        <View style={styles.trustCard}>
          <View style={styles.trustItem}>
            <Text style={styles.trustVal}>{user.credibilityScore}%</Text>
            <Text style={styles.trustLbl}>CREDIBILITY SCORE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustVal}>{(user.accuracyRate * 100).toFixed(0)}%</Text>
            <Text style={styles.trustLbl}>ACCURACY RATE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustVal}>{user.points} XP</Text>
            <Text style={styles.trustLbl}>TOTAL CIVIC XP</Text>
          </View>
        </View>

        {/* Badges Grid */}
        <Text style={styles.sectionTitle}>CIVIC BADGES & TROPHIES</Text>
        <View style={styles.badgesContainer}>
          {BADGES.map(badge => {
            const isEarned = user.badges.includes(badge.id);
            return (
              <View 
                key={badge.id} 
                style={[
                  styles.badgeCard, 
                  isEarned ? styles.earnedBadgeCard : styles.lockedBadgeCard
                ]}
              >
                {renderBadgeIcon(badge.id, badge.iconColor, isEarned)}
                <Text 
                  style={[
                    styles.badgeName, 
                    isEarned ? styles.earnedBadgeName : styles.lockedBadgeName
                  ]}
                  numberOfLines={1}
                >
                  {badge.name}
                </Text>
                <Text style={styles.badgeDesc} numberOfLines={2}>
                  {isEarned ? badge.description : `Lock: ${badge.requirement}`}
                </Text>
                
                {isEarned && (
                  <View style={styles.earnedIndicator}>
                    <Text style={styles.earnedIndicatorText}>UNLOCKED</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Log Out CTA */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>DISCONNECT PASSPORT</Text>
        </TouchableOpacity>

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
    paddingTop: spacing.screenV * 1.2,
    paddingBottom: spacing.screenV * 2,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 1,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  hexagonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderSvg: {
    position: 'absolute',
  },
  profileName: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  profileRole: {
    ...typography.labelSM,
    color: colors.brandAccent,
    fontWeight: '700',
    marginTop: 4,
  },
  profileSector: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  trustCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustVal: {
    ...typography.stat,
    color: colors.textPrimary,
    fontSize: 20,
  },
  trustLbl: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    ...shadows.xs,
  },
  earnedBadgeCard: {
    borderColor: colors.brandReward,
    backgroundColor: colors.bgCard,
  },
  lockedBadgeCard: {
    borderColor: colors.border,
    opacity: 0.75,
  },
  badgeName: {
    ...typography.label,
    fontSize: 12,
    fontWeight: '800',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  earnedBadgeName: {
    color: colors.textPrimary,
  },
  lockedBadgeName: {
    color: palette.slateGray,
  },
  badgeDesc: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
    height: 28,
  },
  earnedIndicator: {
    backgroundColor: colors.brandReward + '20',
    borderRadius: radius.xs,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: spacing.sm,
  },
  earnedIndicatorText: {
    fontSize: 8,
    fontWeight: '900',
    color: palette.amberDeep,
    letterSpacing: 1,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: palette.coralDeep,
    borderRadius: radius.btn,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  logoutBtnText: {
    ...typography.btn,
    color: palette.coralDeep,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

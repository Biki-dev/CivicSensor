import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

interface UserProfileDetailScreenProps {
  route: {
    params: {
      userId: string;
      userName: string;
      userAvatar?: string;
    };
  };
  navigation: any;
}

export default function UserProfileDetailScreen({
  route,
  navigation,
}: UserProfileDetailScreenProps) {
  const { user, issues, following, followUser, unfollowUser, getFollowCount } = useAppStore();
  const { userId, userName, userAvatar } = route.params;

  if (!user) return null;

  const userIssues = issues.filter(issue => issue.reportedById === userId);
  const userVerifications = issues.filter(issue => issue.verifiedByIds.includes(userId));
  const followCounts = getFollowCount(userId);
  const isFollowing = following.some((f: any) => f.userId === userId);

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId, userName);
    }
  };

  const handleStartConversation = () => {
    // Navigate to DirectMessages and open conversation with this user
    navigation.navigate('Messages', {
      initialUserId: userId,
      initialUserName: userName,
      initialUserAvatar: userAvatar,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>Community Contributor</Text>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.followBtn,
                isFollowing && styles.followingBtn,
              ]}
              onPress={handleFollowToggle}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? '✓ Following' : '+ Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageBtn}
              onPress={handleStartConversation}
            >
              <LinearGradient
                colors={[colors.brandAccent, '#00A896']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.messageBtnGradient}
              >
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke={palette.white}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.messageBtnText}>Message</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userIssues.length}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userVerifications.length}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{followCounts.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17 10.5V7a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h6m4-4h6m0 0l-2-2m2 2l-2 2"
                  stroke={colors.brandAccent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.aboutText}>Active civic contributor & community watcher</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports ({userIssues.length})</Text>

          {userIssues.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reports yet.</Text>
            </View>
          ) : (
            userIssues.slice(0, 3).map(issue => (
              <TouchableOpacity key={issue.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle} numberOfLines={1}>
                    {issue.title}
                  </Text>
                  <View
                    style={[
                      styles.urgencyBadge,
                      {
                        backgroundColor:
                          issue.urgency === 'critical'
                            ? colors.urgencyCritical + '20'
                            : colors.urgencyHigh + '20',
                      },
                    ]}
                  >
                    <Text style={styles.urgencyText}>{issue.urgency}</Text>
                  </View>
                </View>
                <Text style={styles.activityDesc} numberOfLines={2}>
                  {issue.description}
                </Text>
                <View style={styles.activityFooter}>
                  <Text style={styles.activityMeta}>
                    📍 {issue.address}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges Earned</Text>
          <View style={styles.badgesGrid}>
            {['first_fix', 'pothole_patrol', 'eco_warrior'].map(badge => (
              <View key={badge} style={styles.badgeItem}>
                <Svg width="48" height="48" viewBox="0 0 100 100">
                  <Polygon
                    points="50,5 90,28 90,72 50,95 10,72 10,28"
                    fill={colors.bgCard}
                    stroke={colors.brandAccent}
                    strokeWidth="3"
                  />
                  <Circle cx="50" cy="50" r="12" fill={colors.brandAccent} />
                </Svg>
                <Text style={styles.badgeName} numberOfLines={1}>
                  {badge.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.screenH,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
  },
  userName: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  userRole: {
    ...typography.bodySM,
    color: colors.brandAccent,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  followBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.brandAccent,
    borderRadius: radius.btn,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: colors.brandAccent,
  },
  followBtnText: {
    ...typography.bodySM,
    color: colors.brandAccent,
    fontWeight: '800',
  },
  followingBtnText: {
    color: palette.white,
  },
  messageBtn: {
    flex: 1,
    borderRadius: radius.btn,
    overflow: 'hidden',
  },
  messageBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  messageBtnText: {
    ...typography.bodySM,
    color: palette.white,
    fontWeight: '800',
  },
  statsCard: {
    backgroundColor: colors.bgCard,
    marginHorizontal: spacing.screenH,
    marginBottom: spacing.lg,
    borderRadius: radius.card,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...shadows.xs,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  aboutCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.xs,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aboutText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  activityCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activityTitle: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  urgencyText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: colors.textWarning,
  },
  activityDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  badgeItem: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.sm,
    alignItems: 'center',
    ...shadows.xs,
  },
  badgeName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: spacing.xs,
    fontSize: 9,
    textAlign: 'center',
  },
});

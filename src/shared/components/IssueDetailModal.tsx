import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Issue, IssueCategory } from '@appTypes/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import { ISSUE_CATEGORIES } from '@constants/index';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAppStore } from '@store/index';

interface IssueDetailModalProps {
  issue: Issue;
  onClose: () => void;
  onVerify?: (issueId: string, userId: string) => void;
  onDispute?: (issueId: string, userId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onVerify,
  onDispute,
  currentUserId,
  isLoading = false,
}) => {
  const categoryInfo = ISSUE_CATEGORIES.find(c => c.value === issue.category) || 
    { label: 'General', color: '#95A5A6', icon: 'alert' };

  const hasVerified = currentUserId && issue.verifiedByIds.includes(currentUserId);
  const hasDisputed = currentUserId && issue.disputedByIds.includes(currentUserId);
  const canInteract = currentUserId && issue.reportedById !== currentUserId && !hasVerified && !hasDisputed;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: colors.textWarning + '15', text: colors.textWarning };
      case 'verified':
        return { bg: colors.tabActive + '15', text: colors.tabActive };
      case 'in_progress':
        return { bg: colors.brandReward + '15', text: colors.brandReward };
      case 'resolved':
        return { bg: colors.success + '15', text: colors.success };
      case 'disputed':
        return { bg: colors.urgencyHigh + '15', text: colors.urgencyHigh };
      default:
        return { bg: colors.border + '15', text: colors.textSecondary };
    }
  };

  const statusColors = getStatusColor(issue.status);
  const { authorities, assignIssueToAuthority, createWorkOrder } = useAppStore();
  const [showAssignOptions, setShowAssignOptions] = useState(false);
  const [assigning, setAssigning] = useState(false);

  return (
    <View style={styles.container}>
      {/* Modal Header Bar */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Text style={styles.headerTitle}>Issue Details</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category & Status Bar */}
        <View style={styles.categoryRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryInfo.color + '20', borderColor: categoryInfo.color },
            ]}
          >
            <View style={[styles.categoryDot, { backgroundColor: categoryInfo.color }]} />
            <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
              {categoryInfo.label.toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors.bg, borderColor: statusColors.text },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {issue.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Issue Title & Description */}
        <Text style={styles.issueTitle}>{issue.title}</Text>
        <Text style={styles.issueAddress}>📍 {issue.address}</Text>
        <Text style={styles.issueDescription}>{issue.description}</Text>

        {/* Media Gallery */}
        {issue.media.length > 0 && (
          <View style={styles.mediaContainer}>
            <Text style={styles.sectionTitle}>Evidence Media</Text>
            {issue.media.map((media, idx) => (
              <Image
                key={idx}
                source={{ uri: media.uri }}
                style={styles.mediaImage}
              />
            ))}
          </View>
        )}

        {/* Verification Status Block */}
        <View style={styles.verificationCard}>
          <Text style={styles.sectionTitle}>Community Verification</Text>

          {/* Verification Progress */}
          <View style={styles.verificationStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{issue.verificationCount}</Text>
              <Text style={styles.statLabel}>Verification Votes</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{issue.disputeCount}</Text>
              <Text style={styles.statLabel}>Dispute Votes</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{issue.viewCount}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>

          {/* Verification Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, (issue.verificationCount / 5) * 100)}%`,
                    backgroundColor: issue.isVerified ? colors.tabActive : colors.brandAccent,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {issue.isVerified ? '✓ VERIFIED BY COMMUNITY' : 'Awaiting Verification'}
            </Text>
          </View>
        </View>

        {/* Reporter Info */}
        <View style={styles.reporterCard}>
          <Text style={styles.sectionTitle}>Reported By</Text>
          <View style={styles.reporterInfo}>
            {issue.reportedByAvatar ? (
              <Image source={{ uri: issue.reportedByAvatar }} style={styles.reporterAvatar} />
            ) : (
              <View style={styles.reporterAvatarPlaceholder} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.reporterName}>{issue.reportedByName}</Text>
              <Text style={styles.reporterTime}>
                {new Date(issue.createdAt).toLocaleDateString()} at{' '}
                {new Date(issue.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {canInteract && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.verifyActionBtn, isLoading && styles.disabledBtn]}
              onPress={() => onVerify?.(issue.id, currentUserId!)}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[colors.brandAccent, '#00A896']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyGradient}
              >
                <Text style={styles.verifyActionText}>
                  {isLoading ? 'VERIFYING...' : 'VERIFY TRUTH (+5 XP)'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.disputeActionBtn, isLoading && styles.disabledBtn]}
              onPress={() => onDispute?.(issue.id, currentUserId!)}
              disabled={isLoading}
            >
              <Text style={styles.disputeActionText}>DISPUTE REPORT</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasVerified && (
          <View style={styles.feedbackBadge}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill={colors.tabActive}
              />
            </Svg>
            <Text style={styles.feedbackText}>You verified this report</Text>
          </View>
        )}

        {hasDisputed && (
          <View style={styles.disputeFeedbackBadge}>
            <Text style={styles.disputeFeedbackText}>🚩 You flagged this report</Text>
          </View>
        )}

        {/* Assigned Authority (if applicable) */}
        {issue.assignedAuthorityName && (
          <View style={styles.authorityCard}>
            <Text style={styles.sectionTitle}>Assigned Authority</Text>
            <View style={styles.authorityInfo}>
              <View style={styles.authorityIcon}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke={colors.brandReward} strokeWidth="2" />
                  <Path d="M12 6v6l4 2" stroke={colors.brandReward} strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </View>
              <View>
                <Text style={styles.authorityName}>{issue.assignedAuthorityName}</Text>
                <Text style={styles.authorityRole}>City Department</Text>
              </View>
            </View>
          </View>
        )}

        {/* Assign to Authority */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            style={[styles.verifyActionBtn, { marginBottom: 8 }]}
            onPress={() => setShowAssignOptions(s => !s)}
          >
            <LinearGradient
              colors={[colors.brandAccent, '#00A896']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.verifyGradient}
            >
              <Text style={styles.verifyActionText}>ASSIGN TO AUTHORITY</Text>
            </LinearGradient>
          </TouchableOpacity>

          {showAssignOptions && (
            <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.card, padding: spacing.sm }}>
              {authorities.length === 0 ? (
                <Text style={{ color: colors.textMuted }}>No authorities available.</Text>
              ) : (
                authorities.map(auth => (
                  <TouchableOpacity
                    key={auth.id}
                    style={{ paddingVertical: spacing.sm }}
                    onPress={async () => {
                      if (assigning) return;
                      setAssigning(true);
                      // assign and create work order
                      assignIssueToAuthority(issue.id, auth.id, `Assigned from app`);
                      setAssigning(false);
                      setShowAssignOptions(false);
                    }}
                  >
                    <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{auth.name}</Text>
                    <Text style={{ color: colors.textSecondary }}>{auth.department}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.label,
    color: colors.textOnDark,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgDarkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.textOnDark,
  },
  scrollContent: {
    flex: 1,
    padding: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.chip,
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs * 0.75,
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: radius.chip,
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs * 0.75,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
  },
  issueTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  issueAddress: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  issueDescription: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  mediaContainer: {
    marginBottom: spacing.lg,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
  },
  verificationCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verificationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.stat,
    color: colors.textPrimary,
    fontSize: 18,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  reporterCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.xs,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reporterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.sm,
  },
  reporterAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  reporterName: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  reporterTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionContainer: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  verifyActionBtn: {
    borderRadius: radius.btn,
    overflow: 'hidden',
  },
  verifyGradient: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  verifyActionText: {
    ...typography.labelLG,
    color: palette.white,
    fontWeight: '800',
  },
  disputeActionBtn: {
    backgroundColor: colors.urgencyHigh + '15',
    borderRadius: radius.btn,
    borderWidth: 1.5,
    borderColor: colors.urgencyHigh,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  disputeActionText: {
    ...typography.labelLG,
    color: colors.urgencyHigh,
    fontWeight: '800',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  feedbackBadge: {
    backgroundColor: colors.tabActive + '15',
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.tabActive,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  feedbackText: {
    ...typography.caption,
    color: colors.tabActive,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  disputeFeedbackBadge: {
    backgroundColor: colors.urgencyHigh + '15',
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.urgencyHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  disputeFeedbackText: {
    ...typography.caption,
    color: colors.urgencyHigh,
    fontWeight: '700',
  },
  authorityCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.xs,
  },
  authorityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  authorityName: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  authorityRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

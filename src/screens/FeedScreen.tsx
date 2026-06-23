import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { IssueCategory, IssueStatus, UrgencyLevel } from '@appTypes/index';
import { ISSUE_CATEGORIES } from '@constants/index';

type FilterType = 'all' | 'pending' | 'verified' | 'resolved';

export default function FeedScreen() {
  const { issues, user, verifyIssue, disputeIssue } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredIssues = issues.filter(issue => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return issue.status === 'pending';
    if (activeFilter === 'verified') return issue.status === 'verified' || issue.status === 'in_progress';
    if (activeFilter === 'resolved') return issue.status === 'resolved';
    return true;
  });

  const getUrgencyStyles = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical':
        return { bg: colors.urgencyCritical + '15', border: colors.urgencyCritical, text: colors.urgencyCritical };
      case 'high':
        return { bg: colors.urgencyHigh + '15', border: colors.urgencyHigh, text: colors.textWarning };
      case 'medium':
        return { bg: colors.urgencyMedium + '10', border: colors.urgencyMedium, text: colors.textWarning };
      default:
        return { bg: colors.urgencyLow + '15', border: colors.urgencyLow, text: colors.urgencyLow };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'PENDING VERIFICATION';
      case 'verified': return 'COMMUNITY VERIFIED';
      case 'in_progress': return 'WORK IN PROGRESS';
      case 'resolved': return 'RESOLVED';
      case 'disputed': return 'UNDER REVIEW';
      default: return status.toUpperCase();
    }
  };

  const getCategoryDetails = (categoryName: IssueCategory) => {
    const found = ISSUE_CATEGORIES.find(c => c.value === categoryName);
    return found || { label: 'General', icon: 'alert-outline', color: '#95A5A6' };
  };

  const renderIssueItem = ({ item }: { item: typeof issues[0] }) => {
    const urgency = getUrgencyStyles(item.urgency);
    const cat = getCategoryDetails(item.category);
    const hasVerified = user ? item.verifiedByIds.includes(user.id) : false;
    const hasDisputed = user ? item.disputedByIds.includes(user.id) : false;

    return (
      <View style={styles.card}>
        {/* Card Header: Category & Urgency */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <View style={[styles.catIconCircle, { backgroundColor: cat.color + '20' }]}>
              <View style={[styles.catInnerDot, { backgroundColor: cat.color }]} />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </View>
          
          <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg, borderColor: urgency.border }]}>
            <Text style={[styles.urgencyText, { color: urgency.text }]}>{item.urgency.toUpperCase()}</Text>
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.cardBody}>
          <Text style={styles.issueTitle}>{item.title}</Text>
          <Text style={styles.issueAddress}>📍 {item.address}</Text>
          <Text style={styles.issueDesc} numberOfLines={3}>{item.description}</Text>

          {item.media.length > 0 && (
            <Image source={{ uri: item.media[0].uri }} style={styles.issueImage} />
          )}
        </View>

        {/* Civic Consensus Status Block */}
        <View style={styles.consensusBlock}>
          <View style={styles.consensusHeader}>
            <Text style={styles.statusLabel}>{getStatusLabel(item.status)}</Text>
            <Text style={styles.verificationCount}>
              {item.verificationCount} verification{item.verificationCount !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {/* Consensus progress bar */}
          <View style={styles.consensusProgressBg}>
            <View 
              style={[
                styles.consensusProgressFill, 
                { 
                  width: `${Math.min(100, (item.verificationCount / 3) * 100)}%`,
                  backgroundColor: item.isVerified ? colors.tabActive : colors.brandReward
                }
              ]} 
            />
          </View>
        </View>

        {/* Card Actions: Verify / Dispute */}
        {user && item.reportedById !== user.id && item.status !== 'resolved' && (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                styles.verifyBtn,
                hasVerified && styles.alreadyVerifiedBtn
              ]}
              onPress={() => verifyIssue(item.id, user.id)}
              disabled={hasVerified || hasDisputed}
            >
              <Text style={[styles.verifyBtnText, hasVerified && styles.alreadyVerifiedText]}>
                {hasVerified ? '✓ VERIFIED' : 'VERIFY TRUTH'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                styles.disputeBtn,
                hasDisputed && styles.alreadyDisputedBtn
              ]}
              onPress={() => disputeIssue(item.id, user.id)}
              disabled={hasVerified || hasDisputed}
            >
              <Text style={[styles.disputeBtnText, hasDisputed && styles.alreadyDisputedText]}>
                {hasDisputed ? 'FLAGGED' : 'DISPUTE REPORT'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Card Footer: Metadata */}
        <View style={styles.cardFooter}>
          <View style={styles.reporterInfo}>
            {item.reportedByAvatar ? (
              <Image source={{ uri: item.reportedByAvatar }} style={styles.reporterAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <Text style={styles.reporterName}>by {item.reportedByName}</Text>
          </View>

          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      
      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {(['all', 'pending', 'verified', 'resolved'] as FilterType[]).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.activeFilterTabText
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Issues FlatList */}
      <FlatList
        data={filteredIssues}
        keyExtractor={item => item.id}
        renderItem={renderIssueItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No civic reports found in this sector.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.screenH,
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  filterTab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.chip,
  },
  activeFilterTab: {
    backgroundColor: colors.brandAccent + '30',
  },
  filterTabText: {
    ...typography.labelSM,
    color: colors.textOnDarkMuted,
    fontWeight: '700',
  },
  activeFilterTabText: {
    color: colors.brandAccent,
  },
  listContent: {
    padding: spacing.screenH,
    paddingBottom: spacing.screenV * 2,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.cardPadH,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  catInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryLabel: {
    ...typography.labelSM,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  urgencyBadge: {
    borderWidth: 1,
    borderRadius: radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  urgencyText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: spacing.md,
  },
  issueTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  issueAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  issueDesc: {
    ...typography.bodySM,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  issueImage: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  consensusBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  consensusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  statusLabel: {
    ...typography.labelSM,
    fontSize: 9,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  verificationCount: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
  },
  consensusProgressBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  consensusProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtn: {
    backgroundColor: colors.brandAccent + '15',
    marginRight: spacing.xs,
  },
  alreadyVerifiedBtn: {
    backgroundColor: colors.tabActive,
  },
  verifyBtnText: {
    ...typography.btn,
    color: colors.brandAccent,
    fontWeight: '800',
  },
  alreadyVerifiedText: {
    color: palette.white,
  },
  disputeBtn: {
    backgroundColor: colors.border,
    marginLeft: spacing.xs,
  },
  alreadyDisputedBtn: {
    backgroundColor: colors.urgencyCritical,
  },
  disputeBtnText: {
    ...typography.btn,
    color: colors.textSecondary,
    fontWeight: '800',
  },
  alreadyDisputedText: {
    color: palette.white,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reporterAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: spacing.xs,
  },
  avatarPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.border,
    marginRight: spacing.xs,
  },
  reporterName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});

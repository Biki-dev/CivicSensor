import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { typography } from '@theme/typography';
import { radius, spacing } from '@theme/spacing';
import { colors } from '@theme/colors';
import {
  urgencyColor,
  urgencyLabel,
  statusColor,
  statusLabel,
} from '@utils/helpers';
import type { UrgencyLevel, IssueStatus, IssueCategory } from '@appTypes/index';
import { ISSUE_CATEGORIES } from '@constants/index';

// ─── Generic pill ─────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  color: string;          // text + border color
  style?: ViewStyle;
  filled?: boolean;       // filled bg vs outline
  dot?: boolean;          // show leading dot
}

export const Pill: React.FC<PillProps> = ({
  label, color, style, filled = false, dot = false,
}) => (
  <View
    style={[
      styles.pill,
      {
        backgroundColor: filled ? color : `${color}20`,
        borderColor: color,
      },
      style,
    ]}
  >
    {dot && (
      <View style={[styles.dot, { backgroundColor: color }]} />
    )}
    <Text style={[typography.labelSM, { color: filled ? '#fff' : color }]}>
      {label}
    </Text>
  </View>
);

// ─── Urgency pill ─────────────────────────────────────────────────────────────

export const UrgencyPill: React.FC<{ urgency: UrgencyLevel; style?: ViewStyle }> = ({
  urgency, style,
}) => (
  <Pill
    label={urgencyLabel(urgency).toUpperCase()}
    color={urgencyColor(urgency)}
    filled={urgency === 'critical'}
    dot={urgency !== 'critical'}
    style={style}
  />
);

// ─── Status pill ──────────────────────────────────────────────────────────────

export const StatusPill: React.FC<{ status: IssueStatus; style?: ViewStyle }> = ({
  status, style,
}) => (
  <Pill
    label={statusLabel(status).toUpperCase()}
    color={statusColor(status)}
    dot
    style={style}
  />
);

// ─── Category chip ────────────────────────────────────────────────────────────

export const CategoryChip: React.FC<{ category: IssueCategory; style?: ViewStyle }> = ({
  category, style,
}) => {
  const cat = ISSUE_CATEGORIES.find(c => c.value === category);
  if (!cat) return null;
  return (
    <Pill
      label={cat.label}
      color={cat.color}
      style={style}
    />
  );
};

// ─── Count badge (numbers) ────────────────────────────────────────────────────

export const CountBadge: React.FC<{ count: number; color?: string; style?: ViewStyle }> = ({
  count, color = colors.brandAccent, style,
}) => (
  <View style={[styles.countBadge, { backgroundColor: color }, style]}>
    <Text style={[typography.labelSM, { color: '#fff' }]}>
      {count > 99 ? '99+' : count}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.chip,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
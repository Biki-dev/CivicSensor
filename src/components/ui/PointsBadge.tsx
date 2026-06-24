import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, palette } from '@theme/colors';
import { typography } from '@theme/typography';
import { radius, spacing, shadows } from '@theme/spacing';
import { formatPoints } from '@utils/helpers';
import type { Badge } from '@appTypes/index';

// ─── Points indicator (e.g. "+10 pts") ───────────────────────────────────────

interface PointsProps {
  points: number;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const PointsBadge: React.FC<PointsProps> = ({
  points, showSign = true, size = 'md', style,
}) => {
  const isNegative = points < 0;
  const color = isNegative ? colors.textDanger : colors.pointsColor;
  const textStyles = {
    sm: typography.labelSM,
    md: typography.label,
    lg: typography.labelLG,
  }[size];

  return (
    <View style={[styles.pointsBadge, { backgroundColor: `${color}18` }, style]}>
      <Text style={[textStyles, { color, fontWeight: '700' }]}>
        {showSign && !isNegative ? '+' : ''}
        {formatPoints(points)} pts
      </Text>
    </View>
  );
};

// ─── Badge hexagon card ───────────────────────────────────────────────────────

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const rarityGlow: Record<Badge['rarity'], string> = {
  common:    palette.tealVibrant,
  rare:      palette.info,
  epic:      palette.xpPurple,
  legendary: palette.gold,
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge, earned = false, size = 'md', style,
}) => {
  const dim = size === 'sm' ? 56 : 72;
  const glowColor = rarityGlow[badge.rarity];
  const opacity = earned ? 1 : 0.35;

  return (
    <View
      style={[
        styles.badgeCard,
        {
          width: dim,
          height: dim,
          borderRadius: dim * 0.22,
          backgroundColor: earned ? `${glowColor}15` : colors.slateMid,
          borderColor: earned ? glowColor : colors.border,
          ...(earned ? { ...shadows.md, shadowColor: glowColor } : {}),
          opacity,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size === 'sm' ? 24 : 30 }}>
        {/* Emoji fallback — replace with VectorIcon in production */}
        {badgeEmoji(badge.id)}
      </Text>
    </View>
  );
};

const badgeEmoji = (id: string): string => {
  const map: Record<string, string> = {
    pothole_patrol:   '🛣️',
    eco_warrior:      '🌿',
    bright_knight:    '💡',
    first_fix:        '✅',
    impact_10:        '🔨',
    impact_50:        '🚀',
    impact_100:       '🏙️',
    the_auditor:      '🔍',
    week_warrior:     '🔥',
    monthly_guardian: '📅',
  };
  return map[id] ?? '🏅';
};

// ─── Rarity label ─────────────────────────────────────────────────────────────

export const RarityLabel: React.FC<{ rarity: Badge['rarity']; style?: ViewStyle }> = ({
  rarity, style,
}) => {
  const color = rarityGlow[rarity];
  const label = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  return (
    <View style={[styles.rarityLabel, { backgroundColor: `${color}20`, borderColor: color }, style]}>
      <Text style={[typography.labelSM, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pointsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.chip,
  },
  badgeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  rarityLabel: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
});